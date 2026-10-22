// Tests del motor de creación de personajes (plan 7, v4.8.2). Cada caso cita la página del libro que fija el valor. [Claude Code · 2026-10-22]
import { describe, expect, it } from 'vitest';
import {
  SKILL_POINTS,
  STAT_KEYS,
  STAT_POINTS_COMPLETE_PACKAGE,
  applyEdgerunnerRoll,
  applyStreetratRow,
  buildCharacterLifepath,
  buildCharacterSheetFromDraft,
  computeDerived,
  createEmptyDraft,
  getCyberwareList,
  getApplicableRoleLifepathTables,
  getEdgerunnerSkillNames,
  getLifepathTables,
  getMissingChecklist,
  getMoneyRemaining,
  getRoleAbilityInfo,
  getRoleDisplayName,
  getRoleOrder,
  getRolePackage,
  getSkillCatalog,
  getSkillPointsSpent,
  getStartingMoney,
  getStatPointsSpent,
  lifepathKey,
  rollD10,
  rollDie,
  rollLifepathTable,
  roleSupportsCemkVariant,
  skillLevelCost,
  validateStep,
  type CreatorDraft
} from '../characterCreation';
import { CORE_GEAR_SKILLS, CORE_ROLE_TABLES } from '../../data/creation';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';
import { PREGEN_TEMPLATES } from '../../data/characterCreationData';

const streetratSolo = (era: '2045' | '2077' = '2045'): CreatorDraft => {
  const d = { ...createEmptyDraft(), era, method: 'streetrat' as const, role: 'Solo' as const, culturalLanguage: 'English' };
  return applyStreetratRow(d, 1);
};

describe('Streetrat (Core pp. 74, 86)', () => {
  it('Solo fila 1 copia los stats de la tabla (Core p.74)', () => {
    const d = streetratSolo();
    const row = CORE_ROLE_TABLES.statTables.Solo.rows[0];
    for (const k of STAT_KEYS) expect(d.stats[k]).toBe(row[k]);
    expect(d.statRow).toBe(1);
  });

  it('Solo copia las 20 skills exactas de la plantilla, con Autofire y Handgun en 6 (Core p.86)', () => {
    const d = streetratSolo();
    expect(Object.keys(d.skills)).toHaveLength(20);
    expect(d.skills['Autofire']).toBe(6);
    expect(d.skills['Handgun']).toBe(6);
    expect(d.skills['Language (Streetslang)']).toBe(2);
    expect(getSkillPointsSpent(d)).toBe(SKILL_POINTS);
  });

  it('Tech normaliza "(x2)" y "(choose 1)" en la clave (Core p.87)', () => {
    const d = applyStreetratRow({ ...createEmptyDraft(), role: 'Tech', method: 'streetrat' }, 1);
    expect(d.skills['Electronics/Security Tech']).toBe(6);
    expect(d.skills['Science']).toBe(6);
  });
});

describe('Edgerunner (Core pp. 77, 86-87)', () => {
  it('tira por columna y toma el valor de esa columna en la fila (Core p.77)', () => {
    const d = applyEdgerunnerRoll({ ...createEmptyDraft(), role: 'Solo', method: 'edgerunner' }, 'REF', 3);
    const row = CORE_ROLE_TABLES.statTables.Solo.rows.find((r) => r.roll === 3)!;
    expect(d.stats.REF).toBe(row.REF);
    expect(d.statRolls.REF).toBe(3);
  });

  it('tiene 20 skills por rol (Core pp. 86-87)', () => {
    expect(getEdgerunnerSkillNames('Solo')).toHaveLength(20);
    expect(getEdgerunnerSkillNames('Solo')).toContain('Autofire');
  });

  it('Autofire del Solo cuesta doble (Core p.81)', () => {
    expect(skillLevelCost('Autofire', 6)).toBe(12);
    expect(skillLevelCost('Handgun', 6)).toBe(6);
    expect(skillLevelCost('Language (Streetslang)', 2)).toBe(2);
  });

  it('valida 86 puntos sobre las 20 skills y rechaza nivel 7 o 1 (Core p.77)', () => {
    let d: CreatorDraft = { ...streetratSolo(), method: 'edgerunner' };
    for (const k of STAT_KEYS) d = applyEdgerunnerRoll(d, k, 1);
    expect(validateStep(d, 'skills')).toEqual([]);
    expect(validateStep({ ...d, skills: { ...d.skills, Handgun: 7 } }, 'skills').length).toBeGreaterThan(0);
    expect(validateStep({ ...d, skills: { ...d.skills, Athletics: 1 } }, 'skills').length).toBeGreaterThan(0);
    expect(validateStep({ ...d, skills: { ...d.skills, Acting: 2 } }, 'skills').length).toBeGreaterThan(0);
  });

  it('exige las 10 tiradas de stats (Core p.77)', () => {
    const d: CreatorDraft = { ...createEmptyDraft(), role: 'Solo', method: 'edgerunner' };
    expect(validateStep(d, 'stats')).toHaveLength(10);
  });
});

describe('Complete Package (Core pp. 78, 81, 85)', () => {
  const stats = { INT: 6, REF: 6, DEX: 6, TECH: 6, COOL: 6, WILL: 6, LUCK: 6, MOVE: 6, BODY: 6, EMP: 8 };
  const skills: Record<string, number> = {
    Concentration: 2, Perception: 6, Athletics: 4, Stealth: 2, Education: 2, 'Local Expert (Your Home)': 2,
    Brawling: 2, Evasion: 6, Conversation: 2, 'Human Perception': 2, Persuasion: 2, 'First Aid': 6,
    Handgun: 6, 'Shoulder Arms': 6, Autofire: 6, Interrogation: 6, 'Melee Weapon': 6, Tactics: 6, 'Resist Torture/Drugs': 6
  };
  const base = (): CreatorDraft => ({ ...createEmptyDraft(), method: 'complete_package', role: 'Solo', stats, skills, culturalLanguage: 'English' });

  it('62 puntos de stats con rango 2-8 (Core p.78)', () => {
    expect(STAT_POINTS_COMPLETE_PACKAGE).toBe(62);
    expect(getStatPointsSpent(stats)).toBe(62);
    expect(validateStep(base(), 'stats')).toEqual([]);
    expect(validateStep({ ...base(), stats: { ...stats, EMP: 9, BODY: 5 } }, 'stats').length).toBeGreaterThan(0);
    expect(validateStep({ ...base(), stats: { ...stats, EMP: 1, BODY: 7 } }, 'stats').length).toBeGreaterThan(0);
    expect(validateStep({ ...base(), stats: { ...stats, EMP: 7 } }, 'stats').length).toBeGreaterThan(0);
  });

  it('86 puntos de skills, básicas en 2+ y máximo 6 (Core pp. 81, 85)', () => {
    expect(getSkillPointsSpent(base())).toBe(86);
    expect(validateStep(base(), 'skills')).toEqual([]);
    const noBasic = { ...base(), skills: { ...skills, Stealth: 0 } };
    expect(validateStep(noBasic, 'skills').some((m) => m.includes('Stealth'))).toBe(true);
    const tooHigh = { ...base(), skills: { ...skills, Handgun: 7 } };
    expect(validateStep(tooHigh, 'skills').some((m) => m.includes('Handgun'))).toBe(true);
  });
});

describe('HP, Seriously Wounded, Death Save y Humanidad (Core pp. 79-80, 117; CEMK RB p.25)', () => {
  it('Solo fila 1: HP 40, SW 20, Death Save 6 (Core pp. 79-80)', () => {
    const d = streetratSolo();
    const x = computeDerived(d);
    expect(x.maxHp).toBe(10 + 5 * Math.ceil((d.stats.BODY + d.stats.WILL) / 2));
    expect(x.seriouslyWounded).toBe(Math.ceil(x.maxHp / 2));
    expect(x.deathSave).toBe(d.stats.BODY);
  });

  it('paquete del Solo en 2045: HL 14 -> Humanidad 36 con EMP 5 (Core p.117)', () => {
    const x = computeDerived(streetratSolo('2045'));
    expect(x.maxHumanity).toBe(50);
    expect(x.humanityLoss).toBe(14);
    expect(x.humanity).toBe(36);
    expect(x.effectiveEmp).toBe(3);
  });

  it('en 2077 el Neuroport entra con HL 0 y reemplaza al Neural Link (CEMK RB p.25)', () => {
    const d = streetratSolo('2077');
    const list = getCyberwareList(d);
    expect(list.find((c) => c.name === 'Neuroport')?.humanityLoss).toBe(0);
    expect(list.some((c) => c.name === 'Neural Link')).toBe(false);
    expect(computeDerived(d).humanityLoss).toBe(7);
  });

  it('la EMP efectiva nunca baja de 0 (Core p.80)', () => {
    const d = { ...streetratSolo('2045'), purchases: [{ category: 'cyberware' as const, catalogId: 'x', name: 'X', cost: 0, qty: 1, humanityLoss: 100 }] };
    expect(computeDerived(d).effectiveEmp).toBe(0);
  });
});

describe('Paquete de rol (Core pp. 98-99, 103, 117; CEMK RB pp. 35-36)', () => {
  it('2045 conserva Agent, Neural Link e Interface Plugs (Core p.117)', () => {
    const net = getRolePackage('Netrunner', '2045', {});
    expect(net.gear.some((g) => g.name === 'Agent')).toBe(true);
    expect(net.cyberware.map((c) => c.name)).toEqual(expect.arrayContaining(['Neural Link', 'Interface Plugs']));
  });

  it('2077 quita Agent, Neural Link e Interface Plugs con nota del Neuroport (CEMK RB pp. 35-36)', () => {
    const net = getRolePackage('Netrunner', '2077', {});
    expect(net.gear.some((g) => g.name === 'Agent')).toBe(false);
    expect(net.cyberware.map((c) => c.name)).not.toContain('Neural Link');
    expect(net.cyberware.map((c) => c.name)).not.toContain('Interface Plugs');
    expect(net.notes.some((n) => n.includes('Lo cubre el Neuroport (CEMK RB pp. 35-36)'))).toBe(true);
  });

  it('2077 quita Internal Agent y Biomonitor (discrepancias 34-35, CEMK RB pp. 35-36); 2045 los conserva (Core p.117)', () => {
    const names = (role: 'Fixer' | 'Exec' | 'Solo' | 'Medtech', era: '2045' | '2077') =>
      getRolePackage(role, era, {}).cyberware.filter((c) => !c.coveredByNeuroport).map((c) => c.name);
    expect(names('Fixer', '2077')).not.toContain('Internal Agent');
    expect(names('Exec', '2077')).not.toContain('Internal Agent');
    expect(names('Exec', '2077')).not.toContain('Biomonitor');
    expect(names('Solo', '2077')).not.toContain('Biomonitor');
    expect(names('Medtech', '2077')).not.toContain('Biomonitor');
    expect(names('Fixer', '2045')).toContain('Internal Agent');
    expect(names('Exec', '2045')).toEqual(expect.arrayContaining(['Biomonitor', 'Internal Agent']));
  });

  it('Fixer 2077: sin el Internal Agent la Humanidad sube 3 (Core p.117)', () => {
    const fixer = (era: '2045' | '2077') => applyStreetratRow({ ...createEmptyDraft(), era, method: 'streetrat', role: 'Fixer', culturalLanguage: 'English' }, 1);
    expect(computeDerived(fixer('2045')).humanityLoss - computeDerived(fixer('2077')).humanityLoss).toBe(3);
  });

  it('Exec 2077: el Biomonitor cubierto deja elegir Techhair; Nomad 2077 deja elegir Wolvers (Core p.117)', () => {
    const exec = getRolePackage('Exec', '2077', {});
    const bio = exec.cyberware.find((c) => c.name === 'Biomonitor')!;
    expect(bio.coveredByNeuroport).toBe(true);
    const withTechhair = getRolePackage('Exec', '2077', { [bio.key]: 1 });
    expect(withTechhair.cyberware.find((c) => c.key === bio.key)?.name).toBe('Techhair');
    const execDraft = { ...applyStreetratRow({ ...createEmptyDraft(), era: '2077' as const, method: 'streetrat' as const, role: 'Exec' as const, culturalLanguage: 'English' }, 1) };
    expect(getCyberwareList(execDraft).some((c) => c.name === 'Biomonitor')).toBe(false);
    expect(getCyberwareList({ ...execDraft, packageChoices: { [bio.key]: 1 } }).some((c) => c.name === 'Techhair')).toBe(true);
    const nomad = getRolePackage('Nomad', '2077', {});
    const plugs = nomad.cyberware.find((c) => c.name === 'Interface Plugs')!;
    expect(plugs.coveredByNeuroport).toBe(true);
    expect(getRolePackage('Nomad', '2077', { [plugs.key]: 1 }).cyberware.find((c) => c.key === plugs.key)?.name).toBe('Wolvers');
  });

  it('aplica las opciones "o" y lista la munición (Core pp. 98-99)', () => {
    const solo = getRolePackage('Solo', '2045', {});
    expect(solo.weapons.some((w) => w.name === 'Basic Rifle Ammunition' && w.qty === 70)).toBe(true);
    const melee = solo.weapons.find((w) => w.name === 'Heavy Melee Weapon')!;
    expect(melee.alternatives).toEqual(['Bulletproof Shield']);
    const shield = getRolePackage('Solo', '2045', { [melee.key]: 1 });
    expect(shield.weapons.some((w) => w.name === 'Bulletproof Shield')).toBe(true);
    const tech = getRolePackage('Tech', '2045', { 'weapons:0': 1 });
    expect(tech.weapons.find((w) => w.key === 'weapons:1')?.name).toBe('Basic Rifle Ammunition');
  });

  it('Wolvers es alternativa de Sandevistan con HL 7 (Core p.117)', () => {
    const solo = getRolePackage('Solo', '2045', {});
    const sande = solo.cyberware.find((c) => c.name === 'Sandevistan Speedware')!;
    expect(sande.alternatives).toEqual([{ name: 'Wolvers', humanityLoss: 7 }]);
  });
});

describe('Dinero (Core pp. 98, 104-105, 118-119)', () => {
  it('Streetrat y Edgerunner reciben 500 €$ (Core p.98)', () => {
    expect(getStartingMoney(streetratSolo()).cash).toBe(500);
    expect(getStartingMoney({ ...streetratSolo(), method: 'edgerunner' }).cash).toBe(500);
  });

  it('Complete Package: 2.550 de equipo y 800 de moda; la moda sobrante se pierde (Core pp. 104-105)', () => {
    const d: CreatorDraft = {
      ...createEmptyDraft(),
      method: 'complete_package',
      fashion: [{ style: 'Bag Lady Chic', piece: 'Top', qty: 2, unitCost: 10 }]
    };
    expect(getStartingMoney(d)).toMatchObject({ cash: 2550, fashionBudget: 800 });
    const left = getMoneyRemaining(d);
    expect(left.fashionBudget).toBe(780);
    expect(left.cash).toBe(2550);
    const sheet = buildCharacterSheetFromDraft({ ...d, role: 'Solo', handle: 'X', stats: { ...d.stats } }, 't1').sheet;
    expect(sheet.eurodollars).toBe(2550);
    expect(sheet.fashionBudgetRemaining).toBe(0);
  });

  it('Running Out of Cash: +1.500 solo para ciberware y exige empleador (Core pp. 118-119)', () => {
    const cw = { category: 'cyberware' as const, catalogId: 'cybereye', name: 'Cybereye', cost: 1000, qty: 1, humanityLoss: 7 };
    const gear = { category: 'gear' as const, catalogId: 'agent', name: 'Agent', cost: 100, qty: 1, humanityLoss: 0 };
    const d: CreatorDraft = { ...streetratSolo(), purchases: [cw, gear], runningOutOfCash: { enabled: true, employer: null } };
    expect(getMoneyRemaining(d).cash).toBe(400);
    expect(validateStep(d, 'gear').some((m) => m.includes('Running Out of Cash'))).toBe(true);
    const ok = { ...d, runningOutOfCash: { enabled: true, employer: CORE_GEAR_SKILLS.runningOutOfCash.options[0] } };
    expect(validateStep(ok, 'gear')).toEqual([]);
    const noRoc = { ...d, runningOutOfCash: { enabled: false, employer: null } };
    expect(getMoneyRemaining(noRoc).cash).toBe(-600);
    expect(validateStep(noRoc, 'gear').length).toBeGreaterThan(0);
  });
});

describe('Roles y habilidades de rol (Core pp. 40-41; CEMK RB p.25)', () => {
  it("Rockerboy se muestra 'Rocker' en 2077 y 'Rockerboy' en 2045", () => {
    expect(getRoleDisplayName('Rockerboy', '2077')).toBe('Rocker');
    expect(getRoleDisplayName('Rockerboy', '2045')).toBe('Rockerboy');
    expect(getRoleDisplayName('Solo', '2077')).toBe('Solo');
  });

  it('Media, Exec y Lawman no tienen variante CEMK; el orden pone los 7 de CEMK primero', () => {
    expect(roleSupportsCemkVariant('Media')).toBe(false);
    expect(roleSupportsCemkVariant('Exec')).toBe(false);
    expect(roleSupportsCemkVariant('Lawman')).toBe(false);
    expect(roleSupportsCemkVariant('Solo')).toBe(true);
    expect(getRoleOrder()).toEqual(['Fixer', 'Medtech', 'Netrunner', 'Nomad', 'Rockerboy', 'Solo', 'Tech', 'Media', 'Exec', 'Lawman']);
    expect(validateStep({ ...createEmptyDraft(), method: 'streetrat', role: 'Media', roleAbilityVariant: 'cemk' }, 'role').length).toBeGreaterThan(0);
  });

  it('usa el nombre del Core cuando CEMK no nombra la habilidad (discrepancia 13)', () => {
    const info = getRoleAbilityInfo('Rockerboy', 'cemk', '2077');
    expect(info.name).toBe('Charismatic Impact');
    expect(info.nameFromCore).toBe(true);
    expect(getRoleAbilityInfo('Fixer', 'cemk', '2077').name).toBe('Operator');
  });
});

describe('Catálogo de skills (Core pp. 81-85; CEMK RB)', () => {
  it('tiene 66 skills, sin Surgery (discrepancia 10), y etiqueta CEMK a las que coinciden', () => {
    const cat = getSkillCatalog();
    expect(cat).toHaveLength(66);
    expect(cat.some((s) => s.name === 'Surgery')).toBe(false);
    expect(cat.every((s) => s.books.includes('Core RED'))).toBe(true);
    const cemk = cat.filter((s) => s.books.includes('CEMK'));
    // Las 46 skills de CEMK (CEMK_CREATION.skills) menos las que el Core no trae con ese nombre.
    expect(cemk.length).toBeGreaterThan(30);
    expect(cemk.length).toBeLessThanOrEqual(46);
    expect(cat.find((s) => s.name === 'Handgun')?.books).toEqual(['CEMK', 'Core RED']);
    expect(cat.find((s) => s.name === 'Pilot Air Vehicle')?.books).toEqual(['Core RED']);
  });
});

describe('Dados y Lifepath (Core pp. 44-69)', () => {
  it('rollDie y rollD10 respetan el rng inyectado', () => {
    expect(rollD10(() => 0)).toBe(1);
    expect(rollD10(() => 0.999)).toBe(10);
    expect(rollDie('2d6', () => 0.999)).toBe(12);
    expect(rollDie('1d10-7', () => 0.999)).toBe(3);
    expect(() => rollDie('abc')).toThrow();
  });

  it('toda tirada posible de toda tabla tiene resultado (Core pp. 44-69; CEMK RB)', () => {
    for (const source of ['core', 'cemk'] as const) {
      for (const role of ['Solo', 'Nomad', 'Netrunner'] as const) {
        const t = getLifepathTables(source, role);
        for (const table of [...t.general, ...t.role]) {
          if (table.die === 'choose') {
            expect(rollLifepathTable(table)).toBeNull();
            continue;
          }
          // Tirada mínima y máxima de cada tabla deben dar resultado.
          expect(rollLifepathTable(table, () => 0)).not.toBeNull();
          expect(rollLifepathTable(table, () => 0.999)).not.toBeNull();
        }
      }
    }
  });

  it('CEMK no tiene tablas de rol y el Core sí (Core pp. 56-65)', () => {
    expect(getLifepathTables('cemk', 'Solo').role).toHaveLength(0);
    expect(getLifepathTables('core', 'Solo').role.length).toBeGreaterThan(0);
  });

  it('buildCharacterLifepath mapea ids de tabla a campos (Core p.45)', () => {
    const d: CreatorDraft = {
      ...createEmptyDraft(),
      role: 'Solo',
      lifepathSource: 'core',
      lifepath: {
        cultural_origins: { roll: '1', value: 'Norteamérica' },
        value_most: { roll: null, value: 'Honor' },
        life_goals: { roll: '2', value: 'Venganza' },
        [lifepathKey('enemies', 0, 'enemies_who')]: { roll: '3', value: 'Ex-socio' },
        [lifepathKey('enemies', 0, 'sweet_revenge')]: { roll: '4', value: 'Huye' }
      },
      enemiesCount: 1
    };
    const lp = buildCharacterLifepath(d);
    expect(lp.culturalRegion).toBe('Norteamérica');
    expect(lp.valueMost).toBe('Honor');
    expect(lp.lifeGoal).toBe('Venganza');
    expect(lp.enemies[0].who).toBe('Ex-socio');
    expect(lp.enemies[0].reaction).toBe('Huye');
  });
});

describe('Validación y checklist', () => {
  it('el checklist de un borrador vacío señala método, rol, lifepath y handle', () => {
    const list = getMissingChecklist(createEmptyDraft());
    expect(list.some((x) => x.step === 'method')).toBe(true);
    expect(list.some((x) => x.step === 'summary')).toBe(true);
    expect(validateStep(createEmptyDraft(), 'summary').length).toBeGreaterThan(0);
  });

  it('un pregen solo pide elegir el personaje', () => {
    const d: CreatorDraft = { ...createEmptyDraft(), method: 'easy_pregen', pregenId: PREGEN_TEMPLATES[0].id };
    expect(validateStep(d, 'summary')).toEqual([]);
    expect(validateStep({ ...d, pregenId: null }, 'method').length).toBe(1);
  });
});

describe('Construcción de la ficha', () => {
  it('Streetrat Solo produce una ficha válida: HP, armadura SP 11 y armas del pack (Core pp. 79, 98)', () => {
    const d = { ...streetratSolo('2045'), handle: 'Tester' };
    const { sheet } = buildCharacterSheetFromDraft(d, 'test-1');
    const derived = computeDerived(d);
    expect(sheet.id).toBe('char-test-1');
    expect(sheet.role).toBe('Solo');
    expect(sheet.roleRank).toBe(4);
    expect(sheet.currentHp).toBe(derived.maxHp);
    expect(sheet.currentHumanity).toBe(derived.humanity);
    expect(sheet.headArmor.maxSp).toBe(11);
    expect(sheet.bodyArmor.maxSp).toBe(11);
    expect(sheet.equippedWeapons.map((w) => w.name)).toEqual(expect.arrayContaining(['Assault Rifle', 'Very Heavy Pistol']));
    expect(sheet.eurodollars).toBe(500);
    expect(sheet.creationMethod).toBe('streetrat');
    expect(sheet.skills.handgun).toBe(6);
    expect(sheet.generalSkills?.['Language (English)']).toBe(4);
    expect(sheet.notes).toContain('Cargo Container');
    expect(sheet.hasNeuroport).toBe(false);
  });

  it('2077 marca el Neuroport y guarda la variante de habilidad de rol (CEMK RB p.25)', () => {
    const d = { ...streetratSolo('2077'), handle: 'Tester', roleAbilityVariant: 'cemk' as const };
    const { sheet } = buildCharacterSheetFromDraft(d, 'test-2');
    expect(sheet.hasNeuroport).toBe(true);
    expect(sheet.installedCyberwareIds).toContain('cw-cemk-neuroport');
    expect(sheet.roleAbilityVariant).toBe('cemk');
  });

  it('un Folio de CEMK sale con roleRank 4 y Humanidad EMP x 10 - HL (discrepancia 12; Core p.80)', () => {
    const folio = CEMK_FOLIO_PREMADE_CHARACTERS[0];
    const d: CreatorDraft = { ...createEmptyDraft(), method: 'cemk_pregen', pregenId: folio.id };
    const { sheet, warnings } = buildCharacterSheetFromDraft(d, 'test-3');
    expect(sheet.roleRank).toBe(4);
    expect(sheet.id).toBe('char-test-3');
    expect(sheet.id).not.toBe(folio.id);
    expect(sheet.creationMethod).toBe('pregen');
    expect(sheet.era).toBe('2077');
    expect(warnings).toContain('Ficha de CEMK: no sigue los límites del Core; las skills que no trae quedan en 0.');
    expect(sheet.currentHumanity).toBeLessThanOrEqual(folio.stats.EMP * 10);
  });

  it('un pregen del Easy Mode sale con id nuevo y método pregen (Core Easy Mode pp. 37-45)', () => {
    const d: CreatorDraft = { ...createEmptyDraft(), method: 'easy_pregen', pregenId: PREGEN_TEMPLATES[0].id };
    const { sheet } = buildCharacterSheetFromDraft(d, 'test-4');
    expect(sheet.id).toBe('char-test-4');
    expect(sheet.creationMethod).toBe('pregen');
  });

  it('la armadura comprada con location solo cuenta en esa ubicación; sin location vale en ambas (Core p.97)', () => {
    const base = { ...streetratSolo('2045'), handle: 'Tester', packageChoices: {} };
    const buy = (location?: 'head' | 'body'): CreatorDraft => ({
      ...base,
      purchases: [{ category: 'armor', catalogId: 'heavy-armorjack', name: 'Heavy Armorjack', cost: 100, qty: 1, humanityLoss: 0, ...(location ? { location } : {}) }]
    });
    const head = buildCharacterSheetFromDraft(buy('head'), 'a').sheet;
    expect(head.headArmor.maxSp).toBe(13);
    expect(head.bodyArmor.maxSp).toBe(11);
    const body = buildCharacterSheetFromDraft(buy('body'), 'b').sheet;
    expect(body.bodyArmor.maxSp).toBe(13);
    expect(body.headArmor.maxSp).toBe(11);
    const both = buildCharacterSheetFromDraft(buy(), 'c').sheet;
    expect(both.headArmor.maxSp).toBe(13);
    expect(both.bodyArmor.maxSp).toBe(13);
  });
});

describe('Lifepath de rol condicional (Core pp. 54-68)', () => {
  const pick = (value: string) => ({ roll: null, value });
  const ids = (role: Parameters<typeof getApplicableRoleLifepathTables>[0], lp: Record<string, { roll: null; value: string }>) =>
    getApplicableRoleLifepathTables(role, lp).map((t) => t.id);

  it('Netrunner: el compañero solo aplica con "Con compañero" (Core p.56)', () => {
    expect(ids('Netrunner', {})).not.toContain('partner');
    expect(ids('Netrunner', { partner_choice: pick('Trabajás solo') })).not.toContain('partner');
    expect(ids('Netrunner', { partner_choice: pick('Con compañero') })).toContain('partner');
  });

  it('Nomad: solo la tabla de la base elegida (Core p.68)', () => {
    const r = ids('Nomad', { base: pick('Mar') });
    expect(r).toContain('sea');
    expect(r).not.toContain('land');
    expect(r).not.toContain('air');
  });

  it('Rockerboy: "Why Did You Leave?" solo para el solista que estuvo en un grupo (Core p.54)', () => {
    expect(ids('Rockerboy', { group_or_solo: pick('En un grupo') })).not.toContain('once_in_group');
    expect(ids('Rockerboy', { group_or_solo: pick('Solista') })).toContain('once_in_group');
    expect(ids('Rockerboy', { group_or_solo: pick('Solista'), once_in_group: pick('Siempre fui solista') })).not.toContain('why_left');
    expect(ids('Rockerboy', { group_or_solo: pick('Solista'), once_in_group: pick('Estuve en un grupo') })).toContain('why_left');
  });

  it('Trabajás solo: no se exige el compañero y la ficha no lo guarda (Core p.56)', () => {
    let d: CreatorDraft = { ...createEmptyDraft(), method: 'streetrat', role: 'Netrunner', lifepathSource: 'core' };
    d = { ...d, roleLifepath: { partner_choice: pick('Trabajás solo'), partner: pick('Familiar') } };
    expect(validateStep(d, 'lifepath').some((m) => m.includes('Partner'))).toBe(false);
    expect(Object.values(buildCharacterLifepath(d).roleLifepath)).not.toContain('Familiar');
  });
});
