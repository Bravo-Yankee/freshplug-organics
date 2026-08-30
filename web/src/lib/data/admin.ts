import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/cart";
import type { Product } from "@/content/products";
import type { Category } from "@/content/categories";
import type { BlogPost } from "@/content/blog";
import { toProduct, toCategory, type ProductRow, type CategoryRow } from "@/lib/data/products";
import { toBlogPost, type BlogPostRow } from "@/lib/data/blog";

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

// Uses the cookie-backed server client (not lib/data/products.ts's anon
// getProducts()/getCategories()) so RLS's "... or is_admin()" clause
// applies and inactive rows come back too — the whole point of the admin
// product/category tools being able to see what's hidden, not just what's
// live on the storefront.
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("products").select("*").order("id");
  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) throw error;
  return (data as CategoryRow[]).map(toCategory);
}

// Same reasoning as getAllProducts(): the server client sees is_published
// = false rows too (RLS's "... or is_admin()" clause), so /admin's Blog
// tab can find and re-publish a hidden post.
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("blog_posts").select("*").order("date", { ascending: false });
  if (error) throw error;
  return (data as BlogPostRow[]).map(toBlogPost);
}

// Same reasoning as getAllCategories(): the server client sees inactive
// rows too, so /admin's Blog tab can find and re-activate a hidden category.
export async function getAllBlogCategories(): Promise<Category[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("blog_categories").select("*").order("sort_order");
  if (error) throw error;
  return (data as CategoryRow[]).map(toCategory);
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

export interface NewsletterSubscriber {
  id: number;
  createdAt: string;
  email: string;
  subscribed: boolean;
}

export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, created_at, email, subscribed")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    email: row.email,
    subscribed: row.subscribed,
  }));
}

export interface NewsletterCampaign {
  id: number;
  createdAt: string;
  subject: string;
  body: string;
  recipientCount: number;
}

export async function getAllCampaigns(): Promise<NewsletterCampaign[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .select("id, created_at, subject, body, recipient_count")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    subject: row.subject,
    body: row.body,
    recipientCount: row.recipient_count,
  }));
}
