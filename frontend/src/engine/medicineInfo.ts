// v5.6.0 [Claude Code · 2026-10-29]: qué heridas pide Surgery y con qué DV (plan 21). Sale del Treatment de cada
// Critical Injury (Core pp.187-188). Quick Fix y Treatment: Core p.223.
import { BODY_CRITICAL_INJURIES, HEAD_CRITICAL_INJURIES, type CriticalInjury } from '../data/criticalInjuries';

export interface SurgeryInjury {
  id: string;
  name: string;
  location: CriticalInjury['location'];
  surgeryDv: number;
  /** DV de Paramedic si el Treatment también la acepta. */
  paramedicDv?: number;
}

/** DV de una skill dentro del texto de Treatment. "Paramedic o Surgery DV 13" le da DV 13 a las dos. */
function dvFor(treatment: string, skill: 'Surgery' | 'Paramedic'): number | undefined {
  const own = new RegExp(`${skill} DV ?(\\d+)`).exec(treatment);
  if (own) return Number(own[1]);
  if (!treatment.includes(skill)) return undefined;
  const any = /DV ?(\d+)/.exec(treatment);
  return any ? Number(any[1]) : undefined;
}

export function surgeryInjuries(): SurgeryInjury[] {
  return [...HEAD_CRITICAL_INJURIES, ...BODY_CRITICAL_INJURIES]
    .filter((i) => i.treatment.includes('Surgery'))
    .map((i) => ({
      id: i.id,
      name: i.name,
      location: i.location,
      surgeryDv: dvFor(i.treatment, 'Surgery') ?? 0,
      paramedicDv: dvFor(i.treatment, 'Paramedic'),
    }));
}

export const QUICK_FIX_VS_TREATMENT = [
  'Quick Fix: saca el efecto de la herida por el resto del día. Tarda 1 minuto por intento y te lo podés hacer a vos mismo.',
  'Treatment: saca el efecto para siempre. Tarda 4 horas por intento y no te lo podés hacer a vos mismo.',
  'First Aid estabiliza y hace Quick Fix de las heridas comunes. Paramedic (×2) estabiliza y trata casi todas. Surgery trata las más graves. Cybertech reemplaza a cualquiera en partes de cyberware, al mismo DV (Core p.223).',
] as const;
