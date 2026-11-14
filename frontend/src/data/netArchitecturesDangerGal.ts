// [Claude Code · 2026-11-13] v5.39.0 (plan 32): arquitectura NET de Danger Gal Dossier.
// La NET portátil del CrAB Lord (Edgerunners, p.42). Reemplaza a "Archivo Central de Inteligencia Danger Gal",
// que era inventada. Dificultad por el DV más alto (Core p.210: Uncommon DV10). Las stats del Black ICE
// se completan en netAndRolesData.ts con BLACK_ICE_STATS (Core pp.206-207).
import type { NetArchitecturePreset } from './netAndRolesData';

export const DANGER_GAL_NET_PRESETS: NetArchitecturePreset[] = [
  {
    id: 'net-dg-crab-lord-portable',
    name: 'NET portátil del CrAB Lord (4 pisos)',
    difficulty: 'Uncommon',
    totalFloors: 4,
    loreDescription:
      'La arquitectura que el CrAB Lord lleva encima para manejar sus CrAB Drones (perros caminantes con cámara, patas de agarre y un airhypo con Black Lace, Blue Glass o Biotoxin; 6 MOVE, 40 HP; se contrarrestan con DV21 de Electronics/Security Tech en 5 minutos). Demon: Rock Lobster, un Balron "con demasiada personalidad": REZ 30, Interface 7, 4 NET Actions, Combat Number 14; puede hacer cualquier NET Action de un Netrunner. Danger Gal Dossier p.42.',
    floors: [
      { floorNumber: 1, type: 'Black ICE', name: 'Black ICE: Giant', iceType: 'Giant' },
      { floorNumber: 2, type: 'Password', name: 'Password', dv: 10 },
      { floorNumber: 3, type: 'Control Node', name: 'Control Node: CrAB Drone', dv: 10, rewardOrDevice: 'CrAB Drone' },
      { floorNumber: 4, type: 'Control Node', name: 'Control Node: CrAB Drone', dv: 10, rewardOrDevice: 'CrAB Drone' }
    ]
  }
];
