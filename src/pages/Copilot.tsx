import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Send, Wand2, RotateCcw } from 'lucide-react';
import { useData } from '../lib/store';
import { copilotReply, copilotWelcome, hookVariants } from '../lib/engine';
import { AWARENESS } from '../lib/tones';
import type { Format, ToneId } from '../lib/types';
import { clsx } from '../lib/utils';
import { PageHeader, useToast } from '../components/ui';

interface Msg {
  id: number;
  role: 'user' | 'ai';
  text: string;
  idea?: string;
  tone?: ToneId;
  format?: Format;
  saved?: boolean;
}

const STARTERS = [
  'Una clienta me dijo que no sabe por dónde empezar a vender',
  'No estoy de acuerdo con que haya que publicar todos los días',
  'Quiero contar el caso de una cliente que duplicó su agenda',
];

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : <span key={i}>{p}</span>));
}

export default function Copilot() {
  const { brand, addSparks } = useData();
  const nav = useNavigate();
  const toast = useToast();
  const [msgs, setMsgs] = useState<Msg[]>(() => [{ id: 0, role: 'ai', text: copilotWelcome(brand) }]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, thinking]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || thinking) return;
    const userMsg: Msg = { id: idRef.current++, role: 'user', text: t };
    const history = [...msgs, userMsg].map((m) => ({ role: m.role, idea: m.idea }));
    setMsgs((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const r = copilotReply(t, brand, history);
      setMsgs((m) => [...m, { id: idRef.current++, role: 'ai', text: r.text, idea: r.idea, tone: r.tone, format: r.format }]);
      setThinking(false);
    }, 650);
  };

  const save = (m: Msg) => {
    if (!m.idea || !m.tone) return;
    const hook = hookVariants(m.tone, m.idea, brand, 0)[0];
    addSparks([{ tone: m.tone, title: m.idea.length > 90 ? `${m.idea.slice(0, 89)}…` : m.idea, hook, levels: [AWARENESS[1], AWARENESS[2]] }]);
    setMsgs((list) => list.map((x) => (x.id === m.id ? { ...x, saved: true } : x)));
    toast('Guardada en Chispas');
  };

  const reset = () => {
    if (msgs.length > 1 && !window.confirm('La conversación no se guarda al salir. ¿Empezar una nueva?')) return;
    setMsgs([{ id: 0, role: 'ai', text: copilotWelcome(brand) }]);
  };

  return (
    <>
      <PageHeader
        title="Copiloto de contenido"
        sub="Conversa tu idea y sal con la pieza lista."
        actions={<button className="btn ghost sm" onClick={reset}><RotateCcw size={14} /> Nueva conversación</button>}
      />
      <div className="chat">
        <div className="chat-scroll" role="log" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={clsx('bubble', m.role)}>
              <div className="bubble-text">
                {m.text.split('\n').map((line, i) => (
                  <p key={i}>{line ? renderInline(line) : ' '}</p>
                ))}
              </div>
              {m.role === 'ai' && m.idea && (
                <div className="bubble-actions">
                  <button className="btn ghost xs" disabled={m.saved} onClick={() => save(m)}><Bookmark size={12} /> {m.saved ? 'Guardada' : 'Guardar'}</button>
                  <button className="btn ghost xs" onClick={() => nav('/taller', { state: { idea: m.idea, tone: m.tone, format: m.format } })}><Wand2 size={12} /> Usar en contenido</button>
                </div>
              )}
            </div>
          ))}
          {thinking && (
            <div className="bubble ai">
              <div className="typing"><i /><i /><i /></div>
            </div>
          )}
          {msgs.length === 1 && (
            <div className="starters">
              {STARTERS.map((s) => (
                <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>
        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <textarea
            rows={2}
            value={input}
            placeholder="Escribe tu idea o tu respuesta…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <button className="btn primary" disabled={!input.trim() || thinking} aria-label="Enviar"><Send size={16} /></button>
        </form>
        <p className="hint center">La conversación no se guarda al salir de esta pantalla. Usa “Guardar” o “Usar en contenido” en cada respuesta para conservarla.</p>
      </div>
    </>
  );
}
