import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// @supabase/supabase-js needs a global WebSocket to exist for its (unused
// here) realtime client, or its constructor throws "native WebSocket not
// found" — see lib/supabase/server.ts for the full explanation. Vercel's
// Edge runtime (where this middleware executes) does NOT reliably provide
// one, and unlike server.ts, this file can't fall back to the Node `ws`
// package: `ws` is a CommonJS Node module that references `__dirname`,
// which doesn't exist in Edge and crashes the middleware outright. Since
// realtime is never actually exercised here (middleware only refreshes the
// session cookie via auth.getUser()), a stub that merely exists — and
// throws clearly if anything ever really tries to use it — is enough.
if (typeof globalThis.WebSocket === "undefined") {
  class UnsupportedEdgeWebSocket {
    constructor() {
      throw new Error("WebSocket is not supported in this Edge Middleware context");
    }
  }
  (globalThis as unknown as { WebSocket: unknown }).WebSocket = UnsupportedEdgeWebSocket;
}

/**
 * Refreshes the Supabase session cookie on every request so it doesn't
 * expire mid-visit — without this, a Server Component could see a stale
 * session between magic-link login and the cookie's natural refresh.
 * Standard @supabase/ssr middleware pattern for Next.js App Router.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // Touches the session so an expired/near-expiry token gets refreshed and
  // the new cookie gets attached to `response` above.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
