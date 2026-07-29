import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/content/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: String(post.id) }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const post = blogPosts.find((p) => p.id === Number(params.id));
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

/**
 * NOTE: the legacy site linked every post to `blog-single.html?id=...`,
 * but that page never existed anywhere in the repo — every "Read More"
 * click 404'd. This is a genuinely new (minimal) page, not a content
 * port: real long-form article bodies still need authoring (see
 * src/content/blog.ts) — this shows the metadata plus a clear
 * placeholder rather than leaving the link broken.
 */
export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === Number(params.id));
  if (!post) notFound();

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
          <p>{post.excerpt}</p>
          <p style={{ fontStyle: "italic", color: "var(--text-light)" }}>
            {post.content} Full article content is still being written — check back soon, or{" "}
            <Link href="/contact">get in touch</Link> if you have questions in the meantime.
          </p>
        </section>

        <section className="legal-section">
          <h2>Tags</h2>
          <p>{post.tags.join(", ")}</p>
        </section>
      </div>

      <p>
        <Link href="/blog">&larr; Back to all posts</Link>
      </p>
    </div>
  );
}
