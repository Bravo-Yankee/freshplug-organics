import { createBrowserClient } from "@supabase/ssr";

function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — copy web/.env.example to web/.env.local and fill in your Supabase project credentials.",
    );
  }

  return createBrowserClient(url, anonKey);
}

// Module-level singleton, not a fresh createClient() per call. This file
// is imported independently by ~15 client components (Header,
// BottomTabBar, InactivityLogout, LoginClient, ShopClient, AccountClient,
// wishlist.ts, ...), several of which are mounted simultaneously on the
// same page. Each createBrowserClient() call spins up its own independent
// GoTrueClient with no shared state — mirrors the exact bug fixed in
// lib/supabase/server.ts's getSupabaseServerClient() (see that file's
// comment): independent instances can race to refresh the same
// single-use refresh token, and one instance's session state (e.g.
// Header's signed-in check) can disagree with another's (e.g. a
// just-mounted hook's own auth.getUser() call) purely because they're
// different objects, not because the user's session actually changed.
// One shared instance means one shared GoTrueClient, whose internal
// `refreshingDeferred` already de-dupes concurrent refreshes and whose
// state every caller reads consistently.
//
// Typed via ReturnType<typeof createClient> (our own wrapper, called with
// real arguments below) rather than ReturnType<typeof createBrowserClient>
// directly — the latter resolves createBrowserClient's generics cold
// (no call-site argument inference), which quietly widened the type and
// broke every onAuthStateChange((_, session) => ...) callback's inferred
// parameter types across the app.
let client: ReturnType<typeof createClient> | undefined;

/**
 * Browser client — cookie-backed session (via @supabase/ssr), used from
 * Client Components. The browser always has native WebSocket, so this file
 * doesn't need the Node polyfill that lib/supabase/server.ts carries.
 */
export function getSupabaseClient() {
  if (!client) client = createClient();
  return client;
}
