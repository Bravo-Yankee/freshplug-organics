export type FaqCategory =
  | "products"
  | "ordering"
  | "delivery"
  | "organic"
  | "farm"
  | "general";

export interface Faq {
  category: FaqCategory;
  question: string;
  answer: string;
}

export const faqCategories: { key: FaqCategory | "all"; label: string }[] = [
  { key: "all", label: "All Questions" },
  { key: "products", label: "Products" },
  { key: "ordering", label: "Ordering" },
  { key: "delivery", label: "Delivery" },
  { key: "organic", label: "Organic Practices" },
  { key: "farm", label: "Farm Visits" },
];

// Ported verbatim from the legacy faq.html. Also reused as grounding
// context for the Phase 2 AI chatbot's product Q&A / FAQ system prompt.
export const faqs: Faq[] = [
  {
    category: "products",
    question: "What makes your eggs different from store-bought eggs?",
    answer:
      "Our eggs come from hens that are truly free-range, feeding on organic grasses, insects, and certified organic feed. This results in eggs with richer yolks, better flavor, and higher nutritional content including more omega-3 fatty acids and vitamins A and E compared to conventional eggs.",
  },
  {
    category: "products",
    question: "Are all your products certified organic?",
    answer:
      "Yes! We are USDA Certified Organic, which means our animals are fed 100% organic feed, have access to the outdoors, and are raised without antibiotics, hormones, or synthetic chemicals. We undergo annual inspections to maintain our certification.",
  },
  {
    category: "products",
    question: "What breeds of chickens do you raise?",
    answer:
      "We raise several heritage and popular breeds including Rhode Island Reds, Buff Orpingtons, New Hampshire Reds, and Barred Plymouth Rocks for laying hens. For meat birds, we raise Cornish Cross and Freedom Ranger varieties.",
  },
  {
    category: "ordering",
    question: "How do I place an order?",
    answer:
      "You can order through our website, call us at +254 726 233705 or +254 794 791913, send us a WhatsApp message, or visit our farm store. Online orders are processed Monday through Friday, and we'll confirm availability within 24 hours.",
  },
  {
    category: "ordering",
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, check, credit/debit cards, and mobile payments like Apple Pay and Google Pay. For delivery orders, payment can be made upon delivery or in advance.",
  },
  {
    category: "ordering",
    question: "Is there a minimum order requirement?",
    answer:
      "For delivery, we have a minimum order of KSH 1,500. For pickup at the farm, there's no minimum order. We offer free delivery for orders over KSH 3,000 within our 20-mile delivery radius.",
  },
  {
    category: "delivery",
    question: "What areas do you deliver to?",
    answer:
      "We deliver within a 20-mile radius of our farm. This includes most of the surrounding counties. Contact us with your zip code to confirm if we deliver to your area.",
  },
  {
    category: "delivery",
    question: "How often do you deliver?",
    answer:
      "We deliver three times per week - Monday and Wednesday mornings, and Friday afternoons. You can also set up weekly or bi-weekly deliveries and save 10% on regular orders.",
  },
  {
    category: "delivery",
    question: "How do you keep products fresh during delivery?",
    answer:
      "We use insulated coolers and ice packs to maintain proper temperatures during transport. Eggs and dairy products are kept refrigerated, and meat products are kept frozen until delivery.",
  },
  {
    category: "organic",
    question: "What do you feed your chickens?",
    answer:
      "Our chickens eat certified organic feed made from corn, soybeans, and other grains, plus whatever they forage naturally including grass, insects, worms, and seeds. No GMOs, antibiotics, or artificial additives.",
  },
  {
    category: "organic",
    question: "How much space do your chickens have?",
    answer:
      "Our chickens have access to large pastures with a minimum of 108 square feet per bird outdoors, well exceeding organic standards. They can roam freely during daylight hours and return to secure coops at night for protection.",
  },
  {
    category: "organic",
    question: "Do you use any medications or vaccines?",
    answer:
      "We never use antibiotics or growth hormones. We do provide necessary vaccinations for chick health as required by organic standards, but focus on prevention through good nutrition, clean living conditions, and natural healthcare practices.",
  },
  {
    category: "farm",
    question: "Can I visit your farm?",
    answer:
      "Absolutely! We offer guided tours on Tuesdays and Thursdays from 2-4 PM, and Saturdays from 10 AM-2 PM. Please call ahead to reserve your spot. Group tours for schools and organizations can be arranged by appointment.",
  },
  {
    category: "farm",
    question: "Is there a fee for farm tours?",
    answer:
      "Farm tours are free for families and small groups (up to 6 people). For larger groups or educational tours, we charge KSH 300 per person to help cover our time and resources. Children under 5 are always free.",
  },
  {
    category: "farm",
    question: "What should I expect during a farm tour?",
    answer:
      "During our 45-60 minute tours, you'll see our chicken coops and pastures, learn about organic farming practices, watch the chickens in action, and visit our egg collection and processing areas. You'll also have a chance to ask questions and purchase fresh products.",
  },
  {
    category: "general",
    question: "How long do your eggs stay fresh?",
    answer:
      "Our eggs stay fresh for 4-5 weeks when refrigerated properly. We date all our egg cartons, and unlike store eggs that can be weeks old when purchased, our eggs are typically collected within 1-3 days of laying.",
  },
  {
    category: "general",
    question: "Do you offer wholesale pricing?",
    answer:
      "Yes! We offer wholesale pricing for restaurants, grocery stores, and other businesses. Wholesale orders require a minimum purchase and advance ordering. Contact us to discuss wholesale pricing and availability.",
  },
  {
    category: "general",
    question: "Can I return products if I'm not satisfied?",
    answer:
      "We stand behind the quality of our products. If you're not completely satisfied, contact us within 48 hours of purchase and we'll make it right with a replacement or full refund.",
  },
];
