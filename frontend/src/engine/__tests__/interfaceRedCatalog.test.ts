// [Claude Code · 2026-11-10] v5.15.0 (plan 27): ciberware de los Interface RED y sus DLC en el catálogo.
import { describe, expect, it } from 'vitest';
import pack from '../../data/core-rules.cprpack.json';
import { parseHumanityLoss } from '../../features/cyberware/ripperdocZones';
import { REMOVED_CATALOG_ITEMS } from '../../data/removedCatalogItems';
import { CYBERDECK_SLOTS, HARDWARE_SLOTS, deckSlotUse } from '../creatorShop';
import { pilotWeaponSkill, isPlacedExplosive } from '../weaponAttackLines';
import { EXPANSION_RULE_SYSTEMS } from '../../data/expansionRulesData';

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

type Any = { id: string; name: string; sourceBookTitle?: string; sourcePage?: number; skill?: string; damage?: string; standardMag?: number; cost: number };
const P = pack as unknown as Record<string, Any[]>;
const inBook = (cat: string, t: string) => P[cat].filter((i) => i.sourceBookTitle === t);

describe('Armas, cyberdecks y equipo de Interface RED (plan 27, v5.16.0)', () => {
  it("Woodchipper's Garage: 12 armas (pp.3-6); el Sternmeyer M-02 vuelve y ya no figura como borrado", () => {
    expect(inBook('weapons', "Woodchipper's Garage")).toHaveLength(12);
    const m02 = P.weapons.find((w) => w.id === 'sternmeyer-m02');
    expect([m02?.damage, m02?.standardMag, m02?.cost, m02?.sourcePage]).toEqual(['5d6', 80, 1000, 5]);
    expect(REMOVED_CATALOG_ITEMS.some((r) => r.id === 'sternmeyer-m02')).toBe(false);
  });

  it('Midnight with the Upload: 15 cyberdecks y 11 de Hardware con sus slots en la tienda (pp.3-7)', () => {
    const items = inBook('gear', 'Midnight with the Upload');
    expect(items.filter((i) => i.id.startsWith('cyberdeck-'))).toHaveLength(15);
    expect(items.filter((i) => i.id.startsWith('hw-'))).toHaveLength(11);
    expect(CYBERDECK_SLOTS['cyberdeck-sgi-technologies-kerberos']).toBe(11);
    expect(HARDWARE_SLOTS['hw-bushido-accelerator']).toBe(2); // tabla de p.7
    expect(CYBERDECK_SLOTS['cyberdeck-standard']).toBe(7); // los del Core siguen igual
    const use = deckSlotUse([
      { category: 'gear', catalogId: 'cyberdeck-sgi-technologies-kerberos', qty: 1 },
      { category: 'programs', catalogId: 'eraser', qty: 10 },
      { category: 'gear', catalogId: 'hw-aerie', qty: 1 }
    ]);
    expect(use.overflow).toBe(1);
  });

  it('12 Days of Gearmas (IR4 pp.66-68): 12 ítems en el catálogo; el Zonda Metrocar va con los vehículos', () => {
    const all = ['gear', 'armor', 'cyberware', 'weapons'].flatMap((c) => inBook(c, 'Interface RED Volume 4'));
    const gearmas = all.filter((i) => (i.sourcePage ?? 0) >= 66 && (i.sourcePage ?? 0) <= 68);
    expect(gearmas).toHaveLength(12);
  });

  it('drones (IR1 pp.59-63), equipo de clima (IR2 p.20) y de Stickball (IR4 p.34)', () => {
    // v5.17.0: las Cyberchairs (IR1 p.38) también son del Vol. 1; los drones son los de pp.59-63.
    expect(inBook('gear', 'Interface RED Volume 1').filter((i) => (i.sourcePage ?? 0) >= 59 && (i.sourcePage ?? 0) <= 63)).toHaveLength(6);
    expect(inBook('gear', 'Interface RED Volume 2').filter((i) => i.sourcePage === 20)).toHaveLength(5);
    expect([...inBook('gear', 'Interface RED Volume 4'), ...inBook('weapons', 'Interface RED Volume 4')].filter((i) => i.sourcePage === 34)).toHaveLength(2);
  });

  it('el Militech Archimedes se dispara con Pilot Air Vehicle, no con Handgun (Woodchipper p.4)', () => {
    const arch = P.weapons.find((w) => w.id === 'militech-archimedes')!;
    expect(pilotWeaponSkill(arch as { skill: string })).toBe('Pilot Air Vehicle');
    expect(pilotWeaponSkill({ skill: 'Heavy Weapons' })).toBeNull();
    expect(isPlacedExplosive(arch as { skill: string })).toBe(false);
  });

  it('Old Guns Never Die está en el Compendio de sistemas (IR1 pp.3-4)', () => {
    expect(EXPANSION_RULE_SYSTEMS.find((r) => r.id === 'old-guns-never-die')?.howItWorksSteps).toHaveLength(7);
  });
});
