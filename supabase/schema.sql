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
