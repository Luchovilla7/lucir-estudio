import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Download, History, ListChecks, PenLine, Play, Printer, RotateCcw, Search, Star, Upload } from 'lucide-react';
import { useData } from '../lib/store';
import { ALL_HOOKS, extractPlaceholders, HOOK_GROUPS, HOOK_COUNT, NICHE_LABEL, type HookGroup } from '../lib/hooksData';
import { TONE_LIST, TONES } from '../lib/tones';
import type { Niche, SavedHook } from '../lib/types';
import { clsx, copyText, download, localize } from '../lib/utils';
import { EmptyState, Highlight, Modal, PageHeader, useToast } from '../components/ui';

type View = 'grupos' | 'completo' | 'mis';
const NICHES: (Niche | 'todos')[] = ['todos', 'universal', 'negocios', 'coaches', 'terapia'];

export default function HookLab() {
  const { hooks, brand, saveHook, removeHook, setHookCursor, resetHooks, importHooks } = useData();
  const toast = useToast();
  const [view, setView] = useState<View>('grupos');
  const [niche, setNiche] = useState<Niche | 'todos'>('todos');
  const [q, setQ] = useState('');
  const [exercise, setExercise] = useState<{ group: HookGroup; template: string } | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const matches = (text: string, niches: Niche[]) => {
    const okN = niche === 'todos' || niches.includes(niche);
    const okQ = !q.trim() || text.toLowerCase().includes(q.trim().toLowerCase());
    return okN && okQ;
  };

  const groups = useMemo(
    () =>
      TONE_LIST.map((t) => ({
        tone: t,
        groups: HOOK_GROUPS.filter((g) => g.tone === t.id)
          .map((g) => ({ g, hooks: g.hooks.filter((h) => matches(h.text, h.niches)) }))
          .filter((x) => x.hooks.length > 0),
      })).filter((t) => t.groups.length > 0),
    [niche, q], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const flat = useMemo(() => ALL_HOOKS.filter((x) => matches(x.hook.text, x.hook.niches)), [niche, q]); // eslint-disable-line react-hooks/exhaustive-deps
  const mine = hooks.saved;
  const favSet = new Set(hooks.saved.filter((s) => s.kind === 'fav').map((s) => s.template));
  const v = (s: string) => localize(s, brand.variant);

  const copy = async (text: string, msg = 'Copiado') => toast((await copyText(text)) ? msg : 'No se pudo copiar', 'ok');

  const toggleFav = (g: HookGroup, template: string) => {
    const existing = hooks.saved.find((s) => s.kind === 'fav' && s.template === template);
    if (existing) {
      removeHook(existing.id);
      toast('Quitado de favoritos');
    } else {
      saveHook({ kind: 'fav', groupId: g.id, template, text: template });
      setHookCursor(g.id);
      toast('Guardado en Mis aperturas');
    }
  };

  const resume = () => {
    const id = hooks.lastGroupId;
    if (!id) return toast('Aún no has trabajado ninguna apertura.');
    setView('grupos');
    setNiche('todos');
    setQ('');
    setTimeout(() => {
      document.getElementById(`g-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setFlash(id);
      setTimeout(() => setFlash(null), 1800);
    }, 60);
  };

  const backup = () => {
    download('lucir-aperturas.json', JSON.stringify({ app: 'lucir-estudio', kind: 'aperturas', version: 1, saved: hooks.saved }, null, 2), 'application/json');
    toast('Respaldo descargado');
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const list: SavedHook[] = Array.isArray(parsed) ? parsed : parsed.saved;
      if (!Array.isArray(list)) throw new Error('formato');
      const n = importHooks(list);
      toast(n ? `${n} apertura${n === 1 ? '' : 's'} importada${n === 1 ? '' : 's'}` : 'No había aperturas nuevas');
    } catch {
      toast('El archivo no tiene un formato válido', 'err');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const reset = () => {
    if (window.confirm('Se borrarán tus aperturas guardadas y tu progreso. ¿Continuar?')) {
      resetHooks();
      toast('Laboratorio reiniciado');
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') setView((cur) => (cur === 'grupos' ? 'completo' : cur));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <PageHeader title="Laboratorio de aperturas" sub={`Un banco de ${HOOK_COUNT} moldes para adaptar con tu información real.`} />

      <div className="toolbar no-print">
        <button className="btn ghost sm" onClick={() => setView('mis')}><Star size={14} /> Ver mis aperturas</button>
        <button className="btn ghost sm" onClick={resume}><Play size={14} /> Seguir donde lo dejé</button>
        <span className="grow" />
        <button className="btn ghost sm" onClick={backup}><Download size={14} /> Respaldo</button>
        <button className="btn ghost sm" onClick={() => fileRef.current?.click()}><Upload size={14} /> Importar</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => onImport(e.target.files?.[0])} />
        <button className="btn ghost sm" onClick={reset}><RotateCcw size={14} /> Reiniciar</button>
      </div>

      <div className="callout-box no-print">
        <span className="eyebrow">Cómo usar este banco</span>
        <p>Cada apertura está escrita como plantilla. Lo que va entre corchetes lo rellenas con información real de tu negocio o de tu cliente. No las uses tal cual: adáptalas.</p>
        <p><b>Molde:</b> “Si llevas [tiempo] haciendo [acción] y sigues sin [resultado], el problema no es [lo obvio].”</p>
        <p><b>Adaptado:</b> “Si llevas 6 meses publicando a diario y sigues sin clientes, el problema no es que tengas pocos seguidores.”</p>
      </div>

      <div className="searchbar no-print">
        <Search size={16} />
        <input placeholder={`Buscar entre las ${HOOK_COUNT} aperturas: “objeción”, “manifiesto”, “no negociable”…`} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="filters no-print">
        <span className="eyebrow">Filtrar por nicho</span>
        <div className="chips">
          {NICHES.map((n) => (
            <button key={n} className={clsx('chip', niche === n && 'on')} onClick={() => setNiche(n)}>
              {n === 'todos' ? 'Todos' : NICHE_LABEL[n]}
            </button>
          ))}
        </div>
        <div className="seg">
          <button className={clsx(view === 'grupos' && 'on')} onClick={() => setView('grupos')}><ListChecks size={14} /> Por tipo</button>
          <button className={clsx(view === 'completo' && 'on')} onClick={() => setView('completo')}><History size={14} /> Banco completo</button>
          <button className={clsx(view === 'mis' && 'on')} onClick={() => setView('mis')}>Mis aperturas · {mine.length}</button>
        </div>
      </div>

      {view === 'grupos' && (
        <>
          {groups.length === 0 && <EmptyState icon={<Search size={20} />} title="Sin resultados" text="Prueba con otra palabra o cambia el nicho." />}
          {groups.map(({ tone, groups: gs }) => (
            <section key={tone.id} className="tone-section" style={{ ['--tc' as string]: tone.color }}>
              <div className="tone-section-head">
                <h2><i /> Tono {tone.name}</h2>
                <p>{tone.tagline}</p>
              </div>
              {gs.map(({ g, hooks: hs }, gi) => (
                <article key={g.id} id={`g-${g.id}`} className={clsx('card hook-group', flash === g.id && 'flash')}>
                  <div className="hg-head">
                    <span className="hg-n">{String(HOOK_GROUPS.indexOf(g) + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{g.title}</h3>
                      <p>{g.intent}</p>
                    </div>
                  </div>
                  <ol className="hook-list">
                    {hs.map((h) => (
                      <li key={h.text}>
                        <p><Highlight text={v(h.text)} /></p>
                        <div className="hook-foot">
                          <small>{h.niches.map((n) => NICHE_LABEL[n]).join(' · ')}</small>
                          <div className="row-gap">
                            <button className="btn ghost xs" onClick={() => copy(v(h.text))}><Copy size={12} /> Copiar</button>
                            <button className="btn ghost xs" onClick={() => { setExercise({ group: g, template: h.text }); setHookCursor(g.id); }}><PenLine size={12} /> Escribir mi versión</button>
                            <button className={clsx('icon-btn sm', favSet.has(h.text) && 'is-on')} aria-label="Favorita" onClick={() => toggleFav(g, h.text)}>
                              <Star size={14} fill={favSet.has(h.text) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="tip">
                    <span className="eyebrow">Tip para este tipo</span>
                    <p>{g.tip}</p>
                  </div>
                  <div className="row-gap">
                    <button className="btn ghost sm" onClick={() => { setExercise({ group: g, template: g.hooks[0].text }); setHookCursor(g.id); }}><PenLine size={14} /> Hacer el ejercicio</button>
                    <button className="btn ghost sm" onClick={() => copy(g.hooks.map((x, i) => `${i + 1}. ${v(x.text)}`).join('\n'), `Copiadas las ${g.hooks.length} aperturas`)}><Copy size={14} /> Copiar las {g.hooks.length}</button>
                  </div>
                  {gi < 0 && null}
                </article>
              ))}
            </section>
          ))}
        </>
      )}

      {view === 'completo' && (
        <div className="card print-area">
          <div className="card-head">
            <div>
              <h2>Banco completo</h2>
              <p>Las {flat.length} aperturas de corrido. Usa Ctrl/⌘ + P para llevarlo a papel.</p>
            </div>
            <button className="btn ghost sm no-print" onClick={() => window.print()}><Printer size={14} /> Imprimir</button>
          </div>
          <ol className="flat-list">
            {flat.map((x, i) => (
              <li key={`${x.group.id}-${x.idx}`}>
                <span className="flat-n">{i + 1}</span>
                <div>
                  <p><Highlight text={v(x.hook.text)} /></p>
                  <small>{TONES[x.group.tone].name} · {x.group.title} · {x.hook.niches.map((n) => NICHE_LABEL[n]).join(', ')}</small>
                </div>
                <button className="icon-btn sm no-print" aria-label="Copiar" onClick={() => copy(v(x.hook.text))}><Copy size={14} /></button>
              </li>
            ))}
          </ol>
          {flat.length === 0 && <p className="muted pad">Sin resultados con ese filtro.</p>}
        </div>
      )}

      {view === 'mis' && (
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Mis aperturas</h2>
              <p>Las versiones que escribiste con tus datos, más los moldes que marcaste como favoritos.</p>
            </div>
            {mine.length > 0 && (
              <button className="btn ghost sm" onClick={() => copy(mine.map((m) => m.text).join('\n\n'), 'Todo copiado')}><Copy size={14} /> Copiar todo</button>
            )}
          </div>
          <p className="muted small pad-x">{mine.length} guardadas · se guardan en tu cuenta</p>
          {mine.length === 0 ? (
            <EmptyState icon={<Star size={20} />} title="Todavía no has guardado nada" text="Abre cualquier plantilla, toca “Escribir mi versión” y reescribe un molde con tus datos. También puedes marcar favoritas con la estrella." />
          ) : (
            <ul className="saved-list">
              {mine.map((m) => (
                <li key={m.id}>
                  <div>
                    <span className={clsx('badge', m.kind === 'mine' && 'mine')}>{m.kind === 'mine' ? 'Mi versión' : 'Favorita'}</span>
                    <p><Highlight text={m.text} /></p>
                  </div>
                  <div className="row-gap">
                    <button className="icon-btn sm" aria-label="Copiar" onClick={() => copy(m.text)}><Copy size={14} /></button>
                    <button className="btn ghost xs" onClick={() => removeHook(m.id)}>Quitar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Exercise
        data={exercise}
        onClose={() => setExercise(null)}
        onSave={(text, g, tpl) => {
          saveHook({ kind: 'mine', groupId: g.id, template: tpl, text });
          toast('Guardada en Mis aperturas');
          setExercise(null);
        }}
        variantFn={v}
      />
    </>
  );
}

function Exercise({
  data,
  onClose,
  onSave,
  variantFn,
}: {
  data: { group: HookGroup; template: string } | null;
  onClose: () => void;
  onSave: (text: string, g: HookGroup, tpl: string) => void;
  variantFn: (s: string) => string;
}) {
  const [tpl, setTpl] = useState('');
  const [vals, setVals] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setTpl(data.template);
      setVals(extractPlaceholders(data.template).map(() => ''));
    }
  }, [data]);

  if (!data) return null;
  const holders = extractPlaceholders(tpl);
  let i = -1;
  const result = variantFn(tpl).replace(/\[[^\]]+\]/g, () => {
    i++;
    return vals[i]?.trim() ? vals[i].trim() : `[${holders[i] ?? ''}]`;
  });
  const filled = vals.filter((x) => x.trim()).length;

  return (
    <Modal
      open
      wide
      onClose={onClose}
      title={`Escribir mi versión · ${data.group.title}`}
      footer={
        <>
          <button className="btn ghost" onClick={async () => toast((await copyText(result)) ? 'Copiado' : 'No se pudo copiar')}><Copy size={14} /> Copiar</button>
          <button className="btn primary" onClick={() => onSave(result, data.group, tpl)}>Guardar mi versión</button>
        </>
      }
    >
      <label className="label">Molde</label>
      <div className="chips">
        {data.group.hooks.map((h, idx) => (
          <button
            key={idx}
            className={clsx('chip', tpl === h.text && 'on')}
            onClick={() => {
              setTpl(h.text);
              setVals(extractPlaceholders(h.text).map(() => ''));
            }}
          >
            Opción {idx + 1}
          </button>
        ))}
      </div>
      <p className="template"><Highlight text={variantFn(tpl)} /></p>
      <label className="label mt">Rellena los campos ({filled}/{holders.length})</label>
      <div className="ex-fields">
        {holders.map((h, idx) => (
          <input key={`${tpl}-${idx}`} className="input" placeholder={h} value={vals[idx] ?? ''} onChange={(e) => setVals((cur) => cur.map((x, j) => (j === idx ? e.target.value : x)))} />
        ))}
      </div>
      <label className="label mt">Vista previa</label>
      <p className="preview"><Highlight text={result} /></p>
    </Modal>
  );
}
