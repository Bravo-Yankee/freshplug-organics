import { getSupabaseClient } from "@/lib/supabase/client";
import type { Product, ProductBadge, ProductCategory } from "@/content/products";
import type { Category } from "@/content/categories";

// Exported so lib/data/admin.ts can reuse the same row shape/mapping for
// its admin-scoped (server client, sees inactive rows too) product reads.
export interface ProductRow {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  rating: number;
  review_count: number;
  badge: ProductBadge;
  options: Record<string, string[]>;
  variant_pricing: Record<string, { price: number; description: string }>;
  in_stock: boolean;
  is_active: boolean;
  featured: boolean;
}

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    image: row.image,
    description: row.description,
    rating: row.rating,
    reviewCount: row.review_count,
    badge: row.badge,
    options: row.options,
    variantPricing:
      row.variant_pricing && Object.keys(row.variant_pricing).length > 0 ? row.variant_pricing : undefined,
    inStock: row.in_stock,
    isActive: row.is_active,
    featured: row.featured,
  };
}

// RLS (see supabase/schema.sql) restricts anon reads to is_active = true,
// so this only ever returns publicly-visible products — admin pages get
// the full set (active and inactive) via getAllProducts() in lib/data/admin.
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await getSupabaseClient().from("products").select("*").order("id");
  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}

export interface CategoryRow {
  slug: string;
  label: string;
  sort_order: number;
  active: boolean;
}

export function toCategory(row: CategoryRow): Category {
  return { slug: row.slug, label: row.label, sortOrder: row.sort_order, active: row.active };
}

// Same RLS shape as getProducts(): anon reads only see active = true.
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await getSupabaseClient().from("categories").select("*").order("sort_order");
  if (error) throw error;
  return (data as CategoryRow[]).map(toCategory);
}
