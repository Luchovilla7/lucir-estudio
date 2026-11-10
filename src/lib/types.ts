export type ToneId = 'faro' | 'prueba' | 'giro' | 'brujula';
export type Format = 'carrusel' | 'stories' | 'reel' | 'post' | 'email';
export type Status = 'borrador' | 'listo' | 'programado' | 'publicado';
export type Platform = 'Instagram' | 'LinkedIn' | 'TikTok' | 'YouTube' | 'Threads' | 'Newsletter';
export type Variant = 'neutro' | 'argentino' | 'mexicano' | 'colombiano' | 'chileno' | 'peruano' | 'venezolano';
export type Niche = 'universal' | 'negocios' | 'coaches' | 'terapia';

export interface Block {
  id: string;
  label: string;
  text: string;
}

export interface Piece {
  id: string;
  brandId: string;
  title: string;
  format: Format;
  tone: ToneId;
  platform: Platform;
  status: Status;
  blocks: Block[];
  caption: string;
  idea: string;
  evidence: string;
  templateId?: string;
  igMediaId?: string;
  seed: number;
  createdAt: string;
  scheduledAt?: string; // YYYY-MM-DD
  reach: number;
  saves: number;
  favorite: boolean;
  notes: string;
}

export interface Spark {
  id: string;
  brandId: string;
  tone: ToneId;
  title: string;
  hook: string;
  levels: string[];
  used: boolean;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  niche: string;
  audience: string;
  monthlyGoal: number;
  problem: string;
  helps: string;
  outcome: string;
  voice: string;
  variant: Variant;
  keywords: string[];
  competitors: string[];
  colors: string[];
  networks: Platform[];
  cycleEnabled: boolean;
  cycleStart: string; // YYYY-MM-DD
  cycleLength: number;
}

export interface SavedHook {
  id: string;
  kind: 'mine' | 'fav';
  groupId: string;
  template: string;
  text: string;
  createdAt: string;
}

export interface HookState {
  saved: SavedHook[];
  lastGroupId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AppData {
  brands: Brand[];
  activeBrandId: string;
  pieces: Piece[];
  sparks: Spark[];
  hooks: HookState;
  theme: 'dark' | 'light';
}

export interface GenRequest {
  format: Format;
  idea: string;
  evidence: string;
  tone: ToneId;
  slides: number;
  templateId?: string;
  seed: number;
  email?: { mode: 'ia' | 'yo'; answers: string[] };
  /** Estructura de la Biblioteca: define el orden y el propósito de cada slide del carrusel. */
  structure?: { id: string; steps: string[] };
}
