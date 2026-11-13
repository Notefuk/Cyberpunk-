// [Claude Code · 2026-11-13] v5.32.0 (plan 31): sistema de investigación "Did Someone Say Murder?", Interface RED Vol. 5 pp.61-70.
// Reglas opcionales. Focus (p.63), Complexity (p.64), Obfuscation (p.64), pistas (p.65), obstáculos (p.67) y los 2 misterios de ejemplo (pp.69-70).

export const MYSTERY_SOURCE = 'Interface RED Vol. 5 pp.61-70';

/** Complexity: los "HP" del misterio (p.64). */
export const MYSTERY_COMPLEXITY: { id: string; label: string; value: number; example: string }[] = [
  { id: 'easy', label: 'Easy', value: 25, example: 'Una parte de una sola misión, como descifrar dónde va a ser el próximo Night Market.' },
  { id: 'average', label: 'Average', value: 50, example: 'La base o gran parte de una misión, como averiguar quién mató al Fixer de la Crew.' },
  { id: 'challenging', label: 'Challenging', value: 100, example: 'En curso a lo largo de varias misiones, como averiguar quién contrató al asesino del Fixer.' },
  { id: 'difficult', label: 'Difficult', value: 150, example: 'Subtrama importante de la campaña o de un PJ, como encontrar a una pareja desaparecida del Lifepath.' },
  { id: 'legendary', label: 'Legendary', value: 200, example: 'Sostiene toda la campaña, como descubrir quién trajo a la Crew de Nueva York a Night City… y por qué.' },
];

/** Obfuscation: el "SP" de la pista; se resta del daño a la Complexity (p.64). */
export const OBFUSCATION_LEVELS: { label: string; value: number; example: string }[] = [
  { label: 'None', value: 0, example: 'Un testigo que vio todo minutos después; una grabación completa y buena.' },
  { label: 'Light', value: 2, example: 'Un testigo borracho o drogado; una grabación clara pero parcial.' },
  { label: 'Heavy', value: 4, example: 'Alguien que lo escuchó de un testigo; una grabación completa pero mala.' },
  { label: 'Near Total', value: 6, example: 'Alguien que escuchó un rumor; una grabación mala e incompleta.' },
];

export interface ClueType {
  id: string;
  label: string;
  desc: string;
  skills: string;
  /** Daño a la Complexity si la Evidence Check sale bien. */
  damage: string;
  /** Daño a Focus de quien falla. */
  focusDamage: string;
  /** Qué pasa con una pifia (1 natural y falla). */
  fumble?: string;
}

/** Ejemplos de pistas (p.65). El GM puede inventar otras con esta escala. */
export const CLUE_TYPES: ClueType[] = [
  { id: 'auditing', label: 'Auditing', desc: 'Revisar registros para encontrar conexiones o discrepancias.', skills: 'Accounting o Bureaucracy', damage: '3d6', focusDamage: '2d6' },
  { id: 'autopsy', label: 'Autopsy', desc: 'Deducir la causa de muerte u otras heridas.', skills: 'Paramedic o Surgery', damage: '4d6', focusDamage: '3d6', fumble: 'El cuerpo se daña: las próximas Evidence Checks sobre el cuerpo van con −4.' },
  { id: 'chemical', label: 'Chemical Analysis', desc: 'Identificar una droga, un veneno u otra sustancia.', skills: 'Basic Tech o la Science que corresponda', damage: '3d6', focusDamage: '2d6', fumble: 'La muestra se destruye: no se puede seguir analizando sin otra.' },
  { id: 'deciphering', label: 'Deciphering', desc: 'Descifrar un mensaje secreto.', skills: 'Cryptography', damage: '2d6', focusDamage: '1d6' },
  { id: 'digital', label: 'Digital Scavenging', desc: 'Sacar información de Agents o computadoras.', skills: 'Electronics/Security Tech', damage: '4d6', focusDamage: '3d6', fumble: 'El dispositivo queda Destroyed y hay que repararlo antes de seguir.' },
  { id: 'forensics', label: 'Forensics', desc: 'Determinar qué pasó en la escena del crimen.', skills: 'Criminology o Deduction', damage: '4d6', focusDamage: '3d6', fumble: 'Una prueba clave queda Destroyed Beyond Repair y no da más información.' },
  { id: 'gossip', label: 'Gossip', desc: 'Preguntar a tus fuentes del barrio.', skills: 'Conversation, Persuasion o Streetwise', damage: '2d6', focusDamage: '1d6' },
  { id: 'interrogation', label: 'Interrogation', desc: 'Interrogar a un testigo o sospechoso.', skills: 'Human Perception o Interrogation', damage: '3d6', focusDamage: '2d6', fumble: 'Nadie de la Crew puede volver a intentar esta tirada.' },
  { id: 'observation', label: 'Observation', desc: 'Darse cuenta de algo raro en un testigo o una escena de un vistazo.', skills: 'Human Perception o Perception', damage: '2d6', focusDamage: '1d6' },
  { id: 'research', label: 'Research', desc: 'Buscar en archivos digitales u otras fuentes.', skills: 'Education o Library Search', damage: '2d6', focusDamage: '1d6' },
  { id: 'tailing', label: 'Tailing', desc: 'Seguir a alguien sin que se dé cuenta.', skills: 'Stealth', damage: '3d6', focusDamage: '2d6', fumble: 'El seguido se pone agresivo o se asusta, según corresponda.' },
  { id: 'tracking', label: 'Tracking', desc: 'Seguir un rastro.', skills: 'Tracking', damage: '2d6', focusDamage: '1d6' },
];

/** Obstáculos (p.67). Superarlo cuesta 1d6 de Focus; fallarlo, 2d6 (p.66). */
export const OBSTACLE_TYPES: { id: string; label: string; desc: string }[] = [
  { id: 'authority', label: 'Authority', desc: 'Corporaciones u otros poderosos traban el avance.' },
  { id: 'cultural', label: 'Cultural Disputes', desc: 'Diferencias culturales o de costumbres esconden información.' },
  { id: 'digital', label: 'Digital', desc: 'La información está guardada en arquitecturas NET difíciles de entrar.' },
  { id: 'distraction', label: 'Distraction', desc: 'Otro suceso hace difícil concentrarse en la investigación.' },
  { id: 'fatigue', label: 'Fatigue', desc: 'El cansancio físico y mental hace difícil avanzar.' },
  { id: 'legal', label: 'Legal', desc: 'La policía u otras fuerzas niegan el acceso a partes clave del caso.' },
  { id: 'location', label: 'Location', desc: 'El caso pasa en un lugar remoto o difícil de alcanzar.' },
  { id: 'misdirection', label: 'Misdirection', desc: 'La información del caso se pierde entre olas de chismes digitales.' },
  { id: 'missing', label: 'Missing Clue', desc: 'Una pista no está disponible por ahora y la frustración gasta Focus (alguien a quien interrogar no aparece hasta mañana, o buscan en el lugar equivocado).' },
  { id: 'red_herring', label: 'Red Herring', desc: 'Algo parece una pista y no lo es. Nunca se presenta como obstáculo: va como Evidence Check. Si superan la DV, se dan cuenta de que no es una pista; si fallan, se les dice que no la descifraron y pierden Focus como en una Evidence Check fallida.' },
  { id: 'social', label: 'Social Engineering', desc: 'Alguien manipula la información sobre el hecho.' },
  { id: 'tech', label: 'Technological Issues', desc: 'La tecnología del caso es difícil de usar por malas condiciones o por desconocida.' },
  { id: 'territory', label: 'Territory Disputes', desc: 'No se puede entrar a la zona del caso por pandillas u otra violencia.' },
  { id: 'clock', label: 'Ticking Clock', desc: 'El misterio tiene un plazo, que la Crew puede conocer o no. Es un obstáculo en sí mismo.' },
];

export const MYSTERY_RULES: string[] = [
  'Focus = 10 + 5 × ((INT + WILL) / 2, redondeado para arriba). Con 0 de Focus no se pueden hacer Evidence Checks. Hay un solo Focus para todos los misterios (p.63).',
  'Recuperación: descansando un día sin hacer otra cosa (ni Hustle ni Habilidad de Rol), cuando recuperás HP por descanso recuperás también INT + WILL de Focus; con Concentration DV15, 5 más (p.63).',
  'Evidence Check: Skill adecuada contra la DV de la pista. Si sale, se tira el daño de la pista y se le resta la Obfuscation antes de bajarlo de la Complexity. Si falla, quien tiró pierde el Focus de la pista. Con un 1 natural y falla (pifia) puede haber complicaciones; el Fumble Recovery del Solo no las evita (p.64).',
  'Una Evidence Check por PJ, por pista, por día. Si alguien de la Crew la supera, la pista se cobra y el daño entra, pero los que fallaron igual pierden Focus (p.66).',
  'Si la Crew no sabe por dónde seguir: Deduction DV15 para una pista de dónde buscar; cuesta 1d6 de Focus (p.66).',
  'Obstáculos: una tirada con la DV que elija el GM o un Beat entero. Superarlo cuesta 1d6 de Focus; fallarlo, 2d6 (p.66).',
  'Con la Complexity en 0, la Crew tiene todo para resolverlo. Si los jugadores lo resuelven antes, el GM decide: pedir más pruebas, bajarla a 0 o cambiar la pregunta (p.66).',
];

export interface MysteryClueTemplate {
  type: string;
  skill: string;
  dv: number;
  damage: string;
  obfuscation: number;
  focusDamage: string;
  text: string;
}

export interface MysteryTemplate {
  id: string;
  title: string;
  complexity: number;
  goal: string;
  clues: MysteryClueTemplate[];
  obstacles: { type: string; text: string }[];
  source: string;
}

/** Los 2 misterios de ejemplo (pp.69-70). */
export const SAMPLE_MYSTERIES: MysteryTemplate[] = [
  {
    id: 'grab-and-smash',
    title: 'Grab and Smash',
    complexity: 25,
    goal: 'A tu bar favorito le llegaron cajas extra de Smash para la noche de club, pero alguien las "liberó" del depósito. Fue el hijo del proveedor de Smash.',
    clues: [
      { type: 'Auditing', skill: 'Accounting', dv: 13, damage: '3d6', obfuscation: 0, focusDamage: '2d6', text: 'El dueño del bar recibió esa tarde un lote nuevo de Smash de su proveedor de siempre, que tiene llave.' },
      { type: 'Forensics', skill: 'Criminology/Deduction', dv: 13, damage: '4d6', obfuscation: 0, focusDamage: '3d6', text: 'La puerta exterior del depósito se abrió, pero la cerradura no está rota.' },
      { type: 'Gossip', skill: 'Conversation', dv: 13, damage: '2d6', obfuscation: 0, focusDamage: '1d6', text: 'El proveedor tiene un hijo que pasa el rato con sus amigos en bici en un paso bajo nivel viejo.' },
      { type: 'Interrogation', skill: 'Interrogation', dv: 15, damage: '3d6', obfuscation: 2, focusDamage: '2d6', text: 'El proveedor tiene un hijo que pasa el rato con sus amigos en bici en un paso bajo nivel viejo.' },
      { type: 'Observation', skill: 'Perception', dv: 13, damage: '2d6', obfuscation: 2, focusDamage: '1d6', text: 'En el callejón de atrás del bar hay marcas de rueda de bicicleta muy marcadas: alguien cargó un trailer de bici.' },
      { type: 'Tracking', skill: 'Tracking', dv: 13, damage: '2d6', obfuscation: 2, focusDamage: '1d6', text: 'Las huellas de bici llevan a una obra con un puente viejo sobre un paso bajo nivel, de donde sale música.' },
    ],
    obstacles: [],
    source: 'IR5 pp.69-70',
  },
  {
    id: 'someone-stole-it-first',
    title: 'Someone Stole It First!',
    complexity: 50,
    goal: 'Entraste a un Midnight Market para robar un chip de memoria ultrasecreto de la caja fuerte del anfitrión, pero cuando llegaste a la oficina alguien se te adelantó.',
    clues: [
      { type: 'Digital Scavenging', skill: 'Electronics/Security Tech', dv: 13, damage: '4d6', obfuscation: 4, focusDamage: '3d6', text: 'El anfitrión usa un teléfono descartable además de su Agent. Los mensajes dicen quién quiere el objeto.' },
      { type: 'Forensics', skill: 'Criminology/Deduction', dv: 13, damage: '4d6', obfuscation: 2, focusDamage: '3d6', text: 'La caja fuerte de la oficina fue forzada, no abierta con la combinación.' },
      { type: 'Gossip', skill: 'Conversation', dv: 13, damage: '2d6', obfuscation: 2, focusDamage: '1d6', text: '¿El anfitrión tiene enemigos que (aparte de vos) quieran robarle? Hay treinta invitados, pero la información se repite después de seis charlas.' },
      { type: 'Interrogation', skill: 'Interrogation', dv: 15, damage: '3d6', obfuscation: 2, focusDamage: '2d6', text: '¿Algún invitado vio a alguien merodeando? Hay treinta invitados, pero la información se repite después de tres charlas.' },
      { type: 'Observation', skill: 'Human Perception', dv: 17, damage: '2d6', obfuscation: 4, focusDamage: '1d6', text: 'Alguien en el evento hace todo lo posible por no llamar la atención de seguridad.' },
      { type: 'Observation', skill: 'Wardrobe & Style', dv: 13, damage: '2d6', obfuscation: 4, focusDamage: '1d6', text: 'El evento tiene código de vestimenta. ¿Quién no está del todo bien vestido?' },
      { type: 'Research', skill: 'Library Search', dv: 15, damage: '2d6', obfuscation: 2, focusDamage: '1d6', text: 'Revisar las grabaciones de seguridad sacadas de la arquitectura NET de seguridad.' },
      { type: 'Tracking', skill: 'Tracking', dv: 15, damage: '2d6', obfuscation: 4, focusDamage: '1d6', text: 'El ladrón dejó marcas de botas en la alfombra de la oficina, nada que ver con la ropa de fiesta de oficina del resto.' },
    ],
    obstacles: [
      { type: 'Authority', text: 'Son invitados: no tienen autoridad para interrogar a nadie ni para influir en seguridad.' },
      { type: 'Digital', text: 'Hay una cámara en la oficina, pero para verla hace falta entrar a la arquitectura NET o a una consola de la oficina de seguridad.' },
      { type: 'Distraction', text: 'El Midnight Market sigue y la Crew tiene que parecer que participa para no levantar sospechas.' },
      { type: 'Red Herring', text: 'Un invitado se robó la invitación de su padre o su madre, y sus nervios pueden pasar por culpa.' },
      { type: 'Territory Disputes', text: 'La Crew no puede volver a la escena del crimen sin llamar la atención de los guardias.' },
      { type: 'Ticking Clock', text: 'El edificio está cerrado y nadie salió todavía. Las puertas se abren cuando termina el Midnight Market.' },
    ],
    source: 'IR5 p.70',
  },
];
