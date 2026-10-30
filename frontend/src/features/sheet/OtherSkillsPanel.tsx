// Panel de las demás skills del Core (pp. 81-85), no de combate, con avance por IP. [Claude Code · 2026-10-22]
import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGmModeStore } from '../../store/gmModeStore';
import { getSkillCatalog } from '../../engine/characterCreation';
import { resolveSkillKey, normalizeCanonSkillName } from '../../data/characterCreationData';
import { ipCostSkillLevel } from '../../engine/roleRules';
import type { StatKey } from '../../types/cyberpunk';
import { readFavOnly, writeFavOnly } from './favoriteSkills';
import { InjuryPenaltyReminder } from './InjuryPenaltyReminder';

interface Row {
  key: string;
  name: string;
  x2: boolean;
  stat?: StatKey;
  books: string[];
  /** Skills que salen de la habilidad de rol (Medicine): se suben repartiendo puntos de rol, no con IP. */
  fromRole?: string;
}

// Core p.149: Surgery y Medical Tech no están en la lista general; las da Medicine (solo Medtech).
const ROLE_ONLY_SKILLS: Record<string, { name: string; stat: StatKey; fromRole: string }> = {
  medicaltech: { name: 'Medical Tech', stat: 'TECH', fromRole: 'Medicine, Core p.149' },
  surgery: { name: 'Surgery', stat: 'TECH', fromRole: 'Medicine, Core p.149' }
};

export const OtherSkillsPanel: React.FC = () => {
  const activeChar = useCharacterStore((state) => state.getActiveCharacter());
  const raiseGeneralSkillWithIp = useCharacterStore((state) => state.raiseGeneralSkillWithIp);
  const setGeneralSkill = useCharacterStore((state) => state.setGeneralSkill);
  const toggleFavoriteSkill = useCharacterStore((state) => state.toggleFavoriteSkill);
  const gmFreeEdit = useGmModeStore((s) => s.gmFreeEdit);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);
  // v5.8.0 (plan 23): mismo filtro "Solo favoritas" que la lista de combate. [Claude Code · 2026-10-30]
  const [favOnly, setFavOnly] = useState<boolean>(readFavOnly);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const general = activeChar?.generalSkills;

  const rows = useMemo<Row[]>(() => {
    const gs = general ?? {};
    const gsKeys = Object.keys(gs);
    const used = new Set<string>();
    const catalog = getSkillCatalog();
    const out: Row[] = [];
    // Los Folios guardan claves compactas en minúscula ('medicaltech', 'firstaid'): se comparan sin espacios ni símbolos.
    const compact = (x: string) => normalizeCanonSkillName(x).replace(/[^a-z0-9]/g, '');
    const combatNames = new Set<string>();
    for (const entry of catalog) {
      const ref = resolveSkillKey(entry.name);
      if (ref?.kind === 'combat') {
        combatNames.add(compact(entry.name));
        combatNames.add(compact(ref.key));
      }
    }
    for (const entry of catalog) {
      const ref = resolveSkillKey(entry.name);
      if (ref?.kind === 'combat') continue;
      const nName = compact(entry.name);
      const nRef = ref ? compact(ref.key) : null;
      const existing =
        gsKeys.find((k) => {
          const nk = compact(k);
          return nk === nName || (nRef !== null && nk === nRef);
        }) ??
        // Claves viejas abreviadas ('concealreveal', 'electronicssecurity'): prefijo del nombre del libro.
        gsKeys.find((k) => !k.includes('(') && compact(k).length >= 6 && nName.startsWith(compact(k)));
      const key = existing ?? ref?.key ?? entry.name;
      used.add(key);
      out.push({ key, name: entry.name, x2: entry.x2, stat: entry.stat, books: entry.books });
    }
    for (const k of gsKeys) {
      if (used.has(k)) continue;
      if (resolveSkillKey(k)?.kind === 'combat' || combatNames.has(compact(k))) continue;
      const roleOnly = ROLE_ONLY_SKILLS[compact(k)];
      if (roleOnly) {
        out.push({ key: k, name: roleOnly.name, x2: false, stat: roleOnly.stat, books: ['Core RED'], fromRole: roleOnly.fromRole });
        continue;
      }
      const baseName = compact(k.replace(/\s*\(.*\)\s*$/, ''));
      const base = catalog.find((c) => compact(c.name) === baseName);
      out.push({ key: k, name: k, x2: false, stat: base?.stat, books: [] });
    }
    return out;
  }, [general]);

  if (!activeChar) return null;

  const levelOf = (key: string) => general?.[key] ?? 0;
  const q = search.trim().toLowerCase();
  const favs = activeChar.favoriteSkills ?? [];
  const isFav = (key: string) => favs.includes(key);
  const visible = rows
    .filter((r) => (!q || r.name.toLowerCase().includes(q)) && (!onlyMine || levelOf(r.key) > 0) && (!favOnly || isFav(r.key)))
    .sort((a, b) => {
      const fa = isFav(a.key) ? 0 : 1;
      const fb = isFav(b.key) ? 0 : 1;
      const ha = levelOf(a.key) > 0 ? 0 : 1;
      const hb = levelOf(b.key) > 0 ? 0 : 1;
      return fa - fb || ha - hb || a.name.localeCompare(b.name);
    });

  const showMessage = (success: boolean, text: string) => {
    setMessage({ success, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const onPlus = (r: Row) => {
    const lvl = levelOf(r.key);
    if (gmFreeEdit) {
      setGeneralSkill(r.key, lvl + 1);
      return;
    }
    const res = raiseGeneralSkillWithIp(r.key, r.x2, r.name);
    showMessage(res.success, res.message);
  };

  return (
    <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-2 font-mono-code">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 text-left cursor-pointer">
        {open ? <ChevronDown className="w-3.5 h-3.5 text-[#38bdf8]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />}
        <span className="font-tech text-xs font-bold text-white uppercase tracking-wider">OTRAS SKILLS (Core pp. 81-85)</span>
      </button>

      {open && (
        <div className="space-y-2">
          <InjuryPenaltyReminder injuries={activeChar.activeInjuries} compact />
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar skill..."
              className="flex-1 min-w-0 bg-[#0f1118] border border-[#2b334d] text-white text-[11px] px-2 py-1 rounded focus:outline-none"
            />
            <label className="flex items-center gap-1 text-[10px] text-slate-300 cursor-pointer">
              <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} />
              <span>mostrar solo las que tengo</span>
            </label>
            <label className="flex items-center gap-1 text-[10px] text-amber-300 cursor-pointer">
              <input type="checkbox" checked={favOnly} onChange={(e) => { setFavOnly(e.target.checked); writeFavOnly(e.target.checked); }} />
              <span>★ solo favoritas</span>
            </label>
          </div>

          {message && (
            <div className={`text-[11px] ${message.success ? 'text-emerald-300' : 'text-red-400'}`}>{message.text}</div>
          )}

          <div className="space-y-1">
            {visible.map((r) => {
              const lvl = levelOf(r.key);
              const statVal = r.stat ? (activeChar.stats?.[r.stat] ?? 0) : 0;
              return (
                <div key={r.key} className="flex items-center justify-between gap-2 py-1 px-2 bg-[#151722] border border-[#222638] rounded">
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleFavoriteSkill(r.key)}
                      className={`text-sm leading-none cursor-pointer ${isFav(r.key) ? 'text-amber-400' : 'text-[#475569] hover:text-amber-300'}`}
                      title={isFav(r.key) ? `Quitar ${r.name} de favoritas` : `Marcar ${r.name} como favorita`}
                      aria-label={isFav(r.key) ? `Quitar ${r.name} de favoritas` : `Marcar ${r.name} como favorita`}
                    >
                      {isFav(r.key) ? '★' : '☆'}
                    </button>
                    <span className="font-tech text-xs font-bold text-white">{r.name}</span>
                    {r.x2 && <span className="text-[9px] bg-[#dc2626]/20 text-[#dc2626] px-1 rounded font-bold">x2</span>}
                    {r.stat && <span className="text-[10px] bg-[#202538] text-[#94a3b8] px-1 rounded">{r.stat} ({statVal})</span>}
                    {r.fromRole && <span className="text-[9px] text-amber-300">de {r.fromRole}</span>}
                    {r.books.map((b) => (
                      <span key={b} className="text-[8px] text-slate-500 border border-[#2b334d] px-1 rounded">{b}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-1 bg-[#10121a] px-1 py-0.5 rounded border border-[#202538]">
                      <button
                        type="button"
                        disabled={!gmFreeEdit || lvl <= 0 || !!r.fromRole}
                        onClick={() => setGeneralSkill(r.key, lvl - 1)}
                        className="w-4 h-4 bg-[#1f2434] hover:bg-[#dc2626] text-white rounded flex items-center justify-center disabled:opacity-30"
                        title={gmFreeEdit ? `Reducir ${r.name}` : 'Solo en modo GM'}
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white">{lvl}</span>
                      <button
                        type="button"
                        disabled={lvl >= 10 || !!r.fromRole}
                        onClick={() => onPlus(r)}
                        className="w-4 h-4 bg-[#1f2434] hover:bg-[#10b981] text-white rounded flex items-center justify-center disabled:opacity-30"
                        title={gmFreeEdit ? `Aumentar ${r.name} (modo GM)` : `Subir a ${lvl + 1}: ${ipCostSkillLevel(lvl + 1, r.x2)} IP`}
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <span className="text-[10px] font-bold bg-[#142320] text-[#10b981] border border-[#1b3f36] px-1.5 py-0.5 rounded">
                      BASE {statVal + lvl}
                    </span>
                  </div>
                </div>
              );
            })}
            {visible.length === 0 && (
              <div className="text-[11px] text-slate-500">
                {favOnly && favs.length === 0 ? 'Tocá ☆ en una skill para marcarla como favorita.' : 'Sin resultados.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
