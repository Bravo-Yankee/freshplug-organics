import { getSupabaseClient } from "@/lib/supabase/client";
import type { BlogCategory, BlogPost } from "@/content/blog";
import type { Category } from "@/content/categories";
import { toCategory, type CategoryRow } from "@/lib/data/products";

// Exported so lib/data/admin.ts can reuse the same row shape/mapping for
// its admin-scoped (server client, sees unpublished rows too) blog reads.
export interface BlogPostRow {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  author: string;
  date: string;
  read_time: number;
  views: number;
  comments: number;
  featured: boolean;
  image: string;
  tags: string[];
  is_published: boolean;
}

export function toBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    author: row.author,
    date: row.date,
    readTime: row.read_time,
    views: row.views,
    comments: row.comments,
    featured: row.featured,
    image: row.image,
    tags: row.tags,
    isPublished: row.is_published,
  };
}

// RLS (see supabase/schema.sql) restricts anon reads to is_published =
// true, so this only ever returns publicly-visible posts — admin pages
// get the full set (published and hidden) via getAllBlogPosts() in
// lib/data/admin.
export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await getSupabaseClient().from("blog_posts").select("*").order("date", { ascending: false });
  if (error) throw error;
  return (data as BlogPostRow[]).map(toBlogPost);
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const { data, error } = await getSupabaseClient().from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toBlogPost(data as BlogPostRow) : null;
}

export interface BlogComment {
  id: number;
  postId: number;
  createdAt: string;
  name: string;
  comment: string;
}

interface BlogCommentRow {
  id: number;
  post_id: number;
  created_at: string;
  name: string;
  comment: string;
}

function toBlogComment(row: BlogCommentRow): BlogComment {
  return {
    id: row.id,
    postId: row.post_id,
    createdAt: row.created_at,
    name: row.name,
    comment: row.comment,
  };
}

// RLS restricts anon reads to is_approved = true (same shape as
// getBlogPosts()'s is_published filter) — email is deliberately not
// selected here, this is the public-facing read used by /blog/[id].
//
// Unlike blog_categories (Phase 9), blog_comments isn't structurally
// load-bearing for this page — a post renders fine with zero comments.
// So, unlike every other lib/data/*.ts read, a missing table (the Phase
// 11 migration hasn't been run yet — see AGENTS.md) degrades to "no
// comments" instead of throwing and hard-failing every /blog/[id]
// prerender the way Phase 9's blog_categories FK dependency did.
export async function getBlogComments(postId: number): Promise<BlogComment[]> {
  const { data, error } = await getSupabaseClient()
    .from("blog_comments")
    .select("id, post_id, created_at, name, comment")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) {
    if (error.code === "PGRST205") {
      console.warn("blog_comments table not found — has the Phase 11 migration been run? Returning no comments.");
      return [];
    }
    throw error;
  }
  return (data as BlogCommentRow[]).map(toBlogComment);
}

// Reuses lib/data/products.ts's toCategory()/CategoryRow — blog_categories
// is a separate table from products' categories, but the row shape
// (slug/label/sort_order/active) is identical, so there's no need for a
// second near-duplicate mapper.
//
// Same RLS shape as getBlogPosts(): anon reads only see active = true.
export async function getBlogCategories(): Promise<Category[]> {
  const { data, error } = await getSupabaseClient().from("blog_categories").select("*").order("sort_order");
  if (error) throw error;
  return (data as CategoryRow[]).map(toCategory);
}
