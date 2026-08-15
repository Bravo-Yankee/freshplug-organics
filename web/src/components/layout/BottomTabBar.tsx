"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart";

interface Tab {
  label: string;
  href: string;
  icon: string;
  isActive: (pathname: string) => boolean;
}

/**
 * Mobile-only (hidden ≥768px via CSS — desktop already has the full
 * Header nav). Rendered from Footer, same as BackToTop, so it's present
 * on every marketing + legal page. Cart's badge count and Account's
 * destination are both live, matching the same useCart()/auth patterns
 * ShopClient and Header already use elsewhere.
 */
export function BottomTabBar() {
  const pathname = usePathname();
  const cart = useCart();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session?.user));
    return () => subscription.unsubscribe();
  }, []);

  const tabs: Tab[] = [
    { label: "Home", href: "/", icon: "fa-home", isActive: (p) => p === "/" },
    { label: "Shop", href: "/shop", icon: "fa-store", isActive: (p) => p === "/shop" },
    // Never highlighted, even on /shop — it's a persistent shortcut +
    // counter (like Shop's cart sidebar toggle), not a "which section am I
    // in" indicator, so it doesn't double up with the Shop tab lighting up
    // for the same route. The ?cart=open param is read by ShopClient's
    // CartAutoOpen to pop the sidebar straight open on arrival.
    { label: "Cart", href: "/shop?cart=open", icon: "fa-shopping-cart", isActive: () => false },
    {
      label: signedIn ? "Account" : "Login",
      href: signedIn ? "/account" : "/login",
      icon: "fa-user",
      isActive: (p) => p === "/account" || p === "/login",
    },
  ];

  return (
    <nav className="bottom-tabbar" aria-label="Primary">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={`bottom-tabbar-item${tab.isActive(pathname) ? " active" : ""}`}
        >
          <span className="bottom-tabbar-icon">
            <i className={`fas ${tab.icon}`} />
            {tab.label === "Cart" && cart.totalItems > 0 && (
              <span className="bottom-tabbar-badge">{cart.totalItems}</span>
            )}
          </span>
          <span className="bottom-tabbar-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
