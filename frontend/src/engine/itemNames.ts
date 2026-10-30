// v5.8.0 (plan 23): nombre propio de los ítems del personaje ("Cuchillo" para una Light Melee Weapon). [Claude Code · 2026-10-30]
// Solo cambia lo que se muestra: las reglas, los totales y las comparaciones siguen usando el nombre del libro.
import type { CharacterSheet, ItemNickname } from '../types/cyberpunk';

export type { ItemNickname };

export type ItemNicknames = Record<string, ItemNickname>;

/** Claves por ejemplar: cada arma, cada pila de la mochila, cada pieza de armadura y cada tipo de ciberware. */
export const nicknameKey = {
  weapon: (instanceId: string) => `w:${instanceId}`,
  inventory: (id: string) => `inv:${id}`,
  armor: (location: 'head' | 'body') => `armor-${location}`,
  cyberware: (id: string) => `cw:${id}`
};

export function getItemNickname(nicks: ItemNicknames | undefined, key: string, original: string): ItemNickname | null {
  const n = nicks?.[key];
  if (!n || !n.name.trim() || n.original !== original) return null;
  return n;
}

export function displayItemName(nicks: ItemNicknames | undefined, key: string, original: string): string {
  const n = getItemNickname(nicks, key, original);
  if (!n) return original;
  return n.showOriginal ? `${n.name.trim()} (${original})` : n.name.trim();
}

/** Saca los apodos de ítems que ya no están en la ficha (o que cambiaron por otro). */
export function pruneItemNicknames(sheet: CharacterSheet): ItemNicknames | undefined {
  const nicks = sheet.itemNicknames;
  if (!nicks) return undefined;
  const alive = new Map<string, string>();
  for (const w of sheet.equippedWeapons ?? []) alive.set(nicknameKey.weapon(w.instanceId), w.name);
  for (const it of sheet.inventory ?? []) alive.set(nicknameKey.inventory(it.id), it.name);
  if (sheet.headArmor) alive.set(nicknameKey.armor('head'), sheet.headArmor.name);
  if (sheet.bodyArmor) alive.set(nicknameKey.armor('body'), sheet.bodyArmor.name);
  const out: ItemNicknames = {};
  for (const [key, n] of Object.entries(nicks)) {
    // El ciberware se guarda por id del catálogo: vale mientras quede al menos una copia instalada.
    if (key.startsWith('cw:')) {
      if ((sheet.installedCyberwareIds ?? []).includes(key.slice(3))) out[key] = n;
      continue;
    }
    if (alive.get(key) === n.original) out[key] = n;
  }
  return out;
}
