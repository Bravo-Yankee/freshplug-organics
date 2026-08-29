import { isCurrentUserAdmin } from "@/lib/data/admin";
import { draftAndPolish } from "@/lib/ai/bitdeer";

// The draft+polish chain to Bitdeer can take 45s+ (Qwen3.8-27B's reasoning
// step is highly variable) — well past Vercel's 10s default for
// serverless functions. Raise the ceiling for this route specifically.
export const maxDuration = 90;

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

type DraftRequest = ProductDescriptionRequest | NewsletterDraftRequest;

function isValidRequest(value: unknown): value is DraftRequest {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.kind === "product-description") return typeof v.name === "string" && v.name.trim() !== "";
  if (v.kind === "newsletter") return typeof v.topic === "string" && v.topic.trim() !== "";
  return false;
}

/**
 * Backs the "AI Suggest" (Products tab) and "Generate Draft" (Newsletter
 * tab) buttons in AdminClient.tsx — the free Bitdeer models
 * (DeepSeek-V4-Flash + Qwen3.8-27B, see src/lib/ai/bitdeer.ts) are called
 * server-side only, same reasoning as the Gemini key in /api/chat.
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
    return new Response('Expected a `kind` of "product-description" (with `name`) or "newsletter" (with `topic`).', {
      status: 400,
    });
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

    const draft = await draftAndPolish(
      SYSTEM_PROMPT,
      `Draft a short email newsletter for our subscribers about: ${body.topic}\n\n` +
        'The FIRST LINE of your response must be only the subject (no leading label like "Subject:", no ' +
        'punctuation-free requirement, just the line itself). The second line must be exactly "---". ' +
        "Everything after that is the email body as plain text, 2-4 short paragraphs, no markdown formatting.",
    );

    const separatorMatch = draft.match(/\n\s*---\s*\n/);
    let subject: string;
    let messageBody: string;
    if (separatorMatch?.index !== undefined) {
      subject = draft.slice(0, separatorMatch.index);
      messageBody = draft.slice(separatorMatch.index + separatorMatch[0].length);
    } else {
      // The model sometimes omits the "---" separator despite the prompt —
      // fall back to first-line-is-subject rather than letting the whole
      // draft become the "subject" (which is what naively using the first
      // split() chunk would do when there's no delimiter to split on).
      const newlineIndex = draft.indexOf("\n");
      subject = newlineIndex === -1 ? draft : draft.slice(0, newlineIndex);
      messageBody = newlineIndex === -1 ? draft : draft.slice(newlineIndex + 1);
    }

    // Resend rejects a subject containing a literal newline (422
    // validation_error) — collapse any that survived the split above
    // (e.g. the model wrapped its "one line" subject across two anyway).
    subject = subject.trim().replace(/\s*\n+\s*/g, " ");
    messageBody = messageBody.trim() || draft.trim();

    return Response.json({ subject, body: messageBody });
  } catch (err) {
    console.error("AI draft request failed:", err);
    return new Response("The AI draft assistant is temporarily unavailable — please try again.", { status: 500 });
  }
}
