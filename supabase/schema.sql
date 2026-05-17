-- Run this in the Supabase SQL editor to create the users table.
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  facebook_id text unique not null,
  email text not null,
  name text,
  image text,
  created_at timestamptz not null default now(),
  last_login_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (email);
