import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client — cookie-backed session (via @supabase/ssr), used from
 * Client Components. The browser always has native WebSocket, so this file
 * doesn't need the Node polyfill that lib/supabase/server.ts carries.
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — copy web/.env.example to web/.env.local and fill in your Supabase project credentials.",
    );
  }

  return createBrowserClient(url, anonKey);
}
