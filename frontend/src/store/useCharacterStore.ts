import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ActiveCriticalInjury,
  ActiveDrugEffect,
  ActiveFbcState,
  AppThemeId,
  ArmorItem,
  CharacterDebt,
  CharacterLifepath,
  CharacterSheet,
  CombatSkillKey,
  EquippedWeapon,
  EurodollarTransaction,
  InventoryItem,
  IpLogKind,
  MedtechCryoAndPharma,
  OwnedVehicle,
  RockerboyFanGroup,
  SoloCombatAwarenessAllocation,
  StatKey,
  TechMakerProject,
  TechWeaponUpgradeType,
  WeaponItem
} from '../types/cyberpunk';
import { calculateMaxHp, calculateTherapyMaxHumanity, getEffectiveBody, naturalHealingPerDay, parseHumanityLossAverage, rollDeathSave as rollDeathSaveEngine } from '../engine/characterEngine';
import type { DeathSaveResult } from '../engine/characterEngine';
import { rollCriticalInjury, HEAD_CRITICAL_INJURIES, BODY_CRITICAL_INJURIES } from '../data/criticalInjuries';
import { rollCemkCriticalInjury, findCemkCriticalInjury } from '../engine/medicalRules';
import type { CritTable } from '../engine/medicalRules';
import type { ImpactEffects } from '../engine/combatEngine';
import { useRulesSettingsStore } from './rulesSettingsStore';
import {
  PREGEN_TEMPLATES,
  buildCharacterSheetFromPregen as instantiatePregenCharacter
} from '../data/characterCreationData';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../data/cemkFolioPremadesData';
import { SKILL_METADATA } from '../types/cyberpunk';
import { checkRoleRankRaise, checkSkillRaise } from '../engine/roleRules';
import type { MakerAllocation, MedicineAllocation } from '../engine/roleRules';
import { canInstallAnother } from '../engine/cyberwareEffects';
import { REPLACEMENT_FEE_EB, endOfSession, replacementMember } from '../engine/socialRoleRules';
import type { ExecTeamMember } from '../engine/socialRoleRules';
import coreRulesPack from '../data/core-rules.cprpack.json';
import {
  WEAPON_ATTACHMENTS_CATALOG,
  calculateModifiedMagazineSize
} from '../data/weaponAttachmentsAndTechData';

import { FBC_16_CYBERWARE, FBC_IMMUNE_CRITICAL_INJURIES } from '../data/goingMetalFbcData';
import {
  APP_VERSION,
  CHARACTERS_SCHEMA_VERSION,
  CHARACTERS_STORAGE_KEY,
  backupRawBeforeMigration,
  archiveIpLogEntries,
  buildFullBackup,
  emitPersistenceWarning,
  injectPremades,
  parseFullBackup,
  runMigrations,
  safeCharacterStorage
} from './persistence';
import { capIpLog } from '../engine/ipLedger';

// v4.9.1 [Claude Code · 2026-10-22] Aplica un movimiento de IP a la ficha y lo registra en ipLog.
function appendIpLog(c: CharacterSheet, kind: IpLogKind, delta: number, reason: string): CharacterSheet {
  const balanceAfter = Math.max(0, (c.improvementPoints ?? 0) + delta);
  const newIpLog = [
    ...(c.ipLog ?? []),
    {
      id: `ip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toISOString(),
      kind,
      delta,
      reason,
      balanceAfter
    }
  ];
  // v4.9.7 [Claude Code · 2026-10-24]: freno de 2.000; lo más viejo pasa a la copia de seguridad.
  const capped = capIpLog(newIpLog, c.ipLogArchivedTotals);
  if (capped.archived.length > 0) {
    archiveIpLogEntries(c.id, c.handle, capped.archived);
    return {
      ...c,
      improvementPoints: balanceAfter,
      ipLog: capped.log,
      ipLogArchivedTotals: capped.archivedTotals
    };
  }
  return {
    ...c,
    improvementPoints: balanceAfter,
    ipLog: newIpLog
  };
}

const PACK_CYBERWARE_BY_ID = new Map(
  [
    ...(coreRulesPack.cyberware as { id: string; humanityLoss?: string; type?: string }[]),
    ...FBC_16_CYBERWARE
  ].map((cw) => [cw.id, cw] as const)
);

// Core p. 230: la Humanidad que se recupera no puede pasar el máximo de terapia (-2 por ciberware, -4 por borgware).
function gainHumanityCapped(c: CharacterSheet, delta: number, installedIds = c.installedCyberwareIds): number {
  const current = c.currentHumanity;
  if (delta <= 0) return Math.max(0, current + delta);
  const cap = calculateTherapyMaxHumanity(
    c.stats.EMP,
    installedIds.map((id) => PACK_CYBERWARE_BY_ID.get(id) ?? {})
  );
  return Math.max(current, Math.min(cap, current + delta));
}

// v4.9.4 Quita UNA copia (la última ocurrencia) de un id de ciberware.
function removeLastCopy(ids: readonly string[], id: string): string[] {
  const idx = ids.lastIndexOf(id);
  if (idx < 0) return [...ids];
  return [...ids.slice(0, idx), ...ids.slice(idx + 1)];
}

function mapInjuryIcon(icon: string): ActiveCriticalInjury['iconType'] {
  if (icon === 'heart' || icon === 'throat') return 'organ';
  if (icon === 'muscle') return 'limb';
  if (['skull', 'brain', 'eye', 'bone', 'limb', 'organ', 'ear'].includes(icon)) {
    return icon as ActiveCriticalInjury['iconType'];
  }
  return 'skull';
}

// v4.9.2 [Claude Code · 2026-10-22] Construcción de heridas críticas desde la tabla CEMK (RB p.13).
type CemkRolled = ReturnType<typeof rollCemkCriticalInjury>;

function cemkOptionsText(opts: { skill: string; dv: number }[]): string {
  return opts.length === 0 ? 'N/A' : opts.map(o => `${o.skill} DV ${o.dv}`).join(' o ');
}

function buildCemkInjury(location: 'head' | 'body', r: CemkRolled): ActiveCriticalInjury {
  const coreTable = location === 'head' ? HEAD_CRITICAL_INJURIES : BODY_CRITICAL_INJURIES;
  const coreMatch = coreTable.find(i => i.name === r.name) ?? coreTable[0];
  const sameName = coreTable.find(i => i.name === r.name);
  const baseMods = sameName ? { ...sameName.modifiers } : {};
  // deathSavePenalty de la entrada CEMK reemplaza el bonus base (se aplica como bonusDeathSavePenalty).
  const modifiers = { ...baseMods, bonusDeathSavePenalty: r.deathSavePenalty };
  if (!r.deathSavePenalty) delete (modifiers as { bonusDeathSavePenalty?: number }).bonusDeathSavePenalty;
  return {
    id: `injury-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: r.name,
    location,
    effect: r.effectEs,
    quickFixDv: cemkOptionsText(r.quickFix),
    treatmentDv: r.quickFixRemovesPermanently ? 'El Quick Fix la quita para siempre' : cemkOptionsText(r.treatment),
    iconType: mapInjuryIcon(coreMatch.iconType),
    modifiers,
    isTreated: false,
    table: 'cemk'
  };
}

function findCemkInjuryByName(location: 'head' | 'body', name: string): ActiveCriticalInjury | null {
  const entry = findCemkCriticalInjury(location, name);
  return entry ? buildCemkInjury(location, entry) : null;
}

function buildCoreInjury(rolled: ReturnType<typeof rollCriticalInjury>): ActiveCriticalInjury {
  return {
    id: `injury-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: rolled.name,
    location: rolled.location,
    effect: rolled.effect,
    quickFixDv: rolled.quickFix,
    treatmentDv: rolled.treatment,
    iconType: mapInjuryIcon(rolled.iconType),
    modifiers: rolled.modifiers,
    isTreated: false,
    table: 'core'
  };
}

// [Claude Code · 2026-10-22] Se quitó el personaje demo "V" (videojuego, no está en los libros; v4.8.2).
// Si no queda ninguna ficha, se usa una copia del Folio de Hardpoint (CEMK).
const FALLBACK_CHARACTER: CharacterSheet = CEMK_FOLIO_PREMADE_CHARACTERS[0];

export const INITIAL_CHARACTER_KIWI: CharacterSheet = {
  id: 'char-kiwi-netrunner',
  handle: 'KIWI',
  role: 'Netrunner',
  roleRank: 4,
  notes: 'Netrunner veterana de Night City, fría y metódica. Especialista en infiltración y guerra cibernética.',
  stats: {
    INT: 8,
    REF: 6,
    DEX: 6,
    TECH: 7,
    COOL: 6,
    WILL: 7,
    LUCK: 6,
    MOVE: 6,
    BODY: 5,
    EMP: 5
  },
  currentHp: 40, // calculateMaxHp(5, 7) = 10 + 5 * Math.ceil(12/2) = 40
  currentLuck: 6,
  currentHumanity: 45,
  headArmor: {
    name: 'Kevlar (Head)',
    maxSp: 7,
    currentSp: 7,
    penalty: 0
  },
  bodyArmor: {
    name: 'Light Armorjack (Body)',
    maxSp: 11,
    currentSp: 11,
    penalty: 0
  },
  skills: {
    handgun: 5,
    shoulderArms: 2,
    autofire: 3,
    heavyWeapons: 0,
    archery: 0,
    meleeWeapon: 2,
    brawling: 2,
    martialArts: 0,
    evasion: 5,
    athletics: 3,
    firstAid: 4,
    paramedic: 2,
    cybertech: 6,
    perception: 6,
    concentration: 6,
    resistTortureDrugs: 3
  },
  equippedWeapons: [
    {
      id: 'medium-pistol',
      instanceId: 'wep-kiwi-1-mp',
      name: 'Medium Pistol',
      type: 'Ranged',
      skill: 'Handgun',
      damage: '2d6',
      rof: 2,
      hands: 1,
      concealable: true,
      cost: 50,
      costTier: 'Costly',
      standardMag: 12,
      currentMag: 12,
      ammoType: 'Medium Pistol',
      loadedAmmoType: 'Medium Pistol',
      inHand: true,
      reserveAmmo: 48,
      notes: 'Pistola táctica ligera de respaldo.'
    },
    {
      id: 'smg',
      instanceId: 'wep-kiwi-2-smg',
      name: 'SMG',
      type: 'Ranged',
      skill: 'Handgun',
      damage: '2d6',
      rof: 1,
      hands: 1,
      concealable: true,
      cost: 100,
      costTier: 'Premium',
      standardMag: 30,
      currentMag: 30,
      ammoType: 'Medium Pistol',
      loadedAmmoType: 'Medium Pistol',
      altFireModes: 'Autofire (3), Suppressive Fire',
      autofireMaxMult: 3,
      inHand: true,
      reserveAmmo: 48,
      notes: 'Subfusil compacto de ocultación rápida.'
    },
    {
      id: 'light-melee',
      instanceId: 'wep-kiwi-3-knife',
      name: 'Light Melee Weapon (Cuchillo)',
      type: 'Melee',
      skill: 'Melee Weapon',
      damage: '1d6',
      rof: 2,
      hands: 1,
      concealable: true,
      cost: 50,
      costTier: 'Costly',
      standardMag: 0,
      currentMag: 0,
      ammoType: 'N/A',
      loadedAmmoType: 'N/A',
      inHand: false,
      reserveAmmo: 0,
      notes: 'Cuchillo de emergencia de acero monomolecular.'
    }
  ],
  installedCyberwareIds: ['neuralware-processor', 'interface-plugs'],
  activeInjuries: [],
  eurodollars: 3800,
  inventory: [],
  transactions: [],
  unarmedInHand: { brawling: true, martialArts: false },
};

export function buildCemk2077Characters(): CharacterSheet[] {
  const cemkHandles = [
    'David Martinez',
    'Lucy (Kushinada)',
    'Rebecca',
    'Maine',
    'Kiwi',
    'Falco',
    'Pilar'
  ];
  const templates = PREGEN_TEMPLATES.filter(
    (p) => p.era === '2077' && cemkHandles.includes(p.handle)
  );
  return templates.map((tmpl) => {
    const sheet = instantiatePregenCharacter(tmpl);
    sheet.id = `char-cemk-${tmpl.id}`;
    return sheet;
  });
}

export const DEFAULT_CHARACTERS: CharacterSheet[] = [
  ...CEMK_FOLIO_PREMADE_CHARACTERS
];

export function loadInitialCharacters(): { characters: CharacterSheet[]; activeCharacterId: string } {
  const deduped: CharacterSheet[] = [];
  const seen = new Set<string>();
  for (const c of DEFAULT_CHARACTERS) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      deduped.push({ ...c });
    }
  }
  const hardpoint = deduped.find((c) => c.id === 'cemk-folio-hardpoint');
  return {
    characters: deduped,
    activeCharacterId: hardpoint?.id || deduped[0]?.id || FALLBACK_CHARACTER.id
  };
}

export interface CharacterStoreState {
  characters: CharacterSheet[];
  activeCharacterId: string;
  dismissedPremadeIds: string[];

  // Acciones
  getActiveCharacter: () => CharacterSheet;
  setActiveCharacter: (id: string) => void;
  createNewCharacter: (handle: string, role: string) => void;
  deleteCharacter: (id: string) => void;
  updateCharacterMeta: (patch: Partial<Pick<CharacterSheet, 'handle' | 'role' | 'roleRank' | 'eurodollars' | 'notes'>>) => void;
  updateStat: (stat: StatKey, value: number) => void;
  updateSkill: (skill: CombatSkillKey, value: number) => void;
  adjustHp: (delta: number) => void;
  setHp: (hp: number) => void;
  rollDeathSave: () => DeathSaveResult | null;
  addDeathSavePenalty: (amount: number) => void;
  setDead: (isDead: boolean) => void;
  ablateArmor: (location: 'head' | 'body', amount?: number) => void;
  repairArmor: (location: 'head' | 'body') => void;
  spendLuck: (amount: number) => boolean;
  restoreLuck: () => void;
  toggleLuckPip: (pipIndex: number) => void;
  consumeAmmo: (weaponInstanceId: string, amount: number) => boolean;
  reloadWeapon: (weaponInstanceId: string) => void;
  toggleWeaponInHand: (weaponInstanceId: string) => void;
  toggleUnarmedInHand: (mode: 'brawling' | 'martialArts') => void;
  adjustWeaponMag: (weaponInstanceId: string, delta: number) => void;
  adjustWeaponReserveAmmo: (weaponInstanceId: string, delta: number) => void;
  setWeaponAmmoType: (weaponInstanceId: string, ammoType: string) => void;
  useOrInjectDrug: (drug: Omit<ActiveDrugEffect, 'id'>) => void;
  removeActiveDrug: (id: string) => void;
  equipWeaponFromCatalog: (weapon: WeaponItem) => void;
  unequipWeapon: (weaponInstanceId: string) => void;
  convertWeaponRebuild2077: (weaponInstanceId: string, rebuildType: 'standard' | 'power' | 'smart' | 'tech', costEurobucks: number) => void;
  equipArmorFromCatalog: (armor: ArmorItem, location: 'head' | 'body' | 'both') => void;
  repairCharacterArmor: (location: 'head' | 'body' | 'both', spAmountOrFull: 'full' | number, costEurobucks?: number) => void;
  toggleCyberwareInstall: (cyberwareId: string, humanityCostAvg?: number) => void;
  toggleEmpDisableCyberware: (cyberwareId: string) => void;
  clearAllEmpDisabledCyberware: () => void;
  restAndHealDays: (days: number, hasEnhancedAntibodies?: boolean, inCryotank?: boolean) => void;
  installCyberwareAdvanced: (params: {
    cyberwareId: string;
    cyberwareName: string;
    humanityLossAmount: number;
    cost: number;
    spendMoney: boolean;
    armorSpBonus?: { location: 'head' | 'body' | 'both'; sp: number };
  }) => { success: boolean; message: string };
  uninstallCyberware: (cyberwareId: string, humanityRefundAmount?: number) => void;
  adjustHumanity: (delta: number) => void;
  inflictRandomInjury: (location: 'head' | 'body') => ActiveCriticalInjury | null;
  // v4.9.2 [Claude Code · 2026-10-22] Acciones sobre cualquier ficha (no solo la activa).
  inflictSpecificInjury: (characterId: string, location: 'head' | 'body', name: string, table: CritTable) => ActiveCriticalInjury | null;
  applyQuickFix: (characterId: string, injuryId: string, untilDay: number) => void;
  applyTreatment: (characterId: string, injuryId: string) => void;
  /** onlyIds: solo esas fichas (con mesa compartida, cada dispositivo aplica a las suyas). [Claude Code · 2026-10-27] */
  expireQuickFixes: (day: number, onlyIds?: string[]) => void;
  stabilizeCharacter: (characterId: string, opts: { wasMortallyWounded: boolean }) => void;
  adjustHpFor: (characterId: string, delta: number) => void;
  // v5.2.0 (plan 20) [Claude Code · 2026-10-28] Para que el GM actúe sobre la ficha de un PJ.
  ablateArmorFor: (characterId: string, location: 'head' | 'body', amount?: number) => void;
  adjustHumanityFor: (characterId: string, delta: number) => void;
  addDeathSavePenaltyFor: (characterId: string, amount: number) => void;
  inflictRandomInjuryFor: (characterId: string, location: 'head' | 'body') => ActiveCriticalInjury | null;
  /** Aplica los efectos de un impacto (planImpactEffects) y devuelve las heridas críticas que salieron. */
  applyImpactTo: (characterId: string, effects: ImpactEffects) => ActiveCriticalInjury[];
  /** Condiciones de `data/conditions.ts`; `since` = round en que empezó (si hay combate). */
  addConditionFor: (characterId: string, conditionId: string, since?: number) => void;
  removeConditionFor: (characterId: string, conditionId: string) => void;
  spendEurodollarsFor: (characterId: string, amount: number, reason: string) => boolean;
  toggleTreatInjury: (injuryId: string) => void;
  removeInjury: (injuryId: string) => void;
  exportActiveCharacterJson: () => string;
  importCharacterJson: (jsonStr: string) => boolean;
  exportFullBackup: () => string;
  importFullBackup: (text: string, mode: 'replace' | 'merge') => { ok: boolean; message: string; warnings: string[] };
  restorePremades: () => void;
  purchaseOrAcquireItem: (params: {
    item: any;
    category: InventoryItem['category'];
    spendMoney: boolean;
    autoEquip?: boolean;
    armorLocation?: 'head' | 'body' | 'both';
  }) => { success: boolean; message: string };
  updateInventoryQuantity: (invId: string, delta: number) => void;
  addConsumableCharge: (
    item: {
      catalogId: string;
      name: string;
      category: 'ammunition' | 'drugs' | 'gear';
      cost: number;
      details?: string;
    },
    charges?: number
  ) => void;
  addEurodollarTransaction: (concept: string, amount: number) => void;
  gmUpdateCharacterVitals: (
    characterId: string,
    patch: {
      hpDelta?: number;
      restoreFullHp?: boolean;
      repairAllArmor?: boolean;
      restoreAllLuck?: boolean;
      eurodollarsDelta?: number;
      concept?: string;
    }
  ) => void;
  gmPayAllCharacters: (conceptOrAmount: string | number, amountOrConcept?: number | string) => void;
  createCharacterFromWizard: (sheet: CharacterSheet) => void;
  updateCharacterLifepath: (partial: Partial<CharacterLifepath>) => void;
  updateCharacterDebt: (debt: CharacterDebt | undefined) => void;
  payOffCharacterDebt: (amount: number) => void;

  // Visual Theme
  appTheme: AppThemeId;
  setAppTheme: (theme: AppThemeId) => void;

  // Portrait
  setCharacterPortrait: (portraitId: string) => void;

  // FBC (Going Metal)
  activateFullBodyConversion: (chassis: {
    id: string;
    name: string;
    bodyOverride: number;
    statFloor: number;
    armorPenalty: number;
    baseArmorSp: number;
    humanityCost: number;
    immunities: string[];
  }) => void;
  deactivateFullBodyConversion: () => void;

  // Solo Combat Awareness
  updateSoloAllocation: (allocation: SoloCombatAwarenessAllocation) => void;

  // Improvement Points (IP) & Interface Override
  adjustImprovementPoints: (deltaIp: number, reason?: string) => void;
  // v4.9.1 [Claude Code · 2026-10-22] Avance con IP (Core p. 410) y edición libre (modo GM).
  raiseRoleRankWithIp: () => { success: boolean; message: string };
  raiseSkillWithIp: (skill: CombatSkillKey) => { success: boolean; message: string };
  raiseGeneralSkillWithIp: (key: string, x2: boolean, label: string) => { success: boolean; message: string };
  setGeneralSkill: (key: string, level: number) => void;
  /** v5.8.0 (plan 23): marca o desmarca una skill como favorita. [Claude Code · 2026-10-30] */
  toggleFavoriteSkill: (key: string) => void;
  gmSetRoleRank: (rank: number) => void;
  setMakerAllocation: (alloc: MakerAllocation) => void;
  // v4.9.3 [Claude Code · 2026-10-23] Roles sociales: Team del Exec (Core p.154) y fans del Rockerboy (Core pp.144-145).
  addExecTeamMember: (member: ExecTeamMember) => void;
  updateExecTeamMember: (memberId: string, patch: Partial<ExecTeamMember>) => void;
  removeExecTeamMember: (memberId: string) => void;
  adjustExecMemberLoyalty: (memberId: string, delta: number) => void;
  adjustExecMemberHp: (memberId: string, delta: number) => void;
  replaceExecTeamMember: (memberId: string) => { success: boolean; message: string };
  applyEndOfSessionToAll: (onlyIds?: string[]) => { characterId: string; handle: string; resigned: string[] }[];
  addRockerboyFanGroup: (group: Omit<RockerboyFanGroup, 'id' | 'createdAt'>) => void;
  updateRockerboyFanGroup: (id: string, patch: Partial<RockerboyFanGroup>) => void;
  removeRockerboyFanGroup: (id: string) => void;
  setMedicineAllocation: (alloc: MedicineAllocation) => void;
  setInterfaceRankOverride: (rank: number) => void;

  // Martial Arts Training & Skill Chips
  updateMartialArtRank: (formId: string, rank: number) => void;
  trainMartialArtWithIp: (formId: string, formName: string) => { success: boolean; message: string };
  buyAndEquipMartialArtChip: (formId: string, formName: string, freeGrant?: boolean) => { success: boolean; message: string };
  toggleEquipMartialArtChip: (formId: string) => void;

  // Vehicles (Nomad Garage)
  addVehicleToCharacter: (vehicle: OwnedVehicle) => void;
  updateVehicleSdp: (instanceId: string, deltaSdp: number) => void;
  updateVehicleArmorSp: (instanceId: string, deltaSp: number) => void;
  removeVehicleFromCharacter: (instanceId: string) => void;

  // Medtech Cryo & Pharma Lab
  updateMedtechLab: (lab: MedtechCryoAndPharma) => void;

  // Tech Maker Projects
  updateTechProjects: (projects: TechMakerProject[]) => void;

  // CEMK 2077 Roster & Party actions
  loadCemk2077PartyRoster: () => void;
  syncOrRestoreCemkFolioCharacters: () => void;

  // Weapon Attachments & Tech Maker Upgrades
  installWeaponAttachment: (weaponInstanceId: string, attachmentId: string, costEurobucks: number) => void;
  removeWeaponAttachment: (weaponInstanceId: string, attachmentId: string) => void;
  applyTechUpgradeToWeapon: (weaponInstanceId: string, upgradeType: TechWeaponUpgradeType, materialCostEurobucks: number) => void;
  applyTechUpgradeToArmor: (location: 'head' | 'body', enable: boolean, materialCostEurobucks: number) => void;
  updateRoleSpecificLifepath: (key: string, value: string) => void;
}

const initialRoster = loadInitialCharacters();

export const useCharacterStore = create<CharacterStoreState>()(
  persist(
    (set, get) => ({
      characters: initialRoster.characters,
      activeCharacterId: initialRoster.activeCharacterId,
      dismissedPremadeIds: [],
      appTheme:
        (typeof window !== 'undefined'
          ? (localStorage.getItem('cpr_app_theme_v1') as AppThemeId)
          : null) || 'neo_red',

      getActiveCharacter: () => {
        const state = get();
        const found = state.characters.find(c => c.id === state.activeCharacterId);
        return found || state.characters[0] || FALLBACK_CHARACTER;
      },

      setActiveCharacter: (id: string) => {
        set({ activeCharacterId: id });
      },

      createNewCharacter: (handle: string, role: string) => {
        const id = `char-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newChar: CharacterSheet = {
          id,
          handle: handle.trim() || 'Nuevo Edgerunner',
          role: role.trim() || 'Solo',
          roleRank: 4,
          notes: '',
          stats: {
            INT: 6,
            REF: 6,
            DEX: 6,
            TECH: 6,
            COOL: 6,
            WILL: 6,
            LUCK: 6,
            MOVE: 6,
            BODY: 6,
            EMP: 6
          },
          currentHp: calculateMaxHp(6, 6),
          currentLuck: 6,
          currentHumanity: 60,
          headArmor: {
            name: 'Kevlar (Head)',
            maxSp: 7,
            currentSp: 7,
            penalty: 0
          },
          bodyArmor: {
            name: 'Light Armorjack (Body)',
            maxSp: 11,
            currentSp: 11,
            penalty: 0
          },
          skills: {
            handgun: 4,
            shoulderArms: 4,
            autofire: 2,
            heavyWeapons: 0,
            archery: 0,
            meleeWeapon: 3,
            brawling: 3,
            martialArts: 0,
            evasion: 4,
            athletics: 3,
            firstAid: 3,
            paramedic: 0,
            cybertech: 2,
            perception: 4,
            concentration: 4,
            resistTortureDrugs: 3
          },
          equippedWeapons: [],
          installedCyberwareIds: [],
          activeInjuries: [],
          eurodollars: 1000,
          inventory: [],
          transactions: [],
          unarmedInHand: { brawling: true, martialArts: false },
          activeDrugs: []
        };

        set(state => ({
          characters: [...state.characters, newChar],
          activeCharacterId: id
        }));
      },

      deleteCharacter: (id: string) => {
        set(state => {
          const remaining = state.characters.filter(c => c.id !== id);
          // Si es un premade, recordar que fue descartado para que merge no lo re-inyecte.
          const dismissed = [...(state.dismissedPremadeIds || [])];
          const deletedHandle = state.characters.find(x => x.id === id)?.handle.toLowerCase();
          if (CEMK_FOLIO_PREMADE_CHARACTERS.some(f => f.id === id)) {
            if (!dismissed.includes(id)) dismissed.push(id);
          } else {
            const cemk = buildCemk2077Characters().find(c => c.id === id || c.handle.toLowerCase() === deletedHandle);
            if (cemk) {
              if (!dismissed.includes(cemk.id)) dismissed.push(cemk.id);
              const lower = cemk.handle.toLowerCase();
              if (!dismissed.includes(lower)) dismissed.push(lower);
            }
          }
          if (remaining.length === 0) {
            remaining.push(FALLBACK_CHARACTER);
          }
          const newActive = state.activeCharacterId === id ? remaining[0].id : state.activeCharacterId;
          return {
            characters: remaining,
            activeCharacterId: newActive,
            dismissedPremadeIds: dismissed
          };
        });
      },

      updateCharacterMeta: (patch) => {
        set(state => ({
          characters: state.characters.map(char =>
            char.id === state.activeCharacterId
              ? { ...char, ...patch }
              : char
          )
        }));
      },

      updateStat: (stat: StatKey, value: number) => {
        if (!Number.isFinite(value)) return;
        const clampedVal = Math.max(0, value);
        set(state => ({
          characters: state.characters.map(char => {
            if (char.id !== state.activeCharacterId) return char;

            const newStats = { ...char.stats, [stat]: clampedVal };
            let newCurrentHp = char.currentHp;
            let newCurrentLuck = char.currentLuck;

            if (stat === 'BODY' || stat === 'WILL') {
              const maxHp = calculateMaxHp(getEffectiveBody({ ...char, stats: newStats }), newStats.WILL);
              if (newCurrentHp > maxHp) {
                newCurrentHp = maxHp;
              }
            }

            if (stat === 'LUCK') {
              if (newCurrentLuck > newStats.LUCK) {
                newCurrentLuck = newStats.LUCK;
              }
            }

            return {
              ...char,
              stats: newStats,
              currentHp: newCurrentHp,
              currentLuck: newCurrentLuck
            };
          })
        }));
      },

      updateSkill: (skill: CombatSkillKey, value: number) => {
        const clampedVal = Math.max(0, value);
        set(state => ({
          characters: state.characters.map(char =>
            char.id === state.activeCharacterId
              ? {
                  ...char,
                  skills: {
                    ...char.skills,
                    [skill]: clampedVal
                  }
                }
              : char
          )
        }));
      },

      adjustHp: (delta: number) => {
        if (!Number.isFinite(delta)) return;
        set(state => ({
          characters: state.characters.map(char => {
            if (char.id !== state.activeCharacterId) return char;
            const maxHp = calculateMaxHp(getEffectiveBody(char), char.stats.WILL);
            const nextHp = Math.max(0, Math.min(maxHp, char.currentHp + delta));
            // Core p. 188: al estabilizar a 1+ HP el Death Save Penalty vuelve al base.
            return { ...char, currentHp: nextHp, deathSavePenalty: nextHp >= 1 ? 0 : char.deathSavePenalty };
          })
        }));
      },

      setHp: (hp: number) => {
        if (!Number.isFinite(hp)) return;
        set(state => ({
          characters: state.characters.map(char => {
            if (char.id !== state.activeCharacterId) return char;
            const maxHp = calculateMaxHp(getEffectiveBody(char), char.stats.WILL);
            const nextHp = Math.max(0, Math.min(maxHp, hp));
            return { ...char, currentHp: nextHp, deathSavePenalty: nextHp >= 1 ? 0 : char.deathSavePenalty };
          })
        }));
      },

      rollDeathSave: () => {
        const active = get().characters.find(c => c.id === get().activeCharacterId);
        if (!active) return null;
        const result = rollDeathSaveEngine(active);
        set(state => ({
          characters: state.characters.map(char =>
            char.id === state.activeCharacterId
              ? {
                  ...char,
                  deathSavePenalty: (char.deathSavePenalty ?? 0) + 1,
                  isDead: result.success ? char.isDead : true
                }
              : char
          )
        }));
        return result;
      },

      addDeathSavePenalty: (amount: number) => {
        get().addDeathSavePenaltyFor(get().activeCharacterId, amount);
      },

      addDeathSavePenaltyFor: (characterId, amount) => {
        set(state => ({
          characters: state.characters.map(char =>
            char.id === characterId
              ? { ...char, deathSavePenalty: Math.max(0, (char.deathSavePenalty ?? 0) + amount) }
              : char
          )
        }));
      },

      setDead: (isDead: boolean) => {
        set(state => ({
          characters: state.characters.map(char =>
            char.id === state.activeCharacterId ? { ...char, isDead } : char
          )
        }));
      },

      ablateArmor: (location: 'head' | 'body', amount = 1) => {
        get().ablateArmorFor(get().activeCharacterId, location, amount);
      },

      ablateArmorFor: (characterId, location, amount = 1) => {
        set(state => ({
          characters: state.characters.map(char => {
            if (char.id !== characterId) return char;
            if (location === 'head') {
              return {
                ...char,
                headArmor: {
                  ...char.headArmor,
                  currentSp: Math.max(0, char.headArmor.currentSp - amount)
                }
              };
            } else {
              return {
                ...char,
                bodyArmor: {
                  ...char.bodyArmor,
                  currentSp: Math.max(0, char.bodyArmor.currentSp - amount)
                }
              };
            }
          })
        }));
      },

      repairArmor: (location: 'head' | 'body') => {
        set(state => ({
          characters: state.characters.map(char => {
            if (char.id !== state.activeCharacterId) return char;
            if (location === 'head') {
              return {
                ...char,
                headArmor: {
                  ...char.headArmor,
                  currentSp: char.headArmor.maxSp
                }
              };
            } else {
              return {
                ...char,
                bodyArmor: {
                  ...char.bodyArmor,
                  currentSp: char.bodyArmor.maxSp
                }
              };
            }
          })
        }));
      },

      spendLuck: (amount: number) => {
        const char = get().getActiveCharacter();
        if (amount > 0 && char.currentLuck >= amount) {
          set(state => ({
            characters: state.characters.map(c =>
              c.id === state.activeCharacterId
                ? { ...c, currentLuck: c.currentLuck - amount }
                : c
            )
          }));
          return true;
        }
        return false;
      },

      restoreLuck: () => {
        set(state => ({
          characters: state.characters.map(c =>
            c.id === state.activeCharacterId
              ? { ...c, currentLuck: c.stats.LUCK }
              : c
          )
        }));
      },

      toggleLuckPip: (pipIndex: number) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            const nextLuck = c.currentLuck === pipIndex ? pipIndex - 1 : pipIndex;
            return {
              ...c,
              currentLuck: Math.max(0, Math.min(c.stats.LUCK, nextLuck))
            };
          })
        }));
      },

      consumeAmmo: (weaponInstanceId: string, amount: number) => {
        const char = get().getActiveCharacter();
        const weapon = char.equippedWeapons.find(w => w.instanceId === weaponInstanceId);
        if (!weapon || !Number.isFinite(amount) || amount <= 0 || weapon.currentMag < amount) {
          return false;
        }

        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              equippedWeapons: c.equippedWeapons.map(w =>
                w.instanceId === weaponInstanceId
                  ? { ...w, currentMag: w.currentMag - amount }
                  : w
              )
            };
          })
        }));
        return true;
      },

      reloadWeapon: (weaponInstanceId: string) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              equippedWeapons: c.equippedWeapons.map(w => {
                if (w.instanceId !== weaponInstanceId) return w;
                const standardMag = w.standardMag || 0;
                if (standardMag <= 0) return w;
                const currentMag = w.currentMag || 0;
                const needed = Math.max(0, standardMag - currentMag);
                if (needed <= 0) return w;

                const reserve = w.reserveAmmo ?? 36;
                if (reserve > 0) {
                  const toLoad = Math.min(needed, reserve);
                  return {
                    ...w,
                    currentMag: currentMag + toLoad,
                    reserveAmmo: reserve - toLoad
                  };
                } else {
                  return {
                    ...w,
                    currentMag: standardMag
                  };
                }
              })
            };
          })
        }));
      },

      toggleWeaponInHand: (weaponInstanceId: string) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              equippedWeapons: c.equippedWeapons.map(w =>
                w.instanceId === weaponInstanceId
                  ? { ...w, inHand: !(w.inHand ?? true) }
                  : w
              )
            };
          })
        }));
      },

      toggleUnarmedInHand: (mode: 'brawling' | 'martialArts') => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            const currentUnarmed = c.unarmedInHand || { brawling: true, martialArts: false };
            return {
              ...c,
              unarmedInHand: {
                ...currentUnarmed,
                [mode]: !currentUnarmed[mode]
              }
            };
          })
        }));
      },

      adjustWeaponMag: (weaponInstanceId: string, delta: number) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              equippedWeapons: c.equippedWeapons.map(w => {
                if (w.instanceId !== weaponInstanceId) return w;
                const maxMag = w.standardMag || 0;
                const newMag = Math.max(0, Math.min(maxMag, (w.currentMag || 0) + delta));
                return { ...w, currentMag: newMag };
              })
            };
          })
        }));
      },

      adjustWeaponReserveAmmo: (weaponInstanceId: string, delta: number) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              equippedWeapons: c.equippedWeapons.map(w => {
                if (w.instanceId !== weaponInstanceId) return w;
                const currentReserve = w.reserveAmmo ?? 36;
                const newReserve = Math.max(0, currentReserve + delta);
                return { ...w, reserveAmmo: newReserve };
              })
            };
          })
        }));
      },

      setWeaponAmmoType: (weaponInstanceId: string, ammoType: string) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              equippedWeapons: c.equippedWeapons.map(w =>
                w.instanceId === weaponInstanceId
                  ? { ...w, loadedAmmoType: ammoType }
                  : w
              )
            };
          })
        }));
      },

      useOrInjectDrug: (drug: Omit<ActiveDrugEffect, 'id'>) => {
        const newDrug: ActiveDrugEffect = {
          ...drug,
          id: `drug-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        };

        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            const currentDrugs = c.activeDrugs || [];
            let updatedInventory = c.inventory ? [...c.inventory] : [];

            const drugIndex = updatedInventory.findIndex(
              it => it.name.trim().toLowerCase() === drug.name.trim().toLowerCase()
            );

            if (drugIndex !== -1) {
              const item = updatedInventory[drugIndex];
              if (item.quantity > 1) {
                updatedInventory[drugIndex] = { ...item, quantity: item.quantity - 1 };
              } else {
                updatedInventory.splice(drugIndex, 1);
              }
            }

            return {
              ...c,
              activeDrugs: [...currentDrugs, newDrug],
              inventory: updatedInventory
            };
          })
        }));
      },

      removeActiveDrug: (id: string) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              activeDrugs: (c.activeDrugs || []).filter(d => d.id !== id)
            };
          })
        }));
      },

      equipWeaponFromCatalog: (weapon: WeaponItem) => {
        const equipped: EquippedWeapon = {
          ...weapon,
          instanceId: `wep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          currentMag: weapon.standardMag || 0,
          loadedAmmoType: 'Basic', // tipo de bala (Core p.345); el calibre queda en ammoType [Claude Code · 2026-10-25]
          inHand: true,
          reserveAmmo: weapon.standardMag && weapon.standardMag > 0 ? 36 : 0
        };

        set(state => ({
          characters: state.characters.map(c =>
            c.id === state.activeCharacterId
              ? {
                  ...c,
                  equippedWeapons: [...c.equippedWeapons, equipped]
                }
              : c
          )
        }));
      },

      unequipWeapon: (weaponInstanceId: string) => {
        set(state => ({
          characters: state.characters.map(c =>
            c.id === state.activeCharacterId
              ? {
                  ...c,
                  equippedWeapons: c.equippedWeapons.filter(w => w.instanceId !== weaponInstanceId)
                }
              : c
          )
        }));
      },

      convertWeaponRebuild2077: (
        weaponInstanceId: string,
        rebuildType: 'standard' | 'power' | 'smart' | 'tech',
        costEurobucks: number
      ) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;

            const updatedWeapons = c.equippedWeapons.map(w => {
              if (w.instanceId !== weaponInstanceId) return w;
              const currentNotes = (w.notes || '')
                .replace(/\s*\[Rebuild:\s*(Power|Smart|Tech|Standard)\]/gi, '')
                .trim();
              const newNotes =
                rebuildType !== 'standard'
                  ? currentNotes
                    ? `${currentNotes} [Rebuild: ${rebuildType.toUpperCase()}]`
                    : `[Rebuild: ${rebuildType.toUpperCase()}]`
                  : currentNotes;
              return {
                ...w,
                rebuild2077: rebuildType,
                notes: newNotes
              };
            });

            let newBalance = c.eurodollars || 0;
            let newTransactions = c.transactions || [];
            if (costEurobucks > 0) {
              newBalance = Math.max(0, newBalance - costEurobucks);
              const tx: EurodollarTransaction = {
                id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toISOString(),
                concept: `Conversión 2077 Rebuild: ${rebuildType.toUpperCase()}`,
                amount: -costEurobucks,
                balanceAfter: newBalance
              };
              newTransactions = [tx, ...newTransactions].slice(0, 50);
            }

            return {
              ...c,
              equippedWeapons: updatedWeapons,
              eurodollars: newBalance,
              transactions: newTransactions
            };
          })
        }));
      },

      installWeaponAttachment: (
        weaponInstanceId: string,
        attachmentId: string,
        costEurobucks: number
      ) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;

            const att = WEAPON_ATTACHMENTS_CATALOG.find(a => a.id === attachmentId);
            const incomp = att?.incompatibleWith ?? [];

            const updatedWeapons = c.equippedWeapons.map(w => {
              if (w.instanceId !== weaponInstanceId) return w;

              const baseMag = w.baseStandardMag ?? w.standardMag ?? 0;
              const prev = w.installedAttachments ?? [];
              const filtered = prev.filter(id => !incomp.includes(id) && id !== attachmentId);
              const updatedAttachments = [...filtered, attachmentId];

              const tempWep: EquippedWeapon = {
                ...w,
                installedAttachments: updatedAttachments,
                baseStandardMag: baseMag
              };
              const newStandardMag = calculateModifiedMagazineSize(tempWep, baseMag);

              let rebuild2077 = w.rebuild2077;
              if (att?.rebuild2077) {
                rebuild2077 = att.rebuild2077;
              }

              let underbarrelSgAmmo = w.underbarrelSgAmmo;
              if (attachmentId === 'att-underbarrel-sg' && underbarrelSgAmmo === undefined) {
                underbarrelSgAmmo = 2;
              }

              let underbarrelGlAmmo = w.underbarrelGlAmmo;
              if (attachmentId === 'att-underbarrel-gl' && underbarrelGlAmmo === undefined) {
                underbarrelGlAmmo = 1;
              }

              return {
                ...w,
                baseStandardMag: baseMag,
                installedAttachments: updatedAttachments,
                standardMag: newStandardMag,
                currentMag: Math.min(newStandardMag, w.currentMag ?? newStandardMag),
                rebuild2077,
                underbarrelSgAmmo,
                underbarrelGlAmmo
              };
            });

            let newBalance = c.eurodollars || 0;
            let newTransactions = c.transactions || [];
            if (costEurobucks > 0) {
              newBalance = Math.max(0, newBalance - costEurobucks);
              const tx: EurodollarTransaction = {
                id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toISOString(),
                concept: `Instalar accesorio: ${att?.name || attachmentId}`,
                amount: -costEurobucks,
                balanceAfter: newBalance
              };
              newTransactions = [tx, ...newTransactions].slice(0, 50);
            }

            return {
              ...c,
              equippedWeapons: updatedWeapons,
              eurodollars: newBalance,
              transactions: newTransactions
            };
          })
        }));
      },

      removeWeaponAttachment: (weaponInstanceId: string, attachmentId: string) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;

            const att = WEAPON_ATTACHMENTS_CATALOG.find(a => a.id === attachmentId);

            const updatedWeapons = c.equippedWeapons.map(w => {
              if (w.instanceId !== weaponInstanceId) return w;

              const prev = w.installedAttachments ?? [];
              const updatedAttachments = prev.filter(id => id !== attachmentId);
              const baseMag = w.baseStandardMag ?? w.standardMag ?? 0;

              const tempWep: EquippedWeapon = {
                ...w,
                installedAttachments: updatedAttachments,
                baseStandardMag: baseMag
              };
              const newStandardMag = calculateModifiedMagazineSize(tempWep, baseMag);

              let rebuild2077 = w.rebuild2077;
              if (att?.rebuild2077 && rebuild2077 === att.rebuild2077) {
                rebuild2077 = undefined;
              }

              return {
                ...w,
                installedAttachments: updatedAttachments,
                standardMag: newStandardMag,
                currentMag: Math.min(newStandardMag, w.currentMag ?? newStandardMag),
                rebuild2077
              };
            });

            return {
              ...c,
              equippedWeapons: updatedWeapons
            };
          })
        }));
      },

      applyTechUpgradeToWeapon: (
        weaponInstanceId: string,
        upgradeType: TechWeaponUpgradeType,
        materialCostEurobucks: number
      ) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;

            const updatedWeapons = c.equippedWeapons.map(w => {
              if (w.instanceId !== weaponInstanceId) return w;
              const isConcealable = upgradeType === 'concealable' ? true : w.concealable;
              return {
                ...w,
                techUpgrade: upgradeType,
                concealable: isConcealable
              };
            });

            let newBalance = c.eurodollars || 0;
            let newTransactions = c.transactions || [];
            if (materialCostEurobucks > 0) {
              newBalance = Math.max(0, newBalance - materialCostEurobucks);
              const tx: EurodollarTransaction = {
                id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toISOString(),
                concept: `Maker Tech Upgrade (Arma: ${upgradeType})`,
                amount: -materialCostEurobucks,
                balanceAfter: newBalance
              };
              newTransactions = [tx, ...newTransactions].slice(0, 50);
            }

            return {
              ...c,
              equippedWeapons: updatedWeapons,
              eurodollars: newBalance,
              transactions: newTransactions
            };
          })
        }));
      },

      applyTechUpgradeToArmor: (
        location: 'head' | 'body',
        enable: boolean,
        materialCostEurobucks: number
      ) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;

            let updatedHeadArmor = { ...c.headArmor };
            let updatedBodyArmor = { ...c.bodyArmor };

            if (location === 'head') {
              const currentUpgraded = !!c.headArmor.techUpgradedSp;
              if (enable && !currentUpgraded) {
                updatedHeadArmor = {
                  ...c.headArmor,
                  techUpgradedSp: true,
                  maxSp: c.headArmor.maxSp + 1,
                  currentSp: c.headArmor.currentSp + 1
                };
              } else if (!enable && currentUpgraded) {
                const nextMax = Math.max(0, c.headArmor.maxSp - 1);
                updatedHeadArmor = {
                  ...c.headArmor,
                  techUpgradedSp: false,
                  maxSp: nextMax,
                  currentSp: Math.max(0, Math.min(nextMax, c.headArmor.currentSp))
                };
              }
            } else if (location === 'body') {
              const currentUpgraded = !!c.bodyArmor.techUpgradedSp;
              if (enable && !currentUpgraded) {
                updatedBodyArmor = {
                  ...c.bodyArmor,
                  techUpgradedSp: true,
                  maxSp: c.bodyArmor.maxSp + 1,
                  currentSp: c.bodyArmor.currentSp + 1
                };
              } else if (!enable && currentUpgraded) {
                const nextMax = Math.max(0, c.bodyArmor.maxSp - 1);
                updatedBodyArmor = {
                  ...c.bodyArmor,
                  techUpgradedSp: false,
                  maxSp: nextMax,
                  currentSp: Math.max(0, Math.min(nextMax, c.bodyArmor.currentSp))
                };
              }
            }

            let newBalance = c.eurodollars || 0;
            let newTransactions = c.transactions || [];
            if (materialCostEurobucks > 0) {
              newBalance = Math.max(0, newBalance - materialCostEurobucks);
              const tx: EurodollarTransaction = {
                id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toISOString(),
                concept: `Maker Tech Upgrade (Blindaje ${location.toUpperCase()}: ${enable ? '+1 SP' : 'Retirado'})`,
                amount: -materialCostEurobucks,
                balanceAfter: newBalance
              };
              newTransactions = [tx, ...newTransactions].slice(0, 50);
            }

            return {
              ...c,
              headArmor: updatedHeadArmor,
              bodyArmor: updatedBodyArmor,
              eurodollars: newBalance,
              transactions: newTransactions
            };
          })
        }));
      },

      updateRoleSpecificLifepath: (key: string, value: string) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;

            const existingLifepath: CharacterLifepath = c.lifepath || {
              culturalRegion: '',
              personality: '',
              clothingStyle: '',
              hairstyle: '',
              affectation: '',
              valueMost: '',
              feelAboutPeople: '',
              valuedPerson: '',
              valuedPossession: '',
              familyBackground: '',
              childhoodEnvironment: '',
              familyCrisis: '',
              friends: [],
              tragicLoveAffairs: [],
              enemies: [],
              roleLifepath: {},
              lifeGoal: ''
            };

            const updatedRoleSpecific = {
              ...(existingLifepath.roleSpecificLifepath || {}),
              [key]: value
            };
            const updatedRoleLifepath = {
              ...(existingLifepath.roleLifepath || {}),
              [key]: value
            };

            return {
              ...c,
              lifepath: {
                ...existingLifepath,
                roleSpecificLifepath: updatedRoleSpecific,
                roleLifepath: updatedRoleLifepath
              }
            };
          })
        }));
      },

      repairCharacterArmor: (
        location: 'head' | 'body' | 'both',
        spAmountOrFull: 'full' | number,
        costEurobucks = 0
      ) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;

            let newHeadSp = c.headArmor.currentSp;
            let newBodySp = c.bodyArmor.currentSp;

            if (location === 'head' || location === 'both') {
              if (spAmountOrFull === 'full') {
                newHeadSp = c.headArmor.maxSp;
              } else {
                newHeadSp = Math.min(c.headArmor.maxSp, newHeadSp + spAmountOrFull);
              }
            }

            if (location === 'body' || location === 'both') {
              if (spAmountOrFull === 'full') {
                newBodySp = c.bodyArmor.maxSp;
              } else {
                newBodySp = Math.min(c.bodyArmor.maxSp, newBodySp + spAmountOrFull);
              }
            }

            let newBalance = c.eurodollars || 0;
            let newTransactions = c.transactions || [];
            if (costEurobucks > 0) {
              newBalance = Math.max(0, newBalance - costEurobucks);
              const tx: EurodollarTransaction = {
                id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toISOString(),
                concept: `Reparación de blindaje (${location === 'head' ? 'cabeza' : location === 'body' ? 'torso' : 'cabeza y torso'}): pago a un Tech`,
                amount: -costEurobucks,
                balanceAfter: newBalance
              };
              newTransactions = [tx, ...newTransactions].slice(0, 50);
            }

            return {
              ...c,
              headArmor: {
                ...c.headArmor,
                currentSp: newHeadSp
              },
              bodyArmor: {
                ...c.bodyArmor,
                currentSp: newBodySp
              },
              eurodollars: newBalance,
              transactions: newTransactions
            };
          })
        }));
      },

      toggleEmpDisableCyberware: (cyberwareId: string) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            const currentList = c.empDisabledCyberwareIds || [];
            const isAlreadyDisabled = currentList.includes(cyberwareId);
            const updated = isAlreadyDisabled
              ? currentList.filter(id => id !== cyberwareId)
              : [...currentList, cyberwareId];
            return {
              ...c,
              empDisabledCyberwareIds: updated
            };
          })
        }));
      },

      clearAllEmpDisabledCyberware: () => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              empDisabledCyberwareIds: []
            };
          })
        }));
      },

      restAndHealDays: (days: number, hasEnhancedAntibodies = false, inCryotank = false) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            // Core p. 223: sin estabilizar a 1+ HP no empieza la curación natural.
            if ((c.currentHp || 0) <= 0) return c;
            const effBody = getEffectiveBody(c);
            const healAmount = naturalHealingPerDay(effBody, hasEnhancedAntibodies, c.fbcState?.isFullBodyConversion ? false : inCryotank) * Math.max(1, days);
            const maxHp = calculateMaxHp(effBody, c.stats?.WILL ?? 0);
            const newHp = Math.min(maxHp, (c.currentHp || 0) + healAmount);
            return {
              ...c,
              currentHp: newHp
            };
          })
        }));
      },

      equipArmorFromCatalog: (armor: ArmorItem, location: 'head' | 'body' | 'both') => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;

            const headArmor = (location === 'head' || location === 'both')
              ? {
                  name: `${armor.name} (Head)`,
                  maxSp: armor.sp,
                  currentSp: armor.sp,
                  penalty: armor.penalty
                }
              : c.headArmor;

            const bodyArmor = (location === 'body' || location === 'both')
              ? {
                  name: `${armor.name} (Body)`,
                  maxSp: armor.sp,
                  currentSp: armor.sp,
                  penalty: armor.penalty
                }
              : c.bodyArmor;

            return {
              ...c,
              headArmor,
              bodyArmor
            };
          })
        }));
      },

      toggleCyberwareInstall: (cyberwareId: string, humanityCostAvg = 7) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;

            const isInstalled = c.installedCyberwareIds.includes(cyberwareId);
            if (isInstalled) {
              const remaining = removeLastCopy(c.installedCyberwareIds, cyberwareId);
              return {
                ...c,
                installedCyberwareIds: remaining,
                currentHumanity: gainHumanityCapped(c, humanityCostAvg, remaining)
              };
            } else {
              if (!canInstallAnother(c.installedCyberwareIds, cyberwareId, c.stats).ok) return c;
              return {
                ...c,
                installedCyberwareIds: [...c.installedCyberwareIds, cyberwareId],
                currentHumanity: Math.max(0, c.currentHumanity - humanityCostAvg)
              };
            }
          })
        }));
      },

      installCyberwareAdvanced: ({
        cyberwareId,
        cyberwareName,
        humanityLossAmount,
        cost,
        spendMoney,
        armorSpBonus
      }) => {
        const char = get().getActiveCharacter();
        const installCheck = canInstallAnother(char.installedCyberwareIds, cyberwareId, char.stats);
        if (!installCheck.ok) {
          return { success: false, message: installCheck.reason ?? 'No se puede instalar otra copia' };
        }
        if (spendMoney && (char.eurodollars || 0) < cost) {
          return { success: false, message: 'Fondos insuficientes (€$)' };
        }

        const newEurodollars = spendMoney ? (char.eurodollars || 0) - cost : (char.eurodollars || 0);
        const txConcept = spendMoney
          ? `Cirugía Ciberware: ${cyberwareName}`
          : `Instalación Ciberware (Cortesía/Loot): ${cyberwareName}`;
        const txAmount = spendMoney ? -cost : 0;
        const newTx: EurodollarTransaction = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toISOString(),
          concept: txConcept,
          amount: txAmount,
          balanceAfter: newEurodollars
        };

        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;

            const updatedCyberwareIds = [...c.installedCyberwareIds, cyberwareId];

            const updatedHumanity = Math.max(0, c.currentHumanity - humanityLossAmount);

            let updatedHeadArmor = { ...c.headArmor };
            let updatedBodyArmor = { ...c.bodyArmor };

            if (armorSpBonus) {
              if (armorSpBonus.location === 'head' || armorSpBonus.location === 'both') {
                if (updatedHeadArmor.currentSp < armorSpBonus.sp) {
                  updatedHeadArmor = {
                    ...updatedHeadArmor,
                    name: `${cyberwareName} (SP ${armorSpBonus.sp})`,
                    currentSp: armorSpBonus.sp,
                    maxSp: Math.max(updatedHeadArmor.maxSp, armorSpBonus.sp)
                  };
                }
              }
              if (armorSpBonus.location === 'body' || armorSpBonus.location === 'both') {
                if (updatedBodyArmor.currentSp < armorSpBonus.sp) {
                  updatedBodyArmor = {
                    ...updatedBodyArmor,
                    name: `${cyberwareName} (SP ${armorSpBonus.sp})`,
                    currentSp: armorSpBonus.sp,
                    maxSp: Math.max(updatedBodyArmor.maxSp, armorSpBonus.sp)
                  };
                }
              }
            }

            return {
              ...c,
              eurodollars: newEurodollars,
              installedCyberwareIds: updatedCyberwareIds,
              currentHumanity: updatedHumanity,
              headArmor: updatedHeadArmor,
              bodyArmor: updatedBodyArmor,
              transactions: [newTx, ...(c.transactions || [])].slice(0, 50)
            };
          })
        }));

        return {
          success: true,
          message: `${cyberwareName} instalado con éxito (-${humanityLossAmount} HUM).`
        };
      },

      uninstallCyberware: (cyberwareId: string, humanityRefundAmount = 7) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const remaining = removeLastCopy(c.installedCyberwareIds, cyberwareId);
            return {
              ...c,
              installedCyberwareIds: remaining,
              currentHumanity: gainHumanityCapped(c, humanityRefundAmount, remaining)
            };
          })
        }));
      },

      adjustHumanity: (delta: number) => {
        get().adjustHumanityFor(get().activeCharacterId, delta);
      },

      adjustHumanityFor: (characterId, delta) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;
            return {
              ...c,
              currentHumanity: gainHumanityCapped(c, delta)
            };
          })
        }));
      },

      inflictRandomInjury: (location: 'head' | 'body') => get().inflictRandomInjuryFor(get().activeCharacterId, location),

      inflictRandomInjuryFor: (characterId, location) => {
        const active = get().characters.find(c => c.id === characterId);
        const currentNames = (active?.activeInjuries ?? []).filter(i => !i.isTreated).map(i => i.name);
        const useCemk = useRulesSettingsStore.getState().criticalTable === 'cemk';
        const newInjury: ActiveCriticalInjury = useCemk
          ? buildCemkInjury(location, rollCemkCriticalInjury(location, currentNames))
          : buildCoreInjury(rollCriticalInjury(location, currentNames));
        // Going Metal p. 94: un FBC es inmune a ciertas heridas críticas.
        if (active?.fbcState?.isFullBodyConversion) {
          const paren = newInjury.name.match(/\(([^)]+)\)/);
          const enName = (paren ? paren[1] : newInjury.name).trim().toLowerCase();
          if ((FBC_IMMUNE_CRITICAL_INJURIES as readonly string[]).some((n) => n.toLowerCase() === enName)) {
            return null;
          }
        }

        set(state => ({
          characters: state.characters.map(c =>
            c.id === characterId
              ? {
                  ...c,
                  activeInjuries: [...c.activeInjuries, newInjury]
                }
              : c
          )
        }));

        return newInjury;
      },

      // Mismo orden que el HUD: ablación, HP, crítica (Core p. 187) y la de Mortally Wounded (Core p. 188).
      applyImpactTo: (characterId, effects) => {
        const st = get();
        const injuries: ActiveCriticalInjury[] = [];
        if (effects.ablation) st.ablateArmorFor(characterId, effects.ablation.location, effects.ablation.amount);
        if (effects.hpLoss > 0) st.adjustHpFor(characterId, -effects.hpLoss);
        if (effects.critical) {
          const injury = st.inflictRandomInjuryFor(characterId, effects.critical.location);
          if (injury) injuries.push(injury);
          // Going Metal p. 94: un FBC inmune a la herida crítica también ignora el daño extra (+5).
          const target = get().characters.find(c => c.id === characterId);
          if (!injury && target?.fbcState?.isFullBodyConversion && effects.critical.fbcRefund > 0) {
            st.adjustHpFor(characterId, effects.critical.fbcRefund);
          }
        }
        if (effects.mortalCritical) {
          const injury = st.inflictRandomInjuryFor(characterId, effects.mortalCritical.location);
          if (injury) injuries.push(injury);
          st.addDeathSavePenaltyFor(characterId, 1);
        }
        return injuries;
      },

      addConditionFor: (characterId, conditionId, since) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== characterId || (c.conditions ?? []).some(x => x.id === conditionId)) return c;
            const entry = since != null ? { id: conditionId, since } : { id: conditionId };
            return { ...c, conditions: [...(c.conditions ?? []), entry] };
          })
        }));
      },

      removeConditionFor: (characterId, conditionId) => {
        set(state => ({
          characters: state.characters.map(c =>
            c.id === characterId && (c.conditions ?? []).some(x => x.id === conditionId)
              ? { ...c, conditions: (c.conditions ?? []).filter(x => x.id !== conditionId) }
              : c
          )
        }));
      },

      inflictSpecificInjury: (characterId, location, name, table) => {
        const target = get().characters.find(c => c.id === characterId);
        if (!target) return null;
        let newInjury: ActiveCriticalInjury | null;
        if (table === 'cemk') {
          newInjury = findCemkInjuryByName(location, name);
        } else {
          const entry = (location === 'head' ? HEAD_CRITICAL_INJURIES : BODY_CRITICAL_INJURIES).find(i => i.name === name);
          newInjury = entry ? buildCoreInjury(entry) : null;
        }
        if (!newInjury) return null;
        const injury = newInjury;
        set(state => ({
          characters: state.characters.map(c =>
            c.id === characterId ? { ...c, activeInjuries: [...c.activeInjuries, injury] } : c
          )
        }));
        return injury;
      },

      applyQuickFix: (characterId, injuryId, untilDay) => {
        set(state => ({
          characters: state.characters.map(c =>
            c.id === characterId
              ? {
                  ...c,
                  activeInjuries: c.activeInjuries.map(inj =>
                    inj.id === injuryId ? { ...inj, isTreated: true, quickFixed: true, quickFixUntilDay: untilDay } : inj
                  )
                }
              : c
          )
        }));
      },

      // Core p. 223: el Treatment elimina la herida.
      applyTreatment: (characterId, injuryId) => {
        set(state => ({
          characters: state.characters.map(c =>
            c.id === characterId
              ? { ...c, activeInjuries: c.activeInjuries.filter(inj => inj.id !== injuryId) }
              : c
          )
        }));
      },

      // Core p. 223 / CEMK RB p. 14: el Quick Fix vence al pasar de día.
      expireQuickFixes: (day, onlyIds) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (onlyIds && !onlyIds.includes(c.id)) return c;
            if (!c.activeInjuries.some(inj => inj.quickFixed && (inj.quickFixUntilDay ?? 0) < day)) return c;
            return {
              ...c,
              activeInjuries: c.activeInjuries.map(inj =>
                inj.quickFixed && (inj.quickFixUntilDay ?? 0) < day
                  ? { ...inj, isTreated: false, quickFixed: false }
                  : inj
              )
            };
          })
        }));
      },

      // Core p. 222-223: la base del Death Save Penalty se calcula de las heridas activas
      // (getBaseDeathSavePenalty); lo acumulado en deathSavePenalty se reinicia a 0.
      stabilizeCharacter: (characterId, opts) => {
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== characterId) return c;
            const nextHp = opts.wasMortallyWounded && c.currentHp < 1 ? 1 : c.currentHp;
            return { ...c, currentHp: nextHp, deathSavePenalty: 0 };
          })
        }));
      },

      adjustHpFor: (characterId, delta) => {
        if (!Number.isFinite(delta)) return;
        set(state => ({
          characters: state.characters.map(char => {
            if (char.id !== characterId) return char;
            const maxHp = calculateMaxHp(getEffectiveBody(char), char.stats.WILL);
            const nextHp = Math.max(0, Math.min(maxHp, char.currentHp + delta));
            return { ...char, currentHp: nextHp, deathSavePenalty: nextHp >= 1 ? 0 : char.deathSavePenalty };
          })
        }));
      },

      spendEurodollarsFor: (characterId, amount, reason) => {
        const target = get().characters.find(c => c.id === characterId);
        if (!target || !Number.isFinite(amount) || amount < 0 || (target.eurodollars || 0) < amount) return false;
        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== characterId) return c;
            const newBalance = (c.eurodollars || 0) - amount;
            const newTx: EurodollarTransaction = {
              id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              timestamp: new Date().toISOString(),
              concept: reason,
              amount: -amount,
              balanceAfter: newBalance
            };
            return {
              ...c,
              eurodollars: newBalance,
              transactions: [newTx, ...(c.transactions || [])].slice(0, 50)
            };
          })
        }));
        return true;
      },

      toggleTreatInjury: (injuryId: string) => {
        set(state => ({
          characters: state.characters.map(c =>
            c.id === state.activeCharacterId
              ? {
                  ...c,
                  activeInjuries: c.activeInjuries.map(inj =>
                    inj.id === injuryId ? { ...inj, isTreated: !inj.isTreated } : inj
                  )
                }
              : c
          )
        }));
      },

      removeInjury: (injuryId: string) => {
        set(state => ({
          characters: state.characters.map(c =>
            c.id === state.activeCharacterId
              ? {
                  ...c,
                  activeInjuries: c.activeInjuries.filter(inj => inj.id !== injuryId)
                }
              : c
          )
        }));
      },

      exportActiveCharacterJson: () => {
        const char = get().getActiveCharacter();
        return JSON.stringify(char, null, 2);
      },

      importCharacterJson: (jsonStr: string) => {
        try {
          const parsed = parseFullBackup(jsonStr);
          if (!parsed.ok) return false;
          const incoming = parsed.characters;
          set(state => {
            const updatedList = [...state.characters];
            for (const ch of incoming) {
              const existingIndex = updatedList.findIndex(c => c.id === ch.id);
              if (existingIndex >= 0) {
                updatedList[existingIndex] = ch;
              } else {
                updatedList.push(ch);
              }
            }
            return {
              characters: updatedList,
              activeCharacterId: incoming[0].id
            };
          });
          return true;
        } catch {
          return false;
        }
      },

      exportFullBackup: () => {
        const { characters, activeCharacterId, dismissedPremadeIds } = get();
        return JSON.stringify(
          buildFullBackup({ characters, activeCharacterId, dismissedPremadeIds }, APP_VERSION),
          null,
          2
        );
      },

      importFullBackup: (text: string, mode: 'replace' | 'merge') => {
        const parsed = parseFullBackup(text);
        if (!parsed.ok) {
          return { ok: false, message: parsed.error, warnings: [] as string[] };
        }
        const incoming = parsed.characters;
        if (mode === 'replace') {
          for (const [key, value] of Object.entries(parsed.extras)) {
            try {
              if (typeof value === 'string') localStorage.setItem(key, value);
            } catch {
              parsed.warnings.push(`No se pudo restaurar "${key}" (sin espacio en el navegador).`);
            }
          }
          set(() => {
            const activeId = parsed.activeCharacterId && incoming.some(c => c.id === parsed.activeCharacterId)
              ? parsed.activeCharacterId
              : incoming[0].id;
            return {
              characters: incoming,
              activeCharacterId: activeId,
              dismissedPremadeIds: parsed.dismissedPremadeIds
            };
          });
          return { ok: true, message: `Respaldo restaurado: ${incoming.length} fichas (reemplazo total).`, warnings: parsed.warnings };
        }
        set(state => {
          const updatedList = [...state.characters];
          for (const ch of incoming) {
            const idx = updatedList.findIndex(c => c.id === ch.id);
            if (idx >= 0) updatedList[idx] = ch;
            else updatedList.push(ch);
          }
          return { characters: updatedList };
        });
        return { ok: true, message: `Respaldo combinado: ${incoming.length} fichas agregadas o actualizadas.`, warnings: parsed.warnings };
      },

      restorePremades: () => {
        set(state => ({
          dismissedPremadeIds: [],
          characters: injectPremades(state.characters, [], CEMK_FOLIO_PREMADE_CHARACTERS, buildCemk2077Characters())
        }));
      },

      purchaseOrAcquireItem: ({ item, category, spendMoney, autoEquip = true, armorLocation = 'both' }) => {
        const char = get().getActiveCharacter();
        const cost = Number(item.cost || 0);

        if (category === 'cyberware' && autoEquip !== false) {
          const installCheck = canInstallAnother(char.installedCyberwareIds, item.id, char.stats);
          if (!installCheck.ok) {
            return { success: false, message: installCheck.reason ?? 'No se puede instalar otra copia' };
          }
        }

        if (spendMoney && (char.eurodollars || 0) < cost) {
          return { success: false, message: 'Fondos insuficientes (€$)' };
        }

        const newEurodollars = spendMoney ? (char.eurodollars || 0) - cost : (char.eurodollars || 0);
        const txConcept = spendMoney
          ? `Compra: ${item.name}`
          : `Adquirido (Gratis/Loot): ${item.name}`;
        const txAmount = spendMoney ? -cost : 0;
        const newTx: EurodollarTransaction = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toISOString(),
          concept: txConcept,
          amount: txAmount,
          balanceAfter: newEurodollars
        };

        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;

            const updatedEquippedWeapons = [...c.equippedWeapons];
            let updatedHeadArmor = { ...c.headArmor };
            let updatedBodyArmor = { ...c.bodyArmor };
            const updatedCyberwareIds = [...c.installedCyberwareIds];
            let updatedHumanity = c.currentHumanity;
            const updatedInventory = [...(c.inventory || [])];

            if (category === 'weapons' && autoEquip !== false) {
              const equippedWep: EquippedWeapon = {
                ...item,
                instanceId: `wep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                currentMag: item.standardMag || 0,
                loadedAmmoType: 'Basic', // tipo de bala (Core p.345); el calibre queda en ammoType [Claude Code · 2026-10-25]
                inHand: true,
                reserveAmmo: item.standardMag && item.standardMag > 0 ? 36 : 0
              };
              updatedEquippedWeapons.push(equippedWep);
            } else if (category === 'armor' && autoEquip !== false) {
              if (armorLocation === 'head' || armorLocation === 'both') {
                updatedHeadArmor = {
                  name: `${item.name} (Head)`,
                  maxSp: item.sp,
                  currentSp: item.sp,
                  penalty: item.penalty
                };
              }
              if (armorLocation === 'body' || armorLocation === 'both') {
                updatedBodyArmor = {
                  name: `${item.name} (Body)`,
                  maxSp: item.sp,
                  currentSp: item.sp,
                  penalty: item.penalty
                };
              }
            } else if (category === 'cyberware' && autoEquip !== false) {
              if (canInstallAnother(updatedCyberwareIds, item.id, c.stats).ok) {
                updatedCyberwareIds.push(item.id);
                const parsedHl = item.humanityLoss ? parseHumanityLossAverage(String(item.humanityLoss)) : 7;
                updatedHumanity = Math.max(0, updatedHumanity - parsedHl);
              }
            } else {
              const existingIndex = updatedInventory.findIndex(
                (inv) => inv.catalogId === (item.id || item.name)
              );
              const isGrenade = (item.name || '').toLowerCase().includes('grenade');
              const qtyToAdd = (category === 'ammunition' && !isGrenade) ? 10 : 1;
              if (existingIndex >= 0) {
                updatedInventory[existingIndex] = {
                  ...updatedInventory[existingIndex],
                  quantity: updatedInventory[existingIndex].quantity + qtyToAdd
                };
              } else {
                updatedInventory.push({
                  id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                  catalogId: item.id || item.name,
                  name: item.name,
                  category,
                  cost,
                  quantity: qtyToAdd,
                  details: item.description || item.notes || item.damage || ''
                });
              }
            }

            return {
              ...c,
              eurodollars: newEurodollars,
              equippedWeapons: updatedEquippedWeapons,
              headArmor: updatedHeadArmor,
              bodyArmor: updatedBodyArmor,
              installedCyberwareIds: updatedCyberwareIds,
              currentHumanity: updatedHumanity,
              inventory: updatedInventory,
              transactions: [newTx, ...(c.transactions || [])].slice(0, 50)
            };
          })
        }));

        return {
          success: true,
          message: `${item.name} adquirido (${spendMoney ? `-${cost} €$` : 'Gratis/Loot'}).`
        };
      },

      updateInventoryQuantity: (invId: string, delta: number) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const currentInv = c.inventory || [];
            const updatedInv = currentInv
              .map((it) => (it.id === invId ? { ...it, quantity: it.quantity + delta } : it))
              .filter((it) => it.quantity > 0);
            return {
              ...c,
              inventory: updatedInv
            };
          })
        }));
      },

      addConsumableCharge: (item, charges = 1) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const currentInv = c.inventory ? [...c.inventory] : [];
            const existingIdx = currentInv.findIndex(
              (inv) =>
                inv.catalogId === item.catalogId ||
                inv.name.trim().toLowerCase() === item.name.trim().toLowerCase()
            );

            if (existingIdx >= 0) {
              currentInv[existingIdx] = {
                ...currentInv[existingIdx],
                quantity: currentInv[existingIdx].quantity + charges
              };
            } else {
              currentInv.push({
                id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                catalogId: item.catalogId,
                name: item.name,
                category: item.category,
                cost: item.cost,
                quantity: Math.max(1, charges),
                details: item.details || ''
              });
            }

            return {
              ...c,
              inventory: currentInv
            };
          })
        }));
      },

      addEurodollarTransaction: (concept: string, amount: number) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const newBalance = Math.max(0, (c.eurodollars || 0) + amount);
            const newTx: EurodollarTransaction = {
              id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              timestamp: new Date().toISOString(),
              concept,
              // Se registra lo que realmente se movió si el saldo no alcanzaba.
              amount: newBalance - (c.eurodollars || 0),
              balanceAfter: newBalance
            };
            return {
              ...c,
              eurodollars: newBalance,
              transactions: [newTx, ...(c.transactions || [])].slice(0, 50)
            };
          })
        }));
      },

      gmUpdateCharacterVitals: (characterId, patch) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;

            const maxHp = calculateMaxHp(getEffectiveBody(c), c.stats?.WILL ?? 0);
            let updatedHp = c.currentHp;
            if (patch.restoreFullHp) {
              updatedHp = maxHp;
            } else if (typeof patch.hpDelta === 'number') {
              updatedHp = Math.max(0, Math.min(maxHp, updatedHp + patch.hpDelta));
            }

            let updatedHeadArmor = { ...c.headArmor };
            let updatedBodyArmor = { ...c.bodyArmor };
            if (patch.repairAllArmor) {
              updatedHeadArmor = {
                ...updatedHeadArmor,
                currentSp: updatedHeadArmor.maxSp
              };
              updatedBodyArmor = {
                ...updatedBodyArmor,
                currentSp: updatedBodyArmor.maxSp
              };
            }

            let updatedLuck = c.currentLuck;
            if (patch.restoreAllLuck) {
              updatedLuck = c.stats?.LUCK ?? 0;
            }

            let updatedEurodollars = c.eurodollars ?? 0;
            let updatedTransactions = [...(c.transactions || [])];
            if (typeof patch.eurodollarsDelta === 'number' && patch.eurodollarsDelta !== 0) {
              const previousEurodollars = updatedEurodollars;
              updatedEurodollars = Math.max(0, updatedEurodollars + patch.eurodollarsDelta);
              const newTx: EurodollarTransaction = {
                id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toISOString(),
                concept: patch.concept || (patch.eurodollarsDelta > 0 ? 'GM Grant (€$)' : 'GM Deduct (€$)'),
                amount: updatedEurodollars - previousEurodollars,
                balanceAfter: updatedEurodollars
              };
              updatedTransactions = [newTx, ...updatedTransactions].slice(0, 50);
            }

            return {
              ...c,
              currentHp: updatedHp,
              headArmor: updatedHeadArmor,
              bodyArmor: updatedBodyArmor,
              currentLuck: updatedLuck,
              eurodollars: updatedEurodollars,
              transactions: updatedTransactions
            };
          })
        }));
      },

      gmPayAllCharacters: (conceptOrAmount, amountOrConcept) => {
        let concept = 'Pago de Gig / Trabajo';
        let amount = 0;
        if (typeof conceptOrAmount === 'number') {
          amount = conceptOrAmount;
          if (typeof amountOrConcept === 'string') concept = amountOrConcept;
        } else if (typeof conceptOrAmount === 'string') {
          concept = conceptOrAmount;
          if (typeof amountOrConcept === 'number') amount = amountOrConcept;
        }
        set((state) => ({
          characters: state.characters.map((c) => {
            const newBal = Math.max(0, (c.eurodollars || 0) + amount);
            const newTx: EurodollarTransaction = {
              id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              timestamp: new Date().toISOString(),
              concept: concept || (amount >= 0 ? 'Pago de Gig / Trabajo' : 'Gasto Grupal'),
              amount,
              balanceAfter: newBal
            };
            return {
              ...c,
              eurodollars: newBal,
              transactions: [newTx, ...(c.transactions || [])].slice(0, 50)
            };
          })
        }));
      },

      createCharacterFromWizard: (sheet: CharacterSheet) => {
        set((state) => {
          const exists = state.characters.some((c) => c.id === sheet.id);
          const characters = exists
            ? state.characters.map((c) => (c.id === sheet.id ? sheet : c))
            : [...state.characters, sheet];
          return {
            characters,
            activeCharacterId: sheet.id
          };
        });
      },

      updateCharacterLifepath: (partial: Partial<CharacterLifepath>) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const currentLifepath: CharacterLifepath = c.lifepath || {
              culturalRegion: '',
              personality: '',
              clothingStyle: '',
              hairstyle: '',
              affectation: '',
              valueMost: '',
              feelAboutPeople: '',
              valuedPerson: '',
              valuedPossession: '',
              familyBackground: '',
              childhoodEnvironment: '',
              familyCrisis: '',
              friends: [],
              tragicLoveAffairs: [],
              enemies: [],
              roleLifepath: {},
              lifeGoal: ''
            };
            return {
              ...c,
              lifepath: {
                ...currentLifepath,
                ...partial
              }
            };
          })
        }));
      },

      updateCharacterDebt: (debt: CharacterDebt | undefined) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              debt
            };
          })
        }));
      },

      payOffCharacterDebt: (amount: number) => {
        if (amount <= 0) return;
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const currentDebt = c.debt;
            if (!currentDebt || !currentDebt.isActive) return c;

            const paidAmount = Math.min(amount, c.eurodollars || 0, currentDebt.amount);
            if (paidAmount <= 0) return c;

            const newBalance = (c.eurodollars || 0) - paidAmount;
            const remainingDebt = Math.max(0, currentDebt.amount - paidAmount);
            const isDebtClear = remainingDebt === 0;

            const newTx: EurodollarTransaction = {
              id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              timestamp: new Date().toISOString(),
              concept: `Pago de Deuda (${currentDebt.creditorName || 'Acreedor'})`,
              amount: -paidAmount,
              balanceAfter: newBalance
            };

            return {
              ...c,
              eurodollars: newBalance,
              transactions: [newTx, ...(c.transactions || [])].slice(0, 50),
              debt: {
                ...currentDebt,
                amount: remainingDebt,
                isActive: !isDebtClear
              }
            };
          })
        }));
      },

      setAppTheme: (theme: AppThemeId) => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('cpr_app_theme_v1', theme);
          } catch {
            // ignore storage errors
          }
        }
        set({ appTheme: theme });
      },

      setCharacterPortrait: (portraitId: string) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              portraitId
            };
          })
        }));
      },

      activateFullBodyConversion: (chassis: {
        id: string;
        name: string;
        bodyOverride: number;
        statFloor: number;
        armorPenalty: number;
        baseArmorSp: number;
        humanityCost: number;
        immunities: string[];
      }) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;

            const wasAlreadyFbc = Boolean(c.fbcState?.isFullBodyConversion);
            const humanityCost = chassis.humanityCost ?? 0;
            const newHumanity = Math.max(0, (c.currentHumanity ?? 0) - humanityCost);


            const newFbcState: ActiveFbcState = {
              isFullBodyConversion: true,
              hasBiopod: true,
              activeChassisId: chassis.id,
              activeChassisName: chassis.name,
              bodyOverride: chassis.bodyOverride,
              statFloor: chassis.statFloor,
              armorPenalty: chassis.armorPenalty,
              baseArmorSp: chassis.baseArmorSp,
              immunities: chassis.immunities || [],
              // Al cambiar de chasis se conserva la armadura original de antes de la primera conversión.
              preFbcHeadArmor: wasAlreadyFbc ? c.fbcState?.preFbcHeadArmor : c.headArmor,
              preFbcBodyArmor: wasAlreadyFbc ? c.fbcState?.preFbcBodyArmor : c.bodyArmor
            };

            // BODY y MOVE del chasis se aplican vía getEffectiveBody / getEffectiveMove (fbcState),
            // sin pisar los stats base, para que la conversión se pueda revertir.
            const updatedCharTemp: CharacterSheet = {
              ...c,
              fbcState: newFbcState
            };

            const newMaxHp = calculateMaxHp(getEffectiveBody(updatedCharTemp), updatedCharTemp.stats?.WILL ?? 0);
            // Going Metal p. 94: al convertir o cambiar de cuerpo, HP actual = nuevo HP máximo.
            const newHp = newMaxHp;

            let headArmor = c.headArmor;
            let bodyArmor = c.bodyArmor;

            if (chassis.baseArmorSp > 0) {
              if (!headArmor || chassis.baseArmorSp > headArmor.maxSp) {
                headArmor = {
                  name: `${chassis.name} Chassis Plating (Head)`,
                  maxSp: chassis.baseArmorSp,
                  currentSp: chassis.baseArmorSp,
                  penalty: chassis.armorPenalty
                };
              }
              if (!bodyArmor || chassis.baseArmorSp > bodyArmor.maxSp) {
                bodyArmor = {
                  name: `${chassis.name} Chassis Plating (Body)`,
                  maxSp: chassis.baseArmorSp,
                  currentSp: chassis.baseArmorSp,
                  penalty: chassis.armorPenalty
                };
              }
            }

            const installedCyberwareIds = !wasAlreadyFbc && !(c.installedCyberwareIds || []).includes('gm-biosystem')
              ? [...(c.installedCyberwareIds || []), 'gm-biosystem']
              : c.installedCyberwareIds;

            return {
              ...updatedCharTemp,
              installedCyberwareIds,
              currentHumanity: newHumanity,
              currentHp: newHp,
              headArmor,
              bodyArmor
            };
          })
        }));
      },

      deactivateFullBodyConversion: () => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            if (!c.fbcState?.isFullBodyConversion) return c;

            const newFbcState: ActiveFbcState = {
              ...c.fbcState,
              isFullBodyConversion: false,
              preFbcHeadArmor: undefined,
              preFbcBodyArmor: undefined
            };
            const restored: CharacterSheet = {
              ...c,
              fbcState: newFbcState,
              headArmor: c.fbcState.preFbcHeadArmor ?? c.headArmor,
              bodyArmor: c.fbcState.preFbcBodyArmor ?? c.bodyArmor
            };
            const maxHp = calculateMaxHp(getEffectiveBody(restored), restored.stats?.WILL ?? 0);

            return {
              ...restored,
              currentHp: Math.min(restored.currentHp, maxHp)
            };
          })
        }));
      },

      updateSoloAllocation: (allocation: SoloCombatAwarenessAllocation) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              soloAllocation: allocation
            };
          })
        }));
      },

      adjustImprovementPoints: (deltaIp: number, reason?: string) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return appendIpLog(
              c,
              deltaIp >= 0 ? 'award' : 'adjust',
              deltaIp,
              reason ?? (deltaIp >= 0 ? 'IP otorgados' : 'Ajuste manual')
            );
          })
        }));
      },

      raiseRoleRankWithIp: () => {
        const state = get();
        const character = state.characters.find((c) => c.id === state.activeCharacterId);
        if (!character) return { success: false, message: 'Personaje no encontrado.' };
        const check = checkRoleRankRaise(character.roleRank, character.improvementPoints ?? 0);
        if (!check.ok) return { success: false, message: check.reason ?? 'No se puede subir el rango de rol.' };
        const newRank = character.roleRank + 1;
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.activeCharacterId) return c;
            return {
              ...appendIpLog(c, 'spend_role', -check.cost, `Rango de rol ${newRank} (${check.cost} IP, Core p.410)`),
              roleRank: newRank
            };
          })
        }));
        return { success: true, message: `Rango de rol ${newRank} (-${check.cost} IP).` };
      },

      raiseSkillWithIp: (skill: CombatSkillKey) => {
        const state = get();
        const character = state.characters.find((c) => c.id === state.activeCharacterId);
        if (!character) return { success: false, message: 'Personaje no encontrado.' };
        const meta = SKILL_METADATA[skill];
        const current = character.skills?.[skill] ?? 0;
        const check = checkSkillRaise(current, !!meta.isDoubleCost, character.improvementPoints ?? 0);
        if (!check.ok) return { success: false, message: check.reason ?? 'No se puede subir la skill.' };
        const newLevel = current + 1;
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.activeCharacterId) return c;
            return {
              ...appendIpLog(c, 'spend_skill', -check.cost, `${meta.label} nivel ${newLevel} (${check.cost} IP, Core p.410)`),
              skills: { ...c.skills, [skill]: newLevel }
            };
          })
        }));
        return { success: true, message: `${meta.label} nivel ${newLevel} (-${check.cost} IP).` };
      },

      raiseGeneralSkillWithIp: (key: string, x2: boolean, label: string) => {
        const state = get();
        const character = state.characters.find((c) => c.id === state.activeCharacterId);
        if (!character) return { success: false, message: 'Personaje no encontrado.' };
        const current = character.generalSkills?.[key] ?? 0;
        const check = checkSkillRaise(current, x2, character.improvementPoints ?? 0);
        if (!check.ok) return { success: false, message: check.reason ?? 'No se puede subir la skill.' };
        const newLevel = current + 1;
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.activeCharacterId) return c;
            return {
              ...appendIpLog(c, 'spend_skill', -check.cost, `${label} nivel ${newLevel} (${check.cost} IP, Core p.410)`),
              generalSkills: { ...(c.generalSkills ?? {}), [key]: newLevel }
            };
          })
        }));
        return { success: true, message: `${label} nivel ${newLevel} (-${check.cost} IP).` };
      },

      setGeneralSkill: (key: string, level: number) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              generalSkills: { ...(c.generalSkills ?? {}), [key]: Math.max(0, Math.min(10, level)) }
            };
          })
        }));
      },

      toggleFavoriteSkill: (key: string) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const favs = c.favoriteSkills ?? [];
            return {
              ...c,
              favoriteSkills: favs.includes(key) ? favs.filter((k) => k !== key) : [...favs, key]
            };
          })
        }));
      },

      gmSetRoleRank: (rank: number) => {
        const clamped = Math.max(1, Math.min(10, rank));
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...appendIpLog(c, 'gm', 0, `Modo GM: rango de rol ${clamped}`),
              roleRank: clamped
            };
          })
        }));
      },

      setMakerAllocation: (alloc: MakerAllocation) => {
        set((state) => ({
          characters: state.characters.map((c) => (c.id !== state.activeCharacterId ? c : { ...c, makerAllocation: alloc }))
        }));
      },

      // v4.9.3 [Claude Code · 2026-10-23] Team del Exec (Core p.154).
      addExecTeamMember: (member) => {
        set((state) => ({
          characters: state.characters.map((c) => (c.id !== state.activeCharacterId ? c : { ...c, execTeam: [...(c.execTeam ?? []), member] }))
        }));
      },

      updateExecTeamMember: (memberId, patch) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id !== state.activeCharacterId ? c : { ...c, execTeam: (c.execTeam ?? []).map((m) => (m.id === memberId ? { ...m, ...patch } : m)) }
          )
        }));
      },

      removeExecTeamMember: (memberId) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id !== state.activeCharacterId ? c : { ...c, execTeam: (c.execTeam ?? []).filter((m) => m.id !== memberId) }
          )
        }));
      },

      // Core p.154: la Loyalty no tiene tope durante la sesión (el tope de 10 se aplica al fin de sesión).
      adjustExecMemberLoyalty: (memberId, delta) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id !== state.activeCharacterId ? c : { ...c, execTeam: (c.execTeam ?? []).map((m) => (m.id === memberId ? { ...m, loyalty: m.loyalty + delta } : m)) }
          )
        }));
      },

      adjustExecMemberHp: (memberId, delta) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id !== state.activeCharacterId
              ? c
              : {
                  ...c,
                  execTeam: (c.execTeam ?? []).map((m) =>
                    m.id === memberId ? { ...m, hpCurrent: Math.max(0, Math.min(m.hpMax, m.hpCurrent + delta)) } : m
                  )
                }
          )
        }));
      },

      // Core p.154: reemplazo del mismo puesto con STATs nuevas y Loyalty 1, a cambio de honorarios extra.
      replaceExecTeamMember: (memberId) => {
        const char = get().characters.find((c) => c.id === get().activeCharacterId);
        const old = char?.execTeam?.find((m) => m.id === memberId);
        if (!char || !old) return { success: false, message: 'Team Member no encontrado.' };
        if ((char.eurodollars || 0) < REPLACEMENT_FEE_EB) {
          return { success: false, message: `Fondos insuficientes: el reemplazo cuesta ${REPLACEMENT_FEE_EB} eb.` };
        }
        const fresh = replacementMember(old);
        const newBalance = (char.eurodollars || 0) - REPLACEMENT_FEE_EB;
        const newTx: EurodollarTransaction = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toISOString(),
          concept: `Reemplazo de Team Member (${old.position})`,
          amount: -REPLACEMENT_FEE_EB,
          balanceAfter: newBalance
        };
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id !== char.id
              ? c
              : {
                  ...c,
                  eurodollars: newBalance,
                  transactions: [newTx, ...(c.transactions || [])].slice(0, 50),
                  execTeam: (c.execTeam ?? []).map((m) => (m.id === memberId ? fresh : m))
                }
          )
        }));
        return { success: true, message: `Reemplazo contratado por ${REPLACEMENT_FEE_EB} eb (Loyalty ${fresh.loyalty}).` };
      },

      // Core p.154: al terminar la sesión, tope de Loyalty 10 y renuncia de quien quedó con Loyalty < 0.
      applyEndOfSessionToAll: (onlyIds) => {
        const summary: { characterId: string; handle: string; resigned: string[] }[] = [];
        set((state) => ({
          characters: state.characters.map((c) => {
            if (onlyIds && !onlyIds.includes(c.id)) return c;
            if (!c.execTeam || c.execTeam.length === 0) return c;
            const res = endOfSession(c.execTeam);
            summary.push({ characterId: c.id, handle: c.handle, resigned: res.resigned });
            return { ...c, execTeam: res.team };
          })
        }));
        return summary;
      },

      // Core pp.144-145: grupos de fans del Rockerboy.
      addRockerboyFanGroup: (group) => {
        const entry: RockerboyFanGroup = {
          ...group,
          id: `fan-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          characters: state.characters.map((c) => (c.id !== state.activeCharacterId ? c : { ...c, rockerboyFans: [...(c.rockerboyFans ?? []), entry] }))
        }));
      },

      updateRockerboyFanGroup: (id, patch) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id !== state.activeCharacterId ? c : { ...c, rockerboyFans: (c.rockerboyFans ?? []).map((g) => (g.id === id ? { ...g, ...patch } : g)) }
          )
        }));
      },

      removeRockerboyFanGroup: (id) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id !== state.activeCharacterId ? c : { ...c, rockerboyFans: (c.rockerboyFans ?? []).filter((g) => g.id !== id) }
          )
        }));
      },

      setMedicineAllocation: (alloc: MedicineAllocation) => {
        set((state) => ({
          characters: state.characters.map((c) => (c.id !== state.activeCharacterId ? c : { ...c, medicineAllocation: alloc }))
        }));
      },

      setInterfaceRankOverride: (rank: number) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              interfaceRankOverride: Math.max(0, Math.min(10, rank))
            };
          })
        }));
      },

      updateMartialArtRank: (formId: string, rank: number) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const currentForms = c.knownMartialArts || {};
            const newForms = {
              ...currentForms,
              [formId]: Math.max(0, rank)
            };
            const maxRank = Math.max(0, ...Object.values(newForms));
            return {
              ...c,
              knownMartialArts: newForms,
              skills: {
                ...c.skills,
                martialArts: Math.max(c.skills?.martialArts || 0, maxRank)
              }
            };
          })
        }));
      },

      trainMartialArtWithIp: (formId: string, formName: string) => {
        const state = get();
        const character = state.characters.find((c) => c.id === state.activeCharacterId);
        if (!character) return { success: false, message: 'Personaje no encontrado.' };

        const currentRank = character.knownMartialArts?.[formId] || 0;
        if (currentRank >= 10) {
          return { success: false, message: 'Ya alcanzaste el Rango máximo (10).' };
        }
        const nextRank = currentRank + 1;
        const ipCost = nextRank * 40; // Core Rulebook p. 411 (Coste doble x2)
        const currentIp = character.improvementPoints !== undefined ? character.improvementPoints : 0;

        if (currentIp < ipCost) {
          return {
            success: false,
            message: `IP insuficientes. Necesitas ${ipCost} IP para subir a Rango ${nextRank} (tienes ${currentIp} IP).`
          };
        }

        const newForms = {
          ...(character.knownMartialArts || {}),
          [formId]: nextRank
        };
        const maxRank = Math.max(0, ...Object.values(newForms));

        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.activeCharacterId) return c;
            return {
              ...appendIpLog(c, 'spend_martial', -ipCost, `${formName} rango ${nextRank} (${ipCost} IP, Core p.410)`),
              knownMartialArts: newForms,
              skills: {
                ...c.skills,
                martialArts: Math.max(c.skills?.martialArts || 0, maxRank)
              }
            };
          })
        }));

        return {
          success: true,
          message: `¡Entrenamiento completado! ${formName} subió a Rango ${nextRank} (-${ipCost} IP).`
        };
      },

      buyAndEquipMartialArtChip: (formId: string, formName: string, freeGrant?: boolean) => {
        const state = get();
        const character = state.characters.find((c) => c.id === state.activeCharacterId);
        if (!character) return { success: false, message: 'Personaje no encontrado.' };

        const chipCost = freeGrant ? 0 : 1000;
        if (!freeGrant && character.eurodollars < chipCost) {
          return {
            success: false,
            message: `Saldo insuficiente. Un Skill Chip de Arte Marcial (x2) cuesta 1,000 €$ (tienes ${character.eurodollars} €$).`
          };
        }

        const alreadyOwned = (character.ownedMartialArtChips || []).includes(formId);
        const newOwned = alreadyOwned
          ? (character.ownedMartialArtChips || [])
          : [...(character.ownedMartialArtChips || []), formId];

        const alreadyEquipped = (character.equippedMartialArtChips || []).includes(formId);
        const newEquipped = alreadyEquipped
          ? (character.equippedMartialArtChips || [])
          : [...(character.equippedMartialArtChips || []), formId];

        const chipItem: InventoryItem = {
          id: `chip-${formId}-${Date.now()}`,
          catalogId: `skill-chip-${formId}`,
          name: `Skill Chip: ${formName} (+3)`,
          category: 'gear',
          cost: chipCost,
          quantity: 1,
          details: `Chipware Nivel 3 para ${formName}. Otorga Rango 3 en la habilidad mientras esté insertado en un Chipware Socket.`
        };

        // v4.9.7 [Claude Code · 2026-10-24]: el más nuevo primero y tope de 50, como el resto de las compras.
        const newTx: EurodollarTransaction[] = chipCost > 0 ? [
          {
            id: `tx-${Date.now()}`,
            timestamp: new Date().toISOString(),
            concept: `Compra de Skill Chip: ${formName} (+3)`,
            amount: -chipCost,
            balanceAfter: character.eurodollars - chipCost
          },
          ...(character.transactions || [])
        ].slice(0, 50) : (character.transactions || []);

        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.activeCharacterId) return c;
            return {
              ...c,
              eurodollars: c.eurodollars - chipCost,
              ownedMartialArtChips: newOwned,
              equippedMartialArtChips: newEquipped,
              inventory: [...(c.inventory || []), chipItem],
              transactions: newTx
            };
          })
        }));

        return {
          success: true,
          message: `Skill Chip de ${formName} (+3) ${freeGrant ? 'adquirido' : 'comprado por 1,000 €$'} e insertado en Chipware Socket.`
        };
      },

      toggleEquipMartialArtChip: (formId: string) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const currentEquipped = c.equippedMartialArtChips || [];
            const isEquipped = currentEquipped.includes(formId);
            const newEquipped = isEquipped
              ? currentEquipped.filter((id) => id !== formId)
              : [...currentEquipped, formId];
            return {
              ...c,
              equippedMartialArtChips: newEquipped
            };
          })
        }));
      },

      addVehicleToCharacter: (vehicle: OwnedVehicle) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              vehicles: [...(c.vehicles || []), vehicle]
            };
          })
        }));
      },

      updateVehicleSdp: (instanceId: string, deltaSdp: number) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              vehicles: (c.vehicles || []).map((v) => {
                if (v.instanceId !== instanceId) return v;
                const newSdp = Math.max(0, Math.min(v.maxSdp, v.currentSdp + deltaSdp));
                return { ...v, currentSdp: newSdp };
              })
            };
          })
        }));
      },

      updateVehicleArmorSp: (instanceId: string, deltaSp: number) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              vehicles: (c.vehicles || []).map((v) => {
                if (v.instanceId !== instanceId) return v;
                const newSp = Math.max(0, v.armorSp + deltaSp);
                return { ...v, armorSp: newSp };
              })
            };
          })
        }));
      },

      removeVehicleFromCharacter: (instanceId: string) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              vehicles: (c.vehicles || []).filter((v) => v.instanceId !== instanceId)
            };
          })
        }));
      },

      updateMedtechLab: (lab: MedtechCryoAndPharma) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              medtechLab: lab
            };
          })
        }));
      },

      updateTechProjects: (projects: TechMakerProject[]) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            return {
              ...c,
              techProjects: projects
            };
          })
        }));
      },

      loadCemk2077PartyRoster: () => {
        set((state) => {
          const cemkChars = buildCemk2077Characters();
          const existingHandles = new Set(state.characters.map((c) => c.handle.toLowerCase()));
          const toAdd = cemkChars.filter((c) => !existingHandles.has(c.handle.toLowerCase()));
          const newCharacters = [...state.characters, ...toAdd];
          const david = newCharacters.find((c) => c.handle.toLowerCase().includes('david martinez'));
          return {
            characters: newCharacters,
            activeCharacterId: state.activeCharacterId || (david ? david.id : newCharacters[0]?.id) || ''
          };
        });
      },

      syncOrRestoreCemkFolioCharacters: () => {
        set((state) => {
          const folioMap = new Map(CEMK_FOLIO_PREMADE_CHARACTERS.map((f) => [f.id, f]));
          const updatedChars: CharacterSheet[] = [];
          const processedFolioIds = new Set<string>();

          for (const c of state.characters) {
            if (folioMap.has(c.id)) {
              // Restore fresh template copy from canon data
              updatedChars.push({ ...folioMap.get(c.id)! });
              processedFolioIds.add(c.id);
            } else {
              updatedChars.push(c);
            }
          }

          // Inject any missing Folios
          for (const folio of CEMK_FOLIO_PREMADE_CHARACTERS) {
            if (!processedFolioIds.has(folio.id)) {
              updatedChars.push({ ...folio });
            }
          }

          return {
            characters: updatedChars
          };
        });
      }
    }),
    {
      name: CHARACTERS_STORAGE_KEY,
      storage: safeCharacterStorage,
      // Versión del esquema persistido. Al cambiar la forma de los datos, subir el número y agregar su migración en persistence.ts (MIGRATIONS).
      // v0 -> v1: solo agrega campos opcionales (deathSavePenalty, isDead, preFbc*Armor); no hace falta transformar.
      version: CHARACTERS_SCHEMA_VERSION,
      migrate: (persistedState: unknown, persistedVersion: number) => {
        backupRawBeforeMigration(persistedVersion);
        const { state, warnings } = runMigrations(persistedState, persistedVersion);
        warnings.forEach(emitPersistenceWarning);
        return state as CharacterStoreState;
      },
      merge: (persistedState: unknown, currentState: CharacterStoreState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }
        const p = persistedState as Partial<CharacterStoreState>;
        const persistedChars: CharacterSheet[] = Array.isArray(p.characters) ? p.characters : [];

        // Auto-inyección automática en localStorage existente:
        // Asegura la presencia inmutable de los 7 Folios Oficiales CEMK 2077 sin sobreescribir fichas de usuario
        // (salvo los premades que el usuario descartó a propósito: dismissedPremadeIds)
        const dismissedPremadeIds = Array.isArray(p.dismissedPremadeIds) ? p.dismissedPremadeIds : [];

        // Ensure the 7 CEMK 2077 anime crew characters are present in characters roster
        const sanitizedCharacters = injectPremades(
          persistedChars,
          dismissedPremadeIds,
          CEMK_FOLIO_PREMADE_CHARACTERS,
          buildCemk2077Characters()
        );

        const validActiveId = p.activeCharacterId && sanitizedCharacters.some((c) => c.id === p.activeCharacterId)
          ? p.activeCharacterId
          : sanitizedCharacters.find((c) => c.id === 'cemk-folio-hardpoint')?.id || sanitizedCharacters[0]?.id || currentState.activeCharacterId;

        return {
          ...currentState,
          ...p,
          dismissedPremadeIds,
          characters: sanitizedCharacters.length > 0 ? sanitizedCharacters : currentState.characters,
          activeCharacterId: validActiveId
        };
      }
    }
  )
);
