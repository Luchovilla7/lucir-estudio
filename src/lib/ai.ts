import { supabase } from './supabase';
import type { Block, Brand, GenRequest } from './types';

export interface GeneratedContent {
  title: string;
  blocks: Block[];
  caption: string;
  templateId?: string;
}

export async function generateWithClaude(req: GenRequest, brand: Brand): Promise<GeneratedContent> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Inicia sesión para generar contenido.');

  const response = await fetch('/api/content/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ brandId: brand.id, request: req }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const messages: Record<string, string> = {
      ai_not_configured: 'Falta configurar la clave de Claude en el servidor.',
      not_configured: 'Falta configurar Supabase en el servidor.',
      invalid_session: 'Tu sesión venció. Vuelve a iniciar sesión.',
      brand_not_found: 'No encontramos esta marca en tu cuenta.',
      structure_not_found: 'No encontramos la estructura elegida en la Biblioteca.',
      ai_unavailable: 'Claude no pudo generar la pieza ahora. Inténtalo de nuevo.',
    };
    throw new Error(messages[result.error] || 'No se pudo generar el contenido. Inténtalo de nuevo.');
  }

  return result as GeneratedContent;
}
