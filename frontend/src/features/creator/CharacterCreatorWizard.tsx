// Orquestador del creador de personajes (plan 7, v4.8.3). Reglas: Core pp. 40-119 y CEMK RB p.25; todo el cálculo vive en engine/characterCreation.ts. [Claude Code · 2026-10-22]
import React, { useCallback, useEffect, useState } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useCreatorNoviceStore } from '../../store/creatorNoviceStore';
import {
  SKILL_POINTS,
  computeDerived,
  createEmptyDraft,
  getMoneyRemaining,
  getRoleDisplayName,
  getSkillPointsSpent,
  getStartingMoney,
  validateStep,
  type CreatorDraft,
  type CreatorStepId
} from '../../engine/characterCreation';
import type { CharacterSheet } from '../../types/cyberpunk';
import { clearCreatorDraft, loadCreatorDraft, saveCreatorDraft } from './creatorDraftStorage';
import { Btn, ErrorList, Panel, eb } from './steps/CreatorUi';
import { MethodStep } from './steps/MethodStep';
import { RoleStep } from './steps/RoleStep';
import { LifepathStep } from './steps/LifepathStep';
import { StatsStep } from './steps/StatsStep';
import { SkillsStep } from './steps/SkillsStep';
import { GearStep } from './steps/GearStep';
import { SummaryStep } from './steps/SummaryStep';

interface CharacterCreatorWizardProps {
  onClose?: () => void;
  onComplete?: () => void;
}

// Orden del libro (Core pp. 41-42). El índice se guarda en draft.step.
const STEP_IDS: CreatorStepId[] = ['method', 'role', 'lifepath', 'stats', 'skills', 'gear', 'summary'];
const STEP_LABELS: Record<CreatorStepId, string> = {
  method: 'ERA Y MÉTODO',
  role: 'ROL',
  lifepath: 'LIFEPATH',
  stats: 'STATS',
  skills: 'SKILLS',
  gear: 'EQUIPO',
  summary: 'RESUMEN'
};

const isPregenMethod = (d: CreatorDraft): boolean => d.method === 'cemk_pregen' || d.method === 'easy_pregen';

export const CharacterCreatorWizard: React.FC<CharacterCreatorWizardProps> = ({ onClose, onComplete }) => {
  const createCharacterFromWizard = useCharacterStore((state) => state.createCharacterFromWizard);

  const novice = useCreatorNoviceStore((s) => s.novice);
  const toggleNovice = useCreatorNoviceStore((s) => s.toggle);

  const [boot] = useState(() => {
    const saved = loadCreatorDraft();
    return { draft: saved ?? createEmptyDraft(), resumed: !!saved && (saved.step > 0 || saved.method !== null) };
  });
  const [draft, setDraft] = useState<CreatorDraft>(boot.draft);
  const [resumed, setResumed] = useState<boolean>(boot.resumed);

  // Autoguardado del borrador en cada cambio.
  useEffect(() => {
    saveCreatorDraft(draft);
  }, [draft]);

  const update = useCallback((fn: (d: CreatorDraft) => CreatorDraft): void => setDraft((d) => fn(d)), []);

  const activeSteps: CreatorStepId[] = isPregenMethod(draft) ? ['method', 'summary'] : STEP_IDS;
  const rawStep = STEP_IDS[draft.step] ?? 'method';
  const stepId: CreatorStepId = activeSteps.includes(rawStep) ? rawStep : 'method';
  const activeIdx = activeSteps.indexOf(stepId);

  const errorsOf = (id: CreatorStepId): string[] => validateStep(draft, id);
  const currentErrors = errorsOf(stepId);

  const goTo = (id: CreatorStepId): void => update((d) => ({ ...d, step: STEP_IDS.indexOf(id) }));
  // Se puede volver siempre; saltar adelante solo si todos los pasos previos ya son válidos.
  const canGoTo = (id: CreatorStepId): boolean => {
    const idx = activeSteps.indexOf(id);
    if (idx <= activeIdx) return true;
    return activeSteps.slice(0, idx).every((s) => validateStep(draft, s).length === 0);
  };

  const next = (): void => {
    if (currentErrors.length > 0) return;
    const target = activeSteps[activeIdx + 1];
    if (target) goTo(target);
  };
  const prev = (): void => {
    const target = activeSteps[activeIdx - 1];
    if (target) goTo(target);
  };

  const discard = (): void => {
    clearCreatorDraft();
    setDraft(createEmptyDraft());
    setResumed(false);
  };

  const handleCreate = (sheet: CharacterSheet): void => {
    createCharacterFromWizard(sheet);
    clearCreatorDraft();
    setDraft(createEmptyDraft());
    onComplete?.();
  };

  // Panel lateral
  const pregen = isPregenMethod(draft);
  const derived = !pregen && draft.method ? computeDerived(draft) : null;
  const money = getMoneyRemaining(draft);
  const startMoney = getStartingMoney(draft);
  const showMoney = !pregen && !!draft.method;
  const showSkillPoints = draft.method === 'edgerunner' || draft.method === 'complete_package';

  const stepProps = { draft, update };

  return (
    <div className="chamfer-card bg-[#0d0e14] border border-[#22283a] p-4 sm:p-6 text-[#cbd5e1] font-sans selection:bg-[#dc2626] selection:text-white max-w-6xl mx-auto shadow-2xl relative my-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2538] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#dc2626]/20 border border-[#dc2626] rounded-xs text-[#dc2626]">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-tech text-lg sm:text-xl font-black text-white tracking-wider uppercase">CREAR PJ // WIZARD</h1>
              <span className="text-[10px] font-mono-code bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/40 px-2 py-0.5 rounded font-bold uppercase">
                {draft.era === '2077' ? 'CEMK 2077' : 'CORE 2045'}
              </span>
            </div>
            <p className="text-xs font-mono-code text-[#64748b]">Protocolo de creación: Cyberpunk RED Core pp. 40-119 y Edgerunners Mission Kit</p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs font-mono-code text-[#cbd5e1] cursor-pointer">
          <input type="checkbox" checked={novice} onChange={toggleNovice} className="cursor-pointer" />
          Modo Novato
        </label>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Cerrar creador" className="p-1.5 text-[#64748b] hover:text-white rounded hover:bg-[#1f2538] cursor-pointer">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {resumed && (
        <div className="mb-4 flex flex-wrap items-center gap-3 bg-[#06b6d4]/10 border border-[#06b6d4]/40 rounded-xs p-3" role="status">
          <span className="text-xs text-[#06b6d4] font-mono-code">Retomaste un borrador.</span>
          <Btn tone="red" onClick={discard}>
            Descartar borrador
          </Btn>
          <Btn onClick={() => setResumed(false)}>Seguir con el borrador</Btn>
        </div>
      )}

      <nav aria-label="Pasos del creador" className={`grid gap-2 mb-6 ${activeSteps.length > 2 ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-7' : 'grid-cols-2'}`}>
        {activeSteps.map((id, i) => {
          const isActive = id === stepId;
          const done = id !== 'summary' && validateStep(draft, id).length === 0 && (id === 'method' || draft.method !== null);
          const reachable = canGoTo(id);
          return (
            <button
              key={id}
              type="button"
              disabled={!reachable}
              aria-current={isActive ? 'step' : undefined}
              onClick={() => goTo(id)}
              className={`p-2 rounded-xs border text-left transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive
                  ? 'bg-[#dc2626]/15 border-[#dc2626] text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                  : done
                  ? 'bg-[#151926] border-[#10b981]/50 text-[#10b981]'
                  : 'bg-[#10121a] border-[#1e2334] text-[#64748b] hover:text-white'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-tech text-xs font-black shrink-0 ${
                  isActive ? 'bg-[#dc2626] text-white' : done ? 'bg-[#10b981] text-black' : 'bg-[#1e2334] text-[#64748b]'
                }`}
              >
                {done && !isActive ? <Check className="w-3.5 h-3.5" aria-label="Paso completo" /> : i + 1}
              </span>
              <span className="font-tech text-[11px] font-bold uppercase tracking-wide">{STEP_LABELS[id]}</span>
            </button>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-5">
        <main>
          {stepId === 'method' && <MethodStep {...stepProps} />}
          {stepId === 'role' && <RoleStep {...stepProps} />}
          {stepId === 'lifepath' && <LifepathStep {...stepProps} />}
          {stepId === 'stats' && <StatsStep {...stepProps} />}
          {stepId === 'skills' && <SkillsStep {...stepProps} />}
          {stepId === 'gear' && <GearStep {...stepProps} />}
          {stepId === 'summary' && <SummaryStep {...stepProps} onGoTo={goTo} onCreate={handleCreate} />}

          {stepId !== 'summary' && currentErrors.length > 0 && (
            <div className="mt-4 border border-[#dc2626]/40 bg-[#dc2626]/10 rounded-xs p-3">
              <p className="text-[11px] font-mono-code text-[#fca5a5] uppercase mb-1">Para seguir falta:</p>
              <ErrorList errors={currentErrors} />
            </div>
          )}

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#1f2538]">
            <Btn onClick={prev} disabled={activeIdx <= 0}>
              Anterior
            </Btn>
            {stepId !== 'summary' && (
              <Btn tone="green" onClick={next} disabled={currentErrors.length > 0}>
                Siguiente
              </Btn>
            )}
          </div>
        </main>

        <aside aria-label="Resumen del personaje" className="lg:sticky lg:top-2 self-start space-y-3">
          <Panel title="Personaje">
            <div className="text-sm text-white font-tech font-bold uppercase">
              {draft.role && !pregen ? getRoleDisplayName(draft.role, draft.era) : pregen ? 'Pregen' : 'Sin rol'}
            </div>
            {derived && (
              <dl className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-xs font-mono-code">
                <dt className="text-[#64748b]">HP</dt>
                <dd className="text-white text-right">{derived.maxHp}</dd>
                <dt className="text-[#64748b]">Seriously W.</dt>
                <dd className="text-white text-right">{derived.seriouslyWounded}</dd>
                <dt className="text-[#64748b]">Death Save</dt>
                <dd className="text-white text-right">{derived.deathSave}</dd>
                <dt className="text-[#64748b]">Humanidad</dt>
                <dd className="text-white text-right">
                  {derived.humanity}/{derived.maxHumanity}
                </dd>
                <dt className="text-[#64748b]">EMP efectivo</dt>
                <dd className="text-white text-right">{derived.effectiveEmp}</dd>
              </dl>
            )}
            {pregen && <p className="text-[11px] text-[#94a3b8] mt-1">Ficha prearmada: el resumen muestra el detalle.</p>}
          </Panel>
          {showMoney && (
            <Panel title="Dinero">
              <div className={`font-tech text-xl font-black ${money.cash < 0 ? 'text-[#dc2626]' : 'text-[#10b981]'}`}>{eb(money.cash)}</div>
              <div className="text-[10px] font-mono-code text-[#64748b]">de {eb(startMoney.cash)}</div>
              {startMoney.fashionBudget > 0 && (
                <div className="text-[11px] font-mono-code text-[#06b6d4] mt-1">Moda: {eb(money.fashionBudget)}</div>
              )}
            </Panel>
          )}
          {showSkillPoints && (
            <Panel title="Skill points">
              <div className="font-tech text-xl font-black text-white">{SKILL_POINTS - getSkillPointsSpent(draft)}</div>
              <div className="text-[10px] font-mono-code text-[#64748b]">restantes de {SKILL_POINTS}</div>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
};
