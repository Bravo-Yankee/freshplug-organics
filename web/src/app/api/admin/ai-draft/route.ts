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
        'Return it as exactly two parts separated by a line containing only "---": first a short subject ' +
        "line (no leading label like 'Subject:'), then the email body as plain text, 2-4 short paragraphs, " +
        "no markdown formatting.",
    );

    const [subjectPart, ...bodyParts] = draft.split(/\n?---\n?/);
    const subject = subjectPart.trim();
    const messageBody = bodyParts.join("\n---\n").trim() || draft;

    return Response.json({ subject, body: messageBody });
  } catch (err) {
    console.error("AI draft request failed:", err);
    return new Response("The AI draft assistant is temporarily unavailable — please try again.", { status: 500 });
  }
}
