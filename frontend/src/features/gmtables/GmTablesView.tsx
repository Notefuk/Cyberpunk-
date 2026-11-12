// [Claude Code · 2026-11-11] v5.19.0 (plan 27): pestaña solo para el GM con las tablas de los Interface RED y sus DLC.
// Logros y cajas de botín (IR4 pp.24-29), clima (IR2 pp.16-19), Digital Dating, Collecting the Random y Salvaging Night City.
import { useEffect, useMemo, useState, type ReactNode } from 'react';

/** Estado que se guarda en este navegador (si el almacenamiento falla, sigue en memoria). */
function useStoredState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* sin almacenamiento: queda en memoria */
    }
  }, [key, value]);
  return [value, setValue];
}
import { useTableReveals } from '../../sync/tableReveals';
import { rollOnTable, parseDie, rollDice } from '../../engine/gmTables';
import type { GmTable } from '../../data/gmTables/types';
import { ACHIEVEMENTS, ACHIEVEMENT_RULES, TABLE_OF_MYSTERY, MYSTERY_BOX_CONTENTS } from '../../data/gmTables/achievements';
import { WEATHER_HOW_TO, WEATHER_SEASONS, STRANGE_WEATHER, WEATHER_RULES } from '../../data/gmTables/weather';
import {
  SALVAGING_INTRO, SALVAGING_STEPS, SALVAGE_LOCATIONS, SALVAGE_CATEGORIES, SALVAGE_WORTH, SALVAGE_WORTH_SOURCE, PERILS_OF_SALVAGING,
} from '../../data/gmTables/salvaging';
import { DATING_INTRO, DATING_STEPS, DATING_TABLES, DATING_RULES } from '../../data/gmTables/dating';
import { COLLECTING_INTRO, COLLECTING_HOW_TO, COLLECTIONS } from '../../data/gmTables/collecting';
import { HALLOWEEN_ADVENTURES } from '../../data/gmTables/halloween';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';

type Section = 'achievements' | 'weather' | 'dating' | 'collecting' | 'salvaging' | 'halloween';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'achievements', label: '🏆 Logros y cajas' },
  { id: 'weather', label: '🌧️ Clima' },
  { id: 'dating', label: '💘 Digital Dating' },
  { id: 'collecting', label: '🗃️ Collecting the Random' },
  { id: 'salvaging', label: '🔧 Salvaging' },
  { id: 'halloween', label: '🎃 Halloween Screamsheets' },
];

const card = 'chamfer-card bg-[#0e1017] border border-[#202538] p-4 space-y-3';
const btn = 'px-3 py-1.5 bg-[#1a2030] hover:bg-[#22d3ee] hover:text-black text-[11px] font-tech font-bold uppercase rounded-xs cursor-pointer disabled:opacity-40';
const small = 'text-[11px] font-mono-code text-[#94a3b8]';

function Source({ s }: { s: string }) {
  return <span className="text-[10px] font-mono-code text-[#64748b]">{s}</span>;
}

/** Una tabla con su botón de tirar; resalta la fila que salió. */
function RollTable({ table, extra }: { table: GmTable; extra?: ReactNode }) {
  const [hit, setHit] = useState<{ result: number; roll: string | null } | null>(null);
  const roll = () => {
    const r = rollOnTable(table.rows, table.die);
    if (r) setHit({ result: r.result, roll: r.row?.roll ?? null });
  };
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-tech text-xs font-bold text-white uppercase">{table.title}</span>
        <Source s={parseDie(table.die) ? `${table.die} • ${table.source}` : table.source} />
        {parseDie(table.die) && <button type="button" className={btn} onClick={roll}>🎲 Tirar {table.die}</button>}
        {hit && <span className="text-[11px] font-mono-code text-[#22d3ee]">Salió {hit.result}</span>}
        {extra}
      </div>
      <ul className="space-y-0.5">
        {table.rows.map((r) => (
          <li key={r.roll + r.text} className={`${small} px-1 rounded-xs ${hit?.roll === r.roll ? 'bg-[#22d3ee]/15 text-white' : ''}`}>
            <b className="text-[#f59e0b]">{r.roll}</b> {r.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AchievementsSection() {
  const [players, setPlayers] = useStoredState<string[]>('cpr_gm_achievement_players_v1', ['Crew']);
  const [done, setDone] = useStoredState<Record<string, string[]>>('cpr_gm_achievements_v1', {});
  const [newName, setNewName] = useState('');
  const [box, setBox] = useState<{ which: number; inside: number | null } | null>(null);

  const toggle = (player: string, name: string) => {
    const list = done[player] ?? [];
    setDone({ ...done, [player]: list.includes(name) ? list.filter((n) => n !== name) : [...list, name] });
  };
  const rollBox = () => {
    const r = rollOnTable(TABLE_OF_MYSTERY.rows, TABLE_OF_MYSTERY.die);
    if (r?.row) setBox({ which: TABLE_OF_MYSTERY.rows.indexOf(r.row), inside: null });
  };
  const openBox = () => {
    if (!box) return;
    const t = MYSTERY_BOX_CONTENTS[box.which];
    const r = rollOnTable(t.rows, t.die);
    if (r?.row) setBox({ ...box, inside: t.rows.indexOf(r.row) });
  };

  return (
    <div className="space-y-4">
      <div className={card}>
        <h3 className="font-tech text-sm font-bold text-white uppercase">Cómo funcionan</h3>
        <ul className="list-disc pl-5 space-y-0.5">{ACHIEVEMENT_RULES.map((r) => <li key={r} className={small}>{r}</li>)}</ul>
        <Source s="Interface RED Vol. 4 p.24 (Achievements and Loot Boxes p.2)" />
      </div>

      <div className={card}>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-tech text-sm font-bold text-white uppercase">Logros ({ACHIEVEMENTS.length})</h3>
          <span className={small}>Cada uno se gana una sola vez. Tildá quién lo ganó (se guarda en este navegador).</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {players.map((p) => (
            <span key={p} className="text-[11px] font-mono-code bg-[#1a2030] px-2 py-0.5 rounded-xs text-white">
              {p} ({(done[p] ?? []).length})
              {players.length > 1 && (
                <button type="button" aria-label={`Quitar ${p}`} className="ml-1 text-[#64748b] hover:text-white cursor-pointer" onClick={() => setPlayers(players.filter((x) => x !== p))}>×</button>
              )}
            </span>
          ))}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Agregar jugador o Crew"
            className="bg-[#10141f] border border-[#1b2336] rounded-xs px-2 py-1 text-[11px] font-mono-code text-white" />
          <button type="button" className={btn} disabled={!newName.trim() || players.includes(newName.trim())}
            onClick={() => { setPlayers([...players, newName.trim()]); setNewName(''); }}>Agregar</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-mono-code text-[#64748b] uppercase">
                <th className="py-1 pr-2">Logro</th>
                {players.map((p) => <th key={p} className="py-1 px-1 text-center">{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {ACHIEVEMENTS.map((a) => (
                <tr key={a.name} className="border-t border-[#1b2234]">
                  <td className="py-1 pr-2">
                    <b className="text-[11px] text-white">{a.name}</b> <span className={small}>{a.conditionEs}</span> <Source s={a.source} />
                  </td>
                  {players.map((p) => (
                    <td key={p} className="text-center">
                      <input type="checkbox" aria-label={`${a.name}: ${p}`} checked={(done[p] ?? []).includes(a.name)} onChange={() => toggle(p, a.name)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={card}>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-tech text-sm font-bold text-white uppercase">Mystery Box de Mr. Amaze</h3>
          <button type="button" className={btn} onClick={rollBox}>🎲 Elegir caja (1d10)</button>
          {box && <button type="button" className={btn} onClick={openBox}>📦 Abrir (1d6)</button>}
        </div>
        {box && (
          <p className="text-[12px] text-white">
            {TABLE_OF_MYSTERY.rows[box.which].roll}. {TABLE_OF_MYSTERY.rows[box.which].text}
            {box.inside !== null && <> → <b className="text-[#22d3ee]">{MYSTERY_BOX_CONTENTS[box.which].rows[box.inside].text}</b></>}
          </p>
        )}
        <p className={small}>Los ítems con * son de Black Chrome; sin ese libro, se cambian por uno de valor parecido.</p>
        <details>
          <summary className="cursor-pointer text-[11px] text-[#22d3ee]">Ver todas las cajas</summary>
          <div className="grid md:grid-cols-2 gap-3 mt-2">
            {MYSTERY_BOX_CONTENTS.map((t, i) => (
              <RollTable key={t.id} table={{ ...t, title: `${TABLE_OF_MYSTERY.rows[i].roll}. ${t.title}` }} />
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}

function WeatherSection() {
  const month = new Date().getMonth() + 1;
  const [seasonId, setSeasonId] = useState(() => WEATHER_SEASONS.find((s) => s.months.includes(month))?.id ?? WEATHER_SEASONS[0].id);
  const [result, setResult] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const adapter = useTableReveals((s) => s.adapter);
  const season = WEATHER_SEASONS.find((s) => s.id === seasonId)!;

  const rollWeather = () => {
    const d = parseDie(season.die)!;
    // Dos tiradas separadas: una para la temperatura y otra para las condiciones (IR2 p.16).
    const tRoll = String(rollDice(d));
    const cRoll = String(rollDice(d));
    const t = season.rows.find((r) => r.roll === tRoll)!;
    const c = season.rows.find((r) => r.roll === cRoll)!;
    let text = `Temperatura: ${t.temperature}. Condiciones: ${c.conditions}.`;
    if (/Strange/i.test(c.conditions)) {
      const s = rollOnTable(STRANGE_WEATHER.rows, STRANGE_WEATHER.die);
      if (s?.row) text += ` Strange Weather (${s.result}): ${s.row.text}`;
    }
    setResult(text);
    setSent(false);
  };
  const share = async () => {
    if (!adapter || !result) return;
    try {
      await adapter.sendHandout('Clima de Night City', `${result} (${season.source})`);
      setSent(true);
    } catch (e) {
      console.warn('[mesa] clima:', e);
    }
  };

  return (
    <div className="space-y-4">
      <div className={card}>
        <ul className="list-disc pl-5 space-y-0.5">{WEATHER_HOW_TO.map((r) => <li key={r} className={small}>{r}</li>)}</ul>
        <div className="flex flex-wrap items-center gap-2">
          {WEATHER_SEASONS.map((s) => (
            <button key={s.id} type="button" onClick={() => setSeasonId(s.id)}
              className={`${btn} ${s.id === seasonId ? 'bg-[#22d3ee]/20 text-[#22d3ee]' : ''}`}>{s.title.replace('Weather: ', '')}</button>
          ))}
          <button type="button" className={btn} onClick={rollWeather}>🎲 Tirar el clima del día</button>
        </div>
        {result && (
          <div className="space-y-1">
            <p className="text-[12px] text-white">{result}</p>
            {adapter ? (
              <button type="button" className={btn} onClick={() => void share()} disabled={sent}>{sent ? 'Mostrado a la mesa' : '📣 Mostrar a la mesa'}</button>
            ) : (
              <p className={small}>Con una mesa activa podés mostrárselo a los jugadores.</p>
            )}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="text-[10px] font-mono-code text-[#64748b] uppercase"><th>{season.die}</th><th>Temperature</th><th>Current Conditions</th></tr></thead>
            <tbody>
              {season.rows.map((r) => (
                <tr key={r.roll} className="border-t border-[#1b2234]">
                  <td className={small}><b className="text-[#f59e0b]">{r.roll}</b></td>
                  <td className={small}>{r.temperature}</td>
                  <td className={small}>{r.conditions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Source s={season.source} />
      </div>
      <div className={card}><RollTable table={STRANGE_WEATHER} /></div>
      <div className={card}>
        <h3 className="font-tech text-sm font-bold text-white uppercase">Temperatura y lluvia</h3>
        <ul className="space-y-1">{WEATHER_RULES.map((r) => <li key={r.title} className={small}><b className="text-white">{r.title}</b>: {r.textEs} <Source s={r.source} /></li>)}</ul>
      </div>
    </div>
  );
}

function TablesSection({ intro, steps, tables, extra }: { intro: string; steps: string[]; tables: GmTable[]; extra?: ReactNode }) {
  const [q, setQ] = useState('');
  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? tables.filter((t) => `${t.title} ${t.rows.map((r) => r.text).join(' ')}`.toLowerCase().includes(n)) : tables;
  }, [q, tables]);
  return (
    <div className="space-y-4">
      <div className={card}>
        <p className="text-[12px] text-[#cbd5e1]">{intro}</p>
        <ul className="list-disc pl-5 space-y-0.5">{steps.map((r) => <li key={r} className={small}>{r}</li>)}</ul>
        {extra}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Buscar en ${tables.length} tablas...`}
          className="bg-[#10141f] border border-[#1b2336] rounded-xs px-2 py-1 text-[11px] font-mono-code text-white w-full sm:w-64" />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {shown.map((t) => <div key={t.id} className={card}><RollTable table={t} /></div>)}
      </div>
    </div>
  );
}

function SalvagingSection() {
  return (
    <div className="space-y-4">
      <div className={card}>
        <p className="text-[12px] text-[#cbd5e1]">{SALVAGING_INTRO}</p>
        <ul className="list-disc pl-5 space-y-0.5">{SALVAGING_STEPS.map((r) => <li key={r} className={small}>{r}</li>)}</ul>
        <Source s="Salvaging Night City pp.2-5 (también en Interface RED Vol. 3)" />
      </div>
      <div className={card}>
        <h3 className="font-tech text-sm font-bold text-white uppercase">Dónde buscar</h3>
        <ul className="space-y-1">{SALVAGE_LOCATIONS.map((l) => <li key={l.name} className={small}><b className="text-white">{l.name}</b>: {l.textEs} <Source s={l.source} /></li>)}</ul>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className={card}><RollTable table={SALVAGE_CATEGORIES} /></div>
        <div className={card}>
          <span className="font-tech text-xs font-bold text-white uppercase">Salvage Worth (Basic Tech)</span> <Source s={SALVAGE_WORTH_SOURCE} />
          <table className="w-full text-left">
            <thead><tr className="text-[10px] font-mono-code text-[#64748b] uppercase"><th>Valor</th><th>Lo que haya</th><th>Categoría elegida</th></tr></thead>
            <tbody>{SALVAGE_WORTH.map((w) => <tr key={w.worth} className="border-t border-[#1b2234]"><td className={small}>{w.worth}</td><td className={small}>{w.anyDv}</td><td className={small}>{w.specificDv}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <div className={card}><RollTable table={PERILS_OF_SALVAGING} /></div>
    </div>
  );
}

// v5.20.0 (plan 27): las 3 aventuras de Halloween Screamsheets como referencia del GM. [Claude Code · 2026-11-11]
function HalloweenSection() {
  return (
    <div className="space-y-4">
      <div className={card}>
        <p className="text-[12px] text-[#cbd5e1]">Tres aventuras cortas de Halloween, armadas como screamsheets. Resúmenes para el GM; los PNJ con ficha están en el bestiario.</p>
        <Source s="Interface RED Vol. 4 pp.56-65" />
      </div>
      {HALLOWEEN_ADVENTURES.map((a) => (
        <div key={a.id} className={card}>
          <h3 className="font-tech text-sm font-bold text-white uppercase">{a.title} <Source s={`IR4 pp.${a.pages}`} /></h3>
          <p className={small}><b className="text-white">Gancho:</b> {a.hookEs}</p>
          <p className={small}><b className="text-white">Cómo arranca:</b> {a.setupEs}</p>
          <ol className="list-decimal pl-5 space-y-0.5">{a.scenesEs.map((sc) => <li key={sc} className={small}>{sc}</li>)}</ol>
          {a.rulesEs.length > 0 && <ul className="list-disc pl-5 space-y-0.5">{a.rulesEs.map((r) => <li key={r} className={small}>{r}</li>)}</ul>}
          {a.rewardsEs && <p className={small}><b className="text-white">Pago:</b> {a.rewardsEs}</p>}
          {a.npcIds.length > 0 && (
            <p className={small}><b className="text-white">PNJ en el bestiario:</b> {a.npcIds.map((id) => ENEMIES_CATALOG.find((e) => e.id === id)?.name ?? id).join(', ')}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function GmTablesView() {
  const [section, setSection] = useStoredState<Section>('cpr_gm_tables_section_v1', 'achievements');
  return (
    <div className="space-y-4">
      <div className={card}>
        <h2 className="font-tech text-base font-bold text-white uppercase tracking-wider">🎲 Tablas del GM // Night City</h2>
        <p className={small}>Solo para el GM. Tablas de los Interface RED y sus DLC, con su libro y página.</p>
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button key={s.id} type="button" onClick={() => setSection(s.id)}
              className={`${btn} ${s.id === section ? 'bg-[#22d3ee]/20 text-[#22d3ee]' : ''}`}>{s.label}</button>
          ))}
        </div>
      </div>
      {section === 'achievements' && <AchievementsSection />}
      {section === 'weather' && <WeatherSection />}
      {section === 'dating' && (
        <TablesSection intro={DATING_INTRO} steps={DATING_STEPS} tables={DATING_TABLES}
          extra={DATING_RULES.length > 0 && <ul className="space-y-1">{DATING_RULES.map((r) => <li key={r.title} className={small}><b className="text-white">{r.title}</b>: {r.textEs} <Source s={r.source} /></li>)}</ul>} />
      )}
      {section === 'collecting' && <TablesSection intro={COLLECTING_INTRO} steps={COLLECTING_HOW_TO} tables={COLLECTIONS} />}
      {section === 'salvaging' && <SalvagingSection />}
      {section === 'halloween' && <HalloweenSection />}
    </div>
  );
}
