/**
 * CPR OMNI-DECK // SISTEMA DE DOCUMENTACIÓN, ARQUITECTURA Y CHANGELOG INTERACTIVO
 * Fuente única de verdad para el historial de versiones (v1.0.0 - v3.5.0),
 * inventario de sistemas agregados, estado del roadmap de fases y arquitectura técnica.
 */

import coreRulesPack from './core-rules.cprpack.json';
import { ENEMIES_CATALOG, DANGER_GAL_15_FACTIONS } from './enemiesCatalog';
import { MARTIAL_ARTS_FORMS } from './cyberfistsMartialArtsData';
import { FBC_13_BODIES, FBC_16_CYBERWARE } from './goingMetalFbcData';
import { 
  NET_ARCHITECTURE_PRESETS, 
  QUICKHACKS_2077_CATALOG, 
  VEHICLES_CATALOG, 
  ROLES_INTERACTIVE_GUIDES 
} from './netAndRolesData';

// ============================================================================
// 1. TIPOS PARA EL HISTORIAL DE VERSIONES (CHANGELOG)
// ============================================================================

export type SystemPhaseId = 'Fase 0' | 'Fase 1' | 'Fase 2' | 'Fase 3' | 'Fase 4' | 'Fase 5' | 'Oneshot' | 'Codex';

export interface VersionChangelogEntry {
  version: string;
  date: string;
  author?: 'Claude Code' | 'Antigravity'; // Quién escribió la versión (cowork Claude Code ↔ Antigravity).
  phase: SystemPhaseId;
  category: string;
  title: string;
  summary: string;
  highlights: string[];
  filesTouched: string[];
  metricsBadge: string;
}

export const VERSION_CHANGELOG_HISTORY: VersionChangelogEntry[] = [
  {
    version: 'v3.5.0',
    date: '2026-10-18',
    author: 'Antigravity',
    phase: 'Codex',
    category: 'System Codex, Interactive Documentation & Full Changelog Portal',
    title: 'Portal de Documentación Interactiva, Historial de Versiones e Inventario de Sistemas',
    summary: 'Incorporación de la vista interactiva CODEX // DOCUMENTACIÓN & CHANGELOG en la barra de navegación superior, permitiendo auditar versión por versión todo el desarrollo de la aplicación, el inventario completo de los 8 grandes sistemas, el roadmap de fases (Fases 0 a 5) y los contratos de arquitectura técnica.',
    highlights: [
      'Portal interactivo SystemChangelogAndDocsView accesible en 1 clic desde la barra superior de la aplicación.',
      'Línea de tiempo interactiva de Changelog desde v1.0.0 hasta v3.5.0 con filtro dinámico por Fase y buscador instantáneo.',
      'Inventario exhaustivo de los 8 sistemas construidos con métricas vivas importadas directamente desde los catálogos de datos.',
      'Tablero de Roadmap de Fases (Fase 0 a Fase 5) con desglose de metas completadas y especificaciones de las fases pendientes.',
      'Auditoría y estado de los 5 Módulos Premium de la Companion App (Going Metal, Cyberfists of Fury, Danger Gal Dossier, Night City 2045 y Solo of Fortune).',
      'Documentación técnica del stack (React 19, TS 5.8, Tailwind v4, Zustand 5), estructura de archivos en disco y contrato .cprpack.json.'
    ],
    filesTouched: [
      'frontend/src/data/systemDocsAndChangelogData.ts',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'frontend/src/App.tsx'
    ],
    metricsBadge: 'v3.5.0 • Codex Live • 8 Módulos • 100% Validado'
  },
  {
    version: 'v3.4.5',
    date: '2026-10-17',
    author: 'Antigravity',
    phase: 'Oneshot',
    category: 'Official Adventure Engine, Oneshot Operations & Roster Automation',
    title: 'Centro de Comando Oneshot: RED CHROME CARGO (CEMK 2077) & Precarga Roster Edgerunners',
    summary: 'Adaptación completa y canónica del oneshot oficial de Cyberpunk Edgerunners Mission Kit "Red Chrome Cargo", con mapa táctico del tren Maglev extraído del PDF, screamsheet interactivo sin spoilers, fichas de enemigos duales 2045/2077 con Quickhacks y loot, y precarga de los 7 Edgerunners oficiales.',
    highlights: [
      'Extracción en alta resolución del plano original del tren Maglev "Hammerhead" (hammerhead-map.png) y del Screamsheet periodístico (screamsheet-p2.png).',
      'Grilla táctica interactiva de 4 vagones (Rear Car, Middle Car, Front Car, Driver\'s Car) con tokens y reglas de cobertura.',
      'Escalador dinámico de encuentros de 2 a 7 PJs con fórmulas canónicas de spawn por vagón.',
      'Fichas duales (2045 Clásico + 2077 CEMK) para los 3 enemigos: Guardia con Escopeta, Oficial de Asalto y Torreta Automática de techo.',
      'Vulnerabilidades pieza a pieza a Quickhacks (Short Circuit, Weapon Glitch, Reboot Optics, etc.) con bonificaciones especiales para Lucy y Kiwi.',
      'Tablas completas de Loot Drops individuales, botín del Manifiesto de Carga del Tren y las 4 Cajas Blindadas de Hornet.',
      'Precarga automática de los 7 Edgerunners de la serie: David Martinez, Lucy, Rebecca, Maine, Kiwi, Falco y Pilar en el store global.',
      'Pestaña dedicada "🚆 RED CHROME CARGO" en la navegación principal.'
    ],
    filesTouched: [
      'frontend/src/data/redChromeCargoData.ts',
      'frontend/src/features/oneshot/RedChromeCargoView.tsx',
      'frontend/public/hammerhead-map.png',
      'frontend/public/screamsheet-p2.png',
      'frontend/src/store/useCharacterStore.ts',
      'frontend/src/App.tsx'
    ],
    metricsBadge: 'Oneshot Command Center • 7 Pregens 2077 • 4 Vagones • 5 Pisos NET'
  },
  {
    version: 'v3.4.0',
    date: '2026-10-17',
    author: 'Antigravity',
    phase: 'Fase 3',
    category: 'Phase 3 Complete: Netrunning, Quickhacks, 10 Roles & Premium Expansions',
    title: 'Cierre Completo de Fase 3: Netrunning 2045, Quickhacks 2077, 10 Roles, Vehículos SDP & 3 Módulos Premium',
    summary: 'Cierre oficial de la Fase 3 con simulación táctica de Pisos de Red 2045, consola de Quickhacks 2077 en tiempo real con RAM, consolas de los 10 roles oficiales, gestor de vehículos con SDP y la integración de los 3 primeros Módulos Premium de la Companion App.',
    highlights: [
      'Simulador piso a piso de Arquitecturas NET 2045 con 8 presets canónicos, creador personalizado y combate contra Black ICE (9 acciones de interfaz).',
      'Consola de Quickhacking 2077 inalámbrico con pool reactivo de memoria RAM y 15 programas de hackeo ofensivo y de control.',
      'Estaciones interactivas de habilidades de rol para los 10 Roles oficiales: Solo, Medtech, Tech, Nomad, Rockerboy, Netrunner, Fixer, Media, Exec y Lawman.',
      'Garaje y tracker de 14 vehículos con SDP (Structural Damage Points), blindaje de lunas/chasis y cálculo de maniobras de persecución y embestidas.',
      'Módulo Premium GOING METAL: 13 Cuerpos FBC oficiales, 16 piezas de cyberware borg, Linear Frame Omega y granadas Laser/Chaff con toggle interactivo en Ripperdoc.',
      'Módulo Premium CYBERFISTS OF FURY: 23 nuevas formas marciales de Interface RED Vol 4 (sumando 27 estilos totales) y 46 nuevos movimientos especiales (54 totales).',
      'Módulo Premium DANGER GAL DOSSIER: Bestiario ampliado a 118 PNJs oficiales en 15 facciones, creador de PNJs custom en Fixer Deck y tema visual neón.'
    ],
    filesTouched: [
      'frontend/src/data/netAndRolesData.ts',
      'frontend/src/features/netroles/NetAndRolesDeckView.tsx',
      'frontend/src/data/goingMetalFbcData.ts',
      'frontend/src/data/cyberfistsMartialArtsData.ts',
      'frontend/src/data/enemiesCatalog.ts',
      'frontend/src/features/cyberware/CyberwareRipperdocView.tsx',
      'frontend/src/features/gm/FixerDeckView.tsx',
      'frontend/src/features/sheet/StreetLabView.tsx'
    ],
    metricsBadge: 'Fase 3 Completa • 10 Roles • 15 Quickhacks • 13 FBCs • 27 Artes Marciales'
  },
  {
    version: 'v2.9.0',
    date: '2026-10-17',
    author: 'Antigravity',
    phase: 'Fase 2',
    category: 'Phase 2 Complete: Aimed Shots, 44-Enemy Bestiary & Multi-Book Compendium',
    title: 'Cierre Completo de Fase 2: Disparos Apuntados, Bestiario de 44 Enemigos, 8 Sistemas y 368 Ítems',
    summary: 'Cierre oficial de la Fase 2 implementando el selector interactivo de Disparos Apuntados (-8, ROF 1, x2 en cabeza), biblioteca táctica de 44 enemigos para el GM, compendio de 8 sistemas de expansión y catálogo multi-libro de 368 ítems con sinopsis por libro.',
    highlights: [
      'Selector de Disparos Apuntados (Aimed Shots) con penalizador automático de -8, restricción de ROF 1, daño doble penetrante a cabeza, pierna rota y desarme.',
      'Biblioteca táctica de 44 enemigos clasificados por nivel de amenaza y facciones con inyección en 1 clic al HUD de combate.',
      'Compendio de 8 nuevos sistemas de reglas de expansiones (FBC, Neuroport 2077, Armas Power/Tech/Smart, Ciberpsicosis, Hornet\'s Pharmacy, Drogas, Vehículos, Salvamento).',
      'Expansión del catálogo canónico de 272 a 368 ítems con filtro multi-libro por manual origen (sourceBook) y descripciones introductorias por libro.'
    ],
    filesTouched: [
      'frontend/src/engine/combatEngine.ts',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/data/enemiesCatalog.ts',
      'frontend/src/data/expansionRulesData.ts',
      'frontend/src/features/compendium/CompendiumView.tsx',
      'frontend/src/features/rules/RulesCheatSheetDrawer.tsx',
      'data/core-rules.cprpack.json'
    ],
    metricsBadge: 'Fase 2 Completa • 44 Amenazas • 368 Ítems • 8 Sistemas'
  },
  {
    version: 'v2.6.0',
    date: '2026-10-17',
    author: 'Antigravity',
    phase: 'Fase 2',
    category: 'Character Creation Engine, Onboarding Wizard & Lifepath',
    title: 'Creador Guiado de 6 Pasos, Pregenerados CEMK/2045, Lifepath Híbrido y Sistema de Deuda',
    summary: 'Asistente interactivo de creación de personajes con soporte para 2045 y 2077 CEMK, los 3 métodos oficiales (Streetrat, Edgerunner, Complete Package), Lifepath híbrido con Enemigos en 4D, presupuesto oficial y regla Selling Out / En Deuda.',
    highlights: [
      'Stepper guiado de 6 pasos: Era & Método ➔ Rol & Concepto ➔ STATs ➔ Skills ➔ Tienda & Deuda ➔ Lifepath & Bio.',
      'Soporte dual de Era: 2045 Clásico vs 2077 CEMK con los 7 subsistemas gratuitos del Neuroport integrados.',
      'Los 3 métodos oficiales: Streetrat (tabla 1d10), Edgerunner (matriz 10x10) y Complete Package (62 stats / 86 skills).',
      'Lifepath Híbrido: tirada automática con 1d10 o edición/redacción manual en cada campo, más módulo profundo de Enemigos en 4D.',
      'Tienda inicial con presupuesto oficial de 2,550 €$ + 800 €$ de moda y regla opcional "Selling Out / Empezar con Deuda".',
      '17 plantillas pregeneradas completas listas para cargar en 1 clic.',
      'Hover tooltips tácticos para principiantes en las 10 estadísticas principales.'
    ],
    filesTouched: [
      'frontend/src/features/creator/CharacterCreatorWizard.tsx',
      'frontend/src/data/characterCreationData.ts',
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/store/useCharacterStore.ts',
      'frontend/src/App.tsx'
    ],
    metricsBadge: '6 Pasos • 17 Pregenerados • 3 Métodos • Lifepath Híbrido'
  },
  {
    version: 'v2.5.0',
    date: '2026-10-17',
    author: 'Antigravity',
    phase: 'Fase 1',
    category: 'Tabletop Utilities, Rules Engine & Master GM Operations',
    title: 'Cierre Completo de Fase 1: Machete de Reglas Lateral, Sobrepeso Situacional y Consola Fixer con PIN',
    summary: 'Drawer lateral persistente con machete canónico de reglas de mesa en 6 categorías, regla oficial de sobrepeso según BODY * 10 con penalizadores de -2 REF/DEX/MOVE y consola central Fixer Deck protegida por PIN.',
    highlights: [
      'Drawer lateral flotante RulesCheatSheetDrawer con 6 categorías filtrables de reglas de combate, coberturas y traumas.',
      'Cálculo de sobrepeso situacional según BODY * 10 con penalizador reactivo de -2 a REF, DEX y MOVE.',
      'Consola de Director de Juego FixerDeckView protegida por PIN con panel de vitals del equipo, inyector de daño/curación y bitácora de sesión.'
    ],
    filesTouched: [
      'frontend/src/features/rules/RulesCheatSheetDrawer.tsx',
      'frontend/src/data/rulesCheatSheet.ts',
      'frontend/src/features/gm/FixerDeckView.tsx',
      'frontend/src/engine/characterEngine.ts',
      'frontend/src/features/sheet/StreetLabView.tsx'
    ],
    metricsBadge: 'Fase 1 Completa • Drawer de Reglas • Consola GM PIN'
  },
  {
    version: 'v2.4.0',
    date: '2026-10-17',
    author: 'Antigravity',
    phase: 'Fase 1',
    category: 'Deep Systems, Cyberware Ergonomics & 2077 Ripperdoc Interface',
    title: 'Menú Ripperdoc Estilo Cyberpunk 2077 con Maniquí Anatómico en A-Pose',
    summary: 'Vista interactiva inspirada en la clínica de ciberware de Cyberpunk 2077, con silueta holográfica en A-Pose, flechas conectoras a 8 regiones anatómicas, medidores de humanidad y ciberpsicosis e instalador con tirada Xd6.',
    highlights: [
      'Maniquí anatómico SVG en A-Pose con animaciones de escaneo y flechas hacia las 8 zonas corporales + Fashionware.',
      'Medidores verticales segmentados de Humanidad, Umbral de Ciberpsicosis (EMP pérdida) y Blindaje SP.',
      'Ranuras con arte vectorial estilo 2077, desinstalación en un clic e instalador quirúrgico con tirada Xd6 de pérdida de humanidad.'
    ],
    filesTouched: [
      'frontend/src/features/cyberware/CyberwareRipperdocView.tsx',
      'frontend/src/store/useCharacterStore.ts',
      'frontend/src/App.tsx'
    ],
    metricsBadge: 'Maniquí A-Pose • 8 Zonas • 96 Implantes'
  },
  {
    version: 'v2.3.3',
    date: '2026-10-17',
    author: 'Antigravity',
    phase: 'Fase 0',
    category: 'Combat HUD Ergonomics & Modular Weapon Telemetry',
    title: 'Telémetro de Distancia Colapsable & Estación de Armas en Mano con 4 Subpestañas',
    summary: 'Optimización del espacio vertical del HUD de combate con telémetro plegable y estación de armas "En Mano" dividida en 4 subpestañas modulares.',
    highlights: [
      'Panel de distancia y DVs colapsable con resumen en una línea del bracket activo y bono.',
      '4 subpestañas por arma en mano: Munición & Cartuchos, Distancias DV & Fórmula, Autofire & Datos Técnicos, y Ver Todo.'
    ],
    filesTouched: ['frontend/src/features/combat/CombatHudView.tsx'],
    metricsBadge: 'Telémetro Plegable • 4 Subpestañas'
  },
  {
    version: 'v2.3.0',
    date: '2026-10-16',
    author: 'Antigravity',
    phase: 'Fase 0',
    category: 'Combat HUD Architecture, Ammo Telemetry & Unarmed/Consumables Engine',
    title: 'Rack de Ataque en 4 Categorías, Cartuchitos Interactivos y Motor Desarmado/Drogas',
    summary: 'Rack táctico de formas de ataque en columna derecha, visualizador de cartuchos de bala individuales, sistema de daño desarmado por BODY y consumo reactivo de granadas y fármacos.',
    highlights: [
      'Rack táctico con 4 categorías: Armas, Puños & Artes Marciales, Arrojables & Granadas y Drogas & Consumibles.',
      'Visualizador de cartuchos individuales con ojiva y vaina que cambian de color por reserva de munición.',
      'Motor de combate desarmado según BODY (1d6 a 4d6), maniobras de Grapple y Choke directo a HP ignorando SP.',
      'Consumo reactivo de granadas y fármacos con monitor de drogas en sangre y tiradas de resistencia a la adicción.'
    ],
    filesTouched: [
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/types/cyberpunk.ts',
      'frontend/src/engine/characterEngine.ts',
      'frontend/src/store/useCharacterStore.ts'
    ],
    metricsBadge: 'Rack de Ataque • Cartuchitos • Grapple & Choke'
  },
  {
    version: 'v2.2.0',
    date: '2026-10-16',
    author: 'Antigravity',
    phase: 'Fase 0',
    category: 'Economy Engine, Inventory & Interactive Compendium Accordions',
    title: 'Acordeones de Detalle en Compendio, Compra con Eurodólares y Mochila de Inventario',
    summary: 'Acordeones ultra-compactos de ~60px expandibles con todas las reglas del ítem, switch de compra en €$ vs adquisición gratis/loot y mochila de inventario con registro de transacciones.',
    highlights: [
      'Acordeones con tabla de 8 DVs, reglas de daño de melee, duración de drogas y pérdida de humanidad en cyberware.',
      'Switch global de compra con Eurodólares (€$) con descuento automático del saldo del personaje.',
      'Mochila de inventario y billetera de transacciones en Street Lab.'
    ],
    filesTouched: [
      'frontend/src/features/compendium/CompendiumView.tsx',
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/store/useCharacterStore.ts'
    ],
    metricsBadge: 'Acordeones Compendium • Billetera €$ • Inventario'
  },
  {
    version: 'v2.1.0',
    date: '2026-10-16',
    author: 'Antigravity',
    phase: 'Fase 0',
    category: 'UX/UI High-Density Layout & Rule Examples Integration',
    title: 'Dashboard Compacto de Street Lab, Ejemplos de DVs por Habilidad y Tabla Densa COMP/CON',
    summary: 'Reestructuración de Street Lab en 3 zonas de alta densidad, dropdowns con ejemplos canónicos de DVs para las 16 habilidades y vista de Tabla Densa de 1 fila en Compendio.',
    highlights: [
      'Dashboard en 2 columnas paralelas para Habilidades y Equipo sin scroll innecesario.',
      'Metadatos con 3 ejemplos oficiales de DVs del Core Rulebook para cada una de las 16 habilidades.',
      'Selector de vista en Compendio: Tarjetas Visuales vs Tabla Densa COMP/CON.'
    ],
    filesTouched: [
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/features/compendium/CompendiumView.tsx'
    ],
    metricsBadge: 'Alta Densidad • Tabla Densa • DVs Oficiales'
  },
  {
    version: 'v2.0.0',
    date: '2026-10-16',
    author: 'Antigravity',
    phase: 'Fase 0',
    category: 'Modular Architecture, Real Math Engine & Complete Core Catalog',
    title: 'Arquitectura Modular Estilo COMP/CON, Motor Matemático Real y Catálogo Canónico de 272 Ítems',
    summary: 'Reconstrucción total de la arquitectura desacoplando reglas y UI, motor de combate en 2 clics (Ataque 1d10 explosivo + Daño Xd6 con crítico en doble 6), ablación de blindaje y catálogo maestro de 272 ítems oficiales.',
    highlights: [
      'Motor de tirada en 2 pasos desacoplado: Ataque (STAT + Skill + 1d10) y Daño (Xd6).',
      'Regla canónica de Críticos: 2 o más seises activan lesión crítica oficial de la tabla 2d6 (+5 daño a HP).',
      'Ablación automática de SP en cabeza/cuerpo ante daño penetrante.',
      'Catálogo completo de 272 ítems del Core v1.24 (66 armas, 10 blindajes, 96 implantes, 13 municiones, 27 programas NET, 9 drogas, 41 objetos de equipo).',
      'Gestor de paquetes .cprpack estilo COMP/CON en DataPacksView.'
    ],
    filesTouched: [
      'data/core-rules.cprpack.json',
      'frontend/src/types/cyberpunk.ts',
      'frontend/src/engine/characterEngine.ts',
      'frontend/src/engine/combatEngine.ts',
      'frontend/src/store/useCharacterStore.ts',
      'frontend/src/store/useCombatStore.ts',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/features/compendium/CompendiumView.tsx',
      'frontend/src/features/packs/DataPacksView.tsx'
    ],
    metricsBadge: 'Arquitectura Modular • 272 Ítems • Motor 2 Clics'
  },
  {
    version: 'v1.2.0',
    date: '2026-10-15',
    author: 'Antigravity',
    phase: 'Fase 0',
    category: 'Visual Hierarchy & Rule Mechanics Expansion',
    title: 'Marcos Tácticos Militares SVG y Tablas 2d6 de Heridas Críticas',
    summary: 'Creación del componente de marcos SVG tácticos ItemVisualPlaceholder y las tablas oficiales 2d6 de heridas críticas de cabeza y cuerpo.',
    highlights: [
      'Marcos militares tácticos por categoría de ítem.',
      'Tablas de 22 lesiones críticas (Head/Body) con tratamiento y curación.'
    ],
    filesTouched: [
      'frontend/src/components/ItemVisualPlaceholder.tsx',
      'frontend/src/data/criticalInjuries.ts'
    ],
    metricsBadge: 'Marcos SVG • Tablas 2d6'
  },
  {
    version: 'v1.1.5',
    date: '2026-10-15',
    author: 'Antigravity',
    phase: 'Fase 0',
    category: 'Combat Mechanics & Range Engine',
    title: 'Matrices de Distancia de Combate y DVs por Metro',
    summary: 'Definición de las matrices canónicas de dificultad de disparo a distancia y Autofire en los 8 brackets de metros oficiales del Core Rulebook.',
    highlights: [
      'Tabla oficial de DVs para pistolas, subfusiles, escopetas, fusiles, francotirador y armas pesadas.',
      'Tabla de Autofire y cálculo de multiplicadores.'
    ],
    filesTouched: ['frontend/src/data/rangeTables.ts'],
    metricsBadge: 'Matrices DV • 8 Brackets'
  },
  {
    version: 'v1.0.0',
    date: '2026-10-15',
    author: 'Antigravity',
    phase: 'Fase 0',
    category: 'Project Scaffolding & Initial Data Pipeline',
    title: 'Scaffolding Inicial del Proyecto y Pipeline de Extracción de Reglas',
    summary: 'Inicio del repositorio, scripts CLI de extracción de texto para PDFs de reglas oficiales de R. Talsorian Games y primer esquema de empaquetado .cprpack.json.',
    highlights: [
      'Script de extracción extract_core_pack.py con validación de páginas.',
      'Primer esquema de catálogo core-rules.cprpack.json.',
      'Estructura base de proyecto con Vite y React.'
    ],
    filesTouched: [
      'scripts/extract_core_pack.py',
      'data/core-rules.cprpack.json'
    ],
    metricsBadge: 'Génesis • Scaffolding • Extracción CLI'
  }
];

// ============================================================================
// 2. INVENTARIO DE LOS 8 GRANDES SISTEMAS CONSTRUIDOS EN LA APP
// ============================================================================

export interface FeatureSubsystemDetail {
  name: string;
  description: string;
  status: 'completado' | 'en_progreso';
  sourceRulebook: string;
}

export interface AddedFeatureSystem {
  id: string;
  title: string;
  componentView: string;
  engineModule?: string;
  summary: string;
  liveMetricBadge: string;
  subsystems: FeatureSubsystemDetail[];
}

export const ADDED_FEATURES_INVENTORY: AddedFeatureSystem[] = [
  {
    id: 'combat_engine',
    title: '1. Combate Activo & Motor Matemático Desacoplado',
    componentView: 'CombatHudView.tsx',
    engineModule: 'combatEngine.ts & characterEngine.ts',
    summary: 'Motor de resolución balística en 2 clics (Ataque STAT+Skill+1d10 y Daño Xd6), detección automática de heridas críticas en dobles de 6 (+5 daño), ablación de blindaje en tiempo real, selector de distancias colapsable de 8 brackets, ataques apuntados (-8 ROF 1), visualizador de balas, rack de 4 formas de ataque y estación completa Cyberfists of Fury con 27 artes marciales.',
    liveMetricBadge: '8 Brackets DV • 22 Críticos • 27 Artes Marciales / 54 Movimientos',
    subsystems: [
      {
        name: 'Telémetro Colapsable de 8 Rangos de Distancia',
        description: 'Matrices canónicas (0-6m a 401-800m) con sweet spot verde resaltado y resumen compacto de un toque.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 174)'
      },
      {
        name: 'Tiradas en 2 Clics con Explosión (10) y Pifia (1)',
        description: 'Resolución desacoplada de impacto y daño con dados 3D virtuales y registro cronológico en log.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 168)'
      },
      {
        name: 'Daño Xd6 y Detección Automática de Heridas Críticas',
        description: 'Dos o más 6s aplican automáticamente +5 daño bonus e inyectan una lesión de la tabla oficial 2d6 de Cabeza/Cuerpo.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (págs. 187-188)'
      },
      {
        name: 'Ablación Reactiva de Blindaje SP',
        description: 'El exceso sobre el SP pasa al HP y reduce el blindaje en 1 punto (o 2 con munición perforante AP).',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 186)'
      },
      {
        name: 'Disparos Apuntados (Aimed Shots)',
        description: 'Penalizador canónico de -8, restricción de ROF 1, daño x2 en cabeza, pierna rota (-4 MOVE) y desarme forzado.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 170)'
      },
      {
        name: 'Autofire & Fuego Supresivo',
        description: 'Consumo de 10 balas, cálculo de multiplicadores hasta el tope del arma (x3/x4) y zona de 6x6m.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 173)'
      },
      {
        name: 'Visualizador Táctico de Cartuchos (AmmoCartridgeVisualizer)',
        description: 'Balas individuales estilizadas con ojiva/vaina clicables, selector de tipo de munición y reserva.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook & Black Chrome'
      },
      {
        name: 'Estación CYBERFISTS OF FURY',
        description: '27 formas marciales oficiales y 54 movimientos especiales integrados con validación de STATs y DVs.',
        status: 'completado',
        sourceRulebook: 'Interface RED Vol. 4 & Core Rulebook'
      }
    ]
  },
  {
    id: 'character_creator',
    title: '2. Creador de Personajes Guiado de 6 Pasos',
    componentView: 'CharacterCreatorWizard.tsx',
    engineModule: 'characterCreationData.ts & characterEngine.ts',
    summary: 'Asistente interactivo sin muros de texto con selección de Era (2045 vs 2077 CEMK con los 7 subsistemas gratuitos del Neuroport), los 3 métodos oficiales (Streetrat con tabla 1d10, Edgerunner con matriz 10x10, Complete Package de 62 stats / 86 skills), 17 pregenerados, Lifepath híbrido con Enemigos en 4D, tienda inicial con 2,550 €$ y regla opcional Selling Out / En Deuda.',
    liveMetricBadge: '6 Pasos • 17 Pregens • 3 Métodos • Lifepath Híbrido',
    subsystems: [
      {
        name: 'Selector de Era (2045 Clásico vs 2077 CEMK)',
        description: 'Desglose canónico de los 7 subsistemas del Neuroport gratuito de 2077 (Chyron, Subdermal Pocket, Neuralware, etc.).',
        status: 'completado',
        sourceRulebook: 'Cyberpunk Edgerunners Mission Kit (CEMK 2077)'
      },
      {
        name: '3 Métodos Canónicos de Generación de Estadísticas',
        description: 'Streetrat (plantillas 1d10 por rol), Edgerunner (10 dados independientes) y Complete Package (compra de puntos con 13 básicas en Nivel 2).',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (págs. 40-79)'
      },
      {
        name: '17 Plantillas Pregeneradas Completas',
        description: '7 Edgerunners CEMK oficiales (David, Lucy, Rebecca, Maine, Kiwi, Falco, Pilar) + 6 arquetipos 2045 + 4 Rivales.',
        status: 'completado',
        sourceRulebook: 'CEMK 2077 & Core Rulebook'
      },
      {
        name: 'Lifepath Híbrido con Enemigos en 4D',
        description: 'Tirada automática con 1d10 o redacción manual en cada campo, con historial familiar, romances y enemigos con aliados y planes de venganza.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (págs. 43-67)'
      },
      {
        name: 'Tienda Inicial & Regla Selling Out (En Deuda)',
        description: 'Presupuesto oficial de 2,550 €$ + 800 €$ de moda, paquetes por rol y deuda opcional con corporaciones o fixers.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 118)'
      },
      {
        name: 'Hover Tooltips Explicativos para Principiantes',
        description: 'Glosario táctil en cada una de las 10 estadísticas explicando en lenguaje simple su impacto mecánico.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook'
      }
    ]
  },
  {
    id: 'street_lab',
    title: '3. Hoja de Personaje & Laboratorio (Street Lab)',
    componentView: 'StreetLabView.tsx',
    engineModule: 'useCharacterStore.ts & characterEngine.ts',
    summary: 'Dashboard táctico compacto en 2 columnas paralelas con tira de 10 STATS y derivadas, 16+ habilidades con dropdowns y ejemplos oficiales de DV 9 a DV 29, pestañas de Arsenal, Blindaje (cabeza y cuerpo con botón de reparación), Mochila con regla oficial de sobrepeso (BODY * 10 con -2 REF/DEX/MOVE), Billetera con historial de transacciones, pestaña Bio/Deuda y exportación/impresión de Dossier PDF y JSON.',
    liveMetricBadge: '10 STATS • 16+ Skills con DVs • Billetera €$ • Exportación PDF/JSON',
    subsystems: [
      {
        name: 'Tira Táctica de 10 STATS e Inspector',
        description: 'Barra horizontal de estadísticas con modificadores en vivo (herida grave, sobrepeso, ciberware) y tooltips.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 72)'
      },
      {
        name: '16+ Habilidades con Ejemplos Canónicos de DVs',
        description: 'Dropdown desplegable en cada habilidad con 3 ejemplos canónicos del Core Book de DV 9 (Fácil) a DV 29 (Heroico).',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (págs. 130-145)'
      },
      {
        name: 'Mochila de Inventario & Sobrepeso Situacional',
        description: 'Límite de carga según BODY * 10 con toggle de sobrepeso que aplica automáticamente -2 REF/DEX/MOVE.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 147)'
      },
      {
        name: 'Billetera de Eurodólares & Bitácora de Transacciones',
        description: 'Control de saldo en €$, historial de compras en Night Markets y registro de cobro de recompensas de Gigs.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 376)'
      },
      {
        name: 'Pestaña Bio, Lifepath & Amortización de Deuda',
        description: 'Visualizador del trasfondo, lista de enemigos y caja de amortización financiera de la deuda adquirida.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 118)'
      },
      {
        name: 'Exportación Universal (PDF Oficial & JSON)',
        description: 'Generación de dossier imprimible fiel a la hoja oficial de R. Talsorian Games y copia de respaldo en JSON.',
        status: 'completado',
        sourceRulebook: 'Companion App Parity'
      },
      {
        name: 'Motor Canónico de Descanso, Estabilización & Cuidado Médico',
        description: 'DVs 10/13/15 de Estabilización, reposo sin esfuerzo severo, Anticuerpos Mejorados (500 eb, x2/x3 BODY HP), Criotanque (5.000 eb / 100 eb día), Criobomba y Speedheal.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (págs. 140, 222-226)'
      }
    ]
  },
  {
    id: 'cyberware_ripperdoc',
    title: '4. Cyberware Ripperdoc 2077 & Módulo GOING METAL',
    componentView: 'CyberwareRipperdocView.tsx',
    engineModule: 'goingMetalFbcData.ts & useCharacterStore.ts',
    summary: 'Menú inmersivo estilo Cyberpunk 2077 con maniquí anatómico en A-Pose, flechas conectoras a 8 zonas corporales + Fashionware, medidores de Humanidad y Ciberpsicosis, instalador quirúrgico con tirada Xd6, y la suite completa GOING METAL: 13 Cuerpos FBC oficiales, 16 piezas de cyberware borg, Linear Frame Omega, granadas Laser/Chaff y guía About FBCs.',
    liveMetricBadge: 'Maniquí A-Pose • 13 FBCs • 16 Borgware • Linear Frame Omega',
    subsystems: [
      {
        name: 'Maniquí Holográfico en A-Pose',
        description: 'Silueta vectorial SVG con escaneo holográfico y flechas hacia 8 zonas anatómicas más ranura Fashionware.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk 2077 UI & Core Rulebook'
      },
      {
        name: 'Medidores Verticales de Humanidad y Ciberpsicosis',
        description: 'Seguimiento visual segmentado de pérdida de Empatía, umbral psicótico y recuperación por terapia médica.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 230)'
      },
      {
        name: 'Suite Completa GOING METAL (Full Body Conversions)',
        description: 'Los 13 cuerpos FBC canónicos (Aquarius, Dragoon, Enforcer, Samson, Wingman, Gemini, Spyder, etc.) con Biovaina (Biopod).',
        status: 'completado',
        sourceRulebook: 'Interface RED Vol. 3 (Going Metal)'
      },
      {
        name: '16 Piezas de Cyberware Borg Especializado',
        description: 'Implantes exclusivos FBC con chasis reforzado, Linear Frame externo Omega y nueva granada Laser/Chaff.',
        status: 'completado',
        sourceRulebook: 'Interface RED Vol. 3'
      },
      {
        name: 'Conmutador Interactivo FBC',
        description: 'Toggle para transformar un personaje en cyborg completo aplicando chasis intercambiable y recálculo de humanidad.',
        status: 'completado',
        sourceRulebook: 'Interface RED Vol. 3'
      }
    ]
  },
  {
    id: 'net_and_roles',
    title: '5. Consola NET, ROLES & VEHÍCULOS',
    componentView: 'NetAndRolesDeckView.tsx',
    engineModule: 'netAndRolesData.ts',
    summary: 'Simulador táctico de Pisos de Red 2045 con 8 presets oficiales y creador personalizado, combate contra Black ICE con 9 acciones de interfaz y rez/derez de programas, consola de Quickhacks 2077 inalámbricos con pool dinámico de RAM, estaciones interactivas para los 10 roles oficiales y garaje de 14 vehículos con SDP y embestidas.',
    liveMetricBadge: '8 Presets NET • 15 Quickhacks • 10 Roles • 14 Vehículos con SDP',
    subsystems: [
      {
        name: 'Simulador y Constructor de Pisos NET 2045',
        description: 'Escalera interactiva de pisos con Archivos DV, Contraseñas DV, Nodos de Control, Black ICE y Demonios con 8 presets.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (págs. 206-224)'
      },
      {
        name: 'Combate en la Red contra Black ICE',
        description: 'Contador de Acciones de Red según Rango de Interfaz, y simulación de programas ofensivos y defensivos.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (pág. 210)'
      },
      {
        name: 'Mazo de 15 Quickhacks Remotos Era 2077',
        description: 'Consola de Quickhacking en combate sin RAM (CEMK pp. 15-17): Jack In, Breach, Quickhack y Boot Out con los 11 Quickhacks oficiales.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk Edgerunners Mission Kit (CEMK 2077)'
      },
      {
        name: 'Estaciones Interactivas para los 10 Roles Oficiales',
        description: 'Paneles con calculadoras y tiradas en vivo: Combat Awareness de Solo, Medicina/Farmacia de Medtech, Maker de Tech, etc.',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (págs. 148-167)'
      },
      {
        name: 'Garaje y Tracker de 14 Vehículos con SDP',
        description: 'Seguimiento de Structural Damage Points, blindaje corporal/lunas, asientos, armas montadas y maniobras de persecución.',
        status: 'completado',
        sourceRulebook: 'Black Chrome & Core Rulebook'
      },
      {
        name: 'Modo Master (GM) y 9 Acciones de Interfaz con Selector DV',
        description: 'Toggle de control GM para ocultar/mostrar arquitecturas de Red a jugadores, desglose canónico de 9 acciones de interfaz y selector rápido de Target DV (6, 8, 10, 12, 13, 14).',
        status: 'completado',
        sourceRulebook: 'Cyberpunk RED Core Rulebook (págs. 198-199)'
      }
    ]
  },
  {
    id: 'compendium_and_expansions',
    title: '6. Compendio Doble Multi-Libro & Sistemas de Expansión',
    componentView: 'CompendiumView.tsx & RulesCheatSheetDrawer.tsx',
    engineModule: 'core-rules.cprpack.json & expansionRulesData.ts',
    summary: 'Catálogo exhaustivo de 391 ítems oficiales filtrables por manual origen (Core, Black Chrome, CEMK 2077, Interface RED, Danger Gal Dossier, Hornet\'s Pharmacy & DLCs) con sinopsis introductoria por libro, vista de tarjetas compactas o tabla densa COMP/CON, acordeones completos y compendio de 8 sistemas de reglas de expansiones.',
    liveMetricBadge: '391 Ítems Canónicos • 8 Manuales Oficiales • 8 Sistemas de Expansión',
    subsystems: [
      {
        name: 'Catálogo Maestro Multi-Libro de 391 Ítems',
        description: '8 categorías de equipamiento (Armas, Blindajes, Accesorios, Municiones, Ciberware, Drogas, Equipo y Programas NET).',
        status: 'completado',
        sourceRulebook: 'Core Rulebook, Black Chrome, CEMK 2077 & DLCs'
      },
      {
        name: 'Filtro por Manual Origen con Sinopsis y Badges',
        description: 'Selector interactivo con insignias temáticas y resúmenes de ambientación y novedades mecánicas por libro.',
        status: 'completado',
        sourceRulebook: 'R. Talsorian Games Official Library'
      },
      {
        name: 'Selector de Vista: Tarjetas vs Tabla Densa COMP/CON',
        description: 'Alternador entre tarjetas visuales compactas de ~60px y tabla densa militar de 1 fila por ítem.',
        status: 'completado',
        sourceRulebook: 'COMP/CON Ergonomic Model'
      },
      {
        name: 'Compendio de 8 Nuevos Sistemas de Expansiones',
        description: 'FBCs de Interface RED 3, Neuroport 2077, Armas Power/Tech/Smart, Ciberpsicosis 2077, Hornet\'s Pharmacy, Drogas, Vehículos y Salvamento.',
        status: 'completado',
        sourceRulebook: 'Interface RED, CEMK 2077 & DLCs'
      }
    ]
  },
  {
    id: 'gm_fixer_deck',
    title: '7. Consola GM Fixer Deck & Módulo DANGER GAL DOSSIER',
    componentView: 'FixerDeckView.tsx & EnemiesCompendiumPanel.tsx',
    engineModule: 'enemiesCatalog.ts',
    summary: 'Consola maestra para el Director de Juego protegida por PIN, con monitor en tiempo real del equipo, bestiario de 128 PNJs en 15 facciones oficiales (Danger Gal Dossier, Hardened Enemies, Adam Smasher, CEMK 2077), creador de PNJs personalizados, tracker de encuentro activo, generador de botín con 6 tablas 1d10, notas secretas y pagos masivos.',
    liveMetricBadge: '128 PNJs en 15 Facciones • 6 Tablas de Botín • PIN de Seguridad',
    subsystems: [
      {
        name: 'Monitor Global de Vitals del Equipo con PIN',
        description: 'Tablero de control maestro con HP, SP, Humanidad y botón de inyección rápida de daño o curación protegida por contraseña.',
        status: 'completado',
        sourceRulebook: 'GM Operations & Companion App Parity'
      },
      {
        name: 'Bestiario de 128 PNJs en 15 Facciones Oficiales',
        description: 'Amenazas de Arasaka, Militech, Maelstrom, Tyger Claws, Bozos, NCPD, MaxTac, Danger Gal y bosses legendarios como Adam Smasher.',
        status: 'completado',
        sourceRulebook: 'Danger Gal Dossier, Core Rulebook & CEMK 2077'
      },
      {
        name: 'Flujo de Creación de PNJs Personalizados (Custom NPC)',
        description: 'Creador paso a paso de PNJs con rol, amenaza, stats, armas, cyberware y reglas especiales persistentes.',
        status: 'completado',
        sourceRulebook: 'Danger Gal Dossier Premium Module'
      },
      {
        name: 'Generador de Botín con 6 Tablas 1d10 Rollables',
        description: 'Tablas oficiales de botín por nivel de amenaza y facción con tirada 1d10 y auto-distribución en la sesión.',
        status: 'completado',
        sourceRulebook: 'Fixer Deck Operations'
      },
      {
        name: 'Notas Secretas de Escena y Bitácora Cronológica',
        description: 'Editor persistente de notas de sesión ocultas a los jugadores con registro cronológico de eventos.',
        status: 'completado',
        sourceRulebook: 'GM Operations'
      }
    ]
  },
  {
    id: 'red_chrome_oneshot',
    title: '8. Centro de Comando Oneshot: RED CHROME CARGO (CEMK 2077 Edition)',
    componentView: 'RedChromeCargoView.tsx',
    engineModule: 'redChromeCargoData.ts',
    summary: 'Centro de operaciones táctico para la aventura oficial Red Chrome Cargo en su versión canónica CEMK 2077, con mapa del tren Maglev "Hammerhead" extraído del PDF (hammerhead-map.png), screamsheet original (screamsheet-p2.png) con modo jugadores sin spoilers, escalador dinámico de 2 a 7 PJs, 3 fichas maestras de enemigos duales 2045/2077 con vulnerabilidades a Quickhacks y loot, arquitectura NET de 5 pisos y tablas de botín de las 4 Cajas Blindadas de Hornet.',
    liveMetricBadge: 'Mapa Maglev Oficial • Screamsheet Sin Spoilers • 3 Fichas Duales • 4 Cajas Blindadas',
    subsystems: [
      {
        name: 'Mapa Táctico del Tren Maglev "Hammerhead"',
        description: 'Plano esquemático de alta resolución extraído del PDF con los 4 vagones, escotilla, terminal NET y consola de torreta.',
        status: 'completado',
        sourceRulebook: 'Red Chrome Cargo Screamsheet (pág. 4)'
      },
      {
        name: 'Screamsheet Original "Night City Today News"',
        description: 'Periódico canónico con toggle "Modo Jugadores" para compartir la noticia sin revelar spoilers del GM.',
        status: 'completado',
        sourceRulebook: 'Red Chrome Cargo Screamsheet (pág. 2)'
      },
      {
        name: 'Fichas Tácticas Duales de Enemigos (2045 y 2077 CEMK)',
        description: 'Guardia con Escopeta, Oficial de Asalto y Torreta Automática con armas Power/Tech/Smart y blindajes detallados.',
        status: 'completado',
        sourceRulebook: 'Red Chrome Cargo & CEMK 2077'
      },
      {
        name: 'Vulnerabilidades a Quickhacks para Lucy y Kiwi',
        description: 'DVs y efectos en Short Circuit, Weapon Glitch, Reboot Optics y Overheat con bonificaciones especiales de netrunning.',
        status: 'completado',
        sourceRulebook: 'CEMK 2077 Quickhack Rules'
      },
      {
        name: 'Mainframe del Tren de 5 Pisos con Hellhound',
        description: 'Arquitectura NET con contraseña de acceso, archivo del manifiesto de carga y nodo de control de la torreta.',
        status: 'completado',
        sourceRulebook: 'Red Chrome Cargo Screamsheet (pág. 3)'
      },
      {
        name: 'Botín del Manifiesto y las 4 Cajas Blindadas de Hornet',
        description: 'Desglose de demoliciones, ciberware borg, armas pesadas y la neurotoxina Hornet-V3 con pago de 2,000 €$ por PJ.',
        status: 'completado',
        sourceRulebook: 'Red Chrome Cargo Screamsheet (pág. 3)'
      }
    ]
  }
];

// ============================================================================
// 3. ROADMAP DE FASES (0 A 5) Y ESTADO DE MÓDULOS PREMIUM
// ============================================================================

export interface PhaseRoadmapOverview {
  phaseId: string;
  name: string;
  versionSpan: string;
  status: 'COMPLETADO' | 'PENDIENTE' | 'EN_PROGRESO';
  badgeColor: string;
  description: string;
  keyDeliverables: string[];
}

export const PHASES_ROADMAP_OVERVIEW: PhaseRoadmapOverview[] = [
  {
    phaseId: 'fase_0',
    name: 'Fase 0: Cimientos, Ficha Real, Persistencia, Motor Matemático y Catálogo Core',
    versionSpan: 'v2.0 – v2.3',
    status: 'COMPLETADO',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    description: 'Establecimiento de los pilares del sistema: desacoplamiento modular estilo COMP/CON, motor de tirada en 2 pasos (1d10 explosivo + daño Xd6), heridas críticas en dobles de 6, ablación de SP y catálogo canónico de 272 ítems del Core v1.24.',
    keyDeliverables: [
      'Motor de combate de 2 clics (combatEngine.ts).',
      'Cálculo oficial de HP, Seriously Wounded (-2) y Humanidad (characterEngine.ts).',
      'Catálogo canónico de 272 ítems extraídos del Core v1.24 en data/core-rules.cprpack.json.',
      'Ficha compacta StreetLabView con persistencia Zustand en LocalStorage.',
      'HUD de combate táctico con telémetro colapsable y visualizador de cartuchos.'
    ]
  },
  {
    phaseId: 'fase_1',
    name: 'Fase 1: Maniquí Ripperdoc 2077, Machete de Reglas, Economía €$ e Inventario / Consola GM',
    versionSpan: 'v2.4 – v2.5',
    status: 'COMPLETADO',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    description: 'Ergonomía visual inspirada en Cyberpunk 2077 para el ripperdoc, drawer lateral de reglas canónicas persistente, cálculo de sobrepeso situacional por BODY y consola maestra GM Fixer Deck con PIN.',
    keyDeliverables: [
      'Maniquí holográfico en A-Pose con 8 zonas anatómicas y medidores de humanidad.',
      'Machete de reglas flotante RulesCheatSheetDrawer en 6 categorías filtrables.',
      'Regla oficial de sobrepeso según BODY * 10 con penalizador dinámico de -2 REF/DEX/MOVE.',
      'Consola de Director de Juego FixerDeckView con PIN de seguridad y monitor de equipo.'
    ]
  },
  {
    phaseId: 'fase_2',
    name: 'Fase 2: Disparos Apuntados, Creador Guiado, Biblioteca de Enemigos, Compendio y Expansiones',
    versionSpan: 'v2.6 – v2.9',
    status: 'COMPLETADO',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    description: 'Mecánicas de combate avanzado con disparos apuntados (-8 ROF 1), asistente guiado de creación de personajes de 6 pasos con Lifepath híbrido, biblioteca de 44 enemigos para el GM y compendio de 8 sistemas de expansión.',
    keyDeliverables: [
      'Selector de Disparos Apuntados con multiplicador x2 a cabeza, pierna rota y desarme.',
      'Creador de personajes guiado CharacterCreatorWizard con 17 pregenerados y deuda Selling Out.',
      'Biblioteca táctica de 44 enemigos y goons preconstruidos clasificados por amenaza y facción.',
      'Compendio de 8 nuevos sistemas de reglas de expansiones (FBC, 2077, Ciberpsicosis, etc.).',
      'Expansión del catálogo maestro a 368 ítems con sinopsis por libro.'
    ]
  },
  {
    phaseId: 'fase_3',
    name: 'Fase 3: Sistemas Profundos (Netrunning 2045, Quickhacks 2077, 10 Roles) & Módulos Premium',
    versionSpan: 'v3.0 – v3.4.5',
    status: 'COMPLETADO',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    description: 'Sistemas de alta complejidad: simulación de Pisos de Red 2045, consola de Quickhacks 2077 sin RAM (CEMK), estaciones de los 10 roles, garaje de vehículos con SDP, centro de mando de Red Chrome Cargo y 3 módulos premium.',
    keyDeliverables: [
      'Simulador piso a piso de Red 2045 con 8 presets y combate contra Black ICE.',
      'Consola de Quickhacking 2077 sin RAM con los 11 Quickhacks de CEMK.',
      'Estaciones interactivas con calculadoras para los 10 roles oficiales.',
      'Garaje y tracker de 14 vehículos con Structural Damage Points (SDP) y embestidas.',
      'Módulo Premium GOING METAL: 13 Cuerpos FBC, 16 cyberware borg y Linear Frame Omega.',
      'Módulo Premium CYBERFISTS OF FURY: 27 artes marciales y 54 movimientos especiales.',
      'Módulo Premium DANGER GAL DOSSIER: 128 PNJs en 15 facciones y creador de PNJs custom.',
      'Centro de Mando Oneshot RED CHROME CARGO con mapa del tren, screamsheet y 7 Edgerunners pregenerados.'
    ]
  },
  {
    phaseId: 'fase_4',
    name: 'Fase 4: Mini-VTT Táctico, Clima, Creador Homebrew, Audio/VFX y Expansiones Territoriales',
    versionSpan: 'v3.6 – v3.9',
    status: 'PENDIENTE',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    description: 'Entorno visual y táctico avanzado con rejilla 2x2m para combate en tablero, generador de condiciones climáticas de Night City, creador universal de homebrew con conversión 2020 a RED, efectos sonoros sintetizados y los 2 módulos premium territoriales y militares.',
    keyDeliverables: [
      'Mini-VTT táctico con rejilla 2x2m interactiva, tokens y regla vinculada a tabla de DVs.',
      'Generador de condiciones meteorológicas y clima (lluvia ácida, smog rojo, calor radiactivo).',
      'Creador universal de Homebrew con algoritmo de conversión oficial de Cyberpunk 2020 a RED.',
      'Efectos sonoros hápticos/auditivos de disparos, recargas y zumbidos de Sandevistan.',
      'Módulo Premium NIGHT CITY 2045: Mapa interactivo, 25 distritos, 700+ ubicaciones y 130 plot hooks.',
      'Módulo Premium SOLO OF FORTUNE: Armaduras de poder ACPA, 10 modelos ACPA y arsenal pesado militar.',
      '⚙️ Modo Settings & Modularidad Global: Conmutadores para activar/desactivar módulos (FBC, Garaje, Quickhacks 2077, Dojo, Netrunning).'
    ]
  },
  {
    phaseId: 'fase_5',
    name: 'Fase 5: Auditoría Integral del Sistema (UI, Mecánicas y Revisión de ~60 PDFs)',
    versionSpan: 'v4.0',
    status: 'PENDIENTE',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    description: 'Proceso formal de control de calidad y homologación exhaustiva de toda la biblioteca de PDFs oficiales de R. Talsorian Games, verificación de erratas y paseo interactivo funcional de la interfaz.',
    keyDeliverables: [
      'Guía formal de verificación y checklist de auditoría contra textos oficiales de RTG.',
      'Paseo interactivo funcional (Live UI Walkthrough) en todas las vistas de la app.',
      'Revisión manual por manual de los ~60 PDFs oficiales y DLCs incorporando erratas canónicas.',
      'Homologación total de identificadores únicos en los paquetes de datos .cprpack.json.'
    ]
  }
];

export interface PremiumModuleStatus {
  name: string;
  sourceBook: string;
  status: 'COMPLETADO' | 'PENDIENTE';
  badgeColor: string;
  summary: string;
  features: string[];
}

export const PREMIUM_MODULES_STATUS: PremiumModuleStatus[] = [
  {
    name: '1. GOING METAL (Auditoría de Paridad Completa)',
    sourceBook: 'Interface RED Vol. 3',
    status: 'COMPLETADO',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    summary: 'Módulo de conversión a cuerpo completo cibernético con la Biovaina (Biopod), los 13 chasis FBC oficiales, 16 implantes borg, About FBCs section y auditoría de paridad.',
    features: [
      '✅ Ya Implementado (Fase 3): Addition of Full Body Conversions y Biovaina (Biopod).',
      '✅ Ya Implementado (Fase 3): 13 FBC Bodies canónicos completos (Aquarius, Dragoon, Enforcer, Samson, Wingman, Gemini, Spyder, etc.).',
      '✅ Ya Implementado (Fase 3): 16 New Pieces of Cyberware adaptados a chasis cyborg.',
      '✅ Ya Implementado (Fase 3): About FBCs Section con reglas completas de instalación y lore.',
      '⏳ Pendiente de Cierre Going Metal: Verificar/añadir el New External Linear Frame específico si requiere individualización.',
      '⏳ Pendiente de Cierre Going Metal: Verificar/añadir el New Grenade Type específico de Going Metal.'
    ]
  },
  {
    name: '2. CYBERFISTS OF FURY (Artes Marciales Avanzadas)',
    sourceBook: 'Interface RED Vol. 4',
    status: 'COMPLETADO',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    summary: 'Módulo de combate cuerpo a cuerpo y artes marciales avanzadas integrado en el HUD de Combate con 23 nuevos estilos y 46 movimientos especiales.',
    features: [
      '23 nuevas formas y estilos marciales de Interface RED Vol. 4 (sumando 27 estilos totales con los 4 del Core).',
      '46 nuevos movimientos especiales (54 movimientos totales) integrados con chequeos de STATs y DVs.',
      'Llaves, proyecciones, golpes devastadores y combos con cálculo de armadura perforada.'
    ]
  },
  {
    name: '3. DANGER GAL DOSSIER (Facciones, NPCs & Tema Visual)',
    sourceBook: 'Danger Gal Dossier',
    status: 'COMPLETADO',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    summary: 'Expansión de agencias de detectives, facciones encubiertas, 128 PNJs oficiales en 15 facciones, creador de PNJs custom en Fixer Deck y tema visual neón Danger Gal.',
    features: [
      '128 PNJs oficiales clasificados por nivel de amenaza en 15 facciones en EnemiesCompendiumPanel.',
      'Flujo completo de creación de PNJs personalizados (Custom NPC Creator) en FixerDeckView.',
      'Tema visual "Danger Gal" (neón magenta/negro) y retratos oficiales de personajes.'
    ]
  },
  {
    name: '4. NIGHT CITY 2045 (Interactive Atlas & Campaign Gazetteer)',
    sourceBook: 'Night City 2045 (Fase 5 / Premium Expansion)',
    status: 'PENDIENTE',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    summary: 'Cartografía urbana interactiva de Night City en 2045 con navegación táctica SVG/Canvas, 25 distritos, 700+ ubicaciones, 73 facciones, 112 NPCs y 130 plot hooks.',
    features: [
      'Interactive map of Night City en SVG/Canvas con zoom táctico.',
      '700+ searchable Locations con ficha detallada y coordenadas.',
      '25 searchable Districts con límites territoriales.',
      'Ability to filter locations by medical, transportation, etc.',
      '73 searchable Factions, with their associated hangout locations on the interactive map.',
      '112 new NPCs, each with their corresponding district.',
      '130 plot hooks to inspire GMs and players.',
      'Interactive map automatically unlocks for your players while hosting an online session.',
      'Ability to add your own custom locations to the interactive map.',
      'Custom locations visible and searchable for players connected to online session.'
    ]
  },
  {
    name: '5. SOLO OF FORTUNE (ACPA Power Armor & Heavy Ordinance Expansion)',
    sourceBook: 'Solo of Fortune (Fase 5 / Premium Expansion)',
    status: 'PENDIENTE',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    summary: 'Exoesqueletos blindados ACPA (Assisted Combat Personnel Armor), taller modular de construcción ACPA, 10 modelos oficiales y armamento pesado bélico.',
    features: [
      'ACPA Armor Type (Assisted Combat Personnel Armor).',
      'Custom ACPA Builder para diseño y personalización de armaduras de poder.',
      '10 ACPAs oficiales listos para tripular y combatir.',
      '13 New Weapons militares de alto calibre.',
      '8 New Weapon Attachments tácticos para armamento ACPA.',
      '15 New Weapon Range Tables de combate pesado.',
      '12 New Ammunition & Explosives y munición pesada.',
      '3 New Armor Sets completos de blindaje táctico militar.',
      '10 New Pieces of Gear para operadores de blindaje asistido.'
    ]
  }
];

// ============================================================================
// 4. ARQUITECTURA TÉCNICA, STACK & AUDITORÍA DE DOCUMENTACIÓN
// ============================================================================

export interface ArchitectureDocSection {
  title: string;
  badge: string;
  description: string;
  codeSnippet?: string;
  details: string[];
}

export const ARCHITECTURE_AND_GUIDE_DOCS: ArchitectureDocSection[] = [
  {
    title: 'Stack Tecnológico & Filosofía Arquitectónica',
    badge: 'React 19 • TS 5.8 • Vite 6 • Tailwind v4 • Zustand 5',
    description: 'La aplicación está construida sobre una arquitectura completamente desacoplada estilo COMP/CON, donde las reglas estáticas y el catálogo canónico residen en módulos de datos tipados y paquetes .cprpack.json, mientras que la interfaz en src/features/ actúa como consumidor reactivo de stores Zustand con persistencia en LocalStorage.',
    details: [
      'React 19 & Vite 6: Renderizado ultra-rápido, HMR instantáneo y empaquetado optimizado.',
      'TypeScript 5.8: Tipado canónico estricto de cada regla, ítem, herida y estadística de Cyberpunk RED.',
      'Tailwind CSS v4: Estética militar táctica cyberpunk con chamfered corners y temas configurables (Neo-Red, 2077 Edgerunners, Danger Gal).',
      'Zustand 5: Estado global desacoplado con persistencia automática en LocalStorage sin sobrecargar el DOM.'
    ]
  },
  {
    title: 'Motor de Reglas & Matemáticas Canónicas',
    badge: 'characterEngine.ts & combatEngine.ts',
    description: 'Toda la matemática del sistema está centralizada en motores puros de TypeScript que no dependen de la interfaz gráfica, garantizando cero discrepancias reglamentarias:',
    details: [
      'Puntos de Golpe (HP): Fórmula oficial 10 + 5 * ceil((BODY + WILL) / 2).',
      'Seriously Wounded: Umbral en <= ceil(MaxHP / 2), aplicando automáticamente penalizador de -2 a todas las acciones con MOVE mínimo de 1.',
      'Tirada de Ataque en 2 Clics: STAT + Skill + 1d10 con explosión en 10 (+1d10 adicional) y pifia en 1 (-1d10 restado).',
      'Daño Independiente Xd6: Detección automática de dos o más 6s para aplicar Herida Crítica (+5 daño directo a HP) y tirada 2d6 en la tabla correspondiente.',
      'Ablación de SP: El daño que supera el SP penetra a HP y reduce el blindaje en 1 punto (o 2 con munición perforante AP).',
      'Disparos Apuntados: Penalizador automático de -8, ROF 1 estricto, daño x2 en cabeza, pierna rota y desarme.'
    ]
  },
  {
    title: 'Contrato de Paquetes de Datos (.cprpack.json)',
    badge: 'data/core-rules.cprpack.json',
    description: 'Los manuales y expansiones se estructuran como paquetes de datos canónicos autovalidados con metadatos de autoría y esquema de 8 categorías:',
    codeSnippet: `{\n  "packId": "cpr-core-rules-v1.24",\n  "name": "Cyberpunk RED Core Rulebook & Expansions",\n  "version": "2.2.0",\n  "author": "R. Talsorian Games / Omni-Deck Team",\n  "categories": [\n    "weapons", "armor", "gear", "cyberware",\n    "ammo", "net_programs", "street_drugs", "weapon_attachments"\n  ],\n  "items": [ /* 391 ítems canónicos */ ]\n}`,
    details: [
      'Cada ítem contiene: id, name, category, cost, sourceBook, description y propiedades técnicas específicas.',
      'Las armas incluyen category, damage, rof, standardMag, rangeTableKey y skillKey.',
      'El ciberware incluye installType, humanityLossRoll, slotType y requisitos de cirugía.',
      'Compatibilidad universal para agregar nuevos libros en el gestor DataPacksView sin alterar el código de la UI.'
    ]
  },
  {
    title: 'Estructura Modular de Carpetas en Disco',
    badge: 'src/ Layout',
    description: 'Distribución limpia y estricta de responsabilidades en el repositorio frontend/src/:',
    details: [
      'frontend/src/components/: Componentes atómicos reutilizables (ItemVisualPlaceholder, marcos tácticos).',
      'frontend/src/data/: Catálogos estáticos canónicos tipados (core-rules.cprpack.json, rangeTables, criticalInjuries, enemiesCatalog, etc.).',
      'frontend/src/engine/: Motores matemáticos puros (combatEngine.ts, characterEngine.ts).',
      'frontend/src/features/: Vistas funcionales modulares (combat, sheet, creator, cyberware, netroles, compendium, gm, oneshot, docs, rules).',
      'frontend/src/store/: Stores Zustand globales reactivos (useCharacterStore, useCombatStore).',
      'frontend/src/types/: Definiciones de interfaces canónicas de TypeScript (cyberpunk.ts).'
    ]
  }
];

// ============================================================================
// 5. RESUMEN DINÁMICO DE MÉTRICAS DEL SISTEMA
// ============================================================================

export interface SystemMetricsSummary {
  totalPackItems: number;
  totalEnemies: number;
  totalFactions: number;
  totalMartialArtsForms: number;
  totalFbcBodies: number;
  totalFbcCyberware: number;
  totalQuickhacks: number;
  totalVehicles: number;
  totalNetPresets: number;
  totalRoles: number;
}

export const SYSTEM_METRICS_SUMMARY: SystemMetricsSummary = {
  totalPackItems: (coreRulesPack as any)?.items?.length || 391,
  totalEnemies: ENEMIES_CATALOG.length,
  totalFactions: DANGER_GAL_15_FACTIONS.length,
  totalMartialArtsForms: MARTIAL_ARTS_FORMS.length,
  totalFbcBodies: FBC_13_BODIES.length,
  totalFbcCyberware: FBC_16_CYBERWARE.length,
  totalQuickhacks: QUICKHACKS_2077_CATALOG.length,
  totalVehicles: VEHICLES_CATALOG.length,
  totalNetPresets: NET_ARCHITECTURE_PRESETS.length,
  totalRoles: ROLES_INTERACTIVE_GUIDES.length
};
