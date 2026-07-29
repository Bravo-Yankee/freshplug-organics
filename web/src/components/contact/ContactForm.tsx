"use client";

import { FormEvent, useState } from "react";

const INQUIRY_SUBJECTS: Record<string, string> = {
  order: "Product Order Inquiry",
  wholesale: "Wholesale Partnership Inquiry",
  "farm-visit": "Farm Visit Request",
  general: "General Question",
  feedback: "Feedback/Complaint",
  partnership: "Partnership Opportunity",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Ported from the legacy contact.html inline script. Still a client-only
 * simulated submission (no real send) — wiring this to a real backend
 * endpoint/CRM is follow-up work, not part of the Phase 0 content-parity
 * migration.
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [inquiryType, setInquiryType] = useState("");

  function handleInquiryChange(value: string) {
    setInquiryType(value);
    if (value && !subject) {
      setSubject(INQUIRY_SUBJECTS[value] ?? "");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const requiredFields = ["firstName", "lastName", "email", "inquiryType", "subject", "message"];
    for (const field of requiredFields) {
      const value = formData.get(field);
      if (!value || String(value).trim() === "") {
        setErrorMessage(`Please fill in the ${field} field.`);
        setStatus("error");
        return;
      }
    }

    const email = String(formData.get("email"));
    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStatus("success");
    setSubject("");
    setInquiryType("");
    event.currentTarget.reset();
  }

  return (
    <div className="contact-form">
      <h2 style={{ marginBottom: "2rem", color: "var(--charcoal)" }}>Send us a Message</h2>

      {status === "success" && (
        <div className="form-success">
          <i className="fas fa-check-circle" /> Thank you! Your message has been sent
          successfully. We&apos;ll get back to you within 24 hours.
        </div>
      )}

      {status === "error" && (
        <div className="form-error">
          <i className="fas fa-exclamation-circle" /> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first-name">First Name *</label>
            <input type="text" id="first-name" name="firstName" required />
          </div>
          <div className="form-group">
            <label htmlFor="last-name">Last Name *</label>
            <input type="text" id="last-name" name="lastName" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="inquiry-type">Inquiry Type *</label>
          <select
            id="inquiry-type"
            name="inquiryType"
            required
            value={inquiryType}
            onChange={(event) => handleInquiryChange(event.target.value)}
          >
            <option value="">Select inquiry type</option>
            <option value="order">Product Order</option>
            <option value="wholesale">Wholesale Inquiry</option>
            <option value="farm-visit">Farm Visit Request</option>
            <option value="general">General Question</option>
            <option value="feedback">Feedback/Complaint</option>
            <option value="partnership">Partnership Opportunity</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            placeholder="Brief subject of your inquiry"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            required
            placeholder="Please provide details about your inquiry..."
          />
        </div>

        <button type="submit" className="submit-btn" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <i className="fas fa-spinner fa-spin" /> Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
