import type { Metadata } from "next";
import "@/styles/pages/shop.css";
import { ShopClient } from "@/components/shop/ShopClient";
import { getProducts } from "@/lib/data/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop premium organic poultry products - fresh eggs, organic chicken, live birds, and more from Freshplug Organics Poultry Farm.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Shop Our Products</h1>
          <p>Fresh, organic poultry products delivered to your door</p>
        </div>
      </section>

      <ShopClient products={products} />
    </>
  );
}
