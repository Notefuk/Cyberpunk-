import React, { useEffect, useRef, useState } from 'react';
import { useGmSecretBinding } from '../../sync/gmSecrets';
import { useActiveTable } from '../../sync/tableSync';
import { buildNetReveal, useTableReveals } from '../../sync/tableReveals';
import { HARDWARE_SLOTS } from '../../engine/creatorShop';
import { readGmPin, useGmAccess, useGmPinSession } from '../../store/gmAccess';
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
  Crosshair,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Award,
  Lock,
  Unlock,
  Swords,
  Coins,
  CheckCircle2,
  AlertCircle,
  Shield,
  Dices,
  Plus
} from 'lucide-react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useCombatStore } from '../../store/useCombatStore';
import { beatsDv, rollCheckD10 } from '../../engine/combatEngine';
import { getEffectiveBody, isValidSoloAllocation, soloAwarenessPointCost } from '../../engine/characterEngine';
import { 
  NET_ARCHITECTURE_PRESETS, 
  NET_ACTIONS_CATALOG, 
  QUICKHACKS_2077_CATALOG, 
  QUICKHACKING_OFFICIAL_RULES_GUIDE,
  ROLES_INTERACTIVE_GUIDES, 
  VEHICLES_CATALOG, 
  generateRandomNetFloor,
  type NetFloor,
  type NetArchitecturePreset,
  type NetAction,
  type Quickhack2077,
  type VehicleSpec
} from '../../data/netAndRolesData';
import {
  MARTIAL_ARTS_FORMS,
  MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT
} from '../../data/cyberfistsMartialArtsData';
import { MartialCommonRules, MartialMoveBoxes } from '../martial/MartialMoveBoxes';
import type { SoloCombatAwarenessAllocation, OwnedVehicle, TechWeaponUpgradeType } from '../../types/cyberpunk';
import {
  WEAPON_ATTACHMENTS_CATALOG,
  calculateWeaponSlotCapacity,
  TECH_MAKER_UPGRADE_OPTIONS,
  MAKER_DV_AND_TIME_BY_COST,
  TECH_LIFEPATH_TABLES
} from '../../data/weaponAttachmentsAndTechData';

import { getInterfaceRank, netActionsForInterface, canUseQuickhacks, medicalTechLevel, getRoleRankInfo } from '../../engine/roleRules';
import { SYNTHESIS_DV, SYNTHESIS_MATERIALS_EB, synthesisDoses, canSynthesize, rollMedicalCheck } from '../../engine/medicalRules';
import { CORE_VEHICLES } from '../../data/creation';
import type { CoreVehicleEntry } from '../../data/creation/types';
import { resolveSkillKey, normalizeCanonSkillName } from '../../data/characterCreationData';
import { GameClockBar } from '../combat/GameClockBar';
import { MedtechTreatmentPanel } from './MedtechTreatmentPanel';
import { RockerboyPanel } from '../roles/RockerboyPanel';
import { FixerPanel } from '../roles/FixerPanel';
import { MediaPanel } from '../roles/MediaPanel';
import { ExecPanel } from '../roles/ExecPanel';
import { LawmanPanel } from '../roles/LawmanPanel';
import { MakerPanel } from '../roles/MakerPanel';
import { materialCost, priceCategoryForEb, rollMakerCheck, specialtyRank } from '../../engine/makerRules';
import { CommittedInput } from '../../components/CommittedInput';

type ActiveTab = 'netrunning' | 'quickhacks' | 'martial' | 'roles' | 'vehicles';

// Plan 10 (v4.9.2): habitaciones mínimas de los vehículos del Core con precio por habitación (Core p.190); null si el dato no permite calcularlas.
const ROOM_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
function coreVehicleMinRooms(v: CoreVehicleEntry): number | null {
  if (!v.costNote) return 1;
  const m = v.costNote.match(/minimum\s+(\w+)\s+rooms?/i);
  if (!m) return null;
  return ROOM_WORDS[m[1].toLowerCase()] ?? (Number.isFinite(parseInt(m[1], 10)) ? parseInt(m[1], 10) : null);
}
// Core pp. 162-163: la tabla Family Motorpool da bandas de rango ("1-4"); se usa el rango mínimo de la banda.
function coreMotorpoolMinRank(v: CoreVehicleEntry): number {
  const n = parseInt(v.familyMotorpoolRank, 10);
  return Number.isFinite(n) ? n : 1;
}
function coreVehicleToOwned(v: CoreVehicleEntry, rooms: number, origin: string): OwnedVehicle {
  const seatsPer = parseInt(v.seats, 10) || 1;
  const perRoom = /per\s+room/i.test(v.seats);
  return {
    instanceId: `veh-inst-core-${v.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
    catalogId: `core-${v.name.replace(/\s+/g, '-').toLowerCase()}`,
    name: v.name,
    category: v.category === 'sea' ? 'sea' : v.category === 'air' ? 'air' : 'land',
    maxSdp: v.sdp,
    currentSdp: v.sdp,
    armorSp: 0,
    seats: perRoom ? seatsPer * rooms : seatsPer,
    combatSpeed: v.combatSpeed,
    narrativeSpeed: v.narrativeSpeed,
    upgrades: [],
    mountedWeapons: [],
    notes: `Origen: CORE p.${v.page} (${origin})`
  };
}

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
    spendEurodollarsFor,
    updateTechProjects,
    adjustImprovementPoints,
    setInterfaceRankOverride,
    trainMartialArtWithIp,
    buyAndEquipMartialArtChip,
    toggleEquipMartialArtChip,
    installWeaponAttachment,
    removeWeaponAttachment,
    applyTechUpgradeToWeapon,
    applyTechUpgradeToArmor,
    updateRoleSpecificLifepath
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
  // v5.3.0 (plan 20): con mesa activa de GM, las arquitecturas propias son las de la campaña (nube). [Claude Code · 2026-10-28]
  const netCloud = useGmSecretBinding('net', customPresets, setCustomPresets, () => {
    try { return JSON.parse(localStorage.getItem('cpr_custom_net_arch_v1') || '[]') as NetArchitecturePreset[]; } catch { return []; }
  });
  const [currentFloorIndex, setCurrentFloorIndex] = useState<number>(0);
  const [unlockedNetFloors, setUnlockedNetFloors] = useState<number[]>([1]);
  const [activeNetRollResult, setActiveNetRollResult] = useState<{ action: string; roll: number; formula: string; success?: boolean; text?: string } | null>(null);
  const [isGmArchitectureManagerOpen, setIsGmArchitectureManagerOpen] = useState<boolean>(false);
  // v5.3.0 (plan 20, B.3): el modo GM del NET lo abre el GM de la mesa activa; sin mesa, lo protege el PIN del GM. [Claude Code · 2026-10-28]
  const gmAccess = useGmAccess();
  const [gmPinPrompt, setGmPinPrompt] = useState<string | null>(null);
  const [gmPinError, setGmPinError] = useState(false);
  const openGmManager = () => {
    if (gmAccess.mode === 'local-locked') {
      setGmPinPrompt('');
      setGmPinError(false);
      return;
    }
    setIsGmArchitectureManagerOpen(true);
  };
  const submitGmPin = () => {
    if (gmPinPrompt !== null && gmPinPrompt === readGmPin()) {
      useGmPinSession.getState().unlock();
      setGmPinPrompt(null);
      setIsGmArchitectureManagerOpen(true);
    } else {
      setGmPinError(true);
    }
  };
  const [targetNetDv, setTargetNetDv] = useState<number>(8);
  const [expandedNetActionId, setExpandedNetActionId] = useState<string | null>(null);
  // Programas del cyberdeck de la ficha (comprados o del paquete de rol "Program: X"); el REZ es de la sesión. [Claude Code · 2026-10-25]
  const [rezzedPrograms, setRezzedPrograms] = useState<Record<string, boolean>>({});
  const deckPrograms = (character.inventory ?? []).flatMap((item) => {
    const isProgram = item.category === 'programs' || /^program:\s*/i.test(item.name);
    if (!isProgram) return [];
    const name = item.name.replace(/^program:\s*/i, '').trim();
    return Array.from({ length: Math.max(1, item.quantity) }, (_, i) => (i === 0 ? name : `${name} #${i + 1}`));
  });
  const deckItem = (character.inventory ?? []).find((item) => /cyberdeck/i.test(item.name));
  // Core p.196: Poor Quality 5 slots, estándar 7, Excellent Quality 9.
  const deckSlots = deckItem ? Number(/(\d+)\s*slots?/i.exec(deckItem.name)?.[1] ?? (/poor/i.test(deckItem.name) ? 5 : /excellent/i.test(deckItem.name) ? 9 : 7)) : null;
  // v5.3.2: el Hardware también ocupa slots (Core p.208); el Bodyweight Suit suma 1 solo para Hardware. [Claude Code · 2026-10-29]
  const hardwareSlots = (character.inventory ?? []).reduce((n, item) => n + (HARDWARE_SLOTS[item.catalogId] ?? 0) * Math.max(1, item.quantity), 0);
  const hardwareOnlySlots = /bodyweight/i.test(character.bodyArmor?.name ?? '') ? 1 : 0;
  const deckSlotsUsed = deckPrograms.length + Math.max(0, hardwareSlots - hardwareOnlySlots);

  const allPresets = [...NET_ARCHITECTURE_PRESETS, ...customPresets];
  const activeArch = allPresets.find(p => p.id === selectedPresetId) || NET_ARCHITECTURE_PRESETS[0];

  // v5.3.0 (plan 20, B.2): el GM comparte la corrida (pisos desbloqueados, sin HP/ATK/DEF del ICE) y la mesa la ve. [Claude Code · 2026-10-28]
  const { table: activeTable, isGm: isTableGm } = useActiveTable();
  const tableNet = useTableReveals((s) => s.net);
  const revealsAdapter = useTableReveals((s) => s.adapter);
  const [shareNetWithTable, setShareNetWithTable] = useState(false);
  const canShareNet = !!activeTable && isTableGm && !!revealsAdapter;
  const lastNetKey = useRef('');
  useEffect(() => {
    if (!canShareNet || !revealsAdapter) return;
    if (!shareNetWithTable) {
      lastNetKey.current = '';
      if (tableNet) void revealsAdapter.setNet(null).catch((e) => console.warn('[mesa] NET revelado:', e));
      return;
    }
    const reveal = buildNetReveal(activeArch, unlockedNetFloors, currentFloorIndex);
    const k = JSON.stringify(reveal);
    if (k === lastNetKey.current) return; // solo se escribe si cambió algo que ve la mesa
    const t = setTimeout(() => {
      lastNetKey.current = k;
      void revealsAdapter.setNet(reveal).catch((e) => console.warn('[mesa] NET revelado:', e));
    }, 800);
    return () => clearTimeout(t);
    // tableNet se omite a propósito: solo se borra al apagar el toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canShareNet, revealsAdapter, shareNetWithTable, activeArch, unlockedNetFloors, currentFloorIndex]);

  // Interface (Core p.147/197): rango según rol u override; NET Actions por rango (Core p.197).
  const era = useCombatStore((state) => state.era);
  const activeInterfaceRank = getInterfaceRank(character);
  const netActionsPerTurn = netActionsForInterface(activeInterfaceRank);
  // Quickhacks: en 2045 solo con Neuroport; en 2077 se asume salvo que sea false (CEMK RB p.26).
  const hasNeuroportEquipped = (character.hasNeuroport || (character.installedCyberwareIds ?? []).includes('cw-cemk-neuroport')) ? true : character.hasNeuroport;
  const quickhacksBlocked = !canUseQuickhacks(era, hasNeuroportEquipped);

  const handleRollNetAction = (action: NetAction) => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    const isExplode = d10 === 10;
    const isFumble = d10 === 1;
    const extraDie = isExplode ? (Math.floor(Math.random() * 10) + 1) : isFumble ? (Math.floor(Math.random() * 10) + 1) : 0;
    const totalRoll = d10 + (isExplode ? extraDie : 0) - (isFumble ? extraDie : 0) + activeInterfaceRank;
    
    // Scanner no tiene DV: el GM interpreta el total (Core p. 199). El resto debe superar el DV (CEMK p. 5).
    if (action.id === 'scanner') {
      setActiveNetRollResult({
        action: action.name,
        roll: totalRoll,
        formula: `1d10 (${d10}${isExplode ? ` + explota ${extraDie}` : ''}${isFumble ? ` - pifia ${extraDie}` : ''}) + Interface (${activeInterfaceRank}) = ${totalRoll}`,
        text: `Total ${totalRoll}: el GM decide cuántos access points encuentras y desde qué distancia`
      });
      return;
    }
    const effectiveDv = targetNetDv;
    const success = beatsDv(totalRoll, effectiveDv);

    setActiveNetRollResult({
      action: action.name,
      roll: totalRoll,
      formula: `1d10 (${d10}${isExplode ? ` + explota ${extraDie}` : ''}${isFumble ? ` - pifia ${extraDie}` : ''}) + Interface (${activeInterfaceRank}) = ${totalRoll} vs DV ${effectiveDv}`,
      success,
      text: success ? `¡ÉXITO! Superó DV ${effectiveDv}` : `FALLO. Requiere DV ${effectiveDv}`
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
    if (!netCloud.cloud) localStorage.setItem('cpr_custom_net_arch_v1', JSON.stringify(nextCustom));
  };

  // ==========================================================================
  // 2. ESTADO DE QUICKHACKING 2077
  // ==========================================================================
  const [quickhackTierFilter, setQuickhackTierFilter] = useState<'All' | 'Simple' | 'Standard' | 'Difficult' | 'Advanced'>('All');
  const [quickhackRollLog, setQuickhackRollLog] = useState<{ qhName: string; roll: number; dv: number; success: boolean; damageRoll?: number; targetWillRoll?: number; stepInfo?: string } | null>(null);
  const [unlockAllQuickhacks, setUnlockAllQuickhacks] = useState<boolean>(false);
  const [qhTargetWill, setQhTargetWill] = useState<number>(6);
  const [qhTargetConcentration, setQhTargetConcentration] = useState<number>(2);
  const [showQuickhackGuide, setShowQuickhackGuide] = useState<boolean>(false);

  // ==========================================================================
  // 3. ESTADO DE ARTES MARCIALES & IP
  // ==========================================================================
  const [showMartialArtsGuide, setShowMartialArtsGuide] = useState<boolean>(false);
  const [martialCategoryFilter, setMartialCategoryFilter] = useState<'all' | 'core' | 'interface_red'>('all');
  const [martialFeedback, setMartialFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [openMartialForms, setOpenMartialForms] = useState<Record<string, boolean>>({});
  const toggleMartialForm = (id: string) => setOpenMartialForms(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredQuickhacks = quickhackTierFilter === 'All' 
    ? QUICKHACKS_2077_CATALOG 
    : QUICKHACKS_2077_CATALOG.filter(q => q.tier === quickhackTierFilter);

  // CEMK Canonical 4-Step Quickhacking Handlers
  const handleJackInRoll = () => {
    // Interface + 1d10 vs WILL + 1d10; empate gana el defensor (CEMK pp. 5, 16)
    const hackerTotal = activeInterfaceRank + rollCheckD10().value;
    const targetTotal = qhTargetWill + rollCheckD10().value;
    const detected = hackerTotal <= targetTotal;

    setQuickhackRollLog({
      qhName: 'Paso 1: Jack In (1 NET Action)',
      roll: hackerTotal,
      dv: targetTotal,
      success: true,
      stepInfo: detected
        ? `⚠️ Jack In completado pero DETECTADO (Tiraste ${hackerTotal} vs WILL ${targetTotal}). El objetivo detectó tu enlace.`
        : `✅ Jack In SIGILOSO completado (Tiraste ${hackerTotal} vs WILL ${targetTotal}). Conectado al Neuroport.`
    });
  };

  const handleBreachPasswallRoll = (dv: number, label: string) => {
    if (label.includes('Firewall') && activeInterfaceRank >= 3) {
      setQuickhackRollLog({
        qhName: `Paso 2: Romper ${label}`,
        roll: activeInterfaceRank + 10,
        dv,
        success: true,
        stepInfo: `⚡ Bypass automático de Firewall base (DV 6) por Interface R${activeInterfaceRank} (CEMK p. 27).`
      });
      return;
    }
    const total = activeInterfaceRank + rollCheckD10().value;
    const success = beatsDv(total, dv);
    setQuickhackRollLog({
      qhName: `Paso 2: Romper ${label}`,
      roll: total,
      dv,
      success,
      stepInfo: success
        ? `✅ ¡Passwall superado! (${total} vs DV ${dv}). Acceso libre para inyectar Quickhacks.`
        : `❌ Fallo al superar ${label} (${total} vs DV ${dv}). Passwall aún activo.`
    });
  };

  const handleExecuteQuickhack = (qh: Quickhack2077) => {
    const isLocked = quickhacksBlocked || (!unlockAllQuickhacks && activeInterfaceRank < qh.requiredInterfaceRank);
    if (isLocked) {
      setQuickhackRollLog({
        qhName: qh.name,
        roll: 0,
        dv: qh.dv,
        success: false,
        stepInfo: quickhacksBlocked ? '🔒 Bloqueado: en 2045 los Quickhacks requieren Neuroport (CEMK RB p.26)' : `🔒 Bloqueado: Requiere Interface ${qh.requiredInterfaceRank}+`
      });
      return;
    }

    // Interface + 1d10 vs DV del Quickhack, sin STAT (CEMK p. 16)
    const total = rollCheckD10().value + activeInterfaceRank;
    const success = beatsDv(total, qh.dv);

    let dmg: number | undefined;
    if (success && (qh.damage || qh.damageFormula)) {
      if (qh.damageFormula === '3d6') {
        dmg = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
      } else if (qh.damageFormula === '1d6') {
        dmg = Math.floor(Math.random() * 6) + 1;
      } else if (qh.damage) {
        dmg = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
      }
    }

    setQuickhackRollLog({
      qhName: qh.name,
      roll: total,
      dv: qh.dv,
      success,
      damageRoll: dmg,
      stepInfo: success
        ? `¡OBJETIVO INFECTADO CON ÉXITO! (1 NET Action gastada · Máximo 1 quickhack/turno por objetivo)`
        : `HACKEO BLOQUEADO (Tiraste ${total} vs DV ${qh.dv})`
    });
  };

  const handleTargetCounterRoll = () => {
    if (!quickhackRollLog) return;
    // WILL + Concentration + 1d10 vs Interface + 1d10 del Netrunner (CEMK p. 16)
    const targetTotal = qhTargetWill + qhTargetConcentration + rollCheckD10().value;
    const hackerTotal = activeInterfaceRank + rollCheckD10().value;
    const expelled = targetTotal > hackerTotal;
    setQuickhackRollLog({
      ...quickhackRollLog,
      targetWillRoll: targetTotal,
      stepInfo: expelled
        ? `🚫 ¡Hacker EXPULSADO! (Objetivo sacó ${targetTotal} vs tu Interface ${hackerTotal}). No puedes reconectarte en 60 minutos.`
        : `🛡️ Intento de expulsión FALLIDO (Objetivo sacó ${targetTotal} vs tu Interface ${hackerTotal}). Sigues en su Neuroport.`
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
    let next: SoloCombatAwarenessAllocation;
    if (key === 'fumbleRecovery') {
      next = { ...currentSolo, fumbleRecovery: !currentSolo.fumbleRecovery };
    } else {
      const currentVal = typeof currentSolo[key] === 'number' ? (currentSolo[key] as number) : 0;
      next = { ...currentSolo, [key]: Math.max(0, currentVal + delta) };
    }
    // Core p. 146: el total gastado no puede superar el rango de Combat Awareness.
    if (!isValidSoloAllocation(next, character.roleRank || 0)) return;
    updateSoloAllocation(next);
  };

  // Medtech Pharmaceuticals state
  const medtechData = character.medtechLab || {
    pharmaceuticalsRank: character.roleRank || 4,
    cryoSystemRank: 2,
    synthesizedDoses: {
      'Speedheal': 2,
      'Stim': 1,
      'Surge': 1,
      'Antibiotic': 0,
      'Rapidetox': 0
    },
    activeCryotanks: []
  };

  const [medtechCraftLog, setMedtechCraftLog] = useState<string | null>(null);

  const handleCraftDrug = (drugName: string) => {
    // Core pp. 149-150: TECH + Medical Tech (= Pharmaceuticals + Cryosystem) + 1d10 vs DV 13; 200 €$ de materiales por tanda de 1 hora; solo fármacos conocidos.
    const allowed = canSynthesize({ role: character.role, knownPharmaceuticals: character.medicineAllocation?.knownPharmaceuticals, drug: drugName });
    if (!allowed.ok) {
      setMedtechCraftLog(allowed.reason ?? 'No se puede sintetizar este fármaco.');
      return;
    }
    if (!spendEurodollarsFor(character.id, SYNTHESIS_MATERIALS_EB, `Materiales de síntesis: ${drugName} (Core p.150)`)) {
      setMedtechCraftLog(`No alcanzan los €$: la síntesis cuesta ${SYNTHESIS_MATERIALS_EB} €$ de materiales (Core p.150).`);
      return;
    }
    const techStat = character.stats.TECH || 6;
    const medTechLvl = medicalTechLevel(character.medicineAllocation);
    const result = rollMedicalCheck({ tech: techStat, skillLevel: medTechLvl, dv: SYNTHESIS_DV });

    if (result.success) {
      const doses = synthesisDoses(medTechLvl);
      const currentDoses = medtechData.synthesizedDoses || {};
      const updated = {
        ...medtechData,
        synthesizedDoses: {
          ...currentDoses,
          [drugName]: (currentDoses[drugName] || 0) + doses
        }
      };
      updateMedtechLab(updated);
      setMedtechCraftLog(`¡ÉXITO! ${result.breakdown}. Sintetizaste +${doses} dosis de ${drugName} (1 hora, ${SYNTHESIS_MATERIALS_EB} €$ de materiales).`);
    } else {
      setMedtechCraftLog(`FALLO. ${result.breakdown}. Se perdieron los materiales (${SYNTHESIS_MATERIALS_EB} €$) tras 1 hora de trabajo.`);
    }
  };

  // Tech Maker state
  const techProjects = character.techProjects || [];

  const handleAdvanceProjectHours = (projId: string) => {
    const updated = techProjects.map(p => {
      if (p.id !== projId) return p;
      const nextHours = Math.min(p.hoursRequired, p.hoursCompleted + 2);
      return { ...p, hoursCompleted: nextHours, isCompleted: nextHours >= p.hoursRequired };
    });
    updateTechProjects(updated);
  };

  // Tech Maker Workbench & Lifepath state
  const [selectedTechTargetId, setSelectedTechTargetId] = useState<string>(
    character.equippedWeapons[0]?.instanceId || 'headArmor'
  );
  const [selectedAttachmentId, setSelectedAttachmentId] = useState<string>(
    WEAPON_ATTACHMENTS_CATALOG[0].id
  );
  const [selectedUpgradeType, setSelectedUpgradeType] = useState<TechWeaponUpgradeType | 'armor_plus_one_sp'>(
    'excellent_quality'
  );
  const [techMakerLog, setTechMakerLog] = useState<{
    action: string;
    roll: number;
    dv: number;
    success: boolean;
    text: string;
  } | null>(null);

  const handleRollMakerCheck = (actionName: string, dv: number, skillName: string) => {
    // Core p. 148: TECH + Skill TECH de reparar el ítem + Rango de Upgrade Expertise (makerAllocation) + 1d10, hay que superar el DV.
    const techStat = character.stats.TECH || 0;
    const ref = resolveSkillKey(skillName);
    const compactName = (x: string) => normalizeCanonSkillName(x).replace(/[^a-z0-9]/g, '');
    let skillLevel = 0;
    if (ref?.kind === 'combat') skillLevel = Math.max(skillLevel, (character.skills as Record<string, number> | undefined)?.[ref.key] ?? 0);
    for (const [gk, gv] of Object.entries(character.generalSkills ?? {})) {
      if (typeof gv === 'number' && (compactName(gk) === compactName(skillName) || (ref && compactName(gk) === compactName(ref.key)))) {
        skillLevel = Math.max(skillLevel, gv);
      }
    }
    const upgradeRank = character.role.toLowerCase() === 'tech' ? specialtyRank(character.makerAllocation, 'upgrade') : 0;
    const result = rollMakerCheck({ tech: techStat, skillLevel, specialtyRank: upgradeRank, dv });

    setTechMakerLog({
      action: actionName,
      roll: result.total,
      dv,
      success: result.success,
      text: result.success
        ? `¡ÉXITO DE TALLER! ${result.breakdown}. Mejora completada según especificaciones.`
        : `FALLO DE TALLER. ${result.breakdown}. Se reinicia con los materiales intactos (Core p.148).`
    });
    return result.success;
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
    // Core p.161: el Nomad suma su rango de Moto a Drive Land / Pilot Air / Pilot Sea Vehicle (y a las Vehicle Tech).
    const d = rollCheckD10();
    const refStat = character.stats.REF || 6;
    const skillName = veh.category === 'land' ? 'Drive Land Vehicle' : veh.category === 'sea' ? 'Pilot Sea Vehicle' : 'Pilot Air Vehicle';
    const skillRef = resolveSkillKey(skillName);
    // Las fichas guardan claves de varias formas ('Drive Land Vehicle', 'drivelandvehicle'): se comparan compactas.
    const compactSkill = (x: string) => normalizeCanonSkillName(x).replace(/[^a-z0-9]/g, '');
    const wanted = compactSkill(skillName);
    const byCompact = (rec: Record<string, number> | undefined) =>
      Object.entries(rec ?? {}).find(([k]) => compactSkill(k) === wanted)?.[1];
    const skillLevel = (skillRef
      ? (skillRef.kind === 'combat' ? character.skills?.[skillRef.key] : character.generalSkills?.[skillRef.key])
      : character.generalSkills?.[skillName])
      ?? byCompact(character.generalSkills)
      ?? byCompact(character.skills as unknown as Record<string, number>)
      ?? 0;
    const motoRank = character.role === 'Nomad' ? (character.roleRank || 0) : 0;
    const total = d.value + refStat + skillLevel + motoRank;
    const extra = d.extra ? (d.natural === 10 ? ` +${d.extra}` : ` -${d.extra}`) : '';
    setVehicleManeuverLog({
      action: `Maniobra Evasiva en ${veh.name}`,
      roll: total,
      text: `1d10 (${d.natural}${extra}) + REF (${refStat}) + ${skillName} (${skillLevel})${character.role === 'Nomad' ? ` + Moto (${motoRank})` : ''} = ${total} vs DV de persecución`
    });
  };

  // Vehículos genéricos del Core (pp. 189-191) y Family Motorpool (Core p.162).
  const [coreVehicleMsg, setCoreVehicleMsg] = useState<string | null>(null);
  const nomadMotoRank = character.role === 'Nomad' ? (character.roleRank || 0) : 0;
  const nomadTweaks2077 = character.role === 'Nomad' && era === '2077'
    ? getRoleRankInfo('Nomad', nomadMotoRank, '2077').tweaks2077
    : [];

  const handleTakeFromMotorpool = (v: CoreVehicleEntry) => {
    if (coreVehicleMinRooms(v) === null) return;
    addVehicleToCharacter(coreVehicleToOwned(v, 1, 'Family Motorpool, Core p.162'));
    setCoreVehicleMsg(`${v.name} tomado del motorpool familiar sin costo (Core p.162).`);
  };

  const handleBuyCoreVehicle = (v: CoreVehicleEntry) => {
    const rooms = coreVehicleMinRooms(v);
    if (rooms === null) return;
    const cost = v.costEb * rooms;
    if (!spendEurodollarsFor(character.id, cost, `Compra de vehículo: ${v.name} (Core p.${v.page})`)) {
      setCoreVehicleMsg(`No alcanzan los €$ para ${v.name} (${cost.toLocaleString()} €$).`);
      return;
    }
    addVehicleToCharacter(coreVehicleToOwned(v, rooms, 'Comprado'));
    setCoreVehicleMsg(`${v.name} comprado por ${cost.toLocaleString()} €$.`);
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
        {/* [Claude Code · 2026-10-24] v5.0.0 (plan 16, decisión 12): flex-wrap para no desbordar a 375 px. */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#141722] border border-[#222738] p-1.5 rounded-xs">
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
            onClick={() => setActiveTab('martial')}
            className={`px-3 py-1.5 rounded-xs font-tech text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'martial'
                ? 'bg-[#ef4444] text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1f2e]'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>🥋 ARTES MARCIALES &amp; IP</span>
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
            {/* Presets & Custom Arch Selector (Con Modo Jugador vs Modo Master GM) */}
            {!isGmArchitectureManagerOpen || gmAccess.mode === 'table-player' || gmAccess.mode === 'local-locked' ? (
              <div className="bg-[#0d1017] border border-[#1b2234] p-3.5 rounded-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-xs font-bold text-[#00f5d4] uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>🌐 PUNTO DE ACCESO ACTIVO (MODO JUGADOR)</span>
                    </span>
                    <span className="text-[9px] font-mono-code px-1.5 py-0.2 bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 rounded">
                      ARQ OCULTA
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    Interface: <strong className="text-white">Rango {activeInterfaceRank}</strong> ({netActionsPerTurn} Acciones/Turno)
                  </span>
                </div>

                <div className="p-3 bg-[#121622] border border-[#1e2638] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-tech font-bold text-white uppercase flex items-center gap-1.5">
                      <span className="text-[#00f5d4]">Punto de Acceso:</span> {activeArch.name}
                    </div>
                    <p className="text-[10px] font-mono-code text-[#94a3b8] mt-1">
                      Piso Actual: <strong className="text-cyan-400">Nivel #{currentFloorIndex + 1} de {activeArch.floors.length}</strong> • El Árbitro administra la topología y revela pisos según tus tiradas.
                    </p>
                  </div>
                  {gmAccess.mode === 'table-player' ? (
                    <span className="text-[10px] font-mono-code text-[#64748b] whitespace-nowrap">👑 Modo Master: solo el GM de "{gmAccess.campName}"</span>
                  ) : gmPinPrompt !== null ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        autoFocus
                        value={gmPinPrompt}
                        placeholder="PIN GM"
                        aria-label="PIN del GM"
                        onChange={(e) => { setGmPinPrompt(e.target.value.replace(/\D/g, '')); setGmPinError(false); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') submitGmPin(); if (e.key === 'Escape') setGmPinPrompt(null); }}
                        className={`w-20 bg-[#0c0d12] border ${gmPinError ? 'border-red-500' : 'border-amber-500/40'} text-white font-mono-code text-xs px-2 py-1 rounded-xs`}
                      />
                      <button type="button" onClick={submitGmPin} className="px-2 py-1 border border-amber-500/40 text-amber-400 font-tech text-xs font-bold rounded-xs cursor-pointer hover:bg-amber-600 hover:text-black">Abrir</button>
                      <button type="button" onClick={() => setGmPinPrompt(null)} className="px-1.5 py-1 text-[#64748b] font-tech text-xs cursor-pointer hover:text-white">✕</button>
                      {gmPinError && <span className="text-[10px] font-mono-code text-red-400">PIN incorrecto</span>}
                    </div>
                  ) : (
                  <button
                    type="button"
                    onClick={openGmManager}
                    className="px-3 py-1.5 bg-[#1a2030] hover:bg-amber-600 hover:text-black text-amber-400 border border-amber-500/40 font-tech text-xs font-bold rounded-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow"
                  >
                    <span>👑</span>
                    <span>MODO MASTER (GM): SELECCIONAR / EDITAR</span>
                  </button>
                  )}
                </div>

                {canShareNet && (
                  <label className="flex items-center gap-2 font-mono-code text-[11px] text-sky-200 cursor-pointer">
                    <input type="checkbox" checked={shareNetWithTable} onChange={(e) => setShareNetWithTable(e.target.checked)} />
                    📡 Mostrar la corrida a la mesa ({activeTable?.name}): pisos desbloqueados con su DV e ICE, sin HP/ATK/DEF
                  </label>
                )}

                {tableNet && !isTableGm && (
                  <div className="p-2.5 bg-sky-950/20 border border-sky-500/40 rounded-xs space-y-1 font-mono-code text-[11px] text-slate-300">
                    <div className="text-sky-200 font-bold">📡 El GM comparte: {tableNet.archName} · piso {tableNet.currentFloor} de {tableNet.totalFloors}</div>
                    <ol className="space-y-0.5">
                      {tableNet.floors.map((f) => (
                        <li key={f.floorNumber} className={f.floorNumber === tableNet.currentFloor ? 'text-cyan-300' : ''}>
                          {f.floorNumber === tableNet.currentFloor ? '▶ ' : ''}#{f.floorNumber} {f.type}: {f.name}
                          {typeof f.dv === 'number' ? ` · DV ${f.dv}` : ''}{f.iceType ? ` · ICE ${f.iceType}` : ''}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0d1017] border border-amber-500/50 p-3.5 rounded-xs space-y-3 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>👑 PANEL DEL MASTER (GM): ARQUITECTURAS ({allPresets.length})</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGmArchitectureManagerOpen(false)}
                    className="px-2 py-0.5 bg-[#161a26] hover:bg-[#20273a] text-slate-300 text-[10px] font-mono-code rounded border border-[#2b354d] cursor-pointer"
                  >
                    [ ✖ Cerrar Modo Master ]
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {allPresets.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        setCurrentFloorIndex(0);
                        setUnlockedNetFloors([1]);
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
                          preset.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                          preset.difficulty === 'Uncommon' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {preset.difficulty} • {preset.totalFloors} Pisos
                        </span>
                      </div>
                      <p className="text-[10px] font-mono-code text-[#64748b] mt-1 line-clamp-1">{preset.loreDescription}</p>
                    </button>
                  ))}
                </div>

                {/* Generador de pisos manuales para el GM */}
                <div className="pt-2 border-t border-[#1b2234] flex items-center justify-between gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono-code text-amber-400 font-bold">+ AÑADIR PISO (GM):</span>
                  <div className="flex items-center gap-1">
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
              </div>
            )}

            {/* Catálogo de 9 Acciones de Red con Selector de DV */}
            <div className="bg-[#0d1017] border border-[#1b2234] p-3.5 rounded-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                <span className="font-tech text-xs font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>ACCIONES DE INTERFAZ (9 ACCIONES OFICIALES)</span>
                </span>
                <span className="text-[10px] font-mono-code text-cyan-400">
                  Core pp. 198-199
                </span>
              </div>

              {/* Selector de DV Objetivo para la Tirada de Interfaz */}
              <div className="p-2 bg-[#121622] border border-[#1e2638] rounded-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold">
                    🎯 Selector de DV Objetivo para la Tirada:
                  </span>
                  <span className="text-[11px] font-mono-code text-cyan-300 font-bold">
                    DV Activo: {targetNetDv}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap text-[10px] font-mono-code">
                  {[
                    { dv: 6, label: 'DV 6 Básico' },
                    { dv: 8, label: 'DV 8 Estándar' },
                    { dv: 10, label: 'DV 10 Poco Común' },
                    { dv: 12, label: 'DV 12 Avanzado' }
                  ].map((item) => (
                    <button
                      key={item.dv}
                      type="button"
                      onClick={() => setTargetNetDv(item.dv)}
                      className={`px-2 py-0.5 rounded-xs transition-all cursor-pointer font-bold ${
                        targetNetDv === item.dv
                          ? 'bg-cyan-500 text-black border border-cyan-300 shadow'
                          : 'bg-[#1a2030] text-slate-400 hover:text-white border border-[#28324a]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Las 9 Acciones con especificación canónica */}
              <div className="grid grid-cols-1 gap-2.5">
                {NET_ACTIONS_CATALOG.map(act => (
                  <div
                    key={act.id}
                    className="p-2.5 bg-[#121622] border border-[#1e2638] hover:border-[#38bdf8]/60 rounded-xs space-y-1.5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="font-tech text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{act.name}</span>
                          <span className="text-[9px] font-mono-code px-1 py-0.2 bg-amber-950/70 text-amber-400 border border-amber-500/30 rounded">
                            {act.cost}
                          </span>
                        </div>
                        <div className="text-[9px] font-mono-code text-cyan-400 mt-0.5">
                          {act.id === 'scanner' ? 'DV 13 (Percepción en Mundo Real)' : `DV Objetivo: ${targetNetDv} (${act.dv})`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRollNetAction(act)}
                        className="px-2.5 py-1 bg-[#1a2030] hover:bg-[#00f5d4] hover:text-black text-[#00f5d4] border border-[#00f5d4]/40 rounded-xs font-tech text-xs font-bold uppercase transition-all cursor-pointer shrink-0"
                      >
                        🎲 Tirar
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-300 font-sans leading-tight">
                      {act.description}
                    </p>

                    <div className="text-[9px] font-mono-code text-[#64748b]">
                      <strong className="text-slate-400">Prerrequisito:</strong> {act.prerequisites}
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedNetActionId(expandedNetActionId === act.id ? null : act.id)}
                      className="text-[9px] font-mono-code text-[#38bdf8] hover:underline cursor-pointer block"
                    >
                      {expandedNetActionId === act.id ? '▴ Ocultar Detalle Canónico' : '▾ Ver Detalle Canónico & DV (Core pp. 198-199)'}
                    </button>

                    {expandedNetActionId === act.id && (
                      <div className="p-2 bg-[#090b10] border border-[#1b2234] rounded text-[9px] font-mono-code space-y-1 animate-fade-in">
                        <div className="text-slate-200">
                          <strong className="text-[#00f5d4]">Efecto Exacto:</strong> {act.exactEffect}
                        </div>
                        <div className="text-slate-300">
                          <strong className="text-amber-400">Resolución de DVs:</strong> {act.dvResolution}
                        </div>
                        <div className="text-[#64748b]">
                          <strong>Fórmula:</strong> {act.checkFormula}
                        </div>
                      </div>
                    )}
                  </div>
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
                    onClick={() => {
                      const nextIdx = Math.max(0, currentFloorIndex - 1);
                      setCurrentFloorIndex(nextIdx);
                      const flNum = nextIdx + 1;
                      setUnlockedNetFloors(prev => (prev.includes(flNum) ? prev : [...prev, flNum]));
                    }}
                    disabled={currentFloorIndex === 0}
                    className="px-2.5 py-1 bg-[#1a2030] hover:bg-[#00f5d4] hover:text-black text-xs font-tech font-bold rounded-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ↑ SUBIR
                  </button>
                  <button
                    onClick={() => {
                      const nextIdx = Math.min(activeArch.floors.length - 1, currentFloorIndex + 1);
                      setCurrentFloorIndex(nextIdx);
                      const flNum = nextIdx + 1;
                      setUnlockedNetFloors(prev => (prev.includes(flNum) ? prev : [...prev, flNum]));
                    }}
                    disabled={currentFloorIndex === activeArch.floors.length - 1}
                    className="px-2.5 py-1 bg-[#1a2030] hover:bg-[#00f5d4] hover:text-black text-xs font-tech font-bold rounded-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ↓ BAJAR
                  </button>
                </div>
              </div>

              {/* 👑 CONTROL DEL MASTER (GM): DESBLOQUEAR / OCULTAR PISOS NET */}
              {/* v5.3.0 (plan 20, B.3): es modo GM; el jugador de la mesa no lo ve y sin mesa aparece tras el PIN. [Claude Code · 2026-10-28] */}
              {(gmAccess.mode === 'table-gm' || gmAccess.mode === 'local-open') && (
              <div className="bg-[#0b0e17] border border-cyan-500/40 p-3 rounded-xs space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-tech text-xs font-bold text-amber-300 uppercase">
                      👑 CONTROL DEL MASTER (GM): DESBLOQUEAR / OCULTAR PISOS NET
                    </span>
                    <span className="text-[9px] font-mono-code text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-700/50">
                      Niebla de Guerra
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const nextLocked = activeArch.floors
                          .map((f) => f.floorNumber)
                          .find((fn) => !unlockedNetFloors.includes(fn));
                        if (nextLocked) {
                          setUnlockedNetFloors((prev) => [...prev, nextLocked]);
                        }
                      }}
                      className="px-2 py-0.5 bg-cyan-950 hover:bg-cyan-800 text-cyan-200 border border-cyan-600/60 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer"
                      title="Desbloquear siguiente piso bloqueado"
                    >
                      🔓 Desbloquear Siguiente Piso
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnlockedNetFloors(activeArch.floors.map((f) => f.floorNumber))}
                      className="px-2 py-0.5 bg-purple-950 hover:bg-purple-800 text-purple-200 border border-purple-600/60 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer"
                      title="Revelar todos los pisos (Modo GM)"
                    >
                      👁️ Revelar Todos (Modo GM)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnlockedNetFloors([1])}
                      className="px-2 py-0.5 bg-red-950 hover:bg-red-800 text-red-200 border border-red-600/60 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer"
                      title="Ocultar pisos del 2 en adelante para los jugadores"
                    >
                      🔒 Ocultar Todos (Modo Jugador)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1.5 border-t border-[#1b2234]">
                  {activeArch.floors.map((fl) => {
                    const isUn = unlockedNetFloors.includes(fl.floorNumber);
                    return (
                      <button
                        key={`gm-floor-${fl.floorNumber}`}
                        type="button"
                        onClick={() => {
                          setUnlockedNetFloors((prev) =>
                            isUn ? prev.filter((fn) => fn !== fl.floorNumber) : [...prev, fl.floorNumber]
                          );
                        }}
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold border transition-all cursor-pointer ${
                          isUn
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600/60 hover:bg-emerald-900'
                            : 'bg-red-950/50 text-red-400 border-red-800/50 hover:bg-red-900'
                        }`}
                      >
                        {isUn ? `🔓 Piso ${fl.floorNumber}` : `🔒 Piso ${fl.floorNumber}`}
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Escalera de pisos */}
              <div className="space-y-2">
                {activeArch.floors.map((fl, idx) => {
                  const isCurrent = idx === currentFloorIndex;
                  const isUnlocked = unlockedNetFloors.includes(fl.floorNumber);

                  if (!isUnlocked) {
                    return (
                      <div
                        key={`floor-${idx}`}
                        onClick={() => {
                          setCurrentFloorIndex(idx);
                          setUnlockedNetFloors((prev) => (prev.includes(fl.floorNumber) ? prev : [...prev, fl.floorNumber]));
                        }}
                        className="p-3 rounded-xs border border-red-950/60 bg-[#0b0d14] hover:border-red-500/40 opacity-75 hover:opacity-100 transition-all cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-xs flex items-center justify-center font-mono-code text-xs font-bold bg-[#171b26] text-red-400 border border-red-900/50">
                            🔒
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-tech text-xs font-bold text-red-400 uppercase tracking-wide">
                                🔒 PISO #{fl.floorNumber}: NODO ENCRIPTADO (CONTENIDO OCULTO PARA EL NETRUNNER)
                              </span>
                            </div>
                            <span className="text-[10px] font-mono-code text-slate-400 block mt-0.5">
                              Contenido protegido tras niebla de guerra. Se revela al entrar físicamente a este piso, usar Pathfinder exitoso o al desbloquearlo el Master.
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUnlockedNetFloors((prev) => [...prev, fl.floorNumber]);
                          }}
                          className="px-2 py-0.5 bg-red-950/70 hover:bg-red-800 text-red-300 border border-red-700/60 rounded-xs text-[10px] font-mono-code font-bold cursor-pointer shrink-0"
                        >
                          🔓 Desbloquear
                        </button>
                      </div>
                    );
                  }

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
                <p className="text-[10px] font-mono-code text-[#64748b]">
                  {deckItem ? `${deckItem.name} · ${deckSlotsUsed}/${deckSlots} slots${hardwareSlots > 0 ? ` (Hardware: ${hardwareSlots})` : ''} (Core pp.196 y 208)` : 'Sin cyberdeck en el inventario de la ficha.'}
                </p>
                {deckPrograms.length === 0 && (
                  <p className="text-[11px] text-[#94a3b8]">Sin programas: se compran en el creador (Tienda → Programas) o en el Compendio Omni.</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {deckPrograms.map((progName) => ({ progName, isRezzed: !!rezzedPrograms[progName] })).map(({ progName, isRezzed }) => (
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
          {/* BANNER DE CONTROL DE INTERFACE & GUÍA OFICIAL */}
          <div className="bg-[#0d1017] border border-[#1b2234] p-3.5 rounded-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Selector / Indicador de Rango de Interface */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f59e0b]/20 border border-[#f59e0b]/50 rounded-xs text-[#f59e0b]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-xs font-bold text-[#f59e0b] uppercase tracking-wider">
                      TU RANGO DE INTERFACE ACTIVO:
                    </span>
                    <span className="font-mono-code text-sm font-black text-white bg-[#1a2030] px-2 py-0.5 rounded-xs border border-[#2d3748]">
                      Rango {activeInterfaceRank}
                    </span>
                    {character.interfaceRankOverride !== undefined && (
                      <span className="text-[9px] font-mono-code bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-xs">
                        Personalizado
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono-code text-[#94a3b8]">
                    {activeInterfaceRank >= 4 ? `${netActionsPerTurn} NET Actions/Turno • Acceso a los 11 Quickhacks oficiales (CEMK)` :
                     activeInterfaceRank === 3 ? `${netActionsPerTurn} NET Actions/Turno • Desbloquea Difficult (DV 10) · Bypass Firewall DV 6` :
                     activeInterfaceRank === 2 ? `${netActionsPerTurn} NET Actions/Turno • Desbloquea Standard (DV 8)` :
                     activeInterfaceRank === 1 ? `${netActionsPerTurn} NET Actions/Turno • Desbloquea Simple (DV 6)` :
                     'Sin Interface • Necesitas al menos Interface 1 para desbloquear Quickhacks'}
                  </p>
                </div>
              </div>

              {/* Botones de ajuste de Interface y Modo Libre */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-[#141722] border border-[#222738] p-1 rounded-xs">
                  <span className="text-[10px] font-mono-code text-[#94a3b8] px-1">Rango:</span>
                  <button
                    type="button"
                    onClick={() => setInterfaceRankOverride(Math.max(0, activeInterfaceRank - 1))}
                    className="w-6 h-6 bg-[#1a2030] hover:bg-red-500/40 text-white rounded-xs font-mono-code font-bold flex items-center justify-center transition-colors cursor-pointer"
                    title="Reducir Rango de Interface"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-mono-code font-bold text-white text-xs">
                    {activeInterfaceRank}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInterfaceRankOverride(Math.min(10, activeInterfaceRank + 1))}
                    className="w-6 h-6 bg-[#1a2030] hover:bg-emerald-500/40 text-white rounded-xs font-mono-code font-bold flex items-center justify-center transition-colors cursor-pointer"
                    title="Aumentar Rango de Interface"
                  >
                    +
                  </button>
                  {character.interfaceRankOverride !== undefined && (
                    <button
                      type="button"
                      onClick={() => setInterfaceRankOverride(character.role === 'Netrunner' ? (character.roleRank || 4) : 0)}
                      className="text-[9px] font-mono-code text-[#94a3b8] hover:text-white px-1.5 py-0.5 hover:underline cursor-pointer"
                      title="Restablecer a Rango canónico del personaje"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setUnlockAllQuickhacks(!unlockAllQuickhacks)}
                  className={`px-3 py-1.5 rounded-xs font-tech text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    unlockAllQuickhacks
                      ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-[#181d2a] text-[#94a3b8] hover:text-white border border-[#24293c]'
                  }`}
                >
                  {unlockAllQuickhacks ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{unlockAllQuickhacks ? '🔓 MODO LIBRE ACTIVO' : '🔒 DESBLOQUEO POR RANGO'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQuickhackGuide(!showQuickhackGuide)}
                  className="px-3 py-1.5 bg-[#181d2a] hover:bg-[#252c40] text-[#f59e0b] border border-[#f59e0b]/40 rounded-xs font-tech text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{showQuickhackGuide ? 'OCULTAR GUÍA' : 'GUÍA REGLAS CEMK 2077'}</span>
                  {showQuickhackGuide ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Panel Desplegable de la Guía Oficial Canónica de Quickhacking */}
            {showQuickhackGuide && (
              <div className="pt-3 border-t border-[#1b2234] space-y-3 animate-fade-in text-xs font-mono-code">
                <div className="bg-[#121622] p-3 rounded-xs border border-[#2a344d] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#242e44] pb-1.5">
                    <span className="font-tech text-sm font-bold text-[#f59e0b] uppercase">
                      📖 {QUICKHACKING_OFFICIAL_RULES_GUIDE.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{QUICKHACKING_OFFICIAL_RULES_GUIDE.source}</span>
                  </div>

                  {/* Cómo funciona el desbloqueo */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-white text-[11px] block">
                      ⚡ {QUICKHACKING_OFFICIAL_RULES_GUIDE.howUnlockingWorks.title}:
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      {QUICKHACKING_OFFICIAL_RULES_GUIDE.howUnlockingWorks.summary}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {QUICKHACKING_OFFICIAL_RULES_GUIDE.howUnlockingWorks.ranks.map((rk, idx) => (
                        <div key={idx} className="bg-[#0b0e17] p-2 rounded-xs border border-[#1b2234] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-tech font-bold text-[#f59e0b] text-xs">{rk.interfaceRank}</span>
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded-xs font-bold">{rk.dv}</span>
                          </div>
                          <div className="text-[10px] font-bold text-white">{rk.tierName}</div>
                          <div className="text-[10px] text-cyan-300 font-sans">
                            {rk.unlockedHacks.join(', ')}
                          </div>
                          <p className="text-[9px] text-slate-400 leading-tight font-sans">{rk.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alcance, Brechas y Defensas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-[#1e2638]">
                    <div className="bg-[#0b0e17] p-2.5 rounded-xs border border-[#1b2234] space-y-1">
                      <span className="font-bold text-[#00f5d4] block text-[10px] uppercase">
                        🎯 {QUICKHACKING_OFFICIAL_RULES_GUIDE.rangeAndLineOfSight.title}
                      </span>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                        <strong>Alcance:</strong> {QUICKHACKING_OFFICIAL_RULES_GUIDE.rangeAndLineOfSight.maxDistance}.
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight font-sans">
                        {QUICKHACKING_OFFICIAL_RULES_GUIDE.rangeAndLineOfSight.lineOfSightRules}
                      </p>
                      <p className="text-[9px] text-[#00f5d4] leading-tight font-sans pt-1">
                        ✓ {QUICKHACKING_OFFICIAL_RULES_GUIDE.rangeAndLineOfSight.freeActionConnection}
                      </p>
                    </div>

                    <div className="bg-[#0b0e17] p-2.5 rounded-xs border border-[#1b2234] space-y-1">
                      <span className="font-bold text-amber-400 block text-[10px] uppercase">
                        💻 {QUICKHACKING_OFFICIAL_RULES_GUIDE.breachingAndPasswords.title}
                      </span>
                      <div className="space-y-0.5 text-[9px] text-slate-300 font-sans">
                        {QUICKHACKING_OFFICIAL_RULES_GUIDE.breachingAndPasswords.breachProcedure.map((step, sIdx) => (
                          <div key={sIdx}>{step}</div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#0b0e17] p-2.5 rounded-xs border border-[#1b2234] space-y-1">
                      <span className="font-bold text-red-400 block text-[10px] uppercase">
                        🛡️ {QUICKHACKING_OFFICIAL_RULES_GUIDE.selfIceAndDefense.title}
                      </span>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                        <strong>Self-ICE:</strong> {QUICKHACKING_OFFICIAL_RULES_GUIDE.selfIceAndDefense.selfIceEffect}
                      </p>
                      <p className="text-[10px] text-amber-200 leading-relaxed font-sans">
                        <strong>Expulsión:</strong> {QUICKHACKING_OFFICIAL_RULES_GUIDE.selfIceAndDefense.countermeasureAction}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flujo Canónico de 4 Pasos CEMK */}
          <div className="bg-[#0b0e17] p-3 rounded-xs border border-[#1e2638] space-y-2">
            <div className="flex items-center justify-between border-b border-[#1b2234] pb-1.5">
              <span className="font-tech text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> FLUJO CANÓNICO DE COMBATE CEMK (POR NET ACTIONS)
              </span>
              <span className="text-[10px] font-mono-code text-slate-400">Sin RAM · 1 NET Action por paso</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {/* Paso 1: Jack In */}
              <div className="bg-[#121622] p-2.5 rounded-xs border border-[#1e273a] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-tech font-bold text-cyan-300">PASO 1: JACK IN</div>
                  <div className="text-[9px] text-slate-400">1 NET Action vs WILL</div>
                  <div className="flex gap-1 mt-1 text-[9px] font-mono-code text-slate-400">
                    <label className="flex items-center gap-0.5">WILL
                      <input type="number" min={0} max={20} value={qhTargetWill} onChange={e => { const v = Number(e.target.value); if (Number.isFinite(v)) setQhTargetWill(v); }} className="w-9 bg-[#0b0e14] border border-[#1e273a] rounded-xs px-0.5 text-white" />
                    </label>
                    <label className="flex items-center gap-0.5">Conc.
                      <input type="number" min={0} max={20} value={qhTargetConcentration} onChange={e => { const v = Number(e.target.value); if (Number.isFinite(v)) setQhTargetConcentration(v); }} className="w-9 bg-[#0b0e14] border border-[#1e273a] rounded-xs px-0.5 text-white" />
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleJackInRoll}
                  className="mt-2 py-1 px-2 bg-[#172238] hover:bg-cyan-500 hover:text-black text-cyan-300 font-tech font-bold text-[10px] rounded-xs transition-colors cursor-pointer text-center"
                  title="Conectar al Neuroport del objetivo: 6 m con Cyberdeck externo, 8 m con la opción, 50 m con Neuroport Cyberdeck Port (CEMK p. 26)"
                >
                  🔌 Tirar Jack In
                </button>
              </div>

              {/* Paso 2: Romper Passwalls */}
              <div className="bg-[#121622] p-2.5 rounded-xs border border-[#1e273a] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-tech font-bold text-amber-300">PASO 2: PASSWALLS</div>
                  <div className="text-[9px] text-slate-400">
                    {activeInterfaceRank >= 3 ? '⚡ Firewall DV 6 Bypass' : 'Firewall base (DV 6) / ICE'}
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  <button
                    type="button"
                    onClick={() => handleBreachPasswallRoll(6, 'Firewall Base (DV 6)')}
                    className="flex-1 py-1 px-1 bg-[#262016] hover:bg-amber-500 hover:text-black text-amber-300 font-tech font-bold text-[9px] rounded-xs transition-colors cursor-pointer text-center"
                    title="Romper Firewall base (DV 6) o Self-ICE #1"
                  >
                    DV 6
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBreachPasswallRoll(8, 'Self-ICE #2 (DV 8)')}
                    className="flex-1 py-1 px-1 bg-[#262016] hover:bg-amber-500 hover:text-black text-amber-300 font-tech font-bold text-[9px] rounded-xs transition-colors cursor-pointer text-center"
                    title="Romper Self-ICE #2 (DV 8)"
                  >
                    DV 8
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBreachPasswallRoll(10, 'Self-ICE #3 (DV 10)')}
                    className="flex-1 py-1 px-1 bg-[#262016] hover:bg-amber-500 hover:text-black text-amber-300 font-tech font-bold text-[9px] rounded-xs transition-colors cursor-pointer text-center"
                    title="Romper Self-ICE #3 (DV 10)"
                  >
                    DV 10
                  </button>
                </div>
              </div>

              {/* Paso 3: Lanzar Quickhack */}
              <div className="bg-[#121622] p-2.5 rounded-xs border border-[#1e273a] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-tech font-bold text-emerald-300">PASO 3: QUICKHACK</div>
                  <div className="text-[9px] text-slate-400">1 NET Action (1 hack/turno)</div>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono-code mt-2 flex items-center gap-1">
                  <span>✓ Ejecuta en las cartas</span>
                </div>
              </div>

              {/* Paso 4: Expulsión */}
              <div className="bg-[#121622] p-2.5 rounded-xs border border-[#1e273a] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-tech font-bold text-rose-300">PASO 4: EXPULSIÓN</div>
                  <div className="text-[9px] text-slate-400">Acción Objetivo (WILL vs Int)</div>
                </div>
                <button
                  type="button"
                  onClick={handleTargetCounterRoll}
                  className="mt-2 py-1 px-2 bg-[#29171b] hover:bg-rose-600 hover:text-white text-rose-300 font-tech font-bold text-[10px] rounded-xs transition-colors cursor-pointer text-center"
                  title="El objetivo gasta su Acción de Meatspace para intentar expulsarte"
                >
                  👢 Boot Out
                </button>
              </div>
            </div>
          </div>

          {/* Barra de Filtro de Tiers */}
          <div className="bg-[#0d1017] border border-[#1b2234] p-3 rounded-xs flex flex-wrap items-center justify-between gap-3">
            {/* [Claude Code · 2026-10-24] v5.0.0 (decisión 12): flex-wrap para no desbordar a 375 px. */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-tech text-xs font-bold text-[#f59e0b] uppercase tracking-wider">
                FILTRAR POR NIVEL:
              </span>
              {(['All', 'Simple', 'Standard', 'Difficult', 'Advanced'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setQuickhackTierFilter(tier)}
                  className={`px-2.5 py-1 text-xs font-mono-code font-bold rounded-xs transition-colors cursor-pointer ${
                    quickhackTierFilter === tier
                      ? 'bg-[#f59e0b] text-black font-bold'
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
                  {quickhackRollLog.stepInfo || (quickhackRollLog.success ? '¡OBJETIVO INFECTADO CON ÉXITO!' : 'HACKEO BLOQUEADO POR FIREWALL O RANGO')}
                </strong>
                {quickhackRollLog.damageRoll !== undefined && (
                  <span className="ml-3 font-bold text-amber-300">Daño Infligido: {quickhackRollLog.damageRoll} pts</span>
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

          {/* Grilla de los 11 Quickhacks Oficiales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredQuickhacks.map(qh => {
              const isLocked = quickhacksBlocked || (!unlockAllQuickhacks && activeInterfaceRank < qh.requiredInterfaceRank);

              return (
                <div
                  key={qh.id}
                  className={`bg-[#0d1017] p-3.5 rounded-xs space-y-2.5 transition-all flex flex-col justify-between border ${
                    isLocked 
                      ? 'border-[#2d1b22] opacity-75' 
                      : 'border-[#1b2234] hover:border-[#f59e0b]/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className="font-tech text-sm font-bold text-white uppercase flex items-center gap-1.5">
                        {isLocked ? <Lock className="w-3.5 h-3.5 text-red-400" /> : <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />}
                        <span>{qh.name}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded-xs font-bold ${
                          qh.tier === 'Advanced' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          qh.tier === 'Difficult' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          qh.tier === 'Standard' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {qh.tier} • DV {qh.dv}
                        </span>
                        <span className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded-xs font-bold ${
                          isLocked 
                            ? 'bg-red-950/60 text-red-400 border border-red-700/50' 
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50'
                        }`}>
                          Req. Int {qh.requiredInterfaceRank}+
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#94a3b8] mt-1">
                      <span>Coste: <strong className="text-cyan-400">{qh.actionCost}</strong></span>
                      <span>Duración: <strong className="text-white">{qh.duration}</strong></span>
                      {qh.damage && <span>Daño: <strong className="text-[#f59e0b]">{qh.damage}</strong></span>}
                    </div>

                    <p className="text-xs font-mono-code text-[#cbd5e1] mt-2 leading-relaxed">
                      {qh.effect}
                    </p>

                    <p className="text-[10px] text-slate-500 italic mt-1 font-sans">
                      {qh.loreDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1b2234]">
                    {isLocked ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-1.5 bg-red-950/30 text-red-400/80 border border-red-800/40 font-tech font-bold text-xs uppercase tracking-wider rounded-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                        title={quickhacksBlocked ? 'En 2045 los Quickhacks requieren Neuroport (CEMK RB p.26)' : `Requiere Rango de Interface ${qh.requiredInterfaceRank} o activa el Modo Libre arriba`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{quickhacksBlocked ? 'BLOQUEADO (REQUIERE NEUROPORT)' : `BLOQUEADO (REQ. INTERFACE ${qh.requiredInterfaceRank}+)`}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleExecuteQuickhack(qh)}
                        className="w-full py-1.5 bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>EJECUTAR (1d10 + {activeInterfaceRank} vs DV {qh.dv})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. VISTA ARTES MARCIALES & ENTRENAMIENTO IP & CHIPWARE */}
      {/* ==================================================================== */}
      {activeTab === 'martial' && (
        <div className="space-y-4">
          {/* HEADER DEL CENTRO DE ARTES MARCIALES */}
          <div className="bg-[#0d1017] border border-[#1b2234] p-4 rounded-xs space-y-3 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500/20 border border-red-500 rounded-xs text-red-400">
                  <Swords className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-tech text-base sm:text-lg font-black text-white tracking-wider uppercase">
                      DOJO DE ARTES MARCIALES &amp; CHIPWARE // CYBERFISTS &amp; CORE
                    </h2>
                    <span className="text-[10px] font-mono-code bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full font-bold">
                      27 FORMAS • 54 COMBOS
                    </span>
                  </div>
                  <p className="text-xs font-mono-code text-[#64748b]">
                    Entrenamiento con IP (x2) • Skill Chips (Nivel 3 — 1,000 €$) • ROF 2 • Ignora 50% SP
                  </p>
                </div>
              </div>

              {/* Botón de Guía de Reglas Oficiales */}
              <button
                type="button"
                onClick={() => setShowMartialArtsGuide(!showMartialArtsGuide)}
                className="px-3 py-1.5 bg-[#181d2a] hover:bg-[#252c40] text-red-400 border border-red-500/40 rounded-xs font-tech text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{showMartialArtsGuide ? 'OCULTAR MANUAL CANÓNICO' : 'MANUAL CANÓNICO (CORE PP. 112, 178-181, 360, 411)'}</span>
                {showMartialArtsGuide ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* BARRA DE VITALS, IP & BILLETERA DEL PERSONAJE */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1b2234] bg-[#111420] p-3 rounded-xs text-xs font-mono-code">
              {/* Stats Físicos y Daño Base */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#94a3b8]">DEX:</span>
                  <strong className="text-white font-tech text-sm">{character.stats.DEX || 6}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#94a3b8]">BODY:</span>
                  <strong className="text-white font-tech text-sm">{getEffectiveBody(character) || 6}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#94a3b8]">Daño Base Golpe:</span>
                  <strong className="text-amber-400 font-bold">
                    {(getEffectiveBody(character) || 6) <= 4 ? '1d6' : (getEffectiveBody(character) || 6) <= 6 ? '2d6' : (getEffectiveBody(character) || 6) <= 10 ? '3d6' : '4d6'} Daño
                  </strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#94a3b8]">Habilidad General:</span>
                  <strong className="text-cyan-400 font-bold">Martial Arts {character.skills.martialArts || 0}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[#94a3b8]">Billetera:</span>
                  <strong className="text-white">{character.eurodollars} €$</strong>
                </div>
              </div>

              {/* GESTOR DE IMPROVEMENT POINTS (IP) */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#0b0d14] border border-emerald-500/40 px-2.5 py-1 rounded-xs">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">Puntos de Mejora:</span>
                  <strong className="text-emerald-300 font-tech text-sm">
                    {character.improvementPoints !== undefined ? character.improvementPoints : 120} IP
                  </strong>
                </div>

                <div className="flex items-center gap-1 bg-[#141824] border border-[#222738] p-0.5 rounded-xs">
                  <button
                    type="button"
                    onClick={() => adjustImprovementPoints(-10)}
                    className="px-1.5 py-0.5 bg-[#1b2234] hover:bg-red-500/40 text-[10px] text-white rounded-xs transition-colors cursor-pointer"
                    title="Restar 10 IP"
                  >
                    -10
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustImprovementPoints(10)}
                    className="px-1.5 py-0.5 bg-[#1b2234] hover:bg-emerald-500/40 text-[10px] text-white rounded-xs transition-colors cursor-pointer"
                    title="Añadir 10 IP"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustImprovementPoints(50)}
                    className="px-1.5 py-0.5 bg-[#1b2234] hover:bg-emerald-500/40 text-[10px] text-emerald-400 font-bold rounded-xs transition-colors cursor-pointer"
                    title="Añadir 50 IP"
                  >
                    +50
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustImprovementPoints(100)}
                    className="px-1.5 py-0.5 bg-[#1b2234] hover:bg-emerald-500/40 text-[10px] text-cyan-300 font-bold rounded-xs transition-colors cursor-pointer"
                    title="Añadir 100 IP"
                  >
                    +100
                  </button>
                </div>
              </div>
            </div>

            {/* MANUAL CANÓNICO DESPLEGABLE */}
            {showMartialArtsGuide && (
              <div className="pt-3 border-t border-[#1b2234] space-y-3 text-xs font-mono-code animate-fade-in">
                <div className="bg-[#121622] p-3 rounded-xs border border-red-500/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#242e44] pb-1.5">
                    <span className="font-tech text-sm font-bold text-red-400 uppercase">
                      🥋 {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.sourceReferences}</span>
                  </div>

                  {/* 1. Naturaleza y x2 */}
                  <div className="space-y-1">
                    <span className="font-bold text-white text-[11px] block">
                      ★ {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.title}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.definition}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                      <div className="p-2 bg-[#0b0e17] rounded-xs border border-[#1b2234] text-[10px] text-slate-300">
                        <strong className="text-amber-400 block mb-0.5">Dificultad x2:</strong>
                        {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.difficultyMultiplier}
                      </div>
                      <div className="p-2 bg-[#0b0e17] rounded-xs border border-[#1b2234] text-[10px] text-slate-300">
                        <strong className="text-cyan-400 block mb-0.5">27 Estilos Separados:</strong>
                        {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.whySeparateSkills}
                      </div>
                      <div className="p-2 bg-[#0b0e17] rounded-xs border border-[#1b2234] text-[10px] text-slate-300">
                        <strong className="text-emerald-400 block mb-0.5">Requisito de Uso:</strong>
                        {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.requirementToUse}
                      </div>
                    </div>
                  </div>

                  {/* 2. Mecánicas de Combate: ROF 2, 50% SP y Escala BODY */}
                  <div className="pt-2 border-t border-[#1e2638] space-y-1.5">
                    <span className="font-bold text-white text-[11px] block">
                      ⚡ {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.title}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="p-2 bg-[#0b0e17] rounded-xs border border-[#1b2234] text-[10px] text-slate-300 space-y-1">
                        <strong className="text-red-400 block">ROF 2 &amp; Tirada:</strong>
                        <p>{MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.rateOfFire}</p>
                      </div>
                      <div className="p-2 bg-[#0b0e17] rounded-xs border border-[#1b2234] text-[10px] text-slate-300 space-y-1">
                        <strong className="text-red-400 block">Ignora 50% de Armadura (SP):</strong>
                        <p>{MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.armorPenetrationRule}</p>
                      </div>
                    </div>

                    <div className="p-2 bg-[#0b0e17] rounded-xs border border-[#1b2234] text-[10px] text-slate-300 space-y-1">
                      <strong className="text-red-400 block">Special Moves:</strong>
                      <p>{MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.specialMovesResolution}</p>
                    </div>

                    {/* Tabla Oficial de Daño por BODY */}
                    <div className="overflow-x-auto border border-[#1e2638] rounded-xs mt-1">
                      <table className="w-full text-left text-[10px]">
                        <thead className="bg-[#181d2c] text-red-300 uppercase">
                          <tr>
                            <th className="py-1 px-2.5">Rango de BODY</th>
                            <th className="py-1 px-2.5">Daño Base de Golpe</th>
                            <th className="py-1 px-2.5">Ejemplos Canónicos</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1b2233]">
                          {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.bodyDamageScaleTable.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[#141824]/60">
                              <td className="py-1 px-2.5 font-bold text-white">{row.bodyRange}</td>
                              <td className="py-1 px-2.5 font-mono-code font-bold text-amber-400">{row.damageDice}</td>
                              <td className="py-1 px-2.5 text-slate-400">{row.examples}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3. Las 3 Vías de Adquisición */}
                  <div className="pt-2 border-t border-[#1e2638] space-y-1.5">
                    <span className="font-bold text-white text-[11px] block">
                      💰 {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.howToBuyAndAcquire.title}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.howToBuyAndAcquire.methods.map((m) => (
                        <div key={m.id} className="p-2.5 bg-[#0b0e17] rounded-xs border border-[#1b2234] space-y-1">
                          <span className="font-tech text-xs font-bold text-amber-400 block">{m.name}</span>
                          <span className="text-[9px] text-[#64748b] block">{m.sourcePage}</span>
                          <div className="text-[10px] font-bold text-emerald-400">{m.costExplanation}</div>
                          <p className="text-[10px] text-slate-300 leading-tight font-sans">{m.mechanicDetails}</p>
                          {m.ipCostTable && (
                            <div className="pt-1 border-t border-[#1a2030] text-[9px] text-slate-400 flex flex-wrap gap-1">
                              {m.ipCostTable.map(ip => (
                                <span key={ip.targetRank} className="bg-[#141926] px-1 py-0.2 rounded-xs border border-[#1e2638]">
                                  R{ip.targetRank}: {ip.cost} IP
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje de retroalimentación de entrenamiento / chipware */}
            {martialFeedback && (
              <div className={`p-2.5 rounded-xs border text-xs font-mono-code flex items-center justify-between ${
                martialFeedback.success
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                  : 'bg-red-950/40 border-red-500/60 text-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {martialFeedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  <span>{martialFeedback.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMartialFeedback(null)}
                  className="text-xs text-slate-400 hover:text-white px-1.5"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* FILTRO DE CATEGORÍAS DE ARTES MARCIALES */}
          <div className="bg-[#0d1017] border border-[#1b2234] p-3 rounded-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-tech text-xs font-bold text-red-400 uppercase tracking-wider">
                FILTRAR ESTILOS:
              </span>
              {[
                { id: 'all', label: 'TODAS LAS FORMAS (27)' },
                { id: 'core', label: 'CORE RULEBOOK (4)' },
                { id: 'interface_red', label: 'CYBERFISTS // IR4 (23)' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setMartialCategoryFilter(f.id as any)}
                  className={`px-2.5 py-1 text-xs font-mono-code font-bold rounded-xs transition-colors cursor-pointer ${
                    martialCategoryFilter === f.id
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-[#161b26] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono-code text-[#64748b]">
              Mostrando {MARTIAL_ARTS_FORMS.filter(f => martialCategoryFilter === 'all' ? true : f.sourceBook === martialCategoryFilter).length} de 27 estilos
            </span>
          </div>

          <MartialCommonRules />

          {/* GRILLA DE LAS 27 FORMAS DE ARTES MARCIALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MARTIAL_ARTS_FORMS.filter(f => martialCategoryFilter === 'all' ? true : f.sourceBook === martialCategoryFilter).map(form => {
              const naturalRank = character.knownMartialArts?.[form.id] || 0;
              const isChipEquipped = (character.equippedMartialArtChips || []).includes(form.id);
              const isChipOwned = (character.ownedMartialArtChips || []).includes(form.id);
              const effectiveRank = Math.max(naturalRank, isChipEquipped ? 3 : 0);
              const dex = character.stats.DEX || 6;
              const totalAttack = dex + effectiveRank;

              const nextRank = naturalRank + 1;
              const ipCost = nextRank * 40;
              const currentIp = character.improvementPoints !== undefined ? character.improvementPoints : 120;
              const canTrain = currentIp >= ipCost && naturalRank < 10;
              const isOpen = !!openMartialForms[form.id];
              const sourceLabel = form.sourceBook === 'core' ? 'Core Rulebook' : 'Cyberfists of Fury';

              return (
                <div
                  key={form.id}
                  className={`bg-[#0d1017] rounded-xs transition-all flex flex-col justify-between border overflow-hidden ${
                    effectiveRank > 0
                      ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                      : 'border-[#1b2234] hover:border-slate-700'
                  }`}
                >
                  {/* Cabecera Plegable: Nombre • Stats Clave • Fuente */}
                  <button
                    type="button"
                    onClick={() => toggleMartialForm(form.id)}
                    className="w-full p-3 flex items-center justify-between gap-2 text-left hover:bg-[#121622] transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="font-tech text-xs sm:text-sm font-bold text-white uppercase flex items-center gap-1.5 truncate">
                        <Swords className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{form.name}</span>
                      </span>
                      <span className="text-[10px] font-mono-code text-emerald-400">
                        DEX (x2) • ROF 2 • 50% SP • Nvl {effectiveRank}
                      </span>
                      <span className={`text-[9px] font-mono-code px-1.5 py-0.2 rounded-xs font-bold ${
                        form.sourceBook === 'core'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        Fuente ({sourceLabel})
                      </span>
                      {effectiveRank > 0 && (
                        <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded-xs bg-emerald-500 text-black font-bold">
                          R{effectiveRank} {isChipEquipped && '(Chip +3)'}
                        </span>
                      )}
                    </div>
                    <div className="shrink-0 text-slate-400">
                      {isOpen ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Cuerpo Desplegable Completo */}
                  {isOpen && (
                    <div className="p-3.5 pt-0 border-t border-[#1a2133] space-y-3 mt-1">
                      <div className="space-y-2 pt-1">
                        {/* Estado de Maestría del Personaje */}
                        <div className="bg-[#121622] p-2 rounded-xs border border-[#1f273c] space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono-code">
                            <span className="text-slate-400">Rango Natural:</span>
                            <strong className="text-white">Rango {naturalRank}/10</strong>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono-code">
                            <span className="text-slate-400">Rango Efectivo:</span>
                            <strong className={effectiveRank > 0 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                              Rango {effectiveRank} {isChipEquipped && '(Chip +3)'}
                            </strong>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono-code pt-1 border-t border-[#1a2133]">
                            <span className="text-slate-400">Ataque Total (DEX+Rango):</span>
                            <span className="text-red-400 font-bold">1d10 + {totalAttack}</span>
                          </div>
                        </div>

                        {/* Lore y Rol Táctico */}
                        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                          {form.originAndFlavor}
                        </p>
                        <div className="text-[10px] font-mono-code text-[#94a3b8]">
                          <span className="text-slate-500">Rol Táctico:</span> {form.tacticalRole}
                        </div>
                        <div className="text-[10px] font-mono-code text-[#94a3b8]">
                          <span className="text-slate-500">Stats clave (según los requisitos de sus movimientos):</span> {form.keyStats.join(', ')}
                          {form.sourcePage != null && <span className="text-[#64748b] ml-1">{form.sourceBook === 'core' ? 'Core' : 'Interface RED Vol. 4'} p.{form.sourcePage}</span>}
                        </div>

                        {/* Los 2 Movimientos Especiales (v5.6.0: en cuadros) */}
                        <div className="pt-2 border-t border-[#1b2234]">
                          <MartialMoveBoxes moves={form.moves} />
                        </div>
                      </div>

                      {/* ACCIONES DE ADQUISICIÓN: ENTRENAR CON IP & SKILL CHIP */}
                      <div className="pt-2.5 border-t border-[#1b2234] space-y-2">
                        {/* Botón de Entrenamiento con IP */}
                        {naturalRank >= 10 ? (
                          <div className="text-center py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-xs font-tech font-bold uppercase rounded-xs">
                            ★ MAESTRÍA MÁXIMA (RANGO 10)
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const res = trainMartialArtWithIp(form.id, form.name);
                              setMartialFeedback(res);
                            }}
                            disabled={!canTrain}
                            className={`w-full py-1.5 px-2 rounded-xs font-tech text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                              canTrain
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                                : 'bg-[#151926] text-slate-500 border border-[#222738] cursor-not-allowed'
                            }`}
                            title={canTrain ? `Gasta ${ipCost} IP para subir a Rango ${nextRank}` : `Necesitas ${ipCost} IP`}
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>
                              {canTrain
                                ? `ENTRENAR RANGO ${nextRank} (${ipCost} IP)`
                                : `FALTAN ${ipCost - currentIp} IP (REQ. ${ipCost} IP)`}
                            </span>
                          </button>
                        )}

                        {/* Botones de Skill Chip (Nivel 3 — 1,000 €$) */}
                        <div className="space-y-1">
                          {isChipOwned ? (
                            <button
                              type="button"
                              onClick={() => toggleEquipMartialArtChip(form.id)}
                              className={`w-full py-1 px-2 rounded-xs font-mono-code text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                isChipEquipped
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 hover:bg-cyan-500/30'
                                  : 'bg-[#151926] text-slate-400 border border-[#222738] hover:text-white'
                              }`}
                            >
                              <Cpu className="w-3.5 h-3.5" />
                              <span>
                                {isChipEquipped
                                  ? '✓ CHIP INSERTADO EN SOCKET (QUITAR)'
                                  : '⚡ INSERTAR CHIP EN SOCKET (+3)'}
                              </span>
                            </button>
                          ) : (
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const res = buyAndEquipMartialArtChip(form.id, form.name, false);
                                  setMartialFeedback(res);
                                }}
                                className="py-1 px-1 bg-[#1a2030] hover:bg-amber-600 hover:text-black text-amber-300 border border-amber-600/40 rounded-xs font-mono-code text-[10px] font-bold transition-colors cursor-pointer text-center"
                                title="Comprar Skill Chip Nivel 3 por 1,000 €$ oficiales"
                              >
                                COMPRAR (1,000 €$)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const res = buyAndEquipMartialArtChip(form.id, form.name, true);
                                  setMartialFeedback(res);
                                }}
                                className="py-1 px-1 bg-[#151926] hover:bg-[#20273a] text-slate-400 hover:text-white border border-[#24293c] rounded-xs font-mono-code text-[10px] transition-colors cursor-pointer text-center"
                                title="Asignar gratis (para personajes de creación con Chipware inicial)"
                              >
                                GRATIS (CREACIÓN)
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
                    Puntos usados: <strong className="text-white">{soloAwarenessPointCost(currentSolo)} / {character.roleRank || 0}</strong> (Rango de Combat Awareness, Core p. 146).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: 'threatDetection' as const, label: 'Threat Detection', costDesc: '1 pt = +1 a Perception' },
                  { key: 'initiativeReaction' as const, label: 'Initiative Reaction', costDesc: '1 pt = +1 Iniciativa en combate' },
                  { key: 'spotWeakness' as const, label: 'Spot Weakness', costDesc: '1 pt = +1 al daño (antes de armadura) del primer ataque exitoso del Round' },
                  { key: 'precisionAttack' as const, label: 'Precision Attack', costDesc: '3/6/9 pts = +1/+2/+3 a todos los Ataques' },
                  { key: 'damageDeflection' as const, label: 'Damage Deflection', costDesc: '2 pts por -1 al primer daño recibido en el Round (máx. -5)' },
                  { key: 'fumbleRecovery' as const, label: 'Fumble Recovery', costDesc: '4 pts = ignora los 1 al atacar (siguen contando como 1)' }
                ].map(item => (
                  <div key={item.key} className="bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-xs font-bold text-white uppercase">{item.label}</span>
                      <span className="font-mono-code text-sm font-black text-red-400">
                        {item.key === 'fumbleRecovery'
                          ? (currentSolo.fumbleRecovery ? 'ACTIVO (4 pts)' : '0 pts')
                          : `+${(currentSolo[item.key] as number) || 0}`}
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
                    Síntesis de fármacos conocidos: TECH + Medical Tech (Pharmaceuticals + Cryosystem) + 1d10 vs DV {SYNTHESIS_DV}; {SYNTHESIS_MATERIALS_EB} €$ de materiales y 1 hora por tanda (Core pp. 149-150).
                  </p>
                </div>
              </div>

              <GameClockBar compact />
              <MedtechTreatmentPanel defaultPatientId={character.id} />

              {medtechCraftLog && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/50 rounded-xs text-xs font-mono-code text-emerald-200">
                  {medtechCraftLog}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['Antibiotic', 'Rapidetox', 'Speedheal', 'Stim', 'Surge'].filter(drug => (character.medicineAllocation?.knownPharmaceuticals ?? []).includes(drug)).map(drug => (
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
                      <span>SINTETIZAR (DV {SYNTHESIS_DV} · {SYNTHESIS_MATERIALS_EB} €$)</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ESTACIÓN ESPECIALIZADA: TECH MAKER */}
          {selectedRoleView === 'tech' && (
            <div className="space-y-4">
              <MakerPanel />
              {/* FEEDBACK DEL BANCO DE TRABAJO */}
              {techMakerLog && (
                <div
                  className={`p-3 rounded-xs border text-xs font-mono-code flex items-center justify-between ${
                    techMakerLog.success
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                      : 'bg-red-950/40 border-red-500/60 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {techMakerLog.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{techMakerLog.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTechMakerLog(null)}
                    className="text-xs text-slate-400 hover:text-white px-1.5 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* 1. TALLER EN VIVO SOBRE TU INVENTARIO (MAKER: UPGRADE & ATTACHMENT BENCH) */}
              <div className="bg-[#090b10] border border-amber-500/40 p-4 rounded-xs space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b2234] pb-3">
                  <div>
                    <h3 className="font-tech text-base font-bold text-amber-400 uppercase flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-amber-500" />
                      <span>MAKER: UPGRADE &amp; ATTACHMENT BENCH // TALLER EN VIVO</span>
                    </h3>
                    <p className="text-xs font-mono-code text-[#64748b]">
                      Instalación de accesorios oficiales (13 tipos) y Mejoras Maker (Core pág. 148) directamente sobre tu equipo.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-code bg-[#171d2b] text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded">
                      💰 Fondos: {character.eurodollars ?? 0} eb
                    </span>
                  </div>
                </div>

                {/* Selector de Objetivo (Armas equipadas o Armaduras) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-tech text-slate-300 font-bold uppercase tracking-wider block">
                    1. SELECCIONA EL ÍTEM DE TU INVENTARIO A MEJORAR:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {character.equippedWeapons.map((w) => {
                      const isSelected = selectedTechTargetId === w.instanceId;
                      const cap = calculateWeaponSlotCapacity(w);
                      return (
                        <button
                          key={w.instanceId}
                          type="button"
                          onClick={() => setSelectedTechTargetId(w.instanceId)}
                          className={`px-3 py-2 rounded-xs border text-left font-mono-code text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                              : 'bg-[#121622] border-[#20273a] text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <div className="font-tech font-bold uppercase">{w.name}</div>
                          <div className="text-[10px] text-slate-400">
                            Ranuras: {cap.usedSlots}/{cap.maxSlots} {cap.isExotic && '(Exótica/Melee)'}
                          </div>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setSelectedTechTargetId('headArmor')}
                      className={`px-3 py-2 rounded-xs border text-left font-mono-code text-xs transition-all cursor-pointer ${
                        selectedTechTargetId === 'headArmor'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          : 'bg-[#121622] border-[#20273a] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-tech font-bold uppercase">Blindaje Cabeza ({character.headArmor.name})</div>
                      <div className="text-[10px] text-slate-400">
                        SP {character.headArmor.currentSp}/{character.headArmor.maxSp} {character.headArmor.techUpgradedSp && '• [+1 SP TECH]'}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTechTargetId('bodyArmor')}
                      className={`px-3 py-2 rounded-xs border text-left font-mono-code text-xs transition-all cursor-pointer ${
                        selectedTechTargetId === 'bodyArmor'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          : 'bg-[#121622] border-[#20273a] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-tech font-bold uppercase">Blindaje Torso ({character.bodyArmor.name})</div>
                      <div className="text-[10px] text-slate-400">
                        SP {character.bodyArmor.currentSp}/{character.bodyArmor.maxSp} {character.bodyArmor.techUpgradedSp && '• [+1 SP TECH]'}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Panel de Trabajo según el ítem seleccionado */}
                {(() => {
                  const selectedWeapon = character.equippedWeapons.find((w) => w.instanceId === selectedTechTargetId);

                  if (selectedWeapon) {
                    const capacity = calculateWeaponSlotCapacity(selectedWeapon);
                    const installedList = selectedWeapon.installedAttachments || [];
                    const selectedAtt = WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === selectedAttachmentId);
                    const canAffordAtt = (character.eurodollars ?? 0) >= (selectedAtt?.cost ?? 0);
                    const hasFreeSlots = selectedAtt ? capacity.remainingSlots >= selectedAtt.slots : false;

                    const upgradeOption = TECH_MAKER_UPGRADE_OPTIONS.find((u) => u.id === selectedUpgradeType);
                    const dvEntry = MAKER_DV_AND_TIME_BY_COST.find((d) => (selectedWeapon.cost || 500) <= d.itemPriceMax) || MAKER_DV_AND_TIME_BY_COST[3];
                    const upgradeDv = dvEntry.upgradeDv;
                    // Core p.148: Upgrade Expertise usa materiales de la misma categoría de precio que el objeto.
                    const upgradeMaterialCost = Math.ceil(
                      materialCost('upgrade', priceCategoryForEb(selectedWeapon.cost || 500), selectedWeapon.cost || 500).eb ?? 0
                    );
                    const canAffordUpgrade = (character.eurodollars ?? 0) >= upgradeMaterialCost;

                    return (
                      <div className="bg-[#101420] border border-[#1d2436] p-3.5 rounded-xs space-y-4">
                        {/* Estado del arma en el banco */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b2234] pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-tech text-sm font-bold text-white uppercase">{selectedWeapon.name}</span>
                            <span className="text-[10px] font-mono-code bg-[#1a2133] text-[#38bdf8] px-2 py-0.5 rounded font-bold">
                              Ranuras Usadas: {capacity.usedSlots} / {capacity.maxSlots}
                            </span>
                            <span className="text-[10px] font-mono-code bg-[#1a2133] text-emerald-400 px-2 py-0.5 rounded font-bold">
                              Cargador: {selectedWeapon.currentMag}/{selectedWeapon.standardMag} tiros
                            </span>
                            {selectedWeapon.techUpgrade && selectedWeapon.techUpgrade !== 'none' && (
                              <span className="text-[10px] font-mono-code bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-bold uppercase">
                                Tech: {selectedWeapon.techUpgrade}
                              </span>
                            )}
                          </div>
                          {capacity.isExotic && (
                            <span className="text-[10px] font-mono-code text-red-400 font-bold">
                              ⚠️ Arma Exótica o Melee (0 ranuras estándar)
                            </span>
                          )}
                        </div>

                        {/* Accesorios Instalados */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-tech text-slate-300 font-bold uppercase block">
                            ACCESORIOS INSTALADOS ({installedList.length}):
                          </span>
                          {installedList.length === 0 ? (
                            <p className="text-xs font-mono-code text-[#64748b]">No hay accesorios instalados en esta arma.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {installedList.map((attId) => {
                                const attObj = WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === attId);
                                return (
                                  <div
                                    key={attId}
                                    className="flex items-center gap-1.5 bg-[#171d2b] border border-[#232c40] px-2.5 py-1 rounded text-xs font-mono-code text-slate-200"
                                  >
                                    <span className="font-bold text-amber-300">{attObj?.name || attId}</span>
                                    <span className="text-[10px] text-slate-400">({attObj?.slots || 1} slot)</span>
                                    <button
                                      type="button"
                                      onClick={() => removeWeaponAttachment(selectedWeapon.instanceId, attId)}
                                      className="ml-1 text-red-400 hover:text-red-300 font-bold cursor-pointer"
                                      title="Desinstalar accesorio"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Sección 1: Instalar Nuevo Accesorio */}
                        <div className="pt-2 border-t border-[#1b2234] space-y-2">
                          <span className="text-[11px] font-tech text-amber-400 font-bold uppercase block flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" /> INSTALAR ACCESORIO CANÓNICO (13 OFICIALES)
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-8 space-y-1">
                              <select
                                value={selectedAttachmentId}
                                onChange={(e) => setSelectedAttachmentId(e.target.value)}
                                className="w-full bg-[#0a0d16] border border-[#222b40] text-xs font-mono-code text-[#38bdf8] p-2 rounded focus:outline-none"
                              >
                                {WEAPON_ATTACHMENTS_CATALOG.map((att) => (
                                  <option key={att.id} value={att.id}>
                                    {att.name} • {att.cost} eb • {att.slots} {att.slots === 1 ? 'ranura' : 'ranuras'}
                                  </option>
                                ))}
                              </select>
                              {selectedAtt && (
                                <p className="text-[11px] font-mono-code text-slate-400 leading-tight">
                                  {selectedAtt.summary} {selectedAtt.incompatibleWith.length > 0 && `(Incompatible con: ${selectedAtt.incompatibleWith.join(', ')})`}
                                </p>
                              )}
                            </div>

                            <div className="md:col-span-4">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!selectedAtt) return;
                                  installWeaponAttachment(selectedWeapon.instanceId, selectedAtt.id, selectedAtt.cost);
                                }}
                                disabled={!hasFreeSlots || !canAffordAtt || capacity.isExotic}
                                className="w-full py-2 bg-amber-500/20 hover:bg-amber-500 disabled:opacity-30 text-amber-300 hover:text-black border border-amber-500/50 rounded font-tech text-xs font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Instalar (-{selectedAtt?.cost ?? 100} eb)</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Sección 2: Maker: Upgrade Expertise (Armas) */}
                        <div className="pt-2 border-t border-[#1b2234] space-y-2">
                          <span className="text-[11px] font-tech text-amber-400 font-bold uppercase block flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5" /> MAKER: UPGRADE EXPERTISE (CORE PÁG. 148)
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            <div className="md:col-span-6 space-y-1">
                              <select
                                value={selectedUpgradeType}
                                onChange={(e) => setSelectedUpgradeType(e.target.value as any)}
                                className="w-full bg-[#0a0d16] border border-[#222b40] text-xs font-mono-code text-amber-400 p-2 rounded focus:outline-none"
                              >
                                {TECH_MAKER_UPGRADE_OPTIONS.filter((u) => u.targetType === 'weapon').map((u) => (
                                  <option key={u.id} value={u.id}>
                                    {u.label}
                                  </option>
                                ))}
                              </select>
                              {upgradeOption && (
                                <p className="text-[11px] font-mono-code text-slate-400 leading-tight">
                                  {upgradeOption.description} (Tiempo: {dvEntry.timeRequired} • Coste materiales: {upgradeMaterialCost} eb)
                                </p>
                              )}
                            </div>

                            <div className="md:col-span-6 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRollMakerCheck(`Mejora Maker: ${selectedUpgradeType}`, upgradeDv, 'Weaponstech')}
                                className="flex-1 py-2 bg-[#171d2b] hover:bg-[#252f44] text-slate-200 border border-[#2d3954] rounded font-tech text-xs font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Dices className="w-3.5 h-3.5 text-amber-400" />
                                <span>Tirar vs DV {upgradeDv}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  applyTechUpgradeToWeapon(selectedWeapon.instanceId, selectedUpgradeType as TechWeaponUpgradeType, upgradeMaterialCost);
                                  setTechMakerLog({
                                    action: `Mejora aplicada: ${selectedUpgradeType}`,
                                    roll: 0,
                                    dv: upgradeDv,
                                    success: true,
                                    text: `Mejora ${selectedUpgradeType} aplicada al arma ${selectedWeapon.name} (-${upgradeMaterialCost} eb).`
                                  });
                                }}
                                disabled={!canAffordUpgrade}
                                className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500 disabled:opacity-30 text-emerald-300 hover:text-black border border-emerald-500/50 rounded font-tech text-xs font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Aplicar (-{upgradeMaterialCost} eb)</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Si se seleccionó blindaje (Head o Body)
                  const isHead = selectedTechTargetId === 'headArmor';
                  const armorObj = isHead ? character.headArmor : character.bodyArmor;
                  const locationName = isHead ? 'Cabeza' : 'Torso';
                  const isUpgraded = !!armorObj.techUpgradedSp;
                  const armorMaterialCost = 100;
                  const canAffordArmor = (character.eurodollars ?? 0) >= armorMaterialCost;

                  return (
                    <div className="bg-[#101420] border border-[#1d2436] p-3.5 rounded-xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b2234] pb-2">
                        <div>
                          <span className="font-tech text-sm font-bold text-white uppercase">
                            Blindaje de {locationName}: {armorObj.name}
                          </span>
                          <span className="text-xs font-mono-code text-[#38bdf8] ml-2 font-bold">
                            SP Actual: {armorObj.currentSp} / SP Máx: {armorObj.maxSp}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded ${
                            isUpgraded ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isUpgraded ? 'REFORZADA (+1 SP TECH ACTIVO)' : 'ESTÁNDAR (SIN MEJORA TECH)'}
                        </span>
                      </div>

                      <p className="text-xs font-mono-code text-slate-300">
                        <strong>Maker: Upgrade Expertise en Armaduras (Core pág. 148):</strong> Refuerza permanentemente las placas balísticas añadiendo +1 a su SP máximo y actual. (Coste materiales: 100 eb • DV 17 • Tiempo: 1 día).
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => handleRollMakerCheck(`Mejora Blindaje (+1 SP ${locationName})`, 17, 'Basic Tech')}
                          className="py-2 px-4 bg-[#171d2b] hover:bg-[#252f44] text-slate-200 border border-[#2d3954] rounded font-tech text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Dices className="w-4 h-4 text-amber-400" />
                          <span>Tirar Chequeo Maker vs DV 17</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            applyTechUpgradeToArmor(isHead ? 'head' : 'body', !isUpgraded, !isUpgraded ? armorMaterialCost : 0);
                            setTechMakerLog({
                              action: `Blindaje ${locationName}`,
                              roll: 0,
                              dv: 17,
                              success: true,
                              text: !isUpgraded
                                ? `Blindaje de ${locationName} reforzado con éxito (+1 SP Máx y Actual, -${armorMaterialCost} eb).`
                                : `Mejora de blindaje de ${locationName} retirada (-1 SP).`
                            });
                          }}
                          disabled={!isUpgraded && !canAffordArmor}
                          className={`py-2 px-4 font-tech text-xs font-bold uppercase rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                            isUpgraded
                              ? 'bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border-red-500/40'
                              : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border-emerald-500/40 disabled:opacity-30'
                          }`}
                        >
                          <Shield className="w-4 h-4" />
                          <span>{isUpgraded ? 'Retirar Refuerzo (-1 SP)' : `Activar Refuerzo +1 SP (-${armorMaterialCost} eb)`}</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 2. GENERADOR DEL TECH ROLE-SPECIFIC LIFEPATH (CORE RULEBOOK PÁG. 55) */}
              <div className="bg-[#090b10] border border-cyan-500/40 p-4 rounded-xs space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b2234] pb-3">
                  <div>
                    <h3 className="font-tech text-base font-bold text-[#38bdf8] uppercase flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#38bdf8]" />
                      <span>TECH ROLE-SPECIFIC LIFEPATH // CORE RULEBOOK PÁG. 55 (6 TABLAS)</span>
                    </h3>
                    <p className="text-xs font-mono-code text-[#64748b]">
                      Trasfondo oficial canónico del Tech: especialidad técnica, taller, clientes, fuentes de suministros y enemigos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      for (const table of Object.values(TECH_LIFEPATH_TABLES)) {
                        const rand = table.options[Math.floor(Math.random() * table.options.length)];
                        updateRoleSpecificLifepath(table.id, rand);
                      }
                      setTechMakerLog({
                        action: 'Tirada Completa Tech Lifepath',
                        roll: 0,
                        dv: 0,
                        success: true,
                        text: 'Las 6 tablas del Tech Lifepath fueron generadas con dados oficiales.'
                      });
                    }}
                    className="px-3.5 py-1.5 bg-[#38bdf8] hover:bg-white text-black font-tech text-xs font-black uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    <span>🎲 GENERAR TRASFONDO COMPLETO DE TECH (6 TABLAS)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {Object.values(TECH_LIFEPATH_TABLES).map((tbl) => {
                    const currentVal =
                      character.lifepath?.roleSpecificLifepath?.[tbl.id] ||
                      character.lifepath?.roleLifepath?.[tbl.id] ||
                      tbl.options[0];

                    return (
                      <div key={tbl.id} className="bg-[#101420] border border-[#1e2538] p-3 rounded space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[11px] font-tech text-slate-200 font-bold block leading-tight">
                            {tbl.title}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const rand = tbl.options[Math.floor(Math.random() * tbl.options.length)];
                              updateRoleSpecificLifepath(tbl.id, rand);
                            }}
                            className="text-[10px] font-mono-code bg-[#38bdf8]/20 hover:bg-[#38bdf8] text-[#38bdf8] hover:text-black border border-[#38bdf8]/40 px-2 py-0.5 rounded font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                            title={`Tirar ${tbl.dice} en esta tabla`}
                          >
                            <Dices className="w-3 h-3" />
                            <span>Tirar {tbl.dice}</span>
                          </button>
                        </div>

                        <select
                          value={tbl.options.includes(currentVal) ? currentVal : '__custom__'}
                          onChange={(e) => {
                            if (e.target.value !== '__custom__') {
                              updateRoleSpecificLifepath(tbl.id, e.target.value);
                            }
                          }}
                          className="w-full bg-[#080a10] border border-[#222b3e] text-xs font-mono-code text-[#38bdf8] p-1.5 rounded focus:outline-none"
                        >
                          {tbl.options.map((opt, optIdx) => (
                            <option key={optIdx} value={opt}>
                              #{optIdx + 1}: {opt}
                            </option>
                          ))}
                          <option value="__custom__">-- Personalizado / Escribir abajo --</option>
                        </select>

                        <CommittedInput
                          type="text"
                          value={currentVal}
                          onCommit={(v) => updateRoleSpecificLifepath(tbl.id, v)}
                          resetKey={activeCharacterId}
                          placeholder="O escribe un trasfondo personalizado..."
                          className="w-full bg-[#07080d] border border-[#1a2133] text-white font-mono-code text-xs px-2.5 py-1 rounded focus:outline-none focus:border-[#38bdf8]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. TECH WORKBENCH // MAKER PROJECTS EXISTENTES */}
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
            </div>
          )}

          {/* HERRAMIENTAS DE ROL SOCIALES (plan 11, v4.9.3) */}
          {selectedRoleView === 'rockerboy' && <RockerboyPanel />}
          {selectedRoleView === 'fixer' && <FixerPanel />}
          {selectedRoleView === 'media' && <MediaPanel />}
          {selectedRoleView === 'exec' && <ExecPanel />}
          {selectedRoleView === 'lawman' && <LawmanPanel />}

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
                          Tirar Maniobra (REF+Skill+Moto)
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

          {/* FAMILY MOTORPOOL (Core p.162): solo Nomad */}
          {character.role === 'Nomad' && (
            <div className="bg-[#090b10] border border-[#1b2234] p-4 rounded-xs space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                <h3 className="font-tech text-sm font-bold text-[#f97316] uppercase">Motorpool familiar (Moto {nomadMotoRank})</h3>
                <span className="text-[10px] font-mono-code text-[#64748b]">Vehículos del Core hasta tu rango de Moto (Core p.162)</span>
              </div>
              {nomadTweaks2077.length > 0 && (
                <div className="text-[10px] font-mono-code text-amber-300 space-y-1">
                  {nomadTweaks2077.map((t, i) => (
                    <div key={i}>Ajuste 2077 (CEMK RB p.25): {t.textEs}</div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CORE_VEHICLES.vehicles.map(v => {
                  const minRank = coreMotorpoolMinRank(v);
                  const available = minRank <= nomadMotoRank && coreVehicleMinRooms(v) !== null;
                  return (
                    <div key={v.name} className={`bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-1.5 ${available ? '' : 'opacity-50'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-tech text-xs font-bold text-white uppercase">{v.name}</span>
                        <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded-xs bg-[#1a2030] text-[#38bdf8] font-bold">{v.category}</span>
                      </div>
                      <div className="text-[10px] font-mono-code text-[#94a3b8]">
                        SDP: <strong className="text-white">{v.sdp}</strong> • Plazas: <strong className="text-white">{v.seats}</strong> • {v.combatSpeed} ({v.narrativeSpeed}) • Core p.{v.page}
                      </div>
                      {available ? (
                        <button
                          onClick={() => handleTakeFromMotorpool(v)}
                          className="w-full py-1 bg-[#f97316]/20 hover:bg-[#f97316] text-[#f97316] hover:text-black font-tech font-bold text-[10px] uppercase rounded-xs transition-colors cursor-pointer"
                        >
                          Tomar del motorpool
                        </button>
                      ) : (
                        <div className="text-[10px] font-mono-code text-[#64748b]">Requiere Moto {minRank}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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

          {/* VEHÍCULOS GENÉRICOS DEL CORE (pp. 189-191) */}
          <div className="bg-[#090b10] border border-[#1b2234] p-4 rounded-xs space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
              <h3 className="font-tech text-sm font-bold text-white uppercase">Vehículos genéricos del Core (pp. 189-191)</h3>
              <span className="text-[10px] font-mono-code text-[#64748b]">{CORE_VEHICLES.vehicles.length} modelos</span>
            </div>
            {coreVehicleMsg && (
              <div className="p-2 bg-cyan-950/40 border border-cyan-500/50 rounded-xs text-xs font-mono-code text-cyan-200">{coreVehicleMsg}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CORE_VEHICLES.vehicles.map(v => {
                const rooms = coreVehicleMinRooms(v);
                return (
                  <div key={v.name} className="bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-tech text-xs font-bold text-white uppercase">{v.name}</span>
                        <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded-xs bg-[#1a2030] text-[#38bdf8] font-bold">{v.category}</span>
                      </div>
                      <span className="text-[10px] font-mono-code text-[#f59e0b] block mt-0.5">
                        {rooms !== null ? `${(v.costEb * rooms).toLocaleString()} €$` : `${v.costEb.toLocaleString()} €$`} • {v.costTier} • Core p.{v.page}
                      </span>
                      {v.costNote && <span className="text-[10px] font-mono-code text-[#94a3b8] block">{v.costNote}</span>}
                      <div className="text-[10px] font-mono-code text-[#94a3b8] mt-1.5">
                        SDP: <strong className="text-white">{v.sdp}</strong> • Plazas: <strong className="text-white">{v.seats}</strong> • {v.combatSpeed} ({v.narrativeSpeed})
                      </div>
                      <p className="text-[10px] font-mono-code text-[#64748b] mt-1.5 line-clamp-2">{v.description}</p>
                    </div>
                    <button
                      onClick={() => handleBuyCoreVehicle(v)}
                      disabled={rooms === null}
                      title={rooms === null ? v.costNote : undefined}
                      className="w-full py-1 bg-[#1a2030] hover:bg-[#f59e0b] hover:text-black disabled:opacity-40 disabled:cursor-not-allowed font-tech font-bold text-[10px] uppercase rounded-xs transition-colors cursor-pointer"
                    >
                      Comprar (€$)
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#1b2234] pt-3 space-y-2">
              <h4 className="font-tech text-xs font-bold text-white uppercase">Mejoras de Nomad (referencia, Core pp. 163-165)</h4>
              <p className="text-[10px] font-mono-code text-[#64748b]">{CORE_VEHICLES.upgradeCostNote}</p>
              <ul className="space-y-1">
                {CORE_VEHICLES.upgrades.map(u => (
                  <li key={u.name} className="text-[10px] font-mono-code text-[#94a3b8]">
                    <strong className="text-white">{u.name}</strong> • Moto {u.minMotoRank}+ • {u.appliesTo} • Core p.{u.page} — {u.effectEs}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
