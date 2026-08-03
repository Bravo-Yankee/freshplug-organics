import { getSupabaseClient } from "@/lib/supabase/client";
import type { BlogCategory, BlogPost } from "@/content/blog";

interface BlogPostRow {
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
}

function toBlogPost(row: BlogPostRow): BlogPost {
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
  };
}

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
