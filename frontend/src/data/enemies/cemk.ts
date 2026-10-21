// Generado por scripts/gen_enemies.py desde data/enemies-src/. No editar a mano.
import type { EnemySheet } from '../enemiesCatalog';

export const CEMK_ENEMIES: EnemySheet[] = [
  {
    "id": "cemk-falco",
    "name": "Falco",
    "subtitle": "Aliado nomad, conductor de huida - The Jacket p.33",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Jacket",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 33,
    "role": "Nomad",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "headSpVsMelee": 6,
    "bodySpVsMelee": 6,
    "stats": {
      "INT": 6,
      "REF": 8,
      "DEX": 6,
      "TECH": 5,
      "COOL": 4,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 6,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Brawling Attack",
        "totalBase": 12,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Techtronika RT-46 Burya",
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
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Brawling Attack",
        "skillBase": 12,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "Ataque desarmado",
        "skill": "Brawling"
      },
      {
        "name": "Techtronika RT-46 Burya",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 4,
        "notes": "Tira DV por rango (m/yd) del Burya: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 30, 201+: no. Su Arasaka Cyberarm le deja dispararla sin romperse el brazo.",
        "weaponType2077": "Tech",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport",
      "EMP Threading",
      "Arasaka Cyberarm"
    ],
    "gear": [],
    "specialRules": [
      "Nomad 6: +6 a Drive Land Vehicle, ya sumado en su base de 20.",
      "Role Ability: Nomad (+6 Drive Land Vehicle, ya incluido) rank 6"
    ],
    "loreSummary": "Conductor superviviente del equipo de David; cliente de la mision, busca recuperar la chaqueta perdida y es buscado por Arasaka y el NCPD.",
    "rep": 7,
    "roleAbility": {
      "name": "Nomad (+6 Drive Land Vehicle, ya incluido)",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 12,
      "Concentration": 6,
      "Conversation": 10,
      "Deduction": 10,
      "Drive Land Vehicle": 20,
      "Education": 6,
      "Endurance": 10,
      "Evasion": 12,
      "First Aid": 11,
      "Handgun": 14,
      "Human Perception": 12,
      "Local Expert": 12,
      "Perception": 12,
      "Persuasion": 8,
      "Resist Torture/Drugs": 10,
      "Stealth": 10,
      "Streetwise": 8,
      "Tracking": 12,
      "Wardrobe & Style": 8
    },
    "isNetrunner": false,
    "hasNeuroport": true
  },
  {
    "id": "cemk-dalton-estevan-luis",
    "name": "Dalton Estevan-Luis",
    "subtitle": "Valentino de bajo rango, ladron de la chaqueta - The Jacket p.34",
    "faction": "Valentinos",
    "threatTier": "lieutenant",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Jacket",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 34,
    "role": "Tech",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "headSpVsMelee": 6,
    "bodySpVsMelee": 6,
    "stats": {
      "INT": 5,
      "REF": 6,
      "DEX": 6,
      "TECH": 7,
      "COOL": 4,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 4,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Constitutional Arms Unity",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Ataque desarmado",
        "skill": "Brawling"
      },
      {
        "name": "Constitutional Arms Unity",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 12,
        "notes": "Tira DV por rango (m/yd) del Unity: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 30, 201+: no.",
        "weaponType2077": "Power",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport",
      "Tech Hair (pelo artificial programable)",
      "Dynalar Tool Cyberarm"
    ],
    "gear": [],
    "specialRules": [
      "Tech 4: +4 a Electronics/Security Tech, ya sumado en la base de 17.",
      "Role Ability: Tech (+4 Electronics/Security Tech, ya incluido) rank 4"
    ],
    "loreSummary": "Joven Valentino de bajo rango que robo la chaqueta de un almacen; solo buscaba su lugar en la vida.",
    "rep": 1,
    "roleAbility": {
      "name": "Tech (+4 Electronics/Security Tech, ya incluido)",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 8,
      "Concentration": 8,
      "Conversation": 6,
      "Drive Land Vehicle": 10,
      "Education": 7,
      "Electronics/Security Tech": 17,
      "Evasion": 12,
      "First Aid": 13,
      "Handgun": 12,
      "Human Perception": 16,
      "Local Expert": 7,
      "Perception": 7,
      "Persuasion": 6,
      "Resist Torture/Drugs": 10,
      "Stealth": 10,
      "Streetwise": 8
    },
    "isNetrunner": false,
    "hasNeuroport": true
  },
  {
    "id": "cemk-ncpd-officer",
    "name": "NCPD Officer",
    "subtitle": "Policia sin nombre - The Jacket p.35",
    "faction": "NCPD",
    "threatTier": "mook",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Jacket",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 35,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "headSpVsMelee": 6,
    "bodySpVsMelee": 6,
    "stats": {
      "INT": 3,
      "REF": 4,
      "DEX": 5,
      "TECH": 4,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Militech M-10AF Lexington",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Militech M-10AF Lexington",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 21,
        "notes": "Tira DV por rango (m/yd) del Lexington: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 30, 201+: no.",
        "weaponType2077": "Power",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport"
    ],
    "gear": [],
    "specialRules": [
      "Rol: ninguno (None)."
    ],
    "loreSummary": "Agente generico del NCPD; aparece como guardia en escenas de la aventura.",
    "rep": 1,
    "skillBases": {
      "Athletics": 10,
      "Brawling": 8,
      "Evasion": 10,
      "Human Perception": 8,
      "Perception": 12
    },
    "isNetrunner": false,
    "hasNeuroport": true
  },
  {
    "id": "cemk-reo-meatwagon-gonk",
    "name": "REO Meatwagon Gonk",
    "subtitle": "Empleado de REO Meatwagon - The Jacket p.35",
    "faction": "REO Meatwagon",
    "threatTier": "mook",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Jacket",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 35,
    "role": "Medtech",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 7,
    "bodySp": 7,
    "headSpVsMelee": 4,
    "bodySpVsMelee": 4,
    "stats": {
      "INT": 5,
      "REF": 4,
      "DEX": 5,
      "TECH": 7,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Constitutional Arms Unity",
        "totalBase": 12,
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
        "name": "Constitutional Arms Unity",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 12,
        "notes": "Tira DV por rango (m/yd) del Unity: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 30, 201+: no.",
        "weaponType2077": "Power",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport"
    ],
    "gear": [],
    "specialRules": [
      "Medtech 2: gana la habilidad Surgery.",
      "A 0 HP el escenario lo da por muerto (PNJ sin nombre).",
      "Role Ability: Medtech (gana Surgery) rank 2"
    ],
    "loreSummary": "Empleado corporativo de REO Meatwagon que ataca al equipo por unos eddies extra.",
    "rep": 0,
    "roleAbility": {
      "name": "Medtech (gana Surgery)",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 7,
      "Brawling": 7,
      "Evasion": 8,
      "Human Perception": 6,
      "Paramedic": 12,
      "Perception": 8
    },
    "isNetrunner": false,
    "hasNeuroport": true
  },
  {
    "id": "cemk-enemy-netrunner",
    "name": "Enemy Netrunner",
    "subtitle": "Netrunner sin nombre - The Jacket p.36",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Jacket",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 36,
    "role": "Netrunner",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "headSpVsMelee": 6,
    "bodySpVsMelee": 6,
    "stats": {
      "INT": 5,
      "REF": 4,
      "DEX": 4,
      "TECH": 6,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Constitutional Arms Unity",
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
        "name": "Constitutional Arms Unity",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 12,
        "notes": "Tira DV por rango (m/yd) del Unity: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 30, 201+: no.",
        "weaponType2077": "Power",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport w/ Cyberdeck (cyberdeck cargado en el Neuroport, puede hacer Quickhacks)"
    ],
    "gear": [],
    "specialRules": [
      "Netrunner 3: Interface 3 y 2 Net Actions por turno.",
      "Huye con 5 HP o menos (Jacket p.21).",
      "Con Interface 3 accede a Quickhacks Simple (DV6), Standard (DV8) y Difficult (DV10); no Advanced (DV12) (Rule Book p.25).",
      "Role Ability: Netrunner (Interface) rank 3"
    ],
    "loreSummary": "Netrunner enemigo del grupo de Arasaka en la mision; hackea con un cyberdeck alojado en el Neuroport.",
    "rep": 1,
    "roleAbility": {
      "name": "Netrunner (Interface)",
      "rank": 3
    },
    "skillBases": {
      "Athletics": 6,
      "Brawling": 6,
      "Evasion": 8,
      "Human Perception": 8,
      "Perception": 8,
      "Stealth": 10
    },
    "isNetrunner": true,
    "interfaceRank": 3,
    "hasNeuroport": true,
    "netActionsPerTurn": 2
  },
  {
    "id": "cemk-edgerunner-gonk",
    "name": "Edgerunner Gonk",
    "subtitle": "Mercenario sin nombre - The Jacket p.36",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Jacket",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 36,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 7,
    "bodySp": 7,
    "headSpVsMelee": 4,
    "bodySpVsMelee": 4,
    "stats": {
      "INT": 4,
      "REF": 4,
      "DEX": 6,
      "TECH": 4,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Long Blade",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Rostovic DB-2 Satara Shotgun",
        "totalBase": 11,
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
        "name": "Long Blade",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Arma cuerpo a cuerpo (en CEMK toda arma melee reduce a la mitad el SP del objetivo, Rule Book p.10)",
        "skill": "Melee Weapon"
      },
      {
        "name": "Rostovic DB-2 Satara Shotgun",
        "skillBase": 11,
        "damage": "5d6",
        "rof": 1,
        "mag": 2,
        "notes": "Tira DV por rango (m/yd) del Satara: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 35, 201+: no.",
        "weaponType2077": "Tech",
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Neuroport"
    ],
    "gear": [],
    "specialRules": [
      "Solo 2: +2 a iniciativa.",
      "Pelea hasta caer (Jacket p.21).",
      "Role Ability: Solo (+2 iniciativa) rank 2"
    ],
    "loreSummary": "Edgerunner contratado que se enfrenta al equipo junto a un agente corpo y un netrunner.",
    "rep": 1,
    "roleAbility": {
      "name": "Solo (+2 iniciativa)",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 8,
      "Evasion": 10,
      "Human Perception": 6,
      "Perception": 7,
      "Stealth": 10
    },
    "isNetrunner": false,
    "hasNeuroport": true
  },
  {
    "id": "cemk-arasaka-soldier",
    "name": "Arasaka Soldier",
    "subtitle": "Soldado Arasaka; tambien se usa como 'Corpo Agent' - The Jacket p.37",
    "faction": "Arasaka",
    "threatTier": "mook",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Jacket",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 37,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "headSpVsMelee": 6,
    "bodySpVsMelee": 6,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 5,
      "TECH": 3,
      "COOL": 5,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 6,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Arasaka HJSH-18 Masamune",
        "totalBase": 13,
        "damage": "5d6",
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
        "name": "Arasaka HJSH-18 Masamune",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 24,
        "notes": "Sirve para disparo simple y Autofire con la misma base 13. Tira DV por rango (m/yd) del Masamune (valor simple / valor autofire): 0-6: 17/22, 7-12: 16/20, 13-25: 15/17, 26-50: 13/20, 51-100: 15/25, 101-200: 20/-, 201-400: 25/-, 401-800: 30/-.",
        "weaponType2077": "Power",
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Neuroport",
      "Self-ICE x2 (2 Passwalls, DV8)"
    ],
    "gear": [],
    "specialRules": [
      "Solo 2: +2 a iniciativa.",
      "Self-ICE x2: para Quickhackearlo un netrunner debe primero Breach 2 Passwalls (DV8).",
      "Se usa tambien como 'Corpo Agent' (Jacket p.20-21: 'use the Arasaka Soldier stat block'); ese agente huye con 5 HP o menos.",
      "Role Ability: Solo (+2 iniciativa) rank 2"
    ],
    "loreSummary": "Soldado de seguridad de Arasaka; el mismo bloque sirve para el agente corpo del encuentro con edgerunners.",
    "rep": 2,
    "roleAbility": {
      "name": "Solo (+2 iniciativa)",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 10,
      "Brawling": 10,
      "Evasion": 11,
      "Human Perception": 9,
      "Perception": 10,
      "Tactics": 10
    },
    "isNetrunner": false,
    "hasNeuroport": true,
    "selfIce": 2
  },
  {
    "id": "cemk-valentino-gonk",
    "name": "Valentino Gonk",
    "subtitle": "Pandillero Valentino - The Jacket p.37",
    "faction": "Valentinos",
    "threatTier": "mook",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Jacket",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 37,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "headSpVsMelee": 6,
    "bodySpVsMelee": 6,
    "stats": {
      "INT": 4,
      "REF": 6,
      "DEX": 6,
      "TECH": 4,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Spiked Baseball Bat",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Militech M-76e Omaha",
        "totalBase": 12,
        "damage": "3d6",
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
        "name": "Spiked Baseball Bat",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Arma cuerpo a cuerpo (en CEMK toda arma melee reduce a la mitad el SP del objetivo, Rule Book p.10)",
        "skill": "Melee Weapon"
      },
      {
        "name": "Militech M-76e Omaha",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 9,
        "notes": "Tira DV por rango (m/yd) del Omaha: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 30, 201+: no.",
        "weaponType2077": "Tech",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport"
    ],
    "gear": [],
    "specialRules": [
      "Solo 2: +2 a iniciativa.",
      "Los Gonks actuan como grupo: una sola tirada de iniciativa para todos.",
      "Role Ability: Solo (+2 iniciativa) rank 2"
    ],
    "loreSummary": "Pandillero de los Valentinos; acompana a Maria Torres en el combate final.",
    "rep": 1,
    "roleAbility": {
      "name": "Solo (+2 iniciativa)",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 10,
      "Evasion": 12,
      "Human Perception": 8,
      "Perception": 8
    },
    "isNetrunner": false,
    "hasNeuroport": true
  },
  {
    "id": "cemk-adam-smasher",
    "name": "Adam Smasher",
    "subtitle": "Borg de Arasaka - The Jacket pp.38-39",
    "faction": "Arasaka",
    "threatTier": "boss",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Jacket",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 38,
    "role": "Solo",
    "hp": 75,
    "seriouslyWounded": 38,
    "deathSave": 17,
    "headSp": 18,
    "bodySp": 18,
    "headSpVsMelee": 18,
    "bodySpVsMelee": 18,
    "stats": {
      "INT": 6,
      "REF": 8,
      "DEX": 8,
      "TECH": 6,
      "COOL": 5,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 17,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Adam Smasher's Fists",
        "totalBase": 18,
        "damage": "5d6",
        "rof": 2
      },
      {
        "label": "Shoulder-Mounted Rocket Launcher",
        "totalBase": 18,
        "damage": "9d6",
        "rof": 1
      },
      {
        "label": "Pop-Up Autoshotgun",
        "totalBase": 18,
        "damage": "6d6",
        "rof": 2
      },
      {
        "label": "Adam Smasher's Chain Gun",
        "totalBase": 18,
        "damage": "Autofire x5 (solo Autofire; el libro imprime 'See Type')",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 18
      },
      {
        "label": "Perception",
        "totalBase": 16
      }
    ],
    "weapons": [
      {
        "name": "Adam Smasher's Fists",
        "skillBase": 18,
        "damage": "5d6",
        "rof": 2,
        "mag": 0,
        "notes": "Tipo impreso: 'Halves SP' (reduce a la mitad el SP). Sin tira de DV propia.",
        "skill": "Brawling"
      },
      {
        "name": "Shoulder-Mounted Rocket Launcher",
        "skillBase": 18,
        "damage": "9d6",
        "rof": 1,
        "mag": 4,
        "notes": "Tira DV por rango (m/yd) del Rocket Launcher: 0-6: 17, 7-12: 16, 13-25: 15, 26-50: 15, 51-100: 20, 101-200: 20, 201-400: 25, 401-800: 30. Arma Explosive Smart.",
        "weaponType2077": "Smart",
        "skill": "Heavy Weapons"
      },
      {
        "name": "Pop-Up Autoshotgun",
        "skillBase": 18,
        "damage": "6d6",
        "rof": 2,
        "mag": 16,
        "notes": "Tira DV por rango (m/yd) del Autoshotgun: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 35, 201+: no.",
        "weaponType2077": "Power",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Adam Smasher's Chain Gun",
        "skillBase": 18,
        "damage": "Autofire x5 (solo Autofire; el libro imprime 'See Type')",
        "rof": 1,
        "mag": 80,
        "notes": "Tira DV por rango (m/yd) del Chain Gun (DV autofire): 0-6: 22, 7-12: 20, 13-25: 17, 26-50: 20, 51-100: 25, 101+: no. Toda su municion es perforante: ablata la armadura 2 en vez de 1.",
        "weaponType2077": "Power",
        "skill": "Heavy Weapons"
      }
    ],
    "cyberware": [
      "Neuroport",
      "Self-ICE x3 (3 Passwalls, DV10)",
      "Self-ICE Regenerator",
      "Communications Receiver w/ Descrambler",
      "Armor Regeneration Matrix",
      "FBC Body",
      "Berserk Implant",
      "Adam Smasher's Sandevistan (experimental)",
      "Jumpboosters"
    ],
    "gear": [],
    "specialRules": [
      "Solo 9: +9 a iniciativa, pero siempre actua primero.",
      "Self-ICE x3: Breach 3 Passwalls (DV10). Self-ICE Regenerator: al inicio de su turno expulsa a cualquier netrunner conectado y regenera los Passwalls.",
      "Communications Receiver: Accion, Check DV13 Electronics/Security Tech; si pasa, escucha comunicaciones holo/radio a 50 m.",
      "Armor Regeneration Matrix: la primera vez que sus HP bajan a 40 o menos, su armadura vuelve a SP 18.",
      "FBC Body: ignora Choke y Critical Injuries (incluido el dano adicional); no respira, come ni bebe.",
      "Berserk Implant: sin penalizadores por Seriously/Mortally Wounded; aun hace Death Saves a 0 HP.",
      "Sandevistan: siempre activo en combate; un Move o Attack extra en su turno, sin perdida de Humanity ni HP.",
      "Jumpboosters: ignora penalizadores de movimiento por saltos.",
      "Nota p.39 para RED: agregar Low Light/Infrared/UV x2, Anti-Dazzle x2, Hardened Shielding en todo el cyberware, un Level Damper y lo que el GM quiera.",
      "Role Ability: Solo (+9 iniciativa; siempre va primero) rank 9",
      "Seriously Wounded no impreso: HP/2",
      "EMP no impreso (\"-\")"
    ],
    "loreSummary": "Borg legendario de Arasaka, el enemigo definitivo; su cuerpo FBC y su equipo unico lo vuelven casi imparable.",
    "rep": 10,
    "roleAbility": {
      "name": "Solo (+9 iniciativa; siempre va primero)",
      "rank": 9
    },
    "skillBases": {
      "Athletics": 14,
      "Autofire": 18,
      "Brawling": 18,
      "Bureaucracy": 10,
      "Conceal/Reveal Object": 12,
      "Concentration": 16,
      "Conversation": 2,
      "Cybertech": 16,
      "Drive Land Vehicle": 12,
      "Education": 10,
      "Electronics/Security Tech": 10,
      "Endurance": 18,
      "Evasion": 18,
      "First Aid": 10,
      "Handgun": 18,
      "Heavy Weapons": 18,
      "Human Perception": 3,
      "Interrogation": 15,
      "Local Expert": 8,
      "Melee Weapon": 18,
      "Paramedic": 10,
      "Perception": 16,
      "Persuasion": 8,
      "Resist Torture/Drugs": 18,
      "Shoulder Arms": 18,
      "Stealth": 12,
      "Streetwise": 10,
      "Tactics": 13,
      "Wardrobe & Style": 12
    },
    "isNetrunner": false,
    "hasNeuroport": true,
    "selfIce": 3
  },
  {
    "id": "cemk-maria-torres",
    "name": "Maria Torres",
    "subtitle": "Lider de Valentinos leales a Gustavo Orta - The Jacket p.40",
    "faction": "Valentinos",
    "threatTier": "lieutenant",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Jacket",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 40,
    "role": "Solo",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "headSpVsMelee": 6,
    "bodySpVsMelee": 6,
    "stats": {
      "INT": 6,
      "REF": 8,
      "DEX": 8,
      "TECH": 6,
      "COOL": 6,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 7,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Mantis Blade x2",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Techtronika RT-46 Burya",
        "totalBase": 16,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 16
      },
      {
        "label": "Perception",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Mantis Blade x2",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 1,
        "mag": 0,
        "notes": "Arma cuerpo a cuerpo (en CEMK toda arma melee reduce a la mitad el SP del objetivo, Rule Book p.10). ROF impreso 1.",
        "skill": "Melee Weapon"
      },
      {
        "name": "Techtronika RT-46 Burya",
        "skillBase": 16,
        "damage": "4d6",
        "rof": 1,
        "mag": 4,
        "notes": "Tira DV por rango (m/yd) del Burya: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 30, 201+: no.",
        "weaponType2077": "Tech",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport",
      "EMP Threading",
      "Arasaka Mantis Blade Cyberarm x2",
      "Berserk Implant"
    ],
    "gear": [],
    "specialRules": [
      "Solo 6: +6 a iniciativa.",
      "Berserk Implant (si se activa): sin penalizadores por Seriously/Mortally Wounded, aun hace Death Saves a 0 HP.",
      "Role Ability: Solo (+6 iniciativa) rank 6"
    ],
    "loreSummary": "Lider del equipo de Valentinos fieles a Gustavo Orta en el combate final; ambos brazos son cyberarms con cuchillas mantis.",
    "rep": 5,
    "roleAbility": {
      "name": "Solo (+6 iniciativa)",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 16,
      "Brawling": 14,
      "Bribery": 10,
      "Concentration": 8,
      "Conversation": 7,
      "Drive Land Vehicle": 10,
      "Education": 8,
      "Endurance": 10,
      "Evasion": 16,
      "First Aid": 8,
      "Handgun": 16,
      "Human Perception": 9,
      "Interrogation": 12,
      "Local Expert": 10,
      "Melee Weapon": 16,
      "Perception": 12,
      "Persuasion": 10,
      "Resist Torture/Drugs": 12,
      "Stealth": 10,
      "Streetwise": 12,
      "Tactics": 10,
      "Wardrobe & Style": 8
    },
    "isNetrunner": false,
    "hasNeuroport": true
  },
  {
    "id": "cemk-nitro",
    "name": "Nitro",
    "subtitle": "Lider Maelstrom - Karaoke Night p.8",
    "faction": "Maelstrom",
    "threatTier": "lieutenant",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Karaoke",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 8,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "headSpVsMelee": 6,
    "bodySpVsMelee": 6,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 5,
      "TECH": 3,
      "COOL": 5,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 6,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Monowire",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Militech Crusher",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 1
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
        "name": "Monowire",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Arma cuerpo a cuerpo (en CEMK toda arma melee reduce a la mitad el SP del objetivo, Rule Book p.10)",
        "skill": "Melee Weapon"
      },
      {
        "name": "Militech Crusher",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 1,
        "mag": 12,
        "notes": "Tipo impreso: Power Weapon, Shell Ammo (municion de perdigones). Tira DV por rango (m/yd) del Crusher: 0-6: 13, resto: sin dato.",
        "weaponType2077": "Power",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport",
      "Maelstrom Multi-Optic Mount",
      "Salvaged Monowire Cyberarm",
      "Self-ICE x1 (1 Passwall, DV6)"
    ],
    "gear": [],
    "specialRules": [
      "Solo 4: +4 a iniciativa.",
      "Maelstrom Multi-Optic Mount: +2 a Checks de Perception basados en vista; ve en poca luz/oscuridad sin penalizador.",
      "Self-ICE: para Quickhackearla un netrunner debe Breach 1 Passwall (DV6).",
      "Role Ability: Solo (+4 iniciativa) rank 4"
    ],
    "loreSummary": "Pandillera de Maelstrom que celebra su cumpleanos con sus chooms en un bar tomado.",
    "rep": 3,
    "roleAbility": {
      "name": "Solo (+4 iniciativa)",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 13,
      "Brawling": 11,
      "Concentration": 6,
      "Conversation": 6,
      "Drive Land Vehicle": 8,
      "Education": 6,
      "Endurance": 9,
      "Evasion": 13,
      "First Aid": 6,
      "Handguns": 14,
      "Human Perception": 6,
      "Interrogation": 10,
      "Local Expert": 8,
      "Melee Weapon": 13,
      "Perception": 10,
      "Persuasion": 8,
      "Resist Torture/Drugs": 12,
      "Stealth": 8,
      "Streetwise": 10,
      "Tactics": 6
    },
    "isNetrunner": false,
    "hasNeuroport": true,
    "selfIce": 1
  },
  {
    "id": "cemk-maelstrom-gonk-stingball",
    "name": "Maelstrom Gonk/Stingball",
    "subtitle": "Pandillero Maelstrom (Stingball, el portero) - Karaoke Night p.9",
    "faction": "Maelstrom",
    "threatTier": "mook",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Karaoke",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 9,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 7,
    "bodySp": 7,
    "headSpVsMelee": 4,
    "bodySpVsMelee": 4,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 5,
      "TECH": 3,
      "COOL": 5,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 6,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Gorilla Arm",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Constitutional Arms Unity",
        "totalBase": 11,
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
        "name": "Gorilla Arm",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Arma cuerpo a cuerpo (en CEMK toda arma melee reduce a la mitad el SP del objetivo, Rule Book p.10)",
        "skill": "Melee Weapon"
      },
      {
        "name": "Constitutional Arms Unity",
        "skillBase": 11,
        "damage": "3d6",
        "rof": 2,
        "mag": 12,
        "notes": "Tira DV por rango (m/yd) del Unity: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 30, 201+: no.",
        "weaponType2077": "Power",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport",
      "Maelstrom Multi-Optic Mount",
      "Gorilla Arm"
    ],
    "gear": [],
    "specialRules": [
      "Solo 1: +1 a iniciativa.",
      "Maelstrom Multi-Optic Mount: +2 a Perception basada en vista; ve en poca luz sin penalizador.",
      "Role Ability: Solo (+1 iniciativa) rank 1"
    ],
    "loreSummary": "Pandillero generico de Maelstrom; el mismo bloque describe a Stingball, el portero novato que cuida la puerta.",
    "rep": 1,
    "roleAbility": {
      "name": "Solo (+1 iniciativa)",
      "rank": 1
    },
    "skillBases": {
      "Athletics": 10,
      "Brawling": 10,
      "Evasion": 11,
      "Human Perception": 9,
      "Perception": 10,
      "Tactics": 10
    },
    "isNetrunner": false,
    "hasNeuroport": true
  },
  {
    "id": "cemk-rocky-erikson",
    "name": "Rocky Erikson",
    "subtitle": "Netrunner, contacto de Roger Kynard - Karaoke Night p.10",
    "faction": "",
    "threatTier": "lieutenant",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Karaoke",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 10,
    "role": "Netrunner",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 0,
    "bodySp": 7,
    "bodySpVsMelee": 4,
    "stats": {
      "INT": 5,
      "REF": 4,
      "DEX": 4,
      "TECH": 6,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Constitutional Arms Unity",
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
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Constitutional Arms Unity",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 12,
        "notes": "Tira DV por rango (m/yd) del Unity: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 30, 201+: no.",
        "weaponType2077": "Power",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport w/ Cyberdeck (cyberdeck en el Neuroport, puede hacer Quickhacks)"
    ],
    "gear": [],
    "specialRules": [
      "Netrunner 3: Interface 3 y 2 Net Actions por turno.",
      "Sin armadura de cabeza (solo cuerpo, Kevlar Suit SP 7 / 4).",
      "Comportamiento: busca cobertura y luego Quickhackea; huye al quedar Seriously Wounded (Karaoke p.6).",
      "Role Ability: Netrunner (Interface) rank 3"
    ],
    "loreSummary": "Netrunner que a veces trabaja para Roger Kynard; manda a su hustle contra el equipo.",
    "rep": 2,
    "roleAbility": {
      "name": "Netrunner (Interface)",
      "rank": 3
    },
    "skillBases": {
      "Athletics": 6,
      "Brawling": 6,
      "Evasion": 8,
      "Human Perception": 10,
      "Perception": 10,
      "Stealth": 10
    },
    "isNetrunner": true,
    "interfaceRank": 3,
    "hasNeuroport": true,
    "netActionsPerTurn": 2
  },
  {
    "id": "cemk-rockys-hustle",
    "name": "Rocky's Hustle",
    "subtitle": "Matones de Rocky - Karaoke Night p.10",
    "faction": "",
    "threatTier": "mook",
    "sourceBook": "cemk_2077",
    "sourceBookTitle": "Cyberpunk Edgerunners Mission Kit — Karaoke",
    "era": "2077",
    "format": "cemk",
    "sourcePage": 10,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 0,
    "bodySp": 11,
    "bodySpVsMelee": 6,
    "stats": {
      "INT": 4,
      "REF": 4,
      "DEX": 6,
      "TECH": 4,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Long Blade",
        "totalBase": 11,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Militech M-76e Omaha",
        "totalBase": 13,
        "damage": "3d6",
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
        "name": "Long Blade",
        "skillBase": 11,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Arma cuerpo a cuerpo (en CEMK toda arma melee reduce a la mitad el SP del objetivo, Rule Book p.10)",
        "skill": "Melee Weapon"
      },
      {
        "name": "Militech M-76e Omaha",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 9,
        "notes": "Tira DV por rango (m/yd) del Omaha: 0-6: 13, 7-12: 15, 13-25: 20, 26-50: 25, 51-100: 30, 101-200: 30, 201+: no.",
        "weaponType2077": "Tech",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neuroport"
    ],
    "gear": [],
    "specialRules": [
      "Solo 2: +2 a iniciativa.",
      "Uno por cada Edgerunner presente; huyen con 5 HP o menos.",
      "Role Ability: Solo (+2 iniciativa) rank 2"
    ],
    "loreSummary": "Matones contratados por Rocky Erikson para eliminar al equipo y tomar el objetivo.",
    "rep": 1,
    "roleAbility": {
      "name": "Solo (+2 iniciativa)",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 8,
      "Evasion": 12,
      "Human Perception": 6,
      "Perception": 10,
      "Stealth": 8
    },
    "isNetrunner": false,
    "hasNeuroport": true
  }
];
