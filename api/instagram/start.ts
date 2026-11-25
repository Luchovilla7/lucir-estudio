import type { VercelRequest, VercelResponse } from '@vercel/node';
import { admin, appId, authUser, configId, GRAPH_VERSION, isConfigured, json, readBody, redirectUri, signState } from '../_lib/ig.js';

/** Devuelve la URL de Facebook Login for Business para Instagram Unified Login. */
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

  const url = new URL(`https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`);
  url.searchParams.set('client_id', appId());
  url.searchParams.set('config_id', configId());
  url.searchParams.set('redirect_uri', redirectUri(req));
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('display', 'popup');
  url.searchParams.set('prompt', 'login');
  url.searchParams.set('override_default_response_type', 'true');
  url.searchParams.set('state', signState({ u: user.id, b: brandId }));

  json(res, 200, { url: url.toString() });
}
