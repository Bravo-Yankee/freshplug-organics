-- Freshplug Organics — Phase 1 Supabase schema
--
-- Run this once in Supabase Studio's SQL editor against a fresh project.
-- After this, all future content edits (products/blog/gallery/faqs) happen
-- directly in Studio's Table Editor — there is no app-level admin UI.
--
-- Seeding: after creating these tables, run `npm run seed` from web/ to
-- copy the current hardcoded content in src/content/*.ts into them.

create table products (
  id bigint primary key,
  name text not null,
  category text not null check (category in ('eggs','chicken','turkey','live','chicks')),
  price integer not null,
  image text not null,
  description text not null,
  rating numeric(2,1) not null,
  review_count integer not null default 0,
  badge text not null check (badge in ('organic','fresh')),
  options jsonb not null default '{}',
  in_stock boolean not null default true,
  featured boolean not null default false
);

create table blog_posts (
  id bigint primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null check (category in ('farming-tips','recipes','health','farm-life','sustainability','news')),
  author text not null,
  date date not null,
  read_time integer not null,
  views integer not null default 0,
  comments integer not null default 0,
  featured boolean not null default false,
  image text not null,
  tags text[] not null default '{}'
);

create table gallery_photos (
  id bigint primary key,
  src text not null,
  title text not null,
  description text not null,
  category text not null check (category in ('chickens','facilities','products','visitors','team'))
);

create table faqs (
  id bigint primary key,
  category text not null check (category in ('products','ordering','delivery','organic','farm','general')),
  question text not null,
  answer text not null
);

-- items is a JSONB snapshot of the cart at checkout time, shaped like
-- CartItem in src/lib/cart.ts: [{id,name,price,quantity,options,image}].
-- Not FK'd to products — prices can drift after an order is placed, and
-- there's no customer identity yet to key a relational order against.
create table orders (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  items jsonb not null,
  total_ksh integer not null,
  customer_name text,
  customer_phone text,
  status text not null default 'pending' check (status in ('pending','confirmed','fulfilled','cancelled'))
);

create table contact_messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  inquiry_type text not null,
  subject text not null,
  message text not null
);

-- Row Level Security
--
-- Studio's Table Editor/SQL Editor connect as the Postgres owner and bypass
-- RLS entirely, so these policies only govern the anon key used by the
-- Next.js app. Content tables are public-read, no public write. Orders and
-- contact_messages are public-insert-only (no read-back, no update/delete)
-- since there's no auth yet to scope a read policy to.

alter table products enable row level security;
alter table blog_posts enable row level security;
alter table gallery_photos enable row level security;
alter table faqs enable row level security;
alter table orders enable row level security;
alter table contact_messages enable row level security;

create policy "public read" on products for select using (true);
create policy "public read" on blog_posts for select using (true);
create policy "public read" on gallery_photos for select using (true);
create policy "public read" on faqs for select using (true);

create policy "public insert" on orders for insert with check (true);
create policy "public insert" on contact_messages for insert with check (true);

-- Phase 2 — customer accounts (Supabase Auth, magic link)
--
-- Not idempotent, like the rest of this file: if you already ran the block
-- above against an existing project, run only what follows against that
-- same project rather than re-running the whole file.

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  birth_date date,
  created_at timestamptz not null default now()
);

-- Every signed-up user gets a bare profile row automatically. Runs as the
-- function owner (bypasses RLS), so there's no public insert policy on
-- profiles — the trigger is the only writer of new rows.
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

create table addresses (
  id bigint generated always as identity primary key,
  profile_id uuid not null references profiles(id) on delete cascade,
  label text,
  address text not null,
  city text not null,
  postal_code text,
  is_default boolean not null default false
);

create table subscriptions (
  id bigint generated always as identity primary key,
  profile_id uuid not null references profiles(id) on delete cascade,
  product_id bigint not null references products(id),
  frequency text not null check (frequency in ('weekly','monthly')),
  quantity integer not null default 1,
  next_delivery date,
  status text not null default 'active' check (status in ('active','paused')),
  start_date date not null default now()
);

-- Ties an order to the customer who placed it while logged in. Nullable —
-- WhatsApp checkout (see ShopClient.handleCheckout) still doesn't require
-- an account.
alter table orders add column profile_id uuid references profiles(id);

alter table profiles enable row level security;
alter table addresses enable row level security;
alter table subscriptions enable row level security;

create policy "own profile select" on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);

create policy "own addresses select" on addresses for select using (auth.uid() = profile_id);
create policy "own addresses insert" on addresses for insert with check (auth.uid() = profile_id);
create policy "own addresses update" on addresses for update using (auth.uid() = profile_id);
create policy "own addresses delete" on addresses for delete using (auth.uid() = profile_id);

create policy "own subscriptions select" on subscriptions for select using (auth.uid() = profile_id);
create policy "own subscriptions insert" on subscriptions for insert with check (auth.uid() = profile_id);
create policy "own subscriptions update" on subscriptions for update using (auth.uid() = profile_id);

-- orders previously had no select policy at all (no read-back, by design,
-- since there was no auth to scope it to). This is the first read access,
-- deliberately scoped to the owning user only. The insert policy is
-- replaced (not left in place alongside a new one) so a logged-in checkout
-- can't write another user's profile_id onto an order.
drop policy "public insert" on orders;
create policy "public insert" on orders for insert with check (profile_id is null or profile_id = auth.uid());
create policy "own orders select" on orders for select using (profile_id = auth.uid());

-- Phase 3 — admin dashboard
--
-- Not idempotent, like the rest of this file: run only this block against
-- a project that already has the Phase 1/2 blocks applied.

alter table profiles add column is_admin boolean not null default false;

-- Bootstrapping the first admin is manual, done once in Studio's SQL
-- editor: update profiles set is_admin = true where id = '<user-uuid>';
-- There is deliberately no in-app UI to grant admin (see AGENTS.md).

-- security definer so it can read profiles.is_admin for the *calling*
-- user without needing a broader policy, and so every policy below can
-- reuse it instead of repeating the exists(...) subquery four times.
create function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin
  );
$$;

-- profiles: admins can read every row (customer listing), additive
-- alongside "own profile select" — same-command policies are OR'd, so
-- this doesn't need to replace it.
create policy "admin profiles select" on profiles for select using (is_admin());

-- orders: admins can read every row and update status.
create policy "admin orders select" on orders for select using (is_admin());
create policy "admin orders update" on orders for update using (is_admin()) with check (is_admin());

-- contact_messages: previously had no select policy at all (public
-- insert-only). This is the first read access, admin-only.
create policy "admin contact_messages select" on contact_messages for select using (is_admin());

-- Weight-based per-tier pricing
--
-- Not idempotent, like the rest of this file. Products with an
-- options.weight dropdown (e.g. "4.5-5.5 kg") previously showed one flat
-- price/description no matter which weight was selected — this column
-- lets each weight label carry its own price + description, keyed by the
-- exact label string in options.weight. Products without weight-based
-- pricing just keep the default '{}' and fall back to the flat
-- price/description columns (see resolveVariant() in ShopClient.tsx).

alter table products add column weight_pricing jsonb not null default '{}';

-- Phase 4 — dynamic product categories + admin-managed products
--
-- Not idempotent, like the rest of this file: run only this block against
-- a project that already has the Phase 1-3 blocks applied.
--
-- Categories used to be a fixed check-constraint list on products.category
-- ('eggs','chicken','turkey','live','chicks') — only a developer could add
-- one. The farm is growing into new product lines (dairy, goat, pig, ...),
-- so categories are now a real table an admin can add rows to from
-- /admin. `active` lets an admin hide a whole category (and everything in
-- it) from the shop without deleting anything — used immediately below to
-- hide turkey and day-old chicks, which aren't currently available at the
-- farm.

create table categories (
  slug text primary key,
  label text not null,
  sort_order integer not null default 0,
  active boolean not null default true
);

insert into categories (slug, label, sort_order, active) values
  ('eggs', 'Fresh Eggs', 1, true),
  ('chicken', 'Chicken', 2, true),
  ('turkey', 'Turkey', 3, false),
  ('live', 'Live Birds', 4, true),
  ('chicks', 'Day-old Chicks', 5, false);

-- Replace the fixed check constraint with a real FK so category values are
-- always ones an admin actually created.
alter table products drop constraint products_category_check;
alter table products add constraint products_category_fkey
  foreign key (category) references categories(slug);

-- Products previously needed an explicit, manually-chosen id (see the
-- hardcoded 1..12 in src/content/products.ts). Admin-created products
-- don't have a developer picking one, so give the column a sequence,
-- starting well above the existing seed ids. GENERATED BY DEFAULT (not
-- ALWAYS) so an explicit id — e.g. from scripts/seed.ts — still works.
alter table products alter column id add generated by default as identity (start with 1000);

-- Per-product visibility, independent of in_stock (in_stock only disables
-- "Add to Cart" and shows an "Out of Stock" badge on an otherwise-listed
-- product; is_active hides the product from the shop entirely — what an
-- admin reaches for to discontinue/pause one item without touching its
-- whole category).
alter table products add column is_active boolean not null default true;

update products set is_active = false where category in ('turkey', 'chicks');

alter table categories enable row level security;

create policy "public read active categories" on categories for select using (active = true or is_admin());
create policy "admin categories insert" on categories for insert with check (is_admin());
create policy "admin categories update" on categories for update using (is_admin()) with check (is_admin());

-- products had an unconditional public-read policy; replace it so
-- inactive products are hidden from anon reads but still visible to
-- admins (so /admin can re-activate them later).
drop policy "public read" on products;
create policy "public read" on products for select using (is_active = true or is_admin());

create policy "admin products insert" on products for insert with check (is_admin());
create policy "admin products update" on products for update using (is_admin()) with check (is_admin());

-- Phase 5 — age-based per-tier pricing for live birds
--
-- Not idempotent, like the rest of this file: run only this block against
-- a project that already has the Phase 1-4 blocks applied.
--
-- weight_pricing (added in Phase 3, above the Phase 4 block) was scoped to
-- options.weight only — resolveVariant() in ShopClient.tsx actually checks
-- every selected option value against it, so the column works identically
-- for options.age (live birds) or any other single priced option group. A
-- straight rename keeps the existing weight-tier JSON for chicken/turkey
-- products intact while unblocking age-tier pricing for live birds.
alter table products rename column weight_pricing to variant_pricing;

-- Starting age-tier price/description values for the three live-bird
-- products (older/peak-laying birds priced higher) — edit freely in
-- Studio's table editor going forward, same as any other product content.
update products set variant_pricing = '{
  "6-8 months": {"price": 2100, "description": "Healthy Rhode Island Red hens, just coming into lay at 6-8 months old"},
  "8-12 months": {"price": 2400, "description": "Healthy Rhode Island Red hens, 8-12 months old and in peak egg production"},
  "12+ months": {"price": 1800, "description": "Healthy Rhode Island Red hens, 12+ months old, past peak but still laying"}
}'::jsonb where id = 8;

update products set variant_pricing = '{
  "6-8 months": {"price": 2280, "description": "Docile Buff Orpington hens, just coming into lay at 6-8 months old"},
  "8-12 months": {"price": 2550, "description": "Docile Buff Orpington hens, 8-12 months old and in peak egg production"}
}'::jsonb where id = 9;

update products set variant_pricing = '{
  "4-6 weeks": {"price": 1200, "description": "Fast-growing broiler chickens, 4-6 weeks old"},
  "6-8 weeks": {"price": 1500, "description": "Fast-growing broiler chickens, 6-8 weeks old"},
  "8-10 weeks": {"price": 1800, "description": "Fast-growing broiler chickens, 8-10 weeks old, full market weight"}
}'::jsonb where id = 10;

-- Phase 6 — newsletter
--
-- Not idempotent, like the rest of this file: run only this block against
-- a project that already has the Phase 1-5 blocks applied.
--
-- Backs the two newsletter signup forms (homepage, blog sidebar) and the
-- admin "Newsletter" tab's compose/send flow. subscribed is a soft flag,
-- never a deleted row, so re-subscribing is just flipping it back — same
-- posture as categories.active/products.is_active elsewhere in this file.
-- unsubscribe_token gates the public "unsubscribe" update policy below;
-- RLS itself is deliberately permissive there (same posture as the public
-- insert policies already in this file) because the unguessable token,
-- not RLS, is what's actually authorizing the write.
create table newsletter_subscribers (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  email text not null unique,
  unsubscribe_token uuid not null default gen_random_uuid() unique,
  subscribed boolean not null default true
);

alter table newsletter_subscribers enable row level security;
create policy "public insert" on newsletter_subscribers for insert with check (true);
create policy "public unsubscribe" on newsletter_subscribers for update using (true) with check (true);
create policy "admin newsletter_subscribers select" on newsletter_subscribers for select using (is_admin());

-- One row per newsletter send, for the admin history view.
create table newsletter_campaigns (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  subject text not null,
  body text not null,
  recipient_count int not null
);

alter table newsletter_campaigns enable row level security;
create policy "admin newsletter_campaigns select" on newsletter_campaigns for select using (is_admin());
create policy "admin newsletter_campaigns insert" on newsletter_campaigns for insert with check (is_admin());

-- Phase 7 — admin-managed blog posts
--
-- Not idempotent, like the rest of this file: run only this block against
-- a project that already has the Phase 1-6 blocks applied.
--
-- Same shape as the Phase 4 products fix: blog_posts.id previously needed
-- an explicit, manually-chosen id (see the hardcoded 1..10 in
-- src/content/blog.ts) — admin-created posts don't have a developer
-- picking one, so give the column a sequence, starting well above the
-- existing seed ids. GENERATED BY DEFAULT (not ALWAYS) so an explicit id
-- — e.g. from scripts/seed.ts — still works.
alter table blog_posts alter column id add generated by default as identity (start with 1000);

-- is_published mirrors products.is_active: a soft hide, not a delete, so
-- an admin can pull a post from /blog without losing it.
alter table blog_posts add column is_published boolean not null default true;

drop policy "public read" on blog_posts;
create policy "public read published posts" on blog_posts for select using (is_published = true or is_admin());
create policy "admin blog_posts insert" on blog_posts for insert with check (is_admin());
create policy "admin blog_posts update" on blog_posts for update using (is_admin()) with check (is_admin());

-- Phase 8 — dynamic blog categories
--
-- Not idempotent, like the rest of this file: run only this block against
-- a project that already has the Phase 1-7 blocks applied.
--
-- Same fix Phase 4 applied to products.category: blog_posts.category was
-- a fixed check-constraint list (farming-tips, recipes, health, farm-life,
-- sustainability, news) — only a developer could add one. Categories are
-- now a real table an admin can add rows to from /admin's Blog tab, same
-- shape as products' `categories` table (deliberately a separate table,
-- not a shared one — blog topics and shop product lines are different
-- taxonomies and shouldn't show up in each other's dropdowns).

create table blog_categories (
  slug text primary key,
  label text not null,
  sort_order integer not null default 0,
  active boolean not null default true
);

insert into blog_categories (slug, label, sort_order, active) values
  ('farming-tips', 'Farming Tips', 1, true),
  ('recipes', 'Recipes', 2, true),
  ('farm-life', 'Farm Life', 3, true),
  ('sustainability', 'Sustainability', 4, true),
  ('health', 'Health & Nutrition', 5, true),
  ('news', 'Farm News', 6, true);

-- Replace the fixed check constraint with a real FK, same as products.
alter table blog_posts drop constraint blog_posts_category_check;
alter table blog_posts add constraint blog_posts_category_fkey
  foreign key (category) references blog_categories(slug);

alter table blog_categories enable row level security;

create policy "public read active blog categories" on blog_categories for select using (active = true or is_admin());
create policy "admin blog_categories insert" on blog_categories for insert with check (is_admin());
create policy "admin blog_categories update" on blog_categories for update using (is_admin()) with check (is_admin());
