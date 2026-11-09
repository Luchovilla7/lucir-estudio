-- Lucir Estudio · esquema de base de datos (Supabase / Postgres)
-- Pégalo completo en Supabase → SQL Editor → New query → Run.
-- Es idempotente: puedes volver a ejecutarlo sin romper nada.

create extension if not exists pgcrypto;

-- ───────────── utilidades ─────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ───────────── perfiles ─────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  name        text not null default '',
  plan        text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  theme       text not null default 'dark' check (theme in ('dark', 'light')),
  active_brand_id uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- ───────────── marcas ─────────────
create table if not exists public.brands (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  name          text not null default '',
  description   text not null default '',
  niche         text not null default '',
  audience      text not null default '',
  monthly_goal  int  not null default 20 check (monthly_goal between 1 and 200),
  problem       text not null default '',
  helps         text not null default '',
  outcome       text not null default '',
  voice         text not null default '',
  variant       text not null default 'neutro'
                check (variant in ('neutro', 'argentino', 'mexicano', 'colombiano', 'chileno', 'peruano', 'venezolano')),
  keywords      text[] not null default '{}',
  competitors   text[] not null default '{}',
  colors        text[] not null default '{#FF9A5A,#1A1613}',
  networks      text[] not null default '{Instagram}',
  cycle_enabled boolean not null default false,
  cycle_start   date not null default current_date,
  cycle_length  int  not null default 28 check (cycle_length between 20 and 45),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists brands_user_idx on public.brands (user_id);
drop trigger if exists trg_brands_updated on public.brands;
create trigger trg_brands_updated before update on public.brands
  for each row execute function public.set_updated_at();

-- ───────────── piezas (carrusel, stories, reel, post, carta) ─────────────
create table if not exists public.pieces (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  brand_id     uuid not null references public.brands (id) on delete cascade,
  title        text not null default '',
  format       text not null check (format in ('carrusel', 'stories', 'reel', 'post', 'email')),
  tone         text not null check (tone in ('faro', 'prueba', 'giro', 'brujula')),
  platform     text not null default 'Instagram'
               check (platform in ('Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'Threads', 'Newsletter')),
  status       text not null default 'borrador' check (status in ('borrador', 'listo', 'programado', 'publicado')),
  blocks       jsonb not null default '[]'::jsonb,   -- [{ id, label, text }]
  caption      text not null default '',
  idea         text not null default '',
  evidence     text not null default '',
  template_id  text,
  seed         int  not null default 0,
  scheduled_at date,
  reach        int  not null default 0 check (reach >= 0),
  saves        int  not null default 0 check (saves >= 0),
  favorite     boolean not null default false,
  notes        text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists pieces_user_brand_idx on public.pieces (user_id, brand_id);
create index if not exists pieces_sched_idx on public.pieces (brand_id, scheduled_at);
drop trigger if exists trg_pieces_updated on public.pieces;
create trigger trg_pieces_updated before update on public.pieces
  for each row execute function public.set_updated_at();

-- ───────────── chispas (banco de ideas) ─────────────
create table if not exists public.sparks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  brand_id   uuid not null references public.brands (id) on delete cascade,
  tone       text not null check (tone in ('faro', 'prueba', 'giro', 'brujula')),
  title      text not null,
  hook       text not null default '',
  levels     text[] not null default '{}',
  used       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists sparks_user_brand_idx on public.sparks (user_id, brand_id, used);

-- ───────────── laboratorio de aperturas ─────────────
create table if not exists public.saved_hooks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  kind       text not null check (kind in ('mine', 'fav')),
  group_id   text not null,
  template   text not null,
  text       text not null,
  created_at timestamptz not null default now(),
  unique (user_id, kind, group_id, template, text)
);
create index if not exists saved_hooks_user_idx on public.saved_hooks (user_id);

create table if not exists public.hook_progress (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  last_group_id text,
  updated_at    timestamptz not null default now()
);

-- ───────────── consumo de IA (límites y costos) ─────────────
create table if not exists public.usage_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  kind       text not null,                 -- 'generate' | 'sparks' | 'copilot'
  model      text,
  tokens_in  int not null default 0,
  tokens_out int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists usage_user_month_idx on public.usage_events (user_id, created_at desc);

-- Generaciones del mes en curso (la usa el backend para aplicar límites por plan)
create or replace function public.usage_this_month(p_user uuid)
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int from public.usage_events
  where user_id = p_user and created_at >= date_trunc('month', now());
$$;
revoke all on function public.usage_this_month(uuid) from public, anon, authenticated;

-- ───────────── seguridad (RLS) ─────────────
alter table public.profiles      enable row level security;
alter table public.brands        enable row level security;
alter table public.pieces        enable row level security;
alter table public.sparks        enable row level security;
alter table public.saved_hooks   enable row level security;
alter table public.hook_progress enable row level security;
alter table public.usage_events  enable row level security;

-- perfiles: cada quien ve y edita lo suyo (el plan solo lo cambia el servidor)
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (auth.uid() = id);
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
revoke update on public.profiles from authenticated;
grant update (name, theme, active_brand_id) on public.profiles to authenticated;

-- marcas
drop policy if exists brands_all on public.brands;
create policy brands_all on public.brands for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- piezas y chispas: además de ser tuyas, la marca debe ser tuya
drop policy if exists pieces_all on public.pieces;
create policy pieces_all on public.pieces for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and exists (select 1 from public.brands b where b.id = brand_id and b.user_id = auth.uid()));

drop policy if exists sparks_all on public.sparks;
create policy sparks_all on public.sparks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and exists (select 1 from public.brands b where b.id = brand_id and b.user_id = auth.uid()));

drop policy if exists saved_hooks_all on public.saved_hooks;
create policy saved_hooks_all on public.saved_hooks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists hook_progress_all on public.hook_progress;
create policy hook_progress_all on public.hook_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- consumo: el usuario solo lee el suyo; solo el servidor (service role) escribe
drop policy if exists usage_select on public.usage_events;
create policy usage_select on public.usage_events for select using (auth.uid() = user_id);
