import { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useDebouncedLocalStorage } from '../../hooks/useDebouncedLocalStorage';
import { 
  calculateMaxHp, 
  getEffectiveBody
} from '../../engine/characterEngine';
import { EnemiesCompendiumPanel } from './EnemiesCompendiumPanel';
import type { EnemySheet } from '../../data/enemiesCatalog';
import { GM_LOOT_TABLES } from '../../data/netAndRolesData';
import { 
  Terminal, 
  Shield, 
  Heart, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Lock, 
  Key, 
  Coins, 
  Users, 
  Swords, 
  Target, 
  Dices, 
  X, 
  Flame, 
  UserCheck,
  FileText,
  Copy,
  Clock,
  Gift,
  Check,
  Train
} from 'lucide-react';

interface InitiativeCombatant {
  id: string;
  name: string;
  isPlayer: boolean;
  characterId?: string;
  initiative: number;
  currentHp: number;
  maxHp: number;
  currentSp: number;
  maxSp: number;
  atkBase: number;
  damageDice: string;
  notes?: string;
}

interface GoonPreset {
  name: string;
  hp: number;
  sp: number;
  atkBase: number;
  damageDice: string;
  notes: string;
}

const GOON_PRESETS: GoonPreset[] = [
  {
    name: 'Matón Callejero',
    hp: 25,
    sp: 4,
    atkBase: 10,
    damageDice: '2d6',
    notes: 'Pistola pesada o cuchillo callejero'
  },
  {
    name: 'Guardia de Seguridad',
    hp: 35,
    sp: 11,
    atkBase: 12,
    damageDice: '3d6',
    notes: 'Subfusil Arasaka o porra eléctrica'
  },
  {
    name: 'Teniente / Solo Élite',
    hp: 45,
    sp: 11,
    atkBase: 14,
    damageDice: '5d6',
    notes: 'Fusil de asalto Militech Ronin'
  },
  {
    name: 'Ciberpsicópata',
    hp: 55,
    sp: 13,
    atkBase: 16,
    damageDice: '5d6',
    notes: 'Cuchillas Mantis y escopeta automática'
  }
];

const GM_PIN_STORAGE_KEY = 'cpr_gm_pin_v1';

// Clave con sufijo de versión; se migra una vez desde la clave vieja 'cpr-gm-pin'.
function migrateLegacyGmPin(): void {
  if (typeof window === 'undefined' || localStorage.getItem(GM_PIN_STORAGE_KEY)) return;
  const legacyPin = localStorage.getItem('cpr-gm-pin');
  if (legacyPin) {
    localStorage.setItem(GM_PIN_STORAGE_KEY, legacyPin);
    localStorage.removeItem('cpr-gm-pin');
  }
}

function rollD10(): number {
  return Math.floor(Math.random() * 10) + 1;
}

function generateGoonId(): string {
  return `goon-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

export function FixerDeckView() {
  const characters = useCharacterStore((state) => state.characters);
  const activeCharacterId = useCharacterStore((state) => state.activeCharacterId);
  const setActiveCharacter = useCharacterStore((state) => state.setActiveCharacter);
  const gmUpdateCharacterVitals = useCharacterStore((state) => state.gmUpdateCharacterVitals);
  const gmPayAllCharacters = useCharacterStore((state) => state.gmPayAllCharacters);

  // 1. PIN Security System
  const [savedPin, setSavedPin] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    migrateLegacyGmPin();
    const pin = localStorage.getItem(GM_PIN_STORAGE_KEY);
    return pin && pin.length === 4 ? pin : null;
  });
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const pin = localStorage.getItem(GM_PIN_STORAGE_KEY);
    return !(pin && pin.length === 4);
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isSettingPin, setIsSettingPin] = useState<boolean>(false);
  const [newPinValue, setNewPinValue] = useState<string>('');

  const handleUnlock = () => {
    if (pinInput === savedPin) {
      setIsUnlocked(true);
      setPinError(null);
      setPinInput('');
    } else {
      setPinError('PIN incorrecto. Acceso denegado.');
    }
  };

  const handleSaveNewPin = () => {
    if (newPinValue.length === 4 && /^\d+$/.test(newPinValue)) {
      localStorage.setItem(GM_PIN_STORAGE_KEY, newPinValue);
      setSavedPin(newPinValue);
      setIsSettingPin(false);
      setNewPinValue('');
      showFeedback('PIN de 4 dígitos guardado con éxito.');
    } else {
      setPinError('El PIN debe tener exactamente 4 dígitos numéricos.');
    }
  };

  const handleRemovePin = () => {
    localStorage.removeItem(GM_PIN_STORAGE_KEY);
    setSavedPin(null);
    setIsUnlocked(true);
    showFeedback('PIN de seguridad eliminado.');
  };

  // 2. Mass Fixer Payout State
  const [payoutConcept, setPayoutConcept] = useState<string>('Pago de Fixer — Rescate en Japantown');
  const [payoutAmount, setPayoutAmount] = useState<number>(1000);

  // 3. Initiative & Goon Tracker State
  const [combatants, setCombatants] = useState<InitiativeCombatant[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [lastGoonAttack, setLastGoonAttack] = useState<{
    goonName: string;
    d10: number;
    atkBase: number;
    totalAtk: number;
    diceResults: number[];
    damageTotal: number;
    notes?: string;
  } | null>(null);

  // Custom Goon Modal
  const [isAddingCustomGoon, setIsAddingCustomGoon] = useState<boolean>(false);
  const [customGoonForm, setCustomGoonForm] = useState({
    name: 'Refuerzo Militech',
    hp: 30,
    sp: 7,
    atkBase: 12,
    damageDice: '3d6',
    notes: 'Escudo anti-disturbios'
  });

  // UI Toast feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // 4. GM Loot Generator State
  const [selectedLootTableId, setSelectedLootTableId] = useState<string>(GM_LOOT_TABLES[0].id);
  const [rolledLoot, setRolledLoot] = useState<{
    tableId: string;
    tableName: string;
    roll: number;
    item: string;
    value: string;
    notes?: string;
  } | null>(null);

  const handleRollLoot = () => {
    const table = GM_LOOT_TABLES.find((t) => t.id === selectedLootTableId) || GM_LOOT_TABLES[0];
    const roll = rollD10();
    const entry = table.entries.find((e) => e.roll === roll) || table.entries[0];
    setRolledLoot({
      tableId: table.id,
      tableName: table.name,
      roll,
      item: entry.item,
      value: entry.value,
      notes: entry.notes
    });
    showFeedback(`🎲 Tirada de Botín 1d10 [${roll}]: ${entry.item}`);
  };

  const handleAwardLootValue = () => {
    if (!rolledLoot) return;
    const match = rolledLoot.value.match(/([\d,]+)/);
    if (!match) {
      showFeedback(`ℹ️ El botín "${rolledLoot.item}" tiene valor variable o no monetario.`);
      return;
    }
    const cleanNum = parseInt(match[1].replace(/,/g, ''), 10);
    if (isNaN(cleanNum) || cleanNum <= 0) return;
    const perChar = Math.floor(cleanNum / Math.max(1, characters.length));
    gmPayAllCharacters(`Botín de Escena: ${rolledLoot.item}`, perChar);
    showFeedback(`💰 Se transfirieron ${cleanNum} €$ divididos entre el grupo (${perChar} €$ c/u).`);
  };

  // 5. GM Secret Scene Notes State
  const [secretNotes, setSecretNotes] = useState<string>(() => {
    try {
      return localStorage.getItem('cpr_gm_secret_notes_v1') || '';
    } catch {
      return '';
    }
  });

  // v4.9.7 [Claude Code · 2026-10-24] Guardado agrupado en localStorage (plan17).
  useDebouncedLocalStorage('cpr_gm_secret_notes_v1', secretNotes, (v) => String(v));

  const handleInsertTimestamp = () => {
    const now = new Date();
    const timeStr = `[${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] `;
    setSecretNotes((prev) => (prev ? `${prev}\n${timeStr}` : timeStr));
  };

  const handleInsertTemplate = (type: 'scene' | 'clues' | 'combat') => {
    let tpl = '';
    if (type === 'scene') {
      tpl = `\n### 🎬 NUEVA ESCENA // LOCALIZACIÓN: \n- Objetivo Táctico: \n- NPCs Clave / Actores: \n- DVs Relevantes (Percepción / Atletismo / Sigilo): \n- Recompensa Estimada: \n`;
    } else if (type === 'clues') {
      tpl = `\n### 🕵️ PISTAS & RUMORES FIXER: \n- Pista Obvia (Pública en Data Pool): \n- Pista Oculta (Percepción o Deduction DV 13): \n- Secreto Peligroso (Extorsión o Megacorp): \n`;
    } else if (type === 'combat') {
      tpl = `\n### 💀 CONSECUENCIAS & BAJAS DE COMBATE: \n- Bajas enemigas confirmadas: \n- Daño colateral / Testigos: \n- Nivel de Alerta Policial (NCPD / C-SWAT): \n`;
    }
    setSecretNotes((prev) => (prev ? `${prev}${tpl}` : tpl.trimStart()));
    showFeedback('Plantilla insertada en las notas secretas.');
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(secretNotes);
    showFeedback('📋 Notas secretas copiadas al portapapeles.');
  };

  const handleClearNotes = () => {
    if (window.confirm('¿Seguro que deseas vaciar todas las notas secretas?')) {
      setSecretNotes('');
      showFeedback('🗑️ Notas secretas eliminadas.');
    }
  };

  // Roll players initiative (1d10 + REF)
  const handleRollPlayersInitiative = () => {
    const rolledPlayers: InitiativeCombatant[] = characters.map((c) => {
      const d10 = rollD10();
      const ref = c.stats?.REF || 5;
      const maxHp = calculateMaxHp(getEffectiveBody(c), c.stats?.WILL ?? 0);
      const avgSp = Math.max(c.headArmor?.currentSp || 0, c.bodyArmor?.currentSp || 0);
      const maxSp = Math.max(c.headArmor?.maxSp || 0, c.bodyArmor?.maxSp || 0);

      return {
        id: `init-player-${c.id}`,
        name: `${c.handle} (${c.role})`,
        isPlayer: true,
        characterId: c.id,
        initiative: d10 + ref,
        currentHp: c.currentHp,
        maxHp,
        currentSp: avgSp,
        maxSp,
        atkBase: ref + 6,
        damageDice: '3d6',
        notes: `1d10(${d10}) + REF(${ref})`
      };
    });

    // Merge with existing goons and sort descending
    setCombatants((prev) => {
      const goons = prev.filter((cb) => !cb.isPlayer);
      const merged = [...rolledPlayers, ...goons];
      return merged.sort((a, b) => b.initiative - a.initiative);
    });

    setActiveTurnIndex(0);
    setCurrentRound(1);
    showFeedback('⚡ Iniciativa de todos los jugadores lanzada y ordenada.');
  };

  // Add Goon from preset
  const handleAddGoon = (preset: GoonPreset) => {
    const d10 = rollD10();
    const refEstimate = Math.max(4, preset.atkBase - 6);
    const goonNumber = combatants.filter((c) => c.name.startsWith(preset.name)).length + 1;

    const newGoon: InitiativeCombatant = {
      id: generateGoonId(),
      name: `${preset.name} #${goonNumber}`,
      isPlayer: false,
      initiative: d10 + refEstimate,
      currentHp: preset.hp,
      maxHp: preset.hp,
      currentSp: preset.sp,
      maxSp: preset.sp,
      atkBase: preset.atkBase,
      damageDice: preset.damageDice,
      notes: `${preset.notes} • Init: 1d10(${d10})+${refEstimate}`
    };

    setCombatants((prev) => {
      const updated = [...prev, newGoon];
      return updated.sort((a, b) => b.initiative - a.initiative);
    });

    showFeedback(`Spawned ${newGoon.name} con Iniciativa ${newGoon.initiative}.`);
  };

  const handleAddGoonFromSheet = (enemy: EnemySheet) => {
    const d10 = rollD10();
    const ref = enemy.stats.REF ?? 6;
    const primaryWeapon = enemy.weapons[0] || { name: 'Ataque Desarmado', skillBase: 10, damage: '2d6' };
    const goonNumber = combatants.filter((c) => c.name.startsWith(enemy.name)).length + 1;
    const newGoon: InitiativeCombatant = {
      id: generateGoonId(),
      name: `${enemy.name} #${goonNumber}`,
      isPlayer: false,
      initiative: d10 + ref,
      currentHp: enemy.hp,
      maxHp: enemy.hp,
      currentSp: enemy.bodySp,
      maxSp: enemy.bodySp,
      atkBase: primaryWeapon.skillBase,
      damageDice: primaryWeapon.damage,
      notes: `${enemy.faction} • ${primaryWeapon.name} (${primaryWeapon.damage}) • Head SP: ${enemy.headSp}`
    };

    setCombatants((prev) => {
      const updated = [...prev, newGoon];
      return updated.sort((a, b) => b.initiative - a.initiative);
    });

    showFeedback(`Spawned ${newGoon.name} en Iniciativa con ${newGoon.initiative}.`);
  };

  const handleAddCustomGoon = () => {
    const d10 = rollD10();
    const refEstimate = Math.max(4, customGoonForm.atkBase - 6);
    const newGoon: InitiativeCombatant = {
      id: generateGoonId(),
      name: customGoonForm.name,
      isPlayer: false,
      initiative: d10 + refEstimate,
      currentHp: customGoonForm.hp,
      maxHp: customGoonForm.hp,
      currentSp: customGoonForm.sp,
      maxSp: customGoonForm.sp,
      atkBase: customGoonForm.atkBase,
      damageDice: customGoonForm.damageDice,
      notes: customGoonForm.notes
    };

    setCombatants((prev) => {
      const updated = [...prev, newGoon];
      return updated.sort((a, b) => b.initiative - a.initiative);
    });

    setIsAddingCustomGoon(false);
    showFeedback(`Spawned enemigo personalizado: ${newGoon.name}.`);
  };

  // Attack with Goon
  const handleGoonAttack = (goon: InitiativeCombatant) => {
    const d10 = rollD10();
    const totalAtk = d10 + goon.atkBase;

    // Parse damage dice like "2d6", "3d6", "5d6"
    const diceCount = parseInt(goon.damageDice.replace(/\D/g, ''), 10) || 3;
    const diceResults = Array.from({ length: diceCount }).map(
      () => Math.floor(Math.random() * 6) + 1
    );
    const damageTotal = diceResults.reduce((a, b) => a + b, 0);

    setLastGoonAttack({
      goonName: goon.name,
      d10,
      atkBase: goon.atkBase,
      totalAtk,
      diceResults,
      damageTotal,
      notes: goon.notes
    });
  };

  // Next turn
  const handleNextTurn = () => {
    if (combatants.length === 0) return;
    if (activeTurnIndex + 1 >= combatants.length) {
      setActiveTurnIndex(0);
      setCurrentRound((r) => r + 1);
    } else {
      setActiveTurnIndex((i) => i + 1);
    }
  };

  // Adjust combatant HP
  const handleAdjustCombatantHp = (id: string, delta: number) => {
    setCombatants((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newHp = Math.max(0, Math.min(c.maxHp, c.currentHp + delta));
        return { ...c, currentHp: newHp };
      })
    );
  };

  // Adjust combatant SP
  const handleAdjustCombatantSp = (id: string, delta: number) => {
    setCombatants((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newSp = Math.max(0, Math.min(c.maxSp, c.currentSp + delta));
        return { ...c, currentSp: newSp };
      })
    );
  };

  const handleRepairCombatantSp = (id: string) => {
    setCombatants((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return { ...c, currentSp: c.maxSp };
      })
    );
  };

  const handleRemoveCombatant = (id: string) => {
    setCombatants((prev) => prev.filter((c) => c.id !== id));
  };

  // --- PIN LOCK SCREEN ---
  if (!isUnlocked && savedPin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#10121a] border-2 border-[#dc2626] rounded-xs p-6 shadow-2xl text-center space-y-6 animate-in fade-in duration-200">
        <div className="inline-flex p-3 bg-[#dc2626]/20 border border-[#dc2626] rounded-full text-[#dc2626] mb-1">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <h2 className="font-tech text-xl font-black text-white tracking-widest uppercase">
            FIXER CONSOLE // TERMINAL BLOQUEADA
          </h2>
          <p className="text-xs font-mono-code text-[#94a3b8] mt-1">
            Esta sesión está protegida con PIN de seguridad para evitar spoilers a los jugadores.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            maxLength={4}
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value.replace(/\D/g, ''));
              setPinError(null);
            }}
            placeholder="PIN (4 DÍGITOS)"
            className="w-full text-center tracking-[0.5em] font-mono-code text-2xl py-2.5 bg-[#08090e] border border-[#262c3e] focus:border-[#dc2626] text-white rounded-xs focus:outline-none"
          />

          {pinError && (
            <p className="text-xs font-mono-code text-[#ef4444] animate-bounce">
              {pinError}
            </p>
          )}

          <button
            onClick={handleUnlock}
            className="w-full py-2.5 bg-[#dc2626] hover:bg-white text-white hover:text-black font-tech font-bold text-sm uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
          >
            DESBLOQUEAR TERMINAL GM
          </button>
        </div>

        <div className="pt-4 border-t border-[#1c2130] flex justify-center">
          <button
            onClick={handleRemovePin}
            className="text-[11px] font-mono-code text-[#64748b] hover:text-[#ef4444] transition-colors cursor-pointer"
          >
            ¿Olvidaste el PIN? (Eliminar y Desbloquear)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 font-sans selection:bg-[#dc2626] selection:text-white">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded bg-[#064e3b] border border-[#10b981] text-[#a7f3d0] text-xs font-mono-code flex items-center gap-3 shadow-2xl animate-bounce">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span>{feedbackMessage}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="ml-auto text-white/70 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. TOP HEADER & SECURITY PIN CONTROLS */}
      <div className="bg-[#0e1017] border border-[#222738] p-4 rounded-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#10b981]/20 border border-[#10b981] rounded-xs text-[#10b981]">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-tech text-lg sm:text-xl font-black text-white tracking-wider uppercase">
                FIXER DECK // GM MASTER OPS
              </h1>
              <span className="text-[10px] font-mono-code bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 px-2 py-0.5 rounded font-bold">
                CONSOLE ONLINE
              </span>
            </div>
            <p className="text-xs font-mono-code text-[#64748b]">
              Control de mesa para Directores de Juego • Cyberpunk RED Architecture
            </p>
          </div>
        </div>

        {/* PIN Security Controls */}
        <div className="flex items-center gap-2 bg-[#131622] p-2 rounded border border-[#23293c]">
          {savedPin ? (
            <>
              <span className="text-[11px] font-mono-code text-[#10b981] flex items-center gap-1 font-bold px-1">
                <Lock className="w-3.5 h-3.5" /> PIN ACTIVADO
              </span>
              <button
                onClick={() => setIsUnlocked(false)}
                className="px-2.5 py-1 bg-[#dc2626]/20 hover:bg-[#dc2626] text-[#dc2626] hover:text-white border border-[#dc2626]/40 text-xs font-tech font-bold uppercase rounded-2xs transition-colors cursor-pointer"
                title="Bloquear consola inmediatamente para ocultar pantalla a jugadores"
              >
                Bloquear Ahora
              </button>
              <button
                onClick={handleRemovePin}
                className="px-2 py-1 bg-[#1a1e2c] hover:bg-[#283046] text-[#94a3b8] hover:text-white text-xs font-tech font-bold uppercase rounded-2xs transition-colors cursor-pointer"
                title="Quitar PIN"
              >
                Eliminar PIN
              </button>
            </>
          ) : isSettingPin ? (
            <div className="flex items-center gap-1.5">
              <input
                type="password"
                maxLength={4}
                value={newPinValue}
                onChange={(e) => setNewPinValue(e.target.value.replace(/\D/g, ''))}
                placeholder="4 DÍGITOS"
                className="w-24 text-center font-mono-code text-xs py-1 bg-[#090b10] border border-[#262c3e] text-white rounded-xs focus:outline-none focus:border-[#10b981]"
              />
              <button
                onClick={handleSaveNewPin}
                className="px-2 py-1 bg-[#10b981] text-black font-tech font-bold text-xs uppercase rounded-2xs cursor-pointer"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsSettingPin(false)}
                className="px-2 py-1 bg-[#1a1e2c] text-[#94a3b8] font-tech font-bold text-xs uppercase rounded-2xs cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSettingPin(true)}
              className="px-3 py-1 bg-[#1e2334] hover:bg-[#38bdf8] text-[#94a3b8] hover:text-black border border-[#283146] text-xs font-tech font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Configurar Candado PIN</span>
            </button>
          )}
        </div>
      </div>

      {/* ONESHOT CAMPAIGN BANNER: RED CHROME CARGO */}
      <div className="bg-gradient-to-r from-red-950/80 via-[#16121d] to-[#0d121c] border-2 border-red-600/70 p-4 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 text-white rounded-xs border border-red-400">
            <Train className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-tech font-black text-[10px] px-2 py-0.5 rounded-2xs uppercase tracking-widest">
                ONESHOT CANÓNICO ACTIVO
              </span>
              <span className="text-xs font-mono-code text-amber-400">CEMK 2077 & 2045 DUAL ENGINE</span>
            </div>
            <h2 className="font-tech text-base sm:text-lg font-black text-white uppercase tracking-wider">
              RED CHROME CARGO // THE HAMMERHEAD
            </h2>
            <p className="text-xs font-mono-code text-[#94a3b8]">
              Mapa esquemático interactivo de 4 vagones, 5 pisos de Mainframe NET, Screamsheet y pago de Hornet.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const oneshotTabBtn = document.querySelector('button:has(svg.lucide-train)') as HTMLButtonElement | null;
            if (oneshotTabBtn) oneshotTabBtn.click();
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30 whitespace-nowrap self-start md:self-center"
        >
          <Train className="w-4 h-4" />
          <span>ABRIR RED CHROME CARGO ➔</span>
        </button>
      </div>

      {/* 2. MASS FIXER PAYOUT (PAGO GRUPAL DE GIGS) */}
      <div className="chamfer-card p-4 bg-[#10131c] border border-[#202638] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1b2132]">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider">
              MASS FIXER PAYOUT // PAGOS Y COBROS GRUPALES
            </h2>
          </div>
          <span className="text-[10px] font-mono-code text-[#94a3b8]">
            {characters.length} Edgerunners en la party
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5 space-y-1">
            <label className="text-[10px] font-mono-code text-[#94a3b8] uppercase block">
              Concepto del Trabajo o Gasto Grupal
            </label>
            <input
              type="text"
              value={payoutConcept}
              onChange={(e) => setPayoutConcept(e.target.value)}
              className="w-full bg-[#090b10] border border-[#23293c] text-white font-mono-code text-xs px-3 py-1.5 rounded-xs focus:outline-none focus:border-[#f59e0b]"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-[10px] font-mono-code text-[#94a3b8] uppercase block">
              Monto por Edgerunner (€$)
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-[#090b10] border border-[#23293c] text-[#f59e0b] font-tech text-base font-bold px-3 py-1 rounded-xs focus:outline-none focus:border-[#f59e0b]"
              />
            </div>
          </div>

          <div className="md:col-span-4 flex flex-wrap gap-1.5">
            <button
              onClick={() => setPayoutAmount(500)}
              className="px-2 py-1 bg-[#181c28] hover:bg-[#252c40] text-xs font-mono-code text-[#94a3b8] rounded-xs cursor-pointer"
            >
              500 €$
            </button>
            <button
              onClick={() => setPayoutAmount(1000)}
              className="px-2 py-1 bg-[#181c28] hover:bg-[#252c40] text-xs font-mono-code text-[#94a3b8] rounded-xs cursor-pointer"
            >
              1,000 €$
            </button>
            <button
              onClick={() => setPayoutAmount(2000)}
              className="px-2 py-1 bg-[#181c28] hover:bg-[#252c40] text-xs font-mono-code text-[#94a3b8] rounded-xs cursor-pointer"
            >
              2,000 €$
            </button>
            <button
              onClick={() => setPayoutAmount(-500)}
              className="px-2 py-1 bg-[#ef4444]/15 hover:bg-[#ef4444] text-xs font-mono-code text-[#ef4444] hover:text-white rounded-xs cursor-pointer"
              title="Cobrar 500 €$ a cada personaje (Gastos de Estilo de Vida)"
            >
              -500 €$ (Alquiler)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1b2132]">
          <span className="text-xs font-mono-code text-[#94a3b8]">
            Total a transferir: <strong className="text-white font-tech font-bold">{payoutAmount * characters.length} €$</strong> ({payoutAmount} €$ × {characters.length} jugadores).
          </span>

          <button
            onClick={() => {
              gmPayAllCharacters(payoutConcept, payoutAmount);
              showFeedback(`💰 Se transfirieron ${payoutAmount} €$ a todos los ${characters.length} personajes.`);
            }}
            className="px-4 py-2 bg-[#f59e0b] hover:bg-white text-black font-tech font-black text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          >
            <Coins className="w-4 h-4" />
            <span>APLICAR PAGO A TODO EL GRUPO</span>
          </button>
        </div>
      </div>

      {/* 3. MONITOR EN VIVO DE TODO EL GRUPO (PARTY ROSTER CONTROL) */}
      <div className="chamfer-card p-4 bg-[#0e1017] border border-[#202538] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1b2030]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider">
              PARTY ROSTER CONTROL // ESTADO VITAL DEL GRUPO
            </h2>
          </div>
          <span className="text-[10px] font-mono-code text-[#64748b]">
            Modificaciones en tiempo real conectadas a Zustand
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => {
            const isActive = char.id === activeCharacterId;
            const maxHp = calculateMaxHp(getEffectiveBody(char), char.stats?.WILL ?? 0);
            const currentHp = char.currentHp ?? maxHp;
            const hpRatio = (currentHp / maxHp) * 100;
            const maxLuck = char.stats?.LUCK ?? 5;
            const currentLuck = char.currentLuck ?? maxLuck;

            return (
              <div
                key={char.id}
                className={`p-3.5 rounded-xs border transition-all relative ${
                  isActive
                    ? 'bg-[#151926] border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                    : 'bg-[#11131c] border-[#1f2434] hover:border-[#38bdf8]/50'
                }`}
              >
                {/* Header: Handle, Role and Active selector */}
                <div className="flex items-start justify-between pb-2 mb-2 border-b border-[#1b2030]">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-tech text-base font-bold text-white">
                        {char.handle}
                      </h3>
                      {isActive && (
                        <span className="text-[9px] font-mono-code bg-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#38bdf8] px-1.5 py-0.2 rounded font-bold">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono-code text-[#94a3b8] uppercase">
                      {char.role} (Rango {char.roleRank || 4})
                    </span>
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => {
                        setActiveCharacter(char.id);
                        showFeedback(`Personaje activo cambiado a ${char.handle}.`);
                      }}
                      className="px-2 py-1 bg-[#1a1e2a] hover:bg-[#38bdf8] text-[#94a3b8] hover:text-black font-tech text-[10px] font-bold uppercase rounded-2xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>Activar</span>
                    </button>
                  )}
                </div>

                {/* HP Bar and Controls */}
                <div className="space-y-1 mb-2.5">
                  <div className="flex justify-between items-baseline text-xs font-mono-code">
                    <span className="text-[10px] text-[#94a3b8] flex items-center gap-1">
                      <Heart className="w-3 h-3 text-[#ef4444]" /> HP
                    </span>
                    <span>
                      <strong className={currentHp < maxHp / 2 ? 'text-[#ef4444]' : 'text-white'}>
                        {currentHp}
                      </strong>{' '}
                      / {maxHp}
                    </span>
                  </div>
                  <div className="w-full bg-[#090b10] h-2 rounded-xs overflow-hidden border border-[#1e2334]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        currentHp < maxHp / 2 ? 'bg-[#ef4444]' : 'bg-[#10b981]'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, hpRatio))}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    <button
                      onClick={() => gmUpdateCharacterVitals(char.id, { hpDelta: -5 })}
                      className="flex-1 py-0.5 bg-[#1a1e2c] hover:bg-[#ef4444] text-[#94a3b8] hover:text-white rounded-xs text-[10px] font-mono-code transition-colors cursor-pointer"
                    >
                      -5 HP
                    </button>
                    <button
                      onClick={() => gmUpdateCharacterVitals(char.id, { hpDelta: 5 })}
                      className="flex-1 py-0.5 bg-[#1a1e2c] hover:bg-[#10b981] text-[#94a3b8] hover:text-white rounded-xs text-[10px] font-mono-code transition-colors cursor-pointer"
                    >
                      +5 HP
                    </button>
                    <button
                      onClick={() => gmUpdateCharacterVitals(char.id, { restoreFullHp: true })}
                      className="flex-1 py-0.5 bg-[#10b981]/15 hover:bg-[#10b981] text-[#10b981] hover:text-black rounded-xs text-[10px] font-tech font-bold uppercase transition-colors cursor-pointer"
                    >
                      Curar Full
                    </button>
                  </div>
                </div>

                {/* Armor Head & Body SP */}
                <div className="grid grid-cols-2 gap-2 mb-2.5 bg-[#090b10] p-2 rounded-xs border border-[#1b2030]">
                  <div>
                    <span className="text-[9px] font-mono-code text-[#64748b] block">CABEZA SP</span>
                    <span className="font-tech text-xs font-bold text-[#38bdf8]">
                      {char.headArmor?.currentSp ?? 0} / {char.headArmor?.maxSp ?? 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono-code text-[#64748b] block">TORSO SP</span>
                    <span className="font-tech text-xs font-bold text-[#38bdf8]">
                      {char.bodyArmor?.currentSp ?? 0} / {char.bodyArmor?.maxSp ?? 0}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-[#171b26] flex justify-between">
                    <button
                      onClick={() => gmUpdateCharacterVitals(char.id, { repairAllArmor: true })}
                      className="w-full py-0.5 bg-[#182030] hover:bg-[#38bdf8] text-[#38bdf8] hover:text-black font-tech text-[10px] font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Shield className="w-3 h-3" /> Reparar Blindajes
                    </button>
                  </div>
                </div>

                {/* Luck & Eurodollars */}
                <div className="grid grid-cols-2 gap-2 mb-2.5 text-xs font-mono-code">
                  <div className="bg-[#141824] p-1.5 rounded border border-[#222738] flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-[#94a3b8] uppercase block">LUCK</span>
                      <span className="font-tech text-xs font-bold text-[#f59e0b]">
                        {currentLuck} / {maxLuck}
                      </span>
                    </div>
                    <button
                      onClick={() => gmUpdateCharacterVitals(char.id, { restoreAllLuck: true })}
                      className="p-1 hover:text-[#10b981] cursor-pointer"
                      title="Restablecer Suerte al máximo"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="bg-[#141824] p-1.5 rounded border border-[#222738]">
                    <span className="text-[8px] text-[#94a3b8] uppercase block">FONDOS (€$)</span>
                    <span className="font-tech text-xs font-bold text-white">
                      {(char.eurodollars || 0).toLocaleString()} €$
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TRACKER DE INICIATIVA Y GENERADOR DE GOONS RÁPIDOS */}
      <div className="chamfer-card p-4 bg-[#0e1017] border border-[#202538] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1b2030]">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-[#ef4444]" />
            <div>
              <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                TACTICAL INITIATIVE TRACKER // COMBAT ROUND {currentRound}
              </h2>
              <p className="text-[10px] font-mono-code text-[#64748b]">
                Gestor de turnos tácticos con generador de goons y tirador de daño rápido
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRollPlayersInitiative}
              className="px-3 py-1.5 bg-[#38bdf8]/20 hover:bg-[#38bdf8] text-[#38bdf8] hover:text-black border border-[#38bdf8]/40 text-xs font-tech font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Dices className="w-4 h-4" />
              <span>TIRAR INICIATIVA DE JUGADORES (1d10 + REF)</span>
            </button>

            <button
              onClick={handleNextTurn}
              disabled={combatants.length === 0}
              className="px-3 py-1.5 bg-[#10b981] hover:bg-white text-black font-tech font-bold text-xs uppercase rounded-xs transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Target className="w-4 h-4" />
              <span>SIGUIENTE TURNO &gt;&gt;</span>
            </button>

            <button
              onClick={() => {
                setCombatants([]);
                setCurrentRound(1);
                setActiveTurnIndex(0);
                showFeedback('Iniciativa reiniciada.');
              }}
              className="px-2.5 py-1.5 bg-[#1a1e2c] hover:bg-[#ef4444] text-[#94a3b8] hover:text-white font-tech text-xs uppercase rounded-xs transition-colors cursor-pointer"
              title="Limpiar toda la iniciativa"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Goon Spawner Presets Bar */}
        <div className="bg-[#121520] p-3 rounded-xs border border-[#1f2538] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-tech font-bold text-white uppercase flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#ef4444]" /> SPAWN RÁPIDO DE GOONS:
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {GOON_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleAddGoon(preset)}
                className="px-2.5 py-1 bg-[#1a1e2a] hover:bg-[#ef4444] text-[#cbd5e1] hover:text-white border border-[#2b3348] text-xs font-mono-code rounded-xs transition-colors cursor-pointer flex items-center gap-1"
                title={`HP: ${preset.hp}, SP: ${preset.sp}, Atk: +${preset.atkBase}, Daño: ${preset.damageDice}`}
              >
                <Plus className="w-3 h-3 text-[#ef4444]" />
                <span>{preset.name}</span>
                <span className="text-[10px] text-[#94a3b8] font-bold">[{preset.hp}HP / {preset.sp}SP]</span>
              </button>
            ))}

            <button
              onClick={() => setIsAddingCustomGoon(true)}
              className="px-2.5 py-1 bg-[#23293a] hover:bg-[#38bdf8] text-[#94a3b8] hover:text-black border border-[#30384e] text-xs font-tech font-bold uppercase rounded-xs transition-colors cursor-pointer"
            >
              + Personalizado
            </button>
          </div>
        </div>

        {/* Last Goon Attack Banner */}
        {lastGoonAttack && (
          <div className="bg-[#ef4444]/15 border-2 border-[#ef4444] p-3 rounded-xs flex flex-wrap items-center justify-between gap-3 text-white animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-[#ef4444] flex-shrink-0" />
              <div>
                <span className="text-[10px] font-mono-code text-[#fca5a5] uppercase block font-bold">
                  ATAQUE DE GOON EN CURSO
                </span>
                <p className="text-sm font-tech font-bold">
                  {lastGoonAttack.goonName} disparó: 1d10({lastGoonAttack.d10}) + {lastGoonAttack.atkBase} ={' '}
                  <span className="text-[#38bdf8] text-base font-black">
                    {lastGoonAttack.totalAtk} vs DV
                  </span>
                </p>
                <p className="text-xs font-mono-code text-[#cbd5e1]">
                  Daño: [{lastGoonAttack.diceResults.join(' + ')}] ={' '}
                  <strong className="text-[#f59e0b] font-bold text-sm">
                    {lastGoonAttack.damageTotal} Daño Balístico
                  </strong>{' '}
                  (Resta SP del objetivo)
                </p>
              </div>
            </div>

            <button
              onClick={() => setLastGoonAttack(null)}
              className="text-[#94a3b8] hover:text-white cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Combatants List Table */}
        {combatants.length === 0 ? (
          <div className="text-center py-12 text-[#64748b] bg-[#090b10] border border-[#1b1f2e] rounded-xs space-y-2">
            <Swords className="w-8 h-8 mx-auto opacity-30" />
            <p className="font-tech text-sm uppercase tracking-wider">
              No hay combatientes en el tracker.
            </p>
            <p className="text-xs font-mono-code">
              Presiona "Tirar Iniciativa de Jugadores" o agrega Goons con los botones superiores.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {combatants.map((cb, idx) => {
              const isCurrentTurn = idx === activeTurnIndex;

              return (
                <div
                  key={cb.id}
                  className={`p-3 rounded-xs border transition-all flex flex-wrap items-center justify-between gap-3 ${
                    isCurrentTurn
                      ? 'bg-[#181d2a] border-[#10b981] shadow-[0_0_14px_rgba(16,185,129,0.3)]'
                      : cb.isPlayer
                      ? 'bg-[#0f121a] border-[#22283a]'
                      : 'bg-[#151114] border-[#341d24]'
                  }`}
                >
                  {/* Left: Turn marker, Initiative, Name */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xs flex flex-col items-center justify-center font-tech font-black text-sm border ${
                        isCurrentTurn
                          ? 'bg-[#10b981] text-black border-[#10b981]'
                          : cb.isPlayer
                          ? 'bg-[#1b2234] text-[#38bdf8] border-[#26314c]'
                          : 'bg-[#2b171c] text-[#ef4444] border-[#461e27]'
                      }`}
                      title="Valor de Iniciativa"
                    >
                      <span className="text-[8px] font-mono-code leading-none">INIT</span>
                      <span>{cb.initiative}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-tech text-base font-bold text-white">
                          {cb.name}
                        </span>
                        {isCurrentTurn && (
                          <span className="text-[9px] font-mono-code bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] px-1.5 py-0.2 rounded font-black animate-pulse">
                            TURNO ACTIVO
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-mono-code px-1.5 py-0.2 rounded font-bold uppercase ${
                            cb.isPlayer
                              ? 'bg-[#38bdf8]/15 text-[#38bdf8]'
                              : 'bg-[#ef4444]/15 text-[#ef4444]'
                          }`}
                        >
                          {cb.isPlayer ? 'Edgerunner' : 'Enemigo'}
                        </span>
                      </div>
                      {cb.notes && (
                        <p className="text-[10px] font-mono-code text-[#64748b]">
                          {cb.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Center: HP & SP Quick Controls */}
                  <div className="flex items-center gap-4">
                    {/* HP Box */}
                    <div className="flex items-center gap-1.5 bg-[#090b10] px-2.5 py-1 rounded border border-[#1e2334]">
                      <Heart className="w-3.5 h-3.5 text-[#ef4444]" />
                      <div className="text-center min-w-[50px]">
                        <span className="font-tech text-sm font-bold text-white leading-none block">
                          {cb.currentHp}
                        </span>
                        <span className="text-[8px] font-mono-code text-[#64748b]">
                          /{cb.maxHp} HP
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => handleAdjustCombatantHp(cb.id, 1)}
                          className="px-1 py-0.2 bg-[#1a1e2c] hover:bg-[#10b981] text-[9px] text-[#94a3b8] hover:text-white rounded-2xs font-mono-code"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleAdjustCombatantHp(cb.id, -1)}
                          className="px-1 py-0.2 bg-[#1a1e2c] hover:bg-[#ef4444] text-[9px] text-[#94a3b8] hover:text-white rounded-2xs font-mono-code"
                        >
                          -1
                        </button>
                      </div>
                    </div>

                    {/* SP Box */}
                    <div className="flex items-center gap-1.5 bg-[#090b10] px-2.5 py-1 rounded border border-[#1e2334]">
                      <Shield className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <div className="text-center min-w-[45px]">
                        <span className="font-tech text-sm font-bold text-[#38bdf8] leading-none block">
                          {cb.currentSp}
                        </span>
                        <span className="text-[8px] font-mono-code text-[#64748b]">
                          /{cb.maxSp} SP
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => handleRepairCombatantSp(cb.id)}
                          className="px-1 py-0.2 bg-[#1a1e2c] hover:bg-[#38bdf8] text-[9px] text-[#94a3b8] hover:text-black rounded-2xs font-mono-code"
                          title="Restaurar SP al máximo"
                        >
                          Rep
                        </button>
                        <button
                          onClick={() => handleAdjustCombatantSp(cb.id, -1)}
                          className="px-1 py-0.2 bg-[#1a1e2c] hover:bg-[#ef4444] text-[9px] text-[#94a3b8] hover:text-white rounded-2xs font-mono-code"
                          title="Ablación de 1 SP"
                        >
                          -1
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    {!cb.isPlayer && (
                      <button
                        onClick={() => handleGoonAttack(cb)}
                        className="px-3 py-1.5 bg-[#ef4444] hover:bg-white text-black font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>ATACAR (+{cb.atkBase} / {cb.damageDice})</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleRemoveCombatant(cb.id)}
                      className="p-1.5 text-[#64748b] hover:text-[#ef4444] rounded hover:bg-[#1f2434] transition-colors cursor-pointer"
                      title="Eliminar de iniciativa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: CUSTOM GOON FORM */}
      {isAddingCustomGoon && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10131c] border-2 border-[#38bdf8] rounded-xs max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1f2638] pb-3">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#38bdf8]" /> CREAR ENEMIGO / GOON PERSONALIZADO
              </h3>
              <button
                onClick={() => setIsAddingCustomGoon(false)}
                className="text-[#64748b] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono-code">
              <div className="col-span-2 space-y-1">
                <label className="text-[#94a3b8] block">Nombre o Arquetipo</label>
                <input
                  type="text"
                  value={customGoonForm.name}
                  onChange={(e) => setCustomGoonForm({ ...customGoonForm, name: e.target.value })}
                  className="w-full bg-[#080a10] border border-[#23293c] text-white p-2 rounded focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] block">Puntos de Vida (HP)</label>
                <input
                  type="number"
                  value={customGoonForm.hp}
                  onChange={(e) => setCustomGoonForm({ ...customGoonForm, hp: parseInt(e.target.value) || 20 })}
                  className="w-full bg-[#080a10] border border-[#23293c] text-white p-2 rounded focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] block">Blindaje SP</label>
                <input
                  type="number"
                  value={customGoonForm.sp}
                  onChange={(e) => setCustomGoonForm({ ...customGoonForm, sp: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#080a10] border border-[#23293c] text-white p-2 rounded focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] block">Base Ataque (+)</label>
                <input
                  type="number"
                  value={customGoonForm.atkBase}
                  onChange={(e) => setCustomGoonForm({ ...customGoonForm, atkBase: parseInt(e.target.value) || 10 })}
                  className="w-full bg-[#080a10] border border-[#23293c] text-white p-2 rounded focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] block">Fórmula Daño (ej. 3d6)</label>
                <input
                  type="text"
                  value={customGoonForm.damageDice}
                  onChange={(e) => setCustomGoonForm({ ...customGoonForm, damageDice: e.target.value })}
                  className="w-full bg-[#080a10] border border-[#23293c] text-white p-2 rounded focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[#94a3b8] block">Notas / Armamento</label>
                <input
                  type="text"
                  value={customGoonForm.notes}
                  onChange={(e) => setCustomGoonForm({ ...customGoonForm, notes: e.target.value })}
                  className="w-full bg-[#080a10] border border-[#23293c] text-white p-2 rounded focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1f2638]">
              <button
                onClick={() => setIsAddingCustomGoon(false)}
                className="px-4 py-2 bg-[#1b202e] text-[#94a3b8] hover:text-white font-tech text-xs font-bold uppercase rounded-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCustomGoon}
                className="px-4 py-2 bg-[#38bdf8] hover:bg-white text-black font-tech font-bold text-xs uppercase rounded-xs cursor-pointer"
              >
                Spawnear Goon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. GM LOOT GENERATOR // 6 TABLAS CANÓNICAS DE BOTÍN (TIRADA 1d10) */}
      {/* ========================================================================= */}
      <div className="chamfer-card p-4 bg-[#0e1017] border border-[#202538] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b2030]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#f59e0b]/20 border border-[#f59e0b] rounded-xs text-[#f59e0b]">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                GENERADOR DE BOTÍN TÁCTICO // 6 TABLAS 1d10
              </h2>
              <p className="text-[11px] font-mono-code text-slate-400">
                Tablas canónicas: Chatarra callejera, alijos de armas, ciberware, datos corporativos, contrabando y drogas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRollLoot}
              className="px-4 py-2 bg-[#f59e0b] hover:bg-white text-black font-tech font-black text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
            >
              <Dices className="w-4 h-4" />
              <span>🎲 TIRAR BOTÍN (1d10)</span>
            </button>
          </div>
        </div>

        {/* Table Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {GM_LOOT_TABLES.map((table) => {
            const isSelected = selectedLootTableId === table.id;
            return (
              <button
                key={table.id}
                onClick={() => setSelectedLootTableId(table.id)}
                className={`p-2.5 text-left rounded-xs border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1e1724] border-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                    : 'bg-[#10131e] border-[#1f2436] hover:bg-[#161a29]'
                }`}
              >
                <span className={`text-[10px] font-mono-code font-bold line-clamp-2 ${isSelected ? 'text-[#f59e0b]' : 'text-slate-300'}`}>
                  {table.name}
                </span>
                <span className="text-[9px] font-mono-code text-slate-500 mt-1 block">
                  10 entradas
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Rolled Result Banner */}
        {rolledLoot && (
          <div className="p-3.5 bg-[#17141f] border-2 border-[#f59e0b] rounded-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-tech text-xs font-bold text-[#f59e0b] uppercase bg-[#f59e0b]/20 px-2 py-0.5 rounded border border-[#f59e0b]/40">
                  TIRADA 1d10: #{rolledLoot.roll}
                </span>
                <span className="text-[11px] font-mono-code text-slate-400">
                  {rolledLoot.tableName}
                </span>
              </div>
              <span className="text-sm font-tech font-black text-[#00f5d4]">
                Valor: {rolledLoot.value}
              </span>
            </div>

            <div className="p-3 bg-[#0c0e16] border border-[#23293c] rounded-xs flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="font-tech text-base font-bold text-white">
                  {rolledLoot.item}
                </h4>
                {rolledLoot.notes && (
                  <p className="text-[11px] font-mono-code text-amber-300">
                    ⚠ {rolledLoot.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAwardLootValue}
                  className="px-3 py-1.5 bg-[#00f5d4] hover:bg-white text-black font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                  title="Dividir el valor en Eurodólares entre los personajes del Roster"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>+ ASIGNAR A GRUPO</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${rolledLoot.item} (Valor: ${rolledLoot.value})`);
                    showFeedback('Botín copiado al portapapeles.');
                  }}
                  className="px-2.5 py-1.5 bg-[#1a2030] hover:bg-[#28324a] text-slate-300 hover:text-white font-mono-code text-xs rounded-xs border border-[#2b374e] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selected Table Full 10 Entries Grid */}
        {(() => {
          const currentTable = GM_LOOT_TABLES.find((t) => t.id === selectedLootTableId) || GM_LOOT_TABLES[0];
          return (
            <div className="space-y-1.5 pt-1 border-t border-[#1a1f2e]">
              <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span>Tabla Activa: <strong className="text-white">{currentTable.name}</strong></span>
                <span>{currentTable.description}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {currentTable.entries.map((entry) => {
                  const isHit = rolledLoot && rolledLoot.tableId === currentTable.id && rolledLoot.roll === entry.roll;
                  return (
                    <div
                      key={entry.roll}
                      className={`p-2 rounded-xs border text-xs font-mono-code flex items-center justify-between gap-2 transition-colors ${
                        isHit
                          ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-white shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                          : 'bg-[#10131e] border-[#1e2334] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={`w-6 h-6 flex items-center justify-center font-tech font-bold rounded text-xs flex-shrink-0 ${
                          isHit ? 'bg-[#f59e0b] text-black' : 'bg-[#171b26] text-slate-400 border border-[#222738]'
                        }`}>
                          {entry.roll}
                        </span>
                        <span className="truncate">{entry.item}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#f59e0b] whitespace-nowrap">
                        {entry.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ========================================================================= */}
      {/* 6. SECRET SCENE NOTES // NOTAS SECRETAS DEL GM CON AUTO-GUARDADO */}
      {/* ========================================================================= */}
      <div className="chamfer-card p-4 bg-[#0e1017] border border-[#202538] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1b2030]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#38bdf8]" />
            <div>
              <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                SECRET SCENE NOTES // CUADERNO DE CAMPAÑA GM
              </h2>
              <p className="text-[10px] font-mono-code text-slate-400">
                Registro privado local sin spoilers para jugadores • Auto-guardado en tiempo real
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={handleInsertTimestamp}
              className="px-2.5 py-1 bg-[#151c2a] hover:bg-[#38bdf8] text-[#38bdf8] hover:text-black border border-[#24334a] font-mono-code text-[11px] font-bold rounded-xs transition-colors cursor-pointer flex items-center gap-1"
              title="Insertar hora actual [HH:MM]"
            >
              <Clock className="w-3 h-3" />
              <span>Timestamp</span>
            </button>
            <button
              onClick={() => handleInsertTemplate('scene')}
              className="px-2.5 py-1 bg-[#151c2a] hover:bg-[#10b981] text-[#10b981] hover:text-black border border-[#1e3a2f] font-mono-code text-[11px] font-bold rounded-xs transition-colors cursor-pointer"
            >
              + Escena
            </button>
            <button
              onClick={() => handleInsertTemplate('clues')}
              className="px-2.5 py-1 bg-[#151c2a] hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black border border-[#3d2e1c] font-mono-code text-[11px] font-bold rounded-xs transition-colors cursor-pointer"
            >
              + Pistas
            </button>
            <button
              onClick={() => handleInsertTemplate('combat')}
              className="px-2.5 py-1 bg-[#151c2a] hover:bg-[#ef4444] text-[#ef4444] hover:text-white border border-[#3d1c1c] font-mono-code text-[11px] font-bold rounded-xs transition-colors cursor-pointer"
            >
              + Bajas
            </button>
            <button
              onClick={handleCopyNotes}
              className="px-2.5 py-1 bg-[#1c2232] hover:bg-white text-slate-300 hover:text-black border border-[#2b354d] font-mono-code text-[11px] rounded-xs cursor-pointer flex items-center gap-1"
              title="Copiar texto de notas"
            >
              <Copy className="w-3 h-3" />
              <span>Copiar</span>
            </button>
            {secretNotes && (
              <button
                onClick={handleClearNotes}
                className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                title="Limpiar notas"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <textarea
            rows={8}
            value={secretNotes}
            onChange={(e) => setSecretNotes(e.target.value)}
            placeholder="Escribe notas secretas de la sesión, pistas descubiertas por los jugadores, números de teléfono de Fixers, contraseñas de terminales o recompensas pendientes..."
            className="w-full bg-[#08090f] border border-[#22293c] focus:border-[#38bdf8] text-slate-200 font-mono-code text-xs p-3 rounded-xs focus:outline-none leading-relaxed resize-y"
          />
          <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-500 pt-0.5">
            <span>{secretNotes.length} caracteres • {secretNotes.split(/\s+/).filter(Boolean).length} palabras</span>
            <span className="text-emerald-500 flex items-center gap-1">
              <Check className="w-3 h-3" /> Guardado automáticamente en navegador
            </span>
          </div>
        </div>
      </div>

      {/* 7. BIBLIOTECA MASIVA DE ENEMIGOS, GOONS Y JEFES (15 FACCIONES & 128 FICHAS) */}
      <EnemiesCompendiumPanel onSpawnToInitiative={handleAddGoonFromSheet} />
    </div>
  );
}
