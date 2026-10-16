import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { 
  calculateMaxHp, 
  calculateSeriouslyWoundedThreshold, 
  calculateMaxHumanity 
} from '../../engine/characterEngine';
import type { 
  CombatSkillKey, 
  StatKey 
} from '../../types/cyberpunk';
import { SKILL_METADATA } from '../../types/cyberpunk';
import { 
  User, 
  Plus, 
  Minus, 
  Download, 
  Upload, 
  Copy, 
  Trash2, 
  Sparkles, 
  Heart, 
  Activity, 
  Coins, 
  FolderPlus,
  Skull
} from 'lucide-react';

const STAT_LABELS: Record<StatKey, { name: string; desc: string }> = {
  INT: { name: 'Inteligencia', desc: 'Agudeza mental y capacidad analítica.' },
  REF: { name: 'Reflejos', desc: 'Coordinación ojo-mano, puntería y pilotaje.' },
  DEX: { name: 'Destreza', desc: 'Agilidad física, combate cuerpo a cuerpo y esquiva.' },
  TECH: { name: 'Técnica', desc: 'Aptitud para reparar ciberware, armas y medicina.' },
  COOL: { name: 'Sangre Fría', desc: 'Presencia, coraje bajo fuego y persuasión.' },
  WILL: { name: 'Voluntad', desc: 'Determinación mental y resistencia a traumas.' },
  LUCK: { name: 'Suerte', desc: 'Pool de puntos para modificar tiradas críticas.' },
  MOVE: { name: 'Movimiento', desc: 'Velocidad de carrera (m/turno) y salto.' },
  BODY: { name: 'Constitución', desc: 'Fuerza bruta, masa muscular y salvaciones de muerte.' },
  EMP: { name: 'Empatía', desc: 'Conexión humana y resistencia a la ciberpsicosis.' }
};

const ROLES = [
  'Solo',
  'Netrunner',
  'Tech',
  'Medtech',
  'Media',
  'Exec',
  'Lawman',
  'Fixer',
  'Nomad',
  'Rockerboy'
];

export const StreetLabView: React.FC = () => {
  const characters = useCharacterStore((state) => state.characters);
  const activeCharacterId = useCharacterStore((state) => state.activeCharacterId);
  const setActiveCharacter = useCharacterStore((state) => state.setActiveCharacter);
  const getActiveCharacter = useCharacterStore((state) => state.getActiveCharacter);
  const createNewCharacter = useCharacterStore((state) => state.createNewCharacter);
  const deleteCharacter = useCharacterStore((state) => state.deleteCharacter);
  const updateCharacterMeta = useCharacterStore((state) => state.updateCharacterMeta);
  const updateStat = useCharacterStore((state) => state.updateStat);
  const updateSkill = useCharacterStore((state) => state.updateSkill);
  const unequipWeapon = useCharacterStore((state) => state.unequipWeapon);
  const exportActiveCharacterJson = useCharacterStore((state) => state.exportActiveCharacterJson);
  const importCharacterJson = useCharacterStore((state) => state.importCharacterJson);

  const activeChar = getActiveCharacter();

  // Local state for modals / inputs
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newHandle, setNewHandle] = useState('');
  const [newRole, setNewRole] = useState('Solo');

  const [isImporting, setIsImporting] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Derived stats
  const bodyVal = activeChar?.stats?.BODY ?? 6;
  const willVal = activeChar?.stats?.WILL ?? 6;
  const empVal = activeChar?.stats?.EMP ?? 6;
  const maxHp = calculateMaxHp(bodyVal, willVal);
  const seriousWoundThresh = calculateSeriouslyWoundedThreshold(maxHp);
  const maxHumanity = calculateMaxHumanity(empVal);

  // Death save bonus penalty from injuries
  let deathSavePenalty = 0;
  activeChar?.activeInjuries?.forEach((inj) => {
    if (!inj.isTreated && inj.modifiers?.bonusDeathSavePenalty) {
      deathSavePenalty += inj.modifiers.bonusDeathSavePenalty;
    }
  });

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCopyJson = () => {
    const jsonStr = exportActiveCharacterJson();
    navigator.clipboard.writeText(jsonStr);
    showStatus('¡Ficha copiada al portapapeles!');
  };

  const handleDownloadJson = () => {
    const jsonStr = exportActiveCharacterJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeChar.handle.toLowerCase().replace(/\s+/g, '_')}_sheet.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('¡Ficha descargada con éxito!');
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = importCharacterJson(importJsonText);
    if (ok) {
      setIsImporting(false);
      setImportJsonText('');
      showStatus('¡Ficha importada correctamente!');
    } else {
      alert('Error: El formato JSON no es válido o carece de campos obligatorios.');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle.trim()) return;
    createNewCharacter(newHandle, newRole);
    setNewHandle('');
    setIsCreatingNew(false);
    showStatus(`¡Personaje ${newHandle} creado!`);
  };

  // Group skills by category
  const categories: Array<{ id: 'ranged' | 'melee' | 'defense' | 'medical' | 'general'; label: string }> = [
    { id: 'ranged', label: 'Armamento a Distancia' },
    { id: 'melee', label: 'Combate Cuerpo a Cuerpo' },
    { id: 'defense', label: 'Defensa y Atletismo' },
    { id: 'medical', label: 'Medicina y Cibertecnología' },
    { id: 'general', label: 'Percepción y Concentración' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* =========================================================
          1. BARRA SUPERIOR DE GESTIÓN DE PERSONAJES
      ========================================================= */}
      <div className="chamfer-card p-4 bg-[#121319] border border-[#232736] flex flex-wrap items-center justify-between gap-4">
        
        {/* Selector y Acciones Básicas */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#dc2626]" />
            <span className="font-tech text-base font-bold text-white tracking-wider uppercase">
              GESTIÓN DE EDGERUNNERS:
            </span>
          </div>

          <select
            value={activeCharacterId}
            onChange={(e) => setActiveCharacter(e.target.value)}
            className="bg-[#171924] border border-[#2c3246] text-white font-tech font-bold text-sm rounded px-3 py-1.5 focus:outline-none focus:border-[#dc2626] cursor-pointer"
          >
            {characters.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#121318]">
                {c.handle} — {c.role} (Rank {c.roleRank})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="px-3 py-1.5 bg-[#202434] hover:bg-[#dc2626] text-white font-tech font-bold text-xs tracking-wider rounded-xs border border-[#2d344a] flex items-center gap-1.5 transition-all active:scale-95"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>NUEVO PERSONAJE</span>
          </button>

          {characters.length > 1 && (
            <button
              onClick={() => {
                if (confirm(`¿Eliminar la ficha de ${activeChar.handle}?`)) {
                  deleteCharacter(activeChar.id);
                  showStatus('Personaje eliminado.');
                }
              }}
              className="p-1.5 bg-[#22181d] hover:bg-[#dc2626] text-[#dc2626] hover:text-white rounded-xs border border-[#3b1c24] transition-colors"
              title="Eliminar este personaje"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Export / Import Buttons */}
        <div className="flex items-center gap-2">
          {statusMessage && (
            <span className="text-xs font-mono-code text-[#10b981] mr-2 animate-pulse">
              {statusMessage}
            </span>
          )}

          <button
            onClick={handleCopyJson}
            className="px-2.5 py-1.5 bg-[#171924] hover:bg-[#202534] text-[#cbd5e1] font-mono-code text-xs rounded-xs border border-[#2a3044] flex items-center gap-1.5 transition-all"
            title="Copiar JSON al portapapeles"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar JSON</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-2.5 py-1.5 bg-[#171924] hover:bg-[#202534] text-[#cbd5e1] font-mono-code text-xs rounded-xs border border-[#2a3044] flex items-center gap-1.5 transition-all"
            title="Descargar archivo .json"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>

          <button
            onClick={() => setIsImporting(!isImporting)}
            className="px-2.5 py-1.5 bg-[#171924] hover:bg-[#38bdf8] hover:text-black text-[#38bdf8] font-mono-code text-xs rounded-xs border border-[#2a3044] flex items-center gap-1.5 transition-all"
            title="Importar ficha desde JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar</span>
          </button>
        </div>

      </div>

      {/* Formulario Crear Nuevo Personaje */}
      {isCreatingNew && (
        <form onSubmit={handleCreateSubmit} className="chamfer-card p-4 bg-[#141622] border border-[#dc2626]/40 flex flex-wrap items-center gap-4">
          <div className="font-tech text-sm font-bold text-white uppercase">CREAR NUEVO EDGERUNNER:</div>
          <input
            type="text"
            placeholder="Handle (Nombre callejero)..."
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
            className="bg-[#0e1017] border border-[#282f42] text-white text-xs px-3 py-1.5 rounded focus:outline-none focus:border-[#dc2626] font-tech font-bold"
            required
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="bg-[#0e1017] border border-[#282f42] text-white text-xs px-3 py-1.5 rounded font-tech font-bold"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-xs tracking-wider rounded-xs chamfer-btn"
          >
            CREAR FICHA
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingNew(false)}
            className="text-xs font-mono-code text-[#64748b] hover:text-white"
          >
            Cancelar
          </button>
        </form>
      )}

      {/* Modal/Panel de Importación de JSON */}
      {isImporting && (
        <div className="chamfer-card p-4 bg-[#141622] border border-[#38bdf8]/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-tech text-sm font-bold text-[#38bdf8] uppercase">
              PEGAR ARCHIVO O TEXTO JSON DE LA FICHA:
            </span>
            <button
              onClick={() => setIsImporting(false)}
              className="text-xs text-[#64748b] hover:text-white font-mono-code"
            >
              Cerrar
            </button>
          </div>
          <textarea
            rows={5}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="Pega aquí el JSON completo de una CharacterSheet..."
            className="w-full bg-[#0d0e14] border border-[#242b3c] text-[#cbd5e1] font-mono-code text-xs p-2.5 rounded focus:outline-none focus:border-[#38bdf8]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleImportSubmit}
              className="px-4 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-tech font-bold text-xs tracking-wider rounded-xs chamfer-btn"
            >
              IMPORTAR FICHA
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          2. METADATOS: HANDLE, ROL, RANGO, EURODÓLARES Y NOTAS
      ========================================================= */}
      <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
        <div className="font-tech text-sm font-bold tracking-wider text-white uppercase pb-2 mb-4 border-b border-[#1f2230]">
          DATOS PRINCIPALES DEL EDGERUNNER
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Handle */}
          <div>
            <label className="text-[10px] font-mono-code text-[#64748b] block uppercase mb-1">
              HANDLE (ALIAS)
            </label>
            <input
              type="text"
              value={activeChar?.handle ?? ''}
              onChange={(e) => updateCharacterMeta({ handle: e.target.value })}
              className="w-full bg-[#171923] border border-[#262c3e] text-white font-tech font-bold text-sm px-3 py-1.5 rounded focus:outline-none focus:border-[#dc2626]"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="text-[10px] font-mono-code text-[#64748b] block uppercase mb-1">
              ROL
            </label>
            <select
              value={activeChar?.role ?? 'Solo'}
              onChange={(e) => updateCharacterMeta({ role: e.target.value })}
              className="w-full bg-[#171923] border border-[#262c3e] text-white font-tech font-bold text-sm px-3 py-1.5 rounded focus:outline-none focus:border-[#dc2626]"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Rango de Rol */}
          <div>
            <label className="text-[10px] font-mono-code text-[#64748b] block uppercase mb-1">
              RANGO DE ROL (1-10)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={activeChar?.roleRank ?? 4}
                onChange={(e) => updateCharacterMeta({ roleRank: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)) })}
                className="w-full bg-[#171923] border border-[#262c3e] text-white font-mono-code font-bold text-sm px-3 py-1.5 rounded focus:outline-none focus:border-[#dc2626]"
              />
            </div>
          </div>

          {/* Eurodólares */}
          <div>
            <label className="text-[10px] font-mono-code text-[#64748b] block uppercase mb-1 flex items-center gap-1">
              <Coins className="w-3 h-3 text-[#10b981]" /> FONDOS DISPONIBLES (€$)
            </label>
            <input
              type="number"
              min="0"
              value={activeChar?.eurodollars ?? 0}
              onChange={(e) => updateCharacterMeta({ eurodollars: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full bg-[#171923] border border-[#262c3e] text-[#10b981] font-mono-code font-bold text-sm px-3 py-1.5 rounded focus:outline-none focus:border-[#10b981]"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono-code text-[#64748b] block uppercase mb-1">
            NOTAS Y ANTECEDENTES
          </label>
          <textarea
            rows={2}
            value={activeChar?.notes ?? ''}
            onChange={(e) => updateCharacterMeta({ notes: e.target.value })}
            placeholder="Anotaciones de campaña, contactos del fixer, deudas..."
            className="w-full bg-[#171923] border border-[#262c3e] text-[#cbd5e1] text-xs font-mono-code p-2.5 rounded focus:outline-none focus:border-[#dc2626]"
          />
        </div>
      </div>

      {/* =========================================================
          3. GRID DE LOS 10 STATS & TARJETAS DERIVADAS
      ========================================================= */}
      <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
        <div className="font-tech text-sm font-bold tracking-wider text-white uppercase pb-2 mb-4 border-b border-[#1f2230]">
          ESTADÍSTICAS BÁSICAS (10 STATS OFICIALES)
        </div>

        {/* Grid de 10 Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {(Object.keys(STAT_LABELS) as StatKey[]).map((stat) => {
            const val = activeChar?.stats?.[stat] ?? 6;
            const meta = STAT_LABELS[stat];

            return (
              <div
                key={stat}
                className="bg-[#171923] p-3 rounded border border-[#232736] hover:border-[#384058] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-tech text-lg font-bold text-white">{stat}</span>
                    <span className="font-tech text-2xl font-bold text-[#dc2626]">{val}</span>
                  </div>
                  <div className="text-[10px] font-tech text-[#94a3b8] uppercase font-bold">{meta.name}</div>
                  <p className="text-[9px] text-[#64748b] font-mono-code mt-1 line-clamp-2 leading-tight">
                    {meta.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-[#1f2334]">
                  <button
                    onClick={() => updateStat(stat, val - 1)}
                    className="flex-1 py-1 bg-[#222534] hover:bg-[#dc2626] hover:text-white text-[#cbd5e1] rounded font-bold text-xs flex items-center justify-center transition-all"
                    title={`Reducir ${stat}`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => updateStat(stat, val + 1)}
                    className="flex-1 py-1 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#cbd5e1] rounded font-bold text-xs flex items-center justify-center transition-all"
                    title={`Aumentar ${stat}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tarjetas de Estadísticas Derivadas Automáticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Max HP */}
          <div className="bg-[#191b26] p-3.5 rounded border border-[#272e42]">
            <div className="flex items-center gap-1.5 text-xs font-mono-code text-[#64748b] mb-1">
              <Heart className="w-3.5 h-3.5 text-[#dc2626]" /> MAX HP
            </div>
            <div className="font-tech text-2xl font-bold text-white">{maxHp}</div>
            <div className="text-[10px] font-mono-code text-[#94a3b8] mt-0.5">
              Fórmula: 10 + 5 × ⌈({bodyVal} + {willVal})/2⌉
            </div>
          </div>

          {/* Seriously Wounded */}
          <div className="bg-[#191b26] p-3.5 rounded border border-[#272e42]">
            <div className="flex items-center gap-1.5 text-xs font-mono-code text-[#64748b] mb-1">
              <Activity className="w-3.5 h-3.5 text-[#f59e0b]" /> HERIDA GRAVE (50%)
            </div>
            <div className="font-tech text-2xl font-bold text-[#f59e0b]">&lt; {seriousWoundThresh} HP</div>
            <div className="text-[10px] font-mono-code text-[#94a3b8] mt-0.5">
              Penalizador -2 a todas las acciones
            </div>
          </div>

          {/* Death Save */}
          <div className="bg-[#191b26] p-3.5 rounded border border-[#272e42]">
            <div className="flex items-center gap-1.5 text-xs font-mono-code text-[#64748b] mb-1">
              <Skull className="w-3.5 h-3.5 text-[#dc2626]" /> SALVACIÓN DE MUERTE
            </div>
            <div className="font-tech text-2xl font-bold text-white">
              BASE {bodyVal}
              {deathSavePenalty > 0 && <span className="text-[#dc2626] text-base ml-1">+{deathSavePenalty} Pen</span>}
            </div>
            <div className="text-[10px] font-mono-code text-[#94a3b8] mt-0.5">
              1d10 contra BODY acumulativo
            </div>
          </div>

          {/* Humanity */}
          <div className="bg-[#191b26] p-3.5 rounded border border-[#272e42]">
            <div className="flex items-center gap-1.5 text-xs font-mono-code text-[#64748b] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" /> MÁXIMA HUMANIDAD
            </div>
            <div className="font-tech text-2xl font-bold text-[#c084fc]">{maxHumanity}</div>
            <div className="text-[10px] font-mono-code text-[#94a3b8] mt-0.5">
              EMP ({empVal}) × 10 • Actual: {activeChar?.currentHumanity ?? maxHumanity}
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================
          4. MATRIZ DE LAS 16 HABILIDADES DE COMBATE (SKILL_METADATA)
      ========================================================= */}
      <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
        <div className="font-tech text-sm font-bold tracking-wider text-white uppercase pb-2 mb-4 border-b border-[#1f2230]">
          HABILIDADES CLAVE DE COMBATE Y TÉCNICA (16 HABILIDADES)
        </div>

        <div className="space-y-5">
          {categories.map((cat) => {
            const skillsInCat = (Object.keys(SKILL_METADATA) as CombatSkillKey[]).filter(
              (k) => SKILL_METADATA[k].category === cat.id
            );

            return (
              <div key={cat.id}>
                <div className="font-tech text-xs font-bold text-[#38bdf8] uppercase tracking-wider mb-2">
                  {cat.label}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {skillsInCat.map((skKey) => {
                    const meta = SKILL_METADATA[skKey];
                    const lvl = activeChar?.skills?.[skKey] ?? 0;
                    const statVal = activeChar?.stats?.[meta.stat] ?? 0;
                    const baseTotal = lvl + statVal;

                    return (
                      <div
                        key={skKey}
                        className="bg-[#171923] p-2.5 rounded border border-[#222636] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-tech text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{meta.label}</span>
                            {meta.isDoubleCost && (
                              <span className="text-[9px] font-mono-code bg-[#dc2626]/20 text-[#dc2626] px-1 rounded">
                                x2
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono-code text-[#94a3b8]">
                            Lvl <strong className="text-white">{lvl}</strong> + {meta.stat} ({statVal}) = <strong className="text-[#10b981] font-bold">Base {baseTotal}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateSkill(skKey, Math.max(0, lvl - 1))}
                            className="w-6 h-6 bg-[#222534] hover:bg-[#dc2626] hover:text-white text-[#cbd5e1] rounded flex items-center justify-center font-bold text-xs"
                            title={`Reducir ${meta.label}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono-code font-bold text-white text-xs">
                            {lvl}
                          </span>
                          <button
                            onClick={() => updateSkill(skKey, lvl + 1)}
                            className="w-6 h-6 bg-[#222534] hover:bg-[#10b981] hover:text-white text-[#cbd5e1] rounded flex items-center justify-center font-bold text-xs"
                            title={`Aumentar ${meta.label}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          5. ARSENAL Y BLINDAJE EQUIPADO EN FICHA
      ========================================================= */}
      <div className="chamfer-card p-5 bg-[#121319] border border-[#232736]">
        <div className="font-tech text-sm font-bold tracking-wider text-white uppercase pb-2 mb-4 border-b border-[#1f2230]">
          EQUIPAMIENTO ACTIVO EN FICHA (ARMAS Y PROTECCIONES)
        </div>

        {/* Armor summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-[#171923] p-3.5 rounded border border-[#222636]">
            <div className="text-[10px] font-mono-code text-[#64748b] uppercase">PROTECCIÓN DE CABEZA</div>
            <div className="font-tech text-base font-bold text-white">{activeChar?.headArmor?.name}</div>
            <div className="text-xs font-mono-code text-[#38bdf8] mt-1">
              Blindaje: {activeChar?.headArmor?.currentSp} / {activeChar?.headArmor?.maxSp} SP
              {activeChar?.headArmor?.penalty ? ` • Penalizador: ${activeChar.headArmor.penalty}` : ''}
            </div>
          </div>

          <div className="bg-[#171923] p-3.5 rounded border border-[#222636]">
            <div className="text-[10px] font-mono-code text-[#64748b] uppercase">PROTECCIÓN DE TORSO</div>
            <div className="font-tech text-base font-bold text-white">{activeChar?.bodyArmor?.name}</div>
            <div className="text-xs font-mono-code text-[#38bdf8] mt-1">
              Blindaje: {activeChar?.bodyArmor?.currentSp} / {activeChar?.bodyArmor?.maxSp} SP
              {activeChar?.bodyArmor?.penalty ? ` • Penalizador: ${activeChar.bodyArmor.penalty}` : ''}
            </div>
          </div>
        </div>

        {/* Weapons List */}
        <div className="space-y-3">
          <div className="text-xs font-mono-code text-[#64748b] uppercase">
            ARMAS EQUIPADAS ({activeChar?.equippedWeapons?.length ?? 0}):
          </div>

          {(activeChar?.equippedWeapons?.length ?? 0) === 0 ? (
            <div className="text-center py-6 text-[#64748b] font-mono-code text-xs bg-[#171923] rounded border border-[#222636]">
              Sin armas equipadas. Equipa objetos desde el Compendio Omni.
            </div>
          ) : (
            activeChar.equippedWeapons.map((w) => (
              <div
                key={w.instanceId}
                className="bg-[#171923] p-3 rounded border border-[#222636] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-tech text-base font-bold text-white">{w.name}</div>
                  <div className="text-xs font-mono-code text-[#94a3b8] flex items-center gap-2">
                    <span>{w.damage} Daño</span>
                    <span>•</span>
                    <span>ROF {w.rof}</span>
                    <span>•</span>
                    <span>{w.skill}</span>
                    {w.standardMag ? <span>• Mag: {w.currentMag}/{w.standardMag}</span> : null}
                  </div>
                </div>

                <button
                  onClick={() => unequipWeapon(w.instanceId)}
                  className="px-3 py-1.5 bg-[#22181d] hover:bg-[#dc2626] text-[#dc2626] hover:text-white rounded-xs font-mono-code text-xs font-bold border border-[#3d1f26] transition-colors"
                >
                  Desequipar
                </button>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
