// [Claude Code · 2026-10-30] v5.9.0 (plan 23): bandeja de la columna izquierda del HUD.
import { describe, expect, it } from 'vitest';
import { moveLeftPanelTo, placeOf, splitLeftPanels } from '../leftTray';

const ORDER = ['vitals', 'armor', 'luck', 'injuries', 'cyberware', 'consumables'];

describe('splitLeftPanels', () => {
  it('por defecto todo queda en la columna', () => {
    expect(splitLeftPanels(ORDER, [], [])).toEqual({ column: ORDER, center: [], tray: [] });
  });

  it('el centro sigue el orden en que se mandaron; la columna, su orden; sin repetidos', () => {
    const r = splitLeftPanels(ORDER, ['luck', 'vitals', 'luck'], ['armor', 'vitals', 'nada']);
    expect(r.center).toEqual(['luck', 'vitals']);
    expect(r.tray).toEqual(['armor']);
    expect(r.column).toEqual(['injuries', 'cyberware', 'consumables']);
  });
});

describe('moveLeftPanelTo', () => {
  it('al centro, a la bandeja y de vuelta a la columna', () => {
    let s = moveLeftPanelTo('vitals', 'center', [] as string[], [] as string[]);
    expect(placeOf('vitals', s.center, s.tray)).toBe('center');
    s = moveLeftPanelTo('vitals', 'tray', s.center, s.tray);
    expect(s).toEqual({ center: [], tray: ['vitals'] });
    s = moveLeftPanelTo('vitals', 'column', s.center, s.tray);
    expect(s).toEqual({ center: [], tray: [] });
  });
});
