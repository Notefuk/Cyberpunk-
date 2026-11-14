// [Claude Code · 2026-11-14] v5.41.0 (plan 33): Going Quiet (Flash of Luck p.3, Stealth Netrunning pp.4-5, ítems pp.5-7).
import { describe, expect, it } from 'vitest';
import pack from '../../data/core-rules.cprpack.json';
import {
  FLASH_OF_LUCK_TIERS, applyFlashOfLuck, beatKey, canUseFlashOfLuck, newMission, refundLastFlashOfLuck
} from '../flashOfLuck';
import { blackIceStealth, quietJackIn, watcherEncounter, watcherSearch } from '../netStealth';

describe('Flash of Luck (Going Quiet p.3)', () => {
  it('cuesta 2, 4 u 8 de Luck con topes de 100, 500 y 1,000eb', () => {
    expect(FLASH_OF_LUCK_TIERS.map((t) => [t.luckCost, t.maxSpendEb])).toEqual([[2, 100], [4, 500], [8, 1000]]);
  });
  it('una vez por Beat, tres por misión, y apagada si el GM no la prende', () => {
    const b1 = beatKey({ session: 1, day: 1, beat: 1 });
    const b2 = beatKey({ session: 1, day: 1, beat: 2 });
    expect(canUseFlashOfLuck(undefined, b1, 10, 'simple', false)).toMatchObject({ ok: false });
    expect(canUseFlashOfLuck(undefined, b1, 10, 'simple', true)).toEqual({ ok: true });
    let s = applyFlashOfLuck(undefined, b1, 'simple', 'llamé a un amigo', 't');
    expect(canUseFlashOfLuck(s, b1, 10, 'simple', true)).toMatchObject({ ok: false, reason: 'Ya se usó en este Beat.' });
    s = applyFlashOfLuck(s, b2, 'simple', 'x', 't');
    s = applyFlashOfLuck(s, 'b3', 'simple', 'y', 't');
    expect(canUseFlashOfLuck(s, 'b4', 10, 'simple', true)).toMatchObject({ ok: false });
    expect(canUseFlashOfLuck(newMission(s), 'b4', 10, 'simple', true)).toEqual({ ok: true });
    expect(canUseFlashOfLuck(undefined, b1, 3, 'unlikely', true)).toMatchObject({ ok: false });
  });
  it('si no se pudo comprar, vuelve la Luck y el uso no cuenta', () => {
    const s = applyFlashOfLuck(undefined, 'b1', 'unlikely', 'rifle escondido', 't');
    const r = refundLastFlashOfLuck(s)!;
    expect(r.luck).toBe(4);
    expect(r.state.missionUses).toBe(0);
    expect(refundLastFlashOfLuck(r.state)).toBeNull();
  });
});

describe('Stealth Netrunning (Going Quiet pp.4-5)', () => {
  it('Quietly Jack In: hay que ganarle a todos los Watchers (ejemplo de Redeye)', () => {
    const r = quietJackIn(4, 8, [{ watcher: { name: 'Imp', interface: 3 }, d10: 7 }, { watcher: { name: 'Corp', interface: 4 }, d10: 2 }]);
    expect(r.total).toBe(12);
    expect(r.stealthed).toBe(true);
    expect(quietJackIn(4, 6, [{ watcher: { name: 'Imp', interface: 3 }, d10: 7 }]).stealthed).toBe(false);
  });
  it('Black ICE: Interface + Cloak contra su PER (ejemplo del Asp: 9 vs 8)', () => {
    expect(blackIceStealth(4, 2, 3, 4, 4)).toEqual({ attacker: 9, defender: 8, success: true });
    expect(blackIceStealth(4, 0, 4, 4, 4).success).toBe(false);
  });
  it('Watchers: cruzarse (21 vs 5) y búsqueda con Pathfinder (16 vs 11 rompe el sigilo)', () => {
    expect(watcherEncounter(4, 2, 15, { name: 'Imp', interface: 3 }, 2).success).toBe(true);
    expect(watcherSearch({ name: 'Corp', interface: 4, pathfinderBonus: 3 }, 9, 4, 2, 5).success).toBe(true);
    expect(watcherSearch({ name: 'Corp', interface: 4 }, 3, 4, 0, 3).success).toBe(false);
  });
});

describe('Ítems de Going Quiet (pp.5-7)', () => {
  const all = [...pack.gear, ...pack.cyberware] as { id: string; cost: number; sourcePage?: number; sourceBookTitle?: string }[];
  const gq = all.filter((i) => i.sourceBookTitle === 'Going Quiet');
  it('los 14 ítems (el Branded Jumpsuit en sus 4 precios) con página', () => {
    expect(gq).toHaveLength(17);
    expect(gq.every((i) => i.id.startsWith('gq-') && (i.sourcePage ?? 0) >= 5 && (i.sourcePage ?? 0) <= 7)).toBe(true);
    expect(gq.find((i) => i.id === 'gq-militech-m97-ghostsuit')?.cost).toBe(5000);
    expect(gq.find((i) => i.id === 'gq-translation-chip')?.cost).toBe(1000);
    expect(gq.filter((i) => i.id.startsWith('gq-branded-jumpsuit')).map((i) => i.cost)).toEqual([50, 100, 500, 1000]);
  });
});
