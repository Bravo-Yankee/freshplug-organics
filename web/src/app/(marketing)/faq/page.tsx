import type { Metadata } from "next";
import "@/styles/pages/faq.css";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently Asked Questions about Freshplug Organics Poultry Farm - organic practices, delivery, ordering, and more.",
};

export default function FaqPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our farm and products</p>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
