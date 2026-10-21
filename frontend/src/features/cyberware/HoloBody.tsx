import type { AnatomicalZoneKey } from './ripperdocZones';

export interface HoloBodyProps {
  hoveredZone: AnatomicalZoneKey | null;
  setHoveredZone: (zone: AnatomicalZoneKey | null) => void;
  setSelectedZone: (zone: AnatomicalZoneKey | null) => void;
}

export function HoloBody({ hoveredZone, setHoveredZone, setSelectedZone }: HoloBodyProps) {
  return (
      <svg
        viewBox="0 0 420 680"
        className="w-full h-auto max-h-[620px] select-none cursor-crosshair z-0"
      >
        <defs>
          <linearGradient id="holoGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00f5d4" stopOpacity="0.1" />
          </linearGradient>

          <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00f5d4" strokeWidth="0.5" strokeOpacity="0.1" />
          </pattern>
        </defs>

        {/* Background grid cylinder */}
        <circle cx="210" cy="340" r="180" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 6" opacity="0.4" />
        <circle cx="210" cy="340" r="120" fill="none" stroke="#00f5d4" strokeWidth="0.8" strokeDasharray="4 8" opacity="0.2" />

        {/* --- CALLOUT LINES WITH ANIMATED PARTICLES & ARROWS --- */}
        {/* Callout 1: Cranium -> Left Neuralware */}
        <g
          className="cursor-pointer transition-opacity"
          onMouseEnter={() => setHoveredZone('neuralware')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('neuralware')}
        >
          <path
            d="M 200 60 L 90 60 L 15 70"
            fill="none"
            stroke={hoveredZone === 'neuralware' ? '#38bdf8' : '#273549'}
            strokeWidth={hoveredZone === 'neuralware' ? '2.5' : '1.2'}
            strokeDasharray={hoveredZone === 'neuralware' ? '6 3' : 'none'}
          />
          <circle cx="200" cy="60" r="4" fill="#38bdf8" />
          <circle cx="15" cy="70" r="3" fill="#38bdf8" />
        </g>

        {/* Callout 2: Arms -> Left Cyberarms */}
        <g
          className="cursor-pointer transition-opacity"
          onMouseEnter={() => setHoveredZone('cyberarms')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('cyberarms')}
        >
          <path
            d="M 85 290 L 40 290 L 15 230"
            fill="none"
            stroke={hoveredZone === 'cyberarms' ? '#f59e0b' : '#273549'}
            strokeWidth={hoveredZone === 'cyberarms' ? '2.5' : '1.2'}
            strokeDasharray={hoveredZone === 'cyberarms' ? '6 3' : 'none'}
          />
          <circle cx="85" cy="290" r="4" fill="#f59e0b" />
          <circle cx="15" cy="230" r="3" fill="#f59e0b" />
        </g>

        {/* Callout 3: Internal -> Left Skeleton & Internal */}
        <g
          className="cursor-pointer transition-opacity"
          onMouseEnter={() => setHoveredZone('internal')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('internal')}
        >
          <path
            d="M 185 180 L 110 180 L 15 390"
            fill="none"
            stroke={hoveredZone === 'internal' ? '#ef4444' : '#273549'}
            strokeWidth={hoveredZone === 'internal' ? '2.5' : '1.2'}
            strokeDasharray={hoveredZone === 'internal' ? '6 3' : 'none'}
          />
          <circle cx="185" cy="180" r="4" fill="#ef4444" />
          <circle cx="15" cy="390" r="3" fill="#ef4444" />
        </g>

        {/* Callout 4: Integumentary -> Left External */}
        <g
          className="cursor-pointer transition-opacity"
          onMouseEnter={() => setHoveredZone('external')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('external')}
        >
          <path
            d="M 170 260 L 90 260 L 15 550"
            fill="none"
            stroke={hoveredZone === 'external' ? '#00f5d4' : '#273549'}
            strokeWidth={hoveredZone === 'external' ? '2.5' : '1.2'}
            strokeDasharray={hoveredZone === 'external' ? '6 3' : 'none'}
          />
          <circle cx="170" cy="260" r="4" fill="#00f5d4" />
          <circle cx="15" cy="550" r="3" fill="#00f5d4" />
        </g>

        {/* Callout 5: Spine OS -> Right Borgware */}
        <g
          className="cursor-pointer transition-opacity"
          onMouseEnter={() => setHoveredZone('borgware')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('borgware')}
        >
          <path
            d="M 210 140 L 320 140 L 405 70"
            fill="none"
            stroke={hoveredZone === 'borgware' ? '#e11d48' : '#273549'}
            strokeWidth={hoveredZone === 'borgware' ? '2.5' : '1.2'}
            strokeDasharray={hoveredZone === 'borgware' ? '6 3' : 'none'}
          />
          <circle cx="210" cy="140" r="4" fill="#e11d48" />
          <circle cx="405" cy="70" r="3" fill="#e11d48" />
        </g>

        {/* Callout 6: Eyes -> Right Cyberoptics */}
        <g
          className="cursor-pointer transition-opacity"
          onMouseEnter={() => setHoveredZone('cyberoptics')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('cyberoptics')}
        >
          <path
            d="M 222 62 L 340 62 L 405 230"
            fill="none"
            stroke={hoveredZone === 'cyberoptics' ? '#38bdf8' : '#273549'}
            strokeWidth={hoveredZone === 'cyberoptics' ? '2.5' : '1.2'}
            strokeDasharray={hoveredZone === 'cyberoptics' ? '6 3' : 'none'}
          />
          <circle cx="222" cy="62" r="4" fill="#38bdf8" />
          <circle cx="405" cy="230" r="3" fill="#38bdf8" />
        </g>

        {/* Callout 7: Audio -> Right Cyberaudio */}
        <g
          className="cursor-pointer transition-opacity"
          onMouseEnter={() => setHoveredZone('cyberaudio')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('cyberaudio')}
        >
          <path
            d="M 242 68 L 350 68 L 405 390"
            fill="none"
            stroke={hoveredZone === 'cyberaudio' ? '#a855f7' : '#273549'}
            strokeWidth={hoveredZone === 'cyberaudio' ? '2.5' : '1.2'}
            strokeDasharray={hoveredZone === 'cyberaudio' ? '6 3' : 'none'}
          />
          <circle cx="242" cy="68" r="4" fill="#a855f7" />
          <circle cx="405" cy="390" r="3" fill="#a855f7" />
        </g>

        {/* Callout 8: Legs -> Right Cyberlegs */}
        <g
          className="cursor-pointer transition-opacity"
          onMouseEnter={() => setHoveredZone('cyberlegs')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('cyberlegs')}
        >
          <path
            d="M 250 520 L 350 520 L 405 550"
            fill="none"
            stroke={hoveredZone === 'cyberlegs' ? '#10b981' : '#273549'}
            strokeWidth={hoveredZone === 'cyberlegs' ? '2.5' : '1.2'}
            strokeDasharray={hoveredZone === 'cyberlegs' ? '6 3' : 'none'}
          />
          <circle cx="250" cy="520" r="4" fill="#10b981" />
          <circle cx="405" cy="550" r="3" fill="#10b981" />
        </g>

        {/* --- ANATOMICAL VECTOR HUMAN BODY (A-POSE) --- */}
        {/* Silhouette Outline Base */}
        <g opacity="0.3" stroke="#00f5d4" strokeWidth="1" fill="none">
          {/* Head contour */}
          <circle cx="210" cy="65" r="26" />
          {/* Torso & hips */}
          <path d="M 175 125 L 245 125 L 240 310 L 180 310 Z" />
          {/* Legs */}
          <path d="M 185 320 L 175 480 L 165 620 L 155 640" />
          <path d="M 235 320 L 245 480 L 255 620 L 265 640" />
          {/* Arms */}
          <path d="M 175 130 L 110 240 L 75 350" />
          <path d="M 245 130 L 310 240 L 345 350" />
        </g>

        {/* Head & Cranium (Neuralware & Optics layer) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('neuralware')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('neuralware')}
        >
          <ellipse
            cx="210"
            cy="65"
            rx="24"
            ry="28"
            fill={hoveredZone === 'neuralware' ? '#0284c7' : '#0f172a'}
            fillOpacity="0.6"
            stroke={hoveredZone === 'neuralware' ? '#38bdf8' : '#00f5d4'}
            strokeWidth={hoveredZone === 'neuralware' ? '2.5' : '1.5'}
            filter={hoveredZone === 'neuralware' ? 'url(#neonFilter)' : undefined}
          />
          {/* Brain Neural Grid Mesh */}
          <path
            d="M 196 55 Q 210 45 224 55 M 194 65 Q 210 58 226 65 M 198 75 Q 210 70 222 75"
            stroke={hoveredZone === 'neuralware' ? '#38bdf8' : '#38bdf8'}
            strokeWidth="1"
            fill="none"
            opacity="0.8"
          />
        </g>

        {/* Cyberoptics Eyes */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('cyberoptics')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('cyberoptics')}
        >
          <circle
            cx="202"
            cy="62"
            r="3.5"
            fill="#38bdf8"
            filter={hoveredZone === 'cyberoptics' ? 'url(#neonFilter)' : undefined}
          />
          <circle
            cx="218"
            cy="62"
            r="3.5"
            fill="#38bdf8"
            filter={hoveredZone === 'cyberoptics' ? 'url(#neonFilter)' : undefined}
          />
          <line x1="195" y1="62" x2="225" y2="62" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="1 2" />
        </g>

        {/* Cyberaudio Ear Nodes */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('cyberaudio')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('cyberaudio')}
        >
          <rect
            x="184"
            y="63"
            width="3"
            height="8"
            rx="1"
            fill="#a855f7"
            filter={hoveredZone === 'cyberaudio' ? 'url(#neonFilter)' : undefined}
          />
          <rect
            x="233"
            y="63"
            width="3"
            height="8"
            rx="1"
            fill="#a855f7"
            filter={hoveredZone === 'cyberaudio' ? 'url(#neonFilter)' : undefined}
          />
        </g>

        {/* Cervical Neck & Borgware Spine Core */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('borgware')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('borgware')}
        >
          <path
            d="M 204 93 L 216 93 L 220 125 L 200 125 Z"
            fill={hoveredZone === 'borgware' ? '#991b1b' : '#1e293b'}
            stroke={hoveredZone === 'borgware' ? '#e11d48' : '#00f5d4'}
            strokeWidth="1.2"
          />
          {/* Borgware Spine Vertebrae */}
          {Array.from({ length: 10 }).map((_, i) => (
            <rect
              key={`vert-${i}`}
              x="207"
              y={130 + i * 14}
              width="6"
              height="8"
              rx="1"
              fill={hoveredZone === 'borgware' ? '#e11d48' : '#00f5d4'}
              opacity={hoveredZone === 'borgware' ? 0.9 : 0.6}
            />
          ))}
        </g>

        {/* Thorax / Ribcage (Internal Cyberware & Heart Core) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('internal')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('internal')}
        >
          {/* Rib arcs */}
          <path
            d="M 185 145 C 165 160 165 195 185 210 M 235 145 C 255 160 255 195 235 210"
            fill="none"
            stroke={hoveredZone === 'internal' ? '#ef4444' : '#00f5d4'}
            strokeWidth={hoveredZone === 'internal' ? '2.5' : '1.2'}
            filter={hoveredZone === 'internal' ? 'url(#neonFilter)' : undefined}
          />
          {/* Biomonitor Heart Core */}
          <circle
            cx="217"
            cy="165"
            r="6"
            fill="#ef4444"
            className="animate-ping origin-center"
            opacity="0.75"
          />
          <circle cx="217" cy="165" r="4.5" fill="#ef4444" />
        </g>

        {/* External Integumentary Armor Grid (Dermal Shield) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('external')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('external')}
        >
          <path
            d="M 175 225 L 245 225 L 235 305 L 185 305 Z"
            fill={hoveredZone === 'external' ? '#00f5d4' : '#0f172a'}
            fillOpacity={hoveredZone === 'external' ? '0.25' : '0.1'}
            stroke={hoveredZone === 'external' ? '#00f5d4' : '#334155'}
            strokeWidth={hoveredZone === 'external' ? '2' : '1'}
            strokeDasharray="4 2"
          />
          {/* Dermal plating hexagons */}
          <circle cx="195" cy="250" r="4" fill="none" stroke="#00f5d4" strokeWidth="0.8" />
          <circle cx="225" cy="250" r="4" fill="none" stroke="#00f5d4" strokeWidth="0.8" />
          <circle cx="210" cy="275" r="4" fill="none" stroke="#00f5d4" strokeWidth="0.8" />
        </g>

        {/* Left & Right Cyberarms */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('cyberarms')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('cyberarms')}
        >
          {/* Left Cyberarm (A-Pose) */}
          <path
            d="M 175 130 L 115 220 L 75 340"
            fill="none"
            stroke={hoveredZone === 'cyberarms' ? '#f59e0b' : '#00f5d4'}
            strokeWidth={hoveredZone === 'cyberarms' ? '4' : '2'}
            filter={hoveredZone === 'cyberarms' ? 'url(#neonFilter)' : undefined}
          />
          <circle cx="175" cy="130" r="5" fill="#f59e0b" />
          <circle cx="115" cy="220" r="4" fill="#f59e0b" />
          <rect x="68" y="338" width="14" height="20" rx="3" fill="#f59e0b" opacity="0.8" />

          {/* Right Arm */}
          <path
            d="M 245 130 L 305 220 L 345 340"
            fill="none"
            stroke={hoveredZone === 'cyberarms' ? '#f59e0b' : '#00f5d4'}
            strokeWidth={hoveredZone === 'cyberarms' ? '4' : '2'}
            filter={hoveredZone === 'cyberarms' ? 'url(#neonFilter)' : undefined}
          />
          <circle cx="245" cy="130" r="5" fill="#f59e0b" />
          <circle cx="305" cy="220" r="4" fill="#f59e0b" />
          <rect x="338" y="338" width="14" height="20" rx="3" fill="#f59e0b" opacity="0.8" />
        </g>

        {/* Pelvis and Hips */}
        <polygon
          points="180,310 240,310 225,355 195,355"
          fill="#111827"
          stroke="#00f5d4"
          strokeWidth="1.2"
        />

        {/* Left & Right Cyberlegs */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('cyberlegs')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={() => setSelectedZone('cyberlegs')}
        >
          {/* Left leg */}
          <path
            d="M 195 355 L 180 480 L 170 615"
            fill="none"
            stroke={hoveredZone === 'cyberlegs' ? '#10b981' : '#00f5d4'}
            strokeWidth={hoveredZone === 'cyberlegs' ? '4' : '2'}
            filter={hoveredZone === 'cyberlegs' ? 'url(#neonFilter)' : undefined}
          />
          <circle cx="195" cy="355" r="5" fill="#10b981" />
          <circle cx="180" cy="480" r="4.5" fill="#10b981" />
          <circle cx="170" cy="615" r="4" fill="#10b981" />
          <path d="M 160 615 L 175 615 L 180 635 L 155 635 Z" fill="#10b981" opacity="0.8" />

          {/* Right leg */}
          <path
            d="M 225 355 L 240 480 L 250 615"
            fill="none"
            stroke={hoveredZone === 'cyberlegs' ? '#10b981' : '#00f5d4'}
            strokeWidth={hoveredZone === 'cyberlegs' ? '4' : '2'}
            filter={hoveredZone === 'cyberlegs' ? 'url(#neonFilter)' : undefined}
          />
          <circle cx="225" cy="355" r="5" fill="#10b981" />
          <circle cx="240" cy="480" r="4.5" fill="#10b981" />
          <circle cx="250" cy="615" r="4" fill="#10b981" />
          <path d="M 245 615 L 260 615 L 265 635 L 240 635 Z" fill="#10b981" opacity="0.8" />
        </g>
      </svg>
  );
}
