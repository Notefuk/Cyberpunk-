// [Claude Code · 2026-10-23] Tests de efectos de STAT por ciberware (plan 13): Grafted Muscle and Bone Lace.
import { describe, expect, it } from 'vitest';
import { CYBERWARE_EFFECTS, canInstallAnother, countInstalls, cyberwareStatBonus } from '../cyberwareEffects';
import { calculateMaxHp, calculateSeriouslyWoundedThreshold, getEffectiveBody } from '../characterEngine';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';
import { STAT_TOOLTIPS } from '../../data/characterCreationData';
import { STAT_KEYS } from '../characterCreation';
import type { CharacterSheet } from '../../types/cyberpunk';

const GRAFTED = 'grafted-muscle-bone-lace';
const GRAFTED_CEMK = 'cw-cemk-grafted-muscle';

const sheet = (over: Partial<CharacterSheet> = {}): CharacterSheet =>
  ({
    stats: { INT: 6, REF: 6, DEX: 6, TECH: 6, COOL: 6, WILL: 6, LUCK: 6, MOVE: 6, BODY: 6, EMP: 6 },
    currentHp: 40,
    currentHumanity: 60,
    activeInjuries: [],
    installedCyberwareIds: [],
    ...over
  }) as CharacterSheet;

describe('Grafted Muscle and Bone Lace (Core p.114, errata v1.25)', () => {
  it('declara +2 BODY por instalación con tope 10 en las dos eras (Core p.114)', () => {
    for (const id of [GRAFTED, GRAFTED_CEMK]) {
      expect(CYBERWARE_EFFECTS[id]).toEqual({ stat: 'BODY', perInstall: 2, max: 10, source: { book: 'Core RED', page: 114 } });
    }
  });

  it('countInstalls cuenta ids repetidos (Core p.114: las instalaciones se acumulan)', () => {
    expect(countInstalls([GRAFTED, 'x', GRAFTED], GRAFTED)).toBe(2);
  });

  it('x1 sobre BODY 6 da 8 y el HP sale de calculateMaxHp(8, WILL) (Core p.114)', () => {
    const c = sheet({ installedCyberwareIds: [GRAFTED] });
    expect(getEffectiveBody(c)).toBe(8);
    expect(calculateMaxHp(getEffectiveBody(c), 6)).toBe(calculateMaxHp(8, 6));
    expect(calculateMaxHp(8, 6)).toBeGreaterThan(calculateMaxHp(6, 6));
  });

  it('x2 sobre BODY 6 da 10 (Core p.114: se acumula)', () => {
    expect(getEffectiveBody(sheet({ installedCyberwareIds: [GRAFTED, GRAFTED] }))).toBe(10);
  });

  it('x3 sobre BODY 6 queda en 10 (Core p.114: no pasa de 10)', () => {
    expect(cyberwareStatBonus([GRAFTED, GRAFTED, GRAFTED], 'BODY', 6)).toBe(10);
  });

  it('con BODY base 10 no cambia (Core p.114)', () => {
    expect(cyberwareStatBonus([GRAFTED], 'BODY', 10)).toBe(10);
  });

  it('nunca baja del BODY base aunque supere 10 (Core p.114)', () => {
    expect(cyberwareStatBonus([GRAFTED], 'BODY', 12)).toBe(12);
  });

  it('la variante CEMK se comporta igual (Core p.114)', () => {
    expect(cyberwareStatBonus([GRAFTED_CEMK], 'BODY', 6)).toBe(8);
    expect(cyberwareStatBonus([GRAFTED_CEMK, GRAFTED_CEMK, GRAFTED_CEMK], 'BODY', 6)).toBe(10);
  });

  it('el FBC con bodyOverride sigue mandando (Going Metal pp. 107-108)', () => {
    const c = sheet({
      installedCyberwareIds: [GRAFTED],
      fbcState: { isFullBodyConversion: true, bodyOverride: 12 } as CharacterSheet['fbcState']
    });
    expect(getEffectiveBody(c)).toBe(12);
  });

  it('canInstallAnother bloquea cuando el BODY final ya es 10 (Core p.114)', () => {
    const base = { BODY: 6 };
    expect(canInstallAnother([GRAFTED], GRAFTED, base).ok).toBe(true);
    const full = canInstallAnother([GRAFTED, GRAFTED], GRAFTED, base);
    expect(full.ok).toBe(false);
    expect(full.reason).toBe('Tope BODY 10 (Core p.114)');
    expect(canInstallAnother([GRAFTED, GRAFTED], 'otro-ciberware', base).ok).toBe(true);
  });
});

describe('Thorn del Folio (CEMK Folios pp. 21-22)', () => {
  const thorn = CEMK_FOLIO_PREMADE_CHARACTERS.find((c) => c.id === 'cemk-folio-thorn')!;

  it('guarda BODY base 8 y el motor le da 10; HP 55 y SW 28 (CEMK Folios p.21)', () => {
    expect(thorn.stats.BODY).toBe(8);
    expect(getEffectiveBody(thorn)).toBe(10);
    const hp = calculateMaxHp(getEffectiveBody(thorn), thorn.stats.WILL);
    expect(hp).toBe(55);
    expect(calculateSeriouslyWoundedThreshold(hp)).toBe(28);
  });
});

describe('STAT_TOOLTIPS (Core RED p.72)', () => {
  it('tiene las 10 STATs con fuente Core p.72 y sin umbrales inventados', () => {
    expect(Object.keys(STAT_TOOLTIPS)).toHaveLength(10);
    for (const k of STAT_KEYS) {
      expect(STAT_TOOLTIPS[k].source).toEqual({ book: 'Core RED', page: 72 });
      expect(STAT_TOOLTIPS[k].mechanicalBreakpoints).toEqual([]);
      expect(STAT_TOOLTIPS[k].shortSummary.length).toBeGreaterThan(10);
    }
  });
});
