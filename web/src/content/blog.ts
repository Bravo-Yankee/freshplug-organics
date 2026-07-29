export type BlogCategory =
  | "farming-tips"
  | "recipes"
  | "health"
  | "farm-life"
  | "sustainability"
  | "news";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  /**
   * Placeholder stub inherited from the legacy site — no real long-form
   * article body exists yet anywhere in the codebase. Authoring real
   * content here is an owner/content task, not an engineering one (see
   * migration plan, Phase 0 notes).
   */
  content: string;
  category: BlogCategory;
  author: string;
  date: string; // ISO date, "YYYY-MM-DD"
  readTime: number; // minutes
  views: number;
  comments: number;
  featured: boolean;
  /**
   * NOTE: these paths point at assets/images/blog/<file>, a directory that
   * does not exist in the legacy repo (confirmed during migration audit) —
   * every one of these currently 404s behind an onerror fallback. Carried
   * over as-is; needs real photography before launch.
   */
  image: string;
  tags: string[];
}

// Ported verbatim (metadata only) from the legacy assets/js/blog.js.
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Essential Tips for Raising Healthy Free-Range Chickens",
    excerpt:
      "Learn the fundamental practices that ensure your chickens thrive in a free-range environment. From proper nutrition to disease prevention.",
    content: "Full article content would go here...",
    category: "farming-tips",
    author: "John Anderson",
    date: "2024-01-15",
    readTime: 5,
    views: 1250,
    comments: 23,
    featured: true,
    image: "/assets/images/blog/chicken-care-tips.jpg",
    tags: ["chicken care", "free range", "poultry health"],
  },
  {
    id: 2,
    title: "Farm-Fresh Egg Breakfast Recipe Collection",
    excerpt:
      "Delicious and nutritious breakfast recipes featuring our farm-fresh organic eggs. Perfect for starting your day with wholesome goodness.",
    content: "Full article content would go here...",
    category: "recipes",
    author: "Mary Anderson",
    date: "2024-01-12",
    readTime: 8,
    views: 890,
    comments: 15,
    featured: false,
    image: "/assets/images/blog/egg-recipes.jpg",
    tags: ["recipes", "fresh eggs", "breakfast", "nutrition"],
  },
  {
    id: 3,
    title: "Why Organic Poultry Farming Matters for Your Health",
    excerpt:
      "Discover the health benefits of choosing organic poultry products and how our farming practices contribute to better nutrition.",
    content: "Full article content would go here...",
    category: "health",
    author: "Dr. Sarah Wilson",
    date: "2024-01-10",
    readTime: 6,
    views: 2100,
    comments: 42,
    featured: true,
    image: "/assets/images/blog/organic-benefits.jpg",
    tags: ["organic farming", "health", "nutrition", "sustainable"],
  },
  {
    id: 4,
    title: "A Day in the Life at Freshplug Organics Farm",
    excerpt:
      "Follow us through a typical day at our organic poultry farm, from sunrise feeding routines to evening care practices.",
    content: "Full article content would go here...",
    category: "farm-life",
    author: "Farm Team",
    date: "2024-01-08",
    readTime: 4,
    views: 750,
    comments: 18,
    featured: false,
    image: "/assets/images/blog/farm-day.jpg",
    tags: ["farm life", "daily routine", "chicken care"],
  },
  {
    id: 5,
    title: "Sustainable Farming Practices: Our Environmental Commitment",
    excerpt:
      "Learn about our environmental initiatives and how sustainable farming practices benefit both our birds and the planet.",
    content: "Full article content would go here...",
    category: "sustainability",
    author: "Environmental Team",
    date: "2024-01-05",
    readTime: 7,
    views: 1680,
    comments: 31,
    featured: false,
    image: "/assets/images/blog/sustainability.jpg",
    tags: ["sustainability", "environment", "organic farming"],
  },
  {
    id: 6,
    title: "Seasonal Care: Preparing Your Chickens for Winter",
    excerpt:
      "Essential winter preparation tips to keep your chickens healthy, warm, and productive during the colder months.",
    content: "Full article content would go here...",
    category: "farming-tips",
    author: "John Anderson",
    date: "2024-01-03",
    readTime: 6,
    views: 920,
    comments: 27,
    featured: false,
    image: "/assets/images/blog/winter-care.jpg",
    tags: ["winter care", "chicken care", "seasonal farming"],
  },
  {
    id: 7,
    title: "Farm Expansion Announcement: New Facilities Coming Soon",
    excerpt:
      "Exciting news about our farm expansion plans, including new facilities and increased production capacity to serve more customers.",
    content: "Full article content would go here...",
    category: "news",
    author: "Management Team",
    date: "2024-01-01",
    readTime: 3,
    views: 560,
    comments: 12,
    featured: false,
    image: "/assets/images/blog/farm-expansion.jpg",
    tags: ["farm news", "expansion", "growth"],
  },
  {
    id: 8,
    title: "Nutritional Benefits of Pasture-Raised Eggs vs Store-Bought",
    excerpt:
      "A comprehensive comparison of the nutritional content between pasture-raised eggs and conventional store-bought eggs.",
    content: "Full article content would go here...",
    category: "health",
    author: "Dr. Sarah Wilson",
    date: "2023-12-28",
    readTime: 9,
    views: 3200,
    comments: 58,
    featured: true,
    image: "/assets/images/blog/egg-nutrition.jpg",
    tags: ["nutrition", "pasture raised", "health", "comparison"],
  },
  {
    id: 9,
    title: "Customer Spotlight: Local Restaurant Partnership Success",
    excerpt:
      "Featuring our partnership with local restaurants and how farm-to-table relationships benefit the entire community.",
    content: "Full article content would go here...",
    category: "news",
    author: "Marketing Team",
    date: "2023-12-25",
    readTime: 4,
    views: 680,
    comments: 14,
    featured: false,
    image: "/assets/images/blog/restaurant-partnership.jpg",
    tags: ["partnerships", "farm to table", "community"],
  },
  {
    id: 10,
    title: "Homemade Chicken Feed: Organic Recipes and Tips",
    excerpt:
      "Learn how to create nutritious, organic chicken feed at home using natural ingredients for healthier, happier birds.",
    content: "Full article content would go here...",
    category: "farming-tips",
    author: "John Anderson",
    date: "2023-12-22",
    readTime: 8,
    views: 1450,
    comments: 35,
    featured: false,
    image: "/assets/images/blog/chicken-feed.jpg",
    tags: ["chicken feed", "organic", "diy", "nutrition"],
  },
];
