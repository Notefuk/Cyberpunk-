// [Claude Code · 2026-11-13] v5.29.0 (plan 31): catálogos del resto del Interface RED Vol. 5.
// Toggle's Temple (pp.37-59), All About Agents (pp.28-33), roller derby (p.21), 12 Days of REDmas (pp.98-104), cyberpets (p.82).
import { describe, expect, it } from 'vitest';
import pack from '../../data/core-rules.cprpack.json';
import { WEAPON_RANGE_PROFILES, getWeaponRangeProfile } from '../../data/rangeTables';
import { calculateWeaponAttachmentBonuses, calculateWeaponSlotCapacity } from '../../data/weaponAttachmentsAndTechData';
import type { EquippedWeapon, WeaponItem } from '../../types/cyberpunk';

type Row = { id: string; name: string; sourceBookTitle?: string; sourcePage?: number; quality?: string; slots?: number; rangeTable?: string };
const sections = pack as unknown as Record<string, Row[]>;
const ir5 = (k: string, from: number, to: number) =>
  sections[k].filter((i) => i.sourceBookTitle === 'Interface RED Volume 5' && (i.sourcePage ?? 0) >= from && (i.sourcePage ?? 0) <= to);

describe('Catálogos del resto del Vol. 5', () => {
  it("Toggle's Temple: 72 armas menos las 10 que ya estaban (9 del Core y la reimpresión del Type-18-S)", () => {
    const toggle = ir5('weapons', 37, 48);
    expect(toggle).toHaveLength(62);
    for (const w of toggle) {
      expect(['poor', 'standard', 'excellent'], w.id).toContain(w.quality);
      expect(w.slots, w.id).toBeGreaterThanOrEqual(1);
      expect(WEAPON_RANGE_PROFILES[w.rangeTable!], w.id).toBeDefined();
    }
  });

  it('Agents: 17 de equipo y apps y 4 Internal Agents', () => {
    expect(ir5('gear', 28, 33)).toHaveLength(17);
    expect(ir5('cyberware', 28, 33)).toHaveLength(4);
  });

  it('REDmas: 3 armas, 1 escudo, 3 equipos, 1 attachment y 4 ciberware nuevos (el Light Metalgear y el Cyberspine ya estaban)', () => {
    expect(ir5('weapons', 98, 104)).toHaveLength(3);
    expect(ir5('armor', 98, 104)).toHaveLength(1);
    expect(ir5('gear', 98, 104)).toHaveLength(3);
    expect(ir5('attachments', 98, 104)).toHaveLength(1);
    expect(ir5('cyberware', 98, 104)).toHaveLength(4);
  });

  it('derby (p.21), attachments de Toggle (p.48) y ciberware de cyberpets (p.82) sin repetir reimpresiones', () => {
    expect(ir5('armor', 21, 21).map((a) => a.name)).toEqual(['Roller Derby Padding']);
    expect(ir5('gear', 21, 21).map((a) => a.name)).toEqual(['Roller Derby Skates']);
    expect(ir5('attachments', 48, 48).map((a) => a.name)).toEqual(['Airhypo Bayonet', 'Grapple Gun Underbarrel']);
    expect(ir5('cyberware', 82, 82).map((a) => a.name)).toEqual(['Chipware Compartment', 'FBC Chameleon Coating']);
  });

  it('no hay nombres repetidos en el pack', () => {
    for (const k of ['weapons', 'armor', 'gear', 'cyberware', 'attachments']) {
      const names = sections[k].map((i) => i.name.toLowerCase());
      expect(new Set(names).size, k).toBe(names.length);
    }
  });
});

describe('Calidad, ranuras y attachments de fábrica', () => {
  const find = (id: string) => ({ ...(sections.weapons.find((w) => w.id === id) as unknown as WeaponItem), instanceId: 'x', currentMag: 0, loadedAmmoType: 'Basic' }) as EquippedWeapon;

  it('Excelente da +1; el Smartgun Link de fábrica da otro +1', () => {
    const r = calculateWeaponAttachmentBonuses(find('ir5-towa-type-12-police-pistol'));
    expect(r.attackBonus).toBe(2);
  });

  it('Pobre no cambia el ataque pero avisa que se encasquilla', () => {
    const r = calculateWeaponAttachmentBonuses(find('ir5-faisals-escape-plan'));
    expect(r.attackBonus).toBe(0);
    expect(r.bonusBreakdown.join(' ')).toMatch(/encasquilla/);
  });

  it('las ranuras salen del libro', () => {
    expect(calculateWeaponSlotCapacity(find('ir5-nomad-357-magnum')).maxSlots).toBe(2);
    expect(calculateWeaponSlotCapacity(find('ir5-towa-type-12-police-pistol')).maxSlots).toBe(1);
  });

  it("el Nat's Long-Barreled Pistol usa su tabla (p.99)", () => {
    const p = getWeaponRangeProfile(find('ir5-nats-long-barreled-pistol'))!;
    expect(p.dvs['0-6m']).toBe(14);
    expect(p.dvs['201-400m']).toBe(30);
    expect(p.dvs['401-800m']).toBeNull();
  });
});
