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
