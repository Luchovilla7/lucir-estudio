import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, BarChart3, Check, ExternalLink, Eye, Heart, Link2, Lock, RefreshCw, ShieldCheck, Unplug, UserRound, Users } from 'lucide-react';
import { useData } from '../lib/store';
import { demoData, mediaLabel, useInstagram, type IgDay, type IgMedia } from '../lib/instagram';
import { TONES } from '../lib/tones';
import { clsx, fmtDate } from '../lib/utils';
import { EmptyState, PageHeader, Section, useToast } from '../components/ui';

const nf = (n: number | null | undefined) => (n == null ? '—' : n.toLocaleString('es'));

function ago(iso: string | null): string {
  if (!iso) return 'nunca';
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'hace un momento';
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} d`;
}

function AreaChart({ data }: { data: IgDay[] }) {
  const pts = data.filter((d) => d.reach != null) as { day: string; reach: number }[];
  if (pts.length < 2) return <p className="muted pad">Todavía no hay suficientes días para dibujar el alcance. Vuelve mañana.</p>;
  const W = 640;
  const H = 170;
  const P = { l: 40, r: 10, t: 12, b: 24 };
  const max = Math.max(...pts.map((p) => p.reach), 1);
  const x = (i: number) => P.l + (i * (W - P.l - P.r)) / (pts.length - 1);
  const y = (v: number) => P.t + (1 - v / max) * (H - P.t - P.b);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.reach).toFixed(1)}`).join(' ');
  const area = `${line} L${x(pts.length - 1).toFixed(1)},${H - P.b} L${x(0).toFixed(1)},${H - P.b} Z`;
  const nice = (n: number) => {
    const step = 10 ** Math.max(0, String(Math.round(n)).length - 2);
    return Math.round(n / step) * step;
  };
  const ticks = [0, nice(max / 2), nice(max)];
  const labelIdx = [0, Math.floor(pts.length / 2), pts.length - 1];
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Alcance diario de los últimos 30 días">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="chart-grid" />
          <text x={P.l - 6} y={y(t) + 4} textAnchor="end" className="chart-tick">{t >= 1000 ? `${(t / 1000).toFixed(1)}k` : t}</text>
        </g>
      ))}
      <path d={area} className="chart-area" />
      <path d={line} className="chart-line" />
      {labelIdx.map((i) => (
        <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? 'start' : i === pts.length - 1 ? 'end' : 'middle'} className="chart-tick">
          {fmtDate(pts[i].day)}
        </text>
      ))}
    </svg>
  );
}

function Kpi({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="card stat">
      <div className="stat-ico">{icon}</div>
      <div>
        <span className="eyebrow">{label}</span>
        <div className="stat-num">{value}</div>
        {hint && <p className="muted small">{hint}</p>}
      </div>
    </div>
  );
}

export default function Metrics() {
  const { brand, brandPieces } = useData();
  const toast = useToast();
  const ig = useInstagram(brand.id);
  const [params, setParams] = useSearchParams();
  const [demo, setDemo] = useState(false);
  const [help, setHelp] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'warn'; text: string } | null>(null);
  const synced = useRef(false);

  // Mensajes al volver desde Instagram
  useEffect(() => {
    const flag = params.get('ig');
    if (!flag) return;
    const map: Record<string, { kind: 'ok' | 'warn'; text: string }> = {
      ok: { kind: 'ok', text: '¡Instagram conectado! Estamos trayendo tus métricas.' },
      cancelled: { kind: 'warn', text: 'No se conectó nada: cancelaste la autorización. Puedes intentarlo de nuevo cuando quieras.' },
      personal: { kind: 'warn', text: 'Esa cuenta es personal. Para ver métricas, Instagram exige una cuenta Profesional (Empresa o Creador).' },
      no_account: { kind: 'warn', text: 'Meta no compartió una cuenta profesional con Lucir. En la autorización, selecciona tu cuenta de Instagram y acepta el permiso de acceso.' },
      multiple_accounts: { kind: 'warn', text: 'Compartiste varias cuentas profesionales. Lucir conecta una por marca; vuelve a Meta y comparte una sola cuenta para esta marca.' },
      not_configured: { kind: 'warn', text: 'La conexión con Instagram todavía no está habilitada.' },
      error: { kind: 'warn', text: 'No pudimos completar la conexión. Inténtalo de nuevo en un momento.' },
    };
    setNotice(map[flag] ?? map.error);
    if (flag === 'personal') setHelp(true);
    setParams({}, { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Actualiza automáticamente si hace más de 6 horas
  useEffect(() => {
    if (ig.state !== 'connected' || !ig.conn || ig.conn.status !== 'active' || synced.current) return;
    const stale = !ig.conn.lastSyncedAt || Date.now() - new Date(ig.conn.lastSyncedAt).getTime() > 6 * 3_600_000;
    if (stale) {
      synced.current = true;
      void ig.sync();
    }
  }, [ig.state, ig.conn]); // eslint-disable-line react-hooks/exhaustive-deps

  const sample = useMemo(() => demoData(), []);
  const showDemo = demo;
  const conn = showDemo ? sample.conn : ig.conn;
  const media: IgMedia[] = showDemo ? sample.media : ig.media;
  const daily: IgDay[] = showDemo ? sample.daily : ig.daily;
  const isConnected = showDemo || ig.state === 'connected';

  const followerDelta = useMemo(() => {
    const f = daily.filter((d) => d.followers != null);
    return f.length >= 2 ? (f[f.length - 1].followers as number) - (f[0].followers as number) : null;
  }, [daily]);

  const bestFormat = useMemo(() => {
    const groups = new Map<string, number[]>();
    for (const m of media) if (m.reach != null) groups.set(m.mediaType, [...(groups.get(m.mediaType) ?? []), m.reach]);
    const rows = [...groups.entries()].map(([t, v]) => ({ t, avg: v.reduce((a, b) => a + b, 0) / v.length, n: v.length }));
    if (rows.length < 2) return null;
    return rows.sort((a, b) => b.avg - a.avg)[0];
  }, [media]);

  const bestTone = useMemo(() => {
    if (showDemo) return { tone: TONES.faro, avg: 2480, n: 3 };
    const byId = new Map(media.map((m) => [m.igMediaId, m]));
    const groups = new Map<string, number[]>();
    for (const p of brandPieces) {
      const m = p.igMediaId ? byId.get(p.igMediaId) : undefined;
      if (m?.reach != null) groups.set(p.tone, [...(groups.get(p.tone) ?? []), m.reach]);
    }
    const rows = [...groups.entries()].map(([t, v]) => ({ t, avg: v.reduce((a, b) => a + b, 0) / v.length, n: v.length }));
    if (!rows.length) return null;
    const top = rows.sort((a, b) => b.avg - a.avg)[0];
    return { tone: TONES[top.t as keyof typeof TONES], avg: top.avg, n: top.n };
  }, [media, brandPieces, showDemo]);

  const top = useMemo(() => [...media].filter((m) => m.reach != null).sort((a, b) => (b.reach ?? 0) - (a.reach ?? 0)).slice(0, 4), [media]);

  const actions = isConnected ? (
    <div className="row-gap">
      {showDemo ? (
        <button className="btn ghost sm" onClick={() => setDemo(false)}>Salir del ejemplo</button>
      ) : (
        <>
          <button className="btn ghost sm" onClick={() => void ig.sync()} disabled={ig.busy !== ''}>
            <RefreshCw size={14} className={clsx(ig.busy === 'sync' && 'spin')} /> {ig.busy === 'sync' ? 'Actualizando…' : 'Actualizar'}
          </button>
          <button
            className="btn ghost sm"
            disabled={ig.busy !== ''}
            onClick={async () => {
              if (window.confirm('Se desconectará tu Instagram y se borrarán las métricas guardadas aquí. Tus piezas se conservan. ¿Continuar?')) {
                await ig.disconnect();
                toast('Instagram desconectado');
              }
            }}
          >
            <Unplug size={14} /> Desconectar
          </button>
        </>
      )}
    </div>
  ) : undefined;

  return (
    <>
      <PageHeader title="Métricas" sub="Cómo le está yendo a tu contenido en Instagram." actions={actions} />

      {notice && (
        <div className={clsx('banner', notice.kind === 'ok' ? 'ok' : 'warn')} role="status">
          {notice.kind === 'ok' ? <Check size={16} /> : <AlertTriangle size={16} />}
          <span>{notice.text}</span>
          <button className="icon-btn sm" onClick={() => setNotice(null)} aria-label="Cerrar">×</button>
        </div>
      )}
      {ig.error && !showDemo && (
        <div className="banner warn" role="alert">
          <AlertTriangle size={16} />
          <span>{ig.error}</span>
          {ig.conn?.status === 'expired' && <button className="btn primary xs" onClick={() => void ig.connect()}>Reconectar</button>}
        </div>
      )}

      {!showDemo && ig.state === 'loading' && (
        <div className="boot-msg" style={{ minHeight: '30vh' }}><div className="spinner" aria-label="Cargando" /></div>
      )}

      {/* ───────────── sin conectar ───────────── */}
      {!showDemo && (ig.state === 'disconnected' || ig.state === 'unconfigured') && (
        <div className="card connect-card">
          <div className="connect-head">
            <span className="connect-ico"><BarChart3 size={22} /></span>
            <div>
              <h2>Conecta tu Instagram en un minuto</h2>
              <p className="muted">Mira el alcance, las visualizaciones y qué publicaciones funcionan mejor, sin salir de Lucir.</p>
            </div>
          </div>

          <ol className="connect-steps">
            <li>
              <b>Ten una cuenta Profesional.</b> Instagram solo comparte métricas de cuentas de Empresa o Creador (es gratis y se cambia en 3 toques).
              <button className="link-btn" onClick={() => setHelp((v) => !v)}>{help ? 'Ocultar cómo hacerlo' : 'Ver cómo hacerlo'}</button>
              {help && (
                <div className="help-box">
                  <p>En la app de Instagram:</p>
                  <ol>
                    <li>Ve a tu perfil y toca el menú (☰) y luego <b>Configuración y actividad</b>.</li>
                    <li>Busca <b>Tipo de cuenta y herramientas</b>.</li>
                    <li>Elige <b>Cambiar a cuenta profesional</b> y escoge <b>Creador</b> o <b>Empresa</b>.</li>
                  </ol>
                  <p className="muted small">Los nombres pueden variar un poco según tu versión de Instagram.</p>
                </div>
              )}
            </li>
            <li><b>Pulsa “Conectar con Instagram”</b> e inicia sesión en la ventana oficial de Instagram.</li>
            <li><b>Acepta el permiso de lectura.</b> Volverás aquí y tus métricas se cargan solas.</li>
          </ol>

          <div className="connect-cta">
            {ig.state === 'disconnected' ? (
              <button className="btn primary" onClick={() => void ig.connect()} disabled={ig.busy === 'connect'}>
                <Link2 size={16} /> {ig.busy === 'connect' ? 'Abriendo Instagram…' : 'Conectar con Instagram'}
              </button>
            ) : (
              <div className="soon">
                <Lock size={15} /> La conexión con Instagram se está habilitando. Mientras tanto puedes ver cómo se verá.
              </div>
            )}
            <button className="btn ghost" onClick={() => setDemo(true)}><Eye size={16} /> Ver un ejemplo</button>
          </div>

          <div className="trust-grid">
            <div>
              <h3><ShieldCheck size={16} /> Qué vemos</h3>
              <ul>
                <li>Seguidores, alcance y visualizaciones</li>
                <li>Interacciones de tus últimas publicaciones</li>
                <li>Nombre de usuario y foto de perfil</li>
              </ul>
            </div>
            <div>
              <h3><Lock size={16} /> Qué nunca hacemos</h3>
              <ul>
                <li>No publicamos ni comentamos por ti</li>
                <li>No leemos tus mensajes privados</li>
                <li>No vemos tu contraseña (la maneja Instagram)</li>
                <li>Puedes desconectar cuando quieras</li>
              </ul>
            </div>
          </div>
          <p className="hint">Más detalles en nuestra <Link to="/privacidad">política de privacidad</Link>.</p>
        </div>
      )}

      {/* ───────────── conectado (o ejemplo) ───────────── */}
      {isConnected && conn && (
        <>
          {showDemo && (
            <div className="banner info">
              <Eye size={16} />
              <span><b>Datos de muestra.</b> Así se verán tus métricas cuando conectes tu cuenta.</span>
              {ig.state === 'disconnected' && <button className="btn primary xs" onClick={() => void ig.connect()}>Conectar mi Instagram</button>}
            </div>
          )}

          <div className="card profile-row">
            {conn.profilePictureUrl ? <img src={conn.profilePictureUrl} alt="" className="ig-avatar" referrerPolicy="no-referrer" /> : <span className="ig-avatar ph"><UserRound size={22} /></span>}
            <div className="grow">
              <h2>@{conn.username}</h2>
              <p className="muted small">
                {conn.accountType.toLowerCase().includes('creator') ? 'Cuenta de creador' : 'Cuenta de empresa'} · actualizado {ago(conn.lastSyncedAt)}
              </p>
            </div>
            {conn.status === 'expired' && <span className="status-pill" style={{ ['--tc' as string]: '#ff6b6b' }}>Conexión vencida</span>}
          </div>

          <div className="kpi-grid">
            <Kpi icon={<Users size={16} />} label="Seguidores" value={nf(conn.followersCount)} hint={followerDelta == null ? undefined : `${followerDelta >= 0 ? '+' : ''}${followerDelta} en el periodo`} />
            <Kpi icon={<Eye size={16} />} label="Alcance (30 d)" value={nf(conn.summary.reach)} hint="Cuentas distintas que te vieron" />
            <Kpi icon={<BarChart3 size={16} />} label="Visualizaciones (30 d)" value={nf(conn.summary.views)} />
            <Kpi icon={<Heart size={16} />} label="Interacciones (30 d)" value={nf(conn.summary.total_interactions)} hint={`${nf(conn.summary.saves)} guardados · ${nf(conn.summary.shares)} compartidos`} />
          </div>

          <Section title="Alcance diario" sub="Los últimos 30 días.">
            <AreaChart data={daily} />
          </Section>

          {(bestFormat || bestTone) && (
            <div className="grid-2">
              {bestFormat && (
                <div className="card insight">
                  <span className="eyebrow">Tu formato con más alcance</span>
                  <h3>{mediaLabel(bestFormat.t)}</h3>
                  <p className="muted">Promedia {nf(Math.round(bestFormat.avg))} de alcance por publicación ({bestFormat.n} publicaciones).</p>
                </div>
              )}
              {bestTone && (
                <div className="card insight" style={{ ['--tc' as string]: bestTone.tone.color }}>
                  <span className="eyebrow">Tu tono con más alcance</span>
                  <h3 style={{ color: bestTone.tone.color }}>{bestTone.tone.name}</h3>
                  <p className="muted">{nf(Math.round(bestTone.avg))} de alcance en promedio, según tus piezas vinculadas ({bestTone.n}).</p>
                </div>
              )}
            </div>
          )}

          <Section title="Tus publicaciones" sub={top.length ? 'Ordenadas por alcance. Vincúlalas con tus piezas desde el Archivo para ver qué tono funciona mejor.' : undefined}>
            {media.length === 0 ? (
              <EmptyState icon={<BarChart3 size={20} />} title="Aún no hay publicaciones para mostrar" text="Cuando publiques en Instagram y actualices, aparecerán aquí." />
            ) : (
              <div className="media-grid">
                {[...media].sort((a, b) => (b.reach ?? -1) - (a.reach ?? -1)).map((m) => (
                  <article className="media-card" key={m.igMediaId}>
                    <div className="media-thumb">
                      {m.thumbnailUrl ? <img src={m.thumbnailUrl} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <span>{mediaLabel(m.mediaType)}</span>}
                      <em>{mediaLabel(m.mediaType)}</em>
                    </div>
                    <p className="media-cap">{m.caption || 'Sin texto'}</p>
                    <div className="media-stats">
                      <span title="Alcance"><Eye size={12} /> {nf(m.reach)}</span>
                      <span title="Me gusta"><Heart size={12} /> {nf(m.likeCount)}</span>
                      <span title="Guardados">🔖 {nf(m.saves)}</span>
                    </div>
                    <div className="media-foot">
                      <small className="muted">{fmtDate(m.postedAt ?? undefined, { day: 'numeric', month: 'short' })}</small>
                      {m.permalink && (
                        <a href={m.permalink} target="_blank" rel="noreferrer" className="link-sm-inline">Ver <ExternalLink size={11} /></a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Section>
        </>
      )}
    </>
  );
}
