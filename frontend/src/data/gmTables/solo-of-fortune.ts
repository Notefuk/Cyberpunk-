// [Claude Code · 2026-11-13] v5.34.0 (plan 31): nivel mercenario y las 2 misiones de Solo of Fortune 2045 (Interface RED Vol. 5 pp.106-108, 144-147).
// Resúmenes propios en español para el GM. Los PNJ con ficha están en el bestiario (Hardened y ACPA, plan 30).
import type { GmAdventure } from './halloween';

/** Reglas del nivel mercenario (pp.106-108). Los parámetros de misión y el Hiring Hall están en Referencias IR5. */
export const MERC_LEVEL_RULES: string[] = [
  'Advertencia del GM: el equipo de Solo of Fortune 2045 está por encima de una campaña Street Level. Si los jugadores lo usan, la campaña pasa a nivel mercenario y el GM saca amenazas Hardened (p.106).',
  'Hot Tip para endurecer un PNJ rápido: +2 a todas sus Skills de ataque y defensa, y Tech Upgrade a su armadura para bajar en 1 todas sus penalizaciones o subirle 1 de SP. Salvo los Mooks, los PNJ Hardened no llevan ítems de Poor Quality (p.106).',
  'Un PJ que usa ítems de Solo of Fortune 2045 pasa a contar como "Hardened": el GM le pone amenazas Hardened (p.106).',
  'El nivel mercenario se centra en misiones de combate táctico con planificación; los golpes (heists) quedan para Street Level. Todos los Roles entran, con algo de creatividad (p.107).',
  'Balance: todo es Hardened. La oposición depende de la situación, no de cuántos PJ hay. El combatiente típico es un Hardened Lieutenant; los Hardened Mooks son novatos, y los Mini-Boss y Boss quedan para los momentos fuertes. Los enemigos llevan equipo militar (p.107).',
  'Crews rivales: el GM puede sacar personajes Complete Package con Habilidad de Rol, IP extra y hasta LUCK, para frenar o robarle la misión a la Crew (p.107).',
  'Botín: el nivel mercenario no está pensado para saquear todo. Lo que se gana en la guerra es del empleador: el equipo y el botín se devuelven al armory al volver a la base (pp.107-108).',
  'Presupuesto operativo: viene al principio del trabajo, aparte del pago. Lo que se compra con él no se lo queda la Crew después de la misión, y lo que no se gasta se pierde (p.108).',
  'Lejos de casa: durante la misión no se paga alquiler, y en el lugar la Crew suele tener un Headquarters (DLC No Place Like Home). El viaje lo decide el GM (p.108).',
  'La Habilidad de Rol del Fixer sirve para negociar más pago, igual que en un Job. Toda misión mercenaria sobrevivida cuenta al menos como misión exitosa para el IP de grupo (p.108).',
];

/** Kelly McAlister, bloque corto de Screamsheet Mission (p.145). */
export const KELLY_MCALISTER = {
  name: 'Kelly McAlister',
  role: 'Tech: Maker 4',
  reputation: 1,
  hp: 40,
  combatNumber: 15,
  init: 6,
  move: 6,
  skills: 'Athletics 8 · Concentration 6 · Conversation 6 · Human Perception 6 · Perception 12 · Persuasion 6 · Resist Torture/Drugs 17 · Stealth 15 · todas las Tech Skills 17',
  attacks: [
    { name: 'TUp Combat Jaw', rof: 1, damage: '5d6' },
    { name: 'Shotgun', rof: 1, damage: '5d6' },
  ],
  headSp: 13,
  bodySp: 13,
  armor: 'Crocodile Skin',
  gear: 'Combat Jaw · Cybereye w/ Anti-Dazzle, Low Light/Infrared/UV x2 · Gills · Neural Link w/ Chipware Socket & Pain Editor · Smoke Grenades (x4)',
  page: 145,
} as const;

export const SOLO_OF_FORTUNE_ADVENTURES: GmAdventure[] = [
  {
    id: 'ir5-georgia-on-my-mind',
    title: 'Georgia On My Mind',
    pages: '144-145',
    hookEs: 'SovOil contrata mercenarios para secuestrar a la hija de un líder de los rebeldes georgianos que financia Petrochem, y así frenar sus ataques a las instalaciones de SovOil en el sur de Estados Unidos. Paga 5,000eb por persona, con un presupuesto operativo de 5,000eb por persona. "Una nena sola en su casa."',
    setupEs: 'Un jefe de Operaciones Negables de SovOil con pasamontañas, que se hace llamar "Revmir Babich", da el briefing: sacar a Kelly McAlister del complejo fortificado de su familia en Panola Mountain. Los llevan con sus vehículos por mar a Atlanta, con base en los pisos 4 y 5 del Wright Hotel, y tienen 48 horas para aclimatarse. Si aparece resistencia local o la policía, están solos. Se cobra al entregar a Kelly viva en el hotel; si muere, no hay pago.',
    scenesEs: [
      'Investigación (DV15): Kelly tiene 32 años, no es una nena, y tiene dos maestrías (robótica e ingeniería de minería de tierras raras). SovOil solo encontró fotos suyas de ferias de robótica del secundario. Figura en dos patentes de robots mineros: el Rock Razer y el Mineral Softener.',
      'Investigación profunda (DV24): después de unas cirugías exóticas recientes, Kelly parece un cocodrilo. Por eso está sola: su familia y sus amigos le esquivan el bodysculpt. Su padre, Irvine McAlister, maneja la plata que Petrochem le da a los rebeldes; la quiere y la defiende, y juntos remodelan la casa.',
      'El rancho McAlister (10 acres) tiene una casa principal y una de huéspedes junto a un lago artificial. Casa principal, planta baja: porche con Laser Grid, baño y estudio con Stun Panels, comedor con Tip Floor, cocina con Wall Punchers y lavadero.',
      'Casa principal, planta alta: balcón sobre la entrada, baño principal con Goop, dos dormitorios, dormitorio principal y vestidor con Ceiling Punchers y un tobogán al sótano. El sótano es taller de robots y armería, tiene la arquitectura NET del rancho y un pasadizo secreto (DV15) al refugio antibombas.',
      'Casa de huéspedes: baño, dormitorio con Stun Panels, sala de billar con Electrical Flooring y cocina chica con Goop. Su sótano está vacío y también conecta con el refugio por un pasadizo secreto (DV15).',
      'El refugio antibombas es ahora un bowling de dos pistas (el hobby de Irvine), cuidado por 2 Automated Turrets que disparan bolas de bowling (5d6). Una puerta secreta (DV17) da a un túnel inundado que sale al lago.',
      'La operación empieza al atardecer del tercer día. Kelly sabe que vienen y tiene todo armado; si aguanta hasta la mañana, la rescata una Crew rival pagada por Petrochem. Tiene tantos Rock Razer y Mineral Softener como Edgerunners, cada dron con su propia arquitectura NET, y cuatro Thermal Decoys con forma de Rock Razer repartidos por el terreno.',
      'Si la Crew traiciona a SovOil, SovOil manda dos oleadas de Crews rivales contra ellos y Kelly, y la Crew de Petrochem queda fuera de escena. En ese caso Petrochem les paga lo que habría pagado SovOil, si Kelly sobrevive.',
    ],
    rulesEs: [
      'Wright Hotel: Headquarters con 16 camas, Morale Boost 4, Upgraded Lockup (6 celdas), Upgraded Medbay y Workstation (p.144).',
      'Rock Razer: Ground Drone con un Efreet, EQ Very Heavy Melee Weapon, Popup Shield, Observation Camera y 11 SP (p.144).',
      'Mineral Softener: Large Air Drone con un Efreet, EQ Flamethrower, Grenade Launcher con Incendiary Grenades y 11 SP (p.144).',
      `Kelly McAlister (${KELLY_MCALISTER.role}, Reputation ${KELLY_MCALISTER.reputation}): HP ${KELLY_MCALISTER.hp}, Combat # ${KELLY_MCALISTER.combatNumber}, INIT ${KELLY_MCALISTER.init}, MOVE ${KELLY_MCALISTER.move}. ${KELLY_MCALISTER.attacks.map((a) => `${a.name} (ROF${a.rof}) ${a.damage}`).join('; ')}. ${KELLY_MCALISTER.armor} SP${KELLY_MCALISTER.headSp} cabeza y cuerpo. Skills: ${KELLY_MCALISTER.skills}. Equipo y ciberware: ${KELLY_MCALISTER.gear} (p.145).`,
      'Arquitectura NET del rancho McAlister: está en NET & ROLES, "McAlister Ranch" (p.145).',
    ],
    rewardsEs: '5,000eb por persona al entregar a Kelly viva, más un presupuesto operativo de 5,000eb por persona. El File del piso 6 de la NET vale 5,000eb para SovOil.',
    npcIds: [],
  },
  {
    id: 'ir5-trouble-in-tanzania',
    title: 'Trouble in Tanzania',
    pages: '146-147',
    hookEs: 'Un aviso del Hiring Hall de Solo of Fortune: Tanzania necesita tropas para defender el mass driver del Kilimanjaro de la agresión del European Space Council (ESC). Presupuesto operativo de 25,000eb por persona (con Fixers y Techs que consiguen o fabrican lo que haga falta, ACPA a medida incluidas) y pago de 9,000eb por persona, con viaje de ida y vuelta a África.',
    setupEs: 'En la reunión de reclutamiento, en el futuro Night City Spaceport, la Crew es la única que aparece. Firman un acuerdo de confidencialidad y el embajador Joshua Mwambe, de la ArushaMoshi Metroplex, explica la misión: defender la batería antiaérea del mass driver en la cara oeste del pico Mawenzi durante las negociaciones con el ESC. Por el terreno de montaña, esperan que el enemigo mande ACPA.',
    scenesEs: [
      'Trasfondo: el ESC lleva meses convirtiendo la región en un campo de batalla secreto antes de una invasión para quedarse con el mass driver: sabotaje de comunicaciones, prensa comprada, EMP grandes y atentados en zonas comerciales. Hay protestas diarias contra el ESC, y grupos de odio aprovechan para atacar a comunidades inmigrantes europeas.',
      'La Crew llega al aeropuerto del Kilimanjaro en avión militar un mes antes de las negociaciones. Reciben uniformes tanzanos (con ellos los tratan como parte del Estado, y no a todos en la calle les gusta), una carta de apoyo firmada por el embajador, un Skill Chip de swahili, un Groundcar con Heavy Chassis y Seating Upgrade, y hotel pago en el Moshi Financial District.',
      'Dos semanas en la ciudad y dos en la base Marangu: momento para improvisar otro país, menos cínico que Night City, con disturbios políticos y trato distinto con y sin uniforme. Usá el Lifepath que cruza fronteras (empresas del Exec, contactos del Fixer y la Media, packs Nomad, fans del Rockerboy). Si hay combate, que se conecte con los disturbios o con saboteadores del ESC.',
      'Una semana antes de las negociaciones, una Crew rival pagada por el ESC los ataca mientras entrenan fuera de la base: solo quiere herirlos y escapar. Los capturados tienen Resist Torture/Drugs Base 16 y pueden revelar el ataque que viene. Los tanzanos los quieren vivos: si la Crew mata a un prisionero, se le descuentan 1,000eb a cada uno.',
      'Primer ataque: asalto a distancia para dañar las ACPA de la Crew, con 2 helicópteros de ataque y la ACPA Magus, que busca que la batería antiaérea se exponga para dispararle con su railgun.',
      'Segundo ataque (10 horas después, al día siguiente): asalto frontal con las Militech Commando y parte de los Hardened Security Operatives en un Groundcar, a elección del GM. Antes llegan de refuerzo dos operativos especiales (Hardened Security Officers con Shotguns y Explosive Slugs) y cualquier ayuda que la Crew haya conseguido.',
      'Tercer ataque (3 días después): todo lo que queda, incluida la ACPA Bombardier. El enemigo huye cuando todas sus ACPA se retiraron o cayeron. Si nadie escapó vivo o libre de la segunda batalla, la moral enemiga se quiebra y el tercer ataque no llega.',
      'Si la Crew gana, le ofrecen la ciudadanía tanzana. Pase lo que pase, cobra y la llevan al aeropuerto no europeo que elija.',
    ],
    rulesEs: [
      'Base militar Marangu: Headquarters con 12 camas, Lockup (1 celda), Medbay, Upgraded Training Area Workshop y Workstation (p.146).',
      'Batería antiaérea: operada a distancia, Combat Number 16, 15 SP, 100 HP, EQ Rocket Launcher con Long Tube y capacidad 50. Se esconde bajo tierra con 3 Acciones; escondida no se la puede atacar ni dañar. No se le puede hacer Jury Rig durante el combate (p.147).',
      'Fuerzas del ESC (fichas en los Hardened DLC; están en el bestiario): son inteligentes y se retiran si conviene. Las que quedan con menos de la mitad de HP en el primer o el segundo ataque no vuelven en el tercero (p.147).',
      'Hardened Security Operatives: el doble de Edgerunners + 3, con Battle Barrel en los Assault Rifles y munición Armor Piercing.',
      'Cloudburster: Hardened Lieutenant Reclaimer Chief Thunder, con Combat Awareness Rank 6, granadas Airburst Terrifier y Reflex Co-Processor.',
      'Sniper Eagle: Hardened Lieutenant Reclaimer Chief Lightning, con Combat Awareness Rank 6, Midnight Arms Dawnmaker AMR y Reflex Co-Processor.',
      'Iron Tiger: Hardened Lieutenant Security Officer Siege, con Combat Awareness Rank 6, Sigma External Linear Frame, Martial Arts (Judo) base 16 y Reflex Co-Processor.',
      'Vehículos: 2 helicópteros con Bulletproof Glass y Rocket Pod; 2 Groundcars con Armored Chassis, Bulletproof Glass, Heavy Chassis y Vehicle Heavy Weapon Mount con una Techtronika Russia BMG-500 y munición High Velocity.',
      'ACPA (en el Compendio, y los enemigos pueden subirse desde el bestiario): Militech Commando (1 por Edgerunner), SovOil Bombardier (1) y Tsunami Arms Magus (1).',
    ],
    rewardsEs: '9,000eb por persona (menos 1,000eb cada uno por prisionero muerto), presupuesto operativo de 25,000eb por persona y, si ganan, la ciudadanía tanzana.',
    npcIds: ['hardened-security-operative', 'hardened-reclaimer-chief-thunder', 'hardened-reclaimer-chief-lightning', 'hardened-security-officer-siege'],
  },
];
