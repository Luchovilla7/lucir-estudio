-- Lucir Estudio · biblioteca de estructuras de carrusel
-- Ejecuta en Supabase → SQL Editor (antes de 004b_seed_structures.sql). Es idempotente.
--
-- Es contenido compartido de solo lectura: cualquier usuario con sesión puede leerlo,
-- pero nadie puede modificarlo desde el navegador (solo con la clave de servicio o desde el SQL Editor).
-- El campo `prompt` es el texto base que el servidor usará como instrucción cuando se conecte la IA.

create table if not exists public.carousel_structures (
  id         text primary key,                       -- p. ej. 'venta-01'
  category   text not null check (category in ('venta', 'educacion', 'atraccion', 'autoridad')),
  number     int  not null,
  title      text not null,
  summary    text not null default '',               -- descripción corta de la tarjeta
  strategy   text not null default '',               -- "¿Para qué sirve?"
  slides     jsonb not null default '[]'::jsonb,      -- ["Quién eras…", "El camino equivocado…"]
  prompt     text not null default '',               -- prompt base de generación
  sort       int  not null default 0,
  active     boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists carousel_structures_cat_idx on public.carousel_structures (category, number);

alter table public.carousel_structures enable row level security;

drop policy if exists carousel_structures_read on public.carousel_structures;
create policy carousel_structures_read on public.carousel_structures
  for select to authenticated using (active);

revoke insert, update, delete on public.carousel_structures from anon, authenticated;
