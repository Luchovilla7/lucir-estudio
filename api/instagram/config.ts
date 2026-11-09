import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isConfigured, json } from '../_lib/ig.js';

/** Indica al frontend si la conexión de Instagram está habilitada en el servidor. */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  json(res, 200, { configured: isConfigured() });
}
