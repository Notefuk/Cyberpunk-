// Paso 1 del creador: era y método de creación (Core pp. 40-42, 73-78; CEMK RB p.25). [Claude Code · 2026-10-22]
import React from 'react';
import { CEMK_CREATION } from '../../../data/creation';
import { CEMK_FOLIO_METADATA_MAP, CEMK_FOLIO_PREMADE_CHARACTERS } from '../../../data/cemkFolioPremadesData';
import { PREGEN_TEMPLATES } from '../../../data/characterCreationData';
import { createEmptyDraft, getRoleDisplayName, type CreationMethodId, type CreatorDraft } from '../../../engine/characterCreation';
import type { CoreRoleName } from '../../../data/creation';
import type { CharacterEra } from '../../../types/cyberpunk';
import { Btn, Panel, SourceBadge, StepHeader, type StepProps } from './CreatorUi';

interface MethodInfo {
  id: CreationMethodId;
  label: string;
  eras: CharacterEra[];
  page: string;
  text: string;
  badge?: string;
}

const METHODS: MethodInfo[] = [
  {
    id: 'cemk_pregen',
    label: 'Jugar ya con una pregen CEMK',
    eras: ['2077'],
    page: 'CEMK Folios',
    text: 'Uno de los 7 personajes oficiales de los Folios del CEMK, listo para jugar.',
    badge: 'CEMK'
  },
  {
    id: 'easy_pregen',
    label: 'Pregen del Easy Mode',
    eras: ['2045'],
    page: 'Core Easy Mode',
    text: 'Uno de los 5 personajes prearmados del Core, listo para jugar.',
    badge: 'Core RED'
  },
  {
    id: 'streetrat',
    label: 'Streetrat',
    eras: ['2045', '2077'],
    page: 'Core p.73',
    text: 'Tiras 1d10 en la tabla del rol y copias la fila entera de STATs; las skills vienen fijas (p.86). Paquete de equipo del rol + 500 €$.'
  },
  {
    id: 'edgerunner',
    label: 'Edgerunner',
    eras: ['2045', '2077'],
    page: 'Core pp.77 y 88',
    text: 'Tiras 1d10 por cada STAT y repartes 86 puntos en las 20 skills del rol (entre 2 y 6). Paquete de equipo del rol + 500 €$.'
  },
  {
    id: 'complete_package',
    label: 'Complete Package',
    eras: ['2045', '2077'],
    page: 'Core pp.78 y 90',
    text: 'Repartes 62 puntos en STATs (2 a 8) y 86 en skills; 2.550 €$ para equipo y 800 €$ solo para moda.'
  }
];

const isPregen = (m: CreationMethodId | null): boolean => m === 'cemk_pregen' || m === 'easy_pregen';

/** Al cambiar la era o el método se reinician los campos que dependen de ellos. */
function resetMethodDependent(d: CreatorDraft): CreatorDraft {
  const fresh = createEmptyDraft();
  return {
    ...d,
    pregenId: null,
    statRow: null,
    statRolls: {},
    stats: fresh.stats,
    skills: {},
    packageChoices: {},
    runningOutOfCash: fresh.runningOutOfCash,
    purchases: [],
    fashion: [],
    installCyberdeckPort: false
  };
}

export const MethodStep: React.FC<StepProps> = ({ draft, update }) => {
  const setEra = (era: CharacterEra): void => {
    if (era === draft.era) return;
    update((d) => {
      const stillValid = d.method && METHODS.find((m) => m.id === d.method)?.eras.includes(era);
      return { ...resetMethodDependent(d), era, method: stillValid ? d.method : null, installNeuroport: era === '2077' };
    });
  };
  const setMethod = (method: CreationMethodId): void => {
    if (method === draft.method) return;
    update((d) => ({ ...resetMethodDependent(d), method }));
  };
  const setPregen = (pregenId: string): void => update((d) => ({ ...d, pregenId }));

  const neuroport = CEMK_CREATION.neuroport;

  return (
    <div>
      <StepHeader title="Era y método de creación" subtitle="Elegí la era de la campaña y cómo vas a armar el personaje." page="Core pp. 41-42" />

      <Panel title="Era" className="mb-4">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Era">
          {(['2045', '2077'] as CharacterEra[]).map((era) => (
            <Btn
              key={era}
              tone={draft.era === era ? 'red' : 'gray'}
              role="radio"
              aria-checked={draft.era === era}
              onClick={() => setEra(era)}
            >
              {era === '2045' ? '2045 · Core RED' : '2077 · CEMK (Edgerunners)'}
            </Btn>
          ))}
        </div>
        {draft.era === '2077' && (
          <div className="mt-3 text-xs text-[#94a3b8] space-y-2">
            <p>
              <span className="text-[#06b6d4] font-bold">Neuroport gratis (CEMK RB p.25):</span> {neuroport.freeAtCreationEs}
            </p>
            <p className="font-mono-code text-[#64748b]">Incluye {neuroport.pieces.length} piezas (CEMK RB pp. 35-36):</p>
            <ul className="grid sm:grid-cols-2 gap-1.5">
              {neuroport.pieces.map((p) => (
                <li key={p.name} className="bg-[#0a0b0e] border border-[#1e2334] rounded-xs p-2">
                  <span className="text-white font-bold">{p.name}</span>
                  <p className="text-[11px] text-[#94a3b8]">{p.descEs}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>

      <Panel title="Método" className="mb-4">
        <div className="grid sm:grid-cols-2 gap-2">
          {METHODS.map((m) => {
            const available = m.eras.includes(draft.era);
            const selected = draft.method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                disabled={!available}
                aria-pressed={selected}
                onClick={() => setMethod(m.id)}
                className={`text-left p-3 border rounded-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  selected ? 'bg-[#dc2626]/15 border-[#dc2626]' : 'bg-[#151926] border-[#1e2334] hover:border-[#3b4259]'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-tech font-bold text-white uppercase">{m.label}</span>
                  {m.badge && <SourceBadge book={m.badge} />}
                  <span className="text-[10px] font-mono-code text-[#64748b]">{m.page}</span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-1">{m.text}</p>
                {!available && <p className="text-[10px] font-mono-code text-[#f59e0b] mt-1">Solo en {m.eras.join(' / ')}.</p>}
              </button>
            );
          })}
        </div>
      </Panel>

      {draft.method === 'cemk_pregen' && (
        <Panel title="Los 7 Folios del CEMK">
          <p className="text-xs text-[#f59e0b] mb-2">Ficha de CEMK: no sigue los límites del Core; las skills que no trae quedan en 0.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {CEMK_FOLIO_PREMADE_CHARACTERS.map((c) => {
              const meta = CEMK_FOLIO_METADATA_MAP[c.id];
              const role = (meta?.role ?? c.role) as CoreRoleName;
              const selected = draft.pregenId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPregen(c.id)}
                  className={`text-left p-3 border rounded-xs cursor-pointer transition-colors ${
                    selected ? 'bg-[#06b6d4]/15 border-[#06b6d4]' : 'bg-[#151926] border-[#1e2334] hover:border-[#3b4259]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-tech font-bold text-white uppercase">{meta?.name ?? c.handle}</span>
                    <SourceBadge book="CEMK" />
                  </div>
                  <p className="text-[11px] font-mono-code text-[#06b6d4]">{getRoleDisplayName(role, '2077')}</p>
                  {meta && <p className="text-xs text-[#94a3b8] mt-1">{meta.archetype2077}</p>}
                </button>
              );
            })}
          </div>
        </Panel>
      )}

      {draft.method === 'easy_pregen' && (
        <Panel title="Pregens del Easy Mode">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PREGEN_TEMPLATES.map((p) => {
              const selected = draft.pregenId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPregen(p.id)}
                  className={`text-left p-3 border rounded-xs cursor-pointer transition-colors ${
                    selected ? 'bg-[#10b981]/15 border-[#10b981]' : 'bg-[#151926] border-[#1e2334] hover:border-[#3b4259]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-tech font-bold text-white uppercase">{p.handle}</span>
                    <SourceBadge book="Core RED" />
                  </div>
                  <p className="text-[11px] font-mono-code text-[#10b981]">{p.role}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">{p.bioSummary}</p>
                </button>
              );
            })}
          </div>
        </Panel>
      )}

      {isPregen(draft.method) && (
        <p className="text-[11px] font-mono-code text-[#64748b] mt-3">Con una pregen el creador salta directo al resumen.</p>
      )}
    </div>
  );
};
