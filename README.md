# Lucir Estudio

Estudio de contenido para marcas personales y negocios de servicios: convierte una idea suelta en carruseles, stories, reels con guion, posts de texto y cartas (email), con el tono de la marca, y los ordena en una agenda y un archivo.

Este repositorio contiene el **frontend completo**. Los datos viven en `localStorage` y la generación es un motor local; ver "Qué falta" más abajo.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
```

Despliegue en Vercel: `vercel.json` ya redirige todas las rutas a `index.html`.

## Secciones

| Ruta | Sección | Qué hace |
|---|---|---|
| `/login` `/registro` `/recuperar` | Acceso | Cuentas locales (maqueta). |
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

## Arquitectura

```
src/
  lib/
    types.ts       modelos de datos
    store.tsx      AuthProvider + DataProvider (hoy: localStorage)
    engine.ts      generación local: generatePiece, generateSparks, copilotReply
    hooksData.ts   banco de aperturas (contenido original)
    tones.ts       tonos, formatos, estados, plataformas
  components/      Layout, PieceEditor, ui
  pages/           una por sección
```

Los tonos propios son **Faro, Prueba, Giro y Brújula**.

## Qué falta (backend)

1. **API + base de datos** (usuarios, marcas, piezas, chispas, aperturas guardadas). Reemplazar `store.tsx` manteniendo la misma interfaz `useData()` / `useAuth()`.
2. **Autenticación real** con sesión segura, verificación de correo y recuperación por correo (hoy el hash vive en el navegador).
3. **Generación con IA**: sustituir `generatePiece`, `generateSparks` y `copilotReply` de `engine.ts` por llamadas a un endpoint propio que invoque al modelo, con la configuración de la marca como contexto y streaming para el Copiloto.
4. Límites de uso, planes y facturación si será un producto de suscripción.
5. Publicación directa en redes (OAuth con Instagram, LinkedIn, etc.) y recordatorios por correo o push de la agenda.
6. Métricas reales (importar alcance y guardados desde las plataformas en vez de cargarlos a mano).
7. Pruebas automáticas, monitoreo de errores y analítica.
