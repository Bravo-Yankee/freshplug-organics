import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// @supabase/supabase-js (which @supabase/ssr wraps) constructs a realtime
// client unconditionally, which requires a native WebSocket global — only
// guaranteed in Node 22+. This file only ever runs server-side (Server
// Components / Route Handlers / middleware), so — unlike lib/supabase/client.ts —
// it always needs this guard rather than dead-code-eliminating it away.
if (typeof globalThis.WebSocket === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  (globalThis as unknown as { WebSocket: unknown }).WebSocket = require("ws").WebSocket;
}

/**
 * Server client — reads/writes the session via Next's cookies() so Server
 * Components and Route Handlers see the same auth state the browser client
 * set. Cookie writes are wrapped in try/catch because Server Components
 * can't set cookies (only Route Handlers/Server Actions can) — middleware.ts
 * is what actually keeps the session cookie refreshed on every request.
 */
export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — copy web/.env.example to web/.env.local and fill in your Supabase project credentials.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — no-op, middleware.ts refreshes instead.
        }
      },
    },
  });
}
