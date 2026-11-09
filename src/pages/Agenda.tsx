import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { useData } from '../lib/store';
import { STATUSES, TONES } from '../lib/tones';
import type { Piece } from '../lib/types';
import { clsx, fmtDate, monthMatrix, MONTHS, toISO, todayISO, WEEKDAYS } from '../lib/utils';
import { EmptyState, Modal, PageHeader } from '../components/ui';
import { PieceEditor } from '../components/PieceEditor';

const statusColor = (s: Piece['status']) => STATUSES.find((x) => x.id === s)?.color ?? '#A69A8B';

export default function Agenda() {
  const { brandPieces, updatePiece, deletePiece, duplicatePiece } = useData();
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dayPick, setDayPick] = useState<string | null>(null);

  const weeks = useMemo(() => monthMatrix(cursor.y, cursor.m), [cursor]);
  const today = todayISO();
  const unscheduled = brandPieces.filter((p) => !p.scheduledAt);
  const monthKey = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}`;
  const inMonth = brandPieces.filter((p) => p.scheduledAt?.startsWith(monthKey));
  const byDay = (iso: string) => brandPieces.filter((p) => p.scheduledAt === iso);

  const shift = (d: number) =>
    setCursor((c) => {
      const dt = new Date(c.y, c.m + d, 1);
      return { y: dt.getFullYear(), m: dt.getMonth() };
    });

  const drop = (iso: string) => {
    if (!drag) return;
    const p = brandPieces.find((x) => x.id === drag);
    if (p) updatePiece(p.id, { scheduledAt: iso, status: p.status === 'borrador' || p.status === 'listo' ? 'programado' : p.status });
    setDrag(null);
    setOver(null);
  };

  const opened = brandPieces.find((p) => p.id === openId) ?? null;

  return (
    <>
      <PageHeader title="Agenda" sub="Tu mes de publicaciones, de un vistazo." />
      <div className="agenda">
        <div className="card cal">
          <div className="cal-head">
            <div>
              <h2>{MONTHS[cursor.m]} <span>{cursor.y}</span></h2>
              <p className="muted small">{inMonth.length} {inMonth.length === 1 ? 'publicación' : 'publicaciones'} este mes</p>
            </div>
            <div className="row-gap">
              <button className="icon-btn" onClick={() => shift(-1)} aria-label="Mes anterior"><ChevronLeft size={17} /></button>
              <button className="btn ghost sm" onClick={() => setCursor({ y: now.getFullYear(), m: now.getMonth() })}>Hoy</button>
              <button className="icon-btn" onClick={() => shift(1)} aria-label="Mes siguiente"><ChevronRight size={17} /></button>
            </div>
          </div>
          <div className="cal-grid cal-dow">
            {WEEKDAYS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="cal-body">
            {weeks.map((w, wi) => (
              <div className="cal-grid" key={wi}>
                {w.map(({ date, inMonth: im }) => {
                  const iso = toISO(date);
                  const list = byDay(iso);
                  return (
                    <div
                      key={iso}
                      className={clsx('cal-day', !im && 'out', iso === today && 'today', over === iso && 'over')}
                      onClick={() => unscheduled.length >= 0 && setDayPick(iso)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setOver(iso);
                      }}
                      onDragLeave={() => setOver((o) => (o === iso ? null : o))}
                      onDrop={(e) => {
                        e.preventDefault();
                        drop(iso);
                      }}
                    >
                      <span className="cal-n">{date.getDate()}</span>
                      {list.map((p) => (
                        <button
                          key={p.id}
                          draggable
                          onDragStart={() => setDrag(p.id)}
                          onDragEnd={() => {
                            setDrag(null);
                            setOver(null);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenId(p.id);
                          }}
                          className="cal-piece"
                          style={{ ['--sc' as string]: statusColor(p.status), ['--tc' as string]: TONES[p.tone].color }}
                          title={`${p.title} · ${p.platform}`}
                        >
                          <i />
                          {p.title}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="legend">
            {STATUSES.map((s) => (
              <span key={s.id} style={{ ['--tc' as string]: s.color }}><i /> {s.name}</span>
            ))}
            <em>Arrastra una pieza para cambiarle la fecha</em>
          </div>
        </div>

        <aside className="card unsched">
          <h2>Sin agendar</h2>
          <p className="muted small">{unscheduled.length} {unscheduled.length === 1 ? 'pieza espera' : 'piezas esperan'} fecha</p>
          {unscheduled.length === 0 ? (
            <EmptyState icon={<Inbox size={20} />} title="Todo agendado" text="No hay piezas sueltas. Buen síntoma." action={<Link className="btn primary sm" to="/taller">Crear una</Link>} />
          ) : (
            <ul className="un-list">
              {unscheduled.map((p) => (
                <li key={p.id} draggable onDragStart={() => setDrag(p.id)} onDragEnd={() => setDrag(null)} onClick={() => setOpenId(p.id)}>
                  <b>{p.title}</b>
                  <div>
                    <small>{p.platform}</small>
                    <span className="status-pill" style={{ ['--tc' as string]: statusColor(p.status) }}>{STATUSES.find((s) => s.id === p.status)?.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <Modal open={!!opened} onClose={() => setOpenId(null)} title="Pieza" wide>
        {opened && (
          <PieceEditor
            piece={opened}
            onChange={(patch) => updatePiece(opened.id, patch)}
            onDelete={() => {
              if (window.confirm('¿Eliminar esta pieza?')) {
                deletePiece(opened.id);
                setOpenId(null);
              }
            }}
            onDuplicate={() => {
              const id = duplicatePiece(opened.id);
              if (id) setOpenId(id);
            }}
            compact
          />
        )}
      </Modal>

      <Modal open={!!dayPick} onClose={() => setDayPick(null)} title={dayPick ? `Programar para el ${fmtDate(dayPick, { day: 'numeric', month: 'long' })}` : ''}>
        {unscheduled.length === 0 ? (
          <EmptyState icon={<Inbox size={20} />} title="No hay piezas sin fecha" text="Crea una pieza nueva para poder programarla." action={<Link className="btn primary sm" to="/taller">Ir al Taller</Link>} />
        ) : (
          <ul className="pick-list">
            {unscheduled.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => {
                    updatePiece(p.id, { scheduledAt: dayPick!, status: p.status === 'borrador' || p.status === 'listo' ? 'programado' : p.status });
                    setDayPick(null);
                  }}
                >
                  <b>{p.title}</b>
                  <small>{p.platform}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
}
