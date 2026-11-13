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
  },
  {
    "id": "dg-genred-blades",
    "name": "Blades",
    "subtitle": "On the Edge of Adulthood",
    "faction": "Generation Red",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 58,
    "role": "Fixer",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 3,
    "headSp": 4,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 6,
      "TECH": 3,
      "COOL": 5,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 3,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 12,
        "damage": "3d6",
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
        "totalBase": 7
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
        "skill": "Melee Weapon"
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
      "Contraceptive Implant",
      "Cybereye w/ MicroVideo",
      "Cyberleg x2 w/ Skate Foot x2"
    ],
    "gear": [
      "Carryall",
      "Disposable Cell Phone x2",
      "Duct Tape",
      "Flashlight",
      "Inflatable Bed & Sleep-bag",
      "Lock Picking Set",
      "Personal CarePak"
    ],
    "specialRules": [
      "Operator 2 (Fixer): habilidad de rol de Fixer con rango 2.",
      "Cyberlegs con Skate Foot x2 (patines integrados), reemplazo financiado por Danger Gal.",
      "Role Ability: Operator rank 2"
    ],
    "loreSummary": "Callejera desde muy chica; perdió un ojo y las piernas peleando contra carroñeros y conoce los sitios de rapiña de la Old Combat Zone. Admira a Danger Gal y Tigress la anima a convencer al resto de Generation Red.",
    "rep": 1,
    "roleAbility": {
      "name": "Operator",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 12,
      "Brawling": 8,
      "Bribery": 7,
      "Conversation": 9,
      "Education": 6,
      "Evasion": 12,
      "First Aid": 5,
      "Handgun": 8,
      "Human Perception": 10,
      "Interrogation": 7,
      "Language (English)": 8,
      "Language (Streetslang)": 10,
      "Library Search": 8,
      "Local Expert (Old Combat Zone)": 9,
      "Melee Weapon": 12,
      "Perception": 7,
      "Persuasion": 10,
      "Photography/Film": 9,
      "Pick Lock": 5,
      "Pick Pocket": 5,
      "Stealth": 8,
      "Streetwise": 10,
      "Trading": 10,
      "Wardrobe & Style": 8
    },
    "isNetrunner": false
  },
  {
    "id": "dg-genred-apex",
    "name": "Apex",
    "subtitle": "YoGang Leader",
    "faction": "Generation Red",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 59,
    "role": "Tech",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 3,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 4,
      "REF": 4,
      "DEX": 4,
      "TECH": 5,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 3,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "PQ Heavy Pistol (Poor Quality)",
        "totalBase": 10,
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
        "totalBase": 6
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "PQ Heavy Pistol (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
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
    "cyberware": [],
    "gear": [
      "Junk H Pistol Ammo x8",
      "Flashbang Grenade x3",
      "Anti-Smog Mask",
      "Battleglove w/ Tool Hand",
      "Carryall",
      "Disposable Cell Phone",
      "Duct Tape x2",
      "Flashlight"
    ],
    "specialRules": [
      "Maker 2 (Tech) con Field Expertise 1, Upgrade Expertise 1, Fabrication Expertise 1 e Invention Expertise 1.",
      "Role Ability: Maker rank 2"
    ],
    "loreSummary": "Hija de cogs corporativos de Zhirafa que huyó tras sufrir abuso de un superior y fundó Generation Red en la Old Combat Zone con ayuda de Lookout. Desconfía de adultos y Corps, pero es una líder nata.",
    "rep": 1,
    "roleAbility": {
      "name": "Maker",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 7,
      "Basic Tech": 10,
      "Brawling": 6,
      "Concentration": 7,
      "Conversation": 8,
      "Education": 6,
      "Electronics/Security Tech": 10,
      "Evasion": 6,
      "First Aid": 7,
      "Handgun": 10,
      "Human Perception": 8,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Old Combat Zone)": 6,
      "Perception": 6,
      "Persuasion": 10,
      "Stealth": 8,
      "Streetwise": 10,
      "Tactics": 7,
      "Weaponstech": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-genred-tetra",
    "name": "Tetra",
    "subtitle": "Latchkey Kid Chaos",
    "faction": "Generation Red",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 60,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 3,
      "REF": 6,
      "DEX": 5,
      "TECH": 3,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Midnight Arms SDF-45",
        "totalBase": 10,
        "damage": "8d6",
        "rof": 1
      },
      {
        "label": "Martial Arts Attack",
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
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Midnight Arms SDF-45",
        "skillBase": 10,
        "damage": "8d6",
        "rof": 1,
        "mag": 0,
        "skill": "Heavy Weapons"
      },
      {
        "name": "Martial Arts Attack",
        "skillBase": 10,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Martial Arts"
      }
    ],
    "cyberware": [],
    "gear": [
      "Armor-Piercing Rocket x4",
      "Agent",
      "Carryall",
      "Flashlight"
    ],
    "specialRules": [
      "Combat Awareness 2 (Solo).",
      "El lanzacohetes Midnight Arms SDF-45 (8d6, ROF 1) sale del armario de armas de sus padres; se usa con 4 cohetes perforantes.",
      "Role Ability: Combat Awareness rank 2"
    ],
    "loreSummary": "Hija de ejecutivos de seguridad de Petrochem que casi no le prestan atención; tomó el lanzacohetes de su armario y lo usó contra los pandilleros. Hace taekwondo, adora a Blades y gasta su mesada en la banda.",
    "rep": 1,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 7,
      "Brawling": 7,
      "Concentration": 6,
      "Conversation": 7,
      "Education": 7,
      "Evasion": 10,
      "First Aid": 5,
      "Heavy Weapons": 10,
      "Human Perception": 7,
      "Language (English)": 7,
      "Language (Streetslang)": 5,
      "Library Search": 5,
      "Local Expert (New Westbrook)": 5,
      "Local Expert (Old Combat Zone)": 5,
      "Martial Arts (Taekwondo)": 10,
      "Perception": 7,
      "Persuasion": 7,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "dg-genred-hi-stick",
    "name": "Hi-Stick",
    "subtitle": "Street Hockey Meets Street Poetry",
    "faction": "Generation Red",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 61,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 4,
      "REF": 4,
      "DEX": 4,
      "TECH": 2,
      "COOL": 4,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "PQ Heavy Melee Weapon (Poor Quality)",
        "totalBase": 10,
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
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "PQ Heavy Melee Weapon (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
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
      "EMP Threading"
    ],
    "gear": [
      "Carryall",
      "Disposable Cell Phone",
      "Duct Tape",
      "Glow Paint",
      "Inflatable Bed & Sleep-bag",
      "Inline Skates",
      "Kibble Packet",
      "Radio Scanner/Music Player"
    ],
    "specialRules": [
      "Sin rol; el palo de hockey es un arma cuerpo a cuerpo pesada de calidad pobre."
    ],
    "loreSummary": "Jugadora de hockey callejero y poeta; vive con su familia extendida en South Cargo Village y tiene su cuarto en el clubhouse. Pagó su EMP Threading con premios de poesía.",
    "rep": 1,
    "skillBases": {
      "Athletics": 10,
      "Basic Tech": 4,
      "Brawling": 10,
      "Composition": 10,
      "Concentration": 5,
      "Conversation": 7,
      "Education": 6,
      "Endurance": 5,
      "Evasion": 10,
      "Human Perception": 7,
      "Language (English)": 7,
      "Language (Streetslang)": 6,
      "Local Expert (Old Combat Zone)": 6,
      "Local Expert (South Night City)": 6,
      "Melee Weapon": 10,
      "Perception": 7,
      "Persuasion": 6,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "dg-genred-izzy",
    "name": "Izzy",
    "subtitle": "Future Audio Tech",
    "faction": "Generation Red",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 62,
    "role": "Tech",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 3,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 4,
      "REF": 3,
      "DEX": 3,
      "TECH": 5,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 3,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "PQ Heavy Pistol w/ Extended Magazine (Poor Quality)",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "PQ Heavy Pistol w/ Extended Magazine (Poor Quality)",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 5
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "PQ Heavy Pistol w/ Extended Magazine (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "PQ Heavy Pistol w/ Extended Magazine (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Handgun"
      }
    ],
    "cyberware": [],
    "gear": [
      "Rubber H Pistol Ammo x28",
      "Agent",
      "Carryall",
      "Computer",
      "DJ Deck",
      "Food Stick",
      "Memory Chip x5",
      "Radio Scanner/Music Player",
      "Techtool",
      "Virtuality Goggles"
    ],
    "specialRules": [
      "Maker 1 (Tech) con Field Expertise 1 y Fabrication Expertise 1.",
      "Dos pistolas pesadas de calidad pobre con cargador extendido (dos entradas de arma idénticas).",
      "Role Ability: Maker rank 1"
    ],
    "loreSummary": "Hije de una medtech de la Crisis Medical Center en Old Japantown, prefiere la ingeniería de audio y es sigiloso. Es cercane a Lookout y diseñó con Apex las trampas del clubhouse.",
    "rep": 0,
    "roleAbility": {
      "name": "Maker",
      "rank": 1
    },
    "skillBases": {
      "Athletics": 5,
      "Basic Tech": 10,
      "Brawling": 5,
      "Composition": 6,
      "Concentration": 6,
      "Conversation": 7,
      "Education": 7,
      "Electronics/Security Tech": 8,
      "Evasion": 5,
      "First Aid": 10,
      "Handgun": 10,
      "Human Perception": 7,
      "Language (Hebrew)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Old Combat Zone)": 6,
      "Local Expert (Old Japantown)": 6,
      "Perception": 8,
      "Persuasion": 5,
      "Play Instrument (DJ Deck)": 8,
      "Stealth": 10,
      "Weaponstech": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-genred-lookout",
    "name": "Lookout",
    "subtitle": "Sharp-Eyed Graffiti Artist",
    "faction": "Generation Red",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 63,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 3,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 5,
      "REF": 4,
      "DEX": 4,
      "TECH": 4,
      "COOL": 3,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 3,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "PQ Light Melee Weapon (Poor Quality)",
        "totalBase": 4,
        "damage": "1d6",
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
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 11
      }
    ],
    "weapons": [
      {
        "name": "PQ Light Melee Weapon (Poor Quality)",
        "skillBase": 4,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Sin skill Melee Weapon en Skill Bases: skillBase = DEX",
        "skill": "Melee Weapon"
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
      "Light Tattoo"
    ],
    "gear": [
      "Agent",
      "Carryall",
      "Duct Tape x3",
      "Flashlight",
      "Food Stick",
      "Glow Paint x10"
    ],
    "specialRules": [
      "Centinela oficial de Generation Red; su Perception 11 la hace una excelente vigía."
    ],
    "loreSummary": "Artista del grafiti de trece años y falsificadora hábil; es amiga cercana de Apex y centinela de la banda. Probablemente diseñó el logo de Generation Red.",
    "rep": 0,
    "skillBases": {
      "Athletics": 8,
      "Brawling": 8,
      "Concentration": 5,
      "Conversation": 6,
      "Education": 7,
      "Evasion": 10,
      "First Aid": 6,
      "Forgery": 10,
      "Human Perception": 10,
      "Language (Greek)": 7,
      "Language (Streetslang)": 7,
      "Library Search": 7,
      "Local Expert (Old Combat Zone)": 7,
      "Local Expert (Upper Marina)": 7,
      "Paint/Draw/Sculpt": 10,
      "Perception": 11,
      "Persuasion": 5,
      "Stealth": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-genred-shredder",
    "name": "Shredder",
    "subtitle": "Skateboarding Streetrat",
    "faction": "Generation Red",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 64,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 7,
    "bodySp": 4,
    "stats": {
      "INT": 3,
      "REF": 5,
      "DEX": 3,
      "TECH": 2,
      "COOL": 3,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "PQ Very Heavy Melee Weapon (Poor Quality)",
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
        "totalBase": 9
      },
      {
        "label": "Perception",
        "totalBase": 5
      }
    ],
    "weapons": [
      {
        "name": "PQ Very Heavy Melee Weapon (Poor Quality)",
        "skillBase": 8,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
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
    "cyberware": [],
    "gear": [
      "Carryall",
      "Disposable Cell Phone",
      "Flashlight",
      "Inflatable Bed & Sleep-bag",
      "Kibble Pack",
      "Skateboard",
      "Techtool"
    ],
    "specialRules": [
      "Arma cuerpo a cuerpo muy pesada de calidad pobre (4d6, ROF 1)."
    ],
    "loreSummary": "Huérfana de padres edgerunners; se unió a Generation Red tras enamorarse de Hi-Stick. Cose la ropa de la banda y es la que menos quiere ver peleas internas.",
    "rep": 0,
    "skillBases": {
      "Athletics": 8,
      "Basic Tech": 8,
      "Brawling": 5,
      "Concentration": 6,
      "Conversation": 7,
      "Education": 5,
      "Endurance": 10,
      "Evasion": 9,
      "First Aid": 8,
      "Human Perception": 7,
      "Language (English)": 7,
      "Language (Streetslang)": 5,
      "Library Search": 5,
      "Local Expert (Old Combat Zone)": 5,
      "Melee Weapon": 8,
      "Perception": 5,
      "Persuasion": 5,
      "Stealth": 5
    },
    "isNetrunner": false
  },
  {
    "id": "dg-genred-wheelie",
    "name": "Wheelie",
    "subtitle": "Heir to the Kibble Alternative",
    "faction": "Generation Red",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 65,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 3,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 5,
      "REF": 4,
      "DEX": 4,
      "TECH": 3,
      "COOL": 3,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 3,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "PQ Heavy Pistol (Poor Quality)",
        "totalBase": 8,
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
        "totalBase": 6
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "PQ Heavy Pistol (Poor Quality)",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
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
      "Medical Grade Cyberarm"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammo x8",
      "Bicycle",
      "Disposable Cell Phone",
      "Carryall",
      "Computer",
      "Kibble Pack"
    ],
    "specialRules": [
      "Cyberbrazo de grado médico (perdió el brazo en el accidente que mató a sus padres)."
    ],
    "loreSummary": "Hijo de los Nishioka, que investigaban una alternativa al Kibble y murieron en un accidente que él sospecha provocado. Se unió a Generation Red por la poesía que comparte con Hi-Stick.",
    "rep": 1,
    "skillBases": {
      "Athletics": 10,
      "Brawling": 6,
      "Composition": 8,
      "Concentration": 5,
      "Contortionist": 8,
      "Conversation": 7,
      "Education": 8,
      "Evasion": 6,
      "First Aid": 8,
      "Handgun": 8,
      "Human Perception": 8,
      "Language (English)": 9,
      "Language (Japanese)": 7,
      "Language (Streetslang)": 7,
      "Library Search": 10,
      "Local Expert (University District)": 7,
      "Local Expert (Old Combat Zone)": 7,
      "Perception": 8,
      "Persuasion": 8,
      "Science (Biochemistry)": 8,
      "Stealth": 8,
      "Streetwise": 5
    },
    "isNetrunner": false
  },
  {
    "id": "dg-n54-fiona-hayes",
    "name": "Fiona Hayes",
    "subtitle": "Night City Investigative Powerhouse",
    "faction": "Network 54",
    "threatTier": "boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 92,
    "role": "Media",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 6,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 8,
      "REF": 5,
      "DEX": 5,
      "TECH": 5,
      "COOL": 8,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Light Melee Weapon",
        "totalBase": 5,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 7,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 16
      }
    ],
    "weapons": [
      {
        "name": "Light Melee Weapon",
        "skillBase": 5,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Sin skill Melee Weapon en Skill Bases: skillBase = DEX · ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
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
      "Biomonitor",
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Audio Recorder & Internal Agent",
      "Cybereye w/ Chyron & MicroVideo",
      "EMP Threading",
      "Enhanced Antibodies",
      "PerfectFit Cyberfoot x2",
      "Subdermal Armor",
      "Techhair"
    ],
    "gear": [
      "Auto Level Dampening Ear Protectors",
      "Computer",
      "Disposable Cell Phone x2",
      "Memory Chip x5",
      "Personal CarePak",
      "Scrambler/Descrambler",
      "Trauma Team (Executive)"
    ],
    "specialRules": [
      "Credibility 6 (Media).",
      "Trauma Team (Executive): cobertura de Trauma Team de nivel ejecutivo, listada en el equipo.",
      "Role Ability: Credibility rank 6"
    ],
    "loreSummary": "Reportera estrella de Net54 conocida por su energía positiva; el rumor de que no es la Fiona Hayes original es cierto: la Corp moldea su imagen con cirugía corporal y entrenamiento de Braindance.",
    "rep": 9,
    "roleAbility": {
      "name": "Credibility",
      "rank": 6
    },
    "skillBases": {
      "Acting": 16,
      "Athletics": 10,
      "Basic Tech": 8,
      "Brawling": 7,
      "Bribery": 14,
      "Bureaucracy": 14,
      "Business": 11,
      "Composition": 14,
      "Concentration": 9,
      "Criminology": 10,
      "Deduction": 16,
      "Drive Land Vehicle": 10,
      "Education": 13,
      "Evasion": 10,
      "First Aid": 9,
      "Human Perception": 15,
      "Interrogation": 12,
      "Language (English)": 12,
      "Language (Streetslang)": 10,
      "Library Search": 14,
      "Lip Reading": 12,
      "Local Expert (Night City)": 14,
      "Perception": 16,
      "Personal Grooming": 16,
      "Persuasion": 14,
      "Resist Torture/Drugs": 14,
      "Stealth": 7,
      "Wardrobe & Style": 16
    },
    "isNetrunner": false
  },
  {
    "id": "dg-n54-angle",
    "name": "Angle",
    "subtitle": "Bodyguard to a Star",
    "faction": "Network 54",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 93,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 7,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 6,
      "DEX": 6,
      "TECH": 4,
      "COOL": 5,
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
        "label": "Brawling Attack",
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
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
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
      "Contraceptive Implant",
      "EMP Threading",
      "Kiroshi OptiShield",
      "Neural Link w/ Reflex Co-Processor",
      "Skin Weave"
    ],
    "gear": [
      "Armor-Piercing VH Pistol Ammo x8",
      "Basic VH Pistol x8",
      "Agent",
      "Binoculars",
      "Bulletproof Shield",
      "Disposable Cell Phone",
      "Flashlight",
      "Radio Scanner/Music Player"
    ],
    "specialRules": [
      "Combat Awareness 4 (Solo).",
      "Skin Weave (SP 7 en la cabeza) y Neural Link con Reflex Co-Processor; lleva Bulletproof Shield.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Guardaespaldas y supervisor corporativo de Fiona, ex agente de inteligencia con un pasado turbio que Net54 oculta. Es reservado y mataría a sus compañeros si el secreto de las 'Fionas' se filtrara.",
    "rep": 4,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 11,
      "Brawling": 12,
      "Conceal/Reveal Object": 7,
      "Concentration": 9,
      "Conversation": 6,
      "Drive Land Vehicle": 10,
      "Education": 7,
      "Endurance": 8,
      "Evasion": 13,
      "First Aid": 12,
      "Handgun": 14,
      "Human Perception": 12,
      "Interrogation": 7,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (New Westbrook)": 7,
      "Personal Grooming": 8,
      "Perception": 12,
      "Persuasion": 7,
      "Resist Torture/Drugs": 8,
      "Stealth": 8,
      "Streetwise": 9,
      "Wardrobe & Style": 8
    },
    "isNetrunner": false
  },
  {
    "id": "dg-n54-stringer",
    "name": "Stringer",
    "subtitle": "Camera Jockey in Love",
    "faction": "Network 54",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 94,
    "role": "Tech",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 6,
      "DEX": 5,
      "TECH": 6,
      "COOL": 4,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 6,
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
        "totalBase": 14,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 7
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 14,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Internal Agent",
      "Cybereye w/ MicroVideo",
      "Enhanced Antibodies"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammo x16",
      "Audio Recorder",
      "Memory Chip x5",
      "Observer Drone",
      "Techtool",
      "Video Camera"
    ],
    "specialRules": [
      "Maker 3 (Tech) con Field Expertise 2, Upgrade Expertise 2 y Fabrication Expertise 2.",
      "Segunda habilidad de rol: Media: Credibility 1.",
      "Lleva un Observer Drone en el equipo (el libro no imprime sus stats).",
      "Role Ability: Maker rank 3"
    ],
    "loreSummary": "Camarógrafo y confidente de Fiona; lleva veinte años en Net54 y guarda rencor a la Megacorp. Se enamoró de una Fiona anterior y planea vengarla, aunque su lealtad actual es incierta.",
    "rep": 4,
    "roleAbility": {
      "name": "Maker",
      "rank": 3
    },
    "skillBases": {
      "Athletics": 10,
      "Basic Tech": 12,
      "Brawling": 14,
      "Concentration": 9,
      "Conversation": 8,
      "Cybertech": 10,
      "Education": 9,
      "Electronics/Security Tech": 12,
      "Evasion": 7,
      "First Aid": 9,
      "Forgery": 8,
      "Handgun": 14,
      "Human Perception": 8,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Library Search": 7,
      "Local Expert (New Westbrook)": 7,
      "Perception": 7,
      "Persuasion": 6,
      "Photography/Film": 13,
      "Resist Torture/Drugs": 13,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "dg-piranhas-bazooka-joe",
    "name": "Bazooka Joe",
    "subtitle": "The Piranha's Teeth",
    "faction": "Piranhas",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 96,
    "role": "Solo",
    "hp": 50,
    "seriouslyWounded": 25,
    "deathSave": 12,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 7,
      "DEX": 6,
      "TECH": 3,
      "COOL": 6,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 12,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "TUp (+1 Wardrobe & Style) Tsunami Arms Helix",
        "totalBase": 17,
        "damage": "—",
        "rof": 1
      },
      {
        "label": "Brawling Damage",
        "totalBase": 12,
        "damage": "4d6",
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
        "name": "TUp (+1 Wardrobe & Style) Tsunami Arms Helix",
        "skillBase": 17,
        "damage": "—",
        "rof": 1,
        "mag": 0,
        "notes": "Daño no impreso en el libro",
        "skill": "Autofire"
      },
      {
        "name": "Brawling Damage",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Chemskin",
      "Contraceptive Implant",
      "Grafted Muscle and Bone Lace",
      "Linear Frame Sigma",
      "Neural Link w/ Reflex Co-Processor",
      "Techhair x2"
    ],
    "gear": [
      "Rubber Rifle Ammo x120",
      "Carryall",
      "Duct Tape x2",
      "Handcuffs",
      "Flashlight",
      "Piranha Smash x5",
      "Synthcoke x1"
    ],
    "specialRules": [
      "Combat Awareness 4 (Solo).",
      "Linear Frame Sigma y Grafted Muscle and Bone Lace: BODY 12 y Death Save 12.",
      "Su arma principal es una Tsunami Arms Helix (ROF 1, daño no impreso) con munición de goma para rifle (x120).",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Lugarteniente de seguridad de Corpse Reviver y la piraña activa más veterana; donde hay violencia en una fiesta, está Joe. Entrena a los reclutas para mantener las fiestas vivas y seguras.",
    "rep": 4,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 8,
      "Autofire": 17,
      "Brawling": 12,
      "Concentration": 6,
      "Conversation": 6,
      "Criminology": 9,
      "Dance": 14,
      "Education": 7,
      "Endurance": 10,
      "Evasion": 12,
      "First Aid": 5,
      "Handgun": 11,
      "Human Perception": 8,
      "Language (French)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Watson Development)": 7,
      "Melee Weapon": 11,
      "Perception": 12,
      "Personal Grooming": 12,
      "Persuasion": 8,
      "Resist Torture/Drugs": 14,
      "Stealth": 8,
      "Streetwise": 12,
      "Wardrobe & Style": 12
    },
    "isNetrunner": false
  },
  {
    "id": "dg-piranhas-corpse-reviver",
    "name": "Corpse Reviver",
    "subtitle": "Party Queen of Night City",
    "faction": "Piranhas",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 97,
    "role": "Exec",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 7,
      "REF": 6,
      "DEX": 6,
      "TECH": 5,
      "COOL": 7,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Sanroo Hello Cutie MicroCutie",
        "totalBase": 16,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Sanroo Hello Cutie MicroCutie",
        "totalBase": 16,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 14
      },
      {
        "label": "Perception",
        "totalBase": 11
      }
    ],
    "weapons": [
      {
        "name": "Sanroo Hello Cutie MicroCutie",
        "skillBase": 16,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "Sanroo Hello Cutie MicroCutie",
        "skillBase": 16,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Internal Agent x2",
      "Cybereye x2 w/ Chyron x2",
      "Cybersnake",
      "Midnight Lady Sexual Implant",
      "Mr. Studd Sexual Implant",
      "Lead's Turn-On-Show-Off Nails",
      "Neural Link w/ Reflex Co-Processor",
      "PerfectFit Cyberfoot x2",
      "Shift Tacts",
      "Techhair"
    ],
    "gear": [
      "Basic M Pistol Ammo x40",
      "Anti-Smog Breathing Mask",
      "Audio Recorder",
      "Blue Glass x2",
      "Braindance Viewer",
      "Bug Detector",
      "Carryall",
      "Computer",
      "Food Stick x2",
      "Memory Chip x5",
      "Piranha Smash x2",
      "Synthcoke x2"
    ],
    "specialRules": [
      "Teamwork 4 (Exec), con la anotación (Driver) impresa junto al rol.",
      "Dos entradas de arma idénticas (Sanroo Hello Cutie MicroCutie).",
      "Role Ability: Teamwork rank 4"
    ],
    "loreSummary": "Líder carismática de las Piranhas; unió pandillas quemadas y las convirtió en la maquinaria de fiestas de Night City. Lleva las cuentas impecables y vive para construir su 'familia'.",
    "rep": 6,
    "roleAbility": {
      "name": "Teamwork",
      "rank": 4
    },
    "skillBases": {
      "Accounting": 12,
      "Acting": 10,
      "Athletics": 8,
      "Brawling": 8,
      "Bribery": 11,
      "Bureaucracy": 12,
      "Business": 12,
      "Concentration": 11,
      "Conversation": 10,
      "Dance": 14,
      "Deduction": 12,
      "Education": 9,
      "Endurance": 10,
      "Evasion": 14,
      "First Aid": 7,
      "Handgun": 16,
      "Human Perception": 12,
      "Language (English)": 11,
      "Language (Streetslang)": 9,
      "Lip Reading": 9,
      "Local Expert (Watson Development)": 9,
      "Melee Weapon": 16,
      "Perception": 11,
      "Personal Grooming": 16,
      "Persuasion": 12,
      "Resist Torture/Drugs": 14,
      "Stealth": 8,
      "Streetwise": 14,
      "Trading": 12,
      "Wardrobe & Style": 16
    },
    "isNetrunner": false
  },
  {
    "id": "dg-piranhas-dirty-shirley",
    "name": "Dirty Shirley",
    "subtitle": "Creator of Piranha Smash",
    "faction": "Piranhas",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 98,
    "role": "Tech",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 3,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 8,
      "REF": 6,
      "DEX": 4,
      "TECH": 8,
      "COOL": 4,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 3,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "SMG",
        "totalBase": 14,
        "damage": "2d6",
        "rof": 1
      },
      {
        "label": "Brawling Damage",
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
        "name": "SMG",
        "skillBase": 14,
        "damage": "2d6",
        "rof": 1,
        "mag": 30,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Autofire"
      },
      {
        "name": "Brawling Damage",
        "skillBase": 6,
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
      "Neural Link w/ Chemical Analyzer & Chipware Socket",
      "Techhair"
    ],
    "gear": [
      "Basic M Pistol Ammo x30",
      "Agent",
      "Airhypo",
      "Black Lace x2",
      "Blue Glass x2",
      "Boost x2",
      "Carryall",
      "Duct Tape x2",
      "Medtech Bag",
      "Piranha Smash x5",
      "Synthcoke x2",
      "Tech Bag",
      "Techscanner",
      "Urban Flash Mirrorshades"
    ],
    "specialRules": [
      "Maker 4 (Tech) con Fabrication Expertise 4 e Invention Expertise 4.",
      "Creadora de la droga Piranha Smash.",
      "Role Ability: Maker rank 4"
    ],
    "loreSummary": "Cocinera y traficante que se unió a Corpse Reviver y se volvió la joya de las Piranhas con drogas de diseño; su receta más nueva, Piranha Smash, es la comidilla de la ciudad.",
    "rep": 3,
    "roleAbility": {
      "name": "Maker",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 6,
      "Autofire": 14,
      "Basic Tech": 14,
      "Brawling": 6,
      "Concentration": 5,
      "Conversation": 12,
      "Education": 12,
      "Evasion": 6,
      "First Aid": 14,
      "Human Perception": 12,
      "Language (English)": 12,
      "Language (Streetslang)": 10,
      "Library Search": 12,
      "Local Expert (Watson Development)": 10,
      "Paramedic": 14,
      "Perception": 10,
      "Personal Grooming": 6,
      "Persuasion": 6,
      "Resist Torture/Drugs": 12,
      "Science (Chemistry)": 14,
      "Stealth": 6,
      "Streetwise": 8,
      "Trading": 7,
      "Wardrobe & Style": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-crusher",
    "name": "Crusher",
    "subtitle": "Cyberpsycho Urban Legend",
    "faction": "Maelstrom",
    "threatTier": "hardened_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 68,
    "role": "Solo",
    "hp": 70,
    "seriouslyWounded": 35,
    "deathSave": 15,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 7,
      "REF": 8,
      "DEX": 8,
      "TECH": 7,
      "COOL": 8,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 15,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Popup Kendachi Flamethrower",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Popup Grenade Launcher x2",
        "totalBase": 16,
        "damage": "6d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 14
      },
      {
        "label": "Perception",
        "totalBase": 15
      }
    ],
    "weapons": [
      {
        "name": "Popup Kendachi Flamethrower",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 1,
        "mag": 0,
        "notes": "Integrado en Cyberarm",
        "skill": "Heavy Weapons"
      },
      {
        "name": "Popup Grenade Launcher x2",
        "skillBase": 16,
        "damage": "6d6",
        "rof": 1,
        "mag": 0,
        "notes": "Integrado en Cyberarm (x2)",
        "skill": "Heavy Weapons"
      }
    ],
    "cyberware": [
      "Cyberarm w/ Hardened Shielding, Popup Kendachi Flamethrower & Wolvers (ROF2 • 3d6)",
      "Cyberarm w/ Hardened Shielding, TUp (-1 Slot) Popup Grenade Launcher x2",
      "Cyberaudio w/ Level Damper",
      "Cybereye x2 w/ Anti-Dazzle x2 & Low Light/Infrared/UV x2",
      "Cyberleg x2 w/ Hardened Shielding & Jump Booster x2",
      "Grafted Muscle and Bone Lace x2",
      "TUp (+1 BODY) Implanted Linear Frame Beta",
      "Neural Link w/ Chipware Socket, Kerenzikov & Pain Editor",
      "TUp (+1 SP) Subdermal Armor"
    ],
    "gear": [
      "Incendiary Shotgun Shell x4",
      "Incendiary Grenade x4"
    ],
    "specialRules": [
      "Combat Awareness 8 (rol Solo).",
      "Cyberarm con Wolvers integrados (ROF 2, 3d6) además del lanzallamas Popup Kendachi (ROF 1, 3d6).",
      "Lanzagranadas Popup x2 (ROF 1, 6d6), instalado en Cyberarm con TUp (-1 Slot).",
      "Armadura subdérmica TUp (+1 SP): SP 12 en cabeza y cuerpo.",
      "Implanted Linear Frame Beta con TUp (+1 BODY).",
      "Role Ability: Combat Awareness rank 8"
    ],
    "loreSummary": "Líder de Maelstrom tras la muerte de Hammer; resistió en la Burleson Tower y el Totentanz. En 2027 tuvo un episodio ciberpsicótico, masacró un convoy de StormTech y desapareció en la Hot Zone, reapareciendo al azar como un 'dios enojado' de la pandilla.",
    "rep": 9,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 8
    },
    "skillBases": {
      "Athletics": 16,
      "Brawling": 16,
      "Conceal/Reveal Object": 7,
      "Concentration": 16,
      "Conversation": 2,
      "Drive Land Vehicle": 10,
      "Education": 9,
      "Electronics/Security Tech": 7,
      "Endurance": 13,
      "Evasion": 14,
      "First Aid": 11,
      "Handgun": 14,
      "Heavy Weapons": 16,
      "Human Perception": 2,
      "Interrogation": 12,
      "Language (English)": 11,
      "Language (Streetslang)": 9,
      "Local Expert (Night City)": 15,
      "Martial Arts (Karate)": 16,
      "Melee Weapon": 16,
      "Perception": 15,
      "Persuasion": 10,
      "Resist Torture/Drugs": 16,
      "Shoulder Arms": 14,
      "Stealth": 16,
      "Streetwise": 16,
      "Tracking": 13
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-warlock",
    "name": "Warlock",
    "subtitle": "Maelstrom Warlord",
    "faction": "Maelstrom",
    "threatTier": "boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 69,
    "role": "Solo",
    "hp": 60,
    "seriouslyWounded": 30,
    "deathSave": 12,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 7,
      "DEX": 7,
      "TECH": 3,
      "COOL": 8,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 12,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Militech Crusher",
        "totalBase": 15,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Popup Magnum Opus Hellbringer",
        "totalBase": 15,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 11
      },
      {
        "label": "Perception",
        "totalBase": 13
      }
    ],
    "weapons": [
      {
        "name": "Militech Crusher",
        "skillBase": 15,
        "damage": "3d6",
        "rof": 1,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "Popup Magnum Opus Hellbringer",
        "skillBase": 15,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "notes": "Popup en Cyberarm",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Cyberarm w/ Popup Ranged Weapon (Hellbringer)",
      "Cyberaudio Suite w/ Internal Agent",
      "Cybereye w/ Chyron & Low Light/Infrared/UV",
      "Cybereye w/ Low Light/Infrared/UV & Targeting Scope",
      "EMP Threading",
      "Grafted Muscle and Bone Lace",
      "Implanted Linear Frame Sigma",
      "Neural Link w/ Chipware Socket & Pain Editor",
      "Subdermal Armor",
      "Subdermal Pocket"
    ],
    "gear": [
      "Armor-Piercing Shotgun Slugs x12",
      "Basic VH Pistol Ammo x6",
      "Anti-Smog Breathing Mask",
      "Auto Level Dampening Ear Protectors",
      "Disposable Cell Phone x2",
      "Kibble Pack x10"
    ],
    "specialRules": [
      "Combat Awareness 6 (rol Solo).",
      "EMP Threading.",
      "Subdermal Armor: SP 11 en cabeza y cuerpo.",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "Parece un 'ganger' desechable, pero es un líder astuto con conocimiento y presencia para cerrar tratos con corpos. Entró de niño a la pandilla bajo Crusher, tomó las riendas tras la caída de Hextra y organizó a los scavvers y el control del Totentanz.",
    "rep": 6,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 9,
      "Autofire": 11,
      "Brawling": 13,
      "Bribery": 12,
      "Business": 12,
      "Concentration": 16,
      "Conversation": 8,
      "Cybertech": 10,
      "Deduction": 10,
      "Drive Land Vehicle": 10,
      "Education": 9,
      "Endurance": 16,
      "Evasion": 11,
      "First Aid": 6,
      "Handgun": 15,
      "Human Perception": 9,
      "Interrogation": 14,
      "Language (English)": 11,
      "Language (Streetslang)": 12,
      "Local Expert (Upper Marina)": 13,
      "Melee Weapon": 7,
      "Perception": 13,
      "Persuasion": 14,
      "Resist Torture/Drugs": 16,
      "Shoulder Arms": 11,
      "Stealth": 10,
      "Streetwise": 15,
      "Tactics": 15,
      "Trading": 12
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-the-pit",
    "name": "The Pit",
    "subtitle": "Pet Cyberpsycho",
    "faction": "Maelstrom",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 70,
    "role": "Solo",
    "hp": 65,
    "seriouslyWounded": 33,
    "deathSave": 13,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 2,
      "REF": 8,
      "DEX": 8,
      "TECH": 2,
      "COOL": 8,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 13,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Brawling Attack",
        "totalBase": 18,
        "damage": "4d6",
        "rof": 2
      },
      {
        "label": "Someone Else's Very Heavy Pistol",
        "totalBase": 12,
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
        "name": "Brawling Attack",
        "skillBase": 18,
        "damage": "4d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Someone Else's Very Heavy Pistol",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Cyberleg x2 w/ Grip Foot x2",
      "Grafted Muscle and Bone Lace",
      "TUp (+1 BODY) Implanted Linear Frame Sigma",
      "Subdermal Armor"
    ],
    "gear": [
      "Basic VH Pistol Ammo x3",
      "Anti-Smog Breathing Mask (bolted on)",
      "Smart Glasses w/ Low Light/Infrared/UV (bolted on)"
    ],
    "specialRules": [
      "Combat Awareness 6 (rol Solo).",
      "Cyberlegs con Grip Foot x2.",
      "Implanted Linear Frame Sigma con TUp (+1 BODY).",
      "La máscara antihumo y las gafas inteligentes están 'atornilladas' (bolted on) a la criatura.",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "Monstruo ciberpsicótico de carne y metal que la banda mantiene en los subsótanos de la Burleson Tower para entretener y castigar; cree ser un monstruo y acecha a quienes le arrojan para pelear.",
    "rep": 6,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 14,
      "Brawling": 18,
      "Concentration": 16,
      "Conversation": 2,
      "Education": 4,
      "Endurance": 18,
      "Evasion": 16,
      "First Aid": 4,
      "Handgun": 12,
      "Human Perception": 2,
      "Language (Unknown)": 6,
      "Language (Streetslang)": 4,
      "Local Expert (Tunnels Beneath Totentanz)": 12,
      "Perception": 12,
      "Persuasion": 13,
      "Resist Torture/Drugs": 16,
      "Shoulder Arms": 12,
      "Stealth": 16,
      "Streetwise": 12,
      "Tactics": 6,
      "Tracking": 8,
      "Wilderness Survival": 8
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-quake",
    "name": "Quake",
    "subtitle": "Lord of the Hammer",
    "faction": "Maelstrom",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 71,
    "role": "Solo",
    "hp": 60,
    "seriouslyWounded": 30,
    "deathSave": 12,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 8,
      "TECH": 3,
      "COOL": 8,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 12,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Very Heavy Melee Weapon (Excellent Quality)",
        "totalBase": 16,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Popup Magnum Opus Hellbringer",
        "totalBase": 16,
        "damage": "5d6",
        "rof": 1
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
        "name": "Very Heavy Melee Weapon (Excellent Quality)",
        "skillBase": 16,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Popup Magnum Opus Hellbringer",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "notes": "Popup en Cyberarm",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberarm w/ Popup Ranged Weapon (Hellbringer)",
      "Cyberarm w/ Popup Shield",
      "EMP Threading",
      "Grafted Muscle and Bone Lace",
      "Implanted Linear Frame Sigma",
      "Shift Tacts x2",
      "Subdermal Armor"
    ],
    "gear": [
      "Basic VH Pistol Ammo x6",
      "Agent",
      "Disposable Cell Phone",
      "Road Flare x5"
    ],
    "specialRules": [
      "Combat Awareness 6 (rol Solo).",
      "Cyberarm con Popup Shield (escudo emergente) además del Hellbringer en el otro brazo.",
      "EMP Threading; Shift Tacts x2.",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "El 'puño enguantado' de Maelstrom: un bruto cicatrizado que lidera disturbios y combates contra los Inquisidores con un martillo enorme y un revólver integrado. No solo mata, aterra.",
    "rep": 5,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 14,
      "Brawling": 10,
      "Concentration": 13,
      "Conversation": 4,
      "Drive Land Vehicle": 10,
      "Education": 7,
      "Endurance": 13,
      "Evasion": 14,
      "First Aid": 5,
      "Handgun": 16,
      "Human Perception": 6,
      "Interrogation": 14,
      "Language (English)": 9,
      "Language (Spanish)": 8,
      "Language (Russian)": 8,
      "Language (Streetslang)": 9,
      "Library Search": 10,
      "Local Expert (Upper Marina)": 12,
      "Melee Weapon": 16,
      "Perception": 8,
      "Persuasion": 12,
      "Resist Torture/Drugs": 13,
      "Stealth": 10,
      "Streetwise": 15,
      "Tactics": 12,
      "Tracking": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-flenser",
    "name": "Flenser",
    "subtitle": "Maelstrom Intelligence Expert",
    "faction": "Maelstrom",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 72,
    "role": "Netrunner",
    "hp": 35,
    "seriouslyWounded": 13,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 5,
      "DEX": 7,
      "TECH": 7,
      "COOL": 6,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 13,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Popup Heavy Melee Weapon",
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
        "totalBase": 11
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
        "name": "Popup Heavy Melee Weapon",
        "skillBase": 11,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Popup en Cyberarm · ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberarm w/ Cyberdeck",
      "Cyberarm w/ Popup Melee Weapon (Heavy Melee Weapon)",
      "Cybereye w/ Chyron & Virtuality",
      "Cybereye w/ Virtuality",
      "Cyberleg x2 w/ Grip Foot x2",
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Basic VH Pistol Ammo x16",
      "Agent",
      "Audio Recorder",
      "Binoculars",
      "Flashlight",
      "Grapple Gun",
      "Lock Picking Set",
      "Memory Chip x5",
      "Scrambler/Descrambler",
      "Techtool",
      "Video Camera",
      "EQ Cyberdeck (in Cyberarm) w/ Shield x5, Speedy Gonzalves x4 & Insulated Wiring (in Bodyweight Suit)"
    ],
    "specialRules": [
      "Netrunner con Interface 4.",
      "Cyberdeck de calidad excelente (EQ) en el Cyberarm, con Insulated Wiring (en el Bodyweight Suit) y programas Shield x5 y Speedy Gonzalves x4.",
      "Espía sigilosa y paciente: rara vez pelea de frente.",
      "Role Ability: Interface rank 4"
    ],
    "loreSummary": "Teniente de inteligencia de Warlock: espía y ladrona de datos que acecha a otras bandas, y también protege los secretos y la seguridad informática de Maelstrom.",
    "rep": 3,
    "roleAbility": {
      "name": "Interface",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 11,
      "Brawling": 10,
      "Bribery": 10,
      "Concentration": 10,
      "Contortionist": 10,
      "Conversation": 5,
      "Education": 7,
      "Electronics/Security Tech": 14,
      "Evasion": 11,
      "First Aid": 9,
      "Handgun": 13,
      "Human Perception": 5,
      "Language (Korean)": 9,
      "Language (Streetslang)": 7,
      "Library Search": 8,
      "Local Expert (Upper Marina)": 9,
      "Melee Weapon": 11,
      "Perception": 11,
      "Persuasion": 8,
      "Pick Lock": 12,
      "Pick Pocket": 12,
      "Stealth": 13
    },
    "isNetrunner": true,
    "interfaceRank": 4,
    "cyberdeckPrograms": [
      "EQ Cyberdeck (en Cyberarm) w/ Insulated Wiring",
      "Shield x5",
      "Speedy Gonzalves x4"
    ]
  },
  {
    "id": "dg-maelstrom-joe-pitt",
    "name": "Joe Pitt",
    "subtitle": "Maelstrom Tech Guru",
    "faction": "Maelstrom",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 73,
    "role": "Tech",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 5,
      "TECH": 8,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 7,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Assault Rifle",
        "totalBase": 13,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Combat Jaw",
        "totalBase": 5,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Combat Jaw",
        "skillBase": 5,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Cyberware Combat Jaw",
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Combat Jaw",
      "Contraceptive Implant",
      "Grafted Muscle and Bone Lace"
    ],
    "gear": [
      "Armor-Piercing Rifle Ammo x25",
      "Agent",
      "Bug Detector",
      "Computer",
      "Tech Bag",
      "Techscanner"
    ],
    "specialRules": [
      "Rol Tech: Maker 4 (Field Expertise 3, Upgrade Expertise 2, Fabrication Expertise 2, Invention Expertise 1).",
      "Combat Jaw cibernético (4d6, ROF 1).",
      "Role Ability: Maker rank 4"
    ],
    "loreSummary": "Ingeniero residente de Maelstrom: refuerza la Burleson Tower, instala la seguridad de Flenser y mantiene el ciberware y las armas de la banda. Denuncia en secreto a ciberpsicóticos peligrosos a un oficial del NCPD para evitar a MAX-TAC.",
    "rep": 5,
    "roleAbility": {
      "name": "Maker",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 7,
      "Autofire": 13,
      "Basic Tech": 12,
      "Concentration": 9,
      "Conversation": 5,
      "Cybertech": 12,
      "Education": 8,
      "Electronics/Security Tech": 12,
      "Evasion": 13,
      "First Aid": 10,
      "Human Perception": 5,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Upper Marina)": 10,
      "Perception": 8,
      "Persuasion": 6,
      "Science (Engineering)": 8,
      "Shoulder Arms": 13,
      "Stealth": 8,
      "Streetwise": 7,
      "Weaponstech": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-ripper",
    "name": "Ripper",
    "subtitle": "True Believer",
    "faction": "Maelstrom",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 74,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 5,
      "REF": 6,
      "DEX": 6,
      "TECH": 4,
      "COOL": 6,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 6,
      "EMP": 1
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
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Wolvers",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Integrados en Cyberarm · ROF/cargador según tabla Core p.115",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Cyberarm w/ Wolvers",
      "EMP Threading",
      "Neural Link w/ Chipware Socket & Pain Editor",
      "Sycust FleshWeave"
    ],
    "gear": [
      "Basic Rifle Ammo x50",
      "Agent",
      "Disposable Cell Phone x2",
      "Carryall",
      "Glow Paint",
      "Techtool"
    ],
    "specialRules": [
      "Combat Awareness 4 (rol Solo).",
      "Wolvers integrados en el Cyberarm (ROF 2, 3d6).",
      "EMP Threading; armadura Sycust FleshWeave SP 7 en cabeza y cuerpo.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Sádico organizador del ejército de scavvers de Maelstrom; sus 'Pruebas' pseudo-místicas llevan a muchos a morir en la Hot Zone. Es el subordinado de Warlock con más probabilidad de morderle.",
    "rep": 2,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 10,
      "Basic Tech": 12,
      "Brawling": 11,
      "Conceal/Reveal Object": 8,
      "Concentration": 7,
      "Conversation": 4,
      "Education": 7,
      "Endurance": 7,
      "Evasion": 13,
      "First Aid": 6,
      "Gamble": 7,
      "Handgun": 13,
      "Human Perception": 5,
      "Interrogation": 9,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Hot Zone)": 10,
      "Melee Weapon": 13,
      "Perception": 10,
      "Persuasion": 11,
      "Shoulder Arms": 13,
      "Stealth": 8,
      "Streetwise": 8,
      "Weaponstech": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-drop",
    "name": "Drop",
    "subtitle": "Cosplaying as a Sniper",
    "faction": "Maelstrom",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 75,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 6,
      "DEX": 4,
      "TECH": 3,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Assault Rifle w/ Sniping Scope (Poor Quality)",
        "totalBase": 12,
        "damage": "5d6",
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
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle w/ Sniping Scope (Poor Quality)",
        "skillBase": 12,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "skill": "Shoulder Arms"
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
      "Cybereye x2 w/ Low Light/Infrared/UV x2"
    ],
    "gear": [
      "Basic Rifle Ammo x25",
      "Agent",
      "Binoculars",
      "Radio Communicator"
    ],
    "specialRules": [
      "Combat Awareness 2 (rol Solo).",
      "Francotirador aficionado en los nidos de la Burleson Tower; rifle de calidad pobre (PQ) con mira de francotirador.",
      "Role Ability: Combat Awareness rank 2"
    ],
    "loreSummary": "Soldado medio de Maelstrom que se viste de veterano y vigila desde los nidos de francotirador de la Burleson Tower; sueña con interface plugs, speedware y un rifle ramjet RJ85.",
    "rep": 1,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 9,
      "Brawling": 7,
      "Concentration": 8,
      "Conversation": 5,
      "Education": 7,
      "Evasion": 10,
      "First Aid": 5,
      "Human Perception": 5,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Upper Marina)": 9,
      "Perception": 12,
      "Persuasion": 6,
      "Shoulder Arms": 12,
      "Stealth": 10,
      "Streetwise": 8
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-raguel",
    "name": "Raguel",
    "subtitle": "Recent Convert",
    "faction": "Maelstrom",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 76,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 6,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 5,
      "REF": 4,
      "DEX": 6,
      "TECH": 2,
      "COOL": 5,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 0
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon (Poor Quality)",
        "totalBase": 12,
        "damage": "3d6",
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
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Heavy Melee Weapon (Poor Quality)",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
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
      "Cyberarm x2",
      "Cybereye w/ Chyron"
    ],
    "gear": [
      "Agent",
      "Audio Recorder",
      "Disposable Cell Phone",
      "Memory Chips x5"
    ],
    "specialRules": [
      "Rol: None (sin habilidad de rol).",
      "Dos Cyberarms; armas cuerpo a cuerpo de calidad pobre (PQ)."
    ],
    "loreSummary": "Infiltrado de los Inquisidores que se convirtió y ahora es un fanático de Maelstrom; admira los rituales de Quake y Ripper y se hizo un implante ocular barato.",
    "rep": 0,
    "skillBases": {
      "Acting": 8,
      "Athletics": 10,
      "Brawling": 9,
      "Concentration": 6,
      "Conversation": 2,
      "Education": 8,
      "Evasion": 12,
      "First Aid": 4,
      "Human Perception": 2,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Hot Zone)": 7,
      "Melee Weapon": 12,
      "Perception": 8,
      "Persuasion": 7,
      "Pick Lock": 8,
      "Stealth": 9,
      "Streetwise": 7,
      "Wardrobe & Style": 5
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-ghoul",
    "name": "Ghoul",
    "subtitle": "Bottom of the Barrel",
    "faction": "Maelstrom",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 77,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 0,
    "bodySp": 4,
    "stats": {
      "INT": 3,
      "REF": 5,
      "DEX": 5,
      "TECH": 2,
      "COOL": 2,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 1
    },
    "combatBases": [
      {
        "label": "Heavy Pistol (Poor Quality)",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Medium Melee Weapon",
        "totalBase": 10,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 9
      },
      {
        "label": "Perception",
        "totalBase": 9
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Medium Melee Weapon",
        "skillBase": 10,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Cyberarm",
      "Techhair"
    ],
    "gear": [
      "Basic H Pistol Ammo x16",
      "Disposable Cell Phone",
      "Glow Paint x2",
      "Techtool"
    ],
    "specialRules": [
      "Rol: None (sin habilidad de rol).",
      "Pistola pesada de calidad pobre (PQ)."
    ],
    "loreSummary": "Ex scavver llamado Digger que sobrevivió radiación, derrumbes y nanoenjambres en la Hot Zone; Ripper lo bautizó Ghoul tras sus 'Pruebas'. Perdió una mano en una de ellas y la reemplazó con un cyberarm; conservó el cuchillo.",
    "rep": 0,
    "skillBases": {
      "Athletics": 9,
      "Basic Tech": 8,
      "Brawling": 10,
      "Concentration": 7,
      "Conversation": 3,
      "Education": 5,
      "Endurance": 8,
      "Evasion": 9,
      "First Aid": 4,
      "Handgun": 10,
      "Human Perception": 3,
      "Language (English)": 7,
      "Language (Streetslang)": 5,
      "Local Expert (Hot Zone)": 7,
      "Melee Weapon": 10,
      "Perception": 9,
      "Persuasion": 4,
      "Resist Torture/Drugs": 10,
      "Stealth": 7
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-ripperdoc",
    "name": "Maelstrom Ripperdoc",
    "subtitle": "",
    "faction": "Maelstrom",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 78,
    "role": "Medtech",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 7,
    "bodySp": 7,
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
        "label": "Heavy Pistol (Poor Quality)",
        "totalBase": 6,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Light Melee Weapon",
        "totalBase": 5,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 7
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol (Poor Quality)",
        "skillBase": 6,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Light Melee Weapon",
        "skillBase": 5,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Cyberarm w/ Tool Hand & Scratchers",
      "Cybereye w/ MicroOptics"
    ],
    "gear": [
      "Basic H Pistol Ammo x8",
      "Anti-Smog Breathing Mask",
      "Disposable Cell Phone",
      "Duct Tape x2",
      "Medtech Bag",
      "Techtool"
    ],
    "specialRules": [
      "Medtech: Medicine 2 (Surgery 2).",
      "Cyberarm con Tool Hand y Scratchers; Cybereye con MicroOptics.",
      "Role Ability: Medicine rank 2"
    ],
    "loreSummary": "Ripperdoc de Maelstrom: un estudiante de medicina fallido o ex paramédico dispuesto a hacerse cargo de la pandilla más cromada de la ciudad; el puesto es más peligroso que ser miembro.",
    "rep": 0,
    "roleAbility": {
      "name": "Medicine",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 7,
      "Brawling": 7,
      "Concentration": 11,
      "Conversation": 6,
      "Cybertech": 14,
      "Education": 10,
      "Evasion": 7,
      "First Aid": 9,
      "Handgun": 6,
      "Human Perception": 5,
      "Language (Native)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (GM's choice)": 7,
      "Paramedic": 14,
      "Perception": 7,
      "Persuasion": 5,
      "Stealth": 7,
      "Surgery": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-maelstrom-scavver",
    "name": "Maelstrom Scavver",
    "subtitle": "",
    "faction": "Maelstrom",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 78,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 3,
      "REF": 4,
      "DEX": 4,
      "TECH": 4,
      "COOL": 3,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Medium Pistol (Poor Quality)",
        "totalBase": 10,
        "damage": "2d6",
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
        "totalBase": 5
      }
    ],
    "weapons": [
      {
        "name": "Medium Pistol (Poor Quality)",
        "skillBase": 10,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Heavy Melee Weapon (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [],
    "gear": [
      "Junk M Pistol Ammo x12",
      "Anti-Smog Breathing Mask",
      "Carryall x2",
      "Disposable Cell Phone",
      "Glow Stick x5",
      "Kibble Pack x2"
    ],
    "specialRules": [
      "Rol: None. Cyberware: None.",
      "No es técnicamente miembro de Maelstrom: aspira a ganarse el ingreso trabajando en la Hot Zone."
    ],
    "loreSummary": "Pobres desgraciados que esperan salir de la Hot Zone y entrar al Totentanz; la mayoría no sobrevive a su próximo cumpleaños.",
    "rep": 0,
    "skillBases": {
      "Athletics": 10,
      "Basic Tech": 10,
      "Brawling": 6,
      "Concentration": 5,
      "Conversation": 6,
      "Education": 5,
      "Endurance": 7,
      "Evasion": 10,
      "First Aid": 6,
      "Handgun": 10,
      "Human Perception": 6,
      "Language (Native)": 7,
      "Language (Streetslang)": 5,
      "Local Expert (Hot Zone)": 5,
      "Melee Weapon": 10,
      "Perception": 5,
      "Persuasion": 5,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-caliber",
    "name": "Caliber",
    "subtitle": "Sergeant Alexander Marconi",
    "faction": "NCPD Precinct #1",
    "threatTier": "boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 80,
    "role": "Solo",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 6,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 8,
      "REF": 8,
      "DEX": 8,
      "TECH": 6,
      "COOL": 6,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Sniper Rifle (Excellent Quality)",
        "totalBase": 18,
        "damage": "5d6",
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
        "totalBase": 16
      },
      {
        "label": "Perception",
        "totalBase": 14
      }
    ],
    "weapons": [
      {
        "name": "Sniper Rifle (Excellent Quality)",
        "skillBase": 18,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "TUp (+1 Slot); con Infrared Nightvision Scope, Smartgun Link y Sniping Scope · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Heavy Pistol",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Listada en Gear como (ROF2 • 3d6); el bloque de armas solo muestra el rifle · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Radio Communicator & Scrambler/Descrambler",
      "Cybereye w/ Image Enhance",
      "Cybereye w/ Image Enhance & Targeting Scope",
      "Cyberleg x2 w/ Jump Booster x2",
      "Enhanced Antibodies",
      "Neural Link w/ Chipware Socket, Interface Plugs, Reflex Co-Processor, Sandevistan & Skill Chip (Pilot Air Vehicle)",
      "Toxin Binders"
    ],
    "gear": [
      "Armor-Piercing Rifle Ammo x12",
      "Basic H Pistol Ammo x8",
      "Heavy Pistol (ROF2",
      "3d6)",
      "Smoke Grenade x2",
      "Agent",
      "Disposable Cell Phone x2",
      "Flashlight",
      "Grapple Gun",
      "Handcuffs x2",
      "Road Flare x5"
    ],
    "specialRules": [
      "Habilidad de rol Solo: Combat Awareness rango 6.",
      "El libro imprime valores modificados entre paréntesis: REF 7, DEX 7 y MOVE 5, además de varias skills (ver statsArmorModified).",
      "Neural Link con Sandevistan, Reflex Co-Processor, Interface Plugs y Skill Chip (Pilot Air Vehicle); Cyberlegs x2 con Jump Booster x2; rifle de francotirador Excellent Quality con una ranura extra (TUp), visor nocturno infrarrojo, Smartgun Link y mira de francotirador.",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "Sargento de TAC con un historial de tiro casi perfecto, solitario y sin spotter; el dossier sospecha que es un asesino infiltrado en la policía.",
    "rep": 4,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 14,
      "Autofire": 14,
      "Basic Tech": 10,
      "Brawling": 10,
      "Concentration": 15,
      "Conversation": 4,
      "Deduction": 10,
      "Drive Land Vehicle": 11,
      "Education": 10,
      "Electronics/Security Tech": 11,
      "Endurance": 10,
      "Evasion": 16,
      "First Aid": 8,
      "Handgun": 14,
      "Human Perception": 4,
      "Interrogation": 9,
      "Language (Italian)": 12,
      "Language (Streetslang)": 10,
      "Local Expert (Precinct #1)": 13,
      "Martial Arts (Judo)": 12,
      "Melee Weapon": 12,
      "Perception": 14,
      "Persuasion": 8,
      "Resist Torture/Drugs": 13,
      "Shoulder Arms": 18,
      "Stealth": 14,
      "Tactics": 13,
      "Tracking": 11,
      "Weaponstech": 12
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-hellhound",
    "name": "Hellhound",
    "subtitle": "Detective William \"Bill\" Mauser",
    "faction": "NCPD Precinct #1",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 81,
    "role": "Lawman",
    "hp": 50,
    "seriouslyWounded": 25,
    "deathSave": 7,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 7,
      "DEX": 6,
      "TECH": 4,
      "COOL": 7,
      "WILL": 8,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 7,
      "EMP": 1
    },
    "combatBases": [
      {
        "label": "Nova Model 757 Cityhunter (Excellent Quality)",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Pistol",
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
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Nova Model 757 Cityhunter (Excellent Quality)",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "TUp (+1 Slot); munición Smart Cityhunter (en Gear)",
        "skill": "Handgun"
      },
      {
        "name": "Heavy Pistol",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "TUp (+1 Slot) Cyberaudio Suite w/ Audio Recorder, Internal Agent x2 & Scrambler/Descrambler",
      "Cybereye w/ Chyron & Image Enhance",
      "Cybereye w/ Image Enhance & Targeting Scope",
      "Enhanced Antibodies",
      "Neural Link w/ Chipware Socket, Olfactory Boost & Reflex Co-Processor"
    ],
    "gear": [
      "Smart Cityhunter Ammo x26",
      "Basic H Pistol Ammo x8",
      "Agent",
      "Disposable Cell Phone",
      "Duct Tape",
      "Flashlight",
      "Handcuffs x2",
      "Radio Communicator",
      "Scrambler/Descrambler"
    ],
    "specialRules": [
      "Habilidad de rol Lawman: Backup rango 4.",
      "Sin armadura en la cabeza (el bloque imprime — en esa fila); L Armorjack SP 11 solo en el cuerpo.",
      "Dos Internal Agent en el Cyberaudio Suite y Neural Link con Reflex Co-Processor y Olfactory Boost.",
      "Role Ability: Backup rank 4"
    ],
    "loreSummary": "Detective incorruptible y obsesivo de casos graves (asesinos seriales, posibles ciberpsicópatas); el dossier sospecha que lucha contra una ciberpsicosis propia, con su historial médico censurado.",
    "rep": 5,
    "roleAbility": {
      "name": "Backup",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 10,
      "Brawling": 12,
      "Concentration": 10,
      "Conversation": 7,
      "Criminology": 12,
      "Cybertech": 8,
      "Deduction": 13,
      "Drive Land Vehicle": 10,
      "Education": 9,
      "Evasion": 14,
      "First Aid": 6,
      "Handgun": 16,
      "Human Perception": 11,
      "Interrogation": 14,
      "Language (English)": 11,
      "Language (Streetslang)": 11,
      "Local Expert (Precinct #1)": 13,
      "Martial Arts (Aikido)": 14,
      "Perception": 12,
      "Persuasion": 11,
      "Pilot Air Vehicle": 10,
      "Stealth": 8,
      "Streetwise": 12,
      "Tracking": 13
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-escobar",
    "name": "Escobar",
    "subtitle": "Detective Philip Escobar",
    "faction": "NCPD Precinct #1",
    "threatTier": "mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 82,
    "role": "Media",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 5,
      "DEX": 6,
      "TECH": 6,
      "COOL": 7,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Constitutional Arms Multiammo Pistol",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Constitutional Arms Multiammo Pistol",
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
        "totalBase": 13
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
        "name": "Constitutional Arms Multiammo Pistol",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Contraceptive Implant",
      "Cybereye w/ MicroVideo",
      "Cybersnake",
      "Subdermal Pocket"
    ],
    "gear": [
      "Basic VH Pistol Ammo x10",
      "Armor-Piercing VH Pistol Ammo x10",
      "Expansive VH Pistol Ammo x10",
      "Incendiary VH Pistol Ammo x10",
      "Rubber VH Pistol Ammo x10",
      "Agent",
      "Disposable Cell Phone",
      "Flashlight",
      "Handcuffs x2",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Trauma Team (Silver)"
    ],
    "specialRules": [
      "Habilidad de rol Media: Credibility rango 4.",
      "El bloque de armas lista dos veces la Constitutional Arms Multiammo Pistol (ROF1, 4d6); cinco tipos de munición de pistola VH en Gear (Basic, Armor-Piercing, Expansive, Incendiary, Rubber).",
      "Cuenta con Trauma Team (Silver) y un Cybersnake en el cyberware.",
      "Role Ability: Credibility rank 4"
    ],
    "loreSummary": "Agente de INTERPOL (División de Apoyo a Investigaciones de Fugitivos) que trabaja junto al NCPD; elegante, negocia favores y datos, y es muy buen bailarín.",
    "rep": 5,
    "roleAbility": {
      "name": "Credibility",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 10,
      "Bribery": 10,
      "Composition": 10,
      "Conceal/Reveal Object": 14,
      "Concentration": 7,
      "Conversation": 12,
      "Criminology": 12,
      "Cryptography": 10,
      "Dance": 14,
      "Drive Land Vehicle": 10,
      "Education": 11,
      "Evasion": 14,
      "First Aid": 8,
      "Handgun": 14,
      "Human Perception": 12,
      "Interrogation": 10,
      "Language (English)": 11,
      "Language (Spanish)": 12,
      "Language (Streetslang)": 9,
      "Library Search": 12,
      "Local Expert (Barcelona)": 16,
      "Local Expert (Precinct #1)": 11,
      "Melee Weapon": 14,
      "Perception": 13,
      "Personal Grooming": 10,
      "Persuasion": 14,
      "Photography/Film": 10,
      "Stealth": 10,
      "Streetwise": 10,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-grinder",
    "name": "Grinder",
    "subtitle": "Lieutenant Jessie Brasso",
    "faction": "NCPD Precinct #1",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 83,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 5,
      "REF": 7,
      "DEX": 6,
      "TECH": 4,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 7,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol (Excellent Quality)",
        "totalBase": 13,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Microwaver",
        "totalBase": 7,
        "damage": "—",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 11
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol (Excellent Quality)",
        "skillBase": 13,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "con Smartgun Link · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Microwaver",
        "skillBase": 7,
        "damage": "—",
        "rof": 1,
        "mag": 0,
        "notes": "Daño no impreso en el libro (—)",
        "skill": "REF"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Contraceptive Implant",
      "Enhanced Antibodies",
      "Neural Link w/ Subdermal Grip"
    ],
    "gear": [
      "Basic VH Pistol Ammo x16",
      "Flashbang Grenade x3",
      "Agent",
      "Bulletproof Shield",
      "Flashlight",
      "Handcuffs x2",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Smart Glasses w/ Anti-Dazzle"
    ],
    "specialRules": [
      "Habilidad de rol Solo: Combat Awareness rango 4.",
      "El libro imprime valores modificados entre paréntesis: REF 5, DEX 4 y MOVE 3, además de varias skills (ver statsArmorModified).",
      "Microwaver: arma con ROF1 y sin daño impreso en el libro; lleva Bulletproof Shield en el equipo.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Teniente que dirige el Escuadrón TAC del Precinct #1; prudente, entrena él mismo a sus agentes y MAX-TAC le ofreció un puesto que aún no responde.",
    "rep": 3,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 10,
      "Autofire": 13,
      "Brawling": 12,
      "Concentration": 7,
      "Conversation": 6,
      "Criminology": 9,
      "Deduction": 9,
      "Education": 7,
      "Evasion": 12,
      "First Aid": 8,
      "Handgun": 13,
      "Human Perception": 8,
      "Interrogation": 10,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Little Europe)": 7,
      "Perception": 11,
      "Persuasion": 9,
      "Shoulder Arms": 13,
      "Stealth": 8,
      "Tactics": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-cavalry",
    "name": "Cavalry",
    "subtitle": "Officer Suri Navarro",
    "faction": "NCPD Precinct #1",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 84,
    "role": "Lawman",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 5,
      "TECH": 4,
      "COOL": 5,
      "WILL": 6,
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
        "totalBase": 11
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Heavy Pistol",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Internal Agent & Scrambler/Descrambler",
      "Hidden Holster",
      "Subdermal Pocket"
    ],
    "gear": [
      "Basic H Pistol Ammo x8",
      "Basic Rifle Ammo x50",
      "Agent",
      "Bulletproof Shield",
      "Flashlight",
      "Handcuffs x2",
      "Radio Communicator",
      "Road Flare x5"
    ],
    "specialRules": [
      "Habilidad de rol Lawman: Backup rango 4.",
      "Lleva Bulletproof Shield en el equipo y Hidden Holster en el cyberware.",
      "Role Ability: Backup rank 4"
    ],
    "loreSummary": "Agente de patrulla honesta e ícono entre sus colegas por llegar primera a las llamadas de oficial caído; su esposa tiene deudas de juego con un Fixer.",
    "rep": 2,
    "roleAbility": {
      "name": "Backup",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 7,
      "Autofire": 13,
      "Brawling": 11,
      "Concentration": 8,
      "Conversation": 9,
      "Criminology": 12,
      "Deduction": 10,
      "Drive Land Vehicle": 10,
      "Education": 8,
      "Evasion": 11,
      "First Aid": 6,
      "Handgun": 10,
      "Human Perception": 5,
      "Interrogation": 10,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Upper Marina)": 8,
      "Perception": 8,
      "Persuasion": 7,
      "Shoulder Arms": 13,
      "Stealth": 7,
      "Tracking": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-golden-boy",
    "name": "Golden Boy",
    "subtitle": "Officer Dennis Gant",
    "faction": "NCPD Precinct #1",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 85,
    "role": "Lawman",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 6,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 4,
      "REF": 8,
      "DEX": 7,
      "TECH": 3,
      "COOL": 4,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Assault Rifle (Poor Quality)",
        "totalBase": 15,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Medium Pistol",
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
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle (Poor Quality)",
        "skillBase": 15,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Medium Pistol",
        "skillBase": 12,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Chemskin",
      "Mr. Studd Sexual Implant",
      "Neural Link w/ Kerenzikov",
      "Techhair"
    ],
    "gear": [
      "Basic M Pistol Ammo x12",
      "Basic Rifle Ammo x50",
      "Agent",
      "Braindance Viewer",
      "Flashlight",
      "Handcuffs x2",
      "Radio Communicator",
      "Road Flare x5"
    ],
    "specialRules": [
      "Habilidad de rol Lawman: Backup rango 4.",
      "Neural Link con Kerenzikov; el libro imprime valores modificados entre paréntesis (REF 6, DEX 5, MOVE 4, además de varias skills).",
      "Su Assault Rifle es de Poor Quality (PQ).",
      "Role Ability: Backup rank 4"
    ],
    "loreSummary": "Oficial convertido en favorito de los medios por sus hazañas de héroe de acción; es adicto a la adrenalina y lo apartaron de patrulla para tareas de relaciones públicas.",
    "rep": 3,
    "roleAbility": {
      "name": "Backup",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 9,
      "Autofire": 10,
      "Brawling": 11,
      "Concentration": 5,
      "Conversation": 5,
      "Deduction": 5,
      "Drive Land Vehicle": 12,
      "Education": 6,
      "Evasion": 13,
      "First Aid": 5,
      "Handgun": 12,
      "Human Perception": 5,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Upper Marina)": 6,
      "Perception": 6,
      "Personal Grooming": 12,
      "Persuasion": 6,
      "Shoulder Arms": 15,
      "Stealth": 9
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-sarge",
    "name": "Sarge",
    "subtitle": "Sergeant Titus Malloy",
    "faction": "NCPD Precinct #1",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 86,
    "role": "Lawman",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 13,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 5,
      "TECH": 2,
      "COOL": 7,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Militech Crusher",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Medium Pistol",
        "totalBase": 15,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 9
      },
      {
        "label": "Perception",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Militech Crusher",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 1,
        "mag": 0,
        "notes": "Escopeta; skill inferida (Basic Shotgun Shell x12 en Gear)",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Medium Pistol",
        "skillBase": 15,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Cybereye w/ Chyron & Low Light/Infrared/UV",
      "Cybereye w/ Low Light/Infrared/UV",
      "Enhanced Antibodies",
      "Skinwatch"
    ],
    "gear": [
      "Basic M Pistol Ammo x12",
      "Basic Shotgun Shell x12",
      "Agent",
      "Disposable Cell Phone x2",
      "Flashlight",
      "Handcuffs x2",
      "Kibble Pack",
      "Radio Communicator",
      "Road Flare x5"
    ],
    "specialRules": [
      "Habilidad de rol Lawman: Backup rango 4.",
      "Armadura mixta: L Armorjack en la cabeza (SP 11) y H Armorjack en el cuerpo (SP 13); el libro imprime valores modificados entre paréntesis (REF 4, DEX 3, MOVE 2).",
      "Su Militech Crusher es una escopeta (munición Basic Shotgun Shell x12).",
      "Role Ability: Backup rank 4"
    ],
    "loreSummary": "Sargento veterano con más de treinta años en el NCPD; hace favores y encubrimientos menores, es un informante pagado de Danger Gal y se acerca al retiro con ingresos de sobornos.",
    "rep": 3,
    "roleAbility": {
      "name": "Backup",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 7,
      "Brawling": 7,
      "Bribery": 10,
      "Bureaucracy": 9,
      "Concentration": 7,
      "Conversation": 9,
      "Criminology": 11,
      "Deduction": 10,
      "Drive Land Vehicle": 10,
      "Education": 8,
      "Evasion": 9,
      "First Aid": 6,
      "Handgun": 15,
      "Human Perception": 10,
      "Interrogation": 12,
      "Language (English)": 10,
      "Language (Streetslang)": 10,
      "Local Expert (Precinct #1)": 11,
      "Perception": 10,
      "Persuasion": 13,
      "Shoulder Arms": 10,
      "Stealth": 7,
      "Streetwise": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-shepard",
    "name": "Shepard",
    "subtitle": "Officer Elena Korda",
    "faction": "NCPD Precinct #1",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 87,
    "role": "Lawman",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 6,
      "REF": 7,
      "DEX": 6,
      "TECH": 3,
      "COOL": 5,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Assault Rifle",
        "totalBase": 13,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Medium Pistol",
        "totalBase": 12,
        "damage": "2d6",
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
        "name": "Assault Rifle",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Medium Pistol",
        "skillBase": 12,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Cyberaudio Suite w/ Amplified Hearing, Homing Tracer & Internal Agent",
      "Cybereye w/ Chyron"
    ],
    "gear": [
      "Basic M Pistol Ammo x12",
      "Basic Rifle Ammo x50",
      "Flashlight",
      "Handcuffs x2",
      "Kibble Pack x2",
      "Radio Communicator",
      "Road Flare x5"
    ],
    "specialRules": [
      "Habilidad de rol Lawman: Backup rango 4.",
      "Compañera de Gustav (ficha dg-ncpd-gustav): sigue su cybercam con el Chyron y le da órdenes mediante el Internal Agent; Animal Handling 12.",
      "El libro imprime valores modificados entre paréntesis (REF 5, DEX 4, MOVE 2).",
      "Role Ability: Backup rank 4"
    ],
    "loreSummary": "Oficial de una de las ocho unidades K-9 del Precinct #1, inseparable de su perro Gustav; viuda de un policía muerto en servicio y muy reservada.",
    "rep": 2,
    "roleAbility": {
      "name": "Backup",
      "rank": 4
    },
    "skillBases": {
      "Animal Handling": 12,
      "Athletics": 10,
      "Autofire": 13,
      "Brawling": 10,
      "Conceal/Reveal Object": 11,
      "Concentration": 8,
      "Conversation": 6,
      "Criminology": 10,
      "Deduction": 10,
      "Education": 8,
      "Evasion": 11,
      "First Aid": 5,
      "Handgun": 12,
      "Human Perception": 6,
      "Interrogation": 7,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Precinct #1)": 10,
      "Perception": 11,
      "Persuasion": 7,
      "Shoulder Arms": 13,
      "Stealth": 10,
      "Tracking": 12
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-gustav",
    "name": "Gustav",
    "subtitle": "Custom Security Canine",
    "faction": "NCPD Precinct #1",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 88,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 2,
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
        "label": "Combat Jaw",
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
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Cyberware de combate",
        "skill": "Melee Weapon"
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
      "Combat Jaw",
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Internal Agent",
      "Cybereye w/ MicroVideo",
      "Neural Link w/ Chipware Socket & Olfactory Boost"
    ],
    "gear": [
      "Homing Tracer"
    ],
    "specialRules": [
      "Perro Custom Security Canine (CSC) de Biotechnica, subtipo Gun Dog: olfato mejorado (Neural Link con Olfactory Boost) para localizar propelentes de armas y explosivos.",
      "Su manejadora, Officer Elena Korda (Shepard, p.87), le da órdenes con el Internal Agent y sigue su cámara MicroVideo; armadura canina L Armorjack SP 11 en el cuerpo; cabeza sin protección.",
      "Sin habilidad de rol (role: None)."
    ],
    "loreSummary": "Perro de seguridad cibernético de Biotechnica entrenado como Gun Dog, compañero de la oficial Korda y equipado con armadura canina.",
    "rep": 2,
    "skillBases": {
      "Athletics": 10,
      "Brawling": 10,
      "Concentration": 6,
      "Endurance": 8,
      "Evasion": 12,
      "Human Perception": 8,
      "Language (German)": 6,
      "Melee Weapon": 12,
      "Perception": 10,
      "Stealth": 10,
      "Tracking": 10,
      "Wilderness Survival": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-pitbull",
    "name": "Pitbull",
    "subtitle": "Officer Judy Warren",
    "faction": "NCPD Precinct #1",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 89,
    "role": "Lawman",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 10,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 4,
      "REF": 5,
      "DEX": 6,
      "TECH": 3,
      "COOL": 3,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 10,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Stun Baton",
        "totalBase": 6,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Pistol (Poor Quality)",
        "totalBase": 10,
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
        "name": "Stun Baton",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "Skill no impresa y Melee Weapon no figura en Skill Bases: skillBase = DEX",
        "skill": "Melee Weapon"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      },
      {
        "name": "Heavy Pistol (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Listada en Gear como PQ Heavy Pistol (ROF2 • 3d6); el bloque de armas no la muestra · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Grafted Muscle and Bone Lace"
    ],
    "gear": [
      "Basic HP Ammo x8",
      "PQ Heavy Pistol (ROF2",
      "3d6)",
      "Agent",
      "Anti-Smog Breathing Mask",
      "Bulletproof Shield",
      "Disposable Cell Phone",
      "Flashlight",
      "Handcuffs x2",
      "Radio Communicator",
      "Road Flare x5"
    ],
    "specialRules": [
      "Habilidad de rol Lawman: Backup rango 2.",
      "Cyberware Grafted Muscle and Bone Lace; BODY 10 y Death Save 10 impresos.",
      "Lleva Bulletproof Shield y Anti-Smog Breathing Mask en el equipo.",
      "Role Ability: Backup rank 2"
    ],
    "loreSummary": "Oficial recién graduada que se hizo policía para golpear con licencia; tiene informes por fuerza excesiva, implantes premium de origen dudoso y vínculos sospechados con la Red Chrome Legion.",
    "rep": 1,
    "roleAbility": {
      "name": "Backup",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 12,
      "Bribery": 5,
      "Concentration": 5,
      "Conversation": 4,
      "Criminology": 6,
      "Education": 6,
      "Evasion": 12,
      "First Aid": 5,
      "Handgun": 10,
      "Human Perception": 4,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (South Night City)": 6,
      "Martial Arts (Karate)": 8,
      "Perception": 6,
      "Persuasion": 5,
      "Stealth": 8
    },
    "isNetrunner": false
  },
  {
    "id": "dg-ncpd-cherub",
    "name": "Cherub",
    "subtitle": "Officer Ranbir Majumdar",
    "faction": "NCPD Precinct #1",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 90,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 5,
      "REF": 4,
      "DEX": 4,
      "TECH": 2,
      "COOL": 2,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Pistol (Poor Quality)",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Medium Pistol (Poor Quality)",
        "totalBase": 12,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 9
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
        "name": "Medium Pistol (Poor Quality)",
        "skillBase": 12,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Grafted Muscle and Bone Lace"
    ],
    "gear": [
      "Basic M Pistol Ammo x12",
      "Basic H Pistol Ammo x8",
      "Disposable Cell Phone",
      "Flashlight",
      "Handcuffs x2",
      "Radio Communicator",
      "Road Flare x5"
    ],
    "specialRules": [
      "Sin habilidad de rol (role: None).",
      "Las dos pistolas son de Poor Quality (PQ).",
      "Cyberware: Biomonitor y Grafted Muscle and Bone Lace."
    ],
    "loreSummary": "Oficial novato recién graduado del Programa de Entrenamiento del NCPD, idealista y con rencor hacia los guardias privados; el dossier propone asignarlo a Cavalry.",
    "rep": 0,
    "skillBases": {
      "Athletics": 7,
      "Brawling": 10,
      "Concentration": 7,
      "Conversation": 7,
      "Deduction": 7,
      "Education": 7,
      "Evasion": 10,
      "First Aid": 4,
      "Handgun": 12,
      "Human Perception": 9,
      "Interrogation": 4,
      "Language (English)": 9,
      "Language (Hindi)": 7,
      "Language (Streetslang)": 7,
      "Local Expert (University District)": 7,
      "Perception": 9,
      "Persuasion": 4,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-sightseers-endo",
    "name": "Endo",
    "subtitle": "The Heart of the Pack",
    "faction": "Sightseers",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 100,
    "role": "Nomad",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 6,
      "DEX": 7,
      "TECH": 4,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 6,
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
        "label": "Popup Grenade Launcher",
        "totalBase": 14,
        "damage": "6d6",
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
        "name": "Heavy Pistol",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Popup Grenade Launcher",
        "skillBase": 14,
        "damage": "6d6",
        "rof": 1,
        "mag": 2,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Heavy Weapons"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cybereye w/ Targeting Scope",
      "Cyberarm w/ Popup Grenade Launcher",
      "Neural Link w/ Interface Plugs",
      "Subdermal Armor"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammo x8",
      "Armor-Piercing Grenade",
      "Flashbang Grenade",
      "Agent",
      "Inflatable Bed & Sleeping Bag",
      "Radio Communicator",
      "Techtool",
      "Tent & Camping Equipment",
      "Roadbike w/ NOS x2 & Smuggling Upgrade"
    ],
    "specialRules": [
      "Habilidad de rol Moto 4 (Nomad).",
      "El lanzagranadas Popup va instalado en el Cyberarm: ROF 1, 6d6.",
      "Lleva una Granada Perforante y una Granada Flashbang.",
      "Role Ability: Moto rank 4"
    ],
    "loreSummary": "Endo es un nómada de buen corazón que mueve cromo y armas recuperadas desde el centro de la ciudad hacia comunidades pobres de las afueras, ayudado por el Fixer Woodchipper. Fue el catalizador de los Sightseers y apadrinó a Swirl; ahora está detenido por el NCPD.",
    "rep": 3,
    "roleAbility": {
      "name": "Moto",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 12,
      "Basic Tech": 8,
      "Brawling": 14,
      "Concentration": 7,
      "Conversation": 7,
      "Drive Land Vehicle": 14,
      "Education": 7,
      "Evasion": 10,
      "First Aid": 6,
      "Handgun": 14,
      "Heavy Weapons": 14,
      "Human Perception": 9,
      "Land Vehicle Tech": 8,
      "Language (Spanish)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Santo Domingo)": 7,
      "Perception": 7,
      "Persuasion": 10,
      "Stealth": 10,
      "Wilderness Survival": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-sightseers-gaze",
    "name": "Gaze",
    "subtitle": "The Fist of the Pack",
    "faction": "Sightseers",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 101,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 5,
      "TECH": 4,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 7,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Assault Rifle",
        "totalBase": 14,
        "damage": "5d6",
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
        "totalBase": 14
      },
      {
        "label": "Perception",
        "totalBase": 12
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
      "Cybereye w/ Targeting Scope",
      "Big Knucks (ROF2 • 2d6)"
    ],
    "gear": [
      "Basic Rifle Ammo x50",
      "Basic VH Pistol Ammo x8",
      "Armor-Piercing Grenade",
      "Agent",
      "Binoculars",
      "Flashlight",
      "Radio Communicator"
    ],
    "specialRules": [
      "Habilidad de rol Combat Awareness 4 (Solo).",
      "Big Knucks (cyberware): ROF 2, 2d6.",
      "El libro imprime entre paréntesis los valores con la armadura puesta: REF 5, DEX 3, MOVE 2.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Gaze recibió su alias por el cibervisor y la mira de su rifle; es el músculo de los Sightseers, escolta cargas valiosas y acompaña los suministros más delicados. Respeta a Racer, apenas tolera a Endo y al resto de la manada, y duda tras la captura de Endo y Swirl.",
    "rep": 2,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 10,
      "Autofire": 14,
      "Brawling": 10,
      "Concentration": 7,
      "Conversation": 6,
      "Education": 6,
      "Evasion": 14,
      "First Aid": 6,
      "Handgun": 14,
      "Human Perception": 6,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Santo Domingo)": 6,
      "Melee Weapon": 11,
      "Perception": 12,
      "Persuasion": 6,
      "Shoulder Arms": 14,
      "Stealth": 7,
      "Weaponstech": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-sightseers-racer",
    "name": "Racer",
    "subtitle": "The Leader of the Pack",
    "faction": "Sightseers",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 102,
    "role": "Nomad",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 6,
      "DEX": 8,
      "TECH": 3,
      "COOL": 4,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Shotgun",
        "totalBase": 14,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Very Heavy Pistol",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
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
        "name": "Shotgun",
        "skillBase": 14,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Very Heavy Pistol",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "EMP Threading",
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Basic Shotgun Slug Ammo x8",
      "Basic Shotgun Shell Ammo x4",
      "Basic VH Pistol Ammo x8",
      "Smoke Grenade",
      "Agent",
      "Carryall",
      "Grapple Gun",
      "Radio Communicator",
      "Techtool",
      "Compact Groundcar w/ Heavy Chassis, Housing Capacity & Seating Upgrade"
    ],
    "specialRules": [
      "Habilidad de rol Moto 4 (Nomad).",
      "Su vehículo es un Compact Groundcar con Heavy Chassis, Housing Capacity y Seating Upgrade.",
      "Role Ability: Moto rank 4"
    ],
    "loreSummary": "Racer Rajavi, ex Edgerunner, fundó los Sightseers y mueve comida, medicinas y tecnología médica entre Packs nómadas y Reclaimers, delegando las rutas fáciles a los más jóvenes. Ignora los envíos más turbios mientras las Corps y los Lawmen no se acerquen.",
    "rep": 3,
    "roleAbility": {
      "name": "Moto",
      "rank": 4
    },
    "skillBases": {
      "Animal Handling": 10,
      "Athletics": 10,
      "Brawling": 10,
      "Concentration": 7,
      "Conversation": 7,
      "Drive Land Vehicle": 12,
      "Education": 6,
      "Evasion": 14,
      "First Aid": 9,
      "Handgun": 12,
      "Human Perception": 7,
      "Language (Hindi)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Badlands)": 8,
      "Local Expert (Santo Domingo)": 6,
      "Perception": 8,
      "Persuasion": 6,
      "Shoulder Arms": 14,
      "Stealth": 12,
      "Tracking": 10,
      "Trading": 10,
      "Wilderness Survival": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-sightseers-glare",
    "name": "Glare",
    "subtitle": "The Eyes of the Pack",
    "faction": "Sightseers",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 103,
    "role": "Solo",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 5,
      "REF": 7,
      "DEX": 6,
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
        "label": "TUp (+1 Slot) Nomad Pneumatic Bolt Gun w/ Infrared Nightvision Scope",
        "totalBase": 12,
        "damage": "4d6",
        "rof": 1
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
        "name": "TUp (+1 Slot) Nomad Pneumatic Bolt Gun w/ Infrared Nightvision Scope",
        "skillBase": 12,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Radio Communicator",
      "Medical Grade Cybereye x2",
      "Kiroshi OptiShield"
    ],
    "gear": [
      "Armor-Piercing Arrow x10",
      "Basic Arrow x10",
      "Basic H Pistol Ammo x8",
      "PQ Heavy Pistol (ROF2 • 3d6)",
      "Disposable Cell Phone",
      "Grapple Gun"
    ],
    "specialRules": [
      "Habilidad de rol Combat Awareness 2 (Solo).",
      "PQ Heavy Pistol en el equipo: ROF 2, 3d6, calidad Poor.",
      "Role Ability: Combat Awareness rank 2"
    ],
    "loreSummary": "Glare perdió la vista a manos de la Red Chrome Legion y la reemplazó con cibervisión de grado médico; luego se hizo mercenario callejero. Racer lo contrató para escoltar convoyes, lo aceptó en los Sightseers y hoy hace de vigía táctico.",
    "rep": 2,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 10,
      "Brawling": 10,
      "Concentration": 9,
      "Conversation": 6,
      "Education": 7,
      "Evasion": 12,
      "First Aid": 5,
      "Handgun": 10,
      "Human Perception": 6,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Santo Domingo)": 7,
      "Perception": 10,
      "Persuasion": 5,
      "Shoulder Arms": 12,
      "Stealth": 10,
      "Tracking": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-sightseers-swirl",
    "name": "Swirl",
    "subtitle": "The Newbie of the Pack",
    "faction": "Sightseers",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 104,
    "role": "Nomad",
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
      "MOVE": 4,
      "BODY": 3,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "PQ Heavy Pistol (Poor Quality)",
        "totalBase": 10,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "PQ Heavy Melee Weapon (Poor Quality)",
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
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "PQ Heavy Pistol (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "PQ Heavy Melee Weapon (Poor Quality)",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "EMP Threading",
      "Neural Link w/ Interface Plugs",
      "Shift Tacts x2",
      "Skinweave"
    ],
    "gear": [
      "Junk H Pistol Ammo x16",
      "Disposable Cell Phone",
      "Flashlight",
      "Radio Communicator",
      "Techtool",
      "Roadbike w/ NOS"
    ],
    "specialRules": [
      "Habilidad de rol Moto 2 (Nomad).",
      "Role Ability: Moto rank 2"
    ],
    "loreSummary": "Swirl es la más joven y reciente de los Sightseers, una ladrona que salta de Pack en Pack. Endo la salvó del NCPD tras robarle a un Fixer; terminó arrestada con él por no poder resistirse a ciertos objetos.",
    "rep": 1,
    "roleAbility": {
      "name": "Moto",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 8,
      "Concentration": 5,
      "Conversation": 6,
      "Drive Land Vehicle": 10,
      "Education": 8,
      "Evasion": 10,
      "First Aid": 6,
      "Handgun": 10,
      "Human Perception": 6,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Santo Domingo)": 8,
      "Melee Weapon": 12,
      "Perception": 8,
      "Persuasion": 5,
      "Pick Lock": 10,
      "Pick Pocket": 10,
      "Stealth": 8,
      "Wilderness Survival": 8
    },
    "isNetrunner": false
  },
  {
    "id": "dg-monster-cereal",
    "name": "Cereal",
    "subtitle": "Hack Night City!",
    "faction": "Team Monster",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 106,
    "role": "Netrunner",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 7,
      "REF": 6,
      "DEX": 6,
      "TECH": 7,
      "COOL": 3,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 6,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 13,
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
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 9
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
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberleg x2 w/ Skate Foot x2",
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Agent",
      "Carryall",
      "Flashlight",
      "Rope (60 m/yds)",
      "Techtool",
      "Virtuality Goggles",
      "Cyberdeck w/ Armor, Banhammer, Killer, Speedy Gonzalves & Worm"
    ],
    "specialRules": [
      "Habilidad de rol Interface 5 (Netrunner).",
      "Cyberdeck con los programas Armor, Banhammer, Killer, Speedy Gonzalves y Worm.",
      "Dos Cyberleg con Skate Foot x2 (patines integrados).",
      "Role Ability: Interface rank 5"
    ],
    "loreSummary": "Cereal es un Netrunner impredecible y bromista que patina con sus ciberpiernas y suele terminar usando cuchillas aunque diga que no quiere violencia. Es leal a quienes aprecia, sobre todo a Nox, y es quien más cuestiona los planes de Mr. Fixit.",
    "rep": 3,
    "roleAbility": {
      "name": "Interface",
      "rank": 5
    },
    "skillBases": {
      "Athletics": 12,
      "Basic Tech": 13,
      "Brawling": 8,
      "Conceal/Reveal Object": 12,
      "Concentration": 7,
      "Conversation": 7,
      "Cryptography": 13,
      "Cybertech": 12,
      "Education": 13,
      "Electronics/Security Tech": 13,
      "Evasion": 13,
      "First Aid": 10,
      "Human Perception": 7,
      "Language (English)": 11,
      "Language (Streetslang)": 9,
      "Library Search": 10,
      "Local Expert (Little China)": 9,
      "Melee Weapon": 13,
      "Perception": 9,
      "Persuasion": 5,
      "Stealth": 10
    },
    "isNetrunner": true,
    "interfaceRank": 5,
    "cyberdeckPrograms": [
      "Armor",
      "Banhammer",
      "Killer",
      "Speedy Gonzalves",
      "Worm"
    ]
  },
  {
    "id": "dg-monster-isolate",
    "name": "Isolate",
    "subtitle": "No Longer a Red Shirt",
    "faction": "Team Monster",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 107,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 7,
      "DEX": 6,
      "TECH": 4,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 6,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Sniper Rifle w/ Smartgun Link",
        "totalBase": 13,
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
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Sniper Rifle w/ Smartgun Link",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
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
      "Medical Grade Cyberarm",
      "Cybereye x2 w/ Low Light/Infrared/UV x2",
      "Cybereye w/ Targeting Scope & TeleOptics",
      "MultiOptic Mount",
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Armor-Piercing Rifle Ammo x12",
      "Agent",
      "Duct Tape",
      "Grapple Gun",
      "Rope (60 m/yds)"
    ],
    "specialRules": [
      "Habilidad de rol Combat Awareness 4 (Solo).",
      "El rifle de francotirador tiene Smartgun Link.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Isolate creció en Georgia, hijo de un líder insurgente contra SovOil, y se convirtió en francotirador de élite antes de mudarse a Night City. Bajo el ala de Mr. Fixit, Paladin lo apoda 'Red Shirt' mientras demuestra su valía como Edgerunner.",
    "rep": 3,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 10,
      "Concentration": 7,
      "Conversation": 6,
      "Education": 7,
      "Evasion": 13,
      "First Aid": 10,
      "Handgun": 13,
      "Human Perception": 6,
      "Interrogation": 10,
      "Language (Russian)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Little China)": 7,
      "Melee Weapon": 12,
      "Perception": 12,
      "Persuasion": 11,
      "Resist Torture/Drugs": 11,
      "Shoulder Arms": 13,
      "Stealth": 12,
      "Tactics": 12
    },
    "isNetrunner": false
  },
  {
    "id": "dg-monster-lucky",
    "name": "Lucky",
    "subtitle": "High-Flying Healer",
    "faction": "Team Monster",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 108,
    "role": "Medtech",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 6,
      "REF": 7,
      "DEX": 6,
      "TECH": 6,
      "COOL": 3,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Amplified Hearing",
      "Cybereye w/ MicroOptics"
    ],
    "gear": [
      "Armor-Piercing VH Pistol Ammo x16",
      "Agent",
      "Airhypo",
      "Battleglove w/ Medscanner",
      "Cryopump",
      "Leisurewear",
      "Mirrorshades",
      "Medtech Bag"
    ],
    "specialRules": [
      "Habilidad de rol Medicine 5 (Medtech), con sub-habilidades: Surgery 2, MedTech [Pharm] 1 y [Cryo 2].",
      "El libro imprime entre paréntesis los valores con la armadura puesta: REF 6, DEX 5, MOVE 4.",
      "Role Ability: Medicine rank 5"
    ],
    "loreSummary": "Luciano 'Lucky' Galanti voló para una cuadrilla de salvamento y para Trauma Team antes de hacerse Edgerunner como piloto y sanador. Su suerte lo mantuvo vivo, incluso cuando las defensas antiaéreas casi tumban al equipo en la misión de Anne Boleyn.",
    "rep": 3,
    "roleAbility": {
      "name": "Medicine",
      "rank": 5
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 8,
      "Concentration": 7,
      "Conversation": 10,
      "Cybertech": 10,
      "Deduction": 10,
      "Education": 12,
      "Evasion": 13,
      "First Aid": 8,
      "Handgun": 14,
      "Human Perception": 10,
      "Language (Italian)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Watson Development)": 8,
      "Medical Tech": 9,
      "Perception": 8,
      "Persuasion": 5,
      "Pilot Air Vehicle": 12,
      "Resist Torture/Drugs": 9,
      "Science (Anatomy)": 10,
      "Stealth": 8,
      "Surgery": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-monster-nox",
    "name": "Nox",
    "subtitle": "ET Power-Belting Synth Pop Star",
    "faction": "Team Monster",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 109,
    "role": "Rockerboy",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 6,
      "TECH": 3,
      "COOL": 7,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Pistol",
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
        "name": "Heavy Pistol",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      }
    ],
    "cyberware": [
      "AudioVox",
      "Biomonitor",
      "Contraceptive Implant",
      "Subdermal Armor",
      "Techhair"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammo x8",
      "Incendiary Ammo x8",
      "Agent",
      "Disposable Cell Phone x2",
      "Electric Guitar",
      "Glow Stick x5",
      "Pocket Amplifier"
    ],
    "specialRules": [
      "Habilidad de rol Charismatic Impact 5 (Rockerboy).",
      "Lleva dos Heavy Pistol (ROF 2, 3d6 cada una).",
      "Role Ability: Charismatic Impact rank 5"
    ],
    "loreSummary": "Nox Arya es una joven Rockerboy de synth pop 'extraterrestre' que empezó en clubes de mala muerte y juntó información para un Ripperdoc, lo que la puso en el radar de Mr. Fixit. Está con Cereal, que se pone protector, aunque la relación es ambigua.",
    "rep": 5,
    "roleAbility": {
      "name": "Charismatic Impact",
      "rank": 5
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 12,
      "Composition": 10,
      "Concentration": 6,
      "Conversation": 8,
      "Education": 8,
      "Evasion": 13,
      "First Aid": 5,
      "Handgun": 13,
      "Human Perception": 12,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Upper Marina)": 10,
      "Perception": 8,
      "Personal Grooming": 11,
      "Persuasion": 12,
      "Play Instrument (Guitar)": 12,
      "Play Instrument (Singing)": 12,
      "Stealth": 8,
      "Streetwise": 12,
      "Wardrobe & Style": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-monster-paladin",
    "name": "Paladin",
    "subtitle": "Beast of a Battler",
    "faction": "Team Monster",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 110,
    "role": "Solo",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 7,
      "DEX": 7,
      "TECH": 4,
      "COOL": 4,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 7,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "EQ Assault Rifle (Excellent Quality)",
        "totalBase": 13,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "EQ Shotgun (Excellent Quality)",
        "totalBase": 13,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "EQ Assault Rifle (Excellent Quality)",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "skill": "Shoulder Arms"
      },
      {
        "name": "EQ Shotgun (Excellent Quality)",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "skill": "Shoulder Arms"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Neural Link w/ Chipware Socket, Pain Editor & Reflex Co-Processor"
    ],
    "gear": [
      "Basic Rifle Ammo x50",
      "Basic Shotgun Shell Ammo x8",
      "Agent",
      "Binoculars",
      "Carryall",
      "Disposable Cell Phone",
      "Handcuffs",
      "Flashlight"
    ],
    "specialRules": [
      "Habilidad de rol Combat Awareness 5 (Solo).",
      "Ambas armas son de calidad Excelente (EQ).",
      "Neural Link con Chipware Socket, Pain Editor y Reflex Co-Processor.",
      "Role Ability: Combat Awareness rank 5"
    ],
    "loreSummary": "Paladin creció en el Combat Zone, sirvió en misiones de Militech y pasó a freelance como Solo; es callado, metódico y de barba inconfundible. Va de punta en las operaciones de combate de Team Monster y es quien apodó 'Red Shirt' a Isolate.",
    "rep": 4,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 5
    },
    "skillBases": {
      "Athletics": 10,
      "Autofire": 13,
      "Brawling": 9,
      "Concentration": 8,
      "Conversation": 5,
      "Education": 7,
      "Evasion": 13,
      "First Aid": 6,
      "Handgun": 13,
      "Heavy Weapons": 12,
      "Human Perception": 5,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Old Combat Zone)": 7,
      "Melee Weapon": 12,
      "Perception": 8,
      "Persuasion": 6,
      "Resist Torture/Drugs": 10,
      "Shoulder Arms": 13,
      "Stealth": 9,
      "Tactics": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-monster-too-tall",
    "name": "Too Tall",
    "subtitle": "Big Man, Big Boom",
    "faction": "Team Monster",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 111,
    "role": "Nomad",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 6,
      "DEX": 5,
      "TECH": 6,
      "COOL": 4,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 7,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Rocket Launcher w/ TUp (+1 Ammo) Drum Magazine",
        "totalBase": 12,
        "damage": "8d6",
        "rof": 1
      },
      {
        "label": "Evasion",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Rocket Launcher w/ TUp (+1 Ammo) Drum Magazine",
        "skillBase": 12,
        "damage": "8d6",
        "rof": 1,
        "mag": 0,
        "skill": "Heavy Weapons"
      }
    ],
    "cyberware": [
      "Cyberarm x2 w/ Hardened Shielding x2"
    ],
    "gear": [
      "Armor-Piercing Rocket x4",
      "Heavy Melee Weapon (ROF2 • 3d6)",
      "Agent",
      "Binoculars",
      "Carryall",
      "Radio Communicator",
      "Techtool",
      "Herakles AV (SEE PAGE 112)"
    ],
    "specialRules": [
      "Habilidad de rol Moto 5 (Nomad).",
      "Rocket Launcher con cargador de tambor TUp (+1 Ammo): ROF 1, 8d6.",
      "Heavy Melee Weapon en el equipo: ROF 2, 3d6.",
      "El Herakles AV del equipo se remite a la p.112 (no se extrajo).",
      "Role Ability: Moto rank 5"
    ],
    "loreSummary": "Too Tall mide casi dos metros, maneja armas pesadas y es un experto naval respetado entre los Aldecaldos, que mueve activos discretamente por agua. Mientras Lucky vuela el AV, él da cobertura con su lanzacohetes favorito.",
    "rep": 3,
    "roleAbility": {
      "name": "Moto",
      "rank": 5
    },
    "skillBases": {
      "Animal Handling": 10,
      "Athletics": 7,
      "Brawling": 11,
      "Concentration": 8,
      "Conversation": 6,
      "Evasion": 10,
      "First Aid": 8,
      "Heavy Weapons": 12,
      "Human Perception": 6,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Night City Harbor)": 7,
      "Melee Weapon": 11,
      "Persuasion": 6,
      "Pilot Sea Vehicle": 12,
      "Sea Vehicle Tech": 10,
      "Stealth": 7,
      "Tracking": 11,
      "Trading": 10,
      "Wilderness Survival": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-arasaka-darius",
    "name": "Darius",
    "subtitle": "Undercover Arasaka Operative",
    "faction": "Arasaka",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 165,
    "role": "Netrunner",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 7,
      "REF": 6,
      "DEX": 6,
      "TECH": 7,
      "COOL": 5,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 4,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
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
        "totalBase": 9
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
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
      "Contraceptive Implant",
      "Cortex Bomb",
      "EMP Threading",
      "Neural Link w/ Interface Plugs x2 & Reflex Co-Processor"
    ],
    "gear": [
      "Basic VH Pistol Ammo x16",
      "Disposable Cell Phone",
      "Photograph",
      "TUp (+1 Slot) Smart Glasses w/ Low Light/Infrared/UV & Virtuality",
      "Cyberdeck w/ Armor, Eraser, Sword, Vrizzbolt & Worm"
    ],
    "specialRules": [
      "Habilidad de rol Interface 4 (Netrunner).",
      "Cyberdeck con Armor, Eraser, Sword, Vrizzbolt y Worm; Neural Link con Interface Plugs x2.",
      "Lleva una Cortex Bomb como cyberware.",
      "El libro imprime con armadura REF 5, DEX 5, MOVE 5.",
      "Role Ability: Interface rank 4"
    ],
    "loreSummary": "Darius es un agente infiltrado de Arasaka criado entre Londres y Chiba, que ve a la corporación como su familia sustituta y busca rastros de sus padres desaparecidos en la Cuarta Guerra Corporativa. Se infiltra en Night City para hurgar en los archivos de la NeoCorp.",
    "rep": 1,
    "roleAbility": {
      "name": "Interface",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 8,
      "Brawling": 8,
      "Bribery": 11,
      "Concentration": 6,
      "Education": 12,
      "Electronics/Security Tech": 12,
      "Evasion": 12,
      "First Aid": 9,
      "Handgun": 14,
      "Human Perception": 10,
      "Language (English)": 11,
      "Language (Japanese)": 11,
      "Language (Streetslang)": 9,
      "Library Search": 13,
      "Lip Reading": 11,
      "Local Expert (Watson Development)": 9,
      "Perception": 9,
      "Persuasion": 10,
      "Resist Torture/Drugs": 10,
      "Stealth": 8,
      "Streetwise": 9
    },
    "isNetrunner": true,
    "interfaceRank": 4,
    "cyberdeckPrograms": [
      "Armor",
      "Eraser",
      "Sword",
      "Vrizzbolt",
      "Worm"
    ]
  },
  {
    "id": "dg-arasaka-nymph",
    "name": "Nymph",
    "subtitle": "Soul-Dead Bodyguard",
    "faction": "Arasaka",
    "threatTier": "mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 166,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 8,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 8,
      "TECH": 4,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 8,
      "BODY": 8,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "EQ Assault Rifle (Excellent Quality)",
        "totalBase": 16,
        "damage": "5d6",
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
        "totalBase": 16
      },
      {
        "label": "Perception",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "EQ Assault Rifle (Excellent Quality)",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "skill": "Shoulder Arms"
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
      "Neural Link w/ Chipware Socket, Kerenzikov, Pain Editor & Reflex Co-Processor"
    ],
    "gear": [
      "Armor-Piercing Rifle Ammo x50",
      "Basic VH Pistol Ammo x8",
      "Anti-Smog Breathing Mask (in helmet)",
      "Disposable Cell Phone",
      "Smart Glasses w/ Low Light/Infrared/UV (in helmet)"
    ],
    "specialRules": [
      "Habilidad de rol Combat Awareness 4 (Solo).",
      "Neural Link con Chipware Socket, Kerenzikov, Pain Editor y Reflex Co-Processor.",
      "El libro imprime con armadura REF 6, DEX 6, MOVE 6.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Nymph fue miembro de la SDU Flying Tigers de Hong Kong; perdió a toda su familia en un ataque de bioterror y quedó vacía, ofreciéndose como músculo a quien pague más. Arasaka la empleó como compañera encubierta de Darius y hace el trabajo sucio sin lealtad real a la corporación.",
    "rep": 1,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 16,
      "Autofire": 16,
      "Brawling": 16,
      "Concentration": 10,
      "Conversation": 5,
      "Education": 7,
      "Endurance": 8,
      "Evasion": 16,
      "First Aid": 12,
      "Handgun": 14,
      "Human Perception": 5,
      "Language (Cantonese)": 9,
      "Language (English)": 7,
      "Language (Streetslang)": 7,
      "Local Expert (Watson Development)": 10,
      "Perception": 12,
      "Persuasion": 6,
      "Resist Torture/Drugs": 12,
      "Shoulder Arms": 16,
      "Stealth": 12,
      "Tactics": 13
    },
    "isNetrunner": false
  },
  {
    "id": "dg-trauma-cazadora",
    "name": "Cazadora",
    "subtitle": "Squad Leader",
    "faction": "Trauma Team Squad NC4-2",
    "threatTier": "hardened_mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 114,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 8,
      "DEX": 7,
      "TECH": 8,
      "COOL": 6,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy SMG (Excellent Quality)",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 7,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 15
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Heavy SMG (Excellent Quality)",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 1,
        "mag": 40,
        "notes": "Impresa como 'EQ Heavy SMG'. · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Heavy Melee Weapon",
        "skillBase": 7,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Melee Weapon no figura en Skill Bases: skillBase = DEX 7. · ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Contraceptive Implant",
      "Enhanced Antibodies",
      "Independent Air Supply",
      "Toxin Binders"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammo x30",
      "Incendiary H Pistol Ammo x30",
      "EMP Grenade",
      "Flashbang Grenade",
      "Agent",
      "Cryopump",
      "Medtech Bag",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Smart Lens w/ Chyron",
      "Trauma Team (Silver)"
    ],
    "specialRules": [
      "Solo: Combat Awareness 4.",
      "Segundo rol Medtech: Medicine 2 (Surgery 1, MedTech [Cryo] 1).",
      "Líder del escuadrón NC4-2 de Trauma Team (membresía Silver).",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Española criada en una familia de cazarrecompensas; tras sobrevivir al derrumbe de un edificio en Night City guió a los supervivientes y se unió a Trauma Team, donde fue ascendida rápido a líder de escuadrón.",
    "rep": 5,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 12,
      "Autofire": 16,
      "Brawling": 15,
      "Bureaucracy": 7,
      "Business": 7,
      "Concentration": 11,
      "Conversation 7 Drive Land Vehicle": 10,
      "Education": 6,
      "Evasion": 15,
      "First Aid": 10,
      "Handgun": 16,
      "Human Perception 9 Language (Spanish)": 12,
      "Language (Streetslang)": 8,
      "Local Expert (Watson Development)": 6,
      "Medical Tech 9 Paramedic": 9,
      "Perception": 6,
      "Personal Grooming": 8,
      "Persuasion": 9,
      "Pilot Air Vehicle": 12,
      "Stealth": 15,
      "Surgery 10 Wardrobe & Style": 10,
      "Wilderness Survival": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-trauma-penitent",
    "name": "Penitent",
    "subtitle": "Squad Gunner",
    "faction": "Trauma Team Squad NC4-2",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 115,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 7,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 6,
      "TECH": 5,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 7,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Pistol (Excellent Quality)",
        "totalBase": 14,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Perception",
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol (Excellent Quality)",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Impresa como 'EQ Heavy Pistol'. · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Neural Link w/ Interface Plugs",
      "Skinwatch"
    ],
    "gear": [
      "Basic H Pistol Ammo x16",
      "Disposable Cell Phone",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Smart Glasses w/ Anti-Dazzle (in helmet)"
    ],
    "specialRules": [
      "Solo: Combat Awareness 4.",
      "Según el lore maneja mejor que Paddles las armas montadas del AV.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Antiguo músculo a sueldo con mala suerte para sus equipos; tras un fiasco en una guerra de bandas fue reclutado por Trauma Team y se unió al escuadrón por Paddles y Cazadora.",
    "rep": 3,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 12,
      "Autofire": 14,
      "Brawling": 8,
      "Concentration": 6,
      "Conversation": 7,
      "Drive Land Vehicle": 10,
      "Education 6 Evasion": 10,
      "First Aid": 11,
      "Handgun": 14,
      "Heavy Weapons": 14,
      "Human Perception": 7,
      "Language (English) 8 Language (Streetslang)": 6,
      "Local Expert (North Heywood)": 6,
      "Perception": 6,
      "Persuasion": 6,
      "Pilot Air Vehicle 10 Stealth": 8,
      "Streetwise": 8,
      "Tactics": 8
    },
    "isNetrunner": false
  },
  {
    "id": "dg-trauma-stick",
    "name": "Stick",
    "subtitle": "Squad Meat Specialist",
    "faction": "Trauma Team Squad NC4-2",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 116,
    "role": "Medtech",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 4,
      "TECH": 8,
      "COOL": 5,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 4,
      "EMP": 6
    },
    "combatBases": [
      {
        "label": "Assault Rifle (Excellent Quality)",
        "totalBase": 13,
        "damage": "5d6",
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
        "totalBase": 12
      },
      {
        "label": "Perception",
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle (Excellent Quality)",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "Impresa como 'EQ Assault Rifle'. Shoulder Arms 13 (12) con armadura. · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 10,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "Brawling 10 (9) con armadura.",
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Contraceptive Implant",
      "Cyberarm",
      "Cyberarm w/ Medscanner"
    ],
    "gear": [
      "Basic Rifle Ammo x25",
      "Agent",
      "Airhypo",
      "Medtech Bag",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Smart Lens w/ Chyron",
      "Trauma Team (Silver)"
    ],
    "specialRules": [
      "Medtech: Medicine 4 (Surgery 3, MedTech [Pharm] 1).",
      "Miembro Silver de Trauma Team.",
      "Role Ability: Medicine rank 4"
    ],
    "loreSummary": "Hermana de Twist, de familia corporativa de origen marroquí; sobrevivió al derrumbe del edificio y volvió a Trauma Team gracias a su tío y a Cazadora. Confía solo en su familia.",
    "rep": 3,
    "roleAbility": {
      "name": "Medicine",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 10,
      "Brawling": 10,
      "Concentration": 12,
      "Conversation": 8,
      "Education": 8,
      "Evasion": 12,
      "First Aid 10 Human Perception": 9,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (Watson Development) 12 Medical Tech": 9,
      "Paramedic": 14,
      "Perception": 12,
      "Persuasion": 7,
      "Resist Torture/Drugs": 12,
      "Shoulder Arms 13 (12) Stealth": 6,
      "Streetwise": 12,
      "Surgery": 14
    },
    "isNetrunner": false
  },
  {
    "id": "dg-trauma-twist",
    "name": "Twist",
    "subtitle": "Squad Metal Specialist",
    "faction": "Trauma Team Squad NC4-2",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 117,
    "role": "Media",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 4,
      "TECH": 8,
      "COOL": 7,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Assault Rifle (Excellent Quality)",
        "totalBase": 13,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Brawling Attack",
        "totalBase": 6,
        "damage": "2d6",
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
        "name": "Assault Rifle (Excellent Quality)",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "Impresa como 'EQ Assault Rifle'. Shoulder Arms 13 (12) con armadura. · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 6,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "Brawling 6 (5) con armadura.",
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Contraceptive Implant",
      "Cyberarm w/ Techscanner",
      "Cyberarm w/ Tool Hand",
      "Techhair"
    ],
    "gear": [
      "Expansive Rifle Ammo x25",
      "Agent",
      "Cryopump",
      "Memory Chip x3",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Smart Lens w/ Chyron",
      "Tech Bag",
      "Trauma Team (Silver)",
      "Video Camera"
    ],
    "specialRules": [
      "Media: Credibility 2.",
      "Segundo rol Medtech: Medicine 2 (MedTech [Cryo] 2).",
      "Antes periodista independiente 'Flashes'; ahora medtech/técnico cibernético de Trauma Team (Silver).",
      "Role Ability: Credibility rank 2"
    ],
    "loreSummary": "Hermano de Stick; fue periodista pop 'Flashes' hasta que destapó al cliente de la demolición y tuvo que esconderse en el escuadrón de su hermana con un nuevo rostro.",
    "rep": 4,
    "roleAbility": {
      "name": "Credibility",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Brawling": 6,
      "Composition": 10,
      "Concentration": 7,
      "Conversation": 10,
      "Cybertech": 12,
      "Deduction 8 Education": 8,
      "Evasion": 12,
      "First Aid": 10,
      "Human Perception": 12,
      "Language (English)": 10,
      "Language (Streetslang) 8 Local Expert (Watson Development)": 8,
      "Medical Tech": 10,
      "Paramedic": 12,
      "Perception": 10,
      "Persuasion 9 Photography/Film": 10,
      "Resist Torture/Drugs": 10,
      "Shoulder Arms": 13,
      "Stealth": 6,
      "Streetwise 12 Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-trauma-rockabye",
    "name": "Rockabye",
    "subtitle": "Squad Pilot",
    "faction": "Trauma Team Squad NC4-2",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 118,
    "role": "Nomad",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 7,
      "DEX": 4,
      "TECH": 7,
      "COOL": 6,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Heavy Pistol (Excellent Quality)",
        "totalBase": 14,
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
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol (Excellent Quality)",
        "skillBase": 14,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Impresa como 'EQ Heavy Pistol'. · ROF/cargador según tabla Core p.94",
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
      "Biomonitor",
      "Contraceptive Implant",
      "Light Tattoo",
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammo x16",
      "Agent",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Smart Lens w/ Chyron",
      "Tech Bag"
    ],
    "specialRules": [
      "Nomad: Moto 4.",
      "Pilota y mecánica del AV-4 del escuadrón.",
      "Role Ability: Moto rank 4"
    ],
    "loreSummary": "Piloto Nomad de la familia Gavilan que entregó los explosivos del derrumbe; carga con culpa y ahora pilotea el AV del escuadrón sin salir apenas de la base.",
    "rep": 3,
    "roleAbility": {
      "name": "Moto",
      "rank": 4
    },
    "skillBases": {
      "Air Vehicle Tech": 13,
      "Athletics": 6,
      "Basic Tech": 11,
      "Brawling": 6,
      "Concentration": 7,
      "Conversation": 7,
      "Drive Land Vehicle 12 Education": 8,
      "Evasion": 12,
      "First Aid": 9,
      "Handgun": 14,
      "Heavy Weapons": 10,
      "Human Perception": 7,
      "Language (Spanish) 10 Language (Streetslang)": 8,
      "Local Expert (Santo Domingo)": 12,
      "Paramedic": 10,
      "Perception": 8,
      "Persuasion 8 Pilot Air Vehicle": 13,
      "Stealth": 6,
      "Wilderness Survival": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-trauma-paddles",
    "name": "Paddles",
    "subtitle": "Squad Crash Cart Specialist",
    "faction": "Trauma Team Squad NC4-2",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 119,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 3,
      "REF": 8,
      "DEX": 6,
      "TECH": 5,
      "COOL": 3,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Heavy Pistol",
        "totalBase": 8,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Stun Baton (Defib Paddle)",
        "totalBase": 12,
        "damage": "2d6",
        "rof": 2
      },
      {
        "label": "Perception",
        "totalBase": 5
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Handgun no figura en Skill Bases: skillBase = REF 8 (6 con armadura). · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Stun Baton (Defib Paddle)",
        "skillBase": 12,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "Melee Weapon 12 (10) con armadura.",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Contraceptive Implant",
      "Medical Grade Cyberarm x2"
    ],
    "gear": [
      "H Pistol Ammo x12",
      "Disposable Cell Phone",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Smart Lens w/ Chyron"
    ],
    "specialRules": [
      "Sin rol. Usa la defibrilladora como arma cuerpo a cuerpo (Stun Baton, 2d6)."
    ],
    "loreSummary": "Médico de choque de origen polaco con labia, que usa el desfibrilador como arma y disfruta rematando; su lealtad parece ser a la violencia más que al equipo.",
    "rep": 2,
    "skillBases": {
      "Athletics": 8,
      "Brawling": 12,
      "Concentration": 5,
      "Conversation": 5,
      "Cybertech": 8,
      "Education": 5,
      "Evasion 8 (6) First Aid": 7,
      "Human Perception": 5,
      "Language (Polish)": 7,
      "Language (Streetslang)": 5,
      "Local Expert (Heywood Industrial Zone) 5 Melee Weapon": 12,
      "Paramedic": 10,
      "Perception": 5,
      "Persuasion": 12,
      "Stealth": 8
    },
    "isNetrunner": false
  },
  {
    "id": "dg-tyger-shinobu-the-second",
    "name": "Shinobu the Second",
    "subtitle": "Leader of the Tyger Claws",
    "faction": "Tyger Claws",
    "threatTier": "hardened_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 122,
    "role": "Solo",
    "hp": 60,
    "seriouslyWounded": 30,
    "deathSave": 12,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 6,
      "REF": 8,
      "DEX": 8,
      "TECH": 7,
      "COOL": 8,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 12,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "TUp (+1 Ammo Type) ConArms Hurricane",
        "totalBase": 16,
        "damage": "5d6",
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
      }
    ],
    "weapons": [
      {
        "name": "TUp (+1 Ammo Type) ConArms Hurricane",
        "skillBase": 16,
        "damage": "5d6",
        "rof": 2,
        "mag": 0,
        "notes": "Se infiere escopeta por su munición (Basic Shotgun Shell / Armor-Piercing Shotgun Slug); Shoulder Arms 16.",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Kendachi Mono-Three",
        "skillBase": 16,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Contraceptive Implant",
      "Cyberaudio Suite w/ Internal Agent",
      "Cyberarm x2 w/ Hardened Shielding x2, Popup Shield x2 & Superchrome® Covering x2",
      "Cybereye w/ Chyron & Color Shift",
      "Cybereye w/ Color Shift & Targeting Scope",
      "Cyberleg x2 w/ Hardened Shielding x2, Jump Booster x2 & Superchrome® Covering x2",
      "EMP Threading",
      "Grafted Muscle and Bone Lace",
      "Implanted Linear Frame Sigma",
      "Neural Link w/ Chipware Socket, Kerenzikov & Pain Editor",
      "Subdermal Armor",
      "Techhair"
    ],
    "gear": [
      "Basic Shotgun Shell Ammo x16",
      "Armor-Piercing Shotgun Slug Ammo x16",
      "Agent",
      "Disposable Cell Phone x2",
      "Kabuki Outfit",
      "Shamisen",
      "Trauma Team (Executive)"
    ],
    "specialRules": [
      "Solo: Combat Awareness 4.",
      "Segundo rol Rockerboy: Charismatic Impact 4.",
      "Cyberware incluye Implanted Linear Frame Sigma, Kerenzikov y Pain Editor (vía Neural Link).",
      "Tiene membresía Trauma Team (Executive).",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Hayato Nakagawa, heredero adoptivo de la Nakagawa Foundation y líder de los Tyger Claws con estilo kabuki; usa cibernética para aplacar el dolor mientras siente que su imperio se desmorona.",
    "rep": 6,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Accounting": 10,
      "Acting": 13,
      "Athletics": 14,
      "Brawling": 14,
      "Bureaucracy": 10,
      "Business": 10,
      "Composition 10 Concentration": 9,
      "Conversation": 8,
      "Dance": 10,
      "Drive Land Vehicle": 10,
      "Education": 10,
      "Evasion": 16,
      "First Aid 9 Human Perception": 4,
      "Language (English)": 8,
      "Language (Japanese)": 10,
      "Language (Streetslang) 8 Local Expert (Kabuki)": 12,
      "Martial Arts (Judo)": 16,
      "Melee Weapon": 16,
      "Paint/Draw/Sculpt": 10,
      "Perception 13 Personal Grooming": 12,
      "Persuasion": 13,
      "Play Instrument (Shamisen)": 10,
      "Play Instrument (Singing) 10 Resist Torture/Drugs": 10,
      "Shoulder Arms": 16,
      "Stealth": 10,
      "Streetwise": 10,
      "Tactics": 12,
      "Wardrobe & Style": 13
    },
    "isNetrunner": false
  },
  {
    "id": "dg-tyger-zen",
    "name": "Zen",
    "subtitle": "Protector on the Rooftops",
    "faction": "Tyger Claws",
    "threatTier": "mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 123,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 5,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 7,
      "TECH": 5,
      "COOL": 6,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Sniper Rifle (Excellent Quality)",
        "totalBase": 15,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Heavy Melee Weapon x2 (Excellent Quality)",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Sniper Rifle (Excellent Quality)",
        "skillBase": 15,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "Impresa como 'EQ Sniper Rifle'. · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Heavy Melee Weapon x2 (Excellent Quality)",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Impresa como 'EQ Heavy Melee Weapon x2'.",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [],
    "gear": [
      "Smart Rifle Ammo x8",
      "Agent",
      "Biwa",
      "Grapple Gun",
      "Smart Glasses w/ Targeting Scope (in helmet)"
    ],
    "specialRules": [
      "Solo: Combat Awareness 4.",
      "Francotirador de apoyo desde los tejados; nunca se quita el casco.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Francotirador enmascarado que protege a Shinobu desde los tejados; tiene una deuda con el Shinobu anterior y un pasado de asesino para Arasaka bajo la identidad de un monje.",
    "rep": 1,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 13,
      "Brawling": 10,
      "Composition": 8,
      "Concentration": 8,
      "Conversation": 6,
      "Education": 10,
      "Evasion 13 First Aid": 7,
      "Forgery": 11,
      "Human Perception": 10,
      "Language (Japanese)": 7,
      "Language (Sanskrit) 7 Language (Streetslang)": 7,
      "Lip Reading": 10,
      "Local Expert (Old Japantown)": 10,
      "Local Expert (Watson Development) 10 Melee Weapon": 13,
      "Paint/Draw/Sculpt": 10,
      "Perception": 7,
      "Persuasion": 10,
      "Play Instrument (Biwa) 10 Play Instrument (Singing)": 10,
      "Resist Torture/Drugs": 14,
      "Shoulder Arms": 15,
      "Stealth": 13,
      "Tracking": 13
    },
    "isNetrunner": false
  },
  {
    "id": "dg-tyger-burai",
    "name": "Burai",
    "subtitle": "Kimen-Gumi Leader",
    "faction": "Tyger Claws",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 124,
    "role": "Solo",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 7,
      "DEX": 7,
      "TECH": 4,
      "COOL": 4,
      "WILL": 7,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol",
        "totalBase": 13,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Very Heavy Melee Weapon (Excellent Quality)",
        "totalBase": 14,
        "damage": "4d6",
        "rof": 1
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
        "name": "Very Heavy Melee Weapon (Excellent Quality)",
        "skillBase": 14,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "notes": "Impresa como 'EQ Very Heavy Melee Weapon'. · ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Neural Link w/ Chipware Socket, Kerenzikov & Skill Chip (Drive Land Vehicle)"
    ],
    "gear": [
      "Basic VH Pistol Ammo x8",
      "EMP Grenade",
      "Flashbang Grenade",
      "Agent",
      "Anti-Smog Breathing Mask",
      "Handcuffs",
      "Radio Communicator",
      "Scrambler/Descrambler",
      "Taiko"
    ],
    "specialRules": [
      "Solo: Combat Awareness 4.",
      "Capitán de Kimen-Gumi, el brazo policial de los Tyger Claws.",
      "Neural Link con Kerenzikov y chip de habilidad Drive Land Vehicle.",
      "Role Ability: Combat Awareness rank 4"
    ],
    "loreSummary": "Takeru Akagi, capitán de Kimen-Gumi, comandante estable y leal a Shinobu pese a presiones internas; sus padres conservan lealtad a Arasaka.",
    "rep": 5,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 12,
      "Brawling": 13,
      "Concentration": 9,
      "Conversation": 6,
      "Criminology": 10,
      "Deduction": 8,
      "Education": 8,
      "Evasion 14 First Aid": 6,
      "Handgun": 13,
      "Human Perception": 6,
      "Language (Japanese)": 9,
      "Language (Streetslang) 7 Local Expert (Kabuki)": 10,
      "Local Expert (Old Japantown)": 7,
      "Martial Arts (Judo)": 14,
      "Melee Weapon": 14,
      "Perception 10 Persuasion": 6,
      "Play Instrument (Taiko)": 9,
      "Stealth": 9
    },
    "isNetrunner": false
  },
  {
    "id": "dg-tyger-wakako",
    "name": "Wakako",
    "subtitle": "Reluctant Confidant",
    "faction": "Tyger Claws",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 125,
    "role": "Medtech",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 4,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 8,
      "REF": 4,
      "DEX": 3,
      "TECH": 7,
      "COOL": 7,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Shotgun w/ Extended Magazine (Excellent Quality)",
        "totalBase": 12,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Heavy Melee Weapon (Excellent Quality)",
        "totalBase": 3,
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
        "name": "Shotgun w/ Extended Magazine (Excellent Quality)",
        "skillBase": 12,
        "damage": "5d6",
        "rof": 1,
        "mag": 0,
        "notes": "Impresa como 'EQ Shotgun w/ Extended Magazine'.",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Heavy Melee Weapon (Excellent Quality)",
        "skillBase": 3,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Impresa como 'EQ Heavy Melee Weapon'. Melee Weapon no figura en Skill Bases: skillBase = DEX 3. · ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Contraceptive Implant",
      "Cybereye w/ Chyron & MicroOptics",
      "Neural Link w/ Interface Plugs",
      "Techhair"
    ],
    "gear": [
      "Armor-Piercing Shotgun Slug Ammo x8",
      "Basic Shotgun Shell Ammo x8",
      "Incendiary Shotgun Shell Ammo x8",
      "Agent",
      "Cryopump",
      "Disposable Cell Phone",
      "Medtech Bag",
      "Techtool"
    ],
    "specialRules": [
      "Medtech: Medicine 4 (MedTech [Pharm] 2, [Cryo] 2).",
      "Confidente de Ryoko Fujiwara; Medtech de laboratorio en Kiroshi.",
      "Role Ability: Medicine rank 4"
    ],
    "loreSummary": "Medtech de origen japonés y viuda de Hiroto, protegida por Shinobu the Second tras la disputa de herencia de la Nakagawa Foundation; rechaza dejar su empleo en Kiroshi.",
    "rep": 3,
    "roleAbility": {
      "name": "Medicine",
      "rank": 4
    },
    "skillBases": {
      "Accounting": 10,
      "Athletics": 5,
      "Basic Tech": 10,
      "Brawling": 6,
      "Concentration": 8,
      "Conversation": 10,
      "Cybertech 10 Education": 12,
      "Evasion": 10,
      "First Aid": 9,
      "Human Perception": 10,
      "Language (English)": 10,
      "Language (Japanese) 12 Language (Streetslang)": 10,
      "Library Search": 10,
      "Local Expert (Watson Development) 10 Local Expert (University District)": 10,
      "Medical Tech": 11,
      "Paramedic": 10,
      "Perception": 10,
      "Personal Grooming 10 Persuasion": 10,
      "Play Instrument (Piano)": 10,
      "Play Instrument (Singing)": 10,
      "Resist Torture/Drugs 10 Science (Biochemistry)": 10,
      "Shoulder Arms": 12,
      "Stealth": 5,
      "Trading": 10,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-tyger-hamada",
    "name": "Hamada",
    "subtitle": "Boss of the Street Vendors",
    "faction": "Tyger Claws",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 126,
    "role": "Fixer",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 7,
    "bodySp": 7,
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
        "label": "Very Heavy Pistol w/ Infrared Nightvision Scope",
        "totalBase": 10,
        "damage": "4d6",
        "rof": 1
      },
      {
        "label": "Heavy Melee Weapon (Excellent Quality)",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol w/ Infrared Nightvision Scope",
        "skillBase": 10,
        "damage": "4d6",
        "rof": 1,
        "mag": 0,
        "skill": "Handgun"
      },
      {
        "name": "Heavy Melee Weapon (Excellent Quality)",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Impresa como 'EQ Heavy Melee Weapon'. · ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Neural Link w/ Chemical Analyzer, Chipware Socket & TUp (+1 Skill LVL) Skill Chip (Language [English])"
    ],
    "gear": [
      "Basic VH Pistol Ammo x16",
      "Agent",
      "Sanshin",
      "Scrambler/Descrambler",
      "Smart Glasses w/ Chyron & Image Enhance"
    ],
    "specialRules": [
      "Fixer: Operator 4.",
      "Jefe de los Tekiya (vendedores callejeros) de Kabuki; su sello de aprobación se exige para abrir un puesto.",
      "Role Ability: Operator rank 4"
    ],
    "loreSummary": "Kouichi Hamada, veterano que enseñó cocina callejera clásica a aprendices y manda sobre los vendedores de Kabuki para los Tyger Claws; devoto budista y chismoso.",
    "rep": 4,
    "roleAbility": {
      "name": "Operator",
      "rank": 4
    },
    "skillBases": {
      "Accounting": 10,
      "Athletics": 7,
      "Business": 8,
      "Concentration": 7,
      "Conversation": 11,
      "Drive Land Vehicle": 10,
      "Education 7 Evasion": 11,
      "First Aid": 6,
      "Handgun": 10,
      "Human Perception": 10,
      "Language (Japanese)": 9,
      "Language (Streetslang) 7 Local Expert (Kabuki)": 10,
      "Melee Weapon": 13,
      "Perception": 7,
      "Persuasion": 10,
      "Play Instrument (Sanshin) 8 Science (Culinary)": 12,
      "Stealth": 7,
      "Streetwise": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-tyger-masa",
    "name": "Masa",
    "subtitle": "Kimen-Gumi Beat Cop",
    "faction": "Tyger Claws",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 127,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 7,
    "bodySp": 8,
    "stats": {
      "INT": 5,
      "REF": 4,
      "DEX": 4,
      "TECH": 4,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 4,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Very Heavy Pistol (Poor Quality)",
        "totalBase": 9,
        "damage": "4d6",
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
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 7
      }
    ],
    "weapons": [
      {
        "name": "Very Heavy Pistol (Poor Quality)",
        "skillBase": 9,
        "damage": "4d6",
        "rof": 1,
        "mag": 8,
        "notes": "Impresa como 'PQ Very Heavy Pistol'. · ROF/cargador según tabla Core p.94",
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
      "Enhanced Antibodies",
      "Toxin Binders"
    ],
    "gear": [
      "Basic VH Pistol Ammo x8",
      "Agent",
      "Anti-Smog Breathing Mask",
      "Flashlight",
      "Handcuffs",
      "Radio Communicator",
      "Road Flare x3"
    ],
    "specialRules": [
      "Sin rol. Agente Kimen-Gumi con buena memoria de rostros del barrio."
    ],
    "loreSummary": "Joven criado en un salón de pachinko de Kabuki y miembro Hanmen de Kimen-Gumi en el escuadrón de Burai; amable y observador.",
    "rep": 2,
    "skillBases": {
      "Athletics": 6,
      "Brawling": 6,
      "Concentration": 6,
      "Conversation": 13,
      "Education": 7,
      "Evasion": 10,
      "First Aid": 6,
      "Gamble 12 Handgun": 9,
      "Human Perception": 7,
      "Interrogation": 6,
      "Language (Japanese)": 9,
      "Language (Streetslang) 7 Local Expert (Kabuki)": 9,
      "Local Expert (Old Japantown)": 7,
      "Melee Weapon": 12,
      "Perception": 7,
      "Persuasion": 6,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-tyger-yasu",
    "name": "Yasu",
    "subtitle": "Fake Otaku Sales Rep",
    "faction": "Tyger Claws",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 128,
    "role": "Fixer",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 3,
    "headSp": 0,
    "bodySp": 11,
    "stats": {
      "INT": 5,
      "REF": 5,
      "DEX": 4,
      "TECH": 4,
      "COOL": 3,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 3,
      "EMP": 5
    },
    "combatBases": [
      {
        "label": "Assault Rifle (Poor Quality)",
        "totalBase": 11,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Brawling Attack",
        "totalBase": 7,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Assault Rifle (Poor Quality)",
        "skillBase": 11,
        "damage": "5d6",
        "rof": 1,
        "mag": 25,
        "notes": "Impresa como 'PQ Assault Rifle'. · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 7,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Neural Link w/ Chipware Socket & TUp (+1 Skill LVL) Skill Chip (Language [Streetslang])",
      "Mr. Studd Sexual Implant"
    ],
    "gear": [
      "Basic Rifle Ammo x25",
      "Agent",
      "Boost",
      "Carryall",
      "Random Anime/Manga Merch",
      "Scrambler/Descrambler",
      "Synthcoke"
    ],
    "specialRules": [
      "Fixer: Operator 2.",
      "Vendedor de Matsura Food Products; importa objetos extra para mercados nocturnos.",
      "Role Ability: Operator rank 2"
    ],
    "loreSummary": "Vendedor de Matsura Food Products que equilibra su lealtad entre los Tyger Claws y su empleador; ahora recibe amenazas de Continental Brands.",
    "rep": 2,
    "roleAbility": {
      "name": "Operator",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Brawling": 7,
      "Business": 10,
      "Concentration": 5,
      "Conversation": 7,
      "Education": 7,
      "Evasion": 10,
      "First Aid 6 Human Perception": 10,
      "Language (Japanese)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (Kabuki)": 9,
      "Perception 7 Persuasion": 5,
      "Pilot Sea Vehicle": 10,
      "Shoulder Arms": 11,
      "Stealth": 6,
      "Trading": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-tyger-shinmai",
    "name": "Shinmai",
    "subtitle": "New Rice",
    "faction": "Tyger Claws",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 129,
    "role": "",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 3,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 2,
      "REF": 5,
      "DEX": 6,
      "TECH": 2,
      "COOL": 3,
      "WILL": 2,
      "LUCK": 0,
      "MOVE": 7,
      "BODY": 3,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon x2 (Poor Quality)",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Heavy Melee Weapon x2 (Poor Quality)",
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
        "totalBase": 6
      }
    ],
    "weapons": [
      {
        "name": "Heavy Melee Weapon x2 (Poor Quality)",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Impresa como 'PQ Heavy Melee Weapon x2'.",
        "skill": "Melee Weapon"
      },
      {
        "name": "Heavy Melee Weapon x2 (Poor Quality)",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Segunda línea idéntica impresa en el libro ('PQ Heavy Melee Weapon x2').",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [],
    "gear": [
      "Anti-Smog Breathing Mask",
      "Bicycle",
      "Disposable Cell Phone",
      "Synthcoke"
    ],
    "specialRules": [
      "Sin rol. Joven recluta entrenado con la espada en el Tyger Dojo."
    ],
    "loreSummary": "Adolescente de Old Japantown reclutado por su habilidad con la espada; apodado 'arroz nuevo' y con admiración por los grandes espadachines.",
    "rep": 0,
    "skillBases": {
      "Athletics": 10,
      "Brawling": 10,
      "Concentration": 4,
      "Conversation": 5,
      "Education": 4,
      "Evasion": 11,
      "First Aid 4 Human Perception": 5,
      "Language (Japanese)": 6,
      "Language (Streetslang)": 4,
      "Local Expert (Old Japantown) 4 Martial Arts (Karate)": 11,
      "Melee Weapon": 13,
      "Perception": 6,
      "Persuasion": 5,
      "Stealth": 13
    },
    "isNetrunner": false
  },
  {
    "id": "dg-tyger-claw-bouncer",
    "name": "Tyger Claw Bouncer",
    "subtitle": "",
    "faction": "Tyger Claws",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 130,
    "role": "",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 7,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 4,
      "REF": 4,
      "DEX": 4,
      "TECH": 2,
      "COOL": 3,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 7,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 12
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
        "skill": "Melee Weapon"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Grafted Muscle and Bone Lace"
    ],
    "gear": [
      "Disposable Cell Phone",
      "Glow Stick",
      "Handcuffs"
    ],
    "specialRules": [
      "Sin rol. Seguridad de clubes, casas de apuestas y mercados diurnos de los Tyger Claws."
    ],
    "loreSummary": "Matón de bajo rango que da protección real a negocios de Kabuki, o rompe mercancía si el vendedor se sale de línea.",
    "rep": 0,
    "skillBases": {
      "Athletics": 6,
      "Brawling": 12,
      "Concentration": 7,
      "Conversation": 6,
      "Education": 6,
      "Evasion": 12,
      "First Aid": 4,
      "Human Perception 10 Language (Native)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (GM’s Choice)": 6,
      "Melee Weapon": 12,
      "Perception 10 Persuasion": 5,
      "Stealth": 6
    },
    "isNetrunner": false
  },
  {
    "id": "dg-tyger-claw-vendor",
    "name": "Tyger Claw Vendor",
    "subtitle": "",
    "faction": "Tyger Claws",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 130,
    "role": "",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 3,
    "headSp": 4,
    "bodySp": 4,
    "stats": {
      "INT": 5,
      "REF": 3,
      "DEX": 3,
      "TECH": 4,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 3,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Medium Pistol (Poor Quality)",
        "totalBase": 10,
        "damage": "2d6",
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
        "totalBase": 10
      }
    ],
    "weapons": [
      {
        "name": "Medium Pistol (Poor Quality)",
        "skillBase": 10,
        "damage": "2d6",
        "rof": 2,
        "mag": 12,
        "notes": "Impresa como 'PQ Medium Pistol'. · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
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
      "Contraceptive Implant",
      "EMP Threading or Light Tattoo"
    ],
    "gear": [
      "Junk M Pistol Ammo x12",
      "Agent",
      "Anti-Smog Breathing Mask",
      "Carryall",
      "Pocket Amplifier"
    ],
    "specialRules": [
      "Sin rol. Dueños de bodegas y carros de comida, miembros por defecto de los Tyger Claws."
    ],
    "loreSummary": "Comerciante callejero que paga sus cuotas a los Tyger Claws y obedece órdenes a cambio de protección.",
    "rep": 0,
    "skillBases": {
      "Athletics": 5,
      "Brawling": 5,
      "Concentration": 6,
      "Conversation": 6,
      "Education": 7,
      "Evasion": 10,
      "First Aid": 6,
      "Handgun 10 Human Perception": 10,
      "Language (Native)": 8,
      "Language (Streetslang)": 7,
      "Local Expert (GM’s Choice)": 8,
      "Perception 10 Persuasion": 10,
      "Stealth": 5,
      "Trading": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-zoners-vanisher",
    "name": "Vanisher",
    "subtitle": "Mysterious Zoner Ally",
    "faction": "Zoners",
    "threatTier": "boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 132,
    "role": "Solo",
    "hp": 50,
    "seriouslyWounded": 25,
    "deathSave": 10,
    "headSp": 12,
    "bodySp": 12,
    "stats": {
      "INT": 7,
      "REF": 8,
      "DEX": 8,
      "TECH": 5,
      "COOL": 6,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 10,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Heavy SMG x2 (Excellent Quality)",
        "totalBase": 16,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Martial Arts Attack",
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
        "totalBase": 12
      }
    ],
    "weapons": [
      {
        "name": "Heavy SMG x2 (Excellent Quality)",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 1,
        "mag": 0,
        "notes": "Listado como 'EQ Heavy SMG x2'; la skill Handgun es la del tipo (SMG) según Skill Bases.",
        "skill": "Handgun"
      },
      {
        "name": "Martial Arts Attack",
        "skillBase": 16,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Ataque marcial; la skill es Martial Arts (Judo) 16.",
        "skill": "Martial Arts (Judo)"
      }
    ],
    "cyberware": [
      "TUp (+1 Slot) Cyberaudio Suite w/ Amplified Hearing, Level Damper, Radio Scanner/Music Player & Scrambler/Descrambler",
      "Cybereye x2 w/ Anti-Dazzle x2 & Image Enhance x2",
      "Gills",
      "Grafted Muscle and Bone Lace",
      "Independent Air Supply",
      "Nasal Filters",
      "Neural Link w/ Chipware Socket, Kerenzikov & Pain Editor",
      "Toxin Binders"
    ],
    "gear": [
      "Armor-Piercing H Pistol Ammo x40",
      "TUp (can trigger on any Critical Injury) Expansive H Pistol Ammo x40",
      "Sleep Grenade x3",
      "Carryall",
      "Disposable Cell Phone",
      "Grapple Gun",
      "Rope (60 m/yds)"
    ],
    "specialRules": [
      "Solo: Combat Awareness 6.",
      "Armadura Light Armorjack mejorada con TUp en cabeza y cuerpo (SP 12 en ambos).",
      "Cyberaudio Suite con TUp (+1 ranura) y varias mejoras; la munición Expansive de pistola pesada lleva una nota TUp ('puede activarse con cualquier Lesión Crítica'), tal cual impresa.",
      "Role Ability: Combat Awareness rank 6"
    ],
    "loreSummary": "Solo misterioso que opera en Night City hace cinco años y trabaja para todas las grandes Corpos; cuida al máximo que su rep sea baja y nunca mata civiles. Hace trabajos de compensación para los Zoners, posiblemente por un fuerte código de honor.",
    "rep": 2,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 6
    },
    "skillBases": {
      "Athletics": 14,
      "Autofire": 16,
      "Basic Tech": 10,
      "Brawling": 10,
      "Conceal/Reveal Object": 12,
      "Concentration": 10,
      "Conversation": 5,
      "Drive Land Vehicle": 14,
      "Education": 9,
      "Electronics/Security Tech": 10,
      "Evasion": 16,
      "First Aid": 12,
      "Handgun": 16,
      "Human Perception": 10,
      "Language (Arapaho)": 11,
      "Language (English)": 9,
      "Language (Spanish)": 9,
      "Language (Streetslang)": 9,
      "Local Expert (Unknown)": 9,
      "Martial Arts (Judo)": 16,
      "Perception": 12,
      "Persuasion": 13,
      "Pilot Air Vehicle": 10,
      "Pilot Sea Vehicle": 10,
      "Resist Torture/Drugs": 10,
      "Stealth": 16,
      "Tracking": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-zoners-tearjerker",
    "name": "Tearjerker",
    "subtitle": "Fire Captain",
    "faction": "Zoners",
    "threatTier": "mini_boss",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 133,
    "role": "Lawman",
    "hp": 55,
    "seriouslyWounded": 28,
    "deathSave": 12,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 7,
      "TECH": 4,
      "COOL": 6,
      "WILL": 6,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 12,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Grenade Launcher",
        "totalBase": 16,
        "damage": "6d6",
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
        "name": "Grenade Launcher",
        "skillBase": 16,
        "damage": "6d6",
        "rof": 1,
        "mag": 2,
        "notes": "w/ TUp (puede mezclar tipos de munición) Drum Mag; skill armor-modificada 14. · ROF/cargador según tabla Core p.94",
        "skill": "Heavy Weapons"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cybereye x2 w/ Low Light/Infrared/UV x2",
      "Grafted Muscle and Bone Lace",
      "Implanted Linear Frame Sigma",
      "Nasal Filters",
      "Toxin Binders"
    ],
    "gear": [
      "Armor-Piercing Grenade x3",
      "Teargas Grenade x3",
      "Agent",
      "Anti-Smog Breathing Mask",
      "Flashlight",
      "Medtech Bag",
      "Radio Communicator",
      "Road Flare x10"
    ],
    "specialRules": [
      "Lawman: Backup 4.",
      "Con la armadura puesta, sus valores modificados son REF 6, DEX 5 y MOVE 4; también bajan sus skills (Athletics 12, Autofire 10, Brawling 12, Drive Land Vehicle 8, Evasion 12, Heavy Weapons 14, Stealth 7).",
      "Su lanzagranadas con TUp puede mezclar tipos de munición y usa Drum Mag; en el último disturbio cambió de granadas de gas lacrimógeno a perforantes.",
      "Role Ability: Backup rank 4"
    ],
    "loreSummary": "Capitana de un cuerpo de bomberos voluntarios de South Night City y ex policía militar de Petrochem. Es parte del liderazgo Zoner; prefiere la paz pero actúa con dureza para proteger a la gente.",
    "rep": 5,
    "roleAbility": {
      "name": "Backup",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 14,
      "Autofire": 12,
      "Brawling": 14,
      "Concentration": 11,
      "Conversation": 6,
      "Deduction": 13,
      "Drive Land Vehicle": 10,
      "Education": 9,
      "Evasion": 14,
      "First Aid": 6,
      "Heavy Weapons": 16,
      "Human Perception": 8,
      "Interrogation": 13,
      "Language (Spanish)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (South Night City)": 11,
      "Paramedic": 10,
      "Perception": 13,
      "Persuasion": 8,
      "Stealth": 9,
      "Tactics": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-zoners-forty-mike-mike",
    "name": "Forty Mike-Mike",
    "subtitle": "MP Turned Firefighter",
    "faction": "Zoners",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 134,
    "role": "Lawman",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 8,
    "headSp": 13,
    "bodySp": 13,
    "stats": {
      "INT": 5,
      "REF": 8,
      "DEX": 6,
      "TECH": 5,
      "COOL": 5,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 8,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Tearjerker w/ Drum Mag",
        "totalBase": 14,
        "damage": "—",
        "rof": 1
      },
      {
        "label": "Brawling Attack",
        "totalBase": 8,
        "damage": "3d6",
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
        "name": "Tearjerker w/ Drum Mag",
        "skillBase": 14,
        "damage": "—",
        "rof": 1,
        "mag": 0,
        "notes": "TUp (+1 Slot); el libro imprime '—' en el daño; skill armor-modificada 12.",
        "skill": "Heavy Weapons"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 8,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Brawling armor-modificado 6.",
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Cybereye x2 w/ Low Light/Infrared/UV x2",
      "Grafted Muscle and Bone Lace",
      "Nasal Filters"
    ],
    "gear": [
      "Armor-Piercing Grenade x2",
      "Smoke Grenade x6",
      "Agent",
      "Anti-Smog Breathing Mask",
      "Carryall",
      "Flashlight",
      "Medtech Bag",
      "Radio Communicator",
      "Road Flare x10"
    ],
    "specialRules": [
      "Lawman: Backup 4.",
      "Con la armadura puesta: REF 6, DEX 4, MOVE 3; skills Athletics 11, Brawling 6, Drive Land Vehicle 10, Evasion 11, Heavy Weapons 12, Stealth 6.",
      "Su arma 'Tearjerker' (TUp, +1 ranura) usa Drum Mag; el daño no está impreso.",
      "Role Ability: Backup rank 4"
    ],
    "loreSummary": "Cofundadora y segunda al mando del cuerpo de bomberos voluntario de South Night City, ex policía militar en la 4.ª Guerra Corporativa. Su verdadero talento es entrenar y organizar a bomberos y Zoners.",
    "rep": 4,
    "roleAbility": {
      "name": "Backup",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 13,
      "Brawling": 8,
      "Concentration": 6,
      "Conversation": 8,
      "Drive Land Vehicle": 12,
      "Education": 10,
      "Endurance": 10,
      "Evasion": 13,
      "First Aid": 12,
      "Heavy Weapons": 14,
      "Human Perception": 9,
      "Land Vehicle Tech": 10,
      "Language (English)": 9,
      "Language (Streetslang)": 7,
      "Local Expert (South Night City)": 10,
      "Perception": 10,
      "Persuasion": 12,
      "Stealth": 8
    },
    "isNetrunner": false
  },
  {
    "id": "dg-zoners-mister-studd",
    "name": "Mister Studd",
    "subtitle": "Braindance Bon Vivant",
    "faction": "Zoners",
    "threatTier": "hardened_lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 135,
    "role": "Rockerboy",
    "hp": 45,
    "seriouslyWounded": 23,
    "deathSave": 8,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 7,
      "DEX": 7,
      "TECH": 3,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 8,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Shotgun (Excellent Quality)",
        "totalBase": 13,
        "damage": "5d6",
        "rof": 1
      },
      {
        "label": "Brawling Attack",
        "totalBase": 12,
        "damage": "3d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Shotgun (Excellent Quality)",
        "skillBase": 13,
        "damage": "5d6",
        "rof": 1,
        "mag": 4,
        "notes": "Listado como 'EQ Shotgun'. · ROF/cargador según tabla Core p.94",
        "skill": "Shoulder Arms"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Biomonitor",
      "Chemskin",
      "Contraceptive Implant",
      "Enhanced Antibodies",
      "TUp Mr. Studd Sexual Implant",
      "Neural Link w/ Braindance Recorder"
    ],
    "gear": [
      "Armor-Piercing Shotgun Slug Ammo x8",
      "Agent",
      "Anti-Smog Breathing Mask",
      "Computer",
      "Boost x2",
      "Blue Glass x2",
      "Braindance Viewer",
      "Smash x5",
      "Synthcoke x2"
    ],
    "specialRules": [
      "Rockerboy: Charismatic Impact 4.",
      "Implante sexual 'Mr. Studd' con TUp (sin descripción de efectos en el libro).",
      "Neural Link con Braindance Recorder: graba sus performances.",
      "Role Ability: Charismatic Impact rank 4"
    ],
    "loreSummary": "Cabeza de una troupe de porno artístico (braindance) que vive en 'The Lair', un piso entero de un edificio de South Night City. También es hábil con escopetas y defendió el edificio de una banda enviada por Zhirafa.",
    "rep": 5,
    "roleAbility": {
      "name": "Charismatic Impact",
      "rank": 4
    },
    "skillBases": {
      "Acting": 8,
      "Athletics": 13,
      "Brawling": 12,
      "Contortionist": 10,
      "Conversation": 8,
      "Education": 8,
      "Evasion": 13,
      "First Aid": 7,
      "Human Perception": 10,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (The Glen)": 6,
      "Local Expert (South Night City)": 6,
      "Perception": 8,
      "Personal Grooming": 10,
      "Persuasion": 10,
      "Photography/Film": 10,
      "Resist Torture/Drugs": 10,
      "Shoulder Arms": 13,
      "Stealth": 9,
      "Wardrobe & Style": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-zoners-freefall",
    "name": "Freefall",
    "subtitle": "Creating a Movement",
    "faction": "Zoners",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 136,
    "role": "Netrunner",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 5,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 4,
      "DEX": 6,
      "TECH": 6,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 5,
      "EMP": 4
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
        "totalBase": 8,
        "damage": "2d6",
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
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Rubber VH Pistol Ammo x8",
      "Smoke Grenade",
      "Teargas Grenade",
      "Agent",
      "Anti-Smog Breathing Mask",
      "Carryall",
      "Virtuality Goggles",
      "PQ Cyberdeck w/ Armor, Eraser, Sword, Worm & Hardened Circuitry"
    ],
    "specialRules": [
      "Netrunner: Interface 4.",
      "Cyberdeck de calidad pobre (PQ) con Hardened Circuitry y los programas Armor, Eraser, Sword y Worm.",
      "Su pasamontañas tiene filtro de gas (equivale a máscara anti-smog) para lanzar granadas de humo sin afectarse.",
      "Role Ability: Interface rank 4"
    ],
    "loreSummary": "Activista nativo de South Night City, líder del movimiento Zoner y redactor de buena parte de su propaganda; hábil con pistolas pero defiende soluciones no violentas. Hermano de Drop, miembro de Maelstrom.",
    "rep": 3,
    "roleAbility": {
      "name": "Interface",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 13,
      "Brawling": 8,
      "Composition": 10,
      "Conceal/Reveal Object": 8,
      "Concentration": 9,
      "Conversation": 6,
      "Cybertech": 10,
      "Education": 11,
      "Electronics/Security Tech": 10,
      "Evasion": 10,
      "First Aid": 8,
      "Handgun": 13,
      "Human Perception": 9,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Library Search": 11,
      "Local Expert (South Night City)": 8,
      "Perception": 12,
      "Persuasion": 10,
      "Stealth": 10
    },
    "isNetrunner": true,
    "interfaceRank": 4,
    "cyberdeckPrograms": [
      "Armor",
      "Eraser",
      "Sword",
      "Worm"
    ]
  },
  {
    "id": "dg-zoners-nemo",
    "name": "Nemo",
    "subtitle": "AWOL Soldier Turned Activist",
    "faction": "Zoners",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 137,
    "role": "Solo",
    "hp": 35,
    "seriouslyWounded": 18,
    "deathSave": 6,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 4,
      "REF": 6,
      "DEX": 6,
      "TECH": 4,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 5,
      "BODY": 6,
      "EMP": 3
    },
    "combatBases": [
      {
        "label": "Heavy SMG (Poor Quality)",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Light Melee Weapon",
        "totalBase": 13,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 13
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Heavy SMG (Poor Quality)",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 1,
        "mag": 40,
        "notes": "Listado como 'PQ Heavy SMG'. · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Light Melee Weapon",
        "skillBase": 13,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Medical Grade Cyberarm x2",
      "Neural Link w/ Chipware Socket & TUp (+1 Skill LVL) Skill Chip (Language [Spanish])"
    ],
    "gear": [
      "Basic H Pistol Ammo x40",
      "Agent",
      "Carryall",
      "Inflatable Bed & Sleep-bag",
      "Tent & Camping Equipment"
    ],
    "specialRules": [
      "Solo: Combat Awareness 3 y Fixer: Operator 1 (dos habilidades de rol impresas).",
      "Skill Chip de Language (Spanish) con TUp (+1 nivel de skill).",
      "Role Ability: Combat Awareness rank 3"
    ],
    "loreSummary": "Soldado que desertó de su unidad al mes de la 4.ª Guerra Corporativa y fue dado por muerto. Vive en ciudades de tiendas de South Night City y hoy hace trabajos pequeños de seguridad y escolta.",
    "rep": 1,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 3
    },
    "skillBases": {
      "Accounting": 11,
      "Athletics": 11,
      "Autofire": 14,
      "Brawling": 8,
      "Business": 11,
      "Concentration": 6,
      "Conversation": 5,
      "Education": 8,
      "Evasion": 13,
      "First Aid": 6,
      "Handgun": 13,
      "Human Perception": 7,
      "Language (English)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (South Night City)": 8,
      "Melee Weapon": 13,
      "Perception": 8,
      "Persuasion": 6,
      "Stealth": 11,
      "Tactics": 7,
      "Trading": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-zoners-speed-demon",
    "name": "Speed Demon",
    "subtitle": "She's a Demon on Wheels",
    "faction": "Zoners",
    "threatTier": "lieutenant",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 138,
    "role": "Nomad",
    "hp": 40,
    "seriouslyWounded": 20,
    "deathSave": 6,
    "headSp": 11,
    "bodySp": 11,
    "stats": {
      "INT": 4,
      "REF": 8,
      "DEX": 4,
      "TECH": 4,
      "COOL": 5,
      "WILL": 5,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 6,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy SMG",
        "totalBase": 13,
        "damage": "3d6",
        "rof": 1
      },
      {
        "label": "Medium Melee Weapon",
        "totalBase": 8,
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
        "name": "Heavy SMG",
        "skillBase": 13,
        "damage": "3d6",
        "rof": 1,
        "mag": 40,
        "notes": "ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
      },
      {
        "name": "Medium Melee Weapon",
        "skillBase": 8,
        "damage": "2d6",
        "rof": 2,
        "mag": 0,
        "notes": "ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      }
    ],
    "cyberware": [
      "Contraceptive Implant",
      "Neural Link w/ Interface Plugs"
    ],
    "gear": [
      "Basic H Pistol Ammo x80",
      "Agent",
      "Bug Detector",
      "Radio Communicator",
      "Techtool",
      "Roadbike w/ NOS x2",
      "Diego Motors Chupacabra (ver p. 139)"
    ],
    "specialRules": [
      "Nomad: Moto 4.",
      "Su Roadbike lleva dos sistemas NOS.",
      "El libro la lista con un Diego Motors Chupacabra (descrito en p.139, fuera de esta ficha): Compact Groundcar con Combat Plow, NOS, Heavy Chassis y Seating Upgrade.",
      "Role Ability: Moto rank 4"
    ],
    "loreSummary": "Conductora excepcional de los Jodes enviada a South Night City como enlace con los Zoners; irrumpió en un bloqueo policial para facilitar su escape. Gran parte del dinero de su Pack sale de carreras callejeras que ella gana.",
    "rep": 3,
    "roleAbility": {
      "name": "Moto",
      "rank": 4
    },
    "skillBases": {
      "Athletics": 10,
      "Autofire": 13,
      "Brawling": 6,
      "Concentration": 7,
      "Conversation": 10,
      "Drive Land Vehicle": 12,
      "Education": 6,
      "Evasion": 10,
      "First Aid": 6,
      "Handgun": 13,
      "Human Perception": 10,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Local Expert (Old Combat Zone)": 8,
      "Melee Weapon": 8,
      "Perception": 10,
      "Persuasion": 10,
      "Streetwise": 8,
      "Trading": 10,
      "Wilderness Survival": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-zoners-alpha",
    "name": "Alpha",
    "subtitle": "Smart Scavver",
    "faction": "Zoners",
    "threatTier": "hardened_mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 140,
    "role": "Solo",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 3,
    "headSp": 7,
    "bodySp": 11,
    "stats": {
      "INT": 6,
      "REF": 6,
      "DEX": 3,
      "TECH": 5,
      "COOL": 5,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 6,
      "BODY": 3,
      "EMP": 1
    },
    "combatBases": [
      {
        "label": "Heavy Pistol (Poor Quality)",
        "totalBase": 10,
        "damage": "3d6",
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
        "totalBase": 5
      },
      {
        "label": "Perception",
        "totalBase": 9
      }
    ],
    "weapons": [
      {
        "name": "Heavy Pistol (Poor Quality)",
        "skillBase": 10,
        "damage": "3d6",
        "rof": 2,
        "mag": 8,
        "notes": "Listado como 'PQ Heavy Pistol'. · ROF/cargador según tabla Core p.94",
        "skill": "Handgun"
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
      "Contraceptive Implant",
      "Enhanced Antibodies"
    ],
    "gear": [
      "Basic H Pistol Ammo x16",
      "Disposable Cell Phone x2",
      "Random Piece of Still Bloody Cyberware",
      "Techtool"
    ],
    "specialRules": [
      "Solo: Combat Awareness 2.",
      "Armadura de cuerpo 'Scavenged Armor' SP 11, mejor que su casco Kevlar® (SP 7).",
      "Role Ability: Combat Awareness rank 2"
    ],
    "loreSummary": "Carroñero astuto de South Night City que merodea los combates, aprende cómo operan los ganadores y vende cromo arrancado a los muertos. Anda con los Zoners para saquear tras las represiones.",
    "rep": 1,
    "roleAbility": {
      "name": "Combat Awareness",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 5,
      "Basic Tech": 10,
      "Brawling": 5,
      "Bribery": 7,
      "Concentration": 6,
      "Conversation": 3,
      "Education": 8,
      "Evasion": 5,
      "First Aid": 7,
      "Handgun": 10,
      "Human Perception": 5,
      "Language (Italian)": 10,
      "Language (Streetslang)": 8,
      "Local Expert (South Night City)": 10,
      "Paramedic": 7,
      "Perception": 9,
      "Persuasion": 7,
      "Stealth": 5,
      "Streetwise": 10,
      "Trading": 10
    },
    "isNetrunner": false
  },
  {
    "id": "dg-zoners-blaze",
    "name": "Blaze",
    "subtitle": "Corp Double Agent",
    "faction": "Zoners",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 141,
    "role": "Exec",
    "hp": 25,
    "seriouslyWounded": 13,
    "deathSave": 3,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 5,
      "REF": 3,
      "DEX": 5,
      "TECH": 5,
      "COOL": 3,
      "WILL": 3,
      "LUCK": 0,
      "MOVE": 4,
      "BODY": 3,
      "EMP": 2
    },
    "combatBases": [
      {
        "label": "Light Melee Weapon",
        "totalBase": 5,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Brawling Attack",
        "totalBase": 7,
        "damage": "1d6",
        "rof": 2
      },
      {
        "label": "Evasion",
        "totalBase": 9
      },
      {
        "label": "Perception",
        "totalBase": 9
      }
    ],
    "weapons": [
      {
        "name": "Light Melee Weapon",
        "skillBase": 5,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "notes": "Melee Weapon no está en Skill Bases; skillBase = DEX (5). · ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
      },
      {
        "name": "Brawling Attack",
        "skillBase": 7,
        "damage": "1d6",
        "rof": 2,
        "mag": 0,
        "skill": "Brawling"
      }
    ],
    "cyberware": [
      "Subdermal Pocket"
    ],
    "gear": [
      "Armor-Piercing Grenade x2",
      "Molotov Cocktail",
      "Smoke Grenade",
      "Agent",
      "Carryall",
      "Disposable Cell Phone",
      "Duct Tape",
      "Techtool"
    ],
    "specialRules": [
      "Exec: Teamwork 2.",
      "Role Ability: Teamwork rank 2"
    ],
    "loreSummary": "Ex empleado de Militech nacido en Canadá, degradado y ahora espía corporativo infiltrado en los Zoners; es pirómano. Un Zoner lo vigila haciéndose pasar por su novio.",
    "rep": 1,
    "roleAbility": {
      "name": "Teamwork",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 11,
      "Brawling": 7,
      "Business": 7,
      "Concentration": 5,
      "Conversation": 4,
      "Demolitions": 10,
      "Evasion": 9,
      "First Aid": 7,
      "Human Perception": 4,
      "Language (English)": 9,
      "Language (French)": 7,
      "Language (Streetslang)": 9,
      "Library Search": 7,
      "Local Expert (South Night City)": 7,
      "Perception": 9,
      "Persuasion": 7,
      "Science (Chemistry)": 9,
      "Stealth": 11
    },
    "isNetrunner": false
  },
  {
    "id": "dg-zoners-wrecker",
    "name": "Wrecker",
    "subtitle": "Student? Activist? Journalist?",
    "faction": "Zoners",
    "threatTier": "mook",
    "sourceBook": "danger_gal",
    "sourceBookTitle": "Danger Gal Dossier",
    "era": "2045",
    "format": "red",
    "sourcePage": 142,
    "role": "Media",
    "hp": 30,
    "seriouslyWounded": 15,
    "deathSave": 4,
    "headSp": 7,
    "bodySp": 7,
    "stats": {
      "INT": 4,
      "REF": 3,
      "DEX": 4,
      "TECH": 3,
      "COOL": 4,
      "WILL": 4,
      "LUCK": 0,
      "MOVE": 3,
      "BODY": 4,
      "EMP": 4
    },
    "combatBases": [
      {
        "label": "Heavy Melee Weapon (Poor Quality)",
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
        "totalBase": 10
      },
      {
        "label": "Perception",
        "totalBase": 8
      }
    ],
    "weapons": [
      {
        "name": "Heavy Melee Weapon (Poor Quality)",
        "skillBase": 12,
        "damage": "3d6",
        "rof": 2,
        "mag": 0,
        "notes": "Listado como 'PQ Heavy Melee Weapon' (una palanca). · ROF/cargador según tabla Core p.92",
        "skill": "Melee Weapon"
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
      "Cybereye w/ MicroVideo",
      "EMP Threading"
    ],
    "gear": [
      "Smoke Grenade",
      "Agent",
      "Anti-Smog Breathing Mask",
      "Computer",
      "Memory Chips x5"
    ],
    "specialRules": [
      "Media: Credibility 2.",
      "Cybereye con MicroVideo: sospechan que graba las transmisiones de 'Syndrome'.",
      "Role Ability: Credibility rank 2"
    ],
    "loreSummary": "Scarlet Harris, estudiante de periodismo y ciencias políticas en la universidad de Night City que apoya a los Zoners en secreto; se sospecha que es la media Syndrome. Con su palanca dejó 'destrozados' a varios policías.",
    "rep": 2,
    "roleAbility": {
      "name": "Credibility",
      "rank": 2
    },
    "skillBases": {
      "Athletics": 6,
      "Brawling": 6,
      "Composition": 8,
      "Concentration": 6,
      "Conversation": 7,
      "Education": 8,
      "Evasion": 10,
      "First Aid": 5,
      "Human Perception": 8,
      "Language (English)": 8,
      "Language (Streetslang)": 6,
      "Lip Reading": 6,
      "Local Expert (South Night City)": 6,
      "Local Expert (University District)": 6,
      "Melee Weapon": 12,
      "Perception": 8,
      "Persuasion": 6,
      "Photography/Film": 10,
      "Stealth": 6
    },
    "isNetrunner": false
  }
];
