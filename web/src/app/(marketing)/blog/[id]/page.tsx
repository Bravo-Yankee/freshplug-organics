import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostById, getBlogPosts, getBlogComments } from "@/lib/data/blog";
import { BlogComments } from "@/components/blog/BlogComments";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ id: String(post.id) }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getBlogPostById(Number(params.id));
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

/**
 * NOTE: the legacy site linked every post to `blog-single.html?id=...`,
 * but that page never existed anywhere in the repo — every "Read More"
 * click 404'd. This is a genuinely new (minimal) page, not a content
 * port.
 */
export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPostById(Number(params.id));
  if (!post) notFound();
  const comments = await getBlogComments(post.id);

  return (
    // This page renders under the marketing layout, whose nav is
    // `position: fixed` (unlike the legal layout's plain in-flow nav) —
    // the top margin below clears it so the title isn't hidden underneath.
    <div className="legal-page" style={{ marginTop: "80px" }}>
      <div className="legal-header">
        <h1>{post.title}</h1>
        <p className="last-updated">
          By {post.author} &middot;{" "}
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}{" "}
          &middot; {post.readTime} min read
        </p>
      </div>

      <div className="legal-content">
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto", borderRadius: "15px", marginBottom: "2rem" }}
        />

        <section className="legal-section">
          <p>
            <strong>{post.excerpt}</strong>
          </p>
          {post.content
            .split(/\n+/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </section>

        <section className="legal-section">
          <h2>Tags</h2>
          <p>{post.tags.join(", ")}</p>
        </section>

        <BlogComments postId={post.id} initialComments={comments} />
      </div>

      <p>
        <Link href="/blog">&larr; Back to all posts</Link>
      </p>
    </div>
  );
}
