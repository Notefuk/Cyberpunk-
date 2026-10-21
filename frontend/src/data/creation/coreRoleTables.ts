// Generado por scripts/gen_creation.py desde data/creation-src/. No editar a mano.
import type { CoreRoleTablesSrc } from './types';

export const CORE_ROLE_TABLES: CoreRoleTablesSrc = {
  "book": "Core RED v1.24",
  "pageConvention": "página impresa; PDF = impresa+1",
  "methods": [
    {
      "id": "streetrat",
      "rulesEs": "Streetrat (plantillas): se tira 1d10 en la tabla del Rol y se copian los 10 STATs de esa fila tal cual, sin moverlos (INT REF DEX TECH COOL WILL LUCK MOVE BODY EMP). Las skills vienen fijas con su nivel por Rol (13 basicas + 7 de Rol) mas 4 niveles de idioma segun el Origen Cultural. Se agregan 500eb para gastar o guardar; equipo, armas, armadura y cyberware segun el Rol. Role Ability en 4.",
      "source": {
        "book": "Core RED",
        "page": 73
      }
    },
    {
      "id": "edgerunner",
      "rulesEs": "Edgerunner (rapido y sucio): se tira 1d10 por cada STAT por separado y se lee el valor en la columna de ese STAT de la tabla del Rol. Skills: las 20 del Rol estan fijadas pero los niveles los elegis con 86 puntos; ninguna skill menor a 2 ni mayor a 6; las marcadas (x2) cuestan 2 puntos por nivel; el idioma del Origen Cultural (nivel 4) es gratis.",
      "source": {
        "book": "Core RED",
        "page": 77
      }
    },
    {
      "id": "complete_package",
      "rulesEs": "Complete Package (calculado): se compran STATs (ninguno mayor a 8 ni menor a 2, ver p.78) y skills (basicas minimo 2, maximo 6, ver p.90) con pools de puntos; 2550eb para armas, armadura, gear, fashion y cyberware, de los cuales 800eb se pueden gastar especificamente en Fashion y Fashionware. Es el metodo mas complejo pero el mas personalizable.",
      "source": {
        "book": "Core RED",
        "page": 40
      }
    },
    {
      "id": "steps_streetrat_edgerunner",
      "rulesEs": "Pasos Streetrat/Edgerunner (p.41): 1 elegir Rol (Role Ability en 4); 2 correr Lifepath general y de Rol (idioma de Origen Cultural en nivel 4); 3 tirar STATs (Streetrat p.73, Edgerunner p.77); 4 calcular STATs derivados (p.79); 5 fijar skills (Streetrat p.86, Edgerunner p.88); 6 anotar armas y armadura (p.98); 7 anotar Outfit (p.103) y 500eb extra; 8 anotar cyberware (p.117).",
      "source": {
        "book": "Core RED",
        "page": 41
      }
    },
    {
      "id": "steps_complete_package",
      "rulesEs": "Pasos Complete Package (p.42): 1 Rol (Role Ability en 4); 2 Lifepath; 3 comprar STATs (p.78, entre 2 y 8); 4 derivados (p.79); 5 comprar skills (p.90, basicas minimo 2, maximo 6); 6 comprar equipo con 2550eb (800eb especificos para Fashion y Fashionware); Lifestyle y Housing p.105; si falta dinero, ver p.118.",
      "source": {
        "book": "Core RED",
        "page": 42
      }
    }
  ],
  "statTables": {
    "Rockerboy": {
      "source": {
        "book": "Core RED",
        "page": 74
      },
      "rows": [
        {
          "roll": 1,
          "INT": 7,
          "REF": 6,
          "DEX": 6,
          "TECH": 5,
          "COOL": 6,
          "WILL": 8,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 3,
          "EMP": 8
        },
        {
          "roll": 2,
          "INT": 3,
          "REF": 7,
          "DEX": 7,
          "TECH": 7,
          "COOL": 7,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 8
        },
        {
          "roll": 3,
          "INT": 4,
          "REF": 5,
          "DEX": 7,
          "TECH": 7,
          "COOL": 6,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 8
        },
        {
          "roll": 4,
          "INT": 4,
          "REF": 5,
          "DEX": 7,
          "TECH": 7,
          "COOL": 6,
          "WILL": 8,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 3,
          "EMP": 8
        },
        {
          "roll": 5,
          "INT": 3,
          "REF": 7,
          "DEX": 7,
          "TECH": 7,
          "COOL": 6,
          "WILL": 8,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 4,
          "EMP": 7
        },
        {
          "roll": 6,
          "INT": 5,
          "REF": 6,
          "DEX": 7,
          "TECH": 5,
          "COOL": 7,
          "WILL": 8,
          "LUCK": 5,
          "MOVE": 7,
          "BODY": 3,
          "EMP": 7
        },
        {
          "roll": 7,
          "INT": 5,
          "REF": 6,
          "DEX": 6,
          "TECH": 7,
          "COOL": 7,
          "WILL": 8,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 3,
          "EMP": 6
        },
        {
          "roll": 8,
          "INT": 5,
          "REF": 7,
          "DEX": 7,
          "TECH": 5,
          "COOL": 6,
          "WILL": 6,
          "LUCK": 6,
          "MOVE": 6,
          "BODY": 4,
          "EMP": 8
        },
        {
          "roll": 9,
          "INT": 3,
          "REF": 5,
          "DEX": 5,
          "TECH": 6,
          "COOL": 7,
          "WILL": 8,
          "LUCK": 7,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 10,
          "INT": 4,
          "REF": 5,
          "DEX": 6,
          "TECH": 5,
          "COOL": 8,
          "WILL": 8,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 4,
          "EMP": 7
        }
      ]
    },
    "Solo": {
      "source": {
        "book": "Core RED",
        "page": 74
      },
      "rows": [
        {
          "roll": 1,
          "INT": 6,
          "REF": 7,
          "DEX": 7,
          "TECH": 3,
          "COOL": 8,
          "WILL": 6,
          "LUCK": 5,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 5
        },
        {
          "roll": 2,
          "INT": 7,
          "REF": 8,
          "DEX": 6,
          "TECH": 3,
          "COOL": 6,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 6
        },
        {
          "roll": 3,
          "INT": 5,
          "REF": 8,
          "DEX": 7,
          "TECH": 4,
          "COOL": 7,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 7,
          "BODY": 8,
          "EMP": 5
        },
        {
          "roll": 4,
          "INT": 5,
          "REF": 8,
          "DEX": 6,
          "TECH": 4,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 7,
          "EMP": 6
        },
        {
          "roll": 5,
          "INT": 6,
          "REF": 6,
          "DEX": 7,
          "TECH": 5,
          "COOL": 7,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 8,
          "EMP": 4
        },
        {
          "roll": 6,
          "INT": 7,
          "REF": 7,
          "DEX": 6,
          "TECH": 5,
          "COOL": 7,
          "WILL": 6,
          "LUCK": 6,
          "MOVE": 7,
          "BODY": 7,
          "EMP": 5
        },
        {
          "roll": 7,
          "INT": 7,
          "REF": 7,
          "DEX": 6,
          "TECH": 5,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 6,
          "EMP": 6
        },
        {
          "roll": 8,
          "INT": 7,
          "REF": 8,
          "DEX": 7,
          "TECH": 5,
          "COOL": 6,
          "WILL": 6,
          "LUCK": 5,
          "MOVE": 6,
          "BODY": 8,
          "EMP": 4
        },
        {
          "roll": 9,
          "INT": 7,
          "REF": 7,
          "DEX": 6,
          "TECH": 4,
          "COOL": 6,
          "WILL": 6,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 5
        },
        {
          "roll": 10,
          "INT": 6,
          "REF": 6,
          "DEX": 8,
          "TECH": 5,
          "COOL": 6,
          "WILL": 6,
          "LUCK": 5,
          "MOVE": 6,
          "BODY": 6,
          "EMP": 5
        }
      ]
    },
    "Netrunner": {
      "source": {
        "book": "Core RED",
        "page": 74
      },
      "rows": [
        {
          "roll": 1,
          "INT": 5,
          "REF": 8,
          "DEX": 7,
          "TECH": 7,
          "COOL": 7,
          "WILL": 4,
          "LUCK": 8,
          "MOVE": 7,
          "BODY": 7,
          "EMP": 4
        },
        {
          "roll": 2,
          "INT": 5,
          "REF": 6,
          "DEX": 7,
          "TECH": 5,
          "COOL": 8,
          "WILL": 3,
          "LUCK": 8,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 5
        },
        {
          "roll": 3,
          "INT": 5,
          "REF": 6,
          "DEX": 8,
          "TECH": 6,
          "COOL": 6,
          "WILL": 4,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 7,
          "EMP": 4
        },
        {
          "roll": 4,
          "INT": 5,
          "REF": 7,
          "DEX": 7,
          "TECH": 7,
          "COOL": 7,
          "WILL": 5,
          "LUCK": 8,
          "MOVE": 6,
          "BODY": 5,
          "EMP": 5
        },
        {
          "roll": 5,
          "INT": 5,
          "REF": 8,
          "DEX": 8,
          "TECH": 5,
          "COOL": 7,
          "WILL": 3,
          "LUCK": 7,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 6
        },
        {
          "roll": 6,
          "INT": 6,
          "REF": 6,
          "DEX": 6,
          "TECH": 7,
          "COOL": 8,
          "WILL": 4,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 6,
          "EMP": 6
        },
        {
          "roll": 7,
          "INT": 6,
          "REF": 6,
          "DEX": 6,
          "TECH": 7,
          "COOL": 6,
          "WILL": 5,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 7,
          "EMP": 6
        },
        {
          "roll": 8,
          "INT": 5,
          "REF": 7,
          "DEX": 8,
          "TECH": 6,
          "COOL": 8,
          "WILL": 4,
          "LUCK": 8,
          "MOVE": 5,
          "BODY": 7,
          "EMP": 4
        },
        {
          "roll": 9,
          "INT": 7,
          "REF": 6,
          "DEX": 7,
          "TECH": 7,
          "COOL": 6,
          "WILL": 3,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 5
        },
        {
          "roll": 10,
          "INT": 7,
          "REF": 8,
          "DEX": 6,
          "TECH": 6,
          "COOL": 6,
          "WILL": 4,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 6
        }
      ]
    },
    "Tech": {
      "source": {
        "book": "Core RED",
        "page": 75
      },
      "rows": [
        {
          "roll": 1,
          "INT": 6,
          "REF": 7,
          "DEX": 7,
          "TECH": 8,
          "COOL": 4,
          "WILL": 4,
          "LUCK": 5,
          "MOVE": 5,
          "BODY": 7,
          "EMP": 6
        },
        {
          "roll": 2,
          "INT": 7,
          "REF": 6,
          "DEX": 6,
          "TECH": 7,
          "COOL": 5,
          "WILL": 3,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 5
        },
        {
          "roll": 3,
          "INT": 8,
          "REF": 6,
          "DEX": 5,
          "TECH": 7,
          "COOL": 5,
          "WILL": 4,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 4,
          "INT": 7,
          "REF": 8,
          "DEX": 7,
          "TECH": 8,
          "COOL": 4,
          "WILL": 4,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 7
        },
        {
          "roll": 5,
          "INT": 6,
          "REF": 6,
          "DEX": 7,
          "TECH": 6,
          "COOL": 4,
          "WILL": 3,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 6,
          "EMP": 6
        },
        {
          "roll": 6,
          "INT": 8,
          "REF": 7,
          "DEX": 5,
          "TECH": 6,
          "COOL": 3,
          "WILL": 3,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 6,
          "EMP": 7
        },
        {
          "roll": 7,
          "INT": 8,
          "REF": 6,
          "DEX": 7,
          "TECH": 8,
          "COOL": 4,
          "WILL": 4,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 7,
          "EMP": 6
        },
        {
          "roll": 8,
          "INT": 8,
          "REF": 8,
          "DEX": 7,
          "TECH": 8,
          "COOL": 5,
          "WILL": 4,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 6
        },
        {
          "roll": 9,
          "INT": 6,
          "REF": 6,
          "DEX": 7,
          "TECH": 8,
          "COOL": 3,
          "WILL": 3,
          "LUCK": 5,
          "MOVE": 7,
          "BODY": 7,
          "EMP": 7
        },
        {
          "roll": 10,
          "INT": 8,
          "REF": 8,
          "DEX": 5,
          "TECH": 6,
          "COOL": 4,
          "WILL": 4,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 6
        }
      ]
    },
    "Medtech": {
      "source": {
        "book": "Core RED",
        "page": 75
      },
      "rows": [
        {
          "roll": 1,
          "INT": 7,
          "REF": 5,
          "DEX": 6,
          "TECH": 7,
          "COOL": 5,
          "WILL": 3,
          "LUCK": 8,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 2,
          "INT": 6,
          "REF": 7,
          "DEX": 7,
          "TECH": 7,
          "COOL": 4,
          "WILL": 4,
          "LUCK": 6,
          "MOVE": 7,
          "BODY": 7,
          "EMP": 7
        },
        {
          "roll": 3,
          "INT": 6,
          "REF": 5,
          "DEX": 5,
          "TECH": 8,
          "COOL": 5,
          "WILL": 3,
          "LUCK": 8,
          "MOVE": 5,
          "BODY": 7,
          "EMP": 8
        },
        {
          "roll": 4,
          "INT": 8,
          "REF": 7,
          "DEX": 6,
          "TECH": 8,
          "COOL": 3,
          "WILL": 5,
          "LUCK": 6,
          "MOVE": 6,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 5,
          "INT": 6,
          "REF": 7,
          "DEX": 5,
          "TECH": 7,
          "COOL": 5,
          "WILL": 5,
          "LUCK": 8,
          "MOVE": 7,
          "BODY": 6,
          "EMP": 8
        },
        {
          "roll": 6,
          "INT": 8,
          "REF": 5,
          "DEX": 5,
          "TECH": 8,
          "COOL": 5,
          "WILL": 5,
          "LUCK": 6,
          "MOVE": 6,
          "BODY": 5,
          "EMP": 6
        },
        {
          "roll": 7,
          "INT": 8,
          "REF": 6,
          "DEX": 5,
          "TECH": 8,
          "COOL": 5,
          "WILL": 4,
          "LUCK": 8,
          "MOVE": 5,
          "BODY": 7,
          "EMP": 7
        },
        {
          "roll": 8,
          "INT": 6,
          "REF": 5,
          "DEX": 7,
          "TECH": 7,
          "COOL": 3,
          "WILL": 5,
          "LUCK": 8,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 8
        },
        {
          "roll": 9,
          "INT": 6,
          "REF": 6,
          "DEX": 7,
          "TECH": 7,
          "COOL": 5,
          "WILL": 4,
          "LUCK": 6,
          "MOVE": 6,
          "BODY": 5,
          "EMP": 6
        },
        {
          "roll": 10,
          "INT": 8,
          "REF": 7,
          "DEX": 6,
          "TECH": 6,
          "COOL": 3,
          "WILL": 4,
          "LUCK": 8,
          "MOVE": 7,
          "BODY": 6,
          "EMP": 7
        }
      ]
    },
    "Media": {
      "source": {
        "book": "Core RED",
        "page": 75
      },
      "rows": [
        {
          "roll": 1,
          "INT": 6,
          "REF": 6,
          "DEX": 5,
          "TECH": 5,
          "COOL": 8,
          "WILL": 7,
          "LUCK": 5,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 2,
          "INT": 8,
          "REF": 7,
          "DEX": 7,
          "TECH": 3,
          "COOL": 6,
          "WILL": 6,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 8
        },
        {
          "roll": 3,
          "INT": 6,
          "REF": 7,
          "DEX": 7,
          "TECH": 5,
          "COOL": 6,
          "WILL": 8,
          "LUCK": 5,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 4,
          "INT": 6,
          "REF": 5,
          "DEX": 7,
          "TECH": 5,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 5,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 6
        },
        {
          "roll": 5,
          "INT": 6,
          "REF": 6,
          "DEX": 7,
          "TECH": 4,
          "COOL": 8,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 8
        },
        {
          "roll": 6,
          "INT": 7,
          "REF": 5,
          "DEX": 5,
          "TECH": 4,
          "COOL": 8,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 8
        },
        {
          "roll": 7,
          "INT": 8,
          "REF": 5,
          "DEX": 6,
          "TECH": 3,
          "COOL": 7,
          "WILL": 6,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 7
        },
        {
          "roll": 8,
          "INT": 6,
          "REF": 5,
          "DEX": 6,
          "TECH": 5,
          "COOL": 6,
          "WILL": 8,
          "LUCK": 6,
          "MOVE": 6,
          "BODY": 7,
          "EMP": 8
        },
        {
          "roll": 9,
          "INT": 7,
          "REF": 7,
          "DEX": 5,
          "TECH": 4,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 7
        },
        {
          "roll": 10,
          "INT": 7,
          "REF": 6,
          "DEX": 6,
          "TECH": 3,
          "COOL": 7,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 7,
          "EMP": 6
        }
      ]
    },
    "Lawman": {
      "source": {
        "book": "Core RED",
        "page": 76
      },
      "rows": [
        {
          "roll": 1,
          "INT": 5,
          "REF": 6,
          "DEX": 7,
          "TECH": 5,
          "COOL": 7,
          "WILL": 8,
          "LUCK": 5,
          "MOVE": 6,
          "BODY": 5,
          "EMP": 6
        },
        {
          "roll": 2,
          "INT": 6,
          "REF": 6,
          "DEX": 6,
          "TECH": 5,
          "COOL": 6,
          "WILL": 8,
          "LUCK": 5,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 5
        },
        {
          "roll": 3,
          "INT": 5,
          "REF": 7,
          "DEX": 7,
          "TECH": 7,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 5,
          "MOVE": 5,
          "BODY": 7,
          "EMP": 6
        },
        {
          "roll": 4,
          "INT": 6,
          "REF": 6,
          "DEX": 7,
          "TECH": 6,
          "COOL": 6,
          "WILL": 8,
          "LUCK": 5,
          "MOVE": 7,
          "BODY": 7,
          "EMP": 6
        },
        {
          "roll": 5,
          "INT": 6,
          "REF": 6,
          "DEX": 7,
          "TECH": 6,
          "COOL": 7,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 6
        },
        {
          "roll": 6,
          "INT": 7,
          "REF": 6,
          "DEX": 5,
          "TECH": 5,
          "COOL": 7,
          "WILL": 8,
          "LUCK": 5,
          "MOVE": 6,
          "BODY": 7,
          "EMP": 4
        },
        {
          "roll": 7,
          "INT": 7,
          "REF": 8,
          "DEX": 7,
          "TECH": 5,
          "COOL": 6,
          "WILL": 8,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 5,
          "EMP": 4
        },
        {
          "roll": 8,
          "INT": 5,
          "REF": 6,
          "DEX": 6,
          "TECH": 5,
          "COOL": 6,
          "WILL": 8,
          "LUCK": 5,
          "MOVE": 7,
          "BODY": 6,
          "EMP": 4
        },
        {
          "roll": 9,
          "INT": 7,
          "REF": 7,
          "DEX": 5,
          "TECH": 5,
          "COOL": 7,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 6
        },
        {
          "roll": 10,
          "INT": 6,
          "REF": 6,
          "DEX": 5,
          "TECH": 6,
          "COOL": 8,
          "WILL": 7,
          "LUCK": 5,
          "MOVE": 7,
          "BODY": 6,
          "EMP": 6
        }
      ]
    },
    "Exec": {
      "source": {
        "book": "Core RED",
        "page": 76
      },
      "rows": [
        {
          "roll": 1,
          "INT": 8,
          "REF": 5,
          "DEX": 5,
          "TECH": 3,
          "COOL": 8,
          "WILL": 6,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 2,
          "INT": 8,
          "REF": 6,
          "DEX": 6,
          "TECH": 4,
          "COOL": 7,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 3,
          "INT": 8,
          "REF": 7,
          "DEX": 6,
          "TECH": 3,
          "COOL": 8,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 4,
          "EMP": 5
        },
        {
          "roll": 4,
          "INT": 8,
          "REF": 5,
          "DEX": 7,
          "TECH": 5,
          "COOL": 6,
          "WILL": 5,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 5,
          "INT": 7,
          "REF": 7,
          "DEX": 6,
          "TECH": 5,
          "COOL": 8,
          "WILL": 5,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 6
        },
        {
          "roll": 6,
          "INT": 5,
          "REF": 7,
          "DEX": 7,
          "TECH": 3,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 7,
          "INT": 6,
          "REF": 6,
          "DEX": 7,
          "TECH": 5,
          "COOL": 8,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 7,
          "BODY": 4,
          "EMP": 6
        },
        {
          "roll": 8,
          "INT": 6,
          "REF": 7,
          "DEX": 7,
          "TECH": 3,
          "COOL": 7,
          "WILL": 5,
          "LUCK": 7,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 9,
          "INT": 7,
          "REF": 6,
          "DEX": 7,
          "TECH": 5,
          "COOL": 7,
          "WILL": 5,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 5,
          "EMP": 5
        },
        {
          "roll": 10,
          "INT": 7,
          "REF": 7,
          "DEX": 5,
          "TECH": 5,
          "COOL": 8,
          "WILL": 6,
          "LUCK": 6,
          "MOVE": 7,
          "BODY": 4,
          "EMP": 7
        }
      ]
    },
    "Fixer": {
      "source": {
        "book": "Core RED",
        "page": 76
      },
      "rows": [
        {
          "roll": 1,
          "INT": 8,
          "REF": 5,
          "DEX": 7,
          "TECH": 4,
          "COOL": 6,
          "WILL": 5,
          "LUCK": 8,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 8
        },
        {
          "roll": 2,
          "INT": 8,
          "REF": 5,
          "DEX": 5,
          "TECH": 5,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 8,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 3,
          "INT": 6,
          "REF": 6,
          "DEX": 6,
          "TECH": 4,
          "COOL": 5,
          "WILL": 6,
          "LUCK": 8,
          "MOVE": 6,
          "BODY": 3,
          "EMP": 8
        },
        {
          "roll": 4,
          "INT": 7,
          "REF": 7,
          "DEX": 5,
          "TECH": 5,
          "COOL": 7,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 8
        },
        {
          "roll": 5,
          "INT": 8,
          "REF": 6,
          "DEX": 6,
          "TECH": 3,
          "COOL": 6,
          "WILL": 5,
          "LUCK": 8,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 6
        },
        {
          "roll": 6,
          "INT": 8,
          "REF": 7,
          "DEX": 5,
          "TECH": 5,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 7,
          "MOVE": 5,
          "BODY": 3,
          "EMP": 6
        },
        {
          "roll": 7,
          "INT": 8,
          "REF": 6,
          "DEX": 6,
          "TECH": 5,
          "COOL": 6,
          "WILL": 5,
          "LUCK": 6,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 8
        },
        {
          "roll": 8,
          "INT": 6,
          "REF": 6,
          "DEX": 7,
          "TECH": 4,
          "COOL": 7,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 4,
          "EMP": 7
        },
        {
          "roll": 9,
          "INT": 8,
          "REF": 7,
          "DEX": 7,
          "TECH": 5,
          "COOL": 5,
          "WILL": 5,
          "LUCK": 7,
          "MOVE": 6,
          "BODY": 5,
          "EMP": 7
        },
        {
          "roll": 10,
          "INT": 6,
          "REF": 5,
          "DEX": 6,
          "TECH": 5,
          "COOL": 5,
          "WILL": 6,
          "LUCK": 8,
          "MOVE": 6,
          "BODY": 4,
          "EMP": 7
        }
      ]
    },
    "Nomad": {
      "source": {
        "book": "Core RED",
        "page": 77
      },
      "rows": [
        {
          "roll": 1,
          "INT": 6,
          "REF": 6,
          "DEX": 8,
          "TECH": 3,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 6,
          "BODY": 6,
          "EMP": 4
        },
        {
          "roll": 2,
          "INT": 5,
          "REF": 7,
          "DEX": 6,
          "TECH": 5,
          "COOL": 8,
          "WILL": 8,
          "LUCK": 8,
          "MOVE": 7,
          "BODY": 5,
          "EMP": 4
        },
        {
          "roll": 3,
          "INT": 5,
          "REF": 8,
          "DEX": 6,
          "TECH": 3,
          "COOL": 8,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 5
        },
        {
          "roll": 4,
          "INT": 5,
          "REF": 8,
          "DEX": 7,
          "TECH": 4,
          "COOL": 8,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 7,
          "EMP": 5
        },
        {
          "roll": 5,
          "INT": 6,
          "REF": 6,
          "DEX": 6,
          "TECH": 3,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 7,
          "BODY": 7,
          "EMP": 4
        },
        {
          "roll": 6,
          "INT": 7,
          "REF": 6,
          "DEX": 8,
          "TECH": 4,
          "COOL": 6,
          "WILL": 7,
          "LUCK": 6,
          "MOVE": 5,
          "BODY": 6,
          "EMP": 5
        },
        {
          "roll": 7,
          "INT": 6,
          "REF": 7,
          "DEX": 8,
          "TECH": 4,
          "COOL": 6,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 5,
          "BODY": 7,
          "EMP": 5
        },
        {
          "roll": 8,
          "INT": 5,
          "REF": 7,
          "DEX": 8,
          "TECH": 3,
          "COOL": 8,
          "WILL": 6,
          "LUCK": 7,
          "MOVE": 5,
          "BODY": 5,
          "EMP": 5
        },
        {
          "roll": 9,
          "INT": 6,
          "REF": 7,
          "DEX": 6,
          "TECH": 4,
          "COOL": 8,
          "WILL": 6,
          "LUCK": 6,
          "MOVE": 6,
          "BODY": 6,
          "EMP": 6
        },
        {
          "roll": 10,
          "INT": 5,
          "REF": 6,
          "DEX": 7,
          "TECH": 4,
          "COOL": 7,
          "WILL": 8,
          "LUCK": 7,
          "MOVE": 7,
          "BODY": 7,
          "EMP": 4
        }
      ]
    }
  },
  "streetratSkills": {
    "Rockerboy": {
      "source": {
        "book": "Core RED",
        "page": 86
      },
      "skills": [
        {
          "name": "Athletics",
          "level": 2
        },
        {
          "name": "Brawling",
          "level": 6
        },
        {
          "name": "Concentration",
          "level": 2
        },
        {
          "name": "Conversation",
          "level": 2
        },
        {
          "name": "Education",
          "level": 2
        },
        {
          "name": "Evasion",
          "level": 6
        },
        {
          "name": "First Aid",
          "level": 6
        },
        {
          "name": "Human Perception",
          "level": 6
        },
        {
          "name": "Language (Streetslang)",
          "level": 2
        },
        {
          "name": "Local Expert (Your Home)",
          "level": 4
        },
        {
          "name": "Perception",
          "level": 2
        },
        {
          "name": "Persuasion",
          "level": 6
        },
        {
          "name": "Stealth",
          "level": 2
        },
        {
          "name": "Composition",
          "level": 6
        },
        {
          "name": "Handgun",
          "level": 6
        },
        {
          "name": "Melee Weapon",
          "level": 6
        },
        {
          "name": "Personal Grooming",
          "level": 4
        },
        {
          "name": "Play Instrument (choose 1)",
          "level": 6
        },
        {
          "name": "Streetwise",
          "level": 6
        },
        {
          "name": "Wardrobe & Style",
          "level": 4
        }
      ]
    },
    "Solo": {
      "source": {
        "book": "Core RED",
        "page": 86
      },
      "skills": [
        {
          "name": "Athletics",
          "level": 2
        },
        {
          "name": "Brawling",
          "level": 2
        },
        {
          "name": "Concentration",
          "level": 2
        },
        {
          "name": "Conversation",
          "level": 2
        },
        {
          "name": "Education",
          "level": 2
        },
        {
          "name": "Evasion",
          "level": 6
        },
        {
          "name": "First Aid",
          "level": 6
        },
        {
          "name": "Human Perception",
          "level": 2
        },
        {
          "name": "Language (Streetslang)",
          "level": 2
        },
        {
          "name": "Local Expert (Your Home)",
          "level": 2
        },
        {
          "name": "Perception",
          "level": 6
        },
        {
          "name": "Persuasion",
          "level": 2
        },
        {
          "name": "Stealth",
          "level": 2
        },
        {
          "name": "Autofire",
          "level": 6
        },
        {
          "name": "Handgun",
          "level": 6
        },
        {
          "name": "Interrogation",
          "level": 6
        },
        {
          "name": "Melee Weapon",
          "level": 6
        },
        {
          "name": "Resist Torture/Drugs",
          "level": 6
        },
        {
          "name": "Shoulder Arms",
          "level": 6
        },
        {
          "name": "Tactics",
          "level": 6
        }
      ]
    },
    "Netrunner": {
      "source": {
        "book": "Core RED",
        "page": 86
      },
      "skills": [
        {
          "name": "Athletics",
          "level": 2
        },
        {
          "name": "Brawling",
          "level": 2
        },
        {
          "name": "Concentration",
          "level": 2
        },
        {
          "name": "Conversation",
          "level": 2
        },
        {
          "name": "Education",
          "level": 6
        },
        {
          "name": "Evasion",
          "level": 6
        },
        {
          "name": "First Aid",
          "level": 2
        },
        {
          "name": "Human Perception",
          "level": 2
        },
        {
          "name": "Language (Streetslang)",
          "level": 2
        },
        {
          "name": "Local Expert (Your Home)",
          "level": 2
        },
        {
          "name": "Perception",
          "level": 2
        },
        {
          "name": "Persuasion",
          "level": 2
        },
        {
          "name": "Stealth",
          "level": 6
        },
        {
          "name": "Basic Tech",
          "level": 6
        },
        {
          "name": "Conceal/Reveal Object",
          "level": 6
        },
        {
          "name": "Cryptography",
          "level": 6
        },
        {
          "name": "Cybertech",
          "level": 6
        },
        {
          "name": "Electronics/Security Tech",
          "level": 6
        },
        {
          "name": "Handgun",
          "level": 6
        },
        {
          "name": "Library Search",
          "level": 6
        }
      ]
    },
    "Tech": {
      "source": {
        "book": "Core RED",
        "page": 86
      },
      "skills": [
        {
          "name": "Athletics",
          "level": 2
        },
        {
          "name": "Brawling",
          "level": 2
        },
        {
          "name": "Concentration",
          "level": 2
        },
        {
          "name": "Conversation",
          "level": 2
        },
        {
          "name": "Education",
          "level": 6
        },
        {
          "name": "Evasion",
          "level": 6
        },
        {
          "name": "First Aid",
          "level": 6
        },
        {
          "name": "Human Perception",
          "level": 2
        },
        {
          "name": "Language (Streetslang)",
          "level": 2
        },
        {
          "name": "Local Expert (Your Home)",
          "level": 2
        },
        {
          "name": "Perception",
          "level": 2
        },
        {
          "name": "Persuasion",
          "level": 2
        },
        {
          "name": "Stealth",
          "level": 2
        },
        {
          "name": "Basic Tech",
          "level": 6
        },
        {
          "name": "Cybertech",
          "level": 6
        },
        {
          "name": "Electronics/Security Tech (x2)",
          "level": 6
        },
        {
          "name": "Land Vehicle Tech",
          "level": 6
        },
        {
          "name": "Shoulder Arms",
          "level": 6
        },
        {
          "name": "Science (choose 1)",
          "level": 6
        },
        {
          "name": "Weaponstech",
          "level": 6
        }
      ]
    },
    "Medtech": {
      "source": {
        "book": "Core RED",
        "page": 86
      },
      "skills": [
        {
          "name": "Athletics",
          "level": 2
        },
        {
          "name": "Brawling",
          "level": 2
        },
        {
          "name": "Concentration",
          "level": 2
        },
        {
          "name": "Conversation",
          "level": 6
        },
        {
          "name": "Education",
          "level": 6
        },
        {
          "name": "Evasion",
          "level": 6
        },
        {
          "name": "First Aid",
          "level": 2
        },
        {
          "name": "Human Perception",
          "level": 6
        },
        {
          "name": "Language (Streetslang)",
          "level": 2
        },
        {
          "name": "Local Expert (Your Home)",
          "level": 2
        },
        {
          "name": "Perception",
          "level": 2
        },
        {
          "name": "Persuasion",
          "level": 2
        },
        {
          "name": "Stealth",
          "level": 2
        },
        {
          "name": "Basic Tech",
          "level": 6
        },
        {
          "name": "Cybertech",
          "level": 4
        },
        {
          "name": "Deduction",
          "level": 6
        },
        {
          "name": "Paramedic",
          "level": 6
        },
        {
          "name": "Resist Torture/Drugs",
          "level": 4
        },
        {
          "name": "Science (choose 1)",
          "level": 6
        },
        {
          "name": "Shoulder Arms",
          "level": 6
        }
      ]
    },
    "Media": {
      "source": {
        "book": "Core RED",
        "page": 87
      },
      "skills": [
        {
          "name": "Athletics",
          "level": 2
        },
        {
          "name": "Brawling",
          "level": 2
        },
        {
          "name": "Concentration",
          "level": 2
        },
        {
          "name": "Conversation",
          "level": 6
        },
        {
          "name": "Education",
          "level": 2
        },
        {
          "name": "Evasion",
          "level": 6
        },
        {
          "name": "First Aid",
          "level": 2
        },
        {
          "name": "Human Perception",
          "level": 6
        },
        {
          "name": "Language (Streetslang)",
          "level": 2
        },
        {
          "name": "Local Expert (Your Home)",
          "level": 6
        },
        {
          "name": "Perception",
          "level": 6
        },
        {
          "name": "Persuasion",
          "level": 6
        },
        {
          "name": "Stealth",
          "level": 2
        },
        {
          "name": "Bribery",
          "level": 6
        },
        {
          "name": "Composition",
          "level": 6
        },
        {
          "name": "Deduction",
          "level": 6
        },
        {
          "name": "Handgun",
          "level": 6
        },
        {
          "name": "Library Search",
          "level": 4
        },
        {
          "name": "Lip Reading",
          "level": 4
        },
        {
          "name": "Photography/Film",
          "level": 4
        }
      ]
    },
    "Lawman": {
      "source": {
        "book": "Core RED",
        "page": 87
      },
      "skills": [
        {
          "name": "Athletics",
          "level": 2
        },
        {
          "name": "Brawling",
          "level": 6
        },
        {
          "name": "Concentration",
          "level": 2
        },
        {
          "name": "Conversation",
          "level": 6
        },
        {
          "name": "Education",
          "level": 2
        },
        {
          "name": "Evasion",
          "level": 6
        },
        {
          "name": "First Aid",
          "level": 2
        },
        {
          "name": "Human Perception",
          "level": 2
        },
        {
          "name": "Language (Streetslang)",
          "level": 2
        },
        {
          "name": "Local Expert (Your Home)",
          "level": 2
        },
        {
          "name": "Perception",
          "level": 2
        },
        {
          "name": "Persuasion",
          "level": 2
        },
        {
          "name": "Stealth",
          "level": 2
        },
        {
          "name": "Autofire",
          "level": 6
        },
        {
          "name": "Criminology",
          "level": 6
        },
        {
          "name": "Deduction",
          "level": 6
        },
        {
          "name": "Handgun",
          "level": 6
        },
        {
          "name": "Interrogation",
          "level": 6
        },
        {
          "name": "Shoulder Arms",
          "level": 6
        },
        {
          "name": "Tracking",
          "level": 6
        }
      ]
    },
    "Exec": {
      "source": {
        "book": "Core RED",
        "page": 87
      },
      "skills": [
        {
          "name": "Athletics",
          "level": 2
        },
        {
          "name": "Brawling",
          "level": 2
        },
        {
          "name": "Concentration",
          "level": 2
        },
        {
          "name": "Conversation",
          "level": 6
        },
        {
          "name": "Education",
          "level": 6
        },
        {
          "name": "Evasion",
          "level": 6
        },
        {
          "name": "First Aid",
          "level": 2
        },
        {
          "name": "Human Perception",
          "level": 6
        },
        {
          "name": "Language (Streetslang)",
          "level": 2
        },
        {
          "name": "Local Expert (Your Home)",
          "level": 2
        },
        {
          "name": "Perception",
          "level": 2
        },
        {
          "name": "Persuasion",
          "level": 6
        },
        {
          "name": "Stealth",
          "level": 2
        },
        {
          "name": "Accounting",
          "level": 6
        },
        {
          "name": "Bureaucracy",
          "level": 6
        },
        {
          "name": "Business",
          "level": 6
        },
        {
          "name": "Deduction",
          "level": 6
        },
        {
          "name": "Handgun",
          "level": 6
        },
        {
          "name": "Lip Reading",
          "level": 6
        },
        {
          "name": "Personal Grooming",
          "level": 4
        }
      ]
    },
    "Fixer": {
      "source": {
        "book": "Core RED",
        "page": 87
      },
      "skills": [
        {
          "name": "Athletics",
          "level": 2
        },
        {
          "name": "Brawling",
          "level": 2
        },
        {
          "name": "Concentration",
          "level": 2
        },
        {
          "name": "Conversation",
          "level": 6
        },
        {
          "name": "Education",
          "level": 2
        },
        {
          "name": "Evasion",
          "level": 6
        },
        {
          "name": "First Aid",
          "level": 2
        },
        {
          "name": "Human Perception",
          "level": 6
        },
        {
          "name": "Language (Streetslang)",
          "level": 4
        },
        {
          "name": "Local Expert (Your Home)",
          "level": 6
        },
        {
          "name": "Perception",
          "level": 2
        },
        {
          "name": "Persuasion",
          "level": 4
        },
        {
          "name": "Stealth",
          "level": 2
        },
        {
          "name": "Bribery",
          "level": 6
        },
        {
          "name": "Business",
          "level": 6
        },
        {
          "name": "Forgery",
          "level": 6
        },
        {
          "name": "Handgun",
          "level": 6
        },
        {
          "name": "Pick Lock",
          "level": 4
        },
        {
          "name": "Streetwise",
          "level": 6
        },
        {
          "name": "Trading",
          "level": 6
        }
      ]
    },
    "Nomad": {
      "source": {
        "book": "Core RED",
        "page": 87
      },
      "skills": [
        {
          "name": "Athletics",
          "level": 2
        },
        {
          "name": "Brawling",
          "level": 6
        },
        {
          "name": "Concentration",
          "level": 2
        },
        {
          "name": "Conversation",
          "level": 2
        },
        {
          "name": "Education",
          "level": 2
        },
        {
          "name": "Evasion",
          "level": 6
        },
        {
          "name": "First Aid",
          "level": 6
        },
        {
          "name": "Human Perception",
          "level": 2
        },
        {
          "name": "Language (Streetslang)",
          "level": 2
        },
        {
          "name": "Local Expert (Your Home)",
          "level": 2
        },
        {
          "name": "Perception",
          "level": 4
        },
        {
          "name": "Persuasion",
          "level": 2
        },
        {
          "name": "Stealth",
          "level": 6
        },
        {
          "name": "Animal Handling",
          "level": 6
        },
        {
          "name": "Drive Land Vehicle",
          "level": 6
        },
        {
          "name": "Handgun",
          "level": 6
        },
        {
          "name": "Melee Weapon",
          "level": 6
        },
        {
          "name": "Tracking",
          "level": 6
        },
        {
          "name": "Trading",
          "level": 6
        },
        {
          "name": "Wilderness Survival",
          "level": 6
        }
      ]
    }
  },
  "edgerunnerSkills": {
    "Rockerboy": {
      "source": {
        "book": "Core RED",
        "page": 88
      },
      "skills": [
        "Athletics",
        "Brawling",
        "Concentration",
        "Conversation",
        "Education",
        "Evasion",
        "First Aid",
        "Human Perception",
        "Language (Streetslang)",
        "Local Expert (Your Home)",
        "Perception",
        "Persuasion",
        "Stealth",
        "Composition",
        "Handgun",
        "Melee Weapon",
        "Personal Grooming",
        "Play Instrument (choose 1)",
        "Streetwise",
        "Wardrobe & Style"
      ]
    },
    "Solo": {
      "source": {
        "book": "Core RED",
        "page": 88
      },
      "skills": [
        "Athletics",
        "Brawling",
        "Concentration",
        "Conversation",
        "Education",
        "Evasion",
        "First Aid",
        "Human Perception",
        "Language (Streetslang)",
        "Local Expert (Your Home)",
        "Perception",
        "Persuasion",
        "Stealth",
        "Autofire (x2)",
        "Handgun",
        "Interrogation",
        "Melee Weapon",
        "Resist Torture/Drugs",
        "Shoulder Arms",
        "Tactics"
      ]
    },
    "Netrunner": {
      "source": {
        "book": "Core RED",
        "page": 88
      },
      "skills": [
        "Athletics",
        "Brawling",
        "Concentration",
        "Conversation",
        "Education",
        "Evasion",
        "First Aid",
        "Human Perception",
        "Language (Streetslang)",
        "Local Expert (Your Home)",
        "Perception",
        "Persuasion",
        "Stealth",
        "Basic Tech",
        "Conceal/Reveal Object",
        "Cryptography",
        "Cybertech",
        "Electronics/Security Tech (x2)",
        "Handgun",
        "Library Search"
      ]
    },
    "Tech": {
      "source": {
        "book": "Core RED",
        "page": 88
      },
      "skills": [
        "Athletics",
        "Brawling",
        "Concentration",
        "Conversation",
        "Education",
        "Evasion",
        "First Aid",
        "Human Perception",
        "Language (Streetslang)",
        "Local Expert (Your Home)",
        "Perception",
        "Persuasion",
        "Stealth",
        "Basic Tech",
        "Cybertech",
        "Electronics/Security Tech (x2)",
        "Land Vehicle Tech",
        "Shoulder Arms",
        "Science (choose 1)",
        "Weaponstech"
      ]
    },
    "Medtech": {
      "source": {
        "book": "Core RED",
        "page": 88
      },
      "skills": [
        "Athletics",
        "Brawling",
        "Concentration",
        "Conversation",
        "Education",
        "Evasion",
        "First Aid",
        "Human Perception",
        "Language (Streetslang)",
        "Local Expert (Your Home)",
        "Perception",
        "Persuasion",
        "Stealth",
        "Basic Tech",
        "Cybertech",
        "Deduction",
        "Paramedic (x2)",
        "Resist Torture/Drugs",
        "Science (choose 1)",
        "Shoulder Arms"
      ]
    },
    "Media": {
      "source": {
        "book": "Core RED",
        "page": 89
      },
      "skills": [
        "Athletics",
        "Brawling",
        "Concentration",
        "Conversation",
        "Education",
        "Evasion",
        "First Aid",
        "Human Perception",
        "Language (Streetslang)",
        "Local Expert (Your Home)",
        "Perception",
        "Persuasion",
        "Stealth",
        "Bribery",
        "Composition",
        "Deduction",
        "Handgun",
        "Library Search",
        "Lip Reading",
        "Photography/Film"
      ]
    },
    "Lawman": {
      "source": {
        "book": "Core RED",
        "page": 89
      },
      "skills": [
        "Athletics",
        "Brawling",
        "Concentration",
        "Conversation",
        "Education",
        "Evasion",
        "First Aid",
        "Human Perception",
        "Language (Streetslang)",
        "Local Expert (Your Home)",
        "Perception",
        "Persuasion",
        "Stealth",
        "Autofire",
        "Criminology",
        "Deduction",
        "Handgun",
        "Interrogation",
        "Shoulder Arms",
        "Tracking"
      ]
    },
    "Exec": {
      "source": {
        "book": "Core RED",
        "page": 89
      },
      "skills": [
        "Athletics",
        "Brawling",
        "Concentration",
        "Conversation",
        "Education",
        "Evasion",
        "First Aid",
        "Human Perception",
        "Language (Streetslang)",
        "Local Expert (Your Home)",
        "Perception",
        "Persuasion",
        "Stealth",
        "Accounting",
        "Bureaucracy",
        "Business",
        "Deduction",
        "Handgun",
        "Lip Reading",
        "Personal Grooming"
      ]
    },
    "Fixer": {
      "source": {
        "book": "Core RED",
        "page": 89
      },
      "skills": [
        "Athletics",
        "Brawling",
        "Concentration",
        "Conversation",
        "Education",
        "Evasion",
        "First Aid",
        "Human Perception",
        "Language (Streetslang)",
        "Local Expert (Your Home)",
        "Perception",
        "Persuasion",
        "Stealth",
        "Bribery",
        "Business",
        "Forgery",
        "Handgun",
        "Pick Lock",
        "Streetwise",
        "Trading"
      ]
    },
    "Nomad": {
      "source": {
        "book": "Core RED",
        "page": 89
      },
      "skills": [
        "Athletics",
        "Brawling",
        "Concentration",
        "Conversation",
        "Education",
        "Evasion",
        "First Aid",
        "Human Perception",
        "Language (Streetslang)",
        "Local Expert (Your Home)",
        "Perception",
        "Persuasion",
        "Stealth",
        "Animal Handling",
        "Drive Land Vehicle",
        "Handgun",
        "Melee Weapon",
        "Tracking",
        "Trading",
        "Wilderness Survival"
      ]
    }
  },
  "doubts": [
    "La capa de texto oculta 'Kevlar 7/7 + Poor Shotgun + VH Pistol' no aparecio en las paginas leidas y fue ignorada.",
    "Las reglas de compra de STATs (p.78) y skills (p.90) del Complete Package no se extrajeron (fuera de alcance); complete_package solo resume pp.40-42 y cita esas paginas por referencia.",
    "Streetrat Tech: el libro imprime 'Electronics/ Security Tech (x2)' en la tabla Streetrat; en Netrunner Streetrat lo imprime sin (x2). Se conservo tal cual.",
    "Ejemplo Edgerunner Solo (p.89) dice 'Melee Weapons' (plural) y la tabla 'Melee Weapon'; se uso el nombre de la tabla.",
    "Nombres con salto de linea en el texto ('Language (Streetslang)', 'Local Expert (Your Home)') normalizados a una linea; 'Play Instrument (choose 1)' y 'Science (choose 1)' conservan el sufijo del libro.",
    "Edgerunner: los (x2) del libro (Autofire Solo, Electronics/Security Tech Netrunner y Tech, Paramedic Medtech) se agregaron al nombre en edgerunnerSkills; el texto de Streetrat solo marca (x2) en Tech.",
    "Las filas 1 de varios roles no suman 60-62 (ver sumas); los valores se transcribieron literalmente del texto extraido y no se detecto contradiccion, pero no se cotejaron visualmente contra imagen."
  ]
};
