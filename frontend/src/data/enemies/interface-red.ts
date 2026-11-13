// Generado por scripts/gen_enemies.py desde data/enemies-src/. No editar a mano.
import type { EnemySheet } from '../enemiesCatalog';

export const INTERFACE_RED_ENEMIES: EnemySheet[] = [
  {
    "id": "ir2-crunch",
    "name": "Crunch",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 25,
    "role": "Netrunner",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 8,
      "REF": 6,
      "DEX": 5,
      "TECH": 7,
      "COOL": 5,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 4,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling",
        "totalBase": 7,
        "damage": "1d6",
        "rof": 2
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
        "name": "Heavy Pistol",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Heavy Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling",
        "skillBase": 7,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Listado como arma en el libro · ROF/cargador según tabla Core p.176",
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Heavy Pistol Ammo x20",
      "Cyberdeck w/ Insulated Wiring",
      "Virtuality Goggles"
    ],
    "specialRules": [
      "Netrunner con Interface 4 y un cyberdeck con Insulated Wiring; programas: Armor, DeckKrash, Hellbolt x2, Shield y Sword.",
      "Role Ability: Interface rank 4"
    ],
    "loreSummary": "Netrunner que lidera el equipo de ataque en la mision Hack Attack del Jumpstart Kit; tambien puede usarse como asesina contratada por un Fixer traicionado.",
    "roleAbility": {
      "name": "Interface",
      "rank": 4
    },
    "skillBases": {
      "Accounting": 12,
      "Athletics": 11,
      "Brawling": 7,
      "Bureaucracy": 12,
      "Concentration": 9,
      "Conversation": 5,
      "Drive Land Vehicle": 10,
      "Education": 10,
      "Electronics/Security Tech": 13,
      "Evasion": 11,
      "First Aid": 11,
      "Forgery": 13,
      "Handgun": 12,
      "Human Perception": 5,
      "Language (Finnish)": 12,
      "Language (Streetslang)": 10,
      "Library Search": 14,
      "Local Expert (Your Home)": 10,
      "Perception": 10,
      "Persuasion": 7,
      "Pick Lock": 13,
      "Stealth": 11
    },
    "isNetrunner": true,
    "interfaceRank": 4,
    "cyberdeckPrograms": [
      "Armor",
      "DeckKrash",
      "Hellbolt x2",
      "Shield",
      "Sword"
    ]
  },
  {
    "id": "ir2-dorothy",
    "name": "Dorothy",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 25,
    "role": "Tech",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 4,
      "TECH": 8,
      "COOL": 7,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Brawling",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "Very Heavy Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "Listado como arma en el libro · ROF/cargador según tabla Core p.176",
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Chemskin",
      "Light Tattoo x3",
      "Subdermal Armor",
      "Techhair"
    ],
    "gear": [
      "Very Heavy Pistol Ammo x8",
      "Agent",
      "High Fashion Footwear",
      "Techscanner",
      "Tech Bag"
    ],
    "specialRules": [
      "Maker 4: Fabrication Expertise 4 y Field Expertise 4.",
      "Role Ability: Maker rank 4"
    ],
    "loreSummary": "Lider de la banda Yellow Brick Road en la mision Definitely Not Kansas; su Private NET Architecture se usa en esa mision.",
    "roleAbility": {
      "name": "Maker",
      "rank": 4
    },
    "skillBases": {
      "Acting": 13,
      "Air Vehicle Tech": 10,
      "Athletics": 6,
      "Basic Tech": 10,
      "Brawling": 6,
      "Concentration": 7,
      "Conversation": 8,
      "Cybertech": 10,
      "Education": 8,
      "Electronics/Security Tech": 16,
      "Evasion": 10,
      "First Aid": 14,
      "Handgun": 12,
      "Human Perception": 8,
      "Land Vehicle Tech": 10,
      "Language (Italian)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Your Home)": 8,
      "Library Search": 14,
      "Perception": 8,
      "Personal Grooming": 15,
      "Persuasion": 13,
      "Sea Vehicle Tech": 10,
      "Stealth": 6,
      "Streetwise": 9,
      "Wardrobe & Style": 17,
      "Weaponstech": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ir2-dr-george-carver",
    "name": "Dr. George Carver",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 26,
    "role": "Medtech",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 8,
      "REF": 6,
      "DEX": 5,
      "TECH": 8,
      "COOL": 4,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Stun Gun",
        "totalBase": 0,
        "damage": "3d6",
        "rof": 2
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
        "name": "Heavy Pistol",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Expansive Heavy Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Stun Gun",
        "skillBase": 0,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "El libro no indica la habilidad del arma"
      }
    ],
    "cyberware": [
      "Nasal Filters",
      "Tool Hand"
    ],
    "gear": [
      "Expansive Heavy Pistol Ammo x10",
      "Agent",
      "Medtech Bag"
    ],
    "specialRules": [
      "Medtech: Medicine 2 (Surgery base 12).",
      "Tambien figura como Tech: Maker 2 (Fabrication Expertise 2, Field Expertise 2).",
      "Role Ability: Medicine rank 2"
    ],
    "loreSummary": "Dueno recomendado del edificio de The Apartment; si los PJ lo defienden les perdona el alquiler del mes siguiente y los cura gratis.",
    "roleAbility": {
      "name": "Medicine",
      "rank": 2
    },
    "skillBases": {
      "Air Vehicle Tech": 12,
      "Athletics": 11,
      "Brawling": 7,
      "Concentration": 8,
      "Conversation": 6,
      "Cybertech": 14,
      "Deduction": 12,
      "Education": 10,
      "Electronics/Security Tech": 14,
      "Evasion": 11,
      "First Aid": 10,
      "Handgun": 12,
      "Human Perception": 6,
      "Language (English)": 12,
      "Language (Streetslang)": 10,
      "Library Search": 10,
      "Local Expert (Your Home)": 10,
      "Paramedic": 14,
      "Perception": 10,
      "Persuasion": 6,
      "Pilot Air Vehicle": 10,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "ir2-gina-zepada",
    "name": "Gina Zepada",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 26,
    "role": "Nomad",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 8,
      "REF": 7,
      "DEX": 4,
      "TECH": 5,
      "COOL": 5,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 4,
      "EMP": 7
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 11,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Shotgun",
        "totalBase": 13,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 11,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "Very Heavy Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Shotgun",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "Shotgun Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Techhair"
    ],
    "gear": [
      "Very Heavy Pistol Ammo x40",
      "Shotgun Ammo x40",
      "Agent",
      "Roadbike w/ Bulletproof Glass x2 and NOS"
    ],
    "specialRules": [
      "Nomad: Moto 4.",
      "Role Ability: Moto rank 4"
    ],
    "loreSummary": "Vecina del edificio de The Apartment, con estadisticas provistas por si se necesita; puede presentarse como parte de los vecinos de los PJ.",
    "roleAbility": {
      "name": "Moto",
      "rank": 4
    },
    "skillBases": {
      "Acting": 9,
      "Animal Handling": 14,
      "Athletics": 6,
      "Brawling": 6,
      "Concentration": 8,
      "Conversation": 9,
      "Education": 10,
      "Evasion": 10,
      "First Aid": 11,
      "Forgery": 11,
      "Gamble": 12,
      "Handgun": 11,
      "Human Perception": 9,
      "Language (Education)": 12,
      "Language (Spanish)": 12,
      "Language (Streetslang)": 10,
      "Library Search": 10,
      "Local Expert (Your Home)": 12,
      "Perception": 10,
      "Persuasion": 7,
      "Resist Torture/Drugs": 10,
      "Riding": 11,
      "Shoulder Arms": 13,
      "Stealth": 6,
      "Tracking": 12,
      "Wilderness Survival": 12
    },
    "isNetrunner": false
  },
  {
    "id": "ir2-royal-grant-jung",
    "name": "Royal (Grant Jung)",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 27,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 7,
      "REF": 8,
      "DEX": 8,
      "TECH": 3,
      "COOL": 4,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Assault Rifle w/ Drum Magazine",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 14
      },
      {
        "label": "Perception",
        "totalBase": 13
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "Very Heavy Pistol Ammo · Handgun 12 con armadura puesta · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Assault Rifle w/ Drum Magazine",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "Rifle Ammo · Shoulder Arms 12 con armadura puesta · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Techhair"
    ],
    "gear": [
      "Rifle Ammo x45",
      "Very Heavy Pistol Ammo x8",
      "Agent"
    ],
    "specialRules": [
      "Con la armadura puesta: REF 6, DEX 6 y MOVE 4; Athletics, Autofire, Brawling, Evasion, Handgun, Shoulder Arms y Stealth bajan de 14 a 12.",
      "Solo: Combat Awareness 4.",
      "Segun la mision It's Just Business, solo debe traicionar a los PJ si hay un Solo presente.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Vecino Grant Jung, conocido como Royal, en The Apartment; puede traicionar al equipo si hay un Solo en la mesa.",
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 14,
      "Autofire": 14,
      "Brawling": 14,
      "Concentration": 8,
      "Conversation": 6,
      "Education": 9,
      "Evasion": 14,
      "First Aid": 9,
      "Gamble": 4,
      "Handgun": 14,
      "Human Perception": 6,
      "Language (Korean)": 11,
      "Language (Streetslang)": 9,
      "Local Expert": 9,
      "Perception": 13,
      "Persuasion": 6,
      "Shoulder Arms": 14,
      "Stealth": 14,
      "Tactics": 11,
      "Tracking": 11
    },
    "isNetrunner": false
  },
  {
    "id": "ir2-molly-anderson",
    "name": "Molly Anderson",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 27,
    "role": "Fixer",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 5,
      "DEX": 8,
      "TECH": 5,
      "COOL": 6,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 4,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Brawling",
        "totalBase": 14,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Light Melee Weapon",
        "totalBase": 0,
        "damage": "1d6",
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
        "name": "Brawling",
        "skillBase": 14,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Listado como arma en el libro · ROF/cargador según tabla Core p.176",
        "skill": "Brawling"
      },
      {
        "name": "Light Melee Weapon",
        "skillBase": 0,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "El libro no lista la habilidad Melee Weapons para este PNJ · ROF/cargador según tabla Core p.92"
      }
    ],
    "cyberware": [
      "Cyberarm w/ Realskinn Covering",
      "Cyberleg x2 w/ Realskinn Covering",
      "Light Tattoo x2"
    ],
    "gear": [
      "Incendiary Grenade x2",
      "Smoke Grenade x2",
      "Disposable Cell Phone"
    ],
    "specialRules": [
      "Fixer: Operator 4.",
      "Role Ability: Operator rank 4"
    ],
    "loreSummary": "Miembro de la familia Anderson, vecina en The Apartment, con estadisticas propias por si reaparece despues.",
    "roleAbility": {
      "name": "Operator",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 14,
      "Brawling": 14,
      "Concentration": 9,
      "Conversation": 6,
      "Demolitions": 10,
      "Education": 9,
      "Endurance": 13,
      "Evasion": 14,
      "First Aid": 7,
      "Human Perception": 10,
      "Language (English)": 11,
      "Language (German)": 11,
      "Language (Streetslang)": 13,
      "Local Expert (Your Home)": 13,
      "Perception": 9,
      "Persuasion": 8,
      "Pick Lock": 11,
      "Stealth": 10,
      "Streetwise": 10,
      "Trading": 12
    },
    "isNetrunner": false
  },
  {
    "id": "ir2-officer-lantz",
    "name": "Officer Lantz",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "NCPD",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 28,
    "role": "Lawman",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 4,
      "DEX": 8,
      "TECH": 4,
      "COOL": 5,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 7,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Martial Arts",
        "totalBase": 14,
        "damage": "3d6",
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
        "name": "Very Heavy Pistol",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "Armor Piercing Very Heavy Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Martial Arts",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Listado como arma en el libro",
        "skill": "Martial Arts (Judo)"
      }
    ],
    "cyberware": [
      "Audiovox",
      "Enhanced Antibodies",
      "Toxin Binders"
    ],
    "gear": [
      "Armor Piercing Very Heavy Pistol Ammo x8",
      "Agent"
    ],
    "specialRules": [
      "Lawman: Backup 4.",
      "Role Ability: Backup rank 4"
    ],
    "loreSummary": "Oficial de policia que entrega un lanzacohetes en la simulacion de la mision Just Like Real; su ficha se incluye por si hace falta.",
    "roleAbility": {
      "name": "Backup",
      "rank": 4
    },
    "skillBases": {
      "Acting": 7,
      "Athletics": 10,
      "Brawling": 14,
      "Concentration": 8,
      "Conversation": 7,
      "Criminology": 13,
      "Deduction": 9,
      "Drive Land Vehicle": 10,
      "Education": 9,
      "Evasion": 14,
      "First Aid": 6,
      "Handgun": 10,
      "Human Perception": 7,
      "Interrogation": 11,
      "Language (English)": 11,
      "Language (French)": 9,
      "Language (Streetslang)": 9,
      "Library Search": 9,
      "Local Expert (Your Home)": 9,
      "Martial Arts (Judo)": 14,
      "Perception": 9,
      "Persuasion": 7,
      "Play Instrument (Singing)": 10,
      "Resist Torture/Drugs": 8,
      "Riding": 10,
      "Stealth": 10,
      "Tracking": 9,
      "Wardrobe & Style": 7
    },
    "isNetrunner": false
  },
  {
    "id": "ir2-rex-royale",
    "name": "Rex Royale",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "",
    "threatTier": "mini_boss",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 28,
    "role": "Fixer",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 7,
      "DEX": 7,
      "TECH": 4,
      "COOL": 8,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 6,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Heavy Pistol (Excellent Quality)",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Kendachi Mono-Three",
        "totalBase": 0,
        "damage": "4d6",
        "rof": 1
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
        "name": "Heavy Pistol (Excellent Quality)",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Kendachi Mono-Three",
        "skillBase": 0,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Armor Piercing Very Heavy Pistol Ammo · El libro no indica la habilidad; la municion AP Very Heavy Pistol de su equipo sugiere pistola muy pesada (inferido)"
      }
    ],
    "cyberware": [],
    "gear": [
      "Armor Piercing Very Heavy Pistol Ammo x16",
      "Smoke Grenade x2",
      "Agent",
      "Disposable Cell Phone x2",
      "Smart Glasses w/ Low Light/Infrared/UV"
    ],
    "specialRules": [
      "Fixer: Operator 8.",
      "Role Ability: Operator rank 8"
    ],
    "loreSummary": "Fixer que puede darles trabajos a los PJ (como Precious Cargo) tras salvar el edificio; el libro dice que probablemente no haga falta su ficha en la primera mision.",
    "roleAbility": {
      "name": "Operator",
      "rank": 8
    },
    "skillBases": {
      "Athletics": 9,
      "Brawling": 13,
      "Bribery": 12,
      "Conceal/Reveal Object": 13,
      "Concentration": 8,
      "Conversation": 8,
      "Education": 9,
      "Evasion": 13,
      "First Aid": 6,
      "Gamble": 13,
      "Handgun": 13,
      "Human Perception": 8,
      "Language (Chinese)": 11,
      "Language (English)": 11,
      "Language (Italian)": 11,
      "Language (Japanese)": 11,
      "Language (Korean)": 11,
      "Language (Russian)": 11,
      "Language (Streetslang)": 9,
      "Language (Spanish)": 11,
      "Local Expert (South Night City)": 13,
      "Local Expert (University District)": 13,
      "Local Expert (Your Home)": 13,
      "Melee Weapons": 16,
      "Perception": 9,
      "Persuasion": 14,
      "Resist Torture/Drugs": 10,
      "Stealth": 9,
      "Streetwise": 14,
      "Trading": 16,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ir2-rico-robinson",
    "name": "Rico Rico (Rico Robinson)",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 29,
    "role": "Rockerboy",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 4,
      "DEX": 6,
      "TECH": 7,
      "COOL": 7,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 6,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling",
        "totalBase": 8,
        "damage": "2d6",
        "rof": 2
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
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapons"
      },
      {
        "name": "Brawling",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "Listado como arma en el libro · ROF/cargador según tabla Core p.176",
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Cyberaudio Suite w/ Audio Recorder"
    ],
    "gear": [
      "Agent",
      "Electric Guitar",
      "Pocket Amplifier"
    ],
    "specialRules": [
      "Rockerboy: Charismatic Impact 4.",
      "Role Ability: Charismatic Impact rank 4"
    ],
    "loreSummary": "Vecino rockero Rico Robinson en The Apartment; una idea de escena es hacerles de seguridad en uno de sus conciertos.",
    "roleAbility": {
      "name": "Charismatic Impact",
      "rank": 4
    },
    "skillBases": {
      "Acting": 11,
      "Athletics": 8,
      "Brawling": 8,
      "Bribery": 11,
      "Composition": 12,
      "Concentration": 7,
      "Conversation": 8,
      "Dance": 12,
      "Education": 8,
      "Evasion": 12,
      "First Aid": 9,
      "Human Perception": 8,
      "Language (English)": 10,
      "Language (Spanish)": 10,
      "Language (Streetslang)": 8,
      "Library Search": 8,
      "Local Expert (Your Home)": 12,
      "Melee Weapons": 12,
      "Perception": 8,
      "Persuasion": 9,
      "Pick Pocket": 11,
      "Play Instrument (Guitar)": 13,
      "Stealth": 8,
      "Streetwise": 13,
      "Wardrobe & Style": 15
    },
    "isNetrunner": false
  },
  {
    "id": "ir2-streamline",
    "name": "Streamline",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 29,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 8,
      "TECH": 4,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 7,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Assault Rifle",
        "totalBase": 13,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Wolvers",
        "totalBase": 0,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 14
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "Rifle Ammunition · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Wolvers",
        "skillBase": 0,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Cyberware; el libro no indica la habilidad · ROF/cargador según tabla Core p.115"
      }
    ],
    "cyberware": [
      "Cybereye w/ Targeting Scope",
      "Cyberleg x2",
      "Wolvers"
    ],
    "gear": [
      "Rifle Ammunition x15",
      "Agent",
      "Grapple Gun"
    ],
    "specialRules": [
      "Solo: Combat Awareness 4.",
      "Segun la mision Unknown Caller, dirige un equipo de Security Operatives con Light Armorjack; puede escapar sin usar su tirolesa o saltando por la ventana y absorbiendo la caida con las cyberlegs.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Francotirador que lidera el equipo de ataque en Unknown Caller; puede reutilizarse como antagonista futuro o como asesino contratado por un Fixer traicionado.",
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Acting": 10,
      "Athletics": 14,
      "Brawling": 14,
      "Bureaucracy": 8,
      "Concentration": 7,
      "Contortionist": 14,
      "Conversation": 4,
      "Education": 6,
      "Evasion": 14,
      "First Aid": 6,
      "Human Perception": 4,
      "Language (Russian)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Your Home)": 6,
      "Melee Weapons": 14,
      "Perception": 10,
      "Persuasion": 6,
      "Resist Torture/Drugs": 11,
      "Shoulder Arms": 13,
      "Stealth": 14,
      "Tactics": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ir2-ten-gallon",
    "name": "Ten Gallon",
    "subtitle": "Jumpstart Kit Conversion Guide",
    "faction": "",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 2",
    "era": "2045",
    "format": "red",
    "sourcePage": 30,
    "role": "Lawman",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 6,
      "TECH": 6,
      "COOL": 4,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 6,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Assault Rifle w/ Infrared Nightvision Scope",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Stun Baton",
        "totalBase": 0,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 8
      },
      {
        "label": "Perception",
        "totalBase": 11
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle w/ Infrared Nightvision Scope",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "notes": "Rifle Ammo",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Stun Baton",
        "skillBase": 0,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "El libro no indica la habilidad"
      }
    ],
    "cyberware": [],
    "gear": [
      "Rifle Ammo x25",
      "Agent",
      "Grapple Gun",
      "Smart Glasses w/ Targeting Scope and TeleOptics"
    ],
    "specialRules": [
      "Lawman: Backup 4.",
      "Segun la mision Just Like Real, va en un Gyrocopter con Armored Chassis (SP13).",
      "Role Ability: Backup rank 4"
    ],
    "loreSummary": "Policia que vuela un girocoptero blindado durante la simulacion final de la mision Just Like Real.",
    "roleAbility": {
      "name": "Backup",
      "rank": 4
    },
    "skillBases": {
      "Animal Handling": 10,
      "Athletics": 8,
      "Brawling": 12,
      "Concentration": 8,
      "Conversation": 6,
      "Criminology": 10,
      "Deduction": 10,
      "Drive Land Vehicle": 14,
      "Education": 7,
      "Evasion": 8,
      "First Aid": 8,
      "Handgun": 14,
      "Human Perception": 6,
      "Land Vehicle Tech": 12,
      "Language (English)": 9,
      "Language (Spanish)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Your Home)": 7,
      "Perception": 11,
      "Persuasion": 6,
      "Pilot Air Vehicle": 11,
      "Riding": 12,
      "Shoulder Arms": 14,
      "Stealth": 8,
      "Tracking": 8
    },
    "isNetrunner": false
  },
  {
    "id": "ir4-philharmonic-vampyre",
    "name": "Philharmonic Vampyre",
    "subtitle": "Halloween Screamsheets (Rep 0)",
    "faction": "Philharmonic Vampyres",
    "threatTier": "mook",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 4",
    "era": "2045",
    "format": "red",
    "sourcePage": 60,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 2,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 5,
      "TECH": 4,
      "COOL": 6,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 2,
      "EMP": 7
    },
    "combatBases": [
      {
        "label": "Vampyres",
        "totalBase": 12,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Heavy Pistol (Poor Quality)",
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
        "name": "Vampyres",
        "skillBase": 12,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Nombre del arma ilegible/ambiguo en la extraccion (aparece como 'Vampyres') Vampyres: ciberware de colmillos (Core p.115).",
        "skill": "Melee Weapon"
      },
      {
        "name": "Heavy Pistol (Poor Quality)",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Rubber Bullets · Equipo del libro: Rubber Bullets x8 · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Nasal Filters",
      "Shift Tacts",
      "Techhair"
    ],
    "gear": [
      "Rubber Bullets x8",
      "Disposable Cellphone",
      "Any props needed for pranks"
    ],
    "specialRules": [
      "En la aventura hay Crew x3 Vampyres; priorizan el caos sobre pelear y solo se defienden si alguien dispara.",
      "Huyen y se reagrupan tras dos compañeros sometidos o detenidos."
    ],
    "loreSummary": "Miembros de los Philharmonic Vampyres, banda gótica y bromista que revienta fiestas de Halloween con travesuras sin ánimo de herir.",
    "rep": 0,
    "skillBases": {
      "Acting": 10,
      "Athletics": 7,
      "Brawling": 7,
      "Concentration": 7,
      "Conversation": 9,
      "Dance": 8,
      "Education": 11,
      "Evasion": 7,
      "First Aid": 6,
      "Handgun": 12,
      "Human Perception": 9,
      "Language (Native)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (University District)": 8,
      "Melee Weapon": 12,
      "Perception": 8,
      "Personal Grooming": 10,
      "Persuasion": 10,
      "Stealth": 10,
      "Streetwise": 9,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ir4-laura-june-maybach",
    "name": "Laura June Maybach",
    "subtitle": "Halloween Screamsheets",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 4",
    "era": "2045",
    "format": "red",
    "sourcePage": 64,
    "role": "Medtech",
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
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Popup Flamethrower",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Heavy Pistol",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 14
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Popup Flamethrower",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 1,
        "mag": 4,
        "notes": "Incendiary Shotgun Shells · Cyberbrazo (Cyberarm w/Popup Flamethrower); munición asignada por el equipo listado · ROF/cargador según tabla Core p.94",
        "skill": "Heavy Weapons"
      },
      {
        "name": "Heavy Pistol",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Heavy Pistol Ammo · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Cyberaudio Suite w/ Level Dampners",
      "Cybereye x2 w/ Anti-Dazzle x2",
      "Cyberarm w/Popup Flamethrower",
      "Nasal Filters"
    ],
    "gear": [
      "Incendiary Shotgun Shells x8",
      "Heavy Pistol Ammo x16",
      "Incendiary Grenade x1",
      "Flashbang Grenade x1",
      "Agent"
    ],
    "specialRules": [
      "Habilidad de rol Medtech: Medicine 2 (Surgery 2).",
      "En la aventura ataca a la Crew en North Cargo Village por considerarlos rivales por el afecto de TSpooks.",
      "Role Ability: Medicine rank 2"
    ],
    "loreSummary": "Ex-cyberpsycho y ex-Medtech de Savage Docs, tras años de terapia se obsesiona con la influencer TSpooks; creó el falso hombre lobo para impulsar su carrera.",
    "roleAbility": {
      "name": "Medicine",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 11,
      "Basic Tech": 9,
      "Brawling": 10,
      "Concentration": 8,
      "Conversation": 2,
      "Cybertech": 9,
      "Education": 10,
      "Evasion": 14,
      "First Aid": 9,
      "Handgun": 14,
      "Heavy Weapons": 14,
      "Human Perception": 2,
      "Language (English)": 7,
      "Language (Streetslang)": 7,
      "Local Expert (Watson)": 7,
      "Paramedic": 9,
      "Perception": 7,
      "Persuasion": 6,
      "Resist Torture/Drugs": 12,
      "Stealth": 10,
      "Surgery": 11
    },
    "isNetrunner": false
  },
  {
    "id": "ir5-pet-datarabbit",
    "name": "Datarabbit™",
    "subtitle": "Cyberpet® de Biotechnica",
    "faction": "Biotechnica",
    "threatTier": "mook",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 5",
    "era": "2045",
    "format": "red",
    "sourcePage": 74,
    "role": "",
    "hp": 10,
    "seriouslyWounded": 5,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 2,
      "REF": 8,
      "DEX": 8,
      "TECH": 2,
      "COOL": 2,
      "WILL": 2,
      "LUCK": 0,
      "MOVE": 10,
      "BODY": 3,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Teeth",
        "totalBase": 8,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Teeth",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "TUp (Independent Mounting) Homing Tracer Cyberfinger",
      "TUp (+1 Option Slot) Cybereye w/ Chipware Compartment & Hardened Cybereye Casing",
      "Subdermal Armor"
    ],
    "gear": [],
    "specialRules": [
      "Cybereye con compartimento para chips de memoria y carcasa endurecida (protegida contra EMP): transporta datos sensibles.",
      "Homing Tracer Cyberfinger: permite localizar a la mascota después."
    ],
    "loreSummary": "Conejo biodiseñado como portador de datos: su ojo es un compartimento protegido contra EMP para chips de memoria; rápido y con rastreador implantado.",
    "skillBases": {
      "Athletics": 10,
      "Endurance": 8,
      "Evasion": 12,
      "Human Perception": 8,
      "Perception": 10,
      "Stealth": 10,
      "Wilderness Survival": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ir5-pet-forever-turtle",
    "name": "Forever Turtle™",
    "subtitle": "Cyberpet® de Biotechnica",
    "faction": "Biotechnica",
    "threatTier": "hardened_mook",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 5",
    "era": "2045",
    "format": "red",
    "sourcePage": 75,
    "role": "",
    "hp": 15,
    "seriouslyWounded": 7,
    "deathSave": 2,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 2,
      "REF": 2,
      "DEX": 3,
      "TECH": 2,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 2,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Combat Jaw",
        "totalBase": 8,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Brawling Attack",
        "totalBase": 5,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Combat Jaw",
        "skillBase": 8,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Cyberware Combat Jaw",
        "skill": "Melee Weapon"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 5,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Combat Jaw",
      "Hardened Shell (Subdermal Armor)",
      "Trauma Response Nanomatrix"
    ],
    "gear": [],
    "specialRules": [
      "Protection: puede replegar cabeza y extremidades en el caparazón; entonces el SP de su Hardened Shell cubre también la cabeza y no puede ser objetivo de Aimed Shots."
    ],
    "loreSummary": "Una de las Cyberpets originales; con Trauma Response Nanomatrix para longevidad y ADN de más de seis especies, es una amalgama de tortuga inquietante.",
    "skillBases": {
      "Athletics": 5,
      "Brawling": 5,
      "Evasion": 12,
      "Human Perception": 8,
      "Melee Weapon": 8,
      "Perception": 10,
      "Stealth": 10,
      "Wilderness Survival": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ir5-pet-neon-newt",
    "name": "Neon Newt™",
    "subtitle": "Cyberpet® de Biotechnica",
    "faction": "Biotechnica",
    "threatTier": "hardened_mook",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 5",
    "era": "2045",
    "format": "red",
    "sourcePage": 76,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 3,
    "headSp": 0,
    "bodySp": 0,
    "stats": {
      "INT": 1,
      "REF": 4,
      "DEX": 5,
      "TECH": 2,
      "COOL": 3,
      "WILL": 2,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 2,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Flamebreath",
        "totalBase": 8,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Acid Secretion",
        "totalBase": 5,
        "damage": "",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Flamebreath",
        "skillBase": 8,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Actua como Flamethrower (CP:R p.348)",
        "skill": "Heavy Weapons"
      },
      {
        "name": "Acid Secretion",
        "skillBase": 5,
        "damage": "",
        "rof": 2,
        "mag": 0,
        "notes": "Reduce el SP de toda armadura usada en 1; sin daño",
        "skill": "Brawling"
      }
    ],
    "cyberware": [],
    "gear": [],
    "specialRules": [
      "Acid Secretion: con un ataque exitoso el ácido no hace daño pero baja en 1 el SP de toda la armadura puesta; se ataca con Brawling, no Melee Weapon.",
      "Flamebreath: actúa como Flamethrower (CP:R p.348); no puede usarse si se activo en el Turno anterior del tritón."
    ],
    "loreSummary": "Tritón de bolsillo genéticamente modificado que escupe fuego al ser apretado y cuya piel secreta ácido, con colores neon de laboratorio.",
    "skillBases": {
      "Athletics": 5,
      "Brawling": 5,
      "Contortionist": 12,
      "Evasion": 12,
      "Human Perception": 4,
      "Heavy Weapons": 8,
      "Melee Weapon": 7,
      "Perception": 12,
      "Stealth": 10,
      "Wilderness Survival": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ir5-pet-obsidian-ocelot",
    "name": "Obsidian Ocelot™",
    "subtitle": "Cyberpet® de Biotechnica",
    "faction": "Biotechnica",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 5",
    "era": "2045",
    "format": "red",
    "sourcePage": 77,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 5,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 3,
      "REF": 9,
      "DEX": 8,
      "TECH": 2,
      "COOL": 2,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 5,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Combat Jaw",
        "totalBase": 15,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Cat Claws",
        "totalBase": 15,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 15
      },
      {
        "label": "Perception",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Combat Jaw",
        "skillBase": 15,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "skill": "Melee Weapon"
      },
      {
        "name": "Cat Claws",
        "skillBase": 15,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Combat Jaw",
      "TUp (Animal Compatibility) FBC Chameleon Coating",
      "TUp (+1 SP) Subdermal Armor"
    ],
    "gear": [],
    "specialRules": [
      "Combat Awareness: sin ser Solo, puede usar la habilidad de rol Combat Awareness (CP:R p.146) con Rank 5."
    ],
    "loreSummary": "Felino criado para clientes de alto nivel: ornamento hermoso y asesino sigiloso; unos pocos acompañan a asesinos que no podrías pagar.",
    "skillBases": {
      "Athletics": 16,
      "Brawling": 13,
      "Endurance": 8,
      "Evasion": 15,
      "Human Perception": 8,
      "Melee Weapon": 15,
      "Perception": 12,
      "Stealth": 15,
      "Tactics": 12,
      "Tracking": 13,
      "Wilderness Survival": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ir5-pet-cyberbear",
    "name": "Cyberbear™",
    "subtitle": "Cyberpet® de Biotechnica",
    "faction": "Biotechnica",
    "threatTier": "mini_boss",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 5",
    "era": "2045",
    "format": "red",
    "sourcePage": 78,
    "role": "",
    "hp": 55,
    "seriouslyWounded": 28,
    "deathSave": 10,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 3,
      "REF": 8,
      "DEX": 8,
      "TECH": 6,
      "COOL": 5,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 10,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Bear Claw",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Combat Jaw",
        "totalBase": 16,
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
        "name": "Bear Claw",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Combat Jaw",
        "skillBase": 16,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Cyberware Combat Jaw",
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Combat Jaw",
      "Grafted Muscle & Bone Lace",
      "Neural Link w/ Chipware Socket & Pain Editor",
      "TUp (+2 SP, Requires BODY 10) Subdermal Armor"
    ],
    "gear": [],
    "specialRules": [
      "Arte marcial Cyberbear (innata, imposible de aprender): Special Move Recovery (si está derribado, al usar Get Up puede superar DV13 con Martial Arts Special Move Resolution para que no cueste Acción).",
      "Cyberbear Three-Arm Strike: una vez por Turno si golpea al mismo objetivo con dos Bear Claw, intenta DV15; si triunfa elige: agarrar/soltar al objetivo, atacar de nuevo con Bear Claw o Combat Jaw, causar una Body Critical Injury aleatoria (CP:R p.187) o reducir 4 el SP de la armadura del objetivo. Si falla sufre 5 de daño directo a HP (tumor)."
    ],
    "loreSummary": "Oso con un tercer brazo (no cibernético) y tumores cerebrales que lo vuelven feral; algunos escaparon y viven en el Yukon de Alaska.",
    "skillBases": {
      "Athletics": 14,
      "Brawling": 16,
      "Concentration": 10,
      "Evasion": 10,
      "Human Perception": 7,
      "Martial Arts (Cyberbear)": 10,
      "Melee Weapon": 16,
      "Perception": 11,
      "Persuasion": 7,
      "Resist Torture/Drugs": 15,
      "Stealth": 10,
      "Wilderness Survival": 14
    },
    "isNetrunner": false
  },
  {
    "id": "ir5-pet-cyberboa",
    "name": "Cyberboa™",
    "subtitle": "Cyberpet® de Biotechnica",
    "faction": "Biotechnica",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 5",
    "era": "2045",
    "format": "red",
    "sourcePage": 79,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 3,
      "REF": 5,
      "DEX": 9,
      "TECH": 3,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 7,
      "EMP": 1
    },
    "combatBases": [
      {
        "label": "TUp (Airhypo) Vampyres",
        "totalBase": 15,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 14
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "TUp (Airhypo) Vampyres",
        "skillBase": 15,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Airhypo Vampyres inyectan una dosis de la sustancia cargada",
        "skill": "Melee Weapon"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "TUp (\"Third Eye\" Mounted) Flashbulb",
      "Neural Link w/ Chipware Socket & Pain Editor",
      "TUp (+1 SP) Subdermal Armor",
      "TUp (Airhypo) Vampyres"
    ],
    "gear": [],
    "specialRules": [
      "Airhypo Vampyres: al acertar con los Vampyres (aunque no haga daño) inyecta una dosis; un compartimento en la boca carga hasta 5 dosis de un solo Biotoxin, Poison o Streetdrug."
    ],
    "loreSummary": "Serpiente vendida como operativa de búsqueda y rescate, con el ADN de las serpientes más peligrosas del mundo.",
    "skillBases": {
      "Athletics": 11,
      "Brawling": 16,
      "Contortionist": 11,
      "Endurance": 8,
      "Evasion": 14,
      "Human Perception": 4,
      "Melee Weapon": 15,
      "Perception": 10,
      "Stealth": 13,
      "Tracking": 10,
      "Wilderness Survival": 12
    },
    "isNetrunner": false
  },
  {
    "id": "ir5-pet-cyberrat",
    "name": "Cyberrat™",
    "subtitle": "Cyberpet® de Biotechnica",
    "faction": "Biotechnica",
    "threatTier": "mook",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 5",
    "era": "2045",
    "format": "red",
    "sourcePage": 80,
    "role": "",
    "hp": 10,
    "seriouslyWounded": 5,
    "deathSave": 5,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 3,
      "REF": 6,
      "DEX": 8,
      "TECH": 3,
      "COOL": 2,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 9,
      "BODY": 3,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Venom Fangs/Claws",
        "totalBase": 12,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 5,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Venom Fangs/Claws",
        "skillBase": 12,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Ver specialRules (veneno)",
        "skill": "Melee Weapon"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 5,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Cyberaudio w/ Audio Recorder",
      "Cybereye w/ MicroVideo",
      "Neural Link w/ Chipware Socket & Memory Chip",
      "Skinweave"
    ],
    "gear": [],
    "specialRules": [
      "Venom Fangs/Claws: al acertar (aunque no haga daño) el objetivo debe superar un Resist Torture/Drugs DV13 o sufre 1d6 de daño adicional directo a HP.",
      "El Brawling base (5) es menor que su DEX a propósito: el tamaño reduce su capacidad de combate con patas."
    ],
    "loreSummary": "Rata venenosa bioaumentada para espionaje corporativo, con cyberware de vigilancia y skinweave; operativa prescindible o vigilante de apartamento.",
    "skillBases": {
      "Athletics": 10,
      "Brawling": 5,
      "Concentration": 8,
      "Endurance": 6,
      "Evasion": 12,
      "Human Perception": 8,
      "Melee Weapon": 12,
      "Perception": 10,
      "Stealth": 15,
      "Wilderness Survival": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ir5-pet-cyberwolf",
    "name": "Cyberwolf™",
    "subtitle": "Cyberpet® de Biotechnica",
    "faction": "Biotechnica",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "interface_red",
    "sourceBookTitle": "Interface RED Volume 5",
    "era": "2045",
    "format": "red",
    "sourcePage": 81,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 5,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 3,
      "REF": 7,
      "DEX": 8,
      "TECH": 2,
      "COOL": 2,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 5,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "TUp (Grapple Damage Bonus) Combat Jaw",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Claws",
        "totalBase": 12,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "TUp (Grapple Damage Bonus) Combat Jaw",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "+1d6 de daño contra el objetivo que está agarrando",
        "skill": "Melee Weapon"
      },
      {
        "name": "Claws",
        "skillBase": 12,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "TUp (+1d6 damage vs target the Cyberwolf is grappling) Combat Jaw",
      "Cyberaudio Suite w/Internal Agent",
      "Cybereye w/Chyron & Targeting Scope"
    ],
    "gear": [],
    "specialRules": [
      "Combat Awareness: sin ser Solo, puede usar la habilidad de rol Combat Awareness (CP:R p.146) con Rank 3 mientras esté a 20 m/yds de otro Cyberwolf de su manada.",
      "Viene con una Light Armorjack a medida (SP 11 en cuerpo)."
    ],
    "loreSummary": "Cazadores de manada cibernéticos con mandíbulas hidráulicas, pensados para ser la nueva cima de la cadena alimenticia; también se venden como perros de seguridad.",
    "skillBases": {
      "Athletics": 13,
      "Brawling": 14,
      "Concentration": 6,
      "Endurance": 8,
      "Evasion": 13,
      "Human Perception": 8,
      "Melee Weapon": 12,
      "Perception": 10,
      "Stealth": 10,
      "Tactics": 14,
      "Tracking": 16,
      "Wilderness Survival": 12
    },
    "isNetrunner": false
  }
];
