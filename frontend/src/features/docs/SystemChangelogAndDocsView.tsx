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
                <CheckCircle2 className="w-3 h-3" /> v3.9.0 OPERATIVO
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-tech font-bold text-white tracking-wider flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-cyan-400" />
              SISTEMA, ARQUITECTURA & CHANGELOG MAESTRO
            </h1>
            <p className="text-sm text-[#94a3b8] max-w-3xl leading-relaxed">
              Auditoría integral versión por versión de CPR Omni-Deck (v1.0.0 a v3.9.0), inventario de los 8 grandes
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
              <span className="text-xs text-[#64748b] font-mono">3 Integrados • 2 en Fase 4</span>
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
