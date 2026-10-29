// Tests del nombre de archivo de las fichas descargadas (v5.3.1). [Claude Code · 2026-10-29]
import { describe, it, expect } from 'vitest';
import { characterFileName } from '../characterFile';

describe('characterFileName', () => {
  it('arma "personaje - rol (jugador).json"', () => {
    expect(characterFileName('Insurance [CEMK Folio]', 'Medtech', 'Hie 2ss')).toBe('Insurance [CEMK Folio] - Medtech (Hie 2ss).json');
  });

  it('saca los caracteres que Windows no acepta', () => {
    expect(characterFileName('Doc: "Varela"/2', 'Med*tech', 'Ti?ziano')).toBe('Doc Varela2 - Medtech (Tiziano).json');
  });

  it('sin jugador o sin rol no deja paréntesis ni guiones vacíos', () => {
    expect(characterFileName('KIWI', 'Solo', '')).toBe('KIWI - Solo.json');
    expect(characterFileName('KIWI', '', '')).toBe('KIWI.json');
    expect(characterFileName('  ', 'Solo', 'Ana')).toBe('Ficha - Solo (Ana).json');
  });
});
