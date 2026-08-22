import { Resend } from "resend";
import { getSupabaseClient } from "@/lib/supabase/client";

// Guarded the same way as api/contact/route.ts — Resend's constructor
// throws immediately on a missing/empty key, so only construct it when the
// key exists.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FARM_NAME = "Freshplug Organics";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

// Own Map, deliberately separate from api/contact/route.ts's — a burst of
// newsletter signups shouldn't eat into (or be capped by) the contact
// form's budget from the same visitor, and vice versa.
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}

function getClientKey(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Backs both newsletter signup forms (homepage, blog sidebar — see
 * NewsletterForm.tsx). Plain insert, not upsert — under RLS, INSERT ...
 * ON CONFLICT DO UPDATE additionally requires a SELECT policy on the
 * table to detect the conflict, and we deliberately don't grant one
 * publicly (it would let anyone list every subscriber's email via the
 * REST API). A repeat signup — including one from someone who'd
 * previously unsubscribed — hits the unique constraint instead, and gets
 * handled below as a separate, explicit update.
 */
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

  const email = (body as { email?: unknown } | null)?.email;
  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return new Response("A valid email address is required.", { status: 400 });
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  if (error && error.code === "23505") {
    // Already have a row for this email — flip it back to subscribed
    // (covers both "already subscribed" and "resubscribing after
    // unsubscribe"). A plain UPDATE only needs the "public unsubscribe"
    // policy's USING clause, not a SELECT policy.
    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({ subscribed: true })
      .eq("email", email);
    if (updateError) {
      console.error("Failed to resubscribe newsletter subscriber:", updateError);
      return new Response("Something went wrong subscribing you — please try again.", { status: 500 });
    }
  } else if (error) {
    console.error("Failed to save newsletter subscriber:", error);
    return new Response("Something went wrong subscribing you — please try again.", { status: 500 });
  }

  // Best-effort welcome email — a missing key or a Resend outage should
  // never turn into a 500 for a visitor who is, in fact, subscribed.
  if (resend) {
    const { error: emailError } = await resend.emails.send({
      from: `${FARM_NAME} <noreply@freshplug.org>`,
      to: email,
      subject: `Welcome to the ${FARM_NAME} newsletter`,
      text: `Thanks for subscribing! You'll hear from us with farm news, seasonal availability, and special offers.`,
    });
    if (emailError) {
      console.error("Failed to send newsletter welcome email:", emailError);
    }
  } else {
    console.warn("RESEND_API_KEY not set — subscriber saved but no welcome email was sent.");
  }

  return new Response(null, { status: 204 });
}
