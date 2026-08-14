import { getSupabaseClient } from "@/lib/supabase/client";
import type { Product, ProductBadge, ProductCategory } from "@/content/products";

interface ProductRow {
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
  weight_pricing: Record<string, { price: number; description: string }>;
  in_stock: boolean;
  featured: boolean;
}

function toProduct(row: ProductRow): Product {
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
    weightPricing:
      row.weight_pricing && Object.keys(row.weight_pricing).length > 0 ? row.weight_pricing : undefined,
    inStock: row.in_stock,
    featured: row.featured,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await getSupabaseClient().from("products").select("*").order("id");
  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}
