import { Plus } from 'lucide-react';
import type { CSSProperties } from 'react';
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
  /** Miniatura opcional (fase 4: arte del Mission Kit). Si existe reemplaza al ícono de la zona. */
  artUrl?: string;
}

const SIZE = 'w-20 h-20 sm:w-24 sm:h-24 xl:w-14 xl:h-14';

export function SlotBox({ item, zoneKey, onInspect, onInstall, artUrl }: SlotBoxProps) {
  const zoneCfg = ZONE_CONFIGS[zoneKey];
  const color = zoneCfg.color ?? '#00f5d4';

  if (item) {
    const avgLoss = parseHumanityLoss(item.humanityLoss, 'average').amount;
    return (
      <span className="inline-block" style={{ filter: `drop-shadow(0 0 5px ${color}66)` }}>
        <button
          type="button"
          onClick={() => onInspect(item)}
          aria-label={item.name}
          title={`${item.name} (Clic para inspeccionar / desinstalar)`}
          style={{ '--slot-c': color } as CSSProperties}
          className={`group chamfer-slot ${SIZE} block p-px bg-[var(--slot-c)] hover:bg-[#fcee0a] transition-colors cursor-pointer`}
        >
          <div
            className="chamfer-slot-inner w-full h-full p-1.5 xl:p-0.5 flex flex-col justify-between"
            style={{ background: `linear-gradient(160deg, ${color}26 0%, #0c0d12 75%)` }}
          >
            <div className="flex items-start justify-between xl:justify-end w-full gap-1">
              <span
                className="xl:hidden text-[8px] font-mono-code font-bold uppercase tracking-tighter leading-none truncate"
                style={{ color }}
              >
                {item.install}
              </span>
              <span className="text-[8px] xl:text-[7px] font-mono-code bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] px-0.5 font-black leading-none shrink-0">
                -{avgLoss} HL
              </span>
            </div>

            <div
              className="flex-1 min-h-0 flex items-center justify-center overflow-hidden [&>svg]:w-7 [&>svg]:h-7 group-hover:scale-110 transition-transform"
              style={{ color }}
            >
              {artUrl ? (
                <img src={artUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                zoneCfg.icon
              )}
            </div>

            <div className="w-full text-center xl:hidden">
              <span className="text-[9px] font-tech font-bold text-white leading-tight line-clamp-2 block">
                {item.name}
              </span>
              <span className="text-[8px] font-mono-code text-[#94a3b8] truncate block">
                {item.cost} €$
              </span>
            </div>
          </div>
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        onInstall(zoneKey);
      }}
      aria-label={`Slot vacío de ${zoneCfg.title}`}
      title="Ranura libre (Clic para instalar implante)"
      style={{ '--slot-c': `${color}40` } as CSSProperties}
      className={`group chamfer-slot ${SIZE} block p-px bg-[var(--slot-c)] hover:bg-[#fcee0a] transition-colors cursor-pointer`}
    >
      <div
        className="chamfer-slot-inner w-full h-full flex flex-col items-center justify-center text-[#64748b] group-hover:text-[#fcee0a] transition-colors"
        style={{
          backgroundColor: '#0c0d12',
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 7px)'
        }}
      >
        <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
        <span className="text-[8px] font-tech uppercase tracking-wider font-bold mt-1 group-hover:hidden">
          VACÍO
        </span>
        <span className="text-[8px] font-tech uppercase tracking-wider font-bold mt-1 hidden group-hover:block">
          INSTALAR
        </span>
      </div>
    </button>
  );
}
