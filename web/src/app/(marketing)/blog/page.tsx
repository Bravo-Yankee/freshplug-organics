import Link from "next/link";
import type { Metadata } from "next";
import "@/styles/pages/blog.css";
import { BlogClient } from "@/components/blog/BlogClient";

export const metadata: Metadata = {
  title: "Farm Blog",
  description:
    "Farm blog from Freshplug Organics - farming tips, updates, recipes, and insights into organic poultry farming.",
};

export default function BlogPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Farm Blog</h1>
          <p>Stories, tips, and insights from our organic poultry farm</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Blog</span>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <BlogClient />
        </div>
      </section>
    </>
  );
}
