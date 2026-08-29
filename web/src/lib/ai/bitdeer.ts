const BITDEER_ENDPOINT = "https://api-inference.bitdeer.ai/v1/chat/completions";

interface BitdeerMessage {
  role: "system" | "user";
  content: string;
}

// Per-call ceiling, not a target — a completion that finishes early (the
// normal case) returns well under this. It has to be generous because
// Qwen3.8-27B is a reasoning model that spends hidden "thinking" tokens
// before any visible output: measured against Bitdeer directly, the same
// review prompt returned empty content (finish_reason "length") at 600
// tokens but 163 characters of real output at 3000 (using 426 of them) —
// the reasoning length varies run to run, so there's no safe low number.
const MAX_TOKENS: Record<string, number> = {
  "deepseek-ai/DeepSeek-V4-Flash": 1200,
  "Qwen/Qwen3.8-27B": 4000,
};

// One call can legitimately take 15-25s+ (reasoning) on top of the other —
// abort well before Vercel's function timeout (see `maxDuration` on the
// route) so a stuck call fails with a clear error instead of hanging.
const CALL_TIMEOUT_MS = 55_000;

async function callBitdeer(model: string, messages: BitdeerMessage[]): Promise<string> {
  const apiKey = process.env.BITDEER_API_KEY;
  if (!apiKey) throw new Error("BITDEER_API_KEY is not configured.");

  const response = await fetch(BITDEER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: MAX_TOKENS[model] ?? 1200,
      temperature: 0.7,
      top_p: 1.0,
      stream: false,
    }),
    signal: AbortSignal.timeout(CALL_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Bitdeer request failed (${response.status}): ${await response.text()}`);
  }

  const data = await response.json();
  const choice = data?.choices?.[0];
  const content = choice?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error(
      `Bitdeer response had no message content (finish_reason: ${choice?.finish_reason ?? "unknown"}, ` +
        `completion_tokens: ${data?.usage?.completion_tokens ?? "unknown"}).`,
    );
  }
  return content.trim();
}

/**
 * DeepSeek-V4-Flash drafts, then Qwen3.8-27B reviews and tightens that
 * draft — both are promotional $0 models on Bitdeer right now, so chaining
 * them costs nothing extra over a single call and gives a cheap second pass
 * for tone/clarity before an admin sees the result. Expect the combined
 * call to take anywhere from ~10s to ~45s — Qwen's reasoning step in
 * particular is highly variable.
 */
export async function draftAndPolish(systemPrompt: string, userPrompt: string): Promise<string> {
  const draft = await callBitdeer("deepseek-ai/DeepSeek-V4-Flash", [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  return callBitdeer("Qwen/Qwen3.8-27B", [
    {
      role: "system",
      content: `${systemPrompt} You are editing a colleague's draft for clarity, tone, and correctness. Return only the improved text — no commentary, no headings, no quotation marks around it.`,
    },
    { role: "user", content: `Draft to review and tighten:\n\n${draft}` },
  ]);
}
