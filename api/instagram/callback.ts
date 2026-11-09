import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  admin,
  encrypt,
  exchangeCode,
  gget,
  GRAPH_VERSION,
  isConfigured,
  isProfessional,
  PROFILE_FIELDS,
  redirectUri,
  siteUrl,
  toLongLived,
  verifyState,
} from '../_lib/ig.js';

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

/** Instagram redirige aquí tras la autorización. Intercambia el código por un token y guarda la conexión. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const site = siteUrl(req);
  const back = (flag: string) => res.redirect(302, `${site}/metricas?ig=${flag}`);

  if (!isConfigured()) return back('not_configured');

  const error = first(req.query.error);
  if (error) return back(error === 'access_denied' ? 'cancelled' : 'error');

  const code = first(req.query.code).replace(/#_$/, '');
  const state = verifyState(first(req.query.state));
  if (!code || !state) return back('error');

  try {
    const sb = admin();
    const { data: brand } = await sb.from('brands').select('id').eq('id', state.b).eq('user_id', state.u).maybeSingle();
    if (!brand) return back('error');

    const short = await exchangeCode(code, redirectUri(req));
    const long = await toLongLived(short.token);
    const profile = (await gget(`${GRAPH_VERSION}/me`, { fields: PROFILE_FIELDS }, long.token)) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!isProfessional(String(profile.account_type ?? ''))) return back('personal');

    const igUserId = String(profile.user_id ?? short.userId);
    const now = new Date().toISOString();
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
          account_type: profile.account_type ?? '',
          followers_count: profile.followers_count ?? 0,
          media_count: profile.media_count ?? 0,
          status: 'active',
          last_error: null,
          token_expires_at: new Date(Date.now() + long.expiresIn * 1000).toISOString(),
          connected_at: now,
          updated_at: now,
        },
        { onConflict: 'brand_id' },
      )
      .select('id')
      .single();
    if (ce || !conn) return back('error');

    const { error: te } = await sb.from('instagram_tokens').upsert({ connection_id: conn.id, token_enc: encrypt(long.token), updated_at: now }, { onConflict: 'connection_id' });
    if (te) return back('error');

    return back('ok');
  } catch {
    return back('error');
  }
}
