import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Shield, 
  Crosshair, 
  Flame, 
  HeartPulse, 
  Clock, 
  Search, 
  X, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { 
  COVER_HP_TABLE, 
  COVER_RULES_EXPLANATION, 
  CHEAT_SHEET_SECTIONS 
} from '../../data/rulesCheatSheet';
import { EXPANSION_RULE_SYSTEMS } from '../../data/expansionRulesData';

type CheatCategory = 'all' | 'grapple' | 'cover' | 'aimed' | 'hazards' | 'healing' | 'turn' | 'systems';

export const RulesCheatSheetDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CheatCategory>('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cover_table: true,
    grapple_system: true,
    aimed_shots: true,
    hazards_environment: true,
    healing_death_save: true,
    turn_structure: true,
    'fbc-rules': true,
    'neuroport-2077': true
  });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categoriesConfig: { key: CheatCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'TODAS', icon: <Layers className="w-3.5 h-3.5" /> },
    { key: 'systems', label: '🦾 SISTEMAS 2077 & FBC', icon: <span className="text-xs">🦾</span> },
    { key: 'grapple', label: '🤼 GRAPPLE/CHOKE', icon: <span className="text-xs">🤼</span> },
    { key: 'cover', label: '🛡️ COBERTURAS HP', icon: <Shield className="w-3.5 h-3.5" /> },
    { key: 'aimed', label: '🎯 APUNTADOS', icon: <Crosshair className="w-3.5 h-3.5" /> },
    { key: 'hazards', label: '🔥 PELIGROS', icon: <Flame className="w-3.5 h-3.5" /> },
    { key: 'healing', label: '💉 CURACIÓN & DEATH', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { key: 'turn', label: '⏱️ ACCIONES', icon: <Clock className="w-3.5 h-3.5" /> }
  ];

  // Filtered Cover Items
  const filteredCoverItems = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'cover') return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COVER_HP_TABLE;
    return COVER_HP_TABLE.filter(item => 
      item.material.toLowerCase().includes(q) ||
      item.examples.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q) ||
      item.thinHp.toLowerCase().includes(q) ||
      item.thickHp.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  // Filtered Rules Sections
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CHEAT_SHEET_SECTIONS.filter(sec => {
      // Category match
      if (selectedCategory !== 'all' && sec.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      // Search in title, summary, or any rule point
      const matchesTitle = sec.title.toLowerCase().includes(q) || sec.summary.toLowerCase().includes(q);
      const matchesRule = sec.rules.some(r => 
        r.title.toLowerCase().includes(q) || 
        r.content.toLowerCase().includes(q) || 
        (r.mechanic && r.mechanic.toLowerCase().includes(q)) ||
        (r.badge && r.badge.toLowerCase().includes(q))
      );
      return matchesTitle || matchesRule;
    });
  }, [searchQuery, selectedCategory]);

  // Filtered Expansion Systems
  const filteredSystems = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'systems') return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return EXPANSION_RULE_SYSTEMS;
    return EXPANSION_RULE_SYSTEMS.filter(sys => 
      sys.title.toLowerCase().includes(q) ||
      sys.subtitle.toLowerCase().includes(q) ||
      sys.introDescription.toLowerCase().includes(q) ||
      sys.categoryBadge.toLowerCase().includes(q) ||
      sys.howItWorksSteps.some(s => s.toLowerCase().includes(q)) ||
      sys.keyBenefits.some(b => b.toLowerCase().includes(q))
    );
  }, [searchQuery, selectedCategory]);

  const showCoverTable = (selectedCategory === 'all' || selectedCategory === 'cover') && 
    (searchQuery.trim() === '' || filteredCoverItems.length > 0 || 'cobertura'.includes(searchQuery.toLowerCase()));

  return (
    <>
      {/* =========================================================
          PESTAÑA / LENGÜETA LATERAL DERECHA (FIJA EN BORDE DERECHO)
      ========================================================= */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-1.5 py-3.5 px-1.5 bg-[#10131e]/95 hover:bg-[#161c2d] border-l-2 border-y border-r-0 border-cyan-400 hover:border-cyan-300 text-cyan-300 hover:text-white shadow-2xl shadow-cyan-950/80 rounded-l-md font-mono-code transition-all cursor-pointer group active:scale-95"
          title="Abrir Machete de Reglas Oficiales (Cyberpunk RED Core)"
        >
          <div className="flex flex-col items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform animate-pulse" />
            <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-cyan-200">
              REGLAS & MACHETE CPR
            </span>
            <ChevronLeft className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </button>
      )}

      {/* =========================================================
          BACKDROP OSCURO TRASLÚCIDO
      ========================================================= */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* =========================================================
          DRAWER TÁCTICO LATERAL DERECHO
      ========================================================= */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full max-w-xl bg-[#090b10]/98 border-l-2 border-cyan-500/70 shadow-2xl z-50 flex flex-col font-mono-code transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Lengüeta de cierre pegada al borde izquierdo del drawer */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -left-9 top-1/2 -translate-y-1/2 py-3 px-1 bg-[#10131e] border-l border-y border-cyan-500/60 text-cyan-400 hover:text-white hover:bg-cyan-950 rounded-l-md cursor-pointer transition-colors shadow-lg hidden sm:flex items-center justify-center"
          title="Cerrar Machete"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* CABECERA DEL DRAWER */}
        <div className="p-4 bg-[#10131e] border-b border-[#20273a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-950/40 rounded-xs border border-cyan-500/50 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-tech text-white uppercase tracking-wider flex items-center gap-2">
                <span>MACHETE DE REGLAS OFICIALES</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-red-950/60 text-red-400 border border-red-700/50">
                  CPR CORE
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">
                Referencia Rápida Canónica (458 Páginas) • Sin dudas en combate
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="px-2.5 py-1 bg-[#181b2a] hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-[#2a3147] hover:border-red-500 rounded-xs text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            title="Cerrar Drawer (Esc)"
          >
            <X className="w-3.5 h-3.5" />
            <span>CERRAR</span>
          </button>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS RÁPIDOS */}
        <div className="p-3 bg-[#0d1017] border-b border-[#1b2233] space-y-2.5 shrink-0">
          {/* Input Buscador */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar regla: grapple, choke, puerta de auto, cabeza, fuego, death save..."
              className="w-full bg-[#141824] border border-[#222b40] pl-8 pr-7 py-1.5 text-xs text-white rounded-xs focus:outline-hidden focus:border-cyan-400 font-mono-code placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Categorías Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {categoriesConfig.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-[#141824] border border-[#222b40] text-slate-400 hover:text-white hover:border-cyan-500/40'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENIDO DESPLAZABLE DEL DRAWER */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* =========================================================
              TABLA CANÓNICA DE COBERTURAS (CORE PÁG. 182)
          ========================================================= */}
          {showCoverTable && (
            <div className="bg-[#10131e] border border-[#222b40] rounded-xs overflow-hidden">
              {/* Header Acordeón Coberturas */}
              <div
                onClick={() => toggleSection('cover_table')}
                className="p-3 bg-[#151a2a] hover:bg-[#1a2135] border-b border-[#222b40] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span className="font-tech text-xs font-bold text-white uppercase tracking-wider">
                    TABLA OFICIAL DE PUNTOS DE VIDA DE COBERTURA (HP)
                  </span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 rounded-xs border border-cyan-600/40">
                    Pág. 182
                  </span>
                </div>
                <span className="text-slate-400">
                  {expandedSections.cover_table ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
              </div>

              {expandedSections.cover_table && (
                <div className="p-3 space-y-3 text-xs">
                  {/* Explicación de la Regla Canónica de Cobertura */}
                  <div className="bg-cyan-950/20 border border-cyan-500/30 p-2.5 rounded-xs text-[11px] text-slate-300 space-y-1.5">
                    <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <span>🛡️ {COVER_RULES_EXPLANATION.title}</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-300">
                      {COVER_RULES_EXPLANATION.keyRules.map((r, idx) => (
                        <li key={idx} className="leading-relaxed">{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tabla de Materiales */}
                  <div className="overflow-x-auto border border-[#222b40] rounded-xs">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#141824] text-slate-400 text-[10px] uppercase border-b border-[#222b40]">
                        <tr>
                          <th className="py-2 px-2.5">Material</th>
                          <th className="py-2 px-2 text-center text-cyan-300">Fina</th>
                          <th className="py-2 px-2 text-center text-cyan-400 font-bold">Gruesa</th>
                          <th className="py-2 px-2.5">Ejemplos Canónicos</th>
                          <th className="py-2 px-2.5 text-slate-400">Notas Tácticas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1b2233]">
                        {filteredCoverItems.map((c) => (
                          <tr key={c.id} className="hover:bg-[#141824]/60 transition-colors">
                            <td className="py-2 px-2.5 font-bold text-white font-tech">
                              {c.material}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className={`px-1.5 py-0.2 rounded-xs font-mono-code font-bold ${
                                c.thinHp === '0 HP' 
                                  ? 'bg-red-950/40 text-red-400 border border-red-700/40' 
                                  : 'bg-cyan-950/40 text-cyan-300 border border-cyan-700/40'
                              }`}>
                                {c.thinHp}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className={`px-1.5 py-0.2 rounded-xs font-mono-code font-bold ${
                                c.thickHp === '0 HP' 
                                  ? 'bg-red-950/40 text-red-400 border border-red-700/40' 
                                  : 'bg-cyan-950/50 text-cyan-200 border border-cyan-600/50'
                              }`}>
                                {c.thickHp}
                              </span>
                            </td>
                            <td className="py-2 px-2.5 text-slate-300 text-[10px] max-w-[160px]">
                              {c.examples}
                            </td>
                            <td className="py-2 px-2.5 text-[10px] text-slate-400 max-w-[150px]">
                              {c.notes}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              SECCIONES DE REGLAS DINÁMICAS (GRAPPLE, AIMED, HAZARDS, ETC.)
          ========================================================= */}
          {filteredSections.map((sec) => {
            const isExpanded = !!expandedSections[sec.id];

            return (
              <div 
                key={sec.id}
                className="bg-[#10131e] border border-[#222b40] rounded-xs overflow-hidden"
              >
                {/* Header Acordeón */}
                <div
                  onClick={() => toggleSection(sec.id)}
                  className="p-3 bg-[#151a2a] hover:bg-[#1a2135] border-b border-[#222b40] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{sec.icon}</span>
                    <span className="font-tech text-xs font-bold text-white uppercase tracking-wider">
                      {sec.title}
                    </span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 rounded-xs border border-cyan-600/40">
                      {sec.pageRef}
                    </span>
                  </div>
                  <span className="text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                </div>

                {isExpanded && (
                  <div className="p-3.5 space-y-3 text-xs">
                    <p className="text-[11px] text-slate-400 italic">
                      {sec.summary}
                    </p>

                    <div className="space-y-2.5">
                      {sec.rules.map((rule, idx) => (
                        <div 
                          key={idx}
                          className="p-2.5 bg-[#141824] border border-[#222b40] rounded-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-white font-tech text-xs">
                              {rule.title}
                            </span>
                            {rule.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-xs bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 uppercase">
                                {rule.badge}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                            {rule.content}
                          </p>

                          {rule.mechanic && (
                            <div className="bg-[#0b0d13] border-l-2 border-cyan-400 p-1.5 text-[10px] text-cyan-300 font-mono-code font-bold rounded-r-xs">
                              ⚙️ {rule.mechanic}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* =========================================================
              SECCIONES DE SISTEMAS EXPANDIDOS (2077 & FBC)
          ========================================================= */}
          {filteredSystems.map((sys) => {
            const isExpanded = !!expandedSections[sys.id];

            return (
              <div 
                key={sys.id}
                className="bg-[#10131e] border border-[#a855f7]/40 rounded-xs overflow-hidden"
              >
                {/* Header Acordeón */}
                <div
                  onClick={() => toggleSection(sys.id)}
                  className="p-3 bg-[#151a2a] hover:bg-[#1a2135] border-b border-[#222b40] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">🦾</span>
                    <span className="font-tech text-xs font-bold text-white uppercase tracking-wider">
                      {sys.title}
                    </span>
                    <span className="text-[10px] text-[#c084fc] bg-[#a855f7]/20 px-1.5 rounded-xs border border-[#a855f7]/40">
                      {sys.sourceBookTitle}
                    </span>
                    <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1 rounded-xs border border-amber-600/30">
                      {sys.era.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-[#c084fc]" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                </div>

                {isExpanded && (
                  <div className="p-3.5 space-y-3 text-xs">
                    <div className="p-2.5 bg-[#141824] border-l-2 border-[#a855f7] rounded-r-xs space-y-1">
                      <div className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider">
                        ★ {sys.categoryBadge}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        {sys.introDescription}
                      </p>
                    </div>

                    {/* Paso a Paso */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                        ⚡ Pasos de Funcionamiento:
                      </span>
                      <div className="space-y-1">
                        {sys.howItWorksSteps.map((step, idx) => (
                          <div key={idx} className="p-2 bg-[#0e111a] border border-[#222b40] rounded-xs text-[10px] text-slate-300 leading-relaxed">
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ventajas y Riesgos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="p-2 bg-[#10b981]/5 border border-[#10b981]/30 rounded-xs space-y-1">
                        <span className="text-[10px] font-bold text-[#10b981] uppercase block">
                          ✓ Ventajas:
                        </span>
                        <ul className="list-disc pl-3.5 space-y-0.5 text-[10px] text-slate-300">
                          {sys.keyBenefits.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-2 bg-[#f43f5e]/5 border border-[#f43f5e]/30 rounded-xs space-y-1">
                        <span className="text-[10px] font-bold text-[#f43f5e] uppercase block">
                          ⚠ Riesgos y Costes:
                        </span>
                        <ul className="list-disc pl-3.5 space-y-0.5 text-[10px] text-slate-300">
                          {sys.drawbacksAndRisks.map((d, dIdx) => (
                            <li key={dIdx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Tabla de Referencia si existe */}
                    {sys.referenceTable && (
                      <div className="overflow-x-auto border border-[#222b40] rounded-xs mt-2">
                        <table className="w-full text-left text-[10px]">
                          <thead className="bg-[#141824] text-cyan-300 uppercase border-b border-[#222b40]">
                            <tr>
                              {sys.referenceTable.headers.map((h, hIdx) => (
                                <th key={hIdx} className="py-1.5 px-2">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1b2233]">
                            {sys.referenceTable.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-[#141824]/60">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="py-1.5 px-2 text-slate-300">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Estado vacío cuando la búsqueda no da resultados */}
          {!showCoverTable && filteredSections.length === 0 && filteredSystems.length === 0 && (
            <div className="p-8 text-center bg-[#10131e] border border-[#222b40] rounded-xs space-y-2">
              <p className="text-xs text-slate-400">
                No se encontraron reglas ni sistemas que coincidan con &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs text-cyan-400 hover:underline font-bold"
              >
                Restablecer búsqueda y filtros
              </button>
            </div>
          )}

        </div>

        {/* PIE DEL DRAWER */}
        <div className="p-2.5 bg-[#10131e] border-t border-[#20273a] text-center text-[10px] text-slate-500 shrink-0">
          Cyberpunk RED TTRPG • R. Talsorian Games Core Rules • Presiona <kbd className="px-1 py-0.2 bg-[#1b2233] text-slate-300 rounded border border-[#2e3a55]">Esc</kbd> para cerrar
        </div>
      </div>
    </>
  );
};
