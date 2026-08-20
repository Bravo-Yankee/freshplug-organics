import { Resend } from "resend";
import { getSupabaseClient } from "@/lib/supabase/client";

// Never exposed to the browser — read only here, server-side. Unlike the
// Gemini client in api/chat/route.ts, Resend's constructor throws
// immediately on a missing/empty key rather than failing lazily on first
// use — that would crash `next build`/every cold start whenever
// RESEND_API_KEY isn't set, so only construct it when the key exists.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FARM_EMAIL = "freshplugorganics@gmail.com";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/**
 * Best-effort per-IP rate limit, same shape as lib/chat/rateLimit.ts but a
 * separate Map — a burst of contact submissions shouldn't eat into (or be
 * capped by) the chat widget's budget from the same visitor, and vice versa.
 */
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

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  subject: string;
  message: string;
}

function isValidPayload(value: unknown): value is ContactPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.firstName === "string" &&
    v.firstName.trim() !== "" &&
    typeof v.lastName === "string" &&
    v.lastName.trim() !== "" &&
    typeof v.email === "string" &&
    EMAIL_REGEX.test(v.email) &&
    typeof v.inquiryType === "string" &&
    v.inquiryType.trim() !== "" &&
    typeof v.subject === "string" &&
    v.subject.trim() !== "" &&
    typeof v.message === "string" &&
    v.message.trim() !== "" &&
    (v.phone === null || v.phone === undefined || typeof v.phone === "string")
  );
}

/**
 * Backs the Contact page form (see ContactForm.tsx). Saves the message to
 * Supabase (same as before — still what /admin's Messages tab reads) and,
 * new here, emails a notification to the farm's inbox so a submission
 * doesn't just sit unseen in a database table until someone opens /admin.
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

  if (!isValidPayload(body)) {
    return new Response("Missing or invalid contact form fields.", { status: 400 });
  }

  const { firstName, lastName, email, phone, inquiryType, subject, message } = body;

  const { error: dbError } = await getSupabaseClient().from("contact_messages").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone: phone || null,
    inquiry_type: inquiryType,
    subject,
    message,
  });

  if (dbError) {
    console.error("Failed to save contact message:", dbError);
    return new Response("Something went wrong saving your message.", { status: 500 });
  }

  // The message is already saved above (and visible in /admin) regardless
  // of what happens here — a missing key or a Resend outage should never
  // turn into a 500 for a visitor whose message was, in fact, recorded.
  if (resend) {
    const { error: emailError } = await resend.emails.send({
      from: "Freshplug Organics Website <onboarding@resend.dev>",
      to: FARM_EMAIL,
      replyTo: email,
      subject: `New website inquiry: ${subject}`,
      text: [
        `From: ${firstName} ${lastName} <${email}>`,
        phone ? `Phone: ${phone}` : null,
        `Inquiry type: ${inquiryType}`,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    if (emailError) {
      console.error("Failed to send contact notification email:", emailError);
    }
  } else {
    console.warn("RESEND_API_KEY not set — contact message saved but no email notification was sent.");
  }

  return new Response(null, { status: 204 });
}
