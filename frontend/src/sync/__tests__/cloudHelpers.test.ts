// [Claude Code · 2026-10-24] v5.0.0 (plan 16/17): tests de los helpers puros de cloudCharacters.
import { describe, it, expect } from 'vitest';
import { mergeIpLog, mergeTransactions, chooseUploadId } from '../cloudCharacters';
import type { EurodollarTransaction, IpLogEntry } from '../../types/cyberpunk';

const ip = (id: string, at: string): IpLogEntry => ({ id, at, kind: 'earned' as IpLogEntry['kind'], delta: 1, reason: 'x', balanceAfter: 1 });
const tx = (id: string, timestamp: string): EurodollarTransaction => ({ id, timestamp, concept: 'x', amount: 1, balanceAfter: 1 });

describe('mergeIpLog', () => {
  it('saca duplicados por id y ordena por fecha ascendente', () => {
    const out = mergeIpLog([ip('b', '2026-02'), ip('a', '2026-01')], [ip('b', '2026-02'), ip('c', '2026-03')]);
    expect(out.map((e) => e.id)).toEqual(['a', 'b', 'c']);
  });
  it('acepta local vacío o indefinido', () => {
    expect(mergeIpLog(undefined, [ip('a', '1')]).length).toBe(1);
  });
});

describe('mergeTransactions', () => {
  it('saca duplicados y deja las más nuevas primero', () => {
    const out = mergeTransactions([tx('a', '2026-01')], [tx('a', '2026-01'), tx('b', '2026-05')]);
    expect(out.map((e) => e.id)).toEqual(['b', 'a']);
  });
  it('limita a 50', () => {
    const many = Array.from({ length: 70 }, (_, i) => tx('t' + i, String(1000 + i)));
    const out = mergeTransactions([], many);
    expect(out.length).toBe(50);
    expect(out[0].id).toBe('t69');
  });
});

describe('chooseUploadId', () => {
  it('mantiene ids char- que no existen', () => {
    expect(chooseUploadId('char-123-abc', false, 1, 0.5)).toBe('char-123-abc');
  });
  it('reemplaza ids de precargadas', () => {
    const id = chooseUploadId('cemk-folio-thorn', false, 99, 0.5);
    expect(id.startsWith('char-99-')).toBe(true);
    expect(id).not.toBe('cemk-folio-thorn');
  });
  it('reemplaza ids que ya existen en la nube', () => {
    expect(chooseUploadId('char-123-abc', true, 99, 0.5)).not.toBe('char-123-abc');
  });
});
