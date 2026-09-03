import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { BackToTop } from "@/components/layout/BackToTop";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export type FooterVariant = "marketing" | "legal";

interface FooterProps {
  variant: FooterVariant;
}

const socialIcons = [
  { key: "facebook", icon: "fab fa-facebook", label: "Facebook" },
  { key: "instagram", icon: "fab fa-instagram", label: "Instagram" },
  { key: "twitter", icon: "fab fa-twitter", label: "Twitter" },
  { key: "youtube", icon: "fab fa-youtube", label: "YouTube" },
] as const;

/**
 * Shared footer replacing the 3 divergent footer implementations that
 * existed across the legacy site (see migration plan). Fixes a known bug
 * carried in every legacy footer: the legal links pointed at non-existent
 * privacy.html/terms.html instead of the real page files.
 */
export function Footer({ variant }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className={variant === "legal" ? "footer-brand" : "footer-logo"}>
                <Image
                  src="/assets/images/freshplug-logo-icon.png"
                  alt="Freshplug Organics Poultry Farm"
                  width={40}
                  height={40}
                />
                {variant === "marketing" && <h3>{siteConfig.name}</h3>}
                {variant === "legal" && <p>{siteConfig.description}</p>}
              </div>
              {variant === "marketing" && (
                <>
                  <p>{siteConfig.description}</p>
                  <div className="social-links">
                    {socialIcons.map(({ key, icon, label }) => (
                      <a href={siteConfig.social[key] ?? "#"} key={key} aria-label={label}>
                        <i className={icon} />
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/products">Products</Link>
                </li>
                <li>
                  <Link href="/shop">Shop Online</Link>
                </li>
                <li>
                  <Link href="/gallery">Gallery</Link>
                </li>
                <li>
                  <Link href="/blog">Farm Blog</Link>
                </li>
              </ul>
            </div>

            {variant === "marketing" ? (
              <div className="footer-section">
                <h4>Products</h4>
                <ul>
                  <li>
                    <Link href="/shop#eggs">Fresh Eggs</Link>
                  </li>
                  <li>
                    <Link href="/shop#chicken">Organic Chicken</Link>
                  </li>
                  <li>
                    <Link href="/shop#live">Live Chickens</Link>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="footer-section">
                <h4>Legal</h4>
                <ul>
                  <li>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service">Terms of Service</Link>
                  </li>
                  <li>
                    <Link href="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link href="/process">Our Process</Link>
                  </li>
                </ul>
              </div>
            )}

            <div className="footer-section">
              <h4>Contact Info</h4>
              <div className="contact-info">
                <p>
                  <i className="fas fa-map-marker-alt" /> {siteConfig.address.line}
                </p>
                <p>
                  <i className="fas fa-phone" /> {siteConfig.phones.join(" | ")}
                </p>
                <p>
                  <i className="fas fa-envelope" /> {siteConfig.email}
                </p>
                {variant === "marketing" && (
                  <p>
                    <i className="fas fa-clock" /> {siteConfig.hours}
                  </p>
                )}
              </div>
              {variant === "marketing" && (
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  className="whatsapp-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fab fa-whatsapp" /> WhatsApp Us
                </a>
              )}
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              &copy; {year} {siteConfig.legalName}. All rights reserved.
            </p>
            {variant === "marketing" && (
              <div className="footer-links">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms-of-service">Terms of Service</Link>
                <Link href="/faq">FAQ</Link>
              </div>
            )}
          </div>
        </div>
      </footer>

      {variant === "marketing" && (
        <div className="whatsapp-float">
          <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">
            <i className="fab fa-whatsapp" />
          </a>
        </div>
      )}

      <BackToTop />
      <BottomTabBar />
    </>
  );
}
