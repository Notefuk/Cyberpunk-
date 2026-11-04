// [Claude Code · 2026-11-04] v5.10.0 (plan 24): código para pasar una ficha.
import { describe, expect, it } from 'vitest';
import {
  TRANSFER_ALPHABET,
  campaignIdsAfterClaim,
  formatTransferCode,
  newTransferCode,
  parseTransferCode,
} from '../transferCode';

describe('código de traspaso', () => {
  it('tiene 10 caracteres y ninguno se confunde (0/O, 1/I/L)', () => {
    for (let i = 0; i < 50; i++) {
      const code = newTransferCode();
      expect(code).toHaveLength(10);
      expect(code).not.toMatch(/[01OIL]/);
      for (const ch of code) expect(TRANSFER_ALPHABET).toContain(ch);
    }
  });

  it('no se sale del alfabeto aunque rand devuelva casi 1', () => {
    expect(newTransferCode(() => 0.999999)).toBe('9'.repeat(10));
    expect(newTransferCode(() => 0)).toBe('A'.repeat(10));
  });

  it('se muestra con guion y se lee con o sin guion, espacios o minúsculas', () => {
    expect(formatTransferCode('K7P4QX9M2R')).toBe('K7P4Q-X9M2R');
    expect(parseTransferCode('k7p4q-x9m2r')).toBe('K7P4QX9M2R');
    expect(parseTransferCode(' K7P4Q X9M2R ')).toBe('K7P4QX9M2R');
  });

  it('rechaza lo que no es un código', () => {
    expect(parseTransferCode('')).toBeNull();
    expect(parseTransferCode('K7P4Q')).toBeNull();
    expect(parseTransferCode('K7P4QX9M2O')).toBeNull(); // la O no está en el alfabeto
  });
});

describe('campaña al recibir la ficha', () => {
  it('sigue en la campaña si el que la recibe es miembro', () => {
    expect(campaignIdsAfterClaim(['camp1'], ['camp1', 'camp2'])).toEqual(['camp1']);
  });

  it('sale de la campaña si no es miembro, o si no tenía', () => {
    expect(campaignIdsAfterClaim(['camp1'], ['camp2'])).toEqual([]);
    expect(campaignIdsAfterClaim([], ['camp1'])).toEqual([]);
    expect(campaignIdsAfterClaim(undefined, [])).toEqual([]);
  });
});
