export interface CriticalInjury {
  id: string;
  roll: number;
  location: 'head' | 'body';
  name: string;
  effect: string;
  quickFix: string;
  treatment: string;
  iconType: 'skull' | 'brain' | 'eye' | 'ear' | 'bone' | 'heart' | 'muscle' | 'throat';
}

export const HEAD_CRITICAL_INJURIES: CriticalInjury[] = [
  {
    id: 'head-2',
    roll: 2,
    location: 'head',
    name: 'Ojo Perdido (Lost Eye)',
    effect: '-4 a todas las tiradas a Distancia y de Percepción que requieran visión. Si pierdes ambos, quedas ciego.',
    quickFix: 'N/A (Irreversible sin ciberóptica)',
    treatment: 'Cirugía en Hospital (DV 17) para instalar Ciberojo o clonación.',
    iconType: 'eye'
  },
  {
    id: 'head-3',
    roll: 3,
    location: 'head',
    name: 'Trauma Cerebral (Brain Injury)',
    effect: '-2 a todas las acciones que utilicen INT, WILL o COOL.',
    quickFix: 'Primeros Auxilios o Paramédico (DV 17)',
    treatment: 'Cirugía en Hospital (DV 17) con 1 semana de reposo.',
    iconType: 'brain'
  },
  {
    id: 'head-4',
    roll: 4,
    location: 'head',
    name: 'Ojo Dañado (Damaged Eye)',
    effect: '-2 a tiradas a Distancia y Percepción que requieran vista.',
    quickFix: 'Primeros Auxilios o Paramédico (DV 15)',
    treatment: 'Cirugía en Clínica (DV 15) o reposo médico.',
    iconType: 'eye'
  },
  {
    id: 'head-5',
    roll: 5,
    location: 'head',
    name: 'Conmoción Cerebral (Concussion)',
    effect: '-2 a todas las acciones por mareo extremo y zumbidos.',
    quickFix: 'Primeros Auxilios o Paramédico (DV 13)',
    treatment: 'Reposo absoluto de 1 día.',
    iconType: 'brain'
  },
  {
    id: 'head-6',
    roll: 6,
    location: 'head',
    name: 'Mandíbula Fracturada (Fractured Jaw)',
    effect: '-4 a acciones verbales (Conversación, Liderazgo, etc.) y no puedes comer comida sólida.',
    quickFix: 'Paramédico (DV 13)',
    treatment: 'Cirugía en Clínica (DV 13) para fijar el hueso.',
    iconType: 'skull'
  },
  {
    id: 'head-7',
    roll: 7,
    location: 'head',
    name: 'Objeto Incrustado en Cabeza (Foreign Object)',
    effect: 'Recibes 5 puntos de daño directo que ignora armadura si realizas una acción que requiera moverte más de 4m.',
    quickFix: 'Paramédico (DV 13) para estabilizar',
    treatment: 'Cirugía en Clínica (DV 13) para extraer el objeto.',
    iconType: 'skull'
  },
  {
    id: 'head-8',
    roll: 8,
    location: 'head',
    name: 'Latigazo Cervical (Whiplash)',
    effect: '-2 a todas las acciones que requieran REF y DEX por espasmos en el cuello.',
    quickFix: 'Primeros Auxilios (DV 13)',
    treatment: 'Reposo y analgésicos durante 2 días.',
    iconType: 'bone'
  },
  {
    id: 'head-9',
    roll: 9,
    location: 'head',
    name: 'Cráneo Fracturado (Fractured Skull)',
    effect: '-2 a todas las acciones que utilicen INT, REF y DEX. El daño a la cabeza hace daño triple en vez de doble.',
    quickFix: 'Paramédico (DV 15)',
    treatment: 'Cirugía en Hospital (DV 17) para colocar placa craneal.',
    iconType: 'skull'
  },
  {
    id: 'head-10',
    roll: 10,
    location: 'head',
    name: 'Oído Dañado (Damaged Ear)',
    effect: '-2 a tiradas de Percepción basadas en audición.',
    quickFix: 'Primeros Auxilios (DV 13)',
    treatment: 'Cirugía en Clínica (DV 13).',
    iconType: 'ear'
  },
  {
    id: 'head-11',
    roll: 11,
    location: 'head',
    name: 'Tráquea Aplastada (Crushed Windpipe)',
    effect: 'No puedes hablar y te sofocas: sufres 2 de daño directo por asfixia al final de cada turno.',
    quickFix: 'Paramédico (DV 15) para traqueotomía de emergencia',
    treatment: 'Cirugía en Hospital (DV 15).',
    iconType: 'throat'
  },
  {
    id: 'head-12',
    roll: 12,
    location: 'head',
    name: 'Oído Perdido (Lost Ear)',
    effect: '-4 a tiradas de Percepción basadas en oído y -2 a tiradas de iniciativa por desorientación acústica.',
    quickFix: 'N/A',
    treatment: 'Cirugía en Hospital (DV 15) para reemplazo ciberacústico.',
    iconType: 'ear'
  }
];

export const BODY_CRITICAL_INJURIES: CriticalInjury[] = [
  {
    id: 'body-2',
    roll: 2,
    location: 'body',
    name: 'Brazo Amputado (Dismembered Arm)',
    effect: 'El brazo queda cercenado. Pierdes el brazo y cualquier objeto sostenido en él.',
    quickFix: 'Paramédico (DV 15) para torniquete urgente',
    treatment: 'Cirugía en Hospital (DV 17) para instalar Ciberbrazo o reimplante.',
    iconType: 'bone'
  },
  {
    id: 'body-3',
    roll: 3,
    location: 'body',
    name: 'Pierna Amputada (Dismembered Leg)',
    effect: 'La pierna queda cercenada. Tu MOV se reduce a 1, no puedes correr ni esquivar.',
    quickFix: 'Paramédico (DV 15) para torniquete urgente',
    treatment: 'Cirugía en Hospital (DV 17) para Ciberpierna o reimplante.',
    iconType: 'bone'
  },
  {
    id: 'body-4',
    roll: 4,
    location: 'body',
    name: 'Brazo Roto (Broken Arm)',
    effect: 'No puedes utilizar ese brazo para sostener armas a dos manos ni realizar acciones con él.',
    quickFix: 'Paramédico (DV 13) para entablillar',
    treatment: 'Cirugía en Clínica (DV 13) o yeso médico.',
    iconType: 'bone'
  },
  {
    id: 'body-5',
    roll: 5,
    location: 'body',
    name: 'Pierna Rota (Broken Leg)',
    effect: 'Tu MOV se reduce a la mitad (redondeado hacia abajo, mínimo 1).',
    quickFix: 'Paramédico (DV 13) para entablillar',
    treatment: 'Cirugía en Clínica (DV 13) o escayola.',
    iconType: 'bone'
  },
  {
    id: 'body-6',
    roll: 6,
    location: 'body',
    name: 'Músculo Desgarrado (Torn Muscle)',
    effect: '-2 a todas las acciones que utilicen DEX, REF y MOVE por dolor agudo.',
    quickFix: 'Primeros Auxilios (DV 13)',
    treatment: 'Cirugía en Clínica (DV 13) o 1 semana de reposo.',
    iconType: 'muscle'
  },
  {
    id: 'body-7',
    roll: 7,
    location: 'body',
    name: 'Objeto Incrustado en Torso (Foreign Object)',
    effect: 'Recibes 5 puntos de daño directo que ignora armadura si realizas una acción de correr o saltar.',
    quickFix: 'Paramédico (DV 13) para estabilizar',
    treatment: 'Cirugía en Clínica (DV 13) para extracción segura.',
    iconType: 'heart'
  },
  {
    id: 'body-8',
    roll: 8,
    location: 'body',
    name: 'Fractura Ósea (Bone Fracture)',
    effect: '-2 a todas las acciones que utilicen BODY, DEX o REF.',
    quickFix: 'Paramédico (DV 13)',
    treatment: 'Cirugía en Clínica (DV 13).',
    iconType: 'bone'
  },
  {
    id: 'body-9',
    roll: 9,
    location: 'body',
    name: 'Lesión Espinal (Spinal Injury)',
    effect: 'Al final de cada turno en combate, tira 1d10: con un 1, quedas temporalmente paralizado hasta tu próximo turno.',
    quickFix: 'Paramédico (DV 15)',
    treatment: 'Cirugía en Hospital (DV 17) para neurofijación.',
    iconType: 'skull'
  },
  {
    id: 'body-10',
    roll: 10,
    location: 'body',
    name: 'Dedos Aplastados (Crushed Fingers)',
    effect: '-4 a acciones con esa mano (disparar, manipular herramientas, forzar cerraduras).',
    quickFix: 'Primeros Auxilios (DV 13)',
    treatment: 'Cirugía en Clínica (DV 13).',
    iconType: 'bone'
  },
  {
    id: 'body-11',
    roll: 11,
    location: 'body',
    name: 'Costillas Rotas (Broken Ribs)',
    effect: 'Al final de cada turno que te muevas más de 4m, sufres 2 de daño directo por punzadas en el pecho.',
    quickFix: 'Primeros Auxilios (DV 13) para vendar torso',
    treatment: 'Cirugía en Clínica (DV 13).',
    iconType: 'bone'
  },
  {
    id: 'body-12',
    roll: 12,
    location: 'body',
    name: 'Pulmón Colapsado (Collapsed Lung)',
    effect: 'Tu MOV se reduce a 2 y recibes 2 puntos de daño directo por turno hasta que se drene el aire del tórax.',
    quickFix: 'Paramédico (DV 15) para punción torácica con aguja',
    treatment: 'Cirugía en Hospital (DV 15).',
    iconType: 'heart'
  }
];

export function rollCriticalInjury(location: 'head' | 'body'): CriticalInjury {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const total = d1 + d2;
  const table = location === 'head' ? HEAD_CRITICAL_INJURIES : BODY_CRITICAL_INJURIES;
  const found = table.find(item => item.roll === total);
  return found || table[5]; // fallback
}
