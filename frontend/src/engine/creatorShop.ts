// v5.3.2 [Claude Code · 2026-10-29]: reglas de la tienda del creador que salieron de la prueba del Complete Package.
// - En 2077 el Neuroport ya trae 7 piezas (CEMK RB p.36): no se vuelven a comprar.
// - Programas y Hardware comparten los slots del cyberdeck (Core p.196); el Bodyweight Suit suma 1 slot solo para Hardware (Core p.208).
// - La etiqueta de origen dice libro y página cuando el pack la trae.

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
