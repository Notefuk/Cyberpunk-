import React, { useState, useMemo } from 'react';
import { useDebouncedLocalStorage } from '../../hooks/useDebouncedLocalStorage';
import { useEncounterStore, encounterEnemies, type EncounterEnemy } from '../../store/encounterStore';
import { 
  ENEMIES_CATALOG, 
  DANGER_GAL_15_FACTIONS,
  convertEnemyToCharacterSheet,
  type EnemySheet, 
  type ThreatTier, 
  type SourceBookId,
  type EnemyCombatBase,
  type EnemyWeaponProfile
} from '../../data/enemiesCatalog';
import { useCharacterStore } from '../../store/useCharacterStore';
import { portEnemyToCemk } from '../../engine/cemkPort';
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
  Layers,
  Wrench
} from 'lucide-react';

// v5.1.0 [Claude Code · 2026-10-27]: el encuentro vive en store/encounterStore.ts.
export type ActiveEncounterEnemy = EncounterEnemy;

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
  hardened_mini_boss: {
    label: 'Hardened Mini-Boss',
    badgeClass: 'bg-orange-950/80 text-orange-300 border-orange-500/50',
    borderClass: 'border-orange-700/50'
  },
  hardened_boss: {
    label: 'Hardened Boss',
    badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
    borderClass: 'border-rose-700/50'
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
  /** v5.1.0 [Claude Code · 2026-10-27]: el Fixer tira la iniciativa (1d10 + REF) de cada enemigo al agregarlo. */
  autoRollInitiative?: boolean;
}

const ENEMY_SHEET_MODE_KEY = 'cpr_enemy_sheet_mode_v1';
type EnemySheetMode = 'cemk' | 'red';

// Vista de la ficha de un PNJ en modo CEMK (porte, plan 6) o RED (datos originales del libro).
const EnemyPortView: React.FC<{ enemy: EnemySheet; mode: EnemySheetMode }> = ({ enemy, mode }) => {
  const port = useMemo(() => portEnemyToCemk(enemy), [enemy]);
  const [notesOpen, setNotesOpen] = useState(false);
  const source = enemy.sourcePage ? (
    <p className="text-[10px] text-slate-500">
      Fuente: {enemy.sourceBookTitle} p.{enemy.sourcePage}
    </p>
  ) : null;

  if (mode === 'red') {
    return (
      <div className="p-3 bg-[#131622] rounded-xs border border-[#232b3f] space-y-2 text-[11px]">
        <span className="text-[10px] font-bold text-slate-300 uppercase block">FICHA RED ORIGINAL (LIBRO):</span>
        <p className="text-slate-300">
          HP {enemy.hp} • Herida grave {enemy.seriouslyWounded} • Death Save {enemy.deathSave} • SP C{enemy.headSp} / T{enemy.bodySp}
          {enemy.stats.LUCK !== undefined && <> • LUCK {enemy.stats.LUCK}</>}
          {enemy.luck !== undefined && enemy.stats.LUCK === undefined && <> • LUCK {enemy.luck}</>}
        </p>
        {enemy.roleAbility && (
          <p className="text-slate-300">Role Ability: {enemy.roleAbility.name} rank {enemy.roleAbility.rank}</p>
        )}
        {enemy.skillBases && Object.keys(enemy.skillBases).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(enemy.skillBases).map(([k, v]) => (
              <span key={k} className="px-1.5 py-0.5 bg-[#1b2030] text-slate-300 border border-[#28324a] rounded-xs text-[10px]">
                {k} +{v}
              </span>
            ))}
          </div>
        )}
        {enemy.cyberdeckPrograms && enemy.cyberdeckPrograms.length > 0 && (
          <p className="text-slate-300">Cyberdeck (programas): {enemy.cyberdeckPrograms.join(', ')}</p>
        )}
        {source}
      </div>
    );
  }

  return (
    <div className="p-3 bg-[#0f1d24] rounded-xs border border-cyan-800/40 space-y-2 text-[11px]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs border bg-cyan-950/60 text-cyan-300 border-cyan-500/50">
          NEUROPORT · HACKEABLE
        </span>
        <span className="text-[10px] font-bold text-cyan-300 uppercase">PORTE CEMK</span>
      </div>
      <p className="text-slate-300">
        SP {port.headSp}/{port.bodySp} • vs melee {port.headSpVsMelee}/{port.bodySpVsMelee}
      </p>
      <div className="space-y-0.5">
        {port.weapons.map((w, i) => (
          <p key={i} className="text-slate-300">
            <span className="px-1 py-0.5 mr-1.5 bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 rounded-xs text-[9px] font-bold">
              {w.weaponType2077}
            </span>
            {w.name} ({w.damage})
          </p>
        ))}
      </div>
      {port.isNetrunner && (
        <div className="space-y-1">
          <p className="text-[#c084fc]">
            Interface {port.interfaceRank} • {port.netActionsPerTurn} NET Actions • Cyberdeck Port {port.cyberdeckPortRangeM} m • Quickhacks hasta DV{port.maxQuickhackDv}
          </p>
          {port.availableQuickhacks.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {port.availableQuickhacks.map((q) => (
                <span key={q} className="px-1.5 py-0.5 bg-[#1b1522] text-[#c084fc] border border-[#44284d] rounded-xs text-[10px]">
                  {q}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {port.selfIcePasswalls.length > 0 && (
        <p className="text-amber-300">Passwall {port.selfIcePasswalls.map((p) => `DV ${p.dv}`).join(' / ')}</p>
      )}
      <div>
        <button
          type="button"
          onClick={() => setNotesOpen((v) => !v)}
          className="text-[10px] font-bold text-slate-400 hover:text-amber-400 uppercase flex items-center gap-1"
        >
          {notesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          Reglas de porte
        </button>
        {notesOpen && (
          <ul className="mt-1 space-y-0.5 text-slate-400">
            {port.notes.map((n, i) => (
              <li key={i}>▸ {n}</li>
            ))}
          </ul>
        )}
      </div>
      {source}
    </div>
  );
};

export const EnemiesCompendiumPanel: React.FC<EnemiesCompendiumPanelProps> = ({ autoRollInitiative }) => {
  // Store hook to import character into active roster
  const createCharacterFromWizard = useCharacterStore((state) => state.createCharacterFromWizard);

  // v5.1.0 [Claude Code · 2026-10-27]: encuentro unificado en useEncounterStore.
  const combatants = useEncounterStore((s) => s.combatants);
  const activeEnemies = useMemo(() => encounterEnemies({ combatants }), [combatants]);

  // Filter states
  const [sheetMode, setSheetModeState] = useState<EnemySheetMode>(() => {
    try {
      return localStorage.getItem(ENEMY_SHEET_MODE_KEY) === 'red' ? 'red' : 'cemk';
    } catch {
      return 'cemk';
    }
  });
  const setSheetMode = (m: EnemySheetMode) => {
    setSheetModeState(m);
    try {
      localStorage.setItem(ENEMY_SHEET_MODE_KEY, m);
    } catch {
      /* sin persistencia */
    }
  };
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

  // Custom NPCs state with persistence
  const [customNpcs, setCustomNpcs] = useState<EnemySheet[]>(() => {
    try {
      const saved = localStorage.getItem('cpr_custom_npcs_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load custom npcs:', e);
    }
    return [];
  });

  useDebouncedLocalStorage('cpr_custom_npcs_v1', customNpcs);

  const [isCustomNpcModalOpen, setIsCustomNpcModalOpen] = useState(false);
  const [customNpcForm, setCustomNpcForm] = useState({
    name: '',
    subtitle: 'Mercenario Independiente',
    faction: 'Danger Gal Operations',
    threatTier: 'mook' as ThreatTier,
    era: '2045' as CharacterEra,
    role: 'Solo',
    hp: 35,
    headSp: 7,
    bodySp: 11,
    weaponName: 'Heavy Pistol Arasaka',
    weaponSkillBase: 12,
    weaponDamage: '3d6',
    weaponRof: 2,
    combatBaseLabel: 'Handgun',
    combatBaseTotal: 12,
    int: 5,
    ref: 7,
    dex: 6,
    tech: 4,
    cool: 6,
    will: 6,
    luck: 5,
    move: 6,
    body: 7,
    emp: 5,
    specialRules: 'Reflejos aumentados, blindaje subdérmico.',
    loreSummary: 'Operativo contratado para misiones de asalto o escolta táctica en Night City.'
  });

  const handleSaveCustomNpc = () => {
    if (!customNpcForm.name.trim()) {
      showFeedback('⚠ Error: El PNJ debe tener un nombre.');
      return;
    }
    const newEnemy: EnemySheet = {
      id: `custom-npc-${Date.now()}`,
      name: customNpcForm.name.trim(),
      subtitle: customNpcForm.subtitle.trim() || 'PNJ Personalizado',
      faction: customNpcForm.faction.trim() || 'Independiente',
      threatTier: customNpcForm.threatTier,
      sourceBook: 'dlc',
      sourceBookTitle: 'Homebrew DLC',
      era: customNpcForm.era,
      role: customNpcForm.role.trim() || 'Solo',
      hp: customNpcForm.hp,
      seriouslyWounded: Math.ceil(customNpcForm.hp / 2),
      deathSave: customNpcForm.body,
      headSp: customNpcForm.headSp,
      bodySp: customNpcForm.bodySp,
      stats: {
        INT: customNpcForm.int,
        REF: customNpcForm.ref,
        DEX: customNpcForm.dex,
        TECH: customNpcForm.tech,
        COOL: customNpcForm.cool,
        WILL: customNpcForm.will,
        LUCK: customNpcForm.luck,
        MOVE: customNpcForm.move,
        BODY: customNpcForm.body,
        EMP: customNpcForm.emp
      },
      combatBases: [
        {
          label: customNpcForm.combatBaseLabel || 'Combate',
          totalBase: customNpcForm.combatBaseTotal,
          damage: customNpcForm.weaponDamage,
          rof: customNpcForm.weaponRof
        }
      ],
      weapons: [
        {
          name: customNpcForm.weaponName || 'Arma Estándar',
          skillBase: customNpcForm.weaponSkillBase,
          damage: customNpcForm.weaponDamage,
          rof: customNpcForm.weaponRof,
          mag: 12
        }
      ],
      cyberware: [],
      gear: ['Teléfono Agent', '100 €$'],
      specialRules: customNpcForm.specialRules ? [customNpcForm.specialRules] : [],
      loreSummary: customNpcForm.loreSummary || 'Ficha de PNJ creada por el GM.'
    };

    setCustomNpcs((prev) => [newEnemy, ...prev]);
    setIsCustomNpcModalOpen(false);
    showFeedback(`✅ PNJ personalizado "${newEnemy.name}" guardado exitosamente.`);
  };

  const handleDeleteCustomNpc = (npcId: string) => {
    setCustomNpcs((prev) => prev.filter((n) => n.id !== npcId));
    showFeedback('🗑️ PNJ personalizado eliminado.');
  };

  // Combined Catalog (Custom NPCs + Canonical Enemies)
  const combinedCatalog = useMemo(() => {
    return [...customNpcs, ...ENEMIES_CATALOG];
  }, [customNpcs]);

  // Filtered Enemies
  const filteredEnemies = useMemo(() => {
    return combinedCatalog.filter((enemy) => {
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
  }, [combinedCatalog, searchQuery, selectedThreatTier, selectedSourceBook, selectedEra, selectedFaction]);

  const toggleExpandEnemy = (id: string) => {
    setExpandedEnemyIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --------------------------------------------------------------------------
  // SPAWN LOGIC
  // --------------------------------------------------------------------------
  const spawnEnemy = (enemy: EnemySheet, count = 1) => {
    const ids = useEncounterStore.getState().addEnemyFromCatalog(enemy, count);
    setIsEncounterSectionOpen(true);
    showFeedback(`⚔️ Añadido(s) ${count}x "${enemy.name}" al Encuentro Activo.`);

    if (autoRollInitiative) {
      for (const id of ids) useEncounterStore.getState().setInitiative(id, rollD10() + (enemy.stats.REF ?? 6));
    }
  };

  const removeActiveEnemy = (instanceId: string) => {
    useEncounterStore.getState().remove(instanceId);
  };

  const clearAllActiveEnemies = () => {
    if (window.confirm('¿Seguro que deseas vaciar todos los enemigos del encuentro activo?')) {
      useEncounterStore.getState().clearEnemies();
      showFeedback('🗑️ Encuentro activo vaciado.');
    }
  };



  const rollInitiativeForEnemy = (instanceId: string) => {
    const target = activeEnemies.find((e) => e.instanceId === instanceId);
    if (!target) return;
    const d10 = rollD10();
    const ref = target.stats.REF ?? 6;
    const initTotal = d10 + ref;

    useEncounterStore.getState().setInitiative(instanceId, initTotal);

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
    activeEnemies.forEach((e) => {
      useEncounterStore.getState().setInitiative(e.instanceId, rollD10() + (e.stats.REF ?? 6));
    });
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
    useEncounterStore.getState().adjustEnemyHp(instanceId, delta);
  };

  const adjustEnemySp = (instanceId: string, location: 'head' | 'body', delta: number) => {
    useEncounterStore.getState().adjustEnemySp(instanceId, location, delta);
  };

  const applyIncomingDamageToEnemy = (instanceId: string) => {
    const target = activeEnemies.find((e) => e.instanceId === instanceId);
    if (!target) return;

    const dmg = damageInputByEnemy[instanceId] || 10;
    const loc = damageLocationByEnemy[instanceId] || 'body';
    const currentSp = loc === 'head' ? target.currentHeadSp : target.currentBodySp;

    const r = useEncounterStore.getState().applyEnemyDamage(instanceId, dmg, loc);
    if (!r) return;
    const { penetrating, hpLost: multipliedDmg, newSp } = r;

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
                COMPENDIO TÁCTICO // 15 FACCIONES & 128 NPCS CANÓNICOS
              </h2>
              <p className="text-[11px] font-mono-code text-slate-400">
                Danger Gal Dossier completo (15 Facciones), Core 2045, CEMK 2077 y Creador de PNJ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomNpcModalOpen(true)}
              className="px-3 py-1.5 bg-[#10b981] hover:bg-white text-black font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>🛠️ CREAR PNJ PERSONALIZADO</span>
            </button>
            <span className="text-xs font-mono-code text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1.5 rounded-xs font-bold">
              {filteredEnemies.length} / {combinedCatalog.length} Fichas
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

        {/* Barra de 15 Facciones Danger Gal Dossier */}
        <div className="space-y-1.5 pt-1 border-t border-[#1a1f2e]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-pink-400" />
              15 FACCIONES OFICIALES // DANGER GAL DOSSIER:
            </span>
            {selectedFaction !== 'all' && (
              <button
                onClick={() => setSelectedFaction('all')}
                className="text-[10px] font-mono-code text-red-400 hover:text-white underline cursor-pointer"
              >
                Limpiar filtro ({selectedFaction})
              </button>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedFaction('all')}
              className={`px-2.5 py-1 rounded-xs text-[11px] font-mono-code font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedFaction === 'all'
                  ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                  : 'bg-[#121520] text-slate-400 border-[#23293c] hover:bg-[#1a2030] hover:text-white'
              }`}
            >
              TODAS ({combinedCatalog.length})
            </button>
            {DANGER_GAL_15_FACTIONS.map((fac) => {
              const count = combinedCatalog.filter((e) => e.faction.toLowerCase().includes(fac.name.toLowerCase()) || fac.name.toLowerCase().includes(e.faction.toLowerCase())).length;
              const isSelected = selectedFaction === fac.name;
              return (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => setSelectedFaction(isSelected ? 'all' : fac.name)}
                  className={`px-2.5 py-1 rounded-xs text-[11px] font-mono-code font-bold whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? 'text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                      : 'bg-[#121520] text-slate-300 border-[#23293c] hover:bg-[#1a2030]'
                  }`}
                  style={{
                    borderColor: isSelected ? fac.threatColor : '#23293c',
                    backgroundColor: isSelected ? `${fac.threatColor}33` : undefined
                  }}
                  title={`${fac.name} — Territorio: ${fac.territory}`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: fac.threatColor }}
                  />
                  <span>{fac.name}</span>
                  <span className="text-[9px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
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
                        {customNpcs.some((c) => c.id === enemy.id) && (
                          <span className="text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs border bg-emerald-950/60 text-emerald-300 border-emerald-500/50">
                            🛠️ PNJ PERSONALIZADO
                          </span>
                        )}
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
                    {customNpcs.some((c) => c.id === enemy.id) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomNpc(enemy.id)}
                        className="p-1.5 bg-[#25151c] hover:bg-[#ef4444] text-[#f87171] hover:text-white border border-[#48202d] rounded-xs transition-colors"
                        title="Eliminar PNJ personalizado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Contenido Desplegable Completo de la Ficha */}
                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-[#1c2236] bg-[#0c0e17] space-y-4 font-mono-code text-xs">
                    {/* Selector de modo de ficha: porte CEMK / original RED */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">FICHA:</span>
                      {(['cemk', 'red'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSheetMode(m)}
                          className={`px-2 py-0.5 rounded-xs border text-[10px] font-bold uppercase transition-colors ${
                            sheetMode === m
                              ? 'bg-amber-400 text-black border-amber-400'
                              : 'bg-[#141824] text-slate-400 border-[#232b3f] hover:text-amber-400'
                          }`}
                        >
                          {m === 'cemk' ? 'CEMK' : 'RED'}
                        </button>
                      ))}
                    </div>
                    <EnemyPortView enemy={enemy} mode={sheetMode} />

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

      {/* =====================================================================
          MODAL: CREADOR DE PNJ PERSONALIZADO (CUSTOM NPC CREATOR)
      ===================================================================== */}
      {isCustomNpcModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#0e1017] border-2 border-[#10b981] w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xs p-5 shadow-2xl space-y-4 font-mono-code text-xs text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2638]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#10b981]/20 border border-[#10b981] rounded-xs text-[#10b981]">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-tech text-base font-black text-white uppercase tracking-wider">
                    🛠️ CREADOR DE PNJ PERSONALIZADO // COMBAT READY
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Crea fichas tácticas a medida y guárdalas en tu base de datos local
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomNpcModalOpen(false)}
                className="p-1 hover:bg-[#20273a] text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <div className="space-y-4">
              {/* Sección 1: Identidad Básica */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase text-[#10b981] font-bold block">
                    Nombre del PNJ *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Teniente Grigori, Razor Jack..."
                    value={customNpcForm.name}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, name: e.target.value })}
                    className="w-full bg-[#141824] border border-[#273248] focus:border-[#10b981] text-white p-2 rounded-xs focus:outline-none text-xs"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block">
                    Subtítulo / Especialidad
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Sicario de Arasaka, Ciberpsicópata de la Zona..."
                    value={customNpcForm.subtitle}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, subtitle: e.target.value })}
                    className="w-full bg-[#141824] border border-[#273248] focus:border-[#10b981] text-white p-2 rounded-xs focus:outline-none text-xs"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block">
                    Facción (Seleccionar o Escribir)
                  </label>
                  <input
                    type="text"
                    list="factions-datalist"
                    placeholder="Ej. Danger Gal, Arasaka, Maelstrom..."
                    value={customNpcForm.faction}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, faction: e.target.value })}
                    className="w-full bg-[#141824] border border-[#273248] focus:border-[#10b981] text-white p-2 rounded-xs focus:outline-none text-xs"
                  />
                  <datalist id="factions-datalist">
                    {DANGER_GAL_15_FACTIONS.map((f) => (
                      <option key={f.id} value={f.name} />
                    ))}
                    <option value="Independiente" />
                    <option value="Mercenarios Callejeros" />
                  </datalist>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block">Rol</label>
                  <input
                    type="text"
                    value={customNpcForm.role}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, role: e.target.value })}
                    className="w-full bg-[#141824] border border-[#273248] focus:border-[#10b981] text-white p-2 rounded-xs focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block">Era</label>
                  <select
                    value={customNpcForm.era}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, era: e.target.value as CharacterEra })}
                    className="w-full bg-[#141824] border border-[#273248] focus:border-[#10b981] text-white p-2 rounded-xs focus:outline-none text-xs"
                  >
                    <option value="2045">2045 RED</option>
                    <option value="2077">2077 CEMK</option>
                  </select>
                </div>
              </div>

              {/* Sección 2: Amenaza, Salud & Blindaje */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111420] p-3 rounded-xs border border-[#1e2538]">
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="text-[10px] uppercase text-amber-400 font-bold block">
                    Nivel Amenaza
                  </label>
                  <select
                    value={customNpcForm.threatTier}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, threatTier: e.target.value as ThreatTier })}
                    className="w-full bg-[#161c2c] border border-[#2b374e] text-amber-300 p-2 rounded-xs focus:outline-none text-xs font-bold"
                  >
                    <option value="mook">Mook</option>
                    <option value="hardened_mook">Hardened Mook</option>
                    <option value="lieutenant">Lieutenant</option>
                    <option value="hardened_lieutenant">Hardened Lieutenant</option>
                    <option value="mini_boss">Mini-Boss</option>
                    <option value="boss">Boss</option>
                    <option value="cyberpsycho">Cyberpsycho</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-red-400 font-bold block">
                    Puntos de Vida (HP)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={customNpcForm.hp}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, hp: parseInt(e.target.value) || 20 })}
                    className="w-full bg-[#161c2c] border border-[#2b374e] text-red-400 font-tech font-bold p-2 rounded-xs focus:outline-none text-sm text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#38bdf8] font-bold block">
                    SP Cabeza
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={customNpcForm.headSp}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, headSp: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#161c2c] border border-[#2b374e] text-[#38bdf8] font-tech font-bold p-2 rounded-xs focus:outline-none text-sm text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#38bdf8] font-bold block">
                    SP Cuerpo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={customNpcForm.bodySp}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, bodySp: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#161c2c] border border-[#2b374e] text-[#38bdf8] font-tech font-bold p-2 rounded-xs focus:outline-none text-sm text-center"
                  />
                </div>
              </div>

              {/* Sección 3: Arma Principal & Habilidad */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#111420] p-3 rounded-xs border border-[#1e2538]">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block">Arma Principal</label>
                  <input
                    type="text"
                    value={customNpcForm.weaponName}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, weaponName: e.target.value })}
                    className="w-full bg-[#161c2c] border border-[#2b374e] text-white p-2 rounded-xs focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block">Base Ataque (+)</label>
                  <input
                    type="number"
                    value={customNpcForm.weaponSkillBase}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, weaponSkillBase: parseInt(e.target.value) || 10, combatBaseTotal: parseInt(e.target.value) || 10 })}
                    className="w-full bg-[#161c2c] border border-[#2b374e] text-white p-2 rounded-xs focus:outline-none text-xs text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block">Daño (ej. 3d6)</label>
                  <input
                    type="text"
                    value={customNpcForm.weaponDamage}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, weaponDamage: e.target.value })}
                    className="w-full bg-[#161c2c] border border-[#2b374e] text-white p-2 rounded-xs focus:outline-none text-xs text-center font-bold"
                  />
                </div>
              </div>

              {/* Sección 4: STATS (10 Atributos) */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400 block font-bold">
                  Atributos (STATs Cyberpunk RED)
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                  {(['int', 'ref', 'dex', 'tech', 'cool', 'will', 'luck', 'move', 'body', 'emp'] as const).map((stat) => (
                    <div key={stat} className="bg-[#141824] border border-[#22293c] p-1.5 rounded-xs text-center">
                      <span className="text-[8px] uppercase text-slate-400 block font-bold">{stat}</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={customNpcForm[stat]}
                        onChange={(e) => setCustomNpcForm({ ...customNpcForm, [stat]: parseInt(e.target.value) || 5 })}
                        className="w-full bg-transparent text-white font-tech font-bold text-center text-xs focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección 5: Reglas Especiales & Lore */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block">
                    Reglas Especiales / Ciberware
                  </label>
                  <textarea
                    rows={2}
                    value={customNpcForm.specialRules}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, specialRules: e.target.value })}
                    placeholder="Ventajas en Sigilo, Sandevistan, etc."
                    className="w-full bg-[#141824] border border-[#273248] text-white p-2 rounded-xs focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block">
                    Resumen Táctico / Lore
                  </label>
                  <textarea
                    rows={2}
                    value={customNpcForm.loreSummary}
                    onChange={(e) => setCustomNpcForm({ ...customNpcForm, loreSummary: e.target.value })}
                    placeholder="Instrucciones tácticas para el GM al interpretar este NPC..."
                    className="w-full bg-[#141824] border border-[#273248] text-white p-2 rounded-xs focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#1f2638]">
              <span className="text-[11px] text-slate-500">
                Se guardará inmediatamente en tu navegador y aparecerá en el compendio.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomNpcModalOpen(false)}
                  className="px-4 py-2 bg-[#1b202e] hover:bg-[#252c40] text-slate-300 font-tech text-xs font-bold uppercase rounded-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomNpc}
                  className="px-4 py-2 bg-[#10b981] hover:bg-white text-black font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                >
                  Guardar PNJ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
