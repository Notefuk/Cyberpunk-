// [Claude Code · 2026-11-12] v5.26.0 (plan 30): armador de ACPA y las 10 de fábrica.
// Fuente: "Solo of Fortune 2045", Interface RED Vol. 5, pp.133-142.
import { useMemo, useState } from 'react';
import coreData from '../../data/core-rules.cprpack.json';
import {
  ACPA_FRAMES,
  ACPA_MAX_ONBOARD_CYBERWARE,
  ACPA_MAX_ONBOARD_WEAPONS,
  ACPA_PREBUILTS,
  ACPA_SHELLS,
  ACPA_TUNINGS,
  type AcpaFrameId,
  type AcpaMods,
  type AcpaShellId,
  type AcpaTunings,
} from '../../data/acpaData';
import { acpaStateFrom, acpaStateFromPrebuilt, buildAcpa, prebuiltAcpaStats, type AcpaOnboardItem, type AcpaStats } from '../../engine/acpa';
import { useCharacterStore } from '../../store/useCharacterStore';

type CatalogRow = { name: string; cost?: number; type?: string };
const pack = coreData as unknown as { weapons: CatalogRow[]; cyberware: CatalogRow[] };

const WEAPON_OPTIONS: AcpaOnboardItem[] = pack.weapons
  .map((w) => ({ name: w.name, cost: w.cost ?? 0 }))
  .sort((a, b) => a.name.localeCompare(b.name));

// IR5 p.135: no se instalan Linear Frames extra ni ciberware que da o restaura SP. Tampoco cuerpos (paquetes bioexóticos).
const CYBER_EXCLUDED = /linear frame|subdermal|skin weave|plating|armor/i;
const CYBER_OPTIONS: AcpaOnboardItem[] = pack.cyberware
  .filter((c) => !CYBER_EXCLUDED.test(c.name) && !/Package/.test(c.type ?? ''))
  .map((c) => ({ name: c.name, cost: c.cost ?? 0 }))
  .sort((a, b) => a.name.localeCompare(b.name));

const eb = (n: number) => `${n.toLocaleString('es-AR')}eb`;
const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

function statLine(s: Pick<AcpaStats, 'hp' | 'sp' | 'body' | 'ref' | 'dex' | 'move'>): string {
  const parts = [`${s.hp} HP`, `${s.sp} SP`, `BODY ${s.body}`];
  if (s.ref) parts.push(`${signed(s.ref)} REF`);
  if (s.dex) parts.push(`${signed(s.dex)} DEX`);
  if (s.move) parts.push(`${signed(s.move)} MOVE`);
  return parts.join(' • ');
}

const selectCls = 'bg-[#0c0f1a] border border-[#262c3e] text-slate-200 text-xs font-mono-code rounded-xs px-2 py-1.5 w-full';

function OnboardPicker({
  label,
  max,
  options,
  items,
  onChange,
}: {
  label: string;
  max: number;
  options: AcpaOnboardItem[];
  items: AcpaOnboardItem[];
  onChange: (items: AcpaOnboardItem[]) => void;
}) {
  const [pick, setPick] = useState('');
  const add = () => {
    const opt = options.find((o) => o.name === pick);
    if (opt && items.length < max) onChange([...items, opt]);
  };
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-mono-code text-slate-400">
        {label} ({items.length}/{max})
      </div>
      <div className="flex gap-1.5">
        <select className={selectCls} value={pick} onChange={(e) => setPick(e.target.value)} aria-label={`Elegir ${label}`}>
          <option value="">Elegir…</option>
          {options.map((o) => (
            <option key={o.name} value={o.name}>
              {o.name} ({eb(o.cost)})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          disabled={!pick || items.length >= max}
          className="px-3 text-xs font-mono-code border border-[#38bdf8] text-[#38bdf8] rounded-xs disabled:opacity-40 cursor-pointer"
        >
          Agregar
        </button>
      </div>
      {items.length > 0 && (
        <ul className="space-y-1">
          {items.map((it, i) => (
            <li key={`${it.name}-${i}`} className="flex justify-between items-center text-[11px] font-mono-code text-slate-300 bg-[#0c0f1a] px-2 py-1 rounded-xs">
              <span>
                {it.name} <span className="text-slate-500">({eb(it.cost)})</span>
              </span>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-[#f87171] cursor-pointer" aria-label={`Quitar ${it.name}`}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AcpaCatalog() {
  const [frame, setFrame] = useState<AcpaFrameId>('sigma');
  const [shell, setShell] = useState<AcpaShellId>('salvaged');
  const [tunings, setTunings] = useState<AcpaTunings>({ acceleration: 'A', hydraulics: 'A', maneuverability: 'A', weight: 'A' });
  const [weapons, setWeapons] = useState<AcpaOnboardItem[]>([]);
  const [cyber, setCyber] = useState<AcpaOnboardItem[]>([]);

  // v5.27.0 [Claude Code · 2026-11-12]: asignar la ACPA a la ficha activa (se entra desde la ficha o el HUD).
  const activeChar = useCharacterStore((s) => s.getActiveCharacter());
  const setAcpaFor = useCharacterStore((s) => s.setAcpaFor);
  const [assigned, setAssigned] = useState<string | null>(null);
  const assign = (acpa: ReturnType<typeof acpaStateFromPrebuilt>) => {
    if (!activeChar) return;
    setAcpaFor(activeChar.id, acpa);
    setAssigned(`${acpa.name} asignada a ${activeChar.handle}. Entrá desde ARSENAL & BLINDAJE o el HUD de combate.`);
  };
  const [customName, setCustomName] = useState('ACPA propia');

  const stats = useMemo(() => buildAcpa({ frame, shell, tunings, onboardWeapons: weapons, onboardCyberware: cyber }), [frame, shell, tunings, weapons, cyber]);

  return (
    <div className="space-y-4">
      <div className="text-[11px] font-mono-code text-[#94a3b8] space-y-1">
        <p>
          ACPA (Assisted Combat Power Armor) de &ldquo;Solo of Fortune 2045&rdquo;, Interface RED Vol. 5 pp.133-142. Tiene un solo SP y un solo HP, es inmune a Aimed Shot y
          al Wound Threshold, y a 0 HP queda Destruida. Una Herida Crítica no se aplica: el piloto recibe 5 de daño directo (0 si es FBC). Entrar o salir cuesta 1 Acción
          (p.133). El piloto usa su REF, DEX y MOVE con los mods de la ACPA, y el BODY del frame (p.134).
        </p>
        <p>Reparación con Weaponstech, sin Jury Rig: DV9 en 4 h, DV13 en 1 día si tiene menos de la mitad de HP, DV17 en 1 semana si está destruida (p.135).</p>
      </div>

      {/* Armador */}
      <section className="bg-[#0f1220] border border-[#262c3e] rounded-xs p-3 space-y-3" aria-label="Armador de ACPA">
        <h3 className="text-sm font-bold font-mono-code text-[#f97316]">Armador de ACPA (pp.135-136)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="space-y-1 block">
            <span className="text-[11px] font-mono-code text-slate-400">1. Linear Frame</span>
            <select className={selectCls} value={frame} onChange={(e) => setFrame(e.target.value as AcpaFrameId)}>
              {ACPA_FRAMES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}: {eb(f.cost)} ({f.costTier}), BODY {f.body}, {f.hp} HP{f.move ? `, ${signed(f.move)} MOVE` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 block">
            <span className="text-[11px] font-mono-code text-slate-400">2. Shell</span>
            <select className={selectCls} value={shell} onChange={(e) => setShell(e.target.value as AcpaShellId)}>
              {ACPA_SHELLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}: {eb(s.cost)} ({s.costTier}), SP {s.sp}, +{s.hp} HP{s.move ? `, ${signed(s.move)} MOVE` : ''}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] font-mono-code text-slate-400">3. Tunings (A o B en cada uno)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ACPA_TUNINGS.map((tu) => {
              const fmt = (m: AcpaMods) =>
                Object.entries(m)
                  .map(([k, v]) => `${signed(v ?? 0)} ${k.toUpperCase()}`)
                  .join(', ');
              return (
                <fieldset key={tu.id} className="bg-[#0c0f1a] border border-[#20273a] rounded-xs px-2 py-1.5">
                  <legend className="text-[11px] font-mono-code text-slate-300 px-1" title={tu.description}>
                    {tu.name}
                  </legend>
                  <div className="flex gap-3 text-[11px] font-mono-code text-slate-300">
                    {(['A', 'B'] as const).map((opt) => (
                      <label key={opt} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name={`acpa-${tu.id}`}
                          checked={tunings[tu.id] === opt}
                          onChange={() => setTunings((prev) => ({ ...prev, [tu.id]: opt }))}
                        />
                        {opt}: {fmt(tu[opt])}
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <OnboardPicker label="4. Armas Onboard" max={ACPA_MAX_ONBOARD_WEAPONS} options={WEAPON_OPTIONS} items={weapons} onChange={setWeapons} />
          <OnboardPicker label="Ciberware Onboard" max={ACPA_MAX_ONBOARD_CYBERWARE} options={CYBER_OPTIONS} items={cyber} onChange={setCyber} />
        </div>
        <p className="text-[10px] font-mono-code text-slate-500">
          Todo ciberware Onboard cuenta como par y se ignoran sus requisitos. No se instalan Linear Frames extra, ciberware que da SP ni ciberware solo para FBC (p.135).
        </p>

        <div className="bg-[#0c0f1a] border border-[#f97316]/50 rounded-xs p-2 font-mono-code" data-testid="acpa-builder-result">
          <div className="text-sm text-[#fdba74] font-bold">{statLine(stats)}</div>
          <div className="text-xs text-slate-300">
            Costo: {eb(stats.cost)} ({stats.costTier})
          </div>
          {stats.errors.map((e) => (
            <div key={e} className="text-xs text-[#f87171]">
              {e}
            </div>
          ))}
          {activeChar && (
            <div className="flex gap-1.5 mt-2">
              <input
                className={selectCls}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                aria-label="Nombre de la ACPA"
              />
              <button
                type="button"
                disabled={stats.errors.length > 0}
                onClick={() =>
                  assign(acpaStateFrom(customName.trim() || 'ACPA propia', stats, { weapons: weapons.map((w) => w.name), cyberware: cyber.map((c) => c.name) }))
                }
                className="px-3 text-xs font-mono-code border border-[#facc15] text-[#facc15] rounded-xs disabled:opacity-40 cursor-pointer shrink-0"
              >
                Asignar a {activeChar.handle}
              </button>
            </div>
          )}
        </div>
        {assigned && <p className="text-[11px] font-mono-code text-[#4ade80]">{assigned}</p>}
      </section>

      {/* Las 10 de fábrica */}
      <section className="space-y-2" aria-label="ACPA de fábrica">
        <h3 className="text-sm font-bold font-mono-code text-[#f97316]">ACPA de fábrica (pp.138-142)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {ACPA_PREBUILTS.map((p) => {
            const s = prebuiltAcpaStats(p);
            const frameName = ACPA_FRAMES.find((f) => f.id === p.frame)?.name;
            const shellName = ACPA_SHELLS.find((x) => x.id === p.shell)?.name;
            return (
              <article key={p.id} className="bg-[#12141f] border border-[#262c3e] rounded-xs p-2.5 space-y-1 font-mono-code">
                <div className="flex justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-100">{p.name}</h4>
                  <span className="text-[10px] text-slate-500 shrink-0">IR5 p.{p.sourcePage}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Costo: {eb(p.printedCost)} ({p.printedCostTier})
                </div>
                <div className="text-xs text-[#fdba74] font-bold">{statLine(s)}</div>
                <p className="text-[11px] text-slate-400 italic">{p.description}</p>
                <div className="text-[11px] text-slate-300">
                  <b>Frame:</b> {frameName} · <b>Shell:</b> {shellName}
                </div>
                <div className="text-[11px] text-slate-300">
                  <b>Onboard:</b> {p.onboardWeapons.join(', ')}
                </div>
                <div className="text-[11px] text-slate-300">
                  <b>Ciberware:</b> {p.onboardCyberware.length ? p.onboardCyberware.join(', ') : 'Ninguno'}
                </div>
                {activeChar && (
                  <button
                    type="button"
                    onClick={() => assign(acpaStateFromPrebuilt(p))}
                    className="px-2 py-0.5 text-[11px] border border-[#facc15]/70 text-[#facc15] rounded-xs cursor-pointer"
                  >
                    Asignar a {activeChar.handle}
                  </button>
                )}
                {p.erratum && (
                  <div className="text-[10px] text-[#facc15] border-t border-[#262c3e] pt-1">
                    Errata: el libro imprime &ldquo;{p.printedLine}&rdquo;. {p.erratum}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
