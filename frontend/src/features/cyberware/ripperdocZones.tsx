import React from 'react';
import {
  Cpu,
  Zap,
  Sparkles,
  Heart,
  Eye,
  Ear,
  Shield,
  Layers,
  Footprints
} from 'lucide-react';
import { getCyberwareCategoryTooltip } from '../../data/weaponAndCyberwareTooltips';

export interface CyberwareItemData {
  id: string;
  name: string;
  type: string;
  install: string;
  humanityLoss: string;
  cost: number;
  description: string;
}

export type AnatomicalZoneKey = 
  | 'neuralware' 
  | 'cyberarms' 
  | 'internal' 
  | 'external' 
  | 'borgware' 
  | 'cyberoptics' 
  | 'cyberaudio' 
  | 'cyberlegs' 
  | 'fashionware';

export interface ZoneConfig {
  key: AnatomicalZoneKey;
  title: string;
  sub: string;
  side: 'left' | 'right' | 'bottom';
  maxSlots: number;
  icon: React.ReactNode;
  anchor: { x: number; y: number };
  color?: string;
}

export const ZONE_CONFIGS: Record<AnatomicalZoneKey, ZoneConfig> = {
  neuralware: {
    key: 'neuralware',
    title: 'FRONTAL CORTEX',
    sub: 'NEURALWARE & REFLEXOS',
    side: 'left',
    maxSlots: 4,
    icon: <Cpu className="w-4 h-4 text-[#38bdf8]" />,
    anchor: { x: 200, y: 60 },
    color: '#38bdf8'
  },
  cyberarms: {
    key: 'cyberarms',
    title: 'ARMS & HANDS',
    sub: 'CYBERARMS & POPUP WEAPONS',
    side: 'left',
    maxSlots: 4,
    icon: <Zap className="w-4 h-4 text-[#f59e0b]" />,
    anchor: { x: 85, y: 290 },
    color: '#f59e0b'
  },
  internal: {
    key: 'internal',
    title: 'SKELETON & ORGANS',
    sub: 'INTERNAL BODY CYBERWARE',
    side: 'left',
    maxSlots: 4,
    icon: <Heart className="w-4 h-4 text-[#ef4444]" />,
    anchor: { x: 185, y: 180 },
    color: '#ef4444'
  },
  external: {
    key: 'external',
    title: 'INTEGUMENTARY SYSTEM',
    sub: 'DERMAL PLATING & WEAVES',
    side: 'left',
    maxSlots: 3,
    icon: <Shield className="w-4 h-4 text-[#00f5d4]" />,
    anchor: { x: 170, y: 260 },
    color: '#00f5d4'
  },
  borgware: {
    key: 'borgware',
    title: 'OPERATING SYSTEM',
    sub: 'BORGWARE & HEAVY FRAMES',
    side: 'right',
    maxSlots: 3,
    icon: <Layers className="w-4 h-4 text-[#e11d48]" />,
    anchor: { x: 210, y: 140 },
    color: '#e11d48'
  },
  cyberoptics: {
    key: 'cyberoptics',
    title: 'OCULAR SUITE',
    sub: 'CYBEROPTICS & TARGETING',
    side: 'right',
    maxSlots: 4,
    icon: <Eye className="w-4 h-4 text-[#38bdf8]" />,
    anchor: { x: 222, y: 62 },
    color: '#38bdf8'
  },
  cyberaudio: {
    key: 'cyberaudio',
    title: 'AUDITORY & SENSORS',
    sub: 'CYBERAUDIO & SCANNING',
    side: 'right',
    maxSlots: 4,
    icon: <Ear className="w-4 h-4 text-[#a855f7]" />,
    anchor: { x: 242, y: 68 },
    color: '#a855f7'
  },
  cyberlegs: {
    key: 'cyberlegs',
    title: 'LOCOMOTION & JUMP',
    sub: 'CYBERLEGS & HYDRAULICS',
    side: 'right',
    maxSlots: 4,
    icon: <Footprints className="w-4 h-4 text-[#10b981]" />,
    anchor: { x: 250, y: 520 },
    color: '#10b981'
  },
  fashionware: {
    key: 'fashionware',
    title: 'FASHIONWARE & BIOMONITOR',
    sub: '7 RANURAS LIBRES — 0 PÉRDIDA DE HUMANIDAD',
    side: 'bottom',
    maxSlots: 7,
    icon: <Sparkles className="w-4 h-4 text-[#f59e0b]" />,
    anchor: { x: 210, y: 350 },
    color: '#f59e0b'
  }
};

export const LEG_CYBER_IDS = new Set([
  'cyberleg',
  'standard-foot',
  'grip-foot',
  'jump-booster',
  'skate-foot',
  'talon-foot',
  'web-foot'
]);

export const COVERING_CYBER_IDS = new Set([
  'hardened-shielding',
  'plastic-covering',
  'realskinn-covering',
  'superchrome-covering'
]);

export function itemMatchesZone(item: CyberwareItemData, zoneKey: AnatomicalZoneKey): boolean {
  if (zoneKey === 'neuralware') return item.type === 'Neuralware';
  if (zoneKey === 'cyberoptics') return item.type === 'Cyberoptics';
  if (zoneKey === 'cyberaudio') return item.type === 'Cyberaudio';
  if (zoneKey === 'internal') return item.type === 'Internal';
  if (zoneKey === 'external') return item.type === 'External';
  if (zoneKey === 'borgware') return item.type === 'Borgware';
  if (zoneKey === 'fashionware') return item.type === 'Fashionware';
  if (zoneKey === 'cyberlegs') {
    return item.type === 'Cyberlimb' && (LEG_CYBER_IDS.has(item.id) || COVERING_CYBER_IDS.has(item.id));
  }
  if (zoneKey === 'cyberarms') {
    return item.type === 'Cyberlimb' && (!LEG_CYBER_IDS.has(item.id) || COVERING_CYBER_IDS.has(item.id));
  }
  return false;
}

export function parseHumanityLoss(hlStr: string, mode: 'average' | 'roll'): { amount: number; diceDesc: string; rolls: number[] } {
  if (!hlStr || hlStr.includes('0 (N/A)')) {
    return { amount: 0, diceDesc: '0 HUM', rolls: [] };
  }
  if (mode === 'average') {
    if (hlStr.includes('4d6') || hlStr.includes('(14)')) return { amount: 14, diceDesc: '4d6 (Promedio: 14)', rolls: [3, 4, 3, 4] };
    if (hlStr.includes('2d6') || hlStr.includes('(7)')) return { amount: 7, diceDesc: '2d6 (Promedio: 7)', rolls: [3, 4] };
    if (hlStr.includes('1d6/2') || hlStr.startsWith('2')) return { amount: 2, diceDesc: '1d6/2 (Promedio: 2)', rolls: [2] };
    if (hlStr.includes('1d6') || hlStr.includes('(3)')) return { amount: 3, diceDesc: '1d6 (Promedio: 3)', rolls: [3] };
    const num = parseInt(hlStr.replace(/\D/g, ''), 10) || 7;
    return { amount: num, diceDesc: `${num} HUM`, rolls: [num] };
  } else {
    if (hlStr.includes('4d6')) {
      const rolls = [1, 2, 3, 4].map(() => Math.floor(Math.random() * 6) + 1);
      const total = rolls.reduce((a, b) => a + b, 0);
      return { amount: total, diceDesc: `4d6 [${rolls.join('+')}]`, rolls };
    }
    if (hlStr.includes('2d6')) {
      const rolls = [1, 2].map(() => Math.floor(Math.random() * 6) + 1);
      const total = rolls.reduce((a, b) => a + b, 0);
      return { amount: total, diceDesc: `2d6 [${rolls.join('+')}]`, rolls };
    }
    if (hlStr.includes('1d6/2')) {
      const d = Math.floor(Math.random() * 6) + 1;
      const total = Math.max(1, Math.ceil(d / 2));
      return { amount: total, diceDesc: `1d6/2 [${d}/2 = ${total}]`, rolls: [d] };
    }
    if (hlStr.includes('1d6')) {
      const d = Math.floor(Math.random() * 6) + 1;
      return { amount: d, diceDesc: `1d6 [${d}]`, rolls: [d] };
    }
    return { amount: 7, diceDesc: '7 HUM', rolls: [7] };
  }
}

export const leftZoneKeys: AnatomicalZoneKey[] = ['neuralware', 'cyberarms', 'internal', 'external'];
export const rightZoneKeys: AnatomicalZoneKey[] = ['borgware', 'cyberoptics', 'cyberaudio', 'cyberlegs'];

export const renderCategoryFloatingTooltip = (categoryKey: string) => {
  const cat = getCyberwareCategoryTooltip(categoryKey);
  if (!cat) return null;

  return (
    <div className="absolute left-0 top-full mt-2 z-50 w-80 sm:w-96 p-3.5 bg-[#0b0d14]/98 backdrop-blur-md border border-[#00f5d4] shadow-[0_12px_36px_rgba(0,0,0,0.95)] rounded-xs pointer-events-none text-left animate-in fade-in duration-150">
      <div className="flex items-center justify-between border-b border-[#1f2638] pb-1.5 mb-2">
        <span className="font-tech text-xs font-bold text-[#00f5d4] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
          {cat.categoryName}
        </span>
        <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 font-bold uppercase">
          {cat.installationSite}
        </span>
      </div>
      <p className="text-[11px] text-[#cbd5e1] leading-relaxed mb-2.5 font-sans">
        {cat.description}
      </p>
      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono-code bg-[#06080d] p-2 rounded border border-[#1a1f30]">
        <div>
          <span className="text-[#64748b] block font-bold">BASE REQUERIDO:</span>
          <span className="text-white">{cat.baseRequirement}</span>
        </div>
        <div>
          <span className="text-[#64748b] block font-bold">CAPACIDAD / SLOTS:</span>
          <span className="text-[#38bdf8]">{cat.slotsInfo}</span>
        </div>
        <div className="col-span-2 pt-1.5 border-t border-[#151926]">
          <span className="text-[#f59e0b] block font-bold">PÉRDIDA DE HUMANIDAD:</span>
          <span className="text-[#e2e8f0]">{cat.humanityLossRule}</span>
        </div>
      </div>
      {cat.keyExamples.length > 0 && (
        <div className="mt-2 text-[9px] font-mono-code text-[#94a3b8] flex items-center gap-1">
          <span className="text-[#64748b]">Ejemplos: </span>
          <span className="text-slate-300">{cat.keyExamples.join(' • ')}</span>
        </div>
      )}
    </div>
  );
};
