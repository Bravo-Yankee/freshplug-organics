import Link from "next/link";
import type { Metadata } from "next";
import "@/styles/pages/process.css";
import { whatsappOrderLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "Learn about Freshplug Organics' farm-to-table process - from sustainable farming practices to quality delivery.",
};

const timelineSteps = [
  {
    title: "Breeding & Selection",
    description:
      "We carefully select our breeding stock from heritage and proven genetic lines to ensure healthy, productive birds with excellent disease resistance.",
    features: [
      "Heritage breed selection for hardy genetics",
      "Health screening and vaccination protocols",
      "Optimal breeding ratios maintained",
      "Genetic diversity preservation",
    ],
  },
  {
    title: "Natural Incubation & Hatching",
    description:
      "Our eggs are incubated under optimal conditions with precise temperature and humidity control to ensure the highest hatch rates and chick quality.",
    features: [
      "21-day incubation period with daily monitoring",
      "Natural brooding encouraged when possible",
      "Climate-controlled hatchery facilities",
      "Health checks on all hatchlings",
    ],
  },
  {
    title: "100% Organic Feeding Program",
    description:
      "Our birds receive carefully formulated organic feed supplemented with natural foraging opportunities to ensure optimal nutrition and health.",
    features: [
      "Certified organic feed ingredients only",
      "No GMOs, antibiotics, or growth hormones",
      "Natural foraging encouraged daily",
      "Fresh water available 24/7",
    ],
  },
  {
    title: "Free-Range Living Environment",
    description:
      "Our chickens enjoy spacious outdoor areas with natural vegetation, dust baths, and comfortable roosting areas that promote natural behaviors.",
    features: [
      "Minimum 10 sq ft per bird outdoor space",
      "Natural vegetation and shade trees",
      "Predator-proof fencing for safety",
      "Mobile coops rotated for pasture health",
    ],
  },
  {
    title: "Preventive Health Management",
    description:
      "We focus on prevention through excellent hygiene, natural immunity building, and regular health monitoring by qualified veterinarians.",
    features: [
      "Daily health observation by trained staff",
      "Quarantine protocols for new birds",
      "Natural health supplements and probiotics",
      "Regular veterinary inspections",
    ],
  },
  {
    title: "Ethical Harvest & Processing",
    description:
      "Eggs are collected daily at optimal times, while meat processing follows strict humane and hygiene standards in our certified facilities.",
    features: [
      "Multiple daily egg collections for freshness",
      "Stress-free, humane processing methods",
      "HACCP-certified processing facility",
      "Immediate cooling and packaging",
    ],
  },
  {
    title: "Fresh Delivery & Customer Care",
    description:
      "Our products are carefully packaged and delivered fresh to maintain quality, with full traceability and customer support throughout the process.",
    features: [
      "Temperature-controlled packaging",
      "Same-day or next-day delivery options",
      "Full batch tracking and traceability",
      "Customer satisfaction guarantee",
    ],
  },
];

const standards = [
  {
    icon: "fas fa-leaf",
    title: "Organic Certification",
    description:
      "Fully certified organic operation meeting all national and international standards for organic agriculture and livestock production.",
  },
  {
    icon: "fas fa-heart",
    title: "Animal Welfare",
    description:
      "Highest animal welfare standards ensuring our birds live natural, stress-free lives with access to outdoors and natural behaviors.",
  },
  {
    icon: "fas fa-microscope",
    title: "Food Safety",
    description:
      "Rigorous food safety protocols including HACCP principles, regular testing, and complete batch traceability from farm to table.",
  },
  {
    icon: "fas fa-recycle",
    title: "Sustainability",
    description:
      "Environmentally responsible practices including waste management, soil conservation, and renewable energy use where possible.",
  },
];

const metrics = [
  { number: "99.2%", label: "Customer Satisfaction" },
  { number: "95%", label: "Hatch Rate Success" },
  { number: "24hrs", label: "Average Egg Freshness" },
  { number: "100%", label: "Antibiotic-Free" },
  { number: "10+", label: "Sq Ft Per Bird" },
  { number: "0", label: "Chemical Pesticides" },
];

const sustainability = [
  {
    icon: "fas fa-seedling",
    title: "Soil Health",
    description:
      "Rotational grazing and natural fertilizer from our birds improve soil health and prevent erosion.",
  },
  {
    icon: "fas fa-tint",
    title: "Water Conservation",
    description:
      "Efficient water systems and rainwater harvesting minimize water usage while maintaining bird health.",
  },
  {
    icon: "fas fa-recycle",
    title: "Waste Reduction",
    description:
      "Comprehensive composting program turns farm waste into valuable organic fertilizer for local farmers.",
  },
  {
    icon: "fas fa-solar-panel",
    title: "Renewable Energy",
    description: "Solar panels power our operations where possible, reducing carbon footprint and energy costs.",
  },
  {
    icon: "fas fa-tree",
    title: "Biodiversity",
    description: "Native plant species and wildlife corridors support local ecosystem health and biodiversity.",
  },
  {
    icon: "fas fa-truck",
    title: "Local Delivery",
    description: "Efficient delivery routes and local sourcing reduce transportation impact and support community.",
  },
];

const traceabilitySteps = [
  { icon: "fas fa-egg", title: "Breeding Records", description: "Parent bird lineage and breeding date" },
  { icon: "fas fa-utensils", title: "Feed Batch", description: "Specific feed lot and ingredient sources" },
  { icon: "fas fa-home", title: "Housing Location", description: "Specific coop and pasture area" },
  { icon: "fas fa-calendar", title: "Collection Date", description: "Exact harvest and processing date" },
  { icon: "fas fa-shipping-fast", title: "Delivery Details", description: "Complete delivery chain record" },
];

export default function ProcessPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Our Farm-to-Table Process</h1>
          <p>Transparency in every step from sustainable farming to quality delivery</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Our Process</span>
          </div>
        </div>
      </section>

      <section className="process-intro">
        <div className="container">
          <div className="intro-content">
            <h2 className="section-title">Excellence Through Every Step</h2>
            <p style={{ fontSize: "1.2rem", color: "var(--text-light)", lineHeight: 1.6 }}>
              At Freshplug Organics, we believe that exceptional products come from exceptional
              processes. Our comprehensive approach ensures that every egg, every bird, and every
              product meets the highest standards of quality, sustainability, and ethical farming
              practices.
            </p>
          </div>
        </div>
      </section>

      <section className="process-timeline">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center", marginBottom: "3rem" }}>
            Our 7-Step Process
          </h2>
          <div className="timeline-container">
            <div className="timeline-line" />
            {timelineSteps.map((step, index) => (
              <div className="timeline-item" key={step.title}>
                <div className="timeline-number">{index + 1}</div>
                <div className="timeline-content">
                  <div className="process-step">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <ul className="step-features">
                      {step.features.map((feature) => (
                        <li key={feature}>
                          <i className="fas fa-check" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="standards-section">
        <div className="container">
          <h2 className="section-title">Our Quality Standards</h2>
          <div className="standards-grid">
            {standards.map((standard) => (
              <div className="standard-card" key={standard.title}>
                <div className="standard-icon">
                  <i className={standard.icon} />
                </div>
                <h3>{standard.title}</h3>
                <p>{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quality-metrics">
        <div className="container">
          <h2 className="section-title">Measurable Quality Results</h2>
          <div className="metrics-grid">
            {metrics.map((metric) => (
              <div className="metric-card" key={metric.label}>
                <div className="metric-number">{metric.number}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sustainability-section">
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            Sustainable Farming Practices
          </h2>
          <p style={{ textAlign: "center", marginBottom: "3rem", opacity: 0.9 }}>
            Our commitment to the environment extends beyond organic certification
          </p>
          <div className="sustainability-grid">
            {sustainability.map((item) => (
              <div className="sustainability-item" key={item.title}>
                <h4>
                  <i className={item.icon} /> {item.title}
                </h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="traceability-section">
        <div className="container">
          <h2 className="section-title">Complete Traceability</h2>
          <p style={{ textAlign: "center", color: "var(--text-light)", marginBottom: "3rem" }}>
            Every product can be traced back to its source for complete transparency
          </p>
          <div className="traceability-flow">
            {traceabilitySteps.map((step) => (
              <div className="trace-step" key={step.title}>
                <div className="trace-icon">
                  <i className={step.icon} />
                </div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="farm-tour-cta">
        <div className="container">
          <div className="cta-content">
            <h2>See Our Process in Action</h2>
            <p style={{ color: "var(--text-light)", fontSize: "1.1rem", margin: "1.5rem 0" }}>
              We believe in complete transparency. Visit our farm to see our organic processes
              firsthand and meet the team behind your food.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn btn-primary">
                Schedule Farm Tour
              </Link>
              <Link href="/gallery" className="btn btn-secondary">
                View Photo Gallery
              </Link>
              <a
                href={whatsappOrderLink("Hi! I'd like to schedule a farm visit")}
                className="btn btn-outline"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-whatsapp" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
