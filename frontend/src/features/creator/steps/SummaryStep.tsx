// Paso 7 del creador: resumen y confirmación (Core pp. 40-42). [Claude Code · 2026-10-22]
import React, { useMemo } from 'react';
import { CEMK_FOLIO_METADATA_MAP } from '../../../data/cemkFolioPremadesData';
import { PREGEN_TEMPLATES } from '../../../data/characterCreationData';
import { CORE_GEAR_SKILLS, type CoreRoleName } from '../../../data/creation';
import {
  STAT_KEYS,
  buildCharacterLifepath,
  buildCharacterSheetFromDraft,
  computeDerived,
  getCyberwareList,
  getMissingChecklist,
  getMoneyRemaining,
  getRoleDisplayName,
  getRolePackage,
  getSummaryWarnings,
  getSkillPointsSpent,
  type CreatorStepId
} from '../../../engine/characterCreation';
import type { CharacterSheet } from '../../../types/cyberpunk';
import { Btn, INPUT_CLS, NoviceGuide, Panel, SourceBadge, StepHeader, eb, type StepProps } from './CreatorUi';

const METHOD_LABEL: Record<string, string> = {
  cemk_pregen: 'Pregen CEMK',
  easy_pregen: 'Pregen del Easy Mode',
  streetrat: 'Streetrat',
  edgerunner: 'Edgerunner',
  complete_package: 'Complete Package'
};

const STEP_LABEL: Record<CreatorStepId, string> = {
  method: 'Era y método',
  role: 'Rol',
  lifepath: 'Lifepath',
  stats: 'STATs',
  skills: 'Skills',
  gear: 'Equipo',
  summary: 'Resumen'
};

interface SummaryProps extends StepProps {
  onGoTo: (step: CreatorStepId) => void;
  onCreate: (sheet: CharacterSheet) => void;
}

const Line: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex gap-2 text-xs py-0.5">
    <span className="w-32 shrink-0 font-mono-code text-[#64748b] uppercase">{label}</span>
    <span className="text-[#cbd5e1] min-w-0">{children}</span>
  </div>
);

const lifepathLabels: Array<[keyof ReturnType<typeof buildCharacterLifepath>, string]> = [
  ['culturalRegion', 'Origen cultural'],
  ['personality', 'Personalidad'],
  ['clothingStyle', 'Vestimenta'],
  ['hairstyle', 'Peinado'],
  ['affectation', 'Afectación'],
  ['valueMost', 'Lo que más valora'],
  ['feelAboutPeople', 'Sobre la gente'],
  ['valuedPerson', 'Persona valorada'],
  ['valuedPossession', 'Posesión valorada'],
  ['familyBackground', 'Familia'],
  ['childhoodEnvironment', 'Infancia'],
  ['familyCrisis', 'Crisis familiar'],
  ['lifeGoal', 'Meta de vida']
];

export const SummaryStep: React.FC<SummaryProps> = ({ draft, update, onGoTo, onCreate }) => {
  const pregen = draft.method === 'cemk_pregen' || draft.method === 'easy_pregen';
  const checklist = getMissingChecklist(draft);

  const built = useMemo((): { sheet: CharacterSheet | null; warnings: string[]; error: string | null } => {
    if (getMissingChecklist(draft).length > 0) return { sheet: null, warnings: [], error: null };
    try {
      const r = buildCharacterSheetFromDraft(draft);
      return { sheet: r.sheet, warnings: r.warnings, error: null };
    } catch (e) {
      return { sheet: null, warnings: [], error: e instanceof Error ? e.message : String(e) };
    }
  }, [draft]);

  const summaryWarnings = getSummaryWarnings(draft, built);
  const derived = pregen ? null : computeDerived(draft);
  const lifepath = !pregen ? buildCharacterLifepath(draft) : null;
  const pkg = !pregen && draft.role && (draft.method === 'streetrat' || draft.method === 'edgerunner') ? getRolePackage(draft.role, draft.era, draft.packageChoices) : null;
  const left = getMoneyRemaining(draft);
  const pregenName = draft.method === 'cemk_pregen' ? CEMK_FOLIO_METADATA_MAP[draft.pregenId ?? '']?.name : PREGEN_TEMPLATES.find((p) => p.id === draft.pregenId)?.handle;
  const housing = CORE_GEAR_SKILLS.housing;

  return (
    <div>
      <StepHeader title="Resumen" subtitle="Revisá todo antes de crear el personaje." />
      <NoviceGuide step="summary" />

      <Panel className="mb-4">
        <label htmlFor="creator-handle" className="text-xs text-[#cbd5e1] block mb-1">
          Handle {pregen ? '(opcional, cambia el nombre de la pregen)' : '(obligatorio)'}
        </label>
        <input
          id="creator-handle"
          className={`${INPUT_CLS} w-full sm:w-80`}
          value={draft.handle}
          onChange={(e) => update((d) => ({ ...d, handle: e.target.value }))}
          placeholder="Handle del personaje"
        />
      </Panel>

      <Panel title="Identidad y rol" className="mb-4">
        <Line label="Era">{draft.era}</Line>
        <Line label="Método">{draft.method ? METHOD_LABEL[draft.method] : '—'}</Line>
        {pregen && <Line label="Pregen">{pregenName ?? '—'}</Line>}
        {pregen && built.sheet && (
          <Line label="Rol">{`${getRoleDisplayName(built.sheet.role as CoreRoleName, draft.era)} ${built.sheet.roleRank}${built.sheet.roleAbilityName ? ` · ${built.sheet.roleAbilityName}` : ''}`}</Line>
        )}
        {!pregen && draft.role && (
          <Line label="Rol">
            {getRoleDisplayName(draft.role, draft.era)} · habilidad Core completa (rango 4)
          </Line>
        )}
      </Panel>

      {((pregen && built.sheet) || (!pregen && derived)) && (
        <Panel title="STATs" className="mb-4">
          {pregen && built.sheet && (
            <Line label="Stats">{(Object.entries(built.sheet.stats) as Array<[string, number]>).map(([k, v]) => `${k} ${v}`).join(' · ')}</Line>
          )}
          {!pregen && derived && <Line label="STATs">{STAT_KEYS.map((k) => `${k} ${draft.stats[k]}`).join(' · ')}</Line>}
        </Panel>
      )}

      {((pregen && built.sheet) || (!pregen && derived)) && (
        <Panel title="Derivados" className="mb-4">
          {pregen && built.sheet && <Line label="Derivados">{`HP ${built.sheet.currentHp} · Humanidad ${built.sheet.currentHumanity}`}</Line>}
          {!pregen && derived && (
            <Line label="Derivados">
              HP {derived.maxHp} · SW {derived.seriouslyWounded} · Death Save {derived.deathSave} · Humanidad {derived.humanity}/{derived.maxHumanity} · EMP efectivo {derived.effectiveEmp}
            </Line>
          )}
        </Panel>
      )}

      {!pregen && derived && (
        <Panel title="Skills" className="mb-4">
          <Line label="Skills">
            {Object.entries(draft.skills)
              .filter(([, v]) => v > 0)
              .map(([n, v]) => `${n} ${v}`)
              .join(', ') || '—'}
            {draft.culturalLanguage.trim() && `, Language (${draft.culturalLanguage.trim()}) 4`}
            <span className="text-[#64748b]"> ({getSkillPointsSpent(draft)} puntos)</span>
          </Line>
        </Panel>
      )}

      {!pregen && lifepath && (
        <Panel title="Lifepath" className="mb-4">
          {lifepathLabels.map(([key, label]) => {
            const v = lifepath[key];
            return typeof v === 'string' && v ? (
              <Line key={key} label={label}>
                {v}
              </Line>
            ) : null;
          })}
          {lifepath.friends.length > 0 && <Line label="Amigos">{lifepath.friends.join(' | ')}</Line>}
          {lifepath.enemies.length > 0 && (
            <Line label="Enemigos">
              {lifepath.enemies.map((e) => [e.who, e.cause, e.throwAtYou, e.reaction].filter(Boolean).join(' · ')).join(' | ')}
            </Line>
          )}
          {lifepath.tragicLoveAffairs.length > 0 && <Line label="Romances">{lifepath.tragicLoveAffairs.join(' | ')}</Line>}
          {Object.entries(lifepath.roleLifepath).map(([k, v]) => (
            <Line key={k} label={k}>
              {v}
            </Line>
          ))}
        </Panel>
      )}

      {!pregen && (
        <Panel title="Ciberware y Humanidad" className="mb-4">
          <Line label="Ciberware">
            {getCyberwareList(draft)
              .map((c) => `${c.name} (HL ${c.humanityLoss})`)
              .join(', ') || '—'}
          </Line>
        </Panel>
      )}

      <Panel title="Equipo" className="mb-4">
          {pregen && built.sheet && <Line label="Armas">{built.sheet.equippedWeapons.map((w) => w.name).join(', ') || '—'}</Line>}
          {!pregen && pkg && (
            <Line label="Paquete de rol">
              {[...pkg.weapons, ...pkg.armor, ...pkg.gear].map((e) => `${e.qty > 1 ? `${e.qty}× ` : ''}${e.name}`).join(', ')}
            </Line>
          )}
          {!pregen && (
            <Line label="Compras">
              {draft.purchases.length === 0
                ? '—'
                : draft.purchases
                    .map((p) => `${p.qty}× ${p.name}${p.location ? ` (${p.location === 'head' ? 'cabeza' : 'cuerpo'})` : ''}`)
                    .join(', ')}
            </Line>
          )}
          {!pregen && draft.fashion.length > 0 && <Line label="Moda">{draft.fashion.map((f) => `${f.qty}× ${f.style} ${f.piece}`).join(', ')}</Line>}
      </Panel>

      <Panel title="Dinero y vivienda" className="mb-4">
        {pregen && built.sheet && <Line label="Dinero">{`${built.sheet.eurodollars} €$`}</Line>}
        {!pregen && <Line label="Dinero final">{eb(left.cash)}</Line>}
        {!pregen && (
          <Line label="Vivienda">
            {draft.role === 'Exec'
              ? `${housing.exec.housing} (${housing.exec.location}), estilo ${housing.exec.lifestyle}`
              : `${housing.default.housing} (${housing.default.location}), estilo ${housing.default.lifestyle}`}
          </Line>
        )}
      </Panel>

      {checklist.length > 0 && (
        <Panel title="Falta completar" className="mb-4">
          <ul className="space-y-1" role="alert">
            {checklist.slice(0, 15).map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                <span className="text-[#fca5a5] flex-1">• {c.message}</span>
                <Btn aria-label={`Ir a ${STEP_LABEL[c.step]}`} onClick={() => onGoTo(c.step)}>
                  Ir a {STEP_LABEL[c.step]}
                </Btn>
              </li>
            ))}
            {checklist.length > 15 && <li className="text-xs text-[#64748b]">… y {checklist.length - 15} más.</li>}
          </ul>
        </Panel>
      )}

      {(built.warnings.length > 0 || summaryWarnings.length > 0) && (
        <Panel title="Avisos" className="mb-4">
          {built.warnings.length > 0 && (
            <ul className="text-xs text-[#f59e0b] space-y-0.5">
              {built.warnings.map((w, i) => (
                <li key={i}>⚠ {w}</li>
              ))}
            </ul>
          )}
          {summaryWarnings.length > 0 && (
            <ul className={`text-xs text-[#f59e0b] space-y-1 break-words ${built.warnings.length > 0 ? 'mt-3 pt-3 border-t border-[#1e2334]' : ''}`}>
              {summaryWarnings.map((w, i) => (
                <li key={i}>
                  ⚠ {w.message}
                  {w.source && (
                    <>
                      {' '}
                      <SourceBadge book={`${w.source.book} p.${w.source.page}`} />
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}
      {built.error && <p className="text-xs text-[#fca5a5] mb-3" role="alert">No se pudo armar la ficha: {built.error}</p>}

      <h3 className="font-tech text-sm font-bold text-[#06b6d4] uppercase tracking-wider mb-2">Revisá y confirmá</h3>
      <Btn tone="red" className="px-6 py-3 text-sm" disabled={checklist.length > 0 || !built.sheet} onClick={() => built.sheet && onCreate(built.sheet)}>
        CREAR PERSONAJE
      </Btn>
    </div>
  );
};
