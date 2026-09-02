"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { Product, ProductCategory } from "@/content/products";
import type { Category } from "@/content/categories";
import { siteConfig } from "@/lib/site-config";
import { useCart } from "@/lib/cart";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useToast, ToastViewport } from "@/components/ui/Toast";

type SortKey = "name" | "price-low" | "price-high" | "rating";
const SORT_KEYS: SortKey[] = ["name", "price-low", "price-high", "rating"];

// Remembers the last category/sort across navigations — this is a client
// component remounted fresh every time /shop loads, so plain useState alone
// reset to "All Products"/"Name" every time someone left the page and came
// back. Search intentionally isn't persisted — stale typed-in text would
// silently hide products on return, which reads as a bug rather than a
// convenience.
const SHOP_CATEGORY_KEY = "freshplug_shop_category";
const SHOP_SORT_KEY = "freshplug_shop_sort";

function generateStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  return "★".repeat(fullStars) + (halfStar ? "☆" : "");
}

function defaultOptions(options: Record<string, string[]>): Record<string, string> {
  return Object.fromEntries(Object.entries(options).map(([key, values]) => [key, values[0]]));
}

/**
 * Products can price/describe differently per option tier (see
 * Product.variantPricing) — this resolves what should actually be
 * shown/charged for whichever value is currently selected, falling back
 * to the flat price/description for every product that doesn't have
 * variant overrides. A product only ever prices one option group this way
 * (e.g. weight OR age, never both), so checking every selected value
 * against the map is sufficient — at most one will match.
 */
function resolveVariant(product: Product, selected: Record<string, string> | undefined) {
  if (!selected || !product.variantPricing) {
    return { price: product.price, description: product.description };
  }
  const override = Object.values(selected)
    .map((value) => product.variantPricing?.[value])
    .find((tier) => tier !== undefined);
  return {
    price: override?.price ?? product.price,
    description: override?.description ?? product.description,
  };
}

/**
 * Lets the bottom tab bar's Cart link (/shop?cart=open) open the sidebar
 * directly instead of landing here and requiring a second tap on the
 * floating cart-toggle button. Split out into its own component (rather
 * than a hook call in ShopClient directly) because useSearchParams()
 * requires a Suspense boundary on a statically-rendered page — isolating
 * it here means only this invisible piece is gated behind Suspense,
 * instead of delaying the whole product grid behind a fallback.
 */
function CartAutoOpen({ onOpen }: { onOpen: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("cart") === "open") {
      onOpen();
      router.replace("/shop", { scroll: false });
    }
  }, [searchParams, router, onOpen]);

  return null;
}

export function ShopClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const categoryFilters: { key: ProductCategory | "all"; label: string }[] = [
    { key: "all", label: "All Products" },
    ...categories.map((category) => ({ key: category.slug, label: category.label })),
  ];
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");

  useEffect(() => {
    try {
      const storedCategory = window.localStorage.getItem(SHOP_CATEGORY_KEY);
      if (categoryFilters.some((filter) => filter.key === storedCategory)) {
        setActiveCategory(storedCategory as ProductCategory | "all");
      }
      const storedSort = window.localStorage.getItem(SHOP_SORT_KEY);
      if (SORT_KEYS.includes(storedSort as SortKey)) setSortBy(storedSort as SortKey);
    } catch {
      // Corrupt/blocked localStorage — fall back to the defaults.
    }
    // Only ever needs to run once, on mount — categoryFilters is
    // recomputed every render from the categories prop but doesn't change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeCategory(next: ProductCategory | "all") {
    setActiveCategory(next);
    try {
      window.localStorage.setItem(SHOP_CATEGORY_KEY, next);
    } catch {
      // Ignore quota/availability errors — in-memory state still updates.
    }
  }

  function changeSort(next: SortKey) {
    setSortBy(next);
    try {
      window.localStorage.setItem(SHOP_SORT_KEY, next);
    } catch {
      // Ignore quota/availability errors — in-memory state still updates.
    }
  }
  // Stored as the raw typed string (not a number) so the field can go
  // through an empty/partial state while the customer is typing — e.g.
  // backspacing "1" to type "15" — without every keystroke snapping back
  // to a clamped value first. Parsed/clamped via quantityFor() wherever a
  // real number is needed, and normalized back to a valid string onBlur.
  const [quantities, setQuantities] = useState<Record<number, string>>(
    () => Object.fromEntries(products.map((p) => [p.id, "1"])),
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<number, Record<string, string>>>(
    () => Object.fromEntries(products.map((p) => [p.id, defaultOptions(p.options)])),
  );
  const [cartOpen, setCartOpen] = useState(false);
  const cartSidebarRef = useRef<HTMLDivElement>(null);
  const cartToggleRef = useRef<HTMLButtonElement>(null);

  const cart = useCart();
  const { toast, show, dismiss } = useToast();

  const filteredProducts = useMemo(() => {
    let list = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);
    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
      );
    }
    const sorted = [...list];
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
    }
  }, [activeCategory, search, sortBy, products]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        cartOpen &&
        cartSidebarRef.current &&
        !cartSidebarRef.current.contains(target) &&
        !cartToggleRef.current?.contains(target)
      ) {
        setCartOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [cartOpen]);

  function quantityFor(productId: number): number {
    return Math.max(1, parseInt(quantities[productId], 10) || 1);
  }

  function changeQuantity(productId: number, delta: number) {
    setQuantities((current) => ({
      ...current,
      [productId]: String(Math.max(1, quantityFor(productId) + delta)),
    }));
  }

  function handleAddToCart(productId: number) {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.inStock) return;
    const quantity = quantityFor(productId);
    const options = selectedOptions[productId] ?? {};
    const { price } = resolveVariant(product, options);
    cart.addItem({ ...product, price }, quantity, options);
    show(`${product.name} added to cart!`, "success");
    setQuantities((current) => ({ ...current, [productId]: "1" }));
  }

  function handleRemoveFromCart(index: number) {
    cart.removeItem(index);
    show("Item removed from cart", "success");
  }

  async function handleCheckout() {
    if (cart.items.length === 0) {
      show("Your cart is empty!", "error");
      return;
    }

    const orderSummary = `Order Summary:\n${cart.items
      .map((item) => `${item.name} (${item.quantity}x) - KSH ${(item.price * item.quantity).toLocaleString()}`)
      .join("\n")}\n\nTotal: KSH ${cart.totalPrice.toLocaleString()}\n\nWould you like to proceed with WhatsApp checkout?`;

    if (!window.confirm(orderSummary)) return;

    const whatsappMessage = `Hello! I'd like to place an order:\n\n${cart.items
      .map((item) => {
        const optionsText = Object.entries(item.options)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        return `${item.name}${optionsText ? ` (${optionsText})` : ""} - Qty: ${item.quantity} - KSH ${(item.price * item.quantity).toLocaleString()}`;
      })
      .join("\n")}\n\nTotal: KSH ${cart.totalPrice.toLocaleString()}\n\nPlease confirm availability and delivery details.`;

    // Open the tab synchronously (before the await below) so the browser
    // still treats it as a direct result of the user's click — an await
    // in between would break that gesture chain and risk a popup blocker.
    const waWindow = window.open("", "_blank");

    const { error } = await getSupabaseClient()
      .from("orders")
      .insert({ items: cart.items, total_ksh: cart.totalPrice });
    if (error) {
      // Never block WhatsApp checkout on the order record failing to save.
      console.error("Failed to record order in Supabase:", error);
    }

    waWindow?.location.replace(`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`);
    cart.clear();
    setCartOpen(false);
    show("Order sent via WhatsApp! We'll confirm shortly.", "success");
  }

  return (
    <>
      <Suspense fallback={null}>
        <CartAutoOpen onOpen={() => setCartOpen(true)} />
      </Suspense>

      <section className="shop-filters">
        <div className="container">
          <div className="filter-container">
            <div className="filter-tabs">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={`filter-tab${activeCategory === filter.key ? " active" : ""}`}
                  onClick={() => changeCategory(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="search-sort">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <i className="fas fa-search" />
              </div>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(event) => changeSort(event.target.value as SortKey)}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="shop-content">
        <div className="container">
          <div className="products-container">
            {filteredProducts.map((product) => {
              const { price: effectivePrice, description: effectiveDescription } = resolveVariant(
                product,
                selectedOptions[product.id],
              );
              return (
              <div className="product-item" key={product.id} data-category={product.category}>
                <div className={`product-badge ${product.badge}`}>{product.badge}</div>
                <div className="product-image">
                  <Image src={product.image} alt={product.name} width={400} height={250} />
                  <button
                    type="button"
                    className="quick-view"
                    onClick={() => show(`Quick view for ${product.name} - Feature coming soon!`, "info")}
                  >
                    <i className="fas fa-eye" />
                  </button>
                </div>
                <div className="product-details">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{effectiveDescription}</p>
                  <div className="product-meta">
                    <div className="product-price">KSH {effectivePrice.toLocaleString()}</div>
                    <div className="product-rating">
                      <div className="stars">{generateStars(product.rating)}</div>
                      <span className="rating-count">({product.reviewCount})</span>
                    </div>
                  </div>

                  <div className="product-options">
                    {Object.entries(product.options).map(([optionKey, values]) => (
                      <div className="option-group" key={optionKey}>
                        <label className="option-label">{optionKey}:</label>
                        <select
                          className="option-select"
                          value={selectedOptions[product.id]?.[optionKey] ?? values[0]}
                          onChange={(event) =>
                            setSelectedOptions((current) => ({
                              ...current,
                              [product.id]: { ...current[product.id], [optionKey]: event.target.value },
                            }))
                          }
                        >
                          {values.map((value) => (
                            <option value={value} key={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <label className="option-label">
                    {product.category === "eggs" ? "Number of Trays" : "Quantity"}:
                  </label>
                  <div className="quantity-selector">
                    <button type="button" className="quantity-btn" onClick={() => changeQuantity(product.id, -1)}>
                      -
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="quantity-input"
                      value={quantities[product.id] ?? "1"}
                      onChange={(event) => {
                        // Strip anything that isn't a digit as it's typed —
                        // the only way to guarantee decimals/negatives/text
                        // can't get in, rather than trying to reject them
                        // after the fact. Deliberately not clamped to a
                        // minimum here so the field can go empty mid-edit.
                        const digitsOnly = event.target.value.replace(/\D/g, "");
                        setQuantities((current) => ({ ...current, [product.id]: digitsOnly }));
                      }}
                      onBlur={() => {
                        setQuantities((current) => ({ ...current, [product.id]: String(quantityFor(product.id)) }));
                      }}
                    />
                    <button type="button" className="quantity-btn" onClick={() => changeQuantity(product.id, 1)}>
                      +
                    </button>
                  </div>

                  <div className="product-actions">
                    <button
                      type="button"
                      className="add-to-cart"
                      disabled={!product.inStock}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                    <button
                      type="button"
                      className="wishlist-btn"
                      onClick={() => show("Wishlist feature coming soon!", "info")}
                    >
                      <i className="fas fa-heart" />
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="delivery-info">
        <div className="container">
          <h2 className="section-title">Delivery &amp; Pickup Information</h2>
          <div className="delivery-grid">
            <div className="delivery-item">
              <div className="delivery-icon">
                <i className="fas fa-truck" />
              </div>
              <h3>Free Local Delivery</h3>
              <p>Free delivery within 20 miles for orders over KSH 3,000</p>
            </div>
            <div className="delivery-item">
              <div className="delivery-icon">
                <i className="fas fa-clock" />
              </div>
              <h3>Same-Day Pickup</h3>
              <p>Order by 2 PM for same-day pickup at the farm</p>
            </div>
            <div className="delivery-item">
              <div className="delivery-icon">
                <i className="fas fa-leaf" />
              </div>
              <h3>Fresh Guarantee</h3>
              <p>All products guaranteed fresh or your money back</p>
            </div>
            <div className="delivery-item">
              <div className="delivery-icon">
                <i className="fas fa-calendar" />
              </div>
              <h3>Weekly Subscriptions</h3>
              <p>Set up weekly deliveries and save 10%</p>
            </div>
          </div>
        </div>
      </section>

      <button type="button" className="cart-toggle" ref={cartToggleRef} onClick={() => setCartOpen((open) => !open)}>
        <i className="fas fa-shopping-cart" />
        {cart.totalItems > 0 && <span className="cart-count">{cart.totalItems}</span>}
      </button>

      <div className={`cart-sidebar${cartOpen ? " active" : ""}`} ref={cartSidebarRef}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button type="button" className="cart-close" onClick={() => setCartOpen(false)}>
            &times;
          </button>
        </div>
        <div className="cart-items">
          {cart.items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>Your cart is empty</div>
          ) : (
            cart.items.map((item, index) => {
              const optionsText = Object.entries(item.options)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");
              return (
                <div className="cart-item" key={`${item.id}-${JSON.stringify(item.options)}-${index}`}>
                  <Image src={item.image} alt={item.name} width={60} height={60} />
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    {optionsText && <div className="cart-item-options">{optionsText}</div>}
                    <div className="cart-item-price">
                      KSH {item.price.toLocaleString()} x {item.quantity}
                    </div>
                  </div>
                  <button type="button" className="cart-item-remove" onClick={() => handleRemoveFromCart(index)}>
                    &times;
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">Total: KSH {cart.totalPrice.toFixed(2)}</div>
          <button type="button" className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>

      <ToastViewport toast={toast} onDismiss={dismiss} />
    </>
  );
}
