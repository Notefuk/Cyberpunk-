// Tests de la tienda del creador v5.5.0 (plan 21): categoría de precio, doble costo sin Fixer, mejoras de armas y vivienda. [Claude Code · 2026-10-29]
import { describe, expect, it } from 'vitest';
import { buildCharacterSheetFromDraft, createEmptyDraft, getMoneyRemaining, getSummaryWarnings, type CreatorDraft, type CreatorPurchase } from '../characterCreation';
import { effectiveUnitCost, needsFixer, priceTier, purchaseUnitCost, weaponModKey, weaponModOptions, weaponModSlots } from '../creatorShop';
import { WEAPON_ATTACHMENTS_CATALOG } from '../../data/weaponAttachmentsAndTechData';
import pack from '../../data/core-rules.cprpack.json';

const weapons = (pack as unknown as { weapons: Array<{ id: string; name: string; type?: string; skill?: string; cost: number }> }).weapons;
const w = (id: string) => weapons.find((x) => x.id === id)!;

const buyWeapon = (id: string, mods?: string[]): CreatorPurchase => ({
  category: 'weapons',
  catalogId: id,
  name: w(id).name,
  cost: w(id).cost,
  qty: 1,
  humanityLoss: 0,
  sourceBook: 'core',
  ...(mods ? { mods } : {})
});

const cp = (extra: Partial<CreatorDraft> = {}): CreatorDraft => ({
  ...createEmptyDraft(),
  era: '2077',
  method: 'complete_package',
  role: 'Solo',
  culturalLanguage: 'Spanish',
  handle: 'Tester',
  ...extra
});

describe('Categoría de precio (Core p.385)', () => {
  it('sale del costo cuando el pack no la trae', () => {
    expect(priceTier({ cost: 20 })).toBe('Everyday');
    expect(priceTier({ cost: 100 })).toBe('Premium');
    expect(priceTier({ cost: 500 })).toBe('Expensive');
    expect(priceTier({ cost: 1000 })).toBe('Very Expensive');
    expect(priceTier({ cost: 20000 })).toBe('Super Luxury');
    expect(priceTier({ cost: 999, costTier: 'Premium' })).toBe('Premium');
  });

  it('sin Fixer solo se consigue hasta Premium', () => {
    expect(needsFixer({ cost: 100 })).toBe(false);
    expect(needsFixer({ cost: 500 })).toBe(true);
  });
});

describe('Sin Fixer: pagar el doble (CEMK p.26)', () => {
  it('duplica solo lo Expensive o más caro', () => {
    expect(effectiveUnitCost(100, true)).toBe(100);
    expect(effectiveUnitCost(500, true)).toBe(1000);
    expect(effectiveUnitCost(500, false)).toBe(500);
  });

  it('cambia la plata que queda y apaga el aviso del resumen', () => {
    const d = cp({ purchases: [buyWeapon('assault-rifle')] });
    expect(getMoneyRemaining(d).cash).toBe(2550 - 500);
    expect(getMoneyRemaining({ ...d, noFixerDouble: true }).cash).toBe(2550 - 1000);
    expect(getSummaryWarnings(d, { sheet: null }).some((x) => x.id === 'expensive-no-fixer')).toBe(true);
    expect(getSummaryWarnings({ ...d, noFixerDouble: true }, { sheet: null }).some((x) => x.id === 'expensive-no-fixer')).toBe(false);
  });
});

describe('Rebuilds Power, Smart y Tech (CEMK pp.30-31)', () => {
  it('cuestan 1.000 €$, ocupan 2 slots y son Very Expensive', () => {
    for (const id of ['att-power-rebuild', 'att-smart-rebuild', 'att-tech-rebuild']) {
      const att = WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === id)!;
      expect(att.cost).toBe(1000);
      expect(att.slots).toBe(2);
      expect(att.costTier).toBe('Very Expensive');
    }
  });

  it('Tech no va en lanzagranadas; Smart no va con Smartgun Link; uno solo por arma', () => {
    const gl = weaponModOptions(w('grenade-launcher'), [], '2077').map((o) => o.att.id);
    expect(gl).toContain('att-power-rebuild');
    expect(gl).not.toContain('att-tech-rebuild');
    const withLink = weaponModOptions(w('heavy-pistol'), ['att-smartgun-link'], '2077');
    expect(withLink.find((o) => o.att.id === 'att-smart-rebuild')?.blocked).toContain('Smartgun');
    const withPower = weaponModOptions(w('heavy-pistol'), ['att-power-rebuild'], '2077');
    expect(withPower.find((o) => o.att.id === 'att-tech-rebuild')?.blocked).toBeTruthy();
  });

  it('solo aparecen en 2077 y no en armas cuerpo a cuerpo', () => {
    expect(weaponModOptions(w('heavy-pistol'), [], '2045').some((o) => o.att.rebuild2077)).toBe(false);
    expect(weaponModSlots(w('heavy-melee'))).toBe(0);
    expect(weaponModSlots(w('heavy-pistol'))).toBe(3);
    expect(weaponModKey('Shoulder Arms')).toBe('shoulderArms');
  });

  it('la compra suma el Rebuild y la ficha recibe el arma convertida', () => {
    const p = buyWeapon('heavy-pistol', ['att-smart-rebuild']);
    expect(purchaseUnitCost(p)).toBe(100 + 1000);
    const { sheet } = buildCharacterSheetFromDraft(cp({ purchases: [p] }), 'rebuild-test');
    const gun = sheet.equippedWeapons.find((x) => x.id === 'heavy-pistol')!;
    expect(gun.rebuild2077).toBe('smart');
    expect(gun.installedAttachments).toEqual(['att-smart-rebuild']);
  });
});

describe('Vivienda (Core pp.105, 377-378)', () => {
  it('la vivienda elegida o escrita va a las notas de la ficha', () => {
    const { sheet } = buildCharacterSheetFromDraft(cp({ housing: 'El taller de mi tío en Heywood', lifestyle: 'Generic Prepak' }), 'house-test');
    expect(sheet.notes).toContain('El taller de mi tío en Heywood');
    expect(sheet.notes).toContain('Generic Prepak');
  });
});
