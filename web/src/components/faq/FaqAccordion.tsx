"use client";

import { useMemo, useState } from "react";
import { faqCategories, faqs, type FaqCategory } from "@/content/faqs";

export function FaqAccordion() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const visibleFaqs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = term ? true : activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch =
        !term ||
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <>
      <div className="search-faq">
        <input
          type="text"
          placeholder="Search FAQ..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="faq-categories">
        {faqCategories.map((category) => (
          <button
            key={category.key}
            type="button"
            className={`faq-category${activeCategory === category.key && !search ? " active" : ""}`}
            onClick={() => {
              setActiveCategory(category.key);
              setSearch("");
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="faq-container">
        {visibleFaqs.map((faq) => {
          const isOpen = openQuestion === faq.question;
          return (
            <div className={`faq-item${isOpen ? " active" : ""}`} key={faq.question}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenQuestion(isOpen ? null : faq.question)}
                aria-expanded={isOpen}
              >
                <h3>{faq.question}</h3>
                <i className="fas fa-chevron-down faq-icon" />
              </button>
              {isOpen && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
