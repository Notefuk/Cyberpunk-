// [Claude Code · 2026-11-11] v5.20.0 (plan 27): pregens del Single Shot Pack, PNJ y NET de Interface RED.
import { describe, expect, it } from 'vitest';
import { PREGEN_TEMPLATES, buildCharacterSheetFromPregen } from '../../data/characterCreationData';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';
import { HARDENED_ENEMIES } from '../../data/enemies/hardened';
import { NET_ARCHITECTURE_PRESETS } from '../../data/netAndRolesData';
import { HALLOWEEN_ADVENTURES } from '../../data/gmTables/halloween';

const ss = PREGEN_TEMPLATES.filter((p) => p.id.startsWith('pregen-ss-'));

describe('Single Shot Pack (Interface RED Vol. 1 pp.10-31)', () => {
  it('10 pregens, una por rol, con el Neuroport de CEMK', () => {
    expect(ss).toHaveLength(10);
    expect(new Set(ss.map((p) => p.role)).size).toBe(10);
    for (const p of ss) {
      expect(p.cyberwareIds).toContain('cw-cemk-neuroport');
      expect(p.hasNeuroport).toBe(true);
      expect(p.sourceBadge).toMatch(/Single Shot Pack p\.\d+/);
    }
  });

  it('Grease (Fixer, IR1 p.14): stats, HP 35 y Humanidad 44 impresas', () => {
    const g = ss.find((p) => p.handle === 'Grease')!;
    expect(g.role).toBe('Fixer');
    expect(g.stats).toMatchObject({ INT: 8, REF: 7, DEX: 5, TECH: 5, COOL: 6, WILL: 7, LUCK: 7, MOVE: 5, BODY: 3, EMP: 6 });
    expect(g.eurodollars).toBe(500);
    const sheet = buildCharacterSheetFromPregen(g);
    expect(sheet.currentHp).toBe(35);
    expect(sheet.currentHumanity).toBe(44);
    expect(sheet.hasNeuroport).toBe(true);
    expect(sheet.installedCyberwareIds).toEqual(expect.arrayContaining(['cw-cemk-neuroport', 'voice-stress-analyzer']));
  });

  it('HP de cada ficha = 10 + 5 × ⌈(BODY + WILL) / 2⌉ (Core p.73)', () => {
    for (const p of ss) {
      expect(buildCharacterSheetFromPregen(p).currentHp, p.handle).toBe(10 + 5 * Math.ceil((p.stats.BODY + p.stats.WILL) / 2));
    }
  });
});

describe('PNJ de Interface RED', () => {
  const ir = ENEMIES_CATALOG.filter((e) => e.sourceBook === 'interface_red');

  it('11 de la Jumpstart Kit Conversion Guide (IR2 pp.25-30) y 2 de Halloween Screamsheets (IR4)', () => {
    expect(ir.filter((e) => e.id.startsWith('ir2-'))).toHaveLength(11);
    expect(ir.filter((e) => e.id.startsWith('ir4-'))).toHaveLength(2);
  });

  it('Rico Rico: el libro imprime 45 HP aunque la fórmula da 40 (IR2 p.29); se deja lo impreso', () => {
    const r = ir.find((e) => e.id === 'ir2-rico-robinson')!;
    expect(r.hp).toBe(45);
    expect(r.deathSave).toBe(7);
  });

  it('Hardened: siguen siendo 16 y se suma el Brawling que imprime IR2 (pp.11-13)', () => {
    expect(HARDENED_ENEMIES).toHaveLength(16);
    const siege = HARDENED_ENEMIES.find((e) => e.id === 'hardened-security-officer-siege')!;
    expect(siege.weapons.some((w) => w.name === 'Brawling' && w.damage === '3d6')).toBe(true);
    const roadGanger = HARDENED_ENEMIES.find((e) => e.id === 'hardened-road-ganger')!;
    expect(roadGanger.hp).toBe(25); // DLC Hardened Mooks p.3; IR2 p.5 imprime 30, que no cuadra con BODY 3 / WILL 3
  });
});

describe('NET de Interface RED', () => {
  const nets = NET_ARCHITECTURE_PRESETS.filter((n) => /^net-ir[12]-/.test(n.id));

  it('6 del Single Shot Pack (IR1 pp.32-36) y 2 de la Jumpstart (IR2 pp.30-31)', () => {
    expect(nets.filter((n) => n.id.startsWith('net-ir1-'))).toHaveLength(6);
    expect(nets.filter((n) => n.id.startsWith('net-ir2-'))).toHaveLength(2);
    for (const n of nets) expect(n.floors).toHaveLength(n.totalFloors);
  });

  it('Los Black ICE simples llevan sus stats del Core (pp.206-207)', () => {
    const conapt = nets.find((n) => n.id === 'net-ir1-conapt-security')!;
    expect(conapt.floors[1]).toMatchObject({ iceType: 'Wisp', iceHp: 15, iceAtk: 4, iceDef: 2 });
  });
});

describe('Halloween Screamsheets (IR4 pp.56-65)', () => {
  it('3 aventuras con página', () => {
    expect(HALLOWEEN_ADVENTURES).toHaveLength(3);
    for (const a of HALLOWEEN_ADVENTURES) expect(a.pages).toMatch(/^\d+-\d+$/);
  });
});
