// [Claude Code · 2026-11-06] v5.13.0 (plan 26): vehículos de Black Chrome al garaje y regla Nomad Access.
import type { OwnedVehicle } from '../types/cyberpunk';
import type { BlackChromeVehicle } from '../data/blackChromeVehicles';

/** Mejoras del Core que son armas montadas (Core pp.163-165). */
export const MOUNTED_WEAPON_UPGRADES = [
  'Onboard Machine Gun',
  'Onboard Rocket Pod',
  'Onboard Flamethrower',
  'Onboard Melee Weapon',
  'Vehicle Heavy Weapon Mount',
];

/** Armored Chassis blinda el vehículo a SP13 (Core p.163). */
export const ARMORED_CHASSIS_SP = 13;

/**
 * Nomad Access (BC p.9): al sumar un vehículo de serie al Family Motorpool por subir Moto,
 * el Nomad puede tomar uno con Nomad Access igual o menor a su Rango de Moto. Llega con sus mejoras.
 */
export function nomadCanTake(v: Pick<BlackChromeVehicle, 'nomadAccess'>, motoRank: number): boolean {
  return v.nomadAccess !== null && motoRank > 0 && v.nomadAccess <= motoRank;
}

/** Copia un vehículo de Black Chrome al garaje, con sus mejoras de serie. */
export function bcVehicleToOwned(v: BlackChromeVehicle, origin: string, now: number = Date.now()): OwnedVehicle {
  const notes = [`Origen: Black Chrome p.${v.sourcePage} (${origin})`, `${v.baseType}`, ...v.notes].join(' • ');
  return {
    instanceId: `veh-inst-${v.id}-${now}`,
    catalogId: v.id,
    name: v.name,
    category: v.vehicleClass,
    maxSdp: v.sdp,
    currentSdp: v.sdp,
    armorSp: v.upgrades.includes('Armored Chassis') ? ARMORED_CHASSIS_SP : 0,
    seats: v.seats,
    combatSpeed: v.combatSpeed,
    narrativeSpeed: v.narrativeSpeed,
    upgrades: [...v.upgrades],
    mountedWeapons: v.upgrades.filter((u) => MOUNTED_WEAPON_UPGRADES.includes(u)),
    notes,
  };
}
