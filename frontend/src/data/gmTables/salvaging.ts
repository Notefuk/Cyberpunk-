// Generado por scripts/gen_gm_tables.py [Claude Code · 2026-11-11] v5.19.0 (plan 27). No editar a mano: editar el JSON de docs/plans/work/plan27-v5.19.0/ y volver a generar.
// Los textos en español son resúmenes propios; nombres y números como en el libro.
import type { GmTable } from './types';

export interface SalvageWorth { worth: string; anyDv: string; specificDv: string }
export interface SalvageLocation { name: string; textEs: string; source: string }

export const SALVAGING_INTRO = "Actividad de downtime: se rebusca chatarra en zonas de ruinas para conseguir equipo usable o vendible. Hace falta conocimiento, un tech toolkit y forma de acarrear lo hallado, y es peligroso por el entorno y la gente.";

export const SALVAGING_STEPS: string[] = [
  "Un intento de salvaging lleva una semana y no puede hacerse en días con otra actividad de downtime",
  "Paso 1: elegir categoría de bienes; si se acepta lo que salga, tirar 1d6 en Salvage Categories",
  "Paso 2: Basic Tech Skill Check; cuanto más alto, más worth; el DV depende de si se busca categoría específica o 'Take What You Can Find'",
  "Un Critical Failure (1 en el 1d10) va al Paso 2a: tirar en Perils of Salvaging",
  "Paso 3: elegir bienes de la categoría cuyo Cost sume el worth logrado; el worth sobrante se pierde",
  "Los ítems salvados quedan Destroyed y se reparan con la Tech Skill apropiada (CP:R p.140)",
  "Ejemplo: Torch saca 3 (General Gear), total 25 vence DV 24 y obtiene 500eb de ítems"
];

export const SALVAGE_LOCATIONS: SalvageLocation[] = [
  {
    "name": "The Hot Zone",
    "textEs": "Enorme pila de ruinas circular en el centro de la ciudad; mucha tecnología rota, pero scavvers y zonas radiactivas.",
    "source": "Salvaging Night City p.3"
  },
  {
    "name": "Combat Zones",
    "textEs": "South Night City, Old Combat Zone, Old Japantown y Little China; lo bueno ya fue rebuscado, con suerte hay algún hallazgo.",
    "source": "Salvaging Night City p.3"
  },
  {
    "name": "Scrapyards",
    "textEs": "Basura de demoliciones lista para saquear, pero con seguridad corporativa que dispara primero.",
    "source": "Salvaging Night City p.3"
  },
  {
    "name": "The Perimeter",
    "textEs": "Bordes de la ciudad y Badlands: pueblos, estaciones, moteles y fábricas abandonadas; se negocia con Nomads, no hay gangs.",
    "source": "Salvaging Night City p.4"
  }
];

export const SALVAGE_CATEGORIES: GmTable = {
  "id": "salvage-categories",
  "title": "Salvage Categories",
  "die": "1d6",
  "rows": [
    {
      "roll": "1",
      "text": "Cyberware"
    },
    {
      "roll": "2",
      "text": "Weapons"
    },
    {
      "roll": "3",
      "text": "General Gear"
    },
    {
      "roll": "4",
      "text": "General Gear"
    },
    {
      "roll": "5",
      "text": "Armor"
    },
    {
      "roll": "6",
      "text": "Cyberdecks and Programs"
    }
  ],
  "source": "Salvaging Night City p.4"
};

/** Basic Tech: el DV según el valor buscado y si se acepta cualquier categoría o una específica. */
export const SALVAGE_WORTH: SalvageWorth[] = [
  {
    "worth": "10eb",
    "anyDv": "DV 9",
    "specificDv": "DV 13"
  },
  {
    "worth": "20eb",
    "anyDv": "DV 13",
    "specificDv": "DV 15"
  },
  {
    "worth": "50eb",
    "anyDv": "DV 15",
    "specificDv": "DV 17"
  },
  {
    "worth": "100eb",
    "anyDv": "DV 17",
    "specificDv": "DV 21"
  },
  {
    "worth": "500eb",
    "anyDv": "DV 24",
    "specificDv": "DV 29"
  },
  {
    "worth": "1000eb",
    "anyDv": "DV 29",
    "specificDv": "N/A"
  }
];
export const SALVAGE_WORTH_SOURCE = "Salvaging Night City p.5";

export const PERILS_OF_SALVAGING: GmTable = {
  "id": "perils-of-salvaging",
  "title": "Perils of Salvaging",
  "die": "1d6",
  "rows": [
    {
      "roll": "1",
      "text": "Se derrumba una estructura: 6d6 de daño (reducido por armadura) y una Critical Injury (tabla Body, CP:R p.221)."
    },
    {
      "roll": "2",
      "text": "Tiroteo: 6d6 de daño (reducido por armadura)."
    },
    {
      "roll": "3",
      "text": "Exposición a High Level Radiation (CP:R p.181) por 1d10 rondas; un Radiation Suit lo anula."
    },
    {
      "roll": "4",
      "text": "Caés 30 m/yds por colapso del suelo: 6d6 de daño (reducido por armadura) salvo Grapple Hand/Gun o agarrarse del borde (CP:R p.181)."
    },
    {
      "roll": "5",
      "text": "Bolsa de gas tóxico (como Vial of Biotoxin, CP:R p.355) por 1 ronda; Anti-Smog Breathing Mask u oxígeno lo anula."
    },
    {
      "roll": "6",
      "text": "Tocás un cable vivo y te electrocutás 1 ronda (CP:R p.180)."
    }
  ],
  "source": "Salvaging Night City p.5"
};
