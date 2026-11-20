// [Claude Code · 2026-11-20] v5.45.0: DLC Everyday Items (J Gray, 2026), ítems pp.3-6.
import { describe, expect, it } from 'vitest';
import pack from '../../data/core-rules.cprpack.json';
import { INTERFACE_RED_VEHICLES } from '../../data/interfaceRedVehicles';
import { bcVehicleToOwned } from '../vehicleCatalog';

const ei = pack.gear.filter((g) => g.id.startsWith('ei-'));
const byId = (id: string) => ei.find((g) => g.id === id)!;

describe('Everyday Items (DLC, pp.3-6)', () => {
  it('trae los 27 ítems de equipo, todos con página 3 a 6', () => {
    expect(ei).toHaveLength(27);
    for (const g of ei) {
      expect(g.sourceBookTitle).toBe('Everyday Items');
      expect(g.sourcePage).toBeGreaterThanOrEqual(3);
      expect(g.sourcePage).toBeLessThanOrEqual(6);
    }
  });
  it('precios del libro', () => {
    expect([byId('ei-chop').cost, byId('ei-chop').costTier]).toEqual([1, 'Dirt Cheap']); // p.3
    expect(byId('ei-danshi-badgemaker').cost).toBe(500); // p.4
    expect(byId('ei-kiroshi-multiscope').cost).toBe(100); // p.5
    expect(byId('ei-militech-armor-patch-kit').cost).toBe(20); // p.6
    expect(byId('ei-small-generator').cost).toBe(500); // p.6
    expect(byId('ei-cigarillo-nomad').costTier).toBe('N/A'); // p.4: no se vende
  });
  it('el Dinghy es un vehículo acuático sin mejoras (p.4)', () => {
    const d = INTERFACE_RED_VEHICLES.find((v) => v.id === 'ei-veh-dinghy')!;
    expect([d.sdp, d.seats, d.combatSpeed, d.cost, d.nomadAccess]).toEqual([20, 4, '10 MOVE', 500, 1]);
    const o = bcVehicleToOwned(d, 'compra', 1);
    expect([o.category, o.maxSdp, o.upgrades]).toEqual(['sea', 20, []]);
  });
});
