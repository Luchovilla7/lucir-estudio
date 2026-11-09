import type { VercelRequest, VercelResponse } from '@vercel/node';
import { admin, appId, authUser, isConfigured, json, readBody, redirectUri, SCOPES, signState } from '../_lib/ig.js';

/** Devuelve la URL de autorización de Instagram para la marca indicada. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
  if (!isConfigured()) return json(res, 503, { error: 'not_configured' });

  const sb = admin();
  const user = await authUser(req, sb);
  if (!user) return json(res, 401, { error: 'unauthorized' });

  const brandId = String(readBody(req).brandId ?? '');
  if (!brandId) return json(res, 400, { error: 'brand_required' });
  const { data: brand } = await sb.from('brands').select('id').eq('id', brandId).eq('user_id', user.id).maybeSingle();
  if (!brand) return json(res, 404, { error: 'brand_not_found' });

  const url = new URL('https://www.instagram.com/oauth/authorize');
  url.searchParams.set('client_id', appId());
  url.searchParams.set('redirect_uri', redirectUri(req));
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', SCOPES);
  url.searchParams.set('state', signState({ u: user.id, b: brandId }));
  url.searchParams.set('force_reauth', 'true'); // deja elegir la cuenta correcta si hay varias

  json(res, 200, { url: url.toString() });
}
