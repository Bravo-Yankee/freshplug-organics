# AGENTS.md — web/

This is the Next.js 14 (App Router) + TypeScript + Tailwind app for Freshplug
Organics, scaffolded to replace the static HTML site at the repo root via a
phased Jamstack migration. The root static site is untouched and still
serves production — changes here don't affect it.

## Migration status

- **Phase 0** (done): all marketing/shop pages ported from the legacy static
  HTML with full content parity. Shared `Header`/`Footer` components and one
  canonical `useCart()` hook replaced the legacy site's divergent per-page
  implementations.
- **Phase 1** (done): Supabase (Postgres) backs products, blog posts,
  gallery photos, and FAQs; checkout writes an `orders` row and the contact
  form writes to `contact_messages`. See `supabase/schema.sql` for the
  schema and `web/README.md`-adjacent setup below.
- **Not yet built**: auth, customer accounts, admin dashboard. The legacy
  root `customer-account.html`/`admin-dashboard.html` are the only things
  covering that ground today.

## Data layer

- Runtime reads go through `src/lib/data/{products,blog,gallery,faqs}.ts` —
  these query Supabase and map snake_case rows back to the existing
  camelCase types.
- `src/content/*.ts` still exist and still export the canonical TypeScript
  types, but their arrays are **seed data only**, consumed by
  `scripts/seed.ts`. Don't import them from components/pages — that's what
  the `@/lib/data/*` functions are for.
- **Content edits happen in Supabase Studio's table editor**, not in code.
  There is deliberately no admin UI for products/blog/gallery/FAQs.
- The cart stays client-side in `localStorage` (`useCart()` in
  `src/lib/cart.ts`, key `freshplug_cart`) — only the checkout-time snapshot
  is persisted server-side, as an `orders` row.

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
  `GEMINI_API_KEY`) have to be added in Settings → Environment Variables —
  `.env.local` is never read by Vercel, only by local `next dev`/`next build`.
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
