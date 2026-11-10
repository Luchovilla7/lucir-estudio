/**
 * Motor de generación LOCAL de Lucir Estudio.
 *
 * Es determinista y sin red: arma borradores a partir de la idea, la marca y el tono.
 * Toda la app lo consume a través de `generatePiece`, `generateSparks` y `copilotReply`,
 * de modo que cuando exista backend basta con reemplazar estas funciones por llamadas
 * a la API (ver README, sección "Qué falta").
 */
import { AWARENESS, TONES } from './tones';
import type { Block, Brand, GenRequest, ToneId } from './types';
import { hashStr, localize, uid } from './utils';

/* ───────────── utilidades de texto ───────────── */

const stripEnd = (s: string) => s.trim().replace(/[.!?…\s]+$/g, '');
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const lowerFirst = (s: string) => (s.length > 1 && s[1] === s[1].toLowerCase() ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toLowerCase();

interface Ctx {
  core: string;
  aud: string;
  outcome: string;
  problem: string;
  kw: string;
  brand: Brand;
  brandName: string;
  evidence: string;
  niche: string;
  cta: string;
  seed: number;
}

function buildCtx(req: GenRequest, brand: Brand): Ctx {
  // La idea es texto libre: se cita entre comillas angulares para que cualquier frase encaje gramaticalmente.
  const core = `«${stripEnd(req.idea)}»`;
  return {
    core,
    aud: brand.audience.trim() || 'tu cliente ideal',
    outcome: brand.outcome.trim() ? lowerFirst(stripEnd(brand.outcome)) : '[el resultado que logra tu cliente]',
    problem: brand.problem.trim() ? lowerFirst(stripEnd(brand.problem)) : '[el problema que resuelves]',
    kw: brand.keywords[0] || brand.niche || 'tu tema',
    brand,
    brandName: brand.name.trim() || 'tu marca',
    evidence: req.evidence.trim(),
    niche: brand.niche.trim() || 'tu sector',
    cta: 'QUIERO',
    seed: req.seed,
  };
}

const fill = (tpl: string, c: Ctx) => tpl.replace(/\{core\}/g, c.core);

/* ───────────── detección de tono ───────────── */

export function suggestTone(idea: string): ToneId {
  const t = idea.toLowerCase();
  if (t.trim().length < 6) return 'faro';
  let best: ToneId = 'faro';
  let bestScore = 0;
  (Object.keys(TONES) as ToneId[]).forEach((id) => {
    const score = TONES[id].keywords.reduce((acc, k) => (t.includes(k) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      best = id;
      bestScore = score;
    }
  });
  if (bestScore === 0) {
    const order: ToneId[] = ['faro', 'prueba', 'giro', 'brujula'];
    return order[hashStr(t) % 4];
  }
  return best;
}

/* ───────────── ganchos de apertura por tono ───────────── */

const HOOKS: Record<ToneId, ((c: Ctx) => string)[]> = {
  faro: [
    (c) => `Detrás de ${c.core} hay una causa que probablemente no estás mirando.`,
    (c) => `Hay una causa detrás de ${c.core} que casi nadie nombra. Hoy la señalo.`,
    (c) => `${c.core}: no es falta de esfuerzo. Es esto.`,
  ],
  prueba: [
    (c) => `[Resultado concreto]. Todo empezó con ${c.core}.`,
    (c) => `Hace [tiempo] vivía esto: ${c.core}. Esto fue lo que cambió.`,
    (c) => `De ${c.core} a [resultado real]: el camino sin adornos.`,
  ],
  giro: [
    (c) => `Todos hacen lo mismo con ${c.core}. Yo hago lo contrario.`,
    (c) => `El consejo habitual sobre ${c.core} no me convence, y te explico por qué.`,
    (c) => `Lo estándar en ${c.niche} deja ${c.core} a medias. Esta es la otra mitad.`,
  ],
  brujula: [
    (c) => `Hay algo que no voy a hacer en ${c.brandName}, y ${c.core} es parte de la razón.`,
    (c) => `Mi postura sobre ${c.core}, sin rodeos.`,
    (c) => `Lo que creo sobre ${c.core} va contra lo que más se enseña.`,
  ],
};

export function hookVariants(tone: ToneId, idea: string, brand: Brand, seed = 0): string[] {
  const c = buildCtx({ format: 'post', idea: idea || 'tu tema', evidence: '', tone, slides: 0, seed }, brand);
  const list = HOOKS[tone];
  return list.map((_, i) => localize(list[(i + seed) % list.length](c), brand.variant));
}

/* ───────────── arcos narrativos ───────────── */

interface Step {
  label: string;
  text: (c: Ctx) => string;
}

const CLOSE = (c: Ctx) =>
  `¿Quieres aplicarlo en tu caso? Guarda este contenido y escríbeme «${c.cta}» por mensaje directo.`;

const ARCS: Record<ToneId, Step[]> = {
  faro: [
    { label: 'Gancho', text: (c) => HOOKS.faro[c.seed % 3](c) },
    { label: 'Espejo', text: (c) => `Te suena: tu público vive esto y cree que le falta esfuerzo, tiempo o suerte. No es eso.` },
    { label: 'La causa invisible', text: (c) => `Lo que casi nadie nombra de ${c.core}: tiene una causa que no se ve desde dentro. [Nombra aquí la causa concreta desde tu experiencia].` },
    { label: 'Cómo se manifiesta', text: () => `Se nota en señales pequeñas: [señal 1], [señal 2], [señal 3]. Cada una parece menor; juntas cuentan la historia.` },
    { label: 'Por qué lo típico falla', text: () => `Lo habitual es atacar el síntoma. Funciona unos días y vuelve, porque la causa sigue intacta.` },
    { label: 'El reencuadre', text: (c) => `Mirado así cambia todo: ${c.core} no es un fallo tuyo, es consecuencia de [la causa].` },
    { label: 'Lo que hago yo', text: (c) => `En ${c.brandName} empezamos por ${c.kw}: ordenamos la causa antes de tocar la táctica.` },
    { label: 'Un primer paso', text: () => `Esta semana prueba esto: [acción pequeña y concreta]. Te mostrará si la causa está donde creo.` },
    { label: 'Lo que cambia', text: (c) => `Cuando la causa se nombra, ${c.outcome}. No de golpe, pero sí con dirección.` },
    { label: 'Cierre', text: CLOSE },
  ],
  prueba: [
    { label: 'Gancho', text: (c) => HOOKS.prueba[c.seed % 3](c) },
    { label: 'El punto de partida', text: () => `Antes: la situación era así: [descripción específica del antes, con las palabras de tu cliente].` },
    { label: 'Lo que habían probado', text: () => `Ya habían intentado [intento 1] y [intento 2]. Tenía sentido. No alcanzó.` },
    { label: 'El cambio', text: () => `Lo que cambió fue una decisión concreta: [decisión o ajuste].` },
    {
      label: 'La evidencia',
      text: (c) => (c.evidence ? `«${c.evidence}»` : `[Pega aquí un testimonio, mensaje o dato real. Si no lo tienes, no inventes cifras.]`),
    },
    { label: 'El proceso', text: () => `El camino, sin adornos: 1) [paso]. 2) [paso]. 3) [paso].` },
    { label: 'El después', text: (c) => `Hoy: ${c.outcome}. [Dato real que lo respalde].` },
    { label: 'Lo que costó', text: () => `Tampoco fue magia: costó [tiempo o decisión incómoda]. Eso también es parte de la prueba.` },
    { label: 'La lección', text: (c) => `Lo que me llevo: ${c.core} se resuelve con [principio], no con más esfuerzo.` },
    { label: 'Cierre', text: CLOSE },
  ],
  giro: [
    { label: 'Gancho', text: (c) => HOOKS.giro[c.seed % 3](c) },
    { label: 'Lo estándar', text: () => `El consejo habitual: [práctica estándar]. Suena razonable y es lo que repite todo el sector.` },
    { label: 'Dónde se rompe', text: () => `El problema: funciona en teoría y se rompe cuando se aplica en el día a día real.` },
    { label: 'Mi alternativa', text: () => `Mi versión: [tu alternativa]. No es contra nadie, es otra lógica.` },
    { label: 'Por qué funciona', text: () => `Funciona porque [mecanismo]: cambia el punto de partida, no solo la táctica.` },
    { label: 'Cómo se ve', text: () => `En la práctica se ve así: [ejemplo concreto con detalles].` },
    { label: 'Lo que cambia para ti', text: (c) => `Para ${c.aud}: menos [fricción], más [ganancia].` },
    { label: 'La objeción', text: () => `«¿Y si no funciona en mi caso?» Depende de [condición]. Te digo cuándo no lo haría.` },
    { label: 'Qué probar', text: () => `Prueba esto durante 7 días: [micro-experimento].` },
    { label: 'Cierre', text: CLOSE },
  ],
  brujula: [
    { label: 'Gancho', text: (c) => HOOKS.brujula[c.seed % 3](c) },
    { label: 'Lo que creo', text: (c) => `Creo que [creencia central] y que ${c.core} lo demuestra.` },
    { label: 'De dónde viene', text: () => `Esta postura no nació en un libro: nació cuando [momento real].` },
    { label: 'Lo que no haré', text: (c) => `No voy a [práctica], aunque sea lo que se espera en ${c.niche}.` },
    { label: 'El costo', text: () => `Esta postura me costó [algo concreto]. Y la mantendría.` },
    { label: 'Lo que sí hago', text: () => `Lo que sí hago: [acción alineada con tu creencia].` },
    { label: 'Para quién es', text: (c) => `Si ${c.aud} se reconocen en [rasgo], esto va a resonarles.` },
    { label: 'Para quién no', text: () => `Y si buscas [lo contrario], probablemente no soy la persona. Está bien.` },
    { label: 'Cómo se aplica', text: () => `Lo bajo a tierra así: [ejemplo].` },
    { label: 'Cierre', text: CLOSE },
  ],
};

const EXTRAS: Step[] = [
  { label: 'Ejemplo real', text: (c) => `Ejemplo: [escena concreta donde alguien vive ${c.core}].` },
  { label: 'Error frecuente', text: (c) => `Error frecuente: [lo que casi todos hacen al enfrentar ${c.core}].` },
  { label: 'Mini-historia', text: () => `Una mini-historia: [persona, momento, frase literal].` },
  { label: 'Pregunta para ti', text: (c) => `Pregunta para ti: ¿en qué punto de ${c.core} estás hoy? [Opciones].` },
  { label: 'Dato que respalda', text: () => `Dato que respalda esto: [dato real con su fuente]. Si no tienes uno, elimina este bloque.` },
  { label: 'Resumen intermedio', text: () => `Hasta aquí: [idea 1], [idea 2], [idea 3].` },
  { label: 'Analogía', text: (c) => `Piénsalo como [analogía cotidiana]: ${c.core} funciona igual.` },
  { label: 'Contraargumento', text: () => `Quien no está de acuerdo diría [objeción]. Tiene sentido, y por eso [respuesta].` },
  { label: 'Detalle práctico', text: () => `Detalle práctico que cambia el resultado: [detalle].` },
  { label: 'Recordatorio', text: () => `Si solo te quedas con una cosa: [idea central en una frase].` },
];

function pickSteps(tone: ToneId, n: number): Step[] {
  const arc = ARCS[tone];
  if (n >= arc.length) {
    const out = arc.slice();
    for (let k = 0; k < n - arc.length; k++) {
      const pos = Math.min(4 + k, out.length - 1);
      out.splice(pos, 0, EXTRAS[k % EXTRAS.length]);
    }
    return out;
  }
  if (n <= 1) return [arc[0]];
  const idx: number[] = [];
  for (let i = 0; i < n; i++) idx.push(Math.round((i * (arc.length - 1)) / (n - 1)));
  return Array.from(new Set(idx)).map((i) => arc[i]);
}

/* ───────────── stories: 16 plantillas (4 por tono) ───────────── */

export interface StoryTemplate {
  id: string;
  name: string;
  plates: string[];
}

export const STORY_TEMPLATES: Record<ToneId, StoryTemplate[]> = {
  faro: [
    { id: 'faro-1', name: 'Encuesta de causa', plates: ['¿Cuál crees que es la causa real de {core}?', 'Vota: A) [opción] · B) [opción] (sticker de encuesta).', 'Lo que casi nadie ve: [causa oculta en una frase].', 'Cuéntame por mensaje cuál fue la tuya.'] },
    { id: 'faro-2', name: 'Señales ocultas', plates: ['3 señales de que {core} te cuesta más de lo que crees.', '1) [señal] · 2) [señal]', '3) [señal]. Si marcaste dos, sigue leyendo.', 'Responde «LUZ» y te mando el siguiente paso.'] },
    { id: 'faro-3', name: 'Mito y causa', plates: ['Mito: «[creencia común sobre {core}]».', 'Lo que pasa en realidad: [explicación breve].', 'Así se ve cuando se corrige: [ejemplo].', '¿Te había pasado? Responde con un emoji.'] },
    { id: 'faro-4', name: 'Pregunta abierta', plates: ['Pregunta: ¿qué te frena hoy con {core}?', 'Lo que más me responden: [respuesta 1], [respuesta 2].', 'Lo que hay debajo de todas: [causa común].', 'Mañana lo desarmo paso a paso. Activa el recordatorio.'] },
  ],
  prueba: [
    { id: 'prueba-1', name: 'Mini caso', plates: ['Caso real: {core}.', 'Antes: [situación inicial con sus palabras].', 'Después: [resultado concreto y verificable].', '¿Quieres ver cómo lo hicimos? Escribe «CASO».'] },
    { id: 'prueba-2', name: 'Captura y contexto', plates: ['Esto me escribieron esta semana.', '[Captura de un testimonio, con permiso].', 'Lo que hay detrás: [qué se hizo].', 'Si estás en ese punto, respóndeme.'] },
    { id: 'prueba-3', name: 'Proceso en 4', plates: ['Cómo se resolvió {core} en [tiempo].', 'Paso 1: [paso] · Paso 2: [paso].', 'Paso 3: [paso] · Paso 4: [paso].', 'Guarda esta secuencia y cuéntame cómo te va.'] },
    { id: 'prueba-4', name: 'Cuenta honesta', plates: ['Resultado de [periodo]: [cifra real].', 'Lo que funcionó: [qué].', 'Lo que no: [qué].', 'Lo que haré distinto: [ajuste].'] },
  ],
  giro: [
    { id: 'giro-1', name: 'Todos vs. yo', plates: ['Todos hacen [práctica estándar] con {core}.', 'Yo hago esto: [tu alternativa].', 'Por qué: [mecanismo en una frase].', '¿Tú cuál prefieres? Vota en la encuesta.'] },
    { id: 'giro-2', name: 'Consejo en revisión', plates: ['Consejo repetido: «[consejo]».', 'Dónde falla: [caso].', 'Qué haría yo: [alternativa].', '¿Lo has probado? Cuéntame.'] },
    { id: 'giro-3', name: 'Mi enfoque en 4', plates: ['Mi enfoque para {core}, en 4 placas.', 'Principio: [principio].', 'Se aplica así: [ejemplo].', 'Si te hace sentido, responde «ENFOQUE».'] },
    { id: 'giro-4', name: 'Pregunta provocadora', plates: ['¿Y si {core} se resolviera al revés?', 'Lo habitual: [práctica]. Lo contrario: [práctica].', 'Resultado al invertirlo: [resultado].', 'Debate abierto: ¿estás de acuerdo? Responde.'] },
  ],
  brujula: [
    { id: 'brujula-1', name: 'Línea roja', plates: ['Algo que no negocio con {core}: [límite].', 'Por qué: [razón real].', 'Lo que sí ofrezco: [alternativa].', 'Si resuenas, escríbeme.'] },
    { id: 'brujula-2', name: 'Credo en cuatro', plates: ['Creo que [creencia].', 'Lo veo cuando [escena concreta].', 'Por eso hago [acción alineada].', '¿Compartes esta idea? Respóndeme con ✋.'] },
    { id: 'brujula-3', name: 'Para quién sí y no', plates: ['Esto es para ti si [rasgo].', 'También si [rasgo].', 'No es para ti si [rasgo opuesto].', 'Si eres de las primeras, escríbeme «SÍ».'] },
    { id: 'brujula-4', name: 'Decisión y costo', plates: ['Decisión que tomé sobre {core}: [decisión].', 'Me costó: [costo concreto].', 'Lo que ganó mi trabajo: [ganancia].', '¿Tuviste una decisión así? Cuéntamela.'] },
  ],
};

const PLATE_LABELS = ['Placa 1 · Apertura', 'Placa 2 · Desarrollo', 'Placa 3 · Giro', 'Placa 4 · Cierre'];

/* ───────────── carta (email) ───────────── */

export const EMAIL_QUESTIONS = [
  '¿Qué pasó exactamente? Una escena concreta: dónde, cuándo y con quién.',
  '¿Qué pensaste o sentiste en ese momento?',
  '¿Qué aprendiste que le sirve a tu cliente?',
  '¿Qué quieres que haga tu lector después de leer?',
  '¿Qué prueba real tienes (testimonio, dato, resultado)?',
];

const MORAL: Record<ToneId, (c: Ctx) => string> = {
  faro: (c) => `Lo que me dejó esa escena es simple y un poco incómodo: ${c.core} casi nunca se arregla donde duele. Se arregla donde nadie está mirando. Cuando nombras la causa real, el problema deja de ser un misterio y se convierte en una decisión.`,
  prueba: (c) => `Lo que me dejó esa escena es que ${c.core} no se resuelve con más esfuerzo, sino con un cambio concreto y medible. Los resultados no llegan por intuición ni por suerte: llegan cuando alguien se atreve a probar una pieza distinta y mirar qué pasa.`,
  giro: (c) => `Lo que me dejó esa escena es que el consejo estándar sobre ${c.core} tiene un hueco. No es mala fe de nadie; es que fue diseñado para otro contexto. Cuando cambias el punto de partida, el resto del camino se ordena solo.`,
  brujula: (c) => `Lo que me dejó esa escena es una convicción: sobre ${c.core} prefiero ser clara y perder una venta antes que prometer algo que no puedo sostener. Esa línea no se negocia, y con el tiempo se volvió mi mejor filtro.`,
};

function buildEmail(req: GenRequest, c: Ctx): { title: string; blocks: Block[] } {
  const a = req.email?.answers ?? [];
  const scene = a[0]?.trim() || '[Describe la escena: dónde estabas, con quién y qué dijo o hizo esa persona]';
  const feeling = a[1]?.trim() || '[Qué pensaste o sentiste en ese momento]';
  const learning = a[2]?.trim();
  const action = a[3]?.trim() || '[Responder este correo, reservar una llamada o abrir un enlace]';
  const proof = a[4]?.trim() || c.evidence || '[Pega aquí un testimonio, dato o resultado real. No inventes cifras]';

  const subjectByTone: Record<ToneId, string> = {
    faro: `La causa que nadie ve detrás de ${c.core}`,
    prueba: `Lo que cambió con ${c.core}`,
    giro: `Lo que casi nadie dice sobre ${c.core}`,
    brujula: `Mi postura sobre ${c.core}`,
  };

  const story = [
    'Hola [nombre],',
    `Hace poco viví algo que no me puedo quitar de la cabeza. ${scene}.`,
    `En ese momento pensé: ${feeling}. No dije nada de inmediato; me quedé mirando la situación, porque reconocí un patrón que veo seguido en ${c.aud}.`,
    `Lo curioso es que nadie estaba haciendo algo mal. Todos tenían buenas razones y estaban haciendo lo que se supone que se hace. Y aun así, el resultado no aparecía. Esa mezcla de esfuerzo y estancamiento es justo lo que te quiero contar hoy, porque tiene que ver con ${c.core}.`,
  ].join('\n\n');

  const moral = learning ? `${MORAL[req.tone](c)}\n\nY lo resumo así: ${learning}` : MORAL[req.tone](c);

  const promesa = `Promesa. Si aplicas esta forma de mirar ${c.core}, vas a poder ${c.outcome} sin depender de más horas de trabajo ni de más herramientas. No es una fórmula mágica: es un orden distinto de decisiones.`;
  const imagen = `Imagen. Imagina que dentro de unas semanas abres tu bandeja y ya no hay urgencias disfrazadas de importantes. Sabes qué hacer primero, tu equipo o tus clientes entienden el proceso, y ${c.problem} deja de ser el tema de cada semana. Eso es lo que buscamos en ${c.brandName}.`;
  const prueba = `Prueba. ${proof}`;
  const empuje = `Empuje. Si quieres que revisemos juntas cómo se ve esto en tu caso, el siguiente paso es simple: ${action}. Hazlo hoy, mientras la idea está fresca.`;

  const blocks: Block[] = [
    { id: uid('b'), label: 'Asunto', text: subjectByTone[req.tone] },
    { id: uid('b'), label: 'Historia', text: story },
    { id: uid('b'), label: 'Moraleja', text: moral },
    { id: uid('b'), label: 'Propuesta · Promesa', text: promesa },
    { id: uid('b'), label: 'Propuesta · Imagen', text: imagen },
    { id: uid('b'), label: 'Propuesta · Prueba', text: prueba },
    { id: uid('b'), label: 'Propuesta · Empuje', text: empuje },
    { id: uid('b'), label: 'P.D.', text: `P.D. Si esta carta te hizo pensar en alguien, reenvíasela. A veces una sola idea bien puesta cambia la semana de otra persona.` },
  ];
  return { title: subjectByTone[req.tone], blocks };
}

/* ───────────── reel ───────────── */

function buildReel(req: GenRequest, c: Ctx): Block[] {
  const turn: Record<ToneId, string> = {
    faro: `La causa real es [causa]. Y se nota en [señal].`,
    prueba: `Lo que cambió fue [decisión], y el resultado fue [dato real].`,
    giro: `Yo hago lo contrario: [alternativa]. Y por eso [resultado].`,
    brujula: `Yo creo [creencia], y por eso [acción alineada].`,
  };
  const hook = HOOKS[req.tone][req.seed % 3](c);
  const scenes: { label: string; say: string; show: string }[] = [
    { label: 'Gancho · 0–3 s', say: hook, show: 'Plano medio, mirada a cámara, sin intro. Escribe la frase en pantalla.' },
    { label: 'Contexto · 3–10 s', say: `Si eres parte de ${c.aud} y te suena esto: ${c.core}, este video es para ti.`, show: 'Corte rápido. Subtítulos grandes y una imagen de apoyo.' },
    { label: 'Tensión · 10–20 s', say: `Lo que casi todos hacen es [error común], y por eso [consecuencia].`, show: 'Gesto de énfasis con las manos. Inserta un ejemplo visual.' },
    { label: 'Giro · 20–35 s', say: turn[req.tone], show: req.evidence ? `Muestra el testimonio en pantalla: «${clip(req.evidence, 90)}»` : 'Muestra una captura o dato real en pantalla (con permiso).' },
    { label: 'Cierre y CTA · 35–45 s', say: `Si quieres ${c.outcome}, guarda este video y escríbeme «${c.cta}».`, show: 'Mirada a cámara, sonrisa breve, texto del CTA en pantalla.' },
  ];
  const blocks: Block[] = scenes.map((s) => ({ id: uid('b'), label: s.label, text: `Dices: ${s.say}\nSe ve: ${s.show}` }));
  blocks.push({
    id: uid('b'),
    label: 'Notas de producción',
    text: 'Duración objetivo: 35 a 45 segundos. Graba con luz frontal, habla un 10 % más rápido que en conversación y deja un silencio breve tras el gancho. Elige audio original o una pista instrumental suave.',
  });
  return blocks;
}

/* ───────────── punto de entrada ───────────── */

export function generatePiece(req: GenRequest, brand: Brand): { title: string; blocks: Block[]; caption: string; templateId?: string } {
  const c = buildCtx(req, brand);
  const title = clip(cap(stripEnd(req.idea)), 80);
  const v = (s: string) => localize(s, brand.variant);
  const tags = brand.keywords
    .slice(0, 3)
    .map((k) => `#${slug(k)}`)
    .filter((t) => t.length > 1)
    .join(' ');

  if (req.format === 'email') {
    const e = buildEmail(req, c);
    return { title: clip(e.title, 90), blocks: e.blocks.map((b) => ({ ...b, text: v(b.text) })), caption: '' };
  }

  if (req.format === 'stories') {
    const list = STORY_TEMPLATES[req.tone];
    const tpl = list.find((t) => t.id === req.templateId) ?? list[hashStr(req.idea + req.seed) % list.length];
    const blocks = tpl.plates.map((p, i) => ({ id: uid('b'), label: PLATE_LABELS[i], text: v(fill(p, c)) }));
    return { title: `Stories · ${clip(cap(stripEnd(req.idea)), 60)}`, blocks, caption: '', templateId: tpl.id };
  }

  if (req.format === 'reel') {
    const blocks = buildReel(req, c).map((b) => ({ ...b, text: v(b.text) }));
    return { title, blocks, caption: v(`${HOOKS[req.tone][req.seed % 3](c)}\n\nGuarda este reel para tenerlo a mano. ${tags}`.trim()) };
  }

  if (req.format === 'post') {
    const steps = ARCS[req.tone];
    const body = [steps[1], steps[2], steps[5]].map((s) => s.text(c)).join('\n\n');
    const blocks: Block[] = [
      { id: uid('b'), label: 'Gancho', text: v(steps[0].text(c)) },
      { id: uid('b'), label: 'Cuerpo', text: v(body) },
      { id: uid('b'), label: 'Cierre', text: v(steps[9].text(c)) },
    ];
    return { title, blocks, caption: '' };
  }

  // carrusel con una estructura de la Biblioteca: cada slide sigue su paso y se rellena a mano
  if (req.structure && req.structure.steps.length) {
    const sBlocks: Block[] = req.structure.steps.map((step, i) => ({
      id: uid('b'),
      label: `Slide ${i + 1} · ${clip(step, 52)}`,
      text: v(`[Escribe aquí: ${step}]`),
    }));
    const sCaption = v(`${HOOKS[req.tone][req.seed % 3](c)}\n\nDesliza y guarda este carrusel para volver a él. ${tags}`.trim());
    return { title, blocks: sBlocks, caption: sCaption, templateId: `struct:${req.structure.id}` };
  }

  // carrusel
  const n = Math.max(3, Math.min(20, req.slides || 7));
  const steps = pickSteps(req.tone, n);
  const blocks: Block[] = steps.map((s, i) => ({
    id: uid('b'),
    label: i === 0 ? 'Slide 1 · Gancho' : i === steps.length - 1 ? `Slide ${i + 1} · Cierre` : `Slide ${i + 1} · ${s.label}`,
    text: v(s.text(c)),
  }));
  const caption = v(`${HOOKS[req.tone][req.seed % 3](c)}\n\nDesliza y guarda este carrusel para volver a él. ${tags}`.trim());
  return { title, blocks, caption };
}

/* ───────────── chispas (ideas) ───────────── */

interface SparkTpl {
  title: (k: string, c: { aud: string; niche: string; outcome: string }) => string;
  hook: (k: string, c: { aud: string }) => string;
}

const SPARKS: Record<ToneId, SparkTpl[]> = {
  faro: [
    { title: (k) => `El error invisible detrás de ${k}`, hook: (k) => `Hay un error en ${k} que no se ve desde dentro. Y probablemente lo estás cometiendo hoy.` },
    { title: (k, c) => `Por qué ${c.aud} sigue sin ${c.outcome} aunque hace todo bien`, hook: () => `Hiciste todo lo que decían y el resultado no llega. El problema no eres tú: es el orden.` },
    { title: (k) => `Lo que no se ve de ${k} desde dentro`, hook: (k) => `Desde dentro de ${k} hay una variable imposible de ver. Hoy te la señalo.` },
    { title: (k) => `La señal temprana de que ${k} se está torciendo`, hook: (k) => `Antes de que ${k} se complique, aparece una señal pequeña. Casi nadie la nota.` },
    { title: (k) => `Tres síntomas de ${k} que se confunden con cansancio`, hook: () => `Crees que es cansancio, pero son tres síntomas con una misma causa.` },
    { title: (k) => `La pregunta que nadie se hace antes de ${k}`, hook: (k) => `Antes de ${k}, hay una pregunta que cambia todo lo que viene después.` },
  ],
  prueba: [
    { title: (k) => `Antes y después: un caso real de ${k}`, hook: () => `Hace tres meses escribió: «[frase literal]». Esta semana escribió algo muy distinto.` },
    { title: (k) => `Cómo pasamos de [punto A] a [punto B] con ${k}`, hook: () => `De [punto A] a [punto B] en [tiempo]. Estos fueron los pasos, en orden.` },
    { title: (k, c) => `Lo que costó lograr ${c.outcome}`, hook: () => `[Resultado real], y también lo que costó. Las dos cosas son verdad.` },
    { title: (k) => `El mensaje de un cliente que cambió cómo explico ${k}`, hook: () => `Un mensaje de un cliente me hizo reescribir cómo explico mi trabajo.` },
    { title: (k) => `Una semana de trabajo en ${k}: qué hicimos y qué salió`, hook: (k) => `Una semana trabajando ${k} desde adentro: lo que hicimos y lo que salió.` },
    { title: () => `Resultado con letra chica: lo que no sale en la captura`, hook: () => `Esta captura se ve perfecta. Lo que no muestra es esto.` },
  ],
  giro: [
    { title: (k) => `Todos hacen X con ${k}; esto es lo que hago distinto`, hook: (k) => `En mi sector todos hacen lo mismo con ${k}. Yo hago lo contrario.` },
    { title: (k) => `El consejo sobre ${k} que ya no repito`, hook: (k) => `Hubo un consejo sobre ${k} que repetí durante años. Hoy ya no.` },
    { title: (k, c) => `Por qué lo estándar en ${c.niche} deja la mitad del trabajo sin hacer`, hook: () => `Lo estándar resuelve la mitad del problema. Hoy hablo de la otra mitad.` },
    { title: (k) => `Mi regla contraria para ${k}`, hook: (k) => `Mi regla para ${k} suena al revés. Por eso funciona.` },
    { title: (k) => `Lo que el sector no dice de ${k}`, hook: (k) => `Hay algo de ${k} que el sector prefiere no mencionar.` },
    { title: (k) => `Menos herramientas, más ${k}`, hook: (k) => `No necesitas otra herramienta. Necesitas más ${k} y menos ruido.` },
  ],
  brujula: [
    { title: (k) => `Lo que no negocio cuando trabajo en ${k}`, hook: (k) => `Hay una cosa que no negocio nunca cuando trabajo en ${k}.` },
    { title: (k, c) => `La decisión que más me costó en ${c.niche}`, hook: () => `Tomé una decisión que casi nadie entendió. Me costó caro y la volvería a tomar.` },
    { title: (k) => `Mi postura sobre ${k}`, hook: (k) => `Esta es mi postura sobre ${k}, sin suavizarla.` },
    { title: () => `A quién no le sirve lo que hago, y está bien`, hook: () => `Mi trabajo no es para todo el mundo. Te digo para quién no es.` },
    { title: (k) => `Lo que creo sobre ${k} y casi nadie dice`, hook: (k) => `Creo algo sobre ${k} que va contra lo que más se enseña.` },
    { title: (k) => `La conversación incómoda que tuve sobre ${k}`, hook: (k) => `Tuve una conversación incómoda sobre ${k}. Te cuento qué dije.` },
  ],
};

const LEVELS: Record<ToneId, [number, number]> = {
  faro: [0, 1],
  prueba: [2, 3],
  giro: [1, 2],
  brujula: [3, 4],
};

export function generateSparks(
  brand: Brand,
  tone: ToneId | 'all',
  context: string,
  existingCount: number,
): { tone: ToneId; title: string; hook: string; levels: string[] }[] {
  const tones: ToneId[] = tone === 'all' ? ['faro', 'prueba', 'giro', 'brujula'] : [tone];
  const per = tone === 'all' ? 2 : 6;
  const kwPool = brand.keywords.length ? brand.keywords : [brand.niche || 'tu tema'];
  const ctxLine = { aud: brand.audience.trim() || 'tu cliente ideal', niche: brand.niche.trim() || 'tu sector', outcome: brand.outcome.trim() ? lowerFirst(stripEnd(brand.outcome)) : 'el resultado que buscan' };
  const out: { tone: ToneId; title: string; hook: string; levels: string[] }[] = [];

  tones.forEach((t, ti) => {
    for (let i = 0; i < per; i++) {
      const tpl = SPARKS[t][(existingCount + i) % SPARKS[t].length];
      let k = kwPool[(existingCount + ti + i) % kwPool.length];
      if (context.trim() && i === 0) k = lowerFirst(clip(stripEnd(context), 60));
      const lv = LEVELS[t];
      out.push({
        tone: t,
        title: localize(cap(tpl.title(k, ctxLine)), brand.variant),
        hook: localize(tpl.hook(k, ctxLine), brand.variant),
        levels: [AWARENESS[lv[0]], AWARENESS[lv[1]]],
      });
    }
  });
  return out;
}

/* ───────────── copiloto (chat) ───────────── */

export interface CopilotTurn {
  text: string;
  tone: ToneId;
  idea: string;
  format: GenRequest['format'];
}

const FORMAT_BY_TONE: Record<ToneId, GenRequest['format']> = {
  faro: 'carrusel',
  prueba: 'carrusel',
  giro: 'post',
  brujula: 'reel',
};

export function copilotWelcome(brand: Brand): string {
  const name = brand.name.trim() || 'tu marca';
  return `Hola. Bienvenida al Copiloto de ${name}.\n\nYa tengo cargada la configuración de tu marca, así que vamos directo al punto: cuéntame una idea de contenido (una conversación real con un cliente, una objeción, algo del sector con lo que no estás de acuerdo o un dolor típico de tu público) y la convierto en una pieza con estructura clara.`;
}

export function copilotReply(input: string, brand: Brand, history: { role: 'user' | 'ai'; idea?: string }[]): CopilotTurn {
  const msg = input.trim();
  const turns = history.filter((h) => h.role === 'user').length;
  const prevIdea = [...history].reverse().find((h) => h.role === 'ai' && h.idea)?.idea;
  const wantsHooks = /otro gancho|más ganchos|mas ganchos|otras aperturas|otro inicio/i.test(msg);
  const refinement = !!prevIdea && !wantsHooks && msg.length < 70;
  const idea = wantsHooks && prevIdea ? prevIdea : refinement && prevIdea ? `${prevIdea}. ${msg}` : msg;
  const tone = suggestTone(idea);
  const t = TONES[tone];
  const hooks = hookVariants(tone, idea, brand, turns + (wantsHooks ? 1 : 0));
  const format = FORMAT_BY_TONE[tone];
  const c = buildCtx({ format, idea, evidence: '', tone, slides: 7, seed: turns }, brand);
  const beats = pickSteps(tone, 5).map((s) => s.label.toLowerCase()).join(' → ');

  const lines: string[] = [];
  if (wantsHooks) {
    lines.push('Aquí tienes otras tres formas de abrir la misma idea:');
  } else if (refinement) {
    lines.push(`Lo incorporo a la idea. Sigo leyéndola con el tono **${t.name}** (${lowerFirst(t.tagline)})`);
  } else {
    lines.push(`Buena materia prima. La leo con el tono **${t.name}**: ${lowerFirst(t.tagline)}`);
  }
  lines.push('');
  lines.push('Tres ganchos para abrir:');
  hooks.forEach((h, i) => lines.push(`${i + 1}. ${h}`));
  if (!wantsHooks) {
    lines.push('');
    lines.push(`Estructura sugerida (${FORMAT_BY_TONE[tone] === 'carrusel' ? 'carrusel de 5 a 7 slides' : FORMAT_BY_TONE[tone] === 'reel' ? 'reel de 40 segundos' : 'post de texto'}): ${beats}.`);
    lines.push('');
    lines.push(`Para afilarla: ¿tienes un testimonio o un dato real que la respalde? Si me lo pegas, lo uso tal cual. Si no, dejo el espacio marcado y no invento cifras. También puedes decirme «otro gancho» o pedirme otro formato.`);
  }
  void c;
  return { text: localize(lines.join('\n'), brand.variant), tone, idea, format };
}
