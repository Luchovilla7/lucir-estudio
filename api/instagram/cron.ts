import type { VercelRequest, VercelResponse } from '@vercel/node';
import { admin, isConfigured, json } from '../_lib/ig.js';
import { syncConnection } from '../_lib/ig-sync.js';

export const config = { maxDuration: 60 };

/**
 * Tarea diaria (vercel.json → crons): renueva tokens y actualiza las métricas de todas las conexiones activas.
 * Vercel envía `Authorization: Bearer $CRON_SECRET` si CRON_SECRET está definida.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) return json(res, 401, { error: 'unauthorized' });
  if (!isConfigured()) return json(res, 503, { error: 'not_configured' });

  const sb = admin();
  const { data } = await sb.from('instagram_connections').select('id').eq('status', 'active').order('last_synced_at', { ascending: true, nullsFirst: true }).limit(40);

  let ok = 0;
  let failed = 0;
  const started = Date.now();
  for (const c of data ?? []) {
    if (Date.now() - started > 50_000) break; // deja margen antes del límite de la función
    try {
      await syncConnection(sb, c.id as string);
      ok++;
    } catch {
      failed++;
    }
  }
  json(res, 200, { ok, failed });
}
