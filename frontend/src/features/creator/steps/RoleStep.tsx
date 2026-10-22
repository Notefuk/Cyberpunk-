// Paso 2 del creador: rol y habilidad de rol (Core pp. 40-41; CEMK RB pp. 13-25). [Claude Code · 2026-10-22]
import React from 'react';
import { CORE_ROLES } from '../../../data/creation';
import type { CoreRoleName } from '../../../data/creation';
import {
  CEMK_ROLES,
  createEmptyDraft,
  getRoleAbilityInfo,
  getRoleDisplayName,
  getRoleOrder,
  roleSupportsCemkVariant,
  type RoleAbilityInfo
} from '../../../engine/characterCreation';
import { Panel, SourceBadge, NoviceGuide, StepHeader, type StepProps } from './CreatorUi';

const AbilityCard: React.FC<{ title: string; info: RoleAbilityInfo; selected: boolean; onPick?: () => void }> = ({ title, info, selected, onPick }) => (
  <div className={`p-3 border rounded-xs ${selected ? 'border-[#dc2626] bg-[#dc2626]/10' : 'border-[#1e2334] bg-[#0a0b0e]'}`}>
    <div className="flex flex-wrap items-center gap-2 mb-1">
      <span className="font-tech font-bold text-white uppercase">{title}</span>
      <span className="text-[10px] font-mono-code text-[#64748b]">
        {info.source.book} p.{info.source.page ?? '?'}
      </span>
      {info.nameFromCore && <span className="text-[10px] font-mono-code text-[#f59e0b] border border-[#f59e0b]/40 px-1 rounded">nombre del Core</span>}
    </div>
    <p className="text-[11px] font-mono-code text-[#06b6d4] mb-1">{info.name}</p>
    <p className="text-xs text-[#94a3b8] whitespace-pre-line">{info.textEs}</p>
    {onPick && (
      <button
        type="button"
        onClick={onPick}
        aria-pressed={selected}
        className="mt-2 px-2 py-1 text-[11px] font-mono-code font-bold uppercase border rounded-xs cursor-pointer border-[#2a3148] text-[#cbd5e1] hover:text-white"
      >
        {selected ? 'Elegida' : 'Elegir esta'}
      </button>
    )}
  </div>
);

export const RoleStep: React.FC<StepProps> = ({ draft, update }) => {
  const pickRole = (role: CoreRoleName): void => {
    if (draft.role === role) return;
    update((d) => {
      const fresh = createEmptyDraft();
      const roleDependentStats = d.method === 'streetrat' || d.method === 'edgerunner';
      return {
        ...d,
        role,
        roleAbilityVariant: roleSupportsCemkVariant(role) ? d.roleAbilityVariant : 'core',
        roleLifepath: {},
        packageChoices: {},
        ...(roleDependentStats ? { statRow: null, statRolls: {}, stats: fresh.stats, skills: {} } : {})
      };
    });
  };

  const role = draft.role;
  const roleInfo = role ? CORE_ROLES.roles.find((r) => r.role === role) : undefined;
  const coreInfo = role ? getRoleAbilityInfo(role, 'core', draft.era) : null;

  return (
    <div>
      <StepHeader title="Rol y habilidad de rol" subtitle="Tu rol define tu habilidad especial; empieza en rango 4." page="Core pp. 40-41 · CEMK RB p.25" />
      <NoviceGuide step="role" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
        {getRoleOrder().map((r) => {
          const selected = draft.role === r;
          const isCemk = CEMK_ROLES.includes(r);
          return (
            <button
              key={r}
              type="button"
              aria-pressed={selected}
              onClick={() => pickRole(r)}
              className={`p-3 border rounded-xs text-left cursor-pointer transition-colors ${
                selected ? 'bg-[#dc2626]/15 border-[#dc2626]' : 'bg-[#151926] border-[#1e2334] hover:border-[#3b4259]'
              }`}
            >
              <div className="font-tech font-bold text-white uppercase">{getRoleDisplayName(r, draft.era)}</div>
              <div className="mt-1">
                <SourceBadge book={isCemk ? 'CEMK · Core RED' : 'Core RED'} tone={isCemk ? 'cemk' : 'core'} />
              </div>
            </button>
          );
        })}
      </div>

      {role && roleInfo && coreInfo && (
        <div className="space-y-3">
          <Panel title={`${getRoleDisplayName(role, draft.era)} · ${coreInfo.name}`}>
            <p className="text-xs text-[#94a3b8]">{roleInfo.descEs}</p>
            <p className="text-[10px] font-mono-code text-[#64748b] mt-1">
              {roleInfo.source.book} p.{roleInfo.source.page ?? '?'}
            </p>
            {role === 'Medtech' && (
              <p className="text-xs text-[#f59e0b] mt-2">Surgery es exclusiva del Medtech y sale de su habilidad de rol (CEMK RB pp. 13-14; Core p.149).</p>
            )}
          </Panel>

          <Panel title="Versión de la habilidad de rol">
            <p className="text-xs text-[#94a3b8] mb-2">Todos los personajes usan la habilidad de rol completa del Core RED, rango 4 (decisión del plan 8).</p>
            {coreInfo && <AbilityCard title="Core completa (rango 4)" info={coreInfo} selected />}
          </Panel>
        </div>
      )}
    </div>
  );
};
