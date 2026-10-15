import { useState } from 'react';
import { 
  Shield, 
  Heart, 
  Crosshair, 
  Terminal, 
  Cpu, 
  User, 
  BookOpen, 
  Dices, 
  RefreshCw,
  FolderArchive,
  CheckCircle2,
  Search
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
  ammoType?: string;
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'active' | 'lab' | 'compendium' | 'fixer' | 'packs'>('active');
  const [era, setEra] = useState<'2045' | '2077'>('2045');
  
  // Active Character State for Demo / Table HUD
  const [hp, setHp] = useState(35);
  const maxHp = 40;
  const [headSp, setHeadSp] = useState(11);
  const maxHeadSp = 11;
  const [bodySp, setBodySp] = useState(11);
  const maxBodySp = 11;
  const [luck, setLuck] = useState(6);
  const maxLuck = 7;
  
  // Equipped weapons
  const [equippedWeapons] = useState<WeaponItem[]>([
    coreData.weapons[1] as WeaponItem, // Heavy Pistol
    coreData.weapons[6] as WeaponItem, // Assault Rifle
    coreData.weapons[2] as WeaponItem  // Heavy Melee
  ]);

  // Compendium state
  const [searchQuery, setSearchQuery] = useState('');
  const [compendiumCategory, setCompendiumCategory] = useState<'all' | 'weapons' | 'armor' | 'cyberware' | 'programs'>('all');

  // Dice Roll Log
  const [rollLog, setRollLog] = useState<{ id: string; name: string; roll: number; d10: number; explode: number; total: number; dv: number; success: boolean }[]>([]);

  const rollCheck = (name: string, baseStat: number = 14, targetDv: number = 15) => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    let explode = 0;
    if (d10 === 10) {
      explode = Math.floor(Math.random() * 10) + 1;
    } else if (d10 === 1) {
      explode = -(Math.floor(Math.random() * 10) + 1);
    }
    const total = baseStat + d10 + explode;
    const entry = {
      id: Date.now().toString(),
      name,
      roll: baseStat,
      d10,
      explode,
      total,
      dv: targetDv,
      success: total >= targetDv
    };
    setRollLog(prev => [entry, ...prev.slice(0, 11)]);
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
    <div className="min-h-screen bg-[#0a0b10] text-[#f0f2f5] flex flex-col font-mono selection:bg-[#ff003c] selection:text-white">
      {/* Top Header / Diegetic Terminal HUD */}
      <header className="border-b border-[#2a2f42] bg-[#12141c]/90 backdrop-blur sticky top-0 z-50 px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00ff66] animate-pulse"></div>
          <div>
            <span className="font-black tracking-widest text-[#ff003c] text-lg">OMNI-DECK</span>
            <span className="text-xs text-[#7d8597] ml-2 hidden sm:inline-block">CYBERPUNK RED & 2077 COMPANION</span>
          </div>
        </div>

        {/* Era Switcher */}
        <div className="flex items-center bg-[#0a0b10] p-1 rounded border border-[#2a2f42] text-xs">
          <button 
            onClick={() => setEra('2045')}
            className={`px-3 py-1 rounded transition-all ${era === '2045' ? 'bg-[#ff003c] text-white font-bold' : 'text-[#7d8597] hover:text-white'}`}
          >
            RED 2045
          </button>
          <button 
            onClick={() => setEra('2077')}
            className={`px-3 py-1 rounded transition-all ${era === '2077' ? 'bg-[#00f0ff] text-black font-bold' : 'text-[#7d8597] hover:text-white'}`}
          >
            CEMK 2077
          </button>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-4 text-xs text-[#7d8597]">
          <span className="flex items-center gap-1.5 text-[#00ff66]">
            <Cpu className="w-3.5 h-3.5" /> PWA OFFLINE READY
          </span>
          <span className="border border-[#2a2f42] px-2 py-0.5 rounded text-[#fcee0a]">
            {coreData.name} v{coreData.version}
          </span>
        </div>
      </header>

      {/* Navigation Bar (COMP/CON Style) */}
      <nav className="border-b border-[#2a2f42] bg-[#181b26] px-4 flex gap-1 overflow-x-auto text-xs uppercase tracking-wider">
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap ${
            activeTab === 'active' 
              ? 'border-[#ff003c] text-[#ff003c] bg-[#ff003c]/10' 
              : 'border-transparent text-[#7d8597] hover:text-white'
          }`}
        >
          <Crosshair className="w-4 h-4" /> Active Gig (Combat HUD)
        </button>

        <button 
          onClick={() => setActiveTab('lab')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap ${
            activeTab === 'lab' 
              ? 'border-[#fcee0a] text-[#fcee0a] bg-[#fcee0a]/10' 
              : 'border-transparent text-[#7d8597] hover:text-white'
          }`}
        >
          <User className="w-4 h-4" /> Street Lab (Character)
        </button>

        <button 
          onClick={() => setActiveTab('compendium')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap ${
            activeTab === 'compendium' 
              ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10' 
              : 'border-transparent text-[#7d8597] hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Compendium (Database)
        </button>

        <button 
          onClick={() => setActiveTab('fixer')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap ${
            activeTab === 'fixer' 
              ? 'border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10' 
              : 'border-transparent text-[#7d8597] hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" /> Fixer Deck (GM Tools)
        </button>

        <button 
          onClick={() => setActiveTab('packs')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap ${
            activeTab === 'packs' 
              ? 'border-[#c084fc] text-[#c084fc] bg-[#c084fc]/10' 
              : 'border-transparent text-[#7d8597] hover:text-white'
          }`}
        >
          <FolderArchive className="w-4 h-4" /> Data Packs (.cprpack)
        </button>
      </nav>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {/* TAB 1: Active Combat Mode */}
        {activeTab === 'active' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left 2 Columns: Vitals & Weapon Deck */}
            <div className="lg:col-span-2 space-y-4">
              {/* Tactical Vitals Card */}
              <div className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3 border-b border-[#2a2f42] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#ff003c]">SLOT 1 // JOHNNY "RAVEN" V</span>
                    <span className="text-xs bg-[#2a2f42] px-2 py-0.5 rounded text-[#7d8597]">SOLO // RANK 4</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#fcee0a]">
                    <span>LUCK: {luck}/{maxLuck}</span>
                    <button 
                      onClick={() => setLuck(Math.max(0, luck - 1))}
                      className="px-2 py-0.5 bg-[#2a2f42] rounded hover:bg-[#ff003c] text-white"
                    >
                      -1
                    </button>
                    <button 
                      onClick={() => setLuck(maxLuck)}
                      className="px-1.5 py-0.5 bg-[#2a2f42] rounded hover:bg-[#00ff66] text-white"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* HP Gauge */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-[#ff003c] font-bold">
                      <Heart className="w-3.5 h-3.5" /> HIT POINTS
                    </span>
                    <span>{hp} / {maxHp} {hp <= 20 && <span className="text-[#fcee0a] font-bold ml-2">SERIOUSLY WOUNDED</span>}</span>
                  </div>
                  <div className="w-full bg-[#1e2230] h-4 rounded overflow-hidden flex">
                    <div 
                      className={`h-full transition-all ${hp <= 20 ? 'bg-[#ff003c]' : 'bg-[#00ff66]'}`}
                      style={{ width: `${(hp / maxHp) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setHp(Math.max(0, hp - 5))} className="px-2 py-1 bg-[#2a2f42] hover:bg-[#ff003c] text-xs rounded">-5 HP</button>
                    <button onClick={() => setHp(Math.max(0, hp - 1))} className="px-2 py-1 bg-[#2a2f42] hover:bg-[#ff003c] text-xs rounded">-1 HP</button>
                    <button onClick={() => setHp(Math.min(maxHp, hp + 5))} className="px-2 py-1 bg-[#2a2f42] hover:bg-[#00ff66] text-xs rounded">+5 HP</button>
                    <button onClick={() => setHp(maxHp)} className="px-2 py-1 bg-[#2a2f42] hover:bg-[#00ff66] text-xs rounded">Full Rest</button>
                  </div>
                </div>

                {/* Head & Body Armor Ablation */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#181b26] p-3 rounded border border-[#2a2f42]">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="flex items-center gap-1 font-bold text-[#00f0ff]">
                        <Shield className="w-3.5 h-3.5" /> HEAD SP (Light Armorjack)
                      </span>
                      <span className="text-sm font-bold">{headSp} / {maxHeadSp}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => setHeadSp(Math.max(0, headSp - 1))}
                        className="flex-1 py-1 bg-[#ff003c]/20 border border-[#ff003c]/40 hover:bg-[#ff003c] text-xs rounded font-bold"
                      >
                        -1 Ablate
                      </button>
                      <button 
                        onClick={() => setHeadSp(maxHeadSp)}
                        className="px-2 py-1 bg-[#2a2f42] hover:bg-[#00ff66] text-xs rounded"
                      >
                        Repair
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#181b26] p-3 rounded border border-[#2a2f42]">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="flex items-center gap-1 font-bold text-[#00f0ff]">
                        <Shield className="w-3.5 h-3.5" /> BODY SP (Light Armorjack)
                      </span>
                      <span className="text-sm font-bold">{bodySp} / {maxBodySp}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => setBodySp(Math.max(0, bodySp - 1))}
                        className="flex-1 py-1 bg-[#ff003c]/20 border border-[#ff003c]/40 hover:bg-[#ff003c] text-xs rounded font-bold"
                      >
                        -1 Ablate
                      </button>
                      <button 
                        onClick={() => setBodySp(maxBodySp)}
                        className="px-2 py-1 bg-[#2a2f42] hover:bg-[#00ff66] text-xs rounded"
                      >
                        Repair
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weapon Action Deck */}
              <div className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs uppercase tracking-wider text-[#7d8597] flex items-center gap-2">
                    <Crosshair className="w-3.5 h-3.5 text-[#ff003c]" /> Equipped Weapons & Quick Rolls
                  </h3>
                  <span className="text-[10px] text-[#00f0ff]">REF 8 + Skill 6 = Base 14</span>
                </div>
                <div className="space-y-2">
                  {equippedWeapons.map((w) => (
                    <div key={w.id} className="bg-[#181b26] p-3 rounded border border-[#2a2f42] flex flex-wrap items-center justify-between gap-3 hover:border-[#ff003c]/50 transition-all">
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          {w.name}
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2f42] text-[#fcee0a]">{w.costTier}</span>
                        </div>
                        <div className="text-xs text-[#7d8597]">
                          Skill: <span className="text-[#fcee0a]">{w.skill}</span> | Dmg: <span className="text-[#ff003c] font-bold">{w.damage}</span> | ROF: {w.rof} {w.standardMag ? `| Mag: ${w.standardMag}` : ''}
                        </div>
                        {w.dvTable && <div className="text-[10px] text-[#00f0ff] mt-0.5">{w.dvTable}</div>}
                      </div>
                      <button 
                        onClick={() => rollCheck(w.name, 14, 15)}
                        className="px-4 py-2 bg-[#ff003c] hover:bg-[#ff003c]/80 text-white rounded font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#ff003c]/20"
                      >
                        <Dices className="w-4 h-4" /> FIRE (DV 15)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Tactical Roll Log & Feed */}
            <div className="space-y-4">
              <div className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-4">
                <h3 className="text-xs uppercase tracking-wider text-[#7d8597] mb-3 flex items-center gap-2">
                  <Dices className="w-3.5 h-3.5 text-[#fcee0a]" /> Combat Dice Feed
                </h3>
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {rollLog.length === 0 ? (
                    <div className="text-xs text-[#7d8597] text-center py-10">
                      Combat ready.<br />Tap any equipped weapon to roll attack.
                    </div>
                  ) : (
                    rollLog.map(r => (
                      <div key={r.id} className="p-2.5 rounded bg-[#181b26] border border-[#2a2f42] text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-white truncate max-w-[150px]">{r.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.success ? 'bg-[#00ff66]/20 text-[#00ff66]' : 'bg-[#ff003c]/20 text-[#ff003c]'}`}>
                            {r.success ? 'SUCCESS' : 'FAILED'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[#7d8597]">
                          <span>Base {r.roll} + 1d10({r.d10}){r.explode !== 0 ? ` [Crit: ${r.explode > 0 ? '+' : ''}${r.explode}]` : ''}</span>
                          <span className="font-bold text-white">Total: {r.total} vs DV {r.dv}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Master Compendium (COMP/CON Database) */}
        {activeTab === 'compendium' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-[#0a0b10] px-3 py-2 rounded border border-[#2a2f42]">
                <Search className="w-4 h-4 text-[#7d8597]" />
                <input 
                  type="text"
                  placeholder="Search weapons, armor, cyberware, programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-[#7d8597]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-1 text-xs">
                {(['all', 'weapons', 'armor', 'cyberware', 'programs'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCompendiumCategory(cat)}
                    className={`px-3 py-1.5 rounded uppercase font-bold transition-all ${
                      compendiumCategory === cat 
                        ? 'bg-[#00f0ff] text-black' 
                        : 'bg-[#181b26] text-[#7d8597] hover:text-white border border-[#2a2f42]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Weapons */}
              {(compendiumCategory === 'all' || compendiumCategory === 'weapons') && filteredWeapons.map(w => (
                <div key={w.id} className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-4 hover:border-[#ff003c] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white text-sm">{w.name}</span>
                      <span className="text-[10px] bg-[#ff003c]/20 text-[#ff003c] px-2 py-0.5 rounded font-bold">{w.cost}eb</span>
                    </div>
                    <div className="text-xs text-[#fcee0a] mb-2">{w.skill} • {w.type}</div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-[#7d8597] bg-[#181b26] p-2 rounded mb-2">
                      <div>Dmg: <span className="text-white font-bold">{w.damage}</span></div>
                      <div>ROF: <span className="text-white font-bold">{w.rof}</span></div>
                      <div>Hands: <span className="text-white">{w.hands}</span></div>
                      <div>Conceal: <span className="text-white">{w.concealable ? 'Yes' : 'No'}</span></div>
                    </div>
                    <p className="text-[11px] text-[#7d8597] leading-relaxed">{w.notes}</p>
                    {w.dvTable && <div className="text-[10px] text-[#00f0ff] mt-2 border-t border-[#2a2f42] pt-1">{w.dvTable}</div>}
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2a2f42] flex justify-between items-center text-[10px] text-[#7d8597]">
                    <span>Source: Core Rules</span>
                    <button 
                      onClick={() => rollCheck(w.name, 14, 15)}
                      className="text-[#ff003c] hover:underline flex items-center gap-1 font-bold"
                    >
                      <Dices className="w-3 h-3" /> Test Roll
                    </button>
                  </div>
                </div>
              ))}

              {/* Armor */}
              {(compendiumCategory === 'all' || compendiumCategory === 'armor') && filteredArmor.map(a => (
                <div key={a.id} className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-4 hover:border-[#00f0ff] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white text-sm">{a.name}</span>
                      <span className="text-[10px] bg-[#00f0ff]/20 text-[#00f0ff] px-2 py-0.5 rounded font-bold">{a.cost}eb</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs mb-2">
                      <span className="text-[#00ff66] font-bold">SP {a.sp}</span>
                      <span className="text-[#fcee0a]">Penalty: {a.penalty === 0 ? 'None' : `${a.penalty} REF/DEX/MOVE`}</span>
                    </div>
                    <p className="text-[11px] text-[#7d8597] leading-relaxed">{a.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2a2f42] text-[10px] text-[#7d8597]">
                    <span>Source: Core Rules (pg. 351)</span>
                  </div>
                </div>
              ))}

              {/* Cyberware */}
              {(compendiumCategory === 'all' || compendiumCategory === 'cyberware') && filteredCyberware.map(c => (
                <div key={c.id} className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-4 hover:border-[#fcee0a] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white text-sm">{c.name}</span>
                      <span className="text-[10px] bg-[#fcee0a]/20 text-[#fcee0a] px-2 py-0.5 rounded font-bold">{c.cost}eb</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <span className="text-[#c084fc] font-bold">{c.type}</span>
                      <span className="text-[#7d8597]">| Install: {c.install}</span>
                      <span className="text-[#ff003c] font-bold">HL: {c.humanityLoss}</span>
                    </div>
                    <p className="text-[11px] text-[#7d8597] leading-relaxed">{c.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2a2f42] text-[10px] text-[#7d8597]">
                    <span>Source: Core Rules (pg. 359)</span>
                  </div>
                </div>
              ))}

              {/* Programs */}
              {(compendiumCategory === 'all' || compendiumCategory === 'programs') && filteredPrograms.map(p => (
                <div key={p.id} className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-4 hover:border-[#00ff66] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      <span className="text-[10px] bg-[#00ff66]/20 text-[#00ff66] px-2 py-0.5 rounded font-bold">{p.cost}eb</span>
                    </div>
                    <div className="text-xs text-[#00ff66] mb-2">{p.class}</div>
                    <div className="grid grid-cols-3 gap-1 text-xs text-[#7d8597] bg-[#181b26] p-2 rounded mb-2">
                      <div>ATK: <span className="text-white font-bold">{p.atk}</span></div>
                      <div>DEF: <span className="text-white font-bold">{p.def}</span></div>
                      <div>REZ: <span className="text-white font-bold">{p.rez}</span></div>
                    </div>
                    <p className="text-[11px] text-[#7d8597] leading-relaxed">{p.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2a2f42] text-[10px] text-[#7d8597]">
                    <span>Source: Core Rules (pg. 368)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Data Packs View (COMP/CON .lcp model) */}
        {activeTab === 'packs' && (
          <div className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 border-b border-[#2a2f42] pb-4 mb-6">
              <FolderArchive className="w-6 h-6 text-[#c084fc]" />
              <div>
                <h2 className="text-lg font-bold text-white">CONTENT MANAGER // DATA PACKS (.cprpack)</h2>
                <p className="text-xs text-[#7d8597]">Modular rulebooks and supplements extracted from your PDF library without copyright lock-in.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: coreData.name, id: 'core-rules', items: `${coreData.weapons.length} Weapons, ${coreData.armor.length} Armor types, ${coreData.cyberware.length} Cyberware, ${coreData.programs.length} Programs`, status: 'ACTIVE', source: 'Core-Rules/Cyberpunk-RED-Core-Rulebook-v1.24.pdf' },
                { name: 'Black Chrome & Black Chrome Plus', id: 'black-chrome', items: '180+ Luxury Tech, Exotic Guns & Vehicles', status: 'PENDING PHASE 2', source: 'Sourcebooks/Cyberpunk-RED-Black-Chrome.pdf' },
                { name: 'Edgerunners Mission Kit (CEMK 2077)', id: 'cemk-2077', items: 'Neuroports, Quickhacks, 2077 Arsenal', status: 'PENDING PHASE 2', source: 'Core-Rules/CEMK-Rulebook-Edgerunners.pdf' },
                { name: 'Danger Gal Dossier NPC Library', id: 'danger-gal', items: '120+ Faction NPCs & Boss Statblocks', status: 'PENDING PHASE 2', source: 'Sourcebooks/Cyberpunk-RED-Danger-Gal-Dossier.pdf' },
                { name: 'All DLCs & Interface RED Pack', id: 'dlc-pack', items: '12 Days series, Hornet\'s Pharmacy, Hardened Enemies', status: 'PENDING PHASE 2', source: 'DLC-Supplements/' }
              ].map((pack, idx) => (
                <div key={idx} className="p-4 bg-[#181b26] border border-[#2a2f42] rounded-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${pack.status === 'ACTIVE' ? 'text-[#00ff66]' : 'text-[#7d8597]'}`} />
                      <span className="font-bold text-white text-sm">{pack.name}</span>
                      <span className="text-[10px] bg-[#2a2f42] px-2 py-0.5 rounded text-[#7d8597]">.{pack.id}.cprpack</span>
                    </div>
                    <div className="text-xs text-[#7d8597] mt-1">{pack.items}</div>
                    <div className="text-[10px] text-[#00f0ff] mt-0.5">Source: {pack.source}</div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded font-bold ${
                    pack.status === 'ACTIVE' 
                      ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30' 
                      : 'bg-[#2a2f42] text-[#7d8597]'
                  }`}>
                    {pack.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Street Lab Placeholder */}
        {activeTab === 'lab' && (
          <div className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-6 max-w-4xl mx-auto text-center py-12">
            <User className="w-12 h-12 text-[#fcee0a] mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white">STREET LAB // CHARACTER BUILDER & HANGAR</h2>
            <p className="text-xs text-[#7d8597] max-w-md mx-auto mt-1">
              Configure STATs (Complete Package, Streetrat, Edgerunner), install slotted Cyberware with humanity tracking, and roll full Lifepath origins.
            </p>
          </div>
        )}

        {/* TAB 5: Fixer Deck Placeholder */}
        {activeTab === 'fixer' && (
          <div className="bg-[#12141c] border border-[#2a2f42] rounded-lg p-6 max-w-4xl mx-auto text-center py-12">
            <Terminal className="w-12 h-12 text-[#00ff66] mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white">FIXER DECK // GM ENCOUNTER & NETRUNNER HUB</h2>
            <p className="text-xs text-[#7d8597] max-w-md mx-auto mt-1">
              Combat initiative order, 1-click Danger Gal / Hardened Mook spawner, and interactive NET Architecture floor-by-floor runner.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
