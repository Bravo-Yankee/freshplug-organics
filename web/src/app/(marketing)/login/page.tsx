import type { Metadata } from "next";
import "@/styles/pages/account.css";
import { LoginClient } from "@/components/auth/LoginClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Freshplug Organics account.",
};

export default function LoginPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Sign In</h1>
          <p>Access your orders, subscriptions, and saved addresses</p>
        </div>
      </section>

      <section className="auth-section">
        <div className="container">
          <LoginClient />
        </div>
      </section>
    </>
  );
}
