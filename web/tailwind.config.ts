import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Freshplug clay-red / organic palette placeholders — align with
        // assets/css/style.css from the legacy static site during Phase 0
        // content migration.
        clay: {
          DEFAULT: "#b5533c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
