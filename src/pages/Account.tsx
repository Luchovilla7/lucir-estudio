import { useState, type FormEvent } from 'react';
import { Download, LogOut, Save, Trash2 } from 'lucide-react';
import { useAuth, useData } from '../lib/store';
import { download, todayISO } from '../lib/utils';
import { PageHeader, Section, useToast } from '../components/ui';

export default function Account() {
  const { user, updateName, setNewPassword, deleteAccount, logout } = useAuth();
  const { brands, pieces, sparks, hooks, clearContent } = useData();
  const toast = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [savingName, setSavingName] = useState(false);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [savingPw, setSavingPw] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [delErr, setDelErr] = useState('');
  const [deleting, setDeleting] = useState(false);

  const saveName = async (e: FormEvent) => {
    e.preventDefault();
    setSavingName(true);
    const r = await updateName(name);
    setSavingName(false);
    toast(r.error ?? 'Nombre actualizado', r.error ? 'err' : 'ok');
  };

  const savePw = async (e: FormEvent) => {
    e.preventDefault();
    setPwErr('');
    if (pw !== pw2) return setPwErr('Las contraseñas no coinciden.');
    setSavingPw(true);
    const r = await setNewPassword(pw);
    setSavingPw(false);
    if (r.error) return setPwErr(r.error);
    setPw('');
    setPw2('');
    toast('Contraseña actualizada');
  };

  const exportAll = () => {
    const payload = { app: 'lucir-estudio', exportedAt: new Date().toISOString(), account: { email: user?.email, name: user?.name }, brands, pieces, sparks, savedHooks: hooks.saved };
    download(`lucir-mis-datos-${todayISO()}.json`, JSON.stringify(payload, null, 2), 'application/json');
    toast('Descarga lista');
  };

  const wipe = () => {
    if (window.confirm('Se borrarán todas tus piezas, chispas y aperturas guardadas. Tus marcas y tu cuenta se conservan. ¿Continuar?')) {
      clearContent();
      toast('Contenido borrado');
    }
  };

  const removeAccount = async () => {
    setDelErr('');
    setDeleting(true);
    const r = await deleteAccount();
    setDeleting(false);
    if (r.error) setDelErr(r.error);
  };

  return (
    <>
      <PageHeader title="Mi cuenta" sub="Tus datos de acceso, tu información y tu privacidad." />

      <Section title="Perfil" sub="Cómo te identificamos dentro de Lucir.">
        <form className="form-grid" onSubmit={saveName}>
          <label className="field">
            <span className="label">Nombre</span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field">
            <span className="label">Correo</span>
            <input className="input" value={user?.email ?? ''} disabled />
            <small className="hint">El correo identifica tu cuenta y no se puede cambiar aquí.</small>
          </label>
          <div className="full">
            <button className="btn primary" disabled={savingName || !name.trim() || name.trim() === user?.name}>
              <Save size={15} /> {savingName ? 'Guardando…' : 'Guardar nombre'}
            </button>
          </div>
        </form>
      </Section>

      <Section title="Contraseña" sub="Usa al menos 8 caracteres.">
        <form className="form-grid" onSubmit={savePw}>
          <label className="field">
            <span className="label">Nueva contraseña</span>
            <input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
          </label>
          <label className="field">
            <span className="label">Repite la contraseña</span>
            <input className="input" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
          </label>
          {pwErr && <p className="form-err full">{pwErr}</p>}
          <div className="full">
            <button className="btn primary" disabled={savingPw || pw.length === 0}>
              {savingPw ? 'Guardando…' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </Section>

      <Section title="Mis datos" sub="Lo que guardamos de ti. Puedes llevártelo cuando quieras.">
        <div className="count-row">
          <div><b>{brands.length}</b><span>marcas</span></div>
          <div><b>{pieces.length}</b><span>piezas</span></div>
          <div><b>{sparks.length}</b><span>chispas</span></div>
          <div><b>{hooks.saved.length}</b><span>aperturas</span></div>
        </div>
        <div className="pad row-gap">
          <button className="btn ghost" onClick={exportAll}><Download size={15} /> Descargar todo (JSON)</button>
          <button className="btn ghost" onClick={logout}><LogOut size={15} /> Cerrar sesión</button>
        </div>
      </Section>

      <Section title="Zona de riesgo" sub="Estas acciones no se pueden deshacer." className="danger-zone">
        <div className="danger-row">
          <div>
            <h3>Borrar mi contenido</h3>
            <p>Elimina piezas, chispas y aperturas. Conservas tus marcas y tu cuenta.</p>
          </div>
          <button className="btn ghost danger-btn" onClick={wipe}><Trash2 size={15} /> Borrar contenido</button>
        </div>
        <div className="danger-row col">
          <div>
            <h3>Eliminar mi cuenta</h3>
            <p>Borra tu acceso y todos tus datos de forma definitiva. Escribe <b>ELIMINAR</b> para confirmar.</p>
          </div>
          <div className="row-gap">
            <input className="input mini-wide" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="ELIMINAR" aria-label="Confirmación" />
            <button className="btn danger-solid" disabled={confirmText !== 'ELIMINAR' || deleting} onClick={removeAccount}>
              {deleting ? 'Eliminando…' : 'Eliminar cuenta'}
            </button>
          </div>
          {delErr && <p className="form-err">{delErr}</p>}
        </div>
      </Section>
    </>
  );
}
