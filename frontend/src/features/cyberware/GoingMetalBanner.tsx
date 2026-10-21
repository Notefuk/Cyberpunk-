import { useState } from 'react';
import {
  Zap,
  Shield,
  Search,
  Coins,
  Check,
  Info,
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
  BIOSYSTEM_HL_AVERAGE,
  type FbcBody
} from '../../data/goingMetalFbcData';
import type { CharacterSheet } from '../../types/cyberpunk';
import {
  parseHumanityLoss,
  renderCategoryFloatingTooltip,
  type CyberwareItemData
} from './ripperdocZones';

export interface GoingMetalBannerProps {
  activeChar: CharacterSheet;
  isGoingMetalOpen: boolean;
  setIsGoingMetalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hoveredCategoryTooltipKey: string | null;
  setHoveredCategoryTooltipKey: (key: string | null) => void;
  hlMode: 'average' | 'roll';
  handleActivateChassis: (body: FbcBody) => void;
  handleDeactivateFbc: () => void;
  handleInstallCyberware: (item: CyberwareItemData, free?: boolean) => void;
  handleUninstallImplant: (item: CyberwareItemData) => void;
}

export function GoingMetalBanner({
  activeChar,
  isGoingMetalOpen,
  setIsGoingMetalOpen,
  hoveredCategoryTooltipKey,
  setHoveredCategoryTooltipKey,
  hlMode,
  handleActivateChassis,
  handleDeactivateFbc,
  handleInstallCyberware,
  handleUninstallImplant
}: GoingMetalBannerProps) {
  const [goingMetalTab, setGoingMetalTab] = useState<'chassis' | 'cyberware' | 'gear' | 'guide'>('chassis');
  const [fbcFilterText, setFbcFilterText] = useState('');

  return (
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
        <span>CYBERWARE GOING METAL ({FBC_16_CYBERWARE.length})</span>
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
                  b.manufacturer.toLowerCase().includes(fbcFilterText.toLowerCase())
              ).length
            }{' '}
            de 13 chasis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FBC_13_BODIES.filter(
            (b) =>
              b.name.toLowerCase().includes(fbcFilterText.toLowerCase()) ||
              b.manufacturer.toLowerCase().includes(fbcFilterText.toLowerCase())
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
                      <span className="text-[8px] font-mono-code text-[#94a3b8] block">REF/DEX/MOVE MÍN.</span>
                      <span className="font-tech text-sm font-black text-[#38bdf8]">
                        {chassis.statFloor || '—'}
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
                          ? `TRANSFERIR BIOPOD (-${chassis.packageHlAverage} HL)`
                          : `CONVERTIR FBC (-${BIOSYSTEM_HL_AVERAGE + chassis.packageHlAverage} HL)`}
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
            ⚡ Implantes canónicos de Going Metal (Going Metal) diseñados para chasis FBC y marcos mecánicos.
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
  );
}
