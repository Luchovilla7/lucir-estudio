import type { VercelRequest, VercelResponse } from '@vercel/node';
import { admin, isConfigured, json, parseSignedRequest, readBody } from '../_lib/ig.js';

/** Aviso de Meta cuando un usuario quita la app desde Instagram: borramos la conexión. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
  if (!isConfigured()) return json(res, 503, { error: 'not_configured' });

  const signed = String(readBody(req).signed_request ?? '');
  const data = parseSignedRequest(signed);
  if (!data?.user_id) return json(res, 400, { error: 'invalid_signed_request' });

  await admin().from('instagram_connections').delete().eq('ig_user_id', String(data.user_id));
  json(res, 200, { ok: true });
}
