// v5.8.0 (plan 23): cómo se repara una armadura según el libro. [Claude Code · 2026-10-30]
// Core p.140 "Item Repair": TECH + la skill del ítem contra un DV y un tiempo que dependen de la categoría de precio.
// La armadura no tiene skill propia: Basic Tech cubre "all other items not covered by another TECH Skill" (Core p.140).
// El libro no cobra materiales por reparar.
import coreData from '../data/core-rules.cprpack.json';

export type PriceTier = 'Cheap' | 'Everyday' | 'Costly' | 'Premium' | 'Expensive' | 'Very Expensive' | 'Luxury' | 'Super Luxury';

export const ITEM_REPAIR_TABLE: Record<PriceTier, { dv: number; time: string }> = {
  Cheap: { dv: 9, time: '1 hora' },
  Everyday: { dv: 9, time: '1 hora' },
  Costly: { dv: 13, time: '6 horas' },
  Premium: { dv: 17, time: '1 día' },
  Expensive: { dv: 21, time: '1 semana' },
  'Very Expensive': { dv: 24, time: '2 semanas' },
  Luxury: { dv: 29, time: '1 mes' },
  'Super Luxury': { dv: 29, time: '1 mes por cada 10.000 €$ del precio' }
};

export interface ArmorRepairInfo {
  /** Nombre del libro que se encontró en el catálogo (null si no se encontró). */
  catalogName: string | null;
  tier: PriceTier | null;
  dv: number | null;
  time: string | null;
  skill: 'Basic Tech';
  page: 'Core p.140';
  /** Bodyweight Suit: las dos piezas se reparan juntas (Core p.350). */
  repairsBothPieces: boolean;
}

interface CatalogArmor { name: string; cost?: number; costTier?: string }

const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const TIERS = Object.keys(ITEM_REPAIR_TABLE) as PriceTier[];

function asTier(tier: string | undefined): PriceTier | null {
  if (!tier) return null;
  return TIERS.find((t) => compact(t) === compact(tier)) ?? null;
}

/** Busca la armadura de la ficha ("Light Armorjack (Head)", "Kevlar® (Body)") en el catálogo y da DV y tiempo. */
export function armorRepairInfo(sheetArmorName: string | undefined, catalog: CatalogArmor[] = coreData.armor as CatalogArmor[]): ArmorRepairInfo {
  const target = compact(sheetArmorName ?? '');
  const match = target
    ? catalog
        .filter((a) => compact(a.name).length > 0 && target.includes(compact(a.name)))
        .sort((a, b) => compact(b.name).length - compact(a.name).length)[0]
    : undefined;
  const tier = asTier(match?.costTier);
  let time = tier ? ITEM_REPAIR_TABLE[tier].time : null;
  if (tier === 'Super Luxury' && match?.cost) {
    const months = Math.max(1, Math.ceil(match.cost / 10000));
    time = `${months} ${months === 1 ? 'mes' : 'meses'} (1 mes por cada 10.000 €$)`;
  }
  return {
    catalogName: match?.name ?? null,
    tier,
    dv: tier ? ITEM_REPAIR_TABLE[tier].dv : null,
    time,
    skill: 'Basic Tech',
    page: 'Core p.140',
    repairsBothPieces: target.includes('bodyweightsuit')
  };
}
