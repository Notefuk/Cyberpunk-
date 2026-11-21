// Cobertura canon. Core p.182 (tabla y reglas) y p.183 (ejemplos y escudos). [Claude Code · 2026-11-20]
import { describe, expect, it } from 'vitest';
import { COVER_MATERIALS, BULLETPROOF_SHIELD_HP } from '../../data/coverTable';
import { applyCoverDamage, canDamageSteelUnarmed, coverMaxHp, createCover, isUnarmedBlockedBySteel, restoreCover } from '../cover';

describe('tabla de cobertura (Core p.182)', () => {
  it('tiene los 6 materiales del libro con sus HP grueso/fino', () => {
    const table = Object.fromEntries(COVER_MATERIALS.map((m) => [m.id, [m.thickHp, m.thinHp]]));
    expect(table).toEqual({
      steel: [50, 25],
      stone: [40, 20],
      bulletproof_glass: [30, 15],
      concrete: [25, 10],
      wood: [20, 5],
      plaster_foam_plastic: [15, 0],
    });
  });

  it('Plaster/Foam/Plastic fino no es cobertura', () => {
    expect(coverMaxHp('plaster_foam_plastic', 'thin')).toBeNull();
    expect(createCover('plaster_foam_plastic', 'thin')).toBeNull();
    expect(coverMaxHp('plaster_foam_plastic', 'thick')).toBe(15);
  });

  it('el Bulletproof Shield tiene 10 HP (Core p.350)', () => {
    expect(BULLETPROOF_SHIELD_HP).toBe(10);
  });
});

describe('daño a la cobertura (Core p.182)', () => {
  it('ejemplo de Gina: concreto grueso 25 HP, 17 de daño deja 8; el segundo tiro la destruye', () => {
    const barricade = createCover('concrete', 'thick')!;
    expect(barricade.hp).toBe(25);
    const first = applyCoverDamage(barricade, 17);
    expect(first.cover.hp).toBe(8);
    expect(first.cover.destroyed).toBe(false);
    const second = applyCoverDamage(first.cover, 17);
    expect(second.cover.hp).toBe(0);
    expect(second.cover.destroyed).toBe(true);
  });

  it('a 0 HP el daño que sobra se pierde y no pasa al que está detrás', () => {
    const door = createCover('wood', 'thin')!;
    const r = applyCoverDamage(door, 12);
    expect(r.absorbed).toBe(5);
    expect(r.lost).toBe(7);
    expect(r.cover.destroyed).toBe(true);
  });

  it('una cobertura destruida no absorbe más', () => {
    const destroyed = applyCoverDamage(createCover('wood', 'thin')!, 5).cover;
    const r = applyCoverDamage(destroyed, 10);
    expect(r.absorbed).toBe(0);
    expect(r.cover.hp).toBe(0);
  });

  it('el daño negativo o con decimales no rompe el estado', () => {
    const c = createCover('steel', 'thin')!;
    expect(applyCoverDamage(c, -3).cover.hp).toBe(25);
    expect(applyCoverDamage(c, 4.7).cover.hp).toBe(21);
  });

  it('restaurar vuelve a los HP máximos', () => {
    const destroyed = applyCoverDamage(createCover('stone', 'thick')!, 99).cover;
    expect(restoreCover(destroyed)).toMatchObject({ hp: 40, destroyed: false });
  });
});

describe('acero contra Martial Arts y Brawling (Core p.182)', () => {
  it('sin Cyberarm y con BODY menor a 10 no se puede dañar', () => {
    expect(canDamageSteelUnarmed(false, 9)).toBe(false);
    expect(isUnarmedBlockedBySteel('steel', false, 6)).toBe(true);
  });
  it('con Cyberarm o BODY 10 sí', () => {
    expect(canDamageSteelUnarmed(true, 4)).toBe(true);
    expect(canDamageSteelUnarmed(false, 10)).toBe(true);
  });
  it('la restricción es solo para acero', () => {
    expect(isUnarmedBlockedBySteel('concrete', false, 4)).toBe(false);
  });
});
