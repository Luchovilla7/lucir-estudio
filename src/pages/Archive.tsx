import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive as ArchiveIcon, Bookmark, Download, Eye, Star } from 'lucide-react';
import { useData } from '../lib/store';
import { FORMAT_LIST, FORMATS, PLATFORMS, STATUSES } from '../lib/tones';
import type { Format, Platform, Status } from '../lib/types';
import { clsx, csvEscape, download, fmtDate } from '../lib/utils';
import { EmptyState, Modal, PageHeader, ToneDot, useToast } from '../components/ui';
import { PieceEditor, pieceToText } from '../components/PieceEditor';

type Sort = 'recientes' | 'alcance' | 'guardados' | 'az';
const SORTS: { id: Sort; name: string }[] = [
  { id: 'recientes', name: 'Más recientes' },
  { id: 'alcance', name: 'Mayor alcance' },
  { id: 'guardados', name: 'Más guardados' },
  { id: 'az', name: 'A → Z' },
];

function toggle<T>(set: T[], v: T): T[] {
  return set.includes(v) ? set.filter((x) => x !== v) : [...set, v];
}

export default function Archive() {
  const { brand, brandPieces, updatePiece, deletePiece, duplicatePiece } = useData();
  const toast = useToast();
  const [sort, setSort] = useState<Sort>('recientes');
  const [plats, setPlats] = useState<Platform[]>([]);
  const [fmts, setFmts] = useState<Format[]>([]);
  const [stats, setStats] = useState<Status[]>([]);
  const [favs, setFavs] = useState(false);
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const list = useMemo(() => {
    let r = brandPieces.filter(
      (p) =>
        (!plats.length || plats.includes(p.platform)) &&
        (!fmts.length || fmts.includes(p.format)) &&
        (!stats.length || stats.includes(p.status)) &&
        (!favs || p.favorite) &&
        (!q.trim() || p.title.toLowerCase().includes(q.trim().toLowerCase()) || p.blocks.some((b) => b.text.toLowerCase().includes(q.trim().toLowerCase()))),
    );
    r = [...r].sort((a, b) => {
      if (sort === 'alcance') return b.reach - a.reach;
      if (sort === 'guardados') return b.saves - a.saves;
      if (sort === 'az') return a.title.localeCompare(b.title, 'es');
      return a.createdAt < b.createdAt ? 1 : -1;
    });
    return r;
  }, [brandPieces, plats, fmts, stats, favs, q, sort]);

  const opened = brandPieces.find((p) => p.id === openId) ?? null;
  const active = plats.length + fmts.length + stats.length + (favs ? 1 : 0) + (q ? 1 : 0);

  const doExport = (kind: 'json' | 'csv' | 'md') => {
    const base = `lucir-archivo-${brand.name.trim().toLowerCase().replace(/\s+/g, '-') || 'marca'}`;
    if (kind === 'json') download(`${base}.json`, JSON.stringify(list, null, 2), 'application/json');
    if (kind === 'csv') {
      const head = ['titulo', 'formato', 'tono', 'plataforma', 'estado', 'fecha', 'alcance', 'guardados', 'favorita', 'creada'];
      const rows = list.map((p) => [p.title, FORMATS[p.format].name, p.tone, p.platform, p.status, p.scheduledAt ?? '', p.reach, p.saves, p.favorite ? 'sí' : 'no', p.createdAt.slice(0, 10)].map(csvEscape).join(','));
      download(`${base}.csv`, '﻿' + [head.join(','), ...rows].join('\n'), 'text/csv');
    }
    if (kind === 'md') download(`${base}.md`, list.map((p) => `# ${p.title}\n\n_${FORMATS[p.format].name} · ${p.platform} · ${p.status}_\n\n${pieceToText(p)}`).join('\n\n---\n\n'), 'text/markdown');
    setExportOpen(false);
    toast(`${list.length} pieza${list.length === 1 ? '' : 's'} exportada${list.length === 1 ? '' : 's'}`);
  };

  return (
    <>
      <PageHeader
        title="Archivo"
        sub="Todo lo que creaste, ordenado y con sus métricas."
        actions={
          <div className="menu-wrap">
            <button className="btn ghost sm" disabled={!list.length} onClick={() => setExportOpen((v) => !v)}><Download size={14} /> Exportar</button>
            {exportOpen && (
              <div className="menu menu-right">
                <button className="menu-item" onClick={() => doExport('json')}>JSON (copia completa)</button>
                <button className="menu-item" onClick={() => doExport('csv')}>CSV (hoja de cálculo)</button>
                <button className="menu-item" onClick={() => doExport('md')}>Markdown (texto)</button>
              </div>
            )}
          </div>
        }
      />

      <div className="card filters-card">
        <div className="filter-top">
          <input className="input" placeholder="Buscar por título o contenido…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Ordenar">
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-row"><span className="eyebrow">Plataforma</span>
          <div className="chips">{PLATFORMS.map((p) => <button key={p} className={clsx('chip', plats.includes(p) && 'on')} onClick={() => setPlats((s) => toggle(s, p))}>{p}</button>)}</div>
        </div>
        <div className="filter-row"><span className="eyebrow">Formato</span>
          <div className="chips">{FORMAT_LIST.map((f) => <button key={f.id} className={clsx('chip', fmts.includes(f.id) && 'on')} onClick={() => setFmts((s) => toggle(s, f.id))}>{f.name}</button>)}</div>
        </div>
        <div className="filter-row"><span className="eyebrow">Estado</span>
          <div className="chips">
            {STATUSES.map((s) => <button key={s.id} className={clsx('chip', stats.includes(s.id) && 'on')} style={{ ['--tc' as string]: s.color }} onClick={() => setStats((x) => toggle(x, s.id))}><i /> {s.name}</button>)}
            <button className={clsx('chip', favs && 'on')} onClick={() => setFavs((v) => !v)}><Star size={12} /> Favoritos</button>
          </div>
        </div>
        <div className="filter-foot">
          <span className="muted small">{list.length} de {brandPieces.length}</span>
          {active > 0 && <button className="btn ghost xs" onClick={() => { setPlats([]); setFmts([]); setStats([]); setFavs(false); setQ(''); }}>Limpiar filtros</button>}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<ArchiveIcon size={22} />}
          title={brandPieces.length ? 'Ninguna pieza coincide' : 'Tu archivo está vacío'}
          text={brandPieces.length ? 'Prueba quitando algún filtro.' : 'Todo lo que generes en el Taller o en Cartas se guarda aquí.'}
          action={!brandPieces.length ? <Link className="btn primary sm" to="/taller">Crear mi primera pieza</Link> : undefined}
        />
      ) : (
        <div className="piece-grid">
          {list.map((p) => (
            <article className="card piece-card" key={p.id}>
              <div className="pc-top">
                <ToneDot tone={p.tone} />
                <button className={clsx('icon-btn sm', p.favorite && 'is-on')} aria-label="Favorita" onClick={() => updatePiece(p.id, { favorite: !p.favorite })}>
                  <Star size={14} fill={p.favorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              <h3>{p.title}</h3>
              <p className="muted small">{FORMATS[p.format].name} · {p.platform}</p>
              <p className="pc-excerpt">{p.blocks[0]?.text}</p>
              <div className="pc-stats">
                <span><Eye size={13} /> {p.reach.toLocaleString('es')}</span>
                <span><Bookmark size={13} /> {p.saves.toLocaleString('es')}</span>
                <span className="status-pill" style={{ ['--tc' as string]: STATUSES.find((s) => s.id === p.status)?.color }}>{STATUSES.find((s) => s.id === p.status)?.name}</span>
              </div>
              <div className="pc-foot">
                <small className="muted">{p.scheduledAt ? `Para el ${fmtDate(p.scheduledAt)}` : `Creada el ${fmtDate(p.createdAt)}`}</small>
                <button className="btn ghost xs" onClick={() => setOpenId(p.id)}>Abrir</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={!!opened} onClose={() => setOpenId(null)} title="Pieza" wide>
        {opened && (
          <PieceEditor
            piece={opened}
            onChange={(patch) => updatePiece(opened.id, patch)}
            onDelete={() => {
              if (window.confirm('¿Eliminar esta pieza definitivamente?')) {
                deletePiece(opened.id);
                setOpenId(null);
                toast('Pieza eliminada');
              }
            }}
            onDuplicate={() => {
              const id = duplicatePiece(opened.id);
              if (id) {
                setOpenId(id);
                toast('Pieza duplicada');
              }
            }}
            compact
          />
        )}
      </Modal>
    </>
  );
}
