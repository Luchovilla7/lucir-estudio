/**
 * Capa de datos de Lucir Estudio.
 *
 * Hoy persiste en localStorage (una "cuenta" por correo, solo en este navegador).
 * Toda la app habla con esta capa a través de `useData()` y `useAuth()`, así que para
 * conectar un backend real basta con reimplementar estas funciones (ver README).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppData, Brand, Piece, SavedHook, Spark, User } from './types';
import { sha256, todayISO, uid } from './utils';

const USERS_KEY = 'lucir:users';
const SESSION_KEY = 'lucir:session';
const dataKey = (email: string) => `lucir:data:${email.toLowerCase()}`;

interface StoredUser extends User {
  hash: string;
}

/* ───────────── helpers de almacenamiento ───────────── */

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento lleno o bloqueado */
  }
}

export function newBrand(name = ''): Brand {
  return {
    id: uid('brand'),
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

function emptyData(brandName: string): AppData {
  const b = newBrand(brandName);
  return { brands: [b], activeBrandId: b.id, pieces: [], sparks: [], hooks: { saved: [] }, theme: 'dark' };
}

function normalize(d: AppData | null, brandName: string): AppData {
  if (!d || !d.brands?.length) return emptyData(brandName);
  return {
    ...d,
    activeBrandId: d.brands.some((b) => b.id === d.activeBrandId) ? d.activeBrandId : d.brands[0].id,
    pieces: d.pieces ?? [],
    sparks: d.sparks ?? [],
    hooks: d.hooks ?? { saved: [] },
    theme: d.theme === 'light' ? 'light' : 'dark',
  };
}

/* ───────────── autenticación (maqueta local) ───────────── */

interface AuthCtx {
  user: User | null;
  ready: boolean;
  register: (name: string, email: string, password: string, brandName: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  recover: (email: string, newPassword: string) => Promise<string | null>;
  logout: () => void;
  accountExists: (email: string) => boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth fuera de AuthProvider');
  return c;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = readJSON<User | null>(SESSION_KEY, null);
    if (s?.email) setUser(s);
    setReady(true);
  }, []);

  const value = useMemo<AuthCtx>(() => {
    const users = () => readJSON<StoredUser[]>(USERS_KEY, []);
    return {
      user,
      ready,
      accountExists: (email) => users().some((u) => u.email === email.trim().toLowerCase()),
      register: async (name, email, password, brandName) => {
        const e = email.trim().toLowerCase();
        if (!/^\S+@\S+\.\S+$/.test(e)) return 'Escribe un correo válido.';
        if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
        if (users().some((u) => u.email === e)) return 'Ya existe una cuenta con ese correo.';
        const hash = await sha256(password);
        writeJSON(USERS_KEY, [...users(), { email: e, name: name.trim() || e.split('@')[0], hash }]);
        writeJSON(dataKey(e), emptyData(brandName.trim()));
        const u = { email: e, name: name.trim() || e.split('@')[0] };
        writeJSON(SESSION_KEY, u);
        setUser(u);
        return null;
      },
      login: async (email, password) => {
        const e = email.trim().toLowerCase();
        const found = users().find((u) => u.email === e);
        if (!found) return 'No encontramos una cuenta con ese correo.';
        if ((await sha256(password)) !== found.hash) return 'La contraseña no es correcta.';
        const u = { email: found.email, name: found.name };
        writeJSON(SESSION_KEY, u);
        setUser(u);
        return null;
      },
      recover: async (email, newPassword) => {
        const e = email.trim().toLowerCase();
        const list = users();
        const idx = list.findIndex((u) => u.email === e);
        if (idx < 0) return 'No encontramos una cuenta con ese correo.';
        if (newPassword.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
        list[idx] = { ...list[idx], hash: await sha256(newPassword) };
        writeJSON(USERS_KEY, list);
        return null;
      },
      logout: () => {
        try {
          localStorage.removeItem(SESSION_KEY);
        } catch {
          /* noop */
        }
        setUser(null);
      },
    };
  }, [user, ready]);

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

export function DataProvider({ user, children }: { user: User; children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => normalize(readJSON<AppData | null>(dataKey(user.email), null), ''));
  const loaded = useRef(user.email);

  useEffect(() => {
    if (loaded.current !== user.email) {
      loaded.current = user.email;
      setData(normalize(readJSON<AppData | null>(dataKey(user.email), null), ''));
    }
  }, [user.email]);

  useEffect(() => {
    writeJSON(dataKey(user.email), data);
  }, [data, user.email]);

  useEffect(() => {
    document.documentElement.dataset.theme = data.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', data.theme === 'dark' ? '#13100e' : '#fbf6ee');
  }, [data.theme]);

  const brand = data.brands.find((b) => b.id === data.activeBrandId) ?? data.brands[0];

  const set = useCallback((fn: (d: AppData) => AppData) => setData((d) => fn(d)), []);

  const value = useMemo<DataCtx>(
    () => ({
      ...data,
      brand,
      brandPieces: data.pieces.filter((p) => p.brandId === brand.id),
      brandSparks: data.sparks.filter((s) => s.brandId === brand.id),
      setActiveBrand: (id) => set((d) => ({ ...d, activeBrandId: id })),
      addBrand: (name) =>
        set((d) => {
          const b = newBrand(name);
          return { ...d, brands: [...d.brands, b], activeBrandId: b.id };
        }),
      saveBrand: (patch) =>
        set((d) => ({ ...d, brands: d.brands.map((b) => (b.id === d.activeBrandId ? { ...b, ...patch } : b)) })),
      deleteBrand: (id) => {
        if (data.brands.length <= 1) return false;
        set((d) => {
          const brands = d.brands.filter((b) => b.id !== id);
          return {
            ...d,
            brands,
            pieces: d.pieces.filter((p) => p.brandId !== id),
            sparks: d.sparks.filter((s) => s.brandId !== id),
            activeBrandId: d.activeBrandId === id ? brands[0].id : d.activeBrandId,
          };
        });
        return true;
      },
      addPiece: (p) => set((d) => ({ ...d, pieces: [p, ...d.pieces] })),
      updatePiece: (id, patch) => set((d) => ({ ...d, pieces: d.pieces.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deletePiece: (id) => set((d) => ({ ...d, pieces: d.pieces.filter((p) => p.id !== id) })),
      duplicatePiece: (id) => {
        const src = data.pieces.find((p) => p.id === id);
        if (!src) return null;
        const copy: Piece = {
          ...src,
          id: uid('pc'),
          title: `${src.title} (copia)`,
          status: 'borrador',
          scheduledAt: undefined,
          createdAt: new Date().toISOString(),
          reach: 0,
          saves: 0,
          favorite: false,
          blocks: src.blocks.map((b) => ({ ...b, id: uid('b') })),
        };
        set((d) => ({ ...d, pieces: [copy, ...d.pieces] }));
        return copy.id;
      },
      addSparks: (list) =>
        set((d) => ({
          ...d,
          sparks: [
            ...list.map((s) => ({ ...s, id: uid('sp'), brandId: d.activeBrandId, used: false, createdAt: new Date().toISOString() })),
            ...d.sparks,
          ],
        })),
      updateSpark: (id, patch) => set((d) => ({ ...d, sparks: d.sparks.map((s) => (s.id === id ? { ...s, ...patch } : s)) })),
      deleteSpark: (id) => set((d) => ({ ...d, sparks: d.sparks.filter((s) => s.id !== id) })),
      saveHook: (h) =>
        set((d) => {
          const exists = d.hooks.saved.some((x) => x.kind === h.kind && x.groupId === h.groupId && x.template === h.template && x.text === h.text);
          if (exists) return d;
          return { ...d, hooks: { ...d.hooks, saved: [{ ...h, id: uid('hk'), createdAt: new Date().toISOString() }, ...d.hooks.saved] } };
        }),
      removeHook: (id) => set((d) => ({ ...d, hooks: { ...d.hooks, saved: d.hooks.saved.filter((x) => x.id !== id) } })),
      setHookCursor: (groupId) => set((d) => (d.hooks.lastGroupId === groupId ? d : { ...d, hooks: { ...d.hooks, lastGroupId: groupId } })),
      resetHooks: () => set((d) => ({ ...d, hooks: { saved: [] } })),
      importHooks: (items) => {
        let added = 0;
        set((d) => {
          const known = new Set(d.hooks.saved.map((x) => `${x.kind}|${x.groupId}|${x.template}|${x.text}`));
          const fresh = items.filter((x) => x && typeof x.text === 'string' && x.kind && !known.has(`${x.kind}|${x.groupId}|${x.template}|${x.text}`));
          added = fresh.length;
          return { ...d, hooks: { ...d.hooks, saved: [...fresh.map((x) => ({ ...x, id: uid('hk') })), ...d.hooks.saved] } };
        });
        return added;
      },
      setTheme: (theme) => set((d) => ({ ...d, theme })),
    }),
    [data, brand, set],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function newPiece(partial: Partial<Piece> & Pick<Piece, 'brandId' | 'title' | 'format' | 'tone' | 'platform' | 'blocks'>): Piece {
  return {
    id: uid('pc'),
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
