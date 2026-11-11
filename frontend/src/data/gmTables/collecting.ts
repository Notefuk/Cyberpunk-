// Generado por scripts/gen_gm_tables.py [Claude Code · 2026-11-11] v5.19.0 (plan 27). No editar a mano: editar el JSON de docs/plans/work/plan27-v5.19.0/ y volver a generar.
// Los textos en español son resúmenes propios; nombres y números como en el libro.
import type { GmTable } from './types';

export const COLLECTING_INTRO = "Collecting the Random reúne seis listas que salieron antes en redes de RTG: razones para usar Complementary Skill Checks, reskins de Roles, diez ideas de campaña, 90 combinaciones de multiclase, estilos de moda y veinte sabores de Kibble al azar. Solo la lista de Kibble es una tabla de dado (d100).";

export const COLLECTING_HOW_TO: string[] = [
  "Complementary Skill Checks (CP:R p.130): permiten reintentar un Check fallado como un enfoque nuevo",
  "Una Skill complementaria muestra cómo ser bueno en una cosa influye en otra, por ejemplo Language (Italian) para Bribery",
  "Un Personaje puede ayudar a otro con su propio Check complementario, con +1",
  "Muchas Skills se vuelven útiles: Wardrobe & Style o Personal Grooming en lo social, Business para Tactics",
  "Dan sabor: transforman 'tiro Melee Weapons' en una descripción de qué se está haciendo, por ejemplo con Weaponstech",
  "Reskin de Roles: se cambia el sabor de un Role y su Role Ability sin tocar reglas; el Lifepath puede necesitar ajustes",
  "Ideas de campaña: cada una trae cinco misiones posibles, aparte de los grupos de CP:R p.390-392",
  "Multiclase: cada Role se combina con los otros nueve, con dos ejemplos por combinación (A/B y B/A)",
  "Moda: es una herramienta; la falta de la herramienta correcta da -2 (CP:R p.130) y Wardrobe & Style sirve de Skill complementaria",
  "Kibble: tirar 1d100 para saber el sabor de la bolsa que lleva un NPC"
];

export const COLLECTIONS: GmTable[] = [
  {
    "id": "complementary-skill-checks",
    "title": "Complementary Skill Checks",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Retry failed Skill Checks: Permiten reintentar con un enfoque nuevo."
      },
      {
        "roll": "2",
        "text": "Being good at one thing impacts another: Una Skill ayuda a otra, ej. Language en Bribery."
      },
      {
        "roll": "3",
        "text": "One Character can help another: Un PJ ayuda a otro con +1."
      },
      {
        "roll": "4",
        "text": "Makes many Skills useful: Wardrobe, Grooming y Business ayudan en situaciones comunes."
      },
      {
        "roll": "5",
        "text": "Flavor: Convierte el tiro en una descripción más rica."
      }
    ],
    "source": "Collecting the Random p.2"
  },
  {
    "id": "reskinning-roles",
    "title": "Reskinning Roles",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Rockerboy to Grifter: Charismatic Impact sobre identidad de fachada."
      },
      {
        "roll": "2",
        "text": "Solo to Athlete: Combat Awareness nacido en la arena deportiva."
      },
      {
        "roll": "3",
        "text": "Netrunner to Thief: Infiltrar con Security Tech, Stealth e Interface."
      },
      {
        "roll": "4",
        "text": "Tech to Cleaner: Hace desaparecer cuerpos y limpia escenas del crimen."
      },
      {
        "roll": "5",
        "text": "Medtech to Agent: Cuida al cliente con drogas, ungüentos y apoyo emocional."
      },
      {
        "roll": "6",
        "text": "Media to Private Investigator: Credibility como rumores y relatos que convencen."
      },
      {
        "roll": "7",
        "text": "Exec to Mobster: La mafia paga casa y subordinados."
      },
      {
        "roll": "8",
        "text": "Lawman to Ganger: Backup son miembros o gangs aliadas."
      },
      {
        "roll": "9",
        "text": "Fixer to Spy: Operator es contactos y cobertura cultural."
      },
      {
        "roll": "10",
        "text": "Nomad to Racer: Moto como acceso a la flota del equipo de carreras."
      }
    ],
    "source": "Collecting the Random p.2"
  },
  {
    "id": "ten-punk-campaign-ideas",
    "title": "Ten Punk Campaign Ideas",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Guerrilla Gardeners: Cultivar comida propia contra la Corp."
      },
      {
        "roll": "2",
        "text": "Family Legacy: Hermanos que quieren robar una herencia de Mister Kernaghan."
      },
      {
        "roll": "3",
        "text": "Librarians: Recuperar libros para Nostradamus tras el Datakrash."
      },
      {
        "roll": "4",
        "text": "Food Truck War: Ayudar a Aunt Andy a vender galletas en food truck."
      },
      {
        "roll": "5",
        "text": "Do-Gooder Clinic: Equipo de una clínica comunitaria, From the Ember."
      },
      {
        "roll": "6",
        "text": "Prankster Gang: Bromas a las élites, como hacer sangrar un edificio."
      },
      {
        "roll": "7",
        "text": "Paracy(ber)cology: Show de Pop Media que investiga hechos paranormales."
      },
      {
        "roll": "8",
        "text": "Sapience Liberation Front: Liberar clones e IAs del control corporativo."
      },
      {
        "roll": "9",
        "text": "Mr. K's Collectors: Conseguir coleccionables para el Midnight Market de Mr. K."
      },
      {
        "roll": "10",
        "text": "The Perfect Prison: El grupo despierta en un suburbio de ensueño sin saber por qué."
      }
    ],
    "source": "Collecting the Random p.3"
  },
  {
    "id": "multiclassing-rockerboys",
    "title": "Multiclassing Ideas: Rockerboys",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Rockerboy/Solo - the Johnny Silverhand"
      },
      {
        "roll": "2",
        "text": "Rockerboy/Netrunner - the Virtual Prankster"
      },
      {
        "roll": "3",
        "text": "Rockerboy/Tech - the Musical Craftsman"
      },
      {
        "roll": "4",
        "text": "Rockerboy/Medtech - the Spiritual Healer"
      },
      {
        "roll": "5",
        "text": "Rockerboy/Media - the Influencer"
      },
      {
        "roll": "6",
        "text": "Rockerboy/Exec - the Producer"
      },
      {
        "roll": "7",
        "text": "Rockerboy/Lawman - the Mascot"
      },
      {
        "roll": "8",
        "text": "Rockerboy/Fixer - the Indie Networker"
      },
      {
        "roll": "9",
        "text": "Rockerboy/Nomad - the Singing Cowboy"
      }
    ],
    "source": "Collecting the Random p.6"
  },
  {
    "id": "multiclassing-solos",
    "title": "Multiclassing Ideas: Solos",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Solo/Rockerboy - the Eurosolo"
      },
      {
        "roll": "2",
        "text": "Solo/Netrunner - the Tomb Raider"
      },
      {
        "roll": "3",
        "text": "Solo/Tech - the Gun Crafter"
      },
      {
        "roll": "4",
        "text": "Solo/Medtech - the Field Medic"
      },
      {
        "roll": "5",
        "text": "Solo/Media - the War Correspondent"
      },
      {
        "roll": "6",
        "text": "Solo/Exec - the Revolutionary"
      },
      {
        "roll": "7",
        "text": "Solo/Lawman - the Bounty Hunter"
      },
      {
        "roll": "8",
        "text": "Solo/Fixer - the Arms Dealer"
      },
      {
        "roll": "9",
        "text": "Solo/Nomad - the Babysitter"
      }
    ],
    "source": "Collecting the Random p.6"
  },
  {
    "id": "multiclassing-netrunners",
    "title": "Multiclassing Ideas: Netrunners",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Netrunner/Rockerboy - the Drone Dancer"
      },
      {
        "roll": "2",
        "text": "Netrunner/Solo - the Lone Runner"
      },
      {
        "roll": "3",
        "text": "Netrunner/Tech - the Builder"
      },
      {
        "roll": "4",
        "text": "Netrunner/Medtech - the MedRaider"
      },
      {
        "roll": "5",
        "text": "Netrunner/Media - the Whistle Blower"
      },
      {
        "roll": "6",
        "text": "Netrunner/Exec - the Clonerunner"
      },
      {
        "roll": "7",
        "text": "Netrunner/Lawman - the NET-tective"
      },
      {
        "roll": "8",
        "text": "Netrunner/Fixer - the Information Broker"
      },
      {
        "roll": "9",
        "text": "Netrunner/Nomad - the Night Rider"
      }
    ],
    "source": "Collecting the Random p.7"
  },
  {
    "id": "multiclassing-techs",
    "title": "Multiclassing Ideas: Techs",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Tech/Rockerboy - the Educator"
      },
      {
        "roll": "2",
        "text": "Tech/Solo - the Boom Brigadier"
      },
      {
        "roll": "3",
        "text": "Tech/Netrunner - the Security Specialist"
      },
      {
        "roll": "4",
        "text": "Tech/Medtech - the Flipper Ripper"
      },
      {
        "roll": "5",
        "text": "Tech/Media - the Braindance Tuner"
      },
      {
        "roll": "6",
        "text": "Tech/Exec - the Disruptor"
      },
      {
        "roll": "7",
        "text": "Tech/Lawman - the CSI"
      },
      {
        "roll": "8",
        "text": "Tech/Fixer - the Tech Networker"
      },
      {
        "roll": "9",
        "text": "Tech/Nomad - the Restorer"
      }
    ],
    "source": "Collecting the Random p.7"
  },
  {
    "id": "multiclassing-medtechs",
    "title": "Multiclassing Ideas: Medtechs",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Medtech/Rockerboy - the Celebrity Doc"
      },
      {
        "roll": "2",
        "text": "Medtech/Solo - the Angel"
      },
      {
        "roll": "3",
        "text": "Medtech/Netrunner - the Biosculptor"
      },
      {
        "roll": "4",
        "text": "Medtech/Tech - the Bad Breaker"
      },
      {
        "roll": "5",
        "text": "Medtech/Media - the Secret Hunter"
      },
      {
        "roll": "6",
        "text": "Medtech/Exec - the Clinic Operator"
      },
      {
        "roll": "7",
        "text": "Medtech/Lawman - the Emergency Responder"
      },
      {
        "roll": "8",
        "text": "Medtech/Fixer - Doc Connection"
      },
      {
        "roll": "9",
        "text": "Medtech/Nomad - the Family Doctor"
      }
    ],
    "source": "Collecting the Random p.8"
  },
  {
    "id": "multiclassing-medias",
    "title": "Multiclassing Ideas: Medias",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Media/Rockerboy - the Documentarian"
      },
      {
        "roll": "2",
        "text": "Media/Solo - the Thompson"
      },
      {
        "roll": "3",
        "text": "Media/Netrunner - the Virtual Journalist"
      },
      {
        "roll": "4",
        "text": "Media/Tech - the Producer"
      },
      {
        "roll": "5",
        "text": "Media/Medtech - Storyteller"
      },
      {
        "roll": "6",
        "text": "Media/Exec - the Star Reporter"
      },
      {
        "roll": "7",
        "text": "Media/Lawman - the Embed"
      },
      {
        "roll": "8",
        "text": "Media/Fixer - the Independent Journalist"
      },
      {
        "roll": "9",
        "text": "Media/Nomad - the Wandering Eye"
      }
    ],
    "source": "Collecting the Random p.9"
  },
  {
    "id": "multiclassing-execs",
    "title": "Multiclassing Ideas: Execs",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Exec/Rockerboy - the Club Owner"
      },
      {
        "roll": "2",
        "text": "Exec/Solo - the Gang Leader"
      },
      {
        "roll": "3",
        "text": "Exec/Netrunner - the Corp Spy"
      },
      {
        "roll": "4",
        "text": "Exec/Tech - the Netwatch Agent"
      },
      {
        "roll": "5",
        "text": "Exec/Medtech - the Trauma Captain"
      },
      {
        "roll": "6",
        "text": "Exec/Media - the Anchor"
      },
      {
        "roll": "7",
        "text": "Exec/Lawman - the Negotiator"
      },
      {
        "roll": "8",
        "text": "Exec/Fixer - the Buyer"
      },
      {
        "roll": "9",
        "text": "Exec/Nomad - the Ambassador"
      }
    ],
    "source": "Collecting the Random p.9"
  },
  {
    "id": "multiclassing-lawmen",
    "title": "Multiclassing Ideas: Lawmen",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Lawman/Rockerboy - the Celebrity Bounty Hunter"
      },
      {
        "roll": "2",
        "text": "Lawman/Solo - the C-SWAT"
      },
      {
        "roll": "3",
        "text": "Lawman/Netrunner - the NET Cracker"
      },
      {
        "roll": "4",
        "text": "Lawman/Tech - the Quartermaster"
      },
      {
        "roll": "5",
        "text": "Lawman/Medtech - the Social Worker"
      },
      {
        "roll": "6",
        "text": "Lawman/Media - the Psychic Detective"
      },
      {
        "roll": "7",
        "text": "Lawman/Exec - the Senior Security"
      },
      {
        "roll": "8",
        "text": "Lawman/Fixer - the Evidence Clerk"
      },
      {
        "roll": "9",
        "text": "Lawman/Nomad - the Ranger"
      }
    ],
    "source": "Collecting the Random p.10"
  },
  {
    "id": "multiclassing-fixers",
    "title": "Multiclassing Ideas: Fixers",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Fixer/Rockerboy - the Old Guard"
      },
      {
        "roll": "2",
        "text": "Fixer/Solo - the Monarch"
      },
      {
        "roll": "3",
        "text": "Fixer/Netrunner - the Gamemaster"
      },
      {
        "roll": "4",
        "text": "Fixer/Tech - the Ultimate Mechanic"
      },
      {
        "roll": "5",
        "text": "Fixer/Medtech - the Dealer"
      },
      {
        "roll": "6",
        "text": "Fixer/Media - the Gossip Monger"
      },
      {
        "roll": "7",
        "text": "Fixer/Exec - the Bookie"
      },
      {
        "roll": "8",
        "text": "Fixer/Lawman - the Undercover"
      },
      {
        "roll": "9",
        "text": "Fixer/Nomad - the Organizer"
      }
    ],
    "source": "Collecting the Random p.11"
  },
  {
    "id": "multiclassing-nomads",
    "title": "Multiclassing Ideas: Nomads",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Nomad/Rockerboy - the Circus Performer"
      },
      {
        "roll": "2",
        "text": "Nomad/Solo - the Scout"
      },
      {
        "roll": "3",
        "text": "Nomad/Netrunner - the Cargo Hacker"
      },
      {
        "roll": "4",
        "text": "Nomad/Tech - the Acquisitions Specialist"
      },
      {
        "roll": "5",
        "text": "Nomad/Medtech - the Barber"
      },
      {
        "roll": "6",
        "text": "Nomad/Media - the Pirate"
      },
      {
        "roll": "7",
        "text": "Nomad/Exec - the Teacher"
      },
      {
        "roll": "8",
        "text": "Nomad/Lawman - the Hunter"
      },
      {
        "roll": "9",
        "text": "Nomad/Fixer - the Clerk"
      }
    ],
    "source": "Collecting the Random p.12"
  },
  {
    "id": "cyberpunk-red-fashion",
    "title": "Cyberpunk RED Fashion",
    "die": "lista",
    "rows": [
      {
        "roll": "1",
        "text": "Bag Lady Chic: Trapos reales; sirve de disfraz."
      },
      {
        "roll": "2",
        "text": "Gang Colors: Ropa de pandilla; peligroso usarla sin ganarla."
      },
      {
        "roll": "3",
        "text": "Generic Chic: Ropa básica para mezclarse con la multitud."
      },
      {
        "roll": "4",
        "text": "Bohemian: Aire artístico y excéntrico."
      },
      {
        "roll": "5",
        "text": "Leisurewear: Ropa cómoda y durable, casual."
      },
      {
        "roll": "6",
        "text": "Nomad Leathers: Cuero y jeans, estilo Mad Max y Far West."
      },
      {
        "roll": "7",
        "text": "Asia Pop: Moda juvenil, colorida, vista desde Corea y Japón."
      },
      {
        "roll": "8",
        "text": "Urban Flash: Streetwear tecnológico con luces y pantallas."
      },
      {
        "roll": "9",
        "text": "Businesswear: Traje y corbata; necesario para hacerse pasar por Corp."
      },
      {
        "roll": "10",
        "text": "High Fashion: Diseñador exclusivo; te hace notar como blanco o como VIP."
      }
    ],
    "source": "Collecting the Random p.12"
  },
  {
    "id": "random-kibble-flavors",
    "title": "Twenty Random Kibble Flavors",
    "die": "1d100",
    "rows": [
      {
        "roll": "1-5",
        "text": "Fizzy: Burbujea en la lengua, es normal."
      },
      {
        "roll": "6-10",
        "text": "Chili Lime: Ácido y picante."
      },
      {
        "roll": "11-15",
        "text": "Protein Kibble: Para quienes levantan pesas."
      },
      {
        "roll": "16-20",
        "text": "Kibble SportFlakes: Muy bueno, tapa los intestinos."
      },
      {
        "roll": "21-25",
        "text": "Extra Fluffy Pancake: Se le agrega almíbar de Continental Brands."
      },
      {
        "roll": "26-30",
        "text": "Kibble SportMix: El Kibble oficial del Night City Heat."
      },
      {
        "roll": "31-35",
        "text": "Fruit Fantasy: La ensalada de frutas falsa más sólida."
      },
      {
        "roll": "36-40",
        "text": "Popcorn: Con sabor original a manteca."
      },
      {
        "roll": "41-45",
        "text": "Caramel Crunch Popcorn: Si entrecerrás los ojos parece real."
      },
      {
        "roll": "46-50",
        "text": "Bacon Cheddar Dumpburger: Sorprendentemente popular."
      },
      {
        "roll": "51-55",
        "text": "Kiwi: Probá los trópicos."
      },
      {
        "roll": "56-60",
        "text": "Cheese: Brilla en la oscuridad, es normal."
      },
      {
        "roll": "61-65",
        "text": "Lemon Ginger: Comer fino sin gastar de más."
      },
      {
        "roll": "66-70",
        "text": "Aromatic Beef: Huele, pero no dicen a qué."
      },
      {
        "roll": "71-75",
        "text": "Paprika: El Kibble más rojo."
      },
      {
        "roll": "76-80",
        "text": "Pineapple Pizza: Piña en pizza en una bolsa de Kibble."
      },
      {
        "roll": "81-85",
        "text": "Collagen Boost: Para darte un lifting."
      },
      {
        "roll": "86-90",
        "text": "Kibble XXL: Trozos del tamaño de una pelota de golf."
      },
      {
        "roll": "91-95",
        "text": "Mystery: Sabor desconocido, y seguirá así."
      },
      {
        "roll": "96-100",
        "text": "Adobo: Finge tener ajo, vinagre y sal reales."
      }
    ],
    "source": "Collecting the Random p.14"
  }
];
