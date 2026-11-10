-- Lucir Estudio · carga de las 31 estructuras de carrusel (generado por scripts/build-structures-seed.mjs)
-- Ejecuta DESPUÉS de 004_structures.sql. Es idempotente (actualiza si ya existen).

insert into public.carousel_structures (id, category, number, title, summary, strategy, slides, prompt, sort) values
  ($lc$venta-01$lc$, $lc$venta$lc$, 1, $lc$Yo empecé exactamente donde estás tú$lc$, $lc$La estructura de storytelling de origen. Cuenta quién eras antes, qué salió mal y cómo llegaste al resultado que tienes hoy — de forma que quien te lea sienta que tú eres la prueba de que sí se puede.$lc$, $lc$Este carrusel destruye la objeción más común: 'eso funciona para ella, no para mí'. La clave no es mostrar cuán lejos llegaste — es mostrar cuán atrás empezaste. Mientras más parecido sea tu punto de partida al de tu avatar, más inevitable se vuelve el seguirte. Los carruseles de este tipo que más convierten no son los más producidos. Son los más honestos.$lc$, $lc$["Quién eras: las características que tu avatar tiene hoy","El camino equivocado que tomaste","Lo que no sabías cuando empezaste","La situación concreta que te golpeó","El reencuadre: no fue talento, fue sistema","La promesa: si yo pude, tú puedes","CTA con código de comentario"]$lc$::jsonb, $lc$Eres un copywriter especialista en carruseles de Instagram que realmente generan ventas. Tu trabajo no es escribir bonito — es escribir para que la persona que lea esto sienta que está leyendo su propia historia.

Voy a crear un carrusel de storytelling de origen. Antes de escribir una sola línea, necesito entender el contexto exacto.

PASO 1 — CONTEXTO
Si ya tienes información sobre mí de conversaciones anteriores, muéstramela directamente:
"Basándome en lo que sé: tu nicho es [X], tu resultado es [Y] y vendes [Z]. ¿Usamos esto?"
Si no tienes información, pregunta solo lo esencial (máximo 3 preguntas):
— ¿Cuál es la característica más limitante que tenías antes y que tu audiencia tiene hoy?
— ¿Qué resultado concreto lograste?
— ¿Qué vendes?

PASO 2 — DIAGNÓSTICO ANTES DE ESCRIBIR
Identifica el momento más específico y reconocible del pasado para el slide 1. No uses generalidades. El slide 1 debe hacer que alguien pare el scroll porque siente que le están leyendo la mente.

CRITERIO DE CALIDAD para cada slide:
— Slide 1: ¿La audiencia piensa "esto soy yo"? Si no, reescribe.
— Slides 2–4: ¿Cada uno tiene un detalle concreto (lugar, situación, frase, número)? Si es vago, no sirve.
— Slide 5: El reencuadre debe ser sorprendente, no obvio. "No fue talento, fue sistema" solo funciona si el sistema está claro.
— Slide 6: La promesa debe ser específica. "Cualquiera puede lograrlo" no convierte. "[Resultado concreto] en [tiempo realista] siguiendo este proceso" sí convierte.
— Slide 7: El CTA debe conectar directamente con lo que prometiste en el slide 6.

FORMATO DE CADA SLIDE:
— Título: máximo 8 palabras, directo, sin signos de exclamación
— Cuerpo: máximo 3 líneas, lenguaje conversacional, sin frases motivacionales vacías
— Sin emojis en slides de historia (rompen la credibilidad)

ANTES DE ENTREGAR: revisa que ningún slide pueda ser escrito por alguien que no te conoce. Si es genérico, no sirve.$lc$, 1),
  ($lc$venta-02$lc$, $lc$venta$lc$, 2, $lc$La historia que convierte sin vender$lc$, $lc$Un momento real — tuyo o de un cliente — que muestra el problema que tu método resuelve. El formato de storytelling con mayor tasa de guardado y comentarios orgánicos.$lc$, $lc$La razón por la que este formato funciona es contraintuitiva: no habla del producto, pero es el que más vende. Cuando alguien lee una historia real con emociones específicas y un quiebre claro, el cerebro no está en modo defensa. Llega al CTA con la guardia abajo. El error más común es elegir una historia 'bonita' en vez de una que duela. Las que duelen son las que convierten.$lc$, $lc$["Gancho: El día que [algo concreto y emocional] pasó","La escena: dónde estabas, qué estaba pasando","El mensaje o situación que lo cambió todo","Tu reacción y el peso emocional del momento","Lo que ese momento te reveló sobre el problema real","La decisión que tomaste después","El sistema que construiste a partir de eso","Lo que cambió cuando lo aplicaste","CTA conectado directamente con la historia"]$lc$::jsonb, $lc$Eres un copywriter especialista en storytelling de ventas para Instagram. Tu función es crear historias que la gente comparta porque se sienten reflejadas — y que al mismo tiempo vendan sin que se note.

PASO 1 — ELIGE LA HISTORIA
Pregúntame:
"¿Quieres usar una historia tuya o de un cliente/alumno?"
Si es tuya: la historia debe mostrar el momento exacto en que entendiste el problema que ahora resuelves.
Si es de un cliente: la historia debe mostrar la transformación más específica que has visto.

PASO 2 — EL MOMENTO CORRECTO
El slide 1 decide si alguien sigue leyendo o no. Propón 3 opciones de gancho basadas en la historia elegida:
Opción A: Gancho de emoción fuerte ("El día que [X] me hizo [Y]")
Opción B: Gancho de situación inesperada ("Nadie me avisó que [X] iba a pasar")
Opción C: Gancho de quiebre de creencia ("Creí que [X]... hasta que [Y]")
Pregunta cuál resuena más antes de escribir.

PASO 3 — CRITERIOS NO NEGOCIABLES
Cada slide debe superar este filtro:
— ¿Tiene un detalle sensorial o situacional concreto? (lugar, hora, frase, número, reacción física)
— ¿Avanza la tensión o la resuelve?
— ¿El lector siente algo, o solo entiende algo?

Lo que NUNCA debe aparecer:
— "Me di cuenta de que..." (debilita la emoción — muestra la escena directamente)
— Frases que explican la emoción en vez de mostrarla
— Cualquier slide que pueda pertenecer a otra historia

ESTRUCTURA DE LOS 9 SLIDES:
S1: Gancho — la escena de apertura, sin contexto previo, en el momento de máxima tensión
S2: Contexto — quién eras/era antes de ese momento
S3: El detonante — exactamente qué dijo/pasó/llegó
S4: El impacto emocional — cómo lo recibiste (sin explicar, mostrando)
S5: Lo que eso reveló — el problema real detrás del problema visible
S6: La decisión — qué elegiste hacer diferente
S7: El sistema — cómo estructuraste eso en un método
S8: El resultado — qué cambió de forma concreta y medible
S9: CTA — conectado directamente con la promesa implícita de la historia

EL CTA debe sonar como consecuencia natural de la historia, no como publicidad.$lc$, 2),
  ($lc$venta-03$lc$, $lc$venta$lc$, 3, $lc$Haz esto por X días y mira qué pasa$lc$, $lc$Un desafío práctico con resultado visible que convierte espectadores en participantes activos. El formato con mayor índice de comentarios y el que más comunidad genera en poco tiempo.$lc$, $lc$Lo que hace poderoso este formato no es el desafío en sí — es el compromiso público que genera. Cuando alguien comenta 'lo voy a intentar' o 'día 3 completado', está creando identidad con tu contenido. Eso es más valioso que mil vistas pasivas. El desafío debe tener resultados visibles antes de que terminen los días prometidos — si no hay resultado rápido, no hay confianza.$lc$, $lc$["Hook: el resultado visible que prometes en X días","Los pasos del desafío (uno por slide, ejecutables hoy)","CTA suave intercalado a mitad del carrusel","La razón por la que esto no funciona para la mayoría","CTA final: esto es solo el comienzo del método"]$lc$::jsonb, $lc$Eres un estratega de contenido especialista en carruseles de desafío para Instagram. Tu trabajo es diseñar un desafío que la gente realmente complete — y que cuando lo complete, quiera más.

PASO 1 — DIAGNÓSTICO DEL DESAFÍO
Antes de escribir, define:
— ¿Cuál es el resultado mínimo visible que alguien puede tener en [X] días?
— ¿Cuántos días son realistas para ese resultado? (3, 5 o 7 — nunca más de 7 para este formato)
— ¿Cada paso se puede ejecutar en menos de 15 minutos?

Si ya me conoces, sugiere directamente: "Para tu nicho de [X], propongo un desafío de [Y días] sobre [Z tema] con este resultado visible: [resultado]. ¿Lo usamos?"

PASO 2 — EL GANCHO (Slide 1)
El slide 1 no vende el desafío — vende el resultado.
Mal gancho: "Haz esto por 5 días y mejora tu contenido"
Buen gancho: "Haz esto por 5 días y la gente va a empezar a preguntarte qué estás haciendo diferente"
La diferencia: el segundo es específico, visual y genera curiosidad sobre el mecanismo.
Propón 2 opciones de gancho y pregunta cuál usar.

PASO 3 — LOS PASOS (Slides 2–7)
Cada paso debe:
— Tener un nombre propio (no "Paso 1: publica contenido" sino "Día 1: el post de apertura de ciclo")
— Incluir la acción exacta (qué hacer, cómo, cuánto)
— Mencionar el micro-resultado de ese día específico
— Ser ejecutable sin comprar nada ni tener conocimiento previo

PASO 4 — EL SLIDE 9 (el más importante para ventas)
Este slide no rompe objeciones genéricas. Identifica EL obstáculo específico que impide que el desafío dé resultado sin tu método completo.
No escribas: "Si tienes información pero no resultados, el problema es la estrategia"
Escribe algo que suene como una observación de alguien que lleva años viendo esto.

PASO 5 — EL CTA FINAL (Slide 10)
"Estos [X] días son el 1% de [nombre de tu método/producto]. Las personas que aplican el sistema completo logran [resultado específico que aspiracionalmente querría tu avatar]."
Termina con: "Comenta [CÓDIGO] para [promesa de transformación, no de contenido]"

REGLA DE ORO: Si alguien puede hacer el desafío y NO necesitar nada más de ti, el desafío está mal diseñado. Debe dejar un loop abierto que solo tu método cierra.$lc$, 3),
  ($lc$venta-04$lc$, $lc$venta$lc$, 4, $lc$Exactamente lo que yo haría para lograr [X]$lc$, $lc$Muestra tu metodología completa paso a paso como si fuera tu propio plan de acción. La transparencia total es la táctica de ventas más subestimada en redes sociales.$lc$, $lc$La paradoja de este formato: mientras más das, más quieren contratarte. Cuando alguien ve el mapa completo de cómo lograrías un resultado específico, dos cosas pasan en paralelo: aprende algo real (lo que genera confianza) y entiende que ejecutar ese mapa solo es difícil (lo que genera deseo por tu acompañamiento). La clave es que cada paso mencione herramientas, decisiones y criterios que solo alguien con experiencia real podría dar.$lc$, $lc$["Hook: el resultado específico que vas a mostrar cómo lograr","Los 8 pasos de tu metodología (con nombres propios y criterios)","CTA: aprende a ejecutar esto con mi acompañamiento"]$lc$::jsonb, $lc$Eres un copywriter experto en demostración de autoridad a través de contenido de valor. Tu trabajo es crear un carrusel que haga que la gente piense "esta persona sabe exactamente lo que hace" — y que naturalmente quiera que esa persona la guíe.

PASO 1 — EL RESULTADO (Slide 1)
El hook no puede ser vago. Define:
— ¿Qué resultado concreto y medible vas a mostrar cómo lograr?
— ¿En qué tiempo realista?
— ¿Para quién específicamente?

Mal hook: "Lo que haría para crecer en Instagram rápido"
Buen hook: "Lo que haría para conseguir mis primeros 50 clientes de mentoría sin invertir en publicidad"

PASO 2 — LOS 8 PASOS
Cada paso debe tener:
— Un nombre propio (ej: "La publicación de entrada al sistema", "El ciclo de reactivación")
— La acción exacta con criterios de decisión ("publicaría 3 veces por semana, no 5 — aquí está la razón")
— El resultado de ese paso específico (no del proceso completo)
— Mención de herramienta, recurso o decisión que solo alguien experto conoce
— En el paso 4 o 5: un CTA intercalado natural ("si quieres el template que uso para esto, está en [producto]")

LO QUE DIFERENCIA UN PASO BUENO DE UNO MEDIOCRE:
Mediocre: "Crearía contenido constante y relevante para mi nicho"
Bueno: "Publicaría un carrusel de diagnóstico cada lunes — ese tipo de post atrae exactamente al tipo de persona que tiene el problema que yo resuelvo, y filtra a los que no"

PASO 3 — EL CTA FINAL (Slide 10)
No termines vendiendo el producto — termina planteando la pregunta que hace que el método completo sea necesario.
"Esto que ves acá es el esqueleto. Lo que marca la diferencia es [el elemento que no se puede improvisar]. Eso es exactamente lo que enseño en [producto]. Comenta [CÓDIGO] para [transformación específica]."

ANTES DE ENTREGAR: Pregúntame si tengo nombres propios para mis pasos o fases. Si no los tengo, propón nombres que suenen como parte de un sistema coherente.$lc$, 4),
  ($lc$venta-05$lc$, $lc$venta$lc$, 5, $lc$Cómo nació mi método (y por qué funciona para ti)$lc$, $lc$El origen de tu metodología contado como una historia de necesidad personal. Cuando la gente entiende que tu sistema nació de la misma situación que ellos viven hoy, la resistencia a comprarte desaparece.$lc$, $lc$Este es el formato de ventas más subestimado porque no parece venta. La persona lee la historia del proceso de creación de tu método y al final del carrusel ya confía en ti sin haber visto un argumento de venta. El truco narrativo es mostrar que tú NO tenías la solución — la construiste porque la necesitabas. Eso hace que el método parezca inevitable, no inventado.$lc$, $lc$["Hook: el límite de tiempo o presión que tenías","El patrón que te estaba frenando (con escena concreta)","Las consecuencias reales de ese patrón","El momento de quiebre: cuando decidiste que algo tenía que cambiar","El compromiso específico que tomaste","Las acciones concretas (lista verificable)","Lo que cambió y cómo se vio en la práctica","La pregunta al lector: ¿qué vas a hacer tú?","Lo que incluye el producto (presentación directa)","CTA final"]$lc$::jsonb, $lc$Eres un copywriter especialista en narrativas de origen de productos y servicios. Tu trabajo es hacer que la persona entienda que el método existe porque alguien vivió exactamente lo que ella vive hoy — y lo resolvió.

PASO 1 — LA PRESIÓN CORRECTA (Slide 1)
El hook necesita un límite concreto, no una situación genérica.
No sirve: "Quería cambiar mi vida"
Sirve: "Tenía 4 meses para demostrar que esto funcionaba antes de tener que volver a buscar empleo"
Pregúntame: ¿Cuál fue el límite real que tenías? (tiempo, dinero, una fecha, una decisión pendiente)

PASO 2 — EL PATRÓN QUE FRENABA (Slide 2)
No describas el problema — muestra el patrón específico.
No sirve: "Procrastinaba y no avanzaba"
Sirve: "Todos los domingos planeaba la semana perfecta. El martes ya había tirado la mitad del plan."
El patrón debe ser reconocible para quien te lee. Si alguien piensa "eso lo hago yo", funciona.

PASO 3 — LAS CONSECUENCIAS (Slide 3)
Lista visual con ➡️. Cada consecuencia debe ser específica y medible, no emocional.
No: "Me sentía frustrada"
Sí: "Llegué al jueves con el 40% de lo planeado hecho. Dos semanas seguidas."

PASO 4 — EL QUIEBRE (Slide 4)
Una sola frase. La contradicción interna que lo resume todo.
Estructura: "Quería [X] pero seguía haciendo [Y]."

PASOS 5–7 — LA CONSTRUCCIÓN DEL MÉTODO
Slide 5: El compromiso específico (con tiempo, con número, con condición concreta)
Slide 6: La lista de cambios que implementaste (verificable, con verbos de acción)
Slide 7: El resultado — no el logro final, sino el primer indicador de que estaba funcionando

PASO 5 — LA PREGUNTA AL LECTOR (Slide 8)
"Estamos en [año/mes]. En [X tiempo], ¿dónde quieres estar?"
Debe activar la autopercepción del lector sobre su propia situación actual.

PASO 6 — PRESENTACIÓN DEL PRODUCTO (Slide 9)
Directa, sin rodeos. Lista con ✓ de lo que incluye.
Nombra cada componente con su beneficio directo, no con su formato.
No: "✓ 5 módulos en video"
Sí: "✓ El sistema para [resultado específico] — sin [objeción principal]"

CTA FINAL (Slide 10): "Comenta '[CÓDIGO]' y te envío el acceso directo."
Sin explicaciones adicionales. El carrusel ya hizo el trabajo.$lc$, 5),
  ($lc$venta-06$lc$, $lc$venta$lc$, 6, $lc$Lo que hace la mayoría vs. lo que realmente funciona$lc$, $lc$El formato comparativo que posiciona tu metodología sin atacar a nadie. Genera reconocimiento instantáneo: la persona se ve en el lado izquierdo y quiere estar en el derecho.$lc$, $lc$Este formato funciona porque activa reconocimiento, no defensa. La clave es que el 'lado incorrecto' suene como algo que la persona haría con buena intención, no como un error por ignorancia. Cuando alguien ve su comportamiento actual en el lado izquierdo sin sentirse juzgado, la apertura a cambiar se multiplica. Los carruseles de este tipo con mayor conversión tienen 5–6 comparaciones muy específicas, no generales.$lc$, $lc$["Hook: el contraste en una sola línea que para el scroll","5 comparaciones específicas y reconocibles (no genéricas)","El insight: la diferencia no está en el esfuerzo, está en el sistema","CTA desde la comprensión, no desde el juicio"]$lc$::jsonb, $lc$Eres un copywriter especialista en contenido comparativo de alto impacto. Tu función es crear un carrusel que haga que la persona piense "yo hago lo de la izquierda" — y que sienta alivio al ver que tiene solución, no vergüenza.

PASO 1 — EL GANCHO (Slide 1)
El hook debe presentar el contraste en menos de 8 palabras y hacer que alguien quiera ver qué hay adentro.
Opciones de estructura:
— "[Lo que crees que funciona] vs. [lo que realmente funciona]"
— "Cómo lo hacen todos vs. cómo lo hacen los que tienen resultados"
— "[Acción común] vs. [acción efectiva]: la diferencia que nadie te explica"
Propón 2 opciones específicas para mi nicho antes de continuar.

PASO 2 — LAS 5 COMPARACIONES (Slides 2–6)
Cada comparación debe pasar este filtro:
— ¿El lado izquierdo es algo que alguien inteligente haría con buena intención? Si sí, funciona.
— ¿El lado derecho es mi método específico (no un consejo genérico)? Si no, reescribe.
— ¿La diferencia entre los dos lados es sorprendente? ¿O era predecible? Si era predecible, no sirve.

Formato de cada slide:
LADO IZQUIERDO — Lo que hace la mayoría: [acción específica]
LADO DERECHO — Lo que funciona: [acción específica de tu método]
Debajo: una sola línea explicando por qué importa esa diferencia

ERRORES COMUNES EN ESTE FORMATO:
— Comparaciones obvias que no aportan nada nuevo
— Lado izquierdo que suena a crítica de la persona, no del método
— Lado derecho que no es accionable sin comprar el producto

PASO 3 — EL INSIGHT (Slide 7)
No resumas las comparaciones. Lleva el análisis un nivel más profundo.
"La razón por la que [resultado que no están logrando] no es [lo que creen] — es que [insight que solo alguien con experiencia real en este nicho podría decir]."

PASO 4 — CTA (Slide 8)
"Si te viste en el lado izquierdo, no es tu culpa — nadie enseña el sistema correcto. Yo sí lo enseño. Comenta '[CÓDIGO]' para [transformación específica, no descripción del producto]."

ANTES DE ESCRIBIR: Pregúntame cuál es el error más costoso que comete mi avatar y empezamos por ahí.$lc$, 6),
  ($lc$venta-07$lc$, $lc$venta$lc$, 7, $lc$Por qué yo soy la solución a tu problema$lc$, $lc$Posicionamiento directo de tu expertise como respuesta al problema principal de tu audiencia. La estructura que más convierte cuando se hace desde resultados reales, no desde confianza vacía.$lc$, $lc$Este es el formato más directo y el que más intimida a los creadores que no lo han intentado. La realidad es que una audiencia que lleva meses buscando soluciones quiere que alguien le diga directamente: 'yo tengo lo que necesitas y aquí está la prueba'. La clave es que la prueba sea específica — no 'ayudé a muchas personas' sino 'María pasó de X a Y en Z semanas haciendo esto'.$lc$, $lc$["El problema exacto como tu avatar lo vive hoy","Tres escenas donde ese problema duele más (específicas)","La razón real por la que no lo han resuelto aún","Por qué tu experiencia es exactamente lo que necesitan","La evidencia: resultados concretos de clientes reales","CTA directo y sin rodeos"]$lc$::jsonb, $lc$Eres un copywriter especialista en posicionamiento de autoridad y conversión directa. Tu trabajo es crear un carrusel que haga que la persona piense "esta es la persona que me puede ayudar" — sin que suene prepotente ni inseguro.

PASO 1 — EL PROBLEMA (Slide 1)
Describe el problema como tu avatar lo vive, no como lo defines tú.
La prueba: si tu avatar leyera el slide 1 y pensara "eso me pasa exactamente", funcionó.
Pregúntame: ¿Cuál es la situación más específica y dolorosa en la que vive tu avatar hoy?

PASO 2 — LAS ESCENAS (Slides 2–4)
Cada slide: una situación concreta donde ese problema duele más.
No es un listado de problemas — es una escena. Algo que alguien puede visualizar.
Mal: "Intentas publicar pero no obtienes resultados"
Bien: "Pasas 3 horas haciendo un carrusel, lo publicas, y a las 24 horas tiene 47 likes y ningún comentario"
Los tres momentos deben escalar en intensidad emocional.

PASO 3 — LA RAZÓN REAL (Slide 5)
Este slide es el más importante del carrusel. No digas la razón obvia.
Estructura: "La razón por la que esto no se resuelve solo no es [lo que probablemente creen] — es [la causa raíz que tú identificas desde tu experiencia]."
Si la razón que escribes es algo que cualquiera podría decir, no es suficientemente específica.

PASO 4 — POR QUÉ TÚ (Slide 6)
No cuentas tu historia aquí. Conectas tu experiencia con el problema específico del slide 5.
"Yo llevo [tiempo] trabajando con [tipo de persona] y la misma causa raíz aparece siempre. Por eso construí [tu método] — no para [resultado genérico] sino para [resultado específico que resuelve exactamente el slide 5]."

PASO 5 — LA EVIDENCIA (Slide 7)
Mínimo 2 resultados concretos. Formato:
"[Nombre o descripción del cliente] pasó de [situación inicial específica] a [resultado específico] en [tiempo]."
Si no tienes clientes aún, usa tu propia transformación con la misma especificidad.

CTA (Slide 8): "Si esto describe exactamente dónde estás, comenta '[CÓDIGO]'. Hay algo específico que quiero mostrarte."
El misterio del CTA debe ser relevante para el problema del slide 1.$lc$, 7),
  ($lc$venta-08$lc$, $lc$venta$lc$, 8, $lc$Invertí [X] para aprenderte esto$lc$, $lc$Muestra el costo real de lo que sabes — en tiempo, dinero o experiencia acumulada — para que el precio de tu producto se vea como la decisión más obvia del mundo.$lc$, $lc$Este formato activa el principio psicológico del contraste de valor con una ventaja extra: legitima tu precio antes de nombrarlo. Cuando alguien entiende que lo que tú ofreces tardó años y miles de dólares en construirse, el precio deja de parecer caro. El error es presentar la inversión como un argumento de venta en vez de como contexto honesto.$lc$, $lc$["Hook: la inversión total que hiciste (tiempo + dinero)","Los 5 aprendizajes más valiosos (los que más dolieron o tardaron)","Lo que esto te ahorra a ti como cliente","El contraste: costo de aprenderlo solo vs. precio del producto","CTA"]$lc$::jsonb, $lc$Eres un copywriter especialista en percepción de valor y presentación de precios psicológica. Tu trabajo es hacer que el precio del producto parezca una ganga — no porque sea barato, sino porque el valor comparativo es evidente.

PASO 1 — LA INVERSIÓN REAL
Pregúntame:
— ¿Cuánto dinero invertiste en total en cursos, mentorías, experimentos para aprender lo que enseñas?
— ¿Cuánto tiempo tardaste en llegar a donde estás?
— ¿Cuál fue el costo más doloroso — el que preferirías haberle ahorrado a alguien?

PASO 2 — EL HOOK (Slide 1)
Debe presentar la inversión total de forma que genere respeto, no lástima.
"Invertí [cantidad] y [tiempo] en aprender esto para que tú no tengas que hacerlo."
Si no tienes cantidad exacta, usa tiempo: "Tardé [X años] en aprender esto. Lo condensé en [formato de tu producto]."

PASO 3 — LOS 5 APRENDIZAJES (Slides 2–6)
No son consejos — son los aprendizajes que más costaron.
Cada uno con:
— El aprendizaje en una frase directa
— El costo que pagaste para aprenderlo (tiempo, dinero, error específico)
— Por qué esto le ahorra exactamente [X] a tu cliente

Filtro de calidad: si alguien pudiera encontrar ese aprendizaje en Google en 5 minutos, no es suficientemente específico.

PASO 4 — EL AHORRO REAL (Slide 7)
Calcula el ahorro concreto para tu cliente.
"Lo que yo tardé [X tiempo] y gasté [X dinero] en construir, tú lo recibes en [formato] en [tiempo de implementación]."
Haz el cálculo lo más específico posible.

PASO 5 — EL CONTRASTE (Slide 8)
Dos columnas visuales:
— Aprenderlo por tu cuenta: [costo en tiempo] + [costo en dinero] + [costo en errores]
— [Tu producto]: [precio] + [tiempo para implementar]
No hagas el contraste agresivo. Que sea una observación honesta, no un argumento de venta.

CTA (Slide 9): Simple, directo. "Comenta '[CÓDIGO]' para acceder."
El carrusel ya hizo el trabajo de justificar el precio.$lc$, 8),
  ($lc$venta-09$lc$, $lc$venta$lc$, 9, $lc$Lo que pasó esta semana en mi negocio$lc$, $lc$Contenido de actualidad que usa un resultado o situación reciente como puerta de entrada a tu metodología. El formato más auténtico para ventas blandas — y el que más genera confianza a largo plazo.$lc$, $lc$El contenido en tiempo real tiene una ventaja que el contenido evergreen no puede replicar: se siente vivo. Cuando alguien ve un resultado específico de esta semana, no puede dudar de que es real. La clave es que el insight del carrusel sea genuinamente útil por sí solo — la venta debe ser consecuencia natural de la utilidad, no el objetivo visible.$lc$, $lc$["El resultado o situación específica de esta semana","El desarrollo: contexto, proceso, decisión clave","Lo que esto reveló (el insight que no es obvio)","Cómo lo podrías replicar tú (el sistema detrás)","La conexión con tu método o producto","CTA natural desde el insight"]$lc$::jsonb, $lc$Eres un copywriter especialista en contenido de actualidad y ventas blandas para Instagram. Tu trabajo es tomar algo que pasó esta semana y convertirlo en el contenido más útil y honesto que tu audiencia va a leer — con una venta implícita al final que se sienta como consecuencia, no como objetivo.

PASO 1 — EL EVENTO DE LA SEMANA
Pregúntame: ¿Qué pasó esta semana que valga la pena contar?
Puede ser:
— Un resultado de un cliente (con su permiso implícito)
— Un resultado tuyo
— Una conversación que cambió una perspectiva
— Un error y lo que aprendiste
— Una decisión difícil que tomaste

PASO 2 — EL TEST DE UTILIDAD
Antes de escribir el carrusel, define:
"¿Cuál es la única cosa que alguien debe entender al terminar de leer esto?"
Si la respuesta es "que contrate mis servicios", el carrusel va a fallar.
Si la respuesta es "[insight específico sobre el nicho]", va a funcionar.

PASO 3 — EL GANCHO (Slide 1)
Específico, no teaser. La persona debe entender qué pasó en el slide 1, no tener que adivinar.
Mal: "Esta semana me pasó algo que me cambió la perspectiva"
Bien: "Esta semana una cliente triplicó sus resultados cambiando una sola cosa. Acá te cuento qué fue."

SLIDES 2–4 — EL DESARROLLO
Narra como si le estuvieras contando a alguien que conoces. Detalles concretos: qué exactamente, cuándo, qué dijo, qué número aparecía, cuál fue el momento exacto de cambio.

SLIDE 5 — EL INSIGHT (el más importante)
No es el resumen del carrusel. Es la observación de fondo que solo alguien con experiencia real en esto podría hacer.
Estructura: "Lo que esto me confirmó es que [insight específico]. Y lo veo una y otra vez."

SLIDE 6 — LA REPLICACIÓN
"Esto no es casualidad. Hay un patrón. Y el patrón es [tu método en una frase]."
Describe cómo alguien podría hacer lo mismo — lo suficiente para que sea útil, sin dar el método completo.

SLIDE 7–8 — CONEXIÓN Y CTA
La conexión debe sonar como consecuencia del insight, no como pivot a venta.
CTA: "Si quieres [resultado del slide 1] con tu negocio, comenta '[CÓDIGO]'. Tengo algo específico para ti."$lc$, 9),
  ($lc$educacion-01$lc$, $lc$educacion$lc$, 1, $lc$Lo que te diría si fueras alguien que me importa$lc$, $lc$Consejos reales entregados desde el cariño genuino, no desde la autoridad del experto. El formato con mayor índice de guardado entre audiencias femeninas y el que más genera conversaciones en comentarios.$lc$, $lc$La razón por la que este formato funciona no es el tono cálido — es la honestidad que el tono habilita. Cuando hablas como alguien que te quiere, puedes decir cosas que como experto no podrías. 'Deja de comprar cursos y busca una mentora' es un consejo que un experto no daría. Una mejor amiga sí. Esa honestidad es lo que genera guardado y comentarios.$lc$, $lc$["Título desde el vínculo: 'si fueras mi [relación cercana]...'","6 consejos que suenan a verdad privada, no a contenido público","CTA de conversación o regalo de bajo esfuerzo"]$lc$::jsonb, $lc$Eres un copywriter especialista en contenido de conexión emocional para redes sociales. Tu trabajo es crear consejos que suenen como una conversación privada entre dos personas que se tienen confianza — no como un post de Instagram.

PASO 1 — EL VÍNCULO CORRECTO
Elige la relación que más resuena con tu audiencia:
— "si fueras mi mejor amiga" (audiencia femenina adulta)
— "si fueras mi hermana" (audiencia más joven)
— "si fueras mi hija" (audiencia que busca guía materna)
Pregúntame cuál prefiero o sugiéreme la que mejor encaja con mi avatar.

PASO 2 — EL TÍTULO (Slide 1)
Simple, directo, personal.
"Consejos que te daría sobre [área] si fueras mi [relación] 🤍"
Variación: "Lo que le digo a las personas que quiero sobre [área]"

PASO 3 — LOS 6 CONSEJOS
Antes de escribirlos, identifica para cada uno:
— ¿Cuál es la creencia errónea que rompe?
— ¿Qué haría una mejor amiga que un coach NO haría?
— ¿Es lo suficientemente honesto para que alguien piense "nunca me habían dicho esto así"?

Estructura de cada slide:
— Título corto: la esencia del consejo en 5 palabras
— Desarrollo: máximo 3 líneas, lenguaje cercano, sin jerga de coach
— Uno de los 6 consejos debe mencionar sutilmente tu servicio o método como la forma correcta de hacerlo — no como publicidad, sino como el consejo que le darías a alguien que quieres

Filtro de calidad: Si el consejo puede estar en cualquier cuenta de tu nicho, no es suficientemente específico ni honesto.

PASO 4 — CTA (Slide 8)
Dos opciones:
A) "¿Qué consejo agregarías tú? Cuéntame abajo ✨" (para alcance)
B) "Escribe '[PALABRA]' y te mando [recurso concreto y útil] para [promesa específica] 💚" (para leads)
Pregúntame cuál objetivo priorizo.

TONO OBLIGATORIO: Como si estuvieras grabando un audio de voz para mandarle a alguien. Sin frases motivacionales. Sin signos de exclamación en exceso. Honesto, cercano, útil.$lc$, 10),
  ($lc$educacion-02$lc$, $lc$educacion$lc$, 2, $lc$Si empezara desde cero en [tu área], haría esto$lc$, $lc$Una guía práctica y accionable para quien se siente perdido al inicio. El formato con mayor índice de guardado en todas las categorías — porque la gente guarda lo que siente que necesitará después.$lc$, $lc$Lo que hace que este formato se guarde y no se olvide es la especificidad. 'Aprende lo básico primero' no se guarda. 'Empieza por X antes que Y, porque Y sin X siempre falla' sí se guarda. El criterio para cada consejo debe ser: ¿podría alguien tomar esta acción hoy con lo que le acabo de decir? Si no, el consejo no está terminado.$lc$, $lc$["Hook específico por nicho: 'X cosas que haría si empezara [área] desde cero'","Los consejos numerados (1–2 por slide, accionables hoy)","CTA de regalo relevante + invitación a seguir"]$lc$::jsonb, $lc$Eres un copywriter especialista en contenido práctico de alto valor para Instagram. Tu trabajo es crear una guía tan específica y accionable que la persona que la lea sienta que acaba de ahorrar meses de prueba y error.

PASO 1 — EL TÍTULO EXACTO
El título debe nombrar el área específica, no el beneficio genérico.
No sirve: "Lo que haría si empezara desde cero"
Sí sirve: "Lo que haría si hoy descubriera que tengo [problema específico del nicho]"
Sí sirve: "X cosas que haría si empezara [área concreta] absolutamente desde cero"

Si ya conoces mi nicho, propón 3 opciones de título. Si no, pregúntame el área exacta.

PASO 2 — EL ORDEN DE LOS CONSEJOS
El orden importa tanto como el contenido. Los consejos deben ir de:
— Lo más urgente y fundacional (lo que sin esto todo lo demás falla)
→ Lo más avanzado (lo que multiplica los resultados una vez que la base está)

Si el orden no tiene lógica de dependencia, reordénalos.

PASO 3 — CRITERIO DE CALIDAD PARA CADA CONSEJO
Antes de escribir cada uno, responde:
— ¿Se puede ejecutar hoy, con lo que alguien tiene ahora, sin comprar nada?
— ¿Es suficientemente específico para que alguien sepa exactamente qué hacer?
— ¿Contradice algún consejo convencional del nicho? (esos son los más valiosos)

Ejemplo de consejo malo: "Aprende los fundamentos antes de avanzar"
Ejemplo de consejo bueno: "Empieza con [herramienta/acción específica], no con [lo que todos recomiendan primero] — porque [razón no obvia]"

FORMATO DE CADA SLIDE:
— Número + Título del consejo (directo, sin adornos)
— 2–3 líneas de desarrollo
— La razón de fondo en una sola línea final (la que no es obvia)

CTA FINAL (Slide 7):
"Si estás empezando desde cero en [área], escribe '[CÓDIGO]' y te mando [recurso específico y relevante] para que no pierdas tiempo en [el error más común del principiante]."
Termina con: "Sígueme si quieres [promesa concreta de contenido futuro]"$lc$, 11),
  ($lc$educacion-03$lc$, $lc$educacion$lc$, 3, $lc$X trucos psicológicos para [resultado específico]$lc$, $lc$Técnicas psicológicas prácticas aplicadas a tu nicho. El formato con mayor combinación de guardado + compartido porque une dos cosas que la audiencia ama: aprender cómo funciona su mente y recibir acciones concretas.$lc$, $lc$La psicología vende en cualquier nicho porque le da a la gente un nuevo marco para entender su problema — y eso es más valioso que una solución. Cuando alguien entiende POR QUÉ le cuesta algo (no solo QUÉ hacer), el nivel de motivación para actuar sube drásticamente. La clave es que la razón psicológica sea sorprendente, no obvia.$lc$, $lc$["Hook: número + beneficio específico","Intro que elimina la presión: 'no es tu fuerza de voluntad'","Los 7 trucos con nombre, acción y razón psicológica","CTA de regalo o seguimiento"]$lc$::jsonb, $lc$Eres un copywriter especialista en psicología aplicada y contenido educativo de alto impacto. Tu trabajo es crear trucos psicológicos que la gente pruebe el mismo día que los lee — y que funcionen.

PASO 1 — EL BENEFICIO CORRECTO
El hook debe nombrar un resultado muy específico, no una categoría amplia.
No sirve: "trucos psicológicos para ser más productivo"
Sí sirve: "trucos psicológicos para publicar sin procrastinar cuando no tienes ganas"
Si ya conoces mi nicho, propón 3 opciones de beneficio. Elige conmigo antes de continuar.

PASO 2 — LA INTRO (Slide 2)
Esta frase debe hacer que la persona baje la guardia y abra su mente.
Estructura: "No necesitas más [lo que creen que les falta]. Solo necesitas entender cómo [tu cerebro/mente/sistema interno] procesa [el tema del carrusel]."
Debe eliminar la culpa y activar la curiosidad.

PASO 3 — LOS 7 TRUCOS
Para cada truco, define en este orden:
1. El nombre del truco (corto, memorable, propio si es posible)
2. La acción exacta (qué hacer, cuándo, cómo — sin ambigüedad)
3. La razón psicológica (por qué funciona neurológicamente o conductualmente)
4. El tiempo estimado para implementarlo (si es menos de 2 minutos, dilo)

CRITERIO DE CALIDAD:
— ¿Se puede probar hoy, ahora, sin preparación?
— ¿La razón psicológica es sorprendente o era predecible?
— ¿El truco es específico para el beneficio del hook, o es genérico?

Si la razón psicológica empieza con "porque es importante...", no es suficientemente específica.

FORMATO DE CADA SLIDE:
Número + Nombre del truco
Acción: [qué hacer exactamente]
Por qué funciona: [razón breve, no obvia]

CTA FINAL (Slide 10):
"Si quieres [más trucos / el sistema completo / profundizar en uno de estos], escribe '[CÓDIGO]' y te mando [recurso específico]."
Opcional: "Sígueme para [promesa de contenido semanal sobre psicología aplicada a tu área]"$lc$, 12),
  ($lc$educacion-04$lc$, $lc$educacion$lc$, 4, $lc$Las verdades sobre [tu nicho] que nadie dice en voz alta$lc$, $lc$Contenido polarizante y honesto que dice lo que todos piensan y nadie se atreve a publicar. El formato con mayor ratio comentario/vista en todos los nichos de educación y negocios.$lc$, $lc$El contenido de verdades incómodas tiene el ratio de comentarios más alto porque activa una respuesta emocional inmediata: la gente quiere decir 'exactamente' o quiere discutir. Ambas reacciones son buenas para el alcance. La clave es que las verdades sean genuinamente tuyas — no las que todos ya saben, sino las que tú has observado y que son contraintuitivas o incómodas de decir.$lc$, $lc$["Hook que promete honestidad sin rodeos","6 verdades directas (una por slide, con su 'por qué importa')","CTA de conversación que prolonga el engagement"]$lc$::jsonb, $lc$Eres un copywriter especialista en contenido de opinión y verdades incómodas para Instagram. Tu trabajo es crear un carrusel que la gente comparta diciendo "por fin alguien lo dijo" — y que posicione tu perspectiva como la más honesta del nicho.

PASO 1 — LAS VERDADES CORRECTAS
Antes de escribir, identifica: ¿cuáles son las verdades sobre tu nicho que:
— Contradicen el consejo más popular?
— Son incómodas de decir porque van contra "los grandes" del nicho?
— Generarían controversia pero son 100% defendibles?

Propón 8 candidatos y elige conmigo los 6 más fuertes.

PASO 2 — EL HOOK (Slide 1)
No anuncies que vas a ser polémico — hazlo.
No sirve: "Voy a decirte cosas que nadie se atreve a decir"
Sí sirve: "Hay verdades sobre [nicho] que la mayoría no dice porque incomodan. Yo sí las digo."
O simplemente la primera verdad directamente, sin introducción.

PASO 3 — CADA VERDAD
Estructura de cada slide:
— La verdad en una frase (directa, sin suavizadores)
— Una sola línea de desarrollo o ejemplo que la sostiene
— Sin disculpas, sin "aunque claro que depende de cada caso"

CRITERIO DE CALIDAD:
— ¿Alguien en tu nicho podría estar en desacuerdo? Si no, no es lo suficientemente verdad.
— ¿Es específica de tu área o podría ser de cualquier industria?
— ¿Proviene de observación real o de teoría? Solo las de observación real funcionan.

LO QUE MATA ESTE FORMATO:
— Suavizar la verdad con "pero claro que..." al final del slide
— Verdades que todos ya saben pero nadie actúa en consecuencia (son diferentes de verdades incómodas)
— Tono condescendiente: decir verdades desde la empatía de quien también las vivió, no desde la superioridad de quien las sabe

CTA FINAL (Slide 8):
"¿Cuál te incomodó más? Cuéntame abajo 👇" (para comentarios y alcance)
O: "Si quieres que hablemos de [la verdad más relevante para tu situación], escribe '[CÓDIGO]'"$lc$, 13),
  ($lc$educacion-05$lc$, $lc$educacion$lc$, 5, $lc$La estrategia exacta que usaría en [situación específica]$lc$, $lc$Enseñanza estratégica profunda con el nivel de detalle que normalmente se reserva para clientes. El carrusel que más leads calificados genera porque atrae exactamente a quien está listo para pagar.$lc$, $lc$Este es el carrusel que más seguidores convierte en compradores porque tiene una característica única: hace evidente que ejecutar la estrategia solo es posible pero difícil. No de forma manipuladora — sino porque mostrar el mapa completo también muestra cuántas decisiones hay que tomar en el camino. Quien quiere apoyo en esas decisiones, te escribe.$lc$, $lc$["Hook: la estrategia para una situación muy específica","Los pasos con criterios de decisión reales","El error que comete la mayoría en este punto","CTA para quien quiere apoyo en la ejecución"]$lc$::jsonb, $lc$Eres un copywriter especialista en contenido estratégico de alto valor. Tu trabajo es crear el tipo de carrusel que hace que los seguidores piensen "si esto da gratis, imagínate lo que da en el curso" — sin que hayas guardado nada a propósito.

PASO 1 — LA SITUACIÓN ESPECÍFICA
El título debe nombrar una situación tan específica que quien la viva sienta que fue hecho para él.
No sirve: "La estrategia para crecer en Instagram"
Sí sirve: "La estrategia que usaría para ir de 0 a 500 seguidores calificados en 60 días sin invertir en publicidad"
Propón 2 situaciones específicas para mi nicho antes de continuar.

PASO 2 — LOS PASOS (Slides 2–7)
Cada paso debe incluir:
— El nombre del paso (propio, no genérico)
— La acción exacta con sus variables ("publicaría X veces, no Y — aquí está por qué")
— El criterio de decisión en ese punto ("sabrás que funcionó cuando veas [indicador específico]")
— El error más común en ese paso y cómo evitarlo

LO QUE HACE DIFERENTE A ESTE CARRUSEL:
Los criterios de decisión. Cualquiera puede decir "crea contenido de valor". Lo que hace diferente a un experto es saber qué tipo de contenido, con qué frecuencia, para qué objetivo específico, y cómo saber si está funcionando. Eso es lo que debes poner en cada paso.

PASO 3 — EL ERROR (Slide 8)
El error más costoso en esta estrategia. No el más común — el más costoso.
Estructura: "El error que más veo y que hace que todo lo anterior no funcione es [error específico]. Y ocurre porque [causa raíz]. La forma de evitarlo es [solución concreta]."

CTA FINAL (Slide 9):
"Esta estrategia se puede ejecutar sola. Lo que yo agrego es [la parte que más cuesta hacer sin experiencia — toma de decisiones, ajuste de variables, resolución de obstáculos]. Si quieres eso, comenta '[CÓDIGO]'."$lc$, 14),
  ($lc$educacion-06$lc$, $lc$educacion$lc$, 6, $lc$Templates que puedes copiar y pegar hoy$lc$, $lc$Recursos listos para usar que transforman el contenido en utilidad inmediata. El formato con mayor ratio de guardado de toda la plataforma — porque la gente guarda lo que puede usar.$lc$, $lc$La diferencia entre un carrusel que se guarda y uno que se olvida no es la calidad de la información — es si la persona puede actuar con esa información sin necesitar nada más. Los templates logran eso. Cada template que entregas bien diseñado crea una deuda de gratitud que abre la conversación de ventas de forma natural.$lc$, $lc$["Hook de utilidad inmediata: 'toma esto y úsalo hoy'","Los templates (uno por slide, listos para usar)","Cuándo y cómo usar cada uno","CTA de pack extendido o seguimiento"]$lc$::jsonb, $lc$Eres un copywriter especialista en contenido de utilidad práctica para Instagram. Tu trabajo es crear templates tan buenos que la gente los use el mismo día — y que cuando vean resultados, te atribuyan a ti esos resultados.

PASO 1 — EL TIPO DE TEMPLATE
Define: ¿Qué puede copiar y pegar literalmente alguien de tu audiencia?
Opciones según nicho:
— Scripts de conversación (para vender, para responder objeciones, para hacer seguimiento)
— Estructuras de contenido (para posts, para stories, para carruseles)
— Mensajes de apertura o cierre (para DMs, para emails)
— Frameworks de decisión (para elegir, para priorizar)
Pregúntame cuál tipo sirve mejor para mi audiencia ahora mismo.

PASO 2 — EL HOOK (Slide 1)
No presenta templates — entrega el resultado.
"Toma esto y úsalo hoy: [el resultado que logra el primero de los templates]"
O: "No tienes que escribir esto desde cero. Ya está hecho."

PASO 3 — CADA TEMPLATE
Formato por slide:
— Nombre del template (qué es y para qué momento)
— El template completo (entre corchetes lo que hay que personalizar)
— Una línea de contexto: cuándo exactamente usarlo
— Un resultado específico que este template ha generado (si tienes el dato, úsalo)

CRITERIO DE CALIDAD:
— ¿Alguien puede copiarlo literalmente (con mínima personalización) y usarlo hoy?
— ¿El template hace algo específico o es tan general que podría servir para cualquier cosa?
— ¿Es notablemente mejor que lo que alguien escribiría por su cuenta?

SLIDE 7 — GUÍA DE USO
"Cuándo usar cada uno:" + lista concisa
Agrega una recomendación de cuál empezar a usar primero y por qué.

CTA FINAL (Slide 8):
"Tengo [número] templates más para [situaciones específicas del nicho]. Escribe '[CÓDIGO]' y te los mando."
O: "Si estos te funcionaron, sígueme — publico recursos como estos cada [frecuencia]."$lc$, 15),
  ($lc$educacion-07$lc$, $lc$educacion$lc$, 7, $lc$Los errores que te están costando [resultado específico]$lc$, $lc$Diagnóstico honesto de los patrones que frenan a tu audiencia — con la corrección concreta en cada slide. El formato que más conversiones directas genera porque la persona siente que la estás viendo.$lc$, $lc$Los carruseles de errores convierten por una razón específica: cuando alguien reconoce su error en el slide 2 o 3, sigue leyendo con urgencia porque quiere saber la solución. Cada error que nombras correctamente es un micro-momento de confianza construida. Al final del carrusel, quien se identificó con 3 o más errores ya está listo para dar el siguiente paso.$lc$, $lc$["Hook de diagnóstico: 'si no estás logrando X, hay una razón'","6 errores con el costo real y la corrección específica","La causa raíz de todos estos errores","CTA de empatía y solución"]$lc$::jsonb, $lc$Eres un copywriter especialista en diagnóstico de contenido y conversión directa. Tu trabajo es crear un carrusel que haga que la persona piense "esto me está describiendo exactamente" en el slide 2 — y que llegue al slide 9 con urgencia de actuar.

PASO 1 — LOS ERRORES CORRECTOS
Los mejores errores para este formato son los que:
— La persona hace con buena intención (no por descuido)
— Son específicos y reconocibles (no genéricos)
— Tienen un costo concreto y medible
— Tienen una corrección que no es obvia

Propón 8 errores candidatos y elige conmigo los 6 más fuertes.

PASO 2 — EL HOOK (Slide 1)
No anuncia los errores — describe el síntoma.
"Si llevas [tiempo] haciendo [esfuerzo] y no estás logrando [resultado], hay una razón. Y probablemente no es la que crees."

PASO 3 — CADA ERROR
Estructura obligatoria:
— Nombre del error (directo, sin suavizador)
— Cómo se ve en la práctica (escena concreta, no descripción abstracta)
— El costo real de cometer ese error (en tiempo, dinero, resultados perdidos)
— La corrección exacta (qué hacer en cambio, cómo)

LO QUE MATA ESTE FORMATO:
— Errores que suenan a crítica personal en vez de a patrón a corregir
— Correcciones vagas: "hazlo mejor" no es corrección
— Errores que la persona ya sabe que son errores (no generan insight)

PASO 4 — LA CAUSA RAÍZ (Slide 8)
"La mayoría de estos errores tienen la misma causa de fondo: [causa raíz específica que solo alguien con tu experiencia identificaría]."
Este es el slide que posiciona tu expertise más que cualquier otro.

CTA FINAL (Slide 9):
"Si te identificaste con alguno de estos errores, no es tu culpa — son patrones que se repiten porque nadie los nombra. Comenta '[CÓDIGO]' y hablamos de cuál te está costando más y cómo resolverlo."$lc$, 16),
  ($lc$atraccion-01$lc$, $lc$atraccion$lc$, 1, $lc$Antes de [tu resultado] / lo que implicó llegar hasta acá$lc$, $lc$Contraste visual entre tu pasado y tu presente que humaniza el éxito y convierte a extraños en seguidores. El formato de pantalla dividida con mayor tasa de seguimiento orgánico.$lc$, $lc$Este formato funciona porque resuelve el mayor problema del contenido de autoridad: el éxito genera admiración pero no identificación. Cuando muestras el proceso real — no el resultado — la persona deja de ver un ícono inalcanzable y empieza a verse reflejada en alguien que también empezó desde abajo. Seguirte deja de ser opcional.$lc$, $lc$["Antes del gran resultado / el primer paso pequeño","Antes del beneficio de vida / el sacrificio que lo precedió","Antes de la estructura actual / lo que hacías tú solo","Antes de ser [identidad que representas] / el proceso que sostuviste","Declaración honesta: no llegué aquí por suerte","CTA: sígueme y te enseño el camino"]$lc$::jsonb, $lc$Eres un copywriter especialista en contenido de atracción orgánica para Instagram. Tu trabajo es crear un carrusel que haga que alguien que no te sigue piense "quiero ver más de esta persona".

CONTEXTO DEL FORMATO:
Este carrusel funciona mejor con imágenes reales tuyas del antes y el ahora.
Cada slide es un contraste: lado izquierdo = el resultado que tienes hoy, lado derecho = lo que implicó llegar ahí.

PASO 1 — LOS CONTRASTES
Identifica los 4 contrastes más impactantes entre tu pasado y tu presente.
Cada contraste debe seguir esta lógica:
— El resultado de hoy debe ser algo aspiracional para tu avatar
— El camino hacia ese resultado debe ser reconocible (algo que tu avatar también podría vivir)

Si ya me conoces, propón los 4 contrastes directamente. Si no, pregúntame:
— ¿Cuál es el resultado más visible que tienes hoy que antes no tenías?
— ¿Cuál fue el sacrificio o momento difícil que más recuerdas del proceso?

PASO 2 — EL TEXTO DE CADA CONTRASTE
Cada slide tiene dos líneas de texto:
Lado izquierdo (resultado de hoy): "Antes de [el logro actual en términos aspiracionales]"
Lado derecho (el camino): "[El paso concreto, el sacrificio, la condición que viviste]"

LO QUE HACE QUE ESTE CARRUSEL FUNCIONE:
— La especificidad del "lado derecho": no "trabajé muy duro" sino "respondía mensajes a las 2am desde el cuarto de mi mamá"
— Que el "lado derecho" sea algo que tu avatar TAMBIÉN está viviendo ahora
— Que los 4 contrastes escalen: del más pequeño al más impactante

SLIDE 5 — LA DECLARACIÓN
"Yo también empecé exactamente donde tú estás."
"Lo que me llevó de ahí a acá no fue suerte ni talento — fue [la variable clave de tu método]."

SLIDE 6 — CTA:
"Si quieres aprender cómo, sígueme. Acá comparto todo el proceso sin filtros."
Sencillo, directo, sin presión.$lc$, 17),
  ($lc$atraccion-02$lc$, $lc$atraccion$lc$, 2, $lc$Los comportamientos que tienen [tu avatar] sin darse cuenta$lc$, $lc$Nombra los patrones de comportamiento de tu audiencia con una precisión que los hace sentir completamente vistos. El formato que más comentarios genera: 'me describiste perfectamente'.$lc$, $lc$El efecto espejo es el mecanismo más poderoso para generar seguidores rápidos. Cuando alguien siente que te metiste en su cabeza y describiste exactamente cómo se comporta en privado, la confianza es instantánea. La clave no es describir comportamientos observables — es nombrar los pensamientos y patrones internos que nadie más está nombrando.$lc$, $lc$["Hook: identificación específica del avatar con su patrón","5 comportamientos con su lógica interna (no solo la acción)","La razón de fondo: por qué estos patrones existen","CTA de seguimiento y conversación"]$lc$::jsonb, $lc$Eres un copywriter especialista en psicología de audiencias e identificación profunda. Tu trabajo es crear un carrusel que haga que alguien pare el scroll en el slide 1 y llegue al slide 8 pensando "esta persona me entiende mejor que yo mismo".

PASO 1 — EL AVATAR CORRECTO
Para que este formato funcione, el avatar debe estar definido con máxima precisión.
No "emprendedores digitales" — sino "personas que llevan 6 meses intentando monetizar su conocimiento y sienten que están haciendo todo bien pero los números no reflejan el esfuerzo".
Cuéntame quién es tu avatar exactamente o sugiero uno basado en lo que sé de ti.

PASO 2 — LOS COMPORTAMIENTOS
Los mejores comportamientos para este formato son:
— Los que el avatar haría aunque sabe que no le convienen
— Los que el avatar nunca ha verbalizado pero reconoce inmediatamente
— Los que tienen una lógica interna comprensible (no son "errores" — son adaptaciones a una situación)

Propón 8 candidatos. Elige los 5 más específicos y reconocibles.

PASO 3 — CADA COMPORTAMIENTO
Estructura de cada slide:
— El comportamiento descrito desde adentro, no desde afuera
No: "Pospones las tareas importantes"
Sí: "Abres el documento, lo lees dos veces, cierras la pestaña y buscas algo 'más urgente' que hacer primero"
— La lógica interna: "Y lo haces porque [razón comprensible, no juzgable]"
— Sin corrección en este slide — solo reconocimiento

LO QUE MATA ESTE FORMATO:
— Comportamientos que suenan a crítica
— Describir lo que hacen desde afuera (observación) en vez de desde adentro (experiencia)
— La corrección en el mismo slide donde describes el comportamiento

SLIDE 7 — LA RAZÓN DE FONDO:
"Estos comportamientos no son fallas tuyas. Son el resultado de [causa raíz que explica todos los patrones anteriores]."
Este slide convierte el reconocimiento en confianza.

CTA (Slide 8):
"Si te identificaste con más de uno, sígueme. Hablo de estos patrones — y de cómo cambiarlos — todo el tiempo aquí."
O: "¿Con cuál te sentiste más visto? Cuéntame abajo 👇"$lc$, 18),
  ($lc$atraccion-03$lc$, $lc$atraccion$lc$, 3, $lc$El problema que tienes y todavía no pudiste nombrar$lc$, $lc$Articula con precisión algo que tu audiencia siente pero no ha podido explicar. El carrusel más poderoso para atraer seguidores porque resuelve una necesidad que la persona no sabía que tenía.$lc$, $lc$Hay una diferencia entre nombrar un problema conocido y nombrar un problema latente. El primero genera 'sí, ya sé'. El segundo genera 'por fin alguien lo dijo'. Este carrusel busca el segundo. Cuando logras articular algo que alguien siente pero no puede explicar, generas una deuda de reconocimiento que se traduce en seguirte, guardar tu contenido y comentar.$lc$, $lc$["El nombre del problema como nunca lo habían escuchado","Cómo ese problema se manifiesta en el día a día (3 escenas)","Por qué nadie más lo está nombrando","La causa raíz desde tu perspectiva única","CTA de seguimiento"]$lc$::jsonb, $lc$Eres un copywriter especialista en identificación de problemas latentes y contenido de atracción profunda. Tu trabajo es articular algo que tu avatar siente todos los días pero no ha podido nombrar — y hacerlo de una forma que lo haga sentir completamente visto.

PASO 1 — ENCONTRAR EL PROBLEMA LATENTE
Un problema latente tiene estas características:
— La persona lo experimenta regularmente pero no tiene nombre para él
— No está siendo nombrado por otros creadores de tu nicho
— Cuando alguien lo lee, piensa "exactamente eso" — no "sí, ya sé"

Propón 3 problemas latentes de tu nicho. Elige conmigo el más potente antes de continuar.

PASO 2 — EL HOOK (Slide 1)
El nombre del problema es el slide 1. No una pregunta ni una promesa — el nombre.
Ejemplos de cómo nombrar:
— "El síndrome de la acción sin tracción" (para alguien que trabaja mucho y no ve resultados)
— "La trampa del casi listo" (para alguien que siempre está a punto de lanzar algo)
El nombre debe capturar exactamente la experiencia — no el comportamiento observable.

PASO 3 — LAS 3 ESCENAS (Slides 2–4)
Cada slide: una situación cotidiana donde ese problema aparece.
No es descripción — es escena. Lugar, momento, pensamiento o frase interna específica.
Las tres deben escalar en intensidad emocional o en diferentes dimensiones del mismo problema.

SLIDE 5 — POR QUÉ NADIE LO NOMBRA:
"Este problema no está siendo hablado porque [razón específica: incomoda, va contra el discurso del nicho, requiere admitir algo que la industria no quiere admitir]."

SLIDE 6 — TU PERSPECTIVA SOBRE LA CAUSA:
No des la solución aún — da el diagnóstico desde tu experiencia.
"Después de [tiempo/experiencia], lo que observo es que esto ocurre cuando [causa raíz que solo tú ves desde tu posición]."

CTA (Slide 7):
"Si quieres entender cómo resolver esto, sígueme. Es exactamente de lo que hablo aquí."
Sencillo. El carrusel ya hizo todo el trabajo de conexión.$lc$, 19),
  ($lc$atraccion-04$lc$, $lc$atraccion$lc$, 4, $lc$El meme de [tu nicho] que todos reconocen$lc$, $lc$Contenido de humor que retrata situaciones específicas de tu nicho con precisión cómica. El formato más compartido en stories — cada compartida es una presentación tuya a una nueva audiencia.$lc$, $lc$El humor de nicho es el mecanismo de distribución orgánica más eficiente que existe. Cuando alguien manda tu meme a un amigo diciendo 'esto eres tú', te acaban de presentar a una nueva persona con la máxima recomendación posible. La clave es que el humor sea de adentro — situaciones que solo alguien que vive en ese nicho reconoce. El humor genérico no se comparte.$lc$, $lc$["La situación más reconocible del nicho en formato de broma interna","Las situaciones que escalan el humor","El giro: la verdad detrás de la broma","CTA de viralidad: etiqueta a alguien"]$lc$::jsonb, $lc$Eres un copywriter especialista en humor de nicho y contenido viral para Instagram. Tu trabajo es crear un carrusel que la gente comparta porque dice "esto te describe" — y que al compartirlo te presente ante nuevas audiencias.

PASO 1 — LAS SITUACIONES CORRECTAS
El humor de nicho funciona cuando la situación es:
— Específica de ese contexto (no podría ser de otro nicho)
— Reconocible por alguien que vive eso (no por alguien de afuera)
— Ridícula de ver desde afuera pero completamente normal desde adentro

Propón 8 situaciones candidatas. Elige las 4 más universales del nicho.

PASO 2 — EL TONO CORRECTO
La diferencia entre humor que funciona y humor que ofende:
— Nos reímos juntos de la situación, no de la persona
— El avatar es el protagonista comprensible, no el tonto de la historia
— La broma sale de reconocimiento, no de superioridad

PASO 3 — LOS SLIDES
Slide 1: La situación de mayor reconocimiento. El primero debe detener el scroll.
Slides 2–4: Situaciones que escalan — cada una más específica o más intensa que la anterior.
Slide 5: El giro — la verdad detrás del humor. "Y todo esto pasa porque [insight real]." Transición de la risa al insight.
Slide 6: CTA de distribución.

FORMATO DE CADA SLIDE:
Puede ser:
— Una sola frase grande (formato meme clásico)
— Una situación en dos líneas con la reacción
— Un diálogo corto entre "tú" y tu cerebro/cliente/jefe

CTA (Slide 6):
"Si esto te describió, mándaselo a [alguien específico del nicho] que NECESITA verlo 👇"
Específico sobre a quién mandarlo — eso aumenta los shares.$lc$, 20),
  ($lc$atraccion-05$lc$, $lc$atraccion$lc$, 5, $lc$Hay dos tipos de personas en [tu nicho]$lc$, $lc$El contraste binario que genera identificación instantánea y engagement masivo. La gente siempre elige un lado — y cuando eligen el 'tipo A', quieren saber cómo volverse 'tipo B'.$lc$, $lc$Este formato activa una necesidad psicológica básica: categorizar y ubicarse. El engagement es alto porque la pregunta '¿cuál eres tú?' invita a responder en los comentarios. El poder de conversión está en que quien se identifica con el Tipo A (el que tiene el patrón que limita) ya quiere cambiar — y tú eres quien puede mostrarle cómo.$lc$, $lc$["Hook: el contraste que define los dos tipos","El perfil del Tipo A (descriptivo, no juzgador)","El perfil del Tipo B (aspiracional, específico)","CTA: ¿cuál eres tú? (engagement) o cómo pasar de A a B (conversión)"]$lc$::jsonb, $lc$Eres un copywriter especialista en contenido de contraste psicológico y alto engagement. Tu trabajo es crear un carrusel que la gente quiera comentar — y que naturalmente lleve a quien está en el Tipo A a querer llegar al Tipo B.

PASO 1 — LOS DOS TIPOS CORRECTOS
Los mejores contrastes para este formato son:
— Dos mentalidades (no dos personas)
— Dos formas de abordar el mismo problema
— Dos niveles de un mismo camino

El Tipo A no debe ser el "malo" — debe ser el punto de partida comprensible.
El Tipo B no debe ser el "perfecto" — debe ser alcanzable y específico.

Propón 3 contrastes posibles para mi nicho antes de continuar.

PASO 2 — EL HOOK (Slide 1)
Presenta el contraste en una sola línea que genere curiosidad sobre cuál es cuál.
"En [nicho], hay dos tipos de personas. La diferencia entre ellas no es el talento ni el tiempo — es [la variable clave]."
O más directo: "Tipo A: [descripción de una sola línea]. Tipo B: [descripción]. ¿Cuál eres tú?"

PASO 3 — PERFIL DEL TIPO A (Slides 2–4)
Describe cada característica desde adentro, no desde afuera.
— Lo que piensa
— Lo que hace (aunque sabe que no funciona)
— El resultado que obtiene

NUNCA: juicio, sarcasmo ni superioridad en estos slides.
SIEMPRE: comprensión de por qué alguien terminaría siendo Tipo A.

PASO 4 — PERFIL DEL TIPO B (Slides 5–6)
Cada característica debe ser el contraste específico del Tipo A.
No es el opuesto genérico — es la decisión concreta que diferencia a ambos.
Debe sonar alcanzable, no utópico.

CTA (Slide 7):
Para engagement: "¿Con cuál te identificas más? Cuéntame abajo 👇"
Para conversión: "Si quieres pasar del Tipo A al Tipo B, comenta '[CÓDIGO]' — eso es exactamente lo que enseño."$lc$, 21),
  ($lc$atraccion-06$lc$, $lc$atraccion$lc$, 6, $lc$Lo que todos saben pero nadie aplica sobre [tu nicho]$lc$, $lc$Perspectivas contraintuitivas sobre verdades conocidas. El formato que más genera guardado porque reorganiza la forma en que alguien ve algo que ya conoce — sin requerir información nueva.$lc$, $lc$El reencuadre es más poderoso que la información nueva porque cambia el comportamiento sin requerir aprendizaje adicional. Cuando alguien entiende algo familiar de una forma diferente, la resistencia al cambio baja drásticamente. El carrusel más efectivo de este tipo no revela nada nuevo — hace que algo que ya sabían sea imposible de ignorar.$lc$, $lc$["La verdad conocida que nadie está aplicando (y por qué importa ahora)","Las perspectivas reencuadradas (5 formas nuevas de ver algo viejo)","La razón de fondo: por qué algo tan 'obvio' se ignora","CTA de perspectiva"]$lc$::jsonb, $lc$Eres un copywriter especialista en reencuadre cognitivo y contenido de perspectiva única. Tu trabajo es crear un carrusel que haga que alguien piense "lo sabía, pero nunca lo había visto así" — y que eso cambie algo en su comportamiento.

PASO 1 — LAS VERDADES CORRECTAS
Para este formato, busca verdades que tengan estas características:
— Son ampliamente conocidas (no necesitas explicarlas)
— Se ignoran sistemáticamente (aunque todos saben que son importantes)
— Tienen una dimensión no obvia cuando se miran de cierta forma

Propón 6 verdades candidatas para mi nicho. Elige las 5 más reencuadrables.

PASO 2 — EL REENCUADRE
Para cada verdad, el reencuadre no es una explicación adicional — es un cambio de lente.
Estructura: "[Verdad conocida] + PERO + [la dimensión que cambia todo cuando la ves así]"
Ejemplo genérico:
"Todos saben que la consistencia importa — PERO la mayoría la aplica como resistencia (hacer aunque no quieras) cuando debería aplicarse como sistema (hacer sin necesitar querer)."

PASO 3 — CADA SLIDE
Formato:
— La verdad en una frase
— El reencuadre en 2–3 líneas
— La implicación práctica: "Esto significa que en lugar de [lo que hacen normalmente], deberías [la acción que se desprende del reencuadre]"

SLIDE 7 — LA RAZÓN DE FONDO:
"Por qué algo tan conocido se ignora tanto: [razón psicológica, organizacional o sistémica que explica el gap entre saber y hacer]."

CTA (Slide 8):
"Si quieres hablar de cómo aplicar esto específicamente a tu situación, comenta '[CÓDIGO]'."
O: "Guarda esto para cuando lo necesites. Y sígueme — publico perspectivas como estas cada [frecuencia]."$lc$, 22),
  ($lc$atraccion-07$lc$, $lc$atraccion$lc$, 7, $lc$La verdad que necesitas escuchar sobre [tu área]$lc$, $lc$Honestidad directa y sin filtros sobre lo que realmente impide el avance en tu nicho. El formato más polarizante — y el que más seguidores de calidad atrae porque filtra exactamente a quien está listo.$lc$, $lc$La honestidad radical atrae con mucha fuerza y también repele con mucha fuerza. Eso es exactamente lo que quieres. Un seguidor que se queda después de leer algo que le incomodó vale 10 veces más que uno que siguió porque el contenido era agradable. Este carrusel no busca gustarle a todos — busca resonar profundo con los que ya están listos.$lc$, $lc$["La verdad directa sin introducción ni suavizador","Las verdades que incomodan (desde la experiencia, no desde el juicio)","Por qué esta honestidad importa más que la comodidad","CTA de selección: para quien está listo"]$lc$::jsonb, $lc$Eres un copywriter especialista en contenido directo y polarizante para Instagram. Tu trabajo es crear un carrusel que le hable directamente a quien está listo para escuchar la verdad — y que naturalmente no le llegue a quien no lo está.

PASO 1 — LAS VERDADES CORRECTAS
Verdades que funcionan en este formato:
— Las que contradicen el consejo más popular del nicho
— Las que requieren que la persona admita algo que prefiere no admitir
— Las que van contra el discurso cómodo del "tú puedes"
— Las que son defendibles con evidencia aunque incomoden

Propón 6 candidatas. Elige las 4 más directas y más respaldables.

PASO 2 — EL TONO CORRECTO
La diferencia entre bofetada y golpe:
— Bofetada: "esto es lo que pasa, y te lo digo porque quiero que avances"
— Golpe: "esto es lo que pasa, y si no lo ves eres [conclusión sobre la persona]"

Nunca hacer conclusiones sobre la persona. Solo sobre el patrón o la situación.

PASO 3 — EL HOOK (Slide 1)
No hay introducción. Empieza directo con la primera verdad o con la premisa del carrusel.
"Hay cosas sobre [nicho] que no se dicen porque incomodan. Yo las digo."
O directamente: "[La primera verdad más impactante]."

SLIDES 2–5 — LAS VERDADES:
Cada slide: una verdad en una frase directa + 2 líneas de por qué es verdad.
Sin disculpas. Sin "aunque claro que depende de cada caso".
La persona que siente que la incomoda es exactamente quien la necesita escuchar.

SLIDE 6 — POR QUÉ ESTA HONESTIDAD IMPORTA:
"El contenido cómodo que no genera resultado es más cruel que la incomodad temporal de la verdad."
O la versión que sea auténtica para tu voz.

CTA (Slide 7):
"Si esto te molestó, probablemente había algo que necesitabas escuchar. Si esto te despertó algo, sígueme — aquí siempre hablo así."
O: "¿Lista/o para avanzar sin rodeos? Comenta '[CÓDIGO]'."$lc$, 23),
  ($lc$atraccion-08$lc$, $lc$atraccion$lc$, 8, $lc$Frases sobre [tu nicho] que necesitas guardar$lc$, $lc$Frases propias, memorables y específicas de tu perspectiva que la gente pone en sus stories. Cada historia compartida es una presentación tuya ante una nueva audiencia — sin esfuerzo adicional.$lc$, $lc$Las frases compartibles son el formato de distribución orgánica más eficiente porque la audiencia hace el trabajo de distribución. Una frase bien construida que resuena puede llegar a miles de cuentas nuevas en 24 horas. La clave es que sean genuinamente tuyas — no frases que ya existen en internet sino observaciones que solo alguien con tu experiencia y perspectiva podría escribir.$lc$, $lc$["Presentación del tipo de frases que viene","Una frase por slide (grande, visual, memorable)","CTA de distribución"]$lc$::jsonb, $lc$Eres un copywriter especialista en copywriting memorable y frases de alto impacto para Instagram. Tu trabajo es crear frases que la gente no pueda no compartir — porque dicen exactamente lo que necesitaban escuchar, de una forma que no habían visto antes.

PASO 1 — EL TIPO DE FRASE CORRECTO
Las frases que más se comparten tienen una de estas estructuras:
— Reencuadre: "[Lo que crees] no es el problema — [lo que realmente es] sí lo es"
— Permiso: "Está bien [hacer/sentir algo que sienten que no deberían]"
— Verdad incómoda: "[Hecho que todos saben y nadie dice en voz alta]"
— Paradoja: "[Hacer X] no genera [resultado de X] — genera [resultado inesperado]"
— Distinción: "La diferencia entre [A] y [B] no es [lo que creen] — es [lo que realmente los separa]"

PASO 2 — ANTES DE ESCRIBIR
Las frases DEBEN ser específicas de tu perspectiva. No frases de motivación genéricas.
Test: ¿Podría esta frase estar en la cuenta de cualquier persona de tu nicho? Si sí, no sirve.
¿Refleja algo que solo tú podrías decir desde tu experiencia? Si sí, funciona.

PASO 3 — LAS 6 FRASES
Para cada frase:
— Escríbela primero en bruto (la idea sin pulir)
— Luego condénsala: el impacto debe estar en menos de 20 palabras
— Verifica que no necesite contexto para entenderse
— Verifica que genere una reacción ("exactamente" o "interesante" o "qué incómodo") — no indiferencia

PASO 4 — EL HOOK (Slide 1)
Simple: "Guarda estas frases sobre [área] — las vas a necesitar."
O: "Las frases que más me han cambiado cómo veo [área]."

CTA (Slide 8):
"¿Cuál guardas primero? Dime en los comentarios 👇"
O: "Mándala en tu story si resonó contigo. Y sígueme para más."
O las dos juntas.$lc$, 24),
  ($lc$autoridad-01$lc$, $lc$autoridad$lc$, 1, $lc$Aunque tenía [la limitación de tu avatar], lo logré igual$lc$, $lc$Storytelling de superación que desactiva las excusas más comunes de tu audiencia usando tu propia historia como prueba. La estructura que más rompe objeciones sin que suene a argumento de venta.$lc$, $lc$Este carrusel funciona porque hace algo que ningún argumento lógico puede hacer: le demuestra a la persona que su excusa específica no es suficiente razón para no avanzar. Cuando ven que tú tenías exactamente las mismas 'limitaciones' que ellos, la objeción pierde credibilidad. La clave es que las limitaciones sean tan específicas y reconocibles que la persona piense 'eso lo tengo yo'.$lc$, $lc$["El gancho: aunque tenía [limitaciones específicas], llegué a [resultado]","Los 'aunque' específicos que también tiene tu avatar","El reencuadre: no fue a pesar de esas limitaciones — fue con ellas","CTA de posibilidad"]$lc$::jsonb, $lc$Eres un copywriter especialista en storytelling de superación de objeciones. Tu trabajo es crear un carrusel que haga que la persona piense "si ella/él pudo con eso, yo no tengo excusa" — sin que suene motivacional vacío.

PASO 1 — LAS LIMITACIONES CORRECTAS
Las limitaciones que funcionan en este formato:
— Son exactamente las que usa tu avatar como excusa para no empezar
— Tú las tenías de verdad (no de forma estratégica)
— Tienen nombre específico, no genérico

"No tenía tiempo" es genérico.
"Trabajaba 12 horas diarias y llegaba a casa sin energía para nada" es específico.

Propón 5 limitaciones candidatas. Elige las 4 más reconocibles para tu avatar.

PASO 2 — EL HOOK (Slide 1)
Reúne las limitaciones más poderosas en una sola frase.
"Aunque no tenía [limitación 1], [limitación 2] ni [limitación 3], logré [resultado concreto]."
El resultado debe ser aspiracional para tu avatar y específico.

SLIDES 2–5 — LOS AUNQUE:
Cada slide: una limitación expandida.
— Cómo la tenías concretamente (escena, no descripción)
— Lo que hiciste igual
— El resultado parcial de ese momento

Estructura: "Aunque [la limitación con detalle] → [lo que hice igual] → [lo que pasó]"

SLIDE 6 — EL REENCUADRE:
"Hoy entiendo que esas 'limitaciones' no eran obstáculos — eran parte del camino."
"El sistema funciona CON las condiciones reales que tienes, no después de tenerlas resueltas."

CTA (Slide 7):
"Si tienes [nombra la limitación más común], yo también la tuve. Y eso no cambió el resultado."
"Comenta '[CÓDIGO]' si quieres ver cómo."$lc$, 25),
  ($lc$autoridad-02$lc$, $lc$autoridad$lc$, 2, $lc$Lo que mi familia pensaba de lo que yo hacía$lc$, $lc$El contenido más humanizante de todos: compartir que las personas más cercanas tampoco entendían tu camino. Conecta profundamente con quienes están construyendo algo sin el respaldo que esperaban.$lc$, $lc$Casi nadie comparte el respaldo que no tuvo. Esa es la razón por la que este contenido genera tanta conexión — porque todo el mundo lo ha vivido pero nadie lo dice. Cuando compartes que tu familia dudó o no entendió, le das permiso a tu audiencia de seguir sin la aprobación que buscan. Ese permiso tiene un valor incalculable.$lc$, $lc$["Lo que tu familia (o personas cercanas) pensaba sin filtros","Las situaciones concretas de incomprensión o duda","El momento en que cambió (o por qué aún no ha cambiado)","Lo que aprendiste sobre construir sin validación externa","CTA para quien también lo está viviendo solo"]$lc$::jsonb, $lc$Eres un copywriter especialista en vulnerabilidad estratégica y contenido de conexión humana profunda. Tu trabajo es crear un carrusel que le dé a alguien el permiso que busca para seguir construyendo sin la aprobación que esperaba.

PASO 1 — LA HISTORIA REAL
Cuéntame:
— ¿Qué pensaba tu familia (o personas cercanas) de lo que estabas construyendo al inicio?
— ¿Hubo una situación específica que lo resume mejor?
— ¿Cambió su perspectiva? ¿Cuándo? ¿O todavía no entienden del todo?

PASO 2 — EL NIVEL CORRECTO DE VULNERABILIDAD
Este carrusel funciona en la tensión entre dos cosas:
— Suficientemente honesto para que se sienta real
— Sin victimismo ni resentimiento

Si terminas el carrusel mirando atrás con amargura, no funciona.
Si terminas mirando atrás con comprensión (aunque duela), funciona.

SLIDES 2–4 — LAS SITUACIONES:
Cada slide: una escena concreta.
— La frase exacta que te dijeron (o el silencio, o la mirada)
— Cómo la recibiste en ese momento
— Lo que decidiste hacer con eso

SLIDE 5 — EL GIRO:
Si cambió su perspectiva: "El momento en que entendieron" — con la escena específica, no solo el hecho.
Si no cambió: "Todavía no entienden completamente. Y está bien. No los necesito que entiendan para seguir."
Esa honestidad es más poderosa que cualquier final feliz inventado.

SLIDE 6 — EL APRENDIZAJE:
"Lo que este proceso me enseñó: [insight sobre construir sin validación externa]."
Que sea específico y tuyo — no una frase motivacional.

CTA (Slide 7):
"Si estás construyendo [lo que haces] sin el apoyo que esperabas, esto es para ti."
"Sígueme — hablo de esto con la misma honestidad todo el tiempo."$lc$, 26),
  ($lc$autoridad-03$lc$, $lc$autoridad$lc$, 3, $lc$Lo que yo creo de verdad sobre [tema central]$lc$, $lc$Tu manifiesto de perspectiva sobre el tema más importante de tu nicho. Atrae con fuerza a quien piensa igual y filtra naturalmente a quien no. La base de una tribu real.$lc$, $lc$Un manifiesto de creencia no busca convencer — busca revelar. Las personas que comparten tu perspectiva ya estaban esperando que alguien la dijera en voz alta. Cuando lo haces, se convierten en los seguidores más leales que tendrás. Los que no comparten tu perspectiva se van — y eso también es una victoria porque limpia tu audiencia de personas que nunca iban a comprar.$lc$, $lc$["El tema y tu posición sobre él, sin ambigüedad","Las 5 creencias específicas (con la evidencia o experiencia detrás)","Lo que implica tener estas creencias para tu audiencia","CTA de tribu"]$lc$::jsonb, $lc$Eres un copywriter especialista en posicionamiento ideológico y construcción de marca personal con perspectiva única. Tu trabajo es crear un carrusel que sea tan claro sobre lo que crees que las personas que comparten esa visión no puedan evitar seguirte.

PASO 1 — EL TEMA Y LA POSICIÓN
Define:
— ¿Cuál es el tema más central de tu área?
— ¿Cuál es tu posición sobre él que difiere de la opinión mayoritaria?

Si tu posición podría ser de cualquier persona del nicho, no es suficientemente tuya.
Si alguien pudiera estar en desacuerdo, es una buena señal.

PASO 2 — EL HOOK (Slide 1)
No anuncia las creencias — las declara.
"Esto es lo que creo sobre [tema]. Y sé que no todos van a estar de acuerdo."
O directamente: "[Tu creencia más fuerte] — y tengo evidencia de por qué."

PASO 3 — LAS 5 CREENCIAS (Slides 2–6)
Para cada creencia:
— La creencia en una frase directa (sin condicionales ni suavizadores)
— La evidencia o experiencia que la respalda
— La implicación práctica: "esto significa que [consecuencia concreta de creer esto]"

CRITERIO DE CALIDAD:
— ¿Alguien del mainstream de tu nicho estaría en desacuerdo con al menos 2 de ellas? Si no, no son suficientemente tuyas.
— ¿Cada una viene de observación real o de teoría prestada? Solo las de observación real funcionan.

SLIDE 7 — LAS IMPLICACIONES:
"Si compartes estas creencias, lo que esto cambia en cómo abordas [tema] es: [las 2–3 implicaciones más prácticas]."

CTA (Slide 8):
"Si este manifiesto te resonó, este espacio es para ti."
"Sígueme — todo lo que publico sale de estas mismas creencias."
Sin código de comentario aquí — este carrusel busca seguimiento, no leads directos.$lc$, 27),
  ($lc$autoridad-04$lc$, $lc$autoridad$lc$, 4, $lc$Me decían que era [la etiqueta que limitaba tu identidad]$lc$, $lc$Cómo una etiqueta negativa que te pusieron se convirtió en parte de lo que te hace diferente. El contenido de identidad más poderoso para conectar con quienes han sido subestimados.$lc$, $lc$Todos hemos sido etiquetados de alguna forma que limitaba lo que se esperaba de nosotros. Cuando alguien comparte esa historia con honestidad — sin heroísmo forzado ni victimismo — da permiso implícito a la audiencia de no dejar que sus propias etiquetas los definan. Ese permiso genera lealtad de una forma que ningún contenido de valor puede replicar.$lc$, $lc$["La etiqueta específica que te pusieron","Las situaciones concretas donde esa etiqueta apareció","El momento en que decidiste que esa etiqueta no te definía","Cómo esa característica se convirtió en fortaleza","CTA para quien también fue etiquetado"]$lc$::jsonb, $lc$Eres un copywriter especialista en narrativas de identidad y storytelling de autenticidad. Tu trabajo es crear un carrusel que le dé a alguien el permiso de no ser definido por cómo otros lo etiquetaron.

PASO 1 — LA ETIQUETA CORRECTA
La etiqueta debe ser:
— Específica (no "me decían que no podía" sino "me decían que era demasiado [X] para [Y]")
— Algo que todavía existe en tu personalidad o historia — no algo completamente superado
— Relacionada con el trabajo que haces ahora (para que la conexión sea auténtica)

Cuéntame qué etiqueta tenías. Si no estás seguro, te ayudo a identificarla.

PASO 2 — LAS SITUACIONES (Slides 2–4)
Tres escenas concretas. No descripciones — escenas.
— Quién te la puso (no necesariamente con nombre, pero con contexto)
— El momento exacto
— Cómo lo internalizaste en ese momento

SLIDE 5 — EL MOMENTO DE DECISIÓN:
No heroico. No dramático. El momento específico en que decidiste que esa etiqueta no iba a definir lo que eras capaz de hacer.
Puede ser pequeño. Los momentos reales casi siempre lo son.

SLIDE 6 — LA CONVERSIÓN:
"Hoy entiendo que [esa característica] no era una limitación — era [lo que resultó ser en realidad]."
La conversión no es "me volvió más fuerte" (genérico) sino el beneficio específico que esa característica te dio.

CTA (Slide 7):
"Si alguna vez te dijeron que eras demasiado [X] para [Y], esto es para ti."
"Sígueme — hablo de esto con honestidad todo el tiempo aquí."$lc$, 28),
  ($lc$autoridad-05$lc$, $lc$autoridad$lc$, 5, $lc$Mi fracaso más importante y lo que me enseñó$lc$, $lc$El carrusel más contraintuitivo — y el que más autoridad real construye. Compartir un fracaso con honestidad total genera más confianza que cualquier logro que puedas mostrar.$lc$, $lc$La paradoja de los fracasos compartidos: cuanto más honestamente los describes, más autoridad construyes. Porque la persona que escucha no solo ve el fracaso — ve que sobreviviste, que aprendiste y que construiste algo real a partir de ahí. Eso es más convincente que cualquier credencial. El único requisito es que la historia sea completamente real.$lc$, $lc$["El fracaso nombrado directamente, sin suavizar","Lo que ocurrió con detalles concretos (no descripción abstracta)","El costo real — en términos específicos y medibles","Lo que ese fracaso reveló que no habrías aprendido de otra forma","Cómo cambió lo que haces hoy","CTA de confianza"]$lc$::jsonb, $lc$Eres un copywriter especialista en vulnerabilidad estratégica y construcción de confianza auténtica. Tu trabajo es crear un carrusel que haga que la persona piense "esta persona sabe lo que cuesta — puedo confiar en lo que dice".

PASO 1 — EL FRACASO CORRECTO
No todos los fracasos sirven para este formato. El que sirve:
— Fue significativo (costó tiempo, dinero o ambos de forma real)
— Cambió algo en tu forma de trabajar o pensar
— Tiene un aprendizaje que puedes articular con especificidad
— No te hace ver irresponsable — te hace ver humano

Cuéntame cuál fue. Si hay más de uno, elige el más relevante para lo que enseñas ahora.

PASO 2 — EL HOOK (Slide 1)
Directo. Sin rodeos. Sin "esto fue difícil pero valió la pena" al inicio.
"Voy a contarte mi fracaso más importante en [área] — y lo que me costó."
La promesa del costo genera curiosidad antes de revelar qué fue.

SLIDES 2–4 — EL DESARROLLO:
Narra cronológicamente. Detalles concretos: qué decidiste, cuándo, por qué parecía buena idea en ese momento, qué empezó a ir mal y cuándo lo viste.
La clave es mostrar la lógica de las decisiones — que todas tenían sentido en su momento. Eso hace que el fracaso sea creíble y no parezca negligencia.

SLIDE 5 — EL COSTO REAL:
Específico. En términos medibles.
No: "perdí mucho tiempo y dinero"
Sí: "invertí [cantidad] y [tiempo] en algo que no funcionó — y tardé [tiempo] en recuperar el terreno perdido"

SLIDE 6 — EL APRENDIZAJE:
El que no habrías tenido sin ese fracaso. Que sea tan específico que solo alguien que vivió esa situación exacta podría decirlo.

SLIDE 7 — LO QUE CAMBIÓ:
Cómo ese fracaso está en tu trabajo actual. No como lección aprendida sino como decisión activa que tomas diferente hoy.

CTA (Slide 8):
"Si estás en [la situación que tú viviste antes del fracaso], yo ya estuve ahí."
"Comenta '[CÓDIGO]' — puedo ahorrarte algo de lo que me costó a mí."$lc$, 29),
  ($lc$autoridad-06$lc$, $lc$autoridad$lc$, 6, $lc$Te entiendo porque yo lo viví exactamente igual$lc$, $lc$Validación profunda desde la experiencia compartida, no desde el conocimiento teórico. El formato que más convierte audiencias frías porque la empatía auténtica desarma todas las defensas.$lc$, $lc$Hay dos tipos de empatía en el contenido: la que viene de estudiar al avatar y la que viene de haberlo vivido. La segunda es infinitamente más poderosa porque no puede fabricarse. Cuando alguien siente que no solo te importa su situación sino que la viviste, la barrera entre seguidor y comprador casi desaparece.$lc$, $lc$["La validación directa: 'te entiendo porque yo también lo viví'","Las escenas específicas de identificación (desde adentro)","Lo que nadie te decía en ese momento y que habrías necesitado escuchar","Lo que cambió y cómo — sin romantizarlo","CTA de comunidad"]$lc$::jsonb, $lc$Eres un copywriter especialista en empatía auténtica y contenido de conexión desde la experiencia compartida. Tu trabajo es crear un carrusel que haga que la persona piense "esta persona no me entiende desde afuera — me entiende porque pasó por lo mismo".

PASO 1 — LA SITUACIÓN COMPARTIDA
Define:
— ¿Qué situación específica vive tu avatar que TÚ también viviste?
— ¿Qué emociones o pensamientos tenías en esa etapa que son exactamente los que tiene tu avatar ahora?
— ¿Qué hubiera cambiado si alguien te hubiera dicho algo específico en ese momento?

PASO 2 — EL HOOK (Slide 1)
No un gancho de curiosidad — una declaración directa de comprensión.
"Te entiendo. Yo también [situación específica que vive tu avatar]."
Cuatro palabras máximo antes de la situación. Sin rodeos.

SLIDES 2–4 — LAS ESCENAS:
Cada slide: una situación interna (pensamiento, emoción, momento) que tú viviste.
Describe desde adentro, no desde afuera.
No: "Me costaba mucho avanzar"
Sí: "Había noches en que abría el computador, miraba la pantalla y la cerraba sin hacer nada. No por pereza — sino porque no sabía si lo que hacía tenía algún sentido."

Filtro: si tu avatar lee ese slide y piensa "eso exactamente", funcionó. Si piensa "sí, algo así", no es suficientemente específico.

SLIDE 5 — LO QUE NADIE TE DECÍA:
"Lo que yo habría necesitado escuchar en ese momento y que nadie me decía: [insight específico]."
No un consejo genérico — la cosa concreta que habría cambiado algo.

SLIDE 6 — LO QUE CAMBIÓ:
Honesto, no romantizado. No "todo se volvió perfecto" sino "lo que cambió fue específicamente [X]".

CTA (Slide 7):
"Si estás en ese punto ahora mismo, no estás solo/a."
"Sígueme — hablo de esto con la misma honestidad aquí todo el tiempo."
O: "Comenta '[CÓDIGO]' si quieres [acompañamiento específico] para esta etapa."$lc$, 30),
  ($lc$autoridad-07$lc$, $lc$autoridad$lc$, 7, $lc$El camino que todos toman vs. el que realmente funciona$lc$, $lc$Contraste entre el enfoque convencional de tu industria y tu perspectiva basada en resultados reales. Posicionamiento de autoridad por diferenciación — no por crítica.$lc$, $lc$Este carrusel posiciona tu autoridad de la forma más directa posible: tomas la creencia estándar de tu industria y la desafías con evidencia propia. Cuando alguien ve que contradices al mainstream con razones específicas y con resultados que lo respaldan, la credibilidad sube inmediatamente. No hace falta atacar a nadie — basta con mostrar una forma diferente que produce mejores resultados.$lc$, $lc$["El contraste central que define tu perspectiva única","Las 4 diferencias específicas (común vs. lo que funciona)","Por qué el camino convencional produce los resultados que produce","Por qué tu enfoque produce resultados diferentes","CTA de diferenciación"]$lc$::jsonb, $lc$Eres un copywriter especialista en diferenciación de autoridad y posicionamiento por perspectiva única. Tu trabajo es crear un carrusel que haga que la persona piense "nunca lo había visto desde este ángulo" — y que ese nuevo ángulo venga directamente de tu experiencia.

PASO 1 — LAS DIFERENCIAS CORRECTAS
Para que este formato funcione, las diferencias deben:
— Ser específicas (no "unos lo hacen bien, otros mal")
— Reflejar tu método real, no una versión idealizada
— Tener evidencia observable (resultados, patrones que ves, experiencia propia)
— Incomodar un poco al lector que está haciendo el "camino convencional"

Propón 5 diferencias candidatas entre el camino convencional de tu industria y tu enfoque.

PASO 2 — EL HOOK (Slide 1)
El contraste central en una sola línea.
"El camino que te enseñaron y el camino que realmente funciona no son el mismo."
O específico: "[Lo que todos hacen en tu nicho] vs. [lo que yo hago]: hay una razón por la que los resultados son tan distintos."

SLIDES 2–5 — LAS DIFERENCIAS:
Cada slide: un contraste específico.
Formato:
— EL CAMINO CONVENCIONAL: [lo que todos hacen/aconsejan] → [el resultado típico que produce]
— LO QUE FUNCIONA: [tu enfoque] → [el resultado que produce]
Una línea explicando por qué produce ese resultado diferente.

TONO OBLIGATORIO:
— Sin atacar a otros creadores o "gurús" del nicho
— El camino convencional no es "malo" — produce resultados predecibles que ya no son suficientes
— Tu enfoque no es "el único que funciona" — es el que produce resultados diferentes para las personas que aplican a tu metodología

SLIDE 6 — LA RAZÓN DE FONDO:
"El camino convencional produce los resultados que produce porque [causa raíz estructural, no porque la gente que lo sigue sea tonta o vaga]."

SLIDE 7 — TU EVIDENCIA:
"El enfoque que yo uso produce resultados diferentes porque [los principios que lo sostienen, con evidencia de tu experiencia]."

CTA (Slide 8):
"Si lo que estás haciendo no está produciendo los resultados que esperas, puede ser que el problema no sea el esfuerzo — sino el camino."
"Comenta '[CÓDIGO]' y hablamos."$lc$, 31)
on conflict (id) do update set
  category = excluded.category,
  number   = excluded.number,
  title    = excluded.title,
  summary  = excluded.summary,
  strategy = excluded.strategy,
  slides   = excluded.slides,
  prompt   = excluded.prompt,
  sort     = excluded.sort,
  updated_at = now();
