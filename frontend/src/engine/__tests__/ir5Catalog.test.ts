// [Claude Code · 2026-11-12] v5.25.0 (plan 30): arsenal de Solo of Fortune 2045, Interface RED Vol. 5 (pp.105-147).
import { describe, expect, it } from 'vitest';
import pack from '../../data/core-rules.cprpack.json';
import { WEAPON_RANGE_PROFILES, getWeaponRangeProfile, parseAutofireMode } from '../../data/rangeTables';
import { autofireClass, autofireMax, AUTOFIRE_DV } from '../actorAttack';
import { armorStatPenalty, getAutofireRulesSummary } from '../characterEngine';
import { FBC_13_BODIES, FBC_16_CYBERWARE } from '../../data/goingMetalFbcData';
import type { CharacterSheet, WeaponItem } from '../../types/cyberpunk';

type Row = { id: string; name: string; sourceBookTitle?: string; sourcePage?: number; rangeTable?: string; altFireModes?: string };
const sections = pack as unknown as Record<string, Row[]>;
const ir5 = (k: string) => sections[k].filter((i) => i.sourceBookTitle === 'Interface RED Volume 5');

describe('Solo of Fortune 2045 en el catálogo (IR5)', () => {
  it('trae lo del artículo: 13 armas y una reimpresión, 8 attachments, 12 municiones y explosivos', () => {
    expect(ir5('weapons')).toHaveLength(14);
    expect(ir5('attachments')).toHaveLength(8);
    expect(ir5('ammunition')).toHaveLength(12);
  });

  it('3 Metalgear, 3 piezas de equipo, 8 drogas de combate y el Sycust Cyberspine', () => {
    expect(ir5('armor').map((a) => a.name)).toEqual(['Light Metalgear®', 'Hybrid Metalgear®', 'Heavy Metalgear®']);
    expect(ir5('gear')).toHaveLength(3);
    expect(ir5('drugs')).toHaveLength(8);
    expect(ir5('cyberware').map((c) => c.name)).toEqual(['Sycust Cyberspine']);
  });

  it('cada ítem cita una página impresa del artículo (pp.105-147)', () => {
    for (const k of ['weapons', 'attachments', 'ammunition', 'armor', 'gear', 'drugs', 'cyberware']) {
      for (const it of ir5(k)) {
        expect(it.sourcePage, it.id).toBeGreaterThanOrEqual(105);
        expect(it.sourcePage, it.id).toBeLessThanOrEqual(147);
      }
    }
  });

  it('la tabla de rango de cada arma existe', () => {
    for (const w of ir5('weapons')) {
      if (w.rangeTable) expect(WEAPON_RANGE_PROFILES[w.rangeTable], w.id).toBeDefined();
    }
  });
});

describe('Tablas de rango y Autofire expandidos (IR5 p.113)', () => {
  const find = (id: string) => sections.weapons.find((w) => w.id === id) as unknown as WeaponItem;

  it('el MK.27 usa la tabla de Assault Rifle de IR5 y el Autofire de Machine Gun', () => {
    const p = getWeaponRangeProfile(find('ir5-militech-mk27-lmg'))!;
    expect(p.dvs['26-50m']).toBe(13);
    expect(p.dvs['401-800m']).toBe(30);
    expect(p.autofireDvs).toEqual({ '0-6m': 21, '7-12m': 18, '13-25m': 18, '26-50m': 19, '51-100m': 25 });
    expect(p.autofireMaxMultiplier).toBe(4);
  });

  it('el Big Boomer usa Snubnose Pistol y Autofire de Machine Pistol', () => {
    const p = getWeaponRangeProfile(find('ir5-militech-big-boomer'))!;
    expect(p.dvs['0-6m']).toBe(12);
    expect(p.dvs['101-200m']).toBeNull();
    expect(p.autofireDvs?.['0-6m']).toBe(17);
  });

  it('las armas del Core no cambian de tabla', () => {
    const p = getWeaponRangeProfile(find('assault-rifle'))!;
    expect(p).toBe(WEAPON_RANGE_PROFILES.assault_rifle);
  });

  it('lee el modo de Autofire con y sin clase', () => {
    expect(parseAutofireMode('Autofire (Machine Gun 5), Suppressive Fire')).toEqual({ table: 'machine_gun', max: 5 });
    expect(parseAutofireMode('Autofire (Machine Pistol 4)')).toEqual({ table: 'machine_pistol', max: 4 });
    expect(parseAutofireMode('Autofire (4), Suppressive Fire')).toEqual({ table: null, max: 4 });
    expect(parseAutofireMode('Explosive')).toBeNull();
  });

  it('un enemigo con Machine Gun usa su fila de Autofire en el Modo GM', () => {
    const w = { name: 'Militech MK.27 LMG', altFireModes: 'Autofire (Machine Gun 4), Suppressive Fire' };
    expect(autofireMax(w)).toBe(4);
    expect(autofireClass(w, 4)).toBe('mg');
    expect(AUTOFIRE_DV.mg).toEqual([21, 18, 18, 19, 25]);
    expect(AUTOFIRE_DV.mp).toEqual([17, 20, 22, 27, 30]);
  });

  it('el resumen de Autofire de la ficha lee el tope "Machine Gun 5"', () => {
    const w = { ...find('ir5-midnight-arms-midnight-assault-hb'), autofireMaxMult: undefined };
    expect(getAutofireRulesSummary(w).maxMultiplier).toBe(5);
  });
});

describe('Metalgear de IR5 p.123: penalización distinta por stat', () => {
  const sheet = (penalty: number, penaltyDex?: number, penaltyMove?: number) =>
    ({
      headArmor: { name: 'h', maxSp: 19, currentSp: 19, penalty, penaltyDex, penaltyMove },
      bodyArmor: { name: 'b', maxSp: 0, currentSp: 0, penalty: 0 },
    }) as Pick<CharacterSheet, 'headArmor' | 'bodyArmor'>;

  it('Heavy Metalgear: -4 REF, -5 DEX, -5 MOVE', () => {
    const s = sheet(-4, -5, -5);
    expect(armorStatPenalty(s, 'REF')).toBe(4);
    expect(armorStatPenalty(s, 'DEX')).toBe(5);
    expect(armorStatPenalty(s, 'MOVE')).toBe(5);
  });

  it('la armadura del Core sigue con una sola penalización para las tres', () => {
    const s = sheet(-4);
    expect(armorStatPenalty(s, 'DEX')).toBe(4);
    expect(armorStatPenalty(s, 'MOVE')).toBe(4);
  });
});

describe('Going Metal (Interface RED Vol. 3): conteos', () => {
  // La Companion App dice 16 piezas; el libro lista 20 contando las variantes (Hydraulics tuned y perfected,
  // Dragoon Plating con Metalgear, etc.; Going Metal pp.104-109, tabla p.111).
  it('13 cuerpos y 20 piezas de ciberware', () => {
    expect(FBC_13_BODIES).toHaveLength(13);
    expect(FBC_16_CYBERWARE).toHaveLength(20);
  });
});
