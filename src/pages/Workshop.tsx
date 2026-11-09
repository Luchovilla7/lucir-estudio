import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, FileText, Film, LayoutGrid, Mail, Sparkles, Wand2 } from 'lucide-react';
import { newPiece, useData } from '../lib/store';
import { FORMAT_LIST, FORMATS, TONE_LIST, TONES } from '../lib/tones';
import { generatePiece, STORY_TEMPLATES, suggestTone } from '../lib/engine';
import type { Format, ToneId } from '../lib/types';
import { clsx } from '../lib/utils';
import { PageHeader, useToast } from '../components/ui';
import { PieceEditor } from '../components/PieceEditor';

const ICONS: Record<Format, typeof LayoutGrid> = { carrusel: LayoutGrid, stories: Camera, reel: Film, post: FileText, email: Mail };
const PRESETS = [4, 6, 7, 10];

export default function Workshop() {
  const { brand, brandPieces, addPiece, updatePiece, deletePiece, duplicatePiece, updateSpark } = useData();
  const loc = useLocation();
  const toast = useToast();
  const incoming = (loc.state ?? {}) as { idea?: string; tone?: ToneId; format?: Format; sparkId?: string };

  const [format, setFormat] = useState<Format>(incoming.format && incoming.format !== 'email' ? incoming.format : 'carrusel');
  const [idea, setIdea] = useState(incoming.idea ?? '');
  const [evidence, setEvidence] = useState('');
  const [toneSel, setToneSel] = useState<ToneId | 'auto'>(incoming.tone ?? 'auto');
  const [slides, setSlides] = useState(7);
  const [templateId, setTemplateId] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [sparkId, setSparkId] = useState<string | undefined>(incoming.sparkId);

  useEffect(() => {
    if (incoming.idea) window.history.replaceState({}, '');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const suggested = useMemo(() => (idea.trim().length >= 6 ? suggestTone(idea) : null), [idea]);
  const tone: ToneId = toneSel === 'auto' ? suggested ?? 'faro' : toneSel;
  const current = brandPieces.find((p) => p.id === currentId) ?? null;
  const canGen = idea.trim().length >= 8;
  const configured = brand.name.trim().length > 0;

  const generate = () => {
    if (!canGen) return;
    const seed = 0;
    const gen = generatePiece({ format, idea, evidence, tone, slides, seed, templateId: templateId || undefined }, brand);
    const piece = newPiece({
      brandId: brand.id,
      title: gen.title,
      format,
      tone,
      platform: FORMATS[format].defaultPlatform,
      blocks: gen.blocks,
      caption: gen.caption,
      idea: idea.trim(),
      evidence: evidence.trim(),
      templateId: gen.templateId,
      seed,
    });
    addPiece(piece);
    setCurrentId(piece.id);
    if (sparkId) {
      updateSpark(sparkId, { used: true });
      setSparkId(undefined);
    }
    toast('Pieza generada y guardada en tu Archivo');
  };

  return (
    <>
      <PageHeader title="Taller de piezas" sub="De una idea suelta a una pieza lista para publicar." />
      <div className="workshop">
        <div className="card form-card">
          <h2>Crea tu pieza</h2>
          <p className="muted">Elige el tipo, escribe tu idea y genera.</p>

          <span className="eyebrow mt">Tipo de contenido</span>
          <div className="format-list">
            {FORMAT_LIST.filter((f) => f.id !== 'email').map((f) => {
              const I = ICONS[f.id];
              return (
                <button key={f.id} className={clsx('format', format === f.id && 'on')} onClick={() => setFormat(f.id)}>
                  <I size={16} />
                  <span>
                    <b>{f.name}</b>
                    <small>{f.desc}</small>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="hint">¿Una carta (email)? Tiene su propio espacio en <Link to="/cartas">Cartas</Link>.</p>

          <label className="label mt" htmlFor="idea">Tu idea de contenido</label>
          <textarea
            id="idea"
            className="input area"
            rows={4}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Ej: mis clientas creen que necesitan más seguidores para vender…"
          />
          <p className="hint">Una conversación real con un cliente, una objeción que escuchaste, algo del sector con lo que no estás de acuerdo o un dolor típico.</p>

          <label className="label mt" htmlFor="ev">Testimonios o datos reales (opcional)</label>
          <textarea id="ev" className="input area" rows={3} value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="Ej: «Pasé de 3 a 12 clientes en 2 meses» — mensaje de Ana, 14 de marzo." />
          <p className="hint">Se usa tal cual. Sin esto, nunca se inventan cifras ni testimonios.</p>

          <span className="eyebrow mt">Tono</span>
          <div className="chips">
            <button className={clsx('chip', toneSel === 'auto' && 'on')} onClick={() => setToneSel('auto')}>
              Sugerido
            </button>
            {TONE_LIST.map((t) => (
              <button key={t.id} className={clsx('chip', toneSel === t.id && 'on')} style={{ ['--tc' as string]: t.color }} onClick={() => setToneSel(t.id)}>
                <i /> {t.name}
              </button>
            ))}
          </div>
          <p className="hint">
            {toneSel === 'auto'
              ? suggested
                ? `Sugerencia para tu idea: ${TONES[suggested].name}. ${TONES[suggested].tagline}`
                : 'Escribe tu idea y te sugiero el tono.'
              : TONES[toneSel].tagline}
          </p>

          {format === 'carrusel' && (
            <>
              <span className="eyebrow mt">Cantidad de slides</span>
              <div className="chips">
                {PRESETS.map((n) => (
                  <button key={n} className={clsx('chip', slides === n && 'on')} onClick={() => setSlides(n)}>
                    {n}
                  </button>
                ))}
                <input className="input mini" type="number" min={3} max={20} value={slides} onChange={(e) => setSlides(Math.max(3, Math.min(20, Number(e.target.value) || 3)))} aria-label="Cantidad personalizada" />
              </div>
              <p className="hint">De 3 a 20. La estructura canónica usa 10 slides.</p>
            </>
          )}

          {format === 'stories' && (
            <>
              <span className="eyebrow mt">Plantilla</span>
              <select className="input" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
                <option value="">Elegir automáticamente</option>
                {STORY_TEMPLATES[tone].map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <p className="hint">Siempre 4 placas. Hay 4 plantillas por tono.</p>
            </>
          )}

          <p className="brand-line">
            {configured ? (
              <>Usa la configuración de <b>{brand.name}</b>. <Link to="/marca">Editar</Link></>
            ) : (
              <>Aún no configuras tu marca. <Link to="/marca">Hazlo ahora</Link> para mejores resultados.</>
            )}
          </p>

          <button className="btn primary block" disabled={!canGen} onClick={generate}>
            <Wand2 size={16} /> Generar
          </button>
          <p className="hint center">El borrador se genera con tu marca y se guarda en tu cuenta.</p>
        </div>

        <div className="result">
          {current ? (
            <div className="card">
              <PieceEditor
                piece={current}
                onChange={(patch) => updatePiece(current.id, patch)}
                onDelete={() => {
                  if (window.confirm('¿Eliminar esta pieza?')) {
                    deletePiece(current.id);
                    setCurrentId(null);
                  }
                }}
                onDuplicate={() => {
                  const id = duplicatePiece(current.id);
                  if (id) {
                    setCurrentId(id);
                    toast('Pieza duplicada');
                  }
                }}
                compact
              />
            </div>
          ) : (
            <div className="placeholder">
              <div className="empty-icon"><Sparkles size={22} /></div>
              <h3>Tu pieza aparece aquí</h3>
              <p>Escribe tu idea a la izquierda. El tono se sugiere solo según lo que escribas, y puedes cambiarlo cuando quieras.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
