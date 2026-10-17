import React, { useState, useMemo, useEffect } from 'react';
import { 
  ENEMIES_CATALOG, 
  convertEnemyToCharacterSheet,
  type EnemySheet, 
  type ThreatTier, 
  type SourceBookId,
  type EnemyCombatBase,
  type EnemyWeaponProfile
} from '../../data/enemiesCatalog';
import { useCharacterStore } from '../../store/useCharacterStore';
import type { StatKey, CharacterEra } from '../../types/cyberpunk';
import { 
  Search, 
  Heart, 
  Swords, 
  Plus, 
  Trash2, 
  Dices, 
  Target, 
  ChevronDown, 
  ChevronRight, 
  UserPlus, 
  Flame, 
  BookOpen, 
  Crosshair, 
  Check, 
  X, 
  Layers
} from 'lucide-react';

export interface ActiveEncounterEnemy {
  instanceId: string;
  catalogId: string;
  name: string;
  subtitle: string;
  faction: string;
  threatTier: ThreatTier;
  era: CharacterEra;
  role: string;
  currentHp: number;
  maxHp: number;
  currentHeadSp: number;
  maxHeadSp: number;
  currentBodySp: number;
  maxBodySp: number;
  initiative: number | null;
  stats: Record<StatKey, number>;
  weapons: EnemyWeaponProfile[];
  combatBases: EnemyCombatBase[];
  specialRules: string[];
}

export interface GmRollResult {
  actorName: string;
  type: 'attack' | 'damage' | 'initiative' | 'skill';
  actionName: string;
  d10?: number;
  baseModifier?: number;
  total: number;
  diceResults?: number[];
  formula?: string;
  notes?: string;
  timestamp: string;
}

const STORAGE_KEY = 'cpr_active_encounter_v1';

const THREAT_TIER_CONFIG: Record<ThreatTier, { label: string; badgeClass: string; borderClass: string }> = {
  mook: {
    label: 'MOOK',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-600',
    borderClass: 'border-slate-700/60'
  },
  hardened_mook: {
    label: 'HARDENED MOOK',
    badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-500/50',
    borderClass: 'border-blue-700/50'
  },
  lieutenant: {
    label: 'LIEUTENANT',
    badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-500/50',
    borderClass: 'border-purple-700/50'
  },
  hardened_lieutenant: {
    label: 'HARDENED LT.',
    badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50',
    borderClass: 'border-indigo-700/50'
  },
  mini_boss: {
    label: 'MINI-BOSS',
    badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
    borderClass: 'border-amber-700/50'
  },
  boss: {
    label: 'BOSS',
    badgeClass: 'bg-red-950/80 text-red-300 border-red-500/50',
    borderClass: 'border-red-700/50'
  },
  cyberpsycho: {
    label: 'CYBERPSYCHO',
    badgeClass: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-500/50',
    borderClass: 'border-fuchsia-700/50'
  },
  legend: {
    label: 'LEGEND (ADAM SMASHER)',
    badgeClass: 'bg-gradient-to-r from-amber-500/30 to-red-600/30 text-amber-300 border-amber-400 font-black',
    borderClass: 'border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
  }
};

const SOURCEBOOK_LABELS: Record<SourceBookId, { label: string; badgeClass: string }> = {
  core: { label: 'CORE', badgeClass: 'bg-red-950/40 text-red-400 border-red-800/50' },
  cemk_2077: { label: 'CEMK 2077', badgeClass: 'bg-cyan-950/40 text-cyan-300 border-cyan-800/50' },
  danger_gal: { label: 'DANGER GAL', badgeClass: 'bg-pink-950/40 text-pink-300 border-pink-800/50' },
  black_chrome: { label: 'BLACK CHROME', badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50' },
  interface_red: { label: 'INTERFACE RED', badgeClass: 'bg-amber-950/40 text-amber-300 border-amber-800/50' },
  dlc: { label: 'DLC / HARDENED', badgeClass: 'bg-indigo-950/40 text-indigo-300 border-indigo-800/50' }
};

function rollD10(): number {
  return Math.floor(Math.random() * 10) + 1;
}

function rollFormula(formula: string): { diceResults: number[]; total: number } {
  const match = formula.match(/(\d+)d6(?:\+(\d+))?/i);
  if (!match) {
    const fallback = parseInt(formula.replace(/\D/g, ''), 10) || 6;
    return { diceResults: [fallback], total: fallback };
  }
  const count = parseInt(match[1], 10);
  const bonus = match[2] ? parseInt(match[2], 10) : 0;
  const diceResults = Array.from({ length: count }).map(() => Math.floor(Math.random() * 6) + 1);
  const total = diceResults.reduce((a, b) => a + b, 0) + bonus;
  return { diceResults, total };
}

interface EnemiesCompendiumPanelProps {
  onSpawnToInitiative?: (enemy: EnemySheet) => void;
}

export const EnemiesCompendiumPanel: React.FC<EnemiesCompendiumPanelProps> = ({ onSpawnToInitiative }) => {
  // Store hook to import character into active roster
  const createCharacterFromWizard = useCharacterStore((state) => state.createCharacterFromWizard);

  // Active encounter enemies state with local persistence
  const [activeEnemies, setActiveEnemies] = useState<ActiveEncounterEnemy[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load active encounter:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeEnemies));
    } catch (e) {
      console.error('Failed to save active encounter:', e);
    }
  }, [activeEnemies]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreatTier, setSelectedThreatTier] = useState<ThreatTier | 'all'>('all');
  const [selectedSourceBook, setSelectedSourceBook] = useState<SourceBookId | 'all'>('all');
  const [selectedEra, setSelectedEra] = useState<CharacterEra | 'all'>('all');
  const [selectedFaction, setSelectedFaction] = useState<string>('all');

  // Expanded cards state
  const [expandedEnemyIds, setExpandedEnemyIds] = useState<Record<string, boolean>>({});
  const [isEncounterSectionOpen, setIsEncounterSectionOpen] = useState(true);

  // Last GM Roll Banner
  const [lastGmRoll, setLastGmRoll] = useState<GmRollResult | null>(null);

  // Damage injection tool state per encounter enemy
  const [damageInputByEnemy, setDamageInputByEnemy] = useState<Record<string, number>>({});
  const [damageLocationByEnemy, setDamageLocationByEnemy] = useState<Record<string, 'head' | 'body'>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Distinct Factions list
  const uniqueFactions = useMemo(() => {
    const set = new Set<string>();
    ENEMIES_CATALOG.forEach((e) => set.add(e.faction));
    return Array.from(set).sort();
  }, []);

  // Filtered Enemies
  const filteredEnemies = useMemo(() => {
    return ENEMIES_CATALOG.filter((enemy) => {
      if (selectedThreatTier !== 'all' && enemy.threatTier !== selectedThreatTier) return false;
      if (selectedSourceBook !== 'all' && enemy.sourceBook !== selectedSourceBook) return false;
      if (selectedEra !== 'all' && enemy.era !== selectedEra) return false;
      if (selectedFaction !== 'all' && enemy.faction !== selectedFaction) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = enemy.name.toLowerCase().includes(q);
        const matchSub = enemy.subtitle.toLowerCase().includes(q);
        const matchFaction = enemy.faction.toLowerCase().includes(q);
        const matchRole = enemy.role.toLowerCase().includes(q);
        const matchWeapon = enemy.weapons.some((w) => w.name.toLowerCase().includes(q));
        const matchCyber = enemy.cyberware.some((c) => c.toLowerCase().includes(q));
        const matchLore = enemy.loreSummary.toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchFaction && !matchRole && !matchWeapon && !matchCyber && !matchLore) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedThreatTier, selectedSourceBook, selectedEra, selectedFaction]);

  const toggleExpandEnemy = (id: string) => {
    setExpandedEnemyIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --------------------------------------------------------------------------
  // SPAWN LOGIC
  // --------------------------------------------------------------------------
  const spawnEnemy = (enemy: EnemySheet, count = 1) => {
    const newItems: ActiveEncounterEnemy[] = [];
    for (let i = 0; i < count; i++) {
      const suffix = count > 1 ? ` #${i + 1}` : '';
      newItems.push({
        instanceId: `enc-${enemy.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        catalogId: enemy.id,
        name: `${enemy.name}${suffix}`,
        subtitle: enemy.subtitle,
        faction: enemy.faction,
        threatTier: enemy.threatTier,
        era: enemy.era,
        role: enemy.role,
        currentHp: enemy.hp,
        maxHp: enemy.hp,
        currentHeadSp: enemy.headSp,
        maxHeadSp: enemy.headSp,
        currentBodySp: enemy.bodySp,
        maxBodySp: enemy.bodySp,
        initiative: null,
        stats: { ...enemy.stats },
        weapons: [...enemy.weapons],
        combatBases: [...enemy.combatBases],
        specialRules: [...enemy.specialRules]
      });
    }

    setActiveEnemies((prev) => [...prev, ...newItems]);
    setIsEncounterSectionOpen(true);
    showFeedback(`⚔️ Añadido(s) ${count}x "${enemy.name}" al Encuentro Activo.`);

    if (onSpawnToInitiative) {
      for (let i = 0; i < count; i++) {
        onSpawnToInitiative(enemy);
      }
    }
  };

  const removeActiveEnemy = (instanceId: string) => {
    setActiveEnemies((prev) => prev.filter((e) => e.instanceId !== instanceId));
  };

  const clearAllActiveEnemies = () => {
    if (window.confirm('¿Seguro que deseas vaciar todos los enemigos del encuentro activo?')) {
      setActiveEnemies([]);
      showFeedback('🗑️ Encuentro activo vaciado.');
    }
  };



  const rollInitiativeForEnemy = (instanceId: string) => {
    const target = activeEnemies.find((e) => e.instanceId === instanceId);
    if (!target) return;
    const d10 = rollD10();
    const ref = target.stats.REF ?? 6;
    const initTotal = d10 + ref;

    setActiveEnemies((prev) =>
      prev.map((e) => (e.instanceId === instanceId ? { ...e, initiative: initTotal } : e))
    );

    setLastGmRoll({
      actorName: target.name,
      type: 'initiative',
      actionName: 'Tirada de Iniciativa',
      d10,
      baseModifier: ref,
      total: initTotal,
      notes: `REF ${ref}`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const rollAllInitiatives = () => {
    const updated = activeEnemies.map((e) => {
      const d10 = rollD10();
      const ref = e.stats.REF ?? 6;
      return { ...e, initiative: d10 + ref };
    });
    // Sort descending
    updated.sort((a, b) => (b.initiative ?? 0) - (a.initiative ?? 0));
    setActiveEnemies(updated);
    showFeedback('🎲 Iniciativa tirada para todos los enemigos activos.');
  };

  const rollEnemyAttack = (actorName: string, weapon: EnemyWeaponProfile) => {
    const d10 = rollD10();
    const total = d10 + weapon.skillBase;

    setLastGmRoll({
      actorName,
      type: 'attack',
      actionName: `Ataque: ${weapon.name}`,
      d10,
      baseModifier: weapon.skillBase,
      total,
      notes: `ROF ${weapon.rof} · Daño base: ${weapon.damage}`,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const rollEnemyDamage = (actorName: string, weapon: EnemyWeaponProfile) => {
    const { diceResults, total } = rollFormula(weapon.damage);

    setLastGmRoll({
      actorName,
      type: 'damage',
      actionName: `Daño: ${weapon.name}`,
      diceResults,
      formula: weapon.damage,
      total,
      notes: diceResults.filter((d) => d === 6).length >= 2 ? '¡CRÍTICO DOBLE 6! (+5 HP y Lesión Crítica)' : undefined,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const rollCombatBase = (actorName: string, base: EnemyCombatBase) => {
    const d10 = rollD10();
    const total = d10 + base.totalBase;

    setLastGmRoll({
      actorName,
      type: 'skill',
      actionName: base.label,
      d10,
      baseModifier: base.totalBase,
      total,
      notes: base.damage ? `Daño: ${base.damage}` : base.notes,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  // --------------------------------------------------------------------------
  // HP & SP ABLATION
  // --------------------------------------------------------------------------
  const adjustEnemyHp = (instanceId: string, delta: number) => {
    setActiveEnemies((prev) =>
      prev.map((e) => {
        if (e.instanceId !== instanceId) return e;
        const newHp = Math.max(0, Math.min(e.maxHp, e.currentHp + delta));
        return { ...e, currentHp: newHp };
      })
    );
  };

  const adjustEnemySp = (instanceId: string, location: 'head' | 'body', delta: number) => {
    setActiveEnemies((prev) =>
      prev.map((e) => {
        if (e.instanceId !== instanceId) return e;
        if (location === 'head') {
          return { ...e, currentHeadSp: Math.max(0, Math.min(e.maxHeadSp, e.currentHeadSp + delta)) };
        } else {
          return { ...e, currentBodySp: Math.max(0, Math.min(e.maxBodySp, e.currentBodySp + delta)) };
        }
      })
    );
  };

  const applyIncomingDamageToEnemy = (instanceId: string) => {
    const target = activeEnemies.find((e) => e.instanceId === instanceId);
    if (!target) return;

    const dmg = damageInputByEnemy[instanceId] || 10;
    const loc = damageLocationByEnemy[instanceId] || 'body';
    const currentSp = loc === 'head' ? target.currentHeadSp : target.currentBodySp;

    const penetrating = Math.max(0, dmg - currentSp);
    const ablates = dmg > currentSp;
    const multipliedDmg = loc === 'head' ? penetrating * 2 : penetrating;
    const newHp = Math.max(0, target.currentHp - multipliedDmg);
    const newSp = ablates ? Math.max(0, currentSp - 1) : currentSp;

    setActiveEnemies((prev) =>
      prev.map((e) => {
        if (e.instanceId !== instanceId) return e;
        return {
          ...e,
          currentHp: newHp,
          currentHeadSp: loc === 'head' ? newSp : e.currentHeadSp,
          currentBodySp: loc === 'body' ? newSp : e.currentBodySp
        };
      })
    );

    showFeedback(
      `💥 Daño de ${dmg} a ${loc === 'head' ? 'CABEZA' : 'CUERPO'} (${target.name}): ` +
        (penetrating > 0
          ? `Penetró ${penetrating} pt(s) → ${multipliedDmg} HP perdidos, SP reducido a ${newSp}.`
          : `Blindaje SP ${currentSp} detuvo todo el impacto. Sin daño a HP.`)
    );
  };

  // --------------------------------------------------------------------------
  // IMPORT TO FULL ROSTER
  // --------------------------------------------------------------------------
  const handleImportToRoster = (enemy: EnemySheet) => {
    const sheet = convertEnemyToCharacterSheet(enemy);
    createCharacterFromWizard(sheet);
    showFeedback(`👤 Ficha "${enemy.name}" importada exitosamente al Roster activo.`);
  };

  return (
    <div className="space-y-4">
      {/* =====================================================================
          BANNER DE FEEDBACK FLOTANTE
      ===================================================================== */}
      {feedbackMessage && (
        <div className="p-3 bg-[#10b981]/15 border-2 border-[#10b981] rounded-xs text-[#10b981] font-mono-code text-xs flex items-center justify-between shadow-lg shadow-black/50 animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-[#10b981] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =====================================================================
          BANNER DE TIRADAS TÁCTICAS DEL GM
      ===================================================================== */}
      {lastGmRoll && (
        <div className="chamfer-card p-3.5 bg-[#18131d] border-2 border-[#c084fc] shadow-md shadow-[#c084fc]/10 text-white space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dices className="w-4 h-4 text-[#c084fc]" />
              <span className="font-tech text-xs font-bold uppercase tracking-wider text-[#c084fc]">
                CONSOLA DE TIRADAS DEL GM // {lastGmRoll.actorName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono-code text-slate-400">
              <span>{lastGmRoll.timestamp}</span>
              <button
                onClick={() => setLastGmRoll(null)}
                className="p-1 hover:text-white rounded bg-[#251f30] border border-[#3b314d]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d0a12] p-2.5 rounded-xs border border-[#2b2238]">
            <div>
              <span className="text-[11px] font-mono-code text-slate-300 font-bold block">
                {lastGmRoll.actionName}
              </span>
              {lastGmRoll.d10 !== undefined && (
                <span className="text-[10px] font-mono-code text-slate-400">
                  1d10 ({lastGmRoll.d10}) + Base ({lastGmRoll.baseModifier ?? 0})
                </span>
              )}
              {lastGmRoll.diceResults && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-mono-code text-slate-400">Dados ({lastGmRoll.formula}):</span>
                  {lastGmRoll.diceResults.map((d, i) => (
                    <span
                      key={i}
                      className={`w-5 h-5 flex items-center justify-center font-mono-code text-xs font-bold rounded-xs border ${
                        d === 6
                          ? 'bg-[#ef4444] text-white border-red-400'
                          : 'bg-[#1e1728] text-slate-300 border-[#3b314d]'
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[9px] font-mono-code text-slate-400 uppercase block">Resultado Final</span>
              <span className="font-tech text-2xl font-black text-[#c084fc]">
                {lastGmRoll.total} {lastGmRoll.type === 'damage' ? 'PTS' : ''}
              </span>
            </div>
          </div>

          {lastGmRoll.notes && (
            <p className="text-[10px] font-mono-code text-amber-300 bg-[#2b2210] p-1.5 rounded-xs border border-amber-600/40">
              ⚠ {lastGmRoll.notes}
            </p>
          )}
        </div>
      )}

      {/* =====================================================================
          SECCIÓN 1: TRACKER DE ENCUENTRO ACTIVO (SPAWNED ENEMIES)
      ===================================================================== */}
      <div className="chamfer-card bg-[#10121a] border border-[#23293c] p-4 space-y-3 shadow-md">
        <div
          onClick={() => setIsEncounterSectionOpen((p) => !p)}
          className="flex items-center justify-between pb-2 border-b border-[#1e2436] cursor-pointer group select-none"
        >
          <div className="flex items-center gap-2">
            {isEncounterSectionOpen ? (
              <ChevronDown className="w-4 h-4 text-[#ef4444]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#ef4444]" />
            )}
            <Swords className="w-4 h-4 text-[#ef4444]" />
            <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider">
              TRACKER DE ENCUENTRO ACTIVO // {activeEnemies.length} ENEMIGOS EN COMBATE
            </h2>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {activeEnemies.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={rollAllInitiatives}
                  className="px-2.5 py-1 bg-[#182030] hover:bg-[#38bdf8] text-[#38bdf8] hover:text-black border border-[#2b374f] font-mono-code text-[11px] font-bold rounded-xs transition-colors flex items-center gap-1"
                  title="Tirar 1d10 + REF para todos los enemigos activos"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>TIRAR TODAS INICIATIVAS</span>
                </button>
                <button
                  type="button"
                  onClick={clearAllActiveEnemies}
                  className="px-2.5 py-1 bg-[#25151c] hover:bg-[#ef4444] text-[#f87171] hover:text-white border border-[#48202d] font-mono-code text-[11px] font-bold rounded-xs transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar</span>
                </button>
              </>
            )}
          </div>
        </div>

        {isEncounterSectionOpen && (
          <>
            {activeEnemies.length === 0 ? (
              <div className="p-6 text-center font-mono-code text-xs text-slate-500 bg-[#0b0d14] rounded-xs border border-dashed border-[#23293c]">
                No hay enemigos en el encuentro activo.<br />
                Usa el <strong>Catálogo de 44 Fichas</strong> más abajo para añadir Mooks, Tenientes, Ciberpsicópatas o a <strong>Adam Smasher</strong> con 1 clic.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                {activeEnemies.map((enemy) => {
                  const tierConf = THREAT_TIER_CONFIG[enemy.threatTier];
                  const hpPercent = Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100));

                  return (
                    <div
                      key={enemy.instanceId}
                      className={`p-3 rounded-xs bg-[#131622] border ${tierConf.borderClass} space-y-2.5 transition-all shadow-sm`}
                    >
                      {/* Cabecera del Enemigo Activo */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-tech text-sm font-bold text-white truncate">
                              {enemy.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs border ${tierConf.badgeClass}`}
                            >
                              {tierConf.label}
                            </span>
                            <span className="text-[9px] font-mono-code text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-1 py-0.2 rounded-xs">
                              {enemy.era}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono-code text-slate-400 block truncate">
                            {enemy.faction} • {enemy.role}
                          </span>
                        </div>

                        {/* Iniciativa & Eliminar */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => rollInitiativeForEnemy(enemy.instanceId)}
                            className="px-2 py-0.5 bg-[#1b2234] hover:bg-[#38bdf8] text-[#38bdf8] hover:text-black border border-[#2b3952] rounded-xs font-mono-code text-xs font-bold transition-all flex items-center gap-1"
                            title="Tirar Iniciativa (1d10 + REF)"
                          >
                            <Dices className="w-3 h-3" />
                            <span>
                              {enemy.initiative !== null ? `INIT ${enemy.initiative}` : 'INIT ?'}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeActiveEnemy(enemy.instanceId)}
                            className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-red-950/30 transition-colors"
                            title="Eliminar del encuentro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Vitales: HP Bar & Head / Body SP */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-[#0c0e16] p-2 rounded-xs border border-[#1e2336] text-xs font-mono-code">
                        {/* HP Control */}
                        <div className="sm:col-span-6 space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-500" /> HP:
                            </span>
                            <span className="font-bold text-white">
                              {enemy.currentHp} / {enemy.maxHp}
                            </span>
                          </div>
                          <div className="w-full bg-[#171b26] h-2 rounded-xs overflow-hidden border border-[#282f42]">
                            <div
                              className={`h-full transition-all ${
                                hpPercent <= 25
                                  ? 'bg-red-600'
                                  : hpPercent <= 50
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${hpPercent}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1 pt-0.5">
                            <button
                              type="button"
                              onClick={() => adjustEnemyHp(enemy.instanceId, -5)}
                              className="px-1.5 py-0.2 bg-[#201518] hover:bg-red-600 text-red-300 hover:text-white rounded text-[10px] border border-red-900/50"
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              onClick={() => adjustEnemyHp(enemy.instanceId, -1)}
                              className="px-1.5 py-0.2 bg-[#201518] hover:bg-red-600 text-red-300 hover:text-white rounded text-[10px] border border-red-900/50"
                            >
                              -1
                            </button>
                            <button
                              type="button"
                              onClick={() => adjustEnemyHp(enemy.instanceId, 1)}
                              className="px-1.5 py-0.2 bg-[#122218] hover:bg-emerald-600 text-emerald-300 hover:text-white rounded text-[10px] border border-emerald-900/50"
                            >
                              +1
                            </button>
                            <button
                              type="button"
                              onClick={() => adjustEnemyHp(enemy.instanceId, 5)}
                              className="px-1.5 py-0.2 bg-[#122218] hover:bg-emerald-600 text-emerald-300 hover:text-white rounded text-[10px] border border-emerald-900/50"
                            >
                              +5
                            </button>
                          </div>
                        </div>

                        {/* SP Control */}
                        <div className="sm:col-span-6 grid grid-cols-2 gap-1.5 text-[10px]">
                          {/* Head SP */}
                          <div className="bg-[#141824] p-1 rounded border border-[#22293d] space-y-0.5">
                            <span className="text-slate-400 block truncate">CABEZA SP</span>
                            <div className="flex items-center justify-between font-bold text-[#38bdf8]">
                              <span>{enemy.currentHeadSp}</span>
                              <div className="flex gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => adjustEnemySp(enemy.instanceId, 'head', -1)}
                                  className="px-1 bg-[#1a2130] hover:bg-red-600 hover:text-white rounded"
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  onClick={() => adjustEnemySp(enemy.instanceId, 'head', 1)}
                                  className="px-1 bg-[#1a2130] hover:bg-emerald-600 hover:text-white rounded"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Body SP */}
                          <div className="bg-[#141824] p-1 rounded border border-[#22293d] space-y-0.5">
                            <span className="text-slate-400 block truncate">CUERPO SP</span>
                            <div className="flex items-center justify-between font-bold text-[#38bdf8]">
                              <span>{enemy.currentBodySp}</span>
                              <div className="flex gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => adjustEnemySp(enemy.instanceId, 'body', -1)}
                                  className="px-1 bg-[#1a2130] hover:bg-red-600 hover:text-white rounded"
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  onClick={() => adjustEnemySp(enemy.instanceId, 'body', 1)}
                                  className="px-1 bg-[#1a2130] hover:bg-emerald-600 hover:text-white rounded"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Inyector de Daño Entrante con Ablación Automática */}
                      <div className="p-2 bg-[#17141d] rounded-xs border border-[#2f223d] flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
                        <span className="text-[10px] text-amber-300 font-bold uppercase flex items-center gap-1">
                          <Crosshair className="w-3.5 h-3.5" /> APLICAR DAÑO:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={damageInputByEnemy[enemy.instanceId] ?? 10}
                            onChange={(e) =>
                              setDamageInputByEnemy({
                                ...damageInputByEnemy,
                                [enemy.instanceId]: parseInt(e.target.value) || 0
                              })
                            }
                            className="w-14 px-1.5 py-0.5 bg-[#0b0c12] border border-[#3b2d4c] rounded text-white text-center font-bold text-xs"
                          />
                          <select
                            value={damageLocationByEnemy[enemy.instanceId] || 'body'}
                            onChange={(e) =>
                              setDamageLocationByEnemy({
                                ...damageLocationByEnemy,
                                [enemy.instanceId]: e.target.value as 'head' | 'body'
                              })
                            }
                            className="px-1.5 py-0.5 bg-[#0b0c12] border border-[#3b2d4c] rounded text-slate-300 text-[11px]"
                          >
                            <option value="body">Cuerpo (SP {enemy.currentBodySp})</option>
                            <option value="head">Cabeza (x2 HP, SP {enemy.currentHeadSp})</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => applyIncomingDamageToEnemy(enemy.instanceId)}
                            className="px-2 py-0.5 bg-[#ef4444] hover:bg-white text-white hover:text-black font-tech font-bold text-xs uppercase rounded transition-colors"
                          >
                            Impactar
                          </button>
                        </div>
                      </div>

                      {/* Botones de Ataque del Arsenal Activo */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono-code text-slate-400 block uppercase font-bold">
                          Armas en combate:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {enemy.weapons.map((w, idx) => (
                            <div
                              key={idx}
                              className="bg-[#171b29] p-1.5 rounded-xs border border-[#242d44] flex items-center justify-between text-[11px] font-mono-code"
                            >
                              <div className="truncate mr-1">
                                <span className="font-bold text-slate-200 block truncate">{w.name}</span>
                                <span className="text-[9px] text-slate-400">
                                  +{w.skillBase} · {w.damage}
                                </span>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => rollEnemyAttack(enemy.name, w)}
                                  className="px-1.5 py-0.5 bg-[#ef4444]/20 hover:bg-[#ef4444] text-[#fca5a5] hover:text-white border border-[#ef4444]/40 rounded text-[10px] font-bold"
                                  title="Tirar ataque 1d10 + skillBase"
                                >
                                  🎯 1d10+{w.skillBase}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => rollEnemyDamage(enemy.name, w)}
                                  className="px-1.5 py-0.5 bg-[#38bdf8]/20 hover:bg-[#38bdf8] text-[#7dd3fc] hover:text-black border border-[#38bdf8]/40 rounded text-[10px] font-bold"
                                  title={`Tirar daño ${w.damage}`}
                                >
                                  💥 {w.damage}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* =====================================================================
          SECCIÓN 2: CATÁLOGO MASTER DE 44 ENEMIGOS, GOONS Y JEFES
      ===================================================================== */}
      <div className="chamfer-card bg-[#0e1017] border border-[#202538] p-4 space-y-4">
        {/* Cabecera & Contador */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b2030]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                COMPENDIO TÁCTICO DE ENEMIGOS, GOONS & JEFES
              </h2>
              <p className="text-[11px] font-mono-code text-slate-400">
                44 fichas canónicas integradas: Core, Danger Gal Dossier, CEMK 2077 y DLCs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-xs font-bold">
              {filteredEnemies.length} / {ENEMIES_CATALOG.length} Fichas
            </span>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs font-mono-code">
          {/* Búsqueda de texto */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nombre, facción, ciberware..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121520] border border-[#23293c] text-white pl-8 pr-3 py-1.5 rounded-xs focus:outline-none focus:border-amber-400 text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro Threat Tier */}
          <div className="md:col-span-3">
            <select
              value={selectedThreatTier}
              onChange={(e) => setSelectedThreatTier(e.target.value as ThreatTier | 'all')}
              className="w-full bg-[#121520] border border-[#23293c] text-slate-200 py-1.5 px-2 rounded-xs focus:outline-none focus:border-amber-400 text-xs"
            >
              <option value="all">Nivel de Amenaza: Todos</option>
              <option value="mook">Mooks (Básico)</option>
              <option value="hardened_mook">Hardened Mooks</option>
              <option value="lieutenant">Lieutenants (Tenientes)</option>
              <option value="hardened_lieutenant">Hardened Lieutenants</option>
              <option value="mini_boss">Mini-Bosses</option>
              <option value="boss">Bosses (Jefes)</option>
              <option value="cyberpsycho">Cyberpsychos (Ciberpsicópatas)</option>
              <option value="legend">Leyendas (Adam Smasher)</option>
            </select>
          </div>

          {/* Filtro Manual */}
          <div className="md:col-span-3">
            <select
              value={selectedSourceBook}
              onChange={(e) => setSelectedSourceBook(e.target.value as SourceBookId | 'all')}
              className="w-full bg-[#121520] border border-[#23293c] text-slate-200 py-1.5 px-2 rounded-xs focus:outline-none focus:border-amber-400 text-xs"
            >
              <option value="all">Manual: Todos</option>
              <option value="core">Core Rulebook (2045)</option>
              <option value="cemk_2077">CEMK 2077 (Edgerunners)</option>
              <option value="danger_gal">Danger Gal Dossier</option>
              <option value="black_chrome">Black Chrome</option>
              <option value="interface_red">Interface RED</option>
              <option value="dlc">DLC / Hardened Rules</option>
            </select>
          </div>

          {/* Filtro Era */}
          <div className="md:col-span-2">
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value as CharacterEra | 'all')}
              className="w-full bg-[#121520] border border-[#23293c] text-slate-200 py-1.5 px-2 rounded-xs focus:outline-none focus:border-amber-400 text-xs"
            >
              <option value="all">Era: Todas</option>
              <option value="2045">2045 RED</option>
              <option value="2077">2077 CEMK</option>
            </select>
          </div>
        </div>

        {/* Selector de Facción Rápida */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#1a1f2e] text-[10px] font-mono-code">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-400" /> Facción:
          </span>
          <button
            type="button"
            onClick={() => setSelectedFaction('all')}
            className={`px-2 py-0.5 rounded-xs transition-colors ${
              selectedFaction === 'all'
                ? 'bg-amber-400 text-black font-bold'
                : 'bg-[#151926] text-slate-400 hover:text-white border border-[#232a3d]'
            }`}
          >
            Todas ({ENEMIES_CATALOG.length})
          </button>
          {uniqueFactions.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFaction(f)}
              className={`px-2 py-0.5 rounded-xs transition-colors ${
                selectedFaction === f
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-[#151926] text-slate-400 hover:text-white border border-[#232a3d]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Listado de Tarjetas de Enemigos */}
        <div className="space-y-3 pt-2">
          {filteredEnemies.map((enemy) => {
            const isExpanded = !!expandedEnemyIds[enemy.id];
            const tierConf = THREAT_TIER_CONFIG[enemy.threatTier];
            const bookConf = SOURCEBOOK_LABELS[enemy.sourceBook];

            return (
              <div
                key={enemy.id}
                className={`chamfer-card bg-[#12141f] border ${tierConf.borderClass} transition-all duration-150`}
              >
                {/* Cabecera de Tarjeta Compacta */}
                <div
                  onClick={() => toggleExpandEnemy(enemy.id)}
                  className="p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer group select-none hover:bg-[#161a29]/60 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="pt-0.5 text-slate-400 group-hover:text-amber-400 transition-colors">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-amber-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-tech text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {enemy.name}
                        </span>
                        <span
                          className={`text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs border ${tierConf.badgeClass}`}
                        >
                          {tierConf.label}
                        </span>
                        <span
                          className={`text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs border ${bookConf.badgeClass}`}
                        >
                          {bookConf.label}
                        </span>
                        <span className="text-[9px] font-mono-code text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.2 rounded-xs">
                          {enemy.era}
                        </span>
                      </div>

                      <p className="text-[11px] font-mono-code text-slate-400">
                        <strong className="text-slate-300">{enemy.faction}</strong> • {enemy.subtitle}
                      </p>

                      {/* Píldoras rápidas de combate */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono-code pt-0.5">
                        <span className="bg-[#1e1724] border border-[#3b2446] text-red-300 px-1.5 py-0.2 rounded-xs font-bold">
                          HP: {enemy.hp}
                        </span>
                        <span className="bg-[#141b29] border border-[#23314d] text-[#38bdf8] px-1.5 py-0.2 rounded-xs font-bold">
                          SP: C{enemy.headSp} / T{enemy.bodySp}
                        </span>
                        <span className="bg-[#151c1c] border border-[#233838] text-emerald-300 px-1.5 py-0.2 rounded-xs">
                          Armas: {enemy.weapons.map((w) => w.name).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones Rápidos de Spawneo (Sin expandir) */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => spawnEnemy(enemy, 1)}
                      className="px-2.5 py-1.5 bg-[#ef4444] hover:bg-white text-white hover:text-black font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-all flex items-center gap-1 shadow-sm active:scale-95"
                      title="Añadir 1 copia al encuentro activo"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+1 Encuentro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => spawnEnemy(enemy, 3)}
                      className="px-2 py-1.5 bg-[#251b2d] hover:bg-[#c084fc] text-[#c084fc] hover:text-black border border-[#482b5a] font-mono-code font-bold text-xs rounded-xs transition-all active:scale-95"
                      title="Spawnear escuadrón de 3 goons"
                    >
                      +x3
                    </button>
                  </div>
                </div>

                {/* Contenido Desplegable Completo de la Ficha */}
                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-[#1c2236] bg-[#0c0e17] space-y-4 font-mono-code text-xs">
                    {/* Lore & Tácticas */}
                    <div className="p-3 bg-[#131622] rounded-xs border-l-4 border-amber-400 space-y-1">
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                        LORE & TÁCTICAS DE COMBATE:
                      </span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{enemy.loreSummary}</p>
                    </div>

                    {/* Reglas Especiales */}
                    {enemy.specialRules.length > 0 && (
                      <div className="p-3 bg-[#1b1522] rounded-xs border border-[#44284d] space-y-1.5">
                        <span className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-[#c084fc]" /> REGLAS ESPECIALES & INMUNIDADES:
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {enemy.specialRules.map((rule, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <span className="text-[#c084fc] font-bold shrink-0">▸</span>
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 10 STATS COMPLETAS */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        ESTADÍSTICAS OFICIALES (10 STATS):
                      </span>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-center">
                        {(Object.keys(enemy.stats) as StatKey[]).map((statKey) => (
                          <div
                            key={statKey}
                            className="bg-[#141824] p-1.5 rounded-xs border border-[#232b3f] space-y-0.5"
                          >
                            <span className="text-[9px] text-slate-400 block font-bold">{statKey}</span>
                            <span className="font-tech text-base font-black text-white">
                              {enemy.stats[statKey]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bases de Combate y Habilidades */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        HABILIDADES DE COMBATE & TIRADOR RÁPIDO:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {enemy.combatBases.map((base, bIdx) => (
                          <button
                            key={bIdx}
                            type="button"
                            onClick={() => rollCombatBase(enemy.name, base)}
                            className="p-2 bg-[#141724] hover:bg-[#38bdf8] text-slate-300 hover:text-black border border-[#242b40] rounded-xs text-left transition-all flex items-center justify-between group/base"
                          >
                            <div className="min-w-0 flex-1 truncate pr-1">
                              <span className="font-bold text-xs block truncate text-slate-200 group-hover/base:text-black">
                                {base.label}
                              </span>
                              <span className="text-[10px] text-slate-400 group-hover/base:text-black">
                                Base: +{base.totalBase} {base.damage ? `(${base.damage})` : ''}
                              </span>
                            </div>
                            <span className="px-1.5 py-0.5 bg-[#1b2234] group-hover/base:bg-black group-hover/base:text-white rounded text-[10px] font-bold text-[#38bdf8]">
                              🎲 1d10+{base.totalBase}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Arsenal / Weapons Table */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        ARSENAL & TIRADA DE ATAQUE / DAÑO:
                      </span>
                      <div className="space-y-1.5">
                        {enemy.weapons.map((w, wIdx) => (
                          <div
                            key={wIdx}
                            className="p-2 bg-[#151926] rounded-xs border border-[#232b40] flex flex-wrap items-center justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-white text-xs block">{w.name}</span>
                              <span className="text-[10px] text-slate-400">
                                Base Ataque: <strong>+{w.skillBase}</strong> • Daño: <strong>{w.damage}</strong> • ROF: {w.rof} • Mag: {w.mag > 0 ? w.mag : 'N/A'}
                              </span>
                              {w.notes && (
                                <p className="text-[9px] text-amber-300 mt-0.5">{w.notes}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => rollEnemyAttack(enemy.name, w)}
                                className="px-2.5 py-1 bg-[#ef4444] hover:bg-white text-white hover:text-black font-tech font-bold text-xs uppercase rounded transition-colors flex items-center gap-1"
                              >
                                <Target className="w-3.5 h-3.5" />
                                <span>🎯 Atacar (+{w.skillBase})</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => rollEnemyDamage(enemy.name, w)}
                                className="px-2.5 py-1 bg-[#38bdf8] hover:bg-white text-black font-tech font-bold text-xs uppercase rounded transition-colors flex items-center gap-1"
                              >
                                <Dices className="w-3.5 h-3.5" />
                                <span>💥 Daño ({w.damage})</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ciberware & Equipo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      {/* Ciberware */}
                      <div className="p-2.5 bg-[#121522] rounded-xs border border-[#232a3f] space-y-1">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase block">
                          CIBERWARE INSTALADO:
                        </span>
                        {enemy.cyberware.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {enemy.cyberware.map((c, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 rounded-xs text-[10px]"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Sin ciberware significativo.</span>
                        )}
                      </div>

                      {/* Equipo */}
                      <div className="p-2.5 bg-[#121522] rounded-xs border border-[#232a3f] space-y-1">
                        <span className="text-[10px] font-bold text-slate-300 uppercase block">
                          EQUIPO & ITEMS:
                        </span>
                        {enemy.gear.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {enemy.gear.map((g, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-[#1b2030] text-slate-300 border border-[#28324a] rounded-xs text-[10px]"
                              >
                                {g}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Equipo estándar.</span>
                        )}
                      </div>
                    </div>

                    {/* Botones de Acción Principal de la Ficha */}
                    <div className="pt-2 border-t border-[#1e2436] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => spawnEnemy(enemy, 1)}
                          className="px-3 py-1.5 bg-[#ef4444] hover:bg-white text-white hover:text-black font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>⚔️ ENVIAR AL ENCUENTRO ACTIVO (1x)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => spawnEnemy(enemy, 3)}
                          className="px-3 py-1.5 bg-[#2a1e35] hover:bg-[#c084fc] text-[#c084fc] hover:text-black border border-[#482d5e] font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1"
                        >
                          <span>+x3 ESCUADRÓN</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleImportToRoster(enemy)}
                        className="px-3 py-1.5 bg-[#162520] hover:bg-[#10b981] text-[#10b981] hover:text-black border border-[#1d4434] font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5"
                        title="Convierte a este enemigo en una hoja completa de personaje e insértala en el Roster de Zustand"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>👤 IMPORTAR COMO FICHA JUGABLE AL ROSTER</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredEnemies.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-mono-code text-xs bg-[#12141f] rounded-xs border border-[#23293c] space-y-2">
              <p>No se encontraron enemigos que coincidan con los filtros aplicados.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedThreatTier('all');
                  setSelectedSourceBook('all');
                  setSelectedEra('all');
                  setSelectedFaction('all');
                }}
                className="text-amber-400 hover:underline"
              >
                Restablecer todos los filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
