// [Claude Code · 2026-11-11] v5.17.0 (plan 27): movilidad de los Interface RED.
import { describe, expect, it } from 'vitest';
import pack from '../../data/core-rules.cprpack.json';
import { INTERFACE_RED_VEHICLES, bicycleSpeed } from '../../data/interfaceRedVehicles';
import { BLACK_CHROME_VEHICLES } from '../../data/blackChromeVehicles';
import { EXPANSION_RULE_SYSTEMS } from '../../data/expansionRulesData';
import { bcVehicleToOwned, nomadCanTake } from '../vehicleCatalog';
import {
  PUNKNAUGHT_PARTS,
  clampPunknaughtBuild,
  punknaughtDeath,
  punknaughtHours,
  punknaughtMax,
  punknaughtStats,
} from '../punknaught';

type Gear = { id: string; name: string; cost: number; sourceBookTitle?: string; sourcePage?: number; slots?: number };
const gear = (pack as unknown as { gear: Gear[] }).gear;
const veh = (id: string) => INTERFACE_RED_VEHICLES.find((v) => v.id === id)!;

describe('Spinning Your Wheels (DLC pp.3-7)', () => {
  it('la bici: SDP 15, 1 asiento, 100eb y sin Nomad Access (p.3)', () => {
    const b = veh('ir-veh-bicycle');
    expect([b.sdp, b.seats, b.cost, b.priceCategory, b.nomadAccess]).toEqual([15, 1, 100, 'Premium', null]);
    expect(nomadCanTake(b, 10)).toBe(false);
  });

  it('velocidad según BODY (p.3)', () => {
    expect(bicycleSpeed(3)).toEqual({ move: 8, mph: 12, kph: 19 });
    expect(bicycleSpeed(4)).toEqual({ move: 10, mph: 20, kph: 32 });
    expect(bicycleSpeed(7)).toEqual({ move: 10, mph: 20, kph: 32 });
    expect(bicycleSpeed(8)).toEqual({ move: 15, mph: 30, kph: 48 });
  });

  it('patines y skate: 50eb, p.5', () => {
    const items = gear.filter((g) => g.sourceBookTitle === 'Spinning Your Wheels');
    expect(items.map((g) => [g.name, g.cost, g.sourcePage])).toEqual([
      ['Inline Skates', 50, 5],
      ['Skateboard', 50, 5],
    ]);
  });

  it('las 14 mejoras de la tabla de p.7 están en el Compendio de sistemas', () => {
    const sys = EXPANSION_RULE_SYSTEMS.find((s) => s.id === 'spinning-your-wheels');
    expect(sys?.referenceTable?.rows).toHaveLength(14);
    expect(sys?.referenceTable?.rows.find((r) => r[0] === 'Security System')?.[2]).toBe('500eb (Expensive)');
  });
});

describe('Cyberchairs (Interface RED Vol. 1 p.38)', () => {
  it('Mercurius 100eb y Spider 1.000eb con 4 Option Slots', () => {
    const m = gear.find((g) => g.id === 'ir1-mercurius-cyberchair');
    const s = gear.find((g) => g.id === 'ir1-spider-cyberchair');
    expect([m?.cost, m?.sourcePage]).toEqual([100, 38]);
    expect([s?.cost, s?.slots, s?.sourcePage]).toEqual([1000, 4, 38]);
    expect(EXPANSION_RULE_SYSTEMS.some((x) => x.id === 'cyberchairs')).toBe(true);
  });
});

describe('Zonda Metrocar (Interface RED Vol. 4 p.68)', () => {
  it('Compact Groundcar de 2 asientos, SDP 25, 10 MOVE, Nomad Access 1, 1.000eb', () => {
    const z = veh('ir-veh-zonda-metrocar');
    expect([z.baseType, z.sdp, z.seats, z.combatSpeed, z.nomadAccess, z.cost]).toEqual(['Compact Groundcar', 25, 2, '10 MOVE', 1, 1000]);
    expect(nomadCanTake(z, 1)).toBe(true);
  });

  it('al garaje con su libro de origen', () => {
    const o = bcVehicleToOwned(veh('ir-veh-zonda-metrocar'), 'Comprado', 1);
    expect(o.notes).toContain('Origen: Interface RED Vol. 4 p.68');
    expect([o.maxSdp, o.armorSp, o.seats]).toEqual([25, 0, 2]);
  });

  it('ningún id repetido con Black Chrome', () => {
    const ids = [...BLACK_CHROME_VEHICLES, ...INTERFACE_RED_VEHICLES].map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('The Dreaded Punknaught (Interface RED Vol. 4 pp.38-44)', () => {
  it('la tabla de piezas de p.43: 10 piezas además del Core', () => {
    expect(PUNKNAUGHT_PARTS).toHaveLength(10);
    const nos = PUNKNAUGHT_PARTS.find((p) => p.id === 'nos');
    expect([nos?.days, nos?.salvageDv, nos?.constructionMod]).toEqual([1, 13, 2]);
  });

  it('el básico: SDP 60, 20 asientos, 15 MOVE, 60 MPH (p.42)', () => {
    const s = punknaughtStats({});
    expect([s.sdp, s.seats, s.combatMove, s.mph, s.kph, s.sp, s.constructionDays, s.constructionDv]).toEqual([60, 20, 15, 60, 97, 0, 7, 13]);
  });

  it('el ejemplo del libro: Core, Armor y dos Turrets dan DV16 (p.39)', () => {
    const s = punknaughtStats({ armor: 1, turret: 2 });
    expect(s.constructionDv).toBe(16);
    expect([s.sp, s.armorGaps]).toEqual([13, true]);
    // El ejemplo suma 11 días porque cuenta la tercera Turret que no encontraron; con dos, 10.
    expect(s.constructionDays).toBe(10);
    expect(punknaughtHours(17, 16)).toBe(1);
    expect(punknaughtHours(15, 16)).toBeNull();
  });

  it('dos Extra Chassis: piden Base > 12 y BODY > 7, y -2 a maniobras (p.42)', () => {
    const s = punknaughtStats({ extraChassis: 2, extraEngine: 2 });
    expect([s.sdp, s.seats, s.combatMove, s.mph, s.driveBaseOver, s.bodyOver, s.maneuverPenalty, s.rammingBonusD6]).toEqual([100, 40, 25, 100, 12, 7, 2, 2]);
  });

  it('motores y torretas dependen de los chasis', () => {
    expect(punknaughtMax('extraEngine', {})).toBe(0);
    expect(punknaughtMax('turret', { extraChassis: 1 })).toBe(6);
    expect(clampPunknaughtBuild({ extraEngine: 3, turret: 9, armor: 5 })).toMatchObject({ extraEngine: 0, turret: 3, armor: 2 });
  });

  it('tabla de muerte 1d6 (p.43)', () => {
    expect(punknaughtDeath(6)).toMatch(/^6: Explota/);
    expect(punknaughtDeath(1)).toMatch(/^1: Se detiene/);
  });
});
