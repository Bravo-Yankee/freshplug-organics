import type { Metadata } from "next";
import { Bullet } from "@/components/legal/Bullet";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsOfServicePage() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: November 2024</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Agreement to Terms</h2>
          <p>
            Welcome to Freshplug Organics Poultry Farm. These Terms of Service (&quot;Terms&quot;)
            govern your use of our website, purchase of our products, and access to our services.
            By using our website or purchasing our products, you agree to be bound by these Terms.
          </p>
          <p>If you do not agree with any part of these Terms, you may not access our website or purchase our products.</p>
        </section>

        <section className="legal-section">
          <h2>2. About Freshplug Organics</h2>
          <p>
            Freshplug Organics Poultry Farm is a licensed organic poultry farming business
            operating in Kenya. We specialize in:
          </p>
          <ul>
            <li>Organic free-range chicken and eggs</li>
            <li>Live poultry (chickens, turkeys, and other birds)</li>
            <li>Day-old chicks and breeding stock</li>
            <li>Agricultural consulting and farm tours</li>
            <li>Educational workshops on sustainable farming</li>
          </ul>
          <p>All our products are produced in compliance with Kenyan agricultural standards and organic certification requirements.</p>
        </section>

        <section className="legal-section">
          <h2>3. Product Orders and Sales</h2>

          <h3>3.1 Order Placement</h3>
          <ul>
            <Bullet label="Website Orders">Orders can be placed through our website shopping cart system</Bullet>
            <Bullet label="WhatsApp Orders">Orders can be placed via our WhatsApp Business account</Bullet>
            <Bullet label="Phone Orders">Orders accepted during business hours</Bullet>
            <Bullet label="Order Confirmation">All orders require confirmation before processing</Bullet>
          </ul>

          <h3>3.2 Pricing and Payment</h3>
          <ul>
            <Bullet label="Currency">All prices are displayed in Kenyan Shillings (KSH)</Bullet>
            <Bullet label="Payment Methods">M-Pesa, bank transfer, cash on delivery (where available)</Bullet>
            <Bullet label="Price Changes">Prices may change due to market conditions; orders are honored at confirmed price</Bullet>
            <Bullet label="Taxes">VAT included where applicable as per Kenyan tax law</Bullet>
          </ul>

          <h3>3.3 Minimum Orders and Delivery</h3>
          <ul>
            <Bullet label="Minimum Order">KSH 1,500 for delivery orders</Bullet>
            <Bullet label="Free Delivery">Orders over KSH 3,000 within 20km radius</Bullet>
            <Bullet label="Delivery Areas">Service area clearly specified at checkout</Bullet>
            <Bullet label="Delivery Times">Estimated delivery windows provided; subject to weather and road conditions</Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Product Quality and Food Safety</h2>

          <h3>4.1 Quality Assurance</h3>
          <ul>
            <Bullet label="Organic Standards">Products meet certified organic farming standards</Bullet>
            <Bullet label="Freshness Guarantee">Eggs delivered within 3 days of laying</Bullet>
            <Bullet label="Health Inspections">Regular veterinary health checks for all livestock</Bullet>
            <Bullet label="Traceability">Full product traceability maintained as required by law</Bullet>
          </ul>

          <h3>4.2 Handling Instructions</h3>
          <ul>
            <Bullet label="Refrigeration">Perishable products must be refrigerated immediately</Bullet>
            <Bullet label="Consumption Timeline">Fresh products best consumed within specified timeframes</Bullet>
            <Bullet label="Safe Handling">Customers responsible for proper food safety practices</Bullet>
            <Bullet label="Live Animals">Special handling and care instructions provided</Bullet>
          </ul>

          <h3>4.3 Quality Issues</h3>
          <ul>
            <Bullet label="Inspection">Customers should inspect products immediately upon delivery</Bullet>
            <Bullet label="Reporting">Quality issues must be reported within 24 hours</Bullet>
            <Bullet label="Documentation">Photos and descriptions required for quality claims</Bullet>
            <Bullet label="Resolution">Replacement or refund provided for verified quality issues</Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Live Animal Sales</h2>

          <h3>5.1 Health and Welfare</h3>
          <ul>
            <Bullet label="Health Certificates">All birds come with health documentation</Bullet>
            <Bullet label="Vaccination Records">Complete vaccination history provided</Bullet>
            <Bullet label="Quarantine">Recommended quarantine period for new birds</Bullet>
            <Bullet label="Animal Welfare">Compliance with animal welfare standards</Bullet>
          </ul>

          <h3>5.2 Transportation</h3>
          <ul>
            <Bullet label="Proper Containers">Safe transportation containers provided or specified</Bullet>
            <Bullet label="Journey Time">Minimized transport time for animal welfare</Bullet>
            <Bullet label="Weather Conditions">Transport scheduled for appropriate weather</Bullet>
            <Bullet label="Stress Minimization">Measures taken to reduce transport stress</Bullet>
          </ul>

          <h3>5.3 Customer Responsibilities</h3>
          <ul>
            <Bullet label="Suitable Housing">Proper housing prepared before delivery</Bullet>
            <Bullet label="Biosecurity">Basic biosecurity measures at customer location</Bullet>
            <Bullet label="Ongoing Care">Customer responsible for proper care after delivery</Bullet>
            <Bullet label="Local Regulations">Compliance with local zoning and animal-keeping laws</Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Delivery and Logistics</h2>

          <h3>6.1 Delivery Areas</h3>
          <ul>
            <Bullet label="Service Coverage">Delivery available within specified geographic areas</Bullet>
            <Bullet label="Route Planning">Efficient delivery routes planned for product freshness</Bullet>
            <Bullet label="Remote Locations">Additional charges may apply for remote deliveries</Bullet>
            <Bullet label="Access Requirements">Reasonable vehicle access required</Bullet>
          </ul>

          <h3>6.2 Delivery Schedule</h3>
          <ul>
            <Bullet label="Business Days">Standard deliveries Monday through Saturday</Bullet>
            <Bullet label="Time Windows">4-hour delivery windows provided</Bullet>
            <Bullet label="Weather Delays">Deliveries may be postponed for severe weather</Bullet>
            <Bullet label="Road Conditions">Impassable roads may delay delivery</Bullet>
          </ul>

          <h3>6.3 Failed Deliveries</h3>
          <ul>
            <Bullet label="Customer Availability">Customer must be available during delivery window</Bullet>
            <Bullet label="Rescheduling">Failed deliveries rescheduled for next available slot</Bullet>
            <Bullet label="Additional Charges">Repeated failed deliveries may incur additional fees</Bullet>
            <Bullet label="Perishable Products">Special arrangements for time-sensitive products</Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Returns and Refunds</h2>

          <h3>7.1 Return Policy</h3>
          <ul>
            <Bullet label="Fresh Products">Returns only accepted for quality issues</Bullet>
            <Bullet label="Live Animals">Returns must be pre-approved due to biosecurity</Bullet>
            <Bullet label="Time Limit">Return requests must be made within 24 hours</Bullet>
            <Bullet label="Original Condition">Products must be in original condition for return</Bullet>
          </ul>

          <h3>7.2 Refund Process</h3>
          <ul>
            <Bullet label="Investigation">All refund requests investigated promptly</Bullet>
            <Bullet label="Processing Time">Refunds processed within 7 business days</Bullet>
            <Bullet label="Refund Method">Refunds issued via original payment method</Bullet>
            <Bullet label="Partial Refunds">Partial refunds for partial quality issues</Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>8. Farm Visits and Tours</h2>

          <h3>8.1 Booking and Scheduling</h3>
          <ul>
            <Bullet label="Advance Booking">Farm visits must be booked in advance</Bullet>
            <Bullet label="Group Size">Maximum group sizes specified for each tour type</Bullet>
            <Bullet label="Educational Tours">Special arrangements for schools and institutions</Bullet>
            <Bullet label="Private Tours">Private tours available by special arrangement</Bullet>
          </ul>

          <h3>8.2 Safety and Biosecurity</h3>
          <ul>
            <Bullet label="Safety Briefing">Mandatory safety briefing before farm access</Bullet>
            <Bullet label="Biosecurity Measures">Foot baths and protective equipment required</Bullet>
            <Bullet label="Supervised Access">All visitors must remain with designated guide</Bullet>
            <Bullet label="Restricted Areas">Certain farm areas off-limits to visitors</Bullet>
          </ul>

          <h3>8.3 Liability and Insurance</h3>
          <ul>
            <Bullet label="Risk Acknowledgment">Visitors acknowledge inherent farm risks</Bullet>
            <Bullet label="Supervision of Minors">Children must be supervised by adults at all times</Bullet>
            <Bullet label="Insurance">Visitors advised to have appropriate personal insurance</Bullet>
            <Bullet label="Farm Insurance">Farm maintains public liability insurance</Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>9. Limitations of Liability</h2>

          <h3>9.1 Product Liability</h3>
          <ul>
            <Bullet label="Quality Standards">We maintain high quality standards but cannot guarantee perfection</Bullet>
            <Bullet label="Proper Handling">Customer responsible for proper product handling and storage</Bullet>
            <Bullet label="Natural Variations">Natural variations in organic products acknowledged</Bullet>
            <Bullet label="External Factors">Weather, disease, and market conditions beyond our control</Bullet>
          </ul>

          <h3>9.2 Service Limitations</h3>
          <ul>
            <Bullet label="Delivery Delays">Not liable for delays due to weather, road conditions, or external factors</Bullet>
            <Bullet label="Product Availability">Product availability subject to seasonal and production factors</Bullet>
            <Bullet label="Third-Party Services">Limited liability for third-party delivery services</Bullet>
            <Bullet label="Force Majeure">Not liable for delays due to circumstances beyond reasonable control</Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>10. User Conduct and Prohibited Uses</h2>

          <h3>10.1 Acceptable Use</h3>
          <ul>
            <Bullet label="Lawful Purposes">Services must be used for lawful purposes only</Bullet>
            <Bullet label="Accurate Information">Provide accurate contact and delivery information</Bullet>
            <Bullet label="Respectful Communication">Respectful communication with staff and drivers</Bullet>
            <Bullet label="Safety Compliance">Compliance with safety instructions and guidelines</Bullet>
          </ul>

          <h3>10.2 Prohibited Activities</h3>
          <ul>
            <Bullet label="False Information">Providing false or misleading information</Bullet>
            <Bullet label="Abuse of Staff">Harassment or abuse of staff, drivers, or other customers</Bullet>
            <Bullet label="Resale">Commercial resale of products without authorization</Bullet>
            <Bullet label="Biosecurity Violations">Intentional violation of biosecurity measures</Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>11. Intellectual Property</h2>
          <p>
            All content on our website, including text, images, logos, and designs, is the
            property of Freshplug Organics Poultry Farm and is protected by Kenyan and
            international copyright laws.
          </p>
          <ul>
            <Bullet label="Limited License">Personal, non-commercial use of website content permitted</Bullet>
            <Bullet label="Restrictions">No reproduction, distribution, or modification without permission</Bullet>
            <Bullet label="Trademarks">Freshplug Organics name and logo are trademarks</Bullet>
            <Bullet label="User Content">You retain rights to content you submit but grant us license to use</Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>12. Governing Law and Dispute Resolution</h2>

          <h3>12.1 Governing Law</h3>
          <p>These Terms are governed by the laws of Kenya, including:</p>
          <ul>
            <li>Consumer Protection Act, 2012</li>
            <li>Sale of Goods Act</li>
            <li>Contract Act</li>
            <li>Agriculture and Livestock Acts</li>
          </ul>

          <h3>12.2 Dispute Resolution</h3>
          <ul>
            <Bullet label="Direct Communication">We encourage direct communication to resolve issues</Bullet>
            <Bullet label="Mediation">Disputes may be resolved through mediation</Bullet>
            <Bullet label="Legal Action">Legal disputes resolved in Kenyan courts</Bullet>
            <Bullet label="Consumer Rights">Consumer protection rights under Kenyan law preserved</Bullet>
          </ul>
        </section>

        <section className="legal-section">
          <h2>13. Changes to Terms</h2>
          <p>We may modify these Terms from time to time. Changes will be communicated through:</p>
          <ul>
            <li>Website posting with updated date</li>
            <li>Email notification to registered customers</li>
            <li>WhatsApp notification for significant changes</li>
          </ul>
          <p>Continued use of our services constitutes acceptance of modified Terms.</p>
        </section>

        <section className="legal-section">
          <h2>14. Contact Information</h2>
          <p>For questions about these Terms of Service or our business practices:</p>

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
              <strong>WhatsApp Business:</strong> +254 714 221885
            </p>
            <p>
              <strong>Business Hours:</strong> Monday - Saturday, 7:00 AM - 6:00 PM
            </p>
          </div>
        </section>

        <section className="legal-section">
          <h2>15. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, the
            remaining provisions will continue in full force and effect. Invalid provisions will
            be replaced with valid provisions that most closely reflect the original intent.
          </p>
        </section>
      </div>
    </div>
  );
}
