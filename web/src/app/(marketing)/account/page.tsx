import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "@/styles/pages/account.css";
import { AccountClient } from "@/components/account/AccountClient";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  getProfile,
  getAddresses,
  getSubscriptions,
  getOrders,
  getWishlist,
  getNotificationPrefs,
} from "@/lib/data/account";
import { getProducts } from "@/lib/data/products";
import { isCurrentUserAdmin } from "@/lib/data/admin";

// Session-scoped data, not content — ISR doesn't apply here.
export const revalidate = 0;

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Freshplug Organics profile, orders, subscriptions, and addresses.",
};

export default async function AccountPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profile, addresses, subscriptions, orders, products, isAdmin, wishlist, notificationPrefs] =
    await Promise.all([
      getProfile(),
      getAddresses(),
      getSubscriptions(),
      getOrders(),
      getProducts(),
      isCurrentUserAdmin(),
      getWishlist(),
      getNotificationPrefs(),
    ]);

  // getProfile() self-heals a missing profiles row (Phase 13) for
  // accounts that predate the handle_new_user() trigger, so this should
  // be unreachable in practice — treated as a signed-out state rather
  // than a 500 if the self-heal insert itself somehow fails.
  if (!profile) redirect("/login");

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>My Account</h1>
          <p>Welcome back, {profile.firstName ?? profile.email}</p>
        </div>
      </section>

      <AccountClient
        profile={profile}
        addresses={addresses}
        subscriptions={subscriptions}
        orders={orders}
        products={products}
        isAdmin={isAdmin}
        wishlist={wishlist}
        notificationPrefs={notificationPrefs}
        memberSince={user.created_at}
        lastSignInAt={user.last_sign_in_at ?? null}
      />
    </>
  );
}
