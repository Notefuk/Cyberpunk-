// Generado por scripts/gen_enemies.py desde data/enemies-src/. No editar a mano.
import type { EnemySheet } from '../enemiesCatalog';

export const DANGER_GAL_ENEMIES: EnemySheet[] = [
  {
    "id": "dg-6th-arbiter",
    "name": "Arbiter",
    "subtitle": "Squad Leader",
    "faction": "6th Street",
    "threatTier": "mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 10,
    "role": "Lawman",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 5,
    "headSp": 7,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 8,
      "DEX": 5,
      "TECH": 4,
      "COOL": 8,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "EQ Sniper Rifle w/ Sniping Scope (Excellent Quality)",
        "totalBase": 16,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Heavy Pistol",
        "totalBase": 8,
        "damage": "3d6",
        "rof": 2
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
        "name": "EQ Sniper Rifle w/ Sniping Scope (Excellent Quality)",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "skill": "Shoulder Arms"
      },
      {
        "name": "Heavy Pistol",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cybereye x2 w/ Anti-Dazzle x2 & Image Enhance x2",
      "Cyberarm w/ Grapple Hand",
      "Techhair",
      "Skinwatch"
    ],
    "gear": [
      "Armor-Piercing Rifle Ammo x10",
      "Basic H Pistol Ammo x16",
      "Agent",
      "Flashlight",
      "Handcuffs x2",
      "Homing Tracer",
      "Radio Communicator",
      "Road Flares x3"
    ],
    "specialRules": [
      "Habilidad de rol Lawman: Backup 4.",
      "Role Ability: Backup rank 4"
    ],
    "loreSummary": "Hijo de X y líder del Davis Squad de 6th Street; algunos hablan de nepotismo, pero es un francotirador de primer nivel criado entre veteranos. Bromea sin parar para mantener la conciencia situacional del equipo y vive afinando su rifle, Lucille.",
    "rep": 5,
    "roleAbility": {
      "name": "Backup",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 12,
      "Brawling": 7,
      "Concentration": 11,
      "Conversation": 7,
      "Criminology": 12,
      "Deduction": 12,
      "Education": 11,
      "Evasion": 14,
      "First Aid": 6,
      "Human Perception": 12,
      "Language (English)": 13,
      "Language (Japanese)": 10,
      "Language (Spanish)": 10,
      "Language (Streetslang)": 11,
      "Lip Reading": 11,
      "Local Expert (North Heywood)": 13,
      "Personal Grooming": 13,
      "Perception": 13,
      "Persuasion": 15,
      "Shoulder Arms": 16,
      "Stealth": 10,
      "Tactics": 12,
      "Tracking": 12,
      "Wardrobe & Style": 13
    },
    "isNetrunner": false
  },
  {
    "id": "dg-6th-coldfire",
    "name": "Coldfire",
    "subtitle": "Action Heroine",
    "faction": "6th Street",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 11,
    "role": "Solo",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 13,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 6,
      "TECH": 3,
      "COOL": 3,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 7,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Arasaka WAA Bullpup Assault Weapon",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Heavy Melee Weapon",
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
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Arasaka WAA Bullpup Assault Weapon",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "notes": "El libro también lista Autofire 14 (12) en skills; el arma se asignó a Shoulder Arms.",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberleg x2 w/ Jump Booster x2",
      "Neural Link w/ Interface Plugs & Sandevistan"
    ],
    "gear": [
      "Basic Rifle Ammo x50",
      "Flashbang Grenade",
      "Incendiary Grenade",
      "Smoke Grenade",
      "Teargas Grenade",
      "Disposable Cell Phone",
      "Flashlight",
      "Handcuffs",
      "Road Flare x3"
    ],
    "specialRules": [
      "Habilidad de rol Solo: Combat Awareness 4.",
      "Los valores entre paréntesis de STATs y skills son los modificados por la armadura (H Armorjack en el cuerpo).",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Hija de un mando medio de Arasaka que se quedó en Night City tras la 4ª Guerra Corporativa; reapareció como Coldfire y nadie sabe si sigue ligada a Arasaka. En combate es la lanza de 6th Street: carga al frente disparando.",
    "rep": 3,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 12,
      "Autofire": 14,
      "Brawling": 8,
      "Bureaucracy": 9,
      "Concentration": 8,
      "Conversation": 6,
      "Education": 10,
      "Evasion": 12,
      "First Aid": 5,
      "Human Perception": 8,
      "Language (English)": 8,
      "Language (Japanese)": 10,
      "Language (Streetslang)": 7,
      "Local Expert (North Heywood)": 10,
      "Melee Weapon": 12,
      "Perception": 10,
      "Persuasion": 5,
      "Resist Torture/Drugs": 12,
      "Shoulder Arms": 14,
      "Stealth": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-6th-breacher",
    "name": "Breacher",
    "subtitle": "Ground Leader",
    "faction": "6th Street",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 12,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 4,
      "DEX": 8,
      "TECH": 4,
      "COOL": 5,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 7,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 14
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
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
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Neural Link w/ Kerenzikov"
    ],
    "gear": [
      "Basic H Pistol Ammo x16",
      "Carryall",
      "Flashlight",
      "Handcuffs",
      "Radio Communicator",
      "Road Flare",
      "Rope (60 m/yds)"
    ],
    "specialRules": [
      "Habilidad de rol Solo: Combat Awareness 4.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Ex boxeador profesional de Ciudad de México convertido en soldado en la 4ª Guerra Corporativa; segundo al mando del Davis Squad. Es un operativo encubierto con gran experiencia en combate cercano y suele infiltrarse solo para plantar explosivos o hacer reconocimiento.",
    "rep": 3,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 14,
      "Brawling": 14,
      "Concentration": 6,
      "Conversation": 6,
      "Education": 6,
      "Endurance": 7,
      "Evasion": 14,
      "First Aid": 6,
      "Handgun": 10,
      "Human Perception": 8,
      "Interrogation": 9,
      "Language (English)": 6,
      "Language (Spanish)": 10,
      "Language (Streetslang)": 6,
      "Local Expert (North Heywood)": 6,
      "Martial Arts (Judo)": 12,
      "Melee Weapon": 12,
      "Perception": 8,
      "Personal Grooming": 8,
      "Persuasion": 10,
      "Resist Torture/Drugs": 8,
      "Stealth": 10,
      "Streetwise": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-6th-knock-knock",
    "name": "Knock!Knock!",
    "subtitle": "Veteran in His Sunset Years",
    "faction": "6th Street",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 13,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 9,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 6,
      "REF": 5,
      "DEX": 4,
      "TECH": 3,
      "COOL": 4,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 9,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "PQ Shotgun (Poor Quality)",
        "totalBase": 10,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Heavy Melee Weapon",
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
        "name": "PQ Shotgun (Poor Quality)",
        "skillBase": 10,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "skill": "Shoulder Arms"
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
      "Grafted Muscle and Bone Lace"
    ],
    "gear": [
      "Junk Shotgun Slug Ammo x8",
      "Basic Shotgun Shell Ammo x8",
      "Anti-Smog Breathing Mask",
      "Disposable Cell Phone",
      "Flashlight",
      "Handcuffs",
      "Radio Communicator",
      "Road Flare x3"
    ],
    "specialRules": [
      "Habilidad de rol Solo: Combat Awareness 2.",
      "Role Ability: Combat Awareness rank 2"
    ],
    "loreSummary": "El miembro más veterano del Davis Squad: peleó las cuatro Guerras Corporativas y sigue saliendo casi ileso. Pone las vidas civiles por encima de las de su equipo y toma la banda como un trabajo, no una vocación.",
    "rep": 2,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 10,
      "Brawling": 6,
      "Concentration": 5,
      "Conversation": 5,
      "Education": 8,
      "Evasion": 10,
      "First Aid": 8,
      "Human Perception": 5,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (North Heywood)": 8,
      "Melee Weapon": 10,
      "Perception": 10,
      "Persuasion": 6,
      "Shoulder Arms": 10,
      "Stealth": 6,
      "Streetwise": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-6th-roof-diver",
    "name": "Roof Diver",
    "subtitle": "Squad Member",
    "faction": "6th Street",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 14,
    "role": "Lawman",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 4,
      "REF": 4,
      "DEX": 4,
      "TECH": 3,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 4,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "PQ Assault Rifle (Poor Quality)",
        "totalBase": 12,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Popup Microwaver",
        "totalBase": 4,
        "damage": "—",
        "rof": 1
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
        "name": "PQ Assault Rifle (Poor Quality)",
        "skillBase": 12,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "skill": "Shoulder Arms"
      },
      {
        "name": "Popup Microwaver",
        "skillBase": 4,
        "damage": "—",
        "rof": 1,
        "mag": 0,
        "notes": "Daño impreso como —; arma integrada en la Cyberarm.",
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberarm w/ Popup Microwaver"
    ],
    "gear": [
      "Junk Rifle Ammo x50",
      "Disposable Cell Phone",
      "Flashlight",
      "Handcuffs",
      "Radio Communicator",
      "Road Flare x3"
    ],
    "specialRules": [
      "Habilidad de rol Lawman: Backup 2.",
      "El Popup Microwaver (ROF 1, sin daño impreso) está montado en la Cyberarm.",
      "Role Ability: Backup rank 2"
    ],
    "loreSummary": "Veterano de la 4ª Guerra oriundo de BosWash que llegó a Night City sin apoyo y se unió a 6th Street. Perdió el brazo salvando a un compañero que cayó de un edificio de 40 pisos y se lo reemplazaron por uno cibernético.",
    "rep": 1,
    "roleAbility": {
      "name": "Backup",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 8,
      "Concentration": 6,
      "Conversation": 9,
      "Education": 6,
      "Evasion": 10,
      "First Aid": 10,
      "Handgun": 10,
      "Human Perception": 6,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (North Heywood)": 6,
      "Perception": 8,
      "Persuasion": 5,
      "Shoulder Arms": 12,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-big-top",
    "name": "Big Top",
    "subtitle": "Scalpel-Wielding Ringleader",
    "faction": "Bozos",
    "threatTier": "hardened_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 16,
    "role": "Medtech",
    "hp": 50,
    "seriouslyWounded": 25,
    "deathSave": 8,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 6,
      "REF": 8,
      "DEX": 6,
      "TECH": 7,
      "COOL": 8,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 8,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "TUp Militech Tactical Umbrella w/ Smart Link",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Popup IMI Chainknife x4",
        "totalBase": 16,
        "damage": "2d6 (4d6)",
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
        "name": "TUp Militech Tactical Umbrella w/ Smart Link",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Smart Link.",
        "skill": "Handgun"
      },
      {
        "name": "Popup IMI Chainknife x4",
        "skillBase": 16,
        "damage": "2d6 (4d6)",
        "rof": 1,
        "mag": 0,
        "notes": "El libro imprime 2d6 (4d6).",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Exotic Bodysculpting",
      "TUp (+2 limbs) Artificial Shoulder Mount",
      "Chemskin",
      "Cyberarm x2 w/ Hardened Shielding x2 & Popup IMI Chainknife x2",
      "Cyberarm w/ Hardened Shielding, Popup IMI Chainknife & Medscanner",
      "Cyberarm w/ Hardened Shielding, Popup IMI Chainknife & Raven Microcybernetics MicroWaldo",
      "Cyberaudio Suite w/ Amplified Hearing, Homing Tracer & Voice Stress Analyzer",
      "Cybereye w/ Anti-Dazzle & MicroOptics",
      "Cybereye w/ Anti-Dazzle & Targeting Scope",
      "Enhanced Antibodies",
      "Nasal Filters",
      "Neural Link w/ Braindance Recorder, Chipware Socket, Interface Plugs & Pain Editor",
      "Sycust FleshWeave"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammo x6",
      "Biotoxin Grenade",
      "Flashbang Grenade",
      "Agent",
      "Duct Tape",
      "Glow Paint",
      "Handcuffs",
      "Medtech Bag",
      "Rope (60 m/yds)",
      "Techtool"
    ],
    "specialRules": [
      "Habilidad de rol Medtech: Medicine 8, con Surgery 5 y MedTech [Pharm] 3.",
      "Tiene un Artificial Shoulder Mount TUp (+2 miembros) para sus brazos cibernéticos extra.",
      "Role Ability: Medicine rank 8"
    ],
    "loreSummary": "Líder del circo rebelde de los Bozos: se cree el futuro frente al Great Bozo y provocó la guerra civil tras el incidente Hilaria 2045. Medtech sádico que opera a amigos y enemigos y cosecha partes para su beneficio.",
    "rep": 6,
    "roleAbility": {
      "name": "Medicine",
      "rank": 8
    },
    "skillBases": {
      "Athletics": 10,
      "Brawling": 12,
      "Bribery": 12,
      "Conceal/Reveal Object": 10,
      "Concentration": 12,
      "Conversation": 6,
      "Cybertech": 16,
      "Education": 10,
      "Electronics/Security Tech": 15,
      "Endurance": 12,
      "Evasion": 12,
      "Handgun": 16,
      "Human Perception": 4,
      "Interrogation": 14,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Lip Reading": 8,
      "Local Expert (Unknown)": 10,
      "Medical Tech": 10,
      "Melee Weapon": 16,
      "Personal Grooming": 10,
      "Paramedic": 14,
      "Perception": 12,
      "Persuasion": 14,
      "Resist Torture/Drugs": 13,
      "Streetwise": 12,
      "Surgery": 17,
      "Tactics": 11,
      "Trading": 12,
      "Wardrobe & Style": 12
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-blammo",
    "name": "Blammo",
    "subtitle": "OG Bozo",
    "faction": "Bozos",
    "threatTier": "boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 17,
    "role": "Solo",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 8,
    "headSp": 7,
    "bodySp": 14,
    "stats": {
      "INT": 7,
      "REF": 8,
      "DEX": 8,
      "TECH": 5,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 8,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "EQ Rocket Launcher w/ Extended Clip (Excellent Quality)",
        "totalBase": 16,
        "damage": "8d6",
        "rof": 1
      },
      {
        "label": "EQ Shotgun (Excellent Quality)",
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
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "EQ Rocket Launcher w/ Extended Clip (Excellent Quality)",
        "skillBase": 16,
        "damage": "8d6",
        "rof": 1,
        "mag": 0,
        "skill": "Heavy Weapons"
      },
      {
        "name": "EQ Shotgun (Excellent Quality)",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Exotic Bodysculpting",
      "AudioVox",
      "Cyberaudio Suite w/ Audio Recorder, Level Damper & Voice Stress Analyzer",
      "Cybereye x2 w/ Anti-Dazzle x2 & Low Light/Infrared/UV x2",
      "Neural Link w/ Chipware Socket, Pain Editor & Reflex Co-Processor",
      "Subdermal Pocket x5"
    ],
    "gear": [
      "Armor-Piercing Rocket x2",
      "Armor-Piercing Shotgun Slug Ammo x4",
      "Flashbang Grenade x2",
      "Incendiary Grenade x3",
      "Disposable Cell Phone"
    ],
    "specialRules": [
      "Habilidad de rol Solo: Combat Awareness 6.",
      "Los valores entre paréntesis de STATs y skills son los modificados por la armadura (TUp H Armorjack).",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "Leyenda viva de los Bozos, presente desde los primeros días; no quiere liderar un circo pero instiga a los jóvenes a escalar el caos. En combate usa explosivos para acorralar enemigos sin importar si hiere a sus propios payasos.",
    "rep": 5,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 15,
      "Brawling": 16,
      "Bribery": 14,
      "Conceal/Reveal Object": 14,
      "Concentration": 11,
      "Conversation": 2,
      "Dance": 10,
      "Demolitions": 10,
      "Education": 9,
      "Endurance": 10,
      "Evasion": 16,
      "First Aid": 7,
      "Heavy Weapons": 16,
      "Human Perception": 2,
      "Interrogation": 14,
      "Language (English)": 11,
      "Language (Streetslang)": 9,
      "Local Expert (Unknown)": 12,
      "Melee Weapon": 14,
      "Perception": 12,
      "Persuasion": 10,
      "Resist Torture/Drugs": 12,
      "Shoulder Arms": 16,
      "Stealth": 10,
      "Tactics": 11,
      "Trading": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-jester",
    "name": "Jester",
    "subtitle": "Bouncing Bozo Beauty",
    "faction": "Bozos",
    "threatTier": "mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 18,
    "role": "Rockerboy",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 8,
      "DEX": 7,
      "TECH": 3,
      "COOL": 6,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 6,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "EQ Heavy Pistol (Excellent Quality)",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "IMI Chainknife",
        "totalBase": 16,
        "damage": "2d6 (4d6)",
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
        "name": "EQ Heavy Pistol (Excellent Quality)",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 1,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "IMI Chainknife",
        "skillBase": 16,
        "damage": "2d6 (4d6)",
        "rof": 1,
        "mag": 0,
        "notes": "El libro imprime 2d6 (4d6).",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Chemskin",
      "Contraceptive Implant",
      "Cyberleg x2 w/ Jump Booster x2 & Talon Foot (ROF2 1d6) x2",
      "Neural Link w/ Sandevistan",
      "Light Tattoo x3"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammunition x16",
      "Smoke Grenade x2",
      "Agent",
      "Vial of Biotoxin"
    ],
    "specialRules": [
      "Habilidad de rol Rockerboy: Charismatic Impact 4.",
      "Talon Foot x2 en las Cyberlegs: ROF 2, 1d6 (patada con garras).",
      "Según el libro, teme al fuego de helio; una llama naranja-rosada puede desestabilizarla.",
      "Role Ability: Charismatic Impact rank 4"
    ],
    "loreSummary": "Jade Sky fue una gran acróbata que escupía fuego hasta que una explosión de helio mató a noventa y cuatro personas y le costó las piernas. Reapareció como Jester, con piernas instaladas por Big Top, y combate con espectáculo, saltos y patadas.",
    "rep": 4,
    "roleAbility": {
      "name": "Charismatic Impact",
      "rank": 4
    },
    "skillBases": {
      "Acting": 14,
      "Athletics": 14,
      "Brawling": 14,
      "Conceal/Reveal Object": 9,
      "Concentration": 7,
      "Contortionist": 14,
      "Conversation": 5,
      "Dance": 13,
      "Education": 6,
      "Endurance": 10,
      "Evasion": 16,
      "First Aid": 5,
      "Handgun": 16,
      "Human Perception": 7,
      "Interrogation": 10,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Little Europe)": 6,
      "Melee Weapon": 16,
      "Perception": 8,
      "Personal Grooming": 10,
      "Persuasion": 8,
      "Resist Torture/Drugs": 10,
      "Stealth": 9,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-tomfool",
    "name": "Tomfool",
    "subtitle": "Bozo Brawler",
    "faction": "Bozos",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 19,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 7,
      "TECH": 3,
      "COOL": 6,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 7,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Nomad Air Cannon",
        "totalBase": 13,
        "damage": "—",
        "rof": 1
      },
      {
        "label": "Martial Arts Attack",
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
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Nomad Air Cannon",
        "skillBase": 13,
        "damage": "—",
        "rof": 1,
        "mag": 0,
        "notes": "Daño impreso como —.",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Martial Arts Attack",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Martial Arts (Judo)"
      }
    ],
    "cyberware": [
      "Exotic Bodysculpting",
      "Contraceptive Implant",
      "Cyberarm",
      "Light Tattoo",
      "Subdermal Armor"
    ],
    "gear": [
      "Agent",
      "Duct Tape",
      "Glow Paint",
      "Vial of Poison x3"
    ],
    "specialRules": [
      "Habilidad de rol Solo: Combat Awareness 4.",
      "Abre los combates a distancia con su Nomad Air Cannon y luego usa Judo para derribar y golpear.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Tom Smart era un luchador de bloodsport clandestino conocido como el Killer Clown antes de unirse a los Bozos. Tras Hilaria 2045 pasó a ser el principal combatiente de Big Top en las peleas callejeras.",
    "rep": 3,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Acting": 10,
      "Athletics": 14,
      "Concentration": 7,
      "Conversation": 5,
      "Education": 6,
      "Endurance": 11,
      "Evasion": 14,
      "First Aid": 5,
      "Human Perception": 7,
      "Language (French)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Old Combat Zone)": 6,
      "Martial Arts (Judo)": 14,
      "Perception": 10,
      "Persuasion": 10,
      "Resist Torture/Drugs": 10,
      "Shoulder Arms": 13,
      "Stealth": 9,
      "Wardrobe & Style": 8
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-centwit",
    "name": "Centwit",
    "subtitle": "Clown Gone Bad",
    "faction": "Bozos",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 20,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 6,
      "TECH": 3,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 12,
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
        "name": "Heavy Pistol",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 12,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Exotic Bodysculpting",
      "Cybereye x2 w/ Low Light/Infrared/UV x2",
      "Neural Link w/ Kerenzikov"
    ],
    "gear": [
      "Basic H Pistol Ammo x8",
      "Armor-Piercing Grenade x2",
      "Flashbang Grenade x2",
      "Teargas Grenade x2",
      "Agent",
      "Rope (60 m/yds)"
    ],
    "specialRules": [
      "Habilidad de rol Solo: Combat Awareness 4.",
      "Los valores entre paréntesis son los modificados por la armadura (TUp M Armorjack).",
      "Lleva explosivos disfrazados de globos y pompones en el disfraz.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Terry Claymora, payaso de tercera generación cuyo padre fue asesinado por los Voodoo Boys; se unió a los Bozos en 2020 y los hostiga desde las sombras. No es miembro pleno del circo de Big Top pero colabora con él.",
    "rep": 3,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Acting": 10,
      "Athletics": 13,
      "Brawling": 12,
      "Conceal/Reveal Object": 9,
      "Concentration": 9,
      "Contortionist": 10,
      "Conversation": 7,
      "Dance": 8,
      "Education": 8,
      "Endurance": 10,
      "Evasion": 12,
      "First Aid": 5,
      "Handgun": 13,
      "Human Perception": 5,
      "Language (Louisiana Creole)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Unknown)": 8,
      "Perception": 8,
      "Persuasion": 8,
      "Resist Torture/Drugs": 10,
      "Stealth": 8,
      "Trading": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-dead-ringer-blue",
    "name": "Dead Ringer",
    "subtitle": "The Blue One",
    "faction": "Bozos",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 21,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 6,
      "DEX": 6,
      "TECH": 4,
      "COOL": 6,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 6,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Scratchers",
        "totalBase": 12,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 6,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "El libro la lista con munición Incendiary VH Pistol. · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Scratchers",
        "skillBase": 12,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Cyberware Scratchers; el libro dice que los unta con veneno.",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Exotic Biosculpting",
      "Contraceptive Implant",
      "Neural Link w/ Reflex Co-Processor",
      "Scratchers"
    ],
    "gear": [
      "Incendiary VH Pistol Ammo x8",
      "Poison Grenade",
      "Carryall",
      "Disposable Cell Phone",
      "Vial of Poison"
    ],
    "specialRules": [
      "Rol impreso 'None': sin habilidad de rol.",
      "Es la gemela ruidosa y distractora: hace malabares con granadas o viales de veneno, corre por el campo e incendia cosas."
    ],
    "loreSummary": "Una de las gemelas Dead Ringer, la de pelo azul: ruidosa, bromista y amante de la atención. Funciona como distracción mientras usa granadas tóxicas y sus Scratchers envenenadas.",
    "rep": 3,
    "skillBases": {
      "Acting": 11,
      "Athletics": 13,
      "Brawling": 8,
      "Conceal/Reveal Object": 6,
      "Concentration": 6,
      "Contortionist": 11,
      "Conversation": 6,
      "Dance": 8,
      "Education": 6,
      "Endurance": 7,
      "Evasion": 13,
      "First Aid": 6,
      "Human Perception": 5,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Library Search": 12,
      "Lip Reading": 10,
      "Local Expert (South Night City)": 6,
      "Melee Weapon": 12,
      "Personal Grooming": 10,
      "Perception": 7,
      "Persuasion": 11,
      "Resist Torture/Drugs": 8,
      "Stealth": 8,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-dead-ringer-pink",
    "name": "Dead Ringer",
    "subtitle": "The Pink One",
    "faction": "Bozos",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 22,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 6,
      "DEX": 6,
      "TECH": 6,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "EQ Light Melee Weapon (Excellent Quality)",
        "totalBase": 12,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Scratchers",
        "totalBase": 12,
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
        "name": "EQ Light Melee Weapon (Excellent Quality)",
        "skillBase": 12,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      },
      {
        "name": "Scratchers",
        "skillBase": 12,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Cyberware Scratchers; el libro dice que los unta con veneno.",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Exotic Bodysculpting",
      "Contraceptive Implant",
      "Neural Link w/ Reflex Co-Processor",
      "Scratchers"
    ],
    "gear": [
      "Flashbang Grenade",
      "Smoke Grenade",
      "Carryall",
      "Disposable Cell Phone",
      "Lock Picking Set",
      "Vial of Biotoxin"
    ],
    "specialRules": [
      "Rol impreso 'None': sin habilidad de rol.",
      "Es la gemela silenciosa: nunca habla, roba bolsillos (Pick Pocket 15) y entrega las armas robadas a otros Bozos."
    ],
    "loreSummary": "La Dead Ringer de pelo rosa: callada y sigilosa, se dedica a robar pertenencias y a pasarle a otros Bozos las armas de la víctima. Como su hermana, lleva granadas y Scratchers con toxinas.",
    "rep": 3,
    "skillBases": {
      "Athletics": 12,
      "Brawling": 8,
      "Conceal/Reveal Object": 6,
      "Concentration": 6,
      "Contortionist": 10,
      "Conversation": 5,
      "Education": 6,
      "Endurance": 6,
      "Evasion": 12,
      "First Aid": 8,
      "Human Perception": 5,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Lip Reading": 6,
      "Local Expert (South Night City)": 6,
      "Melee Weapon": 12,
      "Perception": 10,
      "Personal Grooming": 9,
      "Persuasion": 6,
      "Pick Lock": 14,
      "Pick Pocket": 15,
      "Resist Torture/Drugs": 7,
      "Stealth": 12,
      "Wardrobe & Style": 9
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-finale",
    "name": "Finale",
    "subtitle": "Silent But Deadly",
    "faction": "Bozos",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 23,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 6,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 7,
      "TECH": 3,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Assault Rifle",
        "totalBase": 13,
        "damage": "5d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 15,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 2,
        "mag": 25,
        "notes": "El libro también lista Autofire 13. · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 15,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Cybereye x2 w/ Low Light/Infrared/UV x2"
    ],
    "gear": [
      "Armor-Piercing Rifle Ammo x25",
      "Smoke Grenade",
      "Agent"
    ],
    "specialRules": [
      "Rol impreso 'None': sin habilidad de rol."
    ],
    "loreSummary": "Kane Nove, un chico de la calle al que un ripperdoc le cosió la mandíbula con alambre; el circo de Big Top lo rescató del agua y lo bautizó Finale. Los Bozos se burlan de él y apuntan su rabia contra Night City.",
    "rep": 3,
    "skillBases": {
      "Athletics": 13,
      "Autofire": 13,
      "Brawling": 15,
      "Conceal/Reveal Object": 8,
      "Concentration": 7,
      "Conversation": 5,
      "Dance": 12,
      "Demolitions": 5,
      "Education": 6,
      "Endurance": 8,
      "Evasion": 13,
      "First Aid": 5,
      "Handgun": 9,
      "Human Perception": 5,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Lip Reading": 6,
      "Local Expert (Old Combat Zone)": 6,
      "Perception": 7,
      "Persuasion": 6,
      "Resist Torture/Drugs": 6,
      "Shoulder Arms": 13,
      "Stealth": 9,
      "Streetwise": 7
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-burt-the-squirt",
    "name": "Burt the Squirt",
    "subtitle": "An Acid Wit",
    "faction": "Bozos",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 24,
    "role": "",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 3,
      "REF": 6,
      "DEX": 4,
      "TECH": 5,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 7,
      "EMP": 1
    },
    "combatBases": [
      {
        "label": "Air Pistol",
        "totalBase": 12,
        "damage": "—",
        "rof": 2
      },
      {
        "label": "PQ Heavy Pistol (Poor Quality)",
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
        "totalBase": 5
      }
    ],
    "weapons": [
      {
        "name": "Air Pistol",
        "skillBase": 12,
        "damage": "—",
        "rof": 2,
        "mag": 0,
        "notes": "Daño impreso como —; dispara Acid Paintball x24.",
        "skill": "Handgun"
      },
      {
        "name": "PQ Heavy Pistol (Poor Quality)",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Exotic Bodysculpting",
      "Contraceptive Implant",
      "Cybereye x2 w/ Color Shift x2"
    ],
    "gear": [
      "Acid Paintball x24",
      "Basic H Pistol Ammo x8",
      "Agent"
    ],
    "specialRules": [
      "Rol impreso 'None': sin habilidad de rol.",
      "Su Air Pistol dispara bolas de pintura ácidas (Acid Paintball x24); el libro no imprime daño ni reglas del ácido en la ficha.",
      "Siempre ataca al objetivo con el pelo más lujoso, incluso techhair."
    ],
    "loreSummary": "Burt Batail perdió el pelo en un accidente industrial y se obsesionó con el ácido; quiere calvicie permanente para Night City. Se unió a los Bozos por el suministro ilimitado de químicos y siguió a Big Top en la guerra civil.",
    "rep": 1,
    "skillBases": {
      "Athletics": 10,
      "Basic Tech": 8,
      "Brawling": 7,
      "Concentration": 6,
      "Conversation": 3,
      "Education": 5,
      "Evasion": 12,
      "First Aid": 7,
      "Handgun": 12,
      "Human Perception": 3,
      "Interrogation": 10,
      "Language (English)": 7,
      "Language (Streetslang)": 5,
      "Local Expert (Heywood Industrial Zone)": 5,
      "Perception": 5,
      "Persuasion": 6,
      "Resist Torture/Drugs": 10,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-dunce",
    "name": "Dunce",
    "subtitle": "A Fool No More",
    "faction": "Bozos",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 25,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 5,
    "headSp": 7,
    "bodySp": 4,
    "stats": {
      "INT": 2,
      "REF": 4,
      "DEX": 5,
      "TECH": 2,
      "COOL": 4,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "PQ Heavy Pistol (Poor Quality)",
        "totalBase": 8,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon",
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
        "totalBase": 4
      }
    ],
    "weapons": [
      {
        "name": "PQ Heavy Pistol (Poor Quality)",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Bate con púas según la historia. · ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [],
    "gear": [
      "Basic H Pistol Ammo x8",
      "Disposable Cell Phone"
    ],
    "specialRules": [
      "Rol impreso 'None': sin habilidad de rol."
    ],
    "loreSummary": "Sion Bannerkin, el Fool que sobrevivió a Hilaria 2045 y fue promovido a Bozo completo; perdió sus pistolas en las alcantarillas y se salvó con un bate. Big Top lo curó y le fundió una máscara en la cara.",
    "rep": 3,
    "skillBases": {
      "Athletics": 7,
      "Brawling": 12,
      "Conceal/Reveal Object": 4,
      "Concentration": 7,
      "Conversation": 5,
      "Dance": 7,
      "Education": 4,
      "Endurance": 6,
      "Evasion": 12,
      "First Aid": 4,
      "Handgun": 8,
      "Human Perception": 5,
      "Language (English)": 6,
      "Language (Streetslang)": 4,
      "Local Expert (Sewers of Little China)": 4,
      "Melee Weapon": 12,
      "Perception": 4,
      "Persuasion": 6,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "dg-bozos-the-fool",
    "name": "The Fool",
    "subtitle": "Tears of a Clown",
    "faction": "Bozos",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 26,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 3,
      "REF": 5,
      "DEX": 3,
      "TECH": 2,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 4,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "PQ Heavy Pistol (Poor Quality)",
        "totalBase": 11,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "PQ Heavy Pistol (Poor Quality)",
        "totalBase": 11,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 8
      },
      {
        "label": "Perception",
        "totalBase": 5
      }
    ],
    "weapons": [
      {
        "name": "PQ Heavy Pistol (Poor Quality)",
        "skillBase": 11,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "PQ Heavy Pistol (Poor Quality)",
        "skillBase": 11,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Handgun"
      }
    ],
    "cyberware": [],
    "gear": [
      "Junk H Pistol Ammo x8",
      "Incendiary H Pistol Ammo x1",
      "Bike Horn",
      "Disposable Cellphone",
      "Duct Tape"
    ],
    "specialRules": [
      "Rol impreso 'None': sin habilidad de rol.",
      "La Good Luck Bag (máscara) no da protección y limita la visión; los otros Bozos lo usan como escudo humano."
    ],
    "loreSummary": "El Fool no es una persona sino una iniciación: los reclutas poco prometedores reciben la máscara Good Luck Bag y van al frente como carne de cañón. Si sobreviven hasta el siguiente recluta, pasan la máscara y reciben el biosculpt.",
    "rep": 0,
    "skillBases": {
      "Athletics": 8,
      "Brawling": 8,
      "Concentration": 6,
      "Conversation": 5,
      "Education": 5,
      "Endurance": 5,
      "Evasion": 8,
      "First Aid": 4,
      "Gamble": 5,
      "Handgun": 11,
      "Human Perception": 5,
      "Language (Probably Won't Live Long Enough to Talk)": 7,
      "Language (Streetslang)": 5,
      "Local Expert (The Place They Die In)": 5,
      "Melee Weapon": 8,
      "Perception": 5,
      "Persuasion": 5,
      "Play Instrument (Bike Horn)": 4,
      "Stealth": 5,
      "Streetwise": 7
    },
    "isNetrunner": false
  },
  {
    "id": "dg-puma-pantera",
    "name": "Pantera",
    "subtitle": "One Badass Librarian",
    "faction": "Danger Gal Puma Squad",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 28,
    "role": "Netrunner",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 8,
      "REF": 5,
      "DEX": 5,
      "TECH": 7,
      "COOL": 6,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 5,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Heavy Pistol w/ Smartgun Link (Excellent Quality)",
        "totalBase": 14,
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
        "name": "Heavy Pistol w/ Smartgun Link (Excellent Quality)",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Armor-Piercing H Pistol Ammo x16 · Con Smartgun Link",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Neural Link",
      "Interface Plugs x2",
      "Reflex Co-Processor"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammo x16",
      "Agent",
      "Disposable Cell Phone",
      "Memory Chips x5",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Trauma Team (Silver)",
      "Virtuality Goggles",
      "EQ Cyberdeck w/ Armor, DeckKRASH, Sabertooth x3, Shield & Range Upgrade (in Bodyweight Suit)"
    ],
    "specialRules": [
      "Netrunner con Interface 6; su cyberdeck es de calidad excelente (EQ) e incluye Armor, DeckKRASH, Sabertooth x3 y un Shield & Range Upgrade integrado en el Bodyweight Suit.",
      "El Bodyweight Suit cubre cabeza y cuerpo con SP 11.",
      "Role Ability: Interface rank 6"
    ],
    "loreSummary": "Mx. Shoko Asagiri, bibliotecaria investigadora de Vancouver, llamó la atención de Danger Gal al robar con discreción episodios inéditos de Elflines Online Chronicles solo para verlos. Mouse notó que se aburría en su trabajo y Danger Gal la reclutó enseguida; es miembro clave de Puma Squad.",
    "rep": 6,
    "roleAbility": {
      "name": "Interface",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 9,
      "Basic Tech": 13,
      "Brawling": 7,
      "Concentration": 10,
      "Conversation": 10,
      "Cybertech": 10,
      "Education": 14,
      "Electronics/Security Tech": 13,
      "Evasion": 15,
      "First Aid": 9,
      "Handgun": 14,
      "Human Perception": 8,
      "Language (English)": 12,
      "Language (Japanese)": 12,
      "Language (Streetslang)": 10,
      "Library Search": 14,
      "Local Expert (University District)": 10,
      "Paint/Draw/Sculpt": 12,
      "Perception": 12,
      "Personal Grooming": 10,
      "Persuasion": 10,
      "Resist Torture/Drugs": 10,
      "Science (Library)": 13,
      "Stealth": 9,
      "Tactics": 12,
      "Wardrobe & Style": 10
    },
    "isNetrunner": true,
    "interfaceRank": 6,
    "cyberdeckPrograms": [
      "EQ Cyberdeck",
      "Armor",
      "DeckKRASH",
      "Sabertooth x3",
      "Shield & Range Upgrade (in Bodyweight Suit)"
    ]
  },
  {
    "id": "dg-puma-tigress",
    "name": "Tigress",
    "subtitle": "YoGanger Made Good",
    "faction": "Danger Gal Puma Squad",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 29,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 6,
      "TECH": 5,
      "COOL": 7,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Sniper Rifle w/ Smartgun Link & Sniping Scope (Excellent Quality)",
        "totalBase": 16,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 16
      },
      {
        "label": "Perception",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Sniper Rifle w/ Smartgun Link & Sniping Scope (Excellent Quality)",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "notes": "Armor-Piercing Rifle Ammo x12 · Con Smartgun Link y Sniping Scope",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cybereye w/ Targeting Scope",
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Armor-Piercing Rifle Ammo x 12",
      "Basic H Pistol Ammo x8",
      "Backup Heavy Pistol (ROF2 • 3d6)",
      "Backup Medium Melee Weapon x2 in Heels (ROF2 • 2d6)",
      "Agent",
      "Cat Ears Headband",
      "Disposable Cell Phone x2",
      "Grapple Gun",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Trauma Team (Silver)",
      "Video Camera"
    ],
    "specialRules": [
      "Solo con Combat Awareness 4.",
      "Lleva una Heavy Pistol de respaldo (ROF 2, 3d6) y dos Medium Melee Weapon en los tacones (ROF 2, 2d6).",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Criada en las Combat Zones, organizó y lideró una YoGang para que los niños tuvieran comida, armas y refugio. Danger Gal compró su contrato tras un encargo para asesinar a un VIP protegido por una NeoCorp; hoy es el motor de los acercamientos de Puma Squad a las YoGangs.",
    "rep": 6,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 12,
      "Brawling": 8,
      "Concentration": 9,
      "Conversation": 6,
      "Dance": 10,
      "Drive Land Vehicle": 10,
      "Education": 7,
      "Endurance": 13,
      "Evasion": 16,
      "First Aid": 9,
      "Handgun": 14,
      "Human Perception": 6,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (South Night City)": 7,
      "Melee Weapon": 14,
      "Perception": 14,
      "Personal Grooming": 10,
      "Persuasion": 9,
      "Photography/Film": 12,
      "Resist Torture/Drugs": 12,
      "Shoulder Arms": 16,
      "Stealth": 8,
      "Streetwise": 12,
      "Tactics": 11,
      "Trading": 11,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-puma-doc-mittens",
    "name": "Doc Mittens",
    "subtitle": "A Beary Good Field Medic",
    "faction": "Danger Gal Puma Squad",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 30,
    "role": "Medtech",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 6,
      "TECH": 6,
      "COOL": 4,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
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
        "name": "Heavy Pistol",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Basic H Pistol Ammo x16 · Handgun 13 con armadura · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "Brawling 7 con armadura",
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberarm w/ Medscanner"
    ],
    "gear": [
      "Basic H Pistol Ammo x16",
      "Agent",
      "Airhypo",
      "Bear Ears Headband",
      "Cryopump",
      "Disposable Cell Phone",
      "Medtech Bag",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Trauma Team (Silver)"
    ],
    "specialRules": [
      "Medtech con Medicine 4; Medtech (Pharm) 2 y Medtech (Cryo) 2.",
      "Con la armadura puesta sus valores bajan: REF 5, DEX 5, MOVE 4, y las skills Athletics 7, Drive Land Vehicle 10, Evasion 11 y Handgun 13 (entre paréntesis en el libro).",
      "Role Ability: Medicine rank 4"
    ],
    "loreSummary": "Naomi Alexis creció en una familia Reclaimer cerca de Colorado Springs; sus padres vendieron a su hermana menor Minna y ella se unió a una manada Nomad como aprendiz de curandera. Aceptó trabajar para Danger Gal sobre todo para usar sus bases de datos y encontrar a Minna, y fue ascendida a Puma Squad.",
    "rep": 6,
    "roleAbility": {
      "name": "Medicine",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 8,
      "Concentration": 8,
      "Criminology": 12,
      "Deduction": 10,
      "Drive Land Vehicle": 11,
      "Education": 10,
      "Evasion": 12,
      "First Aid": 8,
      "Handgun": 14,
      "Human Perception": 7,
      "Language (Finnish)": 10,
      "Language (Spanish)": 8,
      "Language (Streetslang)": 8,
      "Library Search": 10,
      "Local Expert (Santo Domingo)": 8,
      "Medical Tech": 10,
      "Paramedic": 12,
      "Perception": 8,
      "Personal Grooming": 10,
      "Persuasion": 6,
      "Science (Forensics)": 10,
      "Stealth": 8,
      "Wardrobe & Style": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-puma-mouse",
    "name": "Mouse",
    "subtitle": "Cat Burglar and Poster Girl",
    "faction": "Danger Gal Puma Squad",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 31,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 12,
    "stats": {
      "INT": 4,
      "REF": 8,
      "DEX": 7,
      "TECH": 6,
      "COOL": 6,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy SMG w/ Drum Magazine (Excellent Quality)",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Scratchers x2",
        "totalBase": 9,
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
        "name": "Heavy SMG w/ Drum Magazine (Excellent Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 1,
        "mag": 0,
        "notes": "Basic H Pistol Ammo x60 · Con Drum Magazine. El libro lista Autofire 13 en skill bases (para disparo en modo Autofire).",
        "skill": "Handgun"
      },
      {
        "name": "Scratchers x2",
        "skillBase": 9,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Exotic Biosculpting",
      "Contraceptive Implant",
      "Cybereye x2 w/ Low Light/Infrared/UV x2",
      "Cyberleg x2 w/ Jump Boosters x2",
      "EMP Threading",
      "Grafted Muscle and Bone Lace",
      "Scratchers",
      "Shift Tacts",
      "Techhair"
    ],
    "gear": [
      "Basic H Pistol Ammo x60",
      "Agent",
      "Grapple Gun",
      "Lock Picking Set",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Techtool",
      "Trauma Team (Silver)",
      "Vial of Poison x5"
    ],
    "specialRules": [
      "Solo con Combat Awareness 4.",
      "Cyberlegs x2 con Jump Boosters x2 y Grafted Muscle and Bone Lace: movilidad y agilidad de gato; usa Scratchers (garras) en melé.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Moira Kahn, hija de dos ejecutivos ausentes, perdió las piernas y a sus padres en un accidente y salió de la capacitación corporativa para huérfanos. Años después reapareció como ladrona de azoteas con cyberware a medida; Michiko Sanderson la reclutó y su lealtad a Danger Gal parece inquebrantable.",
    "rep": 7,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 12,
      "Autofire": 13,
      "Brawling": 9,
      "Concentration": 5,
      "Contortionist": 12,
      "Conversation": 6,
      "Education": 8,
      "Electronics/Security Tech": 10,
      "Evasion": 12,
      "First Aid": 8,
      "Handgun": 10,
      "Human Perception": 10,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Little Europe)": 6,
      "Melee Weapon": 12,
      "Perception": 10,
      "Personal Grooming": 10,
      "Persuasion": 8,
      "Pick Lock": 12,
      "Resist Torture/Drugs": 8,
      "Stealth": 12,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-puma-lynx",
    "name": "Lynx",
    "subtitle": "Enjoys Shooting People",
    "faction": "Danger Gal Puma Squad",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 32,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 6,
      "TECH": 4,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Shotgun (Excellent Quality)",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Heavy Pistol",
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
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Shotgun (Excellent Quality)",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "Basic Shotgun Slug Ammo x8 / Basic Shotgun Shell Ammo x4 · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Heavy Pistol",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Basic H Pistol Ammo x8 · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Chemskin",
      "Contraceptive Implant",
      "Neural Link w/ Chipware Socket & Chemical Analyzer",
      "Techhair"
    ],
    "gear": [
      "Basic H Pistol Ammo x8",
      "Basic Shotgun Slug Ammo x8",
      "Basic Shotgun Shell Ammo x4",
      "Agent",
      "Disposable Cell Phone",
      "Flashlight",
      "Handcuffs",
      "Radio Communicator w/ Cat Ears",
      "Scrambler/Descrambler",
      "Trauma Team (Silver)"
    ],
    "specialRules": [
      "Solo con Combat Awareness 4.",
      "Neural Link con Chipware Socket y Chemical Analyzer; Chemskin.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Bella Sawyer creció bajo el régimen estricto de los Inquisitors y fue adoptada por un policía del NCPD tras el ataque a Rocklin Augmentics. Rechazada como Ejecutora de la ciudad por joven e inexperta, Danger Gal la reclutó; su hermana Jack le provee muchas de sus armas desde Faisal's Customs.",
    "rep": 6,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 10,
      "Concentration": 6,
      "Conversation": 6,
      "Criminology": 12,
      "Deduction": 12,
      "Drive Land Vehicle": 10,
      "Education": 6,
      "Evasion": 8,
      "First Aid": 6,
      "Handgun": 10,
      "Human Perception": 6,
      "Interrogation": 10,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (The Glen)": 6,
      "Perception": 6,
      "Persuasion": 6,
      "Resist Torture/Drugs": 10,
      "Shoulder Arms": 14,
      "Stealth": 8,
      "Streetwise": 10,
      "Tactics": 8,
      "Tracking": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-divas-andre-nez",
    "name": "André Nez",
    "subtitle": "Gunner Turned Drummer",
    "faction": "The Digital Divas",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 34,
    "role": "Rockerboy",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 5,
      "DEX": 6,
      "TECH": 4,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 11
      },
      {
        "label": "Perception",
        "totalBase": 11
      }
    ],
    "weapons": [
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
        "name": "Heavy Melee Weapon",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Medical Grade Cyberarm x2",
      "Kiroshi OptiShields",
      "Neural Link w/ Interface Plugs",
      "Subdermal Armor"
    ],
    "gear": [
      "Armor-Piercing Grenade x2",
      "Smoke Grenade x2",
      "Agent",
      "Drum Synthesizer",
      "Pocket Amplifier",
      "Rocklin Augmentics Mercurius Cyberchair"
    ],
    "specialRules": [
      "Doble rol: Rockerboy con Charismatic Impact 2 y Solo con Combat Awareness 2.",
      "Su Mercurius Cyberchair está modificada como kit de percusión con Interface Plugs: experimenta los tambores neurológicamente y transmite automáticamente los ritmos a Firewall (p. 35) para efectos sincronizados.",
      "Role Ability: Charismatic Impact rank 2"
    ],
    "loreSummary": "Ex soldado de Militech que se negó a matar a un niño Nomad, perdió las piernas en una obra y recibió una cyberchair de Rocklin Augmentics. Su furia primaria la canaliza como baterista de las Digital Divas.",
    "rep": 5,
    "roleAbility": {
      "name": "Charismatic Impact",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 12,
      "Brawling": 14,
      "Concentration": 7,
      "Conversation": 10,
      "Education": 6,
      "Endurance": 13,
      "Evasion": 11,
      "First Aid": 6,
      "Human Perception": 8,
      "Interrogation": 7,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Watson Development)": 6,
      "Melee Weapon": 13,
      "Perception": 11,
      "Personal Grooming": 10,
      "Persuasion": 14,
      "Play Instrument (Drums)": 12,
      "Shoulder Arms": 13,
      "Stealth": 8,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-divas-firewall",
    "name": "Firewall",
    "subtitle": "Light and Sound Rigger",
    "faction": "The Digital Divas",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 35,
    "role": "Netrunner",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 5,
      "DEX": 5,
      "TECH": 5,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 11,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 10,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 9
      },
      {
        "label": "Perception",
        "totalBase": 13
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol",
        "skillBase": 11,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Basic H Pistol Ammo x8 · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 10,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Basic H Pistol Ammo x8",
      "Agent",
      "Computer",
      "Techtool",
      "Virtuality Goggles",
      "Cyberdeck w/ Armor, DeckKRASH x3 & Nervescrub x3"
    ],
    "specialRules": [
      "Netrunner con Interface 4; cyberdeck con Armor, DeckKRASH x3 y Nervescrub x3.",
      "Encargado/a de luces, audio y efectos de las Digital Divas; recibe los ritmos de André automáticamente para efectos sincronizados.",
      "Role Ability: Interface rank 4"
    ],
    "loreSummary": "Antiguo artista asistido por IA que se deshizo de una seudo-inteligencia rebelde con un antivirus C9 tras exigirle esta regalías (la IA) , lo que lo volvió leyenda en Night City. Ahora maneja luces, audio y efectos de las Divas tras responder al aviso de Sizzle Jams.",
    "rep": 4,
    "roleAbility": {
      "name": "Interface",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 7,
      "Basic Tech": 6,
      "Brawling": 10,
      "Composition": 10,
      "Concentration": 10,
      "Conversation": 8,
      "Cryptography": 11,
      "Demolitions": 7,
      "Education": 10,
      "Electronics/Security Tech": 9,
      "Evasion": 9,
      "First Aid": 8,
      "Handgun": 11,
      "Human Perception": 11,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Japantown)": 8,
      "Perception": 13,
      "Persuasion": 6,
      "Stealth": 11
    },
    "isNetrunner": true,
    "interfaceRank": 4,
    "cyberdeckPrograms": [
      "Cyberdeck",
      "Armor",
      "DeckKRASH x3",
      "Nervescrub x3"
    ]
  },
  {
    "id": "dg-divas-jose-quispe",
    "name": "José Quispe",
    "subtitle": "Brat-Punk Songsmith",
    "faction": "The Digital Divas",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 36,
    "role": "Rockerboy",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 6,
      "TECH": 4,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Pistol w/ Smartgun Link",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 12,
        "damage": "1d6",
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
        "name": "Heavy Pistol w/ Smartgun Link",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Basic H Pistol Ammo x16 · Con Smartgun Link",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 12,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "EMP Threading",
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Basic H Pistol Ammo x16",
      "Agent",
      "Duct Tape",
      "Flashlight",
      "Keytar",
      "Segotari RUSH Revolution w/ Elflines Online",
      "Pocket Amplifier",
      "Radio Scanner/Music Player"
    ],
    "specialRules": [
      "Rockerboy con Charismatic Impact 4; sin armadura en la cabeza (—), solo Light Armorjack en el cuerpo (SP 11).",
      "Role Ability: Charismatic Impact rank 4"
    ],
    "loreSummary": "Criado en las rutas Nomad entre Bolivia y la Confederación del Pacífico, fue mandadero de una pandilla de dorphers y sobrevivió a todos ellos. Es compositor y tecladista de las Digital Divas, y en secreto está enganchado a Elflines Online.",
    "rep": 4,
    "roleAbility": {
      "name": "Charismatic Impact",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 12,
      "Composition": 12,
      "Concentration": 7,
      "Conversation": 7,
      "Drive Land Vehicle": 10,
      "Education": 10,
      "Evasion": 8,
      "First Aid": 6,
      "Handgun": 13,
      "Human Perception": 7,
      "Language (English)": 8,
      "Language (Quechua)": 8,
      "Language (Spanish)": 8,
      "Language (Streetslang)": 8,
      "Local Expert (Badlands)": 10,
      "Perception": 8,
      "Personal Grooming": 10,
      "Persuasion": 6,
      "Pick Lock": 10,
      "Pick Pocket": 10,
      "Play Instrument (Keytar)": 12,
      "Play Instrument (Sing)": 10,
      "Stealth": 8,
      "Streetwise": 8,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-divas-pat-rezin",
    "name": "Pat Rezin",
    "subtitle": "Power to the People?",
    "faction": "The Digital Divas",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 37,
    "role": "Rockerboy",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 5,
      "DEX": 6,
      "TECH": 6,
      "COOL": 6,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Martial Arts Attack",
        "totalBase": 13,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 9,
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
        "name": "Martial Arts Attack",
        "skillBase": 13,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Martial Arts (Judo)"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 9,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "AudioVox",
      "Contraceptive Implant",
      "EMP Threading",
      "Light Tattoo x3",
      "Shift Tacts",
      "Techhair"
    ],
    "gear": [
      "Agent",
      "Audio Recorder",
      "Electric Guitar",
      "Pocket Amplifier",
      "Techtool"
    ],
    "specialRules": [
      "Rockerboy con Charismatic Impact 4; usa judo contra fans que se le acercan sin permiso.",
      "Sin armadura en la cabeza; Light Armorjack en el cuerpo (SP 11).",
      "Role Ability: Charismatic Impact rank 4"
    ],
    "loreSummary": "Hija de dos ingenieros de Zhirafa, creció con componentes electrónicos y se volvió Rockerboy con AudioVox. Es la voz de las Digital Divas y cultiva una imagen de rebelde que da poder al pueblo.",
    "rep": 5,
    "roleAbility": {
      "name": "Charismatic Impact",
      "rank": 4
    },
    "skillBases": {
      "Acting": 11,
      "Athletics": 8,
      "Brawling": 9,
      "Composition": 10,
      "Concentration": 11,
      "Conversation": 9,
      "Education": 10,
      "Electronics/Security Tech": 8,
      "Evasion": 11,
      "First Aid": 8,
      "Human Perception": 9,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Little Europe)": 7,
      "Martial Arts (Judo)": 13,
      "Perception": 10,
      "Personal Grooming": 12,
      "Persuasion": 12,
      "Play Instrument (Sing)": 13,
      "Play Instrument (Guitar)": 13,
      "Stealth": 8,
      "Wardrobe & Style": 12
    },
    "isNetrunner": false
  },
  {
    "id": "dg-divas-sizzle-jams",
    "name": "Sizzle Jams",
    "subtitle": "Independent Entertainment Agent",
    "faction": "The Digital Divas",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 38,
    "role": "Exec",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 0,
    "bodySp": 7,
    "stats": {
      "INT": 7,
      "REF": 4,
      "DEX": 4,
      "TECH": 2,
      "COOL": 6,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 4,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Brawling Attack",
        "totalBase": 10,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 6
      },
      {
        "label": "Perception",
        "totalBase": 9
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
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberarm w/ Psiberstuff Watch-Man"
    ],
    "gear": [
      "Audio Recorder",
      "Handcuffs",
      "Flashlight",
      "Personal CarePak"
    ],
    "specialRules": [
      "Exec con Teamwork 2. No porta armas de fuego; su reputación de tratar con dureza a los difíciles es conocida.",
      "Role Ability: Teamwork rank 2"
    ],
    "loreSummary": "Agente de entretenimiento independiente con una fama de temperamento frío e implacable, quizá exagerada, que viene de su época de mensajera. Rumores apuntan a que un ejecutivo de DMS, Albert Rudd, la prepara en secreto.",
    "rep": 3,
    "roleAbility": {
      "name": "Teamwork",
      "rank": 2
    },
    "skillBases": {
      "Accounting": 12,
      "Acting": 10,
      "Athletics": 6,
      "Brawling": 10,
      "Bribery": 11,
      "Bureaucracy": 11,
      "Business": 11,
      "Concentration": 7,
      "Conversation": 4,
      "Drive Land Vehicle": 10,
      "Education": 9,
      "Evasion": 6,
      "First Aid": 4,
      "Human Perception": 4,
      "Interrogation": 8,
      "Language (English)": 11,
      "Language (Streetslang)": 9,
      "Local Expert (New Westbrook)": 9,
      "Perception": 9,
      "Persuasion": 8,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-tetsuo",
    "name": "Tetsuo",
    "subtitle": "Great with a Knife",
    "faction": "Edgerunners",
    "threatTier": "boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 40,
    "role": "Solo",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 7,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 6,
      "REF": 8,
      "DEX": 8,
      "TECH": 6,
      "COOL": 6,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 7,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Pistol w/ Smartgun Link (Excellent Quality)",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Kendachi Mono-Three",
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
        "name": "Heavy Pistol w/ Smartgun Link (Excellent Quality)",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "Kendachi Mono-Three",
        "skillBase": 16,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Skill inferida: el libro no la indica",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberarm w/ Hardened Shielding",
      "Cyberarm w/ Hardened Shielding & Subdermal Grip",
      "Neural Link w/ Chipware Socket x2, Olfactory Boost, Sandevistan & Tactile Boost"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammo x16",
      "Heavy Melee Weapon x2 (ROF2 • 3d6)",
      "Agent",
      "Disposable Cell Phone"
    ],
    "specialRules": [
      "Solo: Combat Awareness 6.",
      "Lleva dos Heavy Melee Weapon (ROF2, 3d6) como equipo.",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "Chef del restaurante japonés Big Success en Pacifica Playground, conocido como Ryu Sakai; en realidad es un Solo que desapareció de la escena Edgerunner japonesa con un botín robado a la Yakuza de Chiba. Ahora la Yakuza de Night City tiene interés en su local.",
    "rep": 6,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 16,
      "Brawling": 14,
      "Bribery": 10,
      "Bureaucracy": 10,
      "Business": 11,
      "Concentration": 8,
      "Conversation": 7,
      "Drive Land Vehicle": 10,
      "Education": 8,
      "Endurance": 10,
      "Evasion": 16,
      "First Aid": 8,
      "Handgun": 16,
      "Human Perception": 9,
      "Interrogation": 10,
      "Language (English)": 8,
      "Language (Japanese)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Pacifica Playground)": 8,
      "Martial Arts (Karate)": 16,
      "Melee Weapon": 16,
      "Perception": 12,
      "Personal Grooming": 9,
      "Persuasion": 10,
      "Resist Torture/Drugs": 10,
      "Science (Culinary)": 14,
      "Stealth": 16,
      "Streetwise": 12,
      "Tactics": 12,
      "Trading": 10,
      "Wardrobe & Style": 9
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-crab-lord",
    "name": "CrAB Lord",
    "subtitle": "Night City Street Legend",
    "faction": "Edgerunners",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 41,
    "role": "Netrunner",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 8,
      "REF": 7,
      "DEX": 7,
      "TECH": 8,
      "COOL": 7,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 12,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 15,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 9
      },
      {
        "label": "Perception",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol",
        "skillBase": 12,
        "damage": "2d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 15,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Basic H Pistol Ammo x8",
      "Carryall",
      "Inflatable Bed & Sleep-bag",
      "Kibble Pack",
      "Virtuality Goggles",
      "Portable NET Architecture",
      "CrAB Drones",
      "EQ Cyberdeck w/ Armor, Giant, Hellbolt x2, Hardened Circuitry, Insulated Wiring & KRASH Barrier (en el Bodyweight Suit)"
    ],
    "specialRules": [
      "Netrunner: Interface 4.",
      "Tech: Maker 2 (Field Expertise 2, Fabrication Expertise 2).",
      "Cyberdeck de calidad excelente (EQ) con Hardened Circuitry, Insulated Wiring y KRASH Barrier, alojado en el Bodyweight Suit; programas: Armor, Giant y Hellbolt x2.",
      "Equipo: Portable NET Architecture y CrAB Drones (detalle de la página 42, que no es una ficha aparte).",
      "CrAB Drone (tipo Active Defense): dron caminante del tamaño de un perro pequeño, con cámara de observación, patas de agarre y un airhypo cargado con Black Lace, Blue Glass o Biotoxin. Disparador por defecto: un objetivo entra en el área y falla el escaneo de reconocimiento biométrico/facial. Datos: 6 MOVE y 40 HP; protege el perímetro del área defendida. Para contrarrestarlo: DV21 de Electronics/Security Tech, 5 minutos.",
      "NET Architecture portátil de CrAB Lord. Demon instalado: Rock Lobster (un Balron 'con demasiada personalidad'): REZ 30, Interface 7, NET Actions 4, Combat Number 14; puede realizar cualquier NET Action que un Netrunner pueda hacer.",
      "Pisos de la NET: Piso 1 Black ICE Giant (DV —); Piso 2 Password (DV 10); Piso 3 Control Node: CrAB Drone (DV 10); Piso 4 Control Node: CrAB Drone (DV 10).",
      "Role Ability: Interface rank 4"
    ],
    "loreSummary": "Leyenda urbana de Night City: algunos creen que 'CrAB Lord' es un título heredado, pero el original sigue activo aunque casi no se mueva; sus drones y remotos son sus brazos, piernas, ojos y oídos. Prefiere manejar a sus 'hijitos' desde un lugar seguro, dentro del alcance de su NET portátil, y guarda una enorme cantidad de inteligencia sobre la ciudad.",
    "rep": 5,
    "roleAbility": {
      "name": "Interface",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 9,
      "Basic Tech": 14,
      "Brawling": 9,
      "Bureaucracy": 12,
      "Concentration": 11,
      "Conversation": 6,
      "Cryptography": 14,
      "Cybertech": 14,
      "Drive Land Vehicle": 10,
      "Education": 12,
      "Electronics/Security Tech": 14,
      "Evasion": 9,
      "First Aid": 12,
      "Gamble": 11,
      "Handgun": 12,
      "Human Perception": 8,
      "Land Vehicle Tech": 10,
      "Language (English)": 12,
      "Language (Streetslang)": 10,
      "Lip Reading": 12,
      "Local Expert (Hot Zone)": 12,
      "Melee Weapon": 15,
      "Perception": 12,
      "Persuasion": 9,
      "Stealth": 9,
      "Streetwise": 15,
      "Tactics": 10,
      "Trading": 10,
      "Weaponstech": 12
    },
    "isNetrunner": true,
    "interfaceRank": 4,
    "cyberdeckPrograms": [
      "EQ Cyberdeck",
      "Armor",
      "Giant",
      "Hellbolt x2"
    ]
  },
  {
    "id": "dg-edge-tia-puno",
    "name": "Tía Puño",
    "subtitle": "Auntie Fist",
    "faction": "Edgerunners",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 43,
    "role": "Solo",
    "hp": 50,
    "seriouslyWounded": 25,
    "deathSave": 8,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 6,
      "DEX": 5,
      "TECH": 6,
      "COOL": 6,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 8,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Constitutional Arms Multiammo Pistol",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Martial Arts Attack",
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
        "totalBase": 9
      }
    ],
    "weapons": [
      {
        "name": "Constitutional Arms Multiammo Pistol",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "Martial Arts Attack",
        "skillBase": 15,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Martial Arts (Aikido)",
        "skill": "Martial Arts"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberarm w/ RealSkinn Covering & Toolhand",
      "EMP Threading",
      "Neural Link w/ Chipware Socket & Pain Editor"
    ],
    "gear": [
      "Basic VH Pistol Ammo x3",
      "Armor-Piercing VH Pistol Ammo x3",
      "Expansive VH Pistol Ammo x3",
      "Incendiary VH Pistol Ammo x3",
      "Rubber VH Pistol Ammo x3",
      "Armor-Piercing Grenade",
      "Agent",
      "Carryall",
      "Disposable Cell Phone",
      "Techbag"
    ],
    "specialRules": [
      "Solo: Combat Awareness 4.",
      "Tech: Maker 2 (Field Expertise 2, Fabrication Expertise 2); se especializa en ordenanza explosiva.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Antigua empleada de Militech que acabó como freelance tras romperle la mandíbula a un superior que no respetó su instinto protector. Es como la 'madre' de los Edgerunners: experta en explosivos que abre paso a golpes, fría bajo fuego y feroz defendiendo a su gente.",
    "rep": 4,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 10,
      "Basic Tech": 13,
      "Brawling": 15,
      "Concentration": 11,
      "Conversation": 8,
      "Education": 7,
      "Electronics/Security Tech": 10,
      "Evasion": 15,
      "Handgun": 14,
      "Heavy Weapons": 10,
      "Human Perception": 9,
      "Language (Spanish)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (NorCal Military Base)": 7,
      "Martial Arts (Aikido)": 15,
      "Perception": 9,
      "Personal Grooming": 8,
      "Persuasion": 8,
      "Stealth": 7,
      "Wardrobe & Style": 8,
      "Weaponstech": 13
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-backhand",
    "name": "Backhand",
    "subtitle": "Freelance Tech",
    "faction": "Edgerunners",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 44,
    "role": "Tech",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 5,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 6,
      "REF": 5,
      "DEX": 5,
      "TECH": 7,
      "COOL": 5,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy SMG (Excellent Quality)",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Brawling Attack",
        "totalBase": 7,
        "damage": "2d6",
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
        "name": "Heavy SMG (Excellent Quality)",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 1,
        "mag": 40,
        "notes": "Skill inferida (Handgun 13; Autofire también 13) · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 7,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Artificial Shoulder Mount",
      "Contraceptive Implant",
      "Cyberarm w/ Techscanner & Tool Hand"
    ],
    "gear": [
      "Basic H Pistol Ammo x80",
      "Agent",
      "Carryall",
      "Computer",
      "Duct Tape",
      "Flashlight",
      "Tech Bag"
    ],
    "specialRules": [
      "Tech: Maker 4 (Field Expertise 4, Fabrication Expertise 4).",
      "Role Ability: Maker rank 4"
    ],
    "loreSummary": "Cicely Feng, apodada Backhand por su don de elogiar y castigar con la misma frase; es una Tech freelance excelente y sin interés en caerle bien a nadie. Se puede contar con ella para cumplir el trabajo, pero su lealtad es limitada.",
    "rep": 3,
    "roleAbility": {
      "name": "Maker",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 7,
      "Autofire": 13,
      "Basic Tech": 13,
      "Brawling": 7,
      "Concentration": 8,
      "Conversation": 8,
      "Cybertech": 13,
      "Education": 10,
      "Electronics/Security Tech": 13,
      "Evasion": 11,
      "First Aid": 9,
      "Handgun": 13,
      "Human Perception": 8,
      "Interrogation": 7,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Heywood Industrial Zone)": 8,
      "Perception": 10,
      "Personal Grooming": 9,
      "Persuasion": 9,
      "Stealth": 7,
      "Wardrobe & Style": 9,
      "Weaponstech": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-jumpshot",
    "name": "Jumpshot",
    "subtitle": "Leaping into the News",
    "faction": "Edgerunners",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 45,
    "role": "Media",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 5,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 5,
      "REF": 5,
      "DEX": 5,
      "TECH": 4,
      "COOL": 6,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 5,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Microwave",
        "totalBase": 0,
        "damage": "—",
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
        "name": "Heavy Pistol",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Handgun 13 (11 con armadura) · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Microwave",
        "skillBase": 0,
        "damage": "—",
        "rof": 1,
        "mag": 0,
        "notes": "El libro imprime ROF1 y '—' como daño; no indica skill"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberleg x2 w/ Jump Booster x2",
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Basic H Pistol Ammo x16",
      "Agent",
      "Audio Recorder",
      "Carryall",
      "Flashlight",
      "Memory Chips x10",
      "Video Camera"
    ],
    "specialRules": [
      "Media: Credibility 4.",
      "Role Ability: Credibility rank 4"
    ],
    "loreSummary": "Angela Banks, reportera freelance que se ganó el apodo al saltar de un AV-4 con la cámara grabando una paliza del NCPD a manifestantes, y publicó ella misma el video. Llega muy lejos por una historia y siempre la cuenta; trabaja con 24/7 y otros medios.",
    "rep": 4,
    "roleAbility": {
      "name": "Credibility",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 9,
      "Brawling": 13,
      "Composition": 10,
      "Concentration": 8,
      "Conversation": 9,
      "Deduction": 9,
      "Education": 7,
      "Evasion": 13,
      "First Aid": 6,
      "Handgun": 13,
      "Human Perception": 11,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Library Search": 10,
      "Lip Reading": 9,
      "Local Expert (The Glen)": 11,
      "Perception": 10,
      "Persuasion": 12,
      "Photography/Film": 12,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-24-7",
    "name": "24/7",
    "subtitle": "Never Blink News",
    "faction": "Edgerunners",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 46,
    "role": "Media",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 4,
      "DEX": 4,
      "TECH": 4,
      "COOL": 7,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 6,
        "damage": "1d6",
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
        "name": "Heavy Pistol",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 6,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Voice Stress Analyzer",
      "EMP Threading"
    ],
    "gear": [
      "Basic H Pistol Ammo x16",
      "Agent",
      "Audio Recorder",
      "Binoculars",
      "Computer",
      "Disposable Cell Phone x2",
      "Radio Scanner/Music Player",
      "Video Camera"
    ],
    "specialRules": [
      "Role Ability: Credibility rank 4"
    ],
    "loreSummary": "Periodista, presentador, investigador y camarógrafo de Never Blink News, que en realidad es un solo hombre. Dejó las noticias corporativas por la censura y el sesgo y persigue historias para publicarlas en el Data Pool sin soltar la presa.",
    "rep": 2,
    "roleAbility": {
      "name": "Credibility",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 6,
      "Brawling": 6,
      "Composition": 10,
      "Concentration": 8,
      "Conversation": 10,
      "Deduction": 11,
      "Education": 7,
      "Evasion": 13,
      "First Aid": 6,
      "Handgun": 13,
      "Human Perception": 11,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Lip Reading": 12,
      "Local Expert (Upper Marina)": 12,
      "Perception": 10,
      "Persuasion": 12,
      "Photography/Film": 12,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-derby",
    "name": "Derby",
    "subtitle": "Star Jammer",
    "faction": "Edgerunners",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 47,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 6,
      "DEX": 4,
      "TECH": 4,
      "COOL": 6,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol w/ Smartgun Link",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 9,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol w/ Smartgun Link",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 9,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Neural Link",
      "Subdermal Armor",
      "Subdermal Grip"
    ],
    "gear": [
      "Basic VH Pistol Ammo x16",
      "Smoke Grenade",
      "Disposable Cell Phone",
      "Inline Skates"
    ],
    "specialRules": [
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "'Demolition' Derby viene del circuito de roller derby de Night City y sabe jugar al público tanto como derribar rivales. Busca trabajos mejor pagados y mejoras (como el agarre subdérmico para el smartgun link); tiene un fuerte sentido del juego limpio.",
    "rep": 2,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Acting": 8,
      "Athletics": 12,
      "Brawling": 13,
      "Concentration": 9,
      "Conversation": 8,
      "Dance": 8,
      "Education": 6,
      "Endurance": 8,
      "Evasion": 12,
      "First Aid": 6,
      "Handgun": 12,
      "Human Perception": 8,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Watson Development)": 7,
      "Melee Weapon": 9,
      "Perception": 6,
      "Personal Grooming": 10,
      "Resist Torture/Drugs": 10,
      "Stealth": 6,
      "Streetwise": 9,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-forty",
    "name": "Forty",
    "subtitle": "Making Music and Raising Hell",
    "faction": "Edgerunners",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 48,
    "role": "Rockerboy",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 5,
      "DEX": 5,
      "TECH": 4,
      "COOL": 6,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 13,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Brawling Attack",
        "totalBase": 9,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 11
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 13,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 9,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Audio Recorder",
      "EMP Threading",
      "Medical Grade Cyberleg",
      "Light Tattoo x3",
      "Techhair"
    ],
    "gear": [
      "Basic VH Pistol Ammo x16",
      "Flashbang Grenade x2",
      "Agent",
      "Electric Guitar",
      "Pocket Amplifier",
      "Radio Scanner/Music Player"
    ],
    "specialRules": [
      "Role Ability: Charismatic Impact rank 4"
    ],
    "loreSummary": "Hija del músico Adam Dore, arruinado por un contrato abusivo de DMS. Heredó sus archivos, sus lecciones y un fuerte rencor contra las corporaciones, y se reinventó en la escena musical underground y entre los Edgerunners.",
    "rep": 3,
    "roleAbility": {
      "name": "Charismatic Impact",
      "rank": 4
    },
    "skillBases": {
      "Acting": 8,
      "Athletics": 7,
      "Brawling": 9,
      "Bribery": 8,
      "Composition": 10,
      "Concentration": 8,
      "Conversation": 8,
      "Dance": 9,
      "Education": 8,
      "Evasion": 11,
      "First Aid": 6,
      "Handgun": 13,
      "Human Perception": 12,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (New Westbrook)": 6,
      "Perception": 6,
      "Personal Grooming": 10,
      "Persuasion": 12,
      "Play Instrument (Guitar)": 12,
      "Play Instrument (Singing)": 12,
      "Stealth": 7,
      "Wardrobe & Style": 12
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-grease",
    "name": "Grease",
    "subtitle": "Up-and-Coming Fixer",
    "faction": "Edgerunners",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 49,
    "role": "Fixer",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 5,
      "DEX": 4,
      "TECH": 5,
      "COOL": 6,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 13,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Brawling Attack",
        "totalBase": 6,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 9
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 13,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 6,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Bug Detector, Internal Agent & Voice Stress Analyzer"
    ],
    "gear": [
      "Basic VH Pistol Ammo x16",
      "Carryall",
      "Disposable Cell Phone x2",
      "Smart Glasses w/ Targeting Scope"
    ],
    "specialRules": [
      "Role Ability: Operator rank 4"
    ],
    "loreSummary": "Fixer emergente, profesional y suave ('solo soy el intermediario'), que mantiene un perfil bajo. No se arriesga de más: cancelará un trabajo que crea inviable y es leal a su cliente, aunque se le puede convencer de que se retire.",
    "rep": 2,
    "roleAbility": {
      "name": "Operator",
      "rank": 4
    },
    "skillBases": {
      "Accounting": 7,
      "Acting": 8,
      "Athletics": 6,
      "Basic Tech": 7,
      "Brawling": 6,
      "Business": 9,
      "Concentration": 9,
      "Conversation": 12,
      "Education": 8,
      "Evasion": 12,
      "First Aid": 7,
      "Handgun": 13,
      "Human Perception": 10,
      "Language (English)": 9,
      "Language (Spanish)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Watson Development)": 7,
      "Perception": 9,
      "Personal Grooming": 9,
      "Persuasion": 10,
      "Stealth": 8,
      "Streetwise": 10,
      "Tactics": 7,
      "Trading": 12,
      "Wardrobe & Style": 9
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-redeye",
    "name": "Redeye",
    "subtitle": "Runs the Edge and Your Games",
    "faction": "Edgerunners",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 50,
    "role": "Netrunner",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 4,
      "TECH": 5,
      "COOL": 5,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 11,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
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
        "name": "Heavy Pistol",
        "skillBase": 11,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Neural Link w/ Interface Plugs",
      "Shift Tacts x2"
    ],
    "gear": [
      "Basic H Pistol Ammo x16",
      "Agent",
      "Virtuality Goggles",
      "Cyberdeck w/ Armor, See Ya, Sword, Vrizzbolt & Worm"
    ],
    "specialRules": [
      "Netrunner: Interface 4.",
      "Role Ability: Interface rank 4"
    ],
    "loreSummary": "Netrunner que escapó de una familia corporativa que no la aceptaba ni como programadora ni en su identidad, y se hizo un nombre en la calle. Sigue dirigiendo juegos de rol para sus amigos Edgerunners.",
    "rep": 1,
    "roleAbility": {
      "name": "Interface",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 6,
      "Basic Tech": 11,
      "Brawling": 6,
      "Concentration": 10,
      "Conversation": 6,
      "Cryptography": 12,
      "Cybertech": 11,
      "Education": 12,
      "Electronics/Security Tech": 11,
      "Evasion": 10,
      "First Aid": 7,
      "Forgery": 9,
      "Handgun": 11,
      "Human Perception": 6,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Library Search": 12,
      "Local Expert (Little Europe)": 8,
      "Perception": 8,
      "Persuasion": 7,
      "Stealth": 9
    },
    "isNetrunner": true,
    "interfaceRank": 4,
    "cyberdeckPrograms": [
      "Armor",
      "See Ya",
      "Sword",
      "Vrizzbolt",
      "Worm"
    ]
  },
  {
    "id": "dg-edge-saber",
    "name": "Saber",
    "subtitle": "Freelance Corporate Troubleshooter",
    "faction": "Edgerunners",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 51,
    "role": "Exec",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 5,
      "DEX": 5,
      "TECH": 4,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 11,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Popup Heavy Melee Weapon",
        "totalBase": 13,
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
        "name": "Heavy Pistol",
        "skillBase": 11,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Popup Heavy Melee Weapon",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Cyberarm w/ Popup Melee Heavy Weapon",
      "Cyberarm w/ Popup Shield",
      "Subdermal Armor"
    ],
    "gear": [
      "Basic H Pistol Ammo x16",
      "Agent",
      "Businesswear Outfit",
      "Carryall",
      "Scrambler/Descrambler"
    ],
    "specialRules": [
      "Exec: Teamwork 4 (Driver): el libro indica 'Driver' entre paréntesis junto a la habilidad de rol.",
      "Role Ability: Teamwork rank 4"
    ],
    "loreSummary": "Denny Haulk, exmiembro del equipo de esgrima de NCU y troubleshooter freelance al que las corporaciones contratan para arreglar sus desastres. Perdió ambos brazos salvando a un Exec y ahora lleva un arma y un escudo ocultos en los cyberbrazos.",
    "rep": 2,
    "roleAbility": {
      "name": "Teamwork",
      "rank": 4
    },
    "skillBases": {
      "Accounting": 12,
      "Athletics": 7,
      "Brawling": 9,
      "Bureaucracy": 10,
      "Business": 12,
      "Concentration": 7,
      "Conversation": 9,
      "Deduction": 9,
      "Education": 9,
      "Evasion": 13,
      "First Aid": 6,
      "Handgun": 11,
      "Human Perception": 7,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (The Glen)": 7,
      "Melee Weapon": 13,
      "Perception": 9,
      "Personal Grooming": 10,
      "Persuasion": 9,
      "Stealth": 7,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-torch",
    "name": "Torch",
    "subtitle": "Fire-Wielding Tech",
    "faction": "Edgerunners",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 52,
    "role": "Tech",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 4,
      "DEX": 5,
      "TECH": 7,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Flamethrower",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 9
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Flamethrower",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 4,
        "notes": "Skill inferida · ROF/cargador según tabla Core p.94",
        "skill": "Heavy Weapons"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberarm w/ Tool Hand",
      "Cybereye w/ MicroOptics",
      "Skinwatch"
    ],
    "gear": [
      "Basic H Pistol Ammo x8",
      "Incendiary Shotgun Shell x 4",
      "Disposable Cell Phone",
      "Duct Tape",
      "Tech Bag"
    ],
    "specialRules": [
      "Tech: Maker 4 (Field Expertise 2, Upgrade Expertise 2, Fabrication Expertise 2, Invention Expertise 2).",
      "Role Ability: Maker rank 4"
    ],
    "loreSummary": "João 'Torch' Barbosa Alves, dueño de un taller de reparaciones en el sur de Upper Marina; arregla casi todo, incluso lo ilegal (con recargo) y sin hacer preguntas. El apodo viene del soplete, aunque también tiene un lanzallamas que sabe usar.",
    "rep": 1,
    "roleAbility": {
      "name": "Maker",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 7,
      "Basic Tech": 13,
      "Brawling": 7,
      "Business": 10,
      "Conceal/Reveal Object": 8,
      "Conversation": 7,
      "Cybertech": 9,
      "Education": 8,
      "Electronics/Security Tech": 11,
      "Evasion": 9,
      "First Aid": 9,
      "Handgun": 12,
      "Heavy Weapons": 13,
      "Human Perception": 8,
      "Land Vehicle Tech": 10,
      "Language (Portuguese)": 10,
      "Language (Spanish)": 8,
      "Language (Streetslang)": 8,
      "Local Expert (Upper Marina)": 10,
      "Perception": 8,
      "Persuasion": 6,
      "Stealth": 7,
      "Weaponstech": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-crasher",
    "name": "Crasher",
    "subtitle": "Weddings and Funerals",
    "faction": "Edgerunners",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 53,
    "role": "Media",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 4,
      "REF": 5,
      "DEX": 4,
      "TECH": 4,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Medium Pistol (Poor Quality)",
        "totalBase": 12,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 6,
        "damage": "1d6",
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
        "name": "Medium Pistol (Poor Quality)",
        "skillBase": 12,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 6,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "EMP Threading"
    ],
    "gear": [
      "Incendiary M Pistol Ammo x12",
      "Computer",
      "Disposable Cell Phone",
      "TUp (+1 a Photography/Film) Video Camera"
    ],
    "specialRules": [
      "Role Ability: Credibility rank 2"
    ],
    "loreSummary": "Camarógrafo mercenario (de 'wedding crasher') que filma lo que sea por dinero, idealmente con buffet. Guarda un archivo personal de material potencialmente incriminatorio y, por un precio, rebusca en su historial de imágenes de Night City.",
    "rep": 1,
    "roleAbility": {
      "name": "Credibility",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Brawling": 6,
      "Composition": 8,
      "Concentration": 7,
      "Conversation": 8,
      "Education": 6,
      "Evasion": 8,
      "First Aid": 6,
      "Handgun": 12,
      "Human Perception": 10,
      "Language (English)": 8,
      "Language (Streetslang)": 8,
      "Local Expert (Heywood)": 8,
      "Perception": 8,
      "Persuasion": 9,
      "Photography/Film": 10,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-flasher",
    "name": "Flasher",
    "subtitle": "He'll Show You His Goods",
    "faction": "Edgerunners",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 54,
    "role": "Fixer",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 5,
      "DEX": 4,
      "TECH": 4,
      "COOL": 5,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy Pistol (Poor Quality)",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 6,
        "damage": "1d6",
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
        "name": "Heavy Pistol (Poor Quality)",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 6,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Cyberaudio Suite w/ Internal Agent",
      "Cybereye w/ Chyron"
    ],
    "gear": [
      "Expansive H Pistol Ammo x8",
      "Disposable Cell Phone x2",
      "Unloaded Teen Dreem (ROF1 • 2d6) x12"
    ],
    "specialRules": [
      "Role Ability: Operator rank 2"
    ],
    "loreSummary": "Mal Devincher, buhonero de poca monta que abre su abrigo para vender armas baratas y maltrechas, o lo que 'se cayó de un dron de reparto'. Siempre al acecho de una oportunidad, también es buena fuente de información de la calle.",
    "rep": 1,
    "roleAbility": {
      "name": "Operator",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Brawling": 6,
      "Bribery": 9,
      "Conceal/Reveal Object": 10,
      "Concentration": 6,
      "Conversation": 8,
      "Education": 7,
      "Evasion": 12,
      "First Aid": 6,
      "Handgun": 12,
      "Human Perception": 8,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Old Combat Zone)": 7,
      "Perception": 7,
      "Persuasion": 9,
      "Stealth": 6,
      "Trading": 9
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-hammer",
    "name": "Hammer",
    "subtitle": "All the World's a Nail",
    "faction": "Edgerunners",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 55,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 3,
      "REF": 6,
      "DEX": 5,
      "TECH": 4,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol w/ Extended Magazine (Poor Quality)",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Brawling Attack",
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
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol w/ Extended Magazine (Poor Quality)",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 10,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Cybereye w/ Targeting Scope"
    ],
    "gear": [
      "Armor-Piercing VH Pistol Ammo x14",
      "Disposable Cell Phone"
    ],
    "specialRules": [
      "Role Ability: Combat Awareness rank 2"
    ],
    "loreSummary": "Harlan Briggs, exsoldado de una fuerza militar privada que se cansó de ser carne de cañón y se puso a trabajar por su cuenta. Resuelve los problemas de forma directa y contundente, se queda comprado una vez contratado, pero se distrae luciéndose ante quien quiere impresionar.",
    "rep": 0,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 7,
      "Brawling": 10,
      "Concentration": 7,
      "Conversation": 5,
      "Education": 5,
      "Evasion": 10,
      "First Aid": 8,
      "Handgun": 12,
      "Heavy Weapons": 10,
      "Language (English)": 7,
      "Language (Streetslang)": 5,
      "Local Expert (Rancho Coronado)": 5,
      "Melee Weapon": 10,
      "Perception": 8,
      "Persuasion": 6,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "dg-edge-leverage",
    "name": "Leverage",
    "subtitle": "Edgerunner by Accident",
    "faction": "Edgerunners",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 56,
    "role": "Tech",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 6,
    "headSp": 0,
    "bodySp": 7,
    "stats": {
      "INT": 4,
      "REF": 3,
      "DEX": 4,
      "TECH": 6,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 6,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Medium Pistol (Poor Quality)",
        "totalBase": 8,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Very Heavy Melee Weapon (Poor Quality)",
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
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Medium Pistol (Poor Quality)",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "notes": "ROF/cargador según tabla Core p.94",
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
      "Contraceptive Implant"
    ],
    "gear": [
      "Junk M Pistol Ammo x12",
      "Disposable Cell Phone",
      "Smart Lens w/ MicroOptics",
      "Tech Tool"
    ],
    "specialRules": [
      "Tech: Maker 2 (Field Expertise 2, Fabrication Expertise 2).",
      "Role Ability: Maker rank 2"
    ],
    "loreSummary": "Tech corporativo que acabó ayudando a un grupo de Edgerunners que se coló en su edificio, para salvar el pellejo. Le gustó tanto la experiencia que renunció y se hizo Edgerunner; sigue aprendiendo y su lealtad se gana pagándole bien.",
    "rep": 0,
    "roleAbility": {
      "name": "Maker",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Basic Tech": 12,
      "Brawling": 8,
      "Bureaucracy": 6,
      "Concentration": 6,
      "Conversation": 6,
      "Education": 6,
      "Electronics/Security Tech": 10,
      "Evasion": 6,
      "First Aid": 8,
      "Handgun": 8,
      "Human Perception": 6,
      "Language (Samoan)": 8,
      "Language (Spanish)": 6,
      "Local Expert (Heywood Industrial Zone)": 6,
      "Melee Weapon": 12,
      "Perception": 6,
      "Persuasion": 6,
      "Stealth": 6
    },
    "isNetrunner": false
  }
];
