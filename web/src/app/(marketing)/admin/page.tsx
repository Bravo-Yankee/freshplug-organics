import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "@/styles/pages/admin.css";
import { AdminClient } from "@/components/admin/AdminClient";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isCurrentUserAdmin, getAdminStats, getAllOrders, getAllMessages, getAllCustomers } from "@/lib/data/admin";

// Session-scoped data, not content — ISR doesn't apply here.
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage Freshplug Organics orders, contact messages, and customers.",
};

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) redirect("/");

  const [stats, orders, messages, customers] = await Promise.all([
    getAdminStats(),
    getAllOrders(),
    getAllMessages(),
    getAllCustomers(),
  ]);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Orders, messages, and customers at a glance</p>
        </div>
      </section>

      <AdminClient stats={stats} orders={orders} messages={messages} customers={customers} />
    </>
  );
}
