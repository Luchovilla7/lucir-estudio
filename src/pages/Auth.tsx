import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/store';
import { Logo } from '../components/Layout';

function Shell({ title, sub, children, foot }: { title: string; sub: string; children: ReactNode; foot: ReactNode }) {
  return (
    <div className="auth">
      <div className="auth-art" aria-hidden>
        <div className="auth-art-in">
          <Logo />
          <h2>Tu voz, con estructura.</h2>
          <p>Convierte una idea suelta en una pieza lista para publicar: carruseles, stories, reels, posts y cartas con el tono de tu marca.</p>
          <ul>
            <li>Cuatro tonos narrativos para no repetirte.</li>
            <li>Banco de aperturas que se adapta a tu negocio.</li>
            <li>Agenda y archivo para publicar sin improvisar.</li>
          </ul>
        </div>
      </div>
      <div className="auth-form">
        <div className="auth-card">
          <div className="only-mobile logo-center"><Logo /></div>
          <h1>{title}</h1>
          <p className="auth-sub">{sub}</p>
          {children}
          <div className="auth-foot">{foot}</div>
          <div className="auth-legal"><Link to="/privacidad">Privacidad</Link></div>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ value, onChange, label = 'Contraseña', auto = 'current-password' }: { value: string; onChange: (v: string) => void; label?: string; auto?: string }) {
  const [show, setShow] = useState(false);
  return (
    <label className="field">
      <span className="label">{label}</span>
      <div className="pw">
        <input className="input" type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={auto} required />
        <button type="button" className="icon-btn" onClick={() => setShow((s) => !s)} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}

export function LoginPage() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await login(email, pw);
    setBusy(false);
    if (r.error) setErr(r.error);
    else nav((loc.state as { from?: string } | null)?.from || '/', { replace: true });
  };

  return (
    <Shell
      title="Bienvenida de vuelta"
      sub="Entra para seguir con tu contenido."
      foot={
        <>
          ¿Aún no tienes cuenta? <Link to="/registro">Crea la tuya</Link>
        </>
      }
    >
      <form onSubmit={submit} className="auth-fields">
        <label className="field">
          <span className="label">Correo</span>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <PasswordField value={pw} onChange={setPw} />
        {err && <p className="form-err">{err}</p>}
        <button className="btn primary block" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
        <Link className="link-sm" to="/recuperar">
          Olvidé mi contraseña
        </Link>
      </form>
    </Shell>
  );
}

export function RegisterPage() {
  const { user, register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const r = await register(name, email, pw, brand);
    setBusy(false);
    if (r.error) setErr(r.error);
    else if (r.needsConfirm) setConfirm(true);
    else nav('/inicio', { replace: true });
  };

  if (confirm) {
    return (
      <Shell title="Revisa tu correo" sub={`Te enviamos un enlace de confirmación a ${email}.`} foot={<Link to="/login">Ir a entrar</Link>}>
        <p className="hint">Abre el enlace del mensaje para activar tu cuenta y luego entra con tu correo y contraseña. Si no lo ves, revisa la carpeta de spam.</p>
      </Shell>
    );
  }

  return (
    <Shell
      title="Crea tu cuenta"
      sub="Empieza a ordenar tu contenido en minutos."
      foot={
        <>
          ¿Ya tienes cuenta? <Link to="/login">Entra aquí</Link>
        </>
      }
    >
      <form onSubmit={submit} className="auth-fields">
        <label className="field">
          <span className="label">Tu nombre</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>
        <label className="field">
          <span className="label">Nombre de tu marca o negocio</span>
          <input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </label>
        <label className="field">
          <span className="label">Correo</span>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <PasswordField value={pw} onChange={setPw} label="Contraseña (mínimo 8 caracteres)" auto="new-password" />
        {err && <p className="form-err">{err}</p>}
        <button className="btn primary block" disabled={busy}>
          {busy ? 'Creando…' : 'Crear cuenta'}
        </button>
      </form>
    </Shell>
  );
}

export function RecoverPage() {
  const { sendRecovery, setNewPassword, recovering, user } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [step, setStep] = useState<'email' | 'sent' | 'done'>('email');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const r = await sendRecovery(email);
    setBusy(false);
    if (r.error) setErr(r.error);
    else setStep('sent');
  };
  const reset = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const r = await setNewPassword(pw);
    setBusy(false);
    if (r.error) setErr(r.error);
    else setStep('done');
  };

  const resetting = recovering && !!user && step !== 'done';

  return (
    <Shell
      title={resetting ? 'Elige tu nueva contraseña' : 'Recupera tu acceso'}
      sub={step === 'done' ? 'Listo. Tu contraseña se actualizó.' : resetting ? 'Escribe una contraseña nueva para tu cuenta.' : 'Te enviaremos un enlace para crear una contraseña nueva.'}
      foot={<Link to={user ? '/' : '/login'}>{user ? 'Ir a la app' : 'Volver a entrar'}</Link>}
    >
      {step === 'done' && <Link className="btn primary block" to="/">Entrar a la app</Link>}
      {step !== 'done' && resetting && (
        <form onSubmit={reset} className="auth-fields">
          <PasswordField value={pw} onChange={setPw} label="Nueva contraseña (mínimo 8 caracteres)" auto="new-password" />
          {err && <p className="form-err">{err}</p>}
          <button className="btn primary block" disabled={busy}>{busy ? 'Guardando…' : 'Guardar contraseña'}</button>
        </form>
      )}
      {step === 'email' && !resetting && (
        <form onSubmit={send} className="auth-fields">
          <label className="field">
            <span className="label">Correo de tu cuenta</span>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </label>
          {err && <p className="form-err">{err}</p>}
          <button className="btn primary block" disabled={busy}>{busy ? 'Enviando…' : 'Enviar enlace'}</button>
        </form>
      )}
      {step === 'sent' && !resetting && <p className="hint">Si existe una cuenta con {email}, recibirás un correo con el enlace en unos minutos. Revisa también el spam.</p>}
    </Shell>
  );
}
