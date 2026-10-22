// [Claude Code · 2026-10-22] Reparto de la Habilidad de Rol de los Folios CEMK (plan 9, v4.9.1).
import type { CharacterSheet } from '../types/cyberpunk';

export const FOLIO_ROLE_ALLOCATIONS: Record<
  string,
  Partial<Pick<CharacterSheet, 'makerAllocation' | 'medicineAllocation'>> & { medicalTechMin?: number }
> = {
  // Folios p.25 → Maker 4: Field Expertise 4; quedan 4 rangos libres (Core pp. 147-149).
  'cemk-folio-maven': { makerAllocation: { field: 4, upgrade: 0, fabrication: 0, invention: 0 } },
  // Folios p.17 → Medicine 4 (Core pp. 149-150), discrepancias 26-27.
  'cemk-folio-insurance': {
    medicineAllocation: { surgery: 2, pharmaceuticals: 1, cryosystem: 0, knownPharmaceuticals: ['Speedheal'] },
    medicalTechMin: 1
  }
};

// Medical Tech no está en GENERAL_SKILLS_CATALOG; los Folios usan claves en minúscula, así que se usa 'medicaltech' (sin importar characterCreationData, para evitar ciclos).
const MEDICAL_TECH_FOLIO_KEY = 'medicaltech';

export function applyFolioAllocation(sheet: CharacterSheet, folioId: string): CharacterSheet {
  const alloc = FOLIO_ROLE_ALLOCATIONS[folioId];
  if (!alloc) return sheet;
  const next: CharacterSheet = { ...sheet };
  if (alloc.makerAllocation && !next.makerAllocation) next.makerAllocation = { ...alloc.makerAllocation };
  if (alloc.medicineAllocation && !next.medicineAllocation) {
    next.medicineAllocation = {
      ...alloc.medicineAllocation,
      knownPharmaceuticals: alloc.medicineAllocation.knownPharmaceuticals
        ? [...alloc.medicineAllocation.knownPharmaceuticals]
        : undefined
    };
  }
  if (alloc.medicalTechMin) {
    const gs = { ...(next.generalSkills ?? {}) };
    gs[MEDICAL_TECH_FOLIO_KEY] = Math.max(gs[MEDICAL_TECH_FOLIO_KEY] ?? 0, alloc.medicalTechMin);
    next.generalSkills = gs;
  }
  return next;
}
