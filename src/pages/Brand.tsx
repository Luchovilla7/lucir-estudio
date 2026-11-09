import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus, Save, X } from 'lucide-react';
import { useData } from '../lib/store';
import { PLATFORMS, VARIANTS } from '../lib/tones';
import type { Brand as BrandT, Platform, Variant } from '../lib/types';
import { clsx, isHex } from '../lib/utils';
import { PageHeader, Section, TagInput } from '../components/ui';

export default function Brand() {
  const { brand, saveBrand, brands } = useData();
  const [draft, setDraft] = useState<BrandT>(brand);
  const [saved, setSaved] = useState(true);
  const lastId = useRef(brand.id);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (lastId.current !== brand.id) {
      lastId.current = brand.id;
      setDraft(brand);
      setSaved(true);
    }
  }, [brand]);

  const upd = <K extends keyof BrandT>(k: K, v: BrandT[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setSaved(false);
  };

  // Guardado automático con pequeña espera
  useEffect(() => {
    if (saved) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      saveBrand(draft);
      setSaved(true);
    }, 700);
    return () => window.clearTimeout(timer.current);
  }, [draft, saved, saveBrand]);

  const saveNow = () => {
    window.clearTimeout(timer.current);
    saveBrand(draft);
    setSaved(true);
  };

  const setColor = (i: number, v: string) => upd('colors', draft.colors.map((c, j) => (j === i ? v : c)));
  const toggleNet = (p: Platform) => upd('networks', draft.networks.includes(p) ? draft.networks.filter((x) => x !== p) : [...draft.networks, p]);

  return (
    <>
      <PageHeader title="Mi Marca" sub="La configuración que se aplica al generar contenido." />

      <div className="card save-bar">
        <div>
          <h2>Configuración de mi marca</h2>
          <p>Esta información se aplica automáticamente al generar contenido.</p>
        </div>
        <button className={clsx('btn', saved ? 'ghost' : 'primary')} onClick={saveNow}>
          {saved ? <><Check size={15} /> Guardado</> : <><Save size={15} /> Guardar</>}
        </button>
      </div>

      <Section title="Identidad" sub="Lo esencial de tu marca.">
        <div className="form-grid">
          <label className="field full">
            <span className="label">Nombre de la marca</span>
            <input className="input" value={draft.name} onChange={(e) => upd('name', e.target.value)} placeholder="Cómo se llama tu negocio o marca" />
          </label>
          <label className="field full">
            <span className="label">Descripción detallada</span>
            <textarea className="input area" rows={5} value={draft.description} onChange={(e) => upd('description', e.target.value)} placeholder="Ej: mentoría de marketing para coaches que ya venden pero arrancan de cero cada mes…" />
            <small className="hint">Qué hace tu marca, qué ofrece y qué la hace distinta.</small>
          </label>
          <label className="field">
            <span className="label">Nicho / industria</span>
            <input className="input" value={draft.niche} onChange={(e) => upd('niche', e.target.value)} placeholder="Ej: coaching, gastronomía, e-commerce…" />
          </label>
          <label className="field">
            <span className="label">Público objetivo</span>
            <input className="input" value={draft.audience} onChange={(e) => upd('audience', e.target.value)} placeholder="A quién le hablas" />
          </label>
          <label className="field">
            <span className="label">Meta mensual de publicaciones</span>
            <input className="input" type="number" min={1} max={200} value={draft.monthlyGoal} onChange={(e) => upd('monthlyGoal', Math.max(1, Number(e.target.value) || 1))} />
            <small className="hint">Cuántas piezas te propones publicar por mes.</small>
          </label>
        </div>
      </Section>

      <Section title="Onboarding del Copiloto" sub="Se responde una sola vez aquí. El Copiloto no vuelve a preguntarlo en el chat.">
        <div className="form-grid">
          <label className="field full">
            <span className="label">¿Qué problema resuelves?</span>
            <textarea className="input area" rows={2} value={draft.problem} onChange={(e) => upd('problem', e.target.value)} placeholder="Ej: mis clientas no logran convertir seguidoras en ventas…" />
          </label>
          <label className="field full">
            <span className="label">¿A quién ayudas?</span>
            <textarea className="input area" rows={2} value={draft.helps} onChange={(e) => upd('helps', e.target.value)} placeholder="Ej: coaches y mentoras que ya venden pero arrancan de cero cada mes…" />
          </label>
          <label className="field full">
            <span className="label">¿Qué logrará tu cliente?</span>
            <textarea className="input area" rows={2} value={draft.outcome} onChange={(e) => upd('outcome', e.target.value)} placeholder="Ej: agenda llena sin perseguir a nadie en 60 días…" />
            <small className="hint">Beneficios tangibles y visibles.</small>
          </label>
        </div>
      </Section>

      <Section title="Voz y palabras clave" sub="Cómo suena tu marca y los términos que la definen.">
        <div className="form-grid">
          <label className="field full">
            <span className="label">Voz y tono de comunicación</span>
            <input className="input" value={draft.voice} onChange={(e) => upd('voice', e.target.value)} placeholder="Ej: cercana y directa, con humor, sin tecnicismos…" />
            <small className="hint">Se aplica además de la guía de estilo de los tonos.</small>
          </label>
          <label className="field full">
            <span className="label">Variante de español</span>
            <select className="input" value={draft.variant} onChange={(e) => upd('variant', e.target.value as Variant)}>
              {VARIANTS.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <small className="hint">Se aplica solo al contenido de esta marca. Por defecto todo se escribe en español neutro latinoamericano.</small>
          </label>
          <div className="field full">
            <span className="label">Palabras clave principales</span>
            <TagInput values={draft.keywords} onChange={(v) => upd('keywords', v)} placeholder="Ej: contenido que vende" />
            <small className="hint">Enter o coma para agregar cada una.</small>
          </div>
          <div className="field full">
            <span className="label">Competidores principales</span>
            <TagInput values={draft.competitors} onChange={(v) => upd('competitors', v)} placeholder="Nombre del competidor" />
            <small className="hint">Referencias del sector. Enter o coma para agregar.</small>
          </div>
        </div>
      </Section>

      <Section title="Marca y canales" sub="Colores de marca y redes activas.">
        <span className="label">Colores de marca</span>
        <div className="colors">
          {draft.colors.map((c, i) => (
            <div className="color-row" key={i}>
              <input type="color" value={isHex(c) && c.length === 7 ? c : '#ff9a5a'} onChange={(e) => setColor(i, e.target.value)} aria-label={`Color ${i + 1}`} />
              <input className="input" value={c} onChange={(e) => setColor(i, e.target.value)} placeholder="#FF9A5A" />
              <button className="icon-btn" onClick={() => upd('colors', draft.colors.filter((_, j) => j !== i))} disabled={draft.colors.length <= 1} aria-label={`Quitar color ${i + 1}`}>
                <X size={15} />
              </button>
            </div>
          ))}
          {draft.colors.length < 6 && (
            <button className="btn ghost sm" onClick={() => upd('colors', [...draft.colors, '#8FB4FF'])}><Plus size={14} /> Agregar color</button>
          )}
        </div>
        <p className="hint">Los dos primeros colores se usan en la vista previa de carruseles y stories.</p>

        <span className="label mt">Redes sociales activas</span>
        <div className="chips">
          {PLATFORMS.map((p) => (
            <button key={p} className={clsx('chip', draft.networks.includes(p) && 'on')} onClick={() => toggleNet(p)}>
              {p}
            </button>
          ))}
        </div>
        <p className="hint pad-x">¿Usas Instagram? <Link to="/metricas">Conéctalo</Link> para ver tus métricas dentro de Lucir.</p>
      </Section>

      <Section title="Ritmo personal" sub="Opcional. Muestra en el Panorama en qué fase de tu ciclo estás cada día y qué conviene hacer en tu contenido.">
        <label className="switch">
          <input type="checkbox" checked={draft.cycleEnabled} onChange={(e) => upd('cycleEnabled', e.target.checked)} />
          <span /> Activar ritmo personal
        </label>
        {draft.cycleEnabled && (
          <div className="form-grid mt">
            <label className="field">
              <span className="label">Inicio de tu ciclo actual</span>
              <input className="input" type="date" value={draft.cycleStart} onChange={(e) => upd('cycleStart', e.target.value)} />
            </label>
            <label className="field">
              <span className="label">Duración (días)</span>
              <input className="input" type="number" min={20} max={45} value={draft.cycleLength} onChange={(e) => upd('cycleLength', Math.max(20, Math.min(45, Number(e.target.value) || 28)))} />
            </label>
          </div>
        )}
        <p className="hint">{brands.length <= 1 ? 'No puedes eliminar la única marca configurada.' : 'Puedes eliminar marcas desde el selector del menú lateral.'}</p>
      </Section>
    </>
  );
}
