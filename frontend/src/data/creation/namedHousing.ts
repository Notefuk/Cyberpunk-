// [Claude Code · 2026-11-11] v5.18.0 (plan 27): viviendas con nombre de los Interface RED, con su tirada 1d10.
// Cube Hotels y Cargo Containers: Interface RED Vol. 2 pp.35-36 (DLC "Cargo Containers & Cube Hotels" pp.3-4).
// Corporate Conapts y Studio Apartments: Interface RED Vol. 4 pp.47-50, tablas 1d10 en p.53.
// Los textos son resúmenes propios; el nombre y el distrito son los del libro.

export interface NamedHousing {
  /** Resultado del 1d10 en la tabla del libro. */
  roll: number;
  name: string;
  district: string;
  /** Marca del mapa del libro (CH1, CC3, C5, S7...). */
  marker: string;
  descEs: string;
  source: string;
}

const IR2_CH = 'Interface RED Vol. 2 p.35';
const IR2_CC = 'Interface RED Vol. 2 p.36';

export const NAMED_HOUSING: Record<string, NamedHousing[]> = {
  'Cube Hotel': [
    { roll: 1, name: 'Orbital Air Housing Block #3', district: 'Morro Rock', marker: 'CH 1', source: IR2_CH,
      descEs: 'Para el personal del Massdriver de Orbital Air. Silencioso y nadie pregunta nada, pero sin pase de empleado no hay dónde comer: vendit o esperar el ferry.' },
    { roll: 2, name: 'Scenic Cubes', district: 'Pacifica Playground', marker: 'CH 2', source: IR2_CH,
      descEs: 'Sin ventanas, pero con una terraza con vista a la ciudad. Los vecinos que la ocupan son de una boostergang.' },
    { roll: 3, name: 'University Cubes', district: 'University District', marker: 'CH 3', source: IR2_CH,
      descEs: 'Junto a las fortificaciones de la NCU; la mitad del edificio son docentes adjuntos y ayudantes.' },
    { roll: 4, name: 'Cube-A-Rama', district: 'Little Europe', marker: 'CH 4', source: IR2_CH,
      descEs: 'Fachada de ladrillo histórica y bastante encanto. Short Circuit queda a pocas cuadras.' },
    { roll: 5, name: 'Cubeland by the Sea', district: 'Pacifica Playground', marker: 'CH 5', source: IR2_CH,
      descEs: 'Viviendas temporarias de obra, mal construidas, de antes del Time of the Red. Entrada a mitad de precio a Playland by the Sea de lunes a jueves de día.' },
    { roll: 6, name: 'A Dilapidated Cube Hotel', district: 'Borde del Hot Zone, cerca del Totentanz', marker: 'CH 6', source: IR2_CH,
      descEs: 'Hay cuerpos en el pasillo y vivir en la calle sería más seguro. Los sábados a la noche es como estar adentro de una licuadora.' },
    { roll: 7, name: 'Watson Central Cubelife', district: 'Watson', marker: 'CH 7', source: IR2_CH,
      descEs: 'El Cube Hotel más promedio del mundo. Vecinos: empleados corporativos de bajo rango que todavía no tienen Conapt.' },
    { roll: 8, name: 'Seafoam', district: 'The Glen, cerca de Club Atlantis', marker: 'CH 8', source: IR2_CH,
      descEs: 'El lobby es la after del Club Atlantis, y cuando se descontrola no hay patovica.' },
    { roll: 9, name: 'McCartney Cubes', district: 'Upper Marina', marker: 'CH 9', source: IR2_CH,
      descEs: 'Frente al estadio McCartney Field; cada piso tiene los colores de un equipo. Los días de partido hay mucho ruido.' },
    { roll: 10, name: 'Unnamed Cube Hotel', district: 'Old Japantown', marker: 'CH 10', source: IR2_CH,
      descEs: 'Una sola puerta blindada, sin personal ni cámaras. Se limpia con chorros de agua del techo, que también se usan para desalojar a quien no paga.' },
  ],
  'Cargo Container': [
    { roll: 1, name: 'University Cargo Bay', district: 'South Night City, cerca de la University', marker: 'CC 1', source: IR2_CC,
      descEs: 'Siete containers de alto: lo más barato para un estudiante de la NCU. Es Combat Zone, así que hay tiros además de fiestas.' },
    { roll: 2, name: 'Dock Cargo Community', district: 'South Night City (muelles)', marker: 'CC 2', source: IR2_CC,
      descEs: 'Entre los muelles de los Sea Nomads. Cuando zarpan, el barrio es violencia de pandillas pura, sobre todo los fines de semana.' },
    { roll: 3, name: 'South Cargo Village', district: 'South Night City, borde de The Glen', marker: 'CC 3', source: IR2_CC,
      descEs: 'Se ven los edificios nuevos del otro lado de la calle, y las patrullas del Precinct #1 te recuerdan que no son para vos.' },
    { roll: 4, name: 'Eagle Rock Stadium', district: 'Rancho Coronado / Heywood', marker: 'CC 4', source: IR2_CC,
      descEs: 'Una cancha de fútbol llena de containers. Roban autos y todo lo que no esté guardado; MetalStorm queda cerca.' },
    { roll: 5, name: 'The Precipice', district: 'Old Japantown, borde del Hot Zone', marker: 'CC 5', source: IR2_CC,
      descEs: 'Al lado del Crisis Medical Center, que viene bien para controlarte la radiación de vez en cuando.' },
    { roll: 6, name: 'North Cargo Village', district: 'New Westbrook', marker: 'CC 6', source: IR2_CC,
      descEs: 'Un estacionamiento abandonado cerca de WorldSat, SovOil, Petrochem y la base de NorCal: pasa mucha seguridad corporativa.' },
    { roll: 7, name: 'NC Ionic Semiconductor Building', district: 'Old Combat Zone (norte)', marker: 'CC 7', source: IR2_CC,
      descEs: 'Containers dentro de una fábrica medio derrumbada y con alambre de púas. Las puertas se cierran de medianoche a las 7.' },
    { roll: 8, name: 'Old Ironworks Building', district: 'Heywood Industrial Zone', marker: 'CC 8', source: IR2_CC,
      descEs: 'En el techo de una fábrica abandonada, frente al Zhirafa Office Park. Muchos vecinos son Techs que le trabajan a Zhirafa.' },
    { roll: 9, name: 'Bridgetown', district: 'Little China', marker: 'CC 9', source: IR2_CC,
      descEs: 'Bajo un viaducto frente al agua, cerca de The Forlorn Hope. Tiroteos cortos de noche y cuerpos que salen a flote.' },
    { roll: 10, name: 'East Cargo Village', district: 'Heywood, cerca del campamento Aldecaldo', marker: 'CC 10', source: IR2_CC,
      descEs: 'Una franja polvorienta de containers; los vecinos son Nomads y reclaimers que hacen negocios con la familia.' },
  ],
  // Orden del 1d10 de la tabla de p.53.
  'Corporate Conapt': [
    { roll: 1, name: 'Biotechnica Habitation Sphere Alpha', district: 'University District', marker: 'C1', source: 'Interface RED Vol. 4 p.47',
      descEs: 'Módulos dentro de un invernadero con cúpula. Entrar desde afuera pide 5 minutos de descontaminación, que arruina el pelo natural.' },
    { roll: 2, name: 'Continental Brands Vertical Neighborhood Concept: "Flavors of the World"', district: 'Little Europe', marker: 'C2', source: 'Interface RED Vol. 4 p.47',
      descEs: 'Cada piso imita un mercado "exótico" y cada Conapt es una vidriera; los pasillos son un laberinto. "Me perdí" no es excusa para llegar tarde.' },
    { roll: 3, name: 'Danger Gal Housing Facility aka "The Danger Zone"', district: 'Little Europe', marker: 'C3', source: 'Interface RED Vol. 4 p.47',
      descEs: 'Complejo art déco rosa con arcades, pozos de puffs y polígono de tiro. Siempre hay fiesta y media banda de Piranhas durmiendo ahí.' },
    { roll: 4, name: 'Militech Corporate Operatives Housing', district: 'NorCal Military Base', marker: 'C4', source: 'Interface RED Vol. 4 p.47',
      descEs: 'Espartano y casi indestructible; las visitas pasan control de seguridad. En el lounge de cigarros se habla de operaciones.' },
    { roll: 5, name: 'Network 54 Westbrook Private Acres', district: 'New Westbrook', marker: 'C5', source: 'Interface RED Vol. 4 p.48',
      descEs: 'Dúplex en un barrio cerrado en las colinas. Las estrellas de la cadena a veces vienen a esconderse a lo de sus asistentes.' },
    { roll: 6, name: 'Petrochem & SovOil Joint Temporary Housing Solution', district: 'Watson Development', marker: 'C6', source: 'Interface RED Vol. 4 p.48',
      descEs: 'Construcción barata y "temporaria" que compartís con la corp enemiga: cada una tiene su ascensor y su cancha de tenis.' },
    { roll: 7, name: 'Rocklin Augmentics Innovation Hub', district: 'New Westbrook', marker: 'C7', source: 'Interface RED Vol. 4 p.48',
      descEs: 'Lleno de laboratorios y Maker Spaces en cada piso, vigilados por si alguien inventa algo fuera de horario.' },
    { roll: 8, name: 'Trauma Team Corporate Living Center', district: 'Watson Development', marker: 'C8', source: 'Interface RED Vol. 4 p.48',
      descEs: 'Unido a la Trauma Team Tower por un túnel, con gimnasio de primera y guardia médica. Los picaportes te miden el pulso.' },
    { roll: 9, name: 'Ziggurat Corporate Terrace "The Hanging Garden"', district: 'Upper Marina', marker: 'C9', source: 'Interface RED Vol. 4 p.48',
      descEs: 'Colgada bajo la sede de Ziggurat, con vista al agua y ventanas selladas. Cada puerta muestra tu Garden Patch: mantenelo al día.' },
    { roll: 10, name: 'Zhirafa Office Park MicroVillage', district: 'Heywood Industrial Zone', marker: 'C10', source: 'Interface RED Vol. 4 pp.48-49',
      descEs: 'Imita la villa de containers de al lado, pero detrás de cada puerta hay un Conapt de lujo. El vodka sintético sale menos que el agua.' },
  ],
  // Orden del 1d10 de la tabla de p.53 (no coincide con el número de la marca del mapa).
  'Studio Apartment': [
    { roll: 1, name: 'Converted Motel Studio Apartments', district: 'North Heywood', marker: 'S7', source: 'Interface RED Vol. 4 p.50',
      descEs: 'Un motel convertido en los 2030. Casi todos los vecinos son Nomads o tienen amigos Nomads.' },
    { roll: 2, name: 'Coronado Heights', district: 'Rancho Coronado', marker: 'S2', source: 'Interface RED Vol. 4 p.49',
      descEs: 'Linda vista a Playland by the Sea, pero lleno de Voodoo Boys, Steel Vaqueros y 6th Street. No pelean donde duermen, pero hay tensión.' },
    { roll: 3, name: 'Dock 14 Studio Apartments', district: 'Port of Night City', marker: 'S10', source: 'Interface RED Vol. 4 p.50',
      descEs: 'Al lado del Dock 13 del Fixer William Maze: cada semana hay alguien afuera con megáfono pidiendo su cabeza.' },
    { roll: 4, name: 'Glenlife Perfected', district: 'The Glen', marker: 'S3', source: 'Interface RED Vol. 4 p.49',
      descEs: 'Parece caro, pero el ascensor se corta y las luces parpadean, salvo en el primer piso. A una cuadra de City Hall.' },
    { roll: 5, name: 'Heywood Suites', district: 'Santo Domingo', marker: 'S4', source: 'Interface RED Vol. 4 p.49',
      descEs: 'Debajo de una autopista: tiembla todo. Muchos vecinos tienen Level Damper o protectores; hay policías del Precinct #2.' },
    { roll: 6, name: 'Marina FloatHomes', district: 'Upper Marina', marker: 'S5', source: 'Interface RED Vol. 4 pp.49-50',
      descEs: 'Casas flotantes cerca del estadio. Los Scavvers que vuelven del Old City Center a cualquier hora hacen la vida difícil.' },
    { roll: 7, name: 'Parkside Living', district: 'University District', marker: 'S9', source: 'Interface RED Vol. 4 p.50',
      descEs: 'Con vista al Hot Zone, declarado seguro por la ciudad. Lleno de estudiantes: parece un dormitorio en época de clases.' },
    { roll: 8, name: 'Playhouse', district: 'Pacifica Playground', marker: 'S8', source: 'Interface RED Vol. 4 p.50',
      descEs: 'Donde se filmó un reality show con final sangriento. De noche hay gritos y olor a sangre en el ascensor. Entrada a mitad de precio a Playland.' },
    { roll: 9, name: 'Silverhand Studios', district: 'South Night City', marker: 'S1', source: 'Interface RED Vol. 4 p.49',
      descEs: 'Colectivo de artistas en un depósito con murales, del que es dueño Kerry Eurodyne. No esperes descuento.' },
    { roll: 10, name: 'South Night City Reclaimed Studio', district: 'Port of Night City', marker: 'S6', source: 'Interface RED Vol. 4 p.50',
      descEs: 'Tu cuadra es segura porque está al lado de un banco de cuerpos que le hace negocios a todas las bandas. Fuera de ella, Combat Zone.' },
  ],
};

/** Viviendas con nombre para un tipo de vivienda del Core, o [] si el libro no trae lista. */
export function namedHousingFor(type: string): NamedHousing[] {
  return NAMED_HOUSING[type] ?? [];
}

/** Tira 1d10 en la tabla del tipo de vivienda (rng inyectable para tests). */
export function rollNamedHousing(type: string, rng: () => number = Math.random): NamedHousing | null {
  const list = namedHousingFor(type);
  if (list.length === 0) return null;
  const d10 = Math.min(10, Math.floor(rng() * 10) + 1);
  return list.find((h) => h.roll === d10) ?? null;
}
