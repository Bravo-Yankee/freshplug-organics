import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/cart";

export interface Profile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  birthDate: string | null;
}

export interface Address {
  id: number;
  label: string | null;
  address: string;
  city: string;
  postalCode: string | null;
  isDefault: boolean;
}

export interface Subscription {
  id: number;
  productId: number;
  productName: string;
  frequency: "weekly" | "monthly";
  quantity: number;
  nextDelivery: string | null;
  status: "active" | "paused";
  startDate: string;
}

export interface Order {
  id: number;
  createdAt: string;
  items: CartItem[];
  totalKsh: number;
  status: "pending" | "confirmed" | "fulfilled" | "cancelled";
}

export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  category: string;
}

export interface NotificationPrefs {
  notifyOrderUpdates: boolean;
  notifyPromotions: boolean;
  newsletterSubscribed: boolean;
}

/**
 * Every function below assumes a session already exists — the only caller
 * is the /account Server Component, which redirects to /login first if
 * auth.getUser() comes back empty. They're not meant to be reused from an
 * unauthenticated context.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, phone, birth_date")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;

  // Self-heal: handle_new_user() (Phase 2) only creates this row going
  // forward from when that trigger was added — any account that signed up
  // before then (confirmed live: a real account created 2026-08-08 has no
  // matching profiles row) has nothing here. Previously this silently
  // returned null, which the /account page then treated as "not signed
  // in" and bounced a genuinely authenticated user back to /login with no
  // indication anything was wrong. Phase 13's "own profile insert" RLS
  // policy is what makes this insert possible for a non-admin user.
  const row =
    data ??
    (await (async () => {
      const { data: created, error: insertError } = await supabase
        .from("profiles")
        .insert({ id: user.id })
        .select("id, first_name, last_name, phone, birth_date")
        .single();
      if (insertError) throw insertError;
      return created;
    })());

  return {
    id: row.id,
    email: user.email ?? "",
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    birthDate: row.birth_date,
  };
}

export async function getAddresses(): Promise<Address[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("id, label, address, city, postal_code, is_default")
    .order("is_default", { ascending: false });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    label: row.label,
    address: row.address,
    city: row.city,
    postalCode: row.postal_code,
    isDefault: row.is_default,
  }));
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, product_id, frequency, quantity, next_delivery, status, start_date, products(name)")
    .order("id");
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    productId: row.product_id,
    productName: (row.products as unknown as { name: string } | null)?.name ?? "Unknown product",
    frequency: row.frequency,
    quantity: row.quantity,
    nextDelivery: row.next_delivery,
    status: row.status,
    startDate: row.start_date,
  }));
}

export async function getOrders(): Promise<Order[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, items, total_ksh, status")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    items: row.items as CartItem[],
    totalKsh: row.total_ksh,
    status: row.status,
  }));
}

// Phase 12 — until that migration is run, wishlist_items doesn't exist yet;
// PGRST205 ("table not found") degrades to an empty list rather than a
// thrown 500, same posture as getAllBlogComments() in lib/data/admin.ts.
export async function getWishlist(): Promise<WishlistItem[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("id, product_id, products(id, name, image, price, category)")
    .order("created_at", { ascending: false });
  if (error) {
    if (error.code === "PGRST205") return [];
    throw error;
  }

  return data
    .map((row) => {
      const product = row.products as unknown as { id: number; name: string; image: string; price: number; category: string } | null;
      if (!product) return null;
      return {
        id: row.id,
        productId: row.product_id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
      };
    })
    .filter((item): item is WishlistItem => item !== null);
}

// Phase 12 — profiles.notify_order_updates/notify_promotions and the
// customer-scoped newsletter_subscribers select policy don't exist until
// that migration is run; each query below degrades to a sensible default
// (undefined/23503-style column errors surface as PGRST204, missing-table
// as PGRST205) rather than breaking the whole /account page.
export async function getNotificationPrefs(): Promise<NotificationPrefs> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const defaults: NotificationPrefs = {
    notifyOrderUpdates: true,
    notifyPromotions: false,
    newsletterSubscribed: false,
  };
  if (!user) return defaults;

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("notify_order_updates, notify_promotions")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError && profileError.code !== "PGRST204") throw profileError;

  const { data: subscriberRow, error: subscriberError } = await supabase
    .from("newsletter_subscribers")
    .select("subscribed")
    .eq("email", user.email ?? "")
    .maybeSingle();
  if (subscriberError && subscriberError.code !== "PGRST205") throw subscriberError;

  return {
    notifyOrderUpdates: profileRow?.notify_order_updates ?? defaults.notifyOrderUpdates,
    notifyPromotions: profileRow?.notify_promotions ?? defaults.notifyPromotions,
    newsletterSubscribed: subscriberRow?.subscribed ?? defaults.newsletterSubscribed,
  };
}
