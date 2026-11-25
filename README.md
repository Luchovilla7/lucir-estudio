# Lucir Estudio

Estudio de contenido para marcas personales y negocios de servicios: convierte una idea suelta en carruseles, stories, reels con guion, posts de texto y cartas (email), con el tono de la marca, y los ordena en una agenda y un archivo.

Frontend en React + Vite + TypeScript. Cuentas y datos en **Supabase** (Auth + Postgres con Row Level Security). La generación de contenido es, por ahora, un motor local de plantillas (`src/lib/engine.ts`).

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completa VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev                  # http://localhost:5173
npm run build                # tsc + vite build
```

### Base de datos (Supabase → SQL Editor)
1. `supabase/schema.sql`: tablas, políticas RLS y disparador de perfil.
2. `supabase/002_delete_account.sql`: permite que cada usuario elimine su propia cuenta desde `/cuenta`.
3. `supabase/003_instagram.sql`: tablas de la conexión de Instagram (tokens cifrados sin acceso desde el navegador, métricas y vínculo pieza ↔ publicación).
4. `supabase/004_structures.sql` y luego `supabase/004b_seed_structures.sql`: biblioteca de 31 estructuras de carrusel (tabla compartida de solo lectura). El seed se regenera con `node scripts/build-structures-seed.mjs` a partir de `supabase/data/carousel-structures.json`.

Ambos son idempotentes (se pueden volver a ejecutar).

### Supabase → Authentication
- **URL Configuration:** Site URL = URL de producción; Redirect URLs = producción `/**` y `http://localhost:5173/**`.
- **Sign In / Providers → Confirm email:** recomendado activo en producción. El registro y la recuperación ya contemplan ambos casos.

### Variables de entorno

La plantilla está en `.env.example`. Copia las variables correspondientes a `.env.local` para desarrollo y configúralas también en **Vercel → Settings → Environment Variables**. No publiques `.env.local` ni pongas secretos en variables `VITE_`.

| Variable | Dónde | Notas |
|---|---|---|
| `VITE_SUPABASE_URL` | Vercel + `.env.local` | pública |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel + `.env.local` | pública (`sb_publishable_…`) |
| `SUPABASE_URL` | solo Vercel | URL del mismo proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | solo Vercel | secreta (`sb_secret_…`), para endpoints de servidor |
| `ANTHROPIC_API_KEY` | solo Vercel | secreta, para generar con Claude |
| `META_APP_ID` | solo Vercel | ID de la app en Meta for Developers |
| `META_APP_SECRET` | solo Vercel | Secreto de la app; nunca lo compartas ni lo pongas en el frontend |
| `META_CONFIG_ID` | solo Vercel | ID de la configuración de Instagram API con Unified Login en Meta |
| `TOKEN_ENC_KEY` | solo Vercel | 32 bytes en base64 para cifrar tokens de Instagram (`openssl rand -base64 32`) |
| `SITE_URL` | solo Vercel | Dominio público de la app, sin `/` final |
| `CRON_SECRET` | solo Vercel | secreto aleatorio para proteger la sincronización diaria |
| `IG_API_VERSION` | solo Vercel, opcional | versión Graph API; el código usa `v27.0` si no se define |

## Secciones

| Ruta | Sección | Qué hace |
|---|---|---|
| `/login` `/registro` `/recuperar` | Acceso | Supabase Auth: correo y contraseña, confirmación y recuperación por enlace. |
| `/` | Panorama | Listas, meta del mes, formatos, balance de tonos, próximas publicaciones, chispas, ritmo personal. |
| `/inicio` | Guía de inicio | Checklist de 5 pasos y explicación de los tonos. |
| `/taller` | Taller | Carrusel (3–20 slides), stories (16 plantillas, 4 placas), reel con guion, post de texto. |
| `/biblioteca` | Biblioteca | 31 estructuras de carrusel por objetivo (Venta, Educación, Atracción, Autoridad) con estrategia, pasos por slide y prompt base. "Usar" las lleva al Taller. |
| `/aperturas` | Laboratorio | 112 moldes originales, filtro por nicho, búsqueda, "escribir mi versión", favoritos, respaldo/importación, banco imprimible. |
| `/copiloto` | Copiloto | Chat que propone tono, ganchos y estructura; "Guardar" y "Usar en contenido". |
| `/cartas` | Cartas | Historia + moraleja + propuesta (4 P), 300–500 palabras, modo "La IA responde / Yo respondo". |
| `/chispas` | Chispas | Generador de ideas con tono, apertura y niveles de consciencia; banco pendientes/usadas. |
| `/agenda` | Agenda | Calendario mensual con arrastrar y soltar y panel "Sin agendar". |
| `/archivo` | Archivo | Filtros, orden, métricas (alcance/guardados), edición y exportación JSON/CSV/Markdown. |
| `/metricas` | Métricas | Conecta Instagram (cuentas Empresa o Creador) y ve seguidores, alcance, visualizaciones, interacciones y publicaciones. Incluye modo de ejemplo. |
| `/privacidad` | Privacidad | Política de privacidad (borrador) con datos de Instagram y eliminación de datos. |
| `/marca` | Mi Marca | Identidad, onboarding del copiloto, voz, variante de español, palabras clave, colores, redes, ritmo personal. Multi-marca. |
| `/cuenta` | Mi cuenta | Nombre, contraseña, descarga de todos los datos, borrar contenido y eliminar cuenta. |

## Instagram

Usa **Instagram API con Unified Login** (solo lectura: `instagram_basic` e `instagram_manage_insights`). Requiere que la app de Meta esté vinculada a un portfolio comercial y tenga una configuración de Unified Login con estos permisos. No requiere Página de Facebook.

Flujo: `Métricas → /api/instagram/start` (Facebook Login for Business con `config_id`) → Meta → `/api/instagram/callback` (intercambia el código por un token del sistema de integración empresarial, lo cifra con AES-256-GCM y lo guarda) → `graph.facebook.com` para consultar perfil, alcance diario, totales de 30 días y publicaciones con métricas. La validez del token depende de la configuración de Meta; si vence, hay que reconectar. Una tarea diaria (`/api/instagram/cron`) sincroniza las métricas. Se puede vincular una pieza con su publicación para traer alcance y guardados automáticamente.

Funciones de servidor en `api/`: `config`, `start`, `callback`, `sync`, `disconnect`, `cron`, `deauthorize` y `data-deletion` (los dos últimos son los avisos obligatorios de Meta).

Pasos para conectar Meta for Developers:
1. Abre el caso de uso **Administrar mensajes y contenido en Instagram** y entra en **API setup with Unified Login**. Vincula la app a un portfolio comercial si Meta lo solicita.
2. En **Configure your app**, crea y selecciona una configuración compatible con Instagram Login. Incluye `instagram_basic` e `instagram_manage_insights` y habilita compartir una cuenta profesional.
3. En el campo **Redirect URL** de esa configuración registra exactamente `https://TU-DOMINIO/api/instagram/callback` (HTTPS, sin barra final).
4. Copia el `config_id` a `META_CONFIG_ID` en Vercel. Copia el **Meta App ID** y **App Secret** a `META_APP_ID` y `META_APP_SECRET`. No uses el token generado manualmente.
5. En la configuración general registra `https://TU-DOMINIO/api/instagram/deauthorize` como callback de desautorización, `https://TU-DOMINIO/api/instagram/data-deletion` como callback de eliminación de datos y `https://TU-DOMINIO/privacidad` como política de privacidad.
6. Ejecuta `supabase/003_instagram.sql` en SQL Editor si aún no lo hiciste. En Vercel configura también `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TOKEN_ENC_KEY`, `SITE_URL` y `CRON_SECRET`. Genera `TOKEN_ENC_KEY` con `openssl rand -base64 32`.
7. Después de agregar `META_CONFIG_ID` y guardar las variables, vuelve a desplegar Production. Abre `/metricas`, pulsa **Conectar con Instagram** e inicia sesión; Meta te pedirá elegir el portfolio y la cuenta profesional que compartirás.
8. En modo desarrollo, solo podrán probar personas con rol en la app y activos compartidos. Para clientes externos, solicita Advanced Access/App Review para esos permisos y activa la app en Live, según lo que pida el panel de Meta.

## Estrategia de contenido (sin IA)

Idea = el tema · **Ángulo** = cómo lo abordas · **Formato** = cómo se ve.

- `src/lib/angles.ts`: 24 ángulos agrupados por objetivo (**Atraer**, **Conectar**, **Convertir**). Cada uno define sus pasos, una pregunta para encontrar la idea, títulos para chispas y palabras clave para sugerirlo. La referencia de ángulo y estilo se guarda en `pieces.template_id` (`angle:xxx|style:yyy`), sin tocar la base de datos; en `sparks.levels` se guarda como `angle:xxx`.
- `src/lib/videoStyles.ts`: 26 estilos de video para reels (talking head, POV, pizarra, skit, b-roll…). Cada escena del guion indica qué se ve.
- Taller: elige ángulo (y estilo en reels) y la pieza sigue sus pasos. Chispas: ideas por ángulo, mapa de cliente ideal que se convierte en chispas, fuentes de ideas reales y recursos para regalar. Laboratorio: 112 aperturas y guía de ganchos. Copiloto: sugiere ángulo. Panorama: balance por objetivo.

## Arquitectura

```
src/
  lib/
    supabase.ts    cliente de Supabase
    store.tsx      AuthProvider + DataProvider (carga, escritura optimista y con espera)
    engine.ts      generación local: generatePiece, generateSparks, copilotReply
    hooksData.ts   banco de aperturas (contenido original)
    tones.ts       tonos, formatos, estados, plataformas
  components/      Layout, PieceEditor, ui
  pages/           una por sección (carga diferida con React.lazy)
supabase/          schema.sql y migraciones
```

Los tonos propios son **Faro, Prueba, Giro y Brújula**.

## Qué falta

1. **Generación con IA**: reemplazar `generatePiece`, `generateSparks` y `copilotReply` de `engine.ts` por llamadas a un endpoint de servidor (`/api`) que invoque a Claude con la configuración de la marca como contexto, valide la sesión y registre consumo en `usage_events` (la tabla ya existe).
2. Límites de uso y planes (`profiles.plan` ya existe), y facturación si será de suscripción.
3. Publicación directa en redes y recordatorios de la agenda por correo o push.
4. Métricas de otras redes (hoy solo Instagram; el resto se carga a mano).
5. Pruebas automáticas, monitoreo de errores y analítica.
