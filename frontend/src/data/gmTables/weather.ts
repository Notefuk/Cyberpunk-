// Generado por scripts/gen_gm_tables.py [Claude Code · 2026-11-11] v5.19.0 (plan 27). No editar a mano: editar el JSON de docs/plans/work/plan27-v5.19.0/ y volver a generar.
// Los textos en español son resúmenes propios; nombres y números como en el libro.
import type { GmTable } from './types';

export interface WeatherRow { roll: string; conditions: string; temperature: string }
export interface WeatherSeason { id: string; title: string; months: number[]; die: string; rows: WeatherRow[]; source: string }
export interface WeatherRule { title: string; textEs: string; source: string }

export const WEATHER_HOW_TO: string[] = [
  "Para el clima del día se tira dos veces en la tabla del mes: una por Temperature y otra por Current Conditions",
  "Con un 6 en Current Conditions se tira dos veces en Strange Weather (1d10): una por la condición y otra por la duración",
  "El GM puede elegir en vez de tirar, y re-tirar un nuevo Current Condition cuando termina o durante un evento extraño"
];

export const WEATHER_SEASONS: WeatherSeason[] = [
  {
    "id": "dec-feb",
    "title": "Weather: December to February",
    "months": [
      12,
      1,
      2
    ],
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "conditions": "Clear",
        "temperature": "Cold (Around 35°F/2°C)"
      },
      {
        "roll": "2",
        "conditions": "Light Rain/Sleet",
        "temperature": "Cold (Around 40°F/4°C)"
      },
      {
        "roll": "3",
        "conditions": "Overcast",
        "temperature": "Cold (Around 40°F/4°C)"
      },
      {
        "roll": "4",
        "conditions": "Overcast",
        "temperature": "Cool (Around 50°F/10°C)"
      },
      {
        "roll": "5",
        "conditions": "Heavy Rain/Sleet",
        "temperature": "Cool (Around 50°F/10°C)"
      },
      {
        "roll": "6",
        "conditions": "Strange (go to Strange Weather)",
        "temperature": "Cool (Around 60°F/15°C)"
      }
    ],
    "source": "Interface RED Vol. 2 p.17"
  },
  {
    "id": "mar-may",
    "title": "Weather: March to May",
    "months": [
      3,
      4,
      5
    ],
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "conditions": "Clear",
        "temperature": "Cold (Around 40°F/4°C)"
      },
      {
        "roll": "2",
        "conditions": "Light Rain",
        "temperature": "Cool (Around 50°F/10°C)"
      },
      {
        "roll": "3",
        "conditions": "Overcast",
        "temperature": "Cool (Around 50°F/10°C)"
      },
      {
        "roll": "4",
        "conditions": "Light Rain",
        "temperature": "Cool (Around 50°F/10°C)"
      },
      {
        "roll": "5",
        "conditions": "Heavy Rain",
        "temperature": "Warm (Around 60°F/15°C)"
      },
      {
        "roll": "6",
        "conditions": "Strange (go to Strange Weather)",
        "temperature": "Warm (Around 70°F/21°C)"
      }
    ],
    "source": "Interface RED Vol. 2 p.17"
  },
  {
    "id": "jun-aug",
    "title": "Weather: June to August",
    "months": [
      6,
      7,
      8
    ],
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "conditions": "Light Rain",
        "temperature": "Warm (Around 60°F/15°C)"
      },
      {
        "roll": "2",
        "conditions": "Clear",
        "temperature": "Warm (Around 70°F/21°C)"
      },
      {
        "roll": "3",
        "conditions": "Overcast",
        "temperature": "Warm (Around 70°F/21°C)"
      },
      {
        "roll": "4",
        "conditions": "Overcast",
        "temperature": "Hot (Around 80°F/27°C)"
      },
      {
        "roll": "5",
        "conditions": "Clear",
        "temperature": "Hot (Around 80°F/27°C)"
      },
      {
        "roll": "6",
        "conditions": "Strange (go to Strange Weather)",
        "temperature": "Hot (Around 90°F/32°C)"
      }
    ],
    "source": "Interface RED Vol. 2 p.17"
  },
  {
    "id": "sep-nov",
    "title": "Weather: September to November",
    "months": [
      9,
      10,
      11
    ],
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "conditions": "Light Rain/Sleet",
        "temperature": "Cool (Around 40°F/4°C)"
      },
      {
        "roll": "2",
        "conditions": "Clear",
        "temperature": "Warm (Around 60°F/15°C)"
      },
      {
        "roll": "3",
        "conditions": "Overcast",
        "temperature": "Warm (Around 60°F/15°C)"
      },
      {
        "roll": "4",
        "conditions": "Overcast",
        "temperature": "Warm (Around 60°F/15°C)"
      },
      {
        "roll": "5",
        "conditions": "Clear",
        "temperature": "Warm (Around 70°F/21°C)"
      },
      {
        "roll": "6",
        "conditions": "Strange (go to Strange Weather)",
        "temperature": "Hot (Around 80°F/27°C)"
      }
    ],
    "source": "Interface RED Vol. 2 p.17"
  }
];

export const STRANGE_WEATHER: GmTable = {
  "id": "strange-weather",
  "title": "Strange Weather",
  "die": "1d10",
  "rows": [
    {
      "roll": "1",
      "text": "Radioactive Windstorm: Dura 1d6 x 10 minutos. Sin Radiation Suit o similar: expuesto a radiación alta (CP:R p.181). Ráfagas a criterio del GM, duran 1d6 Rounds (p.5)."
    },
    {
      "roll": "2",
      "text": "Ash Storm: Dura 1d6 x 10 minutos. Más de 1 min sin Nasal Filters/Anti-Smog Mask: como Vial of Poison (CP:R p.355) y Foreign Object Critical Injury sin Bonus Damage, no tratable dentro. GM puede aplicar -2 a checks (p.4)."
    },
    {
      "roll": "3",
      "text": "Flooding: Dura 1d6 días. Calles con pocos centímetros de agua; subsuelo se inunda. Vadear zona muy inundada usa 'other form of movement' (CP:R p.169) (p.5)."
    },
    {
      "roll": "4",
      "text": "Blood Rain: Dura 1d6 horas. Tirar 1d6: 1-3 actúa como Acid Rain; 4-6 una vez por minuto, sin protección, como Vial of Biotoxin (CP:R p.355). GM puede aplicar -1 a checks (p.4)."
    },
    {
      "roll": "5",
      "text": "Acid Rain: Dura 1d6 horas. Por cada minuto completo sin protección, se ablanda 1 SP de toda la armadura puesta (p.4)."
    },
    {
      "roll": "6",
      "text": "Deadly Thunderstorm: Dura 1d6 x 10 minutos. Cada 10 min tirar 1d6: 1-3 rayo lejano; 4-6 cae en lo más alto cercano. Impactado: 6d6 daño al cuerpo y efecto flashbang (CP:R p.346). GM puede aplicar -2 (p.5)."
    },
    {
      "roll": "7",
      "text": "Inversion Smog: Dura 1d6 días. Más de 1 min sin Nasal Filters/Anti-Smog Mask: como Vial of Poison (CP:R p.355). GM puede aplicar -4 a checks (p.5)."
    },
    {
      "roll": "8",
      "text": "Cold Snap (if Temperature Cool or Cold) OR Heat Wave (if Temperature Warm or Hot): Dura 1d6 días. Cold Snap: bajo cero, reemplaza la Temperature, aplica Exposure (CP:R p.181), hielo negro, -2 sobre hielo a criterio GM. Heat Wave: reemplaza Temperature, Exposure, Armor Penalty a REF/DEX/MOVE +2 (p.4-5)."
    },
    {
      "roll": "9",
      "text": "Dust Storm: Dura 1d6 x 10 minutos. Más de 5 min sin Nasal Filters/Anti-Smog Mask: Foreign Object Critical Injury sin Bonus Damage, no tratable dentro. GM puede aplicar -2 a checks (p.5)."
    },
    {
      "roll": "10",
      "text": "Blackout: Dura 1d6 días. Sin electricidad, CitiNet ni comunicaciones en la zona sin generador; no se llama ni se conecta al Data Pool. Zona: 1d10 cuadras si es al azar (p.4)."
    }
  ],
  "source": "Interface RED Vol. 2 p.17"
};

export const WEATHER_RULES: WeatherRule[] = [
  {
    "title": "Cold Temperature",
    "textEs": "Around 35-40°F (2-4°C): Bajo la tolerancia normal; sin ropa adecuada se sufre daño por Exposure (CP:R p.181).",
    "source": "Interface RED Vol. 2 p.18"
  },
  {
    "title": "Cool/Warm Temperature",
    "textEs": "Cool: 40-60°F (4-15°C); Warm: 60-70°F (15-21°C): Clima cómodo; sin efecto mecánico.",
    "source": "Interface RED Vol. 2 p.18"
  },
  {
    "title": "Hot Temperature",
    "textEs": "Around 80-90°F (27-32°C): Todo Armor Penalty previo a REF, DEX y MOVE aumenta en 1 (ej. -2 pasa a -3).",
    "source": "Interface RED Vol. 2 p.18"
  },
  {
    "title": "Heavy Rain/Sleet",
    "textEs": "Superficies resbalosas y poca visibilidad; GM puede aplicar -2 a checks apropiados, incluidos Perception y ataques a distancia.",
    "source": "Interface RED Vol. 2 p.19"
  },
  {
    "title": "Light Rain/Sleet",
    "textEs": "No reduce visibilidad pero resbala; GM puede aplicar -1 a checks como Athletics para trepar o Drive Land Vehicle.",
    "source": "Interface RED Vol. 2 p.19"
  },
  {
    "title": "Cold Snap",
    "textEs": "Reemplaza Temperature, aplica Exposure (CP:R p.181), hielo negro; -2 a criterio GM en checks sobre hielo.",
    "source": "Interface RED Vol. 2 p.18"
  },
  {
    "title": "Heat Wave",
    "textEs": "Reemplaza Temperature, aplica Exposure (CP:R p.181) y suma +2 al Armor Penalty de REF/DEX/MOVE (ej. -2 pasa a -4).",
    "source": "Interface RED Vol. 2 p.19"
  },
  {
    "title": "Foreign Object (Ash/Dust Storm)",
    "textEs": "Ejemplo: DV13 Resist Torture/Drugs como Vial of Poison (2d6 a HP); con la Critical Injury, 5 daño a HP al moverse más de 4 m/yds por Turn.",
    "source": "Interface RED Vol. 2 p.18"
  }
];
