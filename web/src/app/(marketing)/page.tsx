import Image from "next/image";
import Link from "next/link";

const testimonials = [
  {
    quote:
      "The freshest eggs I've ever tasted! You can really taste the difference that organic farming makes.",
    name: "Sarah Johnson",
    role: "Regular Customer",
    image: "/assets/images/customer1.jpg",
  },
  {
    quote:
      "Excellent quality chicken and outstanding customer service. I won't buy poultry anywhere else!",
    name: "Michael Chen",
    role: "Local Restaurant Owner",
    image: "/assets/images/customer2.jpg",
  },
  {
    quote:
      "Supporting Freshplug Organics means supporting sustainable farming. Their practices are exemplary.",
    name: "Emma Wilson",
    role: "Environmental Advocate",
    image: "/assets/images/customer3.jpg",
  },
];

const trustBadges = [
  { src: "/assets/images/organic-certified.svg", label: "Certified Organic" },
  { src: "/assets/images/animal-welfare.svg", label: "Animal Welfare Approved" },
  { src: "/assets/images/sustainable.svg", label: "Sustainable Farming" },
  { src: "/assets/images/local-farm.svg", label: "Proudly Local" },
];

const featuredProducts = [
  {
    image: "/assets/images/organic-chicken.jpg",
    title: "Fresh Organic Eggs",
    description: "Farm-fresh eggs from free-range, organically-fed hens",
    price: "From KSH 350/dozen",
    href: "/shop#eggs",
    cta: "Shop Eggs",
  },
  {
    image: "/assets/images/organic-chicken.jpg",
    title: "Organic Chicken",
    description: "Premium quality organic chicken, raised naturally",
    price: "From KSH 680/kg",
    href: "/shop#chicken",
    cta: "Shop Chicken",
  },
  {
    image: "/assets/images/hero-farm.jpg",
    title: "Live Chickens",
    description: "Healthy broilers and layers for your backyard farm",
    price: "From KSH 1,500 each",
    href: "/shop#live",
    cta: "Shop Live Birds",
  },
];

export default function HomePage() {
  return (
    <>
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Farm-Fresh Organic Poultry</h1>
            <p>
              Experience the finest organic eggs and poultry products, raised with
              care and commitment to sustainable farming practices.
            </p>
            <div className="hero-buttons">
              <Link href="/shop" className="btn btn-primary">
                Order Fresh Eggs Today
              </Link>
              <a href="#about" className="btn btn-secondary">
                Learn About Our Farm
              </a>
            </div>
            <div className="hero-features">
              <div className="feature">
                <i className="fas fa-leaf" />
                <span>100% Organic</span>
              </div>
              <div className="feature">
                <i className="fas fa-truck" />
                <span>Local Delivery</span>
              </div>
              <div className="feature">
                <i className="fas fa-heart" />
                <span>Happy Hens</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <Image
              src="/assets/images/hero-farm.jpg"
              alt="Organic Poultry Farm"
              width={720}
              height={540}
              priority
            />
          </div>
        </div>
      </section>

      <section id="products" className="featured-products">
        <div className="container">
          <h2 className="section-title">Our Premium Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div className="product-card" key={product.title}>
                <Image src={product.image} alt={product.title} width={400} height={300} />
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <span className="price">{product.price}</span>
                <Link href={product.href} className="btn btn-outline">
                  {product.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div className="testimonial" key={testimonial.name}>
                <div className="stars">★★★★★</div>
                <p>&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="customer">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                  />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-badges">
        <div className="container">
          <div className="badges-grid">
            {trustBadges.map((badge) => (
              <div className="badge" key={badge.label}>
                <Image src={badge.src} alt={badge.label} width={64} height={64} />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Connected with Fresh Updates</h2>
            <p>Get the latest farm news, special offers, and seasonal product availability</p>
            {/*
              Real submission handling (persisting to a customers table via
              an ESP) lands in Phase 6 — this is a static form for content
              parity with the legacy site's client-only newsletter signup.
            */}
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
