export type GalleryCategory =
  | "chickens"
  | "facilities"
  | "products"
  | "visitors"
  | "team";

export interface GalleryPhoto {
  id: number;
  src: string;
  title: string;
  description: string;
  category: GalleryCategory;
}

export const galleryCategories: { key: GalleryCategory | "all"; label: string }[] = [
  { key: "all", label: "All Photos" },
  { key: "chickens", label: "Happy Chickens" },
  { key: "facilities", label: "Farm Facilities" },
  { key: "products", label: "Fresh Products" },
  { key: "team", label: "Our Team" },
  { key: "visitors", label: "Farm Visitors" },
];

/**
 * Ported from the inline `galleryImages` array in the legacy
 * assets/js/gallery.js — NOT from assets/js/gallery-data.js.
 *
 * gallery-data.js (11 entries) turned out to be dead code during
 * migration audit: gallery.html only ever loads main.js + gallery.js, so
 * gallery-data.js's array was never actually rendered anywhere. This is
 * the real, currently-displayed 20-photo list. Several images are
 * intentionally reused across entries in the source data (no
 * unique-photo-per-entry guarantee) — preserved here, not a migration bug.
 */
export const galleryPhotos: GalleryPhoto[] = [
  { id: 1, src: "/assets/images/hero-farm.jpg", title: "Free-Range Chickens", description: "Our happy chickens roaming freely in natural pastures", category: "chickens" },
  { id: 2, src: "/assets/images/hero-farm.jpg", title: "Healthy Flock", description: "Well-cared for chickens enjoying outdoor life", category: "chickens" },
  { id: 3, src: "/assets/images/organic-chicken.jpg", title: "Content Laying Hens", description: "Our laying hens in their comfortable environment", category: "chickens" },
  { id: 4, src: "/assets/images/organic-chicken.jpg", title: "Organic Raised Birds", description: "Premium organic chickens raised naturally", category: "chickens" },
  { id: 5, src: "/assets/images/farm-facility.jpg", title: "Modern Farm Infrastructure", description: "State-of-the-art facilities designed for chicken welfare", category: "facilities" },
  { id: 6, src: "/assets/images/farm-landscape.jpg", title: "Beautiful Farm Landscape", description: "Scenic view of our organic poultry farm", category: "facilities" },
  { id: 7, src: "/assets/images/organic-feed.jpg", title: "Organic Feed Storage", description: "Premium organic feed for our chickens", category: "facilities" },
  { id: 8, src: "/assets/images/organic-chicken.jpg", title: "Farm-Fresh Eggs", description: "Daily collection of fresh, organic eggs", category: "products" },
  { id: 9, src: "/assets/images/hero-farm.jpg", title: "Egg Collection Process", description: "Careful collection of eggs from our happy hens", category: "products" },
  { id: 10, src: "/assets/images/visitors-farm.jpg", title: "Farm Visitors Welcome", description: "Families visiting and learning about organic farming", category: "visitors" },
  { id: 11, src: "/assets/images/team-member.jpg", title: "Daily Care Routine", description: "Our dedicated team caring for the chickens", category: "team" },
  { id: 12, src: "/assets/images/customer2.jpg", title: "Farm Manager at Work", description: "Our dedicated farm manager checking on the flock", category: "team" },
  { id: 13, src: "/assets/images/customer1.jpg", title: "Team at Work", description: "Team member providing daily care and attention", category: "team" },
  { id: 14, src: "/assets/images/visitors-farm.jpg", title: "School Farm Visit", description: "Local school children learning about organic farming", category: "visitors" },
  { id: 15, src: "/assets/images/visitors-farm.jpg", title: "Family Farm Tour", description: "Families enjoying educational farm tours", category: "visitors" },
  { id: 16, src: "/assets/images/hero-farm.jpg", title: "Broiler Chickens", description: "Healthy broiler chickens in natural environment", category: "chickens" },
  { id: 17, src: "/assets/images/farm-facility.jpg", title: "Water System", description: "Clean water delivery system for our birds", category: "facilities" },
  { id: 18, src: "/assets/images/organic-chicken.jpg", title: "Egg Packaging", description: "Careful packaging of fresh eggs for delivery", category: "products" },
  { id: 19, src: "/assets/images/hero-farm.jpg", title: "Day-old Chicks", description: "Adorable day-old chicks in nursery area", category: "chickens" },
  { id: 20, src: "/assets/images/farm-landscape.jpg", title: "Farm Entrance", description: "Welcome to Freshplug Organics Poultry Farm", category: "facilities" },
];
