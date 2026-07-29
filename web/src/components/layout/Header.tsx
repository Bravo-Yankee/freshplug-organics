"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type HeaderVariant = "marketing" | "legal";

interface NavItem {
  label: string;
  /** Page route (used everywhere except the homepage's own in-page sections). */
  href: string;
  /** Same-page anchor target, used only when this item renders on the homepage itself. */
  anchor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", anchor: "#home" },
  { label: "About Us", href: "/about", anchor: "#about" },
  { label: "Products", href: "/products", anchor: "#products" },
  { label: "Our Process", href: "/process", anchor: "#process" },
  { label: "Gallery", href: "/gallery", anchor: "#gallery" },
  { label: "Contact", href: "/contact", anchor: "#contact" },
];

interface HeaderProps {
  variant: HeaderVariant;
}

/**
 * Shared nav component replacing the 3 divergent nav implementations that
 * existed across the legacy site's 13 hand-duplicated pages (marketing,
 * app-like, and legal variants — see migration plan). `legal` reproduces
 * the distinct <header class="header"><nav class="nav"> markup/classes
 * that privacy-policy.html and terms-of-service.html used. Active-link and
 * homepage-anchor-vs-page-link logic is derived from the current pathname
 * rather than passed in, so callers just render <Header variant="..." />.
 */
export function Header({ variant }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrollState, setScrollState] = useState<"initial" | "scrolled" | "past100">("initial");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (variant !== "marketing") return;
    const onScroll = () => setScrollState(window.scrollY > 100 ? "past100" : "scrolled");
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const links = NAV_ITEMS.map((item) => ({
    label: item.label,
    href: isHome && item.anchor ? item.anchor : item.href,
    isActive: !isHome && pathname === item.href,
  }));

  // Matches the legacy main.js scroll effect exactly (it mutated inline
  // styles directly, on scroll, rather than toggling a CSS class — so the
  // navbar keeps its CSS-default cream background until the first scroll
  // event of any size, then swaps to one of two white shades).
  const navbarStyle: React.CSSProperties | undefined =
    scrollState === "initial"
      ? undefined
      : scrollState === "past100"
        ? { background: "rgba(255, 255, 255, 0.98)", boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)" }
        : { background: "rgba(255, 255, 255, 0.95)", boxShadow: "none" };

  if (variant === "legal") {
    return (
      <header className="header">
        <nav className="nav">
          <div className="nav-container">
            <Link href="/" className="nav-logo">
              <Image
                src="/assets/images/freshplug-logo.svg"
                alt="Freshplug Organics Poultry Farm"
                className="logo"
                width={40}
                height={40}
              />
            </Link>
            <ul className="nav-menu">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`nav-link${link.isActive ? " active" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="nav-link shop-link">
                  <i className="fas fa-shopping-cart" /> Shop
                </Link>
              </li>
            </ul>
            <button
              type="button"
              aria-label="Toggle navigation menu"
              className="hamburger"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <nav className="navbar" style={navbarStyle}>
      <div className="nav-container">
        <div className="nav-logo">
          <Image
            src="/assets/images/freshplug-logo.svg"
            alt="Freshplug Organics Poultry Farm"
            className="logo"
            width={40}
            height={40}
          />
          <h2>Freshplug Organics</h2>
        </div>
        <ul className={`nav-menu${menuOpen ? " active" : ""}`}>
          {links.map((link) => (
            <li className="nav-item" key={link.label}>
              <Link
                href={link.href}
                className={`nav-link${link.isActive ? " active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="nav-item">
            <Link href="/shop" className="nav-link shop-btn">
              Shop Now
            </Link>
          </li>
        </ul>
        <button
          type="button"
          aria-label="Toggle navigation menu"
          className={`hamburger${menuOpen ? " active" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>
    </nav>
  );
}
