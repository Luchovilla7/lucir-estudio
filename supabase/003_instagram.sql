-- Lucir Estudio · conexión de Instagram (métricas de solo lectura)
-- Ejecuta en Supabase → SQL Editor. Es idempotente.
--
-- Seguridad:
--  * Los tokens de Instagram viven cifrados en `instagram_tokens`, con RLS activo y SIN políticas:
--    solo el servidor (clave service role) puede leerlos o escribirlos. El navegador nunca los ve.
--  * El usuario solo puede LEER sus conexiones y métricas. Crear, renovar y borrar se hace desde el servidor.

create table if not exists public.instagram_connections (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  brand_id          uuid not null unique references public.brands (id) on delete cascade,
  ig_user_id        text not null,
  username          text not null default '',
  name              text not null default '',
  profile_picture_url text,
  account_type      text not null default '',
  followers_count   int  not null default 0,
  media_count       int  not null default 0,
  status            text not null default 'active' check (status in ('active', 'expired', 'error')),
  last_error        text,
  token_expires_at  timestamptz,
  last_synced_at    timestamptz,
  summary           jsonb not null default '{}'::jsonb,
  connected_at      timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists ig_conn_user_idx on public.instagram_connections (user_id);
create index if not exists ig_conn_igid_idx on public.instagram_connections (ig_user_id);

create table if not exists public.instagram_tokens (
  connection_id uuid primary key references public.instagram_connections (id) on delete cascade,
  token_enc     text not null,
  updated_at    timestamptz not null default now()
);

create table if not exists public.instagram_daily (
  connection_id uuid not null references public.instagram_connections (id) on delete cascade,
  day           date not null,
  reach         int,
  followers     int,
  primary key (connection_id, day)
);

create table if not exists public.instagram_media (
  connection_id  uuid not null references public.instagram_connections (id) on delete cascade,
  ig_media_id    text not null,
  caption        text not null default '',
  media_type     text not null default '',
  permalink      text,
  thumbnail_url  text,
  posted_at      timestamptz,
  like_count     int not null default 0,
  comments_count int not null default 0,
  reach          int,
  saves          int,
  shares         int,
  views          int,
  synced_at      timestamptz not null default now(),
  primary key (connection_id, ig_media_id)
);
create index if not exists ig_media_posted_idx on public.instagram_media (connection_id, posted_at desc);

-- Vincular una pieza con su publicación en Instagram
alter table public.pieces add column if not exists ig_media_id text;

-- ───────────── RLS ─────────────
alter table public.instagram_connections enable row level security;
alter table public.instagram_tokens      enable row level security;
alter table public.instagram_daily       enable row level security;
alter table public.instagram_media       enable row level security;

drop policy if exists ig_conn_select on public.instagram_connections;
create policy ig_conn_select on public.instagram_connections for select using (auth.uid() = user_id);

-- instagram_tokens: sin políticas a propósito (solo service role).

drop policy if exists ig_daily_select on public.instagram_daily;
create policy ig_daily_select on public.instagram_daily for select
  using (exists (select 1 from public.instagram_connections c where c.id = connection_id and c.user_id = auth.uid()));

drop policy if exists ig_media_select on public.instagram_media;
create policy ig_media_select on public.instagram_media for select
  using (exists (select 1 from public.instagram_connections c where c.id = connection_id and c.user_id = auth.uid()));

-- Por si un rol de cliente tuviera permisos por defecto sobre las tablas sensibles
revoke all on public.instagram_tokens from anon, authenticated;
revoke insert, update, delete on public.instagram_connections from anon, authenticated;
revoke insert, update, delete on public.instagram_daily from anon, authenticated;
revoke insert, update, delete on public.instagram_media from anon, authenticated;
