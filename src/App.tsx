import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth, DataProvider } from './lib/store';
import { hasSupabase } from './lib/supabase';
import Layout from './components/Layout';
import { LoginPage, RegisterPage, RecoverPage } from './pages/Auth';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Guide = lazy(() => import('./pages/Guide'));
const Workshop = lazy(() => import('./pages/Workshop'));
const HookLab = lazy(() => import('./pages/HookLab'));
const Copilot = lazy(() => import('./pages/Copilot'));
const Letters = lazy(() => import('./pages/Letters'));
const Sparks = lazy(() => import('./pages/Sparks'));
const Agenda = lazy(() => import('./pages/Agenda'));
const Archive = lazy(() => import('./pages/Archive'));
const Brand = lazy(() => import('./pages/Brand'));
const Account = lazy(() => import('./pages/Account'));

/** Evita la pantalla en blanco si algo falla al renderizar una sección. */
class ErrorBoundary extends Component<{ children: ReactNode; resetKey: string }, { error: Error | null; key: string }> {
  state = { error: null as Error | null, key: this.props.resetKey };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  static getDerivedStateFromProps(props: { resetKey: string }, state: { error: Error | null; key: string }) {
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error de interfaz:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="boot-msg" style={{ minHeight: '50vh' }}>
          <h2>Algo salió mal en esta sección</h2>
          <p>Tus datos están a salvo. Recarga la página o vuelve al Panorama.</p>
          <div className="row-gap">
            <button className="btn primary" onClick={() => window.location.reload()}>Recargar</button>
            <a className="btn ghost" href="/">Ir al Panorama</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Loading = () => (
  <div className="boot-msg" style={{ minHeight: '40vh' }}>
    <div className="spinner" aria-label="Cargando" />
  </div>
);

function Protected() {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return (
    <DataProvider user={user}>
      <ErrorBoundary resetKey={loc.pathname}>
        <Suspense fallback={<Loading />}>
          <Layout />
        </Suspense>
      </ErrorBoundary>
    </DataProvider>
  );
}

export default function App() {
  if (!hasSupabase) {
    return (
      <div className="boot-msg">
        <h2>Falta configurar Supabase</h2>
        <p>Define VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY (ver .env.example) y reinicia.</p>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/recuperar" element={<RecoverPage />} />
      <Route element={<Protected />}>
        <Route index element={<Dashboard />} />
        <Route path="inicio" element={<Guide />} />
        <Route path="taller" element={<Workshop />} />
        <Route path="aperturas" element={<HookLab />} />
        <Route path="copiloto" element={<Copilot />} />
        <Route path="cartas" element={<Letters />} />
        <Route path="chispas" element={<Sparks />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="archivo" element={<Archive />} />
        <Route path="marca" element={<Brand />} />
        <Route path="cuenta" element={<Account />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
