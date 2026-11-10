import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export type StructureCategory = 'venta' | 'educacion' | 'atraccion' | 'autoridad';

export interface Structure {
  id: string;
  category: StructureCategory;
  number: number;
  title: string;
  summary: string;
  strategy: string;
  slides: string[];
  prompt: string;
}

export const STRUCTURE_CATEGORIES: { id: StructureCategory; name: string; emoji: string; goal: string }[] = [
  { id: 'venta', name: 'Venta', emoji: '💰', goal: 'Convertir a quien ya te sigue en cliente.' },
  { id: 'educacion', name: 'Educación', emoji: '🧠', goal: 'Enseñar algo útil que genere guardados.' },
  { id: 'atraccion', name: 'Atracción', emoji: '🧲', goal: 'Llegar a gente nueva que se identifica.' },
  { id: 'autoridad', name: 'Autoridad', emoji: '⚡', goal: 'Mostrar tu criterio, tu historia y tus creencias.' },
];

let cache: Structure[] | null = null;

/** Carga la biblioteca de estructuras desde Supabase (contenido compartido de solo lectura). */
export function useStructures() {
  const [items, setItems] = useState<Structure[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cache) return;
    let alive = true;
    supabase
      .from('carousel_structures')
      .select('id, category, number, title, summary, strategy, slides, prompt')
      .order('sort', { ascending: true })
      .then(({ data, error: e }) => {
        if (!alive) return;
        if (e) {
          setError(e.message);
        } else {
          cache = (data ?? []) as Structure[];
          setItems(cache);
        }
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { items, loading, error };
}
