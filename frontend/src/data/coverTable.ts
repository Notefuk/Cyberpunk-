// Tabla canon de cobertura. Core p.182 (tabla "Cover Hit Points") y p.183 (ejemplos). [Claude Code · 2026-11-20]
// La usan la cheat sheet, los presets del HUD de combate y la extensión de Owlbear (plan 29).

export type CoverMaterialId = 'steel' | 'stone' | 'bulletproof_glass' | 'concrete' | 'wood' | 'plaster_foam_plastic';
export type CoverThickness = 'thin' | 'thick';

export interface CoverMaterial {
  id: CoverMaterialId;
  /** Nombre como figura en el libro. */
  name: string;
  /** Nombre en español para la UI. */
  label: string;
  thickHp: number;
  /** 0 = no es cobertura (Core p.182: Plaster/Foam/Plastic fino). */
  thinHp: number;
  /** Ejemplos de la tabla de Core p.183. */
  examples: string[];
}

export const COVER_PAGE_REF = 'Core p.182';

export const COVER_MATERIALS: CoverMaterial[] = [
  {
    id: 'steel', name: 'Steel', label: 'Acero', thickHp: 50, thinHp: 25,
    examples: ['Puerta de bóveda (gruesa)', 'Bloque de motor (gruesa)', 'Hidrante (gruesa)', 'Puerta de auto (fina)', 'Heladera (fina)', 'Contenedor de carga (fina)'],
  },
  {
    id: 'stone', name: 'Stone', label: 'Piedra', thickHp: 40, thinHp: 20,
    examples: ['Roca grande (gruesa)', 'Estatua (fina)'],
  },
  {
    id: 'bulletproof_glass', name: 'Bulletproof Glass', label: 'Vidrio antibalas', thickHp: 30, thinHp: 15,
    examples: ['Ventana de banco (gruesa)', 'Parabrisas blindado (fina o gruesa)', 'Vidrio de visitas de prisión (fina)'],
  },
  {
    id: 'concrete', name: 'Concrete', label: 'Concreto', thickHp: 25, thinHp: 10,
    examples: ['Data Term (gruesa)', 'Poste de luz (gruesa)'],
  },
  {
    id: 'wood', name: 'Wood', label: 'Madera', thickHp: 20, thinHp: 5,
    examples: ['Barra de bar (gruesa)', 'Pared de cabaña (gruesa)', 'Árbol (gruesa)', 'Mesa volcada (fina)', 'Ropero (fina)', 'Puerta de madera (fina)'],
  },
  {
    id: 'plaster_foam_plastic', name: 'Plaster/Foam/Plastic', label: 'Yeso / espuma / plástico', thickHp: 15, thinHp: 0,
    examples: ['Pared de oficina (gruesa)', 'Sillón (gruesa)'],
  },
];

/** Core p.183: no son cobertura (0 HP). */
export const NOT_COVER_EXAMPLES = ['Cubículo de oficina', 'Parabrisas común'];

/** Core p.350: Bulletproof Shield, 10 HP que bajan con el daño; uso en Core p.183. */
export const BULLETPROOF_SHIELD_HP = 10;

export function getCoverMaterial(id: CoverMaterialId): CoverMaterial {
  const m = COVER_MATERIALS.find((x) => x.id === id);
  if (!m) throw new Error(`Material de cobertura desconocido: ${id}`);
  return m;
}
