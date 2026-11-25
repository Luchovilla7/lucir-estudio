/**
 * Utilidades de servidor para la conexión con Instagram (API con Unified Login).
 * Solo se ejecuta en funciones de Vercel: aquí viven los secretos (META_APP_SECRET, clave de cifrado,
 * service role de Supabase). Nada de este archivo llega al navegador.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const GRAPH_VERSION = process.env.IG_API_VERSION || 'v27.0';
export const IG_CONFIG_ID = process.env.META_CONFIG_ID || '';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const APP_ID = process.env.META_APP_ID || '';
const APP_SECRET = process.env.META_APP_SECRET || '';
const ENC_KEY = process.env.TOKEN_ENC_KEY || '';

export const appId = () => APP_ID;
export const appSecret = () => APP_SECRET;
export const configId = () => IG_CONFIG_ID;

export function isConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY && APP_ID && APP_SECRET && IG_CONFIG_ID && ENC_KEY);
}

export function siteUrl(req: VercelRequest): string {
  const fixed = (process.env.SITE_URL || '').replace(/\/+$/, '');
  if (fixed) return fixed;
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost:3000';
  const proto = (req.headers['x-forwarded-proto'] as string) || (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export const redirectUri = (req: VercelRequest) => `${siteUrl(req)}/api/instagram/callback`;

export function admin(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function authUser(req: VercelRequest, sb: SupabaseClient): Promise<{ id: string; email?: string } | null> {
  const h = (req.headers.authorization as string) || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return null;
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email };
}

export function json(res: VercelResponse, status: number, body: unknown) {
  res.status(status).setHeader('Cache-Control', 'no-store').json(body);
}

export function readBody(req: VercelRequest): Record<string, unknown> {
  const b = req.body;
  if (!b) return {};
  if (typeof b === 'string') {
    try {
      return JSON.parse(b);
    } catch {
      return {};
    }
  }
  return b as Record<string, unknown>;
}

/* ───────────── cifrado de tokens (AES-256-GCM) ───────────── */

function key(): Buffer {
  const k = Buffer.from(ENC_KEY, 'base64');
  if (k.length !== 32) throw new Error('TOKEN_ENC_KEY debe ser 32 bytes en base64');
  return k;
}

export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return `${iv.toString('base64')}.${c.getAuthTag().toString('base64')}.${enc.toString('base64')}`;
}

export function decrypt(payload: string): string {
  const [iv, tag, data] = payload.split('.');
  const d = createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64'));
  d.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([d.update(Buffer.from(data, 'base64')), d.final()]).toString('utf8');
}

/* ───────────── state firmado (protección CSRF del OAuth) ───────────── */

const stateSecret = () => process.env.IG_STATE_SECRET || APP_SECRET;
const b64u = (b: Buffer) => b.toString('base64url');

export function signState(payload: { u: string; b: string }): string {
  const body = b64u(Buffer.from(JSON.stringify({ ...payload, e: Date.now() + 15 * 60_000, n: randomBytes(6).toString('hex') })));
  const sig = b64u(createHmac('sha256', stateSecret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyState(state: string): { u: string; b: string } | null {
  const [body, sig] = (state || '').split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', stateSecret()).update(body).digest();
  const got = Buffer.from(sig, 'base64url');
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (typeof p.e !== 'number' || p.e < Date.now()) return null;
    return { u: p.u, b: p.b };
  } catch {
    return null;
  }
}

/** Valida y decodifica el `signed_request` que Meta envía a los avisos de desautorización y borrado. */
export function parseSignedRequest(signed: string): { user_id?: string } | null {
  const [sig, payload] = (signed || '').split('.');
  if (!sig || !payload) return null;
  const expected = createHmac('sha256', APP_SECRET).update(payload).digest();
  const got = Buffer.from(sig, 'base64url');
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

/* ───────────── llamadas a la API de Instagram (Unified Login) ───────────── */

export class IgError extends Error {
  constructor(
    message: string,
    public code?: number,
    public status?: number,
  ) {
    super(message);
  }
  get expired() {
    return this.code === 190 || this.status === 401;
  }
}

async function parse(r: Response) {
  const j = (await r.json().catch(() => ({}))) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!r.ok || j.error || j.error_message) {
    const e = j.error ?? {};
    throw new IgError(e.message || j.error_message || `HTTP ${r.status}`, e.code ?? j.code, r.status);
  }
  return j;
}

/** GET a graph.facebook.com. `path` sin barra inicial (por ejemplo `v27.0/me`). */
export async function gget(path: string, params: Record<string, string>, token?: string) {
  const url = new URL(`https://graph.facebook.com/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  if (token) url.searchParams.set('access_token', token);
  return parse(await fetch(url));
}

export async function exchangeCode(code: string, redirect: string) {
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`);
  url.searchParams.set('client_id', APP_ID);
  url.searchParams.set('client_secret', APP_SECRET);
  url.searchParams.set('redirect_uri', redirect);
  url.searchParams.set('code', code);
  const j = await parse(await fetch(url));
  return { token: j.access_token as string, expiresIn: Number(j.expires_in ?? 0) };
}

// Unified Login returns only Instagram professional accounts from
// /me/assigned_instagram_accounts; `account_type` belongs to the legacy login API.
export const PROFILE_FIELDS = 'id,username,name,profile_picture_url,followers_count,media_count';
