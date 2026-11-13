// [Claude Code · 2026-11-13] v5.33.0 (plan 31): reglas de Cyberpets, "Your New Best Friend" (Interface RED Vol. 5 pp.72-73). Lógica pura.
import type { CyberpetModel, PetTier } from '../data/cyberpets';
import { LIFESTYLE_OPTIONS } from '../data/creation/housingOptions';
import type { OwnedPet } from '../types/cyberpunk';

/** Camas de Housing que ocupa según su nivel (p.72): Mook ninguna, Lieutenant 1, Mini-Boss 2, Boss 3. */
export const PET_BEDS: Record<PetTier, number> = { mook: 0, lieutenant: 1, mini_boss: 2, boss: 3 };

export const PET_TIER_LABEL: Record<PetTier, string> = { mook: 'Mook', lieutenant: 'Lieutenant', mini_boss: 'Mini-Boss', boss: 'Boss' };

/** Costo mensual del Lifestyle que pide la mascota (Core p.377); se paga entero, sin prorratear (p.72). */
/** El Cyberbear pide "Fresh Food x2" (p.78): el multiplicador se aplica al costo. */
export function petLifestyleMonthly(model: Pick<CyberpetModel, 'lifestyle'>): number {
  const m = /^(.*?)\s*x(\d+)$/i.exec(model.lifestyle.trim());
  const name = (m ? m[1] : model.lifestyle).trim().toLowerCase();
  const times = m ? Number(m[2]) : 1;
  return (LIFESTYLE_OPTIONS.find((l) => l.name.toLowerCase() === name)?.monthly ?? 0) * times;
}

/** Animal Handling Base = INT + Animal Handling (p.73). */
export function animalHandlingBase(int: number, skill: number): number {
  return int + skill;
}

export interface Obedience {
  obeys: boolean;
  reason: string;
}

/**
 * Obedece si la Animal Handling Base es 10 o más y está bien cuidada: Lifestyle pagado, durmiendo bien y sin maltrato.
 * Si no, actúa como decida el GM; una tirada de Animal Handling la controla un rato (p.73).
 */
export function petObedience(base: number, pet: Pick<OwnedPet, 'lifestylePaid' | 'housed' | 'mistreated'>): Obedience {
  if (base < 10) return { obeys: false, reason: `Tu Animal Handling Base es ${base} (menos de 10): no te obedece y actúa como decida el GM.` };
  const problems = [!pet.lifestylePaid && 'su Lifestyle no está pago', !pet.housed && 'no duerme bien (falta lugar)', pet.mistreated && 'la maltrataste'].filter(Boolean);
  if (problems.length) return { obeys: false, reason: `Base ${base}, pero ${problems.join(', ')}: el GM decide qué hace (puede escaparse, no obedecer o atacarte).` };
  return { obeys: true, reason: `Base ${base}: te quiere, pelea a tu lado y sigue tus órdenes.` };
}

/** Ranuras usadas por el ciberware agregado después de la compra; uno puede ocupar 0 con un Tech Upgrade (p.73). */
export function petSlotsUsed(pet: Pick<OwnedPet, 'extraCyberware'>): number {
  return pet.extraCyberware.filter((c) => !c.zeroSlot).length;
}

export function canAddPetCyberware(pet: Pick<OwnedPet, 'extraCyberware'>, model: Pick<CyberpetModel, 'cyberwareSlots'>, zeroSlot = false): boolean {
  if (zeroSlot) return !pet.extraCyberware.some((c) => c.zeroSlot);
  return petSlotsUsed(pet) < model.cyberwareSlots;
}

export const CYBERPET_RULES: string[] = [
  'Comprarla: pedísela a un Fixer. El costo en eb y la categoría pueden no coincidir: la categoría es la que cuenta para conseguirla (p.73).',
  'Lifestyle: pagás todos los meses el de la mascota además del tuyo, entero aunque la compres a mitad de mes (p.72).',
  'Housing: un Mook no ocupa cama; un Lieutenant ocupa 1, un Mini-Boss 2 y un Boss 3. Preguntale a tu casero (p.72).',
  'Obediencia: con Animal Handling Base (INT + Animal Handling) de 10 o más te obedece, siempre que la cuides. Si no, el GM decide; una tirada de Animal Handling recupera el control un rato (p.73).',
  'Ciberware nuevo: un Medtech con Science (Biology) 4+ en un lugar especial, con las DV de un humano; si no, la mascota muere. El ciberware es de cada especie (p.73).',
  'Entrenarla para usarlo: 1 día y Animal Handling con DV igual a la de instalación. Si falla, solo come y duerme hasta que lo vuelvas a intentar y salga (p.73).',
  'Ranuras: no se agregan con Tech Upgrade, pero un Tech puede hacer que una (solo una) pieza ocupe 0. Sacar el ciberware de fábrica no libera ranuras; sacar lo agregado sí (p.73).',
];
