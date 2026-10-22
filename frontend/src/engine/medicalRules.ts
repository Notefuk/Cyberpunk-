// Motor puro de reglas de Medtech: tratamiento de Heridas Críticas, estabilización y síntesis (plan 10, v4.9.2). [Claude Code · 2026-10-22]
import { CEMK_CRITICAL_INJURIES } from '../data/creation';
import type { CemkCritEntry, CritTreatmentOption } from '../data/creation';
import { rollCheckD10, beatsDv } from './combatEngine';

export type CritTable = 'core' | 'cemk';

export interface TreatmentOptions { quickFix: CritTreatmentOption[]; treatment: CritTreatmentOption[]; quickFixPermanent: boolean }

// Core pp. 187-188: las cadenas de data/criticalInjuries.ts ("Paramedic DV 15 o Surgery DV 13", "First Aid o Paramedic DV 13",
// "N/A", "El Quick Fix elimina el efecto de forma permanente") pasan a estructura. "A o B DV n" => dos opciones con el mismo DV.
export function parseTreatmentText(text: string): { options: CritTreatmentOption[]; removesPermanently: boolean } {
  const clean = (text ?? '').trim();
  if (!clean || /^n\/a$/i.test(clean)) return { options: [], removesPermanently: false };
  if (/permanente/i.test(clean)) return { options: [], removesPermanently: true };
  const options: CritTreatmentOption[] = [];
  let pending: string[] = [];
  for (const segment of clean.split(/\s+o\s+/i)) {
    const m = segment.trim().match(/^(.+?)\s+DV\s*(\d+)$/i);
    if (m) {
      for (const skill of [...pending, m[1].trim()]) options.push({ skill, dv: Number(m[2]) });
      pending = [];
    } else {
      pending.push(segment.trim());
    }
  }
  return { options, removesPermanently: false };
}

function cemkFind(name: string): CemkCritEntry | undefined {
  const wanted = name.trim().toLowerCase();
  const english = (name.match(/\(([^)]+)\)\s*$/)?.[1] ?? '').trim().toLowerCase();
  const all = [...CEMK_CRITICAL_INJURIES.body, ...CEMK_CRITICAL_INJURIES.head];
  return all.find(e => {
    const n = e.name.toLowerCase();
    return n === wanted || (english !== '' && n === english);
  });
}

// Core pp. 187-188 (tabla 2d6); CEMK RB p.13 (tabla 1d6).
export function getTreatmentOptions(injury: { name: string; quickFixDv: string; treatmentDv: string; table?: CritTable }): TreatmentOptions {
  if (injury.table === 'cemk') {
    const entry = cemkFind(injury.name);
    if (entry) {
      return { quickFix: entry.quickFix, treatment: entry.treatment, quickFixPermanent: entry.quickFixRemovesPermanently };
    }
  }
  const qf = parseTreatmentText(injury.quickFixDv);
  const tr = parseTreatmentText(injury.treatmentDv);
  return { quickFix: qf.options, treatment: tr.options, quickFixPermanent: qf.removesPermanently || tr.removesPermanently };
}

// Core p.222; CEMK RB p.14: DV de estabilización según el estado de herida.
export function stabilizationDv(state: 'light' | 'serious' | 'mortal'): number {
  return state === 'light' ? 10 : state === 'serious' ? 13 : 15;
}

// Core p.222: Lightly Wounded = menos que HP máx; Seriously Wounded = HP <= mitad (redondeo arriba); Mortally Wounded = menos de 1 HP.
// Alineado con calculateSeriouslyWoundedThreshold / isMortallyWounded de characterEngine.
export function woundStateForStabilization(currentHp: number, maxHp: number, seriouslyWoundedThreshold: number): 'none' | 'light' | 'serious' | 'mortal' {
  if (currentHp < 1) return 'mortal';
  // Core p.220: Seriously Wounded = menos de la mitad del HP (redondeo arriba), igual que characterEngine.
  if (currentHp < seriouslyWoundedThreshold) return 'serious';
  if (currentHp < maxHp) return 'light';
  return 'none';
}

// Core p.223; CEMK RB pp. 13-14: Surgery solo la usa un Medtech.
export function canMedicUseSkill(skill: string, medicRole: string): { ok: boolean; reason?: string } {
  if (/^surgery$/i.test(skill.trim()) && medicRole !== 'Medtech') {
    return { ok: false, reason: 'Surgery solo la puede usar un Medtech (Core p.223).' };
  }
  return { ok: true };
}

// Core p.223; CEMK RB p.14: el Treatment no se puede aplicar a uno mismo.
export function canSelfApply(kind: 'quickFix' | 'treatment' | 'stabilize'): boolean {
  return kind !== 'treatment';
}

export const QUICK_FIX_NOTE = {
  core: 'Quita el efecto por el resto del día (Core p.223).',
  cemk: 'Quita el efecto hasta el amanecer del día siguiente (CEMK RB p.14).',
};

// Core p.130 / CEMK p.5: TECH + skill + 1d10 (10 explota, 1 resta) contra el DV; hay que superarlo.
export function rollMedicalCheck(opts: { tech: number; skillLevel: number; dv: number; rng?: () => number }): { natural: number; total: number; success: boolean; breakdown: string } {
  const d = rollCheckD10(opts.rng);
  const total = opts.tech + opts.skillLevel + d.value;
  const extra = d.extra ? (d.natural === 10 ? ` +${d.extra}` : ` -${d.extra}`) : '';
  return {
    natural: d.natural,
    total,
    success: beatsDv(total, opts.dv),
    breakdown: `TECH ${opts.tech} + skill ${opts.skillLevel} + d10 ${d.natural}${extra} = ${total} vs DV ${opts.dv}`,
  };
}

// Síntesis de fármacos (Core pp. 149-150).
export const SYNTHESIS_DV = 13;
export const SYNTHESIS_MATERIALS_EB = 200;

/** Core p.150: dosis por 200 eb de materiales en 1 hora = nivel de Medical Tech. */
export function synthesisDoses(medicalTechLevel: number): number {
  return Math.max(0, medicalTechLevel);
}

/** Core p.150: "A Character who is not a Medtech cannot administer Pharmaceuticals correctly"; solo se sintetizan fármacos conocidos. */
export function canSynthesize(opts: { role: string; knownPharmaceuticals: string[] | undefined; drug: string }): { ok: boolean; reason?: string } {
  if (opts.role !== 'Medtech') return { ok: false, reason: 'Solo un Medtech puede sintetizar fármacos (Core p.150).' };
  if (!(opts.knownPharmaceuticals ?? []).includes(opts.drug)) return { ok: false, reason: 'Solo se pueden sintetizar fármacos conocidos (Core p.150).' };
  return { ok: true };
}

// CEMK RB p.13: 1d6 en la tabla; se vuelve a tirar si ya sufre esa lesión.
export function rollCemkCriticalInjury(location: 'head' | 'body', currentNames: string[], rng: () => number = Math.random): CemkCritEntry {
  const table = location === 'head' ? CEMK_CRITICAL_INJURIES.head : CEMK_CRITICAL_INJURIES.body;
  const available = table.filter(e => !currentNames.includes(e.name));
  if (available.length === 0) return table[Math.floor(rng() * table.length)];
  for (;;) {
    const d = Math.floor(rng() * 6) + 1;
    const found = available.find(e => e.roll === d);
    if (found) return found;
  }
}

/** CEMK RB p.13: busca una Crítica de la tabla CEMK por nombre (para elegirla a mano). */
export function findCemkCriticalInjury(location: 'head' | 'body', name: string): CemkCritEntry | undefined {
  return (location === 'head' ? CEMK_CRITICAL_INJURIES.head : CEMK_CRITICAL_INJURIES.body).find((e) => e.name === name);
}
