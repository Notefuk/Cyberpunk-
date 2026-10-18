import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useCombatStore } from '../../store/useCombatStore';
import { 
  RANGE_BRACKETS, 
  WEAPON_RANGE_PROFILES, 
  getWeaponProfileKey 
} from '../../data/rangeTables';
import { 
  getAutofireRulesSummary, 
  calculateWeaponAttackBreakdown, 
  calculateMaxHp, 
  calculateSeriouslyWoundedThreshold,
  calculateUnarmedDamage,
  getEffectiveBody,
  AMMO_TYPE_CATALOG,
  ENCUMBRANCE_MODES
} from '../../engine/characterEngine';
import { 
  createInitialAttackRoll, 
  createDamageRoll,
  AIMED_SHOT_OPTIONS
} from '../../engine/combatEngine';
import type { WeaponItem, RollEntry, InventoryItem, EncumbranceMode, AimedShotTarget } from '../../types/cyberpunk';
import coreData from '../../data/core-rules.cprpack.json';
import { MARTIAL_ARTS_FORMS, MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT } from '../../data/cyberfistsMartialArtsData';
import { QUICKHACKS_2077_CATALOG, QUICKHACKING_OFFICIAL_RULES_GUIDE, type Quickhack2077 } from '../../data/netAndRolesData';
import { ItemVisualPlaceholder } from '../../components/ItemVisualPlaceholder';
import { EnemiesCompendiumPanel } from '../gm/EnemiesCompendiumPanel';
import { 
  Heart, 
  Shield, 
  Crosshair, 
  Target, 
  Dices, 
  Terminal, 
  Flame, 
  Skull, 
  Brain, 
  Eye, 
  Bone, 
  HeartCrack, 
  AlertOctagon, 
  Activity, 
  RefreshCw, 
  Zap, 
  Check, 
  Trash2, 
  Sparkles, 
  Minus,
  Plus,
  Pill,
  Bomb,
  Swords,
  ChevronDown,
  ChevronRight,
  Package,
  X,
  Train,
  GripVertical,
  Maximize2,
  Coins,
  Cpu,
  Award,
  BookOpen,
  Unlock,
  Lock,
  Minimize2
} from 'lucide-react';

const TacticalTooltip: React.FC<{
  term: 'ROF' | 'SP' | 'HL' | 'MAG' | 'HANDS' | 'DV';
  children: React.ReactNode;
  className?: string;
}> = ({ term, children, className = '' }) => {
  const descriptions: Record<string, string> = {
    ROF: 'ROF (Rate of Fire / Cadencia de Fuego): Número de ataques que puedes hacer con esta arma en una sola Acción de Ataque por turno (ej. ROF 2 = 2 ataques por turno).',
    SP: 'SP (Stopping Power): Poder de parada del blindaje. Se resta al daño de cada ataque que te impacte.',
    HL: 'HL (Humanity Loss): Pérdida de Humanidad al instalar este implante de Cyberware.',
    MAG: 'MAG (Cargador): Cantidad de balas que caben en el cargador estándar antes de tener que usar una Acción para recargar.',
    HANDS: 'Manos requeridas para empuñar y atacar con el arma.',
    DV: 'DV (Difficulty Value): Número objetivo que debes igualar o superar con tu tirada (STAT + SKILL + 1d10).'
  };
  const text = descriptions[term] || '';

  return (
    <span
      className={`group/tip relative inline-flex items-center cursor-help underline decoration-dotted underline-offset-2 ${className}`}
      title={text}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex flex-col items-center z-50 w-64 text-left">
        <span className="bg-[#0b0e17] text-[#e2e8f0] text-[10px] font-mono-code font-normal leading-relaxed p-2.5 rounded-xs border border-[#38bdf8]/60 shadow-xl shadow-black/90">
          {text}
        </span>
        <span className="w-1.5 h-1.5 bg-[#0b0e17] border-r border-b border-[#38bdf8]/60 rotate-45 -mt-1" />
      </span>
    </span>
  );
};

const TACTICAL_GRENADES = [
  {
    id: 'frag-grenade',
    name: 'Frag Grenade',
    damage: '6d6',
    effect: '6d6 de Daño en área (radio 10x10m). Abla armadura en impacto.',
    dv: 15
  },
  {
    id: 'flashbang',
    name: 'Flashbang',
    effect: 'Ceguera y sordera por 1 min. DV 15 Resist Torture/Drugs para evitar.',
    dv: 15
  },
  {
    id: 'incendiary-grenade',
    name: 'Incendiary Grenade',
    damage: '4d6',
    effect: '4d6 de Daño + Prende fuego al objetivo: 2 HP directos/turno hasta apagarse.',
    dv: 15
  },
  {
    id: 'smoke-grenade',
    name: 'Smoke Grenade',
    effect: 'Cobertura visual densa de humo (10x10m). -4 a ataques con visión a través.',
    dv: 13
  },
  {
    id: 'emp-grenade',
    name: 'EMP Grenade',
    effect: 'Pulso electromagnético. DV 15 Cybertech o desactiva 2 piezas cyberware 1 min.',
    dv: 15
  },
  {
    id: 'biotoxin-grenade',
    name: 'Biotoxin Grenade',
    damage: '3d6',
    effect: 'Nube de biotoxina. DV 15 Resist Torture/Drugs o recibe 3d6 directos a HP ignorando SP.',
    dv: 15
  }
];

const AmmoCartridgeVisualizer: React.FC<{
  currentMag: number;
  standardMag: number;
  reserveAmmo: number;
  onAdjustMag: (delta: number) => void;
  onAdjustReserve: (delta: number) => void;
  onReload: () => void;
}> = ({
  currentMag,
  standardMag,
  reserveAmmo,
  onAdjustMag,
  onAdjustReserve,
  onReload
}) => {
  const isOutOfAmmo = currentMag <= 0;
  const ratio = standardMag > 0 ? currentMag / standardMag : 0;

  const getCounterColor = () => {
    if (isOutOfAmmo || ratio <= 0.25) {
      return 'text-[#dc2626] animate-pulse drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]';
    }
    if (ratio <= 0.50) {
      return 'text-[#f59e0b] drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]';
    }
    return 'text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]';
  };

  const getBulletColor = () => {
    if (isOutOfAmmo || ratio <= 0.25) {
      return 'bg-[#dc2626] border-[#f87171] shadow-[0_0_4px_rgba(220,38,38,0.8)]';
    }
    if (ratio <= 0.50) {
      return 'bg-[#f59e0b] border-[#fcd34d] shadow-[0_0_4px_rgba(245,158,11,0.6)]';
    }
    return 'bg-[#06b6d4] border-[#67e8f9] shadow-[0_0_4px_rgba(6,182,212,0.6)]';
  };

  const isCompactBullets = standardMag > 20;

  return (
    <div className="bg-[#0b0e14] p-3 rounded-sm border border-[#1f2638] space-y-2.5">
      {/* Fila Superior: Contador Numérico Grande + Controles */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1c2232]">
        
        {/* Contador Grande */}
        <div className="flex items-baseline gap-1.5">
          <span className={`font-mono font-black text-2xl tracking-tighter ${getCounterColor()}`}>
            {currentMag}
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">
            / {standardMag}
          </span>
          <span className="text-[10px] font-mono-code text-slate-400 ml-1">
            CARGADOR
          </span>
        </div>

        {/* Reserva y Botones Rápidos */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="text-[11px] font-mono font-bold bg-[#141824] px-2 py-0.5 rounded border border-[#232a3e] text-[#f59e0b]">
            RESERVA: {reserveAmmo}
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onAdjustMag(-1)}
              disabled={currentMag <= 0}
              className="px-2 py-0.5 bg-[#1b2030] hover:bg-[#dc2626] disabled:opacity-30 disabled:hover:bg-[#1b2030] text-white rounded text-[11px] font-mono font-bold transition-all"
              title="Disparar / Restar 1 bala"
            >
              -1
            </button>
            <button
              onClick={() => onAdjustMag(1)}
              disabled={currentMag >= standardMag}
              className="px-2 py-0.5 bg-[#1b2030] hover:bg-[#10b981] disabled:opacity-30 disabled:hover:bg-[#1b2030] text-white rounded text-[11px] font-mono font-bold transition-all"
              title="Cargar / Sumar 1 bala"
            >
              +1
            </button>
          </div>

          <button
            onClick={onReload}
            className="px-2.5 py-0.5 bg-[#f59e0b]/20 hover:bg-[#f59e0b] hover:text-black border border-[#f59e0b]/50 text-[#f59e0b] rounded text-[11px] font-mono font-bold transition-all flex items-center gap-1"
            title="Recargar cargador completo desde la reserva"
          >
            <RefreshCw className="w-3 h-3" /> RECARGAR
          </button>
        </div>

      </div>

      {/* Fila Inferior: Matriz Visual de Cartuchitos Individuales */}
      <div className="flex flex-wrap items-end gap-1 p-2 bg-slate-950/90 border border-slate-800 rounded min-h-[36px]">
        {Array.from({ length: standardMag }).map((_, index) => {
          const isLoaded = index < currentMag;
          const bulletTarget = index + 1 === currentMag ? index : index + 1;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => onAdjustMag(bulletTarget - currentMag)}
              title={`Cartucho #${index + 1} (${isLoaded ? 'Cargado' : 'Vacío'}). Clic para fijar.`}
              className={`group flex flex-col items-center justify-end transition-all cursor-pointer ${
                isCompactBullets ? 'w-2 h-4' : 'w-2.5 h-5'
              }`}
            >
              {isLoaded ? (
                <>
                  {/* Ojiva / Punta biselada */}
                  <span
                    className={`w-1.5 h-1 rounded-t-2xs border-t border-x ${getBulletColor()} border-b-0`}
                  />
                  {/* Vaina / Casquillo */}
                  <span
                    className={`w-full ${isCompactBullets ? 'h-3' : 'h-4'} rounded-b-2xs border border-t-0 ${getBulletColor()} relative`}
                  >
                    <span className="absolute top-0 inset-x-0 h-[1px] bg-black/40" />
                  </span>
                </>
              ) : (
                <>
                  {/* Ojiva vacía */}
                  <span
                    className="w-1.5 h-1 rounded-t-2xs border border-slate-800/80 bg-slate-900/40 opacity-35 border-b-0"
                  />
                  {/* Casquillo vacío */}
                  <span
                    className={`w-full ${isCompactBullets ? 'h-3' : 'h-4'} rounded-b-2xs border border-slate-800/80 bg-slate-900/40 opacity-35 border-t-0`}
                  />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Controles rápidos de Reserva de Munición */}
      <div className="flex items-center justify-between pt-1 text-[10px] font-mono-code text-[#64748b]">
        <span>Ajuste rápido de reserva:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAdjustReserve(-10)}
            className="px-1.5 py-0.5 bg-[#171b26] hover:bg-[#dc2626] text-slate-300 hover:text-white rounded border border-[#242b3d] font-bold"
            title="Gastar 10 balas de reserva"
          >
            -10
          </button>
          <button
            onClick={() => onAdjustReserve(10)}
            className="px-1.5 py-0.5 bg-[#171b26] hover:bg-[#10b981] text-slate-300 hover:text-white rounded border border-[#242b3d] font-bold"
            title="Añadir 10 balas a reserva"
          >
            +10
          </button>
          <button
            onClick={() => onAdjustReserve(30)}
            className="px-1.5 py-0.5 bg-[#171b26] hover:bg-[#10b981] text-slate-300 hover:text-white rounded border border-[#242b3d] font-bold"
            title="Añadir caja de 30 balas"
          >
            +30
          </button>
        </div>
      </div>
    </div>
  );
};

interface HeadshotCalculatorProps {
  entry: RollEntry;
}

const HeadshotCalculator: React.FC<HeadshotCalculatorProps> = ({ entry }) => {
  const [enemyHeadSp, setEnemyHeadSp] = useState<number>(11);

  const baseDmg = entry.baseDamageTotal ?? ((entry.finalDamageTotal ?? 0) - (entry.critBonusDamage || 0));
  const penetratingDmg = Math.max(0, baseDmg - enemyHeadSp);
  const penetrates = baseDmg > enemyHeadSp;
  const multipliedDmg = penetratingDmg * 2;
  const critBonus = entry.critBonusDamage || (entry.isCriticalInjuryTrigger ? 5 : 0);
  const totalHpDamage = penetrates ? multipliedDmg + critBonus : critBonus;
  const newEnemySp = penetrates ? Math.max(0, enemyHeadSp - 1) : enemyHeadSp;

  return (
    <div className="mt-2 p-2 bg-[#1b1216] border border-[#ef4444]/50 rounded-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-tech text-[11px] font-bold text-[#f87171] flex items-center gap-1">
          <Crosshair className="w-3.5 h-3.5 text-[#ef4444]" />
          MINI-CALCULADORA DE HEADSHOT (×2)
        </span>
        <span className="text-[9px] font-mono-code text-[#cbd5e1] bg-[#2a131a] px-1.5 py-0.5 rounded border border-[#ef4444]/30">
          SP Cabeza
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[10px] font-mono-code text-[#94a3b8] whitespace-nowrap">
          SP Cabeza Enemigo:
        </label>
        <input
          type="number"
          min="0"
          max="30"
          value={enemyHeadSp}
          onChange={(e) => setEnemyHeadSp(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-16 px-1.5 py-0.5 bg-[#0e1017] border border-[#3b1d24] focus:border-[#ef4444] rounded text-white font-mono-code text-xs text-center font-bold focus:outline-none"
        />
        <div className="flex items-center gap-1 text-[9px] font-mono-code text-[#64748b]">
          <button
            type="button"
            onClick={() => setEnemyHeadSp(7)}
            className="px-1 py-0.2 bg-[#171b26] hover:bg-[#252c42] rounded border border-[#293246]"
            title="Kevlar Cabeza (SP 7)"
          >
            SP 7
          </button>
          <button
            type="button"
            onClick={() => setEnemyHeadSp(11)}
            className="px-1 py-0.2 bg-[#171b26] hover:bg-[#252c42] rounded border border-[#293246]"
            title="Light Armorjack Cabeza (SP 11 - Estándar)"
          >
            SP 11
          </button>
          <button
            type="button"
            onClick={() => setEnemyHeadSp(13)}
            className="px-1 py-0.2 bg-[#171b26] hover:bg-[#252c42] rounded border border-[#293246]"
            title="Medium Armorjack (SP 13)"
          >
            SP 13
          </button>
        </div>
      </div>

      <div className="bg-[#10121a] p-1.5 rounded border border-[#291b22] text-[10px] font-mono-code space-y-1">
        <div className="flex justify-between items-center text-[#cbd5e1]">
          <span>Daño base ({baseDmg}) - SP ({enemyHeadSp}):</span>
          <span className={`font-bold ${penetrates ? 'text-[#f87171]' : 'text-[#64748b]'}`}>
            {penetrates ? `${penetratingDmg} penetrante` : 'Armadura Detuvo Daño'}
          </span>
        </div>

        {penetrates && (
          <div className="flex justify-between items-center text-amber-300">
            <span>Multiplicador de Cabeza (×2):</span>
            <span className="font-bold">{penetratingDmg} × 2 = {multipliedDmg} HP</span>
          </div>
        )}

        {critBonus > 0 && (
          <div className="flex justify-between items-center text-[#ef4444]">
            <span>Bonus Herida Crítica (+5):</span>
            <span className="font-bold">+5 HP</span>
          </div>
        )}

        <div className="pt-1 border-t border-[#291b22] flex justify-between items-center">
          <div className="text-[9px] text-[#94a3b8]">
            {penetrates ? `Ablación: SP pasa a ${newEnemySp}` : 'Sin ablación'}
          </div>
          <div className="font-tech text-xs font-bold text-white flex items-center gap-1">
            <span>DAÑO DIRECTO A HP:</span>
            <span className="text-emerald-400 text-sm font-mono-code">{totalHpDamage} HP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export type LeftPanelId = 'vitals' | 'armor' | 'luck' | 'injuries' | 'cyberware' | 'consumables';
export type RightPanelId = 'telemetry' | 'inHand' | 'rangefinder' | 'arsenalBelt' | 'martialArts' | 'roleAbility' | 'quickhacks2077';
export type HudSectionId = LeftPanelId | RightPanelId;

const DEFAULT_LEFT_ORDER: LeftPanelId[] = ['vitals', 'armor', 'luck', 'injuries', 'cyberware', 'consumables'];
const DEFAULT_RIGHT_ORDER: RightPanelId[] = ['telemetry', 'inHand', 'rangefinder', 'arsenalBelt', 'martialArts', 'roleAbility', 'quickhacks2077'];
export const DEFAULT_HUD_ORDER: HudSectionId[] = [...DEFAULT_LEFT_ORDER, ...DEFAULT_RIGHT_ORDER];

const STORAGE_KEY_LEFT_ORDER = 'cpr_combat_left_order_v2';
const STORAGE_KEY_RIGHT_ORDER = 'cpr_combat_right_order_v2';
const STORAGE_KEY_COLLAPSED = 'cpr_combat_collapsed_boxes_v2';
const STORAGE_KEY_DOCK_MODE = 'cpr_combat_telemetry_dock_v2';

interface CollapsibleHudCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  summary: React.ReactNode;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  isDragOver: boolean;
  children: React.ReactNode;
  extraHeaderActions?: React.ReactNode;
  accentBorderClass?: string;
}

const CollapsibleHudCard: React.FC<CollapsibleHudCardProps> = ({
  title,
  icon,
  summary,
  isCollapsed,
  onToggleCollapse,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
  children,
  extraHeaderActions,
  accentBorderClass = 'border-[#232736]'
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`chamfer-card transition-all duration-200 bg-[#121319] border ${
        isDragOver
          ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-950/80'
          : accentBorderClass
      }`}
    >
      <div
        onClick={onToggleCollapse}
        className={`p-2.5 sm:p-3 flex items-center justify-between gap-2 cursor-pointer select-none group/header transition-colors hover:bg-[#161924] ${
          isCollapsed ? '' : 'border-b border-[#1f2230]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className="flex items-center gap-0.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              title="Arrastrar para mover arriba o abajo"
              className="cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </span>
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              title="Subir un lugar"
              className="w-4 h-4 flex items-center justify-center rounded text-[9px] bg-[#1a1e2a] hover:bg-[#252c3e] text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              title="Bajar un lugar"
              className="w-4 h-4 flex items-center justify-center rounded text-[9px] bg-[#1a1e2a] hover:bg-[#252c3e] text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              ▼
            </button>
          </div>

          <span className="text-slate-500 group-hover/header:text-cyan-400 transition-colors shrink-0">
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            )}
          </span>

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="shrink-0">{icon}</span>
            <span className="font-tech text-xs font-bold tracking-wider text-white uppercase truncate group-hover/header:text-cyan-300 transition-colors">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isCollapsed && (
            <div className="text-[10px] font-mono-code text-cyan-300 bg-[#0e121a] px-2 py-0.5 rounded border border-[#20293d] max-w-[180px] sm:max-w-[280px] truncate">
              {summary}
            </div>
          )}
          {extraHeaderActions}
        </div>
      </div>

      {!isCollapsed && <div className="p-3.5 space-y-3">{children}</div>}
    </div>
  );
};

export const CombatHudView: React.FC = () => {
  // Store hooks
  const activeChar = useCharacterStore((state) => state.getActiveCharacter());
  const adjustHp = useCharacterStore((state) => state.adjustHp);
  const setHp = useCharacterStore((state) => state.setHp);
  const ablateArmor = useCharacterStore((state) => state.ablateArmor);
  const repairArmor = useCharacterStore((state) => state.repairArmor);
  const applyIncomingDamage = useCharacterStore((state) => state.applyIncomingDamage);
  const spendLuck = useCharacterStore((state) => state.spendLuck);
  const restoreLuck = useCharacterStore((state) => state.restoreLuck);
  const toggleLuckPip = useCharacterStore((state) => state.toggleLuckPip);
  const consumeAmmo = useCharacterStore((state) => state.consumeAmmo);
  const reloadWeapon = useCharacterStore((state) => state.reloadWeapon);
  const toggleWeaponInHand = useCharacterStore((state) => state.toggleWeaponInHand);
  const toggleUnarmedInHand = useCharacterStore((state) => state.toggleUnarmedInHand);
  const adjustWeaponMag = useCharacterStore((state) => state.adjustWeaponMag);
  const adjustWeaponReserveAmmo = useCharacterStore((state) => state.adjustWeaponReserveAmmo);
  const setWeaponAmmoType = useCharacterStore((state) => state.setWeaponAmmoType);
  const injectDrug = useCharacterStore((state) => state.useOrInjectDrug);
  const removeActiveDrug = useCharacterStore((state) => state.removeActiveDrug);
  const equipWeaponFromCatalog = useCharacterStore((state) => state.equipWeaponFromCatalog);
  const unequipWeapon = useCharacterStore((state) => state.unequipWeapon);
  const updateInventoryQuantity = useCharacterStore((state) => state.updateInventoryQuantity);
  const addConsumableCharge = useCharacterStore((state) => state.addConsumableCharge);
  const inflictRandomInjury = useCharacterStore((state) => state.inflictRandomInjury);
  const toggleTreatInjury = useCharacterStore((state) => state.toggleTreatInjury);
  const removeInjury = useCharacterStore((state) => state.removeInjury);
  const setEncumbranceMode = useCharacterStore((state) => state.setEncumbranceMode);
  const updateMartialArtRank = useCharacterStore((state) => state.updateMartialArtRank);
  const adjustImprovementPoints = useCharacterStore((state) => state.adjustImprovementPoints);
  const setInterfaceRankOverride = useCharacterStore((state) => state.setInterfaceRankOverride);
  const trainMartialArtWithIp = useCharacterStore((state) => state.trainMartialArtWithIp);
  const buyAndEquipMartialArtChip = useCharacterStore((state) => state.buyAndEquipMartialArtChip);
  const toggleEquipMartialArtChip = useCharacterStore((state) => state.toggleEquipMartialArtChip);
  const updateSoloAllocation = useCharacterStore((state) => state.updateSoloAllocation);

  const selectedDistance = useCombatStore((state) => state.selectedDistance);
  const setSelectedDistance = useCombatStore((state) => state.setSelectedDistance);
  const autofireByWeapon = useCombatStore((state) => state.autofireByWeapon);
  const toggleWeaponAutofire = useCombatStore((state) => state.toggleWeaponAutofire);
  const luckToSpendOnNextRoll = useCombatStore((state) => state.luckToSpendOnNextRoll);
  const setLuckToSpend = useCombatStore((state) => state.setLuckToSpend);
  const aimedShotTarget = useCombatStore((state) => state.aimedShotTarget);
  const setAimedShotTarget = useCombatStore((state) => state.setAimedShotTarget);
  const rollHistory = useCombatStore((state) => state.rollHistory);
  const addRollEntry = useCombatStore((state) => state.addRollEntry);
  const triggerExplosionClick = useCombatStore((state) => state.triggerExplosionClick);
  const markAttackDamageRolled = useCombatStore((state) => state.markAttackDamageRolled);
  const clearRollHistory = useCombatStore((state) => state.clearRollHistory);

  // Local state: Reordenamiento, colapso y docking
  const [leftColumnOrder, setLeftColumnOrder] = useState<LeftPanelId[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEFT_ORDER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_LEFT_ORDER.length && DEFAULT_LEFT_ORDER.every(id => parsed.includes(id))) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_LEFT_ORDER;
  });

  const [rightColumnOrder, setRightColumnOrder] = useState<RightPanelId[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RIGHT_ORDER);
      if (saved) {
        let parsed = JSON.parse(saved) as string[];
        if (Array.isArray(parsed)) {
          // Backward compatibility: replace old 'roleQuickhacks' with 'roleAbility' and append 'quickhacks2077' if missing
          parsed = parsed.map(id => (id === 'roleQuickhacks' ? 'roleAbility' : id));
          if (!parsed.includes('quickhacks2077')) {
            parsed.push('quickhacks2077');
          }
          if (DEFAULT_RIGHT_ORDER.every(id => parsed.includes(id as RightPanelId)) && parsed.length === DEFAULT_RIGHT_ORDER.length) {
            return parsed as RightPanelId[];
          }
        }
      }
    } catch {}
    return DEFAULT_RIGHT_ORDER;
  });

  const [collapsedBoxes, setCollapsedBoxes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COLLAPSED);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [telemetryDockMode, setTelemetryDockMode] = useState<'inline' | 'split_sticky' | 'floating_pip'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCK_MODE);
      if (saved === 'inline' || saved === 'split_sticky' || saved === 'floating_pip') return saved;
    } catch {}
    return 'inline';
  });

  const [draggedItem, setDraggedItem] = useState<{ column: 'left' | 'right'; id: string } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const toggleBoxCollapse = (boxId: string) => {
    setCollapsedBoxes(prev => {
      const next = { ...prev, [boxId]: !prev[boxId] };
      localStorage.setItem(STORAGE_KEY_COLLAPSED, JSON.stringify(next));
      return next;
    });
  };

  const ensureTelemetryExpanded = () => {
    if (collapsedBoxes['telemetry']) {
      setCollapsedBoxes(prev => {
        const next = { ...prev, telemetry: false };
        localStorage.setItem(STORAGE_KEY_COLLAPSED, JSON.stringify(next));
        return next;
      });
    }
  };

  const handleExpandAll = () => {
    setCollapsedBoxes({});
    localStorage.setItem(STORAGE_KEY_COLLAPSED, JSON.stringify({}));
  };

  const handleCollapseSecondary = () => {
    const next: Record<string, boolean> = {
      armor: true,
      luck: true,
      injuries: (activeChar?.activeInjuries?.length ?? 0) === 0,
      cyberware: true,
      consumables: true,
      rangefinder: true,
      arsenalBelt: true,
      martialArts: true,
      roleAbility: true,
      quickhacks2077: true
    };
    setCollapsedBoxes(next);
    localStorage.setItem(STORAGE_KEY_COLLAPSED, JSON.stringify(next));
  };

  const handleResetBoxOrder = () => {
    setLeftColumnOrder(DEFAULT_LEFT_ORDER);
    setRightColumnOrder(DEFAULT_RIGHT_ORDER);
    localStorage.setItem(STORAGE_KEY_LEFT_ORDER, JSON.stringify(DEFAULT_LEFT_ORDER));
    localStorage.setItem(STORAGE_KEY_RIGHT_ORDER, JSON.stringify(DEFAULT_RIGHT_ORDER));
  };

  const moveLeftPanel = (panelId: LeftPanelId, direction: 'up' | 'down') => {
    const idx = leftColumnOrder.indexOf(panelId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= leftColumnOrder.length) return;
    const next = [...leftColumnOrder];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setLeftColumnOrder(next);
    localStorage.setItem(STORAGE_KEY_LEFT_ORDER, JSON.stringify(next));
  };

  const moveRightPanel = (panelId: RightPanelId, direction: 'up' | 'down') => {
    const idx = rightColumnOrder.indexOf(panelId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= rightColumnOrder.length) return;
    const next = [...rightColumnOrder];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setRightColumnOrder(next);
    localStorage.setItem(STORAGE_KEY_RIGHT_ORDER, JSON.stringify(next));
  };

  const handleDragStart = (column: 'left' | 'right', id: string) => {
    setDraggedItem({ column, id });
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (dragOverItem !== targetId) setDragOverItem(targetId);
  };

  const handleDrop = (targetColumn: 'left' | 'right', targetId: string) => {
    if (!draggedItem) return;
    if (draggedItem.column === targetColumn) {
      if (targetColumn === 'left') {
        const fromIdx = leftColumnOrder.indexOf(draggedItem.id as LeftPanelId);
        const toIdx = leftColumnOrder.indexOf(targetId as LeftPanelId);
        if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
          const next = [...leftColumnOrder];
          const [removed] = next.splice(fromIdx, 1);
          next.splice(toIdx, 0, removed);
          setLeftColumnOrder(next);
          localStorage.setItem(STORAGE_KEY_LEFT_ORDER, JSON.stringify(next));
        }
      } else {
        const fromIdx = rightColumnOrder.indexOf(draggedItem.id as RightPanelId);
        const toIdx = rightColumnOrder.indexOf(targetId as RightPanelId);
        if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
          const next = [...rightColumnOrder];
          const [removed] = next.splice(fromIdx, 1);
          next.splice(toIdx, 0, removed);
          setRightColumnOrder(next);
          localStorage.setItem(STORAGE_KEY_RIGHT_ORDER, JSON.stringify(next));
        }
      }
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const [incomingDamageInput, setIncomingDamageInput] = useState<number>(10);
  const [damageFeedback, setDamageFeedback] = useState<string | null>(null);
  const [rackFilter, setRackFilter] = useState<'all' | 'weapons' | 'unarmed' | 'throwables' | 'drugs'>('all');
  const [selectedCatalogWeaponId, setSelectedCatalogWeaponId] = useState<string>(
    coreData.weapons?.[0]?.id || ''
  );
  const [isBestiaryDrawerOpen, setIsBestiaryDrawerOpen] = useState(false);

  // Módulos tácticos avanzados
  const [selectedMartialFormId, setSelectedMartialFormId] = useState<string>(MARTIAL_ARTS_FORMS[0]?.id || 'aikido');
  const [martialArtCategoryFilter, setMartialArtCategoryFilter] = useState<'all' | 'core' | 'interface_red'>('all');
  const [martialArtSearch, setMartialArtSearch] = useState<string>('');

  const [quickhackSearch, setQuickhackSearch] = useState<string>('');
  const [quickhackTierFilter, setQuickhackTierFilter] = useState<string>('all');
  const [unlockAllQuickhacks, setUnlockAllQuickhacks] = useState<boolean>(false);
  const [showQuickhackGuide, setShowQuickhackGuide] = useState<boolean>(false);
  const [showDojoModal, setShowDojoModal] = useState<boolean>(false);
  const [showMartialArtsGuide, setShowMartialArtsGuide] = useState<boolean>(false);
  const [martialFeedback, setMartialFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Accordion section states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    weapons: true,
    unarmed: true,
    throwables: true,
    drugs: true
  });
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Item-level accordions (default closed so users only see name + charges)
  const [openWeapons, setOpenWeapons] = useState<Record<string, boolean>>({});
  const toggleOpenWeapon = (id: string) => {
    setOpenWeapons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [openGrenades, setOpenGrenades] = useState<Record<string, boolean>>({});
  const toggleOpenGrenade = (id: string) => {
    setOpenGrenades((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [openDrugs, setOpenDrugs] = useState<Record<string, boolean>>({});
  const toggleOpenDrug = (id: string) => {
    setOpenDrugs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [openUnarmed, setOpenUnarmed] = useState<Record<string, boolean>>({
    brawling: false,
    martialArts: false
  });
  const toggleOpenUnarmed = (mode: 'brawling' | 'martialArts') => {
    setOpenUnarmed((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  // Dropdown states for equipping from belt
  const [selectedCatalogGrenadeId, setSelectedCatalogGrenadeId] = useState<string>(
    TACTICAL_GRENADES[0]?.id || ''
  );
  const catalogDrugs: any[] = (coreData as any).drugs || [];
  const [selectedCatalogDrugId, setSelectedCatalogDrugId] = useState<string>(
    catalogDrugs[0]?.name || ''
  );
  const [showEquipGrenadeDropdown, setShowEquipGrenadeDropdown] = useState<boolean>(false);
  const [showEquipDrugDropdown, setShowEquipDrugDropdown] = useState<boolean>(false);

  // Columna Central: Telémetro y Estación "En Mano"
  const [inHandExpanded, setInHandExpanded] = useState<Record<string, boolean>>({});
  const toggleInHandExpanded = (id: string) => {
    setInHandExpanded((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : false
    }));
  };
  const [inHandSubTab, setInHandSubTab] = useState<Record<string, 'ammo' | 'dv' | 'autofire' | 'all'>>({});
  const setWeaponSubTab = (id: string, tab: 'ammo' | 'dv' | 'autofire' | 'all') => {
    setInHandSubTab((prev) => ({ ...prev, [id]: tab }));
  };

  const [unarmedInHandExpanded, setUnarmedInHandExpanded] = useState<Record<string, boolean>>({
    brawling: true,
    martialArts: true
  });
  const toggleUnarmedInHandExpanded = (mode: 'brawling' | 'martialArts') => {
    setUnarmedInHandExpanded((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  // Helper to match inventory items to tactical grenades
  const getGrenadeInfo = (item: InventoryItem) => {
    const found = TACTICAL_GRENADES.find(
      (tg) => tg.id === item.catalogId || tg.name.toLowerCase() === item.name.toLowerCase()
    );
    return {
      id: item.catalogId || item.id,
      name: item.name,
      damage: found?.damage || (item.details?.match(/\d+d\d+/i)?.[0] ?? ''),
      effect: found?.effect || item.details || 'Granada táctica estándar.',
      dv: found?.dv ?? 15
    };
  };

  // Helper to match inventory items to drugs
  const getDrugInfo = (item: InventoryItem) => {
    const found = catalogDrugs.find(
      (cd) => cd.id === item.catalogId || cd.name.toLowerCase() === item.name.toLowerCase()
    );
    return {
      id: item.catalogId || item.id,
      name: item.name,
      duration: found?.duration || '1 hora',
      primaryEffect: found?.primaryEffect || item.details || 'Efecto estimulante.',
      secondaryEffect: found?.secondaryEffect || '',
      addictionDv: found?.addictionDv ?? 15,
      cost: found?.cost || item.cost || 50
    };
  };

  // Filter ONLY items actually owned in inventory with quantity > 0
  const ownedGrenades = (activeChar?.inventory || []).filter(
    (item: InventoryItem) => item.quantity > 0 && (
      item.category === 'ammunition' ||
      item.name.toLowerCase().includes('grenade') ||
      item.name.toLowerCase().includes('granada') ||
      item.name.toLowerCase().includes('flashbang') ||
      TACTICAL_GRENADES.some((tg) => tg.id === item.catalogId || tg.name.toLowerCase() === item.name.toLowerCase())
    )
  );

  const ownedDrugs = (activeChar?.inventory || []).filter(
    (item: InventoryItem) => item.quantity > 0 && (
      item.category === 'drugs' ||
      catalogDrugs.some((cd) => cd.id === item.catalogId || cd.name.toLowerCase() === item.name.toLowerCase())
    )
  );

  const totalGrenadeCharges = ownedGrenades.reduce((sum, g) => sum + g.quantity, 0);
  const totalDrugCharges = ownedDrugs.reduce((sum, d) => sum + d.quantity, 0);

  const installedCyberware = (coreData.cyberware || []).filter((c: any) =>
    (activeChar?.installedCyberwareIds || []).includes(c.id)
  );

  // Calculations for Active Character
  const activeInterfaceRank = activeChar?.interfaceRankOverride ?? (activeChar?.role === 'Netrunner' ? (activeChar.roleRank || 4) : 0);
  const effectiveBody = getEffectiveBody(activeChar);
  const maxHp = calculateMaxHp(effectiveBody, activeChar?.stats?.WILL ?? 6);
  const seriousWoundThresh = calculateSeriouslyWoundedThreshold(maxHp);
  const isSeriouslyWounded = (activeChar?.currentHp ?? 0) < seriousWoundThresh;
  const isMortallyWounded = (activeChar?.currentHp ?? 0) <= 0;
  const unarmedDmg = calculateUnarmedDamage(effectiveBody);
  const activeBracket = RANGE_BRACKETS.find((b) => b.range === selectedDistance);

  // Helper: DV for weapon & distance
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

  // Helper for placeholder type
  const getItemPlaceholderType = (w: WeaponItem) => {
    if (w.type === 'Melee') return 'melee';
    const lower = w.name.toLowerCase();
    if (lower.includes('sniper') || lower.includes('assault')) return 'rifle';
    if (lower.includes('shotgun')) return 'shotgun';
    if (lower.includes('smg')) return 'smg';
    if (lower.includes('rocket') || lower.includes('grenade')) return 'heavy';
    return 'pistol';
  };

  // Render trauma icon for injuries
  const renderInjuryIcon = (iconType: string) => {
    switch (iconType) {
      case 'skull': return <Skull className="w-5 h-5 text-[#dc2626]" />;
      case 'brain': return <Brain className="w-5 h-5 text-[#f43f5e]" />;
      case 'eye': return <Eye className="w-5 h-5 text-[#38bdf8]" />;
      case 'bone': return <Bone className="w-5 h-5 text-[#f59e0b]" />;
      case 'organ': return <HeartCrack className="w-5 h-5 text-[#dc2626]" />;
      case 'limb': return <Activity className="w-5 h-5 text-[#e11d48]" />;
      default: return <AlertOctagon className="w-5 h-5 text-[#dc2626]" />;
    }
  };

  // Handle incoming damage button
  const handleApplyHit = (location: 'head' | 'body') => {
    const res = applyIncomingDamage(incomingDamageInput, location);
    setDamageFeedback(`Impacto ${location === 'head' ? 'Cabeza' : 'Torso'}: -${res.hpLost} HP, -${res.spAblated} SP`);
    setTimeout(() => setDamageFeedback(null), 4000);
  };

  // Handle Step 1: Weapon Attack Check (1d10)
  const handleAttackClick = (weapon: WeaponItem, instanceId: string) => {
    ensureTelemetryExpanded();
    const isAuto = !!autofireByWeapon[instanceId];
    const ammoCost = isAuto ? 10 : (weapon.type === 'Melee' ? 0 : 1);

    if (ammoCost > 0) {
      const success = consumeAmmo(instanceId, ammoCost);
      if (!success) {
        alert(`¡Munición insuficiente! Necesitas ${ammoCost} balas.`);
        return;
      }
    }

    const currentDv = getDvForWeapon(weapon, selectedDistance, isAuto);
    if (currentDv === null && weapon.type !== 'Melee') {
      alert(`El objetivo a ${selectedDistance} está fuera de alcance.`);
      return;
    }

    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }

    const entry = createInitialAttackRoll(activeChar, weapon, {
      targetDv: weapon.type === 'Melee' ? 13 : currentDv,
      distanceLabel: weapon.type === 'Melee' ? 'Cuerpo a cuerpo' : selectedDistance,
      luckSpent,
      isAutofire: isAuto,
      weaponInstanceId: instanceId,
      aimedShotTarget
    });

    addRollEntry(entry);
  };

  // Handle Step 2: Damage Roll (Xd6)
  const handleDamageClick = (weapon: WeaponItem, instanceId: string) => {
    ensureTelemetryExpanded();
    const isAuto = !!autofireByWeapon[instanceId];
    const recentHit = rollHistory.find(
      (r) => r.type === 'attack' && r.weaponInstanceId === instanceId && r.isHit
    );
    const multiplier = isAuto ? (recentHit?.autofireMultiplier || 1) : 1;

    const dmgEntry = createDamageRoll(
      weapon.name,
      weapon.damage,
      isAuto,
      multiplier,
      instanceId,
      recentHit?.aimedShotTarget ?? aimedShotTarget
    );

    if (recentHit) {
      markAttackDamageRolled(recentHit.id);
    }

    addRollEntry(dmgEntry);
  };

  // Unarmed: Brawling attack
  const handleBrawlingAttack = () => {
    ensureTelemetryExpanded();
    const brawlingWeapon: WeaponItem = {
      id: 'unarmed-brawling',
      name: 'Puños (Brawling)',
      type: 'Melee',
      skill: 'Brawling',
      damage: unarmedDmg,
      rof: 2,
      hands: 1,
      concealable: true,
      cost: 0
    };

    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }

    const entry = createInitialAttackRoll(activeChar, brawlingWeapon, {
      targetDv: 13,
      distanceLabel: 'Cuerpo a cuerpo (Enfrentada)',
      luckSpent,
      weaponInstanceId: 'unarmed-brawling',
      aimedShotTarget
    });
    addRollEntry(entry);
  };

  // Unarmed: Brawling damage
  const handleBrawlingDamage = () => {
    ensureTelemetryExpanded();
    const dmgEntry = createDamageRoll('Puños (Brawling)', unarmedDmg, false, 1, 'unarmed-brawling', aimedShotTarget);
    addRollEntry(dmgEntry);
  };

  // Unarmed: Grapple maneuver
  const handleGrapple = () => {
    ensureTelemetryExpanded();
    const grappleWeapon: WeaponItem = {
      id: 'unarmed-grapple',
      name: '🤼 Presa / Agarre (Grapple)',
      type: 'Melee',
      skill: 'Brawling',
      damage: 'Inmovilizado',
      rof: 2,
      hands: 2,
      concealable: false,
      cost: 0
    };

    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }

    const entry = createInitialAttackRoll(activeChar, grappleWeapon, {
      targetDv: 13,
      distanceLabel: 'Presa cuerpo a cuerpo (Enfrentada)',
      luckSpent,
      weaponInstanceId: 'unarmed-grapple'
    });
    addRollEntry(entry);
  };

  // Unarmed: Choke maneuver
  const handleChoke = () => {
    ensureTelemetryExpanded();
    const bodyDmg = activeChar?.stats?.BODY ?? 6;
    const chokeEntry: RollEntry = {
      id: `roll-dmg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'damage',
      weaponName: '💀 Ahorcar (Choke)',
      damageFormula: `${bodyDmg} HP directos (Ignora SP)`,
      baseDamageTotal: bodyDmg,
      finalDamageTotal: bodyDmg,
      diceResults: [bodyDmg]
    };
    addRollEntry(chokeEntry);
  };

  // Unarmed: Martial Arts attack
  const handleMartialArtsAttack = () => {
    ensureTelemetryExpanded();
    const martialArtsWeapon: WeaponItem = {
      id: 'unarmed-martial-arts',
      name: 'Artes Marciales',
      type: 'Melee',
      skill: 'Martial Arts',
      damage: unarmedDmg,
      rof: 2,
      hands: 1,
      concealable: true,
      cost: 0
    };

    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }

    const entry = createInitialAttackRoll(activeChar, martialArtsWeapon, {
      targetDv: 13,
      distanceLabel: 'Cuerpo a cuerpo (Ignora 50% SP)',
      luckSpent,
      weaponInstanceId: 'unarmed-martial-arts',
      aimedShotTarget
    });
    addRollEntry(entry);
  };

  // Unarmed: Martial Arts damage
  const handleMartialArtsDamage = () => {
    ensureTelemetryExpanded();
    const dmgEntry = createDamageRoll('Artes Marciales (Ignora 50% SP)', unarmedDmg, false, 1, 'unarmed-martial-arts', aimedShotTarget);
    addRollEntry(dmgEntry);
  };

  // Cyberfists of Fury: Form Attack
  const handleCyberfistsFormAttack = (form: typeof MARTIAL_ARTS_FORMS[number]) => {
    ensureTelemetryExpanded();
    const naturalRank = activeChar?.knownMartialArts?.[form.id] ?? (activeChar?.skills?.martialArts ?? 0);
    const isChipEquipped = (activeChar?.equippedMartialArtChips || []).includes(form.id);
    const rank = isChipEquipped ? Math.max(3, naturalRank) : naturalRank;
    const soloPrecision = activeChar?.soloAllocation?.precisionAttack ?? 0;
    const dex = activeChar?.stats?.DEX ?? 6;
    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }

    const d10 = Math.floor(Math.random() * 10) + 1;
    const isCritSuccess = d10 === 10;
    const isCritFail = d10 === 1;
    const targetDv = 13;
    const totalBase = dex + rank + soloPrecision + luckSpent;
    const totalAttack = totalBase + d10;
    const margin = totalAttack - targetDv;
    const isHit = margin >= 0;

    const penaltyBreakdown: string[] = [];
    if (soloPrecision > 0) {
      penaltyBreakdown.push(`[Combat Awareness] Precision Attack: +${soloPrecision}`);
    }

    const entry: RollEntry = {
      id: `roll-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'attack',
      weaponName: `🥋 ${form.name} (Ataque)`,
      damageFormula: `${unarmedDmg} (Ignora 50% SP)`,
      distanceLabel: 'Cuerpo a cuerpo · ROF 2',
      d10,
      critDie: null,
      needsExplosionClick: isCritSuccess || isCritFail,
      explosionType: isCritSuccess ? 'crit_success' : isCritFail ? 'crit_fail' : null,
      statName: 'DEX',
      statVal: dex,
      skillName: `Martial Arts: ${form.name}`,
      skillVal: rank,
      luckSpent,
      totalAttack,
      targetDv,
      margin,
      isHit,
      isCritSuccess,
      isCritFail,
      penaltyBreakdown: penaltyBreakdown.length > 0 ? penaltyBreakdown : undefined,
      damageRolled: false
    };
    addRollEntry(entry);
  };

  // Cyberfists of Fury: Form Damage
  const handleCyberfistsFormDamage = (form: typeof MARTIAL_ARTS_FORMS[number]) => {
    ensureTelemetryExpanded();
    const spotBonus = activeChar?.soloAllocation?.spotWeakness ?? 0;
    const formulaLabel = spotBonus > 0 ? `${unarmedDmg} + ${spotBonus} (Spot Weakness)` : unarmedDmg;
    const dmgEntry = createDamageRoll(
      `${form.name} (Ignora 50% SP)`,
      unarmedDmg,
      false,
      1,
      `ma-${form.id}`,
      aimedShotTarget
    );
    if (spotBonus > 0 && dmgEntry.finalDamageTotal !== undefined) {
      dmgEntry.finalDamageTotal += spotBonus;
      dmgEntry.damageFormula = formulaLabel;
    }
    addRollEntry(dmgEntry);
  };

  // Cyberfists of Fury: Special Move execution
  const handleExecuteMartialMove = (form: typeof MARTIAL_ARTS_FORMS[number], move: typeof MARTIAL_ARTS_FORMS[number]['moves'][number]) => {
    ensureTelemetryExpanded();
    const naturalRank = activeChar?.knownMartialArts?.[form.id] ?? (activeChar?.skills?.martialArts ?? 0);
    const isChipEquipped = (activeChar?.equippedMartialArtChips || []).includes(form.id);
    const rank = isChipEquipped ? Math.max(3, naturalRank) : naturalRank;
    const soloPrecision = activeChar?.soloAllocation?.precisionAttack ?? 0;
    const dex = activeChar?.stats?.DEX ?? 6;
    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }

    const d10 = Math.floor(Math.random() * 10) + 1;
    const isCritSuccess = d10 === 10;
    const isCritFail = d10 === 1;
    const targetDv = move.resolutionDv;
    const totalBase = dex + rank + soloPrecision + luckSpent;
    const totalAttack = totalBase + d10;
    const margin = totalAttack - targetDv;
    const isHit = margin >= 0;

    const penaltyBreakdown: string[] = [];
    if (soloPrecision > 0) {
      penaltyBreakdown.push(`[Combat Awareness] Precision: +${soloPrecision}`);
    }

    const entry: RollEntry = {
      id: `roll-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'attack',
      weaponName: `🥋 Combo: ${move.name} (${form.name})`,
      damageFormula: move.damageBonusOrFormula || (move.criticalInjuryApplied ? `Aplica ${move.criticalInjuryApplied}` : move.effectDescription),
      distanceLabel: `DV ${move.resolutionDv} · ${move.requirements}`,
      d10,
      critDie: null,
      needsExplosionClick: isCritSuccess || isCritFail,
      explosionType: isCritSuccess ? 'crit_success' : isCritFail ? 'crit_fail' : null,
      statName: 'DEX',
      statVal: dex,
      skillName: `Martial Arts: ${form.name}`,
      skillVal: rank,
      luckSpent,
      totalAttack,
      targetDv,
      margin,
      isHit,
      isCritSuccess,
      isCritFail,
      penaltyBreakdown: penaltyBreakdown.length > 0 ? penaltyBreakdown : undefined,
      damageRolled: false
    };
    addRollEntry(entry);
  };

  // Cyberfists of Fury: Special Move combo damage
  const handleRollComboDamage = (move: typeof MARTIAL_ARTS_FORMS[number]['moves'][number]) => {
    ensureTelemetryExpanded();
    const diceMatch = move.damageBonusOrFormula?.match(/(\d+d\d+)/i);
    const formula = diceMatch ? diceMatch[1] : unarmedDmg;
    const dmgEntry = createDamageRoll(
      `Combo: ${move.name}`,
      formula,
      false,
      1,
      `move-${move.id}`,
      aimedShotTarget
    );
    addRollEntry(dmgEntry);
  };

  // Solo: Update field
  const handleUpdateSoloField = (field: string, delta: number | boolean) => {
    const current = activeChar?.soloAllocation || {
      fumbleRecovery: false,
      damageDeflection: 0,
      initiativeReaction: 0,
      precisionAttack: 0,
      spotWeakness: 0,
      threatDetection: 0
    };
    const updated = { ...current };
    if (typeof delta === 'boolean') {
      (updated as any)[field] = delta;
    } else {
      (updated as any)[field] = Math.max(0, ((updated as any)[field] || 0) + delta);
    }
    updateSoloAllocation(updated);
  };

  // Netrunner: Launch Quickhack 2077
  const handleLaunchQuickhack = (qh: Quickhack2077) => {
    ensureTelemetryExpanded();
    const roleRank = activeInterfaceRank;
    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }

    const d10 = Math.floor(Math.random() * 10) + 1;
    const isCritSuccess = d10 === 10;
    const isCritFail = d10 === 1;
    const totalAttack = roleRank + luckSpent + d10;
    const margin = totalAttack - qh.dv;
    const isHit = margin >= 0;

    const entry: RollEntry = {
      id: `roll-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'attack',
      weaponName: `⚡ Quickhack: ${qh.name} [RAM: ${qh.ramCost}]`,
      damageFormula: qh.damage || qh.effect,
      distanceLabel: `DV ${qh.dv} · Rango 50m (Neuroport)`,
      d10,
      critDie: null,
      needsExplosionClick: isCritSuccess || isCritFail,
      explosionType: isCritSuccess ? 'crit_success' : isCritFail ? 'crit_fail' : null,
      statName: 'INT',
      statVal: activeChar?.stats?.INT ?? 8,
      skillName: 'Interface (2077 Quickhack)',
      skillVal: roleRank,
      luckSpent,
      totalAttack,
      targetDv: qh.dv,
      margin,
      isHit,
      isCritSuccess,
      isCritFail,
      damageRolled: false
    };
    addRollEntry(entry);
  };

  // Netrunner: Quickhack damage
  const handleQuickhackDamage = (qh: Quickhack2077) => {
    ensureTelemetryExpanded();
    const diceMatch = qh.damage?.match(/(\d+d\d+)/i);
    const formula = diceMatch ? diceMatch[1] : '2d6';
    const dmgEntry = createDamageRoll(
      `Quickhack: ${qh.name}`,
      formula,
      false,
      1,
      `qh-${qh.id}`,
      aimedShotTarget
    );
    addRollEntry(dmgEntry);
  };

  // Throw grenade action
  const handleThrowGrenade = (grenade: typeof TACTICAL_GRENADES[number]) => {
    ensureTelemetryExpanded();
    const athletics = activeChar?.skills?.athletics ?? 0;
    const dex = activeChar?.stats?.DEX ?? 6;
    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }

    const d10 = Math.floor(Math.random() * 10) + 1;
    const isCritSuccess = d10 === 10;
    const isCritFail = d10 === 1;
    const targetDv = grenade.dv || 15;
    const totalBase = dex + athletics + luckSpent;
    const totalAttack = totalBase + d10;
    const margin = totalAttack - targetDv;
    const isHit = margin > 0;

    const entry: RollEntry = {
      id: `roll-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'attack',
      weaponName: `Granada: ${grenade.name}`,
      damageFormula: grenade.damage || 'Efecto de Área',
      distanceLabel: selectedDistance,
      d10,
      critDie: null,
      needsExplosionClick: isCritSuccess || isCritFail,
      explosionType: isCritSuccess ? 'crit_success' : isCritFail ? 'crit_fail' : null,
      statName: 'DEX',
      statVal: dex,
      skillName: 'Athletics',
      skillVal: athletics,
      luckSpent,
      totalAttack,
      targetDv,
      margin,
      isHit,
      isCritSuccess,
      isCritFail,
      damageRolled: false
    };

    addRollEntry(entry);
  };

  // Grenade damage / effect trigger
  const handleGrenadeEffect = (grenade: typeof TACTICAL_GRENADES[number]) => {
    ensureTelemetryExpanded();
    if (grenade.damage) {
      const dmg = createDamageRoll(grenade.name, grenade.damage, false, 1);
      addRollEntry(dmg);
    } else {
      const entry: RollEntry = {
        id: `roll-dmg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        timestamp: new Date().toISOString(),
        type: 'damage',
        weaponName: `Efecto: ${grenade.name}`,
        damageFormula: grenade.effect,
        diceResults: [],
        baseDamageTotal: 0,
        finalDamageTotal: 0
      };
      addRollEntry(entry);
    }
  };

  // Throw owned grenade action (deducts 1 charge)
  const handleThrowOwnedGrenade = (invItem: InventoryItem) => {
    const grenadeInfo = getGrenadeInfo(invItem);
    handleThrowGrenade(grenadeInfo);
    updateInventoryQuantity(invItem.id, -1);
  };

  // Trigger owned grenade damage / effect
  const handleOwnedGrenadeEffect = (invItem: InventoryItem) => {
    const grenadeInfo = getGrenadeInfo(invItem);
    handleGrenadeEffect(grenadeInfo);
  };

  // Add grenade from catalog to belt (adds 1 charge)
  const handleEquipGrenadeToBelt = () => {
    const selected = TACTICAL_GRENADES.find((g) => g.id === selectedCatalogGrenadeId) || TACTICAL_GRENADES[0];
    if (!selected) return;
    addConsumableCharge({
      catalogId: selected.id,
      name: selected.name,
      category: 'ammunition',
      cost: 100,
      details: selected.effect
    }, 1);
  };

  // Add drug from catalog to belt/inventory (adds 1 charge)
  const handleEquipDrugToBelt = () => {
    const selected = catalogDrugs.find((d: any) => d.name === selectedCatalogDrugId) || catalogDrugs[0];
    if (!selected) return;
    addConsumableCharge({
      catalogId: selected.id || selected.name,
      name: selected.name,
      category: 'drugs',
      cost: selected.cost || 50,
      details: selected.primaryEffect
    }, 1);
  };

  // Drug actions
  const handleInjectDrug = (drug: any) => {
    injectDrug({
      name: drug.name,
      duration: drug.duration || '1 hora',
      primaryEffect: drug.primaryEffect || '',
      secondaryEffect: drug.secondaryEffect || '',
      addictionDv: String(drug.addictionDv ?? 15)
    });

    if (drug.name.toLowerCase().includes('speedheal')) {
      const healAmount = (activeChar?.stats?.BODY ?? 6) + (activeChar?.stats?.WILL ?? 6);
      adjustHp(healAmount);
    }
  };

  const handleDrugAddictionTest = (drug: any) => {
    const targetDv = typeof drug.addictionDv === 'number'
      ? drug.addictionDv
      : parseInt(String(drug.addictionDv).replace(/\D+/g, ''), 10) || 15;

    const will = activeChar?.stats?.WILL ?? 6;
    const resist = activeChar?.skills?.resistTortureDrugs ?? 0;
    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }

    const d10 = Math.floor(Math.random() * 10) + 1;
    const isCritSuccess = d10 === 10;
    const isCritFail = d10 === 1;
    const totalAttack = will + resist + luckSpent + d10;
    const margin = totalAttack - targetDv;
    const isHit = margin >= 0;

    const entry: RollEntry = {
      id: `roll-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'attack',
      weaponName: `Adicción: ${drug.name}`,
      damageFormula: isHit ? 'Superada (Sin adicción)' : 'Fallada (Adicción adquirida)',
      distanceLabel: `Resistencia DV ${targetDv}`,
      d10,
      critDie: null,
      needsExplosionClick: isCritSuccess || isCritFail,
      explosionType: isCritSuccess ? 'crit_success' : isCritFail ? 'crit_fail' : null,
      statName: 'WILL',
      statVal: will,
      skillName: 'Resist Torture/Drugs',
      skillVal: resist,
      luckSpent,
      totalAttack,
      targetDv,
      margin,
      isHit,
      isCritSuccess,
      isCritFail,
      damageRolled: true
    };
    addRollEntry(entry);
  };

  // Add quick weapon from catalog
  const handleAddCatalogWeapon = () => {
    if (!selectedCatalogWeaponId) return;
    const found = (coreData.weapons as WeaponItem[]).find((w) => w.id === selectedCatalogWeaponId);
    if (found) {
      equipWeaponFromCatalog(found);
    }
  };

  // Filtered in-hand weapons and attacks
  const inHandWeapons = (activeChar?.equippedWeapons || []).filter((w) => (w.inHand ?? true));
  const isBrawlingInHand = activeChar?.unarmedInHand?.brawling ?? true;
  const isMartialArtsInHand = activeChar?.unarmedInHand?.martialArts ?? false;
  const hasAnyInHandAttack = inHandWeapons.length > 0 || isBrawlingInHand || isMartialArtsInHand;


  // Renderizadores de Paneles Modulares y Reordenables
  const renderLeftPanel = (id: LeftPanelId, index: number) => {
    const isCollapsed = !!collapsedBoxes[id];
    const canMoveUp = index > 0;
    const canMoveDown = index < leftColumnOrder.length - 1;

    switch (id) {
      case 'vitals':
        return (
          <CollapsibleHudCard
            key="vitals"
            id="vitals"
            title="BIOMONITOR & VITALES"
            icon={<Activity className="w-4 h-4 text-[#dc2626]" />}
            summary={`${activeChar?.currentHp ?? 0} / ${maxHp} HP${isSeriouslyWounded ? ' [GRAVE -2]' : ''}`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('vitals')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveLeftPanel('vitals', 'up')}
            onMoveDown={() => moveLeftPanel('vitals', 'down')}
            onDragStart={() => handleDragStart('left', 'vitals')}
            onDragOver={(e) => handleDragOver(e, 'vitals')}
            onDrop={() => handleDrop('left', 'vitals')}
            isDragOver={dragOverItem === 'vitals'}
            accentBorderClass={isSeriouslyWounded ? 'border-red-600/60 shadow-md shadow-red-950/40' : 'border-[#232736]'}
            extraHeaderActions={
              isSeriouslyWounded ? (
                <span className="bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#dc2626] font-mono-code text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3" /> GRAVE (-2)
                </span>
              ) : null
            }
          >
            
        <div className="space-y-3">
                    {/* HP Bar */}
          <div className="mb-3 bg-[#171923] p-3 rounded-sm border border-[#222636]">
            <div className="flex justify-between items-baseline mb-1">
              <div className="flex items-center gap-1 font-tech text-xs font-bold text-white">
                <Heart className="w-3.5 h-3.5 text-[#dc2626]" />
                <span>PUNTOS DE VIDA</span>
              </div>
              <div className="font-mono-code text-xs">
                <span className={`text-lg font-bold ${isSeriouslyWounded ? 'text-[#dc2626]' : 'text-white'}`}>
                  {activeChar?.currentHp ?? 0}
                </span>
                <span className="text-[#64748b]"> / {maxHp}</span>
              </div>
            </div>

            <div className="w-full bg-[#0c0d12] h-3 rounded-xs overflow-hidden border border-[#262b3c] p-0.5">
              <div 
                className={`h-full transition-all duration-300 ${
                  isMortallyWounded 
                    ? 'bg-[#dc2626]' 
                    : isSeriouslyWounded 
                      ? 'bg-gradient-to-r from-[#dc2626] to-[#f59e0b]' 
                      : 'bg-gradient-to-r from-[#059669] to-[#10b981]'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, ((activeChar?.currentHp ?? 0) / maxHp) * 100))}%` }}
              />
            </div>

            {/* Quick Adjust Buttons */}
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#1f2332] text-xs font-mono-code">
              <div className="flex gap-1">
                <button 
                  onClick={() => adjustHp(-5)}
                  className="px-2 py-0.5 bg-[#222534] hover:bg-[#dc2626] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1] text-[11px]"
                >
                  -5
                </button>
                <button 
                  onClick={() => adjustHp(-1)}
                  className="px-2 py-0.5 bg-[#222534] hover:bg-[#dc2626] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1] text-[11px]"
                >
                  -1
                </button>
                <button 
                  onClick={() => adjustHp(1)}
                  className="px-2 py-0.5 bg-[#222534] hover:bg-[#10b981] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1] text-[11px]"
                >
                  +1
                </button>
                <button 
                  onClick={() => adjustHp(5)}
                  className="px-2 py-0.5 bg-[#222534] hover:bg-[#10b981] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1] text-[11px]"
                >
                  +5
                </button>
              </div>
              <button 
                onClick={() => setHp(maxHp)}
                className="px-2 py-0.5 bg-[#1a1d28] hover:bg-[#10b981]/20 hover:border-[#10b981] border border-[#2b3042] text-[#94a3b8] hover:text-white rounded-xs transition-all active:scale-95 text-[10px]"
              >
                Max
              </button>
            </div>
          </div>
                    <div className="mt-2.5 bg-[#181a24] p-2.5 rounded-sm border border-[#262c3e]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-tech text-[11px] font-bold text-white uppercase flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#38bdf8]" /> ESTADO DE CARGA / SOBREPESO
              </span>
              {activeChar?.encumbranceMode && activeChar.encumbranceMode !== 'none' && (
                <span className="bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] font-mono-code text-[9px] px-1.5 py-0.5 rounded font-bold animate-pulse">
                  SOBREPESO ACTIVO
                </span>
              )}
            </div>
            <select
              value={activeChar?.encumbranceMode || 'none'}
              onChange={(e) => setEncumbranceMode(e.target.value as EncumbranceMode)}
              className="w-full bg-[#0f1016] border border-[#2e364c] text-white font-mono-code text-[11px] py-1 px-2 rounded focus:outline-none focus:border-[#38bdf8] cursor-pointer"
            >
              {(Object.keys(ENCUMBRANCE_MODES) as EncumbranceMode[]).map((key) => (
                <option key={key} value={key} className="bg-[#121319] text-white">
                  {ENCUMBRANCE_MODES[key].label}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-[#94a3b8] font-mono-code mt-1.5 leading-tight">
              {ENCUMBRANCE_MODES[activeChar?.encumbranceMode || 'none']?.description}
            </p>
          </div>
        </div>

          </CollapsibleHudCard>
        );

      case 'armor':
        return (
          <CollapsibleHudCard
            key="armor"
            id="armor"
            title="MATRIZ DE BLINDAJE & IMPACTOS"
            icon={<Shield className="w-4 h-4 text-[#38bdf8]" />}
            summary={`Cab: ${activeChar?.headArmor?.currentSp ?? 0}/${activeChar?.headArmor?.maxSp ?? 0} | Tor: ${activeChar?.bodyArmor?.currentSp ?? 0}/${activeChar?.bodyArmor?.maxSp ?? 0} SP`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('armor')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveLeftPanel('armor', 'up')}
            onMoveDown={() => moveLeftPanel('armor', 'down')}
            onDragStart={() => handleDragStart('left', 'armor')}
            onDragOver={(e) => handleDragOver(e, 'armor')}
            onDrop={() => handleDrop('left', 'armor')}
            isDragOver={dragOverItem === 'armor'}
          >
            
        <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5 mb-3">
            {/* HEAD ARMOR */}
            <div className="bg-[#171923] p-2.5 rounded-sm border border-[#222636]">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <span className="text-[9px] font-mono-code text-[#64748b] block uppercase">CABEZA</span>
                  <span className="font-tech text-xs font-bold text-white block truncate max-w-[80px]">
                    {activeChar?.headArmor?.name || 'Head'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-tech text-xl font-bold text-[#38bdf8] leading-none">
                    {activeChar?.headArmor?.currentSp ?? 0}
                  </span>
                  <span className="text-[9px] text-[#64748b] block font-mono-code">
                    /{activeChar?.headArmor?.maxSp ?? 0} <TacticalTooltip term="SP">SP</TacticalTooltip>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-[#1f2332]">
                <button
                  onClick={() => ablateArmor('head', 1)}
                  className="py-0.5 px-1 bg-[#dc2626]/10 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/30 rounded-xs font-mono-code text-[10px] font-bold transition-all text-center"
                >
                  -1
                </button>
                <button
                  onClick={() => repairArmor('head')}
                  className="py-0.5 px-1 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#2c3246] rounded-xs font-mono-code text-[10px] font-bold transition-all text-center"
                >
                  Reparar
                </button>
              </div>
            </div>

            {/* BODY ARMOR */}
            <div className="bg-[#171923] p-2.5 rounded-sm border border-[#222636]">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <span className="text-[9px] font-mono-code text-[#64748b] block uppercase">TORSO</span>
                  <span className="font-tech text-xs font-bold text-white block truncate max-w-[80px]">
                    {activeChar?.bodyArmor?.name || 'Body'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-tech text-xl font-bold text-[#38bdf8] leading-none">
                    {activeChar?.bodyArmor?.currentSp ?? 0}
                  </span>
                  <span className="text-[9px] text-[#64748b] block font-mono-code">
                    /{activeChar?.bodyArmor?.maxSp ?? 0} <TacticalTooltip term="SP">SP</TacticalTooltip>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-[#1f2332]">
                <button
                  onClick={() => ablateArmor('body', 1)}
                  className="py-0.5 px-1 bg-[#dc2626]/10 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/30 rounded-xs font-mono-code text-[10px] font-bold transition-all text-center"
                >
                  -1
                </button>
                <button
                  onClick={() => repairArmor('body')}
                  className="py-0.5 px-1 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#2c3246] rounded-xs font-mono-code text-[10px] font-bold transition-all text-center"
                >
                  Reparar
                </button>
              </div>
            </div>
          </div>
                    <div className="bg-[#181a24] p-2.5 rounded-sm border border-[#262c3e]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-tech text-[11px] font-bold text-white uppercase flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#f59e0b]" /> IMPACTO ENTRANTE
              </span>
              {damageFeedback && (
                <span className="text-[9px] font-mono-code text-[#10b981] animate-fade-in">
                  {damageFeedback}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                max="99"
                value={incomingDamageInput}
                onChange={(e) => setIncomingDamageInput(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-12 bg-[#0f1016] border border-[#2e364c] text-white font-mono-code font-bold text-center py-0.5 rounded text-xs focus:outline-none focus:border-[#dc2626]"
              />
              <button
                onClick={() => handleApplyHit('body')}
                className="flex-1 py-1 bg-[#202434] hover:bg-[#dc2626] hover:text-white text-[10px] font-tech font-bold tracking-wider text-[#cbd5e1] border border-[#2f354c] rounded-xs transition-all active:scale-95"
              >
                TORSO
              </button>
              <button
                onClick={() => handleApplyHit('head')}
                className="flex-1 py-1 bg-[#202434] hover:bg-[#dc2626] hover:text-white text-[10px] font-tech font-bold tracking-wider text-[#cbd5e1] border border-[#2f354c] rounded-xs transition-all active:scale-95"
              >
                CABEZA
              </button>
            </div>
          </div>
        </div>

          </CollapsibleHudCard>
        );

      case 'luck':
        return (
          <CollapsibleHudCard
            key="luck"
            id="luck"
            title="SUERTE (LUCK)"
            icon={<Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />}
            summary={`${activeChar?.currentLuck ?? 0} / ${activeChar?.stats?.LUCK ?? 0} pts (+${luckToSpendOnNextRoll})`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('luck')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveLeftPanel('luck', 'up')}
            onMoveDown={() => moveLeftPanel('luck', 'down')}
            onDragStart={() => handleDragStart('left', 'luck')}
            onDragOver={(e) => handleDragOver(e, 'luck')}
            onDrop={() => handleDrop('left', 'luck')}
            isDragOver={dragOverItem === 'luck'}
            extraHeaderActions={
              <button
                type="button"
                onClick={restoreLuck}
                className="text-[10px] text-[#64748b] hover:text-[#10b981] flex items-center gap-1 font-mono-code transition-colors"
                title="Restablecer Suerte a Stat Máximo"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Restaurar
              </button>
            }
          >
            
        <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-1 mb-2.5 bg-[#171923] p-2 rounded border border-[#222636]">
            {Array.from({ length: activeChar?.stats?.LUCK ?? 6 }).map((_, i) => (
              <button
                key={i}
                onClick={() => toggleLuckPip(i + 1)}
                title={`Fijar Suerte en ${i + 1}`}
                className={`w-5 h-5 rounded-xs transition-all flex items-center justify-center font-mono-code text-[10px] font-bold ${
                  i < (activeChar?.currentLuck ?? 0)
                    ? 'bg-[#f59e0b] text-black shadow-sm shadow-[#f59e0b]/40'
                    : 'bg-[#222534] text-[#64748b] hover:bg-[#2d3246]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <span className="ml-auto font-mono-code font-bold text-white text-xs">
              {activeChar?.currentLuck ?? 0} / {activeChar?.stats?.LUCK ?? 0}
            </span>
          </div>
                    <div className="bg-[#171923] p-2 rounded border border-[#222636] flex items-center justify-between">
            <span className="text-[10px] font-mono-code text-[#94a3b8]">Invertir en Tiro:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLuckToSpend(Math.max(0, luckToSpendOnNextRoll - 1))}
                className="w-5 h-5 bg-[#222534] hover:bg-[#dc2626] text-white rounded flex items-center justify-center font-bold"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className={`w-6 text-center font-mono-code font-bold text-xs ${
                luckToSpendOnNextRoll > 0 ? 'text-[#f59e0b]' : 'text-[#64748b]'
              }`}>
                +{luckToSpendOnNextRoll}
              </span>
              <button
                onClick={() => setLuckToSpend(Math.min(activeChar?.currentLuck ?? 0, luckToSpendOnNextRoll + 1))}
                className="w-5 h-5 bg-[#222534] hover:bg-[#10b981] text-white rounded flex items-center justify-center font-bold"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

          </CollapsibleHudCard>
        );

      case 'injuries':
        return (
          <CollapsibleHudCard
            key="injuries"
            id="injuries"
            title={`HERIDAS CRÍTICAS (${activeChar?.activeInjuries?.length ?? 0})`}
            icon={<Skull className="w-3.5 h-3.5 text-[#dc2626]" />}
            summary={`${activeChar?.activeInjuries?.length ?? 0} herida(s) activa(s)`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('injuries')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveLeftPanel('injuries', 'up')}
            onMoveDown={() => moveLeftPanel('injuries', 'down')}
            onDragStart={() => handleDragStart('left', 'injuries')}
            onDragOver={(e) => handleDragOver(e, 'injuries')}
            onDrop={() => handleDrop('left', 'injuries')}
            isDragOver={dragOverItem === 'injuries'}
            extraHeaderActions={
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => inflictRandomInjury('head')}
                  className="px-1.5 py-0.5 bg-[#23181d] hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/40 rounded-xs font-mono-code text-[9px] font-bold transition-all"
                >
                  + CABEZA
                </button>
                <button
                  type="button"
                  onClick={() => inflictRandomInjury('body')}
                  className="px-1.5 py-0.5 bg-[#211f17] hover:bg-[#f59e0b] hover:text-black text-[#f59e0b] border border-[#f59e0b]/40 rounded-xs font-mono-code text-[9px] font-bold transition-all"
                >
                  + CUERPO
                </button>
              </div>
            }
          >
            
                  {(activeChar?.activeInjuries?.length ?? 0) === 0 ? (
            <div className="text-center py-3 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded border border-[#222636]">
              Sin heridas críticas.
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {activeChar.activeInjuries.map((inj) => (
                <div
                  key={inj.id}
                  className={`p-2 rounded-xs border transition-all ${
                    inj.isTreated
                      ? 'bg-[#14191c] border-[#1d3328]'
                      : 'bg-[#1c1619] border-[#3b1d24]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 bg-[#25151a] rounded-xs border border-[#3e1e26]">
                        {renderInjuryIcon(inj.iconType)}
                      </div>
                      <div>
                        <div className="font-tech text-xs font-bold text-white">{inj.name}</div>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono-code">
                          <span className="text-[#64748b] uppercase">[{inj.location}]</span>
                          {inj.isTreated ? (
                            <span className="text-[#10b981] font-bold">TRATADA</span>
                          ) : (
                            <span className="text-[#dc2626] font-bold">ACTIVA</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleTreatInjury(inj.id)}
                        className={`p-0.5 rounded text-[10px] transition-colors ${
                          inj.isTreated 
                            ? 'bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/40' 
                            : 'bg-[#222534] text-[#94a3b8] hover:text-white'
                        }`}
                        title={inj.isTreated ? 'Marcar No Tratada' : 'Tratar Herida'}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeInjury(inj.id)}
                        className="p-0.5 bg-[#222534] hover:bg-[#dc2626] text-[#94a3b8] hover:text-white rounded text-[10px] transition-colors"
                        title="Eliminar Herida"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#cbd5e1] leading-tight font-sans">
                    {inj.effect}
                  </p>
                </div>
              ))}
            </div>
          )}

          </CollapsibleHudCard>
        );

      case 'cyberware':
        return (
          <CollapsibleHudCard
            key="cyberware"
            id="cyberware"
            title={`CIBERIMPLANTES (${installedCyberware.length})`}
            icon={<Zap className="w-3.5 h-3.5 text-[#a855f7]" />}
            summary={`${installedCyberware.length} implante(s) instalados`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('cyberware')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveLeftPanel('cyberware', 'up')}
            onMoveDown={() => moveLeftPanel('cyberware', 'down')}
            onDragStart={() => handleDragStart('left', 'cyberware')}
            onDragOver={(e) => handleDragOver(e, 'cyberware')}
            onDrop={() => handleDrop('left', 'cyberware')}
            isDragOver={dragOverItem === 'cyberware'}
          >
            {installedCyberware.length === 0 ? (
              <div className="text-center py-3 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded border border-[#222636]">
                Sin ciberimplantes registrados en este personaje.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {installedCyberware.map((c: any) => (
                  <div key={c.id} className="p-2 bg-[#171923] border border-[#222636] rounded-xs font-mono-code text-[11px]">
                    <div className="flex items-center justify-between font-bold text-white mb-0.5">
                      <span className="text-[#a855f7]">{c.name}</span>
                      <span className="text-[9px] text-[#64748b] uppercase">{c.type || 'Cyberware'}</span>
                    </div>
                    {c.description && (
                      <p className="text-[10px] text-[#94a3b8] leading-tight line-clamp-2">
                        {c.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CollapsibleHudCard>
        );

      case 'consumables':
        return (
          <CollapsibleHudCard
            key="consumables"
            id="consumables"
            title={`DROGAS EN SANGRE (${(activeChar?.activeDrugs || []).length})`}
            icon={<Pill className="w-3.5 h-3.5 text-[#ec4899]" />}
            summary={`${(activeChar?.activeDrugs || []).length} droga(s) activa(s)`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('consumables')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveLeftPanel('consumables', 'up')}
            onMoveDown={() => moveLeftPanel('consumables', 'down')}
            onDragStart={() => handleDragStart('left', 'consumables')}
            onDragOver={(e) => handleDragOver(e, 'consumables')}
            onDrop={() => handleDrop('left', 'consumables')}
            isDragOver={dragOverItem === 'consumables'}
          >
            
        {(activeChar?.activeDrugs || []).length === 0 ? (
          <div className="text-center py-3 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded border border-[#222636]">
            Sin drogas ni fármacos activos en el organismo.
          </div>
        ) : (
                      <div className="space-y-2">
              {activeChar.activeDrugs!.map((d) => (
                <div key={d.id} className="bg-[#100d18] p-2 rounded border border-[#a855f7]/30 font-mono-code text-[11px]">
                  <div className="flex items-center justify-between text-white font-bold mb-1">
                    <span className="text-[#c084fc]">{d.name}</span>
                    <button
                      onClick={() => removeActiveDrug(d.id)}
                      className="text-[9px] bg-[#dc2626]/20 hover:bg-[#dc2626] text-[#f87171] hover:text-white px-1.5 py-0.5 rounded transition-all"
                    >
                      Terminar
                    </button>
                  </div>
                  <div className="text-[10px] text-[#cbd5e1] leading-tight space-y-0.5">
                    <div><span className="text-[#64748b]">Duración:</span> {d.duration}</div>
                    <div><span className="text-[#10b981]">Efecto:</span> {d.primaryEffect}</div>
                    {d.secondaryEffect && (
                      <div className="text-[#f43f5e]"><span className="text-[#64748b]">Resaca:</span> {d.secondaryEffect}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
        )}

          </CollapsibleHudCard>
        );

      default:
        return null;
    }
  };

  const renderRightPanel = (id: RightPanelId, index: number, isFloating = false) => {
    const isCollapsed = isFloating ? false : !!collapsedBoxes[id];
    const canMoveUp = !isFloating && index > 0;
    const canMoveDown = !isFloating && index < rightColumnOrder.length - 1;

    switch (id) {
      case 'telemetry':
        return (
          <CollapsibleHudCard
            key="telemetry"
            id="telemetry"
            title="CONSOLA DE TELEMETRÍA (LOG DE TIRADAS)"
            icon={<Terminal className="w-4 h-4 text-cyan-400" />}
            summary={`${rollHistory.length} tiradas registradas`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('telemetry')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveRightPanel('telemetry', 'up')}
            onMoveDown={() => moveRightPanel('telemetry', 'down')}
            onDragStart={() => handleDragStart('right', 'telemetry')}
            onDragOver={(e) => handleDragOver(e, 'telemetry')}
            onDrop={() => handleDrop('right', 'telemetry')}
            isDragOver={dragOverItem === 'telemetry'}
            accentBorderClass="border-cyan-500/50 shadow-md shadow-cyan-950/30"
            extraHeaderActions={
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-0.5 bg-[#161a26] p-0.5 rounded border border-[#2b334a]">
                  <button
                    type="button"
                    onClick={() => {
                      setTelemetryDockMode('inline');
                      localStorage.setItem(STORAGE_KEY_DOCK_MODE, 'inline');
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-colors ${
                      telemetryDockMode === 'inline' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Anclar en columna principal"
                  >
                    📌 En Columna
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTelemetryDockMode('split_sticky');
                      localStorage.setItem(STORAGE_KEY_DOCK_MODE, 'split_sticky');
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-colors ${
                      telemetryDockMode === 'split_sticky' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Anclar sticky lateral"
                  >
                    📐 Sticky
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTelemetryDockMode('floating_pip');
                      localStorage.setItem(STORAGE_KEY_DOCK_MODE, 'floating_pip');
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-colors ${
                      telemetryDockMode === 'floating_pip' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Ventana flotante mini-HUD (PiP)"
                  >
                    🪟 Flotante
                  </button>
                </div>
                {rollHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={clearRollHistory}
                    className="text-[10px] font-mono-code text-[#64748b] hover:text-[#dc2626] transition-colors px-1"
                    title="Limpiar historial de tiradas"
                  >
                    LIMPIAR
                  </button>
                )}
              </div>
            }
          >
            
        <div className={`space-y-2.5 ${isFloating ? 'max-h-[500px]' : 'max-h-[360px]'} overflow-y-auto pr-1`}>
                      {rollHistory.length === 0 ? (
              <div className="text-center py-8 text-[#64748b] font-mono-code text-xs">
                Sin tiradas registradas. Selecciona una distancia y pulsa Atacar o Tirar Daño.
              </div>
            ) : (
              rollHistory.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-2.5 rounded-xs border transition-all ${
                    entry.needsExplosionClick
                      ? 'bg-[#2b181b] border-[#dc2626] shadow-md shadow-[#dc2626]/20'
                      : entry.type === 'attack'
                        ? entry.isHit
                          ? 'bg-[#141822] border-[#1d2d3e]'
                          : 'bg-[#191418] border-[#301c24]'
                        : 'bg-[#161724] border-[#262840]'
                  }`}
                >
                  {/* Banner Explosivo Diferido */}
                  {entry.needsExplosionClick && (
                    <div className="mb-2 pb-1.5 border-b border-[#dc2626]/40 text-center animate-pulse">
                      {entry.explosionType === 'crit_success' ? (
                        <div className="bg-[#10b981]/20 border border-[#10b981] p-1.5 rounded-xs text-[#10b981] font-tech font-bold text-xs">
                          <span className="flex items-center justify-center gap-1">
                            <Zap className="w-3.5 h-3.5" /> ¡10 NATURAL! DADO EXPLOSIVO
                          </span>
                          <button
                            onClick={() => triggerExplosionClick(entry.id)}
                            className="mt-1 w-full py-1 bg-[#10b981] hover:bg-[#059669] text-black font-tech font-bold tracking-wider rounded text-xs chamfer-btn transition-all"
                          >
                            🎲 APRETAR PARA TIRAR 1d10 CRÍTICO
                          </button>
                        </div>
                      ) : (
                        <div className="bg-[#dc2626]/20 border border-[#dc2626] p-1.5 rounded-xs text-[#dc2626] font-tech font-bold text-xs">
                          ⚠️ ¡1 NATURAL! PIFIA CRÍTICA
                          <button
                            onClick={() => triggerExplosionClick(entry.id)}
                            className="mt-1 w-full py-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold tracking-wider rounded text-xs chamfer-btn transition-all"
                          >
                            🎲 APRETAR PARA TIRAR 1d10 DE PIFIA
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ataque */}
                  {entry.type === 'attack' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-tech text-xs font-bold text-white truncate max-w-[200px]">
                          {entry.weaponName} {entry.isAutofire ? '[AUTOFIRE]' : ''}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded-2xs text-[9px] font-mono-code font-bold ${
                          entry.isHit 
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' 
                            : 'bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/30'
                        }`}>
                          {entry.isHit ? `IMPACTO (DV ${entry.targetDv})` : `FALLO (DV ${entry.targetDv})`}
                        </span>
                      </div>

                      <div className="text-[9px] font-mono-code text-[#38bdf8] mb-1">
                        Distancia: {entry.distanceLabel}
                      </div>

                      <div className="text-[11px] font-mono-code text-[#94a3b8] bg-[#0e1017] p-1.5 rounded border border-[#1c2232] space-y-0.5">
                        <div>
                          Base: {entry.statVal ?? 0}+{entry.skillVal ?? 0}
                          {(entry.penaltiesTotal ?? 0) > 0 && <span className="text-[#dc2626]"> -{entry.penaltiesTotal}</span>}
                          {(entry.luckSpent ?? 0) > 0 && <span className="text-[#f59e0b]"> +{entry.luckSpent}L</span>}
                          {' '}+ 1d10({entry.d10})
                          {entry.critDie !== null && entry.critDie !== undefined && (
                            <span className={entry.explosionType === 'crit_success' ? 'text-[#10b981] font-bold' : 'text-[#dc2626] font-bold'}>
                              {' '}[{entry.explosionType === 'crit_success' ? `+${entry.critDie}` : `-${entry.critDie}`}]
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-baseline pt-0.5 border-t border-[#1c2232]">
                          <span className="text-[#64748b]">Margen: {entry.margin !== undefined ? (entry.margin >= 0 ? `+${entry.margin}` : `${entry.margin}`) : 'N/A'}</span>
                          <span className="text-white font-bold text-xs">TOTAL: {entry.totalAttack}</span>
                        </div>
                      </div>

                      {entry.aimedShotTarget && entry.aimedShotTarget !== 'none' && (
                        <div className="mt-1 p-1 bg-[#2b1016] rounded border border-[#ef4444]/40 flex flex-col gap-0.5 text-[10px] font-mono-code">
                          <div className="flex items-center justify-between text-[#f87171] font-bold">
                            <span className="flex items-center gap-1">
                              <Crosshair className="w-3 h-3" />
                              {entry.aimedShotLabel || 'DISPARO APUNTADO'} (-8)
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-rose-300">ROF 1</span>
                          </div>
                          {entry.aimedShotEffectSummary && (
                            <div className="text-[9px] text-slate-300">
                              {entry.aimedShotEffectSummary}
                            </div>
                          )}
                        </div>
                      )}

                      {entry.isAutofire && entry.isHit && (
                        <div className="mt-1 p-1 bg-[#201d14] rounded border border-[#3b341d] flex items-center justify-between text-[11px] font-mono-code text-[#f59e0b]">
                          <span>MULTIPLICADOR:</span>
                          <span className="font-bold">×{entry.autofireMultiplier} (2d6)</span>
                        </div>
                      )}

                      {!entry.needsExplosionClick && !entry.damageRolled && (
                        <button
                          onClick={() => {
                            markAttackDamageRolled(entry.id);
                            const dmg = createDamageRoll(
                              entry.weaponName,
                              entry.damageFormula || '3d6',
                              entry.isAutofire,
                              entry.autofireMultiplier,
                              entry.weaponInstanceId,
                              entry.aimedShotTarget || 'none'
                            );
                            addRollEntry(dmg);
                          }}
                          className="mt-1.5 w-full py-1 bg-[#22293c] hover:bg-[#38bdf8] hover:text-black border border-[#303c58] text-[#38bdf8] font-tech font-bold text-[11px] tracking-wider rounded-xs transition-all flex items-center justify-center gap-1"
                        >
                          <Dices className="w-3 h-3" />
                          <span>TIRAR DAÑO ({entry.isAutofire ? `2d6 × ${entry.autofireMultiplier || 1}` : entry.damageFormula})</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Daño */}
                  {entry.type === 'damage' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-tech text-xs font-bold text-[#f59e0b]">
                          💥 DAÑO: {entry.weaponName}
                        </span>
                        <span className="font-tech text-base font-bold text-white leading-none">
                          {entry.finalDamageTotal} PTS
                        </span>
                      </div>

                      {entry.aimedShotTarget && entry.aimedShotTarget !== 'none' && (
                        <div className="mb-1.5 p-1 bg-[#2b1016] rounded border border-[#ef4444]/40 flex items-center justify-between text-[10px] font-mono-code text-[#f87171]">
                          <span className="flex items-center gap-1 font-bold">
                            <Crosshair className="w-3 h-3" />
                            {entry.aimedShotLabel || 'DISPARO APUNTADO'}
                          </span>
                          {entry.aimedShotTarget === 'head' && (
                            <span className="text-amber-400 font-bold">×2 DAÑO PENETRANTE</span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1 my-1.5">
                        {entry.diceResults?.map((die, idx) => (
                          <div
                            key={idx}
                            className={`w-6 h-6 rounded-xs flex items-center justify-center font-mono-code font-bold text-xs border ${
                              die === 6
                                ? 'bg-[#dc2626] border-[#f87171] text-white shadow-sm shadow-[#dc2626]/50'
                                : 'bg-[#181a26] border-[#292e42] text-[#cbd5e1]'
                            }`}
                          >
                            {die}
                          </div>
                        ))}
                        {entry.critBonusDamage ? (
                          <span className="text-[10px] font-mono-code text-[#dc2626] font-bold">
                            +5 CRÍTICO
                          </span>
                        ) : null}
                      </div>

                      {entry.isCriticalInjuryTrigger && (
                        <div className="mt-1.5 p-1.5 bg-[#2a141a] border border-[#dc2626] rounded-xs">
                          <div className="font-tech text-[11px] font-bold text-[#dc2626] flex items-center gap-1 mb-1">
                            <Skull className="w-3 h-3" /> ¡CRÍTICO EN DAÑO! (DOBLE 6+) → +5 DAÑO DIRECTO
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              onClick={() => inflictRandomInjury('head')}
                              className="py-0.5 px-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono-code text-[9px] font-bold rounded-xs transition-all text-center"
                            >
                              + GIRAR CABEZA
                            </button>
                            <button
                              onClick={() => inflictRandomInjury('body')}
                              className="py-0.5 px-1 bg-[#f59e0b] hover:bg-[#d97706] text-black font-mono-code text-[9px] font-bold rounded-xs transition-all text-center"
                            >
                              + GIRAR CUERPO
                            </button>
                          </div>
                        </div>
                      )}

                      {entry.aimedShotTarget === 'head' && (
                        <HeadshotCalculator entry={entry} />
                      )}
                    </div>
                  )}

                  <div className="text-[8px] font-mono-code text-[#64748b] mt-1 text-right">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              ))
            )}
        </div>

          </CollapsibleHudCard>
        );

      case 'inHand':
        return (
          <CollapsibleHudCard
            key="inHand"
            id="inHand"
            title="ESTACIÓN DE ATAQUE // EN MANO"
            icon={<Crosshair className="w-4 h-4 text-[#38bdf8]" />}
            summary={`${inHandWeapons.length + (isBrawlingInHand ? 1 : 0) + (isMartialArtsInHand ? 1 : 0)} ataque(s) listo(s)`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('inHand')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveRightPanel('inHand', 'up')}
            onMoveDown={() => moveRightPanel('inHand', 'down')}
            onDragStart={() => handleDragStart('right', 'inHand')}
            onDragOver={(e) => handleDragOver(e, 'inHand')}
            onDrop={() => handleDrop('right', 'inHand')}
            isDragOver={dragOverItem === 'inHand'}
          >
            
        <div className="space-y-4">
                        {!hasAnyInHandAttack && (
                <div className="chamfer-card p-6 text-center text-[#64748b] font-mono-code text-xs bg-[#121319] border border-[#232736]">
                  No hay armas ni ataques seleccionados "En Mano".<br />
                  Usa el <strong>Rack Táctico de la derecha</strong> para poner armas o puños en mano.
                </div>
              )}

              {/* Selector Táctico de Disparo Apuntado (Aimed Shot) */}
              <div className="chamfer-card p-3 bg-[#13151f] border border-[#262c3e] space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-[#ef4444]" />
                    <span className="font-tech text-xs font-bold text-white uppercase tracking-wider">
                      MODO DE DISPARO / ATAQUE APUNTADO
                    </span>
                    {aimedShotTarget !== 'none' && (
                      <span className="bg-[#ef4444]/20 border border-[#ef4444]/60 text-[#f87171] text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs">
                        PENALIZADOR ACTIVO: -8 (ROF 1)
                      </span>
                    )}
                  </div>
                  {aimedShotTarget !== 'none' && (
                    <button
                      type="button"
                      onClick={() => setAimedShotTarget('none')}
                      className="text-[9px] font-mono-code text-[#94a3b8] hover:text-white bg-[#1a1e2a] border border-[#2b334a] hover:border-[#ef4444] px-2 py-0.5 rounded-xs transition-colors"
                    >
                      Restablecer a Normal
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(Object.keys(AIMED_SHOT_OPTIONS) as AimedShotTarget[]).map((key) => {
                    const opt = AIMED_SHOT_OPTIONS[key];
                    const isSelected = aimedShotTarget === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setAimedShotTarget(key)}
                        className={`py-1.5 px-2 rounded-xs font-mono-code text-[11px] font-bold text-left transition-all border flex flex-col justify-between min-h-[48px] ${
                          isSelected
                            ? key === 'none'
                              ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981] shadow-sm shadow-[#10b981]/20'
                              : 'bg-[#ef4444]/20 border-[#ef4444] text-white shadow-sm shadow-[#ef4444]/30'
                            : 'bg-[#171a26] border-[#252b3e] text-[#94a3b8] hover:text-white hover:border-[#38bdf8]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{opt.shortBadge}</span>
                          <span className={`text-[9px] px-1 py-0.2 rounded-xs ${
                            opt.penalty > 0 ? 'bg-[#ef4444]/30 text-[#f87171]' : 'bg-[#10b981]/30 text-[#34d399]'
                          }`}>
                            {opt.penalty > 0 ? `-${opt.penalty}` : '0'}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#64748b] truncate">
                          {opt.forceRof1 ? 'ROF 1 · Sin Auto' : 'ROF Normal'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Panel Iluminado de Beneficio Táctico */}
                {aimedShotTarget !== 'none' && (
                  <div className="p-2.5 rounded-xs bg-[#241318] border border-[#ef4444]/40 text-[10px] font-mono-code text-[#cbd5e1] space-y-1 animate-fade-in shadow-inner">
                    <div className="flex items-center justify-between font-tech text-[11px] font-bold text-[#f87171]">
                      <span className="flex items-center gap-1.5">
                        <Crosshair className="w-3.5 h-3.5 text-[#ef4444]" />
                        {AIMED_SHOT_OPTIONS[aimedShotTarget].label}
                      </span>
                      <span className="text-amber-400">{AIMED_SHOT_OPTIONS[aimedShotTarget].benefitTitle}</span>
                    </div>
                    <p className="text-slate-300 leading-snug">
                      {AIMED_SHOT_OPTIONS[aimedShotTarget].benefitDescription}
                    </p>
                    <div className="pt-1 border-t border-[#3b1d24] flex items-center justify-between text-[9px] text-[#94a3b8]">
                      <span>Regla: {AIMED_SHOT_OPTIONS[aimedShotTarget].onHitMechanicalRule}</span>
                      <span className="text-[#ef4444] font-bold">Penalizador directo: -8</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tarjetas de Armas En Mano */}
              {inHandWeapons.map((w) => {
                const isRanged = w.type === 'Ranged';
                const hasMag = (w.standardMag ?? 0) > 0;
                const isAuto = !!autofireByWeapon[w.instanceId];
                const autofireRules = getAutofireRulesSummary(w);
                const breakdown = calculateWeaponAttackBreakdown(activeChar, w, isAuto);
                const currentDv = getDvForWeapon(w, selectedDistance, isAuto);
                const profileKey = getWeaponProfileKey(w.name, w.type);
                const profile = profileKey ? WEAPON_RANGE_PROFILES[profileKey] : null;
                const placeholderType = getItemPlaceholderType(w);
                const isOutOfAmmo = isRanged && (w.currentMag ?? 0) <= 0;
                const aimedPenalty = aimedShotTarget !== 'none' ? 8 : 0;
                const effectiveRof = aimedShotTarget !== 'none' ? 1 : w.rof;
                const netBaseWithLuck = breakdown.netBase - aimedPenalty + luckToSpendOnNextRoll;
                const selectedAmmoMeta = AMMO_TYPE_CATALOG.find((a) => a.id === (w.loadedAmmoType || 'Basic'));

                // Find optimal range
                let minDv: number | null = null;
                if (profile) {
                  RANGE_BRACKETS.forEach((b) => {
                    const dv = isAuto && profile.autofireDvs ? profile.autofireDvs[b.range] : profile.dvs[b.range];
                    if (dv !== null && (minDv === null || dv < minDv)) {
                      minDv = dv;
                    }
                  });
                }

                const isExpanded = inHandExpanded[w.instanceId] !== undefined ? inHandExpanded[w.instanceId] : true;
                const currentSubTab = inHandSubTab[w.instanceId] || (isRanged && hasMag ? 'ammo' : 'dv');

                return (
                  <div
                    key={w.instanceId}
                    className="chamfer-card p-4 bg-[#141620] border border-[#38bdf8]/40 shadow-sm shadow-[#38bdf8]/10 transition-all space-y-3"
                  >
                    {/* Fila 1: Cabecera Clicable para Abrir / Cerrar Dropdown */}
                    <div 
                      onClick={() => toggleInHandExpanded(w.instanceId)}
                      className="flex items-start justify-between gap-2 cursor-pointer group/header select-none"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div className="pt-0.5">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-[#38bdf8]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[#64748b] group-hover/header:text-[#38bdf8]" />
                          )}
                        </div>
                        <ItemVisualPlaceholder type={placeholderType} size="sm" />
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-tech text-base font-bold text-white tracking-wide group-hover/header:text-[#38bdf8] transition-colors">
                              {w.name}
                            </span>
                            <span className="bg-[#38bdf8]/20 border border-[#38bdf8]/50 text-[#38bdf8] text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs">
                              EN MANO
                            </span>
                          </div>

                          {/* Píldoras Rápidas */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] font-mono-code">
                            <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs font-bold">
                              {w.damage}
                            </span>
                            <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs">
                              ROF {effectiveRof}{aimedShotTarget !== 'none' ? ' (Apuntado)' : ''}
                            </span>
                            {isRanged && hasMag && (
                              <span className={`px-1.5 py-0.5 rounded-xs border font-bold ${
                                isOutOfAmmo 
                                  ? 'bg-[#dc2626]/20 border-[#dc2626] text-[#f87171]' 
                                  : (w.currentMag ?? 0) <= (w.standardMag ?? 0) * 0.25 
                                    ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d]' 
                                    : 'bg-[#1b1f2e] border-[#272e42] text-[#38bdf8]'
                              }`}>
                                Balas: {w.currentMag ?? 0}/{w.standardMag ?? 0}
                              </span>
                            )}
                            <span className={`px-1.5 py-0.5 rounded-xs border font-bold ${
                              currentDv !== null ? 'bg-[#1b1f2e] border-[#272e42] text-[#38bdf8]' : 'bg-[#1c1417] border-[#3b1d24] text-[#94a3b8]'
                            }`}>
                              DV actual: {w.type === 'Melee' ? 'DV 13' : currentDv !== null ? `DV ${currentDv}` : 'N/A'} ({selectedDistance})
                            </span>
                            <span className="bg-[#121c18] border border-[#1d3b2b] text-[#10b981] px-1.5 py-0.5 rounded-xs font-bold">
                              Base: +{netBaseWithLuck}{aimedPenalty > 0 ? ' (-8)' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botones de Cabecera: Quitar de Mano y Toggle */}
                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleInHandExpanded(w.instanceId)}
                          className="text-[10px] font-mono-code text-[#94a3b8] hover:text-white bg-[#1a1e2a] border border-[#293246] px-2 py-0.5 rounded-xs transition-colors"
                        >
                          {isExpanded ? '▴ Cerrar' : '▾ Opciones'}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWeaponInHand(w.instanceId)}
                          className="text-[10px] font-mono-code text-[#94a3b8] hover:text-[#f87171] border border-[#2b334a] hover:border-[#dc2626] px-2 py-0.5 rounded-xs transition-colors"
                          title="Quitar arma de la mano lista"
                        >
                          Quitar de Mano
                        </button>
                      </div>
                    </div>

                    {/* Fila 2: Botones de Disparo / Ataque Siempre a Mano */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-[#1f2334]">
                      <button
                        disabled={isOutOfAmmo || (currentDv === null && w.type !== 'Melee')}
                        onClick={() => handleAttackClick(w, w.instanceId)}
                        className={`sm:col-span-6 py-2 px-3 font-tech font-bold tracking-wider text-xs chamfer-btn transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                          isOutOfAmmo || (currentDv === null && w.type !== 'Melee')
                            ? 'bg-[#1e212c] text-[#64748b] cursor-not-allowed border border-[#282d3e]'
                            : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-md shadow-[#dc2626]/20'
                        }`}
                      >
                        <Crosshair className="w-4 h-4" />
                        <span>1. ATACAR 1d10 ({w.type === 'Melee' ? 'DV 13' : currentDv !== null ? `DV ${currentDv}` : 'Fuera Rango'}){aimedShotTarget !== 'none' ? ` [${AIMED_SHOT_OPTIONS[aimedShotTarget].shortBadge} -8]` : ''}</span>
                      </button>

                      <button
                        onClick={() => handleDamageClick(w, w.instanceId)}
                        className={`${autofireRules.supportsAutofire ? 'sm:col-span-4' : 'sm:col-span-6'} py-2 px-3 bg-[#1d2232] hover:bg-[#252c42] hover:border-[#38bdf8] border border-[#2a3248] text-[#38bdf8] font-tech font-bold tracking-wider text-xs chamfer-btn transition-all active:scale-95 flex items-center justify-center gap-1.5`}
                      >
                        <Dices className="w-4 h-4" />
                        <span>2. TIRAR DAÑO ({isAuto ? '2d6 × Auto' : w.damage})</span>
                      </button>

                      {autofireRules.supportsAutofire && (
                        <button
                          type="button"
                          disabled={aimedShotTarget !== 'none'}
                          onClick={() => toggleWeaponAutofire(w.instanceId)}
                          className={`sm:col-span-2 py-2 px-1 rounded-xs font-tech font-bold text-[11px] tracking-wider transition-all flex items-center justify-center gap-1 ${
                            aimedShotTarget !== 'none'
                              ? 'bg-[#181a24] text-[#475569] border border-[#232738] cursor-not-allowed opacity-50'
                              : isAuto
                              ? 'bg-[#f59e0b] text-black shadow-sm shadow-[#f59e0b]/40'
                              : 'bg-[#222534] text-[#94a3b8] hover:text-white border border-[#2e3448]'
                          }`}
                          title={aimedShotTarget !== 'none' ? 'Autofire no permitido en disparos apuntados' : 'Alternar modo de Fuego Automático (10 balas)'}
                        >
                          <Zap className="w-3 h-3" />
                          <span>{aimedShotTarget !== 'none' ? 'AUTO (BLOQ)' : isAuto ? 'AUTO: ON' : 'AUTO'}</span>
                        </button>
                      )}
                    </div>

                    {/* Dropdown Desplegable del Arma en Mano (Sub-pestañas tácticas) */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-[#1f2434] space-y-3 animate-fade-in">
                        {/* Barra de Sub-pestañas */}
                        <div className="flex flex-wrap items-center gap-1">
                          {isRanged && hasMag && (
                            <button
                              type="button"
                              onClick={() => setWeaponSubTab(w.instanceId, 'ammo')}
                              className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all ${
                                currentSubTab === 'ammo'
                                  ? 'bg-[#38bdf8] text-black shadow-sm'
                                  : 'bg-[#181b26] text-[#94a3b8] hover:text-white border border-[#232738]'
                              }`}
                            >
                              🔋 MUNICIÓN & CARGADOR
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setWeaponSubTab(w.instanceId, 'dv')}
                            className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all ${
                              currentSubTab === 'dv'
                                ? 'bg-[#38bdf8] text-black shadow-sm'
                                : 'bg-[#181b26] text-[#94a3b8] hover:text-white border border-[#232738]'
                            }`}
                          >
                            📏 DISTANCIAS DV & FÓRMULA
                          </button>
                          <button
                            type="button"
                            onClick={() => setWeaponSubTab(w.instanceId, 'autofire')}
                            className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all ${
                              currentSubTab === 'autofire'
                                ? 'bg-[#38bdf8] text-black shadow-sm'
                                : 'bg-[#181b26] text-[#94a3b8] hover:text-white border border-[#232738]'
                            }`}
                          >
                            🔥 AUTOFIRE & DATOS TÉCNICOS
                          </button>
                          <button
                            type="button"
                            onClick={() => setWeaponSubTab(w.instanceId, 'all')}
                            className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all ${
                              currentSubTab === 'all'
                                ? 'bg-[#38bdf8] text-black shadow-sm'
                                : 'bg-[#181b26] text-[#94a3b8] hover:text-white border border-[#232738]'
                            }`}
                          >
                            📋 VER TODO
                          </button>
                        </div>

                        {/* SECCIÓN A: MUNICIÓN & CARGADOR */}
                        {isRanged && hasMag && (currentSubTab === 'ammo' || currentSubTab === 'all') && (
                          <div className="p-3 bg-[#10121a] rounded border border-[#22283a] space-y-2.5">
                            <div className="flex items-center justify-between pb-1 border-b border-[#1b202e]">
                              <span className="font-tech text-xs font-bold text-[#38bdf8] flex items-center gap-1.5 uppercase">
                                🔋 MUNICIÓN, CARGADOR & BALAS
                              </span>
                            </div>

                            <AmmoCartridgeVisualizer
                              currentMag={w.currentMag ?? 0}
                              standardMag={w.standardMag ?? 0}
                              reserveAmmo={w.reserveAmmo ?? 36}
                              onAdjustMag={(delta) => adjustWeaponMag(w.instanceId, delta)}
                              onAdjustReserve={(delta) => adjustWeaponReserveAmmo(w.instanceId, delta)}
                              onReload={() => reloadWeapon(w.instanceId)}
                            />

                            <div className="bg-[#141724] p-2.5 rounded border border-[#232a3d]">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-mono-code text-[#64748b] uppercase">TIPO DE BALA CARGADA:</span>
                                <select
                                  value={w.loadedAmmoType || 'Basic'}
                                  onChange={(e) => setWeaponAmmoType(w.instanceId, e.target.value)}
                                  className="bg-[#171923] border border-[#2b334a] text-white text-[11px] font-mono-code rounded px-2 py-0.5 focus:outline-none focus:border-[#38bdf8]"
                                >
                                  {AMMO_TYPE_CATALOG.map((ammo) => (
                                    <option key={ammo.id} value={ammo.id}>
                                      {ammo.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {selectedAmmoMeta && (
                                <div className="text-[10px] font-mono-code text-[#38bdf8] mt-1.5 bg-[#131b26] p-1.5 rounded border border-[#1f2f45]">
                                  💡 {selectedAmmoMeta.shortRule}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* SECCIÓN B: DISTANCIAS DV & FÓRMULA */}
                        {(currentSubTab === 'dv' || currentSubTab === 'all') && (
                          <div className="p-3 bg-[#10121a] rounded border border-[#22283a] space-y-2.5">
                            <div className="flex items-center justify-between pb-1 border-b border-[#1b202e]">
                              <span className="font-tech text-xs font-bold text-[#38bdf8] flex items-center gap-1.5 uppercase">
                                📏 FÓRMULA EN VIVO & TABLA DV
                              </span>
                            </div>

                            {/* Fórmula en vivo */}
                            <div className="bg-[#101218] p-2.5 rounded border border-[#1f2434] text-xs font-mono-code flex flex-wrap items-center justify-between gap-2">
                              <div className="text-[#94a3b8]">
                                Base: <strong className="text-white">{breakdown.statKey} ({breakdown.statVal})</strong> +{' '}
                                <strong className="text-white">{breakdown.skillLabel} ({breakdown.skillVal})</strong>
                                {breakdown.totalPenalty > 0 && (
                                  <span className="text-[#dc2626]"> - Pen ({breakdown.totalPenalty})</span>
                                )}
                                {luckToSpendOnNextRoll > 0 && (
                                  <span className="text-[#f59e0b]"> + Luck ({luckToSpendOnNextRoll})</span>
                                )}
                              </div>
                              <div className="text-white font-bold bg-[#1a2030] px-2 py-0.5 rounded border border-[#2b344c]">
                                BASE TOTAL: <span className="text-[#10b981]">+{netBaseWithLuck}</span>
                              </div>
                            </div>

                            {/* Escalera de Distancias DV */}
                            {isRanged && profile ? (
                              <div>
                                <div className="text-[10px] font-mono-code text-[#64748b] mb-1 uppercase flex justify-between">
                                  <span>ESCALERA DV PARA {w.name}</span>
                                  <span className="text-[#f59e0b]">★ = DV MÍNIMO</span>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center font-mono-code text-xs">
                                  {RANGE_BRACKETS.map((b) => {
                                    const dvVal = isAuto && profile.autofireDvs 
                                      ? profile.autofireDvs[b.range] 
                                      : profile.dvs[b.range];
                                    const isCur = selectedDistance === b.range;
                                    const isOptimal = dvVal !== null && minDv !== null && dvVal === minDv;
                                    
                                    return (
                                      <div
                                        key={b.range}
                                        onClick={() => setSelectedDistance(b.range)}
                                        className={`p-1 rounded-xs border cursor-pointer transition-all ${
                                          isCur
                                            ? 'bg-[#dc2626]/20 border-[#dc2626] text-white font-bold'
                                            : dvVal !== null 
                                              ? 'bg-[#101218] border-[#202534] text-[#94a3b8] hover:border-[#3a445e]' 
                                              : 'bg-[#0b0c10] border-[#161822] text-[#475569]'
                                        }`}
                                      >
                                        <div className="text-[9px] text-[#64748b]">{b.range}</div>
                                        <div className={`font-bold ${dvVal !== null ? (isCur ? 'text-[#dc2626]' : 'text-white') : 'text-[#475569]'}`}>
                                          {dvVal !== null ? `DV ${dvVal}` : 'N/A'}
                                        </div>
                                        {isOptimal && (
                                          <div className="text-[8px] text-[#f59e0b] font-bold">★ ÓPTIMO</div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="text-[11px] font-mono-code text-[#cbd5e1] bg-[#141724] p-2 rounded border border-[#232a3d]">
                                Ataque cuerpo a cuerpo / Melee: DV fijo 13 o Enfrentado a la Evasión del rival.
                              </div>
                            )}
                          </div>
                        )}

                        {/* SECCIÓN C: AUTOFIRE & DATOS TÉCNICOS */}
                        {(currentSubTab === 'autofire' || currentSubTab === 'all') && (
                          <div className="p-3 bg-[#10121a] rounded border border-[#22283a] space-y-2.5">
                            <div className="flex items-center justify-between pb-1 border-b border-[#1b202e]">
                              <span className="font-tech text-xs font-bold text-[#f59e0b] flex items-center gap-1.5 uppercase">
                                🔥 AUTOFIRE & REGLAS TÉCNICAS
                              </span>
                            </div>

                            {autofireRules.supportsAutofire ? (
                              <div className="bg-[#181926] p-2.5 rounded border border-[#26283e]">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-tech text-xs font-bold text-[#f59e0b] uppercase flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-[#f59e0b]" /> FUEGO AUTOMÁTICO (AUTOFIRE)
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => toggleWeaponAutofire(w.instanceId)}
                                    className={`px-2 py-0.5 rounded-xs font-tech font-bold text-xs tracking-wider transition-all ${
                                      isAuto
                                        ? 'bg-[#f59e0b] text-black shadow-sm shadow-[#f59e0b]/40'
                                        : 'bg-[#222534] text-[#94a3b8] hover:text-white border border-[#2e3448]'
                                    }`}
                                  >
                                    {isAuto ? '🔥 MODO AUTOFIRE ACTIVO' : '⚡ ACTIVAR AUTOFIRE'}
                                  </button>
                                </div>
                                <div className="text-[10px] font-mono-code text-[#cbd5e1] leading-tight space-y-0.5">
                                  <div><strong className="text-[#64748b]">Habilidad:</strong> {autofireRules.skillUsed} | <strong className="text-[#64748b]">Gasto:</strong> {autofireRules.ammoCost} balas</div>
                                  <div className="text-[#f59e0b]">{autofireRules.damageRule}</div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-[10px] font-mono-code text-[#64748b] bg-[#141724] p-2 rounded border border-[#232a3d]">
                                Esta arma no cuenta con modo Autofire.
                              </div>
                            )}

                            {/* Datos Técnicos */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono-code pt-1">
                              <div className="bg-[#141724] p-2 rounded border border-[#232a3d]">
                                <span className="text-[#64748b] block">TIPO:</span>
                                <strong className="text-white">{w.type}</strong>
                              </div>
                              <div className="bg-[#141724] p-2 rounded border border-[#232a3d]">
                                <span className="text-[#64748b] block">HABILIDAD:</span>
                                <strong className="text-white">{breakdown.skillLabel}</strong>
                              </div>
                              <div className="bg-[#141724] p-2 rounded border border-[#232a3d]">
                                <span className="text-[#64748b] block">MANOS:</span>
                                <strong className="text-white">{w.hands || 1}H</strong>
                              </div>
                              <div className="bg-[#141724] p-2 rounded border border-[#232a3d]">
                                <span className="text-[#64748b] block">OCULTABLE:</span>
                                <strong className="text-white">{w.concealable ? 'Sí' : 'No'}</strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}

              {/* Tarjeta de Puños / Brawling En Mano */}
              {isBrawlingInHand && (
                <div className="chamfer-card p-4 bg-[#141620] border border-[#f59e0b]/40 shadow-sm shadow-[#f59e0b]/10 transition-all space-y-3">
                  {/* Fila 1: Cabecera Clicable */}
                  <div 
                    onClick={() => toggleUnarmedInHandExpanded('brawling')}
                    className="flex items-start justify-between gap-2 cursor-pointer group/brawl select-none"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="pt-0.5">
                        {unarmedInHandExpanded.brawling ? (
                          <ChevronDown className="w-4 h-4 text-[#f59e0b]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#64748b] group-hover/brawl:text-[#f59e0b]" />
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-tech text-base font-bold text-white tracking-wide group-hover/brawl:text-[#f59e0b] transition-colors">
                            🥊 Puños & Pelea Desarmada (Brawling)
                          </span>
                          <span className="bg-[#f59e0b]/20 border border-[#f59e0b]/50 text-[#f59e0b] text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs">
                            EN MANO
                          </span>
                        </div>

                        {/* Píldoras Rápidas */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] font-mono-code">
                          <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs font-bold">
                            Daño: {unarmedDmg}
                          </span>
                          <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs">
                            ROF {aimedShotTarget !== 'none' ? '1 (Apuntado)' : '2'}
                          </span>
                          <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs">
                            DV 13
                          </span>
                          <span className="bg-[#121c18] border border-[#1d3b2b] text-[#10b981] px-1.5 py-0.5 rounded-xs font-bold">
                            Base: +{(activeChar?.stats?.DEX ?? 6) + (activeChar?.skills?.brawling ?? 0) + luckToSpendOnNextRoll - (aimedShotTarget !== 'none' ? 8 : 0)}{aimedShotTarget !== 'none' ? ' (-8)' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => toggleUnarmedInHandExpanded('brawling')}
                        className="text-[10px] font-mono-code text-[#94a3b8] hover:text-white bg-[#1a1e2a] border border-[#293246] px-2 py-0.5 rounded-xs transition-colors"
                      >
                        {unarmedInHandExpanded.brawling ? '▴ Cerrar' : '▾ Opciones'}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleUnarmedInHand('brawling')}
                        className="text-[10px] font-mono-code text-[#94a3b8] hover:text-[#f87171] border border-[#2b334a] hover:border-[#dc2626] px-2 py-0.5 rounded-xs transition-colors"
                      >
                        Quitar de Mano
                      </button>
                    </div>
                  </div>

                  {/* Fila 2: Botones de Ataque Rápido */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1f2334]">
                    <button
                      onClick={handleBrawlingAttack}
                      className="py-2 px-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Crosshair className="w-4 h-4" />
                      <span>1. ATACAR 1d10 (DV 13){aimedShotTarget !== 'none' ? ` [${AIMED_SHOT_OPTIONS[aimedShotTarget].shortBadge} -8]` : ''}</span>
                    </button>
                    <button
                      onClick={handleBrawlingDamage}
                      className="py-2 px-3 bg-[#1d2232] hover:bg-[#252c42] border border-[#2a3248] text-[#38bdf8] font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Dices className="w-4 h-4" />
                      <span>2. TIRAR DAÑO ({unarmedDmg})</span>
                    </button>
                  </div>

                  {/* Dropdown Desplegable: Fórmula y Maniobras Especiales */}
                  {unarmedInHandExpanded.brawling && (
                    <div className="pt-2 border-t border-[#1f2434] space-y-2.5 animate-fade-in">
                      <div className="bg-[#101218] p-2.5 rounded border border-[#1f2434] text-xs font-mono-code flex items-center justify-between">
                        <span className="text-[#94a3b8]">
                          Base: DEX ({activeChar?.stats?.DEX ?? 6}) + Brawling ({activeChar?.skills?.brawling ?? 0})
                          {luckToSpendOnNextRoll > 0 && <span className="text-[#f59e0b]"> + Luck ({luckToSpendOnNextRoll})</span>}
                        </span>
                        <span className="text-white font-bold bg-[#1a2030] px-2 py-0.5 rounded border border-[#2b344c]">
                          TOTAL: <span className="text-[#10b981]">{(activeChar?.stats?.DEX ?? 6) + (activeChar?.skills?.brawling ?? 0) + luckToSpendOnNextRoll}</span>
                        </span>
                      </div>

                      <div className="p-2.5 bg-[#10121a] rounded border border-[#22283a] space-y-2">
                        <span className="font-tech text-xs font-bold text-[#f59e0b] uppercase block">
                          🤼 MANIOBRAS ESPECIALES DE CUERPO A CUERPO
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            onClick={handleGrapple}
                            className="py-1.5 px-2 bg-[#2a1e16] hover:bg-[#f59e0b] hover:text-black border border-[#52351c] text-[#f59e0b] font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-all"
                            title="Inmovilizar al rival en presa enfrentada"
                          >
                            🤼 GRAPPLE (Presa Enfrentada)
                          </button>
                          <button
                            onClick={handleChoke}
                            className="py-1.5 px-2 bg-[#25151c] hover:bg-[#dc2626] hover:text-white border border-[#4a1c29] text-[#f43f5e] font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-all"
                            title={`Ahorcar: ${activeChar?.stats?.BODY ?? 6} HP directos ignorando SP`}
                          >
                            <Skull className="w-3.5 h-3.5" /> CHOKE ({activeChar?.stats?.BODY ?? 6} HP Directos)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tarjeta de Artes Marciales En Mano */}
              {isMartialArtsInHand && (
                <div className="chamfer-card p-4 bg-[#141620] border border-[#10b981]/40 shadow-sm shadow-[#10b981]/10 transition-all space-y-3">
                  {/* Fila 1: Cabecera Clicable */}
                  <div 
                    onClick={() => toggleUnarmedInHandExpanded('martialArts')}
                    className="flex items-start justify-between gap-2 cursor-pointer group/ma select-none"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="pt-0.5">
                        {unarmedInHandExpanded.martialArts ? (
                          <ChevronDown className="w-4 h-4 text-[#10b981]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#64748b] group-hover/ma:text-[#10b981]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-tech text-base font-bold text-white tracking-wide group-hover/ma:text-[#10b981] transition-colors">
                            🥋 Artes Marciales (Martial Arts)
                          </span>
                          <span className="bg-[#10b981]/20 border border-[#10b981]/50 text-[#10b981] text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs">
                            IGNORA 50% SP
                          </span>
                        </div>

                        {/* Píldoras Rápidas */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] font-mono-code">
                          <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs font-bold">
                            Daño: {unarmedDmg}
                          </span>
                          <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs">
                            ROF {aimedShotTarget !== 'none' ? '1 (Apuntado)' : '2'}
                          </span>
                          <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs">
                            DV 13
                          </span>
                          <span className="bg-[#121c18] border border-[#1d3b2b] text-[#10b981] px-1.5 py-0.5 rounded-xs font-bold">
                            Base: +{(activeChar?.stats?.DEX ?? 6) + (activeChar?.skills?.martialArts ?? 0) + luckToSpendOnNextRoll - (aimedShotTarget !== 'none' ? 8 : 0)}{aimedShotTarget !== 'none' ? ' (-8)' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => toggleUnarmedInHandExpanded('martialArts')}
                        className="text-[10px] font-mono-code text-[#94a3b8] hover:text-white bg-[#1a1e2a] border border-[#293246] px-2 py-0.5 rounded-xs transition-colors"
                      >
                        {unarmedInHandExpanded.martialArts ? '▴ Cerrar' : '▾ Opciones'}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleUnarmedInHand('martialArts')}
                        className="text-[10px] font-mono-code text-[#94a3b8] hover:text-[#f87171] border border-[#2b334a] hover:border-[#dc2626] px-2 py-0.5 rounded-xs transition-colors"
                      >
                        Quitar de Mano
                      </button>
                    </div>
                  </div>

                  {/* Fila 2: Botones de Ataque Rápido */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1f2334]">
                    <button
                      onClick={handleMartialArtsAttack}
                      className="py-2 px-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Crosshair className="w-4 h-4" />
                      <span>1. ATACAR 1d10 (DV 13){aimedShotTarget !== 'none' ? ` [${AIMED_SHOT_OPTIONS[aimedShotTarget].shortBadge} -8]` : ''}</span>
                    </button>
                    <button
                      onClick={handleMartialArtsDamage}
                      className="py-2 px-3 bg-[#1d2232] hover:bg-[#252c42] border border-[#2a3248] text-[#10b981] font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Dices className="w-4 h-4" />
                      <span>2. TIRAR DAÑO ({unarmedDmg})</span>
                    </button>
                  </div>

                  {/* Dropdown Desplegable: Fórmula y Reglas */}
                  {unarmedInHandExpanded.martialArts && (
                    <div className="pt-2 border-t border-[#1f2434] space-y-2.5 animate-fade-in">
                      <div className="bg-[#101218] p-2.5 rounded border border-[#1f2434] text-xs font-mono-code flex items-center justify-between">
                        <span className="text-[#94a3b8]">
                          Base: DEX ({activeChar?.stats?.DEX ?? 6}) + Martial Arts ({activeChar?.skills?.martialArts ?? 0})
                          {luckToSpendOnNextRoll > 0 && <span className="text-[#f59e0b]"> + Luck ({luckToSpendOnNextRoll})</span>}
                        </span>
                        <span className="text-white font-bold bg-[#1a2030] px-2 py-0.5 rounded border border-[#2b344c]">
                          TOTAL: <span className="text-[#10b981]">{(activeChar?.stats?.DEX ?? 6) + (activeChar?.skills?.martialArts ?? 0) + luckToSpendOnNextRoll}</span>
                        </span>
                      </div>

                      <div className="p-2.5 bg-[#10121a] rounded border border-[#22283a] text-[10px] font-mono-code text-[#cbd5e1] leading-relaxed">
                        <span className="text-[#10b981] font-bold block mb-0.5">REGLA ESPECIAL:</span>
                        Los ataques de Artes Marciales ignoran el 50% del Stopping Power (SP) del blindaje del defensor (redondeado hacia arriba a favor del defensor).
                      </div>
                    </div>
                  )}
                </div>
              )}
        </div>

          </CollapsibleHudCard>
        );

      case 'rangefinder':
        return (
          <CollapsibleHudCard
            key="rangefinder"
            id="rangefinder"
            title="TELÉMETRO DE DISTANCIA"
            icon={<Target className="w-4 h-4 text-[#f59e0b]" />}
            summary={`Distancia: ${selectedDistance}${activeBracket ? ` (${activeBracket.label.split('(')[1]?.replace(')', '') || activeBracket.label})` : ''}`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('rangefinder')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveRightPanel('rangefinder', 'up')}
            onMoveDown={() => moveRightPanel('rangefinder', 'down')}
            onDragStart={() => handleDragStart('right', 'rangefinder')}
            onDragOver={(e) => handleDragOver(e, 'rangefinder')}
            onDrop={() => handleDrop('right', 'rangefinder')}
            isDragOver={dragOverItem === 'rangefinder'}
          >
            
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 pt-2">
              {RANGE_BRACKETS.map((b) => {
                const isSelected = selectedDistance === b.range;
                return (
                  <button
                    key={b.range}
                    onClick={() => setSelectedDistance(b.range)}
                    className={`p-1 rounded-xs border text-center transition-all ${
                      isSelected 
                        ? 'bg-[#dc2626] border-[#dc2626] text-white font-bold shadow-md shadow-[#dc2626]/20' 
                        : 'bg-[#171923] border-[#242838] text-[#94a3b8] hover:border-[#3b425a] hover:text-white'
                    }`}
                  >
                    <div className="font-tech text-[11px] font-bold leading-none">{b.range}</div>
                    <div className="text-[8px] font-mono-code text-[#64748b] mt-0.5 leading-tight truncate">
                      {b.label.split('(')[1]?.replace(')', '') || ''}
                    </div>
                  </button>
                );
              })}
            </div>

          </CollapsibleHudCard>
        );

      case 'arsenalBelt':
        return (
          <CollapsibleHudCard
            key="arsenalBelt"
            id="arsenalBelt"
            title="RACK TÁCTICO & ARSENAL COMPLETO"
            icon={<Swords className="w-4 h-4 text-[#38bdf8]" />}
            summary={`${(activeChar?.equippedWeapons || []).length} armas | 💣 ${totalGrenadeCharges} | 💉 ${totalDrugCharges}`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('arsenalBelt')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveRightPanel('arsenalBelt', 'up')}
            onMoveDown={() => moveRightPanel('arsenalBelt', 'down')}
            onDragStart={() => handleDragStart('right', 'arsenalBelt')}
            onDragOver={(e) => handleDragOver(e, 'arsenalBelt')}
            onDrop={() => handleDrop('right', 'arsenalBelt')}
            isDragOver={dragOverItem === 'arsenalBelt'}
            extraHeaderActions={
              <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#64748b]" onClick={(e) => e.stopPropagation()}>
                <span>💣 {totalGrenadeCharges}</span>
                <span>💉 {totalDrugCharges}</span>
              </div>
            }
          >
            
                  {/* Filtros Rápidos */}
          <div className="flex flex-wrap gap-1 mb-3">
            {[
              { id: 'all', label: 'TODO' },
              { id: 'weapons', label: `🔫 ARMAS (${activeChar?.equippedWeapons?.length ?? 0})` },
              { id: 'unarmed', label: '🥊 PUÑOS/ARTES' },
              { id: 'throwables', label: `💣 ARROJABLES (${totalGrenadeCharges})` },
              { id: 'drugs', label: `💉 DROGAS (${totalDrugCharges})` }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setRackFilter(f.id as any)}
                className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all ${
                  rackFilter === f.id
                    ? 'bg-[#38bdf8] text-black shadow-sm'
                    : 'bg-[#181b26] text-[#94a3b8] hover:text-white border border-[#232738]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">

            {/* SECCIÓN 1: ARMAS EQUIPADAS */}
            {(rackFilter === 'all' || rackFilter === 'weapons') && (
              <div className="bg-[#151722] p-3 rounded border border-[#252a3c] space-y-2.5">
                <button
                  type="button"
                  onClick={() => toggleSection('weapons')}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="font-tech text-xs font-bold text-white uppercase flex items-center gap-1.5 group-hover:text-[#38bdf8] transition-colors">
                    {openSections.weapons ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#38bdf8]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
                    )}
                    🔫 ARMAS EQUIPADAS ({activeChar?.equippedWeapons?.length ?? 0})
                  </span>
                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    {openSections.weapons ? 'Plegar' : 'Desplegar'}
                  </span>
                </button>

                {openSections.weapons && (
                  <div className="space-y-2 pt-1">
                    {(activeChar?.equippedWeapons || []).length === 0 ? (
                      <div className="p-3 text-center border border-dashed border-[#232738] rounded text-[11px] font-mono-code text-[#64748b]">
                        No hay armas equipadas en el cinturón táctico.
                      </div>
                    ) : (
                      (activeChar?.equippedWeapons || []).map((w) => {
                        const isInHand = w.inHand ?? true;
                        const isOpen = !!openWeapons[w.instanceId];
                        return (
                          <div
                            key={w.instanceId}
                            className={`rounded border transition-all overflow-hidden ${
                              isInHand
                                ? 'bg-[#121c26] border-[#38bdf8]/50 shadow-xs'
                                : 'bg-[#10121a] border-[#202534] opacity-85'
                            }`}
                          >
                            {/* Fila Encabezado / Vista Plegada */}
                            <div className="p-2.5 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => toggleOpenWeapon(w.instanceId)}
                                className="flex items-center gap-2 min-w-0 text-left flex-1 group/wep"
                              >
                                {isOpen ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-[#64748b] group-hover/wep:text-[#38bdf8] shrink-0" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="font-tech text-xs font-bold text-white truncate group-hover/wep:text-[#38bdf8] transition-colors">
                                    {w.name}
                                  </div>
                                  <div className="text-[10px] font-mono-code text-[#94a3b8] mt-0.5 flex items-center gap-1.5 flex-wrap">
                                    <span>{w.damage}</span>
                                    <span>•</span>
                                    <span>ROF {w.rof}</span>
                                    {w.type === 'Ranged' && (
                                      <>
                                        <span>•</span>
                                        <span className="text-[#38bdf8]">
                                          {w.currentMag ?? 0}/{w.standardMag ?? 0}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </button>

                              <button
                                onClick={() => toggleWeaponInHand(w.instanceId)}
                                className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all shrink-0 flex items-center gap-1 ${
                                  isInHand
                                    ? 'bg-[#10b981]/20 hover:bg-[#dc2626] hover:text-white text-[#10b981] border border-[#10b981]/50'
                                    : 'bg-[#222534] hover:bg-[#38bdf8] hover:text-black text-white border border-[#2c3246]'
                                }`}
                                title={isInHand ? 'Quitar de la mano' : 'Poner en la mano para atacar'}
                              >
                                {isInHand ? <><Check className="w-3 h-3" /> EN MANO</> : '+ EN MANO'}
                              </button>
                            </div>

                            {/* Mini Tira de Rectángulos de Munición en vista compacta si tiene cargador */}
                            {w.type === 'Ranged' && (w.standardMag ?? 0) > 0 && !isOpen && (
                              <div className="px-2.5 pb-2 flex items-center gap-1.5">
                                <div className="flex flex-wrap items-center gap-0.5 overflow-hidden max-h-[14px]">
                                  {Array.from({ length: Math.min(w.standardMag ?? 0, 40) }).map((_, bIdx) => {
                                    const isLoaded = bIdx < (w.currentMag ?? 0);
                                    return (
                                      <span
                                        key={bIdx}
                                        className={`h-2 w-1 rounded-2xs transition-all ${
                                          isLoaded
                                            ? (w.currentMag ?? 0) <= (w.standardMag ?? 0) * 0.25
                                              ? 'bg-[#dc2626] border border-[#f87171]/80'
                                              : 'bg-[#38bdf8] border border-[#67e8f9]/80 shadow-[0_0_2px_rgba(56,189,248,0.5)]'
                                            : 'bg-slate-900/60 border border-slate-800/80 opacity-40'
                                        }`}
                                      />
                                    );
                                  })}
                                </div>
                                <span className="text-[9px] font-mono-code text-[#64748b] shrink-0 ml-auto">
                                  Res: {w.reserveAmmo ?? 36}
                                </span>
                              </div>
                            )}

                            {/* Vista Expandida (Reglas, controles de cargador y desequipar) */}
                            {isOpen && (
                              <div className="p-2.5 pt-0 border-t border-[#1a1f2e] bg-[#0c0e14] space-y-2 mt-1">
                                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-code pt-2 text-[#94a3b8]">
                                  <div>Tipo: <strong className="text-white">{w.type}</strong></div>
                                  <div>Skill: <strong className="text-white">{w.skill}</strong></div>
                                  <div>Manos: <strong className="text-white">{w.hands || 1}</strong></div>
                                  <div>Ocultable: <strong className="text-white">{w.concealable ? 'Sí' : 'No'}</strong></div>
                                </div>

                                {w.type === 'Ranged' && (w.standardMag ?? 0) > 0 && (
                                  <div className="space-y-1.5 pt-1 border-t border-[#1a1f2e]">
                                    <div className="flex items-center justify-between text-[10px] font-mono-code">
                                      <span className="text-[#64748b]">TIPO DE MUNICIÓN:</span>
                                      <select
                                        value={w.loadedAmmoType || 'Basic'}
                                        onChange={(e) => setWeaponAmmoType(w.instanceId, e.target.value)}
                                        className="bg-[#12141f] border border-[#2b334a] text-white text-[10px] font-mono-code rounded px-1.5 py-0.5 focus:outline-none focus:border-[#38bdf8]"
                                      >
                                        {AMMO_TYPE_CATALOG.map((ammo) => (
                                          <option key={ammo.id} value={ammo.id}>
                                            {ammo.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <AmmoCartridgeVisualizer
                                      currentMag={w.currentMag ?? 0}
                                      standardMag={w.standardMag ?? 0}
                                      reserveAmmo={w.reserveAmmo ?? 36}
                                      onAdjustMag={(delta) => adjustWeaponMag(w.instanceId, delta)}
                                      onAdjustReserve={(delta) => adjustWeaponReserveAmmo(w.instanceId, delta)}
                                      onReload={() => reloadWeapon(w.instanceId)}
                                    />
                                  </div>
                                )}

                                <div className="pt-2 border-t border-[#1a1f2e] flex items-center justify-between">
                                  <span className="text-[10px] font-mono-code text-[#64748b]">
                                    Coste base: {w.cost || 0} €$
                                  </span>
                                  <button
                                    onClick={() => unequipWeapon(w.instanceId)}
                                    className="px-2 py-1 bg-[#1c1822] hover:bg-[#dc2626] text-[#f87171] hover:text-white border border-[#3a2028] hover:border-[#dc2626] rounded text-[10px] font-mono-code transition-colors flex items-center gap-1"
                                    title="Quitar arma del cinturón"
                                  >
                                    <Trash2 className="w-3 h-3" /> Desequipar
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}

                    {/* Mini Selector Rápido del Catálogo */}
                    <div className="pt-2 border-t border-[#1e2332] space-y-1.5">
                      <div className="text-[10px] font-mono-code text-[#64748b]">AÑADIR ARMA DEL CATÁLOGO:</div>
                      <div className="flex gap-1.5">
                        <select
                          value={selectedCatalogWeaponId}
                          onChange={(e) => setSelectedCatalogWeaponId(e.target.value)}
                          className="flex-1 bg-[#0e1017] border border-[#2b334a] text-white text-[11px] font-mono-code rounded px-2 py-1 focus:outline-none focus:border-[#38bdf8] truncate"
                        >
                          {(coreData.weapons as WeaponItem[]).map((cw) => (
                            <option key={cw.id} value={cw.id}>
                              {cw.name} ({cw.damage}, {cw.cost} €$)
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleAddCatalogWeapon}
                          className="px-2.5 py-1 bg-[#38bdf8] hover:bg-[#0284c7] text-black font-tech font-bold text-xs rounded transition-all active:scale-95 shrink-0 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Equipar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECCIÓN 2: PUÑOS & ARTES MARCIALES */}
            {(rackFilter === 'all' || rackFilter === 'unarmed') && (
              <div className="bg-[#151722] p-3 rounded border border-[#252a3c] space-y-2.5">
                <button
                  type="button"
                  onClick={() => toggleSection('unarmed')}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="font-tech text-xs font-bold text-white uppercase flex items-center gap-1.5 group-hover:text-[#f59e0b] transition-colors">
                    {openSections.unarmed ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#f59e0b]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
                    )}
                    🥊 PELEA DESARMADA & ARTES
                  </span>
                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    {openSections.unarmed ? 'Plegar' : 'Desplegar'}
                  </span>
                </button>

                {openSections.unarmed && (
                  <div className="space-y-2 pt-1">
                    {/* Fila Brawling */}
                    <div className={`rounded border transition-all overflow-hidden ${
                      isBrawlingInHand ? 'bg-[#1e1a14] border-[#f59e0b]/50' : 'bg-[#10121a] border-[#202534] opacity-85'
                    }`}>
                      <div className="p-2.5 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleOpenUnarmed('brawling')}
                          className="flex items-center gap-2 min-w-0 text-left flex-1 group/brawl"
                        >
                          {openUnarmed.brawling ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#64748b] group-hover/brawl:text-[#f59e0b] shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-tech text-xs font-bold text-white group-hover/brawl:text-[#f59e0b] transition-colors">
                              Puños (Brawling)
                            </div>
                            <div className="text-[10px] font-mono-code text-[#94a3b8] mt-0.5">
                              Daño: <strong className="text-white">{unarmedDmg}</strong> • ROF 2
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => toggleUnarmedInHand('brawling')}
                          className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all shrink-0 flex items-center gap-1 ${
                            isBrawlingInHand
                              ? 'bg-[#f59e0b]/20 hover:bg-[#dc2626] hover:text-white text-[#f59e0b] border border-[#f59e0b]/50'
                              : 'bg-[#222534] hover:bg-[#f59e0b] hover:text-black text-white border border-[#2c3246]'
                          }`}
                        >
                          {isBrawlingInHand ? <><Check className="w-3 h-3" /> EN MANO</> : '+ EN MANO'}
                        </button>
                      </div>

                      {openUnarmed.brawling && (
                        <div className="p-2.5 pt-0 border-t border-[#262016] bg-[#0d0c0a] space-y-2 mt-1">
                          <div className="text-[10px] font-mono-code text-[#94a3b8] pt-2">
                            Base: {(activeChar?.stats?.DEX ?? 6) + (activeChar?.skills?.brawling ?? 0)} (DEX {activeChar?.stats?.DEX ?? 6} + Brawling {activeChar?.skills?.brawling ?? 0})
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={handleBrawlingAttack}
                              className="py-1 px-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-black font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1"
                            >
                              <Target className="w-3 h-3" /> ATACAR (1d10)
                            </button>
                            <button
                              onClick={handleBrawlingDamage}
                              className="py-1 px-1.5 bg-[#1e2334] hover:bg-[#2b334a] text-[#f59e0b] font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1 border border-[#3b3226]"
                            >
                              <Dices className="w-3 h-3" /> TIRAR DAÑO
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#262016]">
                            <button
                              onClick={handleGrapple}
                              className="py-1 px-1.5 bg-[#262016] hover:bg-[#f59e0b] hover:text-black text-[#fcd34d] font-mono-code text-[10px] font-bold rounded transition-all border border-[#4d3a1f]"
                            >
                              🤼 Presa / Grapple
                            </button>
                            <button
                              onClick={handleChoke}
                              className="py-1 px-1.5 bg-[#262016] hover:bg-[#dc2626] hover:text-white text-[#f87171] font-mono-code text-[10px] font-bold rounded transition-all border border-[#4d1f24]"
                            >
                              💀 Ahorcar ({activeChar?.stats?.BODY ?? 6} HP)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fila Martial Arts */}
                    <div className={`rounded border transition-all overflow-hidden ${
                      isMartialArtsInHand ? 'bg-[#121c18] border-[#10b981]/50' : 'bg-[#10121a] border-[#202534] opacity-85'
                    }`}>
                      <div className="p-2.5 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleOpenUnarmed('martialArts')}
                          className="flex items-center gap-2 min-w-0 text-left flex-1 group/ma"
                        >
                          {openUnarmed.martialArts ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#64748b] group-hover/ma:text-[#10b981] shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-tech text-xs font-bold text-white group-hover/ma:text-[#10b981] transition-colors">
                              Artes Marciales (Martial Arts)
                            </div>
                            <div className="text-[10px] font-mono-code text-[#94a3b8] mt-0.5">
                              Daño: <strong className="text-white">{unarmedDmg}</strong> • Ignora 50% SP
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => toggleUnarmedInHand('martialArts')}
                          className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all shrink-0 flex items-center gap-1 ${
                            isMartialArtsInHand
                              ? 'bg-[#10b981]/20 hover:bg-[#dc2626] hover:text-white text-[#10b981] border border-[#10b981]/50'
                              : 'bg-[#222534] hover:bg-[#10b981] hover:text-black text-white border border-[#2c3246]'
                          }`}
                        >
                          {isMartialArtsInHand ? <><Check className="w-3 h-3" /> EN MANO</> : '+ EN MANO'}
                        </button>
                      </div>

                      {openUnarmed.martialArts && (
                        <div className="p-2.5 pt-0 border-t border-[#13261f] bg-[#0a0f0d] space-y-2 mt-1">
                          <div className="text-[10px] font-mono-code text-[#94a3b8] pt-2">
                            Base: {(activeChar?.stats?.DEX ?? 6) + (activeChar?.skills?.martialArts ?? 0)} (DEX {activeChar?.stats?.DEX ?? 6} + Martial Arts {activeChar?.skills?.martialArts ?? 0})
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={handleMartialArtsAttack}
                              className="py-1 px-1.5 bg-[#10b981] hover:bg-[#059669] text-black font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1"
                            >
                              <Target className="w-3 h-3" /> ATACAR (1d10)
                            </button>
                            <button
                              onClick={handleMartialArtsDamage}
                              className="py-1 px-1.5 bg-[#1e2334] hover:bg-[#2b334a] text-[#10b981] font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1 border border-[#1f3b2d]"
                            >
                              <Dices className="w-3 h-3" /> TIRAR DAÑO
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECCIÓN 3: ÍTEMS ARROJABLES & GRANADAS */}
            {(rackFilter === 'all' || rackFilter === 'throwables') && (
              <div className="bg-[#151722] p-3 rounded border border-[#252a3c] space-y-2.5">
                <button
                  type="button"
                  onClick={() => toggleSection('throwables')}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="font-tech text-xs font-bold text-white uppercase flex items-center gap-1.5 group-hover:text-[#f59e0b] transition-colors">
                    {openSections.throwables ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#f59e0b]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
                    )}
                    <Bomb className="w-3.5 h-3.5 text-[#f59e0b]" /> ARROJABLES & GRANADAS ({totalGrenadeCharges} CARGAS)
                  </span>
                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    {openSections.throwables ? 'Plegar' : 'Desplegar'}
                  </span>
                </button>

                {openSections.throwables && (
                  <div className="space-y-2 pt-1">
                    {ownedGrenades.length === 0 ? (
                      <div className="p-3 text-center border border-dashed border-[#232738] rounded text-[11px] font-mono-code text-[#64748b]">
                        No tienes granadas en tu inventario / cinturón táctico.
                      </div>
                    ) : (
                      ownedGrenades.map((gItem) => {
                        const gInfo = getGrenadeInfo(gItem);
                        const isOpen = !!openGrenades[gItem.id];
                        return (
                          <div
                            key={gItem.id}
                            className="bg-[#10121a] rounded border border-[#22283a] overflow-hidden transition-all"
                          >
                            {/* Fila Encabezado / Vista Plegada: SÓLO Nombre + Cargas */}
                            <button
                              type="button"
                              onClick={() => toggleOpenGrenade(gItem.id)}
                              className="w-full p-2.5 flex items-center justify-between gap-2 text-left hover:bg-[#141724] transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isOpen ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                                )}
                                <span className="font-tech text-xs font-bold text-white truncate">
                                  {gItem.name}
                                </span>
                              </div>
                              <span className="bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 px-2 py-0.5 rounded text-[10px] font-mono-code font-bold shrink-0">
                                x{gItem.quantity} CARGAS
                              </span>
                            </button>

                            {/* Vista Expandida: Detalles, Reglas, Stepper y Acciones */}
                            {isOpen && (
                              <div className="p-2.5 pt-0 border-t border-[#1a1e2c] bg-[#0c0e14] space-y-2 mt-1">
                                <div className="text-[10px] font-mono-code text-[#cbd5e1] leading-tight pt-2 space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {gInfo.damage ? (
                                      <span className="bg-[#dc2626]/20 text-[#f87171] border border-[#dc2626]/40 px-1.5 py-0.2 rounded text-[9px] font-mono-code font-bold">
                                        Daño: {gInfo.damage}
                                      </span>
                                    ) : (
                                      <span className="bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 px-1.5 py-0.2 rounded text-[9px] font-mono-code font-bold">
                                        TÁCTICA
                                      </span>
                                    )}
                                    <span className="text-[#64748b]">| Radio: 10x10m | DV lanzamiento: {gInfo.dv}</span>
                                  </div>
                                  <div className="text-[#94a3b8]">{gInfo.effect}</div>
                                </div>

                                {/* Ajuste de Cargas (- / +) */}
                                <div className="flex items-center justify-between pt-1 border-t border-[#1a1e2c] text-[10px] font-mono-code text-[#64748b]">
                                  <span>Cargas en cinturón:</span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => updateInventoryQuantity(gItem.id, -1)}
                                      className="w-5 h-5 flex items-center justify-center bg-[#171b26] hover:bg-[#dc2626] text-slate-300 hover:text-white rounded border border-[#242b3d] font-bold"
                                      title="Gastar 1 carga"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="font-mono-code font-bold text-white px-1">
                                      {gItem.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => updateInventoryQuantity(gItem.id, 1)}
                                      className="w-5 h-5 flex items-center justify-center bg-[#171b26] hover:bg-[#10b981] text-slate-300 hover:text-white rounded border border-[#242b3d] font-bold"
                                      title="Añadir 1 carga"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Botones de Lanzar y Daño */}
                                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#1a1e2c]">
                                  <button
                                    onClick={() => handleThrowOwnedGrenade(gItem)}
                                    className="py-1 px-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
                                  >
                                    <Target className="w-3 h-3" /> LANZAR (-1 CARGA)
                                  </button>
                                  <button
                                    onClick={() => handleOwnedGrenadeEffect(gItem)}
                                    className="py-1 px-1.5 bg-[#1e2334] hover:bg-[#2b334a] text-[#38bdf8] font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1 border border-[#2c364e] active:scale-95"
                                  >
                                    <Dices className="w-3 h-3" /> DAÑO / EFECTO
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}

                    {/* Selector para Equipar Granada al Cinturón */}
                    <div className="pt-2 border-t border-[#1e2332] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-code text-[#64748b] flex items-center gap-1">
                          <Plus className="w-3 h-3 text-[#38bdf8]" /> EQUIPAR AL CINTURÓN:
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowEquipGrenadeDropdown(!showEquipGrenadeDropdown)}
                          className="text-[9px] font-mono-code text-[#38bdf8] hover:underline"
                        >
                          {showEquipGrenadeDropdown ? 'Ocultar catálogo' : '+ Añadir del catálogo'}
                        </button>
                      </div>

                      {showEquipGrenadeDropdown && (
                        <div className="flex gap-1.5 pt-1">
                          <select
                            value={selectedCatalogGrenadeId}
                            onChange={(e) => setSelectedCatalogGrenadeId(e.target.value)}
                            className="flex-1 bg-[#0e1017] border border-[#2b334a] text-white text-[11px] font-mono-code rounded px-2 py-1 focus:outline-none focus:border-[#f59e0b] truncate"
                          >
                            {TACTICAL_GRENADES.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name} ({g.damage || 'Táctica'}, DV {g.dv})
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={handleEquipGrenadeToBelt}
                            className="px-2.5 py-1 bg-[#f59e0b] hover:bg-[#d97706] text-black font-tech font-bold text-xs rounded transition-all active:scale-95 shrink-0 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Equipar (1)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECCIÓN 4: DROGAS & CONSUMIBLES */}
            {(rackFilter === 'all' || rackFilter === 'drugs') && (
              <div className="bg-[#151722] p-3 rounded border border-[#252a3c] space-y-2.5">
                <button
                  type="button"
                  onClick={() => toggleSection('drugs')}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="font-tech text-xs font-bold text-white uppercase flex items-center gap-1.5 group-hover:text-[#ec4899] transition-colors">
                    {openSections.drugs ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#ec4899]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
                    )}
                    <Pill className="w-3.5 h-3.5 text-[#ec4899]" /> DROGAS & CONSUMIBLES ({totalDrugCharges} DOSIS)
                  </span>
                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    {openSections.drugs ? 'Plegar' : 'Desplegar'}
                  </span>
                </button>

                {openSections.drugs && (
                  <div className="space-y-2 pt-1">
                    {ownedDrugs.length === 0 ? (
                      <div className="p-3 text-center border border-dashed border-[#232738] rounded text-[11px] font-mono-code text-[#64748b]">
                        No tienes drogas o fármacos en tu inventario.
                      </div>
                    ) : (
                      ownedDrugs.map((dItem) => {
                        const dInfo = getDrugInfo(dItem);
                        const isOpen = !!openDrugs[dItem.id];
                        return (
                          <div
                            key={dItem.id}
                            className="bg-[#10121a] rounded border border-[#22283a] overflow-hidden transition-all"
                          >
                            {/* Fila Encabezado / Vista Plegada: SÓLO Nombre + Cargas */}
                            <button
                              type="button"
                              onClick={() => toggleOpenDrug(dItem.id)}
                              className="w-full p-2.5 flex items-center justify-between gap-2 text-left hover:bg-[#141724] transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isOpen ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-[#ec4899] shrink-0" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                                )}
                                <span className="font-tech text-xs font-bold text-white truncate">
                                  {dItem.name}
                                </span>
                              </div>
                              <span className="bg-[#ec4899]/20 text-[#ec4899] border border-[#ec4899]/40 px-2 py-0.5 rounded text-[10px] font-mono-code font-bold shrink-0">
                                x{dItem.quantity} DOSIS
                              </span>
                            </button>

                            {/* Vista Expandida: Efectos, Resaca, Stepper y Acciones */}
                            {isOpen && (
                              <div className="p-2.5 pt-0 border-t border-[#1a1e2c] bg-[#0c0e14] space-y-2 mt-1">
                                <div className="text-[10px] font-mono-code text-[#cbd5e1] leading-tight pt-2 space-y-0.5">
                                  <div><span className="text-[#10b981]">Efecto:</span> {dInfo.primaryEffect}</div>
                                  {dInfo.secondaryEffect && (
                                    <div className="text-[#f43f5e]"><span className="text-[#64748b]">Resaca:</span> {dInfo.secondaryEffect}</div>
                                  )}
                                  <div className="flex items-center gap-2 text-[#94a3b8] pt-0.5">
                                    <span>Duración: {dInfo.duration}</span>
                                    <span>•</span>
                                    <span className="text-[#eab308]">Adicción: DV {dInfo.addictionDv}</span>
                                  </div>
                                </div>

                                {/* Stepper de Dosis (- / +) */}
                                <div className="flex items-center justify-between pt-1 border-t border-[#1a1e2c] text-[10px] font-mono-code text-[#64748b]">
                                  <span>Dosis disponibles:</span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => updateInventoryQuantity(dItem.id, -1)}
                                      className="w-5 h-5 flex items-center justify-center bg-[#171b26] hover:bg-[#dc2626] text-slate-300 hover:text-white rounded border border-[#242b3d] font-bold"
                                      title="Gastar 1 dosis"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="font-mono-code font-bold text-white px-1">
                                      {dItem.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => updateInventoryQuantity(dItem.id, 1)}
                                      className="w-5 h-5 flex items-center justify-center bg-[#171b26] hover:bg-[#10b981] text-slate-300 hover:text-white rounded border border-[#242b3d] font-bold"
                                      title="Añadir 1 dosis"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Botones de Inyectar y Tirar Adicción */}
                                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#1a1e2c]">
                                  <button
                                    onClick={() => handleInjectDrug(dInfo)}
                                    className="py-1 px-1.5 bg-[#ec4899] hover:bg-[#db2777] text-white font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
                                  >
                                    <Pill className="w-3 h-3" /> INYECTAR (-1 DOSIS)
                                  </button>
                                  <button
                                    onClick={() => handleDrugAddictionTest(dInfo)}
                                    className="py-1 px-1.5 bg-[#1e2334] hover:bg-[#2b334a] text-[#eab308] font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1 border border-[#2c364e] active:scale-95"
                                  >
                                    <Dices className="w-3 h-3" /> TIRAR ADICCIÓN
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}

                    {/* Selector para Equipar Droga al Cinturón */}
                    <div className="pt-2 border-t border-[#1e2332] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-code text-[#64748b] flex items-center gap-1">
                          <Plus className="w-3 h-3 text-[#ec4899]" /> EQUIPAR DROGA / FÁRMACO:
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowEquipDrugDropdown(!showEquipDrugDropdown)}
                          className="text-[9px] font-mono-code text-[#ec4899] hover:underline"
                        >
                          {showEquipDrugDropdown ? 'Ocultar catálogo' : '+ Añadir del catálogo'}
                        </button>
                      </div>

                      {showEquipDrugDropdown && (
                        <div className="flex gap-1.5 pt-1">
                          <select
                            value={selectedCatalogDrugId}
                            onChange={(e) => setSelectedCatalogDrugId(e.target.value)}
                            className="flex-1 bg-[#0e1017] border border-[#2b334a] text-white text-[11px] font-mono-code rounded px-2 py-1 focus:outline-none focus:border-[#ec4899] truncate"
                          >
                            {catalogDrugs.map((d: any) => (
                              <option key={d.name} value={d.name}>
                                {d.name} ({d.cost || 50} €$)
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={handleEquipDrugToBelt}
                            className="px-2.5 py-1 bg-[#ec4899] hover:bg-[#db2777] text-white font-tech font-bold text-xs rounded transition-all active:scale-95 shrink-0 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Equipar (1)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          </CollapsibleHudCard>
        );

            case 'martialArts': {
        const combatReadyForms = MARTIAL_ARTS_FORMS.filter((f) => {
          const natural = activeChar?.knownMartialArts?.[f.id] ?? 0;
          const chipped = (activeChar?.equippedMartialArtChips || []).includes(f.id);
          return natural > 0 || chipped;
        });

        const activeForm =
          combatReadyForms.find((f) => f.id === selectedMartialFormId) ||
          combatReadyForms[0] ||
          MARTIAL_ARTS_FORMS[0];

        const naturalRank = activeChar?.knownMartialArts?.[activeForm.id] ?? 0;
        const isChipEquipped = (activeChar?.equippedMartialArtChips || []).includes(activeForm.id);
        const activeRank = isChipEquipped ? Math.max(3, naturalRank) : naturalRank;

        const summaryText =
          combatReadyForms.length > 0
            ? `Estilo: ${activeForm.name} (R${activeRank})${isChipEquipped ? ' [Chip N3]' : ''}`
            : 'Sin estilos aprendidos ni chips';

        return (
          <CollapsibleHudCard
            key="martialArts"
            id="martialArts"
            title="CYBERFISTS OF FURY // ARTES MARCIALES & COMBOS"
            icon={<Flame className="w-4 h-4 text-amber-400" />}
            summary={summaryText}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('martialArts')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveRightPanel('martialArts', 'up')}
            onMoveDown={() => moveRightPanel('martialArts', 'down')}
            onDragStart={() => handleDragStart('right', 'martialArts')}
            onDragOver={(e) => handleDragOver(e, 'martialArts')}
            onDrop={() => handleDrop('right', 'martialArts')}
            isDragOver={dragOverItem === 'martialArts'}
            extraHeaderActions={
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDojoModal(!showDojoModal);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  showDojoModal
                    ? 'bg-[#10b981] text-black shadow-sm'
                    : 'bg-[#181f2f] hover:bg-[#25324c] text-emerald-400 border border-emerald-500/40'
                }`}
                title="Abrir Dojo de Artes Marciales, Entrenamiento IP y Chipware"
              >
                <span>🥋 DOJO</span>
                <span className="text-[9px] opacity-80">{showDojoModal ? '▲' : '▼'}</span>
              </button>
            }
          >
            <div className="space-y-3">
              {/* FEEDBACK DE ACCIONES DE ARTES MARCIALES */}
              {martialFeedback && (
                <div
                  className={`p-2.5 rounded text-xs font-mono-code flex items-center justify-between ${
                    martialFeedback.success
                      ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-200'
                      : 'bg-red-950/70 border border-red-500/60 text-red-200'
                  }`}
                >
                  <span>{martialFeedback.message}</span>
                  <button
                    type="button"
                    onClick={() => setMartialFeedback(null)}
                    className="text-slate-400 hover:text-white px-1 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* MODAL / PANEL DESPLEGABLE: DOJO DE ARTES MARCIALES & REGLAS OFICIALES */}
              {showDojoModal && (
                <div className="chamfer-card p-3.5 bg-[#0e111a] border-2 border-emerald-500/50 shadow-2xl space-y-3 animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#232d44]">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🥋</span>
                      <div>
                        <h4 className="font-tech text-xs font-bold text-white uppercase tracking-wider">
                          DOJO DE ARTES MARCIALES & CHIPWARE // REGLAS OFICIALES
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono-code">
                          Entrenamiento IP (Coste x2 = Próximo Nivel × 40 IP) • Skill Chips (Nivel 3 — 1,000 €$)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Billetera y Puntos de Mejora */}
                      <div className="flex items-center gap-2 bg-[#141824] border border-[#23293c] px-2 py-0.5 rounded text-xs font-mono-code">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-white font-bold">{activeChar?.eurodollars ?? 0} €$</span>
                        <span className="text-slate-500">|</span>
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">{activeChar?.improvementPoints ?? 120} IP</span>
                      </div>

                      {/* Botones de ajuste de IP */}
                      <div className="flex items-center gap-0.5 bg-[#141824] border border-[#23293c] p-0.5 rounded text-[10px] font-mono-code">
                        <button
                          type="button"
                          onClick={() => adjustImprovementPoints(-10)}
                          className="px-1.5 py-0.5 bg-[#1a2030] hover:bg-red-600/40 text-slate-300 rounded cursor-pointer"
                          title="Restar 10 IP"
                        >
                          -10
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustImprovementPoints(10)}
                          className="px-1.5 py-0.5 bg-[#1a2030] hover:bg-emerald-600/40 text-emerald-300 rounded cursor-pointer"
                          title="Añadir 10 IP"
                        >
                          +10
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustImprovementPoints(50)}
                          className="px-1.5 py-0.5 bg-[#1a2030] hover:bg-emerald-600/40 text-emerald-300 font-bold rounded cursor-pointer"
                          title="Añadir 50 IP"
                        >
                          +50
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustImprovementPoints(100)}
                          className="px-1.5 py-0.5 bg-[#1a2030] hover:bg-cyan-600/40 text-cyan-300 font-bold rounded cursor-pointer"
                          title="Añadir 100 IP"
                        >
                          +100
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowMartialArtsGuide(!showMartialArtsGuide)}
                        className="px-2.5 py-1 bg-[#1a2336] hover:bg-[#25334f] text-[#38bdf8] border border-[#38bdf8]/40 rounded text-xs font-tech font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{showMartialArtsGuide ? 'OCULTAR MANUAL' : 'REGLAS OFICIALES'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Manual Oficial de Artes Marciales */}
                  {showMartialArtsGuide && (
                    <div className="p-3 bg-[#121622] border border-[#27344e] rounded space-y-2.5 text-xs font-mono-code animate-fade-in max-h-[340px] overflow-y-auto pr-1">
                      <div className="flex items-center justify-between border-b border-[#222c42] pb-1">
                        <span className="font-tech text-sm font-bold text-amber-400">
                          🥋 {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.sourceReferences}
                        </span>
                      </div>

                      <div className="space-y-1 text-slate-300 font-sans leading-relaxed text-[11px]">
                        <p><strong>Definición:</strong> {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.definition}</p>
                        <p className="text-emerald-300"><strong>Dificultad (x2):</strong> {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.difficultyMultiplier}</p>
                        <p>{MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.whySeparateSkills}</p>
                        <p className="text-cyan-300">{MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.requirementToUse}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#1e263a]">
                        <div className="bg-[#0b0e17] p-2 rounded border border-[#1b2234] space-y-1">
                          <span className="font-tech text-xs font-bold text-white uppercase block">
                            MECÁNICAS DE COMBATE (ROF 2 & 50% SP)
                          </span>
                          <p className="text-[10px] text-slate-300 font-sans">
                            {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.rateOfFire}
                          </p>
                          <p className="text-[10px] text-amber-300 font-sans">
                            {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.armorPenetrationRule}
                          </p>
                        </div>
                        <div className="bg-[#0b0e17] p-2 rounded border border-[#1b2234] space-y-1">
                          <span className="font-tech text-xs font-bold text-white uppercase block">
                            ESCALA DE DAÑO SEGÚN STAT BODY
                          </span>
                          <div className="space-y-0.5 text-[9px] font-mono-code text-slate-300">
                            {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.bodyDamageScaleTable.map((row, idx) => (
                              <div key={idx} className="flex justify-between border-b border-[#1b2234] py-0.5">
                                <span className="text-slate-400">{row.bodyRange}:</span>
                                <strong className="text-emerald-400">{row.damageDice}</strong>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0b0e17] p-2 rounded border border-[#1b2234] space-y-1">
                        <span className="font-tech text-xs font-bold text-amber-400 uppercase block">
                          CÓMO ADQUIRIR Y ENTRENAR ARTES MARCIALES
                        </span>
                        <div className="space-y-1 text-[10px] text-slate-300 font-sans">
                          {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.howToBuyAndAcquire.methods.map((m, idx) => (
                            <div key={idx}>
                              <strong className="text-white">• {m.name}:</strong> {m.costExplanation} — {m.mechanicDetails}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filtro y Búsqueda del Dojo */}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="Buscar estilo o combo en el Dojo..."
                      value={martialArtSearch}
                      onChange={(e) => setMartialArtSearch(e.target.value)}
                      className="bg-[#0b0d14] border border-[#262c3e] text-white text-xs px-2.5 py-1 rounded focus:outline-none focus:border-[#10b981] flex-1 min-w-[150px] font-mono-code"
                    />
                    <div className="flex gap-1 text-[10px] font-mono-code font-bold">
                      {(['all', 'core', 'interface_red'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setMartialArtCategoryFilter(cat)}
                          className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                            martialArtCategoryFilter === cat
                              ? 'bg-[#10b981] text-black'
                              : 'bg-[#181b26] text-[#94a3b8] hover:text-white border border-[#232738]'
                          }`}
                        >
                          {cat === 'all' ? 'TODAS (27)' : cat === 'core' ? 'CORE (4)' : 'CYBERFISTS (23)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lista de las 27 Formas para Entrenar / Comprar Chip */}
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {MARTIAL_ARTS_FORMS.filter((f) => {
                      const matchCat =
                        martialArtCategoryFilter === 'all' ? true : f.sourceBook === martialArtCategoryFilter;
                      const matchSearch =
                        !martialArtSearch.trim() ||
                        f.name.toLowerCase().includes(martialArtSearch.toLowerCase()) ||
                        f.moves.some(
                          (m) =>
                            m.name.toLowerCase().includes(martialArtSearch.toLowerCase()) ||
                            m.effectDescription.toLowerCase().includes(martialArtSearch.toLowerCase())
                        );
                      return matchCat && matchSearch;
                    }).map((form) => {
                      const naturalRank = activeChar?.knownMartialArts?.[form.id] ?? 0;
                      const isChipOwned = (activeChar?.ownedMartialArtChips || []).includes(form.id);
                      const isChipEquipped = (activeChar?.equippedMartialArtChips || []).includes(form.id);
                      const effectiveRank = isChipEquipped ? Math.max(3, naturalRank) : naturalRank;
                      const nextRank = naturalRank + 1;
                      const ipCost = nextRank * 40;
                      const currentIp = activeChar?.improvementPoints ?? 0;
                      const canTrain = currentIp >= ipCost && naturalRank < 10;

                      return (
                        <div
                          key={form.id}
                          className={`p-2.5 rounded border transition-all ${
                            effectiveRank > 0
                              ? 'bg-[#121822] border-emerald-500/50 shadow-sm'
                              : 'bg-[#10131d] border-[#1f2738]'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-tech text-xs font-bold text-white">{form.name}</span>
                              <span className="text-[9px] font-mono-code px-1 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                                {form.badge}
                              </span>
                              {effectiveRank > 0 && (
                                <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-emerald-500 text-black font-bold">
                                  RANGO EFECTIVO: {effectiveRank}
                                  {isChipEquipped && naturalRank < 3 ? ' (CHIP N3)' : ''}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono-code text-[#94a3b8]">
                              Rol: <span className="text-white">{form.tacticalRole}</span> • Stats: <span className="text-slate-300">{form.keyStats.join(', ')}</span>
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-300 italic font-sans mb-2 leading-relaxed">
                            "{form.originAndFlavor}"
                          </div>

                          {/* Acciones de Adquisición */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-[#1c2436]">
                            {/* Entrenamiento con IP */}
                            <div>
                              {naturalRank >= 10 ? (
                                <div className="text-center py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-[10px] font-tech font-bold uppercase rounded-xs">
                                  ★ MAESTRÍA MÁXIMA (R10)
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const res = trainMartialArtWithIp(form.id, form.name);
                                    setMartialFeedback(res);
                                  }}
                                  disabled={!canTrain}
                                  className={`w-full py-1 px-2 rounded-xs font-tech text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                                    canTrain
                                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-sm'
                                      : 'bg-[#151926] text-slate-500 border border-[#222738] cursor-not-allowed'
                                  }`}
                                  title={canTrain ? `Gasta ${ipCost} IP para subir a Rango ${nextRank}` : `Necesitas ${ipCost} IP (tienes ${currentIp})`}
                                >
                                  <Award className="w-3 h-3" />
                                  <span>
                                    {canTrain ? `ENTRENAR R${nextRank} (${ipCost} IP)` : `REQ. ${ipCost} IP`}
                                  </span>
                                </button>
                              )}
                            </div>

                            {/* Skill Chip Nivel 3 */}
                            <div>
                              {isChipOwned ? (
                                <button
                                  type="button"
                                  onClick={() => toggleEquipMartialArtChip(form.id)}
                                  className={`w-full py-1 px-2 rounded-xs font-mono-code text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                    isChipEquipped
                                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 hover:bg-cyan-500/30'
                                      : 'bg-[#151926] text-slate-400 border border-[#222738] hover:text-white'
                                  }`}
                                >
                                  <Cpu className="w-3 h-3" />
                                  <span>{isChipEquipped ? '✓ CHIP EQUIPADO' : '⚡ INSERTAR CHIP'}</span>
                                </button>
                              ) : (
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const res = buyAndEquipMartialArtChip(form.id, form.name, false);
                                      setMartialFeedback(res);
                                    }}
                                    className="flex-1 py-1 px-1 bg-[#1a2030] hover:bg-amber-600 hover:text-black text-amber-300 border border-amber-600/40 rounded-xs font-mono-code text-[9px] font-bold transition-colors cursor-pointer text-center"
                                    title="Comprar Skill Chip Nivel 3 por 1,000 €$"
                                  >
                                    CHIP 1,000 €$
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const res = buyAndEquipMartialArtChip(form.id, form.name, true);
                                      setMartialFeedback(res);
                                    }}
                                    className="py-1 px-1.5 bg-[#151926] hover:bg-[#20273a] text-slate-400 hover:text-white border border-[#24293c] rounded-xs font-mono-code text-[9px] transition-colors cursor-pointer text-center"
                                    title="Gratis en creación de personaje"
                                  >
                                    GRATIS
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Ajuste manual de rango */}
                            <div className="flex items-center justify-end gap-1 font-mono-code text-[10px]">
                              <span className="text-slate-400">R. Base:</span>
                              <button
                                type="button"
                                onClick={() => updateMartialArtRank(form.id, Math.max(0, naturalRank - 1))}
                                className="w-5 h-5 flex items-center justify-center bg-[#181d2a] hover:bg-red-600 text-white rounded cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-4 text-center font-bold text-white">{naturalRank}</span>
                              <button
                                type="button"
                                onClick={() => updateMartialArtRank(form.id, Math.min(10, naturalRank + 1))}
                                className="w-5 h-5 flex items-center justify-center bg-[#181d2a] hover:bg-emerald-600 text-white rounded cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECCIÓN PRINCIPAL DE COMBATE: ESTILOS LISTOS PARA ATACAR */}
              {combatReadyForms.length === 0 ? (
                <div className="p-4 text-center bg-[#101420] border border-amber-500/40 rounded-xs space-y-2">
                  <span className="text-2xl block">🥋</span>
                  <h4 className="font-tech text-xs font-bold text-white uppercase">
                    Sin Artes Marciales Aprendidas ni Skill Chips Equipados
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono-code max-w-md mx-auto leading-relaxed">
                    Para usar Artes Marciales en combate necesitas entrenar un estilo con Puntos de Mejora (IP) o insertar un Skill Chip (Nivel 3) en tu Chipware Socket o Neuroport.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDojoModal(true)}
                    className="px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-black font-tech font-bold text-xs uppercase rounded transition-all shadow-md cursor-pointer"
                  >
                    🥋 Abrir Dojo de Artes Marciales & Chipware
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Selector de Estilo Listo para Combate */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0c0e16] p-2 rounded border border-[#1f2638]">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <span className="text-[11px] font-mono-code text-[#94a3b8] shrink-0">Estilo Activo:</span>
                      <select
                        value={activeForm.id}
                        onChange={(e) => setSelectedMartialFormId(e.target.value)}
                        className="bg-[#0b0d14] border border-[#262c3e] text-[#10b981] font-tech font-bold text-xs rounded px-2 py-1 focus:outline-none focus:border-[#10b981] flex-1 cursor-pointer"
                      >
                        {combatReadyForms.map((f) => {
                          const nat = activeChar?.knownMartialArts?.[f.id] ?? 0;
                          const chipped = (activeChar?.equippedMartialArtChips || []).includes(f.id);
                          const eff = chipped ? Math.max(3, nat) : nat;
                          return (
                            <option key={f.id} value={f.id}>
                              {f.name} (Rango {eff}{chipped && nat < 3 ? ' · Chip N3' : ''})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono-code">
                      <span className="text-[#38bdf8] font-bold">Rango {activeRank}</span>
                      {isChipEquipped && (
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-1.5 py-0.2 rounded font-bold">
                          CHIPWARE SOCKET
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ficha Táctica del Estilo Activo */}
                  <div className="bg-[#0e111a] p-3 rounded border border-[#222a3d] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-tech text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{activeForm.name}</span>
                        <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                          {activeForm.badge}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono-code text-[#94a3b8]">
                        Stats Clave: <strong className="text-white">{activeForm.keyStats.join(', ')}</strong> • Rol: {activeForm.tacticalRole}
                      </div>
                    </div>

                    <div className="text-[11px] font-sans text-[#cbd5e1] leading-relaxed italic bg-[#10131d] p-2 rounded border border-[#1c2233]">
                      "{activeForm.originAndFlavor}"
                    </div>

                    {/* Botones de Ataque y Daño Básico del Estilo */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleCyberfistsFormAttack(activeForm)}
                        className="py-1.5 px-2 bg-[#10b981] hover:bg-[#059669] text-black font-tech font-bold text-xs rounded transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>ATACAR ({activeForm.name.split(' ')[0]} R{activeRank})</span>
                      </button>
                      <button
                        onClick={() => handleCyberfistsFormDamage(activeForm)}
                        className="py-1.5 px-2 bg-[#181f2f] hover:bg-[#232d42] text-[#10b981] font-tech font-bold text-xs rounded transition-all flex items-center justify-center gap-1.5 border border-[#1f3b2d] cursor-pointer"
                      >
                        <Dices className="w-3.5 h-3.5" />
                        <span>DAÑO ({unarmedDmg} · 50% SP)</span>
                      </button>
                    </div>

                    {/* 2 Movimientos Especiales del Estilo */}
                    <div className="pt-2 border-t border-[#1b2130] space-y-2">
                      <div className="text-[10px] font-mono-code uppercase font-bold text-[#f59e0b] tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        MOVIMIENTOS ESPECIALES & COMBOS ({activeForm.moves.length})
                      </div>

                      <div className="space-y-2">
                        {activeForm.moves.map((move) => (
                          <div
                            key={move.id}
                            className="bg-[#121622] p-2.5 rounded border border-[#20273a] hover:border-[#10b981]/50 transition-colors space-y-1.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <div className="font-tech text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{move.name}</span>
                                {move.criticalInjuryApplied && (
                                  <span className="text-[9px] font-mono-code bg-[#dc2626]/20 text-[#f87171] px-1 py-0.2 rounded border border-[#dc2626]/40">
                                    {move.criticalInjuryApplied}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] font-mono-code font-bold text-[#38bdf8] bg-[#0c121e] px-1.5 py-0.5 rounded border border-[#1b2b40]">
                                DV {move.resolutionDv}
                              </div>
                            </div>

                            <div className="text-[10px] font-mono-code text-[#94a3b8]">
                              <strong className="text-[#f59e0b]">Requisito:</strong> {move.requirements}
                            </div>

                            <div className="text-[11px] font-sans text-[#cbd5e1] leading-relaxed">
                              {move.effectDescription}
                            </div>

                            {move.damageBonusOrFormula && (
                              <div className="text-[10px] font-mono-code text-[#10b981] font-bold">
                                Bono / Daño: {move.damageBonusOrFormula}
                              </div>
                            )}

                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleExecuteMartialMove(activeForm, move)}
                                className="flex-1 py-1 px-2 bg-[#1b253b] hover:bg-[#10b981] hover:text-black text-[#38bdf8] font-tech font-bold text-xs rounded transition-all flex items-center justify-center gap-1 border border-[#293b5d] cursor-pointer"
                              >
                                <Target className="w-3 h-3" /> EJECUTAR COMBO (1d10 + DEX + {activeRank} vs DV {move.resolutionDv})
                              </button>
                              {move.damageBonusOrFormula && move.damageBonusOrFormula.includes('d') && (
                                <button
                                  onClick={() => handleRollComboDamage(move)}
                                  className="py-1 px-2 bg-[#291b22] hover:bg-[#dc2626] text-white font-tech font-bold text-xs rounded transition-all flex items-center justify-center gap-1 border border-[#441f28] cursor-pointer"
                                  title="Tirar dado de daño del combo"
                                >
                                  <Dices className="w-3 h-3" /> TIRAR DAÑO
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleHudCard>
        );
      }

      case 'roleAbility':
        return (
          <CollapsibleHudCard
            key="roleAbility"
            id="roleAbility"
            title="ROL EN COMBATE // CAPACIDADES DE ROL"
            icon={<Zap className="w-4 h-4 text-emerald-400" />}
            summary={`${activeChar?.role?.toUpperCase() || 'SOLO'} R${activeChar?.roleRank || 4}`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('roleAbility')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveRightPanel('roleAbility', 'up')}
            onMoveDown={() => moveRightPanel('roleAbility', 'down')}
            onDragStart={() => handleDragStart('right', 'roleAbility')}
            onDragOver={(e) => handleDragOver(e, 'roleAbility')}
            onDrop={() => handleDrop('right', 'roleAbility')}
            isDragOver={dragOverItem === 'roleAbility'}
            extraHeaderActions={
              <span className="text-[10px] font-mono-code text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/30">
                {activeChar?.role?.toUpperCase() || 'SOLO'} R{activeChar?.roleRank || 4}
              </span>
            }
          >
            <div className="space-y-4">
              {/* SUBSECCIÓN 1: SOLO COMBAT AWARENESS */}
              <div className="bg-[#0e1017] p-3 rounded border border-[#22283a] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1c2233]">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-[#dc2626]" />
                    <span className="font-tech text-xs font-bold text-white uppercase">
                      SOLO // COMBAT AWARENESS (Puntos de Rol: {activeChar?.roleRank || 4})
                    </span>
                  </div>
                  {activeChar?.soloAllocation?.precisionAttack ? (
                    <span className="text-[10px] font-mono-code bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded border border-[#10b981]/40 font-bold animate-pulse">
                      ¡Precision Attack Activo: +{activeChar.soloAllocation.precisionAttack} a Ataques!
                    </span>
                  ) : null}
                </div>

                {/* Controles de puntos de Solo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-code">
                  {/* Precision Attack */}
                  <div className="bg-[#141622] p-2 rounded border border-[#22283c] flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Precision Attack (+1 Atk)</div>
                      <div className="text-[9px] text-[#64748b]">Cuesta 3 pts por +1</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateSoloField('precisionAttack', -1)}
                        className="w-5 h-5 flex items-center justify-center bg-[#1f2434] hover:bg-[#dc2626] text-white rounded font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-[#10b981] w-4 text-center">
                        {activeChar?.soloAllocation?.precisionAttack || 0}
                      </span>
                      <button
                        onClick={() => handleUpdateSoloField('precisionAttack', 1)}
                        className="w-5 h-5 flex items-center justify-center bg-[#1f2434] hover:bg-[#10b981] text-white rounded font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Spot Weakness */}
                  <div className="bg-[#141622] p-2 rounded border border-[#22283c] flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Spot Weakness (+1 Dmg)</div>
                      <div className="text-[9px] text-[#64748b]">Cuesta 1 pt por +1</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateSoloField('spotWeakness', -1)}
                        className="w-5 h-5 flex items-center justify-center bg-[#1f2434] hover:bg-[#dc2626] text-white rounded font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-[#10b981] w-4 text-center">
                        {activeChar?.soloAllocation?.spotWeakness || 0}
                      </span>
                      <button
                        onClick={() => handleUpdateSoloField('spotWeakness', 1)}
                        className="w-5 h-5 flex items-center justify-center bg-[#1f2434] hover:bg-[#10b981] text-white rounded font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Damage Deflection */}
                  <div className="bg-[#141622] p-2 rounded border border-[#22283c] flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Damage Deflection (-1 Dmg)</div>
                      <div className="text-[9px] text-[#64748b]">Cuesta 2 pts por -1</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateSoloField('damageDeflection', -1)}
                        className="w-5 h-5 flex items-center justify-center bg-[#1f2434] hover:bg-[#dc2626] text-white rounded font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-[#10b981] w-4 text-center">
                        {activeChar?.soloAllocation?.damageDeflection || 0}
                      </span>
                      <button
                        onClick={() => handleUpdateSoloField('damageDeflection', 1)}
                        className="w-5 h-5 flex items-center justify-center bg-[#1f2434] hover:bg-[#10b981] text-white rounded font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Initiative Reaction */}
                  <div className="bg-[#141622] p-2 rounded border border-[#22283c] flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Initiative Reaction (+1 Init)</div>
                      <div className="text-[9px] text-[#64748b]">Cuesta 1 pt por +1</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateSoloField('initiativeReaction', -1)}
                        className="w-5 h-5 flex items-center justify-center bg-[#1f2434] hover:bg-[#dc2626] text-white rounded font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-[#10b981] w-4 text-center">
                        {activeChar?.soloAllocation?.initiativeReaction || 0}
                      </span>
                      <button
                        onClick={() => handleUpdateSoloField('initiativeReaction', 1)}
                        className="w-5 h-5 flex items-center justify-center bg-[#1f2434] hover:bg-[#10b981] text-white rounded font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Threat Detection */}
                  <div className="bg-[#141622] p-2 rounded border border-[#22283c] flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Threat Detection (+1 Perc)</div>
                      <div className="text-[9px] text-[#64748b]">Cuesta 1 pt por +1</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateSoloField('threatDetection', -1)}
                        className="w-5 h-5 flex items-center justify-center bg-[#1f2434] hover:bg-[#dc2626] text-white rounded font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-[#10b981] w-4 text-center">
                        {activeChar?.soloAllocation?.threatDetection || 0}
                      </span>
                      <button
                        onClick={() => handleUpdateSoloField('threatDetection', 1)}
                        className="w-5 h-5 flex items-center justify-center bg-[#1f2434] hover:bg-[#10b981] text-white rounded font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Fumble Recovery */}
                  <div className="bg-[#141622] p-2 rounded border border-[#22283c] flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Fumble Recovery (Ignora Pifia)</div>
                      <div className="text-[9px] text-[#64748b]">Cuesta 2 pts fijar activo</div>
                    </div>
                    <button
                      onClick={() => handleUpdateSoloField('fumbleRecovery', activeChar?.soloAllocation?.fumbleRecovery ? -2 : 2)}
                      className={`px-2 py-0.5 rounded font-bold ${
                        activeChar?.soloAllocation?.fumbleRecovery
                          ? 'bg-[#10b981] text-black'
                          : 'bg-[#1f2434] text-[#94a3b8]'
                      }`}
                    >
                      {activeChar?.soloAllocation?.fumbleRecovery ? 'ACTIVO' : 'INACTIVO'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleHudCard>
        );

      case 'quickhacks2077':
        return (
          <CollapsibleHudCard
            key="quickhacks2077"
            id="quickhacks2077"
            title="QUICKHACKS 2077 // CEMK NEUROPORT"
            icon={<Cpu className="w-4 h-4 text-cyan-400" />}
            summary={`Interface R${activeInterfaceRank} | 15 Hacks CEMK`}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => toggleBoxCollapse('quickhacks2077')}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => moveRightPanel('quickhacks2077', 'up')}
            onMoveDown={() => moveRightPanel('quickhacks2077', 'down')}
            onDragStart={() => handleDragStart('right', 'quickhacks2077')}
            onDragOver={(e) => handleDragOver(e, 'quickhacks2077')}
            onDrop={() => handleDrop('right', 'quickhacks2077')}
            isDragOver={dragOverItem === 'quickhacks2077'}
            extraHeaderActions={
              <div className="flex items-center gap-1 bg-[#141722] border border-[#222738] p-1 rounded-xs" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] font-mono-code text-[#94a3b8] px-1">Interface:</span>
                <button
                  type="button"
                  onClick={() => setInterfaceRankOverride(Math.max(0, activeInterfaceRank - 1))}
                  className="w-5 h-5 bg-[#1a2030] hover:bg-red-500/40 text-white rounded-xs font-mono-code font-bold flex items-center justify-center transition-colors cursor-pointer text-xs"
                  title="Reducir Rango de Interface"
                >
                  -
                </button>
                <span className="w-5 text-center font-mono-code font-bold text-white text-xs">
                  {activeInterfaceRank}
                </span>
                <button
                  type="button"
                  onClick={() => setInterfaceRankOverride(Math.min(10, activeInterfaceRank + 1))}
                  className="w-5 h-5 bg-[#1a2030] hover:bg-emerald-500/40 text-white rounded-xs font-mono-code font-bold flex items-center justify-center transition-colors cursor-pointer text-xs"
                  title="Aumentar Rango de Interface"
                >
                  +
                </button>
                {activeChar?.interfaceRankOverride !== undefined && (
                  <button
                    type="button"
                    onClick={() => setInterfaceRankOverride(activeChar?.role === 'Netrunner' ? (activeChar.roleRank || 4) : 0)}
                    className="text-[9px] font-mono-code text-[#94a3b8] hover:text-white px-1 hover:underline cursor-pointer"
                    title="Restablecer al Rango canónico del personaje"
                  >
                    Reset
                  </button>
                )}
              </div>
            }
          >
            <div className="space-y-3">
              {/* Controles de Modo Libre y Guía Oficial */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0e1017] p-2 rounded border border-[#22283a]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#38bdf8]" />
                  <span className="font-tech text-xs font-bold text-white uppercase">
                    RED 2077 // TIRADA: 1d10 + INTERFACE (R{activeInterfaceRank}) vs DV
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUnlockAllQuickhacks(!unlockAllQuickhacks)}
                    className={`px-2.5 py-1 rounded text-xs font-tech font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      unlockAllQuickhacks
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'bg-[#181d2a] text-[#94a3b8] hover:text-white border border-[#24293c]'
                    }`}
                    title="Alternar entre filtro estricto por rango o ver todos los hacks"
                  >
                    {unlockAllQuickhacks ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{unlockAllQuickhacks ? '🔓 MODO LIBRE' : '🔒 DESBLOQUEO POR RANGO'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQuickhackGuide(!showQuickhackGuide)}
                    className="px-2.5 py-1 bg-[#1a2030] hover:bg-[#252f48] text-[#f59e0b] border border-[#f59e0b]/40 rounded text-xs font-tech font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{showQuickhackGuide ? 'OCULTAR GUÍA' : '📖 REGLAS OFICIALES (CEMK)'}</span>
                  </button>
                </div>
              </div>

              {/* Tabla de Desbloqueo por Rango de Interface */}
              <div className="bg-[#0c0f18] p-2.5 rounded border border-[#1e2638] text-[10px] font-mono-code space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-bold border-b border-[#1b2234] pb-1 mb-1">
                  <span>TABLA DE DESBLOQUEO CANÓNICA CEMK</span>
                  <span className="text-[#38bdf8]">Interface Actual: R{activeInterfaceRank}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                  <div
                    className={`p-1.5 rounded border ${
                      activeInterfaceRank >= 1
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#121622] border-[#20273a] text-slate-500'
                    }`}
                  >
                    <div className="font-bold">Rango 1+</div>
                    <div className="text-[9px]">Simple [DV 6]</div>
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      activeInterfaceRank >= 2
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#121622] border-[#20273a] text-slate-500'
                    }`}
                  >
                    <div className="font-bold">Rango 2-3+</div>
                    <div className="text-[9px]">Standard [DV 8]</div>
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      activeInterfaceRank >= 4
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#121622] border-[#20273a] text-slate-500'
                    }`}
                  >
                    <div className="font-bold">Rango 4+</div>
                    <div className="text-[9px]">Difficult [DV 10]</div>
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      activeInterfaceRank >= 7
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#121622] border-[#20273a] text-slate-500'
                    }`}
                  >
                    <div className="font-bold">Rango 7+</div>
                    <div className="text-[9px]">Advanced [DV 12]</div>
                  </div>
                </div>
              </div>

              {/* Guía Oficial Completa de Quickhacking */}
              {showQuickhackGuide && (
                <div className="p-3 bg-[#121622] border border-[#2a344d] rounded space-y-2.5 text-xs font-mono-code animate-fade-in max-h-[360px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between border-b border-[#242e44] pb-1.5">
                    <span className="font-tech text-sm font-bold text-[#f59e0b] uppercase">
                      📖 {QUICKHACKING_OFFICIAL_RULES_GUIDE.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{QUICKHACKING_OFFICIAL_RULES_GUIDE.source}</span>
                  </div>

                  <div className="space-y-1">
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
                          <div className="text-[10px] text-cyan-300 font-sans">{rk.unlockedHacks.join(', ')}</div>
                          <p className="text-[9px] text-slate-400 leading-tight font-sans">{rk.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>

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
              )}

              {/* Filtro y Búsqueda de Quickhacks */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar Quickhack (Overheat, Cyberware Malfunction...)"
                  value={quickhackSearch}
                  onChange={(e) => setQuickhackSearch(e.target.value)}
                  className="bg-[#0b0d14] border border-[#262c3e] text-white text-xs px-2.5 py-1 rounded focus:outline-none focus:border-[#38bdf8] flex-1 min-w-[150px] font-mono-code"
                />
                <div className="flex gap-1 text-[10px] font-mono-code font-bold">
                  {(['all', 'Simple', 'Standard', 'Difficult', 'Advanced'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setQuickhackTierFilter(tier)}
                      className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                        quickhackTierFilter === tier
                          ? 'bg-[#38bdf8] text-black'
                          : 'bg-[#181b26] text-[#94a3b8] hover:text-white border border-[#232738]'
                      }`}
                    >
                      {tier === 'all' ? 'TODOS' : tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Quickhacks con bloqueo visual por Rango */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {QUICKHACKS_2077_CATALOG.filter((qh) => {
                  const matchTier = quickhackTierFilter === 'all' || qh.tier === quickhackTierFilter;
                  const matchSearch =
                    !quickhackSearch.trim() ||
                    qh.name.toLowerCase().includes(quickhackSearch.toLowerCase()) ||
                    qh.effect.toLowerCase().includes(quickhackSearch.toLowerCase());
                  return matchTier && matchSearch;
                }).map((qh) => {
                  const isUnlocked = unlockAllQuickhacks || activeInterfaceRank >= qh.requiredInterfaceRank;

                  return (
                    <div
                      key={qh.id}
                      className={`p-2.5 rounded border transition-all space-y-1.5 ${
                        isUnlocked
                          ? 'bg-[#121520] border-[#1f2637] hover:border-[#38bdf8]/50'
                          : 'bg-[#0f1118] border-red-900/30 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`font-tech font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                            {qh.name}
                          </span>
                          <span className="text-[9px] font-mono-code px-1 py-0.2 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
                            {qh.tier}
                          </span>
                          {!isUnlocked && (
                            <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-red-950/80 text-red-300 border border-red-700/60 font-bold flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> REQ. INTERFACE R{qh.requiredInterfaceRank}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono-code">
                          <span className="text-[#38bdf8] font-bold">RAM: {qh.ramCost}</span>
                          <span className="text-[#f59e0b] font-bold bg-[#1a1924] px-1.5 rounded border border-[#2b2738]">
                            DV {qh.dv}
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] font-sans text-[#94a3b8] leading-tight">
                        {qh.effect}
                      </div>

                      {qh.damage && (
                        <div className="text-[10px] font-mono-code text-[#10b981] font-bold">
                          Daño: {qh.damage}
                        </div>
                      )}

                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => handleLaunchQuickhack(qh)}
                          disabled={!isUnlocked}
                          className={`flex-1 py-1 px-2 font-tech font-bold text-xs rounded transition-all flex items-center justify-center gap-1 border ${
                            isUnlocked
                              ? 'bg-[#1b253b] hover:bg-[#38bdf8] hover:text-black text-[#38bdf8] border-[#293b5d] cursor-pointer'
                              : 'bg-[#141722] text-slate-500 border-[#222738] cursor-not-allowed'
                          }`}
                        >
                          {isUnlocked ? <Zap className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          <span>
                            {isUnlocked
                              ? `LANZAR QUICKHACK (1d10 + R${activeInterfaceRank} vs DV ${qh.dv})`
                              : `BLOQUEADO (REQ. INTERFACE R${qh.requiredInterfaceRank})`}
                          </span>
                        </button>
                        {qh.damage && isUnlocked && (
                          <button
                            onClick={() => handleQuickhackDamage(qh)}
                            className="py-1 px-2 bg-[#291b22] hover:bg-[#dc2626] text-white font-tech font-bold text-xs rounded transition-all flex items-center justify-center gap-1 border border-[#441f28] cursor-pointer"
                            title="Tirar daño del Quickhack"
                          >
                            <Dices className="w-3 h-3" /> DAÑO
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CollapsibleHudCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra Superior Táctica de Combate: Bestiario GM */}
      <div className="chamfer-card p-2.5 bg-[#12141f] border border-[#242b3d] flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-[#ef4444]" />
          <span className="font-tech text-xs font-bold text-white uppercase tracking-wider">
            SISTEMA DE COMBATE ACTIVO & ENCUENTROS
          </span>
          <span className="text-[10px] font-mono-code text-slate-400 hidden sm:inline">
            • {activeChar?.handle || 'Sin Personaje Activo'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const oneshotTabBtn = document.querySelector('button:has(svg.lucide-train)') as HTMLButtonElement | null;
              if (oneshotTabBtn) oneshotTabBtn.click();
            }}
            className="px-3 py-1.5 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white border border-red-700/80 shadow-md shadow-red-950/50"
            title="Abrir Centro de Comando interactivo de Red Chrome Cargo"
          >
            <Train className="w-3.5 h-3.5 text-red-400" />
            <span>🚆 RED CHROME CARGO // THE HAMMERHEAD</span>
          </button>

          {/* BOTONES GLOBALES DE COLAPSO Y REORDENAMIENTO */}
          <button
            type="button"
            onClick={handleCollapseSecondary}
            className="px-2.5 py-1.5 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 bg-[#171924] hover:bg-[#252a3b] text-slate-300 hover:text-white border border-[#2b334a] shadow-sm cursor-pointer"
            title="Contraer paneles secundarios para vista táctica despejada"
          >
            <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>🔼 Contraer Secundarias</span>
          </button>

          <button
            type="button"
            onClick={handleExpandAll}
            className="px-2.5 py-1.5 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 bg-[#171924] hover:bg-[#252a3b] text-slate-300 hover:text-white border border-[#2b334a] shadow-sm cursor-pointer"
            title="Expandir todos los paneles del HUD de combate"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>🔽 Expandir Todo</span>
          </button>

          <button
            type="button"
            onClick={handleResetBoxOrder}
            className="px-2.5 py-1.5 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 bg-[#171924] hover:bg-[#252a3b] text-slate-300 hover:text-white border border-[#2b334a] shadow-sm cursor-pointer"
            title="Restablecer el orden por defecto de los paneles"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>🔄 Restaurar Orden</span>
          </button>
          <button
            type="button"
            onClick={() => setIsBestiaryDrawerOpen((p) => !p)}
            className={`px-3 py-1.5 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
              isBestiaryDrawerOpen
                ? 'bg-[#ef4444] text-white shadow-md shadow-[#ef4444]/30'
                : 'bg-[#1e1728] hover:bg-[#c084fc] text-[#c084fc] hover:text-black border border-[#482d5e]'
            }`}
          >
            <Skull className="w-3.5 h-3.5 text-amber-400" />
            <span>👹 BESTIARIO & ENCUENTRO GM (44 ENEMIGOS)</span>
            <span className="text-[10px] font-mono-code opacity-80">
              {isBestiaryDrawerOpen ? '[ Plegar ]' : '[ Desplegar ]'}
            </span>
          </button>
        </div>
      </div>

      {/* Sección Desplegable del Bestiario */}
      {isBestiaryDrawerOpen && (
        <div className="chamfer-card p-4 bg-[#0a0c13] border-2 border-amber-500/50 shadow-2xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#23293c]">
            <div className="flex items-center gap-2">
              <Skull className="w-5 h-5 text-amber-400" />
              <h3 className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                PANEL INTEGRADO DE BESTIARIO & ENCUENTRO GM
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsBestiaryDrawerOpen(false)}
              className="px-2.5 py-1 bg-[#1a1e2a] hover:bg-red-600 text-slate-300 hover:text-white font-mono-code text-xs rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cerrar Bestiario</span>
            </button>
          </div>
          <EnemiesCompendiumPanel />
        </div>
      )}


      {/* GRID PRINCIPAL MODULAR Y REORDENABLE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* COLUMNA IZQUIERDA (4 COLS EN PANTALLAS XL) */}
        <div className="xl:col-span-4 space-y-4">
          {leftColumnOrder.map((panelId, idx) => renderLeftPanel(panelId, idx))}
        </div>

        {/* COLUMNA DERECHA / PRINCIPAL (8 COLS EN PANTALLAS XL) */}
        <div className="xl:col-span-8 space-y-4">
          {telemetryDockMode === 'split_sticky' ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              <div className="xl:col-span-5 sticky top-3 space-y-4">
                {renderRightPanel('telemetry', rightColumnOrder.indexOf('telemetry'))}
              </div>
              <div className="xl:col-span-7 space-y-4">
                {rightColumnOrder
                  .filter((id) => id !== 'telemetry')
                  .map((panelId, idx) => renderRightPanel(panelId, idx))}
              </div>
            </div>
          ) : telemetryDockMode === 'floating_pip' ? (
            <div className="space-y-4">
              {rightColumnOrder
                .filter((id) => id !== 'telemetry')
                .map((panelId, idx) => renderRightPanel(panelId, idx))}
            </div>
          ) : (
            <div className="space-y-4">
              {rightColumnOrder.map((panelId, idx) => renderRightPanel(panelId, idx))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL / PIP FLOTANTE PARA TELEMETRÍA SI ESTÁ EN MODO FLOATING_PIP */}
      {telemetryDockMode === 'floating_pip' && (
        <div className="fixed bottom-4 right-4 w-[460px] max-w-[calc(100vw-2rem)] z-50 shadow-2xl border-2 border-cyan-400/80 bg-[#0e1017]/95 backdrop-blur-md rounded-md overflow-hidden animate-fade-in">
          {renderRightPanel('telemetry', 0, true)}
        </div>
      )}
    </div>
  );
};
