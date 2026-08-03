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
