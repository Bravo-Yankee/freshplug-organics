import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "@/lib/chat/systemPrompt";
import { getClientKey, isRateLimited } from "@/lib/chat/rateLimit";

// Never exposed to the browser — read only here, server-side.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

function isValidMessages(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return false;
  }
  return value.every(
    (m): m is ChatMessage =>
      !!m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= MAX_MESSAGE_LENGTH,
  );
}

export async function POST(req: Request) {
  const clientKey = getClientKey(req);
  if (isRateLimited(clientKey)) {
    return new Response("Too many requests — please wait a minute and try again.", {
      status: 429,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!isValidMessages(messages)) {
    return new Response("Expected a non-empty `messages` array of {role, content}", {
      status: 400,
    });
  }

  const systemPrompt = await buildSystemPrompt();

  // Gemini has no "assistant" role — prior model turns are role: "model".
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();
  const responseStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const geminiStream = await ai.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents,
          config: { systemInstruction: systemPrompt },
        });
        for await (const chunk of geminiStream) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
