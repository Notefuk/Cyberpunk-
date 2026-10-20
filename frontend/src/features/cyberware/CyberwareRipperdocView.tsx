import React, { useState, useMemo } from 'react';
import coreData from '../../data/core-rules.cprpack.json';
import { useCharacterStore } from '../../store/useCharacterStore';
import { calculateTherapyMaxHumanity } from '../../engine/characterEngine';
import { 
  Cpu, 
  Activity, 
  Shield, 
  Zap, 
  Sparkles, 
  AlertTriangle, 
  Heart, 
  Eye, 
  Ear, 
  Plus, 
  Trash2, 
  Search, 
  X, 
  Coins, 
  Dices, 
  Check, 
  RotateCcw, 
  Info,
  Footprints,
  Layers,
  Flame,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Binary
} from 'lucide-react';
import {
  FBC_13_BODIES,
  FBC_16_CYBERWARE,
  GOING_METAL_GEAR,
  ABOUT_FBCS_GUIDE,
  type FbcBody
} from '../../data/goingMetalFbcData';
import {
  getCyberwareCategoryTooltip
} from '../../data/weaponAndCyberwareTooltips';

export interface CyberwareItemData {
  id: string;
  name: string;
  type: string;
  install: string;
  humanityLoss: string;
  cost: number;
  description: string;
}

type AnatomicalZoneKey = 
  | 'neuralware' 
  | 'cyberarms' 
  | 'internal' 
  | 'external' 
  | 'borgware' 
  | 'cyberoptics' 
  | 'cyberaudio' 
  | 'cyberlegs' 
  | 'fashionware';

interface ZoneConfig {
  key: AnatomicalZoneKey;
  title: string;
  sub: string;
  side: 'left' | 'right' | 'bottom';
  maxSlots: number;
  icon: React.ReactNode;
  anchor: { x: number; y: number };
}

const ZONE_CONFIGS: Record<AnatomicalZoneKey, ZoneConfig> = {
  neuralware: {
    key: 'neuralware',
    title: 'FRONTAL CORTEX',
    sub: 'NEURALWARE & REFLEXOS',
    side: 'left',
    maxSlots: 4,
    icon: <Cpu className="w-4 h-4 text-[#38bdf8]" />,
    anchor: { x: 200, y: 60 }
  },
  cyberarms: {
    key: 'cyberarms',
    title: 'ARMS & HANDS',
    sub: 'CYBERARMS & POPUP WEAPONS',
    side: 'left',
    maxSlots: 4,
    icon: <Zap className="w-4 h-4 text-[#f59e0b]" />,
    anchor: { x: 85, y: 290 }
  },
  internal: {
    key: 'internal',
    title: 'SKELETON & ORGANS',
    sub: 'INTERNAL BODY CYBERWARE',
    side: 'left',
    maxSlots: 4,
    icon: <Heart className="w-4 h-4 text-[#ef4444]" />,
    anchor: { x: 185, y: 180 }
  },
  external: {
    key: 'external',
    title: 'INTEGUMENTARY SYSTEM',
    sub: 'DERMAL PLATING & WEAVES',
    side: 'left',
    maxSlots: 3,
    icon: <Shield className="w-4 h-4 text-[#00f5d4]" />,
    anchor: { x: 170, y: 260 }
  },
  borgware: {
    key: 'borgware',
    title: 'OPERATING SYSTEM',
    sub: 'BORGWARE & HEAVY FRAMES',
    side: 'right',
    maxSlots: 3,
    icon: <Layers className="w-4 h-4 text-[#e11d48]" />,
    anchor: { x: 210, y: 140 }
  },
  cyberoptics: {
    key: 'cyberoptics',
    title: 'OCULAR SUITE',
    sub: 'CYBEROPTICS & TARGETING',
    side: 'right',
    maxSlots: 4,
    icon: <Eye className="w-4 h-4 text-[#38bdf8]" />,
    anchor: { x: 222, y: 62 }
  },
  cyberaudio: {
    key: 'cyberaudio',
    title: 'AUDITORY & SENSORS',
    sub: 'CYBERAUDIO & SCANNING',
    side: 'right',
    maxSlots: 4,
    icon: <Ear className="w-4 h-4 text-[#a855f7]" />,
    anchor: { x: 242, y: 68 }
  },
  cyberlegs: {
    key: 'cyberlegs',
    title: 'LOCOMOTION & JUMP',
    sub: 'CYBERLEGS & HYDRAULICS',
    side: 'right',
    maxSlots: 4,
    icon: <Footprints className="w-4 h-4 text-[#10b981]" />,
    anchor: { x: 250, y: 520 }
  },
  fashionware: {
    key: 'fashionware',
    title: 'FASHIONWARE & BIOMONITOR',
    sub: '7 RANURAS LIBRES — 0 PÉRDIDA DE HUMANIDAD',
    side: 'bottom',
    maxSlots: 7,
    icon: <Sparkles className="w-4 h-4 text-[#f59e0b]" />,
    anchor: { x: 210, y: 350 }
  }
};

const LEG_CYBER_IDS = new Set([
  'cyberleg',
  'standard-foot',
  'grip-foot',
  'jump-booster',
  'skate-foot',
  'talon-foot',
  'web-foot'
]);

const COVERING_CYBER_IDS = new Set([
  'hardened-shielding',
  'plastic-covering',
  'realskinn-covering',
  'superchrome-covering'
]);

function itemMatchesZone(item: CyberwareItemData, zoneKey: AnatomicalZoneKey): boolean {
  if (zoneKey === 'neuralware') return item.type === 'Neuralware';
  if (zoneKey === 'cyberoptics') return item.type === 'Cyberoptics';
  if (zoneKey === 'cyberaudio') return item.type === 'Cyberaudio';
  if (zoneKey === 'internal') return item.type === 'Internal';
  if (zoneKey === 'external') return item.type === 'External';
  if (zoneKey === 'borgware') return item.type === 'Borgware';
  if (zoneKey === 'fashionware') return item.type === 'Fashionware';
  if (zoneKey === 'cyberlegs') {
    return item.type === 'Cyberlimb' && (LEG_CYBER_IDS.has(item.id) || COVERING_CYBER_IDS.has(item.id));
  }
  if (zoneKey === 'cyberarms') {
    return item.type === 'Cyberlimb' && (!LEG_CYBER_IDS.has(item.id) || COVERING_CYBER_IDS.has(item.id));
  }
  return false;
}

function parseHumanityLoss(hlStr: string, mode: 'average' | 'roll'): { amount: number; diceDesc: string; rolls: number[] } {
  if (!hlStr || hlStr.includes('0 (N/A)')) {
    return { amount: 0, diceDesc: '0 HUM', rolls: [] };
  }
  if (mode === 'average') {
    if (hlStr.includes('4d6') || hlStr.includes('(14)')) return { amount: 14, diceDesc: '4d6 (Promedio: 14)', rolls: [3, 4, 3, 4] };
    if (hlStr.includes('2d6') || hlStr.includes('(7)')) return { amount: 7, diceDesc: '2d6 (Promedio: 7)', rolls: [3, 4] };
    if (hlStr.includes('1d6/2') || hlStr.startsWith('2')) return { amount: 2, diceDesc: '1d6/2 (Promedio: 2)', rolls: [2] };
    if (hlStr.includes('1d6') || hlStr.includes('(3)')) return { amount: 3, diceDesc: '1d6 (Promedio: 3)', rolls: [3] };
    const num = parseInt(hlStr.replace(/\D/g, ''), 10) || 7;
    return { amount: num, diceDesc: `${num} HUM`, rolls: [num] };
  } else {
    if (hlStr.includes('4d6')) {
      const rolls = [1, 2, 3, 4].map(() => Math.floor(Math.random() * 6) + 1);
      const total = rolls.reduce((a, b) => a + b, 0);
      return { amount: total, diceDesc: `4d6 [${rolls.join('+')}]`, rolls };
    }
    if (hlStr.includes('2d6')) {
      const rolls = [1, 2].map(() => Math.floor(Math.random() * 6) + 1);
      const total = rolls.reduce((a, b) => a + b, 0);
      return { amount: total, diceDesc: `2d6 [${rolls.join('+')}]`, rolls };
    }
    if (hlStr.includes('1d6/2')) {
      const d = Math.floor(Math.random() * 6) + 1;
      const total = Math.max(1, Math.ceil(d / 2));
      return { amount: total, diceDesc: `1d6/2 [${d}/2 = ${total}]`, rolls: [d] };
    }
    if (hlStr.includes('1d6')) {
      const d = Math.floor(Math.random() * 6) + 1;
      return { amount: d, diceDesc: `1d6 [${d}]`, rolls: [d] };
    }
    return { amount: 7, diceDesc: '7 HUM', rolls: [7] };
  }
}

export function CyberwareRipperdocView() {
  const activeChar = useCharacterStore((state) => state.getActiveCharacter());
  const installCyberwareAdvanced = useCharacterStore((state) => state.installCyberwareAdvanced);
  const uninstallCyberware = useCharacterStore((state) => state.uninstallCyberware);
  const adjustHumanity = useCharacterStore((state) => state.adjustHumanity);
  const updateCharacterMeta = useCharacterStore((state) => state.updateCharacterMeta);
  const activateFullBodyConversion = useCharacterStore((state) => state.activateFullBodyConversion);
  const deactivateFullBodyConversion = useCharacterStore((state) => state.deactivateFullBodyConversion);

  const [hoveredZone, setHoveredZone] = useState<AnatomicalZoneKey | null>(null);
  const [selectedZone, setSelectedZone] = useState<AnatomicalZoneKey | null>(null);
  const [selectedInstalledCyber, setSelectedInstalledCyber] = useState<CyberwareItemData | null>(null);
  const [installModalZone, setInstallModalZone] = useState<AnatomicalZoneKey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hlMode, setHlMode] = useState<'average' | 'roll'>('average');
  const [diceRollPreview, setDiceRollPreview] = useState<{ [cyberId: string]: { total: number; rolls: number[]; diceDesc: string } }>({});
  const [toastFeedback, setToastFeedback] = useState<{ message: string; type: 'success' | 'warn' | 'info' } | null>(null);
  const [hoveredCategoryTooltipKey, setHoveredCategoryTooltipKey] = useState<string | null>(null);

  // GOING METAL (Full Body Conversion) State
  const [isGoingMetalOpen, setIsGoingMetalOpen] = useState(false);
  const [goingMetalTab, setGoingMetalTab] = useState<'chassis' | 'cyberware' | 'gear' | 'guide'>('chassis');
  const [fbcFilterText, setFbcFilterText] = useState('');

  const allCyberware = useMemo(() => {
    const base = (coreData.cyberware || []) as CyberwareItemData[];
    const fbcMapped: CyberwareItemData[] = FBC_16_CYBERWARE.map((fbc) => ({
      id: fbc.id,
      name: fbc.name,
      type: fbc.type,
      install: fbc.install,
      humanityLoss: fbc.humanityLoss,
      cost: fbc.cost,
      description: fbc.description
    }));
    return [...base, ...fbcMapped];
  }, []);

  const showToast = (message: string, type: 'success' | 'warn' | 'info' = 'success') => {
    setToastFeedback({ message, type });
    setTimeout(() => {
      setToastFeedback(null);
    }, 4000);
  };

  const currentHum = activeChar.currentHumanity ?? 40;
  // Core p. 230: tope de Humanidad recuperable con terapia (-2 por ciberware, -4 por borgware, 0 HL no cuenta).
  const maxHum = calculateTherapyMaxHumanity(
    activeChar.stats?.EMP || 5,
    (activeChar.installedCyberwareIds || []).map(
      (id) => (coreData.cyberware as { id: string; humanityLoss?: string; type?: string }[]).find((cw) => cw.id === id) ?? {}
    )
  );
  const effectiveEmp = Math.max(0, Math.floor(currentHum / 10));
  const isPsychosisRisk = currentHum < 20;

  const headSp = activeChar.headArmor?.currentSp || 0;
  const headMaxSp = activeChar.headArmor?.maxSp || 0;
  const bodySp = activeChar.bodyArmor?.currentSp || 0;
  const bodyMaxSp = activeChar.bodyArmor?.maxSp || 0;
  const maxDisplayedSp = Math.max(headSp, bodySp, 11);

  // Core pp. 229-230: 1 semana con un Medtech (no a sí mismo). Standard 500 €$, 2d6, DV 15; Extreme 1,000 €$, 4d6, DV 17.
  const handleTherapy = (kind: 'standard' | 'extreme' = 'standard') => {
    const cost = kind === 'extreme' ? 1000 : 500;
    const dice = kind === 'extreme' ? 4 : 2;
    const dv = kind === 'extreme' ? 17 : 15;
    if ((activeChar.eurodollars || 0) < cost) {
      showToast(`Fondos insuficientes: la terapia ${kind === 'extreme' ? 'Extreme' : 'Standard'} cuesta ${cost.toLocaleString()} €$ (Core p. 230).`, 'warn');
      return;
    }
    const rolls = Array.from({ length: dice }, () => Math.floor(Math.random() * 6) + 1);
    const recovered = rolls.reduce((a, b) => a + b, 0);
    updateCharacterMeta({ eurodollars: (activeChar.eurodollars || 0) - cost });
    adjustHumanity(recovered);
    showToast(`🧠 Terapia ${kind === 'extreme' ? 'Extreme' : 'Standard'} (1 semana, -${cost.toLocaleString()} €$, el Medtech debe superar DV ${dv}): +${recovered} HUM (${rolls.join('+')} en ${dice}d6), hasta el máximo de ${maxHum}.`, 'success');
  };

  const handleRollForCyber = (item: CyberwareItemData) => {
    const res = parseHumanityLoss(item.humanityLoss, 'roll');
    setDiceRollPreview((prev) => ({
      ...prev,
      [item.id]: {
        total: res.amount,
        rolls: res.rolls,
        diceDesc: res.diceDesc
      }
    }));
  };

  const handleInstallCyberware = (item: CyberwareItemData, free = false) => {
    let lossAmount: number;
    if (hlMode === 'roll') {
      const rolled = diceRollPreview[item.id] || parseHumanityLoss(item.humanityLoss, 'roll');
      lossAmount = rolled.total;
    } else {
      const avg = parseHumanityLoss(item.humanityLoss, 'average');
      lossAmount = avg.amount;
    }

    let armorBonus: { location: 'head' | 'body' | 'both'; sp: number } | undefined;
    if (item.id === 'subdermal-armor') {
      armorBonus = { location: 'both', sp: 11 };
    } else if (item.id === 'skin-weave') {
      armorBonus = { location: 'both', sp: 7 };
    }

    const result = installCyberwareAdvanced({
      cyberwareId: item.id,
      cyberwareName: item.name,
      humanityLossAmount: lossAmount,
      cost: item.cost,
      spendMoney: !free,
      armorSpBonus: armorBonus
    });

    if (result.success) {
      showToast(
        `💉 ${item.name} implantado con éxito (-${lossAmount} HUM${free ? ' • Sin costo' : ` • -${item.cost} €$`}).`,
        'success'
      );
    } else {
      showToast(result.message, 'warn');
    }
  };

  const handleUninstallImplant = (item: CyberwareItemData) => {
    const parsedHl = parseHumanityLoss(item.humanityLoss, 'average').amount || 7;
    uninstallCyberware(item.id, parsedHl);
    setSelectedInstalledCyber(null);
    showToast(`🔧 ${item.name} desinstalado con éxito (+${parsedHl} HUM restaurada).`, 'info');
  };

  const handleActivateChassis = (body: FbcBody) => {
    const isAlreadyFbc = Boolean(activeChar.fbcState?.isFullBodyConversion);
    const humanityCost = isAlreadyFbc ? 0 : 14;
    activateFullBodyConversion({
      id: body.id,
      name: body.name,
      bodyOverride: body.bodyOverride,
      moveOverride: body.moveOverride,
      baseArmorSp: body.baseArmorSp,
      humanityCost,
      immunities: ['Sangrado', 'Asfixia biológica', 'Toxinas y Venenos', 'Hipotermia / Presión abisal']
    });
    showToast(
      isAlreadyFbc
        ? `🔄 Biopod acoplado exitosamente al chasis ${body.name} (0 coste de Humanidad).`
        : `🦾 Conversión FBC completada con chasis ${body.name} (-${humanityCost} HUM por Biopod).`,
      'success'
    );
  };

  const handleDeactivateFbc = () => {
    deactivateFullBodyConversion();
    showToast('🔌 Chasis FBC desacoplado. Biopod en soporte vital de reserva.', 'info');
  };

  const leftZoneKeys: AnatomicalZoneKey[] = ['neuralware', 'cyberarms', 'internal', 'external'];
  const rightZoneKeys: AnatomicalZoneKey[] = ['borgware', 'cyberoptics', 'cyberaudio', 'cyberlegs'];

  const getInstalledInZone = (zoneKey: AnatomicalZoneKey) => {
    return allCyberware.filter((item) => activeChar.installedCyberwareIds.includes(item.id) && itemMatchesZone(item, zoneKey));
  };

  const renderSlotBox = (
    item: CyberwareItemData | undefined,
    slotIdx: number,
    zoneKey: AnatomicalZoneKey
  ) => {
    const isInstalled = Boolean(item);
    const zoneCfg = ZONE_CONFIGS[zoneKey];

    if (isInstalled && item) {
      const avgLoss = parseHumanityLoss(item.humanityLoss, 'average').amount;
      return (
        <button
          key={`${zoneKey}-slot-${slotIdx}`}
          onClick={() => setSelectedInstalledCyber(item)}
          className="group relative w-16 h-16 sm:w-20 sm:h-20 bg-[#12141c] hover:bg-[#1c202e] border-2 border-[#f59e0b]/80 hover:border-[#f59e0b] p-1.5 flex flex-col justify-between rounded-xs transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:shadow-[0_0_18px_rgba(245,158,11,0.5)] overflow-hidden"
          title={`${item.name} (Clic para inspeccionar / desinstalar)`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-mono-code font-bold text-[#f59e0b] uppercase tracking-tighter">
              {item.install}
            </span>
            <span className="text-[9px] font-mono-code bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] px-1 rounded-2xs font-black">
              -{avgLoss}H
            </span>
          </div>

          <div className="flex flex-col items-center justify-center my-auto">
            <div className="text-[#f59e0b] group-hover:scale-110 transition-transform">
              {zoneCfg.icon}
            </div>
            <span className="text-[10px] font-tech font-bold text-white leading-tight text-center line-clamp-1 mt-1">
              {item.name}
            </span>
          </div>

          <div className="w-full text-center">
            <span className="text-[8px] font-mono-code text-[#94a3b8] truncate block">
              {item.cost} €$
            </span>
          </div>

          {/* Chamfer corner mark */}
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#f59e0b] rotate-45 transform origin-center" />
        </button>
      );
    }

    return (
      <button
        key={`${zoneKey}-empty-${slotIdx}`}
        onClick={() => {
          setInstallModalZone(zoneKey);
          setSearchTerm('');
        }}
        className="group relative w-16 h-16 sm:w-20 sm:h-20 bg-[#0c0d12] hover:bg-[#161822] border border-dashed border-[#dc2626]/40 hover:border-[#dc2626] p-1.5 flex flex-col items-center justify-center rounded-xs transition-all cursor-pointer overflow-hidden shadow-inner"
        title="Ranura libre (Clic para instalar implante)"
      >
        <div className="w-full h-full flex flex-col items-center justify-center text-[#64748b] group-hover:text-[#dc2626] transition-colors relative">
          {/* Subtle diagonal crossed line */}
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 100 100">
            <line x1="0" y1="0" x2="100" y2="100" stroke="#dc2626" strokeWidth="1" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="#dc2626" strokeWidth="1" />
          </svg>

          <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
          <span className="text-[9px] font-tech uppercase tracking-wider font-bold mt-1 text-[#64748b] group-hover:text-white">
            VACÍO
          </span>
          <span className="text-[8px] font-mono-code text-[#475569] group-hover:text-[#dc2626]">
            + INSTALAR
          </span>
        </div>
      </button>
    );
  };

  const renderCategoryFloatingTooltip = (categoryKey: string) => {
    const cat = getCyberwareCategoryTooltip(categoryKey);
    if (!cat) return null;

    return (
      <div className="absolute left-0 top-full mt-2 z-50 w-80 sm:w-96 p-3.5 bg-[#0b0d14]/98 backdrop-blur-md border border-[#00f5d4] shadow-[0_12px_36px_rgba(0,0,0,0.95)] rounded-xs pointer-events-none text-left animate-in fade-in duration-150">
        <div className="flex items-center justify-between border-b border-[#1f2638] pb-1.5 mb-2">
          <span className="font-tech text-xs font-bold text-[#00f5d4] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
            {cat.categoryName}
          </span>
          <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 font-bold uppercase">
            {cat.installationSite}
          </span>
        </div>
        <p className="text-[11px] text-[#cbd5e1] leading-relaxed mb-2.5 font-sans">
          {cat.description}
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono-code bg-[#06080d] p-2 rounded border border-[#1a1f30]">
          <div>
            <span className="text-[#64748b] block font-bold">BASE REQUERIDO:</span>
            <span className="text-white">{cat.baseRequirement}</span>
          </div>
          <div>
            <span className="text-[#64748b] block font-bold">CAPACIDAD / SLOTS:</span>
            <span className="text-[#38bdf8]">{cat.slotsInfo}</span>
          </div>
          <div className="col-span-2 pt-1.5 border-t border-[#151926]">
            <span className="text-[#f59e0b] block font-bold">PÉRDIDA DE HUMANIDAD:</span>
            <span className="text-[#e2e8f0]">{cat.humanityLossRule}</span>
          </div>
        </div>
        {cat.keyExamples.length > 0 && (
          <div className="mt-2 text-[9px] font-mono-code text-[#94a3b8] flex items-center gap-1">
            <span className="text-[#64748b]">Ejemplos: </span>
            <span className="text-slate-300">{cat.keyExamples.join(' • ')}</span>
          </div>
        )}
      </div>
    );
  };

  const renderZoneBlock = (zoneKey: AnatomicalZoneKey) => {
    const zoneCfg = ZONE_CONFIGS[zoneKey];
    const installed = getInstalledInZone(zoneKey);
    const slots = Array.from({ length: zoneCfg.maxSlots }).map((_, i) => installed[i]);
    const isHovered = hoveredZone === zoneKey;
    const isSelected = selectedZone === zoneKey;

    return (
      <div
        key={zoneKey}
        onMouseEnter={() => setHoveredZone(zoneKey)}
        onMouseLeave={() => setHoveredZone(null)}
        onClick={() => setSelectedZone(zoneKey)}
        className={`p-3 rounded-xs border transition-all duration-200 relative bg-[#0e1017]/90 ${
          isHovered || isSelected
            ? 'border-[#00f5d4] shadow-[0_0_16px_rgba(0,245,212,0.2)] bg-[#121520]'
            : 'border-[#1e2230] hover:border-[#38bdf8]/60'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#1b1f2c] pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-2xs bg-[#171a26] border border-[#23283a]">
              {zoneCfg.icon}
            </span>
            <div 
              className="relative cursor-help"
              onMouseEnter={() => setHoveredCategoryTooltipKey(zoneKey)}
              onMouseLeave={() => setHoveredCategoryTooltipKey(null)}
            >
              <h4 className="font-tech text-xs sm:text-sm font-bold text-white tracking-wider flex items-center gap-1.5 hover:text-[#00f5d4] transition-colors">
                {zoneCfg.title}
                <Info className="w-3 h-3 text-[#64748b]" />
              </h4>
              <p className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-tighter">
                {zoneCfg.sub}
              </p>
              {hoveredCategoryTooltipKey === zoneKey && renderCategoryFloatingTooltip(zoneKey)}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-2xs bg-[#151824] border border-[#222738] text-[#94a3b8]">
              {installed.length} / {zoneCfg.maxSlots}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInstallModalZone(zoneKey);
                setSearchTerm('');
              }}
              className="px-2 py-0.5 bg-[#dc2626]/20 hover:bg-[#dc2626] text-[#dc2626] hover:text-white border border-[#dc2626]/40 text-[10px] font-tech font-bold uppercase rounded-2xs transition-colors cursor-pointer"
            >
              + Catálogo
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-start items-center">
          {slots.map((item, idx) => renderSlotBox(item, idx, zoneKey))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-12 font-sans selection:bg-[#dc2626] selection:text-white">
      {/* Toast Feedback Notification Banner */}
      {toastFeedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded border text-xs font-mono-code flex items-center gap-3 shadow-2xl animate-bounce ${
            toastFeedback.type === 'success'
              ? 'bg-[#064e3b] border-[#10b981] text-[#a7f3d0]'
              : toastFeedback.type === 'warn'
              ? 'bg-[#7f1d1d] border-[#ef4444] text-[#fecaca]'
              : 'bg-[#1e1b4b] border-[#6366f1] text-[#c7d2fe]'
          }`}
        >
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span>{toastFeedback.message}</span>
          <button
            onClick={() => setToastFeedback(null)}
            className="ml-auto text-white/70 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cyberpsychosis Warning Banner (When Humanity < 20) */}
      {isPsychosisRisk && (
        <div className="bg-[#ef4444]/15 border-2 border-[#ef4444] p-3 rounded-xs flex items-center justify-between text-white animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-[#ef4444] animate-bounce" />
            <div>
              <h3 className="font-tech text-sm font-black text-[#ef4444] tracking-widest uppercase">
                ALERTA ROJA // RIESGO INMINENTE DE CIBERPSICOSIS (HUM &lt; 20)
              </h3>
              <p className="text-xs font-mono-code text-[#fca5a5]">
                La empatía del sujeto ha colapsado a {effectiveEmp}. Los protocolos de trauma recomiendan terapia de choque inmediata o retiro de implantes.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleTherapy('extreme')}
            className="px-3 py-1.5 bg-[#ef4444] hover:bg-white text-black font-tech font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
          >
            TERAPIA EXTREME (+4d6, 1,000 €$)
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-[#0f1118] border border-[#1f2334] p-4 rounded-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#dc2626]/20 border border-[#dc2626] rounded-xs text-[#dc2626]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-tech text-lg sm:text-xl font-black text-white tracking-wider uppercase">
                RIPPERDOC CLINIC // CYBERSURGERY WORKBENCH
              </h1>
              <span className="text-[10px] font-mono-code bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 px-2 py-0.5 rounded-full font-bold">
                ESTACIÓN ACTIVA
              </span>
            </div>
            <p className="text-xs font-mono-code text-[#64748b]">
              Bio-arquitectura de implantes • Modelo anatómico oficial Cyberpunk RED • Interfaz Holo-Quirúrgica 2077
            </p>
          </div>
        </div>

        {/* Financial & Implants Stats Pill */}
        <div className="flex items-center gap-3 bg-[#141722] border border-[#222738] p-2.5 rounded-xs">
          <div className="flex items-center gap-2 pr-3 border-r border-[#262c40]">
            <Coins className="w-4 h-4 text-[#f59e0b]" />
            <div>
              <span className="text-[9px] font-mono-code text-[#94a3b8] uppercase block">Eurodólares (€$)</span>
              <span className="font-tech text-sm font-black text-[#f59e0b]">
                {activeChar.eurodollars?.toLocaleString() || 0} €$
              </span>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono-code text-[#94a3b8] uppercase block">Total Implantes</span>
            <span className="font-tech text-sm font-bold text-white">
              {activeChar.installedCyberwareIds.length} Piezas Instaladas
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GOING METAL // FULL BODY CONVERSION (13 CHASIS FBC & 16 IMPLANTES) BANNER */}
      {/* ========================================================================= */}
      <div className="bg-[#12141f] border-2 border-[#e11d48]/60 hover:border-[#e11d48] rounded-xs shadow-[0_0_20px_rgba(225,29,72,0.15)] transition-all overflow-hidden">
        <div className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#1c0f1a] via-[#12141f] to-[#1a1224]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#e11d48]/20 border border-[#e11d48] rounded-xs text-[#ff0055]">
              <Binary className="w-6 h-6" />
            </div>
            <div
              className="relative cursor-help"
              onMouseEnter={() => setHoveredCategoryTooltipKey('fbc')}
              onMouseLeave={() => setHoveredCategoryTooltipKey(null)}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-tech text-base sm:text-lg font-black text-white tracking-wider uppercase hover:text-[#00f5d4] transition-colors flex items-center gap-1.5">
                  🦾 GOING METAL // FULL BODY CONVERSION
                  <Info className="w-3.5 h-3.5 text-[#64748b]" />
                </h2>
                <span className="text-[10px] font-mono-code bg-[#e11d48]/20 text-[#ff0055] border border-[#e11d48]/40 px-2 py-0.5 rounded-full font-bold">
                  INTERFACE RED VOL. 3
                </span>
                {activeChar.fbcState?.isFullBodyConversion && (
                  <span className="text-[10px] font-mono-code bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> FBC ACTIVO: {activeChar.fbcState.activeChassisName}
                  </span>
                )}
              </div>
              <p className="text-xs font-mono-code text-[#94a3b8] mt-0.5">
                13 Cuerpos FBC Canónicos • 16 Implantes Cyborg • Regla Biopod (0 HL al intercambiar) • Manual de Campo
              </p>
              {hoveredCategoryTooltipKey === 'fbc' && renderCategoryFloatingTooltip('fbc')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeChar.fbcState?.isFullBodyConversion && (
              <button
                onClick={handleDeactivateFbc}
                className="px-3 py-1.5 bg-[#ef4444]/20 hover:bg-[#ef4444] text-[#ef4444] hover:text-white border border-[#ef4444]/40 font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer"
                title="Desconectar chasis activo y pasar Biopod a soporte vital"
              >
                🔌 DESACOPLAR BIOPOD
              </button>
            )}
            <button
              onClick={() => setIsGoingMetalOpen((prev) => !prev)}
              className="px-4 py-2 bg-[#e11d48] hover:bg-white text-white hover:text-black font-tech text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-2 shadow-[0_0_12px_rgba(225,29,72,0.4)]"
            >
              <span>{isGoingMetalOpen ? 'OCULTAR PANEL FBC' : 'ABRIR ESTACIÓN FBC'}</span>
              {isGoingMetalOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isGoingMetalOpen && (
          <div className="border-t border-[#252a3d] p-4 bg-[#0a0c12] space-y-4">
            {/* Sub-tabs Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#1f2437] pb-3">
              <button
                onClick={() => setGoingMetalTab('chassis')}
                className={`px-3.5 py-1.5 font-tech text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  goingMetalTab === 'chassis'
                    ? 'bg-[#e11d48] text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]'
                    : 'bg-[#141724] text-[#94a3b8] hover:bg-[#1f2438] hover:text-white'
                }`}
              >
                <Binary className="w-3.5 h-3.5" />
                <span>13 CHASIS FBC ({FBC_13_BODIES.length})</span>
              </button>
              <button
                onClick={() => setGoingMetalTab('cyberware')}
                className={`px-3.5 py-1.5 font-tech text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  goingMetalTab === 'cyberware'
                    ? 'bg-[#00f5d4] text-black shadow-[0_0_10px_rgba(0,245,212,0.4)]'
                    : 'bg-[#141724] text-[#94a3b8] hover:bg-[#1f2438] hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>16 CYBERWARE FBC ({FBC_16_CYBERWARE.length})</span>
              </button>
              <button
                onClick={() => setGoingMetalTab('gear')}
                className={`px-3.5 py-1.5 font-tech text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  goingMetalTab === 'gear'
                    ? 'bg-[#f59e0b] text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'bg-[#141724] text-[#94a3b8] hover:bg-[#1f2438] hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>EQUIPO ESPECIALIZADO ({GOING_METAL_GEAR.length})</span>
              </button>
              <button
                onClick={() => setGoingMetalTab('guide')}
                className={`px-3.5 py-1.5 font-tech text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  goingMetalTab === 'guide'
                    ? 'bg-[#a855f7] text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                    : 'bg-[#141724] text-[#94a3b8] hover:bg-[#1f2438] hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>GUÍA CANÓNICA "ABOUT FBCS"</span>
              </button>
            </div>

            {/* TAB 1: 13 FBC BODIES */}
            {goingMetalTab === 'chassis' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748b]" />
                    <input
                      type="text"
                      placeholder="Buscar por chasis, fabricante o función táctica..."
                      value={fbcFilterText}
                      onChange={(e) => setFbcFilterText(e.target.value)}
                      className="w-full bg-[#10131e] border border-[#22283a] focus:border-[#e11d48] text-white font-mono-code text-xs pl-9 pr-3 py-2 rounded-xs focus:outline-none"
                    />
                  </div>
                  <span className="text-xs font-mono-code text-[#64748b]">
                    Mostrando{' '}
                    {
                      FBC_13_BODIES.filter(
                        (b) =>
                          b.name.toLowerCase().includes(fbcFilterText.toLowerCase()) ||
                          b.manufacturer.toLowerCase().includes(fbcFilterText.toLowerCase()) ||
                          b.tacticalRole.toLowerCase().includes(fbcFilterText.toLowerCase())
                      ).length
                    }{' '}
                    de 13 chasis
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {FBC_13_BODIES.filter(
                    (b) =>
                      b.name.toLowerCase().includes(fbcFilterText.toLowerCase()) ||
                      b.manufacturer.toLowerCase().includes(fbcFilterText.toLowerCase()) ||
                      b.tacticalRole.toLowerCase().includes(fbcFilterText.toLowerCase())
                  ).map((chassis) => {
                    const isActive = activeChar.fbcState?.activeChassisId === chassis.id;
                    const isAlreadyFbc = Boolean(activeChar.fbcState?.isFullBodyConversion);
                    return (
                      <div
                        key={chassis.id}
                        className={`p-3.5 rounded-xs border transition-all flex flex-col justify-between ${
                          isActive
                            ? 'bg-[#1a0f1d] border-[#ff0055] shadow-[0_0_15px_rgba(255,0,85,0.25)]'
                            : 'bg-[#10131e] border-[#1f2436] hover:border-[#38bdf8]/50'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[9px] font-mono-code text-[#e11d48] font-bold block uppercase">
                                {chassis.manufacturer}
                              </span>
                              <h3 className="font-tech text-base font-black text-white leading-tight">
                                {chassis.name}
                              </h3>
                            </div>
                            <span className="text-xs font-mono-code text-[#f59e0b] font-bold whitespace-nowrap">
                              {chassis.cost.toLocaleString()} €$
                            </span>
                          </div>

                          <p className="text-[11px] font-sans text-[#94a3b8] line-clamp-2">
                            {chassis.loreDescription}
                          </p>

                          {/* Stats overrides row */}
                          <div className="grid grid-cols-3 gap-1.5 pt-1">
                            <div className="bg-[#0b0d14] border border-[#1b2030] p-1.5 rounded text-center">
                              <span className="text-[8px] font-mono-code text-[#94a3b8] block">BODY</span>
                              <span className="font-tech text-sm font-black text-[#00f5d4]">
                                {chassis.bodyOverride}
                              </span>
                            </div>
                            <div className="bg-[#0b0d14] border border-[#1b2030] p-1.5 rounded text-center">
                              <span className="text-[8px] font-mono-code text-[#94a3b8] block">MOVE</span>
                              <span className="font-tech text-sm font-black text-[#38bdf8]">
                                {chassis.moveOverride}
                              </span>
                            </div>
                            <div className="bg-[#0b0d14] border border-[#1b2030] p-1.5 rounded text-center">
                              <span className="text-[8px] font-mono-code text-[#94a3b8] block">BASE SP</span>
                              <span className="font-tech text-sm font-black text-[#f59e0b]">
                                {chassis.baseArmorSp}
                              </span>
                            </div>
                          </div>

                          {/* Built-in cyberware preview */}
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono-code text-[#64748b] block uppercase">
                              Implantes De Serie:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {chassis.builtInCyberware.slice(0, 3).map((item, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] font-mono-code bg-[#171a28] text-[#cbd5e1] px-1.5 py-0.5 rounded border border-[#23283c]"
                                >
                                  {item}
                                </span>
                              ))}
                              {chassis.builtInCyberware.length > 3 && (
                                <span className="text-[9px] font-mono-code text-[#94a3b8]">
                                  +{chassis.builtInCyberware.length - 3} más
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card action button */}
                        <div className="pt-3 mt-3 border-t border-[#1b2030]">
                          {isActive ? (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono-code text-[#10b981] font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> CHASIS EN USO
                              </span>
                              <button
                                onClick={handleDeactivateFbc}
                                className="px-2.5 py-1 bg-[#ef4444]/20 hover:bg-[#ef4444] text-[#ef4444] hover:text-white border border-[#ef4444]/40 font-tech text-[10px] font-bold uppercase rounded cursor-pointer"
                              >
                                Desacoplar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleActivateChassis(chassis)}
                              className={`w-full py-1.5 font-tech text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                                isAlreadyFbc
                                  ? 'bg-[#38bdf8] hover:bg-white text-black shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                                  : 'bg-[#e11d48] hover:bg-white text-white hover:text-black shadow-[0_0_10px_rgba(225,29,72,0.3)]'
                              }`}
                            >
                              <Binary className="w-3.5 h-3.5" />
                              <span>
                                {isAlreadyFbc
                                  ? 'TRANSFERIR BIOPOD (0 HL)'
                                  : 'CONVERTIR FBC (-14 HL)'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: 16 FBC CYBERWARE */}
            {goingMetalTab === 'cyberware' && (
              <div className="space-y-3">
                <div className="bg-[#141724] border border-[#22283a] p-3 rounded-xs text-xs font-mono-code text-[#94a3b8] flex items-center justify-between">
                  <span>
                    ⚡ Implantes canónicos de Going Metal (Interface RED Vol. 3) diseñados para chasis FBC y marcos mecánicos.
                  </span>
                  <span className="text-[#00f5d4] font-bold">{FBC_16_CYBERWARE.length} piezas disponibles</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {FBC_16_CYBERWARE.map((cyber) => {
                    const isInstalled = activeChar.installedCyberwareIds.includes(cyber.id);
                    const canAfford = (activeChar.eurodollars || 0) >= cyber.cost;
                    const parsedHl = parseHumanityLoss(cyber.humanityLoss, hlMode);
                    return (
                      <div
                        key={cyber.id}
                        className={`p-3 rounded-xs border flex flex-col justify-between ${
                          isInstalled
                            ? 'bg-[#101b22] border-[#00f5d4]/70 shadow-[0_0_12px_rgba(0,245,212,0.2)]'
                            : 'bg-[#10131e] border-[#1e2335] hover:border-[#38bdf8]/40'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[9px] font-mono-code text-[#00f5d4] uppercase font-bold">
                              {cyber.type}
                            </span>
                            <span className="text-[9px] font-mono-code bg-[#e11d48]/20 text-[#ff0055] px-1 rounded border border-[#e11d48]/40 font-bold">
                              {cyber.humanityLoss}
                            </span>
                          </div>

                          <h4 className="font-tech text-sm font-bold text-white leading-tight">
                            {cyber.name}
                          </h4>

                          <p className="text-[11px] font-sans text-[#94a3b8] line-clamp-3">
                            {cyber.description}
                          </p>

                          <div className="flex items-center justify-between text-[10px] font-mono-code text-[#64748b] pt-1">
                            <span>Instalación: {cyber.install}</span>
                            <span className="text-[#f59e0b] font-bold">{cyber.cost} €$</span>
                          </div>
                        </div>

                        <div className="pt-3 mt-2 border-t border-[#1b2030] flex gap-1.5">
                          {!isInstalled ? (
                            <>
                              <button
                                onClick={() =>
                                  handleInstallCyberware({
                                    id: cyber.id,
                                    name: cyber.name,
                                    type: cyber.type,
                                    install: cyber.install,
                                    humanityLoss: cyber.humanityLoss,
                                    cost: cyber.cost,
                                    description: cyber.description
                                  }, false)
                                }
                                disabled={!canAfford}
                                className={`flex-1 py-1.5 font-tech text-[10px] font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                                  canAfford
                                    ? 'bg-[#00f5d4] hover:bg-white text-black'
                                    : 'bg-[#1b202c] text-[#475569] cursor-not-allowed'
                                }`}
                              >
                                <Coins className="w-3 h-3" />
                                <span>PAGAR</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleInstallCyberware({
                                    id: cyber.id,
                                    name: cyber.name,
                                    type: cyber.type,
                                    install: cyber.install,
                                    humanityLoss: cyber.humanityLoss,
                                    cost: cyber.cost,
                                    description: cyber.description
                                  }, true)
                                }
                                className="px-2 py-1.5 bg-[#23293a] hover:bg-[#f59e0b] text-[#cbd5e1] hover:text-black font-tech text-[10px] font-bold uppercase rounded-xs transition-colors cursor-pointer"
                                title="Instalación gratuita (Loot de taller)"
                              >
                                GRATIS
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                handleUninstallImplant({
                                  id: cyber.id,
                                  name: cyber.name,
                                  type: cyber.type,
                                  install: cyber.install,
                                  humanityLoss: cyber.humanityLoss,
                                  cost: cyber.cost,
                                  description: cyber.description
                                })
                              }
                              className="w-full py-1.5 bg-[#ef4444]/20 hover:bg-[#ef4444] text-[#ef4444] hover:text-white border border-[#ef4444]/40 font-tech text-[10px] font-bold uppercase rounded-xs cursor-pointer"
                            >
                              DESINSTALAR (+{parsedHl.amount} HUM)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: SPECIALIZED GEAR */}
            {goingMetalTab === 'gear' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GOING_METAL_GEAR.map((gear) => (
                  <div
                    key={gear.id}
                    className="p-4 bg-[#10131e] border border-[#23293c] rounded-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-mono-code text-[#f59e0b] uppercase font-bold block">
                          {gear.category.toUpperCase()} • {gear.sourceBook.toUpperCase()}
                        </span>
                        <h3 className="font-tech text-base font-bold text-white">{gear.name}</h3>
                      </div>
                      <span className="text-xs font-mono-code text-[#f59e0b] font-bold">
                        {gear.cost.toLocaleString()} €$
                      </span>
                    </div>

                    <p className="text-xs font-sans text-[#94a3b8]">{gear.description}</p>

                    {gear.stats && (
                      <div className="bg-[#0b0d14] border border-[#1b2030] p-2.5 rounded space-y-1">
                        <span className="text-[9px] font-mono-code text-[#64748b] block uppercase">
                          Especificaciones de Campo:
                        </span>
                        {Object.entries(gear.stats).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-xs font-mono-code">
                            <span className="text-[#94a3b8] capitalize">{k}:</span>
                            <span className="text-[#00f5d4] font-bold">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: CANONICAL GUIDE "ABOUT FBCS" */}
            {goingMetalTab === 'guide' && (
              <div className="space-y-4 max-w-4xl bg-[#0e1018] border border-[#1f2436] p-4 rounded-xs">
                <div>
                  <span className="text-[10px] font-mono-code text-[#a855f7] uppercase font-bold tracking-widest block">
                    {ABOUT_FBCS_GUIDE.subtitle}
                  </span>
                  <h3 className="font-tech text-lg font-black text-white mt-1">
                    {ABOUT_FBCS_GUIDE.title}
                  </h3>
                  <p className="text-xs font-sans text-[#94a3b8] mt-2 leading-relaxed">
                    {ABOUT_FBCS_GUIDE.summary}
                  </p>
                </div>

                {/* Core principles */}
                <div className="space-y-2 pt-2 border-t border-[#1a1f30]">
                  <h4 className="font-tech text-xs font-bold text-[#00f5d4] uppercase tracking-wider">
                    Principios Fundamentales de la Conversión
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {ABOUT_FBCS_GUIDE.corePrinciples.map((p, idx) => (
                      <div key={idx} className="bg-[#090b10] border border-[#1b2030] p-2.5 rounded-xs space-y-1">
                        <span className="text-xs font-tech font-bold text-white block">{p.ruleName}</span>
                        <p className="text-[11px] font-sans text-[#94a3b8]">{p.description}</p>
                        <span className="text-[10px] font-mono-code text-[#f59e0b] block mt-1">
                          ⚡ Impacto: {p.mechanicalImpact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical & repair DVs */}
                <div className="space-y-2 pt-2 border-t border-[#1a1f30]">
                  <h4 className="font-tech text-xs font-bold text-[#f59e0b] uppercase tracking-wider">
                    DVs de Reparación y Mantenimiento de Chasis Cyborg
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {ABOUT_FBCS_GUIDE.medicalAndRepairRules.map((r, idx) => (
                      <div key={idx} className="bg-[#090b10] border border-[#1b2030] p-2 rounded-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono-code text-[#38bdf8] font-bold">
                            {r.skill}
                          </span>
                          <span className="text-[10px] font-mono-code bg-[#ef4444]/20 text-[#ef4444] px-1.5 py-0.5 rounded font-black">
                            DV {r.dv}
                          </span>
                        </div>
                        <span className="text-xs font-tech font-bold text-white block">{r.topic}</span>
                        <p className="text-[10px] font-sans text-[#94a3b8]">{r.effect}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tactical Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#1a1f30]">
                  <div className="bg-[#091410] border border-[#10b981]/40 p-3 rounded-xs space-y-1.5">
                    <span className="text-xs font-tech font-bold text-[#10b981] uppercase block">
                      Ventajas Tácticas (Pros)
                    </span>
                    <ul className="text-xs font-sans text-[#cbd5e1] space-y-1 list-disc list-inside">
                      {ABOUT_FBCS_GUIDE.tacticalProsAndCons.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#140909] border border-[#ef4444]/40 p-3 rounded-xs space-y-1.5">
                    <span className="text-xs font-tech font-bold text-[#ef4444] uppercase block">
                      Desventajas Críticas (Cons)
                    </span>
                    <ul className="text-xs font-sans text-[#cbd5e1] space-y-1 list-disc list-inside">
                      {ABOUT_FBCS_GUIDE.tacticalProsAndCons.cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CATEGORÍAS DE CIBERWARE OFICIALES // TOOLTIPS FLOTANTES CLAROS */}
      {/* ========================================================================= */}
      <div className="bg-[#0e111a] border border-[#1e2436] p-3 rounded-xs space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <span className="text-[10px] font-mono-code text-[#00f5d4] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
            CATEGORÍAS DE CIBERWARE (PASA EL MOUSE PARA VER REGLAS, SLOTS Y HUMANIDAD)
          </span>
          <span className="text-[9px] font-mono-code text-[#64748b]">
            9 CATEGORÍAS CANÓNICAS CP RED & GOING METAL
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'fashionware', label: 'Fashionware (0 HL)', icon: <Sparkles className="w-3 h-3 text-[#f59e0b]" />, color: 'border-[#f59e0b]/40 text-[#f59e0b]' },
            { key: 'neuralware', label: 'Neuralware (Neural Link)', icon: <Cpu className="w-3 h-3 text-[#38bdf8]" />, color: 'border-[#38bdf8]/40 text-[#38bdf8]' },
            { key: 'cyberoptics', label: 'Cyberoptics (Cybereye)', icon: <Eye className="w-3 h-3 text-[#38bdf8]" />, color: 'border-[#38bdf8]/40 text-[#38bdf8]' },
            { key: 'cyberaudio', label: 'Cyberaudio (Suite)', icon: <Ear className="w-3 h-3 text-[#a855f7]" />, color: 'border-[#a855f7]/40 text-[#a855f7]' },
            { key: 'internal', label: 'Internal Body', icon: <Heart className="w-3 h-3 text-[#ef4444]" />, color: 'border-[#ef4444]/40 text-[#ef4444]' },
            { key: 'external', label: 'External Body (Armor)', icon: <Shield className="w-3 h-3 text-[#00f5d4]" />, color: 'border-[#00f5d4]/40 text-[#00f5d4]' },
            { key: 'cyberlimbs', label: 'Cyberlimbs (Arms/Legs)', icon: <Zap className="w-3 h-3 text-[#f59e0b]" />, color: 'border-[#f59e0b]/40 text-[#f59e0b]' },
            { key: 'borgware', label: 'Borgware (-4 Max HL)', icon: <AlertTriangle className="w-3 h-3 text-[#e11d48]" />, color: 'border-[#e11d48]/40 text-[#ff0055]' },
            { key: 'fbc', label: 'FBC / Going Metal (-14 HL)', icon: <Binary className="w-3 h-3 text-[#e11d48]" />, color: 'border-[#e11d48]/40 text-[#ff0055]' }
          ].map((cat) => {
            const isHovered = hoveredCategoryTooltipKey === cat.key;
            return (
              <div
                key={cat.key}
                className="relative"
                onMouseEnter={() => setHoveredCategoryTooltipKey(cat.key)}
                onMouseLeave={() => setHoveredCategoryTooltipKey(null)}
              >
                <button
                  onClick={() => {
                    if (cat.key === 'fbc') {
                      setIsGoingMetalOpen(true);
                    } else if (cat.key === 'cyberlimbs') {
                      setSelectedZone('cyberarms');
                    } else {
                      setSelectedZone(cat.key as AnatomicalZoneKey);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-2xs text-[11px] font-mono-code font-bold uppercase border bg-[#121520] hover:bg-[#1a2030] transition-all flex items-center gap-1.5 cursor-pointer ${
                    cat.color
                  } ${isHovered ? 'shadow-[0_0_12px_rgba(0,245,212,0.3)] border-[#00f5d4]' : ''}`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
                {isHovered && renderCategoryFloatingTooltip(cat.key)}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-COLUMN MAIN RIPPERDOC WORKSTATION GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* COL 1: HUMANITY TOWER (xl:col-span-1) */}
        <div className="xl:col-span-1 bg-[#0d0f15] border border-[#1e2332] p-3 rounded-xs flex flex-col items-center justify-between min-h-[640px] relative overflow-hidden">
          <div className="text-center w-full">
            <span className="text-[10px] font-tech font-bold text-[#f59e0b] uppercase tracking-wider block">
              HUM
            </span>
            <span className="text-[9px] font-mono-code text-[#64748b] block">TOWER</span>
            <div className="mt-2 bg-[#ef4444]/20 border border-[#ef4444]/40 px-1 py-0.5 rounded text-center">
              <span className="font-tech text-sm font-black text-[#ef4444] block">{currentHum}</span>
              <span className="text-[8px] font-mono-code text-[#94a3b8]">/ {maxHum}</span>
            </div>
          </div>

          {/* 30-Segment Vertical Bar */}
          <div className="flex-1 w-full flex flex-col-reverse items-center justify-center gap-[3px] my-3 py-2 bg-[#08090d] rounded-xs border border-[#171922] px-1">
            {Array.from({ length: 30 }).map((_, idx) => {
              const segmentThreshold = (idx + 1) / 30;
              const ratio = currentHum / (maxHum || 1);
              const isActive = ratio >= segmentThreshold;
              const isWarning = idx < 6; // lower 20%
              return (
                <div
                  key={`hum-seg-${idx}`}
                  className={`w-full h-3 rounded-[1px] transition-all duration-300 ${
                    isActive
                      ? isWarning
                        ? 'bg-[#ef4444] shadow-[0_0_6px_#ef4444]'
                        : 'bg-[#f59e0b] shadow-[0_0_4px_rgba(245,158,11,0.6)]'
                      : 'bg-[#1b1f2b] opacity-40'
                  }`}
                />
              );
            })}
          </div>

          {/* EMP Meter & Adjustment Controls */}
          <div className="w-full space-y-2 text-center pt-1 border-t border-[#1b1f2d]">
            <div className="bg-[#12141c] p-1.5 rounded border border-[#1f2434]">
              <span className="text-[8px] font-mono-code text-[#94a3b8] uppercase block">EMP EFECTIVA</span>
              <span className="font-tech text-xs font-black text-white">
                {effectiveEmp} <span className="text-[#64748b]">/ {activeChar.stats?.EMP || 5}</span>
              </span>
            </div>

            {/* Quick Micro Adjust Buttons */}
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={() => adjustHumanity(-1)}
                className="flex-1 py-1 bg-[#1a1e2a] hover:bg-[#ef4444] text-[#94a3b8] hover:text-white rounded-xs text-[10px] font-mono-code font-bold transition-colors cursor-pointer"
                title="-1 de Humanidad"
              >
                -1
              </button>
              <button
                onClick={() => adjustHumanity(1)}
                className="flex-1 py-1 bg-[#1a1e2a] hover:bg-[#10b981] text-[#94a3b8] hover:text-white rounded-xs text-[10px] font-mono-code font-bold transition-colors cursor-pointer"
                title="+1 de Humanidad"
              >
                +1
              </button>
            </div>

            {/* Therapy Button */}
            <button
              onClick={() => handleTherapy('standard')}
              className="w-full py-1.5 bg-[#f59e0b]/20 hover:bg-[#f59e0b] border border-[#f59e0b]/50 text-[#f59e0b] hover:text-black font-tech font-bold text-[10px] uppercase rounded-xs transition-colors cursor-pointer tracking-wider flex items-center justify-center gap-1"
              title="Terapia Standard: 1 semana, 500 €$, +2d6 HUM si el Medtech supera DV 15 (Core p. 230)"
            >
              <Sparkles className="w-3 h-3" />
              <span>+TERAPIA</span>
            </button>
            <button
              onClick={() => handleTherapy('extreme')}
              className="w-full py-1.5 mt-1 bg-[#ef4444]/20 hover:bg-[#ef4444] border border-[#ef4444]/50 text-[#ef4444] hover:text-black font-tech font-bold text-[10px] uppercase rounded-xs transition-colors cursor-pointer tracking-wider flex items-center justify-center gap-1"
              title="Terapia Extreme: 1 semana, 1,000 €$, +4d6 HUM si el Medtech supera DV 17 (Core p. 230)"
            >
              <Sparkles className="w-3 h-3" />
              <span>+EXTREME</span>
            </button>
          </div>
        </div>

        {/* COL 2: 4 LEFT ANATOMICAL ZONES (xl:col-span-3) */}
        <div className="xl:col-span-3 space-y-3">
          {leftZoneKeys.map((key) => renderZoneBlock(key))}
        </div>

        {/* COL 3: CENTRAL HOLOGRAPHIC BODY SVG & CALLOUTS (xl:col-span-4) */}
        <div className="xl:col-span-4 bg-[#090b10] border border-[#1a1e2c] p-2 rounded-xs flex flex-col items-center justify-center relative min-h-[640px] overflow-hidden shadow-2xl">
          {/* Hologram Reticle Background Grid & Radar circles */}
          <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f5d4]/5 to-transparent pointer-events-none" />

          {/* Hologram Header Watermark */}
          <div className="absolute top-3 left-3 text-left pointer-events-none z-10">
            <span className="text-[10px] font-tech text-[#00f5d4] uppercase tracking-widest block font-bold">
              BIOMETRIC HOLO-PROJECTION
            </span>
            <span className="text-[8px] font-mono-code text-[#475569] block">
              STATUS: {activeChar.handle.toUpperCase()} // SCAN v4.2
            </span>
            {activeChar.fbcState?.isFullBodyConversion && (
              <div className="mt-1 flex items-center gap-1.5 bg-[#e11d48]/25 border border-[#e11d48] px-2 py-0.5 rounded text-[9px] font-mono-code text-[#ff0055] font-black">
                <span>🦾 FBC ACTIVO:</span>
                <span className="text-white">{activeChar.fbcState.activeChassisName || 'Chasis Borg'}</span>
                <span className="text-[#00f5d4]">BODY {activeChar.fbcState.bodyOverride || activeChar.stats?.BODY}</span>
                <span className="text-[#f59e0b]">SP {activeChar.fbcState.baseArmorSp || 0}</span>
              </div>
            )}
          </div>

          <div className="absolute top-3 right-3 text-right pointer-events-none z-10">
            <span className="text-[9px] font-mono-code text-[#f59e0b] font-bold block">
              {hoveredZone ? ZONE_CONFIGS[hoveredZone].title : 'SELECCIONA ZONA'}
            </span>
            <span className="text-[8px] font-mono-code text-[#64748b] block">
              {hoveredZone ? `${getInstalledInZone(hoveredZone).length} IMPLANTES` : 'CLICK EN PARTE'}
            </span>
          </div>

          {/* Central High-Tech Vector Holographic Body */}
          <svg
            viewBox="0 0 420 680"
            className="w-full h-auto max-h-[620px] select-none cursor-crosshair z-0"
          >
            <defs>
              <linearGradient id="holoGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00f5d4" stopOpacity="0.1" />
              </linearGradient>

              <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00f5d4" strokeWidth="0.5" strokeOpacity="0.1" />
              </pattern>
            </defs>

            {/* Background grid cylinder */}
            <circle cx="210" cy="340" r="180" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 6" opacity="0.4" />
            <circle cx="210" cy="340" r="120" fill="none" stroke="#00f5d4" strokeWidth="0.8" strokeDasharray="4 8" opacity="0.2" />

            {/* --- CALLOUT LINES WITH ANIMATED PARTICLES & ARROWS --- */}
            {/* Callout 1: Cranium -> Left Neuralware */}
            <g
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHoveredZone('neuralware')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('neuralware')}
            >
              <path
                d="M 200 60 L 90 60 L 15 70"
                fill="none"
                stroke={hoveredZone === 'neuralware' ? '#38bdf8' : '#273549'}
                strokeWidth={hoveredZone === 'neuralware' ? '2.5' : '1.2'}
                strokeDasharray={hoveredZone === 'neuralware' ? '6 3' : 'none'}
              />
              <circle cx="200" cy="60" r="4" fill="#38bdf8" />
              <circle cx="15" cy="70" r="3" fill="#38bdf8" />
            </g>

            {/* Callout 2: Arms -> Left Cyberarms */}
            <g
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHoveredZone('cyberarms')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('cyberarms')}
            >
              <path
                d="M 85 290 L 40 290 L 15 230"
                fill="none"
                stroke={hoveredZone === 'cyberarms' ? '#f59e0b' : '#273549'}
                strokeWidth={hoveredZone === 'cyberarms' ? '2.5' : '1.2'}
                strokeDasharray={hoveredZone === 'cyberarms' ? '6 3' : 'none'}
              />
              <circle cx="85" cy="290" r="4" fill="#f59e0b" />
              <circle cx="15" cy="230" r="3" fill="#f59e0b" />
            </g>

            {/* Callout 3: Internal -> Left Skeleton & Internal */}
            <g
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHoveredZone('internal')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('internal')}
            >
              <path
                d="M 185 180 L 110 180 L 15 390"
                fill="none"
                stroke={hoveredZone === 'internal' ? '#ef4444' : '#273549'}
                strokeWidth={hoveredZone === 'internal' ? '2.5' : '1.2'}
                strokeDasharray={hoveredZone === 'internal' ? '6 3' : 'none'}
              />
              <circle cx="185" cy="180" r="4" fill="#ef4444" />
              <circle cx="15" cy="390" r="3" fill="#ef4444" />
            </g>

            {/* Callout 4: Integumentary -> Left External */}
            <g
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHoveredZone('external')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('external')}
            >
              <path
                d="M 170 260 L 90 260 L 15 550"
                fill="none"
                stroke={hoveredZone === 'external' ? '#00f5d4' : '#273549'}
                strokeWidth={hoveredZone === 'external' ? '2.5' : '1.2'}
                strokeDasharray={hoveredZone === 'external' ? '6 3' : 'none'}
              />
              <circle cx="170" cy="260" r="4" fill="#00f5d4" />
              <circle cx="15" cy="550" r="3" fill="#00f5d4" />
            </g>

            {/* Callout 5: Spine OS -> Right Borgware */}
            <g
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHoveredZone('borgware')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('borgware')}
            >
              <path
                d="M 210 140 L 320 140 L 405 70"
                fill="none"
                stroke={hoveredZone === 'borgware' ? '#e11d48' : '#273549'}
                strokeWidth={hoveredZone === 'borgware' ? '2.5' : '1.2'}
                strokeDasharray={hoveredZone === 'borgware' ? '6 3' : 'none'}
              />
              <circle cx="210" cy="140" r="4" fill="#e11d48" />
              <circle cx="405" cy="70" r="3" fill="#e11d48" />
            </g>

            {/* Callout 6: Eyes -> Right Cyberoptics */}
            <g
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHoveredZone('cyberoptics')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('cyberoptics')}
            >
              <path
                d="M 222 62 L 340 62 L 405 230"
                fill="none"
                stroke={hoveredZone === 'cyberoptics' ? '#38bdf8' : '#273549'}
                strokeWidth={hoveredZone === 'cyberoptics' ? '2.5' : '1.2'}
                strokeDasharray={hoveredZone === 'cyberoptics' ? '6 3' : 'none'}
              />
              <circle cx="222" cy="62" r="4" fill="#38bdf8" />
              <circle cx="405" cy="230" r="3" fill="#38bdf8" />
            </g>

            {/* Callout 7: Audio -> Right Cyberaudio */}
            <g
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHoveredZone('cyberaudio')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('cyberaudio')}
            >
              <path
                d="M 242 68 L 350 68 L 405 390"
                fill="none"
                stroke={hoveredZone === 'cyberaudio' ? '#a855f7' : '#273549'}
                strokeWidth={hoveredZone === 'cyberaudio' ? '2.5' : '1.2'}
                strokeDasharray={hoveredZone === 'cyberaudio' ? '6 3' : 'none'}
              />
              <circle cx="242" cy="68" r="4" fill="#a855f7" />
              <circle cx="405" cy="390" r="3" fill="#a855f7" />
            </g>

            {/* Callout 8: Legs -> Right Cyberlegs */}
            <g
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHoveredZone('cyberlegs')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('cyberlegs')}
            >
              <path
                d="M 250 520 L 350 520 L 405 550"
                fill="none"
                stroke={hoveredZone === 'cyberlegs' ? '#10b981' : '#273549'}
                strokeWidth={hoveredZone === 'cyberlegs' ? '2.5' : '1.2'}
                strokeDasharray={hoveredZone === 'cyberlegs' ? '6 3' : 'none'}
              />
              <circle cx="250" cy="520" r="4" fill="#10b981" />
              <circle cx="405" cy="550" r="3" fill="#10b981" />
            </g>

            {/* --- ANATOMICAL VECTOR HUMAN BODY (A-POSE) --- */}
            {/* Silhouette Outline Base */}
            <g opacity="0.3" stroke="#00f5d4" strokeWidth="1" fill="none">
              {/* Head contour */}
              <circle cx="210" cy="65" r="26" />
              {/* Torso & hips */}
              <path d="M 175 125 L 245 125 L 240 310 L 180 310 Z" />
              {/* Legs */}
              <path d="M 185 320 L 175 480 L 165 620 L 155 640" />
              <path d="M 235 320 L 245 480 L 255 620 L 265 640" />
              {/* Arms */}
              <path d="M 175 130 L 110 240 L 75 350" />
              <path d="M 245 130 L 310 240 L 345 350" />
            </g>

            {/* Head & Cranium (Neuralware & Optics layer) */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('neuralware')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('neuralware')}
            >
              <ellipse
                cx="210"
                cy="65"
                rx="24"
                ry="28"
                fill={hoveredZone === 'neuralware' ? '#0284c7' : '#0f172a'}
                fillOpacity="0.6"
                stroke={hoveredZone === 'neuralware' ? '#38bdf8' : '#00f5d4'}
                strokeWidth={hoveredZone === 'neuralware' ? '2.5' : '1.5'}
                filter={hoveredZone === 'neuralware' ? 'url(#neonFilter)' : undefined}
              />
              {/* Brain Neural Grid Mesh */}
              <path
                d="M 196 55 Q 210 45 224 55 M 194 65 Q 210 58 226 65 M 198 75 Q 210 70 222 75"
                stroke={hoveredZone === 'neuralware' ? '#38bdf8' : '#38bdf8'}
                strokeWidth="1"
                fill="none"
                opacity="0.8"
              />
            </g>

            {/* Cyberoptics Eyes */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('cyberoptics')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('cyberoptics')}
            >
              <circle
                cx="202"
                cy="62"
                r="3.5"
                fill="#38bdf8"
                filter={hoveredZone === 'cyberoptics' ? 'url(#neonFilter)' : undefined}
              />
              <circle
                cx="218"
                cy="62"
                r="3.5"
                fill="#38bdf8"
                filter={hoveredZone === 'cyberoptics' ? 'url(#neonFilter)' : undefined}
              />
              <line x1="195" y1="62" x2="225" y2="62" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="1 2" />
            </g>

            {/* Cyberaudio Ear Nodes */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('cyberaudio')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('cyberaudio')}
            >
              <rect
                x="184"
                y="63"
                width="3"
                height="8"
                rx="1"
                fill="#a855f7"
                filter={hoveredZone === 'cyberaudio' ? 'url(#neonFilter)' : undefined}
              />
              <rect
                x="233"
                y="63"
                width="3"
                height="8"
                rx="1"
                fill="#a855f7"
                filter={hoveredZone === 'cyberaudio' ? 'url(#neonFilter)' : undefined}
              />
            </g>

            {/* Cervical Neck & Borgware Spine Core */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('borgware')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('borgware')}
            >
              <path
                d="M 204 93 L 216 93 L 220 125 L 200 125 Z"
                fill={hoveredZone === 'borgware' ? '#991b1b' : '#1e293b'}
                stroke={hoveredZone === 'borgware' ? '#e11d48' : '#00f5d4'}
                strokeWidth="1.2"
              />
              {/* Borgware Spine Vertebrae */}
              {Array.from({ length: 10 }).map((_, i) => (
                <rect
                  key={`vert-${i}`}
                  x="207"
                  y={130 + i * 14}
                  width="6"
                  height="8"
                  rx="1"
                  fill={hoveredZone === 'borgware' ? '#e11d48' : '#00f5d4'}
                  opacity={hoveredZone === 'borgware' ? 0.9 : 0.6}
                />
              ))}
            </g>

            {/* Thorax / Ribcage (Internal Cyberware & Heart Core) */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('internal')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('internal')}
            >
              {/* Rib arcs */}
              <path
                d="M 185 145 C 165 160 165 195 185 210 M 235 145 C 255 160 255 195 235 210"
                fill="none"
                stroke={hoveredZone === 'internal' ? '#ef4444' : '#00f5d4'}
                strokeWidth={hoveredZone === 'internal' ? '2.5' : '1.2'}
                filter={hoveredZone === 'internal' ? 'url(#neonFilter)' : undefined}
              />
              {/* Biomonitor Heart Core */}
              <circle
                cx="217"
                cy="165"
                r="6"
                fill="#ef4444"
                className="animate-ping origin-center"
                opacity="0.75"
              />
              <circle cx="217" cy="165" r="4.5" fill="#ef4444" />
            </g>

            {/* External Integumentary Armor Grid (Dermal Shield) */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('external')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('external')}
            >
              <path
                d="M 175 225 L 245 225 L 235 305 L 185 305 Z"
                fill={hoveredZone === 'external' ? '#00f5d4' : '#0f172a'}
                fillOpacity={hoveredZone === 'external' ? '0.25' : '0.1'}
                stroke={hoveredZone === 'external' ? '#00f5d4' : '#334155'}
                strokeWidth={hoveredZone === 'external' ? '2' : '1'}
                strokeDasharray="4 2"
              />
              {/* Dermal plating hexagons */}
              <circle cx="195" cy="250" r="4" fill="none" stroke="#00f5d4" strokeWidth="0.8" />
              <circle cx="225" cy="250" r="4" fill="none" stroke="#00f5d4" strokeWidth="0.8" />
              <circle cx="210" cy="275" r="4" fill="none" stroke="#00f5d4" strokeWidth="0.8" />
            </g>

            {/* Left & Right Cyberarms */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('cyberarms')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('cyberarms')}
            >
              {/* Left Cyberarm (A-Pose) */}
              <path
                d="M 175 130 L 115 220 L 75 340"
                fill="none"
                stroke={hoveredZone === 'cyberarms' ? '#f59e0b' : '#00f5d4'}
                strokeWidth={hoveredZone === 'cyberarms' ? '4' : '2'}
                filter={hoveredZone === 'cyberarms' ? 'url(#neonFilter)' : undefined}
              />
              <circle cx="175" cy="130" r="5" fill="#f59e0b" />
              <circle cx="115" cy="220" r="4" fill="#f59e0b" />
              <rect x="68" y="338" width="14" height="20" rx="3" fill="#f59e0b" opacity="0.8" />

              {/* Right Arm */}
              <path
                d="M 245 130 L 305 220 L 345 340"
                fill="none"
                stroke={hoveredZone === 'cyberarms' ? '#f59e0b' : '#00f5d4'}
                strokeWidth={hoveredZone === 'cyberarms' ? '4' : '2'}
                filter={hoveredZone === 'cyberarms' ? 'url(#neonFilter)' : undefined}
              />
              <circle cx="245" cy="130" r="5" fill="#f59e0b" />
              <circle cx="305" cy="220" r="4" fill="#f59e0b" />
              <rect x="338" y="338" width="14" height="20" rx="3" fill="#f59e0b" opacity="0.8" />
            </g>

            {/* Pelvis and Hips */}
            <polygon
              points="180,310 240,310 225,355 195,355"
              fill="#111827"
              stroke="#00f5d4"
              strokeWidth="1.2"
            />

            {/* Left & Right Cyberlegs */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('cyberlegs')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone('cyberlegs')}
            >
              {/* Left leg */}
              <path
                d="M 195 355 L 180 480 L 170 615"
                fill="none"
                stroke={hoveredZone === 'cyberlegs' ? '#10b981' : '#00f5d4'}
                strokeWidth={hoveredZone === 'cyberlegs' ? '4' : '2'}
                filter={hoveredZone === 'cyberlegs' ? 'url(#neonFilter)' : undefined}
              />
              <circle cx="195" cy="355" r="5" fill="#10b981" />
              <circle cx="180" cy="480" r="4.5" fill="#10b981" />
              <circle cx="170" cy="615" r="4" fill="#10b981" />
              <path d="M 160 615 L 175 615 L 180 635 L 155 635 Z" fill="#10b981" opacity="0.8" />

              {/* Right leg */}
              <path
                d="M 225 355 L 240 480 L 250 615"
                fill="none"
                stroke={hoveredZone === 'cyberlegs' ? '#10b981' : '#00f5d4'}
                strokeWidth={hoveredZone === 'cyberlegs' ? '4' : '2'}
                filter={hoveredZone === 'cyberlegs' ? 'url(#neonFilter)' : undefined}
              />
              <circle cx="225" cy="355" r="5" fill="#10b981" />
              <circle cx="240" cy="480" r="4.5" fill="#10b981" />
              <circle cx="250" cy="615" r="4" fill="#10b981" />
              <path d="M 245 615 L 260 615 L 265 635 L 240 635 Z" fill="#10b981" opacity="0.8" />
            </g>
          </svg>

          {/* Quick Zone Legend Chips */}
          <div className="w-full flex flex-wrap justify-center gap-1.5 pt-2 border-t border-[#1e2332] z-10">
            {Object.entries(ZONE_CONFIGS)
              .filter(([k]) => k !== 'fashionware')
              .map(([key, cfg]) => {
                const count = getInstalledInZone(key as AnatomicalZoneKey).length;
                return (
                  <button
                    key={`chip-${key}`}
                    onClick={() => {
                      setSelectedZone(key as AnatomicalZoneKey);
                      setInstallModalZone(key as AnatomicalZoneKey);
                    }}
                    onMouseEnter={() => setHoveredZone(key as AnatomicalZoneKey)}
                    onMouseLeave={() => setHoveredZone(null)}
                    className={`text-[9px] font-mono-code px-2 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                      hoveredZone === key
                        ? 'bg-[#00f5d4]/20 border-[#00f5d4] text-white shadow-[0_0_8px_rgba(0,245,212,0.4)]'
                        : 'bg-[#121520] border-[#202638] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    <span>{cfg.title.split(' ')[0]}</span>
                    <span className="font-bold text-white">({count})</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* COL 4: 4 RIGHT ANATOMICAL ZONES (xl:col-span-3) */}
        <div className="xl:col-span-3 space-y-3">
          {rightZoneKeys.map((key) => renderZoneBlock(key))}
        </div>

        {/* COL 5: ARMOR SP & STATS TOWER (xl:col-span-1) */}
        <div className="xl:col-span-1 bg-[#0d0f15] border border-[#1e2332] p-3 rounded-xs flex flex-col items-center justify-between min-h-[640px] relative overflow-hidden">
          <div className="text-center w-full">
            <span className="text-[10px] font-tech font-bold text-[#00f5d4] uppercase tracking-wider block">
              ARMOR
            </span>
            <span className="text-[9px] font-mono-code text-[#64748b] block">SP TOWER</span>
            <div className="mt-2 bg-[#00f5d4]/20 border border-[#00f5d4]/40 px-1 py-0.5 rounded text-center">
              <span className="font-tech text-sm font-black text-[#00f5d4] block">{maxDisplayedSp}</span>
              <span className="text-[8px] font-mono-code text-[#94a3b8]">MAX SP</span>
            </div>
          </div>

          {/* 30-Segment Cyan Tower */}
          <div className="flex-1 w-full flex flex-col-reverse items-center justify-center gap-[3px] my-3 py-2 bg-[#08090d] rounded-xs border border-[#171922] px-1">
            {Array.from({ length: 30 }).map((_, idx) => {
              const segTarget = (idx + 1) * (18 / 30);
              const isActive = maxDisplayedSp >= segTarget;
              return (
                <div
                  key={`sp-seg-${idx}`}
                  className={`w-full h-3 rounded-[1px] transition-all duration-300 ${
                    isActive
                      ? 'bg-[#00f5d4] shadow-[0_0_6px_rgba(0,245,212,0.8)]'
                      : 'bg-[#132227] opacity-40'
                  }`}
                />
              );
            })}
          </div>

          {/* Armor & Body Metrics Breakdown */}
          <div className="w-full space-y-2 text-center pt-1 border-t border-[#1b1f2d]">
            <div className="bg-[#12141c] p-1.5 rounded border border-[#1f2434] text-left">
              <span className="text-[8px] font-mono-code text-[#94a3b8] uppercase block">HEAD SP</span>
              <span className="font-tech text-xs font-black text-[#00f5d4]">
                {headSp} <span className="text-[9px] text-[#64748b]">/ {headMaxSp}</span>
              </span>
            </div>

            <div className="bg-[#12141c] p-1.5 rounded border border-[#1f2434] text-left">
              <span className="text-[8px] font-mono-code text-[#94a3b8] uppercase block">BODY SP</span>
              <span className="font-tech text-xs font-black text-[#00f5d4]">
                {bodySp} <span className="text-[9px] text-[#64748b]">/ {bodyMaxSp}</span>
              </span>
            </div>

            <div className="bg-[#12141c] p-1.5 rounded border border-[#1f2434] text-left">
              <span className="text-[8px] font-mono-code text-[#94a3b8] uppercase block">BODY STAT</span>
              <span className="font-tech text-xs font-black text-white">
                {activeChar.stats?.BODY || 6}
              </span>
            </div>

            <div className="bg-[#12141c] p-1.5 rounded border border-[#1f2434] text-left">
              <span className="text-[8px] font-mono-code text-[#94a3b8] uppercase block">IMPLANTES</span>
              <span className="font-tech text-xs font-bold text-[#f59e0b]">
                {activeChar.installedCyberwareIds.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR: FASHIONWARE & BIOMONITOR (7 Ranuras Libres — 0 Pérdida de Humanidad) */}
      <div className="bg-[#0e1017] border border-[#23283a] p-4 rounded-xs shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b1f2e] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f59e0b]" />
            <div>
              <h3 className="font-tech text-sm font-bold text-white tracking-wider uppercase">
                {ZONE_CONFIGS.fashionware.title}
              </h3>
              <p className="text-[11px] font-mono-code text-[#64748b]">
                {ZONE_CONFIGS.fashionware.sub} • Cosméticos y utilitarios corporales de calle
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setInstallModalZone('fashionware');
              setSearchTerm('');
            }}
            className="px-3 py-1 bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black border border-[#f59e0b]/50 text-xs font-tech font-bold uppercase rounded-xs transition-colors cursor-pointer"
          >
            + Ver Catálogo Fashionware
          </button>
        </div>

        {/* 7 Fashionware Slots */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {(() => {
            const installedFashion = getInstalledInZone('fashionware');
            return Array.from({ length: 7 }).map((_, idx) => {
              const item = installedFashion[idx];
              return renderSlotBox(item, idx, 'fashionware');
            });
          })()}
        </div>
      </div>

      {/* --- MODAL 1: INSPECTION & UNINSTALL IMPLANT DRAWER --- */}
      {selectedInstalledCyber && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10121a] border-2 border-[#f59e0b] rounded-xs max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#202538] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#f59e0b]/20 border border-[#f59e0b] rounded-xs text-[#f59e0b]">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 bg-[#f59e0b]/20 text-[#f59e0b] rounded font-bold">
                      {selectedInstalledCyber.type}
                    </span>
                    <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 bg-[#1e2334] text-[#94a3b8] rounded">
                      Clínica: {selectedInstalledCyber.install}
                    </span>
                  </div>
                  <h2 className="font-tech text-xl font-bold text-white mt-1">
                    {selectedInstalledCyber.name}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedInstalledCyber(null)}
                className="text-[#64748b] hover:text-white p-1 rounded hover:bg-[#1a1f2e] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#141724] p-3 rounded border border-[#22273a] text-center">
                <span className="text-[10px] font-mono-code text-[#94a3b8] block uppercase">Pérdida Humanidad</span>
                <span className="font-tech text-base font-black text-[#ef4444]">
                  {selectedInstalledCyber.humanityLoss}
                </span>
              </div>
              <div className="bg-[#141724] p-3 rounded border border-[#22273a] text-center">
                <span className="text-[10px] font-mono-code text-[#94a3b8] block uppercase">Precio Mercado</span>
                <span className="font-tech text-base font-black text-[#f59e0b]">
                  {selectedInstalledCyber.cost} €$
                </span>
              </div>
              <div className="bg-[#141724] p-3 rounded border border-[#22273a] text-center">
                <span className="text-[10px] font-mono-code text-[#94a3b8] block uppercase">Estado Cirugía</span>
                <span className="font-tech text-base font-bold text-[#10b981]">
                  INSTALADO
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#0b0d13] p-4 rounded border border-[#1d2232] mb-6">
              <h4 className="text-[11px] font-tech text-[#38bdf8] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                <Info className="w-3.5 h-3.5" /> REGLAS Y FUNCIONAMIENTO OFICIAL
              </h4>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {selectedInstalledCyber.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#1e2334]">
              <button
                onClick={() => setSelectedInstalledCyber(null)}
                className="px-4 py-2 bg-[#1b1f2d] hover:bg-[#252b3e] text-[#94a3b8] hover:text-white font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer"
              >
                Cerrar Ventana
              </button>
              <button
                onClick={() => handleUninstallImplant(selectedInstalledCyber)}
                className="px-5 py-2.5 bg-[#ef4444] hover:bg-white text-black font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-2 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
              >
                <Trash2 className="w-4 h-4" />
                <span>DESINSTALAR IMPLANTE (+Recuperar Humanidad)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: RIPPERDOC INSTALLATION CATALOG MODAL --- */}
      {installModalZone && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="bg-[#0e1017] border-2 border-[#00f5d4] rounded-xs max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#121520] border-b border-[#202638] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#00f5d4]/20 border border-[#00f5d4] rounded text-[#00f5d4]">
                  {ZONE_CONFIGS[installModalZone].icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-code bg-[#00f5d4]/20 text-[#00f5d4] px-2 py-0.5 rounded font-bold uppercase">
                      CATÁLOGO QUIRÚRGICO OFICIAL
                    </span>
                    <span className="text-[10px] font-mono-code text-[#64748b]">
                      RANURAS: {getInstalledInZone(installModalZone).length} / {ZONE_CONFIGS[installModalZone].maxSlots}
                    </span>
                  </div>
                  <h2 className="font-tech text-lg sm:text-xl font-black text-white uppercase tracking-wider mt-0.5">
                    {ZONE_CONFIGS[installModalZone].title} // {ZONE_CONFIGS[installModalZone].sub}
                  </h2>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setInstallModalZone(null)}
                className="text-[#64748b] hover:text-white p-1.5 rounded hover:bg-[#1a1f2e] cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filter Bar, Humanity Mode & Balance Info */}
            <div className="bg-[#151824] border-b border-[#22283a] p-3 flex flex-wrap items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar implante por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0b0d13] border border-[#272e42] focus:border-[#00f5d4] rounded-xs pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#475569] font-sans focus:outline-none"
                />
              </div>

              {/* Humanity Mode Toggle */}
              <div className="flex items-center gap-2 bg-[#0c0e14] p-1 rounded-xs border border-[#202538]">
                <span className="text-[10px] font-mono-code text-[#94a3b8] px-2 uppercase font-bold">
                  MODO HL:
                </span>
                <button
                  onClick={() => setHlMode('average')}
                  className={`px-2.5 py-1 text-[10px] font-tech font-bold uppercase rounded-xs transition-colors cursor-pointer ${
                    hlMode === 'average'
                      ? 'bg-[#38bdf8] text-black font-black'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  PROMEDIO
                </button>
                <button
                  onClick={() => setHlMode('roll')}
                  className={`px-2.5 py-1 text-[10px] font-tech font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    hlMode === 'roll'
                      ? 'bg-[#f59e0b] text-black font-black'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <Dices className="w-3 h-3" />
                  <span>TIRAR DADOS</span>
                </button>
              </div>

              {/* Character funds preview */}
              <div className="flex items-center gap-3 bg-[#0c0e14] px-3 py-1 rounded-xs border border-[#202538]">
                <div className="flex items-center gap-1 text-[#f59e0b]">
                  <Coins className="w-3.5 h-3.5" />
                  <span className="font-tech text-xs font-bold">
                    {activeChar.eurodollars?.toLocaleString() || 0} €$
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#ef4444] border-l border-[#202538] pl-3">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="font-tech text-xs font-bold">
                    {currentHum} HUM
                  </span>
                </div>
              </div>
            </div>

            {/* Catalog Items List Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[58vh]">
              {(() => {
                const zoneItems = allCyberware.filter(
                  (item) =>
                    itemMatchesZone(item, installModalZone) &&
                    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.description.toLowerCase().includes(searchTerm.toLowerCase()))
                );

                if (zoneItems.length === 0) {
                  return (
                    <div className="text-center py-12 text-[#64748b]">
                      <Cpu className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-tech text-sm uppercase tracking-wider">
                        No se encontraron implantes para los filtros especificados.
                      </p>
                    </div>
                  );
                }

                return zoneItems.map((item) => {
                  const isInstalled = activeChar.installedCyberwareIds.includes(item.id);
                  const canAfford = (activeChar.eurodollars || 0) >= item.cost;
                  const rollPreview = diceRollPreview[item.id];
                  const lossPreview =
                    hlMode === 'roll' && rollPreview
                      ? rollPreview.total
                      : parseHumanityLoss(item.humanityLoss, 'average').amount;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xs border transition-all ${
                        isInstalled
                          ? 'bg-[#151922]/80 border-[#10b981]/60'
                          : 'bg-[#10131c] hover:bg-[#141824] border-[#1e2334] hover:border-[#00f5d4]/50'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Item Details */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-tech text-base font-bold text-white">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#1e2334] text-[#94a3b8] uppercase">
                              {item.type}
                            </span>
                            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#16222f] text-[#38bdf8] uppercase">
                              Clínica: {item.install}
                            </span>
                            {isInstalled && (
                              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] font-bold uppercase flex items-center gap-1">
                                <Check className="w-3 h-3" /> YA INSTALADO
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-2">
                            {item.description}
                          </p>

                          {/* Armor bonus indicator if applicable */}
                          {item.id === 'subdermal-armor' && (
                            <div className="mt-1 text-[11px] font-mono-code text-[#00f5d4] flex items-center gap-1 font-bold">
                              <Shield className="w-3.5 h-3.5" /> Otorga Blindaje SP 11 a Cabeza y Cuerpo de forma permanente.
                            </div>
                          )}
                          {item.id === 'skin-weave' && (
                            <div className="mt-1 text-[11px] font-mono-code text-[#00f5d4] flex items-center gap-1 font-bold">
                              <Shield className="w-3.5 h-3.5" /> Otorga Blindaje SP 7 a Cabeza y Cuerpo con auto-reparación.
                            </div>
                          )}
                        </div>

                        {/* Cost & Humanity Loss Badges */}
                        <div className="flex items-center gap-3">
                          {/* Cost */}
                          <div className="bg-[#090b10] px-3 py-1.5 rounded border border-[#1b2030] text-center min-w-[80px]">
                            <span className="text-[9px] font-mono-code text-[#64748b] block uppercase">Precio</span>
                            <span className="font-tech text-sm font-black text-[#f59e0b]">
                              {item.cost} €$
                            </span>
                          </div>

                          {/* Humanity Loss */}
                          <div className="bg-[#090b10] px-3 py-1.5 rounded border border-[#1b2030] text-center min-w-[90px]">
                            <span className="text-[9px] font-mono-code text-[#64748b] block uppercase">Humanidad</span>
                            <span className="font-tech text-sm font-black text-[#ef4444]">
                              -{lossPreview} HUM
                            </span>
                            {hlMode === 'roll' && (
                              <button
                                onClick={() => handleRollForCyber(item)}
                                className="mt-0.5 text-[8px] font-mono-code text-[#38bdf8] hover:underline flex items-center justify-center gap-0.5 w-full cursor-pointer"
                                title="Volver a tirar dados"
                              >
                                <RotateCcw className="w-2.5 h-2.5" /> Tirar
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          {!isInstalled ? (
                            <>
                              <button
                                onClick={() => handleInstallCyberware(item, false)}
                                disabled={!canAfford}
                                className={`w-full sm:w-auto px-3.5 py-2 rounded-xs font-tech text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                                  canAfford
                                    ? 'bg-[#00f5d4] hover:bg-white text-black shadow-[0_0_10px_rgba(0,245,212,0.3)]'
                                    : 'bg-[#1b202c] text-[#475569] cursor-not-allowed border border-[#272e40]'
                                }`}
                                title={canAfford ? 'Instalar y debitar dinero' : 'Fondos insuficientes'}
                              >
                                <Coins className="w-3.5 h-3.5" />
                                <span>PAGAR & INSTALAR</span>
                              </button>

                              <button
                                onClick={() => handleInstallCyberware(item, true)}
                                className="w-full sm:w-auto px-3 py-2 bg-[#23293a] hover:bg-[#f59e0b] text-[#cbd5e1] hover:text-black font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                                title="Instalación gratuita (Loot de la calle o cortesía)"
                              >
                                <Flame className="w-3.5 h-3.5" />
                                <span>GRATIS (LOOT)</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleUninstallImplant(item)}
                              className="w-full sm:w-auto px-4 py-2 bg-[#ef4444]/20 hover:bg-[#ef4444] border border-[#ef4444]/40 text-[#ef4444] hover:text-white font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>DESINSTALAR</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#121520] border-t border-[#202638] p-3 flex items-center justify-between">
              <span className="text-[11px] font-mono-code text-[#64748b]">
                Los implantes se equipan instantáneamente y recalculan el blindaje y la empatía en tiempo real.
              </span>
              <button
                onClick={() => setInstallModalZone(null)}
                className="px-4 py-1.5 bg-[#1a1f2e] hover:bg-[#283046] text-white font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer"
              >
                Cerrar Estación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
