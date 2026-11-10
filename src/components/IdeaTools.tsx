import { useEffect, useMemo, useState } from 'react';
import { Copy, Gift, Map as MapIcon, Search, Sparkles } from 'lucide-react';
import { useData } from '../lib/store';
import { hookVariants } from '../lib/engine';
import { AWARENESS } from '../lib/tones';
import { SPARK_ANGLE_PREFIX } from '../lib/angles';
import type { Spark, ToneId } from '../lib/types';
import { clsx, copyText } from '../lib/utils';
import { Section, useToast } from './ui';

/* ───────────── dónde encontrar ideas reales ───────────── */

const SOURCES: { name: string; ask: string }[] = [
  { name: 'Investigación de tu cliente ideal', ask: '¿Qué frustraciones, miedos y deseos describe con sus propias palabras?' },
  { name: 'Inspiración de la competencia', ask: '¿Qué temas funcionan en tu sector y cómo los tratarías tú desde tu postura?' },
  { name: 'Comentarios en tus publicaciones', ask: '¿Qué dudas y reacciones se repiten debajo de lo que publicas?' },
  { name: 'Mensajes directos', ask: '¿Qué te preguntan una y otra vez en privado?' },
  { name: 'Llamadas de venta', ask: '¿Qué objeciones aparecen antes de que alguien diga que sí?' },
  { name: 'Formularios de ingreso (onboarding)', ask: '¿Qué cuentan que quieren lograr y qué creen que se los impide?' },
  { name: 'Sesiones con clientes', ask: '¿Qué explicaciones o analogías te funcionaron mejor para que entendieran?' },
  { name: 'Los pilares de tu servicio', ask: '¿Cuáles son los 3 a 5 temas que sostienen tu oferta? Cada uno da muchas piezas.' },
];

export function IdeaSources() {
  return (
    <Section title="Dónde encontrar ideas reales" sub="Las mejores ideas no se inventan: se escuchan. Estas son las fuentes más ricas y la pregunta para sacarles partido.">
      <div className="source-grid">
        {SOURCES.map((s) => (
          <div className="source" key={s.name}>
            <b><Search size={14} /> {s.name}</b>
            <p>{s.ask}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────────── mapa de tu cliente ideal → chispas ───────────── */

interface Field {
  id: string;
  label: string;
  hint: string;
  angle: string;
  tone: ToneId;
  title: (line: string) => string;
}

const FIELDS: Field[] = [
  { id: 'problemas', label: 'Problemas', hint: 'Lo externo: lo que no les sale o les falta.', angle: 'problema', tone: 'faro', title: (l) => `El problema de «${l}»: lo que hay detrás` },
  { id: 'errores', label: 'Errores', hint: 'Cosas que hacen con buena intención y no ayudan.', angle: 'errores', tone: 'faro', title: (l) => `Por qué «${l}» es un error` },
  { id: 'frustraciones', label: 'Frustraciones', hint: 'Lo que sienten por dentro y repiten en voz baja.', angle: 'dolor', tone: 'faro', title: (l) => `Cuando «${l}» y nada cambia` },
  { id: 'intentos', label: 'Lo que ya intentaron', hint: 'Soluciones que probaron y no alcanzaron.', angle: 'comparacion', tone: 'giro', title: (l) => `Ya intentaste «${l}» y no alcanzó: esto falta` },
  { id: 'enemigos', label: 'Quién o qué les falló', hint: 'Personas, cursos o promesas que no cumplieron.', angle: 'enemigos', tone: 'giro', title: (l) => `No fue tu culpa: «${l}»` },
  { id: 'miedos', label: 'Miedos', hint: 'Lo que temen que pase si dan el paso.', angle: 'vulnerabilidad', tone: 'brujula', title: (l) => `El miedo a «${l}» y cómo atravesarlo` },
  { id: 'deseos', label: 'Deseos', hint: 'Lo que quieren lograr o sentir.', angle: 'deseo', tone: 'prueba', title: (l) => `Cómo se siente lograr «${l}»` },
];

type AvatarDraft = Record<string, string>;

export function AvatarMap() {
  const { brand, addSparks } = useData();
  const toast = useToast();
  const key = `lucir:avatar:${brand.id}`;
  const [draft, setDraft] = useState<AvatarDraft>({});

  useEffect(() => {
    try {
      setDraft(JSON.parse(localStorage.getItem(key) || '{}'));
    } catch {
      setDraft({});
    }
  }, [key]);

  const set = (id: string, v: string) =>
    setDraft((d) => {
      const n = { ...d, [id]: v };
      try {
        localStorage.setItem(key, JSON.stringify(n));
      } catch {
        /* sin almacenamiento */
      }
      return n;
    });

  const lines = (id: string) => (draft[id] ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
  const total = FIELDS.reduce((n, f) => n + lines(f.id).length, 0);

  const create = () => {
    const items: Omit<Spark, 'id' | 'createdAt' | 'brandId' | 'used'>[] = [];
    FIELDS.forEach((f) =>
      lines(f.id).forEach((l, i) =>
        items.push({
          tone: f.tone,
          title: f.title(l.replace(/[.!?]+$/, '')),
          hook: hookVariants(f.tone, l, brand, i)[0],
          levels: [AWARENESS[1], AWARENESS[2], `${SPARK_ANGLE_PREFIX}${f.angle}`],
        }),
      ),
    );
    if (!items.length) return;
    addSparks(items);
    toast(`${items.length} chispas creadas desde tu mapa`);
  };

  return (
    <Section
      title="Mapa de tu cliente ideal"
      sub="Escribe lo que sabes de tu cliente, una idea por línea. Cada línea se convierte en una chispa con su ángulo y su apertura."
      actions={<span className="badge"><MapIcon size={12} /> {total} {total === 1 ? 'línea' : 'líneas'}</span>}
    >
      <div className="form-grid">
        {FIELDS.map((f) => (
          <label className="field" key={f.id}>
            <span className="label">{f.label}</span>
            <textarea
              className="input area"
              rows={3}
              value={draft[f.id] ?? ''}
              onChange={(e) => set(f.id, e.target.value)}
              placeholder="Una por línea…"
            />
            <small className="hint">{f.hint}</small>
          </label>
        ))}
      </div>
      <div className="pad row-gap">
        <button className="btn primary" disabled={!total} onClick={create}><Sparkles size={15} /> Crear chispas desde mi mapa</button>
        <small className="muted">Se guarda en este navegador mientras lo completas.</small>
      </div>
    </Section>
  );
}

/* ───────────── recursos para regalar a cambio de un comentario ───────────── */

const MAGNETS: { id: string; name: string; ideas: [string, string] }[] = [
  { id: 'guiones', name: 'Guiones', ideas: ['Guion listo para {p}: qué decir paso a paso', 'Tres guiones cortos para {p} según la situación'] },
  { id: 'procesos', name: 'Procesos', ideas: ['El proceso de [n] pasos para {p}', 'Mi proceso interno para {p}, explicado'] },
  { id: 'diagramas', name: 'Diagramas', ideas: ['Diagrama de decisión: qué camino elegir para {p}', 'Esquema visual del método para {p}'] },
  { id: 'mapas', name: 'Mapas mentales', ideas: ['Mapa mental con todo lo que necesitas para {p}', 'Mapa de los errores a evitar al intentar {p}'] },
  { id: 'infografias', name: 'Infografías', ideas: ['Infografía de una página: {p} en 5 pasos', 'Cifras y comparaciones clave sobre {p}'] },
  { id: 'dashboards', name: 'Dashboards', ideas: ['Panel para medir tu avance en {p}', 'Tablero semanal de seguimiento para {p}'] },
  { id: 'templates', name: 'Templates', ideas: ['Plantilla para {p} que puedes copiar y adaptar', 'Plantilla de mensajes para {p}'] },
  { id: 'checklists', name: 'Checklists', ideas: ['Checklist para verificar antes de {p}', 'Checklist semanal para sostener {p}'] },
  { id: 'videos', name: 'Vídeos', ideas: ['Video corto con la explicación completa de {p}', 'Grabación de una sesión real donde se trabaja {p}'] },
  { id: 'prompts', name: 'Prompts', ideas: ['Pack de prompts para {p}', 'Un prompt para diagnosticar tu situación en {p}'] },
  { id: 'retos', name: 'Retos', ideas: ['Reto de 5 días para {p}', 'Reto de una semana: una acción diaria hacia {p}'] },
];

export function MagnetIdeas() {
  const { brand } = useData();
  const toast = useToast();
  const [promise, setPromise] = useState('');
  const [sel, setSel] = useState<string[]>(['checklists', 'templates', 'procesos']);
  const p = (promise.trim() || brand.outcome.trim() || 'lograr tu resultado').replace(/[.!?]+$/, '');

  const ideas = useMemo(
    () => MAGNETS.filter((m) => sel.includes(m.id)).flatMap((m) => m.ideas.map((t) => ({ format: m.name, text: t.replace(/\{p\}/g, p) }))),
    [sel, p],
  );

  const copy = async (text: string) => toast((await copyText(text)) ? 'Copiado' : 'No se pudo copiar');

  return (
    <Section
      title="Recursos para regalar"
      sub="Un recurso que entregas a quien comenta una palabra clave abre una conversación con personas interesadas. Elige formatos y obtén ideas."
    >
      <div className="pad-x">
        <label className="label" htmlFor="magnet-promise">¿Qué ayudas a lograr?</label>
        <input id="magnet-promise" className="input" value={promise} onChange={(e) => setPromise(e.target.value)} placeholder={brand.outcome || 'Ej: ordenar tu agenda de clientes'} />
        <span className="label">Formatos</span>
        <div className="chips">
          {MAGNETS.map((m) => (
            <button key={m.id} className={clsx('chip', sel.includes(m.id) && 'on')} onClick={() => setSel((s) => (s.includes(m.id) ? s.filter((x) => x !== m.id) : [...s, m.id]))}>
              {m.name}
            </button>
          ))}
        </div>
      </div>
      {ideas.length === 0 ? (
        <p className="muted pad">Elige al menos un formato.</p>
      ) : (
        <ul className="magnet-list">
          {ideas.map((i, k) => (
            <li key={k}>
              <span className="badge"><Gift size={11} /> {i.format}</span>
              <span className="grow">{i.text}</span>
              <button className="icon-btn sm" aria-label="Copiar" onClick={() => copy(i.text)}><Copy size={14} /></button>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
