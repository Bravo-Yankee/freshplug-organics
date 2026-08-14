export type ProductCategory = "eggs" | "chicken" | "turkey" | "live" | "chicks";
export type ProductBadge = "organic" | "fresh";

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number; // whole KSH, no decimals
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  badge: ProductBadge;
  /** Keys vary by category: size | weight | age | sex+quantity. */
  options: Record<string, string[]>;
  /**
   * Per-value price/description override, keyed by the exact label in
   * options.weight (e.g. "4.5-5.5 kg"). Only present on products where
   * price genuinely varies by weight tier — everything else falls back to
   * the flat price/description above.
   */
  weightPricing?: Record<string, { price: number; description: string }>;
  inStock: boolean;
  featured: boolean;
}

/**
 * Ported verbatim from the legacy assets/js/shop.js hardcoded catalog.
 * As of Phase 1, this is seed input for `scripts/seed.ts` only — runtime
 * reads go through `getProducts()` in `@/lib/data/products`, which queries
 * the `products` table. Edit product data in Supabase Studio, not here.
 */
export const products: Product[] = [
  {
    id: 1,
    name: "Farm Fresh Organic Eggs - Small",
    category: "eggs",
    price: 350,
    image: "/assets/images/organic-chicken.jpg",
    description: "Fresh organic eggs from free-range hens, small size (18-24 per dozen)",
    rating: 4.9,
    reviewCount: 156,
    badge: "organic",
    options: { size: ["Small", "Medium", "Large", "Extra Large"] },
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "Farm Fresh Organic Eggs - Medium",
    category: "eggs",
    price: 400,
    image: "/assets/images/organic-chicken.jpg",
    description: "Fresh organic eggs from free-range hens, medium size",
    rating: 4.8,
    reviewCount: 203,
    badge: "organic",
    options: { size: ["Medium", "Large", "Extra Large"] },
    inStock: true,
    featured: false,
  },
  {
    id: 3,
    name: "Organic Whole Chicken",
    category: "chicken",
    price: 680,
    image: "/assets/images/organic-chicken.jpg",
    description: "Premium organic whole chicken, approximately 3-4 lbs",
    rating: 4.9,
    reviewCount: 89,
    badge: "organic",
    options: { weight: ["3-4 lbs", "4-5 lbs", "5-6 lbs"] },
    inStock: true,
    featured: true,
  },
  {
    id: 4,
    name: "Organic Chicken Breast",
    category: "chicken",
    price: 1250,
    image: "/assets/images/organic-chicken.jpg",
    description: "Boneless, skinless organic chicken breast, 2 lbs pack",
    rating: 4.7,
    reviewCount: 124,
    badge: "organic",
    options: { weight: ["1 lb", "2 lbs", "5 lbs"] },
    inStock: true,
    featured: false,
  },
  {
    id: 5,
    name: "Organic Chicken Thighs",
    category: "chicken",
    price: 850,
    image: "/assets/images/organic-chicken.jpg",
    description: "Bone-in organic chicken thighs, 2 lbs pack",
    rating: 4.8,
    reviewCount: 67,
    badge: "organic",
    options: { weight: ["2 lbs", "5 lbs", "10 lbs"] },
    inStock: true,
    featured: false,
  },
  {
    id: 6,
    name: "Heritage Turkey - Whole",
    category: "turkey",
    price: 5400,
    image: "/assets/images/organic-chicken.jpg",
    description: "Heritage breed turkey, perfect for holidays, 12-15 lbs",
    rating: 5.0,
    reviewCount: 23,
    badge: "fresh",
    options: { weight: ["10-12 lbs", "12-15 lbs", "15-18 lbs", "18+ lbs"] },
    inStock: true,
    featured: true,
  },
  {
    id: 7,
    name: "Turkey Breast",
    category: "turkey",
    price: 1980,
    image: "/assets/images/organic-chicken.jpg",
    description: "Organic turkey breast, bone-in, 4-6 lbs",
    rating: 4.9,
    reviewCount: 34,
    badge: "organic",
    options: { weight: ["3-4 lbs", "4-6 lbs", "6-8 lbs"] },
    inStock: true,
    featured: false,
  },
  {
    id: 8,
    name: "Rhode Island Red Hens",
    category: "live",
    price: 2100,
    image: "/assets/images/hero-farm.jpg",
    description: "Healthy Rhode Island Red laying hens, 6-8 months old",
    rating: 4.6,
    reviewCount: 78,
    badge: "fresh",
    options: { age: ["6-8 months", "8-12 months", "12+ months"] },
    inStock: true,
    featured: false,
  },
  {
    id: 9,
    name: "Buff Orpington Hens",
    category: "live",
    price: 2280,
    image: "/assets/images/hero-farm.jpg",
    description: "Docile Buff Orpington hens, excellent for families",
    rating: 4.8,
    reviewCount: 45,
    badge: "fresh",
    options: { age: ["6-8 months", "8-12 months"] },
    inStock: true,
    featured: false,
  },
  {
    id: 10,
    name: "Cornish Cross Broilers",
    category: "live",
    price: 1500,
    image: "/assets/images/hero-farm.jpg",
    description: "Fast-growing broiler chickens, 6-8 weeks old",
    rating: 4.5,
    reviewCount: 92,
    badge: "fresh",
    options: { age: ["4-6 weeks", "6-8 weeks", "8-10 weeks"] },
    inStock: true,
    featured: false,
  },
  {
    id: 11,
    name: "Day-old Rhode Island Red Chicks",
    category: "chicks",
    price: 120,
    image: "/assets/images/hero-farm.jpg",
    description: "Day-old Rhode Island Red chicks, straight run",
    rating: 4.7,
    reviewCount: 156,
    badge: "fresh",
    options: {
      sex: ["Straight Run", "Pullets", "Cockerels"],
      quantity: ["10 chicks", "25 chicks", "50 chicks", "100 chicks"],
    },
    inStock: true,
    featured: false,
  },
  {
    id: 12,
    name: "Day-old Buff Orpington Chicks",
    category: "chicks",
    price: 150,
    image: "/assets/images/hero-farm.jpg",
    description: "Day-old Buff Orpington chicks, excellent breed for beginners",
    rating: 4.8,
    reviewCount: 89,
    badge: "fresh",
    options: {
      sex: ["Straight Run", "Pullets"],
      quantity: ["10 chicks", "25 chicks", "50 chicks"],
    },
    inStock: true,
    featured: false,
  },
];
