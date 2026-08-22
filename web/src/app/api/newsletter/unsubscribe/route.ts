import { getSupabaseClient } from "@/lib/supabase/client";

/**
 * The link a recipient clicks straight from their email client (see the
 * footer built in api/newsletter/send/route.ts), so this redirects to a
 * page rather than returning JSON. RLS's "public unsubscribe" policy
 * (schema.sql, Phase 6) is deliberately permissive — the unguessable
 * unsubscribe_token is the actual gate on this write, not RLS.
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const redirectUrl = new URL("/unsubscribe", req.url);

  if (!token) {
    redirectUrl.searchParams.set("status", "invalid");
    return Response.redirect(redirectUrl, 302);
  }

  const { data, error } = await getSupabaseClient()
    .from("newsletter_subscribers")
    .update({ subscribed: false })
    .eq("unsubscribe_token", token)
    .select("id");

  if (error) {
    console.error("Failed to process newsletter unsubscribe:", error);
    redirectUrl.searchParams.set("status", "invalid");
    return Response.redirect(redirectUrl, 302);
  }

  redirectUrl.searchParams.set("status", data.length > 0 ? "done" : "invalid");
  return Response.redirect(redirectUrl, 302);
}
