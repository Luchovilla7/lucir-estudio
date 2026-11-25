import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  admin,
  encrypt,
  exchangeCode,
  gget,
  GRAPH_VERSION,
  isConfigured,
  PROFILE_FIELDS,
  redirectUri,
  siteUrl,
  verifyState,
} from '../_lib/ig.js';

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

/** Meta redirige aquí tras Unified Login. Intercambia el código y guarda la cuenta y el token. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const site = siteUrl(req);
  const back = (flag: string) => res.redirect(302, `${site}/metricas?ig=${flag}`);

  if (!isConfigured()) return back('not_configured');

  const error = first(req.query.error);
  if (error) return back(error === 'access_denied' ? 'cancelled' : 'error');

  const code = first(req.query.code).replace(/#_$/, '');
  const state = verifyState(first(req.query.state));
  if (!code || !state) return back('error');

  let stage = 'validate';
  try {
    const sb = admin();
    const { data: brand } = await sb.from('brands').select('id').eq('id', state.b).eq('user_id', state.u).maybeSingle();
    if (!brand) return back('error');

    stage = 'exchange_code';
    const access = await exchangeCode(code, redirectUri(req));
    stage = 'find_instagram_accounts';
    const accounts = (await gget(`${GRAPH_VERSION}/me/assigned_instagram_accounts`, { fields: 'id,username' }, access.token)) as { data?: Array<{ id: string }> };
    const assigned = accounts.data ?? [];
    if (assigned.length > 1) return back('multiple_accounts');
    const igUserId = String(assigned[0]?.id ?? '');
    if (!igUserId) return back('no_account');

    stage = 'load_profile';
    const profile = (await gget(`${GRAPH_VERSION}/${igUserId}`, { fields: PROFILE_FIELDS }, access.token)) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

    const now = new Date().toISOString();
    stage = 'save_connection';
    const { data: conn, error: ce } = await sb
      .from('instagram_connections')
      .upsert(
        {
          user_id: state.u,
          brand_id: state.b,
          ig_user_id: igUserId,
          username: profile.username ?? '',
          name: profile.name ?? '',
          profile_picture_url: profile.profile_picture_url ?? null,
          // The assigned Instagram accounts edge only contains professional accounts.
          // Unified Login does not expose the legacy `account_type` profile field.
          account_type: 'PROFESSIONAL',
          followers_count: profile.followers_count ?? 0,
          media_count: profile.media_count ?? 0,
          status: 'active',
          last_error: null,
          token_expires_at: access.expiresIn > 0 ? new Date(Date.now() + access.expiresIn * 1000).toISOString() : null,
          connected_at: now,
          updated_at: now,
        },
        { onConflict: 'brand_id' },
      )
      .select('id')
      .single();
    if (ce || !conn) return back('error');

    const { error: te } = await sb.from('instagram_tokens').upsert({ connection_id: conn.id, token_enc: encrypt(access.token), updated_at: now }, { onConflict: 'connection_id' });
    if (te) return back('error');

    return back('ok');
  } catch (e) {
    console.error(`Instagram Unified Login callback failed at ${stage}:`, e instanceof Error ? e.message : 'unknown error');
    return back('error');
  }
}
