// Generado por scripts/gen_creation.py desde data/creation-src/. No editar a mano.
import type { RoleRanksSrc } from './types';

export const ROLE_RANKS: RoleRanksSrc = {
  "pageConvention": "Core y RB página impresa; Folios página del PDF",
  "general": {
    "expandedAvailability": {
      "textEs": "Regla 2070s (aplica a todos los roles): hacia los 2070s la escasez 'terminó' para todos, aún más para los ricos y poderosos. Si necesitás algo y tu Reach no alcanza, podés saltarte al Fixer o al Night Market comprándolo directo a un fabricante o distribuidor autorizado, pagando el doble de su costo (sobreprecio corporativo), salvo que sea hecho a medida, único, o el GM prohíba esa compra directa. Nadie le comprará ese objeto a tu Edgerunner a ese precio, ni siquiera un Fixer o un Exec: ese sobreprecio es para desesperados y gente con dinero de sobra.",
      "source": {
        "book": "CEMK RB",
        "page": 26
      }
    },
    "roleTweaksNoteEs": "El RB p.25 también da ajustes de Nomad (puede conseguir cualquier Vehicle y Vehicle Upgrade pieza por pieza desde Moto Rango 1) y Netrunner (Quickhacks); esos roles no están en este archivo."
  },
  "roles": {
    "Solo": {
      "ability": "Combat Awareness",
      "source": {
        "book": "Core RED",
        "page": 146
      },
      "rulesEs": "Al comenzar el combate (antes de tirar Iniciativa), en cualquier momento fuera de combate, o dentro de combate gastando una Acción, el Solo reparte el total de puntos de su Combat Awareness (igual a su Rango) entre seis habilidades. Si no cambia la asignación, la anterior persiste. Cada habilidad cuesta distinto: Damage Deflection, Fumble Recovery y Precision Attack tienen escalones de costo fijo; Initiative Reaction, Spot Weakness y Threat Detection dan +1 por punto. Ejemplo del libro: un Solo de Rango 6 reparte 6 puntos y los reasigna al empezar una pelea o con una Acción durante ella.",
      "ranks": [
        {
          "rank": 1,
          "unlocksEs": [
            "Total de 1 punto de Combat Awareness para repartir entre las 6 opciones (el Rango de Rol = puntos totales).",
            "Con 1 punto: +1 a Iniciativa (Initiative Reaction), +1 al daño del primer Ataque exitoso de la Ronda (Spot Weakness) o +1 a Perception (Threat Detection)."
          ]
        },
        {
          "rank": 2,
          "unlocksEs": [
            "Total de 2 puntos de Combat Awareness para repartir entre las 6 opciones (el Rango de Rol = puntos totales).",
            "Ya alcanza Damage Deflection con 2 puntos: reduce 1 el primer daño recibido en la Ronda."
          ]
        },
        {
          "rank": 3,
          "unlocksEs": [
            "Total de 3 puntos de Combat Awareness para repartir entre las 6 opciones (el Rango de Rol = puntos totales).",
            "Ya alcanza Precision Attack con 3 puntos: +1 a todos los Ataques."
          ]
        },
        {
          "rank": 4,
          "unlocksEs": [
            "Total de 4 puntos de Combat Awareness para repartir entre las 6 opciones (el Rango de Rol = puntos totales).",
            "Ya alcanza Damage Deflection con 4 puntos: reduce 2 el primer daño recibido en la Ronda.",
            "Ya alcanza Fumble Recovery (4 puntos): ignora los fallos críticos (1) al atacar."
          ]
        },
        {
          "rank": 5,
          "unlocksEs": [
            "Total de 5 puntos de Combat Awareness para repartir entre las 6 opciones (el Rango de Rol = puntos totales)."
          ]
        },
        {
          "rank": 6,
          "unlocksEs": [
            "Total de 6 puntos de Combat Awareness para repartir entre las 6 opciones (el Rango de Rol = puntos totales).",
            "Ya alcanza Damage Deflection con 6 puntos: reduce 3 el primer daño recibido en la Ronda.",
            "Ya alcanza Precision Attack con 6 puntos: +2 a todos los Ataques."
          ]
        },
        {
          "rank": 7,
          "unlocksEs": [
            "Total de 7 puntos de Combat Awareness para repartir entre las 6 opciones (el Rango de Rol = puntos totales)."
          ]
        },
        {
          "rank": 8,
          "unlocksEs": [
            "Total de 8 puntos de Combat Awareness para repartir entre las 6 opciones (el Rango de Rol = puntos totales).",
            "Ya alcanza Damage Deflection con 8 puntos: reduce 4 el primer daño recibido en la Ronda."
          ]
        },
        {
          "rank": 9,
          "unlocksEs": [
            "Total de 9 puntos de Combat Awareness para repartir entre las 6 opciones (el Rango de Rol = puntos totales).",
            "Ya alcanza Precision Attack con 9 puntos: +3 a todos los Ataques."
          ]
        },
        {
          "rank": 10,
          "unlocksEs": [
            "Total de 10 puntos de Combat Awareness para repartir entre las 6 opciones (el Rango de Rol = puntos totales).",
            "Ya alcanza Damage Deflection con 10 puntos: reduce 5 el primer daño recibido en la Ronda."
          ]
        }
      ],
      "options": [
        {
          "id": "damage_deflection",
          "name": "Damage Deflection",
          "costs": [
            {
              "points": 2,
              "effectEs": "Reduce 1 el primer daño que recibes esta Ronda."
            },
            {
              "points": 4,
              "effectEs": "Reduce 2 el primer daño que recibes esta Ronda."
            },
            {
              "points": 6,
              "effectEs": "Reduce 3 el primer daño que recibes esta Ronda."
            },
            {
              "points": 8,
              "effectEs": "Reduce 4 el primer daño que recibes esta Ronda."
            },
            {
              "points": 10,
              "effectEs": "Reduce 5 el primer daño que recibes esta Ronda."
            }
          ],
          "effectEs": "Entrenado para 'rodar con los golpes': reduce el primer daño recibido en la Ronda según los puntos invertidos."
        },
        {
          "id": "fumble_recovery",
          "name": "Fumble Recovery",
          "costs": [
            {
              "points": 4,
              "effectEs": "Ignoras los fallos críticos (1) que saques al atacar; esas tiradas siguen contando como 1."
            }
          ],
          "effectEs": "Recuperación instantánea de errores tomándose su tiempo con cada disparo."
        },
        {
          "id": "initiative_reaction",
          "name": "Initiative Reaction",
          "costs": [
            {
              "points": 1,
              "effectEs": "+1 a las tiradas de Iniciativa (cada punto suma +1)."
            }
          ],
          "effectEs": "Reflejos entrenados para responder al instante al inicio de un tiroteo; cada punto suma +1 a las tiradas de Iniciativa."
        },
        {
          "id": "precision_attack",
          "name": "Precision Attack",
          "costs": [
            {
              "points": 3,
              "effectEs": "+1 a cualquier Ataque que hagas."
            },
            {
              "points": 6,
              "effectEs": "+2 a cualquier Ataque que hagas."
            },
            {
              "points": 9,
              "effectEs": "+3 a cualquier Ataque que hagas."
            }
          ],
          "effectEs": "Entrenado para apuntar con precisión, con mayor exactitud en los Ataques."
        },
        {
          "id": "spot_weakness",
          "name": "Spot Weakness",
          "costs": [
            {
              "points": 1,
              "effectEs": "+1 al daño (antes de armadura) de tu primer Ataque exitoso de la Ronda (cada punto suma +1)."
            }
          ],
          "effectEs": "Busca puntos débiles para dañar incluso a blancos muy blindados; cada punto suma +1 al daño antes de armadura del primer Ataque exitoso de la Ronda."
        },
        {
          "id": "threat_detection",
          "name": "Threat Detection",
          "costs": [
            {
              "points": 1,
              "effectEs": "+1 a las Pruebas de Perception (cada punto suma +1)."
            }
          ],
          "effectEs": "Conciencia situacional mejorada; cada punto suma +1 a cualquier Prueba de Perception."
        }
      ],
      "tables": {
        "damageDeflection": [
          {
            "points": 2,
            "reduction": 1
          },
          {
            "points": 4,
            "reduction": 2
          },
          {
            "points": 6,
            "reduction": 3
          },
          {
            "points": 8,
            "reduction": 4
          },
          {
            "points": 10,
            "reduction": 5
          }
        ],
        "precisionAttack": [
          {
            "points": 3,
            "bonus": 1
          },
          {
            "points": 6,
            "bonus": 2
          },
          {
            "points": 9,
            "bonus": 3
          }
        ],
        "perPointOptions": [
          "initiative_reaction",
          "spot_weakness",
          "threat_detection"
        ],
        "pointsByRank": "Puntos totales = Rango (1 a 10)"
      },
      "tweak2077": [],
      "cemk": null,
      "folio": {
        "pregen": "Hardpoint",
        "folioTextEs": "Siempre estás evaluando la escena y tus reflejos están afinados. Suma +4 a cualquier tirada de Iniciativa que hagas.",
        "source": {
          "book": "CEMK Folios",
          "page": 1
        },
        "convertsToEs": "Combat Awareness Rango 4 con los 4 puntos en Initiative Reaction (+4 a Iniciativa). El Folio no cubre ninguna otra opción de Combat Awareness, así que el Solo del Folio no tiene Damage Deflection, Precision Attack, etc.; como el jugador puede reasignar sus puntos libremente (al iniciar combate o con una Acción), la asignación inicial reproduce el Folio y el resto queda libre para el jugador.",
        "startingAllocation": {
          "initiative_reaction": 4
        }
      }
    },
    "Netrunner": {
      "ability": "Interface",
      "source": {
        "book": "Core RED",
        "page": 147
      },
      "rulesEs": "Interface permite Netrunear (sin ella no se puede), determina cuántas Acciones NET se pueden hacer por Turno y da acceso a las 9 Habilidades de Interface. En tu Turno haces 1 Acción de Carne (Meat) O tantas Acciones NET como te dé tu Interface; en ambos casos conservas tu Move Action. Las Acciones NET son: Jack In/Out (a ≤6 m/yd de un punto de acceso; sin pared de por medio), usar una Habilidad de Interface, activar/desactivar un Programa y 'misceláneo'. Moverte dentro de la Arquitectura y guardar copia de un Archivo no cuestan Acción NET. Las Habilidades de Interface (salvo Zap) se resuelven con Interface + 1d10 contra un DV; Interface es el Rango de Rol. Si haces Jack Out por tu cuenta, restableces las defensas de la Arquitectura; si te mueves fuera de los 6 m/yd estando conectado, sufres todo el efecto de la Black ICE encontrada pero no derrotada. Un Programa activado no puede reactivarse hasta desactivarse; cada Programa solo puede activarse una vez por Ronda de Meatspace.",
      "ranks": [
        {
          "rank": 1,
          "unlocksEs": [
            "2 Acciones NET por Turno. (escalón nuevo)",
            "Tira Interface + 1d10 (Interface = Rango, sin STAT) en las Habilidades de Interface; acceso a las 9 Habilidades de Interface desde Rango 1 (la tabla del Core no las separa por Rango)."
          ]
        },
        {
          "rank": 2,
          "unlocksEs": [
            "2 Acciones NET por Turno.",
            "Tira Interface + 1d10 (Interface = Rango, sin STAT) en las Habilidades de Interface; acceso a las 9 Habilidades de Interface desde Rango 1 (la tabla del Core no las separa por Rango)."
          ]
        },
        {
          "rank": 3,
          "unlocksEs": [
            "2 Acciones NET por Turno.",
            "Tira Interface + 1d10 (Interface = Rango, sin STAT) en las Habilidades de Interface; acceso a las 9 Habilidades de Interface desde Rango 1 (la tabla del Core no las separa por Rango)."
          ]
        },
        {
          "rank": 4,
          "unlocksEs": [
            "3 Acciones NET por Turno. (escalón nuevo)",
            "Tira Interface + 1d10 (Interface = Rango, sin STAT) en las Habilidades de Interface; acceso a las 9 Habilidades de Interface desde Rango 1 (la tabla del Core no las separa por Rango)."
          ]
        },
        {
          "rank": 5,
          "unlocksEs": [
            "3 Acciones NET por Turno.",
            "Tira Interface + 1d10 (Interface = Rango, sin STAT) en las Habilidades de Interface; acceso a las 9 Habilidades de Interface desde Rango 1 (la tabla del Core no las separa por Rango)."
          ]
        },
        {
          "rank": 6,
          "unlocksEs": [
            "3 Acciones NET por Turno.",
            "Tira Interface + 1d10 (Interface = Rango, sin STAT) en las Habilidades de Interface; acceso a las 9 Habilidades de Interface desde Rango 1 (la tabla del Core no las separa por Rango)."
          ]
        },
        {
          "rank": 7,
          "unlocksEs": [
            "4 Acciones NET por Turno. (escalón nuevo)",
            "Tira Interface + 1d10 (Interface = Rango, sin STAT) en las Habilidades de Interface; acceso a las 9 Habilidades de Interface desde Rango 1 (la tabla del Core no las separa por Rango)."
          ]
        },
        {
          "rank": 8,
          "unlocksEs": [
            "4 Acciones NET por Turno.",
            "Tira Interface + 1d10 (Interface = Rango, sin STAT) en las Habilidades de Interface; acceso a las 9 Habilidades de Interface desde Rango 1 (la tabla del Core no las separa por Rango)."
          ]
        },
        {
          "rank": 9,
          "unlocksEs": [
            "4 Acciones NET por Turno.",
            "Tira Interface + 1d10 (Interface = Rango, sin STAT) en las Habilidades de Interface; acceso a las 9 Habilidades de Interface desde Rango 1 (la tabla del Core no las separa por Rango)."
          ]
        },
        {
          "rank": 10,
          "unlocksEs": [
            "5 Acciones NET por Turno. (escalón nuevo)",
            "Tira Interface + 1d10 (Interface = Rango, sin STAT) en las Habilidades de Interface; acceso a las 9 Habilidades de Interface desde Rango 1 (la tabla del Core no las separa por Rango)."
          ]
        }
      ],
      "options": [
        {
          "id": "backdoor",
          "name": "Backdoor",
          "costs": [],
          "dvEs": "Interface + 1d10 contra el DV del Password (lo fija la Arquitectura); si ya conoces el Password, pasas sin tirar",
          "netActionCost": "Permite romper Passwords y otras obstrucciones de la Arquitectura. Ejemplo del libro: Password DV10, Interface 7 + 1d10 = 16 y pasa. (En CEMK 2070s esta Acción NET se renombra Breach.)",
          "effectEs": "1 Acción NET"
        },
        {
          "id": "cloak",
          "name": "Cloak",
          "costs": [],
          "dvEs": "El Check de Cloak fija el DV que otro Netrunner debe superar con Pathfinder (Interface + 1d10)",
          "netActionCost": "Oculta tus rastros y cualquier Virus que dejaste en la Arquitectura. Si no usas Cloak antes de hacer Jack Out, otro Netrunner descubre automáticamente tus acciones al usar Pathfinder. Ejemplo: Interface 7 + 1d10 = 16 obliga al enemigo a superar 16.",
          "effectEs": "1 Acción NET"
        },
        {
          "id": "control",
          "name": "Control",
          "costs": [],
          "dvEs": "Interface + 1d10 contra el DV del Control Node (ej. DV10 en el libro); para arrebatar un Nodo que tiene otro Netrunner o un Demon, el DV es el Check con que lo tomó",
          "netActionCost": "Controla cosas conectadas a la Arquitectura (cámaras, drones, torretas, rejillas láser, ascensores, aspersores) mediante un Control Node. Operar cada cosa requiere una Acción NET aparte y puede hacerse desde cualquier parte de la Arquitectura mientras controles el Nodo. Cada Nodo solo puede activarse una vez por Turno. Al hacer Jack Out pierdes los Nodos que controlas.",
          "effectEs": "1 Acción NET para tomar el Nodo; 1 Acción NET adicional por cada cosa que operes"
        },
        {
          "id": "eye_dee",
          "name": "Eye-Dee",
          "costs": [],
          "dvEs": "Interface + 1d10 contra el DV del Archivo (algunos Archivos tienen DV; ej. DV9 en el libro)",
          "netActionCost": "Sabes qué es un dato encontrado (como un Archivo) y su valor.",
          "effectEs": "1 Acción NET"
        },
        {
          "id": "pathfinder",
          "name": "Pathfinder",
          "costs": [],
          "dvEs": "Interface + 1d10; el Check no se compara con un DV fijo: ves tantos pisos como el resultado, o hasta la primera obstrucción (normalmente un Password) con DV mayor que tu Check",
          "netActionCost": "Revela parcialmente el 'mapa' de la Arquitectura (qué hay, sin el DV de nada). Ejemplo: resultado 10 con un Password DV11 en el tercer piso: ves solo los 3 primeros pisos.",
          "effectEs": "1 Acción NET"
        },
        {
          "id": "scanner",
          "name": "Scanner",
          "costs": [],
          "dvEs": "Interface + 1d10; cuanto mayor el resultado, más y más lejos detectas (lo decide el GM). Ejemplo del libro: Interface 7 + 1d10 = 14 revela la ubicación de 2 puntos de acceso cercanos",
          "netActionCost": "Averigua la ubicación en el Meatspace de los puntos de acceso a Arquitecturas NET de un área. Es la única Habilidad de Interface que no se usa como Acción NET en el Core.",
          "effectEs": "Acción de Carne (Meat Action) en el Core; Acción NET con el ajuste CEMK 2070s"
        },
        {
          "id": "slide",
          "name": "Slide",
          "costs": [],
          "dvEs": "Interface + 1d10 contra la Perception + 1d10 de la Black ICE (ej. Hellhound Perception 6)",
          "netActionCost": "Huyes de un único Programa de Black ICE que no sea Demon: escapas al piso adyacente del ascensor (no más allá de un Password u otra obstrucción NET). La Black ICE deja de seguirte y queda al acecho donde estaba.",
          "effectEs": "1 Acción NET; solo 1 intento por Turno; no se puede usar preventivamente"
        },
        {
          "id": "virus",
          "name": "Virus",
          "costs": [],
          "dvEs": "Interface + 1d10 contra un DV que asigna el GM según lo poderoso del Virus; el DV para destruirlo es el Check con que se creó",
          "netActionCost": "Solo desde el piso más bajo de la Arquitectura: dejas un Virus propio que realiza hasta 2 acciones o cambios razonables. Es la única forma de hacer un cambio en la Arquitectura que persista tras el Jack Out. Ejemplos del libro: cambiar el icono de las Black ICE Asp DV6, 1 Acción NET; desactivar una Black ICE concreta DV10, 2 Acciones NET; hacer fallar un Control Node DV10, 2 Acciones NET; borrar toda la Black ICE permanentemente DV12, 10 Acciones NET; reducir a la mitad los pisos DV12, 10 Acciones NET.",
          "effectEs": "Las que el GM determine (según el Virus)"
        },
        {
          "id": "zap",
          "name": "Zap",
          "costs": [],
          "dvEs": "Zap Check contra la Defense + 1d10 del Programa o la Interface + 1d10 del Netrunner (no usa DV fijo)",
          "netActionCost": "Ataque básico del Netrunner contra un Programa o contra otro Netrunner. Si lo logras, haces 1d6 de daño al REZ del Programa o directamente al cerebro del Netrunner.",
          "effectEs": "1 Acción NET"
        }
      ],
      "tables": {
        "netActionsByRank": [
          {
            "fromRank": 1,
            "toRank": 3,
            "actions": 2
          },
          {
            "fromRank": 4,
            "toRank": 6,
            "actions": 3
          },
          {
            "fromRank": 7,
            "toRank": 9,
            "actions": 4
          },
          {
            "fromRank": 10,
            "toRank": 10,
            "actions": 5
          }
        ],
        "netActionTypes": [
          {
            "name": "Jack In / Jack Out",
            "textEs": "Entrar o salir con seguridad de una Arquitectura NET a ≤6 m/yd de un punto de acceso (una pared suele bloquear la Acción). Salir sin Jack Out te deja vulnerable a la Black ICE encontrada."
          },
          {
            "name": "Usar Habilidad de Interface",
            "textEs": "Todas menos una (Scanner en el Core) requieren al menos una Acción NET."
          },
          {
            "name": "Activar/Desactivar Programa",
            "textEs": "Activar o desactivar uno de tus Programas."
          },
          {
            "name": "Misceláneo",
            "textEs": "Rara vez algo no encaja en las categorías anteriores; el GM decide y probablemente cueste una Acción NET."
          }
        ],
        "netCombat": "Tu Interface + ATK del Programa + 1d10 (o ATK de Black ICE + 1d10) contra Interface + 1d10 del blanco, o DEF del Programa/Black ICE + 1d10. Con un impacto el blanco sufre el efecto del Programa.",
        "cyberdeckSlots": [
          {
            "type": "Poor Quality Cyberdeck",
            "cost": "100eb (Premium)",
            "slots": 5
          },
          {
            "type": "Cyberdeck",
            "cost": "500eb (Expensive)",
            "slots": 7
          },
          {
            "type": "Excellent Quality Cyberdeck",
            "cost": "1.000eb (Very Expensive)",
            "slots": 9
          }
        ]
      },
      "tweak2077": [
        {
          "fromRank": 1,
          "textEs": "Quickhack de ciberware como parte de Interface: acceso a todos los Quickhacks Simple (DV6) desde Interface Rank 1.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        },
        {
          "fromRank": 2,
          "textEs": "Acceso a todos los Quickhacks Standard (DV8).",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        },
        {
          "fromRank": 3,
          "textEs": "Acceso a todos los Quickhacks Difficult (DV10); además supera automáticamente, sin Check, el firewall base de un Neuroport.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        },
        {
          "fromRank": 4,
          "textEs": "Acceso a todos los Quickhacks Advanced (DV12).",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        },
        {
          "fromRank": null,
          "textEs": "La Habilidad de Interface Scanner pasa de Meat Action a NET Action.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        }
      ],
      "cemk": {
        "textEs": "Quickhacking (2070s): solo funciona contra blancos con Neuroport. Interface es una Skill especial a la que nunca se suma un STAT (solo Interface + 1d10); sigue las reglas normales (Luck, Skill complementaria, tiempo extra; penalizadores como Grapple o Wound State la bajan). Un Netrunner hace 1 Meat Action o hasta 3 Net Actions por Turno (RB p.16; ver nota de duda: el Core da 2/3/4/5 por Rango). Acciones NET del RB: Jack In (Interface + 1d10 contra WILL + 1d10 del blanco; entra aunque falle, pero el blanco se entera; el blanco puede intentar expulsarlo como Acción ROF1 con WILL + Concentration + 1d10 contra Interface + 1d10; si lo expulsan no puede reintentar con ese individuo por 60 minutos), Jack Out, Breach (superar un Passwall) y Quickhack (Interface + 1d10 contra el DV del Quickhack; solo 1 Quickhack por blanco por Turno; solo tras superar todos los Passwalls). Firewall base del Neuroport: con Interface Rank 1 o 2 hay que superar un Check Interface DV6 antes del Check opuesto de Jack In (si falla, el defensor no se entera); desde Rank 3 se supera automáticamente. El firewall base no es un Passwall ni ocupa piso. Breach: cada Self-ICE instalado añade un Passwall y cuesta 1 Acción NET superarlo; el DV de todos los Passwalls depende del total de Self-ICE (máximo 3): 1 Self-ICE = DV6, 2 = DV8, 3 = DV10. Direct Connection: Jack In directo con Personal Link (Interface Plug); +1 Acción NET por Turno y se saltan los Passwalls (no la Black ICE); requiere proximidad y se corta si Netrunner o blanco se alejan más de 2 m/yd o se arranca el cable; no se puede hacer a un blanco que no sea inconsciente o inmovilizado por completo. Los Neuroports funcionan como Arquitectura NET: sin Self-ICE ni Black ICE hay 1 piso con un Control Node DV10 (holophone); si no, 1 piso por Passwall y/o Black ICE conectada. Un Neuroport no instala Black ICE propia: toma prestada la del Cyberdeck al que el usuario esté conectado. El Netrunner siempre está conectado a su propio Neuroport y no puede ser expulsado de él.",
        "data": {
          "quickhackDvByRank": [
            {
              "rank": 1,
              "tier": "Simple",
              "dv": 6
            },
            {
              "rank": 2,
              "tier": "Standard",
              "dv": 8
            },
            {
              "rank": 3,
              "tier": "Difficult",
              "dv": 10
            },
            {
              "rank": 4,
              "tier": "Advanced",
              "dv": 12
            }
          ],
          "quickhacks": [
            {
              "name": "Impair Movement",
              "dv": 6,
              "tier": "Simple",
              "effectEs": "MOVE del blanco −1 por 60 s (20 Rounds); si llega a 0 no puede hacer Move Action."
            },
            {
              "name": "Sonic Shock",
              "dv": 6,
              "tier": "Simple",
              "effectEs": "Lesión Crítica Damaged Ear (sin daño adicional) por 60 s (20 Rounds)."
            },
            {
              "name": "Overheat",
              "dv": 8,
              "tier": "Standard",
              "effectEs": "El blanco arde: 4 de daño directo a HP al final de su Turno hasta apagar el fuego; ignora armadura sin ablandarla; apagarlo requiere una Acción ROF1 solo en su Turno."
            },
            {
              "name": "Short Circuit",
              "dv": 8,
              "tier": "Standard",
              "effectEs": "El GM elige 3 piezas de ciberware (excepto Cyberarm, Cyberleg, Cybereye, Cyberaudio Suite, Neuroport o Neuroport Cyberdeck Expansion; sí opciones adosadas como Mantis Blades o Low Light/Infrared/UV); dejan de funcionar 60 s (20 Rounds)."
            },
            {
              "name": "Cyberware Malfunction",
              "dv": 10,
              "tier": "Difficult",
              "effectEs": "El jugador del Netrunner elige una pieza de ciberware del blanco (excepto Neuroport o Neuroport Cyberdeck Port) que queda inoperante 60 s (20 Rounds); un cyberlimb inoperante actúa como Broken Arm/Broken Leg y sus opciones se apagan."
            },
            {
              "name": "Lure",
              "dv": 10,
              "tier": "Difficult",
              "effectEs": "Al inicio del siguiente Turno del blanco, hace una Move Action controlada por el Netrunner (investiga un ruido fantasma). Solo si el blanco no sabe que hay un Netrunner conectado; no lo alerta; no puede llevarlo a un peligro físico obvio."
            },
            {
              "name": "Slow",
              "dv": 10,
              "tier": "Difficult",
              "effectEs": "MOVE del blanco −1d6 por 60 s (20 Rounds); si llega a 0 no puede hacer Move Action."
            },
            {
              "name": "Synapse Burnout",
              "dv": 10,
              "tier": "Difficult",
              "effectEs": "3d6 de daño directo a HP; ignora armadura y no la ablanda."
            },
            {
              "name": "Puppet",
              "dv": 12,
              "tier": "Advanced",
              "effectEs": "Controlas la Acción y la Move Action del blanco en su siguiente Turno; los Checks usan los STATs y Skills del blanco."
            },
            {
              "name": "Shard Ejection",
              "dv": 12,
              "tier": "Advanced",
              "effectEs": "Desinstala y expulsa a una casilla adyacente una pieza de chipware del blanco (a elección del Netrunner); no funciona si la ranura tiene tapa (ni siquiera cinta)."
            },
            {
              "name": "System Reset",
              "dv": 12,
              "tier": "Advanced",
              "effectEs": "El blanco queda Inconsciente 60 s (20 Rounds) o hasta que lo despierte recibir daño, y cae Prone."
            }
          ],
          "scannerNetAction": true,
          "firewall": {
            "baseDvRank1to2": 6,
            "autoBypassFromRank": 3,
            "notAPasswall": true
          },
          "rangeMeters": {
            "externalCyberdeck": 6,
            "externalCyberdeckWithHardwareOption": 8,
            "neuroportCyberdeckPort": 50,
            "notes": "Se necesita línea de visión. 6 m/yd = 3 casillas; 8 m/yd = 4 casillas; 50 m/yd = 25 casillas. El Neuroport Cyberdeck Port (RB p.36) da 20 m/yd para Arquitecturas NET normales y 50 m/yd para Neuroports; las paredes siguen bloqueando."
          },
          "breach": {
            "selfIceMax": 3,
            "passwallDvByTotalSelfIce": [
              {
                "selfIce": 1,
                "dv": 6
              },
              {
                "selfIce": 2,
                "dv": 8
              },
              {
                "selfIce": 3,
                "dv": 10
              }
            ],
            "backdoorRenamedBreach": true,
            "netActionCostPerPasswall": 1
          },
          "selfIce": {
            "cost": "500eb (Expensive)",
            "install": "Hospital",
            "humanityLoss": "3 (1d6)",
            "maxInstalls": 3
          },
          "directConnection": {
            "extraNetActionsPerTurn": 1,
            "bypassesPasswalls": true,
            "bypassesBlackIce": false,
            "breakDistanceMeters": 2,
            "requiresUnwillingTargetUnconsciousOrRestrained": true
          },
          "jackIn": {
            "check": "Interface + 1d10 vs WILL + 1d10 del blanco",
            "ejectCheck": "WILL + Concentration + 1d10 vs Interface + 1d10 (Acción ROF1)",
            "lockoutMinutes": 60
          },
          "neuroportArchitecture": {
            "floorsWithoutSelfIceOrBlackIce": 1,
            "controlNodeDv": 10,
            "controlNodeAttached": "Holophone"
          }
        },
        "source": {
          "book": "CEMK RB",
          "page": "16-17, 25-27, 36",
          "note": "Jack In/Breach/Quickhack y lista de Quickhacks pp.16-17; ajuste de rol p.25; rango, firewall y Arquitectura de Neuroport p.26; Direct Connection y Backdoor→Breach p.27; Self-ICE p.36"
        }
      },
      "folio": {
        "pregen": "Bluescreen",
        "folioTextEs": "Olvida teclados y pantallas táctiles: puedes usar el cerebro para hackear gente. Tienes Interface 4 y 3 Net Actions en tu Turno a efectos de Quickhacking.",
        "source": {
          "book": "CEMK Folios",
          "page": 13
        },
        "convertsToEs": "Netrunner con Interface Rango 4: 3 Acciones NET por Turno (igual que el Folio) y, con el ajuste 2070s, acceso a todos los Quickhacks hasta Advanced (DV12). El Folio no cubre el resto de Interface; el jugador elige libremente cómo usar sus Habilidades de Interface.",
        "startingAllocation": {
          "interface": 4
        }
      }
    },
    "Tech": {
      "ability": "Maker",
      "source": {
        "book": "Core RED",
        "page": 147
      },
      "rulesEs": "Maker permite arreglar, mejorar, modificar, fabricar e inventar objetos. Cada vez que el Tech sube 1 Rango de Maker, gana 1 Rango en dos Especialidades de Maker distintas a su elección (Field Expertise, Upgrade Expertise, Fabrication Expertise o Invention Expertise). Upgrade, Fabrication e Invention se tiran con TECH + Skill TECH apropiada + Rango de la especialidad + 1d10 contra un DV y tiempo que dependen de la Categoría de Precio (tabla DV/tiempo, Core p.149).",
      "ranks": [
        {
          "rank": 1,
          "unlocksEs": [
            "Al subir a Rango 1 ganas 1 Rango en dos Especialidades de Maker distintas a elección; en total 2 Rangos de especialidad repartidos entre Field, Upgrade, Fabrication e Invention (máx. 1 por especialidad, porque cada subida da como mucho 1 a cada una).",
            "Field Expertise: si tienes ≥1 Rango, puedes reparar temporalmente un objeto (jury-rig) y dura 10 min por cada Rango que tengas en esa especialidad."
          ]
        },
        {
          "rank": 2,
          "unlocksEs": [
            "Al subir a Rango 2 ganas 1 Rango en dos Especialidades de Maker distintas a elección; en total 4 Rangos de especialidad repartidos entre Field, Upgrade, Fabrication e Invention (máx. 2 por especialidad, porque cada subida da como mucho 1 a cada una).",
            "Cada Rango extra en Field Expertise suma +1 a los Checks que cubre y alarga el jury-rig 10 minutos."
          ]
        },
        {
          "rank": 3,
          "unlocksEs": [
            "Al subir a Rango 3 ganas 1 Rango en dos Especialidades de Maker distintas a elección; en total 6 Rangos de especialidad repartidos entre Field, Upgrade, Fabrication e Invention (máx. 3 por especialidad, porque cada subida da como mucho 1 a cada una).",
            "Cada Rango extra en Field Expertise suma +1 a los Checks que cubre y alarga el jury-rig 10 minutos."
          ]
        },
        {
          "rank": 4,
          "unlocksEs": [
            "Al subir a Rango 4 ganas 1 Rango en dos Especialidades de Maker distintas a elección; en total 8 Rangos de especialidad repartidos entre Field, Upgrade, Fabrication e Invention (máx. 4 por especialidad, porque cada subida da como mucho 1 a cada una).",
            "Cada Rango extra en Field Expertise suma +1 a los Checks que cubre y alarga el jury-rig 10 minutos."
          ]
        },
        {
          "rank": 5,
          "unlocksEs": [
            "Al subir a Rango 5 ganas 1 Rango en dos Especialidades de Maker distintas a elección; en total 10 Rangos de especialidad repartidos entre Field, Upgrade, Fabrication e Invention (máx. 5 por especialidad, porque cada subida da como mucho 1 a cada una).",
            "Cada Rango extra en Field Expertise suma +1 a los Checks que cubre y alarga el jury-rig 10 minutos."
          ]
        },
        {
          "rank": 6,
          "unlocksEs": [
            "Al subir a Rango 6 ganas 1 Rango en dos Especialidades de Maker distintas a elección; en total 12 Rangos de especialidad repartidos entre Field, Upgrade, Fabrication e Invention (máx. 6 por especialidad, porque cada subida da como mucho 1 a cada una).",
            "Cada Rango extra en Field Expertise suma +1 a los Checks que cubre y alarga el jury-rig 10 minutos."
          ]
        },
        {
          "rank": 7,
          "unlocksEs": [
            "Al subir a Rango 7 ganas 1 Rango en dos Especialidades de Maker distintas a elección; en total 14 Rangos de especialidad repartidos entre Field, Upgrade, Fabrication e Invention (máx. 7 por especialidad, porque cada subida da como mucho 1 a cada una).",
            "Cada Rango extra en Field Expertise suma +1 a los Checks que cubre y alarga el jury-rig 10 minutos."
          ]
        },
        {
          "rank": 8,
          "unlocksEs": [
            "Al subir a Rango 8 ganas 1 Rango en dos Especialidades de Maker distintas a elección; en total 16 Rangos de especialidad repartidos entre Field, Upgrade, Fabrication e Invention (máx. 8 por especialidad, porque cada subida da como mucho 1 a cada una).",
            "Cada Rango extra en Field Expertise suma +1 a los Checks que cubre y alarga el jury-rig 10 minutos."
          ]
        },
        {
          "rank": 9,
          "unlocksEs": [
            "Al subir a Rango 9 ganas 1 Rango en dos Especialidades de Maker distintas a elección; en total 18 Rangos de especialidad repartidos entre Field, Upgrade, Fabrication e Invention (máx. 9 por especialidad, porque cada subida da como mucho 1 a cada una).",
            "Cada Rango extra en Field Expertise suma +1 a los Checks que cubre y alarga el jury-rig 10 minutos."
          ]
        },
        {
          "rank": 10,
          "unlocksEs": [
            "Al subir a Rango 10 ganas 1 Rango en dos Especialidades de Maker distintas a elección; en total 20 Rangos de especialidad repartidos entre Field, Upgrade, Fabrication e Invention (máx. 10 por especialidad, porque cada subida da como mucho 1 a cada una).",
            "Cada Rango extra en Field Expertise suma +1 a los Checks que cubre y alarga el jury-rig 10 minutos."
          ]
        }
      ],
      "options": [
        {
          "id": "field_expertise",
          "name": "Field Expertise",
          "costs": [
            {
              "points": 1,
              "effectEs": "1 Rango de especialidad (cada subida de Maker da 1 Rango en 2 especialidades distintas)"
            }
          ],
          "effectEs": "Suma tu Rango en esta especialidad a cualquier Check de Basic Tech, Cybertech, Electronics/Security Tech, Weaponstech o Land/Sea/Air Vehicle Tech hecho para un propósito que no sea de especialidad Maker. Además, con al menos 1 Rango, en vez de una reparación completa larga puedes reparar temporalmente el objeto (mismo DV de una reparación típica) a perfecto estado como Acción (SP y HP completos), sumando tu Rango en Field Expertise a esa Prueba. El jury-rig dura 10 minutos por cada Rango; luego el objeto vuelve a su estado previo y no puede volver a improvisarse hasta una reparación completa."
        },
        {
          "id": "upgrade_expertise",
          "name": "Upgrade Expertise",
          "costs": [
            {
              "points": 1,
              "effectEs": "1 Rango de especialidad (cada subida de Maker da 1 Rango en 2 especialidades distintas)"
            }
          ],
          "effectEs": "Mejora un objeto (cada objeto solo recibe 1 mejora de esta especialidad): −1d6 a la pérdida de Humanidad de ciberware no-borgware si su pérdida típica es 2d6 o más; +1 ranura de un tipo que el objeto ya tenga (opciones, accesorios, Programas/Hardware, etc.); simplificarlo (reduce a la mitad el tiempo de futuras reparaciones completas); hacer ocultable un arma a una mano normalmente no ocultable; subir un arma de Calidad Promedio a Excelente; dar una ranura de Accesorio a un arma Exótica; permitir a un arma Exótica disparar una variedad de munición no básica de su tipo; +1 SP a un objeto que ya tuviera; instalar a un vehículo una mejora que solo requiera Rango 1 de Moto; instalar una mejora inventada con Invention Expertise (materiales extra igual a la Categoría de Precio asignada). Check: TECH + Skill TECH con que se repara el objeto + tu Rango en la especialidad + 1d10. Hay que comprar materiales de la misma Categoría de Precio que el objeto, que se consumen. DV y tiempo según la Categoría de Precio del objeto (las mejoras de vehículo se tratan como 1.000eb, Very Expensive). Si fallas, a mitad del proceso tienes que empezar de nuevo; materiales y objeto quedan intactos."
        },
        {
          "id": "fabrication_expertise",
          "name": "Fabrication Expertise",
          "costs": [
            {
              "points": 1,
              "effectEs": "1 Rango de especialidad (cada subida de Maker da 1 Rango en 2 especialidades distintas)"
            }
          ],
          "effectEs": "Fabrica un objeto existente (o uno inventado con Invention Expertise) a partir de materiales. Check: TECH + Skill TECH con que se repara el objeto + tu Rango en la especialidad + 1d10. Hay que comprar materiales de una Categoría de Precio inferior a la del objeto (excepto Super Luxury, que requiere materiales equivalentes a la mitad de su Precio). DV y tiempo según la Categoría de Precio del objeto. Si fallas, a mitad del proceso empiezas de nuevo; materiales intactos. Dato del libro: fabricar un objeto Cheap cuesta 5eb."
        },
        {
          "id": "invention_expertise",
          "name": "Invention Expertise",
          "costs": [
            {
              "points": 1,
              "effectEs": "1 Rango de especialidad (cada subida de Maker da 1 Rango en 2 especialidades distintas)"
            }
          ],
          "effectEs": "Inventa una mejora para un objeto existente o un objeto completamente nuevo. Describes al GM la función y el mecanismo; si lo aprueba, redacta las reglas sin crear algo desequilibrado y fija la Categoría de Precio según su valor de mercado (la más baja posible es Expensive). Check: TECH + Skill TECH asociada a reparar la invención o el objeto que mejora + tu Rango en la especialidad + 1d10 contra el DV de su Categoría de Precio; si fallas, hay que volver al tablero. Una vez inventado, tú u otro Tech con los planos pueden hacerlo real con Fabrication o Upgrade Expertise. El GM puede cambiar retroactivamente cómo opera la invención para mantener el equilibrio."
        }
      ],
      "tables": {
        "makerDvTime": [
          {
            "tier": "Cheap/Everyday",
            "dv": 9,
            "time": "1 hora"
          },
          {
            "tier": "Costly",
            "dv": 13,
            "time": "6 horas"
          },
          {
            "tier": "Premium",
            "dv": 17,
            "time": "1 día"
          },
          {
            "tier": "Expensive",
            "dv": 21,
            "time": "1 semana"
          },
          {
            "tier": "Very Expensive",
            "dv": 24,
            "time": "2 semanas"
          },
          {
            "tier": "Luxury",
            "dv": 29,
            "time": "1 mes"
          },
          {
            "tier": "Super Luxury",
            "dv": 29,
            "time": "1 mes por cada 10.000eb de costo"
          }
        ],
        "specialtyRanksByMakerRank": "Rango de Maker N = 2N Rangos de especialidad; máx. N por especialidad (cada subida da 1 Rango a dos especialidades distintas)",
        "fieldExpertiseSkills": [
          "Basic Tech",
          "Cybertech",
          "Electronics/Security Tech",
          "Weaponstech",
          "Land Vehicle Tech",
          "Sea Vehicle Tech",
          "Air Vehicle Tech"
        ]
      },
      "tweak2077": [],
      "cemk": null,
      "folio": {
        "pregen": "Maven",
        "folioTextEs": "Si es tecnología, puedes construirla, romperla o arreglarla. Ganas +4 a los Checks de Cybertech y Electronics/Security Tech (ya incluido en la ficha: Cybertech 8+5+4 = 17; Electronics/Security Tech 8+6+4 = 18).",
        "source": {
          "book": "CEMK Folios",
          "page": 25
        },
        "convertsToEs": "Maker Rango 4 = 8 Rangos de especialidad. Field Expertise 4 reproduce el +4 de Cybertech y Electronics/Security Tech del Folio (Field suma su Rango a Basic Tech, Cybertech, Electronics/Security Tech, Weaponstech y Vehicle Tech, así que cubre y excede al Folio). Los otros 4 Rangos quedan libres para el jugador; no pueden ir a Field Expertise (ya está en 4, el máximo a Rango 4) y ninguna otra especialidad puede llevar más de 4.",
        "startingAllocation": {
          "field": 4,
          "free": 4,
          "maxPerSpecialty": 4
        }
      }
    },
    "Medtech": {
      "ability": "Medicine",
      "source": {
        "book": "Core RED",
        "page": 149
      },
      "rulesEs": "Cada vez que el Medtech sube su Rango de Medicine, elige una de tres Especialidades (Surgery, Medical Tech [Pharmaceuticals] o Medical Tech [Cryosystem Operation]) y le asigna 1 punto. Surgery: 1 punto = +2 niveles de la Skill Surgery (máx. 10). Pharmaceuticals y Cryosystem: 1 punto = +1 nivel de Medical Tech (máx. 10 de Skill y máx. 5 puntos por especialidad); el nivel de Medical Tech es la suma de puntos en Pharmaceuticals y en Cryosystem. Los usos adicionales de Surgery y Medical Tech del Core p.226 (instalar y extraer ciberware, Bodysculpting, Therapy) solo los tienen los Medtechs vía Medicine.",
      "ranks": [
        {
          "rank": 1,
          "unlocksEs": [
            "Al subir a Rango 1 asignas 1 punto de especialidad a Surgery, Medical Tech (Pharmaceuticals) o Medical Tech (Cryosystem Operation); en total 1 punto.",
            "Surgery: cada punto = +2 en la Skill Surgery (máx. 10, o sea 5 puntos). Pharmaceuticals: cada punto = +1 en Medical Tech y 1 farmacéutico a elegir (máx. 5 puntos). Cryosystem Operation: cada punto = +1 en Medical Tech y un beneficio de criogenia (máx. 5 puntos). Medical Tech = puntos en Pharmaceuticals + puntos en Cryosystem (tope 10)."
          ]
        },
        {
          "rank": 2,
          "unlocksEs": [
            "Al subir a Rango 2 asignas 1 punto de especialidad a Surgery, Medical Tech (Pharmaceuticals) o Medical Tech (Cryosystem Operation); en total 2 puntos.",
            "Surgery: cada punto = +2 en la Skill Surgery (máx. 10, o sea 5 puntos). Pharmaceuticals: cada punto = +1 en Medical Tech y 1 farmacéutico a elegir (máx. 5 puntos). Cryosystem Operation: cada punto = +1 en Medical Tech y un beneficio de criogenia (máx. 5 puntos). Medical Tech = puntos en Pharmaceuticals + puntos en Cryosystem (tope 10)."
          ]
        },
        {
          "rank": 3,
          "unlocksEs": [
            "Al subir a Rango 3 asignas 1 punto de especialidad a Surgery, Medical Tech (Pharmaceuticals) o Medical Tech (Cryosystem Operation); en total 3 puntos.",
            "Surgery: cada punto = +2 en la Skill Surgery (máx. 10, o sea 5 puntos). Pharmaceuticals: cada punto = +1 en Medical Tech y 1 farmacéutico a elegir (máx. 5 puntos). Cryosystem Operation: cada punto = +1 en Medical Tech y un beneficio de criogenia (máx. 5 puntos). Medical Tech = puntos en Pharmaceuticals + puntos en Cryosystem (tope 10)."
          ]
        },
        {
          "rank": 4,
          "unlocksEs": [
            "Al subir a Rango 4 asignas 1 punto de especialidad a Surgery, Medical Tech (Pharmaceuticals) o Medical Tech (Cryosystem Operation); en total 4 puntos.",
            "Surgery: cada punto = +2 en la Skill Surgery (máx. 10, o sea 5 puntos). Pharmaceuticals: cada punto = +1 en Medical Tech y 1 farmacéutico a elegir (máx. 5 puntos). Cryosystem Operation: cada punto = +1 en Medical Tech y un beneficio de criogenia (máx. 5 puntos). Medical Tech = puntos en Pharmaceuticals + puntos en Cryosystem (tope 10)."
          ]
        },
        {
          "rank": 5,
          "unlocksEs": [
            "Al subir a Rango 5 asignas 1 punto de especialidad a Surgery, Medical Tech (Pharmaceuticals) o Medical Tech (Cryosystem Operation); en total 5 puntos.",
            "Surgery: cada punto = +2 en la Skill Surgery (máx. 10, o sea 5 puntos). Pharmaceuticals: cada punto = +1 en Medical Tech y 1 farmacéutico a elegir (máx. 5 puntos). Cryosystem Operation: cada punto = +1 en Medical Tech y un beneficio de criogenia (máx. 5 puntos). Medical Tech = puntos en Pharmaceuticals + puntos en Cryosystem (tope 10)."
          ]
        },
        {
          "rank": 6,
          "unlocksEs": [
            "Al subir a Rango 6 asignas 1 punto de especialidad a Surgery, Medical Tech (Pharmaceuticals) o Medical Tech (Cryosystem Operation); en total 6 puntos.",
            "Surgery: cada punto = +2 en la Skill Surgery (máx. 10, o sea 5 puntos). Pharmaceuticals: cada punto = +1 en Medical Tech y 1 farmacéutico a elegir (máx. 5 puntos). Cryosystem Operation: cada punto = +1 en Medical Tech y un beneficio de criogenia (máx. 5 puntos). Medical Tech = puntos en Pharmaceuticals + puntos en Cryosystem (tope 10)."
          ]
        },
        {
          "rank": 7,
          "unlocksEs": [
            "Al subir a Rango 7 asignas 1 punto de especialidad a Surgery, Medical Tech (Pharmaceuticals) o Medical Tech (Cryosystem Operation); en total 7 puntos.",
            "Surgery: cada punto = +2 en la Skill Surgery (máx. 10, o sea 5 puntos). Pharmaceuticals: cada punto = +1 en Medical Tech y 1 farmacéutico a elegir (máx. 5 puntos). Cryosystem Operation: cada punto = +1 en Medical Tech y un beneficio de criogenia (máx. 5 puntos). Medical Tech = puntos en Pharmaceuticals + puntos en Cryosystem (tope 10)."
          ]
        },
        {
          "rank": 8,
          "unlocksEs": [
            "Al subir a Rango 8 asignas 1 punto de especialidad a Surgery, Medical Tech (Pharmaceuticals) o Medical Tech (Cryosystem Operation); en total 8 puntos.",
            "Surgery: cada punto = +2 en la Skill Surgery (máx. 10, o sea 5 puntos). Pharmaceuticals: cada punto = +1 en Medical Tech y 1 farmacéutico a elegir (máx. 5 puntos). Cryosystem Operation: cada punto = +1 en Medical Tech y un beneficio de criogenia (máx. 5 puntos). Medical Tech = puntos en Pharmaceuticals + puntos en Cryosystem (tope 10)."
          ]
        },
        {
          "rank": 9,
          "unlocksEs": [
            "Al subir a Rango 9 asignas 1 punto de especialidad a Surgery, Medical Tech (Pharmaceuticals) o Medical Tech (Cryosystem Operation); en total 9 puntos.",
            "Surgery: cada punto = +2 en la Skill Surgery (máx. 10, o sea 5 puntos). Pharmaceuticals: cada punto = +1 en Medical Tech y 1 farmacéutico a elegir (máx. 5 puntos). Cryosystem Operation: cada punto = +1 en Medical Tech y un beneficio de criogenia (máx. 5 puntos). Medical Tech = puntos en Pharmaceuticals + puntos en Cryosystem (tope 10)."
          ]
        },
        {
          "rank": 10,
          "unlocksEs": [
            "Al subir a Rango 10 asignas 1 punto de especialidad a Surgery, Medical Tech (Pharmaceuticals) o Medical Tech (Cryosystem Operation); en total 10 puntos.",
            "Surgery: cada punto = +2 en la Skill Surgery (máx. 10, o sea 5 puntos). Pharmaceuticals: cada punto = +1 en Medical Tech y 1 farmacéutico a elegir (máx. 5 puntos). Cryosystem Operation: cada punto = +1 en Medical Tech y un beneficio de criogenia (máx. 5 puntos). Medical Tech = puntos en Pharmaceuticals + puntos en Cryosystem (tope 10)."
          ]
        }
      ],
      "options": [
        {
          "id": "surgery",
          "name": "Surgery",
          "costs": [
            {
              "points": 1,
              "effectEs": "+2 niveles en la Skill Surgery (máx. 10 de Skill, es decir 5 puntos)."
            }
          ],
          "effectEs": "La Skill Surgery (TECH) sirve para tratar las Heridas Críticas más graves e implantar ciberware; solo existe para Medtechs mediante esta Especialidad. Los usos extra de Surgery y Medical Tech del Core p.226 (instalar y extraer ciberware, Bodysculpting, Therapy) solo están disponibles para Medtechs vía este Rol."
        },
        {
          "id": "pharmaceuticals",
          "name": "Medical Tech (Pharmaceuticals)",
          "costs": [
            {
              "points": 1,
              "effectEs": "+1 nivel en la Skill Medical Tech y acceso a 1 farmacéutico (máx. 5 puntos en esta especialidad, 10 de Skill)."
            }
          ],
          "effectEs": "Medical Tech es la Skill TECH para operar, entender y reparar maquinaria médica; solo para Medtechs y solo vía esta Especialidad o Cryosystem Operation. Cada punto da acceso a uno de los 5 farmacéuticos, que se sintetizan con un Check de Medical Tech DV13 (si fallas se pierden los materiales); con 200eb de materiales se hacen en 1 hora tantas dosis como tu nivel de Medical Tech. No se sintetizan Drogas Callejeras. Aplicar una dosis lleva una Acción; a un blanco no dispuesto se le hace un Ataque Melee con el Airhypo que en vez de daño aplica una dosis. Los no-Medtech no pueden administrarlos correctamente."
        },
        {
          "id": "cryosystem",
          "name": "Medical Tech (Cryosystem Operation)",
          "costs": [
            {
              "points": 1,
              "effectEs": "+1 nivel en la Skill Medical Tech y el siguiente beneficio de criogenia (máx. 5 puntos en esta especialidad, 10 de Skill)."
            }
          ],
          "effectEs": "Cada punto da +1 en Medical Tech y un beneficio de criogenia según el nivel (ver tabla cryosystemByRank). Más información sobre Cryopumps y Cryotanks en Core p.353."
        }
      ],
      "tables": {
        "pharmaceuticals": [
          {
            "name": "Antibiotic",
            "effectEs": "Un blanco que ya inició la curación natural cura 2 HP extra por día durante una semana. Solo se beneficia de una dosis a la vez."
          },
          {
            "name": "Rapidetox",
            "effectEs": "Un blanco afectado por una droga, veneno o intoxicante queda purgado de inmediato de sus efectos."
          },
          {
            "name": "Speedheal",
            "effectEs": "Un blanco que no esté en Mortally Wounded recupera de inmediato HP igual a su BODY + WILL. Solo se beneficia de una dosis por día."
          },
          {
            "name": "Stim",
            "effectEs": "El blanco ignora todas las penalizaciones del estado Seriously Wounded durante una hora. Solo una dosis por día."
          },
          {
            "name": "Surge",
            "effectEs": "El blanco funciona sin deterioro y sin dormir durante 24 horas completas. Solo una dosis por semana."
          }
        ],
        "pharmaceuticalSynthesis": {
          "check": "Medical Tech DV13",
          "failure": "se pierden los materiales",
          "dosesPerHour": "tantas dosis como el nivel de Medical Tech, con 200eb de materiales",
          "streetDrugs": false,
          "applyDose": "1 Acción"
        },
        "cryosystemByRank": [
          {
            "level": 1,
            "benefitEs": "Obtienes 1 Cryopump."
          },
          {
            "level": 2,
            "benefitEs": "Eres Registered Cryotank Technician: acceso ilimitado 24/7 a 1 Cryotank a la vez en cualquier instalación de criogenia operada por corporaciones médicas o agencias del gobierno."
          },
          {
            "level": 3,
            "benefitEs": "Obtienes 1 Cryotank instalado en una sala de tu elección."
          },
          {
            "level": 4,
            "benefitEs": "Obtienes 2 Cryotanks más en la misma sala que el primero; tu Cryopump tiene 2 cargas y su capacidad máxima sube a 2 personas en estasis."
          },
          {
            "level": 5,
            "benefitEs": "Obtienes 3 Cryotanks más en la misma sala (los primeros tres); tu Cryopump tiene 3 cargas y su capacidad máxima sube a 3 personas en estasis."
          }
        ],
        "limits": {
          "surgerySkillPerPoint": 2,
          "surgeryMaxSkill": 10,
          "medicalTechPerPoint": 1,
          "medicalTechMaxSkill": 10,
          "maxPointsPharmaceuticals": 5,
          "maxPointsCryosystem": 5
        }
      },
      "tweak2077": [],
      "cemk": null,
      "folio": {
        "pregen": "Insurance",
        "folioTextEs": "Incluso en el Futuro Oscuro alguien tiene que curar a la gente; esa eres tú. Puedes usar la Skill Surgery con Base 12. Una vez por Beat puedes usar un Speedheal para restaurar HP a un paciente (cantidad igual a su BODY + WILL).",
        "source": {
          "book": "CEMK Folios",
          "page": 17
        },
        "convertsToEs": "Medicine Rango 4 = 4 puntos: Surgery 2 puntos (= Surgery +4; TECH 8 + 4 = Base 12 del Folio), Pharmaceuticals 1 punto eligiendo Speedheal, y 1 punto libre para el jugador. Nota: en el Core, Speedheal se sintetiza con DV13 y se puede usar una dosis por día por persona; el Folio lo simplifica a 'una vez por Beat'.",
        "startingAllocation": {
          "surgery": 2,
          "pharmaceuticals": [
            "speedheal"
          ],
          "free": 1
        }
      }
    },
    "Nomad": {
      "ability": "Moto",
      "source": {
        "book": "Core RED",
        "page": 161
      },
      "rulesEs": "Vehicle Familiarity: suma su Rango de Moto a cualquier Check de Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech o Sea Vehicle Tech. Family Motorpool: cada vez que sube su Rango de Rol, puede (a) añadir al pool de vehículos que tiene permiso de usar un vehículo de serie (especificaciones mínimas) de su Rango de Moto o inferior, o (b) mejorar uno de sus Vehículos Familiares ya permitidos con una única mejora de su Rango de Moto o inferior. Solo puede tener un Vehículo Familiar fuera a la vez; puede llamar a su Familia para cambiarlo por otro y, si la Familia está cerca, el cambio es a la mañana siguiente. Si se destruye, la Familia lo repara por completo en una semana y el Nomad paga 500eb (se puede eximir si está pelado, a costa de reputación; hasta los Jefes de Familia pagan). Las reparaciones diarias, como sacar balas, corren por cuenta del Nomad. En Rango 10 es ascendido a líder de la Familia: puede tener todos sus Vehículos Familiares fuera a la vez, los nuevos Vehículos Familiares se compran a precio de mercado y las mejoras futuras cuestan 1.000eb cada una. Las mejoras de vehículo rara vez se venden en el mercado abierto: Very Expensive las de Rango 1 y Luxury las que no son de Rango 1.",
      "ranks": [
        {
          "rank": 1,
          "unlocksEs": [
            "+1 a Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech y Sea Vehicle Tech (Vehicle Familiarity).",
            "Al subir a Rango 1: añades al Family Motorpool un vehículo de serie (especificaciones mínimas) de Rango 1 o inferior, O mejoras un Vehículo Familiar ya permitido con una mejora única de Rango 1 o inferior.",
            "Vehículos del Family Motorpool disponibles: Compact Groundcar, Gyrocopter, Jetski, Roadbike."
          ]
        },
        {
          "rank": 2,
          "unlocksEs": [
            "+2 a Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech y Sea Vehicle Tech (Vehicle Familiarity).",
            "Al subir a Rango 2: añades al Family Motorpool un vehículo de serie (especificaciones mínimas) de Rango 2 o inferior, O mejoras un Vehículo Familiar ya permitido con una mejora única de Rango 2 o inferior.",
            "Vehículos del Family Motorpool disponibles: Compact Groundcar, Gyrocopter, Jetski, Roadbike."
          ]
        },
        {
          "rank": 3,
          "unlocksEs": [
            "+3 a Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech y Sea Vehicle Tech (Vehicle Familiarity).",
            "Al subir a Rango 3: añades al Family Motorpool un vehículo de serie (especificaciones mínimas) de Rango 3 o inferior, O mejoras un Vehículo Familiar ya permitido con una mejora única de Rango 3 o inferior.",
            "Vehículos del Family Motorpool disponibles: Compact Groundcar, Gyrocopter, Jetski, Roadbike."
          ]
        },
        {
          "rank": 4,
          "unlocksEs": [
            "+4 a Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech y Sea Vehicle Tech (Vehicle Familiarity).",
            "Al subir a Rango 4: añades al Family Motorpool un vehículo de serie (especificaciones mínimas) de Rango 4 o inferior, O mejoras un Vehículo Familiar ya permitido con una mejora única de Rango 4 o inferior.",
            "Vehículos del Family Motorpool disponibles: Compact Groundcar, Gyrocopter, Jetski, Roadbike."
          ]
        },
        {
          "rank": 5,
          "unlocksEs": [
            "+5 a Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech y Sea Vehicle Tech (Vehicle Familiarity).",
            "Al subir a Rango 5: añades al Family Motorpool un vehículo de serie (especificaciones mínimas) de Rango 5 o inferior, O mejoras un Vehículo Familiar ya permitido con una mejora única de Rango 5 o inferior.",
            "Se suman al pool disponible: Helicopter, High Performance Groundcar, Speedboat (desde Rango 5)."
          ]
        },
        {
          "rank": 6,
          "unlocksEs": [
            "+6 a Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech y Sea Vehicle Tech (Vehicle Familiarity).",
            "Al subir a Rango 6: añades al Family Motorpool un vehículo de serie (especificaciones mínimas) de Rango 6 o inferior, O mejoras un Vehículo Familiar ya permitido con una mejora única de Rango 6 o inferior.",
            "Se suman al pool disponible: Helicopter, High Performance Groundcar, Speedboat (ya disponibles)."
          ]
        },
        {
          "rank": 7,
          "unlocksEs": [
            "+7 a Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech y Sea Vehicle Tech (Vehicle Familiarity).",
            "Al subir a Rango 7: añades al Family Motorpool un vehículo de serie (especificaciones mínimas) de Rango 7 o inferior, O mejoras un Vehículo Familiar ya permitido con una mejora única de Rango 7 o inferior.",
            "Se suman al pool disponible: AV-4, Cabin Cruiser, Superbike (desde Rango 7)."
          ]
        },
        {
          "rank": 8,
          "unlocksEs": [
            "+8 a Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech y Sea Vehicle Tech (Vehicle Familiarity).",
            "Al subir a Rango 8: añades al Family Motorpool un vehículo de serie (especificaciones mínimas) de Rango 8 o inferior, O mejoras un Vehículo Familiar ya permitido con una mejora única de Rango 8 o inferior.",
            "Se suman al pool disponible: AV-4, Cabin Cruiser, Superbike (ya disponibles)."
          ]
        },
        {
          "rank": 9,
          "unlocksEs": [
            "+9 a Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech y Sea Vehicle Tech (Vehicle Familiarity).",
            "Al subir a Rango 9: añades al Family Motorpool un vehículo de serie (especificaciones mínimas) de Rango 9 o inferior, O mejoras un Vehículo Familiar ya permitido con una mejora única de Rango 9 o inferior.",
            "Se suman al pool disponible: Aerozep, AV-9, Super Groundcar, Yacht (desde Rango 9)."
          ]
        },
        {
          "rank": 10,
          "unlocksEs": [
            "+10 a Drive Land Vehicle, Pilot Air Vehicle, Pilot Sea Vehicle, Air Vehicle Tech, Land Vehicle Tech y Sea Vehicle Tech (Vehicle Familiarity).",
            "Al subir a Rango 10: añades al Family Motorpool un vehículo de serie (especificaciones mínimas) de Rango 10 o inferior, O mejoras un Vehículo Familiar ya permitido con una mejora única de Rango 10 o inferior.",
            "Se suman al pool disponible: Aerozep, AV-9, Super Groundcar, Yacht (ya disponibles).",
            "Promoción a líder de la Familia: puede tener todos sus Vehículos Familiares fuera a la vez; los futuros Vehículos Familiares se compran a precio de mercado y las mejoras futuras cuestan 1.000eb cada una."
          ]
        }
      ],
      "options": [
        {
          "id": "armored_chassis",
          "name": "Armored Chassis",
          "costs": [],
          "minMotoRank": 5,
          "appliesTo": "Todos los vehículos",
          "effectEs": "Blinda el vehículo a SP13; no afecta al cristal."
        },
        {
          "id": "bulletproof_glass",
          "name": "Bulletproof Glass",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Todos los vehículos",
          "effectEs": "Todo el cristal pasa a ser cobertura de cristal fino a prueba de balas (15 HP); con una segunda mejora pasa a cristal grueso (30 HP). Cada ventana sufre daño por separado."
        },
        {
          "id": "communications_center",
          "name": "Communications Center",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Todos los vehículos",
          "effectEs": "Consola táctil con Agent a bordo y espacio de almacenamiento con equipo extraíble: 6 Radio Communicators, 6 Scrambler/Descramblers, un Radio Scanner/Music Player, un Homing Tracer con 6 rastreadores y una grabadora de audio."
        },
        {
          "id": "nos",
          "name": "NOS",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Todos los vehículos",
          "effectEs": "Ráfaga de potencia: con tu Acción haces una Move Action adicional al conducir. Cada tanque de NOS se usa una vez al día; cada mejora adicional suma un tanque. Los tanques sintetizan óxido nitroso solos, sin recarga."
        },
        {
          "id": "onboard_flamethrower",
          "name": "Onboard Flamethrower",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Todos los vehículos",
          "effectEs": "Lanzallamas montado al frente, lado o atrás; el conductor lo dispara con su Acción. No se recarga mientras se conduce; el arma no se retira ni acepta accesorios. Se pueden instalar varias mejoras."
        },
        {
          "id": "onboard_machine_gun",
          "name": "Onboard Machine Gun",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Todos los vehículos",
          "effectEs": "Rifle de Asalto con 30 balas, solo en Autofire, montado al frente; el conductor lo dispara con su Acción. No se recarga mientras se conduce; el arma no se retira ni acepta accesorios. Se pueden instalar varias mejoras."
        },
        {
          "id": "seating_upgrade",
          "name": "Seating Upgrade",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Todos los vehículos",
          "effectEs": "Añade dos asientos (pueden ser sidecar, incluso cerrado con el mismo cristal). Cualquier asiento puede equiparse como asiento eyectable (lanza al ocupante 10 m/yd hacia arriba por una trampilla; normalmente con paracaídas). Un pasajero golpeado por una hélice de helicóptero en la eyección sufre daño como de arma Melee Muy Pesada. Se puede tomar varias veces salvo en Bikes, Jetskis y Gyrocopters."
        },
        {
          "id": "security_upgrade",
          "name": "Security Upgrade",
          "costs": [],
          "minMotoRank": 5,
          "appliesTo": "Todos los vehículos",
          "effectEs": "Cambia todas las cerraduras por cerraduras de ADN (huella, iris, sangre u otro biométrico). No se abren sin la clave o un Check de Electronics/Security Tech DV17; quien presenta un biométrico inexacto o falla el Check recibe un golpe como de Stun Baton al cuerpo si está a ≤2 m/yd. Añade camuflaje: el vehículo quieto solo se detecta con un Check de Perception DV17; tarda un minuto en activarse."
        },
        {
          "id": "smuggling_upgrade",
          "name": "Smuggling Upgrade",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Todos los vehículos",
          "effectEs": "Dos Hidden Holsters a bordo (mismas reglas que el ciberware) para conductor y un pasajero, y un gran espacio oculto para contrabando; solo se descubre con un Check de Conceal/Reveal Object DV17. Se puede tomar varias veces salvo en Bikes, Jetskis y Gyrocopters."
        },
        {
          "id": "heavy_chassis",
          "name": "Heavy Chassis",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Todos excepto Bikes, Jetskis y Gyrocopters",
          "effectEs": "Añade 20 SDP al vehículo (no al cristal) y permite remolcar hasta 10 toneladas. Es prerrequisito de mejoras más pesadas."
        },
        {
          "id": "onboard_rocket_pod",
          "name": "Onboard Rocket Pod",
          "costs": [],
          "minMotoRank": 5,
          "appliesTo": "Todos excepto Bikes, Jetskis y Gyrocopters",
          "effectEs": "Lanzacohetes con tambor de tres cohetes, montado al frente; el conductor lo dispara con su Acción. No se recarga mientras se conduce; el arma no se retira ni acepta accesorios. Varias mejoras posibles. Requiere Heavy Chassis."
        },
        {
          "id": "vehicle_heavy_weapon_mount",
          "name": "Vehicle Heavy Weapon Mount",
          "costs": [],
          "minMotoRank": 5,
          "appliesTo": "Todos excepto Bikes, Jetskis y Gyrocopters",
          "effectEs": "Convierte un asiento en montura giratoria para cualquier arma a distancia de dos manos, disparada y recargada por un pasajero con su Acción (con vehículo en marcha); se retira o reinstala con una Acción. La primera vez, la Familia regala una Tsunami Arms Helix, una Rhinemetall EMG-86 Railgun o un Militech 'Cowboy' U-56 Grenade Launcher; las demás las consigue el Nomad. Con Bulletproof Glass, una burbuja del mismo cristal protege al artillero. Varias mejoras solo en Cabin Cruisers, Yachts, Aerozeps y Groundcars que ya tengan Housing Capacity. Requiere Heavy Chassis."
        },
        {
          "id": "onboard_melee_weapon",
          "name": "Onboard Melee Weapon",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Vehículos terrestres y marítimos",
          "effectEs": "Arma Melee Muy Pesada montada al frente, lado o atrás; el conductor ataca con ella usando su Acción. No se retira. Varias mejoras posibles."
        },
        {
          "id": "hover_upgrade",
          "name": "Hover Upgrade",
          "costs": [],
          "minMotoRank": 5,
          "appliesTo": "Vehículos terrestres",
          "effectEs": "Instala ventiladores potentes en la base: el vehículo viaja sobre el agua a la velocidad de un Cabin Cruiser."
        },
        {
          "id": "av4_engine_upgrade",
          "name": "AV-4 Engine Upgrade",
          "costs": [],
          "minMotoRank": 7,
          "appliesTo": "Vehículos terrestres",
          "effectEs": "Añade un turbofán de empuje vectorial: puede volar y se trata como un AV-4 en el aire; en el aire se pilota con Pilot Air Vehicle en lugar de Drive Land Vehicle."
        },
        {
          "id": "combat_plow",
          "name": "Combat Plow",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Vehículos terrestres y marítimos excepto Bikes y Jetskis",
          "effectEs": "Al embestir cobertura, otro vehículo o un peatón con el frente, tu vehículo no sufre daño y nadie dentro sufre la Lesión Crítica Whiplash. Si usaste NOS en ese Turno, el daño por embestida sube 2d6."
        },
        {
          "id": "enhanced_interface_plug",
          "name": "Enhanced Interface Plug Integration",
          "costs": [],
          "minMotoRank": 5,
          "appliesTo": "Todas las bikes",
          "effectEs": "Al conducir tu bike con Interface Plugs, si puedes esquivar balas (REF 8 o más) y tú, un pasajero o la bike son blanco de un ataque que podrías esquivar a pie, puedes esquivarlo con tu Evasion; tu elección se vuelve la defensa de tu pasajero. En ataques de área, la bike se aparta si esquivas."
        },
        {
          "id": "deployable_spike_strip",
          "name": "Deployable Spike Strip",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Groundcars",
          "effectEs": "El conductor la despliega como Acción; los vehículos con llantas que lo sigan de cerca hacen un Check de Drive Land Vehicle DV17 o su vehículo sufre 4d6 en su punto débil (el daño que pasa el SP se multiplica ×2). Repuestos 10eb (Cheap). Más mejoras = más tiras antes de recargar (no se recarga en marcha)."
        },
        {
          "id": "housing_capacity",
          "name": "Housing Capacity",
          "costs": [],
          "minMotoRank": 1,
          "appliesTo": "Aerozep, AV-4, Cabin Cruiser, Groundcars, Yacht",
          "effectEs": "En Groundcar o AV-4 añade zona de dormir con 1 cama, baño, ducha y cocina pequeña (lo convierte en Kombi); en Cabin Cruiser, Yacht o Aerozep añade una habitación. Requiere Heavy Chassis en Compact Groundcar y High Performance Groundcar."
        }
      ],
      "tables": {
        "motorpoolByRank": [
          {
            "fromRank": 1,
            "toRank": 4,
            "vehicles": [
              "Compact Groundcar",
              "Gyrocopter",
              "Jetski",
              "Roadbike"
            ]
          },
          {
            "fromRank": 5,
            "toRank": 6,
            "vehicles": [
              "Helicopter",
              "High Performance Groundcar",
              "Speedboat"
            ]
          },
          {
            "fromRank": 7,
            "toRank": 8,
            "vehicles": [
              "AV-4",
              "Cabin Cruiser",
              "Superbike"
            ]
          },
          {
            "fromRank": 9,
            "toRank": 10,
            "vehicles": [
              "Aerozep",
              "AV-9",
              "Super Groundcar",
              "Yacht"
            ]
          }
        ],
        "familyVehicleRepair": {
          "timeEs": "1 semana (reparación completa por la Familia si el vehículo fue destruido)",
          "costEb": 500,
          "waivedIfBroke": true,
          "dailyRepairsEs": "Reparaciones diarias, como sacar balas, son responsabilidad del Nomad."
        },
        "rank10": {
          "allVehiclesOutAtOnce": true,
          "newVehiclesCost": "precio de mercado",
          "upgradeCostEb": 1000
        },
        "vehicleUpgradeAvailability": {
          "rank1UpgradesPrice": "Very Expensive",
          "otherUpgradesPrice": "Luxury"
        },
        "vehicleSkillsGetMotoRank": [
          "Drive Land Vehicle",
          "Pilot Air Vehicle",
          "Pilot Sea Vehicle",
          "Air Vehicle Tech",
          "Land Vehicle Tech",
          "Sea Vehicle Tech"
        ]
      },
      "tweak2077": [
        {
          "fromRank": 1,
          "textEs": "Desde Moto Rank 1 el Nomad puede conseguir todos los Vehículos y Mejoras de Vehículo pieza a pieza aunque no estén disponibles.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        }
      ],
      "cemk": null,
      "folio": {
        "pregen": "Wrench",
        "folioTextEs": "Para un Nomad la movilidad es vida: pasas tanto tiempo al volante de tu vehículo como fuera de él. +4 a los Skill Checks de Drive Land Vehicle (ya incluido en la ficha: Drive Land Vehicle 6 + 6 + 4 = 16).",
        "source": {
          "book": "CEMK Folios",
          "page": 5
        },
        "convertsToEs": "Moto Rango 4: +4 a Drive Land Vehicle (ya incluido en la base del Folio, no se suma de nuevo) y, con las otras Skills de vehículo, +4 también. Además 4 elecciones de Family Motorpool/mejora de Rango 1 a 4 (Compact Groundcar, Gyrocopter, Jetski, Roadbike y mejoras de Rango ≤4), que el Folio no especifica y quedan libres para el jugador.",
        "startingAllocation": {
          "moto": 4
        }
      }
    },
    "Rockerboy": {
      "ability": "Charismatic Impact",
      "source": {
        "book": "Core RED",
        "page": 144
      },
      "rulesEs": "Rol Ability del Rockerboy: influir en otros por pura presencia (música, poesía, arte, baile o simple presencia física; podría ser un líder de culto). Solo se puede usar sobre Fans. Fuera de combate se puede convertir en fan a quien aún no lo es (salvo que te deteste activamente) tirando Charismatic Impact + 1d10 contra DV8 (una persona), DV10 (grupo pequeño de hasta 6) o DV12 (grupo enorme). El GM decide quién ya es fan. Para pedir un favor a un fan o grupo de fans, el GM usa la tabla de Rangos: si el favor está fuera de lo que permite tu Rango, fallás automáticamente; si está dentro, tirás Charismatic Impact + 1d10 contra el DV del tamaño del grupo. Éxito: los fans ponen su mejor esfuerzo en el favor. Falla: no podés pedir el mismo favor a esos fans durante una semana. En el ejemplo del libro (Rico, Rango 4) se gasta LUCK en la tirada.",
      "ranks": [
        {
          "rank": 1,
          "tierFromRank": 1,
          "tierToRank": 2,
          "unlocksEs": [
            "Venues: Clubes locales pequeños",
            "Un fan (DV8): Convencer a un fan de hacerte un favor pequeño: invitarte un trago o una comida, llevarte a algún lado.",
            "Grupo pequeño de hasta 6 (DV10): Un grupo de hasta 6 fans te pide autógrafos y otros tótems personales; los fans te frenan en la calle para hacerse amigos tuyos.",
            "Grupo enorme (DV12): Todavía no tenés grupos enormes de fans (el libro lo dice en tono de burla: no aplica)."
          ]
        },
        {
          "rank": 2,
          "tierFromRank": 1,
          "tierToRank": 2,
          "unlocksEs": [
            "Venues: Clubes locales pequeños",
            "Un fan (DV8): Convencer a un fan de hacerte un favor pequeño: invitarte un trago o una comida, llevarte a algún lado.",
            "Grupo pequeño de hasta 6 (DV10): Un grupo de hasta 6 fans te pide autógrafos y otros tótems personales; los fans te frenan en la calle para hacerse amigos tuyos.",
            "Grupo enorme (DV12): Todavía no tenés grupos enormes de fans (el libro lo dice en tono de burla: no aplica)."
          ]
        },
        {
          "rank": 3,
          "tierFromRank": 3,
          "tierToRank": 4,
          "unlocksEs": [
            "Venues: Clubes conocidos",
            "Un fan (DV8): Convencer a un fan de hacerte un favor grande: acostarse con vos, hablar bien de vos, etc.",
            "Grupo pequeño de hasta 6 (DV10): Convencer a un grupo de hasta 6 fans de juntarse regularmente con vos y de proveerte alcohol, drogas u otros extras de fiesta.",
            "Grupo enorme (DV12): Tenés un seguimiento local fuerte: los fans compran tus grabaciones y merchandising."
          ]
        },
        {
          "rank": 4,
          "tierFromRank": 3,
          "tierToRank": 4,
          "unlocksEs": [
            "Venues: Clubes conocidos",
            "Un fan (DV8): Convencer a un fan de hacerte un favor grande: acostarse con vos, hablar bien de vos, etc.",
            "Grupo pequeño de hasta 6 (DV10): Convencer a un grupo de hasta 6 fans de juntarse regularmente con vos y de proveerte alcohol, drogas u otros extras de fiesta.",
            "Grupo enorme (DV12): Tenés un seguimiento local fuerte: los fans compran tus grabaciones y merchandising."
          ]
        },
        {
          "rank": 5,
          "tierFromRank": 5,
          "tierToRank": 6,
          "unlocksEs": [
            "Venues: Clubes grandes e importantes",
            "Un fan (DV8): Convencer a un fan de cometer un delito menor por vos: robar en una tienda, ayudar en una pelea.",
            "Grupo pequeño de hasta 6 (DV10): Convencer a un grupo de hasta 6 fans de actuar como tu 'posse' personal: andan siempre con vos, te hacen favores y te proveen lo que necesitás.",
            "Grupo enorme (DV12): Tus fans están por toda la ciudad y a menudo en ciudades cercanas; son muy leales y suelen hacerte favores mayores a cambio de atención."
          ]
        },
        {
          "rank": 6,
          "tierFromRank": 5,
          "tierToRank": 6,
          "unlocksEs": [
            "Venues: Clubes grandes e importantes",
            "Un fan (DV8): Convencer a un fan de cometer un delito menor por vos: robar en una tienda, ayudar en una pelea.",
            "Grupo pequeño de hasta 6 (DV10): Convencer a un grupo de hasta 6 fans de actuar como tu 'posse' personal: andan siempre con vos, te hacen favores y te proveen lo que necesitás.",
            "Grupo enorme (DV12): Tus fans están por toda la ciudad y a menudo en ciudades cercanas; son muy leales y suelen hacerte favores mayores a cambio de atención."
          ]
        },
        {
          "rank": 7,
          "tierFromRank": 7,
          "tierToRank": 8,
          "unlocksEs": [
            "Venues: Salas de conciertos pequeñas; transmisión de video local",
            "Un fan (DV8): El fan está dispuesto a arriesgar su vida por vos sin cuestionarlo.",
            "Grupo pequeño de hasta 6 (DV10): Convencer a un grupo de hasta 6 fans de cometer un delito menor por vos: robar en una tienda, ayudar en una pelea.",
            "Grupo enorme (DV12): Tus fans son rabiosamente leales: pelean con grupos de fans rivales, sostienen redes fuertes de información de fans y se unen para ayudarte."
          ]
        },
        {
          "rank": 8,
          "tierFromRank": 7,
          "tierToRank": 8,
          "unlocksEs": [
            "Venues: Salas de conciertos pequeñas; transmisión de video local",
            "Un fan (DV8): El fan está dispuesto a arriesgar su vida por vos sin cuestionarlo.",
            "Grupo pequeño de hasta 6 (DV10): Convencer a un grupo de hasta 6 fans de cometer un delito menor por vos: robar en una tienda, ayudar en una pelea.",
            "Grupo enorme (DV12): Tus fans son rabiosamente leales: pelean con grupos de fans rivales, sostienen redes fuertes de información de fans y se unen para ayudarte."
          ]
        },
        {
          "rank": 9,
          "tierFromRank": 9,
          "tierToRank": 9,
          "unlocksEs": [
            "Venues: Salas de conciertos grandes; transmisión de video nacional",
            "Un fan (DV8): Convencer a un fan de cometer un delito mayor por vos: robar un objeto caro, golpear a alguien.",
            "Grupo pequeño de hasta 6 (DV10): Convencer a un grupo de hasta 6 fans de cometer un delito mayor por vos: robar un objeto caro, golpear a alguien.",
            "Grupo enorme (DV12): Tus fans son básicamente un culto con el cerebro lavado: harán disturbios, destruirán propiedad e incluso matarán por vos."
          ]
        },
        {
          "rank": 10,
          "tierFromRank": 10,
          "tierToRank": 10,
          "unlocksEs": [
            "Venues: Estadios enormes o video internacional",
            "Un fan (DV8): El fan está dispuesto a sacrificarse por vos sin cuestionarlo.",
            "Grupo pequeño de hasta 6 (DV10): Convencer a un grupo de hasta 6 fans de arriesgar sus vidas por vos, p. ej. como protección personal.",
            "Grupo enorme (DV12): Tus fans son un seguimiento mundial con fuertes rasgos de culto: harán casi cualquier cosa que les pidas; son un ejército privado basado en tu carisma."
          ]
        }
      ],
      "options": [],
      "tables": {
        "fanDv": [
          {
            "target": "una persona (Single Fan / Single Person)",
            "dv": 8
          },
          {
            "target": "grupo pequeño de hasta 6",
            "dv": 10
          },
          {
            "target": "grupo enorme (Huge Group)",
            "dv": 12
          }
        ],
        "rollEs": "Charismatic Impact (Rango) + 1d10 contra el DV según el tamaño del grupo; sirve tanto para convertir gente en fans como para pedirles favores.",
        "failureEs": [
          "Si el favor excede lo que permite tu Rango en la tabla: falla automática, sin tirada.",
          "Si tirás y fallás: no podés pedir el mismo favor a esos mismos fans durante una semana.",
          "No se puede convertir en fan en combate ni a quien te detesta activamente."
        ],
        "rankTable": [
          {
            "fromRank": 1,
            "toRank": 2,
            "venue": "Clubes locales pequeños",
            "singleFan": "Convencer a un fan de hacerte un favor pequeño: invitarte un trago o una comida, llevarte a algún lado.",
            "smallGroup": "Un grupo de hasta 6 fans te pide autógrafos y otros tótems personales; los fans te frenan en la calle para hacerse amigos tuyos.",
            "hugeGroup": "Todavía no tenés grupos enormes de fans (el libro lo dice en tono de burla: no aplica)."
          },
          {
            "fromRank": 3,
            "toRank": 4,
            "venue": "Clubes conocidos",
            "singleFan": "Convencer a un fan de hacerte un favor grande: acostarse con vos, hablar bien de vos, etc.",
            "smallGroup": "Convencer a un grupo de hasta 6 fans de juntarse regularmente con vos y de proveerte alcohol, drogas u otros extras de fiesta.",
            "hugeGroup": "Tenés un seguimiento local fuerte: los fans compran tus grabaciones y merchandising."
          },
          {
            "fromRank": 5,
            "toRank": 6,
            "venue": "Clubes grandes e importantes",
            "singleFan": "Convencer a un fan de cometer un delito menor por vos: robar en una tienda, ayudar en una pelea.",
            "smallGroup": "Convencer a un grupo de hasta 6 fans de actuar como tu 'posse' personal: andan siempre con vos, te hacen favores y te proveen lo que necesitás.",
            "hugeGroup": "Tus fans están por toda la ciudad y a menudo en ciudades cercanas; son muy leales y suelen hacerte favores mayores a cambio de atención."
          },
          {
            "fromRank": 7,
            "toRank": 8,
            "venue": "Salas de conciertos pequeñas; transmisión de video local",
            "singleFan": "El fan está dispuesto a arriesgar su vida por vos sin cuestionarlo.",
            "smallGroup": "Convencer a un grupo de hasta 6 fans de cometer un delito menor por vos: robar en una tienda, ayudar en una pelea.",
            "hugeGroup": "Tus fans son rabiosamente leales: pelean con grupos de fans rivales, sostienen redes fuertes de información de fans y se unen para ayudarte."
          },
          {
            "fromRank": 9,
            "toRank": 9,
            "venue": "Salas de conciertos grandes; transmisión de video nacional",
            "singleFan": "Convencer a un fan de cometer un delito mayor por vos: robar un objeto caro, golpear a alguien.",
            "smallGroup": "Convencer a un grupo de hasta 6 fans de cometer un delito mayor por vos: robar un objeto caro, golpear a alguien.",
            "hugeGroup": "Tus fans son básicamente un culto con el cerebro lavado: harán disturbios, destruirán propiedad e incluso matarán por vos."
          },
          {
            "fromRank": 10,
            "toRank": 10,
            "venue": "Estadios enormes o video internacional",
            "singleFan": "El fan está dispuesto a sacrificarse por vos sin cuestionarlo.",
            "smallGroup": "Convencer a un grupo de hasta 6 fans de arriesgar sus vidas por vos, p. ej. como protección personal.",
            "hugeGroup": "Tus fans son un seguimiento mundial con fuertes rasgos de culto: harán casi cualquier cosa que les pidas; son un ejército privado basado en tu carisma."
          }
        ],
        "source": {
          "book": "Core RED",
          "page": 145
        }
      },
      "tweak2077": [
        {
          "fromRank": 4,
          "textEs": "En los 2070s los Rockerboys pueden conseguir objetos Expensive pieza por pieza (piece-by-piece), aunque estén de otro modo no disponibles, a partir del Rango 4 de Charismatic Impact. En el Core RED no tienen Reach propio.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        }
      ],
      "folio": {
        "pregen": "Thorn",
        "folioTextEs": "'Todavía no sos famoso mundial, pero trabajás en ello.' Si el GM determina que un PNJ es fan tuyo, ganás +4 a todas las Skill Checks sociales (Acting, Bribery, Conversation, Interrogation y Persuasion) hechas contra él. Ese +4 NO está incluido en las bases de la ficha (Persuasion 13 = 7+6; Acting 15 = 7+6+2 de la AudioVox).",
        "source": {
          "book": "CEMK Folios",
          "page": 21,
          "pageType": "pdf",
          "pages": [
            21,
            22,
            23
          ]
        },
        "convertsToEs": "Thorn pasa a Charismatic Impact 4. Correspondencia parcial: el número coincide (+4), pero la mecánica difiere. En el Core el Rango 4 se suma SOLO a la tirada de Charismatic Impact (Rango + 1d10 vs DV8/10/12) para hacer fans y pedirles favores, y no da bono a Acting/Bribery/Conversation/Interrogation/Persuasion. El +4 del Folio es un bono plano a esas 5 skills sociales contra fans, que el Core no otorga. Con Rango 4 (escalón 3-4): clubes conocidos; un fan: favor grande; grupo pequeño: frecuentarlo y proveer extras de fiesta; grupo enorme: seguimiento local, compran grabaciones/merch.",
        "startingAllocation": {
          "stats": {
            "INT": 4,
            "REF": 6,
            "DEX": 7,
            "TECH": 5,
            "COOL": 7,
            "WILL": 8,
            "MOVE": 7,
            "BODY": 10,
            "EMP": 6
          },
          "luck": 4,
          "hp": 55,
          "seriouslyWoundedThreshold": 28,
          "deathSave": 10,
          "skills": {
            "Acting": 6,
            "Athletics": 5,
            "Brawling": 6,
            "Composition": 6,
            "Concentration": 5,
            "Conversation": 6,
            "Dance": 4,
            "Drive Land Vehicle": 4,
            "Education": 4,
            "Evasion": 6,
            "First Aid": 6,
            "Handgun": 2,
            "Human Perception": 6,
            "Library Search": 4,
            "Perception": 4,
            "Persuasion": 6,
            "Play Instrument": 6,
            "Shoulder Arms": 6,
            "Stealth": 6,
            "Streetwise": 6,
            "Wardrobe & Style": 6
          },
          "skillBonuses": {
            "Acting": 2,
            "Play Instrument": 2,
            "Wardrobe & Style": 2
          },
          "skillBases": {
            "Acting": 15,
            "Athletics": 12,
            "Autofire": 6,
            "Brawling": 13,
            "Bribery": 7,
            "Business": 4,
            "Composition": 10,
            "Conceal/Reveal Object": 4,
            "Concentration": 13,
            "Conversation": 12,
            "Cybertech": 5,
            "Dance": 11,
            "Deduction": 4,
            "Drive Land Vehicle": 10,
            "Education": 8,
            "Electronics/Security Tech": 5,
            "Evasion": 13,
            "First Aid": 11,
            "Handgun": 8,
            "Heavy Weapons": 6,
            "Human Perception": 12,
            "Interrogation": 7,
            "Library Search": 8,
            "Melee Weapon": 7,
            "Paramedic": 5,
            "Perception": 8,
            "Persuasion": 13,
            "Pick Lock": 5,
            "Pick Pocket": 5,
            "Play Instrument": 13,
            "Resist Torture/Drugs": 8,
            "Shoulder Arms": 12,
            "Stealth": 13,
            "Streetwise": 13,
            "Trading": 7,
            "Wardrobe & Style": 15
          },
          "weapons": [
            {
              "name": "Brawling Attack",
              "skill": "Brawling",
              "baseCalc": "7 + 6 = 13",
              "damage": "3d6",
              "type2077": null,
              "rof": 2,
              "mag": null,
              "notes": "Ataque desarmado."
            },
            {
              "name": "Budget Arms Carnage",
              "skill": "Shoulder Arms",
              "baseCalc": "6 + 6 = 12",
              "damage": "5d6",
              "type2077": "Power",
              "rof": 1,
              "mag": 5,
              "notes": "Shotgun, dos manos, no ocultable, empieza cargada con Basic Shotgun Slugs. Poor Quality: se encasquilla con un 1 (dispara pero hay que desencasquillar con una Acción). Power Weapon: +5 al daño adicional de Lesión Crítica; rebote a -4. Slug: Shoulder Arms, 5d6. Shell: Shoulder Arms vs DV13, 3d6 a todos en área de 6 m/yds (3 casillas) frente a ti.",
              "dvByRange_0-6_7-12_13-25_26-50_51-100_101-200_201-400_401-800": {
                "0-6": "13",
                "7-12": "15",
                "13-25": "20",
                "26-50": "25",
                "51-100": "30",
                "101-200": "35",
                "201-400": "—",
                "401-800": "—"
              }
            }
          ],
          "armor": {
            "name": "L Armorjack (abreviado en la ficha; probablemente Light Armorjack)",
            "sp": 11,
            "spHead": 11,
            "spVsMeleeChargedTech": 6,
            "spHeadVsMeleeChargedTech": 6
          },
          "cyberware": [
            "Neuroport",
            "Fashion Upgrades (+2 Wardrobe & Style)",
            "Grafted Muscle and Bone Lace (BODY subido a 10)",
            "Dynalar AudioVox (+2 Acting y Play Instrument al cantar)"
          ],
          "gear": [
            "Electric Guitar (con amplificador de bolsillo)",
            "Audio Recorder (graba a una memory shard)",
            "Memory Shards en blanco x2",
            "Shotgun Slugs extra x10"
          ],
          "eurodollars": 100
        }
      }
    },
    "Fixer": {
      "ability": "Operator",
      "source": {
        "book": "Core RED",
        "page": 159
      },
      "rulesEs": "Rol Ability del Fixer: sabe conseguir cosas en el mercado negro y moverse por las costumbres sociales de la Calle. Cuatro componentes. Contacts & Clients: a quién puede acudir para conseguir bienes, favores o información (siempre hay que pagarles). Reach: la categoría de precio más alta que siempre puede conseguir, pieza por pieza, aunque no esté disponible, y la capacidad de reunir a otros Fixers para un Night Market, que hace disponibles todas las categorías de precio por un tiempo corto. Haggle: tirada opuesta, tu COOL + Trading + tu Rango de Operator + 1d10 contra COOL + Trading + (su Rango de Operator, si el otro es Fixer) + 1d10 de la contraparte; si ganás, podés hacer 1 trato de tu Rango de Operator o inferior; solo se puede hacer 1 trato de Fixer por transacción. Grease: capacidad de mezclarse con las culturas dentro y fuera de la Calle, conociendo idioma, códigos sociales y marcas de estatus de cada grupo.",
      "ranks": [
        {
          "rank": 1,
          "tierFromRank": 1,
          "tierToRank": 2,
          "unlocksEs": [
            "Contacts & Clients: Local honcho, gang lord, liderazgo del barrio inmediato.",
            "Reach: Siempre podés encontrar dónde conseguir objetos Cheap y Everyday para tus clientes, pieza por pieza, aunque no estén disponibles.",
            "Haggle: Si ganás: conseguís 10% más o menos que el precio de mercado al comprar o vender.",
            "Grease: Conocés los entresijos culturales de tu barrio inmediato, incluidas todas las pandillas locales."
          ]
        },
        {
          "rank": 2,
          "tierFromRank": 1,
          "tierToRank": 2,
          "unlocksEs": [
            "Contacts & Clients: Local honcho, gang lord, liderazgo del barrio inmediato.",
            "Reach: Siempre podés encontrar dónde conseguir objetos Cheap y Everyday para tus clientes, pieza por pieza, aunque no estén disponibles.",
            "Haggle: Si ganás: conseguís 10% más o menos que el precio de mercado al comprar o vender.",
            "Grease: Conocés los entresijos culturales de tu barrio inmediato, incluidas todas las pandillas locales."
          ]
        },
        {
          "rank": 3,
          "tierFromRank": 3,
          "tierToRank": 4,
          "unlocksEs": [
            "Contacts & Clients: Honcho de pandilla de la ciudad, político menor, ejecutivo corporativo, persona muy conocida del barrio.",
            "Reach: Siempre podés conseguir hasta objetos Expensive para tus clientes, pieza por pieza, aunque no estén disponibles.",
            "Haggle: Si ganás: al comprar 5 o más del mismo objeto, recibís uno más de ese objeto gratis.",
            "Grease: Te llevás bien con al menos 1 otra cultura de tu zona y ganás un idioma que no conocías, asociado a esa cultura, en Skill Level 4."
          ]
        },
        {
          "rank": 4,
          "tierFromRank": 3,
          "tierToRank": 4,
          "unlocksEs": [
            "Contacts & Clients: Honcho de pandilla de la ciudad, político menor, ejecutivo corporativo, persona muy conocida del barrio.",
            "Reach: Siempre podés conseguir hasta objetos Expensive para tus clientes, pieza por pieza, aunque no estén disponibles.",
            "Haggle: Si ganás: al comprar 5 o más del mismo objeto, recibís uno más de ese objeto gratis.",
            "Grease: Te llevás bien con al menos 1 otra cultura de tu zona y ganás un idioma que no conocías, asociado a esa cultura, en Skill Level 4."
          ]
        },
        {
          "rank": 5,
          "tierFromRank": 5,
          "tierToRank": 6,
          "unlocksEs": [
            "Contacts & Clients: Pez gordo de la ciudad, político de la ciudad, celebridad del barrio.",
            "Reach: Una vez por mes, junto con otros Fixers de tu Rango, podés montar un Night Market. En un Night Market que ayudaste a organizar siempre podés conseguir hasta objetos Super Luxury (reglas de Night Market en Core pág. 338).",
            "Haggle: Si ganás: podés negociar el pago por persona de un Job un 20% más alto.",
            "Grease: Te llevás perfecto con 2 culturas adicionales (3 en total) de tu zona y ganás un idioma nuevo por cada una (asociado a cada cultura) en Skill Level 4."
          ]
        },
        {
          "rank": 6,
          "tierFromRank": 5,
          "tierToRank": 6,
          "unlocksEs": [
            "Contacts & Clients: Pez gordo de la ciudad, político de la ciudad, celebridad del barrio.",
            "Reach: Una vez por mes, junto con otros Fixers de tu Rango, podés montar un Night Market. En un Night Market que ayudaste a organizar siempre podés conseguir hasta objetos Super Luxury (reglas de Night Market en Core pág. 338).",
            "Haggle: Si ganás: podés negociar el pago por persona de un Job un 20% más alto.",
            "Grease: Te llevás perfecto con 2 culturas adicionales (3 en total) de tu zona y ganás un idioma nuevo por cada una (asociado a cada cultura) en Skill Level 4."
          ]
        },
        {
          "rank": 7,
          "tierFromRank": 7,
          "tierToRank": 8,
          "unlocksEs": [
            "Contacts & Clients: Presidente de una corporación local, alcalde o administrador de la ciudad, celebridad local.",
            "Reach: Siempre podés conseguir hasta objetos Very Expensive para tus clientes, pieza por pieza, aunque no estén disponibles.",
            "Haggle: Si ganás: al comprar un objeto Luxury o Super Luxury, podés pagar la mitad ahora y la mitad en un mes. Si no pagás la segunda mitad a tiempo, nadie volverá a hacer ese trato con vos.",
            "Grease: Te mezclás perfecto con 3 culturas adicionales (6 en total) de tu zona y ganás un idioma nuevo por cada una en Skill Level 4."
          ]
        },
        {
          "rank": 8,
          "tierFromRank": 7,
          "tierToRank": 8,
          "unlocksEs": [
            "Contacts & Clients: Presidente de una corporación local, alcalde o administrador de la ciudad, celebridad local.",
            "Reach: Siempre podés conseguir hasta objetos Very Expensive para tus clientes, pieza por pieza, aunque no estén disponibles.",
            "Haggle: Si ganás: al comprar un objeto Luxury o Super Luxury, podés pagar la mitad ahora y la mitad en un mes. Si no pagás la segunda mitad a tiempo, nadie volverá a hacer ese trato con vos.",
            "Grease: Te mezclás perfecto con 3 culturas adicionales (6 en total) de tu zona y ganás un idioma nuevo por cada una en Skill Level 4."
          ]
        },
        {
          "rank": 9,
          "tierFromRank": 9,
          "tierToRank": 9,
          "unlocksEs": [
            "Contacts & Clients: Jefe de división corporativa, político estatal o de zona de la ciudad, celebridad muy conocida.",
            "Reach: Siempre podés conseguir hasta objetos Luxury, pieza por pieza, aunque no estén disponibles. Al montar un Night Market podés además montar dentro un Midnight Market, que reúne a la cúpula del hampa.",
            "Haggle: Si ganás: conseguís 20% más o menos que el precio de mercado al comprar o vender.",
            "Grease: Te mezclás perfecto no solo con muchas culturas de tu zona, sino también con agencias corporativas y gubernamentales."
          ]
        },
        {
          "rank": 10,
          "tierFromRank": 10,
          "tierToRank": 10,
          "unlocksEs": [
            "Contacts & Clients: Líder mundial importante, jefe de una gran corporación, celebridad de fama mundial.",
            "Reach: Siempre podés conseguir hasta objetos Super Luxury para tus clientes, pieza por pieza, aunque no estén disponibles.",
            "Haggle: Si ganás: podés negociar el doble de pago por persona en un Dangerous Job.",
            "Grease: Te mezclás sin costuras con casi cualquier grupo, incluso muy especializados o cerrados: sociedades secretas, cultos o grupos de membresía exclusiva."
          ]
        }
      ],
      "options": [],
      "tables": {
        "haggle": {
          "rollEs": "Tu COOL + Trading + tu Rango de Operator + 1d10 contra COOL + Trading + Rango de Operator de la contraparte (solo si es Fixer) + 1d10.",
          "dealRuleEs": "Si ganás, podés hacer 1 trato de tu Rango de Operator o inferior (se interpreta como: elegir un beneficio de Haggle desbloqueado en tu Rango o uno menor). Solo 1 trato de Fixer por transacción.",
          "byRank": [
            {
              "fromRank": 1,
              "toRank": 2,
              "textEs": "Si ganás: conseguís 10% más o menos que el precio de mercado al comprar o vender."
            },
            {
              "fromRank": 3,
              "toRank": 4,
              "textEs": "Si ganás: al comprar 5 o más del mismo objeto, recibís uno más de ese objeto gratis."
            },
            {
              "fromRank": 5,
              "toRank": 6,
              "textEs": "Si ganás: podés negociar el pago por persona de un Job un 20% más alto."
            },
            {
              "fromRank": 7,
              "toRank": 8,
              "textEs": "Si ganás: al comprar un objeto Luxury o Super Luxury, podés pagar la mitad ahora y la mitad en un mes. Si no pagás la segunda mitad a tiempo, nadie volverá a hacer ese trato con vos."
            },
            {
              "fromRank": 9,
              "toRank": 9,
              "textEs": "Si ganás: conseguís 20% más o menos que el precio de mercado al comprar o vender."
            },
            {
              "fromRank": 10,
              "toRank": 10,
              "textEs": "Si ganás: podés negociar el doble de pago por persona en un Dangerous Job."
            }
          ]
        },
        "reach": [
          {
            "fromRank": 1,
            "toRank": 2,
            "textEs": "Siempre podés encontrar dónde conseguir objetos Cheap y Everyday para tus clientes, pieza por pieza, aunque no estén disponibles."
          },
          {
            "fromRank": 3,
            "toRank": 4,
            "textEs": "Siempre podés conseguir hasta objetos Expensive para tus clientes, pieza por pieza, aunque no estén disponibles."
          },
          {
            "fromRank": 5,
            "toRank": 6,
            "textEs": "Una vez por mes, junto con otros Fixers de tu Rango, podés montar un Night Market. En un Night Market que ayudaste a organizar siempre podés conseguir hasta objetos Super Luxury (reglas de Night Market en Core pág. 338)."
          },
          {
            "fromRank": 7,
            "toRank": 8,
            "textEs": "Siempre podés conseguir hasta objetos Very Expensive para tus clientes, pieza por pieza, aunque no estén disponibles."
          },
          {
            "fromRank": 9,
            "toRank": 9,
            "textEs": "Siempre podés conseguir hasta objetos Luxury, pieza por pieza, aunque no estén disponibles. Al montar un Night Market podés además montar dentro un Midnight Market, que reúne a la cúpula del hampa."
          },
          {
            "fromRank": 10,
            "toRank": 10,
            "textEs": "Siempre podés conseguir hasta objetos Super Luxury para tus clientes, pieza por pieza, aunque no estén disponibles."
          }
        ],
        "reachPriceCategoriesEs": "Categorías citadas en el texto: Cheap, Everyday, Expensive, Very Expensive, Luxury, Super Luxury.",
        "contactsAndClients": [
          {
            "fromRank": 1,
            "toRank": 2,
            "textEs": "Local honcho, gang lord, liderazgo del barrio inmediato."
          },
          {
            "fromRank": 3,
            "toRank": 4,
            "textEs": "Honcho de pandilla de la ciudad, político menor, ejecutivo corporativo, persona muy conocida del barrio."
          },
          {
            "fromRank": 5,
            "toRank": 6,
            "textEs": "Pez gordo de la ciudad, político de la ciudad, celebridad del barrio."
          },
          {
            "fromRank": 7,
            "toRank": 8,
            "textEs": "Presidente de una corporación local, alcalde o administrador de la ciudad, celebridad local."
          },
          {
            "fromRank": 9,
            "toRank": 9,
            "textEs": "Jefe de división corporativa, político estatal o de zona de la ciudad, celebridad muy conocida."
          },
          {
            "fromRank": 10,
            "toRank": 10,
            "textEs": "Líder mundial importante, jefe de una gran corporación, celebridad de fama mundial."
          }
        ],
        "grease": [
          {
            "fromRank": 1,
            "toRank": 2,
            "textEs": "Conocés los entresijos culturales de tu barrio inmediato, incluidas todas las pandillas locales."
          },
          {
            "fromRank": 3,
            "toRank": 4,
            "textEs": "Te llevás bien con al menos 1 otra cultura de tu zona y ganás un idioma que no conocías, asociado a esa cultura, en Skill Level 4."
          },
          {
            "fromRank": 5,
            "toRank": 6,
            "textEs": "Te llevás perfecto con 2 culturas adicionales (3 en total) de tu zona y ganás un idioma nuevo por cada una (asociado a cada cultura) en Skill Level 4."
          },
          {
            "fromRank": 7,
            "toRank": 8,
            "textEs": "Te mezclás perfecto con 3 culturas adicionales (6 en total) de tu zona y ganás un idioma nuevo por cada una en Skill Level 4."
          },
          {
            "fromRank": 9,
            "toRank": 9,
            "textEs": "Te mezclás perfecto no solo con muchas culturas de tu zona, sino también con agencias corporativas y gubernamentales."
          },
          {
            "fromRank": 10,
            "toRank": 10,
            "textEs": "Te mezclás sin costuras con casi cualquier grupo, incluso muy especializados o cerrados: sociedades secretas, cultos o grupos de membresía exclusiva."
          }
        ],
        "source": {
          "book": "Core RED",
          "page": 160
        }
      },
      "tweak2077": [
        {
          "fromRank": 1,
          "textEs": "En los 2070s el Fixer puede conseguir objetos Expensive pieza por pieza, aunque no estén disponibles, desde Operator Rango 1.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        },
        {
          "fromRank": 4,
          "textEs": "Desde Rango 4 ese alcance se extiende a objetos Very Expensive.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        },
        {
          "fromRank": 7,
          "textEs": "Desde Rango 7 se extiende a objetos Luxury.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        },
        {
          "fromRank": 9,
          "textEs": "Desde Rango 9 se extiende a objetos Super Luxury.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        }
      ],
      "folio": {
        "pregen": "Connect",
        "folioTextEs": "'Siempre estás listo para cerrar un trato.' +4 a Trading (ya incluido en las bases de la ficha: Trading = COOL 8 + nivel 6 + 4 = 18).",
        "source": {
          "book": "CEMK Folios",
          "page": 9,
          "pageType": "pdf",
          "pages": [
            9,
            10,
            11
          ]
        },
        "convertsToEs": "Connect pasa a Operator 4. Verificado: el +4 del Folio corresponde exactamente al Haggle del Core. La tirada de Haggle es COOL 8 + Trading 6 + Operator 4 + 1d10 = base 18 + 1d10, igual a la base de Trading del Folio (8+6+4 = 18). Diferencia: en el Core el +4 se suma SOLO a las tiradas de Haggle, no a toda Trading Check; por eso, al convertir, Trading queda en nivel 6 (sin el +4 incluido) y el Rango 4 se suma en Haggle. Con Rango 4 (escalón 3-4): Contacts & Clients de honcho de pandilla de ciudad / político menor / ejecutivo corporativo; Reach hasta Expensive (Core) o hasta Very Expensive con el ajuste 2070s; Haggle: al comprar 5 o más del mismo objeto, uno gratis; Grease: 1 cultura adicional más un idioma nuevo en nivel 4.",
        "startingAllocation": {
          "stats": {
            "INT": 8,
            "REF": 6,
            "DEX": 6,
            "TECH": 5,
            "COOL": 8,
            "WILL": 7,
            "MOVE": 6,
            "BODY": 4,
            "EMP": 7
          },
          "luck": 5,
          "hp": 40,
          "seriouslyWoundedThreshold": 20,
          "deathSave": 4,
          "skills": {
            "Acting": 6,
            "Athletics": 4,
            "Brawling": 2,
            "Bribery": 6,
            "Concentration": 6,
            "Conversation": 6,
            "Cybertech": 5,
            "Dance": 5,
            "Education": 7,
            "Evasion": 5,
            "First Aid": 6,
            "Handgun": 6,
            "Human Perception": 6,
            "Melee Weapon": 5,
            "Perception": 6,
            "Persuasion": 5,
            "Resist Torture/Drugs": 4,
            "Stealth": 5,
            "Streetwise": 7,
            "Trading": 6,
            "Wardrobe & Style": 6
          },
          "skillBonuses": {
            "Human Perception": 2,
            "Trading": 4,
            "Wardrobe & Style": 2
          },
          "skillBases": {
            "Acting": 14,
            "Athletics": 10,
            "Autofire": 6,
            "Brawling": 8,
            "Bribery": 14,
            "Business": 8,
            "Composition": 8,
            "Conceal/Reveal Object": 8,
            "Concentration": 13,
            "Conversation": 13,
            "Cybertech": 10,
            "Dance": 11,
            "Deduction": 8,
            "Drive Land Vehicle": 6,
            "Education": 15,
            "Electronics/Security Tech": 5,
            "Evasion": 11,
            "First Aid": 11,
            "Handgun": 12,
            "Heavy Weapons": 6,
            "Human Perception": 15,
            "Interrogation": 8,
            "Library Search": 8,
            "Melee Weapon": 11,
            "Paramedic": 5,
            "Perception": 14,
            "Persuasion": 13,
            "Pick Lock": 5,
            "Pick Pocket": 5,
            "Play Instrument": 5,
            "Resist Torture/Drugs": 11,
            "Shoulder Arms": 6,
            "Stealth": 11,
            "Streetwise": 15,
            "Trading": 18,
            "Wardrobe & Style": 16
          },
          "weapons": [
            {
              "name": "Large Knife",
              "skill": "Melee Weapon",
              "baseCalc": "6 + 5 = 11",
              "damage": "2d6",
              "type2077": null,
              "rof": 2,
              "mag": null,
              "notes": "Medium Melee Weapon, ocultable."
            },
            {
              "name": "Militech M-76e Omaha x2",
              "skill": "Handgun",
              "baseCalc": "6 + 6 = 12",
              "damage": "3d6",
              "type2077": "Tech",
              "rof": 2,
              "mag": 9,
              "notes": "Heavy Pistol, una mano, ocultable; ambas empiezan cargadas con Basic Heavy Pistol Ammunition. Tech Weapon: mira que ve siluetas simples a través de Thin Cover; sacrificando la Move Action se carga hasta el final de un Turno en que se dispare. Charged Shot: sigue ROF2 y gasta 3 balas por Check (si hay menos, vacía el cargador); atraviesa Thin Cover e ignora la mitad del SP del objetivo (redondeo arriba).",
              "dvByRange_0-6_7-12_13-25_26-50_51-100_101-200_201-400_401-800": {
                "0-6": "13",
                "7-12": "15",
                "13-25": "20",
                "26-50": "25",
                "51-100": "30",
                "101-200": "30",
                "201-400": "—",
                "401-800": "—"
              }
            }
          ],
          "armor": {
            "name": "L Armorjack (abreviado en la ficha; probablemente Light Armorjack)",
            "sp": 11,
            "spHead": 11,
            "spVsMeleeChargedTech": 6,
            "spHeadVsMeleeChargedTech": 6
          },
          "cyberware": [
            "Neuroport",
            "Fashion Upgrades (+2 Wardrobe & Style)",
            "Dynalar Voice Stress Analyzer (+2 Human Perception)",
            "Kiroshi Starlight Eyes (ignora penalizadores por poca luz)"
          ],
          "gear": [
            "Burner Phone (holophone externo descartable)",
            "Heavy Pistol Ammunition extra x18 (9 por arma)"
          ],
          "eurodollars": 250
        }
      }
    },
    "Media": {
      "ability": "Credibility",
      "source": {
        "book": "Core RED",
        "page": 151
      },
      "rulesEs": "Rol Ability del Media: puede convencer a una audiencia de lo que publica, y cuanto más creíble es, mayor audiencia tiene; además tiene más acceso a fuentes e información y capta rumores de forma pasiva. Rumores pasivos: al menos dos veces por semana (si no estás totalmente fuera de la red) el GM tira en secreto tu Rango de Credibility + 1d10; si supera alguno de los DV de la columna Pasiva, te informa del rumor de mayor DV superado. Rumores activos (buscar en la Calle con Library Search, Conversation, Interrogation u otras skills de información): tirás la STAT + Skill relevante + 1d10 contra el DV de la columna Activa que fije el GM según el detalle del rumor. Publicar historias/scoops: Access/Sources = a quién podés contactar o entrevistar; Audience = cuánta gente alcanzan tus historias; Believability = qué tan bien cae la historia (se tira 1d10 según tu Believability al publicar y cada vez que quieras saber si un individuo o grupo se la cree); Impact = cuánto cambio genera la historia (lo maneja el GM). Bonos de Believability: +1 si la historia tiene al menos una pieza de evidencia verificable y fácil de entender para las masas; +2 si tiene más de 4 piezas distintas de evidencia dura; los dos bonos se acumulan. LUCK nunca se puede gastar en una Believability Check. Una vez publicada una historia no podés publicar otra sobre exactamente el mismo tema salvo que aportes información nueva.",
      "ranks": [
        {
          "rank": 1,
          "tierFromRank": 1,
          "tierToRank": 2,
          "unlocksEs": [
            "Access/Sources: Líder local, jefe de pandilla, liderazgo del barrio.",
            "Audience: Tu vecindario inmediato.",
            "Believability: 2 de 10 de probabilidad de que la audiencia lo crea",
            "Impact: El cambio generado por una historia es pequeño, incremental. Los malos de poca monta se asustan y pueden cambiar un poco su conducta."
          ]
        },
        {
          "rank": 2,
          "tierFromRank": 1,
          "tierToRank": 2,
          "unlocksEs": [
            "Access/Sources: Líder local, jefe de pandilla, liderazgo del barrio.",
            "Audience: Tu vecindario inmediato.",
            "Believability: 2 de 10 de probabilidad de que la audiencia lo crea",
            "Impact: El cambio generado por una historia es pequeño, incremental. Los malos de poca monta se asustan y pueden cambiar un poco su conducta."
          ]
        },
        {
          "rank": 3,
          "tierFromRank": 3,
          "tierToRank": 4,
          "unlocksEs": [
            "Access/Sources: Honcho de pandilla de la ciudad, político menor, ejecutivo corporativo, persona muy conocida del barrio.",
            "Audience: Sos conocido como colaborador del screamsheet o Data Pool local.",
            "Believability: 3 de 10 de probabilidad de que la audiencia lo crea",
            "Impact: El cambio tiene un efecto directo: los malos locales de poca monta son arrestados o expulsados del poder; se hace justicia."
          ]
        },
        {
          "rank": 4,
          "tierFromRank": 3,
          "tierToRank": 4,
          "unlocksEs": [
            "Access/Sources: Honcho de pandilla de la ciudad, político menor, ejecutivo corporativo, persona muy conocida del barrio.",
            "Audience: Sos conocido como colaborador del screamsheet o Data Pool local.",
            "Believability: 3 de 10 de probabilidad de que la audiencia lo crea",
            "Impact: El cambio tiene un efecto directo: los malos locales de poca monta son arrestados o expulsados del poder; se hace justicia."
          ]
        },
        {
          "rank": 5,
          "tierFromRank": 5,
          "tierToRank": 6,
          "unlocksEs": [
            "Access/Sources: Pez gordo de la ciudad, político de la ciudad, celebridad local.",
            "Audience: Tus notas llegan a toda la ciudad: columnista o colaborador regular de screamsheets o TV locales.",
            "Believability: 4 de 10 de probabilidad de que la audiencia lo crea",
            "Impact: La historia cambia cosas por toda la ciudad. Malos de mayor nivel pueden ser encarcelados o expulsados del poder; pueden aprobarse leyes locales."
          ]
        },
        {
          "rank": 6,
          "tierFromRank": 5,
          "tierToRank": 6,
          "unlocksEs": [
            "Access/Sources: Pez gordo de la ciudad, político de la ciudad, celebridad local.",
            "Audience: Tus notas llegan a toda la ciudad: columnista o colaborador regular de screamsheets o TV locales.",
            "Believability: 4 de 10 de probabilidad de que la audiencia lo crea",
            "Impact: La historia cambia cosas por toda la ciudad. Malos de mayor nivel pueden ser encarcelados o expulsados del poder; pueden aprobarse leyes locales."
          ]
        },
        {
          "rank": 7,
          "tierFromRank": 7,
          "tierToRank": 8,
          "unlocksEs": [
            "Access/Sources: Presidente de una corporación local, alcalde o administrador de la ciudad, celebridad de la ciudad.",
            "Audience: Tus notas llegan a todo el estado; sos una celebridad menor por derecho propio.",
            "Believability: 5 de 10 de probabilidad de que la audiencia lo crea",
            "Impact: El cambio afecta a varias ciudades. Corporaciones o gobiernos de nivel medio pueden caer; pueden aprobarse leyes que afecten a varias ciudades."
          ]
        },
        {
          "rank": 8,
          "tierFromRank": 7,
          "tierToRank": 8,
          "unlocksEs": [
            "Access/Sources: Presidente de una corporación local, alcalde o administrador de la ciudad, celebridad de la ciudad.",
            "Audience: Tus notas llegan a todo el estado; sos una celebridad menor por derecho propio.",
            "Believability: 5 de 10 de probabilidad de que la audiencia lo crea",
            "Impact: El cambio afecta a varias ciudades. Corporaciones o gobiernos de nivel medio pueden caer; pueden aprobarse leyes que afecten a varias ciudades."
          ]
        },
        {
          "rank": 9,
          "tierFromRank": 9,
          "tierToRank": 9,
          "unlocksEs": [
            "Access/Sources: Jefe de división corporativa, político estatal, celebridad muy conocida.",
            "Audience: Te conoce mucha gente en el país, aunque no todos; si te vieron, probablemente fue en un noticiero nacional.",
            "Believability: 6 de 10 de probabilidad de que la audiencia lo crea",
            "Impact: El cambio afecta a un área grande, como una nación entera. Grandes corporaciones o gobiernos locales pueden ser derribados; pueden aprobarse leyes de alcance nacional."
          ]
        },
        {
          "rank": 10,
          "tierFromRank": 10,
          "tierToRank": 10,
          "unlocksEs": [
            "Access/Sources: Líder mundial importante, jefe de una gran corporación, celebridad de fama mundial.",
            "Audience: Te conocen en todo el mundo: te piden autógrafos y gente en puestos altos te usa para filtrar información importante.",
            "Believability: 7 de 10 de probabilidad de que la audiencia lo crea",
            "Impact: El cambio afecta al mundo entero. Megacorporaciones y gobiernos poderosos pueden caer o ser derrocados; pueden establecerse leyes internacionales. El cambio puede afectar a millones."
          ]
        }
      ],
      "options": [],
      "tables": {
        "rumorDv": [
          {
            "rumor": "Vague Rumor",
            "descEs": "Rumor borroso; contiene lo mínimo para empezar a buscar la supuesta verdad de fondo.",
            "passiveDv": 7,
            "activeDv": 13
          },
          {
            "rumor": "Typical Rumor",
            "descEs": "Suficiente para saber a dónde ir después en una investigación; da un vistazo de pasada a la supuesta verdad de fondo.",
            "passiveDv": 9,
            "activeDv": 15
          },
          {
            "rumor": "Substantial Rumor",
            "descEs": "Como Typical, pero además incluye información concreta útil para una investigación: nombres, lugares, horas.",
            "passiveDv": 11,
            "activeDv": 17
          },
          {
            "rumor": "Detailed Rumor",
            "descEs": "Como Substantial, pero además incluye información que, verificada, podría ser evidencia para una historia sobre la supuesta verdad de fondo.",
            "passiveDv": 13,
            "activeDv": 21
          }
        ],
        "passiveRollEs": "El GM tira en secreto Rango de Credibility + 1d10, al menos 2 veces por semana; informa el rumor de mayor DV pasivo que la tirada supere.",
        "activeRollEs": "STAT + Skill relevante (Library Search, Conversation, Interrogation, etc.) + 1d10 contra el DV activo del rumor.",
        "believability": [
          {
            "fromRank": 1,
            "toRank": 2,
            "chanceOutOf10": 2
          },
          {
            "fromRank": 3,
            "toRank": 4,
            "chanceOutOf10": 3
          },
          {
            "fromRank": 5,
            "toRank": 6,
            "chanceOutOf10": 4
          },
          {
            "fromRank": 7,
            "toRank": 8,
            "chanceOutOf10": 5
          },
          {
            "fromRank": 9,
            "toRank": 9,
            "chanceOutOf10": 6
          },
          {
            "fromRank": 10,
            "toRank": 10,
            "chanceOutOf10": 7
          }
        ],
        "believabilityBonuses": [
          {
            "conditionEs": "al menos 1 pieza de evidencia verificable y fácil de entender para las masas",
            "bonus": 1
          },
          {
            "conditionEs": "más de 4 piezas distintas de evidencia dura verificable",
            "bonus": 2
          }
        ],
        "believabilityNotesEs": "Ambos bonos se acumulan (hasta +3). LUCK no se puede gastar en esta tirada.",
        "accessSources": [
          {
            "fromRank": 1,
            "toRank": 2,
            "textEs": "Líder local, jefe de pandilla, liderazgo del barrio."
          },
          {
            "fromRank": 3,
            "toRank": 4,
            "textEs": "Honcho de pandilla de la ciudad, político menor, ejecutivo corporativo, persona muy conocida del barrio."
          },
          {
            "fromRank": 5,
            "toRank": 6,
            "textEs": "Pez gordo de la ciudad, político de la ciudad, celebridad local."
          },
          {
            "fromRank": 7,
            "toRank": 8,
            "textEs": "Presidente de una corporación local, alcalde o administrador de la ciudad, celebridad de la ciudad."
          },
          {
            "fromRank": 9,
            "toRank": 9,
            "textEs": "Jefe de división corporativa, político estatal, celebridad muy conocida."
          },
          {
            "fromRank": 10,
            "toRank": 10,
            "textEs": "Líder mundial importante, jefe de una gran corporación, celebridad de fama mundial."
          }
        ],
        "audience": [
          {
            "fromRank": 1,
            "toRank": 2,
            "textEs": "Tu vecindario inmediato."
          },
          {
            "fromRank": 3,
            "toRank": 4,
            "textEs": "Sos conocido como colaborador del screamsheet o Data Pool local."
          },
          {
            "fromRank": 5,
            "toRank": 6,
            "textEs": "Tus notas llegan a toda la ciudad: columnista o colaborador regular de screamsheets o TV locales."
          },
          {
            "fromRank": 7,
            "toRank": 8,
            "textEs": "Tus notas llegan a todo el estado; sos una celebridad menor por derecho propio."
          },
          {
            "fromRank": 9,
            "toRank": 9,
            "textEs": "Te conoce mucha gente en el país, aunque no todos; si te vieron, probablemente fue en un noticiero nacional."
          },
          {
            "fromRank": 10,
            "toRank": 10,
            "textEs": "Te conocen en todo el mundo: te piden autógrafos y gente en puestos altos te usa para filtrar información importante."
          }
        ],
        "impact": [
          {
            "fromRank": 1,
            "toRank": 2,
            "textEs": "El cambio generado por una historia es pequeño, incremental. Los malos de poca monta se asustan y pueden cambiar un poco su conducta."
          },
          {
            "fromRank": 3,
            "toRank": 4,
            "textEs": "El cambio tiene un efecto directo: los malos locales de poca monta son arrestados o expulsados del poder; se hace justicia."
          },
          {
            "fromRank": 5,
            "toRank": 6,
            "textEs": "La historia cambia cosas por toda la ciudad. Malos de mayor nivel pueden ser encarcelados o expulsados del poder; pueden aprobarse leyes locales."
          },
          {
            "fromRank": 7,
            "toRank": 8,
            "textEs": "El cambio afecta a varias ciudades. Corporaciones o gobiernos de nivel medio pueden caer; pueden aprobarse leyes que afecten a varias ciudades."
          },
          {
            "fromRank": 9,
            "toRank": 9,
            "textEs": "El cambio afecta a un área grande, como una nación entera. Grandes corporaciones o gobiernos locales pueden ser derribados; pueden aprobarse leyes de alcance nacional."
          },
          {
            "fromRank": 10,
            "toRank": 10,
            "textEs": "El cambio afecta al mundo entero. Megacorporaciones y gobiernos poderosos pueden caer o ser derrocados; pueden establecerse leyes internacionales. El cambio puede afectar a millones."
          }
        ],
        "source": {
          "book": "Core RED",
          "page": 151
        }
      },
      "tweak2077": [
        {
          "fromRank": 4,
          "textEs": "En los 2070s los Medias pueden conseguir objetos Expensive pieza por pieza, aunque estén de otro modo no disponibles, a partir del Rango 4 de Credibility. El Core no les da Reach propio.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        }
      ],
      "folio": null
    },
    "Exec": {
      "ability": "Teamwork",
      "source": {
        "book": "Core RED",
        "page": 153
      },
      "rulesEs": "Rol Ability del Exec: construye un equipo cuyos miembros lo ayudan a lograr sus metas, legales o no, 'si la moral lo permite'. Los beneficios (traje, vivienda, seguro de salud y Team Members) se obtienen por Rango. Si te despiden, la Rol Ability no cambia: un Exec o Lawman con skills siempre está en demanda y consigue otro empleo en menos de una semana. Los Team Members se obtienen desde el Rango 3; el Rango 5 y el Rango 9 dan uno más cada uno, con un máximo de 3. Se tiran en una tabla especial por trabajo: el Exec elige la clase, pero la tirada determina las STATs que RRHH contrata. Se construyen como Personajes Jugadores con diferencias: no mejoran sus Skills, determinan y curan HP como un PJ, los controla el GM (su obediencia depende de Loyalty y de su Loyalty Save) y no pueden usar armadura distinta de Light Armorjack ('política de la compañía'). Pérdida: si un Team Member se pierde, RRHH recupera su equipo y lo reemplaza en la siguiente sesión de juego; el nuevo tiene STATs nuevas, Loyalty inicial reducida a 1 y cuesta al Exec 200eb adicionales en 'honorarios de contratación' (sobornos a RRHH).",
      "ranks": [
        {
          "rank": 1,
          "unlocksEs": [
            "Signing Bonus: un traje de Businesswear (Jacket, Top, Bottom y Footwear) que te identifica como miembro de la élite empresarial; no se puede revender sin levantar sospechas."
          ]
        },
        {
          "rank": 2,
          "unlocksEs": [
            "Corporate Housing: acceso a un Corporate Conapt de tu Compañía sin pagar Rent ni otras tarifas mientras seas miembro de la Corporación (el Lifestyle mensual se paga aparte). Si cambiás de Corporación, la nueva te ofrece lo mismo y paga la mudanza."
          ]
        },
        {
          "rank": 3,
          "unlocksEs": [
            "Team Member: obtenés 1 Team Member (total 1)."
          ]
        },
        {
          "rank": 4,
          "unlocksEs": [
            "Sin beneficio propio nuevo en el Core RED para el Rango 4."
          ]
        },
        {
          "rank": 5,
          "unlocksEs": [
            "Team Member adicional (total 2)."
          ]
        },
        {
          "rank": 6,
          "unlocksEs": [
            "Corporate Health Insurance: cobertura Trauma Team Silver, pagada mensualmente por tu Corporación (si cambiás de Corporación, te ofrecen lo mismo)."
          ]
        },
        {
          "rank": 7,
          "unlocksEs": [
            "Corporate Housing mejorado: una Beaverville House en la Executive Zone."
          ]
        },
        {
          "rank": 8,
          "unlocksEs": [
            "Corporate Health Insurance mejorada a Trauma Team Executive."
          ]
        },
        {
          "rank": 9,
          "unlocksEs": [
            "Team Member adicional (total 3, el máximo)."
          ]
        },
        {
          "rank": 10,
          "unlocksEs": [
            "Corporate Housing mejorado de forma dramática: una Beaverville McMansion en la Executive Zone o un Luxury Penthouse en la Corporate Zone."
          ]
        }
      ],
      "options": [],
      "tables": {
        "benefitsByRank": [
          {
            "rank": 1,
            "textEs": "Signing Bonus: un traje de Businesswear (Jacket, Top, Bottom y Footwear) que te identifica como miembro de la élite empresarial; no se puede revender sin levantar sospechas."
          },
          {
            "rank": 2,
            "textEs": "Corporate Housing: acceso a un Corporate Conapt de tu Compañía sin pagar Rent ni otras tarifas mientras seas miembro de la Corporación (el Lifestyle mensual se paga aparte). Si cambiás de Corporación, la nueva te ofrece lo mismo y paga la mudanza."
          },
          {
            "rank": 3,
            "textEs": "Team Member: obtenés 1 Team Member (total 1)."
          },
          {
            "rank": 4,
            "textEs": "Sin beneficio propio nuevo en el Core RED para el Rango 4."
          },
          {
            "rank": 5,
            "textEs": "Team Member adicional (total 2)."
          },
          {
            "rank": 6,
            "textEs": "Corporate Health Insurance: cobertura Trauma Team Silver, pagada mensualmente por tu Corporación (si cambiás de Corporación, te ofrecen lo mismo)."
          },
          {
            "rank": 7,
            "textEs": "Corporate Housing mejorado: una Beaverville House en la Executive Zone."
          },
          {
            "rank": 8,
            "textEs": "Corporate Health Insurance mejorada a Trauma Team Executive."
          },
          {
            "rank": 9,
            "textEs": "Team Member adicional (total 3, el máximo)."
          },
          {
            "rank": 10,
            "textEs": "Corporate Housing mejorado de forma dramática: una Beaverville McMansion en la Executive Zone o un Luxury Penthouse en la Corporate Zone."
          }
        ],
        "teamMemberCountByRank": [
          {
            "fromRank": 3,
            "toRank": 4,
            "members": 1
          },
          {
            "fromRank": 5,
            "toRank": 8,
            "members": 2
          },
          {
            "fromRank": 9,
            "toRank": 10,
            "members": 3
          }
        ],
        "teamMemberCreationEs": [
          "Job: elegir el trabajo (se puede elegir un cover job; ver cada tabla).",
          "STATs: tirar 1d6 y leer la fila; registrar también HP, Mortally Wounded y Death Save. No hace falta bajar EMP por Humanity Loss de cyberware (ya está contemplado).",
          "Skills, Cyberware y Gear: paquetes estándar de la compañía (ver cada tabla).",
          "Starting Loyalty: tirar 1d6 y sumar 1."
        ],
        "teamMemberStatColumns": [
          "INT",
          "REF",
          "DEX",
          "TECH",
          "COOL",
          "WILL",
          "MOVE",
          "BODY",
          "EMP"
        ],
        "teamMemberTables": {
          "Company Bodyguard": {
            "coverJobs": [
              "Escort",
              "Personal Trainer"
            ],
            "trueJobEs": "Proteger al Exec en situaciones peligrosas.",
            "roll1d6": [
              {
                "roll": 1,
                "INT": 3,
                "REF": 7,
                "DEX": 7,
                "TECH": 4,
                "COOL": 7,
                "WILL": 6,
                "MOVE": 4,
                "BODY": 8,
                "EMP": 4
              },
              {
                "roll": 2,
                "INT": 5,
                "REF": 8,
                "DEX": 6,
                "TECH": 2,
                "COOL": 7,
                "WILL": 8,
                "MOVE": 4,
                "BODY": 8,
                "EMP": 2
              },
              {
                "roll": 3,
                "INT": 4,
                "REF": 8,
                "DEX": 5,
                "TECH": 3,
                "COOL": 7,
                "WILL": 8,
                "MOVE": 6,
                "BODY": 6,
                "EMP": 3
              },
              {
                "roll": 4,
                "INT": 4,
                "REF": 7,
                "DEX": 8,
                "TECH": 4,
                "COOL": 7,
                "WILL": 7,
                "MOVE": 4,
                "BODY": 7,
                "EMP": 2
              },
              {
                "roll": 5,
                "INT": 3,
                "REF": 8,
                "DEX": 5,
                "TECH": 2,
                "COOL": 8,
                "WILL": 7,
                "MOVE": 4,
                "BODY": 6,
                "EMP": 7
              },
              {
                "roll": 6,
                "INT": 5,
                "REF": 7,
                "DEX": 7,
                "TECH": 2,
                "COOL": 7,
                "WILL": 6,
                "MOVE": 5,
                "BODY": 7,
                "EMP": 4
              }
            ],
            "skills": {
              "+2": [
                "Concentration",
                "Conversation",
                "Education",
                "First Aid",
                "Human Perception",
                "Language (Streetslang)",
                "Local Expert (Your Home)",
                "Persuasion",
                "Stealth"
              ],
              "+4": [
                "Athletics",
                "Evasion",
                "Interrogation",
                "Perception",
                "Resist Torture/Drugs",
                "Tactics"
              ],
              "+6": [
                "Handgun",
                "Brawling"
              ],
              "levelNoteEs": "Los +2/+4/+6 son niveles de Skill del miembro; no mejoran con el tiempo."
            },
            "cyberware": [
              "Enhanced Antibodies",
              "Subdermal Armor (SP 11)",
              "Cyberaudio Suite",
              "Internal Agent",
              "Homing Tracer"
            ],
            "gear": [
              "Agent",
              "Light Armorjack (SP 11)",
              "Very Heavy Pistol",
              "Basic VH Pistol Ammo x50"
            ],
            "source": {
              "book": "Core RED",
              "page": 155
            }
          },
          "Company Covert Operative": {
            "coverJobs": [
              "Personal Assistant",
              "Stylist"
            ],
            "trueJobEs": "Evitar que el Exec se ensucie las manos.",
            "roll1d6": [
              {
                "roll": 1,
                "INT": 4,
                "REF": 8,
                "DEX": 5,
                "TECH": 4,
                "COOL": 6,
                "WILL": 8,
                "MOVE": 5,
                "BODY": 7,
                "EMP": 3
              },
              {
                "roll": 2,
                "INT": 3,
                "REF": 8,
                "DEX": 6,
                "TECH": 2,
                "COOL": 8,
                "WILL": 6,
                "MOVE": 6,
                "BODY": 6,
                "EMP": 5
              },
              {
                "roll": 3,
                "INT": 6,
                "REF": 7,
                "DEX": 5,
                "TECH": 5,
                "COOL": 7,
                "WILL": 6,
                "MOVE": 3,
                "BODY": 7,
                "EMP": 4
              },
              {
                "roll": 4,
                "INT": 5,
                "REF": 6,
                "DEX": 5,
                "TECH": 3,
                "COOL": 6,
                "WILL": 8,
                "MOVE": 7,
                "BODY": 6,
                "EMP": 4
              },
              {
                "roll": 5,
                "INT": 3,
                "REF": 8,
                "DEX": 4,
                "TECH": 4,
                "COOL": 8,
                "WILL": 7,
                "MOVE": 4,
                "BODY": 8,
                "EMP": 4
              },
              {
                "roll": 6,
                "INT": 5,
                "REF": 8,
                "DEX": 3,
                "TECH": 7,
                "COOL": 7,
                "WILL": 8,
                "MOVE": 3,
                "BODY": 6,
                "EMP": 3
              }
            ],
            "skills": {
              "+2": [
                "Athletics",
                "Brawling",
                "Concentration",
                "Conversation",
                "Education",
                "First Aid",
                "Language (Streetslang)",
                "Local Expert (Your Home)",
                "Perception",
                "Persuasion"
              ],
              "+4": [
                "Bribery",
                "Bureaucracy",
                "Business",
                "Evasion",
                "Human Perception",
                "Pick Lock",
                "Streetwise",
                "Trading",
                "Wardrobe & Style"
              ],
              "+6": [
                "Handgun",
                "Stealth"
              ],
              "levelNoteEs": "Los +2/+4/+6 son niveles de Skill del miembro; no mejoran con el tiempo."
            },
            "cyberware": [
              "Cybereyes con Low Light/Infrared/UV pareados",
              "Color Shift",
              "Cyberarm con Grapple Hand",
              "Popup Ranged Weapon (Very Heavy Pistol)",
              "Realskinn Covering"
            ],
            "gear": [
              "Agent",
              "Light Armorjack (SP 11)",
              "Very Heavy Pistol",
              "Basic VH Pistol Ammo x50"
            ],
            "source": {
              "book": "Core RED",
              "page": 155
            }
          },
          "Company Driver": {
            "coverJobs": [
              "Valet",
              "Personal Driver"
            ],
            "trueJobEs": "Conducir, pilotar y mantener los vehículos del equipo.",
            "roll1d6": [
              {
                "roll": 1,
                "INT": 5,
                "REF": 8,
                "DEX": 6,
                "TECH": 4,
                "COOL": 6,
                "WILL": 5,
                "MOVE": 6,
                "BODY": 5,
                "EMP": 5
              },
              {
                "roll": 2,
                "INT": 5,
                "REF": 7,
                "DEX": 7,
                "TECH": 5,
                "COOL": 5,
                "WILL": 7,
                "MOVE": 4,
                "BODY": 7,
                "EMP": 3
              },
              {
                "roll": 3,
                "INT": 6,
                "REF": 8,
                "DEX": 8,
                "TECH": 4,
                "COOL": 7,
                "WILL": 4,
                "MOVE": 5,
                "BODY": 6,
                "EMP": 2
              },
              {
                "roll": 4,
                "INT": 8,
                "REF": 7,
                "DEX": 4,
                "TECH": 5,
                "COOL": 4,
                "WILL": 7,
                "MOVE": 5,
                "BODY": 6,
                "EMP": 4
              },
              {
                "roll": 5,
                "INT": 7,
                "REF": 8,
                "DEX": 3,
                "TECH": 5,
                "COOL": 7,
                "WILL": 6,
                "MOVE": 4,
                "BODY": 6,
                "EMP": 4
              },
              {
                "roll": 6,
                "INT": 6,
                "REF": 8,
                "DEX": 6,
                "TECH": 6,
                "COOL": 8,
                "WILL": 5,
                "MOVE": 3,
                "BODY": 5,
                "EMP": 3
              }
            ],
            "skills": {
              "+2": [
                "Athletics",
                "Concentration",
                "Conversation",
                "Education",
                "First Aid",
                "Human Perception",
                "Language (Streetslang)",
                "Local Expert (Your Home)",
                "Perception",
                "Persuasion"
              ],
              "+4": [
                "Brawling",
                "Endurance",
                "Evasion",
                "Land Vehicle Tech",
                "Pilot Air Vehicle",
                "Pilot Sea Vehicle",
                "Sea Vehicle Tech",
                "Stealth",
                "Tracking"
              ],
              "+6": [
                "Drive Land Vehicle",
                "Handgun"
              ],
              "levelNoteEs": "Los +2/+4/+6 son niveles de Skill del miembro; no mejoran con el tiempo."
            },
            "cyberware": [
              "Radar/Sonar Implant",
              "Cyberaudio Suite",
              "Internal Agent",
              "Homing Tracer",
              "Radar Detector"
            ],
            "gear": [
              "Light Armorjack (SP 11)",
              "Very Heavy Pistol",
              "Compact Groundcar con Seating Upgrade",
              "Basic VH Pistol Ammo x50"
            ],
            "source": {
              "book": "Core RED",
              "page": 156
            }
          },
          "Company Netrunner": {
            "coverJobs": [
              "I.T. Engineer",
              "Research Specialist"
            ],
            "trueJobEs": "Netrunning y recolección de información.",
            "roll1d6": [
              {
                "roll": 1,
                "INT": 6,
                "REF": 7,
                "DEX": 8,
                "TECH": 7,
                "COOL": 5,
                "WILL": 4,
                "MOVE": 5,
                "BODY": 5,
                "EMP": 3
              },
              {
                "roll": 2,
                "INT": 7,
                "REF": 8,
                "DEX": 4,
                "TECH": 6,
                "COOL": 8,
                "WILL": 3,
                "MOVE": 4,
                "BODY": 6,
                "EMP": 4
              },
              {
                "roll": 3,
                "INT": 5,
                "REF": 6,
                "DEX": 8,
                "TECH": 8,
                "COOL": 6,
                "WILL": 6,
                "MOVE": 4,
                "BODY": 4,
                "EMP": 3
              },
              {
                "roll": 4,
                "INT": 7,
                "REF": 8,
                "DEX": 5,
                "TECH": 6,
                "COOL": 4,
                "WILL": 4,
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
                "COOL": 5,
                "WILL": 3,
                "MOVE": 6,
                "BODY": 4,
                "EMP": 6
              },
              {
                "roll": 6,
                "INT": 8,
                "REF": 7,
                "DEX": 6,
                "TECH": 6,
                "COOL": 4,
                "WILL": 7,
                "MOVE": 4,
                "BODY": 4,
                "EMP": 4
              }
            ],
            "skills": {
              "+2": [
                "Interface (Rol Ability del Netrunner)",
                "Athletics",
                "Brawling",
                "Concentration",
                "Conversation",
                "Evasion",
                "First Aid",
                "Human Perception",
                "Language (Streetslang)",
                "Local Expert (Your Home)",
                "Perception",
                "Persuasion"
              ],
              "+4": [
                "Basic Tech",
                "Cryptography",
                "Cybertech",
                "Education",
                "Electronics/Security Tech (x2)",
                "Forgery",
                "Library Search",
                "Handgun",
                "Stealth"
              ],
              "levelNoteEs": "Los +2/+4/+6 son niveles de Skill del miembro; no mejoran con el tiempo."
            },
            "cyberware": [
              "Neural Link",
              "Chipware Socket",
              "Pain Editor",
              "Interface Plugs",
              "Cybereyes con Virtuality"
            ],
            "gear": [
              "Agent",
              "Light Armorjack (SP 11)",
              "Cyberdeck (7 slots: Sword, Sword, Killer, Worm, Worm, Armor)",
              "Very Heavy Pistol",
              "Basic VH Pistol Ammo x50"
            ],
            "source": {
              "book": "Core RED",
              "page": 156
            }
          },
          "Company Technician": {
            "coverJobs": [
              "I.T. Engineer",
              "Intern"
            ],
            "trueJobEs": "Reparar el equipo y las armas del equipo.",
            "roll1d6": [
              {
                "roll": 1,
                "INT": 8,
                "REF": 8,
                "DEX": 5,
                "TECH": 7,
                "COOL": 3,
                "WILL": 4,
                "MOVE": 4,
                "BODY": 5,
                "EMP": 6
              },
              {
                "roll": 2,
                "INT": 8,
                "REF": 7,
                "DEX": 6,
                "TECH": 8,
                "COOL": 3,
                "WILL": 5,
                "MOVE": 5,
                "BODY": 4,
                "EMP": 4
              },
              {
                "roll": 3,
                "INT": 8,
                "REF": 6,
                "DEX": 5,
                "TECH": 8,
                "COOL": 4,
                "WILL": 3,
                "MOVE": 3,
                "BODY": 7,
                "EMP": 6
              },
              {
                "roll": 4,
                "INT": 8,
                "REF": 8,
                "DEX": 5,
                "TECH": 7,
                "COOL": 4,
                "WILL": 4,
                "MOVE": 4,
                "BODY": 5,
                "EMP": 5
              },
              {
                "roll": 5,
                "INT": 7,
                "REF": 7,
                "DEX": 3,
                "TECH": 7,
                "COOL": 5,
                "WILL": 3,
                "MOVE": 6,
                "BODY": 6,
                "EMP": 3
              },
              {
                "roll": 6,
                "INT": 7,
                "REF": 8,
                "DEX": 5,
                "TECH": 8,
                "COOL": 6,
                "WILL": 3,
                "MOVE": 3,
                "BODY": 5,
                "EMP": 5
              }
            ],
            "skills": {
              "+2": [
                "Athletics",
                "Brawling",
                "Concentration",
                "Conversation",
                "Evasion",
                "First Aid",
                "Human Perception",
                "Language (Streetslang)",
                "Local Expert (Your Home)",
                "Perception",
                "Persuasion",
                "Stealth"
              ],
              "+4": [
                "Education",
                "Handgun",
                "Weaponstech (x2)"
              ],
              "+6": [
                "Basic Tech",
                "Cybertech",
                "Electronics/Security Tech (x2)"
              ],
              "levelNoteEs": "Los +2/+4/+6 son niveles de Skill del miembro; no mejoran con el tiempo."
            },
            "cyberware": [
              "Tool Hand",
              "Cyberaudio Suite",
              "Internal Agent",
              "Bug Detector",
              "Audio Recorder"
            ],
            "gear": [
              "Light Armorjack (SP 11)",
              "Very Heavy Pistol",
              "Basic VH Pistol Ammo x50"
            ],
            "source": {
              "book": "Core RED",
              "page": 157
            }
          }
        },
        "loyalty": {
          "startingEs": "1d6 + 1.",
          "capEs": "Máximo 10 entre sesiones de juego; durante una sesión no tiene límite. El Exec debe promover Loyalty en cada sesión para no perderla.",
          "loyaltySaveEs": "Cada vez que el Exec da una tarea a un Team Member, el GM tira 1d6 por debajo de la Loyalty actual del miembro. Si falla, el miembro puede negarse, arruinar la tarea o traicionar al Exec.",
          "betrayalEs": "Con Loyalty 0 o menor, el Team Member intenta activamente traicionar al Exec ante sus enemigos. Si al final de una sesión tiene menos de 0, se queja a RRHH y recibe un traslado o renuncia si se lo niegan; en ambos casos se va (ver reemplazo).",
          "replacementEs": "RRHH recupera el equipo y lo reemplaza la siguiente sesión: STATs nuevas, Loyalty inicial 1 y 200eb de honorarios de contratación extra.",
          "gain": [
            {
              "actionEs": "Elogiar el trabajo del miembro (si se abusa en una semana deja de dar Loyalty)",
              "value": 1
            },
            {
              "actionEs": "Darle un bono o beneficio de al menos 200eb de valor",
              "value": 4
            },
            {
              "actionEs": "Apoyarlo contra la Gerencia",
              "value": 4
            },
            {
              "actionEs": "Darle un 20% de tus ganancias por un trabajo",
              "value": 6
            },
            {
              "actionEs": "Darle tiempo libre pago (una sesión de juego entera)",
              "value": 6
            },
            {
              "actionEs": "Arriesgar tu integridad física por el miembro",
              "value": 8
            }
          ],
          "loss": [
            {
              "actionEs": "No ganar nada de Loyalty con el miembro durante una sesión de juego entera",
              "value": -1
            },
            {
              "actionEs": "Reprender o criticar al miembro o su trabajo",
              "value": -2
            },
            {
              "actionEs": "Ignorar su aporte a un trabajo / olvidar su cumpleaños",
              "value": -4
            },
            {
              "actionEs": "No cumplir con el bono o beneficio prometido",
              "value": -6
            },
            {
              "actionEs": "Echarle la culpa ante la Gerencia",
              "value": -6
            },
            {
              "actionEs": "Abandonarlo bajo fuego",
              "value": -8
            }
          ],
          "source": {
            "book": "Core RED",
            "page": 154
          }
        },
        "firedEs": "Si te despiden, la Rol Ability no cambia; conseguís otro empleo en menos de una semana.",
        "source": {
          "book": "Core RED",
          "page": 154
        }
      },
      "tweak2077": [
        {
          "fromRank": 4,
          "textEs": "En los 2070s los Execs pueden conseguir objetos Expensive pieza por pieza, aunque estén de otro modo no disponibles, a partir del Rango 4 de Teamwork.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        }
      ],
      "folio": null
    },
    "Lawman": {
      "ability": "Backup",
      "source": {
        "book": "Core RED",
        "page": 158
      },
      "rulesEs": "Rol Ability del Lawman: puede pedir ayuda a un grupo de colegas de las fuerzas del orden según su Rango de Backup y las condiciones de la llamada. El Backup es controlado por el GM, armado y blindado según la tabla. A mayor Rango, el Lawman probablemente asciende en su organización o es reclutado por agencias a las que ya puede llamar. En peligro, podés llamar a Backup de un grupo de tu Rango o inferior: como Acción, tirás 1d10 y necesitás sacar igual o menos que tu Rango de Backup para que alguien responda. Si respondió, tirás 1d6 para saber en cuántas Rondas llega. Si el d6 es 6, en lugar del Backup típico llega el del siguiente nivel superior; en Rango 10, en cambio, llegan dos grupos de Backup distintos. Si nadie responde, podés reintentar el Turno siguiente. Si abusás, tu Jefe te echa del cuerpo o te multa. Combat Number: base de Skill para ofensiva y defensa (combina STAT y Skill); se le suma 1d10 al atacar con sus armas o al defender; el Backup no puede esquivar balas. SP: armadura en Cuerpo y Cabeza. HP: Hit Points de cada miembro. MOVE & BODY: STATs de MOVE y BODY (para movimiento y efectos que los referencian, como Death Saves).",
      "ranks": [
        {
          "rank": 1,
          "tierFromRank": 1,
          "tierToRank": 2,
          "unlocksEs": [
            "Backup disponible: Corporate Security (Combat Number 8, SP 7, HP 20, MOVE y BODY 4). Cuatro renta-cops locales que llegan a pie. Llevan Heavy Pistols y visten Kevlar."
          ]
        },
        {
          "rank": 2,
          "tierFromRank": 1,
          "tierToRank": 2,
          "unlocksEs": [
            "Backup disponible: Corporate Security (Combat Number 8, SP 7, HP 20, MOVE y BODY 4). Cuatro renta-cops locales que llegan a pie. Llevan Heavy Pistols y visten Kevlar."
          ]
        },
        {
          "rank": 3,
          "tierFromRank": 3,
          "tierToRank": 4,
          "unlocksEs": [
            "Backup disponible: Local Beat Cops (Combat Number 10, SP 7, HP 25, MOVE y BODY 5). Cuatro policías locales de ronda. Llegan en dos Compact Groundcars. Llevan Heavy Pistols y visten Kevlar."
          ]
        },
        {
          "rank": 4,
          "tierFromRank": 3,
          "tierToRank": 4,
          "unlocksEs": [
            "Backup disponible: Local Beat Cops (Combat Number 10, SP 7, HP 25, MOVE y BODY 5). Cuatro policías locales de ronda. Llegan en dos Compact Groundcars. Llevan Heavy Pistols y visten Kevlar."
          ]
        },
        {
          "rank": 5,
          "tierFromRank": 5,
          "tierToRank": 7,
          "unlocksEs": [
            "Backup disponible: Sheriff's Department (Combat Number 14, SP 13, HP 35, MOVE y BODY 4). Dos 'County Mounties' que patrullan los suburbios y carreteras alrededor de la ciudad. Llegan en un High Performance Groundcar, armados con Heavy Pistols y Assault Rifles, con Heavy Armorjack."
          ]
        },
        {
          "rank": 6,
          "tierFromRank": 5,
          "tierToRank": 7,
          "unlocksEs": [
            "Backup disponible: Sheriff's Department (Combat Number 14, SP 13, HP 35, MOVE y BODY 4). Dos 'County Mounties' que patrullan los suburbios y carreteras alrededor de la ciudad. Llegan en un High Performance Groundcar, armados con Heavy Pistols y Assault Rifles, con Heavy Armorjack."
          ]
        },
        {
          "rank": 7,
          "tierFromRank": 5,
          "tierToRank": 7,
          "unlocksEs": [
            "Backup disponible: Sheriff's Department (Combat Number 14, SP 13, HP 35, MOVE y BODY 4). Dos 'County Mounties' que patrullan los suburbios y carreteras alrededor de la ciudad. Llegan en un High Performance Groundcar, armados con Heavy Pistols y Assault Rifles, con Heavy Armorjack."
          ]
        },
        {
          "rank": 8,
          "tierFromRank": 8,
          "tierToRank": 8,
          "unlocksEs": [
            "Backup disponible: Recovery Zone Marshal (Combat Number 16, SP 15, HP 50, MOVE y BODY 6). Un solo Lawman que patrulla las Recovery Zones y ciudades nuevas, como los marshals del Viejo Oeste. Llega en una Superbike con Very Heavy Pistol, Assault Rifle y Grenade Launcher, con Flak Armor."
          ]
        },
        {
          "rank": 9,
          "tierFromRank": 9,
          "tierToRank": 9,
          "unlocksEs": [
            "Backup disponible: C-SWAT (Combat Number 15, SP 18, HP 35, MOVE y BODY 4). Dos pesos pesados del Psycho Squad con Assault Rifles y Rocket Launchers, con Metalgear. Llegan por aire en un AV-4."
          ]
        },
        {
          "rank": 10,
          "tierFromRank": 10,
          "tierToRank": 10,
          "unlocksEs": [
            "Backup disponible: National Law Enforcement / Interpol / FBI / Netwatch (Combat Number 14, SP 11, HP 35, MOVE y BODY 6). Dos agentes serios bajo control de gobiernos nacionales o agencias internacionales. Llegan en pareja en un AV-4, con Very Heavy Pistols y Assault Rifles, en Light Armorjack. A diferencia del resto, se quedan tras el conflicto y ayudan a investigar la escena; los mismos 2 responden siempre a llamadas de Backup conectadas a la inicial hasta que el 'caso' se cierre o caigan en servicio. Pueden usar su Combat Number en las skills: Accounting, Acting, Conceal/Reveal Object, Criminology, Cryptography, Deduction, Education, Forgery, Interrogation, Paramedic, Perception, Personal Grooming, Resist Torture/Drugs, Stealth y Tracking."
          ]
        }
      ],
      "options": [],
      "tables": {
        "callProcedure": {
          "action": "Acción",
          "callRollEs": "1d10 igual o menor que el Rango de Backup; si lo logra, alguien responde",
          "arrivalRollEs": "1d6 = Rondas hasta que llega el Backup",
          "arrivalSixEs": "Si el d6 da 6: llega el Backup del siguiente nivel superior (en Rango 10: llegan dos grupos de Backup distintos)",
          "retryEs": "Si nadie responde, se puede reintentar el Turno siguiente",
          "abuseEs": "Si se abusa, el Jefe del Lawman lo echa o lo multa",
          "groupChoiceEs": "Se puede llamar a Backup de un grupo de tu Rango o inferior"
        },
        "backupGroups": [
          {
            "fromRank": 1,
            "toRank": 2,
            "name": "Corporate Security",
            "members": 4,
            "combatNumber": 8,
            "sp": 7,
            "hp": 20,
            "move": 4,
            "body": 4,
            "weapons": "Heavy Pistol",
            "armor": "Kevlar",
            "vehicle": "a pie",
            "descEs": "Cuatro renta-cops locales que llegan a pie. Llevan Heavy Pistols y visten Kevlar."
          },
          {
            "fromRank": 3,
            "toRank": 4,
            "name": "Local Beat Cops",
            "members": 4,
            "combatNumber": 10,
            "sp": 7,
            "hp": 25,
            "move": 5,
            "body": 5,
            "weapons": "Heavy Pistol",
            "armor": "Kevlar",
            "vehicle": "2 Compact Groundcars",
            "descEs": "Cuatro policías locales de ronda. Llegan en dos Compact Groundcars. Llevan Heavy Pistols y visten Kevlar."
          },
          {
            "fromRank": 5,
            "toRank": 7,
            "name": "Sheriff's Department",
            "members": 2,
            "combatNumber": 14,
            "sp": 13,
            "hp": 35,
            "move": 4,
            "body": 4,
            "weapons": "Heavy Pistol, Assault Rifle",
            "armor": "Heavy Armorjack",
            "vehicle": "1 High Performance Groundcar",
            "descEs": "Dos 'County Mounties' que patrullan los suburbios y carreteras alrededor de la ciudad. Llegan en un High Performance Groundcar, armados con Heavy Pistols y Assault Rifles, con Heavy Armorjack."
          },
          {
            "fromRank": 8,
            "toRank": 8,
            "name": "Recovery Zone Marshal",
            "members": 1,
            "combatNumber": 16,
            "sp": 15,
            "hp": 50,
            "move": 6,
            "body": 6,
            "weapons": "Very Heavy Pistol, Assault Rifle, Grenade Launcher",
            "armor": "Flak Armor",
            "vehicle": "Superbike",
            "descEs": "Un solo Lawman que patrulla las Recovery Zones y ciudades nuevas, como los marshals del Viejo Oeste. Llega en una Superbike con Very Heavy Pistol, Assault Rifle y Grenade Launcher, con Flak Armor."
          },
          {
            "fromRank": 9,
            "toRank": 9,
            "name": "C-SWAT",
            "members": 2,
            "combatNumber": 15,
            "sp": 18,
            "hp": 35,
            "move": 4,
            "body": 4,
            "weapons": "Assault Rifle, Rocket Launcher",
            "armor": "Metalgear",
            "vehicle": "AV-4",
            "descEs": "Dos pesos pesados del Psycho Squad con Assault Rifles y Rocket Launchers, con Metalgear. Llegan por aire en un AV-4."
          },
          {
            "fromRank": 10,
            "toRank": 10,
            "name": "National Law Enforcement / Interpol / FBI / Netwatch",
            "members": 2,
            "combatNumber": 14,
            "sp": 11,
            "hp": 35,
            "move": 6,
            "body": 6,
            "weapons": "Very Heavy Pistol, Assault Rifle",
            "armor": "Light Armorjack",
            "vehicle": "AV-4",
            "descEs": "Dos agentes serios bajo control de gobiernos nacionales o agencias internacionales. Llegan en pareja en un AV-4, con Very Heavy Pistols y Assault Rifles, en Light Armorjack. A diferencia del resto, se quedan tras el conflicto y ayudan a investigar la escena; los mismos 2 responden siempre a llamadas de Backup conectadas a la inicial hasta que el 'caso' se cierre o caigan en servicio. Pueden usar su Combat Number en las skills: Accounting, Acting, Conceal/Reveal Object, Criminology, Cryptography, Deduction, Education, Forgery, Interrogation, Paramedic, Perception, Personal Grooming, Resist Torture/Drugs, Stealth y Tracking."
          }
        ],
        "backupFieldsEs": "Combat Number = Skill Base ofensiva y defensiva (+1d10; el Backup no esquiva balas); SP aplica a Cuerpo y Cabeza; HP por miembro; MOVE y BODY tienen el mismo valor.",
        "source": {
          "book": "Core RED",
          "page": 158
        }
      },
      "tweak2077": [
        {
          "fromRank": 4,
          "textEs": "En los 2070s los Lawmen pueden conseguir objetos Expensive relacionados con su trabajo (armas, armadura y otro equipo según determine el GM) pieza por pieza, aunque no estén disponibles, a partir del Rango 4.",
          "source": {
            "book": "CEMK RB",
            "page": 25
          }
        }
      ],
      "folio": null
    }
  },
  "doubts": [
    "Netrunner: el RB (p.16) da hasta 3 Net Actions por Turno (Quickhacking) y el Folio de Bluescreen también, mientras que el Core da 2/3/4/5 por Rango de Interface (1-3/4-6/7-9/10). A Rango 4 coinciden en 3; para otros Rangos se aplica la tabla del Core. El RB no dice qué pasa con Rangos 5+ en Quickhacks (no existe un tier superior a Advanced DV12 en el RB).",
    "Netrunner: el rango de Jack In del RB p.16 dice 'a 50 m/yd' sin condicionar al hardware, pero la sección 2070s (RB p.26) condiciona el alcance a 6 m/yd (3 casillas), 8 m/yd (4 casillas) con 'el hardware adecuado' (no se nombra qué opción de hardware) o 50 m/yd con Neuroport Cyberdeck Port. Se transcriben ambos; Neuroport Cyberdeck Port (RB p.36) también da 20 m/yd para Arquitecturas normales. [Decidido por Giuliano, 2026-10-22: 6 m con cyberdeck común, 8 m con el Range Upgrade del cyberdeck (Core p.208) y 50 m con el Cyberdeck Port; RB p.16 asume el Cyberdeck Port]",
    "Netrunner: las páginas pedidas (RB pp.17/36) no coinciden exactamente con el texto: Breach/Net Actions están en p.16 (PDF 17) y la lista de Quickhacks en pp.16-17; Self-ICE con DV por total está en p.36 (PDF 37) y también resumido en el Hardware de la hoja de referencia. Se cita lo que figura en cada página.",
    "Netrunner: Core p.198-201 no fija DV universales para Backdoor, Control, Eye-Dee ni Virus; el DV lo fija la Arquitectura/GM (ejemplos del libro: Password DV10, Control Node DV10, Archivo DV9, Virus DV6-DV12). Scanner usa un resultado abierto a criterio del GM. Los valores se guardaron como ejemplos, no como DV fijos. Pathfinder y Slide no usan DV fijo.",
    "Netrunner: el RB solo menciona 'el hardware adecuado' para alcance 8 m/yd; no se dice cuál es. [Decidido por Giuliano, 2026-10-22: el hardware es el Range Upgrade del cyberdeck (Core p.208, 100eb)]",
    "Tech: el Core no da una lista de beneficios por Rango de Maker; la regla es 'cada subida = 1 Rango en dos Especialidades distintas'. El máximo de Rangos por especialidad (= Rango de Maker) se deduce de esa regla (nunca se puede poner 2 Rangos de una subida en la misma especialidad); no figura impreso como tope. A Rango 4, Maven del Folio no puede superar 4 en ninguna especialidad y Field Expertise queda en 4. [Decidido por Giuliano, 2026-10-22: tope por especialidad = rango de Maker; Field Expertise se aplica completa aunque dé más que el Folio de Maven]",
    "Tech: Field Expertise (+4) cubre más Skills que el Folio de Maven (Basic Tech, Weaponstech y las Tech de vehículos además de Cybertech y Electronics/Security Tech), así que la conversión no es exactamente 1:1: da más que el Folio. Se anota por transparencia.",
    "Medtech: Pharmaceuticals 1 punto da a la vez 1 nivel de Medical Tech, que el Folio de Insurance no lista (Medical Tech no aparece en su tabla de Skills). Con la conversión, Insurance tendría Medical Tech 1 que el Folio no refleja. Speedheal del Folio es 'una vez por Beat'; en el Core es una dosis por día por persona y requiere síntesis (DV13, materiales 200eb). [Decidido por Giuliano, 2026-10-22: Insurance convertida tiene Medical Tech 1]",
    "Medtech: Surgery 'Base 12' del Folio se obtiene como TECH 8 + 4; con Surgery 2 puntos = +4 en el Core, coincide.",
    "Medtech: el Core no aclara si un Medtech de Rango 1 ya parte con su primer punto (se asume que sí, 1 punto por Rango = N puntos a Rango N). [Decidido por Giuliano, 2026-10-22: 1 punto por rango]",
    "Nomad: el Core no dice cuántas elecciones de Family Motorpool/mejora tiene un personaje en el Rango 1 inicial; se asume 1 por cada Rango (4 a Rango 4), pero el texto solo dice 'cada vez que sube su Rango'.",
    "Nomad: el Rango mínimo de cada mejora de vehículo se leyó del número que precede a cada mejora en la capa de texto del PDF (Core pp.163-165); la maquetación en columnas hace posible algún desfase y conviene revisarlo visualmente antes de fijarlo. Los precios de mercado (Very Expensive para Rango 1 / Luxury para el resto) se transcriben del encabezado de la tabla.",
    "Solo: el Core no limita los puntos por opción más allá de los escalones de costo; asignar a Rango 4 los 4 puntos a Initiative Reaction (+4) es válido (1 punto = +1). El Folio solo cubre Iniciativa.",
    "Tweaks 2070s: el RB p.25 solo nombra Fixer, Exec, Media, Rockerboy, Lawman, Nomad y Netrunner; Solo, Tech y Medtech no tienen ajuste (tweak2077 = []).",
    "Páginas: Core y RB con página impresa; Folios con página del PDF. El RB p.25 (ajuste de rol) corresponde al PDF 26.",
    "Media/Believability: el libro dice 'X de 10 de probabilidad' y 'se tira 1d10 según tu Believability' pero no explicita la comparación; se asume éxito con tirada <= Believability (+bonos), sin confirmar en texto. [Decidido por Giuliano, 2026-10-22: se cree con 1d10 <= Believability más bonos]",
    "Exec/Loyalty Save: el texto dice 'tirar 1d6 por debajo de la Loyalty actual'; no aclara si empatar cuenta como éxito (se registró literal 'por debajo'). [Decidido por Giuliano, 2026-10-22: el empate falla]",
    "Exec/Team Members: la extracción del PDF parte 'SP 11' como 'SP1 1' en Light Armorjack y Subdermal Armor; se interpretó SP 11 (coincide con Light Armorjack del Core). Lo mismo con HP 25/35 en Backup ('2 5', '3 5'): se leyeron 25 y 35.",
    "Exec/Company Netrunner: el Cyberdeck dice '7 slots' pero lista solo 6 programas (Sword, Sword, Killer, Worm, Worm, Armor); se transcribió tal cual sin completar el séptimo. [Decidido por Giuliano, 2026-10-22: no falta nada: Killer es Black ICE y ocupa 2 slots (Core p.204), así que los 6 programas llenan los 7]",
    "Exec/Company Netrunner: la lista de skills no trae nivel +6 (las demás tablas sí); se dejó sin +6.",
    "Exec: el Rango 4 no tiene beneficio en el Core RED (solo el ajuste 2070s de Expensive).",
    "Fixer/Haggle: 'puede hacer 1 trato de tu Rango de Operator o inferior' se interpretó como elegir un beneficio de Haggle desbloqueado en tu Rango o uno inferior; el libro no lo detalla más.",
    "Fixer/Reach: la progresión impresa no es monótona (R5-6 Night Market hasta Super Luxury una vez al mes; R7-8 Very Expensive; R9 Luxury; R10 Super Luxury pieza por pieza); se transcribió tal como figura. Las reglas del Night Market están en Core pág. 338 (fuera de este encargo).",
    "Fixer/Contacts & Clients R5-6: el libro dice 'neighborhood celebrity' (celebridad del barrio), mientras que Media usa 'local celebrity'; se conservó cada uno.",
    "Rockerboy: el libro no indica penalización por fallar la tirada de convertir gente en fans; solo la restricción de pedir el mismo favor durante una semana tras fallar un favor.",
    "Lawman: el Core no detalla el equipo individual de cada miembro más allá del resumen por grupo (armas, armadura, vehículo); no se inventó nada más. Rango 9 (C-SWAT) tiene SP 18 y Combat Number 15, y Rango 10 SP 11 y Combat Number 14, tal como figura.",
    "Folios: la hoja no imprime el Rango de Role Ability; la conversión Thorn -> Charismatic Impact 4 y Connect -> Operator 4 es decisión de Giuliano, no del libro. Las stats (Luck/HP/Death Save/umbral) del Folio se leyeron por orden de extracción y ya fueron validadas por fórmula en cemk-creation.json; Luck no tiene fórmula de comprobación.",
    "Folios: la armadura aparece abreviada como 'L Armorjack'; la capa oculta 'Kevlar 7/7 + Poor Shotgun + VH Pistol' se ignoró según indicación; el Carnage de Thorn (Poor Quality) viene tal cual de cemk-creation.json (startingAllocation se copia de ese archivo).",
    "Folios: Thorn tiene +2 en Acting, Play Instrument y Wardrobe & Style (cyberware/gear), distinto del +4 de Role Ability; el +4 social de Thorn NO está incluido en las bases de la ficha, el +4 de Trading de Connect SÍ.",
    "Páginas verificadas: RB p.25 (ajustes de rol) = PDF 26; RB p.26 (Expanded Availability) = PDF 27; Core pp.144-161 = PDF 145-162; Folios Thorn p.21 y Connect p.9 (páginas PDF)."
  ]
};
