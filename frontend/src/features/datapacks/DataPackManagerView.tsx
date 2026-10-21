import React, { useState, useMemo } from 'react';
import coreData from '../../data/core-rules.cprpack.json';
import { EXPANSION_RULE_SYSTEMS } from '../../data/expansionRulesData';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';
import { 
  FolderArchive, 
  CheckCircle2, 
  Download, 
  Cpu,
  Crosshair,
  Terminal,
  Pill,
  Wrench,
  Package,
  Skull,
  Layers,
  BookOpen,
  ArrowRight,
  Train,
  Swords,
  Sparkles,
  Zap
} from 'lucide-react';

export type TabKey = 'combat' | 'sheet' | 'cyberware' | 'netroles' | 'compendium' | 'packs' | 'gm' | 'oneshot' | 'creator' | 'docs';

interface DataPackManagerViewProps {
  onNavigateTab?: (tab: TabKey) => void;
}

export interface OfficialModuleData {
  id: string;
  title: string;
  shortBadge: string;
  era: '2045' | '2077' | 'both';
  version: string;
  sourcePdf: string;
  accentColor: string;
  icon: React.ReactNode;
  whatItBringsSummary: string;
  keyHighlights: string[];
  mechanicsIntroduced: string[];
  specificNavigation: {
    label: string;
    targetTab: TabKey;
    icon: React.ReactNode;
    color: string;
  };
}

// Catálogo oficial canónico de los 13 Módulos / Libros y Suplementos
const OFFICIAL_13_MODULES: OfficialModuleData[] = [
  {
    id: 'core',
    title: 'Cyberpunk RED Core Rulebook',
    shortBadge: '2045 CORE',
    era: '2045',
    version: 'v1.24',
    sourcePdf: 'Cyberpunk-RED-Core-Rulebook-v1.24_2020-12-25.pdf',
    accentColor: '#ff003c',
    icon: <BookOpen className="w-4 h-4 text-[#ff003c]" />,
    whatItBringsSummary:
      'El manual fundacional del juego. Ambientado en 2045 durante la era de reconstrucción tras la 4ª Guerra Corporativa. Establece el motor matemático canónico, el cálculo de HP, la matriz de DVs por metro, la ablación de blindaje y los 272 ítems esenciales de la calle.',
    keyHighlights: [
      '272 Ítems canónicos en todas las categorías de equipo.',
      '15 Armas Exóticas canónicas (Malorian Arms 3516, Kendachi Mono-Three, Helix, etc.).',
      'Catálogo completo de Ciberware clásico de 8 ranuras anatómicas.',
      'Sistemas de Netrunning con arquitecturas piso por piso y Black ICE analógico.',
      '10 Roles icónicos con sus habilidades especiales a Rango 4.'
    ],
    mechanicsIntroduced: [
      'Cálculo de HP canónico y Umbral de Herida Grave (-2 global)',
      'Tiradas desacopladas: Impacto 1d10 y Daño Xd6',
      'Ablación de SP en tiempo real',
      'Matriz de DVs por rangos métricos'
    ],
    specificNavigation: {
      label: '🦾 Ir a Ripperdoc Clásico',
      targetTab: 'cyberware',
      icon: <Cpu className="w-3.5 h-3.5" />,
      color: 'bg-[#ff003c]/20 hover:bg-[#ff003c] text-[#ff003c] hover:text-white border-[#ff003c]/40'
    }
  },
  {
    id: 'cemk_2077',
    title: 'Cyberpunk Edgerunners Mission Kit (2077)',
    shortBadge: '2077 CEMK',
    era: '2077',
    version: 'v1.0.0',
    sourcePdf: 'CEMK-Rulebook-Edgerunners-Core-Rules_2024-05-22.pdf',
    accentColor: '#fcee0a',
    icon: <Zap className="w-4 h-4 text-[#fcee0a]" />,
    whatItBringsSummary:
      'Actualización canónica oficial al año 2077 basada en el anime Cyberpunk: Edgerunners y Cyberpunk 2077. Integra el Neuroport universal, 15 Quickhacks activables por rango de Interface, armamento Power, Tech y Smart, y 7 personajes pregenerados de los Folios oficiales con tokens de alta resolución.',
    keyHighlights: [
      'Neuroport 2077 universal (Holófono, Biomonitor, Virtu, HUD, Shards, Personal Link).',
      '15 Quickhacks divididos en Simple (Req 1), Standard (Req 2), Difficult (Req 4) y Advanced (Req 7).',
      'Reglas de Armas 2077: Power (rebote +5 crítico), Tech (disparo cargado ignora 50% SP y atraviesa cobertura) y Smart (+1 ataque y segundo intento con Improved Smart Ammunition).',
      '7 Personajes oficiales de los Folios: Hardpoint, Wrench, Connect, Bluescreen, Insurance, Thorn y Maven.',
      'Tokens oficiales en formato PNG listos para el tablero táctico.'
    ],
    mechanicsIntroduced: [
      'Quickhacking a 6, 8 o 50 m según la conexión, con hasta 3 NET Actions por turno',
      'Disparos con Rebote Power a -4 (o solo el penalizador de Aimed Shot)',
      'Carga electromagnética Tech ignorando la mitad de SP',
      'Segunda oportunidad balística con munición Smart'
    ],
    specificNavigation: {
      label: '⚡ Quickhacks & Roles 2077',
      targetTab: 'netroles',
      icon: <Zap className="w-3.5 h-3.5" />,
      color: 'bg-[#fcee0a]/20 hover:bg-[#fcee0a] text-[#fcee0a] hover:text-black border-[#fcee0a]/40 font-bold'
    }
  },
  {
    id: 'black_chrome',
    title: 'Black Chrome Tech & Style Guide',
    shortBadge: 'BLACK CHROME',
    era: '2045',
    version: 'v1.0.0',
    sourcePdf: 'Cyberpunk-RED-Black-Chrome-Tech-and-Style-Guide_2023-03-01.pdf',
    accentColor: '#e0a800',
    icon: <Sparkles className="w-4 h-4 text-[#e0a800]" />,
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
    ],
    specificNavigation: {
      label: '🚗 Ver Garaje & Vehículos',
      targetTab: 'netroles',
      icon: <Wrench className="w-3.5 h-3.5" />,
      color: 'bg-[#e0a800]/20 hover:bg-[#e0a800] text-[#e0a800] hover:text-black border-[#e0a800]/40 font-bold'
    }
  },
  {
    id: 'interface_red',
    title: 'Interface RED Vol. 3: Going Metal (FBC)',
    shortBadge: 'GOING METAL',
    era: '2045',
    version: 'v1.0.0',
    sourcePdf: 'Interface-RED-Vol-3-Going-Metal-FBC.pdf',
    accentColor: '#a855f7',
    icon: <Cpu className="w-4 h-4 text-[#a855f7]" />,
    whatItBringsSummary:
      'El suplemento canónico definitivo de Full Body Conversions (FBC). Introduce 13 chasis completos de cyborgs de grado militar e industrial, 16 implantes y chasis exclusivos para borgs, reglas de Biopod (-14 HL) y tablas completas de mantenimiento y reparación.',
    keyHighlights: [
      '13 Chasis FBC oficiales (Alpha Class, Samson, Dragoon, Aquarius, Spyder, etc.).',
      '16 Piezas de Ciberware exclusivas para chasis cyborg.',
      'Soporte vital Biopod (-14 de Humanidad fija).',
      'Inmunidad completa a asfixia, sangrado y toxinas biológicas.'
    ],
    mechanicsIntroduced: [
      'Conversión FBC con chasis acoplables y desacoplables',
      'DVs de reparación de chasis con Cybertech y Basic Tech',
      'Blindaje integrado de SP 11 a SP 15 sin penalizadores'
    ],
    specificNavigation: {
      label: '🦾 Estación Ripperdoc & FBC',
      targetTab: 'cyberware',
      icon: <Cpu className="w-3.5 h-3.5" />,
      color: 'bg-[#a855f7]/20 hover:bg-[#a855f7] text-[#a855f7] hover:text-white border-[#a855f7]/40'
    }
  },
  {
    id: 'cyberfists',
    title: 'Cyberfists of Fury (27 Artes Marciales & Cyberfists)',
    shortBadge: 'CYBERFISTS',
    era: 'both',
    version: 'v1.0.0',
    sourcePdf: 'Cyberfists-of-Fury-Martial-Arts-Guide.pdf',
    accentColor: '#ef4444',
    icon: <Swords className="w-4 h-4 text-[#ef4444]" />,
    whatItBringsSummary:
      'Expansión integral de combate cuerpo a cuerpo y artes marciales canónicas. Reúne 27 estilos de combate marcial formales (4 del Core Rulebook y 23 formas expandidas), 54 movimientos especiales únicos contra DV 15, y el sistema oficial de entrenamiento con Puntos de Mejora (IP = Rango Objetivo × 40) y Skill Chips de 1.000 €$.',
    keyHighlights: [
      '27 Estilos Marciales con resolución de daño por tabla de BODY.',
      '54 Movimientos especiales únicos con requisitos de ataque y resolución DV 15.',
      'Sistema de progresión canónico con Puntos de Mejora (IP).',
      'Skill Chips de Artes Marciales (1.000 €$) para implantación inmediata en ranuras chipware.'
    ],
    mechanicsIntroduced: [
      'Coste doble de habilidad (x2) para Artes Marciales',
      'Ablación y división del 50% de blindaje SP defensor',
      'Movimientos especiales de estilo que causan estados de derribo, aturdimiento o daño directo'
    ],
    specificNavigation: {
      label: '🥋 Ir al Dojo & Artes Marciales',
      targetTab: 'netroles',
      icon: <Swords className="w-3.5 h-3.5" />,
      color: 'bg-[#ef4444]/20 hover:bg-[#ef4444] text-[#ef4444] hover:text-white border-[#ef4444]/40 font-bold'
    }
  },
  {
    id: 'danger_gal',
    title: 'Danger Gal Dossier',
    shortBadge: 'DANGER GAL',
    era: '2045',
    version: 'v1.0.0',
    sourcePdf: 'Cyberpunk-RED-Danger-Gal-Dossier_2023-07-07.pdf',
    accentColor: '#ff2a85',
    icon: <Skull className="w-4 h-4 text-[#ff2a85]" />,
    whatItBringsSummary:
      'El compendio oficial de facciones, bandas y corporaciones de Night City. Aporta 15 facciones detalladas (Danger Gal, Bozos, Maelstrom, Inquisitors, 6th Street, NCPD, Trauma Team, etc.) y más de 100 perfiles de enemigos listos para el combate táctico.',
    keyHighlights: [
      '15 Facciones urbanas con trasfondo y doctrina de combate.',
      'Más de 100 perfiles de NPCs y enemigos con STATs, blindajes y armas asignadas.',
      'Integración directa con el Fixer Deck para despliegue de encuentros del GM.',
      'Filtros por nivel de amenaza y distrito de Night City.'
    ],
    mechanicsIntroduced: [
      'Matriz de dificultad de encuentros para el GM',
      'Despliegue rápido de perfiles de esbirros y lugartenientes'
    ],
    specificNavigation: {
      label: '💀 Ir a Fixer Deck / Enemigos',
      targetTab: 'gm',
      icon: <Skull className="w-3.5 h-3.5" />,
      color: 'bg-[#ff2a85]/20 hover:bg-[#ff2a85] text-[#ff2a85] hover:text-white border-[#ff2a85]/40 font-bold'
    }
  },
  {
    id: 'gunmas',
    title: '12 Days of Gunmas (DLC Armamento Especial)',
    shortBadge: 'GUNMAS',
    era: '2045',
    version: 'v1.0.0',
    sourcePdf: 'The-12-Days-of-Gunmas-v1.3_2022-01-12.pdf',
    accentColor: '#10b981',
    icon: <Crosshair className="w-4 h-4 text-[#10b981]" />,
    whatItBringsSummary:
      'Suplemento festivo oficial con 12 armas exóticas: Arasaka WAA Bullpup, Constitutional Arms Multi-Ammo Pistol, IMI Chainknife, Kendachi Dragon Flamethrower, Magnum Opus Hellbringer, Malorian Arms Sub-Flechette Gun, Militech Crusher, Mustang Arms ARS-5, Nomad Pneumatic Bolt Gun, Nova Model 757 Cityhunter, Stolbovoy ST-5 y Teen Dreem.',
    keyHighlights: [
      '12 armas exóticas con tabla de estadísticas impresa (p.7).',
      'Dos armas de Calidad Pobre (Stolbovoy ST-5 y Teen Dreem) y una Excelente (Malorian Sub-Flechette).',
      'Munición propia en la Nova Cityhunter y la Malorian Sub-Flechette.'
    ],
    mechanicsIntroduced: [
      'Munición mixta seleccionable disparo a disparo (Multi-Ammo Pistol)',
      'Fuego incendiario: 4 de daño a HP por turno (Kendachi Dragon)',
      'Motosierra con modo revved de 4d6 y Calidad Excelente (IMI Chainknife)'
    ],
    specificNavigation: {
      label: '🔫 Ver Arsenal en Street Lab',
      targetTab: 'sheet',
      icon: <Crosshair className="w-3.5 h-3.5" />,
      color: 'bg-[#10b981]/20 hover:bg-[#10b981] text-[#10b981] hover:text-white border-[#10b981]/40'
    }
  },
  {
    id: 'woodchipper',
    title: "Woodchipper's Garage (DLC Vehículos & Garaje)",
    shortBadge: 'GARAGE',
    era: '2045',
    version: 'v1.0.0',
    sourcePdf: 'Woodchippers-Garage-v1.0.pdf',
    accentColor: '#f59e0b',
    icon: <Wrench className="w-4 h-4 text-[#f59e0b]" />,
    whatItBringsSummary:
      'Guía técnica de tuneado y blindaje vehicular para mecánicos nómadas y Techs. Detalla mejoras de estructura, arietes de choque frontal, compartimentos ocultos y torretas montadas.',
    keyHighlights: [
      'Mejoras de Puntos de Daño Estructural (SDP) para coches y motos.',
      'Sistemas de escape con nitro y sobrealimentación.',
      'Armamento montado en techo y parachoques reforzados.'
    ],
    mechanicsIntroduced: [
      'Mantenimiento y reparación de vehículos con Land Vehicle Tech',
      'Blindaje modular desmontable'
    ],
    specificNavigation: {
      label: '🚗 Ir a Garaje Nómada',
      targetTab: 'netroles',
      icon: <Wrench className="w-3.5 h-3.5" />,
      color: 'bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black border-[#f59e0b]/40 font-bold'
    }
  },
  {
    id: 'toggles_temple',
    title: "Toggle's Temple (DLC Electrónica & Ciberware)",
    shortBadge: 'TOGGLE',
    era: '2045',
    version: 'v1.0.0',
    sourcePdf: 'Toggles-Temple-Tech-Guide.pdf',
    accentColor: '#38bdf8',
    icon: <Terminal className="w-4 h-4 text-[#38bdf8]" />,
    whatItBringsSummary:
      'Catálogo clandestino de electrónica de consumo modificada, agentes piratas y ciberware artesanal ensamblado en talleres de los bajos fondos de Watson.',
    keyHighlights: [
      'Agentes telefónicos con cifrado militar antirrastreo.',
      'Escáneres de radio de espectro amplio.',
      'Opciones de ciberware artesanal con menor coste en eurodólares.'
    ],
    mechanicsIntroduced: [
      'Chequeos de intercepción de señales con Electronics/Security',
      'Modificaciones de hardware callejero'
    ],
    specificNavigation: {
      label: '🦾 Ir a Ripperdoc',
      targetTab: 'cyberware',
      icon: <Cpu className="w-3.5 h-3.5" />,
      color: 'bg-[#38bdf8]/20 hover:bg-[#38bdf8] text-[#38bdf8] hover:text-black border-[#38bdf8]/40 font-bold'
    }
  },
  {
    id: 'must_have_deals',
    title: 'Must Have Cyberware Deals (DLC Ripperdoc)',
    shortBadge: 'DEALS',
    era: '2045',
    version: 'v1.0.0',
    sourcePdf: 'Must-Have-Cyberware-Deals.pdf',
    accentColor: '#00f5d4',
    icon: <Sparkles className="w-4 h-4 text-[#00f5d4]" />,
    whatItBringsSummary:
      'Paquetes económicos de ciberware y opciones reacondicionadas con descuentos de precio para personajes recién creados o presupuestos muy ajustados.',
    keyHighlights: [
      'Packs promocionales de implantes básicos de clínica.',
      'Variantes reacondicionadas con pequeñas particularidades cosméticas.',
      'Guía de instalación económica en clínicas de distrito.'
    ],
    mechanicsIntroduced: [
      'Ciberware reacondicionado con descuento de coste',
      'Tiradas de mantenimiento post-instalación'
    ],
    specificNavigation: {
      label: '🦾 Ir a Ripperdoc',
      targetTab: 'cyberware',
      icon: <Cpu className="w-3.5 h-3.5" />,
      color: 'bg-[#00f5d4]/20 hover:bg-[#00f5d4] text-[#00f5d4] hover:text-black border-[#00f5d4]/40 font-bold'
    }
  },
  {
    id: 'hornets_pharmacy',
    title: "Hornet's Pharmacy (DLC Fármacos & Drogas)",
    shortBadge: 'PHARMA',
    era: '2045',
    version: 'v1.11',
    sourcePdf: 'Hornets-Pharmacy-Chemical-Wonderland-v1.11_2023-01-23.pdf',
    accentColor: '#ec4899',
    icon: <Pill className="w-4 h-4 text-[#ec4899]" />,
    whatItBringsSummary:
      'Suplemento oficial Hornet\'s Pharmacy: A Chemical Wonderland (v1.11): 4 drogas callejeras (Berserker, Prime Time, Sixgun, Timewarp), 3 aditivos (Delaying, Distilling, Osmosis), 2 fármacos de Medtech (Sedative, Veritas), el dron asesino Suzumebachi y 2 implantes (Bodyweight AutoInjector, Pursuit Security Inc. Gas Jet).',
    keyHighlights: [
      'Drogas con Efecto Primario, Efecto Secundario (DV17) y adicción.',
      'Aditivos que se mezclan con Viales de Veneno o Biotoxina.',
      'Dron Suzumebachi, Bodyweight AutoInjector y Gas Jet.'
    ],
    mechanicsIntroduced: [
      'Adicción y efectos secundarios (DV17)',
      'Mezcla de aditivos con venenos y biotoxinas',
      'Humanity Loss temporal devuelta al terminar el efecto (Prime Time)'
    ],
    specificNavigation: {
      label: '🧪 Ver Laboratorio Medtech',
      targetTab: 'netroles',
      icon: <Pill className="w-3.5 h-3.5" />,
      color: 'bg-[#ec4899]/20 hover:bg-[#ec4899] text-[#ec4899] hover:text-white border-[#ec4899]/40'
    }
  },
  {
    id: 'midnight_upload',
    title: 'Midnight With The Upload (DLC Netrunning)',
    shortBadge: 'UPLOAD',
    era: '2045',
    version: 'v1.0.0',
    sourcePdf: 'Midnight-With-The-Upload.pdf',
    accentColor: '#6366f1',
    icon: <Terminal className="w-4 h-4 text-[#6366f1]" />,
    whatItBringsSummary:
      'Suplemento táctico de Netrunning analógico de 2045. Contiene programas de intrusión ofensivos, nuevos Black ICE defensivos y reglas de generación de arquitecturas de red con pisos falsos.',
    keyHighlights: [
      'Programas de ataque y defensa cibernética de última generación.',
      'Variantes de Black ICE letal (Hellhound, Asp, Dragon).',
      'Plantillas de subredes para instalaciones corporativas.'
    ],
    mechanicsIntroduced: [
      'Contramedidas anti-intrusión avanzadas',
      'Rutinas de borrado automático de trazas'
    ],
    specificNavigation: {
      label: '🌐 Ver Netrunning 2045',
      targetTab: 'netroles',
      icon: <Terminal className="w-3.5 h-3.5" />,
      color: 'bg-[#6366f1]/20 hover:bg-[#6366f1] text-[#6366f1] hover:text-white border-[#6366f1]/40'
    }
  },
  {
    id: 'red_chrome_cargo',
    title: 'Red Chrome Cargo (Misión Oficial de Asalto al Tren)',
    shortBadge: 'ONESHOT',
    era: '2045',
    version: 'v1.0.0',
    sourcePdf: 'Red-Chrome-Cargo-Mission-Adventure.pdf',
    accentColor: '#dc2626',
    icon: <Train className="w-4 h-4 text-[#dc2626]" />,
    whatItBringsSummary:
      'Aventura interactiva oficial de asalto a un tren de carga maglev corporativo blindado. Incorpora plano por vagones tácticos, cronómetro de asalto dinámico, refuerzos enemigos en tiempo real y botín de alta gama.',
    keyHighlights: [
      'Misión jugable completa e interactiva con motor de combate integrado.',
      'Mapa táctico de 6 vagones acoplados con coberturas e interruptores.',
      'Cronómetro de alarma que convoca refuerzos enemigos de Night City Rail.',
      'Carga secreta corporativa con armas premium y chips de crédito.'
    ],
    mechanicsIntroduced: [
      'Combate dinámico sobre vehículos en movimiento a alta velocidad',
      'Eventos temporizados por asaltos de alarma'
    ],
    specificNavigation: {
      label: '🚆 Jugar Oneshot Red Chrome Cargo',
      targetTab: 'oneshot',
      icon: <Train className="w-3.5 h-3.5" />,
      color: 'bg-[#dc2626]/20 hover:bg-[#dc2626] text-[#dc2626] hover:text-white border-[#dc2626]/40 font-bold shadow-[0_0_12px_rgba(220,38,38,0.3)]'
    }
  }
];

export const DataPackManagerView: React.FC<DataPackManagerViewProps> = ({ onNavigateTab }) => {
  const [activeEraFilter, setActiveEraFilter] = useState<'all' | '2045' | '2077'>('all');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('cemk_2077');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const selectedModule = useMemo(() => {
    return OFFICIAL_13_MODULES.find((m) => m.id === selectedModuleId) || OFFICIAL_13_MODULES[0];
  }, [selectedModuleId]);

  const filteredModules = useMemo(() => {
    if (activeEraFilter === 'all') return OFFICIAL_13_MODULES;
    return OFFICIAL_13_MODULES.filter((m) => m.era === activeEraFilter || m.era === 'both');
  }, [activeEraFilter]);

  const totalCatalogItems = useMemo(() => {
    return (
      (coreData.weapons?.length || 0) +
      (coreData.armor?.length || 0) +
      (coreData.cyberware?.length || 0) +
      (coreData.ammunition?.length || 0) +
      (coreData.attachments?.length || 0) +
      (coreData.drugs?.length || 0) +
      (coreData.gear?.length || 0) +
      (coreData.programs?.length || 0)
    );
  }, []);

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(coreData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'core-rules.cprpack.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141f] border border-[#262c3e] p-5 rounded-xs chamfer-card space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-[#38bdf8]" />
              <h2 className="text-lg font-bold text-[#f1f5f9] font-tech uppercase tracking-wide">
                Gestor de Paquetes de Reglas (.cprpack)
              </h2>
              <span className="text-[10px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 px-2 py-0.5 rounded-xs font-mono-code font-bold">
                13 MANUALES ACTIVOS & CARGADOS
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-1 font-mono-code leading-relaxed">
              Biblioteca oficial de Cyberpunk RED y CEMK 2077: <strong>{totalCatalogItems} ítems canónicos</strong>, <strong>{ENEMIES_CATALOG.length} perfiles de enemigos</strong> y <strong>{EXPANSION_RULE_SYSTEMS.length} sistemas de reglas avanzadas</strong> sincronizados con el motor de combate.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 bg-[#00f5d4]/10 hover:bg-[#00f5d4] text-[#00f5d4] hover:text-black border border-[#00f5d4]/40 rounded-xs font-tech text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,245,212,0.15)]"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? '¡DESCARGADO!' : 'EXPORTAR .CPRPACK'}</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#1e2333]">
          <span className="text-[11px] font-mono-code text-[#64748b] uppercase">Filtrar por Era:</span>
          {(['all', '2045', '2077'] as const).map((eraKey) => (
            <button
              key={eraKey}
              onClick={() => setActiveEraFilter(eraKey)}
              className={`px-2.5 py-1 text-xs font-mono-code uppercase rounded-xs transition-colors cursor-pointer ${
                activeEraFilter === eraKey
                  ? 'bg-[#38bdf8] text-black font-bold'
                  : 'bg-[#181c2b] text-[#94a3b8] hover:text-white'
              }`}
            >
              {eraKey === 'all' ? 'TODOS (13 Módulos)' : eraKey === '2045' ? 'ERA 2045 (RED)' : 'ERA 2077 (CEMK)'}
            </button>
          ))}
        </div>
      </div>

      {/* SELECTED MODULE INTERACTIVE INSPECTOR PANEL */}
      {selectedModule && (
        <div className="bg-[#0e111a] border-2 border-[#00f5d4] p-5 rounded-xs space-y-4 shadow-[0_0_25px_rgba(0,245,212,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(#00f5d4_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          {/* Module Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#1b2234] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="p-1.5 rounded-2xs bg-[#171d2b] border border-[#232c40]">
                  {selectedModule.icon}
                </span>
                <h3 className="font-tech text-xl font-black text-white tracking-wide">
                  {selectedModule.title}
                </h3>
                <span
                  className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-xs uppercase"
                  style={{
                    backgroundColor: `${selectedModule.accentColor}20`,
                    color: selectedModule.accentColor,
                    border: `1px solid ${selectedModule.accentColor}50`
                  }}
                >
                  {selectedModule.shortBadge} • {selectedModule.era.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono-code text-[#64748b] bg-[#121622] px-2 py-0.5 rounded border border-[#1d2334]">
                  {selectedModule.version}
                </span>
              </div>
              <p className="text-xs font-mono-code text-[#64748b] flex items-center gap-1.5">
                <span>PDF Fuente Oficial:</span>
                <span className="text-[#38bdf8]">{selectedModule.sourcePdf}</span>
              </p>
            </div>

            {/* Direct Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Button 1: Ir a las Reglas */}
              <button
                onClick={() => onNavigateTab && onNavigateTab('docs')}
                className="px-3 py-1.5 bg-[#38bdf8]/15 hover:bg-[#38bdf8] text-[#38bdf8] hover:text-black border border-[#38bdf8]/40 text-xs font-tech font-bold uppercase rounded-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Abrir documentación y reglas oficiales del sistema"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📖 Ir a las Reglas</span>
              </button>

              {/* Button 2: Ver en Compendio */}
              <button
                onClick={() => onNavigateTab && onNavigateTab('compendium')}
                className="px-3 py-1.5 bg-[#f59e0b]/15 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black border border-[#f59e0b]/40 text-xs font-tech font-bold uppercase rounded-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Examinar los 272 ítems canónicos en el Compendio Maestro"
              >
                <Package className="w-3.5 h-3.5" />
                <span>🗄️ Ver en Compendio</span>
              </button>

              {/* Button 3: Módulo Específico */}
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab(selectedModule.specificNavigation.targetTab)}
                  className={`px-3.5 py-1.5 text-xs font-tech uppercase rounded-xs transition-all flex items-center gap-1.5 cursor-pointer border ${selectedModule.specificNavigation.color}`}
                >
                  {selectedModule.specificNavigation.icon}
                  <span>{selectedModule.specificNavigation.label}</span>
                </button>
              )}
            </div>
          </div>

          {/* Module Content Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Description (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-3">
              <div>
                <span className="text-[10px] font-mono-code text-[#00f5d4] uppercase font-bold tracking-wider block mb-1">
                  QUÉ APORTA ESTE MÓDULO A LA CAMPAÑA
                </span>
                <p className="text-xs font-sans text-[#cbd5e1] leading-relaxed bg-[#07090e] p-3.5 rounded border border-[#1a2133]">
                  {selectedModule.whatItBringsSummary}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase font-bold tracking-wider block">
                  PUNTOS CLAVE & CONTENIDO DESTACADO
                </span>
                <div className="space-y-1.5">
                  {selectedModule.keyHighlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-[#0a0d14] p-2 rounded-xs border border-[#181f2f] text-xs text-[#94a3b8]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Mechanics & Rule Systems (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-mono-code text-[#a855f7] uppercase font-bold tracking-wider block">
                MECÁNICAS & SUBSISTEMAS DE REGLAS
              </span>
              <div className="space-y-2">
                {selectedModule.mechanicsIntroduced.map((mech, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0c0e17] border border-[#1c2236] p-2.5 rounded-xs space-y-1"
                  >
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#00f5d4]" />
                      <span className="text-xs font-tech font-bold text-white uppercase">{mech}</span>
                    </div>
                    <p className="text-[11px] font-sans text-[#64748b]">
                      Integrado y verificado en el motor de combate y hojas de cálculo del Omni-Deck.
                    </p>
                  </div>
                ))}
              </div>

              {/* Status Badge */}
              <div className="p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  <span className="text-xs font-mono-code text-[#10b981] font-bold">
                    ESTADO: ACTIVO & SINCRONIZADO
                  </span>
                </div>
                <span className="text-[10px] font-mono-code text-[#64748b]">100% CANÓNICO</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13 MODULES INTERACTIVE CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-tech text-sm font-bold text-[#f1f5f9] uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-[#00f5d4]" />
            <span>Módulos de la Biblioteca ({filteredModules.length})</span>
          </h3>
          <span className="text-[11px] font-mono-code text-[#64748b]">
            Haz clic en cualquier manual para inspeccionar su contenido e ir directamente a sus reglas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredModules.map((module) => {
            const isSelected = selectedModuleId === module.id;
            return (
              <div
                key={module.id}
                onClick={() => setSelectedModuleId(module.id)}
                className={`p-4 rounded-xs border transition-all cursor-pointer relative bg-[#0e111a] hover:bg-[#131722] flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-[#00f5d4] shadow-[0_0_16px_rgba(0,245,212,0.25)] ring-1 ring-[#00f5d4]/50'
                    : 'border-[#1e2436] hover:border-[#38bdf8]/60'
                }`}
              >
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-2xs bg-[#171d2b] border border-[#232c40]">
                        {module.icon}
                      </span>
                      <span
                        className="text-[9px] font-mono-code font-bold px-1.5 py-0.5 rounded-2xs uppercase"
                        style={{
                          backgroundColor: `${module.accentColor}20`,
                          color: module.accentColor,
                          border: `1px solid ${module.accentColor}40`
                        }}
                      >
                        {module.shortBadge}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono-code text-[#64748b]">
                      {module.era.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-tech text-sm font-bold text-white tracking-wide">
                    {module.title}
                  </h4>

                  <p className="text-[11px] font-sans text-[#94a3b8] line-clamp-2 leading-relaxed">
                    {module.whatItBringsSummary}
                  </p>
                </div>

                {/* Footer and Interactive Prompt */}
                <div className="pt-2 border-t border-[#171c2c] flex items-center justify-between">
                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    {module.keyHighlights.length} puntos destacados
                  </span>
                  <span
                    className={`text-[10px] font-tech font-bold uppercase flex items-center gap-1 transition-colors ${
                      isSelected ? 'text-[#00f5d4]' : 'text-[#64748b] group-hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? 'INSPECCIONANDO' : 'VER CONTENIDO'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
