// [Claude Code · 2026-11-13] v5.31.0 (plan 31): tablas de fallas de "Breaking Your Stuff", Interface RED Vol. 5 pp.8-12.
// Una falla dura lo que indica y después el equipo vuelve a funcionar normal. El mantenimiento la elimina (p.8).

export type MalfunctionDuration = 'next' | '1 round' | '1 minute' | '1 hour' | '1 day' | 'month';

export interface MalfunctionRow {
  roll: 1 | 2 | 3 | 4 | 5 | 6;
  /** Texto completo en español. */
  text: string;
  /** Cuánto dura: 'next' = solo el próximo uso/ataque/vez; 'month' = el mantenimiento de este mes. */
  duration: MalfunctionDuration;
}

export type MalfunctionTableId =
  | 'armor' | 'cyberdeck' | 'cyberlimb' | 'cyberaudio_optics' | 'cyberware_body' | 'neuralware'
  | 'drone' | 'general_gear' | 'vehicle' | 'linear_frame' | 'weapon';

export interface MalfunctionTable {
  id: MalfunctionTableId;
  title: string;      // en español
  titleEn: string;    // título del libro, ej. 'Armor Malfunctions'
  page: number;       // página impresa
  rows: MalfunctionRow[]; // 6 filas, roll 1..6 en orden
}

export const MALFUNCTION_TABLES: MalfunctionTable[] = [
  {
    id: 'armor',
    title: 'Fallas de armadura',
    titleEn: 'Armor Malfunctions',
    page: 8,
    rows: [
      { roll: 1, duration: '1 day', text: "La trama está floja o las placas están blandas. Durante 1 día, cada vez que la armadura sufra ablación, pierde 1 punto adicional de SP." },
      { roll: 2, duration: '1 day', text: "Las correas están gastadas y deshilachadas. Durante 1 día, si sufrís una Critical Injury en la parte del cuerpo donde llevás la armadura, esta se cae." },
      { roll: 3, duration: '1 day', text: "Estiramientos o grietas en la composición de la armadura reducen su capacidad de absorber energía cinética. Durante 1 día, cada vez que te impacte un Ataque exitoso mientras llevás la armadura, recibís 1 de daño directo a tus HP y la armadura sufre ablación de 1, incluso si el daño no superó su SP." },
      { roll: 4, duration: '1 day', text: "El balance de la armadura está mal. Durante 1 día, aumentá su Armor Penalty en 1, incluso si normalmente es 0." },
      { roll: 5, duration: '1 minute', text: "Tu armadura se corre al moverte y te deja expuesto a daño. Durante 1 minuto, reducí a la mitad el SP de tu armadura frente al daño de armas de fuego y explosivos." },
      { roll: 6, duration: '1 day', text: "Una falla inadvertida en tu armadura la deja sumamente vulnerable a los tiros de suerte. Durante 1 día, la primera vez que tu armadura sufra ablación, pierde 2 puntos adicionales de SP." },
    ],
  },
  {
    id: 'cyberdeck',
    title: 'Fallas de cyberdeck',
    titleEn: 'Cyberdeck Malfunctions',
    page: 9,
    rows: [
      { roll: 1, duration: 'next', text: "El deck interpreta mal la información. Elegí un programa del deck que normalmente otorgue un bonus a un Interface Check. La próxima vez que se use, impone una penalización igual al bonus en lugar del bonus." },
      { roll: 2, duration: 'next', text: "Un circuito gastado causa retroalimentación. La próxima vez que hagas Jack Out, el deck echa chispas y un programa al azar que tenga cargado queda Destroyed." },
      { roll: 3, duration: '1 round', text: "Una sobrecarga interrumpe las funciones de un programa. Elegí al azar un Black ICE cargado en el Deck. Durante 1 Round después de que se haga rez, sus subrutinas de selección de blancos están dañadas y te ataca a vos en lugar de a un enemigo. Si el deck no tiene Black ICE, elegí al azar un programa: no funcionará durante 1 minuto." },
      { roll: 4, duration: 'next', text: "El puerto de tu Interface Plug está flojo. La próxima vez que recibas daño dentro de una NET Architecture (sea reducido o no), tenés que superar un Electronics/Security Tech Check DV15 o te sacan de la NET de forma insegura (Jacked Out)." },
      { roll: 5, duration: '1 minute', text: "Un sensor defectuoso registra un error inexistente. La próxima vez que hagas Jack In a una NET Architecture, tu cyberdeck empieza a emitir pitidos audibles y sigue haciéndolo durante 1 minuto, salvo que quede Destroyed." },
      { roll: 6, duration: '1 minute', text: "¿Cuándo fue la última vez que optimizaste tu cyberdeck? Durante 1 minuto después de hacer Jack In a una NET Architecture, tu cantidad de NET Actions se reduce en 1 (mínimo 1). Esto persiste aunque hagas Jack Out y después Jack In de nuevo." },
    ],
  },
  {
    id: 'cyberlimb',
    title: 'Cyberware: fallas de cyberlimb y borgware relacionado',
    titleEn: 'Cyberware: Cyberlimb and Related Borgware Malfunctions',
    page: 9,
    rows: [
      { roll: 1, duration: '1 minute', text: "El deterioro de los circuitos es un problema. Una de las opciones de tu cyberlimb se desactiva y no puede usarse durante 1 minuto. Si la opción ya estaba desplegada (por ejemplo, un Pop-up Weapon), en cambio no puede retraerse durante 1 minuto." },
      { roll: 2, duration: '1 minute', text: "Existe eso de que tu cyberlimb esté demasiado en sintonía con tu cerebro. Tu cyberlimb desarrolla un tic nervioso que anticipa tus intenciones. Sufrís una penalización de -2 a cualquier Social Skill Check durante 1 minuto." },
      { roll: 3, duration: 'next', text: "Los procesadores complejos que dirigen el movimiento de tu cyberlimb fallan. Hacé un Concentration Check DV15. Si fallás, soltás un objeto que sostenías (si es un cyberarm) o caés al suelo (si es una cyberleg)." },
      { roll: 4, duration: '1 hour', text: "Tu cyberlimb desarrolla microfracturas en sus fibras musculares de myomar. Demasiado esfuerzo puede agravar el daño. Durante 1 hora, si obtenés un Critical Success (un 10 en un d10) en un Skill Check en el que se usó el cyberlimb, ganás la Critical Injury Torn Muscle." },
      { roll: 5, duration: 'next', text: "Los motivadores inerciales de tu cyberlimb ejercen demasiada fuerza al moverse y golpeás sin querer al blanco más cercano. Tratalo como un Ataque de Brawling." },
      { roll: 6, duration: '1 minute', text: "Las articulaciones de tu cyberlimb se traban parcialmente. Dura 1 minuto. Si es un cyberarm, no podés soltar ni levantar un objeto con él. Si es una cyberleg, tu MOVE se reduce en 1 (mínimo 1)." },
    ],
  },
  {
    id: 'cyberaudio_optics',
    title: 'Cyberware: fallas de cyberaudio, cyberoptics y borgware relacionado',
    titleEn: 'Cyberware: Cyberaudio, Cyberoptics and Related Borgware Malfunctions',
    page: 9,
    rows: [
      { roll: 1, duration: '1 minute', text: "Datos basura llenan tu campo visual o tus procesadores auditivos y permanecen ahí durante 1 minuto o hasta que gastes una Acción en limpiarlos. Mientras los datos basura persistan sufrís una penalización de -1 a todos los Checks que requieran visión (si son cyberoptics) o audición (si es cyberaudio)." },
      { roll: 2, duration: '1 minute', text: "Tu campo visual o tu percepción auditiva se distorsiona. Durante 1 minuto, tenés un -1 a todos los Checks que involucren percepción espacial (si son cyberoptics) o equilibrio (si es cyberaudio)." },
      { roll: 3, duration: '1 hour', text: "Tu percepción del mundo pierde o gana definición. Durante 1 hora, solo podés ver en blanco y negro o en tonos de un color específico (si son cyberoptics) o escuchás un zumbido constante (si es cyberaudio). Hacé lo mejor que puedas por interpretarlo." },
      { roll: 4, duration: '1 hour', text: "Un circuito se gastó. Durante 1 hora, tus cyberoptics o tu suite de cyberaudio se niegan a conectarse de forma inalámbrica a cualquier otro dispositivo, salvo sus opciones instaladas. Esto incluye Agents, Chipware Sockets, linked tracers y electrónica personal similar." },
      { roll: 5, duration: '1 round', text: "Una opción desactivada de tus cyberoptics o de tu suite de cyberaudio se activa al azar y no puede apagarse durante 1 Round. El cambio repentino de perspectiva te oscurece la visión, e impone una penalización de -2 a cualquier Check que requiera visión (si son cyberoptics) o audición (si es cyberaudio)." },
      { roll: 6, duration: '1 hour', text: "Tus cybereyes o tu suite de cyberaudio se niegan a procesar las características que distinguen a otras personas. Durante 1 hora no podés identificar a nadie por sus rasgos faciales (si son cyberoptics) o por su voz (si es cyberaudio). Hacé lo mejor que puedas por interpretarlo." },
    ],
  },
  {
    id: 'cyberware_body',
    title: 'Cyberware: fallas de externo, interno y fashionware',
    titleEn: 'Cyberware: External, Internal, and Fashionware Malfunctions',
    page: 10,
    rows: [
      { roll: 1, duration: '1 day', text: "Pequeñas cantidades de una sustancia química tóxica se filtran a tu torrente sanguíneo. Durante 1 día, sentís náuseas y sufrís una penalización de -2 a todos los Resist Torture/Drug Checks." },
      { roll: 2, duration: 'next', text: "El cyberware se calienta hasta un grado insoportable por una fracción de segundo y te inflige 5 de daño directo a tus Hit Points. Este daño no puede ser absorbido por armadura." },
      { roll: 3, duration: '1 hour', text: "El cyberware parpadea y zumba, o emite un olor nocivo, durante 1 hora. Perdés cualquier bonus a Wardrobe & Style o Personal Grooming y sufrís una penalización de -2 a cualquier Social Skill Check." },
      { roll: 4, duration: '1 round', text: "Sentís un intenso escozor donde está instalado el cyberware. Durante 1 Round, antes de hacer cualquier Check tenés que superar un Concentration Check DV13. Si fallás, el Check que pensabas hacer también falla." },
      { roll: 5, duration: '1 day', text: "El cyberware falla durante 1 día. Si es Grafted Muscle and Bone Lace, conservás sus beneficios pero ganás un +1 a todos los Death Saves. Si es una armadura, conservás sus beneficios pero la armadura no puede repararse sola. En cualquier otro caso, el cyberware se apaga y no se puede acceder a él, usarlo, desplegarlo ni abrirlo." },
      { roll: 6, duration: '1 day', text: "La zona alrededor del cyberware se infecta y se inflama. Durante 1 día, cada vez que sufras una Critical Injury en una parte del cuerpo que contenga el cyberware o que este potencie, recibís 5 HP adicionales de daño extra." },
    ],
  },
  {
    id: 'neuralware',
    title: 'Cyberware: fallas de neuralware',
    titleEn: 'Cyberware: Neuralware Malfunctions',
    page: 10,
    rows: [
      { roll: 1, duration: '1 day', text: "Datos basura en tu Neuralware dificultan que te concentres. Sufrís una penalización de -4 a los Concentration Skill Checks durante 1 día." },
      { roll: 2, duration: 'next', text: "Sufrís una sobrecarga de energía en tu Neural Link. Una opción de Neuralware al azar se activa si estaba desactivada, o se desactiva si estaba activada. Activarla o desactivarla requiere una Acción." },
      { roll: 3, duration: '1 round', text: "Un dolor agudo en el cráneo te distrae. Durante 1 Round, antes de hacer cualquier Check tenés que superar un Concentration Check DV13. Si fallás, el Check que pensabas hacer también falla." },
      { roll: 4, duration: '1 minute', text: "Ciertos receptores de tu cerebro se activan y te hacen sentir intoxicado. Durante 1 minuto, sufrís una penalización de -2 a todos los Checks. Hacé lo mejor que puedas por interpretarlo." },
      { roll: 5, duration: '1 hour', text: "Tu mente empieza a nublarse. Durante 1 hora sufrís una penalización de -1 a todos los Skill Checks basados en INT." },
      { roll: 6, duration: '1 minute', text: "Los centros del lenguaje de tu cerebro se mezclan temporalmente. Solo podés hablar incoherencias durante 1 minuto." },
    ],
  },
  {
    id: 'drone',
    title: 'Fallas de drones',
    titleEn: 'Drone Malfunctions',
    page: 10,
    rows: [
      { roll: 1, duration: 'next', text: "El sistema de identificación de amigo o enemigo del dron anda mal. Su próximo Attack Check se hace contra vos o un aliado en lugar de un enemigo." },
      { roll: 2, duration: '1 hour', text: "El sistema de identificación de amigo o enemigo del dron anda muy mal. Durante 1 hora, el dron identifica a todos los blancos potenciales como amistosos u hostiles (a elección del GM)." },
      { roll: 3, duration: '1 hour', text: "Los receptores inalámbricos del dron funcionan mal. Durante 1 hora, no puede alejarse más de 2 m/yds del punto de emisión de su señal de control. Si lo hace, se desactiva." },
      { roll: 4, duration: '1 day', text: "La falta de mantenimiento expone por accidente una puerta trasera en los sistemas de control del dron. Durante 1 día, usar Electronics/Security Tech para contrarrestar al dron requiere solo 1 Acción en lugar de 5 minutos." },
      { roll: 5, duration: '1 minute', text: "Un circuito gastado causa problemas de comunicación dentro del cuerpo del dron. Una de sus opciones equipadas falla y no puede usarse, o deja de funcionar, durante 1 minuto." },
      { roll: 6, duration: '1 hour', text: "El sistema de locomoción del dron empieza a agarrotarse. El MOVE del dron se reduce a la mitad (redondeando hacia arriba) durante 1 hora." },
    ],
  },
  {
    id: 'general_gear',
    title: 'Fallas de equipo general y electrónica personal',
    titleEn: 'General Gear and Personal Electronics Malfunctions',
    page: 11,
    rows: [
      { roll: 1, duration: '1 day', text: "El objeto funciona mal. Durante 1 día, cada vez que uses el objeto para realizar una tarea, no ganás ningún bonus a los Checks y, de hecho, sufrís una penalización de -1 a cualquier Check asociado." },
      { roll: 2, duration: 'next', text: "El objeto te electrocuta, apuñala, pincha, raspa, golpea o te daña de algún otro modo por accidente, y te inflige 5 de daño directo a tus HP." },
      { roll: 3, duration: 'next', text: "Al objeto solo le queda cierta vida útil. Después de que se use la próxima vez, se rompe y queda Destroyed." },
      { roll: 4, duration: '1 minute', text: "Una herramienta mal mantenida no es mejor que no tener herramienta. Durante 1 minuto, no ganás ningún bonus a los Checks y, de hecho, sufrís una penalización de -2 a cualquier Check hecho mientras usás el objeto." },
      { roll: 5, duration: '1 hour', text: "¡Algo anda mal! El objeto se niega a realizar una función específica, a elección del GM, durante 1 hora." },
      { roll: 6, duration: 'month', text: "El problema no es fácil de detectar. Al comienzo del mes, el objeto no recibe el mantenimiento adecuado, aunque normalmente lo recibiría por el Lifestyle o por un Skill Check exitoso." },
    ],
  },
  {
    id: 'vehicle',
    title: 'Fallas de vehículos',
    titleEn: 'Vehicle Malfunctions',
    page: 11,
    rows: [
      { roll: 1, duration: '1 day', text: "Girás el motor. El vehículo tose y gime. Durante 1 día, cada vez que intentes arrancar el vehículo, hacé un Vehicle Tech Check DV15 apropiado. Si fallás, el vehículo no arranca y perdés una Acción." },
      { roll: 2, duration: '1 minute', text: "¡Caos! La radio, los faros, la bocina, los limpiaparabrisas y otras opciones no esenciales del vehículo se activan al azar durante 1 minuto." },
      { roll: 3, duration: '1 hour', text: "Sale humo del motor. La velocidad del vehículo (tanto en Combate como Narrativa) se reduce a la mitad (redondeando hacia arriba) durante 1 hora." },
      { roll: 4, duration: '1 day', text: "El vehículo parece propenso a calarse. En cualquier momento durante 1 día, el GM puede pedir un Vehicle Tech Check DV15 apropiado. Si fallás, el vehículo se cala y deja de moverse. Tenés que usar una Acción para reiniciarlo." },
      { roll: 5, duration: '1 hour', text: "El mecanismo de control está duro y no responde. Durante 1 hora, sufrís una penalización de -2 a cualquier Check hecho para conducir o pilotar el vehículo." },
      { roll: 6, duration: '1 hour', text: "Microfracturas en el chasis del vehículo lo vuelven vulnerable. Durante 1 hora, cualquier Ataque exitoso contra el vehículo inflige x2 de daño, como si se hubiera golpeado un punto débil." },
    ],
  },
  {
    id: 'linear_frame',
    title: 'Fallas de Linear Frame (interno y externo) y Cyberchair',
    titleEn: 'Linear Frame (Internal and External) & Cyberchair Malfunctions',
    page: 11,
    rows: [
      { roll: 1, duration: '1 minute', text: "Tus actuadores están desincronizados y afectan el equilibrio de tus movimientos. Durante 1 minuto, cuando termines una Acción de Movimiento, el Gamemaster te moverá 2 m/yds (1 casillero) a la izquierda o a la derecha de donde te detuviste." },
      { roll: 2, duration: 'next', text: "Un cortocircuito envía una descarga eléctrica por la estructura. Recibís 5 de daño directo a tus HP. Este daño no puede ser absorbido por armadura." },
      { roll: 3, duration: '1 hour', text: "Al activar los motores internos, los procesadores que los gobiernan fallan. Linear Frame: durante 1 hora tu BODY no es potenciado por tu linear frame, aunque tus Hit Points, tu Seriously Wounded Threshold y tu Death Save se siguen calculando como si lo fuera; Cyberchair: durante 1 hora tu MOVE mientras estás en la silla se reduce en 1." },
      { roll: 4, duration: '1 minute', text: "La falta de lubricación adecuada hace que las articulaciones se agarroten. Durante 1 minuto sufrís una penalización de -1 a todos los Skill Checks basados en DEX y REF." },
      { roll: 5, duration: '1 hour', text: "Un pistón está desalineado y produce un golpeteo cuando te movés. Durante 1 hora sufrís una penalización de -2 a todos los Stealth Checks, salvo que te quedes completamente quieto." },
      { roll: 6, duration: '1 day', text: "¡Pérdida de fluido! Linear Frame interno: la pérdida está dentro de tu cuerpo. Durante 1 día, sentís náuseas y sufrís una penalización de -2 a todos los Resist Torture/Drug Checks; Linear Frame externo y Cyberchairs: la pérdida deja un rastro detrás de vos. Dejás un vergonzoso reguero de líquido maloliente por donde vayas. Hacé lo mejor que puedas por interpretarlo." },
    ],
  },
  {
    id: 'weapon',
    title: 'Fallas de armas (incluidos explosivos)',
    titleEn: 'Weapon (Including Explosives) Malfunctions',
    page: 12,
    rows: [
      { roll: 1, duration: '1 minute', text: "Un filo desafilado o un cañón sucio arruina el momento. El arma inflige 1d6 menos de daño durante 1 minuto." },
      { roll: 2, duration: 'next', text: "Una empuñadura gastada o una mira mal calibrada provoca un accidente. A distancia: tu próximo Attack Check apunta a un aliado a menos de 6 m/yds del blanco en lugar de a un enemigo; Cuerpo a cuerpo: el arma se te resbala y la soltás; Explosivo arrojadizo: el explosivo cae a tus pies y detona. Hacé tu Attack Check normalmente para determinar el DV de una posible Evasion." },
      { roll: 3, duration: 'next', text: "Sin el cuidado adecuado, un arma se vuelve menos precisa. Sufrís una penalización de -2 a tu próximo Attack Check con esta arma." },
      { roll: 4, duration: '1 minute', text: "Una hoja desafilada o acumulación de carbonilla en el cañón reduce la eficacia. El arma no puede causar una Critical Injury mediante una tirada de daño durante 1 minuto." },
      { roll: 5, duration: 'next', text: "¿La limpiaste bien? ¿Te aseguraste de que los mecanismos no estuvieran trabados? Todos excepto Explosivos arrojadizos: después del próximo Attack Check, el arma se traba, sin importar su Quality; Explosivo arrojadizo: la próxima vez que se use en un Ataque, el explosivo cae pero no detona. Si se lo puede recuperar, se puede volver a usar." },
      { roll: 6, duration: '1 minute', text: "No es solo el arma o la hoja. También hay que revisar la munición, las cuerdas y las empuñaduras. Arma de fuego: toda la munición cargada actualmente en el arma queda Destroyed Beyond Repair; Cuerpo a cuerpo y arcos: el arma se trata como de Poor Quality durante 1 minuto. Si el arma ya es de Poor Quality, se considera Destroyed y no funcional durante 1 minuto; Explosivo arrojadizo: el explosivo se apaga sin detonar y queda Destroyed Beyond Repair." },
    ],
  },
];
