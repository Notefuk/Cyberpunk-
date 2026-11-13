// [Claude Code · 2026-11-13] v5.30.0 (plan 31): Screamsheet Generator (tablas A-D, bylines, campos y pasos), Interface RED Vol. 5 pp.83-96.

export type ScreamsheetKindId = 'news_flash' | 'neon_lights' | 'help_wanted';

export interface ScreamsheetLine { roll: number; text: string }

/** headlines: números de titular permitidos (1..6) que sugiere el libro; 'any' = "Any". */
export interface ScreamsheetConclusion extends ScreamsheetLine { headlines: number[] | 'any' }

export interface ScreamsheetHeadline { roll: number; code: string; text: string }

export interface ScreamsheetKind {
  id: ScreamsheetKindId;
  title: string;
  titleEn: string;
  /** Rango de la Tabla A (1d6). */
  typeRoll: string;
  intro: ScreamsheetLine[];
  body: ScreamsheetLine[];
  conclusion: ScreamsheetConclusion[];
  headlines: ScreamsheetHeadline[];
  sourcePages: string;
}

export const SCREAMSHEET_KINDS: ScreamsheetKind[] = [
  {
    id: 'news_flash',
    title: '¡Flash de Noticias! (Violencia y Percances)',
    titleEn: 'News Flash! (Violence and Mishaps)',
    typeRoll: '1-2',
    // Tabla B1 (IR5 p.87)
    intro: [
      { roll: 1, text: 'Como nuestros lectores habituales recordarán, [Nombre 1], prominente [Relación o Cargo] de [Grupo 1], fue reportado desaparecido hace [Número] semanas tras el [Incidente] en [Lugar]. [Grupo 1] ofreció una recompensa por cualquier información que lleve al regreso sano y salvo de [Nombre 1], pero se avanzó poco desde su desaparición.' },
      { roll: 2, text: '“¡Pasó todo tan de repente!”, dijeron los testigos sobre el incidente del [Día de la Semana] a la [Hora del Día].' },
      { roll: 3, text: '“Jamás podríamos haberlo planeado”, comentó el vocero de [Grupo 1] tras el reciente desastre.' },
      { roll: 4, text: 'Todos los distritos tienen sectores más duros, pero parece que [Lugar (Barrio)] viene soportando más problemas de la cuenta. La semana pasada les contamos de la batalla entre [Grupo 1] y [Grupo 2], pero parece que eso fue solo el comienzo del problema.' },
      { roll: 5, text: 'Bueno, choombas... Finalmente pasó. Hace semanas que les venimos contando de la creciente rivalidad entre [Grupo 1] y [Grupo 2].' },
      { roll: 6, text: 'Las tensiones entre [Grupo 1] y [Grupo 2] por fin estallaron esta semana en [Lugar (Barrio)]. La pelea duró apenas unos minutos, pero dejó trágicas consecuencias.' },
    ],
    // Tabla B2 (IR5 p.88)
    body: [
      { roll: 1, text: 'El nombre de [Nombre 1] se volvió de uso cotidiano en las últimas semanas. Entre sus logros notables figuran [Logros].' },
      { roll: 2, text: 'La violencia estalló anoche, ya tarde. Fuentes informan que, tras un intenso tiroteo con [Grupo 2], agentes de [Grupo 1] fueron vistos apurando a un desaliñado [Cargo] llamado [Nombre 1] para sacarlo de la zona.\n\nNuestros reporteros intentaron seguir el rastro, pero perdieron de vista al grupo entre las calles concurridas.' },
      { roll: 3, text: 'Sea cual sea la verdad, las cosas llegaron a un punto crítico anoche, cuando media docena de [miembros del Grupo 2] inundaron la calle y atacaron un [Lugar o Tipo de Vehículo] fuertemente custodiado. [miembros del Grupo 1], incluido [Relación o Cargo] [Nombre 1], devolvieron el fuego, pero no fueron lo bastante rápidos para evitar que [Grupo 2] causara graves daños.' },
      { roll: 4, text: '[Lugar] hace tiempo que es descrito como [Adjetivo]. Desde hace mucho corren rumores de que [Grupo 1] viene canalizando [Sustantivo (plural)] hacia la zona. [Fuerza de Seguridad] investigó la participación de [Grupo 1] varias veces, pero nunca pudo confirmar nada.\n\n“Nuestro negocio no es asunto de [Fuerza de Seguridad]”, dijo célebremente el vocero de [Grupo 1] a principios de este año.' },
      { roll: 5, text: 'Fuentes internas sugieren que [Grupo 1] viene contratando discretamente [Tipo de Trabajo (plural)] desde principios de este año, y que no son nada exigentes con a quién contratan.\n\nSi bien los detalles se desconocen, podemos confirmar que [Grupo 1] acumuló una colección de [Tipo de Ítem] en torno a uno de sus [Tipo de Lugar] en [Lugar (Barrio)].' },
      { roll: 6, text: '¡Parece que alguien por fin cruzó la puta línea, y estamos acá para contarles la historia! O lo estaríamos, si alguien lograra ponerse de acuerdo con su versión.\n\nDurante el tiroteo de anoche en [Lugar] entre [Grupo 1] y [Grupo 2], la mayoría de los testigos huyó. Ya saben, lo que uno hace cuando empiezan a volar balas.\n\n¿Los pocos que se quedaron? Este reportero está bastante seguro de que habrían dicho cualquier cosa que quisiéramos oír a cambio de unos pocos eb.\n\nNadie tenía la cabeza lo bastante en su sitio como para ponerse de acuerdo en quién empezó la mierda, pero podemos confirmar que al menos una persona, [Relación o Cargo] [Nombre 1], resultó herida durante el conflicto.' },
    ],
    // Tabla B3 (IR5 p.89)
    conclusion: [
      { roll: 1, headlines: [1], text: 'Desde esta mañana, representantes de [Grupo 1] aseguran haber trasladado a [Relación o Cargo] [Nombre 1] a un lugar seguro.\n\nEl estado de [Nombre 1] y las circunstancias de su desaparición siguen siendo un misterio. Consultado, [Grupo 1] se limitó a decir que pasará un tiempo antes de que [Nombre 1] vuelva a la vida pública, pero que son optimistas respecto de su recuperación total. Por razones de seguridad personal, el paradero de [Nombre 1] se mantendrá en estricto secreto mientras se recupera.\n\n[Nombre 2] dará un paso al frente para cumplir todas las funciones necesarias durante su ausencia.' },
      { roll: 2, headlines: [2], text: 'Actualización: un nuevo informe trae noticias de la prematura muerte de [Nombre 1]. No se revelaron las circunstancias exactas del fallecimiento. Sin embargo, [Grupo 1] pidió a quien quiera “honrar a [Nombre 1]” que se una a ellos esta noche en [Lugar].\n\n¿Será un solemne homenaje o una turba vengativa? ¡Vuelvan mañana para enterarse de lo último!' },
      { roll: 3, headlines: [3], text: 'Para cuando llegó [Fuerza de Seguridad], [miembros del Grupo 2] ya habían huido de la escena, dejando nueve muertos a su paso, incluidos cuatro transeúntes.\n\n[Grupo 1] ofreció una recompensa a quien pueda nombrar a cualquiera de los atacantes. Vean a [Nombre 2] en [Lugar] para más detalles.' },
      { roll: 4, headlines: [3, 4], text: '[Grupo 1] pidió refuerzos y finalmente restableció el orden, rechazando los ofrecimientos de ayuda de [Fuerza de Seguridad]. “Más les vale no meter la nariz donde no los llaman”, comentó off the record a nuestros reporteros uno de los [Relación o Cargo] de [Grupo 1].\n\n¡Parece que [Grupo 1] está decidido a manejar las cosas por su cuenta! ¡Vuelvan mañana para más detalles, mientras nuestros galardonados reporteros les traen más sobre esta impactante serie de sucesos!' },
      { roll: 5, headlines: [3, 5, 6], text: 'La pelea fue sorprendentemente breve. [Grupo 2] parecía estar preparándose para irrumpir en el [Tipo de Lugar], pero se replegó rápido, quizás por los rumores de que los refuerzos de [Grupo 1] venían a toda velocidad.\n\nCuriosamente, un testigo reportó haber visto a un [miembro del Grupo 2] huyendo con un maletín metálico en la mano. ¡Más detalles apenas los recibamos!' },
      { roll: 6, headlines: [4], text: 'Mientras tanto, la situación pasó de mala a peor para los vecinos cuando se activó un dron [Adjetivo] guardado en algún lugar del escondite de [Grupo 2]. La máquina arrasó la zona, aplastando vehículos y transeúntes a su paso y derribando la pared frontal de un edificio cercano antes de que [Grupo 3] pudiera neutralizarla.\n\nConsultado, el vocero de [Grupo 2] se limitó a decir: “Con la innovación viene el riesgo. Solo podemos esperar que la gente de Night City comprenda la suerte que tiene de estar en la vanguardia de avances tan maravillosos.”\n\n[Grupo 2] ofreció compensar a las víctimas de este último percance, siempre que puedan documentar debidamente sus pérdidas y firmar las renuncias legales correspondientes.' },
    ],
    // Tabla B4 (IR5 p.90)
    headlines: [
      { roll: 1, code: 'NF1', text: '¡[Nombre 1] aparece con vida!' },
      { roll: 2, code: 'NF2', text: '¡[Nombre 1] aparece muerto!' },
      { roll: 3, code: 'NF3', text: '¡Tiroteo en [Lugar]!' },
      { roll: 4, code: 'NF4', text: '¡Dron fuera de control causa estragos en [Lugar (Barrio)]!' },
      { roll: 5, code: 'NF5', text: '¡La tragedia golpea en [Lugar (Barrio)]!' },
      { roll: 6, code: 'NF6', text: '¡La rivalidad entre [Grupo 1] y [Grupo 2] se vuelve violenta!' },
    ],
    sourcePages: 'IR5 pp.86-90',
  },
  {
    id: 'neon_lights',
    title: '¡En Luces de Neón! (Noticias de Espectáculos)',
    titleEn: 'In Neon Lights! (Entertainment News)',
    typeRoll: '3-4',
    // Tabla C1 (IR5 p.90)
    intro: [
      { roll: 1, text: '¡[Nombre 1] sigue deslumbrándonos! ¡Su último proyecto puede ser su mayor logro hasta ahora!' },
      { roll: 2, text: 'Nos acostumbramos a las actuaciones innovadoras e impactantes de [Nombre 1], pero su último [Tipo de Medio] puede ser el más polémico hasta ahora.' },
      { roll: 3, text: 'Si estuviste despierto aunque sea a medias este año, seguramente te llegó el cruce de insultos entre [Nombre 1] y [Nombre 2]. Antes [Tipo de Relación], los dos parecen haber desarrollado una amarga rivalidad desde el [Incidente].' },
      { roll: 4, text: 'A principios de este mes les contamos una noticia impactante sobre el [Incidente] en [Lugar]. Pues bien, ¡no teman, mis adorados fans! Lo volví a hacer. Su sabueso favorito estuvo rastreando los detalles y, joder, ¡este es jugoso y está conectado con el famoso [Nombre 1]!' },
      { roll: 5, text: '[Nombre 2] debe de haberse echado atrás después del [Tipo de Evento] del fin de semana pasado. Según cuenta [Nombre 1], el [Tipo de Desastre] que envolvió [Lugar] el domingo empezó como una inocente broma entre miembros de sus respectivos equipos.' },
      { roll: 6, text: 'Los fans tuvieron un adelanto del nuevo proyecto de [Nombre 1] ayer, cuando [Tipo de Medio] de su última obra llegó a la Data Pool.' },
    ],
    // Tabla C2 (IR5 p.91)
    body: [
      { roll: 1, text: 'Conocido por [Logros], [Nombre 1] se sentó con nuestros reporteros para darnos un adelanto de lo próximo grande que viene.' },
      { roll: 2, text: 'Mientras los fans elogian este nuevo [Tipo de Medio] como [Adjetivo], [Adjetivo] e incluso [Adjetivo], los críticos tuvieron palabras más duras. La columna, notoriamente directa, de [Nombre del Crítico] incluso tomó un giro amenazante. “Si [Recinto] cancela el [Tipo de Evento], quizás alguien nos haga el favor de volar por los aires el maldito lugar antes de que [Nombre 1] pueda infligirnos más de esta basura”, escribió [Nombre del Crítico].' },
      { roll: 3, text: 'Pero la exhibición de esta semana se lleva el premio. [Nombre 2] interrumpió su [Tipo de Evento] el [Día de la Semana] por la noche para soltar una cáustica letanía de los defectos de [Nombre 1]. Sus quejas, gritadas a los cuatro vientos, iban desde [Queja Menor] hasta [Crimen].\n\nConsultado, [Nombre 1] respondió: “Qué lástima que no puedan superar lo bueno que soy, ¿no?”' },
      { roll: 4, text: 'El revuelo era por el [Tipo de Medio]: ¡oigan, es genial! Pero es el drama detrás de escena lo que nos hace volver por más.\n\n[Tipo de Relación] de [Nombre 2] interrumpió el [Evento] de [Nombre 1] anoche, y lo único que podemos decir es que los fans lo [Sentimiento]. En los dos minutos y trece segundos antes de que seguridad se lo llevara a rastras a la trastienda, [Tipo de Relación] de [Nombre 2] se aseguró de que su presencia en [Evento] fuera más notoria que el [Tipo de Medio] de [Nombre 1].' },
      { roll: 5, text: 'Los que recién sintonizan ahora deben de estar preguntándose cómo se llegó a este punto. ¡Bueno, justo eso le preguntamos a [Nombre 1]!\n\n“Eh, choomba, ya sabés cómo es. Es el negoooocio”, le dijo a [Nombre del Reportero]. “Se te mete en [Parte del Cuerpo]. Te arruina. Toda la atención. Te hace hacer locuras.”' },
      { roll: 6, text: 'El nuevo [Tipo de Medio] de [Nombre 1] divide opiniones. A la mayoría de los fans les encanta, pero hay quienes encuentran el nuevo contenido impactante e incluso espantoso.\n\n“Soy fan de [Nombre 1] desde siempre”, le dijo [Nombre del Fan] a este reportero. “¡No puedo creer que esté haciendo algo así!”' },
    ],
    // Tabla C3 (IR5 p.92)
    conclusion: [
      { roll: 1, headlines: [1, 2], text: 'En un sorprendente cambio de ritmo, [Nombre 1] expuso sus planes para [Logros (Cualquiera)] y lo único que podemos decir es: ¡Guau! ¿Hay algo que este superastro no pueda hacer? Vuelvan la semana próxima para una exclusiva en profundidad en la que nos sentaremos con [Nombre 1] para conocer los pormenores de cómo llegó hasta acá y adónde irá después. ¡Cuidado, Night City!' },
      { roll: 2, headlines: [1, 2, 6], text: 'Mientras los críticos hablan basura... Quiero decir, caray, ese es su trabajo, ¿no?' },
      { roll: 3, headlines: [1, 2, 6], text: 'Puede que no sean para todos los gustos, ¡pero sin duda están arrasando! Los números no mienten: ¡[Nombre 1] podría ser la próxima gran sensación!' },
      { roll: 4, headlines: [3, 4, 5], text: '¿Hay de verdad oscuros secretos detrás del reciente ascenso a la fama de [Nombre 1]? ¡Compren el próximo número para nuestra exclusiva del [Día de la Semana] por la noche y decidan por ustedes mismos!' },
      { roll: 5, headlines: [3, 4, 5], text: 'Los fans tienen una sola pregunta: ¡¿Qué hará [Nombre 2] a continuación?!' },
      { roll: 6, headlines: [6], text: 'Piensen lo que piensen del nuevo [Tipo de Medio], una cosa es segura: [Nombre 1] no tenía intención de que saliera a la calle todavía. El nuevo contenido parece haberse publicado antes de estar terminado. Al preguntársele qué iba a hacer al respecto, [Nombre 1] se limitó a decir: “No sé, quizás invito a cenar un buen bife al doomba que lo filtró, quizás directamente lo elimino. Hicieron que todo el mundo hable de mí, pero ¿es el tipo de conversación que quiero?” ¿Esta cadena de sucesos se volverá violenta?\n\n¡Vuelvan mañana para la cobertura más reciente!' },
    ],
    // Tabla C4 (IR5 p.92)
    headlines: [
      { roll: 1, code: 'NL1', text: '¡[Nombre 1] lo hizo otra vez!' },
      { roll: 2, code: 'NL2', text: '¡[Nombre 1] pega fuerte!' },
      { roll: 3, code: 'NL3', text: '¡Escándalo en [Lugar]!' },
      { roll: 4, code: 'NL4', text: '¡La trama se complica! Los rumores sobre el [Incidente] siguen creciendo' },
      { roll: 5, code: 'NL5', text: '¡[Nombre 1] lo cuenta todo!' },
      { roll: 6, code: 'NL6', text: '¡La filtración de [Tipo de Medio] deja a los fans gritando!' },
    ],
    sourcePages: 'IR5 pp.90-92',
  },
  {
    id: 'help_wanted',
    title: '¡Se Busca Personal!',
    titleEn: 'Help Wanted!',
    typeRoll: '5-6',
    // Tabla D1 (IR5 p.93)
    intro: [
      { roll: 1, text: '¿Sos rápido y discreto? ¿Capaz de cargar muchas cosas a la vez? ¡[Grupo 1/Organización] te necesita!' },
      { roll: 2, text: '¿Conocés las calles de [Lugar (Barrio)] de punta a punta? ¿Tus amigos están hartos de oírte presumir de que nunca te perdés? ¿Querés convertir ese conocimiento en unos eb?' },
      { roll: 3, text: '¿Te destacás por tu temple? ¿Tu mirada sola hace que los doombas se arrepientan de haber nacido? ¿Podés frenar en seco a los débiles con solo tensar los músculos?' },
      { roll: 4, text: '¿Las palabras son tu arma favorita? ¿Podés mantener la cara seria aun cuando la gente habla mierda de vos? ¿Necesitás conseguir efectivo rápido? Bueno, no busques más.' },
      { roll: 5, text: 'Se necesitan acompañantes para escoltar a [Tipo de Trabajo] de alto perfil a próximos eventos sociales. Hacer feliz al jefe. Asegurarse de que el cliente la pase bien. Asegurarse de que vuelva a casa de una pieza. Paga fácil para el choomba indicado. Debe saber vestirse solo.' },
      { roll: 6, text: '¿Sos rápido como la puta madre? ¿Sabés cómo hacer que las cosas se hagan? ¿Tenés olfato para saber qué atajos se pueden tomar? [Tipo de Trabajo] prominente busca respaldo para un próximo evento. Debe ser competente. Debe traer su propio equipo.' },
    ],
    // Tabla D2 (IR5 p.93)
    body: [
      { roll: 1, text: 'Trabajo fácil, pero los últimos tres genios que creyeron que daban la talla... no la dieron. Dispuestos a ser más que generosos con alguien que no sea una pérdida de tiempo.' },
      { roll: 2, text: 'La discreción es prioridad absoluta. Si no podés cerrar la boca, ni te molestes. ¿Sos de los que tienen ganas de alardear una vez terminado el trabajo? No esperes alardear por mucho tiempo. La privacidad es de suma importancia.' },
      { roll: 3, text: '¡Entonces [Grupo 1/Empresa] te necesita!' },
      { roll: 4, text: 'Solo se presentan los mejores. Nos reservamos el derecho de pegarles un tiro a los doombas que nos hagan perder el tiempo, sin previo aviso.' },
      { roll: 5, text: 'Requisitos: buen gusto para vestir. Buenos modales. Conocimiento práctico de [Área de Especialidad].' },
      { roll: 6, text: 'Debe ser un hábil multitarea. Oportunidades de ascenso para postulantes calificados que rindan bien bajo presión.' },
    ],
    // Tabla D3 (IR5 p.94)
    conclusion: [
      { roll: 1, headlines: [1, 2, 4, 5, 6], text: '¿Pensás que sos vos? Vení a demostrarlo. Advertencia: si la cagás, estás solo. Solo respaldamos a los ganadores.' },
      { roll: 2, headlines: 'any', text: 'Hacé un buen trabajo y te conseguimos algo que el dinero no puede comprar: entradas para el [Evento] de la semana que viene, con entradas agotadas, con [Artista o Equipo Deportivo]. Contactá a [Nombre 1] para más detalles.' },
      { roll: 3, headlines: 'any', text: 'Hablá con [Nombre 1] en [Lugar], ¡y asegurate de mencionar este aviso para recibir un bono extra de ingreso!' },
      { roll: 4, headlines: [3, 4], text: '¿Creés que tenés lo que hace falta? Demostralo. Pasá por [Lugar] el [Fecha y Hora]. Venite preparado. Te vamos a poner a prueba.' },
      { roll: 5, headlines: [1, 4, 5, 6], text: 'Paga fácil para el postulante indicado. Bono si de paso dejás bien parado a [Grupo 1/Organización].\n\nContactá a [Nombre 1] para más detalles.' },
      { roll: 6, headlines: 'any', text: '¿Te interesa? Pasá por [Lugar] después del cierre para hablar de trabajo. Venite armado. No es el mejor barrio y, si no podés llegar vivo hasta ahí, de todos modos no te queremos.' },
    ],
    // Tabla D4 (IR5 p.94)
    headlines: [
      { roll: 1, code: 'HW1', text: '¡Se necesita ayuda para “entregas”!' },
      { roll: 2, code: 'HW2', text: 'Se necesitan patovicas en [Lugar]' },
      { roll: 3, code: 'HW3', text: 'Se busca: alguien con un poco de puta discreción' },
      { roll: 4, code: 'HW4', text: 'Vos: necesitando efectivo rápido. Nosotros: buscando hacer crecer el negocio.' },
      { roll: 5, code: 'HW5', text: 'Se busca ayuda para un próximo trabajo' },
      { roll: 6, code: 'HW6', text: 'Se necesita [Tipo de Trabajo]' },
    ],
    sourcePages: 'IR5 pp.93-94',
  },
];

export interface ScreamsheetByline { name: string; beat: string }

// "Adding a Byline" (IR5 p.85)
export const SCREAMSHEET_BYLINES: ScreamsheetByline[] = [
  { name: 'Angie Wu 2.0', beat: 'Gente e historia de Night City.' },
  { name: 'G.F. Bits', beat: 'Noticias e información sobre cyberware.' },
  { name: 'Jackie McGee', beat: 'Sección corporativa.' },
  { name: 'J.E. Munroe', beat: 'Notas de interés público.' },
  { name: 'Jericho Hunt', beat: 'Lo que sea con tal de juntar plata para comer. Subversivo en secreto.' },
  { name: 'Jumpshot', beat: 'Periodista freelance de “zonas de combate”.' },
  { name: 'Kelly Oddmeyer', beat: 'Música y espectáculos.' },
  { name: 'Lana Smithee', beat: 'Firma genérica usada por los redactores de Augmented Optic.' },
  { name: 'Lindsey Tabor', beat: 'Educación y Night City University.' },
  { name: 'Miller Marcus', beat: 'Periodista de tecnología.' },
  { name: 'Thompson', beat: 'Seudónimo usado por periodistas que quieren permanecer en el anonimato.' },
  { name: 'Ziggy “Front” Page', beat: 'Periodista todoterreno.' },
];

export interface ScreamsheetToken { token: string; hint: string }

// Mapeo único EN -> ES de los campos entre corchetes del libro (IR5 p.84, "Step 4: Filling in the Details").
export const SCREAMSHEET_TOKENS: ScreamsheetToken[] = [
  { token: '[Nombre 1]', hint: 'Nombre de persona principal (Name 1).' },
  { token: '[Nombre 2]', hint: 'Nombre de una segunda persona (Name 2).' },
  { token: '[Grupo 1]', hint: 'Grupo, empresa o banda principal (Group 1).' },
  { token: '[Grupo 2]', hint: 'Segundo grupo, empresa o banda (Group 2).' },
  { token: '[Grupo 3]', hint: 'Tercer grupo, p. ej. quien neutraliza o interviene (Group 3).' },
  { token: '[Grupo 1/Organización]', hint: 'Grupo u organización que busca personal (Group 1/Organization).' },
  { token: '[Grupo 1/Empresa]', hint: 'Grupo o negocio que busca personal (Group 1/Business).' },
  { token: '[miembros del Grupo 1]', hint: 'Integrantes del Grupo 1 (Group 1\'s members).' },
  { token: '[miembros del Grupo 2]', hint: 'Integrantes del Grupo 2 (members of Group 2 / Group 2\'s members).' },
  { token: '[miembro del Grupo 2]', hint: 'Un integrante del Grupo 2 (Group 2 member).' },
  { token: '[Relación o Cargo]', hint: 'Relación o cargo de una persona (Relationship or Job Title).' },
  { token: '[Tipo de Relación]', hint: 'Tipo de relación entre personas (Relationship Type).' },
  { token: '[Cargo]', hint: 'Cargo laboral (Job Title).' },
  { token: '[Tipo de Trabajo]', hint: 'Tipo de trabajo u oficio (Job Type).' },
  { token: '[Tipo de Trabajo (plural)]', hint: 'Tipo de trabajo u oficio, en plural (Job Type + s).' },
  { token: '[Número]', hint: 'Un número (Number).' },
  { token: '[Incidente]', hint: 'Un incidente (Incident).' },
  { token: '[Lugar]', hint: 'Un lugar (Location).' },
  { token: '[Lugar (Barrio)]', hint: 'Un barrio de la ciudad (Location (Neighborhood)).' },
  { token: '[Lugar o Tipo de Vehículo]', hint: 'Un lugar o tipo de vehículo (Location or Vehicle Type).' },
  { token: '[Tipo de Lugar]', hint: 'Tipo de lugar (Location Type).' },
  { token: '[Día de la Semana]', hint: 'Día de la semana (Day of the Week).' },
  { token: '[Hora del Día]', hint: 'Momento del día (Time of Day).' },
  { token: '[Fecha y Hora]', hint: 'Fecha y hora (Date and Time).' },
  { token: '[Logros]', hint: 'Logros de una persona (Achievements).' },
  { token: '[Logros (Cualquiera)]', hint: 'Cualquier logro (Achievements (Any)).' },
  { token: '[Adjetivo]', hint: 'Un adjetivo; se puede pedir a los jugadores (Adjective).' },
  { token: '[Sustantivo (plural)]', hint: 'Un sustantivo, en plural (Noun + s).' },
  { token: '[Fuerza de Seguridad]', hint: 'Grupo de seguridad pública, p. ej. NCPD, 6th Street, MAX-TAC (Law Enforcement Group).' },
  { token: '[Tipo de Ítem]', hint: 'Tipo de objeto (Item Type).' },
  { token: '[Tipo de Medio]', hint: 'Tipo de medio o producción: braindance, video, música, etc. (Media Type).' },
  { token: '[Tipo de Evento]', hint: 'Tipo de evento (Event Type).' },
  { token: '[Evento]', hint: 'Un evento concreto (Event).' },
  { token: '[Tipo de Desastre]', hint: 'Tipo de desastre (Disaster Type).' },
  { token: '[Nombre del Crítico]', hint: 'Nombre del crítico (Critic\'s Name).' },
  { token: '[Recinto]', hint: 'Local o sala donde se presenta el evento (Venue).' },
  { token: '[Queja Menor]', hint: 'Una queja trivial (Petty Complaint).' },
  { token: '[Crimen]', hint: 'Un crimen (Crime).' },
  { token: '[Sentimiento]', hint: 'Un sentimiento o reacción (Feeling).' },
  { token: '[Nombre del Reportero]', hint: 'Nombre del reportero (Reporter\'s Name).' },
  { token: '[Parte del Cuerpo]', hint: 'Una parte del cuerpo (Body Part).' },
  { token: '[Nombre del Fan]', hint: 'Nombre de un fan (Fan Name).' },
  { token: '[Artista o Equipo Deportivo]', hint: 'Artista o equipo deportivo (Performer or Sports Team).' },
  { token: '[Área de Especialidad]', hint: 'Área de especialidad (Area of Expertise).' },
];

// Procedimiento (IR5 p.84, "Using the Generator").
export const SCREAMSHEET_STEPS: string[] = [
  'Paso 1 - Tipo de artículo: elegí el tipo (¿flash de noticias, espectáculos o aviso de búsqueda de personal?) o tirá 1d6 en la Tabla A. El formato determina qué tablas de contenido se usan.',
  'Paso 2 - Párrafos de contenido: en las tablas del tipo elegido, tirá una vez en cada una (intro, cuerpo y conclusión) o elegí la que prefieras. Si algunos párrafos no combinan, volvé a tirar o reescribí el texto.',
  'Paso 3 - Titular: el titular depende de la conclusión; la nota al final del párrafo de conclusión indica de qué titulares elegir.',
  'Paso 4 - Completar los detalles: rellená los campos entre corchetes con personas, lugares o cosas de los libros de Cyberpunk RED, de tu campaña o inventados; si el campo indica una parte de la oración, podés pedirla a los jugadores.',
  'Paso 5 - Pulido: leé el artículo completo de principio a fin para verificar que tenga sentido, y volvé a tirar o reemplazá lo que no encaje con la historia que querés contar.',
];
