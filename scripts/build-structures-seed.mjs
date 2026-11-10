// Genera supabase/004b_seed_structures.sql a partir de supabase/data/carouselcode-structures.json
// Uso: node scripts/build-structures-seed.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const raw = JSON.parse(readFileSync('supabase/data/carouselcode-structures.json', 'utf8'));
const CAT = { venta: 'Venta', educacion: 'Educación', atraccion: 'Atracción', autoridad: 'Autoridad' };
const TAG = '$lc$';

const q = (s) => {
  if (String(s).includes(TAG)) throw new Error('El texto contiene el delimitador ' + TAG);
  return `${TAG}${s}${TAG}`;
};

const rows = raw.map((r, idx) => {
  const num = Number(String(r.number).match(/\d+/)?.[0] ?? idx + 1);
  const id = `${r.category}-${String(num).padStart(2, '0')}`;

  // Resumen de la tarjeta: quita "ESTRUCTURA 01 Venta ", el título y "N slides Ver estructura"
  let summary = (r.cardDesc ?? '').replace(/^ESTRUCTURA\s+\d+\s+\S+\s+/i, '');
  if (summary.startsWith(r.title)) summary = summary.slice(r.title.length);
  summary = summary.replace(/\s*\d+\s+slides\s+Ver estructura\s*$/i, '').trim();

  const slides = r.slides.map((s) => s.text);
  return { id, category: r.category, num, title: r.title, summary, strategy: r.strategy, slides, prompt: r.prompt, sort: idx + 1 };
});

const values = rows
  .map(
    (r) =>
      `  (${q(r.id)}, ${q(r.category)}, ${r.num}, ${q(r.title)}, ${q(r.summary)}, ${q(r.strategy)}, ${q(JSON.stringify(r.slides))}::jsonb, ${q(r.prompt)}, ${r.sort})`,
  )
  .join(',\n');

const sql = `-- Lucir Estudio · carga de las ${rows.length} estructuras de carrusel (generado por scripts/build-structures-seed.mjs)
-- Ejecuta DESPUÉS de 004_structures.sql. Es idempotente (actualiza si ya existen).

insert into public.carousel_structures (id, category, number, title, summary, strategy, slides, prompt, sort) values
${values}
on conflict (id) do update set
  category = excluded.category,
  number   = excluded.number,
  title    = excluded.title,
  summary  = excluded.summary,
  strategy = excluded.strategy,
  slides   = excluded.slides,
  prompt   = excluded.prompt,
  sort     = excluded.sort,
  updated_at = now();
`;

writeFileSync('supabase/004b_seed_structures.sql', sql);
console.log(`OK: ${rows.length} estructuras → supabase/004b_seed_structures.sql (${sql.length} caracteres)`);
console.log(rows.slice(0, 2).map((r) => `${r.id} | ${r.summary.slice(0, 90)}…`).join('\n'));
