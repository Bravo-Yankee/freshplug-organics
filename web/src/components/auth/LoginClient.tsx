"use client";

import { FormEvent, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Passwordless sign-in: Supabase creates the account transparently on the
 * first magic link, so there's no separate signup form — the legacy site's
 * default-fake-customer fallback (see customer-account.js) doesn't need a
 * replacement, just a real login.
 */
export function LoginClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    const { error } = await getSupabaseClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setErrorMessage("Something went wrong sending your login link — please try again.");
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="auth-card">
        <div className="form-success">
          <i className="fas fa-check-circle" /> Check your email — we sent a login link to {email}.
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2 style={{ marginBottom: "1rem", color: "var(--charcoal)" }}>Sign in to your account</h2>
      <p style={{ marginBottom: "2rem", color: "var(--text-light)" }}>
        Enter your email and we&apos;ll send you a link to sign in — no password needed.
      </p>

      {status === "error" && (
        <div className="form-error">
          <i className="fas fa-exclamation-circle" /> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <i className="fas fa-spinner fa-spin" /> Sending...
            </>
          ) : (
            "Send Login Link"
          )}
        </button>
      </form>
    </div>
  );
}
