// Nivel de una skill en una ficha, sin importar cómo esté guardada la clave. [Claude Code · 2026-10-23]
// Las fichas guardan skills de varias formas: combat ('firstAid'), nombre del libro ('Drive Land Vehicle')
// y claves compactas de los Folios, a veces abreviadas ('electronicssecurity' por Electronics/Security Tech,
// 'concealreveal' por Conceal/Reveal Object). Misma regla de prefijo que OtherSkillsPanel.
import { resolveSkillKey, normalizeCanonSkillName } from '../data/characterCreationData';

export const compactSkillName = (x: string): string => normalizeCanonSkillName(x).replace(/[^a-z0-9]/g, '');

interface SheetSkills {
  skills?: unknown;
  generalSkills?: Record<string, number>;
}

/** Devuelve el mayor nivel guardado para la skill (0 si no la tiene). */
export function sheetSkillLevel(sheet: SheetSkills | undefined, skillName: string): number {
  if (!sheet) return 0;
  const wanted = compactSkillName(skillName);
  const ref = resolveSkillKey(skillName);
  const refKey = ref ? compactSkillName(ref.key) : null;
  const matches = (key: string): boolean => {
    const k = compactSkillName(key);
    if (k === wanted || (refKey !== null && k === refKey)) return true;
    // Clave abreviada: prefijo del nombre del libro (mínimo 6 letras, sin especialidad entre paréntesis).
    return !key.includes('(') && k.length >= 6 && wanted.startsWith(k);
  };
  let level = 0;
  for (const rec of [sheet.skills as Record<string, number> | undefined, sheet.generalSkills]) {
    for (const [k, v] of Object.entries(rec ?? {})) {
      if (typeof v === 'number' && matches(k)) level = Math.max(level, v);
    }
  }
  return level;
}
