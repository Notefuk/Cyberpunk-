// [Claude Code · 2026-11-06] v5.13.0 (plan 26): catálogo de vehículos de Black Chrome y Nomad Access.
import { describe, it, expect } from 'vitest';
import { BLACK_CHROME_VEHICLES } from '../../data/blackChromeVehicles';
import { CORE_VEHICLES } from '../../data/creation';
import { REMOVED_CATALOG_ITEMS, removedItemsInSheet } from '../../data/removedCatalogItems';
import { bcVehicleToOwned, nomadCanTake, motorpoolSlotsLeft, motorpoolVehiclesTaken } from '../vehicleCatalog';
import type { CharacterSheet } from '../../types/cyberpunk';

const byId = (id: string) => {
  const v = BLACK_CHROME_VEHICLES.find((x) => x.id === id);
  if (!v) throw new Error(id);
  return v;
};

describe('Vehículos de Black Chrome (BC pp.58-84, tabla pp.162-164)', () => {
  it('son 31: 8 aéreos y 23 terrestres, con ids únicos, página y puesto', () => {
    expect(BLACK_CHROME_VEHICLES).toHaveLength(31);
    expect(BLACK_CHROME_VEHICLES.filter((v) => v.vehicleClass === 'air')).toHaveLength(8);
    expect(BLACK_CHROME_VEHICLES.filter((v) => v.vehicleClass === 'land')).toHaveLength(23);
    expect(new Set(BLACK_CHROME_VEHICLES.map((v) => v.id)).size).toBe(31);
    for (const v of BLACK_CHROME_VEHICLES) {
      expect(v.sourcePage).toBeGreaterThanOrEqual(58);
      expect(v.sourcePage).toBeLessThanOrEqual(84);
      expect(v.booth.length).toBeGreaterThan(0);
    }
  });

  it('sus mejoras de serie son mejoras del Core (Core pp.163-165)', () => {
    const core = new Set(CORE_VEHICLES.upgrades.map((u) => u.name.toLowerCase()));
    for (const v of BLACK_CHROME_VEHICLES) for (const u of v.upgrades) expect(core.has(u.toLowerCase()), `${v.name}: ${u}`).toBe(true);
  });

  it('datos de la tabla: The Grundy (p.68) y el Dayton TDT 004 (p.59)', () => {
    const g = byId('bc-veh-the-grundy');
    expect([g.nomadAccess, g.sdp, g.seats, g.cost]).toEqual([4, 70, 4, 41000]);
    const t = byId('bc-veh-dayton-tdt-004');
    expect([t.baseType, t.nomadAccess, t.sdp, t.seats, t.cost]).toEqual(['Helicopter', 7, 80, 8, 43000]);
  });

  it('ningún vehículo del viejo catálogo inventado sigue en el catálogo', () => {
    const ids = new Set(BLACK_CHROME_VEHICLES.map((v) => v.id));
    const removed = REMOVED_CATALOG_ITEMS.filter((i) => i.category === 'vehicles');
    expect(removed).toHaveLength(14);
    for (const r of removed) expect(ids.has(r.id)).toBe(false);
  });

  it('una ficha con un vehículo borrado lo conserva y recibe el aviso', () => {
    const veh = bcVehicleToOwned(byId('bc-veh-the-grundy'), 'Comprado', 1);
    const sheet = { vehicles: [{ ...veh, catalogId: 'veh-sea-sprite', name: 'Sea Sprite Patrol Cutter' }, veh] } as unknown as CharacterSheet;
    expect(removedItemsInSheet(sheet).map((i) => i.id)).toEqual(['veh-sea-sprite']);
  });
});

describe('Agregar al garaje', () => {
  it('copia SDP, plazas, velocidad y mejoras; Armored Chassis da SP13 (Core p.163)', () => {
    const o = bcVehicleToOwned(byId('bc-veh-the-grundy'), 'Comprado', 1);
    expect(o).toMatchObject({ catalogId: 'bc-veh-the-grundy', category: 'land', maxSdp: 70, currentSdp: 70, armorSp: 13, seats: 4, combatSpeed: '20 MOVE' });
    expect(o.upgrades).toEqual(['Armored Chassis', 'Heavy Chassis', 'Combat Plow']);
    expect(o.notes).toContain('Black Chrome p.68');
  });

  it('las armas montadas van a mountedWeapons', () => {
    const o = bcVehicleToOwned(byId('bc-veh-the-harvey-merc'), 'Comprado', 1);
    expect(o.mountedWeapons).toEqual(['Onboard Machine Gun', 'Onboard Rocket Pod']);
    expect(o.armorSp).toBe(0);
  });
});

describe('Nomad Access (BC p.9)', () => {
  it('toma vehículos con Nomad Access igual o menor a su Rango de Moto', () => {
    const grundy = byId('bc-veh-the-grundy');
    expect(nomadCanTake(grundy, 5)).toBe(true);
    expect(nomadCanTake(grundy, 4)).toBe(true);
    expect(nomadCanTake(grundy, 3)).toBe(false);
    expect(nomadCanTake(grundy, 0)).toBe(false);
  });

  // v5.14.1 [Claude Code · 2026-11-10]: un vehículo de serie (o una mejora) por cada rango de Moto (Core p.162).
  it('un vehículo gratis por rango de Moto, contando Core, Black Chrome y los viejos', () => {
    const bought = { notes: 'Origen: Black Chrome p.68 (Comprado)' };
    const fromBc = { notes: 'Origen: Black Chrome p.68 (Family Motorpool, Nomad Access 4)' };
    const fromCore = { notes: 'Origen: CORE p.190 (Family Motorpool, Core p.162)' };
    const old = { notes: 'Origen: CORE (Flota Nómada Gratuita)' };
    expect(motorpoolVehiclesTaken([bought, fromBc, fromCore, old, {}])).toBe(3);
    expect(motorpoolSlotsLeft([fromBc, fromCore], 4)).toBe(2);
    expect(motorpoolSlotsLeft([fromBc, fromCore, old, fromBc], 4)).toBe(0);
    expect(motorpoolSlotsLeft([fromBc, fromCore, old, fromBc, fromBc], 4)).toBe(0);
    expect(motorpoolSlotsLeft(undefined, 0)).toBe(0);
  });

  it('el Tanson JetBoy no tiene Nomad Access', () => {
    expect(nomadCanTake(byId('bc-veh-tanson-jetboy-hoverboard'), 10)).toBe(false);
  });
});
