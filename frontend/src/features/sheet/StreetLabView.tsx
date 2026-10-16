import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { 
  calculateMaxHp, 
  calculateSeriouslyWoundedThreshold, 
  calculateMaxHumanity,
  calculateWeaponAttackBreakdown
} from '../../engine/characterEngine';
import type { 
  CombatSkillKey, 
  StatKey 
} from '../../types/cyberpunk';
import { SKILL_METADATA } from '../../types/cyberpunk';
import coreData from '../../data/core-rules.cprpack.json';
import { 
  User, 
  Plus, 
  Minus, 
  Download, 
  Upload, 
  Copy, 
  Trash2, 
  Sparkles, 
  Heart, 
  Activity, 
  Coins, 
  FolderPlus,
  Skull,
  ChevronDown,
  ChevronRight,
  Shield,
  Crosshair,
  Cpu,
  RefreshCw
} from 'lucide-react';

const STAT_KEYS: StatKey[] = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];

const ROLES = [
  'Solo',
  'Netrunner',
  'Tech',
  'Medtech',
  'Media',
  'Exec',
  'Lawman',
  'Fixer',
  'Nomad',
  'Rockerboy'
];

type SkillFilterCategory = 'all' | 'ranged' | 'melee' | 'defense' | 'medical' | 'general';

export const StreetLabView: React.FC = () => {
  const characters = useCharacterStore((state) => state.characters);
  const activeCharacterId = useCharacterStore((state) => state.activeCharacterId);
  const setActiveCharacter = useCharacterStore((state) => state.setActiveCharacter);
  const getActiveCharacter = useCharacterStore((state) => state.getActiveCharacter);
  const createNewCharacter = useCharacterStore((state) => state.createNewCharacter);
  const deleteCharacter = useCharacterStore((state) => state.deleteCharacter);
  const updateCharacterMeta = useCharacterStore((state) => state.updateCharacterMeta);
  const updateStat = useCharacterStore((state) => state.updateStat);
  const updateSkill = useCharacterStore((state) => state.updateSkill);
  const repairArmor = useCharacterStore((state) => state.repairArmor);
  const reloadWeapon = useCharacterStore((state) => state.reloadWeapon);
  const unequipWeapon = useCharacterStore((state) => state.unequipWeapon);
  const toggleCyberwareInstall = useCharacterStore((state) => state.toggleCyberwareInstall);
  const exportActiveCharacterJson = useCharacterStore((state) => state.exportActiveCharacterJson);
  const importCharacterJson = useCharacterStore((state) => state.importCharacterJson);

  const activeChar = getActiveCharacter();

  // Local state for modals & filters
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newHandle, setNewHandle] = useState('');
  const [newRole, setNewRole] = useState('Solo');

  const [isImporting, setIsImporting] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Skill filter and accordion state
  const [skillFilter, setSkillFilter] = useState<SkillFilterCategory>('all');
  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);

  // Derived stats
  const bodyVal = activeChar?.stats?.BODY ?? 6;
  const willVal = activeChar?.stats?.WILL ?? 6;
  const empVal = activeChar?.stats?.EMP ?? 6;
  const maxHp = calculateMaxHp(bodyVal, willVal);
  const seriousWoundThresh = calculateSeriouslyWoundedThreshold(maxHp);
  const maxHumanity = calculateMaxHumanity(empVal);

  // Active death save penalty from critical injuries
  let deathSavePenalty = 0;
  activeChar?.activeInjuries?.forEach((inj) => {
    if (!inj.isTreated && inj.modifiers?.bonusDeathSavePenalty) {
      deathSavePenalty += inj.modifiers.bonusDeathSavePenalty;
    }
  });

  // Calculate active penalties per stat
  const getStatPenalty = (stat: StatKey): number => {
    let pen = 0;
    if (stat === 'REF' || stat === 'DEX' || stat === 'MOVE') {
      const headPen = Math.abs(activeChar?.headArmor?.penalty ?? 0);
      const bodyPen = Math.abs(activeChar?.bodyArmor?.penalty ?? 0);
      pen += Math.max(headPen, bodyPen);
    }
    activeChar?.activeInjuries?.forEach((inj) => {
      if (!inj.isTreated && inj.modifiers?.statPenalties?.[stat]) {
        pen += inj.modifiers.statPenalties[stat]!;
      }
    });
    return pen;
  };

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCopyJson = () => {
    const jsonStr = exportActiveCharacterJson();
    navigator.clipboard.writeText(jsonStr);
    showStatus('¡Ficha copiada al portapapeles!');
  };

  const handleDownloadJson = () => {
    const jsonStr = exportActiveCharacterJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeChar.handle.toLowerCase().replace(/\s+/g, '_')}_sheet.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('¡Ficha descargada con éxito!');
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = importCharacterJson(importJsonText);
    if (ok) {
      setIsImporting(false);
      setImportJsonText('');
      showStatus('¡Ficha importada correctamente!');
    } else {
      alert('Error: El formato JSON no es válido o carece de campos obligatorios.');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle.trim()) return;
    createNewCharacter(newHandle, newRole);
    setNewHandle('');
    setIsCreatingNew(false);
    showStatus(`¡Personaje ${newHandle} creado!`);
  };

  const toggleSkillExpand = (skillKey: string) => {
    setExpandedSkills((prev) => ({ ...prev, [skillKey]: !prev[skillKey] }));
  };

  const toggleAllExpanded = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const updated: Record<string, boolean> = {};
    (Object.keys(SKILL_METADATA) as CombatSkillKey[]).forEach((k) => {
      updated[k] = nextState;
    });
    setExpandedSkills(updated);
  };

  // Filter skills based on tab
  const filteredSkillKeys = (Object.keys(SKILL_METADATA) as CombatSkillKey[]).filter((key) => {
    if (skillFilter === 'all') return true;
    return SKILL_METADATA[key].category === skillFilter;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      
      {/* =========================================================
          BLOQUE 1: BARRA SUPERIOR COMPACTA DE IDENTIDAD Y FICHAS
      ========================================================= */}
      <div className="chamfer-card p-2.5 bg-[#121319] border border-[#232736] flex flex-wrap items-center justify-between gap-3">
        
        {/* Selector de personaje & Metadata inline */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
            <User className="w-4 h-4 text-[#dc2626]" />
            <span>FICHA:</span>
          </div>

          <select
            value={activeCharacterId}
            onChange={(e) => setActiveCharacter(e.target.value)}
            className="bg-[#171924] border border-[#2c3246] text-white font-tech font-bold text-xs rounded px-2.5 py-1 focus:outline-none focus:border-[#dc2626] cursor-pointer"
          >
            {characters.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#121318]">
                {c.handle} ({c.role} {c.roleRank})
              </option>
            ))}
          </select>

          <div className="hidden sm:block h-5 w-px bg-[#232736]"></div>

          {/* Inputs inline: Handle, Rol, Rango, Eurodólares */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
            <input
              type="text"
              value={activeChar?.handle ?? ''}
              onChange={(e) => updateCharacterMeta({ handle: e.target.value })}
              placeholder="Handle..."
              className="w-28 sm:w-36 bg-[#171924] border border-[#2c3246] text-white font-tech font-bold px-2 py-0.5 rounded focus:outline-none focus:border-[#dc2626]"
              title="Alias / Handle del personaje"
            />

            <select
              value={activeChar?.role ?? 'Solo'}
              onChange={(e) => updateCharacterMeta({ role: e.target.value })}
              className="bg-[#171924] border border-[#2c3246] text-[#38bdf8] font-tech font-bold px-2 py-0.5 rounded focus:outline-none focus:border-[#dc2626]"
              title="Rol del personaje"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <div className="flex items-center gap-1 bg-[#171924] border border-[#2c3246] px-1.5 py-0.5 rounded" title="Rango de Rol (1-10)">
              <span className="text-[10px] text-[#64748b]">Rnk:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={activeChar?.roleRank ?? 4}
                onChange={(e) => updateCharacterMeta({ roleRank: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)) })}
                className="w-8 bg-transparent text-center text-white font-bold focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#171924] border border-[#2c3246] px-2 py-0.5 rounded" title="Eurodólares disponibles">
              <Coins className="w-3 h-3 text-[#10b981]" />
              <input
                type="number"
                min="0"
                value={activeChar?.eurodollars ?? 0}
                onChange={(e) => updateCharacterMeta({ eurodollars: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-16 bg-transparent text-[#10b981] font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción de Ficha */}
        <div className="flex items-center gap-1.5">
          {statusMessage && (
            <span className="text-[11px] font-mono-code text-[#10b981] mr-1 animate-pulse">
              {statusMessage}
            </span>
          )}

          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="px-2 py-1 bg-[#202434] hover:bg-[#dc2626] text-white font-tech font-bold text-xs rounded-xs border border-[#2d344a] flex items-center gap-1 transition-all"
            title="Crear nueva ficha"
          >
            <FolderPlus className="w-3 h-3" />
            <span className="hidden sm:inline">+ NUEVO</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="p-1 bg-[#171924] hover:bg-[#222838] text-[#cbd5e1] rounded-xs border border-[#2a3044] transition-all"
            title="Copiar JSON de la ficha"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownloadJson}
            className="p-1 bg-[#171924] hover:bg-[#222838] text-[#cbd5e1] rounded-xs border border-[#2a3044] transition-all"
            title="Descargar archivo JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsImporting(!isImporting)}
            className="p-1 bg-[#171924] hover:bg-[#38bdf8] hover:text-black text-[#38bdf8] rounded-xs border border-[#2a3044] transition-all"
            title="Importar ficha desde JSON"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          {characters.length > 1 && (
            <button
              onClick={() => {
                if (confirm(`¿Eliminar la ficha de ${activeChar.handle}?`)) {
                  deleteCharacter(activeChar.id);
                  showStatus('Personaje eliminado.');
                }
              }}
              className="p-1 bg-[#22181d] hover:bg-[#dc2626] text-[#dc2626] hover:text-white rounded-xs border border-[#3b1c24] transition-colors"
              title="Eliminar este personaje"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Formulario Inline: Crear Nuevo Personaje */}
      {isCreatingNew && (
        <form onSubmit={handleCreateSubmit} className="chamfer-card p-3 bg-[#141622] border border-[#dc2626]/40 flex flex-wrap items-center gap-3">
          <div className="font-tech text-xs font-bold text-white uppercase">NUEVO EDGERUNNER:</div>
          <input
            type="text"
            placeholder="Nombre callejero (Handle)..."
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
            className="bg-[#0e1017] border border-[#282f42] text-white text-xs px-2.5 py-1 rounded focus:outline-none focus:border-[#dc2626] font-tech font-bold"
            required
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="bg-[#0e1017] border border-[#282f42] text-white text-xs px-2.5 py-1 rounded font-tech font-bold"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-3 py-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-xs tracking-wider rounded-xs chamfer-btn"
          >
            CREAR FICHA
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingNew(false)}
            className="text-xs font-mono-code text-[#64748b] hover:text-white"
          >
            Cancelar
          </button>
        </form>
      )}

      {/* Panel Inline: Importar JSON */}
      {isImporting && (
        <div className="chamfer-card p-3 bg-[#141622] border border-[#38bdf8]/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-tech font-bold text-[#38bdf8] uppercase">
            <span>PEGAR TEXTO O ARCHIVO JSON:</span>
            <button onClick={() => setIsImporting(false)} className="text-[#64748b] hover:text-white">Cerrar</button>
          </div>
          <textarea
            rows={3}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="Pega aquí el JSON de la CharacterSheet..."
            className="w-full bg-[#0d0e14] border border-[#242b3c] text-[#cbd5e1] font-mono-code text-xs p-2 rounded focus:outline-none focus:border-[#38bdf8]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleImportSubmit}
              className="px-3 py-1 bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-tech font-bold text-xs rounded-xs"
            >
              IMPORTAR FICHA
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          BLOQUE 2: CINTA TÁCTICA HORIZONTAL DE LOS 10 STATS + DERIVADAS
      ========================================================= */}
      <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-2.5">
        
        {/* Tira de 10 STATS */}
        <div className="grid grid-cols-5 lg:grid-cols-10 gap-1.5">
          {STAT_KEYS.map((stat) => {
            const val = activeChar?.stats?.[stat] ?? 6;
            const penalty = getStatPenalty(stat);

            return (
              <div
                key={stat}
                className="bg-[#151722] p-1.5 rounded border border-[#222636] text-center flex flex-col justify-between hover:border-[#384058] transition-all"
              >
                <div className="flex items-center justify-between text-[11px] font-tech text-[#94a3b8] px-0.5">
                  <span className="font-bold text-white">{stat}</span>
                  {penalty > 0 && (
                    <span className="text-[#dc2626] font-mono-code text-[10px] font-bold">
                      -{penalty}
                    </span>
                  )}
                </div>

                <div className="font-tech text-2xl font-bold text-[#dc2626] leading-none my-1">
                  {val}
                </div>

                <div className="flex items-center justify-center gap-1 pt-1 border-t border-[#1e2230]">
                  <button
                    onClick={() => updateStat(stat, val - 1)}
                    className="w-4 h-4 bg-[#202434] hover:bg-[#dc2626] text-white rounded flex items-center justify-center text-[10px]"
                    title={`Reducir ${stat}`}
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={() => updateStat(stat, val + 1)}
                    className="w-4 h-4 bg-[#202434] hover:bg-[#10b981] text-white rounded flex items-center justify-center text-[10px]"
                    title={`Aumentar ${stat}`}
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Barra Fina de Estadísticas Derivadas */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#171923] p-2 rounded border border-[#222636] text-xs font-mono-code">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#dc2626]" />
            <span className="text-[#64748b]">MAX HP:</span>
            <span className="text-white font-bold">{maxHp}</span>
            <span className="text-[10px] text-[#64748b] hidden sm:inline">(10+5×⌈{bodyVal}+{willVal}⌉/2)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="text-[#64748b]">GRAVE (-2):</span>
            <span className="text-[#f59e0b] font-bold">&lt; {seriousWoundThresh} HP</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Skull className="w-3.5 h-3.5 text-[#dc2626]" />
            <span className="text-[#64748b]">DEATH SAVE:</span>
            <span className="text-white font-bold">BASE {bodyVal}</span>
            {deathSavePenalty > 0 && <span className="text-[#dc2626] font-bold">+{deathSavePenalty} Pen</span>}
          </div>

          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
            <span className="text-[#64748b]">HUMANIDAD:</span>
            <span className="text-[#c084fc] font-bold">{activeChar?.currentHumanity ?? maxHumanity}/{maxHumanity}</span>
          </div>
        </div>

      </div>

      {/* =========================================================
          BLOQUE 3: DASHBOARD EN 2 COLUMNAS PARALELAS
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* COLUMNA IZQUIERDA (7 COLS): MATRIZ DE HABILIDADES COMPACTA */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="chamfer-card p-3.5 bg-[#121319] border border-[#232736]">
            
            {/* Header y Filtros */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#1f2230]">
              <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                <Crosshair className="w-4 h-4 text-[#38bdf8]" />
                <span>HABILIDADES ({filteredSkillKeys.length})</span>
              </div>

              {/* Botón expandir/colapsar todas */}
              <button
                onClick={toggleAllExpanded}
                className="text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors"
              >
                {allExpanded ? '▼ Colapsar Todas' : '▶ Expandir Todas'}
              </button>
            </div>

            {/* Sub-pestañas de filtro de categoría */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[
                { id: 'all', label: 'TODAS (16)' },
                { id: 'ranged', label: 'DISTANCIA (5)' },
                { id: 'melee', label: 'MELEE (3)' },
                { id: 'defense', label: 'DEFENSA (2)' },
                { id: 'medical', label: 'MÉDICO/TECH (3)' },
                { id: 'general', label: 'MENTE (3)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSkillFilter(tab.id as SkillFilterCategory)}
                  className={`px-2 py-0.5 rounded-2xs font-tech text-xs tracking-wider transition-all ${
                    skillFilter === tab.id
                      ? 'bg-[#dc2626] text-white font-bold'
                      : 'bg-[#181a26] text-[#94a3b8] hover:text-white border border-[#24293c]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Lista compacta de habilidades con dropdowns */}
            <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredSkillKeys.map((key) => {
                const meta = SKILL_METADATA[key];
                const lvl = activeChar?.skills?.[key] ?? 0;
                const statVal = activeChar?.stats?.[meta.stat] ?? 0;
                const baseTotal = lvl + statVal;
                const isExpanded = !!expandedSkills[key];

                return (
                  <div key={key} className="rounded-xs overflow-hidden">
                    {/* Fila compacta de 1 sola línea */}
                    <div
                      onClick={() => toggleSkillExpand(key)}
                      className={`flex items-center justify-between py-1.5 px-2.5 border transition-all cursor-pointer select-none ${
                        isExpanded
                          ? 'bg-[#181b28] border-[#38bdf8]/40'
                          : 'bg-[#151722] hover:bg-[#1a1d2c] border-[#222638]'
                      }`}
                    >
                      {/* Left: Chevron + Nombre + Stat + x2 */}
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                        )}

                        <span className="font-tech text-sm font-bold text-white tracking-wide">
                          {meta.label}
                        </span>

                        <span className="text-[10px] font-mono-code bg-[#202538] text-[#94a3b8] px-1 py-0.2 rounded">
                          {meta.stat} ({statVal})
                        </span>

                        {meta.isDoubleCost && (
                          <span className="text-[9px] font-mono-code bg-[#dc2626]/20 text-[#dc2626] px-1 rounded font-bold">
                            x2
                          </span>
                        )}
                      </div>

                      {/* Right: Stepper [- Nivel +] y BASE TOTAL */}
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 bg-[#10121a] px-1 py-0.5 rounded border border-[#202538]">
                          <button
                            onClick={() => updateSkill(key, Math.max(0, lvl - 1))}
                            className="w-4 h-4 bg-[#1f2434] hover:bg-[#dc2626] text-white rounded flex items-center justify-center text-[10px]"
                            title={`Reducir ${meta.label}`}
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-5 text-center font-mono-code text-xs font-bold text-white">
                            {lvl}
                          </span>
                          <button
                            onClick={() => updateSkill(key, lvl + 1)}
                            className="w-4 h-4 bg-[#1f2434] hover:bg-[#10b981] text-white rounded flex items-center justify-center text-[10px]"
                            title={`Aumentar ${meta.label}`}
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <span className="font-mono-code text-xs font-bold bg-[#142320] text-[#10b981] border border-[#1b3f36] px-2 py-0.5 rounded">
                          BASE {baseTotal}
                        </span>
                      </div>
                    </div>

                    {/* Dropdown de Ejemplos y Resumen */}
                    {isExpanded && (
                      <div className="p-2.5 bg-[#101218] border-x border-b border-[#222638] rounded-b-xs space-y-1.5 text-xs font-mono-code animate-fade-in">
                        <p className="text-[11px] text-[#94a3b8] font-sans leading-relaxed">
                          {meta.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {meta.examples.map((ex, idx) => (
                            <span
                              key={idx}
                              className="bg-[#171a26] border border-[#283248] px-2 py-0.5 rounded text-[10px] flex items-center gap-1.5"
                            >
                              <span className="text-[#94a3b8]">{ex.label}:</span>
                              <strong className="text-[#38bdf8] font-bold">{ex.dv}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* COLUMNA DERECHA (5 COLS): ARSENAL, BLINDAJE Y CYBERWARE */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* 1. Blindaje Activo */}
          <div className="chamfer-card p-3 bg-[#121319] border border-[#232736]">
            <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase pb-1.5 mb-2 border-b border-[#1f2230]">
              <Shield className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>BLINDAJE EQUIPADO</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
              {/* Head */}
              <div className="bg-[#171923] p-2 rounded border border-[#222636]">
                <div className="text-[10px] text-[#64748b] uppercase">CABEZA</div>
                <div className="font-tech text-sm font-bold text-white truncate">
                  {activeChar?.headArmor?.name || 'Head Armor'}
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-[#38bdf8] font-bold">
                    {activeChar?.headArmor?.currentSp}/{activeChar?.headArmor?.maxSp} SP
                  </span>
                  <button
                    onClick={() => repairArmor('head')}
                    className="text-[10px] text-[#f59e0b] hover:underline"
                  >
                    Reparar
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="bg-[#171923] p-2 rounded border border-[#222636]">
                <div className="text-[10px] text-[#64748b] uppercase">TORSO</div>
                <div className="font-tech text-sm font-bold text-white truncate">
                  {activeChar?.bodyArmor?.name || 'Body Armor'}
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-[#38bdf8] font-bold">
                    {activeChar?.bodyArmor?.currentSp}/{activeChar?.bodyArmor?.maxSp} SP
                  </span>
                  <button
                    onClick={() => repairArmor('body')}
                    className="text-[10px] text-[#f59e0b] hover:underline"
                  >
                    Reparar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Armas Equipadas */}
          <div className="chamfer-card p-3 bg-[#121319] border border-[#232736]">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#1f2230]">
              <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                <Crosshair className="w-3.5 h-3.5 text-[#dc2626]" />
                <span>ARSENAL ({activeChar?.equippedWeapons?.length ?? 0})</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {(activeChar?.equippedWeapons?.length ?? 0) === 0 ? (
                <div className="text-center py-4 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded">
                  Sin armas equipadas. Equipa desde el Compendio.
                </div>
              ) : (
                activeChar.equippedWeapons.map((w) => {
                  const breakdown = calculateWeaponAttackBreakdown(activeChar, w);
                  const isRanged = w.type === 'Ranged';

                  return (
                    <div
                      key={w.instanceId}
                      className="p-2 bg-[#171923] hover:bg-[#1a1d2a] border border-[#222636] rounded-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-tech text-sm font-bold text-white truncate">
                            {w.name}
                          </span>
                          <span className="text-[10px] font-mono-code bg-[#1f2434] text-[#38bdf8] px-1 rounded">
                            {w.damage}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono-code text-[#64748b] flex items-center gap-1.5 mt-0.5">
                          <span>ROF {w.rof}</span>
                          <span>•</span>
                          <span>{breakdown.skillLabel}</span>
                          {isRanged && (
                            <>
                              <span>•</span>
                              <span className="text-white font-bold">{w.currentMag}/{w.standardMag}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono-code text-xs font-bold bg-[#142320] text-[#10b981] border border-[#1b3f36] px-1.5 py-0.5 rounded">
                          Base {breakdown.netBase}
                        </span>

                        {isRanged && (
                          <button
                            onClick={() => reloadWeapon(w.instanceId)}
                            className="p-1 bg-[#202534] hover:bg-[#f59e0b] hover:text-black text-[#f59e0b] rounded transition-colors"
                            title="Recargar cargador"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          onClick={() => unequipWeapon(w.instanceId)}
                          className="p-1 bg-[#22181d] hover:bg-[#dc2626] text-[#dc2626] hover:text-white rounded transition-colors"
                          title="Desequipar arma"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 3. Cyberware Instalado */}
          <div className="chamfer-card p-3 bg-[#121319] border border-[#232736]">
            <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase pb-1.5 mb-2 border-b border-[#1f2230]">
              <Cpu className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>CIBERWARE INSTALADO ({activeChar?.installedCyberwareIds?.length ?? 0})</span>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {(activeChar?.installedCyberwareIds?.length ?? 0) === 0 ? (
                <div className="text-center py-4 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded">
                  Sin implantes de ciberware instalados.
                </div>
              ) : (
                activeChar.installedCyberwareIds.map((id) => {
                  const cyber = (coreData.cyberware as Array<{ id: string; name: string; type: string; humanityLoss: string }>).find(
                    (c) => c.id === id
                  );
                  const name = cyber?.name || id;
                  const hl = cyber?.humanityLoss || '2d6 (7)';
                  const type = cyber?.type || 'Prótesis';

                  return (
                    <div
                      key={id}
                      className="p-2 bg-[#171923] border border-[#222636] rounded-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-tech text-sm font-bold text-white truncate">
                          {name}
                        </div>
                        <div className="text-[10px] font-mono-code text-[#a855f7]">
                          {type} • HL: {hl}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCyberwareInstall(id)}
                        className="text-[10px] font-mono-code text-[#dc2626] hover:underline shrink-0"
                      >
                        Desinstalar
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
