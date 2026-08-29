"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;
const CHECK_INTERVAL_MS = 15_000;
// Throttles localStorage writes — mousemove/scroll fire far more often
// than the timeout resolution actually needs.
const RECORD_THROTTLE_MS = 1_000;
const LAST_ACTIVITY_KEY = "freshplug_last_activity";
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;

/**
 * Signs out any authenticated session — customer or admin, same Supabase
 * auth, no separate admin-only timeout — after INACTIVITY_TIMEOUT_MS with
 * no interaction. Renders nothing; mounted once in the root layout
 * (src/app/layout.tsx) rather than inside Header so it covers every route
 * (marketing and legal layouts alike) without duplicating this in both
 * Header variants.
 *
 * Last-activity timestamp lives in localStorage rather than a per-tab
 * timer, so activity in one tab keeps every open tab signed in — each
 * tab's periodic check reads the shared value instead of just its own.
 */
export function InactivityLogout() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    const signedInRef = { current: false };
    let lastRecordedAt = 0;

    function recordActivity() {
      if (!signedInRef.current) return;
      const now = Date.now();
      if (now - lastRecordedAt < RECORD_THROTTLE_MS) return;
      lastRecordedAt = now;
      try {
        window.localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
      } catch {
        // Ignore quota/availability errors — worst case, this tab's own
        // in-memory activity still resets lastRecordedAt above.
      }
    }

    async function checkInactivity() {
      if (!signedInRef.current) return;
      let lastActivity = Date.now();
      try {
        const stored = window.localStorage.getItem(LAST_ACTIVITY_KEY);
        if (stored) lastActivity = Number(stored);
      } catch {
        // Availability error — fall back to "just active" rather than
        // spuriously signing the user out.
      }
      if (Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS) {
        signedInRef.current = false;
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      signedInRef.current = !!data.user;
      recordActivity();
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      signedInRef.current = !!session?.user;
      recordActivity();
    });

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, recordActivity, { passive: true }));
    const interval = setInterval(checkInactivity, CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, recordActivity));
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
