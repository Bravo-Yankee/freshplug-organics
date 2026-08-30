import { isCurrentUserAdmin } from "@/lib/data/admin";
import { draftAndPolish } from "@/lib/ai/bitdeer";

// The draft+polish chain to Bitdeer can take 45s+ (Qwen3.8-27B's reasoning
// step is highly variable, and a full blog post draft is the longest
// content this route generates) — well past Vercel's 10s default for
// serverless functions. Raise the ceiling for this route specifically.
export const maxDuration = 120;

const SYSTEM_PROMPT =
  "You are a copywriter for Freshplug Organics, a small organic poultry farm in Kenya. Write in a warm, " +
  "straightforward voice aimed at Kenyan customers. Prices are in KSH. Never invent specific facts " +
  "(certifications, delivery areas, guarantees) that weren't given to you in the request.";

interface ProductDescriptionRequest {
  kind: "product-description";
  name: string;
  category?: string;
  price?: string | number;
}

interface NewsletterDraftRequest {
  kind: "newsletter";
  topic: string;
}

interface BlogPostDraftRequest {
  kind: "blog-post";
  topic: string;
}

type DraftRequest = ProductDescriptionRequest | NewsletterDraftRequest | BlogPostDraftRequest;

function isValidRequest(value: unknown): value is DraftRequest {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.kind === "product-description") return typeof v.name === "string" && v.name.trim() !== "";
  if (v.kind === "newsletter" || v.kind === "blog-post") return typeof v.topic === "string" && v.topic.trim() !== "";
  return false;
}

function collapseNewlines(text: string): string {
  return text.trim().replace(/\s*\n+\s*/g, " ");
}

function summarize(text: string, maxLength: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > maxLength ? `${flat.slice(0, maxLength - 3)}...` : flat;
}

// Splits on lines containing only "---". Returns fewer parts than asked
// for whenever the model omits a separator (it does, reliably, often
// enough that every caller below needs its own fallback rather than
// trusting this to always produce the requested shape).
function splitOnSeparators(draft: string): string[] {
  return draft.split(/\n\s*---\s*\n/).map((part) => part.trim());
}

/**
 * Backs the "AI Suggest" (Products tab), "Generate Draft" (Newsletter
 * tab), and "Generate Draft" (Blog tab) buttons in AdminClient.tsx — the
 * free Bitdeer models (DeepSeek-V4-Flash + Qwen3.8-27B, see
 * src/lib/ai/bitdeer.ts) are called server-side only, same reasoning as
 * the Gemini key in /api/chat.
 */
export async function POST(req: Request) {
  if (!(await isCurrentUserAdmin())) {
    return new Response("Not authorized.", { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!isValidRequest(body)) {
    return new Response(
      'Expected a `kind` of "product-description" (with `name`), "newsletter" (with `topic`), or "blog-post" (with `topic`).',
      { status: 400 },
    );
  }

  try {
    if (body.kind === "product-description") {
      const description = await draftAndPolish(
        SYSTEM_PROMPT,
        "Write a single product description (one or two sentences, plain text, no headings) for this shop " +
          `listing:\nName: ${body.name}\nCategory: ${body.category?.trim() || "unspecified"}\n` +
          `Price: ${body.price ? `${body.price} KSH` : "unspecified"}`,
      );
      return Response.json({ description });
    }

    if (body.kind === "newsletter") {
      const draft = await draftAndPolish(
        SYSTEM_PROMPT,
        `Draft a short email newsletter for our subscribers about: ${body.topic}\n\n` +
          'The FIRST LINE of your response must be only the subject (no leading label like "Subject:"). ' +
          'The second line must be exactly "---". Everything after that is the email body as plain text, ' +
          "2-4 short paragraphs, no markdown formatting.",
      );

      const parts = splitOnSeparators(draft);
      let subject: string;
      let messageBody: string;
      if (parts.length >= 2) {
        subject = parts[0];
        messageBody = parts.slice(1).join("\n---\n");
      } else {
        // The model sometimes omits the "---" separator despite the
        // prompt — fall back to first-line-is-subject rather than letting
        // the whole draft become the "subject".
        const newlineIndex = draft.indexOf("\n");
        subject = newlineIndex === -1 ? draft : draft.slice(0, newlineIndex);
        messageBody = newlineIndex === -1 ? draft : draft.slice(newlineIndex + 1);
      }

      // Resend rejects a subject containing a literal newline (422
      // validation_error) — collapse any that survived the split above.
      subject = collapseNewlines(subject);
      messageBody = messageBody.trim() || draft.trim();

      return Response.json({ subject, body: messageBody });
    }

    // blog-post
    const draft = await draftAndPolish(
      SYSTEM_PROMPT,
      `Draft a blog post for our farm's website about: ${body.topic}\n\n` +
        "Return exactly three parts, each separated by a line containing only \"---\": (1) a short title, " +
        'one line, no leading label like "Title:"; (2) a one-sentence excerpt summarizing the post, plain ' +
        "text; (3) the full article body, 4-8 short paragraphs, plain text, no markdown formatting.",
    );

    const parts = splitOnSeparators(draft);
    let title: string;
    let excerpt: string;
    let content: string;
    if (parts.length >= 3) {
      title = parts[0];
      excerpt = parts[1];
      content = parts.slice(2).join("\n---\n");
    } else if (parts.length === 2) {
      // Got a title/body split but the model merged the excerpt into one
      // of them — derive it from the body rather than lose it entirely.
      title = parts[0];
      content = parts[1];
      excerpt = summarize(content, 180);
    } else {
      const newlineIndex = draft.indexOf("\n");
      title = newlineIndex === -1 ? draft : draft.slice(0, newlineIndex);
      content = newlineIndex === -1 ? draft : draft.slice(newlineIndex + 1);
      excerpt = summarize(content, 180);
    }

    title = collapseNewlines(title);
    excerpt = collapseNewlines(excerpt);
    content = content.trim() || draft.trim();

    return Response.json({ title, excerpt, content });
  } catch (err) {
    console.error("AI draft request failed:", err);
    return new Response("The AI draft assistant is temporarily unavailable — please try again.", { status: 500 });
  }
}
