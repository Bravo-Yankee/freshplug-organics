import type { Metadata } from "next";
import "@/styles/pages/shop.css";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop premium organic poultry products - fresh eggs, organic chicken, live birds, and more from Freshplug Organics Poultry Farm.",
};

export default function ShopPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Shop Our Products</h1>
          <p>Fresh, organic poultry products delivered to your door</p>
        </div>
      </section>

      <ShopClient />
    </>
  );
}
