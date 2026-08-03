import { createClient } from "@supabase/supabase-js";

/**
 * Plain REST client (no @supabase/ssr) — there's no auth/session in this
 * phase, so a single fetch-based client works identically in Server
 * Components and Client Components. Content tables are public-read and
 * orders/contact_messages are public-insert-only, enforced by RLS, not by
 * which context this runs in.
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — copy web/.env.example to web/.env.local and fill in your Supabase project credentials.",
    );
  }

  return createClient(url, anonKey);
}
