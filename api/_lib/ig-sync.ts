import type { SupabaseClient } from '@supabase/supabase-js';
import { decrypt, encrypt, gget, GRAPH_VERSION, IgError, PROFILE_FIELDS, refreshLongLived } from './ig.js';

const DAY = 86_400_000;

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : null);
const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Sincroniza una conexión: perfil, alcance diario, totales de 30 días y publicaciones recientes con sus métricas.
 * Cada bloque falla por separado para que un dato no disponible no tire abajo todo lo demás.
 */
export async function syncConnection(sb: SupabaseClient, connectionId: string): Promise<{ media: number; syncedAt: string }> {
  const { data: conn, error: ce } = await sb.from('instagram_connections').select('*').eq('id', connectionId).single();
  if (ce || !conn) throw new Error('Conexión no encontrada');
  const { data: tk } = await sb.from('instagram_tokens').select('token_enc').eq('connection_id', connectionId).single();
  if (!tk) throw new Error('Token no encontrado');

  let token = decrypt(tk.token_enc as string);
  const markExpired = async (msg: string) => {
    await sb.from('instagram_connections').update({ status: 'expired', last_error: msg, updated_at: new Date().toISOString() }).eq('id', connectionId);
  };

  // Renueva el token si vence pronto (los de larga duración duran 60 días y se renuevan tras 24 h)
  let expiresAt: string | null = conn.token_expires_at as string | null;
  if (expiresAt && new Date(expiresAt).getTime() - Date.now() < 15 * DAY) {
    try {
      const r = await refreshLongLived(token);
      token = r.token;
      expiresAt = new Date(Date.now() + r.expiresIn * 1000).toISOString();
      await sb.from('instagram_tokens').update({ token_enc: encrypt(token), updated_at: new Date().toISOString() }).eq('connection_id', connectionId);
    } catch (e) {
      if (e instanceof IgError && e.expired) {
        await markExpired('La conexión venció. Vuelve a conectar Instagram.');
        throw e;
      }
      // Si falla por otra razón (p. ej. token demasiado reciente) seguimos con el actual.
    }
  }

  const ig = conn.ig_user_id as string;
  const v = GRAPH_VERSION;
  const until = Math.floor(Date.now() / 1000);
  const since = until - 30 * 86_400;

  try {
    // 1) Perfil
    const profile = (await gget(`${v}/me`, { fields: PROFILE_FIELDS }, token)) as Row;

    // 2) Alcance diario (serie) y totales de 30 días
    const daily: Row[] = [];
    try {
      const r = (await gget(`${v}/${ig}/insights`, { metric: 'reach', period: 'day', metric_type: 'time_series', since: String(since), until: String(until) }, token)) as Row;
      for (const val of r.data?.[0]?.values ?? []) {
        const end = new Date(val.end_time).getTime();
        if (!Number.isNaN(end)) daily.push({ connection_id: connectionId, day: isoDay(new Date(end - DAY)), reach: num(val.value) });
      }
    } catch (e) {
      if (e instanceof IgError && e.expired) throw e;
    }

    const names = ['views', 'accounts_engaged', 'total_interactions', 'likes', 'comments', 'saves', 'shares', 'profile_links_taps'];
    const totals = await Promise.allSettled(
      names.map((m) => gget(`${v}/${ig}/insights`, { metric: m, period: 'day', metric_type: 'total_value', since: String(since), until: String(until) }, token)),
    );
    const summary: Row = { period_days: 30 };
    totals.forEach((t, i) => {
      if (t.status === 'fulfilled') summary[names[i]] = num((t.value as Row).data?.[0]?.total_value?.value);
    });
    const reachTotal = daily.reduce((a, d) => a + (d.reach ?? 0), 0);
    if (daily.length) summary.reach = reachTotal;

    // 3) Publicaciones recientes y sus métricas
    const list = (await gget(
      `${v}/${ig}/media`,
      { fields: 'id,caption,media_type,media_product_type,permalink,thumbnail_url,media_url,timestamp,like_count,comments_count', limit: '25' },
      token,
    )) as Row;
    const items: Row[] = list.data ?? [];

    const insightsFor = async (id: string): Promise<Record<string, number>> => {
      for (const metrics of ['reach,saved,shares,views', 'reach,saved,shares', 'reach,saved']) {
        try {
          const r = (await gget(`${v}/${id}/insights`, { metric: metrics }, token)) as Row;
          const out: Record<string, number> = {};
          for (const m of r.data ?? []) out[m.name] = m.values?.[0]?.value ?? m.total_value?.value ?? 0;
          return out;
        } catch (e) {
          if (e instanceof IgError && e.expired) throw e;
        }
      }
      return {};
    };

    const mediaRows: Row[] = [];
    for (let i = 0; i < items.length; i += 5) {
      const chunk = items.slice(i, i + 5);
      const ins = await Promise.all(chunk.map((m) => insightsFor(m.id)));
      chunk.forEach((m, k) => {
        mediaRows.push({
          connection_id: connectionId,
          ig_media_id: m.id,
          caption: m.caption ?? '',
          media_type: m.media_product_type === 'REELS' ? 'REELS' : m.media_type ?? '',
          permalink: m.permalink ?? null,
          thumbnail_url: m.thumbnail_url || m.media_url || null,
          posted_at: m.timestamp ?? null,
          like_count: m.like_count ?? 0,
          comments_count: m.comments_count ?? 0,
          reach: num(ins[k].reach),
          saves: num(ins[k].saved),
          shares: num(ins[k].shares),
          views: num(ins[k].views),
          synced_at: new Date().toISOString(),
        });
      });
    }

    if (mediaRows.length) await sb.from('instagram_media').upsert(mediaRows, { onConflict: 'connection_id,ig_media_id' });
    if (daily.length) await sb.from('instagram_daily').upsert(daily, { onConflict: 'connection_id,day' });
    await sb
      .from('instagram_daily')
      .upsert({ connection_id: connectionId, day: isoDay(new Date()), followers: num(profile.followers_count) }, { onConflict: 'connection_id,day' });

    // 4) Actualiza piezas vinculadas con las métricas reales
    const ids = mediaRows.map((m) => m.ig_media_id as string);
    if (ids.length) {
      const { data: linked } = await sb.from('pieces').select('id, ig_media_id').eq('user_id', conn.user_id).in('ig_media_id', ids);
      for (const p of linked ?? []) {
        const m = mediaRows.find((x) => x.ig_media_id === p.ig_media_id);
        if (!m) continue;
        await sb.from('pieces').update({ reach: m.reach ?? 0, saves: m.saves ?? 0, status: 'publicado' }).eq('id', p.id);
      }
    }

    const syncedAt = new Date().toISOString();
    await sb
      .from('instagram_connections')
      .update({
        username: profile.username ?? conn.username,
        name: profile.name ?? conn.name,
        profile_picture_url: profile.profile_picture_url ?? conn.profile_picture_url,
        account_type: profile.account_type ?? conn.account_type,
        followers_count: num(profile.followers_count) ?? conn.followers_count,
        media_count: num(profile.media_count) ?? conn.media_count,
        summary,
        status: 'active',
        last_error: null,
        token_expires_at: expiresAt,
        last_synced_at: syncedAt,
        updated_at: syncedAt,
      })
      .eq('id', connectionId);

    return { media: mediaRows.length, syncedAt };
  } catch (e) {
    if (e instanceof IgError && e.expired) {
      await markExpired('La conexión venció. Vuelve a conectar Instagram.');
    } else {
      await sb.from('instagram_connections').update({ last_error: (e as Error).message.slice(0, 300), updated_at: new Date().toISOString() }).eq('id', connectionId);
    }
    throw e;
  }
}
