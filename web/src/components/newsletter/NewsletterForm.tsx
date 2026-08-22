"use client";

import { FormEvent, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shared by the homepage newsletter section and the blog sidebar widget —
 * both render this inside their existing `.newsletter-form` markup, so no
 * new CSS is needed (see legacy.css and pages/blog.css). Wiring follows
 * ContactForm.tsx's pattern: capture event.currentTarget before the
 * `await` below, since React nulls a SyntheticEvent's currentTarget once
 * the event has finished dispatching.
 */
export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      setErrorMessage("Something went wrong — please try again.");
      setStatus("error");
      return;
    }

    setStatus("success");
    form.reset();
  }

  return (
    <>
      <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
        <input type="email" name="email" placeholder="Enter your email address" required disabled={status === "submitting"} />
        <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status === "success" && <p className="newsletter-status">Thanks for subscribing!</p>}
      {status === "error" && <p className="newsletter-status">{errorMessage}</p>}
    </>
  );
}
