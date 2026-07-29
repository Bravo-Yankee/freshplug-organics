# Freshplug Organics Poultry Farm - Image Collection

This directory contains all the images used throughout the Freshplug Organics website, sourced from high-quality open-source platforms.

## Image Categories

### 🏠 **Logo & Branding**
- `logo.png` - Main company logo (used in header/footer)
- `freshplug-logo.svg`, `freshplug-logo-small.svg` - Logo variants used in nav/footer

### 🐔 **Chickens & Poultry**
- `hero-farm.jpg` - Close-up hen with flock in background; used for live birds/chicks/general chicken imagery
- `organic-chicken.jpg` - Close-up organic hen; used for chicken/egg product imagery

### 🚜 **Farm Facilities**
- `farm-facility.jpg` - Farm animals
- `farm-landscape.jpg` - Scenic farm/field landscape
- `organic-feed.jpg` - Organic grain feed

### 👥 **People & Community**
- `customer1.jpg`, `customer2.jpg`, `customer3.jpg` - Headshot photos (also reused for team/testimonial placeholders)
- `team-member.jpg` - Farm team member headshot
- `visitors-farm.jpg` - People outdoors; used for farm-visit imagery

### 🏆 **Certification Badges**
- `organic-certified.svg` - Certified Organic badge
- `animal-welfare.svg` - Animal Welfare Approved badge
- `sustainable.svg` - Sustainable Farming badge
- `local-farm.svg` - Proudly Local badge

### 🖼️ **Fallback Placeholders**
- `placeholder.jpg` - Generic onerror fallback for shop/product images (copy of organic-chicken.jpg)
- `blog-placeholder.jpg` - onerror fallback for blog post thumbnails (copy of organic-chicken.jpg)
- `placeholder-gallery.jpg` - onerror fallback for gallery thumbnails (copy of hero-farm.jpg)

## Known limitations

There are no dedicated photos for eggs, live/day-old chicks, or individual blog posts — pages
that need those reuse `organic-chicken.jpg` / `hero-farm.jpg` rather than a purpose-shot photo.
Several originally-named files (`live-chickens.jpg`, `happy-hens.jpg`, `fresh-eggs.jpg`,
`egg-collection.jpg`, `farm-chickens.jpg`, `farm-equipment.jpg`) turned out to be mismatched
stock photos (dogs, a roast dinner, corn, strawberries) unrelated to their filenames and were
removed; anything that referenced them now points at a correctly-labeled existing photo instead.

## Image Sources & Licensing

Images are sourced from **Unsplash** (https://unsplash.com) and **Pexels**, under licenses that are:
- ✅ Free to use for any purpose
- ✅ No permission needed
- ✅ Commercial and non-commercial use allowed
- ✅ No attribution required (though appreciated)

## Technical Specifications

- **Format**: JPEG for photos, SVG for badges, PNG for the main logo
- **Dimensions**: Responsive sizing optimized for web

## File Structure
```
assets/images/
├── README.md (this file)
├── logo.png
├── freshplug-logo.svg
├── freshplug-logo-small.svg
├── hero-farm.jpg
├── organic-chicken.jpg
├── farm-facility.jpg
├── farm-landscape.jpg
├── organic-feed.jpg
├── customer1.jpg
├── customer2.jpg
├── customer3.jpg
├── team-member.jpg
├── visitors-farm.jpg
├── organic-certified.svg
├── animal-welfare.svg
├── sustainable.svg
├── local-farm.svg
├── placeholder.jpg
├── blog-placeholder.jpg
└── placeholder-gallery.jpg
```
