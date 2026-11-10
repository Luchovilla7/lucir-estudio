import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Library as LibraryIcon, Search, Wand2 } from 'lucide-react';
import { STRUCTURE_CATEGORIES, useStructures, type Structure, type StructureCategory } from '../lib/structures';
import { clsx, copyText } from '../lib/utils';
import { EmptyState, Modal, PageHeader, useToast } from '../components/ui';

export default function Library() {
  const { items, loading, error } = useStructures();
  const nav = useNavigate();
  const toast = useToast();
  const [cat, setCat] = useState<StructureCategory | 'todas'>('todas');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<Structure | null>(null);

  const counts = useMemo(() => Object.fromEntries(STRUCTURE_CATEGORIES.map((c) => [c.id, items.filter((i) => i.category === c.id).length])), [items]);
  const list = useMemo(
    () =>
      items.filter(
        (i) =>
          (cat === 'todas' || i.category === cat) &&
          (!q.trim() || `${i.title} ${i.summary} ${i.strategy}`.toLowerCase().includes(q.trim().toLowerCase())),
      ),
    [items, cat, q],
  );

  const use = (s: Structure) => nav('/taller', { state: { format: 'carrusel', structure: { id: s.id, title: s.title, steps: s.slides, strategy: s.strategy } } });

  return (
    <>
      <PageHeader title="Biblioteca de estructuras" sub="El carrusel correcto para cada momento: elige una estructura y llévala al Taller." />

      <div className="cat-grid">
        {STRUCTURE_CATEGORIES.map((c) => (
          <button key={c.id} className={clsx('cat-card', cat === c.id && 'on')} onClick={() => setCat(cat === c.id ? 'todas' : c.id)}>
            <span className="cat-emoji">{c.emoji}</span>
            <span>
              <b>{c.name}</b>
              <small>{counts[c.id] ?? 0} estructuras</small>
            </span>
            <em>{c.goal}</em>
          </button>
        ))}
      </div>

      <div className="searchbar">
        <Search size={16} />
        <input placeholder="Buscar una estructura…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="boot-msg" style={{ minHeight: '30vh' }}><div className="spinner" aria-label="Cargando" /></div>
      ) : error ? (
        <EmptyState
          icon={<LibraryIcon size={22} />}
          title="La biblioteca aún no está cargada"
          text="Ejecuta supabase/004_structures.sql y supabase/004b_seed_structures.sql en el SQL Editor de Supabase y recarga."
        />
      ) : list.length === 0 ? (
        <EmptyState icon={<Search size={22} />} title="Sin resultados" text="Prueba con otra palabra o cambia la categoría." />
      ) : (
        <div className="struct-grid">
          {list.map((s) => {
            const c = STRUCTURE_CATEGORIES.find((x) => x.id === s.category)!;
            return (
              <article className="card struct-card" key={s.id}>
                <div className="pc-top">
                  <span className="badge">{c.emoji} {c.name}</span>
                  <small className="muted">Estructura {String(s.number).padStart(2, '0')}</small>
                </div>
                <h3>{s.title}</h3>
                <p className="pc-excerpt">{s.summary}</p>
                <div className="pc-foot">
                  <small className="muted">{s.slides.length} slides</small>
                  <div className="row-gap">
                    <button className="btn ghost xs" onClick={() => setOpen(s)}>Ver estructura</button>
                    <button className="btn primary xs" onClick={() => use(s)}><Wand2 size={12} /> Usar</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        wide
        title={open?.title ?? ''}
        footer={
          open && (
            <>
              <button
                className="btn ghost"
                onClick={async () => toast((await copyText(open.prompt)) ? 'Prompt copiado' : 'No se pudo copiar', 'ok')}
              >
                <Copy size={14} /> Copiar prompt
              </button>
              <button className="btn primary" onClick={() => use(open)}><Wand2 size={14} /> Usar en el Taller</button>
            </>
          )
        }
      >
        {open && (
          <>
            <span className="eyebrow">¿Para qué sirve?</span>
            <p className="strategy">{open.strategy}</p>
            <span className="eyebrow mt">Estructura de slides</span>
            <ol className="slide-steps">
              {open.slides.map((t, i) => (
                <li key={i}><em>{String(i + 1).padStart(2, '0')}</em> {t}</li>
              ))}
            </ol>
            <span className="eyebrow mt">Prompt base</span>
            <pre className="prompt-box">{open.prompt}</pre>
          </>
        )}
      </Modal>
    </>
  );
}
