import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Terminal, 
  Car, 
  Wrench, 
  HeartPulse, 
  Users, 
  Trash2, 
  Sparkles, 
  Layers, 
  Crosshair
} from 'lucide-react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { 
  NET_ARCHITECTURE_PRESETS, 
  NET_ACTIONS_CATALOG, 
  QUICKHACKS_2077_CATALOG, 
  ROLES_INTERACTIVE_GUIDES, 
  VEHICLES_CATALOG, 
  generateRandomNetFloor,
  type NetFloor,
  type NetArchitecturePreset,
  type Quickhack2077,
  type VehicleSpec
} from '../../data/netAndRolesData';
import type { SoloCombatAwarenessAllocation, OwnedVehicle } from '../../types/cyberpunk';

type ActiveTab = 'netrunning' | 'quickhacks' | 'roles' | 'vehicles';

export const NetAndRolesDeckView: React.FC = () => {
  const { 
    characters, 
    activeCharacterId, 
    updateSoloAllocation, 
    addVehicleToCharacter, 
    updateVehicleSdp, 
    updateVehicleArmorSp, 
    removeVehicleFromCharacter,
    updateMedtechLab,
    updateTechProjects
  } = useCharacterStore();

  const character = characters.find(c => c.id === activeCharacterId) || characters[0];

  const [activeTab, setActiveTab] = useState<ActiveTab>('netrunning');

  // ==========================================================================
  // 1. ESTADO DE NETRUNNING 2045
  // ==========================================================================
  const [selectedPresetId, setSelectedPresetId] = useState<string>(NET_ARCHITECTURE_PRESETS[0].id);
  const [customPresets, setCustomPresets] = useState<NetArchitecturePreset[]>(() => {
    try {
      const saved = localStorage.getItem('cpr_custom_net_arch_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentFloorIndex, setCurrentFloorIndex] = useState<number>(0);
  const [activeNetRollResult, setActiveNetRollResult] = useState<{ action: string; roll: number; formula: string; success?: boolean; text?: string } | null>(null);
  const [rezzedPrograms, setRezzedPrograms] = useState<Record<string, boolean>>({
    'Armor': true,
    'Sword': true,
    'Speedy Gonzalvez': false,
    'Worm': false
  });

  const allPresets = [...NET_ARCHITECTURE_PRESETS, ...customPresets];
  const activeArch = allPresets.find(p => p.id === selectedPresetId) || NET_ARCHITECTURE_PRESETS[0];

  // NET Actions por turno según Rango de Interface
  const interfaceRank = character.role === 'Netrunner' ? (character.roleRank || 4) : 0;
  const netActionsPerTurn = interfaceRank >= 10 ? 5 : interfaceRank >= 7 ? 4 : interfaceRank >= 4 ? 3 : 2;

  const handleRollNetAction = (actionName: string, dvStr: string) => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    const isExplode = d10 === 10;
    const isFumble = d10 === 1;
    const extraDie = isExplode ? (Math.floor(Math.random() * 10) + 1) : isFumble ? (Math.floor(Math.random() * 10) + 1) : 0;
    const totalRoll = d10 + (isExplode ? extraDie : 0) - (isFumble ? extraDie : 0) + interfaceRank;
    
    // Parse target DV if numeric
    const parsedDv = parseInt(dvStr.replace(/\D/g, ''), 10);
    const hasDv = !isNaN(parsedDv) && parsedDv > 0;
    const success = hasDv ? totalRoll >= parsedDv : true;

    setActiveNetRollResult({
      action: actionName,
      roll: totalRoll,
      formula: `1d10 (${d10}${isExplode ? ` + explota ${extraDie}` : ''}${isFumble ? ` - pifia ${extraDie}` : ''}) + Interface (${interfaceRank}) = ${totalRoll}`,
      success: hasDv ? success : undefined,
      text: hasDv ? (success ? `¡ÉXITO! Superó DV ${parsedDv}` : `FALLO. Requiere DV ${parsedDv}`) : 'Acción ejecutada'
    });
  };

  const handleCreateCustomFloor = (type: NetFloor['type']) => {
    const newFloorNumber = activeArch.floors.length + 1;
    const newFloor: NetFloor = generateRandomNetFloor(newFloorNumber, 'medium');
    newFloor.type = type;
    newFloor.name = `${type} Nivel ${newFloorNumber}`;

    const updatedArch: NetArchitecturePreset = {
      ...activeArch,
      totalFloors: activeArch.floors.length + 1,
      floors: [...activeArch.floors, newFloor]
    };

    const nextCustom = customPresets.map(p => p.id === updatedArch.id ? updatedArch : p);
    if (!customPresets.some(p => p.id === updatedArch.id)) {
      nextCustom.push(updatedArch);
    }
    setCustomPresets(nextCustom);
    localStorage.setItem('cpr_custom_net_arch_v1', JSON.stringify(nextCustom));
  };

  // ==========================================================================
  // 2. ESTADO DE QUICKHACKING 2077
  // ==========================================================================
  const [quickhackTierFilter, setQuickhackTierFilter] = useState<'All' | 'Simple' | 'Standard' | 'Difficult' | 'Advanced'>('All');
  const [quickhackRollLog, setQuickhackRollLog] = useState<{ qhName: string; roll: number; dv: number; success: boolean; damageRoll?: number; targetWillRoll?: number } | null>(null);

  const filteredQuickhacks = quickhackTierFilter === 'All' 
    ? QUICKHACKS_2077_CATALOG 
    : QUICKHACKS_2077_CATALOG.filter(q => q.tier === quickhackTierFilter);

  const handleExecuteQuickhack = (qh: Quickhack2077) => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    const total = d10 + interfaceRank;
    const success = total >= qh.dv;

    let dmg: number | undefined;
    if (success && qh.damage) {
      dmg = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
    }

    setQuickhackRollLog({
      qhName: qh.name,
      roll: total,
      dv: qh.dv,
      success,
      damageRoll: dmg
    });
  };

  const handleTargetCounterRoll = () => {
    if (!quickhackRollLog) return;
    const d10 = Math.floor(Math.random() * 10) + 1;
    const willBonus = 6; // promedio NPC
    const targetTotal = d10 + willBonus;
    setQuickhackRollLog({
      ...quickhackRollLog,
      targetWillRoll: targetTotal
    });
  };

  // ==========================================================================
  // 3. ESTADO DE HABILIDADES DE ROL
  // ==========================================================================
  const [selectedRoleView, setSelectedRoleView] = useState<string>(character.role.toLowerCase());

  // Solo Combat Awareness state
  const currentSolo: SoloCombatAwarenessAllocation = character.soloAllocation || {
    damageDeflection: 0,
    fumbleRecovery: false,
    initiativeReaction: 0,
    precisionAttack: 0,
    spotWeakness: 0,
    threatDetection: 0
  };

  const handleSoloPointChange = (key: keyof SoloCombatAwarenessAllocation, delta: number) => {
    if (key === 'fumbleRecovery') {
      updateSoloAllocation({
        ...currentSolo,
        fumbleRecovery: !currentSolo.fumbleRecovery
      });
      return;
    }
    const currentVal = typeof currentSolo[key] === 'number' ? (currentSolo[key] as number) : 0;
    const nextVal = Math.max(0, currentVal + delta);
    updateSoloAllocation({
      ...currentSolo,
      [key]: nextVal
    });
  };

  // Medtech Pharmaceuticals state
  const medtechData = character.medtechLab || {
    pharmaceuticalsRank: character.roleRank || 4,
    cryoSystemRank: 2,
    synthesizedDoses: {
      'Speedheal': 2,
      'Stim': 1,
      'Surge': 1,
      'Veritine': 0,
      'Cryo-Stasis': 1
    },
    activeCryotanks: []
  };

  const [medtechCraftLog, setMedtechCraftLog] = useState<string | null>(null);

  const handleCraftDrug = (drugName: string) => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    const techStat = character.stats.TECH || 6;
    const medSkill = character.skills.paramedic || 4;
    const total = d10 + techStat + medSkill;
    const success = total >= 13;

    if (success) {
      const currentDoses = medtechData.synthesizedDoses || {};
      const updated = {
        ...medtechData,
        synthesizedDoses: {
          ...currentDoses,
          [drugName]: (currentDoses[drugName] || 0) + 1
        }
      };
      updateMedtechLab(updated);
      setMedtechCraftLog(`¡ÉXITO! Tirada: ${total} vs DV 13. Sintetizaste +1 dosis de ${drugName}.`);
    } else {
      setMedtechCraftLog(`FALLO. Tirada: ${total} vs DV 13. Se perdieron los reactivos.`);
    }
  };

  // Tech Maker state
  const techProjects = character.techProjects || [
    { id: 'proj-1', name: 'Modificación Cañón Silenciador', specialty: 'upgrade' as const, dv: 13, hoursRequired: 6, hoursCompleted: 3, cost: 50, isCompleted: false },
    { id: 'proj-2', name: 'Fabricación Granada Chaff EMP', specialty: 'fabrication' as const, dv: 17, hoursRequired: 16, hoursCompleted: 16, cost: 100, isCompleted: true }
  ];

  const handleAdvanceProjectHours = (projId: string) => {
    const updated = techProjects.map(p => {
      if (p.id !== projId) return p;
      const nextHours = Math.min(p.hoursRequired, p.hoursCompleted + 2);
      return { ...p, hoursCompleted: nextHours, isCompleted: nextHours >= p.hoursRequired };
    });
    updateTechProjects(updated);
  };

  // ==========================================================================
  // 4. ESTADO DE VEHÍCULOS (TRACKER SDP)
  // ==========================================================================
  const ownedVehicles = character.vehicles || [];
  const [vehicleManeuverLog, setVehicleManeuverLog] = useState<{ action: string; roll: number; text: string } | null>(null);

  const handleBuyVehicle = (veh: VehicleSpec, isFreeNomad: boolean) => {
    const instance: OwnedVehicle = {
      instanceId: `veh-inst-${veh.id}-${Date.now()}`,
      catalogId: veh.id,
      name: veh.name,
      category: veh.category === 'Moto' || veh.category === 'Coche' || veh.category === 'Furgón/Camión' ? 'land' : veh.category === 'Acuático' ? 'sea' : 'air',
      maxSdp: veh.sdp,
      currentSdp: veh.sdp,
      armorSp: veh.armorSp,
      seats: veh.seats,
      combatSpeed: veh.combatSpeed,
      narrativeSpeed: veh.narrativeSpeed,
      upgrades: veh.upgrades,
      mountedWeapons: veh.mountedWeapons || [],
      notes: `Origen: ${veh.sourceBook.toUpperCase()} (${isFreeNomad ? 'Flota Nómada Gratuita' : 'Comprado'})`
    };
    addVehicleToCharacter(instance);
  };

  const handleVehicleManeuverRoll = (veh: OwnedVehicle) => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    const refStat = character.stats.REF || 6;
    const driveSkill = 4;
    const total = d10 + refStat + driveSkill;
    setVehicleManeuverLog({
      action: `Maniobra Evasiva en ${veh.name}`,
      roll: total,
      text: `1d10 (${d10}) + REF (${refStat}) + Drive (${driveSkill}) = ${total} vs DV de persecución`
    });
  };

  const handleVehicleRamming = (veh: OwnedVehicle) => {
    let dmg = 0;
    for (let i = 0; i < 6; i++) {
      dmg += Math.floor(Math.random() * 6) + 1;
    }
    setVehicleManeuverLog({
      action: `Embestida / Ramming con ${veh.name}`,
      roll: dmg,
      text: `Impacto violento infligiendo ${dmg} daño contundente (6d6) + posible Herida Crítica Whiplash.`
    });
  };

  return (
    <div className="space-y-4">
      {/* HEADER DE ESTACIÓN CON NAVEGACIÓN DE 4 PESTAÑAS */}
      <div className="bg-[#0f1118] border border-[#1f2334] p-4 rounded-xs flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#00f5d4]/20 border border-[#00f5d4] rounded-xs text-[#00f5d4]">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-tech text-lg sm:text-xl font-black text-white tracking-wider uppercase">
                NET & ROLES DECK // ESTACIONES ESPECIALIZADAS
              </h1>
              <span className="text-[10px] font-mono-code bg-[#00f5d4]/20 text-[#00f5d4] border border-[#00f5d4]/40 px-2 py-0.5 rounded-full font-bold">
                FASE 3 OPERATIVA
              </span>
            </div>
            <p className="text-xs font-mono-code text-[#64748b]">
              Simulador NET 2045 • Quickhacks CEMK 2077 • Habilidades de Rol Canónicas • Garaje SDP
            </p>
          </div>
        </div>

        {/* SELECTOR DE PESTAÑAS */}
        <div className="flex items-center gap-1.5 bg-[#141722] border border-[#222738] p-1.5 rounded-xs">
          <button
            onClick={() => setActiveTab('netrunning')}
            className={`px-3 py-1.5 rounded-xs font-tech text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'netrunning'
                ? 'bg-[#00f5d4] text-black shadow-[0_0_10px_rgba(0,245,212,0.4)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1f2e]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>🌐 NETRUNNING 2045</span>
          </button>

          <button
            onClick={() => setActiveTab('quickhacks')}
            className={`px-3 py-1.5 rounded-xs font-tech text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quickhacks'
                ? 'bg-[#f59e0b] text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1f2e]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>⚡ QUICKHACKING 2077</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-xs font-tech text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'roles'
                ? 'bg-[#a855f7] text-black shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1f2e]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>🎭 HABILIDADES DE ROL</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-3 py-1.5 rounded-xs font-tech text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'vehicles'
                ? 'bg-[#3b82f6] text-black shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1f2e]'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>🏎️ GARAJE & SDP</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. VISTA NETRUNNING 2045 */}
      {/* ==================================================================== */}
      {activeTab === 'netrunning' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* COLUMNA IZQUIERDA: SELECTOR DE ARQUITECTURAS & ACCIONES (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Presets & Custom Arch Selector */}
            <div className="bg-[#0d1017] border border-[#1b2234] p-3.5 rounded-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                <span className="font-tech text-xs font-bold text-[#00f5d4] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>ARQUITECTURAS DISPONIBLES ({allPresets.length})</span>
                </span>
                <span className="text-[10px] font-mono-code text-[#64748b]">
                  Interface: <strong className="text-white">Rango {interfaceRank}</strong> ({netActionsPerTurn} Acciones/Turno)
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {allPresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setCurrentFloorIndex(0);
                    }}
                    className={`p-2.5 rounded-xs text-left transition-all border cursor-pointer ${
                      selectedPresetId === preset.id
                        ? 'bg-[#00f5d4]/10 border-[#00f5d4] text-white shadow-[0_0_8px_rgba(0,245,212,0.2)]'
                        : 'bg-[#121622] border-[#1e2638] text-[#94a3b8] hover:border-[#38bdf8]/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-xs font-bold uppercase">{preset.name}</span>
                      <span className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded-xs font-bold ${
                        preset.difficulty === 'Corporate Apex' ? 'bg-red-500/20 text-red-400' :
                        preset.difficulty === 'Hardened' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {preset.difficulty} • {preset.totalFloors} Pisos
                      </span>
                    </div>
                    <p className="text-[10px] font-mono-code text-[#64748b] mt-1 line-clamp-1">{preset.loreDescription}</p>
                  </button>
                ))}
              </div>

              {/* Generador de pisos manuales */}
              <div className="pt-2 border-t border-[#1b2234] flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-mono-code text-[#64748b]">+ AÑADIR PISO:</span>
                <button
                  onClick={() => handleCreateCustomFloor('Password')}
                  className="px-2 py-1 bg-[#1a2030] hover:bg-[#00f5d4] hover:text-black text-[10px] font-mono-code rounded-xs transition-colors cursor-pointer"
                >
                  Password
                </button>
                <button
                  onClick={() => handleCreateCustomFloor('File')}
                  className="px-2 py-1 bg-[#1a2030] hover:bg-[#38bdf8] hover:text-black text-[10px] font-mono-code rounded-xs transition-colors cursor-pointer"
                >
                  File
                </button>
                <button
                  onClick={() => handleCreateCustomFloor('Control Node')}
                  className="px-2 py-1 bg-[#1a2030] hover:bg-[#f59e0b] hover:text-black text-[10px] font-mono-code rounded-xs transition-colors cursor-pointer"
                >
                  Control
                </button>
                <button
                  onClick={() => handleCreateCustomFloor('Black ICE')}
                  className="px-2 py-1 bg-[#1a2030] hover:bg-[#ef4444] hover:text-white text-[10px] font-mono-code rounded-xs transition-colors cursor-pointer"
                >
                  Black ICE
                </button>
              </div>
            </div>

            {/* Catálogo de 9 Acciones de Red */}
            <div className="bg-[#0d1017] border border-[#1b2234] p-3.5 rounded-xs space-y-3">
              <span className="font-tech text-xs font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#1b2234] pb-2">
                <Terminal className="w-4 h-4" />
                <span>ACCIONES DE INTERFAZ (9 ACCIONES OFICIALES)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NET_ACTIONS_CATALOG.map(act => (
                  <button
                    key={act.id}
                    onClick={() => handleRollNetAction(act.name, act.dv)}
                    className="p-2 bg-[#121622] hover:bg-[#1a2234] border border-[#1e2638] hover:border-[#38bdf8] rounded-xs text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-xs font-bold text-white group-hover:text-[#38bdf8]">{act.name}</span>
                      <span className="text-[9px] font-mono-code text-[#f59e0b]">{act.cost}</span>
                    </div>
                    <span className="text-[9px] font-mono-code text-[#64748b] block mt-0.5">{act.dv}</span>
                  </button>
                ))}
              </div>

              {/* Registro de tirada en vivo */}
              {activeNetRollResult && (
                <div className={`p-2.5 rounded-xs border text-xs font-mono-code space-y-1 ${
                  activeNetRollResult.success === false ? 'bg-red-950/30 border-red-500/50 text-red-200' :
                  activeNetRollResult.success === true ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200' :
                  'bg-cyan-950/30 border-cyan-500/50 text-cyan-200'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>ACCION: {activeNetRollResult.action.toUpperCase()}</span>
                    <span>TIRADA: {activeNetRollResult.roll}</span>
                  </div>
                  <div className="text-[10px] opacity-80">{activeNetRollResult.formula}</div>
                  {activeNetRollResult.text && <div className="font-bold text-[11px] pt-1 border-t border-white/10">{activeNetRollResult.text}</div>}
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: ESCALERA VIRTUAL PISO POR PISO & PROGRAMAS (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#090b10] border border-[#1b2234] p-4 rounded-xs space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                <div>
                  <h3 className="font-tech text-sm font-bold text-white uppercase flex items-center gap-2">
                    <span className="text-[#00f5d4]">PISOS DE RED:</span>
                    <span>{activeArch.name}</span>
                  </h3>
                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    Posición actual: <strong className="text-[#00f5d4]">Piso {currentFloorIndex + 1} de {activeArch.floors.length}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentFloorIndex(Math.max(0, currentFloorIndex - 1))}
                    disabled={currentFloorIndex === 0}
                    className="px-2.5 py-1 bg-[#1a2030] hover:bg-[#00f5d4] hover:text-black text-xs font-tech font-bold rounded-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ↑ SUBIR
                  </button>
                  <button
                    onClick={() => setCurrentFloorIndex(Math.min(activeArch.floors.length - 1, currentFloorIndex + 1))}
                    disabled={currentFloorIndex === activeArch.floors.length - 1}
                    className="px-2.5 py-1 bg-[#1a2030] hover:bg-[#00f5d4] hover:text-black text-xs font-tech font-bold rounded-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ↓ BAJAR
                  </button>
                </div>
              </div>

              {/* Escalera de pisos */}
              <div className="space-y-2">
                {activeArch.floors.map((fl, idx) => {
                  const isCurrent = idx === currentFloorIndex;
                  return (
                    <div
                      key={`floor-${idx}`}
                      onClick={() => setCurrentFloorIndex(idx)}
                      className={`p-3 rounded-xs border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-[#00f5d4]/10 border-[#00f5d4] shadow-[0_0_12px_rgba(0,245,212,0.25)]'
                          : 'bg-[#10141f] border-[#1b2336] opacity-75 hover:opacity-100 hover:border-[#38bdf8]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-xs flex items-center justify-center font-mono-code text-xs font-bold ${
                          isCurrent ? 'bg-[#00f5d4] text-black font-black' : 'bg-[#1e2638] text-[#94a3b8]'
                        }`}>
                          {fl.floorNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-tech text-xs font-bold text-white uppercase">{fl.name}</span>
                            <span className={`text-[9px] font-mono-code px-1.5 py-0.2 rounded-xs font-bold ${
                              fl.type === 'Black ICE' ? 'bg-red-500/20 text-red-400' :
                              fl.type === 'Control Node' ? 'bg-amber-500/20 text-amber-400' :
                              fl.type === 'File' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'
                            }`}>
                              {fl.type}
                            </span>
                          </div>
                          {fl.rewardOrDevice && (
                            <span className="text-[10px] font-mono-code text-[#00f5d4] block mt-0.5">
                              Dispositivo/Recompensa: {fl.rewardOrDevice}
                            </span>
                          )}
                          {fl.iceType && (
                            <span className="text-[10px] font-mono-code text-red-400 block mt-0.5">
                              Stats: HP {fl.iceHp} • ATK +{fl.iceAtk} • DEF {fl.iceDef}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        {fl.dv && (
                          <span className="font-tech text-xs font-bold text-[#f59e0b] block">DV {fl.dv}</span>
                        )}
                        {isCurrent && (
                          <span className="text-[9px] font-mono-code bg-[#00f5d4] text-black px-1.5 py-0.5 rounded-xs font-black uppercase">
                            EN ESTE PISO
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Panel de REZ de Programas del Netrunner */}
              <div className="pt-3 border-t border-[#1b2234] space-y-2">
                <span className="font-tech text-xs font-bold text-[#a855f7] uppercase tracking-wider block">
                  PROGRAMAS REZZED EN CYBERDECK:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(rezzedPrograms).map(([progName, isRezzed]) => (
                    <button
                      key={progName}
                      onClick={() => setRezzedPrograms({ ...rezzedPrograms, [progName]: !isRezzed })}
                      className={`p-2 rounded-xs border text-left font-mono-code text-[11px] transition-colors cursor-pointer flex items-center justify-between ${
                        isRezzed 
                          ? 'bg-[#a855f7]/20 border-[#a855f7] text-white shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                          : 'bg-[#121622] border-[#1e2638] text-[#64748b]'
                      }`}
                    >
                      <span>{progName}</span>
                      <span className={`text-[8px] font-bold px-1 rounded-xs ${isRezzed ? 'bg-[#a855f7] text-black' : 'bg-[#1b202e] text-[#64748b]'}`}>
                        {isRezzed ? 'REZ' : 'DEREZ'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. VISTA QUICKHACKING 2077 */}
      {/* ==================================================================== */}
      {activeTab === 'quickhacks' && (
        <div className="space-y-4">
          {/* Barra de Filtro de Tiers */}
          <div className="bg-[#0d1017] border border-[#1b2234] p-3 rounded-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-tech text-xs font-bold text-[#f59e0b] uppercase tracking-wider">
                FILTRAR POR NIVEL:
              </span>
              {(['All', 'Simple', 'Standard', 'Difficult', 'Advanced'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setQuickhackTierFilter(tier)}
                  className={`px-2.5 py-1 text-xs font-mono-code font-bold rounded-xs transition-colors cursor-pointer ${
                    quickhackTierFilter === tier
                      ? 'bg-[#f59e0b] text-black'
                      : 'bg-[#161b26] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono-code text-[#64748b]">
              Mostrando {filteredQuickhacks.length} de {QUICKHACKS_2077_CATALOG.length} Quickhacks oficiales de CEMK
            </span>
          </div>

          {/* Log de Ejecución de Quickhacks */}
          {quickhackRollLog && (
            <div className={`p-4 rounded-xs border text-xs font-mono-code space-y-2 ${
              quickhackRollLog.success 
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200' 
                : 'bg-red-950/40 border-red-500/60 text-red-200'
            }`}>
              <div className="flex items-center justify-between font-bold text-sm">
                <span>QUICKHACK: {quickhackRollLog.qhName.toUpperCase()}</span>
                <span>TIRADA: {quickhackRollLog.roll} vs DV {quickhackRollLog.dv}</span>
              </div>
              <div>
                Resultado: <strong className={quickhackRollLog.success ? 'text-emerald-400' : 'text-red-400'}>
                  {quickhackRollLog.success ? '¡OBJETIVO INFECTADO CON ÉXITO!' : 'HACKEO BLOQUEADO POR FIREWALL'}
                </strong>
                {quickhackRollLog.damageRoll !== undefined && (
                  <span className="ml-3 font-bold text-amber-300">Daño Infligido a HP: {quickhackRollLog.damageRoll} pts</span>
                )}
              </div>

              {quickhackRollLog.success && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#94a3b8]">¿El objetivo intenta resistirse o expulsar el daemon?</span>
                  <button
                    onClick={handleTargetCounterRoll}
                    className="px-3 py-1 bg-[#1a2030] hover:bg-white hover:text-black font-tech font-bold text-[10px] rounded-xs transition-colors cursor-pointer"
                  >
                    TIRAR EXPULSIÓN (WILL + Conc + 1d10)
                  </button>
                </div>
              )}

              {quickhackRollLog.targetWillRoll !== undefined && (
                <div className="text-[11px] font-mono-code text-cyan-300 pt-1">
                  Tirada de Defensa del Objetivo: {quickhackRollLog.targetWillRoll} (Superó efecto si es mayor a la tirada del hacker).
                </div>
              )}
            </div>
          )}

          {/* Grilla de las 15 Cartas de Quickhacks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredQuickhacks.map(qh => (
              <div
                key={qh.id}
                className="bg-[#0d1017] border border-[#1b2234] hover:border-[#f59e0b]/50 p-3.5 rounded-xs space-y-2.5 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-tech text-sm font-bold text-white uppercase">{qh.name}</span>
                    <span className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded-xs font-bold ${
                      qh.tier === 'Advanced' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      qh.tier === 'Difficult' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      qh.tier === 'Standard' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {qh.tier} • DV {qh.dv}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#94a3b8] mt-1">
                    <span>RAM: <strong className="text-white">{qh.ramCost}</strong></span>
                    <span>Duración: <strong className="text-white">{qh.duration}</strong></span>
                    {qh.damage && <span>Daño: <strong className="text-[#f59e0b]">{qh.damage}</strong></span>}
                  </div>

                  <p className="text-xs font-mono-code text-[#cbd5e1] mt-2 leading-relaxed">
                    {qh.effect}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1b2234]">
                  <button
                    onClick={() => handleExecuteQuickhack(qh)}
                    className="w-full py-1.5 bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>EJECUTAR (1d10 + {interfaceRank} vs DV {qh.dv})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. VISTA HABILIDADES DE ROL */}
      {/* ==================================================================== */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          {/* Selector de los 10 Roles */}
          <div className="bg-[#0d1017] border border-[#1b2234] p-3 rounded-xs flex flex-wrap items-center gap-2">
            <span className="font-tech text-xs font-bold text-[#a855f7] uppercase tracking-wider mr-2">
              SELECCIONAR ROL:
            </span>
            {ROLES_INTERACTIVE_GUIDES.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRoleView(r.id)}
                className={`px-3 py-1 font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer ${
                  selectedRoleView === r.id
                    ? 'bg-[#a855f7] text-black shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                    : 'bg-[#151926] text-[#94a3b8] hover:text-white'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* ESTACIÓN ESPECIALIZADA: SOLO */}
          {selectedRoleView === 'solo' && (
            <div className="bg-[#090b10] border border-[#1b2234] p-4 rounded-xs space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1b2234] pb-3">
                <div>
                  <h3 className="font-tech text-base font-bold text-red-400 uppercase flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-red-500" />
                    <span>SOLO WORKBENCH // COMBAT AWARENESS</span>
                  </h3>
                  <p className="text-xs font-mono-code text-[#64748b]">
                    Puntos totales disponibles: <strong className="text-white">{character.roleRank || 4} pts</strong> (según tu Rango de Solo).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: 'threatDetection' as const, label: 'Threat Detection', costDesc: '1 pt = +1 Percepción ante emboscadas' },
                  { key: 'initiativeReaction' as const, label: 'Initiative Reaction', costDesc: '1 pt = +1 Iniciativa en combate' },
                  { key: 'spotWeakness' as const, label: 'Spot Weakness', costDesc: '1 pt = +1 Daño al primer impacto' },
                  { key: 'precisionAttack' as const, label: 'Precision Attack', costDesc: '3 pts = +1 Puntería con arma designada' },
                  { key: 'damageDeflection' as const, label: 'Damage Deflection', costDesc: '2 pts = Reduce en 1 daño recibido' },
                  { key: 'fumbleRecovery' as const, label: 'Fumble Recovery', costDesc: '4 pts = Anula primera pifia del asalto' }
                ].map(item => (
                  <div key={item.key} className="bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-xs font-bold text-white uppercase">{item.label}</span>
                      <span className="font-mono-code text-sm font-black text-red-400">
                        {item.key === 'fumbleRecovery'
                          ? (currentSolo.fumbleRecovery ? 'ACTIVO (4 pts)' : '0 pts')
                          : `${(currentSolo[item.key] as number) || 0} pts`}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono-code text-[#64748b]">{item.costDesc}</p>
                    <div className="flex items-center gap-2 pt-1">
                      {item.key === 'fumbleRecovery' ? (
                        <button
                          type="button"
                          onClick={() => handleSoloPointChange('fumbleRecovery', 0)}
                          className={`flex-1 py-1 text-xs font-mono-code font-bold rounded-xs transition-colors cursor-pointer ${
                            currentSolo.fumbleRecovery
                              ? 'bg-red-500/30 border border-red-500 text-red-300 hover:bg-red-500/50'
                              : 'bg-[#1a2030] hover:bg-emerald-500 hover:text-white text-slate-300'
                          }`}
                        >
                          {currentSolo.fumbleRecovery ? 'Desactivar' : 'Activar'}
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSoloPointChange(item.key, -1)}
                            className="flex-1 py-1 bg-[#1a2030] hover:bg-red-500 hover:text-white text-xs font-mono-code font-bold rounded-xs transition-colors cursor-pointer"
                          >
                            -1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSoloPointChange(item.key, 1)}
                            className="flex-1 py-1 bg-[#1a2030] hover:bg-emerald-500 hover:text-white text-xs font-mono-code font-bold rounded-xs transition-colors cursor-pointer"
                          >
                            +1
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ESTACIÓN ESPECIALIZADA: MEDTECH */}
          {selectedRoleView === 'medtech' && (
            <div className="bg-[#090b10] border border-[#1b2234] p-4 rounded-xs space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1b2234] pb-3">
                <div>
                  <h3 className="font-tech text-base font-bold text-emerald-400 uppercase flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-emerald-500" />
                    <span>MEDTECH LAB // PHARMACEUTICALS & CRYOSYSTEMS</span>
                  </h3>
                  <p className="text-xs font-mono-code text-[#64748b]">
                    Sintetizador químico de fármacos canónicos (DV 13) y monitoreo de criotanques de pacientes.
                  </p>
                </div>
              </div>

              {medtechCraftLog && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/50 rounded-xs text-xs font-mono-code text-emerald-200">
                  {medtechCraftLog}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['Speedheal', 'Stim', 'Surge', 'Veritine', 'Cryo-Stasis'].map(drug => (
                  <div key={drug} className="bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-xs font-bold text-white uppercase">{drug}</span>
                      <span className="text-xs font-mono-code bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        {medtechData.synthesizedDoses?.[drug] || 0} dosis
                      </span>
                    </div>
                    <button
                      onClick={() => handleCraftDrug(drug)}
                      className="w-full py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>SINTETIZAR (DV 13)</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ESTACIÓN ESPECIALIZADA: TECH MAKER */}
          {selectedRoleView === 'tech' && (
            <div className="bg-[#090b10] border border-[#1b2234] p-4 rounded-xs space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1b2234] pb-3">
                <div>
                  <h3 className="font-tech text-base font-bold text-amber-400 uppercase flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-500" />
                    <span>TECH WORKBENCH // MAKER PROJECTS</span>
                  </h3>
                  <p className="text-xs font-mono-code text-[#64748b]">
                    Proyectos activos de invención, fabricación y mejoras de equipo de taller.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {techProjects.map(proj => (
                  <div key={proj.id} className="bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-tech text-sm font-bold text-white uppercase">{proj.name}</span>
                        <span className="text-[10px] font-mono-code text-[#64748b] ml-2">
                          Tipo: {proj.specialty.toUpperCase()} • DV {proj.dv}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-xs ${
                        proj.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {proj.isCompleted ? 'COMPLETADO' : `${proj.hoursCompleted} / ${proj.hoursRequired} Horas`}
                      </span>
                    </div>

                    {/* Barra de progreso de horas */}
                    <div className="w-full h-2 bg-[#1b202e] rounded-xs overflow-hidden">
                      <div 
                        className="h-full bg-[#f59e0b] transition-all"
                        style={{ width: `${Math.min(100, (proj.hoursCompleted / proj.hoursRequired) * 100)}%` }}
                      />
                    </div>

                    {!proj.isCompleted && (
                      <button
                        onClick={() => handleAdvanceProjectHours(proj.id)}
                        className="py-1 px-3 bg-[#1a2030] hover:bg-[#f59e0b] hover:text-black text-xs font-tech font-bold uppercase rounded-xs transition-colors cursor-pointer"
                      >
                        +2 HORAS DE TRABAJO
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GUÍA GENERAL DE LOS DEMÁS ROLES */}
          {selectedRoleView !== 'solo' && selectedRoleView !== 'medtech' && selectedRoleView !== 'tech' && (
            <div className="bg-[#090b10] border border-[#1b2234] p-4 rounded-xs space-y-4 shadow-xl">
              {ROLES_INTERACTIVE_GUIDES.filter(r => r.id === selectedRoleView).map(r => (
                <div key={r.id} className="space-y-3">
                  <div className="border-b border-[#1b2234] pb-2">
                    <h3 className="font-tech text-base font-bold text-[#a855f7] uppercase">
                      {r.name.toUpperCase()} // {r.abilityName.toUpperCase()}
                    </h3>
                    <p className="text-xs font-mono-code text-[#cbd5e1] mt-1">{r.description}</p>
                    <span className="text-[11px] font-mono-code text-[#f59e0b] block mt-1">
                      {r.rankProgressionSummary}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {r.subBranchesOrTables.map((sub, sIdx) => (
                      <div key={sIdx} className="bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-1.5">
                        <span className="font-tech text-xs font-bold text-white uppercase block">{sub.title}</span>
                        {sub.content.map((c, cIdx) => (
                          <p key={cIdx} className="text-xs font-mono-code text-[#94a3b8]">{c}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. VISTA VEHÍCULOS & PERSECUCIONES (TRACKER SDP) */}
      {/* ==================================================================== */}
      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          {/* Panel de Maniobras / Log */}
          {vehicleManeuverLog && (
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/50 rounded-xs text-xs font-mono-code text-cyan-200 flex items-center justify-between">
              <div>
                <strong>{vehicleManeuverLog.action}:</strong> {vehicleManeuverLog.text}
              </div>
              <span className="font-tech text-base font-black text-white">{vehicleManeuverLog.roll}</span>
            </div>
          )}

          {/* GARAJE ACTIVO DEL PERSONAJE */}
          <div className="bg-[#090b10] border border-[#1b2234] p-4 rounded-xs space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
              <h3 className="font-tech text-sm font-bold text-[#38bdf8] uppercase flex items-center gap-2">
                <Car className="w-4 h-4 text-[#38bdf8]" />
                <span>GARAJE PERSONAL // VEHÍCULOS ACTIVOS ({ownedVehicles.length})</span>
              </h3>
              <span className="text-[10px] font-mono-code text-[#64748b]">
                Control en tiempo real de Daño Estructural (SDP) y Blindaje SP
              </span>
            </div>

            {ownedVehicles.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono-code text-[#64748b]">
                Tu personaje no tiene vehículos en su garaje. Selecciona un modelo del catálogo inferior para adquirirlo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ownedVehicles.map(veh => {
                  const sdpRatio = veh.currentSdp / (veh.maxSdp || 1);
                  const isDamaged = sdpRatio <= 0.5;
                  const isDestroyed = veh.currentSdp <= 0;

                  return (
                    <div key={veh.instanceId} className="bg-[#10141f] border border-[#1b2336] p-3.5 rounded-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-tech text-sm font-bold text-white uppercase">{veh.name}</span>
                          <span className="text-[10px] font-mono-code text-[#64748b] block">{veh.notes}</span>
                        </div>
                        <button
                          onClick={() => removeVehicleFromCharacter(veh.instanceId)}
                          className="p-1 hover:text-red-400 text-[#64748b] transition-colors cursor-pointer"
                          title="Eliminar vehículo del garaje"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Medidores de SDP y SP */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
                        <div className="bg-[#090b10] p-2 rounded-xs border border-[#1b2336]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#94a3b8]">SDP (Daño)</span>
                            <span className={`font-black ${isDestroyed ? 'text-red-500' : isDamaged ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {veh.currentSdp} / {veh.maxSdp}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#1e2638] rounded-xs overflow-hidden mb-1.5">
                            <div 
                              className={`h-full ${isDestroyed ? 'bg-red-500' : isDamaged ? 'bg-amber-400' : 'bg-emerald-400'}`}
                              style={{ width: `${Math.max(0, sdpRatio * 100)}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <button
                              onClick={() => updateVehicleSdp(veh.instanceId, -5)}
                              className="px-2 py-0.5 bg-[#1a2030] hover:bg-red-500 hover:text-white rounded-xs text-[10px] font-bold"
                            >
                              -5 SDP
                            </button>
                            <button
                              onClick={() => updateVehicleSdp(veh.instanceId, 5)}
                              className="px-2 py-0.5 bg-[#1a2030] hover:bg-emerald-500 hover:text-white rounded-xs text-[10px] font-bold"
                            >
                              +5 SDP
                            </button>
                          </div>
                        </div>

                        <div className="bg-[#090b10] p-2 rounded-xs border border-[#1b2336]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#94a3b8]">BLINDAJE SP</span>
                            <span className="font-black text-[#38bdf8]">{veh.armorSp} SP</span>
                          </div>
                          <div className="flex items-center justify-between gap-1 pt-3">
                            <button
                              onClick={() => updateVehicleArmorSp(veh.instanceId, -1)}
                              className="px-2 py-0.5 bg-[#1a2030] hover:bg-red-500 hover:text-white rounded-xs text-[10px] font-bold"
                            >
                              -1 SP
                            </button>
                            <button
                              onClick={() => updateVehicleArmorSp(veh.instanceId, 1)}
                              className="px-2 py-0.5 bg-[#1a2030] hover:bg-cyan-500 hover:text-white rounded-xs text-[10px] font-bold"
                            >
                              +1 SP
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción táctica */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleVehicleManeuverRoll(veh)}
                          className="flex-1 py-1 bg-[#1a2030] hover:bg-[#38bdf8] hover:text-black text-[11px] font-tech font-bold uppercase rounded-xs transition-colors cursor-pointer"
                        >
                          Tirar Maniobra (REF+Drive)
                        </button>
                        <button
                          onClick={() => handleVehicleRamming(veh)}
                          className="flex-1 py-1 bg-red-950/30 hover:bg-red-600 hover:text-white border border-red-500/30 text-red-300 text-[11px] font-tech font-bold uppercase rounded-xs transition-colors cursor-pointer"
                        >
                          Embestir / Ram (6d6)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CATÁLOGO OFICIAL DE 14 VEHÍCULOS (COMPRA / NÓMADA MOTO) */}
          <div className="bg-[#090b10] border border-[#1b2234] p-4 rounded-xs space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
              <h3 className="font-tech text-sm font-bold text-white uppercase">
                CATÁLOGO DE CONCESIONARIO // VEHÍCULOS OFICIALES (CORE & BLACK CHROME)
              </h3>
              <span className="text-[10px] font-mono-code text-[#64748b]">
                {VEHICLES_CATALOG.length} Modelos canónicos disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {VEHICLES_CATALOG.map(veh => (
                <div key={veh.id} className="bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-xs font-bold text-white uppercase">{veh.name}</span>
                      <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded-xs bg-[#1a2030] text-[#38bdf8] font-bold">
                        {veh.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-code text-[#f59e0b] block mt-0.5">
                      {veh.cost.toLocaleString()} €$ • {veh.costTier}
                    </span>
                    <div className="text-[10px] font-mono-code text-[#94a3b8] space-y-0.5 mt-1.5">
                      <div>SDP: <strong className="text-white">{veh.sdp}</strong> • SP: <strong className="text-white">{veh.armorSp}</strong> • Plazas: <strong className="text-white">{veh.seats}</strong></div>
                      <div>Velocidad: {veh.combatSpeed} ({veh.narrativeSpeed})</div>
                    </div>
                    <p className="text-[10px] font-mono-code text-[#64748b] mt-1.5 line-clamp-2">{veh.description}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#1b2234]">
                    <button
                      onClick={() => handleBuyVehicle(veh, false)}
                      className="flex-1 py-1 bg-[#1a2030] hover:bg-[#f59e0b] hover:text-black font-tech font-bold text-[10px] uppercase rounded-xs transition-colors cursor-pointer"
                    >
                      Comprar (€$)
                    </button>
                    {character.role === 'Nomad' && (
                      <button
                        onClick={() => handleBuyVehicle(veh, true)}
                        className="flex-1 py-1 bg-[#f97316]/20 hover:bg-[#f97316] text-[#f97316] hover:text-black font-tech font-bold text-[10px] uppercase rounded-xs transition-colors cursor-pointer"
                      >
                        Moto Familiar (0 €$)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
