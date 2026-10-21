import type { KeyboardEvent } from 'react';
import { ZONE_CONFIGS, ZONE_HOTSPOTS, type AnatomicalZoneKey, type ZoneHotspot } from './ripperdocZones';

export interface HoloBodyProps {
  hoveredZone: AnatomicalZoneKey | null;
  selectedZone: AnatomicalZoneKey | null;
  installedCountByZone: Record<AnatomicalZoneKey, number>;
  setHoveredZone: (zone: AnatomicalZoneKey | null) => void;
  setSelectedZone: (zone: AnatomicalZoneKey | null) => void;
}

const CYAN = '#00f5d4';
const SKY = '#38bdf8';

// Mitad izquierda (vista del espectador) del contorno, desde la coronilla hasta la entrepierna.
// La mitad derecha es su espejo respecto de x=210.
const HALF_OUTLINE =
  'M 210 18 C 197 18 187 27 186 42 C 185 52 184 58 185 66 C 186 76 189 84 190 88 L 194 96 ' +
  'C 195 104 195 110 194 114 C 180 118 168 120 158 126 ' +
  // brazo (hombro, codo, muñeca, mano con dedos)
  'C 148 129 142 138 139 150 C 136 170 131 192 126 212 C 122 236 116 264 112 290 ' +
  'C 108 302 105 316 105 330 Q 103 342 107 350 Q 111 353 113 347 Q 115 355 119 351 Q 123 347 122 338 ' +
  'C 124 326 126 314 127 300 C 128 272 138 244 146 216 C 150 196 156 176 162 158 ' +
  // torso, cintura y cadera
  'C 166 180 170 200 174 222 C 176 250 172 270 168 296 ' +
  // pierna (muslo, rodilla, pantorrilla, tobillo, pie)
  'C 164 330 164 400 172 470 C 168 500 166 525 172 560 C 176 580 178 598 178 612 ' +
  'C 176 630 170 642 166 650 C 164 656 168 660 176 660 L 200 660 C 204 658 204 652 202 646 ' +
  'C 198 634 196 622 196 610 C 196 590 194 570 192 550 C 190 520 190 500 190 474 ' +
  'C 194 440 200 400 206 358 L 210 342';
const HALF_CLOSED = `${HALF_OUTLINE} Z`;
const CHIN = 'M 190 88 C 196 94 203 97 210 97';
const MIRROR = 'translate(420 0) scale(-1 1)';

// Zonas con línea guía: carril horizontal (y) por zona. El lado sale de ZONE_CONFIGS.
const GUIDE_LANE_Y: Partial<Record<AnatomicalZoneKey, number>> = {
  neuralware: 28,
  internal: 168,
  external: 214,
  cyberarms: 300,
  cyberoptics: 40,
  cyberaudio: 84,
  borgware: 150,
  cyberlegs: 480
};
const GUIDE_EDGE_X = { left: 40, right: 380 } as const;

const HOTSPOT_ENTRIES = Object.entries(ZONE_HOTSPOTS) as [AnatomicalZoneKey, ZoneHotspot][];

function guidePath(key: AnatomicalZoneKey, marker: { x: number; y: number }): string | null {
  const side = ZONE_CONFIGS[key].side;
  const laneY = GUIDE_LANE_Y[key];
  if (side === 'bottom' || laneY === undefined) return null;
  const dx = Math.abs(laneY - marker.y);
  const elbowX = side === 'left' ? marker.x - dx : marker.x + dx;
  return `M ${marker.x} ${marker.y} L ${elbowX} ${laneY} L ${GUIDE_EDGE_X[side]} ${laneY}`;
}

const RIB_PATHS = Array.from({ length: 7 }, (_, i) => {
  const y = 134 + i * 10;
  return `M 207 ${y} C 198 ${y - 2} 188 ${y + 2} ${182 + i * 1.5} ${y + 12}`;
});

// Detalles internos de una mitad (se dibujan también espejados).
function HalfDetails() {
  return (
    <g fill="none" stroke={CYAN} strokeWidth="0.8" strokeOpacity="0.35">
      {/* cráneo y cerebro */}
      <path d="M 192 52 C 190 36 198 26 210 26" />
      <path d="M 210 30 C 204 32 198 36 196 42 M 210 38 C 205 40 200 44 200 48 M 204 28 C 198 30 193 38 193 46" />
      {/* clavícula, esternón y costillas */}
      <path d="M 210 124 C 196 124 176 126 160 132" />
      <path d="M 210 130 L 210 190" />
      {RIB_PATHS.map((d, i) => (
        <path key={`rib-${i}`} d={d} />
      ))}
      {/* pelvis */}
      <path d="M 210 318 C 196 306 180 308 176 318 C 174 330 182 342 196 346 C 204 348 208 346 210 344" />
      {/* huesos largos */}
      <path d="M 150 144 L 136 212 L 119 292" strokeOpacity="0.25" />
      <path d="M 190 332 L 181 472 L 187 610" strokeOpacity="0.25" />
      {/* articulaciones */}
      <g strokeOpacity="0.55">
        <circle cx="150" cy="142" r="5" />
        <circle cx="136" cy="213" r="4.5" />
        <circle cx="119" cy="293" r="4" />
        <circle cx="190" cy="331" r="5.5" />
        <circle cx="181" cy="472" r="5" />
        <circle cx="187" cy="610" r="4" />
      </g>
    </g>
  );
}

const SPINE_Y = Array.from({ length: 18 }, (_, i) => 106 + i * 11);
const RULER_TICKS = Array.from({ length: 10 }, (_, i) => i * 20); // 0..180 cm

export function HoloBody({
  hoveredZone,
  selectedZone,
  installedCountByZone,
  setHoveredZone,
  setSelectedZone
}: HoloBodyProps) {
  const onKey = (e: KeyboardEvent<SVGGElement>, key: AnatomicalZoneKey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedZone(key);
    }
  };

  return (
    <svg
      viewBox="0 0 420 680"
      className="w-full h-auto max-h-[620px] select-none cursor-crosshair z-0"
    >
      <defs>
        <filter id="holo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="holo-body-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CYAN} stopOpacity="0.08" />
          <stop offset="100%" stopColor={SKY} stopOpacity="0.04" />
        </linearGradient>

        <linearGradient id="holo-scan-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CYAN} stopOpacity="0" />
          <stop offset="85%" stopColor={CYAN} stopOpacity="0.28" />
          <stop offset="100%" stopColor="#e6fffb" stopOpacity="0.8" />
        </linearGradient>

        <pattern id="holo-hex" width="13.856" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M0 8 L6.928 4 L13.856 8 M6.928 4 L6.928 0 M0 16 L6.928 20 L13.856 16 M6.928 20 L6.928 24 M0 8 L0 16 M13.856 8 L13.856 16"
            fill="none"
            stroke={CYAN}
            strokeWidth="0.6"
            strokeOpacity="0.5"
          />
        </pattern>

        <clipPath id="holo-clip">
          <path d={HALF_CLOSED} />
          <path d={HALF_CLOSED} transform={MIRROR} />
        </clipPath>
      </defs>

      {/* Marcas de retícula en las esquinas */}
      <g fill="none" stroke={SKY} strokeWidth="1.2" strokeOpacity="0.5" pointerEvents="none">
        <path d="M 6 20 L 6 6 L 20 6" />
        <path d="M 400 6 L 414 6 L 414 20" />
        <path d="M 6 660 L 6 674 L 20 674" />
        <path d="M 414 660 L 414 674 L 400 674" />
      </g>

      {/* Regla vertical de altura (0-180 cm) */}
      <g pointerEvents="none" stroke={SKY} strokeOpacity="0.4" strokeWidth="0.8">
        <line x1="20" y1="20" x2="20" y2="660" />
        {RULER_TICKS.map((cm) => {
          const y = 660 - (cm * 640) / 180;
          return (
            <g key={`tick-${cm}`}>
              <line x1="14" y1={y} x2="26" y2={y} />
              <text
                x="29"
                y={y + 3}
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
                fill={SKY}
                fillOpacity="0.55"
                stroke="none"
              >
                {cm}
              </text>
            </g>
          );
        })}
      </g>

      {/* Plataforma base */}
      <ellipse
        cx="210"
        cy="664"
        rx="92"
        ry="8"
        fill="none"
        stroke={CYAN}
        strokeWidth="0.8"
        strokeDasharray="3 5"
        strokeOpacity="0.35"
        pointerEvents="none"
      />

      {/* Líneas guía */}
      <g fill="none" pointerEvents="none">
        {HOTSPOT_ENTRIES.map(([key, hs]) => {
          const d = guidePath(key, hs.marker);
          if (!d) return null;
          const active = hoveredZone === key || selectedZone === key;
          const color = ZONE_CONFIGS[key].color ?? CYAN;
          const side = ZONE_CONFIGS[key].side;
          const edge = side === 'left' ? GUIDE_EDGE_X.left : GUIDE_EDGE_X.right;
          return (
            <g key={`guide-${key}`}>
              <path
                d={d}
                stroke={active ? color : SKY}
                strokeOpacity={active ? 0.95 : 0.22}
                strokeWidth={active ? 1.4 : 0.8}
                filter={active ? 'url(#holo-glow)' : undefined}
              />
              <circle
                cx={edge}
                cy={GUIDE_LANE_Y[key]}
                r={active ? 3 : 2}
                fill={active ? color : SKY}
                fillOpacity={active ? 1 : 0.3}
                stroke="none"
              />
            </g>
          );
        })}
      </g>

      {/* Holograma: silueta, rejilla, detalles internos y escaneo */}
      <g className="holo-flicker" pointerEvents="none">
        <g clipPath="url(#holo-clip)">
          <path d={HALF_CLOSED} fill="url(#holo-body-fill)" />
          <path d={HALF_CLOSED} fill="url(#holo-body-fill)" transform={MIRROR} />
          <rect x="90" y="10" width="240" height="660" fill="url(#holo-hex)" opacity="0.2" />
          <rect className="holo-scanline" x="90" y="-36" width="240" height="36" fill="url(#holo-scan-grad)" />
        </g>

        <g fill="none" stroke={CYAN} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" filter="url(#holo-glow)">
          <path d={HALF_OUTLINE} />
          <path d={HALF_OUTLINE} transform={MIRROR} />
          <path d={CHIN} />
          <path d={CHIN} transform={MIRROR} />
        </g>

        <HalfDetails />
        <g transform={MIRROR}>
          <HalfDetails />
        </g>

        {/* Columna vertebral */}
        <g fill="none" stroke={CYAN} strokeWidth="0.8" strokeOpacity="0.4">
          {SPINE_Y.map((y) => (
            <rect key={`vert-${y}`} x="206" y={y} width="8" height="7" rx="1.5" />
          ))}
          <path d="M 210 98 L 210 300" strokeOpacity="0.2" />
          <path d="M 210 58 L 210 72" strokeOpacity="0.25" />
        </g>
      </g>

      {/* Hotspots interactivos */}
      {HOTSPOT_ENTRIES.map(([key, hs]) => {
        const cfg = ZONE_CONFIGS[key];
        const color = cfg.color ?? CYAN;
        const active = hoveredZone === key || selectedZone === key;
        return (
          <g
            key={`hotspot-${key}`}
            role="button"
            tabIndex={0}
            aria-label={cfg.title}
            className="cursor-pointer outline-none"
            pointerEvents="all"
            onMouseEnter={() => setHoveredZone(key)}
            onMouseLeave={() => setHoveredZone(null)}
            onFocus={() => setHoveredZone(key)}
            onBlur={() => setHoveredZone(null)}
            onClick={() => setSelectedZone(key)}
            onKeyDown={(e) => onKey(e, key)}
          >
            {hs.shapes.map((d, i) => (
              <path
                key={`${key}-shape-${i}`}
                d={d}
                fill={active ? color : 'transparent'}
                fillOpacity={active ? 0.25 : 1}
                stroke={active ? color : 'transparent'}
                strokeWidth={active ? 1.8 : 6}
                strokeLinejoin="round"
                filter={active ? 'url(#holo-glow)' : undefined}
              />
            ))}
          </g>
        );
      })}

      {/* Marcadores y badges (no interceptan el puntero) */}
      <g pointerEvents="none">
        {HOTSPOT_ENTRIES.map(([key, hs]) => {
          const color = ZONE_CONFIGS[key].color ?? CYAN;
          const count = installedCountByZone[key] ?? 0;
          const { x, y } = hs.marker;
          return (
            <g key={`marker-${key}`}>
              {selectedZone === key && (
                <>
                  <circle className="holo-pulse" cx={x} cy={y} r="11" fill="none" stroke={color} strokeWidth="1.5" />
                  <circle cx={x} cy={y} r="11" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.8" />
                  {count === 0 && <circle cx={x} cy={y} r="2.5" fill={color} />}
                </>
              )}
              {count > 0 && (
                <>
                  <circle cx={x} cy={y} r="7.5" fill="#06080d" fillOpacity="0.9" stroke={color} strokeWidth="1.4" />
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace"
                    fill={color}
                  >
                    {count}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
