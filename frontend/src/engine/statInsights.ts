// v5.6.0 [Claude Code · 2026-10-29]: lo que cada STAT hace con los números del personaje (plan 21). Todo con página del Core.
import type { CharacterSheet, StatKey } from '../types/cyberpunk';
import { calculateMartialArtsDamage, calculateMaxHp, calculateMaxHumanity, calculateUnarmedDamage, getEffectiveBody, getEffectiveEmp } from './characterEngine';

/** REF mínimo para esquivar tiros con DEX + Evasion (Core p.172 y p.83). */
export const DODGE_BULLETS_REF = 8;

export function statInsights(sheet: CharacterSheet): Record<StatKey, string[]> {
  const st = sheet.stats;
  const body = getEffectiveBody(sheet);
  const evasion = sheet.skills?.evasion ?? 0;
  const dodge = st.DEX + evasion;
  const maxHp = calculateMaxHp(body, st.WILL);
  const hasCyberarm = /cyberarm/i.test(JSON.stringify(sheet.installedCyberwareIds ?? []));
  const brawl = calculateUnarmedDamage(body, hasCyberarm);
  return {
    INT: [`Perception, Deduction y las skills de Education: INT ${st.INT} + skill + 1d10 (Core pp.82-85).`],
    REF: [
      `Iniciativa: REF ${st.REF} + 1d10 (Core p.168).`,
      `Disparar: REF ${st.REF} + skill del arma + 1d10 (Core p.172).`,
      st.REF >= DODGE_BULLETS_REF
        ? `Tenés REF ${st.REF}: podés esquivar tiros con DEX ${st.DEX} + Evasion ${evasion} = ${dodge} + 1d10, en lugar del DV por distancia (Core p.172).`
        : `Con REF ${DODGE_BULLETS_REF} o más podrías esquivar tiros; con REF ${st.REF}, contra un tiro solo cuenta el DV por distancia (Core p.172).`
    ],
    DEX: [
      `Pegar cuerpo a cuerpo: DEX ${st.DEX} + Melee Weapon / Brawling / Martial Arts + 1d10 (Core p.176).`,
      `Defenderte de un golpe: DEX ${st.DEX} + Evasion ${evasion} = ${dodge} + 1d10 (Core p.176).`
    ],
    TECH: [`Reparar, curar con instrumental y fabricar: TECH ${st.TECH} + skill + 1d10 (Core pp.82-85).`],
    COOL: [`Facedown: COOL ${st.COOL} + Reputation + 1d10 (Core p.194).`, `Persuasion, Interrogation, Trading…: COOL ${st.COOL} + skill + 1d10.`],
    WILL: [`HP: 10 + 5 × ⌈(BODY ${body} + WILL ${st.WILL}) / 2⌉ = ${maxHp} (Core p.79).`, `Concentration y Resist Torture/Drugs: WILL ${st.WILL} + skill + 1d10.`],
    LUCK: [`Te quedan ${sheet.currentLuck ?? st.LUCK} de ${st.LUCK} puntos para sumar a tiradas; se recuperan al empezar la sesión siguiente (Core p.72).`],
    MOVE: [`Con tu Move Action avanzás MOVE ${st.MOVE} × 2 = ${st.MOVE * 2} m/yds por turno (Core p.169).`],
    BODY: [
      `HP: 10 + 5 × ⌈(BODY ${body} + WILL ${st.WILL}) / 2⌉ = ${maxHp}; Seriously Wounded en ${Math.ceil(maxHp / 2)} (Core p.79).`,
      `Death Save: ${body}. Si estás Mortally Wounded, tirás 1d10 y tenés que sacar menos que eso (Core p.222).`,
      `Daño de Brawling: ${brawl}${hasCyberarm ? ' (con Cyberarm, mínimo 2d6)' : ''} (Core p.176). Daño de Martial Arts: ${calculateMartialArtsDamage(body)} (Core p.178).`
    ],
    EMP: [
      `Humanidad: ${sheet.currentHumanity} de ${calculateMaxHumanity(st.EMP)} (EMP ${st.EMP} × 10, Core p.80).`,
      `EMP efectiva: ${getEffectiveEmp(sheet)}; baja 1 por cada decena de Humanidad perdida (Core p.80).`
    ]
  };
}
