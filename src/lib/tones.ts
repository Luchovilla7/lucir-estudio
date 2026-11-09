import type { Format, Platform, ToneId } from './types';

export interface Tone {
  id: ToneId;
  name: string;
  tagline: string;
  desc: string;
  color: string;
  keywords: string[];
}

export const TONES: Record<ToneId, Tone> = {
  faro: {
    id: 'faro',
    name: 'Faro',
    tagline: 'Ilumina lo que tu cliente no alcanza a ver.',
    desc: 'Piezas que nombran la causa oculta de un problema sin resolverlo todavía.',
    color: '#F5B84C',
    keywords: ['error', 'causa', 'no funciona', 'frena', 'bloqueo', 'miedo', 'objeción', 'objecion', 'dolor', 'confusión', 'confusion', 'por qué', 'por que', 'síntoma', 'sintoma', 'no sé', 'no se'],
  },
  prueba: {
    id: 'prueba',
    name: 'Prueba',
    tagline: 'Muestras el resultado como evidencia.',
    desc: 'Piezas de transformación, método y casos reales con antes y después.',
    color: '#7FD1A8',
    keywords: ['resultado', 'clienta', 'cliente logró', 'cliente logro', 'antes', 'después', 'despues', 'caso', 'testimonio', 'facturé', 'facture', 'logré', 'logre', 'historia', 'proceso', 'paso a paso', 'método', 'metodo'],
  },
  giro: {
    id: 'giro',
    name: 'Giro',
    tagline: 'Tu diferencia es la noticia.',
    desc: 'Piezas que contrastan tu enfoque con lo estándar de tu industria.',
    color: '#FF7A59',
    keywords: ['todos', 'contrario', 'mito', 'consejo', 'tendencia', 'diferente', 'en vez de', 'no estoy de acuerdo', 'sector', 'estándar', 'estandar', 'industria', 'herramientas', 'distinto'],
  },
  brujula: {
    id: 'brujula',
    name: 'Brújula',
    tagline: 'Tomas postura y orientas a quien resuena.',
    desc: 'Piezas de valores, límites y convicciones que atraen y filtran.',
    color: '#8FB4FF',
    keywords: ['valores', 'creo', 'nunca', 'jamás', 'jamas', 'postura', 'decisión', 'decision', 'principio', 'no negocio', 'ética', 'etica', 'límite', 'limite', 'manifiesto', 'convicción', 'conviccion'],
  },
};

export const TONE_LIST: Tone[] = [TONES.faro, TONES.prueba, TONES.giro, TONES.brujula];

export const FORMATS: Record<Format, { id: Format; name: string; desc: string; defaultPlatform: Platform }> = {
  carrusel: {
    id: 'carrusel',
    name: 'Carrusel',
    desc: 'Instagram. Una idea por slide, con tensión creciente.',
    defaultPlatform: 'Instagram',
  },
  stories: {
    id: 'stories',
    name: 'Stories',
    desc: '16 plantillas (4 por tono). Siempre 4 placas.',
    defaultPlatform: 'Instagram',
  },
  reel: {
    id: 'reel',
    name: 'Reel con guion',
    desc: 'Guion con escenas y tiempos, para grabar hablando a cámara.',
    defaultPlatform: 'TikTok',
  },
  post: {
    id: 'post',
    name: 'Post de texto',
    desc: 'Una sola pieza escrita: gancho, cuerpo y cierre, sin escenas.',
    defaultPlatform: 'LinkedIn',
  },
  email: {
    id: 'email',
    name: 'Carta',
    desc: 'Historia, moraleja y propuesta en 300 a 500 palabras.',
    defaultPlatform: 'Newsletter',
  },
};

export const FORMAT_LIST = Object.values(FORMATS);

export const PLATFORMS: Platform[] = ['Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'Threads', 'Newsletter'];

export const STATUSES = [
  { id: 'borrador', name: 'Borrador', color: '#A69A8B' },
  { id: 'listo', name: 'Listo', color: '#7FD1A8' },
  { id: 'programado', name: 'Programado', color: '#8FB4FF' },
  { id: 'publicado', name: 'Publicado', color: '#FF9A5A' },
] as const;

export const VARIANTS = [
  { id: 'neutro', name: 'Neutro latinoamericano (recomendado)' },
  { id: 'argentino', name: 'Argentino (voseo)' },
  { id: 'mexicano', name: 'Mexicano' },
  { id: 'colombiano', name: 'Colombiano' },
  { id: 'chileno', name: 'Chileno' },
  { id: 'peruano', name: 'Peruano' },
  { id: 'venezolano', name: 'Venezolano' },
] as const;

export const AWARENESS = [
  'Inconsciente',
  'Consciente del problema',
  'Consciente de la solución',
  'Consciente del producto',
  'Totalmente consciente',
];

export const RHYTHM_PHASES = [
  {
    id: 'recogimiento',
    name: 'Recogimiento',
    range: [0, 0.2],
    tip: 'Energía baja y mirada hacia adentro. Conviene escribir, planear y programar piezas ya listas.',
    tone: 'faro' as ToneId,
  },
  {
    id: 'expansion',
    name: 'Expansión',
    range: [0.2, 0.5],
    tip: 'Ideas nuevas y ganas de probar. Buen momento para crear carruseles y experimentar con ganchos.',
    tone: 'giro' as ToneId,
  },
  {
    id: 'brillo',
    name: 'Brillo',
    range: [0.5, 0.65],
    tip: 'Más presencia y carisma. Graba reels, hazte visible y comparte resultados.',
    tone: 'prueba' as ToneId,
  },
  {
    id: 'revision',
    name: 'Revisión',
    range: [0.65, 1],
    tip: 'Criterio afilado. Ideal para posturas, cartas largas y ordenar tu archivo.',
    tone: 'brujula' as ToneId,
  },
];
