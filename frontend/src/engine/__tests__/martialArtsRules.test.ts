// Tests de requisitos y efectos de Special Moves (v4.9.6, plan15). [Claude Code · 2026-10-23]
import { describe, it, expect } from 'vitest';
import { ALL_MARTIAL_ART_MOVES, SHARED_MARTIAL_ARTS_MOVES } from '../../data/cyberfistsMartialArtsData';
import type { MartialArtMove } from '../../data/cyberfistsMartialArtsData';
import {
  checkMoveRequirements,
  describeMoveEffects,
  emptyTurnLog,
  moveSupportsHeadShot,
  resolveMoveRoll,
} from '../martialArtsRules';

const byId = (id: string): MartialArtMove => {
  const m = [...SHARED_MARTIAL_ARTS_MOVES, ...ALL_MARTIAL_ART_MOVES].find(x => x.id === id);
  if (!m) throw new Error(`move ${id}`);
  return m;
};
const sheet = (stats: Record<string, number>, generalSkills: Record<string, number> = {}) => ({ stats, generalSkills });

describe('Martial Arts Special Moves: datos estructurados', () => {
  it('los 55 movimientos (Recovery + 54) tienen effects no vacío (Core pp.178-180; Interface RED Vol. 4 pp.76-83)', () => {
    const all = [...SHARED_MARTIAL_ARTS_MOVES, ...ALL_MARTIAL_ART_MOVES];
    expect(all).toHaveLength(55);
    for (const m of all) expect(m.effects && m.effects.length, m.id).toBeGreaterThan(0);
  });
});

describe('checkMoveRequirements', () => {
  it('Bone Breaking Strike pide WILL 8+ (Core p.179)', () => {
    const m = byId('karate-bone-breaking-strike');
    const low = checkMoveRequirements(m, sheet({ WILL: 7 }), 1, emptyTurnLog(), {});
    expect(low.ok).toBe(false);
    expect(low.items.find(i => i.kind === 'stat')).toMatchObject({ ok: false, label: 'WILL 8+ (tenés 7)' });
    expect(checkMoveRequirements(m, sheet({ WILL: 8 }), 1, emptyTurnLog(), {}).ok).toBe(true);
  });

  it('Disarming Combination: sin golpes falla; con Brawling + Martial Arts y confirmación pasa (Core p.179)', () => {
    const m = byId('aikido-disarming-combination');
    const confirmText = m.req?.confirm?.[0] ?? '';
    expect(checkMoveRequirements(m, sheet({}), 1, emptyTurnLog(), { [confirmText]: true }).ok).toBe(false);
    const log = emptyTurnLog();
    log.hitsByType.brawling = 1;
    log.hitsByType.martial_arts = 1;
    expect(checkMoveRequirements(m, sheet({}), 1, log, {}).ok).toBe(false);
    expect(checkMoveRequirements(m, sheet({}), 1, log, { [confirmText]: true }).ok).toBe(true);
  });

  it('una vez por turno: movesUsed bloquea (Core p.179)', () => {
    const m = byId('aikido-disarming-combination');
    const confirmText = m.req?.confirm?.[0] ?? '';
    const log = emptyTurnLog();
    log.hitsByType.brawling = 1;
    log.hitsByType.martial_arts = 1;
    log.movesUsed.push(m.id);
    const r = checkMoveRequirements(m, sheet({}), 1, log, { [confirmText]: true });
    expect(r.ok).toBe(false);
    expect(r.items.find(i => i.kind === 'once')).toMatchObject({ ok: false, label: 'Ya lo usaste este turno' });
  });

  it('Flying Kick: MOVE 8 y moverse 4 m (Core p.180)', () => {
    const m = byId('tkd-flying-kick');
    const log = emptyTurnLog();
    log.movedMeters = 3;
    expect(checkMoveRequirements(m, sheet({ MOVE: 8 }), 1, log, {}).ok).toBe(false);
    log.movedMeters = 4;
    expect(checkMoveRequirements(m, sheet({ MOVE: 8 }), 1, log, {}).ok).toBe(true);
  });

  it('Woo Technique pide Handgun 4+ o Combat Awareness 1, como confirmación (Interface RED Vol. 4 p.78)', () => {
    const m = byId('gun-fu-woo-technique');
    const [alt, weapon] = m.req?.confirm ?? [];
    expect(alt).toContain('Combat Awareness');
    expect(checkMoveRequirements(m, sheet({}, { Handgun: 0 }), 1, emptyTurnLog(), { [weapon]: true }).ok).toBe(false);
    expect(checkMoveRequirements(m, sheet({}, { Handgun: 0 }), 1, emptyTurnLog(), { [alt]: true, [weapon]: true }).ok).toBe(true);
  });

  it('Five Forms exige rango 4 en Kung Fu (Interface RED Vol. 4 p.79)', () => {
    const m = byId('kung-fu-five-forms');
    expect(checkMoveRequirements(m, sheet({}), 3, emptyTurnLog(), {}).ok).toBe(false);
    expect(checkMoveRequirements(m, sheet({}), 4, emptyTurnLog(), {}).ok).toBe(true);
  });

  it('Sweeping Fist cuenta golpes de ESTA forma (Interface RED Vol. 4 p.77)', () => {
    const m = byId('choy-li-fut-sweeping-fist');
    const confirmText = m.req?.confirm?.[0] ?? '';
    const log = emptyTurnLog();
    log.formHits['choy-li-fut'] = 1;
    expect(checkMoveRequirements(m, sheet({ MOVE: 6 }), 1, log, { [confirmText]: true }).ok).toBe(false);
    log.formHits['choy-li-fut'] = 2;
    expect(checkMoveRequirements(m, sheet({ MOVE: 6 }), 1, log, { [confirmText]: true }).ok).toBe(true);
  });
});

describe('resolveMoveRoll', () => {
  it('empate no acierta: gana el defensor (Core p.129)', () => {
    expect(resolveMoveRoll(byId('karate-bone-breaking-strike'), 15, 15)).toEqual({ hit: false, dv: 15 });
  });
  it('DV fijo 15: con 16 acierta (Core p.179)', () => {
    expect(resolveMoveRoll(byId('aikido-disarming-combination'), 16, 99)).toEqual({ hit: true, dv: 15 });
    expect(resolveMoveRoll(byId('aikido-disarming-combination'), 15, 0).hit).toBe(false);
  });
  it('movimiento opuesto usa la defensa (Core p.178)', () => {
    expect(resolveMoveRoll(byId('karate-bone-breaking-strike'), 16, 12)).toEqual({ hit: true, dv: 12 });
  });
});

describe('describeMoveEffects', () => {
  it('Bone Breaking con headShot: Cracked Skull + línea de Aimed Shot, decisión 43 (Core p.179)', () => {
    const m = byId('karate-bone-breaking-strike');
    expect(moveSupportsHeadShot(m)).toBe(true);
    const lines = describeMoveEffects(m, { headShot: true, table: 'core' });
    expect(lines.some(l => l.detail.includes('Cracked Skull'))).toBe(true);
    expect(lines.some(l => l.detail.includes('Aimed Shot') && l.detail.includes('decisión 43'))).toBe(true);
    expect(lines[0].source).toEqual({ book: 'Core', page: 179 });
    const body = describeMoveEffects(m, { headShot: false, table: 'core' });
    expect(body.some(l => l.detail.includes('Broken Ribs'))).toBe(true);
    expect(body.some(l => l.detail.includes('Aimed Shot'))).toBe(false);
  });

  it('Pressure Point con tabla CEMK usa Spinal Injury del Core con aviso decisión 47 (Core p.180)', () => {
    const lines = describeMoveEffects(byId('tkd-pressure-point-strike'), { headShot: false, table: 'cemk' });
    expect(lines.some(l => l.detail.includes('Spinal Injury') && l.detail.includes('decisión 47'))).toBe(true);
  });

  it('Borg Fist muestra 5d6 y 6d6 (Interface RED Vol. 4 p.81)', () => {
    const lines = describeMoveEffects(byId('panzerfaust-borg-fist'), { headShot: false, table: 'core' });
    const text = lines.map(l => l.detail).join(' ');
    expect(text).toContain('5d6');
    expect(text).toContain('6d6');
    expect(lines[0].source).toEqual({ book: 'Interface RED Vol. 4', page: 81 });
  });
});
