import React, { useState, useEffect, useRef } from 'react';
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
  calculateMartialArtsDamage,
  getEffectiveBody,
  getBaseDeathSavePenalty,
  AMMO_TYPE_CATALOG,
  normalizeLoadedAmmoType,
  isValidSoloAllocation,
  naturalHealingPerDay,
  speedhealAmount
} from '../../engine/characterEngine';
import type { DeathSaveResult } from '../../engine/characterEngine';
import { 
  createInitialAttackRoll, 
  createDamageRoll,
  calculateIncomingImpact,
  beatsDv,
  AIMED_SHOT_OPTIONS
} from '../../engine/combatEngine';
import { applyDamageDeflection, spotWeaknessBonus, rollInitiative, rollPerception } from '../../engine/combatAwareness';
import { getInterfaceRank, netActionsForInterface, maxQuickhackDv, neuroportFirewallDv, canUseQuickhacks, jackInRangeM } from '../../engine/roleRules';
import { GameClockBar } from './GameClockBar';
import { CritTableSelector } from './CritTableSelector';
import { MedtechTreatmentPanel } from '../netroles/MedtechTreatmentPanel';
import { BackupCard } from './BackupCard';
import { LawmanPanel } from '../roles/LawmanPanel';
import { useGmModeStore } from '../../store/gmModeStore';
import type { WeaponItem, RollEntry, InventoryItem, AimedShotTarget, TechWeaponUpgradeType } from '../../types/cyberpunk';
import coreData from '../../data/core-rules.cprpack.json';
import { MARTIAL_ARTS_FORMS, MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT, type MartialHitKind } from '../../data/cyberfistsMartialArtsData';
import { checkMoveRequirements, resolveMoveRoll, describeMoveEffects, moveSupportsHeadShot } from '../../engine/martialArtsRules';
import { useRulesSettingsStore } from '../../store/rulesSettingsStore';
import { QUICKHACKS_2077_CATALOG, QUICKHACKING_OFFICIAL_RULES_GUIDE, type Quickhack2077 } from '../../data/netAndRolesData';
import {
  getWeaponClassAndRebuildInfo,
  getAmmoTypeTooltip as getAmmoTooltipInfo,
  getCyberwareCategoryTooltip,
  CEMK_WEAPON_REBUILD_SYSTEM_GUIDE,
  type WeaponClassAndRebuildInfo
} from '../../data/weaponAndCyberwareTooltips';
import {
  WEAPON_ATTACHMENTS_CATALOG,
  calculateWeaponSlotCapacity,
  TECH_MAKER_UPGRADE_OPTIONS
} from '../../data/weaponAttachmentsAndTechData';
import { ItemVisualPlaceholder } from '../../components/ItemVisualPlaceholder';
import { CommittedInput } from '../../components/CommittedInput';
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
  EyeOff,
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

// Core pp. 345-347: las granadas son munición de Grenade. La básica es Armor-Piercing (6d6, como el Grenade
// Launcher, Core p. 177). El resto no hace daño y pide una tirada para resistir.
// Lanzar: DEX + Athletics + 1d10 contra la fila Grenade Launcher de la tabla de rango, hasta 25 m (Core pp. 173, 177).
const TACTICAL_GRENADES: { id: string; name: string; damage?: string; effect: string }[] = [
  {
    id: 'frag-grenade',
    name: 'Armor-Piercing Grenade',
    damage: '6d6',
    effect: '6d6 a todos en el área. Abla la armadura 2 puntos en vez de 1 (Core p. 345).'
  },
  {
    id: 'flashbang',
    name: 'Flashbang Grenade',
    effect: 'Sin daño. DV 15 Resist Torture/Drugs o sufre Damaged Eye y Damaged Ear durante 1 minuto, sin Bonus Damage (Core p. 346).'
  },
  {
    id: 'incendiary-grenade',
    name: 'Incendiary Grenade',
    damage: '6d6',
    effect: '6d6. Si el daño pasa la armadura, el objetivo arde: 2 de daño directo a HP al final de cada turno hasta usar una Acción para apagarse; no se acumula (Core p. 346).'
  },
  {
    id: 'smoke-grenade',
    name: 'Smoke Grenade',
    effect: 'Sin daño. Humo en un área de 10 x 10 m durante 1 minuto; tareas a través del humo con -4 (Core p. 347).'
  },
  {
    id: 'emp-grenade',
    name: 'EMP Grenade',
    effect: 'Sin daño. DV 15 Cybertech o el GM elige 2 ciberware o electrónicos que quedan inoperables 1 minuto (Core p. 345).'
  },
  {
    id: 'biotoxin-grenade',
    name: 'Biotoxin Grenade',
    effect: 'Sin daño. Quien sea de carne y reciba el impacto: DV 15 Resist Torture/Drugs o 3d6 directos a HP, sin ablar armadura (Core p. 345).'
  },
  {
    id: 'poison-grenade',
    name: 'Poison Grenade',
    effect: 'Sin daño. DV 13 Resist Torture/Drugs o 2d6 directos a HP, sin ablar armadura (Core p. 346).'
  },
  {
    id: 'sleep-grenade',
    name: 'Sleep Grenade',
    effect: 'Sin daño. DV 13 Resist Torture/Drugs o queda Prone e inconsciente 1 minuto, o hasta recibir daño o que lo despierten con una Acción (Core p. 346).'
  },
  {
    id: 'teargas-grenade',
    name: 'Teargas Grenade',
    effect: 'Sin daño. Quien tenga ojos de carne: DV 13 Resist Torture/Drugs o sufre Damaged Eye 1 minuto, sin Bonus Damage (Core p. 347).'
  }
];

// DV de lanzamiento: fila Grenade Launcher (Core p. 173); más allá de 25 m no se puede lanzar (Core p. 177).
const THROWN_GRENADE_MAX_BRACKETS = ['0-6m', '7-12m', '13-25m'];
function getThrownGrenadeDv(distance: string): number | null {
  if (!THROWN_GRENADE_MAX_BRACKETS.includes(distance)) return null;
  return WEAPON_RANGE_PROFILES.grenade_launcher.dvs[distance] ?? null;
}

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
const STORAGE_KEY_TELEMETRY_SIZE = 'cpr_telemetry_size_v1';
const STORAGE_KEY_ACTIVE_CENTER = 'cpr_combat_active_center_v3';
const STORAGE_KEY_AUTO_EXPAND = 'cpr_telemetry_auto_expand_v1';
const STORAGE_KEY_SHIELD_COVER = 'cpr_shield_cover_sdp_v1';
const STORAGE_KEY_LEFT_PANELS_SIZE = 'cpr_left_panels_size_v1';
const STORAGE_KEY_DISABLED_RIGHT_MODULES = 'cpr_combat_disabled_right_modules_v1';

const QUICK_AMMO_TYPES = [
  'Basic',
  'Armor-Piercing',
  'Expansive',
  'Incendiary',
  'Smart',
  'Rubber',
  'EMP',
  'Biotoxin',
  'Poison',
  'Sleep'
];

const WeaponClassTooltip: React.FC<{
  weaponInfo: WeaponClassAndRebuildInfo;
  notes?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ weaponInfo, notes, children, className = '' }) => {
  return (
    <span className={`group/wtip relative inline-flex items-center cursor-help ${className}`}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-0 mb-2 hidden group-hover/wtip:flex flex-col z-50 w-72 text-left">
        <span className="bg-[#0b0e17] text-[#e2e8f0] text-[10px] font-mono-code p-2.5 rounded-xs border border-cyan-500/70 shadow-2xl space-y-1">
          <div className="font-tech text-xs font-bold text-cyan-300 uppercase flex items-center justify-between border-b border-[#1f2638] pb-1">
            <span>{weaponInfo.weaponClass}</span>
            {weaponInfo.rebuildBadge && (
              <span className="text-[9px] text-amber-300">{weaponInfo.rebuildBadge}</span>
            )}
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
            {weaponInfo.weaponClassTooltip}
          </p>
          {weaponInfo.rebuildTooltip && (
            <div className="pt-1 border-t border-[#1f2638] text-[9px] text-amber-300/90 leading-tight">
              <strong>Regla Especial:</strong> {weaponInfo.rebuildTooltip}
            </div>
          )}
          {notes && (
            <div className="pt-1 border-t border-[#1f2638] text-[9px] text-slate-400 italic">
              <strong>Notas:</strong> {notes}
            </div>
          )}
        </span>
        <span className="w-1.5 h-1.5 bg-[#0b0e17] border-r border-b border-cyan-500/70 rotate-45 -mt-1 ml-4" />
      </span>
    </span>
  );
};

const AmmoHoverTooltip: React.FC<{
  ammoIdOrName: string;
  children: React.ReactNode;
  className?: string;
}> = ({ ammoIdOrName, children, className = '' }) => {
  const ammoInfo = getAmmoTooltipInfo(ammoIdOrName);
  if (!ammoInfo) return <>{children}</>;

  return (
    <span className={`group/atip relative inline-flex items-center cursor-help ${className}`}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/atip:flex flex-col items-center z-50 w-72 text-left">
        <span className="bg-[#0b0e17] text-[#e2e8f0] text-[10px] font-mono-code p-2.5 rounded-xs border border-amber-500/70 shadow-2xl space-y-1">
          <div className="flex items-center justify-between border-b border-[#252016] pb-1">
            <span className="font-tech text-xs font-bold text-amber-300 uppercase">
              {ammoInfo.name}
            </span>
            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/60 px-1 rounded border border-emerald-500/30">
              {ammoInfo.costEb} eb / {ammoInfo.perUnits}u
            </span>
          </div>
          <div className="text-[10px] text-cyan-300 font-bold">
            ⚡ {ammoInfo.combatEffect}
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
            {ammoInfo.ruleExplanation}
          </p>
          <div className="text-[9px] text-[#64748b] pt-0.5 border-t border-[#1f2638]">
            Fuente: {ammoInfo.source}
          </div>
        </span>
        <span className="w-1.5 h-1.5 bg-[#0b0e17] border-r border-b border-amber-500/70 rotate-45 -mt-1" />
      </span>
    </span>
  );
};

const CyberCategoryTooltip: React.FC<{
  category: string;
  children: React.ReactNode;
  className?: string;
}> = ({ category, children, className = '' }) => {
  const catInfo = getCyberwareCategoryTooltip(category);
  if (!catInfo) return <>{children}</>;

  return (
    <span className={`group/ctip relative inline-flex items-center cursor-help ${className}`}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-0 mb-2 hidden group-hover/ctip:flex flex-col z-50 w-72 text-left">
        <span className="bg-[#0b0e17] text-[#e2e8f0] text-[10px] font-mono-code p-2.5 rounded-xs border border-purple-500/70 shadow-2xl space-y-1">
          <div className="flex items-center justify-between border-b border-[#231b30] pb-1">
            <span className="font-tech text-xs font-bold text-purple-300 uppercase">
              {catInfo.categoryName}
            </span>
            <span className="text-[9px] text-purple-400 font-bold bg-purple-950/60 px-1 rounded border border-purple-500/30">
              {catInfo.installationSite}
            </span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
            {catInfo.description}
          </p>
          <div className="text-[9px] text-amber-300 pt-0.5 border-t border-[#1f2638]">
            <strong>Requisito:</strong> {catInfo.baseRequirement}
          </div>
          <div className="text-[9px] text-cyan-300">
            <strong>Ranuras:</strong> {catInfo.slotsInfo}
          </div>
          <div className="text-[9px] text-rose-300">
            <strong>Pérdida HL:</strong> {catInfo.humanityLossRule}
          </div>
        </span>
        <span className="w-1.5 h-1.5 bg-[#0b0e17] border-r border-b border-purple-500/70 rotate-45 -mt-1 ml-4" />
      </span>
    </span>
  );
};

export interface ShieldCoverState {
  active: boolean;
  name: string;
  currentSdp: number;
  maxSdp: number;
  type: 'bulletproof_shield' | 'wood_cover' | 'metal_cover' | 'steel_cover' | 'custom';
}

export interface LeftPanelsConfig {
  columnSpan: 3 | 4 | 5;
  panelMode: Record<LeftPanelId, 'compact' | 'normal' | 'large' | 'auto_full' | 'custom'>;
  panelCustomHeight: Record<LeftPanelId, number>;
}

const DEFAULT_LEFT_PANELS_CONFIG: LeftPanelsConfig = {
  columnSpan: 3,
  panelMode: {
    vitals: 'normal',
    armor: 'auto_full',
    luck: 'normal',
    injuries: 'normal',
    cyberware: 'normal',
    consumables: 'normal'
  },
  panelCustomHeight: {
    vitals: 280,
    armor: 520,
    luck: 220,
    injuries: 320,
    cyberware: 340,
    consumables: 320
  }
};

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
  headerRight?: React.ReactNode;
  subHeaderControls?: React.ReactNode;
  accentBorderClass?: string;
  onSendToTray?: () => void;
  headerDragHandler?: (e: React.MouseEvent) => void;
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
  headerRight,
  subHeaderControls,
  accentBorderClass = 'border-[#232736]',
  onSendToTray,
  headerDragHandler
}) => {
  return (
    <div
      draggable={!headerDragHandler}
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
        onMouseDown={headerDragHandler}
        onClick={onToggleCollapse}
        className={`cursor-pointer select-none group/header transition-colors hover:bg-[#161924] ${
          isCollapsed ? '' : 'border-b border-[#1f2230]'
        } ${headerDragHandler ? 'cursor-move' : ''}`}
      >
        {/* Fila 1 (Principal) */}
        <div className="p-2 sm:p-2.5 flex items-center justify-between gap-1.5 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <div
              className="flex items-center gap-0.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                title="Arrastrar para mover arriba o abajo"
                className="cursor-grab active:cursor-grabbing p-0.5 text-slate-500 hover:text-cyan-400 transition-colors"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </span>
              <button
                type="button"
                onClick={onMoveUp}
                disabled={!canMoveUp}
                title="Subir un lugar"
                className="w-4 h-4 flex items-center justify-center rounded text-[9px] bg-[#1a1e2a] hover:bg-[#252c3e] text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={!canMoveDown}
                title="Bajar un lugar"
                className="w-4 h-4 flex items-center justify-center rounded text-[9px] bg-[#1a1e2a] hover:bg-[#252c3e] text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                ▼
              </button>
              {onSendToTray && (
                <button
                  type="button"
                  onClick={onSendToTray}
                  title="Mandar este módulo a la Bandeja Derecha (quitar del centro)"
                  className="w-4 h-4 flex items-center justify-center rounded text-[9px] bg-[#1a1e2a] hover:bg-amber-600 hover:text-black text-slate-400 hover:text-amber-300 transition-colors ml-0.5 cursor-pointer"
                >
                  ➡️
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="shrink-0">{icon}</span>
              <span className="font-tech text-xs font-bold tracking-wider text-white uppercase truncate group-hover/header:text-cyan-300 transition-colors">
                {title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {isCollapsed && summary && (
              <div className="text-[10px] font-mono-code text-cyan-300 bg-[#0e121a] px-1.5 py-0.5 rounded border border-[#20293d] max-w-[140px] truncate">
                {summary}
              </div>
            )}
            {headerRight}
            {extraHeaderActions && !subHeaderControls && extraHeaderActions}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse();
              }}
              className="p-1 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expandir' : 'Colapsar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4 text-cyan-400" />
              )}
            </button>
          </div>
        </div>

        {/* Fila 2 (Sub-barra compacta de espacio, solo cuando la tarjeta está expandida) */}
        {!isCollapsed && subHeaderControls && (
          <div
            className="px-2.5 py-1 bg-[#0c0e15] border-t border-[#1a1d29] flex items-center justify-between text-[10px]"
            onClick={(e) => e.stopPropagation()}
          >
            {subHeaderControls}
          </div>
        )}
      </div>

      {!isCollapsed && <div className="p-3.5 space-y-3">{children}</div>}
    </div>
  );
};

// Tirada de 1d10 del defensor en el cuerpo a cuerpo enfrentado (Core p. 176).
function rollDefenseD10(): number {
  return Math.floor(Math.random() * 10) + 1;
}

// Alcance de Quickhack según el hardware del Netrunner (CEMK p. 26).
const QUICKHACK_RANGE_BY_CONNECTION = { external: 6, external_plus: 8, neuroport_port: 50 } as const;

export const CombatHudView: React.FC = () => {
  // Store hooks
  const activeChar = useCharacterStore((state) => state.getActiveCharacter());
  const adjustHp = useCharacterStore((state) => state.adjustHp);
  const setHp = useCharacterStore((state) => state.setHp);
  const ablateArmor = useCharacterStore((state) => state.ablateArmor);
  const repairArmor = useCharacterStore((state) => state.repairArmor);
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
  const rollDeathSave = useCharacterStore((state) => state.rollDeathSave);
  const addDeathSavePenalty = useCharacterStore((state) => state.addDeathSavePenalty);
  const setDead = useCharacterStore((state) => state.setDead);
  const toggleTreatInjury = useCharacterStore((state) => state.toggleTreatInjury);
  const removeInjury = useCharacterStore((state) => state.removeInjury);
  const updateMartialArtRank = useCharacterStore((state) => state.updateMartialArtRank);
  const adjustImprovementPoints = useCharacterStore((state) => state.adjustImprovementPoints);
  const setInterfaceRankOverride = useCharacterStore((state) => state.setInterfaceRankOverride);
  const trainMartialArtWithIp = useCharacterStore((state) => state.trainMartialArtWithIp);
  const buyAndEquipMartialArtChip = useCharacterStore((state) => state.buyAndEquipMartialArtChip);
  const toggleEquipMartialArtChip = useCharacterStore((state) => state.toggleEquipMartialArtChip);
  const updateSoloAllocation = useCharacterStore((state) => state.updateSoloAllocation);
  const convertWeaponRebuild2077 = useCharacterStore((state) => state.convertWeaponRebuild2077);
  const toggleEmpDisableCyberware = useCharacterStore((state) => state.toggleEmpDisableCyberware);
  const clearAllEmpDisabledCyberware = useCharacterStore((state) => state.clearAllEmpDisabledCyberware);
  const restAndHealDays = useCharacterStore((state) => state.restAndHealDays);
  const repairCharacterArmor = useCharacterStore((state) => state.repairCharacterArmor);
  const installWeaponAttachment = useCharacterStore((state) => state.installWeaponAttachment);
  const removeWeaponAttachment = useCharacterStore((state) => state.removeWeaponAttachment);
  const applyTechUpgradeToWeapon = useCharacterStore((state) => state.applyTechUpgradeToWeapon);
  const applyTechUpgradeToArmor = useCharacterStore((state) => state.applyTechUpgradeToArmor);
  const updateCharacterMeta = useCharacterStore((state) => state.updateCharacterMeta);
  const installCyberwareAdvanced = useCharacterStore((state) => state.installCyberwareAdvanced);

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
  // v4.9.2 [Claude Code · 2026-10-22]: Round, era y NET Actions (plan 10).
  const era = useCombatStore((state) => state.era);
  const gmFreeEditHud = useGmModeStore((state) => state.gmFreeEdit);
  const round = useCombatStore((state) => state.round);
  const firstDamageTakenThisRound = useCombatStore((state) => state.firstDamageTakenThisRound);
  const firstHitLandedThisRound = useCombatStore((state) => state.firstHitLandedThisRound);
  const netActionsSpent = useCombatStore((state) => state.netActionsSpent);
  const nextRound = useCombatStore((state) => state.nextRound);
  const markDamageTaken = useCombatStore((state) => state.markDamageTaken);
  const markHitLanded = useCombatStore((state) => state.markHitLanded);
  const spendNetAction = useCombatStore((state) => state.spendNetAction);
  const resetCombatRound = useCombatStore((state) => state.resetCombatRound);
  // v4.9.6 [Claude Code · 2026-10-23] Registro del turno propio (decisión 48) y estado local de los movimientos de Martial Arts.
  const turnLog = useCombatStore((state) => state.turnLog);
  const recordHit = useCombatStore((state) => state.recordHit);
  const recordMove = useCombatStore((state) => state.recordMove);
  const setMovedMeters = useCombatStore((state) => state.setMovedMeters);
  const endTurn = useCombatStore((state) => state.endTurn);
  const [moveConfirmed, setMoveConfirmed] = useState<Record<string, boolean>>({});
  const [moveHeadShot, setMoveHeadShot] = useState<Record<string, boolean>>({});
  const [moveAltOn, setMoveAltOn] = useState<Record<string, boolean>>({});
  const [lastMoveRoll, setLastMoveRoll] = useState<Record<string, { rollId: string; headShot: boolean }>>({});
  // Golpes pendientes de registrar: se cuentan cuando el resultado es definitivo (después de la explosión del 10/1).
  const pendingHitsRef = useRef<Map<string, { kind: MartialHitKind; formId?: string }>>(new Map());
  useEffect(() => {
    pendingHitsRef.current.forEach((info, rollId) => {
      const entry = rollHistory.find((r) => r.id === rollId);
      if (!entry) {
        pendingHitsRef.current.delete(rollId);
        return;
      }
      if (entry.needsExplosionClick) return;
      pendingHitsRef.current.delete(rollId);
      if (entry.isHit) recordHit(info.kind, info.formId);
    });
  }, [rollHistory, recordHit]);
  const trackHit = (entry: RollEntry, kind: MartialHitKind, formId?: string) => {
    pendingHitsRef.current.set(entry.id, { kind, formId });
  };

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

  const [_rightColumnOrder, setRightColumnOrder] = useState<RightPanelId[]>(() => {
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

  const [activeCenterModules, setActiveCenterModules] = useState<RightPanelId[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_CENTER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed
            .map((id) => (id === 'roleQuickhacks' ? 'roleAbility' : id))
            .filter((id) => DEFAULT_RIGHT_ORDER.includes(id as RightPanelId)) as RightPanelId[];
          return clean;
        }
      }
    } catch {}
    return [];
  });

  const [openDojoForms, setOpenDojoForms] = useState<Record<string, boolean>>({});
  const toggleDojoForm = (id: string) => setOpenDojoForms(prev => ({ ...prev, [id]: !prev[id] }));

  const [isRightTrayCollapsed, setIsRightTrayCollapsed] = useState<boolean>(false);
  const [sidePreviewModule, setSidePreviewModule] = useState<RightPanelId | null>(null);
  const [isTrayDragOver, setIsTrayDragOver] = useState<boolean>(false);

  const [disabledRightModules, setDisabledRightModules] = useState<RightPanelId[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DISABLED_RIGHT_MODULES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const toggleDisableRightModule = (modId: RightPanelId) => {
    setDisabledRightModules((prev) => {
      const exists = prev.includes(modId);
      const next = exists ? prev.filter((id) => id !== modId) : [...prev, modId];
      try {
        localStorage.setItem(STORAGE_KEY_DISABLED_RIGHT_MODULES, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [showRightModulesFilter, setShowRightModulesFilter] = useState(false);
  const [empFeedback, setEmpFeedback] = useState<string | null>(null);
  const [combatRestDays, setCombatRestDays] = useState<number>(1);
  const [combatRestAntibodies, setCombatRestAntibodies] = useState<boolean>(false);
  const [combatRestCryotank, setCombatRestCryotank] = useState<boolean>(false);
  const [combatRestFeedback, setCombatRestFeedback] = useState<string | null>(null);
  const [combatRepairFeedback, setCombatRepairFeedback] = useState<string | null>(null);
  const [smartCoverBypass, setSmartCoverBypass] = useState<Record<string, boolean>>({});
  const [powerRicochetActive, setPowerRicochetActive] = useState<Record<string, boolean>>({});
  const [techChargeShotActive, setTechChargeShotActive] = useState<Record<string, boolean>>({});
  const [openRebuildWorkshopsCombat, setOpenRebuildWorkshopsCombat] = useState<Record<string, boolean>>({});
  const toggleRebuildWorkshopCombat = (instanceId: string) => {
    setOpenRebuildWorkshopsCombat((prev) => ({ ...prev, [instanceId]: !prev[instanceId] }));
  };

  const [leftPanelsConfig, setLeftPanelsConfig] = useState<LeftPanelsConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEFT_PANELS_SIZE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          columnSpan: [3, 4, 5].includes(parsed.columnSpan) ? parsed.columnSpan : 3,
          panelMode: { ...DEFAULT_LEFT_PANELS_CONFIG.panelMode, ...(parsed.panelMode || {}) },
          panelCustomHeight: { ...DEFAULT_LEFT_PANELS_CONFIG.panelCustomHeight, ...(parsed.panelCustomHeight || {}) }
        };
      }
    } catch {}
    return DEFAULT_LEFT_PANELS_CONFIG;
  });

  const leftColumnSpan = leftPanelsConfig.columnSpan;
  const leftPanelSizeMode = leftPanelsConfig.panelMode;
  const leftPanelCustomHeight = leftPanelsConfig.panelCustomHeight;

  const setLeftColumnSpan = (span: 3 | 4 | 5) => {
    setLeftPanelsConfig((prev) => {
      const next = { ...prev, columnSpan: span };
      localStorage.setItem(STORAGE_KEY_LEFT_PANELS_SIZE, JSON.stringify(next));
      return next;
    });
  };

  const setLeftPanelMode = (panelId: LeftPanelId, mode: 'compact' | 'normal' | 'large' | 'auto_full' | 'custom') => {
    setLeftPanelsConfig((prev) => {
      const next = {
        ...prev,
        panelMode: { ...prev.panelMode, [panelId]: mode }
      };
      localStorage.setItem(STORAGE_KEY_LEFT_PANELS_SIZE, JSON.stringify(next));
      return next;
    });
  };

  const adjustLeftPanelHeight = (panelId: LeftPanelId, delta: number) => {
    setLeftPanelsConfig((prev) => {
      const currentH = prev.panelCustomHeight[panelId] || 280;
      const newH = Math.max(120, Math.min(800, currentH + delta));
      const next = {
        ...prev,
        panelMode: { ...prev.panelMode, [panelId]: 'custom' as const },
        panelCustomHeight: { ...prev.panelCustomHeight, [panelId]: newH }
      };
      localStorage.setItem(STORAGE_KEY_LEFT_PANELS_SIZE, JSON.stringify(next));
      return next;
    });
  };

  const handleLeftPanelResizeMouseDown = (e: React.MouseEvent, panelId: LeftPanelId) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startH = leftPanelCustomHeight[panelId] || 280;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newH = Math.max(120, Math.min(800, startH + deltaY));
      setLeftPanelsConfig((prev) => {
        const next = {
          ...prev,
          panelMode: { ...prev.panelMode, [panelId]: 'custom' as const },
          panelCustomHeight: { ...prev.panelCustomHeight, [panelId]: newH }
        };
        localStorage.setItem(STORAGE_KEY_LEFT_PANELS_SIZE, JSON.stringify(next));
        return next;
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const [shieldCover, setShieldCover] = useState<ShieldCoverState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHIELD_COVER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      active: false,
      name: 'Escudo Antibalas',
      currentSdp: 10,
      maxSdp: 10,
      type: 'bulletproof_shield'
    };
  });

  const updateShieldCover = (patch: Partial<ShieldCoverState>) => {
    setShieldCover((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY_SHIELD_COVER, JSON.stringify(next));
      return next;
    });
  };

  const setShieldSdp = (sdp: number) => {
    updateShieldCover({ currentSdp: Math.max(0, Math.min(shieldCover.maxSdp, sdp)) });
  };

  const repairShield = () => {
    updateShieldCover({ currentSdp: shieldCover.maxSdp });
  };

  const equipShieldPreset = (preset: 'bulletproof_shield' | 'wood_cover' | 'metal_cover' | 'steel_cover') => {
    let name = 'Escudo Antibalas';
    let maxSdp = 10;
    if (preset === 'wood_cover') {
      name = 'Cobertura Madera / Puerta';
      maxSdp = 15;
    } else if (preset === 'metal_cover') {
      name = 'Cobertura Vehículo / Metal';
      maxSdp = 25;
    } else if (preset === 'steel_cover') {
      name = 'Cobertura Muro de Acero';
      maxSdp = 35;
    }
    updateShieldCover({
      active: true,
      type: preset,
      name,
      maxSdp,
      currentSdp: maxSdp
    });
  };

  const setArmorSp = (location: 'head' | 'body', targetSp: number) => {
    const current = location === 'head' ? (activeChar?.headArmor?.currentSp ?? 0) : (activeChar?.bodyArmor?.currentSp ?? 0);
    const max = location === 'head' ? (activeChar?.headArmor?.maxSp ?? 0) : (activeChar?.bodyArmor?.maxSp ?? 0);
    const clampedTarget = Math.max(0, Math.min(max, targetSp));
    if (clampedTarget === max) {
      repairArmor(location);
    } else if (clampedTarget <= current) {
      ablateArmor(location, current - clampedTarget);
    } else {
      repairArmor(location);
      if (max > clampedTarget) {
        ablateArmor(location, max - clampedTarget);
      }
    }
  };

  const [telemetryAutoExpand, setTelemetryAutoExpand] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTO_EXPAND);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [telemetrySizeConfig, setTelemetrySizeConfig] = useState<{
    height: number;
    width: number;
    compact: boolean;
    floatingPos: { x: number; y: number } | null;
  }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TELEMETRY_SIZE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          height: typeof parsed.height === 'number' ? Math.max(110, Math.min(780, parsed.height)) : 280,
          width: typeof parsed.width === 'number' ? Math.max(260, Math.min(900, parsed.width)) : 420,
          compact: !!parsed.compact,
          floatingPos:
            parsed.floatingPos &&
            typeof parsed.floatingPos.x === 'number' &&
            typeof parsed.floatingPos.y === 'number'
              ? parsed.floatingPos
              : null
        };
      }
    } catch {}
    return {
      height: 280,
      width: 420,
      compact: false,
      floatingPos: null
    };
  });

  const telemetryHeight = telemetrySizeConfig.height;
  const telemetryWidth = telemetrySizeConfig.width;
  const telemetryCompactMode = telemetrySizeConfig.compact;
  const floatingPos = telemetrySizeConfig.floatingPos;
  const isEffectiveCompact = telemetryCompactMode || telemetryHeight < 200 || telemetryWidth < 340;

  const setTelemetryHeight = (h: number) => {
    setTelemetrySizeConfig((prev) => {
      const next = { ...prev, height: h };
      localStorage.setItem(STORAGE_KEY_TELEMETRY_SIZE, JSON.stringify(next));
      return next;
    });
  };

  const setTelemetryWidth = (w: number) => {
    setTelemetrySizeConfig((prev) => {
      const next = { ...prev, width: w };
      localStorage.setItem(STORAGE_KEY_TELEMETRY_SIZE, JSON.stringify(next));
      return next;
    });
  };

  const setTelemetryCompactMode = (c: boolean) => {
    setTelemetrySizeConfig((prev) => {
      const next = { ...prev, compact: c };
      localStorage.setItem(STORAGE_KEY_TELEMETRY_SIZE, JSON.stringify(next));
      return next;
    });
  };

  const setFloatingPos = (pos: { x: number; y: number } | null) => {
    setTelemetrySizeConfig((prev) => {
      const next = { ...prev, floatingPos: pos };
      localStorage.setItem(STORAGE_KEY_TELEMETRY_SIZE, JSON.stringify(next));
      return next;
    });
  };

  const applyTelemetryPreset = (preset: 'xs' | 's' | 'm' | 'l') => {
    let h = 280;
    let w = 420;
    let compact = false;
    if (preset === 'xs') {
      h = 140;
      w = 300;
      compact = true;
    } else if (preset === 's') {
      h = 220;
      w = 360;
      compact = false;
    } else if (preset === 'm') {
      h = 340;
      w = 460;
      compact = false;
    } else if (preset === 'l') {
      h = 520;
      w = 620;
      compact = false;
    }
    const next = { height: h, width: w, compact, floatingPos };
    setTelemetrySizeConfig(next);
    localStorage.setItem(STORAGE_KEY_TELEMETRY_SIZE, JSON.stringify(next));
  };

  const adjustTelemetrySize = (delta: number) => {
    const newH = Math.max(110, Math.min(780, telemetryHeight + delta));
    const newW = Math.max(260, Math.min(900, telemetryWidth + delta));
    const next = { height: newH, width: newW, compact: telemetryCompactMode, floatingPos };
    setTelemetrySizeConfig(next);
    localStorage.setItem(STORAGE_KEY_TELEMETRY_SIZE, JSON.stringify(next));
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startH = telemetryHeight;
    const startW = telemetryWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const newH = Math.max(110, Math.min(780, startH + deltaY));
      const newW = Math.max(260, Math.min(900, startW + deltaX));
      setTelemetryHeight(newH);
      setTelemetryWidth(newW);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleFloatingDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, [data-no-drag]')) return;
    e.preventDefault();
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const currentX = floatingPos?.x ?? (window.innerWidth - telemetryWidth - 24);
    const currentY = floatingPos?.y ?? (window.innerHeight - telemetryHeight - 120);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;
      const nextX = Math.max(10, Math.min(window.innerWidth - 120, currentX + deltaX));
      const nextY = Math.max(10, Math.min(window.innerHeight - 80, currentY + deltaY));
      setFloatingPos({ x: nextX, y: nextY });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const toggleCenterModule = (panelId: RightPanelId) => {
    setActiveCenterModules((prev) => {
      const exists = prev.includes(panelId);
      const next = exists ? prev.filter((id) => id !== panelId) : [...prev, panelId];
      localStorage.setItem(STORAGE_KEY_ACTIVE_CENTER, JSON.stringify(next));
      return next;
    });
  };

  const sendModuleToTray = (panelId: RightPanelId) => {
    setActiveCenterModules((prev) => {
      const next = prev.filter((id) => id !== panelId);
      localStorage.setItem(STORAGE_KEY_ACTIVE_CENTER, JSON.stringify(next));
      return next;
    });
  };

  const applyCenterPreset = (preset: 'shooting' | 'melee' | 'netrunner' | 'all' | 'clean') => {
    let next: RightPanelId[] = [];
    if (preset === 'shooting') {
      next = ['telemetry', 'inHand', 'rangefinder'];
    } else if (preset === 'melee') {
      next = ['telemetry', 'inHand', 'martialArts'];
    } else if (preset === 'netrunner') {
      next = ['telemetry', 'quickhacks2077', 'inHand'];
    } else if (preset === 'all') {
      next = [...DEFAULT_RIGHT_ORDER];
    } else if (preset === 'clean') {
      next = ['inHand'];
    }
    setActiveCenterModules(next);
    localStorage.setItem(STORAGE_KEY_ACTIVE_CENTER, JSON.stringify(next));
  };

  const [draggedItem, setDraggedItem] = useState<{ column: 'left' | 'right' | 'tray'; id: string } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const toggleBoxCollapse = (boxId: string) => {
    setCollapsedBoxes(prev => {
      const next = { ...prev, [boxId]: !prev[boxId] };
      localStorage.setItem(STORAGE_KEY_COLLAPSED, JSON.stringify(next));
      return next;
    });
  };

  const ensureTelemetryExpanded = () => {
    if (telemetryAutoExpand && collapsedBoxes['telemetry']) {
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
    setActiveCenterModules(DEFAULT_RIGHT_ORDER);
    localStorage.setItem(STORAGE_KEY_LEFT_ORDER, JSON.stringify(DEFAULT_LEFT_ORDER));
    localStorage.setItem(STORAGE_KEY_RIGHT_ORDER, JSON.stringify(DEFAULT_RIGHT_ORDER));
    localStorage.setItem(STORAGE_KEY_ACTIVE_CENTER, JSON.stringify(DEFAULT_RIGHT_ORDER));
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
    const idx = activeCenterModules.indexOf(panelId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= activeCenterModules.length) return;
    const next = [...activeCenterModules];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setActiveCenterModules(next);
    localStorage.setItem(STORAGE_KEY_ACTIVE_CENTER, JSON.stringify(next));
  };

  const handleDragStart = (column: 'left' | 'right' | 'tray', id: string) => {
    setDraggedItem({ column, id });
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (dragOverItem !== targetId) setDragOverItem(targetId);
  };

  const handleDrop = (targetColumn: 'left' | 'right', targetId: string) => {
    if (!draggedItem) return;
    if (draggedItem.column === 'tray' && targetColumn === 'right') {
      const draggedPanelId = draggedItem.id as RightPanelId;
      const currentActive = [...activeCenterModules];
      const targetIdx = currentActive.indexOf(targetId as RightPanelId);
      const filtered = currentActive.filter((id) => id !== draggedPanelId);
      const insertAt = targetIdx !== -1 ? Math.min(targetIdx, filtered.length) : filtered.length;
      filtered.splice(insertAt, 0, draggedPanelId);
      setActiveCenterModules(filtered);
      localStorage.setItem(STORAGE_KEY_ACTIVE_CENTER, JSON.stringify(filtered));
    } else if (draggedItem.column === targetColumn) {
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
        const fromIdx = activeCenterModules.indexOf(draggedItem.id as RightPanelId);
        const toIdx = activeCenterModules.indexOf(targetId as RightPanelId);
        if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
          const next = [...activeCenterModules];
          const [removed] = next.splice(fromIdx, 1);
          next.splice(toIdx, 0, removed);
          setActiveCenterModules(next);
          localStorage.setItem(STORAGE_KEY_ACTIVE_CENTER, JSON.stringify(next));
        }
      }
    }
    setDraggedItem(null);
    setDragOverItem(null);
    setIsTrayDragOver(false);
  };

  const [incomingDamageInput, setIncomingDamageInput] = useState<number>(10);
  const [damageFeedback, setDamageFeedback] = useState<string | null>(null);
  const [calcLocation, setCalcLocation] = useState<'shield' | 'body' | 'head'>('body');
  const [calcAttackType, setCalcAttackType] = useState<'standard' | 'ap' | 'melee' | 'martial_arts' | 'brawling' | 'direct'>('standard');
  const [calcIsCritical, setCalcIsCritical] = useState<boolean>(false);
  const [lastDeathSave, setLastDeathSave] = useState<DeathSaveResult | null>(null);
  // Core p. 176: el cuerpo a cuerpo es enfrentado contra DEX + Evasion + 1d10 del defensor.
  const [meleeDefenseBase, setMeleeDefenseBase] = useState<number>(10);
  // CEMK p. 16: Jack In y Boot Out usan la WILL (y Concentration) reales del objetivo.
  const [quickhackTargetWill, setQuickhackTargetWill] = useState<number>(6);
  const [quickhackTargetConcentration, setQuickhackTargetConcentration] = useState<number>(2);
  // CEMK p. 26: alcance según el hardware. CEMK p. 16: 1 Quickhack por objetivo por turno.
  const [quickhackConnection, setQuickhackConnection] = useState<'external' | 'external_plus' | 'neuroport_port'>('neuroport_port');
  const [quickhackUsedThisTurn, setQuickhackUsedThisTurn] = useState<boolean>(false);
  const [roundToolFeedback, setRoundToolFeedback] = useState<string | null>(null);
  // Alcance por defecto según el hardware (CEMK RB p.26; Core p.208): el Range Upgrade del cyberdeck no se guarda en el modelo de la ficha, así que se asume false.
  const defaultQuickhackRangeM = jackInRangeM({
    cyberdeckPort: (activeChar?.installedCyberwareIds ?? []).includes('cw-cemk-cyberdeck-port'),
    rangeUpgrade: false
  });
  useEffect(() => {
    setQuickhackConnection(defaultQuickhackRangeM === 50 ? 'neuroport_port' : defaultQuickhackRangeM === 8 ? 'external_plus' : 'external');
  }, [activeChar?.id, defaultQuickhackRangeM]);
  const [calcPassExcess, setCalcPassExcess] = useState<boolean>(true);
  const [showArmorRulesGuide, setShowArmorRulesGuide] = useState<boolean>(false);
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
  const [quickhackFeedback, setQuickhackFeedback] = useState<string | null>(null);
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
  const [inHandSubTab, setInHandSubTab] = useState<Record<string, 'ammo' | 'dv' | 'autofire' | 'attachments' | 'all'>>({});
  const setWeaponSubTab = (id: string, tab: 'ammo' | 'dv' | 'autofire' | 'attachments' | 'all') => {
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
      effect: found?.effect || item.details || 'Granada táctica estándar.'
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
  const activeInterfaceRank = activeChar ? getInterfaceRank(activeChar) : 0;
  // Combat Awareness solo cuenta si el rol es Solo (Core p.146).
  const isSoloActive = activeChar?.role === 'Solo';
  const soloAlloc = isSoloActive ? activeChar?.soloAllocation : undefined;
  // Core p.146: Fumble Recovery ignora los 1 al atacar (siguen valiendo 1).
  const fumbleOpts = soloAlloc?.fumbleRecovery ? { ignoreCriticalFailure: true } : undefined;
  // Core p.197: NET Actions por rango de Interface.
  const netActionsMax = netActionsForInterface(activeInterfaceRank);
  const hasNeuroportActive = !!activeChar?.hasNeuroport || (activeChar?.installedCyberwareIds ?? []).includes('cw-cemk-neuroport');
  // CEMK RB p.26: en 2045 los Quickhacks solo con Neuroport.
  const quickhacksAllowed = canUseQuickhacks(era, hasNeuroportActive);
  const quickhackMaxDv = maxQuickhackDv(activeInterfaceRank);
  const quickhackFirewallDv = neuroportFirewallDv(activeInterfaceRank);
  const effectiveBody = getEffectiveBody(activeChar);
  const maxHp = calculateMaxHp(effectiveBody, activeChar?.stats?.WILL ?? 6);
  const seriousWoundThresh = calculateSeriouslyWoundedThreshold(maxHp);
  const isSeriouslyWounded = (activeChar?.currentHp ?? 0) < seriousWoundThresh;
  const isMortallyWounded = (activeChar?.currentHp ?? 0) <= 0;
  const hasCyberarm = (activeChar?.installedCyberwareIds ?? []).some(id => id.includes('cyberarm') || id.includes('gorilla-arms'));
  const unarmedDmg = calculateUnarmedDamage(effectiveBody, hasCyberarm);
  // Martial Arts (Core p.178): daño por BODY sin mínimo de ciberbrazo (decisión 46); cada forma es una skill aparte (Core p.83).
  const martialDmg = calculateMartialArtsDamage(effectiveBody);
  const martialKnownForms = MARTIAL_ARTS_FORMS.filter(
    (f) => (activeChar?.knownMartialArts?.[f.id] ?? 0) > 0 || (activeChar?.equippedMartialArtChips || []).includes(f.id)
  );
  const martialHandForm = martialKnownForms.find((f) => f.id === selectedMartialFormId) ?? martialKnownForms[0] ?? null;
  const martialHandRank = martialHandForm
    ? (activeChar?.equippedMartialArtChips || []).includes(martialHandForm.id)
      ? Math.max(3, activeChar?.knownMartialArts?.[martialHandForm.id] ?? 0)
      : activeChar?.knownMartialArts?.[martialHandForm.id] ?? 0
    : 0;
  const martialFormSelector = martialHandForm ? (
    <label className="flex items-center gap-2 text-[10px] font-mono-code text-[#94a3b8]">
      Forma:
      <select
        aria-label="Forma de Martial Arts"
        value={martialHandForm.id}
        onChange={(e) => setSelectedMartialFormId(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0b0e] border border-[#2a3148] text-white rounded-xs px-1.5 py-0.5"
      >
        {martialKnownForms.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name} (R{(activeChar?.equippedMartialArtChips || []).includes(f.id) ? Math.max(3, activeChar?.knownMartialArts?.[f.id] ?? 0) : activeChar?.knownMartialArts?.[f.id] ?? 0})
          </option>
        ))}
      </select>
    </label>
  ) : (
    <span className="text-[10px] font-mono-code text-[#f59e0b]">Sin forma de Martial Arts</span>
  );
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

  // Core p. 176: tirada de defensa del rival (DEX + Evasion + 1d10); el empate gana el defensor.
  const rollMeleeDefenseDv = (): { dv: number; label: string } => {
    const d10 = rollDefenseD10();
    return { dv: meleeDefenseBase + d10, label: `vs Defensa ${meleeDefenseBase} + 1d10 (${d10})` };
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

  // Calculation variables for Interactive Damage Calculator
  const {
    effectiveSp: calcEffectiveSp,
    penetratingDamage: calcPenetratingDamage,
    spAblation: calcSpAblation,
    hpLoss: calcHpLoss,
    shieldLoss: calcShieldLoss,
    newShieldSdp: calcNewShieldSdp,
    excessDamage: calcExcessDamage,
    excessEffectiveSp: calcExcessEffectiveSp,
    excessSpAblation: calcExcessSpAblation,
    excessHpLoss: calcExcessHpLoss
  } = calculateIncomingImpact({
    damage: incomingDamageInput,
    location: calcLocation,
    attackType: calcAttackType,
    isCritical: calcIsCritical,
    passExcess: calcPassExcess,
    headSp: activeChar?.headArmor?.currentSp ?? 0,
    bodySp: activeChar?.bodyArmor?.currentSp ?? 0,
    shieldSdp: shieldCover.currentSdp,
    // Core p. 188: con Cracked Skull los Ataques Apuntados a la cabeza multiplican x3 en vez de x2.
    hasCrackedSkull: (activeChar?.activeInjuries ?? []).some(inj => !inj.isTreated && inj.name.includes('Cracked Skull'))
  });

  let calcExplanation = '';
  if (calcLocation === 'shield') {
    if (incomingDamageInput <= shieldCover.currentSdp) {
      calcExplanation = `El escudo/cobertura detiene por completo el impacto recibiendo -${calcShieldLoss} SDP (quedan ${calcNewShieldSdp} SDP). 0 daño a la armadura y 0 daño a HP.`;
    } else if (calcPassExcess) {
      calcExplanation = `El ataque destruye el escudo (-${calcShieldLoss} SDP) y el exceso (${calcExcessDamage}) golpea el torso (SP efectivo: ${calcExcessEffectiveSp}). Sufre -${calcExcessSpAblation} SP y -${calcExcessHpLoss} HP.`;
    } else {
      calcExplanation = `El ataque destruye el escudo (-${calcShieldLoss} SDP). Como la regla estándar no pasa exceso, 0 daño a HP.`;
    }
  } else {
    if (calcAttackType === 'direct') {
      calcExplanation = `Daño directo ignora el 100% del blindaje (0 SP). 0 ablación a la armadura. -${calcHpLoss} HP directo.`;
    } else if (calcPenetratingDamage > 0) {
      calcExplanation = `El daño (${incomingDamageInput}) supera el SP efectivo (${calcEffectiveSp}${calcAttackType === 'melee' || calcAttackType === 'martial_arts' ? ' [50% por Melee/Artes Marciales]' : ''}) -> Sufre -${calcSpAblation} SP de ablación y -${calcHpLoss} HP${calcLocation === 'head' ? ' (daño penetrante ×2 a Cabeza)' : ''}${calcIsCritical ? ' (+5 por Crítico)' : ''}.`;
    } else {
      calcExplanation = `El daño (${incomingDamageInput}) NO supera el SP efectivo (${calcEffectiveSp}) -> El blindaje resiste por completo. 0 ablación de SP y 0 daño a HP.`;
    }
  }

  const handleApplyCalculatedDamage = () => {
    ensureTelemetryExpanded();
    const wasMortallyWounded = (activeChar?.currentHp ?? 0) < 1;
    const incomingHpLoss = calcLocation === 'shield' ? (calcPassExcess ? calcExcessHpLoss : 0) : calcHpLoss;
    // Core p.146: Damage Deflection reduce el primer daño que recibe el Solo en el Round (después de armadura y ablación).
    const deflection = isSoloActive
      ? applyDamageDeflection(incomingHpLoss, soloAlloc, !firstDamageTakenThisRound)
      : { damage: incomingHpLoss, reduced: 0 };
    const appliedHpLoss = deflection.damage;
    if (incomingHpLoss > 0) {
      markDamageTaken();
    }
    const critLocation: 'head' | 'body' = calcLocation === 'head' ? 'head' : 'body';
    if (calcLocation === 'shield') {
      if (calcShieldLoss > 0) {
        setShieldSdp(calcNewShieldSdp);
      }
      if (calcExcessDamage > 0 && calcPassExcess) {
        if (calcExcessSpAblation > 0) {
          ablateArmor('body', calcExcessSpAblation);
        }
        if (appliedHpLoss > 0) {
          adjustHp(-appliedHpLoss);
        }
      }
    } else {
      if (calcSpAblation > 0) {
        ablateArmor(calcLocation, calcSpAblation);
      }
      if (appliedHpLoss > 0) {
        adjustHp(-appliedHpLoss);
      }
    }

    // Core p. 187: con dos o más 6 se sufre la Herida Crítica aunque el daño no atraviese el SP.
    if (calcIsCritical && (calcLocation !== 'shield' || calcExcessDamage > 0)) {
      const injury = inflictRandomInjury(critLocation);
      // Going Metal p. 94: un FBC inmune a la herida crítica también ignora el daño extra (+5).
      if (injury === null && activeChar?.fbcState?.isFullBodyConversion && calcLocation !== 'shield' && calcHpLoss > 0) {
        adjustHp(Math.min(5, calcHpLoss));
      }
    }
    // Core p. 188: Mortally Wounded sufre una Herida Crítica por cada ataque que le hace daño y su Death Save Penalty sube 1.
    if (wasMortallyWounded && calcAttackType !== 'direct' && appliedHpLoss > 0) {
      inflictRandomInjury(critLocation);
      addDeathSavePenalty(1);
    }

    const entry: RollEntry = {
      id: `dmg-calc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      type: 'damage',
      weaponName: `Impacto Recibido: ${calcAttackType.toUpperCase()}`,
      damageFormula: `${incomingDamageInput} Dmg -> ${calcLocation === 'shield' ? 'Escudo/Cobertura' : calcLocation === 'head' ? 'Cabeza' : 'Torso'}${deflection.reduced > 0 ? ` · Damage Deflection −${deflection.reduced} (Core p.146)` : ''}`,
      distanceLabel: calcLocation === 'shield' ? `SDP -${calcShieldLoss}` : `SP -${calcSpAblation}`,
      diceResults: [],
      baseDamageTotal: incomingDamageInput,
      finalDamageTotal: appliedHpLoss,
      damageRolled: true
    };
    addRollEntry(entry);

    const feedbackText = calcLocation === 'shield'
      ? `💥 Escudo: -${calcShieldLoss} SDP${calcExcessHpLoss > 0 ? `, Torso: -${calcExcessSpAblation} SP, -${appliedHpLoss} HP` : ''}${deflection.reduced > 0 ? ` · Damage Deflection −${deflection.reduced} (Core p.146)` : ''}`
      : `💥 ${calcLocation === 'head' ? 'Cabeza' : 'Torso'}: -${calcSpAblation} SP, -${appliedHpLoss} HP${deflection.reduced > 0 ? ` · Damage Deflection −${deflection.reduced} (Core p.146)` : ''}`;
    setDamageFeedback(feedbackText);
    setTimeout(() => setDamageFeedback(null), 5000);
  };

  // Core p.146: Spot Weakness suma al daño (antes de armadura) del primer Ataque exitoso del Round; todo daño de Ataque exitoso marca el primer acierto.
  const addOutgoingDamageEntry = (dmgEntry: RollEntry) => {
    const bonus = isSoloActive ? spotWeaknessBonus(soloAlloc, !firstHitLandedThisRound) : 0;
    if (bonus > 0 && dmgEntry.finalDamageTotal !== undefined) {
      dmgEntry.finalDamageTotal += bonus;
      dmgEntry.damageFormula = `${dmgEntry.damageFormula} + ${bonus} (Spot Weakness, Core p.146)`;
    }
    markHitLanded();
    addRollEntry(dmgEntry);
  };

  // Round (decisión 1 del plan 10): pasa de Round y reinicia el Quickhack por objetivo.
  const handleNextRound = () => {
    nextRound();
    setQuickhackUsedThisTurn(false);
  };

  const handleEndTurn = () => {
    endTurn();
    setMoveConfirmed({});
    setMoveHeadShot({});
    setMoveAltOn({});
  };

  const handleResetCombat = () => {
    resetCombatRound();
    setQuickhackUsedThisTurn(false);
  };

  // Core pp.126/168: Iniciativa = REF + 1d10 (+ Initiative Reaction, p.146).
  const handleRollInitiative = () => {
    ensureTelemetryExpanded();
    let ref = activeChar?.stats?.REF ?? 0;
    if (activeChar?.fbcState?.isFullBodyConversion) {
      ref = Math.max(ref, activeChar.fbcState.statFloor ?? 0);
    }
    const armorPenalty = Math.max(Math.abs(activeChar?.headArmor?.penalty ?? 0), Math.abs(activeChar?.bodyArmor?.penalty ?? 0));
    ref = Math.max(0, ref - armorPenalty);
    const r = rollInitiative(ref, soloAlloc);
    addRollEntry({
      id: `roll-init-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'skill',
      weaponName: '⏱️ Iniciativa (Core pp. 126, 168)',
      statName: 'REF',
      statVal: ref,
      skillName: 'Iniciativa',
      d10: r.natural,
      totalAttack: r.total,
      critDie: null,
      needsExplosionClick: false,
      explosionType: null,
      penaltyBreakdown: [r.breakdown]
    });
    setRoundToolFeedback(`⏱️ Iniciativa: ${r.breakdown}`);
    setTimeout(() => setRoundToolFeedback(null), 6000);
  };

  // Core p.82 y p.146: Perception = INT + Perception + 1d10 (+ Threat Detection).
  const handleRollPerception = () => {
    ensureTelemetryExpanded();
    const int = activeChar?.stats?.INT ?? 0;
    const perceptionLevel = activeChar?.skills?.perception ?? 0;
    const r = rollPerception(int, perceptionLevel, soloAlloc);
    addRollEntry({
      id: `roll-perc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'skill',
      weaponName: '👁️ Perception (Core p.82)',
      statName: 'INT',
      statVal: int,
      skillName: 'Perception',
      skillVal: perceptionLevel,
      d10: r.natural,
      totalAttack: r.total,
      critDie: null,
      needsExplosionClick: false,
      explosionType: null,
      penaltyBreakdown: [r.breakdown]
    });
    setRoundToolFeedback(`👁️ Perception: ${r.breakdown}`);
    setTimeout(() => setRoundToolFeedback(null), 6000);
  };

  // Core p.197: cada Jack In / Breach / Quickhack gasta 1 NET Action del Round.
  const trySpendNetAction = (): boolean => {
    if (netActionsMax > 0 && netActionsSpent >= netActionsMax) {
      setQuickhackFeedback(`⛔ Sin NET Actions este Round (${netActionsSpent}/${netActionsMax}, Core p.197). Pulsa "Siguiente Round" para recuperarlas.`);
      setTimeout(() => setQuickhackFeedback(null), 5000);
      return false;
    }
    spendNetAction();
    return true;
  };

  // Handle Step 1: Weapon Attack Check (1d10)
  const handleAttackClick = (weapon: WeaponItem, instanceId: string) => {
    ensureTelemetryExpanded();
    // Un Ataque Apuntado nunca es Autofire (Core p. 170): no se gastan 10 balas ni se usa el DV de autofire.
    const isAuto = !!autofireByWeapon[instanceId] && aimedShotTarget === 'none';
    const ammoCost = isAuto ? 10 : (weapon.type === 'Melee' ? 0 : 1);

    // Se valida el alcance antes de gastar munición.
    const currentDv = getDvForWeapon(weapon, selectedDistance, isAuto);
    if (currentDv === null && weapon.type !== 'Melee') {
      alert(`El objetivo a ${selectedDistance} está fuera de alcance.`);
      return;
    }

    if (ammoCost > 0) {
      const success = consumeAmmo(instanceId, ammoCost);
      if (!success) {
        alert(`¡Munición insuficiente! Necesitas ${ammoCost} balas.`);
        return;
      }
    }

    const meleeDefense = weapon.type === 'Melee' ? rollMeleeDefenseDv() : null;

    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }

    const entry = createInitialAttackRoll(activeChar, weapon, {
      targetDv: meleeDefense ? meleeDefense.dv : currentDv,
      distanceLabel: meleeDefense ? `Cuerpo a cuerpo ${meleeDefense.label}` : selectedDistance,
      luckSpent,
      isAutofire: isAuto,
      weaponInstanceId: instanceId,
      aimedShotTarget
    }, aimedShotTarget, fumbleOpts);

    if (weapon.type === 'Melee') trackHit(entry, 'melee');
    addRollEntry(entry);
  };

  // Handle Step 2: Damage Roll (Xd6)
  const handleDamageClick = (weapon: WeaponItem, instanceId: string) => {
    ensureTelemetryExpanded();
    const isAuto = !!autofireByWeapon[instanceId];
    // El daño corresponde al último ataque de esta arma, no al último acierto del historial.
    const recentAttack = rollHistory.find(
      (r) => r.type === 'attack' && r.weaponInstanceId === instanceId
    );
    const recentHit = recentAttack?.isHit ? recentAttack : undefined;
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
      addOutgoingDamageEntry(dmgEntry);
    } else {
      addRollEntry(dmgEntry);
    }
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
      ...(() => { const def = rollMeleeDefenseDv(); return { targetDv: def.dv, distanceLabel: `${'Cuerpo a cuerpo (Enfrentada)'} ${def.label}` }; })(),
      luckSpent,
      weaponInstanceId: 'unarmed-brawling',
      aimedShotTarget
    }, aimedShotTarget, fumbleOpts);
    trackHit(entry, 'brawling');
    addRollEntry(entry);
  };

  // Unarmed: Brawling damage
  const handleBrawlingDamage = () => {
    ensureTelemetryExpanded();
    const dmgEntry = createDamageRoll('Puños (Brawling)', unarmedDmg, false, 1, 'unarmed-brawling', aimedShotTarget);
    addOutgoingDamageEntry(dmgEntry);
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
      ...(() => { const def = rollMeleeDefenseDv(); return { targetDv: def.dv, distanceLabel: `${'Presa cuerpo a cuerpo (Enfrentada)'} ${def.label}` }; })(),
      luckSpent,
      weaponInstanceId: 'unarmed-grapple'
    });
    addRollEntry(entry);
  };

  // Unarmed: Choke maneuver
  const handleChoke = () => {
    ensureTelemetryExpanded();
    const bodyDmg = activeChar ? getEffectiveBody(activeChar) : 6;
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
    if (!martialHandForm || !activeChar) return;
    ensureTelemetryExpanded();
    const martialArtsWeapon: WeaponItem = {
      id: 'unarmed-martial-arts',
      name: 'Artes Marciales',
      type: 'Melee',
      skill: 'Martial Arts',
      damage: martialDmg,
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

    // La tirada usa DEX + rango de la forma elegida (chip: max(3, natural)).
    const martialChar = { ...activeChar, skills: { ...activeChar.skills, martialArts: martialHandRank } };
    const entry = createInitialAttackRoll(martialChar, martialArtsWeapon, {
      ...(() => { const def = rollMeleeDefenseDv(); return { targetDv: def.dv, distanceLabel: `${'Cuerpo a cuerpo (Ignora 50% SP)'} ${def.label}` }; })(),
      luckSpent,
      weaponInstanceId: 'unarmed-martial-arts',
      aimedShotTarget
    }, aimedShotTarget, fumbleOpts);
    trackHit(entry, 'martial_arts', martialHandForm.id);
    addRollEntry(entry);
  };

  // Unarmed: Martial Arts damage
  const handleMartialArtsDamage = () => {
    if (!martialHandForm) return;
    ensureTelemetryExpanded();
    const dmgEntry = createDamageRoll('Artes Marciales (Ignora 50% SP)', martialDmg, false, 1, 'unarmed-martial-arts', aimedShotTarget);
    addOutgoingDamageEntry(dmgEntry);
  };

  // Attachment Secondary Attacks (Bayonet, Underbarrel Shotgun, Underbarrel Grenade Launcher)
  const handleAttachmentBayonetAttack = (parentWeapon: WeaponItem) => {
    ensureTelemetryExpanded();
    const bayonetWeapon: WeaponItem = {
      id: `bayonet-${parentWeapon.id}`,
      name: `🗡️ Bayoneta (${parentWeapon.name})`,
      type: 'Melee',
      skill: 'Melee Weapon',
      damage: '1d6',
      rof: 2,
      hands: parentWeapon.hands || 2,
      concealable: false,
      cost: 100
    };
    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }
    const entry = createInitialAttackRoll(activeChar, bayonetWeapon, {
      ...(() => { const def = rollMeleeDefenseDv(); return { targetDv: def.dv, distanceLabel: `${'Cuerpo a cuerpo (Melee)'} ${def.label}` }; })(),
      luckSpent,
      weaponInstanceId: `bayonet-${parentWeapon.id}`,
      aimedShotTarget
    }, aimedShotTarget, fumbleOpts);
    trackHit(entry, 'melee');
    addRollEntry(entry);
  };

  const handleAttachmentBayonetDamage = (parentWeapon: WeaponItem) => {
    ensureTelemetryExpanded();
    const dmgEntry = createDamageRoll(
      `🗡️ Bayoneta (${parentWeapon.name})`,
      '1d6',
      false,
      1,
      `bayonet-${parentWeapon.id}`,
      aimedShotTarget
    );
    addOutgoingDamageEntry(dmgEntry);
  };

  const handleAttachmentUnderbarrelSgAttack = (parentWeapon: WeaponItem) => {
    ensureTelemetryExpanded();
    const sgWeapon: WeaponItem = {
      id: `ubsg-${parentWeapon.id}`,
      name: `💥 Escopeta Acoplada (${parentWeapon.name})`,
      type: 'Ranged',
      skill: 'Shoulder Arms',
      damage: '3d6',
      rof: 1,
      hands: 2,
      concealable: false,
      cost: 500,
      standardMag: 2,
      ammoType: 'Shotgun Shell'
    };
    const currentDv = getDvForWeapon(sgWeapon, selectedDistance, false);
    if (currentDv === null) {
      alert(`El objetivo a ${selectedDistance} está fuera de alcance para la escopeta acoplada.`);
      return;
    }
    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }
    const entry = createInitialAttackRoll(activeChar, sgWeapon, {
      targetDv: currentDv,
      distanceLabel: selectedDistance,
      luckSpent,
      weaponInstanceId: `ubsg-${parentWeapon.id}`,
      aimedShotTarget
    }, aimedShotTarget, fumbleOpts);
    addRollEntry(entry);
  };

  const handleAttachmentUnderbarrelSgDamage = (parentWeapon: WeaponItem) => {
    ensureTelemetryExpanded();
    const dmgEntry = createDamageRoll(
      `💥 Escopeta Acoplada (${parentWeapon.name})`,
      '3d6',
      false,
      1,
      `ubsg-${parentWeapon.id}`,
      aimedShotTarget
    );
    addOutgoingDamageEntry(dmgEntry);
  };

  const handleAttachmentUnderbarrelGlAttack = (parentWeapon: WeaponItem) => {
    ensureTelemetryExpanded();
    const glWeapon: WeaponItem = {
      id: `ubgl-${parentWeapon.id}`,
      name: `💣 Lanzagranadas Acoplado (${parentWeapon.name})`,
      type: 'Ranged',
      skill: 'Heavy Weapons',
      damage: '6d6',
      rof: 1,
      hands: 2,
      concealable: false,
      cost: 500,
      standardMag: 1,
      ammoType: 'Grenade'
    };
    const currentDv = getDvForWeapon(glWeapon, selectedDistance, false);
    if (currentDv === null) {
      alert(`El objetivo a ${selectedDistance} está fuera de alcance para el lanzagranadas acoplado.`);
      return;
    }
    const luckSpent = luckToSpendOnNextRoll;
    if (luckSpent > 0) {
      spendLuck(luckSpent);
      setLuckToSpend(0);
    }
    const entry = createInitialAttackRoll(activeChar, glWeapon, {
      targetDv: currentDv,
      distanceLabel: selectedDistance,
      luckSpent,
      weaponInstanceId: `ubgl-${parentWeapon.id}`,
      aimedShotTarget
    }, aimedShotTarget, fumbleOpts);
    addRollEntry(entry);
  };

  const handleAttachmentUnderbarrelGlDamage = (parentWeapon: WeaponItem) => {
    ensureTelemetryExpanded();
    const dmgEntry = createDamageRoll(
      `💣 Lanzagranadas Acoplado (${parentWeapon.name})`,
      '6d6',
      false,
      1,
      `ubgl-${parentWeapon.id}`,
      aimedShotTarget
    );
    addOutgoingDamageEntry(dmgEntry);
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
    const isCritFail = d10 === 1 && !fumbleOpts;
    const targetDv = rollMeleeDefenseDv().dv;
    const totalBase = dex + rank + soloPrecision + luckSpent;
    const totalAttack = totalBase + d10;
    const margin = totalAttack - targetDv;
    const isHit = margin > 0;

    const penaltyBreakdown: string[] = [];
    if (soloPrecision > 0) {
      penaltyBreakdown.push(`[Combat Awareness] Precision Attack: +${soloPrecision}`);
    }

    const entry: RollEntry = {
      id: `roll-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'attack',
      weaponName: `🥋 ${form.name} (Ataque)`,
      damageFormula: `${martialDmg} (Ignora 50% SP)`,
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
    trackHit(entry, 'martial_arts', form.id);
    addRollEntry(entry);
  };

  // Cyberfists of Fury: Form Damage
  const handleCyberfistsFormDamage = (form: typeof MARTIAL_ARTS_FORMS[number]) => {
    ensureTelemetryExpanded();
    const dmgEntry = createDamageRoll(
      `${form.name} (Ignora 50% SP)`,
      martialDmg,
      false,
      1,
      `ma-${form.id}`,
      aimedShotTarget
    );
    addOutgoingDamageEntry(dmgEntry);
  };

  // Cyberfists of Fury: Special Move execution
  type MartialMoveT = typeof MARTIAL_ARTS_FORMS[number]['moves'][number];
  const getMoveRank = (form: typeof MARTIAL_ARTS_FORMS[number]) => {
    const natural = activeChar?.knownMartialArts?.[form.id] ?? (activeChar?.skills?.martialArts ?? 0);
    const chipped = (activeChar?.equippedMartialArtChips || []).includes(form.id);
    return chipped ? Math.max(3, natural) : natural;
  };
  const getMoveCheck = (form: typeof MARTIAL_ARTS_FORMS[number], move: MartialMoveT) => {
    const confirmedForMove: Record<string, boolean> = {};
    (move.req?.confirm ?? []).forEach((c) => { confirmedForMove[c] = !!moveConfirmed[`${move.id}::${c}`]; });
    return checkMoveRequirements(
      move,
      { stats: (activeChar?.stats ?? {}) as unknown as Record<string, number>, skills: activeChar?.skills, generalSkills: activeChar?.generalSkills },
      getMoveRank(form),
      turnLog,
      confirmedForMove
    );
  };
  const handleExecuteMartialMove = (form: typeof MARTIAL_ARTS_FORMS[number], move: MartialMoveT) => {
    if (!getMoveCheck(form, move).ok) return;
    ensureTelemetryExpanded();
    const headShot = !!moveHeadShot[move.id] && moveSupportsHeadShot(move);
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
    const isCritFail = d10 === 1 && !fumbleOpts;
    // Core p. 178: los movimientos sin DV se resuelven contra DEX + Evasion + 1d10 del defensor.
    const opposedDefense = move.isOpposed ? rollMeleeDefenseDv() : null;
    const totalBase = dex + rank + soloPrecision + luckSpent;
    // Decisión 43: la cabeza resta 8 al total (como Aimed Shot).
    const totalAttack = totalBase + d10 - (headShot ? 8 : 0);
    const moveRes = resolveMoveRoll(move, totalAttack, opposedDefense ? opposedDefense.dv : move.resolutionDv);
    const targetDv = moveRes.dv;
    const margin = totalAttack - targetDv;
    const isHit = moveRes.hit;

    const penaltyBreakdown: string[] = [];
    if (soloPrecision > 0) {
      penaltyBreakdown.push(`[Combat Awareness] Precision: +${soloPrecision}`);
    }
    if (headShot) {
      penaltyBreakdown.push('A la cabeza: -8 (como Aimed Shot, decisión 43)');
    }

    const entry: RollEntry = {
      id: `roll-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'attack',
      weaponName: `🥋 Combo: ${move.name} (${form.name})`,
      damageFormula: move.damageBonusOrFormula || (move.criticalInjuryApplied ? `Aplica ${move.criticalInjuryApplied}` : move.effectDescription),
      distanceLabel: `${opposedDefense ? `Enfrentada ${opposedDefense.label}` : `DV ${move.resolutionDv}`} · ${move.requirements}`,
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
    recordMove(move.id);
    setLastMoveRoll((prev) => ({ ...prev, [move.id]: { rollId: entry.id, headShot } }));
    addRollEntry(entry);
  };

  // Cyberfists of Fury: Special Move combo damage
  const handleRollComboDamage = (move: typeof MARTIAL_ARTS_FORMS[number]['moves'][number]) => {
    ensureTelemetryExpanded();
    const diceMatch = move.damageBonusOrFormula?.match(/(\d+d\d+)/i);
    // v4.9.6: si el movimiento trae un efecto de daño estructurado, usa su fórmula (y la alternativa si el usuario la marcó).
    const dmgEffect = move.effects?.find((e) => e.kind === 'damage');
    const effectFormula = dmgEffect && dmgEffect.kind === 'damage'
      ? (moveAltOn[move.id] && dmgEffect.alt ? dmgEffect.alt.formula : dmgEffect.formula)
      : null;
    const formula = effectFormula ?? (diceMatch ? diceMatch[1] : martialDmg);
    const dmgEntry = createDamageRoll(
      `Combo: ${move.name}`,
      formula,
      false,
      1,
      `move-${move.id}`,
      aimedShotTarget
    );
    addOutgoingDamageEntry(dmgEntry);
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
    // Core p. 146: el total gastado no puede superar el rango de Combat Awareness.
    if (!isValidSoloAllocation(updated, activeChar?.roleRank || 0)) return;
    updateSoloAllocation(updated);
  };

  // CEMK Canonical 4-Step Quickhacking Flow
  // Paso 1: Jack In (1 NET Action) vs Target WILL
  const handleJackInRoll = () => {
    ensureTelemetryExpanded();
    if (!trySpendNetAction()) return;
    const d10Hacker = Math.floor(Math.random() * 10) + 1;
    const hackerTotal = activeInterfaceRank + d10Hacker;
    const d10Target = Math.floor(Math.random() * 10) + 1;
    const targetWill = quickhackTargetWill;
    const targetTotal = targetWill + d10Target;
    // Empate gana el defensor (Core p. 129): el objetivo detecta la intrusión.
    const isDetected = hackerTotal <= targetTotal;

    const entry: RollEntry = {
      id: `roll-jackin-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'skill',
      weaponName: '🔌 Paso 1: Jack In (1 NET Action)',
      statName: 'INT',
      statVal: 0, // Interface no suma STAT (CEMK p. 16)
      skillName: 'Interface vs WILL',
      skillVal: activeInterfaceRank,
      d10: d10Hacker,
      totalAttack: hackerTotal,
      targetDv: targetTotal,
      margin: hackerTotal - targetTotal,
      isHit: true,
      critDie: null,
      needsExplosionClick: false,
      explosionType: null
    };
    addRollEntry(entry);
    const msg = isDetected
      ? `⚠️ Jack In exitoso pero DETECTADO (Tiraste ${hackerTotal} vs WILL ${targetTotal}). El objetivo sabe que estás dentro.`
      : `✅ Jack In SIGILOSO completado (Tiraste ${hackerTotal} vs WILL ${targetTotal}). El objetivo NO detectó tu intrusión.`;
    setQuickhackFeedback(msg);
    setTimeout(() => setQuickhackFeedback(null), 5000);
  };

  // Paso 2: Romper Passwall / Firewall base / Self-ICE (1 NET Action)
  const handleBreachPasswallRoll = (dv: number = 6, label: string = 'Firewall Base') => {
    ensureTelemetryExpanded();
    if (label.includes('Firewall') && activeInterfaceRank >= 3) {
      const msg = `⚡ Bypass automático de Firewall base (DV 6) por Interface R${activeInterfaceRank} (CEMK p. 27).`;
      setQuickhackFeedback(msg);
      setTimeout(() => setQuickhackFeedback(null), 5000);
      return;
    }
    if (!trySpendNetAction()) return;
    const d10 = Math.floor(Math.random() * 10) + 1;
    const total = activeInterfaceRank + d10;
    const isSuccess = beatsDv(total, dv);
    const entry: RollEntry = {
      id: `roll-breach-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'skill',
      weaponName: `🛡️ Paso 2: Romper ${label} (DV ${dv})`,
      statName: 'INT',
      statVal: 0, // Interface no suma STAT (CEMK p. 16)
      skillName: 'Interface (Breach Passwall)',
      skillVal: activeInterfaceRank,
      d10,
      totalAttack: total,
      targetDv: dv,
      margin: total - dv,
      isHit: isSuccess,
      critDie: null,
      needsExplosionClick: false,
      explosionType: null
    };
    addRollEntry(entry);
    const msg = isSuccess
      ? `✅ ¡Passwall superado! Tiraste ${total} vs DV ${dv}. Acceso libre para Quickhacks.`
      : `❌ Fallo al romper ${label}: Tiraste ${total} vs DV ${dv}.`;
    setQuickhackFeedback(msg);
    setTimeout(() => setQuickhackFeedback(null), 5000);
  };

  // Paso 3: Netrunner: Launch Quickhack 2077 (1 NET Action)
  const handleLaunchQuickhack = (qh: Quickhack2077) => {
    ensureTelemetryExpanded();
    if (!quickhacksAllowed) {
      setQuickhackFeedback('⛔ En 2045 los Quickhacks solo funcionan con Neuroport (CEMK RB p.26).');
      setTimeout(() => setQuickhackFeedback(null), 5000);
      return;
    }
    if (quickhackUsedThisTurn) {
      setQuickhackFeedback('⛔ Solo 1 Quickhack por objetivo por turno, aunque te queden NET Actions (CEMK p. 16). Pulsa "Nuevo turno" para seguir.');
      setTimeout(() => setQuickhackFeedback(null), 5000);
      return;
    }
    if (!trySpendNetAction()) return;
    setQuickhackUsedThisTurn(true);
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
    const isHit = margin > 0;

    const entry: RollEntry = {
      id: `roll-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'attack',
      weaponName: `⚡ Quickhack: ${qh.name} [1 NET Action]`,
      damageFormula: qh.damage || (qh.damageFormula ? `${qh.damageFormula} HP` : qh.effect),
      distanceLabel: `DV ${qh.dv} · Rango ${QUICKHACK_RANGE_BY_CONNECTION[quickhackConnection]} m`,
      d10,
      critDie: null,
      needsExplosionClick: isCritSuccess || isCritFail,
      explosionType: isCritSuccess ? 'crit_success' : isCritFail ? 'crit_fail' : null,
      statName: 'INT',
      statVal: 0, // Interface no suma STAT (CEMK p. 16)
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

    // Con 10 o 1 hay que resolver primero el segundo d10; el daño se tira luego con su botón.
    if (isHit && !entry.needsExplosionClick && (qh.damageFormula || qh.damage)) {
      handleQuickhackDamage(qh);
    }
  };

  // Netrunner: Quickhack damage
  const handleQuickhackDamage = (qh: Quickhack2077) => {
    ensureTelemetryExpanded();
    const diceMatch = qh.damage?.match(/(\d+d\d+)/i);
    const formula = diceMatch ? diceMatch[1] : (qh.damageFormula || '3d6');
    const dmgEntry = createDamageRoll(
      `Quickhack: ${qh.name}`,
      formula,
      false,
      1,
      `qh-${qh.id}`,
      aimedShotTarget
    );
    // CEMK RB p.12: los Quickhacks nunca generan Heridas Críticas (tampoco el +5 de daño).
    if (dmgEntry.isCriticalInjuryTrigger) {
      dmgEntry.isCriticalInjuryTrigger = false;
      dmgEntry.critBonusDamage = 0;
      dmgEntry.finalDamageTotal = dmgEntry.baseDamageTotal;
      dmgEntry.damageFormula = `${dmgEntry.damageFormula} · sin Herida Crítica (CEMK RB p.12)`;
    }
    addRollEntry(dmgEntry);
  };

  // Paso 4: Contramedida de Expulsión (Boot Out) por el Objetivo
  const handleBootOutRoll = () => {
    ensureTelemetryExpanded();
    const d10Target = Math.floor(Math.random() * 10) + 1;
    const targetScore = quickhackTargetWill + quickhackTargetConcentration + d10Target;
    const d10Hacker = Math.floor(Math.random() * 10) + 1;
    const hackerScore = activeInterfaceRank + d10Hacker;
    const expelled = targetScore > hackerScore;

    const entry: RollEntry = {
      id: `roll-bootout-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type: 'skill',
      weaponName: '👢 Paso 4: Contramedida de Expulsión (Boot Out)',
      statName: 'WILL',
      statVal: quickhackTargetWill,
      skillName: 'Concentration vs Interface',
      skillVal: quickhackTargetConcentration,
      d10: d10Target,
      totalAttack: targetScore,
      targetDv: hackerScore,
      margin: targetScore - hackerScore,
      isHit: expelled,
      critDie: null,
      needsExplosionClick: false,
      explosionType: null
    };
    addRollEntry(entry);
    const msg = expelled
      ? `🚫 ¡Hacker EXPULSADO! El objetivo sacó ${targetScore} vs tu Interface ${hackerScore}. No puedes reconectarte en 60 minutos.`
      : `🛡️ Intento de expulsión FALLIDO. El objetivo sacó ${targetScore} vs tu Interface ${hackerScore}. Sigues conectado.`;
    setQuickhackFeedback(msg);
    setTimeout(() => setQuickhackFeedback(null), 5000);
  };

  // Throw grenade action
  const handleThrowGrenade = (grenade: typeof TACTICAL_GRENADES[number]) => {
    ensureTelemetryExpanded();
    const throwDv = getThrownGrenadeDv(selectedDistance);
    if (throwDv === null) {
      alert(`No puedes lanzar una granada a ${selectedDistance}: el máximo es 25 m (Core p. 177).`);
      return false;
    }
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
    const targetDv = throwDv;
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
    return true;
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
    if (handleThrowGrenade(grenadeInfo)) updateInventoryQuantity(invItem.id, -1);
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
      const healAmount = speedhealAmount(effectiveBody, activeChar?.stats?.WILL ?? 6, activeChar?.currentHp ?? 0, Boolean(activeChar?.fbcState?.isFullBodyConversion));
      if (healAmount > 0) adjustHp(healAmount);
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
    const isHit = margin > 0;

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


  const getLeftColumnClass = () => {
    if (leftColumnSpan === 5) return 'xl:col-span-5';
    if (leftColumnSpan === 4) return 'xl:col-span-4';
    return 'xl:col-span-3';
  };

  const getCenterColumnClass = () => {
    if (isRightTrayCollapsed) {
      if (leftColumnSpan === 5) return 'xl:col-span-6';
      if (leftColumnSpan === 4) return 'xl:col-span-7';
      return 'xl:col-span-8';
    } else {
      if (leftColumnSpan === 5) return 'xl:col-span-4';
      if (leftColumnSpan === 4) return 'xl:col-span-5';
      return 'xl:col-span-6';
    }
  };

  const getLeftPanelStyle = (panelId: LeftPanelId, isAutoFullTriggered = false): React.CSSProperties | undefined => {
    const mode = leftPanelSizeMode[panelId] || (isAutoFullTriggered ? 'auto_full' : 'normal');
    if (mode === 'custom') {
      const h = leftPanelCustomHeight[panelId] || 280;
      return { maxHeight: `${h}px`, overflowY: 'auto' };
    }
    return undefined;
  };

  const getLeftPanelClass = (panelId: LeftPanelId, isAutoFullTriggered = false): string => {
    const mode = leftPanelSizeMode[panelId] || (isAutoFullTriggered ? 'auto_full' : 'normal');
    if (mode === 'compact') return 'max-h-[160px] overflow-y-auto pr-1';
    if (mode === 'normal') return 'max-h-[280px] overflow-y-auto pr-1';
    if (mode === 'large') return 'max-h-[480px] overflow-y-auto pr-1';
    if (mode === 'auto_full') return 'max-h-none overflow-visible';
    return 'pr-1';
  };

  const renderLeftPanelHeaderControls = (
    panelId: LeftPanelId,
    isAutoFullTriggered = false,
    autoCount = 0
  ) => {
    const activeMode = leftPanelSizeMode[panelId] || (isAutoFullTriggered ? 'auto_full' : 'normal');
    return (
      <div className="flex items-center justify-between w-full gap-1.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] font-mono-code text-slate-400 uppercase tracking-wider">Espacio:</span>
          {isAutoFullTriggered && (
            <span className="text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 animate-pulse">
              🔓 Auto ({autoCount})
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5 bg-[#141722] p-0.5 rounded border border-[#22283a]">
          <button
            type="button"
            onClick={() => setLeftPanelMode(panelId, 'compact')}
            className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
              activeMode === 'compact' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Compacto (160px)"
          >
            S
          </button>
          <button
            type="button"
            onClick={() => setLeftPanelMode(panelId, 'normal')}
            className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
              activeMode === 'normal' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Normal (280px)"
          >
            M
          </button>
          <button
            type="button"
            onClick={() => setLeftPanelMode(panelId, 'large')}
            className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
              activeMode === 'large' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Grande (480px)"
          >
            L
          </button>
          <button
            type="button"
            onClick={() => setLeftPanelMode(panelId, 'auto_full')}
            className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
              activeMode === 'auto_full' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Todo (sin límite)"
          >
            ↕ Todo
          </button>
          <button
            type="button"
            onClick={() => adjustLeftPanelHeight(panelId, -40)}
            className="px-1.5 py-0.5 text-[9px] font-mono-code text-slate-400 hover:text-white hover:bg-[#252c3e] rounded transition-colors cursor-pointer"
            title="Reducir altura (-40px)"
          >
            -
          </button>
          <button
            type="button"
            onClick={() => adjustLeftPanelHeight(panelId, 40)}
            className="px-1.5 py-0.5 text-[9px] font-mono-code text-slate-400 hover:text-white hover:bg-[#252c3e] rounded transition-colors cursor-pointer"
            title="Aumentar altura (+40px)"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  const renderLeftPanelResizeHandle = (panelId: LeftPanelId) => (
    <div
      onMouseDown={(e) => handleLeftPanelResizeMouseDown(e, panelId)}
      className="w-full py-0.5 mt-2 flex items-center justify-center cursor-row-resize bg-[#141620] hover:bg-cyan-950/60 border-t border-[#232738] text-[9px] text-slate-500 hover:text-cyan-400 font-mono-code select-none transition-colors group"
      title="Arrastrar verticalmente para ajustar la altura del panel"
    >
      <span className="opacity-60 group-hover:opacity-100 flex items-center gap-1">
        ────── 📏 Redimensionar ──────
      </span>
    </div>
  );

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
            headerRight={
              isSeriouslyWounded ? (
                <span className="bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#dc2626] font-mono-code text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3" /> GRAVE (-2)
                </span>
              ) : null
            }
            subHeaderControls={renderLeftPanelHeaderControls('vitals', false, 0)}
          >
            <div className={getLeftPanelClass('vitals')} style={getLeftPanelStyle('vitals')}>
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

                  {/* Core pp. 186, 188: Mortally Wounded y Death Saves */}
                  {(isMortallyWounded || activeChar?.isDead) && (() => {
                    const baseDsPenalty = activeChar ? getBaseDeathSavePenalty(activeChar) : 0;
                    const accDsPenalty = activeChar?.deathSavePenalty ?? 0;
                    return (
                      <div className="mt-2.5 pt-2 border-t border-[#dc2626]/40 text-[11px] font-mono-code space-y-1.5">
                        {activeChar?.isDead ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[#dc2626] font-bold flex items-center gap-1"><Skull className="w-3.5 h-3.5" /> MUERTO (falló un Death Save)</span>
                            <button
                              onClick={() => { setDead(false); setLastDeathSave(null); }}
                              className="px-2 py-0.5 bg-[#1a1d28] border border-[#2b3042] text-[#94a3b8] hover:text-white rounded-xs text-[10px]"
                            >
                              Deshacer
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="text-[#dc2626] font-bold">MORTALMENTE HERIDO: -4 a todas las Acciones, -6 MOVE (mín. 1)</div>
                            <div className="text-[#94a3b8] text-[10px] leading-tight">
                              Al inicio de cada Turno tira 1d10 + penalizador: vives si sacas menos que tu BODY ({effectiveBody}). Un 10 siempre falla. Penalizador: base {baseDsPenalty} + acumulado {accDsPenalty}. Stabilization DV 15 lo devuelve a 1 HP.
                            </div>
                            <button
                              onClick={() => { const r = rollDeathSave(); if (r) setLastDeathSave(r); }}
                              className="w-full px-2 py-1 bg-[#dc2626]/20 hover:bg-[#dc2626] border border-[#dc2626]/60 text-white rounded-xs font-bold transition-all active:scale-95"
                            >
                              Tirar Death Save
                            </button>
                          </>
                        )}
                        {lastDeathSave && (
                          <div className={`text-[10px] ${lastDeathSave.success ? 'text-[#10b981]' : 'text-[#dc2626]'}`}>
                            d10 {lastDeathSave.d10} + {lastDeathSave.basePenalty + lastDeathSave.accumulatedPenalty} = {lastDeathSave.total} vs BODY {lastDeathSave.deathSaveValue}: {lastDeathSave.success ? 'SOBREVIVE' : lastDeathSave.autoFail ? 'FALLA (10 natural)' : 'FALLA'}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Mini Descanso y Curación Canónica */}
                {(() => {
                  const currentEb = activeChar?.eurodollars ?? 0;
                  const currentHp = activeChar?.currentHp ?? 0;
                  const effWill = activeChar?.stats?.WILL ?? 6;
                  const maxHp = calculateMaxHp(effectiveBody, effWill);
                  const hasEnhancedAntibodies = Boolean(
                    activeChar?.installedCyberwareIds?.includes('enhanced-antibodies') ||
                    activeChar?.installedCyberwareIds?.includes('cw-enhanced-antibodies')
                  );

                  const handleBuyAntibodiesHud = () => {
                    if (hasEnhancedAntibodies) return;
                    if (currentEb < 500) {
                      setCombatRestFeedback('Fondos insuficientes (requiere 500 €$).');
                      setTimeout(() => setCombatRestFeedback(null), 3000);
                      return;
                    }
                    const res = installCyberwareAdvanced({
                      cyberwareId: 'enhanced-antibodies',
                      cyberwareName: 'Enhanced Antibodies',
                      humanityLossAmount: 2,
                      cost: 500,
                      spendMoney: true
                    });
                    if (res && !res.success) {
                      setCombatRestFeedback(res.message || 'Error al instalar.');
                    } else {
                      setCombatRestAntibodies(true);
                      setCombatRestFeedback('¡Enhanced Antibodies instalado (-500 €$, -2 HL)!');
                    }
                    setTimeout(() => setCombatRestFeedback(null), 4000);
                  };

                  const handlePayHospitalCryoHud = () => {
                    if (currentEb < 100) {
                      setCombatRestFeedback('Fondos insuficientes: 100 €$ para Cryotank hospitalario.');
                      setTimeout(() => setCombatRestFeedback(null), 3000);
                      return;
                    }
                    updateCharacterMeta({ eurodollars: currentEb - 100 });
                    const healAmount = naturalHealingPerDay(effectiveBody, hasEnhancedAntibodies || combatRestAntibodies, true);
                    const newHp = Math.min(maxHp, currentHp + healAmount);
                    setHp(newHp);
                    setCombatRestFeedback(`Cryotank Hospital (-100 €$): +${healAmount} HP recuperados.`);
                    setTimeout(() => setCombatRestFeedback(null), 4000);
                  };

                  const handlePayMedtechChemHud = () => {
                    if (currentEb < 50) {
                      setCombatRestFeedback('Fondos insuficientes: 50 €$ recarga química.');
                      setTimeout(() => setCombatRestFeedback(null), 3000);
                      return;
                    }
                    updateCharacterMeta({ eurodollars: currentEb - 50 });
                    const healAmount = naturalHealingPerDay(effectiveBody, hasEnhancedAntibodies || combatRestAntibodies, true);
                    const newHp = Math.min(maxHp, currentHp + healAmount);
                    setHp(newHp);
                    setCombatRestFeedback(`Recarga Cryo Medtech (-50 €$): +${healAmount} HP recuperados.`);
                    setTimeout(() => setCombatRestFeedback(null), 4000);
                  };

                  const handleInjectSpeedhealHud = () => {
                    const isFbcChar = Boolean(activeChar?.fbcState?.isFullBodyConversion);
                    const healAmount = speedhealAmount(effectiveBody, effWill, currentHp, isFbcChar);
                    if (healAmount === 0) {
                      setCombatRestFeedback(isFbcChar ? 'Speedheal no funciona en un FBC' : 'Speedheal no funciona en Mortally Wounded (Core p. 150).');
                      setTimeout(() => setCombatRestFeedback(null), 3000);
                      return;
                    }
                    if (currentHp >= maxHp) {
                      setCombatRestFeedback('HP ya al máximo.');
                      setTimeout(() => setCombatRestFeedback(null), 3000);
                      return;
                    }
                    const newHp = Math.min(maxHp, currentHp + healAmount);
                    setHp(newHp);
                    setCombatRestFeedback(`Speedheal inyectado: +${healAmount} HP (Máx 1 dosis/24h).`);
                    setTimeout(() => setCombatRestFeedback(null), 4000);
                  };

                  const totalGain = naturalHealingPerDay(effectiveBody, combatRestAntibodies || hasEnhancedAntibodies, combatRestCryotank) * combatRestDays;

                  return (
                    <div className="mt-2.5 bg-[#141824] p-2.5 rounded-sm border border-[#232a3d] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-tech text-[11px] font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-red-400" /> DESCANSO Y ASISTENCIA MÉDICA (CANON CORE p. 222)
                        </span>
                        <div className="text-[10px] font-mono-code text-slate-400 flex items-center gap-1.5">
                          <span>BODY: <strong className="text-white">{effectiveBody}</strong></span>
                          <span>•</span>
                          <span className="text-[#10b981] font-bold">€$: {currentEb}</span>
                        </div>
                      </div>

                      <div className="text-[9px] font-mono-code text-slate-300 bg-[#0d0f17] p-1.5 rounded border border-[#1e2335] leading-relaxed">
                        <strong className="text-amber-400">Estabilización obligatoria:</strong> Requiere First Aid/Paramedic (DV 10/13/15). Actividad extenuante durante las 24h anula toda la curación (0 HP).
                      </div>

                      {/* Acciones Médicas Rápidas */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[9px] font-mono-code">
                        {hasEnhancedAntibodies ? (
                          <div className="p-1 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 rounded text-center font-bold flex items-center justify-center">
                            🧬 Antibodies (2×)
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleBuyAntibodiesHud}
                            className="p-1 bg-[#1a2234] hover:bg-emerald-600 hover:text-black text-emerald-300 border border-emerald-500/30 rounded text-center font-bold cursor-pointer transition-all"
                            title="Comprar e instalar Enhanced Antibodies (500 €$ • 2 HL)"
                          >
                            + Antibodies (500€$)
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handlePayHospitalCryoHud}
                          className="p-1 bg-[#1a2234] hover:bg-cyan-600 hover:text-black text-cyan-300 border border-cyan-500/30 rounded text-center font-bold cursor-pointer transition-all"
                          title="Pagar 1 día de internación en Cryotank Hospitalario (100 €$)"
                        >
                          🧊 Hosp Cryo (100€$)
                        </button>

                        <button
                          type="button"
                          onClick={handlePayMedtechChemHud}
                          className="p-1 bg-[#1a2234] hover:bg-emerald-600 hover:text-black text-emerald-300 border border-emerald-500/30 rounded text-center font-bold cursor-pointer transition-all"
                          title="Pagar 50 €$ de recarga química en Cryotank de Medtech aliado"
                        >
                          🧪 Cryo Chem (50€$)
                        </button>

                        <button
                          type="button"
                          onClick={handleInjectSpeedhealHud}
                          className="p-1 bg-purple-950/80 hover:bg-purple-600 hover:text-white text-purple-300 border border-purple-500/40 rounded text-center font-bold cursor-pointer transition-all"
                          title={`Inyectar Speedheal (+${effectiveBody + effWill} HP instantáneos)`}
                        >
                          💉 Speedheal (+{effectiveBody + effWill})
                        </button>
                      </div>

                      {/* Selector de días de reposo */}
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono-code">
                        <div className="flex items-center gap-1 bg-[#0f1118] p-1 rounded border border-[#1e2335]">
                          <span className="text-slate-400">Días:</span>
                          {[1, 3, 7].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setCombatRestDays(d)}
                              className={`flex-1 py-0.5 rounded font-bold cursor-pointer transition-all ${
                                combatRestDays === d ? 'bg-cyan-500 text-black' : 'bg-[#181d2a] text-slate-400 hover:text-white'
                              }`}
                            >
                              {d}d
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setCombatRestAntibodies(!combatRestAntibodies)}
                          className={`p-1 rounded text-center border font-bold cursor-pointer transition-all ${
                            combatRestAntibodies || hasEnhancedAntibodies ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-[#0f1118] text-slate-400 border-[#1e2335]'
                          }`}
                          title="Enhanced Antibodies duplica la tasa (2× BODY)"
                        >
                          Antibodies: {combatRestAntibodies || hasEnhancedAntibodies ? '2×' : '1×'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setCombatRestCryotank(!combatRestCryotank)}
                          className={`p-1 rounded text-center border font-bold cursor-pointer transition-all ${
                            combatRestCryotank ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-[#0f1118] text-slate-400 border-[#1e2335]'
                          }`}
                          title="Cryotank: dobla la curación por día; el paciente está inconsciente y tras cobertura de 30 HP (Core p. 353)"
                        >
                          Cryo: {combatRestCryotank ? 'x2' : 'OFF'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#1e2335]">
                        <span className="text-[10px] font-mono-code text-emerald-400">
                          Recupera: +{totalGain} HP ({combatRestDays}d)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (currentHp <= 0) {
                              setCombatRestFeedback('Mortally Wounded: estabiliza (DV 15) antes de descansar (Core p. 222).');
                            } else {
                              restAndHealDays(combatRestDays, combatRestAntibodies || hasEnhancedAntibodies, combatRestCryotank);
                              setCombatRestFeedback(`+${totalGain} HP recuperados tras ${combatRestDays} día(s).`);
                            }
                            setTimeout(() => setCombatRestFeedback(null), 4000);
                          }}
                          className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-tech text-xs font-bold uppercase transition-all cursor-pointer"
                        >
                          🛌 Descansar
                        </button>
                      </div>
                      {combatRestFeedback && (
                        <div className="text-[10px] font-mono-code text-emerald-300 bg-emerald-950/60 p-1 rounded border border-emerald-500/40">
                          ✓ {combatRestFeedback}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
            {renderLeftPanelResizeHandle('vitals')}

          </CollapsibleHudCard>
        );

      case 'armor':
        return (
          <CollapsibleHudCard
            key="armor"
            id="armor"
            title="MATRIZ DE BLINDAJE & IMPACTOS"
            icon={<Shield className="w-4 h-4 text-[#38bdf8]" />}
            summary={`Cab: ${activeChar?.headArmor?.currentSp ?? 0}/${activeChar?.headArmor?.maxSp ?? 0} | Tor: ${activeChar?.bodyArmor?.currentSp ?? 0}/${activeChar?.bodyArmor?.maxSp ?? 0} SP${shieldCover.active ? ` | Esc: ${shieldCover.currentSdp}/${shieldCover.maxSdp} SDP` : ''}`}
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
            subHeaderControls={renderLeftPanelHeaderControls('armor', false, 0)}
          >
            <div className={getLeftPanelClass('armor')} style={getLeftPanelStyle('armor')}>
              <div className="space-y-3">
                {/* BLINDAJE CORPORAL Y CABEZA (SP PLATES INTERACTIVAS) */}
                <div className="grid grid-cols-1 gap-2.5 mb-1">
                  {/* CABEZA */}
                  <div className="bg-[#171923] p-2.5 rounded-sm border border-[#222636]">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <span className="text-[9px] font-mono-code text-[#64748b] block uppercase">CABEZA</span>
                        <span className="font-tech text-xs font-bold text-white block truncate max-w-[120px]">
                          {activeChar?.headArmor?.name || 'Head'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="font-tech text-xl font-bold text-[#38bdf8] leading-none">
                            {activeChar?.headArmor?.currentSp ?? 0}
                          </span>
                          <span className="text-[9px] text-[#64748b] block font-mono-code">
                            /{activeChar?.headArmor?.maxSp ?? 0} <TacticalTooltip term="SP">SP</TacticalTooltip>
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => ablateArmor('head', 1)}
                            className="py-0.5 px-1.5 bg-[#dc2626]/20 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/40 rounded-xs font-mono-code text-[10px] font-bold transition-all text-center cursor-pointer"
                            title="Ablacionar 1 SP"
                          >
                            -1 SP
                          </button>
                          <button
                            type="button"
                            onClick={() => repairArmor('head')}
                            className="py-0.5 px-1.5 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#2c3246] rounded-xs font-mono-code text-[10px] font-bold transition-all text-center cursor-pointer"
                            title="Reparar SP al máximo"
                          >
                            Reparar
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Visual Plate Badges Grid for Head SP */}
                    <div className="pt-2 border-t border-[#1f2332]">
                      <div className="text-[9px] font-mono-code text-slate-400 mb-1 flex items-center justify-between">
                        <span>Placas de Blindaje (Click para fijar SP):</span>
                        <span>{activeChar?.headArmor?.currentSp ?? 0} / {activeChar?.headArmor?.maxSp ?? 0}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: Math.min(20, Math.max(activeChar?.headArmor?.maxSp ?? 0, activeChar?.headArmor?.currentSp ?? 0, 1)) }).map((_, i) => {
                          const isIntact = i < (activeChar?.headArmor?.currentSp ?? 0);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setArmorSp('head', i + 1)}
                              className={`w-6 h-6 rounded-xs text-[10px] font-mono-code font-bold flex items-center justify-center transition-all cursor-pointer border ${
                                isIntact
                                  ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 hover:bg-cyan-900 shadow-xs'
                                  : 'bg-[#181116] border-[#381a24] text-red-500/70 hover:bg-red-950/50'
                              }`}
                              title={`Fijar SP de Cabeza en ${i + 1} (${isIntact ? 'Intacta 🛡️' : 'Ablacionada 💥'})`}
                            >
                              {isIntact ? '🛡️' : '💥'}
                            </button>
                          );
                        })}
                      </div>

                      {/* Mejora Tech Maker +1 SP Cabeza */}
                      <div className="mt-2 pt-1.5 border-t border-[#1e2333] flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Mejora Tech:</span>
                        <button
                          type="button"
                          onClick={() => applyTechUpgradeToArmor('head', !activeChar?.headArmor?.techUpgradedSp, 0)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                            activeChar?.headArmor?.techUpgradedSp
                              ? 'bg-amber-500 text-black border-amber-400'
                              : 'bg-[#121622] text-amber-300 border-amber-500/40 hover:bg-[#1a2030]'
                          }`}
                          title="Mejora Tech Maker: +1 SP Máximo (Upgrade Expertise)"
                        >
                          {activeChar?.headArmor?.techUpgradedSp ? '🛠️ +1 SP ACTIVO' : '🛠️ +1 SP Tech'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* TORSO */}
                  <div className="bg-[#171923] p-2.5 rounded-sm border border-[#222636]">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <span className="text-[9px] font-mono-code text-[#64748b] block uppercase">TORSO</span>
                        <span className="font-tech text-xs font-bold text-white block truncate max-w-[120px]">
                          {activeChar?.bodyArmor?.name || 'Body'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="font-tech text-xl font-bold text-[#38bdf8] leading-none">
                            {activeChar?.bodyArmor?.currentSp ?? 0}
                          </span>
                          <span className="text-[9px] text-[#64748b] block font-mono-code">
                            /{activeChar?.bodyArmor?.maxSp ?? 0} <TacticalTooltip term="SP">SP</TacticalTooltip>
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => ablateArmor('body', 1)}
                            className="py-0.5 px-1.5 bg-[#dc2626]/20 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/40 rounded-xs font-mono-code text-[10px] font-bold transition-all text-center cursor-pointer"
                            title="Ablacionar 1 SP"
                          >
                            -1 SP
                          </button>
                          <button
                            type="button"
                            onClick={() => repairArmor('body')}
                            className="py-0.5 px-1.5 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#2c3246] rounded-xs font-mono-code text-[10px] font-bold transition-all text-center cursor-pointer"
                            title="Reparar SP al máximo"
                          >
                            Reparar
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Visual Plate Badges Grid for Torso SP */}
                    <div className="pt-2 border-t border-[#1f2332]">
                      <div className="text-[9px] font-mono-code text-slate-400 mb-1 flex items-center justify-between">
                        <span>Placas de Blindaje (Click para fijar SP):</span>
                        <span>{activeChar?.bodyArmor?.currentSp ?? 0} / {activeChar?.bodyArmor?.maxSp ?? 0}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: Math.min(20, Math.max(activeChar?.bodyArmor?.maxSp ?? 0, activeChar?.bodyArmor?.currentSp ?? 0, 1)) }).map((_, i) => {
                          const isIntact = i < (activeChar?.bodyArmor?.currentSp ?? 0);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setArmorSp('body', i + 1)}
                              className={`w-6 h-6 rounded-xs text-[10px] font-mono-code font-bold flex items-center justify-center transition-all cursor-pointer border ${
                                isIntact
                                  ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 hover:bg-cyan-900 shadow-xs'
                                  : 'bg-[#181116] border-[#381a24] text-red-500/70 hover:bg-red-950/50'
                              }`}
                              title={`Fijar SP de Torso en ${i + 1} (${isIntact ? 'Intacta 🛡️' : 'Ablacionada 💥'})`}
                            >
                              {isIntact ? '🛡️' : '💥'}
                            </button>
                          );
                        })}
                      </div>

                      {/* Mejora Tech Maker +1 SP Torso */}
                      <div className="mt-2 pt-1.5 border-t border-[#1e2333] flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Mejora Tech:</span>
                        <button
                          type="button"
                          onClick={() => applyTechUpgradeToArmor('body', !activeChar?.bodyArmor?.techUpgradedSp, 0)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                            activeChar?.bodyArmor?.techUpgradedSp
                              ? 'bg-amber-500 text-black border-amber-400'
                              : 'bg-[#121622] text-amber-300 border-amber-500/40 hover:bg-[#1a2030]'
                          }`}
                          title="Mejora Tech Maker: +1 SP Máximo (Upgrade Expertise)"
                        >
                          {activeChar?.bodyArmor?.techUpgradedSp ? '🛠️ +1 SP ACTIVO' : '🛠️ +1 SP Tech'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ESCUDO / COBERTURA SDP TRACKER */}
                <div className="bg-[#141724] p-3 rounded-sm border border-[#252c42] mb-1 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🔰</span>
                      <div>
                        <span className="font-tech text-xs font-bold text-white block uppercase">
                          {shieldCover.name}
                        </span>
                        <span className="text-[9px] font-mono-code text-slate-400">
                          {shieldCover.active ? 'COBERTURA EQUIPADA / ACTIVA' : 'INACTIVO / GUARDADO'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <span className={`font-tech text-lg font-bold leading-none ${shieldCover.currentSdp > 0 ? 'text-amber-400' : 'text-red-500'}`}>
                          {shieldCover.currentSdp}
                        </span>
                        <span className="text-[9px] text-[#64748b] block font-mono-code">
                          /{shieldCover.maxSdp} SDP
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateShieldCover({ active: !shieldCover.active })}
                        className={`px-2 py-0.5 text-[10px] font-mono-code rounded font-bold transition-all border cursor-pointer ${
                          shieldCover.active
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-[#1e2334] text-slate-400 border-[#2f3852]'
                        }`}
                      >
                        {shieldCover.active ? 'ACTIVO' : 'ACTIVAR'}
                      </button>
                    </div>
                  </div>

                  {/* Presets de Escudos / Coberturas */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => equipShieldPreset('bulletproof_shield')}
                      className={`px-2 py-1 rounded-xs font-mono-code text-[9px] font-bold transition-all border cursor-pointer ${
                        shieldCover.type === 'bulletproof_shield'
                          ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                          : 'bg-[#1b2030] text-slate-300 border-[#2b354e] hover:bg-[#252d44]'
                      }`}
                    >
                      🛡️ Escudo Antibalas (10)
                    </button>
                    <button
                      type="button"
                      onClick={() => equipShieldPreset('wood_cover')}
                      className={`px-2 py-1 rounded-xs font-mono-code text-[9px] font-bold transition-all border cursor-pointer ${
                        shieldCover.type === 'wood_cover'
                          ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                          : 'bg-[#1b2030] text-slate-300 border-[#2b354e] hover:bg-[#252d44]'
                      }`}
                    >
                      🚪 Madera (15)
                    </button>
                    <button
                      type="button"
                      onClick={() => equipShieldPreset('metal_cover')}
                      className={`px-2 py-1 rounded-xs font-mono-code text-[9px] font-bold transition-all border cursor-pointer ${
                        shieldCover.type === 'metal_cover'
                          ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                          : 'bg-[#1b2030] text-slate-300 border-[#2b354e] hover:bg-[#252d44]'
                      }`}
                    >
                      🚗 Metal (25)
                    </button>
                    <button
                      type="button"
                      onClick={() => equipShieldPreset('steel_cover')}
                      className={`px-2 py-1 rounded-xs font-mono-code text-[9px] font-bold transition-all border cursor-pointer ${
                        shieldCover.type === 'steel_cover'
                          ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                          : 'bg-[#1b2030] text-slate-300 border-[#2b354e] hover:bg-[#252d44]'
                      }`}
                    >
                      🧱 Acero (35)
                    </button>
                  </div>

                  {/* Visual Plate Badges Grid for Shield SDP */}
                  <div className="pt-2 border-t border-[#1f2538]">
                    <div className="flex items-center justify-between text-[9px] font-mono-code text-slate-400 mb-1">
                      <span>Integridad SDP (Click para fijar SDP):</span>
                      <button
                        type="button"
                        onClick={repairShield}
                        className="text-emerald-400 hover:underline cursor-pointer"
                      >
                        Reparar SDP
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: Math.min(35, shieldCover.maxSdp) }).map((_, i) => {
                        const isIntact = i < shieldCover.currentSdp;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setShieldSdp(i + 1)}
                            className={`w-5 h-5 rounded-xs text-[9px] font-mono-code font-bold flex items-center justify-center transition-all cursor-pointer border ${
                              isIntact
                                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900'
                                : 'bg-[#191114] border-[#381a24] text-red-500/70 hover:bg-red-950/40'
                            }`}
                            title={`Fijar SDP en ${i + 1} (${isIntact ? 'Intacto 🔰' : 'Destruido 💥'})`}
                          >
                            {isIntact ? '🔰' : '💥'}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#1e2538] text-xs font-mono-code">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setShieldSdp(shieldCover.currentSdp - 5)}
                          className="px-2 py-0.5 bg-[#1e2334] hover:bg-red-600 hover:text-white border border-[#2b334a] rounded-xs font-bold text-slate-300 text-[10px]"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => setShieldSdp(shieldCover.currentSdp - 1)}
                          className="px-2 py-0.5 bg-[#1e2334] hover:bg-red-600 hover:text-white border border-[#2b334a] rounded-xs font-bold text-slate-300 text-[10px]"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => setShieldSdp(shieldCover.currentSdp + 1)}
                          className="px-2 py-0.5 bg-[#1e2334] hover:bg-emerald-600 hover:text-white border border-[#2b334a] rounded-xs font-bold text-slate-300 text-[10px]"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => setShieldSdp(shieldCover.currentSdp + 5)}
                          className="px-2 py-0.5 bg-[#1e2334] hover:bg-emerald-600 hover:text-white border border-[#2b334a] rounded-xs font-bold text-slate-300 text-[10px]"
                        >
                          +5
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={repairShield}
                        className="px-2 py-0.5 bg-[#1a231f] hover:bg-emerald-600 hover:text-white border border-emerald-600/40 text-emerald-300 rounded-xs text-[10px] font-bold"
                      >
                        Max SDP
                      </button>
                    </div>
                  </div>
                </div>

                {/* CALCULADORA TÁCTICA INTERACTIVA DE DAÑO, SP Y SDP */}
                <div className="bg-[#121520] p-3 rounded-sm border border-[#262c40] mb-1 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#20273a] pb-2">
                    <span className="font-tech text-xs font-bold text-white uppercase flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#f59e0b]" /> CALCULADORA TÁCTICA DE IMPACTOS
                    </span>
                    {damageFeedback && (
                      <span className="text-[10px] font-mono-code text-[#10b981] font-bold animate-fade-in">
                        {damageFeedback}
                      </span>
                    )}
                  </div>

                  {/* Fila 1: Daño base con input numérico y ajuste fino */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 mb-1">
                      <span>Daño Bruto Entrante:</span>
                      <span className="text-white font-bold">{incomingDamageInput} pts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIncomingDamageInput(Math.max(0, incomingDamageInput - 1))}
                        className="w-8 h-8 bg-[#181d2a] hover:bg-[#dc2626] text-white border border-[#283248] rounded flex items-center justify-center font-mono-code font-bold text-xs transition-colors cursor-pointer"
                        title="Restar 1 punto de daño"
                      >
                        -1
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={incomingDamageInput}
                        onChange={(e) => setIncomingDamageInput(Math.max(0, Math.min(200, parseInt(e.target.value) || 0)))}
                        className="flex-1 bg-[#0a0c12] border border-[#2e374f] text-cyan-300 font-mono-code font-bold text-center py-1.5 rounded text-sm focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setIncomingDamageInput(Math.min(200, incomingDamageInput + 1))}
                        className="w-8 h-8 bg-[#181d2a] hover:bg-[#10b981] text-white border border-[#283248] rounded flex items-center justify-center font-mono-code font-bold text-xs transition-colors cursor-pointer"
                        title="Sumar 1 punto de daño"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  {/* Fila 2: Localización del Blanco */}
                  <div>
                    <div className="text-[10px] font-mono-code text-slate-400 mb-1">Localización del Blanco:</div>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        onClick={() => setCalcLocation('shield')}
                        className={`py-1 rounded-xs text-[10px] font-tech font-bold uppercase transition-all cursor-pointer border ${
                          calcLocation === 'shield'
                            ? 'bg-amber-500 text-black border-amber-400'
                            : 'bg-[#181d2a] text-slate-300 border-[#283248] hover:bg-[#22293b]'
                        }`}
                      >
                        🛡️ Escudo / Cob
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcLocation('body')}
                        className={`py-1 rounded-xs text-[10px] font-tech font-bold uppercase transition-all cursor-pointer border ${
                          calcLocation === 'body'
                            ? 'bg-cyan-500 text-black border-cyan-400'
                            : 'bg-[#181d2a] text-slate-300 border-[#283248] hover:bg-[#22293b]'
                        }`}
                      >
                        🎽 Torso
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcLocation('head')}
                        className={`py-1 rounded-xs text-[10px] font-tech font-bold uppercase transition-all cursor-pointer border ${
                          calcLocation === 'head'
                            ? 'bg-red-500 text-white border-red-400'
                            : 'bg-[#181d2a] text-slate-300 border-[#283248] hover:bg-[#22293b]'
                        }`}
                      >
                        🎯 Cabeza (×2)
                      </button>
                    </div>
                  </div>

                  {/* Fila 3: Tipo de Ataque & Modificadores */}
                  <div>
                    <div className="text-[10px] font-mono-code text-slate-400 mb-1">Tipo de Ataque / Munición:</div>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        onClick={() => setCalcAttackType('standard')}
                        className={`py-1 px-1 rounded-xs text-[9px] font-mono-code font-bold transition-all cursor-pointer border truncate ${
                          calcAttackType === 'standard'
                            ? 'bg-cyan-500 text-black border-cyan-400'
                            : 'bg-[#181d2a] text-slate-300 border-[#283248] hover:bg-[#22293b]'
                        }`}
                        title="Estándar: 100% SP, -1 SP ablación si penetra"
                      >
                        Estándar (-1 SP)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcAttackType('ap')}
                        className={`py-1 px-1 rounded-xs text-[9px] font-mono-code font-bold transition-all cursor-pointer border truncate ${
                          calcAttackType === 'ap'
                            ? 'bg-orange-500 text-black border-orange-400'
                            : 'bg-[#181d2a] text-slate-300 border-[#283248] hover:bg-[#22293b]'
                        }`}
                        title="Perforante (AP): 100% SP, -2 SP ablación si penetra"
                      >
                        AP (-2 SP)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcAttackType('melee')}
                        className={`py-1 px-1 rounded-xs text-[9px] font-mono-code font-bold transition-all cursor-pointer border truncate ${
                          calcAttackType === 'melee'
                            ? 'bg-purple-500 text-white border-purple-400'
                            : 'bg-[#181d2a] text-slate-300 border-[#283248] hover:bg-[#22293b]'
                        }`}
                        title="Melee: Ignora 50% SP (redondeado hacia arriba)"
                      >
                        Melee (50% SP)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcAttackType('martial_arts')}
                        className={`py-1 px-1 rounded-xs text-[9px] font-mono-code font-bold transition-all cursor-pointer border truncate ${
                          calcAttackType === 'martial_arts'
                            ? 'bg-purple-500 text-white border-purple-400'
                            : 'bg-[#181d2a] text-slate-300 border-[#283248] hover:bg-[#22293b]'
                        }`}
                        title="Artes Marciales: Ignora 50% SP"
                      >
                        Artes Marc. (50%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcAttackType('brawling')}
                        className={`py-1 px-1 rounded-xs text-[9px] font-mono-code font-bold transition-all cursor-pointer border truncate ${
                          calcAttackType === 'brawling'
                            ? 'bg-blue-500 text-white border-blue-400'
                            : 'bg-[#181d2a] text-slate-300 border-[#283248] hover:bg-[#22293b]'
                        }`}
                        title="Pelea callejera: 100% SP"
                      >
                        Brawling (100%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcAttackType('direct')}
                        className={`py-1 px-1 rounded-xs text-[9px] font-mono-code font-bold transition-all cursor-pointer border truncate ${
                          calcAttackType === 'direct'
                            ? 'bg-red-600 text-white border-red-500'
                            : 'bg-[#181d2a] text-slate-300 border-[#283248] hover:bg-[#22293b]'
                        }`}
                        title="Directo: Ignora 100% del blindaje (0 SP)"
                      >
                        Directo (0 SP)
                      </button>
                    </div>
                  </div>

                  {/* Fila 4: Switches de Crítico y Pasaje de Exceso */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1e2538] text-[10px] font-mono-code">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={calcIsCritical}
                        onChange={(e) => setCalcIsCritical(e.target.checked)}
                        className="rounded border-[#2e374f] text-cyan-500 focus:ring-0"
                      />
                      <span className={calcIsCritical ? 'text-red-400 font-bold' : 'text-slate-400'}>
                        💥 Impacto Crítico (+5 HP directo)
                      </span>
                    </label>

                    {calcLocation === 'shield' && (
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={calcPassExcess}
                          onChange={(e) => setCalcPassExcess(e.target.checked)}
                          className="rounded border-[#2e374f] text-amber-500 focus:ring-0"
                        />
                        <span className={calcPassExcess ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                          Pasar daño sobrante a Torso
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Live Real-time Preview Card */}
                  <div className="bg-[#0b0e14] p-2.5 rounded border border-[#1f2638] space-y-1.5 font-mono-code text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-white border-b border-[#1b2132] pb-1">
                      <span className="text-cyan-400 uppercase">Previsualización de Impacto:</span>
                      <span className="text-amber-300">
                        {calcLocation === 'shield'
                          ? `SDP -${calcShieldLoss} | HP -${calcExcessHpLoss}`
                          : `SP -${calcSpAblation} | HP -${calcHpLoss}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300">
                      <div>
                        <span className="text-slate-500 block">Blindaje/SDP:</span>
                        {calcLocation === 'shield' ? (
                          <span className="font-bold text-amber-400">{shieldCover.currentSdp} → {calcNewShieldSdp} SDP</span>
                        ) : (
                          <span className="font-bold text-cyan-300">SP Efec: {calcEffectiveSp} (-{calcSpAblation} SP)</span>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-500 block">Penetrante:</span>
                        <span className="font-bold text-white">
                          {calcLocation === 'shield' ? (calcPassExcess ? `${calcExcessDamage} pts` : '0 (Escudo)') : `${calcPenetratingDamage} pts`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Daño a HP:</span>
                        <span className={`font-bold ${(calcLocation === 'shield' ? calcExcessHpLoss : calcHpLoss) > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                          -{calcLocation === 'shield' ? calcExcessHpLoss : calcHpLoss} HP
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-tight pt-1 border-t border-[#1b2132]">
                      {calcExplanation}
                    </p>
                  </div>

                  {/* 1-Click Execution Button */}
                  <button
                    type="button"
                    onClick={handleApplyCalculatedDamage}
                    className="w-full py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-tech font-bold text-xs uppercase tracking-wider rounded-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>💥 APLICAR IMPACTO (BAJAR SDP / SP / HP)</span>
                  </button>
                </div>

                {/* ACORDEÓN DE REGLAS OFICIALES CP RED */}
                <div className="border border-[#262c3e] rounded-sm bg-[#131622] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowArmorRulesGuide(!showArmorRulesGuide)}
                    className="w-full p-2 flex items-center justify-between text-left hover:bg-[#1a1f30] transition-colors cursor-pointer select-none"
                  >
                    <span className="font-tech text-[10px] font-bold text-cyan-300 flex items-center gap-1.5 uppercase">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      ¿CUÁNDO BAJA EL SP Y EL SDP? (REGLAS OFICIALES)
                    </span>
                    <span className="text-slate-400 text-xs font-mono-code font-bold">
                      {showArmorRulesGuide ? '▲ Cerrar' : '▼ Leer Reglas'}
                    </span>
                  </button>

                  {showArmorRulesGuide && (
                    <div className="p-3 text-[11px] text-slate-300 font-mono-code leading-relaxed space-y-2 border-t border-[#202636] bg-[#0c0e16]">
                      <div className="text-cyan-400 font-bold text-xs">
                        📖 REGLAS OFICIALES DE BLINDAJE Y COBERTURAS (Manual Core pp. 183-187):
                      </div>
                      <p>
                        <strong className="text-white">1. ¿Cuándo baja el SP de la Armadura (Ablación)?</strong><br />
                        El SP solo se reduce en <strong>1 punto</strong> (o <strong>2 puntos</strong> si la munición es Perforante AP) si el daño bruto del ataque <strong>supera estrictamente el SP efectivo</strong> del blindaje. Si el daño es igual o menor al SP, el blindaje detiene todo el daño y el SP <strong>no sufre ablación</strong>.
                      </p>
                      <p>
                        <strong className="text-white">2. Impactos en la Cabeza (Disparo Dirigido):</strong><br />
                        Si el ataque impacta en la cabeza y el daño supera el SP de la cabeza, el daño que penetra el SP se <strong>multiplica por 2</strong> antes de restarse de los Puntos de Vida (HP).
                      </p>
                      <p>
                        <strong className="text-white">3. Armas Melee y Artes Marciales vs Blindaje:</strong><br />
                        Los ataques con armas cuerpo a cuerpo (Melee) y maniobras de Artes Marciales <strong>ignoran la mitad del SP del defensor</strong> (redondeado hacia arriba a favor del atacante). Por ejemplo, SP 11 se convierte en SP 6 efectivo. Sin embargo, la Pelea a Puñetazos (Brawling) NO ignora la mitad del SP; se mide contra el 100% del SP.
                      </p>
                      <p>
                        <strong className="text-white">4. Escudos Antibalas y Coberturas (SDP vs SP):</strong><br />
                        Los escudos y coberturas tienen Puntos de Daño Estructural (<strong>SDP</strong>), no SP. Detienen todo el daño de un ataque independientemente de la munición. Si un ataque hace 20 de daño a un escudo de 10 SDP, el escudo se destruye en el acto. En las <em>reglas estándar oficiales</em>, el escudo absorbe el impacto completo y el daño no pasa al personaje en ese tiro. Con la opción táctica avanzada activada en este deck, puedes elegir transferir el exceso de daño al torso.
                      </p>
                      <p>
                        <strong className="text-white">5. Heridas Críticas:</strong><br />
                        Toda tirada con al menos dos seises (6) en los dados de daño inflige una Herida Crítica, sumando <strong>+5 de daño directo a los HP</strong> que no puede ser detenido por el blindaje.
                      </p>
                    </div>
                  )}
                </div>

                {/* Barra Táctica de Reparación Rápida de Armaduras */}
                <div className="bg-[#121622] p-2.5 rounded border border-[#21293e] space-y-2 mt-2">
                  <div className="flex items-center justify-between text-[10px] font-mono-code">
                    <span className="font-tech text-xs font-bold text-amber-300 uppercase flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-amber-400" /> TALLER RÁPIDO DE REPARACIÓN DE BLINDAJE
                    </span>
                    <span className="text-slate-400">Core p. 140</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono-code">
                    <button
                      type="button"
                      disabled={!activeChar?.headArmor || activeChar.headArmor.currentSp >= activeChar.headArmor.maxSp}
                      onClick={() => {
                        repairCharacterArmor('head', 'full', 0);
                        setCombatRepairFeedback('Cabeza reparada al 100% SP.');
                        setTimeout(() => setCombatRepairFeedback(null), 3000);
                      }}
                      className="py-1 px-1.5 bg-[#1b2234] hover:bg-amber-500 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed text-amber-300 border border-amber-500/30 rounded font-bold transition-all cursor-pointer truncate"
                    >
                      🛡️ Reparar Cabeza
                    </button>
                    <button
                      type="button"
                      disabled={!activeChar?.bodyArmor || activeChar.bodyArmor.currentSp >= activeChar.bodyArmor.maxSp}
                      onClick={() => {
                        repairCharacterArmor('body', 'full', 0);
                        setCombatRepairFeedback('Torso reparado al 100% SP.');
                        setTimeout(() => setCombatRepairFeedback(null), 3000);
                      }}
                      className="py-1 px-1.5 bg-[#1b2234] hover:bg-amber-500 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed text-amber-300 border border-amber-500/30 rounded font-bold transition-all cursor-pointer truncate"
                    >
                      🛡️ Reparar Torso
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        repairCharacterArmor('both', 'full', 0);
                        setCombatRepairFeedback('Todo el blindaje reparado al 100% SP.');
                        setTimeout(() => setCombatRepairFeedback(null), 3000);
                      }}
                      className="py-1 px-1.5 bg-[#18261e] hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/40 rounded font-bold transition-all cursor-pointer truncate"
                    >
                      🛡️ Reparar Todo
                    </button>
                  </div>
                  {combatRepairFeedback && (
                    <div className="text-[10px] font-mono-code text-emerald-300 bg-emerald-950/60 p-1 rounded border border-emerald-500/40">
                      ✓ {combatRepairFeedback}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {renderLeftPanelResizeHandle('armor')}

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
            headerRight={
              <button
                type="button"
                onClick={restoreLuck}
                className="text-[10px] text-[#64748b] hover:text-[#10b981] flex items-center gap-1 font-mono-code transition-colors cursor-pointer mr-1"
                title="Restablecer Suerte a Stat Máximo"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Restaurar
              </button>
            }
            subHeaderControls={renderLeftPanelHeaderControls('luck', false, 0)}
          >
            <div className={getLeftPanelClass('luck')} style={getLeftPanelStyle('luck')}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5 bg-[#171923] p-2 rounded border border-[#222636]">
                  {Array.from({ length: activeChar?.stats?.LUCK ?? 6 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleLuckPip(i + 1)}
                      title={`Fijar Suerte en ${i + 1}`}
                      className={`w-5 h-5 rounded-xs transition-all flex items-center justify-center font-mono-code text-[10px] font-bold cursor-pointer ${
                        i < (activeChar?.currentLuck ?? 0)
                          ? 'bg-[#f59e0b] text-black shadow-sm shadow-[#f59e0b]/40 font-extrabold'
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
                      type="button"
                      onClick={() => setLuckToSpend(Math.max(0, luckToSpendOnNextRoll - 1))}
                      className="w-6 h-6 bg-[#222534] hover:bg-[#dc2626] text-white rounded flex items-center justify-center font-bold cursor-pointer transition-colors"
                      title="Restar 1 punto de Suerte"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className={`w-8 text-center font-mono-code font-bold text-xs ${
                      luckToSpendOnNextRoll > 0 ? 'text-[#f59e0b]' : 'text-[#64748b]'
                    }`}>
                      +{luckToSpendOnNextRoll}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLuckToSpend(Math.min(activeChar?.currentLuck ?? 0, luckToSpendOnNextRoll + 1))}
                      className="w-6 h-6 bg-[#222534] hover:bg-[#10b981] text-white rounded flex items-center justify-center font-bold cursor-pointer transition-colors"
                      title="Sumar 1 punto de Suerte"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {renderLeftPanelResizeHandle('luck')}

          </CollapsibleHudCard>
        );

      case 'injuries': {
        const injuriesCount = activeChar?.activeInjuries?.length ?? 0;
        const isInjuriesAutoFull = injuriesCount > 3 && leftPanelSizeMode['injuries'] !== 'compact';
        return (
          <CollapsibleHudCard
            key="injuries"
            id="injuries"
            title={`HERIDAS CRÍTICAS (${injuriesCount})`}
            icon={<Skull className="w-3.5 h-3.5 text-[#dc2626]" />}
            summary={`${injuriesCount} herida(s) activa(s)`}
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
            headerRight={
              <div className="flex gap-1 mr-1" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => inflictRandomInjury('head')}
                  className="px-1.5 py-0.5 bg-[#23181d] hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/40 rounded-xs font-mono-code text-[9px] font-bold transition-all cursor-pointer"
                >
                  + CABEZA
                </button>
                <button
                  type="button"
                  onClick={() => inflictRandomInjury('body')}
                  className="px-1.5 py-0.5 bg-[#211f17] hover:bg-[#f59e0b] hover:text-black text-[#f59e0b] border border-[#f59e0b]/40 rounded-xs font-mono-code text-[9px] font-bold transition-all cursor-pointer"
                >
                  + CUERPO
                </button>
              </div>
            }
            subHeaderControls={renderLeftPanelHeaderControls('injuries', isInjuriesAutoFull, injuriesCount)}
          >
            <div className={getLeftPanelClass('injuries', isInjuriesAutoFull)} style={getLeftPanelStyle('injuries', isInjuriesAutoFull)}>
              {injuriesCount === 0 ? (
                <div className="text-center py-3 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded border border-[#222636]">
                  Sin heridas críticas.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeChar!.activeInjuries!.map((inj) => (
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
                            className={`p-0.5 rounded text-[10px] transition-colors cursor-pointer ${
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
                            className="p-0.5 bg-[#222534] hover:bg-[#dc2626] text-[#94a3b8] hover:text-white rounded text-[10px] transition-colors cursor-pointer"
                            title="Eliminar Herida"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#cbd5e1] leading-tight font-sans">
                        {inj.effect}
                      </p>
                      {inj.quickFixed && inj.quickFixUntilDay !== undefined && (
                        <p className="text-[9px] font-mono-code text-amber-300 mt-0.5">Quick Fix hasta el día {inj.quickFixUntilDay}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 space-y-2">
                <CritTableSelector />
                <details className="bg-[#171923] border border-[#222636] rounded-xs p-1.5">
                  <summary className="font-tech text-[11px] font-bold text-slate-200 cursor-pointer">Tratamiento y estabilización</summary>
                  <div className="mt-2">
                    <MedtechTreatmentPanel defaultPatientId={activeChar?.id} />
                  </div>
                </details>
              </div>
            </div>
            {renderLeftPanelResizeHandle('injuries')}

          </CollapsibleHudCard>
        );
      }

      case 'cyberware': {
        const cyberwareCount = installedCyberware.length;
        const isCyberwareAutoFull = cyberwareCount > 3 && leftPanelSizeMode['cyberware'] !== 'compact';
        const empDisabledCount = (activeChar?.empDisabledCyberwareIds || []).length;

        const handleEmpResistanceRoll = () => {
          ensureTelemetryExpanded();
          const techStat = activeChar?.stats?.TECH ?? 6;
          const cybertechSkill = activeChar?.skills?.cybertech ?? 2;
          const d10 = Math.floor(Math.random() * 10) + 1;
          const total = techStat + cybertechSkill + d10;
          const isSuccess = total > 15; // Core p. 345: hay que superar DV 15

          const entry: RollEntry = {
            id: `emp-resist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: new Date().toISOString(),
            type: 'skill',
            weaponName: '⚡ Resistencia a EMP / Malfunction',
            statName: 'TECH',
            statVal: techStat,
            skillName: 'Cybertech',
            skillVal: cybertechSkill,
            d10,
            totalAttack: total,
            targetDv: 15,
            isHit: isSuccess
          };
          addRollEntry(entry);

          setEmpFeedback(
            isSuccess
              ? `✅ ¡ÉXITO! Tiraste ${total} vs DV 15 (TECH ${techStat} + Cybertech ${cybertechSkill} + d10 ${d10}). Tu ciberware resiste el pulso.`
              : `❌ ¡FALLO! Tiraste ${total} vs DV 15 (TECH ${techStat} + Cybertech ${cybertechSkill} + d10 ${d10}). Tu ciberware sufre apagado o avería.`
          );
          setTimeout(() => setEmpFeedback(null), 6000);
        };

        return (
          <CollapsibleHudCard
            key="cyberware"
            id="cyberware"
            title={`CIBERIMPLANTES (${cyberwareCount})`}
            icon={<Zap className="w-3.5 h-3.5 text-[#a855f7]" />}
            summary={`${cyberwareCount} implante(s) instalados${empDisabledCount > 0 ? ` | ⚡ ${empDisabledCount} OFF` : ''}`}
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
            subHeaderControls={renderLeftPanelHeaderControls('cyberware', isCyberwareAutoFull, cyberwareCount)}
          >
            <div className={getLeftPanelClass('cyberware', isCyberwareAutoFull)} style={getLeftPanelStyle('cyberware', isCyberwareAutoFull)}>
              {/* Barra de Gestión de EMP y Averías */}
              <div className="p-2 bg-[#10121c] rounded border border-[#21273c] space-y-2 mb-2">
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-tech text-xs font-bold text-purple-300 uppercase flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-purple-400" /> RESISTENCIA A EMP (DV 15)
                    </span>
                    {empDisabledCount > 0 && (
                      <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-red-950/80 text-red-400 border border-red-500/50 font-bold animate-pulse">
                        ⚡ {empDisabledCount} APAGADOS
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleEmpResistanceRoll}
                      className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#1a2136] hover:bg-purple-600 hover:text-white text-purple-300 border border-purple-500/40 transition-colors cursor-pointer flex items-center gap-1"
                      title="Chequeo canónico de resistencia contra pulsos EMP (TECH + Cybertech + 1d10 vs DV 15)"
                    >
                      <Dices className="w-3 h-3" />
                      <span>Tirada vs DV 15</span>
                    </button>

                    {empDisabledCount > 0 && (
                      <button
                        type="button"
                        onClick={() => clearAllEmpDisabledCyberware()}
                        className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#15241d] hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/40 transition-colors cursor-pointer"
                        title="Reiniciar todo el ciberware apagado y restaurar energía"
                      >
                        🔄 Reiniciar Todo
                      </button>
                    )}
                  </div>
                </div>

                {empFeedback && (
                  <div className="text-[10px] font-mono-code p-1.5 rounded border border-[#2d3855] bg-[#141826] text-slate-200">
                    {empFeedback}
                  </div>
                )}
              </div>

              {cyberwareCount === 0 ? (
                <div className="text-center py-3 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded border border-[#222636]">
                  Sin ciberimplantes registrados en este personaje.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {installedCyberware.map((c: any) => {
                    const isEmpDisabled = (activeChar?.empDisabledCyberwareIds || []).includes(c.id);

                    return (
                      <div
                        key={c.id}
                        className={`p-2 rounded-xs font-mono-code text-[11px] border transition-all ${
                          isEmpDisabled
                            ? 'bg-[#1b1014] border-red-500/70 shadow-xs'
                            : 'bg-[#171923] border-[#222636]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-white mb-0.5 gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={isEmpDisabled ? 'text-red-400 line-through truncate' : 'text-[#a855f7] truncate'}>
                              {c.name}
                            </span>
                            {isEmpDisabled && (
                              <span className="text-[8px] font-mono-code px-1 rounded bg-red-950 text-red-300 border border-red-500/50 font-bold shrink-0">
                                ⚡ EMP OFF
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <CyberCategoryTooltip category={c.type || 'Cyberware'}>
                              <span className="text-[9px] text-[#a855f7] bg-purple-950/40 px-1 py-0.5 rounded border border-purple-500/30 uppercase cursor-help hover:border-purple-400">
                                {c.type || 'Cyberware'}
                              </span>
                            </CyberCategoryTooltip>

                            <button
                              type="button"
                              onClick={() => toggleEmpDisableCyberware(c.id)}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold transition-all cursor-pointer border ${
                                isEmpDisabled
                                  ? 'bg-red-950/80 text-red-300 border-red-500 hover:bg-red-900'
                                  : 'bg-[#121522] text-slate-400 border-[#252c42] hover:text-white hover:border-slate-500'
                              }`}
                              title={isEmpDisabled ? 'Ciberware apagado. Clic para reactivar.' : 'Simular apagado por EMP o Quickhack'}
                            >
                              {isEmpDisabled ? '⚡ OFF' : '🟢 ON'}
                            </button>
                          </div>
                        </div>

                        {c.description && (
                          <p className="text-[10px] text-[#94a3b8] leading-tight line-clamp-2">
                            {c.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {renderLeftPanelResizeHandle('cyberware')}
          </CollapsibleHudCard>
        );
      }

      case 'consumables': {
        const drugsCount = (activeChar?.activeDrugs || []).length;
        const isConsumablesAutoFull = drugsCount > 3 && leftPanelSizeMode['consumables'] !== 'compact';
        return (
          <CollapsibleHudCard
            key="consumables"
            id="consumables"
            title={`DROGAS EN SANGRE (${drugsCount})`}
            icon={<Pill className="w-3.5 h-3.5 text-[#ec4899]" />}
            summary={`${drugsCount} droga(s) activa(s)`}
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
            subHeaderControls={renderLeftPanelHeaderControls('consumables', isConsumablesAutoFull, drugsCount)}
          >
            <div className={getLeftPanelClass('consumables', isConsumablesAutoFull)} style={getLeftPanelStyle('consumables', isConsumablesAutoFull)}>
              {drugsCount === 0 ? (
                <div className="text-center py-3 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded border border-[#222636]">
                  Sin drogas ni fármacos activos en el organismo.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeChar!.activeDrugs!.map((d) => (
                    <div key={d.id} className="bg-[#100d18] p-2 rounded border border-[#a855f7]/30 font-mono-code text-[11px]">
                      <div className="flex items-center justify-between text-white font-bold mb-1">
                        <span className="text-[#c084fc]">{d.name}</span>
                        <button
                          onClick={() => removeActiveDrug(d.id)}
                          className="text-[9px] bg-[#dc2626]/20 hover:bg-[#dc2626] text-[#f87171] hover:text-white px-1.5 py-0.5 rounded transition-all cursor-pointer"
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
            </div>
            {renderLeftPanelResizeHandle('consumables')}

          </CollapsibleHudCard>
        );
      }

      default:
        return null;
    }
  };

  const renderRightPanel = (id: RightPanelId, index: number, isFloating = false, isPreview = false) => {
    const isCollapsed = !!collapsedBoxes[id];
    const canMoveUp = !isFloating && !isPreview && index > 0;
    const canMoveDown = !isFloating && !isPreview && index < activeCenterModules.length - 1;
    const onSendToTray = (!isFloating && !isPreview) ? () => sendModuleToTray(id) : undefined;

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
            onSendToTray={onSendToTray}
            headerDragHandler={isFloating ? handleFloatingDragStart : undefined}
            extraHeaderActions={
              <div className="flex flex-wrap items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {/* Selectores de Modo */}
                <div className="flex items-center gap-0.5 bg-[#161a26] p-0.5 rounded border border-[#2b334a]">
                  <button
                    type="button"
                    onClick={() => {
                      setTelemetryDockMode('inline');
                      localStorage.setItem(STORAGE_KEY_DOCK_MODE, 'inline');
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
                      telemetryDockMode === 'inline' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Anclar en la columna central del HUD"
                  >
                    📌 Centro
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTelemetryDockMode('split_sticky');
                      localStorage.setItem(STORAGE_KEY_DOCK_MODE, 'split_sticky');
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
                      telemetryDockMode === 'split_sticky' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Anclar sticky lateral fijo al lado de las armas"
                  >
                    📐 Split Lateral
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTelemetryDockMode('floating_pip');
                      localStorage.setItem(STORAGE_KEY_DOCK_MODE, 'floating_pip');
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
                      telemetryDockMode === 'floating_pip' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Ventana flotante mini-HUD libre (arrástrala por la pantalla)"
                  >
                    🪟 Ventana Libre
                  </button>
                </div>

                {/* Botones Rápidos de Tamaño XS / S / M / L + [-] / [+] */}
                <div className="flex items-center gap-0.5 bg-[#161a26] p-0.5 rounded border border-[#2b334a]">
                  <button
                    type="button"
                    onClick={() => applyTelemetryPreset('xs')}
                    className={`px-1 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
                      telemetryHeight <= 160 ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tamaño XS (Mini: alto 140px, ancho 300px, compacto automático)"
                  >
                    XS
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTelemetryPreset('s')}
                    className={`px-1 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
                      telemetryHeight > 160 && telemetryHeight <= 250 ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tamaño S (Chica: alto 220px, ancho 360px)"
                  >
                    S
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTelemetryPreset('m')}
                    className={`px-1 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
                      telemetryHeight > 250 && telemetryHeight <= 380 ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tamaño M (Media: alto 340px, ancho 460px)"
                  >
                    M
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTelemetryPreset('l')}
                    className={`px-1 py-0.5 text-[9px] font-mono-code rounded transition-colors cursor-pointer ${
                      telemetryHeight > 380 ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tamaño L (Grande: alto 520px, ancho 620px)"
                  >
                    L
                  </button>
                  <span className="text-slate-600 px-0.5">|</span>
                  <button
                    type="button"
                    onClick={() => adjustTelemetrySize(-40)}
                    className="w-4 h-4 flex items-center justify-center text-[10px] font-mono-code text-slate-300 hover:text-white bg-[#10141f] hover:bg-[#1f2638] rounded cursor-pointer"
                    title="Achicar altura y ancho (-40px)"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustTelemetrySize(40)}
                    className="w-4 h-4 flex items-center justify-center text-[10px] font-mono-code text-slate-300 hover:text-white bg-[#10141f] hover:bg-[#1f2638] rounded cursor-pointer"
                    title="Agrandar altura y ancho (+40px)"
                  >
                    +
                  </button>
                </div>

                {/* Toggle de Auto-expand al tirar */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !telemetryAutoExpand;
                    setTelemetryAutoExpand(next);
                    localStorage.setItem(STORAGE_KEY_AUTO_EXPAND, JSON.stringify(next));
                  }}
                  className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded border transition-colors cursor-pointer ${
                    telemetryAutoExpand
                      ? 'bg-amber-950/70 text-amber-300 border-amber-600/50'
                      : 'bg-[#161a26] text-slate-500 border-[#2b334a]'
                  }`}
                  title="Auto-abrir la consola al hacer tiradas de combate"
                >
                  ⚡ {telemetryAutoExpand ? 'Auto-abrir' : 'Manual'}
                </button>

                {/* Toggle Modo Compacto */}
                <button
                  type="button"
                  onClick={() => setTelemetryCompactMode(!telemetryCompactMode)}
                  className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded border transition-colors cursor-pointer ${
                    telemetryCompactMode
                      ? 'bg-cyan-950/70 text-cyan-300 border-cyan-600/50'
                      : 'bg-[#161a26] text-slate-500 border-[#2b334a]'
                  }`}
                  title="Alternar vista compacta de telemetría"
                >
                  {telemetryCompactMode ? '🗜️ Compacto' : '📄 Normal'}
                </button>

                {/* Reset posición en modo ventana flotante */}
                {isFloating && floatingPos !== null && (
                  <button
                    type="button"
                    onClick={() => setFloatingPos(null)}
                    className="px-1.5 py-0.5 text-[9px] font-mono-code text-cyan-300 bg-[#161a26] hover:bg-cyan-700/40 rounded border border-cyan-500/40 cursor-pointer"
                    title="Devolver ventana a la esquina inferior derecha"
                  >
                    ⟲ Reset Pos
                  </button>
                )}

                {rollHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={clearRollHistory}
                    className="text-[10px] font-mono-code text-[#64748b] hover:text-[#dc2626] transition-colors px-1 cursor-pointer"
                    title="Limpiar historial de tiradas"
                  >
                    LIMPIAR
                  </button>
                )}

                {onSendToTray && (
                  <button
                    type="button"
                    onClick={onSendToTray}
                    className="px-1.5 py-0.5 text-[9px] font-mono-code bg-[#161a26] hover:bg-amber-950/60 hover:text-amber-300 text-slate-400 border border-[#2b334a] hover:border-amber-600/40 rounded transition-colors cursor-pointer"
                    title="Mandar a Bandeja Derecha para despejar el centro"
                  >
                    ➡️ A Bandeja
                  </button>
                )}
              </div>
            }
          >
            
        <div
          style={{ height: isCollapsed ? undefined : `${telemetryHeight}px`, maxHeight: `${telemetryHeight}px` }}
          className={`space-y-2 overflow-y-auto pr-1.5 ${isEffectiveCompact ? 'text-[11px]' : ''}`}
        >
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
                          <div className="mb-1"><CritTableSelector /></div>
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

            {/* Tirador de Redimensionado Interactivo Libre con Mouse */}
            <div
              onMouseDown={handleResizeMouseDown}
              className="mt-2 pt-1 border-t border-[#1c2234] flex items-center justify-between text-[9px] font-mono-code text-slate-400 select-none cursor-ns-resize hover:text-cyan-300 hover:border-cyan-500/40 transition-colors py-0.5"
              title="Haz clic y arrastra con el ratón para achicar o agrandar la consola libremente"
            >
              <div className="flex items-center gap-1">
                <span className="text-cyan-400 font-bold">📏</span>
                <span>{telemetryWidth}×{telemetryHeight}px</span>
                <span className="text-slate-500 hidden sm:inline">(Arrastra para redimensionar)</span>
              </div>
              <div className="flex items-center gap-1 cursor-se-resize">
                <span className="text-[10px] text-slate-500 hover:text-cyan-300">◢</span>
              </div>
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
            onSendToTray={onSendToTray}
            extraHeaderActions={
              onSendToTray ? (
                <button
                  type="button"
                  onClick={onSendToTray}
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-[#161a26] hover:bg-amber-950/60 hover:text-amber-300 text-slate-400 border border-[#2b334a] hover:border-amber-600/40 transition-colors cursor-pointer"
                  title="Mandar a la Bandeja Derecha para despejar el centro"
                >
                  ➡️ A Bandeja
                </button>
              ) : undefined
            }
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
                const distMeters = typeof selectedDistance === 'number'
                  ? selectedDistance
                  : parseInt((selectedDistance as string)?.match(/\d+/)?.[0] || '0', 10);
                const breakdown = calculateWeaponAttackBreakdown(activeChar, w, isAuto, distMeters);
                const currentDv = getDvForWeapon(w, selectedDistance, isAuto);
                const profileKey = getWeaponProfileKey(w.name, w.type);
                const profile = profileKey ? WEAPON_RANGE_PROFILES[profileKey] : null;
                const placeholderType = getItemPlaceholderType(w);
                const isOutOfAmmo = isRanged && (w.currentMag ?? 0) <= 0;
                const aimedPenalty = aimedShotTarget !== 'none' ? 8 : 0;
                const effectiveRof = aimedShotTarget !== 'none' ? 1 : w.rof;
                const netBaseWithLuck = breakdown.netBase - aimedPenalty + luckToSpendOnNextRoll;
                const selectedAmmoMeta = AMMO_TYPE_CATALOG.find((a) => a.id === normalizeLoadedAmmoType(w.loadedAmmoType));
                const weaponInfo = getWeaponClassAndRebuildInfo(w);

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
                            <WeaponClassTooltip weaponInfo={weaponInfo} notes={w.notes}>
                              <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-bold hover:border-cyan-400">
                                {weaponInfo.weaponClass}
                              </span>
                            </WeaponClassTooltip>
                            {weaponInfo.rebuildBadge && (
                              <WeaponClassTooltip weaponInfo={weaponInfo} notes={w.notes}>
                                <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold hover:border-amber-400">
                                  {weaponInfo.rebuildBadge}
                                </span>
                              </WeaponClassTooltip>
                            )}
                          </div>

                          {/* Píldoras Rápidas */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] font-mono-code">
                            <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs font-bold">
                              {w.damage}
                            </span>
                            <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs">
                              ROF {effectiveRof}{aimedShotTarget !== 'none' ? ' (Apuntado)' : ''}
                            </span>
                            {isRanged && (
                              <AmmoHoverTooltip ammoIdOrName={normalizeLoadedAmmoType(w.loadedAmmoType)}>
                                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-xs font-bold cursor-help">
                                  Bala: {normalizeLoadedAmmoType(w.loadedAmmoType)}{w.ammoType && w.ammoType !== 'N/A' ? ` · ${w.ammoType}` : ''}
                                </span>
                              </AmmoHoverTooltip>
                            )}
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
                              DV actual: {w.type === 'Melee' ? `Defensa ${meleeDefenseBase}+1d10` : currentDv !== null ? `DV ${currentDv}` : 'N/A'} ({selectedDistance})
                            </span>
                            <span className="bg-[#121c18] border border-[#1d3b2b] text-[#10b981] px-1.5 py-0.5 rounded-xs font-bold">
                              Base: +{netBaseWithLuck}{aimedPenalty > 0 ? ' (-8)' : ''}
                            </span>
                          </div>

                          {/* Ranuras de Accesorios & Badges de Attachments */}
                          {(() => {
                            const slotInfo = calculateWeaponSlotCapacity(w);
                            const atts = w.installedAttachments ?? [];
                            return (
                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-[#161a26] text-slate-300 border border-[#2b334a]">
                                  🔩 RANURAS: <span className={slotInfo.remainingSlots === 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{slotInfo.usedSlots}/{slotInfo.maxSlots} SLOTS</span>
                                  {w.techUpgrade === 'extra_slot' && <span className="text-cyan-400 ml-1">(+1 Tech)</span>}
                                  {slotInfo.isExotic && w.techUpgrade !== 'extra_slot' && <span className="text-amber-400 ml-1">(Exótica: 0 slots)</span>}
                                </span>
                                {w.techUpgrade && w.techUpgrade !== 'none' && (
                                  <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 font-bold">
                                    🛠️ {TECH_MAKER_UPGRADE_OPTIONS.find((o) => o.id === w.techUpgrade)?.label || w.techUpgrade}
                                  </span>
                                )}
                                {atts.map((attId) => {
                                  const attObj = WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === attId);
                                  return (
                                    <span key={attId} className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                                      🔩 {attObj?.name.split(' (')[0] || attId}
                                    </span>
                                  );
                                })}
                              </div>
                            );
                          })()}
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

                    {/* Barra de Rebuild 2077: Badges y Toggles de Combate */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono-code">
                      {weaponInfo.rebuildBadge && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/50 font-bold uppercase">
                          {weaponInfo.rebuildBadge}
                        </span>
                      )}

                      {w.rebuild2077 === 'smart' && (
                        <button
                          type="button"
                          onClick={() => setSmartCoverBypass(prev => ({ ...prev, [w.instanceId]: !prev[w.instanceId] }))}
                          className={`px-2 py-0.5 rounded border transition-all cursor-pointer font-bold ${
                            smartCoverBypass[w.instanceId]
                              ? 'bg-cyan-500 text-black border-cyan-400'
                              : 'bg-[#121622] text-cyan-300 border-cyan-500/40 hover:bg-[#1a2030]'
                          }`}
                          title="Bypass de cobertura (-4 tirada, ignora línea de visión directa)"
                        >
                          🎯 Cobertura Smart (-4): {smartCoverBypass[w.instanceId] ? 'ACTIVO' : 'OFF'}
                        </button>
                      )}

                      {w.rebuild2077 === 'power' && (
                        <button
                          type="button"
                          onClick={() => setPowerRicochetActive(prev => ({ ...prev, [w.instanceId]: !prev[w.instanceId] }))}
                          className={`px-2 py-0.5 rounded border transition-all cursor-pointer font-bold ${
                            powerRicochetActive[w.instanceId]
                              ? 'bg-amber-500 text-black border-amber-400'
                              : 'bg-[#1c1417] text-amber-300 border-amber-500/40 hover:bg-[#281b20]'
                          }`}
                          title="Rebote cinético / Ricochet (-4 tirada, +5 daño en herida crítica)"
                        >
                          💥 Ricochet Rebote (-4): {powerRicochetActive[w.instanceId] ? 'ACTIVO' : 'OFF'}
                        </button>
                      )}

                      {w.rebuild2077 === 'tech' && (
                        <button
                          type="button"
                          onClick={() => setTechChargeShotActive(prev => ({ ...prev, [w.instanceId]: !prev[w.instanceId] }))}
                          className={`px-2 py-0.5 rounded border transition-all cursor-pointer font-bold ${
                            techChargeShotActive[w.instanceId]
                              ? 'bg-emerald-500 text-black border-emerald-400'
                              : 'bg-[#101c18] text-emerald-300 border-emerald-500/40 hover:bg-[#162922]'
                          }`}
                          title="Disparo Cargado (Ignora 50% SP o penetra coberturas finas)"
                        >
                          ⚡ Disparo Cargado (50% SP): {techChargeShotActive[w.instanceId] ? 'ACTIVO' : 'OFF'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleRebuildWorkshopCombat(w.instanceId)}
                        className="ml-auto px-2 py-0.5 rounded text-[9px] bg-[#1a1f30] hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
                        title="Abrir taller de conversión Rebuild 2077 para esta arma"
                      >
                        🔧 Rebuild Workshop
                      </button>
                    </div>

                    {/* Desplegable Taller de Rebuild 2077 */}
                    {openRebuildWorkshopsCombat[w.instanceId] && (
                      <div className="p-2.5 bg-[#0d0f17] border border-amber-500/40 rounded space-y-2 animate-fade-in text-[10px] font-mono-code">
                        <div className="flex items-center justify-between">
                          <span className="font-tech text-xs font-bold text-amber-300 uppercase">
                            🔧 TALLER DE REBUILD 2077 // {w.name}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            Estado: <strong className="text-white uppercase">{w.rebuild2077 || 'Estándar 2045'}</strong>
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                          {CEMK_WEAPON_REBUILD_SYSTEM_GUIDE.rebuildOptions.map((opt) => {
                            const isCurrent = w.rebuild2077 === opt.type;
                            return (
                              <div
                                key={opt.type}
                                className={`p-1.5 rounded border flex flex-col justify-between gap-1.5 ${
                                  isCurrent ? 'bg-amber-950/50 border-amber-500 text-white' : 'bg-[#131622] border-[#22283a] text-slate-300'
                                }`}
                              >
                                <div>
                                  <div className="font-tech font-bold text-xs text-amber-300">{opt.name}</div>
                                  <div className="text-[9px] text-slate-400 line-clamp-2 mt-0.5">{opt.specialAbility}</div>
                                </div>
                                <button
                                  type="button"
                                  disabled={isCurrent}
                                  onClick={() => convertWeaponRebuild2077(w.instanceId, opt.type as any, 0)}
                                  className={`w-full py-0.5 rounded text-[9px] font-tech font-bold uppercase transition-all cursor-pointer ${
                                    isCurrent ? 'bg-slate-800 text-slate-500' : 'bg-amber-500 hover:bg-amber-400 text-black'
                                  }`}
                                >
                                  {isCurrent ? 'Instalado' : 'Convertir (Gratis)'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        {w.rebuild2077 && w.rebuild2077 !== 'standard' && (
                          <div className="flex justify-end pt-1 border-t border-[#1e2333]">
                            <button
                              type="button"
                              onClick={() => convertWeaponRebuild2077(w.instanceId, 'standard', 0)}
                              className="px-2 py-0.5 bg-[#161a26] hover:bg-red-950 text-slate-400 hover:text-red-300 border border-[#272e42] rounded text-[9px] transition-colors cursor-pointer"
                            >
                              🔄 Restaurar a Estándar 2045
                            </button>
                          </div>
                        )}
                      </div>
                    )}

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
                        <span>1. ATACAR 1d10 ({w.type === 'Melee' ? `vs ${meleeDefenseBase}+1d10` : currentDv !== null ? `DV ${currentDv}` : 'Fuera Rango'}){aimedShotTarget !== 'none' ? ` [${AIMED_SHOT_OPTIONS[aimedShotTarget].shortBadge} -8]` : ''}</span>
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

                    {/* Ataques Secundarios de Accesorios Acoplados (Bayoneta, Escopeta, Lanzagranadas) */}
                    {(() => {
                      const installed = w.installedAttachments ?? [];
                      const hasBayonet = installed.includes('att-bayonet');
                      const hasSg = installed.includes('att-underbarrel-sg');
                      const hasGl = installed.includes('att-underbarrel-gl');

                      if (!hasBayonet && !hasSg && !hasGl) return null;

                      return (
                        <div className="pt-2 border-t border-[#1a1f2e] space-y-1.5">
                          <div className="text-[10px] font-mono-code font-bold text-amber-300 uppercase flex items-center gap-1">
                            <span>⚔️ Ataques Secundarios de Accesorios Acoplados:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {hasBayonet && (
                              <div className="p-1.5 bg-[#121622] border border-cyan-500/30 rounded flex items-center justify-between gap-1">
                                <span className="text-[9.5px] font-mono-code text-cyan-300 font-bold truncate">🗡️ Bayoneta (1d6 Melee)</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleAttachmentBayonetAttack(w)}
                                    className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-tech font-bold text-[9px] rounded cursor-pointer"
                                  >
                                    Atacar (vs {meleeDefenseBase}+1d10)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAttachmentBayonetDamage(w)}
                                    className="px-2 py-0.5 bg-[#1b2234] hover:bg-[#28334e] text-cyan-300 border border-cyan-500/40 font-tech font-bold text-[9px] rounded cursor-pointer"
                                  >
                                    Daño 1d6
                                  </button>
                                </div>
                              </div>
                            )}
                            {hasSg && (
                              <div className="p-1.5 bg-[#121622] border border-amber-500/30 rounded flex items-center justify-between gap-1">
                                <span className="text-[9.5px] font-mono-code text-amber-300 font-bold truncate">💥 Escopeta (3d6 Shell)</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleAttachmentUnderbarrelSgAttack(w)}
                                    className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-tech font-bold text-[9px] rounded cursor-pointer"
                                  >
                                    Disparar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAttachmentUnderbarrelSgDamage(w)}
                                    className="px-2 py-0.5 bg-[#1b2234] hover:bg-[#28334e] text-amber-300 border border-amber-500/40 font-tech font-bold text-[9px] rounded cursor-pointer"
                                  >
                                    Daño 3d6
                                  </button>
                                </div>
                              </div>
                            )}
                            {hasGl && (
                              <div className="p-1.5 bg-[#121622] border border-red-500/30 rounded flex items-center justify-between gap-1">
                                <span className="text-[9.5px] font-mono-code text-red-300 font-bold truncate">💣 Lanzagranadas (6d6)</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleAttachmentUnderbarrelGlAttack(w)}
                                    className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-tech font-bold text-[9px] rounded cursor-pointer"
                                  >
                                    Disparar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAttachmentUnderbarrelGlDamage(w)}
                                    className="px-2 py-0.5 bg-[#1b2234] hover:bg-[#28334e] text-red-300 border border-red-500/40 font-tech font-bold text-[9px] rounded cursor-pointer"
                                  >
                                    Daño 6d6
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

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
                            onClick={() => setWeaponSubTab(w.instanceId, 'attachments')}
                            className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all ${
                              currentSubTab === 'attachments'
                                ? 'bg-[#38bdf8] text-black shadow-sm'
                                : 'bg-[#181b26] text-[#94a3b8] hover:text-white border border-[#232738]'
                            }`}
                          >
                            🔩 ACCESORIOS & TECH ({(w.installedAttachments?.length ?? 0) + (w.techUpgrade && w.techUpgrade !== 'none' ? 1 : 0)})
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
                                  value={normalizeLoadedAmmoType(w.loadedAmmoType)}
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
                              <div className="flex items-center gap-1 flex-wrap mt-2 pt-2 border-t border-[#1e2333]">
                                <span className="text-[9px] font-mono-code text-slate-400 uppercase font-bold mr-1">Rápido:</span>
                                {QUICK_AMMO_TYPES.map((ammo) => {
                                  const activeAmmo = normalizeLoadedAmmoType(w.loadedAmmoType);
                                  const isActive = activeAmmo.toLowerCase() === ammo.toLowerCase();
                                  return (
                                    <AmmoHoverTooltip key={ammo} ammoIdOrName={ammo}>
                                      <button
                                        type="button"
                                        onClick={() => setWeaponAmmoType(w.instanceId, ammo)}
                                        className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono-code transition-colors cursor-pointer ${
                                          isActive
                                            ? 'bg-amber-500 text-black font-bold shadow-xs'
                                            : 'bg-[#121520] text-slate-400 hover:text-white border border-[#232a3c] hover:border-slate-500'
                                        }`}
                                      >
                                        {ammo}
                                      </button>
                                    </AmmoHoverTooltip>
                                  );
                                })}
                              </div>
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
                                <label className="flex items-center justify-between gap-2">
                                  <span>Melee enfrentado (Core p. 176): DEX + Evasion del defensor</span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={30}
                                    value={meleeDefenseBase}
                                    onChange={(e) => setMeleeDefenseBase(Math.max(0, Number(e.target.value) || 0))}
                                    className="w-14 bg-[#0f1016] border border-[#2e364c] text-white text-center rounded-xs"
                                  />
                                </label>
                                <span className="text-[10px] text-[#94a3b8]">El defensor suma 1d10; el empate lo gana el defensor.</span>
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

                        {/* SECCIÓN D: ACCESORIOS & TECH UPGRADES */}
                        {(currentSubTab === 'attachments' || currentSubTab === 'all') && (
                          <div className="p-3 bg-[#10121a] rounded border border-[#22283a] space-y-3">
                            <div className="flex items-center justify-between pb-1 border-b border-[#1b202e]">
                              <span className="font-tech text-xs font-bold text-[#38bdf8] flex items-center gap-1.5 uppercase">
                                🔩 ACCESORIOS & TALLER TECH // {w.name}
                              </span>
                              {(() => {
                                const slotCap = calculateWeaponSlotCapacity(w);
                                return (
                                  <span className="text-[9px] font-mono-code text-slate-400">
                                    Ranuras: <strong className="text-white">{slotCap.usedSlots}/{slotCap.maxSlots}</strong> ({slotCap.remainingSlots} libres)
                                  </span>
                                );
                              })()}
                            </div>

                            {/* 1. Accesorios Instalados */}
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Accesorios Instalados:</div>
                              {(w.installedAttachments ?? []).length === 0 ? (
                                <div className="text-[10px] font-mono-code text-slate-500 italic p-1.5 bg-[#0b0d13] rounded border border-[#1a1f2e]">
                                  Ningún accesorio instalado en esta arma.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {(w.installedAttachments ?? []).map((attId) => {
                                    const att = WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === attId);
                                    return (
                                      <div key={attId} className="p-2 bg-[#141824] rounded border border-cyan-500/40 flex items-center justify-between gap-1.5">
                                        <div className="min-w-0">
                                          <div className="font-tech text-xs font-bold text-white truncate">{att?.name || attId}</div>
                                          <div className="text-[9px] text-slate-400 font-mono-code">{att?.slots || 1} slot(s) • {att?.cost || 100} €$</div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeWeaponAttachment(w.instanceId, attId)}
                                          className="px-1.5 py-0.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 rounded text-[9px] font-bold font-mono-code shrink-0 cursor-pointer"
                                          title="Desinstalar accesorio"
                                        >
                                          ✕ Quitar
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* 2. Catálogo Rápido de Accesorios Disponibles */}
                            {(() => {
                              const slotCap = calculateWeaponSlotCapacity(w);
                              const availableToInstall = WEAPON_ATTACHMENTS_CATALOG.filter((att) => {
                                const isInstalled = (w.installedAttachments ?? []).includes(att.id);
                                const canFit = slotCap.remainingSlots >= att.slots;
                                const isEligible = att.eligibleWeaponTypes.length === 0 || 
                                  att.eligibleWeaponTypes.some((t) => t.toLowerCase() === (w.skill || '').toLowerCase() || t.toLowerCase() === (w.type || '').toLowerCase());
                                const hasIncompatible = (w.installedAttachments ?? []).some((id) => att.incompatibleWith.includes(id));
                                return !isInstalled && canFit && isEligible && !hasIncompatible;
                              });

                              return (
                                <div className="space-y-1.5 pt-1.5 border-t border-[#1a1f2e]">
                                  <div className="text-[10px] font-mono-code text-slate-400 uppercase">Instalar Nuevo Accesorio:</div>
                                  {slotCap.remainingSlots === 0 ? (
                                    <div className="text-[10px] font-mono-code text-amber-400 italic p-1.5 bg-[#0b0d13] rounded border border-[#1a1f2e]">
                                      Sin ranuras disponibles ({slotCap.usedSlots}/{slotCap.maxSlots} ocupadas). Mejora con Tech Maker o quita un accesorio.
                                    </div>
                                  ) : availableToInstall.length === 0 ? (
                                    <div className="text-[10px] font-mono-code text-slate-500 italic p-1.5 bg-[#0b0d13] rounded border border-[#1a1f2e]">
                                      No hay más accesorios compatibles para las ranuras libres ({slotCap.remainingSlots} slots).
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                                      {availableToInstall.map((att) => (
                                        <div key={att.id} className="p-1.5 bg-[#0d0f17] rounded border border-[#1e2436] flex items-center justify-between gap-1 text-[9.5px]">
                                          <div className="min-w-0 flex-1">
                                            <span className="font-tech font-bold text-white block truncate">{att.name}</span>
                                            <span className="text-[8.5px] text-slate-400 font-mono-code">{att.slots} slot(s) • {att.cost} €$</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => installWeaponAttachment(w.instanceId, att.id, 0)}
                                            className="px-2 py-0.5 bg-cyan-700 hover:bg-cyan-600 text-white font-mono-code font-bold rounded text-[9px] shrink-0 cursor-pointer"
                                          >
                                            + Instalar
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* 3. Mejora Tech Maker */}
                            <div className="space-y-1.5 pt-1.5 border-t border-[#1a1f2e]">
                              <div className="flex items-center justify-between text-[10px] font-mono-code">
                                <span className="text-amber-300 font-bold uppercase">🛠️ Mejora Tech Maker (Upgrade Expertise):</span>
                                {w.techUpgrade && w.techUpgrade !== 'none' && (
                                  <button
                                    type="button"
                                    onClick={() => applyTechUpgradeToWeapon(w.instanceId, 'none', 0)}
                                    className="text-[9px] text-red-400 hover:text-red-300 underline cursor-pointer"
                                  >
                                    Quitar Mejora Actual
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {TECH_MAKER_UPGRADE_OPTIONS.filter((o) => o.targetType === 'weapon').map((opt) => {
                                  const isCurrent = w.techUpgrade === opt.id;
                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => applyTechUpgradeToWeapon(w.instanceId, isCurrent ? 'none' : (opt.id as TechWeaponUpgradeType), 0)}
                                      className={`p-1.5 rounded text-left border transition-all cursor-pointer ${
                                        isCurrent
                                          ? 'bg-amber-950/60 border-amber-500 text-white'
                                          : 'bg-[#0d0f17] border-[#1e2436] text-slate-300 hover:border-slate-500'
                                      }`}
                                    >
                                      <div className="font-tech text-[10px] font-bold text-amber-300 flex items-center justify-between">
                                        <span>{opt.label}</span>
                                        {isCurrent && <span className="text-[8px] bg-amber-500 text-black px-1 rounded font-bold">ACTIVO</span>}
                                      </div>
                                      <div className="text-[8.5px] text-slate-400 line-clamp-1 mt-0.5">{opt.description}</div>
                                    </button>
                                  );
                                })}
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
                            vs {meleeDefenseBase}+1d10
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
                      <span>1. ATACAR 1d10 (vs {meleeDefenseBase}+1d10){aimedShotTarget !== 'none' ? ` [${AIMED_SHOT_OPTIONS[aimedShotTarget].shortBadge} -8]` : ''}</span>
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
                            title={`Ahorcar: ${activeChar ? getEffectiveBody(activeChar) : 6} HP directos ignorando SP`}
                          >
                            <Skull className="w-3.5 h-3.5" /> CHOKE ({activeChar ? getEffectiveBody(activeChar) : 6} HP Directos)
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
                            Daño: {martialDmg}
                          </span>
                          <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs">
                            ROF {aimedShotTarget !== 'none' ? '1 (Apuntado)' : '2'}
                          </span>
                          <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-1.5 py-0.5 rounded-xs">
                            vs {meleeDefenseBase}+1d10
                          </span>
                          <span className="bg-[#121c18] border border-[#1d3b2b] text-[#10b981] px-1.5 py-0.5 rounded-xs font-bold">
                            Base: +{(activeChar?.stats?.DEX ?? 6) + martialHandRank + luckToSpendOnNextRoll - (aimedShotTarget !== 'none' ? 8 : 0)}{aimedShotTarget !== 'none' ? ' (-8)' : ''}
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
                  <div className="pt-2 border-t border-[#1f2334]">{martialFormSelector}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleMartialArtsAttack}
                      disabled={!martialHandForm}
                      className="py-2 px-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Crosshair className="w-4 h-4" />
                      <span>1. ATACAR 1d10 (vs {meleeDefenseBase}+1d10){aimedShotTarget !== 'none' ? ` [${AIMED_SHOT_OPTIONS[aimedShotTarget].shortBadge} -8]` : ''}</span>
                    </button>
                    <button
                      onClick={handleMartialArtsDamage}
                      disabled={!martialHandForm}
                      className="py-2 px-3 bg-[#1d2232] hover:bg-[#252c42] border border-[#2a3248] text-[#10b981] font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Dices className="w-4 h-4" />
                      <span>2. TIRAR DAÑO ({martialDmg})</span>
                    </button>
                  </div>

                  {/* Dropdown Desplegable: Fórmula y Reglas */}
                  {unarmedInHandExpanded.martialArts && (
                    <div className="pt-2 border-t border-[#1f2434] space-y-2.5 animate-fade-in">
                      <div className="bg-[#101218] p-2.5 rounded border border-[#1f2434] text-xs font-mono-code flex items-center justify-between">
                        <span className="text-[#94a3b8]">
                          Base: DEX ({activeChar?.stats?.DEX ?? 6}) + Martial Arts ({martialHandRank})
                          {luckToSpendOnNextRoll > 0 && <span className="text-[#f59e0b]"> + Luck ({luckToSpendOnNextRoll})</span>}
                        </span>
                        <span className="text-white font-bold bg-[#1a2030] px-2 py-0.5 rounded border border-[#2b344c]">
                          TOTAL: <span className="text-[#10b981]">{(activeChar?.stats?.DEX ?? 6) + martialHandRank + luckToSpendOnNextRoll}</span>
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
            onSendToTray={onSendToTray}
            extraHeaderActions={
              onSendToTray ? (
                <button
                  type="button"
                  onClick={onSendToTray}
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-[#161a26] hover:bg-amber-950/60 hover:text-amber-300 text-slate-400 border border-[#2b334a] hover:border-amber-600/40 transition-colors cursor-pointer"
                  title="Mandar a la Bandeja Derecha para despejar el centro"
                >
                  ➡️ A Bandeja
                </button>
              ) : undefined
            }
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
            onSendToTray={onSendToTray}
            extraHeaderActions={
              <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#64748b]" onClick={(e) => e.stopPropagation()}>
                <span>💣 {totalGrenadeCharges}</span>
                <span>💉 {totalDrugCharges}</span>
                {onSendToTray && (
                  <button
                    type="button"
                    onClick={onSendToTray}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-[#161a26] hover:bg-amber-950/60 hover:text-amber-300 text-slate-400 border border-[#2b334a] hover:border-amber-600/40 transition-colors cursor-pointer"
                    title="Mandar a la Bandeja Derecha para despejar el centro"
                  >
                    ➡️ A Bandeja
                  </button>
                )}
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
                        const weaponInfo = getWeaponClassAndRebuildInfo(w);
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
                                  <div className="font-tech text-xs font-bold text-white truncate group-hover/wep:text-[#38bdf8] transition-colors flex items-center gap-1.5 flex-wrap">
                                    <span>{w.name}</span>
                                    <WeaponClassTooltip weaponInfo={weaponInfo} notes={w.notes}>
                                      <span className="text-[9px] font-mono-code px-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-bold hover:border-cyan-400">
                                        {weaponInfo.weaponClass}
                                      </span>
                                    </WeaponClassTooltip>
                                    {weaponInfo.rebuildBadge && (
                                      <WeaponClassTooltip weaponInfo={weaponInfo} notes={w.notes}>
                                        <span className="text-[9px] font-mono-code px-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold hover:border-amber-400">
                                          {weaponInfo.rebuildBadge}
                                        </span>
                                      </WeaponClassTooltip>
                                    )}
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
                                        <span>•</span>
                                        <AmmoHoverTooltip ammoIdOrName={normalizeLoadedAmmoType(w.loadedAmmoType)}>
                                          <span className="text-amber-300 font-bold cursor-help">
                                            {normalizeLoadedAmmoType(w.loadedAmmoType)}
                                          </span>
                                        </AmmoHoverTooltip>
                                      </>
                                    )}
                                  </div>

                                  {/* Indicador de ranuras y badges de accesorios */}
                                  {(() => {
                                    const slotCap = calculateWeaponSlotCapacity(w);
                                    const atts = w.installedAttachments ?? [];
                                    return (
                                      <div className="flex items-center gap-1 flex-wrap mt-0.5">
                                        <span className="text-[8.5px] font-mono-code px-1 py-0.2 rounded bg-[#161a26] text-slate-400 border border-[#2b334a]">
                                          🔩 {slotCap.usedSlots}/{slotCap.maxSlots} slots
                                          {w.techUpgrade === 'extra_slot' && <span className="text-cyan-400 ml-0.5">(+1 Tech)</span>}
                                        </span>
                                        {w.techUpgrade && w.techUpgrade !== 'none' && (
                                          <span className="text-[8.5px] font-mono-code px-1 py-0.2 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 font-bold">
                                            🛠️ {TECH_MAKER_UPGRADE_OPTIONS.find((o) => o.id === w.techUpgrade)?.label || w.techUpgrade}
                                          </span>
                                        )}
                                        {atts.map((attId) => {
                                          const attObj = WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === attId);
                                          return (
                                            <span key={attId} className="text-[8.5px] font-mono-code px-1 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                                              {attObj?.name.split(' (')[0] || attId}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    );
                                  })()}
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
                                        value={normalizeLoadedAmmoType(w.loadedAmmoType)}
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

                                    <div className="flex items-center gap-1 flex-wrap pt-1">
                                      {QUICK_AMMO_TYPES.map((ammo) => {
                                        const activeAmmo = normalizeLoadedAmmoType(w.loadedAmmoType);
                                        const isActive = activeAmmo.toLowerCase() === ammo.toLowerCase();
                                        return (
                                          <AmmoHoverTooltip key={ammo} ammoIdOrName={ammo}>
                                            <button
                                              type="button"
                                              onClick={() => setWeaponAmmoType(w.instanceId, ammo)}
                                              className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono-code transition-colors cursor-pointer ${
                                                isActive
                                                  ? 'bg-amber-500 text-black font-bold shadow-xs'
                                                  : 'bg-[#121520] text-slate-400 hover:text-white border border-[#232a3c] hover:border-slate-500'
                                              }`}
                                            >
                                              {ammo}
                                            </button>
                                          </AmmoHoverTooltip>
                                        );
                                      })}
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

                                {/* Taller Rebuild 2077 en Rack Táctico */}
                                <div className="pt-2 border-t border-[#1a1f2e] space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-tech font-bold text-amber-300 uppercase">
                                      🔧 Rebuild 2077 ({w.rebuild2077 ? w.rebuild2077.toUpperCase() : 'Estándar 2045'})
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1">
                                    {(['power', 'smart', 'tech'] as const).map((rType) => {
                                      const isCur = w.rebuild2077 === rType;
                                      return (
                                        <button
                                          key={rType}
                                          type="button"
                                          disabled={isCur}
                                          onClick={() => convertWeaponRebuild2077(w.instanceId, rType, 0)}
                                          className={`py-1 rounded text-[9px] font-tech font-bold uppercase transition-all cursor-pointer ${
                                            isCur
                                              ? 'bg-amber-500 text-black shadow-xs'
                                              : 'bg-[#151928] hover:bg-amber-500/20 text-slate-300 border border-[#232b3f]'
                                          }`}
                                        >
                                          {isCur ? `✓ ${rType}` : `+ ${rType}`}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {w.rebuild2077 && w.rebuild2077 !== 'standard' && (
                                    <button
                                      type="button"
                                      onClick={() => convertWeaponRebuild2077(w.instanceId, 'standard', 0)}
                                      className="text-[9px] text-slate-400 hover:text-red-400 hover:underline cursor-pointer block"
                                    >
                                      Quitar Rebuild (Restaurar 2045)
                                    </button>
                                  )}
                                </div>

                                {/* Accesorios & Tech Upgrade en Arsenal Belt */}
                                <div className="pt-2 border-t border-[#1a1f2e] space-y-2">
                                  <div className="flex items-center justify-between text-[10px] font-mono-code">
                                    <span className="font-tech text-cyan-300 font-bold uppercase">🔩 ACCESORIOS & TECH:</span>
                                    {(() => {
                                      const slotCap = calculateWeaponSlotCapacity(w);
                                      return (
                                        <span className="text-slate-400">
                                          {slotCap.usedSlots}/{slotCap.maxSlots} slots ({slotCap.remainingSlots} libres)
                                        </span>
                                      );
                                    })()}
                                  </div>

                                  {/* Accesorios Instalados */}
                                  <div className="flex flex-wrap gap-1">
                                    {(w.installedAttachments ?? []).length === 0 ? (
                                      <span className="text-[9px] text-slate-500 italic font-mono-code">Sin accesorios</span>
                                    ) : (
                                      (w.installedAttachments ?? []).map((attId) => {
                                        const att = WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === attId);
                                        return (
                                          <span key={attId} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/40 text-[9px] font-mono-code">
                                            <span>{att?.name.split(' (')[0] || attId}</span>
                                            <button
                                              type="button"
                                              onClick={() => removeWeaponAttachment(w.instanceId, attId)}
                                              className="text-red-400 hover:text-red-300 font-bold ml-0.5 cursor-pointer"
                                              title="Quitar accesorio"
                                            >
                                              ✕
                                            </button>
                                          </span>
                                        );
                                      })
                                    )}
                                  </div>

                                  {/* Instalar Accesorio Rápido */}
                                  {(() => {
                                    const slotCap = calculateWeaponSlotCapacity(w);
                                    const available = WEAPON_ATTACHMENTS_CATALOG.filter((att) => {
                                      const isInstalled = (w.installedAttachments ?? []).includes(att.id);
                                      const canFit = slotCap.remainingSlots >= att.slots;
                                      const isEligible = att.eligibleWeaponTypes.length === 0 || 
                                        att.eligibleWeaponTypes.some((t) => t.toLowerCase() === (w.skill || '').toLowerCase() || t.toLowerCase() === (w.type || '').toLowerCase());
                                      const hasIncompatible = (w.installedAttachments ?? []).some((id) => att.incompatibleWith.includes(id));
                                      return !isInstalled && canFit && isEligible && !hasIncompatible;
                                    });

                                    if (slotCap.remainingSlots === 0 || available.length === 0) return null;

                                    return (
                                      <div className="flex items-center gap-1.5 pt-1">
                                        <select
                                          defaultValue=""
                                          onChange={(e) => {
                                            if (e.target.value) {
                                              installWeaponAttachment(w.instanceId, e.target.value, 0);
                                              e.target.value = '';
                                            }
                                          }}
                                          className="flex-1 bg-[#12141f] border border-[#2b334a] text-slate-300 text-[9px] rounded px-1.5 py-0.5 font-mono-code"
                                        >
                                          <option value="">+ Añadir accesorio...</option>
                                          {available.map((att) => (
                                            <option key={att.id} value={att.id}>
                                              {att.name} ({att.slots} slot, {att.cost} eb)
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    );
                                  })()}

                                  {/* Mejora Tech Maker Rápida */}
                                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#1a1f2e] text-[9.5px] font-mono-code">
                                    <span className="text-amber-300">Mejora Tech:</span>
                                    <select
                                      value={w.techUpgrade || 'none'}
                                      onChange={(e) => applyTechUpgradeToWeapon(w.instanceId, e.target.value as TechWeaponUpgradeType, 0)}
                                      className="bg-[#12141f] border border-amber-500/40 text-amber-200 text-[9px] rounded px-1.5 py-0.5 font-mono-code"
                                    >
                                      <option value="none">Sin Mejora Tech</option>
                                      {TECH_MAKER_UPGRADE_OPTIONS.filter((o) => o.targetType === 'weapon').map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                          🛠️ {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

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
                              💀 Ahorcar ({activeChar ? getEffectiveBody(activeChar) : 6} HP)
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
                              Daño: <strong className="text-white">{martialDmg}</strong> • Ignora 50% SP
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
                            Base: {(activeChar?.stats?.DEX ?? 6) + martialHandRank} (DEX {activeChar?.stats?.DEX ?? 6} + {martialHandForm?.name ?? 'Martial Arts'} {martialHandRank})
                          </div>
                          {martialFormSelector}
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={handleMartialArtsAttack}
                              disabled={!martialHandForm}
                              className="py-1 px-1.5 bg-[#10b981] hover:bg-[#059669] text-black font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1"
                            >
                              <Target className="w-3 h-3" /> ATACAR (1d10)
                            </button>
                            <button
                              onClick={handleMartialArtsDamage}
                              disabled={!martialHandForm}
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
                                    <span className="text-[#64748b]">| Radio: 10x10m | DV lanzamiento: {getThrownGrenadeDv(selectedDistance) ?? 'fuera de alcance (máx. 25 m)'}</span>
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
                                {g.name} ({g.damage || 'sin daño'})
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
            onSendToTray={onSendToTray}
            extraHeaderActions={
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowDojoModal(!showDojoModal)}
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
                {onSendToTray && (
                  <button
                    type="button"
                    onClick={onSendToTray}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-[#161a26] hover:bg-amber-950/60 hover:text-amber-300 text-slate-400 border border-[#2b334a] hover:border-amber-600/40 transition-colors cursor-pointer"
                    title="Mandar a la Bandeja Derecha para despejar el centro"
                  >
                    ➡️ A Bandeja
                  </button>
                )}
              </div>
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
                        <span className="text-emerald-300 font-bold">{activeChar?.improvementPoints ?? 0} IP</span>
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
                      const isOpen = !!openDojoForms[form.id];
                      const sourceLabel = form.sourceBook === 'core' ? 'Core Rulebook' : 'Cyberfists of Fury';

                      return (
                        <div
                          key={form.id}
                          className={`rounded border transition-all overflow-hidden ${
                            effectiveRank > 0
                              ? 'bg-[#121822] border-emerald-500/50 shadow-sm'
                              : 'bg-[#10131d] border-[#1f2738]'
                          }`}
                        >
                          {/* Cabecera Plegable: Nombre • Stats Clave • Fuente */}
                          <button
                            type="button"
                            onClick={() => toggleDojoForm(form.id)}
                            className="w-full p-2.5 flex items-center justify-between gap-2 text-left hover:bg-[#161c28] transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                              <span className="font-tech text-xs sm:text-sm font-bold text-white truncate">
                                {form.name}
                              </span>
                              <span className="text-[10px] font-mono-code text-emerald-400">
                                DEX (x2) • ROF 2 • 50% SP • Nvl {effectiveRank}
                              </span>
                              <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                                Fuente ({sourceLabel})
                              </span>
                              {effectiveRank > 0 && (
                                <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-emerald-500 text-black font-bold">
                                  RANGO {effectiveRank}
                                  {isChipEquipped && naturalRank < 3 ? ' (CHIP N3)' : ''}
                                </span>
                              )}
                            </div>
                            <div className="shrink-0 text-slate-400">
                              {isOpen ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                          </button>

                          {isOpen && (
                            <div className="p-2.5 pt-0 border-t border-[#1a2233] space-y-2 mt-1">
                              <div className="text-[10px] font-mono-code text-[#94a3b8] flex items-center gap-1.5 pt-1">
                                <span>Rol: <span className="text-white">{form.tacticalRole}</span></span>
                                <span>•</span>
                                <span>Stats: <span className="text-slate-300">{form.keyStats.join(', ')}</span></span>
                              </div>

                              <div className="text-[10px] text-slate-300 italic font-sans leading-relaxed">
                                "{form.originAndFlavor}"
                              </div>

                              {/* Movimientos Especiales con DV */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-tech font-bold text-red-400 uppercase tracking-wider block">
                                  ⚡ Movimientos Especiales ({form.moves.length}):
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {form.moves.map((m) => (
                                    <div
                                      key={m.id}
                                      className="bg-[#0b0e16] p-2 rounded-xs border border-[#1d2538] space-y-0.5 text-[10px] font-mono-code"
                                    >
                                      <div className="flex items-center justify-between font-bold">
                                        <span className="text-white">{m.name}</span>
                                        <span className="text-amber-400">{m.isOpposed ? `vs ${m.opposedBy ?? 'DEX + Evasion'}` : `DV ${m.resolutionDv}`}{m.sourcePage && <span className="text-[#64748b] ml-1">p.{m.sourcePage}</span>}</span>
                                      </div>
                                      <div className="text-[9px] text-slate-400 font-sans leading-tight">
                                        <strong>Req:</strong> {m.requirements}
                                      </div>
                                      <div className="text-[9px] text-slate-300 font-sans leading-tight">
                                        {m.effectDescription}
                                      </div>
                                    </div>
                                  ))}
                                </div>
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
                          )}
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
                        <span>DAÑO ({martialDmg} · 50% SP)</span>
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
                                {move.isOpposed ? `vs ${move.opposedBy ?? 'DEX + Evasion'}` : `DV ${move.resolutionDv}`}{move.sourcePage && <span className="text-[#64748b] ml-1">p.{move.sourcePage}</span>}
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

                            {(() => {
                              const reqCheck = getMoveCheck(activeForm, move);
                              let confirmIdx = 0;
                              return (
                                <div className="space-y-0.5">
                                  {reqCheck.items.map((item, idx) => {
                                    if (item.kind === 'confirm') {
                                      const key = `${move.id}::${move.req?.confirm?.[confirmIdx] ?? item.label}`;
                                      confirmIdx += 1;
                                      return (
                                        <label key={idx} className="flex items-start gap-1.5 text-[10px] font-mono-code text-[#cbd5e1] cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={!!moveConfirmed[key]}
                                            onChange={(e) => setMoveConfirmed((prev) => ({ ...prev, [key]: e.target.checked }))}
                                          />
                                          <span>{item.ok ? '✓' : '✗'} {item.label}</span>
                                        </label>
                                      );
                                    }
                                    return (
                                      <div key={idx} className={`text-[10px] font-mono-code ${item.ok ? 'text-[#10b981]' : 'text-[#f87171]'}`}>
                                        {item.ok ? '✓' : '✗'} {item.label}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}

                            {moveSupportsHeadShot(move) && (
                              <label className="flex items-center gap-1.5 text-[10px] font-mono-code text-[#cbd5e1] cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!moveHeadShot[move.id]}
                                  onChange={(e) => setMoveHeadShot((prev) => ({ ...prev, [move.id]: e.target.checked }))}
                                />
                                <span>−8 a la cabeza (como Aimed Shot, decisión 43)</span>
                              </label>
                            )}

                            {(() => {
                              const dmgEff = move.effects?.find((e) => e.kind === 'damage');
                              if (!dmgEff || dmgEff.kind !== 'damage' || !dmgEff.alt?.when) return null;
                              return (
                                <label className="flex items-center gap-1.5 text-[10px] font-mono-code text-[#cbd5e1] cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!moveAltOn[move.id]}
                                    onChange={(e) => setMoveAltOn((prev) => ({ ...prev, [move.id]: e.target.checked }))}
                                  />
                                  <span>{dmgEff.alt.when} ({dmgEff.alt.formula})</span>
                                </label>
                              );
                            })()}

                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleExecuteMartialMove(activeForm, move)}
                                disabled={!getMoveCheck(activeForm, move).ok}
                                title={getMoveCheck(activeForm, move).items.find((i) => !i.ok)?.label ?? 'Ejecutar movimiento'}
                                className="flex-1 py-1 px-2 bg-[#1b253b] hover:bg-[#10b981] hover:text-black text-[#38bdf8] font-tech font-bold text-xs rounded transition-all flex items-center justify-center gap-1 border border-[#293b5d] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1b253b] disabled:hover:text-[#38bdf8]"
                              >
                                <Target className="w-3 h-3" /> EJECUTAR COMBO (1d10 + DEX + {activeRank} vs {move.isOpposed ? (move.opposedBy ?? 'DEX + Evasion + 1d10') : `DV ${move.resolutionDv}`})
                              </button>
                              {((move.damageBonusOrFormula && move.damageBonusOrFormula.includes('d')) || move.effects?.some((e) => e.kind === 'damage')) && (
                                <button
                                  onClick={() => handleRollComboDamage(move)}
                                  className="py-1 px-2 bg-[#291b22] hover:bg-[#dc2626] text-white font-tech font-bold text-xs rounded transition-all flex items-center justify-center gap-1 border border-[#441f28] cursor-pointer"
                                  title="Tirar dado de daño del combo"
                                >
                                  <Dices className="w-3 h-3" /> TIRAR DAÑO
                                </button>
                              )}
                            </div>

                            {!getMoveCheck(activeForm, move).ok && (
                              <div className="text-[10px] font-mono-code text-[#f87171]">
                                Bloqueado: {getMoveCheck(activeForm, move).items.find((i) => !i.ok)?.label}
                              </div>
                            )}

                            {(() => {
                              const last = lastMoveRoll[move.id];
                              const lastEntry = last ? rollHistory.find((r) => r.id === last.rollId) : undefined;
                              if (!last || !lastEntry) return null;
                              if (lastEntry.needsExplosionClick) {
                                return <div className="text-[10px] font-mono-code text-[#f59e0b]">Resolvé el 10/1 en el registro de tiradas para ver el resultado.</div>;
                              }
                              if (!lastEntry.isHit) {
                                return <div className="text-[10px] font-mono-code text-[#f87171]">Falló: sin efectos.</div>;
                              }
                              const lines = describeMoveEffects(move, { headShot: last.headShot, table: useRulesSettingsStore.getState().criticalTable });
                              return (
                                <div className="bg-[#0e111a] p-2 rounded border border-[#10b981]/40 space-y-1">
                                  <div className="text-[10px] font-mono-code uppercase font-bold text-[#10b981]">Efectos para aplicar</div>
                                  {lines.map((line, i) => (
                                    <div key={i} className="text-[11px] font-sans text-[#cbd5e1]">
                                      <strong className="text-white">{line.label}:</strong> {line.detail}
                                      {line.source && <span className="text-[#64748b] ml-1">({line.source.book} p.{line.source.page})</span>}
                                    </div>
                                  ))}
                                  <div className="text-[10px] font-mono-code text-[#94a3b8]">La app no aplica estos efectos: aplicalos en la ficha o el panel del enemigo.</div>
                                </div>
                              );
                            })()}
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
            onSendToTray={onSendToTray}
            extraHeaderActions={
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] font-mono-code text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/30">
                  {activeChar?.role?.toUpperCase() || 'SOLO'} R{activeChar?.roleRank || 4}
                </span>
                {onSendToTray && (
                  <button
                    type="button"
                    onClick={onSendToTray}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-[#161a26] hover:bg-amber-950/60 hover:text-amber-300 text-slate-400 border border-[#2b334a] hover:border-amber-600/40 transition-colors cursor-pointer"
                    title="Mandar a la Bandeja Derecha para despejar el centro"
                  >
                    ➡️ A Bandeja
                  </button>
                )}
              </div>
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
                      <div className="text-[9px] text-[#64748b]">Cuesta 4 pts (Core p. 146)</div>
                    </div>
                    <button
                      onClick={() => handleUpdateSoloField('fumbleRecovery', !activeChar?.soloAllocation?.fumbleRecovery)}
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

              {(activeChar?.role === 'Lawman' || gmFreeEditHud) && (
                <details className="bg-[#0e1017] p-3 rounded border border-[#22283a]">
                  <summary className="cursor-pointer font-tech text-xs font-bold text-white uppercase">Backup (Lawman)</summary>
                  <div className="mt-2">
                    <LawmanPanel />
                  </div>
                </details>
              )}
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
            summary={`Interface R${activeInterfaceRank} | 11 Hacks CEMK`}
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
            onSendToTray={onSendToTray}
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
                {onSendToTray && (
                  <button
                    type="button"
                    onClick={onSendToTray}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-[#161a26] hover:bg-amber-950/60 hover:text-amber-300 text-slate-400 border border-[#2b334a] hover:border-amber-600/40 transition-colors cursor-pointer ml-1"
                    title="Mandar a la Bandeja Derecha para despejar el centro"
                  >
                    ➡️ A Bandeja
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

              {/* Tabla de Desbloqueo Canónica CEMK por Rango de Interface */}
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
                    <div className="font-bold">Interface 1+</div>
                    <div className="text-[9px]">Simple [DV 6]</div>
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      activeInterfaceRank >= 2
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#121622] border-[#20273a] text-slate-500'
                    }`}
                  >
                    <div className="font-bold">Interface 2+</div>
                    <div className="text-[9px]">Standard [DV 8]</div>
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      activeInterfaceRank >= 3
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#121622] border-[#20273a] text-slate-500'
                    }`}
                  >
                    <div className="font-bold">Interface 3+</div>
                    <div className="text-[9px]">Difficult [DV 10]</div>
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      activeInterfaceRank >= 4
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#121622] border-[#20273a] text-slate-500'
                    }`}
                  >
                    <div className="font-bold">Interface 4+</div>
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

              {/* Flujo Canónico de 4 Pasos CEMK */}
              <div className="bg-[#0b0e17] p-2.5 rounded border border-[#20293d] space-y-2">
                <div className="flex items-center justify-between border-b border-[#1b2234] pb-1">
                  <span className="font-tech text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> FLUJO CANÓNICO DE COMBATE CEMK (POR NET ACTIONS)
                  </span>
                  <span className="text-[9px] font-mono-code text-slate-400">Sin RAM · 1 NET Action por paso</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono-code text-slate-400">
                  <label className="flex items-center gap-1">Conexión
                    <select value={quickhackConnection} onChange={(e) => setQuickhackConnection(e.target.value as 'external' | 'external_plus' | 'neuroport_port')}
                      className="bg-[#0f1016] border border-[#2e364c] text-white rounded-xs px-1">
                      <option value="external">Cyberdeck externo (6 m)</option>
                      <option value="external_plus">Cyberdeck externo con opción (8 m)</option>
                      <option value="neuroport_port">Neuroport Cyberdeck Port (50 m)</option>
                    </select>
                  </label>
                  <span>Línea de visión obligatoria (CEMK p. 26)</span>
                  <span className={quickhackUsedThisTurn ? 'text-rose-300' : 'text-emerald-300'}>
                    {quickhackUsedThisTurn ? 'Quickhack de este turno ya usado' : 'Quickhack de este turno disponible'}
                  </span>
                  <button type="button" onClick={handleNextRound}
                    className="px-1.5 py-0.5 bg-[#172238] hover:bg-cyan-500 hover:text-black text-cyan-300 rounded-xs cursor-pointer">
                    Nuevo turno
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono-code text-slate-300">
                  <span className={netActionsMax > 0 && netActionsSpent >= netActionsMax ? 'text-rose-300 font-bold' : 'text-cyan-300 font-bold'}>
                    NET Actions {netActionsSpent} / {netActionsMax} (Core p.197)
                  </span>
                  <span>DV de Quickhack: {quickhackMaxDv} (CEMK RB p.25)</span>
                  {quickhackFirewallDv !== null && <span>Firewall base DV {quickhackFirewallDv} (RB p.25)</span>}
                  {!quickhacksAllowed && (
                    <span className="text-rose-300 font-bold">Quickhacks deshabilitados: en 2045 requieren Neuroport (CEMK RB p.26)</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {/* Paso 1: Jack In */}
                  <div className="bg-[#121520] p-2 rounded-xs border border-[#1e273a] flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-tech font-bold text-cyan-300">PASO 1: JACK IN</div>
                      <div className="text-[9px] text-slate-400">1 NET Action vs WILL</div>
                      <div className="flex gap-1 mt-1 text-[9px] text-slate-400">
                        <label className="flex items-center gap-0.5">WILL
                          <input type="number" min={0} max={20} value={quickhackTargetWill}
                            onChange={(e) => setQuickhackTargetWill(Math.max(0, Number(e.target.value) || 0))}
                            className="w-9 bg-[#0f1016] border border-[#2e364c] text-white text-center rounded-xs" />
                        </label>
                        <label className="flex items-center gap-0.5">Conc.
                          <input type="number" min={0} max={20} value={quickhackTargetConcentration}
                            onChange={(e) => setQuickhackTargetConcentration(Math.max(0, Number(e.target.value) || 0))}
                            className="w-9 bg-[#0f1016] border border-[#2e364c] text-white text-center rounded-xs" />
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleJackInRoll}
                      className="mt-1.5 py-1 px-1.5 bg-[#172238] hover:bg-cyan-500 hover:text-black text-cyan-300 font-tech font-bold text-[10px] rounded-xs transition-colors cursor-pointer text-center"
                      title={`Conectar al Neuroport del objetivo dentro de ${QUICKHACK_RANGE_BY_CONNECTION[quickhackConnection]} m`}
                    >
                      🔌 Conectar
                    </button>
                  </div>

                  {/* Paso 2: Romper Passwalls */}
                  <div className="bg-[#121520] p-2 rounded-xs border border-[#1e273a] flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-tech font-bold text-amber-300">PASO 2: PASSWALLS</div>
                      <div className="text-[9px] text-slate-400">
                        {activeInterfaceRank >= 3 ? '⚡ Firewall DV 6 Bypass' : 'Firewall base (DV 6) / ICE'}
                      </div>
                    </div>
                    <div className="flex gap-1 mt-1.5">
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
                  <div className="bg-[#121520] p-2 rounded-xs border border-[#1e273a] flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-tech font-bold text-emerald-300">PASO 3: QUICKHACK</div>
                      <div className="text-[9px] text-slate-400">1 NET Action (1 hack/turno)</div>
                    </div>
                    <div className="text-[9px] text-emerald-400 font-mono-code mt-1.5 flex items-center gap-1">
                      <span>✓ Selecciona abajo</span>
                    </div>
                  </div>

                  {/* Paso 4: Expulsión */}
                  <div className="bg-[#121520] p-2 rounded-xs border border-[#1e273a] flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-tech font-bold text-rose-300">PASO 4: EXPULSIÓN</div>
                      <div className="text-[9px] text-slate-400">Acción Objetivo (WILL vs Int)</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleBootOutRoll}
                      className="mt-1.5 py-1 px-1.5 bg-[#29171b] hover:bg-rose-600 hover:text-white text-rose-300 font-tech font-bold text-[10px] rounded-xs transition-colors cursor-pointer text-center"
                      title="El objetivo gasta su Acción de Meatspace para intentar expulsarte"
                    >
                      👢 Boot Out
                    </button>
                  </div>
                </div>

                {quickhackFeedback && (
                  <div className="p-1.5 bg-black/60 rounded text-[10px] font-mono-code text-cyan-300 border border-cyan-500/30 animate-fade-in">
                    {quickhackFeedback}
                  </div>
                )}
              </div>

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
                          <span className="text-cyan-400 font-bold">{qh.actionCost}</span>
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
                          disabled={!isUnlocked || !quickhacksAllowed}
                          title={!quickhacksAllowed ? 'En 2045 los Quickhacks requieren Neuroport (CEMK RB p.26)' : undefined}
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

  const RIGHT_MODULES_METADATA: Array<{
    id: RightPanelId;
    title: string;
    shortTitle: string;
    icon: React.ReactNode;
    color: string;
    getSummary: () => string;
    getDetails: () => string;
  }> = [
    {
      id: 'telemetry',
      title: 'Consola de Telemetría (Log de Tiradas)',
      shortTitle: 'Telemetría',
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      color: 'text-cyan-400',
      getSummary: () => `${rollHistory.length} tiradas registradas`,
      getDetails: () => 'Log de tiradas en vivo, D10 y cálculos'
    },
    {
      id: 'inHand',
      title: 'Estación de Ataque // En Mano',
      shortTitle: 'En Mano',
      icon: <Crosshair className="w-4 h-4 text-[#38bdf8]" />,
      color: 'text-[#38bdf8]',
      getSummary: () => `${inHandWeapons.length + (isBrawlingInHand ? 1 : 0) + (isMartialArtsInHand ? 1 : 0)} ataque(s) listo(s)`,
      getDetails: () => 'Ataques directos de armas empuñadas, autofuego, tiro apuntado y recargas'
    },
    {
      id: 'rangefinder',
      title: 'Telémetro de Distancia & DV',
      shortTitle: 'Telémetro',
      icon: <Target className="w-4 h-4 text-[#f59e0b]" />,
      color: 'text-[#f59e0b]',
      getSummary: () => `Distancia: ${selectedDistance}m`,
      getDetails: () => 'Tabla oficial de DVs según metro y arma'
    },
    {
      id: 'arsenalBelt',
      title: 'Rack Táctico & Arsenal Completo',
      shortTitle: 'Arsenal & Rack',
      icon: <Swords className="w-4 h-4 text-[#38bdf8]" />,
      color: 'text-[#38bdf8]',
      getSummary: () => `${(activeChar?.equippedWeapons || []).length} armas | 💣 ${totalGrenadeCharges} | 💉 ${totalDrugCharges}`,
      getDetails: () => 'Inventario listo, granadas, drogas y munición'
    },
    {
      id: 'martialArts',
      title: 'Cyberfists & Artes Marciales',
      shortTitle: 'Artes Marciales',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      color: 'text-amber-400',
      getSummary: () => {
        const combatReady = MARTIAL_ARTS_FORMS.filter((f) => {
          const nat = activeChar?.knownMartialArts?.[f.id] ?? 0;
          const chip = (activeChar?.equippedMartialArtChips || []).includes(f.id);
          return nat > 0 || chip;
        });
        const currentForm = combatReady.find((f) => f.id === selectedMartialFormId) || combatReady[0] || MARTIAL_ARTS_FORMS[0];
        const rank = activeChar?.knownMartialArts?.[currentForm?.id] ?? 0;
        return currentForm ? `${currentForm.name} (R${rank})` : 'Dojo';
      },
      getDetails: () => 'Kárate, Taekwondo, Judo, Aikido y ataques especiales'
    },
    {
      id: 'roleAbility',
      title: 'Rol en Combate // Habilidad Canónica',
      shortTitle: 'Rol Canónico',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      color: 'text-emerald-400',
      getSummary: () => `${activeChar?.role?.toUpperCase() || 'SOLO'} R${activeChar?.roleRank || 4}`,
      getDetails: () => 'Especialización de clase canónica (Combat Awareness, etc.)'
    },
    {
      id: 'quickhacks2077',
      title: 'Quickhacks 2077 // CEMK Neuroport',
      shortTitle: 'Quickhacks 2077',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      color: 'text-cyan-400',
      getSummary: () => `Interface R${activeInterfaceRank} | 15 Hacks CEMK`,
      getDetails: () => 'Hacks del Cyberpunk 2077 adaptados al combate TTRPG'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Barra de Round, Iniciativa y Perception (plan 10, v4.9.2) */}
      <div className="chamfer-card p-2 bg-[#12141f] border border-[#242b3d] flex flex-wrap items-center gap-2 min-w-0">
        <span className="font-tech text-xs font-bold text-white uppercase tracking-wider">Round {round}</span>
        <button
          type="button"
          onClick={handleNextRound}
          className="px-2.5 py-1 rounded-xs font-tech font-bold text-[11px] uppercase tracking-wider bg-[#172238] hover:bg-cyan-500 hover:text-black text-cyan-300 border border-[#293b5d] cursor-pointer"
          title="Reinicia primer daño recibido, primer Ataque exitoso, Quickhack por objetivo y NET Actions"
        >
          Siguiente Round
        </button>
        {/* v4.9.6 [Claude Code · 2026-10-23] Barra de turno (decisión 48). */}
        <label className="flex items-center gap-1 text-[10px] font-mono-code text-slate-400">
          Metros movidos este turno
          <CommittedInput
            type="number"
            min={0}
            value={String(turnLog.movedMeters)}
            onCommit={(v) => setMovedMeters(Number(v) || 0)}
            className="w-14 px-1 py-0.5 rounded-xs bg-[#0e111a] border border-[#2b334a] text-white"
          />
        </label>
        <button
          type="button"
          onClick={handleEndTurn}
          className="px-2.5 py-1 rounded-xs font-tech font-bold text-[11px] uppercase tracking-wider bg-[#1b253b] hover:bg-[#10b981] hover:text-black text-[#10b981] border border-[#1f3b2d] cursor-pointer"
          title="Reinicia el registro de tu turno (golpes, movimientos usados y metros movidos)"
        >
          Fin de turno
        </button>
        <span className="text-[10px] font-mono-code text-slate-500">
          Golpes: Brawling {turnLog.hitsByType.brawling ?? 0}, Martial Arts {turnLog.hitsByType.martial_arts ?? 0}, Melee {turnLog.hitsByType.melee ?? 0} · Movimientos usados {turnLog.movesUsed.length}
        </span>
        <button
          type="button"
          onClick={handleResetCombat}
          className="px-2 py-1 rounded-xs font-mono-code text-[10px] bg-[#171924] hover:bg-red-900/60 text-slate-400 hover:text-white border border-[#2b334a] cursor-pointer"
          title="Vuelve al Round 1 y reinicia los contadores del Round"
        >
          Reiniciar combate
        </button>
        <button
          type="button"
          onClick={handleRollInitiative}
          className="px-2.5 py-1 rounded-xs font-tech font-bold text-[11px] uppercase tracking-wider bg-[#1b253b] hover:bg-[#38bdf8] hover:text-black text-[#38bdf8] border border-[#293b5d] cursor-pointer"
          title="REF + 1d10 (Core pp. 126, 168); suma Initiative Reaction del Solo (Core p.146)"
        >
          Iniciativa
        </button>
        <button
          type="button"
          onClick={handleRollPerception}
          className="px-2.5 py-1 rounded-xs font-tech font-bold text-[11px] uppercase tracking-wider bg-[#1b253b] hover:bg-[#38bdf8] hover:text-black text-[#38bdf8] border border-[#293b5d] cursor-pointer"
          title="INT + Perception + 1d10 (Core p.82); suma Threat Detection del Solo (Core p.146)"
        >
          Perception
        </button>
        <GameClockBar compact />
        {roundToolFeedback && (
          <span className="w-full text-[11px] font-mono-code text-cyan-200 break-words">{roundToolFeedback}</span>
        )}
      </div>

      <BackupCard />

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


      {/* GRID PRINCIPAL MODULAR Y REORDENABLE (3 ZONAS: BIO/DEFENSAS + CONFIGURADOR CENTRAL + BANDEJA TÁCTICA) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* COLUMNA IZQUIERDA: BIO & DEFENSAS */}
        <div className={`${getLeftColumnClass()} space-y-4`}>
          {/* Workspace Controls Header: Column Width Selector */}
          <div className="chamfer-card bg-[#0e1017] border border-[#22283a] p-2 flex items-center justify-between text-xs font-mono-code select-none">
            <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
              <span>📐 Ancho Columna:</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLeftColumnSpan(3)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  leftColumnSpan === 3
                    ? 'bg-cyan-500 text-black shadow-xs font-bold'
                    : 'bg-[#181d2c] text-slate-400 hover:text-white border border-[#28324a]'
                }`}
                title="Columna izquierda de 3 columnas (Espacio Estándar)"
              >
                3 Cols
              </button>
              <button
                type="button"
                onClick={() => setLeftColumnSpan(4)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  leftColumnSpan === 4
                    ? 'bg-cyan-500 text-black shadow-xs font-bold'
                    : 'bg-[#181d2c] text-slate-400 hover:text-white border border-[#28324a]'
                }`}
                title="Columna izquierda de 4 columnas (Medio)"
              >
                4 Cols
              </button>
              <button
                type="button"
                onClick={() => setLeftColumnSpan(5)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  leftColumnSpan === 5
                    ? 'bg-cyan-500 text-black shadow-xs font-bold'
                    : 'bg-[#181d2c] text-slate-400 hover:text-white border border-[#28324a]'
                }`}
                title="Columna izquierda de 5 columnas (Ancho Máximo)"
              >
                5 Cols
              </button>
            </div>
          </div>

          {leftColumnOrder.map((panelId, idx) => renderLeftPanel(panelId, idx))}
        </div>

        {/* COLUMNA CENTRAL (CONFIGURABLE Y ADAPTABLE AL ANCHO IZQUIERDO Y BANDEJA) */}
        <div
          className={`${getCenterColumnClass()} space-y-4`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (draggedItem && draggedItem.column === 'tray') {
              const draggedPanelId = draggedItem.id as RightPanelId;
              if (!activeCenterModules.includes(draggedPanelId)) {
                setActiveCenterModules((prev) => {
                  const next = [...prev, draggedPanelId];
                  localStorage.setItem(STORAGE_KEY_ACTIVE_CENTER, JSON.stringify(next));
                  return next;
                });
              }
              setDraggedItem(null);
              setDragOverItem(null);
            }
          }}
        >
          {activeCenterModules.length === 0 ||
          (telemetryDockMode === 'floating_pip' && activeCenterModules.length === 1 && activeCenterModules[0] === 'telemetry') ? (
            <div className="p-8 text-center bg-[#10121a] border-2 border-dashed border-[#242b3d] rounded-md space-y-3">
              <div className="text-3xl">🗂️</div>
              <h4 className="font-tech text-sm font-bold text-slate-300 uppercase">Centro de Combate Despejado</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No hay módulos tácticos activos en el centro. Elige un preset táctico o trae módulos desde la Bandeja Táctica a la derecha.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => applyCenterPreset('shooting')}
                  className="px-3 py-1.5 bg-[#182030] hover:bg-cyan-600 hover:text-black text-cyan-300 border border-cyan-500/40 rounded text-xs font-tech font-bold transition-all cursor-pointer"
                >
                  🎯 Esencial Tiro
                </button>
                <button
                  type="button"
                  onClick={() => applyCenterPreset('melee')}
                  className="px-3 py-1.5 bg-[#182030] hover:bg-emerald-600 hover:text-black text-emerald-300 border border-emerald-500/40 rounded text-xs font-tech font-bold transition-all cursor-pointer"
                >
                  🥋 Peleador
                </button>
                <button
                  type="button"
                  onClick={() => applyCenterPreset('netrunner')}
                  className="px-3 py-1.5 bg-[#182030] hover:bg-purple-600 hover:text-white text-purple-300 border border-purple-500/40 rounded text-xs font-tech font-bold transition-all cursor-pointer"
                >
                  ⚡ Netrunner
                </button>
                <button
                  type="button"
                  onClick={() => applyCenterPreset('all')}
                  className="px-3 py-1.5 bg-[#182030] hover:bg-white hover:text-black text-white border border-[#3b435c] rounded text-xs font-tech font-bold transition-all cursor-pointer"
                >
                  🌌 Todo en Centro
                </button>
              </div>
            </div>
          ) : telemetryDockMode === 'split_sticky' && activeCenterModules.includes('telemetry') ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-5 sticky top-3 space-y-4">
                {renderRightPanel('telemetry', activeCenterModules.indexOf('telemetry'))}
              </div>
              <div className="lg:col-span-7 space-y-4">
                {activeCenterModules
                  .filter((id) => id !== 'telemetry')
                  .map((panelId) => renderRightPanel(panelId, activeCenterModules.indexOf(panelId)))}
              </div>
            </div>
          ) : telemetryDockMode === 'floating_pip' ? (
            <div className="space-y-4">
              {activeCenterModules
                .filter((id) => id !== 'telemetry')
                .map((panelId) => renderRightPanel(panelId, activeCenterModules.indexOf(panelId)))}
            </div>
          ) : (
            <div className="space-y-4">
              {activeCenterModules.map((panelId) => renderRightPanel(panelId, activeCenterModules.indexOf(panelId)))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: BANDEJA DE MÓDULOS TÁCTICOS */}
        {isRightTrayCollapsed ? (
          <div className="xl:col-span-1 sticky top-3">
            <div className="chamfer-card bg-[#0e1017] border border-[#22283a] p-2 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setIsRightTrayCollapsed(false)}
                className="p-1.5 rounded bg-[#171a26] hover:bg-cyan-500 hover:text-black text-cyan-400 border border-[#2b334a] transition-all cursor-pointer"
                title="Expandir Bandeja de Módulos Tácticos"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <div className="[writing-mode:vertical-lr] text-xs font-tech font-bold uppercase tracking-wider text-slate-400 py-2 select-none">
                🗂️ MÓDULOS ({activeCenterModules.length}/7)
              </div>
              <div className="flex flex-col gap-1.5 w-full pt-2 border-t border-[#1d2334]">
                {RIGHT_MODULES_METADATA.map((mod) => {
                  const isActive = activeCenterModules.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => toggleCenterModule(mod.id)}
                      className={`w-8 h-8 mx-auto rounded flex items-center justify-center text-xs transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-[#141724] border-[#22283a] text-slate-500 hover:text-white'
                      }`}
                      title={`${mod.title} (${isActive ? 'En Centro' : 'En Bandeja'})`}
                    >
                      {mod.icon}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="xl:col-span-3 sticky top-3 space-y-3">
            {/* Header de la Bandeja */}
            <div className="chamfer-card p-3 bg-[#0e1017] border border-[#22283a] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-tech text-xs font-bold text-white uppercase tracking-wider truncate">
                    🗂️ MÓDULOS TÁCTICOS
                  </span>
                  <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-600/40 shrink-0">
                    {activeCenterModules.length}/7
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowRightModulesFilter(!showRightModulesFilter)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code transition-colors cursor-pointer border ${
                      disabledRightModules.length > 0
                        ? 'bg-red-950/80 text-red-300 border-red-500/60 font-bold'
                        : 'bg-[#161a26] hover:bg-[#252c3e] text-slate-400 hover:text-white border-[#2b334a]'
                    }`}
                    title="Filtro de decluttering: Ocultar o mostrar módulos de la bandeja derecha"
                  >
                    ⚙️ Filtro {disabledRightModules.length > 0 ? `(${disabledRightModules.length} OFF)` : ''}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRightTrayCollapsed(true)}
                    className="p-1 rounded bg-[#161a26] hover:bg-[#252c3e] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Plegar a barra delgada"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Panel de Filtro de Decluttering */}
              {showRightModulesFilter && (
                <div className="p-2.5 bg-[#0a0c13] border border-cyan-500/40 rounded space-y-1.5 text-[10px] font-mono-code animate-fade-in">
                  <div className="flex items-center justify-between text-slate-300 font-bold pb-1 border-b border-[#1f2538]">
                    <span>👁️ VISIBILIDAD DE MÓDULOS</span>
                    {disabledRightModules.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setDisabledRightModules([]);
                          localStorage.setItem(STORAGE_KEY_DISABLED_RIGHT_MODULES, JSON.stringify([]));
                        }}
                        className="text-[9px] text-cyan-400 hover:underline cursor-pointer"
                      >
                        Mostrar Todos
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {RIGHT_MODULES_METADATA.map((m) => {
                      const isHidden = disabledRightModules.includes(m.id);
                      return (
                        <div key={m.id} className="flex items-center justify-between py-0.5">
                          <span className={isHidden ? 'text-slate-500 line-through' : 'text-white'}>
                            {m.shortTitle}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleDisableRightModule(m.id)}
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                              isHidden
                                ? 'bg-red-950/60 text-red-400 border-red-500/50'
                                : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50'
                            }`}
                          >
                            {isHidden ? 'Oculto' : 'Visible'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Botones de Preset 1-Click */}
              <div className="space-y-1">
                <div className="text-[9px] font-mono-code text-slate-400 font-bold uppercase">
                  Presets Rápidos:
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] font-tech font-bold">
                  <button
                    type="button"
                    onClick={() => applyCenterPreset('shooting')}
                    className="py-1 px-1.5 bg-[#141926] hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-500/30 rounded transition-colors cursor-pointer truncate text-left"
                    title="Activa: Telemetría, Armas en Mano, Telémetro"
                  >
                    🎯 ESENCIAL TIRO
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCenterPreset('melee')}
                    className="py-1 px-1.5 bg-[#141926] hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/30 rounded transition-colors cursor-pointer truncate text-left"
                    title="Activa: Telemetría, En Mano, Dojo de Artes Marciales"
                  >
                    🥋 PELEADOR
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCenterPreset('netrunner')}
                    className="py-1 px-1.5 bg-[#141926] hover:bg-purple-500 hover:text-white text-purple-300 border border-purple-500/30 rounded transition-colors cursor-pointer truncate text-left"
                    title="Activa: Telemetría, Quickhacks 2077, En Mano"
                  >
                    ⚡ NETRUNNER
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCenterPreset('all')}
                    className="py-1 px-1.5 bg-[#141926] hover:bg-white hover:text-black text-slate-300 border border-[#2b334a] rounded transition-colors cursor-pointer truncate text-left"
                    title="Activa todos los 7 módulos en el centro"
                  >
                    🌌 TODO EN CENTRO
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => applyCenterPreset('clean')}
                  className="w-full py-0.5 px-2 bg-[#12141c] hover:bg-red-950/60 hover:text-red-300 text-slate-400 border border-[#242838] hover:border-red-600/40 rounded text-[9px] font-mono-code transition-colors cursor-pointer"
                  title="Despeja el centro dejando solo armas en mano"
                >
                  🧹 Limpiar Centro
                </button>
              </div>

              {/* Zona de Drop para Desactivar Módulos Arrastrados */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsTrayDragOver(true);
                }}
                onDragLeave={() => setIsTrayDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedItem && (draggedItem.column === 'right' || draggedItem.column === 'tray')) {
                    sendModuleToTray(draggedItem.id as RightPanelId);
                  }
                  setDraggedItem(null);
                  setDragOverItem(null);
                  setIsTrayDragOver(false);
                }}
                className={`p-2 rounded border-2 border-dashed text-center text-[10px] font-tech uppercase tracking-wider transition-all select-none ${
                  isTrayDragOver
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300 scale-[1.02]'
                    : 'bg-[#0a0c13] border-[#22283a] text-slate-500 hover:border-slate-500 hover:text-slate-400'
                }`}
              >
                <span>{isTrayDragOver ? '📥 SOLTAR AQUÍ PARA BANDEJA' : '📥 ARRASTRA AQUÍ PARA DESACTIVAR'}</span>
              </div>
            </div>

            {/* Lista de las 7 Tarjetas de Módulo */}
            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {RIGHT_MODULES_METADATA.map((mod) => {
                const isActive = activeCenterModules.includes(mod.id);
                const isPreviewing = sidePreviewModule === mod.id;
                const isModuleDisabled = disabledRightModules.includes(mod.id);

                return (
                  <div
                    key={mod.id}
                    draggable
                    onDragStart={() => handleDragStart('tray', mod.id)}
                    className={`chamfer-card p-2.5 rounded transition-all ${
                      isModuleDisabled
                        ? 'opacity-40 bg-[#0a0b10] border border-red-950 hover:opacity-75'
                        : isActive
                        ? 'bg-[#121522] border border-cyan-500/40 shadow-sm'
                        : 'bg-[#0d0f16] border border-[#1f2434] hover:border-[#2f374e] opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          title="Arrastra este módulo al Centro"
                          className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-cyan-400 shrink-0"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </span>
                        <span className="shrink-0">{mod.icon}</span>
                        <span className="font-tech text-xs font-bold text-white truncate uppercase">
                          {mod.shortTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleDisableRightModule(mod.id)}
                          className={`p-0.5 rounded transition-colors cursor-pointer border ${
                            isModuleDisabled
                              ? 'bg-red-950/80 text-red-400 border-red-500/50'
                              : 'bg-[#141724] text-slate-400 hover:text-white border-[#242b3e]'
                          }`}
                          title={isModuleDisabled ? 'Módulo silenciado / oculto. Clic para reactivar.' : 'Silenciar módulo (clutter filter)'}
                        >
                          {isModuleDisabled ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <span
                          className={`text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            isModuleDisabled
                              ? 'bg-red-950/60 text-red-400 border border-red-500/40'
                              : isActive
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/50'
                              : 'bg-[#161a24] text-slate-500 border border-[#232838]'
                          }`}
                        >
                          {isModuleDisabled ? '🚫 SILENCIADO' : isActive ? '✅ CENTRO' : '💤 BANDEJA'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono-code text-slate-400 mb-1.5 truncate">
                      {mod.getSummary()}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleCenterModule(mod.id)}
                        className={`flex-1 py-1 px-2 rounded text-[10px] font-tech font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                          isActive
                            ? 'bg-[#181d2a] hover:bg-amber-950/80 hover:text-amber-300 hover:border-amber-600/50 text-cyan-300 border-cyan-500/30'
                            : 'bg-[#182030] hover:bg-cyan-500 hover:text-black text-slate-300 border-[#2b354d]'
                        }`}
                      >
                        {isActive ? '➡️ A BANDEJA' : '➕ AL CENTRO'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSidePreviewModule(isPreviewing ? null : mod.id)}
                        className={`py-1 px-2 rounded text-[10px] font-mono-code transition-all cursor-pointer border ${
                          isPreviewing
                            ? 'bg-amber-500 text-black font-bold border-amber-400'
                            : 'bg-[#141724] text-slate-400 hover:text-white border-[#242b3e]'
                        }`}
                        title="Abrir vista previa lateral interactiva en este panel sin mandarlo al centro"
                      >
                        {isPreviewing ? '✖ VISTA' : '👁️ VISTA'}
                      </button>
                    </div>

                    {/* Vista previa lateral interactiva */}
                    {isPreviewing && (
                      <div className="mt-2.5 pt-2 border-t border-[#20273a] animate-fade-in">
                        <div className="flex items-center justify-between text-[10px] font-mono-code text-amber-400 font-bold mb-1.5">
                          <span>👁️ VISTA PREVIA LATERAL:</span>
                          <button
                            type="button"
                            onClick={() => setSidePreviewModule(null)}
                            className="text-slate-400 hover:text-white text-[9px] hover:underline cursor-pointer"
                          >
                            Cerrar [✕]
                          </button>
                        </div>
                        {renderRightPanel(mod.id, 0, false, true)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sub-sección de Resumen de Soporte & Vitales */}
            <div className="chamfer-card bg-[#0b0d14] border border-[#1f2536] p-2.5 rounded space-y-1.5">
              <div className="text-[10px] font-tech font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-[#1b2130] pb-1">
                <span>VITALES & DEFENSAS</span>
                <span className="text-[9px] font-mono-code text-emerald-400">EN VIVO</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono-code">
                <div className="bg-[#121520] p-1.5 rounded border border-[#1e2538] flex items-center justify-between">
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-400" /> HP
                  </span>
                  <span className="font-bold text-white">
                    {activeChar?.currentHp ?? 0}/{maxHp}
                  </span>
                </div>
                <div className="bg-[#121520] p-1.5 rounded border border-[#1e2538] flex items-center justify-between">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-amber-400" /> SP
                  </span>
                  <span className="font-bold text-white">
                    C:{activeChar?.headArmor?.currentSp ?? 0} | T:{activeChar?.bodyArmor?.currentSp ?? 0}
                  </span>
                </div>
                <div className="bg-[#121520] p-1.5 rounded border border-[#1e2538] flex items-center justify-between">
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Dices className="w-3 h-3 text-cyan-400" /> LUCK
                  </span>
                  <span className="font-bold text-white">
                    {activeChar?.currentLuck ?? activeChar?.stats?.LUCK ?? 0}/{activeChar?.stats?.LUCK ?? 0}
                  </span>
                </div>
                <div className="bg-[#121520] p-1.5 rounded border border-[#1e2538] flex items-center justify-between">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3 text-rose-400" /> HERIDAS
                  </span>
                  <span className={`font-bold ${activeChar?.activeInjuries?.length ? 'text-red-400' : 'text-slate-400'}`}>
                    {activeChar?.activeInjuries?.length ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL / PIP FLOTANTE PARA TELEMETRÍA SI ESTÁ EN MODO FLOATING_PIP */}
      {telemetryDockMode === 'floating_pip' && (
        <div
          style={{
            left: floatingPos?.x !== undefined ? `${floatingPos.x}px` : undefined,
            top: floatingPos?.y !== undefined ? `${floatingPos.y}px` : undefined,
            right: floatingPos ? undefined : '1rem',
            bottom: floatingPos ? undefined : '1rem',
            width: `${telemetryWidth}px`
          }}
          className="fixed max-w-[calc(100vw-2rem)] z-50 shadow-2xl border-2 border-cyan-400/80 bg-[#0e1017]/95 backdrop-blur-md rounded-md overflow-hidden animate-fade-in"
        >
          {renderRightPanel('telemetry', 0, true)}
        </div>
      )}
    </div>
  );
};
