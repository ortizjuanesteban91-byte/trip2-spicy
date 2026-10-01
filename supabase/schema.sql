-- Trip2 Spicy: run once in Supabase > SQL Editor (safe to run again). Use a SEPARATE Supabase project from Sonia Realtors.
create table if not exists leads (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  kind text not null,          -- booking | contact
  name text not null,
  email text,
  phone text,
  budget text,
  message text,
  listing text,                -- tour slug
  details jsonb
);
alter table leads add column if not exists status text default 'new';   -- new | contacted | closed
alter table leads enable row level security;  -- no public access; server uses the service key

-- Photos uploaded from /admin (public read, server-only write)
insert into storage.buckets (id, name, public) values ('owner-photos', 'owner-photos', true)
on conflict (id) do nothing;

-- Tour edits from /admin (show/hide, prices, photos) on top of the built-in tours
create table if not exists tours (
  slug text primary key,
  updated_at timestamptz default now(),
  hidden boolean default false,
  data jsonb not null default '{}'::jsonb   -- from, options[{price, priceWknd}], photos[]
);
alter table tours enable row level security;

-- Staff users for /admin (the owner logs in with ADMIN_PASSWORD instead)
create table if not exists staff (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  email text unique not null,
  name text not null,
  role text not null default 'editor',   -- admin | editor | agent
  pass text not null,                    -- scrypt hash, never the password
  active boolean default true,
  last_login timestamptz
);
alter table staff enable row level security;

-- Settings edited from /admin (payments, notification email)
create table if not exists settings (
  key text primary key,
  updated_at timestamptz default now(),
  data jsonb not null default '{}'::jsonb
);
alter table settings enable row level security;

-- Blog posts written or edited in /admin (on top of the built-in posts)
create table if not exists posts (
  slug text primary key,
  updated_at timestamptz default now(),
  hidden boolean default false,
  data jsonb not null default '{}'::jsonb   -- title, intro, meta, image, body
);
alter table posts enable row level security;  -- server-only via service key

-- Affiliates (people who send guests with a personal link and get paid weekly)
create table if not exists affiliates (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  email text unique not null,
  phone text,
  country text,
  method text,                 -- Bank transfer | PayPal | Zelle | Other
  payout text,                 -- account details they entered (private)
  code text unique not null,   -- used in ?ref=code
  pass text not null,          -- scrypt hash
  status text default 'pending' -- pending | approved | disabled
);
alter table affiliates enable row level security;
create table if not exists payouts (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  affiliate_id bigint references affiliates(id),
  amount numeric not null,
  bookings int,
  method text,
  note text
);
alter table payouts enable row level security;
alter table leads add column if not exists aff text;                -- affiliate code that brought this booking
alter table leads add column if not exists cost numeric;            -- supplier cost (private)
alter table leads add column if not exists commission numeric;      -- affiliate commission for this booking
alter table leads add column if not exists completed_at timestamptz;-- tour done: commission is earned
alter table leads add column if not exists paid_at timestamptz;     -- commission paid out
alter table leads add column if not exists payout_id bigint;
