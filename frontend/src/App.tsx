import { useState } from 'react';
import { 
  Shield, 
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
  Flame
} from 'lucide-react';

import coreData from './data/core-rules.cprpack.json';

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
  baseStat: number;
  d10: number;
  crit: number;
  total: number;
  dv: number;
  margin: number;
  isSuccess: boolean;
  isCritSuccess: boolean;
  isCritFail: boolean;
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

  // Equipped Weapons state (with interactive magazine tracking)
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
  const [selectedRangeDv, setSelectedRangeDv] = useState<number>(15);

  // Perform Roll Action
  const executeRoll = (actionName: string, baseVal: number, targetDv: number) => {
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

    const newResult: RollResult = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action: actionName,
      baseStat: baseVal,
      d10,
      crit,
      total,
      dv: targetDv,
      margin,
      isSuccess,
      isCritSuccess,
      isCritFail
    };

    setRollHistory(prev => [newResult, ...prev.slice(0, 15)]);
  };

  // Consume Ammo
  const fireWeapon = (weapon: WeaponItem, rofCount: number = 1) => {
    if (weapon.standardMag && weapon.standardMag > 0) {
      if ((weapon.currentMag ?? 0) < rofCount) {
        return; // Empty
      }
      setWeapons(prev => prev.map(w => {
        if (w.id === weapon.id) {
          return { ...w, currentMag: Math.max(0, (w.currentMag ?? 0) - rofCount) };
        }
        return w;
      }));
    }
    executeRoll(`${weapon.name} (Attack)`, 14, selectedRangeDv);
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
          TOP COMMAND BAR (COMP/CON & CPR COMPANION MERGED STYLE)
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
                  v1.0.4
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                <span className="flex items-center gap-1 text-[#10b981]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  NEURAL LINK SYNCED
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
          PRIMARY TACTICAL NAVIGATION (COMP/CON HIGH-TECH STYLE)
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
            {isSeriouslyWounded && (
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
          MAIN CONTENT AREA
      ========================================================= */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* =====================================================
            TAB 1: ACTIVE COMBAT MODE (THE COMP/CON PILOT DECK)
        ===================================================== */}
        {activeTab === 'combat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* LEFT / CENTER COLUMN (8 COLS): Vitals, Armor & Weapons Deck */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* VITALS & DEFENSE MATRIX (Bespoke Hardware Panel) */}
              <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
                
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#1f2230] gap-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#dc2626]" />
                    <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">VITALS & BALLISTIC MATRIX</span>
                  </div>
                  
                  {/* Luck Pips Counter */}
                  <div className="flex items-center gap-2 text-xs font-mono-code bg-[#161822] px-2.5 py-1 rounded border border-[#232736]">
                    <span className="text-[#f59e0b] font-bold">LUCK POOL:</span>
                    <div className="flex gap-1">
                      {Array.from({ length: maxLuck }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentLuck(i + 1 === currentLuck ? i : i + 1)}
                          title={`Set Luck to ${i + 1}`}
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
                      title="Reset Luck Pool"
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
                      <span className="font-tech text-sm font-bold text-white tracking-wide">HIT POINTS</span>
                      {isSeriouslyWounded && (
                        <span className="bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#dc2626] font-mono-code text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" /> SERIOUSLY WOUNDED (-2 TO ALL ACTIONS)
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
                        Full Rest
                      </button>
                    </div>
                  </div>
                </div>

                {/* Armor Plates Grid (Head, Body & Optional Shield) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* HEAD ARMOR */}
                  <div className="bg-[#171923] p-4 rounded-sm border border-[#222636] relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-mono-code text-[#64748b] block tracking-wider uppercase">BALLISTIC PROTECTION</span>
                        <div className="font-tech text-base font-bold text-white flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-[#38bdf8]" />
                          HEAD ARMOR (SP)
                        </div>
                        <div className="text-[11px] text-[#94a3b8]">Light Armorjack (Kevlar/Mesh)</div>
                      </div>
                      <div className="text-right">
                        <span className="font-tech text-3xl font-bold text-white leading-none">{headSp}</span>
                        <span className="text-xs text-[#64748b] block font-mono-code">/ {maxHeadSp} SP</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#1f2332]">
                      <button 
                        onClick={() => setHeadSp(prev => Math.max(0, prev - 1))}
                        className="py-2 px-3 bg-[#dc2626]/10 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/30 rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 text-center"
                      >
                        -1 ABLATE
                      </button>
                      <button 
                        onClick={() => setHeadSp(maxHeadSp)}
                        className="py-2 px-3 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#2c3246] rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 text-center"
                      >
                        REPAIR
                      </button>
                    </div>
                  </div>

                  {/* BODY ARMOR */}
                  <div className="bg-[#171923] p-4 rounded-sm border border-[#222636] relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-mono-code text-[#64748b] block tracking-wider uppercase">TORSO PROTECTION</span>
                        <div className="font-tech text-base font-bold text-white flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-[#38bdf8]" />
                          BODY ARMOR (SP)
                        </div>
                        <div className="text-[11px] text-[#94a3b8]">Light Armorjack (Kevlar/Mesh)</div>
                      </div>
                      <div className="text-right">
                        <span className="font-tech text-3xl font-bold text-white leading-none">{bodySp}</span>
                        <span className="text-xs text-[#64748b] block font-mono-code">/ {maxBodySp} SP</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#1f2332]">
                      <button 
                        onClick={() => setBodySp(prev => Math.max(0, prev - 1))}
                        className="py-2 px-3 bg-[#dc2626]/10 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/30 rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 text-center"
                      >
                        -1 ABLATE
                      </button>
                      <button 
                        onClick={() => setBodySp(maxBodySp)}
                        className="py-2 px-3 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#2c3246] rounded-xs font-mono-code text-xs font-bold transition-all active:scale-95 text-center"
                      >
                        REPAIR
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* WEAPON ARSENAL & ACTION DECK */}
              <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
                <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#1f2230] gap-2">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-[#dc2626]" />
                    <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">EQUIPPED WEAPON ARSENAL</span>
                  </div>

                  {/* Range DV Quick Selector */}
                  <div className="flex items-center gap-1.5 text-xs font-mono-code bg-[#161822] px-2.5 py-1 rounded border border-[#232736]">
                    <span className="text-[#64748b]">TARGET RANGE DV:</span>
                    {[13, 15, 17, 20].map(dv => (
                      <button
                        key={dv}
                        onClick={() => setSelectedRangeDv(dv)}
                        className={`px-2 py-0.5 rounded-xs transition-all ${
                          selectedRangeDv === dv 
                            ? 'bg-[#dc2626] text-white font-bold' 
                            : 'text-[#94a3b8] hover:bg-[#232736]'
                        }`}
                      >
                        DV {dv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weapons List */}
                <div className="space-y-3">
                  {weapons.map((w) => {
                    const isRanged = w.type === 'Ranged';
                    const isOutOfAmmo = isRanged && (w.currentMag ?? 0) <= 0;

                    return (
                      <div 
                        key={w.id} 
                        className="bg-[#171923] p-4 rounded-sm border border-[#222636] hover:border-[#384058] transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          
                          {/* Weapon Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-tech text-lg font-bold text-white tracking-wide">{w.name}</span>
                              <span className="text-[10px] font-mono-code bg-[#232738] text-[#f59e0b] px-1.5 py-0.5 rounded">
                                {w.costTier}
                              </span>
                              <span className="text-[10px] font-mono-code text-[#64748b]">
                                {w.skill} (Base 14)
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-mono-code text-[#94a3b8]">
                              <span className="flex items-center gap-1 text-[#f43f5e] font-bold">
                                <Zap className="w-3.5 h-3.5" /> {w.damage} DMG
                              </span>
                              <span>•</span>
                              <span>ROF: {w.rof}</span>
                              <span>•</span>
                              <span>{w.hands} {w.hands === 1 ? 'Hand' : 'Hands'}</span>
                              {w.altFireModes && (
                                <>
                                  <span>•</span>
                                  <span className="text-[#38bdf8]">{w.altFireModes}</span>
                                </>
                              )}
                            </div>

                            {/* Ammo Clips Bar */}
                            {isRanged && (
                              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#1f2332] text-xs font-mono-code">
                                <span className="text-[#64748b]">MAGAZINE:</span>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: Math.min(25, w.standardMag ?? 0) }).map((_, i) => (
                                    <div 
                                      key={i}
                                      className={`h-2.5 w-1.5 rounded-2xs ${
                                        i < (w.currentMag ?? 0) 
                                          ? 'bg-[#38bdf8]' 
                                          : 'bg-[#2b3044]'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className={`font-bold ml-1 ${isOutOfAmmo ? 'text-[#dc2626]' : 'text-white'}`}>
                                  {w.currentMag} / {w.standardMag}
                                </span>

                                {isOutOfAmmo && (
                                  <span className="text-[#dc2626] font-bold text-[10px] ml-1">EMPTY</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end md:self-center">
                            {isRanged && isOutOfAmmo ? (
                              <button
                                onClick={() => reloadWeapon(w.id)}
                                className="px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-black font-tech font-bold tracking-wider text-sm chamfer-btn transition-all active:scale-95"
                              >
                                RELOAD MAG
                              </button>
                            ) : (
                              <button
                                onClick={() => fireWeapon(w, 1)}
                                className="px-5 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold tracking-wider text-sm chamfer-btn transition-all active:scale-95 shadow-md shadow-[#dc2626]/20 flex items-center gap-2"
                              >
                                <Dices className="w-4 h-4" />
                                <span>ATTACK (DV {selectedRangeDv})</span>
                              </button>
                            )}

                            {isRanged && !isOutOfAmmo && (w.currentMag ?? 0) < (w.standardMag ?? 0) && (
                              <button
                                onClick={() => reloadWeapon(w.id)}
                                className="p-2.5 bg-[#222534] hover:bg-[#2d3246] border border-[#2d3348] text-[#94a3b8] hover:text-white rounded-xs transition-all active:scale-95"
                                title="Reload"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN (4 COLS): TACTICAL COMBAT LOG & ROLL ENGINE */}
            <div className="lg:col-span-4 space-y-5">
              
              <div className="chamfer-card p-5 bg-[#121319] border border-[#232736] flex flex-col h-full min-h-[500px]">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1f2230]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#38bdf8]" />
                    <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">COMBAT DICE LOG</span>
                  </div>
                  {rollHistory.length > 0 && (
                    <button 
                      onClick={() => setRollHistory([])}
                      className="text-[10px] font-mono-code text-[#64748b] hover:text-[#dc2626] transition-colors"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Roll Feed */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[640px]">
                  {rollHistory.length === 0 ? (
                    <div className="text-center py-16 text-[#64748b] font-mono-code text-xs">
                      <Crosshair className="w-8 h-8 text-[#282d3e] mx-auto mb-2" />
                      Combat telemetry ready.<br />
                      Trigger any weapon attack to see rolls.
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
                            {r.isSuccess ? `HIT (DV ${r.dv})` : `MISS (DV ${r.dv})`}
                          </span>
                        </div>

                        {/* Roll Formula Breakdown */}
                        <div className="flex items-baseline justify-between text-xs font-mono-code text-[#94a3b8] mt-1">
                          <div>
                            Base {r.baseStat} + 1d10({r.d10})
                            {r.isCritSuccess && <span className="text-[#10b981] font-bold"> [CRIT +{r.crit}]</span>}
                            {r.isCritFail && <span className="text-[#dc2626] font-bold"> [FUMBLE {r.crit}]</span>}
                          </div>
                          <div className="text-right">
                            <span className="text-white font-bold text-sm">TOTAL: {r.total}</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-[#64748b] font-mono-code mt-1 text-right">
                          {r.timestamp} • Margin: {r.margin >= 0 ? `+${r.margin}` : `${r.margin}`}
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
            TAB 2: MASTER COMPENDIUM (COMP/CON STYLE DATABASE)
        ===================================================== */}
        {activeTab === 'compendium' && (
          <div className="space-y-5">
            
            {/* Filter and Search Bar */}
            <div className="chamfer-card p-4 bg-[#121319] border border-[#232736] flex flex-wrap items-center justify-between gap-4">
              
              {/* Search Field */}
              <div className="flex items-center gap-2 flex-1 min-w-[280px] bg-[#171923] px-3.5 py-2 rounded-xs border border-[#262b3c]">
                <Search className="w-4 h-4 text-[#64748b]" />
                <input 
                  type="text"
                  placeholder="Search across all weapons, armor, cyberware, and net programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-[#64748b] font-mono-code"
                />
              </div>

              {/* Category Filter Pills */}
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
              {(selectedCompCategory === 'all' || selectedCompCategory === 'weapons') && filteredWeapons.map(w => (
                <div 
                  key={w.id} 
                  className="chamfer-card p-4 bg-[#13151e] border border-[#222636] hover:border-[#dc2626]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-tech text-base font-bold text-white tracking-wide">{w.name}</span>
                      <span className="text-[10px] font-mono-code bg-[#dc2626]/20 border border-[#dc2626]/30 text-[#dc2626] px-2 py-0.5 rounded-2xs font-bold">
                        {w.cost} eb
                      </span>
                    </div>

                    <div className="text-xs font-mono-code text-[#f59e0b] mb-2">{w.skill} • {w.type}</div>

                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono-code bg-[#181a25] p-2.5 rounded-xs border border-[#232738] mb-3">
                      <div><span className="text-[#64748b]">DMG:</span> <span className="text-white font-bold">{w.damage}</span></div>
                      <div><span className="text-[#64748b]">ROF:</span> <span className="text-white font-bold">{w.rof}</span></div>
                      <div><span className="text-[#64748b]">HANDS:</span> <span className="text-white">{w.hands}</span></div>
                      <div><span className="text-[#64748b]">CONCEAL:</span> <span className="text-white">{w.concealable ? 'Yes' : 'No'}</span></div>
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
                        executeRoll(`${w.name} (Compendium Test)`, 14, 15);
                      }}
                      className="text-[#dc2626] hover:text-white flex items-center gap-1 font-bold transition-colors"
                    >
                      <Dices className="w-3.5 h-3.5" /> Test Roll
                    </button>
                  </div>
                </div>
              ))}

              {/* Armor Catalog */}
              {(selectedCompCategory === 'all' || selectedCompCategory === 'armor') && filteredArmor.map(a => (
                <div 
                  key={a.id} 
                  className="chamfer-card p-4 bg-[#13151e] border border-[#222636] hover:border-[#38bdf8]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-tech text-base font-bold text-white tracking-wide">{a.name}</span>
                      <span className="text-[10px] font-mono-code bg-[#38bdf8]/20 border border-[#38bdf8]/30 text-[#38bdf8] px-2 py-0.5 rounded-2xs font-bold">
                        {a.cost} eb
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono-code my-2 bg-[#181a25] p-2 rounded-xs border border-[#232738]">
                      <span className="text-[#10b981] font-bold">SP {a.sp}</span>
                      <span className="text-[#64748b]">|</span>
                      <span className="text-[#f59e0b]">Penalty: {a.penalty === 0 ? 'None' : `${a.penalty} REF/DEX/MOVE`}</span>
                    </div>

                    <p className="text-xs text-[#94a3b8] leading-relaxed font-sans">{a.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1f2334] text-[10px] font-mono-code text-[#64748b]">
                    CORE RULES (PAGE 351)
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
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-tech text-base font-bold text-white tracking-wide">{c.name}</span>
                      <span className="text-[10px] font-mono-code bg-[#f59e0b]/20 border border-[#f59e0b]/30 text-[#f59e0b] px-2 py-0.5 rounded-2xs font-bold">
                        {c.cost} eb
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code my-2 bg-[#181a25] p-2 rounded-xs border border-[#232738]">
                      <span className="text-[#c084fc] font-bold">{c.type}</span>
                      <span className="text-[#64748b]">|</span>
                      <span className="text-[#94a3b8]">Install: {c.install}</span>
                      <span className="text-[#64748b]">|</span>
                      <span className="text-[#dc2626] font-bold">HL: {c.humanityLoss}</span>
                    </div>

                    <p className="text-xs text-[#94a3b8] leading-relaxed font-sans">{c.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1f2334] text-[10px] font-mono-code text-[#64748b]">
                    CORE RULES (PAGE 359)
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
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-tech text-base font-bold text-white tracking-wide">{p.name}</span>
                      <span className="text-[10px] font-mono-code bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] px-2 py-0.5 rounded-2xs font-bold">
                        {p.cost} eb
                      </span>
                    </div>

                    <div className="text-xs font-mono-code text-[#10b981] mb-2">{p.class}</div>

                    <div className="grid grid-cols-3 gap-1 text-xs font-mono-code bg-[#181a25] p-2 rounded-xs border border-[#232738] mb-3 text-center">
                      <div><span className="text-[#64748b] block text-[10px]">ATK</span> <span className="text-white font-bold">{p.atk}</span></div>
                      <div><span className="text-[#64748b] block text-[10px]">DEF</span> <span className="text-white font-bold">{p.def}</span></div>
                      <div><span className="text-[#64748b] block text-[10px]">REZ</span> <span className="text-white font-bold">{p.rez}</span></div>
                    </div>

                    <p className="text-xs text-[#94a3b8] leading-relaxed font-sans">{p.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1f2334] text-[10px] font-mono-code text-[#64748b]">
                    CORE RULES (PAGE 368)
                  </div>
                </div>
              ))}

            </div>

          </div>
        )}

        {/* =====================================================
            TAB 3: DATA PACKS (CONTENT MANAGER)
        ===================================================== */}
        {activeTab === 'packs' && (
          <div className="chamfer-card p-6 bg-[#121319] border border-[#232736] max-w-4xl mx-auto">
            <div className="flex items-center gap-3 border-b border-[#1f2230] pb-4 mb-6">
              <FolderArchive className="w-6 h-6 text-[#a855f7]" />
              <div>
                <h2 className="font-tech text-lg font-bold text-white tracking-wider">MODULAR CONTENT PACKS (.cprpack)</h2>
                <p className="text-xs text-[#64748b]">COMP/CON-style decoupled rulebooks and expansions extracted from your PDF library.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { 
                  name: coreData.name, 
                  id: 'core-rules', 
                  items: `${coreData.weapons.length} Weapons, ${coreData.armor.length} Armor types, ${coreData.cyberware.length} Cyberware, ${coreData.programs.length} Programs`, 
                  status: 'INSTALLED & ACTIVE', 
                  source: 'Core-Rules/Cyberpunk-RED-Core-Rulebook-v1.24.pdf' 
                },
                { 
                  name: 'Black Chrome & Black Chrome Plus', 
                  id: 'black-chrome', 
                  items: '180+ Exotic Tech, Luxury Wheels & Cyberware', 
                  status: 'READY FOR PHASE 2 EXTRACTION', 
                  source: 'Sourcebooks/Cyberpunk-RED-Black-Chrome.pdf' 
                },
                { 
                  name: 'Edgerunners Mission Kit (CEMK 2077)', 
                  id: 'cemk-2077', 
                  items: 'Neuroports, Quickhacks, 2077 Weapons', 
                  status: 'READY FOR PHASE 2 EXTRACTION', 
                  source: 'Core-Rules/CEMK-Rulebook-Edgerunners.pdf' 
                },
                { 
                  name: 'Danger Gal Dossier NPC Library', 
                  id: 'danger-gal', 
                  items: '120+ Faction NPCs & Boss Statblocks', 
                  status: 'READY FOR PHASE 2 EXTRACTION', 
                  source: 'Sourcebooks/Cyberpunk-RED-Danger-Gal-Dossier.pdf' 
                },
                { 
                  name: 'Interface RED Volumes 1-3 & All DLCs', 
                  id: 'dlc-pack', 
                  items: '12 Days series, Hornet\'s Pharmacy, Hardened Enemies', 
                  status: 'READY FOR PHASE 2 EXTRACTION', 
                  source: 'DLC-Supplements/' 
                }
              ].map((pack, idx) => (
                <div key={idx} className="p-4 bg-[#171923] border border-[#222636] rounded-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${pack.status.includes('ACTIVE') ? 'text-[#10b981]' : 'text-[#64748b]'}`} />
                      <span className="font-tech text-base font-bold text-white">{pack.name}</span>
                      <span className="text-[10px] font-mono-code bg-[#232738] px-2 py-0.5 rounded text-[#94a3b8]">.{pack.id}.cprpack</span>
                    </div>
                    <div className="text-xs text-[#94a3b8] mt-1 font-mono-code">{pack.items}</div>
                    <div className="text-[10px] text-[#38bdf8] mt-0.5 font-mono-code">Source: {pack.source}</div>
                  </div>
                  <span className={`text-xs font-mono-code px-3 py-1 rounded-2xs font-bold ${
                    pack.status.includes('ACTIVE') 
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
            <h2 className="font-tech text-xl font-bold text-white tracking-wider">STREET LAB // CHARACTER BUILDER & HANGAR</h2>
            <p className="text-xs text-[#94a3b8] max-w-md mx-auto mt-2 leading-relaxed">
              Complete Package (Point Buy), Streetrat & Edgerunner generation, Lifepath origins, Cyberware anatomical slotting with real-time Humanity & Empathy tracking.
            </p>
          </div>
        )}

        {/* =====================================================
            TAB 5: FIXER DECK (GM TOOLS)
        ===================================================== */}
        {activeTab === 'gm' && (
          <div className="chamfer-card p-8 bg-[#121319] border border-[#232736] max-w-4xl mx-auto text-center py-16">
            <Terminal className="w-12 h-12 text-[#10b981] mx-auto mb-3" />
            <h2 className="font-tech text-xl font-bold text-white tracking-wider">FIXER DECK // GM ENCOUNTER & NETRUNNER HUB</h2>
            <p className="text-xs text-[#94a3b8] max-w-md mx-auto mt-2 leading-relaxed">
              Combat initiative order, 1-click Danger Gal Dossier & Hardened Mook spawner, and interactive NET Architecture floor-by-floor runner.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
