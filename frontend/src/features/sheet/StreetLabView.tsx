import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { 
  calculateMaxHp, 
  calculateSeriouslyWoundedThreshold, 
  calculateMaxHumanity,
  calculateWeaponAttackBreakdown,
  getEffectiveEmp,
  getEffectiveBody,
  naturalHealingPerDay,
  speedhealAmount
} from '../../engine/characterEngine';
import type { 
  CombatSkillKey, 
  StatKey
} from '../../types/cyberpunk';
import { SKILL_METADATA } from '../../types/cyberpunk';
import coreData from '../../data/core-rules.cprpack.json';
import { STAT_TOOLTIPS } from '../../data/characterCreationData';
import { CharacterCreatorWizard } from '../creator/CharacterCreatorWizard';
import { CHARACTER_PORTRAITS_CATALOG } from '../../data/netAndRolesData';
import { MARTIAL_ARTS_FORMS, MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT } from '../../data/cyberfistsMartialArtsData';
import { CEMK_FOLIO_METADATA_MAP } from '../../data/cemkFolioPremadesData';
import {
  getWeaponClassAndRebuildInfo,
  getAmmoTypeTooltip as getAmmoTooltipInfo,
  getCyberwareCategoryTooltip,
  CEMK_WEAPON_REBUILD_SYSTEM_GUIDE,
  RESTING_AND_ARMOR_REPAIR_OFFICIAL_GUIDE,
  ROLE_ABILITIES_COMPLETE_PROGRESSION,
  type WeaponClassAndRebuildInfo
} from '../../data/weaponAndCyberwareTooltips';
import {
  WEAPON_ATTACHMENTS_CATALOG,
  calculateWeaponSlotCapacity,
  TECH_MAKER_UPGRADE_OPTIONS,
  MAKER_DV_AND_TIME_BY_COST,
  TECH_LIFEPATH_TABLES,
  ROLE_SPECIFIC_LIFEPATH_TABLES_BY_ROLE
} from '../../data/weaponAttachmentsAndTechData';
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
  Skull,
  ChevronDown,
  ChevronRight,
  Shield,
  Crosshair,
  Cpu,
  RefreshCw,
  Package,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Printer,
  Camera,
  Award,
  X
} from 'lucide-react';

const STAT_KEYS: StatKey[] = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];

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

type SkillFilterCategory = 'all' | 'ranged' | 'melee' | 'defense' | 'medical' | 'general';

const TacticalTooltip: React.FC<{
  term: 'ROF' | 'SP' | 'HL' | 'MAG' | 'HANDS' | 'DV';
  children: React.ReactNode;
  className?: string;
}> = ({ term, children, className = '' }) => {
  const descriptions: Record<string, string> = {
    ROF: 'ROF (Rate of Fire / Cadencia de Fuego): Número de ataques que puedes hacer con esta arma en una sola Acción de Ataque por turno (ej. ROF 2 = 2 ataques por turno).',
    SP: 'SP (Stopping Power): Poder de parada del blindaje. Se resta al daño de cada ataque que te impacte.',
    HL: 'HL (Humanity Loss): Pérdida de Humanidad al instalar este implante de Cyberware.',
    MAG: 'MAG (Cargador): Cantidad de balas que caben en el cargador estándar antes de tener que usar una Acción para recargar.',
    HANDS: 'Manos requeridas para empuñar y atacar con el arma.',
    DV: 'DV (Difficulty Value): Número objetivo que debes igualar o superar con tu tirada (STAT + SKILL + 1d10).'
  };
  const text = descriptions[term] || '';

  return (
    <span
      className={`group/tip relative inline-flex items-center cursor-help underline decoration-dotted underline-offset-2 ${className}`}
      title={text}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex flex-col items-center z-50 w-64 text-left">
        <span className="bg-[#0b0e17] text-[#e2e8f0] text-[10px] font-mono-code font-normal leading-relaxed p-2.5 rounded-xs border border-[#38bdf8]/60 shadow-xl shadow-black/90">
          {text}
        </span>
        <span className="w-1.5 h-1.5 bg-[#0b0e17] border-r border-b border-[#38bdf8]/60 rotate-45 -mt-1" />
      </span>
    </span>
  );
};

const QUICK_AMMO_TYPES = [
  'Basic',
  'Armor-Piercing',
  'Expansive',
  'Incendiary',
  'Smart',
  'Rubber',
  'EMP',
  'Biotoxin',
  'Poison',
  'Sleep'
];

const WeaponClassTooltip: React.FC<{
  weaponInfo: WeaponClassAndRebuildInfo;
  notes?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ weaponInfo, notes, children, className = '' }) => {
  return (
    <span className={`group/wtip relative inline-flex items-center cursor-help ${className}`}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-0 mb-2 hidden group-hover/wtip:flex flex-col z-50 w-72 text-left">
        <span className="bg-[#0b0e17] text-[#e2e8f0] text-[10px] font-mono-code p-2.5 rounded-xs border border-cyan-500/70 shadow-2xl space-y-1">
          <div className="font-tech text-xs font-bold text-cyan-300 uppercase flex items-center justify-between border-b border-[#1f2638] pb-1">
            <span>{weaponInfo.weaponClass}</span>
            {weaponInfo.rebuildBadge && (
              <span className="text-[9px] text-amber-300">{weaponInfo.rebuildBadge}</span>
            )}
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
            {weaponInfo.weaponClassTooltip}
          </p>
          {weaponInfo.rebuildTooltip && (
            <div className="pt-1 border-t border-[#1f2638] text-[9px] text-amber-300/90 leading-tight">
              <strong>Regla Especial:</strong> {weaponInfo.rebuildTooltip}
            </div>
          )}
          {notes && (
            <div className="pt-1 border-t border-[#1f2638] text-[9px] text-slate-400 italic">
              <strong>Notas:</strong> {notes}
            </div>
          )}
        </span>
        <span className="w-1.5 h-1.5 bg-[#0b0e17] border-r border-b border-cyan-500/70 rotate-45 -mt-1 ml-4" />
      </span>
    </span>
  );
};

const AmmoHoverTooltip: React.FC<{
  ammoIdOrName: string;
  children: React.ReactNode;
  className?: string;
}> = ({ ammoIdOrName, children, className = '' }) => {
  const ammoInfo = getAmmoTooltipInfo(ammoIdOrName);
  if (!ammoInfo) return <>{children}</>;

  return (
    <span className={`group/atip relative inline-flex items-center cursor-help ${className}`}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/atip:flex flex-col items-center z-50 w-72 text-left">
        <span className="bg-[#0b0e17] text-[#e2e8f0] text-[10px] font-mono-code p-2.5 rounded-xs border border-amber-500/70 shadow-2xl space-y-1">
          <div className="flex items-center justify-between border-b border-[#252016] pb-1">
            <span className="font-tech text-xs font-bold text-amber-300 uppercase">
              {ammoInfo.name}
            </span>
            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/60 px-1 rounded border border-emerald-500/30">
              {ammoInfo.costEb} eb / {ammoInfo.perUnits}u
            </span>
          </div>
          <div className="text-[10px] text-cyan-300 font-bold">
            ⚡ {ammoInfo.combatEffect}
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
            {ammoInfo.ruleExplanation}
          </p>
          <div className="text-[9px] text-[#64748b] pt-0.5 border-t border-[#1f2638]">
            Fuente: {ammoInfo.source}
          </div>
        </span>
        <span className="w-1.5 h-1.5 bg-[#0b0e17] border-r border-b border-amber-500/70 rotate-45 -mt-1" />
      </span>
    </span>
  );
};

const CyberCategoryTooltip: React.FC<{
  category: string;
  children: React.ReactNode;
  className?: string;
}> = ({ category, children, className = '' }) => {
  const catInfo = getCyberwareCategoryTooltip(category);
  if (!catInfo) return <>{children}</>;

  return (
    <span className={`group/ctip relative inline-flex items-center cursor-help ${className}`}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-0 mb-2 hidden group-hover/ctip:flex flex-col z-50 w-72 text-left">
        <span className="bg-[#0b0e17] text-[#e2e8f0] text-[10px] font-mono-code p-2.5 rounded-xs border border-purple-500/70 shadow-2xl space-y-1">
          <div className="flex items-center justify-between border-b border-[#231b30] pb-1">
            <span className="font-tech text-xs font-bold text-purple-300 uppercase">
              {catInfo.categoryName}
            </span>
            <span className="text-[9px] text-purple-400 font-bold bg-purple-950/60 px-1 rounded border border-purple-500/30">
              {catInfo.installationSite}
            </span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
            {catInfo.description}
          </p>
          <div className="text-[9px] text-amber-300 pt-0.5 border-t border-[#1f2638]">
            <strong>Requisito:</strong> {catInfo.baseRequirement}
          </div>
          <div className="text-[9px] text-cyan-300">
            <strong>Ranuras:</strong> {catInfo.slotsInfo}
          </div>
          <div className="text-[9px] text-rose-300">
            <strong>Pérdida HL:</strong> {catInfo.humanityLossRule}
          </div>
        </span>
        <span className="w-1.5 h-1.5 bg-[#0b0e17] border-r border-b border-purple-500/70 rotate-45 -mt-1 ml-4" />
      </span>
    </span>
  );
};

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
  const repairArmor = useCharacterStore((state) => state.repairArmor);
  const reloadWeapon = useCharacterStore((state) => state.reloadWeapon);
  const unequipWeapon = useCharacterStore((state) => state.unequipWeapon);
  const setWeaponAmmoType = useCharacterStore((state) => state.setWeaponAmmoType);
  const toggleCyberwareInstall = useCharacterStore((state) => state.toggleCyberwareInstall);
  const updateInventoryQuantity = useCharacterStore((state) => state.updateInventoryQuantity);
  const addEurodollarTransaction = useCharacterStore((state) => state.addEurodollarTransaction);
  const exportActiveCharacterJson = useCharacterStore((state) => state.exportActiveCharacterJson);
  const importCharacterJson = useCharacterStore((state) => state.importCharacterJson);
  const exportFullBackup = useCharacterStore((state) => state.exportFullBackup);
  const importFullBackup = useCharacterStore((state) => state.importFullBackup);
  const restorePremades = useCharacterStore((state) => state.restorePremades);
  const updateCharacterLifepath = useCharacterStore((state) => state.updateCharacterLifepath);
  const updateCharacterDebt = useCharacterStore((state) => state.updateCharacterDebt);
  const payOffCharacterDebt = useCharacterStore((state) => state.payOffCharacterDebt);
  const setCharacterPortrait = useCharacterStore((state) => state.setCharacterPortrait);
  const adjustImprovementPoints = useCharacterStore((state) => state.adjustImprovementPoints);
  const trainMartialArtWithIp = useCharacterStore((state) => state.trainMartialArtWithIp);
  const buyAndEquipMartialArtChip = useCharacterStore((state) => state.buyAndEquipMartialArtChip);
  const toggleEquipMartialArtChip = useCharacterStore((state) => state.toggleEquipMartialArtChip);
  const updateMartialArtRank = useCharacterStore((state) => state.updateMartialArtRank);
  const convertWeaponRebuild2077 = useCharacterStore((state) => state.convertWeaponRebuild2077);
  const toggleEmpDisableCyberware = useCharacterStore((state) => state.toggleEmpDisableCyberware);
  const clearAllEmpDisabledCyberware = useCharacterStore((state) => state.clearAllEmpDisabledCyberware);
  const restAndHealDays = useCharacterStore((state) => state.restAndHealDays);
  const repairCharacterArmor = useCharacterStore((state) => state.repairCharacterArmor);
  const installWeaponAttachment = useCharacterStore((state) => state.installWeaponAttachment);
  const removeWeaponAttachment = useCharacterStore((state) => state.removeWeaponAttachment);
  const applyTechUpgradeToWeapon = useCharacterStore((state) => state.applyTechUpgradeToWeapon);
  const applyTechUpgradeToArmor = useCharacterStore((state) => state.applyTechUpgradeToArmor);
  const updateRoleSpecificLifepath = useCharacterStore((state) => state.updateRoleSpecificLifepath);
  const installCyberwareAdvanced = useCharacterStore((state) => state.installCyberwareAdvanced);
  const setHp = useCharacterStore((state) => state.setHp);

  const activeChar = getActiveCharacter();

  // Local state for attachments, maker upgrades & tech lifepath
  const [openAttachmentsPanels, setOpenAttachmentsPanels] = useState<Record<string, boolean>>({});
  const [attachmentFreeMode, setAttachmentFreeMode] = useState(false);
  const [techRollFeedback, setTechRollFeedback] = useState<{ weaponId: string; text: string } | null>(null);
  const [showTechLifepathModal, setShowTechLifepathModal] = useState(false);

  // Local state for modals & filters
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [portraitFilterCategory, setPortraitFilterCategory] = useState<string>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newHandle, setNewHandle] = useState('');
  const [newRole, setNewRole] = useState('Solo');

  const [isImporting, setIsImporting] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Right column tab, wallet & debt state
  const [rightColTab, setRightColTab] = useState<'combat' | 'inventory' | 'wallet' | 'bio' | 'dojo' | 'roleAbility' | 'restingRepair'>('combat');
  const [walletConcept, setWalletConcept] = useState('');
  const [walletAmount, setWalletAmount] = useState<number>(100);
  const [debtPayAmount, setDebtPayAmount] = useState<number>(500);

  // Rebuild 2077 and Resting/Repair state
  const [openRebuildWorkshops, setOpenRebuildWorkshops] = useState<Record<string, boolean>>({});
  const toggleRebuildWorkshop = (instanceId: string) =>
    setOpenRebuildWorkshops((prev) => ({ ...prev, [instanceId]: !prev[instanceId] }));
  const [rebuildFreeMode, setRebuildFreeMode] = useState<boolean>(false);
  const [restDays, setRestDays] = useState<number>(1);
  const [restAntibodies, setRestAntibodies] = useState<boolean>(false);
  const [restCryotank, setRestCryotank] = useState<boolean>(false);
  const [restFeedback, setRestFeedback] = useState<string | null>(null);
  const [repairFeedback, setRepairFeedback] = useState<string | null>(null);

  // Dojo state
  const [showMartialArtsGuide, setShowMartialArtsGuide] = useState(false);
  const [martialArtSearch, setMartialArtSearch] = useState('');
  const [martialArtCategoryFilter, setMartialArtCategoryFilter] = useState<'all' | 'core' | 'interface_red'>('all');
  const [martialFeedback, setMartialFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [openMartialArtForms, setOpenMartialArtForms] = useState<Record<string, boolean>>({});
  const toggleMartialArtForm = (id: string) => setOpenMartialArtForms(prev => ({ ...prev, [id]: !prev[id] }));

  // Skill filter and accordion state
  const [skillFilter, setSkillFilter] = useState<SkillFilterCategory>('all');
  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);

  // Section collapse states for compact screen real estate
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [isVitalsCollapsed, setIsVitalsCollapsed] = useState(false);
  const [isSkillsCollapsed, setIsSkillsCollapsed] = useState(false);

  // CEMK Folio Dossier Accordion State
  const [isFolioDossierOpen, setIsFolioDossierOpen] = useState(false);
  const [folioDossierTab, setFolioDossierTab] = useState<'skills' | 'role_rules' | 'arsenal' | 'backstory'>('skills');
  const [folioSkillSearch, setFolioSkillSearch] = useState('');
  const [folioSkillStatFilter, setFolioSkillStatFilter] = useState('ALL');

  // Derived stats
  const bodyVal = activeChar ? getEffectiveBody(activeChar) : 6;
  const willVal = activeChar?.stats?.WILL ?? 6;
  const empVal = activeChar?.stats?.EMP ?? 6;
  const maxHp = calculateMaxHp(bodyVal, willVal);
  const seriousWoundThresh = calculateSeriouslyWoundedThreshold(maxHp);
  const maxHumanity = calculateMaxHumanity(empVal);

  // Active death save penalty from critical injuries
  let deathSavePenalty = 0;
  activeChar?.activeInjuries?.forEach((inj) => {
    if (!inj.isTreated && inj.modifiers?.bonusDeathSavePenalty) {
      deathSavePenalty += inj.modifiers.bonusDeathSavePenalty;
    }
  });

  // Calculate active penalties per stat
  const getStatPenalty = (stat: StatKey): number => {
    let pen = 0;
    if (stat === 'REF' || stat === 'DEX' || stat === 'MOVE') {
      const headPen = Math.abs(activeChar?.headArmor?.penalty ?? 0);
      const bodyPen = Math.abs(activeChar?.bodyArmor?.penalty ?? 0);
      pen += Math.max(headPen, bodyPen);
    }
    activeChar?.activeInjuries?.forEach((inj) => {
      if (!inj.isTreated && inj.modifiers?.statPenalties?.[stat]) {
        pen += inj.modifiers.statPenalties[stat]!;
      }
    });
    // Core p. 80: la EMP efectiva baja con cada decena de Humanidad perdida.
    if (stat === 'EMP' && activeChar) {
      pen += Math.max(0, (activeChar.stats?.EMP ?? 0) - getEffectiveEmp(activeChar));
    }
    return pen;
  };

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

  const handleDownloadFullBackup = () => {
    const jsonStr = exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cpr-omni-deck-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('¡Respaldo completo descargado!');
  };

  const readFileAsText = (file: File, onText: (text: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => onText(String(reader.result ?? ''));
    reader.onerror = () => alert('Error: no se pudo leer el archivo.');
    reader.readAsText(file);
  };

  const handleRestoreBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    readFileAsText(file, (text) => {
      let count = 0;
      let extrasCount = 0;
      try {
        const data = JSON.parse(text);
        count = Array.isArray(data?.characters?.characters) ? data.characters.characters.length : 0;
        extrasCount = data?.extras ? Object.values(data.extras).filter((v) => typeof v === 'string').length : 0;
      } catch {
        alert('Error: el archivo no es un JSON válido.');
        return;
      }
      if (!confirm(`El respaldo contiene ${count} fichas y ${extrasCount} bloques de datos extra (GM, combate, red). ¿Continuar con la restauración?`)) return;
      const replace = confirm('Aceptar = reemplazar todo, Cancelar = combinar');
      const result = importFullBackup(text, replace ? 'replace' : 'merge');
      if (!result.ok) {
        alert(`Error: ${result.message}`);
        return;
      }
      showStatus(result.message);
      if (result.warnings.length > 0) alert(result.warnings.join('\n'));
    });
  };

  const handleImportCharacterFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    readFileAsText(file, (text) => {
      if (importCharacterJson(text)) {
        showStatus('¡Ficha importada correctamente!');
      } else {
        alert('Error: El formato JSON no es válido o carece de campos obligatorios.');
      }
    });
  };

  const handleRestorePremades = () => {
    if (!confirm('¿Restaurar las fichas premade que borraste? Se vuelven a agregar las que falten.')) return;
    restorePremades();
    showStatus('Premades restaurados.');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle.trim()) return;
    createNewCharacter(newHandle, newRole);
    setNewHandle('');
    setIsCreatingNew(false);
    showStatus(`¡Personaje ${newHandle} creado!`);
  };

  const toggleSkillExpand = (skillKey: string) => {
    setExpandedSkills((prev) => ({ ...prev, [skillKey]: !prev[skillKey] }));
  };

  const toggleAllExpanded = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const updated: Record<string, boolean> = {};
    (Object.keys(SKILL_METADATA) as CombatSkillKey[]).forEach((k) => {
      updated[k] = nextState;
    });
    setExpandedSkills(updated);
  };

  // Filter skills based on tab
  const filteredSkillKeys = (Object.keys(SKILL_METADATA) as CombatSkillKey[]).filter((key) => {
    if (skillFilter === 'all') return true;
    return SKILL_METADATA[key].category === skillFilter;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      {/* Modal / Overlay del Creador de Personajes en 6 Pasos */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto flex items-start justify-center">
          <div className="w-full max-w-6xl my-4">
            <CharacterCreatorWizard
              onClose={() => setIsWizardOpen(false)}
              onComplete={() => {
                setIsWizardOpen(false);
                showStatus('¡Ficha creada y activada en Street Lab!');
              }}
            />
          </div>
        </div>
      )}
      
      {/* =========================================================
          BLOQUE 1: BARRA SUPERIOR COMPACTA DE IDENTIDAD Y FICHAS
      ========================================================= */}
      <div className="chamfer-card p-2.5 bg-[#121319] border border-[#232736] flex flex-wrap items-center justify-between gap-3">
        
        {/* Selector de personaje & Metadata inline */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
            <User className="w-4 h-4 text-[#dc2626]" />
            <span>FICHA:</span>
          </div>

          <select
            value={activeCharacterId}
            onChange={(e) => setActiveCharacter(e.target.value)}
            className="bg-[#171924] border border-[#2c3246] text-white font-tech font-bold text-xs rounded px-2.5 py-1 focus:outline-none focus:border-[#dc2626] cursor-pointer"
          >
            {characters.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#121318]">
                {c.handle} ({c.role} {c.roleRank})
              </option>
            ))}
          </select>

          <div className="hidden sm:block h-5 w-px bg-[#232736]"></div>

          {/* Retrato / Avatar Cyberpunk Activo */}
          {(() => {
            const folioMeta = activeChar?.id ? CEMK_FOLIO_METADATA_MAP[activeChar.id] : null;
            const currentPortrait =
              CHARACTER_PORTRAITS_CATALOG.find((p) => p.id === activeChar?.portraitId) ||
              CHARACTER_PORTRAITS_CATALOG[0];
            const isFbc = Boolean(activeChar?.fbcState?.isFullBodyConversion);

            return (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPortraitModalOpen(true)}
                  className="flex items-center gap-1.5 p-1 bg-[#171924] hover:bg-[#202434] rounded border border-[#2c3246] hover:border-[#38bdf8] transition-all group/avatar"
                  title={folioMeta ? `Folio Oficial CEMK 2077: ${folioMeta.name}` : "Cambiar Retrato Oficial del Personaje"}
                >
                  {folioMeta?.tokenUrl ? (
                    <img
                      src={folioMeta.tokenUrl}
                      alt={folioMeta.name}
                      className="w-7 h-7 rounded-sm object-cover border border-amber-500/70 shadow-sm bg-[#0a0d15]"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-sm flex items-center justify-center font-bold text-xs shadow-sm"
                      style={{ backgroundColor: `${currentPortrait.accentColor}25`, color: currentPortrait.accentColor }}
                    >
                      {currentPortrait.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <div className="text-[10px] font-mono-code font-bold text-white group-hover/avatar:text-[#38bdf8] truncate max-w-[90px]">
                      {folioMeta ? folioMeta.name : currentPortrait.name.split(' ')[0]}
                    </div>
                    <div className="text-[8px] font-mono-code text-[#64748b]">
                      {folioMeta ? 'FOLIO 2077' : 'RETRATO'}
                    </div>
                  </div>
                </button>

                {folioMeta && (
                  <span
                    className="bg-amber-950/60 border border-amber-500/70 text-amber-300 font-mono-code text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1"
                    title={`Folio Canónico CEMK 2077 (${folioMeta.role}): ${folioMeta.archetype2077}`}
                  >
                    📋 FOLIO
                  </span>
                )}

                {isFbc && (
                  <span
                    className="bg-[#0284c7]/20 border border-[#0284c7]/50 text-[#38bdf8] font-mono-code text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 animate-pulse"
                    title={`Full Body Conversion: ${activeChar.fbcState?.activeChassisName || 'Borg'}`}
                  >
                    🤖 FBC
                  </span>
                )}
              </div>
            );
          })()}

          {/* Inputs inline: Handle, Rol, Rango, Eurodólares */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
            <input
              type="text"
              value={activeChar?.handle ?? ''}
              onChange={(e) => updateCharacterMeta({ handle: e.target.value })}
              placeholder="Handle..."
              className="w-28 sm:w-36 bg-[#171924] border border-[#2c3246] text-white font-tech font-bold px-2 py-0.5 rounded focus:outline-none focus:border-[#dc2626]"
              title="Alias / Handle del personaje"
            />

            <select
              value={activeChar?.role ?? 'Solo'}
              onChange={(e) => updateCharacterMeta({ role: e.target.value })}
              className="bg-[#171924] border border-[#2c3246] text-[#38bdf8] font-tech font-bold px-2 py-0.5 rounded focus:outline-none focus:border-[#dc2626]"
              title="Rol del personaje"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <div className="flex items-center gap-1 bg-[#171924] border border-[#2c3246] px-1.5 py-0.5 rounded" title="Rango de Rol (1-10)">
              <span className="text-[10px] text-[#64748b]">Rnk:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={activeChar?.roleRank ?? 4}
                onChange={(e) => updateCharacterMeta({ roleRank: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)) })}
                className="w-8 bg-transparent text-center text-white font-bold focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#171924] border border-[#2c3246] px-2 py-0.5 rounded" title="Eurodólares disponibles">
              <Coins className="w-3 h-3 text-[#10b981]" />
              <input
                type="number"
                min="0"
                value={activeChar?.eurodollars ?? 0}
                onChange={(e) => updateCharacterMeta({ eurodollars: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-16 bg-transparent text-[#10b981] font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción de Ficha */}
        <div className="flex items-center gap-1.5">
          {statusMessage && (
            <span className="text-[11px] font-mono-code text-[#10b981] mr-1 animate-pulse">
              {statusMessage}
            </span>
          )}

          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-2.5 py-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-xs rounded-xs border border-[#dc2626] flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(220,38,38,0.3)] cursor-pointer"
            title="Crear nueva ficha con el Asistente Guiado de 6 Pasos"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ NUEVO (WIZARD)</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="p-1 bg-[#171924] hover:bg-[#222838] text-[#cbd5e1] rounded-xs border border-[#2a3044] transition-all"
            title="Copiar JSON de la ficha"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownloadJson}
            className="p-1 bg-[#171924] hover:bg-[#222838] text-[#cbd5e1] rounded-xs border border-[#2a3044] transition-all"
            title="Descargar archivo JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsImporting(!isImporting)}
            className="p-1 bg-[#171924] hover:bg-[#38bdf8] hover:text-black text-[#38bdf8] rounded-xs border border-[#2a3044] transition-all"
            title="Importar ficha desde JSON"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => window.print()}
            className="p-1 bg-[#171924] hover:bg-[#10b981] hover:text-black text-[#10b981] rounded-xs border border-[#2a3044] transition-all flex items-center gap-1 px-1.5"
            title="Imprimir Ficha / Dossier como PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[10px] font-mono-code font-bold">PDF</span>
          </button>

          {characters.length > 1 && (
            <button
              onClick={() => {
                if (confirm(`¿Eliminar la ficha de ${activeChar.handle}?`)) {
                  deleteCharacter(activeChar.id);
                  showStatus('Personaje eliminado.');
                }
              }}
              className="p-1 bg-[#22181d] hover:bg-[#dc2626] text-[#dc2626] hover:text-white rounded-xs border border-[#3b1c24] transition-colors"
              title="Eliminar este personaje"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Respaldo completo, restauración e importación por archivo */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={handleDownloadFullBackup}
          className="px-2 py-1 bg-[#171924] hover:bg-[#10b981] hover:text-black text-[#10b981] text-[10px] font-mono-code font-bold rounded-xs border border-[#2a3044] transition-all"
          title="Descargar un respaldo con todas las fichas y datos del GM"
        >
          RESPALDO COMPLETO ⬇
        </button>
        <label
          className="px-2 py-1 bg-[#171924] hover:bg-[#38bdf8] hover:text-black text-[#38bdf8] text-[10px] font-mono-code font-bold rounded-xs border border-[#2a3044] transition-all cursor-pointer"
          title="Restaurar un respaldo completo desde archivo"
        >
          RESTAURAR RESPALDO ⬆
          <input type="file" accept=".json" className="hidden" onChange={handleRestoreBackupFile} />
        </label>
        <label
          className="px-2 py-1 bg-[#171924] hover:bg-[#38bdf8] hover:text-black text-[#38bdf8] text-[10px] font-mono-code font-bold rounded-xs border border-[#2a3044] transition-all cursor-pointer"
          title="Importar una ficha desde archivo JSON"
        >
          IMPORTAR FICHA (archivo)
          <input type="file" accept=".json" className="hidden" onChange={handleImportCharacterFile} />
        </label>
        <button
          onClick={handleRestorePremades}
          className="px-2 py-1 bg-[#171924] hover:bg-[#f59e0b] hover:text-black text-[#f59e0b] text-[10px] font-mono-code font-bold rounded-xs border border-[#2a3044] transition-all"
          title="Volver a agregar los premades borrados"
        >
          RESTAURAR PREMADES
        </button>
      </div>

      {/* Formulario Inline: Crear Nuevo Personaje */}
      {isCreatingNew && (
        <form onSubmit={handleCreateSubmit} className="chamfer-card p-3 bg-[#141622] border border-[#dc2626]/40 flex flex-wrap items-center gap-3">
          <div className="font-tech text-xs font-bold text-white uppercase">NUEVO EDGERUNNER:</div>
          <input
            type="text"
            placeholder="Nombre callejero (Handle)..."
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
            className="bg-[#0e1017] border border-[#282f42] text-white text-xs px-2.5 py-1 rounded focus:outline-none focus:border-[#dc2626] font-tech font-bold"
            required
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="bg-[#0e1017] border border-[#282f42] text-white text-xs px-2.5 py-1 rounded font-tech font-bold"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-3 py-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-tech font-bold text-xs tracking-wider rounded-xs chamfer-btn"
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

      {/* Panel Inline: Importar JSON */}
      {isImporting && (
        <div className="chamfer-card p-3 bg-[#141622] border border-[#38bdf8]/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-tech font-bold text-[#38bdf8] uppercase">
            <span>PEGAR TEXTO O ARCHIVO JSON:</span>
            <button onClick={() => setIsImporting(false)} className="text-[#64748b] hover:text-white">Cerrar</button>
          </div>
          <textarea
            rows={3}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="Pega aquí el JSON de la CharacterSheet..."
            className="w-full bg-[#0d0e14] border border-[#242b3c] text-[#cbd5e1] font-mono-code text-xs p-2 rounded focus:outline-none focus:border-[#38bdf8]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleImportSubmit}
              className="px-3 py-1 bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-tech font-bold text-xs rounded-xs"
            >
              IMPORTAR FICHA
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          BLOQUE 1.5: DOSSIER OFICIAL CEMK FOLIO (4 PÁGINAS)
      ========================================================= */}
      {activeChar?.id && CEMK_FOLIO_METADATA_MAP[activeChar.id] && (() => {
        const meta = CEMK_FOLIO_METADATA_MAP[activeChar.id];
        const skillsList = meta.fullSkillsTable;
        const filteredSkills = skillsList.filter((sk) => {
          const matchesSearch = sk.name.toLowerCase().includes(folioSkillSearch.toLowerCase());
          const matchesStat = folioSkillStatFilter === 'ALL' || sk.stat.toUpperCase() === folioSkillStatFilter.toUpperCase();
          return matchesSearch && matchesStat;
        });

        return (
          <div className="chamfer-card p-3 bg-[#0d101a] border border-amber-500/70 space-y-3 shadow-xl animate-fade-in font-mono-code">
            {/* Banner Header Táctico */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#232c42]">
              <div className="flex items-center gap-2.5">
                {meta.tokenUrl && (
                  <img
                    src={meta.tokenUrl}
                    alt={meta.name}
                    className="w-10 h-10 rounded object-cover border border-amber-500/80 shadow bg-[#090b12]"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                      📋 DOSSIER OFICIAL CEMK FOLIO (4 PÁGINAS: 66 SKILLS CANÓNICAS, REGLAS DE ROL & ARSENAL 2077)
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-950/80 border border-amber-500/80 text-amber-300 font-bold rounded">
                      OFICIAL 2077
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">
                    <strong className="text-white">{meta.name}</strong> • {meta.role} (Rango {activeChar.roleRank}) — <span className="text-cyan-400">{meta.archetype2077}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFolioDossierOpen(!isFolioDossierOpen)}
                className="px-2.5 py-1 bg-[#161d2e] hover:bg-[#202b44] text-amber-300 border border-amber-600/70 rounded-xs font-tech text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow"
              >
                {isFolioDossierOpen ? (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>[ ▴ Ocultar Dossier ]</span>
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>[ ▾ Desplegar Dossier Completo ]</span>
                  </>
                )}
              </button>
            </div>

            {/* Contenido Acordeón Desplegable */}
            {isFolioDossierOpen && (
              <div className="space-y-3.5 pt-1 animate-fade-in text-xs">
                {/* 4 Pestañas del Dossier */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-[#090b12] rounded border border-[#1a2234]">
                  <button
                    onClick={() => setFolioDossierTab('skills')}
                    className={`py-1.5 px-2 rounded text-xs font-tech font-bold transition-all cursor-pointer text-center ${
                      folioDossierTab === 'skills'
                        ? 'bg-amber-950/80 border border-amber-500 text-amber-200 shadow'
                        : 'text-slate-400 hover:text-white hover:bg-[#141926]'
                    }`}
                  >
                    1. 📊 66 SKILLS CANÓNICAS
                  </button>
                  <button
                    onClick={() => setFolioDossierTab('role_rules')}
                    className={`py-1.5 px-2 rounded text-xs font-tech font-bold transition-all cursor-pointer text-center ${
                      folioDossierTab === 'role_rules'
                        ? 'bg-amber-950/80 border border-amber-500 text-amber-200 shadow'
                        : 'text-slate-400 hover:text-white hover:bg-[#141926]'
                    }`}
                  >
                    2. ⚡ REGLAS DE ROL 2077
                  </button>
                  <button
                    onClick={() => setFolioDossierTab('arsenal')}
                    className={`py-1.5 px-2 rounded text-xs font-tech font-bold transition-all cursor-pointer text-center ${
                      folioDossierTab === 'arsenal'
                        ? 'bg-amber-950/80 border border-amber-500 text-amber-200 shadow'
                        : 'text-slate-400 hover:text-white hover:bg-[#141926]'
                    }`}
                  >
                    3. ⚔️ ARSENAL & CROMO
                  </button>
                  <button
                    onClick={() => setFolioDossierTab('backstory')}
                    className={`py-1.5 px-2 rounded text-xs font-tech font-bold transition-all cursor-pointer text-center ${
                      folioDossierTab === 'backstory'
                        ? 'bg-amber-950/80 border border-amber-500 text-amber-200 shadow'
                        : 'text-slate-400 hover:text-white hover:bg-[#141926]'
                    }`}
                  >
                    4. 📖 BIOGRAFÍA & TRASFONDO
                  </button>
                </div>

                {/* PESTAÑA 1: 66 SKILLS CANÓNICAS (LVL + STAT = BASE) */}
                {folioDossierTab === 'skills' && (
                  <div className="bg-[#090b12] border border-[#1a2234] p-3 rounded space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#182033] pb-2">
                      <div>
                        <span className="font-tech text-xs font-bold text-amber-400 uppercase tracking-wide block">
                          MATRIZ OFICIAL DE 66 HABILIDADES (CEMK PÁGS. 1-2)
                        </span>
                        <span className="text-[10px] text-[#64748b]">
                          Cálculo exacto: LVL Entrenado + Valor STAT = BASE Canónica
                        </span>
                      </div>
                      <input
                        type="text"
                        value={folioSkillSearch}
                        onChange={(e) => setFolioSkillSearch(e.target.value)}
                        placeholder="Buscar habilidad..."
                        className="bg-[#121624] border border-[#232f48] text-white text-[10px] px-2 py-1 rounded w-40 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Filtros de STAT */}
                    <div className="flex flex-wrap items-center gap-1 text-[9px]">
                      {['ALL', 'INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'EMP', 'BODY'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setFolioSkillStatFilter(st)}
                          className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                            folioSkillStatFilter === st
                              ? 'bg-amber-600 text-white font-bold'
                              : 'bg-[#121624] text-slate-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Tabla de Skills */}
                    <div className="max-h-60 overflow-y-auto border border-[#182033] rounded">
                      <table className="w-full text-left text-[10px]">
                        <thead className="bg-[#121624] text-[#94a3b8] uppercase sticky top-0 border-b border-[#1f293d]">
                          <tr>
                            <th className="p-1.5">Habilidad</th>
                            <th className="p-1.5 text-center">Stat</th>
                            <th className="p-1.5 text-center">Nivel (LVL)</th>
                            <th className="p-1.5 text-center">Valor Stat</th>
                            <th className="p-1.5 text-center font-bold text-amber-300">Base Canónica</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#141a29]">
                          {filteredSkills.map((sk, idx) => {
                            const statVal = sk.stat === 'EMP'
                              ? getEffectiveEmp(activeChar)
                              : activeChar.stats[sk.stat as keyof typeof activeChar.stats] ?? (sk.base - sk.lvl);
                            const isTrained = sk.lvl > 0;
                            return (
                              <tr
                                key={idx}
                                className={`transition-colors ${
                                  isTrained
                                    ? 'bg-amber-950/20 hover:bg-amber-950/40 text-amber-100 font-medium'
                                    : 'hover:bg-[#101420] text-slate-400'
                                }`}
                              >
                                <td className="p-1.5 font-medium flex items-center gap-1">
                                  {isTrained && <span className="text-amber-400">✦</span>}
                                  <span>{sk.name}</span>
                                </td>
                                <td className="p-1.5 text-center text-[#94a3b8] font-mono">{sk.stat}</td>
                                <td className="p-1.5 text-center font-bold">
                                  {isTrained ? (
                                    <span className="text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/60">
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
                )}

                {/* PESTAÑA 2: REGLAS DE ROL CEMK 2077 */}
                {folioDossierTab === 'role_rules' && (
                  <div className="bg-[#090b12] border border-[#1a2234] p-3 rounded space-y-2">
                    <span className="font-tech text-xs font-bold text-cyan-400 uppercase tracking-wide block">
                      HABILIDAD DE ROL: {activeChar.roleAbilityName} (RANGO {activeChar.roleRank})
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed bg-[#121624] p-2.5 rounded border border-[#1e273a]">
                      {meta.roleAbilitySummary}
                    </p>
                    <div className="pt-1">
                      <span className="font-tech text-[10px] text-amber-400 uppercase block mb-1">
                        NOTAS TÁCTICAS DEL ARQUETIPO:
                      </span>
                      <p className="text-[#94a3b8] text-[10px] leading-relaxed">
                        {activeChar.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* PESTAÑA 3: ARSENAL & CROMO 2077 */}
                {folioDossierTab === 'arsenal' && (
                  <div className="bg-[#090b12] border border-[#1a2234] p-3 rounded space-y-2">
                    <span className="font-tech text-xs font-bold text-cyan-400 uppercase tracking-wide block">
                      ARSENAL, CIBERWARE Y REGLAS 2077 (CEMK PÁGS. 3-4)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {meta.equipmentSummary.map((item, idx) => (
                        <div key={idx} className="bg-[#121624] p-2 rounded border border-[#1e273a] flex items-start gap-1.5">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span className="text-slate-200 text-[10px]">{item}</span>
                        </div>
                      ))}
                    </div>
                    {meta.combatStyle && (
                      <p className="text-[10px] text-[#94a3b8] pt-1">
                        <strong className="text-cyan-400">Estilo Táctico:</strong> {meta.combatStyle}
                      </p>
                    )}
                  </div>
                )}

                {/* PESTAÑA 4: BIOGRAFÍA & TRASFONDO */}
                {folioDossierTab === 'backstory' && (
                  <div className="bg-[#090b12] border border-[#1a2234] p-3 rounded space-y-2">
                    <span className="font-tech text-xs font-bold text-amber-400 uppercase tracking-wide block">
                      BIOGRAFÍA CANÓNICA (CEMK FOLIOS PÁGS. 1-2)
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed bg-[#121624] p-3 rounded border border-[#1e273a]">
                      {meta.backstory}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* =========================================================
          BLOQUE 2: CINTA TÁCTICA HORIZONTAL DE LOS 10 STATS + DERIVADAS
      ========================================================= */}
      <div className="relative z-30 overflow-visible p-3 bg-[#121319] border border-[#232736] rounded space-y-2.5">
        
        {/* Cabecera / Toggle de los 10 STATS */}
        <div className="flex items-center justify-between pb-1 border-b border-[#1f2230]">
          <div 
            onClick={() => setIsStatsCollapsed(prev => !prev)}
            className="flex items-center gap-1.5 cursor-pointer select-none text-white hover:text-[#38bdf8] transition-colors"
          >
            {isStatsCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-[#38bdf8]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#38bdf8]" />
            )}
            <span className="font-tech text-xs font-bold uppercase tracking-wider">
              ESTADÍSTICAS BÁSICAS (10 STATS)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsStatsCollapsed(prev => !prev)}
            className="text-[10px] font-mono-code text-[#94a3b8] hover:text-[#38bdf8] transition-colors cursor-pointer select-none"
            title={isStatsCollapsed ? 'Desplegar panel de estadísticas' : 'Plegar panel de estadísticas'}
          >
            {isStatsCollapsed ? '[ ▸ Expandir STATS ]' : '[ ▾ Colapsar STATS ]'}
          </button>
        </div>

        {/* Tira de 10 STATS */}
        {!isStatsCollapsed && (
          <div className="grid grid-cols-5 lg:grid-cols-10 gap-1.5 animate-fade-in relative z-30 overflow-visible">
            {STAT_KEYS.map((stat, idx) => {
              // Con Full Body Conversion el chasis reemplaza BODY y fija un mínimo a REF/DEX/MOVE sin pisar los stats base.
              const isFbcActive = Boolean(activeChar?.fbcState?.isFullBodyConversion);
              const val = stat === 'BODY' && activeChar
                ? getEffectiveBody(activeChar)
                : isFbcActive && (stat === 'REF' || stat === 'DEX' || stat === 'MOVE')
                  ? Math.max(activeChar?.stats?.[stat] ?? 6, activeChar?.fbcState?.statFloor ?? 0)
                  : activeChar?.stats?.[stat] ?? 6;
              const penalty = getStatPenalty(stat);
              const isRightSide = idx >= 5;

              return (
                <div
                  key={stat}
                  className="group/stat relative bg-[#151722] p-1.5 rounded border border-[#222636] text-center flex flex-col justify-between hover:border-[#38bdf8]/60 hover:z-[100] transition-all cursor-help"
                >
                  {/* Tooltip táctico para principiantes hacia abajo interactivo */}
                  {STAT_TOOLTIPS[stat] && (
                    <div
                      className={`absolute top-full ${
                        isRightSide ? 'right-0' : 'left-0'
                      } pt-2 hidden group-hover/stat:block z-[110] w-64 text-left`}
                    >
                      <div className="bg-[#0b0e17] text-[#e2e8f0] text-[10px] font-mono-code font-normal leading-relaxed p-2.5 rounded-xs border border-[#38bdf8]/60 shadow-xl shadow-black/90 relative">
                        {/* Triángulo indicador arriba */}
                        <div
                          className={`w-2 h-2 bg-[#0b0e17] border-l border-t border-[#38bdf8]/60 rotate-45 absolute -top-1.5 ${
                            isRightSide ? 'right-6' : 'left-6'
                          }`}
                        />
                        <div className="font-tech font-bold text-[#38bdf8] uppercase text-xs mb-0.5">
                          {stat} — {STAT_TOOLTIPS[stat].name}
                        </div>
                        <div className="text-[#cbd5e1] mb-1 font-sans">
                          {STAT_TOOLTIPS[stat].shortSummary}
                        </div>
                        <div className="text-[#94a3b8] text-[9px] mb-1 leading-tight">
                          {STAT_TOOLTIPS[stat].beginnerExplanation}
                        </div>
                        {STAT_TOOLTIPS[stat].mechanicalBreakpoints && STAT_TOOLTIPS[stat].mechanicalBreakpoints.length > 0 && (
                          <div className="text-[9px] text-[#f59e0b] border-t border-[#1e293b] pt-1">
                            {STAT_TOOLTIPS[stat].mechanicalBreakpoints[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] font-tech text-[#94a3b8] px-0.5">
                    <span className="font-bold text-white">{stat}</span>
                    {penalty > 0 && (
                      <span className="text-[#dc2626] font-mono-code text-[10px] font-bold">
                        -{penalty}
                      </span>
                    )}
                  </div>

                  <div className="font-tech text-2xl font-bold text-[#dc2626] leading-none my-1">
                    {val}
                  </div>

                  <div className="flex items-center justify-center gap-1 pt-1 border-t border-[#1e2230]">
                    <button
                      onClick={() => updateStat(stat, val - 1)}
                      className="w-4 h-4 bg-[#202434] hover:bg-[#dc2626] text-white rounded flex items-center justify-center text-[10px]"
                      title={`Reducir ${stat}`}
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={() => updateStat(stat, val + 1)}
                      className="w-4 h-4 bg-[#202434] hover:bg-[#10b981] text-white rounded flex items-center justify-center text-[10px]"
                      title={`Aumentar ${stat}`}
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Barra Fina de Estadísticas Derivadas */}
        <div className="space-y-1.5 pt-1 border-t border-[#1e2230]">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => setIsVitalsCollapsed(prev => !prev)}
              className="flex items-center gap-1.5 cursor-pointer select-none text-[#94a3b8] hover:text-white transition-colors"
            >
              {isVitalsCollapsed ? (
                <ChevronRight className="w-3 h-3 text-[#f59e0b]" />
              ) : (
                <ChevronDown className="w-3 h-3 text-[#f59e0b]" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider font-tech">
                SIGNOS VITALES Y DERIVADAS
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsVitalsCollapsed(prev => !prev)}
              className="text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer select-none"
              title={isVitalsCollapsed ? 'Desplegar signos vitales' : 'Plegar signos vitales'}
            >
              {isVitalsCollapsed ? '[ ▸ Expandir VITALES ]' : '[ ▾ Colapsar VITALES ]'}
            </button>
          </div>

          {!isVitalsCollapsed && (
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#171923] p-2 rounded border border-[#222636] text-xs font-mono-code animate-fade-in">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#dc2626]" />
                <span className="text-[#64748b]">MAX HP:</span>
                <span className="text-white font-bold">{maxHp}</span>
                <span className="text-[10px] text-[#64748b] hidden sm:inline">(10+5×⌈{bodyVal}+{willVal}⌉/2)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="text-[#64748b]">GRAVE (-2):</span>
                <span className="text-[#f59e0b] font-bold">&lt; {seriousWoundThresh} HP</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-[#dc2626]" />
                <span className="text-[#64748b]">DEATH SAVE:</span>
                <span className="text-white font-bold">BASE {bodyVal}</span>
                {deathSavePenalty > 0 && <span className="text-[#dc2626] font-bold">+{deathSavePenalty} Pen</span>}
              </div>

              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
                <span className="text-[#64748b]">HUMANIDAD:</span>
                <span className="text-[#c084fc] font-bold">{activeChar?.currentHumanity ?? maxHumanity}/{maxHumanity}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* =========================================================
          BLOQUE 3: DASHBOARD EN 2 COLUMNAS PARALELAS
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* COLUMNA IZQUIERDA (7 COLS): MATRIZ DE HABILIDADES COMPACTA */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="chamfer-card p-3.5 bg-[#121319] border border-[#232736]">
            
            {/* Header y Filtros */}
            <div className={`flex flex-wrap items-center justify-between gap-2 ${isSkillsCollapsed ? '' : 'pb-2.5 mb-2.5 border-b border-[#1f2230]'}`}>
              <div 
                onClick={() => setIsSkillsCollapsed(prev => !prev)}
                className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase cursor-pointer select-none hover:text-[#38bdf8] transition-colors"
              >
                {isSkillsCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-[#38bdf8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#38bdf8]" />
                )}
                <Crosshair className="w-4 h-4 text-[#38bdf8]" />
                <span>HABILIDADES ({filteredSkillKeys.length})</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSkillsCollapsed(prev => !prev)}
                  className="text-[10px] font-mono-code text-[#94a3b8] hover:text-[#38bdf8] transition-colors cursor-pointer select-none"
                  title={isSkillsCollapsed ? 'Desplegar panel de habilidades' : 'Plegar panel de habilidades'}
                >
                  {isSkillsCollapsed ? '[ ▸ Expandir Panel ]' : '[ ▾ Plegar Panel ]'}
                </button>

                {!isSkillsCollapsed && (
                  /* Botón expandir/colapsar todas */
                  <button
                    type="button"
                    onClick={toggleAllExpanded}
                    className="text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer select-none"
                  >
                    {allExpanded ? '▼ Colapsar Todas' : '▶ Expandir Todas'}
                  </button>
                )}
              </div>
            </div>

            {!isSkillsCollapsed && (
              <>

            {/* Sub-pestañas de filtro de categoría */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[
                { id: 'all', label: 'TODAS (16)' },
                { id: 'ranged', label: 'DISTANCIA (5)' },
                { id: 'melee', label: 'MELEE (3)' },
                { id: 'defense', label: 'DEFENSA (2)' },
                { id: 'medical', label: 'MÉDICO/TECH (3)' },
                { id: 'general', label: 'MENTE (3)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSkillFilter(tab.id as SkillFilterCategory)}
                  className={`px-2 py-0.5 rounded-2xs font-tech text-xs tracking-wider transition-all ${
                    skillFilter === tab.id
                      ? 'bg-[#dc2626] text-white font-bold'
                      : 'bg-[#181a26] text-[#94a3b8] hover:text-white border border-[#24293c]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Lista compacta de habilidades con dropdowns */}
            <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredSkillKeys.map((key) => {
                const meta = SKILL_METADATA[key];
                const lvl = activeChar?.skills?.[key] ?? 0;
                const statVal = activeChar?.stats?.[meta.stat] ?? 0;
                const baseTotal = lvl + statVal;
                const isExpanded = !!expandedSkills[key];

                return (
                  <div key={key} className="rounded-xs overflow-hidden">
                    {/* Fila compacta de 1 sola línea */}
                    <div
                      onClick={() => toggleSkillExpand(key)}
                      className={`flex items-center justify-between py-1.5 px-2.5 border transition-all cursor-pointer select-none ${
                        isExpanded
                          ? 'bg-[#181b28] border-[#38bdf8]/40'
                          : 'bg-[#151722] hover:bg-[#1a1d2c] border-[#222638]'
                      }`}
                    >
                      {/* Left: Chevron + Nombre + Stat + x2 */}
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                        )}

                        <span className="font-tech text-sm font-bold text-white tracking-wide">
                          {meta.label}
                        </span>

                        <span className="text-[10px] font-mono-code bg-[#202538] text-[#94a3b8] px-1 py-0.2 rounded">
                          {meta.stat} ({statVal})
                        </span>

                        {meta.isDoubleCost && (
                          <span className="text-[9px] font-mono-code bg-[#dc2626]/20 text-[#dc2626] px-1 rounded font-bold">
                            x2
                          </span>
                        )}
                      </div>

                      {/* Right: Stepper [- Nivel +] y BASE TOTAL */}
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 bg-[#10121a] px-1 py-0.5 rounded border border-[#202538]">
                          <button
                            onClick={() => updateSkill(key, Math.max(0, lvl - 1))}
                            className="w-4 h-4 bg-[#1f2434] hover:bg-[#dc2626] text-white rounded flex items-center justify-center text-[10px]"
                            title={`Reducir ${meta.label}`}
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-5 text-center font-mono-code text-xs font-bold text-white">
                            {lvl}
                          </span>
                          <button
                            onClick={() => updateSkill(key, lvl + 1)}
                            className="w-4 h-4 bg-[#1f2434] hover:bg-[#10b981] text-white rounded flex items-center justify-center text-[10px]"
                            title={`Aumentar ${meta.label}`}
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <span className="font-mono-code text-xs font-bold bg-[#142320] text-[#10b981] border border-[#1b3f36] px-2 py-0.5 rounded">
                          BASE {baseTotal}
                        </span>
                      </div>
                    </div>

                    {/* Dropdown de Ejemplos y Resumen */}
                    {isExpanded && (
                      <div className="p-2.5 bg-[#101218] border-x border-b border-[#222638] rounded-b-xs space-y-1.5 text-xs font-mono-code animate-fade-in">
                        <p className="text-[11px] text-[#94a3b8] font-sans leading-relaxed">
                          {meta.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {meta.examples.map((ex, idx) => (
                            <span
                              key={idx}
                              className="bg-[#171a26] border border-[#283248] px-2 py-0.5 rounded text-[10px] flex items-center gap-1.5"
                            >
                              <span className="text-[#94a3b8]">{ex.label}:</span>
                              <strong className="text-[#38bdf8] font-bold">{ex.dv}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
              </>
            )}

          </div>

        </div>

        {/* COLUMNA DERECHA (5 COLS): ARSENAL, MOCHILA Y BILLETERA */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Selector de Pestañas de Columna Derecha */}
          <div className="flex gap-1 bg-[#121319] p-1 rounded-sm border border-[#232736]">
            <button
              onClick={() => setRightColTab('combat')}
              className={`flex-1 py-1 px-1.5 rounded-2xs font-tech text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                rightColTab === 'combat'
                  ? 'bg-[#dc2626] text-white font-bold'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1d2c]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ARSENAL</span>
            </button>

            <button
              onClick={() => setRightColTab('inventory')}
              className={`flex-1 py-1 px-1.5 rounded-2xs font-tech text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                rightColTab === 'inventory'
                  ? 'bg-[#dc2626] text-white font-bold'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1d2c]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>MOCHILA ({(activeChar?.inventory ?? []).length})</span>
            </button>

            <button
              onClick={() => setRightColTab('wallet')}
              className={`flex-1 py-1 px-1.5 rounded-2xs font-tech text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                rightColTab === 'wallet'
                  ? 'bg-[#dc2626] text-white font-bold'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1d2c]'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>BILLETERA (€$)</span>
            </button>

            <button
              onClick={() => setRightColTab('bio')}
              className={`flex-1 py-1 px-1.5 rounded-2xs font-tech text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                rightColTab === 'bio'
                  ? 'bg-[#dc2626] text-white font-bold'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1d2c]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>BIO &amp; DEUDA</span>
            </button>

            <button
              onClick={() => setRightColTab('dojo')}
              className={`flex-1 py-1 px-1.5 rounded-2xs font-tech text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                rightColTab === 'dojo'
                  ? 'bg-[#10b981] text-black font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1d2c]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
              <span>🥋 DOJO</span>
            </button>

            <button
              onClick={() => setRightColTab('roleAbility')}
              className={`flex-1 py-1 px-1.5 rounded-2xs font-tech text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                rightColTab === 'roleAbility'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1d2c]'
              }`}
            >
              <span>🎭 ROL ({activeChar?.roleRank ?? 4})</span>
            </button>

            <button
              onClick={() => setRightColTab('restingRepair')}
              className={`flex-1 py-1 px-1.5 rounded-2xs font-tech text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                rightColTab === 'restingRepair'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a1d2c]'
              }`}
            >
              <span>🛏️ DESCANSO</span>
            </button>
          </div>

          {/* TAB 1: ARSENAL & BLINDAJE */}
          {rightColTab === 'combat' && (
            <div className="space-y-3">
              {/* 1. Blindaje Activo */}
              <div className="chamfer-card p-3 bg-[#121319] border border-[#232736]">
                <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase pb-1.5 mb-2 border-b border-[#1f2230]">
                  <Shield className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>BLINDAJE EQUIPADO</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
                  {/* Head */}
                  <div className="bg-[#171923] p-2 rounded border border-[#222636]">
                    <div className="text-[10px] text-[#64748b] uppercase">CABEZA</div>
                    <div className="font-tech text-sm font-bold text-white truncate">
                      {activeChar?.headArmor?.name || 'Head Armor'}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-[#38bdf8] font-bold">
                        {activeChar?.headArmor?.currentSp}/{activeChar?.headArmor?.maxSp} <TacticalTooltip term="SP">SP</TacticalTooltip>
                      </span>
                      <button
                        onClick={() => repairArmor('head')}
                        className="text-[10px] text-[#f59e0b] hover:underline"
                      >
                        Reparar
                      </button>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-[#1e2333] flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Mejora Tech:</span>
                      <button
                        type="button"
                        onClick={() => applyTechUpgradeToArmor('head', !activeChar?.headArmor?.techUpgradedSp, 0)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                          activeChar?.headArmor?.techUpgradedSp
                            ? 'bg-amber-500 text-black border-amber-400'
                            : 'bg-[#121622] text-amber-300 border-amber-500/40 hover:bg-[#1a2030]'
                        }`}
                        title="Mejora Tech: +1 SP Máximo (Upgrade Expertise)"
                      >
                        {activeChar?.headArmor?.techUpgradedSp ? '🛠️ +1 SP ACTIVO' : '🛠️ +1 SP Tech'}
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-[#171923] p-2 rounded border border-[#222636]">
                    <div className="text-[10px] text-[#64748b] uppercase">TORSO</div>
                    <div className="font-tech text-sm font-bold text-white truncate">
                      {activeChar?.bodyArmor?.name || 'Body Armor'}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-[#38bdf8] font-bold">
                        {activeChar?.bodyArmor?.currentSp}/{activeChar?.bodyArmor?.maxSp} <TacticalTooltip term="SP">SP</TacticalTooltip>
                      </span>
                      <button
                        onClick={() => repairArmor('body')}
                        className="text-[10px] text-[#f59e0b] hover:underline"
                      >
                        Reparar
                      </button>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-[#1e2333] flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Mejora Tech:</span>
                      <button
                        type="button"
                        onClick={() => applyTechUpgradeToArmor('body', !activeChar?.bodyArmor?.techUpgradedSp, 0)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                          activeChar?.bodyArmor?.techUpgradedSp
                            ? 'bg-amber-500 text-black border-amber-400'
                            : 'bg-[#121622] text-amber-300 border-amber-500/40 hover:bg-[#1a2030]'
                        }`}
                        title="Mejora Tech: +1 SP Máximo (Upgrade Expertise)"
                      >
                        {activeChar?.bodyArmor?.techUpgradedSp ? '🛠️ +1 SP ACTIVO' : '🛠️ +1 SP Tech'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Armas Equipadas */}
              <div className="chamfer-card p-3 bg-[#121319] border border-[#232736]">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#1f2230]">
                  <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                    <Crosshair className="w-3.5 h-3.5 text-[#dc2626]" />
                    <span>ARSENAL ({activeChar?.equippedWeapons?.length ?? 0})</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {(activeChar?.equippedWeapons?.length ?? 0) === 0 ? (
                    <div className="text-center py-4 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded">
                      Sin armas equipadas. Equipa desde el Compendio.
                    </div>
                  ) : (
                    activeChar.equippedWeapons.map((w) => {
                      const breakdown = calculateWeaponAttackBreakdown(activeChar, w);
                      const slotInfo = calculateWeaponSlotCapacity(w);
                      const isRanged = w.type === 'Ranged';
                      const weaponInfo = getWeaponClassAndRebuildInfo(w);
                      const currentAmmo = w.ammoType || 'Basic';

                      return (
                        <div
                          key={w.instanceId}
                          className="p-2.5 bg-[#171923] hover:bg-[#1a1d2a] border border-[#222636] rounded-xs space-y-2 transition-colors"
                        >
                          {/* Fila Principal: Nombre, Daño, Base, Acciones */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-tech text-sm font-bold text-white truncate">
                                  {w.name}
                                </span>
                                <span className="text-[10px] font-mono-code bg-[#1f2434] text-[#38bdf8] px-1 rounded">
                                  {w.damage}
                                </span>
                                <WeaponClassTooltip weaponInfo={weaponInfo} notes={w.notes}>
                                  <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-bold hover:border-cyan-400">
                                    {weaponInfo.weaponClass}
                                  </span>
                                </WeaponClassTooltip>
                                {weaponInfo.rebuildBadge && (
                                  <WeaponClassTooltip weaponInfo={weaponInfo} notes={w.notes}>
                                    <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold hover:border-amber-400">
                                      {weaponInfo.rebuildBadge}
                                    </span>
                                  </WeaponClassTooltip>
                                )}
                              </div>
                              <div className="text-[10px] font-mono-code text-[#64748b] flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <TacticalTooltip term="ROF"><span>ROF {w.rof}</span></TacticalTooltip>
                                <span>•</span>
                                <span className="text-slate-300">{weaponInfo.skillDisplayName || breakdown.skillLabel}</span>
                                {isRanged && (
                                  <>
                                    <span>•</span>
                                    <TacticalTooltip term="MAG"><span className="text-white font-bold">{w.currentMag}/{w.standardMag}</span></TacticalTooltip>
                                  </>
                                )}
                              </div>

                              {/* Ranuras de Accesorios y Badges de Attachments */}
                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-[#161a26] text-slate-300 border border-[#2b334a]">
                                  🔩 RANURAS: <span className={slotInfo.remainingSlots === 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{slotInfo.usedSlots}/{slotInfo.maxSlots} SLOTS</span>
                                  {w.techUpgrade === 'extra_slot' && <span className="text-cyan-400 ml-1">(+1 Tech)</span>}
                                  {slotInfo.isExotic && w.techUpgrade !== 'extra_slot' && <span className="text-amber-400 ml-1">(Exótica: 0 slots)</span>}
                                </span>
                                {w.techUpgrade && w.techUpgrade !== 'none' && (
                                  <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1">
                                    🛠️ {TECH_MAKER_UPGRADE_OPTIONS.find((o) => o.id === w.techUpgrade)?.label || w.techUpgrade}
                                    <button
                                      type="button"
                                      onClick={() => applyTechUpgradeToWeapon(w.instanceId, 'none', 0)}
                                      className="text-red-400 hover:text-red-300 ml-0.5 cursor-pointer"
                                      title="Quitar mejora Tech"
                                    >
                                      ✕
                                    </button>
                                  </span>
                                )}
                                {w.installedAttachments && w.installedAttachments.length > 0 && w.installedAttachments.map((attId) => {
                                  const att = WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === attId);
                                  if (!att) return null;
                                  return (
                                    <span
                                      key={attId}
                                      className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-[#1b2234] text-cyan-300 border border-cyan-500/30 flex items-center gap-1 group"
                                      title={`${att.name} (${att.slots} slot${att.slots > 1 ? 's' : ''}): ${att.summary}`}
                                    >
                                      <span>🔩 {att.name}</span>
                                      <button
                                        type="button"
                                        onClick={() => removeWeaponAttachment(w.instanceId, attId)}
                                        className="text-red-400 hover:text-red-300 ml-0.5 cursor-pointer"
                                        title={`Desinstalar ${att.name}`}
                                      >
                                        ✕
                                      </button>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="font-mono-code text-xs font-bold bg-[#142320] text-[#10b981] border border-[#1b3f36] px-1.5 py-0.5 rounded">
                                Base {breakdown.netBase}
                              </span>

                              {isRanged && (
                                <button
                                  type="button"
                                  onClick={() => reloadWeapon(w.instanceId)}
                                  className="p-1 bg-[#202534] hover:bg-[#f59e0b] hover:text-black text-[#f59e0b] rounded transition-colors"
                                  title="Recargar cargador"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => unequipWeapon(w.instanceId)}
                                className="p-1 bg-[#22181d] hover:bg-[#dc2626] text-[#dc2626] hover:text-white rounded transition-colors"
                                title="Desequipar arma"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Notas del arma si existen */}
                          {w.notes && (
                            <div className="text-[10px] text-slate-400 italic bg-[#0f111a] px-2 py-1 rounded border border-[#1b2030]">
                              {w.notes}
                            </div>
                          )}

                          {/* Barra de Munición Táctica (solo para armas a distancia) */}
                          {isRanged && (
                            <div className="pt-1.5 border-t border-[#1e2333] flex flex-wrap items-center justify-between gap-1.5">
                              <div className="flex items-center gap-1">
                                <span className="text-[9px] font-mono-code text-slate-400 uppercase font-bold">
                                  Munición:
                                </span>
                                <AmmoHoverTooltip ammoIdOrName={currentAmmo}>
                                  <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                                    {currentAmmo}
                                  </span>
                                </AmmoHoverTooltip>
                              </div>
                              <div className="flex items-center gap-1 flex-wrap">
                                {QUICK_AMMO_TYPES.map((ammo) => {
                                  const isActive = currentAmmo.toLowerCase() === ammo.toLowerCase();
                                  return (
                                    <AmmoHoverTooltip key={ammo} ammoIdOrName={ammo}>
                                      <button
                                        type="button"
                                        onClick={() => setWeaponAmmoType(w.instanceId, ammo)}
                                        className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono-code transition-colors cursor-pointer ${
                                          isActive
                                            ? 'bg-amber-500 text-black font-bold shadow-xs'
                                            : 'bg-[#121520] text-slate-400 hover:text-white border border-[#232a3c] hover:border-slate-500'
                                        }`}
                                      >
                                        {ammo}
                                      </button>
                                    </AmmoHoverTooltip>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Panel Desplegable: Taller de Conversión CEMK 2077 */}
                          <div className="pt-2 border-t border-[#1e2333] space-y-2">
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => toggleRebuildWorkshop(w.instanceId)}
                                className="flex items-center gap-1.5 text-[10px] font-tech font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                              >
                                <span>{openRebuildWorkshops[w.instanceId] ? '▾' : '▸'}</span>
                                <span>🔧 TALLER DE CONVERSIÓN CEMK 2077 (POWER / SMART / TECH REBUILD)</span>
                              </button>
                              {w.rebuild2077 && w.rebuild2077 !== 'standard' && (
                                <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                                  {w.rebuild2077} ACTIVO
                                </span>
                              )}
                            </div>

                            {openRebuildWorkshops[w.instanceId] && (
                              <div className="p-2.5 bg-[#0e1017] border border-amber-500/30 rounded-xs space-y-2.5 text-[10px] font-mono-code animate-fade-in">
                                <div className="space-y-1">
                                  <div className="font-tech text-xs font-bold text-amber-300 uppercase">
                                    {CEMK_WEAPON_REBUILD_SYSTEM_GUIDE.title}
                                  </div>
                                  <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                                    {CEMK_WEAPON_REBUILD_SYSTEM_GUIDE.conversionRulesSummary}
                                  </p>
                                </div>

                                {/* Modo de Coste: Pagar 500 eb vs Libre */}
                                <div className="flex items-center justify-between bg-[#151926] p-1.5 rounded border border-[#232c42]">
                                  <span className="text-slate-400 text-[10px]">Coste de conversión:</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setRebuildFreeMode(false)}
                                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                        !rebuildFreeMode
                                          ? 'bg-amber-500 text-black font-bold'
                                          : 'bg-[#1a1e2d] text-slate-400 hover:text-white'
                                      }`}
                                    >
                                      💰 Pagar 1,000 €$
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setRebuildFreeMode(true)}
                                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                        rebuildFreeMode
                                          ? 'bg-cyan-500 text-black font-bold'
                                          : 'bg-[#1a1e2d] text-slate-400 hover:text-white'
                                      }`}
                                    >
                                      🔓 Libre (0 €$)
                                    </button>
                                  </div>
                                </div>

                                {/* Opciones de Rebuild */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                  {CEMK_WEAPON_REBUILD_SYSTEM_GUIDE.rebuildOptions.map((opt) => {
                                    const isCurrent = w.rebuild2077 === opt.type;
                                    return (
                                      <div
                                        key={opt.type}
                                        className={`p-2 rounded border space-y-1.5 flex flex-col justify-between ${
                                          isCurrent
                                            ? 'bg-amber-950/40 border-amber-500 text-white'
                                            : 'bg-[#12141f] border-[#22283a] text-slate-300'
                                        }`}
                                      >
                                        <div className="space-y-1">
                                          <div className="flex items-center justify-between font-tech font-bold text-xs text-amber-300">
                                            <span>{opt.name}</span>
                                            {isCurrent && <span className="text-[9px] text-emerald-400 font-bold">✓ ACTIVO</span>}
                                          </div>
                                          <p className="text-[9px] text-slate-400 leading-tight">
                                            {opt.combatRules}
                                          </p>
                                          <div className="text-[9px] text-cyan-300 leading-tight">
                                            ⚡ <strong>Especial:</strong> {opt.specialAbility}
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          disabled={isCurrent}
                                          onClick={() =>
                                            convertWeaponRebuild2077(
                                              w.instanceId,
                                              opt.type as any,
                                              rebuildFreeMode ? 0 : 1000
                                            )
                                          }
                                          className={`w-full py-1 rounded text-[10px] font-tech font-bold uppercase transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                            isCurrent
                                              ? 'bg-slate-800 text-slate-500 border border-slate-700'
                                              : 'bg-amber-500 hover:bg-amber-400 text-black shadow-xs'
                                          }`}
                                        >
                                          {isCurrent ? 'Instalado' : `Convertir (${rebuildFreeMode ? '0 €$' : '1,000 €$'})`}
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Botón para Restaurar a Estándar 2045 */}
                                {w.rebuild2077 && w.rebuild2077 !== 'standard' && (
                                  <div className="pt-1.5 border-t border-[#1e2333] flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => convertWeaponRebuild2077(w.instanceId, 'standard', 0)}
                                      className="px-2.5 py-1 bg-[#1a1e2d] hover:bg-red-950/60 hover:text-red-300 text-slate-400 border border-[#2b334a] rounded text-[10px] font-mono-code transition-colors cursor-pointer"
                                    >
                                      🔄 Restaurar a Arma Estándar 2045 (Quitar Rebuild)
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Panel Desplegable: Accesorios (Attachments) & Mejora Tech (Maker Upgrade) */}
                          <div className="pt-2 border-t border-[#1e2333] space-y-2">
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenAttachmentsPanels((prev) => ({
                                    ...prev,
                                    [w.instanceId]: !prev[w.instanceId]
                                  }))
                                }
                                className="flex items-center gap-1.5 text-[10px] font-tech font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                              >
                                <span>{openAttachmentsPanels[w.instanceId] ? '▾' : '▸'}</span>
                                <span>🔩 ACCESORIOS (ATTACHMENTS) &amp; 🛠️ MEJORA TECH (MAKER UPGRADE)</span>
                              </button>
                              <span className="text-[9px] font-mono-code text-slate-400">
                                {slotInfo.usedSlots}/{slotInfo.maxSlots} slots
                              </span>
                            </div>

                            {openAttachmentsPanels[w.instanceId] && (
                              <div className="p-2.5 bg-[#0a0c13] border border-cyan-500/30 rounded-xs space-y-3 text-[10px] font-mono-code animate-fade-in">
                                {/* Selector de Modo de Pago (Comprar vs Gratis) */}
                                <div className="flex items-center justify-between bg-[#121520] p-1.5 rounded border border-[#1f2538]">
                                  <span className="text-slate-400 text-[10px]">Modo de instalación:</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setAttachmentFreeMode(false)}
                                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                        !attachmentFreeMode ? 'bg-cyan-500 text-black font-bold' : 'bg-[#181c2b] text-slate-400'
                                      }`}
                                    >
                                      💰 Pagar con €$
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setAttachmentFreeMode(true)}
                                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                        attachmentFreeMode ? 'bg-emerald-500 text-black font-bold' : 'bg-[#181c2b] text-slate-400'
                                      }`}
                                    >
                                      🔓 Libre / Gratis (0 €$)
                                    </button>
                                  </div>
                                </div>

                                {/* 1. Catálogo de los 13 Accesorios */}
                                <div className="space-y-1.5">
                                  <div className="font-tech text-[11px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
                                    <span>🔩 Catálogo de Accesorios Canónicos (Core pp. 342-344)</span>
                                    <span className="text-[9px] text-slate-400">Disponibles: {slotInfo.remainingSlots} ranuras</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {WEAPON_ATTACHMENTS_CATALOG.map((att) => {
                                      const isInstalled = (w.installedAttachments ?? []).includes(att.id);
                                      const canFit = slotInfo.remainingSlots >= att.slots;
                                      const isEligible = att.eligibleWeaponTypes.length === 0 || 
                                        att.eligibleWeaponTypes.some((t) => t.toLowerCase() === (w.skill || '').toLowerCase() || t.toLowerCase() === (w.type || '').toLowerCase());
                                      const hasIncompatible = (w.installedAttachments ?? []).some((id) => att.incompatibleWith.includes(id));
                                      const canAfford = attachmentFreeMode || (activeChar?.eurodollars ?? 0) >= att.cost;

                                      return (
                                        <div
                                          key={att.id}
                                          className={`p-2 rounded border space-y-1.5 flex flex-col justify-between ${
                                            isInstalled
                                              ? 'bg-cyan-950/40 border-cyan-500/60'
                                              : 'bg-[#10131d] border-[#1e2436]'
                                          }`}
                                        >
                                          <div className="space-y-1">
                                            <div className="flex items-center justify-between gap-1">
                                              <span className="font-tech font-bold text-white text-xs">{att.name}</span>
                                              <span className="text-[9px] px-1 rounded bg-[#1c2234] text-cyan-300 font-bold border border-cyan-500/30">
                                                {att.slots} Slot{att.slots > 1 ? 's' : ''}
                                              </span>
                                            </div>
                                            <div className="text-[9px] text-amber-400 font-mono-code flex items-center gap-2">
                                              <span>{att.cost} €$ ({att.costTier})</span>
                                              {!isEligible && <span className="text-red-400 font-bold">⚠️ No estándar</span>}
                                            </div>
                                            <p className="text-[9px] text-slate-300 leading-tight">{att.summary}</p>
                                            <p className="text-[8.5px] text-slate-400 italic">{att.fullRules}</p>
                                          </div>

                                          <div className="pt-1.5 border-t border-[#181d2e] flex items-center justify-between gap-1">
                                            {isInstalled ? (
                                              <button
                                                type="button"
                                                onClick={() => removeWeaponAttachment(w.instanceId, att.id)}
                                                className="w-full py-1 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer"
                                              >
                                                ✕ Desinstalar
                                              </button>
                                            ) : (
                                              <button
                                                type="button"
                                                disabled={!canFit || hasIncompatible || (!attachmentFreeMode && !canAfford)}
                                                onClick={() => installWeaponAttachment(w.instanceId, att.id, attachmentFreeMode ? 0 : att.cost)}
                                                className={`w-full py-1 rounded text-[9px] font-bold uppercase transition-colors cursor-pointer border ${
                                                  !canFit
                                                    ? 'bg-[#181c2a] text-slate-500 border-slate-700 cursor-not-allowed'
                                                    : hasIncompatible
                                                    ? 'bg-red-950/30 text-red-400 border-red-800 cursor-not-allowed'
                                                    : !canAfford
                                                    ? 'bg-[#181c2a] text-amber-500/60 border-amber-900 cursor-not-allowed'
                                                    : 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400'
                                                }`}
                                              >
                                                {!canFit
                                                  ? `Ranuras llenas (${att.slots} nec.)`
                                                  : hasIncompatible
                                                  ? 'Incompatible con otro accesorio'
                                                  : !canAfford
                                                  ? `Saldo insuficiente (${att.cost} €$)`
                                                  : attachmentFreeMode
                                                  ? '🔓 Instalar Gratis (0 €$)'
                                                  : `💰 Comprar e Instalar (${att.cost} €$)`}
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* 2. Taller Maker: Upgrade Expertise */}
                                <div className="space-y-1.5 pt-2 border-t border-[#181d2e]">
                                  <div className="font-tech text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                                    <span>🛠️ Taller Maker: Upgrade Expertise (1 Mejora por Arma • Core p. 148)</span>
                                    {w.techUpgrade && w.techUpgrade !== 'none' && (
                                      <span className="text-[9px] text-cyan-400 font-bold">Activo: {w.techUpgrade}</span>
                                    )}
                                  </div>

                                  {/* DV y Tiempo según coste del arma */}
                                  {(() => {
                                    const weaponCost = w.cost ?? 100;
                                    const dvEntry = MAKER_DV_AND_TIME_BY_COST.find((e) => weaponCost <= e.itemPriceMax) || MAKER_DV_AND_TIME_BY_COST[MAKER_DV_AND_TIME_BY_COST.length - 1];
                                    const materialCost = Math.round(weaponCost / 2);
                                    const techSkillVal = Math.max(
                                      activeChar?.skills?.cybertech ?? 0,
                                      (activeChar?.skills as any)?.weaponstech ?? 0,
                                      (activeChar?.skills as any)?.basicTech ?? 0
                                    );
                                    const techStatVal = activeChar?.stats?.TECH ?? 0;
                                    const techBase = techStatVal + techSkillVal;

                                    return (
                                      <div className="space-y-2">
                                        <div className="bg-[#121622] p-2 rounded border border-[#232d44] flex flex-wrap items-center justify-between gap-2 text-[9px]">
                                          <div>
                                            <span className="text-slate-400">Coste Base Arma: </span>
                                            <span className="text-white font-bold">{weaponCost} €$ ({dvEntry.costTier})</span>
                                            <span className="text-slate-500 mx-1.5">•</span>
                                            <span className="text-slate-400">Materiales: </span>
                                            <span className="text-amber-400 font-bold">{materialCost} €$</span>
                                          </div>
                                          <div>
                                            <span className="text-slate-400">Dificultad Maker: </span>
                                            <span className="text-cyan-300 font-bold">DV {dvEntry.upgradeDv}</span>
                                            <span className="text-slate-500 mx-1.5">•</span>
                                            <span className="text-slate-400">Tiempo: </span>
                                            <span className="text-white font-bold">{dvEntry.timeRequired}</span>
                                            <span className="text-slate-500 mx-1.5">•</span>
                                            <span className="text-slate-400">Tu Base TECH: </span>
                                            <span className="text-emerald-400 font-bold">{techBase}</span>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {TECH_MAKER_UPGRADE_OPTIONS.map((opt) => {
                                            const isCurrent = w.techUpgrade === opt.id;
                                            return (
                                              <div
                                                key={opt.id}
                                                className={`p-2 rounded border space-y-1.5 flex flex-col justify-between ${
                                                  isCurrent
                                                    ? 'bg-amber-950/40 border-amber-500/60'
                                                    : 'bg-[#10131d] border-[#1e2436]'
                                                }`}
                                              >
                                                <div>
                                                  <div className="flex items-center justify-between">
                                                    <span className="font-tech font-bold text-white text-[11px]">{opt.label}</span>
                                                    {isCurrent && (
                                                      <span className="text-[8.5px] bg-amber-500 text-black px-1 rounded font-bold">ACTIVO</span>
                                                    )}
                                                  </div>
                                                  <p className="text-[9px] text-slate-300 mt-0.5 leading-tight">{opt.description}</p>
                                                </div>

                                                <div className="pt-1.5 border-t border-[#181d2e] flex items-center gap-1">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      const d10 = Math.floor(Math.random() * 10) + 1;
                                                      const total = techBase + d10;
                                                      const success = total > dvEntry.upgradeDv; // hay que superar el DV (CEMK p. 5)
                                                      setTechRollFeedback({
                                                        weaponId: w.instanceId,
                                                        text: `Tirada Maker (${opt.label}): TECH ${techBase} + 1d10 (${d10}) = ${total} vs DV ${dvEntry.upgradeDv} → ${success ? '¡ÉXITO!' : 'FALLO'}`
                                                      });
                                                    }}
                                                    className="px-2 py-1 bg-[#1a2133] hover:bg-[#25304a] text-cyan-300 rounded text-[9px] font-bold transition-colors cursor-pointer border border-cyan-500/30"
                                                    title="Tirar dado d10 con tu Base TECH vs DV oficial"
                                                  >
                                                    🎲 Tirar DV {dvEntry.upgradeDv}
                                                  </button>
                                                  {isCurrent ? (
                                                    <button
                                                      type="button"
                                                      onClick={() => applyTechUpgradeToWeapon(w.instanceId, 'none', 0)}
                                                      className="flex-1 py-1 bg-red-950/60 hover:bg-red-900 text-red-300 rounded text-[9px] font-bold transition-colors cursor-pointer border border-red-500/40"
                                                    >
                                                      ✕ Quitar
                                                    </button>
                                                  ) : (
                                                    <button
                                                      type="button"
                                                      onClick={() => applyTechUpgradeToWeapon(w.instanceId, opt.id as any, attachmentFreeMode ? 0 : materialCost)}
                                                      className="flex-1 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[9px] font-bold transition-colors cursor-pointer border border-amber-400"
                                                    >
                                                      {attachmentFreeMode ? 'Aplicar (0 €$)' : `Aplicar (${materialCost} €$)`}
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>

                                        {techRollFeedback && techRollFeedback.weaponId === w.instanceId && (
                                          <div className="p-1.5 bg-[#0d1522] border border-cyan-500/40 rounded text-cyan-300 text-[9.5px] font-mono-code flex items-center justify-between">
                                            <span>{techRollFeedback.text}</span>
                                            <button
                                              type="button"
                                              onClick={() => setTechRollFeedback(null)}
                                              className="text-slate-400 hover:text-white ml-2 cursor-pointer"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 3. Cyberware Instalado */}
              <div className="chamfer-card p-3 bg-[#121319] border border-[#232736]">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#1f2230] flex-wrap gap-1.5">
                  <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                    <Cpu className="w-3.5 h-3.5 text-[#a855f7]" />
                    <span>CIBERWARE INSTALADO ({activeChar?.installedCyberwareIds?.length ?? 0})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(activeChar?.empDisabledCyberwareIds || []).length > 0 && (
                      <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-red-950/60 text-red-400 border border-red-500/50 font-bold animate-pulse">
                        ⚡ {(activeChar?.empDisabledCyberwareIds || []).length} OFF (EMP)
                      </span>
                    )}
                    {(activeChar?.empDisabledCyberwareIds || []).length > 0 && (
                      <button
                        type="button"
                        onClick={() => clearAllEmpDisabledCyberware()}
                        className="px-2 py-0.5 rounded text-[9px] font-mono-code bg-[#1a2030] hover:bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 transition-colors cursor-pointer"
                        title="Reiniciar todo el ciberware y restaurar energía"
                      >
                        🔄 Reiniciar Todo
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {(activeChar?.installedCyberwareIds?.length ?? 0) === 0 ? (
                    <div className="text-center py-4 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded">
                      Sin implantes de ciberware instalados.
                    </div>
                  ) : (
                    activeChar.installedCyberwareIds.map((id) => {
                      const cyber = (coreData.cyberware as Array<{ id: string; name: string; type: string; humanityLoss: string }>).find(
                        (c) => c.id === id
                      );
                      const name = cyber?.name || id;
                      const hl = cyber?.humanityLoss || '2d6 (7)';
                      const type = cyber?.type || 'Prótesis';
                      const isEmpDisabled = (activeChar?.empDisabledCyberwareIds || []).includes(id);

                      return (
                        <div
                          key={id}
                          className={`p-2 rounded-xs flex items-center justify-between gap-2 border transition-all ${
                            isEmpDisabled
                              ? 'bg-[#1b1014] border-red-500/60'
                              : 'bg-[#171923] border-[#222636]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-tech text-sm font-bold text-white truncate">
                                {name}
                              </span>
                              {isEmpDisabled && (
                                <span className="text-[8px] font-mono-code px-1 rounded bg-red-950 text-red-400 border border-red-500/40 font-bold">
                                  ⚡ APAGADO
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono-code text-[#a855f7] flex items-center gap-1">
                              <CyberCategoryTooltip category={type}>
                                <span className="hover:underline cursor-help">{type}</span>
                              </CyberCategoryTooltip>
                              <span>•</span>
                              <TacticalTooltip term="HL"><span>HL: {hl}</span></TacticalTooltip>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => toggleEmpDisableCyberware(id)}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold transition-all cursor-pointer border ${
                                isEmpDisabled
                                  ? 'bg-red-950/60 text-red-300 border-red-500 hover:bg-red-900/60'
                                  : 'bg-[#141724] text-slate-400 border-[#23293c] hover:text-white hover:border-slate-500'
                              }`}
                              title={isEmpDisabled ? 'Ciberware apagado por EMP / Malfunction. Clic para reactivar.' : 'Simular apagado por EMP o Quickhack'}
                            >
                              {isEmpDisabled ? '⚡ EMP OFF' : '🟢 ACTIVO'}
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleCyberwareInstall(id)}
                              className="text-[10px] font-mono-code text-[#dc2626] hover:underline cursor-pointer ml-1"
                            >
                              Desinstalar
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MOCHILA / INVENTARIO */}
          {rightColTab === 'inventory' && (
            <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-3">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#1f2230]">
                <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                  <Package className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>MOCHILA / INVENTARIO GENERAL ({(activeChar?.inventory ?? []).length})</span>
                </div>
                <span className="text-[10px] font-mono-code text-[#64748b]">
                  EQUIPO, MUNICIÓN Y DROGAS
                </span>
              </div>

              {(activeChar?.inventory ?? []).length === 0 ? (
                <div className="text-center py-8 text-[#64748b] font-mono-code text-xs bg-[#171923] rounded p-4">
                  Mochila vacía.<br />
                  Adquiere munición, drogas, programas y equipo en el Compendio Omni.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                  {(activeChar?.inventory ?? []).map((item) => {
                    const isAmmo = item.category === 'ammunition';
                    const step = isAmmo ? 10 : 1;

                    return (
                      <div
                        key={item.id}
                        className="p-2 bg-[#171923] hover:bg-[#1a1d2a] border border-[#222636] rounded-xs flex items-center justify-between gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-tech text-sm font-bold text-white truncate">
                              {item.name}
                            </span>
                            <span className="text-[9px] font-mono-code bg-[#212638] text-[#38bdf8] px-1 rounded uppercase">
                              {item.category}
                            </span>
                          </div>
                          {item.details && (
                            <div className="text-[10px] font-mono-code text-[#64748b] truncate mt-0.5">
                              {item.details}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Stepper de cantidad */}
                          <div className="flex items-center gap-1 bg-[#10121a] px-1 py-0.5 rounded border border-[#202538]">
                            <button
                              onClick={() => updateInventoryQuantity(item.id, -step)}
                              className="w-4 h-4 bg-[#1f2434] hover:bg-[#dc2626] text-white rounded flex items-center justify-center text-[10px]"
                              title={`Restar ${step}`}
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="w-8 text-center font-mono-code text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateInventoryQuantity(item.id, step)}
                              className="w-4 h-4 bg-[#1f2434] hover:bg-[#10b981] text-white rounded flex items-center justify-center text-[10px]"
                              title={`Sumar ${step}`}
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => updateInventoryQuantity(item.id, -item.quantity)}
                            className="p-1 bg-[#22181d] hover:bg-[#dc2626] text-[#dc2626] hover:text-white rounded transition-colors"
                            title="Eliminar de mochila"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BILLETERA & PAGOS (€$) */}
          {rightColTab === 'wallet' && (
            <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-3">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#1f2230]">
                <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                  <Coins className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>BILLETERA & PAGOS (€$)</span>
                </div>
                <div className="font-tech text-base font-bold text-[#10b981]">
                  SALDO: {activeChar?.eurodollars ?? 0} €$
                </div>
              </div>

              {/* Formulario Rápido de Transacción */}
              <div className="bg-[#171923] p-2.5 rounded border border-[#222636] space-y-2">
                <div className="text-[10px] font-mono-code text-[#64748b] uppercase">
                  REGISTRAR COBRO / PAGO DE GIG
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={walletConcept}
                    onChange={(e) => setWalletConcept(e.target.value)}
                    placeholder="Concepto (ej. Pago de Falco, Hotel, Noche Afterlife)..."
                    className="flex-1 bg-[#0f1016] border border-[#262c3e] text-white font-mono-code text-xs px-2.5 py-1 rounded focus:outline-none focus:border-[#10b981]"
                  />
                  <input
                    type="number"
                    min="1"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-20 bg-[#0f1016] border border-[#262c3e] text-[#10b981] font-mono-code font-bold text-xs px-2 py-1 rounded focus:outline-none focus:border-[#10b981] text-right"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addEurodollarTransaction(walletConcept.trim() || 'Cobro de Gig', walletAmount);
                      setWalletConcept('');
                    }}
                    className="flex-1 py-1.5 bg-[#10b981]/20 hover:bg-[#10b981] hover:text-black text-[#10b981] border border-[#10b981]/40 rounded-xs font-tech font-bold text-xs tracking-wider transition-all"
                  >
                    + COBRAR (+{walletAmount} €$)
                  </button>
                  <button
                    onClick={() => {
                      addEurodollarTransaction(walletConcept.trim() || 'Gasto vario', -walletAmount);
                      setWalletConcept('');
                    }}
                    className="flex-1 py-1.5 bg-[#dc2626]/20 hover:bg-[#dc2626] hover:text-white text-[#dc2626] border border-[#dc2626]/40 rounded-xs font-tech font-bold text-xs tracking-wider transition-all"
                  >
                    - GASTAR (-{walletAmount} €$)
                  </button>
                </div>
              </div>

              {/* Historial de Transacciones */}
              <div>
                <div className="text-[10px] font-mono-code text-[#64748b] uppercase mb-1.5">
                  ÚLTIMAS TRANSACCIONES:
                </div>
                {(activeChar?.transactions ?? []).length === 0 ? (
                  <div className="text-center py-4 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded">
                    Sin transacciones registradas.
                  </div>
                ) : (
                  <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 font-mono-code text-xs">
                    {(activeChar?.transactions ?? []).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-1.5 bg-[#171923] border border-[#222636] rounded-xs flex items-center justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-white text-xs truncate">{tx.concept}</div>
                          <div className="text-[9px] text-[#64748b]">
                            {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Saldo: {tx.balanceAfter} €$
                          </div>
                        </div>
                        <div className={`font-bold text-xs ml-2 shrink-0 ${tx.amount >= 0 ? 'text-[#10b981]' : 'text-[#dc2626]'}`}>
                          {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} €$
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: BIO, LIFEPATH & DEUDA */}
          {rightColTab === 'bio' && (
            <div className="space-y-3">
              {/* 1. ERA & IDENTIDAD DE CREACIÓN */}
              <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#1f2230]">
                  <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                    <User className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>ERA &amp; ORIGEN DEL EDGERUNNER</span>
                  </div>
                  <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded font-bold uppercase border ${
                    activeChar?.era === '2077'
                      ? 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/40'
                      : 'bg-[#dc2626]/20 text-[#dc2626] border-[#dc2626]/40'
                  }`}>
                    {activeChar?.era === '2077' ? 'CEMK 2077 // NEUROPORT' : 'CORE 2045 // ROJO'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
                  <div className="bg-[#171923] p-2 rounded border border-[#222636]">
                    <span className="text-[10px] text-[#64748b] block">MÉTODO CREACIÓN:</span>
                    <strong className="text-white uppercase font-tech">
                      {activeChar?.creationMethod || 'Standard'}
                    </strong>
                  </div>
                  <div className="bg-[#171923] p-2 rounded border border-[#222636]">
                    <span className="text-[10px] text-[#64748b] block">HABILIDAD DE ROL:</span>
                    <strong className="text-[#38bdf8] font-tech truncate block">
                      {activeChar?.roleAbilityName || activeChar?.role} (Rnk {activeChar?.roleRank ?? 4})
                    </strong>
                  </div>
                </div>

                {activeChar?.hasNeuroport && (
                  <div className="bg-[#0b1720] border border-[#0ea5e9]/40 p-2 rounded text-[11px] font-mono-code text-[#7dd3fc] flex items-center gap-2">
                    <Cpu className="w-4 h-4 flex-shrink-0 text-[#38bdf8]" />
                    <span>Neuroport Integrado preinstalado (7 subsistemas neurales activos sin coste de HL).</span>
                  </div>
                )}
              </div>

              {/* 2. ESTADO DE DEUDA (SELLING OUT) */}
              <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#1f2230]">
                  <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                    <DollarSign className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>ESTADO DE DEUDA // SELLING OUT</span>
                  </div>
                  {activeChar?.debt?.isActive && activeChar.debt.amount > 0 ? (
                    <span className="text-[10px] font-mono-code bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/40 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> DEUDOR ACTIVO
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono-code bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> LIBRE DE DEUDAS
                    </span>
                  )}
                </div>

                {activeChar?.debt?.isActive && activeChar.debt.amount > 0 ? (
                  <div className="space-y-2 font-mono-code text-xs">
                    <div className="bg-[#1b1216] border border-[#dc2626]/40 p-2.5 rounded space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#94a3b8] uppercase">ACREEDOR:</span>
                        <span className="text-[#f59e0b] font-bold uppercase text-[10px] bg-[#241a16] px-1.5 py-0.5 rounded border border-[#3b2518]">
                          {activeChar.debt.creditorType}
                        </span>
                      </div>
                      <div className="text-white font-tech text-base font-bold">
                        {activeChar.debt.creditorName || 'Prestamista Callejero'}
                      </div>
                      <div className="text-[11px] text-[#cbd5e1] leading-relaxed">
                        {activeChar.debt.terms || 'Deuda pendiente sujeta a condiciones contractuales.'}
                      </div>
                      <div className="pt-1 border-t border-[#311b22] flex items-center justify-between">
                        <span className="text-[#94a3b8] text-[10px]">DEUDA PENDIENTE:</span>
                        <span className="font-tech text-lg font-black text-[#dc2626]">
                          {activeChar.debt.amount} €$
                        </span>
                      </div>
                    </div>

                    {/* Formulario de Pago de Deuda */}
                    <div className="bg-[#171923] p-2 rounded border border-[#222636] space-y-2">
                      <div className="text-[10px] text-[#64748b] uppercase">ABONAR A LA DEUDA:</div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          max={Math.min(activeChar.debt.amount, activeChar?.eurodollars ?? 0)}
                          value={debtPayAmount}
                          onChange={(e) => setDebtPayAmount(Math.max(1, parseInt(e.target.value) || 0))}
                          className="flex-1 bg-[#0f1016] border border-[#262c3e] text-[#10b981] font-mono-code font-bold text-xs px-2.5 py-1 rounded focus:outline-none focus:border-[#10b981]"
                        />
                        <button
                          onClick={() => {
                            if ((activeChar?.eurodollars ?? 0) < debtPayAmount) {
                              alert('No tienes suficientes eurodólares para este pago.');
                              return;
                            }
                            payOffCharacterDebt(debtPayAmount);
                            showStatus(`Abonaste ${debtPayAmount} €$ a tu acreedor.`);
                          }}
                          disabled={(activeChar?.eurodollars ?? 0) <= 0}
                          className="px-3 py-1 bg-[#10b981]/20 hover:bg-[#10b981] hover:text-black text-[#10b981] border border-[#10b981]/40 rounded-xs font-tech font-bold text-xs tracking-wider transition-all disabled:opacity-40 cursor-pointer"
                        >
                          💸 ABONAR DEUDA
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-[#1e2332]">
                        <button
                          onClick={() => {
                            if (confirm('¿Marcar la deuda como perdonada o completamente saldada?')) {
                              updateCharacterDebt(undefined);
                              showStatus('Deuda cancelada en la ficha.');
                            }
                          }}
                          className="text-[10px] text-[#64748b] hover:text-[#ef4444] underline cursor-pointer"
                        >
                          Perdonar / Eliminar contrato de deuda (GM)
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#131b19] border border-[#10b981]/30 p-2.5 rounded text-xs font-mono-code space-y-1.5">
                    <p className="text-[#a7f3d0] leading-relaxed">
                      Este Edgerunner no le debe eurodólares ni favores sucios a ninguna corporación, banda ni prestamista.
                    </p>
                    <button
                      onClick={() => {
                        updateCharacterDebt({
                          isActive: true,
                          amount: 1500,
                          creditorType: 'gang',
                          creditorName: 'Prestamista Callejero Tyger Claws',
                          terms: 'Interés mensual del 20% y disponibilidad para 1 gig sucio a requerimiento.'
                        });
                        addEurodollarTransaction('Préstamo de Emergencia Selling Out', 1500);
                        showStatus('Deuda contraída: +1,500 €$ ingresados en billetera.');
                      }}
                      className="mt-1 px-2.5 py-1 bg-[#f59e0b]/20 hover:bg-[#f59e0b] hover:text-black text-[#f59e0b] border border-[#f59e0b]/40 rounded-xs font-tech text-xs font-bold transition-all cursor-pointer"
                    >
                      + CONTRAER DEUDA MENOR (+1,500 €$)
                    </button>
                  </div>
                )}
              </div>

              {/* 3. RESUMEN DEL LIFEPATH */}
              <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#1f2230]">
                  <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                    <BookOpen className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>HISTORIAL DE VIDA // LIFEPATH</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono-code max-h-[280px] overflow-y-auto pr-1">
                  <div className="bg-[#171923] p-2 rounded border border-[#222636]">
                    <span className="text-[10px] text-[#64748b] uppercase block">Origen Cultural:</span>
                    <span className="text-white">{activeChar?.lifepath?.culturalRegion || 'No especificado'}</span>
                  </div>

                  <div className="bg-[#171923] p-2 rounded border border-[#222636]">
                    <span className="text-[10px] text-[#64748b] uppercase block">Personalidad:</span>
                    <span className="text-white">{activeChar?.lifepath?.personality || 'No especificado'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="bg-[#171923] p-1.5 rounded border border-[#222636]">
                      <span className="text-[9px] text-[#64748b] block">ESTILO ROPA:</span>
                      <span className="text-white text-[11px] truncate block">{activeChar?.lifepath?.clothingStyle || '—'}</span>
                    </div>
                    <div className="bg-[#171923] p-1.5 rounded border border-[#222636]">
                      <span className="text-[9px] text-[#64748b] block">PEINADO:</span>
                      <span className="text-white text-[11px] truncate block">{activeChar?.lifepath?.hairstyle || '—'}</span>
                    </div>
                    <div className="bg-[#171923] p-1.5 rounded border border-[#222636]">
                      <span className="text-[9px] text-[#64748b] block">RASGO:</span>
                      <span className="text-white text-[11px] truncate block">{activeChar?.lifepath?.affectation || '—'}</span>
                    </div>
                  </div>

                  <div className="bg-[#171923] p-2 rounded border border-[#222636] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-[#64748b]">QUÉ VALORA:</span>
                      <span className="text-white text-right font-medium">{activeChar?.lifepath?.valueMost || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-[#64748b]">OPINIÓN SOBRE GENTE:</span>
                      <span className="text-white text-right font-medium">{activeChar?.lifepath?.feelAboutPeople || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-[#64748b]">PERSONA VALORADA:</span>
                      <span className="text-white text-right font-medium">{activeChar?.lifepath?.valuedPerson || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-[#64748b]">POSESIÓN VALORADA:</span>
                      <span className="text-white text-right font-medium">{activeChar?.lifepath?.valuedPossession || '—'}</span>
                    </div>
                  </div>

                  <div className="bg-[#171923] p-2 rounded border border-[#222636]">
                    <span className="text-[10px] text-[#64748b] uppercase block">Trasfondo Familiar &amp; Crisis:</span>
                    <p className="text-white text-[11px] mb-1">{activeChar?.lifepath?.familyBackground || 'Sin trasfondo registrado.'}</p>
                    {activeChar?.lifepath?.familyCrisis && (
                      <p className="text-[#f59e0b] text-[10px] border-t border-[#232a3e] pt-1">
                        ⚠️ {activeChar.lifepath.familyCrisis}
                      </p>
                    )}
                  </div>

                  <div className="bg-[#171923] p-2 rounded border border-[#222636]">
                    <span className="text-[10px] text-[#64748b] uppercase block">Meta de Vida:</span>
                    <p className="text-[#38bdf8] text-[11px] font-bold">
                      {activeChar?.lifepath?.lifeGoal || 'Sobrevivir un día más en Night City.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. ENEMIGOS DE LIFEPATH */}
              <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#1f2230]">
                  <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                    <Skull className="w-3.5 h-3.5 text-[#dc2626]" />
                    <span>ENEMIGOS ACTIVOS ({(activeChar?.lifepath?.enemies ?? []).length})</span>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 font-mono-code text-xs">
                  {(activeChar?.lifepath?.enemies ?? []).length === 0 ? (
                    <div className="text-center py-3 text-[#64748b] font-mono-code text-[11px] bg-[#171923] rounded">
                      Sin enemigos declarados en tu Lifepath.
                    </div>
                  ) : (
                    activeChar?.lifepath?.enemies.map((enemy, idx) => (
                      <div key={enemy.id || idx} className="bg-[#181216] border border-[#dc2626]/30 p-2 rounded space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#ef4444] text-[11px]">{enemy.who}</strong>
                          <button
                            onClick={() => {
                              const updated = (activeChar?.lifepath?.enemies || []).filter((_, i) => i !== idx);
                              updateCharacterLifepath({ enemies: updated });
                              showStatus('Enemigo eliminado.');
                            }}
                            className="text-[#64748b] hover:text-[#ef4444]"
                            title="Eliminar enemigo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[10px] text-[#cbd5e1] leading-tight">
                          <span className="text-[#64748b]">Causa:</span> {enemy.cause}
                        </div>
                        <div className="text-[10px] text-[#f59e0b] leading-tight">
                          <span className="text-[#64748b]">Arrojará:</span> {enemy.throwAtYou}
                        </div>
                        <div className="text-[9px] text-[#94a3b8] italic">
                          "{enemy.reaction}"
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 5. LIFEPATH ESPECÍFICO DE ROL & LIFEPATH DE TECH (Core págs. 52-59) */}
              <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-3">
                <div className="flex flex-wrap items-center justify-between pb-1.5 border-b border-[#1f2230] gap-2">
                  <div className="flex items-center gap-1.5 font-tech text-xs font-bold text-white uppercase">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>LIFEPATH ESPECÍFICO DE ROL ({activeChar?.role?.toUpperCase() || 'SOLO'}) &amp; TECH (Core págs. 52–59)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTechLifepathModal(!showTechLifepathModal)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#171c2b] hover:bg-[#252f4a] text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer"
                  >
                    {showTechLifepathModal ? '👁️ Ocultar Tablas Tech' : '🛠️ Ver Tablas Completas Tech (6 Tablas)'}
                  </button>
                </div>

                {/* Preguntas de Lifepath del Rol del Personaje */}
                <div className="space-y-2">
                  {(() => {
                    const roleKey = (activeChar?.role || 'solo').toLowerCase();
                    const questions = ROLE_SPECIFIC_LIFEPATH_TABLES_BY_ROLE[roleKey] || [];
                    const roleLifepathAnswers = activeChar?.lifepath?.roleSpecificLifepath || activeChar?.lifepath?.roleLifepath || {};

                    if (questions.length === 0) {
                      return (
                        <div className="text-[10px] text-slate-400 italic">
                          No hay preguntas de Lifepath específicas para este rol.
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {questions.map((q) => {
                          const currentVal = roleLifepathAnswers[q.id] || '';
                          return (
                            <div key={q.id} className="p-2 bg-[#171923] rounded border border-[#222636] space-y-1.5 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-tech text-xs font-bold text-cyan-300">{q.label}</span>
                                  <span className="text-[9px] font-mono-code px-1 rounded bg-[#202538] text-slate-300">{q.dice}</span>
                                </div>
                                <div className="text-[10px] text-white font-mono-code bg-[#0e1017] p-1.5 rounded border border-[#1b2030] mt-1 min-h-[36px]">
                                  {currentVal ? (
                                    <span className="text-emerald-300">✓ {currentVal}</span>
                                  ) : (
                                    <span className="text-slate-500 italic">Sin responder... Elige o tira dados.</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 pt-1 border-t border-[#1e2333]">
                                <select
                                  value={currentVal}
                                  onChange={(e) => updateRoleSpecificLifepath(q.id, e.target.value)}
                                  className="flex-1 bg-[#12141f] border border-[#2b334a] text-slate-200 text-[9.5px] rounded px-1.5 py-1 font-mono-code"
                                >
                                  <option value="">-- Seleccionar manualmente --</option>
                                  {q.options.map((opt, oIdx) => (
                                    <option key={oIdx} value={opt}>
                                      {oIdx + 1}. {opt.length > 55 ? opt.substring(0, 55) + '...' : opt}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const rolledIndex = Math.floor(Math.random() * q.options.length);
                                    const chosen = q.options[rolledIndex];
                                    updateRoleSpecificLifepath(q.id, chosen);
                                  }}
                                  className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[9px] font-bold font-mono-code shrink-0 cursor-pointer"
                                  title={`Tirar ${q.dice}`}
                                >
                                  🎲 {q.dice}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Modal / Sección Desplegable de las 6 Tablas Completas del Tech Lifepath */}
                {showTechLifepathModal && (
                  <div className="p-3 bg-[#0a0c13] border-2 border-cyan-500/40 rounded space-y-3 animate-fade-in mt-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#20293d]">
                      <div>
                        <h5 className="font-tech text-xs font-bold text-white uppercase tracking-wider">
                          🛠️ TABLAS OFICIALES DEL TECH LIFEPATH (Core Rulebook pág. 55)
                        </h5>
                        <span className="text-[10px] text-slate-400 font-mono-code">
                          Especialidad de Tech, Socio vs Solo, Cómo es tu Taller, Clientes Principales, Proveedores de Suministros y Quién te Busca
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTechLifepathModal(false)}
                        className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                      >
                        ✕ Cerrar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {Object.values(TECH_LIFEPATH_TABLES).map((tbl) => {
                        const roleLifepathAnswers = activeChar?.lifepath?.roleSpecificLifepath || activeChar?.lifepath?.roleLifepath || {};
                        const tableKey = `tech_${tbl.id}`;
                        const currentAnswer = roleLifepathAnswers[tableKey] || roleLifepathAnswers[tbl.id] || '';

                        return (
                          <div key={tbl.id} className="p-2 bg-[#121520] rounded border border-[#222b40] space-y-1.5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-tech text-xs font-bold text-amber-300">{tbl.title}</span>
                                <span className="text-[9px] font-mono-code px-1 rounded bg-[#1c2234] text-slate-300">{tbl.dice}</span>
                              </div>
                              <div className="text-[10px] text-white font-mono-code bg-[#080a10] p-1.5 rounded border border-[#1b2234] mt-1 min-h-[34px]">
                                {currentAnswer ? (
                                  <span className="text-emerald-300">✓ {currentAnswer}</span>
                                ) : (
                                  <span className="text-slate-500 italic">Sin asignar...</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 pt-1 border-t border-[#1c2234]">
                              <select
                                value={currentAnswer}
                                onChange={(e) => {
                                  updateRoleSpecificLifepath(tableKey, e.target.value);
                                  updateRoleSpecificLifepath(tbl.id, e.target.value);
                                }}
                                className="flex-1 bg-[#0d0f17] border border-[#27324c] text-slate-200 text-[9.5px] rounded px-1.5 py-1 font-mono-code"
                              >
                                <option value="">-- Elegir opción --</option>
                                {tbl.options.map((opt, oIdx) => (
                                  <option key={oIdx} value={opt}>
                                    {oIdx + 1}. {opt.length > 55 ? opt.substring(0, 55) + '...' : opt}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => {
                                  const idx = Math.floor(Math.random() * tbl.options.length);
                                  const val = tbl.options[idx];
                                  updateRoleSpecificLifepath(tableKey, val);
                                  updateRoleSpecificLifepath(tbl.id, val);
                                }}
                                className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[9px] font-bold font-mono-code shrink-0 cursor-pointer"
                                title={`Tirar ${tbl.dice}`}
                              >
                                🎲 {tbl.dice}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DOJO DE ARTES MARCIALES, ENTRENAMIENTO IP & SKILL CHIPS (REGLAS OFICIALES) */}
          {rightColTab === 'dojo' && (
            <div className="space-y-3 animate-fade-in">
              {/* Encabezado Principal y Gestión de IP / Eurodólares */}
              <div className="chamfer-card p-3.5 bg-[#0e111a] border-2 border-emerald-500/50 shadow-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#232d44]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🥋</span>
                    <div>
                      <h4 className="font-tech text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span>DOJO DE ARTES MARCIALES &amp; CHIPWARE // REGLAS OFICIALES</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono-code block">
                        Coste x2 = Próximo Nivel × 40 IP • Skill Chips (Nivel 3 — 1,000 €$) • ROF 2 • Ignora 50% SP
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Billetera y Puntos de Mejora */}
                    <div className="flex items-center gap-2 bg-[#141824] border border-[#23293c] px-2.5 py-1 rounded text-xs font-mono-code">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-white font-bold">{activeChar?.eurodollars ?? 0} €$</span>
                      <span className="text-slate-500">|</span>
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">{activeChar?.improvementPoints ?? 120} IP</span>
                    </div>

                    {/* Botones de ajuste de IP */}
                    <div className="flex items-center gap-0.5 bg-[#141824] border border-[#23293c] p-0.5 rounded text-[10px] font-mono-code">
                      <button
                        type="button"
                        onClick={() => adjustImprovementPoints(-10)}
                        className="px-1.5 py-0.5 bg-[#1a2030] hover:bg-red-600/40 text-slate-300 rounded cursor-pointer transition-colors"
                        title="Restar 10 IP"
                      >
                        -10
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustImprovementPoints(10)}
                        className="px-1.5 py-0.5 bg-[#1a2030] hover:bg-emerald-600/40 text-emerald-300 rounded cursor-pointer transition-colors"
                        title="Añadir 10 IP"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustImprovementPoints(50)}
                        className="px-1.5 py-0.5 bg-[#1a2030] hover:bg-emerald-600/40 text-emerald-300 font-bold rounded cursor-pointer transition-colors"
                        title="Añadir 50 IP"
                      >
                        +50
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustImprovementPoints(100)}
                        className="px-1.5 py-0.5 bg-[#1a2030] hover:bg-cyan-600/40 text-cyan-300 font-bold rounded cursor-pointer transition-colors"
                        title="Añadir 100 IP"
                      >
                        +100
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowMartialArtsGuide(!showMartialArtsGuide)}
                      className="px-2.5 py-1 bg-[#1a2336] hover:bg-[#25334f] text-[#38bdf8] border border-[#38bdf8]/40 rounded text-xs font-tech font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{showMartialArtsGuide ? 'OCULTAR MANUAL' : 'REGLAS OFICIALES'}</span>
                    </button>
                  </div>
                </div>

                {/* FEEDBACK DE ACCIONES DE ARTES MARCIALES */}
                {martialFeedback && (
                  <div
                    className={`p-2.5 rounded text-xs font-mono-code flex items-center justify-between animate-fade-in ${
                      martialFeedback.success
                        ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-200'
                        : 'bg-red-950/70 border border-red-500/60 text-red-200'
                    }`}
                  >
                    <span>{martialFeedback.message}</span>
                    <button
                      type="button"
                      onClick={() => setMartialFeedback(null)}
                      className="text-slate-400 hover:text-white px-1 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* MANUAL OFICIAL Y REGLAMENTO CANÓNICO */}
                {showMartialArtsGuide && (
                  <div className="p-3.5 bg-[#121622] border border-[#27344e] rounded-xs space-y-3 text-xs font-mono-code animate-fade-in max-h-[420px] overflow-y-auto pr-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#222c42] pb-1.5">
                      <span className="font-tech text-sm font-bold text-amber-400 flex items-center gap-1">
                        <span>🥋 {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.sourceReferences}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-300 font-sans leading-relaxed text-[11px] bg-[#0b0e17] p-2.5 rounded border border-[#1b2234]">
                      <p><strong>Definición:</strong> {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.definition}</p>
                      <p className="text-emerald-300"><strong>Dificultad (x2):</strong> {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.difficultyMultiplier}</p>
                      <p>{MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.whySeparateSkills}</p>
                      <p className="text-cyan-300">{MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.overview.requirementToUse}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 border-t border-[#1e263a]">
                      <div className="bg-[#0b0e17] p-2.5 rounded border border-[#1b2234] space-y-1.5">
                        <span className="font-tech text-xs font-bold text-white uppercase block">
                          MECÁNICAS DE COMBATE (ROF 2 &amp; 50% SP)
                        </span>
                        <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                          {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.rateOfFire}
                        </p>
                        <p className="text-[10px] text-amber-300 font-sans leading-relaxed">
                          {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.armorPenetrationRule}
                        </p>
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                          {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.specialMovesResolution}
                        </p>
                      </div>

                      <div className="bg-[#0b0e17] p-2.5 rounded border border-[#1b2234] space-y-1.5">
                        <span className="font-tech text-xs font-bold text-white uppercase block">
                          ESCALA DE DAÑO SEGÚN STAT BODY
                        </span>
                        <div className="space-y-1 text-[9px] font-mono-code text-slate-300">
                          {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.combatMechanics.bodyDamageScaleTable.map((row, idx) => (
                            <div key={idx} className="flex items-center justify-between border-b border-[#1b2234] py-0.5">
                              <span className="text-slate-400 font-bold">{row.bodyRange}:</span>
                              <strong className="text-emerald-400">{row.damageDice}</strong>
                              <span className="text-slate-500 text-[9px] hidden sm:inline">({row.examples})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0b0e17] p-2.5 rounded border border-[#1b2234] space-y-2">
                      <span className="font-tech text-xs font-bold text-amber-400 uppercase block">
                        CÓMO ADQUIRIR Y ENTRENAR ARTES MARCIALES
                      </span>
                      <div className="space-y-2 text-[10px] text-slate-300 font-sans">
                        {MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT.howToBuyAndAcquire.methods.map((m, idx) => (
                          <div key={idx} className="border-b border-[#1a2133] pb-1.5 last:border-b-0 last:pb-0">
                            <div className="flex items-center justify-between">
                              <strong className="text-white font-tech text-xs">{m.name}</strong>
                              <span className="text-[9px] text-slate-400 font-mono-code">{m.sourcePage}</span>
                            </div>
                            <div className="text-emerald-300 font-mono-code text-[10px] mt-0.5">
                              Coste: {m.costExplanation}
                            </div>
                            <p className="text-slate-300 text-[10px] mt-0.5 leading-relaxed">
                              {m.mechanicDetails}
                            </p>
                            {m.ipCostTable && (
                              <div className="mt-1.5 grid grid-cols-5 sm:grid-cols-10 gap-1 text-[9px] font-mono-code text-center">
                                {m.ipCostTable.map((t) => (
                                  <div key={t.targetRank} className="bg-[#131826] border border-[#222b40] p-1 rounded">
                                    <div className="text-slate-400">R{t.targetRank}</div>
                                    <div className="text-emerald-300 font-bold">{t.cost} IP</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* RESUMEN DE ESTILOS ACTIVOS DEL PERSONAJE */}
                <div className="p-3 bg-[#11141e] border border-[#232a3c] rounded-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-[#1e2434] pb-1.5">
                    <span className="font-tech text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span>ESTILOS ACTIVOS EN TU HOJA</span>
                      <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {
                          MARTIAL_ARTS_FORMS.filter(
                            (f) =>
                              (activeChar?.knownMartialArts?.[f.id] ?? 0) > 0 ||
                              (activeChar?.equippedMartialArtChips || []).includes(f.id)
                          ).length
                        }{' '}
                        FORMAS
                      </span>
                    </span>
                    <span className="text-[10px] font-mono-code text-slate-400">
                      DEX Base: <strong className="text-white">{activeChar?.stats?.DEX ?? 6}</strong>
                    </span>
                  </div>

                  {(() => {
                    const activeForms = MARTIAL_ARTS_FORMS.filter(
                      (f) =>
                        (activeChar?.knownMartialArts?.[f.id] ?? 0) > 0 ||
                        (activeChar?.equippedMartialArtChips || []).includes(f.id)
                    );

                    if (activeForms.length === 0) {
                      return (
                        <div className="p-3 bg-[#161a26] border border-[#252d42] rounded text-center text-xs font-mono-code text-slate-400 space-y-1">
                          <p className="text-amber-300 font-bold">
                            ⚠️ Aún no dominas ningún Estilo de Arte Marcial ni tienes Skill Chips equipados.
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Invierte tus Puntos de Mejora (IP) o adquiere un Skill Chipware (+3) en el catálogo inferior para habilitar ataques ROF 2 y Movimientos Especiales.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activeForms.map((form) => {
                          const naturalRank = activeChar?.knownMartialArts?.[form.id] ?? 0;
                          const isChipEquipped = (activeChar?.equippedMartialArtChips || []).includes(form.id);
                          const effectiveRank = isChipEquipped ? Math.max(3, naturalRank) : naturalRank;
                          const dex = activeChar?.stats?.DEX ?? 6;
                          const totalAttack = dex + effectiveRank;
                          const isOpen = !!openMartialArtForms[`active_${form.id}`];
                          const sourceLabel = form.sourceBook === 'core' ? 'Core Rulebook' : 'Cyberfists of Fury';

                          return (
                            <div
                              key={form.id}
                              className="rounded bg-[#151a27] border border-emerald-500/50 shadow-sm overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() => toggleMartialArtForm(`active_${form.id}`)}
                                className="w-full p-2.5 flex items-center justify-between gap-2 text-left hover:bg-[#1a2133] transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                  <span className="font-tech text-xs font-bold text-white truncate">
                                    {form.name}
                                  </span>
                                  <span className="text-[10px] font-mono-code text-emerald-400">
                                    DEX (x2) • ROF 2 • 50% SP • Nvl {effectiveRank}
                                  </span>
                                  <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-[#10b981]/20 text-emerald-300 border border-emerald-500/40">
                                    Fuente ({sourceLabel})
                                  </span>
                                </div>
                                <div className="shrink-0 text-slate-400">
                                  {isOpen ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4" />}
                                </div>
                              </button>

                              {isOpen && (
                                <div className="p-2.5 pt-0 border-t border-[#1e2438] space-y-2 mt-1">
                                  <div className="flex items-center justify-between text-[11px] font-mono-code bg-[#0d1018] p-1.5 rounded border border-[#1d2436]">
                                    <span className="text-slate-400">Tirada de Ataque:</span>
                                    <span className="text-red-400 font-bold">1d10 + {totalAttack} (DEX {dex} + R{effectiveRank})</span>
                                  </div>

                                  <div className="space-y-1 pt-1 border-t border-[#1d2436]">
                                    {form.moves.map((m) => (
                                      <div
                                        key={m.id}
                                        className="text-[10px] font-mono-code flex items-center justify-between bg-[#0e111a] px-2 py-1 rounded border border-[#1b2234]"
                                      >
                                        <span className="text-white font-bold">{m.name}</span>
                                        <span className="text-amber-400 font-bold">{m.isOpposed ? `vs ${m.opposedBy ?? 'DEX + Evasion'}` : `DV ${m.resolutionDv}`}{m.sourcePage && <span className="text-[#64748b] ml-1">p.{m.sourcePage}</span>}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* FILTROS Y BÚSQUEDA DEL CATÁLOGO DE 27 FORMAS */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Buscar estilo por nombre o técnica..."
                    value={martialArtSearch}
                    onChange={(e) => setMartialArtSearch(e.target.value)}
                    className="bg-[#0b0d14] border border-[#262c3e] text-white text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-[#10b981] flex-1 min-w-[160px] font-mono-code"
                  />
                  <div className="flex gap-1 text-[10px] font-mono-code font-bold">
                    {(['all', 'core', 'interface_red'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setMartialArtCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          martialArtCategoryFilter === cat
                            ? 'bg-[#10b981] text-black shadow-sm'
                            : 'bg-[#181b26] text-[#94a3b8] hover:text-white border border-[#232738]'
                        }`}
                      >
                        {cat === 'all' ? 'TODAS (27)' : cat === 'core' ? 'CORE RULES (4)' : 'CYBERFISTS (23)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LISTA COMPLETA DE FORMAS DE ARTES MARCIALES */}
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1.5">
                  {MARTIAL_ARTS_FORMS.filter((f) => {
                    const matchCat =
                      martialArtCategoryFilter === 'all' ? true : f.sourceBook === martialArtCategoryFilter;
                    const matchSearch =
                      !martialArtSearch.trim() ||
                      f.name.toLowerCase().includes(martialArtSearch.toLowerCase()) ||
                      f.moves.some(
                        (m) =>
                          m.name.toLowerCase().includes(martialArtSearch.toLowerCase()) ||
                          m.effectDescription.toLowerCase().includes(martialArtSearch.toLowerCase())
                      );
                    return matchCat && matchSearch;
                  }).map((form) => {
                    const naturalRank = activeChar?.knownMartialArts?.[form.id] ?? 0;
                    const isChipOwned = (activeChar?.ownedMartialArtChips || []).includes(form.id);
                    const isChipEquipped = (activeChar?.equippedMartialArtChips || []).includes(form.id);
                    const effectiveRank = isChipEquipped ? Math.max(3, naturalRank) : naturalRank;
                    const nextRank = naturalRank + 1;
                    const ipCost = nextRank * 40;
                    const currentIp = activeChar?.improvementPoints ?? 0;
                    const canTrain = currentIp >= ipCost && naturalRank < 10;
                    const dex = activeChar?.stats?.DEX ?? 6;
                    const totalAttack = dex + effectiveRank;
                    const isOpen = !!openMartialArtForms[`catalog_${form.id}`];
                    const sourceLabel = form.sourceBook === 'core' ? 'Core Rulebook' : 'Cyberfists of Fury';

                    return (
                      <div
                        key={form.id}
                        className={`rounded border transition-all overflow-hidden ${
                          effectiveRank > 0
                            ? 'bg-[#121824] border-emerald-500/50 shadow-md'
                            : 'bg-[#10131d] border-[#1f2738]'
                        }`}
                      >
                        {/* Cabecera Plegable: Nombre • Stats Clave • Fuente */}
                        <button
                          type="button"
                          onClick={() => toggleMartialArtForm(`catalog_${form.id}`)}
                          className="w-full p-2.5 flex items-center justify-between gap-2 text-left hover:bg-[#161c28] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="font-tech text-xs sm:text-sm font-bold text-white truncate">
                              {form.name}
                            </span>
                            <span className="text-[10px] font-mono-code text-emerald-400">
                              DEX (x2) • ROF 2 • 50% SP • Nvl {effectiveRank}
                            </span>
                            <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                              Fuente ({sourceLabel})
                            </span>
                            {effectiveRank > 0 && (
                              <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-emerald-500 text-black font-bold">
                                EFECTIVO: R{effectiveRank}
                                {isChipEquipped && naturalRank < 3 ? ' (CHIP +3)' : ''}
                              </span>
                            )}
                          </div>
                          <div className="shrink-0 text-slate-400">
                            {isOpen ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </button>

                        {/* Contenido Desplegable Completo */}
                        {isOpen && (
                          <div className="p-3 pt-0 border-t border-[#1a2233] space-y-2 mt-1">
                            <div className="text-[10px] font-mono-code text-[#94a3b8] flex items-center gap-1.5 pt-1">
                              <span>Rol: <span className="text-white">{form.tacticalRole}</span></span>
                              <span>•</span>
                              <span>Stats: <span className="text-slate-300">{form.keyStats.join(', ')}</span></span>
                            </div>

                            {/* Lore y Trasfondo */}
                            <div className="text-[11px] text-slate-300 italic font-sans leading-relaxed bg-[#0b0e15] p-2 rounded border border-[#182030]">
                              "{form.originAndFlavor}"
                            </div>

                            {/* Movimientos Especiales */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-tech font-bold text-red-400 uppercase tracking-wider block">
                                ⚡ Movimientos Especiales ({form.moves.length}):
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {form.moves.map((m) => (
                                  <div
                                    key={m.id}
                                    className="bg-[#0b0e16] p-2 rounded-xs border border-[#1d2538] space-y-0.5 text-[10px] font-mono-code"
                                  >
                                    <div className="flex items-center justify-between font-bold">
                                      <span className="text-white">{m.name}</span>
                                      <span className="text-amber-400">{m.isOpposed ? `vs ${m.opposedBy ?? 'DEX + Evasion'}` : `DV ${m.resolutionDv}`}{m.sourcePage && <span className="text-[#64748b] ml-1">p.{m.sourcePage}</span>}</span>
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-sans leading-tight">
                                      <strong>Req:</strong> {m.requirements}
                                    </div>
                                    <div className="text-[9px] text-slate-300 font-sans leading-tight">
                                      {m.effectDescription}
                                    </div>
                                    {m.damageBonusOrFormula && (
                                      <div className="text-[9px] text-amber-300 font-bold">
                                        Daño: {m.damageBonusOrFormula}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Fila de Estado y Acciones: IP + Skill Chip + Rango Manual */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#1c2436] items-center">
                              {/* Entrenamiento con IP */}
                              <div>
                                {naturalRank >= 10 ? (
                                  <div className="text-center py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-[10px] font-tech font-bold uppercase rounded-xs">
                                    ★ MAESTRÍA MÁXIMA (R10)
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const res = trainMartialArtWithIp(form.id, form.name);
                                      setMartialFeedback(res);
                                    }}
                                    disabled={!canTrain}
                                    className={`w-full py-1.5 px-2 rounded-xs font-tech text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                                      canTrain
                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-sm'
                                        : 'bg-[#151926] text-slate-500 border border-[#222738] cursor-not-allowed'
                                    }`}
                                    title={canTrain ? `Gasta ${ipCost} IP para subir a Rango ${nextRank}` : `Necesitas ${ipCost} IP (tienes ${currentIp})`}
                                  >
                                    <Award className="w-3.5 h-3.5" />
                                    <span>
                                      {canTrain ? `ENTRENAR R${nextRank} (${ipCost} IP)` : `REQ. ${ipCost} IP`}
                                    </span>
                                  </button>
                                )}
                              </div>

                              {/* Skill Chip Nivel 3 */}
                              <div>
                                {isChipOwned ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleEquipMartialArtChip(form.id)}
                                    className={`w-full py-1.5 px-2 rounded-xs font-mono-code text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                      isChipEquipped
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 hover:bg-cyan-500/30'
                                        : 'bg-[#151926] text-slate-400 border border-[#222738] hover:text-white'
                                    }`}
                                  >
                                    <Cpu className="w-3.5 h-3.5" />
                                    <span>{isChipEquipped ? '✓ CHIP EQUIPADO' : '⚡ INSERTAR CHIP'}</span>
                                  </button>
                                ) : (
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const res = buyAndEquipMartialArtChip(form.id, form.name, false);
                                        setMartialFeedback(res);
                                      }}
                                      className="flex-1 py-1.5 px-1 bg-[#1a2030] hover:bg-amber-600 hover:text-black text-amber-300 border border-amber-600/40 rounded-xs font-mono-code text-[9px] font-bold transition-colors cursor-pointer text-center"
                                      title="Comprar Skill Chip Nivel 3 por 1,000 €$"
                                    >
                                      CHIP 1,000 €$
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const res = buyAndEquipMartialArtChip(form.id, form.name, true);
                                        setMartialFeedback(res);
                                      }}
                                      className="py-1.5 px-2 bg-[#151926] hover:bg-[#20273a] text-slate-400 hover:text-white border border-[#24293c] rounded-xs font-mono-code text-[9px] transition-colors cursor-pointer text-center"
                                      title="Gratis en creación de personaje"
                                    >
                                      GRATIS
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Ajuste manual de rango & Ataque Total */}
                              <div className="flex items-center justify-between gap-1 font-mono-code text-[10px] bg-[#0b0e16] p-1 rounded border border-[#1b2234]">
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-400">R. Base:</span>
                                  <button
                                    type="button"
                                    onClick={() => updateMartialArtRank(form.id, Math.max(0, naturalRank - 1))}
                                    className="w-5 h-5 flex items-center justify-center bg-[#181d2a] hover:bg-red-600 text-white rounded cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="w-4 text-center font-bold text-white">{naturalRank}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateMartialArtRank(form.id, Math.min(10, naturalRank + 1))}
                                    className="w-5 h-5 flex items-center justify-center bg-[#181d2a] hover:bg-emerald-600 text-white rounded cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="text-right">
                                  <span className="text-red-400 font-bold">1d10+{totalAttack}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HABILIDAD DE ROL (RANGOS 1 AL 10) */}
          {rightColTab === 'roleAbility' && (() => {
            const roleData = ROLE_ABILITIES_COMPLETE_PROGRESSION[activeChar?.role || 'Solo'] || ROLE_ABILITIES_COMPLETE_PROGRESSION['Solo'];
            const currentRoleRank = activeChar?.roleRank ?? 4;

            return (
              <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-3 animate-fade-in">
                {/* Cabecera del Rol */}
                <div className="flex items-center justify-between pb-2 border-b border-[#1f2230] flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="font-tech text-sm font-bold text-white uppercase">
                        {roleData.abilityName}
                      </span>
                      <span className="ml-2 text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/40">
                        ROL: {activeChar?.role || 'Solo'}
                      </span>
                    </div>
                  </div>

                  {/* Selector y ajuste de Rango 1-10 */}
                  <div className="flex items-center gap-1.5 bg-[#171a26] px-2 py-1 rounded border border-[#232a3d]">
                    <span className="text-[10px] font-mono-code text-slate-400 font-bold uppercase">
                      Rango Actual:
                    </span>
                    <button
                      type="button"
                      disabled={currentRoleRank <= 1}
                      onClick={() => updateCharacterMeta({ roleRank: Math.max(1, currentRoleRank - 1) })}
                      className="w-5 h-5 flex items-center justify-center bg-[#20273a] hover:bg-purple-600 text-white rounded text-xs font-bold transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono-code font-bold text-purple-300 text-xs">
                      {currentRoleRank}
                    </span>
                    <button
                      type="button"
                      disabled={currentRoleRank >= 10}
                      onClick={() => updateCharacterMeta({ roleRank: Math.min(10, currentRoleRank + 1) })}
                      className="w-5 h-5 flex items-center justify-center bg-[#20273a] hover:bg-purple-600 text-white rounded text-xs font-bold transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                    <select
                      value={currentRoleRank}
                      onChange={(e) => updateCharacterMeta({ roleRank: Number(e.target.value) })}
                      aria-label="Seleccionar rango de rol del personaje"
                      className="ml-1 bg-[#0f1118] text-purple-300 font-mono-code text-[10px] px-1 py-0.5 rounded border border-[#2b334d]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
                        <option key={r} value={r}>
                          Rango {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Resumen & Mecánicas de la Habilidad */}
                <div className="p-2.5 bg-[#171924] rounded border border-[#222738] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-300">
                    <span className="text-purple-300 font-bold">Fuente: {roleData.statUsed}</span>
                    <span className="text-slate-400">{roleData.summary}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans border-t border-[#222738] pt-1.5">
                    {roleData.mechanicsOverview}
                  </p>
                </div>

                {/* Lista de Progresión Rango 1 al 10 */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono-code text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>Árbol de Progresión (Rangos 1 al 10):</span>
                  </div>

                  <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                    {roleData.ranks.map((rk) => {
                      const isCurrent = rk.rank === currentRoleRank;
                      const isUnlocked = rk.rank <= currentRoleRank;

                      return (
                        <div
                          key={rk.rank}
                          className={`p-2 rounded border transition-all ${
                            isCurrent
                              ? 'bg-purple-950/50 border-purple-500 shadow-sm'
                              : isUnlocked
                              ? 'bg-[#151824] border-purple-900/40 opacity-90'
                              : 'bg-[#0f1118] border-[#1f2434] opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded flex items-center justify-center font-mono-code text-xs font-bold shrink-0 ${
                                  isCurrent
                                    ? 'bg-purple-500 text-black'
                                    : isUnlocked
                                    ? 'bg-purple-900 text-purple-200'
                                    : 'bg-[#1e2230] text-slate-500'
                                }`}
                              >
                                {rk.rank}
                              </span>
                              <span className="font-tech text-xs font-bold text-white">
                                {rk.title}
                              </span>
                            </div>

                            <span className="text-[9px] font-mono-code font-bold px-1.5 py-0.5 rounded uppercase">
                              {isCurrent ? (
                                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1 rounded">
                                  ★ ACTIVO
                                </span>
                              ) : isUnlocked ? (
                                <span className="text-emerald-400">✓ Desbloqueado</span>
                              ) : (
                                <span className="text-slate-600">Bloqueado</span>
                              )}
                            </span>
                          </div>

                          <p className="mt-1 text-[10px] font-mono-code text-slate-300 pl-7 leading-relaxed">
                            {rk.unlocks}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 7: DESCANSO, CURACIÓN Y REPARACIÓN DE BLINDAJE */}
          {rightColTab === 'restingRepair' && (
            <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-4 animate-fade-in">
              {/* Encabezado */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1f2230]">
                <div className="flex items-center gap-2 font-tech text-xs font-bold text-white uppercase">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>DESCANSO TÁCTICO, REGENERACIÓN Y REPARACIÓN</span>
                </div>
                <span className="text-[9px] font-mono-code text-cyan-400/80">
                  REGLAS OFICIALES CP RED (CORE pp. 140 & 222)
                </span>
              </div>

              {/* Mensajes de Feedback si aplican */}
              {restFeedback && (
                <div className="p-2 bg-emerald-950/70 border border-emerald-500/60 rounded text-emerald-300 text-[11px] font-mono-code flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{restFeedback}</span>
                </div>
              )}
              {repairFeedback && (
                <div className="p-2 bg-amber-950/70 border border-amber-500/60 rounded text-amber-300 text-[11px] font-mono-code flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{repairFeedback}</span>
                </div>
              )}

              {/* SECCIÓN 1: Descanso, Estabilización y Asistencia Médica Canónica */}
              {(() => {
                const effBody = activeChar ? getEffectiveBody(activeChar) : 6;
                const effWill = activeChar?.stats?.WILL ?? 6;
                const maxHp = calculateMaxHp(effBody, effWill);
                const currentHp = activeChar?.currentHp ?? 0;
                const currentEb = activeChar?.eurodollars ?? 0;
                const hasEnhancedAntibodies = Boolean(
                  activeChar?.installedCyberwareIds?.includes('enhanced-antibodies') ||
                  activeChar?.installedCyberwareIds?.includes('cw-enhanced-antibodies')
                );

                const handleBuyAntibodies = () => {
                  if (hasEnhancedAntibodies) return;
                  if (currentEb < 500) {
                    setRestFeedback('Fondos insuficientes: Enhanced Antibodies cuesta 500 €$.');
                    setTimeout(() => setRestFeedback(null), 4000);
                    return;
                  }
                  const res = installCyberwareAdvanced({
                    cyberwareId: 'enhanced-antibodies',
                    cyberwareName: 'Enhanced Antibodies',
                    humanityLossAmount: 2,
                    cost: 500,
                    spendMoney: true
                  });
                  if (res && !res.success) {
                    setRestFeedback(res.message || 'Error al instalar ciberware.');
                  } else {
                    setRestAntibodies(true);
                    setRestFeedback('¡Enhanced Antibodies instalado! (-500 €$, -2 HL, 1 Slot Internal Body). Tasa de descanso duplicada.');
                  }
                  setTimeout(() => setRestFeedback(null), 5000);
                };

                const handlePayHospitalCryo = () => {
                  if (currentEb < 100) {
                    setRestFeedback('Fondos insuficientes: Se requieren 100 €$ para 1 día de internación en Cryotank hospitalario.');
                    setTimeout(() => setRestFeedback(null), 4000);
                    return;
                  }
                  updateCharacterMeta({ eurodollars: currentEb - 100 });
                  const healAmount = naturalHealingPerDay(effBody, hasEnhancedAntibodies || restAntibodies, true);
                  const newHp = Math.min(maxHp, currentHp + healAmount);
                  setHp(newHp);
                  setRestFeedback(`Cryotank Hospitalario (-100 €$): +${healAmount} HP recuperados (Tasa criocelular ${mult}× BODY).`);
                  setTimeout(() => setRestFeedback(null), 5000);
                };

                const handlePayMedtechChem = () => {
                  if (currentEb < 50) {
                    setRestFeedback('Fondos insuficientes: Se requieren 50 €$ para la recarga química de gel criogénico.');
                    setTimeout(() => setRestFeedback(null), 4000);
                    return;
                  }
                  updateCharacterMeta({ eurodollars: currentEb - 50 });
                  const healAmount = naturalHealingPerDay(effBody, hasEnhancedAntibodies || restAntibodies, true);
                  const newHp = Math.min(maxHp, currentHp + healAmount);
                  setHp(newHp);
                  setRestFeedback(`Recarga Química Medtech abonada (-50 €$): +${healAmount} HP recuperados en Cryotank aliado.`);
                  setTimeout(() => setRestFeedback(null), 5000);
                };

                const handleInjectSpeedheal = () => {
                  const isFbcChar = Boolean(activeChar?.fbcState?.isFullBodyConversion);
                  const healAmount = speedhealAmount(effBody, effWill, currentHp, isFbcChar);
                  if (healAmount === 0) {
                    setRestFeedback(isFbcChar ? 'Speedheal no funciona en un FBC' : 'Speedheal no funciona en Mortally Wounded: primero hay que estabilizar (Core p. 150).');
                    setTimeout(() => setRestFeedback(null), 4000);
                    return;
                  }
                  if (currentHp >= maxHp) {
                    setRestFeedback('Tus puntos de golpe (HP) ya están al máximo.');
                    setTimeout(() => setRestFeedback(null), 4000);
                    return;
                  }
                  const newHp = Math.min(maxHp, currentHp + healAmount);
                  setHp(newHp);
                  setRestFeedback(`Inyección de Speedheal aplicada: +${healAmount} HP restaurados al instante (${newHp}/${maxHp} HP). Máx 1 dosis por día (Core p. 150).`);
                  setTimeout(() => setRestFeedback(null), 5000);
                };

                const mult = (restAntibodies || hasEnhancedAntibodies ? 2 : 1) * (restCryotank ? 2 : 1);
                const ratePerDay = naturalHealingPerDay(effBody, restAntibodies || hasEnhancedAntibodies, restCryotank);
                const totalPreview = ratePerDay * Math.max(1, restDays);

                return (
                  <div className="space-y-3.5">
                    {/* Tarjeta 1: Descanso Natural y Requisito de Estabilización */}
                    <div className="p-3 bg-[#161925] border border-[#232a3d] rounded space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-tech text-xs font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-red-400" />
                          1. 🛏️ Descanso Natural & Requisito de Estabilización (Core p. 222)
                        </span>
                        <div className="flex items-center gap-2 font-mono-code text-[10px]">
                          <span className="text-slate-400">
                            HP: <strong className="text-white">{currentHp}</strong> / {maxHp}
                          </span>
                          <span className="text-[#10b981] font-bold">
                            €$: {currentEb}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono-code">
                        <div className="p-2 bg-[#0d0f17] border border-[#1e2335] rounded space-y-1">
                          <div className="text-amber-400 font-bold uppercase">Prerrequisito Obligatorio:</div>
                          <p className="text-slate-300 leading-relaxed font-sans">
                            Si sufriste daño o estás en estado Mortalmente Herido (&lt; 1 HP), primero debes ser <strong>Estabilizado</strong> con <em>First Aid</em> o <em>Paramedic</em> (<strong>DV 10</strong> Levemente Herido, <strong>DV 13</strong> Gravemente Herido, <strong>DV 15</strong> Mortalmente Herido). Sin estabilización <strong>NO recuperas HP</strong>.
                          </p>
                        </div>
                        <div className="p-2 bg-[#0d0f17] border border-[#1e2335] rounded space-y-1">
                          <div className="text-emerald-400 font-bold uppercase">Buff &amp; Debuff de Reposo:</div>
                          <p className="text-slate-300 leading-relaxed font-sans">
                            <strong>Buff:</strong> Recuperas <strong>1 × BODY ({effBody}) HP por cada día (24h)</strong> de <em>Actividad Ligera</em> (dormir, descansar, leer).<br />
                            <strong className="text-red-400">Debuff:</strong> Esfuerzo físico intenso (combate, correr, nadar, trepar o daño) anula la curación del día (<strong>0 HP</strong>) y requiere re-estabilización.
                          </p>
                        </div>
                      </div>

                      {/* Controles de Descanso */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        {/* Selector de días */}
                        <div className="bg-[#10131d] p-2 rounded border border-[#1e2335] space-y-1">
                          <label className="text-[10px] font-mono-code text-slate-400 uppercase font-bold block">
                            Días de Descanso:
                          </label>
                          <div className="flex items-center gap-1">
                            {[1, 3, 7].map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => setRestDays(d)}
                                className={`flex-1 py-1 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer ${
                                  restDays === d
                                    ? 'bg-cyan-500 text-black'
                                    : 'bg-[#1b2030] text-slate-300 hover:text-white'
                                }`}
                              >
                                {d}d
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Modificador: Enhanced Antibodies */}
                        <div className="bg-[#10131d] p-2 rounded border border-[#1e2335] flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-mono-code text-white font-bold flex items-center gap-1">
                              <span>Enhanced Antibodies</span>
                              {hasEnhancedAntibodies && <span className="text-emerald-400 text-[9px]">●</span>}
                            </div>
                            <div className="text-[9px] text-slate-400">Duplica curación (2× BODY)</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRestAntibodies(!restAntibodies)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer ${
                              restAntibodies || hasEnhancedAntibodies
                                ? 'bg-emerald-500 text-black'
                                : 'bg-[#1b2030] text-slate-400 border border-[#2b334a]'
                            }`}
                          >
                            {restAntibodies || hasEnhancedAntibodies ? 'ON' : 'OFF'}
                          </button>
                        </div>

                        {/* Modificador: Cryotank / Cuidado Médico */}
                        <div className="bg-[#10131d] p-2 rounded border border-[#1e2335] flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-mono-code text-white font-bold">
                              Tanque Criogénico
                            </div>
                            <div className="text-[9px] text-slate-400">Dobla la curación/día (Core p. 353)</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRestCryotank(!restCryotank)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer ${
                              restCryotank
                                ? 'bg-cyan-500 text-black'
                                : 'bg-[#1b2030] text-slate-400 border border-[#2b334a]'
                            }`}
                          >
                            {restCryotank ? 'ON' : 'OFF'}
                          </button>
                        </div>
                      </div>

                      {/* Previsualización y Botón de Ejecutar Descanso */}
                      <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-[#1f2638]">
                        <div className="text-[10px] font-mono-code text-slate-300">
                          Tasa: <strong className="text-cyan-300">+{ratePerDay} HP/día</strong> • Total estimado: <strong className="text-emerald-400">+{totalPreview} HP</strong> ({restDays} día{restDays > 1 ? 's' : ''})
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (currentHp <= 0) {
                              setRestFeedback('Mortally Wounded: hay que estabilizar (DV 15) antes de que empiece la curación natural (Core p. 222).');
                            } else {
                              restAndHealDays(restDays, restAntibodies || hasEnhancedAntibodies, restCryotank);
                              setRestFeedback(`Descanso completado: +${totalPreview} HP recuperados tras ${restDays} día(s) de reposo.`);
                            }
                            setTimeout(() => setRestFeedback(null), 4000);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded font-tech text-xs font-bold uppercase transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Ejecutar Descanso ({restDays}d)</span>
                        </button>
                      </div>
                    </div>

                    {/* Tarjeta 2: Enhanced Antibodies (Ciberware) */}
                    <div className="p-3 bg-[#131622] border border-[#23293e] rounded space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-tech text-xs font-bold text-emerald-400 uppercase">
                            🧬 2. Enhanced Antibodies (Anticuerpos Mejorados — Core pp. 114, 363)
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono-code rounded">
                            500 €$ • 1 Slot Internal • 2 HL
                          </span>
                        </div>
                        {hasEnhancedAntibodies ? (
                          <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-[10px] font-mono-code font-bold rounded">
                            ✅ INSTALADO EN TU CUERPO
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleBuyAntibodies}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-tech text-xs font-bold uppercase rounded transition-all cursor-pointer shadow"
                          >
                            [ 🧬 Comprar e Instalar (500 €$ • 2 HL) ]
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                        <strong>¿Qué es?</strong> Implante nanotecnológico y biológico interno que acelera drásticamente la regeneración celular una vez que las heridas fueron cerradas/estabilizadas.<br />
                        <strong>Buff:</strong> Curas el <strong>DOBLE de tu BODY por cada día de descanso (2 × BODY = {effBody * 2} HP/día)</strong>. En Cryotank la tasa se dobla: <strong>4 × BODY ({effBody * 4} HP/día)</strong> (Core pp. 114, 353).<br />
                        <strong className="text-amber-400">Limitación:</strong> Ocupa 1 de las 7 ranuras de <em>Internal Body Cyberware</em>. No te estabiliza automáticamente ni cura Heridas Críticas por sí solo.
                      </p>
                    </div>

                    {/* Tarjeta 3: Tanque Criogénico (Cryotank) */}
                    <div className="p-3 bg-[#131622] border border-[#23293e] rounded space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-tech text-xs font-bold text-cyan-400 uppercase">
                            🧊 3. Tanque Criogénico (Cryotank — Core pp. 149, 224)
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono-code rounded">
                            Compra: 5,000 €$ | Hosp: 100 €$/d | Medtech: 50 €$
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handlePayHospitalCryo}
                            className="px-2 py-1 bg-[#1b2234] hover:bg-cyan-600 hover:text-black text-cyan-300 border border-cyan-500/40 font-tech text-[10px] font-bold uppercase rounded transition-all cursor-pointer"
                            title="Pagar 100 €$ por internación médica en hospital"
                          >
                            [ 🧊 Pagar 1 Día Hospitalario (100 €$) + Curar ]
                          </button>
                          <button
                            type="button"
                            onClick={handlePayMedtechChem}
                            className="px-2 py-1 bg-[#1b2234] hover:bg-emerald-600 hover:text-black text-emerald-300 border border-emerald-500/40 font-tech text-[10px] font-bold uppercase rounded transition-all cursor-pointer"
                            title="Pagar 50 €$ de recarga química en Cryotank personal de Medtech aliado"
                          >
                            [ 🧪 Pagar Recarga Medtech (50 €$) + Curar ]
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                        <strong>¿Qué es?</strong> Cápsula médica sellada llena de perfluorocarbono oxigenado y gel bio-refrigerante que mantiene al paciente en coma inducido mientras regenera órganos y tejidos.<br />
                        <strong>Buffs:</strong> Garantiza <em>Actividad Ligera perfecta</em> y cura al doble (<strong>2 × BODY HP/día</strong>, o <strong>3 × BODY HP/día</strong> con Antibodies). Mientras estás sumergido, <strong>no sufres los efectos ni penalizadores de tus Heridas Críticas no tratadas</strong> y las constantes se mantienen estables.<br />
                        <strong className="text-red-400">Debuffs &amp; Riesgos:</strong> <em>Inconsciente / Indefenso</em>: el paciente no puede actuar ni defenderse sin abortar el ciclo. <em>Vulnerabilidad Estructural (30 SDP)</em>: si el cilindro es destruido en combate, estalla arrojando al paciente empapado y expuesto.
                      </p>
                    </div>

                    {/* Tarjeta 4 y 5: Cryopump y Speedheal en grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {/* Cryopump */}
                      <div className="p-2.5 bg-[#10131d] border border-[#1e2335] rounded space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-tech text-xs font-bold text-amber-400 uppercase">
                            🧳 4. Cryopump (Bomba Criogénica Portátil)
                          </span>
                          <span className="text-[9px] font-mono-code text-slate-400">
                            5,000 €$ • Recarga: 50 €$
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                          <strong>Función:</strong> Maletín de soporte vital portátil (gratis para Medtech con <em>Cryosystem Operation 1+</em>). Estabiliza a un paciente en estado <em>Mortalmente Herido</em> (&lt;1 HP) y <strong>pausa indefinidamente los Death Saves</strong> durante su traslado a un hospital o base.
                        </p>
                      </div>

                      {/* Speedheal */}
                      <div className="p-2.5 bg-[#10131d] border border-[#1e2335] rounded space-y-1.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-tech text-xs font-bold text-purple-400 uppercase">
                              💉 5. Speedheal (Fármaco Biológico Medtech)
                            </span>
                            <span className="text-[9px] font-mono-code text-slate-400">
                              Lote Medtech: 200 €$
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-300 leading-relaxed font-sans mt-1">
                            <strong>Buff:</strong> Restaura <strong>BODY + WILL ({effBody + effWill}) HP</strong> al instante de la inyección.<br />
                            <strong className="text-red-400">Debuff:</strong> Máximo <strong>1 dosis cada 24 horas</strong>. Una segunda dosis antes de 24h otorga 0 HP, causa 1 punto de pérdida de Humanidad permanente y fatiga severa.
                          </p>
                        </div>
                        <div className="pt-1.5 flex justify-end">
                          <button
                            type="button"
                            onClick={handleInjectSpeedheal}
                            className="px-2.5 py-1 bg-purple-700 hover:bg-purple-600 text-white font-tech text-[10px] font-bold uppercase rounded transition-all cursor-pointer shadow"
                          >
                            [ 💉 Inyectar Speedheal (+{effBody + effWill} HP) ]
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* SECCIÓN 2: Taller de Reparación de Blindaje */}
              <div className="p-3 bg-[#161925] border border-[#232a3d] rounded space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-tech text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    2. Taller de Reparación de Armaduras (Restaurar SP)
                  </span>
                  <span className="text-[10px] font-mono-code text-slate-400">
                    Habilidades: <strong className="text-amber-300">Basic Tech / Cybertech</strong>
                  </span>
                </div>

                {/* Estado Actual del Blindaje */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Cabeza */}
                  <div className="p-2.5 bg-[#10131d] rounded border border-[#1e2335] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono-code text-slate-400 uppercase">
                        Cabeza: {activeChar?.headArmor?.name || 'Head Armor'}
                      </div>
                      <div className="font-mono-code text-xs font-bold text-white mt-0.5">
                        SP: <span className="text-cyan-400">{activeChar?.headArmor?.currentSp}</span> / {activeChar?.headArmor?.maxSp}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={!activeChar?.headArmor || activeChar.headArmor.currentSp >= activeChar.headArmor.maxSp}
                      onClick={() => {
                        repairCharacterArmor('head', 'full', 0);
                        setRepairFeedback(`Armadura de cabeza reparada a ${activeChar?.headArmor?.maxSp} SP.`);
                        setTimeout(() => setRepairFeedback(null), 4000);
                      }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-tech text-xs font-bold uppercase rounded transition-all cursor-pointer"
                    >
                      Reparar Cabeza
                    </button>
                  </div>

                  {/* Torso */}
                  <div className="p-2.5 bg-[#10131d] rounded border border-[#1e2335] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono-code text-slate-400 uppercase">
                        Torso: {activeChar?.bodyArmor?.name || 'Body Armor'}
                      </div>
                      <div className="font-mono-code text-xs font-bold text-white mt-0.5">
                        SP: <span className="text-cyan-400">{activeChar?.bodyArmor?.currentSp}</span> / {activeChar?.bodyArmor?.maxSp}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={!activeChar?.bodyArmor || activeChar.bodyArmor.currentSp >= activeChar.bodyArmor.maxSp}
                      onClick={() => {
                        repairCharacterArmor('body', 'full', 0);
                        setRepairFeedback(`Armadura de torso reparada a ${activeChar?.bodyArmor?.maxSp} SP.`);
                        setTimeout(() => setRepairFeedback(null), 4000);
                      }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-tech text-xs font-bold uppercase rounded transition-all cursor-pointer"
                    >
                      Reparar Torso
                    </button>
                  </div>
                </div>

                {/* Botón de Reparar Todo el Blindaje */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      repairCharacterArmor('both', 'full', 0);
                      setRepairFeedback('Todo el blindaje (Cabeza y Torso) ha sido reparado a su SP máximo.');
                      setTimeout(() => setRepairFeedback(null), 4000);
                    }}
                    className="px-3 py-1 bg-[#1c2235] hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/40 rounded text-[11px] font-mono-code font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🛡️ Reparar Todo el Blindaje (Cabeza + Torso)</span>
                  </button>
                </div>

                {/* Tabla Canónica de Reparación de Armaduras (Core p. 140) */}
                <div className="space-y-1.5 pt-2 border-t border-[#1f2638]">
                  <div className="text-[10px] font-mono-code text-slate-400 font-bold uppercase">
                    Tabla Oficial de Reparación de Armaduras (Core Rulebook p. 140):
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono-code text-[10px] border border-[#22283a]">
                      <thead className="bg-[#111420] text-slate-400 border-b border-[#22283a]">
                        <tr>
                          <th className="p-1.5">Categoría de Coste</th>
                          <th className="p-1.5">Ejemplos</th>
                          <th className="p-1.5 text-center">DV</th>
                          <th className="p-1.5">Tiempo de Trabajo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2333]">
                        {RESTING_AND_ARMOR_REPAIR_OFFICIAL_GUIDE.armorRepair.table.map((row) => (
                          <tr key={row.costTier} className="hover:bg-[#1a1f30]/50 text-slate-300">
                            <td className="p-1.5 font-bold text-amber-300">{row.costTier}</td>
                            <td className="p-1.5 text-slate-400">{row.examples}</td>
                            <td className="p-1.5 text-center font-bold text-cyan-400">DV {row.dv}</td>
                            <td className="p-1.5 text-slate-300">{row.repairTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Nota sobre Nanomateriales Cibernéticos */}
                  <div className="p-2 bg-[#10131d] rounded border border-cyan-500/30 text-[10px] font-mono-code text-cyan-300">
                    💡 <strong>Subdermal Armor & Skin Weave:</strong> {RESTING_AND_ARMOR_REPAIR_OFFICIAL_GUIDE.armorRepair.cyberwareRegeneration.rule}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Modal: Selector de los 20 Retratos Oficiales */}
      {isPortraitModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12141d] border border-[#262c3e] rounded-xs max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-fade-in">
            <div className="p-3.5 border-b border-[#1f2434] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#38bdf8]" />
                <span className="font-tech text-sm font-bold text-white tracking-wider uppercase">
                  SELECTOR DE RETRATOS // 20 AVATARES OFICIALES
                </span>
              </div>
              <button
                onClick={() => setIsPortraitModalOpen(false)}
                className="text-[#64748b] hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-[#1f2434] flex gap-1.5 overflow-x-auto text-[10px] font-mono-code font-bold">
              {['all', 'Danger Gal', 'Edgerunners 2077', 'Cyberware & Borgs', 'Roles'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPortraitFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                    portraitFilterCategory === cat
                      ? 'bg-[#38bdf8] text-black font-bold'
                      : 'bg-[#181b26] text-[#94a3b8] hover:text-white border border-[#222738]'
                  }`}
                >
                  {cat === 'all' ? 'TODOS (20)' : cat}
                </button>
              ))}
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {CHARACTER_PORTRAITS_CATALOG.filter((p) => {
                if (portraitFilterCategory === 'all') return true;
                if (portraitFilterCategory === 'Roles') return p.category.includes('Rol');
                return p.category.toLowerCase().includes(portraitFilterCategory.toLowerCase());
              }).map((p) => {
                const isSelected = (activeChar?.portraitId || 'portrait-role-solo') === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCharacterPortrait(p.id);
                      setIsPortraitModalOpen(false);
                      showStatus(`Retrato actualizado: ${p.name}`);
                    }}
                    className={`p-2.5 rounded border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#182334] border-[#38bdf8] shadow-md shadow-[#38bdf8]/10'
                        : 'bg-[#151722] border-[#222738] hover:border-[#38bdf8]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="w-9 h-9 rounded flex items-center justify-center font-bold text-sm shrink-0 border"
                        style={{
                          backgroundColor: `${p.accentColor}20`,
                          borderColor: `${p.accentColor}60`,
                          color: p.accentColor
                        }}
                      >
                        {p.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className={`text-[8px] font-mono-code px-1.5 py-0.5 rounded border ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>

                    <div>
                      <div className="font-tech text-xs font-bold text-white leading-tight">
                        {p.name}
                      </div>
                      <div className="text-[9px] font-mono-code text-[#64748b] mt-0.5">
                        {p.loreTags.join(' • ')}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="text-[9px] font-mono-code text-[#38bdf8] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> SELECCIONADO
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
