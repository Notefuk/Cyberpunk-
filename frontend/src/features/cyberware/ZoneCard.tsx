import { Info } from 'lucide-react';
import {
  ZONE_CONFIGS,
  renderCategoryFloatingTooltip,
  type AnatomicalZoneKey,
  type CyberwareItemData
} from './ripperdocZones';
import { SlotBox } from './SlotBox';

export interface ZoneCardProps {
  zoneKey: AnatomicalZoneKey;
  installed: CyberwareItemData[];
  hoveredZone: AnatomicalZoneKey | null;
  selectedZone: AnatomicalZoneKey | null;
  hoveredCategoryTooltipKey: string | null;
  setHoveredZone: (zone: AnatomicalZoneKey | null) => void;
  setSelectedZone: (zone: AnatomicalZoneKey | null) => void;
  setHoveredCategoryTooltipKey: (key: string | null) => void;
  onInspect: (item: CyberwareItemData) => void;
  onInstall: (zoneKey: AnatomicalZoneKey) => void;
}

export function ZoneCard({
  zoneKey,
  installed,
  hoveredZone,
  selectedZone,
  hoveredCategoryTooltipKey,
  setHoveredZone,
  setSelectedZone,
  setHoveredCategoryTooltipKey,
  onInspect,
  onInstall
}: ZoneCardProps) {
  const zoneCfg = ZONE_CONFIGS[zoneKey];
  const slots = Array.from({ length: zoneCfg.maxSlots }).map((_, i) => installed[i]);
  const isHovered = hoveredZone === zoneKey;
  const isSelected = selectedZone === zoneKey;

  return (
    <div
      key={zoneKey}
      onMouseEnter={() => setHoveredZone(zoneKey)}
      onMouseLeave={() => setHoveredZone(null)}
      onClick={() => setSelectedZone(zoneKey)}
      className={`p-3 rounded-xs border transition-all duration-200 relative bg-[#0e1017]/90 ${
        isHovered || isSelected
          ? 'border-[#00f5d4] shadow-[0_0_16px_rgba(0,245,212,0.2)] bg-[#121520]'
          : 'border-[#1e2230] hover:border-[#38bdf8]/60'
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#1b1f2c] pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-2xs bg-[#171a26] border border-[#23283a]">
            {zoneCfg.icon}
          </span>
          <div 
            className="relative cursor-help"
            onMouseEnter={() => setHoveredCategoryTooltipKey(zoneKey)}
            onMouseLeave={() => setHoveredCategoryTooltipKey(null)}
          >
            <h4 className="font-tech text-xs sm:text-sm font-bold text-white tracking-wider flex items-center gap-1.5 hover:text-[#00f5d4] transition-colors">
              {zoneCfg.title}
              <Info className="w-3 h-3 text-[#64748b]" />
            </h4>
            <p className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-tighter">
              {zoneCfg.sub}
            </p>
            {hoveredCategoryTooltipKey === zoneKey && renderCategoryFloatingTooltip(zoneKey)}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-2xs bg-[#151824] border border-[#222738] text-[#94a3b8]">
            {installed.length} / {zoneCfg.maxSlots}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInstall(zoneKey);
            }}
            className="px-2 py-0.5 bg-[#dc2626]/20 hover:bg-[#dc2626] text-[#dc2626] hover:text-white border border-[#dc2626]/40 text-[10px] font-tech font-bold uppercase rounded-2xs transition-colors cursor-pointer"
          >
            + Catálogo
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-start items-center">
        {slots.map((item, idx) => (
        <SlotBox
          key={item ? `${zoneKey}-slot-${idx}` : `${zoneKey}-empty-${idx}`}
          item={item}
          zoneKey={zoneKey}
          onInspect={onInspect}
          onInstall={onInstall}
        />
      ))}
      </div>
    </div>
  );
}
