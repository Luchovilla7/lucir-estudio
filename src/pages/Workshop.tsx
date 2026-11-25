import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, FileText, Film, LayoutGrid, Mail, Sparkles, Wand2 } from 'lucide-react';
import { newPiece, useData } from '../lib/store';
import { FORMAT_LIST, FORMATS, TONE_LIST, TONES } from '../lib/tones';
import { generatePiece, STORY_TEMPLATES, suggestTone } from '../lib/engine';
import { generateWithClaude } from '../lib/ai';
import type { Format, ToneId } from '../lib/types';
import { clsx } from '../lib/utils';
import { PageHeader, useToast } from '../components/ui';
import { PieceEditor } from '../components/PieceEditor';
import { ANGLE_BY_ID, OBJECTIVES, OBJECTIVE_LIST, anglesByObjective, type Objective } from '../lib/angles';
import { VIDEO_STYLES, VIDEO_STYLE_BY_ID } from '../lib/videoStyles';

const ICONS: Record<Format, typeof LayoutGrid> = { carrusel: LayoutGrid, stories: Camera, reel: Film, post: FileText, email: Mail };
const PRESETS = [4, 6, 7, 10];

export default function Workshop() {
  const { brand, brandPieces, addPiece, updatePiece, deletePiece, duplicatePiece, updateSpark } = useData();
  const loc = useLocation();
  const toast = useToast();
  const incoming = (loc.state ?? {}) as {
    idea?: string;
    tone?: ToneId;
    format?: Format;
    sparkId?: string;
    structure?: { id: string; title: string; steps: string[]; strategy: string };
    angle?: string;
  };

  const [format, setFormat] = useState<Format>(incoming.format && incoming.format !== 'email' ? incoming.format : 'carrusel');
  const [idea, setIdea] = useState(incoming.idea ?? '');
  const [evidence, setEvidence] = useState('');
  const [toneSel, setToneSel] = useState<ToneId | 'auto'>(incoming.tone ?? 'auto');
  const [slides, setSlides] = useState(7);
  const [templateId, setTemplateId] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [sparkId, setSparkId] = useState<string | undefined>(incoming.sparkId);
  const [structure, setStructure] = useState(incoming.structure ?? null);
  const [angleId, setAngleId] = useState(incoming.angle ?? '');
  const [objective, setObjective] = useState<Objective>(ANGLE_BY_ID[incoming.angle ?? '']?.objective ?? 'atraer');
  const [styleId, setStyleId] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (incoming.idea) window.history.replaceState({}, '');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const suggested = useMemo(() => (idea.trim().length >= 6 ? suggestTone(idea) : null), [idea]);
  const angle = ANGLE_BY_ID[angleId];
  const activeAngle = format === 'carrusel' && structure ? undefined : angle;
  const tone: ToneId = toneSel === 'auto' ? activeAngle?.tone ?? suggested ?? 'faro' : toneSel;
  const videoStyle = VIDEO_STYLE_BY_ID[styleId];
  const fillAsk = (t: string) =>
    t
      .replace(/\{kw\}/g, brand.keywords[0] || brand.niche || 'tu tema')
      .replace(/\{aud\}/g, brand.audience || 'tu cliente ideal')
      .replace(/\{niche\}/g, brand.niche || 'tu sector')
      .replace(/\{outcome\}/g, brand.outcome || 'su resultado');
  const current = brandPieces.find((p) => p.id === currentId) ?? null;
  const canGen = idea.trim().length >= 8;
  const configured = brand.name.trim().length > 0;

  const generate = async () => {
    if (!canGen || generating) return;
    setGenerating(true);
    const seed = 0;
    try {
      const request = { format, idea, evidence, tone, slides, seed, templateId: templateId || undefined, structure: format === 'carrusel' && structure ? { id: structure.id, steps: structure.steps } : undefined, angle: activeAngle?.id, style: format === 'reel' ? styleId || undefined : undefined };
      const gen = await generateWithClaude(request, brand);
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
      toast('Pieza generada con Claude y guardada en tu Archivo');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'No se pudo generar la pieza.');
    } finally {
      setGenerating(false);
    }
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

          {!(format === 'carrusel' && structure) && (
            <>
              <span className="eyebrow mt">Ángulo (estrategia)</span>
              <div className="seg">
                {OBJECTIVE_LIST.map((o) => (
                  <button key={o.id} className={clsx(objective === o.id && 'on')} onClick={() => setObjective(o.id)}>
                    {o.name}
                  </button>
                ))}
              </div>
              <div className="chips angle-chips">
                <button className={clsx('chip', !angleId && 'on')} onClick={() => setAngleId('')}>Automático</button>
                {anglesByObjective(objective).map((a) => (
                  <button
                    key={a.id}
                    className={clsx('chip', angleId === a.id && 'on')}
                    style={{ ['--tc' as string]: TONES[a.tone].color }}
                    onClick={() => setAngleId(a.id)}
                    title={a.summary}
                  >
                    <i /> {a.name}
                  </button>
                ))}
              </div>
              <p className="hint">
                {angle
                  ? `${angle.summary} Pasos: ${angle.beats.map((b) => b.label).join(' → ')}.`
                  : `${OBJECTIVES[objective].desc} ${OBJECTIVES[objective].tip}`}
              </p>
              {angle && <p className="hint ask-hint">💡 Para encontrar tu idea: {fillAsk(angle.ask)}</p>}
            </>
          )}

          {format === 'reel' && (
            <>
              <span className="eyebrow mt">Estilo de video</span>
              <select className="input" value={styleId} onChange={(e) => setStyleId(e.target.value)}>
                <option value="">Sin definir</option>
                {VIDEO_STYLES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <p className="hint">{videoStyle ? `${videoStyle.how} Cada escena indicará qué se ve.` : 'Elige cómo vas a grabarlo y el guion indicará qué se ve en cada escena.'}</p>
            </>
          )}

          {format === 'carrusel' && structure && (
            <div className="structure-pick">
              <span className="eyebrow">Estructura elegida</span>
              <b>{structure.title}</b>
              <small>{structure.steps.length} slides · cada slide sigue un paso de la estructura</small>
              <button className="btn ghost xs" onClick={() => setStructure(null)}>Quitar estructura</button>
            </div>
          )}

          {format === 'carrusel' && !structure && activeAngle && (
            <p className="hint">La cantidad de slides la define el ángulo: {activeAngle.beats.length} pasos.</p>
          )}

          {format === 'carrusel' && !structure && !activeAngle && (
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
              <p className="hint">¿Prefieres una estructura probada? <Link to="/biblioteca">Elígela en la Biblioteca</Link>.</p>
            </>
          )}

          {format === 'stories' && !activeAngle && (
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

          <button className="btn primary block" disabled={!canGen || generating} onClick={generate}>
            <Wand2 size={16} /> {generating ? 'Generando con Claude…' : 'Generar'}
          </button>
          <p className="hint center">Claude sigue tu estrategia, la estructura elegida y la configuración de tu marca. El resultado se guarda en tu cuenta.</p>
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
