// [Claude Code · 2026-11-06] v5.14.0 (plan 26): los 6 Night Markets de Black Chrome (pp.131-156) y Economics 101 (pp.125-130).
// Los textos en español son resúmenes propios; los números (DV, costos, Operator Rank) son los del libro.
// Generado desde scratchpad/bc_markets.json. Los ítems de cada puesto salen del campo `booth` del pack y de los vehículos.

export interface BlackChromeBooth {
  code: string;
  name: string;
  sellsEs: string;
  page: number;
}

export interface BlackChromeMarket {
  letter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  name: string;
  pages: [number, number];
  fixerName: string;
  location: string;
  frequency: string;
  access: string;
  security: string;
  vibeEs: string;
  specialRules: { name: string; summaryEs: string }[];
  booths: BlackChromeBooth[];
  /** Locales del mapa que no son puestos con código (D: restaurante, galería, subasta...). */
  otherStalls: string[];
}

/** Cómo se usan los mercados con el Night Market del Core (BC p.7). */
export const BC_MARKETS_HOW_TO = {
  "page": 7,
  "summaryEs": "El GM define primero los bienes del mercado con tabla aleatoria del libro base (CP:R p.338) o a gusto. Además, los objetos de Black Chrome con línea 'Pick-up or Browse at Booth X#' pueden aparecer: la letra indica el Night Market (A-F) y el número el puesto del mapa. Puede entregar el libro a los jugadores para hojearlo."
};

export const BLACK_CHROME_MARKETS: BlackChromeMarket[] = [
  {
    "letter": "A",
    "name": "3-Piece's Joint",
    "pages": [
      132,
      135
    ],
    "fixerName": "3-Piece",
    "location": "Último piso del nuevo bar Short Circuit, en Little Europe, al borde de la Hot Zone (edificio de tres pisos con ascensor).",
    "frequency": "Mensual, en fecha aleatoria (cuando tiene stock suficiente).",
    "access": "Solo por invitación: hay que ser cliente habitual de Short Circuit y que 3-Piece o su esposo Brain te conozcan o alguien de confianza te avale; en la práctica decide Bug (su hija), que detecta soplones y corpos encubiertos.",
    "security": "Drones Zhirafa operados por Netrunners del bar, cámaras vigiladas por Demons, cerraduras biométricas (3-Piece, Brain, Bug) en el tercer piso, paneles aturdidores y gas somnífero en el ascensor.",
    "vibeEs": "Un tesoro escondido y acogedor: un depósito de tecnología de segunda mano restaurada con cariño, con olor a comida casera y glam rock de los 70.",
    "specialRules": [
      {
        "name": "Otros Fixers",
        "summaryEs": "3-Piece no deja que otros Fixers monten puesto en su Joint, aunque podría aceptar piezas en comisión si Brain o Bug se lo piden."
      },
      {
        "name": "Calidad",
        "summaryEs": "Nada se vende incompleto ni roto salvo que el cliente lo pida así. Vende partes tech, cyberdecks, hardware de cyberdeck y programas. 3-Piece es Fixer con Operator 5 (ficha p.133)."
      }
    ],
    "booths": [
      {
        "code": "A1",
        "name": "Cyberfingers",
        "sellsEs": "Cyberdedos",
        "page": 134
      },
      {
        "code": "A2",
        "name": "Weapons",
        "sellsEs": "Armas",
        "page": 134
      },
      {
        "code": "A3",
        "name": "Electronics and Tech",
        "sellsEs": "Electrónica y tecnología",
        "page": 134
      },
      {
        "code": "A4",
        "name": "Fashion",
        "sellsEs": "Moda",
        "page": 134
      },
      {
        "code": "A5",
        "name": "Cyberware",
        "sellsEs": "Cyberware",
        "page": 134
      }
    ],
    "otherStalls": []
  },
  {
    "letter": "B",
    "name": "Woodchipper's Block Party",
    "pages": [
      136,
      139
    ],
    "fixerName": "Woodchipper",
    "location": "Una calle sin salida (cul-de-sac) en Santo Domingo, cerca del garaje de Woodchipper; siempre al aire libre.",
    "frequency": "Aproximadamente cada dos meses; depende de los movimientos de Jodes, Thelas y Aldecaldos y del clima (la lluvia de sangre lo arruina).",
    "access": "Ser Nómada en buenos términos con los Aldecaldos, Jodes o Thelas da invitación para ti y hasta 4 invitados; si no, hay que ganarla ayudando a esos grupos.",
    "security": "Lobos de los Aldecaldos: pocos entre la multitud, otros en azoteas, ventanas y patrullando en motos; los que escoltan a Woodchipper son para exhibir poder.",
    "vibeEs": "Una fiesta de barrio nómada con música, luces y banderines, famosa por su elote callejero; se oye a casi una milla.",
    "specialRules": [
      {
        "name": "Patrocinar el mercado",
        "summaryEs": "Los Fixers con Operator Rank 5 o más pueden patrocinar un mercado: reciben puesto, entrada para ti y tus amigos y trato directo con Woodchipper."
      },
      {
        "name": "Venta",
        "summaryEs": "Armas para todos los invitados y vehículos solo para Fixers invitados y vetados que patrocinan; además equipo de supervivencia, munición y cirugía de primer Internal Linear Frame. Woodchipper es Fixer Operator 5 y Nomad Moto 4 (ficha p.137)."
      }
    ],
    "booths": [
      {
        "code": "B1",
        "name": "Vehicles",
        "sellsEs": "Vehículos",
        "page": 138
      },
      {
        "code": "B2",
        "name": "Survival Gear",
        "sellsEs": "Equipo de supervivencia",
        "page": 138
      },
      {
        "code": "B3",
        "name": "Weapons",
        "sellsEs": "Armas",
        "page": 138
      },
      {
        "code": "B4",
        "name": "Fashion",
        "sellsEs": "Moda",
        "page": 138
      },
      {
        "code": "B5",
        "name": "Linear Frames",
        "sellsEs": "Linear frames",
        "page": 138
      },
      {
        "code": "B6",
        "name": "Cyberware",
        "sellsEs": "Cyberware",
        "page": 138
      },
      {
        "code": "B7",
        "name": "More Weapons",
        "sellsEs": "Más armas",
        "page": 138
      }
    ],
    "otherStalls": []
  },
  {
    "letter": "C",
    "name": "Molly Anderson's Market",
    "pages": [
      140,
      143
    ],
    "fixerName": "Molly Anderson",
    "location": "Aparcamiento subterráneo fortificado bajo un rascacielos derrumbado en la Old Combat Zone (al sur de Old Japantown), con una sola entrada/salida.",
    "frequency": "Mensual, según qué tan segura haya estado la Old Combat Zone (más muertes, más salvamento).",
    "access": "Hay que ganarla: todas las invitaciones pasan por Molly; que un Anderson te avale casi garantiza invitación. Ayuda tener reputación en la Old Combat Zone u Old Japantown; es común hacer un turno de guardia en un salvamento a cambio.",
    "security": "Gemelos Marco y Andy Anderson; torreta apuntando a la entrada y cacheo; los invitados no pueden llevar armas, solo los Anderson. Joe o Minnie siguen con Microwavers a quien parezca un arma.",
    "vibeEs": "Un mercado de salvamento y reciclaje de muertos en una cueva defendible; sobre todo cyberware y armas y armaduras de segunda mano, repintadas.",
    "specialRules": [
      {
        "name": "Otros Fixers",
        "summaryEs": "Molly permite vender a otros Fixers solo si tienen Operator Rank menor que el suyo (Molly es Operator 6) y han ganado su confianza; deben cumplir las reglas de seguridad."
      },
      {
        "name": "Sin armas",
        "summaryEs": "Solo los Anderson llevan armas dentro; a quien parezca peligroso se le asigna escolta armada involuntaria a la que conviene dar propina para volver a ser invitado."
      }
    ],
    "booths": [
      {
        "code": "C1",
        "name": "Music",
        "sellsEs": "Música",
        "page": 143
      },
      {
        "code": "C2",
        "name": "Security Gear",
        "sellsEs": "Equipo de seguridad",
        "page": 143
      },
      {
        "code": "C3",
        "name": "Cyberware",
        "sellsEs": "Cyberware",
        "page": 143
      },
      {
        "code": "C4",
        "name": "Weapons",
        "sellsEs": "Armas",
        "page": 143
      },
      {
        "code": "C5",
        "name": "Vehicles",
        "sellsEs": "Vehículos",
        "page": 143
      },
      {
        "code": "C6",
        "name": "Other Junk",
        "sellsEs": "Cosas variadas",
        "page": 143
      }
    ],
    "otherStalls": []
  },
  {
    "letter": "D",
    "name": "Mister K's Midnight Market",
    "pages": [
      144,
      147
    ],
    "fixerName": "Mister Kernaghan",
    "location": "Sobre el club Atlantis, en The Glen, repartido en dos pisos de bienes y servicios de lujo.",
    "frequency": "Trimestral, sin fechas fijas: él decide cuando tiene objetos de suficiente interés; solo una noche.",
    "access": "Cien invitaciones entregadas por mensajero a gente digna, interesante o rica; pueden venderse, regalarse o robarse. El portador puede llevar invitados, y los guardias de la puerta deciden el tamaño de la comitiva. Los sobornos no sirven.",
    "security": "Danger Gal, contratada, pone guardias armados uniformados en la entrada y la sala de subasta, y detectives encubiertos adentro que sacan a los indeseables.",
    "vibeEs": "Evento exclusivo y elegante con boutiques, restaurantes y servicios de lujo que culmina en una subasta de artículos únicos de 10,000eb o más.",
    "specialRules": [
      {
        "name": "Artículos de la subasta",
        "summaryEs": "Vende cosas Super Lujo de al menos 10,000eb (vehículos de gama alta, arte perdido, prototipos); el resto lo venden comerciantes de lujo que alquilan espacio."
      },
      {
        "name": "Otros Fixers",
        "summaryEs": "Solo trabaja con otros Fixers si tienen algo único para la subasta, algo raro salvo con Operator Rank 8 o más; alquila espacio a vendedores selectos a tarifa razonable."
      }
    ],
    "booths": [
      {
        "code": "D1",
        "name": "Fashion and Armor",
        "sellsEs": "Moda y armaduras",
        "page": 146
      },
      {
        "code": "D2",
        "name": "Weapons",
        "sellsEs": "Armas",
        "page": 146
      },
      {
        "code": "D3",
        "name": "Vehicles",
        "sellsEs": "Vehículos",
        "page": 146
      }
    ],
    "otherStalls": [
      "Angelo's (restaurant)",
      "Forever Friends (drone pets)",
      "Kimiko's (kimonos)",
      "The Birdcage (exotic dancing)",
      "Plein Air Gallery (art gallery)",
      "Mr. K's Suite",
      "Auction Storage",
      "Auction Hall",
      "Security Office"
    ]
  },
  {
    "letter": "E",
    "name": "Ms. Mynah's Night Market",
    "pages": [
      148,
      151
    ],
    "fixerName": "Ms. Mynah",
    "location": "Antiguo centro comercial Minimallism en Rancho Coronado, hoy llamado RC Night Market, compartido con jardines de los Reclaimers.",
    "frequency": "Un día al mes, siempre el día 5.",
    "access": "Solo por invitación: cada mes se envían 500 códigos de acceso por Zchat (app de Ziggurat) a clientes; se muestran a la entrada.",
    "security": "Edgerunners vetados y corteses de su lista de contactos, que rechazan a quien no tenga invitación; compuertas que aíslan el resto del centro para no molestar a los Reclaimers.",
    "vibeEs": "Ambiente cordial y bullicioso, como un bazar antiguo; enfocado en moda a medida y listos para usar, con comida y bebida para que la gente se quede.",
    "specialRules": [
      {
        "name": "Otros Fixers",
        "summaryEs": "Acepta Fixers de cualquier Operator Rank si los cree dignos y capaces de ofrecer una experiencia excepcional; hay que acercarse con paciencia, cortesía y regalos."
      },
      {
        "name": "Ropa a medida",
        "summaryEs": "Cabina de medidas automática, luego fabricación o ajuste de ropa; también prendas listas y recicladas. Ms. Mynah es Fixer Operator 6 (ficha p.149)."
      }
    ],
    "booths": [
      {
        "code": "E1",
        "name": "Fashion and Armor",
        "sellsEs": "Moda y armaduras",
        "page": 151
      },
      {
        "code": "E2",
        "name": "Weapons",
        "sellsEs": "Armas",
        "page": 151
      },
      {
        "code": "E3",
        "name": "Various Others",
        "sellsEs": "Varios otros",
        "page": 151
      }
    ],
    "otherStalls": []
  },
  {
    "letter": "F",
    "name": "Rex Royale's Casino",
    "pages": [
      152,
      155
    ],
    "fixerName": "Rex Royale",
    "location": "Sótano reformado de un edificio abandonado; cambia de sitio cada vez, preferiblemente al norte del límite entre Little China y Upper Marina (zona de One Block).",
    "frequency": "Aproximadamente una vez al mes; puede adelantarse si llega un gran cargamento.",
    "access": "Invitaciones elegidas a mano: cartas firmadas de una baraja marcada, solo 52 por mercado; cada asistente puede llevar uno o dos invitados (sin 'jokers').",
    "security": "Mercenarios de Rex, que usan las armas en venta; líder: el Solo Grant Jung, alias Royal.",
    "vibeEs": "Un casino al estilo Las Vegas, con humo, alfombra roja y mesas de juego convertidas en puestos; se exige traje o vestido de cóctel.",
    "specialRules": [
      {
        "name": "Otros Fixers",
        "summaryEs": "Admite Fixers con Operator Rank 4 o más para tener una mesa y vender; prefiere amigos de póker."
      },
      {
        "name": "Descuento por juego",
        "summaryEs": "Rumor: Rex da descuento si le ganas en un juego de azar, pero cobra en favores en vez de eb."
      }
    ],
    "booths": [
      {
        "code": "F1",
        "name": "Cyberware",
        "sellsEs": "Cyberware",
        "page": 154
      },
      {
        "code": "F2",
        "name": "Longarms",
        "sellsEs": "Armas largas",
        "page": 154
      },
      {
        "code": "F3",
        "name": "Armor",
        "sellsEs": "Armaduras",
        "page": 154
      },
      {
        "code": "F4",
        "name": "Other Gear",
        "sellsEs": "Otro equipo",
        "page": 154
      },
      {
        "code": "F5",
        "name": "Handguns",
        "sellsEs": "Pistolas",
        "page": 154
      }
    ],
    "otherStalls": []
  }
];

export interface FindFixerRow { cost: string; dv: number; note: string }

/** Economics 101 (BC pp.125-130): Find a Fixer/Tech, cómo trabaja el Fixer y Lifestyles in Detail. */
export const ECONOMICS_101 = {
  "findFixerTech": {
    "page": 129,
    "rows": [
      {
        "cost": "500eb (Expensive)",
        "dv": 15,
        "note": ""
      },
      {
        "cost": "1,000eb (V Expensive)",
        "dv": 17,
        "note": ""
      },
      {
        "cost": "5,000eb (Luxury)",
        "dv": 21,
        "note": ""
      },
      {
        "cost": "10,000eb+ (Super Luxury)",
        "dv": 24,
        "note": "Los DV son guías; el GM decide si el objeto encaja en la campaña y si es fácil de conseguir, un punto de trama o una misión propia."
      }
    ],
    "summaryEs": "Tabla 'Find a Fixer/Tech to Get/Build an Item': tirada de Streetwise contra el DV según el costo del objeto (15, 17, 21, 24). En el ejemplo, un no-Fixer solo accede a objetos de 100eb o menos; con DV17 de Streetwise (para un objeto de 1,000eb) los personajes consiguen contacto con un Fixer. Conocer ya a un Fixer por el Lifepath o misiones es válido y el GM decide si puede conseguirlo."
  },
  "otherRules": [
    {
      "name": "How It Is Now",
      "page": 126,
      "summaryEs": "Tras la Cuarta Guerra Corporativa y el DataKrash no basta con tener dinero: hace falta un contacto con acceso, normalmente un Fixer. Ejemplo: ModFire 10X de 1,000eb inaccesible para un no-Fixer (solo ≤100eb); pasan Streetwise DV17."
    },
    {
      "name": "The Supply Chain / Haggle y comisión",
      "page": 126,
      "summaryEs": "El Fixer usa Operator: COOL + Trading + Operator Rank + 1d10 contra COOL + Trading + 1d10 del cliente (con ayuda complementaria). Gana y cobra Haggle +10% (1,100eb, ver CP:R p.159) más 100eb de 'tarifa'. Facedown es COOL + Reputation + 1d10 opuesto. Pago siempre por adelantado; entrega en aprox. un mes."
    },
    {
      "name": "How Your Fixer Finds It",
      "page": 126,
      "summaryEs": "El Fixer llama a su red (Netrunners, Edgerunners, empleados corporativos sobornables). Con Operator Rank 7 puede conseguir objetos hasta Very Expensive aunque no estén disponibles; se reúne con el contacto al día siguiente. Un Fixer ya conocido puede o no tener tiempo, a criterio del GM."
    },
    {
      "name": "How Your Fixer Acquires It",
      "page": 127,
      "summaryEs": "Negocia con otro dueño o Fixer, soborna a un trabajador o contrata un equipo; se paga todo. Ejemplo: caja de 6 ModFire 10X comprada al precio de 5 con otro Haggle; revisa rastreadores con Conceal/Reveal Object; ganancia mínima 1,200eb (200eb del cliente + 1,000eb del 6º arma), hasta 1,700eb si cobra otro 10% por cada arma."
    },
    {
      "name": "How Your Fixer Gets It To You",
      "page": 127,
      "summaryEs": "El Fixer reserva espacio de carga en un transporte Nómada: Aldecaldos (norte, este, México), Jodes (Sudamérica), Thelas (Pacífico), a veces Meta, o Nómadas sin familia (Snake Nation). Ejemplo: reserva espacio de Portland a Night City para dentro de un mes."
    },
    {
      "name": "Why Your Fixer Does It / Fixers como personas",
      "page": 127,
      "summaryEs": "El Fixer gana contactos, confianza y reputación y financia el viaje con otros artículos. Cualquier Fixer puede conseguir cualquier objeto, pero suelen especializarse; el GM puede aprovechar su personalidad. Quizá invite al cliente a su Night Market."
    },
    {
      "name": "Who Made Your Thing",
      "page": 127,
      "summaryEs": "Salvo equipo de preguerra, raro o de fábrica local, lo hizo un Tech desconocido; la reputación del Tech es la del Fixer. Ejemplo: MatchSchtik es un Tech amigo que puede imprimir un ModFire 10X desde cero."
    },
    {
      "name": "Who Else Do Techs Work For?",
      "page": 128,
      "summaryEs": "Los Techs no viven de un solo cliente: trabajan para Fixers, Execs y particulares. Comprarles directo da la relación en vez del Fixer. Ejemplo: Fabricate con la habilidad Maker tarda 2 semanas, requiere 500eb (Expensive) en materiales y un favor; puede fallar y tardar más."
    },
    {
      "name": "But I Want The One In The Advertisement",
      "page": 128,
      "summaryEs": "La publicidad corporativa no es para los PJ; mejor no comprar marcas. Ejemplo: Media (CP:R p.151) halla rumor de un envío de materiales poco defendido; el GM puede convertir la compra en una aventura."
    },
    {
      "name": "What About The Megacorps?",
      "page": 128,
      "summaryEs": "Las megacorps concentran la riqueza y producen cientos o miles de unidades en vez de cientos de miles; los lanzamientos se agotan porque los Fixers (hasta ocho compitiendo) sobornan para comprar primero. Mejor pedirle el objeto a un Tech."
    },
    {
      "name": "How Did It Get This Bad Anyway? / Why Didn't We All Die? / How Did The Nomads Do It?",
      "page": 128,
      "summaryEs": "Contexto narrativo: el DataKrash y la Cuarta Guerra Corporativa rompieron el suministro; los Nómadas, que operaban los transportes, reconectaron la ciudad con comida y ahora trabajan para sí mismos. Ejemplo final: emboscada en el desierto, Fabricate del ModFire y pérdida de 1d6 de Humanidad por Trauma Mental tras fallar el First Aid."
    }
  ],
  "lifestyles": {
    "page": 130,
    "rows": [
      {
        "name": "Kibble",
        "cost": "100eb per month",
        "detailEs": "Dos comidas de Kibble al día; cuenta de Agent (Data Pool, llamadas, textos); entretenimiento de 20eb (Everyday) una vez al mes; pase de transporte público y un taxi al mes entre zonas con Threat Level Moderate, Corporate o Executive."
      },
      {
        "name": "Generic Prepak",
        "cost": "300eb per month",
        "detailEs": "Una comida de Kibble y dos de Generic Prepak al día; mensaje de texto a otra ciudad una vez por semana; entretenimiento de 20eb semanal; taxi semanal limitado a zonas Moderate, Corporate o Executive."
      },
      {
        "name": "Good Prepak",
        "cost": "600eb per month",
        "detailEs": "Una comida Generic Prepak y dos Good Prepak al día; texto a otra ciudad diario y llamada de voz de 10 minutos semanal; entretenimiento de 20eb diario y de 100eb (Premium) mensual; taxi diario limitado y alquiler mensual de un groundcar compacto por 24 horas (CP:R p.190)."
      },
      {
        "name": "Fresh Food",
        "cost": "1,500eb per month",
        "detailEs": "Una comida Good Prepak y dos de Fresh Food al día; textos ilimitados, llamada de voz de 10 min diaria y videollamada de 10 min semanal; entretenimiento de 50eb (Costly) diario, 100eb semanal y 500eb (Expensive) mensual; taxi diario a cualquier zona y groundcar compacto semanal por 24 horas."
      }
    ],
    "summaryEs": "El costo mensual de cada estilo de vida cubre comida, comunicación, entretenimiento y transporte sin gastar más; los beneficios suman más que el costo por compras al por mayor, contratos y descuentos de clase. Lo que exceda va del bolsillo del PJ. Alquilar y dañar un vehículo puede impedir futuros alquileres."
  }
};
