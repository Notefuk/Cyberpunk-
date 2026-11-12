// [Claude Code · 2026-11-11] v5.20.0 (plan 27): arquitecturas NET de Interface RED.
// Single Shot Pack (Interface RED Vol. 1 pp.32-36) y Jumpstart Kit Conversion Guide (Interface RED Vol. 2 pp.30-31).
// El libro no imprime la dificultad: se toma la del DV más alto según la tabla de Core p.210
// (Basic DV6, Standard DV8, Uncommon DV10, Advanced DV12).
// Las stats de los Black ICE se completan en netAndRolesData.ts con BLACK_ICE_STATS (Core pp.206-207).
import type { NetArchitecturePreset, NetFloor } from './netAndRolesData';

const pw = (floorNumber: number, dv: number, label = ''): NetFloor => ({ floorNumber, type: 'Password', name: `${label}Password`, dv });
const file = (floorNumber: number, dv: number, what: string, label = ''): NetFloor => ({
  floorNumber, type: 'File', name: `${label}File: ${what}`, dv, rewardOrDevice: what
});
const node = (floorNumber: number, dv: number, what: string, label = ''): NetFloor => ({
  floorNumber, type: 'Control Node', name: `${label}Control Node: ${what}`, dv, rewardOrDevice: what
});
const ice = (floorNumber: number, iceType: string, label = ''): NetFloor => ({
  floorNumber, type: 'Black ICE', name: `${label}Black ICE: ${iceType}`, iceType
});

export const INTERFACE_RED_NET_PRESETS: NetArchitecturePreset[] = [
  {
    id: 'net-ir1-conapt-security',
    name: 'Conapt Security (Single Shot Pack — 3 pisos)',
    difficulty: 'Basic',
    totalFloors: 3,
    loreDescription:
      'Seguridad simple para el conapt de un Edgerunner; sirve también para bares o campamentos Nomad. Demon: 1 Imp. Costo total 15,050eb. Interface RED Vol. 1 p.32.',
    floors: [pw(1, 6), ice(2, 'Wisp'), node(3, 6, 'Ground Drone')]
  },
  {
    id: 'net-ir1-starter-drone-rig',
    name: 'Starter Drone Rig (Single Shot Pack — 3 pisos)',
    difficulty: 'Basic',
    totalFloors: 3,
    loreDescription:
      'Arquitectura portátil para llevar un dron propio a todos lados. Demon: 1 Imp. Costo total 10,050eb. Interface RED Vol. 1 p.32.',
    floors: [pw(1, 6), ice(2, 'Raven'), node(3, 6, 'Mini Air Drone')]
  },
  {
    id: 'net-ir1-oasis-security',
    name: 'Oasis Security (Single Shot Pack — 5 pisos)',
    difficulty: 'Standard',
    totalFloors: 5,
    loreDescription:
      'La de los locales Oasis de Continental Brands; sirve para depósitos chicos, departamentos ejecutivos, Night Markets menores y trenes de carga. Demon: 1 Imp. Costo total 16,000eb. Interface RED Vol. 1 p.33.',
    floors: [
      pw(1, 6),
      node(2, 8, 'Observation Cameras (1 adentro, 1 afuera)'),
      pw(3, 8),
      ice(4, 'Hellhound'),
      node(5, 8, 'Automated Turret (dentro del local)')
    ]
  },
  {
    id: 'net-ir1-clinic-security',
    name: 'Clinic Security (Single Shot Pack — 6 pisos)',
    difficulty: 'Standard',
    totalFloors: 6,
    loreDescription:
      'Para una clínica u otro negocio chico de dos plantas: lobby y oficinas abajo, cirugía o gerencia arriba. Demon: 1 Imp. Costo total 16,050eb. Interface RED Vol. 1 p.34.',
    floors: [
      pw(1, 6),
      node(2, 6, 'Observation Cameras (1 afuera, 1 en el ascensor)'),
      file(3, 6, 'Appointment schedule or similar data'),
      pw(4, 6),
      ice(5, 'Wisp'),
      node(6, 8, 'Sleep Gas Elevator (dentro del ascensor)')
    ]
  },
  {
    id: 'net-ir1-small-corp-facility',
    name: 'Small Corp Facility (Single Shot Pack — 3 pisos y 2 ramas)',
    difficulty: 'Uncommon',
    totalFloors: 10,
    loreDescription:
      'Instalación corporativa chica de cinco plantas con una sola arquitectura. Después del piso 3 se abre en dos ramas: A (pisos 1a-3a) y B (pisos 1b-4b). Demons: 1 Imp y 1 Efreet. Costo total 88,550eb, sin contar los drones de limpieza. Interface RED Vol. 1 p.35.',
    floors: [
      pw(1, 8),
      file(2, 8, 'Appointment schedule or similar data'),
      ice(3, 'Raven'),
      pw(4, 8, '[Rama A · 1a] '),
      ice(5, 'Hellhound', '[Rama A · 2a] '),
      node(6, 6, 'Cleaning Drones', '[Rama A · 3a] '),
      pw(7, 10, '[Rama B · 1b] '),
      ice(8, 'Kraken', '[Rama B · 2b] '),
      node(9, 10, 'Cameras (1 por planta)', '[Rama B · 3b] '),
      node(10, 10, 'Large Air Drone', '[Rama B · 4b] ')
    ]
  },
  {
    id: 'net-ir1-vault',
    name: 'Vault (Single Shot Pack — 9 pisos)',
    difficulty: 'Advanced',
    totalFloors: 9,
    loreDescription:
      'Para quien quiere guardar secretos y tesoros. Demon: 1 Balron. Costo total 100,700eb, sin contar la puerta de la bóveda. Interface RED Vol. 1 p.36.',
    floors: [
      pw(1, 10),
      file(2, 6, 'Vault content manifest'),
      node(3, 8, 'Observation Cameras (1 afuera, 1 adentro de la bóveda)'),
      ice(4, 'Hellhound + Killer'),
      node(5, 10, 'Vault Door'),
      node(6, 10, 'Automated Blood Swarm (dentro de la bóveda)'),
      ice(7, 'Hellhound + Scorpion'),
      file(8, 10, 'Sensitive Data'),
      file(9, 12, 'Very Sensitive Data')
    ]
  },
  {
    id: 'net-ir2-apartment-building',
    name: 'Apartment Building (Jumpstart Kit Conversion — 4 pisos)',
    difficulty: 'Standard',
    totalFloors: 4,
    loreDescription: 'La NET del edificio de la misión The Apartment. Interface RED Vol. 2 p.30.',
    floors: [pw(1, 8), node(2, 8, 'Fire Alarm, Sprinklers'), node(3, 8, 'Elevators'), node(4, 8, 'Lights')]
  },
  {
    id: 'net-ir2-dorothys-private-net',
    name: "Dorothy's Private NET (Jumpstart Kit Conversion — 6 pisos)",
    difficulty: 'Standard',
    totalFloors: 6,
    loreDescription:
      'La NET privada de Dorothy en la misión Definitely Not Kansas. Los dos Hellhound llevan íconos propios: un león y un terrier. Interface RED Vol. 2 p.31.',
    floors: [
      pw(1, 8),
      file(2, 8, 'Turn Back Last Warning'),
      { ...ice(3, 'Hellhound'), rewardOrDevice: 'Custom Icon: Lion' },
      node(4, 8, 'Cameras'),
      pw(5, 8),
      { ...ice(6, 'Hellhound'), rewardOrDevice: 'Custom Icon: Terrier' }
    ]
  }
];
