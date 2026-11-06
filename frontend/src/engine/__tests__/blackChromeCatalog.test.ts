// [Claude Code · 2026-11-06] v5.12.0 (plan 26): Black Chrome en el catálogo, ítems inventados fuera y aviso en las fichas.
import { describe, expect, it } from 'vitest';
import pack from '../../data/core-rules.cprpack.json';
import { REMOVED_CATALOG_ITEMS, removedItemsInSheet } from '../../data/removedCatalogItems';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';

type Row = { id: string; sourceBook?: string; sourceBookTitle?: string; sourcePage?: number };
const P = pack as unknown as Record<string, Row[]>;
const CATS = ['weapons', 'armor', 'cyberware', 'gear', 'ammunition', 'drugs'];
const all = CATS.flatMap((c) => P[c]);
const bc = (c: string) => P[c].filter((i) => i.sourceBook === 'black_chrome');

describe('Black Chrome en el catálogo (plan 26)', () => {
  it('ningún ítem borrado sigue en el catálogo', () => {
    const ids = new Set(all.map((i) => i.id));
    for (const r of REMOVED_CATALOG_ITEMS) expect(ids.has(r.id)).toBe(false);
  });

  it('todo ítem de Black Chrome y Black Chrome+ tiene página', () => {
    const items = all.filter((i) => i.sourceBook === 'black_chrome' || i.sourceBookTitle === 'Black Chrome+');
    expect(items.filter((i) => typeof i.sourcePage !== 'number')).toEqual([]);
  });

  it('cantidades del libro (BC pp.157-169): 52 armas (más 3 fluidos como equipo), 20 ciberware + 16 Cyberfingers + 4 Linear Frames, 14 armaduras', () => {
    expect(bc('weapons').length).toBe(52);
    expect(bc('cyberware').length).toBe(40);
    expect(bc('cyberware').filter((i) => i.id.startsWith('linear-frame-')).length).toBe(4);
    expect(bc('armor').length).toBe(14);
  });

  it('Black Chrome+: 6 armas, 3 municiones, 1 armadura, 1 droga', () => {
    const plus = (c: string) => P[c].filter((i) => i.sourceBookTitle === 'Black Chrome+').length;
    expect([plus('weapons'), plus('ammunition'), plus('armor'), plus('drugs')]).toEqual([6, 3, 1, 1]);
  });

  it('no hay ids repetidos', () => {
    const ids = all.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('una ficha con un ítem borrado lo conserva y el aviso lo nombra', () => {
    const base = CEMK_FOLIO_PREMADE_CHARACTERS[0];
    const sheet = {
      ...base,
      equippedWeapons: [...base.equippedWeapons, { ...base.equippedWeapons[0], id: 'borg-assault-rifle', name: 'Borg Assault Rifle' }],
      installedCyberwareIds: [...base.installedCyberwareIds, 'sponsored-cyberarm'],
      bodyArmor: { ...base.bodyArmor, name: 'Militech Tac-Vest' },
    };
    expect(removedItemsInSheet(sheet).map((i) => i.id).sort()).toEqual(['borg-assault-rifle', 'militech-tacvest', 'sponsored-cyberarm']);
    expect(removedItemsInSheet(base)).toEqual([]);
  });
});
