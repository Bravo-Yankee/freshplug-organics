# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, multi-page marketing/e-commerce website for Freshplug Organics, a poultry farm business in Kenya. There is no backend, no build system, and no package manager — it's plain HTML5/CSS3/vanilla JS (ES6+) served as-is. All pricing is in Kenyan Shillings (KSH).

## Running locally

There is no build/lint/test tooling in this repo (no `package.json`). To preview changes, serve the directory as static files:

```bash
python3 -m http.server 8080
# or
npx http-server -p 8080
```

Then open `http://localhost:8080`. Since there's no bundler, edits to `.html`/`.css`/`.js` files are reflected on browser refresh with no compile step.

## Architecture

### No templating — pages are hand-duplicated

Every top-level `.html` file (`index.html`, `shop.html`, `about.html`, `products.html`, `gallery.html`, `blog.html`, `contact.html`, `faq.html`, `process.html`, `customer-account.html`, `admin-dashboard.html`, `privacy-policy.html`, `terms-of-service.html`) contains its own full copy of the `<nav>` and footer markup. There is no include/partial mechanism. **A change to the navbar or footer must be repeated by hand across all 13 files.**

### Global scripts, not modules

Nothing under `assets/js/` uses `import`/`export`. Every script is loaded via a plain `<script src="...">` tag and runs in the global scope. Each page loads `assets/js/main.js` first, then zero or more page-specific scripts:

- `shop.html` → `main.js`, `shop.js`
- `blog.html` → `main.js`, `blog.js`
- `gallery.html` → `main.js`, `gallery.js` (+ `gallery-data.js` for photo metadata)
- `customer-account.html` → `main.js`, `analytics.js`, `customer-account.js`
- `admin-dashboard.html` → `main.js`, `mpesa-integration.js`, `marketing-automation.js`, `admin-dashboard.js`
- All other pages → `main.js` only

Because everything is global, several helpers (`showNotification`, `validateEmail`) are copy-pasted independently into `main.js` and page-specific scripts rather than shared — this is intentional duplication given the no-module setup, not an oversight to "fix" by deduplicating unless asked.

### Guard DOM lookups in `main.js` — most pages don't have every element

`main.js` is loaded on every page, but only `index.html` and `blog.html` contain a `.newsletter-form` element. The newsletter-submit wiring is guarded with a null check (`if (newsletterForm) {...}`) precisely because an unguarded `querySelector(...).addEventListener(...)` there would throw on every other page and silently abort all subsequent top-level code in the file (WhatsApp quick-order button injection, scroll-triggered animations, lazy loading, search init, analytics tracking, service worker registration). When adding new global logic to `main.js`, keep guarding DOM lookups the same way — don't assume an element used on one page exists on all of them.

### localStorage is the only "database"

There is no server and no real persistence layer. State is stored entirely in `localStorage` under `freshplug_*`-prefixed keys, e.g.:

- `freshplug_cart` — shopping cart (read/written independently by both `main.js` and `shop.js` as separate `cart`/`shoppingCart` arrays)
- `freshplug_customer`, `freshplug_customers` — customer account / admin customer list
- `freshplug_orders`, `freshplug_subscriptions`, `freshplug_addresses`, `freshplug_preferences`, `freshplug_loyalty`
- `freshplug_analytics`, `freshplug_activity_log`, `freshplug_admin_settings`, `freshplug_sent_emails`, `freshplug_campaigns`
- `customer_journey`, `ab_test_variants`

Treat `admin-dashboard.js`, `customer-account.js`, `marketing-automation.js`, and `analytics.js` as simulating a backend purely against these browser-local keys — there is no shared/multi-user state.

### Checkout is WhatsApp, not payment processing

The real, functioning "checkout" is `shop.js`'s `proceedToCheckout()`: it serializes the cart into a message and opens a `https://wa.me/<number>?text=...` deep link. `assets/js/mpesa-integration.js` defines an M-Pesa STK Push class (`MpesaPaymentGateway`) against Safaricom's sandbox API, but it's wired with placeholder credentials (`YOUR_CONSUMER_KEY`, etc.) and isn't connected to a real backend or invoked from the checkout flow — treat it as a reference scaffold, not working payment integration.

The business WhatsApp number (`254714221885`) is hardcoded independently in `main.js`, `shop.js`, and `mpesa-integration.js`, plus referenced directly in several `.html` files. There's no single source of truth for it.

### `drive_assets/`

`drive_assets` is a symlinked local Google Drive folder (gitignored) used for pulling in source images/media outside the repo — it won't exist in a fresh checkout and shouldn't be treated as part of the project's source.

### Root-level `*_SUMMARY.md` / `*_IMPLEMENTATION.md` files

`CURRENCY_CONVERSION_SUMMARY.md`, `FOOTER_YEAR_UPDATE.md`, `LEGAL_PAGES_SUMMARY.md`, `LEGAL_PAGES_IMPLEMENTATION.md`, and `GITHUB_UPLOAD_GUIDE.md` are point-in-time change write-ups from past work sessions, not living documentation — useful for historical context (e.g. the USD→KSH conversion used ~150 KSH = 1 USD) but not guaranteed to reflect current prices/content.
