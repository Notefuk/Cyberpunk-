// [Claude Code · 2026-11-12] v5.24.0: Autofire y Suppressive Fire de un actor (Core pp.173-174).
import { describe, it, expect } from 'vitest';
import { autofireMax, autofireClass, enemyAutofireBase, rollAutofire, rollSuppression, resistsSuppression, AUTOFIRE_DV } from '../actorAttack';

const seq = (...vals: number[]) => {
  let i = 0;
  return () => vals[i++ % vals.length];
};

describe('Autofire (Core p.173)', () => {
  it('el tope sale de la ficha o del tipo de arma', () => {
    expect(autofireMax({ name: 'Militech Ronin Assault Rifle', notes: 'Autofire x4' })).toBe(4);
    expect(autofireMax({ name: 'Arma rara', notes: 'Autofire x5 (solo Autofire)' })).toBe(5);
    expect(autofireMax({ name: 'Heavy SMG' })).toBe(3);
    expect(autofireMax({ name: 'Assault Rifle' })).toBe(4);
    expect(autofireMax({ name: 'Heavy Pistol' })).toBeNull();
  });

  it('elige la fila de la tabla y la base de la ficha', () => {
    expect(autofireClass({ name: 'Danger Gal Smart SMG' }, 3)).toBe('smg');
    expect(autofireClass({ name: 'Rifle raro' }, 5)).toBe('ar');
    expect(AUTOFIRE_DV.ar[2]).toBe(17);
    expect(AUTOFIRE_DV.smg[0]).toBe(20);
    expect(enemyAutofireBase({ Autofire: 12 }, { name: 'x', notes: 'Autofire base 14' })).toBe(12);
    expect(enemyAutofireBase(undefined, { name: 'x', notes: 'Autofire base 14 (12 con penalizacion)' })).toBe(14);
    expect(enemyAutofireBase({}, { name: 'x' })).toBeNull();
  });

  it('el ejemplo del libro: 21 contra DV 17 con un Assault Rifle, 2d6 = 10 por 4 = 40', () => {
    // d10 7 (rng 0.6); 2d6 = 4 + 6 (rng 0.5, 0.99).
    const r = rollAutofire({ base: 14, dv: 17, maxMultiplier: 4 }, seq(0.6, 0.5, 0.99));
    expect(r).toEqual({ d10: 7, total: 21, hit: true, multiplier: 4, dice: [4, 6], damage: 40, critical: false });
  });

  it('el multiplicador no pasa el tope del arma, y dos 6 son crítico', () => {
    const r = rollAutofire({ base: 20, dv: 17, maxMultiplier: 3 }, seq(0.6, 0.99, 0.99));
    expect(r.multiplier).toBe(3);
    expect(r.damage).toBe(36);
    expect(r.critical).toBe(true);
  });

  it('igualar el DV no impacta (CEMK p.5)', () => {
    expect(rollAutofire({ base: 10, dv: 17, maxMultiplier: 4 }, seq(0.6)).hit).toBe(false);
  });
});

describe('Suppressive Fire (Core p.174)', () => {
  it('REF + Autofire + 1d10 del que suprime; el empate lo gana el que resiste (CEMK p.5)', () => {
    expect(rollSuppression(12, seq(0.6))).toEqual({ d10: 7, total: 19 });
    expect(resistsSuppression(19, 19)).toBe(true);
    expect(resistsSuppression(18, 19)).toBe(false);
  });
});
