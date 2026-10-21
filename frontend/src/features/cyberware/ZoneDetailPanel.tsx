import {
  ZONE_CONFIGS,
  parseHumanityLoss,
  type AnatomicalZoneKey,
  type CyberwareItemData
} from './ripperdocZones';

export interface ZoneDetailPanelProps {
  selectedZone: AnatomicalZoneKey | null;
  installed: CyberwareItemData[];
  onInspect: (item: CyberwareItemData) => void;
  onInstall: (zoneKey: AnatomicalZoneKey) => void;
}

export function ZoneDetailPanel({ selectedZone, installed, onInspect, onInstall }: ZoneDetailPanelProps) {
  if (!selectedZone) {
    return (
      <div className="w-full mt-2 border border-dashed border-[#1e2230] bg-[#0c0e14]/80 py-4 text-center z-10">
        <span className="font-tech text-[11px] tracking-[0.25em] text-[#64748b] uppercase">
          SELECCIONÁ UNA ZONA DEL CUERPO
        </span>
      </div>
    );
  }

  const cfg = ZONE_CONFIGS[selectedZone];
  const color = cfg.color ?? '#00f5d4';

  return (
    <div
      className="w-full mt-2 border bg-[#0c0e14]/90 p-3 z-10 text-left"
      style={{ borderColor: `${color}66`, boxShadow: `0 0 14px ${color}22` }}
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#1b1f2c] pb-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1 h-8 shrink-0" style={{ backgroundColor: color }} />
          <div className="min-w-0">
            <h4 className="font-tech text-sm font-bold tracking-wider truncate" style={{ color }}>
              {cfg.title}
            </h4>
            <p className="text-[10px] font-mono-code text-[#64748b] uppercase truncate">{cfg.sub}</p>
          </div>
        </div>
        <span className="text-[11px] font-mono-code text-[#94a3b8] shrink-0">
          {installed.length} / {cfg.maxSlots} SLOTS
        </span>
      </div>

      {installed.length === 0 ? (
        <p className="text-[11px] font-mono-code text-[#64748b] py-2">Sin implantes instalados en esta zona.</p>
      ) : (
        <ul className="space-y-1.5">
          {installed.map((item) => {
            const hl = parseHumanityLoss(item.humanityLoss, 'average').amount;
            return (
              <li key={`detail-${selectedZone}-${item.id}`}>
                <button
                  type="button"
                  onClick={() => onInspect(item)}
                  className="w-full text-left p-2 bg-[#12141c] hover:bg-[#1a1e2a] border border-[#1e2230] hover:border-[#fcee0a] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-tech text-xs font-bold text-white truncate">{item.name}</span>
                    <span className="text-[10px] font-mono-code text-[#ef4444] font-black shrink-0">-{hl} HL</span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-mono-code uppercase mt-0.5">
                    <span style={{ color }}>{item.type}</span>
                    <span className="text-[#94a3b8]">{item.install}</span>
                    <span className="text-[#94a3b8] ml-auto">{item.cost} €$</span>
                  </div>
                  <p className="text-[10px] text-[#94a3b8] mt-1 line-clamp-2">{item.description}</p>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={() => onInstall(selectedZone)}
        className="mt-2.5 w-full py-1.5 bg-transparent hover:bg-[#fcee0a] text-[#fcee0a] hover:text-black border border-[#fcee0a] text-[11px] font-tech font-bold uppercase tracking-wider transition-colors cursor-pointer"
      >
        + INSTALAR EN ESTA ZONA
      </button>
    </div>
  );
}
