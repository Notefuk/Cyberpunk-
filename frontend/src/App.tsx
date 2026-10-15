import { useState } from 'react';
import { 
  Heart, 
  Crosshair, 
  Terminal, 
  User, 
  BookOpen, 
  Dices, 
  RefreshCw, 
  FolderArchive, 
  Search, 
  Check, 
  Zap, 
  Activity, 
  Flame, 
  Target, 
  Swords, 
  Skull, 
  Brain, 
  Bone, 
  Eye, 
  HeartCrack, 
  AlertOctagon 
} from 'lucide-react';

import coreData from './data/core-rules.cprpack.json';
import { 
  RANGE_BRACKETS, 
  WEAPON_RANGE_PROFILES, 
  getWeaponProfileKey 
} from './data/rangeTables';
import type { CriticalInjury } from './data/criticalInjuries';
import { 
  HEAD_CRITICAL_INJURIES, 
  rollCriticalInjury 
} from './data/criticalInjuries';
import { ItemVisualPlaceholder } from './components/ItemVisualPlaceholder';

interface WeaponItem {
  id: string;
  name: string;
  type: string;
  skill: string;
  damage: string;
  rof: number;
  hands: number;
  concealable: boolean;
  cost: number;
  costTier: string;
  standardMag?: number;
  currentMag?: number;
  ammoType?: string;
  altFireModes?: string;
  dvTable?: string;
  notes: string;
}

interface ArmorItem {
  id: string;
  name: string;
  sp: number;
  penalty: number;
  cost: number;
  costTier: string;
  description: string;
}

interface CyberwareItem {
  id: string;
  name: string;
  type: string;
  install: string;
  humanityLoss: string;
  cost: number;
  description: string;
}

interface ProgramItem {
  id: string;
  name: string;
  class: string;
  atk: number;
  def: number;
  rez: number;
  cost: number;
  description: string;
}

interface RollResult {
  id: string;
  timestamp: string;
  action: string;
  distanceLabel: string;
  baseStat: number;
  d10: number;
  crit: number;
  total: number;
  dv: number;
  margin: number;
  isSuccess: boolean;
  isCritSuccess: boolean;
  isCritFail: boolean;
  isAutofire?: boolean;
  autofireDamage?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'combat' | 'sheet' | 'compendium' | 'gm' | 'packs'>('combat');
  const [era, setEra] = useState<'2045' | '2077'>('2045');

  // Character Vitals
  const [charHp, setCharHp] = useState(35);
  const maxHp = 40;
  const seriouslyWoundedThreshold = Math.floor(maxHp / 2);
  const isSeriouslyWounded = charHp <= seriouslyWoundedThreshold;
  const isMortallyWounded = charHp <= 0;

  // Armor SP
  const [headSp, setHeadSp] = useState(11);
  const maxHeadSp = 11;
  const [bodySp, setBodySp] = useState(11);
  const maxBodySp = 11;

  // Stats & Luck
  const [currentLuck, setCurrentLuck] = useState(6);
  const maxLuck = 7;
  const [humanity] = useState(62);
  const currentEmp = Math.floor(humanity / 10);

  // Active Critical Injuries List
  const [activeInjuries, setActiveInjuries] = useState<CriticalInjury[]>([
    HEAD_CRITICAL_INJURIES[7] // Fractured Skull by default for preview
  ]);

  // Selected Target Distance Bracket (0-6m, 7-12m, etc.)
  const [selectedDistance, setSelectedDistance] = useState<string>('7-12m');

  // Autofire Mode Toggles per weapon ID
  const [autofireActive, setAutofireActive] = useState<Record<string, boolean>>({});

  // Equipped Weapons state
  const [weapons, setWeapons] = useState<WeaponItem[]>([
    {
      ...(coreData.weapons[1] as WeaponItem), // Heavy Pistol
      currentMag: 8,
      standardMag: 8
    },
    {
      ...(coreData.weapons[6] as WeaponItem), // Assault Rifle
      currentMag: 25,
      standardMag: 25
    },
    {
      ...(coreData.weapons[3] as WeaponItem), // SMG
      currentMag: 30,
      standardMag: 30
    },
    {
      ...(coreData.weapons[2] as WeaponItem), // Heavy Melee
      currentMag: 0,
      standardMag: 0
    }
  ]);

  // Dice Log State
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);

  // Compendium state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompCategory, setSelectedCompCategory] = useState<'all' | 'weapons' | 'armor' | 'cyberware' | 'programs'>('all');

  // Helper: Get DV for a specific weapon and distance
  const getDvForWeapon = (weapon: WeaponItem, distance: string, isAuto: boolean): number | null => {
    if (weapon.type === 'Melee') return 13;
    const profileKey = getWeaponProfileKey(weapon.name, weapon.type);
    if (!profileKey) return 15;
    const profile = WEAPON_RANGE_PROFILES[profileKey];
    if (!profile) return 15;

    if (isAuto && profile.autofireDvs) {
      return profile.autofireDvs[distance] ?? null;
    }
    return profile.dvs[distance] ?? null;
  };

  // Helper: Get placeholder category
  const getItemPlaceholderType = (w: WeaponItem) => {
    if (w.type === 'Melee') return 'melee';
    const lower = w.name.toLowerCase();
    if (lower.includes('sniper') || lower.includes('assault')) return 'rifle';
    if (lower.includes('shotgun')) return 'shotgun';
    if (lower.includes('smg')) return 'smg';
    if (lower.includes('rocket') || lower.includes('grenade')) return 'heavy';
    return 'pistol';
  };

  // Roll Critical Injury
  const handleRollInjury = (location: 'head' | 'body') => {
    const injury = rollCriticalInjury(location);
    if (!activeInjuries.some(i => i.id === injury.id)) {
      setActiveInjuries(prev => [injury, ...prev]);
    }
  };

  // Remove / Cure Injury
  const removeInjury = (id: string) => {
    setActiveInjuries(prev => prev.filter(i => i.id !== id));
  };

  // Perform Roll Action
  const executeRoll = (
    actionName: string, 
    baseVal: number, 
    targetDv: number, 
    distanceLabel: string,
    isAuto: boolean = false,
    maxMult: number = 3
  ) => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    let crit = 0;
    const isCritSuccess = d10 === 10;
    const isCritFail = d10 === 1;

    if (isCritSuccess) {
      crit = Math.floor(Math.random() * 10) + 1;
    } else if (isCritFail) {
      crit = -(Math.floor(Math.random() * 10) + 1);
    }

    const total = baseVal + d10 + crit;
    const margin = total - targetDv;
    const isSuccess = margin >= 0;

    let autofireDamage = '';
    if (isAuto && isSuccess) {
      const mult = Math.min(maxMult, Math.max(1, margin));
      autofireDamage = `${mult}x (2d6 Daño)`;
    }

    const newResult: RollResult = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action: actionName,
      distanceLabel,
      baseStat: baseVal,
      d10,
      crit,
      total,
      dv: targetDv,
      margin,
      isSuccess,
      isCritSuccess,
      isCritFail,
      isAutofire: isAuto,
      autofireDamage
    };

    setRollHistory(prev => [newResult, ...prev.slice(0, 15)]);
  };

  // Consume Ammo & Trigger Attack
  const triggerAttack = (weapon: WeaponItem, customDistance?: string) => {
    const distance = customDistance || selectedDistance;
    const isAuto = !!autofireActive[weapon.id];
    const ammoCost = isAuto ? 10 : 1;

    if (weapon.standardMag && weapon.standardMag > 0) {
      if ((weapon.currentMag ?? 0) < ammoCost) {
        return;
      }
      setWeapons(prev => prev.map(w => {
        if (w.id === weapon.id) {
          return { ...w, currentMag: Math.max(0, (w.currentMag ?? 0) - ammoCost) };
        }
        return w;
      }));
    }

    const targetDv = getDvForWeapon(weapon, distance, isAuto);
    if (targetDv === null) {
      alert(`El objetivo a ${distance} está fuera del alcance de este arma.`);
      return;
    }

    const profileKey = getWeaponProfileKey(weapon.name, weapon.type);
    const maxMult = (profileKey && WEAPON_RANGE_PROFILES[profileKey]?.autofireMaxMultiplier) || 3;

    executeRoll(
      `${weapon.name}${isAuto ? ' [RÁFAGA AUTOFIRE]' : ''}`,
      14,
      targetDv,
      weapon.type === 'Melee' ? 'Cuerpo a cuerpo' : distance,
      isAuto,
      maxMult
    );
  };

  // Reload Weapon
  const reloadWeapon = (weaponId: string) => {
    setWeapons(prev => prev.map(w => {
      if (w.id === weaponId) {
        return { ...w, currentMag: w.standardMag ?? 0 };
      }
      return w;
    }));
  };

  // Filtered compendium items
  const q = searchQuery.toLowerCase();
  const filteredWeapons = (coreData.weapons as WeaponItem[]).filter(w => 
    w.name.toLowerCase().includes(q) || w.skill.toLowerCase().includes(q) || w.notes.toLowerCase().includes(q)
  );
  const filteredArmor = (coreData.armor as ArmorItem[]).filter(a => 
    a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
  );
  const filteredCyberware = (coreData.cyberware as CyberwareItem[]).filter(c => 
    c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );
  const filteredPrograms = (coreData.programs as ProgramItem[]).filter(p => 
    p.name.toLowerCase().includes(q) || p.class.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-[#cbd5e1] flex flex-col font-sans selection:bg-[#dc2626] selection:text-white">
      {/* =========================================================
          TOP COMMAND BAR
      ========================================================= */}
      <header className="border-b border-[#1f222e] bg-[#101217]/95 backdrop-blur-md sticky top-0 z-50 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Callout */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-[#dc2626] flex items-center justify-center font-tech font-bold text-lg text-white shadow-lg shadow-[#dc2626]/20 chamfer-btn">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-tech text-lg font-bold tracking-wider text-white">OMNI-DECK</span>
                <span className="text-[10px] font-mono-code bg-[#1f2330] border border-[#2b3042] text-[#94a3b8] px-1.5 py-0.2 rounded">
                  v1.2.0
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                <span className="flex items-center gap-1 text-[#10b981]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  TABLA DE DISTANCIAS E ICONOS ACTIVOS
                </span>
                <span>•</span>
                <span>OFFLINE PWA READY</span>
              </div>
            </div>
          </div>

          {/* Quick Active Character Summary Strip */}
          <div className="hidden md:flex items-center gap-4 bg-[#14161f] border border-[#222634] px-3 py-1.5 rounded-sm">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-sm bg-[#1c202c] border border-[#2a3044] flex items-center justify-center text-[#f59e0b] font-bold text-xs">
                V
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-none">JOHNNY "RAVEN" V</div>
                <div className="text-[10px] text-[#dc2626] font-mono-code leading-tight mt-0.5">SOLO // RANK 4</div>
              </div>
            </div>

            <div className="h-5 w-px bg-[#222634]"></div>

            <div className="flex items-center gap-3 text-xs font-mono-code">
              <div>
                <span className="text-[#64748b] text-[10px] block leading-none">HP</span>
                <span className={`font-bold ${isSeriouslyWounded ? 'text-[#dc2626]' : 'text-white'}`}>{charHp}/{maxHp}</span>
              </div>
              <div>
                <span className="text-[#64748b] text-[10px] block leading-none">HEAD/BODY</span>
                <span className="font-bold text-[#38bdf8]">{headSp}/{bodySp}</span>
              </div>
              <div>
                <span className="text-[#64748b] text-[10px] block leading-none">EMP</span>
                <span className="font-bold text-[#f59e0b]">{currentEmp} <span className="text-[10px] text-[#64748b]">({humanity} HL)</span></span>
              </div>
              <div>
                <span className="text-[#64748b] text-[10px] block leading-none">HERIDAS CRÍTICAS</span>
                <span className={`font-bold flex items-center gap-1 ${activeInjuries.length > 0 ? 'text-[#dc2626]' : 'text-[#10b981]'}`}>
                  <Skull className="w-3 h-3" /> {activeInjuries.length}
                </span>
              </div>
            </div>
          </div>

          {/* Era Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#14161f] p-0.5 border border-[#222634] rounded-sm text-xs font-mono-code">
              <button 
                onClick={() => setEra('2045')}
                className={`px-3 py-1 transition-all ${
                  era === '2045' 
                    ? 'bg-[#dc2626] text-white font-bold shadow-sm' 
                    : 'text-[#64748b] hover:text-[#cbd5e1]'
                }`}
              >
                2045 RED
              </button>
              <button 
                onClick={() => setEra('2077')}
                className={`px-3 py-1 transition-all ${
                  era === '2077' 
                    ? 'bg-[#0284c7] text-white font-bold shadow-sm' 
                    : 'text-[#64748b] hover:text-[#cbd5e1]'
                }`}
              >
                2077 CEMK
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* =========================================================
          PRIMARY NAVIGATION TABS
      ========================================================= */}
      <nav className="border-b border-[#1f222e] bg-[#0d0e13] px-4">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto no-scrollbar">
          
          <button 
            onClick={() => setActiveTab('combat')}
            className={`group flex items-center gap-2 py-3 px-4 border-b-2 font-tech text-sm tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === 'combat' 
                ? 'border-[#dc2626] text-white bg-[#dc2626]/10 font-bold' 
                : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#151720]'
            }`}
          >
            <Crosshair className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === 'combat' ? 'text-[#dc2626]' : 'text-[#64748b]'}`} />
            <span>Active Combat</span>
            {activeInjuries.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-[#dc2626] animate-ping ml-1"></span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('sheet')}
            className={`group flex items-center gap-2 py-3 px-4 border-b-2 font-tech text-sm tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === 'sheet' 
                ? 'border-[#f59e0b] text-white bg-[#f59e0b]/10 font-bold' 
                : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#151720]'
            }`}
          >
            <User className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === 'sheet' ? 'text-[#f59e0b]' : 'text-[#64748b]'}`} />
            <span>Street Lab (Sheet)</span>
          </button>

          <button 
            onClick={() => setActiveTab('compendium')}
            className={`group flex items-center gap-2 py-3 px-4 border-b-2 font-tech text-sm tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === 'compendium' 
                ? 'border-[#38bdf8] text-white bg-[#38bdf8]/10 font-bold' 
                : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#151720]'
            }`}
          >
            <BookOpen className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === 'compendium' ? 'text-[#38bdf8]' : 'text-[#64748b]'}`} />
            <span>Master Compendium</span>
          </button>

          <button 
            onClick={() => setActiveTab('gm')}
            className={`group flex items-center gap-2 py-3 px-4 border-b-2 font-tech text-sm tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === 'gm' 
                ? 'border-[#10b981] text-white bg-[#10b981]/10 font-bold' 
                : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#151720]'
            }`}
          >
            <Terminal className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === 'gm' ? 'text-[#10b981]' : 'text-[#64748b]'}`} />
            <span>Fixer Deck (GM)</span>
          </button>

          <button 
            onClick={() => setActiveTab('packs')}
            className={`group flex items-center gap-2 py-3 px-4 border-b-2 font-tech text-sm tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === 'packs' 
                ? 'border-[#a855f7] text-white bg-[#a855f7]/10 font-bold' 
                : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#151720]'
            }`}
          >
            <FolderArchive className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === 'packs' ? 'text-[#a855f7]' : 'text-[#64748b]'}`} />
            <span>Data Packs</span>
          </button>

        </div>
      </nav>

      {/* =========================================================
          MAIN CONTENT VIEWPORT
      ========================================================= */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* =====================================================
            TAB 1: ACTIVE COMBAT MODE
        ===================================================== */}
        {activeTab === 'combat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* LEFT / CENTER COLUMN (8 COLS): Vitals, Critical Injuries, Range Selector, Weapons */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* VITALS & BALLISTIC MATRIX */}
              <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
                
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#1f2230] gap-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#dc2626]" />
                    <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">ESTADO VITAL Y BLINDAJE</span>
                  </div>
                  
                  {/* Luck Pips Counter */}
                  <div className="flex items-center gap-2 text-xs font-mono-code bg-[#161822] px-2.5 py-1 rounded border border-[#232736]">
                    <span className="text-[#f59e0b] font-bold">SUERTE (LUCK):</span>
                    <div className="flex gap-1">
                      {Array.from({ length: maxLuck }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentLuck(i + 1 === currentLuck ? i : i + 1)}
                          title={`Gastar o fijar suerte en ${i + 1}`}
                          className={`w-3.5 h-3.5 rounded-sm transition-all ${
                            i < currentLuck 
                              ? 'bg-[#f59e0b] shadow-sm shadow-[#f59e0b]/40' 
                              : 'bg-[#232736] hover:bg-[#343b52]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white ml-1 font-bold">{currentLuck}/{maxLuck}</span>
                    <button 
                      onClick={() => setCurrentLuck(maxLuck)}
                      className="ml-1 text-[#64748b] hover:text-[#10b981] transition-colors"
                      title="Restablecer Suerte"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* HP Gauge & Serious Wound Alert */}
                <div className="mb-5 bg-[#171923] p-4 rounded-sm border border-[#222636]">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#dc2626]" />
                      <span className="font-tech text-sm font-bold text-white tracking-wide">PUNTOS DE VIDA (HP)</span>
                      {isSeriouslyWounded && (
                        <span className="bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#dc2626] font-mono-code text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" /> HERIDA GRAVE (-2 A TODAS LAS ACCIONES)
                        </span>
                      )}
                    </div>
                    <div className="font-mono-code text-sm">
                      <span className={`text-xl font-bold ${isSeriouslyWounded ? 'text-[#dc2626]' : 'text-white'}`}>{charHp}</span>
                      <span className="text-[#64748b]"> / {maxHp}</span>
                    </div>
                  </div>

                  {/* Progress track */}
                  <div className="w-full bg-[#0c0d12] h-4 rounded-xs overflow-hidden border border-[#262b3c] p-0.5">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isMortallyWounded 
                          ? 'bg-[#dc2626]' 
                          : isSeriouslyWounded 
                            ? 'bg-gradient-to-r from-[#dc2626] to-[#f59e0b]' 
                            : 'bg-gradient-to-r from-[#059669] to-[#10b981]'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, (charHp / maxHp) * 100))}%` }}
                    />
                  </div>

                  {/* Tactile Delta Buttons */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1f2332] text-xs font-mono-code">
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => setCharHp(prev => Math.max(0, prev - 5))}
                        className="px-2.5 py-1 bg-[#222534] hover:bg-[#dc2626] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1]"
                      >
                        -5
                      </button>
                      <button 
                        onClick={() => setCharHp(prev => Math.max(0, prev - 1))}
                        className="px-2.5 py-1 bg-[#222534] hover:bg-[#dc2626] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1]"
                      >
                        -1
                      </button>
                      <button 
                        onClick={() => setCharHp(prev => Math.min(maxHp, prev + 1))}
                        className="px-2.5 py-1 bg-[#222534] hover:bg-[#10b981] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1]"
                      >
                        +1
                      </button>
                      <button 
                        onClick={() => setCharHp(prev => Math.min(maxHp, prev + 5))}
                        className="px-2.5 py-1 bg-[#222534] hover:bg-[#10b981] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1]"
                      >
                        +5
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCharHp(maxHp)}
                        className="px-3 py-1 bg-[#1a1d28] hover:bg-[#10b981]/20 hover:border-[#10b981] border border-[#2b3042] text-[#94a3b8] hover:text-white rounded-xs transition-all active:scale-95"
                      >
                        Descanso Total
                      </button>
                    </div>
                  </div>
                </div>

                {/* Armor Plates Grid with Visual Icon Placeholders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* HEAD ARMOR */}
                  <div className="bg-[#171923] p-4 rounded-sm border border-[#222636] relative overflow-hidden flex items-start gap-3">
                    <ItemVisualPlaceholder type="armor_head" size="md" />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="text-[10px] font-mono-code text-[#64748b] block tracking-wider uppercase">PROTECCIÓN DE CABEZA</span>
                          <div className="font-tech text-base font-bold text-white flex items-center gap-1.5">
                            BLINDAJE CABEZA (SP)
                          </div>
                          <div className="text-[11px] text-[#94a3b8]">Light Armorjack</div>
                        </div>
                        <div className="text-right">
                          <span className="font-tech text-3xl font-bold text-white leading-none">{headSp}</span>
                          <span className="text-xs text-[#64748b] block font-mono-code">/ {maxHeadSp} SP</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#1f2332]">
                        <button 
                          onClick={() => setHeadSp(prev => Math.max(0, prev - 1))}
                          className="py-1.5 px-2 bg-[#dc2626]/10 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/30 rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 text-center"
                        >
                          -1 ABLACIÓN
                        </button>
                        <button 
                          onClick={() => setHeadSp(maxHeadSp)}
                          className="py-1.5 px-2 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#2c3246] rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 text-center"
                        >
                          REPARAR
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BODY ARMOR */}
                  <div className="bg-[#171923] p-4 rounded-sm border border-[#222636] relative overflow-hidden flex items-start gap-3">
                    <ItemVisualPlaceholder type="armor_body" size="md" />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="text-[10px] font-mono-code text-[#64748b] block tracking-wider uppercase">PROTECCIÓN DE TORSO</span>
                          <div className="font-tech text-base font-bold text-white flex items-center gap-1.5">
                            BLINDAJE CUERPO (SP)
                          </div>
                          <div className="text-[11px] text-[#94a3b8]">Light Armorjack</div>
                        </div>
                        <div className="text-right">
                          <span className="font-tech text-3xl font-bold text-white leading-none">{bodySp}</span>
                          <span className="text-xs text-[#64748b] block font-mono-code">/ {maxBodySp} SP</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#1f2332]">
                        <button 
                          onClick={() => setBodySp(prev => Math.max(0, prev - 1))}
                          className="py-1.5 px-2 bg-[#dc2626]/10 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/30 rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 text-center"
                        >
                          -1 ABLACIÓN
                        </button>
                        <button 
                          onClick={() => setBodySp(maxBodySp)}
                          className="py-1.5 px-2 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#2c3246] rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 text-center"
                        >
                          REPARAR
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* =====================================================
                  CRITICAL INJURIES MODULE (HERIDAS CRÍTICAS)
              ===================================================== */}
              <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
                <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#1f2230] gap-2">
                  <div className="flex items-center gap-2">
                    <Skull className="w-4 h-4 text-[#dc2626]" />
                    <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">
                      HERIDAS CRÍTICAS ACTIVAS ({activeInjuries.length})
                    </span>
                  </div>

                  {/* Trigger buttons for Head and Body Crits */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRollInjury('head')}
                      className="px-3 py-1.5 bg-[#221820] hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/40 rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Skull className="w-3.5 h-3.5" />
                      <span>+ CRÍTICO CABEZA (2d6)</span>
                    </button>
                    <button
                      onClick={() => handleRollInjury('body')}
                      className="px-3 py-1.5 bg-[#201d16] hover:bg-[#f59e0b] hover:text-black text-[#f59e0b] border border-[#f59e0b]/40 rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Bone className="w-3.5 h-3.5" />
                      <span>+ CRÍTICO CUERPO (2d6)</span>
                    </button>
                  </div>
                </div>

                {/* Active Injuries Cards */}
                {activeInjuries.length === 0 ? (
                  <div className="text-center py-6 text-[#64748b] font-mono-code text-xs bg-[#171923] rounded border border-[#222636]">
                    Sin heridas críticas activas. El sujeto no presenta miembros rotos ni traumas severos.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeInjuries.map((injury) => (
                      <div 
                        key={injury.id}
                        className="bg-[#1c1619] border border-[#3b1d24] p-3.5 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#dc2626] transition-all"
                      >
                        <div className="flex items-start gap-3">
                          {/* Visual Icon Box for Injury */}
                          <div className="w-10 h-10 bg-[#29171b] border border-[#4d1f28] rounded-xs flex items-center justify-center shrink-0">
                            {injury.iconType === 'skull' && <Skull className="w-5 h-5 text-[#dc2626]" />}
                            {injury.iconType === 'brain' && <Brain className="w-5 h-5 text-[#f43f5e]" />}
                            {injury.iconType === 'eye' && <Eye className="w-5 h-5 text-[#38bdf8]" />}
                            {injury.iconType === 'bone' && <Bone className="w-5 h-5 text-[#f59e0b]" />}
                            {injury.iconType === 'heart' && <HeartCrack className="w-5 h-5 text-[#dc2626]" />}
                            {injury.iconType === 'muscle' && <AlertOctagon className="w-5 h-5 text-[#e11d48]" />}
                            {injury.iconType === 'ear' && <AlertOctagon className="w-5 h-5 text-[#f59e0b]" />}
                            {injury.iconType === 'throat' && <Skull className="w-5 h-5 text-[#dc2626]" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-tech text-base font-bold text-white tracking-wide">{injury.name}</span>
                              <span className="text-[10px] font-mono-code bg-[#33181d] text-[#dc2626] px-1.5 py-0.2 rounded uppercase">
                                {injury.location === 'head' ? 'CABEZA' : 'CUERPO'} (Roll: {injury.roll})
                              </span>
                            </div>
                            <p className="text-xs text-[#fca5a5] mt-1 font-sans leading-relaxed">
                              {injury.effect}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-code text-[#94a3b8] mt-1.5">
                              <span><strong className="text-[#64748b]">Arreglo Rápido:</strong> {injury.quickFix}</span>
                              <span>•</span>
                              <span><strong className="text-[#64748b]">Tratamiento:</strong> {injury.treatment}</span>
                            </div>
                          </div>
                        </div>

                        {/* Cure / Remove Button */}
                        <button
                          onClick={() => removeInjury(injury.id)}
                          className="self-end md:self-center px-3.5 py-1.5 bg-[#2a1b22] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#3d2731] hover:border-[#10b981] rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>TRATAR / CURAR</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* GLOBAL TARGET RANGE SELECTOR */}
              <div className="chamfer-card p-4 bg-[#121319] border border-[#232736]">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#1f2230]">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#f59e0b]" />
                    <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">
                      SELECTOR GLOBAL DE DISTANCIA AL OBJETIVO
                    </span>
                  </div>
                  <span className="text-xs font-mono-code text-[#38bdf8]">
                    DISTANCIA FIJADA: <span className="font-bold text-white bg-[#1e2334] px-2 py-0.5 rounded">{selectedDistance}</span>
                  </span>
                </div>

                {/* Range Brackets Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5 pt-1">
                  {RANGE_BRACKETS.map(b => {
                    const isSelected = selectedDistance === b.range;
                    return (
                      <button
                        key={b.range}
                        onClick={() => setSelectedDistance(b.range)}
                        className={`p-2 rounded-xs border text-center transition-all ${
                          isSelected 
                            ? 'bg-[#dc2626] border-[#dc2626] text-white font-bold shadow-md shadow-[#dc2626]/20' 
                            : 'bg-[#171923] border-[#242838] text-[#94a3b8] hover:border-[#3b425a] hover:text-white'
                        }`}
                      >
                        <div className="font-tech text-sm font-bold leading-none">{b.range}</div>
                        <div className="text-[9px] font-mono-code text-[#64748b] mt-1 leading-tight truncate">
                          {b.label.split('(')[1]?.replace(')', '') || ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WEAPON ARSENAL & INTERACTIVE DISTANCE LADDER */}
              <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1f2230]">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-[#dc2626]" />
                    <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">
                      ARSENAL EQUIPADO Y ESCALERA DE DIFICULTADES (DVs)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-code text-[#64748b]">
                    HAZ CLIC EN CUALQUIER DISTANCIA PARA DISPARAR
                  </span>
                </div>

                {/* Weapons List with Visual Icons */}
                <div className="space-y-4">
                  {weapons.map((w) => {
                    const isRanged = w.type === 'Ranged';
                    const isOutOfAmmo = isRanged && (w.currentMag ?? 0) <= 0;
                    const isAuto = !!autofireActive[w.id];
                    const currentDv = getDvForWeapon(w, selectedDistance, isAuto);
                    const profileKey = getWeaponProfileKey(w.name, w.type);
                    const profile = profileKey ? WEAPON_RANGE_PROFILES[profileKey] : null;
                    const hasAutofire = isRanged && (w.name.includes('SMG') || w.name.includes('Assault Rifle'));
                    const placeholderType = getItemPlaceholderType(w);

                    return (
                      <div 
                        key={w.id} 
                        className="bg-[#171923] p-4 rounded-sm border border-[#222636] hover:border-[#384058] transition-all"
                      >
                        {/* Top row with Visual Placeholder */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#1f2332]">
                          
                          <div className="flex items-start gap-3">
                            {/* Weapon Visual Placeholder Frame */}
                            <ItemVisualPlaceholder type={placeholderType} size="md" />

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-tech text-lg font-bold text-white tracking-wide">{w.name}</span>
                                <span className="text-[10px] font-mono-code bg-[#232738] text-[#f59e0b] px-1.5 py-0.5 rounded">
                                  {w.costTier}
                                </span>
                                <span className="text-xs font-mono-code text-[#38bdf8]">
                                  {w.skill} (Base 14)
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-mono-code text-[#94a3b8]">
                                <span className="flex items-center gap-1 text-[#f43f5e] font-bold">
                                  <Zap className="w-3.5 h-3.5" /> {w.damage}
                                </span>
                                <span>•</span>
                                <span>ROF: {w.rof}</span>
                                <span>•</span>
                                <span>{w.hands} {w.hands === 1 ? 'Mano' : 'Manos'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Ammo and Mode Switch */}
                          <div className="flex items-center gap-3 self-end md:self-center">
                            {hasAutofire && (
                              <button
                                onClick={() => setAutofireActive(prev => ({ ...prev, [w.id]: !prev[w.id] }))}
                                className={`px-2.5 py-1 rounded text-xs font-mono-code font-bold border transition-all flex items-center gap-1.5 ${
                                  isAuto 
                                    ? 'bg-[#dc2626] border-[#dc2626] text-white shadow-sm shadow-[#dc2626]/40' 
                                    : 'bg-[#222636] border-[#2d3246] text-[#94a3b8] hover:text-white'
                                }`}
                              >
                                <Flame className="w-3.5 h-3.5" />
                                <span>RÁFAGA AUTOFIRE</span>
                              </button>
                            )}

                            {isRanged && (
                              <div className="flex items-center gap-2 bg-[#12141c] px-3 py-1.5 rounded border border-[#222636] font-mono-code text-xs">
                                <span className="text-[#64748b]">CARGADOR:</span>
                                <span className={`font-bold ${isOutOfAmmo ? 'text-[#dc2626]' : 'text-white'}`}>
                                  {w.currentMag} / {w.standardMag}
                                </span>
                                {isOutOfAmmo && (
                                  <span className="text-[#dc2626] font-bold text-[10px]">VACÍO</span>
                                )}
                                {(w.currentMag ?? 0) < (w.standardMag ?? 0) && (
                                  <button
                                    onClick={() => reloadWeapon(w.id)}
                                    className="ml-1 p-1 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] rounded transition-colors"
                                    title="Recargar cargador"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Distance & DV Ladder */}
                        {isRanged && profile && (
                          <div className="space-y-2">
                            <div className="text-[11px] font-mono-code text-[#64748b] flex items-center justify-between">
                              <span>TABLA DE DIFICULTADES (DV) POR METROS:</span>
                              <span className="text-[#f59e0b] font-bold">
                                {isAuto ? 'Modo Ráfaga (DVs de Autofire)' : 'Disparo Estándar'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5">
                              {RANGE_BRACKETS.map(b => {
                                const dvVal = isAuto && profile.autofireDvs 
                                  ? profile.autofireDvs[b.range] ?? null 
                                  : profile.dvs[b.range] ?? null;
                                
                                const isSelectedRange = selectedDistance === b.range;
                                const isOutOfRange = dvVal === null;

                                const validDvs = Object.values(isAuto && profile.autofireDvs ? profile.autofireDvs : profile.dvs).filter(v => v !== null) as number[];
                                const minDv = Math.min(...validDvs);
                                const isSweetSpot = dvVal === minDv;

                                return (
                                  <button
                                    key={b.range}
                                    disabled={isOutOfRange}
                                    onClick={() => {
                                      setSelectedDistance(b.range);
                                      triggerAttack(w, b.range);
                                    }}
                                    className={`p-2 rounded-xs border text-center transition-all ${
                                      isOutOfRange 
                                        ? 'bg-[#121319] border-[#1d202c] text-[#475569] cursor-not-allowed opacity-40'
                                        : isSelectedRange 
                                          ? 'bg-[#dc2626] border-[#dc2626] text-white shadow-md shadow-[#dc2626]/20'
                                          : isSweetSpot
                                            ? 'bg-[#15241e] border-[#10b981]/50 text-[#10b981] hover:bg-[#10b981] hover:text-black'
                                            : 'bg-[#191c28] border-[#252b3e] text-[#cbd5e1] hover:border-[#38bdf8] hover:text-white'
                                    }`}
                                  >
                                    <div className="text-[10px] font-mono-code opacity-80">{b.range}</div>
                                    <div className="font-tech text-base font-bold my-0.5">
                                      {isOutOfRange ? 'N/A' : `DV ${dvVal}`}
                                    </div>
                                    <div className="text-[9px] font-mono-code">
                                      {isOutOfRange 
                                        ? 'Fuera de rango' 
                                        : isSweetSpot 
                                          ? '★ ÓPTIMO' 
                                          : isSelectedRange 
                                            ? 'SELECCIONADO' 
                                            : 'DISPARAR'}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Melee weapons notice */}
                        {!isRanged && (
                          <div className="bg-[#191c28] p-3 rounded border border-[#252b3e] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Swords className="w-5 h-5 text-[#f59e0b]" />
                              <div>
                                <div className="text-xs font-bold text-white">COMBATE CUERPO A CUERPO</div>
                                <div className="text-[11px] text-[#94a3b8] font-mono-code">
                                  No usa distancia fija: Es una tirada enfrentada contra la DEX + Evasión del objetivo (DV por defecto 13).
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => triggerAttack(w)}
                              className="px-5 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold tracking-wider text-sm chamfer-btn transition-all active:scale-95 shadow-md shadow-[#dc2626]/20 flex items-center gap-2"
                            >
                              <Dices className="w-4 h-4" />
                              <span>ATACAR CUERPO A CUERPO</span>
                            </button>
                          </div>
                        )}

                        {/* Bottom Fire Bar for selected distance */}
                        {isRanged && (
                          <div className="mt-3 pt-3 border-t border-[#1f2332] flex items-center justify-between">
                            <div className="text-xs font-mono-code text-[#94a3b8]">
                              Distancia seleccionada: <span className="text-white font-bold">{selectedDistance}</span> • 
                              Dificultad actual: <span className="text-[#38bdf8] font-bold text-sm ml-1">
                                {currentDv !== null ? `DV ${currentDv}` : 'Fuera de rango'}
                              </span>
                            </div>

                            {isOutOfAmmo ? (
                              <button
                                onClick={() => reloadWeapon(w.id)}
                                className="px-5 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-tech font-bold tracking-wider text-sm chamfer-btn transition-all active:scale-95"
                              >
                                RECARGAR MUNICIÓN
                              </button>
                            ) : (
                              <button
                                disabled={currentDv === null}
                                onClick={() => triggerAttack(w)}
                                className={`px-5 py-2 font-tech font-bold tracking-wider text-sm chamfer-btn transition-all active:scale-95 flex items-center gap-2 ${
                                  currentDv === null 
                                    ? 'bg-[#222534] text-[#64748b] cursor-not-allowed' 
                                    : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-md shadow-[#dc2626]/20'
                                }`}
                              >
                                <Dices className="w-4 h-4" />
                                <span>DISPARAR A {selectedDistance} (DV {currentDv})</span>
                              </button>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN (4 COLS): COMBAT DICE FEED */}
            <div className="lg:col-span-4 space-y-5">
              
              <div className="chamfer-card p-5 bg-[#121319] border border-[#232736] flex flex-col h-full min-h-[500px]">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1f2230]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#38bdf8]" />
                    <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">REGISTRO DE COMBATE</span>
                  </div>
                  {rollHistory.length > 0 && (
                    <button 
                      onClick={() => setRollHistory([])}
                      className="text-[10px] font-mono-code text-[#64748b] hover:text-[#dc2626] transition-colors"
                    >
                      LIMPIAR
                    </button>
                  )}
                </div>

                {/* Roll Feed */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[640px]">
                  {rollHistory.length === 0 ? (
                    <div className="text-center py-16 text-[#64748b] font-mono-code text-xs">
                      <Crosshair className="w-8 h-8 text-[#282d3e] mx-auto mb-2" />
                      Sistema listo para combate.<br />
                      Selecciona una distancia y dispara un arma.
                    </div>
                  ) : (
                    rollHistory.map((r) => (
                      <div 
                        key={r.id} 
                        className={`p-3 rounded-xs border transition-all ${
                          r.isSuccess 
                            ? 'bg-[#141822] border-[#1e2a3c] hover:border-[#10b981]' 
                            : 'bg-[#191417] border-[#301c22] hover:border-[#dc2626]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-tech text-sm font-bold text-white tracking-wide truncate max-w-[160px]">
                            {r.action}
                          </span>
                          <span className={`px-2 py-0.5 rounded-2xs text-[10px] font-mono-code font-bold ${
                            r.isSuccess 
                              ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' 
                              : 'bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/30'
                          }`}>
                            {r.isSuccess ? `IMPACTO (DV ${r.dv})` : `FALLO (DV ${r.dv})`}
                          </span>
                        </div>

                        {/* Distance tag */}
                        <div className="text-[10px] font-mono-code text-[#38bdf8] mb-1">
                          Distancia: {r.distanceLabel}
                        </div>

                        {/* Roll Formula Breakdown */}
                        <div className="flex items-baseline justify-between text-xs font-mono-code text-[#94a3b8] mt-1">
                          <div>
                            Base {r.baseStat} + 1d10({r.d10})
                            {r.isCritSuccess && <span className="text-[#10b981] font-bold"> [CRÍTICO +{r.crit}]</span>}
                            {r.isCritFail && <span className="text-[#dc2626] font-bold"> [PIFIA {r.crit}]</span>}
                          </div>
                          <div className="text-right">
                            <span className="text-white font-bold text-sm">TOTAL: {r.total}</span>
                          </div>
                        </div>

                        {/* Autofire damage breakdown if applicable */}
                        {r.isAutofire && r.isSuccess && (
                          <div className="mt-1.5 pt-1.5 border-t border-[#1e2a3c] flex items-center justify-between text-xs font-mono-code text-[#f59e0b]">
                            <span>MULTIPLICADOR AUTOFIRE:</span>
                            <span className="font-bold">{r.autofireDamage}</span>
                          </div>
                        )}

                        <div className="text-[10px] text-[#64748b] font-mono-code mt-1 text-right">
                          {r.timestamp} • Margen: {r.margin >= 0 ? `+${r.margin}` : `${r.margin}`}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            TAB 2: MASTER COMPENDIUM (WITH ITEM ICONS)
        ===================================================== */}
        {activeTab === 'compendium' && (
          <div className="space-y-5">
            
            {/* Filter and Search Bar */}
            <div className="chamfer-card p-4 bg-[#121319] border border-[#232736] flex flex-wrap items-center justify-between gap-4">
              
              <div className="flex items-center gap-2 flex-1 min-w-[280px] bg-[#171923] px-3.5 py-2 rounded-xs border border-[#262b3c]">
                <Search className="w-4 h-4 text-[#64748b]" />
                <input 
                  type="text"
                  placeholder="Buscar en armas, blindajes, ciberware y programas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-[#64748b] font-mono-code"
                />
              </div>

              <div className="flex flex-wrap gap-1 text-xs font-tech">
                {(['all', 'weapons', 'armor', 'cyberware', 'programs'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCompCategory(cat)}
                    className={`px-3.5 py-1.5 uppercase font-bold tracking-wider transition-all chamfer-btn ${
                      selectedCompCategory === cat 
                        ? 'bg-[#38bdf8] text-black shadow-sm' 
                        : 'bg-[#181a24] text-[#94a3b8] hover:text-white border border-[#262b3c]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Weapons Catalog */}
              {(selectedCompCategory === 'all' || selectedCompCategory === 'weapons') && filteredWeapons.map(w => {
                const placeholder = getItemPlaceholderType(w);
                return (
                  <div 
                    key={w.id} 
                    className="chamfer-card p-4 bg-[#13151e] border border-[#222636] hover:border-[#dc2626]/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-2">
                        <ItemVisualPlaceholder type={placeholder} size="sm" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="font-tech text-base font-bold text-white tracking-wide">{w.name}</span>
                            <span className="text-[10px] font-mono-code bg-[#dc2626]/20 border border-[#dc2626]/30 text-[#dc2626] px-2 py-0.5 rounded-2xs font-bold">
                              {w.cost} eb
                            </span>
                          </div>
                          <div className="text-xs font-mono-code text-[#f59e0b]">{w.skill} • {w.type}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-xs font-mono-code bg-[#181a25] p-2.5 rounded-xs border border-[#232738] mb-3">
                        <div><span className="text-[#64748b]">DAÑO:</span> <span className="text-white font-bold">{w.damage}</span></div>
                        <div><span className="text-[#64748b]">ROF:</span> <span className="text-white font-bold">{w.rof}</span></div>
                        <div><span className="text-[#64748b]">MANOS:</span> <span className="text-white">{w.hands}</span></div>
                        <div><span className="text-[#64748b]">OCULTABLE:</span> <span className="text-white">{w.concealable ? 'Sí' : 'No'}</span></div>
                      </div>

                      <p className="text-xs text-[#94a3b8] leading-relaxed font-sans">{w.notes}</p>
                      {w.dvTable && (
                        <div className="text-[11px] font-mono-code text-[#38bdf8] mt-2 pt-2 border-t border-[#1f2334]">
                          {w.dvTable}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1f2334] flex justify-between items-center text-xs font-mono-code">
                      <span className="text-[#64748b] text-[10px]">CORE RULES v1.24</span>
                      <button 
                        onClick={() => {
                          setActiveTab('combat');
                          executeRoll(`${w.name} (Prueba Compendio)`, 14, 15, '13-25m');
                        }}
                        className="text-[#dc2626] hover:text-white flex items-center gap-1 font-bold transition-colors"
                      >
                        <Dices className="w-3.5 h-3.5" /> Probar Tirada
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Armor Catalog */}
              {(selectedCompCategory === 'all' || selectedCompCategory === 'armor') && filteredArmor.map(a => (
                <div 
                  key={a.id} 
                  className="chamfer-card p-4 bg-[#13151e] border border-[#222636] hover:border-[#38bdf8]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-2">
                      <ItemVisualPlaceholder type={a.id.includes('shield') ? 'shield' : 'armor_body'} size="sm" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-tech text-base font-bold text-white tracking-wide">{a.name}</span>
                          <span className="text-[10px] font-mono-code bg-[#38bdf8]/20 border border-[#38bdf8]/30 text-[#38bdf8] px-2 py-0.5 rounded-2xs font-bold">
                            {a.cost} eb
                          </span>
                        </div>
                        <div className="text-xs font-mono-code text-[#10b981] font-bold">SP {a.sp}</div>
                      </div>
                    </div>

                    <div className="text-xs font-mono-code my-2 bg-[#181a25] p-2 rounded-xs border border-[#232738] text-[#f59e0b]">
                      Penalización: {a.penalty === 0 ? 'Ninguna' : `${a.penalty} REF/DEX/MOVE`}
                    </div>

                    <p className="text-xs text-[#94a3b8] leading-relaxed font-sans">{a.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1f2334] text-[10px] font-mono-code text-[#64748b]">
                    CORE RULES (PÁGINA 351)
                  </div>
                </div>
              ))}

              {/* Cyberware Catalog */}
              {(selectedCompCategory === 'all' || selectedCompCategory === 'cyberware') && filteredCyberware.map(c => (
                <div 
                  key={c.id} 
                  className="chamfer-card p-4 bg-[#13151e] border border-[#222636] hover:border-[#f59e0b]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-2">
                      <ItemVisualPlaceholder type="cyberware" size="sm" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-tech text-base font-bold text-white tracking-wide">{c.name}</span>
                          <span className="text-[10px] font-mono-code bg-[#f59e0b]/20 border border-[#f59e0b]/30 text-[#f59e0b] px-2 py-0.5 rounded-2xs font-bold">
                            {c.cost} eb
                          </span>
                        </div>
                        <div className="text-xs font-mono-code text-[#c084fc] font-bold">{c.type}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code my-2 bg-[#181a25] p-2 rounded-xs border border-[#232738]">
                      <span className="text-[#94a3b8]">Instalación: {c.install}</span>
                      <span className="text-[#64748b]">|</span>
                      <span className="text-[#dc2626] font-bold">Pérdida Hum: {c.humanityLoss}</span>
                    </div>

                    <p className="text-xs text-[#94a3b8] leading-relaxed font-sans">{c.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1f2334] text-[10px] font-mono-code text-[#64748b]">
                    CORE RULES (PÁGINA 359)
                  </div>
                </div>
              ))}

              {/* Programs Catalog */}
              {(selectedCompCategory === 'all' || selectedCompCategory === 'programs') && filteredPrograms.map(p => (
                <div 
                  key={p.id} 
                  className="chamfer-card p-4 bg-[#13151e] border border-[#222636] hover:border-[#10b981]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-2">
                      <ItemVisualPlaceholder type="program" size="sm" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-tech text-base font-bold text-white tracking-wide">{p.name}</span>
                          <span className="text-[10px] font-mono-code bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] px-2 py-0.5 rounded-2xs font-bold">
                            {p.cost} eb
                          </span>
                        </div>
                        <div className="text-xs font-mono-code text-[#10b981]">{p.class}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-xs font-mono-code bg-[#181a25] p-2 rounded-xs border border-[#232738] mb-3 text-center">
                      <div><span className="text-[#64748b] block text-[10px]">ATK</span> <span className="text-white font-bold">{p.atk}</span></div>
                      <div><span className="text-[#64748b] block text-[10px]">DEF</span> <span className="text-white font-bold">{p.def}</span></div>
                      <div><span className="text-[#64748b] block text-[10px]">REZ</span> <span className="text-white font-bold">{p.rez}</span></div>
                    </div>

                    <p className="text-xs text-[#94a3b8] leading-relaxed font-sans">{p.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1f2334] text-[10px] font-mono-code text-[#64748b]">
                    CORE RULES (PÁGINA 368)
                  </div>
                </div>
              ))}

            </div>

          </div>
        )}

        {/* =====================================================
            TAB 3: DATA PACKS
        ===================================================== */}
        {activeTab === 'packs' && (
          <div className="chamfer-card p-6 bg-[#121319] border border-[#232736] max-w-4xl mx-auto">
            <div className="flex items-center gap-3 border-b border-[#1f2230] pb-4 mb-6">
              <FolderArchive className="w-6 h-6 text-[#a855f7]" />
              <div>
                <h2 className="font-tech text-lg font-bold text-white tracking-wider">PAQUETES MODULARES (.cprpack)</h2>
                <p className="text-xs text-[#64748b]">Módulos desacoplados inspirados en COMP/CON extraídos de tu biblioteca de PDFs.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { 
                  name: coreData.name, 
                  id: 'core-rules', 
                  items: `${coreData.weapons.length} Armas, ${coreData.armor.length} Blindajes, ${coreData.cyberware.length} Ciberware, ${coreData.programs.length} Programas`, 
                  status: 'INSTALADO Y ACTIVO', 
                  source: 'Core-Rules/Cyberpunk-RED-Core-Rulebook-v1.24.pdf' 
                },
                { 
                  name: 'Black Chrome & Black Chrome Plus', 
                  id: 'black-chrome', 
                  items: '180+ Objetos exóticos, vehículos y ciberware de lujo', 
                  status: 'LISTO PARA EXTRACCIÓN FASE 2', 
                  source: 'Sourcebooks/Cyberpunk-RED-Black-Chrome.pdf' 
                },
                { 
                  name: 'Edgerunners Mission Kit (CEMK 2077)', 
                  id: 'cemk-2077', 
                  items: 'Neuroports, Quickhacks, Armamento 2077', 
                  status: 'LISTO PARA EXTRACCIÓN FASE 2', 
                  source: 'Core-Rules/CEMK-Rulebook-Edgerunners.pdf' 
                },
                { 
                  name: 'Danger Gal Dossier NPC Library', 
                  id: 'danger-gal', 
                  items: '120+ Facciones y fichas de PNJs y jefes', 
                  status: 'LISTO PARA EXTRACCIÓN FASE 2', 
                  source: 'Sourcebooks/Cyberpunk-RED-Danger-Gal-Dossier.pdf' 
                },
                { 
                  name: 'Interface RED Volúmenes 1-3 y DLCs', 
                  id: 'dlc-pack', 
                  items: 'Serie 12 Days, Hornet\'s Pharmacy, Hardened Enemies', 
                  status: 'LISTO PARA EXTRACCIÓN FASE 2', 
                  source: 'DLC-Supplements/' 
                }
              ].map((pack, idx) => (
                <div key={idx} className="p-4 bg-[#171923] border border-[#222636] rounded-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${pack.status.includes('ACTIVO') ? 'text-[#10b981]' : 'text-[#64748b]'}`} />
                      <span className="font-tech text-base font-bold text-white">{pack.name}</span>
                      <span className="text-[10px] font-mono-code bg-[#232738] px-2 py-0.5 rounded text-[#94a3b8]">.{pack.id}.cprpack</span>
                    </div>
                    <div className="text-xs text-[#94a3b8] mt-1 font-mono-code">{pack.items}</div>
                    <div className="text-[10px] text-[#38bdf8] mt-0.5 font-mono-code">Fuente: {pack.source}</div>
                  </div>
                  <span className={`text-xs font-mono-code px-3 py-1 rounded-2xs font-bold ${
                    pack.status.includes('ACTIVO') 
                      ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30' 
                      : 'bg-[#222534] text-[#64748b]'
                  }`}>
                    {pack.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 4: STREET LAB (CHARACTER SHEET)
        ===================================================== */}
        {activeTab === 'sheet' && (
          <div className="chamfer-card p-8 bg-[#121319] border border-[#232736] max-w-4xl mx-auto text-center py-16">
            <User className="w-12 h-12 text-[#f59e0b] mx-auto mb-3" />
            <h2 className="font-tech text-xl font-bold text-white tracking-wider">STREET LAB // CREADOR Y FICHA</h2>
            <p className="text-xs text-[#94a3b8] max-w-md mx-auto mt-2 leading-relaxed">
              Configuración de Atributos (Complete Package, Streetrat, Edgerunner), orígenes de Lifepath e instalación anatómica de Ciberware con cálculo automático de Humanidad y Empatía.
            </p>
          </div>
        )}

        {/* =====================================================
            TAB 5: FIXER DECK (GM TOOLS)
        ===================================================== */}
        {activeTab === 'gm' && (
          <div className="chamfer-card p-8 bg-[#121319] border border-[#232736] max-w-4xl mx-auto text-center py-16">
            <Terminal className="w-12 h-12 text-[#10b981] mx-auto mb-3" />
            <h2 className="font-tech text-xl font-bold text-white tracking-wider">FIXER DECK // HERRAMIENTAS DE DIRECTORA DE JUEGO (GM)</h2>
            <p className="text-xs text-[#94a3b8] max-w-md mx-auto mt-2 leading-relaxed">
              Iniciativa grupal por turnos, generador de PNJs y pandilleros en 1 clic de Danger Gal Dossier, y simulador de arquitectura de Red (NET Architecture) piso por piso.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
