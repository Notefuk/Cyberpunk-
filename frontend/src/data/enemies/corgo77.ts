// Generado por scripts/gen_enemies.py desde data/enemies-src/. No editar a mano.
import type { EnemySheet } from '../enemiesCatalog';

export const CORGO77_ENEMIES: EnemySheet[] = [
  {
    "id": "c77-stealth-drone",
    "name": "Stealth Drone",
    "subtitle": "Exec Drone Team Member",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 6,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol (w/ Silencer)",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol (w/ Silencer)",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "10 Armor-Piercing Bullets · Tipo Core (Very Heavy Pistol 4d6 ROF1 mag8). Silencer. Trae 10 balas AP (más que el cargador de 8).",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Observation Camera",
      "Optical Camo",
      "Bug Detector",
      "Subdermal Pocket"
    ],
    "specialRules": [
      "Miembro de Equipo Dron del Exec (Corgo p.5, Teamwork Rango 4+): no necesita Netrunner ni control como Personal Drone; funciona como si tuviera un Demon siempre instalado, se comunica con frases u órdenes simples y recibe órdenes como cualquier Team Member. Usa Combat Number fijo en vez de STATs/Skills, no usa Loyalty (obedece toda orden que no vaya contra la política del empleador) y tiene Acción y Acción de Movimiento normales; el DJ decide qué Acciones puede hacer según su tipo. No es discreto, siempre transmite a tu jefe y no gana IP con la Workstation HQ Upgrade.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Unidad pequeña del tamaño de un maletín, pensada para pasar desapercibida y disuadir amenazas menores; existe en versiones con patas o ruedas.",
    "homebrew": true,
    "machine": {
      "type": "Exec Drone Team Member (legged two/four/six legs, or wheeled)",
      "move": 6,
      "size": "tamaño de un maletín"
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-auditor-drone",
    "name": "Auditor Drone",
    "subtitle": "Exec Drone Team Member",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 6,
    "role": "",
    "hp": 15,
    "seriouslyWounded": 8,
    "deathSave": 0,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Very Heavy Melee Weapon",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Melee Weapon",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Tipo Core (Very Heavy Melee 4d6 ROF1). · ROF/cargador según tabla Core p.92",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Observation Camera",
      "Audio Recorder",
      "Chemical Analyzer",
      "Integrated Cyberscanner (IRV4. pg. 66)",
      "MicroOptics",
      "Voice Stress Analyzer",
      "Bug Detector"
    ],
    "specialRules": [
      "Miembro de Equipo Dron del Exec (Corgo p.5, Teamwork Rango 4+): no necesita Netrunner ni control como Personal Drone; funciona como si tuviera un Demon siempre instalado, se comunica con frases u órdenes simples y recibe órdenes como cualquier Team Member. Usa Combat Number fijo en vez de STATs/Skills, no usa Loyalty (obedece toda orden que no vaya contra la política del empleador) y tiene Acción y Acción de Movimiento normales; el DJ decide qué Acciones puede hacer según su tipo. No es discreto, siempre transmite a tu jefe y no gana IP con la Workstation HQ Upgrade.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Unidad discreta del tamaño de una pelota de básquet, diseñada para enforcers e investigadores; viene en versión con patas o aérea.",
    "homebrew": true,
    "machine": {
      "type": "Exec Drone Team Member (legged four/six legs, or air)",
      "move": 6,
      "size": "tamaño de una pelota de básquet"
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-combat-drone",
    "name": "Combat Drone",
    "subtitle": "Exec Drone Team Member",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 6,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Stun Baton",
        "totalBase": 14,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Machine Gun [4d6, Autofire (Machine Gun 4)]",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "EQ Heavy Pistol with Pistol Autosear",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Stun Baton",
        "skillBase": 14,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "El libro solo lo nombra; no es un tipo de arma de la lista Core. Tipo Core: Stun Baton 2d6 ROF 2, igual que en Everyday People.",
        "skill": "Combat Number"
      },
      {
        "name": "Machine Gun [4d6, Autofire (Machine Gun 4)]",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "40 Basic Bullets · Opción A (una de dos, se puede cambiar en downtime). Daño 4d6 y Autofire (Machine Gun 4) impresos en el bloque; capacidad no impresa.",
        "skill": "Combat Number"
      },
      {
        "name": "EQ Heavy Pistol with Pistol Autosear",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "26 Armor-Piercing Bullets · Opción B (una de dos). Tipo Core (Heavy Pistol 3d6 ROF2 mag8) + Pistol Autosear. Trae 26 balas AP (coincide con cargador 8 + Drum +18 de la tabla de Corgo, pero el bloque no lo dice).",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Observation Camera",
      "Targeting Scope"
    ],
    "specialRules": [
      "Miembro de Equipo Dron del Exec (Corgo p.5, Teamwork Rango 4+): no necesita Netrunner ni control como Personal Drone; funciona como si tuviera un Demon siempre instalado, se comunica con frases u órdenes simples y recibe órdenes como cualquier Team Member. Usa Combat Number fijo en vez de STATs/Skills, no usa Loyalty (obedece toda orden que no vaya contra la política del empleador) y tiene Acción y Acción de Movimiento normales; el DJ decide qué Acciones puede hacer según su tipo. No es discreto, siempre transmite a tu jefe y no gana IP con la Workstation HQ Upgrade.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Lleva una de las dos armas de fuego listadas; puede cambiarse durante el downtime.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Unidad más armada, del tamaño de un perro grande o un ave, pensada para repeler amenazas serias sin discreción; viene con orugas, ruedas, patas o en versión aérea.",
    "homebrew": true,
    "machine": {
      "type": "Exec Drone Team Member (tracked, wheeled, legged four/six legs, or air)",
      "move": 4,
      "size": "tamaño de un perro o ave grande"
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-support-drone",
    "name": "Support Drone",
    "subtitle": "Exec Drone Team Member",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 6,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [],
    "cyberware": [],
    "gear": [
      "Observation Camera",
      "Built-in Flashlight",
      "Chipware Compartment",
      "External Vidscreen",
      "Radio Scanner/Music Player",
      "Popup Shield OR Gas Jet [Choose One]",
      "Pursuit Security Personal Shredder",
      "PersonalPak KibbleWarmer",
      "Tool Hand",
      "Multihypo (IRV5, pg. 126) [Drugs/Pharmaceuticals must be supplied separately]"
    ],
    "specialRules": [
      "Miembro de Equipo Dron del Exec (Corgo p.5, Teamwork Rango 4+): no necesita Netrunner ni control como Personal Drone; funciona como si tuviera un Demon siempre instalado, se comunica con frases u órdenes simples y recibe órdenes como cualquier Team Member. Usa Combat Number fijo en vez de STATs/Skills, no usa Loyalty (obedece toda orden que no vaya contra la política del empleador) y tiene Acción y Acción de Movimiento normales; el DJ decide qué Acciones puede hacer según su tipo. No es discreto, siempre transmite a tu jefe y no gana IP con la Workstation HQ Upgrade.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Desarmado. Lleva Popup Shield o Gas Jet (elegir uno). Las drogas/fármacos del Multihypo se compran aparte.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Unidad aérea ágil y desarmada del tamaño de un halcón, diseñada para asistencia técnica, médica y utilitaria en el campo.",
    "homebrew": true,
    "machine": {
      "type": "Exec Drone Team Member (air)",
      "move": 8,
      "size": "tamaño de un halcón"
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-humanoid-ground-drone",
    "name": "Humanoid Ground Drone",
    "subtitle": "New Drone Type (Active Defense)",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 153,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Brawling (Robot Arms BODY 8)",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Brawling (Robot Arms BODY 8)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Inferido: tabla de daño de Brawling del Core por BODY 8; el bloque solo dice que puede hacer ataques de Brawling.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Observation Camera with Low Light/Infrared/UV",
      "Robot Arms (BODY 8)*"
    ],
    "specialRules": [
      "Robotic Hands (BODY 8) (Corgo p.153): puede empuñar y manipular cualquier arma, equipo, dispositivo u objeto como una persona con BODY 8; puede hacer ataques de Brawling, y de Martial Arts solo si tiene equipado un Skill Chip con un Arte Marcial cargado. Puede vestir Fashion y Armor (se compran aparte) y sufre los penalizadores de armadura en sus tiradas.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Nuevo tipo de dron bípedo con dos brazos y cabeza que imita la anatomía humana; es la base de los humanoides del catálogo.",
    "homebrew": true,
    "machine": {
      "type": "Humanoid Ground Drone",
      "move": 4,
      "cost": "7,500eb (Luxury)",
      "counter": "DV17 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 25m/yds desde la NET Architecture",
      "defaultTrigger": "Target enters the designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 10,
    "isNetrunner": false
  },
  {
    "id": "c77-militech-rht-1-moth",
    "name": "Militech RHT-1 Moth",
    "subtitle": "Mini Air Drone",
    "faction": "Militech",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 154,
    "role": "",
    "hp": 15,
    "seriouslyWounded": 8,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Air Pistol",
        "totalBase": 12,
        "damage": "0",
        "rof": 1
      },
      {
        "label": "Goop Launcher",
        "totalBase": 12,
        "damage": "0",
        "rof": 1
      },
      {
        "label": "Microwaver",
        "totalBase": 12,
        "damage": "0",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Air Pistol",
        "skillBase": 12,
        "damage": "0",
        "rof": 1,
        "mag": 0,
        "notes": "8 Acid Paintballs · Opción (una de tres). Las Acid Paintballs no hacen daño: marcan al blanco con pintura y bajan 1 el SP de la armadura en la zona impactada aunque no la superen (Corgo p.10). ROF/cargador del Air Pistol no impresos (arma exótica Core). No hace daño: solo el efecto que indica la ficha.",
        "skill": "Combat Number"
      },
      {
        "name": "Goop Launcher",
        "skillBase": 12,
        "damage": "0",
        "rof": 1,
        "mag": 4,
        "notes": "4 shots · Opción (una de tres). Dispara Goop a un solo blanco con la tabla de alcance de Grenade Launcher; el blanco impactado tiene -2d6 MOVE hasta que el Goop se destruya con una Acción suya o de alguien adyacente. El libro dice '4 shorts' (errata de 'shots'). No hace daño: solo el efecto que indica la ficha.",
        "skill": "Combat Number"
      },
      {
        "name": "Microwaver",
        "skillBase": 12,
        "damage": "0",
        "rof": 1,
        "mag": 4,
        "notes": "8 shots · Opción (una de tres). Arma exótica Core (CP:R p.348-349); el bloque no da daño/ROF. Microwaver del Core pp.348-349: no hace daño a HP, afecta cyberware y electrónica. Batería de 4 disparos (Corgo p.14).",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Observation Camera with Anti-Dazzle, Image Enhance, Low Light/Infrared/UV, MicroVideo, and TeleOptics",
      "Reflex Co-Processor"
    ],
    "specialRules": [
      "Reflex Co-Processor: puede intentar esquivar todos los Ataques, incluso Ataques a Distancia, aunque su usuario no pueda.",
      "Por defecto no ataca: observa y graba todo lo que ve.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Dron de Militech para reconocimiento y sabotaje de vuelo rápido; pica poco, pero acosa y observa desde lejos esquivando disparos.",
    "homebrew": true,
    "machine": {
      "type": "Mini Air Drone",
      "move": 8,
      "cost": "5,000eb (Luxury)",
      "counter": "DV17 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 50m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform. Will not attack by default, but instead observes and records all it sees."
    },
    "combatNumber": 12,
    "isNetrunner": false
  },
  {
    "id": "c77-militech-wyvern",
    "name": "Militech Wyvern",
    "subtitle": "Mini Air Drone",
    "faction": "Militech",
    "threatTier": "lieutenant",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 154,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Heavy Pistol (w/ Smart Rebuild)",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol (w/ Smart Rebuild)",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "14 Improved Smart Bullets · Tipo Core (Heavy Pistol 3d6 ROF2 mag8) + Smart Rebuild. Trae 14 Improved Smart Bullets (más que el cargador de 8).",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Folding Design",
      "Observation Camera with Low Light/Infrared/UV"
    ],
    "specialRules": [
      "Folding Design: con una Acción, un Wyvern inactivo se pliega o despliega; plegado se lleva como un maletín pero no funciona. Se activa al inicio de la Ronda siguiente a la que se usó la Acción para desplegarlo.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Dron de Militech para ejecutivos que temen que las reuniones de negocios terminen a tiros: plegado entra en un maletín y desplegado convierte a un socio terco en obediente o en cadáver.",
    "homebrew": true,
    "machine": {
      "type": "Mini Air Drone",
      "move": 4,
      "cost": "7,500eb (Luxury)",
      "counter": "DV17 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 25m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform.",
      "size": "plegado cabe en un maletín"
    },
    "combatNumber": 12,
    "isNetrunner": false
  },
  {
    "id": "c77-militech-griffin",
    "name": "Militech Griffin",
    "subtitle": "Large Air Drone",
    "faction": "Militech",
    "threatTier": "lieutenant",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 155,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Heavy SMG (w/ SMG Cyclic Internals [SMG 4])",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Heavy SMG (w/ SMG Cyclic Internals [SMG 4])",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 1,
        "mag": 40,
        "notes": "60 Armor-Piercing Bullets · Tipo Core (Heavy SMG 3d6 ROF1 mag40) + SMG Cyclic Internals: Autofire (SMG 4). Trae 60 balas AP (más que el cargador de 40).",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Observation Camera with Low Light/Infrared/UV"
    ],
    "specialRules": [
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Dron de combate de Militech pensado para reemplazar soldados humanos: barato, obediente y duradero; si comete un crimen de guerra, se culpa a un 'bug de software'.",
    "homebrew": true,
    "machine": {
      "type": "Large Air Drone",
      "move": 6,
      "cost": "15,000eb (Super Luxury)",
      "counter": "DV19 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 50m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-nomad-scout-drone",
    "name": "Nomad Scout Drone",
    "subtitle": "Large Air Drone",
    "faction": "Aldecaldos",
    "threatTier": "lieutenant",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 155,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Militech M-179e Achilles",
        "totalBase": 12,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Militech M-179e Achilles",
        "skillBase": 12,
        "damage": "5d6",
        "rof": 1,
        "mag": 9,
        "notes": "9 Armor-Piercing Bullets · Corgo p.45: EQ Sniper Rifle, alcance Marksman Rifle, 5d6 ROF1 cap 9, Tech Rebuild.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Observation Camera with Low Light/Infrared/UV and TeleOptics"
    ],
    "specialRules": [
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Dron de reconocimiento que los Aldecaldos blindan y arman con un rifle de riel militar modificado para que los raiders de los badlands no lo hackeen y se lo roben.",
    "homebrew": true,
    "machine": {
      "type": "Large Air Drone",
      "move": 8,
      "cost": "25,000eb (Super Luxury)",
      "counter": "DV21 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 100m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 12,
    "isNetrunner": false
  },
  {
    "id": "c77-robot-r-mk-2-civilian",
    "name": "Robot R Mk. 2 (Civilian)",
    "subtitle": "Humanoid Ground Drone",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 155,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Brawling (Robotic Hands BODY 8)",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Brawling (Robotic Hands BODY 8)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Inferido: tabla de daño de Brawling del Core por BODY 8; el bloque solo dice que puede hacer ataques de Brawling.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Observation Camera with Low Light/Infrared/UV",
      "Robotic Hands (BODY 8) [See Humanoid Ground Drone for rules]",
      "Subdermal Grip x2"
    ],
    "specialRules": [
      "Robotic Hands (BODY 8) (Corgo p.153): puede empuñar y manipular cualquier arma, equipo, dispositivo u objeto como una persona con BODY 8; puede hacer ataques de Brawling, y de Martial Arts solo si tiene equipado un Skill Chip con un Arte Marcial cargado. Puede vestir Fashion y Armor (se compran aparte) y sufre los penalizadores de armadura en sus tiradas.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Robot humanoide de uso general cuyo diseño un Tech vendió a seis fabricantes a la vez; trabaja en fábricas, controles de seguridad, ocupaciones militares y limpiezas peligrosas.",
    "homebrew": true,
    "machine": {
      "type": "Humanoid Ground Drone",
      "move": 4,
      "cost": "7,500eb (Luxury)",
      "counter": "DV17 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 25m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 10,
    "isNetrunner": false
  },
  {
    "id": "c77-robot-r-mk-2-security",
    "name": "Robot R Mk. 2 (Security)",
    "subtitle": "Humanoid Ground Drone",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 155,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Brawling (Robotic Hands BODY 8)",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Brawling (Robotic Hands BODY 8)",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Inferido: tabla de daño de Brawling del Core por BODY 8; el bloque solo dice que puede hacer ataques de Brawling.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Jump Boosters x2",
      "Observation Camera with Low Light/Infrared/UV",
      "Robotic Hands (BODY 8) [See Humanoid Ground Drone for rules]",
      "Subdermal Grip x2"
    ],
    "specialRules": [
      "Robotic Hands (BODY 8) (Corgo p.153): puede empuñar y manipular cualquier arma, equipo, dispositivo u objeto como una persona con BODY 8; puede hacer ataques de Brawling, y de Martial Arts solo si tiene equipado un Skill Chip con un Arte Marcial cargado. Puede vestir Fashion y Armor (se compran aparte) y sufre los penalizadores de armadura en sus tiradas.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Variante de seguridad del R Mk. 2 que cada corpo fabrica a su manera: más blindaje, propulsores hidráulicos y mejor software; un droide de combate correcto que no arruina el presupuesto corporativo.",
    "homebrew": true,
    "machine": {
      "type": "Humanoid Ground Drone",
      "move": 4,
      "cost": "15,000eb (Super Luxury)",
      "counter": "DV21 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 25m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 12,
    "isNetrunner": false
  },
  {
    "id": "c77-arasaka-patrol-robot-r-mk-2",
    "name": "Arasaka Patrol Robot R Mk. 2",
    "subtitle": "Humanoid Ground Drone",
    "faction": "Arasaka",
    "threatTier": "lieutenant",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 156,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Arasaka HJSH-18 Masamune",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Arasaka Shigure (w/ Shrieker Underbarrel)",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Arasaka TKI-20 Shingen",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Brawling (Robotic Hands BODY 8)",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Arasaka HJSH-18 Masamune",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 1,
        "mag": 24,
        "notes": "24 Basic Bullets · Opción (una de tres). Corgo p.37: EQ Assault Rifle, alcance Battle Rifle, 5d6 ROF1 cap 24, Power Rebuild + Smartgun Link.",
        "skill": "Combat Number"
      },
      {
        "name": "Arasaka Shigure (w/ Shrieker Underbarrel)",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 50,
        "notes": "50 Armor-Piercing Bullets · Opción (una de tres). Corgo p.31: Heavy SMG 3d6 ROF2 cap 50, Autofire (SMG 4) gastando 15 balas, Suppressive Fire. Shrieker Underbarrel (Corgo p.15): empuñada a dos manos también dispara como Shrieker (CP:R p.349), batería recargable de 4 disparos.",
        "skill": "Combat Number"
      },
      {
        "name": "Arasaka TKI-20 Shingen",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 30,
        "notes": "30 Improved Smart Bullets · Opción (una de tres). Corgo p.32: EQ Heavy SMG, alcance Subcompact SMG, 4d6 ROF1 cap 30, Autofire (SMG 4), Suppressive Fire; Single Shot gasta ráfaga de 3 balas; Efficient Autosear + Smart Rebuild.",
        "skill": "Combat Number"
      },
      {
        "name": "Brawling (Robotic Hands BODY 8)",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Inferido: tabla de daño de Brawling del Core por BODY 8; el bloque solo dice que puede hacer ataques de Brawling.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Jump Boosters x2",
      "Observation Camera with Low Light/Infrared/UV and Targeting Scope",
      "Robotic Hands (BODY 8) [See Humanoid Ground Drone for rules]",
      "Subdermal Grip x2"
    ],
    "specialRules": [
      "Robotic Hands (BODY 8) (Corgo p.153): puede empuñar y manipular cualquier arma, equipo, dispositivo u objeto como una persona con BODY 8; puede hacer ataques de Brawling, y de Martial Arts solo si tiene equipado un Skill Chip con un Arte Marcial cargado. Puede vestir Fashion y Armor (se compran aparte) y sufre los penalizadores de armadura en sus tiradas.",
      "Puede empuñar cualquier Arma a Distancia que no requiera BODY 9+; normalmente lleva una de las tres listadas.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Robot propio de Arasaka: menos resistente y con menos potencia de fuego que competidores militares, pero con mejor programación y diseño de blindaje.",
    "homebrew": true,
    "machine": {
      "type": "Humanoid Ground Drone",
      "move": 5,
      "cost": "22,500eb (Super Luxury)",
      "counter": "DV21 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 25m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-ncpd-patrol-recon-mech",
    "name": "NCPD Patrol Recon Mech (PRM)",
    "subtitle": "Humanoid Ground Drone",
    "faction": "NCPD",
    "threatTier": "mini_boss",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 156,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 0,
    "headSp": 15,
    "bodySp": 15,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Militech M221 Saratoga (Military) (w/ Extended Magazine)",
        "totalBase": 14,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Militech M251s Ajax",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Tsunami Kyubi",
        "totalBase": 14,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "Brawling (Robotic Hands BODY 8)",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Militech M221 Saratoga (Military) (w/ Extended Magazine)",
        "skillBase": 14,
        "damage": "2d6",
        "rof": 2,
        "mag": 50,
        "notes": "50 Armor-Piercing Bullets · Opción (una de tres). Corgo p.34: SMG, alcance Subcompact SMG, 2d6 ROF2 cap 40 (+10 Extended Magazine = 50), Autofire (SMG 4), Suppressive Fire; Excellent Quality a dos manos (Foregrip).",
        "skill": "Combat Number"
      },
      {
        "name": "Militech M251s Ajax",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 1,
        "mag": 30,
        "notes": "30 Basic Bullets · Opción (una de tres). Corgo p.39: EQ Assault Rifle 5d6 ROF1 cap 30, Autofire (Assault Rifle 4), Suppressive Fire, Power Rebuild.",
        "skill": "Combat Number"
      },
      {
        "name": "Tsunami Kyubi",
        "skillBase": 14,
        "damage": "6d6",
        "rof": 1,
        "mag": 20,
        "notes": "20 Basic Bullets · Opción (una de tres). Corgo p.41 ('Tsunami Arms Kyubi'): EQ Assault Rifle, alcance Marksman Rifle, 6d6 descartando el dado más bajo, ROF1 cap 20, Power Rebuild.",
        "skill": "Combat Number"
      },
      {
        "name": "Brawling (Robotic Hands BODY 8)",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Inferido: tabla de daño de Brawling del Core por BODY 8; el bloque solo dice que puede hacer ataques de Brawling.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Jump Boosters x2",
      "Observation Camera with Anti-Dazzle, Low Light/Infrared/UV, and Targeting Scope",
      "Radio Communicator",
      "Robotic Hands (BODY 8) [See Humanoid Ground Drone for rules]",
      "Subdermal Grip x2"
    ],
    "specialRules": [
      "Robotic Hands (BODY 8) (Corgo p.153): puede empuñar y manipular cualquier arma, equipo, dispositivo u objeto como una persona con BODY 8; puede hacer ataques de Brawling, y de Martial Arts solo si tiene equipado un Skill Chip con un Arte Marcial cargado. Puede vestir Fashion y Armor (se compran aparte) y sufre los penalizadores de armadura en sus tiradas.",
      "Puede empuñar cualquier Arma a Distancia que no requiera BODY 9+; normalmente lleva una de las tres listadas.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Uno de los primeros androides que compró la NCPD (diseñado por Raven Microcybernetics), con un software sorprendentemente independiente; hoy se usa como 'compañero robot' de detectives solitarios y cazarrecompensas.",
    "homebrew": true,
    "machine": {
      "type": "Humanoid Ground Drone",
      "move": 4,
      "cost": "30,000eb (Super Luxury)",
      "counter": "DV21 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 50m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-streetbot",
    "name": "Streetbot",
    "subtitle": "Humanoid Ground Drone",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 156,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Brawling (Robotic Hands BODY 6)",
        "totalBase": 10,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Brawling (Robotic Hands BODY 6)",
        "skillBase": 10,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "Inferido: tabla de daño de Brawling del Core por BODY 6; el bloque solo dice que puede hacer ataques de Brawling.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Observation Camera with Low Light/Infrared/UV",
      "Robotic Hands (BODY 6) [See Humanoid Ground Drone for rules]",
      "Subdermal Grip x2"
    ],
    "specialRules": [
      "Robotic Hands (BODY 6) (Corgo p.153): puede empuñar y manipular cualquier arma, equipo, dispositivo u objeto como una persona con BODY 6; puede hacer ataques de Brawling, y de Martial Arts solo si tiene equipado un Skill Chip con un Arte Marcial cargado. Puede vestir Fashion y Armor (se compran aparte) y sufre los penalizadores de armadura en sus tiradas.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Robot armado con chatarra e hidráulica barata que pandillas y techies usan como carne de cañón, ayudante o proxy remoto de bajo costo.",
    "homebrew": true,
    "machine": {
      "type": "Humanoid Ground Drone",
      "move": 3,
      "cost": "2,500eb (Very Expensive)",
      "counter": "DV13 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 25m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 10,
    "isNetrunner": false
  },
  {
    "id": "c77-superheavy-droid",
    "name": "Superheavy Droid",
    "subtitle": "Humanoid Ground Drone",
    "faction": "",
    "threatTier": "mini_boss",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 157,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 0,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Brawling (Robotic Hands BODY 12)",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Brawling (Robotic Hands BODY 12)",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 2,
        "mag": 0,
        "notes": "Inferido: tabla de daño de Brawling del Core por BODY 12; el bloque solo dice que puede hacer ataques de Brawling.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Improved Hydraulics",
      "Jump Boosters x2",
      "Observation Camera with Anti-Dazzle, Low Light/Infrared/UV, and Targeting Scope",
      "Robotic Hands (BODY 12) [See Humanoid Ground Drone for rules]",
      "Subdermal Grip x2"
    ],
    "specialRules": [
      "Improved Hydraulics: todas sus extremidades cuentan como Cyberlimbs con Reinforced Cyberlimb Upgrade, por lo que no puede sufrir las Heridas Críticas Broken Arm/Broken Leg.",
      "Robotic Hands (BODY 12) (Corgo p.153): puede empuñar y manipular cualquier arma, equipo, dispositivo u objeto como una persona con BODY 12; puede hacer ataques de Brawling, y de Martial Arts solo si tiene equipado un Skill Chip con un Arte Marcial cargado. Puede vestir Fashion y Armor (se compran aparte) y sufre los penalizadores de armadura en sus tiradas.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Droide de combate pesado de materiales superiores, hidráulica mejorada y gran software; lento y caro, suele usarse como guardaespaldas exagerado (Servicio Secreto de la NUSA, MAX-TAC).",
    "homebrew": true,
    "machine": {
      "type": "Humanoid Ground Drone",
      "move": 3,
      "cost": "35,000eb (Super Luxury)",
      "counter": "DV21 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: 25m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-superheavy-droid-max-tac",
    "name": "Superheavy Droid (MAX-TAC)",
    "subtitle": "Humanoid Ground Drone",
    "faction": "MAX-TAC",
    "threatTier": "mini_boss",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 157,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 0,
    "headSp": 14,
    "bodySp": 14,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Brawling (Robotic Hands BODY 12)",
        "totalBase": 16,
        "damage": "4d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 16
      }
    ],
    "weapons": [
      {
        "name": "Brawling (Robotic Hands BODY 12)",
        "skillBase": 16,
        "damage": "4d6",
        "rof": 2,
        "mag": 0,
        "notes": "Inferido: tabla de daño de Brawling del Core por BODY 12; el bloque solo dice que puede hacer ataques de Brawling.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Improved Hydraulics",
      "Jump Boosters x2",
      "Nanoweave Plates",
      "Observation Camera with Anti-Dazzle, Low Light/Infrared/UV, and Targeting Scope",
      "Robotic Hands (BODY 12) [See Humanoid Ground Drone for rules]",
      "Subdermal Grip x2"
    ],
    "specialRules": [
      "Improved Hydraulics: todas sus extremidades cuentan como Cyberlimbs con Reinforced Cyberlimb Upgrade, por lo que no puede sufrir las Heridas Críticas Broken Arm/Broken Leg.",
      "Nanoweave Plates: toda ablación de SP por ataques/Special Moves de Brawling, Melee Weapon y Martial Arts se reduce en 1 (mínimo 0). La ablación por Armas a Distancia no cambia.",
      "Robotic Hands (BODY 12) (Corgo p.153): puede empuñar y manipular cualquier arma, equipo, dispositivo u objeto como una persona con BODY 12; puede hacer ataques de Brawling, y de Martial Arts solo si tiene equipado un Skill Chip con un Arte Marcial cargado. Puede vestir Fashion y Armor (se compran aparte) y sufre los penalizadores de armadura en sus tiradas.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Versión del Superheavy Droid que MAX-TAC endureció todavía más; fuera del alcance de cualquier bolsillo y casi imposible de rayar.",
    "homebrew": true,
    "machine": {
      "type": "Humanoid Ground Drone",
      "move": 3,
      "cost": "50,000eb (Super Luxury)",
      "counter": "DV24 Electronics/Security Tech, 10 min to counter",
      "range": "Edificio: perímetro; NET portátil: 50m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 16,
    "isNetrunner": false
  },
  {
    "id": "c77-upgraded-security-bot",
    "name": "Upgraded Security Bot",
    "subtitle": "Humanoid Ground Drone",
    "faction": "Carolli",
    "threatTier": "mini_boss",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 157,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 0,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Brawling (Robotic Hands BODY 8)",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Combat Number",
        "totalBase": 16
      }
    ],
    "weapons": [
      {
        "name": "Brawling (Robotic Hands BODY 8)",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Inferido: tabla de daño de Brawling del Core por BODY 8; el bloque solo dice que puede hacer ataques de Brawling.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Amplified Hearing",
      "Jump Boosters x2",
      "Observation Camera with Anti-Dazzle, Low Light/Infrared/UV, Targeting Scope, and TeleOptics",
      "Radar/Sonar Implant & Radar Detector",
      "Robotic Hands (BODY 8) [See Humanoid Ground Drone for rules]",
      "Subdermal Grip x2"
    ],
    "specialRules": [
      "Robotic Hands (BODY 8) (Corgo p.153): puede empuñar y manipular cualquier arma, equipo, dispositivo u objeto como una persona con BODY 8; puede hacer ataques de Brawling, y de Martial Arts solo si tiene equipado un Skill Chip con un Arte Marcial cargado. Puede vestir Fashion y Armor (se compran aparte) y sufre los penalizadores de armadura en sus tiradas.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Androide de autodefensa de lujo de Carolli y Hollis (2075), reconstruido desde cero sobre un R Mk. 2 con mucha más velocidad, blindaje e inteligencia.",
    "homebrew": true,
    "machine": {
      "type": "Humanoid Ground Drone",
      "move": 6,
      "cost": "50,000eb (Super Luxury)",
      "counter": "DV24 Electronics/Security Tech, 10 min to counter",
      "range": "Edificio: perímetro; NET portátil: 50m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 16,
    "isNetrunner": false
  },
  {
    "id": "c77-zetatech-octant",
    "name": "Zetatech Octant",
    "subtitle": "Large Air Drone",
    "faction": "Zetatech",
    "threatTier": "lieutenant",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 158,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Machine Gun (Autofire [Machine Gun 4] only)",
        "totalBase": 14,
        "damage": "2d6",
        "rof": 1
      },
      {
        "label": "Very Heavy Pistol",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Shrieker",
        "totalBase": 14,
        "damage": "0",
        "rof": 1
      },
      {
        "label": "Authority Double-Boom",
        "totalBase": 14,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Machine Gun (Autofire [Machine Gun 4] only)",
        "skillBase": 14,
        "damage": "2d6",
        "rof": 1,
        "mag": 0,
        "notes": "60 Armor-Piercing or Tracer Bullets · Fija. Solo Autofire (Machine Gun 4): daño 2d6 × multiplicador (máx ×4) según la regla Core de Autofire; el bloque no imprime daño.",
        "skill": "Combat Number"
      },
      {
        "name": "Very Heavy Pistol",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "8 Armor-Piercing or Explosive Bullets · Opción adicional (una de tres). Tipo Core (Very Heavy Pistol 4d6 ROF1 mag8).",
        "skill": "Combat Number"
      },
      {
        "name": "Shrieker",
        "skillBase": 14,
        "damage": "0",
        "rof": 1,
        "mag": 4,
        "notes": "8 shots · Opción adicional (una de tres). Arma exótica Core (CP:R p.349); el bloque no da daño/ROF. Shrieker del Core p.349: no hace daño a HP, ensordece. Batería de 4 disparos (Corgo p.15).",
        "skill": "Combat Number"
      },
      {
        "name": "Authority Double-Boom",
        "skillBase": 14,
        "damage": "6d6",
        "rof": 1,
        "mag": 2,
        "notes": "1 Smoke Grenade and 1 Teargas Grenade · Opción adicional (una de tres). Corgo p.49: Grenade Launcher, Heavy Weapons, 6d6 ROF1 cap 2, Power Rebuild. Con granadas de humo/lacrimógenas el efecto depende de la granada.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Flares",
      "Observation Camera with Low Light/Infrared/UV",
      "Radar/Sonar Implant & Radar Detector"
    ],
    "specialRules": [
      "Flares: una vez por Ronda puede intentar esquivar un Explosivo (no otro tipo de Ataque a Distancia) aunque su operador no pueda.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Dron aéreo de Zetatech adorado por dictadores para dispersar protestas y borrar células rebeldes desde el aire; lo usan Arasaka, Militech, Kang Tao, Trauma Team y la Border Patrol.",
    "homebrew": true,
    "machine": {
      "type": "Large Air Drone (about the size of a small car)",
      "move": 6,
      "cost": "20,000eb (Super Luxury)",
      "counter": "DV21 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: hasta 25m/yds del perímetro; NET portátil: hasta 50m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform.",
      "size": "tamaño de un auto pequeño"
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-militech-minotaur",
    "name": "Militech Minotaur",
    "subtitle": "Large Two-Legged Ground Drone",
    "faction": "Militech",
    "threatTier": "mini_boss",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 158,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 0,
    "headSp": 16,
    "bodySp": 16,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Hydraulic Legs",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Militech Mk.31 HMG (w/ Smart Rebuild instead of a Power Rebuild)",
        "totalBase": 14,
        "damage": "2d6",
        "rof": 1
      },
      {
        "label": "EQ Grenade Launcher (w/ Smart Rebuild)",
        "totalBase": 14,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "EQ Rocket Launcher (w/ Extended Magazine, Long Tube, & Smart Rebuild)",
        "totalBase": 14,
        "damage": "8d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Hydraulic Legs",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Cada pata = Very Heavy Melee Weapon de ROF 1 (tipo Core 4d6).",
        "skill": "Combat Number"
      },
      {
        "name": "Militech Mk.31 HMG (w/ Smart Rebuild instead of a Power Rebuild)",
        "skillBase": 14,
        "damage": "2d6",
        "rof": 1,
        "mag": 300,
        "notes": "50 Improved Smart Bullets · Opción (lleva dos, se permiten repetidas). Corgo p.43: Excellent Quality Machine Gun, cap 300, solo Autofire (Machine Gun 5) y Suppressive Fire, 20 balas por uso; si supera la DV por solo 1 el Autofire aún es x2. Daño 'N/A': se usa 2d6 × multiplicador (regla Core de Autofire).",
        "skill": "Combat Number"
      },
      {
        "name": "EQ Grenade Launcher (w/ Smart Rebuild)",
        "skillBase": 14,
        "damage": "6d6",
        "rof": 1,
        "mag": 2,
        "notes": "2 EMP, Smoke, or Teargas Grenades · Opción (lleva dos). Tipo Core (Grenade Launcher 6d6 ROF1 mag2); el efecto real depende de la granada (EMP/humo/lacrimógena).",
        "skill": "Combat Number"
      },
      {
        "name": "EQ Rocket Launcher (w/ Extended Magazine, Long Tube, & Smart Rebuild)",
        "skillBase": 14,
        "damage": "8d6",
        "rof": 1,
        "mag": 2,
        "notes": "2 Improved Smart Rockets · Opción (lleva dos). Tipo Core (Rocket Launcher 8d6 ROF1 mag1) +1 por Extended Magazine (tabla de Corgo) = 2.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Hydraulic Legs",
      "Observation Camera with Low Light/Infrared/UV",
      "Spotlights"
    ],
    "specialRules": [
      "Hydraulic Legs: cada pata funciona como Arma Cuerpo a Cuerpo Muy Pesada de ROF 1 y cuenta como Cyberleg a efectos de Daño por Caída.",
      "Spotlights: funciona como una Flashlight grande que ilumina un callejón entero; una vez por hora puede usarse también como Flashbulb (BC, pg. 18).",
      "Puede equiparse con cualquier Arma a Distancia como si tuviera dos Vehicle Heavy Weapon Mounts; normalmente lleva dos de las listadas (se permiten repetidas).",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Plataforma de combate urbano de Militech, un éxito de ventas de los 2070 presente en ejércitos de todo el mundo, con variantes de blindaje, ECM/ECCM y armas intercambiables.",
    "homebrew": true,
    "machine": {
      "type": "Large Two-Legged Ground Drone",
      "move": 4,
      "cost": "20,000eb (Super Luxury)",
      "counter": "DV21 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: hasta 50m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-arasaka-shinsengumi",
    "name": "Arasaka Shinsengumi",
    "subtitle": "Large Two-Legged Ground Drone",
    "faction": "Arasaka",
    "threatTier": "mini_boss",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 158,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 0,
    "headSp": 16,
    "bodySp": 16,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Hydraulic Legs",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Arasaka TKI-20 Shingen",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Oni Autoshotgun",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 2
      },
      {
        "label": "EQ Flamethrower (w/ Shotgun Rechamber)",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "EQ Grenade Launcher (w/ Smart Rebuild)",
        "totalBase": 14,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Hydraulic Legs",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Cada pata = Very Heavy Melee Weapon de ROF 1 (tipo Core 4d6).",
        "skill": "Combat Number"
      },
      {
        "name": "Arasaka TKI-20 Shingen",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 30,
        "notes": "40 Improved Smart Bullets · Opción (lleva dos, se permiten repetidas). Corgo p.32: EQ Heavy SMG 4d6 ROF1 cap 30, Autofire (SMG 4), Suppressive Fire, Smart Rebuild.",
        "skill": "Combat Number"
      },
      {
        "name": "Oni Autoshotgun",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 2,
        "mag": 16,
        "notes": "16 Hyper-Expansive or Improved Smart Shells · Opción (lleva dos). EQ ROF 2 Shotgun (w/ Shotgun Automatic Control Group, Shotgun Rechamber, & Smart Rebuild) con capacidad de 16 solo para cartuchos (Shells). Daño tipo Core Shotgun 5d6; con Shells el daño real puede ser el de cartucho.",
        "skill": "Combat Number"
      },
      {
        "name": "EQ Flamethrower (w/ Shotgun Rechamber)",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 1,
        "mag": 4,
        "notes": "4 Incendiary Shells · Opción (lleva dos). Flamethrower Core (CP:R p.348); el bloque no da daño/ROF. Flamethrower del Core p.95: escopeta que solo dispara cartuchos incendiarios (3d6 en área). Valor a confirmar.",
        "skill": "Combat Number"
      },
      {
        "name": "EQ Grenade Launcher (w/ Smart Rebuild)",
        "skillBase": 14,
        "damage": "6d6",
        "rof": 1,
        "mag": 2,
        "notes": "2 Sonic Grenades · Opción (lleva dos). Tipo Core (Grenade Launcher 6d6 ROF1 mag2); efecto según la granada sónica.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Hydraulic Legs",
      "Observation Camera with Low Light/Infrared/UV & Targeting Scope",
      "Rangeguard",
      "Spotlights"
    ],
    "specialRules": [
      "Hydraulic Legs: cada pata funciona como Arma Cuerpo a Cuerpo Muy Pesada de ROF 1 y cuenta como Cyberleg a efectos de Daño por Caída.",
      "Spotlights: funciona como una Flashlight grande que ilumina un callejón entero; una vez por hora puede usarse también como Flashbulb (BC, pg. 18).",
      "Rangeguard: toda ablación de SP por Armas a Distancia (excepto Ácido) se reduce en 1 (mínimo 0).",
      "Puede equiparse con dos Armas a Distancia cualesquiera; normalmente lleva dos de las listadas (se permiten repetidas).",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Dron antidisturbios de Arasaka, evidentemente basado en el Minotaur de Militech; rarísimo tras perderse casi todos sus prototipos en Night City, se ve sobre todo en protestas de Tokio.",
    "homebrew": true,
    "machine": {
      "type": "Large Two-Legged Ground Drone",
      "move": 4,
      "cost": "30,000eb (Super Luxury)",
      "counter": "DV24 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; NET portátil: hasta 50m/yds desde el origen",
      "defaultTrigger": "Target enters a designated area without a proper badge, ID, or uniform."
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-militech-netwatch-cerberus",
    "name": "Militech/NetWatch Cerberus",
    "subtitle": "4-Legged Ground Drone",
    "faction": "Militech/NetWatch",
    "threatTier": "mini_boss",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 159,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 0,
    "headSp": 18,
    "bodySp": 18,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Leg Drills x2",
        "totalBase": 18,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 18
      }
    ],
    "weapons": [
      {
        "name": "Leg Drills x2",
        "skillBase": 18,
        "damage": "6d6",
        "rof": 1,
        "mag": 0,
        "notes": "Uno por pata delantera; cada uno es Arma Cuerpo a Cuerpo de ROF 1 que hace 6d6 (impreso en el bloque).",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Electric Dampeners",
      "Leg Drills x2 (One per front leg)",
      "Magnetic Clamps",
      "Manipulator Arms x4",
      "Observation Camera with Low Light/Infrared/UV",
      "Techscanner & Techtool",
      "Shock Absorbers"
    ],
    "specialRules": [
      "Electric Dampeners: el dron y su equipo son inmunes a EMP, Electrocución, Microwavers y cualquier efecto inhabilitante similar.",
      "Magnetic Clamps: ignora todo penalizador de movimiento al trepar superficies metálicas, incluidos techos.",
      "Manipulator Arms x4: puede usar las Acciones Grab, Choke y Throw y manipular objetos/personas como si tuviera BODY 16 y cuatro brazos.",
      "Shock Absorbers: cada pata cuenta como Cyberleg a efectos de Daño por Caída.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Robot de mantenimiento ultraavanzado de Militech, por años solo prototipo en sus instalaciones de investigación; algunas versiones, casi indestructibles y con IA integrada, mantienen núcleos incluso en la Luna.",
    "homebrew": true,
    "machine": {
      "type": "4-Legged Ground Drone (About the size of a small car)",
      "move": 8,
      "cost": "75,000eb (Super Luxury)",
      "counter": "DV29 Electronics/Security Tech, 10 min to counter",
      "range": "Edificio: perímetro; no puede conectarse a una NET Architecture portátil",
      "defaultTrigger": "Target enters the designated area without a proper badge, ID, or uniform.",
      "size": "tamaño de un auto pequeño"
    },
    "combatNumber": 18,
    "isNetrunner": false
  },
  {
    "id": "c77-militech-chimera",
    "name": "Militech Chimera",
    "subtitle": "Six-Legged Superheavy Ground Drone",
    "faction": "Militech",
    "threatTier": "boss",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 159,
    "role": "",
    "hp": 200,
    "seriouslyWounded": 100,
    "deathSave": 0,
    "headSp": 18,
    "bodySp": 18,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Hydraulic Legs",
        "totalBase": 18,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "GD27-Aangstschema Launcher",
        "totalBase": 18,
        "damage": "8d6",
        "rof": 1
      },
      {
        "label": "KL-274XYA Flechette Cannon",
        "totalBase": 18,
        "damage": "2d6",
        "rof": 1
      },
      {
        "label": "PAN-12 Furia Laser Cannon",
        "totalBase": 18,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 18
      }
    ],
    "weapons": [
      {
        "name": "Hydraulic Legs",
        "skillBase": 18,
        "damage": "6d6",
        "rof": 1,
        "mag": 0,
        "notes": "Cada una de sus seis patas es también Arma Cuerpo a Cuerpo de ROF 1 que hace 6d6 (impreso en el bloque).",
        "skill": "Combat Number"
      },
      {
        "name": "GD27-Aangstschema Launcher",
        "skillBase": 18,
        "damage": "8d6",
        "rof": 1,
        "mag": 20,
        "notes": "20 Improved Smart Rockets (pre-loaded) · Corgo p.159: Rocket Launcher, skill Heavy Weapons, alcance Rocket Launcher, Smart Rebuild. Solo carga Improved Smart Rockets; gasta 5 cohetes por disparo y tira el daño por separado para cada blanco impactado; quien intente esquivar sus Explosivos tiene -2. Solo funciona instalado en un Chimera.",
        "skill": "Combat Number"
      },
      {
        "name": "KL-274XYA Flechette Cannon",
        "skillBase": 18,
        "damage": "2d6",
        "rof": 1,
        "mag": 2000,
        "notes": "2,000 rounds · Corgo p.159: Machine Gun, solo Autofire (Machine Gun 6) y Suppressive Fire, 200 balas por uso; si supera la DV por solo 1 el Autofire aún es x2. Toda su munición es Incendiaria y actúa como Explosivo contra Cobertura (traslada daño a quien está detrás). Daño 'N/A' en el libro: se usa 2d6 × multiplicador (regla Core de Autofire). Solo funciona instalado en un Chimera.",
        "skill": "Combat Number"
      },
      {
        "name": "PAN-12 Furia Laser Cannon",
        "skillBase": 18,
        "damage": "6d6",
        "rof": 1,
        "mag": 0,
        "notes": "Sin munición (no se recarga) · Corgo p.160: Grenade Launcher, skill Heavy Weapons, alcance Rocket Launcher. Modo Burst: rayos cortos que funcionan como Improved EMP Grenades en un área de 6x6m/yds (3x3 casillas). Modo Continuous: rayo único que afecta un área de 10x10m/yds (5x5) como Explosivo, ignora toda armadura de SP 13 o menos y hace doble daño a Cobertura (solo Cobertura); tras cada disparo Continuous debe enfriarse 6 segundos (2 Rondas). No gasta munición ni se recarga. Solo funciona instalado en un Chimera.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Advanced L2 Explosive Reactive Armor",
      "Hydraulic Legs",
      "GD27-Aangstschema Launcher (See Below)",
      "KL-274XYA Flechette Cannon (See Below)",
      "Observation Camera with Anti-Dazzle & Low Light/Infrared/UV",
      "PAN-12 Furia Laser Cannon (See Below)",
      "TUp (100m/yds range) Radar/Sonar System & Radar Detector",
      "Repair Drones",
      "TYA-12 ICE Cyberdefense System"
    ],
    "specialRules": [
      "Advanced L2 Explosive Reactive Armor: su SP no se reduce a la mitad por ataques Melee o de Martial Arts, y toda ablación de SP por Explosivos se reduce en 1 (mínimo 0).",
      "Repair Drones: lleva y guarda hasta 4 Militech Griffin (equipo estándar) y 2 Militech Wyvern, que despliega automáticamente al quedar en 30 HP o menos. Los Wyvern van sin armas pero reparan al Chimera 10 HP por Turno que dediquen a ello; los Griffin defienden a los Wyvern hasta que el Chimera vuelva a tener al menos 50 HP, y entonces todos se reacoplan y se desactivan.",
      "TYA-12 ICE Cyberdefense System: un Demon 'Phaeton' personalizado [REZ 40, Interface 8, 4 NET Actions, Combat Number 18] defiende siempre el Control Node del Chimera de Netrunners hostiles y opera los drones que despliegue. No puede funcionar fuera de un Chimera.",
      "Ocupa un área de 10x10m/yds (5x5 casillas) centrada en sí mismo; puede trepar pendientes de 87 grados.",
      "Defensa Activa (Corgo p.153, 'New-Age Automata'): conectada a una NET Architecture estática funciona como en el Core; controlada por un Netrunner con Control Interface puede estar en cualquier punto dentro de su alcance de Jack In (superando el rango de la arquitectura mientras dure el control directo); sin control directo sigue las últimas órdenes de un Netrunner o Demon, solo reacciona si es amenazada o recibe nuevas órdenes, y usa su Combat Number para todas sus tiradas (con un Demon usa el CN del Demon).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "La unidad autónoma de guerra urbana definitiva de Militech (2065-2069), con IA aprobada por NetWatch y núcleo de energía experimental; solo se fabricaron 13.",
    "homebrew": true,
    "machine": {
      "type": "Six-Legged Superheavy Ground Drone",
      "move": 3,
      "cost": "250,000eb (Super Luxury)",
      "counter": "DV29 Electronics/Security Tech, 10 min to counter",
      "range": "Edificio: 25m/yds desde el perímetro; NET portátil: 100m/yds desde el origen",
      "defaultTrigger": "Target enters the designated area without a proper badge, ID, or uniform.",
      "size": "10x10m/yds (5x5 squares) centrado en sí mismo"
    },
    "combatNumber": 18,
    "isNetrunner": false
  },
  {
    "id": "c77-kang-tao-talon",
    "name": "Kang Tao Talon",
    "subtitle": "Emplaced Defense",
    "faction": "Kang Tao",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 160,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 0,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [],
    "cyberware": [],
    "gear": [
      "Folding Legs",
      "Observation Camera with Low Light/Infrared/UV",
      "Turret Mount"
    ],
    "specialRules": [
      "Folding Legs: solo puede colocarse en el suelo sobre una superficie plana (no se empotra en techos ni paredes). Montar o desmontar un Talon inactivo lleva 2 Acciones y cargarlo reduce el MOVE del portador en 2. No funciona desmontado.",
      "Turret Mount: puede instalar y usar cualquier Arma a Distancia como si fuera un Vehicle Heavy Weapon Mount. Las armas instaladas pueden arrancarse con una prueba de BODY DV15, lo que destruye el montaje.",
      "Sin arma de fábrica: el comprador instala el arma en el Turret Mount.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Torreta modular de Kang Tao que se puede desplegar y conectar rápido a una arquitectura de red; viene sin armas, por eso las versiones armadas de Militech la superan en ventas.",
    "homebrew": true,
    "machine": {
      "type": "Emplaced Defense",
      "cost": "1,000eb (V. Expensive)",
      "counter": "DV17 Electronics/Security Tech, 5 min to counter",
      "defaultTrigger": "Target enters room without wearing a proper pass, ID, or badge. Continues to fire until target is dead, no longer in range, or a proper badge is presented."
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-militech-aegis-x2",
    "name": "Militech Aegis X2",
    "subtitle": "Emplaced Defense",
    "faction": "Militech",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 160,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 0,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Militech Mk.31 HMG",
        "totalBase": 14,
        "damage": "2d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Militech Mk.31 HMG",
        "skillBase": 14,
        "damage": "2d6",
        "rof": 1,
        "mag": 300,
        "notes": "300 Armor-Piercing Bullets · Instalada en el Turret Mount. Corgo p.43: Excellent Quality Machine Gun, cap 300, solo Autofire (Machine Gun 5) y Suppressive Fire, 20 balas por uso; si supera la DV por solo 1 el Autofire aún es x2; recargar lleva 3 Acciones de Recarga. Daño 'N/A': 2d6 × multiplicador (regla Core de Autofire).",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Folding Legs",
      "Observation Camera with Low Light/Infrared/UV",
      "Turret Mount (w/ Militech Mk.31 HMG [w/ 300 Armor-Piercing Bullets])"
    ],
    "specialRules": [
      "Folding Legs: solo puede colocarse en el suelo sobre una superficie plana (no se empotra en techos ni paredes). Montar o desmontar un Aegis inactivo lleva 2 Acciones y cargarlo reduce el MOVE del portador en 2. No funciona desmontado.",
      "Turret Mount: puede instalar y usar cualquier Arma a Distancia como si fuera un Vehicle Heavy Weapon Mount. Las armas instaladas pueden arrancarse con una prueba de BODY DV15, lo que destruye el montaje.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Reconstrucción de Militech del Talon: lo mismo con algo de blindaje y una ametralladora pesada atornillada, con la potencia de fuego de un helicóptero de ataque.",
    "homebrew": true,
    "machine": {
      "type": "Emplaced Defense",
      "cost": "10,000eb (Super Luxury)",
      "counter": "DV17 Electronics/Security Tech, 5 min to counter",
      "defaultTrigger": "Target enters room without wearing a proper pass, ID, or badge. Continues to fire until target is dead, no longer in range, or a proper badge is presented."
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-militech-theseus",
    "name": "Militech Theseus",
    "subtitle": "Emplaced Defense",
    "faction": "Militech",
    "threatTier": "lieutenant",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 160,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 0,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Authority Double-Boom Grenade Launcher",
        "totalBase": 16,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "Militech Mk.31 HMG",
        "totalBase": 16,
        "damage": "2d6",
        "rof": 1
      },
      {
        "label": "Militech M-120 Hydra",
        "totalBase": 16,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Militech M-179e Achilles",
        "totalBase": 16,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 16
      }
    ],
    "weapons": [
      {
        "name": "Authority Double-Boom Grenade Launcher",
        "skillBase": 16,
        "damage": "6d6",
        "rof": 1,
        "mag": 2,
        "notes": "1 Smoke Grenade and 1 Teargas Grenade · Opción (lleva dos, sin repetir). Corgo p.49 ('Authority Double-Boom'): Grenade Launcher 6d6 ROF1 cap 2; efecto según granada.",
        "skill": "Combat Number"
      },
      {
        "name": "Militech Mk.31 HMG",
        "skillBase": 16,
        "damage": "2d6",
        "rof": 1,
        "mag": 300,
        "notes": "300 Armor-Piercing Bullets · Opción (lleva dos, sin repetir). Corgo p.43: solo Autofire (Machine Gun 5)/Suppressive, 20 balas por uso; daño 'N/A' → 2d6 × multiplicador (regla Core).",
        "skill": "Combat Number"
      },
      {
        "name": "Militech M-120 Hydra",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 1,
        "mag": 8,
        "notes": "8 Incendiary Shells · Opción (lleva dos, sin repetir). Corgo p.36: EQ Shotgun, alcance Shotgun Long Barrel, 5d6 ROF1 cap 8, Autofire (Machine Pistol 4), Shotgun Shell (4d6). Con Shells el daño es 4d6.",
        "skill": "Combat Number"
      },
      {
        "name": "Militech M-179e Achilles",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 1,
        "mag": 9,
        "notes": "9 Armor-Piercing Bullets · Opción (lleva dos, sin repetir). Corgo p.45: EQ Sniper Rifle, alcance Marksman Rifle, 5d6 ROF1 cap 9, Tech Rebuild.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Heavy Folding Legs",
      "Observation Camera with Low Light/Infrared/UV",
      "Popup Shield"
    ],
    "specialRules": [
      "Heavy Folding Legs: solo en el suelo sobre superficie plana. Montar o desmontar un Theseus lleva 3 Acciones y cargarlo reduce el MOVE en 4 (o en 2 si el portador tiene BODY 13+). No funciona desmontado.",
      "Puede equiparse con hasta dos Armas a Distancia cualesquiera; normalmente lleva dos de las listadas (sin repetir).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Alternativa muy pesada de Militech al Aegis, con mejor puntería, blindaje y potencia de fuego; su costo y peso la vuelven un lujo para quien quiere una máquina de guerra custodiando su propiedad.",
    "homebrew": true,
    "machine": {
      "type": "Emplaced Defense",
      "cost": "25,000eb (Super Luxury)",
      "counter": "DV19 Electronics/Security Tech, 5 min to counter",
      "defaultTrigger": "Target enters room without wearing a proper pass, ID, or badge."
    },
    "combatNumber": 16,
    "isNetrunner": false
  },
  {
    "id": "c77-security-turret",
    "name": "Security Turret",
    "subtitle": "Emplaced Defense",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 161,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 0,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Arasaka Shigure (w/ Extended Magazine)",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Constitutional Arms M2067 Defender",
        "totalBase": 14,
        "damage": "2d6",
        "rof": 1
      },
      {
        "label": "Militech M251s Ajax",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Arasaka Shigure (w/ Extended Magazine)",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 60,
        "notes": "50 Armor-Piercing Bullets · Opción de fábrica (una de tres, a elección del comprador). Corgo p.31: Heavy SMG 3d6 ROF2 cap 50 (+10 Extended Magazine = 60), Autofire (SMG 4) gastando 15 balas, Suppressive Fire.",
        "skill": "Combat Number"
      },
      {
        "name": "Constitutional Arms M2067 Defender",
        "skillBase": 14,
        "damage": "2d6",
        "rof": 1,
        "mag": 80,
        "notes": "80 Basic Bullets · Opción de fábrica (una de tres). Corgo p.42: Machine Gun cap 80, solo Autofire (Machine Gun 4) y Suppressive Fire; daño 'N/A' → 2d6 × multiplicador (regla Core).",
        "skill": "Combat Number"
      },
      {
        "name": "Militech M251s Ajax",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 1,
        "mag": 30,
        "notes": "30 Basic Bullets · Opción de fábrica (una de tres). Corgo p.39: EQ Assault Rifle 5d6 ROF1 cap 30, Autofire (Assault Rifle 4), Suppressive Fire.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Hidden Design",
      "Observation Camera with Low Light/Infrared/UV"
    ],
    "specialRules": [
      "Hidden Design: suele empotrarse en techo, piso o paredes y, inactiva, se retrae dentro de su carcasa; su cámara sigue viendo y la torreta se despliega si se activa su Default Trigger. Desplegar o retraer no cuesta Acción ni NET Action; retraída no puede disparar. Detectar una torreta retraída requiere superar Perception DV17.",
      "Puede equiparse con cualquier Arma a Distancia; de fábrica trae una de las tres listadas (a elección del comprador).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Cápsulas de armas ocultas en paredes, supuestamente idea de Max Hammerman de MAX-TAC para abatir ciberpsicópatas antes de que vean las armas; hoy son comunes en todo Night City.",
    "homebrew": true,
    "machine": {
      "type": "Emplaced Defense",
      "cost": "7,500eb (Luxury)",
      "counter": "DV17 Electronics/Security Tech, 5 min to counter",
      "defaultTrigger": "Target enters room without wearing a proper pass, ID, or badge. Continues to fire until target is dead, no longer in range, or a proper badge is presented."
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-sentry-turret",
    "name": "Sentry Turret",
    "subtitle": "Emplaced Defense",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 161,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 0,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Hansen Armory HA-7 Warden",
        "totalBase": 14,
        "damage": "2d6",
        "rof": 1
      },
      {
        "label": "Militech M-76e Omaha",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Nokota D5 Copperhead (w/ Extended Magazine)",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Rostović DB-2 Testera",
        "totalBase": 14,
        "damage": "3d6/5d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Hansen Armory HA-7 Warden",
        "skillBase": 14,
        "damage": "2d6",
        "rof": 1,
        "mag": 40,
        "notes": "40 Tracer Bullets · Opción (lleva dos, se permiten repetidas). Corgo p.33: SMG, alcance Subcompact SMG, 2d6 ROF1 cap 40, Autofire (SMG 3), Suppressive Fire.",
        "skill": "Combat Number"
      },
      {
        "name": "Militech M-76e Omaha",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 9,
        "notes": "9 Armor-Piercing Bullets · Opción (lleva dos). Corgo p.29: Heavy Pistol 3d6 ROF2 cap 9, Tech Rebuild (cargada dispara ráfagas de 3).",
        "skill": "Combat Number"
      },
      {
        "name": "Nokota D5 Copperhead (w/ Extended Magazine)",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 40,
        "notes": "40 Basic Bullets · Opción (lleva dos). Corgo p.39: Assault Rifle, alcance Carbine, 4d6 ROF1 cap 30 (+10 Extended Magazine = 40), Autofire (Assault Rifle 4), Suppressive Fire.",
        "skill": "Combat Number"
      },
      {
        "name": "Rostović DB-2 Testera",
        "skillBase": 14,
        "damage": "3d6/5d6",
        "rof": 1,
        "mag": 2,
        "notes": "2 Incendiary Shells · Opción (lleva dos). Corgo p.36: EQ Shotgun, alcance Short Barrel Shotgun, 3d6/5d6 ROF1 cap 2, Shotgun Shell; con Shells probablemente 3d6.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Folding Legs",
      "Observation Camera with Low Light/Infrared/UV"
    ],
    "specialRules": [
      "Folding Legs: solo en el suelo sobre superficie plana; montar o desmontar una Sentry Turret lleva una Acción. No funciona desmontada.",
      "Puede equiparse con hasta dos Armas a Distancia sin requisito de BODY; normalmente lleva dos de las listadas (se permiten repetidas).",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Torretas callejeras armadas con piezas viejas de Militech soldadas por herreros urbanos; favoritas de pandillas como Maelstrom y Barghest, baratas pero frágiles.",
    "homebrew": true,
    "machine": {
      "type": "Emplaced Defense",
      "cost": "2,500eb (Very Expensive)",
      "counter": "DV13 Electronics/Security Tech, 1 min to counter",
      "defaultTrigger": "Target enters room without wearing a proper pass, ID, or badge."
    },
    "combatNumber": 14,
    "isNetrunner": false
  },
  {
    "id": "c77-zetatech-bombus",
    "name": "Zetatech Bombus",
    "subtitle": "Personal Mini Air Drone",
    "faction": "Zetatech",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 161,
    "role": "",
    "hp": 10,
    "seriouslyWounded": 5,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [],
    "weapons": [],
    "cyberware": [],
    "gear": [
      "Chipware Slot",
      "Magclamp",
      "Observation Camera with Low Light/Infrared/UV",
      "Radio Communicator"
    ],
    "specialRules": [
      "Magclamp: puede cargar cualquier contenedor u objeto metálico/magnético de hasta 15 lbs (6.8 kg).",
      "Modo Standby: encendido pero inactivo; no puede moverse, actuar ni esquivar Ataques.",
      "Modo Transport: va a una dirección o coordenadas, entrega la carga del Magclamp y vuelve a su base; puede dejar el paquete o pedir confirmación a un Neuroport antes de entregar. En este modo no puede atacar ni esquivar.",
      "Modo Direct Control: lo controla su Neuroport vinculado como un Netrunner con Control Interface (CP:R, pg. 199). No puede esquivar Ataques a Distancia de ningún modo.",
      "Modo Teaching: proyecta información de un Memory Chip en su Chipware Slot (videos, presentaciones, juegos de realidad aumentada); no da bonus a tiradas salvo que el DJ lo decida.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs ni Combat Number: la maneja quien la controla"
    ],
    "loreSummary": "Dron niñera barato de Zetatech para padres sin tiempo; también lo usan servicios de mensajería, la NCPD para reconocimiento y pandillas que le pegan explosivos con cinta.",
    "homebrew": true,
    "machine": {
      "type": "Personal Mini Air Drone",
      "move": 4,
      "cost": "2,000eb (Very Expensive)",
      "counter": "DV13 Electronics/Security Tech, 1 min to counter",
      "range": "A 10m/yds de un Neuroport vinculado; autonomía de 12 horas, luego carga 1 hora en cualquier fuente",
      "defaultTrigger": "N/A"
    },
    "isNetrunner": false
  },
  {
    "id": "c77-kiroshi-proxy",
    "name": "Kiroshi Proxy",
    "subtitle": "Personal Humanoid Ground Drone",
    "faction": "Kiroshi",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 162,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Brawling (Robotic Hands BODY 6)",
        "totalBase": 0,
        "damage": "2d6",
        "rof": 2
      }
    ],
    "weapons": [
      {
        "name": "Brawling (Robotic Hands BODY 6)",
        "skillBase": 0,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "Inferido: tabla de daño de Brawling del Core por BODY 6; el bloque solo dice que puede hacer ataques de Brawling.",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Audio Recorder",
      "Chipware Slot (w/ Memory Chip)",
      "Robotic Hands (BODY 6) [See Humanoid Ground Drone for rules]",
      "Observation Camera with MicroVideo & Low Light/Infrared/UV"
    ],
    "specialRules": [
      "Robotic Hands (BODY 6) (Corgo p.153): puede empuñar y manipular cualquier arma, equipo, dispositivo u objeto como una persona con BODY 6; puede hacer ataques de Brawling, y de Martial Arts solo si tiene equipado un Skill Chip con un Arte Marcial cargado. Puede vestir Fashion y Armor (se compran aparte) y sufre los penalizadores de armadura en sus tiradas.",
      "Modo Standby: encendido pero inactivo; no puede moverse, actuar ni esquivar, pero sigue grabando todo el audio/video a su alrededor en los Memory Chips de su Chipware Slot.",
      "Modo Direct Control: lo controla su Neuroport vinculado como un Netrunner con Control Interface (CP:R, pg. 199). No puede esquivar Ataques a Distancia de ningún modo.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs ni Combat Number: la maneja quien la controla"
    ],
    "loreSummary": "Androide de telepresencia exclusivo de Kiroshi para interactuar a distancia sin parecer un robot; su filtro de voz garantiza anonimato en subastas ilegales.",
    "homebrew": true,
    "machine": {
      "type": "Personal Humanoid Ground Drone",
      "move": 6,
      "cost": "10,000eb (Super Luxury)",
      "counter": "DV21 Electronics/Security Tech, 5 min to counter",
      "range": "Edificio: perímetro; no puede conectarse a NET portátil. Debe estar conectado a un Neuroport para funcionar, sin salir de su rango",
      "defaultTrigger": "N/A"
    },
    "isNetrunner": false
  },
  {
    "id": "c77-militech-mtod12-flathead",
    "name": "Militech MTOD12 Flathead",
    "subtitle": "Personal Small 4-Legged Ground Drone",
    "faction": "Militech",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 162,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [],
    "weapons": [],
    "cyberware": [],
    "gear": [
      "Advanced Cloak",
      "Electric Dampeners",
      "Improved Grip Feet",
      "Lynx Paws",
      "Manipulator Arm (w/ Interface Plug, Gang Jazzler, Techtool, & Techscanner) x2",
      "Observation Camera with Low Light/Infrared/UV & Microvideo",
      "Radar/Sonar System & Radar Detector"
    ],
    "specialRules": [
      "Advanced Cloak: con una Acción activa un camuflaje que lo oculta de todos los sentidos visuales, incluido Low Light/Infrared/UV; percibirlo requiere superar Perception DV21. Se desactiva si ataca o usa una Acción para interactuar o conectarse con cualquier dispositivo mecánico.",
      "Electric Dampeners: el dron y su equipo son inmunes a EMP, Electrocución, Microwavers y efectos inhabilitantes similares.",
      "Improved Grip Feet: ignora todo penalizador de movimiento al trepar, incluidos techos.",
      "Modo Standby: encendido pero inactivo; no puede moverse, actuar ni esquivar Ataques.",
      "Modo Direct Control: lo controla su Neuroport vinculado igual que un Netrunner con la habilidad Control Interface (CP:R, pg. 199).",
      "Modo Auto: se mantiene a 6m/yds de su Neuroport vinculado, sigue a su usuario y le avisa de todo lo que active su Radar/Sonar o Radar Detector.",
      "Modo Leapfrog Link: conectado a un Access Point con Interface Plug/Personal Link, cualquier Neuroport conectado al dron puede entrar a esa NET Architecture como si hubiera hecho Jack In directo aunque no esté presente. En este modo no puede moverse ni esquivar.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs ni Combat Number: la maneja quien la controla"
    ],
    "loreSummary": "Dron de Militech para sabotaje y espionaje a larga distancia, con uno de los camuflajes más sofisticados jamás hechos; trepa techos, se conecta a máquinas y se infiltra sin ser visto.",
    "homebrew": true,
    "machine": {
      "type": "Personal Small 4-Legged Ground Drone",
      "move": 8,
      "cost": "25,000eb (Super Luxury)",
      "counter": "DV21 Electronics/Security Tech, 5 min to counter",
      "range": "A 100m/yds de un Neuroport vinculado, o de un Access Point de una NET Architecture a la que ese Neuroport tenga acceso; autonomía de 24 horas, luego carga 1 hora",
      "defaultTrigger": "N/A"
    },
    "isNetrunner": false
  },
  {
    "id": "c77-zetatech-flylamp",
    "name": "Zetatech Flylamp",
    "subtitle": "Mini Air Drone",
    "faction": "Zetatech",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 162,
    "role": "",
    "hp": 10,
    "seriouslyWounded": 5,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Combat Number",
        "totalBase": 10
      }
    ],
    "weapons": [],
    "cyberware": [],
    "gear": [
      "Advanced Cloak",
      "Observation Camera with Anti-Dazzle, Image Enhance, Low Light/Infrared/UV, MicroVideo, and TeleOptics."
    ],
    "specialRules": [
      "Advanced Cloak: con una Acción activa un camuflaje que lo oculta de todos los sentidos visuales, incluido Low Light/Infrared/UV; percibirlo requiere superar Perception DV21. Se desactiva si ataca o usa una Acción para interactuar o conectarse con cualquier dispositivo mecánico.",
      "Modo Standby: encendido pero inactivo; no puede moverse, actuar ni esquivar Ataques.",
      "Modo Direct Control: lo controla su Neuroport vinculado igual que un Netrunner con la habilidad Control Interface (CP:R, pg. 199).",
      "Modo Scout: sigue una ruta indicada hasta cualquier punto a 1 km, graba todo lo que ve durante 5 minutos en un Memory Shard interno y vuelve a su Neuroport vinculado.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Dron diminuto y silencioso de Zetatech para vigilancia aérea sigilosa; su transmisor potenciado le da gran alcance y es favorito de partidas de exploración nómadas.",
    "homebrew": true,
    "machine": {
      "type": "Mini Air Drone",
      "move": 4,
      "cost": "5,000eb (Luxury)",
      "counter": "DV17 Electronics/Security Tech, 5 min to counter",
      "range": "A 200m/yds de un Neuroport vinculado; autonomía de 24 horas, luego carga 1 hora",
      "defaultTrigger": "N/A"
    },
    "combatNumber": 10,
    "isNetrunner": false
  },
  {
    "id": "c77-zhirafa-constructi-bot-large",
    "name": "Zhirafa Constructi-Bots (Large)",
    "subtitle": "Personal Large Ground Drone",
    "faction": "Zhirafa",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 163,
    "role": "",
    "hp": 70,
    "seriouslyWounded": 35,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Rock Crusher",
        "totalBase": 10,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Rock Crusher",
        "skillBase": 10,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "notes": "Opción (uno de tres implementos). EQ ROF 1 Melee Weapon de 5d6 (impreso en el bloque).",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Heavy Treads",
      "Observation Camera with Low Light/Infrared/UV",
      "Oversized Body",
      "Crane Arm / Dozer Blade / Rock Crusher (one of)"
    ],
    "specialRules": [
      "Heavy Treads: no puede ser blanco de Aimed Shots.",
      "Oversized Body: mientras le quede HP, cuenta como Cobertura de Acero Grueso (Thick Steel) con HP igual a su HP.",
      "Implemento (uno de): Crane Arm — levanta hasta 50 toneladas (contenedores, palés, vehículos) con brazo magnetizable o con cadenas; cargando, su MOVE baja en 1 (2 MOVE total). Dozer Blade — crea una línea de Cobertura de 6x2m/yds (3x1 casillas) empujando material; el tipo y HP de la Cobertura los decide el DJ. Rock Crusher — arma cuerpo a cuerpo (ver armas).",
      "Modo Standby: encendido pero inactivo; no puede moverse, actuar ni esquivar Ataques.",
      "Modo Direct Control: lo controla su Neuroport vinculado igual que un Netrunner con la habilidad Control Interface (CP:R, pg. 199).",
      "Modo Auto: cumple sus últimas órdenes sin pausa hasta que se le diga otra cosa o lo controle directamente un Demon o Netrunner; no se detiene ante ningún obstáculo, personas incluidas, salvo que eso lo destruyera, en cuyo caso frena justo antes.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Máquinas de construcción semiautónomas que Zhirafa trajo para la reconstrucción de Pacifica y que siguen paradas como fantasmas; activarlas sin control es mala idea para todos.",
    "homebrew": true,
    "machine": {
      "type": "Personal Large Ground Drone",
      "move": 3,
      "cost": "10,000eb (Super Luxury)",
      "counter": "DV17 Electronics/Security Tech, 5 min to counter",
      "range": "A 100m/yds de un Neuroport vinculado, o de un Access Point de una NET Architecture a la que ese Neuroport tenga acceso; autonomía de 48 horas, luego carga 1 hora en una fuente grande",
      "defaultTrigger": "N/A",
      "size": "10x10m/yds (5x5 squares) centrado en sí mismo"
    },
    "combatNumber": 10,
    "isNetrunner": false
  },
  {
    "id": "c77-zhirafa-constructi-bot-small",
    "name": "Zhirafa Constructi-Bots (Small)",
    "subtitle": "Personal Small Ground Drone",
    "faction": "Zhirafa",
    "threatTier": "mook",
    "sourceBook": "homebrew_corgo77",
    "sourceBookTitle": "Corgo's 77 Collection V3 (homebrew)",
    "era": "2045",
    "format": "red",
    "sourcePage": 163,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 0,
      "REF": 0,
      "DEX": 0,
      "TECH": 0,
      "COOL": 0,
      "WILL": 0,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 0,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Jackhammer",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Small Crane Arm",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Steamroller",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Combat Number",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Jackhammer",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Opción (uno de cuatro implementos). EQ Very Heavy Melee Weapon (tipo Core 4d6 ROF1) con alcance de 4m/yds; +2d6 de daño a Cobertura (solo Cobertura).",
        "skill": "Combat Number"
      },
      {
        "name": "Small Crane Arm",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Opción (uno de cuatro). EQ Very Heavy Melee Weapon (tipo Core 4d6 ROF1) con alcance de 6m/yds; levanta hasta 5 toneladas con gancho magnetizado (cargando, MOVE -2).",
        "skill": "Combat Number"
      },
      {
        "name": "Steamroller",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Opción (uno de cuatro). Activo funciona como Very Heavy Melee Weapon (tipo Core 4d6 ROF1) que al impactar golpea siempre ambas piernas como un par de Aimed Shots a piernas sin penalizador; activo reduce MOVE en 1 (3 MOVE total).",
        "skill": "Combat Number"
      }
    ],
    "cyberware": [],
    "gear": [
      "Heavy Treads",
      "Observation Camera with Low Light/Infrared/UV",
      "Backhoe and Bucket / Jackhammer / Small Crane Arm / Steamroller (one of)"
    ],
    "specialRules": [
      "Heavy Treads: no puede ser blanco de Aimed Shots.",
      "Implemento (uno de): Backhoe and Bucket — mueve material suelto y puede volcarlo; carga hasta 5 toneladas. Jackhammer, Small Crane Arm (levanta 5 toneladas; cargando, MOVE -2 → 2 MOVE total) o Steamroller (ver armas).",
      "Modo Standby: encendido pero inactivo; no puede moverse, actuar ni esquivar Ataques.",
      "Modo Direct Control: lo controla su Neuroport vinculado igual que un Netrunner con la habilidad Control Interface (CP:R, pg. 199).",
      "Modo Auto: cumple sus últimas órdenes sin pausa hasta que se le diga otra cosa o lo controle directamente un Demon o Netrunner; no se detiene ante ningún obstáculo, personas incluidas, salvo que eso lo destruyera, en cuyo caso frena justo antes.",
      "Reglas de drones (Corgo p.153, 'Hurting the Machine'): puede ser blanco de Aimed Shots (tematizadas según el tipo, p. ej. los propulsores de un dron aéreo cuentan como 'piernas') y puede sufrir Heridas Críticas, pero ignora por completo el efecto y el Daño Bonus de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (no se vuelve a tirar otra Herida). Solo las Environmental Defenses son inmunes a todas las Heridas Críticas.",
      "Seriously Wounded no impreso: HP/2",
      "Máquina sin STATs: usa su Combat Number para todas sus tiradas"
    ],
    "loreSummary": "Los ayudantes más chicos, rápidos y frágiles de las grandes máquinas de Zhirafa; no fueron diseñados para matar, aunque pueden.",
    "homebrew": true,
    "machine": {
      "type": "Personal Small Ground Drone (About the size of a Roadbike)",
      "move": 4,
      "cost": "5,000eb (Luxury)",
      "counter": "DV17 Electronics/Security Tech, 5 min to counter",
      "range": "A 100m/yds de un Neuroport vinculado, o de un Access Point de una NET Architecture a la que ese Neuroport tenga acceso; autonomía de 24 horas, luego carga 1 hora",
      "defaultTrigger": "N/A",
      "size": "tamaño de una Roadbike"
    },
    "combatNumber": 10,
    "isNetrunner": false
  }
];
