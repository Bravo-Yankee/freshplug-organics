"use client";

import { useState } from "react";
import type { AdminOrder, AdminStats, ContactMessage, Customer } from "@/lib/data/admin";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useToast, ToastViewport } from "@/components/ui/Toast";

type Section = "overview" | "orders" | "messages" | "customers";

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "fa-chart-bar" },
  { key: "orders", label: "Orders", icon: "fa-shopping-bag" },
  { key: "messages", label: "Messages", icon: "fa-envelope" },
  { key: "customers", label: "Customers", icon: "fa-users" },
];

const ORDER_STATUSES: AdminOrder["status"][] = ["pending", "confirmed", "fulfilled", "cancelled"];

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface AdminClientProps {
  stats: AdminStats;
  orders: AdminOrder[];
  messages: ContactMessage[];
  customers: Customer[];
}

/**
 * Mirrors AccountClient's single-page, nav-driven section layout. Orders is
 * the only section with a write path (status dropdown) — Messages and
 * Customers are read-only, matching the confirmed scope for this pass.
 */
export function AdminClient({ stats, orders, messages, customers }: AdminClientProps) {
  const { toast, show, dismiss } = useToast();
  const [section, setSection] = useState<Section>("overview");
  const [orderList, setOrderList] = useState(orders);

  async function handleStatusChange(orderId: number, newStatus: AdminOrder["status"]) {
    const { error } = await getSupabaseClient().from("orders").update({ status: newStatus }).eq("id", orderId);

    if (error) {
      show("Couldn't update order status — please try again.", "error");
      return;
    }

    setOrderList((current) => current.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
    show("Order status updated.", "success");
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
              )}
            </div>
          )}

          {section === "messages" && (
            <div className="admin-card">
              <h2>Contact Messages</h2>
              {messages.length === 0 ? (
                <p className="admin-empty">No messages yet.</p>
              ) : (
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
              )}
            </div>
          )}

          {section === "customers" && (
            <div className="admin-card">
              <h2>Customers</h2>
              {customers.length === 0 ? (
                <p className="admin-empty">No signed-up customers yet.</p>
              ) : (
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
              )}
            </div>
          )}
        </div>
      </div>

      <ToastViewport toast={toast} onDismiss={dismiss} />
    </section>
  );
}
