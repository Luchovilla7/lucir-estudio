import { Suspense, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import {
  Archive,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronsUpDown,
  CircleHelp,
  Feather,
  FlaskConical,
  Library,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessagesSquare,
  Moon,
  Plus,
  Sparkles,
  Store,
  Sun,
  Wand2,
  X,
  Check,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useAuth, useData } from '../lib/store';
import { useToast } from './ui';
import { clsx } from '../lib/utils';

const NAV = [
  { to: '/', label: 'Panorama', icon: LayoutDashboard, end: true },
  { to: '/inicio', label: 'Guía de inicio', icon: BookOpen },
  { to: '/taller', label: 'Taller', icon: Wand2 },
  { to: '/aperturas', label: 'Laboratorio', icon: FlaskConical },
  { to: '/biblioteca', label: 'Biblioteca', icon: Library },
  { to: '/copiloto', label: 'Copiloto IA', icon: MessagesSquare },
  { to: '/cartas', label: 'Cartas', icon: Mail },
  { to: '/chispas', label: 'Chispas', icon: Sparkles },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/archivo', label: 'Archivo', icon: Archive },
  { to: '/metricas', label: 'Métricas', icon: BarChart3 },
  { to: '/marca', label: 'Mi Marca', icon: Store },
];

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Lucir Estudio">
      <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden>
        <path d="M32 6c2.4 13 9 19.6 22 26-13 6.4-19.6 13-22 26-2.4-13-9-19.6-22-26 13-6.4 19.6-13 22-26z" fill="var(--accent)" />
      </svg>
      <span className="logo-word">
        <b>LUCIR</b>
        <small>estudio de contenido</small>
      </span>
    </Link>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { brand, brands, setActiveBrand, addBrand, deleteBrand, theme, setTheme } = useData();
  const toast = useToast();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [brandMenu, setBrandMenu] = useState(false);
  const [help, setHelp] = useState(false);
  const bmRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [loc.pathname]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (bmRef.current && !bmRef.current.contains(e.target as Node)) setBrandMenu(false);
      if (hRef.current && !hRef.current.contains(e.target as Node)) setHelp(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const current = NAV.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)));
  const pageTitle = loc.pathname.startsWith('/cuenta') ? 'Mi cuenta' : current?.label;

  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} · Lucir Estudio` : 'Lucir Estudio';
  }, [pageTitle]);
  const configured = brand.name.trim() && brand.description.trim();

  return (
    <div className="shell">
      <aside className={clsx('sidebar', open && 'open')}>
        <div className="side-top">
          <Logo />
          <button className="icon-btn only-mobile" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            <X size={18} />
          </button>
        </div>

        <div className="brand-switch" ref={bmRef}>
          <button className="brand-btn" onClick={() => setBrandMenu((v) => !v)}>
            <span className="brand-avatar" style={{ background: brand.colors[0] || 'var(--accent)' }}>
              <Feather size={14} />
            </span>
            <span className="brand-text">
              <small>Marca activa</small>
              <b>{brand.name.trim() || 'Sin configurar'}</b>
            </span>
            <ChevronsUpDown size={15} />
          </button>
          {brandMenu && (
            <div className="menu">
              {brands.map((b) => (
                <div className="menu-row" key={b.id}>
                  <button
                    className="menu-item"
                    onClick={() => {
                      setActiveBrand(b.id);
                      setBrandMenu(false);
                    }}
                  >
                    <span className="menu-check">{b.id === brand.id && <Check size={14} />}</span>
                    {b.name.trim() || 'Sin configurar'}
                  </button>
                  {brands.length > 1 && (
                    <button
                      className="icon-btn danger"
                      aria-label={`Eliminar ${b.name}`}
                      onClick={() => {
                        if (window.confirm(`¿Eliminar la marca "${b.name || 'Sin configurar'}" y todo su contenido? Esta acción no se puede deshacer.`)) {
                          deleteBrand(b.id);
                          toast('Marca eliminada');
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                className="menu-item add"
                onClick={() => {
                  const name = window.prompt('Nombre de la nueva marca');
                  if (name?.trim()) {
                    addBrand(name.trim());
                    setBrandMenu(false);
                    toast('Marca creada. Complétala en Mi Marca.');
                  }
                }}
              >
                <Plus size={14} /> Nueva marca
              </button>
            </div>
          )}
        </div>

        <nav className="nav" aria-label="Principal">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => clsx('nav-link', isActive && 'active')}>
              <n.icon size={17} />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="side-bottom" ref={hRef}>
          {help && (
            <div className="menu menu-up">
              <Link className="menu-item" to="/inicio" onClick={() => setHelp(false)}>
                Guía de inicio
              </Link>
              <Link className="menu-item" to="/cuenta" onClick={() => setHelp(false)}>
                Mi cuenta
              </Link>
              <a className="menu-item" href="mailto:hola@lucir.studio?subject=Soporte%20Lucir%20Estudio">
                Escribir a soporte
              </a>
              <button
                className="menu-item"
                onClick={() => {
                  setHelp(false);
                  toast('Atajos: Ctrl/⌘ + P imprime el banco de aperturas.');
                }}
              >
                Atajos de teclado
              </button>
            </div>
          )}
          <button className="side-help" onClick={() => setHelp((v) => !v)}>
            <CircleHelp size={16} /> Ayuda y soporte
          </button>
          <div className="user-row">
            <Link className="user-mail" to="/cuenta" title="Mi cuenta">
              <UserRound size={14} /> {user?.email}
            </Link>
            <button className="icon-btn" onClick={logout} aria-label="Cerrar sesión" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <div className="main-col">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setOpen(true)} aria-label="Abrir menú">
            <Menu size={19} />
          </button>
          <span className="crumb">{pageTitle ?? 'Lucir'}</span>
          <div className="topbar-right">
            {!configured && (
              <Link to="/marca" className="setup-pill">
                Configura tu marca
              </Link>
            )}
            <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </header>
        <main className="content">
          <Suspense fallback={<div className="boot-msg" style={{ minHeight: '40vh' }}><div className="spinner" aria-label="Cargando" /></div>}>
            <Outlet />
          </Suspense>
        </main>
        <footer className="foot">
          <span>Lucir Estudio · contenido con tu voz · <Link to="/privacidad">Privacidad</Link></span>
        </footer>
      </div>
    </div>
  );
}
