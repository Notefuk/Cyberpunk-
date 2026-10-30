// Heridas que pide Surgery (Core pp.187-188). [Claude Code · 2026-10-29]
import { describe, expect, it } from 'vitest';
import { surgeryInjuries } from '../medicineInfo';

describe('surgeryInjuries (Core pp.187-188)', () => {
  const list = surgeryInjuries();

  it('18 heridas se tratan con Surgery y 6 también con Paramedic', () => {
    expect(list).toHaveLength(18);
    expect(list.filter((i) => i.paramedicDv !== undefined)).toHaveLength(6);
  });

  it('cada una tiene su DV de Surgery (13, 15 o 17)', () => {
    for (const i of list) expect([13, 15, 17]).toContain(i.surgeryDv);
  });

  it('"Paramedic DV 15 o Surgery DV 13" separa los dos DV', () => {
    const split = list.find((i) => i.paramedicDv === 15 && i.surgeryDv === 13);
    expect(split).toBeDefined();
  });

  it('Ojo Perdido: Surgery DV 17, sin Paramedic', () => {
    const eye = list.find((i) => i.id === 'head-2')!;
    expect(eye.surgeryDv).toBe(17);
    expect(eye.paramedicDv).toBeUndefined();
  });
});
