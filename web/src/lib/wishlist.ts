"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

// Thrown by toggle() so callers (the /shop heart-click handler) can tell
// "genuinely signed out" apart from any other failure and redirect to
// /login only for that case.
export class WishlistNotSignedInError extends Error {}

/**
 * Supabase-backed counterpart to useCart() (lib/cart.ts) — same shape of
 * hook, but wishlist state is per-account (RLS-scoped), not per-browser, so
 * it's fetched/written through the browser Supabase client instead of
 * localStorage. Used by the /shop heart-toggle and the /account Wishlist
 * tab's initial "is this saved" state.
 */
export function useWishlist() {
  const [ids, setIds] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) {
          setIsSignedIn(false);
          setIds(new Set());
          setLoaded(true);
        }
        return;
      }

      const { data, error } = await supabase.from("wishlist_items").select("product_id");
      if (cancelled) return;

      setIsSignedIn(true);
      setProfileId(user.id);
      // A missing table (Phase 12 migration not yet run) degrades to an
      // empty wishlist rather than throwing.
      setIds(error ? new Set() : new Set(data.map((row) => row.product_id as number)));
      setLoaded(true);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(
    async (product: { id: number }) => {
      // Re-verify at call time rather than trusting profileId/isSignedIn
      // from the mount-time load() above — that effect's auth.getUser()
      // call is a network round trip, and a click landing before it
      // resolves would otherwise be misread as "signed out" even though
      // the user genuinely is signed in (confirmed live: clicking the
      // heart within ~1s of /shop loading hit exactly this race).
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new WishlistNotSignedInError();

      if (!isSignedIn) setIsSignedIn(true);
      if (profileId !== user.id) setProfileId(user.id);

      const isSaved = ids.has(product.id);

      setIds((current) => {
        const next = new Set(current);
        if (isSaved) next.delete(product.id);
        else next.add(product.id);
        return next;
      });

      const { error } = isSaved
        ? await supabase.from("wishlist_items").delete().eq("profile_id", user.id).eq("product_id", product.id)
        : await supabase.from("wishlist_items").insert({ profile_id: user.id, product_id: product.id });

      if (error) {
        // Roll back the optimistic update — most likely cause is the
        // Phase 12 migration not having been run yet.
        setIds((current) => {
          const next = new Set(current);
          if (isSaved) next.add(product.id);
          else next.delete(product.id);
          return next;
        });
        throw error;
      }
    },
    [ids, profileId, isSignedIn],
  );

  return { ids, loaded, isSignedIn, toggle };
}
