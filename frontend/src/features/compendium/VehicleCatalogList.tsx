// [Claude Code · 2026-11-06] v5.13.0 (plan 26): lista de vehículos con filtros, compartida por el Compendium
// (solo lectura, con los genéricos del Core) y el garaje (con botones de compra / Family Motorpool).
import { useMemo, useState, type ReactNode } from 'react';
import { BLACK_CHROME_VEHICLES, type BlackChromeVehicle } from '../../data/blackChromeVehicles';
import { CORE_VEHICLES } from '../../data/creation';

type ClassFilter = 'all' | 'air' | 'land' | 'sea';
type BookFilter = 'all' | 'core' | 'bc';

interface Row {
  key: string;
  book: 'core' | 'bc';
  name: string;
  company: string;
  vehicleClass: 'air' | 'land' | 'sea';
  baseType: string;
  nomadAccess: string;
  sdp: number;
  seats: string;
  speed: string;
  cost: number;
  costTier: string;
  upgrades: string[];
  notes: string[];
  page: string;
  booth: string[];
  summary: string;
  bc?: BlackChromeVehicle;
}

function countUpgrades(list: string[]): string[] {
  const counts = new Map<string, number>();
  for (const u of list) counts.set(u, (counts.get(u) ?? 0) + 1);
  return [...counts.entries()].map(([u, n]) => (n > 1 ? `${u} x${n}` : u));
}

const BC_ROWS: Row[] = BLACK_CHROME_VEHICLES.map((v) => ({
  key: v.id,
  book: 'bc',
  name: v.name,
  company: v.company,
  vehicleClass: v.vehicleClass,
  baseType: v.baseType,
  nomadAccess: v.nomadAccess === null ? 'N/A' : String(v.nomadAccess),
  sdp: v.sdp,
  seats: String(v.seats),
  speed: `${v.combatSpeed} (${v.narrativeSpeed})`,
  cost: v.cost,
  costTier: v.priceCategory,
  upgrades: countUpgrades(v.upgrades),
  notes: v.notes,
  page: `Black Chrome p.${v.sourcePage}`,
  booth: v.booth,
  summary: v.summaryEs,
  bc: v,
}));

const CORE_ROWS: Row[] = CORE_VEHICLES.vehicles.map((v) => ({
  key: `core-${v.name}`,
  book: 'core',
  name: v.name,
  company: 'Genérico',
  vehicleClass: v.category === 'air' ? 'air' : v.category === 'sea' ? 'sea' : 'land',
  baseType: v.name,
  nomadAccess: `Motorpool ${v.familyMotorpoolRank}`,
  sdp: v.sdp,
  seats: v.seats,
  speed: `${v.combatSpeed} (${v.narrativeSpeed})`,
  cost: v.costEb,
  costTier: v.costTier,
  upgrades: [],
  notes: v.costNote ? [v.costNote] : [],
  page: `Core p.${v.page}`,
  booth: [],
  summary: v.description,
}));

const CLASS_LABEL: Record<Row['vehicleClass'], string> = { air: 'Aéreo', land: 'Terrestre', sea: 'Acuático' };

export function VehicleCatalogList({ includeCore = false, renderActions }: {
  includeCore?: boolean;
  /** Botones por vehículo de Black Chrome (garaje). Sin esto, la lista es de solo lectura. */
  renderActions?: (veh: BlackChromeVehicle) => ReactNode;
}) {
  const [cls, setCls] = useState<ClassFilter>('all');
  const [book, setBook] = useState<BookFilter>('all');
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const all = includeCore ? [...CORE_ROWS, ...BC_ROWS] : BC_ROWS;
    const needle = q.trim().toLowerCase();
    return all.filter((r) =>
      (cls === 'all' || r.vehicleClass === cls) &&
      (!includeCore || book === 'all' || r.book === book) &&
      (!needle || `${r.name} ${r.company} ${r.baseType}`.toLowerCase().includes(needle)));
  }, [includeCore, cls, book, q]);

  const chip = (active: boolean) =>
    `px-2 py-0.5 rounded-xs text-[10px] font-tech font-bold uppercase cursor-pointer border ${active ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8]' : 'bg-[#10141f] border-[#1b2336] text-[#94a3b8] hover:text-white'}`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar vehículo..."
          className="bg-[#10141f] border border-[#1b2336] rounded-xs px-2 py-1 text-[11px] font-mono-code text-white w-full sm:w-48"
        />
        {(['all', 'land', 'air', ...(includeCore ? ['sea'] as const : [])] as ClassFilter[]).map((c) => (
          <button key={c} className={chip(cls === c)} onClick={() => setCls(c)}>
            {c === 'all' ? 'Todos' : CLASS_LABEL[c]}
          </button>
        ))}
        {includeCore && (['all', 'core', 'bc'] as BookFilter[]).map((b) => (
          <button key={b} className={chip(book === b)} onClick={() => setBook(b)}>
            {b === 'all' ? 'Todos los libros' : b === 'core' ? 'Core' : 'Black Chrome'}
          </button>
        ))}
        <span className="text-[10px] font-mono-code text-[#64748b]">{rows.length} vehículos</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map((r) => (
          <div key={r.key} className="bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-tech text-xs font-bold text-white uppercase">{r.name}</span>
                <span className="shrink-0 text-[9px] font-mono-code px-1.5 py-0.5 rounded-xs bg-[#1a2030] text-[#38bdf8] font-bold">
                  {CLASS_LABEL[r.vehicleClass]}
                </span>
              </div>
              <div className="text-[10px] font-mono-code text-[#64748b]">
                {r.company}{r.book === 'bc' ? ` • ${r.baseType}` : ''} • {r.page}
              </div>
              <span className="text-[10px] font-mono-code text-[#f59e0b] block mt-0.5">
                {r.cost.toLocaleString()} €$ • {r.costTier}
              </span>
              <div className="text-[10px] font-mono-code text-[#94a3b8] space-y-0.5 mt-1.5">
                <div>
                  SDP: <strong className="text-white">{r.sdp}</strong> • Plazas: <strong className="text-white">{r.seats}</strong> •{' '}
                  {r.book === 'bc' ? 'Nomad Access' : ''} <strong className="text-[#f97316]">{r.nomadAccess}</strong>
                </div>
                <div>Velocidad: {r.speed}</div>
                {r.upgrades.length > 0 && <div>Mejoras: <span className="text-white">{r.upgrades.join(' • ')}</span></div>}
                {r.notes.length > 0 && <div>Notas: {r.notes.join(' • ')}</div>}
                {r.booth.length > 0 && <div>Night Market: puesto {r.booth.join(' / ')}</div>}
              </div>
              <p className="text-[10px] font-mono-code text-[#64748b] mt-1.5">{r.summary}</p>
            </div>
            {renderActions && r.bc && (
              <div className="flex items-center gap-2 pt-2 border-t border-[#1b2234]">{renderActions(r.bc)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
