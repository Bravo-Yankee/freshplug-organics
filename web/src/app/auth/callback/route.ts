import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Magic-link landing target (see LoginClient's emailRedirectTo). Exchanges
 * the one-time code for a session cookie, then sends the user on to
 * /account. The handle_new_user trigger (schema.sql) has already created
 * their profile row by the time this runs, on first sign-in.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/account`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
