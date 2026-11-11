// [Claude Code · 2026-11-11] v5.17.0 (plan 27): vehículos de los Interface RED y sus DLC.
// Bicycle: Spinning Your Wheels pp.3-7 (DLC; también en Interface RED Vol. 3, que es imagen sin texto).
// Zonda Metrocar: 12 Days of Gearmas, Interface RED Vol. 4 p.68.
// Usa la misma forma que los vehículos de Black Chrome para compartir la lista, el garaje y el Nomad Access.
import type { BlackChromeVehicle } from './blackChromeVehicles';

export const INTERFACE_RED_VEHICLES: BlackChromeVehicle[] = [
  {
    id: 'ir-veh-bicycle',
    name: 'Bicycle',
    company: "Yang's Wheels",
    vehicleClass: 'land',
    baseType: 'Bicycle',
    // "Bicycles can't be acquired or upgraded using a Nomad's Moto Role Ability" (p.3).
    nomadAccess: null,
    sdp: 15,
    seats: 1,
    combatSpeed: 'Según BODY: menos de 4, 8 MOVE; 4 a 7, 10 MOVE; 8 o más, 15 MOVE',
    narrativeSpeed: 'Según BODY: 12, 20 o 30 MPH (19, 32 o 48 KPH)',
    cost: 100,
    priceCategory: 'Premium',
    upgrades: [],
    notes: [
      'Se maneja con Athletics y se repara con Basic Tech',
      'No se controla con Interface Plugs',
      'BODY 11 o más necesita Reinforced Frame',
      'No se consigue ni se mejora con Moto',
    ],
    rulesText:
      "Bicycles have SDP 15, a single seat, a cost of 100eb (Premium), and their Speed is dependent upon the rider's BODY.",
    summaryEs:
      "Bici de Yang's Wheels, el transporte barato de Night City. Choque o embestida: 3d6 a la bici y al blanco, y el ciclista sale despedido (Prone). Mejoras y trucos en el Compendio de sistemas.",
    sourcePage: 3,
    booth: [],
    sourceTitle: 'Spinning Your Wheels',
  },
  {
    id: 'ir-veh-zonda-metrocar',
    name: 'Zonda Metrocar',
    company: 'Zonda',
    vehicleClass: 'land',
    baseType: 'Compact Groundcar',
    nomadAccess: 1,
    sdp: 25,
    seats: 2,
    combatSpeed: '10 MOVE',
    narrativeSpeed: '30 MPH/48 KPH',
    cost: 1000,
    priceCategory: 'Very Expensive',
    upgrades: [],
    notes: [
      'Incompatible con Heavy Chassis y Seating',
      'Con AV Engine vuela, a la misma velocidad',
      'Un Tech no le puede subir la velocidad',
    ],
    rulesText:
      'The Zonda Metrocar is a Compact Groundcar with only two seats. It has an SDP of 25, a Combat Speed of 10 MOVE, and a Narrative Speed of 30 MPH/ 48 KPH. The Metrocar is incompatible with the Heavy Chassis and Seating Upgrade.',
    summaryEs:
      "El auto más barato de Night City: la bici cerrada de Yang's Wheels, con motor y sin pedales, bajo licencia de Zonda.",
    sourcePage: 68,
    booth: [],
    sourceTitle: 'Interface RED Vol. 4',
  },
];

/** Velocidad de la bici según el BODY del ciclista (Spinning Your Wheels p.3). */
export function bicycleSpeed(body: number): { move: number; mph: number; kph: number } {
  if (body >= 8) return { move: 15, mph: 30, kph: 48 };
  if (body >= 4) return { move: 10, mph: 20, kph: 32 };
  return { move: 8, mph: 12, kph: 19 };
}
