// Tests de reglas canon del motor. Cada caso cita la página del libro que fija el valor.
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  calculateMaxHp,
  calculateSeriouslyWoundedThreshold,
  calculateMartialArtsDamage,
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
import { MARTIAL_ARTS_FORMS, MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT, SHARED_MARTIAL_ARTS_MOVES } from '../../data/cyberfistsMartialArtsData';
import { beatsDv, calculateIncomingImpact, createDamageRoll, rollCheckD10 } from '../combatEngine';
import { BLACK_ICE_STATS, NET_ACTIONS_PER_TURN, QUICKHACKS_2077_CATALOG } from '../../data/netAndRolesData';
import { BODY_CRITICAL_INJURIES, HEAD_CRITICAL_INJURIES, rollCriticalInjury } from '../../data/criticalInjuries';
import { CEMK_WEAPON_REBUILD_SYSTEM_GUIDE } from '../../data/weaponAndCyberwareTooltips';
import { ENEMIES_CATALOG, convertEnemyToCharacterSheet, type EnemySheet } from '../../data/enemiesCatalog';
import { CORE_ENEMIES } from '../../data/enemies/core';
import { CEMK_ENEMIES } from '../../data/enemies/cemk';
import { HARDENED_ENEMIES } from '../../data/enemies/hardened';
import { portEnemyToCemk } from '../cemkPort';
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

describe('Ripperdoc: todo el ciberware tiene zona anatómica', () => {
  it('cada implante del pack y de Going Metal cae en al menos una zona', async () => {
    const { itemMatchesZone, ZONE_CONFIGS } = await import('../../features/cyberware/ripperdocZones');
    const { FBC_16_CYBERWARE } = await import('../../data/goingMetalFbcData');
    const zones = Object.keys(ZONE_CONFIGS) as (keyof typeof ZONE_CONFIGS)[];
    const all = [...(pack.cyberware as { id: string; type: string }[]), ...FBC_16_CYBERWARE] as Parameters<typeof itemMatchesZone>[0][];
    const sinZona = all.filter((cw) => !zones.some((z) => itemMatchesZone(cw, z))).map((cw) => `${cw.id} (${cw.type})`);
    expect(sinZona).toEqual([]);
  });
});

describe('Cyberfists of Fury canon (IR4 pp. 74-84)', () => {
  const ir4Forms = MARTIAL_ARTS_FORMS.filter((f) => f.sourceBook === 'interface_red');
  const CANON_NAMES = [
    'Arasaka-te', 'Arnis', 'Boxing', 'Capoeira', 'Choy Li Fut', 'Drunken Fist', 'Gun Fu', 'Jujutsu',
    'Kendo', 'Krav Maga', 'Kung Fu', 'Kyudo', 'Militech Commando Training', 'Muay Thai', 'Multiarm Melee',
    'PanzerFaust', 'Silat', 'Sov-System', 'Sumo', 'Tai Chi', 'Thamoc', 'Thrash Sambo', 'Wrestling'
  ];
  const DELETED_IDS = [
    'animal-kung-fu', 'chornobogs-kommando', 'cyber-wrestling', 'hapkido', 'jeet-kune-do',
    'jiu-jitsu', 'lethwei', 'ninjutsu', 'savate', 'systema'
  ];

  it('hay exactamente 23 formas de Interface RED con los nombres canon (IR4 pp. 76-83)', () => {
    expect(ir4Forms).toHaveLength(23);
    expect(ir4Forms.map((f) => f.name).sort()).toEqual([...CANON_NAMES].sort());
  });

  it('total 27 formas y 54 movimientos (4 Core + 23 IR4)', () => {
    expect(MARTIAL_ARTS_FORMS).toHaveLength(27);
    expect(MARTIAL_ARTS_FORMS.flatMap((f) => f.moves)).toHaveLength(54);
  });

  it('cada forma y movimiento IR4 cita una página entre 74 y 84', () => {
    for (const f of ir4Forms) {
      expect(f.sourcePage, f.id).toBeGreaterThanOrEqual(74);
      expect(f.sourcePage, f.id).toBeLessThanOrEqual(84);
      for (const m of f.moves) {
        expect(m.sourcePage, m.id).toBeGreaterThanOrEqual(74);
        expect(m.sourcePage, m.id).toBeLessThanOrEqual(84);
      }
    }
  });

  it('las formas inventadas eliminadas ya no existen', () => {
    const ids = MARTIAL_ARTS_FORMS.map((f) => f.id);
    for (const id of DELETED_IDS) expect(ids).not.toContain(id);
  });

  it('todo movimiento IR4 no enfrentado tiene un DV fijo mayor que 0', () => {
    for (const m of ir4Forms.flatMap((f) => f.moves).filter((mv) => !mv.isOpposed)) {
      expect(m.resolutionDv, m.id).toBeGreaterThan(0);
    }
  });
});

describe('Plan 5 v4.6.2 canon', () => {
  // Hornet's Pharmacy v1.11 pp.2-5, 12 Days of Gunmas v1.3 pp.3-7, Errata v1.25 pp.2-4.
  type PackItem = { id: string; name: string; description?: string; sourceBook?: string; sourceBookTitle?: string; sourcePage?: number; addictionDv?: number };
  const all = (): PackItem[] => {
    const p = pack as unknown as Record<string, PackItem[]>;
    return [...p.weapons, ...p.armor, ...p.attachments, ...p.ammunition, ...p.cyberware, ...p.drugs, ...p.gear, ...p.programs];
  };
  const byId = (id: string) => all().find((x) => x.id === id);

  it('los items inventados de Hornet y Gunmas ya no existen', () => {
    const ids = all().map((x) => x.id);
    for (const id of ['drug-hover', 'drug-red-glass', 'drug-detox-additive', 'midnight-erebus', 'militech-fox-dual', 'rostovic-kolokol']) {
      expect(ids).not.toContain(id);
    }
  });

  it('Gunmas v1.3 pp.3-7: exactamente 12 armas con los nombres canon', () => {
    const CANON = [
      'Arasaka WAA Bullpup Assault Weapon',
      'Constitutional Arms Multiple Ammunition Pistol',
      'IMI Chainknife',
      'Kendachi Dragon Flamethrower',
      'Magnum Opus Hellbringer',
      'Malorian Arms Sub-Flechette Gun',
      'Militech Crusher (Gunmas)',
      'Mustang Arms ARS-5 Submachine Gun',
      'Nomad Pneumatic Bolt Gun',
      'Nova Model 757 Cityhunter',
      'Stolbovoy ST-5 Assault Rifle',
      'Teen Dreem'
    ];
    const gunmas = (pack.weapons as PackItem[]).filter((w) => w.sourceBookTitle === '12 Days of Gunmas');
    expect(gunmas).toHaveLength(12);
    expect(gunmas.map((w) => w.name).sort()).toEqual([...CANON].sort());
    for (const w of gunmas) {
      expect(w.sourceBook, w.id).toBe('dlc');
      expect(w.sourcePage, w.id).toBeGreaterThanOrEqual(3);
      expect(w.sourcePage, w.id).toBeLessThanOrEqual(7);
    }
    // El Crusher del CEMK es otra arma y se conserva.
    expect(byId('militech-crusher')?.sourceBook).toBe('cemk');
  });

  it('Gunmas p.5: Nova Cityhunter cuesta 1000, cargador 18, ROF 2', () => {
    const w = (pack.weapons as Array<PackItem & { cost: number; standardMag: number; rof: number }>).find((x) => x.id === 'nova-cityhunter');
    expect(w?.cost).toBe(1000);
    expect(w?.standardMag).toBe(18);
    expect(w?.rof).toBe(2);
  });

  it("Hornet's pp.2-3: Berserker, Prime Time, Sixgun y Timewarp tienen adiccion DV17 y son DLC", () => {
    for (const id of ['drug-berserk', 'drug-prime-time', 'drug-sixgun', 'timewarp']) {
      const d = byId(id);
      expect(d, id).toBeDefined();
      expect(d?.addictionDv, id).toBe(17);
      expect(d?.sourceBook, id).toBe('dlc');
      expect(d?.sourceBookTitle, id).toBe("Hornet's Pharmacy");
    }
    expect(byId('drug-berserk')?.name).toBe('Berserker');
    expect(byId('timewarp')?.sourcePage).toBe(3);
  });

  it("Hornet's pp.4-5: aditivos, farmaceuticos, dron e implantes canon existen", () => {
    for (const id of ['drug-delaying-compound', 'drug-distilling-compound', 'drug-osmosis-compound', 'drug-sedative', 'drug-veritas', 'suzumebachi-assassin-drone', 'bodyweight-autoinjector', 'pursuit-security-gas-jet']) {
      expect(byId(id), id).toBeDefined();
    }
  });

  it('Errata v1.25 p.2 (Core p.114): Grafted Muscle and Bone Lace cambia el Wound Threshold', () => {
    expect(byId('grafted-muscle-bone-lace')?.description).toContain('Wound Threshold');
  });
});

describe('Porte CEMK de PNJ (plan 6)', () => {
  const mk = (o: Record<string, unknown> = {}): EnemySheet =>
    ({
      id: 't', name: 'T', role: 'Solo', hp: 35, deathSave: 5, headSp: 11, bodySp: 11,
      stats: { INT: 5, REF: 5, DEX: 5, TECH: 5, COOL: 5, WILL: 6, LUCK: 5, MOVE: 5, BODY: 6, EMP: 5 },
      weapons: [{ name: 'Unity Handgun', skillBase: 10, damage: '3d6', rof: 2, mag: 12 }],
      ...o
    }) as unknown as EnemySheet;

  it('RB pp.15, 35-36: todo PNJ portado tiene Neuroport y es hackeable', () => {
    const p = portEnemyToCemk(mk());
    expect(p.hasNeuroport).toBe(true);
    expect(p.hackable).toBe(true);
  });

  it('RB p.16-17, 25: netrunner Interface 4 = 3 Net Actions, 50 m, DV max 12', () => {
    const p = portEnemyToCemk(mk({ role: 'Netrunner', roleAbility: { name: 'Interface', rank: 4 } }));
    expect(p.netActionsPerTurn).toBe(3);
    expect(p.cyberdeckPortRangeM).toBe(50);
    expect(p.maxQuickhackDv).toBe(12);
    expect(p.availableQuickhacks.length).toBeGreaterThan(0);
    const dvByName = Object.fromEntries(QUICKHACKS_2077_CATALOG.map(q => [q.name, q.dv]));
    expect(p.availableQuickhacks.every(n => dvByName[n] <= 12)).toBe(true);
  });

  it('RB p.25: Interface 3 limita a DV 10', () => {
    const p = portEnemyToCemk(mk({ isNetrunner: true, interfaceRank: 3 }));
    expect(p.maxQuickhackDv).toBe(10);
    expect(p.availableQuickhacks.every(n => QUICKHACKS_2077_CATALOG.find(q => q.name === n)!.dv <= 10)).toBe(true);
  });

  it('No netrunner: sin DV máximo de Quickhack', () => {
    const p = portEnemyToCemk(mk());
    expect(p.maxQuickhackDv).toBeNull();
    expect(p.availableQuickhacks).toEqual([]);
  });

  it('RB p.10: SP contra melee a la mitad redondeando hacia arriba (igual que combatEngine)', () => {
    const p = portEnemyToCemk(mk({ headSp: 11, bodySp: 7 }));
    expect(p.headSpVsMelee).toBe(6);
    expect(p.bodySpVsMelee).toBe(4);
  });

  it('RB p.8: Smart Pistol es Smart, el resto Power', () => {
    const p = portEnemyToCemk(mk({
      weapons: [
        { name: 'Smart Pistol', skillBase: 10, damage: '2d6', rof: 1, mag: 10 },
        { name: 'Unity Handgun', skillBase: 10, damage: '3d6', rof: 2, mag: 12 }
      ]
    }));
    expect(p.weapons.map(w => w.weaponType2077)).toEqual(['Smart', 'Power']);
  });

  it('RB p.36: Self-ICE = N Passwalls con el DV del total (1=DV6, 2=DV8, 3=DV10); sin selfIce = ninguno', () => {
    expect(portEnemyToCemk(mk({ selfIce: 1 })).selfIcePasswalls).toEqual([{ dv: 6 }]);
    expect(portEnemyToCemk(mk({ selfIce: 2 })).selfIcePasswalls).toEqual([{ dv: 8 }, { dv: 8 }]);
    expect(portEnemyToCemk(mk({ selfIce: 3 })).selfIcePasswalls).toEqual([{ dv: 10 }, { dv: 10 }, { dv: 10 }]);
    expect(portEnemyToCemk(mk({ selfIce: 5 })).selfIcePasswalls).toHaveLength(3);
    expect(portEnemyToCemk(mk()).selfIcePasswalls).toEqual([]);
  });

  it('Fórmula de HP CEMK: discrepancia con el libro genera nota', () => {
    const p = portEnemyToCemk(mk({ hp: 40 }));
    expect(p.hpFormula).toBe(40);
    expect(p.hpMatchesFormula).toBe(true);
    const q = portEnemyToCemk(mk({ hp: 30 }));
    expect(q.hpMatchesFormula).toBe(false);
    expect(q.notes.some(n => n.includes('HP del libro (30)'))).toBe(true);
  });
});

describe('Enemigos canon v4.7.0', () => {
  const isCoreOrHardened = (e: { sourceBook: string }) => e.sourceBook === 'core' || e.sourceBook === 'dlc';

  it('Conteos por libro: Core 10, CEMK 14, Hardened 16', () => {
    expect(CORE_ENEMIES).toHaveLength(10);
    expect(CEMK_ENEMIES).toHaveLength(14);
    expect(HARDENED_ENEMIES).toHaveLength(16);
  });

  it('Todos los PNJ canon tienen sourcePage', () => {
    for (const e of [...CORE_ENEMIES, ...CEMK_ENEMIES, ...HARDENED_ENEMIES]) {
      expect(typeof e.sourcePage, e.id).toBe('number');
    }
  });

  it('ids únicos en ENEMIES_CATALOG y sin entradas interface_red', () => {
    const ids = ENEMIES_CATALOG.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ENEMIES_CATALOG.some((e) => e.sourceBook === 'interface_red')).toBe(false);
  });

  it('Boosterganger Core: BODY 2 y Death Save 2 (Errata v1.25 p. 412)', () => {
    const e = ENEMIES_CATALOG.find((x) => x.id === 'core-boosterganger');
    expect(e?.stats.BODY).toBe(2);
    expect(e?.deathSave).toBe(2);
  });

  it('Security Officer Core: SP de cabeza 12 (Errata v1.25 p. 415)', () => {
    const e = ENEMIES_CATALOG.find((x) => x.id === 'core-security-officer');
    expect(e?.headSp).toBe(12);
  });

  it('Todos los PNJ CEMK tienen format cemk', () => {
    for (const e of CEMK_ENEMIES) expect(e.format, e.id).toBe('cemk');
  });

  it('HP de Core y Hardened = 10 + 5 * ceil((BODY + WILL) / 2) (Core p. 187)', () => {
    const mismatches = ENEMIES_CATALOG.filter(isCoreOrHardened)
      .filter((e) => e.hp !== 10 + 5 * Math.ceil((e.stats.BODY + e.stats.WILL) / 2))
      .map((e) => e.id);
    expect(mismatches).toEqual([]);
  });
});

describe('Porte en UI/conversión v4.7.0', () => {
  it('convertEnemyToCharacterSheet(core-netrunner): Neuroport e Interface 4', () => {
    const e = ENEMIES_CATALOG.find((x) => x.id === 'core-netrunner');
    expect(e).toBeDefined();
    const sheet = convertEnemyToCharacterSheet(e!);
    expect(sheet.hasNeuroport).toBe(true);
    expect(sheet.roleRank).toBe(4);
  });

  it('todo el catálogo porta sin lanzar y tiene Neuroport', () => {
    for (const e of ENEMIES_CATALOG) {
      expect(() => portEnemyToCemk(e)).not.toThrow();
      expect(convertEnemyToCharacterSheet(e).hasNeuroport).toBe(true);
    }
  });

  it('armas Brawling/Martial Arts/ciberware melee con ROF del Core (pp.114-115, 176, 178)', () => {
    const find = (n: string) => ENEMIES_CATALOG.flatMap((e) => e.weapons).filter((w) => w.name === n);
    for (const n of ['Brawling', 'Martial Arts Strike', 'Rippers', 'Wolvers']) {
      const ws = find(n);
      expect(ws.length).toBeGreaterThan(0);
      ws.forEach((w) => expect(w.rof).toBe(2));
    }
    find('Cybersnake').forEach((w) => expect(w.rof).toBe(1));
  });
});

describe('Martial Arts: auditoría canon plan 14', () => {
  it('formas Core y Recovery citan Core p.179/180', () => {
    const pg = (id: string) => MARTIAL_ARTS_FORMS.find((f) => f.id === id)!;
    for (const id of ['aikido', 'karate', 'judo']) {
      expect(pg(id).sourcePage).toBe(179);
      pg(id).moves.forEach((m) => expect(m.sourcePage).toBe(179));
    }
    expect(pg('taekwondo').sourcePage).toBe(180);
    pg('taekwondo').moves.forEach((m) => expect(m.sourcePage).toBe(180));
    expect(SHARED_MARTIAL_ARTS_MOVES[0].sourcePage).toBe(179);
  });

  it('textos sin flavor inventado ni p.181', () => {
    const all = JSON.stringify(MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT);
    expect(all).not.toContain('Graf 3');
    expect(all).not.toContain('mortífera');
    expect(MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.sourceReferences).not.toContain('181');
  });

  it('keyStats incluyen los STATs de sus movimientos (decisión 45)', () => {
    expect(MARTIAL_ARTS_FORMS.find((f) => f.id === 'karate')!.keyStats).toContain('WILL');
    expect(MARTIAL_ARTS_FORMS.find((f) => f.id === 'taekwondo')!.keyStats).toContain('MOVE');
  });
});

describe('Daño de Martial Arts separado de Brawling (Core p.178; decisión 46)', () => {
  it('BODY 4/5/7/11 da 1d6/2d6/3d6/4d6 y no tiene mínimo por Cyberarm (Core p.178)', () => {
    expect(calculateMartialArtsDamage(4)).toBe('1d6');
    expect(calculateMartialArtsDamage(5)).toBe('2d6');
    expect(calculateMartialArtsDamage(7)).toBe('3d6');
    expect(calculateMartialArtsDamage(11)).toBe('4d6');
    expect(calculateUnarmedDamage(4, true)).toBe('2d6');
  });
});
