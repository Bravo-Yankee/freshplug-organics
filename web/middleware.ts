import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Node <22 lacks a native WebSocket global, which @supabase/supabase-js
// needs unconditionally for its (unused here) realtime client. Middleware
// runs in the Edge runtime, which does have native WebSocket, but this
// guard is cheap insurance if that ever changes — see the matching guard
// in lib/supabase/server.ts for the Node-runtime case.
if (typeof globalThis.WebSocket === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  (globalThis as unknown as { WebSocket: unknown }).WebSocket = require("ws").WebSocket;
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
