import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import "@/styles/pages/about.css";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Freshplug Organics Poultry Farm - our story, mission, organic farming practices, and commitment to sustainable agriculture.",
};

const stats = [
  { number: "2000+", label: "Happy Chickens" },
  { number: "500+", label: "Satisfied Customers" },
  { number: "100%", label: "Free-Range & Pasture-Raised" },
  { number: "9", label: "Years of Excellence" },
];

const values = [
  {
    icon: "fas fa-leaf",
    title: "Sustainability",
    description: "We use eco-friendly practices that protect our environment for future generations.",
  },
  {
    icon: "fas fa-heart",
    title: "Animal Welfare",
    description: "Our animals live in spacious, natural environments with the highest care standards.",
  },
  {
    icon: "fas fa-star",
    title: "Quality",
    description: "We maintain rigorous quality standards in everything we do, from feed to final product.",
  },
  {
    icon: "fas fa-users",
    title: "Community",
    description: "We're committed to supporting our local community and building lasting relationships.",
  },
];

const kenyanRoots = [
  {
    icon: "fas fa-hand-holding-heart",
    title: "Family-Run & Kenyan-Owned",
    description:
      "Freshplug Organics is a family farm based right here in Kenya — not a franchise or an import brand, just people who know every bird by name.",
  },
  {
    icon: "fas fa-seedling",
    title: "Locally Sourced Feed",
    description: "We source feed and farm inputs from local Kenyan suppliers, keeping more value within our community.",
  },
  {
    icon: "fas fa-truck",
    title: "Fresh to Nairobi & Beyond",
    description: "From our farm straight to your table across Nairobi and the surrounding counties — same-day freshness, no middlemen.",
  },
  {
    icon: "fas fa-hands-helping",
    title: "Community First",
    description: "We create local jobs and reinvest in our community, because a thriving farm should mean a thriving neighborhood.",
  },
];

const timeline = [
  {
    year: "2015",
    title: "Humble Beginnings",
    description: "Started with 50 heritage breed hens on a small family plot, focusing on free-range, pasture-raised, organic practices from day one.",
  },
  {
    year: "2017",
    title: "Going Fully Organic",
    description: "Fully transitioned to organic, free-range farming — no antibiotics, no synthetic feed, just natural care for every bird.",
  },
  {
    year: "2019",
    title: "Farm Expansion",
    description: "Expanded our pastures and increased our flock to 500 birds, adding turkey and duck production.",
  },
  {
    year: "2021",
    title: "Growing With Our Community",
    description: "Became a trusted supplier for families, restaurants, and shops across Nairobi and beyond — entirely through word of mouth.",
  },
  {
    year: "2024",
    title: "Continued Growth",
    description: "Now a thriving small-scale operation with over 2000 birds, serving 500+ customers with farm-fresh products.",
  },
];

const certifications = [
  { src: "/assets/images/organic-certified.svg", title: "Free-Range & Organic", note: "No antibiotics, no synthetic feed" },
  { src: "/assets/images/animal-welfare.svg", title: "Animal Welfare Focused", note: "Spacious, natural environments" },
  { src: "/assets/images/sustainable.svg", title: "Sustainably Farmed", note: "Eco-conscious practices" },
  { src: "/assets/images/local-farm.svg", title: "Proudly Kenyan", note: "Locally owned & operated" },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>About Freshplug Organics</h1>
          <p>Committed to sustainable farming and premium organic poultry</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2015, Freshplug Organics Poultry Farm began as a small family
                venture with a simple mission: to provide the freshest, highest-quality
                organic poultry products while maintaining the highest standards of animal
                welfare and environmental sustainability.
              </p>
              <p>
                What started as a passion project with just 50 hens has grown into a thriving
                operation that serves hundreds of satisfied customers throughout the region.
                Our commitment to organic practices, transparent farming methods, and
                community engagement has made us a trusted name in sustainable agriculture.
              </p>
              <p>
                Today, we&apos;re proud to farm organically and continue to lead by example
                in responsible farming practices that benefit our animals, our customers, and
                our planet.
              </p>
            </div>
            <div className="about-image">
              <Image
                src="/assets/images/farm-landscape.jpg"
                alt="Freshplug Organics Farm Story"
                width={600}
                height={450}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about-section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <h2 className="section-title">Our Impact</h2>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2 className="section-title">Our Mission &amp; Values</h2>
          <div className="about-grid">
            <div className="about-text">
              <h3>Our Mission</h3>
              <p>
                To provide premium organic poultry products through sustainable farming
                practices that prioritize animal welfare, environmental stewardship, and
                community health. We believe that healthy, happy animals produce the best
                products, and that responsible farming creates a better world for everyone.
              </p>
            </div>
            <div className="values-grid">
              {values.map((value) => (
                <div className="value-card" key={value.title}>
                  <div className="value-icon">
                    <i className={value.icon} />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-section team-section">
        <div className="container">
          <h2 className="section-title">Proudly Kenyan</h2>
          <div className="values-grid">
            {kenyanRoots.map((item) => (
              <div className="value-card" key={item.title}>
                <div className="value-icon">
                  <i className={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2 className="section-title">Our Journey</h2>
          <div className="timeline">
            {timeline.map((item) => (
              <div className="timeline-item" key={item.year}>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <h2 className="section-title">Our Farming Standards</h2>
          <div className="certifications">
            {certifications.map((cert) => (
              <div className="cert-badge" key={cert.title}>
                <Image src={cert.src} alt={cert.title} width={80} height={80} />
                <h4>{cert.title}</h4>
                <p>{cert.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Visit Our Farm</h2>
              <p>
                We believe in transparency and invite you to see our farming practices
                firsthand. Schedule a farm tour to meet our animals, learn about our
                processes, and experience the difference that organic, sustainable farming
                makes.
              </p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <Link href="/contact" className="btn btn-primary">
                  Schedule a Tour
                </Link>
                <Link href="/shop" className="btn btn-secondary">
                  Shop Our Products
                </Link>
              </div>
            </div>
            <div className="about-image">
              <Image
                src="/assets/images/visitors-farm.jpg"
                alt="Visit Our Farm"
                width={600}
                height={450}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
