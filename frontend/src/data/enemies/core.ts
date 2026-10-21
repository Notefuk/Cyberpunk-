// Generado por scripts/gen_enemies.py desde data/enemies-src/. No editar a mano.
import type { EnemySheet } from '../enemiesCatalog';

export const CORE_ENEMIES: EnemySheet[] = [
  {
    "id": "core-bodyguard",
    "name": "Bodyguard",
    "subtitle": "",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "core",
    "sourceBookTitle": "Cyberpunk RED Core Rulebook",
    "era": "2045",
    "format": "red",
    "sourcePage": 412,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 6,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 3,
      "REF": 6,
      "DEX": 5,
      "TECH": 2,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 6,
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
        "label": "Very Heavy Pistol",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 7
      },
      {
        "label": "Perception",
        "totalBase": 9
      }
    ],
    "weapons": [
      {
        "name": "Shotgun (Poor Quality)",
        "skillBase": 10,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Very Heavy Pistol",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [],
    "gear": [
      "Slug Ammo x25",
      "Very Heavy Pistol Ammo x25",
      "Radio Communicator"
    ],
    "specialRules": [
      "Los Skill Bases ya combinan STAT + Skill + modificadores de cyberware, Role Abilities y equipo; el NPC no tiene Rol, Role Abilities ni LUCK salvo indicacion.",
      "Mook (adversario de bajo nivel): un grupo de Edgerunners deberia poder enfrentar un numero igual de Mooks con buenas probabilidades."
    ],
    "loreSummary": "",
    "skillBases": {
      "Athletics": 9,
      "Brawling": 11,
      "Concentration": 6,
      "Conversation": 5,
      "Drive Land Vehicle": 10,
      "Education": 5,
      "Endurance": 9,
      "Evasion": 7,
      "First Aid": 4,
      "Handgun": 10,
      "Human Perception": 5,
      "Interrogation": 6,
      "Language (Native)": 5,
      "Language (Streetslang)": 5,
      "Local Expert (Your Home)": 5,
      "Perception": 9,
      "Persuasion": 6,
      "Resist Torture/Drug": 8,
      "Shoulder Arms": 10,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "core-boosterganger",
    "name": "Boosterganger",
    "subtitle": "",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "core",
    "sourceBookTitle": "Cyberpunk RED Core Rulebook",
    "era": "2045",
    "format": "red",
    "sourcePage": 412,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 2,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 2,
      "REF": 6,
      "DEX": 5,
      "TECH": 2,
      "COOL": 4,
      "WILL": 2,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 2,
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
        "label": "Rippers",
        "totalBase": 11,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 7
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol (Poor Quality)",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Rippers",
        "skillBase": 11,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.115",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Rippers",
      "Techhair"
    ],
    "gear": [
      "Very Heavy Pistol Ammo x30",
      "Disposable Cellphone"
    ],
    "specialRules": [
      "Los Skill Bases ya combinan STAT + Skill + modificadores de cyberware, Role Abilities y equipo; el NPC no tiene Rol, Role Abilities ni LUCK salvo indicacion.",
      "Mook. Errata v1.25: BODY 2 y Death Save 2 (v1.24 imprimia BODY 4 y Death Save 4); el resto no cambia (HP 20, Seriously Wounded 10)."
    ],
    "loreSummary": "",
    "skillBases": {
      "Athletics": 9,
      "Brawling": 9,
      "Conceal/Reveal Object": 4,
      "Concentration": 4,
      "Conversation": 5,
      "Drive Land Vehicle": 10,
      "Education": 4,
      "Endurance": 6,
      "Evasion": 7,
      "First Aid": 4,
      "Handgun": 12,
      "Human Perception": 5,
      "Interrogation": 6,
      "Language (Native)": 4,
      "Language (Streetslang)": 4,
      "Local Expert (Your Home)": 4,
      "Melee Weapon": 11,
      "Perception": 6,
      "Persuasion": 6,
      "Resist Torture/Drugs": 4,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "core-road-ganger",
    "name": "Road Ganger",
    "subtitle": "",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "core",
    "sourceBookTitle": "Cyberpunk RED Core Rulebook",
    "era": "2045",
    "format": "red",
    "sourcePage": 413,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 3,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 4,
      "REF": 6,
      "DEX": 4,
      "TECH": 4,
      "COOL": 3,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 3,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Light Melee Weapon",
        "totalBase": 8,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Crossbow",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 6
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Light Melee Weapon",
        "skillBase": 8,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Crossbow",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Archery"
      }
    ],
    "cyberware": [
      "Neural Link (Interface Plugs)"
    ],
    "gear": [
      "Very Heavy Pistol Ammo x20",
      "Arrow Ammo x20",
      "Rope",
      "Flashlight"
    ],
    "specialRules": [
      "Los Skill Bases ya combinan STAT + Skill + modificadores de cyberware, Role Abilities y equipo; el NPC no tiene Rol, Role Abilities ni LUCK salvo indicacion.",
      "Mook."
    ],
    "loreSummary": "",
    "skillBases": {
      "Archery": 10,
      "Athletics": 10,
      "Brawling": 6,
      "Concentration": 5,
      "Conversation": 6,
      "Drive Land Vehicle": 12,
      "Education": 6,
      "Endurance": 5,
      "Evasion": 6,
      "First Aid": 6,
      "Handgun": 10,
      "Human Perception": 5,
      "Land Vehicle Tech": 10,
      "Language (Native)": 6,
      "Language (Streetslang)": 6,
      "Local Expert (Your Home)": 6,
      "Melee Weapon": 8,
      "Perception": 6,
      "Persuasion": 5,
      "Stealth": 8,
      "Tracking": 8,
      "Wilderness Survival": 8
    },
    "isNetrunner": false
  },
  {
    "id": "core-security-operative",
    "name": "Security Operative",
    "subtitle": "",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "core",
    "sourceBookTitle": "Cyberpunk RED Core Rulebook",
    "era": "2045",
    "format": "red",
    "sourcePage": 413,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 5,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 3,
      "REF": 7,
      "DEX": 4,
      "TECH": 2,
      "COOL": 2,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Assault Rifle (Poor Quality)",
        "totalBase": 10,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Medium Melee Weapon",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Very Heavy Pistol",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 6
      },
      {
        "label": "Perception",
        "totalBase": 5
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle (Poor Quality)",
        "skillBase": 10,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Medium Melee Weapon",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Very Heavy Pistol",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [],
    "gear": [
      "Rifle x40 (impreso asi; municion de rifle)",
      "Very Heavy Pistol Ammo x20",
      "Radio Communicator"
    ],
    "specialRules": [
      "Los Skill Bases ya combinan STAT + Skill + modificadores de cyberware, Role Abilities y equipo; el NPC no tiene Rol, Role Abilities ni LUCK salvo indicacion.",
      "Mook."
    ],
    "loreSummary": "",
    "skillBases": {
      "Athletics": 8,
      "Autofire": 10,
      "Brawling": 6,
      "Concentration": 7,
      "Conversation": 5,
      "Education": 5,
      "Evasion": 6,
      "First Aid": 4,
      "Handgun": 10,
      "Human Perception": 5,
      "Interrogation": 6,
      "Language (Native)": 5,
      "Language (Streetslang)": 5,
      "Local Expert (Your Home)": 5,
      "Melee Weapon": 6,
      "Perception": 5,
      "Persuasion": 4,
      "Resist Torture/Drugs": 5,
      "Shoulder Arms": 10,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "core-netrunner",
    "name": "Netrunner",
    "subtitle": "",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "core",
    "sourceBookTitle": "Cyberpunk RED Core Rulebook",
    "era": "2045",
    "format": "red",
    "sourcePage": 414,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 3,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 5,
      "DEX": 4,
      "TECH": 7,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 3,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 6
      },
      {
        "label": "Perception",
        "totalBase": 11
      },
      {
        "label": "Interface",
        "totalBase": 4
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neural Link (Interface Plugs)"
    ],
    "gear": [
      "Very Heavy Pistol Ammo x50",
      "Flashlight",
      "Virtuality Goggles"
    ],
    "specialRules": [
      "Los Skill Bases ya combinan STAT + Skill + modificadores de cyberware, Role Abilities y equipo; el NPC no tiene Rol, Role Abilities ni LUCK salvo indicacion.",
      "Interface 4 aparece como primer Skill Base (Rol Netrunner no impreso). Lieutenant: regla practica 1 Lieutenant por cada 2 Edgerunners en la crew.",
      "Cyberdeck Programs impresos: Banhammer, DeckKRASH, Eraser, Hellbolt, Shield, Sword, Worm.",
      "Role Ability: Interface rank 4"
    ],
    "loreSummary": "",
    "roleAbility": {
      "name": "Interface",
      "rank": 4
    },
    "skillBases": {
      "Interface": 4,
      "Athletics": 9,
      "Basic Tech": 13,
      "Brawling": 6,
      "Conceal/Reveal Object": 11,
      "Concentration": 9,
      "Conversation": 6,
      "Cryptography": 11,
      "Deduction": 11,
      "Education": 11,
      "Electronics/Security Tech": 11,
      "Evasion": 6,
      "First Aid": 9,
      "Forgery": 13,
      "Handgun": 10,
      "Human Perception": 6,
      "Language (Native)": 9,
      "Language (Streetslang)": 9,
      "Local Expert (Your Home)": 13,
      "Library Search": 9,
      "Perception": 11,
      "Persuasion": 6,
      "Pick Lock": 11,
      "Resist Torture/Drugs": 7,
      "Stealth": 8
    },
    "isNetrunner": true,
    "interfaceRank": 4,
    "cyberdeckPrograms": [
      "Banhammer",
      "DeckKRASH",
      "Eraser",
      "Hellbolt",
      "Shield",
      "Sword",
      "Worm"
    ]
  },
  {
    "id": "core-reclaimer-chief",
    "name": "Reclaimer Chief",
    "subtitle": "",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "core",
    "sourceBookTitle": "Cyberpunk RED Core Rulebook",
    "era": "2045",
    "format": "red",
    "sourcePage": 414,
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
        "label": "Shotgun",
        "totalBase": 10,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Light Melee Weapon",
        "totalBase": 10,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Heavy Pistol",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 8
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Shotgun",
        "skillBase": 10,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Light Melee Weapon",
        "skillBase": 10,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Heavy Pistol",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Neural Link (Chipware Socket, Tactile Boost)",
      "Nasal Filters"
    ],
    "gear": [
      "Slug Ammo x25",
      "Heavy Pistol Ammo x25 (impreso 'H Pistol Ammo x25')",
      "Agent",
      "Grapple Gun",
      "Radio Communicator",
      "Tent & Camping Equipment"
    ],
    "specialRules": [
      "Los Skill Bases ya combinan STAT + Skill + modificadores de cyberware, Role Abilities y equipo; el NPC no tiene Rol, Role Abilities ni LUCK salvo indicacion.",
      "Lieutenant."
    ],
    "loreSummary": "",
    "skillBases": {
      "Athletics": 12,
      "Basic Tech": 9,
      "Brawling": 8,
      "Concentration": 7,
      "Conversation": 6,
      "Deduction": 7,
      "Drive Land Vehicle": 10,
      "Education": 5,
      "Electronics/Security Tech": 9,
      "Endurance": 11,
      "Evasion": 8,
      "First Aid": 7,
      "Handgun": 10,
      "Human Perception": 6,
      "Land Vehicle Tech": 7,
      "Language (Native)": 5,
      "Language (Streetslang)": 5,
      "Local Expert (Your Home)": 5,
      "Melee Weapon": 10,
      "Paramedic": 7,
      "Perception": 8,
      "Persuasion": 6,
      "Pick Lock": 7,
      "Resist Torture/Drugs": 10,
      "Shoulder Arms": 10,
      "Stealth": 10,
      "Weaponstech": 9,
      "Wilderness Survival": 7
    },
    "isNetrunner": false
  },
  {
    "id": "core-security-officer",
    "name": "Security Officer",
    "subtitle": "",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "core",
    "sourceBookTitle": "Cyberpunk RED Core Rulebook",
    "era": "2045",
    "format": "red",
    "sourcePage": 415,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 4,
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
        "label": "Assault Rifle",
        "totalBase": 10,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Medium Melee Weapon",
        "totalBase": 10,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Very Heavy Pistol",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle",
        "skillBase": 10,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Medium Melee Weapon",
        "skillBase": 10,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Very Heavy Pistol",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neural Link (Kerenzikov Speedware)"
    ],
    "gear": [
      "Rifle Ammo x50",
      "Very Heavy Pistol Ammo x30",
      "Bulletproof Shield (10 HP)",
      "Binoculars",
      "Disposable Cellphone",
      "Flashlight",
      "Handcuffs x2",
      "Radio Communicator",
      "Radio Scanner/Music Player"
    ],
    "specialRules": [
      "Los Skill Bases ya combinan STAT + Skill + modificadores de cyberware, Role Abilities y equipo; el NPC no tiene Rol, Role Abilities ni LUCK salvo indicacion.",
      "Lieutenant. Los valores entre parentesis son los modificados por la armadura (REF 6, DEX 4, MOVE 4 y los skills basados en ellos; ver skillBasesArmorModified).",
      "Errata v1.25: SP 12 en cabeza y cuerpo (v1.24 imprime 13); Stealth 8 (6) y Tactics 6."
    ],
    "loreSummary": "",
    "skillBases": {
      "Athletics": 10,
      "Autofire": 12,
      "Brawling": 10,
      "Concentration": 7,
      "Conversation": 6,
      "Deduction": 6,
      "Drive Land Vehicle": 12,
      "Education": 6,
      "Evasion": 10,
      "First Aid": 6,
      "Handgun": 10,
      "Human Perception": 6,
      "Interrogation": 8,
      "Language (Native)": 6,
      "Language (Streetslang)": 6,
      "Local Expert (Your Home)": 6,
      "Melee Weapon": 10,
      "Perception": 6,
      "Persuasion": 8,
      "Resist Torture/Drugs": 10,
      "Shoulder Arms": 10,
      "Stealth": 8,
      "Tactics": 6
    },
    "isNetrunner": false
  },
  {
    "id": "core-outrider",
    "name": "Outrider",
    "subtitle": "",
    "faction": "",
    "threatTier": "mini_boss",
    "sourceBook": "core",
    "sourceBookTitle": "Cyberpunk RED Core Rulebook",
    "era": "2045",
    "format": "red",
    "sourcePage": 415,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 8,
      "DEX": 8,
      "TECH": 3,
      "COOL": 5,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Assault Rifle",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Light Melee Weapon",
        "totalBase": 12,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Very Heavy Pistol",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 14
      },
      {
        "label": "Perception",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Light Melee Weapon",
        "skillBase": 12,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Very Heavy Pistol",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Cyberaudio Suite (Amplified Hearing)",
      "Cybereye (Targeting Scope, TeleOptics)",
      "Neural Link (Interface Plugs)"
    ],
    "gear": [
      "Rifle Ammo x60",
      "Very Heavy Pistol Ammo x40",
      "Handcuffs x2",
      "Homing Tracers",
      "Radio Communicator"
    ],
    "specialRules": [
      "Los Skill Bases ya combinan STAT + Skill + modificadores de cyberware, Role Abilities y equipo; el NPC no tiene Rol, Role Abilities ni LUCK salvo indicacion.",
      "Moto Family 4 aparece como primer Skill Base. Mini Boss: regla practica 1 Mini Boss por cada 3 Edgerunners.",
      "Role Ability: Moto Family rank 4"
    ],
    "loreSummary": "",
    "roleAbility": {
      "name": "Moto Family",
      "rank": 4
    },
    "skillBases": {
      "Moto Family": 4,
      "Animal Handling": 8,
      "Athletics": 14,
      "Autofire": 12,
      "Basic Tech": 5,
      "Brawling": 14,
      "Concentration": 10,
      "Conversation": 6,
      "Criminology": 10,
      "Drive Land Vehicle": 14,
      "Education": 8,
      "Endurance": 10,
      "Evasion": 14,
      "First Aid": 5,
      "Handgun": 14,
      "Human Perception": 8,
      "Land Vehicle Tech": 7,
      "Language (Native)": 8,
      "Language (Streetslang)": 8,
      "Local Expert (Badlands)": 10,
      "Local Expert (Your Home)": 8,
      "Melee Weapons": 12,
      "Perception": 14,
      "Persuasion": 7,
      "Resist Torture/Drugs": 12,
      "Shoulder Arms": 14,
      "Stealth": 12,
      "Streetwise": 9,
      "Tracking": 10
    },
    "isNetrunner": false
  },
  {
    "id": "core-pyro",
    "name": "Pyro",
    "subtitle": "",
    "faction": "",
    "threatTier": "mini_boss",
    "sourceBook": "core",
    "sourceBookTitle": "Cyberpunk RED Core Rulebook",
    "era": "2045",
    "format": "red",
    "sourcePage": 416,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 6,
      "TECH": 7,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Flamethrower",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Pistol",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Flamethrower",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 1,
        "mag": 4,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Heavy Weapons"
      },
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Heavy Pistol",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Cyberaudio Suite (Level Dampners)",
      "Cybereye x2 (Anti-Dazzle x2)",
      "Nasal Filters"
    ],
    "gear": [
      "Flamethrower Ammo (Incendiary Shotgun Shells) x8",
      "Very Heavy Pistol Ammo x50",
      "Incendiary Grenade x1",
      "Flashbang Grenade x1"
    ],
    "specialRules": [
      "Los Skill Bases ya combinan STAT + Skill + modificadores de cyberware, Role Abilities y equipo; el NPC no tiene Rol, Role Abilities ni LUCK salvo indicacion.",
      "Combat Awareness 4 aparece como primer Skill Base. Mini Boss.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "",
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Combat Awareness": 4,
      "Athletics": 11,
      "Basic Tech": 12,
      "Brawling": 10,
      "Concentration": 8,
      "Conversation": 5,
      "Demolition": 13,
      "Drive Land Vehicle": 10,
      "Education": 7,
      "Evasion": 13,
      "First Aid": 9,
      "Handgun": 14,
      "Heavy Weapons": 14,
      "Human Perception": 5,
      "Interrogation": 10,
      "Language (Native)": 7,
      "Language (Streetslang)": 7,
      "Local Expert (Your Home)": 7,
      "Melee Weapon": 13,
      "Perception": 12,
      "Persuasion": 6,
      "Resist Torture/Drugs": 14,
      "Science (Chemistry)": 10,
      "Stealth": 10,
      "Streetwise": 8,
      "Tactics": 8
    },
    "isNetrunner": false
  },
  {
    "id": "core-cyberpsycho",
    "name": "Cyberpsycho",
    "subtitle": "",
    "faction": "",
    "threatTier": "cyberpsycho",
    "sourceBook": "core",
    "sourceBookTitle": "Cyberpunk RED Core Rulebook",
    "era": "2045",
    "format": "red",
    "sourcePage": 416,
    "role": "",
    "hp": 55,
    "seriouslyWounded": 28,
    "deathSave": 10,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 8,
      "TECH": 5,
      "COOL": 4,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 10,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Popup Grenade Launcher",
        "totalBase": 14,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "Cybersnake",
        "totalBase": 17,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Popup Heavy SMG",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Wolvers",
        "totalBase": 17,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 9
      }
    ],
    "weapons": [
      {
        "name": "Popup Grenade Launcher",
        "skillBase": 14,
        "damage": "6d6",
        "rof": 1,
        "mag": 2,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Heavy Weapons"
      },
      {
        "name": "Cybersnake",
        "skillBase": 17,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.114",
        "skill": "Melee Weapon"
      },
      {
        "name": "Popup Heavy SMG",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 1,
        "mag": 40,
        "notes": "Autofire 14 tambien disponible · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Wolvers",
        "skillBase": 17,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.115",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Cyberarm x2 (Popup Grenade Launcher x2, Popup Heavy SMG, Wolvers)",
      "Cyberleg x2 (Jump Boosters x2)",
      "Cybersnake",
      "Grafted Muscle & Bone Lace",
      "Neural Link (Chipware Socket, Pain Editor)",
      "Subdermal Armor"
    ],
    "gear": [
      "Armor Piercing Grenade x2",
      "Heavy Pistol Ammo x100"
    ],
    "specialRules": [
      "Los Skill Bases ya combinan STAT + Skill + modificadores de cyberware, Role Abilities y equipo; el NPC no tiene Rol, Role Abilities ni LUCK salvo indicacion.",
      "Disenado como pelea completa de jefe: no ponerlo en la mesa salvo que los Edgerunners puedan con el reto."
    ],
    "loreSummary": "",
    "skillBases": {
      "Athletics": 16,
      "Autofire": 14,
      "Basic Tech": 11,
      "Brawling": 15,
      "Concentration": 6,
      "Conversation": 2,
      "Drive Land Vehicle": 10,
      "Education": 7,
      "Endurance": 10,
      "Evasion": 13,
      "First Aid": 6,
      "Handgun": 12,
      "Heavy Weapons": 14,
      "Human Perception": 2,
      "Interrogation": 13,
      "Language (Native)": 7,
      "Language (Streetslang)": 7,
      "Local Expert (Your Home)": 7,
      "Melee Weapon": 17,
      "Perception": 9,
      "Persuasion": 6,
      "Resist Torture/Drugs": 15,
      "Stealth": 10,
      "Tracking": 10
    },
    "isNetrunner": false
  }
];
