/**
 * Capa de datos de Lucir Estudio sobre Supabase.
 *
 * - `AuthProvider` / `useAuth`: sesión con Supabase Auth (correo y contraseña).
 * - `DataProvider` / `useData`: carga los datos del usuario al entrar y aplica los cambios
 *   de forma optimista (la interfaz responde al instante) escribiendo en segundo plano.
 *
 * Las páginas no conocen Supabase: solo hablan con `useData()` y `useAuth()`.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { AppData, Brand, Piece, SavedHook, Spark, User } from './types';
import { todayISO, uuid } from './utils';
import { useToast } from '../components/ui';

/* ───────────── mapeos fila ↔ modelo ───────────── */

type Row = Record<string, unknown>;

const BRAND_COLS: Record<string, string> = {
  name: 'name', description: 'description', niche: 'niche', audience: 'audience', monthlyGoal: 'monthly_goal',
  problem: 'problem', helps: 'helps', outcome: 'outcome', voice: 'voice', variant: 'variant', keywords: 'keywords',
  competitors: 'competitors', colors: 'colors', networks: 'networks', cycleEnabled: 'cycle_enabled',
  cycleStart: 'cycle_start', cycleLength: 'cycle_length',
};
const PIECE_COLS: Record<string, string> = {
  brandId: 'brand_id', title: 'title', format: 'format', tone: 'tone', platform: 'platform', status: 'status',
  blocks: 'blocks', caption: 'caption', idea: 'idea', evidence: 'evidence', templateId: 'template_id', seed: 'seed',
  scheduledAt: 'scheduled_at', reach: 'reach', saves: 'saves', favorite: 'favorite', notes: 'notes',
};
const SPARK_COLS: Record<string, string> = { brandId: 'brand_id', tone: 'tone', title: 'title', hook: 'hook', levels: 'levels', used: 'used' };

function toRow(patch: Record<string, unknown>, cols: Record<string, string>): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(patch)) {
    const col = cols[k];
    if (col) out[col] = v === undefined ? null : v;
  }
  return out;
}

const brandFrom = (r: Row): Brand => ({
  id: r.id as string,
  name: (r.name as string) ?? '',
  description: (r.description as string) ?? '',
  niche: (r.niche as string) ?? '',
  audience: (r.audience as string) ?? '',
  monthlyGoal: (r.monthly_goal as number) ?? 20,
  problem: (r.problem as string) ?? '',
  helps: (r.helps as string) ?? '',
  outcome: (r.outcome as string) ?? '',
  voice: (r.voice as string) ?? '',
  variant: ((r.variant as Brand['variant']) ?? 'neutro'),
  keywords: (r.keywords as string[]) ?? [],
  competitors: (r.competitors as string[]) ?? [],
  colors: (r.colors as string[])?.length ? (r.colors as string[]) : ['#FF9A5A', '#1A1613'],
  networks: (r.networks as Brand['networks']) ?? ['Instagram'],
  cycleEnabled: Boolean(r.cycle_enabled),
  cycleStart: (r.cycle_start as string) ?? todayISO(),
  cycleLength: (r.cycle_length as number) ?? 28,
});

const pieceFrom = (r: Row): Piece => ({
  id: r.id as string,
  brandId: r.brand_id as string,
  title: (r.title as string) ?? '',
  format: r.format as Piece['format'],
  tone: r.tone as Piece['tone'],
  platform: r.platform as Piece['platform'],
  status: r.status as Piece['status'],
  blocks: (r.blocks as Piece['blocks']) ?? [],
  caption: (r.caption as string) ?? '',
  idea: (r.idea as string) ?? '',
  evidence: (r.evidence as string) ?? '',
  templateId: (r.template_id as string) ?? undefined,
  seed: (r.seed as number) ?? 0,
  createdAt: r.created_at as string,
  scheduledAt: (r.scheduled_at as string) ?? undefined,
  reach: (r.reach as number) ?? 0,
  saves: (r.saves as number) ?? 0,
  favorite: Boolean(r.favorite),
  notes: (r.notes as string) ?? '',
});

const sparkFrom = (r: Row): Spark => ({
  id: r.id as string,
  brandId: r.brand_id as string,
  tone: r.tone as Spark['tone'],
  title: r.title as string,
  hook: (r.hook as string) ?? '',
  levels: (r.levels as string[]) ?? [],
  used: Boolean(r.used),
  createdAt: r.created_at as string,
});

const hookFrom = (r: Row): SavedHook => ({
  id: r.id as string,
  kind: r.kind as SavedHook['kind'],
  groupId: r.group_id as string,
  template: r.template as string,
  text: r.text as string,
  createdAt: r.created_at as string,
});

export function newBrand(name = ''): Brand {
  return {
    id: uuid(),
    name,
    description: '',
    niche: '',
    audience: '',
    monthlyGoal: 20,
    problem: '',
    helps: '',
    outcome: '',
    voice: '',
    variant: 'neutro',
    keywords: [],
    competitors: [],
    colors: ['#FF9A5A', '#1A1613'],
    networks: ['Instagram'],
    cycleEnabled: false,
    cycleStart: todayISO(),
    cycleLength: 28,
  };
}

/* ───────────── autenticación ───────────── */

interface AuthResult {
  error?: string;
  needsConfirm?: boolean;
}

interface AuthCtx {
  user: User | null;
  ready: boolean;
  recovering: boolean;
  register: (name: string, email: string, password: string, brandName: string) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  sendRecovery: (email: string) => Promise<AuthResult>;
  setNewPassword: (password: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth fuera de AuthProvider');
  return c;
}

function friendly(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'Correo o contraseña incorrectos.';
  if (m.includes('email not confirmed')) return 'Confirma tu correo antes de entrar: te enviamos un enlace.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Ya existe una cuenta con ese correo.';
  if (m.includes('password') && m.includes('characters')) return 'La contraseña debe tener al menos 8 caracteres.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Demasiados intentos. Espera unos minutos y vuelve a probar.';
  if (m.includes('valid email') || m.includes('invalid email')) return 'Escribe un correo válido.';
  if (m.includes('failed to fetch') || m.includes('network')) return 'No pudimos conectar con el servidor. Revisa tu conexión.';
  return msg;
}

const toUser = (s: Session | null): User | null =>
  s?.user
    ? {
        id: s.user.id,
        email: s.user.email ?? '',
        name: (s.user.user_metadata?.name as string) || (s.user.email ?? '').split('@')[0],
      }
    : null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setUser(toUser(data.session));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      setUser(toUser(session));
      setReady(true);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,
      recovering,
      register: async (name, email, password, brandName) => {
        const e = email.trim().toLowerCase();
        if (password.length < 8) return { error: 'La contraseña debe tener al menos 8 caracteres.' };
        const { data, error } = await supabase.auth.signUp({
          email: e,
          password,
          options: {
            data: { name: name.trim(), brand_name: brandName.trim() },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });
        if (error) return { error: friendly(error.message) };
        // Supabase devuelve un usuario sin identidades cuando el correo ya existe.
        if (data.user && data.user.identities && data.user.identities.length === 0) return { error: 'Ya existe una cuenta con ese correo.' };
        return data.session ? {} : { needsConfirm: true };
      },
      login: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        return error ? { error: friendly(error.message) } : {};
      },
      sendRecovery: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/recuperar` });
        return error ? { error: friendly(error.message) } : {};
      },
      setNewPassword: async (password) => {
        if (password.length < 8) return { error: 'La contraseña debe tener al menos 8 caracteres.' };
        const { error } = await supabase.auth.updateUser({ password });
        if (error) return { error: friendly(error.message) };
        setRecovering(false);
        return {};
      },
      logout: () => {
        void supabase.auth.signOut();
      },
    }),
    [user, ready, recovering],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ───────────── datos de la cuenta ───────────── */

export interface DataCtx extends AppData {
  brand: Brand;
  setActiveBrand: (id: string) => void;
  addBrand: (name: string) => void;
  saveBrand: (patch: Partial<Brand>) => void;
  deleteBrand: (id: string) => boolean;
  addPiece: (p: Piece) => void;
  updatePiece: (id: string, patch: Partial<Piece>) => void;
  deletePiece: (id: string) => void;
  duplicatePiece: (id: string) => string | null;
  addSparks: (s: Omit<Spark, 'id' | 'createdAt' | 'brandId' | 'used'>[]) => void;
  updateSpark: (id: string, patch: Partial<Spark>) => void;
  deleteSpark: (id: string) => void;
  saveHook: (h: Omit<SavedHook, 'id' | 'createdAt'>) => void;
  removeHook: (id: string) => void;
  setHookCursor: (groupId: string) => void;
  resetHooks: () => void;
  importHooks: (items: SavedHook[]) => number;
  setTheme: (t: 'dark' | 'light') => void;
  brandPieces: Piece[];
  brandSparks: Spark[];
}

const DataContext = createContext<DataCtx | null>(null);

export function useData() {
  const c = useContext(DataContext);
  if (!c) throw new Error('useData fuera de DataProvider');
  return c;
}

async function loadAll(user: User): Promise<AppData> {
  const [prof, brands, pieces, sparks, hooks, prog] = await Promise.all([
    supabase.from('profiles').select('theme, active_brand_id').eq('id', user.id).maybeSingle(),
    supabase.from('brands').select('*').order('created_at', { ascending: true }),
    supabase.from('pieces').select('*').order('created_at', { ascending: false }),
    supabase.from('sparks').select('*').order('created_at', { ascending: false }),
    supabase.from('saved_hooks').select('*').order('created_at', { ascending: false }),
    supabase.from('hook_progress').select('last_group_id').eq('user_id', user.id).maybeSingle(),
  ]);
  for (const r of [prof, brands, pieces, sparks, hooks, prog]) if (r.error) throw new Error(r.error.message);

  let brandList = (brands.data ?? []).map(brandFrom);
  if (brandList.length === 0) {
    const { data: meta } = await supabase.auth.getUser();
    const first = newBrand(((meta.user?.user_metadata?.brand_name as string) || '').trim());
    const { error } = await supabase.from('brands').insert({ id: first.id, user_id: user.id, ...toRow(first as unknown as Record<string, unknown>, BRAND_COLS) });
    if (error) throw new Error(error.message);
    brandList = [first];
  }
  const active = brandList.find((b) => b.id === prof.data?.active_brand_id)?.id ?? brandList[0].id;

  return {
    brands: brandList,
    activeBrandId: active,
    pieces: (pieces.data ?? []).map(pieceFrom),
    sparks: (sparks.data ?? []).map(sparkFrom),
    hooks: { saved: (hooks.data ?? []).map(hookFrom), lastGroupId: prog.data?.last_group_id ?? undefined },
    theme: prof.data?.theme === 'light' ? 'light' : 'dark',
  };
}

export function DataProvider({ user, children }: { user: User; children: ReactNode }) {
  const toast = useToast();
  const [data, setData] = useState<AppData | null>(null);
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const uid = user.id;

  // Escrituras con espera: junta los cambios rápidos (p. ej. al teclear) en una sola.
  const pending = useRef(new Map<string, { patch: Record<string, unknown>; table: string; cols: Record<string, string>; timer: number }>());

  const fail = useCallback((what: string, message?: string) => toast(`No se pudo guardar ${what}.${message ? ` ${message}` : ''}`, 'err'), [toast]);

  const run = useCallback(
    (what: string, p: PromiseLike<{ error: { message: string } | null }>) => {
      void p.then(({ error }) => {
        if (error) fail(what, error.message);
      });
    },
    [fail],
  );

  const flushKey = useCallback(
    (key: string) => {
      const item = pending.current.get(key);
      if (!item) return;
      window.clearTimeout(item.timer);
      pending.current.delete(key);
      const id = key.split(':')[1];
      run('los cambios', supabase.from(item.table).update(toRow(item.patch, item.cols)).eq('id', id));
    },
    [run],
  );

  const queueUpdate = useCallback(
    (table: string, cols: Record<string, string>, id: string, patch: Record<string, unknown>) => {
      const key = `${table}:${id}`;
      const cur = pending.current.get(key);
      if (cur) window.clearTimeout(cur.timer);
      const merged = { ...(cur?.patch ?? {}), ...patch };
      const timer = window.setTimeout(() => flushKey(key), 700);
      pending.current.set(key, { patch: merged, table, cols, timer });
    },
    [flushKey],
  );

  const flushAll = useCallback(() => {
    for (const key of Array.from(pending.current.keys())) flushKey(key);
  }, [flushKey]);

  useEffect(() => {
    const onHide = () => flushAll();
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && onHide());
    return () => {
      window.removeEventListener('pagehide', onHide);
      flushAll();
    };
  }, [flushAll]);

  useEffect(() => {
    let alive = true;
    setData(null);
    setLoadError('');
    loadAll(user)
      .then((d) => alive && setData(d))
      .catch((e: Error) => alive && setLoadError(e.message));
    return () => {
      alive = false;
    };
  }, [user.id, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = data?.theme ?? 'dark';
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#13100e' : '#fbf6ee');
  }, [theme]);

  const set = useCallback((fn: (d: AppData) => AppData) => setData((d) => (d ? fn(d) : d)), []);

  const value = useMemo<DataCtx | null>(() => {
    if (!data) return null;
    const brand = data.brands.find((b) => b.id === data.activeBrandId) ?? data.brands[0];
    return {
      ...data,
      brand,
      brandPieces: data.pieces.filter((p) => p.brandId === brand.id),
      brandSparks: data.sparks.filter((s) => s.brandId === brand.id),

      setActiveBrand: (id) => {
        set((d) => ({ ...d, activeBrandId: id }));
        run('la marca activa', supabase.from('profiles').update({ active_brand_id: id }).eq('id', uid));
      },
      addBrand: (name) => {
        const b = newBrand(name);
        set((d) => ({ ...d, brands: [...d.brands, b], activeBrandId: b.id }));
        run('la marca', supabase.from('brands').insert({ id: b.id, user_id: uid, ...toRow(b as unknown as Record<string, unknown>, BRAND_COLS) }));
        run('la marca activa', supabase.from('profiles').update({ active_brand_id: b.id }).eq('id', uid));
      },
      saveBrand: (patch) => {
        set((d) => ({ ...d, brands: d.brands.map((b) => (b.id === d.activeBrandId ? { ...b, ...patch } : b)) }));
        queueUpdate('brands', BRAND_COLS, data.activeBrandId, patch as Record<string, unknown>);
      },
      deleteBrand: (id) => {
        if (data.brands.length <= 1) return false;
        const remaining = data.brands.filter((b) => b.id !== id);
        const nextActive = data.activeBrandId === id ? remaining[0].id : data.activeBrandId;
        set((d) => ({
          ...d,
          brands: remaining,
          pieces: d.pieces.filter((p) => p.brandId !== id),
          sparks: d.sparks.filter((s) => s.brandId !== id),
          activeBrandId: nextActive,
        }));
        run('la eliminación', supabase.from('brands').delete().eq('id', id));
        if (nextActive !== data.activeBrandId) run('la marca activa', supabase.from('profiles').update({ active_brand_id: nextActive }).eq('id', uid));
        return true;
      },

      addPiece: (p) => {
        set((d) => ({ ...d, pieces: [p, ...d.pieces] }));
        run('la pieza', supabase.from('pieces').insert({ id: p.id, user_id: uid, created_at: p.createdAt, ...toRow(p as unknown as Record<string, unknown>, PIECE_COLS) }));
      },
      updatePiece: (id, patch) => {
        set((d) => ({ ...d, pieces: d.pieces.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
        queueUpdate('pieces', PIECE_COLS, id, patch as Record<string, unknown>);
      },
      deletePiece: (id) => {
        const key = `pieces:${id}`;
        const item = pending.current.get(key);
        if (item) {
          window.clearTimeout(item.timer);
          pending.current.delete(key);
        }
        set((d) => ({ ...d, pieces: d.pieces.filter((p) => p.id !== id) }));
        run('la eliminación', supabase.from('pieces').delete().eq('id', id));
      },
      duplicatePiece: (id) => {
        const src = data.pieces.find((p) => p.id === id);
        if (!src) return null;
        const copy: Piece = {
          ...src,
          id: uuid(),
          title: `${src.title} (copia)`,
          status: 'borrador',
          scheduledAt: undefined,
          createdAt: new Date().toISOString(),
          reach: 0,
          saves: 0,
          favorite: false,
          blocks: src.blocks.map((b) => ({ ...b, id: `b_${Math.random().toString(36).slice(2, 9)}` })),
        };
        set((d) => ({ ...d, pieces: [copy, ...d.pieces] }));
        run('la copia', supabase.from('pieces').insert({ id: copy.id, user_id: uid, created_at: copy.createdAt, ...toRow(copy as unknown as Record<string, unknown>, PIECE_COLS) }));
        return copy.id;
      },

      addSparks: (list) => {
        const now = new Date().toISOString();
        const rows: Spark[] = list.map((s) => ({ ...s, id: uuid(), brandId: data.activeBrandId, used: false, createdAt: now }));
        set((d) => ({ ...d, sparks: [...rows, ...d.sparks] }));
        run('las chispas', supabase.from('sparks').insert(rows.map((s) => ({ id: s.id, user_id: uid, created_at: s.createdAt, ...toRow(s as unknown as Record<string, unknown>, SPARK_COLS) }))));
      },
      updateSpark: (id, patch) => {
        set((d) => ({ ...d, sparks: d.sparks.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
        queueUpdate('sparks', SPARK_COLS, id, patch as Record<string, unknown>);
      },
      deleteSpark: (id) => {
        set((d) => ({ ...d, sparks: d.sparks.filter((s) => s.id !== id) }));
        run('la eliminación', supabase.from('sparks').delete().eq('id', id));
      },

      saveHook: (h) => {
        const exists = data.hooks.saved.some((x) => x.kind === h.kind && x.groupId === h.groupId && x.template === h.template && x.text === h.text);
        if (exists) return;
        const row: SavedHook = { ...h, id: uuid(), createdAt: new Date().toISOString() };
        set((d) => ({ ...d, hooks: { ...d.hooks, saved: [row, ...d.hooks.saved] } }));
        run('la apertura', supabase.from('saved_hooks').insert({ id: row.id, user_id: uid, kind: row.kind, group_id: row.groupId, template: row.template, text: row.text, created_at: row.createdAt }));
      },
      removeHook: (id) => {
        set((d) => ({ ...d, hooks: { ...d.hooks, saved: d.hooks.saved.filter((x) => x.id !== id) } }));
        run('la eliminación', supabase.from('saved_hooks').delete().eq('id', id));
      },
      setHookCursor: (groupId) => {
        if (data.hooks.lastGroupId === groupId) return;
        set((d) => ({ ...d, hooks: { ...d.hooks, lastGroupId: groupId } }));
        run('tu progreso', supabase.from('hook_progress').upsert({ user_id: uid, last_group_id: groupId, updated_at: new Date().toISOString() }));
      },
      resetHooks: () => {
        set((d) => ({ ...d, hooks: { saved: [] } }));
        run('el reinicio', supabase.from('saved_hooks').delete().eq('user_id', uid));
        run('el reinicio', supabase.from('hook_progress').upsert({ user_id: uid, last_group_id: null, updated_at: new Date().toISOString() }));
      },
      importHooks: (items) => {
        const known = new Set(data.hooks.saved.map((x) => `${x.kind}|${x.groupId}|${x.template}|${x.text}`));
        const fresh = items
          .filter((x) => x && typeof x.text === 'string' && (x.kind === 'mine' || x.kind === 'fav') && !known.has(`${x.kind}|${x.groupId}|${x.template}|${x.text}`))
          .map((x) => ({ ...x, id: uuid(), createdAt: new Date().toISOString() }));
        if (!fresh.length) return 0;
        set((d) => ({ ...d, hooks: { ...d.hooks, saved: [...fresh, ...d.hooks.saved] } }));
        run(
          'la importación',
          supabase.from('saved_hooks').upsert(
            fresh.map((x) => ({ id: x.id, user_id: uid, kind: x.kind, group_id: x.groupId, template: x.template, text: x.text, created_at: x.createdAt })),
            { onConflict: 'user_id,kind,group_id,template,text', ignoreDuplicates: true },
          ),
        );
        return fresh.length;
      },
      setTheme: (t) => {
        set((d) => ({ ...d, theme: t }));
        run('el tema', supabase.from('profiles').update({ theme: t }).eq('id', uid));
      },
    };
  }, [data, set, run, queueUpdate, uid]);

  if (loadError) {
    return (
      <div className="boot-msg">
        <h2>No pudimos cargar tus datos</h2>
        <p>{loadError}</p>
        <button className="btn primary" onClick={() => setAttempt((n) => n + 1)}>Reintentar</button>
      </div>
    );
  }
  if (!value) return <div className="boot-msg"><div className="spinner" aria-label="Cargando" /></div>;
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function newPiece(partial: Partial<Piece> & Pick<Piece, 'brandId' | 'title' | 'format' | 'tone' | 'platform' | 'blocks'>): Piece {
  return {
    id: uuid(),
    caption: '',
    idea: '',
    evidence: '',
    seed: 0,
    status: 'borrador',
    createdAt: new Date().toISOString(),
    reach: 0,
    saves: 0,
    favorite: false,
    notes: '',
    ...partial,
  };
}
