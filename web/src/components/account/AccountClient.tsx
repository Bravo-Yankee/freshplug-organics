"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/content/products";
import type { Address, Order, Profile, Subscription } from "@/lib/data/account";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useToast, ToastViewport } from "@/components/ui/Toast";

type Section = "profile" | "orders" | "subscriptions" | "addresses";

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: "profile", label: "Profile", icon: "fa-user" },
  { key: "orders", label: "Orders", icon: "fa-shopping-bag" },
  { key: "subscriptions", label: "Subscriptions", icon: "fa-sync-alt" },
  { key: "addresses", label: "Addresses", icon: "fa-map-marker-alt" },
];

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
}

/**
 * Single-page, nav-driven sections — mirrors the legacy customer-account.js
 * layout rather than separate routes, matching ShopClient/BlogClient's
 * "one Server page + one big Client component" convention. Writes go
 * straight through the browser Supabase client (same ad-hoc-write pattern
 * as ShopClient.handleCheckout); RLS (schema.sql) is the real trust
 * boundary, not which component issues the request.
 */
export function AccountClient({ profile, addresses, subscriptions, orders, products }: AccountClientProps) {
  const router = useRouter();
  const { toast, show, dismiss } = useToast();
  const [section, setSection] = useState<Section>("profile");

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
                onClick={() => setSection(item.key)}
              >
                <i className={`fas ${item.icon}`} /> {item.label}
              </button>
            ))}
            <button type="button" className="account-nav-link account-nav-logout" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt" /> Sign Out
            </button>
          </nav>
        </aside>

        <div className="account-content">
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
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{order.items.length} items</td>
                        <td>KSH {order.totalKsh.toLocaleString()}</td>
                        <td>
                          <span className={`order-status status-${order.status}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        </div>
      </div>

      <ToastViewport toast={toast} onDismiss={dismiss} />
    </section>
  );
}
