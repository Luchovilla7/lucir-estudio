import type { Niche, ToneId } from './types';

export interface HookTemplate {
  text: string;
  niches: Niche[];
}

export interface HookGroup {
  id: string;
  tone: ToneId;
  title: string;
  intent: string;
  tip: string;
  hooks: HookTemplate[];
}

export const NICHE_LABEL: Record<Niche, string> = {
  universal: 'Universal',
  negocios: 'Negocios y ventas',
  coaches: 'Coaches y consultoría',
  terapia: 'Terapia y bienestar',
};

const h = (text: string, ...niches: Niche[]): HookTemplate => ({ text, niches: niches.length ? niches : ['universal'] });

export const HOOK_GROUPS: HookGroup[] = [
  {
    id: 'faro-grieta',
    tone: 'faro',
    title: 'La grieta que no ves',
    intent: 'Nombra la causa oculta del problema sin revelarla todavía.',
    tip: 'Funciona cuando el problema ya está a la vista pero la causa no. Evita explicar la grieta en el gancho: la curiosidad vive en lo que falta.',
    hooks: [
      h('Llevas [tiempo] intentando [resultado] y algo no cuaja. La grieta no está donde estás mirando.', 'universal'),
      h('Si [síntoma que se repite], no es casualidad: hay una causa que todavía no nombraste.', 'universal'),
      h('Tu [negocio o proceso] pierde [qué pierde] cada semana y la causa no aparece en ningún informe.', 'negocios'),
      h('Antes de cambiar [lo que todos cambian], revisa esto que nadie te dijo que mirases.', 'coaches'),
    ],
  },
  {
    id: 'faro-habito',
    tone: 'faro',
    title: 'El hábito disfrazado',
    intent: 'Apunta a una acción cotidiana que sostiene el problema.',
    tip: 'Mientras más pequeño y concreto sea el hábito, más identificación genera. "Revisar el móvil antes de cobrar" gana a "mala gestión del tiempo".',
    hooks: [
      h('Lo haces con la mejor intención: [hábito]. Y es justo lo que mantiene vivo [problema].', 'universal'),
      h('Cada vez que [acción cotidiana], le dices a tu mercado algo que no querías decir.', 'negocios'),
      h('Hay un gesto pequeño en tu día a día que sostiene [patrón que quieres soltar].', 'terapia'),
      h('Ese [hábito] que parece ordenar tu semana es el que te quita [resultado].', 'coaches'),
    ],
  },
  {
    id: 'faro-esfuerzo',
    tone: 'faro',
    title: 'No es tu esfuerzo',
    intent: 'Reconoce el trabajo hecho y redirige la causa hacia el orden o la estrategia.',
    tip: 'Es el gancho más amable para público frío: valida sin atacar. Úsalo con personas que ya intentaron cosas y se frustraron.',
    hooks: [
      h('Hiciste todo lo que decían: [pasos]. Si [resultado] no llegó, el problema es el orden, no tú.', 'universal'),
      h('[Estrategia popular] funciona, pero solo con [condición]. Sin eso, es ruido bien intencionado.', 'negocios'),
      h('No te falta disciplina. Te falta ver el paso que viene antes de [acción].', 'coaches'),
      h('Si ya probaste [intento previo] y no resultó, déjame mostrarte qué faltaba debajo.', 'terapia'),
    ],
  },
  {
    id: 'faro-foco',
    tone: 'faro',
    title: 'Lo que queda fuera de foco',
    intent: 'Insinúa una variable que nadie ve desde dentro de la situación.',
    tip: 'A diferencia de "La grieta", aquí no hay un error que señalar: hay una dimensión que tu cliente nunca consideró. Te posiciona sin listar credenciales.',
    hooks: [
      h('Desde dentro de [situación] hay una variable imposible de ver. Hoy te la señalo.', 'universal'),
      h('Lo que te frena de [resultado] probablemente es lo que das por hecho que no hace falta revisar.', 'coaches'),
      h('Llevas [tiempo] mirando [problema] de cerca. Da un paso atrás: ahí aparece esto.', 'negocios'),
      h('Todo en tu [proceso] tiene lógica y aun así [resultado] no llega. Falta una pieza invisible.', 'terapia'),
    ],
  },
  {
    id: 'prueba-antes',
    tone: 'prueba',
    title: 'Del antes al después',
    intent: 'Contrasta dos estados sin revelar todavía el proceso.',
    tip: 'El "antes" debe ser tan específico que la persona se vea reflejada. No "no tenía clientes", sino "llevaba ocho meses sin un cierre y dudaba del negocio".',
    hooks: [
      h('Hace [tiempo], [nombre o "una clienta"] escribió: "[frase literal del problema]". Esta semana escribió algo muy distinto.', 'universal'),
      h('De "[cómo lo decía antes]" a "[cómo lo dice hoy]". Sin [lo que se creía imprescindible].', 'coaches'),
      h('[Resultado concreto con cifra]. Venía [tiempo] intentándolo y cambió una sola cosa.', 'negocios'),
      h('No te cuento el método todavía: solo el antes y el después, para que decidas si es para ti.', 'universal'),
    ],
  },
  {
    id: 'prueba-receta',
    tone: 'prueba',
    title: 'La receta en pasos',
    intent: 'Promete un proceso concreto y ordenado.',
    tip: 'Un número específico ("3 pasos", "4 decisiones") atrae más clics que un gancho abierto: el cerebro quiere saber cuánto le va a costar leerlo.',
    hooks: [
      h('[Resultado con número] en [tiempo]. Estos fueron los [n] pasos, en orden.', 'negocios'),
      h('No fue suerte ni viralidad: fueron [n] movimientos concretos. Te los muestro.', 'negocios'),
      h('[Cliente] fue de [punto A] a [punto B]. El camino cabe en [n] pasos.', 'universal'),
      h('Si quieres [resultado], el orden importa. Casi todos empiezan por el final; aquí va la secuencia.', 'coaches'),
    ],
  },
  {
    id: 'prueba-partida',
    tone: 'prueba',
    title: 'Mi punto de partida',
    intent: 'Abre tu historia desde el momento más reconocible, el antes.',
    tip: 'Empieza siempre por el antes, no por el resultado. La identificación abre la puerta; el resultado la cierra.',
    hooks: [
      h('Hubo una época en que [situación honesta de antes]. Hoy entiendo qué la sostenía.', 'universal'),
      h('Durante [tiempo] creí que [creencia limitante]. Me costó [consecuencia]. Lo cuento porque no soy la única.', 'coaches'),
      h('Yo también estuve donde estás hoy: [situación]. Lo que me sacó no fue lo que imaginaba.', 'terapia'),
      h('[Resultado actual] no siempre fue así. Esta es la historia de cómo cambió.', 'negocios'),
    ],
  },
  {
    id: 'prueba-letra-chica',
    tone: 'prueba',
    title: 'Resultado con letra chica',
    intent: 'Presenta un logro junto con lo que costó, para ganar credibilidad.',
    tip: 'Mostrar el costo vuelve creíble el resultado. Una cifra sin contexto parece promesa; una cifra con su letra chica parece verdad.',
    hooks: [
      h('[Cifra o logro real], y también [lo que costó o lo que salió mal]. Las dos cosas son verdad.', 'universal'),
      h('Esto funcionó en [contexto]. Esto no funcionó en [otro contexto]. Te lo cuento completo.', 'negocios'),
      h('El mejor resultado de [periodo] vino de lo que menos esperaba: [dato].', 'coaches'),
      h('Lo que mostraron mis números de [periodo] me hizo cambiar [decisión].', 'negocios'),
    ],
  },
  {
    id: 'giro-corriente',
    tone: 'giro',
    title: 'Contra la corriente',
    intent: 'Declara tu diferencia sin atacar a nadie.',
    tip: 'No hay villano: solo contraste. El foco está en tu enfoque y en lo que produce, no en lo que hacen los demás.',
    hooks: [
      h('En [sector] todos recomiendan [práctica estándar]. Yo hago lo contrario desde hace [tiempo].', 'universal'),
      h('El consejo más repetido de [industria] es [consejo]. Yo no lo sigo, y hay una razón concreta.', 'coaches'),
      h('Mientras la mayoría [práctica común], yo [tu alternativa]. No es mejor moral, es otro resultado.', 'negocios'),
      h('No hago [práctica habitual]. Nunca la hice. Mis clientes llegan a [resultado] igual.', 'universal'),
    ],
  },
  {
    id: 'giro-consejo',
    tone: 'giro',
    title: 'El consejo que cansa',
    intent: 'Cuestiona un consejo que tu cliente sigue al pie de la letra.',
    tip: 'Cita el consejo con las palabras exactas que repiten los referentes de tu sector. Cuanto más reconocible la frase, más fuerte el gancho.',
    hooks: [
      h('Te dijeron "[consejo popular]". Lo aplicaste. Y algo no encajó. Aquí está lo que nadie aclaró.', 'universal'),
      h('"[Consejo popular]" es el consejo que más paraliza en [industria]. Te cuento por qué.', 'negocios'),
      h('Hay un consejo lógico para [problema] que en la práctica empuja hacia el lado contrario.', 'coaches'),
      h('Si sigues "[consejo]" y sientes que no encaja, confía en esa sensación: falta contexto.', 'terapia'),
    ],
  },
  {
    id: 'giro-hueco',
    tone: 'giro',
    title: 'El modelo con hueco',
    intent: 'Señala el límite estructural del modelo estándar de tu industria.',
    tip: 'Critica el modelo, no a las personas. El límite es de diseño, no de mala intención, y por eso no suena a ataque.',
    hooks: [
      h('[Solución estándar] tiene un límite del que casi nadie habla, y ahí se atascaban mis clientes.', 'universal'),
      h('[Solución típica] resuelve la mitad del problema. Hoy hablo de la otra mitad.', 'coaches'),
      h('Saliste de [curso, terapia o programa] con mucha información y poca claridad. No es tu culpa: es el diseño.', 'terapia'),
      h('[Solución estándar] promete [resultado] pero omite [condición previa].', 'negocios'),
    ],
  },
  {
    id: 'giro-principio',
    tone: 'giro',
    title: 'Mi principio rector',
    intent: 'Presenta tu método o principio central como la causa de tus resultados.',
    tip: 'Ponle nombre a lo que haces. "Primero validar, luego construir" se recuerda y se repite mejor que "mi metodología de trabajo".',
    hooks: [
      h('Lo que guía todo mi trabajo es [principio]. No es el enfoque habitual, y por eso los resultados cambian.', 'universal'),
      h('Hay algo que hago distinto en [sector] y explica por qué mis clientes llegan a [resultado].', 'coaches'),
      h('Mi método no nació de un libro: nació de ver el mismo patrón repetirse cliente tras cliente.', 'universal'),
      h('[Nombre de tu principio] es la idea que une todo lo que enseño. Te la explico en un minuto.', 'negocios'),
    ],
  },
  {
    id: 'brujula-linea',
    tone: 'brujula',
    title: 'Mi línea roja',
    intent: 'Declara una postura firme desde el primer segundo.',
    tip: 'No suavices la línea en el gancho. "Nunca" y "jamás" detienen el scroll porque son raras. Humaniza la postura a partir del segundo bloque.',
    hooks: [
      h('Hay algo que nunca haré en mi trabajo, sin importar la oferta. Y tiene una razón.', 'universal'),
      h('[Práctica común] es algo que no voy a ofrecerte, aunque pueda: creo que no te ayuda.', 'coaches'),
      h('Mi no-negociable en [tu trabajo]: [límite en una frase]. Te cuento de dónde viene.', 'universal'),
      h('Si trabajas conmigo, siempre pasará esto y nunca pasará esto otro.', 'negocios'),
    ],
  },
  {
    id: 'brujula-decision',
    tone: 'brujula',
    title: 'La decisión que dolió',
    intent: 'Abre con una decisión difícil o a contracorriente.',
    tip: 'Pon el costo de la decisión en el primer bloque, no el resultado. "Me costó tres meses de ingresos bajos" engancha más que "tomé una decisión valiente".',
    hooks: [
      h('Hace [tiempo] tomé una decisión que casi nadie entendió. Me costó [algo concreto]. Y fue la correcta.', 'universal'),
      h('Dije que no a [oportunidad atractiva]. No fue ingenuidad: veía algo que ellos no.', 'negocios'),
      h('Tuve que elegir entre [opción segura] y [opción arriesgada]. Elegí la segunda. Esto pasó.', 'universal'),
      h('Si estás frente a [decisión difícil] y no sabes qué hacer, esta historia es para ti.', 'terapia'),
    ],
  },
  {
    id: 'brujula-callar',
    tone: 'brujula',
    title: 'Lo que me niego a callar',
    intent: 'Toma postura sobre una práctica dañina de tu sector.',
    tip: 'Es el gancho con más alcance orgánico porque genera conversación, pero solo si es específico. "No tolero la falta de ética" no dice nada; "no tolero prometer plazos exactos sin mencionar las variables" sí.',
    hooks: [
      h('Hay una práctica en [sector] que me parece dañina y la veo a diario. Hoy la nombro.', 'universal'),
      h('Lo que no tolero en [industria]: [práctica]. No por purismo: por el daño que genera.', 'coaches'),
      h('Si alguna vez [mala experiencia con alguien del sector], no fue tu culpa.', 'terapia'),
      h('Hay promesas que no deberían hacerse en [industria]. Esta es una, y por qué la evito.', 'negocios'),
    ],
  },
  {
    id: 'brujula-credo',
    tone: 'brujula',
    title: 'Mi credo',
    intent: 'Declara una creencia central sobre cómo debería funcionar tu área.',
    tip: 'El riesgo es sonar vago. Ancla la creencia en algo observable: "los negocios sanos se construyen con relaciones reales" supera a "creo en la autenticidad".',
    hooks: [
      h('Creo que [tu creencia central], y que buena parte de [industria] funciona en sentido contrario.', 'universal'),
      h('Hay una forma de [resultado] que no exige [lo que dicen que exige]. Llevo [tiempo] comprobándolo.', 'negocios'),
      h('Lo que creo sobre [tu área] va contra lo que más se enseña. Hoy lo digo sin rodeos.', 'coaches'),
      h('Si también crees que [creencia compartida], este contenido es para ti. Y si no, igual da para pensar.', 'terapia'),
    ],
  },

  /* ───────── ganchos por ángulo (ampliación) ───────── */
  {
    id: 'faro-dolor',
    tone: 'faro',
    title: 'Dolor directo',
    intent: 'Pone el dedo en una frustración real, sin rodeos y con respeto.',
    tip: 'Funciona cuando nombras lo que tu público ya se dice a sí mismo. Confronta la excusa, no a la persona: la idea es que se reconozca, no que se sienta atacada.',
    hooks: [
      h('Sigues esperando el momento ideal para [acción], y mientras tanto pierdes [lo que cuesta esperar].', 'universal'),
      h('Si cada semana te dices "no tengo tiempo para [acción]", el tiempo no es el problema.', 'coaches'),
      h('Llevas [tiempo] postergando [decisión]. ¿Cuánto te cuesta cada mes seguir igual?', 'negocios'),
      h('Eso que llamas cansancio quizá sea [causa real] con otro nombre.', 'terapia'),
    ],
  },
  {
    id: 'faro-errores',
    tone: 'faro',
    title: 'Deja de hacer esto',
    intent: 'Presenta una práctica habitual de tu público como un error y despierta curiosidad por la alternativa.',
    tip: 'Elige una práctica muy concreta y muy común. Mientras más reconocible sea, más gente se detiene a mirar si también la comete.',
    hooks: [
      h('Si sigues [práctica común], seguirás pagando [consecuencia].', 'universal'),
      h('El error que más veo en [nicho] es [práctica], y casi nadie lo cuestiona.', 'negocios'),
      h('Haces [práctica] con toda tu buena intención. Es justo lo que frena [resultado].', 'coaches'),
      h('Lo que haces con tanto esmero para [objetivo] es lo que lo mantiene lejos.', 'terapia'),
    ],
  },
  {
    id: 'faro-epifania',
    tone: 'faro',
    title: 'Te leo la mente',
    intent: 'Describe con precisión una situación de tu público y promete explicar su causa real.',
    tip: 'La precisión es todo: una escena concreta ("cuando abres tu agenda el lunes y…") conecta más que una emoción general. Después de leer la mente, entrega una perspectiva nueva.',
    hooks: [
      h('Apuesto a que te pasa esto: [situación específica]. Y crees que es por [causa obvia].', 'universal'),
      h('Cada vez que [situación], piensas "[pensamiento]". Esto es lo que ocurre de verdad.', 'coaches'),
      h('Ese [síntoma] no viene de [causa obvia]. Viene de [causa real].', 'terapia'),
      h('Tienes la sensación de [frustración] aunque haces todo bien. Te explico por qué.', 'negocios'),
    ],
  },
  {
    id: 'faro-valor',
    tone: 'faro',
    title: 'Valor práctico',
    intent: 'Promete una mejora concreta en poco tiempo y con un método claro.',
    tip: 'Une un resultado, un plazo y un método en la misma frase. Evita las promesas vagas: "mejora tu negocio" no dice nada; "ordena tu semana en 30 minutos" sí.',
    hooks: [
      h('Puedes [resultado] en [tiempo] con [estrategia], y no necesitas [lo que todos creen necesario].', 'universal'),
      h('¿Y si en 10 minutos entendieras [conocimiento] mejor que en meses de intentarlo?', 'universal'),
      h('Esto hacen las marcas que [logro] y casi nadie copia: [tema].', 'negocios'),
      h('[Estrategia] parece demasiado simple, por eso se subestima. Es la base de [resultado].', 'coaches'),
    ],
  },
  {
    id: 'prueba-logro',
    tone: 'prueba',
    title: 'Logro con punto de partida',
    intent: 'Muestra un resultado actual junto al lugar humilde de donde saliste.',
    tip: 'Un logro sin su punto de partida suena a presunción; con él, suena a posibilidad. Di el resultado sin disculparte y el origen sin dramatizar.',
    hooks: [
      h('Hace [tiempo] no sabía cómo [acción]. Hoy [resultado actual].', 'universal'),
      h('Pasé de [situación anterior] a [resultado] en [tiempo]. Esto cambió entre una y otra.', 'negocios'),
      h('No empecé con [ventaja que no tenía]. Empecé con [punto de partida humilde].', 'coaches'),
      h('No fue suerte. Fue [factor] sostenido durante [tiempo]. Te muestro cómo.', 'universal'),
    ],
  },
  {
    id: 'prueba-contraste',
    tone: 'prueba',
    title: 'Antes y después en un vistazo',
    intent: 'Abre con un contraste que se entiende en un segundo y promete mostrar lo que hubo en medio.',
    tip: 'Piensa primero en la imagen: si el antes y el después se pueden ver, el gancho funciona solo. Cuida que el cambio sea específico y verificable.',
    hooks: [
      h('De [situación actual] a [situación deseada]: lo que hice entre una y otra.', 'universal'),
      h('Antes: [escena del problema]. Hoy: [escena del resultado]. Entre ambas hubo [n] decisiones.', 'negocios'),
      h('Mírala hace [tiempo] y mírala hoy. Lo que cambió no fue [lo que se supone].', 'coaches'),
      h('Estaba atravesando [momento difícil] y hoy [escena nueva]. Te cuento qué hice, sin atajos.', 'terapia'),
    ],
  },
  {
    id: 'prueba-caso',
    tone: 'prueba',
    title: 'El caso de una clienta',
    intent: 'Abre con el resultado de otra persona y promete contar cómo lo logró.',
    tip: 'Pide permiso antes de usar un nombre o una captura. Un resultado real y moderado convence más que uno espectacular que nadie puede verificar.',
    hooks: [
      h('[Nombre] llegó con [problema]. Hoy [resultado concreto].', 'universal'),
      h('[Resultado] en [tiempo], a pesar de [obstáculo]. Así lo logró [nombre].', 'negocios'),
      h('[Nombre] casi no se anima por [miedo]. Estas son las tres cosas que hicimos.', 'coaches'),
      h('Lo que [nombre] me dijo después de [tiempo] me hizo repensar cómo trabajo.', 'terapia'),
    ],
  },
  {
    id: 'giro-polemica',
    tone: 'giro',
    title: 'Lo que nadie se anima a decir',
    intent: 'Abre con una afirmación incómoda que activa reacción y posiciona tu criterio.',
    tip: 'Opina sobre ideas, no sobre personas. Una polémica útil se apoya en experiencia o datos propios; si no los tienes, mejor elige otro gancho.',
    hooks: [
      h('No, no es [creencia común]. Es [verdad incómoda].', 'universal'),
      h('[Referente o tendencia] dice [consejo]. Mi experiencia dice otra cosa.', 'negocios'),
      h('Si tu plan es [esperar o evitar], olvídate de [objetivo].', 'coaches'),
      h('¿Quieres [agradar a todos] o quieres [objetivo]? Rara vez van juntas.', 'terapia'),
    ],
  },
  {
    id: 'giro-comparacion',
    tone: 'giro',
    title: 'Dos caminos',
    intent: 'Contrasta la forma habitual de hacer algo con la que realmente funciona.',
    tip: 'Nombra los dos caminos en la misma frase y deja el cómo para después. El contraste claro hace que quien ve se ubique solo en uno de los dos.',
    hooks: [
      h('Hay dos formas de [objetivo]: la que todos usan y la que funciona. Esta es la segunda.', 'universal'),
      h('Quien hace [A] sigue donde está. Quien hace [B] ya está en [resultado].', 'negocios'),
      h('[Modelo erróneo] vs. [modelo correcto]: la diferencia no es el esfuerzo, es [factor].', 'coaches'),
      h('Lo que separa a quien logra [resultado] de quien no es [una decisión concreta].', 'terapia'),
    ],
  },
  {
    id: 'giro-oportunidad',
    tone: 'giro',
    title: 'Algo está cambiando',
    intent: 'Señala un cambio del mercado y una ventaja para quien actúe pronto.',
    tip: 'Apóyate en un dato verificable o en algo que puedas mostrar. Evita la urgencia inventada: el cambio real ya es motivo suficiente para prestar atención.',
    hooks: [
      h('En [sector] está pasando algo que casi nadie aprovecha: [cambio].', 'negocios'),
      h('Si [tendencia] sigue así, en [tiempo] quien no [acción] se queda fuera.', 'universal'),
      h('Esto cambió en [plataforma o mercado] y abre una puerta para [tu público].', 'coaches'),
      h('Antes [situación vieja]. Ahora [situación nueva]. Te cuento cómo sacarle partido.', 'universal'),
    ],
  },
  {
    id: 'brujula-vulnerabilidad',
    tone: 'brujula',
    title: 'Una confesión',
    intent: 'Abre con una frase íntima que suena a confesión y invita a quedarse a escuchar.',
    tip: 'La vulnerabilidad funciona cuando ya la elaboraste: cuenta desde el presente, con perspectiva, no desde la herida abierta. Mide qué compartes y por qué.',
    hooks: [
      h('Antes de [imagen actual] hubo una etapa en la que [situación vulnerable].', 'universal'),
      h('Hubo un momento en que estuve a punto de [decisión drástica]. Hoy lo veo distinto.', 'coaches'),
      h('Mi primer intento de [acción] salió mal. Aprendí [lección] y hoy es [lo que es ahora].', 'negocios'),
      h('Te cuento algo que no suelo contar: [confesión breve].', 'terapia'),
    ],
  },
  {
    id: 'brujula-activacion',
    tone: 'brujula',
    title: 'Un empujón honesto',
    intent: 'Invita a decidir hoy con firmeza y sin presión artificial.',
    tip: 'El empujón funciona cuando la fecha o el cupo son reales. Si no lo son, apóyate en el costo de seguir igual en lugar de inventar escasez.',
    hooks: [
      h('[Resultado deseado] tiene un precio: [esfuerzo o inversión]. La pregunta es si estás lista para pagarlo.', 'universal'),
      h('Hoy puedes seguir como hasta ahora o dar el salto. ¿Qué eliges?', 'coaches'),
      h('El momento perfecto para [acción] no existe. Existe el siguiente paso: [paso].', 'universal'),
      h('Quedan [n] [cupos o días]. Si esto es para ti, hoy es buen momento para decidirlo.', 'negocios'),
    ],
  },
];

export const ALL_HOOKS = HOOK_GROUPS.flatMap((g) => g.hooks.map((hk, i) => ({ group: g, idx: i, hook: hk })));
export const HOOK_COUNT = ALL_HOOKS.length;

export function extractPlaceholders(text: string): string[] {
  const out: string[] = [];
  const re = /\[([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(m[1]);
  return out;
}

/** Guía para escribir ganchos: se muestra en el Laboratorio. */
export const HOOK_GUIDE = {
  what: 'El gancho son los primeros 2 a 10 segundos (o la primera línea). Su trabajo es dar una razón para quedarse: promete algo, abre una pregunta o rompe un patrón.',
  types: [
    { name: 'Vocal', desc: 'Lo que dices.' },
    { name: 'Visual', desc: 'Lo que se ve: un gesto, un objeto o un movimiento inesperado.' },
    { name: 'Auditivo', desc: 'Lo que se escucha: un sonido o una frase que corta el ruido.' },
    { name: 'Texto', desc: 'Lo que se lee en pantalla o en el primer slide.' },
    { name: 'Descripción', desc: 'La primera línea del texto que acompaña la publicación.' },
  ],
  rules: [
    'Corto: idealmente menos de 12 a 15 palabras. Las primeras 3 a 5 son las que más pesan.',
    'Claro: di qué ganan al seguir mirando, o de qué trata si es una historia.',
    'Con contexto: quien llega sin conocerte tiene que entender de qué hablas y por qué escucharte.',
    'Con curiosidad: abre una pregunta que solo se cierra viendo hasta el final.',
    'Sin revelar la recompensa: la respuesta va al final, no en el gancho.',
    'Rompe un patrón: un gesto, un objeto o una frase fuera de lo esperado detienen el scroll.',
  ],
  payoff: 'Retrasa la recompensa lo más que puedas con una historia, una metáfora o un ejemplo, y entrégala al final. Si das la respuesta a la mitad, quien miraba se va y el video pierde retención. Cuando la entregues, termina pronto.',
  ladder: 'Habla a quien está un escalón por encima de tu público: las personas del escalón de abajo te seguirán de forma natural, y las de arriba no te sentirán básica.',
};
