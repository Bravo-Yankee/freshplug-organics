export interface Category {
  slug: string;
  label: string;
  sortOrder: number;
  /** Hides the category tab and everything in it from the shop, without deleting anything. */
  active: boolean;
}

/**
 * Seed input for scripts/seed.ts only, mirroring src/content/products.ts.
 * Runtime reads go through getCategories() in @/lib/data/products, which
 * queries the `categories` table — add/edit categories from /admin (or
 * Supabase Studio), not here.
 *
 * Turkey and Day-old Chicks are seeded inactive: not currently available
 * at the farm, so hidden from the shop until re-activated.
 */
export const categories: Category[] = [
  { slug: "eggs", label: "Fresh Eggs", sortOrder: 1, active: true },
  { slug: "chicken", label: "Chicken", sortOrder: 2, active: true },
  { slug: "turkey", label: "Turkey", sortOrder: 3, active: false },
  { slug: "live", label: "Live Birds", sortOrder: 4, active: true },
  { slug: "chicks", label: "Day-old Chicks", sortOrder: 5, active: false },
];
