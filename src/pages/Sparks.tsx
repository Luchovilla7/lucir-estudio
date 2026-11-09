import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Sparkles, Trash2, Wand2, Check, Undo2 } from 'lucide-react';
import { useData } from '../lib/store';
import { generateSparks } from '../lib/engine';
import { TONE_LIST } from '../lib/tones';
import type { ToneId } from '../lib/types';
import { clsx } from '../lib/utils';
import { EmptyState, PageHeader, ToneDot, useToast } from '../components/ui';

type Filter = 'pendientes' | 'usadas' | 'todas';

export default function Sparks() {
  const { brand, brandSparks, addSparks, updateSpark, deleteSpark } = useData();
  const nav = useNavigate();
  const toast = useToast();
  const [tone, setTone] = useState<ToneId | 'all'>('all');
  const [context, setContext] = useState('');
  const [filter, setFilter] = useState<Filter>('pendientes');
  const [busy, setBusy] = useState(false);

  const generate = () => {
    setBusy(true);
    setTimeout(() => {
      const list = generateSparks(brand, tone, context, brandSparks.length);
      addSparks(list);
      setBusy(false);
      setFilter('pendientes');
      toast(`${list.length} chispas nuevas`);
    }, 450);
  };

  const pending = brandSparks.filter((s) => !s.used);
  const shown = brandSparks.filter((s) => (filter === 'todas' ? true : filter === 'usadas' ? s.used : !s.used));

  return (
    <>
      <PageHeader title="Generador de chispas" sub="Nunca más frente a la pantalla en blanco." />

      <div className="card hero-card">
        <span className="eyebrow">Generador de ideas</span>
        <h2 className="serif-lg">¿No sabes qué publicar?</h2>
        <p className="muted">Ideas estratégicas, cada una con su tono, su apertura terminada y los niveles de consciencia que activa.</p>

        <span className="eyebrow mt">Tono</span>
        <div className="tone-pick">
          <button className={clsx('tone-btn', tone === 'all' && 'on')} onClick={() => setTone('all')}>Todos los tonos</button>
          {TONE_LIST.map((t) => (
            <button key={t.id} className={clsx('tone-btn', tone === t.id && 'on')} style={{ ['--tc' as string]: t.color }} onClick={() => setTone(t.id)}>
              <i /> {t.name}
            </button>
          ))}
        </div>
        <p className="hint">{tone === 'all' ? '8 ideas: 2 por cada tono, en rotación balanceada.' : '6 ideas del tono elegido.'}</p>

        <label className="label mt" htmlFor="ctx">Contexto para esta tanda (opcional)</label>
        <textarea id="ctx" className="input area" rows={2} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Ej: esta semana varias clientas preguntaron por precios…" />
        <p className="hint">Una objeción que escuchaste, un resultado reciente, un lanzamiento, algo del sector con lo que no estás de acuerdo.</p>
        <button className="btn primary" onClick={generate} disabled={busy}><Sparkles size={15} /> {busy ? 'Generando…' : 'Generar chispas'}</button>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h2>Banco de chispas</h2>
            <p>{pending.length} pendientes de escribir · {brandSparks.length} en total</p>
          </div>
          <div className="seg">
            {(['pendientes', 'usadas', 'todas'] as Filter[]).map((f) => (
              <button key={f} className={clsx(filter === f && 'on')} onClick={() => setFilter(f)}>
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {shown.length === 0 ? (
          <EmptyState icon={<Lightbulb size={20} />} title={brandSparks.length ? 'Nada en esta vista' : 'Tu banco está vacío'} text={brandSparks.length ? 'Cambia el filtro para ver otras chispas.' : 'Genera tu primera tanda de ideas.'} />
        ) : (
          <div className="spark-grid">
            {shown.map((s) => (
              <article key={s.id} className={clsx('spark', s.used && 'used')}>
                <div className="spark-top">
                  <ToneDot tone={s.tone} />
                  {s.used && <span className="badge">Usada</span>}
                </div>
                <h3>{s.title}</h3>
                <p className="spark-hook">“{s.hook}”</p>
                <div className="levels">
                  {s.levels.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
                <div className="spark-foot">
                  <button className="btn primary xs" onClick={() => nav('/taller', { state: { idea: s.title, tone: s.tone, sparkId: s.id } })}><Wand2 size={12} /> Escribir</button>
                  <button className="btn ghost xs" onClick={() => updateSpark(s.id, { used: !s.used })}>
                    {s.used ? <><Undo2 size={12} /> Reabrir</> : <><Check size={12} /> Marcar usada</>}
                  </button>
                  <button className="icon-btn sm danger" aria-label="Eliminar" onClick={() => deleteSpark(s.id)}><Trash2 size={14} /></button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
