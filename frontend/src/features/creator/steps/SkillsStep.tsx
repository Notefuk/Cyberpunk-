// Paso 5 del creador: skills (Core pp. 81-90). [Claude Code · 2026-10-22]
import React, { useEffect, useMemo } from 'react';
import {
  SKILL_MAX_LEVEL,
  SKILL_MIN_EDGERUNNER,
  SKILL_POINTS,
  canonSkillKey,
  getEdgerunnerSkillNames,
  getLifepathTables,
  getSkillCatalog,
  getSkillPointsSpent,
  skillLevelCost,
  type SkillCatalogEntry
} from '../../../engine/characterCreation';
import { Btn, INPUT_CLS, Panel, SourceBadge, StepHeader, type StepProps } from './CreatorUi';

const baseName = (name: string): string =>
  canonSkillKey(name)
    .replace(/\s*\(.*\)\s*$/, '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and');

export const SkillsStep: React.FC<StepProps> = ({ draft, update }) => {
  const { method, role } = draft;
  const catalog = getSkillCatalog();
  const readOnly = method === 'streetrat';
  const allowed = useMemo(() => (method === 'edgerunner' && role ? getEdgerunnerSkillNames(role) : []), [method, role]);

  // Edgerunner arranca con sus 20 skills en el mínimo (Core p.77); Complete Package, con las básicas en 2 (Core p.85).
  useEffect(() => {
    if (Object.keys(draft.skills).length > 0) return;
    if (method === 'edgerunner' && allowed.length > 0) {
      update((d) => ({ ...d, skills: Object.fromEntries(allowed.map((n) => [n, SKILL_MIN_EDGERUNNER])) }));
    } else if (method === 'complete_package') {
      update((d) => ({ ...d, skills: Object.fromEntries(catalog.filter((s) => s.basic && s.name !== 'Language').map((s) => [canonSkillKey(s.name), 2])) }));
    }
  }, [method, allowed, draft.skills, update, catalog]);

  const keyFor = (entry: SkillCatalogEntry): string | null => {
    const b = baseName(entry.name);
    if (method === 'edgerunner') return allowed.find((n) => baseName(n) === b) ?? null;
    const existing = Object.keys(draft.skills).find((n) => baseName(n) === b);
    return existing ?? canonSkillKey(entry.name);
  };

  const minFor = (entry: SkillCatalogEntry): number => {
    if (method === 'edgerunner') return SKILL_MIN_EDGERUNNER;
    if (entry.basic && entry.name !== 'Language') return 2;
    return 0;
  };

  const setLevel = (key: string, level: number, min: number): void => {
    const v = Math.max(min, Math.min(SKILL_MAX_LEVEL, Number.isFinite(level) ? Math.floor(level) : min));
    update((d) => {
      const skills = { ...d.skills };
      if (v === 0) delete skills[key];
      else skills[key] = v;
      return { ...d, skills };
    });
  };

  const categories = useMemo(() => {
    const map = new Map<string, SkillCatalogEntry[]>();
    for (const s of catalog) {
      const list = map.get(s.category) ?? [];
      list.push(s);
      map.set(s.category, list);
    }
    return [...map.entries()];
  }, [catalog]);

  const spent = getSkillPointsSpent(draft);
  const languageSuggestions = useMemo(() => {
    const table = getLifepathTables(draft.lifepathSource, null).general.find((t) => t.id === 'cultural_origins');
    const pick = draft.lifepath['cultural_origins'];
    const result = table?.results.find((r) => r.es === pick?.value);
    return result?.extra?.languages ?? [];
  }, [draft.lifepathSource, draft.lifepath]);

  return (
    <div>
      <StepHeader
        title="Skills"
        subtitle={
          method === 'streetrat'
            ? 'Streetrat: las skills vienen fijas con el rol (Core p.86).'
            : method === 'edgerunner'
            ? 'Edgerunner: solo las 20 skills del rol, entre 2 y 6 (Core pp. 77 y 88).'
            : 'Complete Package: todas editables de 0 a 6; las básicas empiezan en 2 (Core pp. 81-90).'
        }
        page="Core pp. 81-90"
      />

      <Panel className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`font-tech text-lg font-black ${spent === SKILL_POINTS ? 'text-[#10b981]' : 'text-[#f59e0b]'}`} aria-live="polite">
            {spent}/{SKILL_POINTS} puntos
          </span>
          <span className="text-[10px] font-mono-code text-[#64748b]">Las skills ×2 cuestan 2 puntos por nivel (Core p.81).</span>
        </div>
        <div className="mt-3">
          <label htmlFor="cultural-language" className="text-xs text-[#cbd5e1] block mb-1">
            Idioma de origen cultural (4 gratis, Core p.90)
          </label>
          <input
            id="cultural-language"
            list="cultural-language-suggestions"
            className={`${INPUT_CLS} w-full sm:w-72`}
            value={draft.culturalLanguage}
            onChange={(e) => update((d) => ({ ...d, culturalLanguage: e.target.value }))}
            placeholder="p. ej. Streetslang"
          />
          <datalist id="cultural-language-suggestions">
            {languageSuggestions.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
          {languageSuggestions.length > 0 && (
            <p className="text-[10px] font-mono-code text-[#64748b] mt-1">Sugeridos por tu Origen Cultural: {languageSuggestions.join(', ')}.</p>
          )}
        </div>
      </Panel>

      {!method || (method === 'edgerunner' && !role) ? (
        <p className="text-xs text-[#f59e0b]">Elegí método y rol antes de repartir skills.</p>
      ) : (
        categories.map(([category, list]) => (
          <Panel key={category} title={category} className="mb-3">
            <div className="grid md:grid-cols-2 gap-x-4">
              {list.map((s) => {
                const key = keyFor(s);
                const level = key ? draft.skills[key] ?? 0 : 0;
                const editable = !readOnly && key !== null;
                const min = minFor(s);
                const cost = key ? skillLevelCost(key, level) : 0;
                return (
                  <div
                    key={s.name}
                    className={`flex items-center gap-2 py-1.5 border-b border-[#1e2334] ${!editable && !readOnly ? 'opacity-40' : ''}`}
                  >
                    <div className="min-w-0 flex-1" title={s.descEs}>
                      <span className="text-xs text-white font-bold">{s.name}</span>
                      {s.x2 && <span className="ml-1 text-[10px] font-mono-code text-[#f59e0b]">×2</span>}
                      <span className="ml-1 text-[10px] font-mono-code text-[#64748b]">{s.stat}</span>
                      <span className="ml-1 inline-flex gap-1 align-middle">
                        {s.books.map((b) => (
                          <SourceBadge key={b} book={b} />
                        ))}
                      </span>
                    </div>
                    {readOnly ? (
                      <span className="font-tech font-black text-white w-6 text-center">{level}</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Btn aria-label={`Bajar ${s.name}`} disabled={!editable || level <= min} onClick={() => key && setLevel(key, level - 1, min)}>
                          −
                        </Btn>
                        <input
                          type="number"
                          aria-label={`Nivel de ${s.name}`}
                          disabled={!editable}
                          min={min}
                          max={SKILL_MAX_LEVEL}
                          value={level}
                          onChange={(e) => key && setLevel(key, parseInt(e.target.value, 10), min)}
                          className="w-12 text-center bg-[#0a0b0e] border border-[#2a3148] text-white font-tech font-black rounded-xs py-1 disabled:opacity-40"
                        />
                        <Btn aria-label={`Subir ${s.name}`} disabled={!editable || level >= SKILL_MAX_LEVEL} onClick={() => key && setLevel(key, level + 1, min)}>
                          +
                        </Btn>
                      </div>
                    )}
                    <span className="w-14 text-right text-[10px] font-mono-code text-[#64748b]">{level > 0 ? `${cost} pts` : ''}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        ))
      )}
    </div>
  );
};
