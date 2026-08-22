/**
 * Single source of truth for business info that used to be hand-copied
 * (inconsistently) across all 13 static HTML pages. See the migration plan
 * "Open questions" section — the two landline numbers below are preserved
 * as-is pending an owner decision on which is authoritative.
 */
export const siteConfig = {
  name: "Freshplug Organics",
  legalName: "Freshplug Organics Poultry Farm",
  description:
    "Premium organic poultry products from our farm to your table. Committed to sustainable farming and exceptional quality.",
  url: "https://freshplug.org",
  email: "freshplugorganics@gmail.com",
  whatsapp: "254714221885",
  whatsappDisplay: "+254 714 221885",
  phones: ["+254 726 233705", "+254 794 791913"],
  address: {
    line: "Freshplug Organics Farm, Ikumbi, Murang'a, Kenya",
    short: "Ikumbi, Murang'a, Kenya",
    mapsUrl: "https://maps.google.com/?q=-0.7889639556470779,36.89769570119482",
  },
  hours: "Mon-Sat: 8AM-6PM",
  currency: "KSH",
  social: {
    // All dead "#" placeholders in the legacy site — fill in with real
    // profile URLs, or remove the icons from <Footer> entirely.
    facebook: null,
    instagram: null,
    twitter: null,
    youtube: null,
  },
} as const;

export function whatsappOrderLink(message: string): string {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
