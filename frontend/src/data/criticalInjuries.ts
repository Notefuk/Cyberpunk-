import type { InjuryModifier } from '../types/cyberpunk';

export interface CriticalInjury {
  id: string;
  roll: number;
  location: 'head' | 'body';
  name: string;
  effect: string;
  quickFix: string;
  treatment: string;
  iconType: 'skull' | 'brain' | 'eye' | 'ear' | 'bone' | 'heart' | 'muscle' | 'throat';
  modifiers: InjuryModifier;
}

// Tablas canon de Heridas Críticas: Core Rulebook p. 187 (Cuerpo) y p. 188 (Cabeza).
// Toda Herida Crítica inflige además 5 de Daño Adicional directo a HP, sin ablación,
// aunque el daño del ataque no atraviese el SP (Core p. 187).

export const HEAD_CRITICAL_INJURIES: CriticalInjury[] = [
  {
    id: 'head-2',
    roll: 2,
    location: 'head',
    name: 'Ojo Perdido (Lost Eye)',
    effect: 'El ojo perdido ya no está. -4 a Ataques a Distancia y a tiradas de Percepción que dependan de la vista. +1 al Death Save Penalty base.',
    quickFix: 'N/A',
    treatment: 'Surgery DV 17',
    iconType: 'eye',
    modifiers: { rangedAttackPenalty: 4, bonusDeathSavePenalty: 1 }
  },
  {
    id: 'head-3',
    roll: 3,
    location: 'head',
    name: 'Trauma Cerebral (Brain Injury)',
    effect: '-2 a todas las Acciones. +1 al Death Save Penalty base.',
    quickFix: 'N/A',
    treatment: 'Surgery DV 17',
    iconType: 'brain',
    modifiers: { allActionsPenalty: 2, bonusDeathSavePenalty: 1 }
  },
  {
    id: 'head-4',
    roll: 4,
    location: 'head',
    name: 'Ojo Dañado (Damaged Eye)',
    effect: '-2 a Ataques a Distancia y a tiradas de Percepción que dependan de la vista.',
    quickFix: 'Paramedic DV 15',
    treatment: 'Surgery DV 13',
    iconType: 'eye',
    modifiers: { rangedAttackPenalty: 2 }
  },
  {
    id: 'head-5',
    roll: 5,
    location: 'head',
    name: 'Conmoción Cerebral (Concussion)',
    effect: '-2 a todas las Acciones.',
    quickFix: 'First Aid o Paramedic DV 13',
    treatment: 'El Quick Fix elimina el efecto de forma permanente',
    iconType: 'brain',
    modifiers: { allActionsPenalty: 2 }
  },
  {
    id: 'head-6',
    roll: 6,
    location: 'head',
    name: 'Mandíbula Rota (Broken Jaw)',
    effect: '-4 a todas las Acciones que impliquen hablar.',
    quickFix: 'Paramedic DV 13',
    treatment: 'Paramedic o Surgery DV 13',
    iconType: 'skull',
    modifiers: {}
  },
  {
    id: 'head-7',
    roll: 7,
    location: 'head',
    name: 'Objeto Extraño (Foreign Object)',
    effect: 'Al final de cada Turno en que te muevas más de 4 m a pie, vuelves a sufrir el Daño Adicional de esta Herida Crítica (5) directo a tus HP.',
    quickFix: 'First Aid o Paramedic DV 13',
    treatment: 'El Quick Fix elimina el efecto de forma permanente',
    iconType: 'skull',
    modifiers: {}
  },
  {
    id: 'head-8',
    roll: 8,
    location: 'head',
    name: 'Latigazo Cervical (Whiplash)',
    effect: '+1 al Death Save Penalty base.',
    quickFix: 'Paramedic DV 13',
    treatment: 'Paramedic o Surgery DV 13',
    iconType: 'bone',
    modifiers: { bonusDeathSavePenalty: 1 }
  },
  {
    id: 'head-9',
    roll: 9,
    location: 'head',
    name: 'Cráneo Fisurado (Cracked Skull)',
    effect: 'Los Ataques Apuntados a tu cabeza multiplican por 3 (en vez de 2) el daño que atraviesa tu SP. +1 al Death Save Penalty base.',
    quickFix: 'Paramedic DV 15',
    treatment: 'Paramedic o Surgery DV 15',
    iconType: 'skull',
    modifiers: { bonusDeathSavePenalty: 1 }
  },
  {
    id: 'head-10',
    roll: 10,
    location: 'head',
    name: 'Oído Dañado (Damaged Ear)',
    effect: 'Cada Turno en que te muevas más de 4 m a pie, no puedes realizar Acción de Movimiento en tu siguiente Turno. Además, -2 a tiradas de Percepción que dependan del oído.',
    quickFix: 'Paramedic DV 13',
    treatment: 'Surgery DV 13',
    iconType: 'ear',
    modifiers: {}
  },
  {
    id: 'head-11',
    roll: 11,
    location: 'head',
    name: 'Tráquea Aplastada (Crushed Windpipe)',
    effect: 'No puedes hablar. +1 al Death Save Penalty base.',
    quickFix: 'N/A',
    treatment: 'Surgery DV 15',
    iconType: 'throat',
    modifiers: { bonusDeathSavePenalty: 1 }
  },
  {
    id: 'head-12',
    roll: 12,
    location: 'head',
    name: 'Oreja Perdida (Lost Ear)',
    effect: 'La oreja perdida ya no está. Cada Turno en que te muevas más de 4 m a pie, no puedes realizar Acción de Movimiento en tu siguiente Turno. Además, -4 a tiradas de Percepción que dependan del oído. +1 al Death Save Penalty base.',
    quickFix: 'N/A',
    treatment: 'Surgery DV 17',
    iconType: 'ear',
    modifiers: { bonusDeathSavePenalty: 1 }
  }
];

export const BODY_CRITICAL_INJURIES: CriticalInjury[] = [
  {
    id: 'body-2',
    roll: 2,
    location: 'body',
    name: 'Brazo Amputado (Dismembered Arm)',
    effect: 'El brazo amputado ya no está. Sueltas de inmediato lo que tuvieras en esa mano. +1 al Death Save Penalty base.',
    quickFix: 'N/A',
    treatment: 'Surgery DV 17',
    iconType: 'bone',
    modifiers: { bonusDeathSavePenalty: 1 }
  },
  {
    id: 'body-3',
    roll: 3,
    location: 'body',
    name: 'Mano Amputada (Dismembered Hand)',
    effect: 'La mano amputada ya no está. Sueltas de inmediato lo que tuvieras en esa mano. +1 al Death Save Penalty base.',
    quickFix: 'N/A',
    treatment: 'Surgery DV 17',
    iconType: 'bone',
    modifiers: { bonusDeathSavePenalty: 1 }
  },
  {
    id: 'body-4',
    roll: 4,
    location: 'body',
    name: 'Pulmón Colapsado (Collapsed Lung)',
    effect: '-2 a MOVE (mínimo 1). +1 al Death Save Penalty base.',
    quickFix: 'Paramedic DV 15',
    treatment: 'Surgery DV 15',
    iconType: 'heart',
    modifiers: { movePenalty: 2, bonusDeathSavePenalty: 1 }
  },
  {
    id: 'body-5',
    roll: 5,
    location: 'body',
    name: 'Costillas Rotas (Broken Ribs)',
    effect: 'Al final de cada Turno en que te muevas más de 4 m a pie, vuelves a sufrir el Daño Adicional de esta Herida Crítica (5) directo a tus HP.',
    quickFix: 'Paramedic DV 13',
    treatment: 'Paramedic DV 15 o Surgery DV 13',
    iconType: 'bone',
    modifiers: {}
  },
  {
    id: 'body-6',
    roll: 6,
    location: 'body',
    name: 'Brazo Roto (Broken Arm)',
    effect: 'El brazo roto no se puede usar. Sueltas de inmediato lo que tuvieras en esa mano.',
    quickFix: 'Paramedic DV 13',
    treatment: 'Paramedic DV 15 o Surgery DV 13',
    iconType: 'bone',
    modifiers: {}
  },
  {
    id: 'body-7',
    roll: 7,
    location: 'body',
    name: 'Objeto Extraño (Foreign Object)',
    effect: 'Al final de cada Turno en que te muevas más de 4 m a pie, vuelves a sufrir el Daño Adicional de esta Herida Crítica (5) directo a tus HP.',
    quickFix: 'First Aid o Paramedic DV 13',
    treatment: 'El Quick Fix elimina el efecto de forma permanente',
    iconType: 'muscle',
    modifiers: {}
  },
  {
    id: 'body-8',
    roll: 8,
    location: 'body',
    name: 'Pierna Rota (Broken Leg)',
    effect: '-4 a MOVE (mínimo 1).',
    quickFix: 'Paramedic DV 13',
    treatment: 'Paramedic DV 15 o Surgery DV 13',
    iconType: 'bone',
    modifiers: { movePenalty: 4 }
  },
  {
    id: 'body-9',
    roll: 9,
    location: 'body',
    name: 'Músculo Desgarrado (Torn Muscle)',
    effect: '-2 a Ataques Cuerpo a Cuerpo.',
    quickFix: 'First Aid o Paramedic DV 13',
    treatment: 'El Quick Fix elimina el efecto de forma permanente',
    iconType: 'muscle',
    modifiers: { meleeAttackPenalty: 2 }
  },
  {
    id: 'body-10',
    roll: 10,
    location: 'body',
    name: 'Lesión Espinal (Spinal Injury)',
    effect: 'En tu próximo Turno no puedes realizar una Acción, pero sí una Acción de Movimiento. +1 al Death Save Penalty base.',
    quickFix: 'Paramedic DV 15',
    treatment: 'Surgery DV 15',
    iconType: 'bone',
    modifiers: { bonusDeathSavePenalty: 1 }
  },
  {
    id: 'body-11',
    roll: 11,
    location: 'body',
    name: 'Dedos Aplastados (Crushed Fingers)',
    effect: '-4 a todas las Acciones que impliquen esa mano.',
    quickFix: 'Paramedic DV 13',
    treatment: 'Surgery DV 15',
    iconType: 'bone',
    modifiers: {}
  },
  {
    id: 'body-12',
    roll: 12,
    location: 'body',
    name: 'Pierna Amputada (Dismembered Leg)',
    effect: 'La pierna amputada ya no está. -6 a MOVE (mínimo 1). No puedes esquivar ataques. +1 al Death Save Penalty base.',
    quickFix: 'N/A',
    treatment: 'Surgery DV 17',
    iconType: 'bone',
    modifiers: { movePenalty: 6, bonusDeathSavePenalty: 1 }
  }
];

// Core p. 187: se tira 2d6 hasta obtener una Herida Crítica que el objetivo no esté sufriendo.
export function rollCriticalInjury(
  location: 'head' | 'body',
  currentInjuryNames: string[] = []
): CriticalInjury {
  const table = location === 'head' ? HEAD_CRITICAL_INJURIES : BODY_CRITICAL_INJURIES;
  const available = table.filter(item => !currentInjuryNames.includes(item.name));
  if (available.length === 0) {
    return table[Math.floor(Math.random() * table.length)];
  }
  for (;;) {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const found = available.find(item => item.roll === d1 + d2);
    if (found) return found;
  }
}
