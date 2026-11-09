import type { Variant } from './types';

export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;

export const clsx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ');

export const pad = (n: number) => String(n).padStart(2, '0');

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const todayISO = () => toISO(new Date());

export function fromISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function fmtDate(iso?: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) {
  if (!iso) return '';
  return fromISO(iso.slice(0, 10)).toLocaleDateString('es', opts);
}

/** Matriz de semanas (lunes a domingo) para un mes. */
export function monthMatrix(year: number, month: number): { date: Date; inMonth: boolean }[][] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);
  const weeks: { date: Date; inMonth: boolean }[][] = [];
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
      row.push({ date, inMonth: date.getMonth() === month });
    }
    weeks.push(row);
  }
  // Quita la última semana si está completamente fuera del mes
  if (!weeks[5].some((c) => c.inMonth)) weeks.pop();
  return weeks;
}

export function wordCount(s: string): number {
  return (s.trim().match(/\S+/g) || []).length;
}

export function countPlaceholders(s: string): number {
  return (s.match(/\[[^\]]+\]/g) || []).length;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function download(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function readableOn(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0');
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.58 ? '#1a1613' : '#fbf6ee';
}

export function isHex(s: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s.trim());
}

const VOSEO: [RegExp, string][] = [
  [/\btienes\b/g, 'tenés'],
  [/\bpuedes\b/g, 'podés'],
  [/\bquieres\b/g, 'querés'],
  [/\bsabes\b/g, 'sabés'],
  [/\beres\b/g, 'sos'],
  [/\bllevas\b/g, 'llevás'],
  [/\bhaces\b/g, 'hacés'],
  [/\bsigues\b/g, 'seguís'],
  [/\bsientes\b/g, 'sentís'],
  [/\bprueba esto\b/gi, 'probá esto'],
  [/\bescríbeme\b/g, 'escribime'],
  [/\bcuéntame\b/g, 'contame'],
  [/\bmira\b/g, 'mirá'],
  [/\bpega\b/g, 'pegá'],
  [/\btu cliente\b/g, 'tu cliente'],
];

/** Adaptación ligera de variante regional. El texto base es español neutro con tuteo. */
export function localize(text: string, variant: Variant): string {
  if (variant !== 'argentino') return text;
  return VOSEO.reduce((acc, [re, rep]) => acc.replace(re, rep), text);
}

export function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export async function sha256(text: string): Promise<string> {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return btoa(unescape(encodeURIComponent(text)));
  }
}

export function csvEscape(v: string | number): string {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
