// [Claude Code · 2026-11-12] v5.23.0 (plan 28): el GM le da un ítem del catálogo a un jugador.
// Entra al inventario (se suma a la pila si ya tiene el mismo catalogId) con un movimiento de €$ 0 a nombre del GM.
import type { InventoryItem } from '../types/cyberpunk';

export type GiveItem = Pick<InventoryItem, 'catalogId' | 'name' | 'category' | 'cost'> & { details?: string };

export const GIVE_MAX_QTY = 99;

export function addToInventory(inventory: InventoryItem[], item: GiveItem, quantity: number): InventoryItem[] {
  const qty = Math.max(1, Math.min(GIVE_MAX_QTY, Math.round(quantity) || 1));
  const idx = inventory.findIndex((i) => i.catalogId === item.catalogId);
  if (idx >= 0) return inventory.map((i, n) => (n === idx ? { ...i, quantity: i.quantity + qty } : i));
  const added: InventoryItem = {
    id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    catalogId: item.catalogId,
    name: item.name,
    category: item.category,
    cost: item.cost,
    quantity: qty,
  };
  if (item.details) added.details = item.details;
  return [...inventory, added];
}
