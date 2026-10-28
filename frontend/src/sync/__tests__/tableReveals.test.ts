// [Claude Code · 2026-10-28] v5.3.0 (plan 20, B.2): lo que el GM revela a la mesa.
import { describe, expect, it } from 'vitest';
import { buildNetReveal, parseNetReveal } from '../tableReveals';
import { revealOf, type EncounterEnemy } from '../../store/encounterStore';
import { toPublic, parsePublic } from '../encounterSync';
import type { NetArchitecturePreset } from '../../data/netAndRolesData';

const arch: NetArchitecturePreset = {
  id: 'a', name: 'Arasaka', difficulty: 'Standard', totalFloors: 3, loreDescription: 'secreto',
  floors: [
    { floorNumber: 1, type: 'Password', name: 'Puerta', dv: 8 },
    { floorNumber: 2, type: 'Black ICE', name: 'Hellhound', iceType: 'Hellhound', iceHp: 20, iceAtk: 6, iceDef: 2 },
    { floorNumber: 3, type: 'File', name: 'Datos', dv: 10, rewardOrDevice: 'Planos' }
  ]
};

describe('corrida NET para la mesa', () => {
  it('solo los pisos desbloqueados y sin HP/ATK/DEF del ICE ni recompensas', () => {
    const r = buildNetReveal(arch, [1, 2], 1);
    expect(r).toEqual({
      archName: 'Arasaka', totalFloors: 3, currentFloor: 2,
      floors: [{ floorNumber: 1, type: 'Password', name: 'Puerta', dv: 8 }, { floorNumber: 2, type: 'Black ICE', name: 'Hellhound', iceType: 'Hellhound' }]
    });
    expect(JSON.stringify(r)).not.toMatch(/iceHp|iceAtk|iceDef|reward|secreto/);
    expect(parseNetReveal(JSON.parse(JSON.stringify(r)))).toEqual(r);
  });
});

describe('enemigo revelado', () => {
  const enemy = {
    instanceId: 'e1', catalogId: 'c', name: 'Bodyguard', subtitle: 'Guardaespaldas', faction: 'Arasaka', threatTier: 'Mook', era: '2045', role: 'Solo',
    currentHp: 12, maxHp: 35, currentHeadSp: 7, maxHeadSp: 7, currentBodySp: 6, maxBodySp: 7, initiative: 9,
    stats: {} as EncounterEnemy['stats'], weapons: [{ name: 'Shotgun', skillBase: 10, damage: '5d6', rof: 1, mag: 4 }], combatBases: [], specialRules: ['Protege a su jefe']
  } as unknown as EncounterEnemy;

  it('la ficha pública nunca lleva los HP', () => {
    expect(revealOf(enemy)).toEqual({ subtitle: 'Guardaespaldas', faction: 'Arasaka', threatTier: 'Mook', headSp: 7, bodySp: 6, weapons: ['Shotgun (5d6)'], specialRules: ['Protege a su jefe'] });
    const hidden = toPublic({ id: 'e1', kind: 'enemy', name: 'Bodyguard', initiative: 9, enemy }, () => undefined);
    expect(hidden.reveal).toBeUndefined();
    const shown = toPublic({ id: 'e1', kind: 'enemy', name: 'Bodyguard', initiative: 9, enemy, revealed: true }, () => undefined);
    expect(JSON.stringify(shown)).not.toMatch(/currentHp|maxHp|"12"|35/);
    expect(parsePublic(JSON.parse(JSON.stringify(shown)))?.reveal).toEqual(revealOf(enemy));
  });
});
