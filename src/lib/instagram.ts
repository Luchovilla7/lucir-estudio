import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';

export interface IgSummary {
  period_days?: number;
  reach?: number | null;
  views?: number | null;
  accounts_engaged?: number | null;
  total_interactions?: number | null;
  likes?: number | null;
  comments?: number | null;
  saves?: number | null;
  shares?: number | null;
  profile_links_taps?: number | null;
}

export interface IgConnection {
  id: string;
  brandId: string;
  igUserId: string;
  username: string;
  name: string;
  profilePictureUrl: string | null;
  accountType: string;
  followersCount: number;
  mediaCount: number;
  status: 'active' | 'expired' | 'error';
  lastError: string | null;
  tokenExpiresAt: string | null;
  lastSyncedAt: string | null;
  connectedAt: string;
  summary: IgSummary;
}

export interface IgMedia {
  igMediaId: string;
  caption: string;
  mediaType: string;
  permalink: string | null;
  thumbnailUrl: string | null;
  postedAt: string | null;
  likeCount: number;
  commentsCount: number;
  reach: number | null;
  saves: number | null;
  shares: number | null;
  views: number | null;
}

export interface IgDay {
  day: string;
  reach: number | null;
  followers: number | null;
}

/* ───────────── mapeos ───────────── */

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const connFrom = (r: Row): IgConnection => ({
  id: r.id,
  brandId: r.brand_id,
  igUserId: r.ig_user_id,
  username: r.username ?? '',
  name: r.name ?? '',
  profilePictureUrl: r.profile_picture_url ?? null,
  accountType: r.account_type ?? '',
  followersCount: r.followers_count ?? 0,
  mediaCount: r.media_count ?? 0,
  status: r.status ?? 'active',
  lastError: r.last_error ?? null,
  tokenExpiresAt: r.token_expires_at ?? null,
  lastSyncedAt: r.last_synced_at ?? null,
  connectedAt: r.connected_at,
  summary: (r.summary as IgSummary) ?? {},
});

export const mediaFrom = (r: Row): IgMedia => ({
  igMediaId: r.ig_media_id,
  caption: r.caption ?? '',
  mediaType: r.media_type ?? '',
  permalink: r.permalink ?? null,
  thumbnailUrl: r.thumbnail_url ?? null,
  postedAt: r.posted_at ?? null,
  likeCount: r.like_count ?? 0,
  commentsCount: r.comments_count ?? 0,
  reach: r.reach ?? null,
  saves: r.saves ?? null,
  shares: r.shares ?? null,
  views: r.views ?? null,
});

export const MEDIA_LABEL: Record<string, string> = {
  REELS: 'Reel',
  VIDEO: 'Video',
  CAROUSEL_ALBUM: 'Carrusel',
  IMAGE: 'Imagen',
};
export const mediaLabel = (t: string) => MEDIA_LABEL[t] ?? (t ? t : 'Publicación');

/* ───────────── llamadas al servidor ───────────── */

export class ApiError extends Error {
  constructor(
    public code: string,
    message?: string,
  ) {
    super(message ?? code);
  }
}

async function api<T>(path: string, method: 'GET' | 'POST' = 'POST', body?: unknown): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const r = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token ?? ''}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  // En desarrollo sin servidor de funciones, el servidor devuelve la página y no JSON.
  if (!(r.headers.get('content-type') ?? '').includes('json')) throw new ApiError('not_available');
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(j.error ?? 'error', j.message);
  return j as T;
}

/* ───────────── hook principal ───────────── */

export type IgState = 'loading' | 'unconfigured' | 'disconnected' | 'connected';

export function useInstagram(brandId: string) {
  const [state, setState] = useState<IgState>('loading');
  const [conn, setConn] = useState<IgConnection | null>(null);
  const [media, setMedia] = useState<IgMedia[]>([]);
  const [daily, setDaily] = useState<IgDay[]>([]);
  const [busy, setBusy] = useState<'' | 'connect' | 'sync' | 'disconnect'>('');
  const [error, setError] = useState('');
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setState('loading');
      let configured = false;
      try {
        configured = (await api<{ configured: boolean }>('/api/instagram/config', 'GET')).configured;
      } catch {
        configured = false;
      }
      const { data: c, error: e } = await supabase.from('instagram_connections').select('*').eq('brand_id', brandId).maybeSingle();
      if (!alive.current) return;
      if (e) {
        // Las tablas todavía no existen en la base de datos
        setConn(null);
        setState('unconfigured');
        return;
      }
      if (!c) {
        setConn(null);
        setMedia([]);
        setDaily([]);
        setState(configured ? 'disconnected' : 'unconfigured');
        return;
      }
      const [m, d] = await Promise.all([
        supabase.from('instagram_media').select('*').eq('connection_id', c.id).order('posted_at', { ascending: false }).limit(30),
        supabase.from('instagram_daily').select('*').eq('connection_id', c.id).order('day', { ascending: true }).limit(60),
      ]);
      if (!alive.current) return;
      setConn(connFrom(c));
      setMedia((m.data ?? []).map(mediaFrom));
      setDaily((d.data ?? []).map((r: Row) => ({ day: r.day, reach: r.reach, followers: r.followers })));
      setState('connected');
    },
    [brandId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const connect = useCallback(async () => {
    setError('');
    setBusy('connect');
    try {
      const { url } = await api<{ url: string }>('/api/instagram/start', 'POST', { brandId });
      window.location.href = url;
    } catch (e) {
      setBusy('');
      setError(e instanceof ApiError && e.code === 'not_configured' ? 'La conexión con Instagram todavía no está habilitada.' : 'No pudimos iniciar la conexión. Inténtalo de nuevo.');
    }
  }, [brandId]);

  const sync = useCallback(async () => {
    setError('');
    setBusy('sync');
    try {
      await api('/api/instagram/sync', 'POST', { brandId });
      await load(true);
    } catch (e) {
      if (e instanceof ApiError && e.code === 'token_expired') {
        setError('Tu conexión con Instagram venció. Vuelve a conectarla para seguir viendo tus métricas.');
        await load(true);
      } else {
        setError('No pudimos actualizar tus métricas ahora. Inténtalo en unos minutos.');
      }
    } finally {
      if (alive.current) setBusy('');
    }
  }, [brandId, load]);

  const disconnect = useCallback(async () => {
    setError('');
    setBusy('disconnect');
    try {
      await api('/api/instagram/disconnect', 'POST', { brandId });
      await load();
    } catch {
      setError('No pudimos desconectar la cuenta. Inténtalo de nuevo.');
    } finally {
      if (alive.current) setBusy('');
    }
  }, [brandId, load]);

  return { state, conn, media, daily, busy, error, setError, connect, sync, disconnect, reload: load };
}

/* ───────────── datos de muestra (para ver cómo se verá antes de conectar) ───────────── */

export function demoData(): { conn: IgConnection; media: IgMedia[]; daily: IgDay[] } {
  const now = Date.now();
  const daily: IgDay[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now - (29 - i) * 86_400_000);
    const wave = Math.sin(i / 3.2) * 180 + (i % 7 === 2 ? 320 : 0);
    return { day: d.toISOString().slice(0, 10), reach: Math.round(620 + i * 14 + wave), followers: 1840 + i * 4 };
  });
  const types = ['REELS', 'CAROUSEL_ALBUM', 'IMAGE', 'CAROUSEL_ALBUM', 'REELS', 'IMAGE', 'CAROUSEL_ALBUM', 'REELS'];
  const captions = [
    'Lo que nadie te cuenta de cobrar por tu trabajo',
    '5 señales de que tu oferta no se entiende',
    'Antes y después de ordenar mi agenda',
    'El error invisible que frena tus ventas',
    'Mi postura sobre publicar todos los días',
    'Un cliente me escribió esto esta semana',
    'Por qué dejé de hacer lo que hace todo el mundo',
    'Cómo preparo mi semana de contenido en 1 hora',
  ];
  const media: IgMedia[] = types.map((t, i) => ({
    igMediaId: `demo_${i}`,
    caption: captions[i],
    mediaType: t,
    permalink: null,
    thumbnailUrl: null,
    postedAt: new Date(now - (i * 3 + 1) * 86_400_000).toISOString(),
    likeCount: 40 + ((i * 37) % 90),
    commentsCount: 3 + ((i * 5) % 14),
    reach: 900 + ((i * 531) % 3400) + (t === 'REELS' ? 1800 : 0),
    saves: 12 + ((i * 17) % 60),
    shares: 4 + ((i * 11) % 30),
    views: 1400 + ((i * 693) % 4200) + (t === 'REELS' ? 2400 : 0),
  }));
  const sum = daily.reduce((a, d) => a + (d.reach ?? 0), 0);
  return {
    daily,
    media,
    conn: {
      id: 'demo',
      brandId: 'demo',
      igUserId: 'demo',
      username: 'tu_cuenta',
      name: 'Tu marca',
      profilePictureUrl: null,
      accountType: 'BUSINESS',
      followersCount: 1956,
      mediaCount: 148,
      status: 'active',
      lastError: null,
      tokenExpiresAt: null,
      lastSyncedAt: new Date().toISOString(),
      connectedAt: new Date(now - 12 * 86_400_000).toISOString(),
      summary: { period_days: 30, reach: sum, views: Math.round(sum * 1.9), accounts_engaged: 412, total_interactions: 1280, likes: 940, comments: 96, saves: 168, shares: 76, profile_links_taps: 58 },
    },
  };
}
