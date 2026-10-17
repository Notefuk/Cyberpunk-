import React, { useState, useMemo } from 'react';
import {
  Train,
  Shield,
  Zap,
  Terminal,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle2,
  RotateCcw,
  Crosshair,
  Users,
  Dices,
  BookOpen,
  Lock,
  Unlock,
  Package,
  DollarSign,
  Heart,
  Skull,
  Award
} from 'lucide-react';
import { useCharacterStore } from '../../store/useCharacterStore';
import {
  RED_CHROME_SCREAMSHEET,
  RED_CHROME_BRIEFING,
  RED_CHROME_SKILL_CHECKS,
  HAMMERHEAD_MAINFRAME_NET,
  RED_CHROME_ENEMY_PROFILES,
  HAMMERHEAD_TRAIN_CARS,
  INITIAL_TRAIN_TOKENS,
  type RedChromeSkillCheck
} from '../../data/redChromeCargoData';
import { QUICKHACKS_2077_CATALOG } from '../../data/netAndRolesData';

type MainTab = 'screamsheet' | 'train_map' | 'mainframe' | 'crates';

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
  quickhackTargeted: boolean;
  statusEffects: string[];
}

export const RedChromeCargoView: React.FC = () => {
  const {
    characters,
    getActiveCharacter,
    loadCemk2077PartyRoster,
    gmPayAllCharacters
  } = useCharacterStore();

  const activeChar = getActiveCharacter();

  // ============================================================================
  // ESTADO GENERAL DEL ONESHOT
  // ============================================================================
  const [activeTab, setActiveTab] = useState<MainTab>('screamsheet');
  const [partySize, setPartySize] = useState<number>(4);
  const [conversionMode, setConversionMode] = useState<'2077' | '2045'>('2077');
  const [isTrainAlerted, setIsTrainAlerted] = useState<boolean>(false);
  const [isPlayerMode, setIsPlayerMode] = useState<boolean>(false);
  const [screamsheetLang, setScreamsheetLang] = useState<'es' | 'en'>('es');
  const [turretStatus, setTurretStatus] = useState<'offline' | 'hostile' | 'hacked'>('offline');
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // ============================================================================
  // CÁLCULO DE ESCALADO POR JUGADORES (PÁG. 4)
  // ============================================================================
  const rearGuardsCount = partySize >= 5 ? 3 : 2;
  const frontGuardsCount = Math.max(1, partySize - 1);

  // ============================================================================
  // TRACKER DE ENEMIGOS EN VIVO
  // ============================================================================
  const [activeEnemies, setActiveEnemies] = useState<ActiveEnemyInstance[]>([]);
  const [selectedEnemyId, setSelectedEnemyId] = useState<string | null>(null);
  const [activeQuickhackModal, setActiveQuickhackModal] = useState<string | null>(null);

  // Spawner de Vagón Trasero
  const handleSpawnRearCar = () => {
    const profile = RED_CHROME_ENEMY_PROFILES.rcl_shotgun_guard;
    const variant = conversionMode === '2077' ? profile.variant2077Cemk : profile.variant2045;
    const newEnemies: ActiveEnemyInstance[] = [];

    for (let i = 1; i <= rearGuardsCount; i++) {
      newEnemies.push({
        instanceId: `enemy-rear-${Date.now()}-${i}`,
        templateKey: 'rcl_shotgun_guard',
        name: `RCL Guard #${i} (${variant.name.split('(')[1]?.replace(')', '') || variant.era})`,
        carId: 'rear',
        currentHp: variant.hp,
        maxHp: variant.hp,
        headSp: variant.headSp,
        bodySp: variant.bodySp,
        initiative: null,
        mode: conversionMode,
        quickhackTargeted: false,
        statusEffects: []
      });
    }

    // Filtrar guardias previos del vagón trasero y añadir los nuevos
    setActiveEnemies(prev => [...prev.filter(e => e.carId !== 'rear'), ...newEnemies]);
    showToast(`⚔️ Desplegados ${rearGuardsCount} guardias en el Vagón Trasero (Modo ${conversionMode.toUpperCase()}).`, 'info');
  };

  // Spawner de Vagón Delantero (Guardias + Oficial + Torreta)
  const handleSpawnFrontCar = () => {
    const guardProfile = RED_CHROME_ENEMY_PROFILES.rcl_shotgun_guard;
    const officerProfile = RED_CHROME_ENEMY_PROFILES.rcl_officer;
    const turretProfile = RED_CHROME_ENEMY_PROFILES.hammerhead_turret;

    const guardVariant = conversionMode === '2077' ? guardProfile.variant2077Cemk : guardProfile.variant2045;
    const officerVariant = conversionMode === '2077' ? officerProfile.variant2077Cemk : officerProfile.variant2045;
    const turretVariant = turretProfile.variant2045;

    const newEnemies: ActiveEnemyInstance[] = [];

    // Guardias del vagón delantero
    for (let i = 1; i <= frontGuardsCount; i++) {
      newEnemies.push({
        instanceId: `enemy-front-guard-${Date.now()}-${i}`,
        templateKey: 'rcl_shotgun_guard',
        name: `RCL Escolta #${i}`,
        carId: 'front',
        currentHp: guardVariant.hp,
        maxHp: guardVariant.hp,
        headSp: guardVariant.headSp,
        bodySp: guardVariant.bodySp,
        initiative: null,
        mode: conversionMode,
        quickhackTargeted: false,
        statusEffects: []
      });
    }

    // Oficial Teniente
    newEnemies.push({
      instanceId: `enemy-front-officer-${Date.now()}`,
      templateKey: 'rcl_officer',
      name: `RCL Oficial Teniente (${officerVariant.role})`,
      carId: 'front',
      currentHp: officerVariant.hp,
      maxHp: officerVariant.hp,
      headSp: officerVariant.headSp,
      bodySp: officerVariant.bodySp,
      initiative: null,
      mode: conversionMode,
      quickhackTargeted: false,
      statusEffects: ['Kerenzikov (+2 Init)']
    });

    // Torreta Automática
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
      mode: '2045',
      quickhackTargeted: false,
      statusEffects: [turretStatus === 'hacked' ? 'CONTROL NETRUNNER' : turretStatus === 'hostile' ? 'ACTIVA HOSTIL' : 'APAGADA']
    });

    setActiveEnemies(prev => [...prev.filter(e => e.carId !== 'front'), ...newEnemies]);
    showToast(`⚔️ Desplegados ${frontGuardsCount} Guardias + 1 Oficial + Torreta en el Vagón Delantero.`, 'info');
  };

  const handleResetAllEnemies = () => {
    setActiveEnemies([]);
    setSelectedEnemyId(null);
    showToast('🔄 Se han limpiado todos los enemigos del tren.', 'warn');
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
      if (loc === 'head') {
        return { ...e, headSp: Math.max(0, e.headSp + delta) };
      }
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
    const d10 = Math.floor(Math.random() * 10) + 1;
    const total = d10 + ref + bonus;

    setActiveEnemies(prev => prev.map(e => e.instanceId === instId ? { ...e, initiative: total } : e));
    showToast(`🎲 Iniciativa de ${enemy.name}: 1d10 (${d10}) + REF (${ref})${bonus ? ' + Kerenzikov (2)' : ''} = ${total}`, 'info');
  };

  // ============================================================================
  // ESTACIÓN DE PRUEBAS DE ESCENA (DVs)
  // ============================================================================
  const [selectedRollerCharId, setSelectedRollerCharId] = useState<string>(activeChar.id);
  const rollerChar = useMemo(() => {
    return characters.find(c => c.id === selectedRollerCharId) || activeChar;
  }, [characters, selectedRollerCharId, activeChar]);

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

  const handleExecuteSkillCheck = (check: RedChromeSkillCheck) => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    const isExplode = d10 === 10;
    const isFumble = d10 === 1;
    const extraDie = isExplode ? (Math.floor(Math.random() * 10) + 1) : isFumble ? (Math.floor(Math.random() * 10) + 1) : 0;

    const statVal = rollerChar.stats[check.stat] || 5;
    // Map skill name to character skills
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

    // Consecuencia canónica para Salto entre Trenes
    if (check.id === 'jump_train' && !success) {
      setIsTrainAlerted(true);
      setTurretStatus('hostile');
      textMessage += ' 🚨 ¡ALARMA GENERAL ACTIVADA! La torreta de techo se ha encendido en modo HOSTIL.';
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
  // TRACKER DE TOKENS Y POSICIÓN EN LOS 4 VAGONES
  // ============================================================================
  const tokenPositions: Record<string, 'rear' | 'middle' | 'front' | 'driver'> = {
    'token-hatch': 'rear',
    'token-net-port': 'middle',
    'token-cargo-crates': 'middle',
    'token-turret-control': 'front',
    'token-turret': 'front',
    'token-train-control': 'driver'
  };

  const [pcLocations, setPcLocations] = useState<Record<string, 'roof' | 'rear' | 'middle' | 'front' | 'driver'>>(() => {
    const locs: Record<string, 'roof' | 'rear' | 'middle' | 'front' | 'driver'> = {};
    characters.forEach(c => {
      locs[c.id] = 'rear';
    });
    return locs;
  });

  const handleMovePcCar = (pcId: string, nextCar: 'roof' | 'rear' | 'middle' | 'front' | 'driver') => {
    setPcLocations(prev => ({ ...prev, [pcId]: nextCar }));
    const char = characters.find(c => c.id === pcId);
    showToast(`🏃 ${char?.handle || 'Operativo'} se desplazó a: ${nextCar.toUpperCase()}`, 'info');
  };

  // ============================================================================
  // MAINFRAME NET INTERACTIVO (5 PISOS)
  // ============================================================================
  const [mainframeProgress, setMainframeProgress] = useState<{
    unlockedFloors: number[];
    hellhoundRez: number;
    manifestRevealed: boolean;
    netActionLog: string[];
  }>({
    unlockedFloors: [],
    hellhoundRez: 20,
    manifestRevealed: false,
    netActionLog: ['[NET] Interfaz con cable físico (Interface Plugs) disponible en Middle Car.']
  });

  const handleNetAction = (floorNumber: number, actionType: 'backdoor' | 'eye_dee' | 'zap' | 'hellhound_atk' | 'control') => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    const interfaceRank = activeChar.roleRank || 4;
    const totalRoll = d10 + interfaceRank;

    if (actionType === 'backdoor') {
      const dv = floorNumber === 1 ? 6 : 8;
      const pass = totalRoll >= dv;
      setMainframeProgress(prev => ({
        ...prev,
        unlockedFloors: pass ? [...new Set([...prev.unlockedFloors, floorNumber])] : prev.unlockedFloors,
        netActionLog: [
          `[Piso ${floorNumber}] Backdoor vs DV ${dv}: 1d10 (${d10}) + Interface (${interfaceRank}) = ${totalRoll}. ${pass ? '¡ACCESO CONCEDIDO!' : 'ACCESO DENEGADO (Password intacto).'}` ,
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
          `[Piso 2] Eye-Dee en Manifiesto: ${totalRoll} vs DV 8. ${pass ? '¡ARCHIVO DESCIFRADO! Manifiesto de Militech abierto.' : 'Cifrado denegado.'}`,
          ...prev.netActionLog
        ]
      }));
      showToast(pass ? '📜 Manifiesto militar de Militech descifrado.' : 'Fallo al descifrar archivo.', pass ? 'success' : 'warn');
    } else if (actionType === 'zap') {
      const zapDamage = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
      const nextRez = Math.max(0, mainframeProgress.hellhoundRez - zapDamage);
      const isDefeated = nextRez === 0;

      setMainframeProgress(prev => ({
        ...prev,
        hellhoundRez: nextRez,
        unlockedFloors: isDefeated ? [...new Set([...prev.unlockedFloors, 4])] : prev.unlockedFloors,
        netActionLog: [
          `[Piso 4] Netrunner lanza Zap a Hellhound por ${zapDamage} de daño. REZ restante: ${nextRez}/20.${isDefeated ? ' ¡HELLHOUND DESREZZADO Y DESTRUIDO!' : ''}`,
          ...prev.netActionLog
        ]
      }));
      showToast(isDefeated ? '💥 ¡Black ICE Hellhound destruido!' : `⚡ Hellhound recibió ${zapDamage} daño.`, 'info');
    } else if (actionType === 'hellhound_atk') {
      const hellRoll = Math.floor(Math.random() * 10) + 1 + 6; // ATK 6
      const directBrainDmg = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1; // 2d6
      setMainframeProgress(prev => ({
        ...prev,
        netActionLog: [
          `[Piso 4] ¡Hellhound ataca con Colmillos de Fuego! Tirada: ${hellRoll} vs Defensa Netrunner. Si impacta, causa ${directBrainDmg} DAÑO DIRECTO AL CEREBRO e incendia el Cyberdeck/Ropa (2 dmg/turno).`,
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
            `[Piso 5] Control Node vs DV 8: ${totalRoll}. ¡ÉXITO ROTUNDO! La Torreta Automática del Vagón Delantero pasa a ser CONTROLADA POR EL NETRUNNER.`,
            ...prev.netActionLog
          ]
        }));
        showToast('🟢 ¡TORRETA DELANTERA HACKEADA! Ahora dispara a los guardias de la Legion.', 'success');
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
  // GESTIÓN DE LAS 4 CAJAS DE HORNET & PAGO FINAL
  // ============================================================================
  const [cratesState, setCratesState] = useState([
    {
      id: 'crate-1',
      title: 'Caja 1: Explosivos Militares Iron Sights',
      content: 'C-6 plástico militar, detonadores electromagnéticos y granadas de pulso EMP.',
      carriedByCharId: null as string | null,
      isSecuredOnHornetTrain: false
    },
    {
      id: 'crate-2',
      title: 'Caja 2: Cyberware Pesado Iron Sights',
      content: 'Brazos hidráulicos Gorilla Arms, blindaje dérmico Subdermal Armorjack y chips Sandevistan.',
      carriedByCharId: null as string | null,
      isSecuredOnHornetTrain: false
    },
    {
      id: 'crate-3',
      title: 'Caja 3: Munición y Armas Pesadas Militech',
      content: 'Fusiles de asalto Masamune, subfusiles inteligentes y 1,000 cartuchos perforantes.',
      carriedByCharId: null as string | null,
      isSecuredOnHornetTrain: false
    },
    {
      id: 'crate-4',
      title: 'Caja 4: Cilindros de Neurotoxina de Hornet',
      content: 'PELIGRO BIOLÓGICO: 6 cilindros herméticos de neurotoxina letal sin sellos corporativos.',
      carriedByCharId: null as string | null,
      isSecuredOnHornetTrain: false,
      isBiohazard: true
    }
  ]);

  const [isMissionFinished, setIsMissionFinished] = useState<boolean>(false);

  const handleAssignCrateCarrier = (crateId: string, charId: string | null) => {
    setCratesState(prev => prev.map(c => c.id === crateId ? { ...c, carriedByCharId: charId } : c));
    const char = characters.find(x => x.id === charId);
    showToast(charId ? `📦 Caja asignada a ${char?.handle}. Recuerda: ocupa las 2 MANOS.` : 'Caja dejada en el suelo.', 'info');
  };

  const handleToggleSecureCrate = (crateId: string) => {
    setCratesState(prev => prev.map(c => c.id === crateId ? { ...c, isSecuredOnHornetTrain: !c.isSecuredOnHornetTrain } : c));
  };

  const handleCompleteMissionHornet = () => {
    gmPayAllCharacters(2000, 'Recompensa Fixer Hornet — Red Chrome Cargo');
    setIsMissionFinished(true);
    showToast('💰 ¡MISIÓN CUMPLIDA! Se acreditaron +2,000 €$ a cada miembro del Roster.', 'success');
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className={`p-3 rounded-xs font-mono-code text-xs font-bold border transition-all flex items-center justify-between shadow-lg ${
          feedbackToast.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
            : feedbackToast.type === 'warn'
            ? 'bg-red-950/90 border-red-500 text-red-200'
            : 'bg-cyan-950/90 border-cyan-500 text-cyan-200'
        }`}>
          <span>{feedbackToast.message}</span>
          <button onClick={() => setFeedbackToast(null)} className="text-white hover:opacity-75 cursor-pointer ml-3">✕</button>
        </div>
      )}

      {/* ========================================================================
          BARRA DE CONTROL SUPERIOR DEL ONESHOT
      ======================================================================== */}
      <div className="bg-[#0e111a] border border-[#1e2436] p-4 rounded-xs shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1a2030] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-red-600/20 border border-red-500 flex items-center justify-center text-red-500">
              <Train className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white font-tech font-black text-[10px] px-2 py-0.5 rounded-2xs uppercase tracking-widest">
                  ONESHOT CANÓNICO
                </span>
                <span className="text-xs font-mono-code text-[#64748b]">CPRED Screamsheet Adventure</span>
              </div>
              <h1 className="font-tech text-xl font-black text-white tracking-wider flex items-center gap-2 uppercase">
                RED CHROME CARGO // THE HAMMERHEAD
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Botón Recargar CEMK 2077 Roster */}
            <button
              onClick={() => {
                loadCemk2077PartyRoster();
                showToast('👥 Roster de CEMK 2077 (David, Lucy, Rebecca, Maine, Kiwi, Falco, Pilar) recargado de serie.', 'success');
              }}
              className="py-1.5 px-3 bg-[#161d2d] hover:bg-[#202b42] text-cyan-400 border border-cyan-500/40 rounded-xs font-mono-code text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Añade automáticamente a los 7 personajes pregenerados de Edgerunners 2077"
            >
              <Users className="w-3.5 h-3.5" />
              <span>CARGAR 7 EDGERUNNERS CEMK</span>
            </button>

            {/* Toggle Modo Jugadores / Modo GM */}
            <button
              onClick={() => setIsPlayerMode(!isPlayerMode)}
              className={`py-1.5 px-3 rounded-xs font-mono-code text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isPlayerMode
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-[#181a24] border-[#2e344a] text-slate-300 hover:border-slate-400'
              }`}
            >
              {isPlayerMode ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPlayerMode ? 'MODO JUGADORES ACTIVO' : 'VISTA COMPLETA GM'}</span>
            </button>
          </div>
        </div>

        {/* Parámetros Tácticos de la Escena */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Selector de Jugadores */}
          <div className="bg-[#121622] border border-[#1b2234] p-2.5 rounded-xs space-y-1">
            <span className="text-[10px] font-mono-code text-[#64748b] uppercase block">
              JUGADORES EN MESA ({partySize} PJs)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="2"
                max="7"
                value={partySize}
                onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <span className="font-mono-code font-black text-sm text-red-400 px-2 py-0.5 bg-[#090b10] border border-[#232a3e] rounded">
                {partySize}
              </span>
            </div>
            <p className="text-[9px] font-mono-code text-[#94a3b8]">
              Trasero: {rearGuardsCount} Guardias | Delantero: {frontGuardsCount} Guardias + 1 Oficial
            </p>
          </div>

          {/* Selector de Conversión */}
          <div className="bg-[#121622] border border-[#1b2234] p-2.5 rounded-xs space-y-1">
            <span className="text-[10px] font-mono-code text-[#64748b] uppercase block">
              CONVERSIÓN DE ENEMIGOS
            </span>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setConversionMode('2077')}
                className={`py-1 text-[10px] font-mono-code font-bold rounded-xs transition-all cursor-pointer border ${
                  conversionMode === '2077'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-[#181d2a] border-[#222a3e] text-[#64748b]'
                }`}
              >
                ⚡ 2077 CEMK
              </button>
              <button
                onClick={() => setConversionMode('2045')}
                className={`py-1 text-[10px] font-mono-code font-bold rounded-xs transition-all cursor-pointer border ${
                  conversionMode === '2045'
                    ? 'bg-red-500/20 border-red-500 text-red-300'
                    : 'bg-[#181d2a] border-[#222a3e] text-[#64748b]'
                }`}
              >
                📕 2045 CORE
              </button>
            </div>
            <p className="text-[9px] font-mono-code text-[#94a3b8]">
              {conversionMode === '2077' ? 'SP 11, Satara/Carnage Tech & Neuroport' : 'SP 4 Leathers, Escopetas Core estándar'}
            </p>
          </div>

          {/* Estado de Alerta */}
          <div className="bg-[#121622] border border-[#1b2234] p-2.5 rounded-xs space-y-1">
            <span className="text-[10px] font-mono-code text-[#64748b] uppercase block">
              ALERTA DEL HAMMERHEAD
            </span>
            <button
              onClick={() => {
                const nextAlert = !isTrainAlerted;
                setIsTrainAlerted(nextAlert);
                if (nextAlert) setTurretStatus('hostile');
              }}
              className={`w-full py-1 px-2 text-xs font-mono-code font-bold rounded-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                isTrainAlerted
                  ? 'bg-red-600/30 border-red-500 text-red-200 animate-pulse'
                  : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
              }`}
            >
              {isTrainAlerted ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> : <Shield className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isTrainAlerted ? '🚨 TREN EN ALERTA' : '🟢 ENTRADA SIGILOSA'}</span>
            </button>
            <p className="text-[9px] font-mono-code text-[#94a3b8]">
              {isTrainAlerted ? 'Guardias prevenidos y torreta hostil' : 'Guardias desprevenidos (-2 Percepción)'}
            </p>
          </div>

          {/* Estado de Torreta */}
          <div className="bg-[#121622] border border-[#1b2234] p-2.5 rounded-xs space-y-1">
            <span className="text-[10px] font-mono-code text-[#64748b] uppercase block">
              TORRETA AUTOMÁTICA [⬢]
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setTurretStatus('offline')}
                className={`py-1 text-[9px] font-mono-code font-bold rounded-xs cursor-pointer border ${
                  turretStatus === 'offline' ? 'bg-slate-700 border-slate-500 text-white' : 'bg-[#181d2a] border-[#222a3e] text-[#64748b]'
                }`}
              >
                OFFLINE
              </button>
              <button
                onClick={() => setTurretStatus('hostile')}
                className={`py-1 text-[9px] font-mono-code font-bold rounded-xs cursor-pointer border ${
                  turretStatus === 'hostile' ? 'bg-red-600 border-red-400 text-white' : 'bg-[#181d2a] border-[#222a3e] text-[#64748b]'
                }`}
              >
                HOSTIL
              </button>
              <button
                onClick={() => setTurretStatus('hacked')}
                className={`py-1 text-[9px] font-mono-code font-bold rounded-xs cursor-pointer border ${
                  turretStatus === 'hacked' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-[#181d2a] border-[#222a3e] text-[#64748b]'
                }`}
              >
                HACKEADA
              </button>
            </div>
            <p className="text-[9px] font-mono-code text-[#94a3b8]">
              {turretStatus === 'hacked' ? '🟢 Dispara a los enemigos' : turretStatus === 'hostile' ? '🔴 Dispara a los jugadores' : '⚪ Apagada'}
            </p>
          </div>
        </div>

        {/* Pestañas de Navegación del Oneshot */}
        <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-[#1a2030]">
          <button
            onClick={() => setActiveTab('screamsheet')}
            className={`py-2 px-4 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'screamsheet'
                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                : 'bg-[#121622] text-[#94a3b8] border-[#1f2638] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. SCREAMSHEET & BRIEFING</span>
          </button>

          <button
            onClick={() => setActiveTab('train_map')}
            className={`py-2 px-4 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'train_map'
                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                : 'bg-[#121622] text-[#94a3b8] border-[#1f2638] hover:text-white'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>2. MAPA DEL TREN & COMBATE (PÁG. 4)</span>
          </button>

          <button
            onClick={() => setActiveTab('mainframe')}
            className={`py-2 px-4 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'mainframe'
                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                : 'bg-[#121622] text-[#94a3b8] border-[#1f2638] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>3. HAMMERHEAD MAINFRAME (NET 5 PISOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('crates')}
            className={`py-2 px-4 rounded-xs font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'crates'
                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                : 'bg-[#121622] text-[#94a3b8] border-[#1f2638] hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>4. CAJAS & PAGO DE HORNET (2,000 €$)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================
          PESTAÑA 1: SCREAMSHEET & BRIEFING
      ======================================================================== */}
      {activeTab === 'screamsheet' && (
        <div className="space-y-4 animate-fade-in">
          {/* Periódico Digital Night City Today */}
          <div className="bg-[#0b0c10] border border-[#222634] p-5 rounded-xs shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-red-600 pb-3 gap-2">
              <div>
                <span className="font-mono-code text-[11px] font-bold text-red-500 tracking-widest block">
                  NIGHT CITY TODAY NEWS // EDITION 9:37 AM
                </span>
                <h2 className="font-tech text-2xl font-black text-white uppercase tracking-tight">
                  {RED_CHROME_SCREAMSHEET.headline}
                </h2>
                <span className="text-xs font-mono-code text-[#64748b]">
                  {RED_CHROME_SCREAMSHEET.byline} — Exclusiva de Guerra de Pandillas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScreamsheetLang('es')}
                  className={`px-3 py-1 text-xs font-mono-code font-bold rounded-xs cursor-pointer border ${
                    screamsheetLang === 'es' ? 'bg-red-600 text-white border-red-500' : 'bg-[#161a26] text-[#94a3b8] border-[#22283a]'
                  }`}
                >
                  ESPAÑOL
                </button>
                <button
                  onClick={() => setScreamsheetLang('en')}
                  className={`px-3 py-1 text-xs font-mono-code font-bold rounded-xs cursor-pointer border ${
                    screamsheetLang === 'en' ? 'bg-red-600 text-white border-red-500' : 'bg-[#161a26] text-[#94a3b8] border-[#22283a]'
                  }`}
                >
                  ENGLISH
                </button>
              </div>
            </div>

            {/* Texto del Periódico */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3 font-sans text-sm text-[#cbd5e1] leading-relaxed">
                {(screamsheetLang === 'es' ? RED_CHROME_SCREAMSHEET.paragraphsEs : RED_CHROME_SCREAMSHEET.paragraphsEn).map((paragraph, idx) => (
                  <p key={idx} className="bg-[#12151f] p-3 rounded-xs border border-[#1d2334]">
                    {paragraph}
                  </p>
                ))}

                <div className="pt-2 flex flex-wrap gap-2">
                  {RED_CHROME_SCREAMSHEET.links.map((link, idx) => (
                    <span key={idx} className="text-xs font-mono-code text-cyan-400 bg-cyan-950/40 border border-cyan-800 px-2 py-0.5 rounded cursor-pointer hover:bg-cyan-900/60 transition-colors">
                      {link}
                    </span>
                  ))}
                </div>
              </div>

              {/* Anuncio Publicitario ZhiraFa Graf 3 */}
              <div className="bg-[#141208] border-2 border-[#eab308] p-4 rounded-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#eab308]/40 pb-2 mb-2">
                    <span className="font-tech text-xs font-black text-[#eab308] uppercase tracking-wider">
                      PUBLICIDAD PATROCINADA
                    </span>
                    <span className="text-[10px] font-mono-code text-[#a1a1aa]">ZHIRAFA HEAVY IND.</span>
                  </div>
                  <h3 className="font-tech text-xl font-black text-white uppercase tracking-wider">
                    {RED_CHROME_SCREAMSHEET.adBanner.brand}
                  </h3>
                  <div className="p-3 bg-[#eab308] text-black font-tech font-black text-center text-sm uppercase my-2 tracking-widest rounded-2xs">
                    {RED_CHROME_SCREAMSHEET.adBanner.slogan}
                  </div>
                  <p className="text-xs font-mono-code text-[#d4d4d8] leading-relaxed">
                    {RED_CHROME_SCREAMSHEET.adBanner.description}
                  </p>
                </div>
                <div className="text-[10px] font-mono-code text-[#71717a] border-t border-[#eab308]/30 pt-2 text-center">
                  Consulte a su distribuidor autorizado de Night City.
                </div>
              </div>
            </div>
          </div>

          {/* Briefing de Hornet para los Jugadores */}
          <div className="bg-[#0e111a] border border-[#1e2436] p-5 rounded-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1b2234] pb-2">
              <Package className="w-5 h-5 text-amber-400" />
              <h3 className="font-tech text-lg font-bold text-white uppercase">
                PLAYER INFORMATION BRIEFING // OFERTA DEL FIXER HORNET
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono-code">
              <div className="bg-[#141824] p-3 rounded-xs border border-[#222a3e]">
                <span className="text-[#64748b] block text-[10px]">FIXER CONTRATISTA</span>
                <strong className="text-white text-sm">{RED_CHROME_BRIEFING.playerBriefing.fixerName}</strong>
                <span className="text-[10px] text-amber-400 block">{RED_CHROME_BRIEFING.playerBriefing.fixerSource}</span>
              </div>
              <div className="bg-[#141824] p-3 rounded-xs border border-[#222a3e]">
                <span className="text-[#64748b] block text-[10px]">PAGO PROMETIDO</span>
                <strong className="text-emerald-400 text-sm font-black">{RED_CHROME_BRIEFING.playerBriefing.payoutPerPlayer} €$ POR OPERATIVO</strong>
                <span className="text-[10px] text-slate-400 block">Al entregar las 4 cajas intactas</span>
              </div>
              <div className="bg-[#141824] p-3 rounded-xs border border-[#222a3e]">
                <span className="text-[#64748b] block text-[10px]">OBJETIVO HOSTIL</span>
                <strong className="text-red-400 text-sm">{RED_CHROME_BRIEFING.playerBriefing.targetGang}</strong>
                <span className="text-[10px] text-red-400/80 block">{RED_CHROME_BRIEFING.playerBriefing.targetGangSource}</span>
              </div>
              <div className="bg-[#141824] p-3 rounded-xs border border-[#222a3e]">
                <span className="text-[#64748b] block text-[10px]">TRANSPORTE MILITAR</span>
                <strong className="text-cyan-400 text-sm">{RED_CHROME_BRIEFING.playerBriefing.trainName}</strong>
                <span className="text-[10px] text-slate-400 block">{RED_CHROME_BRIEFING.playerBriefing.trainType}</span>
              </div>
            </div>

            <div className="bg-[#10141f] p-3 rounded-xs border border-[#1b2336] text-xs font-mono-code text-[#cbd5e1] leading-relaxed space-y-2">
              <p>
                <strong className="text-amber-400">MISIÓN:</strong> {RED_CHROME_BRIEFING.playerBriefing.missionGoal}
              </p>
              <p>
                <strong className="text-cyan-400">DESPLIEGUE:</strong> Hornet proporciona un tren cisterna paralelo que corre a la misma velocidad que The Hammerhead. Los edgerunners deben realizar el salto inicial hacia la pasarela del techo del vagón trasero y descender por la escotilla.
              </p>
            </div>

            {/* NOTAS SECRETAS DEL GM (SOLO VISIBLE SI NO ESTÁ EN MODO JUGADORES) */}
            {!isPlayerMode ? (
              <div className="bg-[#1b1114] border-2 border-red-600/70 p-4 rounded-xs space-y-3">
                <div className="flex items-center justify-between border-b border-red-600/40 pb-2">
                  <div className="flex items-center gap-2 text-red-400 font-tech font-bold text-sm uppercase">
                    <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                    <span>GAMEMASTER CONFIDENTIAL // LA VERDAD SOBRE LAS 4 CAJAS</span>
                  </div>
                  <span className="bg-red-600 text-white text-[10px] font-mono-code px-2 py-0.5 rounded font-black">
                    SOLO GM
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-code">
                  <div className="bg-[#100b0d] p-3 rounded-xs border border-red-900/50">
                    <span className="text-red-400 font-bold block mb-1">CAJAS 1 A 3 (ARMAS Y CROMO):</span>
                    <p className="text-[#e2e8f0] text-[11px] leading-relaxed">
                      {RED_CHROME_BRIEFING.gmSecretNotes.cratesOneToThreeContent}
                    </p>
                  </div>
                  <div className="bg-[#100b0d] p-3 rounded-xs border border-red-900/50">
                    <span className="text-amber-400 font-bold block mb-1">CAJA 4 (NEUROTOXINA DE HORNET):</span>
                    <p className="text-[#e2e8f0] text-[11px] leading-relaxed">
                      {RED_CHROME_BRIEFING.gmSecretNotes.crateFourContent}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-[#251016] rounded border border-red-700/60 text-[11px] font-mono-code text-red-200 leading-relaxed">
                  <strong className="text-white">PELIGRO DE RUPTURA:</strong> {RED_CHROME_BRIEFING.gmSecretNotes.toxicChemicalEffect}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xs text-center text-xs font-mono-code text-emerald-400">
                🔒 Notas confidenciales del Director de Juego ocultas para la pantalla de los jugadores.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================
          PESTAÑA 2: MAPA DEL TREN & COMBATE POR VAGÓN (PÁG. 4)
      ======================================================================== */}
      {activeTab === 'train_map' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 animate-fade-in">
          {/* COLUMNA IZQUIERDA (5 COLS): PLANO ESQUEMÁTICO DE LOS 4 VAGONES */}
          <div className="xl:col-span-5 bg-[#0b0d14] border border-[#1e2436] p-4 rounded-xs space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
              <div>
                <span className="font-tech text-xs font-bold text-cyan-400 uppercase tracking-widest block">
                  SCHEMATIC BLUEPRINT // PÁG. 4
                </span>
                <h3 className="font-tech text-base font-black text-white uppercase">
                  THE HAMMERHEAD CARGO TRAIN
                </h3>
              </div>
              <span className="text-[10px] font-mono-code bg-[#141b29] text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                4 VAGONES
              </span>
            </div>

            {/* ESQUEMA TÁCTICO DE LOS 4 VAGONES CONECTADOS */}
            <div className="space-y-3 font-mono-code text-xs">
              {HAMMERHEAD_TRAIN_CARS.map((car) => {
                const isSelected = selectedEnemyId?.includes(car.carId);
                const pcsInCar = characters.filter(c => pcLocations[c.id] === car.carId);
                const enemiesInCar = activeEnemies.filter(e => e.carId === car.carId);

                return (
                  <div
                    key={car.carId}
                    className={`p-3 rounded-xs border transition-all ${
                      isSelected
                        ? 'bg-[#151c2c] border-cyan-400 shadow-md shadow-cyan-900/30'
                        : 'bg-[#10141f] border-[#1d2538] hover:border-[#2a3650]'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-[#1b2336] pb-1.5 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${enemiesInCar.length > 0 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                        <strong className="text-white font-tech uppercase text-sm tracking-wide">
                          {car.name}
                        </strong>
                      </div>
                      <span className="text-[10px] text-[#64748b]">
                        {car.gridDimensions.width}×{car.gridDimensions.height} casillas
                      </span>
                    </div>

                    <p className="text-[11px] text-[#94a3b8] mb-2 leading-relaxed">
                      {car.description}
                    </p>

                    {/* Features de la página 4 */}
                    <ul className="text-[10px] text-[#cbd5e1] space-y-1 mb-2">
                      {car.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-cyan-400">▪</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Fila de Tokens del Vagón */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1a2132]">
                      <span className="text-[10px] text-[#64748b]">TOKENS:</span>
                      {INITIAL_TRAIN_TOKENS.filter(t => tokenPositions[t.id] === car.carId).map(tok => (
                        <span
                          key={tok.id}
                          className="px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1"
                          style={{ borderColor: tok.color, color: tok.color, backgroundColor: `${tok.color}15` }}
                          title={tok.description}
                        >
                          <span>{tok.symbol}</span>
                          <span>{tok.name}</span>
                        </span>
                      ))}

                      {/* PJs en este vagón */}
                      {pcsInCar.map(pc => (
                        <span
                          key={pc.id}
                          className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded text-[10px] font-bold flex items-center gap-1"
                        >
                          <span>👤</span>
                          <span>{pc.handle}</span>
                        </span>
                      ))}

                      {/* Enemigos en este vagón */}
                      {enemiesInCar.map(en => (
                        <span
                          key={en.instanceId}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                            en.currentHp <= 0
                              ? 'bg-zinc-900 border-zinc-700 text-zinc-500 line-through'
                              : 'bg-red-950/80 border-red-500 text-red-300'
                          }`}
                        >
                          <Skull className="w-3 h-3 text-red-400" />
                          <span>{en.name}</span>
                        </span>
                      ))}
                    </div>

                    {/* Botones de Desplazamiento Rápido de PJs */}
                    <div className="pt-2 flex items-center gap-1 flex-wrap">
                      <span className="text-[9px] text-[#64748b]">Mover PJ a este vagón:</span>
                      {characters.map(pc => (
                        <button
                          key={pc.id}
                          onClick={() => handleMovePcCar(pc.id, car.carId as any)}
                          className={`px-1.5 py-0.5 text-[9px] font-mono-code rounded transition-all cursor-pointer ${
                            pcLocations[pc.id] === car.carId
                              ? 'bg-emerald-500 text-black font-black'
                              : 'bg-[#182030] text-[#94a3b8] hover:text-white'
                          }`}
                        >
                          {pc.handle.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMNA DERECHA (7 COLS): TIRADAS DE ESCENA + TRACKER DE COMBATE */}
          <div className="xl:col-span-7 space-y-4">
            {/* ESTACIÓN DE TIRADAS DE ESCENA (DVs) */}
            <div className="bg-[#0e111a] border border-[#1e2436] p-4 rounded-xs space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1b2234] pb-2 gap-2">
                <div>
                  <span className="font-tech text-xs font-bold text-amber-400 uppercase tracking-widest block">
                    RED CHROME SCENE CHECKS
                  </span>
                  <h3 className="font-tech text-base font-black text-white uppercase">
                    RESOLUCIÓN DE ACCIONES TÁCTICAS (DVs)
                  </h3>
                </div>

                {/* Selector de Personaje que tira */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-code text-[#64748b]">TIRA:</span>
                  <select
                    value={selectedRollerCharId}
                    onChange={(e) => setSelectedRollerCharId(e.target.value)}
                    className="bg-[#141824] border border-[#2a344c] text-white font-mono-code text-xs px-2 py-1 rounded cursor-pointer"
                  >
                    {characters.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.handle} ({c.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botones de las 6 Tiradas Canónicas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {RED_CHROME_SKILL_CHECKS.map((check) => (
                  <button
                    key={check.id}
                    onClick={() => handleExecuteSkillCheck(check)}
                    className="bg-[#121622] hover:bg-[#1a2030] border border-[#1d2538] hover:border-amber-500/50 p-2.5 rounded-xs text-left transition-all group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono-code text-cyan-400 font-bold uppercase">
                          {check.stat} + {check.skill}
                        </span>
                        <span className="font-mono-code text-xs font-black text-amber-400 bg-amber-950/60 border border-amber-800 px-1.5 py-0.2 rounded">
                          DV {check.dv}
                        </span>
                      </div>
                      <p className="font-tech text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                        {check.title}
                      </p>
                    </div>
                    <span className="text-[9px] font-mono-code text-[#64748b] mt-2 block">
                      Tirar 1d10 + stats ➔
                    </span>
                  </button>
                ))}
              </div>

              {/* Resultado de la Última Tirada de Escena */}
              {lastSkillCheckResult && (
                <div className={`p-3 rounded-xs border text-xs font-mono-code transition-all animate-fade-in ${
                  lastSkillCheckResult.success
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                    : 'bg-red-950/80 border-red-500 text-red-200'
                }`}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5 font-bold">
                    <span>{lastSkillCheckResult.checkTitle}</span>
                    <span className="text-sm">
                      {lastSkillCheckResult.success ? '¡ÉXITO!' : 'FALLO'} (Tirada: {lastSkillCheckResult.roll} vs DV {lastSkillCheckResult.dv})
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {lastSkillCheckResult.text}
                  </p>
                </div>
              )}
            </div>

            {/* TRACKER DE COMBATE EN VIVO */}
            <div className="bg-[#0e111a] border border-[#1e2436] p-4 rounded-xs space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1b2234] pb-2 gap-2">
                <div>
                  <span className="font-tech text-xs font-bold text-red-500 uppercase tracking-widest block">
                    LIVE ENEMY COMBAT ENGINE
                  </span>
                  <h3 className="font-tech text-base font-black text-white uppercase flex items-center gap-2">
                    <Skull className="w-4 h-4 text-red-500" />
                    <span>ENEMIGOS ACTIVOS EN EL TREN ({activeEnemies.length})</span>
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={handleSpawnRearCar}
                    className="py-1 px-2.5 bg-red-600 hover:bg-red-500 text-white font-mono-code text-xs font-bold rounded-xs transition-all cursor-pointer shadow-md"
                  >
                    + SPAWN VAGÓN TRASERO ({rearGuardsCount})
                  </button>
                  <button
                    onClick={handleSpawnFrontCar}
                    className="py-1 px-2.5 bg-red-700 hover:bg-red-600 text-white font-mono-code text-xs font-bold rounded-xs transition-all cursor-pointer shadow-md"
                  >
                    + SPAWN VAGÓN DELANTERO ({frontGuardsCount + 2})
                  </button>
                  <button
                    onClick={handleResetAllEnemies}
                    className="py-1 px-2 bg-[#1b2030] hover:bg-[#28324a] text-slate-300 font-mono-code text-xs rounded-xs transition-all cursor-pointer"
                    title="Reiniciar todos los enemigos"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Lista de Enemigos Activos */}
              {activeEnemies.length === 0 ? (
                <div className="text-center py-8 bg-[#121622] rounded-xs border border-dashed border-[#222a3e] space-y-2">
                  <Skull className="w-8 h-8 text-[#475569] mx-auto" />
                  <p className="text-xs font-mono-code text-[#64748b]">
                    No hay enemigos desplegados en el tren todavía.
                  </p>
                  <p className="text-[11px] font-mono-code text-[#475569]">
                    Usa los botones superiores para desplegar los guardias del Vagón Trasero o la escolta del Vagón Delantero.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {activeEnemies.map((enemy) => {
                    const profile = RED_CHROME_ENEMY_PROFILES[enemy.templateKey];
                    const variant = enemy.mode === '2077' ? profile.variant2077Cemk : profile.variant2045;
                    const isDead = enemy.currentHp <= 0;

                    return (
                      <div
                        key={enemy.instanceId}
                        className={`p-3 rounded-xs border transition-all ${
                          isDead
                            ? 'bg-[#10121a]/60 border-zinc-800 opacity-60'
                            : 'bg-[#121624] border-[#222b40] shadow-md'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1c2436] pb-2 mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase ${
                              enemy.templateKey === 'rcl_officer'
                                ? 'bg-amber-950 border border-amber-500 text-amber-300'
                                : enemy.templateKey === 'hammerhead_turret'
                                ? 'bg-cyan-950 border border-cyan-500 text-cyan-300'
                                : 'bg-red-950 border border-red-500 text-red-300'
                            }`}>
                              {enemy.templateKey.replace('rcl_', '').toUpperCase()}
                            </span>
                            <strong className="text-white font-tech text-sm tracking-wide">
                              {enemy.name}
                            </strong>
                            <span className="text-[10px] font-mono-code text-[#64748b]">
                              ({enemy.carId.toUpperCase()} CAR)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Tirar Iniciativa */}
                            <button
                              onClick={() => handleEnemyRollInitiative(enemy.instanceId)}
                              className="px-2 py-1 bg-[#1a2234] hover:bg-cyan-600 hover:text-white text-cyan-300 border border-cyan-800 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Dices className="w-3 h-3" />
                              <span>INIT: {enemy.initiative !== null ? enemy.initiative : '?'}</span>
                            </button>

                            {/* Botón Quickhack */}
                            <button
                              onClick={() => setActiveQuickhackModal(enemy.instanceId)}
                              className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/50 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1"
                              title="Lanzar Quickhack 2077 por Neuroport"
                            >
                              <Zap className="w-3 h-3" />
                              <span>QUICKHACK</span>
                            </button>
                          </div>
                        </div>

                        {/* Barra de Salud y Blindajes */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono-code mb-2">
                          {/* HP */}
                          <div className="bg-[#0b0e16] p-2 rounded border border-[#1b2234] flex items-center justify-between">
                            <span className="text-[#64748b] flex items-center gap-1 text-[10px]">
                              <Heart className="w-3 h-3 text-red-500" /> HP
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleEnemyHpDelta(enemy.instanceId, -1)}
                                className="w-5 h-5 bg-[#1a2030] hover:bg-red-600 text-white rounded text-center font-bold"
                              >
                                -
                              </button>
                              <span className="font-bold text-white text-xs">{enemy.currentHp}/{enemy.maxHp}</span>
                              <button
                                onClick={() => handleEnemyHpDelta(enemy.instanceId, 1)}
                                className="w-5 h-5 bg-[#1a2030] hover:bg-emerald-600 text-white rounded text-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* SP Cabeza */}
                          <div className="bg-[#0b0e16] p-2 rounded border border-[#1b2234] flex items-center justify-between">
                            <span className="text-[#64748b] flex items-center gap-1 text-[10px]">
                              <Shield className="w-3 h-3 text-cyan-400" /> HEAD SP
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleEnemySpAblate(enemy.instanceId, 'head', -1)}
                                className="w-5 h-5 bg-[#1a2030] hover:bg-red-600 text-white rounded text-center font-bold"
                              >
                                -
                              </button>
                              <span className="font-bold text-cyan-300 text-xs">{enemy.headSp}</span>
                              <button
                                onClick={() => handleEnemySpAblate(enemy.instanceId, 'head', 1)}
                                className="w-5 h-5 bg-[#1a2030] hover:bg-emerald-600 text-white rounded text-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* SP Cuerpo */}
                          <div className="bg-[#0b0e16] p-2 rounded border border-[#1b2234] flex items-center justify-between">
                            <span className="text-[#64748b] flex items-center gap-1 text-[10px]">
                              <Shield className="w-3 h-3 text-amber-400" /> BODY SP
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleEnemySpAblate(enemy.instanceId, 'body', -1)}
                                className="w-5 h-5 bg-[#1a2030] hover:bg-red-600 text-white rounded text-center font-bold"
                              >
                                -
                              </button>
                              <span className="font-bold text-amber-300 text-xs">{enemy.bodySp}</span>
                              <button
                                onClick={() => handleEnemySpAblate(enemy.instanceId, 'body', 1)}
                                className="w-5 h-5 bg-[#1a2030] hover:bg-emerald-600 text-white rounded text-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Botones de Armas y Ataques del Enemigo */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-mono-code text-[#64748b]">ACCIONES:</span>
                          {variant.weapons.map((w, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                const d10 = Math.floor(Math.random() * 10) + 1;
                                const total = d10 + w.skillBase;
                                showToast(`🎯 ${enemy.name} ataca con ${w.name}: 1d10 (${d10}) + Base (${w.skillBase}) = ${total} | Daño: ${w.damage}`, 'info');
                              }}
                              className="px-2 py-0.5 bg-[#182030] hover:bg-[#222c42] border border-[#2a3652] text-slate-300 hover:text-white rounded text-[10px] font-mono-code transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Crosshair className="w-3 h-3 text-red-400" />
                              <span>{w.name} (+{w.skillBase} / {w.damage})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          PESTAÑA 3: HAMMERHEAD MAINFRAME (NET 5 PISOS)
      ======================================================================== */}
      {activeTab === 'mainframe' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#080d16] border border-cyan-500/40 p-5 rounded-xs shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-cyan-900 pb-3 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xs bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-400">
                  <Terminal className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="font-mono-code text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                    MILITECH FREIGHT NET ARCHITECTURE // MIDDLE CAR ACCESS PORT [▲]
                  </span>
                  <h2 className="font-tech text-xl font-black text-white uppercase">
                    {HAMMERHEAD_MAINFRAME_NET.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded border border-cyan-800">
                <span>NETRUNNER ACTIVO:</span>
                <strong className="text-white">{activeChar.handle} (Interface Rango {activeChar.roleRank || 4})</strong>
              </div>
            </div>

            <p className="text-xs font-mono-code text-[#94a3b8] leading-relaxed">
              {HAMMERHEAD_MAINFRAME_NET.loreDescription}
            </p>

            {/* VISUALIZADOR DE LOS 5 PISOS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {HAMMERHEAD_MAINFRAME_NET.floors.map((fl) => {
                const isUnlocked = mainframeProgress.unlockedFloors.includes(fl.floorNumber);

                return (
                  <div
                    key={fl.floorNumber}
                    className={`p-3 rounded-xs border flex flex-col justify-between space-y-2 transition-all ${
                      isUnlocked
                        ? 'bg-[#0a1e20] border-emerald-500/80 shadow-md shadow-emerald-950'
                        : 'bg-[#0d1422] border-[#1d273c]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#1a253a] pb-1 mb-1.5">
                        <span className="font-mono-code font-black text-xs text-cyan-400">
                          PISO {fl.floorNumber}
                        </span>
                        <span className="text-[10px] font-mono-code text-[#64748b]">
                          {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
                        </span>
                      </div>

                      <strong className="font-tech text-xs text-white uppercase block line-clamp-2">
                        {fl.name}
                      </strong>
                      <span className="text-[10px] font-mono-code text-amber-400 block mt-1">
                        {fl.dv ? `DV ${fl.dv}` : fl.type}
                      </span>
                      {fl.rewardOrDevice && (
                        <p className="text-[9px] font-mono-code text-[#94a3b8] mt-1 line-clamp-3">
                          {fl.rewardOrDevice}
                        </p>
                      )}
                    </div>

                    {/* Botones de Acción por Piso */}
                    <div className="pt-2 border-t border-[#1a253a] space-y-1">
                      {fl.type === 'Password' && (
                        <button
                          onClick={() => handleNetAction(fl.floorNumber, 'backdoor')}
                          className="w-full py-1 bg-cyan-950 hover:bg-cyan-800 text-cyan-200 border border-cyan-700 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer"
                        >
                          {isUnlocked ? 'Re-Hackear Backdoor' : `Backdoor (DV ${fl.dv})`}
                        </button>
                      )}

                      {fl.type === 'File' && (
                        <button
                          onClick={() => handleNetAction(fl.floorNumber, 'eye_dee')}
                          className="w-full py-1 bg-amber-950 hover:bg-amber-800 text-amber-200 border border-amber-700 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer"
                        >
                          {mainframeProgress.manifestRevealed ? 'Manifiesto Abierto' : `Eye-Dee (DV ${fl.dv})`}
                        </button>
                      )}

                      {fl.type === 'Black ICE' && (
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono-code text-red-400 flex items-center justify-between">
                            <span>REZ:</span>
                            <strong>{mainframeProgress.hellhoundRez}/20</strong>
                          </div>
                          <button
                            onClick={() => handleNetAction(fl.floorNumber, 'zap')}
                            disabled={mainframeProgress.hellhoundRez <= 0}
                            className="w-full py-1 bg-red-950 hover:bg-red-800 disabled:opacity-30 text-red-200 border border-red-700 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer"
                          >
                            Zap Netrunner (2d6)
                          </button>
                          <button
                            onClick={() => handleNetAction(fl.floorNumber, 'hellhound_atk')}
                            disabled={mainframeProgress.hellhoundRez <= 0}
                            className="w-full py-1 bg-orange-950 hover:bg-orange-800 disabled:opacity-30 text-orange-200 border border-orange-700 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer"
                          >
                            Hellhound Ataca (+6 / 2d6)
                          </button>
                        </div>
                      )}

                      {fl.type === 'Control Node' && (
                        <button
                          onClick={() => handleNetAction(fl.floorNumber, 'control')}
                          className="w-full py-1 bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer"
                        >
                          {turretStatus === 'hacked' ? '🟢 Torreta Controlada' : `Controlar Torreta (DV ${fl.dv})`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Manifiesto Desbloqueado */}
            {mainframeProgress.manifestRevealed && (
              <div className="bg-[#121a14] border border-emerald-500/50 p-4 rounded-xs space-y-2 animate-fade-in text-xs font-mono-code">
                <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-emerald-800/40 pb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>MANIFIESTO MILITAR DE MILITECH REVELADO (FILE PISO 2)</span>
                </div>
                <p className="text-[#cbd5e1] leading-relaxed">
                  El archivo detalla el cargamento confiscado por la Red Chrome Legion: además de las 4 cajas requeridas por Hornet, contiene suministros adicionales: 2 cajas de granadas de humo, 1 lanzador de misiles ligero Militech y 3 botiquines con MaxDoc Mk.2. El GM puede otorgar este equipo como botín adicional al escuadrón.
                </p>
              </div>
            )}

            {/* Consola de Log de Red */}
            <div className="bg-[#05070c] border border-[#162034] p-3 rounded-xs font-mono-code text-[11px] space-y-1 max-h-36 overflow-y-auto">
              <span className="text-[#64748b] block border-b border-[#162034] pb-0.5">TELEMETRÍA DE RED:</span>
              {mainframeProgress.netActionLog.map((log, i) => (
                <div key={i} className="text-cyan-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          PESTAÑA 4: CAJAS & PAGO DE HORNET (2,000 €$)
      ======================================================================== */}
      {activeTab === 'crates' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#0e111a] border border-[#1e2436] p-5 rounded-xs shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1b2234] pb-2 gap-2">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-amber-400" />
                <div>
                  <span className="font-tech text-xs font-bold text-amber-400 uppercase tracking-widest block">
                    EXTRACTION TRACKER // 4 CAJAS CON CERRADURA ADN
                  </span>
                  <h2 className="font-tech text-xl font-black text-white uppercase">
                    CARGAMENTO DE HORNET & ENTREGA FINAL
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono-code text-[#64748b] block">ESTADO DE EXTRACCIÓN</span>
                <strong className="text-emerald-400 font-mono-code font-black text-sm">
                  {cratesState.filter(c => c.isSecuredOnHornetTrain).length}/4 CAJAS ASEGURADAS
                </strong>
              </div>
            </div>

            {/* Aviso Canónico: 2 Manos Ocupadas */}
            <div className="p-3 bg-amber-950/40 border border-amber-600/50 rounded-xs text-xs font-mono-code text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>REGLA CANÓNICA (PÁG. 4):</strong> Cargar una caja ocupa <strong>ambas manos</strong> del personaje, impidiendo sostener armas de fuego a dos manos o realizar ataques con armas empuñadas mientras se transporta.
              </span>
            </div>

            {/* Cuadrícula de las 4 Cajas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cratesState.map((crate) => {
                const carrier = characters.find(c => c.id === crate.carriedByCharId);

                return (
                  <div
                    key={crate.id}
                    className={`p-4 rounded-xs border space-y-3 transition-all ${
                      crate.isSecuredOnHornetTrain
                        ? 'bg-emerald-950/30 border-emerald-500/80 shadow-md shadow-emerald-950/40'
                        : crate.isBiohazard
                        ? 'bg-red-950/30 border-red-500/60'
                        : 'bg-[#121622] border-[#222b40]'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-[#1e2538] pb-2">
                      <strong className="font-tech text-sm text-white uppercase tracking-wide">
                        {crate.title}
                      </strong>
                      {crate.isBiohazard && (
                        <span className="bg-red-600 text-white font-mono-code text-[9px] px-2 py-0.5 rounded font-black">
                          BIOHAZARD
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-mono-code text-[#94a3b8] leading-relaxed">
                      {crate.content}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#1e2538] text-xs font-mono-code">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#64748b]">Llevada por:</span>
                        <select
                          value={crate.carriedByCharId || ''}
                          onChange={(e) => handleAssignCrateCarrier(crate.id, e.target.value ? e.target.value : null)}
                          className="bg-[#182030] border border-[#2b3652] text-white text-[11px] px-2 py-1 rounded cursor-pointer"
                        >
                          <option value="">(En el suelo del tren)</option>
                          {characters.map(pc => (
                            <option key={pc.id} value={pc.id}>
                              {pc.handle} (2 Manos)
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => handleToggleSecureCrate(crate.id)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
                          crate.isSecuredOnHornetTrain
                            ? 'bg-emerald-600 border-emerald-400 text-white'
                            : 'bg-[#182030] border-[#2b3652] text-[#94a3b8] hover:text-white'
                        }`}
                      >
                        {crate.isSecuredOnHornetTrain ? '✓ Asegurada en Tren Hornet' : 'Subir al Tren Hornet'}
                      </button>
                    </div>

                    {carrier && !crate.isSecuredOnHornetTrain && (
                      <div className="text-[10px] font-mono-code text-amber-400 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/50">
                        ⚠ {carrier.handle} tiene ambas manos ocupadas con esta caja.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* BOTÓN DORADO DE COMPLETAR MISIÓN Y PAGO DE HORNET */}
            <div className="bg-[#141208] border-2 border-[#eab308] p-5 rounded-xs space-y-4 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-tech text-xs font-bold text-[#eab308] uppercase tracking-widest block">
                    FIXER PAYOUT // 2,000 €$ A CADA OPERATIVO
                  </span>
                  <h3 className="font-tech text-lg font-black text-white uppercase">
                    ENTREGA DE CARGA AL FIXER HORNET
                  </h3>
                  <p className="text-xs font-mono-code text-[#a1a1aa] mt-1">
                    Requiere que el tren se haya frenado o las 4 cajas se hayan transferido con éxito.
                  </p>
                </div>

                <button
                  onClick={handleCompleteMissionHornet}
                  disabled={isMissionFinished}
                  className={`py-3 px-6 rounded-xs font-tech font-black text-sm tracking-wider uppercase transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2 border ${
                    isMissionFinished
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 cursor-not-allowed'
                      : 'bg-[#eab308] hover:bg-[#ca8a04] text-black border-[#ca8a04] active:scale-95'
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  <span>
                    {isMissionFinished ? 'MISIÓN COBRADA (+2,000 €$ ENTREGADOS)' : 'COMPLETAR MISIÓN (+2,000 €$ CADA PJ)'}
                  </span>
                </button>
              </div>

              {isMissionFinished && (
                <div className="p-4 bg-[#0d140e] border border-emerald-500/60 rounded-xs space-y-2 animate-fade-in font-mono-code text-xs text-[#cbd5e1]">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>EPÍLOGO OFICIAL CANÓNICO:</span>
                  </div>
                  <p className="leading-relaxed">
                    Hornet recibe las cuatro cajas en un hangar discreto de los límites exteriores de Santo Domingo. Sin mediar palabra sobre el contenido químico de la cuarta caja, transfiere con una sonrisa fría los 2,000 €$ convenidos a las cuentas de cada edgerunner. Los Iron Sights tendrán sus armas, la Red Chrome Legion ha sido humillada en las vías secundarias, y el nombre de la tripulación gana peso en la calle.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL DE QUICKHACKS 2077
      ======================================================================== */}
      {activeQuickhackModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b0e17] border border-amber-500/60 p-5 rounded-xs max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1f293d] pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="font-tech text-base font-bold text-white uppercase">
                  LANZADOR DE QUICKHACKS 2077 // NEUROPORT TARGETING
                </h3>
              </div>
              <button
                onClick={() => setActiveQuickhackModal(null)}
                className="text-[#64748b] hover:text-white cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-mono-code text-[#94a3b8]">
              Los enemigos poseen Neuroport integrado. Selecciona un Quickhack para ejecutar a través del Cyberdeck del Netrunner activo ({activeChar.handle}):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {QUICKHACKS_2077_CATALOG.slice(0, 8).map((qh) => (
                <button
                  key={qh.id}
                  onClick={() => {
                    const d10 = Math.floor(Math.random() * 10) + 1;
                    const interfaceRank = activeChar.roleRank || 4;
                    const rollTotal = d10 + interfaceRank;
                    const success = rollTotal >= qh.dv;
                    const targetEnemy = activeEnemies.find(e => e.instanceId === activeQuickhackModal);

                    if (success && qh.damage && targetEnemy) {
                      const dmg = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
                      handleEnemyHpDelta(targetEnemy.instanceId, -dmg);
                      showToast(`⚡ ${qh.name} ÉXITO (${rollTotal} vs DV ${qh.dv})! Infligió ${dmg} daño directo a ${targetEnemy.name}.`, 'success');
                    } else if (success) {
                      showToast(`⚡ ${qh.name} ÉXITO (${rollTotal} vs DV ${qh.dv}) aplicado a ${targetEnemy?.name}!`, 'success');
                    } else {
                      showToast(`❌ Quickhack ${qh.name} bloqueado (${rollTotal} vs DV ${qh.dv}).`, 'warn');
                    }
                    setActiveQuickhackModal(null);
                  }}
                  className="bg-[#121624] hover:bg-[#1c2438] border border-[#232f48] p-2.5 rounded-xs text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-tech text-xs font-bold text-white group-hover:text-amber-300">
                      {qh.name}
                    </span>
                    <span className="font-mono-code text-[10px] text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded">
                      DV {qh.dv}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-cyan-400 block">
                    RAM: {qh.ramCost} | {qh.duration}
                  </span>
                  <p className="text-[9px] font-mono-code text-[#94a3b8] line-clamp-2 mt-1">
                    {qh.effect}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1f293d]">
              <button
                onClick={() => setActiveQuickhackModal(null)}
                className="px-4 py-1.5 bg-[#182030] hover:bg-[#222c42] text-slate-300 font-mono-code text-xs rounded transition-all cursor-pointer"
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
