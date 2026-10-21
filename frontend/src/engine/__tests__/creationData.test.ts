// Tests de los datos canon de creación de personajes. Cada caso cita la página del libro que fija el valor.
// [Claude Code · 2026-10-22]
import { describe, expect, it } from 'vitest';
import { CEMK_CREATION, CORE_GEAR_SKILLS, CORE_ROLE_TABLES } from '../../data/creation';
import {
  ERA_CATALOG,
  PREGEN_TEMPLATES,
  ROLES_CATALOG,
  UNRESOLVED_CANON_SKILL_NAMES
} from '../../data/characterCreationData';
import pack from '../../data/core-rules.cprpack.json';

describe('Datos canon de creación', () => {
  it('Core p.74-77: 10 roles con 10 filas en su tabla de stats', () => {
    const roles = Object.keys(CORE_ROLE_TABLES.statTables);
    expect(roles).toHaveLength(10);
    for (const r of roles) {
      expect(CORE_ROLE_TABLES.statTables[r as keyof typeof CORE_ROLE_TABLES.statTables].rows).toHaveLength(10);
    }
    for (const role of ROLES_CATALOG) expect(role.edgerunnerStatTable).toHaveLength(10);
  });

  it('Core p.74: Solo fila 1 = 6 7 7 3 8 6 5 5 6 5 (INT REF DEX TECH COOL WILL LUCK MOVE BODY EMP)', () => {
    const row = CORE_ROLE_TABLES.statTables.Solo.rows[0];
    expect([row.INT, row.REF, row.DEX, row.TECH, row.COOL, row.WILL, row.LUCK, row.MOVE, row.BODY, row.EMP]).toEqual([
      6, 7, 7, 3, 8, 6, 5, 5, 6, 5
    ]);
    const solo = ROLES_CATALOG.find((r) => r.id === 'solo')!;
    expect(solo.edgerunnerStatTable[0]).toEqual({ INT: 6, REF: 7, DEX: 7, TECH: 3, COOL: 8, WILL: 6, LUCK: 5, MOVE: 5, BODY: 6, EMP: 5 });
  });

  it('Core pp.86-87: cada rol tiene 20 habilidades Streetrat', () => {
    for (const [role, v] of Object.entries(CORE_ROLE_TABLES.streetratSkills)) {
      expect(v.skills, role).toHaveLength(20);
    }
  });

  it('Core pp.86-87: todos los nombres de habilidad del libro se resuelven', () => {
    expect(UNRESOLVED_CANON_SKILL_NAMES).toEqual([]);
  });

  it('Core pp.81-85: 66 habilidades, 7 con x2 y 13 básicas', () => {
    expect(CORE_GEAR_SKILLS.skills).toHaveLength(66);
    expect(CORE_GEAR_SKILLS.skills.filter((s) => s.x2)).toHaveLength(7);
    expect(CORE_GEAR_SKILLS.skills.filter((s) => s.basic)).toHaveLength(13);
  });

  it('CEMK RB pp.35-36: Neuroport con 7 piezas y sin costos por pieza inventados', () => {
    expect(CEMK_CREATION.neuroport.pieces).toHaveLength(7);
    const era2077 = ERA_CATALOG.find((e) => e.id === '2077')!;
    expect(era2077.neuroportSubsystems!.length).toBeGreaterThanOrEqual(7);
    for (const sub of era2077.neuroportSubsystems!) {
      expect(sub.savedCost).not.toContain('€$ /');
    }
  });

  it('Core RED Easy Mode pp.37-45: PREGEN_TEMPLATES son las 5 pregens canon y ninguna de las inventadas', () => {
    expect(PREGEN_TEMPLATES).toHaveLength(5);
    for (const p of PREGEN_TEMPLATES) {
      expect(p.id.startsWith('pregen-easy-')).toBe(true);
      expect(p.sourceBadge).toContain('Easy Mode');
    }
    const banned = [
      'David Martinez',
      'Lucy (Kushinada)',
      'Rebecca',
      'Maine',
      'Kiwi',
      'Falco',
      'Pilar',
      'Hound',
      'Arasaka Black Ops Agent',
      'Maelstrom Chrome Psycho'
    ];
    for (const p of PREGEN_TEMPLATES) expect(banned).not.toContain(p.handle);
  });

  it('Los ids de ciberware de pregens y roles existen en el catálogo de la app', () => {
    const ids = new Set((pack as unknown as { cyberware: Array<{ id: string }> }).cyberware.map((c) => c.id));
    for (const p of PREGEN_TEMPLATES) for (const id of p.cyberwareIds) expect(ids.has(id), id).toBe(true);
    for (const r of ROLES_CATALOG) for (const id of r.startingLoadout.cyberwareIds) expect(ids.has(id), id).toBe(true);
  });

  it('CEMK RB: 7 pregens (Folios) en CEMK_CREATION', () => {
    expect(CEMK_CREATION.pregens).toHaveLength(7);
  });

  it('Core p.98: el paquete del Fixer trae dos pistolas "Heavy Pistol o Very Heavy Pistol"', () => {
    const pistols = CORE_GEAR_SKILLS.rolePackages.Fixer.weaponsArmor.items.filter((i) => i.name === 'Heavy Pistol');
    expect(pistols).toHaveLength(2);
    for (const p of pistols) expect(p.options).toEqual(['Very Heavy Pistol']);
    const fixer = ROLES_CATALOG.find((r) => r.id === 'fixer')!;
    expect(fixer.startingLoadout.weaponNames.filter((n) => n === 'Heavy Pistol')).toHaveLength(2);
    expect(fixer.startingLoadout.itemsBreakdown.filter((l) => l.startsWith('Heavy Pistol o Very Heavy Pistol'))).toHaveLength(2);
  });
});
