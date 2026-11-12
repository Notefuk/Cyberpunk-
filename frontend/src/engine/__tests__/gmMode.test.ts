// [Claude Code · 2026-11-12] v5.21.0 (plan 28): panel MODO GM.
import { describe, expect, it } from 'vitest';
import { PREGEN_TEMPLATES, buildCharacterSheetFromPregen } from '../../data/characterCreationData';
import { buildGmPlayerCard, rollInitiativeForAll } from '../gmMode';

const grease = () => buildCharacterSheetFromPregen(PREGEN_TEMPLATES.find((p) => p.id === 'pregen-ss-grease')!);

describe('Tarjeta de jugador del Modo GM', () => {
  it('Grease (IR1 p.14): HP, Suerte, Humanidad y arma en mano', () => {
    const c = buildGmPlayerCard(grease());
    expect(c).toMatchObject({ handle: 'Grease', role: 'Fixer', currentHp: 35, maxHp: 35, woundState: 'none', luck: 7, luckMax: 7, humanity: 44, humanityMax: 60, eurodollars: 500 });
    expect(c.weapon?.name).toBe('Light Melee Weapon');
    expect(c.weapon?.mag).toBeNull();
  });

  it('Arma a distancia en mano: balas del cargador y reserva', () => {
    const s = grease();
    s.equippedWeapons = s.equippedWeapons.map((w) => ({ ...w, inHand: w.name === 'Heavy Pistol', reserveAmmo: w.name === 'Heavy Pistol' ? 13 : w.reserveAmmo }));
    s.equippedWeapons.find((w) => w.name === 'Heavy Pistol')!.currentMag = 3;
    expect(buildGmPlayerCard(s).weapon).toEqual({ name: 'Heavy Pistol', mag: 3, magMax: 8, reserve: 13 });
  });

  it('Condiciones con su nombre del libro y estado de heridas (Core p.186)', () => {
    const s = { ...grease(), currentHp: 10, conditions: [{ id: 'prone' }] };
    const c = buildGmPlayerCard(s);
    expect(c.conditions).toEqual(['Prone']);
    expect(c.woundState).toBe('serious');
  });
});

describe('Iniciativa de todos (Core p.168)', () => {
  it('REF + 1d10, d10 simple de 1 a 10', () => {
    expect(rollInitiativeForAll([{ id: 'a', ref: 7 }, { id: 'b', ref: 5 }], () => 0)).toEqual([{ id: 'a', total: 8 }, { id: 'b', total: 6 }]);
    expect(rollInitiativeForAll([{ id: 'a', ref: 7 }], () => 0.999)).toEqual([{ id: 'a', total: 17 }]);
  });
});
