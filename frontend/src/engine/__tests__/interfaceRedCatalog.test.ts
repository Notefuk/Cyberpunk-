// [Claude Code · 2026-11-10] v5.15.0 (plan 27): ciberware de los Interface RED y sus DLC en el catálogo.
import { describe, expect, it } from 'vitest';
import pack from '../../data/core-rules.cprpack.json';
import { parseHumanityLoss } from '../../features/cyberware/ripperdocZones';

type Row = { id: string; name: string; type: string; humanityLoss: string; cost: number; sourceBook?: string; sourceBookTitle?: string; sourcePage?: number };
const cyber = (pack as unknown as { cyberware: Row[] }).cyberware;
const byTitle = (t: string) => cyber.filter((i) => i.sourceBookTitle === t);

describe('Ciberware de Interface RED (plan 27, v5.15.0)', () => {
  it('Must Have Cyberware Deals: 12 ítems (pp.2-4)', () => {
    expect(byTitle('Must Have Cyberware Deals')).toHaveLength(12);
  });

  it('The 12 Days of Cybermas: 12 ítems (pp.3-5), igual que la tabla de p.8', () => {
    const items = byTitle('The 12 Days of Cybermas');
    expect(items).toHaveLength(12);
    const romanova = items.find((i) => i.name === 'Wyzard Technologies Romanova Cyberlegs');
    expect([romanova?.cost, romanova?.humanityLoss]).toEqual([1000, '14 (4d6)']);
  });

  it('Exotics of 2045 (IR2 pp.66-74): 17 paquetes y 3 ciberware nuevos; los repetidos no se duplican', () => {
    const items = byTitle('Interface RED Volume 2');
    expect(items.filter((i) => /Package$/.test(i.type))).toHaveLength(17);
    expect(items.filter((i) => !/Package$/.test(i.type)).map((i) => i.name).sort()).toEqual(['Combat Jaw', 'Combat Tail', 'Firebreather']);
    const names = cyber.map((i) => i.name.toLowerCase());
    for (const n of ['appetite controller', 'neutongue', 'reflex co-processor', 'heuristic health monitor', 'extra-jointed cyberlimb upgrade']) {
      expect(names.filter((x) => x === n)).toHaveLength(1);
    }
    const draconic = items.find((i) => i.id === 'draconic-fantaform');
    expect([draconic?.cost, draconic?.humanityLoss, draconic?.sourcePage]).toEqual([11000, '34', 71]);
  });

  it('todo ítem nuevo tiene página', () => {
    const items = [...byTitle('Must Have Cyberware Deals'), ...byTitle('The 12 Days of Cybermas'), ...byTitle('Interface RED Volume 2')];
    expect(items.filter((i) => typeof i.sourcePage !== 'number')).toEqual([]);
  });

  it('el HL fijo de los paquetes se lee bien en el Ripperdoc (22 no es 1d6/2)', () => {
    expect(parseHumanityLoss('22', 'average').amount).toBe(22);
    expect(parseHumanityLoss('22', 'roll').amount).toBe(22);
    expect(parseHumanityLoss('2 (1d6/2 Round up)', 'average').amount).toBe(2);
    expect(parseHumanityLoss('7 (2d6)', 'average').amount).toBe(7);
  });
});
