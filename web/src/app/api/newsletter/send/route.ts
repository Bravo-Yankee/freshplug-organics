import { Resend } from "resend";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isCurrentUserAdmin } from "@/lib/data/admin";
import { siteConfig } from "@/lib/site-config";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Resend's batch endpoint caps at 100 emails per call.
const BATCH_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

interface SendPayload {
  subject: string;
  body: string;
}

function isValidPayload(value: unknown): value is SendPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.subject === "string" && v.subject.trim() !== "" && typeof v.body === "string" && v.body.trim() !== "";
}

/**
 * Backs the admin dashboard's Newsletter tab compose form (AdminClient.tsx)
 * — the one admin write that can't go through a direct browser-side
 * Supabase call like Products/Categories do, since sending needs the
 * server-only RESEND_API_KEY. Sends one personalized email per subscriber
 * (via Resend's batch endpoint, chunked to its 100-per-call limit) so each
 * includes their own one-click unsubscribe link.
 */
export async function POST(req: Request) {
  if (!(await isCurrentUserAdmin())) {
    return new Response("Not authorized.", { status: 403 });
  }

  if (!resend) {
    return new Response("Email sending isn't configured.", { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!isValidPayload(body)) {
    return new Response("A subject and body are required.", { status: 400 });
  }
  const { subject, body: messageBody } = body;

  const supabase = await getSupabaseServerClient();
  const { data: subscribers, error: fetchError } = await supabase
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token")
    .eq("subscribed", true);

  if (fetchError) {
    console.error("Failed to load newsletter subscribers:", fetchError);
    return new Response("Couldn't load the subscriber list — please try again.", { status: 500 });
  }

  if (subscribers.length === 0) {
    return new Response("There are no active subscribers to send to.", { status: 400 });
  }

  const emails = subscribers.map((subscriber) => {
    const unsubscribeUrl = `${siteConfig.url}/api/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`;
    return {
      from: `${siteConfig.name} <noreply@freshplug.org>`,
      to: subscriber.email,
      subject,
      text: `${messageBody}\n\n---\nDon't want these emails? Unsubscribe: ${unsubscribeUrl}`,
    };
  });

  for (const batch of chunk(emails, BATCH_SIZE)) {
    const { error: sendError } = await resend.batch.send(batch);
    if (sendError) {
      console.error("Failed to send newsletter batch:", sendError);
      return new Response("Something went wrong sending the newsletter — please try again.", { status: 500 });
    }
  }

  const { error: campaignError } = await supabase.from("newsletter_campaigns").insert({
    subject,
    body: messageBody,
    recipient_count: subscribers.length,
  });
  if (campaignError) {
    // The emails already went out above — a failure to log the campaign
    // shouldn't look like the send itself failed.
    console.error("Failed to record newsletter campaign:", campaignError);
  }

  return new Response(null, { status: 204 });
}
