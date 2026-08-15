"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 400;

/**
 * Rendered from Footer (marketing + legal, i.e. every long-scroll page) —
 * positioned bottom-left specifically to stay clear of the WhatsApp/chat
 * widget cluster already occupying bottom-right on every page.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="back-to-top"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <i className="fas fa-arrow-up" />
    </button>
  );
}
