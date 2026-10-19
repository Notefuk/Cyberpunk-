import React, { useState, useMemo } from 'react';
import {
  Train,
  Shield,
  Zap,
  Terminal,
  AlertTriangle,
  Eye,
  EyeOff,
  RotateCcw,
  Users,
  Dices,
  BookOpen,
  Lock,
  Unlock,
  Package,
  DollarSign,
  Skull,
  Maximize2,
  X,
  FileText,
  Sparkles,
  Award
} from 'lucide-react';
import { useCharacterStore, buildCemk2077Characters } from '../../store/useCharacterStore';
import {
  CEMK_FOLIO_PREMADE_CHARACTERS,
  CEMK_FOLIO_METADATA_MAP
} from '../../data/cemkFolioPremadesData';
import {
  RED_CHROME_SCREAMSHEET,
  RED_CHROME_BRIEFING,
  RED_CHROME_SKILL_CHECKS,
  HAMMERHEAD_MAINFRAME_NET,
  RED_CHROME_ENEMY_PROFILES,
  HAMMERHEAD_TRAIN_CARS,
  INITIAL_TRAIN_TOKENS,
  HAMMERHEAD_MANIFEST_LOOT,
  HORNET_CRATES_LOOT,
  type RedChromeSkillCheck,
  type RedChromeLootItem
} from '../../data/redChromeCargoData';
import { QUICKHACKS_2077_CATALOG } from '../../data/netAndRolesData';

type RightColumnTab = 'enemies_loot' | 'mainframe_crates' | 'screamsheet_gm' | 'premade_edgerunners';

interface ActiveEnemyInstance {
  instanceId: string;
  templateKey: 'rcl_shotgun_guard' | 'rcl_officer' | 'hammerhead_turret';
  name: string;
  carId: 'rear' | 'middle' | 'front' | 'driver';
  currentHp: number;
  maxHp: number;
  headSp: number;
  bodySp: number;
  initiative: number | null;
  mode: '2077' | '2045';
}

const rollD10 = (): number => Math.floor(Math.random() * 10) + 1;
const rollD6 = (): number => Math.floor(Math.random() * 6) + 1;

export const RedChromeCargoView: React.FC = () => {
  const {
    characters,
    getActiveCharacter,
    setActiveCharacter,
    syncOrRestoreCemkFolioCharacters,
    loadCemk2077PartyRoster,
    gmPayAllCharacters,
    addEurodollarTransaction,
    purchaseOrAcquireItem
  } = useCharacterStore();

  const activeChar = getActiveCharacter();

  // ============================================================================
  // ESTADO GENERAL
  // ============================================================================
  const [rightTab, setRightTab] = useState<RightColumnTab>('enemies_loot');
  const [edgerunnerRosterTab, setEdgerunnerRosterTab] = useState<'cemk_folios' | 'anime_crew'>('cemk_folios');
  const [viewingDossierCharId, setViewingDossierCharId] = useState<string | null>(null);
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>('');
  const [skillStatFilter, setSkillStatFilter] = useState<string>('ALL');
  const [partySize, setPartySize] = useState<number>(4);
  const [conversionMode, setConversionMode] = useState<'2077' | '2045'>('2077');
  const [isTrainAlerted, setIsTrainAlerted] = useState<boolean>(false);
  const [isPlayerMode, setIsPlayerMode] = useState<boolean>(false);
  const [screamsheetLang, setScreamsheetLang] = useState<'es' | 'en'>('es');
  const [turretStatus, setTurretStatus] = useState<'offline' | 'hostile' | 'hacked'>('offline');
  const [selectedEnemyTab, setSelectedEnemyTab] = useState<'rcl_shotgun_guard' | 'rcl_officer' | 'hammerhead_turret'>('rcl_shotgun_guard');

  // Mapa: Vista de Imagen Oficial vs Grilla
  const [mapDisplayMode, setMapDisplayMode] = useState<'official_image' | 'interactive_grid'>('official_image');
  const [highlightedCarId, setHighlightedCarId] = useState<string>('rear');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Toast Feedback
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' } | null>(null);
  const showToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Última tirada de escena para el banner superior
  const [lastSkillCheckResult, setLastSkillCheckResult] = useState<{
    checkTitle: string;
    roll: number;
    d10: number;
    statName: string;
    statVal: number;
    skillVal: number;
    dv: number;
    success: boolean;
    text: string;
  } | null>(null);

  // Cantidades canónicas por mesa
  const rearGuardsCount = partySize >= 5 ? 3 : 2;
  const frontGuardsCount = Math.max(1, partySize - 1);
  const totalGuardsCount = rearGuardsCount + frontGuardsCount;

  // ============================================================================
  // TRACKER DE ENEMIGOS ACTIVOS EN COMBATE
  // ============================================================================
  const [activeEnemies, setActiveEnemies] = useState<ActiveEnemyInstance[]>([]);
  const [activeQuickhackModal, setActiveQuickhackModal] = useState<string | null>(null);

  const handleSpawnRearCar = () => {
    const profile = RED_CHROME_ENEMY_PROFILES.rcl_shotgun_guard;
    const variant = conversionMode === '2077' ? profile.variant2077Cemk : profile.variant2045;
    const newEnemies: ActiveEnemyInstance[] = [];

    for (let i = 1; i <= rearGuardsCount; i++) {
      newEnemies.push({
        instanceId: `enemy-rear-${Date.now()}-${i}`,
        templateKey: 'rcl_shotgun_guard',
        name: `RCL Guardia #${i} (Vagón Trasero)`,
        carId: 'rear',
        currentHp: variant.hp,
        maxHp: variant.hp,
        headSp: variant.headSp,
        bodySp: variant.bodySp,
        initiative: null,
        mode: conversionMode
      });
    }

    setActiveEnemies(prev => [...prev.filter(e => e.carId !== 'rear'), ...newEnemies]);
    showToast(`⚔️ Desplegados ${rearGuardsCount} guardias en el Vagón Trasero.`, 'info');
  };

  const handleSpawnFrontCar = () => {
    const guardProfile = RED_CHROME_ENEMY_PROFILES.rcl_shotgun_guard;
    const officerProfile = RED_CHROME_ENEMY_PROFILES.rcl_officer;
    const turretProfile = RED_CHROME_ENEMY_PROFILES.hammerhead_turret;

    const guardVariant = conversionMode === '2077' ? guardProfile.variant2077Cemk : guardProfile.variant2045;
    const officerVariant = conversionMode === '2077' ? officerProfile.variant2077Cemk : officerProfile.variant2045;
    const turretVariant = turretProfile.variant2045;

    const newEnemies: ActiveEnemyInstance[] = [];

    for (let i = 1; i <= frontGuardsCount; i++) {
      newEnemies.push({
        instanceId: `enemy-front-guard-${Date.now()}-${i}`,
        templateKey: 'rcl_shotgun_guard',
        name: `RCL Escolta #${i} (Vagón Delantero)`,
        carId: 'front',
        currentHp: guardVariant.hp,
        maxHp: guardVariant.hp,
        headSp: guardVariant.headSp,
        bodySp: guardVariant.bodySp,
        initiative: null,
        mode: conversionMode
      });
    }

    newEnemies.push({
      instanceId: `enemy-front-officer-${Date.now()}`,
      templateKey: 'rcl_officer',
      name: `RCL Oficial Teniente (Masamune)`,
      carId: 'front',
      currentHp: officerVariant.hp,
      maxHp: officerVariant.hp,
      headSp: officerVariant.headSp,
      bodySp: officerVariant.bodySp,
      initiative: null,
      mode: conversionMode
    });

    newEnemies.push({
      instanceId: `enemy-front-turret-${Date.now()}`,
      templateKey: 'hammerhead_turret',
      name: `Torreta Militech Automated [⬢]`,
      carId: 'front',
      currentHp: turretVariant.hp,
      maxHp: turretVariant.hp,
      headSp: 0,
      bodySp: 0,
      initiative: null,
      mode: '2045'
    });

    setActiveEnemies(prev => [...prev.filter(e => e.carId !== 'front'), ...newEnemies]);
    showToast(`⚔️ Desplegados ${frontGuardsCount} Guardias + 1 Oficial + Torreta en el Vagón Delantero.`, 'info');
  };

  const handleSpawnAllTrain = () => {
    handleSpawnRearCar();
    handleSpawnFrontCar();
    showToast(`🔄 Desplegado todo el convoy Hammerhead (${totalGuardsCount} Guardias + Oficial + Torreta).`, 'success');
  };

  const handleResetEnemies = () => {
    setActiveEnemies([]);
    showToast('Limpieza de combate completada.', 'warn');
  };

  const handleEnemyHpDelta = (instId: string, delta: number) => {
    setActiveEnemies(prev => prev.map(e => {
      if (e.instanceId !== instId) return e;
      const nextHp = Math.max(0, Math.min(e.maxHp, e.currentHp + delta));
      return { ...e, currentHp: nextHp };
    }));
  };

  const handleEnemySpAblate = (instId: string, loc: 'head' | 'body', delta: number) => {
    setActiveEnemies(prev => prev.map(e => {
      if (e.instanceId !== instId) return e;
      if (loc === 'head') return { ...e, headSp: Math.max(0, e.headSp + delta) };
      return { ...e, bodySp: Math.max(0, e.bodySp + delta) };
    }));
  };

  const handleEnemyRollInitiative = (instId: string) => {
    const enemy = activeEnemies.find(e => e.instanceId === instId);
    if (!enemy) return;
    const profile = RED_CHROME_ENEMY_PROFILES[enemy.templateKey];
    const variant = enemy.mode === '2077' ? profile.variant2077Cemk : profile.variant2045;
    const ref = variant.stats.REF || 6;
    const bonus = enemy.templateKey === 'rcl_officer' ? 2 : 0; // Kerenzikov
    const d10 = rollD10();
    const total = d10 + ref + bonus;

    setActiveEnemies(prev => prev.map(e => e.instanceId === instId ? { ...e, initiative: total } : e));
    showToast(`🎲 Iniciativa ${enemy.name}: 1d10(${d10}) + REF(${ref})${bonus ? '+2' : ''} = ${total}`, 'info');
  };

  // ============================================================================
  // EJECUCIÓN DE TIRADAS DE HABILIDAD (6 CHECKS)
  // ============================================================================
  const [selectedRollerCharId, setSelectedRollerCharId] = useState<string>(activeChar.id);
  const rollerChar = useMemo(() => {
    return characters.find(c => c.id === selectedRollerCharId) || activeChar;
  }, [characters, selectedRollerCharId, activeChar]);

  const handleExecuteSkillCheck = (check: RedChromeSkillCheck) => {
    const d10 = rollD10();
    const isExplode = d10 === 10;
    const isFumble = d10 === 1;
    const extraDie = isExplode ? rollD10() : isFumble ? rollD10() : 0;

    const statVal = rollerChar.stats[check.stat] || 5;
    let skillVal = 0;
    const skillLower = check.skill.toLowerCase();
    if (skillLower.includes('athletics')) skillVal = rollerChar.skills.athletics || 2;
    else if (skillLower.includes('basic tech')) skillVal = (rollerChar.generalSkills && rollerChar.generalSkills['Basic Tech']) || 3;
    else if (skillLower.includes('stealth')) skillVal = (rollerChar.generalSkills && rollerChar.generalSkills['Stealth']) || 3;
    else if (skillLower.includes('drive')) skillVal = (rollerChar.generalSkills && rollerChar.generalSkills['Drive Land Vehicle']) || 3;
    else skillVal = 3;

    const baseTotal = d10 + (isExplode ? extraDie : 0) - (isFumble ? extraDie : 0);
    const totalRoll = baseTotal + statVal + skillVal;
    const success = totalRoll >= check.dv;

    let textMessage = success ? check.successDesc : check.failureDesc;

    if (check.id === 'jump_train' && !success) {
      setIsTrainAlerted(true);
      setTurretStatus('hostile');
      textMessage += ' 🚨 ¡ALARMA GENERAL! La torreta se ha encendido en modo HOSTIL.';
    }

    setLastSkillCheckResult({
      checkTitle: check.title,
      roll: totalRoll,
      d10,
      statName: check.stat,
      statVal,
      skillVal,
      dv: check.dv,
      success,
      text: textMessage
    });

    showToast(
      success ? `¡ÉXITO! ${rollerChar.handle} superó DV ${check.dv} con ${totalRoll}.` : `FALLO: ${rollerChar.handle} sacó ${totalRoll} vs DV ${check.dv}.`,
      success ? 'success' : 'warn'
    );
  };

  // ============================================================================
  // TOKENS EN LA GRILLA ESQUEMÁTICA
  // ============================================================================
  const tokenPositions: Record<string, 'rear' | 'middle' | 'front' | 'driver'> = {
    'token-hatch': 'rear',
    'token-net-port': 'middle',
    'token-cargo-crates': 'middle',
    'token-turret-control': 'front',
    'token-turret': 'front',
    'token-train-control': 'driver'
  };

  const [pcLocations, setPcLocations] = useState<Record<string, 'rear' | 'middle' | 'front' | 'driver'>>(() => {
    const locs: Record<string, 'rear' | 'middle' | 'front' | 'driver'> = {};
    characters.forEach(c => {
      locs[c.id] = 'rear';
    });
    return locs;
  });

  const handleMovePc = (pcId: string, car: 'rear' | 'middle' | 'front' | 'driver') => {
    setPcLocations(prev => ({ ...prev, [pcId]: car }));
    const char = characters.find(c => c.id === pcId);
    showToast(`🏃 ${char?.handle || 'Operativo'} movido a: ${car.toUpperCase()}`, 'info');
  };

  // ============================================================================
  // MAINFRAME NET (5 PISOS)
  // ============================================================================
  const [mainframeProgress, setMainframeProgress] = useState<{
    unlockedFloors: number[];
    hellhoundRez: number;
    manifestRevealed: boolean;
    netActionLog: string[];
  }>({
    unlockedFloors: [1],
    hellhoundRez: 20,
    manifestRevealed: false,
    netActionLog: ['[NET] Interfaz con cable físico (Interface Plugs) lista en Middle Car.']
  });

  const handleNetAction = (floorNumber: number, actionType: 'backdoor' | 'eye_dee' | 'zap' | 'hellhound_atk' | 'control') => {
    const d10 = rollD10();
    const interfaceRank = activeChar.roleRank || 4;
    const totalRoll = d10 + interfaceRank;

    if (actionType === 'backdoor') {
      const dv = floorNumber === 1 ? 6 : 8;
      const pass = totalRoll >= dv;
      setMainframeProgress(prev => ({
        ...prev,
        unlockedFloors: pass ? [...new Set([...prev.unlockedFloors, floorNumber])] : prev.unlockedFloors,
        netActionLog: [
          `[Piso ${floorNumber}] Backdoor vs DV ${dv}: 1d10 (${d10}) + Interface (${interfaceRank}) = ${totalRoll}. ${pass ? '¡ACCESO CONCEDIDO!' : 'ACCESO DENEGADO.'}`,
          ...prev.netActionLog
        ]
      }));
      showToast(pass ? `✅ Piso ${floorNumber} hackeado con éxito.` : `❌ Fallo en Piso ${floorNumber}.`, pass ? 'success' : 'warn');
    } else if (actionType === 'eye_dee') {
      const pass = totalRoll >= 8;
      setMainframeProgress(prev => ({
        ...prev,
        manifestRevealed: pass ? true : prev.manifestRevealed,
        unlockedFloors: pass ? [...new Set([...prev.unlockedFloors, floorNumber])] : prev.unlockedFloors,
        netActionLog: [
          `[Piso 2] Eye-Dee en Manifiesto: ${totalRoll} vs DV 8. ${pass ? '¡MANIFIESTO DESCIFRADO!' : 'Cifrado denegado.'}`,
          ...prev.netActionLog
        ]
      }));
      showToast(pass ? '📜 Manifiesto militar de Militech descifrado.' : 'Fallo al descifrar archivo.', pass ? 'success' : 'warn');
    } else if (actionType === 'zap') {
      const zapDamage = rollD6() + rollD6();
      const nextRez = Math.max(0, mainframeProgress.hellhoundRez - zapDamage);
      const isDefeated = nextRez === 0;

      setMainframeProgress(prev => ({
        ...prev,
        hellhoundRez: nextRez,
        unlockedFloors: isDefeated ? [...new Set([...prev.unlockedFloors, 4])] : prev.unlockedFloors,
        netActionLog: [
          `[Piso 4] Zap Netrunner causa ${zapDamage} daño. REZ Hellhound: ${nextRez}/20.${isDefeated ? ' ¡HELLHOUND DESTRUIDO!' : ''}`,
          ...prev.netActionLog
        ]
      }));
      showToast(isDefeated ? '💥 ¡Black ICE Hellhound destruido!' : `⚡ Hellhound recibió ${zapDamage} daño.`, 'info');
    } else if (actionType === 'hellhound_atk') {
      const hellRoll = rollD10() + 6;
      const directBrainDmg = rollD6() + rollD6();
      setMainframeProgress(prev => ({
        ...prev,
        netActionLog: [
          `[Piso 4] Hellhound ataca: ${hellRoll} vs DEF Netrunner. Inflige ${directBrainDmg} DAÑO DIRECTO CEREBRAL + Fuego (2/turno).`,
          ...prev.netActionLog
        ]
      }));
      showToast(`🔥 Ataque Hellhound: ${hellRoll} (Daño cerebral: ${directBrainDmg}).`, 'warn');
    } else if (actionType === 'control') {
      const pass = totalRoll >= 8;
      if (pass) {
        setTurretStatus('hacked');
        setMainframeProgress(prev => ({
          ...prev,
          unlockedFloors: [...new Set([...prev.unlockedFloors, 5])],
          netActionLog: [
            `[Piso 5] Control Node vs DV 8: ${totalRoll}. ¡TORRETA HACKEADA! Controlada por el Netrunner.`,
            ...prev.netActionLog
          ]
        }));
        showToast('🟢 ¡TORRETA DELANTERA HACKEADA! Dispara a los guardias de la Legion.', 'success');
      } else {
        setMainframeProgress(prev => ({
          ...prev,
          netActionLog: [
            `[Piso 5] Control Node vs DV 8: ${totalRoll}. Fallo en el comando del nodo.`,
            ...prev.netActionLog
          ]
        }));
        showToast('Fallo al controlar el nodo de la torreta.', 'warn');
      }
    }
  };

  // ============================================================================
  // CAJAS DE HORNET & SAQUEO DE BOTÍN
  // ============================================================================
  const [crateCarriers, setCrateCarriers] = useState<Record<number, string | null>>({
    1: null,
    2: null,
    3: null,
    4: null
  });
  const [securedCrates, setSecuredCrates] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false
  });
  const [isMissionFinished, setIsMissionFinished] = useState<boolean>(false);

  const handleLootItemToActivePlayer = (loot: RedChromeLootItem) => {
    if (loot.category === 'eb') {
      addEurodollarTransaction(`Botín de Escena: ${loot.name}`, loot.valueEb);
      showToast(`💰 +${loot.valueEb} €$ acreditados a ${activeChar.handle}.`, 'success');
    } else {
      purchaseOrAcquireItem({
        item: {
          id: loot.id,
          name: loot.name,
          category: loot.category,
          cost: loot.valueEb,
          description: loot.description,
          quantity: loot.quantity || 1
        },
        category: (loot.category as any) || 'gear',
        spendMoney: false
      });
      showToast(`🎒 "${loot.name}" añadido al inventario de ${activeChar.handle}.`, 'success');
    }
  };

  const handleCompleteMissionHornet = () => {
    gmPayAllCharacters(2000, 'Recompensa Fixer Hornet — Red Chrome Cargo');
    setIsMissionFinished(true);
    showToast('💰 ¡MISIÓN CUMPLIDA! +2,000 €$ entregados a cada miembro de la party.', 'success');
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16 font-sans">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xs font-mono-code text-xs font-bold border transition-all flex items-center justify-between shadow-2xl ${
          feedbackToast.type === 'success'
            ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
            : feedbackToast.type === 'warn'
            ? 'bg-red-950/95 border-red-500 text-red-200'
            : 'bg-cyan-950/95 border-cyan-500 text-cyan-200'
        }`}>
          <span>{feedbackToast.message}</span>
          <button onClick={() => setFeedbackToast(null)} className="text-white hover:opacity-75 cursor-pointer ml-3">✕</button>
        </div>
      )}

      {/* Modal de Imagen Pantalla Completa */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute -top-10 right-0 text-white font-mono-code text-sm font-bold flex items-center gap-1 hover:text-red-400 cursor-pointer"
            >
              <X className="w-5 h-5" /> Cerrar
            </button>
            <img
              src={fullscreenImage}
              alt="Vista previa ampliada"
              className="max-h-[85vh] w-auto object-contain rounded border border-cyan-500/50 shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* ========================================================================
          BARRA SUPERIOR COMPACTA
      ======================================================================== */}
      <div className="bg-[#0b0e17] border border-[#1e2436] p-3.5 rounded-xs shadow-2xl space-y-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xs bg-red-600/20 border border-red-500 flex items-center justify-center text-red-500 shrink-0">
              <Train className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="bg-red-600 text-white font-tech font-black text-[9px] px-1.5 py-0.5 rounded-2xs uppercase tracking-widest">
                  CAMPAÑA OFICIAL
                </span>
                <span className="text-[11px] font-mono-code text-slate-400">CPRED Screamsheet</span>
              </div>
              <h1 className="font-tech text-lg font-black text-white tracking-wider uppercase leading-none mt-0.5">
                RED CHROME CARGO // PANEL DE CAMPAÑA (CEMK 2077)
              </h1>
            </div>
          </div>

          {/* Controles de Mesa en Fila */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Selector de Jugadores */}
            <div className="flex items-center gap-1.5 bg-[#121622] border border-[#232a3e] px-2 py-1 rounded-xs">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-mono-code text-slate-400">PJs:</span>
              <select
                value={partySize}
                onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
                className="bg-[#0b0e17] text-white font-mono-code text-xs font-bold border border-[#2c364e] rounded px-1 cursor-pointer"
              >
                {[2, 3, 4, 5, 6, 7].map(n => (
                  <option key={n} value={n}>{n} Jugadores</option>
                ))}
              </select>
            </div>

            {/* Toggle 2077 vs 2045 */}
            <button
              onClick={() => setConversionMode(conversionMode === '2077' ? '2045' : '2077')}
              className={`px-2.5 py-1 rounded-xs font-mono-code text-xs font-bold transition-all cursor-pointer border ${
                conversionMode === '2077'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-red-500/20 border-red-500 text-red-300'
              }`}
            >
              {conversionMode === '2077' ? '⚡ 2077 CEMK' : '📕 2045 Original'}
            </button>

            {/* Toggle Alerta */}
            <button
              onClick={() => {
                const nextAlert = !isTrainAlerted;
                setIsTrainAlerted(nextAlert);
                if (nextAlert) setTurretStatus('hostile');
              }}
              className={`px-2.5 py-1 rounded-xs font-mono-code text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                isTrainAlerted
                  ? 'bg-red-600/30 border-red-500 text-red-200 animate-pulse'
                  : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
              }`}
            >
              {isTrainAlerted ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> : <Shield className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isTrainAlerted ? '🚨 Alerta' : '🟢 Sigilo'}</span>
            </button>

            {/* Botón Cargar 7 PJs CEMK */}
            <button
              onClick={() => {
                loadCemk2077PartyRoster();
                showToast('👥 Los 7 Edgerunners de CEMK 2077 cargados con éxito.', 'success');
              }}
              className="px-2.5 py-1 bg-[#141b29] hover:bg-[#1f2a40] text-cyan-300 border border-cyan-800/80 rounded-xs font-mono-code text-xs font-bold transition-all cursor-pointer"
            >
              👥 Cargar 7 PJs CEMK
            </button>

            {/* Ver Screamsheet / Modo Jugadores */}
            <button
              onClick={() => {
                setIsPlayerMode(!isPlayerMode);
                setRightTab('screamsheet_gm');
              }}
              className={`px-2.5 py-1 rounded-xs font-mono-code text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                isPlayerMode
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-[#181d2a] border-[#29354d] text-slate-300 hover:text-white'
              }`}
            >
              {isPlayerMode ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPlayerMode ? 'Modo Jugadores' : 'Screamsheet / GM'}</span>
            </button>
          </div>
        </div>

        {/* Banner Compacto de 1 Línea con la Última Tirada de Escena */}
        {lastSkillCheckResult ? (
          <div className={`p-1.5 px-3 rounded-xs border text-xs font-mono-code flex items-center justify-between transition-all ${
            lastSkillCheckResult.success
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
              : 'bg-red-950/70 border-red-500 text-red-200'
          }`}>
            <div className="flex items-center gap-2 truncate">
              <strong>🎲 {lastSkillCheckResult.checkTitle}:</strong>
              <span>
                1d10({lastSkillCheckResult.d10}) + {lastSkillCheckResult.statName}({lastSkillCheckResult.statVal}) + Skill({lastSkillCheckResult.skillVal}) = <strong>{lastSkillCheckResult.roll}</strong> vs DV {lastSkillCheckResult.dv} ➔ {lastSkillCheckResult.success ? '¡ÉXITO!' : 'FALLO.'}
              </span>
              <span className="text-[11px] opacity-80 truncate hidden md:inline">
                ({lastSkillCheckResult.text})
              </span>
            </div>
            <button
              onClick={() => setLastSkillCheckResult(null)}
              className="text-white/60 hover:text-white ml-2 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="p-1 px-3 bg-[#0d1017] border border-[#1b2234] rounded-xs text-[10px] font-mono-code text-[#64748b] flex items-center justify-between">
            <span>Operativo Activo en Mesa: <strong className="text-white">{activeChar.handle}</strong> ({activeChar.role} Rango {activeChar.roleRank || 4})</span>
            <span>Escalado activo: {rearGuardsCount} Trasero + {frontGuardsCount} Delantero = {totalGuardsCount} Guardias</span>
          </div>
        )}
      </div>

      {/* ========================================================================
          ESTRUCTURA FIJA DE 2 COLUMNAS (12 COLS: 5 IZQ / 7 DER)
      ======================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

        {/* ====================================================================
            COLUMNA IZQUIERDA (5 COLS) — MAPA DEL TREN + GUÍA DE VAGONES & DVs
        ==================================================================== */}
        <div className="xl:col-span-5 space-y-3.5">

          {/* 1. PANEL DEL MAPA THE HAMMERHEAD CARGO TRAIN (SIEMPRE VISIBLE) */}
          <div className="bg-[#0b0e17] border border-[#1f2638] p-3.5 rounded-xs space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-cyan-400" />
                <h2 className="font-tech text-sm font-black text-white uppercase tracking-wider">
                  THE HAMMERHEAD CARGO TRAIN
                </h2>
              </div>
              <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                PÁGINA 4 OFICIAL
              </span>
            </div>

            {/* Selector de Vista del Mapa (Oficial vs Grilla) */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setMapDisplayMode('official_image')}
                className={`py-1 text-xs font-mono-code font-bold rounded-xs transition-all cursor-pointer border ${
                  mapDisplayMode === 'official_image'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                    : 'bg-[#121622] text-[#94a3b8] border-[#1f2638] hover:text-white'
                }`}
              >
                🗺️ MAPA OFICIAL PDF
              </button>
              <button
                onClick={() => setMapDisplayMode('interactive_grid')}
                className={`py-1 text-xs font-mono-code font-bold rounded-xs transition-all cursor-pointer border ${
                  mapDisplayMode === 'interactive_grid'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                    : 'bg-[#121622] text-[#94a3b8] border-[#1f2638] hover:text-white'
                }`}
              >
                🎯 GRILLA INTERACTIVA
              </button>
            </div>

            {/* VISTA A: MAPA OFICIAL DEL PDF (./hammerhead-map.png) */}
            {mapDisplayMode === 'official_image' ? (
              <div className="space-y-2">
                <div className="relative group bg-[#07090e] border border-cyan-950 rounded overflow-hidden flex items-center justify-center p-1">
                  <img
                    src="./hammerhead-map.png"
                    alt="Plano Táctico Oficial The Hammerhead"
                    className="max-h-[380px] w-auto object-contain rounded transition-transform group-hover:scale-[1.01]"
                  />
                  <button
                    onClick={() => setFullscreenImage('./hammerhead-map.png')}
                    className="absolute top-2 right-2 bg-black/80 hover:bg-cyan-600 text-white p-1.5 rounded border border-cyan-500/50 transition-all cursor-pointer"
                    title="Ampliar a pantalla completa"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4 Botones Selectores Rápidos de Vagones */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                  {[
                    { id: 'rear', num: '1', label: 'Rear Car' },
                    { id: 'middle', num: '2', label: 'Middle Car' },
                    { id: 'front', num: '3', label: 'Front Car' },
                    { id: 'driver', num: '4', label: 'Driver Car' }
                  ].map(car => (
                    <button
                      key={car.id}
                      onClick={() => setHighlightedCarId(car.id)}
                      className={`py-1 px-1.5 text-[10px] font-mono-code font-bold rounded-xs transition-all cursor-pointer border truncate ${
                        highlightedCarId === car.id
                          ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                          : 'bg-[#121624] border-[#1d2538] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {car.num}. {car.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* VISTA B: GRILLA ESQUEMÁTICA CON TOKENS */
              <div className="space-y-2 bg-[#07090f] p-2.5 rounded border border-[#1b2234] max-h-[420px] overflow-y-auto">
                {HAMMERHEAD_TRAIN_CARS.map(car => {
                  const pcsInCar = characters.filter(c => pcLocations[c.id] === car.carId);
                  const isSel = highlightedCarId === car.carId;

                  return (
                    <div
                      key={car.carId}
                      onClick={() => setHighlightedCarId(car.carId)}
                      className={`p-2 rounded border cursor-pointer transition-all ${
                        isSel
                          ? 'bg-[#151c2d] border-cyan-400 shadow-md shadow-cyan-950'
                          : 'bg-[#0f131f] border-[#1e273c] hover:border-[#2a3754]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-tech text-white border-b border-[#1b2336] pb-1 mb-1 font-bold uppercase">
                        <span>{car.name}</span>
                        <span className="text-[9px] font-mono-code text-slate-400">
                          {car.carId === 'rear' && `${rearGuardsCount} Guardias`}
                          {car.carId === 'middle' && 'Sin Guardias (NET)'}
                          {car.carId === 'front' && `${frontGuardsCount}G + 1 Oficial + Torreta`}
                          {car.carId === 'driver' && 'Locomotora'}
                        </span>
                      </div>

                      {/* Tokens fijos del vagón */}
                      <div className="flex flex-wrap items-center gap-1">
                        {INITIAL_TRAIN_TOKENS.filter(t => tokenPositions[t.id] === car.carId).map(t => (
                          <span
                            key={t.id}
                            className="px-1.5 py-0.2 rounded text-[9px] font-mono-code font-bold border"
                            style={{ borderColor: t.color, color: t.color, backgroundColor: `${t.color}15` }}
                          >
                            {t.symbol} {t.name}
                          </span>
                        ))}

                        {/* PJs */}
                        {pcsInCar.map(p => (
                          <span
                            key={p.id}
                            className="px-1.5 py-0.2 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded text-[9px] font-mono-code font-bold"
                          >
                            👤 {p.handle.split(' ')[0]}
                          </span>
                        ))}
                      </div>

                      {/* Mover PJs */}
                      <div className="flex items-center gap-1 mt-1 pt-1 border-t border-[#182030] text-[9px] font-mono-code text-[#64748b]">
                        <span>Mover aquí:</span>
                        {characters.map(p => (
                          <button
                            key={p.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMovePc(p.id, car.carId as any);
                            }}
                            className={`px-1 py-0.2 rounded cursor-pointer ${
                              pcLocations[p.id] === car.carId ? 'bg-emerald-500 text-black font-black' : 'bg-[#182234] text-slate-300'
                            }`}
                          >
                            {p.handle.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. DESGLOSE RÁPIDO DE LOS 4 VAGONES (TARJETAS COMPACTAS) */}
          <div className="space-y-2">
            {/* Vagón 1: REAR CAR */}
            <div className={`p-2.5 rounded-xs border text-xs font-mono-code transition-all ${
              highlightedCarId === 'rear' ? 'bg-[#151c2d] border-cyan-400' : 'bg-[#0e111a] border-[#1b2234]'
            }`}>
              <div className="flex items-center justify-between border-b border-[#1b2336] pb-1 mb-1">
                <span className="font-tech text-xs font-black text-cyan-300 uppercase">
                  1. REAR CAR (Vagón Trasero de Acceso)
                </span>
                <span className="text-[10px] text-red-400 font-bold bg-red-950/80 px-1.5 rounded">
                  {rearGuardsCount} Guardias RCL
                </span>
              </div>
              <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                Entrada superior por <strong>Escotilla [▼] (DV 13 Basic Tech)</strong>. 4 bloques de contenedores altos rayados (cobertura <strong>SP 13 / 30 HP</strong>) que permiten sigilo tras contenedores (<strong>DV 10 Stealth</strong>).
              </p>
            </div>

            {/* Vagón 2: MIDDLE CAR */}
            <div className={`p-2.5 rounded-xs border text-xs font-mono-code transition-all ${
              highlightedCarId === 'middle' ? 'bg-[#151c2d] border-cyan-400' : 'bg-[#0e111a] border-[#1b2234]'
            }`}>
              <div className="flex items-center justify-between border-b border-[#1b2336] pb-1 mb-1">
                <span className="font-tech text-xs font-black text-cyan-300 uppercase">
                  2. MIDDLE CAR (Vagón Medio de Carga)
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 rounded">
                  Sin Guardias Fijos
                </span>
              </div>
              <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                2 contenedores de cobertura a la izquierda y el nodo <strong>[▲ Network Port]</strong> a la derecha: jack-in físico con interface plugs para hackear el <strong>Hammerhead Mainframe</strong> de 5 pisos.
              </p>
            </div>

            {/* Vagón 3: FRONT CAR */}
            <div className={`p-2.5 rounded-xs border text-xs font-mono-code transition-all ${
              highlightedCarId === 'front' ? 'bg-[#151c2d] border-cyan-400' : 'bg-[#0e111a] border-[#1b2234]'
            }`}>
              <div className="flex items-center justify-between border-b border-[#1b2336] pb-1 mb-1">
                <span className="font-tech text-xs font-black text-cyan-300 uppercase">
                  3. FRONT CAR (Vagón Delantero / Hornet)
                </span>
                <span className="text-[10px] text-red-400 font-bold bg-red-950/80 px-1.5 rounded">
                  {frontGuardsCount}G + 1 Oficial + 1 Torreta
                </span>
              </div>
              <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                Arriba izq: <strong>[★ Hornet's Cargo (4 Cajas ADN)]</strong>. Centro: <strong>[⬢ Torreta Automática]</strong> (+14 atk, 5d6 daño). Arriba der: <strong>[▣ Turret Control]</strong> para anulación manual.
              </p>
            </div>

            {/* Vagón 4: DRIVER CAR */}
            <div className={`p-2.5 rounded-xs border text-xs font-mono-code transition-all ${
              highlightedCarId === 'driver' ? 'bg-[#151c2d] border-cyan-400' : 'bg-[#0e111a] border-[#1b2234]'
            }`}>
              <div className="flex items-center justify-between border-b border-[#1b2336] pb-1 mb-1">
                <span className="font-tech text-xs font-black text-cyan-300 uppercase">
                  4. DRIVER'S CAR (Cabina del Conductor)
                </span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-1.5 rounded">
                  Consola de Frenado
                </span>
              </div>
              <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                Consola frontal <strong>[● Train Control]</strong>. Prueba <strong>DV 9 Drive Land Vehicle</strong> para acoplar los frenos neumáticos y detener por completo el convoy antes del pueblo fantasma.
              </p>
            </div>
          </div>

          {/* 3. BOTONERA RÁPIDA DE LAS 6 TIRADAS DE HABILIDAD (2×3 GRID) */}
          <div className="bg-[#0b0e17] border border-[#1f2638] p-3 rounded-xs space-y-2">
            <div className="flex items-center justify-between border-b border-[#1b2234] pb-1.5">
              <span className="font-tech text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Dices className="w-3.5 h-3.5" /> TIRADAS DE HABILIDAD DE LA ESCENA
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono-code text-slate-400">PJ:</span>
                <select
                  value={selectedRollerCharId}
                  onChange={(e) => setSelectedRollerCharId(e.target.value)}
                  className="bg-[#0e111a] text-cyan-300 font-mono-code text-[10px] font-bold border border-[#1e273c] rounded px-1 cursor-pointer"
                >
                  {characters.map(c => (
                    <option key={c.id} value={c.id}>{c.handle.split(' ')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {RED_CHROME_SKILL_CHECKS.map(check => (
                <button
                  key={check.id}
                  onClick={() => handleExecuteSkillCheck(check)}
                  className="bg-[#121624] hover:bg-[#1a2236] border border-[#1e273c] hover:border-amber-500/50 p-2 rounded text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-mono-code text-cyan-400 font-bold uppercase truncate max-w-[120px]">
                      {check.skill}
                    </span>
                    <span className="text-[9px] font-mono-code font-black text-amber-400 bg-amber-950/80 px-1 rounded">
                      DV {check.dv}
                    </span>
                  </div>
                  <span className="font-tech text-xs font-bold text-white leading-tight line-clamp-1">
                    {check.title.replace(' (Rear Car)', '').replace(' (Driver\'s Car)', '')}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ====================================================================
            COLUMNA DERECHA (7 COLS) — 3 PESTAÑAS ORDENADAS
        ==================================================================== */}
        <div className="xl:col-span-7 space-y-3.5">

          {/* BARRA DE LAS 4 PESTAÑAS PRINCIPALES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-[#0b0e17] p-1.5 rounded-xs border border-[#1f2638]">
            <button
              onClick={() => setRightTab('enemies_loot')}
              className={`py-2 px-2 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
                rightTab === 'enemies_loot'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#151926]'
              }`}
            >
              1. 👹 ENEMIGOS & LOOT
            </button>
            <button
              onClick={() => setRightTab('mainframe_crates')}
              className={`py-2 px-2 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
                rightTab === 'mainframe_crates'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#151926]'
              }`}
            >
              2. 💻 MAINFRAME & CAJAS
            </button>
            <button
              onClick={() => setRightTab('screamsheet_gm')}
              className={`py-2 px-2 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
                rightTab === 'screamsheet_gm'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#151926]'
              }`}
            >
              3. 📰 SCREAMSHEET & GM
            </button>
            <button
              onClick={() => setRightTab('premade_edgerunners')}
              className={`py-2 px-2 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center truncate ${
                rightTab === 'premade_edgerunners'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                  : 'text-[#94a3b8] hover:text-cyan-300 hover:bg-[#151926]'
              }`}
            >
              4. 👥 PREMADES 2077
            </button>
          </div>

          {/* ==================================================================
              PESTAÑA 1: ENEMIGOS, ARMADURA, CYBERWARE 2077 & LOOT (POR VAGÓN)
          ================================================================== */}
          {rightTab === 'enemies_loot' && (
            <div className="space-y-4 animate-fade-in">

              {/* A) RESUMEN DE CANTIDADES EXACTAS + CONTADORES */}
              <div className="bg-[#0e111a] border border-[#1f2638] p-3.5 rounded-xs space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                  <div>
                    <span className="font-tech text-xs font-bold text-red-500 uppercase tracking-widest block">
                      ORDEN DE BATALLA // REGLAS PÁG. 4 ({partySize} JUGADORES)
                    </span>
                    <h3 className="font-tech text-base font-black text-white uppercase">
                      CANTIDADES EXACTAS POR VAGÓN
                    </h3>
                  </div>
                  <button
                    onClick={handleResetEnemies}
                    className="px-2 py-1 bg-[#1a2030] hover:bg-[#28324a] text-slate-300 font-mono-code text-xs rounded transition-all cursor-pointer flex items-center gap-1"
                    title="Reiniciar lista activa de combate"
                  >
                    <RotateCcw className="w-3 h-3" /> Limpiar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono-code">
                  {/* Vagón Trasero */}
                  <div className="bg-[#121624] border border-[#1e263a] p-2.5 rounded-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#64748b] block font-bold uppercase">VAGÓN TRASERO</span>
                      <strong className="text-white text-sm font-black block">
                        {rearGuardsCount}x Guardias RCL
                      </strong>
                      <span className="text-[9px] text-slate-400">Escopeteros ({partySize >= 5 ? '5+ PJs = 3' : '<5 PJs = 2'})</span>
                    </div>
                    <button
                      onClick={handleSpawnRearCar}
                      className="mt-2 w-full py-1 bg-red-600/80 hover:bg-red-600 text-white font-tech font-bold text-[11px] rounded transition-all cursor-pointer"
                    >
                      ⚔️ Spawnear Trasero
                    </button>
                  </div>

                  {/* Vagón Delantero */}
                  <div className="bg-[#121624] border border-[#1e263a] p-2.5 rounded-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#64748b] block font-bold uppercase">VAGÓN DELANTERO</span>
                      <strong className="text-white text-sm font-black block">
                        {frontGuardsCount}G + 1 Oficial + 1 Tor.
                      </strong>
                      <span className="text-[9px] text-slate-400">Escolta pesada de Militech/Legion</span>
                    </div>
                    <button
                      onClick={handleSpawnFrontCar}
                      className="mt-2 w-full py-1 bg-red-700/80 hover:bg-red-700 text-white font-tech font-bold text-[11px] rounded transition-all cursor-pointer"
                    >
                      ⚔️ Spawnear Delantero
                    </button>
                  </div>

                  {/* Total del Tren */}
                  <div className="bg-[#14121a] border border-[#2b1e3a] p-2.5 rounded-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#64748b] block font-bold uppercase">TOTAL EN EL TREN</span>
                      <strong className="text-amber-400 text-sm font-black block">
                        {totalGuardsCount}G + 1 Oficial + 1 Tor.
                      </strong>
                      <span className="text-[9px] text-slate-400">Total para {partySize} edgerunners</span>
                    </div>
                    <button
                      onClick={handleSpawnAllTrain}
                      className="mt-2 w-full py-1 bg-amber-600 hover:bg-amber-500 text-black font-tech font-black text-[11px] rounded transition-all cursor-pointer"
                    >
                      🔄 Spawnear Todo el Tren
                    </button>
                  </div>
                </div>

                {/* TRACKER DE UNIDADES ACTIVAS */}
                {activeEnemies.length > 0 && (
                  <div className="pt-2 border-t border-[#1b2234] space-y-2">
                    <span className="text-[10px] font-mono-code text-cyan-400 font-bold block">
                      UNIDADES ACTIVAS EN COMBATE ({activeEnemies.length}):
                    </span>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {activeEnemies.map(enemy => (
                        <div
                          key={enemy.instanceId}
                          className={`p-2 rounded border text-xs font-mono-code flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            enemy.currentHp <= 0 ? 'bg-zinc-900/60 border-zinc-800 opacity-60' : 'bg-[#101420] border-[#1f283c]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#182030] text-cyan-300">
                              {enemy.carId.toUpperCase()}
                            </span>
                            <strong className="text-white truncate">{enemy.name}</strong>
                          </div>

                          {/* Ajustes de HP y SP */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-[#090b10] px-1.5 py-0.5 rounded border border-[#1e2638]">
                              <span className="text-[10px] text-red-400">HP:</span>
                              <button onClick={() => handleEnemyHpDelta(enemy.instanceId, -1)} className="w-4 h-4 bg-[#1a2030] text-white rounded text-center leading-none">-</button>
                              <strong className="text-white text-xs">{enemy.currentHp}/{enemy.maxHp}</strong>
                              <button onClick={() => handleEnemyHpDelta(enemy.instanceId, 1)} className="w-4 h-4 bg-[#1a2030] text-white rounded text-center leading-none">+</button>
                            </div>

                            <div className="flex items-center gap-1 bg-[#090b10] px-1.5 py-0.5 rounded border border-[#1e2638]">
                              <span className="text-[10px] text-cyan-400">H:</span>
                              <button onClick={() => handleEnemySpAblate(enemy.instanceId, 'head', -1)} className="w-4 h-4 bg-[#1a2030] text-white rounded text-center leading-none">-</button>
                              <strong className="text-cyan-300 text-xs">{enemy.headSp}</strong>
                            </div>

                            <div className="flex items-center gap-1 bg-[#090b10] px-1.5 py-0.5 rounded border border-[#1e2638]">
                              <span className="text-[10px] text-amber-400">B:</span>
                              <button onClick={() => handleEnemySpAblate(enemy.instanceId, 'body', -1)} className="w-4 h-4 bg-[#1a2030] text-white rounded text-center leading-none">-</button>
                              <strong className="text-amber-300 text-xs">{enemy.bodySp}</strong>
                            </div>

                            <button
                              onClick={() => handleEnemyRollInitiative(enemy.instanceId)}
                              className="px-1.5 py-0.5 bg-[#172032] hover:bg-cyan-600 text-cyan-200 text-[10px] rounded cursor-pointer"
                            >
                              INIT: {enemy.initiative ?? '?'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* B) FICHAS MAESTRAS DE LOS 3 TIPOS DE ENEMIGOS */}
              <div className="bg-[#0e111a] border border-[#1f2638] p-3.5 rounded-xs space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                  <div className="flex items-center gap-2">
                    <Skull className="w-4 h-4 text-red-500" />
                    <h3 className="font-tech text-sm font-black text-white uppercase tracking-wider">
                      DOSSIER COMPLETO DE ENEMIGOS (RED_CHROME_ENEMY_PROFILES)
                    </h3>
                  </div>

                  {/* Selector de Ficha */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedEnemyTab('rcl_shotgun_guard')}
                      className={`px-2.5 py-1 text-xs font-tech font-bold rounded transition-all cursor-pointer ${
                        selectedEnemyTab === 'rcl_shotgun_guard' ? 'bg-red-600 text-white' : 'bg-[#141824] text-slate-400 hover:text-white'
                      }`}
                    >
                      1. Guardia Escopetero
                    </button>
                    <button
                      onClick={() => setSelectedEnemyTab('rcl_officer')}
                      className={`px-2.5 py-1 text-xs font-tech font-bold rounded transition-all cursor-pointer ${
                        selectedEnemyTab === 'rcl_officer' ? 'bg-red-600 text-white' : 'bg-[#141824] text-slate-400 hover:text-white'
                      }`}
                    >
                      2. Oficial Teniente
                    </button>
                    <button
                      onClick={() => setSelectedEnemyTab('hammerhead_turret')}
                      className={`px-2.5 py-1 text-xs font-tech font-bold rounded transition-all cursor-pointer ${
                        selectedEnemyTab === 'hammerhead_turret' ? 'bg-red-600 text-white' : 'bg-[#141824] text-slate-400 hover:text-white'
                      }`}
                    >
                      3. Torreta Militech
                    </button>
                  </div>
                </div>

                {/* FICHA ACTIVA DETALLADA CON LOS 4 BLOQUES */}
                {(() => {
                  const profile = RED_CHROME_ENEMY_PROFILES[selectedEnemyTab];
                  const variant = conversionMode === '2077' ? profile.variant2077Cemk : profile.variant2045;
                  const armor = variant.armorDetail || {
                    headName: variant.armorHead || `Head SP ${variant.headSp}`,
                    headSp: variant.headSp,
                    bodyName: variant.armorBody || `Body SP ${variant.bodySp}`,
                    bodySp: variant.bodySp,
                    notes: 'Blindaje estándar.'
                  };

                  return (
                    <div className="space-y-3 font-mono-code text-xs">
                      {/* Cabecera del Enemigo */}
                      <div className="flex items-baseline justify-between border-b border-[#1b2336] pb-1.5">
                        <div>
                          <h4 className="font-tech text-base font-black text-white uppercase">
                            {variant.name}
                          </h4>
                          <span className="text-[11px] text-cyan-400">{variant.subtitle}</span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                          {variant.era} // {variant.threatTier}
                        </span>
                      </div>

                      {/* BLOQUE 1: ESTADÍSTICAS & ARMADURA EXACTA */}
                      <div className="bg-[#121624] p-3 rounded-xs border border-[#1f283c] space-y-2">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">
                          🛡️ 1. ESTADÍSTICAS & ARMADURA EXACTA (ARMORDETAIL)
                        </span>

                        {/* Tira de 10 Stats */}
                        <div className="grid grid-cols-10 gap-1 text-center bg-[#090b10] p-1.5 rounded border border-[#1b2234]">
                          {Object.entries(variant.stats).map(([k, v]) => (
                            <div key={k}>
                              <span className="text-[8px] text-[#64748b] block">{k}</span>
                              <strong className="text-white text-xs">{v}</strong>
                            </div>
                          ))}
                        </div>

                        {/* Vagas de Armadura y Salud */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                          <div className="bg-[#0b0e16] p-2 rounded border border-[#1f2638]">
                            <span className="text-[9px] text-slate-400 block">PUNTOS DE VIDA:</span>
                            <strong className="text-white text-sm">{variant.hp} HP</strong>
                            <span className="text-[9px] text-red-400 block">Grave: ≤{variant.seriouslyWounded}</span>
                          </div>
                          <div className="bg-[#0b0e16] p-2 rounded border border-[#1f2638]">
                            <span className="text-[9px] text-slate-400 block">DEATH SAVE:</span>
                            <strong className="text-white text-sm">BODY {variant.deathSave}</strong>
                            <span className="text-[9px] text-slate-500 block">Tirada vs muerte</span>
                          </div>
                          <div className="bg-[#0b0e16] p-2 rounded border border-[#1f2638]">
                            <span className="text-[9px] text-cyan-400 block font-bold">ARMADURA CABEZA:</span>
                            <strong className="text-cyan-300 text-sm">SP {armor.headSp}</strong>
                            <span className="text-[9px] text-slate-400 block truncate" title={armor.headName}>{armor.headName}</span>
                          </div>
                          <div className="bg-[#0b0e16] p-2 rounded border border-[#1f2638]">
                            <span className="text-[9px] text-amber-400 block font-bold">ARMADURA CUERPO:</span>
                            <strong className="text-amber-300 text-sm">SP {armor.bodySp}</strong>
                            <span className="text-[9px] text-slate-400 block truncate" title={armor.bodyName}>{armor.bodyName}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-[#94a3b8] italic">
                          ℹ {armor.notes}
                        </p>
                      </div>

                      {/* BLOQUE 2: ARMAS EQUIPADAS */}
                      <div className="bg-[#121624] p-3 rounded-xs border border-[#1f283c] space-y-2">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                          🔫 2. ARMAS EQUIPADAS // ATAQUES & DAÑO (WEAPONS)
                        </span>

                        <div className="space-y-1.5">
                          {variant.weapons.map((w, idx) => (
                            <div
                              key={idx}
                              className="bg-[#090b10] p-2 rounded border border-[#1b2234] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div>
                                <strong className="text-white text-xs">{w.name}</strong>
                                <span className="text-[10px] text-slate-400 ml-2">
                                  Base: <strong className="text-cyan-300">+{w.skillBase}</strong> | Daño: <strong className="text-red-400">{w.damage}</strong> | ROF: {w.rof} | Mag: {w.mag}
                                </span>
                                {w.notes && (
                                  <span className="text-[9px] text-amber-400 block mt-0.5">{w.notes}</span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => {
                                    const d10 = rollD10();
                                    const total = d10 + w.skillBase;
                                    showToast(`🎯 Ataque ${variant.name} (${w.name}): 1d10(${d10}) + Base(${w.skillBase}) = ${total}`, 'info');
                                  }}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold cursor-pointer"
                                >
                                  🎯 Tirar Ataque
                                </button>
                                <button
                                  onClick={() => {
                                    showToast(`💥 Daño de ${w.name}: Tirar ${w.damage} en mesa.`, 'info');
                                  }}
                                  className="px-2 py-1 bg-[#1a2336] hover:bg-[#25334d] text-cyan-300 border border-cyan-800 rounded text-[10px] font-bold cursor-pointer"
                                >
                                  💥 Daño ({w.damage})
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* BLOQUE 3: CYBERWARE 2077 & VULNERABILIDAD A QUICKHACKS */}
                      <div className="bg-[#121624] p-3 rounded-xs border border-[#1f283c] space-y-2">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                          🦾 3. CYBERWARE 2077 INSTALADO & VULNERABILIDADES (CYBERWARE_DETAILED)
                        </span>

                        <div className="space-y-1.5">
                          {(variant.cyberwareDetailed || []).map((cb, idx) => (
                            <div key={idx} className="bg-[#090b10] p-2 rounded border border-[#1b2234] space-y-1">
                              <div className="flex items-center justify-between">
                                <strong className="text-white text-xs">{cb.name}</strong>
                                <span className="text-[9px] font-bold text-[#64748b] uppercase">Ranura: {cb.slot}</span>
                              </div>
                              <p className="text-[10px] text-[#cbd5e1]">{cb.effect}</p>

                              {cb.quickhackVulnerability && (
                                <div className="p-1.5 bg-[#171308] border border-amber-600/40 rounded text-[10px] text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                  <div>
                                    <strong className="text-amber-400 uppercase">⚡ VULNERABLE A {cb.quickhackVulnerability.hackName}:</strong>
                                    <span className="ml-1">DV {cb.quickhackVulnerability.dv} | RAM {cb.quickhackVulnerability.costRam} ➔ {cb.quickhackVulnerability.targetEffect}</span>
                                    {cb.quickhackVulnerability.lucyKiwiSpecial && (
                                      <span className="text-cyan-300 block text-[9px]">{cb.quickhackVulnerability.lucyKiwiSpecial}</span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => setActiveQuickhackModal(profile.id)}
                                    className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-[9px] cursor-pointer shrink-0"
                                  >
                                    Lanzar Quickhack ➔
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* BLOQUE 4: LOOT / BOTÍN AL MORIR */}
                      <div className="bg-[#121624] p-3 rounded-xs border border-[#1f283c] space-y-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                          🎁 4. BOTÍN AL MORIR / LOOT DROPS ({profile.lootDrops?.length || 0} ÍTEMS)
                        </span>

                        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                          {(profile.lootDrops || []).map((drop) => (
                            <div
                              key={drop.id}
                              className="bg-[#090b10] p-2 rounded border border-[#1b2234] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div className="truncate">
                                <strong className="text-white text-xs">{drop.name}</strong>
                                <span className="text-[10px] text-emerald-400 font-bold ml-2">
                                  {drop.valueEb} €$
                                </span>
                                <span className="text-[9px] text-slate-400 ml-1.5 capitalize">
                                  ({drop.category} • x{drop.quantity})
                                </span>
                                <p className="text-[9px] text-[#94a3b8] truncate">{drop.description}</p>
                              </div>

                              <button
                                onClick={() => handleLootItemToActivePlayer(drop)}
                                className="px-2 py-1 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap"
                              >
                                🎒 Saquear para {activeChar.handle.split(' ')[0]}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          )}

          {/* ==================================================================
              PESTAÑA 2: MAINFRAME 5 PISOS & LAS 4 CAJAS / MANIFIESTO
          ================================================================== */}
          {rightTab === 'mainframe_crates' && (
            <div className="space-y-4 animate-fade-in font-mono-code text-xs">

              {/* 1. MAINFRAME DE 5 PISOS */}
              <div className="bg-[#080d16] border border-cyan-500/40 p-4 rounded-xs space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-cyan-900 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                    <div>
                      <span className="font-mono-code text-[9px] font-bold text-cyan-400 uppercase tracking-widest block">
                        ARQUITECTURA NET CANÓNICA // MIDDLE CAR [▲]
                      </span>
                      <h3 className="font-tech text-base font-black text-white uppercase">
                        {HAMMERHEAD_MAINFRAME_NET.name}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    5 PISOS
                  </span>
                </div>

                {/* 👑 CONTROL DEL MASTER (GM): DESBLOQUEAR / OCULTAR PISOS NET */}
                <div className="bg-[#0b0e17] border border-cyan-500/40 p-2.5 rounded-xs space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-tech text-xs font-bold text-amber-300 uppercase">
                        👑 CONTROL DEL MASTER (GM): DESBLOQUEAR / OCULTAR PISOS NET
                      </span>
                      <span className="text-[9px] font-mono-code text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-700/50">
                        Niebla de Guerra
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const nextLocked = HAMMERHEAD_MAINFRAME_NET.floors
                            .map((f) => f.floorNumber)
                            .find((fn) => !mainframeProgress.unlockedFloors.includes(fn));
                          if (nextLocked) {
                            setMainframeProgress((prev) => ({
                              ...prev,
                              unlockedFloors: [...prev.unlockedFloors, nextLocked]
                            }));
                          }
                        }}
                        className="px-2 py-0.5 bg-cyan-950 hover:bg-cyan-800 text-cyan-200 border border-cyan-600/60 rounded text-[9px] font-mono-code font-bold transition-all cursor-pointer"
                        title="Desbloquear siguiente piso bloqueado"
                      >
                        🔓 Desbloquear Siguiente Piso
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setMainframeProgress((prev) => ({
                            ...prev,
                            unlockedFloors: HAMMERHEAD_MAINFRAME_NET.floors.map((f) => f.floorNumber)
                          }))
                        }
                        className="px-2 py-0.5 bg-purple-950 hover:bg-purple-800 text-purple-200 border border-purple-600/60 rounded text-[9px] font-mono-code font-bold transition-all cursor-pointer"
                        title="Revelar todos los pisos (Modo GM)"
                      >
                        👁️ Revelar Todos (Modo GM)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setMainframeProgress((prev) => ({
                            ...prev,
                            unlockedFloors: [1]
                          }))
                        }
                        className="px-2 py-0.5 bg-red-950 hover:bg-red-800 text-red-200 border border-red-600/60 rounded text-[9px] font-mono-code font-bold transition-all cursor-pointer"
                        title="Ocultar pisos del 2 en adelante para los jugadores"
                      >
                        🔒 Ocultar Todos (Modo Jugador)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1.5 border-t border-[#1a253a]">
                    {HAMMERHEAD_MAINFRAME_NET.floors.map((fl) => {
                      const isUn = mainframeProgress.unlockedFloors.includes(fl.floorNumber);
                      return (
                        <button
                          key={`gm-hammerhead-${fl.floorNumber}`}
                          type="button"
                          onClick={() => {
                            setMainframeProgress((prev) => ({
                              ...prev,
                              unlockedFloors: isUn
                                ? prev.unlockedFloors.filter((fn) => fn !== fl.floorNumber)
                                : [...prev.unlockedFloors, fl.floorNumber]
                            }));
                          }}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono-code font-bold border transition-all cursor-pointer ${
                            isUn
                              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600/60 hover:bg-emerald-900'
                              : 'bg-red-950/50 text-red-400 border-red-800/50 hover:bg-red-900'
                          }`}
                        >
                          {isUn ? `🔓 Piso ${fl.floorNumber}` : `🔒 Piso ${fl.floorNumber}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {HAMMERHEAD_MAINFRAME_NET.floors.map(fl => {
                    const isUnlocked = mainframeProgress.unlockedFloors.includes(fl.floorNumber);

                    if (!isUnlocked) {
                      return (
                        <div
                          key={fl.floorNumber}
                          className="p-2 rounded border border-red-950/60 bg-[#0b0e17] flex flex-col justify-between space-y-1.5 opacity-75 hover:opacity-100 hover:border-red-500/40 transition-all cursor-pointer"
                          onClick={() => {
                            setMainframeProgress(prev => ({
                              ...prev,
                              unlockedFloors: [...prev.unlockedFloors, fl.floorNumber]
                            }));
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between border-b border-red-900/40 pb-1">
                              <span className="text-[10px] font-bold text-red-400">PISO {fl.floorNumber}</span>
                              <Lock className="w-3 h-3 text-red-400" />
                            </div>
                            <strong className="text-red-300 text-[11px] block mt-1 line-clamp-2">
                              🔒 PISO #{fl.floorNumber}: NODO ENCRIPTADO (CONTENIDO OCULTO PARA EL NETRUNNER)
                            </strong>
                            <span className="text-[9px] text-slate-400 block mt-1 leading-snug">
                              Contenido protegido tras niebla de guerra. Solo se revela al entrar físicamente a este piso, escanearlo con Pathfinder o cuando el Master lo desbloquea.
                            </span>
                          </div>
                          <div className="pt-1 border-t border-red-900/30">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMainframeProgress(prev => ({
                                  ...prev,
                                  unlockedFloors: [...prev.unlockedFloors, fl.floorNumber]
                                }));
                              }}
                              className="w-full py-1 bg-red-950 hover:bg-red-900 text-red-200 border border-red-700/60 rounded text-[9px] font-bold cursor-pointer"
                            >
                              🔓 Desbloquear Piso
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={fl.floorNumber}
                        className={`p-2 rounded border flex flex-col justify-between space-y-1.5 transition-all ${
                          isUnlocked ? 'bg-[#0a1e20] border-emerald-500' : 'bg-[#0d1422] border-[#1d273c]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between border-b border-[#1a253a] pb-1">
                            <span className="text-[10px] font-bold text-cyan-400">PISO {fl.floorNumber}</span>
                            {isUnlocked ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-slate-500" />}
                          </div>
                          <strong className="text-white text-[11px] block mt-1 line-clamp-2">{fl.name}</strong>
                          <span className="text-[9px] text-amber-400 block">{fl.dv ? `DV ${fl.dv}` : fl.type}</span>
                        </div>

                        <div className="pt-1 border-t border-[#1a253a]">
                          {fl.type === 'Password' && (
                            <button
                              onClick={() => handleNetAction(fl.floorNumber, 'backdoor')}
                              className="w-full py-1 bg-cyan-950 hover:bg-cyan-800 text-cyan-200 border border-cyan-700 rounded text-[9px] font-bold cursor-pointer"
                            >
                              Backdoor (DV {fl.dv})
                            </button>
                          )}
                          {fl.type === 'File' && (
                            <button
                              onClick={() => handleNetAction(fl.floorNumber, 'eye_dee')}
                              className="w-full py-1 bg-amber-950 hover:bg-amber-800 text-amber-200 border border-amber-700 rounded text-[9px] font-bold cursor-pointer"
                            >
                              Eye-Dee (DV {fl.dv})
                            </button>
                          )}
                          {fl.type === 'Black ICE' && (
                            <div className="space-y-1">
                              <span className="text-[9px] text-red-400 block text-center">REZ: {mainframeProgress.hellhoundRez}/20</span>
                              <button
                                onClick={() => handleNetAction(fl.floorNumber, 'zap')}
                                disabled={mainframeProgress.hellhoundRez <= 0}
                                className="w-full py-0.5 bg-red-950 hover:bg-red-800 disabled:opacity-30 text-red-200 text-[8px] font-bold rounded cursor-pointer"
                              >
                                Zap (2d6)
                              </button>
                              <button
                                onClick={() => handleNetAction(fl.floorNumber, 'hellhound_atk')}
                                disabled={mainframeProgress.hellhoundRez <= 0}
                                className="w-full py-0.5 bg-orange-950 hover:bg-orange-800 disabled:opacity-30 text-orange-200 text-[8px] font-bold rounded cursor-pointer"
                              >
                                Hellhound Atk (+6)
                              </button>
                            </div>
                          )}
                          {fl.type === 'Control Node' && (
                            <button
                              onClick={() => handleNetAction(fl.floorNumber, 'control')}
                              className="w-full py-1 bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded text-[9px] font-bold cursor-pointer"
                            >
                              {turretStatus === 'hacked' ? '🟢 Hackeada' : `Control (DV ${fl.dv})`}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. TABLA DEL MANIFIESTO DE MILITECH (MIDDLE CAR) */}
              <div className="bg-[#0e111a] border border-[#1f2638] p-4 rounded-xs space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <h3 className="font-tech text-sm font-black text-white uppercase tracking-wider">
                      MANIFIESTO DE CARGA MILITAR (HAMMERHEAD_MANIFEST_LOOT)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400">5 Envíos Registrados</span>
                </div>

                <div className="space-y-3">
                  {HAMMERHEAD_MANIFEST_LOOT.map(cons => (
                    <div key={cons.consignmentId} className="bg-[#121624] p-3 rounded-xs border border-[#1e263a] space-y-2">
                      <div className="flex items-baseline justify-between border-b border-[#1a2336] pb-1">
                        <div>
                          <strong className="text-white text-xs">{cons.cargoTitle}</strong>
                          <span className="text-[10px] text-cyan-400 ml-2">({cons.car.toUpperCase()} CAR)</span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-bold">{cons.totalValueEb} €$ Total</span>
                      </div>
                      <p className="text-[10px] text-[#94a3b8]">{cons.description}</p>
                      <span className="text-[9px] text-[#64748b] block">{cons.senderRecipient} • {cons.securityRating}</span>

                      {/* Ítems del envío */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {cons.items.map(it => (
                          <div key={it.id} className="bg-[#090b10] p-1.5 rounded border border-[#182030] flex items-center justify-between gap-1">
                            <div className="truncate">
                              <span className="text-white text-[11px] font-bold truncate block">{it.name}</span>
                              <span className="text-[9px] text-emerald-400">{it.valueEb} €$</span>
                            </div>
                            <button
                              onClick={() => handleLootItemToActivePlayer(it)}
                              className="px-2 py-0.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded text-[9px] font-bold cursor-pointer shrink-0"
                            >
                              🎒 Saquear
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. LAS 4 CAJAS DE HORNET & PAGO DE 2,000 €$ */}
              <div className="bg-[#0e111a] border border-[#1f2638] p-4 rounded-xs space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-400" />
                    <h3 className="font-tech text-sm font-black text-white uppercase tracking-wider">
                      LAS 4 CAJAS CON CERRADURA ADN (HORNET_CRATES_LOOT)
                    </h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {Object.values(securedCrates).filter(Boolean).length}/4 Aseguradas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {HORNET_CRATES_LOOT.map(crate => {
                    const isSecured = securedCrates[crate.crateNumber];
                    const carrierId = crateCarriers[crate.crateNumber];
                    const carrier = characters.find(c => c.id === carrierId);

                    return (
                      <div
                        key={crate.crateNumber}
                        className={`p-3 rounded-xs border space-y-2 transition-all ${
                          isSecured ? 'bg-emerald-950/40 border-emerald-500' : 'bg-[#121624] border-[#1e263a]'
                        }`}
                      >
                        <div className="flex items-baseline justify-between border-b border-[#1a2336] pb-1">
                          <strong className="text-white text-xs">{crate.label}</strong>
                          <span className="text-[10px] text-amber-400 font-bold">{crate.totalValueEb} €$</span>
                        </div>
                        <span className="text-[10px] text-cyan-300 block">{crate.intendedRecipient}</span>
                        <p className="text-[9px] text-[#94a3b8]">{crate.transportRequirement}</p>
                        <span className="text-[9px] text-red-400 block">{crate.biologicalRisk}</span>

                        {/* Asignación y Asegurado */}
                        <div className="pt-1.5 border-t border-[#1a2336] flex items-center justify-between gap-1 text-[10px]">
                          <select
                            value={carrierId || ''}
                            onChange={(e) => setCrateCarriers(prev => ({ ...prev, [crate.crateNumber]: e.target.value ? e.target.value : null }))}
                            className="bg-[#090b10] border border-[#232d42] text-white text-[10px] px-1.5 py-0.5 rounded cursor-pointer max-w-[130px] truncate"
                          >
                            <option value="">(En el suelo)</option>
                            {characters.map(p => (
                              <option key={p.id} value={p.id}>{p.handle} (2 Manos)</option>
                            ))}
                          </select>

                          <button
                            onClick={() => setSecuredCrates(prev => ({ ...prev, [crate.crateNumber]: !prev[crate.crateNumber] }))}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border ${
                              isSecured ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-[#182030] border-[#29364e] text-slate-300'
                            }`}
                          >
                            {isSecured ? '✓ A salvo en Hornet' : 'Subir a Hornet'}
                          </button>
                        </div>

                        {carrier && !isSecured && (
                          <span className="text-[9px] text-amber-400 block bg-amber-950/30 px-1 py-0.2 rounded border border-amber-900/50">
                            ⚠ {carrier.handle} ocupa las 2 manos cargando esta caja.
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* BOTÓN DORADO DE PAGO DE HORNET */}
                <div className="bg-[#141208] border-2 border-[#eab308] p-4 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
                  <div>
                    <span className="font-tech text-xs font-bold text-[#eab308] uppercase tracking-widest block">
                      RECOMPENSA DE CAMPAÑA // FIXER HORNET
                    </span>
                    <h4 className="font-tech text-base font-black text-white uppercase">
                      2,000 €$ A CADA MIEMBRO DEL ESCUADRÓN
                    </h4>
                    <p className="text-[10px] text-[#a1a1aa] mt-0.5">
                      Acredita 2,000 €$ a cada personaje del Roster y registra la transacción bancaria de Night City.
                    </p>
                  </div>

                  <button
                    onClick={handleCompleteMissionHornet}
                    disabled={isMissionFinished}
                    className={`py-2.5 px-5 rounded-xs font-tech font-black text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2 border whitespace-nowrap ${
                      isMissionFinished
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 cursor-not-allowed'
                        : 'bg-[#eab308] hover:bg-[#ca8a04] text-black border-[#ca8a04] active:scale-95'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{isMissionFinished ? 'MISIÓN COBRADA (+2,000 €$ C/U)' : 'PAGAR 2,000 €$ A CADA JUGADOR (HORNET)'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================================
              PESTAÑA 3: SCREAMSHEET ORIGINAL (PÁG. 2 PDF) & HISTORIA / NOTAS GM
          ================================================================== */}
          {rightTab === 'screamsheet_gm' && (
            <div className="space-y-4 animate-fade-in font-mono-code text-xs">

              {/* IMAGEN ORIGINAL DEL SCREAMSHEET DE LA PÁGINA 2 */}
              <div className="bg-[#0b0c10] border border-[#222634] p-4 rounded-xs shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#222634] pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-red-500" />
                    <h3 className="font-tech text-sm font-black text-white uppercase tracking-wider">
                      SCREAMSHEET ORIGINAL DE ALTA RESOLUCIÓN (PÁG. 2 PDF)
                    </h3>
                  </div>
                  <button
                    onClick={() => setFullscreenImage('./screamsheet-p2.png')}
                    className="px-2 py-0.5 bg-[#171b26] hover:bg-cyan-600 text-slate-300 hover:text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" /> Ampliar
                  </button>
                </div>

                <div className="bg-[#07090e] border border-[#1b2234] rounded flex items-center justify-center p-2">
                  <img
                    src="./screamsheet-p2.png"
                    alt="Screamsheet Original Night City Today News"
                    className="max-h-[380px] w-auto object-contain rounded"
                  />
                </div>
              </div>

              {/* PERIÓDICO NIGHT CITY TODAY NEWS EN TEXTO */}
              <div className="bg-[#0e111a] border border-[#1e2436] p-4 rounded-xs space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b-2 border-red-600 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-red-500 tracking-widest block uppercase">
                      NIGHT CITY TODAY NEWS // 9:37 AM
                    </span>
                    <h3 className="font-tech text-base font-black text-white uppercase">
                      {RED_CHROME_SCREAMSHEET.headline}
                    </h3>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => setScreamsheetLang('es')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        screamsheetLang === 'es' ? 'bg-red-600 text-white' : 'bg-[#182030] text-slate-400'
                      }`}
                    >
                      ES
                    </button>
                    <button
                      onClick={() => setScreamsheetLang('en')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        screamsheetLang === 'en' ? 'bg-red-600 text-white' : 'bg-[#182030] text-slate-400'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-[#cbd5e1] font-sans text-xs leading-relaxed">
                  {(screamsheetLang === 'es' ? RED_CHROME_SCREAMSHEET.paragraphsEs : RED_CHROME_SCREAMSHEET.paragraphsEn).map((p, i) => (
                    <p key={i} className="bg-[#12151f] p-2.5 rounded border border-[#1d2334]">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* BRIEFING DE HORNET & NOTAS SECRETAS DEL GM */}
              <div className="bg-[#0e111a] border border-[#1e2436] p-4 rounded-xs space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400" />
                    <h3 className="font-tech text-sm font-black text-white uppercase tracking-wider">
                      PLAYER BRIEFING & NOTAS CONFIDENCIALES DEL GM
                    </h3>
                  </div>

                  <button
                    onClick={() => setIsPlayerMode(!isPlayerMode)}
                    className="text-[10px] font-mono-code text-cyan-300 hover:underline cursor-pointer"
                  >
                    {isPlayerMode ? 'Mostrar Secretos GM' : 'Ocultar Secretos (Modo Jugadores)'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div className="bg-[#141824] p-2 rounded border border-[#222a3e]">
                    <span className="text-[#64748b] block">FIXER:</span>
                    <strong className="text-white text-xs">{RED_CHROME_BRIEFING.playerBriefing.fixerName}</strong>
                  </div>
                  <div className="bg-[#141824] p-2 rounded border border-[#222a3e]">
                    <span className="text-[#64748b] block">PAGO:</span>
                    <strong className="text-emerald-400 text-xs font-black">{RED_CHROME_BRIEFING.playerBriefing.payoutPerPlayer} €$ C/U</strong>
                  </div>
                  <div className="bg-[#141824] p-2 rounded border border-[#222a3e]">
                    <span className="text-[#64748b] block">HOSTILES:</span>
                    <strong className="text-red-400 text-xs">{RED_CHROME_BRIEFING.playerBriefing.targetGang}</strong>
                  </div>
                  <div className="bg-[#141824] p-2 rounded border border-[#222a3e]">
                    <span className="text-[#64748b] block">TREN:</span>
                    <strong className="text-cyan-400 text-xs">{RED_CHROME_BRIEFING.playerBriefing.trainName}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-[#cbd5e1] leading-relaxed bg-[#121624] p-2.5 rounded border border-[#1e263a]">
                  <strong>OBJETIVO:</strong> {RED_CHROME_BRIEFING.playerBriefing.missionGoal}
                </p>

                {/* NOTAS SECRETAS GM (SI NO ESTÁ EN MODO JUGADORES) */}
                {!isPlayerMode ? (
                  <div className="bg-[#1b1114] border-2 border-red-600/70 p-3 rounded-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-red-600/40 pb-1">
                      <span className="font-tech text-xs font-bold text-red-400 uppercase flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                        GAMEMASTER CONFIDENTIAL // LA VERDAD DE LAS 4 CAJAS
                      </span>
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">SOLO GM</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-[#100b0d] p-2 rounded border border-red-900/50">
                        <strong className="text-red-300 block mb-0.5">CAJAS 1 A 3:</strong>
                        <p className="text-slate-300">{RED_CHROME_BRIEFING.gmSecretNotes.cratesOneToThreeContent}</p>
                      </div>
                      <div className="bg-[#100b0d] p-2 rounded border border-red-900/50">
                        <strong className="text-amber-300 block mb-0.5">CAJA 4 (NEUROTOXINA):</strong>
                        <p className="text-slate-300">{RED_CHROME_BRIEFING.gmSecretNotes.crateFourContent}</p>
                      </div>
                    </div>

                    <p className="text-[10px] text-red-200 bg-[#251016] p-2 rounded border border-red-800">
                      <strong>PELIGRO BIOLÓGICO:</strong> {RED_CHROME_BRIEFING.gmSecretNotes.toxicChemicalEffect}
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded text-center text-xs text-emerald-400">
                    🔒 Secretos confidenciales del Director de Juego ocultos para la pantalla compartida.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ==================================================================
              PESTAÑA 4: PREMADES 2077 (CEMK FOLIOS & BANDA DEL ANIME)
          ================================================================== */}
          {rightTab === 'premade_edgerunners' && (
            <div className="space-y-4 animate-fade-in font-mono-code">
              
              {/* SELECTOR DE ROSTER DUAL + ACCIONES DE RESTAURACIÓN */}
              <div className="bg-[#0e111a] border border-[#1f2638] p-3 rounded-xs space-y-2.5 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b2234] pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="font-tech text-xs font-bold text-white uppercase tracking-wider">
                      ROSTERS OFICIALES EDGERUNNERS 2077
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        syncOrRestoreCemkFolioCharacters();
                        showToast('🔄 Folios Canónicos CEMK restaurados al estado de fábrica.', 'success');
                      }}
                      className="px-2 py-1 bg-[#121624] hover:bg-[#1a2236] border border-cyan-800/80 text-cyan-300 text-[10px] rounded transition-all cursor-pointer flex items-center gap-1"
                      title="Restaura copias canónicas de los 7 Folios oficiales CEMK"
                    >
                      <RotateCcw className="w-3 h-3 text-cyan-400" />
                      <span>Restaurar Folios</span>
                    </button>
                    <button
                      onClick={() => {
                        loadCemk2077PartyRoster();
                        showToast('🎬 Banda del Anime cargada en la memoria.', 'success');
                      }}
                      className="px-2 py-1 bg-[#121624] hover:bg-[#1a2236] border border-amber-800/80 text-amber-300 text-[10px] rounded transition-all cursor-pointer flex items-center gap-1"
                      title="Carga los 7 PJs de la banda de David Martinez"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Cargar Anime Crew</span>
                    </button>
                  </div>
                </div>

                {/* Sub-selector de Roster */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#090b12] rounded border border-[#1a2234]">
                  <button
                    onClick={() => setEdgerunnerRosterTab('cemk_folios')}
                    className={`py-1.5 px-2 text-xs font-tech font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      edgerunnerRosterTab === 'cemk_folios'
                        ? 'bg-cyan-950/80 border border-cyan-500 text-cyan-200 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-[#141926]'
                    }`}
                  >
                    <span>📋 ROSTER OFICIAL CEMK FOLIOS (7 PJs)</span>
                  </button>
                  <button
                    onClick={() => setEdgerunnerRosterTab('anime_crew')}
                    className={`py-1.5 px-2 text-xs font-tech font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      edgerunnerRosterTab === 'anime_crew'
                        ? 'bg-amber-950/80 border border-amber-500 text-amber-200 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-[#141926]'
                    }`}
                  >
                    <span>🎬 BANDA DEL ANIME (7 PJs)</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#94a3b8]">
                  {edgerunnerRosterTab === 'cemk_folios'
                    ? 'Personajes canónicos extraídos de las 28 páginas de CEMK-Edgerunners-Character-Folios-Letter_2024-05-22.pdf con tokens oficiales, matriz de 66 habilidades y armamento 2077.'
                    : 'Tripulación oficial del anime Cyberpunk: Edgerunners (David, Lucy, Rebecca, Maine, Kiwi, Falco, Pilar) adaptada para misiones en Night City 2077.'}
                </p>
              </div>

              {/* LISTA DE TARJETAS DE PERSONAJES */}
              <div className="space-y-3">
                {edgerunnerRosterTab === 'cemk_folios' ? (
                  CEMK_FOLIO_PREMADE_CHARACTERS.map((folio) => {
                    const currentChar = characters.find((c) => c.id === folio.id) || folio;
                    const meta = CEMK_FOLIO_METADATA_MAP[folio.id];
                    const isActive = activeChar?.id === currentChar.id;

                    return (
                      <div
                        key={folio.id}
                        className={`bg-[#0d101a] border rounded-xs p-3 transition-all ${
                          isActive
                            ? 'border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                            : 'border-[#1e2538] hover:border-[#2f3b57]'
                        }`}
                      >
                        {/* Cabecera Tarjeta */}
                        <div className="flex items-start justify-between gap-3 pb-2 border-b border-[#182033]">
                          <div className="flex items-center gap-3">
                            {meta?.tokenUrl ? (
                              <img
                                src={meta.tokenUrl}
                                alt={meta.name}
                                className="w-12 h-12 rounded object-cover border border-cyan-500/60 shadow-md bg-[#090b12]"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded bg-cyan-950/60 border border-cyan-600/50 flex items-center justify-center font-bold text-cyan-300 font-tech text-base">
                                {folio.handle.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-tech text-sm font-bold text-white tracking-wide">
                                  {meta ? meta.name : folio.handle}
                                </h4>
                                <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-bold rounded">
                                  {folio.role} {folio.roleRank}
                                </span>
                                {isActive && (
                                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold rounded animate-pulse">
                                    🟢 EN USO
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-cyan-400 font-medium line-clamp-1">
                                {meta?.archetype2077 || folio.roleAbilityName}
                              </p>
                              <span className="text-[9px] text-[#64748b]">
                                Folio Oficial 2077 • ID: {folio.id}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            {isActive ? (
                              <span className="px-3 py-1 bg-emerald-600 text-white font-tech font-bold text-xs rounded shadow">
                                ✓ JUGANDO
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveCharacter(currentChar.id);
                                  showToast(`🎮 Ahora jugando como ${currentChar.handle}`, 'success');
                                }}
                                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold text-xs rounded transition-all cursor-pointer shadow-md shadow-cyan-950"
                              >
                                🎮 JUGAR
                              </button>
                            )}
                            <button
                              onClick={() => setViewingDossierCharId(currentChar.id)}
                              className="text-[10px] text-cyan-400 hover:text-cyan-200 underline cursor-pointer mt-0.5"
                            >
                              Ver 66 Skills & Dossier ▸
                            </button>
                          </div>
                        </div>

                        {/* Fila de Estadísticas Tácticas */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 py-2 text-center text-[10px] border-b border-[#161c2c]">
                          <div className="bg-[#121624] p-1 rounded border border-[#1d263b]">
                            <span className="text-[#64748b] block text-[9px]">HP ACTUAL</span>
                            <span className="font-bold text-emerald-400">{currentChar.currentHp}</span>
                          </div>
                          <div className="bg-[#121624] p-1 rounded border border-[#1d263b]">
                            <span className="text-[#64748b] block text-[9px]">BLINDAJE</span>
                            <span className="font-bold text-amber-300">
                              C:{currentChar.headArmor.currentSp} / T:{currentChar.bodyArmor.currentSp}
                            </span>
                          </div>
                          <div className="bg-[#121624] p-1 rounded border border-[#1d263b]">
                            <span className="text-[#64748b] block text-[9px]">HUMANIDAD</span>
                            <span className="font-bold text-purple-300">{currentChar.currentHumanity}</span>
                          </div>
                          <div className="bg-[#121624] p-1 rounded border border-[#1d263b]">
                            <span className="text-[#64748b] block text-[9px]">EUROCASH</span>
                            <span className="font-bold text-emerald-300">€${currentChar.eurodollars}</span>
                          </div>
                          <div className="bg-[#121624] p-1 rounded border border-[#1d263b] col-span-4 sm:col-span-1">
                            <span className="text-[#64748b] block text-[9px]">ROL ABILITY</span>
                            <span className="font-bold text-cyan-300 truncate block" title={folio.roleAbilityName}>
                              {folio.roleAbilityName}
                            </span>
                          </div>
                        </div>

                        {/* Mini Barra de los 10 STATS */}
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 py-1.5 text-center text-[9px] border-b border-[#141a29]">
                          {Object.entries(currentChar.stats).map(([k, v]) => (
                            <div key={k} className="bg-[#0a0d15] p-0.5 rounded border border-[#171e2e]">
                              <span className="text-[#64748b] block text-[8px]">{k}</span>
                              <span className="font-bold text-slate-200">{v}</span>
                            </div>
                          ))}
                        </div>

                        {/* Habilidad de Rol y Resumen */}
                        <div className="py-2 space-y-1 text-[11px]">
                          <div className="text-slate-300 flex items-start gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-amber-300">Regla de Rol:</strong> {meta?.roleAbilitySummary || folio.notes}
                            </span>
                          </div>
                          {meta?.combatStyle && (
                            <div className="text-slate-400 text-[10px] pl-4">
                              <span className="text-cyan-400">Estilo:</span> {meta.combatStyle}
                            </div>
                          )}
                        </div>

                        {/* Armas y Ciberware 2077 */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#141a29]">
                          <span className="text-[9px] text-[#64748b] uppercase">Arsenal:</span>
                          {(currentChar.equippedWeapons || []).map((w, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 bg-[#121828] border border-cyan-900/60 text-cyan-200 rounded"
                            >
                              ⚔️ {w.name} ({w.damage})
                            </span>
                          ))}
                          {currentChar.hasNeuroport && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-indigo-950/70 border border-indigo-700/60 text-indigo-300 rounded">
                              🌐 Neuroport 2077
                            </span>
                          )}
                          <span className="text-[9px] px-1.5 py-0.5 bg-[#161a28] border border-[#232b40] text-slate-300 rounded">
                            🦾 {currentChar.installedCyberwareIds.length} Ciberimplantes
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  buildCemk2077Characters().map((animeChar) => {
                    const currentChar =
                      characters.find(
                        (c) =>
                          c.id === animeChar.id ||
                          c.handle.toLowerCase().includes(animeChar.handle.split(' ')[0].toLowerCase())
                      ) || animeChar;
                    const isActive = activeChar?.id === currentChar.id;

                    return (
                      <div
                        key={animeChar.id}
                        className={`bg-[#0d101a] border rounded-xs p-3 transition-all ${
                          isActive
                            ? 'border-amber-500 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                            : 'border-[#1e2538] hover:border-[#2f3b57]'
                        }`}
                      >
                        {/* Cabecera Tarjeta Anime */}
                        <div className="flex items-start justify-between gap-3 pb-2 border-b border-[#182033]">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-amber-950/60 border border-amber-600/60 flex items-center justify-center font-bold text-amber-300 font-tech text-base">
                              {animeChar.handle.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-tech text-sm font-bold text-white tracking-wide">
                                  {animeChar.handle}
                                </h4>
                                <span className="text-[10px] px-1.5 py-0.2 bg-amber-950/80 border border-amber-700/60 text-amber-300 font-bold rounded">
                                  {animeChar.role} {animeChar.roleRank}
                                </span>
                                {isActive && (
                                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold rounded animate-pulse">
                                    🟢 EN USO
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-amber-400 font-medium line-clamp-1">
                                Edgerunners Anime Crew • {animeChar.roleAbilityName}
                              </p>
                              <span className="text-[9px] text-[#64748b]">ID: {currentChar.id}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            {isActive ? (
                              <span className="px-3 py-1 bg-emerald-600 text-white font-tech font-bold text-xs rounded shadow">
                                ✓ JUGANDO
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveCharacter(currentChar.id);
                                  showToast(`🎮 Ahora jugando como ${currentChar.handle}`, 'success');
                                }}
                                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-tech font-bold text-xs rounded transition-all cursor-pointer shadow-md shadow-amber-950"
                              >
                                🎮 JUGAR
                              </button>
                            )}
                            <button
                              onClick={() => setViewingDossierCharId(currentChar.id)}
                              className="text-[10px] text-amber-400 hover:text-amber-200 underline cursor-pointer mt-0.5"
                            >
                              Ver Habilidades ▸
                            </button>
                          </div>
                        </div>

                        {/* Fila de Estadísticas Tácticas */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 py-2 text-center text-[10px] border-b border-[#161c2c]">
                          <div className="bg-[#121624] p-1 rounded border border-[#1d263b]">
                            <span className="text-[#64748b] block text-[9px]">HP ACTUAL</span>
                            <span className="font-bold text-emerald-400">{currentChar.currentHp}</span>
                          </div>
                          <div className="bg-[#121624] p-1 rounded border border-[#1d263b]">
                            <span className="text-[#64748b] block text-[9px]">BLINDAJE</span>
                            <span className="font-bold text-amber-300">
                              C:{currentChar.headArmor.currentSp} / T:{currentChar.bodyArmor.currentSp}
                            </span>
                          </div>
                          <div className="bg-[#121624] p-1 rounded border border-[#1d263b]">
                            <span className="text-[#64748b] block text-[9px]">HUMANIDAD</span>
                            <span className="font-bold text-purple-300">{currentChar.currentHumanity}</span>
                          </div>
                          <div className="bg-[#121624] p-1 rounded border border-[#1d263b]">
                            <span className="text-[#64748b] block text-[9px]">EUROCASH</span>
                            <span className="font-bold text-emerald-300">€${currentChar.eurodollars}</span>
                          </div>
                          <div className="bg-[#121624] p-1 rounded border border-[#1d263b] col-span-4 sm:col-span-1">
                            <span className="text-[#64748b] block text-[9px]">ROL ABILITY</span>
                            <span className="font-bold text-amber-300 truncate block">
                              {animeChar.roleAbilityName}
                            </span>
                          </div>
                        </div>

                        {/* Mini Barra de los 10 STATS */}
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 py-1.5 text-center text-[9px] border-b border-[#141a29]">
                          {Object.entries(currentChar.stats).map(([k, v]) => (
                            <div key={k} className="bg-[#0a0d15] p-0.5 rounded border border-[#171e2e]">
                              <span className="text-[#64748b] block text-[8px]">{k}</span>
                              <span className="font-bold text-slate-200">{v}</span>
                            </div>
                          ))}
                        </div>

                        {/* Armas y Ciberware */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <span className="text-[9px] text-[#64748b] uppercase">Arsenal:</span>
                          {(currentChar.equippedWeapons || []).map((w, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 bg-[#121828] border border-amber-900/60 text-amber-200 rounded"
                            >
                              ⚔️ {w.name} ({w.damage})
                            </span>
                          ))}
                          <span className="text-[9px] px-1.5 py-0.5 bg-[#161a28] border border-[#232b40] text-slate-300 rounded">
                            🦾 {currentChar.installedCyberwareIds.length} Ciberimplantes
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ========================================================================
          MODAL DE DOSSIER OFICIAL & 66 SKILLS CANÓNICAS (CEMK 2077)
      ======================================================================== */}
      {viewingDossierCharId && (() => {
        const modalChar =
          characters.find((c) => c.id === viewingDossierCharId) ||
          CEMK_FOLIO_PREMADE_CHARACTERS.find((c) => c.id === viewingDossierCharId) ||
          buildCemk2077Characters().find((c) => c.id === viewingDossierCharId);
        const modalMeta = CEMK_FOLIO_METADATA_MAP[viewingDossierCharId];

        if (!modalChar) return null;

        const skillsList = modalMeta?.fullSkillsTable || (modalChar.skills ? Object.entries(modalChar.skills).map(([sName, lvl]) => ({
          name: sName,
          stat: 'SKILL',
          lvl: Number(lvl) || 0,
          lvlStr: String(lvl),
          base: Number(lvl) || 0
        })) : []);

        const filteredSkills = skillsList.filter((sk) => {
          const matchesSearch = sk.name.toLowerCase().includes(skillSearchQuery.toLowerCase());
          const matchesStat = skillStatFilter === 'ALL' || sk.stat.toUpperCase() === skillStatFilter.toUpperCase();
          return matchesSearch && matchesStat;
        });

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-mono-code">
            <div className="bg-[#0b0e17] border border-cyan-500/80 p-4 sm:p-6 rounded-xs max-w-4xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-2xl">
              
              {/* Header Modal */}
              <div className="flex items-start justify-between border-b border-[#1f293d] pb-3">
                <div className="flex items-center gap-3">
                  {modalMeta?.tokenUrl ? (
                    <img
                      src={modalMeta.tokenUrl}
                      alt={modalMeta.name}
                      className="w-14 h-14 rounded object-cover border-2 border-cyan-400 shadow-md bg-[#090b12]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded bg-cyan-950 border-2 border-cyan-500 flex items-center justify-center font-bold text-cyan-300 font-tech text-lg">
                      {modalChar.handle.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-tech text-lg font-bold text-white uppercase tracking-wider">
                        {modalMeta ? modalMeta.name : modalChar.handle}
                      </h3>
                      <span className="text-xs px-2 py-0.5 bg-cyan-950 border border-cyan-600 text-cyan-300 font-bold rounded">
                        {modalChar.role} {modalChar.roleRank}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-400 font-medium">
                      {modalMeta?.archetype2077 || modalChar.roleAbilityName}
                    </p>
                    <span className="text-[10px] text-[#64748b]">
                      Folio Oficial CEMK 2077 • ID: {modalChar.id}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setViewingDossierCharId(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Contenido Scrolleable */}
              <div className="overflow-y-auto space-y-4 pr-1 text-xs">
                
                {/* 1. Trasfondo & Biografía */}
                {modalMeta?.backstory && (
                  <div className="bg-[#0f1320] border border-[#1f293d] p-3 rounded space-y-1">
                    <span className="font-tech text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      📖 BIOGRAFÍA Y TRASFONDO CANÓNICO (PÁGINA 1-2 DEL FOLIO)
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {modalMeta.backstory}
                    </p>
                  </div>
                )}

                {/* 2. Reglas de Rol y Combate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-[#0f1320] border border-[#1f293d] p-2.5 rounded space-y-1">
                    <span className="font-tech text-[11px] font-bold text-cyan-400 uppercase block">
                      ⚡ HABILIDAD DE ROL: {modalChar.roleAbilityName} (RANGO {modalChar.roleRank})
                    </span>
                    <p className="text-slate-300 text-[10px] leading-relaxed">
                      {modalMeta?.roleAbilitySummary || modalChar.notes}
                    </p>
                  </div>
                  <div className="bg-[#0f1320] border border-[#1f293d] p-2.5 rounded space-y-1">
                    <span className="font-tech text-[11px] font-bold text-cyan-400 uppercase block">
                      🎯 ESTILO TÁCTICO & ARSENAL
                    </span>
                    <p className="text-slate-300 text-[10px] leading-relaxed">
                      {modalMeta?.combatStyle || 'Especialista en combate urbano y operaciones callejeras.'}
                    </p>
                  </div>
                </div>

                {/* 3. Equipamiento Resumido */}
                {modalMeta?.equipmentSummary && (
                  <div className="bg-[#0f1320] border border-[#1f293d] p-2.5 rounded space-y-1.5">
                    <span className="font-tech text-[11px] font-bold text-cyan-400 uppercase block">
                      📦 EQUIPO Y CIBERWARE CANÓNICO (PÁGINA 3-4 DEL FOLIO)
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-slate-300">
                      {modalMeta.equipmentSummary.map((eq, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 bg-[#090b12] p-1.5 rounded border border-[#171e2e]">
                          <span className="text-cyan-400">•</span>
                          <span>{eq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 4. Tabla de 66 Habilidades Canónicas */}
                <div className="bg-[#090b12] border border-[#1f293d] p-3 rounded space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#182033] pb-2">
                    <span className="font-tech text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      📊 MATRIZ CANÓNICA DE HABILIDADES ({skillsList.length} SKILLS — LVL + STAT = BASE)
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={skillSearchQuery}
                          onChange={(e) => setSkillSearchQuery(e.target.value)}
                          placeholder="Buscar skill..."
                          className="bg-[#121624] border border-[#232f48] text-white text-[10px] px-2 py-1 rounded w-36 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filtros rápidos por STAT */}
                  <div className="flex flex-wrap items-center gap-1 text-[9px]">
                    {['ALL', 'INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'EMP', 'BODY'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setSkillStatFilter(st)}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                          skillStatFilter === st
                            ? 'bg-cyan-600 text-white font-bold'
                            : 'bg-[#121624] text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Tabla */}
                  <div className="max-h-64 overflow-y-auto border border-[#171e2e] rounded">
                    <table className="w-full text-left text-[10px]">
                      <thead className="bg-[#121624] text-[#94a3b8] uppercase sticky top-0 border-b border-[#1f293d]">
                        <tr>
                          <th className="p-1.5">Habilidad</th>
                          <th className="p-1.5 text-center">Stat</th>
                          <th className="p-1.5 text-center">Nivel (LVL)</th>
                          <th className="p-1.5 text-center">Valor Stat</th>
                          <th className="p-1.5 text-center font-bold text-cyan-300">Base Canónica</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#141a29]">
                        {filteredSkills.map((sk, idx) => {
                          const statVal = modalChar.stats[sk.stat as keyof typeof modalChar.stats] ?? (sk.base - sk.lvl);
                          const isTrained = sk.lvl > 0;
                          return (
                            <tr
                              key={idx}
                              className={`transition-colors ${
                                isTrained
                                  ? 'bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-100 font-medium'
                                  : 'hover:bg-[#101420] text-slate-400'
                              }`}
                            >
                              <td className="p-1.5 font-medium flex items-center gap-1">
                                {isTrained && <span className="text-cyan-400">✦</span>}
                                <span>{sk.name}</span>
                              </td>
                              <td className="p-1.5 text-center text-[#94a3b8] font-mono">{sk.stat}</td>
                              <td className="p-1.5 text-center font-bold">
                                {isTrained ? (
                                  <span className="text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/60">
                                    {sk.lvlStr || sk.lvl}
                                  </span>
                                ) : (
                                  <span className="text-slate-500">—</span>
                                )}
                              </td>
                              <td className="p-1.5 text-center text-slate-400">{statVal}</td>
                              <td className="p-1.5 text-center font-bold text-white bg-[#0e1320]">
                                {sk.base}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Footer Modal */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1f293d]">
                <button
                  onClick={() => {
                    setActiveCharacter(modalChar.id);
                    setViewingDossierCharId(null);
                    showToast(`🎮 Ahora jugando como ${modalChar.handle}`, 'success');
                  }}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold text-xs rounded transition-all cursor-pointer shadow-lg shadow-cyan-950"
                >
                  🎮 SELECCIONAR Y JUGAR CON ESTE PERSONAJE
                </button>
                <button
                  onClick={() => setViewingDossierCharId(null)}
                  className="px-3 py-1.5 bg-[#182030] hover:bg-[#222c42] text-slate-300 text-xs rounded transition-all cursor-pointer"
                >
                  Cerrar Dossier
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================================
          MODAL DE QUICKHACKS 2077
      ======================================================================== */}
      {activeQuickhackModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b0e17] border border-amber-500/60 p-4 rounded-xs max-w-xl w-full space-y-3 shadow-2xl font-mono-code">
            <div className="flex items-center justify-between border-b border-[#1f293d] pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="font-tech text-sm font-bold text-white uppercase">
                  LANZADOR DE QUICKHACKS 2077 // NEUROPORT TARGETING
                </h3>
              </div>
              <button
                onClick={() => setActiveQuickhackModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-[#94a3b8]">
              Los enemigos tienen Neuroport militar integrado. Selecciona un Quickhack para ejecutar desde el Cyberdeck de {activeChar.handle}:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {QUICKHACKS_2077_CATALOG.slice(0, 8).map((qh) => (
                <button
                  key={qh.id}
                  onClick={() => {
                    const d10 = Math.floor(Math.random() * 10) + 1;
                    const interfaceRank = activeChar.roleRank || 4;
                    const rollTotal = d10 + interfaceRank;
                    const success = rollTotal >= qh.dv;
                    const targetEnemy = activeEnemies.find(e => e.instanceId === activeQuickhackModal) || activeEnemies[0];

                    if (success && qh.damage && targetEnemy) {
                      const dmg = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
                      handleEnemyHpDelta(targetEnemy.instanceId, -dmg);
                      showToast(`⚡ ${qh.name} ÉXITO (${rollTotal} vs DV ${qh.dv})! ${dmg} daño a ${targetEnemy.name}.`, 'success');
                    } else if (success) {
                      showToast(`⚡ ${qh.name} ÉXITO (${rollTotal} vs DV ${qh.dv}) aplicado con éxito!`, 'success');
                    } else {
                      showToast(`❌ Quickhack ${qh.name} bloqueado (${rollTotal} vs DV ${qh.dv}).`, 'warn');
                    }
                    setActiveQuickhackModal(null);
                  }}
                  className="bg-[#121624] hover:bg-[#1c2438] border border-[#232f48] p-2 rounded text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-tech text-xs font-bold text-white group-hover:text-amber-300">
                      {qh.name}
                    </span>
                    <span className="text-[9px] text-amber-400 font-bold bg-amber-950/60 px-1 rounded">
                      DV {qh.dv}
                    </span>
                  </div>
                  <span className="text-[9px] text-cyan-400 block">
                    RAM: {qh.ramCost} | {qh.duration}
                  </span>
                  <p className="text-[9px] text-[#94a3b8] line-clamp-2 mt-0.5">
                    {qh.effect}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1f293d]">
              <button
                onClick={() => setActiveQuickhackModal(null)}
                className="px-3 py-1 bg-[#182030] hover:bg-[#222c42] text-slate-300 text-xs rounded transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
