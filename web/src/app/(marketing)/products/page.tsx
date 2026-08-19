import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import "@/styles/pages/products.css";
import { siteConfig, whatsappOrderLink } from "@/lib/site-config";
import { getProducts } from "@/lib/data/products";
import type { Product, ProductCategory } from "@/content/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Premium organic poultry products from Freshplug Organics - fresh eggs, organic chicken, and live birds.",
};

/**
 * This is the marketing showcase page, distinct from the cart-ready
 * catalog on /shop — but priceRange below is now derived from the same
 * live product data (see priceRangeFor), not hand-typed, so the two
 * pages can't drift apart the way they used to. Deliberately formatted
 * to match /shop's own "KSH {price}" display exactly (no "per tray" /
 * "per kg" unit claims) — the old hardcoded units didn't actually match
 * how these categories are priced in the catalog (eggs by size, not a
 * 30-egg tray; chicken by cut/weight-range, not a per-kg rate), so
 * inventing a unit to pair with a real number would just trade one
 * mismatch for another.
 */
const categories: {
  id: ProductCategory;
  title: string;
  description: string;
  imageFirst: boolean;
  image: string;
  heading: string;
  features: string[];
  availableLabel: string;
  availableValue: string;
  whatsappMessage: string;
}[] = [
  {
    id: "eggs",
    title: "Fresh Organic Eggs",
    description:
      "Our signature product - farm-fresh eggs from free-range hens fed on 100% organic feed",
    imageFirst: true,
    image: "/assets/images/organic-chicken.jpg",
    heading: "Premium Farm-Fresh Eggs",
    features: [
      "Free-range hens with outdoor access",
      "100% organic feed - no GMOs",
      "No antibiotics or hormones",
      "Rich, golden yolks with superior nutrition",
      "Collected daily for maximum freshness",
      "Available in multiple sizes",
    ],
    availableLabel: "Available Sizes",
    availableValue: "Small, Medium, Large, Extra Large",
    whatsappMessage: "Hi! I'm interested in your fresh organic eggs",
  },
  {
    id: "chicken",
    title: "Organic Chicken",
    description:
      "Premium organic chicken meat from birds raised in natural, stress-free environments",
    imageFirst: false,
    image: "/assets/images/organic-chicken.jpg",
    heading: "Farm-Raised Organic Chicken",
    features: [
      "Pasture-raised with room to roam",
      "Organic feed and natural foraging",
      "No growth hormones or antibiotics",
      "Superior flavor and texture",
      "Processed hygienically on-farm",
      "Available whole or cut portions",
    ],
    availableLabel: "Available Cuts",
    availableValue: "Whole chicken, breast, thighs, wings, drumsticks",
    whatsappMessage: "Hi! I'm interested in your organic chicken",
  },
  {
    id: "live",
    title: "Live Chickens",
    description: "Healthy, well-bred chickens for breeding, laying, and backyard farming",
    imageFirst: true,
    image: "/assets/images/hero-farm.jpg",
    heading: "Quality Live Birds",
    features: [
      "Multiple breeds available",
      "Vaccinated and health-checked",
      "Excellent laying capacity",
      "Hardy, disease-resistant birds",
      "Perfect for backyard farming",
      "Expert advice provided",
    ],
    availableLabel: "Popular Breeds",
    availableValue: "Rhode Island Red, Kuroiler, Kienyeji, New Hampshire",
    whatsappMessage: "Hi! I'm interested in your live chickens",
  },
  // Day-old Chicks showcase removed — not currently available at the
  // farm. The underlying products/category are hidden, not deleted, in
  // Supabase; re-add a block here (and re-activate the category from
  // /admin) if they come back.
];

function priceRangeFor(products: Product[], category: ProductCategory): string {
  const prices = products
    .filter((p) => p.category === category)
    .flatMap((p) => [p.price, ...Object.values(p.weightPricing ?? {}).map((tier) => tier.price)]);
  if (prices.length === 0) return "Contact us for pricing";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? `KSH ${min.toLocaleString()}`
    : `KSH ${min.toLocaleString()} - ${max.toLocaleString()}`;
}

const certifications = [
  {
    icon: "fas fa-leaf",
    title: "Organic Certified",
    description:
      "USDA and local organic certification ensuring no synthetic chemicals, GMOs, or artificial additives",
  },
  {
    icon: "fas fa-heart",
    title: "Animal Welfare Approved",
    description:
      "Highest welfare standards ensuring our animals live in natural, stress-free environments",
  },
  {
    icon: "fas fa-shield-alt",
    title: "Food Safety Certified",
    description: "Rigorous food safety protocols ensuring clean, safe products from farm to table",
  },
  {
    icon: "fas fa-recycle",
    title: "Sustainability Verified",
    description:
      "Environmentally responsible farming practices that protect our planet for future generations",
  },
];

const comparisonRows = [
  {
    feature: "Organic Feed",
    freshplug: { text: "100% Organic", type: "check" },
    conventional: { text: "Conventional", type: "cross" },
    storeBought: { text: "Unknown", type: "cross" },
  },
  {
    feature: "Free-Range Access",
    freshplug: { text: "Daily Outdoor Access", type: "check" },
    conventional: { text: "Limited/None", type: "cross" },
    storeBought: { text: "Cage Systems", type: "cross" },
  },
  {
    feature: "No Antibiotics",
    freshplug: { text: "Never Used", type: "check" },
    conventional: { text: "Routinely Used", type: "cross" },
    storeBought: { text: "Often Used", type: "cross" },
  },
  {
    feature: "Freshness",
    freshplug: { text: "Same Day Collection", type: "check" },
    conventional: { text: "2-3 Days", type: "plain" },
    storeBought: { text: "1-4 Weeks Old", type: "plain" },
  },
  {
    feature: "Traceability",
    freshplug: { text: "Complete Farm History", type: "check" },
    conventional: { text: "Partial", type: "plain" },
    storeBought: { text: "Unknown Origin", type: "cross" },
  },
  {
    feature: "Environmental Impact",
    freshplug: { text: "Sustainable Practices", type: "check" },
    conventional: { text: "Standard", type: "plain" },
    storeBought: { text: "High Carbon Footprint", type: "plain" },
  },
] as const;

const seasonalInfo = [
  {
    title: "Year-Round",
    description: "Fresh eggs and live chickens available every day of the year",
  },
  {
    title: "Peak Season (Nov-Feb)",
    description: "Special breeds and holiday orders have highest availability",
  },
  {
    title: "Breeding Season (Mar-Aug)",
    description: "Best time for purchasing breeding stock and starting new flocks",
  },
  {
    title: "Custom Orders",
    description: "Special requests and bulk orders can be arranged with advance notice",
  },
];

const orderingOptions = [
  {
    icon: "fas fa-shopping-cart",
    title: "Online Shop",
    description:
      "Browse our full catalog and place orders directly through our online shop with secure checkout",
    ctaLabel: "Visit Shop",
    href: "/shop",
  },
  {
    icon: "fab fa-whatsapp",
    title: "WhatsApp Orders",
    description:
      "Quick and easy ordering through WhatsApp with instant confirmation and personalized service",
    ctaLabel: "Message Us",
    href: `https://wa.me/${siteConfig.whatsapp}`,
    external: true,
  },
  {
    icon: "fas fa-phone",
    title: "Phone Orders",
    description: "Call us directly to place orders, get advice, or discuss custom requirements",
    ctaLabel: "Call Now",
    href: `tel:${siteConfig.phones[0].replace(/\s+/g, "")}`,
    external: true,
  },
  {
    icon: "fas fa-map-marker-alt",
    title: "Farm Visits",
    description: "Visit our farm store for direct purchases and to see our operation firsthand",
    ctaLabel: "Get Directions",
    href: "/contact",
  },
];

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Our Premium Products</h1>
          <p>From farm-fresh eggs to healthy live birds - all raised with organic excellence</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Products</span>
          </div>
        </div>
      </section>

      <section className="products-hero">
        <div className="container">
          <h2 className="section-title">Quality You Can Taste &amp; Trust</h2>
          <div className="products-intro">
            <p>
              At Freshplug Organics, we specialize in premium organic poultry products that bring
              the best of farm-fresh quality to your table. Our commitment to sustainable farming
              practices ensures that every product meets the highest standards of nutrition,
              taste, and ethical production.
            </p>
          </div>
        </div>
      </section>

      {categories.map((category) => {
        const image = (
          <div className="product-image">
            <Image src={category.image} alt={category.title} width={400} height={300} />
          </div>
        );
        const details = (
          <div className="product-details">
            <h3>{category.heading}</h3>
            <ul className="product-features">
              {category.features.map((feature) => (
                <li key={feature}>
                  <i className="fas fa-check" /> {feature}
                </li>
              ))}
            </ul>
            <div className="price-range">{priceRangeFor(products, category.id)}</div>
            <p>
              <strong>{category.availableLabel}:</strong> {category.availableValue}
            </p>
            <div className="product-actions">
              <Link href={`/shop#${category.id}`} className="btn btn-primary">
                Order Now
              </Link>
              <a
                href={whatsappOrderLink(category.whatsappMessage)}
                className="btn btn-secondary"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-whatsapp" /> WhatsApp
              </a>
            </div>
          </div>
        );

        return (
          <section className="product-category" key={category.id} id={category.id}>
            <div className="container">
              <div className="category-header">
                <h2 className="category-title">{category.title}</h2>
                <p className="category-description">{category.description}</p>
              </div>
              <div className="product-showcase">
                {category.imageFirst ? (
                  <>
                    {image}
                    {details}
                  </>
                ) : (
                  <>
                    {details}
                    {image}
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <section className="certifications">
        <div className="container">
          <h2 className="section-title">Our Quality Certifications</h2>
          <div className="cert-grid">
            {certifications.map((cert) => (
              <div className="cert-item" key={cert.title}>
                <div className="cert-icon">
                  <i className={cert.icon} />
                </div>
                <h3>{cert.title}</h3>
                <p>{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="comparison-section">
        <div className="container">
          <h2 className="section-title">Why Choose Freshplug Organics?</h2>
          <p style={{ textAlign: "center", color: "var(--text-light)", marginBottom: "2rem" }}>
            See how our organic products compare to conventional alternatives
          </p>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Features</th>
                  <th>Freshplug Organics</th>
                  <th>Conventional Farms</th>
                  <th>Store-Bought</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <td>
                      <strong>{row.feature}</strong>
                    </td>
                    <td>
                      <ComparisonCell cell={row.freshplug} symbol="✓" />
                    </td>
                    <td>
                      <ComparisonCell cell={row.conventional} symbol="✗" />
                    </td>
                    <td>
                      <ComparisonCell cell={row.storeBought} symbol="✗" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="seasonal-info">
        <div className="container">
          <h2>Seasonal Product Availability</h2>
          <p>While most products are available year-round, some items have peak seasons</p>
          <div className="seasonal-grid">
            {seasonalInfo.map((item) => (
              <div className="seasonal-item" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ordering-info">
        <div className="container">
          <h2 className="section-title">How to Order</h2>
          <div className="info-grid">
            {orderingOptions.map((option) => (
              <div className="info-card" key={option.title}>
                <div className="info-icon">
                  <i className={option.icon} />
                </div>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                {option.external ? (
                  <a href={option.href} className="btn btn-primary" style={{ marginTop: "1rem" }}>
                    {option.ctaLabel}
                  </a>
                ) : (
                  <Link href={option.href} className="btn btn-primary" style={{ marginTop: "1rem" }}>
                    {option.ctaLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ComparisonCell({
  cell,
  symbol,
}: {
  cell: { text: string; type: string };
  symbol: string;
}) {
  if (cell.type === "check") {
    return <span className="check-mark">{symbol} {cell.text}</span>;
  }
  if (cell.type === "cross") {
    return <span className="cross-mark">{symbol} {cell.text}</span>;
  }
  return <>{cell.text}</>;
}
