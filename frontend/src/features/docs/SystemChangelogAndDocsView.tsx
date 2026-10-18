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
  ADDED_FEATURES_INVENTORY,
  PHASES_ROADMAP_OVERVIEW,
  PREMIUM_MODULES_STATUS,
  ARCHITECTURE_AND_GUIDE_DOCS,
  SYSTEM_METRICS_SUMMARY
} from '../../data/systemDocsAndChangelogData';

type ActiveDocsTab = 'changelog' | 'inventory' | 'roadmap' | 'architecture';

export function SystemChangelogAndDocsView() {
  const [activeTab, setActiveTab] = useState<ActiveDocsTab>('changelog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('Todas');
  const [expandedVersions, setExpandedVersions] = useState<Record<string, boolean>>({
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
    return VERSION_CHANGELOG_HISTORY.filter((item) => {
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
                <CheckCircle2 className="w-3 h-3" /> v3.5.0 OPERATIVO
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-tech font-bold text-white tracking-wider flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-cyan-400" />
              SISTEMA, ARQUITECTURA & CHANGELOG MAESTRO
            </h1>
            <p className="text-sm text-[#94a3b8] max-w-3xl leading-relaxed">
              Auditoría integral versión por versión de CPR Omni-Deck (v1.0.0 a v3.5.0), inventario de los 8 grandes
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
            {ARCHITECTURE_AND_GUIDE_DOCS.map((doc, idx) => (
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
