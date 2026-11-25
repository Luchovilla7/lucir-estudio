import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, CopyPlus, Download, RefreshCw, Star, Trash2, Plus } from 'lucide-react';
import { useData } from '../lib/store';
import { FORMATS, PLATFORMS, STATUSES, TONES, TONE_LIST } from '../lib/tones';
import type { Block, Piece, ToneId } from '../lib/types';
import { generatePiece, STORY_TEMPLATES } from '../lib/engine';
import { generateWithClaude } from '../lib/ai';
import { clsx, copyText, countPlaceholders, download, readableOn, uid, wordCount } from '../lib/utils';
import { AutoTextarea, ToneDot, useToast } from './ui';
import { IgLink } from './IgLink';
import { ANGLE_BY_ID, parseRef } from '../lib/angles';

export function pieceToText(p: Piece): string {
  const body = p.blocks.map((b) => `${b.label}\n${b.text}`).join('\n\n');
  return `${p.title}\n${'='.repeat(Math.min(p.title.length, 60))}\n\n${body}${p.caption ? `\n\nCopy para la publicación\n${p.caption}` : ''}`;
}

export function PieceEditor({
  piece,
  onChange,
  onDelete,
  onDuplicate,
  compact,
}: {
  piece: Piece;
  onChange: (patch: Partial<Piece>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  compact?: boolean;
}) {
  const { brand } = useData();
  const toast = useToast();
  const [regenerating, setRegenerating] = useState(false);
  const tone = TONES[piece.tone];
  const c1 = brand.colors[0] || '#FF9A5A';
  const c2 = brand.colors[1] || '#1A1613';
  const pending = useMemo(() => piece.blocks.reduce((n, b) => n + countPlaceholders(b.text), 0) + countPlaceholders(piece.caption), [piece]);
  const total = piece.blocks.reduce((n, b) => n + wordCount(b.text), 0);
  const fixed = piece.format === 'stories';

  const setBlock = (id: string, text: string) => onChange({ blocks: piece.blocks.map((b) => (b.id === id ? { ...b, text } : b)) });
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= piece.blocks.length) return;
    const next = piece.blocks.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange({ blocks: next });
  };
  const remove = (id: string) => piece.blocks.length > 1 && onChange({ blocks: piece.blocks.filter((b) => b.id !== id) });
  const add = () => {
    const nb: Block = { id: uid('b'), label: piece.format === 'reel' ? `Escena ${piece.blocks.length + 1}` : `Slide ${piece.blocks.length + 1}`, text: '' };
    onChange({ blocks: [...piece.blocks, nb] });
  };

  const regenerate = async () => {
    if (regenerating) return;
    if (!window.confirm('Se reemplazará el contenido actual por una nueva versión. ¿Continuar?')) return;
    const seed = piece.seed + 1;
    setRegenerating(true);
    try {
      const ref = parseRef(piece.templateId);
      const structureId = ref.struct;
      const gen = await generateWithClaude(
        { format: piece.format, idea: piece.idea || piece.title, evidence: piece.evidence, tone: piece.tone, slides: Math.max(3, piece.blocks.length), seed, templateId: undefined, structure: structureId ? { id: structureId, steps: [] } : undefined, angle: ref.angle, style: ref.style },
        brand,
      );
      onChange({ title: gen.title, blocks: gen.blocks, caption: gen.caption, seed, templateId: gen.templateId ?? piece.templateId });
      toast('Nueva versión generada con Claude');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'No se pudo generar otra versión.');
    } finally {
      setRegenerating(false);
    }
  };

  const copyAll = async () => toast((await copyText(pieceToText(piece))) ? 'Pieza copiada' : 'No se pudo copiar', 'ok');
  const dl = () => {
    download(`${piece.title.slice(0, 40).replace(/[^\w\- ]+/g, '').trim() || 'pieza'}.txt`, pieceToText(piece));
    toast('Descarga lista');
  };

  const slideStyle = { ['--s1' as string]: c1, ['--s2' as string]: c2, ['--sf' as string]: readableOn(c1) };

  return (
    <div className={clsx('editor', compact && 'editor-compact')}>
      <div className="editor-top">
        <div className="editor-title">
          <input className="title-input" value={piece.title} onChange={(e) => onChange({ title: e.target.value })} aria-label="Título de la pieza" />
          <div className="editor-meta">
            <ToneDot tone={piece.tone} />
            <span className="dot-sep">·</span>
            <span>{FORMATS[piece.format].name}</span>
            {parseRef(piece.templateId).angle && ANGLE_BY_ID[parseRef(piece.templateId).angle!] && (
              <>
                <span className="dot-sep">·</span>
                <span>Ángulo: {ANGLE_BY_ID[parseRef(piece.templateId).angle!].name}</span>
              </>
            )}
            <span className="dot-sep">·</span>
            <span>{total} palabras</span>
            {pending > 0 && (
              <>
                <span className="dot-sep">·</span>
                <span className="pending">{pending} {pending === 1 ? 'campo' : 'campos'} por completar</span>
              </>
            )}
          </div>
        </div>
        <div className="editor-tools">
          <button className={clsx('icon-btn', piece.favorite && 'is-on')} onClick={() => onChange({ favorite: !piece.favorite })} title="Favorita" aria-label="Favorita">
            <Star size={16} fill={piece.favorite ? 'currentColor' : 'none'} />
          </button>
          <button className="icon-btn" onClick={copyAll} title="Copiar todo" aria-label="Copiar todo">
            <Copy size={16} />
          </button>
          <button className="icon-btn" onClick={dl} title="Descargar .txt" aria-label="Descargar">
            <Download size={16} />
          </button>
          <button className="icon-btn" onClick={regenerate} disabled={regenerating} title="Generar otra versión" aria-label="Regenerar">
            <RefreshCw size={16} className={regenerating ? 'spin' : undefined} />
          </button>
          {onDuplicate && (
            <button className="icon-btn" onClick={onDuplicate} title="Duplicar" aria-label="Duplicar">
              <CopyPlus size={16} />
            </button>
          )}
          {onDelete && (
            <button className="icon-btn danger" onClick={onDelete} title="Eliminar" aria-label="Eliminar">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="editor-grid">
        <div className="editor-main">
          {piece.format === 'carrusel' && (
            <div className="slides">
              {piece.blocks.map((b, i) => (
                <div className="slide" style={slideStyle} key={b.id}>
                  <div className="slide-head">
                    <span>{b.label}</span>
                    <div className="slide-ctl">
                      <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir"><ArrowUp size={13} /></button>
                      <button onClick={() => move(i, 1)} disabled={i === piece.blocks.length - 1} aria-label="Bajar"><ArrowDown size={13} /></button>
                      <button onClick={() => remove(b.id)} aria-label="Quitar"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <AutoTextarea className="slide-text" value={b.text} onChange={(v) => setBlock(b.id, v)} min={4} />
                  <span className="slide-num">{i + 1}/{piece.blocks.length}</span>
                </div>
              ))}
              <button className="slide slide-add" onClick={add}>
                <Plus size={20} />
                Agregar slide
              </button>
            </div>
          )}

          {piece.format === 'stories' && (
            <>
              <div className="story-row" hidden={!!parseRef(piece.templateId).angle}>
                <label className="field-inline">
                  Plantilla
                  <select
                    value={parseRef(piece.templateId).story ?? ''}
                    onChange={(e) => {
                      const tpl = STORY_TEMPLATES[piece.tone].find((t) => t.id === e.target.value);
                      if (!tpl) return;
                      const gen = generatePiece({ format: 'stories', idea: piece.idea || piece.title, evidence: piece.evidence, tone: piece.tone, slides: 4, seed: piece.seed, templateId: tpl.id }, brand);
                      onChange({ blocks: gen.blocks, templateId: tpl.id });
                    }}
                  >
                    {STORY_TEMPLATES[piece.tone].map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="stories">
                {piece.blocks.map((b) => (
                  <div className="story" style={slideStyle} key={b.id}>
                    <span className="story-label">{b.label}</span>
                    <AutoTextarea className="slide-text" value={b.text} onChange={(v) => setBlock(b.id, v)} min={5} />
                  </div>
                ))}
              </div>
            </>
          )}

          {(piece.format === 'reel' || piece.format === 'post' || piece.format === 'email') && (
            <div className={clsx('stack', piece.format === 'email' && 'paper')}>
              {piece.blocks.map((b, i) => (
                <div className="block" key={b.id}>
                  <div className="block-head">
                    <span className="block-label" style={{ ['--tc' as string]: tone.color }}>{b.label}</span>
                    <div className="slide-ctl">
                      <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir"><ArrowUp size={13} /></button>
                      <button onClick={() => move(i, 1)} disabled={i === piece.blocks.length - 1} aria-label="Bajar"><ArrowDown size={13} /></button>
                      {!fixed && <button onClick={() => remove(b.id)} aria-label="Quitar"><Trash2 size={13} /></button>}
                    </div>
                  </div>
                  <AutoTextarea className="block-text" value={b.text} onChange={(v) => setBlock(b.id, v)} min={2} />
                </div>
              ))}
              {piece.format === 'reel' && (
                <button className="btn ghost sm" onClick={add}>
                  <Plus size={14} /> Agregar escena
                </button>
              )}
              {piece.format === 'email' && <p className="hint">Una carta eficaz mide entre 300 y 500 palabras. Esta tiene {total}.</p>}
            </div>
          )}

          {piece.format !== 'email' && piece.format !== 'stories' && (
            <div className="caption">
              <label className="label">Copy para la publicación</label>
              <AutoTextarea className="input area" value={piece.caption} onChange={(v) => onChange({ caption: v })} min={3} placeholder="Texto que acompaña la pieza al publicarla." />
            </div>
          )}
        </div>

        <aside className="editor-side">
          <label className="label">Tono</label>
          <select className="input" value={piece.tone} onChange={(e) => onChange({ tone: e.target.value as ToneId })}>
            {TONE_LIST.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <label className="label">Estado</label>
          <div className="seg">
            {STATUSES.map((s) => (
              <button key={s.id} className={clsx(piece.status === s.id && 'on')} style={{ ['--tc' as string]: s.color }} onClick={() => onChange({ status: s.id })}>
                {s.name}
              </button>
            ))}
          </div>
          <label className="label">Plataforma</label>
          <select className="input" value={piece.platform} onChange={(e) => onChange({ platform: e.target.value as Piece['platform'] })}>
            {PLATFORMS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <label className="label">Fecha de publicación</label>
          <div className="row-gap">
            <input
              className="input"
              type="date"
              value={piece.scheduledAt ?? ''}
              onChange={(e) => {
                const v = e.target.value || undefined;
                onChange({ scheduledAt: v, status: v && (piece.status === 'borrador' || piece.status === 'listo') ? 'programado' : piece.status });
              }}
            />
            {piece.scheduledAt && (
              <button className="btn ghost sm" onClick={() => onChange({ scheduledAt: undefined, status: piece.status === 'programado' ? 'listo' : piece.status })}>
                Quitar
              </button>
            )}
          </div>
          <div className="two">
            <div>
              <label className="label">Alcance</label>
              <input className="input" type="number" min={0} value={piece.reach} onChange={(e) => onChange({ reach: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
            <div>
              <label className="label">Guardados</label>
              <input className="input" type="number" min={0} value={piece.saves} onChange={(e) => onChange({ saves: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
          </div>
          {piece.platform === 'Instagram' && <IgLink piece={piece} onChange={onChange} />}
          <label className="label">Notas</label>
          <AutoTextarea className="input area" value={piece.notes} onChange={(v) => onChange({ notes: v })} min={3} placeholder="Ideas de diseño, enlaces, recordatorios…" />
        </aside>
      </div>
    </div>
  );
}
