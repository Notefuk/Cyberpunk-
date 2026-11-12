export interface RangeBracket {
  range: string;
  minM: number;
  maxM: number;
  label: string;
}

export const RANGE_BRACKETS: RangeBracket[] = [
  { range: '0-6m', minM: 0, maxM: 6, label: '0 a 6m (A quemarropa)' },
  { range: '7-12m', minM: 7, maxM: 12, label: '7 a 12m (Corta)' },
  { range: '13-25m', minM: 13, maxM: 25, label: '13 a 25m (Media)' },
  { range: '26-50m', minM: 26, maxM: 50, label: '26 a 50m (Larga)' },
  { range: '51-100m', minM: 51, maxM: 100, label: '51 a 100m (Muy Larga)' },
  { range: '101-200m', minM: 101, maxM: 200, label: '101 a 200m (Extrema)' },
  { range: '201-400m', minM: 201, maxM: 400, label: '201 a 400m (Francotirador)' },
  { range: '401-800m', minM: 401, maxM: 800, label: '401 a 800m (Máxima)' }
];

export interface WeaponRangeProfile {
  name: string;
  dvs: Record<string, number | null>; // null means N/A (out of range)
  autofireDvs?: Record<string, number | null>;
  autofireMaxMultiplier?: number;
}

export const WEAPON_RANGE_PROFILES: Record<string, WeaponRangeProfile> = {
  pistol: {
    name: 'Pistol (Medium, Heavy, Very Heavy)',
    dvs: {
      '0-6m': 13,
      '7-12m': 15,
      '13-25m': 20,
      '26-50m': 25,
      '51-100m': 30,
      '101-200m': 30,
      '201-400m': null,
      '401-800m': null
    }
  },
  smg: {
    name: 'SMG / Heavy SMG',
    dvs: {
      '0-6m': 15,
      '7-12m': 13, // Sweet spot
      '13-25m': 15,
      '26-50m': 20,
      '51-100m': 25,
      '101-200m': 25,
      '201-400m': 30,
      '401-800m': null
    },
    autofireDvs: {
      '0-6m': 20,
      '7-12m': 17, // Sweet spot
      '13-25m': 20,
      '26-50m': 25,
      '51-100m': 30
    },
    autofireMaxMultiplier: 3
  },
  shotgun_slug: {
    name: 'Shotgun (Slug)',
    dvs: {
      '0-6m': 13,
      '7-12m': 15,
      '13-25m': 20,
      '26-50m': 25,
      '51-100m': 30,
      '101-200m': 35,
      '201-400m': null,
      '401-800m': null
    }
  },
  shotgun_shell: {
    name: 'Shotgun (Shell spread)',
    dvs: {
      '0-6m': 13, // Flat DV 13 in a 6x6m zone
      '7-12m': null,
      '13-25m': null,
      '26-50m': null,
      '51-100m': null,
      '101-200m': null,
      '201-400m': null,
      '401-800m': null
    }
  },
  assault_rifle: {
    name: 'Assault Rifle',
    dvs: {
      '0-6m': 17,
      '7-12m': 16,
      '13-25m': 15,
      '26-50m': 13, // Sweet spot!
      '51-100m': 15,
      '101-200m': 20,
      '201-400m': 25,
      '401-800m': 30
    },
    autofireDvs: {
      '0-6m': 22,
      '7-12m': 20,
      '13-25m': 17, // Sweet spot!
      '26-50m': 20,
      '51-100m': 25
    },
    autofireMaxMultiplier: 4
  },
  sniper_rifle: {
    name: 'Sniper Rifle',
    dvs: {
      '0-6m': 30,
      '7-12m': 25,
      '13-25m': 25,
      '26-50m': 20,
      '51-100m': 15, // Sweet spot!
      '101-200m': 16,
      '201-400m': 17,
      '401-800m': 20
    }
  },
  bow: {
    name: 'Bows & Crossbows',
    dvs: {
      '0-6m': 15,
      '7-12m': 13, // Sweet spot
      '13-25m': 15,
      '26-50m': 17,
      '51-100m': 20,
      '101-200m': 22,
      '201-400m': null,
      '401-800m': null
    }
  },
  grenade_launcher: {
    name: 'Grenade Launcher',
    dvs: {
      '0-6m': 16,
      '7-12m': 15,
      '13-25m': 15,
      '26-50m': 17,
      '51-100m': 20,
      '101-200m': 22,
      '201-400m': 25,
      '401-800m': null
    }
  },
  rocket_launcher: {
    name: 'Rocket Launcher',
    dvs: {
      '0-6m': 17,
      '7-12m': 16,
      '13-25m': 15,
      '26-50m': 15,
      '51-100m': 20,
      '101-200m': 20,
      '201-400m': 25,
      '401-800m': 30
    }
  }
};

export function getWeaponProfileKey(weaponName: string, weaponType: string): string | null {
  if (weaponType === 'Melee') return null;
  const lower = weaponName.toLowerCase();
  if (lower.includes('sniper')) return 'sniper_rifle';
  if (lower.includes('assault')) return 'assault_rifle';
  if (lower.includes('shotgun')) return 'shotgun_slug';
  if (lower.includes('smg')) return 'smg';
  if (lower.includes('pistol')) return 'pistol';
  if (lower.includes('bow') || lower.includes('crossbow')) return 'bow';
  if (lower.includes('grenade')) return 'grenade_launcher';
  if (lower.includes('rocket')) return 'rocket_launcher';
  return 'pistol'; // default fallback
}

/**
 * v5.25.0 (plan 30): tablas expandidas de Solo of Fortune 2045, Interface RED Vol. 5 p.113
 * ("Expanded Single Shot DVs based on Range"). Solo las usan las armas que traen `rangeTable` en el pack;
 * las armas del Core siguen con su tabla (Core p.173). [Claude Code · 2026-11-12]
 */
const IR5_SINGLE_SHOT: Record<string, [string, (number | null)[]]> = {
  snubnose_pistol: ['Snubnose Pistol', [12, 14, 20, 26, 35, null, null, null]],
  pistol: ['Pistol', [13, 15, 20, 25, 30, 35, null, null]],
  long_barrel_pistol: ['Long Barrel Pistol', [15, 13, 14, 19, 20, 22, 30, null]],
  subcompact_smg: ['Subcompact SMG', [13, 13, 14, 21, 27, 30, null, null]],
  smg: ['SMG', [15, 13, 15, 20, 25, 25, 30, null]],
  short_barrel_shotgun: ['Short Barrel Shotgun', [12, 14, 23, 27, 32, null, null, null]],
  shotgun: ['Shotgun', [13, 15, 20, 25, 30, 35, null, null]],
  long_barrel_shotgun: ['Long Barrel Shotgun', [14, 16, 15, 18, 25, 28, null, null]],
  carbine: ['Carbine', [16, 15, 13, 15, 20, 25, 30, null]],
  assault_rifle: ['Assault Rifle', [17, 16, 15, 13, 15, 20, 25, 30]],
  battle_rifle: ['Battle Rifle', [18, 16, 16, 14, 14, 19, 24, 29]],
  marksman_rifle: ['Marksman Rifle', [20, 18, 17, 15, 14, 18, 21, 27]],
  scout_rifle: ['Scout Rifle', [21, 20, 19, 18, 17, 17, 19, 24]],
  sniper_rifle: ['Sniper Rifle', [30, 25, 25, 20, 15, 16, 17, 20]],
  anti_materiel_rifle: ['Anti-materiel Rifle', [30, 30, 28, 22, 15, 15, 16, 17]],
  shortbow: ['Shortbow', [13, 14, 16, 21, 22, null, null, null]],
  bow: ['Bow', [15, 13, 15, 17, 20, 22, null, null]],
  longbow: ['Longbow', [17, 15, 13, 15, 17, 20, 22, null]],
  grenade_launcher: ['Grenade Launcher', [16, 15, 15, 17, 20, 22, 25, null]],
  rocket_launcher: ['Rocket Launcher', [17, 16, 15, 15, 20, 20, 25, 30]],
  missile_launcher: ['Missile Launcher', [30, 25, 25, 20, 17, 20, 20, 20]],
};

/** IR5 p.113, "Expanded Autofire DVs based on Range" (0 a 100 m). SMG y Assault Rifle son los del Core p.173. */
export type AutofireTableId = 'machine_pistol' | 'smg' | 'assault_rifle' | 'machine_gun';
export const AUTOFIRE_TABLES: Record<AutofireTableId, { name: string; dvs: number[] }> = {
  machine_pistol: { name: 'Machine Pistol', dvs: [17, 20, 22, 27, 30] },
  smg: { name: 'SMG', dvs: [20, 17, 20, 25, 30] },
  assault_rifle: { name: 'Assault Rifle', dvs: [22, 20, 17, 20, 25] },
  machine_gun: { name: 'Machine Gun', dvs: [21, 18, 18, 19, 25] },
};

for (const [key, [name, dvs]] of Object.entries(IR5_SINGLE_SHOT)) {
  WEAPON_RANGE_PROFILES[`ir5_${key}`] = {
    name: `${name} (IR5 p.113)`,
    dvs: Object.fromEntries(RANGE_BRACKETS.map((b, i) => [b.range, dvs[i] ?? null])),
  };
}

/** Lee "Autofire (Machine Gun 5)", "Autofire (SMG 4)" o "Autofire (4)" (Core). */
export function parseAutofireMode(altFireModes: string | undefined): { table: AutofireTableId | null; max: number } | null {
  const m = /Autofire\s*\((?:\s*(Machine Pistol|Machine Gun|SMG|Assault Rifle)\s*)?(\d+)\)/i.exec(altFireModes ?? '');
  if (!m) return null;
  const label = (m[1] ?? '').toLowerCase();
  const table: AutofireTableId | null =
    label === 'machine pistol' ? 'machine_pistol'
    : label === 'machine gun' ? 'machine_gun'
    : label === 'smg' ? 'smg'
    : label === 'assault rifle' ? 'assault_rifle'
    : null;
  return { table, max: Number(m[2]) };
}

interface RangeWeaponLike {
  name: string;
  type: string;
  rangeTable?: string;
  altFireModes?: string;
}

/**
 * Tabla de rango de un arma: la que trae en `rangeTable` (IR5) o la del Core por el nombre. Si el arma dice
 * qué fila de Autofire usa (IR5 p.115: Machine Pistol, SMG, Assault Rifle, Machine Gun), esa reemplaza a la del perfil.
 */
export function getWeaponRangeProfile(weapon: RangeWeaponLike): WeaponRangeProfile | null {
  if (weapon.type === 'Melee') return null;
  const key = weapon.rangeTable && WEAPON_RANGE_PROFILES[weapon.rangeTable] ? weapon.rangeTable : getWeaponProfileKey(weapon.name, weapon.type);
  const base = key ? WEAPON_RANGE_PROFILES[key] : null;
  if (!base) return null;
  const auto = parseAutofireMode(weapon.altFireModes);
  if (!auto?.table) return base;
  const table = AUTOFIRE_TABLES[auto.table];
  return {
    ...base,
    autofireDvs: Object.fromEntries(RANGE_BRACKETS.slice(0, 5).map((b, i) => [b.range, table.dvs[i]])),
    autofireMaxMultiplier: auto.max,
  };
}
