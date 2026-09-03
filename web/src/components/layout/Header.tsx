"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export type HeaderVariant = "marketing" | "legal";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Our Process", href: "/process" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

interface HeaderProps {
  variant: HeaderVariant;
}

/**
 * Shared nav component replacing the 3 divergent nav implementations that
 * existed across the legacy site's 13 hand-duplicated pages (marketing,
 * app-like, and legal variants — see migration plan). `legal` reproduces
 * the distinct <header class="header"><nav class="nav"> markup/classes
 * that privacy-policy.html and terms-of-service.html used. Active-link
 * logic is derived from the current pathname rather than passed in, so
 * callers just render <Header variant="..." />.
 */
export function Header({ variant }: HeaderProps) {
  const pathname = usePathname();
  const [scrollState, setScrollState] = useState<"initial" | "scrolled" | "past100">("initial");
  const [menuOpen, setMenuOpen] = useState(false);
  // Checked client-side (rather than passed down from a Server Component
  // reading cookies()) so marketing pages keep their static/ISR rendering —
  // a layout that reads the session would force every page under it to
  // render dynamically on every request. Briefly shows "Login" for a
  // signed-in user on first paint before this resolves; acceptable for a
  // low-traffic marketing site.
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session?.user));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (variant !== "marketing") return;
    const onScroll = () => setScrollState(window.scrollY > 100 ? "past100" : "scrolled");
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  // Header lives in the layout, not the page, so it never unmounts between
  // navigations — nothing else ever resets an open mobile menu. Without
  // this, tapping a link inside the open menu navigates to the new page
  // with the menu (and its full-height overlay) still open on top of it.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = NAV_ITEMS.map((item) => ({
    label: item.label,
    href: item.href,
    isActive: pathname === item.href,
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
                src="/assets/images/freshplug-logo-icon.png"
                alt="Freshplug Organics Poultry Farm"
                className="logo"
                width={40}
                height={40}
              />
            </Link>
            <ul className={`nav-menu${menuOpen ? " active" : ""}`}>
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
              <li>
                <Link href={signedIn ? "/account" : "/login"} className="nav-link">
                  <i className="fas fa-user" /> {signedIn ? "My Account" : "Login"}
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
      </header>
    );
  }

  return (
    <nav className="navbar" style={navbarStyle}>
      <div className="nav-container">
        <div className="nav-logo">
          <Image
            src="/assets/images/freshplug-logo-icon.png"
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
          <li className="nav-item">
            <Link href={signedIn ? "/account" : "/login"} className="nav-link">
              <i className="fas fa-user" /> {signedIn ? "My Account" : "Login"}
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
