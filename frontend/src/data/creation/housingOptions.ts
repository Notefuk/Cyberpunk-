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
  /** v5.7.0 [Claude Code · 2026-10-30]: qué te da ese estilo de vida (Core p.377). */
  descEs: string;
  /** v5.14.0 [Claude Code · 2026-11-06]: qué cubre en detalle por mes (Black Chrome p.130, Lifestyles in Detail). */
  detailBcEs?: string;
}

export const LIFESTYLE_OPTIONS: LifestyleOption[] = [
  { name: 'Kibble', monthly: 100, descEs: 'Comida horrible, de la que no le darías a un perro que quieras. Una vez por mes podés ver una película o un braindance.', detailBcEs: "Dos comidas de Kibble al día; cuenta de Agent (Data Pool, llamadas, textos); entretenimiento de 20eb (Everyday) una vez al mes; pase de transporte público y un taxi al mes entre zonas con Threat Level Moderate, Corporate o Executive." },
  { name: 'Generic Prepak', monthly: 300, descEs: 'Comida bastante mejor que el kibble. Cada fin de semana podés salir a un buen bar o fiesta, o comer sentado en un buen restaurante.', detailBcEs: "Una comida de Kibble y dos de Generic Prepak al día; mensaje de texto a otra ciudad una vez por semana; entretenimiento de 20eb semanal; taxi semanal limitado a zonas Moderate, Corporate o Executive." },
  { name: 'Good Prepak', monthly: 600, descEs: 'Comida como la de casi cualquier restaurante: artificial, pero sabe casi igual que la real. Salís a bares y restaurantes excelentes, y una vez por mes vas a un concierto en vivo o a un evento deportivo.', detailBcEs: "Una comida Generic Prepak y dos Good Prepak al día; texto a otra ciudad diario y llamada de voz de 10 minutos semanal; entretenimiento de 20eb diario y de 100eb (Premium) mensual; taxi diario limitado y alquiler mensual de un groundcar compacto por 24 horas (CP:R p.190)." },
  { name: 'Fresh Food', monthly: 1500, descEs: 'Comida real. Una vez por mes, si estás cansado y lejos de casa, te pagás un hotel cerca sin preocuparte. Vas a bares ejecutivos y una vez por mes comés en un restaurante de primer nivel.', detailBcEs: "Una comida Good Prepak y dos de Fresh Food al día; textos ilimitados, llamada de voz de 10 min diaria y videollamada de 10 min semanal; entretenimiento de 50eb (Costly) diario, 100eb semanal y 500eb (Expensive) mensual; taxi diario a cualquier zona y groundcar compacto semanal por 24 horas." }
];

/** Reglas del estilo de vida y la vivienda (Core pp.105, 377). */
export const LIFESTYLE_RULES: readonly string[] = [
  'El estilo de vida es cómo vivís: qué comés y cómo te divertís. Se paga al principio de cada mes.',
  'Si gastás por encima de tu estilo de vida (una cena cara, una noche de fiesta), el GM te lo cobra aparte.',
  'Si no pagás el estilo de vida a principio de mes, tenés una semana; después tirás un Death Save al empezar cada día que no pagues.',
  'Si tenés que elegir entre alquiler y comida, mejor que te desalojen a morirte de hambre (Core p.377).',
  'Dormir mal (en la calle, apretados: más de 1 + dormitorios personas) te deja fatigado: −2 a todo al otro día (Core p.377).',
];

export const HOUSING_SOURCE = 'Core p.378';
export const LIFESTYLE_SOURCE = 'Core p.377';
export const LIFESTYLE_DETAIL_SOURCE = 'Black Chrome p.130';
