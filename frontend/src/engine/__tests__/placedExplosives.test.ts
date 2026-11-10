// [Claude Code · 2026-11-10] v5.14.1: auditoría del plan 26.
import { describe, it, expect } from 'vitest';
import coreData from '../../data/core-rules.cprpack.json';
import { isPlacedExplosive, weaponAttackLines } from '../weaponAttackLines';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';
import type { WeaponItem } from '../../types/cyberpunk';

const weapons = coreData.weapons as unknown as WeaponItem[];
const sheet = CEMK_FOLIO_PREMADE_CHARACTERS[0];

describe('Explosivos que se colocan (Black Chrome pp.87-90)', () => {
  it('los 5 de Demolitions no muestran tirada de ataque', () => {
    const placed = weapons.filter((w) => isPlacedExplosive(w));
    expect(placed.map((w) => w.id).sort()).toEqual(['gunmart-door-cracker', 'killchip-100-micro-bomb', 'micro-hydrogen-combustor', 'outlet-explosive', 'tr-4-detonator-fluid']);
    for (const w of placed) {
      const atk = weaponAttackLines(sheet, w);
      expect(atk.single).toMatch(/no se tira para atacar/);
      expect(atk.burst).toBeUndefined();
    }
  });

  it('una granada sí se tira (DEX + Athletics)', () => {
    const g = weapons.find((w) => w.id === 'arachnid-grenade')!;
    expect(isPlacedExplosive(g)).toBe(false);
    expect(weaponAttackLines(sheet, g).single).toMatch(/DEX .* Athletics/);
  });
});

describe('Ciberware sin instalación en clínica', () => {
  it('el Explicit Memory Stimulator (Chipware) y el EL-F4-NT (solo externo) no se instalan', () => {
    const cw = coreData.cyberware as unknown as { id: string; install: string }[];
    for (const id of ['explicit-memory-stimulator', 'linear-frame-el-f4-nt']) expect(cw.find((c) => c.id === id)!.install).toBe('N/A');
  });
});
