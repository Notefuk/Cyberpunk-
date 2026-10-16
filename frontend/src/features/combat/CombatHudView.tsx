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
  calculateSeriouslyWoundedThreshold 
} from '../../engine/characterEngine';
import { 
  createInitialAttackRoll, 
  createDamageRoll 
} from '../../engine/combatEngine';
import type { WeaponItem } from '../../types/cyberpunk';
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
  Plus
} from 'lucide-react';

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

  // Local state for incoming damage calculator
  const [incomingDamageInput, setIncomingDamageInput] = useState<number>(10);
  const [damageFeedback, setDamageFeedback] = useState<string | null>(null);

  // Calculations for Active Character
  const maxHp = calculateMaxHp(activeChar?.stats?.BODY ?? 6, activeChar?.stats?.WILL ?? 6);
  const seriousWoundThresh = calculateSeriouslyWoundedThreshold(maxHp);
  const isSeriouslyWounded = (activeChar?.currentHp ?? 0) < seriousWoundThresh;
  const isMortallyWounded = (activeChar?.currentHp ?? 0) <= 0;

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

  // Handle Step 1: Attack Check (1d10)
  const handleAttackClick = (weapon: WeaponItem, instanceId: string) => {
    const isAuto = !!autofireByWeapon[instanceId];
    const ammoCost = isAuto ? 10 : (weapon.type === 'Melee' ? 0 : 1);

    // Consume ammo
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

    // Spend selected luck
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
    
    // Look for matching recent attack hit for this weapon to obtain autofireMultiplier if any
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
      
      {/* =========================================================
          COLUMNA IZQUIERDA (4 COLS): VITALES, BLINDAJE, LUCK, CRITS
      ========================================================= */}
      <div className="xl:col-span-4 space-y-5">
        
        {/* Vitals, HP & Ballistic Matrix */}
        <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
          
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1f2230]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#dc2626]" />
              <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">
                BIOMONITOR & ESTADO VITAL
              </span>
            </div>
            {isSeriouslyWounded && (
              <span className="bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#dc2626] font-mono-code text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1 animate-pulse">
                <Flame className="w-3 h-3" /> HERIDA GRAVE (-2 ACCIONES)
              </span>
            )}
          </div>

          {/* HP Bar */}
          <div className="mb-4 bg-[#171923] p-3.5 rounded-sm border border-[#222636]">
            <div className="flex justify-between items-baseline mb-1.5">
              <div className="flex items-center gap-1.5 font-tech text-sm font-bold text-white">
                <Heart className="w-4 h-4 text-[#dc2626]" />
                <span>PUNTOS DE VIDA (HP)</span>
              </div>
              <div className="font-mono-code text-sm">
                <span className={`text-xl font-bold ${isSeriouslyWounded ? 'text-[#dc2626]' : 'text-white'}`}>
                  {activeChar?.currentHp ?? 0}
                </span>
                <span className="text-[#64748b]"> / {maxHp}</span>
              </div>
            </div>

            <div className="w-full bg-[#0c0d12] h-3.5 rounded-xs overflow-hidden border border-[#262b3c] p-0.5">
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
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1f2332] text-xs font-mono-code">
              <div className="flex gap-1.5">
                <button 
                  onClick={() => adjustHp(-5)}
                  className="px-2.5 py-1 bg-[#222534] hover:bg-[#dc2626] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1]"
                >
                  -5
                </button>
                <button 
                  onClick={() => adjustHp(-1)}
                  className="px-2.5 py-1 bg-[#222534] hover:bg-[#dc2626] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1]"
                >
                  -1
                </button>
                <button 
                  onClick={() => adjustHp(1)}
                  className="px-2.5 py-1 bg-[#222534] hover:bg-[#10b981] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1]"
                >
                  +1
                </button>
                <button 
                  onClick={() => adjustHp(5)}
                  className="px-2.5 py-1 bg-[#222534] hover:bg-[#10b981] hover:text-white border border-[#2c3246] rounded-xs font-bold transition-all active:scale-95 text-[#cbd5e1]"
                >
                  +5
                </button>
              </div>
              <button 
                onClick={() => setHp(maxHp)}
                className="px-2.5 py-1 bg-[#1a1d28] hover:bg-[#10b981]/20 hover:border-[#10b981] border border-[#2b3042] text-[#94a3b8] hover:text-white rounded-xs transition-all active:scale-95 text-[11px]"
              >
                Restablecer HP
              </button>
            </div>
          </div>

          {/* Armor Plates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* HEAD ARMOR */}
            <div className="bg-[#171923] p-3 rounded-sm border border-[#222636]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono-code text-[#64748b] block uppercase">CABEZA</span>
                  <span className="font-tech text-sm font-bold text-white block truncate max-w-[110px]">
                    {activeChar?.headArmor?.name || 'Head Armor'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-tech text-2xl font-bold text-[#38bdf8] leading-none">
                    {activeChar?.headArmor?.currentSp ?? 0}
                  </span>
                  <span className="text-[10px] text-[#64748b] block font-mono-code">
                    /{activeChar?.headArmor?.maxSp ?? 0} SP
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#1f2332]">
                <button
                  onClick={() => ablateArmor('head', 1)}
                  className="py-1 px-1.5 bg-[#dc2626]/10 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/30 rounded-xs font-mono-code text-[11px] font-bold transition-all text-center"
                >
                  -1 ABLACIÓN
                </button>
                <button
                  onClick={() => repairArmor('head')}
                  className="py-1 px-1.5 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#2c3246] rounded-xs font-mono-code text-[11px] font-bold transition-all text-center"
                >
                  REPARAR
                </button>
              </div>
            </div>

            {/* BODY ARMOR */}
            <div className="bg-[#171923] p-3 rounded-sm border border-[#222636]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono-code text-[#64748b] block uppercase">TORSO</span>
                  <span className="font-tech text-sm font-bold text-white block truncate max-w-[110px]">
                    {activeChar?.bodyArmor?.name || 'Body Armor'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-tech text-2xl font-bold text-[#38bdf8] leading-none">
                    {activeChar?.bodyArmor?.currentSp ?? 0}
                  </span>
                  <span className="text-[10px] text-[#64748b] block font-mono-code">
                    /{activeChar?.bodyArmor?.maxSp ?? 0} SP
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#1f2332]">
                <button
                  onClick={() => ablateArmor('body', 1)}
                  className="py-1 px-1.5 bg-[#dc2626]/10 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/30 rounded-xs font-mono-code text-[11px] font-bold transition-all text-center"
                >
                  -1 ABLACIÓN
                </button>
                <button
                  onClick={() => repairArmor('body')}
                  className="py-1 px-1.5 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#94a3b8] border border-[#2c3246] rounded-xs font-mono-code text-[11px] font-bold transition-all text-center"
                >
                  REPARAR
                </button>
              </div>
            </div>
          </div>

          {/* Mini-Calculadora: Recibir Impacto Balístico */}
          <div className="bg-[#181a24] p-3 rounded-sm border border-[#262c3e]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-tech text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#f59e0b]" /> CALCULAR IMPACTO ENTRANTE
              </span>
              {damageFeedback && (
                <span className="text-[10px] font-mono-code text-[#10b981] animate-fade-in">
                  {damageFeedback}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="99"
                value={incomingDamageInput}
                onChange={(e) => setIncomingDamageInput(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 bg-[#0f1016] border border-[#2e364c] text-white font-mono-code font-bold text-center py-1 rounded text-sm focus:outline-none focus:border-[#dc2626]"
              />
              <button
                onClick={() => handleApplyHit('body')}
                className="flex-1 py-1.5 bg-[#202434] hover:bg-[#dc2626] hover:text-white text-xs font-tech font-bold tracking-wider text-[#cbd5e1] border border-[#2f354c] rounded-xs transition-all active:scale-95"
              >
                IMPACTAR TORSO
              </button>
              <button
                onClick={() => handleApplyHit('head')}
                className="flex-1 py-1.5 bg-[#202434] hover:bg-[#dc2626] hover:text-white text-xs font-tech font-bold tracking-wider text-[#cbd5e1] border border-[#2f354c] rounded-xs transition-all active:scale-95"
              >
                IMPACTAR CABEZA
              </button>
            </div>
          </div>

        </div>

        {/* Luck Pool & Investment Selector */}
        <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1f2230]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f59e0b]" />
              <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">
                POOL DE SUERTE (LUCK)
              </span>
            </div>
            <button
              onClick={restoreLuck}
              className="text-xs text-[#64748b] hover:text-[#10b981] flex items-center gap-1 font-mono-code transition-colors"
              title="Restablecer Suerte a Stat Máximo"
            >
              <RefreshCw className="w-3 h-3" /> Restaurar
            </button>
          </div>

          {/* Interactive Luck Pips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4 bg-[#171923] p-3 rounded border border-[#222636]">
            {Array.from({ length: activeChar?.stats?.LUCK ?? 6 }).map((_, i) => (
              <button
                key={i}
                onClick={() => toggleLuckPip(i + 1)}
                title={`Fijar puntos de Suerte en ${i + 1}`}
                className={`w-6 h-6 rounded-xs transition-all flex items-center justify-center font-mono-code text-[11px] font-bold ${
                  i < (activeChar?.currentLuck ?? 0)
                    ? 'bg-[#f59e0b] text-black shadow-sm shadow-[#f59e0b]/40'
                    : 'bg-[#222534] text-[#64748b] hover:bg-[#2d3246]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <span className="ml-auto font-mono-code font-bold text-white text-sm">
              {activeChar?.currentLuck ?? 0} / {activeChar?.stats?.LUCK ?? 0}
            </span>
          </div>

          {/* Selector de Suerte para Próximo Tiro */}
          <div className="bg-[#171923] p-3 rounded border border-[#222636] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono-code text-[#64748b] block uppercase">INVERTIR EN EL PRÓXIMO ATAQUE</span>
              <span className="font-tech text-sm font-bold text-white">BONO DE SUERTE:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLuckToSpend(Math.max(0, luckToSpendOnNextRoll - 1))}
                className="w-7 h-7 bg-[#222534] hover:bg-[#dc2626] text-white rounded flex items-center justify-center font-bold"
                title="Reducir bono de suerte"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className={`w-8 text-center font-mono-code font-bold text-base ${
                luckToSpendOnNextRoll > 0 ? 'text-[#f59e0b]' : 'text-[#64748b]'
              }`}>
                +{luckToSpendOnNextRoll}
              </span>
              <button
                onClick={() => setLuckToSpend(Math.min(activeChar?.currentLuck ?? 0, luckToSpendOnNextRoll + 1))}
                className="w-7 h-7 bg-[#222534] hover:bg-[#10b981] text-white rounded flex items-center justify-center font-bold"
                title="Aumentar bono de suerte"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Critical Injuries Console */}
        <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1f2230]">
            <div className="flex items-center gap-2">
              <Skull className="w-4 h-4 text-[#dc2626]" />
              <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">
                HERIDAS CRÍTICAS ({activeChar?.activeInjuries?.length ?? 0})
              </span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => inflictRandomInjury('head')}
                className="px-2 py-1 bg-[#23181d] hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/40 rounded-xs font-mono-code text-[10px] font-bold transition-all"
              >
                + CABEZA
              </button>
              <button
                onClick={() => inflictRandomInjury('body')}
                className="px-2 py-1 bg-[#211f17] hover:bg-[#f59e0b] hover:text-black text-[#f59e0b] border border-[#f59e0b]/40 rounded-xs font-mono-code text-[10px] font-bold transition-all"
              >
                + CUERPO
              </button>
            </div>
          </div>

          {(activeChar?.activeInjuries?.length ?? 0) === 0 ? (
            <div className="text-center py-5 text-[#64748b] font-mono-code text-xs bg-[#171923] rounded border border-[#222636]">
              Sin heridas críticas activas.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {activeChar.activeInjuries.map((inj) => (
                <div
                  key={inj.id}
                  className={`p-3 rounded-xs border transition-all ${
                    inj.isTreated
                      ? 'bg-[#14191c] border-[#1d3328]'
                      : 'bg-[#1c1619] border-[#3b1d24]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#25151a] rounded-xs border border-[#3e1e26]">
                        {renderInjuryIcon(inj.iconType)}
                      </div>
                      <div>
                        <div className="font-tech text-sm font-bold text-white">{inj.name}</div>
                        <div className="flex items-center gap-2 text-[10px] font-mono-code">
                          <span className="text-[#64748b] uppercase">[{inj.location}]</span>
                          {inj.isTreated ? (
                            <span className="text-[#10b981] font-bold">TRATADA (Inactiva)</span>
                          ) : (
                            <span className="text-[#dc2626] font-bold">ACTIVA (-Penalizador)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleTreatInjury(inj.id)}
                        className={`p-1 rounded text-xs transition-colors ${
                          inj.isTreated 
                            ? 'bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/40' 
                            : 'bg-[#222534] text-[#94a3b8] hover:text-white'
                        }`}
                        title={inj.isTreated ? 'Marcar como No Tratada' : 'Tratar Herida (Suspender penalizadores)'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeInjury(inj.id)}
                        className="p-1 bg-[#222534] hover:bg-[#dc2626] text-[#94a3b8] hover:text-white rounded text-xs transition-colors"
                        title="Eliminar Herida Crítica"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#cbd5e1] leading-tight font-sans mt-1">
                    {inj.effect}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* =========================================================
          COLUMNA CENTRAL (5 COLS): TELÉMETRO Y ARSENAL
      ========================================================= */}
      <div className="xl:col-span-5 space-y-5">
        
        {/* Telémetro Selector de Distancia */}
        <div className="chamfer-card p-4 bg-[#121319] border border-[#232736]">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#1f2230]">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#f59e0b]" />
              <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">
                TELÉMETRO DE DISTANCIA AL BLANCO
              </span>
            </div>
            <span className="text-xs font-mono-code text-[#38bdf8]">
              FIJADO: <span className="font-bold text-white bg-[#1e2334] px-2 py-0.5 rounded">{selectedDistance}</span>
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
            {RANGE_BRACKETS.map((b) => {
              const isSelected = selectedDistance === b.range;
              return (
                <button
                  key={b.range}
                  onClick={() => setSelectedDistance(b.range)}
                  className={`p-1.5 rounded-xs border text-center transition-all ${
                    isSelected 
                      ? 'bg-[#dc2626] border-[#dc2626] text-white font-bold shadow-md shadow-[#dc2626]/20' 
                      : 'bg-[#171923] border-[#242838] text-[#94a3b8] hover:border-[#3b425a] hover:text-white'
                  }`}
                >
                  <div className="font-tech text-xs font-bold leading-none">{b.range}</div>
                  <div className="text-[9px] font-mono-code text-[#64748b] mt-0.5 leading-tight truncate">
                    {b.label.split('(')[1]?.replace(')', '') || ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tarjetas de Armamento Equipado */}
        <div className="space-y-4">
          {(activeChar?.equippedWeapons?.length ?? 0) === 0 ? (
            <div className="chamfer-card p-8 text-center text-[#64748b] font-mono-code text-xs bg-[#121319] border border-[#232736]">
              Sin armas equipadas en la ficha activa. Equipa armas en Street Lab.
            </div>
          ) : (
            activeChar.equippedWeapons.map((w) => {
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

              return (
                <div
                  key={w.instanceId}
                  className="chamfer-card p-4 bg-[#141620] border border-[#252a3a] hover:border-[#3b435c] transition-all"
                >
                  {/* Top Weapon Info Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <ItemVisualPlaceholder type={placeholderType} size="md" />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-tech text-base font-bold text-white tracking-wide">
                            {w.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono-code text-[#94a3b8]">
                            <span>{w.damage} DAÑO</span>
                            <span>•</span>
                            <span>ROF {w.rof}</span>
                            <span>•</span>
                            <span className="text-[#38bdf8]">{breakdown.skillLabel}</span>
                          </div>
                        </div>

                        {/* Ammo Counter / Reload */}
                        {isRanged && (
                          <div className="text-right">
                            <div className="font-mono-code text-sm font-bold text-white">
                              <span className={isOutOfAmmo ? 'text-[#dc2626]' : 'text-[#10b981]'}>
                                {w.currentMag}
                              </span>
                              <span className="text-[#64748b]">/{w.standardMag}</span>
                            </div>
                            <button
                              onClick={() => reloadWeapon(w.instanceId)}
                              className="text-[10px] font-mono-code text-[#f59e0b] hover:underline"
                            >
                              Recargar
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Formula en vivo de la Base de Ataque */}
                      <div className="mt-2 bg-[#101218] p-2 rounded border border-[#1f2434] text-xs font-mono-code flex flex-wrap items-center justify-between gap-2">
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
                    </div>
                  </div>

                  {/* Escalera de Distancias (Range Ladder) */}
                  {isRanged && profile && (
                    <div className="mb-3">
                      <div className="text-[10px] font-mono-code text-[#64748b] mb-1 uppercase">
                        ESCALERA DE DIFICULTADES (DV) PARA {w.name}
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center font-mono-code text-xs">
                        {RANGE_BRACKETS.map((b) => {
                          const dvVal = isAuto && profile.autofireDvs 
                            ? profile.autofireDvs[b.range] 
                            : profile.dvs[b.range];
                          const isCur = selectedDistance === b.range;
                          
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
                          className={`px-2.5 py-1 rounded-xs font-tech font-bold text-xs tracking-wider transition-all ${
                            isAuto
                              ? 'bg-[#f59e0b] text-black shadow-sm shadow-[#f59e0b]/40'
                              : 'bg-[#222534] text-[#94a3b8] hover:text-white border border-[#2e3448]'
                          }`}
                        >
                          {isAuto ? '🔥 MODO AUTOFIRE ACTIVO (10 BALAS)' : '⚡ ACTIVAR MODO AUTOFIRE (10 BALAS)'}
                        </button>
                      </div>
                      <div className="text-[11px] font-mono-code text-[#cbd5e1] leading-tight space-y-0.5">
                        <div><strong className="text-[#64748b]">Habilidad:</strong> {autofireRules.skillUsed} | <strong className="text-[#64748b]">Costo:</strong> {autofireRules.ammoCost} balas</div>
                        <div className="text-[#f59e0b]">{autofireRules.damageRule}</div>
                      </div>
                    </div>
                  )}

                  {/* DOS BOTONES DE ACCIÓN SEPARADOS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#1f2334]">
                    {/* Botón 1: 1d10 Atacar */}
                    <button
                      disabled={isOutOfAmmo || (currentDv === null && w.type !== 'Melee')}
                      onClick={() => handleAttackClick(w, w.instanceId)}
                      className={`py-2 px-3 font-tech font-bold tracking-wider text-sm chamfer-btn transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        isOutOfAmmo || (currentDv === null && w.type !== 'Melee')
                          ? 'bg-[#1e212c] text-[#64748b] cursor-not-allowed border border-[#282d3e]'
                          : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-md shadow-[#dc2626]/20'
                      }`}
                    >
                      <Crosshair className="w-4 h-4" />
                      <span>1. ATACAR 1d10 ({w.type === 'Melee' ? 'DV 13' : currentDv !== null ? `DV ${currentDv}` : 'Fuera Rango'})</span>
                    </button>

                    {/* Botón 2: Xd6 Daño */}
                    <button
                      onClick={() => handleDamageClick(w, w.instanceId)}
                      className="py-2 px-3 bg-[#1d2232] hover:bg-[#252c42] hover:border-[#38bdf8] border border-[#2a3248] text-[#38bdf8] font-tech font-bold tracking-wider text-sm chamfer-btn transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Dices className="w-4 h-4" />
                      <span>2. TIRAR DAÑO ({isAuto ? '2d6 × Autofire' : w.damage})</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* =========================================================
          COLUMNA DERECHA (3 COLS): TELEMETRÍA / ROLL HISTORY LOG
      ========================================================= */}
      <div className="xl:col-span-3 space-y-5">
        
        <div className="chamfer-card p-4 bg-[#121319] border border-[#232736] flex flex-col h-full min-h-[600px]">
          
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1f2230]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#38bdf8]" />
              <span className="font-tech text-sm font-bold tracking-wider text-white uppercase">
                TELEMETRÍA DE COMBATE
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

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[750px]">
            {rollHistory.length === 0 ? (
              <div className="text-center py-20 text-[#64748b] font-mono-code text-xs">
                <Crosshair className="w-8 h-8 text-[#262c3e] mx-auto mb-2" />
                Sin tiradas registradas.<br />
                Selecciona una distancia y pulsa Atacar o Tirar Daño.
              </div>
            ) : (
              rollHistory.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-xs border transition-all ${
                    entry.needsExplosionClick
                      ? 'bg-[#2b181b] border-[#dc2626] shadow-md shadow-[#dc2626]/20'
                      : entry.type === 'attack'
                        ? entry.isHit
                          ? 'bg-[#141822] border-[#1d2d3e]'
                          : 'bg-[#191418] border-[#301c24]'
                        : 'bg-[#161724] border-[#262840]'
                  }`}
                >
                  {/* HEADER CARTEL CRÍTICO (10) O PIFIA (1) DIFERIDO */}
                  {entry.needsExplosionClick && (
                    <div className="mb-2 pb-2 border-b border-[#dc2626]/40 text-center animate-pulse">
                      {entry.explosionType === 'crit_success' ? (
                        <div className="bg-[#10b981]/20 border border-[#10b981] p-2 rounded-xs text-[#10b981] font-tech font-bold text-xs">
                          ⚡ ¡10 NATURAL! DADO EXPLOSIVO
                          <button
                            onClick={() => triggerExplosionClick(entry.id)}
                            className="mt-1.5 w-full py-1.5 bg-[#10b981] hover:bg-[#059669] text-black font-tech font-bold tracking-wider rounded text-xs chamfer-btn transition-all"
                          >
                            🎲 APRETAR PARA TIRAR 1d10 CRÍTICO
                          </button>
                        </div>
                      ) : (
                        <div className="bg-[#dc2626]/20 border border-[#dc2626] p-2 rounded-xs text-[#dc2626] font-tech font-bold text-xs">
                          ⚠️ ¡1 NATURAL! PIFIA CRÍTICA
                          <button
                            onClick={() => triggerExplosionClick(entry.id)}
                            className="mt-1.5 w-full py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold tracking-wider rounded text-xs chamfer-btn transition-all"
                          >
                            🎲 APRETAR PARA TIRAR 1d10 DE PIFIA
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SI ES TIPO ATAQUE */}
                  {entry.type === 'attack' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-tech text-sm font-bold text-white truncate max-w-[140px]">
                          {entry.weaponName} {entry.isAutofire ? '[AUTOFIRE]' : ''}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-2xs text-[10px] font-mono-code font-bold ${
                          entry.isHit 
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' 
                            : 'bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/30'
                        }`}>
                          {entry.isHit ? `IMPACTO (DV ${entry.targetDv})` : `FALLO (DV ${entry.targetDv})`}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono-code text-[#38bdf8] mb-1">
                        Distancia: {entry.distanceLabel}
                      </div>

                      {/* Desglose Matemático */}
                      <div className="text-xs font-mono-code text-[#94a3b8] bg-[#0e1017] p-2 rounded border border-[#1c2232] space-y-0.5">
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
                        <div className="flex justify-between items-baseline pt-1 border-t border-[#1c2232]">
                          <span className="text-[#64748b]">Margen: {entry.margin !== undefined ? (entry.margin >= 0 ? `+${entry.margin}` : `${entry.margin}`) : 'N/A'}</span>
                          <span className="text-white font-bold text-sm">TOTAL: {entry.totalAttack}</span>
                        </div>
                      </div>

                      {/* Si es Autofire y dio impacto */}
                      {entry.isAutofire && entry.isHit && (
                        <div className="mt-1.5 p-1.5 bg-[#201d14] rounded border border-[#3b341d] flex items-center justify-between text-xs font-mono-code text-[#f59e0b]">
                          <span>MULTIPLICADOR:</span>
                          <span className="font-bold">×{entry.autofireMultiplier} (2d6)</span>
                        </div>
                      )}

                      {/* Botón Rápido de Tirar Daño */}
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
                          className="mt-2 w-full py-1.5 bg-[#22293c] hover:bg-[#38bdf8] hover:text-black border border-[#303c58] text-[#38bdf8] font-tech font-bold text-xs tracking-wider rounded-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Dices className="w-3.5 h-3.5" />
                          <span>TIRAR DAÑO ({entry.isAutofire ? `2d6 × ${entry.autofireMultiplier || 1}` : entry.damageFormula})</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* SI ES TIPO DAÑO */}
                  {entry.type === 'damage' && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-tech text-sm font-bold text-[#f59e0b]">
                          💥 DAÑO: {entry.weaponName}
                        </span>
                        <span className="font-tech text-lg font-bold text-white leading-none">
                          {entry.finalDamageTotal} PTS
                        </span>
                      </div>

                      {/* Dados d6 individuales */}
                      <div className="flex flex-wrap items-center gap-1.5 my-2">
                        {entry.diceResults?.map((die, idx) => (
                          <div
                            key={idx}
                            className={`w-7 h-7 rounded-xs flex items-center justify-center font-mono-code font-bold text-xs border ${
                              die === 6
                                ? 'bg-[#dc2626] border-[#f87171] text-white shadow-sm shadow-[#dc2626]/50'
                                : 'bg-[#181a26] border-[#292e42] text-[#cbd5e1]'
                            }`}
                          >
                            {die}
                          </div>
                        ))}
                        {entry.critBonusDamage ? (
                          <span className="text-[11px] font-mono-code text-[#dc2626] font-bold">
                            +5 CRÍTICO
                          </span>
                        ) : null}
                      </div>

                      {/* BANNER DE CRÍTICO EN DAÑO SI SIXES >= 2 */}
                      {entry.isCriticalInjuryTrigger && (
                        <div className="mt-2 p-2 bg-[#2a141a] border border-[#dc2626] rounded-xs">
                          <div className="font-tech text-xs font-bold text-[#dc2626] flex items-center gap-1 mb-1.5">
                            <Skull className="w-3.5 h-3.5" /> ¡CRÍTICO EN DAÑO! (DOBLE 6+) → +5 DAÑO DIRECTO
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => inflictRandomInjury('head')}
                              className="py-1 px-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono-code text-[10px] font-bold rounded-xs transition-all text-center"
                            >
                              + GIRAR CABEZA
                            </button>
                            <button
                              onClick={() => inflictRandomInjury('body')}
                              className="py-1 px-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-black font-mono-code text-[10px] font-bold rounded-xs transition-all text-center"
                            >
                              + GIRAR CUERPO
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[9px] font-mono-code text-[#64748b] mt-1.5 text-right">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
