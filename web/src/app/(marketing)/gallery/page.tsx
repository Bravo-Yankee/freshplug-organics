import Link from "next/link";
import type { Metadata } from "next";
import "@/styles/pages/gallery.css";
import { GalleryClient } from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Photo gallery showcasing Freshplug Organics Poultry Farm - see our chickens, facilities, products, and farm life.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Farm Gallery</h1>
          <p>See our farm life, happy chickens, and quality products in action</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Gallery</span>
          </div>
        </div>
      </section>

      <GalleryClient />
    </>
  );
}
