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
  AMMO_TYPE_CATALOG
} from '../../engine/characterEngine';
import { 
  createInitialAttackRoll, 
  createDamageRoll 
} from '../../engine/combatEngine';
import type { WeaponItem, RollEntry } from '../../types/cyberpunk';
import coreData from '../../data/core-rules.cprpack.json';
import { ItemVisualPlaceholder } from '../../components/ItemVisualPlaceholder';
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
  Swords
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
  const useOrInjectDrug = useCharacterStore((state) => state.useOrInjectDrug);
  const removeActiveDrug = useCharacterStore((state) => state.removeActiveDrug);
  const equipWeaponFromCatalog = useCharacterStore((state) => state.equipWeaponFromCatalog);
  const inflictRandomInjury = useCharacterStore((state) => state.inflictRandomInjury);
  const toggleTreatInjury = useCharacterStore((state) => state.toggleTreatInjury);
  const removeInjury = useCharacterStore((state) => state.removeInjury);

  const selectedDistance = useCombatStore((state) => state.selectedDistance);
  const setSelectedDistance = useCombatStore((state) => state.setSelectedDistance);
  const autofireByWeapon = useCombatStore((state) => state.autofireByWeapon);
  const toggleWeaponAutofire = useCombatStore((state) => state.toggleWeaponAutofire);
  const luckToSpendOnNextRoll = useCombatStore((state) => state.luckToSpendOnNextRoll);
  const setLuckToSpend = useCombatStore((state) => state.setLuckToSpend);
  const rollHistory = useCombatStore((state) => state.rollHistory);
  const addRollEntry = useCombatStore((state) => state.addRollEntry);
  const triggerExplosionClick = useCombatStore((state) => state.triggerExplosionClick);
  const markAttackDamageRolled = useCombatStore((state) => state.markAttackDamageRolled);
  const clearRollHistory = useCombatStore((state) => state.clearRollHistory);

  // Local state
  const [incomingDamageInput, setIncomingDamageInput] = useState<number>(10);
  const [damageFeedback, setDamageFeedback] = useState<string | null>(null);
  const [rackFilter, setRackFilter] = useState<'all' | 'weapons' | 'unarmed' | 'throwables' | 'drugs'>('all');
  const [selectedCatalogWeaponId, setSelectedCatalogWeaponId] = useState<string>(
    coreData.weapons?.[0]?.id || ''
  );

  // Calculations for Active Character
  const maxHp = calculateMaxHp(activeChar?.stats?.BODY ?? 6, activeChar?.stats?.WILL ?? 6);
  const seriousWoundThresh = calculateSeriouslyWoundedThreshold(maxHp);
  const isSeriouslyWounded = (activeChar?.currentHp ?? 0) < seriousWoundThresh;
  const isMortallyWounded = (activeChar?.currentHp ?? 0) <= 0;
  const unarmedDmg = calculateUnarmedDamage(activeChar?.stats?.BODY ?? 6);

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
      weaponInstanceId: instanceId
    });

    addRollEntry(entry);
  };

  // Handle Step 2: Damage Roll (Xd6)
  const handleDamageClick = (weapon: WeaponItem, instanceId: string) => {
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
      instanceId
    );

    if (recentHit) {
      markAttackDamageRolled(recentHit.id);
    }

    addRollEntry(dmgEntry);
  };

  // Unarmed: Brawling attack
  const handleBrawlingAttack = () => {
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
      weaponInstanceId: 'unarmed-brawling'
    });
    addRollEntry(entry);
  };

  // Unarmed: Brawling damage
  const handleBrawlingDamage = () => {
    const dmgEntry = createDamageRoll('Puños (Brawling)', unarmedDmg, false, 1, 'unarmed-brawling');
    addRollEntry(dmgEntry);
  };

  // Unarmed: Grapple maneuver
  const handleGrapple = () => {
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
      weaponInstanceId: 'unarmed-martial-arts'
    });
    addRollEntry(entry);
  };

  // Unarmed: Martial Arts damage
  const handleMartialArtsDamage = () => {
    const dmgEntry = createDamageRoll('Artes Marciales (Ignora 50% SP)', unarmedDmg, false, 1, 'unarmed-martial-arts');
    addRollEntry(dmgEntry);
  };

  // Throw grenade action
  const handleThrowGrenade = (grenade: typeof TACTICAL_GRENADES[number]) => {
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

  // Drug actions
  const handleInjectDrug = (drug: any) => {
    useOrInjectDrug({
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
      
      {/* =========================================================
          COLUMNA IZQUIERDA (3 COLS): BIOMONITOR, SP, LUCK, DROGAS ACTIVAS, CRITS
      ========================================================= */}
      <div className="xl:col-span-3 space-y-4">
        
        {/* Vitals, HP & Ballistic Matrix */}
        <div className="chamfer-card p-4 bg-[#121319] border border-[#232736]">
          
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#1f2230]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#dc2626]" />
              <span className="font-tech text-xs font-bold tracking-wider text-white uppercase">
                BIOMONITOR & VITALES
              </span>
            </div>
            {isSeriouslyWounded && (
              <span className="bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#dc2626] font-mono-code text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 animate-pulse">
                <Flame className="w-3 h-3" /> GRAVE (-2)
              </span>
            )}
          </div>

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

          {/* Armor Plates */}
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

          {/* Mini-Calculadora: Recibir Impacto Balístico */}
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

        {/* Luck Pool & Investment Selector */}
        <div className="chamfer-card p-4 bg-[#121319] border border-[#232736]">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#1f2230]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span className="font-tech text-xs font-bold tracking-wider text-white uppercase">
                SUERTE (LUCK)
              </span>
            </div>
            <button
              onClick={restoreLuck}
              className="text-[10px] text-[#64748b] hover:text-[#10b981] flex items-center gap-1 font-mono-code transition-colors"
              title="Restablecer Suerte a Stat Máximo"
            >
              <RefreshCw className="w-2.5 h-2.5" /> Restaurar
            </button>
          </div>

          {/* Interactive Luck Pips */}
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

          {/* Selector de Suerte para Próximo Tiro */}
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

        {/* Drogas en Sangre Activas (si existen) */}
        {(activeChar?.activeDrugs || []).length > 0 && (
          <div className="chamfer-card p-3.5 bg-[#17141f] border border-[#a855f7]/40 shadow-sm shadow-[#a855f7]/10">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#a855f7]/30">
              <div className="flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-[#c084fc]" />
                <span className="font-tech text-xs font-bold text-[#e9d5ff] uppercase tracking-wide">
                  DROGAS ACTIVAS ({activeChar.activeDrugs!.length})
                </span>
              </div>
            </div>
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
          </div>
        )}

        {/* Critical Injuries Console */}
        <div className="chamfer-card p-4 bg-[#121319] border border-[#232736]">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#1f2230]">
            <div className="flex items-center gap-1.5">
              <Skull className="w-3.5 h-3.5 text-[#dc2626]" />
              <span className="font-tech text-xs font-bold tracking-wider text-white uppercase">
                HERIDAS CRÍTICAS ({activeChar?.activeInjuries?.length ?? 0})
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => inflictRandomInjury('head')}
                className="px-1.5 py-0.5 bg-[#23181d] hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/40 rounded-xs font-mono-code text-[9px] font-bold transition-all"
              >
                + CABEZA
              </button>
              <button
                onClick={() => inflictRandomInjury('body')}
                className="px-1.5 py-0.5 bg-[#211f17] hover:bg-[#f59e0b] hover:text-black text-[#f59e0b] border border-[#f59e0b]/40 rounded-xs font-mono-code text-[9px] font-bold transition-all"
              >
                + CUERPO
              </button>
            </div>
          </div>

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
        </div>

      </div>

      {/* =========================================================
          COLUMNA CENTRAL (5 COLS): TELÉMETRO, ESTACIÓN "EN MANO", LOG DE TELEMETRÍA
      ========================================================= */}
      <div className="xl:col-span-5 space-y-4">
        
        {/* Telémetro Selector de Distancia */}
        <div className="chamfer-card p-3.5 bg-[#121319] border border-[#232736]">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#1f2230]">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#f59e0b]" />
              <span className="font-tech text-xs font-bold tracking-wider text-white uppercase">
                TELÉMETRO DE DISTANCIA
              </span>
            </div>
            <span className="text-xs font-mono-code text-[#38bdf8]">
              DISTANCIA: <span className="font-bold text-white bg-[#1e2334] px-2 py-0.5 rounded">{selectedDistance}</span>
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
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
        </div>

        {/* =======================================================
            ESTACIÓN DE ATAQUE "EN MANO" (LISTO PARA ATACAR)
        ======================================================= */}
        <div className="space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <span className="font-tech text-xs font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" /> ESTACIÓN DE ATAQUE "EN MANO"
            </span>
            <span className="text-[10px] font-mono-code text-[#64748b]">
              {inHandWeapons.length + (isBrawlingInHand ? 1 : 0) + (isMartialArtsInHand ? 1 : 0)} ATAQUES LISTOS
            </span>
          </div>

          {!hasAnyInHandAttack && (
            <div className="chamfer-card p-6 text-center text-[#64748b] font-mono-code text-xs bg-[#121319] border border-[#232736]">
              No hay armas ni ataques seleccionados "En Mano".<br />
              Usa el <strong>Rack Táctico de la derecha</strong> para poner armas o puños en mano.
            </div>
          )}

          {/* Tarjetas de Armas En Mano */}
          {inHandWeapons.map((w) => {
            const isRanged = w.type === 'Ranged';
            const isAuto = !!autofireByWeapon[w.instanceId];
            const autofireRules = getAutofireRulesSummary(w);
            const breakdown = calculateWeaponAttackBreakdown(activeChar, w, isAuto);
            const currentDv = getDvForWeapon(w, selectedDistance, isAuto);
            const profileKey = getWeaponProfileKey(w.name, w.type);
            const profile = profileKey ? WEAPON_RANGE_PROFILES[profileKey] : null;
            const placeholderType = getItemPlaceholderType(w);
            const isOutOfAmmo = isRanged && (w.currentMag ?? 0) <= 0;
            const netBaseWithLuck = breakdown.netBase + luckToSpendOnNextRoll;
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

            return (
              <div
                key={w.instanceId}
                className="chamfer-card p-4 bg-[#141620] border border-[#38bdf8]/40 shadow-sm shadow-[#38bdf8]/10 transition-all"
              >
                {/* Header de la tarjeta */}
                <div className="flex items-start gap-3 mb-3">
                  <ItemVisualPlaceholder type={placeholderType} size="md" />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-tech text-base font-bold text-white tracking-wide">
                            {w.name}
                          </span>
                          <span className="bg-[#38bdf8]/20 border border-[#38bdf8]/50 text-[#38bdf8] text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs">
                            EN MANO
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono-code text-[#94a3b8] mt-0.5">
                          <span>{w.damage} DAÑO</span>
                          <span>•</span>
                          <TacticalTooltip term="ROF"><span>ROF {w.rof}</span></TacticalTooltip>
                          <span>•</span>
                          <span className="text-[#38bdf8]">{breakdown.skillLabel}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleWeaponInHand(w.instanceId)}
                        className="text-[10px] font-mono-code text-[#94a3b8] hover:text-[#f87171] border border-[#2b334a] hover:border-[#dc2626] px-2 py-0.5 rounded-xs transition-colors"
                        title="Quitar arma de la mano lista"
                      >
                        Quitar de Mano
                      </button>
                    </div>

                    {/* Ficha técnica del arma: Píldoras */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold">
                        {w.damage}
                      </span>
                      <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-2 py-0.5 rounded-xs text-[10px] font-mono-code">
                        <TacticalTooltip term="ROF">ROF {w.rof}</TacticalTooltip>
                      </span>
                      <span className="bg-[#1b1f2e] text-[#cbd5e1] border border-[#272e42] px-2 py-0.5 rounded-xs text-[10px] font-mono-code">
                        <TacticalTooltip term="HANDS">{w.hands || 1}H</TacticalTooltip>
                      </span>
                      <span className="bg-[#1b1f2e] text-[#94a3b8] border border-[#272e42] px-2 py-0.5 rounded-xs text-[10px] font-mono-code">
                        {w.concealable ? 'Ocultable' : 'No Ocultable'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Panel Completo de Munición y Cargador con Cartuchos Individuales */}
                {isRanged && (w.standardMag ?? 0) > 0 && (
                  <div className="mb-3 space-y-2">
                    <AmmoCartridgeVisualizer
                      currentMag={w.currentMag ?? 0}
                      standardMag={w.standardMag ?? 0}
                      reserveAmmo={w.reserveAmmo ?? 36}
                      onAdjustMag={(delta) => adjustWeaponMag(w.instanceId, delta)}
                      onAdjustReserve={(delta) => adjustWeaponReserveAmmo(w.instanceId, delta)}
                      onReload={() => reloadWeapon(w.instanceId)}
                    />

                    {/* Selector de Tipo de Munición Cargada */}
                    <div className="bg-[#10121a] p-2.5 rounded border border-[#22283a]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono-code text-[#64748b] uppercase">TIPO DE BALA:</span>
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
                        <div className="text-[10px] font-mono-code text-[#38bdf8] mt-1 bg-[#131b26] p-1.5 rounded border border-[#1f2f45]">
                          💡 {selectedAmmoMeta.shortRule}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fórmula en vivo de la Base de Ataque */}
                <div className="bg-[#101218] p-2 rounded border border-[#1f2434] text-xs font-mono-code flex flex-wrap items-center justify-between gap-2 mb-3">
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
                    BASE TOTAL: <span className="text-[#10b981]">{netBaseWithLuck}</span>
                  </div>
                </div>

                {/* Escalera de Distancias DV */}
                {isRanged && profile && (
                  <div className="mb-3">
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
                )}

                {/* Bloque de Reglas y Toggle de Autofire */}
                {autofireRules.supportsAutofire && (
                  <div className="mb-3 bg-[#181926] p-2.5 rounded border border-[#26283e]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-tech text-xs font-bold text-[#f59e0b] uppercase flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#f59e0b]" /> FUEGO AUTOMÁTICO (AUTOFIRE)
                      </span>
                      <button
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
                      <div><strong className="text-[#64748b]">Habilidad:</strong> {autofireRules.skillUsed} | <strong className="text-[#64748b]">Costo:</strong> {autofireRules.ammoCost} balas</div>
                      <div className="text-[#f59e0b]">{autofireRules.damageRule}</div>
                    </div>
                  </div>
                )}

                {/* Dos Botones de Acción */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#1f2334]">
                  <button
                    disabled={isOutOfAmmo || (currentDv === null && w.type !== 'Melee')}
                    onClick={() => handleAttackClick(w, w.instanceId)}
                    className={`py-2 px-3 font-tech font-bold tracking-wider text-xs chamfer-btn transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                      isOutOfAmmo || (currentDv === null && w.type !== 'Melee')
                        ? 'bg-[#1e212c] text-[#64748b] cursor-not-allowed border border-[#282d3e]'
                        : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-md shadow-[#dc2626]/20'
                    }`}
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>1. ATACAR 1d10 ({w.type === 'Melee' ? 'DV 13' : currentDv !== null ? `DV ${currentDv}` : 'Fuera Rango'})</span>
                  </button>

                  <button
                    onClick={() => handleDamageClick(w, w.instanceId)}
                    className="py-2 px-3 bg-[#1d2232] hover:bg-[#252c42] hover:border-[#38bdf8] border border-[#2a3248] text-[#38bdf8] font-tech font-bold tracking-wider text-xs chamfer-btn transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Dices className="w-4 h-4" />
                    <span>2. TIRAR DAÑO ({isAuto ? '2d6 × Autofire' : w.damage})</span>
                  </button>
                </div>

              </div>
            );
          })}

          {/* Tarjeta de Puños / Brawling En Mano */}
          {isBrawlingInHand && (
            <div className="chamfer-card p-4 bg-[#141620] border border-[#f59e0b]/40 shadow-sm shadow-[#f59e0b]/10 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-base font-bold text-white tracking-wide">
                      🥊 Puños & Pelea Desarmada (Brawling)
                    </span>
                    <span className="bg-[#f59e0b]/20 border border-[#f59e0b]/50 text-[#f59e0b] text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs">
                      EN MANO
                    </span>
                  </div>
                  <div className="text-xs font-mono-code text-[#94a3b8] mt-0.5">
                    Daño: <strong className="text-white">{unarmedDmg}</strong> (según BODY {activeChar?.stats?.BODY ?? 6}) • ROF 2 • Habilidad: DEX + Brawling
                  </div>
                </div>
                <button
                  onClick={() => toggleUnarmedInHand('brawling')}
                  className="text-[10px] font-mono-code text-[#94a3b8] hover:text-[#f87171] border border-[#2b334a] hover:border-[#dc2626] px-2 py-0.5 rounded-xs transition-colors"
                >
                  Quitar de Mano
                </button>
              </div>

              <div className="bg-[#101218] p-2 rounded border border-[#1f2434] text-xs font-mono-code flex items-center justify-between mb-3">
                <span className="text-[#94a3b8]">
                  Base: DEX ({activeChar?.stats?.DEX ?? 6}) + Brawling ({activeChar?.skills?.brawling ?? 0})
                  {luckToSpendOnNextRoll > 0 && <span className="text-[#f59e0b]"> + Luck ({luckToSpendOnNextRoll})</span>}
                </span>
                <span className="text-white font-bold bg-[#1a2030] px-2 py-0.5 rounded border border-[#2b344c]">
                  TOTAL: <span className="text-[#10b981]">{(activeChar?.stats?.DEX ?? 6) + (activeChar?.skills?.brawling ?? 0) + luckToSpendOnNextRoll}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={handleBrawlingAttack}
                  className="py-1.5 px-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1 shadow-sm"
                >
                  <Crosshair className="w-3.5 h-3.5" /> 1. ATACAR (DV 13)
                </button>
                <button
                  onClick={handleBrawlingDamage}
                  className="py-1.5 px-2 bg-[#1d2232] hover:bg-[#252c42] border border-[#2a3248] text-[#38bdf8] font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1"
                >
                  <Dices className="w-3.5 h-3.5" /> 2. DAÑO ({unarmedDmg})
                </button>
                <button
                  onClick={handleGrapple}
                  className="py-1.5 px-2 bg-[#2a1e16] hover:bg-[#f59e0b] hover:text-black border border-[#52351c] text-[#f59e0b] font-tech font-bold text-[11px] tracking-wider rounded-xs flex items-center justify-center gap-1 transition-all"
                  title="Inmovilizar al rival en presa enfrentada"
                >
                  🤼 GRAPPLE
                </button>
                <button
                  onClick={handleChoke}
                  className="py-1.5 px-2 bg-[#25151c] hover:bg-[#dc2626] hover:text-white border border-[#4a1c29] text-[#f43f5e] font-tech font-bold text-[11px] tracking-wider rounded-xs flex items-center justify-center gap-1 transition-all"
                  title={`Ahorcar: ${activeChar?.stats?.BODY ?? 6} HP directos ignorando SP`}
                >
                  <Skull className="w-3.5 h-3.5" /> CHOKE ({activeChar?.stats?.BODY ?? 6} HP)
                </button>
              </div>
            </div>
          )}

          {/* Tarjeta de Artes Marciales En Mano */}
          {isMartialArtsInHand && (
            <div className="chamfer-card p-4 bg-[#141620] border border-[#10b981]/40 shadow-sm shadow-[#10b981]/10 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-base font-bold text-white tracking-wide">
                      🥋 Artes Marciales (Martial Arts)
                    </span>
                    <span className="bg-[#10b981]/20 border border-[#10b981]/50 text-[#10b981] text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded-xs">
                      IGNORA 50% SP
                    </span>
                  </div>
                  <div className="text-xs font-mono-code text-[#94a3b8] mt-0.5">
                    Daño: <strong className="text-white">{unarmedDmg}</strong> • ROF 2 • Habilidad: DEX + Martial Arts (x2)
                  </div>
                </div>
                <button
                  onClick={() => toggleUnarmedInHand('martialArts')}
                  className="text-[10px] font-mono-code text-[#94a3b8] hover:text-[#f87171] border border-[#2b334a] hover:border-[#dc2626] px-2 py-0.5 rounded-xs transition-colors"
                >
                  Quitar de Mano
                </button>
              </div>

              <div className="bg-[#101218] p-2 rounded border border-[#1f2434] text-xs font-mono-code flex items-center justify-between mb-3">
                <span className="text-[#94a3b8]">
                  Base: DEX ({activeChar?.stats?.DEX ?? 6}) + Martial Arts ({activeChar?.skills?.martialArts ?? 0})
                  {luckToSpendOnNextRoll > 0 && <span className="text-[#f59e0b]"> + Luck ({luckToSpendOnNextRoll})</span>}
                </span>
                <span className="text-white font-bold bg-[#1a2030] px-2 py-0.5 rounded border border-[#2b344c]">
                  TOTAL: <span className="text-[#10b981]">{(activeChar?.stats?.DEX ?? 6) + (activeChar?.skills?.martialArts ?? 0) + luckToSpendOnNextRoll}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleMartialArtsAttack}
                  className="py-1.5 px-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1 shadow-sm"
                >
                  <Crosshair className="w-3.5 h-3.5" /> 1. ATACAR 1d10 (DV 13)
                </button>
                <button
                  onClick={handleMartialArtsDamage}
                  className="py-1.5 px-2 bg-[#1d2232] hover:bg-[#252c42] border border-[#2a3248] text-[#10b981] font-tech font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-1"
                >
                  <Dices className="w-3.5 h-3.5" /> 2. DAÑO ({unarmedDmg})
                </button>
              </div>
            </div>
          )}

        </div>

        {/* =======================================================
            CONSOLA DE TELEMETRÍA (LOG DE TIRADAS)
        ======================================================= */}
        <div className="chamfer-card p-4 bg-[#121319] border border-[#232736]">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1f2230]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#38bdf8]" />
              <span className="font-tech text-xs font-bold tracking-wider text-white uppercase">
                CONSOLA DE TELEMETRÍA (LOG DE TIRADAS)
              </span>
            </div>
            {rollHistory.length > 0 && (
              <button
                onClick={clearRollHistory}
                className="text-[10px] font-mono-code text-[#64748b] hover:text-[#dc2626] transition-colors"
              >
                LIMPIAR
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
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
                              entry.weaponInstanceId
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
                    </div>
                  )}

                  <div className="text-[8px] font-mono-code text-[#64748b] mt-1 text-right">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* =========================================================
          COLUMNA DERECHA (4 COLS): RACK TÁCTICO DE FORMAS DE ATACAR & ÍTEMS ACTIVOS
      ========================================================= */}
      <div className="xl:col-span-4 space-y-4">
        
        <div className="chamfer-card p-4 bg-[#121319] border border-[#232736]">
          
          {/* Header del Rack */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1f2230]">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-[#38bdf8]" />
              <span className="font-tech text-xs font-bold tracking-wider text-white uppercase">
                RACK TÁCTICO & ACCIONES
              </span>
            </div>
          </div>

          {/* Filtros Rápidos */}
          <div className="flex flex-wrap gap-1 mb-3">
            {[
              { id: 'all', label: 'TODO' },
              { id: 'weapons', label: '🔫 ARMAS' },
              { id: 'unarmed', label: '🥊 PUÑOS/ARTES' },
              { id: 'throwables', label: '💣 ARROJABLES' },
              { id: 'drugs', label: '💉 DROGAS' }
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
                <div className="flex items-center justify-between">
                  <span className="font-tech text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    🔫 ARMAS EQUIPADAS ({activeChar?.equippedWeapons?.length ?? 0})
                  </span>
                </div>

                {/* Lista de armas */}
                {(activeChar?.equippedWeapons || []).map((w) => {
                  const isInHand = w.inHand ?? true;
                  return (
                    <div
                      key={w.instanceId}
                      className={`p-2.5 rounded border transition-all ${
                        isInHand
                          ? 'bg-[#121c26] border-[#38bdf8]/50 shadow-xs'
                          : 'bg-[#10121a] border-[#202534] opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-tech text-xs font-bold text-white truncate">
                            {w.name}
                          </div>
                          <div className="text-[10px] font-mono-code text-[#94a3b8] mt-0.5">
                            {w.damage} • ROF {w.rof} • Res: {w.reserveAmmo ?? 36}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleWeaponInHand(w.instanceId)}
                          className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all shrink-0 ${
                            isInHand
                              ? 'bg-[#10b981]/20 hover:bg-[#dc2626] hover:text-white text-[#10b981] border border-[#10b981]/50'
                              : 'bg-[#222534] hover:bg-[#38bdf8] hover:text-black text-white border border-[#2c3246]'
                          }`}
                        >
                          {isInHand ? '✓ EN MANO' : '+ PONER EN MANO'}
                        </button>
                      </div>

                      {/* Mini Tira de Rectángulos de Munición */}
                      {w.type === 'Ranged' && (w.standardMag ?? 0) > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-[#1a1f2e]">
                          <div className="flex items-baseline gap-0.5 text-[10px] font-mono font-bold shrink-0">
                            <span className={(w.currentMag ?? 0) <= 0 ? 'text-[#dc2626]' : (w.currentMag ?? 0) <= (w.standardMag ?? 0) * 0.25 ? 'text-[#f59e0b]' : 'text-[#38bdf8]'}>
                              {w.currentMag ?? 0}
                            </span>
                            <span className="text-slate-600">/{w.standardMag}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-0.5 overflow-hidden max-h-[14px]">
                            {Array.from({ length: Math.min(w.standardMag ?? 0, 40) }).map((_, bIdx) => {
                              const isLoaded = bIdx < (w.currentMag ?? 0);
                              return (
                                <span
                                  key={bIdx}
                                  className={`h-2.5 w-1.5 rounded-2xs transition-all ${
                                    isLoaded
                                      ? (w.currentMag ?? 0) <= (w.standardMag ?? 0) * 0.25
                                        ? 'bg-[#dc2626] border border-[#f87171]/80'
                                        : 'bg-[#38bdf8] border border-[#67e8f9]/80 shadow-[0_0_2px_rgba(56,189,248,0.5)]'
                                      : 'bg-slate-900/60 border border-slate-800/80 opacity-40'
                                  }`}
                                  title={`Bala #${bIdx + 1}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

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
                      className="px-2.5 py-1 bg-[#38bdf8] hover:bg-[#0284c7] text-black font-tech font-bold text-xs rounded transition-all active:scale-95 shrink-0"
                    >
                      + Equipar
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* SECCIÓN 2: PUÑOS & ARTES MARCIALES */}
            {(rackFilter === 'all' || rackFilter === 'unarmed') && (
              <div className="bg-[#151722] p-3 rounded border border-[#252a3c] space-y-2.5">
                <span className="font-tech text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  🥊 PELEA DESARMADA & ARTES
                </span>

                {/* Fila Brawling */}
                <div className={`p-2.5 rounded border transition-all ${
                  isBrawlingInHand ? 'bg-[#1e1a14] border-[#f59e0b]/50' : 'bg-[#10121a] border-[#202534] opacity-80'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-tech text-xs font-bold text-white">Puños (Brawling)</div>
                      <div className="text-[10px] font-mono-code text-[#94a3b8]">
                        Daño: <strong className="text-white">{unarmedDmg}</strong> • ROF 2 • Base: {(activeChar?.stats?.DEX ?? 6) + (activeChar?.skills?.brawling ?? 0)}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleUnarmedInHand('brawling')}
                      className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all shrink-0 ${
                        isBrawlingInHand
                          ? 'bg-[#f59e0b]/20 hover:bg-[#dc2626] hover:text-white text-[#f59e0b] border border-[#f59e0b]/50'
                          : 'bg-[#222534] hover:bg-[#f59e0b] hover:text-black text-white border border-[#2c3246]'
                      }`}
                    >
                      {isBrawlingInHand ? '✓ EN MANO' : '+ PONER EN MANO'}
                    </button>
                  </div>
                </div>

                {/* Fila Martial Arts */}
                <div className={`p-2.5 rounded border transition-all ${
                  isMartialArtsInHand ? 'bg-[#121c18] border-[#10b981]/50' : 'bg-[#10121a] border-[#202534] opacity-80'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-tech text-xs font-bold text-white">Artes Marciales (Martial Arts)</div>
                      <div className="text-[10px] font-mono-code text-[#94a3b8]">
                        Daño: <strong className="text-white">{unarmedDmg}</strong> • Ignora 50% SP • Base: {(activeChar?.stats?.DEX ?? 6) + (activeChar?.skills?.martialArts ?? 0)}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleUnarmedInHand('martialArts')}
                      className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold transition-all shrink-0 ${
                        isMartialArtsInHand
                          ? 'bg-[#10b981]/20 hover:bg-[#dc2626] hover:text-white text-[#10b981] border border-[#10b981]/50'
                          : 'bg-[#222534] hover:bg-[#10b981] hover:text-black text-white border border-[#2c3246]'
                      }`}
                    >
                      {isMartialArtsInHand ? '✓ EN MANO' : '+ PONER EN MANO'}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* SECCIÓN 3: ÍTEMS ARROJABLES & GRANADAS */}
            {(rackFilter === 'all' || rackFilter === 'throwables') && (
              <div className="bg-[#151722] p-3 rounded border border-[#252a3c] space-y-2.5">
                <span className="font-tech text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <Bomb className="w-3.5 h-3.5 text-[#f59e0b]" /> ARROJABLES & GRANADAS TÁCTICAS
                </span>

                <div className="space-y-2">
                  {TACTICAL_GRENADES.map((g) => (
                    <div key={g.id} className="bg-[#10121a] p-2 rounded border border-[#22283a] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-tech text-xs font-bold text-white">{g.name}</span>
                        {g.damage ? (
                          <span className="bg-[#dc2626]/20 text-[#f87171] border border-[#dc2626]/40 px-1.5 py-0.2 rounded text-[9px] font-mono-code font-bold">
                            {g.damage}
                          </span>
                        ) : (
                          <span className="bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 px-1.5 py-0.2 rounded text-[9px] font-mono-code font-bold">
                            TÁCTICA
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono-code text-[#94a3b8] leading-tight">
                        {g.effect}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#1a1e2c]">
                        <button
                          onClick={() => handleThrowGrenade(g)}
                          className="py-1 px-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1"
                        >
                          <Target className="w-3 h-3" /> LANZAR (DV {g.dv})
                        </button>
                        <button
                          onClick={() => handleGrenadeEffect(g)}
                          className="py-1 px-1.5 bg-[#1e2334] hover:bg-[#2b334a] text-[#38bdf8] font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1 border border-[#2c364e]"
                        >
                          <Dices className="w-3 h-3" /> DAÑO / EFECTO
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN 4: DROGAS & CONSUMIBLES */}
            {(rackFilter === 'all' || rackFilter === 'drugs') && (
              <div className="bg-[#151722] p-3 rounded border border-[#252a3c] space-y-2.5">
                <span className="font-tech text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-[#ec4899]" /> DROGAS & CONSUMIBLES DE COMBATE
                </span>

                <div className="space-y-2">
                  {((coreData as any).drugs || []).map((drug: any) => {
                    const ownedItem = activeChar?.inventory?.find(
                      (i) => i.name.toLowerCase() === drug.name.toLowerCase()
                    );
                    const ownedQty = ownedItem?.quantity || 0;

                    return (
                      <div key={drug.id || drug.name} className="bg-[#10121a] p-2 rounded border border-[#22283a] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-tech text-xs font-bold text-white">{drug.name}</span>
                          <div className="flex items-center gap-1.5 text-[9px] font-mono-code">
                            {ownedQty > 0 ? (
                              <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 px-1.5 py-0.2 rounded font-bold">
                                {ownedQty} en mochila
                              </span>
                            ) : null}
                            <span className="text-[#64748b]">{drug.cost} €$</span>
                          </div>
                        </div>

                        <div className="text-[10px] font-mono-code text-[#cbd5e1] leading-tight space-y-0.5">
                          <div><span className="text-[#10b981]">Efecto:</span> {drug.primaryEffect}</div>
                          {drug.secondaryEffect && (
                            <div className="text-[#f43f5e]"><span className="text-[#64748b]">Resaca:</span> {drug.secondaryEffect}</div>
                          )}
                          <div><span className="text-[#eab308]">Adicción:</span> DV {drug.addictionDv}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#1a1e2c]">
                          <button
                            onClick={() => handleInjectDrug(drug)}
                            className="py-1 px-1.5 bg-[#ec4899] hover:bg-[#db2777] text-white font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Pill className="w-3 h-3" /> USAR / INYECTAR
                          </button>
                          <button
                            onClick={() => handleDrugAddictionTest(drug)}
                            className="py-1 px-1.5 bg-[#1e2334] hover:bg-[#2b334a] text-[#eab308] font-tech font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1 border border-[#2c364e]"
                          >
                            <Dices className="w-3 h-3" /> TIRAR ADICCIÓN
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
