// [Claude Code · 2026-11-06] v5.13.0 (plan 26): los 31 vehículos de Black Chrome Tech & Style Guide
// (tabla en BC pp.162-164; entradas en pp.58-84). Cada uno es un vehículo base del Core con mejoras del Core
// (Core pp.163-165). nomadAccess: regla Nomad Access (BC p.9); null = no aplica (Tanson JetBoy).
// Generado desde scratchpad/bc_vehicles.json; summaryEs es un resumen propio, rulesText la frase de reglas del libro.

export interface BlackChromeVehicle {
  id: string;
  name: string;
  company: string;
  vehicleClass: 'air' | 'land';
  /** Vehículo base del Core (Gyrocopter, AV4, Compact Groundcar...). */
  baseType: string;
  nomadAccess: number | null;
  sdp: number;
  seats: number;
  combatSpeed: string;
  narrativeSpeed: string;
  cost: number;
  priceCategory: string;
  /** Mejoras del Core que trae de serie (repetidas si las trae dos veces). */
  upgrades: string[];
  notes: string[];
  rulesText: string;
  summaryEs: string;
  sourcePage: number;
  /** Puestos de Night Market donde se vende (BC pp.131-156). */
  booth: string[];
}

export const BLACK_CHROME_VEHICLES: BlackChromeVehicle[] = [
  {
    "id": "bc-veh-sh-45-patroller",
    "name": "SH-45 Patroller",
    "company": "Dayton Aeronautics",
    "vehicleClass": "air",
    "baseType": "Gyrocopter",
    "nomadAccess": 2,
    "sdp": 35,
    "seats": 1,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 16000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Bulletproof Glass"
    ],
    "notes": [
      "Incompatible with some upgrades"
    ],
    "rulesText": "The Patroller is a Gyrocopter with only one seat and Bulletproof Glass. It Is incompatible with the Seating Upgrade.",
    "summaryEs": "Girocóptero monoplaza civil de Dayton con cabina cerrada y proyección holográfica de datos sobre el cristal.",
    "sourcePage": 58,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-sh-45-patroller-law",
    "name": "SH-45 Patroller Law",
    "company": "Dayton Aeronautics",
    "vehicleClass": "air",
    "baseType": "Gyrocopter",
    "nomadAccess": 4,
    "sdp": 35,
    "seats": 1,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 21000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Bulletproof Glass",
      "Bulletproof Glass",
      "Onboard Machine Gun"
    ],
    "notes": [
      "Incompatible with some upgrades"
    ],
    "rulesText": "The Patroller Law is a Gyrocopter with only one seat, two Bulletproof Glass Upgrades, and an Onboard Machine Gun. It is incompatible with the Seating Upgrade.",
    "summaryEs": "Versión policial del Patroller, blindada y armada, que Dayton envió por error a clientes civiles.",
    "sourcePage": 58,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-dayton-tdt-004",
    "name": "Dayton TDT 004",
    "company": "Dayton Aeronautics",
    "vehicleClass": "air",
    "baseType": "Helicopter",
    "nomadAccess": 7,
    "sdp": 80,
    "seats": 8,
    "combatSpeed": "40 MOVE",
    "narrativeSpeed": "200 MPH/322 KPH",
    "cost": 43000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Heavy Chassis",
      "Seating Upgrade",
      "Seating Upgrade"
    ],
    "notes": [],
    "rulesText": "The Dayton TDT 004 is a Helicopter with a Heavy Chassis and two Seating Upgrades.",
    "summaryEs": "Helicóptero de transporte táctico, rápido y resistente, pensado para equipos de seguridad corporativa y operativos militares.",
    "sourcePage": 59,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-tanson-bellhop",
    "name": "Tanson Bellhop",
    "company": "Tanson Group",
    "vehicleClass": "air",
    "baseType": "Gyrocopter",
    "nomadAccess": 1,
    "sdp": 35,
    "seats": 1,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 16000,
    "priceCategory": "Super Luxury",
    "upgrades": [],
    "notes": [
      "Can fold into a rolling case",
      "Incompatible with some upgrades"
    ],
    "rulesText": "The Bellhop is a Gyrocopter with only one seat that can transform to and from an easy-to-carry mode with an Action. It is incompatible with the Seating Upgrade.",
    "summaryEs": "Girocóptero plegable que se transporta como una maleta con ruedas y se abre como un pequeño vehículo tipo scooter.",
    "sourcePage": 60,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-zetatech-aerocop",
    "name": "Zetatech AeroCop",
    "company": "Zetatech",
    "vehicleClass": "air",
    "baseType": "AV4",
    "nomadAccess": 10,
    "sdp": 120,
    "seats": 6,
    "combatSpeed": "40 MOVE",
    "narrativeSpeed": "200 MPH/322 KPH",
    "cost": 58000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Bulletproof Glass",
      "Bulletproof Glass",
      "Heavy Chassis",
      "Onboard Machine Gun"
    ],
    "notes": [],
    "rulesText": "The AeroCop is an AV4 Multipurpose Aerodyne with a Heavy Chassis, Armored Chassis, two Bulletproof Glass Upgrades, and an Onboard Machine Gun.",
    "summaryEs": "Variante policial del AeroVox: aerodino blindado y armado con ametralladora, popular entre fuerzas del orden.",
    "sourcePage": 61,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-zetatech-aerovox",
    "name": "Zetatech AeroVox",
    "company": "Zetatech",
    "vehicleClass": "air",
    "baseType": "AV4",
    "nomadAccess": 8,
    "sdp": 120,
    "seats": 6,
    "combatSpeed": "40 MOVE",
    "narrativeSpeed": "200 MPH/322 KPH",
    "cost": 51000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Heavy Chassis"
    ],
    "notes": [],
    "rulesText": "The AeroVox is an AV4 Multipurpose Aerodyne with a Heavy Chassis.",
    "summaryEs": "Aerodino económico, sólido y fiable, popular entre ejecutivos corporativos con presupuesto justo.",
    "sourcePage": 61,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-zetatech-destination",
    "name": "Zetatech Destination",
    "company": "Zetatech",
    "vehicleClass": "air",
    "baseType": "AV4",
    "nomadAccess": 6,
    "sdp": 100,
    "seats": 4,
    "combatSpeed": "40 MOVE",
    "narrativeSpeed": "200 MPH/322 KPH",
    "cost": 40000,
    "priceCategory": "Super Luxury",
    "upgrades": [],
    "notes": [
      "Incompatible with some upgrades"
    ],
    "rulesText": "The Destination is an AV4 Multipurpose Aerodyne with only four seats. It is incompatible with the Heavy Chassis and Seating Upgrades.",
    "summaryEs": "Aerodino compacto estándar, asequible y confiable, con asientos cómodos y millones de unidades vendidas.",
    "sourcePage": 62,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-zetatech-herakles",
    "name": "Zetatech Herakles",
    "company": "Zetatech",
    "vehicleClass": "air",
    "baseType": "AV4",
    "nomadAccess": 10,
    "sdp": 120,
    "seats": 8,
    "combatSpeed": "40 MOVE",
    "narrativeSpeed": "200 MPH/322 KPH",
    "cost": 63000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Bulletproof Glass",
      "Heavy Chassis",
      "Seating Upgrade",
      "Onboard Machine Gun",
      "Vehicle Heavy Weapon Mount"
    ],
    "notes": [],
    "rulesText": "The Destination is an AV4 Multipurpose Aerodyne with an Armored Chassis, Bulletproof Glass, a Heavy Chassis, a Seating Upgrade, an Onboard Machine Gun, and a Vehicle Heavy Weapon Mount.",
    "summaryEs": "Aerodino de defensa armado y blindado para transporte de tropas y control de multitudes, casi ausente del mercado civil.",
    "sourcePage": 63,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-americar-econocompact",
    "name": "AmeriCar EconoCompact",
    "company": "AmeriCar",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 1,
    "sdp": 50,
    "seats": 3,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 20000,
    "priceCategory": "Super Luxury",
    "upgrades": [],
    "notes": [
      "Incompatible with some upgrades"
    ],
    "rulesText": "The EconoCompact is a Compact Groundcar with only three seats. It is incompatible with the Heavy Chassis and Seating Upgrades.",
    "summaryEs": "Automóvil económico y sin lujos de AmeriCar, con tres plazas y el motor en la parte trasera.",
    "sourcePage": 64,
    "booth": [
      "B1"
    ]
  },
  {
    "id": "bc-veh-americar-family-star-van",
    "name": "AmeriCar Family Star Van",
    "company": "AmeriCar",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 2,
    "sdp": 50,
    "seats": 6,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 31000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Seating Upgrade"
    ],
    "notes": [],
    "rulesText": "The Family Star Van is a Compact Groundcar with a Seating Upgrade.",
    "summaryEs": "Furgoneta familiar de diseño retro, con asientos que se guardan y pantallas individuales para cada pasajero.",
    "sourcePage": 65,
    "booth": [
      "B1"
    ]
  },
  {
    "id": "bc-veh-diego-motors-chupacabra",
    "name": "Diego Motors Chupacabra",
    "company": "Diego Motors",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 4,
    "sdp": 70,
    "seats": 6,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 37000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Heavy Chassis",
      "NOS",
      "Seating Upgrade"
    ],
    "notes": [],
    "rulesText": "The Chupacabra is a Compact Groundcar with NOS, a Seating Upgrade, and a Heavy Chassis.",
    "summaryEs": "Muscle car todoterreno de tracción total, hecho con piezas recicladas y sin gadgets, de la marca nómada Diego Motors.",
    "sourcePage": 66,
    "booth": [
      "B1"
    ]
  },
  {
    "id": "bc-veh-diego-motors-range-trike",
    "name": "Diego Motors Range Trike",
    "company": "Diego Motors",
    "vehicleClass": "land",
    "baseType": "Roadbike",
    "nomadAccess": 4,
    "sdp": 55,
    "seats": 3,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 31000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Heavy Chassis"
    ],
    "notes": [
      "Incompatible with some upgrades"
    ],
    "rulesText": "The Diego Motors Range Trike is a Roadbike with three seats, an Armored Chassis, and a Heavy Chassis. It is incompatible with the Seating Upgrade.",
    "summaryEs": "Triciclo artesanal y resistente fabricado por nómadas sudamericanos, difícil de conseguir fuera de sus caravanas.",
    "sourcePage": 67,
    "booth": [
      "B1"
    ]
  },
  {
    "id": "bc-veh-the-grundy",
    "name": "The Grundy",
    "company": "Grundy Salvage International",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 4,
    "sdp": 70,
    "seats": 4,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 41000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Heavy Chassis",
      "Combat Plow"
    ],
    "notes": [],
    "rulesText": "The Grundy is a Compact Groundcar with a Heavy Chassis, Armored Chassis, and a Combat Plow.",
    "summaryEs": "Búnker rodante construido con chatarra polaca, con motor de camión, blindaje improvisado y un arado de combate.",
    "sourcePage": 68,
    "booth": [
      "B1"
    ]
  },
  {
    "id": "bc-veh-the-harvey-100",
    "name": "The Harvey 100",
    "company": "AmeriCar",
    "vehicleClass": "land",
    "baseType": "Roadbike",
    "nomadAccess": 1,
    "sdp": 35,
    "seats": 2,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 20000,
    "priceCategory": "Super Luxury",
    "upgrades": [],
    "notes": [],
    "rulesText": "The Harvey 100 is a Roadbike.",
    "summaryEs": "Motocicleta para todos, famosa por sus piezas reutilizadas y por ser muy fácil de desarmar y personalizar.",
    "sourcePage": 69,
    "booth": [
      "B1",
      "F4"
    ]
  },
  {
    "id": "bc-veh-the-harriet-100",
    "name": "The Harriet 100",
    "company": "AmeriCar",
    "vehicleClass": "land",
    "baseType": "Roadbike",
    "nomadAccess": 2,
    "sdp": 35,
    "seats": 2,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 21000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Smuggling Upgrade"
    ],
    "notes": [],
    "rulesText": "The Harriet 100 is a Roadbike with a Smuggling Upgrade.",
    "summaryEs": "Rediseño más femenino del Harvey, con piezas de moda y alforjas que alimentó la afición a personalizarla.",
    "sourcePage": 69,
    "booth": [
      "B1",
      "F4"
    ]
  },
  {
    "id": "bc-veh-the-harvey-merc",
    "name": "The Harvey Merc",
    "company": "AmeriCar",
    "vehicleClass": "land",
    "baseType": "Roadbike",
    "nomadAccess": 4,
    "sdp": 35,
    "seats": 2,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 30000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Onboard Machine Gun",
      "Onboard Rocket Pod"
    ],
    "notes": [],
    "rulesText": "The Harvey Merc is a Roadbike with an Onboard Machine Gun and Onboard Rocket Pod.",
    "summaryEs": "Variante mercenaria del Harvey, cargada de armas, muy apreciada por los edgerunners.",
    "sourcePage": 69,
    "booth": [
      "B1",
      "F4"
    ]
  },
  {
    "id": "bc-veh-highway-master-artemis",
    "name": "Highway Master Artemis",
    "company": "Brennan",
    "vehicleClass": "land",
    "baseType": "Roadbike",
    "nomadAccess": 5,
    "sdp": 35,
    "seats": 2,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 60000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Bulletproof Glass",
      "Bulletproof Glass"
    ],
    "notes": [
      "Supercharge Mode"
    ],
    "rulesText": "The Highway Master Artemis is a Roadbike with an Armored Chassis. With an Action, the driver can engage or retract the canopy, which fully encloses the cabin behind two Bulletproof Glass Upgrades. Additionally, the driver can use an Action to supercharge the bike, causing it to act as if it was a Superbike in terms of both Combat and Narrative Speed for up to 10 minutes. Using this feature twice within the same day destroys the bike at the end of the second 10-minute supercharge.",
    "summaryEs": "Moto de lujo con cúpula blindada retráctil y modo carrera que la sobrealimenta temporalmente a costa de dañarla.",
    "sourcePage": 70,
    "booth": [
      "B1"
    ]
  },
  {
    "id": "bc-veh-kaukaz-volkhov",
    "name": "Kaukaz Volkhov",
    "company": "Kaukaz",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 7,
    "sdp": 55,
    "seats": 4,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 41000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Heavy Chassis",
      "Vehicle Heavy Weapon Mount"
    ],
    "notes": [],
    "rulesText": "The Volkov is a Compact Groundcar with a Heavy Chassis, Armored Chassis, and a Vehicle Heavy Weapon Mount with a Techtronika Russia BMG-500 (see page 122) attached. Each purchase also comes with 500 rounds of Basic Rifle Ammunition and a bottle of real vodka.",
    "summaryEs": "Camioneta blindada multipropósito de las fuerzas de SovOil, con gran carga y montaje para arma pesada.",
    "sourcePage": 71,
    "booth": [
      "B1"
    ]
  },
  {
    "id": "bc-veh-makigai-ebi",
    "name": "Makigai Ebi",
    "company": "Makigai",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 1,
    "sdp": 35,
    "seats": 4,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 23000,
    "priceCategory": "Super Luxury",
    "upgrades": [],
    "notes": [
      "Incompatible with some upgrades"
    ],
    "rulesText": "The Ebi is a Compact Groundcar with 35 SDP. It is incompatible with the Heavy Chassis Upgrade.",
    "summaryEs": "Pequeño hatchback urbano, eficiente y cómodo, con chasis mayormente plástico y pensado para trabajadores corporativos.",
    "sourcePage": 72,
    "booth": [
      "C5"
    ]
  },
  {
    "id": "bc-veh-militech-gorgon-security-van",
    "name": "Militech Gorgon Security Van",
    "company": "Militech",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 4,
    "sdp": 50,
    "seats": 6,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 37000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Bulletproof Glass",
      "Seating Upgrade"
    ],
    "notes": [],
    "rulesText": "The Militech Gorgon Security Van is a Compact Groundcar with an Armored Chassis, Bulletproof Glass, and a Seating Upgrade.",
    "summaryEs": "Furgoneta de seguridad resistente para equipos de mercenarios, hecha para entrar en zonas de combate y extraer operativos.",
    "sourcePage": 73,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-the-zacatzontli-pickup-truck",
    "name": "The Zacatzontli Pickup Truck",
    "company": "Ortiz Automotives",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 4,
    "sdp": 70,
    "seats": 4,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 27000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Heavy Chassis",
      "Housing Capacity"
    ],
    "notes": [
      "Bonus Items"
    ],
    "rulesText": "The Zacatzontli is a Compact Groundcar with a Heavy Chassis and a Housing upgrade. Additionally, each Zac comes with a WorldSat Aerial Sphere (see page 50), a Mr. Biscuit Multi-Food Processor (see page 49), and five Everest VentureWare AirWell 50s (see page 48) stowed inside.",
    "summaryEs": "Camioneta robusta pensada para nómadas, con zona de dormir y equipo de supervivencia guardado bajo la caja.",
    "sourcePage": 74,
    "booth": [
      "B1"
    ]
  },
  {
    "id": "bc-veh-the-paladin-500",
    "name": "The Paladin 500",
    "company": "Turbo Neon Motors",
    "vehicleClass": "land",
    "baseType": "High Performance Groundcar",
    "nomadAccess": 8,
    "sdp": 50,
    "seats": 4,
    "combatSpeed": "40 MOVE",
    "narrativeSpeed": "200 MPH/322 KPH",
    "cost": 59000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "NOS",
      "NOS",
      "Onboard Machine Gun",
      "Onboard Machine Gun"
    ],
    "notes": [],
    "rulesText": "The Paladin 500 is a High Performance Groundcar with an Armored Chassis, two front-mounted Onboard Machine Guns, and two NOS Upgrades.",
    "summaryEs": "Auto de alto rendimiento sobre marcos de Max Interceptor reforzados, con dos ametralladoras frontales y turbo doble.",
    "sourcePage": 75,
    "booth": [
      "B1",
      "D3"
    ]
  },
  {
    "id": "bc-veh-quadra-thunder-x",
    "name": "Quadra Thunder-X",
    "company": "Dayton Quadra",
    "vehicleClass": "land",
    "baseType": "High Performance Groundcar",
    "nomadAccess": 8,
    "sdp": 50,
    "seats": 4,
    "combatSpeed": "40 MOVE",
    "narrativeSpeed": "200 MPH/322 KPH",
    "cost": 57000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Bulletproof Glass",
      "NOS"
    ],
    "notes": [],
    "rulesText": "The Thunder is a High Performance Groundcar with an Armored Chassis, Bulletproof Glass, and NOS.",
    "summaryEs": "Homenaje moderno a los muscle cars clásicos, con blindaje discreto, interior analógico y óxido nitroso.",
    "sourcePage": 76,
    "booth": [
      "B1",
      "D3"
    ]
  },
  {
    "id": "bc-veh-street-king-combat-vehicle",
    "name": "Street King Combat Vehicle",
    "company": "Turbo Neon Motors",
    "vehicleClass": "land",
    "baseType": "High Performance Groundcar",
    "nomadAccess": 10,
    "sdp": 70,
    "seats": 6,
    "combatSpeed": "40 MOVE",
    "narrativeSpeed": "200 MPH/322 KPH",
    "cost": 63000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Bulletproof Glass",
      "Bulletproof Glass",
      "Heavy Chassis",
      "NOS",
      "Seating Upgrade"
    ],
    "notes": [
      "Slightly Uncomfortable Seats"
    ],
    "rulesText": "The Street King is a High Performance Groundcar with a Heavy Chassis, Armored Chassis, two Bulletproof Glass Upgrades, a Seating Upgrade, and NOS.",
    "summaryEs": "Transporte militar reimaginado con chasis excedente y placas cerámicas, con asientos incómodos a propósito.",
    "sourcePage": 77,
    "booth": [
      "B1",
      "D3"
    ]
  },
  {
    "id": "bc-veh-tanson-jetboy-hoverboard",
    "name": "Tanson JetBoy Hoverboard",
    "company": "Tanson Group",
    "vehicleClass": "land",
    "baseType": "Hoverboard",
    "nomadAccess": null,
    "sdp": 10,
    "seats": 1,
    "combatSpeed": "15 MOVE",
    "narrativeSpeed": "30 MPH/48 KPH",
    "cost": 1000,
    "priceCategory": "Very Expensive",
    "upgrades": [],
    "notes": [
      "Uses Athletics Skill for manuever Checks",
      "Incompatible with some upgrades"
    ],
    "rulesText": "The JetBoy is a Land Vehicle with 10 SDP (HP) and only one seat that hovers just above the ground. It can always be driven with no hands as if the user had connected Interface Plugs. You make maneuvers on the JetBoy using the Athletics Skill. Basic movement does not require a minimum Skill Base. It provides 15 MOVE in combat, and has a Narrative Speed of 30 MPH (48 KPH). It cannot be upgraded by a Nomad or a Tech but feel free to give it a premium custom paint job.",
    "summaryEs": "Aerotabla popular entre jóvenes pandilleros, con dos turbinas, buen sistema de sonido y manejo mediante Atletismo.",
    "sourcePage": 78,
    "booth": [
      "C5",
      "D3"
    ]
  },
  {
    "id": "bc-veh-tetracorp-america-megahauler",
    "name": "TetraCorp America MegaHauler",
    "company": "TetraCorp America",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 10,
    "sdp": 200,
    "seats": 4,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 143000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Bulletproof Glass",
      "Bulletproof Glass",
      "Communications Center",
      "Combat Plow",
      "Heavy Chassis",
      "Housing Capacity",
      "Smuggling Upgrade",
      "Smuggling Upgrade",
      "Smuggling Upgrade"
    ],
    "notes": [
      "Limited Security"
    ],
    "rulesText": "The TetraCorp America MegaHauler is a Compact Groundcar with 200 SDP, a number which includes the SDP from its Heavy Chassis upgrade. It also sports an Armored Chassis, Communications Center, Combat Plow, Housing Capacity Upgrade, two installations of Bulletproof Glass, and three Smuggling Upgrades. The cab and all three cargo container units have the biometric locking feature of the Security Upgrade but lack its cloaking ability.",
    "summaryEs": "Enorme camión de carga blindado capaz de arrastrar tres contenedores, con cabina equipada para comunicaciones y seguridad biométrica.",
    "sourcePage": 79,
    "booth": [
      "B1"
    ]
  },
  {
    "id": "bc-veh-tetracorp-america-badger-corporate-bus",
    "name": "TetraCorp America Badger Corporate Bus",
    "company": "TetraCorp America",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 6,
    "sdp": 70,
    "seats": 12,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 50000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Bulletproof Glass",
      "Heavy Chassis",
      "Seating Upgrade",
      "Seating Upgrade",
      "Seating Upgrade",
      "Seating Upgrade",
      "Security Upgrade"
    ],
    "notes": [
      "Bonus Items"
    ],
    "rulesText": "The TetraCorp America Badger Corporate Bus is a Compact Groundcar with a Heavy Chassis, Armored Chassis, Bulletproof Glass, Security Upgrade, and four Seating Upgrades. Each purchase comes with a Drink Master 3000 (see page 42) and two KillStrom Banshee Microphones (see page 40).",
    "summaryEs": "Autobús corporativo seguro con interior de sala de juntas, barra integrada y modo fiesta con karaoke.",
    "sourcePage": 80,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-yangs-wheels-rickshaw",
    "name": "Yang’s Wheels Rickshaw",
    "company": "Yang’s Wheels LTD",
    "vehicleClass": "land",
    "baseType": "Roadbike",
    "nomadAccess": 2,
    "sdp": 35,
    "seats": 4,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 21000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Seating Upgrade"
    ],
    "notes": [
      "Detachable Carriage"
    ],
    "rulesText": "These rickshaws are Roadbikes with a Seating Upgrade. As an Action, the driver can disconnect the carriage and its two seats from the Roadbike.",
    "summaryEs": "Moto reciclada con carruaje trasero desmontable, ideal para transporte barato y ágil en Night City.",
    "sourcePage": 81,
    "booth": [
      "C5"
    ]
  },
  {
    "id": "bc-veh-zonda-molly-1k",
    "name": "Zonda Molly 1K",
    "company": "Zonda",
    "vehicleClass": "land",
    "baseType": "Compact Groundcar",
    "nomadAccess": 1,
    "sdp": 50,
    "seats": 2,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "60 MPH/97 KPH",
    "cost": 15000,
    "priceCategory": "Super Luxury",
    "upgrades": [],
    "notes": [
      "Cannot be driven using Interface Plugs",
      "Incompatible with some upgrades"
    ],
    "rulesText": "The Zonda Molly 1K is a Compact Groundcar with only two seats. It cannot be driven using Interface Plugs and has a Narrative Speed of 60 MPH (97 KPH). It is incompatible with the Heavy Chassis and Seating Upgrades.",
    "summaryEs": "Vehículo todoterreno veterano y fiable, favorito de nómadas, sin integración de conectores de interfaz.",
    "sourcePage": 82,
    "booth": [
      "B1"
    ]
  },
  {
    "id": "bc-veh-zonda-parallax-cybercycle",
    "name": "Zonda Parallax Cybercycle™",
    "company": "Zonda",
    "vehicleClass": "land",
    "baseType": "Superbike",
    "nomadAccess": 8,
    "sdp": 35,
    "seats": 2,
    "combatSpeed": "60 MOVE",
    "narrativeSpeed": "300 MPH/483 KPH",
    "cost": 110000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Armored Chassis",
      "Enhanced Interface Plug Integration",
      "NOS"
    ],
    "notes": [],
    "rulesText": "The Parallax is a Superbike with an Armored Chassis, NOS, and Enhanced Interface Plug Integration.",
    "summaryEs": "Moto de élite con integración neuronal avanzada que permite al piloto compartir sentidos con la máquina a velocidades extremas.",
    "sourcePage": 83,
    "booth": [
      "D3"
    ]
  },
  {
    "id": "bc-veh-zonda-sliver",
    "name": "Zonda Sliver",
    "company": "Zonda",
    "vehicleClass": "land",
    "baseType": "Roadbike",
    "nomadAccess": 4,
    "sdp": 35,
    "seats": 2,
    "combatSpeed": "20 MOVE",
    "narrativeSpeed": "100 MPH/161 KPH",
    "cost": 27000,
    "priceCategory": "Super Luxury",
    "upgrades": [
      "Bulletproof Glass",
      "Communications Center",
      "Security Upgrade"
    ],
    "notes": [],
    "rulesText": "The Sliver is a Roadbike with a Communications Center, Bulletproof Glass, and a Security Upgrade.",
    "summaryEs": "Moto cargada de gadgets con pantalla holográfica en el parabrisas que concentra todas sus funciones.",
    "sourcePage": 84,
    "booth": [
      "B1",
      "D3"
    ]
  }
];
