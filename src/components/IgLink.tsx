import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2, Unlink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useData } from '../lib/store';
import { mediaFrom, mediaLabel, type IgMedia } from '../lib/instagram';
import type { Piece } from '../lib/types';
import { fmtDate } from '../lib/utils';
import { Modal } from './ui';

/** Vincula una pieza con su publicación real en Instagram para traer alcance y guardados automáticamente. */
export function IgLink({ piece, onChange }: { piece: Piece; onChange: (patch: Partial<Piece>) => void }) {
  const { brand } = useData();
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<IgMedia[] | null>(null);
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(false);

  const openModal = async () => {
    setOpen(true);
    setLoading(true);
    const { data: c } = await supabase.from('instagram_connections').select('id').eq('brand_id', brand.id).maybeSingle();
    if (!c) {
      setConnected(false);
      setMedia([]);
      setLoading(false);
      return;
    }
    setConnected(true);
    const { data } = await supabase.from('instagram_media').select('*').eq('connection_id', c.id).order('posted_at', { ascending: false }).limit(30);
    setMedia((data ?? []).map(mediaFrom));
    setLoading(false);
  };

  const link = (m: IgMedia) => {
    onChange({
      igMediaId: m.igMediaId,
      reach: m.reach ?? 0,
      saves: m.saves ?? 0,
      status: 'publicado',
      platform: 'Instagram',
      scheduledAt: piece.scheduledAt ?? m.postedAt?.slice(0, 10),
    });
    setOpen(false);
  };

  return (
    <>
      <label className="label">Instagram</label>
      <div className="row-gap">
        <button className="btn ghost sm" onClick={openModal}>
          <Link2 size={14} /> {piece.igMediaId ? 'Cambiar publicación' : 'Vincular publicación'}
        </button>
        {piece.igMediaId && (
          <button className="btn ghost sm" onClick={() => onChange({ igMediaId: undefined })}>
            <Unlink size={14} /> Quitar
          </button>
        )}
      </div>
      <p className="hint">{piece.igMediaId ? 'Vinculada: el alcance y los guardados se actualizan solos.' : 'Trae el alcance y los guardados reales de esta pieza.'}</p>

      <Modal open={open} onClose={() => setOpen(false)} title="Elige la publicación de Instagram" wide>
        {loading ? (
          <div className="boot-msg" style={{ minHeight: '20vh' }}><div className="spinner" /></div>
        ) : !connected ? (
          <div className="empty">
            <p>Primero conecta tu Instagram para poder vincular publicaciones.</p>
            <Link className="btn primary sm" to="/metricas" onClick={() => setOpen(false)}>Ir a Métricas</Link>
          </div>
        ) : media && media.length === 0 ? (
          <div className="empty"><p>Aún no hay publicaciones sincronizadas. Entra a Métricas y pulsa “Actualizar”.</p></div>
        ) : (
          <ul className="pick-list ig-pick">
            {media?.map((m) => (
              <li key={m.igMediaId}>
                <button onClick={() => link(m)}>
                  <span className="pick-thumb">{m.thumbnailUrl ? <img src={m.thumbnailUrl} alt="" referrerPolicy="no-referrer" loading="lazy" /> : mediaLabel(m.mediaType)}</span>
                  <span className="pick-body">
                    <b>{m.caption ? m.caption.slice(0, 90) : 'Sin texto'}</b>
                    <small>{mediaLabel(m.mediaType)} · {fmtDate(m.postedAt ?? undefined)} · alcance {m.reach?.toLocaleString('es') ?? '—'}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
}
