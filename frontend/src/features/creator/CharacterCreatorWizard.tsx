import React, { useState, useMemo } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { 
  ERA_CATALOG,
  CREATION_METHODS_CATALOG,
  STAT_TOOLTIPS,
  ROLES_CATALOG,
  GENERAL_SKILLS_CATALOG,
  LIFEPATH_TABLES,
  ENEMY_TABLES,
  ROLE_LIFEPATH_QUESTIONS,
  SELLING_OUT_CATALOG,
  PREGEN_TEMPLATES,
  buildCharacterSheetFromPregen,
  createDefaultCombatSkills
} from '../../data/characterCreationData';
import { ROLE_SPECIFIC_LIFEPATH_TABLES_BY_ROLE } from '../../data/weaponAttachmentsAndTechData';
import type { 
  CharacterEra, 
  CreationMethod, 
  CharacterLifepath, 
  CharacterDebt, 
  CombatSkillKey, 
  StatKey, 
  CharacterSheet, 
  EquippedWeapon, 
  InventoryItem,
  LifepathEnemy
} from '../../types/cyberpunk';
import { SKILL_METADATA } from '../../types/cyberpunk';
import coreData from '../../data/core-rules.cprpack.json';
import { 
  Sparkles, 
  User, 
  Shield, 
  Activity, 
  Coins, 
  Plus, 
  Minus, 
  Dices, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Package, 
  Cpu, 
  Flame, 
  HelpCircle, 
  BookOpen, 
  Crosshair, 
  Zap, 
  Trash2,
  Layers,
  Search,
  ShoppingCart
} from 'lucide-react';

const STAT_KEYS: StatKey[] = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];
const BASIC_COMBAT_KEYS: CombatSkillKey[] = ['athletics', 'brawling', 'concentration', 'evasion', 'firstAid', 'perception'];

interface CharacterCreatorWizardProps {
  onClose?: () => void;
  onComplete?: () => void;
}

export const CharacterCreatorWizard: React.FC<CharacterCreatorWizardProps> = ({
  onClose,
  onComplete
}) => {
  const createCharacterFromWizard = useCharacterStore((state) => state.createCharacterFromWizard);

  // Wizard Navigation Step (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Era & Creation Method
  const [selectedEra, setSelectedEra] = useState<CharacterEra>('2045');
  const [selectedMethod, setSelectedMethod] = useState<CreationMethod>('streetrat');
  const [pregenCategoryFilter, setPregenCategoryFilter] = useState<'all' | 'cemk_2077' | 'core_2045' | 'rival_enemy'>('all');

  // Step 2: Role
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('Solo');

  // Step 3: Stats
  const currentRoleInfo = useMemo(() => {
    return (
      ROLES_CATALOG.find(
        (r) =>
          r.name.toLowerCase() === selectedRoleKey.toLowerCase() ||
          r.id.toLowerCase() === selectedRoleKey.toLowerCase()
      ) || ROLES_CATALOG[0]
    );
  }, [selectedRoleKey]);

  const [selectedStreetratRow, setSelectedStreetratRow] = useState<number>(1);
  const [edgerunnerRolls, setEdgerunnerRolls] = useState<Record<StatKey, number>>(() => ({
    INT: 1,
    REF: 1,
    DEX: 1,
    TECH: 1,
    COOL: 1,
    WILL: 1,
    LUCK: 1,
    MOVE: 1,
    BODY: 1,
    EMP: 1
  }));

  const [stats, setStats] = useState<Record<StatKey, number>>(() => ({
    ...ROLES_CATALOG[0].edgerunnerStatTable[0]
  }));
  const [inspectedStat, setInspectedStat] = useState<StatKey>('INT');

  // Step 4: Skills
  const pureGeneralSkills = useMemo(() => {
    return GENERAL_SKILLS_CATALOG.filter((g) => !g.combatSkillKey);
  }, []);

  const [combatSkills, setCombatSkills] = useState<Record<CombatSkillKey, number>>(() => {
    return createDefaultCombatSkills();
  });
  const [generalSkills, setGeneralSkills] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const g of GENERAL_SKILLS_CATALOG) {
      if (g.combatSkillKey) continue;
      map[g.key] = g.isBasic ? 2 : 0;
    }
    return map;
  });

  // Step 5: Lifepath
  const [lifepath, setLifepath] = useState<CharacterLifepath>({
    culturalRegion: 'Norteamérica (Anglófono / Calles de Night City)',
    personality: 'Rebelde, cínico y leal a su propia tripulación',
    clothingStyle: 'Streetwear táctico y cuero desgastado',
    hairstyle: 'Corte militar asimétrico con tinte neón',
    affectation: 'Tatuajes balísticos que brillan con luz negra',
    valueMost: 'Lealtad inquebrantable a los suyos',
    feelAboutPeople: 'Nadie es de fiar hasta que sangra a tu lado',
    valuedPerson: 'Un viejo mentor de la calle que murió en un tiroteo',
    valuedPossession: 'Un arma personalizada heredada de su familia',
    familyBackground: 'Nómadas desterrados que migraron a la metrópoli',
    childhoodEnvironment: 'Barrios marginales en ruinas de la Zona de Combate',
    familyCrisis: 'Perdieron todo en una redada corporativa ilegal',
    friends: ['Un técnico de armas que le debe la vida'],
    tragicLoveAffairs: ['Un amor de juventud reclutado por una megacorp'],
    enemies: [],
    roleLifepath: {},
    roleSpecificLifepath: {},
    lifeGoal: 'Llegar a la cima de la Liga Mayor de Edgerunners sin venderse'
  });

  // Step 6: Economy, Selling Out (Debt), Equipment & Handle
  const [handle, setHandle] = useState<string>('V');
  const [debtOptionId, setDebtOptionId] = useState<string>('none');
  const [customDebtAmount, setCustomDebtAmount] = useState<number>(2000);
  const [debtCreditorType, setDebtCreditorType] = useState<'corp' | 'law' | 'gang' | 'custom'>('corp');
  const [debtCreditorName, setDebtCreditorName] = useState<string>('Arasaka Orbital Finance');
  const [debtTerms, setDebtTerms] = useState<string>('Cobro del 20% de cada gig y prioridad de favores tácticos.');

  const [equippedWeapons, setEquippedWeapons] = useState<EquippedWeapon[]>([]);
  const [headArmor, setHeadArmor] = useState<{ name: string; maxSp: number; currentSp: number; penalty: number }>({
    name: 'Kevlar® Helmet',
    maxSp: 7,
    currentSp: 7,
    penalty: 0
  });
  const [bodyArmor, setBodyArmor] = useState<{ name: string; maxSp: number; currentSp: number; penalty: number }>({
    name: 'Light Armorjack Vest',
    maxSp: 11,
    currentSp: 11,
    penalty: 0
  });
  const [installedCyberwareIds, setInstalledCyberwareIds] = useState<string[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [eurodollars, setEurodollars] = useState<number>(2550);
  const [fashionBudget, setFashionBudget] = useState<number>(800);

  // Shop Browser in Step 6
  const [shopCategory, setShopCategory] = useState<'weapons' | 'armor' | 'cyberware' | 'gear' | 'ammo' | 'drugs'>('weapons');
  const [shopSearch, setShopSearch] = useState<string>('');

  // UI Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- PREGEN LOADERS ---
  const handleLoadPregenImmediate = (pregenId: string) => {
    const tpl = PREGEN_TEMPLATES.find((p) => p.id === pregenId);
    if (!tpl) return;
    const sheet = buildCharacterSheetFromPregen(tpl);
    createCharacterFromWizard(sheet);
    showToast(`¡${sheet.handle} cargado y activado al instante!`);
    onComplete?.();
  };

  const handleUsePregenAsBase = (pregenId: string) => {
    const tpl = PREGEN_TEMPLATES.find((p) => p.id === pregenId);
    if (!tpl) return;
    setSelectedEra(tpl.era);
    setSelectedMethod('pregen');
    setHandle(tpl.handle);
    setSelectedRoleKey(tpl.role);
    setStats({ ...tpl.stats });
    setCombatSkills({ ...tpl.skills });
    setGeneralSkills({ ...tpl.generalSkills });
    setLifepath({ ...tpl.lifepath });
    setEquippedWeapons([...tpl.weapons]);
    setHeadArmor({ ...tpl.headArmor });
    setBodyArmor({ ...tpl.bodyArmor });
    setInstalledCyberwareIds([...tpl.cyberwareIds]);
    setEurodollars(tpl.eurodollars);
    setFashionBudget(800);
    if ((tpl as any).debt) {
      setDebtOptionId('custom');
      setCustomDebtAmount((tpl as any).debt.amount);
      setDebtCreditorType((tpl as any).debt.creditorType);
      setDebtCreditorName((tpl as any).debt.creditorName);
      setDebtTerms((tpl as any).debt.terms);
    }
    showToast(`Plantilla de ${tpl.handle} precargada como base. Avanzando al Paso 2...`);
    setCurrentStep(2);
  };

  // --- STAT POINT POOL (Complete Package Mode) ---
  const totalStatsSpent = useMemo(() => {
    return Object.values(stats).reduce((a, b) => a + b, 0);
  }, [stats]);
  const statsPointsRemaining = 62 - totalStatsSpent;

  // --- DERIVED METRICS ---
  const maxHp = 10 + 5 * Math.ceil((stats.BODY + stats.WILL) / 2);
  const seriouslyWounded = Math.ceil(maxHp / 2);
  const deathSave = stats.BODY;
  const initialHumanity = stats.EMP * 10;

  // --- SKILL POINT POOL (Edgerunner & Complete Package) ---
  const totalSkillPointsSpent = useMemo(() => {
    let sum = 0;
    // Combat skills
    for (const [key, level] of Object.entries(combatSkills)) {
      const isDouble = key === 'autofire' || key === 'heavyWeapons' || key === 'martialArts';
      const costMultiplier = isDouble ? 2 : 1;
      sum += (level || 0) * costMultiplier;
    }
    // Pure general skills
    for (const g of pureGeneralSkills) {
      const level = generalSkills[g.key] ?? (g.isBasic ? 2 : 0);
      const mult = g.isDoubleCost ? 2 : 1;
      sum += level * mult;
    }
    return sum;
  }, [combatSkills, generalSkills, pureGeneralSkills]);
  const skillPointsRemaining = 86 - totalSkillPointsSpent;

  // Apply Role Template Skills
  const applyRoleTemplateSkills = (role: typeof ROLES_CATALOG[0]) => {
    const baseCombat = createDefaultCombatSkills();
    const newCombat = {
      ...baseCombat,
      ...(role.templateCombatSkills as Record<CombatSkillKey, number>)
    };
    for (const k of BASIC_COMBAT_KEYS) {
      if ((newCombat[k] ?? 0) < 2) {
        newCombat[k] = 2;
      }
    }
    setCombatSkills(newCombat);

    const newGeneral: Record<string, number> = {};
    for (const g of pureGeneralSkills) {
      newGeneral[g.key] = g.isBasic ? 2 : 0;
    }
    if (role.templateGeneralSkills) {
      for (const [key, val] of Object.entries(role.templateGeneralSkills)) {
        const norm = key === 'HumanPerception' ? 'Human Perception' : key;
        if (norm in newGeneral) {
          newGeneral[norm] = Math.max(newGeneral[norm], val);
        }
      }
    }
    setGeneralSkills(newGeneral);
  };

  // Auto-Assign role template skills
  const handleAutoAssignTemplateSkills = () => {
    if (!currentRoleInfo) return;
    applyRoleTemplateSkills(currentRoleInfo);
    showToast(`Habilidades asignadas según la plantilla oficial de ${currentRoleInfo.name}.`);
  };

  // Reset skills to basic level 2
  const handleResetSkillsToBasic = () => {
    setCombatSkills(createDefaultCombatSkills());
    const newGeneral: Record<string, number> = {};
    for (const g of pureGeneralSkills) {
      newGeneral[g.key] = g.isBasic ? 2 : 0;
    }
    setGeneralSkills(newGeneral);
    showToast('Habilidades restablecidas a sus valores básicos (26 pts base, 60 pts libres).');
  };

  // Method Selection Synchronization
  const handleSelectMethod = (methodId: CreationMethod) => {
    setSelectedMethod(methodId);
    if (methodId === 'streetrat') {
      const table = currentRoleInfo.edgerunnerStatTable;
      const row = table?.[selectedStreetratRow - 1] || currentRoleInfo.streetratStats;
      setStats({ ...row });
      applyRoleTemplateSkills(currentRoleInfo);
    } else if (methodId === 'edgerunner') {
      const table = currentRoleInfo.edgerunnerStatTable;
      if (table) {
        const newStats: Record<StatKey, number> = {} as any;
        STAT_KEYS.forEach((stat) => {
          const roll = edgerunnerRolls[stat] || 1;
          newStats[stat] = table[roll - 1]?.[stat] ?? 6;
        });
        setStats(newStats);
      }
    } else if (methodId === 'complete_package') {
      const sum = Object.values(stats).reduce((a, b) => a + b, 0);
      if (sum !== 62) {
        setStats({ ...currentRoleInfo.streetratStats });
      }
    }
  };

  // Role Selection Synchronization
  const handleSelectRole = (role: typeof ROLES_CATALOG[0]) => {
    setSelectedRoleKey(role.name);
    if (selectedMethod === 'streetrat') {
      const table = role.edgerunnerStatTable;
      const row = table?.[selectedStreetratRow - 1] || role.streetratStats;
      setStats({ ...row });
      applyRoleTemplateSkills(role);
    } else if (selectedMethod === 'edgerunner') {
      const table = role.edgerunnerStatTable;
      if (table) {
        const newStats: Record<StatKey, number> = {} as any;
        STAT_KEYS.forEach((stat) => {
          const roll = edgerunnerRolls[stat] || 1;
          newStats[stat] = table[roll - 1]?.[stat] ?? 6;
        });
        setStats(newStats);
      }
    }
  };

  // Roll Streetrat single 1d10 row
  const handleRollStreetratStats = () => {
    if (!currentRoleInfo?.edgerunnerStatTable?.length) return;
    const roll = Math.floor(Math.random() * currentRoleInfo.edgerunnerStatTable.length) + 1;
    setSelectedStreetratRow(roll);
    setStats({ ...currentRoleInfo.edgerunnerStatTable[roll - 1] });
    showToast(`🎲 Tirada de tabla Streetrat: Fila #${roll} asignada.`);
  };

  // Select Streetrat row from table
  const handleSelectStreetratRow = (rowNum: number) => {
    if (!currentRoleInfo?.edgerunnerStatTable?.[rowNum - 1]) return;
    setSelectedStreetratRow(rowNum);
    setStats({ ...currentRoleInfo.edgerunnerStatTable[rowNum - 1] });
    showToast(`Fila #${rowNum} de Streetrat seleccionada.`);
  };

  // Roll all 10 independent 1d10 dice for Edgerunner
  const handleRollAllEdgerunnerStats = () => {
    if (!currentRoleInfo?.edgerunnerStatTable?.length) return;
    const newRolls: Record<StatKey, number> = {} as any;
    const newStats: Record<StatKey, number> = {} as any;
    STAT_KEYS.forEach((stat) => {
      const roll = Math.floor(Math.random() * 10) + 1;
      newRolls[stat] = roll;
      newStats[stat] = currentRoleInfo.edgerunnerStatTable[roll - 1][stat];
    });
    setEdgerunnerRolls(newRolls);
    setStats(newStats);
    showToast('🎲 10 tiradas independientes asignadas para cada STAT.');
  };

  // Roll single stat 1d10 for Edgerunner
  const handleRollSingleEdgerunnerStat = (stat: StatKey) => {
    if (!currentRoleInfo?.edgerunnerStatTable?.length) return;
    const roll = Math.floor(Math.random() * 10) + 1;
    setEdgerunnerRolls((prev) => ({ ...prev, [stat]: roll }));
    setStats((prev) => ({ ...prev, [stat]: currentRoleInfo.edgerunnerStatTable[roll - 1][stat] }));
    showToast(`🎲 ${stat}: Tirada #${roll} -> Valor: ${currentRoleInfo.edgerunnerStatTable[roll - 1][stat]}`);
  };

  // Select cell in 10x10 matrix for Edgerunner
  const handleSelectEdgerunnerCell = (stat: StatKey, dieRoll: number) => {
    if (!currentRoleInfo?.edgerunnerStatTable?.[dieRoll - 1]) return;
    setEdgerunnerRolls((prev) => ({ ...prev, [stat]: dieRoll }));
    setStats((prev) => ({ ...prev, [stat]: currentRoleInfo.edgerunnerStatTable[dieRoll - 1][stat] }));
  };

  // Complete Package Presets
  const handlePresetMinStats = () => {
    setStats({
      INT: 2, REF: 2, DEX: 2, TECH: 2, COOL: 2, WILL: 2, LUCK: 2, MOVE: 2, BODY: 2, EMP: 2
    });
    showToast('Preset: Todos los STATS al mínimo (2 -> 42 pts libres restantes).');
  };

  const handlePresetBalancedStats = () => {
    setStats({
      INT: 5, REF: 5, DEX: 5, TECH: 5, COOL: 5, WILL: 5, LUCK: 5, MOVE: 5, BODY: 5, EMP: 5
    });
    showToast('Preset: Base equilibrada a 5 (12 pts libres restantes).');
  };

  const handlePresetRoleSuggestedStats = () => {
    if (!currentRoleInfo) return;
    setStats({ ...currentRoleInfo.streetratStats });
    showToast(`Preset: Distribución sugerida de ${currentRoleInfo.name} (62 pts).`);
  };

  // Randomize full lifepath
  const handleRandomizeFullLifepath = () => {
    const pick = (arr: readonly string[]) => arr[Math.floor(Math.random() * arr.length)];
    const roleKey = selectedRoleKey.toLowerCase();
    const roleQ =
      ROLE_SPECIFIC_LIFEPATH_TABLES_BY_ROLE[roleKey] ||
      ROLE_LIFEPATH_QUESTIONS[roleKey] ||
      [];
    const roleAnswers: Record<string, string> = {};
    for (const q of roleQ) {
      roleAnswers[q.id] = pick(q.options);
    }

    setLifepath({
      culturalRegion: pick(LIFEPATH_TABLES.culturalRegions),
      personality: pick(LIFEPATH_TABLES.personalities),
      clothingStyle: pick(LIFEPATH_TABLES.clothingStyles),
      hairstyle: pick(LIFEPATH_TABLES.hairstyles),
      affectation: pick(LIFEPATH_TABLES.affectations),
      valueMost: pick(LIFEPATH_TABLES.valuesMost),
      feelAboutPeople: pick(LIFEPATH_TABLES.feelingsAboutPeople),
      valuedPerson: pick(LIFEPATH_TABLES.valuedPersons),
      valuedPossession: pick(LIFEPATH_TABLES.valuedPossessions),
      familyBackground: pick(LIFEPATH_TABLES.familyBackgrounds),
      childhoodEnvironment: pick(LIFEPATH_TABLES.childhoodEnvironments),
      familyCrisis: pick(LIFEPATH_TABLES.familyCrises),
      lifeGoal: pick(LIFEPATH_TABLES.lifeGoals),
      friends: [pick(LIFEPATH_TABLES.friendsRelationships)],
      tragicLoveAffairs: [pick(LIFEPATH_TABLES.tragicLoveAffairs)],
      enemies: [
        {
          id: `enemy-${Date.now()}`,
          who: pick(ENEMY_TABLES.who),
          cause: pick(ENEMY_TABLES.cause),
          throwAtYou: pick(ENEMY_TABLES.throwAtYou),
          reaction: pick(ENEMY_TABLES.reaction),
          customNotes: 'Enemigo generado en la creación de personaje'
        }
      ],
      roleLifepath: roleAnswers,
      roleSpecificLifepath: { ...roleAnswers }
    });
    showToast('🎲 Lifepath completo generado al azar según tablas oficiales.');
  };

  const handleAddManualFriend = () => {
    setLifepath((prev) => ({
      ...prev,
      friends: [...prev.friends, 'Aliado leal en Night City']
    }));
  };

  const handleAddManualRomance = () => {
    setLifepath((prev) => ({
      ...prev,
      tragicLoveAffairs: [...prev.tragicLoveAffairs, 'Un romance agridulce que terminó en tragedia']
    }));
  };

  const handleAddManualEnemy = () => {
    const newEnemy: LifepathEnemy = {
      id: `enemy-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      who: ENEMY_TABLES.who[0],
      cause: ENEMY_TABLES.cause[0],
      throwAtYou: ENEMY_TABLES.throwAtYou[0],
      reaction: ENEMY_TABLES.reaction[0],
      customNotes: 'Enemigo personal añadido'
    };
    setLifepath((prev) => ({
      ...prev,
      enemies: [...prev.enemies, newEnemy]
    }));
  };

  // Load official role loadout
  const handleLoadOfficialRoleLoadout = () => {
    if (!currentRoleInfo) return;
    const lo = currentRoleInfo.startingLoadout;
    setInstalledCyberwareIds([...lo.cyberwareIds]);
    const invItems: InventoryItem[] = lo.gearNames.map((name, idx) => ({
      id: `inv-${Date.now()}-${idx}`,
      catalogId: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      category: 'gear',
      cost: 50,
      quantity: 1,
      details: 'Equipo inicial reglamentario de rol'
    }));
    setInventory(invItems);
    showToast(`📦 Paquete de equipo inicial de ${currentRoleInfo.name} cargado con éxito.`);
  };

  // Final confirmation: build CharacterSheet & send to store
  const handleFinalizeEdgerunner = () => {
    const debtConfig = SELLING_OUT_CATALOG.find((d) => d.id === debtOptionId);
    let finalDebt: CharacterDebt | undefined = undefined;
    if (debtOptionId !== 'none' && debtOptionId !== 'debt_none' && debtConfig) {
      const amount = debtOptionId === 'custom' ? customDebtAmount : debtConfig.extraCash;
      finalDebt = {
        isActive: true,
        amount,
        creditorType: debtCreditorType,
        creditorName: debtCreditorName,
        terms: debtTerms
      };
    }

    const finalSheet: CharacterSheet = {
      id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      handle: handle.trim() || 'Edgerunner',
      role: selectedRoleKey,
      roleRank: 4,
      era: selectedEra,
      creationMethod: selectedMethod,
      roleAbilityName: currentRoleInfo.roleAbility,
      stats: { ...stats },
      currentHp: maxHp,
      currentLuck: stats.LUCK,
      currentHumanity: initialHumanity,
      headArmor: { ...headArmor },
      bodyArmor: { ...bodyArmor },
      skills: { ...combatSkills },
      generalSkills: { ...generalSkills },
      equippedWeapons: [...equippedWeapons],
      installedCyberwareIds: [...installedCyberwareIds],
      inventory: [...inventory],
      activeInjuries: [],
      eurodollars,
      fashionBudgetRemaining: fashionBudget,
      hasNeuroport: selectedEra === '2077',
      lifepath: { ...lifepath },
      debt: finalDebt
    };

    createCharacterFromWizard(finalSheet);
    showToast(`🚀 ¡Edgerunner ${finalSheet.handle} creado e insertado en la base de datos!`);
    onComplete?.();
  };

  return (
    <div className="chamfer-card bg-[#0d0e14] border border-[#22283a] p-4 sm:p-6 text-[#cbd5e1] font-sans selection:bg-[#dc2626] selection:text-white max-w-6xl mx-auto shadow-2xl relative my-2">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded bg-[#064e3b] border border-[#10b981] text-[#a7f3d0] text-xs font-mono-code flex items-center gap-3 shadow-2xl animate-bounce">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2538] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#dc2626]/20 border border-[#dc2626] rounded-xs text-[#dc2626]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-tech text-lg sm:text-xl font-black text-white tracking-wider uppercase">
                EDGERUNNER CREATOR WORKBENCH // 6 PASOS
              </h1>
              <span className="text-[10px] font-mono-code bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/40 px-2 py-0.5 rounded font-bold uppercase">
                {selectedEra === '2077' ? 'CEMK 2077' : 'CORE 2045'}
              </span>
            </div>
            <p className="text-xs font-mono-code text-[#64748b]">
              Protocolo de Creación Oficial Cyberpunk RED &amp; Edgerunners Mission Kit
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748b] hover:text-white rounded hover:bg-[#1f2538] cursor-pointer"
            title="Cerrar Creador"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 6-Step Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {[
          { num: 1, label: 'ERA & MÉTODO' },
          { num: 2, label: 'ROL & ESTILO' },
          { num: 3, label: '10 STATS' },
          { num: 4, label: 'HABILIDADES' },
          { num: 5, label: 'LIFEPATH' },
          { num: 6, label: 'DEUDA & EQUIPO' }
        ].map((s) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-2 rounded-xs border text-left transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#dc2626]/15 border-[#dc2626] text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                  : isDone
                  ? 'bg-[#151926] border-[#10b981]/50 text-[#10b981]'
                  : 'bg-[#10121a] border-[#1e2334] text-[#64748b] hover:text-white'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-tech text-xs font-black ${
                  isActive
                    ? 'bg-[#dc2626] text-white'
                    : isDone
                    ? 'bg-[#10b981] text-black'
                    : 'bg-[#1a1e2d] text-[#64748b]'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className="font-tech text-xs font-bold tracking-tight uppercase truncate">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ====================================================================
          PASO 1: ERA, MÉTODO Y PLANTILLAS PREGENERADAS
      ==================================================================== */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Subsección 1.1: Era Tecnológica */}
          <div>
            <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#38bdf8]" /> 1.1 ELIGE LA ERA DE TU CAMPAÑA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ERA_CATALOG.map((era) => {
                const isSelected = selectedEra === era.id;
                return (
                  <div
                    key={era.id}
                    onClick={() => setSelectedEra(era.id)}
                    className={`p-4 rounded-xs border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#161a29] border-[#38bdf8] shadow-[0_0_14px_rgba(56,189,248,0.25)]'
                        : 'bg-[#10131d] border-[#1e2436] hover:border-[#38bdf8]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-tech text-base font-black text-white">
                          {era.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono-code px-2 py-0.5 rounded font-bold ${
                            era.id === '2077'
                              ? 'bg-[#00f5d4]/20 text-[#00f5d4] border border-[#00f5d4]/40'
                              : 'bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/40'
                          }`}
                        >
                          {era.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#94a3b8] font-mono-code mb-3 leading-relaxed">
                        {era.subtitle}
                      </p>
                      <div className="space-y-1 mb-3">
                        <span className="text-[10px] font-mono-code uppercase text-[#f59e0b] block font-bold">
                          ¿Qué te da esta Era?:
                        </span>
                        <ul className="text-xs text-[#cbd5e1] space-y-1 list-disc list-inside font-mono-code">
                          {era.whatYouGet.slice(0, 4).map((w, idx) => (
                            <li key={idx} className="line-clamp-2">{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-1.5 mt-2 rounded font-tech text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#38bdf8] text-black'
                          : 'bg-[#181d2c] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {isSelected ? '✓ ERA SELECCIONADA' : 'SELECCIONAR ERA'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Panel Destacado 2077 CEMK: Neuroport 7 Subsistemas Gratuitos */}
            {selectedEra === '2077' && (
              <div className="mt-4 p-4 bg-[#0a161c] border-2 border-[#00f5d4] rounded-xs space-y-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#00f5d4]" />
                  <h3 className="font-tech text-sm font-black text-[#00f5d4] tracking-wider uppercase">
                    NEUROPORT UNIVERSAL // 7 SUBSISTEMAS GRATUITOS DE SERIE (0 €$ / 0 HL)
                  </h3>
                </div>
                <p className="text-xs font-mono-code text-[#94a3b8] leading-relaxed">
                  En 2077, todo Edgerunner comienza con este paquete cibernético ya integrado en su sistema nervioso. Esto ahorra más de <strong>2,500 €$</strong> y evita más de <strong>20 puntos de Pérdida de Humanidad</strong>:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {ERA_CATALOG[1].neuroportSubsystems?.map((sub, i) => (
                    <div key={i} className="p-2.5 bg-[#0e1f26] border border-[#16434f] rounded-xs text-xs font-mono-code">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-tech font-bold text-white text-xs">{sub.name}</span>
                        <span className="text-[9px] text-[#00f5d4] font-bold">{sub.savedCost}</span>
                      </div>
                      <p className="text-[11px] text-[#94a3b8] leading-tight">{sub.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subsección 1.2: Método de Creación */}
          <div>
            <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#f59e0b]" /> 1.2 ELIGE TU MÉTODO DE CREACIÓN
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CREATION_METHODS_CATALOG.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => handleSelectMethod(method.id)}
                    className={`p-3.5 rounded-xs border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#181d2a] border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : 'bg-[#10131c] border-[#1e2334] hover:border-[#f59e0b]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-tech text-sm font-bold text-white">
                          {method.name}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#f59e0b]" />}
                      </div>
                      <p className="text-[10px] font-mono-code text-[#64748b] mb-2 uppercase">
                        {method.subtitle}
                      </p>
                      <p className="text-xs text-[#94a3b8] mb-3 leading-relaxed">
                        {method.summary}
                      </p>
                      <div className="space-y-1 mb-2">
                        <span className="text-[9px] font-mono-code uppercase text-[#f59e0b] block font-bold">
                          Lo que obtienes:
                        </span>
                        <ul className="text-[11px] text-[#cbd5e1] space-y-0.5 list-disc list-inside font-mono-code">
                          {method.whatYouGet.map((w, idx) => (
                            <li key={idx} className="line-clamp-2">{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-1 mt-2 rounded font-tech text-xs font-bold uppercase transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#f59e0b] text-black font-black'
                          : 'bg-[#161a26] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {isSelected ? '✓ MÉTODO ACTIVO' : 'ELEGIR MÉTODO'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subsección 1.3: Galería de 17 Plantillas Pregeneradas */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-[#1f2538] pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#dc2626]" />
                <h3 className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                  GALERÍA DE 17 PLANTILLAS PREGENERADAS (1-CLIC O BASE PERSONALIZABLE)
                </h3>
              </div>

              {/* Filtros de Categoría */}
              <div className="flex items-center gap-1.5 bg-[#121520] p-1 rounded border border-[#20273a]">
                {[
                  { id: 'all', label: 'Todas (17)' },
                  { id: 'cemk_2077', label: 'CEMK 2077 (7)' },
                  { id: 'core_2045', label: 'Core 2045 (6)' },
                  { id: 'rival_enemy', label: 'Rivales / Enemigos (4)' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPregenCategoryFilter(f.id as any)}
                    className={`px-2.5 py-1 text-xs font-tech font-bold uppercase rounded-2xs transition-colors cursor-pointer ${
                      pregenCategoryFilter === f.id
                        ? 'bg-[#dc2626] text-white'
                        : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1f30]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PREGEN_TEMPLATES.filter((p) => {
                if (pregenCategoryFilter === 'all') return true;
                if (pregenCategoryFilter === 'cemk_2077') return p.era === '2077' && !p.id.includes('arasaka') && !p.id.includes('maelstrom');
                if (pregenCategoryFilter === 'core_2045') return p.era === '2045';
                if (pregenCategoryFilter === 'rival_enemy') return p.id.includes('arasaka') || p.id.includes('maelstrom') || p.sourceBadge.toLowerCase().includes('rival');
                return true;
              }).map((pregen) => (
                <div
                  key={pregen.id}
                  className="bg-[#10121a] border border-[#202538] hover:border-[#dc2626]/60 p-3.5 rounded-xs flex flex-col justify-between transition-all space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-tech text-base font-bold text-white">
                        {pregen.handle}
                      </span>
                      <span className="text-[10px] font-mono-code bg-[#1f2638] text-[#38bdf8] px-2 py-0.5 rounded font-bold uppercase">
                        {pregen.role} ({pregen.era})
                      </span>
                    </div>
                    <p className="text-[11px] font-mono-code text-[#f59e0b] mb-1.5">
                      {pregen.sourceBadge}
                    </p>
                    <p className="text-xs text-[#94a3b8] mb-2 line-clamp-2">
                      {pregen.bioSummary}
                    </p>
                    <div className="bg-[#090b10] p-2 rounded border border-[#1b2030] text-[10px] font-mono-code text-[#cbd5e1] space-y-0.5 mb-2">
                      <div><strong>Armas:</strong> {pregen.weapons.map((w) => w.name).join(', ')}</div>
                      <div><strong>Cromo:</strong> {pregen.cyberwareIds.length} piezas ({pregen.era === '2077' ? 'Neuroport 2077' : '2045'})</div>
                      <div><strong>Fondos:</strong> {pregen.eurodollars} €$ | <strong>Moda:</strong> 800 €$</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1b2030]">
                    <button
                      onClick={() => handleLoadPregenImmediate(pregen.id)}
                      className="py-1.5 px-2 bg-[#dc2626] hover:bg-white text-white hover:text-black font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer text-center"
                    >
                      ⚡ JUGAR YA
                    </button>
                    <button
                      onClick={() => handleUsePregenAsBase(pregen.id)}
                      className="py-1.5 px-2 bg-[#1e2334] hover:bg-[#38bdf8] text-[#94a3b8] hover:text-black font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer text-center"
                    >
                      🛠️ USAR BASE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PASO 2: SELECCIÓN DE ROL (10 ROLES OFICIALES)
      ==================================================================== */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#38bdf8]" /> 2.1 ELIGE EL ROL DE TU EDGERUNNER
            </h2>
            <p className="text-xs font-mono-code text-[#64748b] mb-4">
              Cada Rol cuenta con una Habilidad de Rol exclusiva que comienza a <strong>Rango 4</strong> y define tu estilo de juego en Night City.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {ROLES_CATALOG.map((role) => {
                const isSelected = selectedRoleKey.toLowerCase() === role.name.toLowerCase() || selectedRoleKey.toLowerCase() === role.id.toLowerCase();
                return (
                  <div
                    key={role.id}
                    onClick={() => handleSelectRole(role)}
                    className={`p-3 rounded-xs border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#161a29] border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                        : 'bg-[#10131d] border-[#1e2436] hover:border-[#38bdf8]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-tech text-base font-black text-white">
                          {role.name}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#38bdf8]" />}
                      </div>
                      <div className="text-[10px] font-mono-code text-[#38bdf8] font-bold mb-1">
                        {role.roleAbility} (Rango 4)
                      </div>
                      <p className="text-[11px] font-mono-code text-[#94a3b8] mb-2 leading-tight">
                        {role.spanishSubtitle}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {role.whatYouGet.slice(0, 2).map((tag, tIdx) => (
                          <span key={tIdx} className="text-[9px] font-mono-code bg-[#191e2e] text-[#94a3b8] px-1 rounded truncate max-w-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-1 mt-2 rounded font-tech text-xs font-bold uppercase transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#38bdf8] text-black font-black'
                          : 'bg-[#181d2c] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {isSelected ? '✓ ROL ACTIVO' : 'ELEGIR'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel Detallado del Rol Seleccionado */}
          {currentRoleInfo && (
            <div className="p-4 bg-[#111420] border border-[#232a3e] rounded-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#1b2234] pb-2">
                <div>
                  <h3 className="font-tech text-base font-bold text-white uppercase">
                    EXPEDIENTE DE CLASE // {currentRoleInfo.name} — {currentRoleInfo.roleAbility} (RANGO 4)
                  </h3>
                  <p className="text-xs font-mono-code text-[#38bdf8]">
                    {currentRoleInfo.beginnerTooltip}
                  </p>
                </div>
                <button
                  onClick={handleLoadOfficialRoleLoadout}
                  className="px-3 py-1.5 bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black border border-[#f59e0b]/40 rounded-xs font-tech text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  📦 Pre-cargar Equipo de este Rol
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-tech text-[#f59e0b] uppercase font-bold block mb-1">
                    ¿Qué te otorga este Rol?:
                  </span>
                  <ul className="text-xs text-[#cbd5e1] space-y-1 list-disc list-inside font-mono-code">
                    {currentRoleInfo.whatYouGet.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[11px] font-tech text-[#38bdf8] uppercase font-bold block mb-1">
                    Paquete de Equipo Inicial Típico:
                  </span>
                  <ul className="text-xs text-[#94a3b8] space-y-1 list-disc list-inside font-mono-code">
                    {currentRoleInfo.startingLoadout.itemsBreakdown.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          PASO 3: ESTADÍSTICAS (10 STATS CON TOOLTIPS)
      ==================================================================== */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Barra de Modo de Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111420] p-3 rounded-xs border border-[#222a3e]">
            <div>
              <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#ef4444]" /> ASIGNACIÓN DE LAS 10 ESTADÍSTICAS (STATS)
              </h2>
              <p className="text-xs font-mono-code text-[#64748b]">
                Pasa el mouse sobre cualquier STAT para ver el Hover Tooltip con habilidades dependientes e hitos de combate.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {selectedMethod === 'streetrat' && (
                <div className="flex items-center gap-2">
                  <div className="text-xs font-mono-code px-3 py-1.5 rounded bg-[#090b10] border border-[#262c3e] text-[#38bdf8]">
                    Fila Activa: <strong className="font-tech text-sm text-white">#{selectedStreetratRow}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleRollStreetratStats}
                    className="px-3 py-1.5 bg-[#38bdf8] hover:bg-white text-black font-tech text-xs font-black uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                  >
                    <Dices className="w-4 h-4" />
                    <span>🎲 TIRAR 1d10 (FILA DE PLANTILLA AL AZAR)</span>
                  </button>
                </div>
              )}

              {selectedMethod === 'edgerunner' && (
                <button
                  type="button"
                  onClick={handleRollAllEdgerunnerStats}
                  className="px-3 py-1.5 bg-[#f59e0b] hover:bg-white text-black font-tech text-xs font-black uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                >
                  <Dices className="w-4 h-4" />
                  <span>🎲 TIRAR LOS 10 DADOS (1d10 INDEPENDIENTE POR CADA STAT)</span>
                </button>
              )}

              {selectedMethod === 'complete_package' && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-xs font-mono-code px-3 py-1.5 rounded bg-[#090b10] border border-[#262c3e]">
                    Puntos restantes:{' '}
                    <strong className={`text-base font-tech ${statsPointsRemaining === 0 ? 'text-[#10b981]' : statsPointsRemaining < 0 ? 'text-[#ef4444]' : 'text-[#f59e0b]'}`}>
                      {statsPointsRemaining}
                    </strong>{' '}
                    / 62
                  </div>
                  <button
                    type="button"
                    onClick={handlePresetMinStats}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#38bdf8] text-[#94a3b8] hover:text-black border border-[#262c3e] rounded font-tech text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    2️⃣ Mínimo (2 -&gt; 42 pts)
                  </button>
                  <button
                    type="button"
                    onClick={handlePresetBalancedStats}
                    className="px-2.5 py-1 bg-[#1a1f30] hover:bg-[#38bdf8] text-[#94a3b8] hover:text-black border border-[#262c3e] rounded font-tech text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    ⚖️ Equilibrada (5 -&gt; 12 pts)
                  </button>
                  <button
                    type="button"
                    onClick={handlePresetRoleSuggestedStats}
                    className="px-2.5 py-1 bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black border border-[#f59e0b]/40 rounded font-tech text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    ⚡ Sugerida del Rol (62 pts)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tira de 10 STATS con Hover Tooltips Interactivos */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {STAT_KEYS.map((stat: StatKey, idx: number) => {
              const val = stats[stat] || 6;
              const tooltip = STAT_TOOLTIPS[stat];
              const isRightSide = idx >= 6;
              const isLeftSide = idx <= 2;

              return (
                <div
                  key={stat}
                  onMouseEnter={() => setInspectedStat(stat)}
                  onClick={() => setInspectedStat(stat)}
                  className={`relative group/stat bg-[#121520] p-2.5 rounded-xs border transition-all text-center flex flex-col justify-between hover:z-[100] cursor-pointer ${
                    inspectedStat === stat
                      ? 'border-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                      : 'border-[#20273a] hover:border-[#38bdf8]/60'
                  }`}
                >
                  {/* Hover Tooltip con apertura hacia abajo (top-full pt-2) interactivo */}
                  {tooltip && (
                    <div
                      className={`absolute top-full ${
                        isRightSide ? 'right-0' : isLeftSide ? 'left-0' : 'left-1/2 -translate-x-1/2'
                      } pt-2 hidden group-hover/stat:block z-[110] w-72 text-left`}
                    >
                      <div className="p-3 bg-[#0a0c13] border border-[#38bdf8] rounded-xs shadow-2xl text-xs font-sans relative">
                        {/* Triángulo indicador arriba */}
                        <div
                          className={`w-2 h-2 bg-[#0a0c13] border-l border-t border-[#38bdf8] rotate-45 absolute -top-1.5 ${
                            isRightSide ? 'right-6' : isLeftSide ? 'left-6' : 'left-1/2 -translate-x-1/2'
                          }`}
                        />
                        <div className="flex items-center justify-between border-b border-[#1f2638] pb-1 mb-1.5">
                          <span className="font-tech font-bold text-sm text-[#38bdf8]">
                            {tooltip.name}
                          </span>
                          <span className="text-[9px] font-mono-code bg-[#1f2638] text-[#94a3b8] px-1.5 py-0.5 rounded">
                            STAT
                          </span>
                        </div>
                        <p className="text-[11px] text-[#cbd5e1] leading-relaxed mb-2 font-mono-code">
                          {tooltip.beginnerExplanation}
                        </p>
                        {tooltip.mechanicalBreakpoints && tooltip.mechanicalBreakpoints.length > 0 && (
                          <div className="mb-2 pt-1 border-t border-[#171b26]">
                            <span className="text-[9px] font-mono-code uppercase text-[#f59e0b] block font-bold mb-0.5">
                              Hitos Mecánicos Clave:
                            </span>
                            <ul className="text-[10px] text-[#94a3b8] list-disc list-inside space-y-0.5 font-mono-code">
                              {tooltip.mechanicalBreakpoints.map((bp: string, i: number) => (
                                <li key={i}>{bp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {tooltip.dependentSkills && (
                          <div className="pt-1 border-t border-[#171b26]">
                            <span className="text-[9px] font-mono-code uppercase text-[#38bdf8] block font-bold mb-0.5">
                              Habilidades Vinculadas:
                            </span>
                            <p className="text-[10px] text-[#64748b] font-mono-code line-clamp-2">
                              {tooltip.dependentSkills.slice(0, 5).join(', ')}
                              {tooltip.dependentSkills.length > 5 ? '...' : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-tech text-[#94a3b8]">
                    <span className="font-bold text-white">{stat}</span>
                    <HelpCircle className="w-3 h-3 text-[#64748b] group-hover/stat:text-[#38bdf8]" />
                  </div>

                  <div className="font-tech text-3xl font-black text-[#dc2626] my-1">
                    {val}
                  </div>

                  {/* Controles según el Método de Creación */}
                  {selectedMethod === 'streetrat' && (
                    <div className="text-[10px] font-mono-code text-[#38bdf8] pt-1">
                      Fila #{selectedStreetratRow}
                    </div>
                  )}

                  {selectedMethod === 'edgerunner' && (
                    <div className="pt-1.5 border-t border-[#1a1f30] space-y-1">
                      <div className="text-[10px] font-mono-code text-[#f59e0b] truncate">
                        🎲 Dado: #{edgerunnerRolls[stat] || 1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRollSingleEdgerunnerStat(stat);
                        }}
                        className="w-full py-0.5 bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black rounded text-[9px] font-mono-code flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        title={`Tirar 1d10 para ${stat}`}
                      >
                        <Dices className="w-2.5 h-2.5" />
                        <span>Re-tirar</span>
                      </button>
                    </div>
                  )}

                  {selectedMethod === 'complete_package' && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1 pt-1.5 border-t border-[#1a1f30]"
                    >
                      <button
                        type="button"
                        onClick={() => setStats((prev) => ({ ...prev, [stat]: Math.max(2, val - 1) }))}
                        disabled={val <= 2}
                        className="w-5 h-5 bg-[#1b2030] hover:bg-[#dc2626] disabled:opacity-30 disabled:hover:bg-[#1b2030] text-white rounded flex items-center justify-center text-xs cursor-pointer"
                        title="Reducir stat (mín 2)"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setStats((prev) => ({ ...prev, [stat]: Math.min(8, val + 1) }))}
                        disabled={val >= 8 || statsPointsRemaining <= 0}
                        className="w-5 h-5 bg-[#1b2030] hover:bg-[#10b981] disabled:opacity-30 disabled:hover:bg-[#1b2030] text-white rounded flex items-center justify-center text-xs cursor-pointer"
                        title="Aumentar stat (máx 8)"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tabla 10x10 Streetrat: Filas 1..10 oficiales del Rol */}
          {selectedMethod === 'streetrat' && (
            <div className="bg-[#0f121c] border border-[#22293d] rounded-xs p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1c2234] pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-tech text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                    📋 TABLA DE PLANTILLAS STREETRAT // {currentRoleInfo.name.toUpperCase()} (10 FILAS OFICIALES)
                  </span>
                  <span className="text-[10px] font-mono-code bg-[#1f2638] text-[#38bdf8] px-2 py-0.5 rounded font-bold">
                    FILA ACTIVA: #{selectedStreetratRow}
                  </span>
                </div>
                <span className="text-[10px] font-mono-code text-[#64748b]">
                  Haz clic en cualquier fila o usa el botón de tirar 1d10 para asignarla
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono-code text-center border-collapse">
                  <thead>
                    <tr className="bg-[#151928] text-[#94a3b8] text-[11px] font-tech uppercase">
                      <th className="py-1.5 px-2 text-left">Fila / 1d10</th>
                      {STAT_KEYS.map((k) => (
                        <th key={k} className="py-1.5 px-2">{k}</th>
                      ))}
                      <th className="py-1.5 px-2 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRoleInfo.edgerunnerStatTable?.map((row, idx) => {
                      const rowNum = idx + 1;
                      const isActive = selectedStreetratRow === rowNum;
                      return (
                        <tr
                          key={rowNum}
                          onClick={() => handleSelectStreetratRow(rowNum)}
                          className={`border-b border-[#181d2c] transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#38bdf8]/20 text-white font-bold border-l-4 border-l-[#38bdf8]'
                              : 'hover:bg-[#151824] text-[#cbd5e1]'
                          }`}
                        >
                          <td className="py-1.5 px-2 text-left font-tech font-bold text-[#38bdf8]">
                            {isActive ? `▶ Fila #${rowNum}` : `Fila #${rowNum}`}
                          </td>
                          {STAT_KEYS.map((k) => (
                            <td key={k} className="py-1.5 px-2">
                              {row[k]}
                            </td>
                          ))}
                          <td className="py-1.5 px-2 text-right">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-tech font-bold uppercase ${
                              isActive ? 'bg-[#38bdf8] text-black' : 'bg-[#181d2c] text-[#64748b]'
                            }`}>
                              {isActive ? 'Activa' : 'Elegir'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Matriz 10x10 Edgerunner: Tiradas de 1d10 independientes por cada STAT */}
          {selectedMethod === 'edgerunner' && (
            <div className="bg-[#0f121c] border border-[#22293d] rounded-xs p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1c2234] pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-tech text-xs font-bold text-[#f59e0b] uppercase tracking-wider">
                    🎲 MATRIZ DE TIRADAS EDGERUNNER // {currentRoleInfo.name.toUpperCase()} (1d10 INDEPENDIENTE POR STAT)
                  </span>
                </div>
                <span className="text-[10px] font-mono-code text-[#64748b]">
                  Haz clic en cualquier celda para fijar la tirada de ese STAT
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono-code text-center border-collapse">
                  <thead>
                    <tr className="bg-[#151928] text-[#94a3b8] text-[11px] font-tech uppercase">
                      <th className="py-1.5 px-2 text-left">Dado 1d10</th>
                      {STAT_KEYS.map((k) => (
                        <th key={k} className="py-1.5 px-2">
                          <div>{k}</div>
                          <div className="text-[9px] text-[#f59e0b] font-mono-code">#{edgerunnerRolls[k] || 1} ({stats[k]})</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 10 }).map((_, rIdx) => {
                      const dieRoll = rIdx + 1;
                      const rowData = currentRoleInfo.edgerunnerStatTable?.[rIdx];
                      return (
                        <tr key={dieRoll} className="border-b border-[#181d2c]">
                          <td className="py-1 px-2 text-left font-tech font-bold text-[#94a3b8]">
                            Dado {dieRoll}
                          </td>
                          {STAT_KEYS.map((k) => {
                            const cellVal = rowData?.[k] ?? 6;
                            const isSelected = (edgerunnerRolls[k] || 1) === dieRoll;
                            return (
                              <td
                                key={k}
                                onClick={() => handleSelectEdgerunnerCell(k, dieRoll)}
                                className={`py-1 px-2 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#f59e0b] text-black font-black shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                                    : 'hover:bg-[#1e2538] text-[#cbd5e1]'
                                }`}
                                title={`Fijar ${k} = ${cellVal} (Dado ${dieRoll})`}
                              >
                                {cellVal}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Panel: INSPECTOR DE STAT EN FOCO */}
          {STAT_TOOLTIPS[inspectedStat] && (
            <div className="chamfer-card bg-[#111420] border border-[#38bdf8]/50 p-3.5 rounded-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1c2438] pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-tech text-base font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-[#38bdf8]">[INSPECTOR DE STAT EN FOCO]:</span>
                    <span>{STAT_TOOLTIPS[inspectedStat].name} ({STAT_TOOLTIPS[inspectedStat].spanishName})</span>
                  </span>
                  <span className="text-[10px] font-mono-code bg-[#1f2638] text-[#38bdf8] px-2 py-0.5 rounded font-bold">
                    VALOR ACTUAL: {stats[inspectedStat]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono-code text-[#64748b]">
                  <span>Haz hover o clic en cualquier STAT para cambiar el foco</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-mono-code">
                <div className="md:col-span-7 space-y-2">
                  <p className="text-[#e2e8f0] font-sans leading-relaxed text-xs">
                    {STAT_TOOLTIPS[inspectedStat].beginnerExplanation}
                  </p>
                  <p className="text-[11px] text-[#94a3b8] italic">
                    {STAT_TOOLTIPS[inspectedStat].shortSummary}
                  </p>
                </div>

                <div className="md:col-span-5 space-y-2 bg-[#0a0d14] p-2.5 rounded border border-[#1b2234]">
                  {STAT_TOOLTIPS[inspectedStat].mechanicalBreakpoints && STAT_TOOLTIPS[inspectedStat].mechanicalBreakpoints.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono-code uppercase text-[#f59e0b] font-bold block mb-1">
                        ⚡ HITOS MECÁNICOS CLAVE:
                      </span>
                      <ul className="text-[10px] text-[#cbd5e1] space-y-1 list-disc list-inside">
                        {STAT_TOOLTIPS[inspectedStat].mechanicalBreakpoints.map((bp: string, i: number) => (
                          <li key={i}>{bp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {STAT_TOOLTIPS[inspectedStat].dependentSkills && (
                    <div className="pt-1.5 border-t border-[#182030]">
                      <span className="text-[10px] font-mono-code uppercase text-[#38bdf8] font-bold block mb-1">
                        🎯 HABILIDADES DEPENDIENTES:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {STAT_TOOLTIPS[inspectedStat].dependentSkills.map((sk: string, i: number) => (
                          <span
                            key={i}
                            className="text-[9px] bg-[#141b29] text-[#7dd3fc] border border-[#21314d] px-1.5 py-0.5 rounded"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Panel de Derivadas en Vivo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a0d14] p-3.5 rounded-xs border border-[#1e2538]">
            <div className="bg-[#121622] p-2.5 rounded border border-[#222a3e] text-center">
              <span className="text-[10px] font-mono-code text-[#94a3b8] uppercase block">HP MÁXIMO</span>
              <span className="font-tech text-2xl font-black text-[#10b981]">{maxHp}</span>
              <span className="text-[9px] font-mono-code text-[#64748b] block">10 + 5×⌈(BODY+WILL)/2⌉</span>
            </div>
            <div className="bg-[#121622] p-2.5 rounded border border-[#222a3e] text-center">
              <span className="text-[10px] font-mono-code text-[#94a3b8] uppercase block">SERIOUSLY WOUNDED</span>
              <span className="font-tech text-2xl font-black text-[#f59e0b]">{seriouslyWounded}</span>
              <span className="text-[9px] font-mono-code text-[#64748b] block">Penalizador -2 si HP &lt; {seriouslyWounded}</span>
            </div>
            <div className="bg-[#121622] p-2.5 rounded border border-[#222a3e] text-center">
              <span className="text-[10px] font-mono-code text-[#94a3b8] uppercase block">DEATH SAVE BASE</span>
              <span className="font-tech text-2xl font-black text-[#ef4444]">{deathSave}</span>
              <span className="text-[9px] font-mono-code text-[#64748b] block">Tirar 1d10 &lt; {deathSave} para vivir</span>
            </div>
            <div className="bg-[#121622] p-2.5 rounded border border-[#222a3e] text-center">
              <span className="text-[10px] font-mono-code text-[#94a3b8] uppercase block">HUMANIDAD INICIAL</span>
              <span className="font-tech text-2xl font-black text-[#38bdf8]">{initialHumanity}</span>
              <span className="text-[9px] font-mono-code text-[#64748b] block">EMP ({stats.EMP}) × 10</span>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PASO 4: HABILIDADES (SKILLS GUIADAS)
      ==================================================================== */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111420] p-3 rounded-xs border border-[#222a3e]">
            <div>
              <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-[#38bdf8]" /> ASIGNACIÓN DE HABILIDADES (PRESUPUESTO: 86 PUNTOS)
              </h2>
              <p className="text-xs font-mono-code text-[#64748b]">
                13 Habilidades Básicas Obligatorias prefijadas a Nivel 2 (26 pts base). Puntos restantes para personalizar:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="text-xs font-mono-code px-3 py-1.5 rounded bg-[#090b10] border border-[#262c3e]">
                Puntos restantes:{' '}
                <strong className={`text-base font-tech ${skillPointsRemaining === 0 ? 'text-[#10b981]' : skillPointsRemaining < 0 ? 'text-[#ef4444]' : 'text-[#f59e0b]'}`}>
                  {skillPointsRemaining}
                </strong>{' '}
                / 86
              </div>

              <button
                type="button"
                onClick={handleResetSkillsToBasic}
                className="px-3 py-1.5 bg-[#171a26] hover:bg-[#38bdf8] text-[#cbd5e1] hover:text-black border border-[#23293c] rounded-xs font-tech text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                title="Restablece las 13 habilidades básicas a nivel 2 y las demás a 0"
              >
                <span>🔄 RESETEAR A BÁSICAS (60 PTS LIBRES)</span>
              </button>

              <button
                type="button"
                onClick={handleAutoAssignTemplateSkills}
                className="px-3 py-1.5 bg-[#f59e0b] hover:bg-white text-black font-tech text-xs font-black uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ CARGAR PLANTILLA SUGERIDA DEL ROL</span>
              </button>
            </div>
          </div>

          {/* Grilla de Habilidades de Combate */}
          <div>
            <h3 className="font-tech text-xs font-bold text-[#dc2626] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> HABILIDADES DE COMBATE (ARMAS &amp; ESQUIVAR)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {(Object.keys(combatSkills) as CombatSkillKey[]).map((skillKey) => {
                const meta = SKILL_METADATA[skillKey];
                const level = combatSkills[skillKey] || 0;
                const isBasic = BASIC_COMBAT_KEYS.includes(skillKey);
                const minLevel = isBasic ? 2 : 0;
                const isDouble = skillKey === 'autofire' || skillKey === 'heavyWeapons' || skillKey === 'martialArts';
                const cost = isDouble ? 2 : 1;

                return (
                  <div
                    key={skillKey}
                    className={`p-2.5 rounded-xs border flex items-center justify-between gap-2 ${
                      isBasic ? 'bg-[#141824] border-[#293248]' : 'bg-[#121520] border-[#202638]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-tech text-xs font-bold text-white">{meta?.label || skillKey}</span>
                        {isBasic && (
                          <span className="text-[8px] font-mono-code bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 px-1 rounded font-bold">
                            BÁSICA (MÍN 2)
                          </span>
                        )}
                        {isDouble && (
                          <span className="text-[8px] font-mono-code bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 px-1 rounded font-bold">
                            COSTE x2
                          </span>
                        )}
                        <span className="text-[9px] font-mono-code text-[#64748b]">({meta?.stat})</span>
                      </div>
                      <p className="text-[10px] font-mono-code text-[#94a3b8] line-clamp-1">{meta?.summary}</p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#090b10] px-2 py-1 rounded border border-[#1d2334]">
                      <button
                        type="button"
                        onClick={() => setCombatSkills((prev) => ({ ...prev, [skillKey]: Math.max(minLevel, level - 1) }))}
                        disabled={level <= minLevel}
                        className="w-4 h-4 bg-[#1e2334] hover:bg-[#dc2626] disabled:opacity-20 text-white rounded text-xs flex items-center justify-center cursor-pointer"
                        title={level <= minLevel ? `Nivel mínimo (${minLevel}) alcanzado` : 'Reducir nivel'}
                      >
                        -
                      </button>
                      <span className="font-tech text-sm font-bold text-[#38bdf8] min-w-[14px] text-center">
                        {level}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCombatSkills((prev) => ({ ...prev, [skillKey]: Math.min(6, level + 1) }))}
                        disabled={level >= 6 || skillPointsRemaining < cost}
                        className="w-4 h-4 bg-[#1e2334] hover:bg-[#10b981] disabled:opacity-20 text-white rounded text-xs flex items-center justify-center cursor-pointer"
                        title={level >= 6 ? 'Nivel máximo (6) alcanzado' : skillPointsRemaining < cost ? 'Puntos insuficientes' : 'Aumentar nivel'}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grilla de Habilidades Generales */}
          <div>
            <h3 className="font-tech text-xs font-bold text-[#38bdf8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> HABILIDADES GENERALES (RED CANONICAL)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {pureGeneralSkills.map((gSkill) => {
                const level = generalSkills[gSkill.key] ?? (gSkill.isBasic ? 2 : 0);
                const minLevel = gSkill.isBasic ? 2 : 0;
                const isDouble = !!gSkill.isDoubleCost;
                const cost = isDouble ? 2 : 1;

                return (
                  <div
                    key={gSkill.key}
                    className={`p-2 rounded-xs border flex items-center justify-between gap-2 ${
                      gSkill.isBasic
                        ? 'bg-[#141824] border-[#293248]'
                        : 'bg-[#10121a] border-[#1c2232]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-tech text-xs font-bold text-white">{gSkill.label}</span>
                        {gSkill.isBasic && (
                          <span className="text-[8px] font-mono-code bg-[#38bdf8]/20 text-[#38bdf8] px-1 rounded font-bold">
                            BÁSICA (MÍN 2)
                          </span>
                        )}
                        {isDouble && (
                          <span className="text-[8px] font-mono-code bg-[#f59e0b]/20 text-[#f59e0b] px-1 rounded font-bold">
                            COSTE x2
                          </span>
                        )}
                        <span className="text-[9px] font-mono-code text-[#64748b]">({gSkill.stat})</span>
                      </div>
                      <p className="text-[10px] font-mono-code text-[#94a3b8] line-clamp-1">{gSkill.tooltip}</p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#090b10] px-2 py-1 rounded border border-[#1d2334]">
                      <button
                        type="button"
                        onClick={() => setGeneralSkills((prev) => ({ ...prev, [gSkill.key]: Math.max(minLevel, level - 1) }))}
                        disabled={level <= minLevel}
                        className="w-4 h-4 bg-[#1e2334] hover:bg-[#dc2626] disabled:opacity-20 text-white rounded text-xs flex items-center justify-center cursor-pointer"
                        title={level <= minLevel ? `Nivel mínimo (${minLevel}) alcanzado` : 'Reducir nivel'}
                      >
                        -
                      </button>
                      <span className="font-tech text-sm font-bold text-white min-w-[14px] text-center">
                        {level}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGeneralSkills((prev) => ({ ...prev, [gSkill.key]: Math.min(6, level + 1) }))}
                        disabled={level >= 6 || skillPointsRemaining < cost}
                        className="w-4 h-4 bg-[#1e2334] hover:bg-[#10b981] disabled:opacity-20 text-white rounded text-xs flex items-center justify-center cursor-pointer"
                        title={level >= 6 ? 'Nivel máximo (6) alcanzado' : skillPointsRemaining < cost ? 'Puntos insuficientes' : 'Aumentar nivel'}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PASO 5: LIFEPATH HÍBRIDO (TIRAR DADOS O EDITAR MANUALMENTE)
      ==================================================================== */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111420] p-3 rounded-xs border border-[#222a3e]">
            <div>
              <h2 className="font-tech text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#f59e0b]" /> 5.1 LIFEPATH (HISTORIAL Y MOTIVACIONES)
              </h2>
              <p className="text-xs font-mono-code text-[#64748b]">
                Puedes tirar dados 1d10 en cada campo para obtener un resultado del Core Rulebook O escribir tus propios detalles a mano.
              </p>
            </div>

            <button
              onClick={handleRandomizeFullLifepath}
              className="px-3.5 py-1.5 bg-[#f59e0b] hover:bg-white text-black font-tech text-xs font-black uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            >
              <Dices className="w-4 h-4" />
              <span>🎲 GENERAR TODO EL LIFEPATH AL AZAR</span>
            </button>
          </div>

          {/* Grilla de Campos de Lifepath */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Origen Cultural', key: 'culturalRegion', table: LIFEPATH_TABLES.culturalRegions },
              { label: 'Personalidad', key: 'personality', table: LIFEPATH_TABLES.personalities },
              { label: 'Estilo de Ropa', key: 'clothingStyle', table: LIFEPATH_TABLES.clothingStyles },
              { label: 'Peinado / Cabello', key: 'hairstyle', table: LIFEPATH_TABLES.hairstyles },
              { label: 'Rasgo / Afectación', key: 'affectation', table: LIFEPATH_TABLES.affectations },
              { label: 'Qué valoras más', key: 'valueMost', table: LIFEPATH_TABLES.valuesMost },
              { label: 'Opinión sobre la gente', key: 'feelAboutPeople', table: LIFEPATH_TABLES.feelingsAboutPeople },
              { label: 'Persona más valorada', key: 'valuedPerson', table: LIFEPATH_TABLES.valuedPersons },
              { label: 'Posesión más valorada', key: 'valuedPossession', table: LIFEPATH_TABLES.valuedPossessions },
              { label: 'Trasfondo Familiar', key: 'familyBackground', table: LIFEPATH_TABLES.familyBackgrounds },
              { label: 'Entorno de Infancia', key: 'childhoodEnvironment', table: LIFEPATH_TABLES.childhoodEnvironments },
              { label: 'Crisis Familiar', key: 'familyCrisis', table: LIFEPATH_TABLES.familyCrises },
              { label: 'Meta de Vida', key: 'lifeGoal', table: LIFEPATH_TABLES.lifeGoals }
            ].map((field) => {
              const currentVal = (lifepath as any)[field.key] || '';
              return (
                <div key={field.key} className="bg-[#10121a] p-2.5 rounded border border-[#1f2434] space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono-code text-[#38bdf8] uppercase font-bold">
                      {field.label}
                    </label>
                    <button
                      onClick={() => {
                        const random = field.table[Math.floor(Math.random() * field.table.length)];
                        setLifepath((prev) => ({ ...prev, [field.key]: random }));
                      }}
                      className="text-[9px] font-mono-code text-[#f59e0b] hover:text-white flex items-center gap-0.5 cursor-pointer"
                    >
                      <Dices className="w-2.5 h-2.5" /> Tirar 1d10
                    </button>
                  </div>
                  <input
                    type="text"
                    value={currentVal}
                    onChange={(e) => setLifepath({ ...lifepath, [field.key]: e.target.value })}
                    className="w-full bg-[#08090f] border border-[#242b3c] text-white font-mono-code text-xs px-2.5 py-1 rounded focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              );
            })}
          </div>

          {/* 🔧 LIFEPATH ESPECÍFICO DE TU ROL ({selectedRoleKey.toUpperCase()}) */}
          {(() => {
            const roleKey = selectedRoleKey.toLowerCase();
            const roleQuestions =
              ROLE_SPECIFIC_LIFEPATH_TABLES_BY_ROLE[roleKey] ||
              ROLE_LIFEPATH_QUESTIONS[roleKey] ||
              [];

            if (roleQuestions.length === 0) return null;

            const handleRollAllRoleLifepath = () => {
              const updatedAnswers: Record<string, string> = { ...(lifepath.roleLifepath || {}) };
              for (const q of roleQuestions) {
                const rand = q.options[Math.floor(Math.random() * q.options.length)];
                updatedAnswers[q.id] = rand;
              }
              setLifepath((prev) => ({
                ...prev,
                roleLifepath: updatedAnswers,
                roleSpecificLifepath: { ...(prev.roleSpecificLifepath || {}), ...updatedAnswers }
              }));
              showToast(`🎲 Tablas de Lifepath de ${selectedRoleKey.toUpperCase()} generadas con dados.`);
            };

            return (
              <div className="bg-[#0b0e17] border border-[#f59e0b]/40 p-4 rounded-xs space-y-3 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222a3e] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-sm font-black text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔧 LIFEPATH ESPECÍFICO DE TU ROL ({selectedRoleKey.toUpperCase()})</span>
                    </span>
                    {roleKey === 'tech' && (
                      <span className="text-[9px] font-mono-code bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 px-2 py-0.5 rounded font-bold uppercase">
                        CANÓNICO CORE PÁG. 55 (6 TABLAS)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleRollAllRoleLifepath}
                    className="px-3 py-1 bg-[#f59e0b] hover:bg-white text-black font-tech text-xs font-black uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    <span>🎲 TIRAR TODAS LAS TABLAS DE {selectedRoleKey.toUpperCase()}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {roleQuestions.map((q) => {
                    const currentAns =
                      lifepath.roleSpecificLifepath?.[q.id] ||
                      lifepath.roleLifepath?.[q.id] ||
                      q.options[0];
                    const diceType = (q as any).dice || '1d6';

                    return (
                      <div key={q.id} className="bg-[#121522] p-3 rounded border border-[#1f263c] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[11px] font-tech text-[#cbd5e1] font-bold block leading-tight">
                            {q.label}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const rand = q.options[Math.floor(Math.random() * q.options.length)];
                              setLifepath((prev) => ({
                                ...prev,
                                roleLifepath: { ...(prev.roleLifepath || {}), [q.id]: rand },
                                roleSpecificLifepath: { ...(prev.roleSpecificLifepath || {}), [q.id]: rand }
                              }));
                            }}
                            className="text-[10px] font-mono-code bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black border border-[#f59e0b]/40 px-2 py-0.5 rounded font-bold flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
                            title={`Tirar ${diceType} aleatorio`}
                          >
                            <Dices className="w-3 h-3" />
                            <span>Tirar {diceType}</span>
                          </button>
                        </div>

                        {/* Selector de opciones canónicas de la tabla */}
                        <select
                          value={q.options.includes(currentAns) ? currentAns : '__custom__'}
                          onChange={(e) => {
                            if (e.target.value !== '__custom__') {
                              setLifepath((prev) => ({
                                ...prev,
                                roleLifepath: { ...(prev.roleLifepath || {}), [q.id]: e.target.value },
                                roleSpecificLifepath: { ...(prev.roleSpecificLifepath || {}), [q.id]: e.target.value }
                              }));
                            }
                          }}
                          className="w-full bg-[#080a10] border border-[#232b40] text-xs font-mono-code text-[#38bdf8] px-2.5 py-1.5 rounded focus:outline-none focus:border-[#38bdf8]"
                        >
                          {q.options.map((opt, optIdx) => (
                            <option key={optIdx} value={opt}>
                              #{optIdx + 1}: {opt}
                            </option>
                          ))}
                          <option value="__custom__">-- Personalizado / Escribir abajo --</option>
                        </select>

                        <input
                          type="text"
                          value={currentAns}
                          onChange={(e) =>
                            setLifepath((prev) => ({
                              ...prev,
                              roleLifepath: { ...(prev.roleLifepath || {}), [q.id]: e.target.value },
                              roleSpecificLifepath: { ...(prev.roleSpecificLifepath || {}), [q.id]: e.target.value }
                            }))
                          }
                          placeholder="O escribe tu propio texto personalizado..."
                          className="w-full bg-[#07080d] border border-[#1b2234] text-white font-mono-code text-xs px-2.5 py-1 rounded focus:outline-none focus:border-[#f59e0b]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Constructor de Amigos y Romances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amigos */}
            <div className="bg-[#10131d] p-3 rounded border border-[#1e2538] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-tech text-xs font-bold text-white uppercase">Amigos Trágicos / Aliados</span>
                <button
                  onClick={handleAddManualFriend}
                  className="px-2 py-0.5 bg-[#1e2538] hover:bg-[#38bdf8] text-[#94a3b8] hover:text-black font-tech text-[10px] uppercase rounded-2xs cursor-pointer"
                >
                  + Añadir Amigo
                </button>
              </div>
              {lifepath.friends.map((friend, fIdx) => (
                <div key={fIdx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={friend}
                    onChange={(e) => {
                      const updated = [...lifepath.friends];
                      updated[fIdx] = e.target.value;
                      setLifepath({ ...lifepath, friends: updated });
                    }}
                    className="flex-1 bg-[#090b10] border border-[#22283a] text-xs font-mono-code text-white px-2 py-1 rounded"
                  />
                  <button
                    onClick={() => {
                      setLifepath({
                        ...lifepath,
                        friends: lifepath.friends.filter((_, i) => i !== fIdx)
                      });
                    }}
                    className="p-1 text-[#64748b] hover:text-[#ef4444] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Romances Trágicos */}
            <div className="bg-[#10131d] p-3 rounded border border-[#1e2538] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-tech text-xs font-bold text-white uppercase">Romances Trágicos</span>
                <button
                  onClick={handleAddManualRomance}
                  className="px-2 py-0.5 bg-[#1e2538] hover:bg-[#ef4444] text-[#94a3b8] hover:text-white font-tech text-[10px] uppercase rounded-2xs cursor-pointer"
                >
                  + Añadir Romance
                </button>
              </div>
              {lifepath.tragicLoveAffairs.map((romance, rIdx) => (
                <div key={rIdx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={romance}
                    onChange={(e) => {
                      const updated = [...lifepath.tragicLoveAffairs];
                      updated[rIdx] = e.target.value;
                      setLifepath({ ...lifepath, tragicLoveAffairs: updated });
                    }}
                    className="flex-1 bg-[#090b10] border border-[#22283a] text-xs font-mono-code text-white px-2 py-1 rounded"
                  />
                  <button
                    onClick={() => {
                      setLifepath({
                        ...lifepath,
                        tragicLoveAffairs: lifepath.tragicLoveAffairs.filter((_, i) => i !== rIdx)
                      });
                    }}
                    className="p-1 text-[#64748b] hover:text-[#ef4444] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Constructor de Enemigos (4 Dimensiones) */}
          <div className="bg-[#12141f] border border-[#22273a] p-3.5 rounded-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#1c2234] pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ef4444]" />
                <span className="font-tech text-xs font-bold text-white uppercase">
                  CONSTRUCTOR DE ENEMIGOS (4 DIMENSIONES OFICIALES)
                </span>
              </div>
              <button
                onClick={handleAddManualEnemy}
                className="px-2.5 py-1 bg-[#ef4444]/20 hover:bg-[#ef4444] text-[#ef4444] hover:text-white border border-[#ef4444]/40 font-tech text-xs font-bold uppercase rounded-xs cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Añadir Enemigo
              </button>
            </div>

            {lifepath.enemies.length === 0 ? (
              <p className="text-xs font-mono-code text-[#64748b] text-center py-4">
                No tienes enemigos registrados aún. Pulsa "+ Añadir Enemigo" o genera el Lifepath completo.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lifepath.enemies.map((enemy, eIdx) => (
                  <div key={enemy.id || eIdx} className="bg-[#0a0d14] p-3 rounded border border-[#202638] space-y-2 text-xs font-mono-code">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#ef4444] font-bold uppercase">Enemigo #{eIdx + 1}</span>
                      <button
                        onClick={() => {
                          setLifepath({
                            ...lifepath,
                            enemies: lifepath.enemies.filter((_, i) => i !== eIdx)
                          });
                        }}
                        className="text-[#64748b] hover:text-[#ef4444] cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#94a3b8] uppercase block">¿Quién es?:</span>
                      <input
                        type="text"
                        value={enemy.who}
                        onChange={(e) => {
                          const updated = [...lifepath.enemies];
                          updated[eIdx].who = e.target.value;
                          setLifepath({ ...lifepath, enemies: updated });
                        }}
                        className="w-full bg-[#121520] border border-[#242c3e] text-white p-1 rounded text-xs"
                      />
                    </div>

                    <div>
                      <span className="text-[9px] text-[#94a3b8] uppercase block">¿Qué causó la enemistad?:</span>
                      <input
                        type="text"
                        value={enemy.cause}
                        onChange={(e) => {
                          const updated = [...lifepath.enemies];
                          updated[eIdx].cause = e.target.value;
                          setLifepath({ ...lifepath, enemies: updated });
                        }}
                        className="w-full bg-[#121520] border border-[#242c3e] text-white p-1 rounded text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] text-[#94a3b8] uppercase block">Fuerzas que arroja:</span>
                        <input
                          type="text"
                          value={enemy.throwAtYou}
                          onChange={(e) => {
                            const updated = [...lifepath.enemies];
                            updated[eIdx].throwAtYou = e.target.value;
                            setLifepath({ ...lifepath, enemies: updated });
                          }}
                          className="w-full bg-[#121520] border border-[#242c3e] text-white p-1 rounded text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-[#94a3b8] uppercase block">Si se cruzan:</span>
                        <input
                          type="text"
                          value={enemy.reaction}
                          onChange={(e) => {
                            const updated = [...lifepath.enemies];
                            updated[eIdx].reaction = e.target.value;
                            setLifepath({ ...lifepath, enemies: updated });
                          }}
                          className="w-full bg-[#121520] border border-[#242c3e] text-white p-1 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          PASO 6: ECONOMÍA INICIAL, DEUDA (SELLING OUT) Y TIENDA
      ==================================================================== */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Fila Superior: Handle, Fondos y Humanidad Resultante */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#111420] p-3.5 rounded-xs border border-[#222a3e] items-center">
            <div className="space-y-1">
              <label className="text-[10px] font-mono-code text-[#38bdf8] uppercase font-bold block">
                Alias / Nombre de tu Edgerunner:
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="ej. V, David, Johnny..."
                className="w-full bg-[#080a10] border border-[#262c3e] text-white font-tech text-base font-bold px-3 py-1.5 rounded focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div className="bg-[#090b10] p-2.5 rounded border border-[#1e2334] text-center">
              <span className="text-[10px] font-mono-code text-[#94a3b8] uppercase block">FONDOS DISPONIBLES</span>
              <span className="font-tech text-2xl font-black text-[#10b981]">
                {eurodollars.toLocaleString()} €$
              </span>
              <span className="text-[9px] font-mono-code text-[#64748b] block">
                + {fashionBudget} €$ exclusivos para Ropa/Estilo
              </span>
            </div>

            <div className="bg-[#090b10] p-2.5 rounded border border-[#1e2334] text-center">
              <span className="text-[10px] font-mono-code text-[#94a3b8] uppercase block">HUMANIDAD RESULTANTE</span>
              <span className="font-tech text-2xl font-black text-[#38bdf8]">
                {initialHumanity} HUM
              </span>
              <span className="text-[9px] font-mono-code text-[#64748b] block">
                {installedCyberwareIds.length} Implantes seleccionados
              </span>
            </div>
          </div>

          {/* Panel Selling Out / Deuda Inicial (Core p. 118) */}
          <div className="bg-[#12141f] border border-[#22273a] p-4 rounded-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[#1c2234] pb-2">
              <Coins className="w-5 h-5 text-[#f59e0b]" />
              <h3 className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                VENDER EL ALMA // EMPEZAR CON DEUDA (SELLING OUT - CORE P. 118)
              </h3>
            </div>
            <p className="text-xs font-mono-code text-[#94a3b8] leading-relaxed">
              Regla oficial opcional: Puedes comenzar con dinero extra para equipo o cromo militar a cambio de deberle tu lealtad a una Megacorporación, a la Policía o al Crimen Organizado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SELLING_OUT_CATALOG.map((opt) => {
                const isSelected = debtOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setDebtOptionId(opt.id);
                      if (opt.id === 'none') {
                        setEurodollars(2550);
                      } else if (opt.id === 'minor') {
                        setEurodollars(2550 + 1500);
                      } else if (opt.id === 'major') {
                        setEurodollars(2550 + 3000);
                      } else {
                        setEurodollars(2550 + customDebtAmount);
                      }
                    }}
                    className={`p-3 rounded-xs border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#181c2b] border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : 'bg-[#0f1118] border-[#1d2332] hover:border-[#f59e0b]/50'
                    }`}
                  >
                    <div>
                      <span className="font-tech text-sm font-bold text-white block mb-1">
                        {opt.label}
                      </span>
                      <span className="text-[11px] font-tech text-[#10b981] font-bold block mb-1">
                        {opt.extraCash > 0 ? `+${opt.extraCash.toLocaleString()} €$ Extra` : 'Sin Fondos Extra'}
                      </span>
                      <p className="text-[10px] font-mono-code text-[#94a3b8] leading-tight">
                        {opt.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`w-full py-1 mt-2 text-[10px] font-tech font-bold uppercase rounded ${
                        isSelected ? 'bg-[#f59e0b] text-black' : 'bg-[#181d2a] text-[#94a3b8]'
                      }`}
                    >
                      {isSelected ? '✓ SELECCIONADO' : 'ELEGIR'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Configuración de Acreedor si hay Deuda */}
            {debtOptionId !== 'none' && (
              <div className="p-3 bg-[#0a0c12] border border-[#242b3c] rounded-xs grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-code">
                <div>
                  <label className="text-[#94a3b8] uppercase text-[9px] block">Tipo de Acreedor:</label>
                  <select
                    value={debtCreditorType}
                    onChange={(e) => setDebtCreditorType(e.target.value as any)}
                    className="w-full bg-[#121520] border border-[#22283a] text-white p-1.5 rounded mt-1"
                  >
                    <option value="corp">Megacorporación (Arasaka / Militech / Kang Tao)</option>
                    <option value="law">Fuerzas de la Ley (NCPD / MaxTac)</option>
                    <option value="gang">Sindicato del Crimen / Pandilla (Maelstrom / Valentinos)</option>
                    <option value="custom">Acreedor Personalizado</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#94a3b8] uppercase text-[9px] block">Nombre del Acreedor / Contacto:</label>
                  <input
                    type="text"
                    value={debtCreditorName}
                    onChange={(e) => setDebtCreditorName(e.target.value)}
                    className="w-full bg-[#121520] border border-[#22283a] text-white p-1.5 rounded mt-1"
                  />
                </div>
                <div>
                  <label className="text-[#94a3b8] uppercase text-[9px] block">Condiciones / Consecuencias:</label>
                  <input
                    type="text"
                    value={debtTerms}
                    onChange={(e) => setDebtTerms(e.target.value)}
                    className="w-full bg-[#121520] border border-[#22283a] text-white p-1.5 rounded mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tienda Inicial Interactiva & Carga de Paquete Oficial */}
          <div className="bg-[#10131d] border border-[#202538] p-4 rounded-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1c2234] pb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#38bdf8]" />
                <h3 className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                  ARSENAL &amp; TIENDA INICIAL (CATÁLOGO OFICIAL CPR)
                </h3>
              </div>

              <button
                onClick={handleLoadOfficialRoleLoadout}
                className="px-3 py-1.5 bg-[#f59e0b] hover:bg-white text-black font-tech text-xs font-black uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              >
                <Package className="w-4 h-4" />
                <span>📦 CARGAR PAQUETE OFICIAL DE MI ROL ({selectedRoleKey.toUpperCase()})</span>
              </button>
            </div>

            {/* Pestañas de Categoría de la Tienda */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1 bg-[#121520] p-1 rounded border border-[#20273a]">
                {[
                  { id: 'weapons', label: 'Armas' },
                  { id: 'armor', label: 'Blindaje' },
                  { id: 'cyberware', label: 'Ciberware' },
                  { id: 'gear', label: 'Equipo' },
                  { id: 'ammo', label: 'Munición' },
                  { id: 'drugs', label: 'Drogas' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setShopCategory(c.id as any)}
                    className={`px-3 py-1 font-tech text-xs font-bold uppercase rounded-2xs transition-colors cursor-pointer ${
                      shopCategory === c.id
                        ? 'bg-[#38bdf8] text-black font-black'
                        : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1f30]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar en el catálogo..."
                  value={shopSearch}
                  onChange={(e) => setShopSearch(e.target.value)}
                  className="w-full bg-[#090b10] border border-[#22283a] pl-8 pr-2 py-1 text-xs text-white rounded font-mono-code focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>

            {/* Lista de Artículos de la Categoría */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {(() => {
                const list = ((coreData as any)[shopCategory] || []) as any[];
                const filtered = list.filter((it) =>
                  !shopSearch || (it.name || '').toLowerCase().includes(shopSearch.toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="col-span-3 text-center py-6 text-xs font-mono-code text-[#64748b]">
                      No se encontraron artículos con ese filtro.
                    </div>
                  );
                }

                return filtered.slice(0, 30).map((item) => {
                  const cost = Number(item.cost || 0);
                  const canAfford = eurodollars >= cost;

                  return (
                    <div
                      key={item.id || item.name}
                      className="p-2.5 bg-[#121520] border border-[#1f2638] rounded-xs flex items-center justify-between gap-2 text-xs font-mono-code"
                    >
                      <div className="min-w-0">
                        <span className="font-tech font-bold text-white text-xs block truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#f59e0b] font-bold">
                          {cost} €$
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          if (!canAfford) return;
                          setEurodollars((prev) => Math.max(0, prev - cost));
                          if (shopCategory === 'weapons') {
                            setEquippedWeapons((prev) => [
                              ...prev,
                              {
                                ...item,
                                instanceId: `wep-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                                currentMag: item.standardMag || 0,
                                loadedAmmoType: item.ammoType || 'Standard',
                                inHand: true
                              }
                            ]);
                          } else if (shopCategory === 'cyberware') {
                            if (!installedCyberwareIds.includes(item.id)) {
                              setInstalledCyberwareIds((prev) => [...prev, item.id]);
                            }
                          } else {
                            setInventory((prev) => [
                              ...prev,
                              {
                                id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                                catalogId: item.id || item.name,
                                name: item.name,
                                category: shopCategory as any,
                                cost,
                                quantity: 1,
                                details: item.description || ''
                              }
                            ]);
                          }
                          showToast(`Añadido: ${item.name} (-${cost} €$)`);
                        }}
                        disabled={!canAfford}
                        className="px-2 py-1 bg-[#38bdf8]/20 hover:bg-[#38bdf8] disabled:opacity-20 text-[#38bdf8] hover:text-black border border-[#38bdf8]/40 rounded text-[10px] font-tech font-bold uppercase transition-colors cursor-pointer"
                      >
                        + Comprar
                      </button>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Barra Inferior de Navegación y Finalización */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-6 border-t border-[#1f2538]">
        <div>
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-4 py-2 bg-[#171a26] hover:bg-[#222838] text-[#cbd5e1] font-tech text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Paso Anterior</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-5 py-2.5 bg-[#dc2626] hover:bg-white text-white hover:text-black font-tech text-xs font-black uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(220,38,38,0.3)]"
            >
              <span>Siguiente Paso</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalizeEdgerunner}
              className="px-6 py-2.5 bg-[#10b981] hover:bg-white text-black font-tech text-xs font-black uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-2 shadow-[0_0_14px_rgba(16,185,129,0.4)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>🚀 CREAR EDGERUNNER Y ABRIR FICHA</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
