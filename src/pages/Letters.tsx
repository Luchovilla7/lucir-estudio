import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Wand2 } from 'lucide-react';
import { newPiece, useData } from '../lib/store';
import { generatePiece, EMAIL_QUESTIONS, suggestTone } from '../lib/engine';
import { TONE_LIST, TONES } from '../lib/tones';
import type { ToneId } from '../lib/types';
import { clsx } from '../lib/utils';
import { PageHeader, useToast } from '../components/ui';
import { PieceEditor } from '../components/PieceEditor';

export default function Letters() {
  const { brand, brandPieces, addPiece, updatePiece, deletePiece, duplicatePiece } = useData();
  const toast = useToast();
  const [idea, setIdea] = useState('');
  const [mode, setMode] = useState<'ia' | 'yo'>('ia');
  const [answers, setAnswers] = useState<string[]>(EMAIL_QUESTIONS.map(() => ''));
  const [toneSel, setToneSel] = useState<ToneId | 'auto'>('auto');
  const [currentId, setCurrentId] = useState<string | null>(null);

  const base = mode === 'yo' ? idea || answers[0] : idea;
  const suggested = useMemo(() => (base.trim().length >= 6 ? suggestTone(base) : null), [base]);
  const tone: ToneId = toneSel === 'auto' ? suggested ?? 'faro' : toneSel;
  const current = brandPieces.find((p) => p.id === currentId) ?? null;
  const canGen = base.trim().length >= 8;

  const generate = () => {
    if (!canGen) return;
    const gen = generatePiece({ format: 'email', idea: base, evidence: '', tone, slides: 0, seed: 0, email: { mode, answers: mode === 'yo' ? answers : [] } }, brand);
    const piece = newPiece({ brandId: brand.id, title: gen.title, format: 'email', tone, platform: 'Newsletter', blocks: gen.blocks, idea: base.trim(), seed: 0 });
    addPiece(piece);
    setCurrentId(piece.id);
    toast('Carta generada y guardada en tu Archivo');
  };

  return (
    <>
      <PageHeader title="Cartas" sub="Historia, moraleja y propuesta: una carta por día, o las que quieras." />
      <div className="workshop">
        <div className="card form-card">
          <h2>Escribe tu carta</h2>
          <p className="muted">Siempre la misma estructura: historia, moraleja y propuesta, de 300 a 500 palabras.</p>

          <label className="label mt" htmlFor="l-idea">Tu idea, anécdota o lección</label>
          <textarea id="l-idea" className="input area" rows={4} value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Ej: ayer una clienta me escribió a las 11 pm porque…" />
          <p className="hint">Una anécdota real que conecte con el problema de tu cliente. Si prefieres responder pregunta por pregunta, usa la guía de abajo.</p>

          <span className="eyebrow mt">Guía de preguntas</span>
          <div className="seg">
            <button className={clsx(mode === 'ia' && 'on')} onClick={() => setMode('ia')}>La IA responde</button>
            <button className={clsx(mode === 'yo' && 'on')} onClick={() => setMode('yo')}>Yo respondo</button>
          </div>
          {mode === 'ia' ? (
            <p className="hint">Se arma la historia, la moraleja y las 4 P (promesa, imagen, prueba y empuje) a partir de tu idea y se marca lo que debes reemplazar con datos reales. Nunca se inventa una prueba.</p>
          ) : (
            <div className="guided">
              {EMAIL_QUESTIONS.map((q, i) => (
                <label key={q} className="field">
                  <span className="label">{i + 1}. {q}</span>
                  <textarea className="input area" rows={2} value={answers[i]} onChange={(e) => setAnswers((a) => a.map((x, j) => (j === i ? e.target.value : x)))} />
                </label>
              ))}
            </div>
          )}

          <span className="eyebrow mt">Tono</span>
          <div className="chips">
            <button className={clsx('chip', toneSel === 'auto' && 'on')} onClick={() => setToneSel('auto')}>Sugerido</button>
            {TONE_LIST.map((t) => (
              <button key={t.id} className={clsx('chip', toneSel === t.id && 'on')} style={{ ['--tc' as string]: t.color }} onClick={() => setToneSel(t.id)}>
                <i /> {t.name}
              </button>
            ))}
          </div>
          <p className="hint">{toneSel === 'auto' ? (suggested ? `Sugerencia: ${TONES[suggested].name}.` : 'Escribe tu idea y te sugiero el tono.') : TONES[toneSel].tagline}</p>

          <p className="brand-line">
            {brand.name.trim() ? (
              <>Usa la configuración de <b>{brand.name}</b>. <Link to="/marca">Editar</Link></>
            ) : (
              <>Aún no configuras tu marca. <Link to="/marca">Hazlo ahora</Link>.</>
            )}
          </p>
          <button className="btn primary block" disabled={!canGen} onClick={generate}><Wand2 size={16} /> Generar</button>
          <p className="hint center">El resultado se guarda en tu cuenta.</p>
        </div>

        <div className="result">
          {current ? (
            <div className="card">
              <PieceEditor
                piece={current}
                onChange={(patch) => updatePiece(current.id, patch)}
                onDelete={() => {
                  if (window.confirm('¿Eliminar esta carta?')) {
                    deletePiece(current.id);
                    setCurrentId(null);
                  }
                }}
                onDuplicate={() => {
                  const id = duplicatePiece(current.id);
                  if (id) setCurrentId(id);
                }}
                compact
              />
            </div>
          ) : (
            <div className="placeholder">
              <div className="empty-icon"><Mail size={22} /></div>
              <h3>Tu carta aparece aquí</h3>
              <p>Escribe tu idea a la izquierda: una anécdota, una lección o un fragmento de tu oferta que genere curiosidad.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
