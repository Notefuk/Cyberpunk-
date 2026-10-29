// Tests de la tienda del creador (v5.3.2): Neuroport, slots del cyberdeck, armadura y etiqueta de origen. [Claude Code · 2026-10-29]
import { describe, expect, it } from 'vitest';
import { buildCharacterSheetFromDraft, createEmptyDraft, getSummaryWarnings, validateStep, type CreatorDraft, type CreatorPurchase } from '../characterCreation';
import { deckSlotUse, neuroportCovers, shopSourceLabel } from '../creatorShop';
import pack from '../../data/core-rules.cprpack.json';

const buy = (category: CreatorPurchase['category'], catalogId: string, name: string, cost: number, qty = 1, extra: Partial<CreatorPurchase> = {}): CreatorPurchase => ({
  category,
  catalogId,
  name,
  cost,
  qty,
  humanityLoss: 0,
  sourceBook: 'core',
  ...extra
});

const cp2077 = (purchases: CreatorPurchase[]): CreatorDraft => ({
  ...createEmptyDraft(),
  era: '2077',
  method: 'complete_package',
  role: 'Netrunner',
  installNeuroport: true,
  culturalLanguage: 'German',
  handle: 'Tester',
  purchases
});

describe('Neuroport (CEMK RB p.36)', () => {
  it('en 2077 con Neuroport, Neural Link, Interface Plugs y Virtuality Goggles ya vienen incluidos', () => {
    expect(neuroportCovers('neuralware-processor', '2077', true)).toBe('Neural Link');
    expect(neuroportCovers('interface-plugs', '2077', true)).toContain('Interface Plug');
    expect(neuroportCovers('virtuality-goggles', '2077', true)).toContain('Virtu');
    expect(neuroportCovers('neuralware-processor', '2077', false)).toBeNull();
    expect(neuroportCovers('neuralware-processor', '2045', true)).toBeNull();
    expect(neuroportCovers('cyberdeck-standard', '2077', true)).toBeNull();
  });

  it('comprar una pieza del Neuroport bloquea el paso de equipo', () => {
    const errs = validateStep(cp2077([buy('cyberware', 'neuralware-processor', 'Neural Link', 500)]), 'gear');
    expect(errs.some((e) => e.includes('Neural Link') && e.includes('CEMK RB p.36'))).toBe(true);
    expect(validateStep(cp2077([buy('gear', 'cyberdeck-standard', 'Cyberdeck (Standard, 7 slots)', 500)]), 'gear')).toEqual([]);
  });
});

describe('Slots del cyberdeck (Core pp. 196 y 208)', () => {
  it('los mazos del Core tienen 5, 7 y 9 slots y están en el pack', () => {
    const gear = (pack as unknown as { gear: Array<{ id: string; cost: number }> }).gear;
    expect(gear.find((g) => g.id === 'cyberdeck-poor')?.cost).toBe(100);
    expect(gear.find((g) => g.id === 'cyberdeck-standard')?.cost).toBe(500);
    expect(gear.find((g) => g.id === 'cyberdeck-excellent')?.cost).toBe(1000);
    expect(deckSlotUse([{ category: 'gear', catalogId: 'cyberdeck-poor', qty: 1 }]).deckSlots).toBe(5);
    expect(deckSlotUse([{ category: 'gear', catalogId: 'cyberdeck-excellent', qty: 1 }]).deckSlots).toBe(9);
  });

  it('programas y Hardware comparten slots; el Bodyweight Suit suma 1 solo para Hardware', () => {
    const deck = { category: 'gear', catalogId: 'cyberdeck-standard', qty: 1 };
    expect(deckSlotUse([deck, { category: 'programs', catalogId: 'sword', qty: 7 }]).overflow).toBe(0);
    expect(deckSlotUse([deck, { category: 'programs', catalogId: 'sword', qty: 6 }, { category: 'gear', catalogId: 'hw-krash-barrier', qty: 1 }]).overflow).toBe(1);
    const suit = { category: 'armor', catalogId: 'bodyweight-suit', qty: 1 };
    expect(deckSlotUse([deck, suit, { category: 'programs', catalogId: 'sword', qty: 7 }, { category: 'gear', catalogId: 'hw-range-upgrade', qty: 1 }]).overflow).toBe(0);
  });

  it('pasarse de slots solo avisa en el resumen (no bloquea)', () => {
    const d = cp2077([buy('gear', 'cyberdeck-poor', 'Cyberdeck (Poor, 5 slots)', 100), buy('programs', 'sword', 'Sword', 50, 6)]);
    expect(validateStep(d, 'gear')).toEqual([]);
    const w = getSummaryWarnings(d, { sheet: null });
    expect(w.find((x) => x.id === 'deck-slots')?.message).toContain('6 slots');
    const noDeck = getSummaryWarnings(cp2077([buy('programs', 'sword', 'Sword', 50)]), { sheet: null });
    expect(noDeck.some((x) => x.id === 'no-cyberdeck')).toBe(true);
  });
});

describe('Armadura comprada (Core p.97)', () => {
  it('la pieza equipada no se repite en la mochila; la de más sí queda', () => {
    const d = cp2077([
      buy('armor', 'light-armorjack', 'Light Armorjack', 100, 1, { location: 'head' }),
      buy('armor', 'light-armorjack', 'Light Armorjack', 100, 2, { location: 'body' })
    ]);
    const { sheet } = buildCharacterSheetFromDraft(d, 'armor-test');
    expect(sheet.headArmor.maxSp).toBe(11);
    expect(sheet.bodyArmor.maxSp).toBe(11);
    const inv = (sheet.inventory ?? []).filter((i) => i.category === 'armor');
    expect(inv.reduce((n, i) => n + i.quantity, 0)).toBe(1);
  });
});

describe('Etiqueta de origen de la tienda', () => {
  it('dice libro, nombre del DLC y página cuando la hay', () => {
    expect(shopSourceLabel({ sourceBook: 'core', sourcePage: 196 })).toBe('Core RED p.196');
    expect(shopSourceLabel({ sourceBook: 'dlc', sourceBookTitle: '12 Days of Gunmas' })).toBe('DLC: 12 Days of Gunmas');
    expect(shopSourceLabel({ sourceBook: 'black_chrome' })).toBe('Black Chrome');
    expect(shopSourceLabel({ sourceBook: 'cemk', sourcePage: 34 })).toBe('CEMK p.34');
  });
});
