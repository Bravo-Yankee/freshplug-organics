# AGENTS.md — web/

This is the Next.js 14 (App Router) + TypeScript + Tailwind app for Freshplug
Organics, scaffolded to replace the static HTML site at the repo root via a
phased Jamstack migration. As of the Vercel deployment fixes described
below, **this app is what's actually live in production** — the root
static site's code is untouched, but the production Vercel project now
builds and serves `web/`, not it.

## Migration status

- **Phase 0** (done): all marketing/shop pages ported from the legacy static
  HTML with full content parity. Shared `Header`/`Footer` components and one
  canonical `useCart()` hook replaced the legacy site's divergent per-page
  implementations.
- **Phase 1** (done): Supabase (Postgres) backs products, blog posts,
  gallery photos, and FAQs; checkout writes an `orders` row and the contact
  form writes to `contact_messages`. See `supabase/schema.sql` for the
  schema and `web/README.md`-adjacent setup below.
- **Phase 2** (done): real Supabase Auth (email OTP, not a magic link — see
  the git log for why) replaces the legacy `customer-account.js`'s fake-
  customer-if-missing `localStorage` pattern. `/login` and `/account`
  (profile/orders/subscriptions/addresses) mirror the legacy layout. Also
  shipped under the "Phase 2" label: the AI chat widget (`/api/chat`,
  currently Gemini), grounded in the live product catalog and FAQ data.
- **Phase 3** (done): `/admin` — auth-gated (redirects to `/login`) and
  role-gated (redirects to `/` if `profiles.is_admin` isn't set; RLS in
  `supabase/schema.sql` is the actual enforcement, the redirect is just
  UX), showing live orders/messages/customers/stats from Supabase. This
  fully replaces the legacy root `admin-dashboard.html`.
- **Phase 4** (done): product categories moved from a hardcoded
  check-constraint list to a real `categories` table (Phase 4 block in
  `supabase/schema.sql`), and `/admin` gained a Products tab — a
  non-coder farm employee can now add a category, add a product, and
  toggle a product's/category's price, stock, and visibility without
  touching code or Studio. Turkey and Day-old Chicks are hidden this way
  (not deleted). See "Managing categories & products" below for the
  actual workflow.
- **Phase 5** (done): per-tier option pricing generalized from
  weight-only to any single priced option group.
  `products.variant_pricing` (renamed from `weight_pricing` — Phase 5
  block in `supabase/schema.sql`) now drives age-based pricing for live
  birds the same way it already drove weight-based pricing for
  chicken/turkey. `resolveVariant()` in `ShopClient.tsx` checks whichever
  option value is currently selected against this map, so it works for
  any option key without new columns. Still Studio-only to edit — no
  admin UI for it yet.
- The legacy root `customer-account.html`/`admin-dashboard.html` are now
  superseded by the above — don't extend them further, extend `web/`.
- **Phase 6** (done): `/admin` gained an AI draft assistant, backed by
  `POST /api/admin/ai-draft` (admin-gated via `isCurrentUserAdmin()`, same
  pattern as `/api/newsletter/send`) and `src/lib/ai/bitdeer.ts`. It calls
  two Bitdeer AI models that are promotional $0 right now
  (`deepseek-ai/DeepSeek-V4-Flash` drafts, `Qwen/Qwen3.8-27B` reviews/
  tightens the draft — see `draftAndPolish()`) over Bitdeer's
  OpenAI-compatible REST endpoint. Two entry points: the Products tab's
  "✨ AI Suggest" button (generates a description from name/category/price
  already in the Add Product form) and the Newsletter tab's "✨ Generate
  Draft" button (takes a one-line topic, fills subject + body). Needs
  `BITDEER_API_KEY`; without it those two buttons show an error toast,
  every other admin feature is unaffected. Since the free pricing is
  promotional, keep an eye out for these buttons erroring if Bitdeer starts
  billing for these models — `draftAndPolish()` is the only place model
  names are pinned, so swapping models later is a one-line change per call.
  Qwen3.8-27B is a reasoning model that burns hidden "thinking" tokens
  before any visible output, with highly variable length — measured
  directly against Bitdeer, the same review prompt came back with empty
  content at `max_tokens: 600` (reasoning alone used all of it) but worked
  at 3000. `MAX_TOKENS` in `bitdeer.ts` is deliberately generous (4000 for
  Qwen) to avoid that truncation, which means one AI-draft click can take
  10-45+ seconds end to end. The route sets `export const maxDuration = 90`
  to survive that on Vercel — if it ever starts 504ing in production,
  check the project's actual function timeout limit (depends on plan/Fluid
  Compute settings) before assuming the code regressed.

All of the above is deployed and confirmed working in production (see
"Deployment" below for what that took) — shop browsing, cart, checkout,
the chatbot, login/account/admin, category/product management, and
per-tier weight/age pricing have all been manually smoke-tested
end-to-end. There's no remaining planned phase; this is steady-state.

## Data layer

- Runtime reads go through `src/lib/data/{products,blog,gallery,faqs}.ts` —
  these query Supabase and map snake_case rows back to the existing
  camelCase types.
- `src/content/*.ts` still exist and still export the canonical TypeScript
  types, but their arrays are **seed data only**, consumed by
  `scripts/seed.ts`. Don't import them from components/pages — that's what
  the `@/lib/data/*` functions are for.
- **Most content edits happen in Supabase Studio's table editor**, not in
  code — still true for blog posts, gallery photos, and FAQs, which have
  no admin UI at all. Products and categories are the exception since
  Phase 4: `/admin`'s Products tab covers the common cases (see below),
  but anything beyond that — a product's `options`, or a
  `variant_pricing` tier — is still Studio-only.
- The cart stays client-side in `localStorage` (`useCart()` in
  `src/lib/cart.ts`, key `freshplug_cart`) — only the checkout-time snapshot
  is persisted server-side, as an `orders` row.
- The Contact page form (`ContactForm.tsx`) posts to `src/app/api/contact/
  route.ts`, which saves the message to `contact_messages` (as before —
  still what `/admin`'s Messages tab reads) and, via Resend, emails a
  notification to `freshplugorganics@gmail.com` with `replyTo` set to the
  submitter's address, so the farm can just hit reply. Needs
  `RESEND_API_KEY`; without it the message still saves, the email step is
  skipped, and a warning is logged. Checkout (`orders`) has no equivalent
  email notification yet — only Contact does.

## Managing categories & products

- **Add a category**: `/admin` → Products tab → type a name (e.g.
  "Dairy") into the "New category" field → Add. This inserts a row into
  `categories` — slug is auto-derived from the label (`slugify()`:
  lowercased, non-alphanumeric runs collapsed to `-`), `sort_order` is
  appended to the end (controls the `/shop` filter-tab order), `active`
  defaults to `true`. It's immediately selectable on the product form and
  shows up as a shop filter tab. Studio works too (insert directly into
  `categories`) if you'd rather set `sort_order` precisely.
- **Hide/show a category**: `/admin` → Products tab → toggle
  Visible/Hidden next to the category name. Flips `categories.active`,
  which pulls the category and every product in it from `/shop` (RLS-
  enforced, not just a UI filter) without deleting anything — same
  mechanism used for turkey/chicks.
- **Add a product**: `/admin` → Products tab → "Add Product" form (name,
  category dropdown, price, image path, description, badge). New
  products start with a default rating, no `options`, and no
  `variant_pricing`.
- **Give a product weight/age/size tiers, or per-tier pricing**: not
  covered by `/admin` — edit the new row directly in Studio's table
  editor. Set `options` (jsonb, e.g. `{"age": ["6-8 weeks", "8-10
  weeks"]}`) for the dropdown itself, and — only if price should actually
  vary by tier — `variant_pricing` (jsonb keyed by the exact option
  value, e.g. `{"8-10 weeks": {"price": 1800, "description": "..."}}`).
  Leave `variant_pricing` as `{}` for a product whose options don't
  affect price (e.g. egg size, chick sex/quantity) — `resolveVariant()`
  in `ShopClient.tsx` falls back to the flat price/description whenever a
  selected value has no entry there.

## Supabase setup (local dev)

1. Create a free Supabase project, then run `supabase/schema.sql` in
   Studio's SQL editor (tables + RLS policies).
2. Copy `.env.example` to `.env.local` and fill in your project's URL, anon
   key, and service role key.
3. `npm run seed` — one-shot, upserts `src/content/*.ts` into the new
   tables. Safe to re-run but not meant to be; re-seeding isn't how content
   updates happen going forward.
4. `npm run dev`.

The service role key is only ever read by `scripts/seed.ts` (bypasses RLS
to bootstrap tables that have no public insert policy) — never reference it
from app code, and never expose it to the browser.

## Deployment (Vercel)

The `freshplug-organics` Vercel project builds this app from the monorepo
root, so two dashboard settings (Settings → Build and Deployment) are load-
bearing and not version-controlled anywhere — if a deploy ever silently
reverts to serving the legacy static root site or starts 404ing on every
route, check these first:

- **Root Directory** must be `web`.
- **Framework Preset** must be explicitly set to `Next.js`. Leaving it as
  "Other" doesn't get auto-corrected just because Root Directory is right —
  `next build` still runs (via the `build` script) and appears to succeed,
  but Vercel packages the output as a handful of static files with zero
  routes/functions/middleware, which 404s on every path with no build error
  and no runtime logs to explain why.
- Production env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `GEMINI_API_KEY`, `RESEND_API_KEY`) have to be added in Settings →
  Environment Variables — `.env.local` is never read by Vercel, only by
  local `next dev`/`next build`.
- `middleware.ts` must live at `src/middleware.ts`, not the project root —
  this repo uses a `src/` directory, and Next.js silently ignores a
  root-level `middleware.ts` in that layout (empty build output, no error).

**Deployment Protection (Vercel Authentication / SSO) is ON**, scoped to
"Production deployment URLs and all Previews" (custom domains would be
exempt, but none is configured, so this currently covers every `*.vercel.app`
URL for this project). Unauthenticated requests — including plain `curl`,
or automation without a session — get redirected to Vercel's SSO gate;
only logged-in team members browsing normally get through. Keep this in
mind before concluding a deployment is broken from an unauthenticated
check: a bare 404/redirect can be Deployment Protection doing its job, not
an app failure. Confirm via `vercel.com/<team>/freshplug-organics` (project
dashboard, always authenticated) or ask whoever has dashboard access to
check in their own logged-in browser.

## Conventions

- Server Components fetch data (`await getProducts()` etc.) and pass it
  down as props; the corresponding Client Components (`ShopClient`,
  `BlogClient`, `GalleryClient`, `FaqAccordion`) take that data via props,
  not by importing it themselves.
- Content-driven pages (`shop`, `blog`, `blog/[id]`, `gallery`, `faq`) set
  `export const revalidate = 60` so Studio edits show up without a redeploy.
- RLS is the actual trust boundary for the anon key used client-side:
  content tables are public-read-only, `orders`/`contact_messages` are
  public-insert-only with no read-back. Don't add new public policies
  without checking `supabase/schema.sql` first.
- This is a normal, current Next.js 14 App Router project — no unusual
  breaking changes from what you already know. If something looks off,
  check the installed version in `package.json` rather than assuming the
  framework has changed underneath you.
