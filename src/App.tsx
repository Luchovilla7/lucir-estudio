import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth, DataProvider } from './lib/store';
import Layout from './components/Layout';
import { LoginPage, RegisterPage, RecoverPage } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Guide from './pages/Guide';
import Workshop from './pages/Workshop';
import HookLab from './pages/HookLab';
import Copilot from './pages/Copilot';
import Letters from './pages/Letters';
import Sparks from './pages/Sparks';
import Agenda from './pages/Agenda';
import Archive from './pages/Archive';
import Brand from './pages/Brand';
import { hasSupabase } from './lib/supabase';

function Protected() {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <div className="boot" />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return (
    <DataProvider user={user}>
      <Layout />
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
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
