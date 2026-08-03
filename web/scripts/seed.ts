/**
 * One-shot bootstrap: copies the hardcoded content arrays in src/content/*.ts
 * into their Supabase tables (see supabase/schema.sql). Safe to re-run
 * (upserts on id) but not meant to be — once tables exist, edit content in
 * Supabase Studio directly, not by re-running this against the source files.
 *
 * Usage: npm run seed   (from web/, after applying supabase/schema.sql and
 * populating .env.local — needs SUPABASE_SERVICE_ROLE_KEY, which bypasses
 * RLS since the content tables have no public insert policy.)
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { products } from "../src/content/products";
import { blogPosts } from "../src/content/blog";
import { galleryPhotos } from "../src/content/gallery";
import { faqs } from "../src/content/faqs";

// Minimal .env.local loader — avoids depending on Node's --env-file flag
// (needs Node 20.6+) or pulling in a dotenv dependency for one script.
function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in web/.env.local — copy web/.env.example and fill in your Supabase project credentials.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

async function seed() {
  const productRows = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.image,
    description: p.description,
    rating: p.rating,
    review_count: p.reviewCount,
    badge: p.badge,
    options: p.options,
    in_stock: p.inStock,
    featured: p.featured,
  }));

  const blogRows = blogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    author: post.author,
    date: post.date,
    read_time: post.readTime,
    views: post.views,
    comments: post.comments,
    featured: post.featured,
    image: post.image,
    tags: post.tags,
  }));

  const tables: { name: string; rows: Record<string, unknown>[] }[] = [
    { name: "products", rows: productRows },
    { name: "blog_posts", rows: blogRows },
    { name: "gallery_photos", rows: galleryPhotos as unknown as Record<string, unknown>[] },
    { name: "faqs", rows: faqs as unknown as Record<string, unknown>[] },
  ];

  for (const table of tables) {
    const { error, count } = await supabase.from(table.name).upsert(table.rows, { onConflict: "id", count: "exact" });
    if (error) {
      console.error(`Failed seeding ${table.name}:`, error.message);
      process.exit(1);
    }
    console.log(`Seeded ${table.name}: ${count ?? table.rows.length} rows`);
  }
}

seed();
