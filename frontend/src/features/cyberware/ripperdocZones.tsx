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

export interface ZoneHotspot {
  shapes: string[];
  marker: { x: number; y: number };
}

// Hotspots en el viewBox 420x680 de HoloBody. El orden de las claves es el orden de render
// (las zonas pequenas como ojos y oidos van al final para quedar encima).
export const ZONE_HOTSPOTS: Record<AnatomicalZoneKey, ZoneHotspot> = {
  external: {
    shapes: [
      'M 194 114 C 180 118 168 120 158 126 C 148 129 142 138 139 150 L 152 156 C 154 148 160 142 168 140 C 178 136 186 128 194 126 Z',
      'M 226 114 C 240 118 252 120 262 126 C 272 129 278 138 281 150 L 268 156 C 266 148 260 142 252 140 C 242 136 234 128 226 126 Z',
      'M 162 158 C 166 180 170 200 174 222 C 176 250 172 270 168 296 L 180 298 C 184 270 188 250 186 230 C 182 206 178 184 174 160 Z',
      'M 258 158 C 254 180 250 200 246 222 C 244 250 248 270 252 296 L 240 298 C 236 270 232 250 234 230 C 238 206 242 184 246 160 Z'
    ],
    marker: { x: 176, y: 240 }
  },
  internal: {
    shapes: [
      'M 182 132 C 178 150 180 180 190 206 L 230 206 C 240 180 242 150 238 132 C 226 126 194 126 182 132 Z',
      'M 190 212 C 188 230 190 250 194 270 L 226 270 C 230 250 232 230 230 212 Z'
    ],
    marker: { x: 190, y: 190 }
  },
  cyberarms: {
    shapes: [
      'M 158 126 C 148 129 142 138 139 150 C 136 170 131 192 126 212 C 122 236 116 264 112 290 C 108 302 105 316 105 330 Q 103 342 107 350 Q 111 353 113 347 Q 115 355 119 351 Q 123 347 122 338 C 124 326 126 314 127 300 C 128 272 138 244 146 216 C 150 196 156 176 162 158 Z',
      'M 262 126 C 272 129 278 138 281 150 C 284 170 289 192 294 212 C 298 236 304 264 308 290 C 312 302 315 316 315 330 Q 317 342 313 350 Q 309 353 307 347 Q 305 355 301 351 Q 297 347 298 338 C 296 326 294 314 293 300 C 292 272 282 244 274 216 C 270 196 264 176 258 158 Z'
    ],
    marker: { x: 130, y: 250 }
  },
  cyberlegs: {
    shapes: [
      'M 168 296 C 164 330 164 400 172 470 C 168 500 166 525 172 560 C 176 580 178 598 178 612 C 176 630 170 642 166 650 C 164 656 168 660 176 660 L 200 660 C 204 658 204 652 202 646 C 198 634 196 622 196 610 C 196 590 194 570 192 550 C 190 520 190 500 190 474 C 194 440 200 400 206 358 L 210 342 L 210 300 Z',
      'M 252 296 C 256 330 256 400 248 470 C 252 500 254 525 248 560 C 244 580 242 598 242 612 C 244 630 250 642 254 650 C 256 656 252 660 244 660 L 220 660 C 216 658 216 652 218 646 C 222 634 224 622 224 610 C 224 590 226 570 228 550 C 230 520 230 500 230 474 C 226 440 220 400 214 358 L 210 342 L 210 300 Z'
    ],
    marker: { x: 236, y: 440 }
  },
  borgware: {
    shapes: [
      'M 199 98 L 221 98 L 221 118 L 199 118 Z',
      'M 205 120 L 215 120 L 215 300 L 205 300 Z',
      'M 198 168 A 12 12 0 1 0 222 168 A 12 12 0 1 0 198 168 Z'
    ],
    marker: { x: 210, y: 168 }
  },
  neuralware: {
    shapes: [
      'M 188 50 C 186 30 196 20 210 20 C 224 20 234 30 232 50 C 224 44 216 42 210 42 C 204 42 196 44 188 50 Z'
    ],
    marker: { x: 210, y: 32 }
  },
  cyberaudio: {
    shapes: [
      'M 187 54 C 180 54 178 62 180 68 C 181 73 185 74 187 72 Z',
      'M 233 54 C 240 54 242 62 240 68 C 239 73 235 74 233 72 Z'
    ],
    marker: { x: 240, y: 64 }
  },
  cyberoptics: {
    shapes: [
      'M 189 58 Q 199 50 209 58 Q 199 66 189 58 Z',
      'M 211 58 Q 221 50 231 58 Q 221 66 211 58 Z'
    ],
    marker: { x: 210, y: 58 }
  },
  fashionware: {
    shapes: ['M 110 276 L 130 276 L 128 298 L 111 298 Z'],
    marker: { x: 120, y: 287 }
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
  // Las opciones (CEMK) van en la zona de su implante base: 'Neuralware Option' → Frontal Cortex, 'Cyberarm Option' → Arms & Hands.
  if (zoneKey === 'neuralware') return item.type === 'Neuralware' || item.type === 'Neuralware Option';
  if (zoneKey === 'cyberoptics') return item.type === 'Cyberoptics';
  if (zoneKey === 'cyberaudio') return item.type === 'Cyberaudio';
  if (zoneKey === 'internal') return item.type === 'Internal';
  if (zoneKey === 'external') return item.type === 'External';
  if (zoneKey === 'borgware') return item.type === 'Borgware' || item.type === 'Borgware x2';
  if (zoneKey === 'fashionware') return item.type === 'Fashionware';
  if (zoneKey === 'cyberlegs') {
    return item.type === 'Cyberlimb' && (LEG_CYBER_IDS.has(item.id) || COVERING_CYBER_IDS.has(item.id));
  }
  if (zoneKey === 'cyberarms') {
    if (item.type === 'Cyberarm Option') return true;
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
