// Paso 4 del creador: STATs y derivados (Core pp. 73-80). [Claude Code · 2026-10-22]
import React from 'react';
import { CORE_ROLE_TABLES } from '../../../data/creation';
import { STAT_TOOLTIPS } from '../../../data/characterCreationData';
import {
  STAT_KEYS,
  STAT_MAX,
  STAT_MIN,
  STAT_POINTS_COMPLETE_PACKAGE,
  applyEdgerunnerRoll,
  applyStreetratRow,
  computeDerived,
  getRoleDisplayName,
  getStatPointsSpent,
  rollD10,
  type CreatorDraft
} from '../../../engine/characterCreation';
import type { StatKey } from '../../../types/cyberpunk';
import { Btn, Panel, StepHeader, type StepProps } from './CreatorUi';

const StatLabel: React.FC<{ stat: StatKey }> = ({ stat }) => {
  const t = STAT_TOOLTIPS[stat];
  return (
    <span
      className="font-tech font-bold text-white cursor-help underline decoration-dotted decoration-[#64748b]"
      title={`${t.name} · ${t.spanishName}\n${t.shortSummary}\n\n${t.beginnerExplanation}`}
    >
      {stat}
    </span>
  );
};

export const DerivedPanel: React.FC<{ draft: CreatorDraft }> = ({ draft }) => {
  const d = computeDerived(draft);
  const { BODY, WILL, EMP } = draft.stats;
  const rows: Array<{ label: string; value: string; formula: string }> = [
    { label: 'HP máximo', value: String(d.maxHp), formula: `10 + 5 × ⌈(BODY ${BODY} + WILL ${WILL}) / 2⌉` },
    { label: 'Seriously Wounded', value: String(d.seriouslyWounded), formula: 'mitad del HP máximo, redondeado hacia arriba' },
    { label: 'Death Save', value: String(d.deathSave), formula: `= BODY (${BODY})` },
    { label: 'Humanidad máxima', value: String(d.maxHumanity), formula: `EMP ${EMP} × 10` },
    { label: 'Humanidad actual', value: String(d.humanity), formula: `${d.maxHumanity} − ${d.humanityLoss} de pérdida por ciberware` },
    { label: 'EMP efectivo', value: String(d.effectiveEmp), formula: 'baja 1 por cada decena de Humanidad perdida' }
  ];
  return (
    <Panel title="Derivados (Core pp. 79-80)">
      <dl className="grid sm:grid-cols-2 gap-2">
        {rows.map((r) => (
          <div key={r.label} className="bg-[#0a0b0e] border border-[#1e2334] rounded-xs p-2">
            <dt className="text-[11px] font-mono-code text-[#64748b] uppercase">{r.label}</dt>
            <dd className="font-tech text-xl font-black text-[#10b981]">{r.value}</dd>
            <dd className="text-[10px] font-mono-code text-[#94a3b8]">{r.formula}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
};

export const StatsStep: React.FC<StepProps> = ({ draft, update }) => {
  const { role, method } = draft;

  if (!role && method !== 'complete_package') {
    return (
      <div>
        <StepHeader title="STATs" />
        <p className="text-xs text-[#f59e0b]">Elegí un rol en el paso anterior para ver su tabla de STATs.</p>
      </div>
    );
  }

  const table = role ? CORE_ROLE_TABLES.statTables[role] : null;

  const pickRow = (row: number): void => update((d) => applyStreetratRow(d, row));
  const rollStat = (stat: StatKey): void => update((d) => applyEdgerunnerRoll(d, stat, rollD10()));
  const rollAll = (): void =>
    update((d) => STAT_KEYS.reduce<CreatorDraft>((acc, k) => applyEdgerunnerRoll(acc, k, rollD10()), d));
  const setStat = (stat: StatKey, value: number): void => {
    const v = Math.max(STAT_MIN, Math.min(STAT_MAX, Number.isFinite(value) ? Math.floor(value) : STAT_MIN));
    update((d) => ({ ...d, stats: { ...d.stats, [stat]: v } }));
  };

  const spent = getStatPointsSpent(draft.stats);

  return (
    <div>
      <StepHeader
        title="STATs"
        subtitle={role ? `Rol: ${getRoleDisplayName(role, draft.era)}` : undefined}
        page={method === 'streetrat' ? 'Core p.73-74' : method === 'edgerunner' ? 'Core p.77' : 'Core p.78'}
      />

      {method === 'streetrat' && table && (
        <Panel title="Streetrat: tabla del rol (1d10)" className="mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Btn tone="cyan" onClick={() => pickRow(rollD10())}>
              🎲 Tirar 1d10
            </Btn>
            {draft.statRow !== null && <span className="text-xs font-mono-code text-[#10b981]">Fila elegida: {draft.statRow}</span>}
            <span className="text-[10px] font-mono-code text-[#64748b]">
              {table.source.book} p.{table.source.page ?? '?'} · al elegir fila también se fijan las skills de la plantilla (p.86)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono-code">
              <thead>
                <tr className="text-[#64748b]">
                  <th className="p-1 text-left">1d10</th>
                  {STAT_KEYS.map((k) => (
                    <th key={k} className="p-1">
                      <StatLabel stat={k} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r) => (
                  <tr
                    key={r.roll}
                    onClick={() => pickRow(r.roll)}
                    className={`cursor-pointer text-center border-t border-[#1e2334] ${draft.statRow === r.roll ? 'bg-[#dc2626]/20 text-white' : 'hover:bg-[#151926] text-[#cbd5e1]'}`}
                  >
                    <td className="p-1 text-left">
                      <button type="button" aria-label={`Elegir fila ${r.roll}`} aria-pressed={draft.statRow === r.roll} className="cursor-pointer font-bold">
                        {r.roll}
                      </button>
                    </td>
                    {STAT_KEYS.map((k) => (
                      <td key={k} className="p-1">
                        {r[k]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {method === 'edgerunner' && (
        <Panel title="Edgerunner: 1d10 por cada STAT" className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Btn tone="green" onClick={rollAll}>
              🎲 Tirar todos
            </Btn>
            <span className="text-[10px] font-mono-code text-[#64748b]">
              {table?.source.book} p.{table?.source.page ?? '?'}: el valor es el de esa columna en la fila que salga.
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STAT_KEYS.map((k) => (
              <div key={k} className="bg-[#0a0b0e] border border-[#1e2334] rounded-xs p-2 text-center">
                <StatLabel stat={k} />
                <div className="font-tech text-2xl font-black text-[#10b981]">{draft.statRolls[k] !== undefined ? draft.stats[k] : '–'}</div>
                <div className="text-[10px] font-mono-code text-[#64748b]">{draft.statRolls[k] !== undefined ? `tirada ${draft.statRolls[k]}` : 'sin tirar'}</div>
                <Btn tone="cyan" className="mt-1" aria-label={`Tirar ${k}`} onClick={() => rollStat(k)}>
                  Tirar
                </Btn>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {method === 'complete_package' && (
        <Panel title="Complete Package: repartí los puntos" className="mb-4">
          <p
            className={`text-xs font-mono-code mb-2 ${spent === STAT_POINTS_COMPLETE_PACKAGE ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}
            aria-live="polite"
          >
            {spent}/{STAT_POINTS_COMPLETE_PACKAGE} puntos (cada STAT entre {STAT_MIN} y {STAT_MAX}, Core p.78)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STAT_KEYS.map((k) => (
              <div key={k} className="bg-[#0a0b0e] border border-[#1e2334] rounded-xs p-2 text-center">
                <StatLabel stat={k} />
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Btn aria-label={`Bajar ${k}`} disabled={draft.stats[k] <= STAT_MIN} onClick={() => setStat(k, draft.stats[k] - 1)}>
                    −
                  </Btn>
                  <input
                    type="number"
                    aria-label={`Valor de ${k}`}
                    min={STAT_MIN}
                    max={STAT_MAX}
                    value={draft.stats[k]}
                    onChange={(e) => setStat(k, parseInt(e.target.value, 10))}
                    className="w-12 text-center bg-[#0a0b0e] border border-[#2a3148] text-white font-tech font-black rounded-xs py-1"
                  />
                  <Btn aria-label={`Subir ${k}`} disabled={draft.stats[k] >= STAT_MAX} onClick={() => setStat(k, draft.stats[k] + 1)}>
                    +
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {method !== 'complete_package' && method !== null && (
        <Panel title="STATs actuales" className="mb-4">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-center">
            {STAT_KEYS.map((k) => (
              <div key={k} className="bg-[#0a0b0e] border border-[#1e2334] rounded-xs p-1">
                <StatLabel stat={k} />
                <div className="font-tech text-lg font-black text-white">{draft.stats[k]}</div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <DerivedPanel draft={draft} />
    </div>
  );
};
