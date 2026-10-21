import { Plus } from 'lucide-react';
import {
  ZONE_CONFIGS,
  parseHumanityLoss,
  type AnatomicalZoneKey,
  type CyberwareItemData
} from './ripperdocZones';

export interface SlotBoxProps {
  item: CyberwareItemData | undefined;
  zoneKey: AnatomicalZoneKey;
  onInspect: (item: CyberwareItemData) => void;
  onInstall: (zoneKey: AnatomicalZoneKey) => void;
}

export function SlotBox({ item, zoneKey, onInspect, onInstall }: SlotBoxProps) {
  const isInstalled = Boolean(item);
  const zoneCfg = ZONE_CONFIGS[zoneKey];

  if (isInstalled && item) {
    const avgLoss = parseHumanityLoss(item.humanityLoss, 'average').amount;
    return (
      <button
        onClick={() => onInspect(item)}
        className="group relative w-16 h-16 sm:w-20 sm:h-20 bg-[#12141c] hover:bg-[#1c202e] border-2 border-[#f59e0b]/80 hover:border-[#f59e0b] p-1.5 flex flex-col justify-between rounded-xs transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:shadow-[0_0_18px_rgba(245,158,11,0.5)] overflow-hidden"
        title={`${item.name} (Clic para inspeccionar / desinstalar)`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[9px] font-mono-code font-bold text-[#f59e0b] uppercase tracking-tighter">
            {item.install}
          </span>
          <span className="text-[9px] font-mono-code bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] px-1 rounded-2xs font-black">
            -{avgLoss}H
          </span>
        </div>

        <div className="flex flex-col items-center justify-center my-auto">
          <div className="text-[#f59e0b] group-hover:scale-110 transition-transform">
            {zoneCfg.icon}
          </div>
          <span className="text-[10px] font-tech font-bold text-white leading-tight text-center line-clamp-1 mt-1">
            {item.name}
          </span>
        </div>

        <div className="w-full text-center">
          <span className="text-[8px] font-mono-code text-[#94a3b8] truncate block">
            {item.cost} €$
          </span>
        </div>

        {/* Chamfer corner mark */}
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#f59e0b] rotate-45 transform origin-center" />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        onInstall(zoneKey);
      }}
      className="group relative w-16 h-16 sm:w-20 sm:h-20 bg-[#0c0d12] hover:bg-[#161822] border border-dashed border-[#dc2626]/40 hover:border-[#dc2626] p-1.5 flex flex-col items-center justify-center rounded-xs transition-all cursor-pointer overflow-hidden shadow-inner"
      title="Ranura libre (Clic para instalar implante)"
    >
      <div className="w-full h-full flex flex-col items-center justify-center text-[#64748b] group-hover:text-[#dc2626] transition-colors relative">
        {/* Subtle diagonal crossed line */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 100 100">
          <line x1="0" y1="0" x2="100" y2="100" stroke="#dc2626" strokeWidth="1" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#dc2626" strokeWidth="1" />
        </svg>

        <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
        <span className="text-[9px] font-tech uppercase tracking-wider font-bold mt-1 text-[#64748b] group-hover:text-white">
          VACÍO
        </span>
        <span className="text-[8px] font-mono-code text-[#475569] group-hover:text-[#dc2626]">
          + INSTALAR
        </span>
      </div>
    </button>
  );
}
