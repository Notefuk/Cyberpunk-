import { useState, useMemo, useRef } from 'react';
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
  Trash2, 
  Search, 
  X, 
  Coins, 
  Dices, 
  Check, 
  RotateCcw, 
  Info,
  Flame,
  Binary
} from 'lucide-react';
import {
  FBC_16_CYBERWARE,
  BIOSYSTEM_HL_AVERAGE,
  FBC_IMMUNITIES,
  type FbcBody
} from '../../data/goingMetalFbcData';
import {
  ZONE_CONFIGS,
  itemMatchesZone,
  parseHumanityLoss,
  renderCategoryFloatingTooltip,
  leftZoneKeys,
  rightZoneKeys,
  type AnatomicalZoneKey,
  type CyberwareItemData
} from './ripperdocZones';
import { HoloBody } from './HoloBody';
import { ZoneCard } from './ZoneCard';
import { SlotBox } from './SlotBox';
import { ZoneConnectors } from './ZoneConnectors';
import { ZoneDetailPanel } from './ZoneDetailPanel';
import { GoingMetalBanner } from './GoingMetalBanner';

export type { CyberwareItemData };


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
  const workstationRef = useRef<HTMLDivElement>(null);
  const [selectedInstalledCyber, setSelectedInstalledCyber] = useState<CyberwareItemData | null>(null);
  const [installModalZone, setInstallModalZone] = useState<AnatomicalZoneKey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hlMode, setHlMode] = useState<'average' | 'roll'>('average');
  const [diceRollPreview, setDiceRollPreview] = useState<{ [cyberId: string]: { total: number; rolls: number[]; diceDesc: string } }>({});
  const [toastFeedback, setToastFeedback] = useState<{ message: string; type: 'success' | 'warn' | 'info' } | null>(null);
  const [hoveredCategoryTooltipKey, setHoveredCategoryTooltipKey] = useState<string | null>(null);

  // GOING METAL (Full Body Conversion) State
  const [isGoingMetalOpen, setIsGoingMetalOpen] = useState(false);

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
      (id) => (allCyberware as { id: string; humanityLoss?: string; type?: string }[]).find((cw) => cw.id === id) ?? {}
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
    const humanityCost = isAlreadyFbc ? body.packageHlAverage : BIOSYSTEM_HL_AVERAGE + body.packageHlAverage; // Going Metal p. 95
    activateFullBodyConversion({
      id: body.id,
      name: body.name,
      bodyOverride: body.bodyOverride,
      statFloor: body.statFloor,
      armorPenalty: body.armorPenalty,
      baseArmorSp: body.baseArmorSp,
      humanityCost,
      immunities: FBC_IMMUNITIES
    });
    showToast(
      isAlreadyFbc
        ? `🔄 Biopod acoplado exitosamente al chasis ${body.name} (-${humanityCost} HUM).`
        : `🦾 Conversión FBC completada con chasis ${body.name} (-${humanityCost} HUM por Biopod).`,
      'success'
    );
  };

  const handleDeactivateFbc = () => {
    deactivateFullBodyConversion();
    showToast('🔌 Chasis FBC desacoplado. Biopod en soporte vital de reserva.', 'info');
  };


  const openInstallModal = (zoneKey: AnatomicalZoneKey) => {
    setInstallModalZone(zoneKey);
    setSearchTerm('');
  };

  const getInstalledInZone = (zoneKey: AnatomicalZoneKey) => {
    return allCyberware.filter((item) => activeChar.installedCyberwareIds.includes(item.id) && itemMatchesZone(item, zoneKey));
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
      <GoingMetalBanner
        activeChar={activeChar}
        isGoingMetalOpen={isGoingMetalOpen}
        setIsGoingMetalOpen={setIsGoingMetalOpen}
        hoveredCategoryTooltipKey={hoveredCategoryTooltipKey}
        setHoveredCategoryTooltipKey={setHoveredCategoryTooltipKey}
        hlMode={hlMode}
        handleActivateChassis={handleActivateChassis}
        handleDeactivateFbc={handleDeactivateFbc}
        handleInstallCyberware={handleInstallCyberware}
        handleUninstallImplant={handleUninstallImplant}
      />

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
      <div ref={workstationRef} className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-start">
        <ZoneConnectors
          containerRef={workstationRef}
          hoveredZone={hoveredZone}
          selectedZone={selectedZone}
          deps={[Object.keys(ZONE_CONFIGS).map((k) => getInstalledInZone(k as AnatomicalZoneKey).length)]}
        />
        {/* COL 1: HUMANITY TOWER (xl:col-span-1) */}
        <div className="order-4 xl:order-none xl:col-span-1 bg-[#0d0f15] border border-[#1e2332] p-3 rounded-xs flex flex-col items-center justify-between xl:min-h-[640px] relative overflow-hidden">
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
          <div className="w-full xl:flex-1 flex flex-row xl:flex-col-reverse items-center justify-center gap-[3px] my-3 py-2 bg-[#08090d] rounded-xs border border-[#171922] px-1">
            {Array.from({ length: 30 }).map((_, idx) => {
              const segmentThreshold = (idx + 1) / 30;
              const ratio = currentHum / (maxHum || 1);
              const isActive = ratio >= segmentThreshold;
              const isWarning = idx < 6; // lower 20%
              return (
                <div
                  key={`hum-seg-${idx}`}
                  className={`flex-1 h-4 xl:flex-none xl:w-full xl:h-3 rounded-[1px] transition-all duration-300 ${
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
        <div className="order-2 xl:order-none xl:col-span-3 space-y-3">
          {leftZoneKeys.map((key) => (
            <ZoneCard
              key={key}
              zoneKey={key}
              installed={getInstalledInZone(key)}
              hoveredZone={hoveredZone}
              selectedZone={selectedZone}
              hoveredCategoryTooltipKey={hoveredCategoryTooltipKey}
              setHoveredZone={setHoveredZone}
              setSelectedZone={setSelectedZone}
              setHoveredCategoryTooltipKey={setHoveredCategoryTooltipKey}
              onInspect={setSelectedInstalledCyber}
              onInstall={openInstallModal}
            />
          ))}
        </div>

        {/* COL 3: CENTRAL HOLOGRAPHIC BODY SVG & CALLOUTS (xl:col-span-4) */}
        <div className="order-1 xl:order-none md:col-span-2 xl:col-span-4 bg-[#090b10] border border-[#1a1e2c] p-2 rounded-xs flex flex-col items-center justify-start relative min-h-[640px] shadow-2xl">
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
          <HoloBody
            hoveredZone={hoveredZone}
            selectedZone={selectedZone}
            installedCountByZone={Object.fromEntries(
              (Object.keys(ZONE_CONFIGS) as AnatomicalZoneKey[]).map((k) => [k, getInstalledInZone(k).length])
            ) as Record<AnatomicalZoneKey, number>}
            setHoveredZone={setHoveredZone}
            setSelectedZone={setSelectedZone}
          />

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

          {/* Panel de detalle de la zona seleccionada */}
          <ZoneDetailPanel
            selectedZone={selectedZone}
            installed={selectedZone ? getInstalledInZone(selectedZone) : []}
            onInspect={setSelectedInstalledCyber}
            onInstall={openInstallModal}
          />
        </div>

        {/* COL 4: 4 RIGHT ANATOMICAL ZONES (xl:col-span-3) */}
        <div className="order-3 xl:order-none xl:col-span-3 space-y-3">
          {rightZoneKeys.map((key) => (
            <ZoneCard
              key={key}
              zoneKey={key}
              installed={getInstalledInZone(key)}
              hoveredZone={hoveredZone}
              selectedZone={selectedZone}
              hoveredCategoryTooltipKey={hoveredCategoryTooltipKey}
              setHoveredZone={setHoveredZone}
              setSelectedZone={setSelectedZone}
              setHoveredCategoryTooltipKey={setHoveredCategoryTooltipKey}
              onInspect={setSelectedInstalledCyber}
              onInstall={openInstallModal}
            />
          ))}
        </div>

        {/* COL 5: ARMOR SP & STATS TOWER (xl:col-span-1) */}
        <div className="order-5 xl:order-none xl:col-span-1 bg-[#0d0f15] border border-[#1e2332] p-3 rounded-xs flex flex-col items-center justify-between xl:min-h-[640px] relative overflow-hidden">
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
          <div className="w-full xl:flex-1 flex flex-row xl:flex-col-reverse items-center justify-center gap-[3px] my-3 py-2 bg-[#08090d] rounded-xs border border-[#171922] px-1">
            {Array.from({ length: 30 }).map((_, idx) => {
              const segTarget = (idx + 1) * (18 / 30);
              const isActive = maxDisplayedSp >= segTarget;
              return (
                <div
                  key={`sp-seg-${idx}`}
                  className={`flex-1 h-4 xl:flex-none xl:w-full xl:h-3 rounded-[1px] transition-all duration-300 ${
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
              return (
                <SlotBox
                  key={item ? `fashionware-slot-${idx}` : `fashionware-empty-${idx}`}
                  item={item}
                  zoneKey="fashionware"
                  onInspect={setSelectedInstalledCyber}
                  onInstall={openInstallModal}
                />
              );
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
