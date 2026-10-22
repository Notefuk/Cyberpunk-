// Panel del Fixer: Operator (Reach, Grease y Haggle), Core pp. 159-161. [Claude Code · 2026-10-23]
import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGmModeStore } from '../../store/gmModeStore';
import { useCombatStore } from '../../store/useCombatStore';
import { fixerReach, getRoleRankInfo } from '../../engine/roleRules';
import { greaseForRank, haggleDealsAvailable, rollHaggle } from '../../engine/socialRoleRules';
import type { HaggleResult } from '../../engine/socialRoleRules';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';

const ROLE = 'Fixer';
type Source = 'sheet' | 'enemy' | 'manual';

const compact = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');

const panelCls = 'chamfer-card bg-slate-900/70 border border-slate-700 p-2 flex flex-col gap-2 min-w-0';
const titleCls = 'font-tech text-[11px] uppercase tracking-wider text-cyan-300';
const selCls = 'w-full min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';
const inpCls = 'min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';
const btnCls = 'font-tech text-[11px] uppercase px-2 py-1 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed';
const txtCls = 'text-[11px] text-slate-300 break-words min-w-0';

// Nivel de Trading en generalSkills (clave compacta).
const tradingOf = (generalSkills: Record<string, number> | undefined): number => {
  let level = 0;
  for (const [k, v] of Object.entries(generalSkills ?? {})) {
    if (compact(k) === 'trading' && typeof v === 'number') level = Math.max(level, v);
  }
  return level;
};

export const FixerPanel: React.FC = () => {
  const char = useCharacterStore((s) => s.getActiveCharacter());
  const characters = useCharacterStore((s) => s.characters);
  const era = useCombatStore((s) => s.era);
  const gmFreeEdit = useGmModeStore((s) => s.gmFreeEdit);

  const [manualRank, setManualRank] = useState(1);
  const [source, setSource] = useState<Source>('manual');
  const [sheetId, setSheetId] = useState('');
  const [enemyId, setEnemyId] = useState(ENEMIES_CATALOG[0]?.id ?? '');
  const [mCool, setMCool] = useState(5);
  const [mTrading, setMTrading] = useState(0);
  const [mIsFixer, setMIsFixer] = useState(false);
  const [mRank, setMRank] = useState(1);
  const [result, setResult] = useState<{ r: HaggleResult; who: string; rank: number } | null>(null);
  const [dealIdx, setDealIdx] = useState<number | null>(null);

  if (!char) {
    return <div className={panelCls}><span className={txtCls}>No hay ficha activa.</span></div>;
  }

  const roleMatches = char.role === ROLE;
  const canRoll = roleMatches || gmFreeEdit;
  const rank = roleMatches ? (char.roleRank || 0) : manualRank;
  const reach = fixerReach(rank, era);
  const grease = greaseForRank(rank);
  const info = getRoleRankInfo(ROLE, rank, era);

  const fixerCool = char.stats?.COOL ?? 0;
  const fixerTrading = tradingOf(char.generalSkills);

  // Contraparte
  const sheet = characters.find((c) => c.id === sheetId);
  const enemy = ENEMIES_CATALOG.find((e) => e.id === enemyId);
  const enemyTradingBase = enemy?.skillBases?.Trading;
  // skillBases del bestiario ya suma STAT + skill: se resta COOL para recuperar el nivel de Trading.
  const enemyTrading = typeof enemyTradingBase === 'number' ? Math.max(0, enemyTradingBase - (enemy?.stats.COOL ?? 0)) : 0;

  let cp: { name: string; cool: number; trading: number; isFixer: boolean; operatorRank: number } | null = null;
  if (source === 'sheet' && sheet) {
    const isF = sheet.role === 'Fixer';
    cp = { name: sheet.handle, cool: sheet.stats?.COOL ?? 0, trading: tradingOf(sheet.generalSkills), isFixer: isF, operatorRank: isF ? (sheet.roleRank || 0) : 0 };
  } else if (source === 'enemy' && enemy) {
    cp = { name: enemy.name, cool: enemy.stats.COOL ?? 0, trading: enemyTrading, isFixer: false, operatorRank: 0 };
  } else if (source === 'manual') {
    cp = { name: 'Contraparte', cool: mCool, trading: mTrading, isFixer: mIsFixer, operatorRank: mIsFixer ? mRank : 0 };
  }

  const doHaggle = () => {
    if (!cp) return;
    const r = rollHaggle({
      fixer: { cool: fixerCool, trading: fixerTrading, operatorRank: rank },
      counterpart: { cool: cp.cool, trading: cp.trading, isFixer: cp.isFixer, operatorRank: cp.operatorRank }
    });
    setResult({ r, who: cp.name, rank });
    setDealIdx(null);
  };

  const numInp = (value: number, set: (n: number) => void, min = 0) => (
    <input type="number" min={min} value={value} onChange={(e) => set(Math.max(min, Number(e.target.value) || 0))} className={`${inpCls} w-16`} />
  );

  const resultDeals = result ? haggleDealsAvailable(result.rank) : [];

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className={panelCls}>
        <span className={titleCls}>Operator (Core pp. 159-161)</span>
        <span className={txtCls}>Fixer: {char.handle} · Rango {rank}</span>
        {!roleMatches && (
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-[11px] text-amber-300 min-w-0">Esta herramienta es del rol {ROLE}.{gmFreeEdit ? '' : ' Las tiradas solo se habilitan en modo GM.'}</span>
            {gmFreeEdit && (
              <label className="text-[11px] text-slate-300 flex items-center gap-1">
                Rango manual
                <input type="number" min={1} max={10} value={manualRank} onChange={(e) => setManualRank(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} className={`${inpCls} w-16`} />
              </label>
            )}
          </div>
        )}
        {era === '2077' && info.tweaks2077.length > 0 && (
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-tech text-[11px] uppercase text-slate-400">Ajustes 2070s</span>
            {info.tweaks2077.map((t, i) => (
              <span key={i} className={txtCls}>{t.textEs} ({t.source.book} p.{String(t.source.page)})</span>
            ))}
          </div>
        )}
      </div>

      <div className={panelCls}>
        <span className={titleCls}>Reach y Grease</span>
        <span className={txtCls}>
          Reach: hasta {reach.category} ({reach.citeEs}) · Night Market: {reach.nightMarket ? 'sí' : 'no'} · Midnight Market: {reach.midnightMarket ? 'sí' : 'no'} (Core p.160)
        </span>
        <span className={txtCls}>
          Grease: {grease ? `${grease.textEs} (Core p.160)` : 'sin Rango, sin Grease.'}
        </span>
      </div>

      <div className={panelCls}>
        <span className={titleCls}>Haggle (Core p.159)</span>
        <span className={txtCls}>Vos: COOL {fixerCool} + Trading {fixerTrading} + Operator {rank}</span>
        <div className="flex flex-wrap gap-1.5 min-w-0">
          {([['sheet', 'Ficha guardada'], ['enemy', 'Bestiario'], ['manual', 'A mano']] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setSource(k)}
              className={`font-tech text-[11px] uppercase px-2 py-1 border ${source === k ? 'border-cyan-400 text-cyan-200 bg-cyan-500/10' : 'border-slate-700 text-slate-400'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {source === 'sheet' && (
          <select value={sheetId} onChange={(e) => setSheetId(e.target.value)} className={selCls}>
            <option value="">Elegí una ficha</option>
            {characters.map((c) => <option key={c.id} value={c.id}>{c.handle}{c.role === 'Fixer' ? ` (Fixer R${c.roleRank})` : ''}</option>)}
          </select>
        )}
        {source === 'enemy' && (
          <div className="flex flex-col gap-1 min-w-0">
            <select value={enemyId} onChange={(e) => setEnemyId(e.target.value)} className={selCls}>
              {ENEMIES_CATALOG.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            {enemy && typeof enemyTradingBase !== 'number' && (
              <span className="text-[11px] text-amber-300">Este enemigo no tiene Trading en su ficha: se usa 0.</span>
            )}
          </div>
        )}
        {source === 'manual' && (
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <label className="text-[11px] text-slate-300 flex items-center gap-1">COOL {numInp(mCool, setMCool)}</label>
            <label className="text-[11px] text-slate-300 flex items-center gap-1">Trading {numInp(mTrading, setMTrading)}</label>
            <label className="text-[11px] text-slate-300 flex items-center gap-1">
              <input type="checkbox" checked={mIsFixer} onChange={(e) => setMIsFixer(e.target.checked)} /> Es Fixer
            </label>
            {mIsFixer && <label className="text-[11px] text-slate-300 flex items-center gap-1">Operator {numInp(mRank, setMRank, 1)}</label>}
          </div>
        )}
        {cp && (
          <span className={txtCls}>
            {cp.name}: COOL {cp.cool} + Trading {cp.trading}{cp.isFixer ? ` + Operator ${cp.operatorRank}` : ''}
          </span>
        )}
        <div>
          <button type="button" className={btnCls} disabled={!canRoll || !cp || rank < 1} onClick={doHaggle}>Regatear</button>
        </div>

        {result && (
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className={txtCls}>Fixer: {result.r.breakdownFixer}</span>
            <span className={txtCls}>{result.who}: {result.r.breakdownCounterpart}</span>
            <span className={`${txtCls} ${result.r.fixerWins ? 'text-emerald-300' : 'text-red-300'}`}>
              {result.r.fixerWins ? 'GANA EL FIXER' : 'GANA LA CONTRAPARTE'} · empate gana quien se defiende (Core p.129)
            </span>
            {result.r.fixerWins && (
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-tech text-[11px] uppercase text-slate-400">Elegí 1 trato por transacción (Core p.160)</span>
                {resultDeals.map((d, i) => (
                  <button
                    key={`${d.fromRank}-${i}`}
                    type="button"
                    onClick={() => setDealIdx(i)}
                    className={`text-left text-[11px] p-1.5 border min-w-0 break-words ${dealIdx === i ? 'border-cyan-400 text-cyan-200 bg-cyan-500/10' : 'border-slate-700 text-slate-300'}`}
                  >
                    {d.textEs}
                  </button>
                ))}
                {dealIdx !== null && resultDeals[dealIdx] && (
                  <span className="text-[11px] text-emerald-300 break-words min-w-0">Trato elegido: {resultDeals[dealIdx].textEs}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
