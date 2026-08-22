"use client";

import { useState, type FormEvent } from "react";
import type { AdminOrder, AdminStats, ContactMessage, Customer, NewsletterSubscriber, NewsletterCampaign } from "@/lib/data/admin";
import type { Product, ProductBadge } from "@/content/products";
import type { Category } from "@/content/categories";
import { toProduct, type ProductRow } from "@/lib/data/products";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useToast, ToastViewport } from "@/components/ui/Toast";

type Section = "overview" | "orders" | "messages" | "customers" | "products" | "newsletter";

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "fa-chart-bar" },
  { key: "orders", label: "Orders", icon: "fa-shopping-bag" },
  { key: "messages", label: "Messages", icon: "fa-envelope" },
  { key: "customers", label: "Customers", icon: "fa-users" },
  { key: "products", label: "Products", icon: "fa-box" },
  { key: "newsletter", label: "Newsletter", icon: "fa-paper-plane" },
];

const ORDER_STATUSES: AdminOrder["status"][] = ["pending", "confirmed", "fulfilled", "cancelled"];

// No image upload pipeline exists yet — these are the stock photos already
// in the repo, offered as a picklist (via <datalist>, so a free-text path
// still works) rather than asking a non-technical employee to know or type
// an exact file path from scratch.
const PRODUCT_IMAGES = [
  "/assets/images/organic-chicken.jpg",
  "/assets/images/hero-farm.jpg",
  "/assets/images/farm-facility.jpg",
  "/assets/images/farm-landscape.jpg",
  "/assets/images/placeholder.jpg",
];

const PRODUCT_BADGES: ProductBadge[] = ["organic", "fresh"];

function slugify(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptyProductForm = {
  name: "",
  category: "",
  price: "",
  image: "",
  description: "",
  badge: "fresh" as ProductBadge,
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const emptyNewsletterForm = { subject: "", body: "" };

interface AdminClientProps {
  stats: AdminStats;
  orders: AdminOrder[];
  messages: ContactMessage[];
  customers: Customer[];
  products: Product[];
  categories: Category[];
  subscribers: NewsletterSubscriber[];
  campaigns: NewsletterCampaign[];
}

/**
 * Mirrors AccountClient's single-page, nav-driven section layout. Orders,
 * and now Products/Categories, have write paths — Messages and Customers
 * stay read-only, matching the confirmed scope for this pass. Newsletter's
 * subscriber table is likewise read-only (subscribers manage themselves
 * via the unsubscribe link), but its compose/send form is the one admin
 * write that goes through an API route (POST /api/newsletter/send) rather
 * than a direct browser-side Supabase call — sending needs the
 * server-only RESEND_API_KEY.
 */
export function AdminClient({ stats, orders, messages, customers, products, categories, subscribers, campaigns }: AdminClientProps) {
  const { toast, show, dismiss } = useToast();
  const [section, setSection] = useState<Section>("overview");
  const [orderList, setOrderList] = useState(orders);
  const [productList, setProductList] = useState(products);
  const [categoryList, setCategoryList] = useState(categories);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [productForm, setProductForm] = useState(() => ({
    ...emptyProductForm,
    category: categories[0]?.slug ?? "",
  }));
  const [campaignList, setCampaignList] = useState(campaigns);
  const [newsletterForm, setNewsletterForm] = useState(emptyNewsletterForm);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const activeSubscribers = subscribers.filter((subscriber) => subscriber.subscribed);

  async function handleStatusChange(orderId: number, newStatus: AdminOrder["status"]) {
    const { error } = await getSupabaseClient().from("orders").update({ status: newStatus }).eq("id", orderId);

    if (error) {
      show("Couldn't update order status — please try again.", "error");
      return;
    }

    setOrderList((current) => current.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
    show("Order status updated.", "success");
  }

  async function handleAddCategory(event: FormEvent) {
    event.preventDefault();
    const label = newCategoryLabel.trim();
    if (!label) return;
    const slug = slugify(label);
    if (!slug) {
      show("Category name needs at least one letter or number.", "error");
      return;
    }
    const sortOrder = categoryList.length > 0 ? Math.max(...categoryList.map((c) => c.sortOrder)) + 1 : 1;

    const { error } = await getSupabaseClient()
      .from("categories")
      .insert({ slug, label, sort_order: sortOrder, active: true });

    if (error) {
      show(
        error.code === "23505" ? `A category called "${label}" already exists.` : "Couldn't add category — please try again.",
        "error",
      );
      return;
    }

    setCategoryList((current) => [...current, { slug, label, sortOrder, active: true }]);
    setNewCategoryLabel("");
    if (!productForm.category) setProductForm((current) => ({ ...current, category: slug }));
    show(`"${label}" category added.`, "success");
  }

  async function handleToggleCategoryActive(category: Category) {
    const nextActive = !category.active;
    const { error } = await getSupabaseClient().from("categories").update({ active: nextActive }).eq("slug", category.slug);
    if (error) {
      show("Couldn't update category — please try again.", "error");
      return;
    }
    setCategoryList((current) => current.map((c) => (c.slug === category.slug ? { ...c, active: nextActive } : c)));
    show(`"${category.label}" is now ${nextActive ? "visible" : "hidden"} in the shop.`, "success");
  }

  async function updateProduct(id: number, patch: Record<string, unknown>, mapped: Partial<Product>) {
    const { error } = await getSupabaseClient().from("products").update(patch).eq("id", id);
    if (error) {
      show("Couldn't update product — please try again.", "error");
      return;
    }
    setProductList((current) => current.map((p) => (p.id === id ? { ...p, ...mapped } : p)));
  }

  function handleProductCategoryChange(id: number, category: string) {
    updateProduct(id, { category }, { category });
  }

  function handleProductPriceCommit(id: number, rawValue: string) {
    const price = Number(rawValue);
    if (!Number.isFinite(price) || price <= 0) return;
    updateProduct(id, { price }, { price });
  }

  function handleToggleProductStock(product: Product) {
    updateProduct(product.id, { in_stock: !product.inStock }, { inStock: !product.inStock });
  }

  function handleToggleProductActive(product: Product) {
    updateProduct(product.id, { is_active: !product.isActive }, { isActive: !product.isActive });
  }

  async function handleAddProduct(event: FormEvent) {
    event.preventDefault();
    const name = productForm.name.trim();
    const image = productForm.image.trim();
    const description = productForm.description.trim();
    const price = Number(productForm.price);

    if (!name || !productForm.category || !image || !description || !Number.isFinite(price) || price <= 0) {
      show("Fill in name, category, a valid price, image, and description.", "error");
      return;
    }

    const { data, error } = await getSupabaseClient()
      .from("products")
      .insert({
        name,
        category: productForm.category,
        price,
        image,
        description,
        rating: 5,
        review_count: 0,
        badge: productForm.badge,
        options: {},
        in_stock: true,
        is_active: true,
        variant_pricing: {},
      })
      .select()
      .single();

    if (error) {
      show("Couldn't add product — please try again.", "error");
      return;
    }

    setProductList((current) => [...current, toProduct(data as ProductRow)]);
    setProductForm({ ...emptyProductForm, category: productForm.category });
    show(`"${name}" added.`, "success");
  }

  async function handleSendNewsletter(event: FormEvent) {
    event.preventDefault();
    const subject = newsletterForm.subject.trim();
    const body = newsletterForm.body.trim();
    if (!subject || !body) {
      show("Fill in a subject and message before sending.", "error");
      return;
    }

    setSendingNewsletter(true);
    try {
      const response = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });

      if (!response.ok) {
        show("Couldn't send the newsletter — please try again.", "error");
        return;
      }

      setCampaignList((current) => [
        { id: Date.now(), createdAt: new Date().toISOString(), subject, body, recipientCount: activeSubscribers.length },
        ...current,
      ]);
      setNewsletterForm(emptyNewsletterForm);
      show(`Newsletter sent to ${activeSubscribers.length} subscriber${activeSubscribers.length === 1 ? "" : "s"}.`, "success");
    } finally {
      setSendingNewsletter(false);
    }
  }

  return (
    <section className="admin-section-wrapper">
      <div className="container admin-layout">
        <aside className="admin-nav">
          <nav>
            {SECTIONS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`admin-nav-link${section === item.key ? " active" : ""}`}
                onClick={() => setSection(item.key)}
              >
                <i className={`fas ${item.icon}`} /> {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="admin-content">
          {section === "overview" && (
            <div className="admin-card">
              <h2>Overview</h2>
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-shopping-bag" />
                  </div>
                  <div className="stat-number">{stats.totalOrders}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-clock" />
                  </div>
                  <div className="stat-number">{stats.pendingOrders}</div>
                  <div className="stat-label">Pending Orders</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-coins" />
                  </div>
                  <div className="stat-number">KSH {stats.totalRevenueKsh.toLocaleString()}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-envelope" />
                  </div>
                  <div className="stat-number">{stats.totalMessages}</div>
                  <div className="stat-label">Contact Messages</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-users" />
                  </div>
                  <div className="stat-number">{stats.totalCustomers}</div>
                  <div className="stat-label">Customers</div>
                </div>
              </div>
            </div>
          )}

          {section === "orders" && (
            <div className="admin-card">
              <h2>Orders</h2>
              {orderList.length === 0 ? (
                <p className="admin-empty">No orders yet.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>{order.customerName ?? "—"}{order.customerPhone ? ` (${order.customerPhone})` : ""}</td>
                          <td>{order.items.length} items</td>
                          <td>KSH {order.totalKsh.toLocaleString()}</td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(event) => handleStatusChange(order.id, event.target.value as AdminOrder["status"])}
                            >
                              {ORDER_STATUSES.map((status) => (
                                <option value={status} key={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {section === "messages" && (
            <div className="admin-card">
              <h2>Contact Messages</h2>
              {messages.length === 0 ? (
                <p className="admin-empty">No messages yet.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>From</th>
                        <th>Type</th>
                        <th>Subject</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((msg) => (
                        <tr key={msg.id}>
                          <td>{formatDate(msg.createdAt)}</td>
                          <td>
                            {msg.firstName} {msg.lastName}
                            <br />
                            {msg.email}
                            {msg.phone ? <><br />{msg.phone}</> : null}
                          </td>
                          <td>{msg.inquiryType}</td>
                          <td>{msg.subject}</td>
                          <td>{msg.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {section === "customers" && (
            <div className="admin-card">
              <h2>Customers</h2>
              {customers.length === 0 ? (
                <p className="admin-empty">No signed-up customers yet.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id}>
                          <td>
                            {[customer.firstName, customer.lastName].filter(Boolean).join(" ") || "—"}
                          </td>
                          <td>{customer.phone ?? "—"}</td>
                          <td>{formatDate(customer.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {section === "products" && (
            <>
              <div className="admin-card">
                <h2>Categories</h2>
                <p className="admin-hint">
                  Hide a category to pull it — and every product in it — from the shop without deleting anything.
                </p>
                <div className="category-manage-list">
                  {categoryList.map((category) => (
                    <div className="category-manage-row" key={category.slug}>
                      <span className="category-manage-label">{category.label}</span>
                      <button
                        type="button"
                        className={`admin-toggle${category.active ? " on" : ""}`}
                        onClick={() => handleToggleCategoryActive(category)}
                      >
                        {category.active ? "Visible" : "Hidden"}
                      </button>
                    </div>
                  ))}
                </div>
                <form className="admin-inline-form" onSubmit={handleAddCategory}>
                  <input
                    type="text"
                    placeholder="New category, e.g. Dairy"
                    value={newCategoryLabel}
                    onChange={(event) => setNewCategoryLabel(event.target.value)}
                  />
                  <button type="submit" className="submit-btn">
                    Add Category
                  </button>
                </form>
              </div>

              <div className="admin-card" style={{ marginTop: "2rem" }}>
                <h2>Products</h2>
                {productList.length === 0 ? (
                  <p className="admin-empty">No products yet.</p>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price (KSH)</th>
                          <th>Stock</th>
                          <th>Visibility</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productList.map((product) => (
                          <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>
                              <select
                                value={product.category}
                                onChange={(event) => handleProductCategoryChange(product.id, event.target.value)}
                              >
                                {categoryList.map((category) => (
                                  <option value={category.slug} key={category.slug}>
                                    {category.label}
                                    {category.active ? "" : " (hidden)"}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                className="admin-price-input"
                                key={`${product.id}-${product.price}`}
                                defaultValue={product.price}
                                onBlur={(event) => handleProductPriceCommit(product.id, event.target.value)}
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`admin-toggle${product.inStock ? " on" : ""}`}
                                onClick={() => handleToggleProductStock(product)}
                              >
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </button>
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`admin-toggle${product.isActive ? " on" : ""}`}
                                onClick={() => handleToggleProductActive(product)}
                              >
                                {product.isActive ? "Visible" : "Hidden"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <h3 className="admin-subheading">Add a product</h3>
                <form className="admin-form" onSubmit={handleAddProduct}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={productForm.category}
                        onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value }))}
                      >
                        <option value="">Select a category…</option>
                        {categoryList.map((category) => (
                          <option value={category.slug} key={category.slug}>
                            {category.label}
                            {category.active ? "" : " (hidden)"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (KSH)</label>
                      <input
                        type="number"
                        min="1"
                        value={productForm.price}
                        onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Badge</label>
                      <select
                        value={productForm.badge}
                        onChange={(event) =>
                          setProductForm((current) => ({ ...current, badge: event.target.value as ProductBadge }))
                        }
                      >
                        {PRODUCT_BADGES.map((badge) => (
                          <option value={badge} key={badge}>
                            {badge}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image</label>
                    <input
                      list="admin-product-images"
                      type="text"
                      placeholder="/assets/images/placeholder.jpg"
                      value={productForm.image}
                      onChange={(event) => setProductForm((current) => ({ ...current, image: event.target.value }))}
                    />
                    <datalist id="admin-product-images">
                      {PRODUCT_IMAGES.map((src) => (
                        <option value={src} key={src} />
                      ))}
                    </datalist>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </div>
                  <p className="admin-hint">
                    New products start with a default rating and no size/weight options — set those up in Supabase
                    Studio if this product needs them.
                  </p>
                  <button type="submit" className="submit-btn">
                    Add Product
                  </button>
                </form>
              </div>
            </>
          )}

          {section === "newsletter" && (
            <>
              <div className="admin-card">
                <h2>Subscribers</h2>
                <p className="admin-hint">
                  {activeSubscribers.length} active subscriber{activeSubscribers.length === 1 ? "" : "s"}.
                </p>
                {subscribers.length === 0 ? (
                  <p className="admin-empty">No subscribers yet.</p>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Email</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((subscriber) => (
                          <tr key={subscriber.id}>
                            <td>{formatDate(subscriber.createdAt)}</td>
                            <td>{subscriber.email}</td>
                            <td>{subscriber.subscribed ? "Subscribed" : "Unsubscribed"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="admin-card">
                <h2>Send a Newsletter</h2>
                <p className="admin-hint">Sends immediately to every active subscriber by email — this can&apos;t be undone.</p>
                <form className="admin-inline-form" onSubmit={handleSendNewsletter}>
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      value={newsletterForm.subject}
                      onChange={(event) => setNewsletterForm((current) => ({ ...current, subject: event.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      rows={6}
                      value={newsletterForm.body}
                      onChange={(event) => setNewsletterForm((current) => ({ ...current, body: event.target.value }))}
                    />
                  </div>
                  <button type="submit" className="submit-btn" disabled={sendingNewsletter || activeSubscribers.length === 0}>
                    {sendingNewsletter
                      ? "Sending..."
                      : `Send to ${activeSubscribers.length} Subscriber${activeSubscribers.length === 1 ? "" : "s"}`}
                  </button>
                </form>
              </div>

              <div className="admin-card">
                <h2>Past Campaigns</h2>
                {campaignList.length === 0 ? (
                  <p className="admin-empty">No newsletters sent yet.</p>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Subject</th>
                          <th>Recipients</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaignList.map((campaign) => (
                          <tr key={campaign.id}>
                            <td>{formatDate(campaign.createdAt)}</td>
                            <td>{campaign.subject}</td>
                            <td>{campaign.recipientCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ToastViewport toast={toast} onDismiss={dismiss} />
    </section>
  );
}
