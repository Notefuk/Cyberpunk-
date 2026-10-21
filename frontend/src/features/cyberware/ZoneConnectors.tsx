import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import { ZONE_CONFIGS, type AnatomicalZoneKey } from './ripperdocZones';

export interface ZoneConnectorsProps {
  containerRef: RefObject<HTMLElement | null>;
  hoveredZone: AnatomicalZoneKey | null;
  selectedZone: AnatomicalZoneKey | null;
  /** Valores que, al cambiar, fuerzan el recálculo (p. ej. cantidad de implantes). */
  deps?: ReadonlyArray<unknown>;
}

interface Line {
  key: AnatomicalZoneKey;
  points: [number, number][];
  color: string;
}

const QUERY = '(min-width: 1280px)';
const ZONE_KEYS = (Object.keys(ZONE_CONFIGS) as AnatomicalZoneKey[]).filter(
  (k) => ZONE_CONFIGS[k].side !== 'bottom'
);

export function ZoneConnectors({ containerRef, hoveredZone, selectedZone, deps = [] }: ZoneConnectorsProps) {
  const [enabled, setEnabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );
  const [lines, setLines] = useState<Line[]>([]);
  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || !enabled) {
      setLines([]);
      return;
    }
    const base = container.getBoundingClientRect();
    const next: Line[] = [];
    for (const key of ZONE_KEYS) {
      const card = container.querySelector(`[data-zone-card="${key}"]`);
      const marker = container.querySelector(`[data-zone-marker="${key}"]`);
      if (!card || !marker) continue;
      const c = card.getBoundingClientRect();
      const m = marker.getBoundingClientRect();
      const dir = ZONE_CONFIGS[key].side === 'left' ? 1 : -1;
      const x0 = (dir === 1 ? c.right : c.left) - base.left;
      const y0 = c.top + c.height / 2 - base.top;
      const mx = m.left + m.width / 2 - base.left;
      const my = m.top + m.height / 2 - base.top;
      next.push({
        key,
        color: ZONE_CONFIGS[key].color ?? '#00f5d4',
        points: [
          [x0, y0],
          [x0 + dir * 24, y0],
          [mx, my]
        ]
      });
    }
    setLines(next);
  }, [containerRef, enabled]);

  useLayoutEffect(() => {
    measure();
  }, [measure, hoveredZone, selectedZone, depsKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerRef, enabled, measure]);

  if (!enabled) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full z-[5]"
      aria-hidden="true"
    >
      {lines.map(({ key, points, color }) => {
        const active = hoveredZone === key || selectedZone === key;
        const first = points[0];
        const last = points[points.length - 1];
        return (
          <g key={`conn-${key}`}>
            <polyline
              points={points.map((p) => p.join(',')).join(' ')}
              fill="none"
              stroke={color}
              strokeWidth={1}
              strokeOpacity={active ? 1 : 0.25}
              strokeDasharray={active ? '6 4' : undefined}
              className={active ? 'holo-dash' : undefined}
            />
            <circle cx={first[0]} cy={first[1]} r={active ? 3 : 2} fill={color} fillOpacity={active ? 1 : 0.25} />
            <circle cx={last[0]} cy={last[1]} r={active ? 3 : 2} fill={color} fillOpacity={active ? 1 : 0.25} />
          </g>
        );
      })}
    </svg>
  );
}
