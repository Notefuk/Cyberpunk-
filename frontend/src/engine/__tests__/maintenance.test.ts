// [Claude Code · 2026-11-13] v5.31.0 (plan 31): "Breaking Your Stuff", Interface RED Vol. 5 pp.3-12.
import { describe, expect, it } from 'vitest';
import { MALFUNCTION_TABLES } from '../../data/malfunctionTables';
import {
  gearKindFor,
  juryRigMinutes,
  maintenanceCheck,
  maintenanceInfo,
  maintenanceRow,
  malfunctionTableFor,
  resaleValue,
  rollMalfunction,
} from '../maintenance';

describe('Fallas (IR5 pp.8-12)', () => {
  it('11 tablas de 1d6', () => {
    expect(MALFUNCTION_TABLES).toHaveLength(11);
    for (const t of MALFUNCTION_TABLES) expect(t.rows.map((r) => r.roll), t.id).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('cada tipo de ciberware va a su tabla', () => {
    expect(malfunctionTableFor('cyberware', 'Cyberarm Option')).toBe('cyberlimb');
    expect(malfunctionTableFor('cyberware', 'Cyberlimb')).toBe('cyberlimb');
    expect(malfunctionTableFor('cyberware', 'Cyberoptics')).toBe('cyberaudio_optics');
    expect(malfunctionTableFor('cyberware', 'Neuralware Option')).toBe('neuralware');
    expect(malfunctionTableFor('cyberware', 'Fashionware')).toBe('cyberware_body');
    expect(malfunctionTableFor('cyberware', 'Borgware', 'Linear Frame Sigma')).toBe('linear_frame');
    expect(malfunctionTableFor(gearKindFor('gear', 'Cyberdeck (Standard, 7 slots)'))).toBe('cyberdeck');
  });

  it('la tirada sale de la tabla pedida', () => {
    expect(rollMalfunction('weapon', () => 0).roll).toBe(1);
    expect(rollMalfunction('armor', () => 0.99).roll).toBe(6);
  });
});

describe('Mantenimiento (IR5 pp.5-7)', () => {
  it('Maintenance Basics: equipo y vehículos tienen umbrales distintos', () => {
    expect(maintenanceRow(499, 'weapon')).toMatchObject({ lifestyle: 'Kibble', dv: 13 });
    expect(maintenanceRow(500, 'weapon')).toMatchObject({ lifestyle: 'Generic Prepak', dv: 15 });
    expect(maintenanceRow(5000, 'cyberware')).toMatchObject({ lifestyle: 'Fresh Food', dv: 21, time: '1 día' });
    expect(maintenanceRow(30000, 'vehicle_land')).toMatchObject({ lifestyle: 'Generic Prepak' });
  });

  it('ejemplo de Stinger: con Kibble, el Very Heavy Pistol y la Light Armorjack se mantienen solos (p.6)', () => {
    expect(maintenanceInfo(100, 'weapon', 'Kibble', 'Solo').automatic).toBe(true);
    expect(maintenanceInfo(100, 'armor', 'Kibble', 'Solo').automatic).toBe(true);
    // Un Cyberarm de 500eb pide Generic Prepak y una tirada de Cybertech.
    const arm = maintenanceInfo(500, 'cyberware', 'Kibble', 'Media');
    expect(arm).toMatchObject({ automatic: false, skill: 'Cybertech', dv: 15 });
  });

  it('Roles: Tech +1 en todo; Solo y Lawman en armas y armaduras; Netrunner en decks; Exec, Medtech y Nomad exentos con su equipo de Rol', () => {
    expect(maintenanceInfo(500, 'cyberware', 'Kibble', 'Tech').automatic).toBe(true);
    expect(maintenanceInfo(500, 'weapon', 'Kibble', 'Lawman').automatic).toBe(true);
    expect(maintenanceInfo(500, 'cyberware', 'Kibble', 'Solo').automatic).toBe(false);
    expect(maintenanceInfo(500, 'cyberdeck', 'Kibble', 'Netrunner').automatic).toBe(true);
    expect(maintenanceInfo(5000, 'vehicle_land', undefined, 'Nomad', true)).toMatchObject({ automatic: true, exempt: true });
    expect(maintenanceInfo(500, 'electronics', 'Kibble', 'Media', true).automatic).toBe(true);
    expect(maintenanceInfo(500, 'electronics', 'Kibble', 'Media', false).automatic).toBe(false);
  });

  it('la tirada pasa con DV o más', () => {
    expect(maintenanceCheck(15, 15).success).toBe(true);
    expect(maintenanceCheck(14, 15).success).toBe(false);
  });

  it('jury rig: 10 minutos por punto de Field Expertise (p.8)', () => {
    expect(juryRigMinutes(3)).toBe(30);
  });
});

describe('Reventa (IR5 p.5)', () => {
  it('Assault Rifle: Damaged 100eb, Destroyed 50eb', () => {
    expect(resaleValue(500, 'damaged')).toMatchObject({ cost: 100, tier: 'Premium' });
    expect(resaleValue(500, 'destroyed')).toMatchObject({ cost: 50, tier: 'Costly' });
    expect(resaleValue(500, 'beyond_repair').cost).toBe(0);
    expect(resaleValue(500, undefined).cost).toBe(500);
  });
});
