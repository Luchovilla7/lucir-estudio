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

Ambos son idempotentes (se pueden volver a ejecutar).

### Supabase → Authentication
- **URL Configuration:** Site URL = URL de producción; Redirect URLs = producción `/**` y `http://localhost:5173/**`.
- **Sign In / Providers → Confirm email:** recomendado activo en producción. El registro y la recuperación ya contemplan ambos casos.

### Variables de entorno
| Variable | Dónde | Notas |
|---|---|---|
| `VITE_SUPABASE_URL` | Vercel + `.env.local` | pública |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel + `.env.local` | pública (`sb_publishable_…`) |
| `SUPABASE_SERVICE_ROLE_KEY` | solo Vercel | secreta (`sb_secret_…`), para endpoints de servidor |
| `ANTHROPIC_API_KEY` | solo Vercel | secreta, para generar con Claude |

## Secciones

| Ruta | Sección | Qué hace |
|---|---|---|
| `/login` `/registro` `/recuperar` | Acceso | Supabase Auth: correo y contraseña, confirmación y recuperación por enlace. |
| `/` | Panorama | Listas, meta del mes, formatos, balance de tonos, próximas publicaciones, chispas, ritmo personal. |
| `/inicio` | Guía de inicio | Checklist de 5 pasos y explicación de los tonos. |
| `/taller` | Taller | Carrusel (3–20 slides), stories (16 plantillas, 4 placas), reel con guion, post de texto. |
| `/aperturas` | Laboratorio | 64 moldes originales, filtro por nicho, búsqueda, "escribir mi versión", favoritos, respaldo/importación, banco imprimible. |
| `/copiloto` | Copiloto | Chat que propone tono, ganchos y estructura; "Guardar" y "Usar en contenido". |
| `/cartas` | Cartas | Historia + moraleja + propuesta (4 P), 300–500 palabras, modo "La IA responde / Yo respondo". |
| `/chispas` | Chispas | Generador de ideas con tono, apertura y niveles de consciencia; banco pendientes/usadas. |
| `/agenda` | Agenda | Calendario mensual con arrastrar y soltar y panel "Sin agendar". |
| `/archivo` | Archivo | Filtros, orden, métricas (alcance/guardados), edición y exportación JSON/CSV/Markdown. |
| `/marca` | Mi Marca | Identidad, onboarding del copiloto, voz, variante de español, palabras clave, colores, redes, ritmo personal. Multi-marca. |
| `/cuenta` | Mi cuenta | Nombre, contraseña, descarga de todos los datos, borrar contenido y eliminar cuenta. |

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
3. Publicación directa en redes (OAuth) y recordatorios de la agenda por correo o push.
4. Métricas reales importadas de las plataformas (hoy se cargan a mano).
5. Pruebas automáticas, monitoreo de errores y analítica.
