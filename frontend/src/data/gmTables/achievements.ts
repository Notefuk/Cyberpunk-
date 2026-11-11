// Generado por scripts/gen_gm_tables.py [Claude Code · 2026-11-11] v5.19.0 (plan 27). No editar a mano: editar el JSON de docs/plans/work/plan27-v5.19.0/ y volver a generar.
// Los textos en español son resúmenes propios; nombres y números como en el libro.
import type { GmTable } from './types';

export interface Achievement { name: string; conditionEs: string; source: string }

export const ACHIEVEMENTS: Achievement[] = [
  {
    "name": "15 Minutes of Fame",
    "conditionEs": "Llegar a Reputación nivel 7.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Bad Day",
    "conditionEs": "Sobrevivir a un combate donde la Crew recibe 3 o más Critical Injuries; todos deben sobrevivir.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Chamber 36",
    "conditionEs": "Derrotar a un enemigo en combate singular con Martial Arts de base 18+, usando solo Brawling, Evasion, Melee Weapon y Martial Arts.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Chippin' In",
    "conditionEs": "Instalar cyberware con Humanity Loss en un PJ sin cyberware (su primer cyberware).",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Clotheshorse",
    "conditionEs": "Conseguir una prenda de cada estilo de moda del libro base.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Dirty Duck",
    "conditionEs": "Bañarse en una bañera llena con al menos 100,000eb en efectivo.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Double Kill",
    "conditionEs": "Matar a más de un enemigo con un solo explosivo.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Flatlined",
    "conditionEs": "Hacer un funeral para un PJ muerto.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Gamer",
    "conditionEs": "Completar una mazmorra en Elflines Online sin que muera ningún elfo del grupo.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Going Dark",
    "conditionEs": "Completar un trabajo Typical o Dangerous sin una sola Ronda de combate.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Ground Zero",
    "conditionEs": "Pararse en las ruinas de las Arasaka Towers.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "The Happiest Place",
    "conditionEs": "Subirse a la montaña rusa de Playland by the Sea y sobrevivir.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "High Life",
    "conditionEs": "Que todo el grupo compre un Fresh Food Lifestyle en el mismo mes.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Inner Peace",
    "conditionEs": "Recuperar al menos 14 puntos de Humanity con Therapy en una o más sesiones.",
    "source": "Interface RED Vol. 4 p.25"
  },
  {
    "name": "Investment",
    "conditionEs": "Comprar un ítem Luxury o Super Luxury en un Night Market o Midnight Market.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Longshot",
    "conditionEs": "Matar a un enemigo con un headshot de sniper rifle a 800 m/yds.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Night City Legend",
    "conditionEs": "Llegar a nivel 10 en una Skill, rango 10 en un Role Ability, o en Reputation.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "One is the Loneliest #",
    "conditionEs": "Terminar una pelea con exactamente 1 HP.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Payday",
    "conditionEs": "Completar y cobrar un Dangerous Job.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Perfect Attendance",
    "conditionEs": "Que todos los jugadores lleguen a horario tres sesiones seguidas.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Input/Output",
    "conditionEs": "Tener una cita en Night City.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Pub Crawl",
    "conditionEs": "Comprar y tomar una bebida en un bar de cada distrito de Night City.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Self-Improvement",
    "conditionEs": "Cursar o auditar un curso en Night City University.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Strange Weather",
    "conditionEs": "Sobrevivir un combate al aire libre durante un evento climático raro (Blood Rain, Acid Rain, Sandstorm).",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "The Edge",
    "conditionEs": "Llegar a Empathy 1 o menos después de la creación, por instalar cyberware.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Totaled",
    "conditionEs": "Destruir un vehículo de un miembro de la Crew o de su familia Nomad.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Trophy Hunter",
    "conditionEs": "Juntar un ítem distintivo de cada facción: Bozos, Inquisitors, Maelstrom, Piranhas, Red Chrome Legion, Tyger Claws, NCPD, Trauma Team y Danger Gal.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Vengeance",
    "conditionEs": "Matar al personaje directamente responsable de la muerte de un PJ.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "Road Warrior",
    "conditionEs": "Sobrevivir una misión en los Badlands fuera de Night City.",
    "source": "Interface RED Vol. 4 p.26"
  },
  {
    "name": "VIP",
    "conditionEs": "Ser invitado a un Midnight Market.",
    "source": "Interface RED Vol. 4 p.26"
  }
];

export const ACHIEVEMENT_RULES: string[] = [
  "Cada Achievement se gana una sola vez por Crew, la primera vez que un PJ (o a veces el jugador) cumple el requisito, a criterio del GM",
  "Se canjea en cualquier momento, sin Action, por decisión unánime del grupo",
  "Opción 1: rerollear un d10 de un jugador ya tirado y quedarse con el mayor; antes de que el GM anuncie el resultado y nunca en Death Saves",
  "Opción 2: recibir una Mystery Box; tirar 1d10 en The Table of Mystery para elegir caja",
  "Abrir la caja es una Action; se tira 1d6 en la tabla de esa caja para ver el contenido",
  "Las armas vienen Fully Loaded con la munición que el GM quiera",
  "La caja aparece sin ruido a 10 m/yds de un Edgerunner, donde nadie de la Crew la observe, incluso en el vacío",
  "Ítems con asterisco (*) son de Black Chrome; sin ese libro, reemplazar por ítem de valor equivalente",
  "Para cajas propias: los precios del contenido siguen el patrón 50, 100, 100, 100, 100, 500 y las armas vienen cargadas"
];

export const TABLE_OF_MYSTERY: GmTable = {
  "id": "table-of-mystery",
  "title": "The Table of Mystery",
  "die": "1d10",
  "rows": [
    {
      "roll": "1",
      "text": "A box bound tightly in rope"
    },
    {
      "roll": "2",
      "text": "A box covered in chipped paint"
    },
    {
      "roll": "3",
      "text": "A box dripping wet with fluid"
    },
    {
      "roll": "4",
      "text": "A box freezing cold to the touch"
    },
    {
      "roll": "5",
      "text": "A box handsomely gift wrapped"
    },
    {
      "roll": "6",
      "text": "A box marked with a lime green X"
    },
    {
      "roll": "7",
      "text": "A box melted out of shape"
    },
    {
      "roll": "8",
      "text": "A box sealed with a lipstick kiss"
    },
    {
      "roll": "9",
      "text": "A box reeking of oil"
    },
    {
      "roll": "10",
      "text": "A box showing signs of repair"
    }
  ],
  "source": "Interface RED Vol. 4 p.27"
};

/** Contenido de cada caja (1d6), en el mismo orden que la Table of Mystery. */
export const MYSTERY_BOX_CONTENTS: GmTable[] = [
  {
    "id": "box-1",
    "title": "A box bound tightly in rope",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Rope x2, each 60 m/yards"
      },
      {
        "roll": "2",
        "text": "Virtuality Goggles"
      },
      {
        "roll": "3",
        "text": "Grapple Gun"
      },
      {
        "roll": "4",
        "text": "Vial of Poison"
      },
      {
        "roll": "5",
        "text": "Urban Flash Jewelry"
      },
      {
        "roll": "6",
        "text": "Cybermatrix Gang Jazzler (12 Days of Cybermas DLC)"
      }
    ],
    "source": "Interface RED Vol. 4 p.27"
  },
  {
    "id": "box-2",
    "title": "A box covered in chipped paint",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Teargas Grenade"
      },
      {
        "roll": "2",
        "text": "Fully Loaded GunMart Smart Special*"
      },
      {
        "roll": "3",
        "text": "Bicycle (Spinning Your Wheels DLC)"
      },
      {
        "roll": "4",
        "text": "Flare Gun and a Road Flare (Woodchipper's Garage DLC)"
      },
      {
        "roll": "5",
        "text": "Bulletproof Shield"
      },
      {
        "roll": "6",
        "text": "Fully Loaded Militech Crusher (12 Days of Gunmas DLC)"
      }
    ],
    "source": "Interface RED Vol. 4 p.27"
  },
  {
    "id": "box-3",
    "title": "A box dripping wet with fluid",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Can of Smash x5"
      },
      {
        "roll": "2",
        "text": "Airhypo loaded with Black Lace"
      },
      {
        "roll": "3",
        "text": "Bodyweight AutoInjector (Hornet's Pharmacy DLC)"
      },
      {
        "roll": "4",
        "text": "Everest VentureWare AirWell 50*"
      },
      {
        "roll": "5",
        "text": "Poison Grenade"
      },
      {
        "roll": "6",
        "text": "T-R4 Detonator Fluid*"
      }
    ],
    "source": "Interface RED Vol. 4 p.27"
  },
  {
    "id": "box-4",
    "title": "A box freezing cold to the touch",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Bohemian Mirrorshades"
      },
      {
        "roll": "2",
        "text": "Street Viper Riding Suit*"
      },
      {
        "roll": "3",
        "text": "Two Sponsored Cybereyes*"
      },
      {
        "roll": "4",
        "text": "SkidRow Trench*"
      },
      {
        "roll": "5",
        "text": "Airhypo loaded with Prime Time (Hornet's Pharmacy DLC)"
      },
      {
        "roll": "6",
        "text": "Laser Light Street Jacket*"
      }
    ],
    "source": "Interface RED Vol. 4 p.27"
  },
  {
    "id": "box-5",
    "title": "A box handsomely gift wrapped",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Binoculars"
      },
      {
        "roll": "2",
        "text": "Light Armorjack Body"
      },
      {
        "roll": "3",
        "text": "Excellent Quality Medium Pistol"
      },
      {
        "roll": "4",
        "text": "Video Camera"
      },
      {
        "roll": "5",
        "text": "NeuTongue (Must Have Cyberware Deals DLC)"
      },
      {
        "roll": "6",
        "text": "Reflex Co-Processor*"
      }
    ],
    "source": "Interface RED Vol. 4 p.27"
  },
  {
    "id": "box-6",
    "title": "A box marked with a lime green X",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "A boxed copy of Elflines Online"
      },
      {
        "roll": "2",
        "text": "Two Disposable Cell Phones"
      },
      {
        "roll": "3",
        "text": "Modular Finger Cyberhand*"
      },
      {
        "roll": "4",
        "text": "Leisurewear Jewelry"
      },
      {
        "roll": "5",
        "text": "Agent"
      },
      {
        "roll": "6",
        "text": "Smart Glasses"
      }
    ],
    "source": "Interface RED Vol. 4 p.28"
  },
  {
    "id": "box-7",
    "title": "A box melted out of shape",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Scavenged Armor Body (Black Chrome+ DLC)"
      },
      {
        "roll": "2",
        "text": "Incendiary Grenade"
      },
      {
        "roll": "3",
        "text": "Neo-Soviet Cyberarm*"
      },
      {
        "roll": "4",
        "text": "Fully loaded Stolbovoy ST-5 Assault Rifle (12 Days of Gunmas DLC)"
      },
      {
        "roll": "5",
        "text": "Fully Loaded Everest VentureWare SurvivalMaster (Black Chrome+ DLC)"
      },
      {
        "roll": "6",
        "text": "Fully Loaded Flamethrower"
      }
    ],
    "source": "Interface RED Vol. 4 p.28"
  },
  {
    "id": "box-8",
    "title": "A box sealed with a lipstick kiss",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Light Melee Weapon"
      },
      {
        "roll": "2",
        "text": "Mr. Studd™ Sexual Implant"
      },
      {
        "roll": "3",
        "text": "Shuriken Tornado Grenade*"
      },
      {
        "roll": "4",
        "text": "Asia Pop Footwear"
      },
      {
        "roll": "5",
        "text": "Two Businesswear Tops"
      },
      {
        "roll": "6",
        "text": "White Hornet Tanto*"
      }
    ],
    "source": "Interface RED Vol. 4 p.28"
  },
  {
    "id": "box-9",
    "title": "A box reeking of oil",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Fully Loaded GunMart Bubba Buster*"
      },
      {
        "roll": "2",
        "text": "Fully Loaded Overlord Handcannon*"
      },
      {
        "roll": "3",
        "text": "Nomad Leathers Footwear"
      },
      {
        "roll": "4",
        "text": "Fully Loaded Poor Quality Sniper Rifle"
      },
      {
        "roll": "5",
        "text": "Sniping Scope"
      },
      {
        "roll": "6",
        "text": "Smartgun Link"
      }
    ],
    "source": "Interface RED Vol. 4 p.28"
  },
  {
    "id": "box-10",
    "title": "A box showing signs of repair",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Utility Tomahawk*"
      },
      {
        "roll": "2",
        "text": "Holo Projector Palm (Must Have Cyberware Deals DLC)"
      },
      {
        "roll": "3",
        "text": "Techtool"
      },
      {
        "roll": "4",
        "text": "Audio Recorder"
      },
      {
        "roll": "5",
        "text": "Armor Piercing Grenade"
      },
      {
        "roll": "6",
        "text": "Techscanner Cyberware"
      }
    ],
    "source": "Interface RED Vol. 4 p.28"
  }
];
