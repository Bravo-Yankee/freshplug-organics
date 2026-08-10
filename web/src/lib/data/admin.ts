import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/cart";

export interface AdminOrder {
  id: number;
  createdAt: string;
  items: CartItem[];
  totalKsh: number;
  customerName: string | null;
  customerPhone: string | null;
  status: "pending" | "confirmed" | "fulfilled" | "cancelled";
  profileId: string | null;
}

export interface ContactMessage {
  id: number;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  subject: string;
  message: string;
}

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenueKsh: number;
  totalMessages: number;
  totalCustomers: number;
}

/**
 * All functions here assume the caller already verified the signed-in user
 * has profiles.is_admin = true (the /admin Server Component does this via
 * isCurrentUserAdmin() before calling any of the others) — RLS (schema.sql)
 * is the real enforcement layer, this is only for a clean redirect instead
 * of a silently-empty dashboard.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  return data?.is_admin ?? false;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await getSupabaseServerClient();

  const [totalOrders, pendingOrders, totalMessages, totalCustomers, revenueRows] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total_ksh"),
  ]);

  if (totalOrders.error) throw totalOrders.error;
  if (pendingOrders.error) throw pendingOrders.error;
  if (totalMessages.error) throw totalMessages.error;
  if (totalCustomers.error) throw totalCustomers.error;
  if (revenueRows.error) throw revenueRows.error;

  return {
    totalOrders: totalOrders.count ?? 0,
    pendingOrders: pendingOrders.count ?? 0,
    totalRevenueKsh: revenueRows.data.reduce((sum, row) => sum + row.total_ksh, 0),
    totalMessages: totalMessages.count ?? 0,
    totalCustomers: totalCustomers.count ?? 0,
  };
}

export async function getAllOrders(): Promise<AdminOrder[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, items, total_ksh, customer_name, customer_phone, status, profile_id")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    items: row.items as CartItem[],
    totalKsh: row.total_ksh,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    status: row.status,
    profileId: row.profile_id,
  }));
}

export async function getAllMessages(): Promise<ContactMessage[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, created_at, first_name, last_name, email, phone, inquiry_type, subject, message")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    inquiryType: row.inquiry_type,
    subject: row.subject,
    message: row.message,
  }));
}

export async function getAllCustomers(): Promise<Customer[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, phone, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    createdAt: row.created_at,
  }));
}
