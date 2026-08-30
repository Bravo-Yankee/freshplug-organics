"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Not hardcoded to 6 — Supabase's email OTP length is a dashboard setting
// (Authentication > Providers > Email), so the client shouldn't assume a
// specific digit count. verifyOtp() is the real source of truth for
// correctness; this is just a sanity check before the network round trip.
const CODE_REGEX = /^\d{6,10}$/;

type Step = "email" | "code";
type Status = "idle" | "submitting" | "error";

/**
 * Passwordless sign-in via an emailed numeric code (verifyOtp), not a
 * clickable magic link — a clickable link is single-use, and email
 * security scanners (Outlook Safe Links and similar) that auto-visit
 * links in incoming mail silently burn the token before the user ever
 * clicks it, producing a confusing "otp_expired" error. Typing a code
 * has no URL for a scanner to consume. Supabase creates the account
 * transparently on first sign-in, so there's no separate signup form.
 */
export function LoginClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const { error } = await getSupabaseClient().auth.signInWithOtp({ email });

      if (error) {
        setErrorMessage("Something went wrong sending your code — please try again.");
        setStatus("error");
        return;
      }

      setStatus("idle");
      setStep("code");
    } catch {
      // A thrown network/timeout error (rather than a returned {error})
      // used to leave status stuck on "submitting" forever, with no way
      // to recover short of a manual page reload.
      setErrorMessage("Something went wrong sending your code — please try again.");
      setStatus("error");
    }
  }

  async function handleCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!CODE_REGEX.test(code)) {
      setErrorMessage("Enter the code from your email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const { error } = await getSupabaseClient().auth.verifyOtp({ email, token: code, type: "email" });

      if (error) {
        setErrorMessage("That code didn't work — check it and try again, or request a new one.");
        setStatus("error");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      // Same reasoning as handleEmailSubmit: a thrown error here used to
      // leave the button stuck on "Verifying..." forever.
      setErrorMessage("Something went wrong verifying your code — please try again.");
      setStatus("error");
    }
  }

  if (step === "code") {
    return (
      <div className="auth-card">
        <h2 style={{ marginBottom: "1rem", color: "var(--charcoal)" }}>Enter your code</h2>
        <p style={{ marginBottom: "2rem", color: "var(--text-light)" }}>
          We sent a code to {email}. Enter it below to sign in.
        </p>

        {status === "error" && (
          <div className="form-error">
            <i className="fas fa-exclamation-circle" /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleCodeSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="code">Verification Code *</label>
            <input
              type="text"
              id="code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={10}
              required
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Verifying...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem" }}>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setStatus("idle");
              setErrorMessage("");
            }}
            style={{ background: "none", border: "none", color: "var(--clay)", cursor: "pointer", padding: 0 }}
          >
            Use a different email
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2 style={{ marginBottom: "1rem", color: "var(--charcoal)" }}>Sign in to your account</h2>
      <p style={{ marginBottom: "2rem", color: "var(--text-light)" }}>
        Enter your email and we&apos;ll send you a code to sign in — no password needed.
      </p>

      {status === "error" && (
        <div className="form-error">
          <i className="fas fa-exclamation-circle" /> {errorMessage}
        </div>
      )}

      <form onSubmit={handleEmailSubmit} noValidate>
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
            "Send Code"
          )}
        </button>
      </form>
    </div>
  );
}
