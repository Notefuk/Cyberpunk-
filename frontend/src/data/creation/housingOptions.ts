// v5.5.0 [Claude Code · 2026-10-29]: viviendas y estilos de vida del Core para elegir en el creador (plan 21).
// Alquiler y compra: Core p.378. Lifestyle: Core p.377. En la creación el primer mes viene pagado (Core p.105): no se cobra.

export interface HousingOption {
  name: string;
  /** €$ por mes; null si no se alquila (la da una corp o solo se compra). */
  rent: number | null;
  /** €$ para comprarla; null si no se vende. */
  buy: number | null;
  note?: string;
}

export const HOUSING_OPTIONS: HousingOption[] = [
  { name: 'Cube Hotel', rent: 500, buy: null },
  { name: 'Cargo Container', rent: 1000, buy: 15000 },
  { name: 'Studio Apartment', rent: 1500, buy: 25000 },
  { name: 'Two-Bedroom Apartment', rent: 2500, buy: 35000 },
  { name: 'Corporate Conapt', rent: null, buy: null, note: 'La da una corporación.' },
  { name: 'Upscale Conapt', rent: 7500, buy: 85000 },
  { name: 'Luxury Penthouse', rent: 15000, buy: 150000 },
  { name: 'Corporate Beaverville House', rent: null, buy: 200000, note: 'La da una corporación, o se compra.' },
  { name: 'Corporate Beaverville McMansion', rent: null, buy: 500000, note: 'La da una corporación, o se compra.' },
  { name: 'Living on The Street', rent: null, buy: null, note: 'Cada noche, Endurance DV15 o al otro día quedás fatigado: −2 a todo (Core p.378).' },
  { name: 'Living on The Street in a Vehicle', rent: null, buy: null, note: 'Hace falta un vehículo cerrado con vidrios; sin buena cama, Endurance DV15 o fatigado (Core p.378).' }
];

export interface LifestyleOption {
  name: string;
  monthly: number;
}

export const LIFESTYLE_OPTIONS: LifestyleOption[] = [
  { name: 'Kibble', monthly: 100 },
  { name: 'Generic Prepak', monthly: 300 },
  { name: 'Good Prepak', monthly: 600 },
  { name: 'Fresh Food', monthly: 1500 }
];

export const HOUSING_SOURCE = 'Core p.378';
export const LIFESTYLE_SOURCE = 'Core p.377';
