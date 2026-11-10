/**
 * Estilos de video para reels y videos cortos: cómo se graba y cómo se ve.
 * `show` es la indicación visual que se añade a cada escena del guion.
 */
export interface VideoStyle {
  id: string;
  name: string;
  how: string;
  show: string;
}

const S = (id: string, name: string, how: string, show: string): VideoStyle => ({ id, name, how, show });

export const VIDEO_STYLES: VideoStyle[] = [
  S('talking-head', 'A cámara (talking head)', 'Hablas directo al lente, mirando a quien ve. Genera conexión personal y autoridad.', 'Plano medio frontal, mirada al lente, fondo limpio y buena luz.'),
  S('talk-walk', 'Talk & Walk', 'Hablas a cámara mientras caminas. Se siente espontáneo y dinámico.', 'Plano en movimiento, mirada al lente, entorno que cambie cada pocos segundos.'),
  S('pov', 'POV (punto de vista)', 'Primera persona, como si hablaras desde tu perspectiva, sentada con el móvil.', 'Cámara a la altura de los ojos, sentada, tono de confidencia.'),
  S('selfie', 'Selfie', 'Móvil en la mano y mensaje casual, como charlar con una amiga.', 'Plano selfie cercano, luz natural, sin producción.'),
  S('vlog', 'Vlog', 'Narras una actividad o rutina alternando clips de tu día.', 'Clips cortos de tu rutina con tu voz encima; cambia de plano cada 2 o 3 segundos.'),
  S('entrevista', 'Entrevista', 'Preguntas y respuestas claras entre tú y una persona invitada.', 'Dos planos alternados: quien pregunta y quien responde; subtítulos con la pregunta.'),
  S('podcast', 'Mockup de podcast', 'De perfil, simulando un set de podcast, como si te entrevistaran.', 'Plano de perfil con micrófono a la vista y fondo de estudio.'),
  S('responder', 'Responder un comentario', 'Tomas un comentario de tu audiencia y grabas la respuesta.', 'Muestra el comentario en pantalla y responde a cámara debajo.'),
  S('pantalla-verde', 'Pantalla verde', 'Reemplazas el fondo con gráficos u objetos que refuerzan tu mensaje.', 'Tú en primer plano y, detrás, capturas, cifras u objetos que aparecen al nombrarlos.'),
  S('microfono', 'Micrófono en mano', 'Sostienes el micrófono para dar sensación de reporte o entrevista en vivo.', 'Plano medio con micrófono visible, audio claro y ritmo ágil.'),
  S('mixed-media', 'Mixed media', 'Combinas texto, fotos y clips rápidos con cortes que mantienen el ritmo.', 'Cortes cada 1 o 2 segundos entre texto en pantalla, fotos y clips.'),
  S('calle', 'Entrevista en la calle', 'Preguntas a personas al azar y capturas respuestas auténticas.', 'Plano de calle, pregunta en texto y respuestas breves de distintas personas.'),
  S('pizarra', 'Pizarra', 'Explicas escribiendo o dibujando en una pizarra, de pie o sentada.', 'Pizarra a cuadro; escribe mientras hablas y cierra con el esquema completo.'),
  S('skit', 'Personajes (skit)', 'Interpretas varios personajes en una conversación breve que dramatiza tu mensaje.', 'Cambios de personaje marcados con vestuario o encuadre; diálogo corto.'),
  S('reaccion', 'Reacción', 'Muestras tu rostro mientras ves un clip popular y aportas tu opinión.', 'Pantalla dividida: el clip arriba y tu reacción abajo.'),
  S('demostrar', 'Demostrar una habilidad', 'Muestras en cámara algo en lo que eres muy buena, para validar tu autoridad.', 'Plano de manos o pantalla haciendo la tarea real, con tu voz explicando.'),
  S('ponencia', 'Clip de una charla', 'Extraes unos segundos con gancho de una ponencia o video largo.', 'Corte del momento más fuerte con subtítulos grandes y título propio.'),
  S('meme', 'Meme', 'Una broma visual o escrita que parodia una situación cotidiana de tu nicho.', 'Imagen o clip reconocible con texto superpuesto; ritmo corto.'),
  S('multitasking', 'Multitasking', 'Enseñas algo mientras haces otra actividad relajante.', 'Plano de la actividad (caminar, cocinar, maquillarte) con tu voz o tu cara en un rincón.'),
  S('reto', 'Reto', 'Haces un reto en vivo y lo documentas.', 'Cronómetro o contador visible y planos del avance real.'),
  S('narracion-ia', 'Narración con voz sintética', 'Generas un audio a partir de un guion y lo sincronizas con imágenes.', 'Imágenes o clips sincronizados con subtítulos; sin aparecer a cámara.'),
  S('broll-voz', 'B-roll con voz en off', 'No sales a cámara: tus propios videos mientras narras o enseñas.', 'Tus clips reales (mejor que de stock) con la voz en off encima; muestra tu estilo de vida.'),
  S('broll-texto', 'B-roll con texto en bucle', 'Un loop de 3 a 9 segundos con diapositivas rápidas; el valor está en la descripción.', 'Diapositivas o clip breve en bucle con texto grande y una invitación a leer la descripción.'),
  S('lado-a-lado', 'Lado a lado', 'Dos versiones de ti hablan por turnos: una positiva y otra negativa.', 'Pantalla dividida con dos encuadres de ti; cambia el vestuario o el gesto de cada versión.'),
  S('ipad', 'Mano ilustrando (papel o iPad)', 'Grabas tu mano dibujando para explicar un concepto paso a paso.', 'Plano cenital de la mano sobre papel o tableta; el dibujo se completa al final.'),
  S('ranking', 'Ranking', 'Ordenas opciones del 1 al 10 o eliges entre esto y aquello.', 'Lista numerada en pantalla que se va llenando; revela la primera al final.'),
];

export const VIDEO_STYLE_BY_ID: Record<string, VideoStyle> = Object.fromEntries(VIDEO_STYLES.map((s) => [s.id, s]));
