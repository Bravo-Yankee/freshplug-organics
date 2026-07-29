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
  { number: "50", label: "Acres of Organic Land" },
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

const team = [
  {
    name: "John Anderson",
    role: "Farm Owner & Manager",
    image: "/assets/images/team-member.jpg",
    bio: "With over 20 years in sustainable agriculture, John leads our farm operations and ensures our commitment to organic practices.",
  },
  {
    name: "Mary Anderson",
    role: "Animal Welfare Specialist",
    image: "/assets/images/customer1.jpg",
    bio: "Mary oversees the health and wellbeing of all our animals, ensuring they receive the best care possible.",
  },
  {
    name: "David Chen",
    role: "Organic Certification Manager",
    image: "/assets/images/customer2.jpg",
    bio: "David manages our organic certification and quality control processes, maintaining our high standards.",
  },
  {
    name: "Sarah Johnson",
    role: "Customer Relations Manager",
    image: "/assets/images/customer3.jpg",
    bio: "Sarah ensures our customers receive exceptional service and stays connected with our community.",
  },
];

const timeline = [
  {
    year: "2015",
    title: "Humble Beginnings",
    description: "Started with 50 heritage breed hens on 5 acres of land, focusing on pasture-raised, organic practices from day one.",
  },
  {
    year: "2017",
    title: "Organic Certification",
    description: "Achieved USDA Organic certification after two years of rigorous compliance with organic standards.",
  },
  {
    year: "2019",
    title: "Farm Expansion",
    description: "Expanded to 25 acres and increased our flock to 500 birds, adding turkey and duck production.",
  },
  {
    year: "2021",
    title: "Community Recognition",
    description: 'Received the "Sustainable Farm of the Year" award from the State Agriculture Department.',
  },
  {
    year: "2024",
    title: "Continued Growth",
    description: "Now operating on 50 acres with over 2000 birds, serving 500+ customers with farm-fresh products.",
  },
];

const certifications = [
  { src: "/assets/images/organic-certified.svg", title: "USDA Organic", note: "Certified since 2017" },
  { src: "/assets/images/animal-welfare.svg", title: "Animal Welfare Approved", note: "Highest welfare standards" },
  { src: "/assets/images/sustainable.svg", title: "Certified Humane", note: "Humane treatment verified" },
  { src: "/assets/images/local-farm.svg", title: "Local Harvest", note: "Proud member since 2016" },
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
                Today, we&apos;re proud to be certified organic and continue to lead by example
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
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member) => (
              <div className="team-card" key={member.name}>
                <Image src={member.image} alt={member.name} width={300} height={250} />
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <div className="role">{member.role}</div>
                  <p>{member.bio}</p>
                </div>
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
          <h2 className="section-title">Our Certifications</h2>
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
