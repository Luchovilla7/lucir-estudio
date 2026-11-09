import type { VercelRequest, VercelResponse } from '@vercel/node';
import { admin, authUser, isConfigured, json, readBody } from '../_lib/ig.js';

/** Borra la conexión de una marca con todos sus tokens y métricas guardadas. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
  if (!isConfigured()) return json(res, 503, { error: 'not_configured' });

  const sb = admin();
  const user = await authUser(req, sb);
  if (!user) return json(res, 401, { error: 'unauthorized' });

  const brandId = String(readBody(req).brandId ?? '');
  const { error } = await sb.from('instagram_connections').delete().eq('brand_id', brandId).eq('user_id', user.id);
  if (error) return json(res, 500, { error: 'delete_failed' });

  // Las piezas conservan su alcance, pero dejan de estar vinculadas a una publicación
  await sb.from('pieces').update({ ig_media_id: null }).eq('brand_id', brandId).eq('user_id', user.id);
  json(res, 200, { ok: true });
}
