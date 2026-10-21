import type { CharacterEra } from '../types/cyberpunk';
import type { SourceBookId } from './enemiesCatalog';
import { ABOUT_FBCS_GUIDE, FBC_13_BODIES } from './goingMetalFbcData';

export interface SourceBookMeta {
  id: SourceBookId | 'all';
  title: string;
  shortBadge: string;
  era: CharacterEra | 'both';
  accentColor: string;
  whatItBringsSummary: string;
  keyHighlights: string[];
  mechanicsIntroduced: string[];
}

export interface ExpansionRuleSystem {
  id: string;
  title: string;
  subtitle: string;
  sourceBook: SourceBookId;
  sourceBookTitle: string;
  era: CharacterEra | 'both';
  categoryBadge: string;
  introDescription: string;
  howItWorksSteps: string[];
  keyBenefits: string[];
  drawbacksAndRisks: string[];
  referenceTable?: {
    headers: string[];
    rows: string[][];
  };
}

// ============================================================================
// 1. SOURCEBOOKS CATALOG & INTRODUCTORY LORE/MECHANIC SUMMARIES
// ============================================================================

export const SOURCEBOOKS_CATALOG: SourceBookMeta[] = [
  {
    id: 'all',
    title: 'Catálogo Maestro Universal (Todos los Manuales)',
    shortBadge: 'TODOS',
    era: 'both',
    accentColor: '#00f0ff',
    whatItBringsSummary:
      'Vista consolidada de toda la biblioteca oficial de Cyberpunk RED y Cyberpunk 2077. Incluye más de 350 armas, blindajes, ciberware, programas y consumibles de todas las fuentes.',
    keyHighlights: [
      'Búsqueda unificada en todas las expansiones y DLCs.',
      'Filtros por era histórica (2045 vs 2077) y categoría de catálogo.',
      'Compatibilidad total con el motor de combate y la ficha de personaje.'
    ],
    mechanicsIntroduced: ['Filtrado por sourceBook', 'Badges temáticos visuales por manual']
  },
  {
    id: 'core',
    title: 'Cyberpunk RED Core Rulebook',
    shortBadge: '2045 CORE',
    era: '2045',
    accentColor: '#ff003c',
    whatItBringsSummary:
      'El manual fundacional del juego. Ambientado en 2045 durante la era de reconstrucción tras la 4ª Guerra Corporativa. Establece el motor matemático canónico, el cálculo de HP, la matriz de DVs por metro, la ablación de blindaje y los 272 ítems esenciales de la calle.',
    keyHighlights: [
      'Las 15 Armas Exóticas canónicas (Malorian Arms 3516, Kendachi Mono-Three, Helix, etc.).',
      'Catálogo completo de Ciberware clásico de 8 ranuras anatómicas.',
      'Sistemas de Netrunning con arquitecturas piso por piso y Black ICE analógico.',
      '10 Roles icónicos con sus habilidades especiales a Rango 4.'
    ],
    mechanicsIntroduced: [
      'Cálculo de HP canónico y Umbral de Herida Grave (-2 global)',
      'Tiradas desacopladas: Impacto 1d10 y Daño Xd6',
      'Ablación de SP en tiempo real',
      'Matriz de DVs por rangos métricos'
    ]
  },
  {
    id: 'black_chrome',
    title: 'Black Chrome Tech & Style Guide',
    shortBadge: 'BLACK CHROME',
    era: '2045',
    accentColor: '#e0a800',
    whatItBringsSummary:
      'El catálogo comercial de lujo y alta tecnología más aclamado de Night City. Aporta más de 170 ítems premium: vehículos terrestres y aéreos con reglas de Puntos de Daño Estructural (SDP), armas exóticas especializadas, blindajes de diseñador y los avanzados Linear Frames Vermilion y Fūma Kotarō.',
    keyHighlights: [
      'Reglas de Vehículos completos con SDP, plazas, velocidad de combate y maniobras.',
      'Linear Frames especializados para artes marciales y operaciones encubiertas.',
      'Armas de marcas legendarias: Rostović, Sternmeyer, Sanroo y Tsunami.',
      'Ciberware de patrocinio corporativo y prótesis ergonómicas modulables.'
    ],
    mechanicsIntroduced: [
      'Combate y persecuciones vehiculares con SDP',
      'Embestidas (Ramming) con multiplicador de velocidad',
      'Linear Frames externos e internos para BODY 12+'
    ]
  },
  {
    id: 'cemk_2077',
    title: 'Cyberpunk Edgerunners Mission Kit (2077)',
    shortBadge: '2077 CEMK',
    era: '2077',
    accentColor: '#00ff66',
    whatItBringsSummary:
      'La adaptación oficial a la era del anime Cyberpunk: Edgerunners y el videojuego 2077. Introduce el Neuroport unificado de serie, la reconstrucción balística en armas Power (rebotes), Tech (perforación de coberturas) y Smart (guiado), junto con el sistema de Quickhacking inalámbrico en combate y mecánicas de Ciberpsicosis acelerada.',
    keyHighlights: [
      'Neuroport (1,000 €$, HL 7): gratis y sin pérdida de Humanidad al crear un personaje de 2077 (CEMK p. 25).',
      '11 Quickhacks oficiales sin RAM: 1 NET Action cada uno, 1 por objetivo por turno (CEMK pp. 16-17).',
      '13 armas 2077 de CEMK pp. 31-34 (Yukimura, Masamune, Shingen, Carnage, Unity, Zhuo, Crusher, Lexington, Omaha, Satara, Burya, Grad y Nekomata).',
      'Fichas de la tripulación de David Martinez, Lucy, Rebecca, Maine y Kiwi.'
    ],
    mechanicsIntroduced: [
      'Armas Power (rebotes tácticos y +5 crítico)',
      'Armas Tech (disparo cargado que ignora 50% SP y muros)',
      'Armas Smart 2077 (+1 ataque; con Improved Smart Ammunition, segundo intento con 14 + 1d10 si falla por 5 o menos)',
      'Quickhacking de Neuroports sin RAM (Jack In, Breach, Quickhack, Boot Out)',
      'Inmunobloqueadores y episodios de Ciberpsicosis con EMP <= 2'
    ]
  },
  {
    id: 'interface_red',
    title: 'Interface RED (Vol 1, 2 y 3 / Going Metal)',
    shortBadge: 'INTERFACE RED',
    era: '2045',
    accentColor: '#a855f7',
    whatItBringsSummary:
      'Recopilación de expansiones profundas de R. Talsorian Games. Su pieza cumbre (Vol. 3) contiene las reglas completas de Full Body Conversion (FBC), permitiendo trasplantar el cerebro humano en una Biovaina (Biopod) para habitar chasis cyborgs militares acorazados como el legendario IEC Dragoon de Adam Smasher.',
    keyHighlights: [
      'Reglas oficiales de Full Body Conversion (FBC) y Biovaina blindada.',
      'Los 7 Chasis Cyborg oficiales: IEC Alpha, Gemini, Enforcer, Samson, Dragoon, DaiOni y Vermilion.',
      'Armamento pesado de calibre Borg para usuarios con BODY 11+.',
      'Drones de apoyo técnico, ciberware exótico y módulos de recuperación.'
    ],
    mechanicsIntroduced: [
      'Inmunidad FBC (asfixia, venenos, toxinas, ahogamiento)',
      'Intercambio modular de chasis conservando la misma Biovaina',
      'Pérdida de Humanidad reducida a la mitad en implantes FBC'
    ]
  },
  {
    id: 'danger_gal',
    title: 'Danger Gal Dossier',
    shortBadge: 'DANGER GAL',
    era: '2045',
    accentColor: '#ec4899',
    whatItBringsSummary:
      'El compendio definitivo de facciones, bandas y PNJs de Night City. Proporciona expedientes clasificados de la agencia de investigación Danger Gal liderada por Michiko Sanderson, con estadísticas listas para combate de facciones como Maelstrom, Tyger Claws, Zhirafa, Piranhas y mercenarios corporativos.',
    keyHighlights: [
      'Expedientes de PNJs con nombre, trasfondo, tácticas y equipo completo.',
      'Subfusiles Smart especiales como el Danger Gal "Kitty" SMG.',
      'Tácticas de escuadra y reglas de coordinación de seguridad corporativa.',
      'Fichas de enemigos divididas por distrito y nivel de amenaza.'
    ],
    mechanicsIntroduced: [
      'Reglas de investigación y contra-espionaje',
      'Tácticas de emboscada coordinada para escuadras de seguridad'
    ]
  },
  {
    id: 'dlc',
    title: 'DLCs Oficiales & Expansiones Digitales',
    shortBadge: 'DLC OFICIAL',
    era: 'both',
    accentColor: '#3b82f6',
    whatItBringsSummary:
      'Colección de suplementos mensuales publicados por R. Talsorian Games: Hornet\'s Pharmacy (aditivos químicos y dispersión osmótica), Hardened Enemies (versiones letales de pandilleros y guardias con pools de suerte), 12 Days of Gunmas (armas exóticas experimentales) y salvamento náutico.',
    keyHighlights: [
      'Hornet\'s Pharmacy: Nuevos fármacos de combate (Sixgun, Berserk, Prime Time).',
      'Enemigos Hardened con estadísticas potenciadas para grupos de jugadores veteranos.',
      'Armas navideñas Gunmas: Militech Fox Dual-Ammo y Midnight Arms Erebus.',
      'Sistemas de aditivos médicos y vectores osmóticos para Medtechs.'
    ],
    mechanicsIntroduced: [
      'Aditivos químicos y vectores de administración osmótica',
      'Escalado de amenaza con enemigos Hardened',
      'Armas de munición dual'
    ]
  }
];

// ============================================================================
// 2. EXPANSION RULES & SYSTEMS COMPENDIUM (8 Complete In-Depth Systems)
// ============================================================================

export const EXPANSION_RULE_SYSTEMS: ExpansionRuleSystem[] = [
  // --------------------------------------------------------------------------
  // 1. FULL BODY CONVERSION (FBC)
  // --------------------------------------------------------------------------
  {
    id: 'fbc-rules',
    title: 'Conversión de Cuerpo Completo (Full Body Conversion — FBC)',
    subtitle: 'La transformación total de carne a cromo: Biovaina y chasis robóticos acorazados',
    sourceBook: 'interface_red',
    sourceBookTitle: 'Going Metal',
    era: '2045',
    categoryBadge: 'CIBERNETICA AVANZADA // BORG',
    introDescription: ABOUT_FBCS_GUIDE.summary,
    howItWorksSteps: ABOUT_FBCS_GUIDE.conversionSteps.map((st) => `Paso ${st.step} (${st.title}): ${st.detail}`),
    keyBenefits: ABOUT_FBCS_GUIDE.tacticalProsAndCons.pros,
    drawbacksAndRisks: ABOUT_FBCS_GUIDE.tacticalProsAndCons.cons,
    referenceTable: {
      headers: ['Cuerpo', 'BODY', 'REF/DEX/MOVE mín.', 'SP', 'Penalizador', 'HL paquete', 'Pág.'],
      rows: FBC_13_BODIES.map((b) => [
        b.name,
        String(b.bodyOverride),
        b.statFloor ? String(b.statFloor) : '—',
        `SP ${b.baseArmorSp}`,
        b.armorPenalty ? `-${b.armorPenalty}` : '—',
        String(b.packageHlAverage),
        String(b.sourcePage)
      ])
    }
  },

  // --------------------------------------------------------------------------
  // 2. NEUROPORT ECOSYSTEM 2077
  // --------------------------------------------------------------------------
  {
    id: 'neuroport-2077',
    title: 'Ecosistema Neuroport 2077 (CEMK)',
    subtitle: 'La plataforma neural estándar universal que unifica comunicaciones, biometría y visión',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    categoryBadge: 'ERA 2077 // HARDWARE FUNDACIONAL',
    introDescription:
      'En el año 2077, el viejo procesador Neuralware de la posguerra es una reliquia obsoleta. Todo ciudadano de Night City lleva implantado en el cráneo un Neuroport de serie desde su adolescencia. Este sistema integrado actúa como el sistema operativo del cuerpo humano, combinando teléfono celular, biometría, interfaz de datos y proyección de realidad aumentada sin cables en un solo paquete gratuito.',
    howItWorksSteps: [
      'Paso 1 (Integración Gratuita de Inicio): En la Era 2077, todo personaje recibe automáticamente el Neuroport con sus 7 subsistemas incluidos a 0 €$ y 0 pérdida de Humanidad en la creación.',
      'Paso 2 (Comunicaciones Holocall): Permite realizar llamadas de voz y videollamadas holográficas proyectadas directamente en la retina sin necesidad de sostener un teléfono Agent en la mano.',
      'Paso 3 (HUD Táctico Ocular): Proyecta en tiempo real la cantidad de balas en el cargador del arma en mano, la integridad de tu blindaje y los signos vitales de tus aliados de escuadra.',
      'Paso 4 (Personal Link de Muñeca): Cable retráctil de 2 metros ubicado en la muñeca derecha que permite conectarse físicamente a terminales, vehículos para arranque sin llave y armas Smartguns.'
    ],
    keyBenefits: [
      'Ahorro masivo de recursos: Reemplaza Neural Link, Interface Plugs, Biomonitor, Chyron, Virtuality, Internal Agent y 2 ranuras de Chipware que en 2045 costaban más de 2,500 €$ y 20+ puntos de Humanidad.',
      'Acceso a tecnología balística 2077: Es el requisito obligatorio para sincronizar armas Smart con seguimiento balístico y armas Tech con carga electromagnética.',
      'Conexión instantánea a la Red: Navegación por el Data Pool y fragmentos de datos (Shards) insertables directamente en la nuca.'
    ],
    drawbacksAndRisks: [
      '¡Vulnerabilidad a Quickhacks!: Al poseer un transceptor neural inalámbrico permanente, cualquier Netrunner enemigo a menos de 50 metros puede hackear tu sistema nervioso directamente.',
      'Monitoreo corporativo: El Neuroport emite un identificador digital que la policía del NCPD y las megacorporaciones pueden rastrear en áreas públicas salvo que instales parches clandestinos (Self-ICE).'
    ],
    referenceTable: {
      headers: ['Subsistema Integrado', 'Función Mecánica en Juego', 'Equivalente 2045 Ahorrado'],
      rows: [
        ['Neural Link Integrado', 'Procesador neural central con 5 ranuras de ciberware', 'Neuralware Processor (1,000 €$)'],
        ['Holocall + Agent Interno', 'Llamadas holográficas, IA asistente y base de datos', 'Internal Agent (100 €$)'],
        ['HUD Ocular + Chyron', 'Proyección de munición, mira y telemetría en retina', 'Chyron Cyberoptic (100 €$)'],
        ['Biomonitor Subdérmico', 'Lectura de HP en vivo y alerta de toxinas en sangre', 'Biomonitor Implant (100 €$)'],
        ['Virtuality Retiniana', 'Visualización de interfaces virtuales y ciberespacio', 'Virtuality Goggles (100 €$)'],
        ['Personal Link (2m)', 'Cable de muñeca para Smartguns y control vehicular', 'Interface Plugs (500 €$)'],
        ['2x Ranuras para Chipware', 'Inserción plug-and-play de Skill Chips y Shards', 'Chipware Socket (500 €$)']
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 3. REMOTE QUICKHACKING 2077
  // --------------------------------------------------------------------------
  {
    id: 'quickhacking-2077',
    title: 'Quickhacking de Neuroports (CEMK 2077)',
    subtitle: 'Hackeo inalámbrico de ciberware sin RAM: 1 NET Action por Quickhack, 1 por objetivo por turno (CEMK pp. 15-17, 26-27)',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    categoryBadge: 'NETRUNNING TACTICO // ERA 2077',
    introDescription:
      'Solo se puede hackear a quien tiene Neuroport. En su turno el Netrunner hace 1 Meat Action o hasta 3 NET Actions, además de su Move Action (CEMK p. 15). Interface nunca suma STAT: es Interface + 1d10, con LUCK, Complementary Checks y Extra Time como cualquier Skill, y lo bajan los penalizadores de Grapple y Wound States (CEMK p. 16). No hay RAM. El alcance depende del equipo: 6 m con Cyberdeck externo (8 m con la opción adecuada) o 50 m con un Cyberdeck en Neuroport Cyberdeck Port, siempre con línea de visión (CEMK p. 26).',
    howItWorksSteps: [
      'Jack In (1 NET Action): Interface + 1d10 vs WILL + 1d10 del objetivo. Entras aunque falles, pero si fallas el objetivo sabe que lo hackean. Con Interface 1-2 primero hay que superar el firewall básico del Neuroport (DV 6, fallar no alerta); con Interface 3+ se pasa solo (CEMK pp. 16, 26).',
      'Breach (1 NET Action por Passwall): cada Self-ICE instalado es un Passwall; el DV para romperlos es 6 con uno, 8 con dos, y +2 por cada uno más (CEMK p. 16).',
      'Quickhack (1 NET Action): Interface + 1d10 vs el DV del Quickhack. Solo 1 intento por objetivo por turno, aunque te queden NET Actions. Con éxito el objetivo sabe que lo hackearon (salvo Lure) (CEMK p. 16).',
      'Boot Out: como Acción (ROF 1) el objetivo puede expulsarte con WILL + Concentration + 1d10 vs Interface + 1d10. Si te expulsan no puedes volver a entrar en 60 minutos (CEMK p. 16). Jack Out (1 NET Action) te desconecta de forma segura.'
    ],
    keyBenefits: [
      'Overheat y Synapse Burnout hacen daño directo a HP que ignora la armadura y no la ablaciona (CEMK p. 16-17).',
      'Rango de Interface desbloquea los niveles: Simple DV 6 (rango 1), Standard DV 8 (2), Difficult DV 10 (3), Advanced DV 12 (4) (CEMK p. 26).',
      'Conexión directa con Interface Plug: +1 NET Action por turno e ignora Passwalls, pero no Black ICE (CEMK p. 27).'
    ],
    drawbacksAndRisks: [
      'Sin Neuroport no hay Quickhack posible (CEMK p. 15).',
      'Si te expulsan por cualquier vía que no sea Jack Out, es un Jack Out inseguro con sus consecuencias normales (CEMK p. 26).',
      'El Neuroport puede tomar prestado el Black ICE del Cyberdeck al que está conectado (CEMK pp. 26-27).'
    ],
    referenceTable: {
      headers: ['Quickhack', 'Nivel', 'DV', 'Efecto (CEMK pp. 16-17)'],
      rows: [
        ['Impair Movement', 'Simple', 'DV 6', 'MOVE -1 durante 60 segundos (20 Rounds). Con MOVE 0 no puede hacer Move Action.'],
        ['Sonic Shock', 'Simple', 'DV 6', 'Sufre la Herida Crítica Damaged Ear sin el daño extra, durante 60 segundos (20 Rounds).'],
        ['Overheat', 'Standard', 'DV 8', 'Se prende fuego: 4 de daño directo a HP al final de su turno hasta apagarlo (Acción en su turno). Ignora armadura y no la ablaciona.'],
        ['Short Circuit', 'Standard', 'DV 8', 'El GM elige 3 ciberware (no Cyberarm, Cyberleg, Cybereye, Cyberaudio Suite, Neuroport ni su Cyberdeck) que dejan de funcionar 60 segundos.'],
        ['Cyberware Malfunction', 'Difficult', 'DV 10', 'Un ciberware a elección (no Neuroport ni su Cyberdeck Port) queda inoperable 60 segundos, con sus opciones. Un cyberlimb actúa como Broken Arm o Broken Leg.'],
        ['Lure', 'Difficult', 'DV 10', 'Al inicio de su turno hace una Move Action que controla el Netrunner. Solo si no sabe que lo hackean, y no lo alerta. No sirve para llevarlo a un peligro obvio.'],
        ['Slow', 'Difficult', 'DV 10', 'MOVE -1d6 durante 60 segundos (20 Rounds). Con MOVE 0 no puede hacer Move Action.'],
        ['Synapse Burnout', 'Difficult', 'DV 10', '3d6 de daño directo a HP. Ignora armadura y no la ablaciona.'],
        ['Puppet', 'Advanced', 'DV 12', 'Controlas su Action y su Move Action en su próximo turno, usando sus STATs y Skills.'],
        ['Shard Ejection', 'Advanced', 'DV 12', 'Expulsa un chipware instalado a una casilla adyacente. No funciona si el slot tiene tapa (o cinta).'],
        ['System Reset', 'Advanced', 'DV 12', 'Cae Unconscious y Prone durante 60 segundos (20 Rounds) o hasta recibir daño.']
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 4. REBUILT WEAPONS 2077: POWER, TECH & SMART
  // --------------------------------------------------------------------------
  {
    id: 'weapons-2077-rebuilt',
    title: 'Armas Reconstruidas 2077: Power, Tech y Smart (CEMK)',
    subtitle: 'La trinidad balística que transformó la táctica de combate en Night City',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    categoryBadge: 'BALISTICA MODERNA // ERA 2077',
    introDescription:
      'En 2077 las armas convencionales evolucionaron en tres tecnologías balísticas dominantes. Las armas Power dominan la calle con proyectiles cinéticos pesados que rebotan en esquinas; las armas Tech utilizan aceleradores electromagnéticos Gauss para perforar hormigón y coberturas; y las armas Smart disparan micromisiles guiados por giroscopios que persiguen al enemigo tras esquinas sin fallar.',
    howItWorksSteps: [
      'Rebuild: accesorio de 1,000 €$ (Very Expensive) que ocupa 2 ranuras y convierte un arma de fuego en Power, Smart o Tech. Instalarlo lleva 1 hora y solo cabe uno por arma (CEMK p. 30).',
      'Armas Power: +5 al Bonus Damage de cada Herida Crítica. Pueden rebotar el disparo en una cobertura para alcanzar a un objetivo tras cobertura o fuera de línea de visión con -4 al Ataque; con Aimed Shot solo se aplica el penalizador del Aimed Shot (CEMK pp. 30-31).',
      'Armas Tech: sacrificando la Acción de Movimiento se carga el arma (dura hasta disparar o 20 Rounds). El siguiente ataque no explosivo es ROF 1, atraviesa Thin Cover sin dañarla e ignora la mitad del SP del objetivo, redondeando hacia arriba (CEMK p. 31).',
      'Armas Smart: requieren Personal Link (Interface Plug) o Subdermal Grip y no se combinan con Smartgun Link. Dan +1 al Ataque. Con Improved Smart Ammunition ignoran oscuridad, humo y niebla, y si el ataque falla por 5 o menos se repite sumando 14 (más LUCK) en lugar de STAT + Skill (CEMK p. 31).'
    ],
    keyBenefits: [
      'Power: el rebote alcanza objetivos tras cobertura o fuera de línea de visión.',
      'Tech: el disparo cargado atraviesa Thin Cover y corta a la mitad el SP del objetivo.',
      'Smart: +1 al Ataque y segundo intento con Improved Smart Ammunition.'
    ],
    drawbacksAndRisks: [
      'Power: el rebote cuesta -4 al Ataque (o el penalizador del Aimed Shot si se apunta).',
      'Tech: cargar consume la Acción de Movimiento y el disparo cargado es ROF 1.',
      'Smart: sin Personal Link o Subdermal Grip no se puede operar; sin Improved Smart Ammunition solo da el +1.'
    ],
    referenceTable: {
      headers: ['Tecnología', 'Bono Clave', 'Mecánica Especial', 'Requisito'],
      rows: [
        ['Power', '+5 Bonus Damage en Crítico', 'Rebote con -4 (o solo el penalizador de Aimed Shot)', 'Arma a distancia no Exótica'],
        ['Tech', 'Ignora mitad del SP', 'Carga con la Acción de Movimiento; atraviesa Thin Cover', 'No lanzagranadas ni lanzacohetes'],
        ['Smart', '+1 Ataque', 'Segundo intento con 14 si falla por 5 o menos (Improved Smart Ammo)', 'Personal Link o Subdermal Grip']
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 5. CYBERPSYCHOSIS & OVER-CHROMING 2077
  // --------------------------------------------------------------------------
  {
    id: 'cyberpsychosis-stress-2077',
    title: 'Ciberpsicosis, Estrés y Sobrecarga de Cromo 2077 (CEMK)',
    subtitle: 'El precio del metal: inmunobloqueadores, episodios psicóticos y el Sandevistan militar',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    categoryBadge: 'SALUD MENTAL // ERA 2077',
    introDescription:
      'Inspirado directamente en la trágica caída de David Martinez y Maine en Cyberpunk: Edgerunners. En la era 2077, la ciberpsicosis no es un simple número frío: es un estado de disociación progresiva alimentado por el estrés del combate, el duelo, la falta de sueño y la sobrecarga masiva de cromo militar en el sistema nervioso.',
    howItWorksSteps: [
      'Paso 1 (Umbral de Alerta de Empatía): Cuando la EMP del personaje desciende a 2 o menos debido a la instalación de ciberware, entra en la zona de Sobrecarga de Cromo (Over-Chromed).',
      'Paso 2 (Episodios de Estrés en Combate): Cada vez que sufre una Herida Crítica, ve morir a un amigo cercano o activa Speedware militar más de 2 veces en la misma escena, debe superar una tirada de Salvar de Humanidad (1d10 contra su EMP restante).',
      'Paso 3 (Efectos de Episodio Psicótico): Si falla la tirada, sufre alucinaciones sensoriales, temblores espasmódicos (-2 a tiradas) o entra en frenesí berserker durante 1d6 rondas.',
      'Paso 4 (El Rol de los Inmunobloqueadores): Inyectarse una dosis de Inmunobloqueadores estabiliza el sistema neural durante 1 hora y suprime los temblores, pero el uso continuado genera tolerancia y adicción severa (DV 15 Resist).'
    ],
    keyBenefits: [
      'Permite a personajes con gran voluntad empujar su cuerpo más allá de los límites humanos en momentos heroicos.',
      'Los Inmunobloqueadores otorgan un respiro temporal para seguir combatiendo a pesar de la pérdida masiva de Humanidad.'
    ],
    drawbacksAndRisks: [
      'Si la Humanidad llega a 0, el personaje cae en la Ciberpsicosis Terminal: la ficha pasa a control del Director de Juego y MaxTac es alertado de inmediato.',
      'El Sandevistan Experimental Militar exige una tirada de salvación de estrés cada vez que se activa en combates consecutivos.'
    ],
    referenceTable: {
      headers: ['Nivel de Empatía (EMP)', 'Estado Mental del Edgerunner', 'Riesgo Mecánico'],
      rows: [
        ['EMP 5 a 8', 'Estable / Humano', 'Comportamiento empático normal sin penalizadores.'],
        ['EMP 3 a 4', 'Distante / Mecanizado', 'Le cuesta conectar con emociones ajenas (-1 a tiradas sociales).'],
        ['EMP 1 a 2', 'Al Borde del Abismo (Over-Chromed)', 'Temblores nerviosos, alucinaciones y tiradas de estrés obligatorias.'],
        ['EMP 0', 'Ciberpsicosis Terminal', 'Pérdida total del control; objetivo letal de MaxTac.']
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 6. ADVANCED PHARMACOLOGY & HORNET'S PHARMACY
  // --------------------------------------------------------------------------
  {
    id: 'hornets-pharmacy',
    title: 'Farmacología Avanzada, Aditivos y Dispersión Osmótica (Hornet\'s Pharmacy)',
    subtitle: 'Nuevos fármacos callejeros, cócteles de combate y vectores de administración química',
    sourceBook: 'dlc',
    sourceBookTitle: "Hornet's Pharmacy DLC",
    era: 'both',
    categoryBadge: 'QUIMICA Y MEDICINA // DLC',
    introDescription:
      'Hornet, el Fixer y químico legendario de Night City, revolucionó el mercado negro de drogas y medicina de campaña. Este sistema expande el catálogo de fármacos con nuevas sustancias de diseño y permite a los Medtechs crear cócteles farmacológicos personalizados con aditivos osmóticos que se absorben a través de la piel o por niebla en aerosol.',
    howItWorksSteps: [
      'Paso 1 (Catálogo de Nuevos Fármacos): Incorpora drogas de combate avanzadas como Sixgun (+2 REF y DEX en tiroteos rápidos), Berserk (inmunidad temporal a heridas y dolor) y Prime Time (carisma arrollador).',
      'Paso 2 (Vectores de Administración): Los fármacos ya no exigen solo inyección con Airhypo. Pueden aplicarse como parches dérmicos osmóticos, granadas de aerosol químico de 6x6m o aditivos en munición de dardos.',
      'Paso 3 (Compounding de Medtech): Un Medtech con la habilidad Pharmaceuticals puede mezclar un fármaco con aditivos de retraso temporal o aditivos de desintoxicación rápida (Detox Additive).'
    ],
    keyBenefits: [
      'Drogas con efectos tácticos específicos para cada rol de combate.',
      'Posibilidad de dosificar a aliados a distancia mediante dardos o niebla beneficiosa.',
      'Aditivos que reducen el DV de adicción secundaria de las sustancias callejeras.'
    ],
    drawbacksAndRisks: [
      'El riesgo de adicción sigue siendo implacable: fallar la tirada de adicción al terminar el efecto aplica penalizadores severos de abstinencia.',
      'Sustancias incompatibles: Mezclar dos drogas callejeras en el mismo turno puede provocar shock químico (3d6 daño directo a HP).'
    ],
    referenceTable: {
      headers: ['Fármaco / Compuesto', 'Efecto Primario en Combate', 'Duración', 'DV Adicción'],
      rows: [
        ['Sixgun', '+2 REF y +2 DEX en acciones de disparo y esquiva', '10 Minutos', 'DV 16'],
        ['Berserk', '+10 HP temporales e ignora penalizador Seriously Wounded', '10 Minutos', 'DV 15'],
        ['Prime Time', '+2 COOL y +2 en todas las habilidades sociales', '1 Hora', 'DV 13'],
        ['Hover', '+2 INT y velocidad mental para Netrunning e investigación', '1 Hora', 'DV 14'],
        ['Red Glass', 'Euforia extrema y visiones de color (+1 WILL)', '4 Horas', 'DV 13'],
        ['Detox Additive', 'Purga toxinas y drogas activas del torrente sanguíneo', 'Instantáneo', 'No adictivo']
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 7. VEHICLES, SDP & VEHICULAR COMBAT
  // --------------------------------------------------------------------------
  {
    id: 'vehicle-combat-sdp',
    title: 'Vehículos, SDP y Combate Automovilístico (Core & Black Chrome)',
    subtitle: 'Puntos de Daño Estructural, embestidas a alta velocidad y blindaje de carrocería',
    sourceBook: 'black_chrome',
    sourceBookTitle: 'Black Chrome Tech & Style Guide / Core Rulebook',
    era: 'both',
    categoryBadge: 'COMBATE VEHICULAR // NÓMADAS',
    introDescription:
      'En las autopistas y Badlands de Night City, tu vehículo es tu castillo blindado. Los vehículos no tienen Puntos de Golpe biológicos (HP), sino Puntos de Daño Estructural (SDP). Cuando el vehículo sufre daño por armas o colisiones, su blindaje de carrocería (SP) absorbe el impacto; el daño que penetra reduce los SDP hasta que el motor estalla o el vehículo queda inutilizado.',
    howItWorksSteps: [
      'Paso 1 (Puntos de Daño Estructural - SDP): Cada vehículo posee un valor de SDP (de 30 en motos ligeras hasta 70 en aerodinos AV-4). Cuando los SDP llegan a 0, el vehículo queda inoperativo; a -10 explota violentamente.',
      'Paso 2 (Blindaje de Carrocería y Ventanas): Los turismos tienen SP 10 o 15. Disparar a los pasajeros exige superar el SP de las ventanillas o blindaje del habitáculo.',
      'Paso 3 (Embestidas - Ramming): Un conductor puede usar su acción para embestir a otro vehículo o peatón. El daño se calcula multiplicando los d6 según la velocidad del bólido (hasta 8d6 de daño por colisión a velocidad máxima).',
      'Paso 4 (Maniobras Evasivas): Tiradas enfrentadas de Drive Land Vehicle contra la tirada de ataque del perseguidor para esquivar misiles o cerrar el paso.'
    ],
    keyBenefits: [
      'Los vehículos ofrecen cobertura total con SP 10 a 20 para todos los ocupantes.',
      'Permite montar armamento pesado militar (ametralladoras pesadas, lanzagranadas) en el techo.',
      'Velocidad de escape inigualable para salir de zonas calientes antes de que llegue MaxTac.'
    ],
    drawbacksAndRisks: [
      'Las reparaciones de SDP son caras y requieren taller Tech especializado con piezas de repuesto.',
      'Si un neumático o alerón es destruido (disparo apuntado a rueda), el DV de conducción se incrementa en +4.'
    ],
    referenceTable: {
      headers: ['Vehículo Oficial', 'Tipo', 'SDP', 'SP Carrocería', 'Plazas', 'Coste (€$)'],
      rows: [
        ['Yaiba Kusanagi CT-3X', 'Superbike de Carreras', '30 SDP', 'SP 5 (Sin techo)', '1-2', '20,000 €$'],
        ['Makigai MaiMai', 'Coche Compacto Urbano', '35 SDP', 'SP 10', '2', '10,000 €$'],
        ['Quadra Turbo-R V-Tech', 'Deportivo Clásico Muscle', '50 SDP', 'SP 12', '2', '40,000 €$'],
        ['Nomad Armored Truck', 'Camioneta de Combate Clan', '60 SDP', 'SP 15', '4-6', '35,000 €$'],
        ['Militech Gorgon Van', 'Furgoneta Blindada SWAT', '65 SDP', 'SP 18', '8', '50,000 €$'],
        ['Zetatech AeroVox AV-4', 'Aerodino Táctico Aéreo', '70 SDP', 'SP 15', '6', '100,000 €$']
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 8. HARDENED ENEMIES & TACTICAL THREAT TIERS
  // --------------------------------------------------------------------------
  {
    id: 'hardened-enemies',
    title: 'Enemigos Endurecidos y Niveles de Amenaza (Hardened Enemies DLC)',
    subtitle: 'Cómo escalar el desafío para mesas de juego veteranas con pools de Suerte y blindajes pesados',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: 'both',
    categoryBadge: 'DISEÑO DE ENCUENTROS // GM CONSOLE',
    introDescription:
      'Cuando los jugadores adquieren mejor ciberware, armas excelentes y armaduras SP 11+, los guardias y pandilleros comunes del Core Book dejan de ser una amenaza creíble. El sistema de Enemigos Endurecidos (Hardened Enemies) proporciona plantillas tácticas balanceadas con bases de combate de 13 a 17, armaduras Heavy Armorjack, pools de Suerte propios e implantes de reflejos para mantener la tensión letal en la mesa.',
    howItWorksSteps: [
      'Paso 1 (Diagnóstico de Amenaza): Si los personajes de la mesa tienen REF 8 y esquivan balas, o portan armas que infligen 5d6+, el GM debe sustituir a los Mooks básicos por sus variantes Hardened.',
      'Paso 2 (Mejoras Tácticas de los Hardened): Los enemigos Hardened disponen de blindajes de SP 11 a 15, bases de ataque superiores (+13 o +15) y cargadores con munición especial (Perforante o Expansiva).',
      'Paso 3 (Pools de Suerte de Enemigo): A diferencia de los esbirros comunes, los tenientes y mini-jefes Hardened tienen entre 1 y 4 puntos de Suerte que el GM puede gastar para forzar impactos o resistir tiradas de muerte.',
      'Paso 4 (Tácticas de Escuadra): Los Hardened aprovechan coberturas, usan Fuego de Supresión y granadas Flashbang para desorganizar al grupo antes de asaltar.'
    ],
    keyBenefits: [
      'Garantiza que los combates sigan siendo emocionantes, letales y tácticamente profundos.',
      'Evita que los jugadores con personajes optimizados arrasen los encuentros sin esfuerzo.',
      'Permite al GM modular la dificultad escena por escena con precisión militar.'
    ],
    drawbacksAndRisks: [
      'Alto riesgo de muerte para personajes heridos o que no utilicen coberturas correctamente.',
      'Exige mayor atención del GM al gestionar los puntos de suerte y la munición especial de los enemigos.'
    ],
    referenceTable: {
      headers: ['Nivel de Amenaza', 'HP Promedio', 'SP Típico', 'Bases de Ataque', 'Pool Suerte'],
      rows: [
        ['Mook Básico (Core)', '20 - 30 HP', 'SP 4 - 7', 'Base 9 - 11', '0 Suerte'],
        ['Hardened Mook (DLC)', '35 - 45 HP', 'SP 11 - 13', 'Base 13 - 14', '1 Suerte'],
        ['Hardened Lieutenant', '45 - 55 HP', 'SP 13 - 15', 'Base 14 - 16', '2 - 3 Suerte'],
        ['Mini-Boss / Cyberpsycho', '55 - 75 HP', 'SP 13 - 15', 'Base 15 - 17', '3 - 4 Suerte'],
        ['Boss Legendario (Smasher)', '85 - 100+ HP', 'SP 18 - 20', 'Base 17 - 19', '5+ Suerte']
      ]
    }
  }
];
