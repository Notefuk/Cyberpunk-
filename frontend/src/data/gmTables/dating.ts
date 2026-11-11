// Generado por scripts/gen_gm_tables.py [Claude Code · 2026-11-11] v5.19.0 (plan 27). No editar a mano: editar el JSON de docs/plans/work/plan27-v5.19.0/ y volver a generar.
// Los textos en español son resúmenes propios; nombres y números como en el libro.
import type { GmTable } from './types';

export const DATING_INTRO = "El Datepath es un sistema para jugar primeras citas en Night City: sirve de prompt de rol y de generador de NPC menores. Se usa como actividad de downtime o entre sesiones, y le da a los personajes contactos nuevos (o una cita desastrosa) y ganchos de aventura para el GM.";

export const DATING_STEPS: string[] = [
  "Paso 1: tirar 1d100 dos veces en la tabla Keywords para las dos palabras clave del perfil del match; ponerle un nombre de pila",
  "Paso 2: tirar par/impar y luego 1d10 en Where is Your Date? para la zona de la cita",
  "Paso 3: tirar 1d6 en la tabla de esa zona para saber qué cita es",
  "Paso 4: tirar 1d10 en How Does Your Date Go?: 1-4 cita buena, 5-8 cita rara, 9-10 plantón",
  "Paso 5: cita buena: 1d6 en Good Date Beginning, Middle y End; luego par/impar para One... Weird... Thing, y si sale impar 1d10",
  "Paso 6: cita rara: 1d6 en Weird Date Beginning, Middle y End, y pasar a la reseña posterior",
  "Paso 7: reseña post-cita: par/impar para ver si quieren otra cita; si es par, 1d10 en Aftermath (1-8 te vuelven a contactar, 9-10 te ghostean)"
];

export const DATING_TABLES: GmTable[] = [
  {
    "id": "keywords",
    "title": "Keywords",
    "die": "1d100",
    "rows": [
      {
        "roll": "1-2",
        "text": "Adorable"
      },
      {
        "roll": "3-4",
        "text": "Adventurous"
      },
      {
        "roll": "5-6",
        "text": "Affectionate"
      },
      {
        "roll": "7-8",
        "text": "Ambitious"
      },
      {
        "roll": "9-10",
        "text": "Athlete"
      },
      {
        "roll": "11-12",
        "text": "Baking"
      },
      {
        "roll": "13-14",
        "text": "Brave"
      },
      {
        "roll": "15-16",
        "text": "Caring"
      },
      {
        "roll": "17-18",
        "text": "Charming"
      },
      {
        "roll": "19-20",
        "text": "Cooking"
      },
      {
        "roll": "21-22",
        "text": "Courageous"
      },
      {
        "roll": "23-24",
        "text": "Creative"
      },
      {
        "roll": "25-26",
        "text": "Drinking"
      },
      {
        "roll": "27-28",
        "text": "Elflines Online"
      },
      {
        "roll": "29-30",
        "text": "Exec"
      },
      {
        "roll": "31-32",
        "text": "Fishing"
      },
      {
        "roll": "33-34",
        "text": "Fixer"
      },
      {
        "roll": "35-36",
        "text": "Foodie"
      },
      {
        "roll": "37-38",
        "text": "Funny"
      },
      {
        "roll": "39-40",
        "text": "Gardening"
      },
      {
        "roll": "41-42",
        "text": "Hard Working"
      },
      {
        "roll": "43-44",
        "text": "Hiking"
      },
      {
        "roll": "45-46",
        "text": "Hopeful"
      },
      {
        "roll": "47-48",
        "text": "Hunting"
      },
      {
        "roll": "49-50",
        "text": "Independent"
      },
      {
        "roll": "51-52",
        "text": "Insightful"
      },
      {
        "roll": "53-54",
        "text": "Intelligent"
      },
      {
        "roll": "55-56",
        "text": "Lawman"
      },
      {
        "roll": "57-58",
        "text": "Loving"
      },
      {
        "roll": "59-60",
        "text": "Loyal"
      },
      {
        "roll": "61-62",
        "text": "Media"
      },
      {
        "roll": "63-64",
        "text": "Medtech"
      },
      {
        "roll": "65-66",
        "text": "Modest"
      },
      {
        "roll": "67-68",
        "text": "Netrunner"
      },
      {
        "roll": "69-70",
        "text": "Nomad"
      },
      {
        "roll": "71-72",
        "text": "Optimistic"
      },
      {
        "roll": "73-74",
        "text": "Passionate"
      },
      {
        "roll": "75-76",
        "text": "Patient"
      },
      {
        "roll": "77-78",
        "text": "Physically Fit"
      },
      {
        "roll": "79-80",
        "text": "Quiet"
      },
      {
        "roll": "81-82",
        "text": "Rational"
      },
      {
        "roll": "83-84",
        "text": "Respectful"
      },
      {
        "roll": "85-86",
        "text": "Rockerboy"
      },
      {
        "roll": "87-88",
        "text": "Running"
      },
      {
        "roll": "89-90",
        "text": "Solo"
      },
      {
        "roll": "91-92",
        "text": "Spontaneous"
      },
      {
        "roll": "93-94",
        "text": "Sports"
      },
      {
        "roll": "95-96",
        "text": "Tabletop RPGs"
      },
      {
        "roll": "97-98",
        "text": "Tech"
      },
      {
        "roll": "99-100",
        "text": "Virtuous"
      }
    ],
    "source": "Digital Dating in the Dark Future p.3"
  },
  {
    "id": "where-is-your-date-evens",
    "title": "Where is Your Date? (Evens)",
    "die": "1d10",
    "rows": [
      {
        "roll": "1",
        "text": "Norcal Military Base"
      },
      {
        "roll": "2",
        "text": "Watson Development"
      },
      {
        "roll": "3",
        "text": "New Westbrook"
      },
      {
        "roll": "4",
        "text": "Morro Rock"
      },
      {
        "roll": "5",
        "text": "Executive Zone"
      },
      {
        "roll": "6",
        "text": "Heywood Industrial Zone"
      },
      {
        "roll": "7",
        "text": "Heywood (Santo Domingo)"
      },
      {
        "roll": "8",
        "text": "Rancho Coronado"
      },
      {
        "roll": "9",
        "text": "Outskirts"
      },
      {
        "roll": "10",
        "text": "Reclaimed Perimeter"
      }
    ],
    "source": "Digital Dating in the Dark Future p.4"
  },
  {
    "id": "where-is-your-date-odds",
    "title": "Where is Your Date? (Odds)",
    "die": "1d10",
    "rows": [
      {
        "roll": "1",
        "text": "Little Europe"
      },
      {
        "roll": "2",
        "text": "Upper Marina"
      },
      {
        "roll": "3",
        "text": "University District"
      },
      {
        "roll": "4",
        "text": "Little China"
      },
      {
        "roll": "5",
        "text": "Old Japantown"
      },
      {
        "roll": "6",
        "text": "The Glen"
      },
      {
        "roll": "7",
        "text": "Old Combat Zone"
      },
      {
        "roll": "8",
        "text": "South Night City"
      },
      {
        "roll": "9",
        "text": "Hot Zone"
      },
      {
        "roll": "10",
        "text": "Pacifica Playground"
      }
    ],
    "source": "Digital Dating in the Dark Future p.4"
  },
  {
    "id": "norcal-military-base-date",
    "title": "NorCal Military Base Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Practicar tiro en el polígono para bajar los nervios."
      },
      {
        "roll": "2",
        "text": "Un curso de cuerdas (rope course)."
      },
      {
        "roll": "3",
        "text": "Comer en la base, donde la comida es bastante buena."
      },
      {
        "roll": "4",
        "text": "Mirar juntos un ejercicio de entrenamiento en vivo."
      },
      {
        "roll": "5",
        "text": "Ir al cine del teatro de la base."
      },
      {
        "roll": "6",
        "text": "Una partida de paintball salvajísima."
      }
    ],
    "source": "Digital Dating in the Dark Future p.4"
  },
  {
    "id": "watson-development-date",
    "title": "Watson Development Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Fiesta en el lobby sin terminar de una megaestructura en obra."
      },
      {
        "roll": "2",
        "text": "Museo del Petróleo de SovOil."
      },
      {
        "roll": "3",
        "text": "Picnic corporativo en un parque cerca de Watson Central Cubelife."
      },
      {
        "roll": "4",
        "text": "Cita en un izakaya del distrito Kabuki."
      },
      {
        "roll": "5",
        "text": "Sorpresa: te esperan en la entrada Watson del monorriel de alta seguridad."
      },
      {
        "roll": "6",
        "text": "Manifestación del rockerboy local Lucius Rhyne."
      }
    ],
    "source": "Digital Dating in the Dark Future p.5"
  },
  {
    "id": "new-westbrook-date",
    "title": "New Westbrook Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Ser público en vivo de un show de Network 54."
      },
      {
        "roll": "2",
        "text": "Carrera de Skate Foot cerca de la Firestation #1."
      },
      {
        "roll": "3",
        "text": "Gala de Rocklin Augmentics en su campus."
      },
      {
        "roll": "4",
        "text": "Escalada en el acantilado bajo las oficinas de WorldSat."
      },
      {
        "roll": "5",
        "text": "Cazar un food truck esquivo de la zona."
      },
      {
        "roll": "6",
        "text": "Tomar algo en un Executive Bar."
      }
    ],
    "source": "Digital Dating in the Dark Future p.5"
  },
  {
    "id": "morro-rock-date",
    "title": "Morro Rock Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Ver una prueba de las puertas de acero del Orbital Massdriver."
      },
      {
        "roll": "2",
        "text": "El lugar perfecto para ver fuegos artificiales."
      },
      {
        "roll": "3",
        "text": "Almuerzo en la cafetería de empleados del Orbital Air Massdriver."
      },
      {
        "roll": "4",
        "text": "Dicen tener un bote amarrado en Morro Rock."
      },
      {
        "roll": "5",
        "text": "Cita doble con alguien de su Family."
      },
      {
        "roll": "6",
        "text": "Primera fila en una pelea clandestina en la obra del Massdriver."
      }
    ],
    "source": "Digital Dating in the Dark Future p.5"
  },
  {
    "id": "executive-zone-date",
    "title": "Executive Zone Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Golf."
      },
      {
        "roll": "2",
        "text": "Una ronda de tenis en cancha de pasto orgánico real."
      },
      {
        "roll": "3",
        "text": "Brunch en el lugar favorito de la cita."
      },
      {
        "roll": "4",
        "text": "Fiesta en la pileta de una mansión de Beaverville."
      },
      {
        "roll": "5",
        "text": "Tragos en el lounge de negocios del Country Club."
      },
      {
        "roll": "6",
        "text": "Fiesta de máscaras en la mansión de un Exec recién fallecido."
      }
    ],
    "source": "Digital Dating in the Dark Future p.6"
  },
  {
    "id": "heywood-industrial-zone-date",
    "title": "Heywood Industrial Zone Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Te muestran su última obra de arte urbano."
      },
      {
        "roll": "2",
        "text": "Laser tag en el Zhirafa Office Park."
      },
      {
        "roll": "3",
        "text": "Un speakeasy hecho soldando contenedores de carga."
      },
      {
        "roll": "4",
        "text": "Concierto de música industrial en zona industrial."
      },
      {
        "roll": "5",
        "text": "Un teriyaki muy bueno donde siempre comen."
      },
      {
        "roll": "6",
        "text": "Peleas de drones, pobres GRAF3s."
      }
    ],
    "source": "Digital Dating in the Dark Future p.6"
  },
  {
    "id": "heywood-santo-domingo-date",
    "title": "Heywood (Santo Domingo) Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Se viene un festival callejero y todos van."
      },
      {
        "roll": "2",
        "text": "Emborracharse con Smash en Metalstorm."
      },
      {
        "roll": "3",
        "text": "Los Aldecaldos hacen un asado."
      },
      {
        "roll": "4",
        "text": "Carrera de Roadbikes."
      },
      {
        "roll": "5",
        "text": "El mole poblano de la abuela."
      },
      {
        "roll": "6",
        "text": "Fiesta esta noche en East Cargo Village."
      }
    ],
    "source": "Digital Dating in the Dark Future p.6"
  },
  {
    "id": "rancho-coronado-date",
    "title": "Rancho Coronado Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Desayuno en una casa de panqueques."
      },
      {
        "roll": "2",
        "text": "Encuentro en el parque con su perro (totalmente real)."
      },
      {
        "roll": "3",
        "text": "Un trago en su pub de barrio."
      },
      {
        "roll": "4",
        "text": "Manicura y pedicura en el mercado del barrio."
      },
      {
        "roll": "5",
        "text": "Una sesión de rol en vivo (LARP)."
      },
      {
        "roll": "6",
        "text": "Asar salchichas en un cookout de la empresa."
      }
    ],
    "source": "Digital Dating in the Dark Future p.7"
  },
  {
    "id": "outskirts-date",
    "title": "Outskirts Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Una caminata."
      },
      {
        "roll": "2",
        "text": "Su Family les prestó un girocóptero."
      },
      {
        "roll": "3",
        "text": "Buscar hongos, prometen que es divertido."
      },
      {
        "roll": "4",
        "text": "Probar tiro con arco."
      },
      {
        "roll": "5",
        "text": "Off-road por las tierras baldías."
      },
      {
        "roll": "6",
        "text": "Dicen saber dónde hay una cascada secreta."
      }
    ],
    "source": "Digital Dating in the Dark Future p.7"
  },
  {
    "id": "reclaimed-perimeter-date",
    "title": "Reclaimed Perimeter Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Bowling en un edificio abandonado."
      },
      {
        "roll": "2",
        "text": "Espeleología urbana."
      },
      {
        "roll": "3",
        "text": "Reunión con unos amigos de la cita."
      },
      {
        "roll": "4",
        "text": "Disparar fuegos artificiales viejos a autos abandonados."
      },
      {
        "roll": "5",
        "text": "Tacos en el camión de un amigo."
      },
      {
        "roll": "6",
        "text": "Encuentro en el diner de toda la noche."
      }
    ],
    "source": "Digital Dating in the Dark Future p.7"
  },
  {
    "id": "little-europe-date",
    "title": "Little Europe Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Clase de Cooking with Kibble en el Oasis Megamart."
      },
      {
        "roll": "2",
        "text": "Rezar juntos en la iglesia Holy Angels."
      },
      {
        "roll": "3",
        "text": "Noche salvaje en el Short Circuit."
      },
      {
        "roll": "4",
        "text": "Carreras de karts rosa en las oficinas de Danger Gal."
      },
      {
        "roll": "5",
        "text": "Una hermosa cena italiana."
      },
      {
        "roll": "6",
        "text": "Copa de vino viendo la ciudad desde la azotea de Camden Court."
      }
    ],
    "source": "Digital Dating in the Dark Future p.8"
  },
  {
    "id": "upper-marina-date",
    "title": "Upper Marina Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Partido en el estadio McCartney Field."
      },
      {
        "roll": "2",
        "text": "Alquilar un jetski y recorrer la bahía."
      },
      {
        "roll": "3",
        "text": "Conferencia de prensa o desfile de moda de Ziggurat."
      },
      {
        "roll": "4",
        "text": "Pedir un Johnny Silverhand en el Afterlife."
      },
      {
        "roll": "5",
        "text": "Día de turistas en el tranvía (no se romperá, probablemente)."
      },
      {
        "roll": "6",
        "text": "Ir a pescar."
      }
    ],
    "source": "Digital Dating in the Dark Future p.8"
  },
  {
    "id": "university-district-date",
    "title": "University District Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Fiesta salvaje fuera del campus, en el University Cargo Bay."
      },
      {
        "roll": "2",
        "text": "Paseo por la naturaleza en Lake Park."
      },
      {
        "roll": "3",
        "text": "Recorrer el museo vivo de Biotechnica en su greendome público."
      },
      {
        "roll": "4",
        "text": "La cita quiere mostrarte su nuevo proyecto de investigación."
      },
      {
        "roll": "5",
        "text": "Concurso grupal de comer: plato Mega Kibbledog por remeras."
      },
      {
        "roll": "6",
        "text": "Concierto del departamento de música en el campus."
      }
    ],
    "source": "Digital Dating in the Dark Future p.8"
  },
  {
    "id": "little-china-date",
    "title": "Little China Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Un trago en el Forlorn Hope."
      },
      {
        "roll": "2",
        "text": "Mirar vidrieras y comer comida callejera."
      },
      {
        "roll": "3",
        "text": "Masajes juntos."
      },
      {
        "roll": "4",
        "text": "Ir a comprar ropa de segunda mano."
      },
      {
        "roll": "5",
        "text": "Domingo a la mañana: dim sum."
      },
      {
        "roll": "6",
        "text": "Ir juntos a un mercado nocturno."
      }
    ],
    "source": "Digital Dating in the Dark Future p.9"
  },
  {
    "id": "old-japantown-date",
    "title": "Old Japantown Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Picnic con vista a la Hot Zone."
      },
      {
        "roll": "2",
        "text": "Sushi de cinta transportadora (entre comillas)."
      },
      {
        "roll": "3",
        "text": "Karaoke en un edificio todo de concreto, gran acústica."
      },
      {
        "roll": "4",
        "text": "La cita quiere presentarte a su mejor amigo."
      },
      {
        "roll": "5",
        "text": "Un gran desfile con mucho ambiente."
      },
      {
        "roll": "6",
        "text": "El padre de la cita quiere conocerte."
      }
    ],
    "source": "Digital Dating in the Dark Future p.9"
  },
  {
    "id": "the-glen-date",
    "title": "The Glen Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Ir de club al Club Atlantis."
      },
      {
        "roll": "2",
        "text": "Tour guiado por el City Hall."
      },
      {
        "roll": "3",
        "text": "Happy hour en un Excellent Bar."
      },
      {
        "roll": "4",
        "text": "Conseguir pan fresco en una panadería local, todo real."
      },
      {
        "roll": "5",
        "text": "Una recaudación de fondos política."
      },
      {
        "roll": "6",
        "text": "Una noche de ópera."
      }
    ],
    "source": "Digital Dating in the Dark Future p.9"
  },
  {
    "id": "old-combat-zone-date",
    "title": "Old Combat Zone Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "El Jessie James Kosher Deli vale el riesgo."
      },
      {
        "roll": "2",
        "text": "Subir a una azotea abandonada para ver el paisaje."
      },
      {
        "roll": "3",
        "text": "Disparar lanzagranadas a montones de escombros, románticamente."
      },
      {
        "roll": "4",
        "text": "Cita de grafiti con tus propios aerosoles."
      },
      {
        "roll": "5",
        "text": "Ayudar a desmalezar la huerta en la azotea de la cita."
      },
      {
        "roll": "6",
        "text": "Pasar el rato en un shopping abandonado."
      }
    ],
    "source": "Digital Dating in the Dark Future p.10"
  },
  {
    "id": "south-night-city-date",
    "title": "South Night City Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Almorzar después del turno de tatuaje de la cita."
      },
      {
        "roll": "2",
        "text": "Tomar sol en la playa."
      },
      {
        "roll": "3",
        "text": "Colarse en Playland by the Sea en bote."
      },
      {
        "roll": "4",
        "text": "La cita te quiere presentar a toda la pandilla."
      },
      {
        "roll": "5",
        "text": "Un trago en un bar bullicioso de Sea Nomads."
      },
      {
        "roll": "6",
        "text": "Música en vivo en un gimnasio abandonado."
      }
    ],
    "source": "Digital Dating in the Dark Future p.10"
  },
  {
    "id": "hot-zone-date",
    "title": "Hot Zone Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Tour histórico por las ruinas."
      },
      {
        "roll": "2",
        "text": "Una noche salvaje en el Totentanz."
      },
      {
        "roll": "3",
        "text": "Meterse a un viejo edificio corporativo."
      },
      {
        "roll": "4",
        "text": "Ayudar a rescatar una pieza de tecnología clásica."
      },
      {
        "roll": "5",
        "text": "Carrera callejera levemente radiactiva."
      },
      {
        "roll": "6",
        "text": "Cenar MREs vencidos bajo el hermoso cielo rojo."
      }
    ],
    "source": "Digital Dating in the Dark Future p.10"
  },
  {
    "id": "pacifica-playground-date",
    "title": "Pacifica Playground Date",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "La cita quiere compartir su braindance favorito."
      },
      {
        "roll": "2",
        "text": "Picnic en el estacionamiento de Playland by the Sea."
      },
      {
        "roll": "3",
        "text": "Tour tras bambalinas de la sala Holostravaganza de Playland."
      },
      {
        "roll": "4",
        "text": "Cazar conchas (y casquillos) en la playa."
      },
      {
        "roll": "5",
        "text": "Juegos y el Kibble Pineapple Madness de Playland."
      },
      {
        "roll": "6",
        "text": "Picadas (drag racing) en el muelle."
      }
    ],
    "source": "Digital Dating in the Dark Future p.11"
  },
  {
    "id": "how-does-your-date-go",
    "title": "How Does Your Date Go?",
    "die": "1d10",
    "rows": [
      {
        "roll": "1-4",
        "text": "Cita buena: ir a Good Date Beginning."
      },
      {
        "roll": "5-8",
        "text": "Cita rara: ir a Weird Date Beginning."
      },
      {
        "roll": "9-10",
        "text": "Ghosteado: no aparece y nunca sabés por qué; reiniciar o dejar de salir un tiempo."
      }
    ],
    "source": "Digital Dating in the Dark Future p.11"
  },
  {
    "id": "good-date-beginning",
    "title": "Good Date: Beginning",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Aprendés algo nuevo: tirar en Keywords hasta tener una palabra clave nueva."
      },
      {
        "roll": "2",
        "text": "Cuenta de un amigo: tirar en Your Friends (CP:R p.51)."
      },
      {
        "roll": "3",
        "text": "Cuenta su trabajo de Edgerunner: usar el Lifepath del Role (CP:R p.53)."
      },
      {
        "roll": "4",
        "text": "Descubrís de inmediato algo en común."
      },
      {
        "roll": "5",
        "text": "Tiene un rasgo positivo a elección que no se veía en el perfil."
      },
      {
        "roll": "6",
        "text": "Es muy atractivo/a, posiblemente con bodysculpt."
      }
    ],
    "source": "Digital Dating in the Dark Future p.11"
  },
  {
    "id": "good-date-middle",
    "title": "Good Date: Middle",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Aprendés algo nuevo: tirar en Keywords hasta tener una palabra clave nueva."
      },
      {
        "roll": "2",
        "text": "Se queja de un enemigo: tirar en Your Enemies (CP:R p.51)."
      },
      {
        "roll": "3",
        "text": "Cuenta una relación previa: 1d10, par terminó bien, impar tirar en Tragic Love Affairs (CP:R p.52)."
      },
      {
        "roll": "4",
        "text": "Conocés su familia: tirar en Original Family Background (CP:R p.49)."
      },
      {
        "roll": "5",
        "text": "Te sorprende con un regalo de 20eb (Everyday) a elección del GM."
      },
      {
        "roll": "6",
        "text": "Se queda callado/a escuchándote hablar toda la cita."
      }
    ],
    "source": "Digital Dating in the Dark Future p.12"
  },
  {
    "id": "good-date-end",
    "title": "Good Date: End",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Te confía su meta de vida: tirar en Your Life Goal (CP:R p.53)."
      },
      {
        "roll": "2",
        "text": "Te da un consejo útil a elección del GM."
      },
      {
        "roll": "3",
        "text": "Conocés sus valores: tirar en Motivations and Relationships (CP:R p.48)."
      },
      {
        "roll": "4",
        "text": "Está muy interesado/a y quiere otra cita; saltear Another Date? y Aftermath."
      },
      {
        "roll": "5",
        "text": "Un gran talento (elige el GM): Base 16 en la Skill correspondiente."
      },
      {
        "roll": "6",
        "text": "La cita terminó demasiado pronto para aprender más."
      }
    ],
    "source": "Digital Dating in the Dark Future p.12"
  },
  {
    "id": "good-date-one-weird-thing",
    "title": "Good Date: One... Weird... Thing",
    "die": "1d10",
    "rows": [
      {
        "roll": "1",
        "text": "Comió de una forma extraña."
      },
      {
        "roll": "2",
        "text": "Su padre o madre lo llamó dos veces durante la cita."
      },
      {
        "roll": "3",
        "text": "Habló de su ex. Mucho."
      },
      {
        "roll": "4",
        "text": "Ropa muy manchada y no le importó."
      },
      {
        "roll": "5",
        "text": "Su Agent sonó varias veces durante la cita."
      },
      {
        "roll": "6",
        "text": "No dejó propina."
      },
      {
        "roll": "7",
        "text": "Mintió sobre un dato que aprendiste (elegís cuál)."
      },
      {
        "roll": "8",
        "text": "Llegó media hora tarde."
      },
      {
        "roll": "9",
        "text": "Te confundió con otra persona al principio."
      },
      {
        "roll": "10",
        "text": "Se estaba recuperando de un balazo durante la cita."
      }
    ],
    "source": "Digital Dating in the Dark Future p.13"
  },
  {
    "id": "weird-date-beginning",
    "title": "Weird Date: Beginning",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Cuenta tres romances trágicos recientes: tirar tres veces en Tragic Love Affairs (CP:R p.52)."
      },
      {
        "roll": "2",
        "text": "No es la persona de las fotos del perfil."
      },
      {
        "roll": "3",
        "text": "Trajo un amigo: tirar en Your Friends (CP:R p.51)."
      },
      {
        "roll": "4",
        "text": "Lleva algo muy extraño, incluso para Night City."
      },
      {
        "roll": "5",
        "text": "Afiliación a pandilla a elección del GM y viene con colores de gang."
      },
      {
        "roll": "6",
        "text": "Mucha cibernética, una cantidad peligrosa; quizás echa chispas."
      }
    ],
    "source": "Digital Dating in the Dark Future p.13"
  },
  {
    "id": "weird-date-middle",
    "title": "Weird Date: Middle",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Va al baño y no vuelve; empezar con otra cita o dejar de salir un tiempo."
      },
      {
        "roll": "2",
        "text": "Arma una pelea y la termina rápido: Base 16 en Skill de combate a elección del GM."
      },
      {
        "roll": "3",
        "text": "No aprendés nada: pasó la cita al teléfono con su Agent."
      },
      {
        "roll": "4",
        "text": "Le gusta mucho el Smash, quizás también la Synthcoke."
      },
      {
        "roll": "5",
        "text": "Cuenta tres enemigos odiados: tirar tres veces en Your Enemies (CP:R p.51)."
      },
      {
        "roll": "6",
        "text": "Habla de su familia todo el tiempo: tirar en Family Background (CP:R p.49) y Family Crisis (CP:R p.50)."
      }
    ],
    "source": "Digital Dating in the Dark Future p.14"
  },
  {
    "id": "weird-date-end",
    "title": "Weird Date: End",
    "die": "1d6",
    "rows": [
      {
        "roll": "1",
        "text": "Está muy interesado/a y quiere otra cita; saltear Another Date? y Aftermath."
      },
      {
        "roll": "2",
        "text": "Conocés sus valores: tirar en Motivations and Relationships (CP:R p.48)."
      },
      {
        "roll": "3",
        "text": "Te muestra su amuleto de la suerte: tirar en Most Valued Possession (CP:R p.48)."
      },
      {
        "roll": "4",
        "text": "Te da un consejo útil a elección del GM."
      },
      {
        "roll": "5",
        "text": "Te regala 50eb (Costly) en Street Drugs y/o munición a elección del GM."
      },
      {
        "roll": "6",
        "text": "La cita terminó demasiado pronto para aprender más."
      }
    ],
    "source": "Digital Dating in the Dark Future p.14"
  }
];

export const DATING_RULES: { title: string; textEs: string; source: string }[] = [
  {
    "title": "Do They Say They Want Another Date?",
    "textEs": "Par/impar: si es par, quieren otra cita y prometen contactarte (ir a Aftermath); si es impar, te rechazan y hay que empezar con otra cita o dejar de salir un tiempo.",
    "source": "Digital Dating in the Dark Future p.15"
  },
  {
    "title": "Aftermath",
    "textEs": "1d10: 1-8 no te ghostean y te contactan de nuevo; 9-10 te ghostean y no volvés a saber de ellos sobre una segunda cita, aunque Night City es chica.",
    "source": "Digital Dating in the Dark Future p.15"
  },
  {
    "title": "The Start of a New Romance?",
    "textEs": "Lo que sigue lo deciden el jugador y el GM: la relación puede florecer o marchitarse.",
    "source": "Digital Dating in the Dark Future p.15"
  },
  {
    "title": "Keywords: nombre y ajustes",
    "textEs": "Después de las dos palabras clave, ponerle un nombre de pila al match; el GM puede cambiar, agregar o quitar Keywords según su campaña.",
    "source": "Digital Dating in the Dark Future p.3"
  },
  {
    "title": "Consecuencias para el GM",
    "textEs": "Más aliados o conocidos para los PJ significan más enemigos de segunda mano y más ganchos de aventura.",
    "source": "Digital Dating in the Dark Future p.2"
  }
];
