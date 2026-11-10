/**
 * Ángulos de contenido: la "estrategia" detrás de una pieza.
 *
 * Idea = el tema. Ángulo = cómo lo abordas. Formato = cómo se ve.
 * Cada ángulo define la secuencia de pasos (beats) que sigue la pieza, para qué sirve (objetivo)
 * y cómo encontrar ideas para él. Los textos son guías con tokens que el motor completa con la marca:
 * {core} idea · {aud} público · {outcome} resultado · {kw} tema clave · {niche} nicho · {brand} marca · {cta} palabra.
 */
import type { ToneId } from './types';

export type Objective = 'atraer' | 'conectar' | 'convertir';

export interface Beat {
  label: string;
  guide: string;
}

export interface Angle {
  id: string;
  name: string;
  objective: Objective;
  tone: ToneId;
  summary: string;
  /** Pregunta para encontrar una idea real para este ángulo. */
  ask: string;
  beats: Beat[];
  /** Títulos de idea para el generador de chispas. */
  titles: [string, string];
  keywords: string[];
}

export const OBJECTIVES: Record<Objective, { id: Objective; name: string; desc: string; tip: string }> = {
  atraer: {
    id: 'atraer',
    name: 'Atraer',
    desc: 'Llegar a personas nuevas que todavía no te conocen.',
    tip: 'Termina invitando a seguirte a cambio de algo concreto. Habla a quien está un paso por encima de tu público: los que están un escalón abajo vendrán detrás.',
  },
  conectar: {
    id: 'conectar',
    name: 'Conectar',
    desc: 'Crear vínculo y confianza con quien ya te sigue.',
    tip: 'Aquí no se vende: se muestra criterio, historia y valores. La confianza que se construye en esta etapa es la que después convierte.',
  },
  convertir: {
    id: 'convertir',
    name: 'Convertir',
    desc: 'Invitar a dar un paso: escribirte, reservar o comprar.',
    tip: 'Una sola acción clara por pieza, apoyada en prueba real y, si existe, en una escasez legítima (cupos o fechas verdaderas).',
  },
};

export const OBJECTIVE_LIST = [OBJECTIVES.atraer, OBJECTIVES.conectar, OBJECTIVES.convertir];

const A = (a: Angle) => a;

export const ANGLES: Angle[] = [
  /* ───────────── ATRAER ───────────── */
  A({
    id: 'viral',
    name: 'Viral con demora',
    objective: 'atraer',
    tone: 'giro',
    summary: 'Gancho emocional, una historia o metáfora que retrasa la respuesta y una recompensa final. Pensado para alcance.',
    ask: '¿Qué dato, comparación o historia sorprendente tienes sobre {kw}?',
    beats: [
      { label: 'Gancho', guide: 'Una emoción fuerte en pocas palabras sobre {core}: sorpresa, miedo, humor o urgencia. Sin revelar la respuesta.' },
      { label: 'Demora', guide: 'Una historia corta, metáfora o ejemplo que construya hacia la idea y muestre por qué importa.' },
      { label: 'Tensión', guide: 'Sube la apuesta: qué se pierde o qué se gana según se entienda o no esta idea.' },
      { label: 'Recompensa', guide: 'La respuesta, clara y en una sola frase. Va al final y no se alarga.' },
      { label: 'Invitación', guide: 'Invita a seguirte a cambio de un beneficio concreto: [recurso o tema de tu próxima pieza].' },
    ],
    titles: ['La explicación inesperada sobre {kw}', 'Lo que cambia cuando tu público entiende {kw}'],
    keywords: ['viral', 'alcance', 'sorpresa', 'increíble', 'nadie sabe', 'curioso'],
  }),
  A({
    id: 'epifania',
    name: 'Epifanía',
    objective: 'atraer',
    tone: 'faro',
    summary: 'Lees la mente de tu público, explicas por qué le pasa y le das una perspectiva nueva.',
    ask: '¿Qué frustración repite tu público y qué causa real nadie le explica?',
    beats: [
      { label: 'Leer la mente', guide: 'Describe en una frase la situación exacta de {aud} con {core}.' },
      { label: 'Por qué pasa', guide: 'La razón real detrás, más allá de lo que parece obvio.' },
      { label: 'Causa raíz', guide: 'El origen del problema, explicado simple: [causa raíz].' },
      { label: 'Nueva perspectiva', guide: 'La mirada nueva que cambia cómo ve la situación: [nueva solución] y por qué tiene lógica.' },
      { label: 'Prueba', guide: 'Un caso tuyo o de un cliente: situación de partida, resultado y tiempo.' },
      { label: 'Recurso y acción', guide: 'Ofrece [recurso] y pide comentar [palabra clave] para recibirlo.' },
    ],
    titles: ['Lo que sientes con {kw} no es lo que crees', 'La causa real detrás de {kw}'],
    keywords: ['por qué', 'causa', 'razón', 'entiendo', 'nadie te explicó', 'me pasa'],
  }),
  A({
    id: 'transformacion',
    name: 'Transformación visible',
    objective: 'atraer',
    tone: 'prueba',
    summary: 'Un antes y un después que se entiende en un segundo, con las tácticas que hicieron el cambio.',
    ask: '¿Qué cambio tuyo o de un cliente se puede mostrar visualmente de un vistazo?',
    beats: [
      { label: 'Gancho', guide: 'De [situación actual] a [situación deseada]: el contraste, en una línea.' },
      { label: 'Cómo era antes', guide: 'Una escena vívida y emocional que {aud} reconozca como suya.' },
      { label: 'Cómo es hoy', guide: 'La escena del resultado, con el mismo nivel de detalle.' },
      { label: 'Qué hice', guide: 'Tres movimientos novedosos y con valor real, explicados con detalle.' },
      { label: 'Cierre', guide: 'Si tienes [situación del lector], no hay motivo para que no llegues a [resultado].' },
    ],
    titles: ['De [punto A] a [punto B] con {kw}: lo que hice', 'El antes y el después de {kw}'],
    keywords: ['antes', 'después', 'cambio', 'transformación', 'pasé de', 'evolución'],
  }),
  A({
    id: 'controversia',
    name: 'Controversia',
    objective: 'atraer',
    tone: 'giro',
    summary: 'Dices algo que en tu mercado es común pero no compartes, con argumentos. Te posiciona y te diferencia.',
    ask: '¿Qué creencia de {niche} repites con todos pero en realidad no compartes?',
    beats: [
      { label: 'Afirmación incómoda', guide: 'Una frase tajante que active reacción inmediata sobre {core}.' },
      { label: 'El planteo', guide: 'La creencia que rompes y por qué se repite tanto. Muestra que entiendes cómo piensa {aud}.' },
      { label: 'Tu contrapunto', guide: 'Tu mirada distinta, apoyada en experiencia real, datos o ejemplos.' },
      { label: 'Qué cambia', guide: 'Lo que ocurre cuando alguien se alinea con esa verdad, aunque incomode.' },
      { label: 'Pregunta que frena', guide: 'Una pregunta que haga repensar sin atacar.' },
      { label: 'Invitación a debatir', guide: 'Pide comentarios o que compartan si también se animan a romper con esa creencia.' },
    ],
    titles: ['Lo que casi nadie dice en {niche} sobre {kw}', 'El mito de {kw} que conviene dejar de repetir'],
    keywords: ['mito', 'mentira', 'polémico', 'no estoy de acuerdo', 'nadie dice', 'opino'],
  }),
  A({
    id: 'comparacion',
    name: 'Modelo correcto vs. erróneo',
    objective: 'atraer',
    tone: 'giro',
    summary: 'Pones lado a lado dos formas de hacer lo mismo y muestras por qué una funciona y la otra no.',
    ask: '¿Cuál es la forma habitual de resolver {kw} y cuál es la que realmente funciona?',
    beats: [
      { label: 'Gancho', guide: 'Dos caminos para llegar a [objetivo]: el habitual y el que funciona.' },
      { label: 'El modelo erróneo', guide: 'Cómo se ve, por qué es tentador y qué cuesta.' },
      { label: 'El modelo correcto', guide: 'Cómo se ve tu enfoque en la práctica.' },
      { label: 'Por qué funciona', guide: 'El mecanismo detrás: [razón lógica].' },
      { label: 'Primer paso', guide: 'Qué puede hacer hoy para cambiar de camino: [acción concreta].' },
      { label: 'Cierre', guide: 'Invita a guardar o comentar cuál de los dos caminos ha tomado hasta ahora.' },
    ],
    titles: ['Lo habitual vs. lo que funciona en {kw}', 'Dos formas de hacer {kw}: solo una te lleva a {outcome}'],
    keywords: ['vs', 'diferencia', 'comparación', 'en lugar de', 'la mayoría', 'correcto'],
  }),
  A({
    id: 'oportunidad',
    name: 'Oportunidad del mercado',
    objective: 'atraer',
    tone: 'giro',
    summary: 'Señalas un cambio en tu sector y cómo aprovecharlo antes que los demás.',
    ask: '¿Qué ha cambiado últimamente en {niche} que casi nadie está aprovechando?',
    beats: [
      { label: 'Gancho', guide: 'Algo está cambiando en {niche}: dilo en una línea y con un dato si lo tienes.' },
      { label: 'Qué cambió', guide: 'La señal concreta: [dato, tendencia o novedad] y de dónde sale.' },
      { label: 'Quién gana y quién pierde', guide: 'Qué pasa con quien se adapta y con quien no.' },
      { label: 'Cómo aprovecharlo', guide: 'Dos o tres acciones concretas para {aud} a partir de hoy.' },
      { label: 'Siguiente paso', guide: 'Invita a guardar, comentar o escribirte para profundizar.' },
    ],
    titles: ['El cambio en {niche} que abre una puerta para {aud}', 'Lo que viene en {kw} y cómo prepararte'],
    keywords: ['tendencia', 'cambio', 'novedad', 'nueva', 'mercado', 'oportunidad', 'actualización'],
  }),
  A({
    id: 'tecnico',
    name: 'Técnico paso a paso',
    objective: 'atraer',
    tone: 'faro',
    summary: 'Una explicación táctica para resolver un problema u obtener un beneficio. Alto potencial de guardados.',
    ask: '¿Qué proceso explicas una y otra vez a tus clientes que se podría mostrar en 3 pasos?',
    beats: [
      { label: 'Gancho', guide: 'El resultado que consigue quien aplica esto sobre {core}, y el tiempo aproximado.' },
      { label: 'Cuándo usarlo', guide: 'La situación en la que este método tiene sentido y la que no.' },
      { label: 'Paso 1', guide: '[Primer paso] con un detalle concreto que lo haga fácil de aplicar.' },
      { label: 'Paso 2', guide: '[Segundo paso] con un ejemplo breve.' },
      { label: 'Paso 3', guide: '[Tercer paso] y cómo saber que salió bien.' },
      { label: 'Error a evitar', guide: 'La equivocación más frecuente al aplicarlo.' },
      { label: 'Cierre', guide: 'Invita a guardar la pieza y a contar qué paso se les complica.' },
    ],
    titles: ['Cómo {kw} en 3 pasos', 'La guía corta de {kw} que puedes aplicar hoy'],
    keywords: ['cómo', 'paso a paso', 'guía', 'tutorial', 'tips', 'estrategia', 'método'],
  }),
  A({
    id: 'dudas',
    name: 'Responder una duda',
    objective: 'atraer',
    tone: 'faro',
    summary: 'Tomas una pregunta real que te hacen y la respondes con claridad, un ejemplo y un matiz.',
    ask: '¿Qué pregunta te repiten en mensajes, comentarios o llamadas sobre {kw}?',
    beats: [
      { label: 'La pregunta', guide: 'La duda tal como la escuchas: con las palabras de {aud}.' },
      { label: 'Por qué se la hacen', guide: 'Qué hay detrás de esa pregunta: miedo, confusión o falta de información.' },
      { label: 'Respuesta corta', guide: 'La respuesta en una o dos frases, sin rodeos.' },
      { label: 'Matiz', guide: 'Cuándo la respuesta cambia o tiene excepciones.' },
      { label: 'Ejemplo', guide: 'Un caso concreto que lo haga evidente.' },
      { label: 'Invitación', guide: 'Pide que dejen su duda para la próxima pieza.' },
    ],
    titles: ['La pregunta que más me hacen sobre {kw}', 'Respondo la duda de {aud} sobre {kw}'],
    keywords: ['pregunta', 'duda', 'me preguntan', 'siempre me dicen', 'cómo hago', 'es normal'],
  }),

  /* ───────────── CONECTAR ───────────── */
  A({
    id: 'errores',
    name: 'Errores comunes',
    objective: 'conectar',
    tone: 'faro',
    summary: 'Presentas una práctica habitual como un error, explicas por qué y muestras tu alternativa con prueba.',
    ask: '¿Qué hace tu público con la mejor intención que en realidad le cuesta resultados?',
    beats: [
      { label: 'Gancho', guide: 'Nombra la práctica habitual de {aud}: [práctica] y plantéala como un error.' },
      { label: 'Por qué es un error', guide: 'La consecuencia real y por qué casi nadie la ve.' },
      { label: 'Tu alternativa', guide: 'Tu forma distinta de resolverlo, con la lógica que la sostiene.' },
      { label: 'Prueba', guide: 'Un caso real: de [situación antes] a [situación después], en [tiempo].' },
      { label: 'Recurso', guide: 'El recurso que tienes para aplicarlo: [nombre y beneficio].' },
      { label: 'Acción', guide: 'Pide comentar [palabra clave] para recibirlo por mensaje.' },
    ],
    titles: ['Deja de hacer esto con {kw}', 'El error de {aud} con {kw} que cuesta caro'],
    keywords: ['error', 'deja de', 'no hagas', 'evita', 'equivocación', 'mal hecho'],
  }),
  A({
    id: 'vinculacion',
    name: 'Vinculación personal',
    objective: 'conectar',
    tone: 'brujula',
    summary: 'Compartes algo de tu vida, tus reflexiones o tus valores para que te conozcan más allá del servicio.',
    ask: '¿Qué parte de tu vida o de tus valores te gustaría que tu comunidad conociera?',
    beats: [
      { label: 'Gancho personal', guide: 'Algo sobre ti, dicho con naturalidad, relacionado con {kw}.' },
      { label: 'Apertura emocional', guide: 'Lo que sientes o lo que valoras en esto, sin adornos.' },
      { label: 'Lo que te enseñó', guide: 'Una idea que te llevas y que también sirve a {aud}.' },
      { label: 'Cierre memorable', guide: 'Una frase que se quede: [frase de cierre].' },
    ],
    titles: ['Algo personal sobre cómo vivo {kw}', 'Un valor que guía mi trabajo en {niche}'],
    keywords: ['mi historia', 'personal', 'valores', 'vida', 'rutina', 'reflexión'],
  }),
  A({
    id: 'vulnerabilidad',
    name: 'Vulnerabilidad',
    objective: 'conectar',
    tone: 'brujula',
    summary: 'Cuentas un momento difícil desde tu punto de quiebre y lo que aprendiste, para que otros se vean reflejados.',
    ask: '¿Qué momento difícil de tu camino aún te enseña algo que tu comunidad necesita oír?',
    beats: [
      { label: 'Gancho íntimo', guide: 'Una frase corta y personal que suene a confesión sobre {core}.' },
      { label: 'Contexto crudo', guide: 'Dónde estabas, qué pasó, qué pensaste y qué hiciste en ese momento.' },
      { label: 'Conflicto interno', guide: 'La lucha contigo misma y la parte verdaderamente difícil.' },
      { label: 'Momento de cambio', guide: 'La frase, el gesto o la decisión exacta en que algo se movió.' },
      { label: 'Lección', guide: 'Lo que tu comunidad puede llevarse hoy de esto.' },
      { label: 'Cierre desde el otro lado', guide: 'Lo que ves ahora con claridad, dicho en una frase.' },
      { label: 'Invitación suave', guide: 'Pide que cuenten si les pasó algo parecido, o que guarden si lo necesitan.' },
    ],
    titles: ['El momento más difícil de mi camino con {kw}', 'Lo que no suelo contar sobre {kw}'],
    keywords: ['miedo', 'fracasé', 'lloré', 'dudé', 'crisis', 'difícil', 'quiebre', 'vulnerable'],
  }),
  A({
    id: 'storytelling',
    name: 'Historia con moraleja',
    objective: 'conectar',
    tone: 'prueba',
    summary: 'Una escena concreta, tuya o de otra persona, que termina en una enseñanza útil.',
    ask: '¿Qué escena real de esta semana ilustra algo que tu público necesita entender?',
    beats: [
      { label: 'Escena', guide: 'Dónde y cuándo ocurrió, y quién estaba. Un detalle sensorial.' },
      { label: 'Tensión', guide: 'Qué estaba en juego o qué salió mal.' },
      { label: 'Giro', guide: 'Lo que cambió el rumbo: una frase, una decisión o un descubrimiento.' },
      { label: 'Moraleja', guide: 'La enseñanza en una frase, aplicada a {core}.' },
      { label: 'Puente', guide: 'Cómo se conecta con lo que haces o con lo que se puede hacer hoy.' },
    ],
    titles: ['Una historia corta que explica {kw}', 'Lo que pasó esta semana y me recordó algo sobre {kw}'],
    keywords: ['historia', 'anécdota', 'una vez', 'ayer', 'me pasó', 'recuerdo'],
  }),
  A({
    id: 'demostracion',
    name: 'Demostración y detrás de escena',
    objective: 'conectar',
    tone: 'prueba',
    summary: 'Muestras cómo trabajas por dentro: el proceso real, sin vender.',
    ask: '¿Qué parte de tu trabajo nadie ve y sería interesante enseñar?',
    beats: [
      { label: 'Gancho', guide: 'Te muestro cómo [hago o resuelvo algo] en {niche}.' },
      { label: 'El caso', guide: 'Qué se necesitaba y con qué punto de partida.' },
      { label: 'El proceso', guide: 'Tres momentos visibles del trabajo, con capturas o material real.' },
      { label: 'El resultado', guide: 'Lo que quedó al final y cómo se mide.' },
      { label: 'Qué puedes copiar', guide: 'Una idea del proceso que se pueda aplicar por su cuenta.' },
    ],
    titles: ['Cómo trabajo {kw} por dentro', 'Un día real de trabajo en {niche}'],
    keywords: ['cómo trabajo', 'proceso', 'detrás', 'bambalinas', 'por dentro', 'te muestro'],
  }),
  A({
    id: 'enemigos',
    name: 'Quien te falló',
    objective: 'conectar',
    tone: 'giro',
    summary: 'Das voz a la experiencia de quien confió en alguien o algo que no cumplió, quitándole la culpa.',
    ask: '¿Qué promesa incumplida del sector escuchas una y otra vez de tus clientes?',
    beats: [
      { label: 'Gancho', guide: 'Te prometieron [resultado] y no pasó. Lo has visto muchas veces en {niche}.' },
      { label: 'Lo que prometieron', guide: 'La promesa habitual, con las palabras que suelen usar.' },
      { label: 'Lo que pasó en realidad', guide: 'Por qué no funcionó y por qué no fue culpa de quien lo intentó.' },
      { label: 'Lo que haces distinto', guide: 'Cómo planteas tu trabajo para que sí funcione.' },
      { label: 'Invitación', guide: 'Pide que comenten su experiencia o que te escriban si les pasó.' },
    ],
    titles: ['Cuando te prometieron {outcome} y no pasó', 'No fue tu culpa: lo que falló con {kw}'],
    keywords: ['te prometieron', 'gurú', 'curso', 'mentor', 'estafa', 'me fallaron', 'engaño'],
  }),
  A({
    id: 'dolor',
    name: 'Dolor emocional',
    objective: 'conectar',
    tone: 'faro',
    summary: 'Pones nombre a lo que siente tu público por dentro y le abres una salida pequeña y posible.',
    ask: '¿Qué siente tu público que casi nunca dice en voz alta?',
    beats: [
      { label: 'Gancho', guide: 'Ponle nombre a lo que sienten con {core}, en una frase.' },
      { label: 'Cómo se siente', guide: 'Una escena cotidiana donde se vea ese sentimiento.' },
      { label: 'Qué lo sostiene', guide: 'La creencia o el hábito que lo mantiene vivo.' },
      { label: 'Salida', guide: 'Un primer paso pequeño y concreto: [acción].' },
      { label: 'Cierre', guide: 'Una frase de esperanza realista y una invitación a guardar o responder.' },
    ],
    titles: ['Lo que sientes con {kw} y casi nunca dices', 'Cuando {kw} pesa más de lo que parece'],
    keywords: ['agotada', 'frustración', 'sola', 'abrumada', 'cansada', 'estrés', 'ansiedad', 'miedo'],
  }),
  A({
    id: 'deseo',
    name: 'Deseo',
    objective: 'conectar',
    tone: 'prueba',
    summary: 'Haces vivir la escena de lo que tu público quiere lograr y le muestras el puente para llegar.',
    ask: '¿Cómo describe tu público el día en que por fin logra {outcome}?',
    beats: [
      { label: 'Gancho', guide: 'Imagina que [escena del resultado deseado]. Una línea.' },
      { label: 'La escena', guide: 'Cómo se vive el resultado: qué ves, qué sientes, qué dejas de hacer.' },
      { label: 'Lo que lo separa de hoy', guide: 'La distancia real entre ese momento y la situación actual.' },
      { label: 'El puente', guide: 'El primer paso para empezar a cruzarla: [acción].' },
      { label: 'Invitación', guide: 'Pide comentar cómo se imaginan ellos ese momento.' },
    ],
    titles: ['Cómo se ve el día en que logras {outcome}', 'Imagina que {kw} deja de ser un problema'],
    keywords: ['imagina', 'sueño', 'quiero lograr', 'libertad', 'vivir de', 'ideal'],
  }),
  A({
    id: 'problema',
    name: 'Problema concreto',
    objective: 'conectar',
    tone: 'faro',
    summary: 'Describes un problema externo y medible de tu público, su costo y el camino para resolverlo.',
    ask: '¿Qué problema práctico se repite en la rutina de tu público (tiempo, dinero, orden, clientes)?',
    beats: [
      { label: 'Gancho', guide: 'El problema tal como aparece en el día a día de {aud}: {core}.' },
      { label: 'Cuánto cuesta', guide: 'Lo que pierde por semana o por mes: [tiempo, dinero u oportunidades].' },
      { label: 'Por qué sigue ahí', guide: 'Qué hace que el problema se mantenga aunque lo intenten.' },
      { label: 'Camino de solución', guide: 'Los pasos generales para resolverlo, sin entrar en tu oferta.' },
      { label: 'Cierre', guide: 'Invita a guardar y a contar cuál de estos costos les pesa más.' },
    ],
    titles: ['El problema oculto de {aud} con {kw}', 'Cuánto cuesta no resolver {kw}'],
    keywords: ['problema', 'pierdo', 'me cuesta', 'no llego', 'desorden', 'sin tiempo'],
  }),

  /* ───────────── CONVERTIR ───────────── */
  A({
    id: 'promesa',
    name: 'Promesa',
    objective: 'convertir',
    tone: 'prueba',
    summary: 'Llamas a tu cliente ideal, le dices qué resultado puede lograr, en cuánto tiempo y con qué proceso.',
    ask: '¿Qué resultado concreto puede lograr tu cliente contigo y en qué plazo realista?',
    beats: [
      { label: 'A quién llamas', guide: 'Busco [cantidad] de [perfil de cliente ideal] para llevarlos a {outcome}.' },
      { label: 'Cupo o plazo real', guide: 'Si hay un límite verdadero (cupos o fecha), dilo aquí. Si no lo hay, omite este paso.' },
      { label: 'La promesa', guide: 'El resultado tangible, descrito en términos que se puedan verificar.' },
      { label: 'El tiempo', guide: 'En cuánto tiempo lo entregas, con un plazo realista.' },
      { label: 'Tu proceso', guide: 'El mecanismo único con el que lo logras: [nombre y qué lo hace distinto].' },
      { label: 'Prueba', guide: 'Resultados reales de ti o de tus clientes.' },
      { label: 'Acción', guide: 'Pide comentar [palabra clave] para contarles cómo funciona.' },
    ],
    titles: ['Abro [cupos] para llevar a {aud} a {outcome}', 'Esto es lo que logro con {aud} en [tiempo]'],
    keywords: ['busco', 'abro cupos', 'programa', 'mentoría', 'acompaño', 'quiero trabajar con'],
  }),
  A({
    id: 'prueba',
    name: 'Prueba social con caso',
    objective: 'convertir',
    tone: 'prueba',
    summary: 'Cuentas el caso completo de un cliente, desde su problema hasta su resultado y lo que diría a quien duda.',
    ask: '¿Qué cliente reciente tuvo un resultado que otros podrían querer lograr?',
    beats: [
      { label: 'Resultado primero', guide: 'Así pasó [nombre] de [punto A] a [punto B], a pesar de [obstáculo].' },
      { label: 'Quién es', guide: 'Qué hace y en qué momento llegó a ti.' },
      { label: 'El problema', guide: 'Lo que le pasaba por fuera y cómo le afectaba por dentro.' },
      { label: 'Lo que ya había intentado', guide: 'Los intentos previos y por qué no alcanzaron.' },
      { label: 'Miedos al decidir', guide: 'Qué dudas tuvo antes de empezar y cómo las superó.' },
      { label: 'Qué se hizo', guide: 'Tu proceso aplicado a su caso, en tres movimientos.' },
      { label: 'Resultados', guide: 'Qué logró externa e internamente, con datos si es posible.' },
      { label: 'Su voz', guide: 'Una cita real de [nombre] para quien está dudando.' },
      { label: 'Acción', guide: 'Si quieres [beneficio] como [nombre], comenta [palabra clave].' },
    ],
    titles: ['Cómo [nombre] llegó a {outcome}', 'El caso de [nombre]: de [punto A] a [punto B]'],
    keywords: ['clienta', 'cliente', 'resultado', 'testimonio', 'caso', 'logró', 'alumna'],
  }),
  A({
    id: 'autoridad',
    name: 'Autoridad con tu recorrido',
    objective: 'convertir',
    tone: 'prueba',
    summary: 'Muestras tu resultado y de dónde partiste, sin falsa humildad, para validar tu método.',
    ask: '¿Qué logro tuyo y qué punto de partida humilde recuerdas con claridad?',
    beats: [
      { label: 'Gancho', guide: 'Un antes y un después, o un logro actual, en una frase sobre {core}.' },
      { label: 'De dónde partiste', guide: 'Tu punto de partida real, para que vean que no naciste con todo resuelto.' },
      { label: 'Qué hiciste distinto', guide: 'La acción o el cambio de enfoque que marcó la diferencia.' },
      { label: 'Resultado', guide: 'El logro con números, ejemplos o capturas, sin disculparte por él.' },
      { label: 'Lo que siempre te preguntan', guide: 'La duda frecuente sobre cómo lo lograste y su respuesta.' },
      { label: 'Recordatorio', guide: 'Una frase que baje el mensaje a tierra: no es suerte, es [factor].' },
      { label: 'Acción', guide: 'Invita a dar un paso concreto: [acción].' },
    ],
    titles: ['Cómo llegué a {outcome} partiendo de cero', 'Lo que hice distinto para lograr {outcome}'],
    keywords: ['mi resultado', 'logré', 'facturé', 'mi recorrido', 'cómo lo hice', 'llegué a'],
  }),
  A({
    id: 'objeciones',
    name: 'Objeciones',
    objective: 'convertir',
    tone: 'faro',
    summary: 'Tomas la duda que frena la compra, la desmontas con lógica y cierras con una oferta clara.',
    ask: '¿Cuál es la objeción que más escuchas antes de que alguien diga que sí?',
    beats: [
      { label: 'La objeción', guide: 'Dila en primera persona o como pregunta, con las palabras de {aud}.' },
      { label: 'Tu contrapunto', guide: 'Una declaración que la contradice con respeto y firmeza.' },
      { label: 'Costo de creerla', guide: 'Qué pasa si sigue creyendo eso: lo que cuesta no actuar.' },
      { label: 'No es su culpa', guide: 'La razón real por la que no ha logrado el resultado, sin culparla.' },
      { label: 'Metáfora o ejemplo', guide: 'Una analogía que desarme la objeción con lógica.' },
      { label: 'Tu experiencia', guide: 'Cómo viviste tú esa misma objeción y qué resultado tuviste.' },
      { label: 'Tu oferta', guide: 'A quién ayudas, qué logran y cómo.' },
      { label: 'Qué recibe', guide: 'Lista de beneficios y entregables tangibles.' },
      { label: 'Razón para actuar', guide: 'Una escasez, bono o fecha que sea verdadera.' },
      { label: 'Acción', guide: 'Si quieres {outcome}, comenta [palabra clave] y te escribo antes de [fecha].' },
    ],
    titles: ['«No puedo permitírmelo»: lo que hay detrás', 'La duda que frena a {aud} con {kw}'],
    keywords: ['objeción', 'es caro', 'no tengo tiempo', 'no sé si', 'me da miedo invertir', 'y si no funciona'],
  }),
  A({
    id: 'urgencia',
    name: 'Urgencia legítima',
    objective: 'convertir',
    tone: 'brujula',
    summary: 'Un llamado breve con una fecha o unos cupos reales y una única acción para dar.',
    ask: '¿Qué fecha límite o cupo real tienes en los próximos días?',
    beats: [
      { label: 'Atención', guide: 'Para [perfil] que quiere {outcome} a través de [método].' },
      { label: 'Escasez real', guide: 'Quedan [cantidad] cupos o [días] antes de que [cierre o cambio].' },
      { label: 'Prueba breve', guide: 'Un resultado reciente en una línea: [dato real].' },
      { label: 'Acción', guide: 'Comenta [palabra clave] y te escribo hoy.' },
    ],
    titles: ['Quedan [cupos] para {outcome}', 'Última semana para entrar a {kw}'],
    keywords: ['últimos cupos', 'cierra', 'quedan', 'hasta el', 'fecha límite', 'última llamada'],
  }),
  A({
    id: 'activacion',
    name: 'Activación honesta',
    objective: 'convertir',
    tone: 'brujula',
    summary: 'Tocas un dolor real, muestras el contraste con quien sí actuó y cierras con un empujón firme y respetuoso.',
    ask: '¿Qué excusa repetida de tu público sabes que frena su resultado?',
    beats: [
      { label: 'Dolor directo', guide: 'Confronta con respeto la excusa o creencia que mantiene a {aud} donde está.' },
      { label: 'Contraste', guide: 'Lo que ya consiguen quienes sí dieron el paso: [ejemplo real].' },
      { label: 'Reflexión', guide: 'Una pregunta que invite a mirarse y elegir.' },
      { label: 'Acción', guide: 'Un cierre firme: si esto te incomodó, quizá es la señal para [acción].' },
    ],
    titles: ['Lo que te frena con {kw} (y no es lo que dices)', 'Si sigues esperando con {kw}, esto te cuesta'],
    keywords: ['deja de esperar', 'excusa', 'por qué sigues', 'ya es hora', 'decide', 'basta de'],
  }),
  A({
    id: 'venta_directa',
    name: 'Venta directa',
    objective: 'convertir',
    tone: 'brujula',
    summary: 'Hablas de tu oferta de forma clara: qué es, para quién, qué incluye y cómo empezar.',
    ask: '¿Qué oferta quieres que más gente conozca este mes?',
    beats: [
      { label: 'Qué ofreces', guide: 'En una frase: qué es [oferta] y para quién está pensada.' },
      { label: 'Qué incluye', guide: 'Los componentes concretos, sin lenguaje vago.' },
      { label: 'Resultado esperado', guide: 'Qué cambia en la vida o el negocio de quien la toma: {outcome}.' },
      { label: 'Condiciones', guide: 'Precio, duración y fechas, tal como son.' },
      { label: 'Cómo decidir', guide: 'Garantía, llamada de orientación o el paso previo para resolver dudas.' },
      { label: 'Acción', guide: 'Comenta [palabra clave] o usa [enlace] para empezar.' },
    ],
    titles: ['Esto es lo que incluye {brand}', 'Para quién es {brand} (y para quién no)'],
    keywords: ['oferta', 'precio', 'inscripción', 'abrimos', 'lanzamiento', 'programa', 'incluye'],
  }),
];

export const ANGLE_BY_ID: Record<string, Angle> = Object.fromEntries(ANGLES.map((a) => [a.id, a]));

export function anglesByObjective(o: Objective): Angle[] {
  return ANGLES.filter((a) => a.objective === o);
}

/** Detecta el ángulo que mejor encaja con una idea según palabras clave. */
export function suggestAngle(idea: string): Angle | null {
  const t = idea.toLowerCase();
  if (t.trim().length < 8) return null;
  let best: Angle | null = null;
  let score = 0;
  for (const a of ANGLES) {
    const s = a.keywords.reduce((n, k) => (t.includes(k) ? n + 1 : n), 0);
    if (s > score) {
      best = a;
      score = s;
    }
  }
  return best;
}

/* ───────── referencia guardada en la pieza (columna template_id, sin cambiar la base de datos) ───────── */

export interface TemplateRef {
  angle?: string;
  style?: string;
  struct?: string;
  story?: string;
}

export function parseRef(t?: string | null): TemplateRef {
  const out: TemplateRef = {};
  if (!t) return out;
  for (const part of t.split('|')) {
    if (part.startsWith('angle:')) out.angle = part.slice(6);
    else if (part.startsWith('style:')) out.style = part.slice(6);
    else if (part.startsWith('struct:')) out.struct = part.slice(7);
    else if (part) out.story = part;
  }
  return out;
}

export function buildRef(r: TemplateRef): string | undefined {
  const parts = [r.story, r.struct && `struct:${r.struct}`, r.angle && `angle:${r.angle}`, r.style && `style:${r.style}`].filter(Boolean);
  return parts.length ? (parts as string[]).join('|') : undefined;
}

/** Marcador de ángulo dentro de `sparks.levels` (así no hace falta una columna nueva). */
export const SPARK_ANGLE_PREFIX = 'angle:';
export const sparkAngle = (levels: string[]): string | undefined => levels.find((l) => l.startsWith(SPARK_ANGLE_PREFIX))?.slice(SPARK_ANGLE_PREFIX.length);
