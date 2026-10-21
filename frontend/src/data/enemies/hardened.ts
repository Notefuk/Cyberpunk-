// Generado por scripts/gen_enemies.py desde data/enemies-src/. No editar a mano.
import type { EnemySheet } from '../enemiesCatalog';

export const HARDENED_ENEMIES: EnemySheet[] = [
  {
    "id": "hardened-bodyguard",
    "name": "Hardened Bodyguard",
    "subtitle": "Hardened Mooks PDF, p.2",
    "faction": "",
    "threatTier": "hardened_mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Mooks",
    "era": "2045",
    "format": "red",
    "sourcePage": 2,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 6,
      "DEX": 6,
      "TECH": 2,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 7,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Shotgun (Poor Quality)",
        "totalBase": 10,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Brawling",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 8
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Shotgun (Poor Quality)",
        "skillBase": 10,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "Slug Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Brawling",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Listado como arma con 3d6 en el libro · ROF/cargador según tabla Core p.176",
        "skill": "Brawling"
      }
    ],
    "cyberware": [],
    "gear": [
      "Slug Ammo x25",
      "Radio Communicator"
    ],
    "specialRules": [],
    "loreSummary": "Reemplazo endurecido de los Mooks del Core, para grupos Hardened, a razon de uno por Edgerunner.",
    "skillBases": {
      "Athletics": 9,
      "Brawling": 13,
      "Concentration": 6,
      "Conversation": 5,
      "Drive Land Vehicle": 10,
      "Education": 6,
      "Endurance": 9,
      "Evasion": 8,
      "First Aid": 4,
      "Human Perception": 5,
      "Interrogation": 6,
      "Language (Native)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Your Home)": 6,
      "Perception": 10,
      "Persuasion": 6,
      "Resist Torture/Drugs": 8,
      "Shoulder Arms": 10,
      "Stealth": 8
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-boosterganger",
    "name": "Hardened Boosterganger",
    "subtitle": "Hardened Mooks PDF, p.3",
    "faction": "",
    "threatTier": "hardened_mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Mooks",
    "era": "2045",
    "format": "red",
    "sourcePage": 3,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 4,
      "REF": 6,
      "DEX": 5,
      "TECH": 2,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 4,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol (Poor Quality)",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Wolvers",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 7
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol (Poor Quality)",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "VH Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Wolvers",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Cyberware · ROF/cargador según tabla Core p.115",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Wolvers",
      "Techhair"
    ],
    "gear": [
      "VH Pistol Ammo x30",
      "Disposable Cellphone",
      "Black Lace x1"
    ],
    "specialRules": [],
    "loreSummary": "Reemplazo endurecido de los Mooks del Core, para grupos Hardened, a razon de uno por Edgerunner.",
    "skillBases": {
      "Athletics": 9,
      "Brawling": 9,
      "Conceal/Reveal Object": 6,
      "Concentration": 8,
      "Conversation": 5,
      "Drive Land Vehicle": 10,
      "Education": 6,
      "Endurance": 6,
      "Evasion": 7,
      "First Aid": 4,
      "Handgun": 12,
      "Human Perception": 5,
      "Interrogation": 6,
      "Language (Native)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Your Home)": 6,
      "Melee Weapon": 12,
      "Perception": 8,
      "Persuasion": 6,
      "Resist Torture/Drugs": 8,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-road-ganger",
    "name": "Hardened Road Ganger",
    "subtitle": "Hardened Mooks PDF, p.3",
    "faction": "",
    "threatTier": "hardened_mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Mooks",
    "era": "2045",
    "format": "red",
    "sourcePage": 3,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 3,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 6,
      "TECH": 4,
      "COOL": 3,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 3,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol (Poor Quality)",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Very Heavy Melee Weapon (Poor Quality)",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 11
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol (Poor Quality)",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "VH Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Very Heavy Melee Weapon (Poor Quality)",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Neural Link (Interface Plugs)"
    ],
    "gear": [
      "VH Pistol Ammo x20",
      "Rope",
      "Flashlight"
    ],
    "specialRules": [],
    "loreSummary": "Reemplazo endurecido de los Mooks del Core, para grupos Hardened, a razon de uno por Edgerunner.",
    "skillBases": {
      "Athletics": 8,
      "Brawling": 8,
      "Concentration": 5,
      "Conversation": 6,
      "Drive Land Vehicle": 12,
      "Education": 8,
      "Endurance": 5,
      "Evasion": 11,
      "First Aid": 6,
      "Handgun": 10,
      "Human Perception": 5,
      "Land Vehicle Tech": 10,
      "Language (Native)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Your Home)": 8,
      "Melee Weapon": 12,
      "Perception": 10,
      "Persuasion": 5,
      "Stealth": 8,
      "Tracking": 10,
      "Wilderness Survival": 8
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-security-operative",
    "name": "Hardened Security Operative",
    "subtitle": "Hardened Mooks PDF, p.4",
    "faction": "",
    "threatTier": "hardened_mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Mooks",
    "era": "2045",
    "format": "red",
    "sourcePage": 4,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 7,
      "DEX": 4,
      "TECH": 2,
      "COOL": 2,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Assault Rifle (Poor Quality)",
        "totalBase": 12,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Very Heavy Pistol (Poor Quality)",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 6
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle (Poor Quality)",
        "skillBase": 12,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "Rifle Ammo · Autofire base 14 · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Very Heavy Pistol (Poor Quality)",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "VH Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [],
    "gear": [
      "Rifle Ammo x40",
      "VH Pistol Ammo x20",
      "Radio Communicator"
    ],
    "specialRules": [],
    "loreSummary": "Reemplazo endurecido de los Mooks del Core, para grupos Hardened, a razon de uno por Edgerunner.",
    "skillBases": {
      "Athletics": 8,
      "Autofire": 14,
      "Brawling": 8,
      "Concentration": 7,
      "Conversation": 5,
      "Education": 7,
      "Evasion": 6,
      "First Aid": 4,
      "Handgun": 12,
      "Human Perception": 5,
      "Interrogation": 6,
      "Language (Native)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Your Home)": 7,
      "Melee Weapon": 6,
      "Perception": 8,
      "Persuasion": 4,
      "Resist Torture/Drugs": 8,
      "Shoulder Arms": 12,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-netrunner-anti-personnel",
    "name": "Hardened Netrunner (anti-personnel)",
    "subtitle": "Hardened Lieutenants PDF, p.4 (variante anti-personnel)",
    "faction": "",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Lieutenants",
    "era": "2045",
    "format": "red",
    "sourcePage": 4,
    "role": "Netrunner",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 5,
      "DEX": 4,
      "TECH": 7,
      "COOL": 4,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 4,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 11
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neural Link",
      "Interface Plugs"
    ],
    "gear": [
      "Pistol Ammo x50",
      "Flashlight",
      "Virtuality Goggles",
      "Cyberdeck"
    ],
    "specialRules": [
      "Interface 4 (rol Netrunner).",
      "Role Ability: Interface rank 4"
    ],
    "loreSummary": "Netrunner endurecido con programas ofensivos contra personas.",
    "roleAbility": {
      "name": "Interface",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 9,
      "Basic Tech": 13,
      "Brawling": 6,
      "Conceal/Reveal Object": 11,
      "Concentration": 11,
      "Conversation": 6,
      "Cryptography": 11,
      "Deduction": 11,
      "Education": 12,
      "Electronics/Security Tech": 11,
      "Evasion": 10,
      "First Aid": 9,
      "Forgery": 13,
      "Handgun": 12,
      "Human Perception": 6,
      "Language (Native)": 11,
      "Language (Streetslang)": 9,
      "Library Search": 13,
      "Local Expert (GM's Choice)": 13,
      "Local Expert (Your Home)": 9,
      "Perception": 11,
      "Persuasion": 6,
      "Pick Lock": 11,
      "Resist Torture/Drugs": 9,
      "Stealth": 12,
      "Tactics": 12
    },
    "isNetrunner": true,
    "interfaceRank": 4,
    "cyberdeckPrograms": [
      "Armor x2",
      "Banhammer",
      "DeckKrash",
      "Hellbolt x2",
      "Shield"
    ]
  },
  {
    "id": "hardened-netrunner-anti-program",
    "name": "Hardened Netrunner (anti-program)",
    "subtitle": "Hardened Lieutenants PDF, p.4 (variante anti-program)",
    "faction": "",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Lieutenants",
    "era": "2045",
    "format": "red",
    "sourcePage": 4,
    "role": "Netrunner",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 5,
      "DEX": 4,
      "TECH": 7,
      "COOL": 4,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 4,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 11
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neural Link",
      "Interface Plugs"
    ],
    "gear": [
      "Pistol Ammo x50",
      "Flashlight",
      "Virtuality Goggles",
      "Cyberdeck"
    ],
    "specialRules": [
      "Interface 4 (rol Netrunner).",
      "Role Ability: Interface rank 4"
    ],
    "loreSummary": "Netrunner endurecido con programas pensados para destruir programas y ICE rivales.",
    "roleAbility": {
      "name": "Interface",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 9,
      "Basic Tech": 13,
      "Brawling": 6,
      "Conceal/Reveal Object": 11,
      "Concentration": 11,
      "Conversation": 6,
      "Cryptography": 11,
      "Deduction": 11,
      "Education": 12,
      "Electronics/Security Tech": 11,
      "Evasion": 10,
      "First Aid": 9,
      "Forgery": 13,
      "Handgun": 12,
      "Human Perception": 6,
      "Language (Native)": 11,
      "Language (Streetslang)": 9,
      "Library Search": 13,
      "Local Expert (GM's Choice)": 13,
      "Local Expert (Your Home)": 9,
      "Perception": 11,
      "Persuasion": 6,
      "Pick Lock": 11,
      "Resist Torture/Drugs": 9,
      "Stealth": 12,
      "Tactics": 12
    },
    "isNetrunner": true,
    "interfaceRank": 4,
    "cyberdeckPrograms": [
      "Armor",
      "Killer",
      "Speedy Gonzalvez x2",
      "Sword x2"
    ]
  },
  {
    "id": "hardened-reclaimer-chief-lightning",
    "name": "Hardened Reclaimer Chief (Lightning)",
    "subtitle": "Hardened Lieutenants PDF, p.5 (variante Lightning)",
    "faction": "",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Lieutenants",
    "era": "2045",
    "format": "red",
    "sourcePage": 5,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 3,
      "REF": 8,
      "DEX": 6,
      "TECH": 5,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Shotgun",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Shotgun",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "Slug Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Neural Link",
      "Kerenzikov"
    ],
    "gear": [
      "Slug Ammo x25",
      "Agent",
      "Radio Communicator",
      "Tent and Camping Equipment"
    ],
    "specialRules": [],
    "loreSummary": "Comandante que lidera a sus Mooks desde el frente; el libro lo recomienda para Hardened Mooks.",
    "skillBases": {
      "Athletics": 12,
      "Basic Tech": 9,
      "Brawling": 8,
      "Conceal/Reveal Object": 5,
      "Concentration": 7,
      "Conversation": 6,
      "Deduction": 7,
      "Demolitions": 7,
      "Drive Land Vehicle": 12,
      "Education": 5,
      "Electronics/Security Tech": 9,
      "Endurance": 11,
      "Evasion": 12,
      "First Aid": 7,
      "Human Perception": 6,
      "Land Vehicle Tech": 7,
      "Language (Native)": 7,
      "Language (Streetslang)": 5,
      "Local Expert (Your Home)": 5,
      "Melee Weapon": 14,
      "Paramedic": 7,
      "Perception": 8,
      "Persuasion": 6,
      "Pick Lock": 7,
      "Resist Torture/Drugs": 10,
      "Shoulder Arms": 14,
      "Stealth": 10,
      "Tactics": 10,
      "Weaponstech": 9,
      "Wilderness Survival": 7
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-reclaimer-chief-thunder",
    "name": "Hardened Reclaimer Chief (Thunder)",
    "subtitle": "Hardened Lieutenants PDF, p.5 (variante Thunder)",
    "faction": "",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Lieutenants",
    "era": "2045",
    "format": "red",
    "sourcePage": 5,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 3,
      "REF": 6,
      "DEX": 6,
      "TECH": 5,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 6,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Popup Grenade Launcher",
        "totalBase": 12,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "Very Heavy Pistol",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Popup Grenade Launcher",
        "skillBase": 12,
        "damage": "6d6",
        "rof": 1,
        "mag": 2,
        "notes": "Cargado con AP Grenade x1 y Smoke Grenade x1 · ROF/cargador según tabla Core p.94",
        "skill": "Heavy Weapons"
      },
      {
        "name": "Very Heavy Pistol",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "Very Heavy Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Cyberarm"
    ],
    "gear": [
      "Very Heavy Pistol Ammo x25",
      "Agent",
      "Radio Communicator",
      "Tent and Camping Equipment",
      "Popup Grenade Launcher (AP Grenade x1, Smoke Grenade x1)"
    ],
    "specialRules": [
      "Popup Grenade Launcher figura tanto como arma (6d6) como en el equipo especial del libro."
    ],
    "loreSummary": "Comandante que apoya a sus Mooks desde la retaguardia.",
    "skillBases": {
      "Athletics": 12,
      "Basic Tech": 9,
      "Brawling": 8,
      "Conceal/Reveal Object": 5,
      "Concentration": 7,
      "Conversation": 6,
      "Deduction": 7,
      "Demolitions": 12,
      "Drive Land Vehicle": 10,
      "Education": 5,
      "Electronics/Security Tech": 9,
      "Endurance": 11,
      "Evasion": 12,
      "First Aid": 7,
      "Handgun": 14,
      "Heavy Weapons": 12,
      "Human Perception": 6,
      "Land Vehicle Tech": 7,
      "Language (Native)": 7,
      "Language (Streetslang)": 5,
      "Local Expert (Your Home)": 5,
      "Melee Weapon": 14,
      "Paramedic": 7,
      "Perception": 8,
      "Persuasion": 6,
      "Pick Lock": 7,
      "Resist Torture/Drugs": 10,
      "Stealth": 10,
      "Tactics": 10,
      "Weaponstech": 9,
      "Wilderness Survival": 7
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-security-officer-raid",
    "name": "Hardened Security Officer (Raid)",
    "subtitle": "Hardened Lieutenants PDF, p.6 (variante Raid)",
    "faction": "",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Lieutenants",
    "era": "2045",
    "format": "red",
    "sourcePage": 6,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 6,
      "TECH": 4,
      "COOL": 6,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 7,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Assault Rifle",
        "totalBase": 12,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Underbarrel Shotgun",
        "totalBase": 12,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle",
        "skillBase": 12,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "Rifle Ammo · Autofire base 12 · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Underbarrel Shotgun",
        "skillBase": 12,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "Expansive Slug Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Cyberleg x2"
    ],
    "gear": [
      "Rifle Ammo x50",
      "Expansive Slug Ammo x2",
      "Flashbang Grenade x1",
      "Agent",
      "Flashlight",
      "Grapple Gun",
      "Radio Communicator"
    ],
    "specialRules": [],
    "loreSummary": "Oficial de seguridad de asalto; excelente en combate tactico por objetivos de area en interiores.",
    "skillBases": {
      "Athletics": 12,
      "Autofire": 12,
      "Brawling": 12,
      "Concentration": 7,
      "Conversation": 6,
      "Deduction": 7,
      "Drive Land Vehicle": 12,
      "Education": 7,
      "Evasion": 10,
      "First Aid": 6,
      "Handgun": 12,
      "Human Perception": 6,
      "Interrogation": 8,
      "Language (Native)": 9,
      "Language (Streetwise)": 7,
      "Local Expert (Your Home)": 7,
      "Perception": 7,
      "Persuasion": 8,
      "Resist Torture/Drugs": 10,
      "Shoulder Arms": 12,
      "Stealth": 8,
      "Tactics": 12
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-security-officer-siege",
    "name": "Hardened Security Officer (Siege)",
    "subtitle": "Hardened Lieutenants PDF, p.6 (variante Siege)",
    "faction": "",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Lieutenants",
    "era": "2045",
    "format": "red",
    "sourcePage": 6,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 6,
      "TECH": 4,
      "COOL": 6,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 7,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy SMG",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Bulletproof Shield",
        "totalBase": 0,
        "damage": "",
        "rof": 0
      },
      {
        "label": "Evasion",
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Heavy SMG",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 1,
        "mag": 40,
        "notes": "Pistol Ammo · Autofire base 14 (12 con penalizacion) · ROF/cargador según tabla Core p.94",
        "skill": "Autofire"
      },
      {
        "name": "Bulletproof Shield",
        "skillBase": 0,
        "damage": "",
        "rof": 0,
        "mag": 0,
        "notes": "Escudo listado en equipo especial, sin dano impreso · Escudo: no ataca"
      }
    ],
    "cyberware": [
      "Cybereyes x2",
      "Nasal Filters"
    ],
    "gear": [
      "Bulletproof Shield",
      "Pistol Ammo x80",
      "Teargas Grenade x2",
      "Agent",
      "Flashlight",
      "Grapple Gun",
      "Handcuffs x2",
      "Radio Communicator"
    ],
    "specialRules": [
      "Penalizacion de Heavy Armorjack ya impresa: REF 8 (6), DEX 6 (4), MOVE 6 (4). Skills afectadas con valor penalizado: Athletics 12 (10), Autofire 14 (12), Brawling 12 (10), Drive Land Vehicle 12 (10), Evasion 10 (8), Handgun 12 (10), Stealth 8 (6)."
    ],
    "loreSummary": "Oficial de seguridad de asedio, defensivo con escudo y armadura pesada.",
    "skillBases": {
      "Athletics": 12,
      "Autofire": 14,
      "Brawling": 12,
      "Concentration": 7,
      "Conversation": 6,
      "Deduction": 7,
      "Drive Land Vehicle": 12,
      "Education": 7,
      "Evasion": 10,
      "First Aid": 6,
      "Handgun": 12,
      "Human Perception": 6,
      "Interrogation": 8,
      "Language (Native)": 9,
      "Language (Streetwise)": 7,
      "Local Expert (Your Home)": 7,
      "Perception": 7,
      "Persuasion": 8,
      "Resist Torture/Drugs": 10,
      "Stealth": 8,
      "Tactics": 12
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-arasaka-assassin",
    "name": "Hardened Arasaka Assassin",
    "subtitle": "Hardened Mini-Bosses PDF, p.3",
    "faction": "",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Mini-Bosses",
    "era": "2045",
    "format": "red",
    "sourcePage": 3,
    "role": "Solo",
    "hp": 50,
    "seriouslyWounded": 25,
    "deathSave": 8,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 8,
      "DEX": 8,
      "TECH": 6,
      "COOL": 5,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 8,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon (Excellent Quality)",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Martial Arts Strike",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 16
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Heavy Melee Weapon (Excellent Quality)",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Martial Arts Strike",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.178",
        "skill": "Martial Arts (Karate)"
      }
    ],
    "cyberware": [
      "Neural Link",
      "Sandevistan",
      "Cybereye x2 w/ Lowlight/Infrared/UV"
    ],
    "gear": [
      "Smoke Grenade x1"
    ],
    "specialRules": [
      "Combat Awareness 6.",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "Asesino de Arasaka; sirve como encuentro inmediato y exigente si la historia se desvia.",
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 10,
      "Brawling": 16,
      "Concentration": 10,
      "Conversation": 7,
      "Education": 8,
      "Evasion": 16,
      "First Aid": 8,
      "Human Perception": 7,
      "Interrogation": 13,
      "Language (Native)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Your Home)": 8,
      "Martial Arts (Karate)": 16,
      "Melee Weapon": 16,
      "Perception": 8,
      "Persuasion": 7,
      "Resist Torture/Drugs": 16,
      "Stealth": 16,
      "Tactics": 14
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-executive-protection",
    "name": "Hardened Executive Protection",
    "subtitle": "Hardened Mini-Bosses PDF, p.3",
    "faction": "",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Mini-Bosses",
    "era": "2045",
    "format": "red",
    "sourcePage": 3,
    "role": "Solo",
    "hp": 60,
    "seriouslyWounded": 30,
    "deathSave": 12,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 8,
      "DEX": 8,
      "TECH": 8,
      "COOL": 7,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 12,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Martial Arts Strike",
        "totalBase": 16,
        "damage": "4d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 14
      },
      {
        "label": "Perception",
        "totalBase": 9
      }
    ],
    "weapons": [
      {
        "name": "Martial Arts Strike",
        "skillBase": 16,
        "damage": "4d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.178",
        "skill": "Martial Arts (Judo)"
      }
    ],
    "cyberware": [
      "Cybereye w/ MicroVideo",
      "Grafted Muscle and Bone Lace",
      "Implanted Linear Frame Sigma"
    ],
    "gear": [
      "Agent",
      "Radio Communicator"
    ],
    "specialRules": [
      "Combat Awareness 6.",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "Guardaespaldas de ejecutivos; sirve de muro temporal para el avance de la historia.",
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 10,
      "Brawling": 16,
      "Concentration": 12,
      "Conversation": 10,
      "Education": 9,
      "Electronics/Security Tech": 16,
      "Evasion": 14,
      "First Aid": 10,
      "Human Perception": 10,
      "Language (Native)": 11,
      "Language (Streetslang)": 9,
      "Local Expert (Your Home)": 9,
      "Martial Arts (Judo)": 16,
      "Paramedic": 16,
      "Perception": 9,
      "Personal Grooming": 14,
      "Persuasion": 9,
      "Stealth": 10
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-militech-veteran",
    "name": "Hardened Militech Veteran",
    "subtitle": "Hardened Mini-Bosses PDF, p.4",
    "faction": "",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Mini-Bosses",
    "era": "2045",
    "format": "red",
    "sourcePage": 4,
    "role": "Solo",
    "hp": 55,
    "seriouslyWounded": 28,
    "deathSave": 10,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 8,
      "DEX": 8,
      "TECH": 6,
      "COOL": 5,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 10,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Assault Rifle w/ Shotgun Underbarrel",
        "totalBase": 16,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Heavy Pistol",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 16
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle w/ Shotgun Underbarrel",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "Armor Piercing Rifle Ammo / Armor Piercing Shotgun Slug · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Heavy Pistol",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Armor Piercing Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Grafted Muscle and Bone Lace"
    ],
    "gear": [
      "Armor Piercing Pistol Ammo x10",
      "Armor Piercing Rifle Ammo x10",
      "Armor Piercing Shotgun Slug x10",
      "Black Lace x4",
      "Radio Communicator"
    ],
    "specialRules": [
      "Combat Awareness 6.",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "Veterano de Militech, tirador versatil con municion perforante.",
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 16,
      "Brawling": 16,
      "Concentration": 10,
      "Conversation": 6,
      "Education": 8,
      "Evasion": 16,
      "First Aid": 8,
      "Handgun": 16,
      "Human Perception": 6,
      "Interrogation": 13,
      "Language (Native)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Your Home)": 8,
      "Paramedic": 10,
      "Perception": 8,
      "Persuasion": 7,
      "Resist Torture/Drugs": 16,
      "Shoulder Arms": 16,
      "Stealth": 10,
      "Tactics": 14
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-outrider",
    "name": "Hardened Outrider",
    "subtitle": "Hardened Mini-Bosses PDF, p.4",
    "faction": "",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Mini-Bosses",
    "era": "2045",
    "format": "red",
    "sourcePage": 4,
    "role": "Nomad",
    "hp": 50,
    "seriouslyWounded": 25,
    "deathSave": 8,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 8,
      "DEX": 8,
      "TECH": 5,
      "COOL": 7,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 8,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon (Excellent Quality)",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Assault Rifle w/ Drum Magazine",
        "totalBase": 16,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 16
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Heavy Melee Weapon (Excellent Quality)",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Assault Rifle w/ Drum Magazine",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "Basic Rifle Ammo · Autofire base 16 · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Neural Link",
      "Interface Plugs",
      "Cyberaudio Suite w/ Amplified Hearing",
      "Cybereye w/ Targeting Scope & Teleoptics"
    ],
    "gear": [
      "Basic Rifle Ammo x100",
      "Homing Tracers",
      "Radio Communicator",
      "Vehiculo: Roadbike w/ Armored Chassis, Bulletproof Glass & NOS",
      "Vehiculo: Jet Ski w/ Bulletproof Glass (guardada con la familia)"
    ],
    "specialRules": [
      "Moto 6 (los bonos de habilidad ya estan calculados en las Skill Bases).",
      "Role Ability: Moto rank 6"
    ],
    "loreSummary": "Nomad de las Badlands, piloto y corredor armado.",
    "roleAbility": {
      "name": "Moto",
      "rank": 6
    },
    "skillBases": {
      "Air Vehicle Tech": 11,
      "Athletics": 10,
      "Autofire": 16,
      "Brawling": 16,
      "Concentration": 10,
      "Conversation": 8,
      "Drive Land Vehicle": 20,
      "Education": 8,
      "Evasion": 16,
      "First Aid": 7,
      "Human Perception": 8,
      "Land Vehicle Tech": 11,
      "Language (Native)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Badlands)": 14,
      "Local Expert (Your Home)": 8,
      "Melee Weapons": 16,
      "Perception": 8,
      "Persuasion": 9,
      "Pilot Air Vehicle": 14,
      "Pilot Sea Vehicle": 20,
      "Resist Torture/Drugs": 16,
      "Sea Vehicle Tech": 11,
      "Shoulder Arms": 16,
      "Stealth": 14,
      "Wilderness Survival": 14
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-pyro",
    "name": "Hardened Pyro",
    "subtitle": "Hardened Mini-Bosses PDF, p.5",
    "faction": "",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Mini-Bosses",
    "era": "2045",
    "format": "red",
    "sourcePage": 5,
    "role": "Solo/Tech",
    "hp": 50,
    "seriouslyWounded": 25,
    "deathSave": 8,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 8,
      "REF": 8,
      "DEX": 8,
      "TECH": 8,
      "COOL": 5,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 8,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Flamethrower (Excellent Quality)",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Rocket Launcher (Poor Quality)",
        "totalBase": 16,
        "damage": "8d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 16
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Flamethrower (Excellent Quality)",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 1,
        "mag": 4,
        "notes": "Flamethrower Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Heavy Weapons"
      },
      {
        "name": "Rocket Launcher (Poor Quality)",
        "skillBase": 16,
        "damage": "8d6",
        "rof": 1,
        "mag": 1,
        "notes": "Incendiary Rocket · ROF/cargador según tabla Core p.94",
        "skill": "Heavy Weapons"
      }
    ],
    "cyberware": [
      "Cyberaudio Suite w/ Level Dampners",
      "Cybereye x2 w/ Anti-Dazzle",
      "Artificial Shoulder Mount",
      "Cyberarm x2"
    ],
    "gear": [
      "Flamethrower Ammo x16",
      "Incendiary Rocket x1 (municion incendiaria para Rocket Launcher)",
      "Flashbang Grenade x1",
      "Synthcoke x4"
    ],
    "specialRules": [
      "Combat Awareness 4.",
      "Maker 2 (Upgrade Expertise 2, Fabrication Expertise 1, Invention Expertise 1): mejoro su Flamethrower a Excellent e invento y fabrico el Incendiary Rocket.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Piromano que uso Maker para mejorar su lanzallamas e inventar el cohete incendiario.",
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 10,
      "Brawling": 16,
      "Concentration": 10,
      "Conversation": 4,
      "Demolitions": 16,
      "Education": 12,
      "Evasion": 16,
      "First Aid": 10,
      "Heavy Weapons": 16,
      "Human Perception": 4,
      "Language (Native)": 12,
      "Language (Streetslang)": 10,
      "Local Expert (Your Home)": 10,
      "Perception": 10,
      "Persuasion": 7,
      "Resist Torture/Drugs": 16,
      "Science (Chemistry)": 16,
      "Stealth": 10,
      "Weaponstech": 16
    },
    "isNetrunner": false
  },
  {
    "id": "hardened-sniper",
    "name": "Hardened Sniper",
    "subtitle": "Hardened Mini-Bosses PDF, p.5",
    "faction": "",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "dlc",
    "sourceBookTitle": "Hardened Mini-Bosses",
    "era": "2045",
    "format": "red",
    "sourcePage": 5,
    "role": "Solo",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 8,
      "DEX": 8,
      "TECH": 4,
      "COOL": 7,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Sniper Rifle w/ Sniping Scope (Excellent Quality)",
        "totalBase": 16,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 16
      },
      {
        "label": "Perception",
        "totalBase": 15
      }
    ],
    "weapons": [
      {
        "name": "Sniper Rifle w/ Sniping Scope (Excellent Quality)",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "Armor Piercing Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Cybereye x2 w/ Lowlight/Infrared Vision/UV & Targeting Scope"
    ],
    "gear": [
      "Armor Piercing Ammo x16",
      "Disposable Cellphone"
    ],
    "specialRules": [
      "Combat Awareness 6.",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "Francotirador de largo alcance que puede huir facilmente para reaparecer despues.",
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Acting": 15,
      "Athletics": 10,
      "Brawling": 10,
      "Bribery": 15,
      "Conceal/Reveal Object": 15,
      "Concentration": 10,
      "Conversation": 6,
      "Education": 9,
      "Endurance": 16,
      "Evasion": 16,
      "First Aid": 6,
      "Human Perception": 6,
      "Language (Native)": 11,
      "Language (Streetslang)": 9,
      "Local Expert (Your Home)": 9,
      "Perception": 15,
      "Persuasion": 9,
      "Shoulder Arms": 16,
      "Stealth": 16,
      "Wilderness Survival": 15
    },
    "isNetrunner": false
  }
];
