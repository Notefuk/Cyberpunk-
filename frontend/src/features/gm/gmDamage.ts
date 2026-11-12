// [Claude Code · 2026-11-12] v5.23.0 (plan 28): daño del GM a la ficha de un PJ, compartido por GmTargetDialog
// (daño a mano) y el ataque de un actor (MODO GM). SP, ablación, cabeza x2 (x3 con Cracked Skull), +5 del crítico
// (Core pp.186-188) y heridas; cada aplicación va al log de la mesa.
import { useCharacterStore } from '../../store/useCharacterStore';
import { calculateIncomingImpact, planImpactEffects, type IncomingAttackType, type IncomingImpactInput, type IncomingImpactResult } from '../../engine/combatEngine';
import { publishGmAction } from '../../sync/tableSync';
import type { CharacterSheet } from '../../types/cyberpunk';

export interface PcHit {
  damage: number;
  location: 'body' | 'head';
  attackType: IncomingAttackType;
  isCritical: boolean;
}

export function pcImpactInput(char: CharacterSheet, hit: PcHit): IncomingImpactInput {
  return {
    damage: hit.damage,
    location: hit.location,
    attackType: hit.attackType,
    isCritical: hit.isCritical,
    passExcess: false,
    headSp: char.headArmor?.currentSp ?? 0,
    bodySp: char.bodyArmor?.currentSp ?? 0,
    shieldSdp: 0,
    // Core p. 188: Cracked Skull multiplica x3 los Ataques Apuntados a la cabeza.
    hasCrackedSkull: char.activeInjuries.some((i) => !i.isTreated && i.name.includes('Cracked Skull')),
  };
}

export function previewPcImpact(char: CharacterSheet, hit: PcHit): IncomingImpactResult {
  return calculateIncomingImpact(pcImpactInput(char, hit));
}

/**
 * Aplica el golpe a la ficha y lo publica en el log. Devuelve el resumen ("SP 11→10 · HP 40→33…").
 * `label` es lo que va al log (p. ej. "daño 12 en cuerpo" o "Guardia 1: Pistola, daño 12").
 */
export function applyHitToPc(charId: string, hit: PcHit, label: string): string | null {
  const st = useCharacterStore.getState;
  const char = st().characters.find((c) => c.id === charId);
  if (!char) return null;
  const input = pcImpactInput(char, hit);
  const impact = calculateIncomingImpact(input);
  const spBefore = hit.location === 'head' ? input.headSp : input.bodySp;
  const hpBefore = char.currentHp;
  const injuries = st().applyImpactTo(charId, planImpactEffects(input, impact, impact.hpLoss, hpBefore < 1));
  const hpAfter = st().characters.find((c) => c.id === charId)?.currentHp ?? 0;
  const parts = [`SP ${spBefore}→${spBefore - impact.spAblation}`, `HP ${hpBefore}→${hpAfter}`];
  if (injuries.length) parts.push(`herida: ${injuries.map((i) => i.name).join(', ')} (Core pp.187-188)`);
  publishGmAction({ targetCharId: charId, targetHandle: char.handle, label, detail: parts.join(' · '), total: hit.damage });
  return parts.join(' · ');
}
