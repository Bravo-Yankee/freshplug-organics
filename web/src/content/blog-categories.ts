import type { Category } from "@/content/categories";

/**
 * Seed input for scripts/seed.ts only, mirroring content/categories.ts
 * (which does the same for products — same generic Category shape, kept
 * as a separate table/file from products' categories since blog topics
 * and shop product lines are different taxonomies). Runtime reads go
 * through getBlogCategories() in @/lib/data/blog, which queries the
 * `blog_categories` table — add/edit categories from /admin's Blog tab
 * (or Supabase Studio), not here.
 */
export const blogCategories: Category[] = [
  { slug: "farming-tips", label: "Farming Tips", sortOrder: 1, active: true },
  { slug: "recipes", label: "Recipes", sortOrder: 2, active: true },
  { slug: "farm-life", label: "Farm Life", sortOrder: 3, active: true },
  { slug: "sustainability", label: "Sustainability", sortOrder: 4, active: true },
  { slug: "health", label: "Health & Nutrition", sortOrder: 5, active: true },
  { slug: "news", label: "Farm News", sortOrder: 6, active: true },
];
