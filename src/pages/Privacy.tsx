import { Link } from 'react-router-dom';
import { Logo } from '../components/Layout';

const CONTACT = 'hola@lucir.studio';

/**
 * BORRADOR de política de privacidad. Revísala con un profesional y ajusta el correo de contacto
 * y los datos de tu empresa antes de publicar la app o enviarla a revisión de Meta.
 */
export default function Privacy() {
  return (
    <div className="legal">
      <header className="legal-head">
        <Logo />
        <Link to="/login" className="btn ghost sm">Entrar</Link>
      </header>
      <article className="legal-body">
        <h1>Política de privacidad</h1>
        <p className="muted">Última actualización: noviembre de 2026 · Borrador sujeto a revisión.</p>

        <h2>Quiénes somos</h2>
        <p>Lucir Estudio es una aplicación para crear, organizar y medir contenido para redes sociales. Puedes escribirnos a <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>

        <h2>Qué datos tratamos</h2>
        <ul>
          <li><b>Cuenta:</b> nombre, correo electrónico y contraseña (la contraseña se guarda cifrada por nuestro proveedor de autenticación).</li>
          <li><b>Tu contenido:</b> marcas, piezas, ideas, aperturas guardadas y los ajustes que configuras en la app.</li>
          <li><b>Datos de Instagram (solo si conectas tu cuenta):</b> nombre de usuario, foto de perfil, tipo de cuenta, número de seguidores, tus publicaciones recientes (texto, enlace, fecha, imagen de vista previa) y sus métricas (alcance, visualizaciones, me gusta, comentarios, guardados y compartidos), además de métricas agregadas de tu cuenta de los últimos 30 días.</li>
        </ul>

        <h2 id="datos-instagram">Datos de Instagram</h2>
        <p>La conexión es opcional y de solo lectura. Autorizas el acceso en la ventana oficial de Instagram, donde nunca compartimos ni vemos tu contraseña. Usamos el permiso únicamente para mostrarte tus métricas dentro de la app.</p>
        <p><b>No</b> publicamos contenido, no comentamos, no enviamos mensajes ni leemos tus mensajes privados. No vendemos tus datos ni los usamos para publicidad.</p>
        <p>El acceso se guarda como una credencial cifrada que solo nuestro servidor puede usar. Puedes <b>desconectar tu cuenta</b> en cualquier momento desde la sección <Link to="/metricas">Métricas</Link>: al hacerlo borramos la conexión y las métricas de Instagram guardadas. También puedes quitar la aplicación desde la configuración de Instagram; cuando lo haces, Instagram nos avisa y eliminamos esos datos.</p>

        <h2>Para qué usamos los datos</h2>
        <ul>
          <li>Prestarte el servicio: guardar tu contenido y mostrarte tus métricas.</li>
          <li>Seguridad, prevención de abusos y soporte.</li>
          <li>Mejorar la app a partir de uso agregado.</li>
        </ul>

        <h2>Con quién los compartimos</h2>
        <p>Usamos proveedores que tratan datos en nuestro nombre: alojamiento de la aplicación y base de datos, autenticación y, cuando esté activa, generación de texto con inteligencia artificial. Si usas la generación con IA, el texto de tu marca y de tu idea se envía al proveedor para producir el resultado. Tampoco vendemos tus datos a terceros.</p>

        <h2>Cuánto tiempo los conservamos</h2>
        <p>Mientras tengas tu cuenta. Si la eliminas desde <Link to="/cuenta">Mi cuenta</Link>, borramos tus datos. Los respaldos pueden conservarse por un periodo breve antes de eliminarse.</p>

        <h2 id="eliminar-datos">Tus derechos y cómo eliminar tus datos</h2>
        <p>Puedes acceder a tus datos, descargarlos, corregirlos o eliminarlos. En <Link to="/cuenta">Mi cuenta</Link> puedes descargar todo, borrar tu contenido o eliminar tu cuenta. Si prefieres pedirlo por correo, escribe a <a href={`mailto:${CONTACT}`}>{CONTACT}</a> desde la dirección con la que te registraste y responderemos en un plazo razonable.</p>

        <h2>Cambios en esta política</h2>
        <p>Si hacemos cambios importantes, te lo avisaremos dentro de la app o por correo.</p>
      </article>
    </div>
  );
}
