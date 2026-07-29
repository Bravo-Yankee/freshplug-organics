import type { Metadata } from "next";
import { Bullet } from "@/components/legal/Bullet";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: November 2024</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Freshplug Organics Poultry Farm (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
            committed to protecting your privacy and personal information. This Privacy Policy
            explains how we collect, use, store, and protect your information when you visit our
            website, purchase our products, or interact with our services.
          </p>
          <p>
            We operate as an organic poultry farm based in Kenya, providing fresh eggs, organic
            chicken, live birds, and related agricultural products to customers throughout Kenya.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Information We Collect</h2>

          <h3>2.1 Personal Information</h3>
          <ul>
            <Bullet label="Contact Information">
              Name, email address, phone number, physical address
            </Bullet>
            <Bullet label="Order Information">
              Purchase history, delivery preferences, payment details
            </Bullet>
            <Bullet label="Account Information">Username, password, customer preferences</Bullet>
            <Bullet label="Communication Records">
              WhatsApp messages, emails, phone calls, feedback forms
            </Bullet>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <ul>
            <Bullet label="Website Usage">
              IP address, browser type, device information, pages visited
            </Bullet>
            <Bullet label="Cookies and Tracking">
              Website preferences, shopping cart contents, analytics data
            </Bullet>
            <Bullet label="Location Data">
              Delivery address, GPS coordinates for delivery optimization
            </Bullet>
          </ul>

          <h3>2.3 Agricultural and Food Safety Information</h3>
          <ul>
            <Bullet label="Dietary Requirements">
              Special dietary needs, allergies, preferences
            </Bullet>
            <Bullet label="Farm Visit Records">
              Tour bookings, visitor information, safety waivers
            </Bullet>
            <Bullet label="Quality Feedback">
              Product quality reports, customer satisfaction surveys
            </Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. How We Use Your Information</h2>

          <h3>3.1 Primary Business Operations</h3>
          <ul>
            <Bullet label="Order Processing">
              Fulfilling orders, arranging deliveries, processing payments
            </Bullet>
            <Bullet label="Customer Service">
              Responding to inquiries, resolving issues, providing support
            </Bullet>
            <Bullet label="Product Quality">
              Ensuring food safety, tracing product origins, quality control
            </Bullet>
            <Bullet label="Delivery Services">
              Route optimization, delivery scheduling, customer notifications
            </Bullet>
          </ul>

          <h3>3.2 Marketing and Communications</h3>
          <ul>
            <Bullet label="Newsletter">Farm updates, new products, seasonal availability</Bullet>
            <Bullet label="Promotions">
              Special offers, loyalty programs, seasonal discounts
            </Bullet>
            <Bullet label="Educational Content">
              Organic farming information, cooking tips, nutrition advice
            </Bullet>
          </ul>

          <h3>3.3 Legal and Regulatory Compliance</h3>
          <ul>
            <Bullet label="Food Safety">
              Maintaining traceability records as required by Kenyan law
            </Bullet>
            <Bullet label="Business Registration">
              Compliance with agricultural licensing requirements
            </Bullet>
            <Bullet label="Tax Obligations">
              Record keeping for VAT and income tax purposes
            </Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Information Sharing and Disclosure</h2>

          <h3>4.1 Service Providers</h3>
          <p>We may share your information with trusted third-party service providers:</p>
          <ul>
            <Bullet label="Delivery Partners">Local delivery services for order fulfillment</Bullet>
            <Bullet label="Payment Processors">M-Pesa, banks, and other payment platforms</Bullet>
            <Bullet label="Communication Platforms">
              WhatsApp Business, email service providers
            </Bullet>
            <Bullet label="Website Analytics">
              Google Analytics, website hosting services
            </Bullet>
          </ul>

          <h3>4.2 Legal Requirements</h3>
          <p>We may disclose information when required by:</p>
          <ul>
            <li>Kenyan government authorities for food safety inspections</li>
            <li>Court orders or legal proceedings</li>
            <li>Emergency situations involving public health or safety</li>
            <li>Investigation of fraud or illegal activities</li>
          </ul>

          <h3>4.3 Business Transfers</h3>
          <p>
            In the event of a business sale, merger, or acquisition, customer information may be
            transferred to the new owners, subject to the same privacy protections.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Data Security</h2>

          <h3>5.1 Security Measures</h3>
          <ul>
            <Bullet label="Encryption">SSL/TLS encryption for website data transmission</Bullet>
            <Bullet label="Access Controls">Limited employee access to personal information</Bullet>
            <Bullet label="Secure Storage">Protected servers and database security</Bullet>
            <Bullet label="Regular Updates">
              Software security patches and system monitoring
            </Bullet>
          </ul>

          <h3>5.2 Data Retention</h3>
          <ul>
            <Bullet label="Customer Records">
              Maintained for 7 years for business and tax purposes
            </Bullet>
            <Bullet label="Order History">Kept for traceability and customer service</Bullet>
            <Bullet label="Marketing Data">
              Retained until you opt-out or request deletion
            </Bullet>
            <Bullet label="Website Analytics">
              Anonymized data retained for business analysis
            </Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Your Rights and Choices</h2>

          <h3>6.1 Access and Control</h3>
          <p>You have the right to:</p>
          <ul>
            <Bullet label="Access">Request copies of your personal information</Bullet>
            <Bullet label="Correction">Update or correct inaccurate information</Bullet>
            <Bullet label="Deletion">Request removal of your personal data</Bullet>
            <Bullet label="Data Portability">Receive your data in a standard format</Bullet>
          </ul>

          <h3>6.2 Marketing Preferences</h3>
          <ul>
            <Bullet label="Email Unsubscribe">Use unsubscribe links in our emails</Bullet>
            <Bullet label="WhatsApp Opt-out">Reply &quot;STOP&quot; to marketing messages</Bullet>
            <Bullet label="Account Settings">Manage preferences in your customer account</Bullet>
          </ul>

          <h3>6.3 Cookie Management</h3>
          <p>
            You can control cookies through your browser settings. Note that disabling cookies
            may affect website functionality and your shopping experience.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. International Data Transfers</h2>
          <p>
            While we primarily operate within Kenya, some of our service providers (such as
            website hosting or analytics) may be located outside Kenya. We ensure appropriate
            safeguards are in place for any international data transfers.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to children under 16. We do not knowingly collect
            personal information from children under 16. If we become aware that we have
            collected information from a child under 16, we will delete it promptly.
          </p>
          <p>For farm educational visits involving children, we require parental consent and supervision.</p>
        </section>

        <section className="legal-section">
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our
            practices or legal requirements. We will notify you of any material changes by:
          </p>
          <ul>
            <li>Posting the updated policy on our website</li>
            <li>Sending email notifications to registered customers</li>
            <li>Providing notice through our WhatsApp Business account</li>
          </ul>
          <p>Continued use of our services after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section className="legal-section">
          <h2>10. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or our
            data practices, please contact us:
          </p>

          <div className="contact-info">
            <h3>Freshplug Organics Poultry Farm</h3>
            <p>
              <strong>Address:</strong> Ikumbi, Murang&apos;a, Kenya
            </p>
            <p>
              <strong>Phone:</strong> +254 726 233705 | +254 794 791913
            </p>
            <p>
              <strong>Email:</strong> freshplugorganics@gmail.com
            </p>
            <p>
              <strong>WhatsApp:</strong> +254 714 221885
            </p>
          </div>

          <p>We will respond to your inquiries within 30 days in accordance with Kenyan data protection requirements.</p>
        </section>

        <section className="legal-section">
          <h2>11. Governing Law</h2>
          <p>This Privacy Policy is governed by the laws of Kenya, including but not limited to:</p>
          <ul>
            <li>The Data Protection Act, 2019</li>
            <li>The Kenya Information and Communications Act</li>
            <li>Consumer Protection Act, 2012</li>
            <li>Food, Drugs and Chemical Substances Act</li>
          </ul>
          <p>Any disputes will be resolved in the courts of Kenya.</p>
        </section>
      </div>
    </div>
  );
}
