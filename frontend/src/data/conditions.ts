// v5.2.0 (plan 20, decisión 2) [Claude Code · 2026-10-28]: condiciones con regla propia en el libro.
// Revisadas contra el Core Rulebook v1.24 (páginas impresas). Stunned, Blinded y Deafened no existen como regla.
// Las heridas de estado (Seriously / Mortally Wounded) salen del HP y no van acá.

export type ConditionId = 'prone' | 'grappled' | 'onFireMild' | 'onFireStrong' | 'onFireDeadly' | 'drowning' | 'exposure' | 'unconscious';

export interface ConditionDef {
  id: ConditionId;
  name: string;
  effect: string;
  source: string;
}

export const CONDITIONS: ConditionDef[] = [
  { id: 'prone', name: 'Prone', effect: 'No puede usar la Move Action hasta gastar una Action en Get Up.', source: 'Core p.169' },
  { id: 'grappled', name: 'Grappled', effect: '−2 a todas las Actions mientras dure el Grapple; el que está agarrado no puede moverse y nadie usa armas a dos manos.', source: 'Core p.177' },
  { id: 'onFireMild', name: 'On Fire (Mild)', effect: '2 de daño directo al HP al final de su Turn hasta gastar una Action en apagarse. No abla armadura.', source: 'Core p.180' },
  { id: 'onFireStrong', name: 'On Fire (Strong)', effect: '4 de daño directo al HP al final de su Turn hasta gastar una Action en apagarse. No abla armadura.', source: 'Core p.180' },
  { id: 'onFireDeadly', name: 'On Fire (Deadly)', effect: '6 de daño directo al HP al final de su Turn hasta gastar una Action en apagarse. No abla armadura.', source: 'Core p.180' },
  { id: 'drowning', name: 'Drowning / Asphyxiation', effect: 'Pasados BODY minutos sin aire, recibe BODY de daño directo al HP al inicio de cada Turn.', source: 'Core p.180' },
  { id: 'exposure', name: 'Exposure', effect: '1d6 de daño directo al HP por día expuesto y no se cura naturalmente.', source: 'Core p.181' },
  { id: 'unconscious', name: 'Unconscious', effect: 'Fuera de combate: no actúa. Tras estabilizarse desde Mortally Wounded queda así 1 minuto.', source: 'Core pp.186, 188' }
];

export const conditionById = (id: string): ConditionDef | undefined => CONDITIONS.find((c) => c.id === id);
