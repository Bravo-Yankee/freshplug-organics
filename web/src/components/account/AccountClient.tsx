"use client";

import { Fragment, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/content/products";
import type {
  Address,
  NotificationPrefs,
  Order,
  Profile,
  Subscription,
  WishlistItem,
} from "@/lib/data/account";
import { useCart } from "@/lib/cart";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useToast, ToastViewport } from "@/components/ui/Toast";
import { OrderTimeline } from "./OrderTimeline";

type Section =
  | "overview"
  | "profile"
  | "orders"
  | "wishlist"
  | "subscriptions"
  | "addresses"
  | "security"
  | "notifications";

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "fa-th-large" },
  { key: "profile", label: "Profile", icon: "fa-user" },
  { key: "orders", label: "Orders", icon: "fa-shopping-bag" },
  { key: "wishlist", label: "Wishlist", icon: "fa-heart" },
  { key: "subscriptions", label: "Subscriptions", icon: "fa-sync-alt" },
  { key: "addresses", label: "Addresses", icon: "fa-map-marker-alt" },
  { key: "security", label: "Login & Security", icon: "fa-shield-alt" },
  { key: "notifications", label: "Notifications", icon: "fa-bell" },
];

// Remembers the last section across navigations — this is a client component
// remounted fresh every time /account loads, so plain useState alone reset to
// "overview" every time someone left the page and came back.
const ACCOUNT_SECTION_KEY = "freshplug_account_section";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface AccountClientProps {
  profile: Profile;
  addresses: Address[];
  subscriptions: Subscription[];
  orders: Order[];
  products: Product[];
  isAdmin: boolean;
  wishlist: WishlistItem[];
  notificationPrefs: NotificationPrefs;
  memberSince: string;
  lastSignInAt: string | null;
}

/**
 * Single-page, nav-driven sections — mirrors the legacy customer-account.js
 * layout rather than separate routes, matching ShopClient/BlogClient's
 * "one Server page + one big Client component" convention. Writes go
 * straight through the browser Supabase client (same ad-hoc-write pattern
 * as ShopClient.handleCheckout); RLS (schema.sql) is the real trust
 * boundary, not which component issues the request.
 */
export function AccountClient({
  profile,
  addresses,
  subscriptions,
  orders,
  products,
  isAdmin,
  wishlist,
  notificationPrefs,
  memberSince,
  lastSignInAt,
}: AccountClientProps) {
  const router = useRouter();
  const cart = useCart();
  const { toast, show, dismiss } = useToast();
  const [section, setSection] = useState<Section>("overview");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ACCOUNT_SECTION_KEY);
      if (SECTIONS.some((item) => item.key === stored)) setSection(stored as Section);
    } catch {
      // Corrupt/blocked localStorage — fall back to the default section.
    }
  }, []);

  function changeSection(next: Section) {
    setSection(next);
    try {
      window.localStorage.setItem(ACCOUNT_SECTION_KEY, next);
    } catch {
      // Ignore quota/availability errors — in-memory state still updates.
    }
  }

  const [profileForm, setProfileForm] = useState({
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    phone: profile.phone ?? "",
    birthDate: profile.birthDate ?? "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [addressList, setAddressList] = useState(addresses);
  const [addressForm, setAddressForm] = useState({ label: "", address: "", city: "", postalCode: "" });
  const [savingAddress, setSavingAddress] = useState(false);

  const [subscriptionList, setSubscriptionList] = useState(subscriptions);
  const [subscriptionForm, setSubscriptionForm] = useState({
    productId: products[0]?.id ?? 0,
    frequency: "weekly" as "weekly" | "monthly",
    quantity: 1,
  });
  const [savingSubscription, setSavingSubscription] = useState(false);

  const [wishlistList, setWishlistList] = useState(wishlist);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  const [prefs, setPrefs] = useState(notificationPrefs);

  const activeSubscriptionCount = subscriptionList.filter((sub) => sub.status === "active").length;
  const nextDelivery =
    subscriptionList
      .filter((sub) => sub.status === "active" && sub.nextDelivery)
      .map((sub) => sub.nextDelivery as string)
      .sort()[0] ?? null;

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);

    const { error } = await getSupabaseClient()
      .from("profiles")
      .update({
        first_name: profileForm.firstName || null,
        last_name: profileForm.lastName || null,
        phone: profileForm.phone || null,
        birth_date: profileForm.birthDate || null,
      })
      .eq("id", profile.id);

    setSavingProfile(false);

    if (error) {
      show("Couldn't save your profile — please try again.", "error");
      return;
    }
    show("Profile updated successfully!", "success");
    router.refresh();
  }

  async function handleAddAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!addressForm.address || !addressForm.city) {
      show("Address and city are required.", "error");
      return;
    }
    setSavingAddress(true);

    const { data, error } = await getSupabaseClient()
      .from("addresses")
      .insert({
        profile_id: profile.id,
        label: addressForm.label || null,
        address: addressForm.address,
        city: addressForm.city,
        postal_code: addressForm.postalCode || null,
        is_default: addressList.length === 0,
      })
      .select("id, label, address, city, postal_code, is_default")
      .single();

    setSavingAddress(false);

    if (error || !data) {
      show("Couldn't save that address — please try again.", "error");
      return;
    }

    setAddressList((current) => [
      ...current,
      {
        id: data.id,
        label: data.label,
        address: data.address,
        city: data.city,
        postalCode: data.postal_code,
        isDefault: data.is_default,
      },
    ]);
    setAddressForm({ label: "", address: "", city: "", postalCode: "" });
    show("Address added successfully!", "success");
  }

  async function handleSetDefaultAddress(addressId: number) {
    const supabase = getSupabaseClient();
    const [{ error: clearError }, { error: setError }] = await Promise.all([
      supabase.from("addresses").update({ is_default: false }).neq("id", addressId),
      supabase.from("addresses").update({ is_default: true }).eq("id", addressId),
    ]);

    if (clearError || setError) {
      show("Couldn't update your default address — please try again.", "error");
      return;
    }

    setAddressList((current) => current.map((addr) => ({ ...addr, isDefault: addr.id === addressId })));
    show("Default address updated!", "success");
  }

  async function handleDeleteAddress(addressId: number) {
    const { error } = await getSupabaseClient().from("addresses").delete().eq("id", addressId);
    if (error) {
      show("Couldn't remove that address — please try again.", "error");
      return;
    }
    setAddressList((current) => current.filter((addr) => addr.id !== addressId));
    show("Address removed.", "success");
  }

  async function handleAddSubscription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const product = products.find((p) => p.id === subscriptionForm.productId);
    if (!product) return;
    setSavingSubscription(true);

    const { data, error } = await getSupabaseClient()
      .from("subscriptions")
      .insert({
        profile_id: profile.id,
        product_id: product.id,
        frequency: subscriptionForm.frequency,
        quantity: subscriptionForm.quantity,
      })
      .select("id, product_id, frequency, quantity, next_delivery, status, start_date")
      .single();

    setSavingSubscription(false);

    if (error || !data) {
      show("Couldn't set up that subscription — please try again.", "error");
      return;
    }

    setSubscriptionList((current) => [
      ...current,
      {
        id: data.id,
        productId: data.product_id,
        productName: product.name,
        frequency: data.frequency,
        quantity: data.quantity,
        nextDelivery: data.next_delivery,
        status: data.status,
        startDate: data.start_date,
      },
    ]);
    show("Subscription created!", "success");
  }

  async function handleToggleSubscription(subscriptionId: number, currentStatus: "active" | "paused") {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    const { error } = await getSupabaseClient()
      .from("subscriptions")
      .update({ status: nextStatus })
      .eq("id", subscriptionId);

    if (error) {
      show("Couldn't update that subscription — please try again.", "error");
      return;
    }

    setSubscriptionList((current) =>
      current.map((sub) => (sub.id === subscriptionId ? { ...sub, status: nextStatus } : sub)),
    );
    show(`Subscription ${nextStatus === "active" ? "resumed" : "paused"}.`, "success");
  }

  function handleReorder(order: Order) {
    order.items.forEach((item) => {
      cart.addItem(
        { id: item.id, name: item.name, price: item.price, image: item.image },
        item.quantity,
        item.options,
      );
    });
    show(`Added ${order.items.length} item${order.items.length === 1 ? "" : "s"} to your cart.`, "success");
  }

  async function handleRemoveWishlistItem(item: WishlistItem) {
    const { error } = await getSupabaseClient().from("wishlist_items").delete().eq("id", item.id);
    if (error) {
      show("Couldn't remove that item — please try again.", "error");
      return;
    }
    setWishlistList((current) => current.filter((i) => i.id !== item.id));
    show("Removed from wishlist.", "success");
  }

  function handleAddWishlistItemToCart(item: WishlistItem) {
    cart.addItem({ id: item.productId, name: item.name, price: item.price, image: item.image }, 1, {});
    show(`${item.name} added to cart!`, "success");
  }

  async function handleChangeEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newEmail) return;
    setSavingEmail(true);

    const { error } = await getSupabaseClient().auth.updateUser({ email: newEmail });

    setSavingEmail(false);

    if (error) {
      show("Couldn't start that email change — please try again.", "error");
      return;
    }
    show("Confirmation email sent — check your inbox to finish the change.", "success");
    setNewEmail("");
  }

  async function handleTogglePref(key: "notifyOrderUpdates" | "notifyPromotions", value: boolean) {
    setPrefs((current) => ({ ...current, [key]: value }));
    const column = key === "notifyOrderUpdates" ? "notify_order_updates" : "notify_promotions";

    const { error } = await getSupabaseClient()
      .from("profiles")
      .update({ [column]: value })
      .eq("id", profile.id);

    if (error) {
      setPrefs((current) => ({ ...current, [key]: !value }));
      show("Couldn't save that preference — please try again.", "error");
      return;
    }
    show("Preference saved.", "success");
  }

  async function handleToggleNewsletter(value: boolean) {
    setPrefs((current) => ({ ...current, newsletterSubscribed: value }));
    const supabase = getSupabaseClient();

    // Deliberately insert-then-catch-conflict rather than .upsert() —
    // newsletter_subscribers has no public select policy, so upsert can't
    // detect a conflict it isn't allowed to read (see project memory on
    // this exact gotcha).
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: profile.email, subscribed: value });

    if (insertError && insertError.code === "23505") {
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({ subscribed: value })
        .eq("email", profile.email);
      if (updateError) {
        setPrefs((current) => ({ ...current, newsletterSubscribed: !value }));
        show("Couldn't update your newsletter subscription — please try again.", "error");
        return;
      }
    } else if (insertError) {
      setPrefs((current) => ({ ...current, newsletterSubscribed: !value }));
      show("Couldn't update your newsletter subscription — please try again.", "error");
      return;
    }

    show("Preference saved.", "success");
  }

  async function handleSignOut() {
    await getSupabaseClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <section className="account-section-wrapper">
      <div className="container account-layout">
        <aside className="account-nav">
          <nav>
            {SECTIONS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`account-nav-link${section === item.key ? " active" : ""}`}
                onClick={() => changeSection(item.key)}
              >
                <i className={`fas ${item.icon}`} /> {item.label}
              </button>
            ))}
            {isAdmin && (
              <Link href="/admin" className="account-nav-link">
                <i className="fas fa-user-shield" /> Admin Dashboard
              </Link>
            )}
            <button type="button" className="account-nav-link account-nav-logout" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt" /> Sign Out
            </button>
          </nav>
        </aside>

        <div className="account-content">
          {section === "overview" && (
            <div className="account-card">
              <h2>Overview</h2>
              <div className="account-overview-grid">
                <div className="account-stat-card">
                  <div className="account-stat-value">{orders.length}</div>
                  <div className="account-stat-label">Orders</div>
                </div>
                <div className="account-stat-card">
                  <div className="account-stat-value">{activeSubscriptionCount}</div>
                  <div className="account-stat-label">Active Subscriptions</div>
                </div>
                <div className="account-stat-card">
                  <div className="account-stat-value">{addressList.length}</div>
                  <div className="account-stat-label">Saved Addresses</div>
                </div>
                <div className="account-stat-card">
                  <div className="account-stat-value">{wishlistList.length}</div>
                  <div className="account-stat-label">Wishlist Items</div>
                </div>
              </div>

              {nextDelivery && (
                <p className="account-overview-next-delivery">
                  <i className="fas fa-truck" /> Next delivery: <strong>{formatDate(nextDelivery)}</strong>
                </p>
              )}

              <h3 style={{ marginTop: "2rem" }}>Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="account-empty">You haven&apos;t placed any orders yet.</p>
              ) : (
                <div className="account-overview-recent">
                  {orders.slice(0, 3).map((order) => (
                    <div className="account-overview-recent-row" key={order.id}>
                      <span>
                        #{order.id} · {formatDate(order.createdAt)}
                      </span>
                      <span className={`order-status status-${order.status}`}>{order.status}</span>
                      <span>KSH {order.totalKsh.toLocaleString()}</span>
                    </div>
                  ))}
                  <button type="button" className="btn-small btn-outline" onClick={() => changeSection("orders")}>
                    View All Orders
                  </button>
                </div>
              )}
            </div>
          )}

          {section === "profile" && (
            <div className="account-card">
              <h2>Profile</h2>
              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" value={profile.email} disabled />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first-name">First Name</label>
                    <input
                      type="text"
                      id="first-name"
                      value={profileForm.firstName}
                      onChange={(event) => setProfileForm((f) => ({ ...f, firstName: event.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last-name">Last Name</label>
                    <input
                      type="text"
                      id="last-name"
                      value={profileForm.lastName}
                      onChange={(event) => setProfileForm((f) => ({ ...f, lastName: event.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      value={profileForm.phone}
                      onChange={(event) => setProfileForm((f) => ({ ...f, phone: event.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="birth-date">Birth Date</label>
                    <input
                      type="date"
                      id="birth-date"
                      value={profileForm.birthDate}
                      onChange={(event) => setProfileForm((f) => ({ ...f, birthDate: event.target.value }))}
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>
          )}

          {section === "orders" && (
            <div className="account-card">
              <h2>Orders</h2>
              {orders.length === 0 ? (
                <p className="account-empty">You haven&apos;t placed any orders yet.</p>
              ) : (
                <table className="account-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const expanded = expandedOrderId === order.id;
                      return (
                        <Fragment key={order.id}>
                          <tr
                            className="order-row"
                            onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                          >
                            <td>#{order.id}</td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>{order.items.length} items</td>
                            <td>KSH {order.totalKsh.toLocaleString()}</td>
                            <td>
                              <span className={`order-status status-${order.status}`}>{order.status}</span>
                            </td>
                            <td>
                              <i className={`fas fa-chevron-${expanded ? "up" : "down"}`} />
                            </td>
                          </tr>
                          {expanded && (
                            <tr className="order-detail-row">
                              <td colSpan={6}>
                                <div className="order-detail-panel">
                                  <OrderTimeline status={order.status} />
                                  <ul className="order-detail-items">
                                    {order.items.map((item, index) => (
                                      <li key={`${item.id}-${index}`}>
                                        <span>
                                          {item.name}
                                          {Object.keys(item.options).length > 0 && (
                                            <span className="order-detail-item-options">
                                              {" "}
                                              (
                                              {Object.entries(item.options)
                                                .map(([key, value]) => `${key}: ${value}`)
                                                .join(", ")}
                                              )
                                            </span>
                                          )}
                                        </span>
                                        <span>Qty {item.quantity}</span>
                                        <span>KSH {(item.price * item.quantity).toLocaleString()}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  <button
                                    type="button"
                                    className="btn-small btn-primary"
                                    onClick={() => handleReorder(order)}
                                  >
                                    Reorder
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {section === "wishlist" && (
            <div className="account-card">
              <h2>Wishlist</h2>
              {wishlistList.length === 0 ? (
                <p className="account-empty">
                  No saved items yet. Tap the heart icon on any product in the shop to save it here.
                </p>
              ) : (
                <div className="wishlist-grid">
                  {wishlistList.map((item) => (
                    <div className="wishlist-card" key={item.id}>
                      <div className="wishlist-card-image">
                        <Image src={item.image} alt={item.name} width={220} height={160} />
                      </div>
                      <h4>{item.name}</h4>
                      <p className="wishlist-card-price">KSH {item.price.toLocaleString()}</p>
                      <div className="wishlist-card-actions">
                        <button
                          type="button"
                          className="btn-small btn-primary"
                          onClick={() => handleAddWishlistItemToCart(item)}
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          className="btn-small btn-danger"
                          onClick={() => handleRemoveWishlistItem(item)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "subscriptions" && (
            <div className="account-card">
              <h2>Subscriptions</h2>
              {subscriptionList.length === 0 ? (
                <p className="account-empty">No active subscriptions yet.</p>
              ) : (
                <div className="subscription-list">
                  {subscriptionList.map((sub) => (
                    <div className={`subscription-card${sub.status === "active" ? " active" : ""}`} key={sub.id}>
                      <div>
                        <h3>{sub.productName}</h3>
                        <p>
                          {sub.frequency} × {sub.quantity} • Next delivery: {formatDate(sub.nextDelivery)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className={`btn-small ${sub.status === "active" ? "btn-outline" : "btn-primary"}`}
                        onClick={() => handleToggleSubscription(sub.id, sub.status)}
                      >
                        {sub.status === "active" ? "Pause" : "Resume"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <h3 style={{ marginTop: "2rem" }}>Add a Subscription</h3>
              <form onSubmit={handleAddSubscription}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="sub-product">Product</label>
                    <select
                      id="sub-product"
                      value={subscriptionForm.productId}
                      onChange={(event) =>
                        setSubscriptionForm((f) => ({ ...f, productId: Number(event.target.value) }))
                      }
                    >
                      {products.map((product) => (
                        <option value={product.id} key={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="sub-frequency">Frequency</label>
                    <select
                      id="sub-frequency"
                      value={subscriptionForm.frequency}
                      onChange={(event) =>
                        setSubscriptionForm((f) => ({ ...f, frequency: event.target.value as "weekly" | "monthly" }))
                      }
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="sub-quantity">Quantity</label>
                    <input
                      type="number"
                      id="sub-quantity"
                      min={1}
                      max={10}
                      value={subscriptionForm.quantity}
                      onChange={(event) =>
                        setSubscriptionForm((f) => ({ ...f, quantity: Number(event.target.value) || 1 }))
                      }
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn" disabled={savingSubscription || products.length === 0}>
                  {savingSubscription ? "Saving..." : "Start Subscription"}
                </button>
              </form>
            </div>
          )}

          {section === "addresses" && (
            <div className="account-card">
              <h2>Addresses</h2>
              {addressList.length === 0 ? (
                <p className="account-empty">No saved addresses yet.</p>
              ) : (
                <div className="address-list">
                  {addressList.map((addr) => (
                    <div className={`address-card${addr.isDefault ? " default" : ""}`} key={addr.id}>
                      {addr.isDefault && <div className="address-badge">Default</div>}
                      <h4>{addr.label || "Address"}</h4>
                      <p>{addr.address}</p>
                      <p>
                        {addr.city}
                        {addr.postalCode ? `, ${addr.postalCode}` : ""}
                      </p>
                      <div className="address-actions">
                        {!addr.isDefault && (
                          <button type="button" className="btn-small btn-outline" onClick={() => handleSetDefaultAddress(addr.id)}>
                            Set Default
                          </button>
                        )}
                        <button type="button" className="btn-small btn-danger" onClick={() => handleDeleteAddress(addr.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h3 style={{ marginTop: "2rem" }}>Add an Address</h3>
              <form onSubmit={handleAddAddress}>
                <div className="form-group">
                  <label htmlFor="addr-label">Label</label>
                  <input
                    type="text"
                    id="addr-label"
                    placeholder="Home, Office, etc."
                    value={addressForm.label}
                    onChange={(event) => setAddressForm((f) => ({ ...f, label: event.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="addr-address">Address *</label>
                  <input
                    type="text"
                    id="addr-address"
                    required
                    value={addressForm.address}
                    onChange={(event) => setAddressForm((f) => ({ ...f, address: event.target.value }))}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="addr-city">City *</label>
                    <input
                      type="text"
                      id="addr-city"
                      required
                      value={addressForm.city}
                      onChange={(event) => setAddressForm((f) => ({ ...f, city: event.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="addr-postal">Postal Code</label>
                    <input
                      type="text"
                      id="addr-postal"
                      value={addressForm.postalCode}
                      onChange={(event) => setAddressForm((f) => ({ ...f, postalCode: event.target.value }))}
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn" disabled={savingAddress}>
                  {savingAddress ? "Saving..." : "Add Address"}
                </button>
              </form>
            </div>
          )}

          {section === "security" && (
            <div className="account-card">
              <h2>Login &amp; Security</h2>
              <div className="form-group">
                <label htmlFor="current-email">Current Email</label>
                <input type="email" id="current-email" value={profile.email} disabled />
              </div>
              <form onSubmit={handleChangeEmail}>
                <div className="form-group">
                  <label htmlFor="new-email">Change Email</label>
                  <input
                    type="email"
                    id="new-email"
                    placeholder="new@email.com"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={savingEmail || !newEmail}>
                  {savingEmail ? "Sending..." : "Send Confirmation"}
                </button>
              </form>

              <div className="account-security-info">
                <p>
                  <strong>Member since:</strong> {formatDate(memberSince)}
                </p>
                <p>
                  <strong>Last signed in:</strong> {formatDate(lastSignInAt)}
                </p>
                <p className="account-security-note">
                  This app is passwordless — you sign in with a one-time code emailed to you, and you&apos;re
                  automatically signed out after 5 minutes of inactivity.
                </p>
              </div>

              <button type="button" className="btn-small btn-outline" style={{ marginTop: "1rem" }} onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}

          {section === "notifications" && (
            <div className="account-card">
              <h2>Notifications</h2>
              <div className="notification-row">
                <div>
                  <h4>Order Updates</h4>
                  <p>Emails when your order status changes.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={prefs.notifyOrderUpdates}
                    onChange={(event) => handleTogglePref("notifyOrderUpdates", event.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="notification-row">
                <div>
                  <h4>Promotions &amp; Offers</h4>
                  <p>Occasional deals on eggs, chicken, and more.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={prefs.notifyPromotions}
                    onChange={(event) => handleTogglePref("notifyPromotions", event.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="notification-row">
                <div>
                  <h4>Newsletter</h4>
                  <p>Farm updates and seasonal news.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={prefs.newsletterSubscribed}
                    onChange={(event) => handleToggleNewsletter(event.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastViewport toast={toast} onDismiss={dismiss} />
    </section>
  );
}
