import type { VercelRequest, VercelResponse } from '@vercel/node';
import { admin, authUser, IgError, isConfigured, json, readBody } from '../_lib/ig.js';
import { syncConnection } from '../_lib/ig-sync.js';

export const config = { maxDuration: 60 };

/** Actualiza las métricas de la conexión de una marca del usuario. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
  if (!isConfigured()) return json(res, 503, { error: 'not_configured' });

  const sb = admin();
  const user = await authUser(req, sb);
  if (!user) return json(res, 401, { error: 'unauthorized' });

  const brandId = String(readBody(req).brandId ?? '');
  const { data: conn } = await sb.from('instagram_connections').select('id').eq('brand_id', brandId).eq('user_id', user.id).maybeSingle();
  if (!conn) return json(res, 404, { error: 'not_connected' });

  try {
    const r = await syncConnection(sb, conn.id as string);
    json(res, 200, { ok: true, ...r });
  } catch (e) {
    if (e instanceof IgError && e.expired) return json(res, 401, { error: 'token_expired' });
    json(res, 502, { error: 'instagram_error', message: (e as Error).message });
  }
}
