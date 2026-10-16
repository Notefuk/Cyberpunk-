import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ActiveCriticalInjury,
  ArmorItem,
  CharacterSheet,
  CombatSkillKey,
  EquippedWeapon,
  EurodollarTransaction,
  InventoryItem,
  StatKey,
  WeaponItem
} from '../types/cyberpunk';
import { calculateMaxHp } from '../engine/characterEngine';
import { calculateArmorAblation } from '../engine/combatEngine';
import { rollCriticalInjury } from '../data/criticalInjuries';

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
      notes: 'Hoja afilada de combate cuerpo a cuerpo. Halves defender SP.'
    }
  ],
  installedCyberwareIds: ['neuralware-processor', 'cybereye', 'subdermal-armor'],
  activeInjuries: [],
  eurodollars: 2450,
  inventory: [],
  transactions: []
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
      notes: 'Cuchillo de emergencia de acero monomolecular.'
    }
  ],
  installedCyberwareIds: ['neuralware-processor', 'interface-plugs'],
  activeInjuries: [],
  eurodollars: 3800,
  inventory: [],
  transactions: []
};

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
  equipWeaponFromCatalog: (weapon: WeaponItem) => void;
  unequipWeapon: (weaponInstanceId: string) => void;
  equipArmorFromCatalog: (armor: ArmorItem, location: 'head' | 'body' | 'both') => void;
  toggleCyberwareInstall: (cyberwareId: string, humanityCostAvg?: number) => void;
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
  addEurodollarTransaction: (concept: string, amount: number) => void;
}

export const useCharacterStore = create<CharacterStoreState>()(
  persist(
    (set, get) => ({
      characters: [INITIAL_CHARACTER_V, INITIAL_CHARACTER_KIWI],
      activeCharacterId: INITIAL_CHARACTER_V.id,

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
          transactions: []
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
              equippedWeapons: c.equippedWeapons.map(w =>
                w.instanceId === weaponInstanceId
                  ? { ...w, currentMag: w.standardMag || 0 }
                  : w
              )
            };
          })
        }));
      },

      equipWeaponFromCatalog: (weapon: WeaponItem) => {
        const equipped: EquippedWeapon = {
          ...weapon,
          instanceId: `wep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          currentMag: weapon.standardMag || 0,
          loadedAmmoType: weapon.ammoType || 'Standard'
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

      inflictRandomInjury: (location: 'head' | 'body') => {
        const rolled = rollCriticalInjury(location);
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
                loadedAmmoType: item.ammoType || 'Standard'
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
              const qtyToAdd = category === 'ammunition' ? 10 : 1;
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
      }
    }),
    {
      name: 'cpr-omni-deck-characters-v2'
    }
  )
);
