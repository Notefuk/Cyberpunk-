// v5.3.2 [Claude Code · 2026-10-29]: reglas de la tienda del creador que salieron de la prueba del Complete Package.
// - En 2077 el Neuroport ya trae 7 piezas (CEMK RB p.36): no se vuelven a comprar.
// - Programas y Hardware comparten los slots del cyberdeck (Core p.196); el Bodyweight Suit suma 1 slot solo para Hardware (Core p.208).
// - La etiqueta de origen dice libro y página cuando el pack la trae.

import { WEAPON_ATTACHMENTS_CATALOG, type WeaponAttachment } from '../data/weaponAttachmentsAndTechData';

/** Ítems del catálogo que ya vienen en el Neuroport (CEMK RB p.36), con la pieza que los cubre. */
export const NEUROPORT_INCLUDED: Record<string, string> = {
  'neuralware-processor': 'Neural Link',
  'interface-plugs': 'Personal Link (Interface Plug)',
  biomonitor: 'Biomonitor',
  'chipware-socket': 'Two Shard Slots (Chipware Sockets)',
  chyron: 'HUD (Chyron)',
  'virtuality-optics': 'Virtu (Virtuality)',
  'virtuality-goggles': 'Virtu (Virtuality)'
};

/** Pieza del Neuroport que ya cubre este ítem, o null. Solo cuenta en 2077 con el Neuroport puesto. */
export function neuroportCovers(catalogId: string, era: string | null | undefined, installNeuroport: boolean): string | null {
  if (era !== '2077' || !installNeuroport) return null;
  return NEUROPORT_INCLUDED[catalogId] ?? null;
}

/** Slots de cada cyberdeck del Core (p.196). */
export const CYBERDECK_SLOTS: Record<string, number> = {
  'cyberdeck-poor': 5,
  'cyberdeck-standard': 7,
  'cyberdeck-excellent': 9
};

/** Slots que ocupa cada pieza de Hardware del Core (p.208). */
export const HARDWARE_SLOTS: Record<string, number> = {
  'hw-backup-drive': 2,
  'hw-dna-lock': 2,
  'hw-hardened-circuitry': 1,
  'hw-insulated-wiring': 1,
  'hw-krash-barrier': 2,
  'hw-range-upgrade': 1
};

export const BODYWEIGHT_SUIT_ID = 'bodyweight-suit';

export interface DeckSlotUse {
  /** Slots del mejor cyberdeck comprado (0 si no hay). */
  deckSlots: number;
  /** Slots extra solo para Hardware (Bodyweight Suit). */
  hardwareOnlySlots: number;
  programs: number;
  hardware: number;
  /** Slots que faltan para que entre todo (0 si entra). */
  overflow: number;
}

/** Cuenta programas y Hardware contra los slots del cyberdeck. `items` son compras o ítems de inventario. */
export function deckSlotUse(items: Array<{ category: string; catalogId: string; qty: number }>): DeckSlotUse {
  let deckSlots = 0;
  let hardwareOnlySlots = 0;
  let programs = 0;
  let hardware = 0;
  for (const it of items) {
    const deck = CYBERDECK_SLOTS[it.catalogId];
    if (deck) deckSlots = Math.max(deckSlots, deck);
    if (it.catalogId === BODYWEIGHT_SUIT_ID) hardwareOnlySlots = 1;
    if (it.category === 'programs') programs += it.qty;
    const hw = HARDWARE_SLOTS[it.catalogId];
    if (hw) hardware += hw * it.qty;
  }
  const hardwareInDeck = Math.max(0, hardware - hardwareOnlySlots);
  const overflow = Math.max(0, programs + hardwareInDeck - deckSlots);
  return { deckSlots, hardwareOnlySlots, programs, hardware, overflow };
}

const BOOK_LABEL: Record<string, string> = {
  core: 'Core RED',
  cemk: 'CEMK',
  black_chrome: 'Black Chrome',
  danger_gal: 'Danger Gal'
};

/** "Core RED p.196", "Black Chrome", "DLC: 12 Days of Gunmas p.4"... */
export function shopSourceLabel(item: { sourceBook?: string; sourceBookTitle?: string; sourcePage?: number | string }): string {
  const book =
    item.sourceBook === 'dlc'
      ? `DLC${item.sourceBookTitle ? `: ${item.sourceBookTitle}` : ''}`
      : BOOK_LABEL[item.sourceBook ?? ''] ?? item.sourceBookTitle ?? item.sourceBook ?? 'Core RED';
  return item.sourcePage !== undefined && item.sourcePage !== '' ? `${book} p.${item.sourcePage}` : book;
}

// ============================================================================
// v5.5.0 [Claude Code · 2026-10-29]: disponibilidad, doble costo sin Fixer y mejoras de armas (plan 21).
// ============================================================================


/** Categorías de precio del Core p.385, de menor a mayor. */
export const PRICE_TIERS = ['Cheap', 'Everyday', 'Costly', 'Premium', 'Expensive', 'Very Expensive', 'Luxury', 'Super Luxury'] as const;
export type PriceTier = (typeof PRICE_TIERS)[number];
const TIER_MAX: Array<[number, PriceTier]> = [
  [10, 'Cheap'],
  [20, 'Everyday'],
  [50, 'Costly'],
  [100, 'Premium'],
  [500, 'Expensive'],
  [1000, 'Very Expensive'],
  [5000, 'Luxury']
];

/** Categoría de precio: la del pack si la trae; si no, según el costo (Core p.385). */
export function priceTier(item: { cost: number; costTier?: string }): PriceTier {
  const given = PRICE_TIERS.find((t) => t.toLowerCase() === (item.costTier ?? '').trim().toLowerCase());
  if (given) return given;
  return TIER_MAX.find(([max]) => item.cost <= max)?.[1] ?? 'Super Luxury';
}

/** Core p.385: sin Fixer solo se consigue hasta Premium. */
export function needsFixer(item: { cost: number; costTier?: string }): boolean {
  return PRICE_TIERS.indexOf(priceTier(item)) > PRICE_TIERS.indexOf('Premium');
}

/** CEMK p.26: sin Fixer, lo Expensive o más caro se compra al fabricante pagando el doble. */
export function effectiveUnitCost(cost: number, noFixerDouble: boolean | undefined, costTier?: string): number {
  return noFixerDouble && needsFixer({ cost, costTier }) ? cost * 2 : cost;
}

/** Costo de una unidad de la compra, con sus mejoras de arma y el doble costo si corresponde. */
export function purchaseUnitCost(p: { cost: number; mods?: string[] }, noFixerDouble?: boolean): number {
  const mods = (p.mods ?? []).reduce((sum, id) => {
    const att = WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === id);
    return sum + (att ? effectiveUnitCost(att.cost, noFixerDouble, att.costTier) : 0);
  }, 0);
  return effectiveUnitCost(p.cost, noFixerDouble) + mods;
}

/** Skill del pack ('Handgun', 'Shoulder Arms'...) a la clave del catálogo de mejoras ('handgun', 'shoulderArms'...). */
export function weaponModKey(skill: string | undefined): string {
  const s = (skill ?? '').replace(/\s+(\w)/g, (_, c: string) => c.toUpperCase());
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** Core p.342: un arma a distancia no exótica tiene 3 slots de mejoras; las exóticas y las de cuerpo a cuerpo, 0. */
export function weaponModSlots(weapon: { type?: string; name?: string; notes?: string }): number {
  if (weapon.type !== 'Ranged') return 0;
  return /exotic/i.test(`${weapon.name ?? ''} ${weapon.notes ?? ''}`) ? 0 : 3;
}

export interface WeaponModOption {
  att: WeaponAttachment;
  installed: boolean;
  /** Motivo por el que no se puede poner, o null. */
  blocked: string | null;
}

/** Mejoras que se pueden poner a un arma del pack, con el motivo si no entra. Los Rebuilds son del CEMK: solo en 2077. */
export function weaponModOptions(weapon: { skill?: string; type?: string; name?: string; notes?: string }, mods: string[], era: string | null | undefined): WeaponModOption[] {
  const key = weaponModKey(weapon.skill);
  const max = weaponModSlots(weapon);
  const used = mods.reduce((n, id) => n + (WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === id)?.slots ?? 1), 0);
  return WEAPON_ATTACHMENTS_CATALOG.filter((att) => att.eligibleWeaponTypes.includes(key) && (!att.rebuild2077 || era === '2077')).map((att) => {
    const installed = mods.includes(att.id);
    let blocked: string | null = null;
    if (!installed) {
      const clash = mods.find((id) => att.incompatibleWith.includes(id) || WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === id)?.incompatibleWith.includes(att.id));
      if (clash) blocked = `No va con ${WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === clash)?.name ?? clash}`;
      else if (used + att.slots > max) blocked = `No entra: ocupa ${att.slots} slot${att.slots > 1 ? 's' : ''} y quedan ${Math.max(0, max - used)}`;
    }
    return { att, installed, blocked };
  });
}
