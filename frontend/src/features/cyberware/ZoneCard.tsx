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
  const color = zoneCfg.color ?? '#00f5d4';
  const slots = Array.from({ length: zoneCfg.maxSlots }).map((_, i) => installed[i]);
  const isHovered = hoveredZone === zoneKey;
  const isSelected = selectedZone === zoneKey;
  const active = isHovered || isSelected;

  return (
    <div
      key={zoneKey}
      data-zone-card={zoneKey}
      onMouseEnter={() => setHoveredZone(zoneKey)}
      onMouseLeave={() => setHoveredZone(null)}
      onClick={() => setSelectedZone(zoneKey)}
      style={active ? { borderColor: color, boxShadow: `0 0 16px ${color}33` } : undefined}
      className={`p-3 xl:p-2 rounded-xs border transition-all duration-200 relative z-10 bg-[#0e1017]/90 ${
        active ? '' : 'border-[#1e2230]'
      }`}
    >
      <div className="flex items-stretch justify-between gap-2 border-b border-[#1b1f2c] pb-2 mb-2.5">
        <div className="flex items-stretch gap-2 min-w-0">
          <span className="w-1 shrink-0 rounded-2xs" style={{ backgroundColor: color }} />
          <span className="p-1 rounded-2xs bg-[#171a26] border border-[#23283a] self-center">
            {zoneCfg.icon}
          </span>
          <div
            className="relative cursor-help"
            onMouseEnter={() => setHoveredCategoryTooltipKey(zoneKey)}
            onMouseLeave={() => setHoveredCategoryTooltipKey(null)}
          >
            <h4 className="font-tech text-xs sm:text-sm font-bold text-white tracking-wider flex items-center gap-1.5 transition-colors">
              {zoneCfg.title}
              <Info className="w-3 h-3 text-[#64748b]" />
            </h4>
            <p className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-tighter">
              {zoneCfg.sub}
            </p>
            {hoveredCategoryTooltipKey === zoneKey && renderCategoryFloatingTooltip(zoneKey)}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-1.5 shrink-0">
          <div
            className="flex items-center gap-[3px]"
            role="img"
            aria-label={`${installed.length} de ${zoneCfg.maxSlots} slots ocupados`}
          >
            {slots.map((s, i) => (
              <span
                key={`seg-${zoneKey}-${i}`}
                className="w-2 h-2 border"
                style={
                  s
                    ? { backgroundColor: color, borderColor: color }
                    : { backgroundColor: 'transparent', borderColor: `${color}55` }
                }
              />
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInstall(zoneKey);
            }}
            className="px-2 py-0.5 bg-transparent hover:bg-[#fcee0a] text-[#fcee0a] hover:text-black border border-[#fcee0a] text-[10px] font-tech font-bold uppercase rounded-2xs transition-colors cursor-pointer"
          >
            + Catálogo
          </button>
        </div>
      </div>

      <div className="flex flex-wrap xl:flex-nowrap gap-2 xl:gap-1.5 justify-start items-center">
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
