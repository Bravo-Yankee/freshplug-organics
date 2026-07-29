import Link from "next/link";
import type { Metadata } from "next";
import "@/styles/pages/contact.css";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Freshplug Organics Poultry Farm - Get in touch for orders, farm visits, wholesale inquiries, or general information.",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch for orders, inquiries, or to schedule a farm visit</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 style={{ marginBottom: "2rem", color: "var(--charcoal)" }}>Get in Touch</h2>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt" />
                </div>
                <div className="contact-details">
                  <h3>Farm Address</h3>
                  <p>Freshplug Organics Farm</p>
                  <p>{siteConfig.address.short}</p>
                  <a href={siteConfig.address.mapsUrl} target="_blank" rel="noreferrer">
                    Get Directions
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone" />
                </div>
                <div className="contact-details">
                  {siteConfig.phones.map((phone) => (
                    <p key={phone}>
                      <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
                    </p>
                  ))}
                  <p>Call us for immediate assistance</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope" />
                </div>
                <div className="contact-details">
                  <p>
                    <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                  </p>
                  <p>We respond within 24 hours</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fab fa-whatsapp" />
                </div>
                <div className="contact-details">
                  <h3>WhatsApp</h3>
                  <p>
                    <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">
                      {siteConfig.whatsappDisplay}
                    </a>
                  </p>
                  <p>Quick responses for urgent inquiries</p>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Find Our Farm</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <div>
                <i
                  className="fas fa-map-marker-alt"
                  style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--clay)" }}
                />
                <br />
                Interactive Map Coming Soon
                <br />
                <small style={{ marginTop: "0.5rem", display: "block" }}>
                  <a
                    href={siteConfig.address.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--clay)" }}
                  >
                    Click here for directions on Google Maps
                  </a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="business-hours">
        <div className="container">
          <h2 className="section-title">Business Hours &amp; Information</h2>
          <div className="hours-grid">
            <div className="hours-card">
              <div className="hours-icon">
                <i className="fas fa-clock" />
              </div>
              <h3>Farm Store Hours</h3>
              <table className="hours-table">
                <tbody>
                  <tr>
                    <th>Monday - Friday</th>
                    <td>8:00 AM - 6:00 PM</td>
                  </tr>
                  <tr>
                    <th>Saturday</th>
                    <td>8:00 AM - 4:00 PM</td>
                  </tr>
                  <tr>
                    <th>Sunday</th>
                    <td>Closed</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="hours-card">
              <div className="hours-icon">
                <i className="fas fa-calendar-alt" />
              </div>
              <h3>Farm Tours</h3>
              <p style={{ marginBottom: "1rem", color: "var(--text-light)" }}>
                Guided tours available by appointment
              </p>
              <table className="hours-table">
                <tbody>
                  <tr>
                    <th>Tuesday &amp; Thursday</th>
                    <td>2:00 PM - 4:00 PM</td>
                  </tr>
                  <tr>
                    <th>Saturday</th>
                    <td>10:00 AM - 2:00 PM</td>
                  </tr>
                  <tr>
                    <th>Group Tours</th>
                    <td>By Appointment</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="hours-card">
              <div className="hours-icon">
                <i className="fas fa-truck" />
              </div>
              <h3>Delivery Schedule</h3>
              <p style={{ marginBottom: "1rem", color: "var(--text-light)" }}>
                Local delivery within 20 miles
              </p>
              <table className="hours-table">
                <tbody>
                  <tr>
                    <th>Monday &amp; Wednesday</th>
                    <td>Morning Routes</td>
                  </tr>
                  <tr>
                    <th>Friday</th>
                    <td>Afternoon Routes</td>
                  </tr>
                  <tr>
                    <th>Same Day Pickup</th>
                    <td>Order by 2:00 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="social-section">
        <div className="container">
          <h2>Follow Our Farm Journey</h2>
          <p>Stay connected with daily farm life, new products, and special offers</p>

          <div className="social-grid">
            <div className="social-card">
              <i className="fab fa-facebook" />
              <h3>Facebook</h3>
              <p>Daily updates and community</p>
              <a href={siteConfig.social.facebook ?? "#"} target="_blank" rel="noreferrer">
                @FreshplugOrganics
              </a>
            </div>

            <div className="social-card">
              <i className="fab fa-instagram" />
              <h3>Instagram</h3>
              <p>Beautiful farm photos</p>
              <a href={siteConfig.social.instagram ?? "#"} target="_blank" rel="noreferrer">
                @freshplug_organics
              </a>
            </div>

            <div className="social-card">
              <i className="fab fa-youtube" />
              <h3>YouTube</h3>
              <p>Farm tours and education</p>
              <a href={siteConfig.social.youtube ?? "#"} target="_blank" rel="noreferrer">
                Freshplug Organics
              </a>
            </div>

            <div className="social-card">
              <i className="fab fa-twitter" />
              <h3>Twitter</h3>
              <p>Quick updates and news</p>
              <a href={siteConfig.social.twitter ?? "#"} target="_blank" rel="noreferrer">
                @FreshplugFarm
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
