"use client";

import { FormEvent, useState } from "react";
import type { BlogComment } from "@/lib/data/blog";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mirrors ContactForm.tsx's shape (guest name/email, no auth) — see
 * AGENTS.md Phase 11. Renders below the post body on /blog/[id]. The
 * page itself is a Server Component with revalidate = 60, so a newly
 * posted comment is appended here optimistically rather than waiting on
 * the next revalidation.
 */
export function BlogComments({ postId, initialComments }: { postId: number; initialComments: BlogComment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const comment = String(formData.get("comment") ?? "").trim();

    if (!name || !email || !comment) {
      setErrorMessage("Please fill in your name, email, and comment.");
      setStatus("error");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    const response = await fetch(`/api/blog/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, comment }),
    });

    if (!response.ok) {
      setErrorMessage("Something went wrong posting your comment — please try again.");
      setStatus("error");
      return;
    }

    const posted = (await response.json()) as BlogComment;
    setComments((current) => [...current, posted]);
    setStatus("idle");
    form.reset();
  }

  return (
    <section className="legal-section">
      <h2>
        Comments{comments.length > 0 ? ` (${comments.length})` : ""}
      </h2>

      {comments.length === 0 ? (
        <p>No comments yet — be the first to share your thoughts.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--light-gray)" }}>
            <p style={{ marginBottom: "0.25rem" }}>
              <strong>{c.name}</strong>{" "}
              <span style={{ color: "var(--gray)", fontSize: "0.85rem" }}>
                {new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </p>
            <p>{c.comment}</p>
          </div>
        ))
      )}

      {status === "error" && (
        <div className="form-error">
          <i className="fas fa-exclamation-circle" /> {errorMessage}
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit} noValidate style={{ marginTop: "1.5rem" }}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="comment-name">Name *</label>
            <input type="text" id="comment-name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="comment-email">Email *</label>
            <input type="email" id="comment-email" name="email" required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="comment-text">Comment *</label>
          <textarea id="comment-text" name="comment" required placeholder="Share your thoughts..." />
        </div>
        <button type="submit" className="submit-btn" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <i className="fas fa-spinner fa-spin" /> Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </button>
      </form>
    </section>
  );
}
