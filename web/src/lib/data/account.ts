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

/**
 * All four functions assume a session already exists — the only caller is
 * the /account Server Component, which redirects to /login first if
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
  if (!data) return null;

  return {
    id: data.id,
    email: user.email ?? "",
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    birthDate: data.birth_date,
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
