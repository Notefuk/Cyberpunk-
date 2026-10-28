// [Claude Code · 2026-10-27] v5.1.0 (plan 19, punto 4): log de tiradas de la mesa.
import { describe, expect, it, vi } from 'vitest';
import { createTableLogPublisher, rollToLog, deathSaveToLog, isAutoShared, type TableLogEntry } from '../tableLog';
import type { RollEntry } from '../../types/cyberpunk';

const base = (id: string, over: Partial<RollEntry>): RollEntry =>
  ({ id, timestamp: '2026-10-27T00:00:00Z', type: 'skill', weaponName: 'x', ...over }) as RollEntry;

const attack = (id: string) => base(id, { type: 'attack', weaponName: 'Heavy Pistol', totalAttack: 17, targetDv: 15, isHit: true, distanceLabel: '7-12 m' });
const damage = (id: string) => base(id, { type: 'damage', weaponName: 'Heavy Pistol', finalDamageTotal: 11, diceResults: [6, 5] });
const init = (id: string) => base(id, { type: 'skill', skillName: 'Iniciativa', totalAttack: 14, penaltyBreakdown: ['1d10(6) + REF 8'] });
const skill = (id: string) => base(id, { type: 'skill', skillName: 'Perception', totalAttack: 13 });

function setup(initial: RollEntry[] = []) {
  const created: TableLogEntry[] = [];
  const pub = createTableLogPublisher({
    adapter: { create: async (e) => { created.push(e); }, subscribe: () => () => {}, trim: async () => 0 },
    who: () => ({ uid: 'alice', charId: 'c1', handle: 'Vex' }),
    initial
  });
  return { pub, created };
}

describe('log de la mesa', () => {
  it('publica combate e iniciativa solos; una tirada de skill no', () => {
    const { pub, created } = setup();
    pub.onHistory([skill('s1'), init('i1'), damage('d1'), attack('a1')]);
    expect(created.map((e) => e.kind).sort()).toEqual(['attack', 'initiative']);
    expect(isAutoShared(skill('s1'))).toBe(false);
  });

  // Decisión de Giuliano (2026-10-27, cuota): ataque + daño en una sola línea.
  it('el ataque que pega sale junto con su daño, en una sola entrada', () => {
    const { pub, created } = setup();
    pub.onHistory([attack('a1')]);
    expect(created).toEqual([]);
    pub.onHistory([damage('d1'), attack('a1')]);
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({ id: 'a1', kind: 'attack', total: 17 });
    expect(created[0].detail).toBe('vs DV 15 · impacta · 7-12 m · daño 11 (dados 6, 5)');
  });

  it('un ataque que falla sale enseguida; uno que pega sin daño sale solo a los 20 s', () => {
    vi.useFakeTimers();
    try {
      const { pub, created } = setup();
      pub.onHistory([{ ...attack('miss'), isHit: false }]);
      expect(created.map((e) => e.id)).toEqual(['miss']);
      pub.onHistory([attack('a2'), { ...attack('miss'), isHit: false }]);
      vi.advanceTimersByTime(19999);
      expect(created).toHaveLength(1);
      vi.advanceTimersByTime(1);
      expect(created.map((e) => e.id)).toEqual(['miss', 'a2']);
      // Un daño suelto (sin ataque esperando) sale solo.
      pub.onHistory([{ ...damage('d9'), weaponName: 'Otra' }]);
      expect(created.map((e) => e.kind)).toEqual(['attack', 'attack', 'damage']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('no repite entradas ni publica lo que había al abrir la mesa', () => {
    const { pub, created } = setup([attack('viejo')]);
    pub.onHistory([attack('viejo')]);
    pub.onHistory([attack('a1'), attack('viejo')]);
    // triggerExplosionClick / markAttackDamageRolled cambian la entrada con el mismo id.
    pub.onHistory([{ ...attack('a1'), damageRolled: true }, attack('viejo')]);
    pub.flush();
    pub.flush();
    expect(created.map((e) => e.id)).toEqual(['a1']);
  });

  it('"Mostrar a la mesa" publica una tirada de skill vieja, una sola vez', () => {
    const { pub, created } = setup();
    pub.onHistory([skill('s1')]);
    expect(created).toEqual([]);
    pub.onHistory([{ ...skill('s1'), shareWithTable: true }]);
    pub.onHistory([{ ...skill('s1'), shareWithTable: true }]);
    expect(created.map((e) => e.id)).toEqual(['s1']);
    expect(created[0]).toMatchObject({ kind: 'skill', label: 'Perception (x)', total: 13, handle: 'Vex', charId: 'c1', _by: 'alice' });
  });

  it('entradas cortas con los topes de las reglas', () => {
    const e = rollToLog(base('l', { type: 'skill', skillName: 'S'.repeat(200), totalAttack: 3, penaltyBreakdown: ['d'.repeat(400)] }), { uid: 'u', handle: 'H'.repeat(80) });
    expect(e.label.length).toBeLessThanOrEqual(120);
    expect(e.detail!.length).toBeLessThanOrEqual(300);
    expect(e.handle.length).toBeLessThanOrEqual(60);
    expect(e).not.toHaveProperty('charId');
    expect(rollToLog(base('p', { skillName: 'Perception', weaponName: '👁️ Perception (Core p.82)' }), { uid: 'u', handle: 'Vex' }).label).toBe('Perception');
    const a = rollToLog(attack('a'), { uid: 'u', handle: 'Vex' });
    expect(a).toMatchObject({ kind: 'attack', label: 'Ataque: Heavy Pistol', total: 17, detail: 'vs DV 15 · impacta · 7-12 m' });
  });

  it('Death Save con su resultado (Core p.188)', () => {
    const e = deathSaveToLog({ d10: 4, basePenalty: 1, accumulatedPenalty: 1, total: 6, deathSaveValue: 7, autoFail: false, success: true }, { uid: 'u', handle: 'Vex' });
    expect(e).toMatchObject({ kind: 'deathSave', label: 'Death Save', total: 6 });
    expect(e.detail).toContain('sobrevive');
  });
});
