import { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Layers,
  BookOpen,
  Code2,
  GitCommit,
  ChevronDown,
  ChevronUp,
  Boxes,
  Folder,
  Calendar,
  Filter,
  Info
} from 'lucide-react';
import {
  VERSION_CHANGELOG_HISTORY,
  type VersionChangelogEntry,
  ADDED_FEATURES_INVENTORY,
  PHASES_ROADMAP_OVERVIEW,
  PREMIUM_MODULES_STATUS,
  ARCHITECTURE_AND_GUIDE_DOCS,
  SYSTEM_METRICS_SUMMARY
} from '../../data/systemDocsAndChangelogData';

export const LOCAL_CHANGELOG_EXTENSIONS: VersionChangelogEntry[] = [
  {
    version: 'v4.3.1',
    date: '2026-10-20',
    phase: 'Codex',
    category: 'Datos de expansión',
    title: 'Datos CEMK canon: 13 armas, ciberware, Immunoblockers y Rebuilds de 1,000 €$',
    summary: 'Segunda fase del plan 2. Las armas, el ciberware y las drogas de CEMK tienen el costo, cargador y Humanity Loss del libro, y se borró lo inventado. Los Rebuilds cuestan 1,000 €$ y siguen las reglas de CEMK pp. 30-31. El Boosterganger usa los valores de la Errata.',
    highlights: [
      '13 armas de CEMK pp. 31-34 en un solo set; 6 armas inventadas borradas y Militech Crusher agregada.',
      'Neuroport 1,000 €$ y HL 7 (gratis al crear el personaje), Mantis Blade HL 14, Sandevistan de David 250,000 €$.',
      'Immunoblockers de CEMK p. 30; MaxDoc y BounceBack borradas.',
      'Rebuilds a 1,000 €$ y 2 ranuras, sin fabricación con Maker ni Ballistic Coprocessor.',
      'Boosterganger con BODY 2 y Death Save 2 (Errata p. 412).'
    ],
    filesTouched: [
      'frontend/src/data/core-rules.cprpack.json',
      'data/core-rules.cprpack.json',
      'frontend/src/data/weaponAndCyberwareTooltips.ts',
      'frontend/src/data/expansionRulesData.ts',
      'frontend/src/data/enemiesCatalog.ts',
      'frontend/src/engine/__tests__/rules.test.ts',
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/features/rules/RulesCheatSheetDrawer.tsx',
      'frontend/src/features/datapacks/DataPackManagerView.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'AI_CONTEXT_HANDOFF.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'CONTENT_CHECKLIST.md',
      'CHECKPOINT.md'
    ],
    metricsBadge: 'v4.3.1 • Datos CEMK • Plan 2 fase 2'
  },
  {
    version: 'v4.3.0',
    date: '2026-10-20',
    phase: 'Codex',
    category: 'Reglas de NET',
    title: 'NET y Quickhacks canon: 3 NET Actions, sin RAM, Black ICE del Core',
    summary: 'Primera fase del plan 2 (contenido canon de expansiones). Los Netrunners tienen hasta 3 NET Actions en cualquier rango, como dice CEMK. Los Quickhacks ya no usan RAM: alcance de 6, 8 o 50 m según el Cyberdeck y 1 por objetivo por turno. Los Black ICE, las dificultades de arquitectura y las acciones de Interface siguen el Core, y se borró el contenido inventado.',
    highlights: [
      'Hasta 3 NET Actions por turno en cualquier rango (CEMK p. 15).',
      'Quickhacks sin RAM; borrados 7 quickhacks inventados y los programas qh-* del pack.',
      'HUD: alcance según la conexión y un solo Quickhack por objetivo por turno (CEMK pp. 16, 26).',
      'Black ICE con PER/SPD/ATK/DEF/REZ del Core pp. 206-207 y dificultades Basic a Advanced.',
      'Scanner sin DV fijo, Flak y Shield con su efecto real, Checks que deben superar el DV (CEMK p. 5).'
    ],
    filesTouched: [
      'frontend/src/data/core-rules.cprpack.json',
      'data/core-rules.cprpack.json',
      'frontend/src/data/netAndRolesData.ts',
      'frontend/src/data/expansionRulesData.ts',
      'frontend/src/data/weaponAndCyberwareTooltips.ts',
      'frontend/src/data/enemiesCatalog.ts',
      'frontend/src/data/characterCreationData.ts',
      'frontend/src/data/systemDocsAndChangelogData.ts',
      'frontend/src/engine/combatEngine.ts',
      'frontend/src/engine/__tests__/rules.test.ts',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/features/netroles/NetAndRolesDeckView.tsx',
      'frontend/src/features/oneshot/RedChromeCargoView.tsx',
      'frontend/src/features/rules/RulesCheatSheetDrawer.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'AI_CONTEXT_HANDOFF.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'CONTENT_CHECKLIST.md',
      'CHECKPOINT.md'
    ],
    metricsBadge: 'v4.3.0 • NET canon • Plan 2 fase 1'
  },
  {
    version: 'v4.2.1',
    date: '2026-10-20',
    phase: 'Codex',
    category: 'Arquitectura y calidad',
    title: 'Carga por pestaña, calculadora de impactos en el motor y tests de reglas',
    summary: 'Quinta y última fase del plan de arreglos de la auditoría. La app carga cada módulo al abrir su pestaña (el bundle inicial baja de 2.1 MB a 598 kB), la calculadora de impactos vive en el motor de combate y hay tests automáticos que fijan las reglas canon con su página del Core. Se borró código y dependencias sin uso.',
    highlights: [
      'React.lazy por pestaña: bundle inicial de 2.126 kB a 598 kB.',
      'calculateIncomingImpact en combatEngine.ts: SP, ablación, cabeza x2/x3, crítico +5 y escudos.',
      '14 tests Vitest de reglas canon (npm test), cada uno con su página del libro.',
      'Eliminados DataPacksView.tsx, applyIncomingDamage, clsx y tailwind-merge.',
      'PIN del GM con clave versionada cpr_gm_pin_v1 y migración automática.'
    ],
    filesTouched: [
      'frontend/src/App.tsx',
      'frontend/src/engine/combatEngine.ts',
      'frontend/src/engine/__tests__/rules.test.ts',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/store/useCharacterStore.ts',
      'frontend/src/features/gm/FixerDeckView.tsx',
      'frontend/src/features/packs/DataPacksView.tsx (eliminado)',
      'frontend/package.json',
      'frontend/package-lock.json',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CLAUDE.md',
      '.agent/AGENTS.md',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'AI_CONTEXT_HANDOFF.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'CHECKPOINT.md'
    ],
    metricsBadge: 'v4.2.1 • Lazy loading + tests • Auditoría fase 5'
  },
  {
    version: 'v4.2.0',
    date: '2026-10-20',
    phase: 'Codex',
    category: 'Reglas de combate',
    title: 'Melee enfrentado, munición y autofire corregidos, quickhacks con WILL real',
    summary: 'Cuarta fase del plan de arreglos de la auditoría. El cuerpo a cuerpo deja el DV 13 fijo y pasa a ser enfrentado contra DEX + Evasion + 1d10 del defensor (Core p. 176). La munición se gasta después de validar el alcance, un Ataque Apuntado nunca usa autofire, los empates los gana el defensor en todos los módulos y los quickhacks usan la WILL del objetivo.',
    highlights: [
      'Melee, Brawling, Grab, Martial Arts y Cyberfists vs DEX + Evasion + 1d10 del defensor (Core p. 176).',
      'Brawling con Cyberarm: mínimo 2d6 (Core p. 176).',
      'Alcance validado antes de gastar munición; apuntado sin autofire.',
      'Multiplicador de autofire tomado del último ataque del arma.',
      'Jack In y Boot Out con WILL y Concentration editables del objetivo (CEMK p. 16).'
    ],
    filesTouched: [
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/engine/characterEngine.ts',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'AI_CONTEXT_HANDOFF.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'CHECKPOINT.md'
    ],
    metricsBadge: 'v4.2.0 • Combate unificado • Auditoría fase 4'
  },
  {
    version: 'v4.1.1',
    date: '2026-10-20',
    phase: 'Codex',
    category: 'Corrección de bugs de estado',
    title: 'FBC reversible, HP máximo único y parseo de Humanity Loss',
    summary: 'Tercera fase del plan de arreglos de la auditoría. Activar una Full Body Conversion ya no pisa BODY y MOVE base y desactivarla devuelve la armadura previa. El HP máximo usa el BODY efectivo en toda la app. Comprar ciberware ya no resta 267 de Humanidad por un "2d6 (7)", y munición, HP y transacciones validan sus valores.',
    highlights: [
      'FBC reversible: BODY y MOVE del chasis se aplican sin modificar los stats base; se restaura la armadura al desactivar.',
      'HP máximo con BODY efectivo en ficha, HUD, TopHudBar, Fixer Deck y acciones del store.',
      'Humanity Loss: "2d6 (7)" resta 7, "14 (4d6)" resta 14.',
      'Validaciones de munición, NaN y transacciones con saldo insuficiente.',
      'Stores persistidos con version y migrate para futuras migraciones.'
    ],
    filesTouched: [
      'frontend/src/store/useCharacterStore.ts',
      'frontend/src/store/useCombatStore.ts',
      'frontend/src/engine/characterEngine.ts',
      'frontend/src/types/cyberpunk.ts',
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/features/gm/FixerDeckView.tsx',
      'frontend/src/features/layout/TopHudBar.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'AI_CONTEXT_HANDOFF.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'CHECKPOINT.md'
    ],
    metricsBadge: 'v4.1.1 • Bugs del store • Auditoría fase 3'
  },
  {
    version: 'v4.1.0',
    date: '2026-10-20',
    phase: 'Codex',
    category: 'Reglas de heridas y muerte del Core Rulebook',
    title: 'Mortally Wounded, Death Saves, críticos automáticos y EMP por Humanidad',
    summary: 'Segunda fase del plan de arreglos de la auditoría. Con menos de 1 HP el personaje queda Mortally Wounded (-4 a todas las Acciones, -6 MOVE) y aparece el botón Tirar Death Save, que suma el penalizador base de los críticos y el acumulado de cada tirada (Core pp. 186, 188). La calculadora de impactos tira la Herida Crítica sola cuando el daño es crítico o el personaje ya estaba Mortally Wounded, y la EMP baja con cada decena de Humanidad perdida (Core p. 80).',
    highlights: [
      'Mortally Wounded: -4 a todas las Acciones y -6 MOVE (mínimo 1), Core p. 186.',
      'Botón Tirar Death Save: 1d10 + penalizador base + acumulado, menor que BODY para vivir, 10 natural falla (Core p. 188).',
      'Herida Crítica automática al aplicar un impacto crítico, o cualquier impacto estando Mortally Wounded (Core pp. 187-188).',
      'Cracked Skull: el daño a la cabeza se multiplica x3 (Core p. 188).',
      'EMP efectiva = mín(EMP, piso(Humanidad / 10)), Core p. 80.'
    ],
    filesTouched: [
      'frontend/src/engine/characterEngine.ts',
      'frontend/src/types/cyberpunk.ts',
      'frontend/src/store/useCharacterStore.ts',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'AI_CONTEXT_HANDOFF.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'CONTENT_CHECKLIST.md',
      'CHECKPOINT.md'
    ],
    metricsBadge: 'v4.1.0 • Death Saves Core p. 188 • Auditoría fase 2'
  },
  {
    version: 'v4.0.3',
    date: '2026-10-20',
    phase: 'Codex',
    category: 'Corrección de reglas contra el Core Rulebook',
    title: 'Tablas canon de Heridas Críticas, Neural Link y correcciones de datos',
    summary: 'Primera fase del plan de arreglos de la auditoría general. Las tablas de Heridas Críticas de cuerpo y cabeza se reescribieron según Core pp. 187-188 (la de cuerpo estaba desordenada, le faltaba Dismembered Hand y tenía una entrada inventada), y ahora se vuelve a tirar si el objetivo ya sufre esa herida. El Neural Link vuelve a su precio y nombre del Core (500eb, p. 111), la munición Smart sigue la regla de Core p. 346 y el Black ICE Asp tiene ATK 2 (p. 206).',
    highlights: [
      'Heridas Críticas de Cuerpo y Cabeza con orden, efectos, Quick Fix y Treatment de Core pp. 187-188.',
      'Re-tirada automática de críticos que el objetivo ya sufre (Core p. 187).',
      'Neural Link: 500eb, HL 2d6 (7), 5 Option Slots (Core p. 111).',
      'Munición Smart: Targeting Scope, segunda tirada 10 + 1d10 si fallas por 4 o menos (Core p. 346).',
      'Black ICE Asp con ATK 2 en el preset de arquitectura (Core p. 206).'
    ],
    filesTouched: [
      'frontend/src/data/criticalInjuries.ts',
      'frontend/src/store/useCharacterStore.ts',
      'frontend/src/data/core-rules.cprpack.json',
      'data/core-rules.cprpack.json',
      'frontend/src/data/characterCreationData.ts',
      'frontend/src/data/netAndRolesData.ts',
      'frontend/src/engine/characterEngine.ts',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CLAUDE.md',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'AI_CONTEXT_HANDOFF.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'CHECKPOINT.md'
    ],
    metricsBadge: 'v4.0.3 • Críticos canon Core pp. 187-188 • Auditoría fase 1'
  },
  {
    version: 'v4.0.2',
    date: '2026-10-20',
    phase: 'Codex',
    category: 'Canonical CEMK Quickhacking, Combat HUD Damage Calculator & Ergonomic Header Layout',
    title: 'CEMK Canonical Quickhacking (Zero RAM, 11 Quickhacks, 4-Step Combat Flow), Rediseño de Calculadora de Daño y Cabeceras HUD de Dos Filas',
    summary: 'Actualización técnica v4.0.2 con 3 mejoras canónicas fundamentales: 1) Purga total de la RAM de videojuego y transición 100% canónica a las reglas oficiales del TTRPG de Cyberpunk Edgerunners Mission Kit (pp. 16-18, 26-28, 39, 42) en netAndRolesData.ts, NetAndRolesDeckView.tsx, CombatHudView.tsx y RedChromeCargoView.tsx con catálogo estricto de los 11 Quickhacks oficiales (Simple: Impair Movement, Sonic Shock; Standard: Overheat, Short Circuit; Difficult: Cyberware Malfunction, Lure, Slow [1d6 MOVE], Synapse Burnout [3d6 HP] con auto-bypass de Firewall DV 6; Advanced: Puppet, Shard Ejection, System Reset), desbloqueo en Interface 1/2/3/4 y flujo canónico interactivo de 4 pasos (Jack In vs WILL, Romper Passwalls/Self-ICE, Ejecutar Quickhack y Expulsión/Boot Out); 2) Rediseño integral de la Calculadora de Daño e Impactos en CombatHudView eliminando los 8 botones preset fijos y reemplazándolos por un input numérico editable (0 a 200) con tipografía monospace y botones de ajuste fino -1 y +1; 3) Reorganización arquitectónica de CollapsibleHudCard en dos filas estructuradas (Fila 1: arrastre, colapso, título y headerRight como Restaurar Suerte; Fila 2: sub-barra de espacio S/M/L/Todo/-/+ solo cuando la tarjeta está desplegada) garantizando que títulos e iconos nunca se superpongan o recorten en pantallas de 3 columnas.',
    highlights: [
      'CEMK Canonical Quickhacking: Erradicación completa de la RAM de videojuego; implementación basada en 1 NET Action y catálogo estricto de los 11 Quickhacks oficiales.',
      'Flujo Canónico de 4 Pasos: Paso 1 (Jack In vs WILL), Paso 2 (Romper Passwalls / Self-ICE DV 6/8/10 con Auto-Bypass de Firewall base a Interface 3+), Paso 3 (Lanzar Quickhack) y Paso 4 (Contramedida de Expulsión del Objetivo).',
      'Desbloqueo Canónico CEMK p. 26: Simple (Interface 1+, DV 6), Standard (Interface 2+, DV 8), Difficult (Interface 3+, DV 10) y Advanced (Interface 4+, DV 12).',
      'Tiradas de Daño Automáticas: Cálculo y aplicación automática de 3d6 HP para Synapse Burnout y 1d6 MOVE para Slow en combate.',
      'Calculadora de Daño Ergonómica: Erradicación de los 8 presets [5..25] e introducción de campo numérico libre (0-200) con botones flotantes -1 y +1.',
      'Cabeceras HUD de Dos Filas: Separación de acciones críticas en Fila 1 y barra de tamaño de espacio en Fila 2, erradicando solapamientos de texto e iconos en paneles estrechos.'
    ],
    filesTouched: [
      'frontend/src/data/netAndRolesData.ts',
      'frontend/src/features/netroles/NetAndRolesDeckView.tsx',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/features/oneshot/RedChromeCargoView.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'AI_CONTEXT_HANDOFF.md'
    ],
    metricsBadge: 'v4.0.2 • CEMK Quickhacking Canonical & HUD Ergonomics • 100% Validado'
  },
  {
    version: 'v4.0.1',
    date: '2026-10-20',
    phase: 'Codex',
    category: 'STATS Tooltips Ergonomics, Canonical Medical Care & Netrunning GM Architecture Mode',
    title: 'Ergonomía de STATS Tooltips, Asistencia Médica Canónica (Enhanced Antibodies, Cryotank, Cryopump, Speedheal), Modo Master en Netrunning y Acciones de Interfaz con Selector DV',
    summary: 'Actualización técnica v4.0.1 con 5 mejoras y fixes clave: corrección de recorte de tooltips en el contenedor de estadísticas básicas (StreetLabView.tsx) reemplazando chamfer-card por bordes estándar y overflow-visible; especificación canónica exhaustiva de Estabilización (DV 10/13/15) y descanso natural con esfuerzo severo (0 HP); implementación interactiva de compra, curación y uso de Anticuerpos Mejorados (500 eb, 1 slot interno, 2 HL, 2x/3x BODY HP), Criotanque (5.000 eb compra, estancia 100 eb/día + 50 eb químicos, Medtech R4+ 50 eb químicos, 30 SDP, ignora penalizadores de heridas críticas), Criobomba (5.000 eb, congela salvadas de muerte por 1 hora por dosis con 50 eb químicos) y Speedheal (200 eb, BODY+WILL HP instantáneos) en Street Lab y HUD de Combate; protección del Netrunning mediante Modo Master (GM) que oculta por defecto las 9 arquitecturas y el botón + Añadir Piso a los jugadores; detalle exhaustivo de las 9 Acciones de Interfaz con tabla de resolución y selector interactivo de Target DV (6, 8, 10, 12, 13, 14), erradicando el bug DV 612; y documentación del Modo Settings & Modularidad Global para futuras fases.',
    highlights: [
      'Fix de Tooltips en STATS Básicos: Reemplazo de chamfer-card (cuyo clip-path recortaba el tooltip) por bordes redondeados y relative z-30 overflow-visible.',
      'Especificación Médica Exhaustiva: Reglas canónicas del Core pp. 140, 222-226 para Estabilización, reposo sin esfuerzo severo, Anticuerpos Mejorados, Criotanque, Criobomba y Speedheal.',
      'Botones Médicos Interactivos en Street Lab y Combat HUD: Compra/instalación de Enhanced Antibodies (500 eb / 2 HL), estancia hospitalaria en Criotanque (100 eb), suministros Medtech en Criotanque (50 eb) e inyección de Speedheal (BODY+WILL HP).',
      'Modo Master (GM) en Netrunning: Ocultación por defecto de las 9 arquitecturas y + Añadir Piso para jugadores; panel de punto de acceso simplificado y conmutador GM para edición y selección.',
      '9 Acciones de Interfaz con Resolución y Target DV: Desglose reglamentario canónico y barra selectora de Target DV (6, 8, 10, 12, 13, 14) eliminando la concatenación accidental DV 612.',
      'Roadmap del Modo Settings & Modularidad Global: Documentación técnica para conmutar módulos completos (FBC, Garaje, Quickhacks 2077, Dojo, Netrunning).'
    ],
    filesTouched: [
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/data/weaponAndCyberwareTooltips.ts',
      'frontend/src/data/netAndRolesData.ts',
      'frontend/src/features/netroles/NetAndRolesDeckView.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'frontend/src/data/systemDocsAndChangelogData.ts',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'AI_CONTEXT_HANDOFF.md'
    ],
    metricsBadge: 'v4.0.1 • Medical Systems & Netrunning GM Mode • 100% Validado'
  },
  {
    version: 'v4.0.0',
    date: '2026-10-19',
    phase: 'Codex',
    category: 'Weapon Attachments Engine, Maker Tech Upgrade Workshop, Armor +1 SP & Official Role/Tech Lifepath',
    title: 'Motor Canónico de Accesorios de Armas (13 Tipos), Taller Maker de Mejoras de Armas y Blindaje (+1 SP) y Lifepath de Rol Específico (10 Roles + Tech p. 55)',
    summary: 'Implementación canónica integral de la Fase 4 de CPR Omni-Deck: Sistema completo de los 13 accesorios de armas oficiales (Core pp. 342-344: Bayoneta con ataque melee 1d6 ROF 2, Cargadores Ampliado y Tambor con recálculo dinámico por categoría, Smartgun Link, Silenciador, Visor Infrarrojo/NV que ignora oscuridad/humo, Mirilla Telescópica que suma +1 a 51m+, Escopeta y Lanzagranadas acoplados con ataques secundarios balísticos en mano, y Rebuilds 2077 Power/Tech/Smart que consumen ranuras); Regla de 3 ranuras canónicas (0 en armas exóticas/melee); Taller interactivo de Especialización de Mejoras Tech Maker (Core p. 148: Calidad Excelente +1 ataque, +1 ranura extra, Ocultable, Optimización balística +1 daño/invención) con cálculo de coste de materiales (50% base), tabla de DV y tiempo requerido por coste, y tirada d10 vs DV oficial; Refuerzo de Blindaje Tech (+1 SP máx y actual en cabeza y cuerpo); y expansión del Lifepath a los 10 Roles con tablas canónicas y las 6 tablas completas del Tech Lifepath (Core p. 55).',
    highlights: [
      'Motor Canónico de Accesorios de Armas: Catálogo oficial de 13 accesorios (Bayonet, Extended Mag, Drum Mag, Smartgun Link, Silencer, IR/NV Scope, Sniping Scope, Underbarrel Shotgun, Underbarrel Grenade Launcher, etc.) con cálculo estricto de ranuras (3 máx, 0 en exóticas/melee).',
      'Ataques Secundarios de Accesorios Acoplados: Integración en Combat HUD de disparos y golpes para Bayoneta (1d6 Melee ROF 2), Escopeta Acoplada (3d6 Shells) y Lanzagranadas Acoplado (6d6) directamente desde el arma en mano.',
      'Cálculo Dinámico de Munición por Accesorio: Cargadores extendidos y de tambor recalculan la capacidad según la categoría y calibre exacto del arma con sincronización de estado.',
      'Taller Maker: Upgrade Expertise (Core p. 148): 4 mejoras de armas (Calidad Excelente +1 ataque, +1 ranura adicional, diseño ocultable, daño balístico/invención) y refuerzo de armadura (+1 SP máximo y actual) con deducción de eurodólares, tiempos y DVs por coste.',
      'Pase de Distancia al Desglose de Ataque: La mirilla telescópica aplica +1 al ataque automáticamente a distancias de 51m o superiores.',
      'Lifepath Específico de Rol (10 Roles): Preguntas y tablas canónicas para Rockerboy, Solo, Netrunner, Tech, Medtech, Media, Exec, Lawman, Fixer y Nomad con selectores y tiradas de dados individuales.',
      'Tech Lifepath Completo (Core p. 55): Modal interactivo con las 6 tablas oficiales (Especialidad, Socio vs Solo, Espacio de Trabajo, Clientes Principales, Proveedores y Quién te Busca).'
    ],
    filesTouched: [
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'AI_CONTEXT_HANDOFF.md'
    ],
    metricsBadge: 'v4.0.0 • Weapon Attachments, Tech Maker & Role Lifepath • Operativo'
  },
  {
    version: 'v3.9.0',
    date: '2026-10-19',
    phase: 'Codex',
    category: 'CEMK 2077 Weapon Rebuild Workshop, EMP Cyberware Manager, Role Rank 1-10 Progression, Resting & Armor Repair, Combat Clutter Filter',
    title: 'Taller de Reconstrucción CEMK 2077, Gestor de Averías/EMP, Progresión de Rol 1-10, Motor de Descanso/Reparación y Filtro de Decluttering del HUD',
    summary: 'Implementación integral de los 5 grandes sistemas operativos de v3.9.0: Taller interactivo de Reconstrucción CEMK 2077 para transformar armas base 2045 en sus análogos futuristas 2077 (Smart, Tech, Power) con toggles tácticos de combate (Bypass de Cobertura Smart, Rebote Power en esquinas, Disparo Cargado Tech); Gestor de Averías y Pulsos EMP en Ciberware con protocolo de resistencia TECH + Cybertech vs DV 15, desactivación selectiva por implante (insignia ⚡ EMP OFF) y neutralización dinámica de bonos a stats; Pestaña táctica de Progresión de Habilidad de Rol Rango 1-10 en StreetLabView con visualización de árbol de desbloqueos canónicos (ROLE_ABILITIES_COMPLETE_PROGRESSION); Pestaña y controles en vivo de Descanso Natural y Reparación de Blindaje (Core pp. 140, 222-223) con multiplicadores de anticuerpos mejorados y criotanque; y Sistema de Filtro de Decluttering persistente en la bandeja derecha del HUD de combate para silenciar y ocultar módulos secundarios a voluntad del usuario.',
    highlights: [
      'Taller de Reconstrucción de Armas CEMK 2077: Dropdown interactivo en StreetLab y Combat HUD para convertir armas 2045 a sus variantes 2077 (Malorian 3516, Arasaka Tamayura, Carnage, Crusher, etc.) con coste de conversión y sincronización de estado.',
      'Toggles Tácticos de Combate 2077: Modificadores activos en mano: Smart Cover Bypass (-4 al esquivar cobertura), Power Ricochet (-4 para impactar tras esquinas) y Tech Charge Shot (penetra 50% SP adicional).',
      'Gestor de Malfunciones & Pulso EMP: Control de impacto de pulso electromagnético en Ciberware con tirada de resistencia TECH + Cybertech + 1d10 vs DV 15, selector por implante y botón de reinicio maestro con telemetría en tiempo real.',
      'Progresión de Habilidad de Rol Rango 1-10: Nueva pestaña en StreetLabView con selector de rango activo, descripción mecánica, fórmulas de tirada y árbol de progresión completo para los 10 roles oficiales.',
      'Motor de Descanso Natural & Reparación de Blindaje: Recuperación de HP por días de reposo (BODY/día, ×2 con Enhanced Antibodies, +BODY con Cryotank) y panel de reparación de SP de cabeza y torso con tabla de DVs de Tech.',
      'Filtro de Decluttering de la Bandeja Derecha: Selector interactivo con persistencia local (cpr_combat_disabled_right_modules_v1) para ocultar o atenuar cualquiera de los 7 módulos tácticos laterales.',
      'Especificación Arquitectónica de Fase 4: Documentación del Master Control Deck del Árbitro para orquestación de las 10 Habilidades de Rol, iniciativa grupal y seguimiento de campaña.'
    ],
    filesTouched: [
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'PROJECT_STATUS_AND_ROADMAP.md',
      'AI_CONTEXT_HANDOFF.md'
    ],
    metricsBadge: 'v3.9.0 • Rebuild Workshop, EMP & Role Progression • Operativo'
  },
  {
    version: 'v3.8.0',
    date: '2026-10-19',
    phase: 'Codex',
    category: 'Weapons, Cyberware & Ammo Tooltips Engine, 2077 Rebuild System & Collapsible Martial Arts Deck',
    title: 'Motor Táctico de Tooltips para Armas, Ciberware y Municiones, Reconstrucción 2077 y Cartas Colapsables de Artes Marciales',
    summary: 'Integración integral de la biblioteca oficial de reglas y tooltips canónicos (weaponAndCyberwareTooltips.ts) en toda la suite táctica de Night City: StreetLabView, CombatHudView, NetAndRolesDeckView y CompendiumView. Incorpora insignias y modales explicativos para subclases de armas (Power, Tech, Smart, Exóticas, Melée pesada), insignias doradas de armas CEMK 2077 reconstruidas a partir de análogos clásicos 2045 con sus reglas especiales (penetración monomolecular, sobrecarga EMP, tracking inteligente), barra de municiones activas con selector táctico rápido (10 tipos canónicos con reglas y costes por caja), tooltips canónicos de ciberware clasificados por categoría anatómica/clínica, y rediseño ergonómico de las 27 formas de Artes Marciales a tarjetas colapsables compactas.',
    highlights: [
      'Motor de Tooltips de Armas: Detección canónica de subclases de armas con explicaciones de reglas balísticas, modo de disparo y blindaje.',
      'Sistema de Reconstrucción CEMK 2077: Insignias doradas y tooltips dedicados para armas 2077 adaptadas de bases 2045 (ej. Malorian Arms 3516, Arasaka Tamayura, Budget Arms Carnage, Militech Crusher).',
      'Selector Rápido de Municiones en Arsenal y HUD: Barra interactiva de 10 municiones canónicas (Basic, AP, Expansive, Incendiary, Smart, Rubber, EMP, Biotoxin, Poison, Sleep) con actualización de tipo de munición y popup de coste/efecto.',
      'Tooltips Canónicos de Ciberware: Categorización contextual anatómica (Neuroport, Neuralware, Cyberoptics, Cyberaudio, Cyberarm, Cyberleg, Internal/External Cyberware, Borgware) con coste de HL e instalación requerida.',
      'Artes Marciales Colapsables (27 estilos): Cabeceras ultracompactas con fórmula estándar "Nombre • Stats (DEX x2 • ROF 2 • 50% SP) • Fuente" y despliegue interactivo en StreetLab, Combat HUD y Net & Roles Deck.',
      'Sincronización Total en Compendio: Vistas de tarjetas y tabla enriquecidas con tooltips balísticos de munición, clasificación de ciberware y subclases de armas.',
      'Espacio de Trabajo de Combate Limpio: Inicialización de sesión con centro táctico despejado (cpr_combat_active_center_v3) para máxima adaptabilidad operativa.'
    ],
    filesTouched: [
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/features/roles/NetAndRolesDeckView.tsx',
      'frontend/src/features/compendium/CompendiumView.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'PROJECT_STATUS_AND_ROADMAP.md'
    ],
    metricsBadge: 'v3.8.0 • Tooltips Engine & 2077 Rebuild • Operativo'
  },
  {
    version: 'v3.7.0',
    date: '2026-10-18',
    phase: 'Codex',
    category: 'CEMK 2077 Folio Premades Roster, 28-Page Canonical Skills & Red Chrome Cargo Hub',
    title: 'Integración Canónica de los 7 Folios Oficiales CEMK 2077, Dossier de 4 Páginas y Roster Dual en Red Chrome Cargo',
    summary: 'Conversión e integración 100% canónica de los 7 personajes pregenerados oficiales del Cyberpunk: Edgerunners Mission Kit (Hardpoint Solo, Wrench Nomad, Connect Fixer, Bluescreen/Scribe Netrunner, Insurance/Retro Medtech, Thorn/Bullseye Rockerboy, Maven/Slider Tech) a partir de las 28 páginas oficiales de CEMK-Edgerunners-Character-Folios-Letter_2024-05-22.pdf. Incluye tokens oficiales en public/tokens/cemk, matriz completa de 66 habilidades por folio (LVL + STAT = BASE), armamento 2077 con propiedades especiales Power/Tech/Smart weapons, suite universal Neuroport 2077, 4ta pestaña en Red Chrome Cargo con selector de roster dual (Folios CEMK vs Banda del Anime Edgerunners), y dossier canónico desplegable de 4 páginas en StreetLabView.',
    highlights: [
      'Ingesta canónica de los 7 Folios oficiales CEMK (28 páginas): Hardpoint, Wrench, Connect, Bluescreen, Insurance, Thorn y Maven.',
      'Matriz oficial de 66 habilidades por personaje con cálculo estricto LVL Entrenado + Valor STAT = BASE Canónica.',
      'Arsenal y Ciberware 2077 con reglas especiales: armas Power (ricochet/críticos +5), Mantis Blades monomoleculares (ignora 50% SP), implantes Berserk Moore Tech, Gorilla Arms y suite universal Neuroport 2077.',
      'Tokens oficiales integrados en public/tokens/cemk y visualizados en avatares tácticos de StreetLabView y RedChromeCargoView.',
      'Cuarta pestaña en Red Chrome Cargo (4. 👥 PREMADES 2077) con selector dual: Roster Oficial CEMK Folios (7 PJs) vs Banda del Anime (7 PJs).',
      'Modal de Dossier Canónico de 66 habilidades con buscador en tiempo real, filtros por STAT y selección de PJ a un clic.',
      'Acordeón prominente en StreetLabView: Dossier Oficial CEMK Folio (4 páginas: 66 skills, reglas de rol, arsenal y biografía).',
      'Mecanismo de sincronización y restauración segura en useCharacterStore (syncOrRestoreCemkFolioCharacters) con persistencia en localStorage sin afectar fichas de usuario.'
    ],
    filesTouched: [
      'frontend/src/data/cemkFolioPremadesData.ts',
      'frontend/src/store/useCharacterStore.ts',
      'frontend/src/features/oneshot/RedChromeCargoView.tsx',
      'frontend/src/features/sheet/StreetLabView.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'PROJECT_STATUS_AND_ROADMAP.md'
    ],
    metricsBadge: 'v3.7.0 • CEMK 2077 Folio Roster & Dossier • 0 Drift'
  },
  {
    version: 'v3.6.2',
    date: '2026-10-18',
    phase: 'Codex',
    category: 'Combat HUD Ergonomics, Visual SP/SDP Plates, Damage Calculator & Workspace Sizing',
    title: 'Matriz Visual de SP y SDP, Calculadora Táctica de Daño y Controles de Ancho de Workspace',
    summary: 'Implementación de placas de blindaje visuales e interactivas (🛡️/💥) para Cabeza y Torso con click directo para fijar SP, rastreador de SDP de Escudo y Coberturas con presets oficiales, Calculadora Táctica de Impactos con previsualización en vivo según tipo de ataque y localización, acordeón de reglas oficiales de blindaje CP RED (pp. 183-187), selector de ancho de columna izquierda (3, 4, 5 columnas) con redimensionamiento reactivo de columna central, y controles de altura/auto-expansión inteligente con mouse resize handle.',
    highlights: [
      'Placas de blindaje tácticas interactivas con badges 🛡️/💥 para Cabeza y Torso con ajuste 1-click.',
      'Rastreador de Coberturas y Escudo Antibalas con SDP dedicado, presets (10, 15, 25, 35 SDP) y persistencia local.',
      'Calculadora Táctica de Daño en tiempo real: soporte para munición estándar (-1 SP), perforante AP (-2 SP), melee (50% SP), artes marciales (50% SP), brawling (100% SP) y daño directo (0% SP).',
      'Previsualización reactiva de ablación de SP, pérdida de SDP y daño neto a HP con cálculo de multiplicador de cabeza (×2) y críticos (+5 HP).',
      'Acordeón oficial de reglas CP RED integrado explicando la mecánica de ablación de SP, daño penetrante y absorción de escudos.',
      'Controles de Workspace: selector de ancho de columna izquierda (3 Cols, 4 Cols, 5 Cols) con cálculo dinámico para el centro.',
      'Controles de altura en tarjetas del panel izquierdo (S 160px, M 280px, L 480px, Todo, +/-, y grip de arrastre vertical 📏).',
      'Auto-expansión inteligente con badge 🔓 Auto-expandido para heridas críticas, ciberware y consumibles.'
    ],
    filesTouched: [
      'frontend/src/features/combat/CombatHudView.tsx',
      'frontend/src/features/docs/SystemChangelogAndDocsView.tsx',
      'CHANGELOG_AND_ARCHITECTURE.md',
      'PROJECT_STATUS_AND_ROADMAP.md'
    ],
    metricsBadge: 'v3.6.2 • SP/SDP Plates & Calculator • 0 Drift'
  },
  {
    version: 'v3.6.1',
    date: '2026-10-18',
    phase: 'Codex',
    category: 'Combat HUD Optimization & Modular Layout Architecture',
    title: 'Optimización de Columna Central y Bandeja Táctica Lateral',
    summary: 'Mejoras en la disposición de módulos modulares en el HUD de combate, desacoplamiento de paneles de telemetría y consolidación de presets tácticos.',
    highlights: [
      'Persistencia optimizada de posiciones de módulos centrales y bandeja lateral.',
      'Docking avanzado de consola de telemetría (inline, split lateral y ventana flotante mini-HUD PIP).',
      'Integración con drawer de Bestiario y Encuentros GM sin bloquear el flujo táctico.'
    ],
    filesTouched: [
      'frontend/src/features/combat/CombatHudView.tsx'
    ],
    metricsBadge: 'v3.6.1 • HUD Layout & Docking • Operativo'
  },
  {
    version: 'v3.6.0',
    date: '2026-10-18',
    phase: 'Codex',
    category: 'Modular Combat HUD 3-Zone Architecture & Tactical Presets',
    title: 'Arquitectura Modular de Combate en 3 Zonas y Presets Tácticos',
    summary: 'Reestructuración completa del HUD de Combate en 3 columnas maestras reordenables: Bio & Defensas a la izquierda, Zona Central configurable por drag-and-drop, y Bandeja Lateral plegable de módulos tácticos.',
    highlights: [
      'Drag and drop completo para reordenar módulos tanto en la columna izquierda como en el centro.',
      'Presets de configuración rápida en 1 clic (Esencial Tiro, Melee & Brawl, Netrunner Táctico, Maestro GM).',
      'Persistencia total en localStorage de colapsos, orden de módulos y paneles anclados.'
    ],
    filesTouched: [
      'frontend/src/features/combat/CombatHudView.tsx'
    ],
    metricsBadge: 'v3.6.0 • 3-Zone HUD • Modular Drag & Drop'
  }
];

const FULL_VERSION_CHANGELOG: VersionChangelogEntry[] = [
  ...LOCAL_CHANGELOG_EXTENSIONS,
  ...VERSION_CHANGELOG_HISTORY
];

type ActiveDocsTab = 'changelog' | 'inventory' | 'roadmap' | 'architecture';

export function SystemChangelogAndDocsView() {
  const [activeTab, setActiveTab] = useState<ActiveDocsTab>('changelog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('Todas');
  const [expandedVersions, setExpandedVersions] = useState<Record<string, boolean>>({
    'v4.3.1': true,
    'v4.3.0': true,
    'v4.2.1': true,
    'v4.2.0': true,
    'v4.1.1': true,
    'v4.1.0': true,
    'v4.0.3': true,
    'v4.0.2': true,
    'v4.0.1': true,
    'v4.0.0': true,
    'v3.9.0': true,
    'v3.8.0': true,
    'v3.7.0': true,
    'v3.6.2': true,
    'v3.6.1': true,
    'v3.6.0': true,
    'v3.5.0': true,
    'v3.4.5': true,
    'v3.4.0': true
  });
  const [expandedInventoryCards, setExpandedInventoryCards] = useState<Record<string, boolean>>({
    combat_engine: true,
    character_creator: true
  });

  const toggleVersionExpand = (version: string) => {
    setExpandedVersions((prev) => ({
      ...prev,
      [version]: !prev[version]
    }));
  };

  const toggleInventoryExpand = (id: string) => {
    setExpandedInventoryCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtrado reactivo de versiones
  const filteredChangelogs = useMemo(() => {
    return FULL_VERSION_CHANGELOG.filter((item) => {
      const matchesPhase = selectedPhaseFilter === 'Todas' || item.phase === selectedPhaseFilter;
      if (!matchesPhase) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.version.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.highlights.some((h) => h.toLowerCase().includes(q)) ||
        item.filesTouched.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [selectedPhaseFilter, searchQuery]);

  // Filtrado de inventario
  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) return ADDED_FEATURES_INVENTORY;
    const q = searchQuery.toLowerCase();
    return ADDED_FEATURES_INVENTORY.filter(
      (sys) =>
        sys.title.toLowerCase().includes(q) ||
        sys.summary.toLowerCase().includes(q) ||
        sys.componentView.toLowerCase().includes(q) ||
        (sys.engineModule && sys.engineModule.toLowerCase().includes(q)) ||
        sys.subsystems.some((sub) => sub.name.toLowerCase().includes(q) || sub.description.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const phaseTabs: Array<{ id: string; label: string }> = [
    { id: 'Todas', label: 'Todas las Fases' },
    { id: 'Codex', label: 'v3.5.0 Codex' },
    { id: 'Oneshot', label: 'v3.4.5 Oneshot' },
    { id: 'Fase 3', label: 'Fase 3' },
    { id: 'Fase 2', label: 'Fase 2' },
    { id: 'Fase 1', label: 'Fase 1' },
    { id: 'Fase 0', label: 'Fase 0' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* CABECERA PRINCIPAL ESTILO CODEX TÁCTICO */}
      <div className="relative border border-[#1f2438] bg-[#0d0e15] p-6 chamfer-4 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold tracking-widest uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                SYSTEM CODEX // DOCUMENTACIÓN MAESTRA
              </span>
              <span className="px-2 py-0.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> v4.0.0 OPERATIVO
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-tech font-bold text-white tracking-wider flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-cyan-400" />
              SISTEMA, ARQUITECTURA & CHANGELOG MAESTRO
            </h1>
            <p className="text-sm text-[#94a3b8] max-w-3xl leading-relaxed">
              Auditoría integral versión por versión de CPR Omni-Deck (v1.0.0 a v4.0.0), inventario de los 8 grandes
              módulos interactivos, estado del roadmap de Fases (0 a 5) con paridad de la Companion App, y especificación técnica de contratos.
            </p>
          </div>

          {/* TARJETA DE MÉTRICAS RÁPIDAS EN VIVO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#12141f] border border-[#1f2438] p-3 chamfer-2">
            <div className="text-center px-2 py-1">
              <div className="text-xs text-[#64748b] font-mono uppercase">Ítems Pack</div>
              <div className="text-lg font-mono font-bold text-cyan-400">{SYSTEM_METRICS_SUMMARY.totalPackItems}</div>
            </div>
            <div className="text-center px-2 py-1 border-l border-[#1f2438]">
              <div className="text-xs text-[#64748b] font-mono uppercase">PNJs & Bosses</div>
              <div className="text-lg font-mono font-bold text-rose-400">{SYSTEM_METRICS_SUMMARY.totalEnemies}</div>
            </div>
            <div className="text-center px-2 py-1 border-l border-[#1f2438]">
              <div className="text-xs text-[#64748b] font-mono uppercase">Artes Marciales</div>
              <div className="text-lg font-mono font-bold text-amber-400">{SYSTEM_METRICS_SUMMARY.totalMartialArtsForms}</div>
            </div>
            <div className="text-center px-2 py-1 border-l border-[#1f2438]">
              <div className="text-xs text-[#64748b] font-mono uppercase">Cuerpos FBC</div>
              <div className="text-lg font-mono font-bold text-emerald-400">{SYSTEM_METRICS_SUMMARY.totalFbcBodies}</div>
            </div>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA INSTANTÁNEA GLOBAL */}
        <div className="mt-6 pt-4 border-t border-[#1f2438] flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por versión, mecánica, arma, FBC, Quickhack o PNJ..."
              className="w-full bg-[#12141f] border border-[#23283b] text-sm text-[#e2e8f0] pl-9 pr-4 py-2 chamfer-2 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-[#475569]"
            />
          </div>

          <div className="text-xs text-[#64748b] font-mono flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-500" />
            <span>Filtro activo sobre {filteredChangelogs.length} versiones y {filteredInventory.length} módulos</span>
          </div>
        </div>
      </div>

      {/* PESTAÑAS NAVEGABLES DEL PORTAL */}
      <div className="flex border-b border-[#1f2438] gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('changelog')}
          className={`flex items-center gap-2 px-5 py-3 font-tech text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'changelog'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-bold'
              : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#12141f]'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>HISTORIAL DE VERSIONES (CHANGELOG v1.0 – v3.5)</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-[#1c2235] rounded text-cyan-400">
            {VERSION_CHANGELOG_HISTORY.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-5 py-3 font-tech text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20 font-bold'
              : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#12141f]'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>INVENTARIO COMPLETO DE SISTEMAS</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-[#1c2235] rounded text-amber-400">
            {ADDED_FEATURES_INVENTORY.length} Módulos
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-5 py-3 font-tech text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20 font-bold'
              : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#12141f]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>ROADMAP DE FASES (0–5) & MÓDULOS PREMIUM</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono bg-[#1c2235] rounded text-emerald-400">
            Fases 0..3 OK
          </span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-5 py-3 font-tech text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'border-rose-400 text-rose-300 bg-rose-950/20 font-bold'
              : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#12141f]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>ARQUITECTURA & CONTRATOS TÉCNICOS</span>
        </button>
      </div>

      {/* CONTENIDO 1: HISTORIAL DE VERSIONES (CHANGELOG) */}
      {activeTab === 'changelog' && (
        <div className="space-y-4">
          {/* Subfiltro de Fases */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0e1017] border border-[#1f2438] p-2.5 chamfer-2">
            <span className="text-xs text-[#64748b] font-mono uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filtrar Fase:
            </span>
            {phaseTabs.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseFilter(phase.id)}
                className={`px-3 py-1 text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  selectedPhaseFilter === phase.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-[#151824] text-[#64748b] border border-transparent hover:text-[#cbd5e1] hover:bg-[#1a1e2d]'
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>

          {/* Línea de tiempo de versiones */}
          <div className="space-y-3">
            {filteredChangelogs.length === 0 ? (
              <div className="p-8 text-center border border-[#1f2438] bg-[#0d0e15] chamfer-2 text-[#64748b]">
                No se encontraron versiones que coincidan con la búsqueda "{searchQuery}".
              </div>
            ) : (
              filteredChangelogs.map((item) => {
                const isExpanded = expandedVersions[item.version] ?? false;
                return (
                  <div
                    key={item.version}
                    className="border border-[#1f2438] bg-[#0e1018] chamfer-2 hover:border-[#2d354e] transition-all overflow-hidden"
                  >
                    {/* Fila de cabecera de versión */}
                    <div
                      onClick={() => toggleVersionExpand(item.version)}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-[#131722] transition-colors"
                    >
                      <div className="flex items-start md:items-center gap-3">
                        <span className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                          {item.version}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm md:text-base font-tech font-bold text-white tracking-wide">
                              {item.title}
                            </span>
                            <span className="px-2 py-0.2 text-[11px] font-mono bg-[#181c2b] text-[#94a3b8] border border-[#262c42]">
                              {item.phase}
                            </span>
                          </div>
                          <div className="text-xs text-[#64748b] font-mono flex items-center gap-2 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{item.date}</span>
                            <span>•</span>
                            <span>{item.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        <span className="text-xs font-mono px-2 py-0.5 bg-[#161a29] text-cyan-400 border border-[#232a3f]">
                          {item.metricsBadge}
                        </span>
                        <button className="text-[#64748b] hover:text-cyan-400 p-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Detalle expandible */}
                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-[#181c2b] bg-[#0b0c13] space-y-3">
                        <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed pt-3">
                          {item.summary}
                        </p>

                        <div className="space-y-1.5">
                          <div className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-wider">
                            Puntos Destacados & Novedades Mecánicas:
                          </div>
                          <ul className="space-y-1">
                            {item.highlights.map((h, idx) => (
                              <li key={idx} className="text-xs text-[#94a3b8] flex items-start gap-2">
                                <span className="text-cyan-400 mt-0.5">•</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Archivos tocados */}
                        <div className="pt-2 border-t border-[#151926]">
                          <div className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Folder className="w-3 h-3 text-cyan-500" /> Archivos Modificados / Creados:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.filesTouched.map((f, fIdx) => (
                              <span
                                key={fIdx}
                                className="px-2 py-0.5 text-[10px] font-mono bg-[#141724] border border-[#20273c] text-[#cbd5e1]"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO 2: INVENTARIO COMPLETO DE SISTEMAS */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#0e1017] border border-[#1f2438] chamfer-2 text-xs text-[#94a3b8] flex items-center justify-between">
            <span>
              Inventario de los <strong>8 grandes bloques arquitectónicos</strong> construidos en la aplicación. Cada
              bloque enumera sus subsistemas con estado oficial y libro de referencia.
            </span>
            <span className="font-mono text-cyan-400 font-bold">{filteredInventory.length} Módulos Activos</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredInventory.map((sys) => {
              const isExpanded = expandedInventoryCards[sys.id] ?? false;
              return (
                <div
                  key={sys.id}
                  className="border border-[#1f2438] bg-[#0d0f17] chamfer-2 hover:border-[#2f3752] transition-all overflow-hidden"
                >
                  <div
                    onClick={() => toggleInventoryExpand(sys.id)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-[#121522] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-tech font-bold text-white tracking-wider">
                          {sys.title}
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                          {sys.componentView}
                        </span>
                        {sys.engineModule && (
                          <span className="px-2 py-0.5 text-xs font-mono bg-[#181c2c] text-[#94a3b8] border border-[#252c44]">
                            {sys.engineModule}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94a3b8] max-w-4xl line-clamp-2 md:line-clamp-none">
                        {sys.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <span className="px-2.5 py-1 text-xs font-mono font-bold bg-[#141827] text-amber-300 border border-amber-500/30">
                        {sys.liveMetricBadge}
                      </span>
                      <button className="text-[#64748b] hover:text-cyan-400 p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-[#181d2d] bg-[#090b10] space-y-3">
                      <div className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-wider pt-3">
                        Subsistemas y Mecánicas Reglamentarias Integradas ({sys.subsystems.length}):
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {sys.subsystems.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 bg-[#0f111a] border border-[#1b2030] chamfer-1 space-y-1"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-tech font-bold text-[#e2e8f0] flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                {sub.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 uppercase">
                                {sub.status}
                              </span>
                            </div>
                            <p className="text-xs text-[#94a3b8] leading-relaxed">
                              {sub.description}
                            </p>
                            <div className="text-[10px] font-mono text-[#64748b] pt-1 border-t border-[#161a29]">
                              Fuente: {sub.sourceRulebook}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENIDO 3: ROADMAP DE FASES (0–5) & MÓDULOS PREMIUM */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Fases del Omni-Deck */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                PLAN MAESTRO // 6 FASES ARQUITECTÓNICAS
              </span>
              <span className="text-xs text-[#64748b] font-mono">Fases 0 a 3 Completadas al 100%</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {PHASES_ROADMAP_OVERVIEW.map((phase) => (
                <div
                  key={phase.phaseId}
                  className="border border-[#1f2438] bg-[#0d0f17] p-5 chamfer-2 space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-tech font-bold text-white tracking-wide">
                        {phase.name}
                      </h3>
                      <span className="px-2 py-0.5 text-xs font-mono bg-[#181c2c] text-[#cbd5e1] border border-[#272e45]">
                        {phase.versionSpan}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 text-xs font-mono font-bold border ${phase.badgeColor}`}>
                      {phase.status}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed">
                    {phase.description}
                  </p>

                  <div className="pt-2 border-t border-[#181d2e]">
                    <div className="text-[11px] font-mono font-bold text-[#64748b] uppercase tracking-wider mb-1.5">
                      Entregables y Metas Clave:
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {phase.keyDeliverables.map((d, dIdx) => (
                        <li key={dIdx} className="text-xs text-[#cbd5e1] flex items-start gap-2">
                          <span className={phase.status === 'COMPLETADO' ? 'text-emerald-400' : 'text-amber-400'}>
                            {phase.status === 'COMPLETADO' ? '✓' : '○'}
                          </span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Módulos Premium Companion App */}
          <div className="space-y-3 pt-4 border-t border-[#1f2438]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase bg-amber-950/80 text-amber-400 border border-amber-500/30">
                💎 PARIDAD COMPANION APP // 5 MÓDULOS PREMIUM
              </span>
              <span className="text-xs text-[#64748b] font-mono">3 Integrados • 2 Planeados (Fase 5 / Premium Expansion)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PREMIUM_MODULES_STATUS.map((mod, mIdx) => (
                <div
                  key={mIdx}
                  className="border border-[#1f2438] bg-[#0c0e15] p-4 chamfer-2 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-tech font-bold text-white tracking-wide">
                        {mod.name}
                      </h4>
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border ${mod.badgeColor}`}>
                        {mod.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-cyan-400">
                      Fuente: {mod.sourceBook}
                    </div>

                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      {mod.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#181d2e] space-y-1">
                    {mod.features.map((feat, fIdx) => (
                      <div key={fIdx} className="text-[11px] text-[#cbd5e1] flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO 4: ARQUITECTURA TÉCNICA & CONTRATOS */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                title: 'FASE 4 // ARQUITECTURA DEL GM ROLE MASTER CONTROL DECK',
                badge: 'FASE 4 • ROADMAP & SPECS TÉCNICAS',
                description: 'Especificación de ingeniería para la consola de mando del Árbitro: orquestación de las 10 Habilidades de Rol oficiales de Cyberpunk RED, combinada con Tracker Táctico de Iniciativa multi-participante, inyección reactiva de amenazas desde Danger Gal Dossier y control de cronogramas de fabricación y terapia.',
                codeSnippet: `// Contrato de Integración de Habilidades de Rol en Consola GM (Fase 4)
export interface GmRoleMasterControlState {
  // Solo: Detección y priorización de amenazas en telemetría
  soloCombatAwareness: { activeThreats: string[]; spotterBonus: number };
  // Netrunner: Arquitectura de Red activa, topología de pisos y Black ICE
  netrunnerTopology: { activeArchitectureId: string; currentFloor: number; iceAlertLevel: 'low' | 'alert' | 'lockdown' };
  // Tech: Tiempos de fabricación Maker (Jury Rig, Field Upgrade, Fabrication, Invention)
  techTimers: Array<{ itemId: string; daysRemaining: number; techDv: number; projectType: string }>;
  // Medtech: Lotes de fármacos y crioterapia activa
  medtechBatches: Array<{ patientName: string; therapyDaysLeft: number; pharmaceuticals: string[] }>;
  // Lawman & Exec: Backup response timers y nóminas de operativos corporativos
  lawmanBackupTimer: { turnsUntilArrival: number; backupTier: number } | null;
  execTeamLoyalty: Array<{ memberId: string; loyaltyScore: number; monthlyCost: number }>;
  // Fixer & Rockerboy: Arbitraje de alcance de mercado negro y favor de multitudes
  fixerOperatorMarket: { availableTiers: string[]; haggleMargin: number };
  rockerboyCrowdFavor: { audienceSize: number; currentVenueTier: number; activeFavor: string };
}`,
                details: [
                  'Orquestación de las 10 Habilidades de Rol: Arbitraje centralizado de Combat Awareness (Solo), Interface (Netrunner), Maker (Tech), Medicine (Medtech), Credibility (Media), Teamwork (Exec), Backup (Lawman), Operator (Fixer), Moto (Nomad) y Charismatic Impact (Rockerboy).',
                  'Tracker Táctico de Iniciativa Multi-Participante: Integración fluida entre personajes de jugadores, goons procedurales y bosses de Danger Gal Dossier.',
                  'Generador de Encuentros & Peligro Urbano: Tablas de calor por zona de Night City (Executive Zone, Upper Marina, Watson Sub-Districts, Combat Zone) con tiradas climáticas y de radiación.',
                  'Gestor de Deuda, Alquiler y Estilo de Vida: Cobro automatizado de rentas (Cargo Container, Cube Hotel, Studio, Penthouse) y liquidación de cuotas corporativas.'
                ]
              },
              ...ARCHITECTURE_AND_GUIDE_DOCS
            ].map((doc, idx) => (
              <div
                key={idx}
                className="border border-[#1f2438] bg-[#0d0f17] p-5 chamfer-2 space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h3 className="text-base font-tech font-bold text-white tracking-wide">
                    {doc.title}
                  </h3>
                  <span className="px-2.5 py-0.5 text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    {doc.badge}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed">
                  {doc.description}
                </p>

                {doc.codeSnippet && (
                  <pre className="p-3 bg-[#08090e] border border-[#1a1f30] text-xs font-mono text-emerald-400 overflow-x-auto rounded">
                    <code>{doc.codeSnippet}</code>
                  </pre>
                )}

                <ul className="space-y-1.5 pt-2 border-t border-[#181d2e]">
                  {doc.details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-xs text-[#cbd5e1] flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
