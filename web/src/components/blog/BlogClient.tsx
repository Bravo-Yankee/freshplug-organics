"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogCategory, BlogPost } from "@/content/blog";
import type { Category } from "@/content/categories";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

const POSTS_PER_PAGE = 5;

const popularTags = [
  "organic farming",
  "free range",
  "chicken care",
  "fresh eggs",
  "sustainable",
  "poultry health",
  "farm to table",
  "nutrition",
  "recipes",
  "farming tips",
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Fallback only — a category that's been deleted from blog_categories out
// from under an existing post (Studio-only; /admin only hides, never
// deletes) would otherwise render with no label at all.
function formatCategoryName(category: string) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function BlogClient({ posts: blogPosts, categories }: { posts: BlogPost[]; categories: Category[] }) {
  const categoryFilters: { key: BlogCategory | "all"; label: string }[] = [
    { key: "all", label: "All Posts" },
    ...categories.map((category) => ({ key: category.slug, label: category.label })),
  ];
  function categoryLabel(slug: string): string {
    return categories.find((c) => c.slug === slug)?.label ?? formatCategoryName(slug);
  }
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of blogPosts) {
      counts[post.category] = (counts[post.category] ?? 0) + 1;
    }
    return counts;
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term) {
      return blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.tags.some((tag) => tag.toLowerCase().includes(term)) ||
          post.author.toLowerCase().includes(term),
      );
    }
    return activeCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory, search, blogPosts]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const postsToShow = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const recentPosts = useMemo(
    () =>
      [...blogPosts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [blogPosts],
  );

  function selectCategory(category: BlogCategory | "all") {
    setActiveCategory(category);
    setSearch("");
    setPage(1);
  }

  function selectTag(tag: string) {
    setSearch(tag);
    setPage(1);
  }

  const pageButtons: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pageButtons.push(i);
    } else if (pageButtons[pageButtons.length - 1] !== "…") {
      pageButtons.push("…");
    }
  }

  return (
    <div className="blog-container">
      <div className="blog-main">
        <div className="blog-filters">
          {categoryFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`blog-filter${activeCategory === filter.key && !search ? " active" : ""}`}
              onClick={() => selectCategory(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="blog-posts">
          {postsToShow.length === 0 && (
            <div className="no-posts">
              <i className="fas fa-search" style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }} />
              <h3>No posts found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {postsToShow.map((post) => (
            <article className="blog-post" key={post.id} data-category={post.category}>
              <div className="blog-post-image">
                <Image src={post.image} alt={post.title} width={600} height={250} />
                <div className="blog-category">{categoryLabel(post.category)}</div>
                <div className="blog-date">{formatDate(post.date)}</div>
              </div>
              <div className="blog-content">
                <h2 className="blog-title">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <div className="blog-meta">
                  <div className="blog-author">
                    <i className="fas fa-user" />
                    <span>By {post.author}</span>
                  </div>
                  <div className="blog-stats">
                    <div className="blog-stat">
                      <i className="fas fa-clock" />
                      <span>{post.readTime} min read</span>
                    </div>
                    <div className="blog-stat">
                      <i className="fas fa-eye" />
                      <span>{post.views}</span>
                    </div>
                    <div className="blog-stat">
                      <i className="fas fa-comments" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
                <p className="blog-excerpt">{post.excerpt}</p>
                <Link href={`/blog/${post.id}`} className="read-more">
                  Read More <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <i className="fas fa-chevron-left" /> Previous
            </button>
            <div className="page-numbers">
              {pageButtons.map((entry, index) =>
                entry === "…" ? (
                  <span key={`ellipsis-${index}`} style={{ padding: "0 0.5rem" }}>
                    ...
                  </span>
                ) : (
                  <button
                    key={entry}
                    type="button"
                    className={currentPage === entry ? "active" : ""}
                    onClick={() => setPage(entry)}
                  >
                    {entry}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <i className="fas fa-chevron-right" />
            </button>
          </div>
        )}
      </div>

      <div className="blog-sidebar">
        <div className="sidebar-widget search-widget">
          <h3 className="widget-title">Search Blog</h3>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="sidebar-widget">
          <h3 className="widget-title">Categories</h3>
          <ul className="categories-list">
            {categoryFilters
              .filter((c) => c.key !== "all")
              .map((category) => (
                <li key={category.key}>
                  <button type="button" onClick={() => selectCategory(category.key)}>
                    {category.label}{" "}
                    <span className="category-count">{categoryCounts[category.key] ?? 0}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="sidebar-widget">
          <h3 className="widget-title">Recent Posts</h3>
          <div className="recent-posts">
            {recentPosts.map((post) => (
              <div className="recent-post" key={post.id}>
                <div className="recent-post-image">
                  <Image src={post.image} alt={post.title} width={60} height={60} />
                </div>
                <div className="recent-post-content">
                  <Link href={`/blog/${post.id}`}>
                    <h4>{post.title}</h4>
                  </Link>
                  <div className="recent-post-date">{formatDate(post.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-widget">
          <h3 className="widget-title">Popular Tags</h3>
          <div className="tags-cloud">
            {popularTags.map((tag) => (
              <button type="button" className="tag" key={tag} onClick={() => selectTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-widget newsletter-widget">
          <h3 className="widget-title">Stay Updated</h3>
          <p style={{ marginBottom: "1rem", opacity: 0.9 }}>
            Get the latest farm updates and tips delivered to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
