"use client";

import { useCallback, useEffect, useState } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options: Record<string, string>;
}

const CART_STORAGE_KEY = "freshplug_cart";

/**
 * Canonical cart hook — deliberately the ONE cart implementation in the new
 * app, replacing the 3 divergent/unsynchronized cart implementations that
 * existed across the legacy site's main.js, shop.js, and
 * mpesa-integration.js (all writing the same localStorage key with
 * inconsistent item shapes). Still localStorage-backed for Phase 0 content
 * parity — Phase 3 swaps this for server-persisted orders.
 */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // Corrupt/blocked localStorage — start with an empty cart rather than throw.
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota/availability errors — in-memory state still updates.
    }
  }, []);

  const addItem = useCallback(
    (product: { id: number; name: string; price: number; image: string }, quantity: number, options: Record<string, string>) => {
      setItems((current) => {
        const existingIndex = current.findIndex(
          (item) => item.id === product.id && JSON.stringify(item.options) === JSON.stringify(options),
        );
        let next: CartItem[];
        if (existingIndex !== -1) {
          next = current.slice();
          next[existingIndex] = { ...next[existingIndex], quantity: next[existingIndex].quantity + quantity };
        } else {
          next = [...current, { id: product.id, name: product.name, price: product.price, image: product.image, quantity, options }];
        }
        try {
          window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore quota/availability errors — in-memory state still updates.
        }
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback(
    (index: number) => {
      persist(items.filter((_, i) => i !== index));
    },
    [items, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { items, hydrated, addItem, removeItem, clear, totalItems, totalPrice };
}
