// Generado por scripts/gen_enemies.py desde data/enemies-src/. No editar a mano.
import type { EnemySheet } from '../enemiesCatalog';

export const EVERYDAY_PEOPLE_ENEMIES: EnemySheet[] = [
  {
    "id": "ep-bartender",
    "name": "Bartender",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 3,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 4,
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
        "label": "Medium Pistol (Poor Quality)",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Light Melee Weapon (Poor Quality)",
        "totalBase": 6,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 6
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Medium Pistol (Poor Quality)",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "skill": "Handgun"
      },
      {
        "name": "Light Melee Weapon (Poor Quality)",
        "skillBase": 6,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Cyberaudio w/ Level Damper"
    ],
    "gear": [
      "Agent",
      "Bartending Tools",
      "Techtool",
      "Cash: 50eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Dive Bar Bartender: número de combate 8; cambia la PQ Medium Pistol por una PQ Shotgun; Evasion 8; cambia Wardrobe & Style 10 por Interrogation 8.",
      "Variante VIP Room Bartender: cambia Leathers por Kevlar® (SP 7); Athletics 6; Local Expert 6; Personal Grooming y Wardrobe & Style 10; suma First Aid 8.",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Sirve tragos en bares y clubes, presta atención, aprende los hábitos de los habitués y junta chismes casi sin querer.",
    "abbreviated": true,
    "rep": 1,
    "skillBases": {
      "Acting": 8,
      "Athletics": 8,
      "Basic Tech": 10,
      "Business": 8,
      "Concentration": 7,
      "Conversation": 12,
      "Evasion": 6,
      "Human Perception": 12,
      "Lip Reading": 6,
      "Local Expert (GM’s Choice)": 10,
      "Perception": 10,
      "Personal Grooming": 8,
      "Persuasion": 8,
      "Resist Torture/Drugs": 10,
      "Streetwise": 10,
      "Wardrobe & Style": 8
    },
    "isNetrunner": false
  },
  {
    "id": "ep-bouncer",
    "name": "Bouncer",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 3,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 6,
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
        "label": "Brawling Attack",
        "totalBase": 10,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Stun Baton",
        "totalBase": 10,
        "damage": "2d6",
        "rof": 2
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
        "name": "Brawling Attack",
        "skillBase": 10,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Stun Baton",
        "skillBase": 10,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Cyberaudio w/ Radio Communicator"
    ],
    "gear": [
      "Poor Quality Agent",
      "Leisurewear",
      "Mirrorshades",
      "Synthcoke x1",
      "Cash: 50eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Society Party Bouncer: cambia el Stun Baton por un Stun Gun; Deduction 10; Streetwise 8; cambia el Poor Quality Agent por un Agent.",
      "Variante Hired Muscle: cambia el Stun Baton por una Very Heavy Pistol; saca el Kevlar®; saca el Cyberaudio w/ Radio Communicator; suma Skinweave (SP 7); cambia Forgery 8 por Stealth 8 y Wardrobe & Style 8 por Drive Land Vehicle 8.",
      "Role Ability: Combat Awareness rank 2",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "El portero decide quién entra a la fiesta y quién se queda afuera; si hay lío, se mete, pero su trabajo es mirar a la gente.",
    "abbreviated": true,
    "rep": 1,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 7,
      "Concentration": 7,
      "Conversation": 8,
      "Deduction": 8,
      "Evasion": 10,
      "Forgery": 8,
      "Human Perception": 10,
      "Interrogation": 8,
      "Local Expert (GM’s Choice)": 8,
      "Perception": 10,
      "Persuasion": 6,
      "Resist Torture/Drugs": 8,
      "Streetwise": 8,
      "Wardrobe & Style": 8
    },
    "isNetrunner": false
  },
  {
    "id": "ep-busker",
    "name": "Busker",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 4,
    "role": "Rockerboy",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 6,
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
        "label": "Heavy Pistol (Poor Quality)",
        "totalBase": 8,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Light Melee Weapon (Poor Quality)",
        "totalBase": 8,
        "damage": "1d6",
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
        "name": "Heavy Pistol (Poor Quality)",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "skill": "Handgun"
      },
      {
        "name": "Light Melee Weapon (Poor Quality)",
        "skillBase": 8,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "EMP Threading",
      "Techhair"
    ],
    "gear": [
      "Poor Quality Agent",
      "Julliard Guild Membership Card",
      "Musical Instrument",
      "Techtool",
      "Cash: 20eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Mime: Athletics 8; cambia Play Instrument 10 por Acting 8; cambia el Musical Instrument por un Makeup Kit.",
      "Variante Street Magician: cambia Play Instrument 10 por Conceal/Reveal Object 10; cambia el Musical Instrument por Magic Props.",
      "Variante Street Poet: cambia Play Instrument 10 por Acting 10; cambia el Musical Instrument por un Memory Chip of Poetry.",
      "Role Ability: Charismatic Impact rank 2",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Artista callejero (músico, poeta, mago, estatua viviente) que actúa en la calle esperando un mecenas, o al menos la plata de la próxima comida.",
    "abbreviated": true,
    "rep": 2,
    "roleAbility": {
      "name": "Charismatic Impact",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Business": 6,
      "Concentration": 6,
      "Composition": 10,
      "Conversation": 8,
      "Evasion": 10,
      "Human Perception": 10,
      "Local Expert (GM’s Choice)": 8,
      "Perception": 8,
      "Personal Grooming": 8,
      "Persuasion": 10,
      "Play Instrument (GM’s Choice)": 10,
      "Resist Torture/Drugs": 8,
      "Streetwise": 8,
      "Wardrobe & Style": 8
    },
    "isNetrunner": false
  },
  {
    "id": "ep-construction-worker",
    "name": "Construction Worker",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 4,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 0,
    "headSp": 7,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 3,
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
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Medium Melee Weapon (Poor Quality)",
        "totalBase": 8,
        "damage": "2d6",
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
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Medium Melee Weapon (Poor Quality)",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Neural Link w/Interface Plugs"
    ],
    "gear": [
      "Poor Quality Agent",
      "Techtool",
      "Smash x1",
      "Cash: 50eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Construction Drone Operator: suma Netrunner: Interface 2 y un Poor Quality Cyberdeck (sin programas).",
      "Variante Nomad Construction Worker: suma Nomad: Moto 2 y una Roadbike con la mejora Smuggling.",
      "Variante Specialist Construction Worker: suma Tech: Maker 2 (Field Exp 2, Fabrication Exp 2); cambia Land Vehicle Tech 8 por Electronics/Security Tech 8.",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Obrero de la construcción: Night City siempre se está construyendo, demoliendo y reconstruyendo, y ellos levantan su futuro.",
    "abbreviated": true,
    "rep": 0,
    "skillBases": {
      "Athletics": 8,
      "Basic Tech": 10,
      "Concentration": 6,
      "Conversation": 6,
      "Drive Land Vehicle": 10,
      "Evasion": 8,
      "First Aid": 6,
      "Gamble": 8,
      "Human Perception": 6,
      "Land Vehicle Tech": 8,
      "Local Expert (GM’s Choice)": 8,
      "Perception": 8,
      "Persuasion": 6,
      "Resist Torture/Drugs": 8,
      "Streetwise": 6
    },
    "isNetrunner": false
  },
  {
    "id": "ep-corporate-researcher",
    "name": "Corporate Researcher",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 5,
    "role": "Netrunner",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 3,
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
        "label": "Brawling",
        "totalBase": 6,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Medium Pistol (Poor Quality)",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
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
        "name": "Brawling",
        "skillBase": 6,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Medium Pistol (Poor Quality)",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neural Link w/Interface Plugs"
    ],
    "gear": [
      "Agent",
      "Cyberdeck (no programs)",
      "Corporate ID Badge",
      "Corporate Service Pin",
      "Cash: 50eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Netrunner con Cyberdeck sin programas.",
      "Variante Conspiracy Theorist: cambia Accounting 10 por Deduction 8 y Business 10 por Criminology 10; suma EMP Threading x3; cambia el Agent por un Excellent Quality Agent; saca el Corporate ID Badge y el Corporate Service Pin.",
      "Variante Forensic Accountant: Accounting 12; suma Deduction 8.",
      "Role Ability: Interface rank 2",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Investigador corporativo: contadores, bibliotecarios forenses y analistas que buscan los datos sin los que fracasan los proyectos de las megacorpos.",
    "abbreviated": true,
    "rep": 1,
    "roleAbility": {
      "name": "Interface",
      "rank": 2
    },
    "skillBases": {
      "Accounting": 10,
      "Athletics": 6,
      "Business": 10,
      "Bureaucracy": 10,
      "Concentration": 10,
      "Composition": 8,
      "Conversation": 6,
      "Cryptography": 8,
      "Education": 10,
      "Evasion": 6,
      "Human Perception": 6,
      "Library Search": 12,
      "Local Expert (GM’s Choice)": 8,
      "Perception": 8,
      "Persuasion": 6,
      "Resist Torture/Drugs": 6
    },
    "isNetrunner": true,
    "interfaceRank": 2
  },
  {
    "id": "ep-deal-maker",
    "name": "Deal Maker",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 5,
    "role": "Fixer",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 5,
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
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Heavy Pistol (Poor Quality)",
        "totalBase": 8,
        "damage": "3d6",
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
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Heavy Pistol (Poor Quality)",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Cyberaudio Suite w/Internal Agent",
      "Cybereye w/Chyron"
    ],
    "gear": [
      "Disposable Cellphone x2",
      "A selection of cheap goods to sell",
      "Cash: 50eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Freelance Joytoy: cambia Bribery 8 por Personal Grooming 8 y Gambling 8 por Wardrobe & Style 8; Conversation 10; saca la mercadería para vender.",
      "Variante Local Bookie: Gamble 10; Trading 8; cambia la PQ Heavy Pistol por una PQ Very Heavy Pistol; saca la mercadería para vender.",
      "Variante Snitch: saca Conceal/Reveal Object; Conversation 12; Human Perception 10; Perception 10; Streetwise 10.",
      "Role Ability: Operator rank 2",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Fixer de esquina que vende mercadería robada o rescatada, drogas o información; casi siempre está ligado a una pandilla para sobrevivir.",
    "abbreviated": true,
    "rep": 1,
    "roleAbility": {
      "name": "Operator",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Bribery": 8,
      "Conceal/Reveal Object": 8,
      "Concentration": 6,
      "Conversation": 10,
      "Evasion": 10,
      "First Aid": 6,
      "Gamble": 8,
      "Human Perception": 8,
      "Local Expert (GM’s Choice)": 8,
      "Perception": 8,
      "Persuasion": 8,
      "Resist Torture/Drugs": 8,
      "Stealth": 6,
      "Streetwise": 8,
      "Trading": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ep-glitterkid",
    "name": "Glitterkid",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 6,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 4,
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
        "label": "Brawling Attack",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Medium Melee Weapon",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 8
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Brawling Attack",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Medium Melee Weapon",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Light Tattoo x3",
      "Techhair"
    ],
    "gear": [
      "Agent",
      "Blue Glass x2",
      "Trauma Team Silver Membership",
      "Cash: 100eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Disinherited Scion: Reputation 1; saca el Blue Glass y la Trauma Team Silver Membership.",
      "Variante Inquisitor Recruit: número de combate 8; cambia el Medium Melee Weapon por un Heavy Melee Weapon; Evasion 10; saca todo el ciberware.",
      "Variante Rich College Student: Personal Grooming 8; Wardrobe & Style 8; Education 10; suma Business o Science (a elección del GM) 6.",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Hijo adolescente o veinteañero de la élite corporativa, siempre buscando la próxima fiesta y la próxima experiencia.",
    "abbreviated": true,
    "rep": 2,
    "skillBases": {
      "Athletics": 6,
      "Business": 6,
      "Concentration": 6,
      "Conversation": 8,
      "Dance": 8,
      "Education": 8,
      "Evasion": 8,
      "Human Perception": 6,
      "Local Expert (GM’s Choice)": 10,
      "Perception": 6,
      "Personal Grooming": 12,
      "Persuasion": 10,
      "Resist Torture/Drugs": 8,
      "Wardrobe & Style": 12
    },
    "isNetrunner": false
  },
  {
    "id": "ep-graffiti-artist",
    "name": "Graffiti Artist",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 6,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 0,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 4,
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
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon (Poor Quality)",
        "totalBase": 8,
        "damage": "3d6",
        "rof": 2
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
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Heavy Melee Weapon (Poor Quality)",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Cybereye w/MicroOptics",
      "Light Tattoo"
    ],
    "gear": [
      "Poor Quality Agent",
      "Carryall",
      "Flashlight",
      "Glow Paint x10",
      "Techtool",
      "Cash: 20eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Digital Graffiti Artist: suma Tech: Maker 2 (Field Exp 2, Upgrade Exp 2); cambia Paint/Draw/Sculpt 10 por Electronics/Security Tech 10; saca la Glow Paint x10; suma una Computer.",
      "Variante Urban Explorer: HP 30; MOVE 5; Athletics 10; saca Paint/Draw/Sculpt 10; suma Pick Lock 8; saca la Glow Paint x10; suma un Grapple Gun.",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Grafitero: desde el que marca territorio para una pandilla hasta artistas al nivel de los grandes pintores.",
    "abbreviated": true,
    "rep": 1,
    "skillBases": {
      "Athletics": 8,
      "Basic Tech": 8,
      "Concentration": 6,
      "Contortionist": 8,
      "Conversation": 6,
      "Education": 6,
      "Evasion": 10,
      "First Aid": 6,
      "Human Perception": 6,
      "Library Search": 8,
      "Local Expert (GM’s Choice)": 10,
      "Paint/Draw/Sculpt": 10,
      "Perception": 10,
      "Persuasion": 6,
      "Resist Torture/Drugs": 8,
      "Stealth": 10,
      "Streetwise": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ep-guerrilla-gardener",
    "name": "Guerrilla Gardener",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 7,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 0,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 3,
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
        "label": "Brawling",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Medium Pistol (Poor Quality)",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 8
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Brawling",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Medium Pistol (Poor Quality)",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Cybereye w/Anti-Dazzle x2",
      "Skinwatch"
    ],
    "gear": [
      "Poor Quality Agent",
      "Anti-Smog Breathing Mask",
      "Gardening Tools",
      "Cash: 20eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Guerrilla Chicken Tender: cambia Science (Botany) 8 por Animal Handling 8; cambia el Cybereye w/Anti-Dazzle x2 por un Cybereye w/ Dartgun; suma Sleep Ammo x3.",
      "Variante Outskirts Farmhand: cambia Library Search 8 por Drive Land Vehicle 8; cambia la PQ Medium Pistol por una PQ Shotgun; cambia las Gardening Tools por Farming Tools.",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Cultiva en la ciudad para sumar algo a la dieta de Kibble y SCOP, a veces en pequeñas granjas urbanas que venden comida.",
    "abbreviated": true,
    "rep": 1,
    "skillBases": {
      "Athletics": 6,
      "Basic Tech": 8,
      "Business": 8,
      "Concentration": 8,
      "Conversation": 8,
      "Education": 8,
      "Evasion": 8,
      "First Aid": 8,
      "Human Perception": 6,
      "Library Search": 8,
      "Local Expert (GM’s Choice)": 8,
      "Perception": 6,
      "Persuasion": 6,
      "Resist Torture/Drugs": 8,
      "Science (Botany)": 8,
      "Wilderness Survival": 6
    },
    "isNetrunner": false
  },
  {
    "id": "ep-laborer",
    "name": "Laborer",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 7,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 4,
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
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon (Poor Quality)",
        "totalBase": 8,
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
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Heavy Melee Weapon (Poor Quality)",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Nasal Filters",
      "Toxin Binders"
    ],
    "gear": [
      "Poor Quality Agent",
      "Duct Tape",
      "Techtool",
      "Smash x2",
      "Cash: 20eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Deckhand: cambia Drive Land Vehicle 8 por Pilot Sea Vehicle 8.",
      "Variante Forklift Driver: suma Netrunner: Interface 2; Basic Tech 6; Drive Land Vehicle 10; cambia Gamble 6 por Land Vehicle Tech 6; suma Neural Link w/ Interface Plugs y un Cyberdeck (sin programas).",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "El trabajo humano sigue moviendo la industria: un robot se rompe y es caro, a un obrero lo reemplazan con otro de la fila.",
    "abbreviated": true,
    "rep": 0,
    "skillBases": {
      "Athletics": 8,
      "Basic Tech": 8,
      "Concentration": 6,
      "Conversation": 6,
      "Drive Land Vehicle": 8,
      "Endurance": 8,
      "Evasion": 8,
      "First Aid": 6,
      "Gamble": 6,
      "Human Perception": 6,
      "Local Expert (GM’s Choice)": 8,
      "Perception": 8,
      "Persuasion": 6,
      "Resist Torture/Drugs": 8,
      "Streetwise": 6
    },
    "isNetrunner": false
  },
  {
    "id": "ep-line-cook",
    "name": "Line Cook",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 8,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 6,
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
        "label": "Brawling Attack",
        "totalBase": 6,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 6,
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
        "name": "Brawling Attack",
        "skillBase": 6,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 6,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Neural Link w/Chipware Socket"
    ],
    "gear": [
      "Poor Quality Agent",
      "Cooking Tools",
      "Cash: 20eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Data Pool Performer/Chef: suma Rockerboy 2; cambia Drive Land Vehicle 8 por Personal Grooming 8 y Streetwise 8 por Wardrobe & Style 8; suma una Video Camera.",
      "Variante Food Truck Owner: suma Nomad: Moto 2; Evasion 6; suma Land Vehicle Tech 6; suma un Compact Groundcar con Heavy Chassis.",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Cocinero que convierte hasta el Kibble y el SCOP en comida decente y barata para la gente de Night City.",
    "abbreviated": true,
    "rep": 1,
    "skillBases": {
      "Athletics": 8,
      "Basic Tech": 8,
      "Business": 8,
      "Concentration": 8,
      "Conversation": 8,
      "Drive Land Vehicle": 8,
      "Evasion": 8,
      "Human Perception": 8,
      "Local Expert (GM’s Choice)": 8,
      "Perception": 8,
      "Persuasion": 6,
      "Resist Torture/Drugs": 10,
      "Science (Culinary)": 10,
      "Streetwise": 8
    },
    "isNetrunner": false
  },
  {
    "id": "ep-neighborhood-tech",
    "name": "Neighborhood Tech",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 8,
    "role": "Tech",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 3,
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
        "label": "Brawling Attack",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon (Poor Quality)",
        "totalBase": 6,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 8
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Brawling Attack",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Heavy Melee Weapon (Poor Quality)",
        "skillBase": 6,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Cyberarm w/ Tool Hand",
      "Cybereye w/ MicroOptics"
    ],
    "gear": [
      "Agent",
      "Tech Bag",
      "Techtool",
      "Cash: 50eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Maker 2: Field Expertise 2 y Fabrication Expertise 2.",
      "Variante Neighborhood Mechanic: Basic Tech 8; Land Vehicle Tech 12.",
      "Variante Reclaimer Tech: HP 30; suma una PQ Heavy Pistol; cambia Land Vehicle Tech 8 por Streetwise 8 y Weaponstech 10 por Wilderness Survival 10; suma Tent & Camping Equipment.",
      "Role Ability: Maker rank 2",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "El técnico del barrio que arregla lo que se rompe; con la cadena de suministro rota, mantuvo el mundo funcionando.",
    "abbreviated": true,
    "rep": 1,
    "roleAbility": {
      "name": "Maker",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Basic Tech": 12,
      "Business": 8,
      "Concentration": 6,
      "Conversation": 6,
      "Education": 6,
      "Electronics/Security Tech": 10,
      "Evasion": 8,
      "First Aid": 6,
      "Human Perception": 6,
      "Land Vehicle Tech": 8,
      "Local Expert (GM’s Choice)": 8,
      "Perception": 6,
      "Persuasion": 6,
      "Resist Torture/Drugs": 6,
      "Weaponstech": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ep-paramedic",
    "name": "Paramedic",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 9,
    "role": "Medtech",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 5,
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
        "label": "Light Melee Weapon (Poor Quality)",
        "totalBase": 6,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Heavy Pistol (Poor Quality)",
        "totalBase": 6,
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
        "name": "Light Melee Weapon (Poor Quality)",
        "skillBase": 6,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      },
      {
        "name": "Heavy Pistol (Poor Quality)",
        "skillBase": 6,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Cyberarm w/ Tool Hand",
      "Cybereye w/ MicroOptics"
    ],
    "gear": [
      "Agent",
      "Anti-Smog Breathing Mask",
      "Medical Bag",
      "Cash: 20eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Medicine 2: Surgery 1 y Cryosystem Operation 1.",
      "Variante Assistant Pharmacist: cambia Surgery 1 y Cryo 1 por Pharm 2; saca Drive Land Vehicle 10 y Surgery 8; suma Bribery 8 y Business 8; Medical Tech 8; Paramedic 8; Conversation 10; Human Perception 10.",
      "Variante Fashionware Artist: Surgery 2 (especialidad); saca Cryo; cambia Drive Land Vehicle 10 por Personal Grooming 10 y Paramedic 12 por Wardrobe & Style 12; Surgery (skill) 10.",
      "Role Ability: Medicine rank 2",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Paramédico de ambulancia o de clínica, sin título caro; la mayoría de los Medtech de Night City trabaja así.",
    "abbreviated": true,
    "rep": 1,
    "roleAbility": {
      "name": "Medicine",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Concentration": 10,
      "Conversation": 6,
      "Cybertech": 10,
      "Drive Land Vehicle": 10,
      "Education": 8,
      "Evasion": 8,
      "First Aid": 12,
      "Human Perception": 6,
      "Local Expert (GM’s Choice)": 8,
      "Medical Tech": 7,
      "Paramedic": 12,
      "Perception": 8,
      "Persuasion": 6,
      "Resist Torture/Drugs": 10,
      "Surgery": 8
    },
    "isNetrunner": false
  },
  {
    "id": "ep-scavver",
    "name": "Scavver",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 9,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 4,
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
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon (Poor Quality)",
        "totalBase": 8,
        "damage": "3d6",
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
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Heavy Melee Weapon (Poor Quality)",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [],
    "gear": [
      "Disposable Cellphone",
      "Tech Tool",
      "Random Junk",
      "Cash: 10eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Scavver Muscle: número de combate 10; cambia la PQ Heavy Melee por un PQ Assault Rifle; cambia todo el Leathers por Kevlar® (SP 7).",
      "Variante Solitary Scavver: Basic Tech 8; Stealth 12.",
      "Variante Tunnel Rat: suma Contortionist 10; saca Cybertech 6; suma una Flashlight.",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Revuelve la basura (y la Hot Zone) buscando algo que vender; un oficio de vida corta.",
    "abbreviated": true,
    "rep": 0,
    "skillBases": {
      "Athletics": 10,
      "Basic Tech": 10,
      "Concentration": 6,
      "Conversation": 6,
      "Cybertech": 6,
      "Evasion": 10,
      "First Aid": 6,
      "Human Perception": 6,
      "Local Expert (GM’s Choice)": 10,
      "Perception": 8,
      "Persuasion": 6,
      "Resist Torture/Drugs": 6,
      "Stealth": 10,
      "Streetwise": 6,
      "Wilderness Survival": 8
    },
    "isNetrunner": false
  },
  {
    "id": "ep-screamsheet-writer",
    "name": "Screamsheet Writer",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 10,
    "role": "Media",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 5,
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
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Medium Pistol (Poor Quality)",
        "totalBase": 8,
        "damage": "2d6",
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
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Medium Pistol (Poor Quality)",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Cyberaudio w/ Audio Recorder"
    ],
    "gear": [
      "Agent",
      "Binoculars",
      "Computer",
      "Memory Chips x5",
      "Radio Scanner/Music Player",
      "Cash: 20eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Data Pool Livecaster: Composition 8; Photography/Film 10; Conversation 8; Persuasion 10; cambia Bribery 6 por Acting 6; cambia el Cyberaudio w/ Audio Recorder por un Cyberarm w/ Shoulder Cam.",
      "Variante Nomad Presents Radio Reporter: cambia Photography/Film 8 por Drive Land Vehicle 8; suma un Compact Ground Car.",
      "Role Ability: Credibility rank 2",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Redactor freelance de screamsheets que corre para cumplir su cuota de notas por día en la era del Data Pool.",
    "abbreviated": true,
    "rep": 1,
    "roleAbility": {
      "name": "Credibility",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Bribery": 6,
      "Bureaucracy": 6,
      "Composition": 10,
      "Concentration": 8,
      "Conversation": 10,
      "Education": 8,
      "Evasion": 8,
      "Human Perception": 10,
      "Local Expert (GM’s Choice)": 10,
      "Perception": 10,
      "Persuasion": 8,
      "Photography/Film": 8,
      "Resist Torture/Drugs": 8,
      "Streetwise": 8
    },
    "isNetrunner": false
  },
  {
    "id": "ep-security-guard",
    "name": "Security Guard",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 10,
    "role": "Lawman",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 0,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 4,
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
        "label": "Heavy Pistol (Poor Quality)",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon (Poor Quality)",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
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
        "name": "Heavy Pistol (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "skill": "Handgun"
      },
      {
        "name": "Heavy Melee Weapon (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Grafted Muscle and Bone Lace"
    ],
    "gear": [
      "Poor Quality Agent",
      "Badge",
      "Flashlight",
      "Handcuffs",
      "Radio Communicator",
      "Cash: 20eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Camera Watcher: HP 30; cambia Lawman: Backup 2 por Netrunner: Interface 2; cambia Drive Land Vehicle 6 por Electronics/Security Tech 6; cambia Grafted Muscle and Bone Lace por Neural Link w/ Interface Plugs.",
      "Variante Moonlighting Beat Cop: Reputation 1; INIT 6; MOVE 5; suma Criminology 6; cambia la PQ Heavy Pistol por una Heavy Pistol y la PQ Heavy Melee por una Heavy Melee.",
      "Role Ability: Backup rank 2",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "El guardia de seguridad clásico, poco entrenado y con mucha actitud; hasta una bodega necesita protección.",
    "abbreviated": true,
    "rep": 0,
    "roleAbility": {
      "name": "Backup",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 8,
      "Concentration": 6,
      "Conversation": 6,
      "Drive Land Vehicle": 6,
      "Evasion": 10,
      "First Aid": 6,
      "Human Perception": 8,
      "Interrogation": 6,
      "Local Expert (GM’s Choice)": 6,
      "Perception": 10,
      "Persuasion": 6,
      "Resist Torture/Drugs": 8,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "ep-store-clerk",
    "name": "Store Clerk",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 11,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 4,
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
        "label": "Brawling",
        "totalBase": 6,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Light Melee Weapon (Poor Quality)",
        "totalBase": 6,
        "damage": "1d6",
        "rof": 2
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
        "name": "Brawling",
        "skillBase": 6,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Light Melee Weapon (Poor Quality)",
        "skillBase": 6,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "EMP Threading"
    ],
    "gear": [
      "Poor Quality Agent",
      "Anti-Smog Breathing Mask",
      "Back Room Key",
      "Vape Pen",
      "Cash: 20eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Garage Attendant: cambia Forgery 6 por Drive Land Vehicle 6.",
      "Variante Small Bodega Clerk: número de combate 8; cambia la PQ Light Melee por una PQ Shotgun.",
      "Variante Specialty Store Clerk: cambia Forgery 6 por Education 6; cambia Wardrobe & Style 6 por Business, Science o una skill de Técnica a elección del GM.",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "El empleado aburrido de una bodega o de un Oasis de Continental Brands, un clásico de las compras en Night City.",
    "abbreviated": true,
    "rep": 0,
    "skillBases": {
      "Accounting": 6,
      "Athletics": 6,
      "Concentration": 6,
      "Conversation": 8,
      "Dance": 6,
      "Evasion": 6,
      "Forgery": 6,
      "Human Perception": 6,
      "Local Expert (GM’s Choice)": 6,
      "Perception": 6,
      "Persuasion": 6,
      "Personal Grooming": 6,
      "Resist Torture/Drugs": 6,
      "Wardrobe & Style": 6
    },
    "isNetrunner": false
  },
  {
    "id": "ep-streetrat",
    "name": "Streetrat",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 11,
    "role": "",
    "hp": 20,
    "seriouslyWounded": 10,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 0,
      "REF": 6,
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
        "label": "Brawling Attack",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Medium Melee Weapon (Poor Quality)",
        "totalBase": 6,
        "damage": "2d6",
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
        "name": "Brawling Attack",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Medium Melee Weapon (Poor Quality)",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [],
    "gear": [
      "Disposable Cellphone",
      "Blue Glass x1",
      "Lock Picking Set",
      "Techtool",
      "Cash: 0eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Failed Edgerunner: número de combate 8; suma un Cybereye y un Cyberlimb de grado médico.",
      "Variante Opportunistic Burglar: cambia First Aid 6 por Electronics/Security Tech 6; saca Wilderness Survival 6; Pick Lock 10.",
      "Variante Wannabe Fixer: suma Fixer: Operator 1; cambia la PQ Medium Melee por una PQ Medium Pistol; cambia Wilderness Survival 6 por Trading 6.",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Vive en la calle con changas y durmiendo donde puede; no es scavver ni edgerunner, solo intenta sobrevivir.",
    "abbreviated": true,
    "rep": 0,
    "skillBases": {
      "Athletics": 8,
      "Basic Tech": 6,
      "Concentration": 6,
      "Conversation": 6,
      "Evasion": 8,
      "First Aid": 8,
      "Human Perception": 8,
      "Local Expert (GM’s Choice)": 10,
      "Perception": 8,
      "Persuasion": 6,
      "Pick Lock": 8,
      "Pick Pocket": 8,
      "Resist Torture/Drugs": 6,
      "Stealth": 8,
      "Streetwise": 8,
      "Wilderness Survival": 6
    },
    "isNetrunner": false
  },
  {
    "id": "ep-taxi-driver",
    "name": "Taxi Driver",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 12,
    "role": "Nomad",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 0,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 6,
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
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Very Heavy Pistol (Poor Quality)",
        "totalBase": 8,
        "damage": "5d6",
        "rof": 1
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
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Very Heavy Pistol (Poor Quality)",
        "skillBase": 8,
        "damage": "5d6",
        "rof": 1,
        "mag": 8,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Neural Link w/Chipware Socket & Interface Plugs"
    ],
    "gear": [
      "Compact Ground Car w/Communications Center",
      "Cash: 20eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Combat Cabb Driver: usá el Racer del Single Shot Pack DLC; cambia Wilderness Survival por Local Expert (a elección del GM) 13; cambia Seating Upgrade y Housing Capacity por Armored Chassis y NOS.",
      "Variante Pedicab Driver: Athletics 12; saca Bribery 6; Drive Land Vehicle 10; cambia el Compact Ground Car con Communications Center por una Bicycle con Electric Pedal Assist, Enclosure, Extended Seat y Trailer (ver Spinning Your Wheels DLC).",
      "Role Ability: Moto rank 2",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "Taxista de alguna de las muchas compañías de Night City (Aerocab, Red Cab, Tyger Cab, Combat Cabb), listo para hablarte sin parar.",
    "abbreviated": true,
    "rep": 1,
    "roleAbility": {
      "name": "Moto",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Bribery": 6,
      "Concentration": 8,
      "Conversation": 8,
      "Drive Land Vehicle": 12,
      "Evasion": 8,
      "Human Perception": 8,
      "Land Vehicle Tech": 8,
      "Local Expert 1 (GM’s Choice)": 12,
      "Local Expert 2 (GM’s Choice)": 10,
      "Perception": 10,
      "Persuasion": 6,
      "Resist Torture/Drugs": 8,
      "Streetwise": 10
    },
    "isNetrunner": false
  },
  {
    "id": "ep-wage-slave",
    "name": "Wage Slave",
    "subtitle": "Civil de Night City",
    "faction": "Civiles (Everyday People)",
    "threatTier": "mook",
    "sourceBook": "dlc",
    "sourceBookTitle": "Everyday People",
    "era": "2045",
    "format": "red",
    "sourcePage": 12,
    "role": "Exec",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 0,
    "headSp": 0,
    "bodySp": 7,
    "stats": {
      "INT": 0,
      "REF": 4,
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
        "label": "Brawling",
        "totalBase": 6,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Medium Pistol (Poor Quality)",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
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
        "name": "Brawling",
        "skillBase": 6,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Medium Pistol (Poor Quality)",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "EMP Threading",
      "Cybereye w/Virtuality x2"
    ],
    "gear": [
      "Agent",
      "Boost x2",
      "Corporate ID Badge",
      "Corporate Service Pin",
      "Cash: 50eb"
    ],
    "specialRules": [
      "Ficha abreviada del libro: solo da HP, número de combate, INIT y MOVE. Los demás STATs y el Death Save no están impresos.",
      "En combate se maneja como un Mook (p.2).",
      "Variante Tiny Business Owner: suma Fixer: Operator 2; cambia Library Search 8 por Trading 8; saca el Corporate ID Badge y el Corporate Service Pin.",
      "Variante Weekend Warrior: número de combate 8; INIT 6; cambia la PQ Medium Pistol por un PQ Assault Rifle; suma Kevlar® (SP 7) en la cabeza; Bureaucracy 6; Evasion 10.",
      "Role Ability: Teamwork rank 2",
      "Seriously Wounded no impreso: HP/2"
    ],
    "loreSummary": "El empleado del último escalón de la megacorpo, que hace el trabajo de oficina que los jefes no quieren hacer.",
    "abbreviated": true,
    "rep": 0,
    "roleAbility": {
      "name": "Teamwork",
      "rank": 2
    },
    "skillBases": {
      "Accounting": 8,
      "Athletics": 6,
      "Business": 8,
      "Bureaucracy": 10,
      "Composition": 6,
      "Concentration": 10,
      "Conversation": 8,
      "Evasion": 6,
      "Human Perception": 8,
      "Library Search": 8,
      "Local Expert (GM’s Choice)": 6,
      "Perception": 8,
      "Personal Grooming": 6,
      "Persuasion": 8,
      "Resist Torture/Drugs": 6,
      "Wardrobe & Style": 6
    },
    "isNetrunner": false
  }
];
