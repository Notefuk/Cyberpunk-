// ============================================================================
// CEMK FOLIO PREMADES DATA (Cyberpunk: Edgerunners Mission Kit - 2077)
// Oficial de las 28 páginas de CEMK-Edgerunners-Character-Folios-Letter_2024-05-22.pdf
// Conversión 100% canónica de los 7 personajes oficiales:
// Hardpoint (Solo), Wrench (Nomad), Connect (Fixer), Bluescreen (Netrunner),
// Insurance (Medtech), Thorn (Rockerboy), Maven (Tech)
// ============================================================================

import type {
  CharacterSheet
} from '../types/cyberpunk';

export interface CemkSkillEntry {
  name: string;
  stat: string;
  lvl: number;
  lvlStr?: string;
  base: number;
}

export interface CemkFolioMetadata {
  id: string;
  name: string;
  handle: string;
  role: string;
  archetype2077: string;
  icon: string;
  tokenUrl: string;
  roleAbilitySummary: string;
  combatStyle: string;
  equipmentSummary: string[];
  backstory: string;
  fullSkillsTable: CemkSkillEntry[];
}

// ----------------------------------------------------------------------------
// 1. METADATA DETALLADA DE CADA FOLIO
// ----------------------------------------------------------------------------
export const CEMK_FOLIO_METADATA_MAP: Record<string, CemkFolioMetadata> = {
  'cemk-folio-hardpoint': {
    "id": "cemk-folio-hardpoint",
    "name": "Hardpoint",
    "handle": "Hardpoint [CEMK Folio]",
    "role": "Solo",
    "archetype2077": "Ciber-Soldado Táctico / Asalto Power & Mantis Blades",
    "icon": "Crosshair",
    "tokenUrl": "./tokens/cemk/hardpoint.png",
    "roleAbilitySummary": "Combat Awareness Rango 4 (+4 Iniciativa reactiva instantánea permanente)",
    "combatStyle": "Power Weapon Specialist & Ciberarmas Mantis Monomoleculares",
    "equipmentSummary": [
        "Arasaka HJSH-18 Masamune (Assault Rifle 5d6 Power • Autofire x4)",
        "Arasaka Mantis Blade Cyberarm (Heavy Melee 3d6 ROF 2 • +1 Ataque)",
        "Moore Tech Berserk Implant (Inmunidad a Heridas Graves/Mortales 60s)",
        "Neuroport 2077 Suite Universal (Holophone, Biomonitor, Virtu, HUD, Shards, Personal Link)",
        "Light Armorjack Blindaje Ligero (Cabeza SP 11, Cuerpo SP 11)"
    ],
    "backstory": "Hardpoint es un mercenario curtido y profesional, entrenado con disciplina militar y optimizado con biotecnología de combate. Equipado con un brazo cibernético con Mantis Blade integrada y un acelerador hormonal Moore Tech Berserk, domina las distancias largas con su fusil de asalto Masamune y descuartiza en combate cerrado.",
    "fullSkillsTable": [
        {
            "name": "Conceal/Reveal",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Lip Reading",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Perception",
            "stat": "INT",
            "lvl": 5,
            "lvlStr": "5",
            "base": 11
        },
        {
            "name": "Tracking",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Athletics",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Contortionist",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Dance",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Endurance",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Resist Torture/Drugs",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Stealth",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Swimming",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Drive Land Vehicle",
            "stat": "REF",
            "lvl": 4,
            "lvlStr": "4",
            "base": 11
        },
        {
            "name": "Pilot Air Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Pilot Sea Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Riding",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Accounting",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Animal Handling",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Bureaucracy",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Business",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Composition",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Criminology",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Cryptography",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Deduction",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Education",
            "stat": "INT",
            "lvl": 5,
            "lvlStr": "5",
            "base": 11
        },
        {
            "name": "Gamble",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Language (Streetslang)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Language (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Library Search",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Local Expert (Your Home)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Science (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Tactics",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Wilderness Survival",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Brawling",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Evasion",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Martial Arts",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Melee Weapon",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Acting",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Play Instrument",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Archery",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Autofire",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Handgun",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Heavy Weapons",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Shoulder Arms",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Bribery",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Conversation",
            "stat": "EMP",
            "lvl": 2,
            "lvlStr": "2",
            "base": 7
        },
        {
            "name": "Human Perception",
            "stat": "EMP",
            "lvl": 5,
            "lvlStr": "5",
            "base": 10
        },
        {
            "name": "Interrogation",
            "stat": "COOL",
            "lvl": 4,
            "lvlStr": "4",
            "base": 11
        },
        {
            "name": "Persuasion",
            "stat": "COOL",
            "lvl": 4,
            "lvlStr": "4",
            "base": 11
        },
        {
            "name": "Personal Grooming",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Streetwise",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Trading",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Wardrobe & Style",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Air Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Basic Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Cybertech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Demolitions",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Electronics/Security",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "First Aid",
            "stat": "TECH",
            "lvl": 6,
            "lvlStr": "6",
            "base": 11
        },
        {
            "name": "Forgery",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Land Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Paint/Draw/Sculpt",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Paramedic",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Photography/Film",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Pick Lock",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Pick Pocket",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Sea Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Weaponstech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        }
    ]
},
  'cemk-folio-wrench': {
    "id": "cemk-folio-wrench",
    "name": "Wrench",
    "handle": "Wrench [CEMK Folio]",
    "role": "Nomad",
    "archetype2077": "Mecánica del Páramo / Fuerza Bruta & Escopeta Inteligente",
    "icon": "Wrench",
    "tokenUrl": "./tokens/cemk/wrench.png",
    "roleAbilitySummary": "Moto Rango 4 (+4 permanente a Conducir Vehículo Terrestre ya aplicado)",
    "combatStyle": "Smart Weapon Tracking & Fuerza Bruta Gorilla Arms (BODY 11)",
    "equipmentSummary": [
        "Kang Tao L-69 Zhuo (Smart Shotgun 4d6 Smart • 8 perdigones/disparo)",
        "Gorilla Cyberarms x2 (Heavy Melee 3d6 • Manejo de armas 2 manos en 1 sola mano)",
        "Militech Subdermal Grip (Enlace de palma Smart Link a Neuroport)",
        "Villefort Columbus V340-F Freight (Furgoneta de transporte blindada nómada)",
        "Light Armorjack Blindaje Ligero (Cabeza SP 11, Cuerpo SP 11)"
    ],
    "backstory": "Wrench creció en los convoyes de las Badlands entre olor a gasolina, motores sobrealimentados y asaltos de clanes rivales. Con dos ciberbrazos Gorilla reforzados que le otorgan la fuerza de BODY 11 para forzar compuertas y empuñar escopetas pesadas con una mano, pilota su furgoneta Villefort Columbus y destroza enemigos con perdigones teledirigidos Smart.",
    "fullSkillsTable": [
        {
            "name": "Conceal/Reveal",
            "stat": "INT",
            "lvl": 5,
            "lvlStr": "5",
            "base": 10
        },
        {
            "name": "Lip Reading",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Perception",
            "stat": "INT",
            "lvl": 3,
            "lvlStr": "3",
            "base": 8
        },
        {
            "name": "Tracking",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Athletics",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Contortionist",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Dance",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 13
        },
        {
            "name": "Endurance",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Resist Torture/Drugs",
            "stat": "WILL",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Stealth",
            "stat": "DEX",
            "lvl": 4,
            "lvlStr": "4",
            "base": 12
        },
        {
            "name": "Swimming",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Drive Land Vehicle",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6 + 4",
            "base": 16
        },
        {
            "name": "Pilot Air Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Pilot Sea Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Riding",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Accounting",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Animal Handling",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Bureaucracy",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Business",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Composition",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Criminology",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Cryptography",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Deduction",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Education",
            "stat": "INT",
            "lvl": 6,
            "lvlStr": "6",
            "base": 11
        },
        {
            "name": "Gamble",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Language (Streetslang)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Language (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Library Search",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Local Expert (Your Home)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Science (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Tactics",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Wilderness Survival",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Brawling",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Evasion",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Martial Arts",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Melee Weapon",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Acting",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Play Instrument",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Archery",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Autofire",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Handgun",
            "stat": "REF",
            "lvl": 4,
            "lvlStr": "4",
            "base": 10
        },
        {
            "name": "Heavy Weapons",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Shoulder Arms",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6",
            "base": 12
        },
        {
            "name": "Bribery",
            "stat": "COOL",
            "lvl": 5,
            "lvlStr": "5",
            "base": 12
        },
        {
            "name": "Conversation",
            "stat": "EMP",
            "lvl": 4,
            "lvlStr": "4",
            "base": 9
        },
        {
            "name": "Human Perception",
            "stat": "EMP",
            "lvl": 2,
            "lvlStr": "2",
            "base": 7
        },
        {
            "name": "Interrogation",
            "stat": "COOL",
            "lvl": 3,
            "lvlStr": "3",
            "base": 10
        },
        {
            "name": "Persuasion",
            "stat": "COOL",
            "lvl": 4,
            "lvlStr": "4",
            "base": 11
        },
        {
            "name": "Personal Grooming",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Streetwise",
            "stat": "COOL",
            "lvl": 2,
            "lvlStr": "2",
            "base": 9
        },
        {
            "name": "Trading",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Wardrobe & Style",
            "stat": "COOL",
            "lvl": 3,
            "lvlStr": "3",
            "base": 10
        },
        {
            "name": "Air Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Basic Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Cybertech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Demolitions",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Electronics/Security",
            "stat": "TECH",
            "lvl": 6,
            "lvlStr": "6",
            "base": 10
        },
        {
            "name": "First Aid",
            "stat": "TECH",
            "lvl": 4,
            "lvlStr": "4",
            "base": 8
        },
        {
            "name": "Forgery",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Land Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Paint/Draw/Sculpt",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Paramedic",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Photography/Film",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Pick Lock",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Pick Pocket",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Sea Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Weaponstech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        }
    ]
},
  'cemk-folio-connect': {
    "id": "cemk-folio-connect",
    "name": "Connect",
    "handle": "Connect [CEMK Folio]",
    "role": "Fixer",
    "archetype2077": "Broker de Alto Nivel / Pistolas Tech Gemelas & Ojos Kiroshi",
    "icon": "Coins",
    "tokenUrl": "./tokens/cemk/connect.png",
    "roleAbilitySummary": "Operator Rango 4 (+4 permanente a Negociación/Trading ya aplicado en Base 18)",
    "combatStyle": "Dual Tech Pistols (Disparos Cargados a través de cobertura) & Cuchillo",
    "equipmentSummary": [
        "Militech M-76e Omaha x2 (Heavy Tech Pistol 3d6 • Disparo Cargado ignora 50% SP)",
        "Large Knife (Medium Melee 2d6 ROF 2 • Ocultable)",
        "Kiroshi Starlight Eyes (Visión nocturna total en oscuridad)",
        "Dynalar Voice Stress Analyzer (Detector de mentiras humano, +2 Human Perception)",
        "Fashion Upgrades (Tatuajes de luz y EMP threading, +2 Wardrobe & Style)",
        "Light Armorjack Blindaje Ligero (Cabeza SP 11, Cuerpo SP 11)"
    ],
    "backstory": "Connect es el intermediario definitivo en los círculos corporativos y callejeros de Night City. Impecable, persuasivo y letalmente equipado con ojos cibernéticos Kiroshi Starlight, analizador de tensión vocal y dos pistolas electromagnéticas Tech Militech Omaha que perforan paredes delgadas y blindajes corporativos.",
    "fullSkillsTable": [
        {
            "name": "Conceal/Reveal",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Lip Reading",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Perception",
            "stat": "INT",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Tracking",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Athletics",
            "stat": "DEX",
            "lvl": 4,
            "lvlStr": "4",
            "base": 10
        },
        {
            "name": "Contortionist",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Dance",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 11
        },
        {
            "name": "Endurance",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Resist Torture/Drugs",
            "stat": "WILL",
            "lvl": 4,
            "lvlStr": "4",
            "base": 11
        },
        {
            "name": "Stealth",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 11
        },
        {
            "name": "Swimming",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Drive Land Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Pilot Air Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Pilot Sea Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Riding",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Accounting",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Animal Handling",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Bureaucracy",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Business",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Composition",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Criminology",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Cryptography",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Deduction",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Education",
            "stat": "INT",
            "lvl": 7,
            "lvlStr": "7",
            "base": 15
        },
        {
            "name": "Gamble",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Language (Streetslang)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Language (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Library Search",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Local Expert (Your Home)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Science (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Tactics",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Wilderness Survival",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Brawling",
            "stat": "DEX",
            "lvl": 2,
            "lvlStr": "2",
            "base": 8
        },
        {
            "name": "Evasion",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 11
        },
        {
            "name": "Martial Arts",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Melee Weapon",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 11
        },
        {
            "name": "Acting",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Play Instrument",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Archery",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Autofire",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Handgun",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6",
            "base": 12
        },
        {
            "name": "Heavy Weapons",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Shoulder Arms",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Bribery",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Conversation",
            "stat": "EMP",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Human Perception",
            "stat": "EMP",
            "lvl": 6,
            "lvlStr": "6 + 2",
            "base": 15
        },
        {
            "name": "Interrogation",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Persuasion",
            "stat": "COOL",
            "lvl": 5,
            "lvlStr": "5",
            "base": 13
        },
        {
            "name": "Personal Grooming",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Streetwise",
            "stat": "COOL",
            "lvl": 7,
            "lvlStr": "7",
            "base": 15
        },
        {
            "name": "Trading",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6 + 4",
            "base": 18
        },
        {
            "name": "Wardrobe & Style",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6 + 2",
            "base": 16
        },
        {
            "name": "Air Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Basic Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Cybertech",
            "stat": "TECH",
            "lvl": 5,
            "lvlStr": "5",
            "base": 10
        },
        {
            "name": "Demolitions",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Electronics/Security",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "First Aid",
            "stat": "TECH",
            "lvl": 6,
            "lvlStr": "6",
            "base": 11
        },
        {
            "name": "Forgery",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Land Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Paint/Draw/Sculpt",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Paramedic",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Photography/Film",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Pick Lock",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Pick Pocket",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Sea Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Weaponstech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        }
    ]
},
  'cemk-folio-bluescreen': {
    "id": "cemk-folio-bluescreen",
    "name": "Bluescreen",
    "handle": "Bluescreen [CEMK Folio]",
    "role": "Netrunner",
    "archetype2077": "Netrunner 2077 / Cyberdeck Paraline & Fuego de Pistola Power",
    "icon": "Zap",
    "tokenUrl": "./tokens/cemk/bluescreen.png",
    "roleAbilitySummary": "Interface Rango 4 (3 Net Actions por Turno para Quickhacks CEMK a 50m)",
    "combatStyle": "Quickhacking Remoto (Daño Cyberware / Bloqueo) & Lexington Power",
    "equipmentSummary": [
        "Militech M-10AF Lexington (Heavy Pistol 3d6 Power • 21 balas • Autofire 3)",
        "Small Knife (Light Melee 1d6 ROF 2)",
        "Paraline Mk.1-5 Cyberdeck (Módulo Neuroport para Quickhacks 2077)",
        "Paraline Self-ICE (Passwall DV 6 defensivo contra hackeos rivales)",
        "Fashion Upgrades (Tatuajes de luz y EMP threading, +2 Wardrobe & Style)",
        "Light Armorjack Blindaje Ligero (Cabeza SP 11, Cuerpo SP 11)"
    ],
    "backstory": "Bluescreen no necesita cables ni terminales estáticas: vive en la vanguardia cibernética de 2077, donde el ciberespacio se solapa con la realidad óptica mediante Neuroport. Con su Cyberdeck Paraline Mk.1-5 y su firewall Self-ICE, lanza quickhacks devastadores a través del aire a 50m y remata con ráfagas cinéticas de su pistola pesada Lexington.",
    "fullSkillsTable": [
        {
            "name": "Conceal/Reveal",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Lip Reading",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Perception",
            "stat": "INT",
            "lvl": 6,
            "lvlStr": "6",
            "base": 12
        },
        {
            "name": "Tracking",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Athletics",
            "stat": "DEX",
            "lvl": 4,
            "lvlStr": "4",
            "base": 10
        },
        {
            "name": "Contortionist",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Dance",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 11
        },
        {
            "name": "Endurance",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Resist Torture/Drugs",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Stealth",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 11
        },
        {
            "name": "Swimming",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Drive Land Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Pilot Air Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Pilot Sea Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Riding",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Accounting",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Animal Handling",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Bureaucracy",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Business",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Composition",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Criminology",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Cryptography",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Deduction",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Education",
            "stat": "INT",
            "lvl": 6,
            "lvlStr": "6",
            "base": 12
        },
        {
            "name": "Gamble",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Language (Streetslang)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Language (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Library Search",
            "stat": "INT",
            "lvl": 6,
            "lvlStr": "6",
            "base": 12
        },
        {
            "name": "Local Expert (Your Home)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Science (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Tactics",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Wilderness Survival",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Brawling",
            "stat": "DEX",
            "lvl": 4,
            "lvlStr": "4",
            "base": 10
        },
        {
            "name": "Evasion",
            "stat": "DEX",
            "lvl": 4,
            "lvlStr": "4",
            "base": 10
        },
        {
            "name": "Martial Arts",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Melee Weapon",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Acting",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Play Instrument",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Archery",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Autofire",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Handgun",
            "stat": "REF",
            "lvl": 5,
            "lvlStr": "5",
            "base": 11
        },
        {
            "name": "Heavy Weapons",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Shoulder Arms",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Bribery",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Conversation",
            "stat": "EMP",
            "lvl": 6,
            "lvlStr": "6",
            "base": 10
        },
        {
            "name": "Human Perception",
            "stat": "EMP",
            "lvl": 5,
            "lvlStr": "5",
            "base": 9
        },
        {
            "name": "Interrogation",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Persuasion",
            "stat": "COOL",
            "lvl": 4,
            "lvlStr": "4",
            "base": 11
        },
        {
            "name": "Personal Grooming",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Streetwise",
            "stat": "COOL",
            "lvl": 4,
            "lvlStr": "4",
            "base": 11
        },
        {
            "name": "Trading",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Wardrobe & Style",
            "stat": "COOL",
            "lvl": 4,
            "lvlStr": "4 + 2",
            "base": 13
        },
        {
            "name": "Air Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Basic Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Cybertech",
            "stat": "TECH",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Demolitions",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Electronics/Security",
            "stat": "TECH",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "First Aid",
            "stat": "TECH",
            "lvl": 2,
            "lvlStr": "2",
            "base": 10
        },
        {
            "name": "Forgery",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Land Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Paint/Draw/Sculpt",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Paramedic",
            "stat": "TECH",
            "lvl": 2,
            "lvlStr": "2",
            "base": 10
        },
        {
            "name": "Photography/Film",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Pick Lock",
            "stat": "TECH",
            "lvl": 3,
            "lvlStr": "3",
            "base": 11
        },
        {
            "name": "Pick Pocket",
            "stat": "TECH",
            "lvl": 3,
            "lvlStr": "3",
            "base": 11
        },
        {
            "name": "Sea Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Weaponstech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        }
    ]
},
  'cemk-folio-insurance': {
    "id": "cemk-folio-insurance",
    "name": "Insurance",
    "handle": "Insurance [CEMK Folio]",
    "role": "Medtech",
    "archetype2077": "Médica de Combate / Subfusil Inteligente & Cirugía de Campo",
    "icon": "Sparkles",
    "tokenUrl": "./tokens/cemk/insurance.png",
    "roleAbilitySummary": "Medicine Rango 4 (Surgery Base 12 & Speedheal que cura BODY+WILL=12 HP por Beat)",
    "combatStyle": "Smart SMG Suppression (Arasaka Shingen) & Bisturí Quirúrgico",
    "equipmentSummary": [
        "Arasaka TKI-20 Shingen (Heavy Smart SMG 3d6 • 30 balas • Autofire x4)",
        "Scalpel (Light Melee 1d6 ROF 2 • +1 Ataque)",
        "Medtech Bag (Bolsa de cirugía de campo con instrumental completo)",
        "Speedheal Dosis x1 (Cura instantánea de 12 HP)",
        "Militech Subdermal Grip (Enlace de palma Smart Link a Neuroport)",
        "Light Armorjack Blindaje Ligero (Cabeza SP 11, Cuerpo SP 11)"
    ],
    "backstory": "Insurance es la salvavidas pragmática y curtida que mantiene en pie al equipo en medio de tormentas de plomo. Con instrumental quirúrgico de última generación y su subfusil guiado Arasaka Shingen Smart, opera bajo fuego enemigo curando heridas críticas y garantizando que ningún compañero se quede en el asfalto.",
    "fullSkillsTable": [
        {
            "name": "Conceal/Reveal",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Lip Reading",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Perception",
            "stat": "INT",
            "lvl": 4,
            "lvlStr": "4",
            "base": 11
        },
        {
            "name": "Tracking",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Athletics",
            "stat": "DEX",
            "lvl": 3,
            "lvlStr": "3",
            "base": 8
        },
        {
            "name": "Contortionist",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Dance",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Endurance",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Resist Torture/Drugs",
            "stat": "WILL",
            "lvl": 6,
            "lvlStr": "6",
            "base": 11
        },
        {
            "name": "Stealth",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 10
        },
        {
            "name": "Swimming",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Drive Land Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Pilot Air Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Pilot Sea Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Riding",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Accounting",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Animal Handling",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Bureaucracy",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Business",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Composition",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Criminology",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Cryptography",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Deduction",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Education",
            "stat": "INT",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Gamble",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Language (Streetslang)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Language (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Library Search",
            "stat": "INT",
            "lvl": 2,
            "lvlStr": "2",
            "base": 9
        },
        {
            "name": "Local Expert (Your Home)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Science (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Tactics",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Wilderness Survival",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Brawling",
            "stat": "DEX",
            "lvl": 3,
            "lvlStr": "3",
            "base": 8
        },
        {
            "name": "Evasion",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 10
        },
        {
            "name": "Martial Arts",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Melee Weapon",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Acting",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Play Instrument",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Archery",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Autofire",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6",
            "base": 12
        },
        {
            "name": "Handgun",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6",
            "base": 12
        },
        {
            "name": "Heavy Weapons",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Shoulder Arms",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Bribery",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Conversation",
            "stat": "EMP",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Human Perception",
            "stat": "EMP",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Interrogation",
            "stat": "COOL",
            "lvl": 5,
            "lvlStr": "5",
            "base": 10
        },
        {
            "name": "Persuasion",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6",
            "base": 11
        },
        {
            "name": "Personal Grooming",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Streetwise",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6",
            "base": 11
        },
        {
            "name": "Trading",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Wardrobe & Style",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Air Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Basic Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Cybertech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Demolitions",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Electronics/Security",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "First Aid",
            "stat": "TECH",
            "lvl": 2,
            "lvlStr": "2",
            "base": 10
        },
        {
            "name": "Forgery",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Land Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Paint/Draw/Sculpt",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Paramedic",
            "stat": "TECH",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Photography/Film",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Pick Lock",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Pick Pocket",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Sea Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Weaponstech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        }
    ]
},
  'cemk-folio-thorn': {
    "id": "cemk-folio-thorn",
    "name": "Thorn",
    "handle": "Thorn [CEMK Folio]",
    "role": "Rockerboy",
    "archetype2077": "Rebelde Glam-Rock / Escopeta Carnage & Esqueleto Reforzado",
    "icon": "Award",
    "tokenUrl": "./tokens/cemk/thorn.png",
    "roleAbilitySummary": "Charismatic Impact Rango 4 (+4 a tiradas sociales contra fanáticos/fans)",
    "combatStyle": "Power Heavy Shotgun (Carnage) & Presencia Magnética Rebelde",
    "equipmentSummary": [
        "Budget Arms Carnage (Shotgun 5d6 Power • Requiere BODY 10)",
        "Grafted Muscle and Bone Lace (BODY mejorado a 10 • 55 HP • Death Save 10)",
        "Dynalar AudioVox (Modulador vocal, +2 Acting y Play Instrument al cantar)",
        "Electric Guitar & Pocket Amp (Guitarra eléctrica icónica con amplificador de bolsillo)",
        "Fashion Upgrades (Tatuajes de luz y tech hair, +2 Wardrobe & Style)",
        "Light Armorjack Blindaje Ligero (Cabeza SP 11, Cuerpo SP 11)"
    ],
    "backstory": "Thorn es el ícono de la rebelión urbana: un cantante callejero con cables de neón en el pelo, voz sobrecargada por un modulador AudioVox y músculos reforzados con titanio (BODY 10) que le permiten disparar con soltura la atronadora escopeta Budget Arms Carnage mientras incita a las masas a quemar el orden corporativo.",
    "fullSkillsTable": [
        {
            "name": "Conceal/Reveal",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Lip Reading",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Perception",
            "stat": "INT",
            "lvl": 4,
            "lvlStr": "4",
            "base": 8
        },
        {
            "name": "Tracking",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Athletics",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 12
        },
        {
            "name": "Contortionist",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Dance",
            "stat": "DEX",
            "lvl": 4,
            "lvlStr": "4",
            "base": 11
        },
        {
            "name": "Endurance",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Resist Torture/Drugs",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Stealth",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Swimming",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Drive Land Vehicle",
            "stat": "REF",
            "lvl": 4,
            "lvlStr": "4",
            "base": 10
        },
        {
            "name": "Pilot Air Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Pilot Sea Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Riding",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Accounting",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Animal Handling",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Bureaucracy",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Business",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Composition",
            "stat": "INT",
            "lvl": 6,
            "lvlStr": "6",
            "base": 10
        },
        {
            "name": "Criminology",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Cryptography",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Deduction",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Education",
            "stat": "INT",
            "lvl": 4,
            "lvlStr": "4",
            "base": 8
        },
        {
            "name": "Gamble",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Language (Streetslang)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Language (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Library Search",
            "stat": "INT",
            "lvl": 4,
            "lvlStr": "4",
            "base": 8
        },
        {
            "name": "Local Expert (Your Home)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Science (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Tactics",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Wilderness Survival",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 4
        },
        {
            "name": "Brawling",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Evasion",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Martial Arts",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Melee Weapon",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Acting",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6 + 2",
            "base": 15
        },
        {
            "name": "Play Instrument",
            "stat": "TECH",
            "lvl": 6,
            "lvlStr": "6 + 2",
            "base": 13
        },
        {
            "name": "Archery",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Autofire",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Handgun",
            "stat": "REF",
            "lvl": 2,
            "lvlStr": "2",
            "base": 8
        },
        {
            "name": "Heavy Weapons",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 6
        },
        {
            "name": "Shoulder Arms",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6",
            "base": 12
        },
        {
            "name": "Bribery",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Conversation",
            "stat": "EMP",
            "lvl": 6,
            "lvlStr": "6",
            "base": 12
        },
        {
            "name": "Human Perception",
            "stat": "EMP",
            "lvl": 6,
            "lvlStr": "6",
            "base": 12
        },
        {
            "name": "Interrogation",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Persuasion",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Personal Grooming",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Streetwise",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Trading",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Wardrobe & Style",
            "stat": "COOL",
            "lvl": 6,
            "lvlStr": "6 + 2",
            "base": 15
        },
        {
            "name": "Air Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Basic Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Cybertech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Demolitions",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Electronics/Security",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "First Aid",
            "stat": "TECH",
            "lvl": 6,
            "lvlStr": "6",
            "base": 11
        },
        {
            "name": "Forgery",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Land Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Paint/Draw/Sculpt",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Paramedic",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Photography/Film",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Pick Lock",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Pick Pocket",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Sea Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Weaponstech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        }
    ]
},
  'cemk-folio-maven': {
    "id": "cemk-folio-maven",
    "name": "Maven",
    "handle": "Maven [CEMK Folio]",
    "role": "Tech",
    "archetype2077": "Inventora y Francotiradora / Escopeta Satara Tech & Rifle Grad",
    "icon": "Layers",
    "tokenUrl": "./tokens/cemk/maven.png",
    "roleAbilitySummary": "Maker Rango 4 (+4 a Cybertech y Electronics/Security ya reflejado en Bases 17 y 18)",
    "combatStyle": "Tech Penetration (Satara Tech) & Heavy Precision Sniping (Grad Power)",
    "equipmentSummary": [
        "Rostović DB-2 Satara (Tech Shotgun 5d6 • Disparo Cargado atraviesa Thin Cover e ignora 50% SP)",
        "Techtronika SPT32 Grad (Power Sniper Rifle 5d6 • Calidad Excelente +1 • Ignora 50% SP si <11)",
        "Maven Custom Built Cyberoptic (+2 a Conceal/Reveal y Perception visual)",
        "Paraline Self-ICE (Passwall DV 6 en arquitectura Neuroport)",
        "Fashion Upgrades (Tatuajes de luz y tech hair, +2 Wardrobe & Style)",
        "Light Armorjack Blindaje Ligero (Cabeza SP 11, Cuerpo SP 11)"
    ],
    "backstory": "Maven es una virtuosa de la ingeniería y la balística avanzada. Capaz de desarmar, reparar o sobrecargar cualquier máquina en minutos, domina el combate a distancia con un ojo cibernético fabricado por ella misma, una escopeta Tech Rostović Satara que desintegra coberturas y un cañón de francotirador Techtronika Grad que atraviesa blindajes.",
    "fullSkillsTable": [
        {
            "name": "Conceal/Reveal",
            "stat": "INT",
            "lvl": 3,
            "lvlStr": "3",
            "base": 11
        },
        {
            "name": "Lip Reading",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Perception",
            "stat": "INT",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Tracking",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Athletics",
            "stat": "DEX",
            "lvl": 3,
            "lvlStr": "3",
            "base": 8
        },
        {
            "name": "Contortionist",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Dance",
            "stat": "DEX",
            "lvl": 3,
            "lvlStr": "3",
            "base": 8
        },
        {
            "name": "Endurance",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Resist Torture/Drugs",
            "stat": "WILL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Stealth",
            "stat": "DEX",
            "lvl": 6,
            "lvlStr": "6",
            "base": 11
        },
        {
            "name": "Swimming",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Drive Land Vehicle",
            "stat": "REF",
            "lvl": 3,
            "lvlStr": "3",
            "base": 10
        },
        {
            "name": "Pilot Air Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Pilot Sea Vehicle",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Riding",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Accounting",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Animal Handling",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Bureaucracy",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Business",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Composition",
            "stat": "INT",
            "lvl": 3,
            "lvlStr": "3",
            "base": 11
        },
        {
            "name": "Criminology",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Cryptography",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Deduction",
            "stat": "INT",
            "lvl": 6,
            "lvlStr": "6",
            "base": 14
        },
        {
            "name": "Education",
            "stat": "INT",
            "lvl": 2,
            "lvlStr": "2",
            "base": 10
        },
        {
            "name": "Gamble",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Language (Streetslang)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Language (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Library Search",
            "stat": "INT",
            "lvl": 5,
            "lvlStr": "5",
            "base": 13
        },
        {
            "name": "Local Expert (Your Home)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Science (Choice)",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Tactics",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Wilderness Survival",
            "stat": "INT",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Brawling",
            "stat": "DEX",
            "lvl": 3,
            "lvlStr": "3",
            "base": 8
        },
        {
            "name": "Evasion",
            "stat": "DEX",
            "lvl": 5,
            "lvlStr": "5",
            "base": 10
        },
        {
            "name": "Martial Arts",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Melee Weapon",
            "stat": "DEX",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Acting",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Play Instrument",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Archery",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Autofire",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Handgun",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Heavy Weapons",
            "stat": "REF",
            "lvl": 0,
            "lvlStr": "—",
            "base": 7
        },
        {
            "name": "Shoulder Arms",
            "stat": "REF",
            "lvl": 6,
            "lvlStr": "6",
            "base": 13
        },
        {
            "name": "Bribery",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Conversation",
            "stat": "EMP",
            "lvl": 2,
            "lvlStr": "2",
            "base": 7
        },
        {
            "name": "Human Perception",
            "stat": "EMP",
            "lvl": 4,
            "lvlStr": "4",
            "base": 9
        },
        {
            "name": "Interrogation",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Persuasion",
            "stat": "COOL",
            "lvl": 2,
            "lvlStr": "2",
            "base": 7
        },
        {
            "name": "Personal Grooming",
            "stat": "COOL",
            "lvl": 0,
            "lvlStr": "—",
            "base": 5
        },
        {
            "name": "Streetwise",
            "stat": "COOL",
            "lvl": 4,
            "lvlStr": "4",
            "base": 9
        },
        {
            "name": "Trading",
            "stat": "COOL",
            "lvl": 5,
            "lvlStr": "5",
            "base": 10
        },
        {
            "name": "Wardrobe & Style",
            "stat": "COOL",
            "lvl": 3,
            "lvlStr": "3 + 2",
            "base": 10
        },
        {
            "name": "Air Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Basic Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Cybertech",
            "stat": "TECH",
            "lvl": 5,
            "lvlStr": "5 + 4",
            "base": 17
        },
        {
            "name": "Demolitions",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Electronics/Security",
            "stat": "TECH",
            "lvl": 6,
            "lvlStr": "6 + 4",
            "base": 18
        },
        {
            "name": "First Aid",
            "stat": "TECH",
            "lvl": 2,
            "lvlStr": "2",
            "base": 10
        },
        {
            "name": "Forgery",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Land Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Paint/Draw/Sculpt",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Paramedic",
            "stat": "TECH",
            "lvl": 3,
            "lvlStr": "3",
            "base": 11
        },
        {
            "name": "Photography/Film",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Pick Lock",
            "stat": "TECH",
            "lvl": 2,
            "lvlStr": "2",
            "base": 10
        },
        {
            "name": "Pick Pocket",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Sea Vehicle Tech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        },
        {
            "name": "Weaponstech",
            "stat": "TECH",
            "lvl": 0,
            "lvlStr": "—",
            "base": 8
        }
    ]
},
};

// ----------------------------------------------------------------------------
// 2. PERSONAJES PREMADE LISTOS PARA useCharacterStore
// ----------------------------------------------------------------------------
export const CEMK_FOLIO_PREMADE_CHARACTERS: CharacterSheet[] = [
  {
    "id": "cemk-folio-hardpoint",
    "handle": "Hardpoint [CEMK Folio]",
    "role": "Solo",
    "roleRank": 4,
    "roleAbilityVariant": "core",
    "improvementPoints": 0,
    "ipLog": [],
    "roleAbilityName": "Combat Awareness",
    "notes": "FOLIO CANÓNICO CEMK 2077 (Págs 1-4):\n- Iniciativa: REF (7) + 1d10 + 4 (Combat Awareness) = 11 + 1d10.\n- Moore Tech Berserk: Acción para activar. Inmunidad a penalizadores de Herido Grave y Mortal durante 60 segundos (20 asaltos). Si cae en Herido Mortal sigue tirando Salvación de Muerte (Death Save 6). Tiempo de recarga: 1 hora.\n- Blindaje: SP 11 en Cabeza y Cuerpo (reduce a 6 frente a armas Melee y armas Tech cargadas).\n- Combate Desarmado (Brawling): Ataque 2d6 ROF 2, Agarre (Grapple enfrentado, -2 a chequeos), Asfixia (Choke daño BODY = 6 directo a HP), Estampada (Slam daño BODY = 6 directo a HP y derribo).",
    "stats": {
        "INT": 6,
        "REF": 7,
        "DEX": 7,
        "TECH": 5,
        "COOL": 7,
        "WILL": 6,
        "LUCK": 6,
        "MOVE": 7,
        "BODY": 6,
        "EMP": 5
    },
    "currentHp": 40,
    "currentLuck": 6,
    "currentHumanity": 50,
    "headArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "bodyArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "skills": {
        "handgun": 6,
        "shoulderArms": 6,
        "autofire": 6,
        "heavyWeapons": 0,
        "archery": 0,
        "meleeWeapon": 6,
        "brawling": 6,
        "martialArts": 0,
        "evasion": 6,
        "athletics": 6,
        "firstAid": 6,
        "paramedic": 0,
        "cybertech": 0,
        "perception": 5,
        "concentration": 4,
        "resistTortureDrugs": 0
    },
    "generalSkills": {
        "acting": 0,
        "athletics": 6,
        "autofire": 6,
        "brawling": 6,
        "bribery": 0,
        "business": 0,
        "composition": 0,
        "concealreveal": 0,
        "concentration": 4,
        "conversation": 2,
        "cybertech": 0,
        "dance": 0,
        "deduction": 0,
        "drivelandvehicle": 4,
        "education": 5,
        "electronicssecurity": 0,
        "evasion": 6,
        "firstaid": 6,
        "handgun": 6,
        "heavyweapons": 0,
        "humanperception": 5,
        "interrogation": 4,
        "librarysearch": 0,
        "meleeweapon": 6,
        "paramedic": 0,
        "perception": 5,
        "persuasion": 4,
        "picklock": 0,
        "pickpocket": 0,
        "playinstrument": 0,
        "resisttorturedrugs": 0,
        "shoulderarms": 6,
        "stealth": 6,
        "streetwise": 0,
        "trading": 0,
        "wardrobeAndstyle": 0
    },
    "equippedWeapons": [
        {
            "instanceId": "hardpoint-masamune",
            "id": "arasaka-hjsh18-masamune",
            "name": "Arasaka HJSH-18 Masamune",
            "type": "Ranged",
            "skill": "shoulderArms",
            "damage": "5d6",
            "rof": 1,
            "hands": 2,
            "concealable": false,
            "cost": 1000,
            "costTier": "Very Expensive",
            "currentMag": 24,
            "standardMag": 24,
            "loadedAmmoType": "Basic Rifle Ammunition",
            "ammoType": "Rifle",
            "weaponTechType": "power",
            "inHand": true,
            "reserveAmmo": 24,
            "notes": "Power Weapon: Aumenta el daño de Herida Crítica en +5. Permite disparos con rebote (ricochet) con -4 a la tirada. Disparo único (Shoulder Arms): 5d6 daño consumiendo 3 balas (o 4d6 si quedan menos de 3). Fuego Automático (Autofire x4): 2d6 × margen de impacto (hasta x4) consumiendo 10 balas.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        },
        {
            "instanceId": "hardpoint-mantis-blade",
            "id": "mantis-blades-2077",
            "name": "Arasaka Mantis Blade",
            "type": "Melee",
            "skill": "meleeWeapon",
            "damage": "3d6",
            "rof": 2,
            "hands": 1,
            "concealable": true,
            "cost": 1000,
            "costTier": "Very Expensive",
            "currentMag": 0,
            "loadedAmmoType": "None",
            "weaponTechType": "standard",
            "inHand": false,
            "notes": "Heavy Melee Weapon / Cyberware: Cuchillas monomoleculares integradas en ciberbrazo. Calidad Excelente (+1 tiradas de Ataque ya incluido). ROF 2. Daño 3d6. Ignora el 50% del blindaje SP del defensor. Mientras está desplegada no se puede sujetar nada en esa mano.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        }
    ],
    "installedCyberwareIds": [
        "cw-cemk-neuroport",
        "cw-cemk-mantis-blades",
        "cw-cemk-berserk"
    ],
    "activeInjuries": [],
    "eurodollars": 100,
    "inventory": [
        {
            "id": "inv-hp-binoc",
            "catalogId": "binoculars",
            "name": "Binoculars",
            "category": "gear",
            "cost": 50,
            "quantity": 1,
            "details": "Permite visión telescópica a larga distancia."
        },
        {
            "id": "inv-hp-ammo",
            "catalogId": "rifle-ammo-basic",
            "name": "Basic Rifle Ammunition",
            "category": "ammunition",
            "cost": 100,
            "quantity": 24,
            "details": "24 cartuchos de munición básica para fusil Arasaka Masamune."
        }
    ],
    "hasNeuroport": true,
    "era": "2077",
    "creationMethod": "pregen",
    "lifepath": {
        "culturalRegion": "North American / Night City Outskirts",
        "personality": "Frío, metódico, profesional de gatillo fácil pero con lealtad inquebrantable a su contrato.",
        "clothingStyle": "Tactical Military / Urban Flash funcional sobre Light Armorjack.",
        "hairstyle": "Rapado militar con cicatrices de implantes craneales.",
        "affectation": "Nunca se sienta de espaldas a una puerta abierta; escanea continuamente salidas y ángulos ciegos.",
        "valueMost": "La reputación profesional y cumplir el contrato con vida.",
        "feelAboutPeople": "La confianza se gana con sangre; todos los demás son sospechosos o daño colateral.",
        "valuedPerson": "Su antiguo sargento instructor en la unidad de seguridad corporativa.",
        "valuedPossession": "Su fusil Arasaka Masamune calibrado a medida.",
        "familyBackground": "Hijo de contratistas militares privados criados en zonas fortificadas.",
        "childhoodEnvironment": "Bases de entrenamiento militar y distritos en conflicto permanente.",
        "familyCrisis": "Su antigua unidad mercenaria fue liquidada por un operativo encubierto de Arasaka.",
        "friends": [
            "Técnico de armas clandestino en Watson",
            "Fixer de contratos de extracción"
        ],
        "tragicLoveAffairs": [
            "Compañera de escuadrón abatida durante una emboscada en Santo Domingo"
        ],
        "enemies": [
            {
                "id": "en-folio-hardpoint-1",
                "who": "Subdirector de Seguridad Arasaka",
                "cause": "Hardpoint rechazó ejecutar a testigos civiles en una operación de limpieza",
                "throwAtYou": "Corporativo con recursos y sicarios",
                "reaction": "Te atacará si te cruzas en su jurisdicción"
            }
        ],
        "roleLifepath": {
            "soloType": "Bodyguard / Tactical Infiltration Solo",
            "moralCode": "No matar niños ni dañar clientes bajo fianza",
            "currentEmployer": "Operativo independiente contratado por Fixers del Afterlife"
        },
        "lifeGoal": "Acumular suficientes eurodólares para comprar un retiro blindado fuera de Night City."
    },
    "portraitId": "cemk-hardpoint",
    "soloAllocation": {
        "fumbleRecovery": false,
        "damageDeflection": 0,
        "initiativeReaction": 4,
        "precisionAttack": 0,
        "spotWeakness": 0,
        "threatDetection": 0
    }
},
  {
    "id": "cemk-folio-wrench",
    "handle": "Wrench [CEMK Folio]",
    "role": "Nomad",
    "roleRank": 4,
    "roleAbilityVariant": "core",
    "improvementPoints": 0,
    "ipLog": [],
    "roleAbilityName": "Moto",
    "notes": "FOLIO CANÓNICO CEMK 2077 (Págs 5-8):\n- Movilidad Nómada (Moto 4): Drive Land Vehicle Base 16 (REF 6 + LVL 6 + Bono Moto 4).\n- Gorilla Cyberarms x2: Fuerza equivalente a BODY 11 para levantar objetos, forzar puertas y llaves de lucha. Permite disparar la escopeta Zhuo a 1 mano.\n- Munición Smart Mejorada: Ignora penalizaciones por oscuridad, humo o niebla. Si falla un ataque por 5 o menos, tirada inmediata de segunda oportunidad con 14 + 1d10 vs DV original.\n- Combate Desarmado (Brawling): Daño 3d6 ROF 2. Choke y Slam hacen daño de BODY 11 (11 puntos directo a HP sin importar blindaje).",
    "stats": {
        "INT": 5,
        "REF": 6,
        "DEX": 8,
        "TECH": 4,
        "COOL": 7,
        "WILL": 7,
        "LUCK": 6,
        "MOVE": 6,
        "BODY": 8,
        "EMP": 5
    },
    "currentHp": 50,
    "currentLuck": 6,
    "currentHumanity": 50,
    "headArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "bodyArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "skills": {
        "handgun": 4,
        "shoulderArms": 6,
        "autofire": 0,
        "heavyWeapons": 0,
        "archery": 0,
        "meleeWeapon": 6,
        "brawling": 6,
        "martialArts": 0,
        "evasion": 6,
        "athletics": 6,
        "firstAid": 4,
        "paramedic": 0,
        "cybertech": 0,
        "perception": 3,
        "concentration": 4,
        "resistTortureDrugs": 6
    },
    "generalSkills": {
        "acting": 0,
        "athletics": 6,
        "autofire": 0,
        "brawling": 6,
        "bribery": 5,
        "business": 0,
        "composition": 0,
        "concealreveal": 5,
        "concentration": 4,
        "conversation": 4,
        "cybertech": 0,
        "dance": 5,
        "deduction": 0,
        "drivelandvehicle": 6,
        "education": 6,
        "electronicssecurity": 6,
        "evasion": 6,
        "firstaid": 4,
        "handgun": 4,
        "heavyweapons": 0,
        "humanperception": 2,
        "interrogation": 3,
        "librarysearch": 0,
        "meleeweapon": 6,
        "paramedic": 0,
        "perception": 3,
        "persuasion": 4,
        "picklock": 0,
        "pickpocket": 0,
        "playinstrument": 0,
        "resisttorturedrugs": 6,
        "shoulderarms": 6,
        "stealth": 4,
        "streetwise": 2,
        "trading": 0,
        "wardrobeAndstyle": 3
    },
    "equippedWeapons": [
        {
            "instanceId": "wrench-zhuo",
            "id": "kang-tao-l69-zhuo",
            "name": "Kang Tao L-69 Zhuo",
            "type": "Ranged",
            "skill": "shoulderArms",
            "damage": "4d6",
            "rof": 1,
            "hands": 2,
            "concealable": false,
            "cost": 1000,
            "costTier": "Very Expensive",
            "currentMag": 32,
            "standardMag": 32,
            "loadedAmmoType": "Improved Smart Shotgun Shells",
            "ammoType": "Shotgun Shell",
            "weaponTechType": "smart",
            "inHand": true,
            "reserveAmmo": 32,
            "notes": "Daño: el Folio imprime 3d6 en el bloque del arma y 4d6 en la tabla de ataques y en el modo Shell; se muestran ambos (discrepancia 15, decisión de Giuliano 2026-10-22). Smart Weapon: +1 a Tiradas de Ataque (ya incluido en la base 13). Requiere munición Smart Mejorada. Disparo en área (Shell): Shoulder Arms vs DV 13. Causa 4d6 de daño a todos los objetivos en un cono de 6m delante del usuario consumiendo 8 cartuchos. No puede disparar postas (slugs). Gracias a los Gorilla Arms puede empuñarse con 1 sola mano.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        },
        {
            "instanceId": "wrench-gorilla-arms",
            "id": "gorilla-arms-2077",
            "name": "Gorilla Cyberarms x2",
            "type": "Melee",
            "skill": "meleeWeapon",
            "damage": "3d6",
            "rof": 2,
            "hands": 1,
            "concealable": true,
            "cost": 1000,
            "costTier": "Very Expensive",
            "currentMag": 0,
            "loadedAmmoType": "None",
            "weaponTechType": "standard",
            "inHand": false,
            "notes": "Heavy Melee Weapon / Cyberarms x2: Puños potenciados que cuentan como arma cuerpo a cuerpo pesada. +1 a tiradas de Ataque (ya incluido). ROF 2. Daño 3d6. Permite empuñar armas de dos manos con una sola mano. Chequeos de mover pesos, forzar puertas, Choke y Slam se realizan como si tuviera BODY 11.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        }
    ],
    "installedCyberwareIds": [
        "cw-cemk-neuroport",
        "cw-cemk-smartlink",
        "cw-cemk-gorilla-arms"
    ],
    "activeInjuries": [],
    "eurodollars": 50,
    "inventory": [
        {
            "id": "inv-wr-techtool",
            "catalogId": "techtool",
            "name": "Techtool",
            "category": "gear",
            "cost": 100,
            "quantity": 1,
            "details": "Herramienta multifunción de bolsillo para reparaciones de vehículos y ciberware."
        },
        {
            "id": "inv-wr-smart-shells",
            "catalogId": "smart-shells-improved",
            "name": "Improved Smart Shotgun Shells",
            "category": "ammunition",
            "cost": 100,
            "quantity": 32,
            "details": "32 cartuchos inteligentes mejorados (ignoran oscuridad, humo y niebla; si falla por 5 o menos, segunda oportunidad con tirada 14+1d10 vs DV original)."
        }
    ],
    "hasNeuroport": true,
    "era": "2077",
    "creationMethod": "pregen",
    "lifepath": {
        "culturalRegion": "Southwestern Nomad Nation / Aldecaldos",
        "personality": "Leal a la familia, obstinada, ruda y amante de la velocidad y las herramientas pesadas.",
        "clothingStyle": "Nomad Leather / Chaleco de cuero motero con parches del clan sobre blindaje.",
        "hairstyle": "Mohawk trenzado hacia atrás sujeto con bandana manchada de grasa.",
        "affectation": "Mascando estimulante sintético, limpiándose continuamente las manos con un trapo.",
        "valueMost": "El Clan y la libertad de la carretera abierta.",
        "feelAboutPeople": "La familia lo es todo; los urbanitas de Night City son débiles o traicioneros.",
        "valuedPerson": "El jefe de mecánicos de su convoy nómada que le regaló su primer juego de llaves.",
        "valuedPossession": "Su furgoneta Villefort Columbus V340-F Freight.",
        "familyBackground": "Nacida y criada en una caravana nómada transportista.",
        "childhoodEnvironment": "Autopistas infinitas, campamentos en el desierto y puestos fronterizos hostiles.",
        "familyCrisis": "Una emboscada de Raffen Shiv destruyó el camión cisterna principal de su familia.",
        "friends": [
            "Piloto nómada de carreras en el Páramo",
            "Contrabandista en la frontera de Heywood"
        ],
        "tragicLoveAffairs": [
            "Un amante que prefirió quedarse en los rascacielos de la ciudad y romper el juramento del clan"
        ],
        "enemies": [
            {
                "id": "en-folio-wrench-1",
                "who": "Cabecilla de banda Raffen Shiv",
                "cause": "Wrench le partió los codos con sus Gorilla Arms tras un intento de secuestro",
                "throwAtYou": "Banda de carroñeros del desierto",
                "reaction": "Intentará sabotear su vehículo o emboscarla en los caminos"
            }
        ],
        "roleLifepath": {
            "nomadPack": "Aldecaldos / Transporte de carga pesada",
            "landVehicleSpecialty": "Furgonetas y camiones blindados de contrabando"
        },
        "lifeGoal": "Ganar suficientes eurodólares para comprar un convoy blindado acorazado para su familia nómada."
    },
    "portraitId": "cemk-wrench",
    "vehicles": [
        {
            "instanceId": "veh-wrench-columbus-1",
            "catalogId": "columbus-freight",
            "name": "Villefort Columbus V340-F Freight",
            "category": "land",
            "seats": 4,
            "combatSpeed": "30 m/y",
            "narrativeSpeed": "60 MPH",
            "currentSdp": 60,
            "maxSdp": 60,
            "armorSp": 11,
            "upgrades": [
                "Nomad Heavy Cargo Bay",
                "Mobile Mechanic Bench"
            ],
            "mountedWeapons": [],
            "notes": "Furgoneta Villefort Columbus V340-F Freight adaptada para taller mecánico móvil de Nomad."
        }
    ]
},
  {
    "id": "cemk-folio-connect",
    "handle": "Connect [CEMK Folio]",
    "role": "Fixer",
    "roleRank": 4,
    "roleAbilityVariant": "core",
    "improvementPoints": 0,
    "ipLog": [],
    "roleAbilityName": "Operator",
    "notes": "FOLIO CANÓNICO CEMK 2077 (Págs 9-12):\n- Negociador de Élite (Operator 4): Trading Base 18 (COOL 8 + LVL 6 + Bono Operator 4).\n- Detector de Mentiras: Dynalar Voice Stress Analyzer integrado da +2 a Human Perception (Base 15).\n- Ojos Kiroshi Starlight: Ignora totalmente las penalizaciones por luz tenue y oscuridad.\n- Pistolas Tech Gemelas: Disparo cargado perfora coberturas delgadas e ignora la mitad del SP enemigo.",
    "stats": {
        "INT": 8,
        "REF": 6,
        "DEX": 6,
        "TECH": 5,
        "COOL": 8,
        "WILL": 7,
        "LUCK": 5,
        "MOVE": 6,
        "BODY": 4,
        "EMP": 7
    },
    "currentHp": 40,
    "currentLuck": 5,
    "currentHumanity": 70,
    "headArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "bodyArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "skills": {
        "handgun": 6,
        "shoulderArms": 0,
        "autofire": 0,
        "heavyWeapons": 0,
        "archery": 0,
        "meleeWeapon": 5,
        "brawling": 2,
        "martialArts": 0,
        "evasion": 5,
        "athletics": 4,
        "firstAid": 6,
        "paramedic": 0,
        "cybertech": 5,
        "perception": 6,
        "concentration": 6,
        "resistTortureDrugs": 4
    },
    "generalSkills": {
        "acting": 6,
        "athletics": 4,
        "autofire": 0,
        "brawling": 2,
        "bribery": 6,
        "business": 0,
        "composition": 0,
        "concealreveal": 0,
        "concentration": 6,
        "conversation": 6,
        "cybertech": 5,
        "dance": 5,
        "deduction": 0,
        "drivelandvehicle": 0,
        "education": 7,
        "electronicssecurity": 0,
        "evasion": 5,
        "firstaid": 6,
        "handgun": 6,
        "heavyweapons": 0,
        "humanperception": 6,
        "interrogation": 0,
        "librarysearch": 0,
        "meleeweapon": 5,
        "paramedic": 0,
        "perception": 6,
        "persuasion": 5,
        "picklock": 0,
        "pickpocket": 0,
        "playinstrument": 0,
        "resisttorturedrugs": 4,
        "shoulderarms": 0,
        "stealth": 5,
        "streetwise": 7,
        "trading": 6,
        "wardrobeAndstyle": 6
    },
    "equippedWeapons": [
        {
            "instanceId": "connect-omaha-1",
            "id": "militech-m76e-omaha",
            "name": "Militech M-76e Omaha (Mano Principal)",
            "type": "Ranged",
            "skill": "handgun",
            "damage": "3d6",
            "rof": 2,
            "hands": 1,
            "concealable": true,
            "cost": 500,
            "costTier": "Expensive",
            "currentMag": 9,
            "standardMag": 9,
            "loadedAmmoType": "Basic Heavy Pistol Ammunition",
            "ammoType": "Heavy Pistol",
            "weaponTechType": "tech",
            "inHand": true,
            "reserveAmmo": 9,
            "notes": "Tech Weapon: Equipada con mira con escaneo de siluetas tras Cobertura Delgada (Thin Cover). Sacrificando la Acción de Movimiento, se carga el arma hasta el final del turno en que dispara. Disparo Cargado: Mantiene ROF 2, consume 3 balas por ataque, dispara a través de coberturas delgadas e ignora la mitad del SP del objetivo (redondeado hacia arriba). Disparo Normal: 3d6 daño (1 bala).",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        },
        {
            "instanceId": "connect-omaha-2",
            "id": "militech-m76e-omaha",
            "name": "Militech M-76e Omaha (Segunda Mano)",
            "type": "Ranged",
            "skill": "handgun",
            "damage": "3d6",
            "rof": 2,
            "hands": 1,
            "concealable": true,
            "cost": 500,
            "costTier": "Expensive",
            "currentMag": 9,
            "standardMag": 9,
            "loadedAmmoType": "Basic Heavy Pistol Ammunition",
            "ammoType": "Heavy Pistol",
            "weaponTechType": "tech",
            "inHand": false,
            "reserveAmmo": 9,
            "notes": "Segunda pistola Tech Militech Omaha gemela. Permite fuego simultáneo a dos manos respetando ROF 2.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        },
        {
            "instanceId": "connect-knife",
            "id": "medium-melee",
            "name": "Large Knife",
            "type": "Melee",
            "skill": "meleeWeapon",
            "damage": "2d6",
            "rof": 2,
            "hands": 1,
            "concealable": true,
            "cost": 50,
            "costTier": "Everyday",
            "currentMag": 0,
            "loadedAmmoType": "None",
            "weaponTechType": "standard",
            "inHand": false,
            "notes": "Medium Melee Weapon: Cuchillo táctico de combate cuerpo a cuerpo. ROF 2. Daño 2d6. Ignora el 50% del blindaje defensor.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        }
    ],
    "installedCyberwareIds": [
        "cw-cemk-neuroport",
        "cw-cemk-fashion-upgrades",
        "cw-cemk-voice-analyzer",
        "cw-cemk-kiroshi"
    ],
    "activeInjuries": [],
    "eurodollars": 250,
    "inventory": [
        {
            "id": "inv-cn-burner",
            "catalogId": "burner-phone",
            "name": "Burner Phone",
            "category": "gear",
            "cost": 50,
            "quantity": 1,
            "details": "Teléfono holofónico desechable no rastreable para acuerdos clandestinos."
        },
        {
            "id": "inv-cn-ammo",
            "catalogId": "heavy-pistol-ammo-basic",
            "name": "Basic Heavy Pistol Ammunition",
            "category": "ammunition",
            "cost": 60,
            "quantity": 18,
            "details": "18 balas pesadas de pistola (9 cartuchos de reserva para cada Omaha)."
        }
    ],
    "hasNeuroport": true,
    "era": "2077",
    "creationMethod": "pregen",
    "lifepath": {
        "culturalRegion": "Pacific Rim / Night City Cosmopolitan",
        "personality": "Elegante, diplomático, calculador e implacable en la mesa de negociaciones.",
        "clothingStyle": "High Fashion / Traje corporativo a medida con sutiles costuras luminosas EMP.",
        "hairstyle": "Degradado impecable con gomina sintética de secado rápido.",
        "affectation": "Juguetea con un chip de datos entre los nudillos mientras calcula el precio de su interlocutor.",
        "valueMost": "La información privilegiada y la influencia en el mercado.",
        "feelAboutPeople": "Todo el mundo tiene un precio; solo es cuestión de averiguar cuál es.",
        "valuedPerson": "Un legendario fixer del Afterlife que le enseñó a nunca fiarse de un contrato verbal.",
        "valuedPossession": "Su red encriptada de contactos VIP en corporaciones y bandas.",
        "familyBackground": "Hijo de empleados medios de Biotechnica en Westbrook.",
        "childhoodEnvironment": "Plazas comerciales relucientes y clubes ejecutivos de Charter Hill.",
        "familyCrisis": "Su familia fue arruinada de la noche a la mañana por una absorción hostil no consentida.",
        "friends": [
            "Dueño de un club nocturno en City Center",
            "Sargento corrupto del NCPD en Heywood"
        ],
        "tragicLoveAffairs": [
            "Un agente corporativo de alto rango que usó a Connect para filtrar información y huyó"
        ],
        "enemies": [
            {
                "id": "en-folio-connect-1",
                "who": "Fixer rival de Japantown",
                "cause": "Connect le arrebató el contrato de distribución de ciberware médico en Watson",
                "throwAtYou": "Red de corredores locales",
                "reaction": "Intentará contratar mercenarios para secuestrar a sus contactos"
            }
        ],
        "roleLifepath": {
            "fixerType": "Broker / Information Merchant / Arms Dealer",
            "clientele": "Mercenarios de élite y corporativos desesperados"
        },
        "lifeGoal": "Convertirse en el broker principal del Afterlife y controlar los mayores tratos de Night City."
    },
    "portraitId": "cemk-connect"
},
  {
    "id": "cemk-folio-bluescreen",
    "handle": "Bluescreen [CEMK Folio]",
    "role": "Netrunner",
    "roleRank": 4,
    "roleAbilityVariant": "core",
    "improvementPoints": 0,
    "ipLog": [],
    "roleAbilityName": "Interface",
    "notes": "FOLIO CANÓNICO CEMK 2077 (Págs 13-16):\n- Interface Rango 4: Permite 3 Net Actions por Turno para Quickhacks en un rango de 50m con línea de visión.\n- Quickhacks Disponibles: Short Circuit (3d6 a HP si tiene ciberware), Cyberware Malfunction (inhabilita pieza de ciberware), Overheat (prende en fuego, 2 daño por turno directo a HP), Reboot Optics (ciega temporalmente).\n- Paraline Self-ICE: Crea un Passwall DV 6 en su arquitectura Neuroport; los Netrunners rivales deben gastar 1 Net Action para superarlo antes de hackearla.\n- LUCK 8: Reserva de suerte excepcional para asegurar tiradas críticas de hackeo o disparo.",
    "stats": {
        "INT": 6,
        "REF": 6,
        "DEX": 6,
        "TECH": 8,
        "COOL": 7,
        "WILL": 6,
        "LUCK": 8,
        "MOVE": 7,
        "BODY": 4,
        "EMP": 4
    },
    "currentHp": 35,
    "currentLuck": 8,
    "currentHumanity": 40,
    "headArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "bodyArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "skills": {
        "handgun": 5,
        "shoulderArms": 0,
        "autofire": 0,
        "heavyWeapons": 0,
        "archery": 0,
        "meleeWeapon": 0,
        "brawling": 4,
        "martialArts": 0,
        "evasion": 4,
        "athletics": 4,
        "firstAid": 2,
        "paramedic": 2,
        "cybertech": 6,
        "perception": 6,
        "concentration": 2,
        "resistTortureDrugs": 0
    },
    "generalSkills": {
        "acting": 6,
        "athletics": 4,
        "autofire": 0,
        "brawling": 4,
        "bribery": 0,
        "business": 0,
        "composition": 0,
        "concealreveal": 0,
        "concentration": 2,
        "conversation": 6,
        "cybertech": 6,
        "dance": 5,
        "deduction": 0,
        "drivelandvehicle": 0,
        "education": 6,
        "electronicssecurity": 6,
        "evasion": 4,
        "firstaid": 2,
        "handgun": 5,
        "heavyweapons": 0,
        "humanperception": 5,
        "interrogation": 0,
        "librarysearch": 6,
        "meleeweapon": 0,
        "paramedic": 2,
        "perception": 6,
        "persuasion": 4,
        "picklock": 3,
        "pickpocket": 3,
        "playinstrument": 0,
        "resisttorturedrugs": 0,
        "shoulderarms": 0,
        "stealth": 5,
        "streetwise": 4,
        "trading": 0,
        "wardrobeAndstyle": 4
    },
    "equippedWeapons": [
        {
            "instanceId": "bluescreen-lexington",
            "id": "militech-m10af-lexington",
            "name": "Militech M-10AF Lexington",
            "type": "Ranged",
            "skill": "handgun",
            "damage": "3d6",
            "rof": 2,
            "hands": 1,
            "concealable": true,
            "cost": 500,
            "costTier": "Expensive",
            "currentMag": 21,
            "standardMag": 21,
            "loadedAmmoType": "Basic Heavy Pistol Ammunition",
            "ammoType": "Heavy Pistol",
            "weaponTechType": "power",
            "inHand": true,
            "reserveAmmo": 21,
            "notes": "Power Weapon: Aumenta el daño de Herida Crítica en +5. Permite disparos con rebote con -4 a la tirada. Disparo único (Handgun): 3d6 daño. Capacidad extendida de 21 balas. Apta para ráfagas automáticas cortas (Autofire 3).",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        },
        {
            "instanceId": "bluescreen-knife",
            "id": "light-melee",
            "name": "Small Knife",
            "type": "Melee",
            "skill": "meleeWeapon",
            "damage": "1d6",
            "rof": 2,
            "hands": 1,
            "concealable": true,
            "cost": 50,
            "costTier": "Costly",
            "currentMag": 0,
            "loadedAmmoType": "None",
            "weaponTechType": "standard",
            "inHand": false,
            "notes": "Light Melee Weapon: Cuchillo pequeño táctico. ROF 2. Daño 1d6. Ignora el 50% del blindaje SP.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        }
    ],
    "installedCyberwareIds": [
        "cw-cemk-neuroport",
        "cw-cemk-fashion-upgrades",
        "cw-cemk-paraline-deck",
        "cw-cemk-self-ice"
    ],
    "activeInjuries": [],
    "eurodollars": 100,
    "inventory": [
        {
            "id": "inv-bs-shards",
            "catalogId": "memory-shard-blank",
            "name": "Memory Shards (Blank)",
            "category": "gear",
            "cost": 20,
            "quantity": 2,
            "details": "2 chips de memoria en blanco para volcado de datos extraídos."
        },
        {
            "id": "inv-bs-lockpick",
            "catalogId": "lock-picking-set",
            "name": "Lock Picking Set",
            "category": "gear",
            "cost": 20,
            "quantity": 1,
            "details": "Ganzúas mecánicas de precisión para cerraduras físicas convencionales."
        },
        {
            "id": "inv-bs-techtool",
            "catalogId": "techtool",
            "name": "Techtool",
            "category": "gear",
            "cost": 100,
            "quantity": 1,
            "details": "Herramienta multifunción electrónica de bolsillo."
        },
        {
            "id": "inv-bs-ammo",
            "catalogId": "heavy-pistol-ammo-basic",
            "name": "Basic Heavy Pistol Ammunition",
            "category": "ammunition",
            "cost": 60,
            "quantity": 21,
            "details": "21 balas pesadas de recarga para pistola Lexington."
        }
    ],
    "hasNeuroport": true,
    "era": "2077",
    "creationMethod": "pregen",
    "lifepath": {
        "culturalRegion": "Neo-Asian / Night City Sprawl (Watson)",
        "personality": "Hiperconcentrada, cínica, sarcástica y mucho más cómoda entre subredes que tratando con carne.",
        "clothingStyle": "Street Casual / Ropa techwear holgada con cables luminiscentes y parches cyberpunk.",
        "hairstyle": "Corte bob asimétrico teñido en azul cobalto brillante.",
        "affectation": "Mueve los dedos en el aire tecleando consolas virtuales invisibles en su campo de visión.",
        "valueMost": "El acceso irrestricto al conocimiento y mantenerse indetectada.",
        "feelAboutPeople": "La gente es lenta, confusa y ruidosa; el código nunca miente.",
        "valuedPerson": "Un Netrunner veterano conocido como 'NullPointer' que le salvó de freírse en una inmersión.",
        "valuedPossession": "Su cyberdeck Paraline Mk.1-5 personalizado con scripts de intrusión propietarios.",
        "familyBackground": "Criada en un bloque de apartamentos masivo de Watson (Megabuilding H10).",
        "childhoodEnvironment": "Pasillos oscuros, ruido de servidores y terminales pirata de la CitiNet.",
        "familyCrisis": "Una redada de NetWatch desmanteló el nodo de su colectivo y arrestó a sus compañeros.",
        "friends": [
            "Vendedora de tecnología de segunda mano en el mercado Kabuki",
            "Info-broker independiente"
        ],
        "tragicLoveAffairs": [
            "Un Netrunner que intentó cruzar el Blackwall y quedó en muerte cerebral"
        ],
        "enemies": [
            {
                "id": "en-folio-scribe-1",
                "who": "Agente de Campo de NetWatch",
                "cause": "Bluescreen le borró la base de datos de sospechosos de su terminal",
                "throwAtYou": "Fuerzas de seguridad de la red",
                "reaction": "Tiene una orden de captura prioritaria y la rastrea en cuanto se conecta"
            }
        ],
        "roleLifepath": {
            "netrunnerStyle": "Quickhacker Móvil / Breacher Táctico 2077",
            "favoriteHardware": "Paraline Cyberdeck & Neuroport Direct Link"
        },
        "lifeGoal": "Infiltrarse en los servidores centrales de Arasaka y liberar un archivo de datos prohibido."
    },
    "portraitId": "cemk-bluescreen",
    "interfaceRankOverride": 4
},
  {
    "id": "cemk-folio-insurance",
    "handle": "Insurance [CEMK Folio]",
    "role": "Medtech",
    "roleRank": 4,
    "roleAbilityVariant": "core",
    "improvementPoints": 0,
    "ipLog": [],
    "medicineAllocation": { "surgery": 2, "pharmaceuticals": 1, "cryosystem": 0, "knownPharmaceuticals": ["Speedheal"] },
    "roleAbilityName": "Medicine",
    "notes": "FOLIO CANÓNICO CEMK 2077 (Págs 17-20):\n- Habilidad Médica (Medicine 4): Permite el uso de la habilidad Surgery con Base 12 (TECH 8 + LVL 4) para tratar heridas críticas graves.\n- Inyección Speedheal: 1 vez por Beat puede administrar Speedheal para restaurar de inmediato una cantidad de HP igual a BODY + WILL (en Insurance cura 7 + 5 = 12 HP).\n- Daño Brawling: 3d6 (BODY 7). Choke y Slam hacen 7 puntos de daño directo a la vida sin considerar blindaje.",
    "stats": {
        "INT": 7,
        "REF": 6,
        "DEX": 5,
        "TECH": 8,
        "COOL": 5,
        "WILL": 5,
        "LUCK": 6,
        "MOVE": 6,
        "BODY": 7,
        "EMP": 7
    },
    "currentHp": 40,
    "currentLuck": 6,
    "currentHumanity": 70,
    "headArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "bodyArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "skills": {
        "handgun": 6,
        "shoulderArms": 0,
        "autofire": 6,
        "heavyWeapons": 0,
        "archery": 0,
        "meleeWeapon": 0,
        "brawling": 3,
        "martialArts": 0,
        "evasion": 5,
        "athletics": 3,
        "firstAid": 2,
        "paramedic": 6,
        "cybertech": 0,
        "perception": 4,
        "concentration": 6,
        "resistTortureDrugs": 6
    },
    "generalSkills": {
        "acting": 0,
        "athletics": 3,
        "autofire": 6,
        "brawling": 3,
        "bribery": 0,
        "business": 0,
        "composition": 0,
        "concealreveal": 0,
        "concentration": 6,
        "conversation": 6,
        "cybertech": 0,
        "dance": 0,
        "deduction": 0,
        "drivelandvehicle": 0,
        "education": 6,
        "electronicssecurity": 0,
        "evasion": 5,
        "firstaid": 2,
        "handgun": 6,
        "heavyweapons": 0,
        "humanperception": 6,
        "interrogation": 5,
        "librarysearch": 2,
        "meleeweapon": 0,
        "medicaltech": 1,
        "paramedic": 6,
        "perception": 4,
        "persuasion": 6,
        "picklock": 0,
        "pickpocket": 0,
        "playinstrument": 0,
        "resisttorturedrugs": 6,
        "shoulderarms": 0,
        "stealth": 5,
        "streetwise": 6,
        "trading": 0,
        "wardrobeAndstyle": 0
    },
    "equippedWeapons": [
        {
            "instanceId": "insurance-shingen",
            "id": "arasaka-tki20-shingen",
            "name": "Arasaka TKI-20 Shingen",
            "type": "Ranged",
            "skill": "handgun",
            "damage": "3d6",
            "rof": 1,
            "hands": 2,
            "concealable": false,
            "cost": 1000,
            "costTier": "Very Expensive",
            "currentMag": 30,
            "standardMag": 30,
            "loadedAmmoType": "Basic Heavy Pistol Ammunition",
            "ammoType": "Heavy Pistol",
            "weaponTechType": "smart",
            "inHand": true,
            "reserveAmmo": 30,
            "notes": "Smart Weapon: +1 a Tiradas de Ataque (ya incluido en la base 13). Disparo Único (Handgun): 3d6 daño consumiendo 3 balas (o 2d6 si quedan menos de 3). Fuego Automático (Autofire x4): Usa habilidad Autofire (Base 12), daño 2d6 × margen (hasta x4) consumiendo 10 balas.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        },
        {
            "instanceId": "insurance-scalpel",
            "id": "light-melee",
            "name": "Scalpel",
            "type": "Melee",
            "skill": "meleeWeapon",
            "damage": "1d6",
            "rof": 2,
            "hands": 1,
            "concealable": true,
            "cost": 50,
            "costTier": "Costly",
            "currentMag": 0,
            "loadedAmmoType": "None",
            "weaponTechType": "standard",
            "inHand": false,
            "notes": "Light Melee Weapon: Bisturí quirúrgico de altísima precisión. +1 a Tiradas de Ataque (ya incluido). ROF 2. Daño 1d6. Ignora el 50% del blindaje SP.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        }
    ],
    "installedCyberwareIds": [
        "cw-cemk-neuroport",
        "cw-cemk-smartlink"
    ],
    "activeInjuries": [],
    "eurodollars": 100,
    "inventory": [
        {
            "id": "inv-ins-bag",
            "catalogId": "medtech-bag",
            "name": "Medtech Bag",
            "category": "gear",
            "cost": 100,
            "quantity": 1,
            "details": "Bolsa médica con instrumental para intervenciones y cirugía de campo."
        },
        {
            "id": "inv-ins-speedheal",
            "catalogId": "speedheal",
            "name": "Speedheal",
            "category": "drugs",
            "cost": 100,
            "quantity": 1,
            "details": "Dosis médica de regeneración celular rápida: restaura BODY + WILL = 12 HP al paciente de inmediato."
        },
        {
            "id": "inv-ins-ammo",
            "catalogId": "heavy-pistol-ammo-basic",
            "name": "Basic Heavy Pistol Ammunition",
            "category": "ammunition",
            "cost": 60,
            "quantity": 30,
            "details": "30 balas pesadas de reserva para el subfusil Shingen."
        }
    ],
    "hasNeuroport": true,
    "era": "2077",
    "creationMethod": "pregen",
    "lifepath": {
        "culturalRegion": "Eastern European / Santo Domingo Urban",
        "personality": "Pragmática, sarcástica, desensibilizada a la sangre pero protectora feroz de su cuadrilla.",
        "clothingStyle": "Utility / Bata técnica quirúrgica reforzada sobre Light Armorjack.",
        "hairstyle": "Coleta trenzada ajustada para evitar molestias durante intervenciones.",
        "affectation": "Olor constante a antiséptico sintético, comprobando biometrías de aliados en su HUD.",
        "valueMost": "La supervivencia del equipo y el juramento de salvar vidas en combate.",
        "feelAboutPeople": "La carne es frágil e imprudente; siempre se desangran en el peor momento posible.",
        "valuedPerson": "Su mentora, una jefa de escuadrón de Trauma Team retirada en Arroyo.",
        "valuedPossession": "Su juego de bisturís de titanio y su subfusil Shingen calibrado.",
        "familyBackground": "Hija de enfermeros de dispensarios comunitarios en Santo Domingo.",
        "childhoodEnvironment": "Salas de urgencias saturadas, clínicas clandestinas de ripperdocs y tiroteos callejeros.",
        "familyCrisis": "Su clínica familiar fue asaltada por chatarreros carroñeros en busca de implantes.",
        "friends": [
            "Ripperdoc veterano de confianza en Kabuki",
            "Distribuidor de fármacos de contrabando"
        ],
        "tragicLoveAffairs": [
            "Un paciente crítico al que no pudo salvar en la mesa de operaciones pese a horas de reanimación"
        ],
        "enemies": [
            {
                "id": "en-folio-retro-1",
                "who": "Líder de una banda de Scavengers",
                "cause": "Insurance le amputó la mano con un bisturí cuando intentaban saquear su ambulancia",
                "throwAtYou": "Banda de carroñeros de ciberware",
                "reaction": "Le tenderán una emboscada en cuanto atienda un aviso médico en su zona"
            }
        ],
        "roleLifepath": {
            "medtechSpecialty": "Cirugía de Combate / Triage Táctico",
            "traumaTeamStatus": "Ex-contratista independiente"
        },
        "lifeGoal": "Construir una clínica médica autónoma y gratuita en Santo Domingo protegida contra corporaciones."
    },
    "portraitId": "cemk-insurance"
},
  {
    "id": "cemk-folio-thorn",
    "handle": "Thorn [CEMK Folio]",
    "role": "Rockerboy",
    "roleRank": 4,
    "roleAbilityVariant": "core",
    "improvementPoints": 0,
    "ipLog": [],
    "roleAbilityName": "Charismatic Impact",
    "notes": "FOLIO CANÓNICO CEMK 2077 (Págs 21-24):\n- Impacto Carismático (Charismatic Impact 4): Si el GM determina que un NPC es fanático o seguidor, gana un bono de +4 a todos los chequeos sociales (Acting, Bribery, Conversation, Interrogation y Persuasion).\n- Modulador Vocal Dynalar AudioVox: Otorga +2 a Acting y Play Instrument al cantar (ya reflejado en Base 15 y Base 13).\n- Injerto Óseo y Muscular (BODY 10): 55 Puntos de Vida, Umbral de Herido Grave 28, Salvación de Muerte 10. Permite disparar la Budget Arms Carnage sin penalizador por retroceso.\n- Daño Brawling: 3d6 (BODY 10). Choke y Slam hacen 10 puntos de daño directo a HP.",
    "stats": {
        "INT": 4,
        "REF": 6,
        "DEX": 7,
        "TECH": 5,
        "COOL": 7,
        "WILL": 8,
        "LUCK": 4,
        "MOVE": 7,
        "BODY": 8,
        "EMP": 6
    },
    "currentHp": 55,
    "currentLuck": 4,
    "currentHumanity": 60,
    "headArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "bodyArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "skills": {
        "handgun": 2,
        "shoulderArms": 6,
        "autofire": 0,
        "heavyWeapons": 0,
        "archery": 0,
        "meleeWeapon": 0,
        "brawling": 6,
        "martialArts": 0,
        "evasion": 6,
        "athletics": 5,
        "firstAid": 6,
        "paramedic": 0,
        "cybertech": 0,
        "perception": 4,
        "concentration": 5,
        "resistTortureDrugs": 0
    },
    "generalSkills": {
        "acting": 6,
        "athletics": 5,
        "autofire": 0,
        "brawling": 6,
        "bribery": 0,
        "business": 0,
        "composition": 6,
        "concealreveal": 0,
        "concentration": 5,
        "conversation": 6,
        "cybertech": 0,
        "dance": 4,
        "deduction": 0,
        "drivelandvehicle": 4,
        "education": 4,
        "electronicssecurity": 0,
        "evasion": 6,
        "firstaid": 6,
        "handgun": 2,
        "heavyweapons": 0,
        "humanperception": 6,
        "interrogation": 0,
        "librarysearch": 4,
        "meleeweapon": 0,
        "paramedic": 0,
        "perception": 4,
        "persuasion": 6,
        "picklock": 0,
        "pickpocket": 0,
        "playinstrument": 6,
        "resisttorturedrugs": 0,
        "shoulderarms": 6,
        "stealth": 6,
        "streetwise": 6,
        "trading": 0,
        "wardrobeAndstyle": 6
    },
    "equippedWeapons": [
        {
            "instanceId": "thorn-carnage",
            "id": "budget-arms-carnage",
            "name": "Budget Arms Carnage",
            "type": "Ranged",
            "skill": "shoulderArms",
            "damage": "5d6",
            "rof": 1,
            "hands": 2,
            "concealable": false,
            "cost": 500,
            "costTier": "Expensive",
            "currentMag": 5,
            "standardMag": 5,
            "loadedAmmoType": "Basic Shotgun Slugs",
            "ammoType": "Shotgun Slug",
            "weaponTechType": "power",
            "inHand": true,
            "reserveAmmo": 10,
            "notes": "Power Weapon: Requiere BODY 10 (cumplido con creces). Aumenta el daño de Herida Crítica en +5. Permite rebote de proyectil con penalizador -4. Calidad Pobre (Poor Quality): Se encasquilla con un 1 natural en el dado (el tiro sale pero desatascarla cuesta 1 Acción). Disparo con Posta (Slug): Shoulder Arms, 5d6 daño. Disparo con Cartucho (Shell): Shoulder Arms vs DV 13, 3d6 daño en área de 6m delante del usuario.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        }
    ],
    "installedCyberwareIds": [
        "cw-cemk-neuroport",
        "cw-cemk-fashion-upgrades",
        "cw-cemk-grafted-muscle",
        "cw-cemk-audiovox"
    ],
    "activeInjuries": [],
    "eurodollars": 100,
    "inventory": [
        {
            "id": "inv-th-guitar",
            "catalogId": "electric-guitar",
            "name": "Electric Guitar & Pocket Amp",
            "category": "gear",
            "cost": 100,
            "quantity": 1,
            "details": "Guitarra eléctrica personalizada con mini-amplificador de bolsillo de alta potencia."
        },
        {
            "id": "inv-th-recorder",
            "catalogId": "audio-recorder",
            "name": "Audio Recorder",
            "category": "gear",
            "cost": 50,
            "quantity": 1,
            "details": "Grabadora externa para volcar canciones y manifiestos a shards de memoria."
        },
        {
            "id": "inv-th-shards",
            "catalogId": "memory-shard-blank",
            "name": "Memory Shards (Blank)",
            "category": "gear",
            "cost": 20,
            "quantity": 2,
            "details": "2 chips de memoria para distribución musical y propaganda clandestina."
        },
        {
            "id": "inv-th-ammo",
            "catalogId": "shotgun-slug-basic",
            "name": "Basic Shotgun Slugs",
            "category": "ammunition",
            "cost": 60,
            "quantity": 10,
            "details": "10 postas pesadas de escopeta para recargar la Carnage."
        }
    ],
    "hasNeuroport": true,
    "era": "2077",
    "creationMethod": "pregen",
    "lifepath": {
        "culturalRegion": "Latin American / Heywood Native",
        "personality": "Apasionado, desafiante, ruidoso y con carisma magnético ante las multitudes.",
        "clothingStyle": "Glam Rock / Cuero tachonado, pelo fluorescente tech hair y ropa desgarrada con estilo.",
        "hairstyle": "Puntas tech hair de fibra óptica magenta que cambian de color según el ritmo vocal.",
        "affectation": "Adopta poses teatrales teatrales dramáticas y golpea ritmos sobre su escopeta Carnage.",
        "valueMost": "La autenticidad artística y la rebelión pura sin venderse a las corporaciones.",
        "feelAboutPeople": "La masa es un polvorín esperando una chispa; las corporaciones son sanguijuelas.",
        "valuedPerson": "Un veterano guitarrista del Red Rock que le regaló su primer amplificador antes de morir.",
        "valuedPossession": "Su guitarra eléctrica con el mástil reforzado con fibra de carbono.",
        "familyBackground": "Familia comunitaria de Heywood ligada a sindicatos obreros.",
        "childhoodEnvironment": "Callejones con murales de grafiti, clubes de sótano y fiestas callejeras.",
        "familyCrisis": "El local donde tocaba su primera banda fue incendiado por matones de una promotora corporativa.",
        "friends": [
            "Ingeniera de sonido de garaje",
            "DJ de radio pirata que emite desde un aerostato"
        ],
        "tragicLoveAffairs": [
            "Una seguidora que murió trágicamente en un motín policial durante uno de sus conciertos"
        ],
        "enemies": [
            {
                "id": "en-folio-bullseye-1",
                "who": "Ejecutivo discográfico de Arasaka Media",
                "cause": "Thorn rechazó un contrato multimillonario y destrozó el despacho del ejecutivo con su amplificador",
                "throwAtYou": "Corporación mediática",
                "reaction": "Enviará sicarios para censurarlo permanentemente"
            }
        ],
        "roleLifepath": {
            "rockerboyStyle": "Líder de banda de punk-rock / Poeta insurgente",
            "musicGenre": "Industrial Chromerock / Riotcore"
        },
        "lifeGoal": "Encender un levantamiento cultural masivo que derribe los carteles de Arasaka Tower."
    },
    "portraitId": "cemk-thorn"
},
  {
    "id": "cemk-folio-maven",
    "handle": "Maven [CEMK Folio]",
    "role": "Tech",
    "roleRank": 4,
    "roleAbilityVariant": "core",
    "improvementPoints": 0,
    "ipLog": [],
    "makerAllocation": { "field": 4, "upgrade": 0, "fabrication": 0, "invention": 0 },
    "roleAbilityName": "Maker",
    "notes": "FOLIO CANÓNICO CEMK 2077 (Págs 25-28):\n- Genio de la Técnica (Maker 4): +4 a chequeos de Cybertech (Base 17) y Electronics/Security (Base 18).\n- Ciberóptico Personalizado de Maven: Fabricado por ella misma; concede +2 a Conceal/Reveal y a chequeos de Perception visual (ambos con Base 14).\n- Paraline Self-ICE: Cortafuegos que obliga a un Netrunner enemigo a superar un Passwall DV 6 con 1 Net Action antes de poder hackearla.\n- Combo de Armas de Alto Impacto: Satara Tech perfora coberturas y 50% de SP a corta distancia, y Grad Sniper castiga a larga distancia con +1 de calidad excelente.",
    "stats": {
        "INT": 8,
        "REF": 7,
        "DEX": 5,
        "TECH": 8,
        "COOL": 5,
        "WILL": 5,
        "LUCK": 6,
        "MOVE": 7,
        "BODY": 6,
        "EMP": 5
    },
    "currentHp": 40,
    "currentLuck": 6,
    "currentHumanity": 50,
    "headArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "bodyArmor": {
        "name": "Light Armorjack (CEMK 2077)",
        "maxSp": 11,
        "currentSp": 11,
        "penalty": 0
    },
    "skills": {
        "handgun": 6,
        "shoulderArms": 6,
        "autofire": 0,
        "heavyWeapons": 0,
        "archery": 0,
        "meleeWeapon": 0,
        "brawling": 3,
        "martialArts": 0,
        "evasion": 5,
        "athletics": 3,
        "firstAid": 2,
        "paramedic": 3,
        "cybertech": 5,
        "perception": 6,
        "concentration": 6,
        "resistTortureDrugs": 0
    },
    "generalSkills": {
        "acting": 0,
        "athletics": 3,
        "autofire": 0,
        "brawling": 3,
        "bribery": 0,
        "business": 0,
        "composition": 3,
        "concealreveal": 3,
        "concentration": 6,
        "conversation": 2,
        "cybertech": 5,
        "dance": 3,
        "deduction": 6,
        "drivelandvehicle": 3,
        "education": 2,
        "electronicssecurity": 6,
        "evasion": 5,
        "firstaid": 2,
        "handgun": 6,
        "heavyweapons": 0,
        "humanperception": 4,
        "interrogation": 0,
        "librarysearch": 5,
        "meleeweapon": 0,
        "paramedic": 3,
        "perception": 6,
        "persuasion": 2,
        "picklock": 2,
        "pickpocket": 0,
        "playinstrument": 0,
        "resisttorturedrugs": 0,
        "shoulderarms": 6,
        "stealth": 6,
        "streetwise": 4,
        "trading": 5,
        "wardrobeAndstyle": 3
    },
    "equippedWeapons": [
        {
            "instanceId": "maven-satara",
            "id": "rostovic-db2-satara",
            "name": "Rostović DB-2 Satara",
            "type": "Ranged",
            "skill": "shoulderArms",
            "damage": "5d6",
            "rof": 1,
            "hands": 2,
            "concealable": false,
            "cost": 1000,
            "costTier": "Very Expensive",
            "currentMag": 2,
            "standardMag": 2,
            "loadedAmmoType": "Basic Shotgun Slugs",
            "ammoType": "Shotgun Slug",
            "weaponTechType": "tech",
            "inHand": true,
            "reserveAmmo": 10,
            "notes": "Tech Weapon: Mira con detección de siluetas tras coberturas delgadas. Sacrificando la Acción de Movimiento se carga el arma durante 60s (20 asaltos) o hasta disparar. Disparo Cargado: ROF 1, dispara a través de coberturas delgadas e ignora la mitad del SP del defensor (redondeado hacia arriba). Posta (Slug): 5d6 daño. Cartucho (Shell): Shoulder Arms vs DV 13, 3d6 daño en área de 6m.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        },
        {
            "instanceId": "maven-grad",
            "id": "techtronika-spt32-grad",
            "name": "Techtronika SPT32 Grad",
            "type": "Ranged",
            "skill": "shoulderArms",
            "damage": "5d6",
            "rof": 1,
            "hands": 2,
            "concealable": false,
            "cost": 1000,
            "costTier": "Very Expensive",
            "currentMag": 4,
            "standardMag": 4,
            "loadedAmmoType": "Basic Rifle Ammunition",
            "ammoType": "Rifle",
            "weaponTechType": "power",
            "inHand": false,
            "reserveAmmo": 4,
            "notes": "Power Weapon / Heavy Bolt-Action Sniper Rifle: Calidad Excelente (+1 tiradas de ataque ya incluido en Base 14). Aumenta daño de Herida Crítica en +5. Permite rebote a -4. Cerrojo manual: requiere 1 Acción de recarga antes de poder disparar de nuevo. Si el blindaje del objetivo tiene SP < 11, ignora el 50% de dicho SP.",
            "sourceBook": "cemk_2077",
            "sourceBookTitle": "Cyberpunk: Edgerunners Mission Kit",
            "era": "2077"
        }
    ],
    "installedCyberwareIds": [
        "cw-cemk-neuroport",
        "cw-cemk-maven-optic",
        "cw-cemk-fashion-upgrades",
        "cw-cemk-self-ice"
    ],
    "activeInjuries": [],
    "eurodollars": 100,
    "inventory": [
        {
            "id": "inv-mv-techbag",
            "catalogId": "tech-bag",
            "name": "Tech Bag",
            "category": "gear",
            "cost": 100,
            "quantity": 1,
            "details": "Bolsa de técnico con instrumental para reparaciones de campo, calibración y despiece."
        },
        {
            "id": "inv-mv-slugs",
            "catalogId": "shotgun-slug-basic",
            "name": "Basic Shotgun Slugs",
            "category": "ammunition",
            "cost": 60,
            "quantity": 10,
            "details": "10 postas de escopeta para la Satara."
        },
        {
            "id": "inv-mv-rifle-ammo",
            "catalogId": "rifle-ammo-basic",
            "name": "Basic Rifle Ammunition",
            "category": "ammunition",
            "cost": 50,
            "quantity": 4,
            "details": "4 cartuchos pesados de francotirador para el rifle Grad."
        }
    ],
    "hasNeuroport": true,
    "era": "2077",
    "creationMethod": "pregen",
    "lifepath": {
        "culturalRegion": "Afro-Caribbean / Pacifica-Watson Transplant",
        "personality": "Curiosa, analítica, meticulosa y apasionada por descifrar la tecnología de vanguardia.",
        "clothingStyle": "Urban Techwear / Chaleco multirrecipiente con herramientas de precisión y visores de fibra óptica.",
        "hairstyle": "Dreadlocks cortos y recogidos en una banda técnica con sensores auxiliares.",
        "affectation": "Desmonta y vuelve a montar pequeños actuadores mecánicos entre sus dedos cuando reflexiona.",
        "valueMost": "La maestría artesanal, la autosuficiencia técnica y la innovación sin restricciones.",
        "feelAboutPeople": "Las personas fallan igual que las máquinas, pero a las máquinas siempre puedes cambiarlas de pieza.",
        "valuedPerson": "Un antiguo ingeniero tránsfuga de Militech que le enseñó diseño de armamento electromagnético.",
        "valuedPossession": "Su ciberóptico personalizado fabricado en su propio taller casero.",
        "familyBackground": "Familia de torneros y recuperadores de desguaces industriales en Pacifica.",
        "childhoodEnvironment": "Desguaces masivos, bahías de reparación de drones y talleres piratas.",
        "familyCrisis": "El cierre repentino de la fábrica donde trabajaba su familia los arrojó a la insolvencia.",
        "friends": [
            "Traficante de componentes de grado militar",
            "Operador de drones de reconocimiento"
        ],
        "tragicLoveAffairs": [
            "Un socio de investigación que vendió sus planos a Kang Tao y desapareció con los fondos"
        ],
        "enemies": [
            {
                "id": "en-folio-slider-1",
                "who": "Inspector de Propiedad Intelectual Corporativa",
                "cause": "Maven clonó y mejoró el firmware de un rifle Techtronika patentado",
                "throwAtYou": "Agente de contrainteligencia",
                "reaction": "Enviará equipos de asalto para incautar sus prototipos y silenciarla"
            }
        ],
        "roleLifepath": {
            "techSpecialty": "Armera de Combate / Ciber-Ingeniera de Vanguardia",
            "workspace": "Taller clandestino en Santo Domingo"
        },
        "lifeGoal": "Desarrollar un prototipo de armamento Tech revolucionario que libere a las calles del monopolio corporativo."
    },
    "portraitId": "cemk-maven"
},
];
