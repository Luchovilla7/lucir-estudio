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
