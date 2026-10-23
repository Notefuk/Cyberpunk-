// Paso 3 del creador: Lifepath (Core pp. 44-69; CEMK RB pp. 19-24). [Claude Code · 2026-10-22]
import React from 'react';
import type { LifepathTable } from '../../../data/creation';
import {
  getApplicableRoleLifepathTables,
  getLifepathGroups,
  getLifepathTables,
  getSingleLifepathTables,
  lifepathKey,
  rollLifepathTable,
  type CreatorDraft,
  type LifepathPick,
  type LifepathSource
} from '../../../engine/characterCreation';
import { Btn, INPUT_CLS, Panel, SELECT_CLS, NoviceGuide, StepHeader, type StepProps } from './CreatorUi';

type GroupName = 'friends' | 'enemies' | 'love';
const GROUP_LABEL: Record<GroupName, { title: string; one: string; countKey: 'friendsCount' | 'enemiesCount' | 'loveCount'; countTable?: string }> = {
  friends: { title: 'Amigos', one: 'Amigo', countKey: 'friendsCount', countTable: 'friends_count' },
  enemies: { title: 'Enemigos', one: 'Enemigo', countKey: 'enemiesCount', countTable: 'enemies_count' },
  love: { title: 'Romances trágicos', one: 'Romance trágico', countKey: 'loveCount' }
};

// Las tablas de cantidad de CEMK solo traen texto ("No ...", "One ...", "Two ..."): se lee el número de la versión en inglés.
const COUNT_WORDS: Array<[RegExp, number]> = [
  [/^(no|none)\b/i, 0],
  [/^one\b/i, 1],
  [/^two\b/i, 2],
  [/^three\b/i, 3],
  [/^four\b/i, 4],
  [/^five\b/i, 5]
];
function countFromPick(table: LifepathTable, pick: LifepathPick): number | null {
  const en = table.results.find((r) => r.es === pick.value)?.en ?? '';
  const digit = /^(\d+)\b/.exec(en);
  if (digit) return parseInt(digit[1], 10);
  const hit = COUNT_WORDS.find(([re]) => re.test(en));
  return hit ? hit[1] : null;
}

const TableRow: React.FC<{
  table: LifepathTable;
  pick: LifepathPick | undefined;
  onChange: (p: LifepathPick | null) => void;
  prefix?: string;
}> = ({ table, pick, onChange, prefix }) => {
  const choose = table.die === 'choose';
  const selectId = `lp-${prefix ?? ''}-${table.id}`;
  return (
    <div className="grid sm:grid-cols-[minmax(0,1fr)_auto] gap-2 items-center py-2 border-b border-[#1e2334] last:border-0">
      <div>
        <label htmlFor={selectId} className="text-xs text-white font-bold">
          {table.name}
        </label>
        <span className="ml-2 text-[10px] font-mono-code text-[#64748b]">
          {choose ? 'a elección' : table.die} · {table.source.book} p.{table.source.page ?? '?'}
        </span>
        {table.note && <p className="text-[10px] text-[#94a3b8]">{table.note}</p>}
        <select
          id={selectId}
          className={`${SELECT_CLS} w-full mt-1`}
          value={pick?.value ?? ''}
          onChange={(e) => onChange(e.target.value ? { roll: null, value: e.target.value } : null)}
        >
          <option value="">— elegir a mano —</option>
          {table.results.map((r, i) => (
            <option key={`${r.roll}-${i}`} value={r.es}>
              {r.roll} · {r.es}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        {!choose && (
          <Btn tone="cyan" aria-label={`Tirar ${table.name}`} onClick={() => onChange(rollLifepathTable(table))}>
            🎲 Tirar
          </Btn>
        )}
        {pick?.roll != null && <span className="text-xs font-mono-code text-[#10b981]">Tirada: {pick.roll}</span>}
        {pick && pick.roll === null && <span className="text-[10px] font-mono-code text-[#64748b]">a mano</span>}
      </div>
    </div>
  );
};

const setPick = (map: Record<string, LifepathPick>, key: string, pick: LifepathPick | null): Record<string, LifepathPick> => {
  const next = { ...map };
  if (pick) next[key] = pick;
  else delete next[key];
  return next;
};

export const LifepathStep: React.FC<StepProps> = ({ draft, update }) => {
  const source = draft.lifepathSource;
  const tables = getLifepathTables(source, draft.role);
  const groups = getLifepathGroups(source);
  const singles = getSingleLifepathTables(source);
  const tableById = (id: string): LifepathTable | undefined => tables.general.find((t) => t.id === id);
  const roleTables = getApplicableRoleLifepathTables(draft.role, draft.roleLifepath, source);
  const pendingChoices = roleTables.filter((t) => t.die === 'choose' && !draft.roleLifepath[t.id]);

  const setSource = (s: LifepathSource): void => {
    if (s === source) return;
    update((d) => ({ ...d, lifepathSource: s, lifepath: {}, roleLifepath: {}, friendsCount: 0, enemiesCount: 0, loveCount: 0 }));
  };
  const setLife = (key: string, pick: LifepathPick | null): void => update((d) => ({ ...d, lifepath: setPick(d.lifepath, key, pick) }));
  const setRoleLife = (key: string, pick: LifepathPick | null): void => update((d) => ({ ...d, roleLifepath: setPick(d.roleLifepath, key, pick) }));
  const setCount = (group: GroupName, n: number): void => {
    const safe = Math.max(0, Math.min(10, Number.isFinite(n) ? Math.floor(n) : 0));
    update((d) => ({ ...d, [GROUP_LABEL[group].countKey]: safe }));
  };
  const rollCount = (group: GroupName): void => {
    const info = GROUP_LABEL[group];
    const table = info.countTable ? tableById(info.countTable) : undefined;
    if (!table) return;
    const pick = rollLifepathTable(table);
    if (!pick) return;
    const n = countFromPick(table, pick);
    if (n !== null) setCount(group, n);
    update((d) => ({ ...d, lifepath: setPick(d.lifepath, table.id, pick) }));
  };

  const rollAll = (): void => {
    update((d) => {
      const lifepath: CreatorDraft['lifepath'] = { ...d.lifepath };
      const roleLifepath: CreatorDraft['roleLifepath'] = { ...d.roleLifepath };
      const t = getLifepathTables(d.lifepathSource, d.role);
      const g = getLifepathGroups(d.lifepathSource);
      const counts = { friends: d.friendsCount, enemies: d.enemiesCount, love: d.loveCount };
      for (const table of singles) {
        const p = rollLifepathTable(table);
        if (p) lifepath[table.id] = p;
      }
      (['friends', 'enemies'] as GroupName[]).forEach((grp) => {
        const ct = GROUP_LABEL[grp].countTable ? t.general.find((x) => x.id === GROUP_LABEL[grp].countTable) : undefined;
        if (!ct) return;
        const p = rollLifepathTable(ct);
        if (!p) return;
        lifepath[ct.id] = p;
        const n = countFromPick(ct, p);
        if (n !== null) counts[grp] = n;
      });
      (['friends', 'enemies', 'love'] as GroupName[]).forEach((grp) => {
        for (let i = 0; i < counts[grp]; i++) {
          for (const id of g[grp]) {
            const table = t.general.find((x) => x.id === id);
            if (!table) continue;
            const p = rollLifepathTable(table);
            if (p) lifepath[lifepathKey(grp, i, id)] = p;
          }
        }
      });
      // Solo las tablas que aplican con lo elegido; las "a elección" no se tiran (Core pp. 54-68).
      for (const table of getApplicableRoleLifepathTables(d.role, roleLifepath, d.lifepathSource)) {
        if (roleLifepath[table.id]) continue;
        const p = rollLifepathTable(table);
        if (p) roleLifepath[table.id] = p;
      }
      return { ...d, lifepath, roleLifepath, friendsCount: counts.friends, enemiesCount: counts.enemies, loveCount: counts.love };
    });
  };

  const countOf = (group: GroupName): number => draft[GROUP_LABEL[group].countKey];

  return (
    <div>
      <StepHeader title="Lifepath" subtitle="Tu pasado: tirá cada tabla o elegí el resultado a mano." page={source === 'cemk' ? 'CEMK RB pp. 19-24' : 'Core pp. 44-69'} />
      <NoviceGuide step="lifepath" />

      <Panel className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono-code text-[#64748b] mr-1">Fuente:</span>
          {(['cemk', 'core'] as LifepathSource[]).map((s) => (
            <Btn key={s} tone={source === s ? 'red' : 'gray'} role="radio" aria-checked={source === s} onClick={() => setSource(s)}>
              {s === 'cemk' ? 'CEMK (rápido, d6)' : 'Core completo'}
            </Btn>
          ))}
          <Btn tone="green" className="ml-auto" onClick={rollAll}>
            🎲 Tirar todo
          </Btn>
        </div>
        <p className="text-[10px] font-mono-code text-[#64748b] mt-2">Cambiar de fuente borra las tiradas del Lifepath.</p>
      </Panel>

      <Panel title="Tablas generales" className="mb-4">
        {singles.map((t) => (
          <TableRow key={t.id} table={t} prefix="g" pick={draft.lifepath[t.id]} onChange={(p) => setLife(t.id, p)} />
        ))}
      </Panel>

      {(['friends', 'enemies', 'love'] as GroupName[]).map((grp) => {
        const info = GROUP_LABEL[grp];
        const countTable = info.countTable ? tableById(info.countTable) : undefined;
        const n = countOf(grp);
        return (
          <Panel key={grp} title={info.title} className="mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <label htmlFor={`lp-count-${grp}`} className="text-xs text-[#cbd5e1]">
                Cantidad
              </label>
              <input
                id={`lp-count-${grp}`}
                type="number"
                min={0}
                max={10}
                className={`${INPUT_CLS} w-16`}
                value={n}
                onChange={(e) => setCount(grp, parseInt(e.target.value, 10))}
              />
              {countTable && (
                <>
                  <Btn tone="cyan" aria-label={`Tirar cantidad de ${info.title}`} onClick={() => rollCount(grp)}>
                    🎲 Tirar {countTable.die}
                  </Btn>
                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    {countTable.source.book} p.{countTable.source.page ?? '?'}
                  </span>
                  {draft.lifepath[countTable.id] && <span className="text-xs text-[#10b981]">{draft.lifepath[countTable.id].value}</span>}
                </>
              )}
            </div>
            {n === 0 && <p className="text-xs text-[#64748b]">Ninguno por ahora.</p>}
            {Array.from({ length: n }, (_, i) => (
              <div key={i} className="mb-2 border border-[#1e2334] rounded-xs p-2 bg-[#0a0b0e]">
                <div className="text-[11px] font-mono-code text-[#06b6d4] uppercase">
                  {info.one} {i + 1}
                </div>
                {groups[grp].map((id) => {
                  const t = tableById(id);
                  if (!t) return null;
                  const key = lifepathKey(grp, i, id);
                  return <TableRow key={key} table={t} prefix={`${grp}${i}`} pick={draft.lifepath[key]} onChange={(p) => setLife(key, p)} />;
                })}
              </div>
            ))}
          </Panel>
        );
      })}

      {source === 'core' && (
        <Panel title="Lifepath de rol">
          {!draft.role && <p className="text-xs text-[#f59e0b]">Elegí un rol en el paso anterior para ver sus tablas.</p>}
          {pendingChoices.length > 0 && (
            <p className="text-xs text-[#f59e0b] mb-1" role="status">
              Elegí a mano: {pendingChoices.map((t) => t.name).join(' · ')}. "Tirar todo" no tira las tablas a elección; las que dependen de ellas aparecen al elegir.
            </p>
          )}
          {roleTables.map((t) => (
            <TableRow key={t.id} table={t} prefix="r" pick={draft.roleLifepath[t.id]} onChange={(p) => setRoleLife(t.id, p)} />
          ))}
        </Panel>
      )}
    </div>
  );
};
