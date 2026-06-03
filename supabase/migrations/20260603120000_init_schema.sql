-- EVAD Ceremony — schéma initial vote
-- Tables: categories, nominees, votes, otp_codes
-- RLS activé sans policy → seul service_role accède

create extension if not exists pgcrypto;

-- Catégories de vote
create table public.categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text not null default '',
  display_order int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index categories_display_order_idx on public.categories (display_order);

-- Nominés
create table public.nominees (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.categories(id) on delete cascade,
  name          text not null,
  description   text not null default '',
  image_url     text,
  display_order int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index nominees_category_id_idx     on public.nominees (category_id);
create index nominees_display_order_idx   on public.nominees (category_id, display_order);
create unique index nominees_category_name_unique on public.nominees (category_id, lower(name));

-- Votes : 1 vote par (email, category_id)
create table public.votes (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  category_id uuid not null references public.categories(id) on delete cascade,
  nominee_id  uuid not null references public.nominees(id)   on delete cascade,
  voted_at    timestamptz not null default now(),
  ip_address  inet,
  constraint votes_email_category_unique unique (email, category_id),
  constraint votes_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
create index votes_category_id_idx on public.votes (category_id);
create index votes_nominee_id_idx  on public.votes (nominee_id);

-- OTP codes (hashés SHA-256, TTL 10 min, max 5 tentatives)
create table public.otp_codes (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  category_id  uuid not null references public.categories(id) on delete cascade,
  nominee_id   uuid not null references public.nominees(id)   on delete cascade,
  code_hash    text not null,
  expires_at   timestamptz not null,
  attempts     int  not null default 0,
  consumed_at  timestamptz,
  created_at   timestamptz not null default now(),
  ip_address   inet
);
create index otp_codes_email_category_idx on public.otp_codes (email, category_id);
create index otp_codes_created_at_idx     on public.otp_codes (created_at desc);

-- RLS : enabled sans policy → seul service_role accède (bypass RLS)
alter table public.categories enable row level security;
alter table public.nominees   enable row level security;
alter table public.votes      enable row level security;
alter table public.otp_codes  enable row level security;

-- RPC d'agrégation des votes (admin dashboard)
create or replace function public.get_vote_counts()
returns table (category_id uuid, nominee_id uuid, vote_count bigint)
language sql stable as $$
  select category_id, nominee_id, count(*)::bigint
  from public.votes
  group by category_id, nominee_id;
$$;

-- RPC atomique : insert vote + consume OTP
create or replace function public.record_vote(
  p_email text, p_category_id uuid, p_nominee_id uuid, p_otp_id uuid
) returns void language plpgsql as $$
begin
  insert into public.votes (email, category_id, nominee_id)
    values (p_email, p_category_id, p_nominee_id);
  update public.otp_codes set consumed_at = now() where id = p_otp_id;
end;
$$;

-- Trigger pour updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_touch_updated_at before update on public.categories
  for each row execute function public.touch_updated_at();
create trigger nominees_touch_updated_at before update on public.nominees
  for each row execute function public.touch_updated_at();
