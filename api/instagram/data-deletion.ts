import { randomBytes } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { admin, isConfigured, json, parseSignedRequest, readBody, siteUrl } from '../_lib/ig.js';

/**
 * Solicitud de eliminación de datos de Meta. Borra los datos de Instagram de ese usuario y responde
 * con la URL de estado y el código de confirmación que Meta exige.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
  if (!isConfigured()) return json(res, 503, { error: 'not_configured' });

  const signed = String(readBody(req).signed_request ?? '');
  const data = parseSignedRequest(signed);
  if (!data?.user_id) return json(res, 400, { error: 'invalid_signed_request' });

  await admin().from('instagram_connections').delete().eq('ig_user_id', String(data.user_id));
  const code = randomBytes(8).toString('hex');
  json(res, 200, { url: `${siteUrl(req)}/privacidad#datos-instagram`, confirmation_code: code });
}
