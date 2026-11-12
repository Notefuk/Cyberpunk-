// [Claude Code · 2026-11-12] v5.23.0 (plan 28): dar ítems y notas del GM por jugador.
import { describe, it, expect } from 'vitest';
import { addToInventory, GIVE_MAX_QTY } from '../gmGive';
import { setPlayerNote, playerNote, parsePlayerNotes, PLAYER_NOTES_MAX } from '../gmPlayerNotes';
import type { InventoryItem } from '../../types/cyberpunk';

const medkit = { catalogId: 'gear-medtech-bag', name: 'Medtech Bag', category: 'gear' as const, cost: 100, details: 'Core p.351' };

describe('dar ítem', () => {
  it('entra nuevo al inventario o se suma a la pila', () => {
    const one = addToInventory([], medkit, 1);
    expect(one).toHaveLength(1);
    expect(one[0]).toMatchObject({ catalogId: 'gear-medtech-bag', name: 'Medtech Bag', quantity: 1, details: 'Core p.351' });
    const two = addToInventory(one, medkit, 2);
    expect(two).toHaveLength(1);
    expect(two[0].quantity).toBe(3);
  });

  it('la cantidad va de 1 a 99', () => {
    expect(addToInventory([], medkit, 0)[0].quantity).toBe(1);
    expect(addToInventory([], medkit, 500)[0].quantity).toBe(GIVE_MAX_QTY);
  });

  it('no toca los otros ítems', () => {
    const other: InventoryItem = { id: 'i1', catalogId: 'x', name: 'X', category: 'gear', cost: 0, quantity: 1 };
    expect(addToInventory([other], medkit, 1)[0]).toBe(other);
  });
});

describe('notas por jugador', () => {
  it('pone, cambia y saca la nota', () => {
    let list = setPlayerNote([], 'c1', 'Le debe plata a Rogue');
    list = setPlayerNote(list, 'c2', 'Es de Arasaka');
    expect(playerNote(list, 'c1')).toBe('Le debe plata a Rogue');
    list = setPlayerNote(list, 'c1', 'Ya pagó');
    expect(list.map((n) => n.charId)).toEqual(['c1', 'c2']);
    list = setPlayerNote(list, 'c1', '   ');
    expect(list.map((n) => n.charId)).toEqual(['c2']);
  });

  it('tope de 100 jugadores y lectura tolerante', () => {
    let list = parsePlayerNotes(Array.from({ length: PLAYER_NOTES_MAX }, (_, i) => ({ charId: 'c' + i, text: 'x' })));
    list = setPlayerNote(list, 'nuevo', 'y');
    expect(list).toHaveLength(PLAYER_NOTES_MAX);
    expect(list[0].charId).toBe('nuevo');
    expect(parsePlayerNotes({ c1: 'x' })).toEqual([]);
    expect(parsePlayerNotes([{ charId: 'c1', text: 'ok' }, { charId: 2 }])).toEqual([{ charId: 'c1', text: 'ok' }]);
  });
});
