// Tests de reglas canon del motor. Cada caso cita la página del libro que fija el valor.
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  calculateMaxHp,
  calculateSeriouslyWoundedThreshold,
  calculateUnarmedDamage,
  getEffectiveEmp,
  isMortallyWounded,
  parseHumanityLossAverage,
  rollDeathSave,
  soloAwarenessPointCost,
  isValidSoloAllocation,
  naturalHealingPerDay,
  speedhealAmount,
  calculateTherapyMaxHumanity,
  getEffectiveMove
} from '../characterEngine';
import { MARTIAL_ARTS_FORMS, SHARED_MARTIAL_ARTS_MOVES } from '../../data/cyberfistsMartialArtsData';
import { beatsDv, calculateIncomingImpact, createDamageRoll, rollCheckD10 } from '../combatEngine';
import { BLACK_ICE_STATS, NET_ACTIONS_PER_TURN, QUICKHACKS_2077_CATALOG } from '../../data/netAndRolesData';
import { BODY_CRITICAL_INJURIES, HEAD_CRITICAL_INJURIES, rollCriticalInjury } from '../../data/criticalInjuries';
import { CEMK_WEAPON_REBUILD_SYSTEM_GUIDE } from '../../data/weaponAndCyberwareTooltips';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';
import pack from '../../data/core-rules.cprpack.json';
import type { CharacterSheet } from '../../types/cyberpunk';

const baseCharacter = (overrides: Partial<CharacterSheet> = {}): CharacterSheet =>
  ({
    stats: { INT: 6, REF: 6, DEX: 6, TECH: 6, COOL: 6, WILL: 6, LUCK: 6, MOVE: 6, BODY: 6, EMP: 6 },
    currentHp: 40,
    currentHumanity: 60,
    activeInjuries: [],
    ...overrides
  }) as CharacterSheet;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('HP y Wound States (Core pp. 80, 186)', () => {
  it('HP máximo = 10 + 5 * ceil((BODY + WILL) / 2)', () => {
    expect(calculateMaxHp(6, 6)).toBe(40);
    expect(calculateMaxHp(5, 7)).toBe(40);
    expect(calculateMaxHp(7, 8)).toBe(50);
  });
  it('Seriously Wounded por debajo de la mitad (redondeo arriba)', () => {
    expect(calculateSeriouslyWoundedThreshold(45)).toBe(23);
  });
  it('Mortally Wounded con menos de 1 HP', () => {
    expect(isMortallyWounded(0)).toBe(true);
    expect(isMortallyWounded(1)).toBe(false);
  });
});

describe('Death Saves (Core p. 188)', () => {
  it('vive si 1d10 + penalizador es menor que BODY', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3); // d10 = 4
    const r = rollDeathSave(baseCharacter({ currentHp: 0, deathSavePenalty: 1 }));
    expect(r.total).toBe(5);
    expect(r.success).toBe(true);
  });
  it('un 10 natural falla siempre', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.95); // d10 = 10
    const r = rollDeathSave(baseCharacter({ stats: { ...baseCharacter().stats, BODY: 20 } }));
    expect(r.autoFail).toBe(true);
    expect(r.success).toBe(false);
  });
});

describe('EMP y Humanidad (Core p. 80)', () => {
  it('44 HUM = EMP 4, 39 HUM = EMP 3', () => {
    expect(getEffectiveEmp(baseCharacter({ currentHumanity: 44 }))).toBe(4);
    expect(getEffectiveEmp(baseCharacter({ currentHumanity: 39 }))).toBe(3);
  });
  it('lee el promedio de Humanity Loss del pack', () => {
    expect(parseHumanityLossAverage('2d6 (7)')).toBe(7);
    expect(parseHumanityLossAverage('14 (4d6)')).toBe(14);
    expect(parseHumanityLossAverage('0 (N/A)')).toBe(0);
  });
});

describe('Brawling (Core p. 176)', () => {
  it('daño por BODY y mínimo 2d6 con Cyberarm', () => {
    expect(calculateUnarmedDamage(4)).toBe('1d6');
    expect(calculateUnarmedDamage(4, true)).toBe('2d6');
    expect(calculateUnarmedDamage(11)).toBe('4d6');
  });
});

describe('Daño y críticos (Core pp. 186-188)', () => {
  it('dos 6 en el daño = Herida Crítica con +5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // todos los d6 = 6
    const roll = createDamageRoll('Test', '2d6');
    expect(roll.isCriticalInjuryTrigger).toBe(true);
    expect(roll.critBonusDamage).toBe(5);
  });
  it('ablación solo si el daño atraviesa el SP; AP abla 2', () => {
    const base = { location: 'body' as const, isCritical: false, passExcess: true, headSp: 11, bodySp: 11, shieldSdp: 0 };
    expect(calculateIncomingImpact({ ...base, damage: 11, attackType: 'standard' }).spAblation).toBe(0);
    const hit = calculateIncomingImpact({ ...base, damage: 15, attackType: 'standard' });
    expect(hit.hpLoss).toBe(4);
    expect(hit.spAblation).toBe(1);
    expect(calculateIncomingImpact({ ...base, damage: 15, attackType: 'ap' }).spAblation).toBe(2);
  });
  it('Melee ignora la mitad del SP (redondeo arriba), Brawling no', () => {
    const base = { location: 'body' as const, isCritical: false, passExcess: true, headSp: 11, bodySp: 11, shieldSdp: 0, damage: 10 };
    expect(calculateIncomingImpact({ ...base, attackType: 'melee' }).hpLoss).toBe(4);
    expect(calculateIncomingImpact({ ...base, attackType: 'brawling' }).hpLoss).toBe(0);
  });
  it('cabeza x2, Cracked Skull x3, crítico +5 aunque no atraviese', () => {
    const base = { location: 'head' as const, passExcess: true, headSp: 7, bodySp: 11, shieldSdp: 0, attackType: 'standard' as const };
    expect(calculateIncomingImpact({ ...base, damage: 10, isCritical: false }).hpLoss).toBe(6);
    expect(calculateIncomingImpact({ ...base, damage: 10, isCritical: false, hasCrackedSkull: true }).hpLoss).toBe(9);
    expect(calculateIncomingImpact({ ...base, damage: 5, isCritical: true }).hpLoss).toBe(5);
  });
});

describe('Tablas de Heridas Críticas (Core pp. 187-188)', () => {
  it('cuerpo en el orden del libro', () => {
    const names = BODY_CRITICAL_INJURIES.map(i => i.name);
    expect(names[0]).toContain('Dismembered Arm');
    expect(names[1]).toContain('Dismembered Hand');
    expect(names[2]).toContain('Collapsed Lung');
    expect(names[6]).toContain('Broken Leg');
    expect(names[10]).toContain('Dismembered Leg');
    expect(BODY_CRITICAL_INJURIES).toHaveLength(11);
    expect(HEAD_CRITICAL_INJURIES).toHaveLength(11);
  });
  it('vuelve a tirar si el objetivo ya sufre esa herida', () => {
    const allButOne = BODY_CRITICAL_INJURIES.filter(i => i.roll !== 7).map(i => i.name);
    expect(rollCriticalInjury('body', allButOne).roll).toBe(7);
  });
});

describe('Checks contra DV (CEMK p. 5)', () => {
  it('hay que superar el DV, igualarlo falla', () => {
    expect(beatsDv(9, 8)).toBe(true);
    expect(beatsDv(8, 8)).toBe(false);
  });

  it('el 10 explota una sola vez y el 1 resta 1d10', () => {
    const seq = [0.95, 0.95];
    const explode = rollCheckD10(() => seq.shift() ?? 0);
    expect(explode).toEqual({ natural: 10, extra: 10, value: 20 });
    const seq2 = [0, 0.45];
    expect(rollCheckD10(() => seq2.shift() ?? 0)).toEqual({ natural: 1, extra: 5, value: -4 });
  });
});

describe('NET y Quickhacks (CEMK pp. 15-17, Core pp. 206-207)', () => {
  it('hasta 3 NET Actions por turno (CEMK p. 15)', () => {
    expect(NET_ACTIONS_PER_TURN).toBe(3);
  });

  it('11 Quickhacks con los DV del libro', () => {
    const dvByName = Object.fromEntries(QUICKHACKS_2077_CATALOG.map(q => [q.name, q.dv]));
    expect(QUICKHACKS_2077_CATALOG).toHaveLength(11);
    expect(dvByName).toMatchObject({
      'Impair Movement': 6, 'Sonic Shock': 6, Overheat: 8, 'Short Circuit': 8,
      'Cyberware Malfunction': 10, Lure: 10, Slow: 10, 'Synapse Burnout': 10,
      Puppet: 12, 'Shard Ejection': 12, 'System Reset': 12
    });
  });

  it('Black ICE con los valores del Core (Asp, Giant, Dragon)', () => {
    expect(BLACK_ICE_STATS.Asp).toEqual({ per: 4, spd: 6, atk: 2, def: 2, rez: 15 });
    expect(BLACK_ICE_STATS.Giant).toEqual({ per: 2, spd: 2, atk: 8, def: 4, rez: 25 });
    expect(BLACK_ICE_STATS.Dragon).toEqual({ per: 6, spd: 4, atk: 6, def: 6, rez: 30 });
  });
});

describe('Datos CEMK canon', () => {
  const byId = <T extends { id: string }>(list: T[], id: string) => list.find((x) => x.id === id);

  it('los Rebuilds cuestan 1,000 €$ y ocupan 2 ranuras (CEMK pp. 30-31)', () => {
    for (const opt of CEMK_WEAPON_REBUILD_SYSTEM_GUIDE.rebuildOptions) {
      expect(opt.costEb).toBe(1000);
      expect(opt.attachmentSlots).toBe(2);
    }
  });

  it('el pack tiene las 13 armas CEMK con su costo (CEMK pp. 31-34)', () => {
    const cemk = (pack.weapons as { id: string; sourceBook?: string; cost?: number }[]).filter(
      (w) => w.sourceBook === 'cemk' && !w.id.endsWith('-2077')
    );
    expect(cemk).toHaveLength(13);
    expect(byId(cemk, 'militech-crusher')?.cost).toBe(1000);
    expect(byId(cemk, 'arasaka-hjke11-yukimura')?.cost).toBe(500);
  });

  it('Neuroport 1,000 €$ y HL 7; Mantis Blades HL 14 (CEMK pp. 34-36)', () => {
    const cw = pack.cyberware as { id: string; cost?: number; humanityLoss?: string | number }[];
    expect(byId(cw, 'cw-cemk-neuroport')?.cost).toBe(1000);
    expect(String(byId(cw, 'cw-cemk-neuroport')?.humanityLoss)).toContain('7');
    expect(String(byId(cw, 'cw-cemk-mantis-blades')?.humanityLoss)).toContain('14');
  });

  it('Boosterganger con BODY 2 y Death Save 2 (Errata v1.25 p. 412)', () => {
    const booster = ENEMIES_CATALOG.find((e) => e.id === 'core-boosterganger');
    expect(booster?.stats.BODY).toBe(2);
    expect(booster?.deathSave).toBe(2);
  });
});

describe('Roles, curación y Humanidad del Core', () => {
  const solo = { fumbleRecovery: false, damageDeflection: 0, initiativeReaction: 0, precisionAttack: 0, spotWeakness: 0, threatDetection: 0 };

  it('Combat Awareness: Precision +1 cuesta 3, Deflection -1 cuesta 2, Fumble Recovery 4 (Core p. 146)', () => {
    expect(soloAwarenessPointCost({ ...solo, precisionAttack: 1, damageDeflection: 1, fumbleRecovery: true })).toBe(9);
    expect(isValidSoloAllocation({ ...solo, precisionAttack: 2 }, 6)).toBe(true);
    expect(isValidSoloAllocation({ ...solo, precisionAttack: 2, spotWeakness: 1 }, 6)).toBe(false);
    expect(isValidSoloAllocation({ ...solo, precisionAttack: 4 }, 12)).toBe(false);
  });

  it('curación natural BODY por día; Enhanced Antibodies x2 y Cryotank x2 (Core pp. 114, 223, 353)', () => {
    expect(naturalHealingPerDay(6)).toBe(6);
    expect(naturalHealingPerDay(6, true)).toBe(12);
    expect(naturalHealingPerDay(6, true, true)).toBe(24);
  });

  it('Speedheal cura BODY + WILL y no funciona en Mortally Wounded (Core p. 150)', () => {
    expect(speedhealAmount(6, 5, 10)).toBe(11);
    expect(speedhealAmount(6, 5, 0)).toBe(0);
  });

  it('máximo de Humanidad por terapia: -2 por ciberware, -4 borgware, 0 HL no cuenta (Core p. 230)', () => {
    expect(
      calculateTherapyMaxHumanity(6, [
        { humanityLoss: '2d6 (7)', type: 'Cyberoptics' },
        { humanityLoss: '4d6 (14)', type: 'Borgware' },
        { humanityLoss: '0 (N/A)', type: 'Fashionware' }
      ])
    ).toBe(54);
  });

  it('Special Moves del Core con nombre y DV del libro; Recovery DV 13 (Core pp. 179-180)', () => {
    const core = MARTIAL_ARTS_FORMS.filter((f) => f.sourceBook === 'core');
    expect(core.flatMap((f) => f.moves.map((m) => m.name)).sort()).toEqual(
      [
        'Armor Breaking Combination',
        'Bone Breaking Strike',
        'Counter Throw',
        'Disarming Combination',
        'Flying Kick',
        'Grab Escape',
        'Iron Grip',
        'Pressure Point Strike'
      ]
    );
    const bone = core.flatMap((f) => f.moves).find((m) => m.name === 'Bone Breaking Strike');
    expect(bone?.isOpposed).toBe(true);
    expect(SHARED_MARTIAL_ARTS_MOVES[0].resolutionDv).toBe(13);
  });
});

describe('Full Body Conversion (Going Metal pp. 94, 107-108)', () => {
  const fbc = (statFloor: number): CharacterSheet['fbcState'] => ({
    isFullBodyConversion: true,
    hasBiopod: true,
    activeChassisId: 'test',
    activeChassisName: 'Test',
    bodyOverride: 10,
    statFloor,
    baseArmorSp: 11,
    immunities: []
  });
  it('MOVE no baja del mínimo del chasis y lo respeta si es mayor', () => {
    const low = baseCharacter({ stats: { ...baseCharacter().stats, MOVE: 4 }, fbcState: fbc(6) });
    const high = baseCharacter({ stats: { ...baseCharacter().stats, MOVE: 8 }, fbcState: fbc(6) });
    expect(getEffectiveMove(low)).toBe(6);
    expect(getEffectiveMove(high)).toBe(8);
  });
  it('FBC Mortally Wounded no pierde MOVE por Wound State (p. 94)', () => {
    const c = baseCharacter({ currentHp: 0, fbcState: fbc(6) });
    expect(getEffectiveMove(c)).toBe(6);
  });
  it('Speedheal no funciona en un FBC', () => {
    expect(speedhealAmount(6, 6, 30, true)).toBe(0);
  });
  it('Borgware x2 baja 8 el tope de terapia', () => {
    const base = calculateTherapyMaxHumanity(6, []);
    expect(calculateTherapyMaxHumanity(6, [{ humanityLoss: '7', type: 'Borgware x2' }])).toBe(base - 8);
  });
});
