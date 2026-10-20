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
    turn_all_actions: true,
    'fbc-rules': true,
    'neuroport-2077': true
  });
  const [collapsedRuleIds, setCollapsedRuleIds] = useState<Record<string, boolean>>({});

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
    setExpandedSections(prev => {
      const current = prev[id] !== false;
      return {
        ...prev,
        [id]: !current
      };
    });
  };

  const isSectionExpanded = (id: string) => {
    if (searchQuery.trim() !== '') return true;
    return expandedSections[id] !== false;
  };

  const toggleRuleCollapse = (ruleId: string) => {
    setCollapsedRuleIds(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId]
    }));
  };

  const isRuleCollapsed = (ruleId: string) => {
    if (searchQuery.trim() !== '') return false; // auto-expand cards during search
    return !!collapsedRuleIds[ruleId];
  };

  const collapseAll = () => {
    const newExpandedSecs: Record<string, boolean> = {
      cover_table: false,
      grapple_system: false,
      aimed_shots: false,
      hazards_environment: false,
      healing_death_save: false,
      turn_structure: false,
      turn_all_actions: false,
      'fbc-rules': false,
      'neuroport-2077': false
    };
    CHEAT_SHEET_SECTIONS.forEach(s => {
      newExpandedSecs[s.id] = false;
    });
    EXPANSION_RULE_SYSTEMS.forEach(s => {
      newExpandedSecs[s.id] = false;
    });
    setExpandedSections(newExpandedSecs);

    const newCollapsedRules: Record<string, boolean> = {
      cover_rules_explanation: true,
      cover_materials_table: true
    };
    CHEAT_SHEET_SECTIONS.forEach(s => {
      s.rules.forEach((_, idx) => {
        newCollapsedRules[`${s.id}-${idx}`] = true;
      });
    });
    EXPANSION_RULE_SYSTEMS.forEach(s => {
      newCollapsedRules[`${s.id}-intro`] = true;
      newCollapsedRules[`${s.id}-steps`] = true;
      newCollapsedRules[`${s.id}-perks`] = true;
      if (s.referenceTable) {
        newCollapsedRules[`${s.id}-table`] = true;
      }
    });
    setCollapsedRuleIds(newCollapsedRules);
  };

  const expandAll = () => {
    const newExpandedSecs: Record<string, boolean> = {
      cover_table: true,
      grapple_system: true,
      aimed_shots: true,
      hazards_environment: true,
      healing_death_save: true,
      turn_structure: true,
      turn_all_actions: true,
      'fbc-rules': true,
      'neuroport-2077': true
    };
    CHEAT_SHEET_SECTIONS.forEach(s => {
      newExpandedSecs[s.id] = true;
    });
    EXPANSION_RULE_SYSTEMS.forEach(s => {
      newExpandedSecs[s.id] = true;
    });
    setExpandedSections(newExpandedSecs);
    setCollapsedRuleIds({});
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

  const showTurnActions = (selectedCategory === 'all' || selectedCategory === 'turn') &&
    (searchQuery.trim() === '' || 
      'todas las acciones en tu turno move action free hold discreción gm'.includes(searchQuery.toLowerCase()) ||
      'attack aimed shot autofire suppressive fire grab choke throw reload run get up prone hold action stabilize first aid use an object use a skill vehicle maneuver net action quickhack tech charge power ricochet smart lock'.includes(searchQuery.toLowerCase()) ||
      'acciones no escritas ventana mesa cobertura desenfundar botiquin emboscada recargar puerta'.includes(searchQuery.toLowerCase()));

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

          {/* Barra de Acciones Globales: Expandir / Comprimir */}
          <div className="flex items-center justify-between pt-1 border-t border-[#1b2233] text-[10px]">
            <span className="text-slate-400 font-mono-code flex items-center gap-1">
              <span>Modo Acordeón:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={collapseAll}
                className="px-2 py-0.5 bg-[#141824] hover:bg-[#1c2234] text-slate-300 hover:text-white border border-[#222b40] hover:border-cyan-500/50 rounded-xs font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                title="Plegar todas las tarjetas de reglas y secciones"
              >
                <span>🔼</span>
                <span>COMPRIMIR TODAS</span>
              </button>
              <button
                type="button"
                onClick={expandAll}
                className="px-2 py-0.5 bg-[#141824] hover:bg-cyan-950/60 text-cyan-400 hover:text-cyan-300 border border-cyan-700/50 hover:border-cyan-500 rounded-xs font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                title="Desplegar todas las tarjetas de reglas y secciones"
              >
                <span>🔽</span>
                <span>EXPANDIR TODAS</span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENIDO DESPLAZABLE DEL DRAWER */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* =========================================================
              ⏱️ TODAS LAS ACCIONES EN TU TURNO (MOVE, ACTION, FREE, HOLD & DISCRECIÓN DEL GM)
          ========================================================= */}
          {showTurnActions && (
            <div className="bg-[#10131e] border border-cyan-500/40 rounded-xs overflow-hidden shadow-xl">
              {/* Header Acordeón Principal */}
              <div
                onClick={() => toggleSection('turn_all_actions')}
                className="p-3 bg-gradient-to-r from-[#131b2e] via-[#18233c] to-[#10131e] hover:bg-[#1c2948] border-b border-cyan-500/40 flex items-center justify-between cursor-pointer transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="font-tech text-xs font-bold text-white uppercase tracking-wider">
                    ⏱️ TODAS LAS ACCIONES EN TU TURNO (MOVE, ACTION, FREE, HOLD & DISCRECIÓN DEL GM)
                  </span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded-xs border border-cyan-600/40 font-mono-code font-bold">
                    Core pp. 168-175 + CEMK
                  </span>
                </div>
                <span className="text-slate-400">
                  {isSectionExpanded('turn_all_actions') ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
                </span>
              </div>

              {isSectionExpanded('turn_all_actions') && (
                <div className="p-3.5 space-y-4 text-xs font-sans">
                  {/* Resumen de Estructura de Turno */}
                  <div className="bg-[#0b0e17] p-3 rounded-xs border border-cyan-500/30 text-[11px] text-slate-300 leading-relaxed font-mono-code">
                    <p>
                      Cada Ronda de Combate dura exactamente <strong className="text-cyan-400">3 segundos</strong>. En tu Turno dispones de:
                    </p>
                    <ul className="list-disc pl-4 mt-1.5 space-y-1 text-slate-300">
                      <li><strong className="text-emerald-400">1 Acción de Movimiento (Move Action):</strong> Puedes fraccionarla antes, durante o después de tu Acción Estándar.</li>
                      <li><strong className="text-amber-400">1 Acción Estándar (Standard Action):</strong> El impacto principal de tu turno (atacar, usar habilidad, hackear, etc.).</li>
                      <li><strong className="text-purple-400">Acciones Gratuitas (Free Actions):</strong> Acciones instantáneas como tirarse al suelo o gritar una frase corta.</li>
                      <li><strong className="text-cyan-400">Acción Sostenida (Hold Action):</strong> Preparar una acción con un detonante condicional observable.</li>
                    </ul>
                  </div>

                  {/* 1. ACCIONES DE MOVIMIENTO */}
                  <div className="bg-[#0c101c] border border-emerald-500/30 rounded-xs overflow-hidden">
                    <div
                      onClick={() => toggleRuleCollapse('turn_move_actions')}
                      className="p-2.5 bg-emerald-950/20 hover:bg-emerald-950/40 flex items-center justify-between cursor-pointer select-none border-b border-emerald-500/30 text-emerald-300 font-bold"
                    >
                      <div className="flex items-center gap-1.5">
                        {isRuleCollapsed('turn_move_actions') ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>🏃 1. ACCIONES DE MOVIMIENTO (MOVE ACTIONS)</span>
                      </div>
                      <span className="text-[9px] font-mono-code font-normal text-emerald-400">
                        {isRuleCollapsed('turn_move_actions') ? '[▸ Desplegar]' : '[▾ Plegar]'}
                      </span>
                    </div>

                    {!isRuleCollapsed('turn_move_actions') && (
                      <div className="p-3 space-y-2 font-mono-code text-[11px]">
                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs">
                          <strong className="text-white block">Movimiento Estándar:</strong>
                          <span className="text-slate-300">
                            Te desplazas hasta tantos metros/casillas como tu valor de <span className="text-emerald-400 font-bold">MOVE</span>. Puedes dividir libremente el movimiento: por ejemplo, salir 2m de cobertura, disparar tu arma (Acción Estándar) y retroceder 2m de nuevo tras cobertura.
                          </span>
                        </div>
                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs">
                          <strong className="text-white block">Gatear / Arrastrarse (Crawl - Prone):</strong>
                          <span className="text-slate-300">
                            Si estás derribado (Prone), solo puedes avanzar a la <span className="text-amber-400 font-bold">mitad de tu MOVE</span> (redondeado hacia abajo) arrastrándote por el piso.
                          </span>
                        </div>
                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs">
                          <strong className="text-white block">Trepar, Nadar y Terreno Difícil:</strong>
                          <span className="text-slate-300">
                            Avanzar por escaleras verticales, aguas turbulentas o escombros densos cuesta el <span className="text-cyan-400 font-bold">doble de movimiento</span> (cada metro avanzado consume 2 metros de tu MOVE). Saltos de longitud o altura extremos requieren tirada de Athletics.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. TODAS LAS ACCIONES ESTÁNDAR CANÓNICAS */}
                  <div className="bg-[#0c101c] border border-amber-500/30 rounded-xs overflow-hidden">
                    <div
                      onClick={() => toggleRuleCollapse('turn_standard_actions')}
                      className="p-2.5 bg-amber-950/20 hover:bg-amber-950/40 flex items-center justify-between cursor-pointer select-none border-b border-amber-500/30 text-amber-300 font-bold"
                    >
                      <div className="flex items-center gap-1.5">
                        {isRuleCollapsed('turn_standard_actions') ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>⚔️ 2. TODAS LAS ACCIONES ESTÁNDAR (STANDARD ACTIONS - 1 POR TURNO)</span>
                      </div>
                      <span className="text-[9px] font-mono-code font-normal text-amber-400">
                        {isRuleCollapsed('turn_standard_actions') ? '[▸ Desplegar]' : '[▾ Plegar]'}
                      </span>
                    </div>

                    {!isRuleCollapsed('turn_standard_actions') && (
                      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2 font-mono-code text-[10px]">
                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-amber-300 block">💥 Attack (Ataque Estándar)</strong>
                          <span className="text-slate-300">
                            Realizar ataques cuerpo a cuerpo (Melee / Brawling / Martial Arts con ROF 2 o 1) o a distancia (Handguns, Shoulder Arms, Heavy Weapons según su ROF). Si el arma es ROF 2, puedes atacar 2 veces con 1 sola Acción.
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-red-400 block">🎯 Aimed Shot (-8 a la Tirada)</strong>
                          <span className="text-slate-300">
                            Ataque quirúrgico con penalizador de -8. Consume 1 Acción completa (independiente del ROF). A Cabeza (¡todo el daño que supere el blindaje se multiplica x2!), Manos (desarma), Piernas (-4 MOVE), Ojos (ceguera). Prohibido con Autofire o perdigones.
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-amber-400 block">🔥 Autofire (Fuego Automático)</strong>
                          <span className="text-slate-300">
                            Consume 10 proyectiles de golpe. Tiras REF + Autofire + 1d10 contra la tabla de distancias de Autofire. Si impactas, tiras 2d6 y multiplicas el total por el margen de éxito (hasta el máximo multiplicador del arma).
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-amber-400 block">🛑 Suppressive Fire (Fuego de Supresión)</strong>
                          <span className="text-slate-300">
                            Ráfaga en cono de 6x6m hasta 25m (10 proyectiles). Tiras Autofire contra la Concentración de todos los defensores en el área (WILL + Concentration + 1d10). Quien falle debe usar su siguiente Acción de Movimiento para buscar cobertura.
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-cyan-300 block">🤼 Grab / Choke / Throw (Brawling)</strong>
                          <span className="text-slate-300">
                            <strong>Grab:</strong> Requiere 1 mano libre (Brawling vs Brawling o Evasion). Inmoviliza al blanco.<br />
                            <strong>Choke:</strong> Con el blanco agarrado, inflige BODY de daño directo a HP (ignora SP). Turno 3 = Inconsciente.<br />
                            <strong>Throw:</strong> Lanza al blanco al suelo. Daño directo a HP y queda derribado (Prone).
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-cyan-300 block">🔄 Reload (Recargar)</strong>
                          <span className="text-slate-300">
                            Remplazar el cargador gastado o alimentar proyectiles hasta la capacidad estándar completa del arma. Cuesta 1 Acción Estándar completa.
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-blue-300 block">🛡️ Equip / Drop Shield</strong>
                          <span className="text-slate-300">
                            Equipar un escudo antibalas (Bulletproof Shield de 10 HP) en un brazo libre cuesta 1 Acción Estándar. Soltarlo para liberar el brazo es Acción Gratuita (Free Action).
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-emerald-300 block">⚡ Run (Carrera a Toda Velocidad)</strong>
                          <span className="text-slate-300">
                            Sacrificas tu Acción Estándar para realizar un segundo desplazamiento igual a tu valor completo de MOVE en metros (duplica tu desplazamiento en la ronda).
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-purple-300 block">🧍 Get Up from Prone (¡Cuesta 1 Acción Completa!)</strong>
                          <span className="text-slate-300">
                            Ponerte de pie cuando estás derribado en el suelo cuesta <strong className="text-red-400">1 Acción Estándar completa</strong> según las reglas canónicas de CPR Core. En el suelo sufres -2 a combate cuerpo a cuerpo y eres blanco fácil.
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-yellow-300 block">⏳ Hold Action (Acción Sostenida / Preparada)</strong>
                          <span className="text-slate-300">
                            Declaras un detonante específico ("Si alguien cruza la puerta...") y una acción concreta ("...disparo mi escopeta"). Si ocurre antes de tu próximo turno, se activa de inmediato. ¡Si no se detona, se pierde y expira!
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-rose-300 block">💉 Stabilize / First Aid</strong>
                          <span className="text-slate-300">
                            Tratar a un aliado Moribundo (Mortally Wounded) o con Herida Crítica con tirada de First Aid o Paramedic contra el DV correspondiente para frenar hemorragias y salvarle la vida.
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-slate-200 block">🔧 Use an Object (Usar un Objeto / Terminal)</strong>
                          <span className="text-slate-300">
                            Pulsar una consola de seguridad, forzar cerraduras con ganzúas, abrir una puerta blindada, inyectar un autoinyector médico o accionar un detonador de carga explosiva.
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-slate-200 block">🧠 Use a Skill (Uso Activo de Habilidad)</strong>
                          <span className="text-slate-300">
                            Cualquier tirada de habilidad que demande esfuerzo o concentración activa (ej. Perception activa para detectar francotiradores camuflados, Cybertech para diagnóstico en combate, etc.).
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-sky-300 block">🏎️ Vehicle Maneuver (Maniobra de Vehículo)</strong>
                          <span className="text-slate-300">
                            Embestir a otro vehículo (Ram), realizar trompos de emergencia o esquivar fuego concentrado mediante tirada de Drive Land Vehicle o Pilot Air Vehicle.
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-cyan-400 block">🌐 Net Action / Quickhack</strong>
                          <span className="text-slate-300">
                            Los Netrunners hacen 1 Meat Action o hasta 3 NET Actions por turno (CEMK p. 15): Pathfinder, Backdoor, Control, Eye-Dee, Slide, Zap, etc. Los Quickhacks a Neuroports cuestan 1 NET Action, 1 por objetivo por turno, con alcance de 6, 8 o 50 m según el Cyberdeck (CEMK pp. 16, 26).
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-amber-300 block">⚡ Tech Charge Shot (CEMK 2077)</strong>
                          <span className="text-slate-300">
                            Sacrifica la Acción de Movimiento para cargar un arma Tech. El siguiente ataque no explosivo es ROF 1, atraviesa Thin Cover e ignora la mitad del SP del objetivo, redondeando hacia arriba (CEMK p. 31).
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-orange-300 block">💥 Power Ricochet (CEMK 2077)</strong>
                          <span className="text-slate-300">
                            Rebota el disparo en una cobertura para alcanzar a un objetivo tras cobertura o fuera de línea de visión con -4 al Ataque; con Aimed Shot solo aplica el penalizador del Aimed Shot (CEMK pp. 30-31).
                          </span>
                        </div>

                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs space-y-1">
                          <strong className="text-cyan-300 block">🎯 Smart Lock (CEMK 2077)</strong>
                          <span className="text-slate-300">
                            Con Personal Link o Subdermal Grip da +1 al Ataque. Con Improved Smart Ammunition ignora humo y oscuridad, y si falla por 5 o menos repite el ataque sumando 14 en lugar de STAT + Skill (CEMK p. 31).
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. ACCIONES GRATUITAS */}
                  <div className="bg-[#0c101c] border border-purple-500/30 rounded-xs overflow-hidden">
                    <div
                      onClick={() => toggleRuleCollapse('turn_free_actions')}
                      className="p-2.5 bg-purple-950/20 hover:bg-purple-950/40 flex items-center justify-between cursor-pointer select-none border-b border-purple-500/30 text-purple-300 font-bold"
                    >
                      <div className="flex items-center gap-1.5">
                        {isRuleCollapsed('turn_free_actions') ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>💨 3. ACCIONES GRATUITAS (FREE ACTIONS - SIN COSTE)</span>
                      </div>
                      <span className="text-[9px] font-mono-code font-normal text-purple-400">
                        {isRuleCollapsed('turn_free_actions') ? '[▸ Desplegar]' : '[▾ Plegar]'}
                      </span>
                    </div>

                    {!isRuleCollapsed('turn_free_actions') && (
                      <div className="p-3 space-y-2 font-mono-code text-[11px]">
                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs">
                          <strong className="text-emerald-400 block">Tirarse al Suelo (Drop Prone):</strong>
                          <span className="text-slate-300">
                            Tirarse al suelo es <strong className="text-emerald-400">100% GRATUITO</strong> en cualquier momento de tu turno. Te permite beneficiarte de parapetos bajos o trincheras contra fuego lejano (¡pero recuerda que levantarte costará 1 Acción Estándar!).
                          </span>
                        </div>
                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs">
                          <strong className="text-purple-300 block">Hablar / Gritar una frase corta:</strong>
                          <span className="text-slate-300">
                            Comunicarse brevemente por voz o comlink táctico (hasta 3-4 palabras como &ldquo;¡Fuego de apoyo!&rdquo; o &ldquo;¡A la izquierda!&rdquo;).
                          </span>
                        </div>
                        <div className="p-2 bg-[#101420] border border-[#1e2538] rounded-xs">
                          <strong className="text-cyan-300 block">Soltar un objeto o arma:</strong>
                          <span className="text-slate-300">
                            Abrir la mano y dejar caer lo que sostienes al suelo no cuesta acción. Desenfundar otra arma enfundada en tu cartuchera es parte fluida del ataque.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. DISCRECIÓN DEL GM Y CASOS DE MESA */}
                  <div className="bg-[#0c101c] border border-cyan-500/40 rounded-xs overflow-hidden">
                    <div
                      onClick={() => toggleRuleCollapse('turn_gm_discretion')}
                      className="p-2.5 bg-cyan-950/20 hover:bg-cyan-950/40 flex items-center justify-between cursor-pointer select-none border-b border-cyan-500/30 text-cyan-300 font-bold"
                    >
                      <div className="flex items-center gap-1.5">
                        {isRuleCollapsed('turn_gm_discretion') ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>⚖️ 4. EJEMPLOS DE ACCIONES NO ESCRITAS & DISCRECIÓN DEL GM (IMPENDING GM DISCRETION)</span>
                      </div>
                      <span className="text-[9px] font-mono-code font-normal text-cyan-400">
                        {isRuleCollapsed('turn_gm_discretion') ? '[▸ Desplegar]' : '[▾ Plegar]'}
                      </span>
                    </div>

                    {!isRuleCollapsed('turn_gm_discretion') && (
                      <div className="p-3 space-y-2.5 font-mono-code text-[11px]">
                        <p className="text-[10px] text-slate-400 italic">
                          Cuando un jugador intenta maniobras no listadas explícitamente en el manual, el Game Master determina el coste en acción y el DV según esta jurisprudencia de mesa:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2 bg-[#0e121e] border border-[#1e263d] rounded-xs space-y-1">
                            <strong className="text-cyan-300 block">1. Saltar por una ventana de cristal / Deslizarse por un capó</strong>
                            <span className="text-emerald-400 font-bold block">Coste: Move Action + Athletics DV 13/15</span>
                            <span className="text-slate-300 block">Si tiene éxito, cruza como parte de su movimiento. Si falla, cae Prone al otro lado y sufre 1d6 daño por cristales rotos.</span>
                          </div>

                          <div className="p-2 bg-[#0e121e] border border-[#1e263d] rounded-xs space-y-1">
                            <strong className="text-cyan-300 block">2. Volcar una mesa pesada para improvisar cobertura</strong>
                            <span className="text-amber-400 font-bold block">Coste: 1 Acción Estándar (o Free Action si BODY ≥ 8)</span>
                            <span className="text-slate-300 block">Otorga de inmediato 15 HP de cobertura gruesa de madera/metal en esa casilla para parapetarse.</span>
                          </div>

                          <div className="p-2 bg-[#0e121e] border border-[#1e263d] rounded-xs space-y-1">
                            <strong className="text-cyan-300 block">3. Levantar un arma del suelo vs Desenfundar</strong>
                            <span className="text-amber-400 font-bold block">Coste: 1 Acción Estándar (o Move Action a criterio del GM)</span>
                            <span className="text-slate-300 block">Desenfundar de la cartuchera es gratis como parte del ataque; recoger un fusil del suelo bajo fuego requiere agacharse y estabilizarse.</span>
                          </div>

                          <div className="p-2 bg-[#0e121e] border border-[#1e263d] rounded-xs space-y-1">
                            <strong className="text-cyan-300 block">4. Lanzar un cargador o botiquín a un compañero a 6m</strong>
                            <span className="text-amber-400 font-bold block">Coste: 1 Acción Estándar (Athletics DV 13)</span>
                            <span className="text-slate-300 block">El receptor con 1 mano libre puede atraparlo como Free Action superando Athletics / Evasion DV 13. Si falla, cae al suelo en su casilla.</span>
                          </div>

                          <div className="p-2 bg-[#0e121e] border border-[#1e263d] rounded-xs space-y-1">
                            <strong className="text-cyan-300 block">5. Escanear activamente buscando francotiradores o emboscadas</strong>
                            <span className="text-amber-400 font-bold block">Coste: 1 Acción Estándar + Perception vs Stealth del rival</span>
                            <span className="text-slate-300 block">En medio del tiroteo activo, localizar un tirador oculto tras humo o cobertura requiere concentración deliberada.</span>
                          </div>

                          <div className="p-2 bg-[#0e121e] border border-[#1e263d] rounded-xs space-y-1">
                            <strong className="text-cyan-300 block">6. Recargar armas pesadas complejas o cambiar munición especial</strong>
                            <span className="text-amber-400 font-bold block">Coste: 1 Acción Estándar (+ Basic Tech DV 13 si está trabada)</span>
                            <span className="text-slate-300 block">Alimentar una cinta en una ametralladora o desatascar un tambor rotatorio en combate requiere tirada técnica si sufrió una pifia previa.</span>
                          </div>

                          <div className="p-2 bg-[#0e121e] border border-[#1e263d] rounded-xs space-y-1">
                            <strong className="text-cyan-300 block">7. Hablar de más en los 3 segundos de turno</strong>
                            <span className="text-purple-400 font-bold block">Coste: Frase corta = Free Action | Discurso = 1 Acción Estándar</span>
                            <span className="text-slate-300 block">Gritar &ldquo;¡Cúbreme!&rdquo; es gratis. Una negociación prolongada con rehenes o un monólogo dramático consume la Acción del turno + tirada de Persuasion/Cool.</span>
                          </div>

                          <div className="p-2 bg-[#0e121e] border border-[#1e263d] rounded-xs space-y-1">
                            <strong className="text-cyan-300 block">8. Sostener una puerta cerrada con el hombro contra enemigos</strong>
                            <span className="text-amber-400 font-bold block">Coste: 1 Acción Estándar continuada cada turno</span>
                            <span className="text-slate-300 block">Tirada opuesta de Athletics / Brawling (con bono por BODY) contra la fuerza combinada de los asaltantes para impedir que la abran.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TABLA CANÓNICA DE COBERTURAS (CORE PÁG. 182)
          ========================================================= */}
          {showCoverTable && (
            <div className="bg-[#10131e] border border-[#222b40] rounded-xs overflow-hidden">
              {/* Header Acordeón Coberturas */}
              <div
                onClick={() => toggleSection('cover_table')}
                className="p-3 bg-[#151a2a] hover:bg-[#1a2135] border-b border-[#222b40] flex items-center justify-between cursor-pointer transition-colors select-none"
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
                  {isSectionExpanded('cover_table') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
              </div>

              {isSectionExpanded('cover_table') && (
                <div className="p-3 space-y-3 text-xs">
                  {/* Explicación de la Regla Canónica de Cobertura */}
                  <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xs overflow-hidden">
                    <div 
                      onClick={() => toggleRuleCollapse('cover_rules_explanation')}
                      className="p-2.5 flex items-center justify-between cursor-pointer select-none hover:bg-cyan-950/40 transition-colors font-bold text-cyan-300"
                    >
                      <div className="flex items-center gap-1.5">
                        {isRuleCollapsed('cover_rules_explanation') ? (
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                        <span>🛡️ {COVER_RULES_EXPLANATION.title}</span>
                      </div>
                      <span className="text-[9px] text-cyan-400/80 font-mono-code font-normal">
                        {isRuleCollapsed('cover_rules_explanation') ? '[▸ Expandir Reglas]' : '[▾ Plegar Reglas]'}
                      </span>
                    </div>

                    {!isRuleCollapsed('cover_rules_explanation') && (
                      <div className="px-3 pb-2.5 pt-0 border-t border-cyan-500/20">
                        <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-300 pt-1.5">
                          {COVER_RULES_EXPLANATION.keyRules.map((r, idx) => (
                            <li key={idx} className="leading-relaxed">{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Tabla de Materiales */}
                  <div className="border border-[#222b40] rounded-xs overflow-hidden">
                    <div 
                      onClick={() => toggleRuleCollapse('cover_materials_table')}
                      className="p-2 bg-[#141824] hover:bg-[#1a2135] border-b border-[#222b40] flex items-center justify-between cursor-pointer select-none transition-colors"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-white text-[11px] font-tech">
                        {isRuleCollapsed('cover_materials_table') ? (
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                        <span>MATRICES DE MATERIALES & HP ({filteredCoverItems.length})</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono-code">
                        {isRuleCollapsed('cover_materials_table') ? '[▸ Expandir Tabla]' : '[▾ Plegar Tabla]'}
                      </span>
                    </div>

                    {!isRuleCollapsed('cover_materials_table') && (
                      <div className="overflow-x-auto">
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
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              SECCIONES DE REGLAS DINÁMICAS (GRAPPLE, AIMED, HAZARDS, ETC.)
          ========================================================= */}
          {filteredSections.map((sec) => {
            const isExpanded = isSectionExpanded(sec.id);

            return (
              <div 
                key={sec.id}
                className="bg-[#10131e] border border-[#222b40] rounded-xs overflow-hidden"
              >
                {/* Header Acordeón */}
                <div
                  onClick={() => toggleSection(sec.id)}
                  className="p-3 bg-[#151a2a] hover:bg-[#1a2135] border-b border-[#222b40] flex items-center justify-between cursor-pointer transition-colors select-none"
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

                    <div className="space-y-2">
                      {sec.rules.map((rule, idx) => {
                        const ruleId = `${sec.id}-${idx}`;
                        const isCardCollapsed = isRuleCollapsed(ruleId);

                        return (
                          <div 
                            key={idx}
                            className="bg-[#141824] border border-[#222b40] rounded-xs overflow-hidden transition-all"
                          >
                            <div
                              onClick={() => toggleRuleCollapse(ruleId)}
                              className="p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-[#181d2e] select-none transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isCardCollapsed ? (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                )}
                                <span className="font-bold text-white font-tech text-xs truncate">
                                  {rule.title}
                                </span>
                              </div>
                              {rule.badge && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-xs bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 uppercase shrink-0">
                                  {rule.badge}
                                </span>
                              )}
                            </div>

                            {!isCardCollapsed && (
                              <div className="px-2.5 pb-2.5 pt-1 space-y-1.5 border-t border-[#1b2233]">
                                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                                  {rule.content}
                                </p>

                                {rule.mechanic && (
                                  <div className="bg-[#0b0d13] border-l-2 border-cyan-400 p-1.5 text-[10px] text-cyan-300 font-mono-code font-bold rounded-r-xs">
                                    ⚙️ {rule.mechanic}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
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
            const isExpanded = isSectionExpanded(sys.id);

            return (
              <div 
                key={sys.id}
                className="bg-[#10131e] border border-[#a855f7]/40 rounded-xs overflow-hidden"
              >
                {/* Header Acordeón */}
                <div
                  onClick={() => toggleSection(sys.id)}
                  className="p-3 bg-[#151a2a] hover:bg-[#1a2135] border-b border-[#222b40] flex items-center justify-between cursor-pointer transition-colors select-none"
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
                    {/* Intro / Badge */}
                    <div className="bg-[#141824] border-l-2 border-[#a855f7] rounded-r-xs overflow-hidden">
                      <div 
                        onClick={() => toggleRuleCollapse(`${sys.id}-intro`)}
                        className="p-2.5 flex items-center justify-between cursor-pointer select-none hover:bg-[#181d2e] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {isRuleCollapsed(`${sys.id}-intro`) ? (
                            <ChevronRight className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />
                          )}
                          <span className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider">
                            ★ {sys.categoryBadge}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#c084fc]/70 font-mono-code">
                          {isRuleCollapsed(`${sys.id}-intro`) ? '[▸ Expandir]' : '[▾ Plegar]'}
                        </span>
                      </div>

                      {!isRuleCollapsed(`${sys.id}-intro`) && (
                        <div className="px-2.5 pb-2.5 pt-0 border-t border-[#1b2233]">
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans pt-1.5">
                            {sys.introDescription}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Paso a Paso */}
                    <div className="bg-[#10131e] border border-[#222b40] rounded-xs overflow-hidden">
                      <div 
                        onClick={() => toggleRuleCollapse(`${sys.id}-steps`)}
                        className="p-2 bg-[#141824] hover:bg-[#181d2e] flex items-center justify-between cursor-pointer select-none transition-colors border-b border-[#222b40]"
                      >
                        <div className="flex items-center gap-1.5">
                          {isRuleCollapsed(`${sys.id}-steps`) ? (
                            <ChevronRight className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          )}
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                            ⚡ Pasos de Funcionamiento ({sys.howItWorksSteps.length})
                          </span>
                        </div>
                        <span className="text-[9px] text-amber-300/70 font-mono-code">
                          {isRuleCollapsed(`${sys.id}-steps`) ? '[▸ Expandir]' : '[▾ Plegar]'}
                        </span>
                      </div>

                      {!isRuleCollapsed(`${sys.id}-steps`) && (
                        <div className="p-2 space-y-1">
                          {sys.howItWorksSteps.map((step, idx) => (
                            <div key={idx} className="p-2 bg-[#0e111a] border border-[#222b40] rounded-xs text-[10px] text-slate-300 leading-relaxed">
                              {step}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Ventajas y Riesgos */}
                    <div className="bg-[#10131e] border border-[#222b40] rounded-xs overflow-hidden">
                      <div 
                        onClick={() => toggleRuleCollapse(`${sys.id}-perks`)}
                        className="p-2 bg-[#141824] hover:bg-[#181d2e] flex items-center justify-between cursor-pointer select-none transition-colors border-b border-[#222b40]"
                      >
                        <div className="flex items-center gap-1.5">
                          {isRuleCollapsed(`${sys.id}-perks`) ? (
                            <ChevronRight className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                          )}
                          <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">
                            ⚖️ Ventajas y Riesgos Tácticos
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono-code">
                          {isRuleCollapsed(`${sys.id}-perks`) ? '[▸ Expandir]' : '[▾ Plegar]'}
                        </span>
                      </div>

                      {!isRuleCollapsed(`${sys.id}-perks`) && (
                        <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      )}
                    </div>

                    {/* Tabla de Referencia si existe */}
                    {sys.referenceTable && (
                      <div className="border border-[#222b40] rounded-xs overflow-hidden">
                        <div 
                          onClick={() => toggleRuleCollapse(`${sys.id}-table`)}
                          className="p-2 bg-[#141824] hover:bg-[#181d2e] flex items-center justify-between cursor-pointer select-none transition-colors border-b border-[#222b40]"
                        >
                          <div className="flex items-center gap-1.5">
                            {isRuleCollapsed(`${sys.id}-table`) ? (
                              <ChevronRight className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                            )}
                            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                              📊 Tabla de Especificaciones Canónicas
                            </span>
                          </div>
                          <span className="text-[9px] text-cyan-400/70 font-mono-code">
                            {isRuleCollapsed(`${sys.id}-table`) ? '[▸ Expandir]' : '[▾ Plegar]'}
                          </span>
                        </div>

                        {!isRuleCollapsed(`${sys.id}-table`) && (
                          <div className="overflow-x-auto">
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
                )}
              </div>
            );
          })}

          {/* Estado vacío cuando la búsqueda no da resultados */}
          {!showCoverTable && !showTurnActions && filteredSections.length === 0 && filteredSystems.length === 0 && (
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
