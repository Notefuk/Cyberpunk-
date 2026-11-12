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
      'Biografías de la tripulación del anime (Handbook pp. 35-41); el libro no trae fichas de juego de ellos.'
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
      'Hornet\'s Pharmacy: Nuevas drogas de combate (Berserker, Prime Time, Sixgun, Timewarp).',
      'Enemigos Hardened con estadísticas potenciadas para grupos de jugadores veteranos.',
      'Armas navideñas Gunmas: Arasaka WAA Bullpup y Kendachi Dragon Flamethrower.',
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
    title: 'Hornet\'s Pharmacy: A Chemical Wonderland (drogas, aditivos y equipo)',
    subtitle: 'Cuatro drogas callejeras, tres aditivos para venenos, dos fármacos de Medtech, un dron asesino y dos implantes',
    sourceBook: 'dlc',
    sourceBookTitle: "Hornet's Pharmacy DLC",
    era: 'both',
    categoryBadge: 'QUIMICA Y MEDICINA // DLC',
    introDescription:
      'Suplemento oficial de R. Talsorian Games (v1.11) con 4 drogas callejeras (Berserker, Prime Time, Sixgun y Timewarp), 3 compuestos aditivos para venenos y biotoxinas (Delaying, Distilling y Osmosis), 2 fármacos de Medtech (Sedative y Veritas), el dron asesino Suzumebachi y 2 implantes (Bodyweight AutoInjector y Pursuit Security Inc. Gas Jet).',
    howItWorksSteps: [
      'Paso 1 (Drogas, p.2-3): Berserker, Prime Time, Sixgun y Timewarp tienen Efecto Primario y Efecto Secundario (DV17) que incluye la adicción.',
      'Paso 2 (Aditivos, p.4): Delaying, Distilling y Osmosis Compound se mezclan como Acción con un Vial de Veneno o Biotoxina; ninguno se acumula.',
      'Paso 3 (Fármacos, p.4): Sedative y Veritas son dosis de Medtech con las reglas de los fármacos del Core; el libro no imprime su costo.',
      'Paso 4 (Equipo, p.5): dron Suzumebachi (5.000 €$, Luxury), Bodyweight AutoInjector (100 €$) y Pursuit Security Inc. Gas Jet (500 €$).'
    ],
    keyBenefits: [
      'Berserker: sin daño adicional por Lesión Crítica y penalizadores de heridas y de Facedown reducidos a la mitad.',
      'Timewarp: +3 a cualquier tirada de Iniciativa durante 1 minuto.',
      'Sixgun: +2 Speed en la NET y una Acción NET adicional por turno a cambio de 1 Humanity Loss.'
    ],
    drawbacksAndRisks: [
      'Las cuatro drogas son adictivas (DV17): Berserker cuesta 2 de Humanity Loss y +1 permanente a la Base Death Save Penalty; Prime Time resta 4d6 de Humanity Loss mientras dura el efecto.',
      'Sixgun baja MOVE y REF en 2; Prime Time reprime las emociones del usuario.'
    ],
    referenceTable: {
      headers: ['Fármaco / Compuesto', 'Efecto Primario en Combate', 'Duración', 'DV Adicción'],
      rows: [
        ['Berserker', 'Sin daño adicional por Lesión Crítica; penalizadores de heridas y Facedown a la mitad', '10 Minutos', 'DV 17'],
        ['Prime Time', 'COOL y WILL +2; 4d6 Humanity Loss devueltos al terminar', '4 Horas', 'DV 17'],
        ['Sixgun', 'MOVE y REF -2; +2 Speed en la NET y una Acción NET extra por 1 Humanity Loss', '4 Horas', 'DV 17'],
        ['Timewarp', '+3 a Iniciativa', '1 Minuto', 'DV 17'],
        ['Delaying Compound', 'Retrasa 1 minuto o 1 hora los efectos de un veneno o biotoxina', '—', '—'],
        ['Distilling Compound', 'El DV de Resist Torture/Drugs del veneno o biotoxina sube 2', '—', '—'],
        ['Osmosis Compound', 'El veneno o biotoxina entra por la piel desde una superficie', '1 Hora (en superficie)', '—'],
        ['Sedative', 'Inconsciente 4 horas si es voluntario; DV15 Resist Torture/Drugs si no lo es', '4 Horas', '—'],
        ['Veritas', 'DV17 Resist Torture/Drugs o -5 a Acting, Concentration, Conversation, Deduction, Human Perception y Persuasion', '10 Minutos', '—']
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 7. VEHICLES, SDP & VEHICULAR COMBAT
  // --------------------------------------------------------------------------
  {
    // [Claude Code · 2026-11-06] v5.13.0 (plan 26): reescrita con datos del libro; la versión anterior tenía vehículos inventados.
    id: 'vehicle-combat-sdp',
    title: 'Vehículos de Black Chrome y Nomad Access',
    subtitle: 'Vehículos del Core con mejoras de serie, y cómo los suma el Nomad a su Family Motorpool',
    sourceBook: 'black_chrome',
    sourceBookTitle: 'Black Chrome Tech & Style Guide / Core Rulebook',
    era: 'both',
    categoryBadge: 'VEHÍCULOS // NÓMADAS',
    introDescription:
      'Black Chrome (pp.58-84) trae 31 vehículos: 8 aéreos y 23 terrestres. Cada uno es un vehículo genérico del Core (Core pp.189-191) con mejoras del Core ya instaladas (Core pp.163-165). Por ejemplo, el Dayton TDT 004 es un Helicopter con Heavy Chassis y dos Seating Upgrade. La tabla de BC pp.162-164 resume SDP, plazas, velocidad, costo y Nomad Access.',
    howItWorksSteps: [
      'Nomad Access (BC p.9): cuando el Nomad sube Moto y suma un vehículo de serie a su Family Motorpool (Core p.162), puede tomar uno con Nomad Access igual o menor a su Rango de Moto.',
      'El vehículo llega con todas sus mejoras de serie, que no cuestan rangos de Moto. Salvo que se diga otra cosa, se le pueden agregar mejoras normalmente cuando Moto vuelve a subir (BC p.9).',
      'Ejemplo del libro: con Moto 5, un Nomad puede tomar The Grundy (Nomad Access 4), que trae Armored Chassis, Heavy Chassis y Combat Plow. Al subir a Moto 6 puede sumarle un Vehicle Heavy Weapon Mount (Core p.164).',
      'Armored Chassis blinda el vehículo a SP13 y Heavy Chassis suma +20 SDP (Core p.163); el SDP de la tabla de Black Chrome ya lo incluye.',
      'Algunos son incompatibles con ciertas mejoras (por ejemplo, el SH-45 Patroller no admite Seating Upgrade). El Tanson JetBoy no tiene Nomad Access y se maniobra con Athletics.'
    ],
    keyBenefits: [
      'Comprar uno en el garaje (NET, ROLES & VEHÍCULOS) descuenta su costo y lo agrega con sus mejoras.',
      'Un Nomad con Moto suficiente lo toma gratis del Family Motorpool.',
      'Cada vehículo dice en qué puesto de Night Market se consigue.'
    ],
    drawbacksAndRisks: [
      'Todos cuestan Super Luxury (15,000eb o más), salvo el JetBoy (1,000eb, Very Expensive).'
    ],
    referenceTable: {
      headers: ['Vehículo', 'Tipo base', 'Nomad Access', 'SDP', 'Plazas', 'Costo', 'Página'],
      rows: [
        ['Tanson Bellhop', 'Gyrocopter', '1', '35', '1', '16,000eb', 'BC p.60'],
        ['AmeriCar EconoCompact', 'Compact Groundcar', '1', '50', '3', '20,000eb', 'BC p.64'],
        ['The Grundy', 'Compact Groundcar', '4', '70', '4', '41,000eb', 'BC p.68'],
        ['Militech Gorgon Security Van', 'Compact Groundcar', '4', '50', '6', '37,000eb', 'BC p.73'],
        ['Dayton TDT 004', 'Helicopter', '7', '80', '8', '43,000eb', 'BC p.59'],
        ['Zetatech AeroVox', 'AV4', '8', '120', '6', '51,000eb', 'BC p.61'],
        ['Street King Combat Vehicle', 'High Performance Groundcar', '10', '70', '6', '63,000eb', 'BC p.77']
      ]
    }
  },

  {
    // [Claude Code · 2026-11-06] v5.14.0 (plan 26): Economics 101 de Black Chrome (pp.125-130).
    id: 'bc-economics-101',
    title: 'Economics 101: conseguir cosas con un Fixer',
    subtitle: 'Find a Fixer/Tech, cómo trabaja el Fixer, Night Markets y estilos de vida en detalle',
    sourceBook: 'black_chrome',
    sourceBookTitle: 'Black Chrome Tech & Style Guide',
    era: '2045',
    categoryBadge: 'ECONOMÍA // FIXERS',
    introDescription:
      'En el Time of the Red no alcanza con tener plata: para comprar algo caro hace falta alguien con acceso, casi siempre un Fixer (BC p.126). Black Chrome explica cómo se consigue, se trae y se cobra un ítem, y da una tabla con el DV para encontrar a un Fixer o Tech según el costo del ítem (BC p.129).',
    howItWorksSteps: [
      'Find a Fixer/Tech (BC p.129): si nadie del grupo conoce a un Fixer que lo consiga, se tira Streetwise contra el DV de la tabla según el costo del ítem. Es una guía: el GM decide si el ítem es fácil de conseguir, un punto de trama o una misión propia.',
      'Si el grupo ya conoce a un Fixer (Lifepath, misiones anteriores), sirve; el GM decide si tiene tiempo y acceso (BC pp.126, 129).',
      'Precio (BC p.126): el Fixer usa Operator, COOL + Trading + Rango de Operator + 1d10, contra COOL + Trading + 1d10 del cliente. Si gana, cobra con Haggle (Core p.159), +10%, más una tarifa. Se paga por adelantado y la entrega tarda alrededor de un mes.',
      'Cómo lo consigue (BC pp.126-127): llama a su red, negocia con otro dueño o Fixer, soborna o contrata un equipo, y reserva carga en un transporte Nomad (Aldecaldos, Jodes, Thelas).',
      'Un Tech también puede fabricarlo con Maker; comprarle directo al Tech te da la relación con él en vez del Fixer (BC p.128).',
      'Night Markets (BC p.7 y pp.131-156): el GM arma el mercado con la tabla del Core p.338 y le suma los ítems de Black Chrome según el puesto (letra = mercado, número = puesto). Generador en FIXER DECK.'
    ],
    keyBenefits: [
      'Da una tirada concreta (Streetwise) para que los personajes que no son Fixers consigan cosas caras.',
      'Cada ítem de Black Chrome dice en qué puesto de qué Night Market se consigue.'
    ],
    drawbacksAndRisks: [
      'Sin un contacto, un personaje que no es Fixer solo accede a ítems de 100eb o menos (ejemplo de BC p.126).',
      'Se paga por adelantado y la entrega tarda: el Fixer puede no tener tiempo o pedir un favor.'
    ],
    referenceTable: {
      headers: ['Costo del ítem', 'DV de Streetwise (BC p.129)'],
      rows: [
        ['500eb (Expensive)', 'DV15'],
        ['1,000eb (Very Expensive)', 'DV17'],
        ['5,000eb (Luxury)', 'DV21'],
        ['10,000eb+ (Super Luxury)', 'DV24']
      ]
    }
  },
  {
    id: 'bc-lifestyles-in-detail',
    title: 'Lifestyles in Detail (Black Chrome)',
    subtitle: 'Qué cubre por mes cada estilo de vida: comida, comunicaciones, entretenimiento y transporte',
    sourceBook: 'black_chrome',
    sourceBookTitle: 'Black Chrome Tech & Style Guide',
    era: '2045',
    categoryBadge: 'ECONOMÍA // ESTILO DE VIDA',
    introDescription:
      'El costo mensual de cada estilo de vida (Core p.377) cubre comida, comunicaciones, entretenimiento y transporte. Lo que gastes por encima sale de tu bolsillo (BC p.130).',
    howItWorksSteps: [
      'Kibble (100eb/mes): dos comidas de Kibble por día, cuenta de Agent, un entretenimiento de 20eb por mes, pase de transporte y un taxi por mes entre zonas seguras.',
      'Generic Prepak (300eb/mes): Kibble y Generic Prepak, un mensaje a otra ciudad por semana, entretenimiento de 20eb semanal y un taxi semanal entre zonas seguras.',
      'Good Prepak (600eb/mes): Generic y Good Prepak, mensajes diarios y una llamada semanal, entretenimiento diario y uno de 100eb por mes, taxi diario y un Compact Groundcar alquilado 24 horas por mes.',
      'Fresh Food (1,500eb/mes): Good Prepak y comida fresca, mensajes ilimitados y llamadas diarias, entretenimiento diario, semanal y mensual de 500eb, taxi diario a cualquier zona y un Compact Groundcar 24 horas por semana.',
      'Si dañás un vehículo alquilado, puede que no te alquilen más (BC p.130).'
    ],
    keyBenefits: ['El detalle también aparece en el creador de personajes, al elegir el estilo de vida.'],
    drawbacksAndRisks: ['Lo que exceda lo cubierto se paga aparte.'],
    referenceTable: {
      headers: ['Estilo de vida', 'Costo (BC p.130)'],
      rows: [
        ['Kibble', '100eb/mes'],
        ['Generic Prepak', '300eb/mes'],
        ['Good Prepak', '600eb/mes'],
        ['Fresh Food', '1,500eb/mes']
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 8. HARDENED ENEMIES & TACTICAL THREAT TIERS
  // --------------------------------------------------------------------------
  {
    id: 'hardened-enemies',
    title: 'Enemigos Endurecidos y Niveles de Amenaza (Hardened Enemies DLC)',
    subtitle: 'Mooks, Lieutenants y Mini Bosses para una Crew optimizada para el combate',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: 'both',
    categoryBadge: 'DISEÑO DE ENCUENTROS // GM CONSOLE',
    introDescription:
      'Hardened quiere decir "optimizado para combate". Son versiones de los Mooks, Lieutenants y Mini Bosses del Core pensadas para una Crew de personajes optimizados para el combate: los desafían sin cambiar la economía del juego ni sumar más enemigos al encuentro (Hardened Lieutenants p.2). Las 16 fichas están en el bestiario.',
    howItWorksSteps: [
      'Paso 1 (¿La Crew es Hardened?): un PJ es Hardened si cumple alguno de estos criterios: REF 8 con Evasion 6 o más; atacar con Stat + Skill + Mod de 15 o más; WILL + BODY de 16 o más; un arma de valor Luxury o más; DEX 8 con MOVE 8; Autofire o Martial Arts 6 o más; Solo de rango 4 o más. La Crew es Hardened solo si todos sus PJ lo son (Hardened Lieutenants p.2).',
      'Paso 2 (Hardened Mooks): reemplazan a los Mooks del Core a razón de 1 por Edgerunner. Contra una Crew con PJ que no son de combate, usalos de a poco, mezclados con Mooks comunes (Hardened Mooks p.2).',
      'Paso 3 (Hardened Lieutenants): reemplazan a los Lieutenants del Core (CP:R p.414) a razón de 1 cada 2 Edgerunners, y solo contra una Crew Hardened (Hardened Lieutenants p.2).',
      'Paso 4 (Hardened Mini Bosses): reemplazan a los Mini Bosses del Core (CP:R p.414) a razón de 1 cada 3 Edgerunners. Son más letales: no encadenes varios en un mismo trabajo (Hardened Mini Bosses p.2).',
      'Paso 5 (Más picante): cada DLC trae una tabla 1d10 para complicar el encuentro (Mook Encounter Complication) o ascender al Mini Boss (Mini Promotion).'
    ],
    keyBenefits: [
      'Desafían a una Crew optimizada sin sumar enemigos ni cambiar la economía: el botín es parecido al de los PNJ del Core (Hardened Mooks p.2).',
      'Las mismas fichas también están en Interface RED Vol. 2 (Mooks y Lieutenants) y Vol. 3 (Mini Bosses).'
    ],
    drawbacksAndRisks: [
      'Contra una Crew que no es Hardened, el material Hardened probablemente mate a los PJ que no lo son (Hardened Lieutenants p.2).',
      'Varios Mini Bosses Hardened seguidos en un mismo trabajo terminan en funeral (Hardened Mini Bosses p.2).'
    ],
    referenceTable: {
      headers: ['Nivel', 'Cuántos', 'HP', 'SP (cuerpo)', 'Base de su mejor arma', 'Fuente'],
      rows: [
        ['Hardened Mook (4 fichas)', '1 por Edgerunner', '25 - 40', '4 - 11', '12 - 13', 'Hardened Mooks pp.2-4'],
        ['Hardened Lieutenant (6 fichas)', '1 cada 2 Edgerunners', '40', '11 - 13', '12 - 14', 'Hardened Lieutenants pp.4-6'],
        ['Hardened Mini Boss (6 fichas)', '1 cada 3 Edgerunners', '45 - 60', '11', '16', 'Hardened Mini Bosses pp.3-5']
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 9. OLD GUNS NEVER DIE (Interface RED Vol. 1 pp.3-4) [Claude Code · 2026-11-10] v5.16.0
  // --------------------------------------------------------------------------
  {
    id: 'old-guns-never-die',
    title: 'Old Guns Never Die: armas de Cyberpunk 2020 en RED',
    subtitle: 'Cómo pasar un arma de 2020 a las reglas de RED en 6 pasos',
    sourceBook: 'interface_red',
    sourceBookTitle: 'Interface RED Volume 1',
    era: '2045',
    categoryBadge: 'CONVERSIÓN // ARMAS',
    introDescription:
      'Para usar en RED un arma de Cyberpunk 2020 (Interface RED Vol. 1 pp.3-4). El arma toma el tipo de RED más parecido y sus números salen de ahí; la precisión y la confiabilidad de 2020 se convierten en calidad.',
    howItWorksSteps: [
      'Paso 0: si no dispara balas, cartuchos, explosivos ni flechas, o tiene reglas propias, es un arma Exótica. Se busca una parecida en RED o se acuerda con el GM.',
      'Paso 1: se elige el tipo de arma de RED más parecido. De ahí salen el daño, el Autofire, el cargador, la munición, el ROF, las manos, el costo y si se puede ocultar.',
      'Paso 2: la precisión (WA) se simplifica. WA -1 o menos pasa a 0, y WA +1 o más pasa a +1 (calidad Excelente).',
      'Paso 3: si en 2020 era poco confiable (UR), en RED tiene Poor Reliability: con un fallo crítico se encasquilla y desatascarla cuesta una Acción.',
      'Paso 4: la calidad se define así. Poor es Poor Reliability con WA 0; Standard es WA 0 sin Poor Reliability; Excellent es WA +1, aunque tenga Poor Reliability. Se vende como la calidad más alta que cumpla.',
      'Paso 5: los accesorios de 2020 se cambian por los de RED. Si el cargador de 2020 era más grande que el estándar, se le pone Extended o Drum Magazine. Hay 3 ranuras; si necesita más, es Exótica. El Extended Magazine puede hacer que deje de ser ocultable.',
      'Paso 6: el GM fija el costo final.'
    ],
    keyBenefits: [
      'Ejemplo del libro: el Stolbovoy St-5 (5d6, 30 tiros, WA -1, 1.800eb en 2020) queda como Assault Rifle de RED con 5d6, ROF 1, cargador de 25, no ocultable y 500eb.',
      'Su WA -1 pasa a 0 (calidad Standard). Con Smartgun Link (+500eb, 2 ranuras) y Extended Magazine (1 ranura, cargador de 35), el costo queda en 1.100eb.'
    ],
    drawbacksAndRisks: [
      'Los números de 2020 no pasan tal cual: manda el tipo de arma de RED.',
      'Un arma con más de 3 accesorios, o con reglas propias, pasa a ser Exótica y la decide el GM.'
    ]
  },

  // --------------------------------------------------------------------------
  // 10. SPINNING YOUR WHEELS (DLC pp.3-7; también en Interface RED Vol. 3) [Claude Code · 2026-11-11] v5.17.0
  // --------------------------------------------------------------------------
  {
    id: 'spinning-your-wheels',
    title: 'Spinning Your Wheels: bicis, patines y skates',
    subtitle: "La bici de Yang's Wheels como vehículo, sus 14 mejoras y los trucos",
    sourceBook: 'dlc',
    sourceBookTitle: 'Spinning Your Wheels',
    era: '2045',
    categoryBadge: 'VEHÍCULOS // MOVILIDAD',
    introDescription:
      'La bici es un vehículo (Core p.191) con SDP 15, un asiento y 100eb (Premium); su velocidad depende del BODY del ciclista (p.3). Está en el Compendium y se puede agregar al garaje. Los patines y el skate son equipo (p.5).',
    howItWorksSteps: [
      'Velocidad según BODY: menos de 4, 8 MOVE y 12 MPH; de 4 a 7, 10 MOVE y 20 MPH; 8 o más, 15 MOVE y 30 MPH. Con BODY 11 o más hace falta Reinforced Frame.',
      'Se maneja con Athletics en vez de Drive Land Vehicle y se repara con Basic Tech. No se controla con Interface Plugs. Usás tu Iniciativa: no pasás al principio de la cola.',
      'No se consigue ni se mejora con Moto, la habilidad de rol del Nomad.',
      'Choque o embestida: 3d6 a la bici y al blanco, en vez de 6d6. El ciclista sufre Whiplash y sale despedido (Prone, Core p.169). Quien esquiva la embestida no puede caer encima de la bici.',
      'A criterio del GM, hacer otra cosa mientras pedaleás (como disparar) puede ser Complex Task: -2 (Core p.130).',
      'Cansancio (p.4): al final de un viaje largo, Endurance contra DV13 (1 hora), DV15 (3), DV17 (5) o DV21 (6 o más). Si falla, queda cansado el resto del día, como si hubiera dormido mal (Core p.130).',
      'Mejoras (pp.4-5): una de cada tipo por bici. Están en la tabla de abajo.',
      'Trucos (p.6), con Athletics: Swerve, Sharp Turn y Emergency Stop DV13; Bootleg Turn y Do a Jump DV17. Trucos de bici, patines y skate: Simple DV13, Advanced DV15 y Pro DV17.'
    ],
    keyBenefits: [
      'Bici con Electric Pedal Assist y Enclosure: un auto chiquito para uno por 300eb (p.7).',
      'Patines (50eb) y skate (50eb): +4 m/yds con la Acción Run; el skate, solo en suelo plano o en bajada (p.5).'
    ],
    drawbacksAndRisks: [
      'Es más fácil de robar, cansa y lleva menos gente y carga que un auto (p.3).',
      'Con patines puestos no podés usar las opciones de las piernas; ponerlos o sacarlos cuesta una Acción (p.5).'
    ],
    referenceTable: {
      headers: ['Mejora', 'Efecto', 'Costo'],
      rows: [
        ['Bottle Dynamo', 'Carga una batería (como la de un Microwaver) con una hora de pedaleo.', '20eb (Everyday)'],
        ['Bulletproof Glass', 'Thin Cover de 7 HP (Core p.182). Requiere Enclosure.', '50eb (Costly)'],
        ['Cycle Armor', 'SP 7, también en las paredes del Enclosure. Requiere Reinforced Frame.', '100eb (Premium)'],
        ['Electric Pedal Assist', 'Sube la velocidad narrativa al siguiente tramo de BODY (o +5 MPH en el más alto) y +4 a Endurance contra el cansancio.', '100eb (Premium)'],
        ['Enclosure', 'Pasa a triciclo cerrado con fibra de vidrio y plástico. Incompatible con Folding Frame.', '100eb (Premium)'],
        ['Extended Seat', 'Lleva un pasajero atrás (2 asientos).', '20eb (Everyday)'],
        ['Folding Frame', 'Se pliega al tamaño de un maletín grande. Incompatible con Enclosure, Reinforced Frame y Smuggling Compartment.', '100eb (Premium)'],
        ['Gun Mount', 'Soporte en el manubrio para Assault Rifle, Heavy SMG o Shotgun: dispara solo hacia adelante, sin mano libre; no se recarga en movimiento; montar o sacar el arma es una Acción.', '100eb (Premium)'],
        ['Neon Lighting', 'Cuenta como un Light Tattoo para el +2 de Wardrobe & Style cerca de la bici.', '20eb (Everyday)'],
        ['Reinforced Frame', '+5 SDP y permite BODY 11 o más. Incompatible con Folding Frame.', '100eb (Premium)'],
        ['Security System', 'Electrificada desde el Agent: quien la agarre tira Resist Torture/Drugs DV13 o la suelta. Nano-VIN: Yang\'s Wheels te la devuelve si alguien intenta vendérsela.', '500eb (Expensive)'],
        ['Smuggling Compartment', 'Hueco de 2,5 x 15 cm en el cuadro; encontrarlo es Conceal/Reveal Object DV17. Incompatible con Folding Frame.', '50eb (Costly)'],
        ['Stunt Frame', '+2 a Athletics para maniobras en la bici.', '100eb (Premium)'],
        ['Trailer', 'Remolque de 1,5 x 0,46 m; engancharlo o soltarlo es una Acción.', '50eb (Costly)']
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 11. CYBERCHAIRS (Interface RED Vol. 1 p.38; DLC pp.2-3) [Claude Code · 2026-11-11] v5.17.0
  // --------------------------------------------------------------------------
  {
    id: 'cyberchairs',
    title: 'Cyberchairs: sillas de Rocklin Augmentics',
    subtitle: 'Mercurius y Spider: MOVE 5, todo movimiento y resistentes al EMP',
    sourceBook: 'interface_red',
    sourceBookTitle: 'Interface RED Volume 1',
    era: '2045',
    categoryBadge: 'MOVILIDAD // EQUIPO',
    introDescription:
      'Sillas de ruedas de Rocklin Augmentics, pensadas para la calle y para el combate (Interface RED Vol. 1 p.38). Están en la tienda como equipo: la Mercurius (100eb, Premium) y la Spider (1.000eb, Very Expensive).',
    howItWorksSteps: [
      'Se maneja con un Interface Plug, sin manos, o con una mano en el apoyabrazos, que no puede hacer otra cosa.',
      'Mientras la manejás, tu MOVE pasa a 5 (menos la penalización de armadura) y tenés todas las opciones de movimiento: Run, Jump, Climb, Swim, Get Up.',
      'Los ataques a la silla van a quien la maneja. Nadie te puede sacar de la silla mientras estés consciente.',
      'Una Lesión Crítica que baje tu MOVE baja el de la silla. Quick Fix y Treatment se hacen sobre la silla, con las reglas de Lesiones Críticas y Cybertech (Core p.223).',
      'Ni el EMP (como el pulso de un Microwaver) ni los efectos de Programas que no son Black ICE la inutilizan.'
    ],
    keyBenefits: [
      'Mercurius: el modelo deportivo, el mismo del equipo de Murderball Night City Nuke. Sube escaleras sin penalización.',
      'Spider: cuatro patas hidráulicas y 4 Option Slots para opciones de Cyberarm, Cyberleg o Cyberlimb. Cuentan como pareadas y cuestan lo mismo que en un Cyberlimb.'
    ],
    drawbacksAndRisks: [
      'La Mercurius no admite opciones de ciberware.',
      'Si la manejás con la mano, esa mano queda ocupada.'
    ]
  },

  // --------------------------------------------------------------------------
  // 12. STICKBALL (Interface RED Vol. 4 pp.32-35; DLC pp.2-5) [Claude Code · 2026-11-11] v5.19.0
  // --------------------------------------------------------------------------
  {
    id: 'stickball',
    title: 'Stickball: el deporte de combate de las bandas',
    subtitle: 'Dos equipos de tres, palos con electroimán y tres bolas electrificadas',
    sourceBook: 'interface_red',
    sourceBookTitle: 'Interface RED Volume 4',
    era: '2045',
    categoryBadge: 'DEPORTE // COMBATE NO LETAL',
    introDescription:
      'El deporte callejero con el que las bandas de Night City arreglan sus problemas sin tiroteo (Interface RED Vol. 4 pp.32-35). Se juega como un combate, con Iniciativa, y el equipo (Stickball Stick y munición de goma) está en la tienda.',
    howItWorksSteps: [
      'La cancha (p.32): un tercero pinta con glow paint tres círculos (uno por equipo y uno neutral) con una bola en cada uno, y seis X de salida. Los obstáculos del lugar se quedan.',
      'Reglas (p.32): 3 por equipo, sin cambios. Prohibido: vehículos a motor, munición de goma no sancionada y todo lo que cause Lesiones Críticas o baje a alguien de 1 HP. No hay tiempo: se juega con Iniciativa hasta que un equipo tiene las tres bolas en su círculo. Se pueden sacar bolas del círculo rival.',
      'Pick Up (p.33): reemplaza medio ataque de ROF 2; levantás una bola a 2 m o menos con el palo o la mano. Con la mano: 3d6 directo a los HP, nunca por debajo de 1 (quedás Unconscious), también si empezás tu Turno con la bola en la mano.',
      'Guarding (p.33): reemplaza medio ataque de ROF 2, con el palo. Athletics enfrentado contra alguien a 2 m o menos; si ganás, lo seguís hasta 2x tu MOVE. -2 a sus pases, a los pases que le hagan y a sus robos.',
      'Passing/Shooting (p.33): reemplaza medio ataque de ROF 2. Athletics contra el DV de la tabla de abajo; a mano, hasta 24 m. Si fallás, el GM deja la bola en el suelo dentro de esa distancia.',
      'Stealing (p.33): una Acción con el palo en la mano. Ataque de ROF 1 a 2 m o menos con cualquier arma y su skill, contra Athletics del que tiene la bola. Con Grab (Core p.177), además le hacés 3d6 a los HP.',
      'Desafío (pp.33-34): después de un Facedown (Core p.194), el que gana o el que pierde puede pedir un partido en vez de Backing Down. No ir o negarse: -1 de Reputation al equipo. El ganador puede pedir un partido "escalado" con una condición extra (tabla 1d10 del libro): negarse cuesta -2 de Reputation a cada integrante.'
    ],
    keyBenefits: [
      'Permitido siempre: Inline Skates, Skateboards y ciberware no letal (sobre todo Skate Feet). Se usa armadura salvo que se prohíba (p.34).',
      'Armas populares: Microwaver, Acid Paintballs, Heavy Pistols con Stickball Sanctioned Rubber Ammunition, Smoke Grenades, Stun Batons y Stun Guns (p.34).',
      'El Stickball Stick hace 1d6 más por cada bola cargada que lleve, hasta 3d6 (p.34).'
    ],
    drawbacksAndRisks: [
      'Agarrar la bola con la mano duele: 3d6 a los HP.',
      'Afuera no se interviene, salvo para sacar heridos; el partido no se detiene (p.32).',
      'Tabla de pases: el texto del libro da DV 16 para 0-6 m y DV 15 para 7-12 m; así queda.'
    ],
    referenceTable: {
      headers: ['Distancia (m/yds)', '0-6', '7-12', '13-25', '26-50', '51-100', '101-200', '201-400'],
      rows: [['DV de Athletics', '16', '15', '15', '17', '20', '22', '25']]
    }
  }
];
