import { Link, useNavigate } from 'react-router-dom';
import { Archive, CalendarDays, Inbox, Lightbulb, Pencil, Sparkles } from 'lucide-react';
import { useData } from '../lib/store';
import { FORMAT_LIST, RHYTHM_PHASES, TONE_LIST, TONES } from '../lib/tones';
import { generateSparks } from '../lib/engine';
import { fmtDate, fromISO, todayISO } from '../lib/utils';
import { EmptyState, PageHeader, Section, ToneDot, useToast } from '../components/ui';
import { ANGLE_BY_ID, OBJECTIVE_LIST, parseRef, sparkAngle } from '../lib/angles';

export default function Dashboard() {
  const { brand, brandPieces, brandSparks, addSparks } = useData();
  const nav = useNavigate();
  const toast = useToast();
  const today = todayISO();
  const month = today.slice(0, 7);

  const ready = brandPieces.filter((p) => p.status === 'listo' && !p.scheduledAt);
  const counted = brandPieces.filter((p) => (p.status === 'publicado' || p.status === 'programado') && p.scheduledAt?.startsWith(month));
  const goal = Math.max(1, brand.monthlyGoal || 20);
  const pct = Math.min(100, Math.round((counted.length / goal) * 100));
  const upcoming = brandPieces
    .filter((p) => p.scheduledAt && p.scheduledAt >= today && p.status !== 'publicado')
    .sort((a, b) => (a.scheduledAt! < b.scheduledAt! ? -1 : 1))
    .slice(0, 5);
  const pending = brandSparks.filter((s) => !s.used);

  const byFormat = FORMAT_LIST.map((f) => ({ f, n: brandPieces.filter((p) => p.format === f.id).length }));
  const maxF = Math.max(1, ...byFormat.map((x) => x.n));
  const byTone = TONE_LIST.map((t) => ({ t, n: brandPieces.filter((p) => p.tone === t.id).length }));
  const totalTone = byTone.reduce((a, b) => a + b.n, 0);
  const maxT = Math.max(1, ...byTone.map((x) => x.n));
  const least = totalTone > 0 ? [...byTone].sort((a, b) => a.n - b.n)[0] : null;
  const byObjective = OBJECTIVE_LIST.map((o) => ({
    o,
    n: brandPieces.filter((p) => ANGLE_BY_ID[parseRef(p.templateId).angle ?? '']?.objective === o.id).length,
  }));
  const withAngle = byObjective.reduce((a, b) => a + b.n, 0);
  const maxO = Math.max(1, ...byObjective.map((x) => x.n));
  const leastObj = withAngle > 0 ? [...byObjective].sort((a, b) => a.n - b.n)[0] : null;

  let rhythm: { name: string; tip: string; day: number; tone: keyof typeof TONES } | null = null;
  if (brand.cycleEnabled) {
    const len = Math.max(20, brand.cycleLength || 28);
    const diff = Math.floor((fromISO(today).getTime() - fromISO(brand.cycleStart).getTime()) / 86400000);
    const day = ((diff % len) + len) % len;
    const ratio = day / len;
    const ph = RHYTHM_PHASES.find((p) => ratio >= p.range[0] && ratio < p.range[1]) ?? RHYTHM_PHASES[0];
    rhythm = { name: ph.name, tip: ph.tip, day: day + 1, tone: ph.tone };
  }

  const genSparks = () => {
    addSparks(generateSparks(brand, 'all', '', brandSparks.length));
    toast('8 chispas nuevas en tu banco');
  };

  return (
    <>
      <PageHeader title="Panorama" sub={`Cómo va tu mes de contenido${brand.name ? ` en ${brand.name}` : ''}.`} />

      <div className="grid-2 stats">
        <div className="card stat">
          <div className="stat-ico"><Inbox size={16} /></div>
          <div>
            <span className="eyebrow">Listas</span>
            <div className="stat-num">{ready.length}</div>
            <p className="muted">esperando agenda</p>
          </div>
        </div>
        <div className="card stat">
          <div className="stat-ico"><CalendarDays size={16} /></div>
          <div className="grow">
            <span className="eyebrow">Meta del mes</span>
            <div className="stat-num">{counted.length}/{goal}</div>
            <div className="bar"><i style={{ width: `${pct}%` }} /></div>
            <p className="muted">{pct}% cumplido</p>
          </div>
        </div>
      </div>

      {rhythm && (
        <div className="card rhythm" style={{ ['--tc' as string]: TONES[rhythm.tone].color }}>
          <span className="eyebrow">Tu ritmo · día {rhythm.day}</span>
          <h3>{rhythm.name}</h3>
          <p>{rhythm.tip}</p>
          <Link className="btn ghost sm" to="/taller">Crear con tono {TONES[rhythm.tone].name}</Link>
        </div>
      )}

      <Section
        title="Por tipo"
        sub="En qué formato estás creando."
        actions={
          <div className="row-gap">
            <Link className="btn ghost sm" to="/archivo"><Archive size={14} /> Archivo</Link>
            <Link className="btn primary sm" to="/taller"><Pencil size={14} /> Crear contenido</Link>
          </div>
        }
      >
        {brandPieces.length === 0 ? (
          <p className="muted pad">Todavía no hay piezas. Crea la primera en el Taller.</p>
        ) : (
          <div className="bars">
            {byFormat.map(({ f, n }) => (
              <div className="bar-row" key={f.id}>
                <span>{f.name}</span>
                <div className="bar"><i style={{ width: `${(n / maxF) * 100}%` }} /></div>
                <b>{n}</b>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className="grid-2">
        <Section title="Balance de tonos" sub="Cómo se reparten los cuatro tonos en tu contenido.">
          <div className="bars">
            {byTone.map(({ t, n }) => (
              <div className="bar-row" key={t.id}>
                <span>{t.name}</span>
                <div className="bar" style={{ ['--tc' as string]: t.color }}><i className="tone-fill" style={{ width: `${(n / maxT) * 100}%` }} /></div>
                <b>{n}</b>
              </div>
            ))}
          </div>
          {least && (
            <p className="callout">
              Estás usando poco el tono <b>{least.t.name}</b>. {least.t.tagline}
            </p>
          )}
        </Section>

        <Section title="Próximas publicaciones" sub="Lo que ya tienes agendado." actions={<Link className="btn ghost sm" to="/agenda"><CalendarDays size={14} /> Ver agenda</Link>}>
          {upcoming.length === 0 ? (
            <EmptyState icon={<CalendarDays size={20} />} title="No hay nada agendado" text="Programa tus piezas listas para no publicar a última hora." action={<Link className="btn primary sm" to="/agenda">Ir a la agenda</Link>} />
          ) : (
            <ul className="list">
              {upcoming.map((p) => (
                <li key={p.id}>
                  <span className="date-chip">{fmtDate(p.scheduledAt)}</span>
                  <span className="li-title">{p.title}</span>
                  <ToneDot tone={p.tone} label={false} />
                  <small className="muted">{p.platform}</small>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section title="Objetivo de tus piezas" sub="Cuántas piezas con ángulo tienes para atraer, conectar y convertir.">
        {withAngle === 0 ? (
          <p className="muted pad">Elige un ángulo en el Taller y aquí verás cómo equilibras tus objetivos.</p>
        ) : (
          <>
            <div className="bars">
              {byObjective.map(({ o, n }) => (
                <div className="bar-row" key={o.id}>
                  <span>{o.name}</span>
                  <div className="bar"><i style={{ width: `${(n / maxO) * 100}%` }} /></div>
                  <b>{n}</b>
                </div>
              ))}
            </div>
            {leastObj && (
              <p className="callout">
                Tienes pocas piezas para <b>{leastObj.o.name.toLowerCase()}</b>. {leastObj.o.desc}
              </p>
            )}
          </>
        )}
      </Section>

      <Section
        title="Banco de chispas"
        sub={pending.length ? `${pending.length} ${pending.length === 1 ? 'idea espera' : 'ideas esperan'} ser escritas.` : 'Ideas listas para convertirse en piezas.'}
        actions={<button className="btn primary sm" onClick={genSparks}><Sparkles size={14} /> Generar chispas nuevas</button>}
      >
        {pending.length === 0 ? (
          <EmptyState icon={<Lightbulb size={20} />} title="Tu banco está vacío" text="Genera una tanda de ocho ideas, dos por cada tono." />
        ) : (
          <div className="spark-mini">
            {pending.slice(0, 4).map((s) => (
              <button key={s.id} className="spark-chip" onClick={() => nav('/taller', { state: { idea: s.title, tone: s.tone, sparkId: s.id, angle: sparkAngle(s.levels) } })}>
                <b>{s.title}</b>
                <ToneDot tone={s.tone} />
              </button>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
