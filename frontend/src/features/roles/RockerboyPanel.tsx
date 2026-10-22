// Panel del Rockerboy: Charismatic Impact (fans y favores), Core pp. 144-145. [Claude Code · 2026-10-23]
import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGameClockStore } from '../../store/gameClockStore';
import { useGmModeStore } from '../../store/gmModeStore';
import { useCombatStore } from '../../store/useCombatStore';
import { getRoleRankInfo } from '../../engine/roleRules';
import { fanDv, rollConvertFans, rollFavor, favorExamplesForRank } from '../../engine/socialRoleRules';
import type { FanGroupSize, RankedRoll, FavorResult } from '../../engine/socialRoleRules';

const ROLE = 'Rockerboy';
const SIZE_LABEL: Record<FanGroupSize, string> = {
  single: 'Una persona',
  small: 'Grupo de hasta 6',
  huge: 'Grupo enorme'
};
const SIZES: FanGroupSize[] = ['single', 'small', 'huge'];

const panelCls = 'chamfer-card bg-slate-900/70 border border-slate-700 p-2 flex flex-col gap-2 min-w-0';
const titleCls = 'font-tech text-[11px] uppercase tracking-wider text-cyan-300';
const selCls = 'w-full min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';
const inpCls = 'min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';
const btnCls = 'font-tech text-[11px] uppercase px-2 py-1 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed';
const txtCls = 'text-[11px] text-slate-300 break-words min-w-0';

export const RockerboyPanel: React.FC = () => {
  const char = useCharacterStore((s) => s.getActiveCharacter());
  const addGroup = useCharacterStore((s) => s.addRockerboyFanGroup);
  const updateGroup = useCharacterStore((s) => s.updateRockerboyFanGroup);
  const removeGroup = useCharacterStore((s) => s.removeRockerboyFanGroup);
  const era = useCombatStore((s) => s.era);
  const day = useGameClockStore((s) => s.day);
  const gmFreeEdit = useGmModeStore((s) => s.gmFreeEdit);

  const [manualRank, setManualRank] = useState(1);
  const [newName, setNewName] = useState('');
  const [newSize, setNewSize] = useState<FanGroupSize>('small');
  const [newNote, setNewNote] = useState('');
  const [convSize, setConvSize] = useState<FanGroupSize>('small');
  const [convRoll, setConvRoll] = useState<(RankedRoll & { size: FanGroupSize }) | null>(null);
  const [convName, setConvName] = useState('');
  const [favGroupId, setFavGroupId] = useState('');
  const [favSize, setFavSize] = useState<FanGroupSize>('small');
  const [favText, setFavText] = useState('');
  const [favRank, setFavRank] = useState(1);
  const [favResult, setFavResult] = useState<FavorResult | null>(null);

  if (!char) {
    return <div className={panelCls}><span className={txtCls}>No hay ficha activa.</span></div>;
  }

  const roleMatches = char.role === ROLE;
  const canRoll = roleMatches || gmFreeEdit;
  const rank = roleMatches ? (char.roleRank || 0) : manualRank;
  const groups = char.rockerboyFans ?? [];
  const info = getRoleRankInfo(ROLE, rank, era);
  const favGroup = groups.find((g) => g.id === favGroupId);
  const effFavSize: FanGroupSize = favGroup ? favGroup.size : favSize;
  const examples = favorExamplesForRank(rank);

  const doConvert = () => {
    const r = rollConvertFans(rank, convSize);
    setConvRoll({ ...r, size: convSize });
    setConvName('');
  };

  const doFavor = () => {
    const r = rollFavor({
      rank,
      size: effFavSize,
      requiredRank: favRank,
      blockedUntilDay: favGroup?.favorBlockedUntilDay,
      currentDay: day
    });
    setFavResult(r);
    if (favGroup && r.status === 'rolled' && !r.success && r.blockUntilDay !== undefined) {
      updateGroup(favGroup.id, { favorBlockedUntilDay: r.blockUntilDay });
    }
  };

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className={panelCls}>
        <span className={titleCls}>Charismatic Impact (Core pp. 144-145)</span>
        <span className={txtCls}>Rockerboy: {char.handle} · Rango {rank}</span>
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

      {/* Registro de fans */}
      <div className={panelCls}>
        <span className={titleCls}>Registro de fans</span>
        {groups.length === 0 && <span className="text-[11px] text-slate-500">Sin grupos de fans registrados.</span>}
        {groups.map((g) => (
          <div key={g.id} className="border border-slate-700 p-1.5 flex flex-col gap-1.5 min-w-0">
            <div className="flex flex-wrap gap-1.5 min-w-0">
              <input value={g.name} onChange={(e) => updateGroup(g.id, { name: e.target.value })} className={`${inpCls} flex-1`} />
              <select value={g.size} onChange={(e) => updateGroup(g.id, { size: e.target.value as FanGroupSize })} className={`${selCls} sm:w-auto flex-1`}>
                {SIZES.map((s) => <option key={s} value={s}>{SIZE_LABEL[s]} (DV{fanDv(s)})</option>)}
              </select>
              <button type="button" className={btnCls} onClick={() => { if (favGroupId === g.id) setFavGroupId(''); removeGroup(g.id); }}>Borrar</button>
            </div>
            <input value={g.note ?? ''} placeholder="Nota" onChange={(e) => updateGroup(g.id, { note: e.target.value })} className={`${inpCls} w-full`} />
            {g.favorBlockedUntilDay !== undefined && g.favorBlockedUntilDay >= day && (
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="text-[11px] text-amber-300">Favor bloqueado hasta el día {g.favorBlockedUntilDay}</span>
                <button type="button" className={btnCls} onClick={() => updateGroup(g.id, { favorBlockedUntilDay: undefined })}>Desbloquear</button>
              </div>
            )}
          </div>
        ))}
        <div className="flex flex-wrap gap-1.5 min-w-0">
          <input value={newName} placeholder="Nombre del grupo" onChange={(e) => setNewName(e.target.value)} className={`${inpCls} flex-1`} />
          <select value={newSize} onChange={(e) => setNewSize(e.target.value as FanGroupSize)} className={`${selCls} sm:w-auto flex-1`}>
            {SIZES.map((s) => <option key={s} value={s}>{SIZE_LABEL[s]}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-1.5 min-w-0">
          <input value={newNote} placeholder="Nota (opcional)" onChange={(e) => setNewNote(e.target.value)} className={`${inpCls} flex-1`} />
          <button
            type="button"
            className={btnCls}
            disabled={!newName.trim()}
            onClick={() => { addGroup({ name: newName.trim(), size: newSize, note: newNote.trim() || undefined }); setNewName(''); setNewNote(''); }}
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Convertir en fans */}
      <div className={panelCls}>
        <span className={titleCls}>Convertir en fans (Core p.144)</span>
        <span className="text-[11px] text-slate-400">Fuera de combate, salvo que te detesten. El libro no da penalidad por fallar.</span>
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <select value={convSize} onChange={(e) => setConvSize(e.target.value as FanGroupSize)} className={`${selCls} sm:w-auto flex-1`}>
            {SIZES.map((s) => <option key={s} value={s}>{SIZE_LABEL[s]} (DV{fanDv(s)})</option>)}
          </select>
          <button type="button" className={btnCls} disabled={!canRoll} onClick={doConvert}>Tirar</button>
        </div>
        {convRoll && (
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className={txtCls}>{convRoll.breakdown} · {convRoll.success ? 'ÉXITO' : 'FALLO'} (Core p.144)</span>
            {convRoll.success && (
              <div className="flex flex-wrap gap-1.5 min-w-0">
                <input value={convName} placeholder="Nombre del grupo" onChange={(e) => setConvName(e.target.value)} className={`${inpCls} flex-1`} />
                <button
                  type="button"
                  className={btnCls}
                  disabled={!convName.trim()}
                  onClick={() => { addGroup({ name: convName.trim(), size: convRoll.size }); setConvRoll(null); setConvName(''); }}
                >
                  Agregar al registro
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pedir favor */}
      <div className={panelCls}>
        <span className={titleCls}>Pedir favor (Core p.145)</span>
        <div className="flex flex-wrap gap-1.5 min-w-0">
          <select value={favGroupId} onChange={(e) => setFavGroupId(e.target.value)} className={`${selCls} sm:w-auto flex-1`}>
            <option value="">Tamaño suelto (sin registro)</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name} · {SIZE_LABEL[g.size]}</option>)}
          </select>
          {!favGroup && (
            <select value={favSize} onChange={(e) => setFavSize(e.target.value as FanGroupSize)} className={`${selCls} sm:w-auto flex-1`}>
              {SIZES.map((s) => <option key={s} value={s}>{SIZE_LABEL[s]} (DV{fanDv(s)})</option>)}
            </select>
          )}
        </div>
        <input value={favText} placeholder="Favor pedido (texto libre)" onChange={(e) => setFavText(e.target.value)} className={`${inpCls} w-full`} />
        <label className="text-[11px] text-slate-300 flex flex-wrap items-center gap-1 min-w-0">
          Rango que requiere (lo decide el GM)
          <select value={favRank} onChange={(e) => setFavRank(Number(e.target.value))} className={`${inpCls} w-16`}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <div>
          <button type="button" className={btnCls} disabled={!canRoll} onClick={doFavor}>Pedir favor</button>
        </div>
        {favResult && (
          <span className={`${txtCls} ${favResult.status === 'rolled' ? (favResult.success ? 'text-emerald-300' : 'text-red-300') : 'text-amber-300'}`}>
            {favText.trim() ? `"${favText.trim()}" — ` : ''}
            {favResult.status === 'auto-fail-rank' ? 'FALLA AUTOMÁTICA. ' : favResult.status === 'blocked-week' ? 'BLOQUEADO. ' : `${favResult.success ? 'ÉXITO' : 'FALLO'}. `}
            {favResult.breakdown}
            {favResult.status === 'rolled' && !favResult.success && favResult.blockUntilDay !== undefined
              ? ` No se puede pedir el mismo favor hasta el día ${favResult.blockUntilDay}${favGroup ? ' (guardado en el grupo)' : ''}.`
              : ''}
            {' '}(Core p.145)
          </span>
        )}
        <span className="font-tech text-[11px] uppercase text-slate-400">Favores y lugares (Core p.145)</span>
        {examples.map((row) => (
          <div key={`${row.fromRank}-${row.toRank}`} className={`border p-1.5 flex flex-col gap-0.5 min-w-0 ${row.applies ? 'border-cyan-400' : 'border-slate-700'}`}>
            <span className="font-tech text-[11px] text-slate-200">
              Rango {row.fromRank === row.toRank ? row.fromRank : `${row.fromRank}-${row.toRank}`}{row.applies ? ' (actual)' : ''} · {row.venue}
            </span>
            <span className={txtCls}>Una persona: {row.singleFan}</span>
            <span className={txtCls}>Grupo chico: {row.smallGroup}</span>
            <span className={txtCls}>Grupo enorme: {row.hugeGroup}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
