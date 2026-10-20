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
  EncumbranceMode,
  EquippedWeapon,
  EurodollarTransaction,
  InventoryItem,
  MedtechCryoAndPharma,
  OwnedVehicle,
  SoloCombatAwarenessAllocation,
  StatKey,
  TechMakerProject,
  TechWeaponUpgradeType,
  WeaponItem
} from '../types/cyberpunk';
import { calculateMaxHp, getEffectiveBody } from '../engine/characterEngine';
import { calculateArmorAblation } from '../engine/combatEngine';
import { rollCriticalInjury } from '../data/criticalInjuries';
import {
  PREGEN_TEMPLATES,
  buildCharacterSheetFromPregen as instantiatePregenCharacter
} from '../data/characterCreationData';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../data/cemkFolioPremadesData';
import {
  WEAPON_ATTACHMENTS_CATALOG,
  calculateModifiedMagazineSize
} from '../data/weaponAttachmentsAndTechData';

function mapInjuryIcon(icon: string): ActiveCriticalInjury['iconType'] {
  if (icon === 'heart' || icon === 'throat') return 'organ';
  if (icon === 'muscle') return 'limb';
  if (['skull', 'brain', 'eye', 'bone', 'limb', 'organ', 'ear'].includes(icon)) {
    return icon as ActiveCriticalInjury['iconType'];
  }
  return 'skull';
}

export const INITIAL_CHARACTER_V: CharacterSheet = {
  id: 'char-v-solo',
  handle: 'V (Valerie)',
  role: 'Solo',
  roleRank: 4,
  notes: 'Solo táctico de Night City. Especialista en combate urbano, asalto con armas automáticas y armas pesadas.',
  stats: {
    INT: 6,
    REF: 8,
    DEX: 7,
    TECH: 5,
    COOL: 7,
    WILL: 8,
    LUCK: 7,
    MOVE: 7,
    BODY: 8,
    EMP: 6
  },
  currentHp: 50, // calculateMaxHp(8, 8) = 10 + 5 * Math.ceil(16/2) = 50
  currentLuck: 7,
  currentHumanity: 52,
  headArmor: {
    name: 'Light Armorjack (Head)',
    maxSp: 11,
    currentSp: 11,
    penalty: 0
  },
  bodyArmor: {
    name: 'Light Armorjack (Body)',
    maxSp: 11,
    currentSp: 11,
    penalty: 0
  },
  skills: {
    handgun: 6,
    shoulderArms: 6,
    autofire: 4,
    heavyWeapons: 2,
    archery: 0,
    meleeWeapon: 5,
    brawling: 4,
    martialArts: 2,
    evasion: 6,
    athletics: 4,
    firstAid: 3,
    paramedic: 1,
    cybertech: 2,
    perception: 5,
    concentration: 4,
    resistTortureDrugs: 4
  },
  equippedWeapons: [
    {
      id: 'heavy-pistol',
      instanceId: 'wep-v-1-hp',
      name: 'Heavy Pistol',
      type: 'Ranged',
      skill: 'Handgun',
      damage: '3d6',
      rof: 2,
      hands: 1,
      concealable: true,
      cost: 100,
      costTier: 'Premium',
      standardMag: 8,
      currentMag: 8,
      ammoType: 'Heavy Pistol',
      loadedAmmoType: 'Heavy Pistol',
      inHand: true,
      reserveAmmo: 48,
      notes: 'Pistola pesada estándar de gran poder de detención.'
    },
    {
      id: 'assault-rifle',
      instanceId: 'wep-v-2-ar',
      name: 'Assault Rifle',
      type: 'Ranged',
      skill: 'Shoulder Arms',
      damage: '5d6',
      rof: 1,
      hands: 2,
      concealable: false,
      cost: 500,
      costTier: 'Expensive',
      standardMag: 25,
      currentMag: 25,
      ammoType: 'Rifle',
      loadedAmmoType: 'Rifle',
      altFireModes: 'Autofire (4), Suppressive Fire',
      autofireMaxMult: 4,
      inHand: true,
      reserveAmmo: 48,
      notes: 'Fusil de asalto militar versátil con selector de Fuego Automático x4.'
    },
    {
      id: 'heavy-smg',
      instanceId: 'wep-v-3-smg',
      name: 'Heavy SMG',
      type: 'Ranged',
      skill: 'Handgun',
      damage: '3d6',
      rof: 1,
      hands: 1,
      concealable: false,
      cost: 100,
      costTier: 'Premium',
      standardMag: 40,
      currentMag: 40,
      ammoType: 'Heavy Pistol',
      loadedAmmoType: 'Heavy Pistol',
      altFireModes: 'Autofire (3), Suppressive Fire',
      autofireMaxMult: 3,
      inHand: false,
      reserveAmmo: 48,
      notes: 'Subfusil pesado con cargador extendido y modo Autofire x3.'
    },
    {
      id: 'medium-melee',
      instanceId: 'wep-v-4-katana',
      name: 'Medium Melee Weapon (Katana)',
      type: 'Melee',
      skill: 'Melee Weapon',
      damage: '2d6',
      rof: 2,
      hands: 1,
      concealable: false,
      cost: 50,
      costTier: 'Costly',
      standardMag: 0,
      currentMag: 0,
      ammoType: 'N/A',
      loadedAmmoType: 'N/A',
      inHand: false,
      reserveAmmo: 0,
      notes: 'Hoja afilada de combate cuerpo a cuerpo. Halves defender SP.'
    }
  ],
  installedCyberwareIds: ['neuralware-processor', 'cybereye', 'subdermal-armor'],
  activeInjuries: [],
  eurodollars: 2450,
  inventory: [],
  transactions: [],
  unarmedInHand: { brawling: true, martialArts: false },
  activeDrugs: [],
  improvementPoints: 120,
  knownMartialArts: { karate: 2 },
  ownedMartialArtChips: [],
  equippedMartialArtChips: []
};

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
  ...CEMK_FOLIO_PREMADE_CHARACTERS,
  INITIAL_CHARACTER_V,
  ...buildCemk2077Characters()
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
    activeCharacterId: hardpoint?.id || deduped[0]?.id || INITIAL_CHARACTER_V.id
  };
}

export interface CharacterStoreState {
  characters: CharacterSheet[];
  activeCharacterId: string;

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
  ablateArmor: (location: 'head' | 'body', amount?: number) => void;
  repairArmor: (location: 'head' | 'body') => void;
  applyIncomingDamage: (damage: number, location: 'head' | 'body', critBonusDamage?: number) => { hpLost: number; spAblated: number };
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
  inflictRandomInjury: (location: 'head' | 'body') => ActiveCriticalInjury;
  toggleTreatInjury: (injuryId: string) => void;
  removeInjury: (injuryId: string) => void;
  exportActiveCharacterJson: () => string;
  importCharacterJson: (jsonStr: string) => boolean;
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
  setEncumbranceMode: (mode: EncumbranceMode, characterId?: string) => void;
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
    moveOverride: number;
    baseArmorSp: number;
    humanityCost: number;
    immunities: string[];
  }) => void;
  deactivateFullBodyConversion: () => void;

  // Solo Combat Awareness
  updateSoloAllocation: (allocation: SoloCombatAwarenessAllocation) => void;

  // Improvement Points (IP) & Interface Override
  adjustImprovementPoints: (deltaIp: number) => void;
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
      appTheme:
        (typeof window !== 'undefined'
          ? (localStorage.getItem('cpr_app_theme_v1') as AppThemeId)
          : null) || 'neo_red',

      getActiveCharacter: () => {
        const state = get();
        const found = state.characters.find(c => c.id === state.activeCharacterId);
        return found || state.characters[0] || INITIAL_CHARACTER_V;
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
          if (remaining.length === 0) {
            remaining.push(INITIAL_CHARACTER_V);
          }
          const newActive = state.activeCharacterId === id ? remaining[0].id : state.activeCharacterId;
          return {
            characters: remaining,
            activeCharacterId: newActive
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
        const clampedVal = Math.max(0, value);
        set(state => ({
          characters: state.characters.map(char => {
            if (char.id !== state.activeCharacterId) return char;

            const newStats = { ...char.stats, [stat]: clampedVal };
            let newCurrentHp = char.currentHp;
            let newCurrentLuck = char.currentLuck;

            if (stat === 'BODY' || stat === 'WILL') {
              const maxHp = calculateMaxHp(newStats.BODY, newStats.WILL);
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
        set(state => ({
          characters: state.characters.map(char => {
            if (char.id !== state.activeCharacterId) return char;
            const maxHp = calculateMaxHp(char.stats.BODY, char.stats.WILL);
            const nextHp = Math.max(0, Math.min(maxHp, char.currentHp + delta));
            return { ...char, currentHp: nextHp };
          })
        }));
      },

      setHp: (hp: number) => {
        set(state => ({
          characters: state.characters.map(char => {
            if (char.id !== state.activeCharacterId) return char;
            const maxHp = calculateMaxHp(char.stats.BODY, char.stats.WILL);
            const nextHp = Math.max(0, Math.min(maxHp, hp));
            return { ...char, currentHp: nextHp };
          })
        }));
      },

      ablateArmor: (location: 'head' | 'body', amount = 1) => {
        set(state => ({
          characters: state.characters.map(char => {
            if (char.id !== state.activeCharacterId) return char;
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

      applyIncomingDamage: (damage: number, location: 'head' | 'body', critBonusDamage = 0) => {
        const char = get().getActiveCharacter();
        const armor = location === 'head' ? char.headArmor : char.bodyArmor;
        const result = calculateArmorAblation(damage, armor.currentSp, char.currentHp, critBonusDamage);

        const hpLost = char.currentHp - result.newHp;
        const spAblated = armor.currentSp - result.newSp;

        set(state => ({
          characters: state.characters.map(c => {
            if (c.id !== state.activeCharacterId) return c;
            const updatedArmor = {
              ...(location === 'head' ? c.headArmor : c.bodyArmor),
              currentSp: result.newSp
            };
            return {
              ...c,
              currentHp: result.newHp,
              headArmor: location === 'head' ? updatedArmor : c.headArmor,
              bodyArmor: location === 'body' ? updatedArmor : c.bodyArmor
            };
          })
        }));

        return { hpLost, spAblated };
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
        if (!weapon || weapon.currentMag < amount) {
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
          loadedAmmoType: weapon.ammoType || 'Standard',
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
                concept: `Reparación de Blindaje (${location})`,
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
            const effBody = getEffectiveBody(c);
            const mult = (hasEnhancedAntibodies ? 2 : 1) + (inCryotank ? 1 : 0);
            const healAmount = Math.max(1, effBody) * mult * Math.max(1, days);
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
              return {
                ...c,
                installedCyberwareIds: c.installedCyberwareIds.filter(id => id !== cyberwareId),
                currentHumanity: Math.min(c.stats.EMP * 10, c.currentHumanity + humanityCostAvg)
              };
            } else {
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

            const updatedCyberwareIds = c.installedCyberwareIds.includes(cyberwareId)
              ? c.installedCyberwareIds
              : [...c.installedCyberwareIds, cyberwareId];

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
            const maxHumanity = c.stats.EMP * 10;
            return {
              ...c,
              installedCyberwareIds: c.installedCyberwareIds.filter((id) => id !== cyberwareId),
              currentHumanity: Math.min(maxHumanity, c.currentHumanity + humanityRefundAmount)
            };
          })
        }));
      },

      adjustHumanity: (delta: number) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const maxHumanity = c.stats.EMP * 10;
            return {
              ...c,
              currentHumanity: Math.max(0, Math.min(maxHumanity, c.currentHumanity + delta))
            };
          })
        }));
      },

      inflictRandomInjury: (location: 'head' | 'body') => {
        const active = get().characters.find(c => c.id === get().activeCharacterId);
        const currentNames = (active?.activeInjuries ?? []).filter(i => !i.isTreated).map(i => i.name);
        const rolled = rollCriticalInjury(location, currentNames);
        const newInjury: ActiveCriticalInjury = {
          id: `injury-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: rolled.name,
          location: rolled.location,
          effect: rolled.effect,
          quickFixDv: rolled.quickFix,
          treatmentDv: rolled.treatment,
          iconType: mapInjuryIcon(rolled.iconType),
          modifiers: rolled.modifiers,
          isTreated: false
        };

        set(state => ({
          characters: state.characters.map(c =>
            c.id === state.activeCharacterId
              ? {
                  ...c,
                  activeInjuries: [...c.activeInjuries, newInjury]
                }
              : c
          )
        }));

        return newInjury;
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
          const parsed = JSON.parse(jsonStr) as CharacterSheet;
          if (!parsed || typeof parsed !== 'object') return false;
          if (!parsed.id || !parsed.handle || !parsed.stats || !parsed.skills) return false;

          set(state => {
            const existingIndex = state.characters.findIndex(c => c.id === parsed.id);
            let updatedList: CharacterSheet[];
            if (existingIndex >= 0) {
              updatedList = [...state.characters];
              updatedList[existingIndex] = parsed;
            } else {
              updatedList = [...state.characters, parsed];
            }
            return {
              characters: updatedList,
              activeCharacterId: parsed.id
            };
          });
          return true;
        } catch {
          return false;
        }
      },

      purchaseOrAcquireItem: ({ item, category, spendMoney, autoEquip = true, armorLocation = 'both' }) => {
        const char = get().getActiveCharacter();
        const cost = Number(item.cost || 0);

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
                loadedAmmoType: item.ammoType || 'Standard',
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
              if (!updatedCyberwareIds.includes(item.id)) {
                updatedCyberwareIds.push(item.id);
                const parsedHl = item.humanityLoss ? parseInt(String(item.humanityLoss).replace(/\D/g, '')) || 7 : 7;
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
              amount,
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

      setEncumbranceMode: (mode: EncumbranceMode, characterId?: string) => {
        set((state) => {
          const targetId = characterId || state.activeCharacterId;
          return {
            characters: state.characters.map((c) =>
              c.id === targetId ? { ...c, encumbranceMode: mode } : c
            )
          };
        });
      },

      gmUpdateCharacterVitals: (characterId, patch) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;

            const maxHp = calculateMaxHp(c.stats?.BODY ?? 0, c.stats?.WILL ?? 0);
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
              updatedEurodollars = Math.max(0, updatedEurodollars + patch.eurodollarsDelta);
              const newTx: EurodollarTransaction = {
                id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toISOString(),
                concept: patch.concept || (patch.eurodollarsDelta > 0 ? 'GM Grant (€$)' : 'GM Deduct (€$)'),
                amount: patch.eurodollarsDelta,
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
        moveOverride: number;
        baseArmorSp: number;
        humanityCost: number;
        immunities: string[];
      }) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;

            const wasAlreadyFbc = Boolean(c.fbcState?.isFullBodyConversion);
            const humanityCost = wasAlreadyFbc ? 0 : (chassis.humanityCost ?? 0);
            const newHumanity = Math.max(0, (c.currentHumanity ?? 0) - humanityCost);

            const oldMaxHp = calculateMaxHp(getEffectiveBody(c), c.stats?.WILL ?? 0);

            const newFbcState: ActiveFbcState = {
              isFullBodyConversion: true,
              hasBiopod: true,
              activeChassisId: chassis.id,
              activeChassisName: chassis.name,
              bodyOverride: chassis.bodyOverride,
              moveOverride: chassis.moveOverride,
              baseArmorSp: chassis.baseArmorSp,
              immunities: chassis.immunities || []
            };

            const updatedCharTemp: CharacterSheet = {
              ...c,
              fbcState: newFbcState,
              stats: {
                ...c.stats,
                BODY: Math.max(c.stats?.BODY ?? 0, chassis.bodyOverride),
                MOVE: chassis.moveOverride
              }
            };

            const newMaxHp = calculateMaxHp(getEffectiveBody(updatedCharTemp), updatedCharTemp.stats?.WILL ?? 0);
            const hpDiff = newMaxHp - oldMaxHp;
            const newHp = Math.max(1, (c.currentHp ?? 0) + (hpDiff > 0 ? hpDiff : 0));

            let headArmor = c.headArmor;
            let bodyArmor = c.bodyArmor;

            if (chassis.baseArmorSp > 0) {
              if (!headArmor || chassis.baseArmorSp > headArmor.maxSp) {
                headArmor = {
                  name: `${chassis.name} Chassis Plating (Head)`,
                  maxSp: chassis.baseArmorSp,
                  currentSp: chassis.baseArmorSp,
                  penalty: 0
                };
              }
              if (!bodyArmor || chassis.baseArmorSp > bodyArmor.maxSp) {
                bodyArmor = {
                  name: `${chassis.name} Chassis Plating (Body)`,
                  maxSp: chassis.baseArmorSp,
                  currentSp: chassis.baseArmorSp,
                  penalty: 0
                };
              }
            }

            return {
              ...updatedCharTemp,
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
              isFullBodyConversion: false
            };

            return {
              ...c,
              fbcState: newFbcState
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

      adjustImprovementPoints: (deltaIp: number) => {
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.activeCharacterId) return c;
            const currentIp = c.improvementPoints !== undefined ? c.improvementPoints : 120;
            return {
              ...c,
              improvementPoints: Math.max(0, currentIp + deltaIp)
            };
          })
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
        const currentIp = character.improvementPoints !== undefined ? character.improvementPoints : 120;

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
              ...c,
              improvementPoints: currentIp - ipCost,
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

        const newTx: EurodollarTransaction[] = chipCost > 0 ? [
          ...(character.transactions || []),
          {
            id: `tx-${Date.now()}`,
            timestamp: new Date().toISOString(),
            concept: `Compra de Skill Chip: ${formName} (+3)`,
            amount: -chipCost,
            balanceAfter: character.eurodollars - chipCost
          }
        ] : (character.transactions || []);

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
      name: 'cpr-omni-deck-characters-v2',
      merge: (persistedState: unknown, currentState: CharacterStoreState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }
        const p = persistedState as Partial<CharacterStoreState>;
        const persistedChars: CharacterSheet[] = Array.isArray(p.characters) ? p.characters : [];

        // Auto-inyección automática en localStorage existente:
        // Asegura la presencia inmutable de los 7 Folios Oficiales CEMK 2077 sin sobreescribir fichas de usuario
        const mergedCharacters = [...persistedChars];
        const existingIds = new Set(mergedCharacters.map((c) => c.id));

        for (const folio of CEMK_FOLIO_PREMADE_CHARACTERS) {
          if (!existingIds.has(folio.id)) {
            mergedCharacters.push({ ...folio });
            existingIds.add(folio.id);
          }
        }

        // Ensure the 7 CEMK 2077 anime crew characters are present in characters roster
        const cemkChars = buildCemk2077Characters();
        const existingHandles = new Set(mergedCharacters.map((c) => c.handle.toLowerCase()));

        for (const cemk of cemkChars) {
          if (!existingHandles.has(cemk.handle.toLowerCase())) {
            mergedCharacters.push(cemk);
            existingHandles.add(cemk.handle.toLowerCase());
          }
        }

        const sanitizedCharacters = mergedCharacters.map((c) => {
          const updated = { ...c };
          if (updated.improvementPoints === undefined) {
            updated.improvementPoints = 120;
          }
          if ((updated.skills?.martialArts || 0) > 0 && (!updated.knownMartialArts || Object.keys(updated.knownMartialArts).length === 0)) {
            updated.knownMartialArts = { karate: updated.skills.martialArts };
          }
          if (!updated.ownedMartialArtChips) {
            updated.ownedMartialArtChips = [];
          }
          if (!updated.equippedMartialArtChips) {
            updated.equippedMartialArtChips = [];
          }
          return updated;
        });

        const validActiveId = p.activeCharacterId && sanitizedCharacters.some((c) => c.id === p.activeCharacterId)
          ? p.activeCharacterId
          : sanitizedCharacters.find((c) => c.id === 'cemk-folio-hardpoint')?.id || sanitizedCharacters[0]?.id || currentState.activeCharacterId;

        return {
          ...currentState,
          ...p,
          characters: sanitizedCharacters.length > 0 ? sanitizedCharacters : currentState.characters,
          activeCharacterId: validActiveId
        };
      }
    }
  )
);
