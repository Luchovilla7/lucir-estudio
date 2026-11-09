import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { clsx } from '../lib/utils';
import { TONES } from '../lib/tones';
import type { ToneId } from '../lib/types';

/* ───────────── toasts ───────────── */

interface ToastItem {
  id: number;
  msg: string;
  kind: 'ok' | 'err';
}
const ToastCtx = createContext<(msg: string, kind?: 'ok' | 'err') => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const n = useRef(0);
  const push = useCallback((msg: string, kind: 'ok' | 'err' = 'ok') => {
    const id = ++n.current;
    setItems((l) => [...l, { id, msg, kind }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={clsx('toast', t.kind === 'err' && 'toast-err')}>
            {t.kind === 'ok' && <Check size={15} />}
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ───────────── modal ───────────── */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  wide?: boolean;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={clsx('modal', wide && 'modal-wide')} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ───────────── piezas pequeñas ───────────── */

export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function ToneDot({ tone, label = true }: { tone: ToneId; label?: boolean }) {
  const t = TONES[tone];
  return (
    <span className="tone-tag" style={{ ['--tc' as string]: t.color }}>
      <i />
      {label && t.name}
    </span>
  );
}

export function Section({ title, sub, actions, children, className }: { title: string; sub?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={clsx('card', className)}>
      <div className="card-head">
        <div>
          <h2>{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState('');
  const add = (raw: string) => {
    const parts = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !values.some((v) => v.toLowerCase() === s.toLowerCase()));
    if (parts.length) onChange([...values, ...parts]);
    setText('');
  };
  return (
    <div className="tags">
      {values.map((v) => (
        <span className="tag" key={v}>
          {v}
          <button type="button" aria-label={`Quitar ${v}`} onClick={() => onChange(values.filter((x) => x !== v))}>
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          if (e.target.value.includes(',')) add(e.target.value);
          else setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add(text);
          } else if (e.key === 'Backspace' && !text && values.length) onChange(values.slice(0, -1));
        }}
        onBlur={() => text.trim() && add(text)}
      />
    </div>
  );
}

export function AutoTextarea({
  value,
  onChange,
  className,
  placeholder,
  min = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  min?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return <textarea ref={ref} rows={min} className={className} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

/** Resalta los [campos por completar] dentro de un texto. */
export function Highlight({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) => (p.startsWith('[') && p.endsWith(']') ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>))}
    </>
  );
}
