import React, { useState, useMemo, useCallback } from 'react';
import coreData from '../../data/core-rules.cprpack.json';
import { useCharacterStore } from '../../store/useCharacterStore';
import { ItemVisualPlaceholder } from '../../components/ItemVisualPlaceholder';
import type { WeaponItem, ArmorItem } from '../../types/cyberpunk';
import { RANGE_BRACKETS, WEAPON_RANGE_PROFILES, getWeaponProfileKey } from '../../data/rangeTables';
import { getAutofireRulesSummary, parseHumanityLossAverage } from '../../engine/characterEngine';
import { canInstallAnother, countInstalls } from '../../engine/cyberwareEffects';
import { SOURCEBOOKS_CATALOG, EXPANSION_RULE_SYSTEMS } from '../../data/expansionRulesData';
import {
  getWeaponClassAndRebuildInfo,
  getAmmoTypeTooltip as getAmmoTooltipInfo,
  getCyberwareCategoryTooltip,
  type WeaponClassAndRebuildInfo
} from '../../data/weaponAndCyberwareTooltips';
import type { SourceBookId } from '../../data/enemiesCatalog';
import { 
  Search, 
  Crosshair, 
  Shield, 
  Cpu, 
  Terminal, 
  Disc, 
  Wrench, 
  Pill, 
  Package, 
  Check, 
  Plus, 
  LayoutGrid,
  List,
  Coins, 
  AlertCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Info,
  Layers,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

type CompendiumCategory = 
  | 'all' 
  | 'weapons' 
  | 'armor' 
  | 'cyberware' 
  | 'programs' 
  | 'ammunition' 
  | 'attachments' 
  | 'drugs' 
  | 'gear';

type ViewMode = 'cards' | 'table';

interface FeedbackState {
  id: string;
  message: string;
  isError?: boolean;
}

/* Tactical Cyberpunk Tooltip Helper */
export const TacticalTooltip: React.FC<{
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

/* Origin SourceBook Badge Helper */
// Plan 5: muestra la página del libro junto al badge cuando el ítem tiene sourcePage.
export const renderSourceBookBadge = (sourceBook?: string, sourcePage?: number) => {
  const badge = renderSourceBookBadgeOnly(sourceBook);
  if (!sourcePage) return badge;
  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      {badge}
      <span className="text-[9px] font-mono-code text-[#94a3b8]" title="Página del libro">p.{sourcePage}</span>
    </span>
  );
};

const renderSourceBookBadgeOnly = (sourceBook?: string) => {
  const book = sourceBook || 'core';
  switch (book) {
    case 'core':
      return (
        <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono-code font-bold bg-[#ff003c]/15 text-[#ff003c] border border-[#ff003c]/40 shrink-0" title="Cyberpunk RED Core Rulebook v1.24">
          CORE 2045
        </span>
      );
    case 'black_chrome':
      return (
        <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono-code font-bold bg-[#e0a800]/15 text-[#f59e0b] border border-[#e0a800]/40 shrink-0" title="Black Chrome Tech & Style Guide">
          BLACK CHROME
        </span>
      );
    case 'cemk_2077':
      return (
        <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono-code font-bold bg-[#00ff66]/15 text-[#10b981] border border-[#00ff66]/40 shrink-0" title="Cyberpunk Edgerunners Mission Kit (2077)">
          CEMK 2077
        </span>
      );
    case 'interface_red':
      return (
        <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono-code font-bold bg-[#a855f7]/15 text-[#c084fc] border border-[#a855f7]/40 shrink-0" title="Interface RED Vol 1-3 & Going Metal FBC">
          INTERFACE RED // FBC
        </span>
      );
    case 'danger_gal':
      return (
        <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono-code font-bold bg-[#ec4899]/15 text-[#f472b6] border border-[#ec4899]/40 shrink-0" title="Danger Gal Dossier">
          DANGER GAL
        </span>
      );
    case 'dlc':
      return (
        <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono-code font-bold bg-[#3b82f6]/15 text-[#38bdf8] border border-[#38bdf8]/40 shrink-0" title="DLCs Oficiales & Hornet's Pharmacy">
          DLC
        </span>
      );
    default:
      return (
        <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono-code font-bold bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
          {book.toUpperCase()}
        </span>
      );
  }
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

export const CompendiumView: React.FC = () => {
  const [compendiumMode, setCompendiumMode] = useState<'items' | 'systems'>('items');
  const [selectedBookFilter, setSelectedBookFilter] = useState<SourceBookId | 'all'>('all');
  const [isBookSummaryExpanded, setIsBookSummaryExpanded] = useState<boolean>(true);

  // Search & Filters for Items
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CompendiumCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [spendMoneyMode, setSpendMoneyMode] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  // Sorting Controls
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'sourceBook' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Search & Filters for Systems
  const [systemSearchQuery, setSystemSearchQuery] = useState<string>('');
  const [systemSourceFilter, setSystemSourceFilter] = useState<string>('all');
  const [expandedSystemIds, setExpandedSystemIds] = useState<Record<string, boolean>>({ 'fbc-rules': true });

  const getActiveCharacter = useCharacterStore((state) => state.getActiveCharacter);
  const equipWeaponFromCatalog = useCharacterStore((state) => state.equipWeaponFromCatalog);
  const equipArmorFromCatalog = useCharacterStore((state) => state.equipArmorFromCatalog);
  const toggleCyberwareInstall = useCharacterStore((state) => state.toggleCyberwareInstall);
  const installCyberwareAdvanced = useCharacterStore((state) => state.installCyberwareAdvanced);
  const updateCharacterMeta = useCharacterStore((state) => state.updateCharacterMeta);

  const activeChar = getActiveCharacter();

  const showFeedback = (id: string, message: string, isError = false) => {
    setFeedback({ id, message, isError });
    setTimeout(() => {
      setFeedback((prev) => (prev?.id === id ? null : prev));
    }, 2200);
  };

  const toggleExpand = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  const toggleSystemExpand = (id: string) => {
    setExpandedSystemIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAcquire = (
    itemId: string,
    itemName: string,
    cost: number,
    mode: 'buy' | 'loot',
    callback: () => void
  ): boolean => {
    const currentEb = activeChar.eurodollars ?? 0;
    if (mode === 'buy' && cost > 0) {
      if (currentEb < cost) {
        showFeedback(itemId, `Fondos insuficientes: tienes ${currentEb} €$, necesitas ${cost} €$`, true);
        return false;
      }
      updateCharacterMeta({ eurodollars: currentEb - cost });
    }
    callback();
    showFeedback(
      itemId,
      mode === 'buy' && cost > 0
        ? `¡${itemName} adquirido (-${cost} €$)! Saldo: ${currentEb - cost} €$`
        : `¡${itemName} obtenido (Loot / 0 €$)!`
    );
    return true;
  };

  const getVisualTypeForWeapon = (w: any): 'pistol' | 'rifle' | 'smg' | 'shotgun' | 'melee' | 'heavy' => {
    if (w.type === 'Melee') return 'melee';
    if (w.skill === 'Handgun') {
      return w.id.includes('smg') ? 'smg' : 'pistol';
    }
    if (w.skill === 'Heavy Weapons') return 'heavy';
    if (w.skill === 'Shoulder Arms') {
      return (w.id.includes('shotgun') || w.ammoType?.toLowerCase().includes('slug')) ? 'shotgun' : 'rifle';
    }
    return 'rifle';
  };

  // Consolidate all items to compute accurate counts per book
  const allCatalogItems = useMemo(() => {
    return [
      ...(coreData.weapons || []),
      ...(coreData.armor || []),
      ...(coreData.cyberware || []),
      ...(coreData.programs || []),
      ...(coreData.ammunition || []),
      ...(coreData.attachments || []),
      ...(coreData.drugs || []),
      ...(coreData.gear || [])
    ];
  }, []);

  const bookItemCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allCatalogItems.length,
      core: 0,
      black_chrome: 0,
      cemk_2077: 0,
      interface_red: 0,
      danger_gal: 0,
      dlc: 0
    };
    allCatalogItems.forEach((item: any) => {
      const sb = (item.sourceBook || 'core') as string;
      if (counts[sb] !== undefined) {
        counts[sb]++;
      } else {
        counts[sb] = 1;
      }
    });
    return counts;
  }, [allCatalogItems]);

  // Pre-filter catalog by selected book
  const bookFilteredItems = useMemo(() => {
    const filterByBook = (items: any[] = []) =>
      items.filter((item: any) => selectedBookFilter === 'all' || (item.sourceBook || 'core') === selectedBookFilter);

    return {
      weapons: filterByBook(coreData.weapons),
      armor: filterByBook(coreData.armor),
      cyberware: filterByBook(coreData.cyberware),
      programs: filterByBook(coreData.programs),
      ammunition: filterByBook(coreData.ammunition),
      attachments: filterByBook(coreData.attachments),
      drugs: filterByBook(coreData.drugs),
      gear: filterByBook(coreData.gear)
    };
  }, [selectedBookFilter]);

  const categoriesConfig: { key: CompendiumCategory; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Todo', count: Object.values(bookFilteredItems).reduce((sum, arr) => sum + arr.length, 0), icon: <Package className="w-3.5 h-3.5" /> },
    { key: 'weapons', label: 'Armas', count: bookFilteredItems.weapons.length, icon: <Crosshair className="w-3.5 h-3.5" /> },
    { key: 'armor', label: 'Blindajes', count: bookFilteredItems.armor.length, icon: <Shield className="w-3.5 h-3.5" /> },
    { key: 'cyberware', label: 'Ciberware', count: bookFilteredItems.cyberware.length, icon: <Cpu className="w-3.5 h-3.5" /> },
    { key: 'programs', label: 'Programas', count: bookFilteredItems.programs.length, icon: <Terminal className="w-3.5 h-3.5" /> },
    { key: 'ammunition', label: 'Munición', count: bookFilteredItems.ammunition.length, icon: <Disc className="w-3.5 h-3.5" /> },
    { key: 'attachments', label: 'Accesorios', count: bookFilteredItems.attachments.length, icon: <Wrench className="w-3.5 h-3.5" /> },
    { key: 'drugs', label: 'Drogas', count: bookFilteredItems.drugs.length, icon: <Pill className="w-3.5 h-3.5" /> },
    { key: 'gear', label: 'Equipo', count: bookFilteredItems.gear.length, icon: <Package className="w-3.5 h-3.5" /> }
  ];

  const parseItemCost = (cost: any): number => {
    if (typeof cost === 'number') return cost;
    if (!cost) return 0;
    const num = parseFloat(String(cost).replace(/[^\d.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const getItemCategoryName = (item: any, defaultCat: string): string => {
    if (item.type) return String(item.type);
    if (item.category) return String(item.category);
    if (item.class) return String(item.class);
    return defaultCat;
  };

  const sortItems = useCallback(<T extends Record<string, any>>(items: T[], categoryName: string): T[] => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        comparison = nameA.localeCompare(nameB);
      } else if (sortBy === 'cost') {
        const costA = parseItemCost(a.cost);
        const costB = parseItemCost(b.cost);
        comparison = costA - costB;
      } else if (sortBy === 'sourceBook') {
        const srcA = (a.sourceBook || 'core').toLowerCase();
        const srcB = (b.sourceBook || 'core').toLowerCase();
        comparison = srcA.localeCompare(srcB);
      } else if (sortBy === 'category') {
        const catA = getItemCategoryName(a, categoryName).toLowerCase();
        const catB = getItemCategoryName(b, categoryName).toLowerCase();
        comparison = catA.localeCompare(catB);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sortBy, sortDirection]);

  const handleHeaderSortClick = (field: 'name' | 'cost' | 'sourceBook' | 'category') => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const filteredWeapons = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'weapons') return [];
    const q = searchQuery.toLowerCase();
    const list = bookFilteredItems.weapons.filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.skill?.toLowerCase().includes(q) ||
      item.notes?.toLowerCase().includes(q)
    );
    return sortItems(list, 'Arma');
  }, [searchQuery, selectedCategory, bookFilteredItems, sortItems]);

  const filteredArmor = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'armor') return [];
    const q = searchQuery.toLowerCase();
    const list = bookFilteredItems.armor.filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
    return sortItems(list, 'Blindaje');
  }, [searchQuery, selectedCategory, bookFilteredItems, sortItems]);

  const filteredCyberware = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'cyberware') return [];
    const q = searchQuery.toLowerCase();
    const list = bookFilteredItems.cyberware.filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
    return sortItems(list, 'Ciberware');
  }, [searchQuery, selectedCategory, bookFilteredItems, sortItems]);

  const filteredPrograms = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'programs') return [];
    const q = searchQuery.toLowerCase();
    const list = bookFilteredItems.programs.filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.class?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
    return sortItems(list, 'Programa');
  }, [searchQuery, selectedCategory, bookFilteredItems, sortItems]);

  const filteredAmmo = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'ammunition') return [];
    const q = searchQuery.toLowerCase();
    const list = bookFilteredItems.ammunition.filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
    return sortItems(list, 'Munición');
  }, [searchQuery, selectedCategory, bookFilteredItems, sortItems]);

  const filteredAttachments = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'attachments') return [];
    const q = searchQuery.toLowerCase();
    const list = bookFilteredItems.attachments.filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
    return sortItems(list, 'Accesorio');
  }, [searchQuery, selectedCategory, bookFilteredItems, sortItems]);

  const filteredDrugs = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'drugs') return [];
    const q = searchQuery.toLowerCase();
    const list = bookFilteredItems.drugs.filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.primaryEffect?.toLowerCase().includes(q) ||
      item.secondaryEffect?.toLowerCase().includes(q)
    );
    return sortItems(list, 'Droga');
  }, [searchQuery, selectedCategory, bookFilteredItems, sortItems]);

  const filteredGear = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'gear') return [];
    const q = searchQuery.toLowerCase();
    const list = bookFilteredItems.gear.filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
    return sortItems(list, 'Equipo');
  }, [searchQuery, selectedCategory, bookFilteredItems, sortItems]);

  const totalResults = 
    filteredWeapons.length + 
    filteredArmor.length + 
    filteredCyberware.length + 
    filteredPrograms.length + 
    filteredAmmo.length + 
    filteredAttachments.length + 
    filteredDrugs.length + 
    filteredGear.length;

  // Filter for Expansion Rule Systems
  const filteredRuleSystems = useMemo(() => {
    const q = systemSearchQuery.toLowerCase().trim();
    return EXPANSION_RULE_SYSTEMS.filter((sys) => {
      if (systemSourceFilter !== 'all' && sys.sourceBook !== systemSourceFilter) {
        return false;
      }
      if (!q) return true;
      return (
        sys.title.toLowerCase().includes(q) ||
        sys.subtitle.toLowerCase().includes(q) ||
        sys.introDescription.toLowerCase().includes(q) ||
        sys.categoryBadge.toLowerCase().includes(q) ||
        sys.howItWorksSteps.some((s) => s.toLowerCase().includes(q)) ||
        sys.keyBenefits.some((b) => b.toLowerCase().includes(q))
      );
    });
  }, [systemSearchQuery, systemSourceFilter]);

  const activeBookMeta = useMemo(() => {
    return SOURCEBOOKS_CATALOG.find((b) => b.id === selectedBookFilter) || SOURCEBOOKS_CATALOG[0];
  }, [selectedBookFilter]);

  /* Helper to render rich mechanical details */
  const renderItemDetails = (item: any, category: CompendiumCategory) => {
    if (category === 'weapons') {
      const isMelee = item.type === 'Melee' || !item.standardMag;
      const profileKey = getWeaponProfileKey(item.name, item.type);
      const profile = profileKey ? WEAPON_RANGE_PROFILES[profileKey] : null;
      const autofireRules = getAutofireRulesSummary(item as WeaponItem);
      const weaponInfo = getWeaponClassAndRebuildInfo(item);

      // Sweet spots
      let minDv: number | null = null;
      if (profile?.dvs) {
        let currentMin = 999;
        for (const val of Object.values(profile.dvs)) {
          if (val !== null && val < currentMin) currentMin = val;
        }
        if (currentMin !== 999) minDv = currentMin;
      }

      let minAutofireDv: number | null = null;
      if (profile?.autofireDvs) {
        let currentMin = 999;
        for (const val of Object.values(profile.autofireDvs)) {
          if (val !== null && val < currentMin) currentMin = val;
        }
        if (currentMin !== 999) minAutofireDv = currentMin;
      }

      const equippedCount = activeChar.equippedWeapons.filter((w) => w.id === item.id).length;
      const isEquipped = equippedCount > 0;

      return (
        <div className="space-y-2.5 font-mono-code text-xs">
          {/* Clasificación de Subtipo & Rebuild 2077 */}
          <div className="flex items-center gap-2 flex-wrap bg-[#0e111a] p-2 rounded-xs border border-[#1e2538]">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Clasificación:</span>
            <WeaponClassTooltip weaponInfo={weaponInfo} notes={item.notes}>
              <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-bold hover:border-cyan-400">
                {weaponInfo.weaponClass}
              </span>
            </WeaponClassTooltip>
            {weaponInfo.rebuildBadge && (
              <WeaponClassTooltip weaponInfo={weaponInfo} notes={item.notes}>
                <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold hover:border-amber-400">
                  {weaponInfo.rebuildBadge}
                </span>
              </WeaponClassTooltip>
            )}
            <span className="text-[10px] text-slate-400">
              Skill: <strong className="text-white">{weaponInfo.skillDisplayName}</strong>
            </span>
          </div>

          {/* Explicación de Regla de Subtipo / Rebuild */}
          <div className="text-[10px] text-slate-300 bg-[#0a0d14] p-2 rounded-xs border border-[#1a2133] leading-relaxed">
            <p>{weaponInfo.weaponClassTooltip}</p>
            {weaponInfo.rebuildTooltip && (
              <p className="mt-1 pt-1 border-t border-[#1a2133] text-amber-300/90">
                <strong>Regla Especial 2077:</strong> {weaponInfo.rebuildTooltip}
              </p>
            )}
          </div>

          {/* Notes / Description */}
          {item.notes && (
            <p className="text-[#cbd5e1] text-[11px] leading-relaxed bg-[#0b0e17] p-2 rounded-xs border border-[#1e2337]">
              {item.notes}
            </p>
          )}

          {/* Compatibilidad de Munición Táctica (solo a distancia) */}
          {!isMelee && (
            <div className="bg-[#0b0e17] border border-[#262c3e] rounded-xs p-2 space-y-1.5">
              <span className="font-bold text-[#f59e0b] text-[10px] uppercase block">
                ⚡ Compatibilidad de Munición Táctica:
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {QUICK_AMMO_TYPES.map((ammo) => (
                  <AmmoHoverTooltip key={ammo} ammoIdOrName={ammo}>
                    <span className="text-[8.5px] font-mono-code px-1.5 py-0.5 rounded bg-[#131622] text-amber-300/90 border border-[#262d40] hover:border-amber-500/60 cursor-help">
                      {ammo}
                    </span>
                  </AmmoHoverTooltip>
                ))}
              </div>
            </div>
          )}

          {/* MELEE MECHANICS */}
          {isMelee ? (
            <div className="bg-[#f43f5e]/10 border border-[#f43f5e]/30 rounded-xs p-2 text-[10px] space-y-1">
              <div className="font-bold text-[#f43f5e] flex items-center gap-1.5">
                <span>⚔️ REGLA CANÓNICA: ATAQUE CUERPO A CUERPO (MELEE)</span>
              </div>
              <p className="text-[#cbd5e1] leading-relaxed">
                Los ataques con armas cuerpo a cuerpo <strong>ignoran el 50% del SP (blindaje)</strong> del defensor (redondeado hacia arriba). No sufren penalizaciones ni tiradas de alcance (rango melé 0-2 metros).
              </p>
              <div className="flex flex-wrap gap-2 text-[9px] text-[#94a3b8] pt-0.5">
                <span>Habilidad: <strong className="text-[#f1f5f9]">{item.skill}</strong></span>
                <span>•</span>
                <span>Manos: <strong className="text-[#f1f5f9]">{item.hands}H</strong></span>
                <span>•</span>
                <span>Ocultable: <strong className="text-[#f1f5f9]">{item.concealable ? 'Sí' : 'No'}</strong></span>
              </div>
            </div>
          ) : (
            <>
              {/* RANGED DV TABLE */}
              {profile && (
                <div className="bg-[#0b0e17] border border-[#262c3e] rounded-xs p-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#38bdf8] flex items-center gap-1">
                      <Crosshair className="w-3 h-3" /> TABLA DE ALCANCE Y DIFICULTADES (DV)
                    </span>
                    <span className="text-[9px] text-[#f59e0b] font-bold">
                      ★ = Sweet Spot (Distancia Óptima)
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center text-[10px] border-collapse">
                      <thead>
                        <tr className="text-[#64748b] border-b border-[#1e2337]">
                          <th className="py-1 px-1.5 text-left text-[9px] text-[#94a3b8]">Modo</th>
                          {RANGE_BRACKETS.map((b) => (
                            <th key={b.range} className="py-1 px-1 text-[9px] whitespace-nowrap">{b.range}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#1e2337]/60 text-[#cbd5e1]">
                          <td className="py-1 px-1.5 text-left font-bold text-[#94a3b8] text-[9px]">Tiro Único</td>
                          {RANGE_BRACKETS.map((b) => {
                            const dv = profile.dvs[b.range] ?? null;
                            const isSweet = dv !== null && dv === minDv;
                            return (
                              <td 
                                key={b.range} 
                                className={`py-1 px-1 ${
                                  isSweet 
                                    ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-bold border border-[#38bdf8]/40 rounded-xs' 
                                    : dv !== null ? 'text-[#cbd5e1]' : 'text-[#475569]'
                                }`}
                              >
                                {dv !== null ? (isSweet ? `${dv} ★` : dv) : '—'}
                              </td>
                            );
                          })}
                        </tr>
                        {profile.autofireDvs && (
                          <tr className="text-[#f59e0b]">
                            <td className="py-1 px-1.5 text-left font-bold text-[#f59e0b] text-[9px]">Autofire</td>
                            {RANGE_BRACKETS.map((b) => {
                              const dv = profile.autofireDvs?.[b.range] ?? null;
                              const isSweet = dv !== null && dv === minAutofireDv;
                              return (
                                <td 
                                  key={b.range} 
                                  className={`py-1 px-1 ${
                                    isSweet 
                                      ? 'bg-[#f59e0b]/25 text-[#f59e0b] font-bold border border-[#f59e0b]/50 rounded-xs' 
                                      : dv !== null ? 'text-[#f59e0b]' : 'text-[#475569]'
                                  }`}
                                >
                                  {dv !== null ? (isSweet ? `${dv} ★` : dv) : '—'}
                                </td>
                              );
                            })}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* AUTOFIRE SUMMARY */}
              {autofireRules.supportsAutofire && (
                <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xs p-2 text-[10px] space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#f59e0b]">
                    <span>🔥 REGLAS DE FUEGO AUTOMÁTICO</span>
                    <span className="bg-[#f59e0b]/20 px-1.5 py-0.2 rounded-xs border border-[#f59e0b]/40">
                      Máx Mult: x{autofireRules.maxMultiplier}
                    </span>
                  </div>
                  <p className="text-[#cbd5e1] leading-relaxed">
                    {autofireRules.damageRule}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[9px] text-[#94a3b8] pt-0.5">
                    <span>Consumo: <strong className="text-[#f1f5f9]">10 balas</strong></span>
                    <span>•</span>
                    <span>Tirada: <strong className="text-[#f1f5f9]">REF + Autofire (x2) + 1d10</strong></span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* DUAL ACQUISITION BUTTONS */}
          <div className="pt-2 border-t border-[#1e2337] flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] text-[#64748b]">
              Estado: <strong className={isEquipped ? 'text-[#10b981]' : 'text-[#94a3b8]'}>{isEquipped ? `Equipada (${equippedCount})` : 'No equipada'}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcquire(item.id, item.name, item.cost, 'buy', () => equipWeaponFromCatalog(item as WeaponItem));
                }}
                className="px-2.5 py-1 bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                title={`Comprar por ${item.cost} €$ y equipar`}
              >
                💳 COMPRAR (-{item.cost} €$)
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcquire(item.id, item.name, item.cost, 'loot', () => equipWeaponFromCatalog(item as WeaponItem));
                }}
                className="px-2.5 py-1 bg-[#38bdf8]/20 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                title="Obtener gratis como botín / loot"
              >
                🎁 GRATIS / LOOT (0 €$)
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (category === 'armor') {
      const isHeadEquipped = activeChar.headArmor.name.includes(item.name);
      const isBodyEquipped = activeChar.bodyArmor.name.includes(item.name);

      return (
        <div className="space-y-2.5 font-mono-code text-xs">
          <p className="text-[#cbd5e1] text-[11px] leading-relaxed bg-[#0b0e17] p-2 rounded-xs border border-[#1e2337]">
            {item.description}
          </p>
          <div className="bg-[#38bdf8]/10 border border-[#38bdf8]/30 rounded-xs p-2 text-[10px] space-y-1">
            <div className="flex items-center justify-between text-[#38bdf8] font-bold">
              <span>🛡️ ESPECIFICACIONES DE BLINDAJE</span>
              <span>SP {item.sp}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[9px] text-[#94a3b8]">
              <span>Penalización: <strong className={item.penalty < 0 ? 'text-[#f43f5e]' : 'text-[#10b981]'}>{item.penalty} a REF/DEX/MOVE</strong></span>
              <span>•</span>
              <span>Nivel de costo: <strong className="text-[#f1f5f9]">{item.costTier}</strong></span>
              <span>•</span>
              <span>Equipado en: <strong className="text-[#38bdf8]">{isHeadEquipped && isBodyEquipped ? 'Cabeza y Cuerpo' : isHeadEquipped ? 'Cabeza' : isBodyEquipped ? 'Cuerpo' : 'Ninguno'}</strong></span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e2337] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className="text-[#10b981] font-bold text-[10px]">💳 COMPRAR (-{item.cost} €$):</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcquire(item.id, `${item.name} (Cabeza)`, item.cost, 'buy', () => equipArmorFromCatalog(item as ArmorItem, 'head'));
                  }}
                  className="px-2 py-0.5 bg-[#10b981]/15 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] rounded-xs text-[9px] font-bold transition-all cursor-pointer"
                >
                  Cabeza
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcquire(item.id, `${item.name} (Cuerpo)`, item.cost, 'buy', () => equipArmorFromCatalog(item as ArmorItem, 'body'));
                  }}
                  className="px-2 py-0.5 bg-[#10b981]/15 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] rounded-xs text-[9px] font-bold transition-all cursor-pointer"
                >
                  Cuerpo
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcquire(item.id, `${item.name} (Ambos)`, item.cost, 'buy', () => equipArmorFromCatalog(item as ArmorItem, 'both'));
                  }}
                  className="px-2 py-0.5 bg-[#10b981]/25 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] rounded-xs text-[9px] font-bold transition-all cursor-pointer"
                >
                  Ambos
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className="text-[#38bdf8] font-bold text-[10px]">🎁 GRATIS / LOOT (0 €$):</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcquire(item.id, `${item.name} (Cabeza)`, item.cost, 'loot', () => equipArmorFromCatalog(item as ArmorItem, 'head'));
                  }}
                  className="px-2 py-0.5 bg-[#38bdf8]/15 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[9px] font-bold transition-all cursor-pointer"
                >
                  Cabeza
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcquire(item.id, `${item.name} (Cuerpo)`, item.cost, 'loot', () => equipArmorFromCatalog(item as ArmorItem, 'body'));
                  }}
                  className="px-2 py-0.5 bg-[#38bdf8]/15 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[9px] font-bold transition-all cursor-pointer"
                >
                  Cuerpo
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcquire(item.id, `${item.name} (Ambos)`, item.cost, 'loot', () => equipArmorFromCatalog(item as ArmorItem, 'both'));
                  }}
                  className="px-2 py-0.5 bg-[#38bdf8]/25 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[9px] font-bold transition-all cursor-pointer"
                >
                  Ambos
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (category === 'cyberware') {
      const installCount = countInstalls(activeChar.installedCyberwareIds, item.id);
      const isInstalled = installCount > 0;
      const anotherCheck = canInstallAnother(activeChar.installedCyberwareIds, item.id, activeChar.stats);

      return (
        <div className="space-y-2.5 font-mono-code text-xs">
          <p className="text-[#cbd5e1] text-[11px] leading-relaxed bg-[#0b0e17] p-2 rounded-xs border border-[#1e2337]">
            {item.description}
          </p>
          <div className="bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-xs p-2 text-[10px] space-y-1.5">
            <div className="flex items-center justify-between text-[#a855f7] font-bold">
              <span>🦾 INSTALACIÓN & HUMANIDAD</span>
              <span className="bg-[#a855f7]/20 px-1.5 py-0.2 rounded-xs border border-[#a855f7]/40">
                Pérdida HL: {item.humanityLoss}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-[9px] text-[#94a3b8] pt-0.5">
              <span>Tipo: <CyberCategoryTooltip category={item.type || 'Cyberware'}><strong className="text-[#a855f7] bg-purple-950/40 px-1 py-0.5 rounded border border-purple-500/30 cursor-help hover:border-purple-400">{item.type || 'Cyberware'}</strong></CyberCategoryTooltip></span>
              <span>•</span>
              <span>
                Instalación requerida: <strong className="text-[#a855f7]">{item.install}</strong> (
                {item.install === 'Mall' ? 'Clínica ambulatoria de centro comercial' :
                 item.install === 'Clinic' ? 'Clínica médica especializada' :
                 'Hospital quirúrgico mayor'}
                )
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e2337] flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] text-[#64748b]">
              Estado: <strong className={isInstalled ? 'text-[#10b981]' : 'text-[#94a3b8]'}>{isInstalled ? (installCount > 1 ? `Instalado ×${installCount}` : 'Instalado') : 'No instalado'}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              {isInstalled ? (
                <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCyberwareInstall(item.id);
                    showFeedback(item.id, 'Ciberware desinstalado');
                  }}
                  className="px-2.5 py-1 bg-[#f43f5e]/20 hover:bg-[#f43f5e] border border-[#f43f5e] text-[#f43f5e] hover:text-white rounded-xs text-[10px] font-bold transition-all cursor-pointer active:scale-95"
                >
                  Desinstalar Ciberware
                </button>
                <button
                  disabled={!anotherCheck.ok}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcquire(item.id, item.name, item.cost, spendMoneyMode ? 'buy' : 'loot', () => {
                      installCyberwareAdvanced({
                        cyberwareId: item.id,
                        cyberwareName: item.name,
                        humanityLossAmount: item.humanityLoss ? parseHumanityLossAverage(String(item.humanityLoss)) : 7,
                        cost: 0,
                        spendMoney: false
                      });
                    });
                  }}
                  className="px-2.5 py-1 bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  title={anotherCheck.ok ? 'Instalar otra copia' : anotherCheck.reason}
                >
                  Instalar otro
                </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcquire(item.id, item.name, item.cost, 'buy', () => toggleCyberwareInstall(item.id));
                    }}
                    className="px-2.5 py-1 bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    title={`Comprar por ${item.cost} €$ e instalar`}
                  >
                    💳 COMPRAR (-{item.cost} €$)
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcquire(item.id, item.name, item.cost, 'loot', () => toggleCyberwareInstall(item.id));
                    }}
                    className="px-2.5 py-1 bg-[#38bdf8]/20 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    title="Instalar gratis (Loot / 0 €$)"
                  >
                    🎁 GRATIS / LOOT (0 €$)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (category === 'drugs') {
      return (
        <div className="space-y-2.5 font-mono-code text-xs">
          <div className="bg-[#ec4899]/10 border border-[#ec4899]/30 rounded-xs p-2 text-[10px] space-y-1.5">
            <div className="flex items-center justify-between text-[#ec4899] font-bold">
              <span>💊 EFECTOS CANÓNICOS & ADICCIÓN</span>
              <span className="bg-[#ec4899]/20 px-1.5 py-0.2 rounded-xs border border-[#ec4899]/40">
                Duración: {item.duration}
              </span>
            </div>
            <div className="space-y-1 text-[#cbd5e1]">
              <p>
                <strong className="text-[#10b981]">Efecto Primario:</strong> {item.primaryEffect}
              </p>
              {item.secondaryEffect && (
                <p>
                  <strong className="text-[#f43f5e]">Efecto Secundario / Resaca:</strong> {item.secondaryEffect}
                </p>
              )}
            </div>
            {item.addictionDv > 0 && (
              <div className="bg-[#0b0e17] border border-[#ec4899]/30 p-1.5 rounded-xs text-[9px] text-[#ec4899]">
                ⚠️ <strong>Prueba de Adicción:</strong> Tirar <code>WILL + Resist Torture/Drugs + 1d10</code> contra <strong>DV {item.addictionDv}</strong>. Si se falla, el personaje sufre dependencia secundaria.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#1e2337] flex flex-wrap items-center justify-end gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAcquire(item.id, item.name, item.cost, 'buy', () => {});
              }}
              className="px-2.5 py-1 bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              title={`Comprar dosis por ${item.cost} €$`}
            >
              💳 COMPRAR (-{item.cost} €$)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAcquire(item.id, item.name, item.cost, 'loot', () => {});
              }}
              className="px-2.5 py-1 bg-[#38bdf8]/20 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              title="Obtener dosis gratis (Loot / 0 €$)"
            >
              🎁 GRATIS / LOOT (0 €$)
            </button>
          </div>
        </div>
      );
    }

    if (category === 'ammunition') {
      return (
        <div className="space-y-2.5 font-mono-code text-xs">
          <p className="text-[#cbd5e1] text-[11px] leading-relaxed bg-[#0b0e17] p-2 rounded-xs border border-[#1e2337]">
            {item.description}
          </p>

          <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-xs p-2 text-[10px] space-y-1.5">
            <div className="flex items-center justify-between text-[#fbbf24] font-bold">
              <span>🎯 BALÍSTICA & COMPATIBILIDAD CANÓNICA</span>
              <span className="bg-[#fbbf24]/20 px-1.5 py-0.2 rounded-xs border border-[#fbbf24]/40">
                {item.costTier || 'Básico'}
              </span>
            </div>
            <div>
              <AmmoHoverTooltip ammoIdOrName={item.name}>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#fef08a] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/40 cursor-help hover:border-amber-400">
                  <span>ℹ️ REGLAS COMPLETAS DE MUNICIÓN: {item.name}</span>
                </span>
              </AmmoHoverTooltip>
            </div>
            <p className="text-[9px] text-[#94a3b8] leading-tight">
              Pasa el cursor sobre la insignia superior para consultar las reglas completas de daño, efectos de estado, blindaje y armas compatibles.
            </p>
          </div>

          <div className="pt-2 border-t border-[#1e2337] flex flex-wrap items-center justify-end gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAcquire(item.id, item.name, item.cost, 'buy', () => {});
              }}
              className="px-2.5 py-1 bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              title={`Comprar por ${item.cost} €$`}
            >
              💳 COMPRAR (-{item.cost} €$)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAcquire(item.id, item.name, item.cost, 'loot', () => {});
              }}
              className="px-2.5 py-1 bg-[#38bdf8]/20 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              title="Obtener gratis (Loot / 0 €$)"
            >
              🎁 GRATIS / LOOT (0 €$)
            </button>
          </div>
        </div>
      );
    }

    // Default for programs, attachments, gear
    return (
      <div className="space-y-2.5 font-mono-code text-xs">
        <p className="text-[#cbd5e1] text-[11px] leading-relaxed bg-[#0b0e17] p-2 rounded-xs border border-[#1e2337]">
          {item.description}
        </p>

        {category === 'programs' && (
          <div className="flex flex-wrap gap-2 text-[10px] text-[#94a3b8] bg-[#10b981]/10 border border-[#10b981]/30 p-2 rounded-xs">
            <span>Clase: <strong className="text-[#10b981]">{item.class}</strong></span>
            {item.atk !== undefined && <span>• ATK: <strong className="text-[#f43f5e]">{item.atk}</strong></span>}
            {item.def !== undefined && <span>• DEF: <strong className="text-[#38bdf8]">{item.def}</strong></span>}
            {item.rez !== undefined && <span>• REZ: <strong className="text-[#10b981]">{item.rez}</strong></span>}
          </div>
        )}

        {category === 'attachments' && (
          <div className="text-[10px] text-[#94a3b8] bg-[#38bdf8]/10 border border-[#38bdf8]/30 p-2 rounded-xs">
            Ranuras requeridas: <strong className="text-[#38bdf8]">{item.slots}</strong>
          </div>
        )}

        <div className="pt-2 border-t border-[#1e2337] flex flex-wrap items-center justify-end gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAcquire(item.id, item.name, item.cost, 'buy', () => {});
            }}
            className="px-2.5 py-1 bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            title={`Comprar por ${item.cost} €$`}
          >
            💳 COMPRAR (-{item.cost} €$)
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAcquire(item.id, item.name, item.cost, 'loot', () => {});
            }}
            className="px-2.5 py-1 bg-[#38bdf8]/20 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            title="Obtener gratis (Loot / 0 €$)"
          >
            🎁 GRATIS / LOOT (0 €$)
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* =====================================================================
          CONMUTADOR PRINCIPAL DESTACADO: ITEMS (368) vs SISTEMAS Y REGLAS NUEVAS
      ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#0c0f1a] p-1.5 rounded-xs border border-[#1e2337] shadow-lg">
        <button
          onClick={() => setCompendiumMode('items')}
          className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xs text-xs font-mono-code font-bold transition-all cursor-pointer chamfer-btn ${
            compendiumMode === 'items'
              ? 'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8] shadow-md shadow-cyan-950/60'
              : 'bg-[#12141f] text-slate-400 hover:text-slate-200 border border-[#20273a]'
          }`}
        >
          <Package className="w-4 h-4 text-[#38bdf8]" />
          <span>📦 CATÁLOGO MAESTRO DE ÍTEMS ({allCatalogItems.length} ÍTEMS POR MANUAL)</span>
        </button>
        <button
          onClick={() => setCompendiumMode('systems')}
          className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xs text-xs font-mono-code font-bold transition-all cursor-pointer chamfer-btn ${
            compendiumMode === 'systems'
              ? 'bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7] shadow-md shadow-purple-950/60'
              : 'bg-[#12141f] text-slate-400 hover:text-slate-200 border border-[#20273a]'
          }`}
        >
          <Cpu className="w-4 h-4 text-[#c084fc]" />
          <span>⚙️ COMPENDIO DE SISTEMAS Y REGLAS NUEVAS (FBC / 2077 / DLCs)</span>
        </button>
      </div>

      {compendiumMode === 'items' ? (
        <>
          {/* BARRA DE MANUALES DE ORIGEN CON CONTADORES REALES */}
          <div className="bg-[#12141f] border border-[#262c3e] p-2.5 rounded-xs chamfer-card space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-400 font-mono-code uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Filtrar por Manual de Origen:
              </span>
              <span className="text-[10px] text-cyan-400 font-mono-code">
                {bookItemCounts[selectedBookFilter] ?? 0} ítems filtrados
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {SOURCEBOOKS_CATALOG.map((book) => {
                const isSelected = selectedBookFilter === book.id;
                const count = bookItemCounts[book.id] ?? 0;
                return (
                  <button
                    key={book.id}
                    onClick={() => setSelectedBookFilter(book.id as SourceBookId | 'all')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-mono-code transition-all cursor-pointer chamfer-btn ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-xs'
                        : 'bg-[#181b2a] border-[#262c3e] text-slate-400 hover:text-white hover:border-slate-500'
                    } border`}
                  >
                    <span className="text-[10px]">{book.shortBadge}</span>
                    <span className="text-[10px] px-1 py-0.2 rounded-xs bg-[#0b0e17] text-slate-300 font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PANEL INTRODUCTORIO DEL MANUAL SELECCIONADO (COLAPSABLE) */}
          <div className="bg-[#0f121d] border border-cyan-500/30 rounded-xs chamfer-card p-3 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-[#1c2235] pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold border"
                  style={{
                    backgroundColor: `${activeBookMeta.accentColor}20`,
                    borderColor: `${activeBookMeta.accentColor}60`,
                    color: activeBookMeta.accentColor
                  }}
                >
                  {activeBookMeta.shortBadge}
                </span>
                <h3 className="text-xs font-bold text-white font-tech uppercase tracking-wide">
                  {activeBookMeta.title}
                </h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-slate-800 text-slate-300 font-mono-code">
                  Era: {activeBookMeta.era.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setIsBookSummaryExpanded(!isBookSummaryExpanded)}
                className="text-[10px] font-mono-code text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {isBookSummaryExpanded ? (
                  <>
                    <span>[ ▴ Plegar Sinopsis ]</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>[ ▾ Desplegar Sinopsis ]</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {isBookSummaryExpanded && (
              <div className="space-y-2 text-xs font-mono-code text-slate-300">
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {activeBookMeta.whatItBringsSummary}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  <div className="bg-[#141826] p-2 rounded-xs border border-[#222a40] space-y-1">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
                      ★ Aspectos Clave del Manual:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-400">
                      {activeBookMeta.keyHighlights.map((hl, idx) => (
                        <li key={idx}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#141826] p-2 rounded-xs border border-[#222a40] space-y-1">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                      ⚡ Mecánicas & Sistemas Aportados:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-400">
                      {activeBookMeta.mechanicsIntroduced.map((mec, idx) => (
                        <li key={idx}>{mec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Bar with Search, Category Filter, and View Mode Toggle */}
          <div className="bg-[#12141f] border border-[#262c3e] p-3 rounded-xs chamfer-card space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en el catálogo..."
              className="w-full bg-[#181b2a] border border-[#262c3e] pl-8 pr-7 py-1.5 text-xs text-[#f1f5f9] rounded-xs focus:outline-hidden focus:border-[#38bdf8] font-mono-code"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#64748b] hover:text-[#f1f5f9]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Balance & Acquisition Mode Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Balance indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xs font-mono-code">
              <Coins className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-[10px] text-[#64748b] uppercase">Saldo:</span>
              <span className="text-xs font-bold text-[#10b981]">{activeChar.eurodollars ?? 0} €$</span>
            </div>

            {/* Spend Money vs Loot Mode Switch */}
            <div className="flex items-center gap-1 bg-[#181b2a] border border-[#262c3e] p-0.5 rounded-xs">
              <button
                onClick={() => setSpendMoneyMode(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-mono-code transition-colors cursor-pointer ${
                  spendMoneyMode
                    ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981] font-bold'
                    : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                }`}
                title="Modo Compra: Descuenta eurodólares (€$) de la ficha activa"
              >
                <span>💳 COMPRA (-€$)</span>
              </button>
              <button
                onClick={() => setSpendMoneyMode(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-mono-code transition-colors cursor-pointer ${
                  !spendMoneyMode
                    ? 'bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8] font-bold'
                    : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                }`}
                title="Modo Botín/Loot: Obtén o equipa ítems gratis (0 €$)"
              >
                <span>🎁 LOOT (0 €$)</span>
              </button>
            </div>
          </div>

          {/* Sorting Controls */}
          <div className="flex items-center gap-1.5 bg-[#181b2a] border border-[#262c3e] px-2 py-1 rounded-xs">
            <span className="text-[10px] text-[#64748b] font-mono-code font-bold uppercase whitespace-nowrap">
              Ordenar por:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0f111a] border border-[#262c3e] text-white text-[10px] font-mono-code rounded-xs px-1.5 py-0.5 focus:outline-hidden focus:border-[#38bdf8] cursor-pointer"
            >
              <option value="name">Nombre</option>
              <option value="cost">Costo €$</option>
              <option value="sourceBook">Manual / Fuente</option>
              <option value="category">Categoría / Tipo</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-1.5 py-0.5 bg-[#0f111a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8] text-[10px] font-mono-code font-bold rounded-xs transition-colors cursor-pointer"
              title={sortDirection === 'asc' ? 'Ascendente (A→Z / Menor a Mayor)' : 'Descendente (Z→A / Mayor a Menor)'}
            >
              {sortDirection === 'asc' ? '▲ ASC' : '▼ DESC'}
            </button>
          </div>

          {/* View Mode Toggle: Compact Cards vs Dense Table */}
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-mono-code text-[#64748b] hidden sm:block">
              <span className="text-[#38bdf8]">{totalResults} ítems</span>
            </div>

            <div className="flex items-center gap-1 bg-[#181b2a] border border-[#262c3e] p-0.5 rounded-xs">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-mono-code transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8] font-bold'
                    : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                }`}
                title="Vista en tarjetas compactas"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>⊞ TARJETAS</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-mono-code transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8] font-bold'
                    : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                }`}
                title="Vista en tabla densa estilo COMP/CON"
              >
                <List className="w-3.5 h-3.5" />
                <span>☰ TABLA DENSA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-[#1c2030]">
          {categoriesConfig.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-mono-code transition-colors cursor-pointer chamfer-btn ${
                  isSelected
                    ? 'bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8] font-bold'
                    : 'bg-[#181b2a] border border-[#262c3e] text-[#94a3b8] hover:text-[#f1f5f9] hover:border-[#38bdf8]/40'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span className="text-[10px] px-1 py-0.2 rounded-xs bg-[#0f111a] text-[#64748b]">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FEEDBACK POPUP TOAST */}
      {feedback && (
        <div className={`fixed bottom-4 right-4 z-50 font-mono-code font-bold text-xs px-3.5 py-2 rounded-xs shadow-lg flex items-center gap-2 animate-bounce ${
          feedback.isError
            ? 'bg-[#f43f5e] text-white shadow-[#f43f5e]/30'
            : 'bg-[#10b981] text-[#0b0e17] shadow-[#10b981]/30'
        }`}>
          {feedback.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* RENDER MODE: COMPACT CARDS */}
      {viewMode === 'cards' ? (
        <div className="space-y-6">
          {/* WEAPONS */}
          {filteredWeapons.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#f43f5e] font-mono-code flex items-center gap-1.5 uppercase tracking-wider">
                <Crosshair className="w-3.5 h-3.5" /> Armas ({filteredWeapons.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredWeapons.map((weapon: any) => {
                  const equippedCount = activeChar.equippedWeapons.filter((w) => w.id === weapon.id).length;
                  const isEquipped = equippedCount > 0;
                  const isMelee = weapon.type === 'Melee' || !weapon.standardMag;
                  const isExpanded = expandedItemId === weapon.id;
                  const visualType = getVisualTypeForWeapon(weapon);

                  return (
                    <div
                      key={weapon.id}
                      onClick={() => toggleExpand(weapon.id)}
                      className={`group bg-[#12141f] border rounded-xs chamfer-card space-y-2 cursor-pointer select-none p-3.5 transition-all hover:border-cyan-400/70 hover:bg-slate-900/95 ${
                        isExpanded ? 'border-cyan-400/80 bg-slate-900/90 shadow-lg shadow-cyan-950/30' : 'border-[#262c3e]'
                      }`}
                    >
                      {/* Header (~26px) */}
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <ItemVisualPlaceholder type={visualType} size="sm" className="w-6 h-6 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={weapon.name}>
                                {weapon.name}
                              </h4>
                              {renderSourceBookBadge(weapon.sourceBook, weapon.sourcePage)}
                            </div>
                            <span className="text-[10px] text-[#f59e0b] font-mono-code">
                              {weapon.cost} eb
                            </span>
                          </div>
                        </div>

                        {/* Top-Right Quick Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcquire(
                              weapon.id,
                              weapon.name,
                              weapon.cost,
                              spendMoneyMode ? 'buy' : 'loot',
                              () => equipWeaponFromCatalog(weapon as WeaponItem)
                            );
                          }}
                          className={`px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn flex items-center gap-1 shrink-0 active:scale-95 ${
                            isEquipped
                              ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981] hover:bg-[#10b981]/30'
                              : spendMoneyMode
                                ? 'bg-[#10b981]/15 hover:bg-[#10b981] border border-[#10b981]/60 text-[#10b981] hover:text-[#0b0e17]'
                                : 'bg-[#f43f5e]/20 hover:bg-[#f43f5e] border border-[#f43f5e] text-[#f43f5e] hover:text-white'
                          }`}
                          title={spendMoneyMode ? `Comprar y equipar (-${weapon.cost} €$)` : 'Equipar gratis (Loot)'}
                        >
                          {isEquipped ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>{equippedCount > 1 ? `x${equippedCount}` : 'Equipada'}</span>
                              <span className="text-[9px] text-[#94a3b8] hover:text-white">+</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>{spendMoneyMode ? `💳 -${weapon.cost} eb` : '🎁 Equipar'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Stat Pills in 1 Single Horizontal Strip with Tooltips */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#f43f5e]/15 text-[#f43f5e] rounded-xs font-bold border border-[#f43f5e]/30">
                          {isMelee ? '⚔️' : '💥'} {weapon.damage}
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#94a3b8] rounded-xs border border-[#262c3e]">
                          <TacticalTooltip term="ROF">ROF {weapon.rof}</TacticalTooltip>
                        </span>
                        {!isMelee && (
                          <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#38bdf8] rounded-xs border border-[#262c3e]">
                            <TacticalTooltip term="MAG">MAG {weapon.standardMag}</TacticalTooltip>
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#94a3b8] rounded-xs border border-[#262c3e]">
                          <TacticalTooltip term="HANDS">{weapon.hands}H</TacticalTooltip>
                        </span>
                        {weapon.altFireModes?.includes('Autofire') && (
                          <span className="px-1.5 py-0.2 bg-[#f59e0b]/15 text-[#f59e0b] rounded-xs border border-[#f59e0b]/30 font-bold">
                            🔥 AUTO
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#64748b] rounded-xs border border-[#262c3e]">
                          {weapon.skill}
                        </span>
                      </div>

                      {/* Wide Bottom Interactive Bar */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(weapon.id);
                        }}
                        className="w-full py-1.5 mt-2 bg-slate-900/80 border-t border-slate-800 group-hover:border-cyan-500/40 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-b-xs"
                      >
                        {isExpanded ? (
                          <span>[ ▴ OCULTAR DETALLES ]</span>
                        ) : (
                          <span>[ ▾ VER DETALLES Y REGLAS DEL ÍTEM ]</span>
                        )}
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="pt-2.5 border-t border-[#262c3e] cursor-default select-text"
                        >
                          {renderItemDetails(weapon, 'weapons')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ARMOR */}
          {filteredArmor.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#38bdf8] font-mono-code flex items-center gap-1.5 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" /> Blindajes ({filteredArmor.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredArmor.map((armor: any) => {
                  const isHeadEquipped = activeChar.headArmor.name.includes(armor.name);
                  const isBodyEquipped = activeChar.bodyArmor.name.includes(armor.name);
                  const isExpanded = expandedItemId === armor.id;

                  return (
                    <div
                      key={armor.id}
                      onClick={() => toggleExpand(armor.id)}
                      className={`group bg-[#12141f] border rounded-xs chamfer-card space-y-2 cursor-pointer select-none p-3.5 transition-all hover:border-cyan-400/70 hover:bg-slate-900/95 ${
                        isExpanded ? 'border-cyan-400/80 bg-slate-900/90 shadow-lg shadow-cyan-950/30' : 'border-[#262c3e]'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={armor.name}>
                              {armor.name}
                            </h4>
                            {renderSourceBookBadge(armor.sourceBook, armor.sourcePage)}
                          </div>
                          <span className="text-[10px] text-[#f59e0b] font-mono-code">
                            {armor.cost} eb
                          </span>
                        </div>

                        {/* Quick Equip Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcquire(armor.id, `${armor.name} (Cabeza)`, armor.cost, spendMoneyMode ? 'buy' : 'loot', () => equipArmorFromCatalog(armor as ArmorItem, 'head'));
                            }}
                            className={`px-1.5 py-0.5 rounded-xs text-[9px] font-mono-code font-bold transition-all cursor-pointer ${
                              isHeadEquipped
                                ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981]'
                                : 'bg-[#181b2a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8]'
                            }`}
                            title="Equipar en Cabeza"
                          >
                            Cab
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcquire(armor.id, `${armor.name} (Cuerpo)`, armor.cost, spendMoneyMode ? 'buy' : 'loot', () => equipArmorFromCatalog(armor as ArmorItem, 'body'));
                            }}
                            className={`px-1.5 py-0.5 rounded-xs text-[9px] font-mono-code font-bold transition-all cursor-pointer ${
                              isBodyEquipped
                                ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981]'
                                : 'bg-[#181b2a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8]'
                            }`}
                            title="Equipar en Cuerpo"
                          >
                            Cuer
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcquire(armor.id, `${armor.name} (Ambos)`, armor.cost, spendMoneyMode ? 'buy' : 'loot', () => equipArmorFromCatalog(armor as ArmorItem, 'both'));
                            }}
                            className="px-1.5 py-0.5 bg-[#38bdf8]/20 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[9px] font-mono-code font-bold transition-all cursor-pointer active:scale-95"
                            title="Equipar en Cabeza y Cuerpo"
                          >
                            Ambos
                          </button>
                        </div>
                      </div>

                      {/* Stat Pills */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#38bdf8]/15 text-[#38bdf8] rounded-xs font-bold border border-[#38bdf8]/30">
                          <TacticalTooltip term="SP">SP {armor.sp}</TacticalTooltip>
                        </span>
                        <span className={`px-1.5 py-0.2 rounded-xs border ${armor.penalty < 0 ? 'bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/30 font-bold' : 'bg-[#181b2a] text-[#10b981] border-[#262c3e]'}`}>
                          Pen: {armor.penalty}
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#64748b] rounded-xs border border-[#262c3e]">
                          {armor.costTier}
                        </span>
                      </div>

                      {/* Wide Bottom Interactive Bar */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(armor.id);
                        }}
                        className="w-full py-1.5 mt-2 bg-slate-900/80 border-t border-slate-800 group-hover:border-cyan-500/40 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-b-xs"
                      >
                        {isExpanded ? (
                          <span>[ ▴ OCULTAR DETALLES ]</span>
                        ) : (
                          <span>[ ▾ VER DETALLES Y REGLAS DEL ÍTEM ]</span>
                        )}
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="pt-2.5 border-t border-[#262c3e] cursor-default select-text"
                        >
                          {renderItemDetails(armor, 'armor')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CYBERWARE */}
          {filteredCyberware.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#a855f7] font-mono-code flex items-center gap-1.5 uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" /> Ciberware ({filteredCyberware.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredCyberware.map((cyber: any) => {
                  const installCount = countInstalls(activeChar.installedCyberwareIds, cyber.id);
                  const isInstalled = installCount > 0;
                  const anotherCheck = canInstallAnother(activeChar.installedCyberwareIds, cyber.id, activeChar.stats);
                  const isExpanded = expandedItemId === cyber.id;

                  return (
                    <div
                      key={cyber.id}
                      onClick={() => toggleExpand(cyber.id)}
                      className={`group bg-[#12141f] border rounded-xs chamfer-card space-y-2 cursor-pointer select-none p-3.5 transition-all hover:border-cyan-400/70 hover:bg-slate-900/95 ${
                        isExpanded ? 'border-cyan-400/80 bg-slate-900/90 shadow-lg shadow-cyan-950/30' : 'border-[#262c3e]'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={cyber.name}>
                              {cyber.name}
                            </h4>
                            {renderSourceBookBadge(cyber.sourceBook, cyber.sourcePage)}
                          </div>
                          <span className="text-[10px] text-[#f59e0b] font-mono-code">
                            {cyber.cost} eb
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInstalled) {
                              toggleCyberwareInstall(cyber.id);
                              showFeedback(cyber.id, 'Ciberware desinstalado');
                            } else {
                              handleAcquire(cyber.id, cyber.name, cyber.cost, spendMoneyMode ? 'buy' : 'loot', () => toggleCyberwareInstall(cyber.id));
                            }
                          }}
                          className={`px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn shrink-0 active:scale-95 ${
                            isInstalled
                              ? 'bg-[#f43f5e]/20 hover:bg-[#f43f5e] border border-[#f43f5e] text-[#f43f5e] hover:text-white'
                              : spendMoneyMode
                                ? 'bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17]'
                                : 'bg-[#a855f7]/20 hover:bg-[#a855f7] border border-[#a855f7] text-[#a855f7] hover:text-white'
                          }`}
                        >
                          {isInstalled ? (installCount > 1 ? `Desinstalar ×${installCount}` : 'Desinstalar') : spendMoneyMode ? `💳 -${cyber.cost} eb` : '🎁 + Instalar'}
                        </button>
                        {isInstalled && (
                          <button
                            disabled={!anotherCheck.ok}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcquire(cyber.id, cyber.name, cyber.cost, spendMoneyMode ? 'buy' : 'loot', () => {
                                installCyberwareAdvanced({
                                  cyberwareId: cyber.id,
                                  cyberwareName: cyber.name,
                                  humanityLossAmount: cyber.humanityLoss ? parseHumanityLossAverage(String(cyber.humanityLoss)) : 7,
                                  cost: 0,
                                  spendMoney: false
                                });
                              });
                            }}
                            className="px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn shrink-0 active:scale-95 bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] disabled:opacity-40 disabled:cursor-not-allowed"
                            title={anotherCheck.ok ? 'Instalar otra copia' : anotherCheck.reason}
                          >
                            Instalar otro
                          </button>
                        )}
                        </div>
                      </div>

                      {/* Stat Pills */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono-code">
                        <CyberCategoryTooltip category={cyber.type || 'Cyberware'}>
                          <span className="px-1.5 py-0.2 bg-[#a855f7]/15 text-[#a855f7] rounded-xs font-bold border border-[#a855f7]/30 cursor-help hover:border-[#a855f7]">
                            {cyber.type}
                          </span>
                        </CyberCategoryTooltip>
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#f43f5e] rounded-xs border border-[#262c3e]">
                          <TacticalTooltip term="HL">HL: {cyber.humanityLoss}</TacticalTooltip>
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#64748b] rounded-xs border border-[#262c3e]">
                          {cyber.install}
                        </span>
                      </div>

                      {/* Wide Bottom Interactive Bar */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(cyber.id);
                        }}
                        className="w-full py-1.5 mt-2 bg-slate-900/80 border-t border-slate-800 group-hover:border-cyan-500/40 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-b-xs"
                      >
                        {isExpanded ? (
                          <span>[ ▴ OCULTAR DETALLES ]</span>
                        ) : (
                          <span>[ ▾ VER DETALLES Y REGLAS DEL ÍTEM ]</span>
                        )}
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="pt-2.5 border-t border-[#262c3e] cursor-default select-text"
                        >
                          {renderItemDetails(cyber, 'cyberware')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROGRAMS */}
          {filteredPrograms.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#10b981] font-mono-code flex items-center gap-1.5 uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" /> Programas & ICE ({filteredPrograms.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredPrograms.map((prog: any) => {
                  const isExpanded = expandedItemId === prog.id;
                  return (
                    <div
                      key={prog.id}
                      onClick={() => toggleExpand(prog.id)}
                      className={`group bg-[#12141f] border rounded-xs chamfer-card space-y-2 cursor-pointer select-none p-3.5 transition-all hover:border-cyan-400/70 hover:bg-slate-900/95 ${
                        isExpanded ? 'border-cyan-400/80 bg-slate-900/90 shadow-lg shadow-cyan-950/30' : 'border-[#262c3e]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={prog.name}>
                              {prog.name}
                            </h4>
                            {renderSourceBookBadge(prog.sourceBook, prog.sourcePage)}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcquire(prog.id, prog.name, prog.cost, spendMoneyMode ? 'buy' : 'loot', () => {});
                          }}
                          className="px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn shrink-0 active:scale-95 bg-[#181b2a] hover:bg-[#10b981]/20 border border-[#262c3e] hover:border-[#10b981] text-[#10b981]"
                        >
                          {spendMoneyMode ? `💳 -${prog.cost} eb` : '🎁 Obtener'}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#10b981]/15 text-[#10b981] rounded-xs font-bold border border-[#10b981]/30">
                          {prog.class}
                        </span>
                        {prog.atk !== undefined && (
                          <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#f43f5e] rounded-xs border border-[#262c3e]">
                            ATK {prog.atk}
                          </span>
                        )}
                        {prog.def !== undefined && (
                          <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#38bdf8] rounded-xs border border-[#262c3e]">
                            DEF {prog.def}
                          </span>
                        )}
                        {prog.rez !== undefined && (
                          <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#10b981] rounded-xs border border-[#262c3e]">
                            REZ {prog.rez}
                          </span>
                        )}
                      </div>

                      {/* Wide Bottom Interactive Bar */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(prog.id);
                        }}
                        className="w-full py-1.5 mt-2 bg-slate-900/80 border-t border-slate-800 group-hover:border-cyan-500/40 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-b-xs"
                      >
                        {isExpanded ? (
                          <span>[ ▴ OCULTAR DETALLES ]</span>
                        ) : (
                          <span>[ ▾ VER DETALLES Y REGLAS DEL ÍTEM ]</span>
                        )}
                      </div>

                      {isExpanded && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="pt-2.5 border-t border-[#262c3e] cursor-default select-text"
                        >
                          {renderItemDetails(prog, 'programs')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AMMUNITION */}
          {filteredAmmo.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#f59e0b] font-mono-code flex items-center gap-1.5 uppercase tracking-wider">
                <Disc className="w-3.5 h-3.5" /> Munición ({filteredAmmo.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredAmmo.map((ammo: any) => {
                  const isExpanded = expandedItemId === ammo.id;
                  return (
                    <div
                      key={ammo.id}
                      onClick={() => toggleExpand(ammo.id)}
                      className={`group bg-[#12141f] border rounded-xs chamfer-card space-y-2 cursor-pointer select-none p-3.5 transition-all hover:border-cyan-400/70 hover:bg-slate-900/95 ${
                        isExpanded ? 'border-cyan-400/80 bg-slate-900/90 shadow-lg shadow-cyan-950/30' : 'border-[#262c3e]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <AmmoHoverTooltip ammoIdOrName={ammo.name}>
                              <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech cursor-help hover:text-amber-300" title={ammo.name}>
                                {ammo.name}
                              </h4>
                            </AmmoHoverTooltip>
                            {renderSourceBookBadge(ammo.sourceBook, ammo.sourcePage)}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcquire(ammo.id, ammo.name, ammo.cost, spendMoneyMode ? 'buy' : 'loot', () => {});
                          }}
                          className="px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn shrink-0 active:scale-95 bg-[#181b2a] hover:bg-[#f59e0b]/20 border border-[#262c3e] hover:border-[#f59e0b] text-[#f59e0b]"
                        >
                          {spendMoneyMode ? `💳 -${ammo.cost} eb` : '🎁 Obtener'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#f59e0b]/15 text-[#f59e0b] rounded-xs border border-[#f59e0b]/30">
                          {ammo.costTier}
                        </span>
                        <span className="text-[#64748b] text-[10px]">{ammo.cost} eb</span>
                      </div>

                      {/* Wide Bottom Interactive Bar */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(ammo.id);
                        }}
                        className="w-full py-1.5 mt-2 bg-slate-900/80 border-t border-slate-800 group-hover:border-cyan-500/40 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-b-xs"
                      >
                        {isExpanded ? (
                          <span>[ ▴ OCULTAR DETALLES ]</span>
                        ) : (
                          <span>[ ▾ VER DETALLES Y REGLAS DEL ÍTEM ]</span>
                        )}
                      </div>

                      {isExpanded && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="pt-2.5 border-t border-[#262c3e] cursor-default select-text"
                        >
                          {renderItemDetails(ammo, 'ammunition')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ATTACHMENTS */}
          {filteredAttachments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#38bdf8] font-mono-code flex items-center gap-1.5 uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" /> Accesorios ({filteredAttachments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredAttachments.map((att: any) => {
                  const isExpanded = expandedItemId === att.id;
                  return (
                    <div
                      key={att.id}
                      onClick={() => toggleExpand(att.id)}
                      className={`group bg-[#12141f] border rounded-xs chamfer-card space-y-2 cursor-pointer select-none p-3.5 transition-all hover:border-cyan-400/70 hover:bg-slate-900/95 ${
                        isExpanded ? 'border-cyan-400/80 bg-slate-900/90 shadow-lg shadow-cyan-950/30' : 'border-[#262c3e]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={att.name}>
                              {att.name}
                            </h4>
                            {renderSourceBookBadge(att.sourceBook, att.sourcePage)}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcquire(att.id, att.name, att.cost, spendMoneyMode ? 'buy' : 'loot', () => {});
                          }}
                          className="px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn shrink-0 active:scale-95 bg-[#181b2a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8]"
                        >
                          {spendMoneyMode ? `💳 -${att.cost} eb` : '🎁 Obtener'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#38bdf8]/15 text-[#38bdf8] rounded-xs border border-[#38bdf8]/30">
                          {att.slots} ranuras
                        </span>
                        <span className="text-[#64748b] text-[10px]">{att.cost} eb</span>
                      </div>

                      {/* Wide Bottom Interactive Bar */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(att.id);
                        }}
                        className="w-full py-1.5 mt-2 bg-slate-900/80 border-t border-slate-800 group-hover:border-cyan-500/40 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-b-xs"
                      >
                        {isExpanded ? (
                          <span>[ ▴ OCULTAR DETALLES ]</span>
                        ) : (
                          <span>[ ▾ VER DETALLES Y REGLAS DEL ÍTEM ]</span>
                        )}
                      </div>

                      {isExpanded && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="pt-2.5 border-t border-[#262c3e] cursor-default select-text"
                        >
                          {renderItemDetails(att, 'attachments')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DRUGS */}
          {filteredDrugs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#ec4899] font-mono-code flex items-center gap-1.5 uppercase tracking-wider">
                <Pill className="w-3.5 h-3.5" /> Drogas & Fármacos ({filteredDrugs.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredDrugs.map((drug: any) => {
                  const isExpanded = expandedItemId === drug.id;
                  return (
                    <div
                      key={drug.id}
                      onClick={() => toggleExpand(drug.id)}
                      className={`group bg-[#12141f] border rounded-xs chamfer-card space-y-2 cursor-pointer select-none p-3.5 transition-all hover:border-cyan-400/70 hover:bg-slate-900/95 ${
                        isExpanded ? 'border-cyan-400/80 bg-slate-900/90 shadow-lg shadow-cyan-950/30' : 'border-[#262c3e]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={drug.name}>
                              {drug.name}
                            </h4>
                            {renderSourceBookBadge(drug.sourceBook, drug.sourcePage)}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcquire(drug.id, drug.name, drug.cost, spendMoneyMode ? 'buy' : 'loot', () => {});
                          }}
                          className="px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn shrink-0 active:scale-95 bg-[#181b2a] hover:bg-[#ec4899]/20 border border-[#262c3e] hover:border-[#ec4899] text-[#ec4899]"
                        >
                          {spendMoneyMode ? `💳 -${drug.cost} eb` : '🎁 Obtener'}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#ec4899]/15 text-[#ec4899] rounded-xs border border-[#ec4899]/30">
                          {drug.duration}
                        </span>
                        {drug.addictionDv > 0 && (
                          <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#f43f5e] rounded-xs border border-[#262c3e]">
                            DV {drug.addictionDv}
                          </span>
                        )}
                        <span className="text-[#64748b] text-[10px]">{drug.cost} eb</span>
                      </div>

                      {/* Wide Bottom Interactive Bar */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(drug.id);
                        }}
                        className="w-full py-1.5 mt-2 bg-slate-900/80 border-t border-slate-800 group-hover:border-cyan-500/40 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-b-xs"
                      >
                        {isExpanded ? (
                          <span>[ ▴ OCULTAR DETALLES ]</span>
                        ) : (
                          <span>[ ▾ VER DETALLES Y REGLAS DEL ÍTEM ]</span>
                        )}
                      </div>

                      {isExpanded && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="pt-2.5 border-t border-[#262c3e] cursor-default select-text"
                        >
                          {renderItemDetails(drug, 'drugs')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* GEAR */}
          {filteredGear.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#94a3b8] font-mono-code flex items-center gap-1.5 uppercase tracking-wider">
                <Package className="w-3.5 h-3.5" /> Equipo ({filteredGear.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredGear.map((g: any) => {
                  const isExpanded = expandedItemId === g.id;
                  return (
                    <div
                      key={g.id}
                      onClick={() => toggleExpand(g.id)}
                      className={`group bg-[#12141f] border rounded-xs chamfer-card space-y-2 cursor-pointer select-none p-3.5 transition-all hover:border-cyan-400/70 hover:bg-slate-900/95 ${
                        isExpanded ? 'border-cyan-400/80 bg-slate-900/90 shadow-lg shadow-cyan-950/30' : 'border-[#262c3e]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={g.name}>
                              {g.name}
                            </h4>
                            {renderSourceBookBadge(g.sourceBook, g.sourcePage)}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcquire(g.id, g.name, g.cost, spendMoneyMode ? 'buy' : 'loot', () => {});
                          }}
                          className="px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn shrink-0 active:scale-95 bg-[#181b2a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8]"
                        >
                          {spendMoneyMode ? `💳 -${g.cost} eb` : '🎁 Obtener'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#64748b] rounded-xs border border-[#262c3e]">
                          {g.costTier}
                        </span>
                        <span className="text-[#64748b] text-[10px]">{g.cost} eb</span>
                      </div>

                      {/* Wide Bottom Interactive Bar */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(g.id);
                        }}
                        className="w-full py-1.5 mt-2 bg-slate-900/80 border-t border-slate-800 group-hover:border-cyan-500/40 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-b-xs"
                      >
                        {isExpanded ? (
                          <span>[ ▴ OCULTAR DETALLES ]</span>
                        ) : (
                          <span>[ ▾ VER DETALLES Y REGLAS DEL ÍTEM ]</span>
                        )}
                      </div>

                      {isExpanded && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="pt-2.5 border-t border-[#262c3e] cursor-default select-text"
                        >
                          {renderItemDetails(g, 'gear')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* RENDER MODE: DENSE TABLE (1-LINE ROWS COMP/CON STYLE + EXPANDABLE DETAILS) */
        <div className="bg-[#12141f] border border-[#262c3e] rounded-xs chamfer-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-code text-xs">
              <thead className="bg-[#181b2a] border-b border-[#262c3e] text-[#64748b] text-[10px] uppercase">
                <tr>
                  <th
                    onClick={() => handleHeaderSortClick('name')}
                    className="py-2 px-3 cursor-pointer hover:text-white transition-colors select-none"
                    title="Ordenar por Nombre (A→Z / Z→A)"
                  >
                    <div className="flex items-center gap-1">
                      <span>Nombre</span>
                      {sortBy === 'name' && (
                        <span className="text-[#38bdf8] font-bold">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleHeaderSortClick('category')}
                    className="py-2 px-2 cursor-pointer hover:text-white transition-colors select-none"
                    title="Ordenar por Categoría / Tipo (A→Z / Z→A)"
                  >
                    <div className="flex items-center gap-1">
                      <span>Categoría</span>
                      {sortBy === 'category' && (
                        <span className="text-[#38bdf8] font-bold">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleHeaderSortClick('sourceBook')}
                    className="py-2 px-2 cursor-pointer hover:text-white transition-colors select-none"
                    title="Ordenar por Manual / Fuente (A→Z / Z→A)"
                  >
                    <div className="flex items-center gap-1">
                      <span>Manual</span>
                      {sortBy === 'sourceBook' && (
                        <span className="text-[#38bdf8] font-bold">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th className="py-2 px-2">Datos Clave (Stats / Efectos)</th>
                  <th
                    onClick={() => handleHeaderSortClick('cost')}
                    className="py-2 px-2 text-right cursor-pointer hover:text-white transition-colors select-none"
                    title="Ordenar por Costo €$ (Menor a Mayor / Mayor a Menor)"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Costo</span>
                      {sortBy === 'cost' && (
                        <span className="text-[#38bdf8] font-bold">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th className="py-2 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1e2d]">
                {/* Weapons in table */}
                {filteredWeapons.map((w: any) => {
                  const isEquipped = activeChar.equippedWeapons.some((ew) => ew.id === w.id);
                  const isMelee = w.type === 'Melee' || !w.standardMag;
                  const isExpanded = expandedItemId === w.id;
                  return (
                    <React.Fragment key={w.id}>
                      <tr 
                        onClick={() => toggleExpand(w.id)}
                        className={`hover:bg-[#181b2a]/60 transition-colors cursor-pointer ${isExpanded ? 'bg-[#181b2a]/80' : ''}`}
                      >
                        <td className="py-1.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#64748b] text-[10px]">{isExpanded ? '▾' : '▸'}</span>
                            <div className="font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]" title={w.name}>
                              {w.name}
                            </div>
                          </div>
                          <div className="text-[10px] text-[#64748b] truncate max-w-[200px] pl-3.5">{w.skill}</div>
                        </td>
                        <td className="py-1.5 px-2">
                          <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30 font-bold">
                            Arma
                          </span>
                        </td>
                        <td className="py-1.5 px-2">
                          {renderSourceBookBadge(w.sourceBook, w.sourcePage)}
                        </td>
                        <td className="py-1.5 px-2 text-[11px] text-[#cbd5e1]">
                          <span className="font-bold text-[#f43f5e] mr-2">{w.damage}</span>
                          <span className="text-[#64748b] mr-2">
                            <TacticalTooltip term="ROF">ROF {w.rof}</TacticalTooltip>
                          </span>
                          {!isMelee && (
                            <span className="text-[#38bdf8] mr-2">
                              <TacticalTooltip term="MAG">MAG {w.standardMag}</TacticalTooltip>
                            </span>
                          )}
                          {w.altFireModes?.includes('Autofire') && <span className="text-[#f59e0b] font-bold mr-2">AUTO</span>}
                        </td>
                        <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                          {w.cost} eb
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcquire(w.id, w.name, w.cost, spendMoneyMode ? 'buy' : 'loot', () => equipWeaponFromCatalog(w as WeaponItem));
                            }}
                            className={`px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer ${
                              isEquipped
                                ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981]'
                                : spendMoneyMode
                                  ? 'bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17]'
                                  : 'bg-[#f43f5e]/20 hover:bg-[#f43f5e] border border-[#f43f5e] text-[#f43f5e] hover:text-white'
                            }`}
                          >
                            {isEquipped ? '✓ Equipada' : spendMoneyMode ? `💳 -${w.cost} eb` : '🎁 Equipar'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0f111a] border-b border-[#262c3e]">
                          <td colSpan={6} className="p-3">
                            {renderItemDetails(w, 'weapons')}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Armor in table */}
                {filteredArmor.map((a: any) => {
                  const isHead = activeChar.headArmor.name.includes(a.name);
                  const isBody = activeChar.bodyArmor.name.includes(a.name);
                  const isExpanded = expandedItemId === a.id;
                  return (
                    <React.Fragment key={a.id}>
                      <tr 
                        onClick={() => toggleExpand(a.id)}
                        className={`hover:bg-[#181b2a]/60 transition-colors cursor-pointer ${isExpanded ? 'bg-[#181b2a]/80' : ''}`}
                      >
                        <td className="py-1.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#64748b] text-[10px]">{isExpanded ? '▾' : '▸'}</span>
                            <div className="font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]" title={a.name}>
                              {a.name}
                            </div>
                          </div>
                          <div className="text-[10px] text-[#64748b] truncate max-w-[200px] pl-3.5">{a.description}</div>
                        </td>
                        <td className="py-1.5 px-2">
                          <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-bold">
                            Blindaje
                          </span>
                        </td>
                        <td className="py-1.5 px-2">
                          {renderSourceBookBadge(a.sourceBook, a.sourcePage)}
                        </td>
                        <td className="py-1.5 px-2 text-[11px] text-[#cbd5e1]">
                          <span className="font-bold text-[#38bdf8] mr-2">
                            <TacticalTooltip term="SP">SP {a.sp}</TacticalTooltip>
                          </span>
                          <span className={a.penalty < 0 ? 'text-[#f43f5e] mr-2 font-bold' : 'text-[#10b981] mr-2'}>
                            Pen: {a.penalty}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                          {a.cost} eb
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <div className="inline-flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcquire(a.id, `${a.name} (Cabeza)`, a.cost, spendMoneyMode ? 'buy' : 'loot', () => equipArmorFromCatalog(a as ArmorItem, 'head'));
                              }}
                              className={`px-1.5 py-0.5 rounded-xs text-[9px] font-bold ${
                                isHead ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981]' : 'bg-[#181b2a] border border-[#262c3e] text-[#38bdf8]'
                              }`}
                            >
                              Cab
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcquire(a.id, `${a.name} (Cuerpo)`, a.cost, spendMoneyMode ? 'buy' : 'loot', () => equipArmorFromCatalog(a as ArmorItem, 'body'));
                              }}
                              className={`px-1.5 py-0.5 rounded-xs text-[9px] font-bold ${
                                isBody ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981]' : 'bg-[#181b2a] border border-[#262c3e] text-[#38bdf8]'
                              }`}
                            >
                              Cuer
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcquire(a.id, `${a.name} (Ambos)`, a.cost, spendMoneyMode ? 'buy' : 'loot', () => equipArmorFromCatalog(a as ArmorItem, 'both'));
                              }}
                              className="px-1.5 py-0.5 bg-[#38bdf8]/20 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[9px] font-bold"
                            >
                              Ambos
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0f111a] border-b border-[#262c3e]">
                          <td colSpan={6} className="p-3">
                            {renderItemDetails(a, 'armor')}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Cyberware in table */}
                {filteredCyberware.map((c: any) => {
                  const installCount = countInstalls(activeChar.installedCyberwareIds, c.id);
                  const isInstalled = installCount > 0;
                  const anotherCheck = canInstallAnother(activeChar.installedCyberwareIds, c.id, activeChar.stats);
                  const isExpanded = expandedItemId === c.id;
                  return (
                    <React.Fragment key={c.id}>
                      <tr 
                        onClick={() => toggleExpand(c.id)}
                        className={`hover:bg-[#181b2a]/60 transition-colors cursor-pointer ${isExpanded ? 'bg-[#181b2a]/80' : ''}`}
                      >
                        <td className="py-1.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#64748b] text-[10px]">{isExpanded ? '▾' : '▸'}</span>
                            <div className="font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]" title={c.name}>
                              {c.name}
                            </div>
                          </div>
                          <div className="text-[10px] text-[#64748b] truncate max-w-[200px] pl-3.5">{c.description}</div>
                        </td>
                        <td className="py-1.5 px-2">
                          <CyberCategoryTooltip category={c.type || 'Cyberware'}>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30 font-bold cursor-help hover:border-[#a855f7]">
                              {c.type}
                            </span>
                          </CyberCategoryTooltip>
                        </td>
                        <td className="py-1.5 px-2">
                          {renderSourceBookBadge(c.sourceBook, c.sourcePage)}
                        </td>
                        <td className="py-1.5 px-2 text-[11px] text-[#cbd5e1]">
                          <span className="text-[#f43f5e] mr-2">
                            <TacticalTooltip term="HL">HL {c.humanityLoss}</TacticalTooltip>
                          </span>
                          <span className="text-[#64748b] mr-2">{c.install}</span>
                        </td>
                        <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                          {c.cost} eb
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isInstalled) {
                                toggleCyberwareInstall(c.id);
                                showFeedback(c.id, 'Ciberware desinstalado');
                              } else {
                                handleAcquire(c.id, c.name, c.cost, spendMoneyMode ? 'buy' : 'loot', () => toggleCyberwareInstall(c.id));
                              }
                            }}
                            className={`px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer ${
                              isInstalled
                                ? 'bg-[#f43f5e]/20 border border-[#f43f5e] text-[#f43f5e]'
                                : spendMoneyMode
                                  ? 'bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17]'
                                  : 'bg-[#a855f7]/20 hover:bg-[#a855f7] border border-[#a855f7] text-[#a855f7] hover:text-white'
                            }`}
                          >
                            {isInstalled ? (installCount > 1 ? `Desinstalar ×${installCount}` : 'Desinstalar') : spendMoneyMode ? `💳 -${c.cost} eb` : '🎁 + Instalar'}
                          </button>
                          {isInstalled && (
                            <button
                              disabled={!anotherCheck.ok}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcquire(c.id, c.name, c.cost, spendMoneyMode ? 'buy' : 'loot', () => {
                                  installCyberwareAdvanced({
                                    cyberwareId: c.id,
                                    cyberwareName: c.name,
                                    humanityLossAmount: c.humanityLoss ? parseHumanityLossAverage(String(c.humanityLoss)) : 7,
                                    cost: 0,
                                    spendMoney: false
                                  });
                                });
                              }}
                              className="ml-1 px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer bg-[#10b981]/20 hover:bg-[#10b981] border border-[#10b981] text-[#10b981] hover:text-[#0b0e17] disabled:opacity-40 disabled:cursor-not-allowed"
                              title={anotherCheck.ok ? 'Instalar otra copia' : anotherCheck.reason}
                            >
                              Instalar otro
                            </button>
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0f111a] border-b border-[#262c3e]">
                          <td colSpan={6} className="p-3">
                            {renderItemDetails(c, 'cyberware')}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Programs in table */}
                {filteredPrograms.map((p: any) => {
                  const isExpanded = expandedItemId === p.id;
                  return (
                    <React.Fragment key={p.id}>
                      <tr 
                        onClick={() => toggleExpand(p.id)}
                        className={`hover:bg-[#181b2a]/60 transition-colors cursor-pointer ${isExpanded ? 'bg-[#181b2a]/80' : ''}`}
                      >
                        <td className="py-1.5 px-3 font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#64748b] text-[10px]">{isExpanded ? '▾' : '▸'}</span>
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td className="py-1.5 px-2">
                          <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                            {p.class}
                          </span>
                        </td>
                        <td className="py-1.5 px-2">
                          {renderSourceBookBadge(p.sourceBook, p.sourcePage)}
                        </td>
                        <td className="py-1.5 px-2 text-[11px] text-[#cbd5e1]">
                          {p.atk !== undefined && <span className="mr-2 text-[#f43f5e]">ATK {p.atk}</span>}
                          {p.def !== undefined && <span className="mr-2 text-[#38bdf8]">DEF {p.def}</span>}
                          {p.rez !== undefined && <span className="mr-2 text-[#10b981]">REZ {p.rez}</span>}
                          <span className="text-[#64748b] truncate">{p.description}</span>
                        </td>
                        <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                          {p.cost} eb
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcquire(p.id, p.name, p.cost, spendMoneyMode ? 'buy' : 'loot', () => {});
                            }}
                            className="px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer bg-[#181b2a] hover:bg-[#10b981]/20 border border-[#262c3e] hover:border-[#10b981] text-[#10b981]"
                          >
                            {spendMoneyMode ? `💳 -${p.cost} eb` : '🎁 Obtener'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0f111a] border-b border-[#262c3e]">
                          <td colSpan={6} className="p-3">
                            {renderItemDetails(p, 'programs')}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Ammunition in table */}
                {filteredAmmo.map((am: any) => {
                  const isExpanded = expandedItemId === am.id;
                  return (
                    <React.Fragment key={am.id}>
                      <tr 
                        onClick={() => toggleExpand(am.id)}
                        className={`hover:bg-[#181b2a]/60 transition-colors cursor-pointer ${isExpanded ? 'bg-[#181b2a]/80' : ''}`}
                      >
                        <td className="py-1.5 px-3 font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#64748b] text-[10px]">{isExpanded ? '▾' : '▸'}</span>
                            <AmmoHoverTooltip ammoIdOrName={am.name}>
                              <span className="cursor-help hover:text-amber-300">{am.name}</span>
                            </AmmoHoverTooltip>
                          </div>
                        </td>
                        <td className="py-1.5 px-2">
                          <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                            Munición
                          </span>
                        </td>
                        <td className="py-1.5 px-2">
                          {renderSourceBookBadge(am.sourceBook, am.sourcePage)}
                        </td>
                        <td className="py-1.5 px-2 text-[11px] text-[#94a3b8] truncate max-w-[300px]">
                          {am.description}
                        </td>
                        <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                          {am.cost} eb
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcquire(am.id, am.name, am.cost, spendMoneyMode ? 'buy' : 'loot', () => {});
                            }}
                            className="px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer bg-[#181b2a] hover:bg-[#f59e0b]/20 border border-[#262c3e] hover:border-[#f59e0b] text-[#f59e0b]"
                          >
                            {spendMoneyMode ? `💳 -${am.cost} eb` : '🎁 Obtener'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0f111a] border-b border-[#262c3e]">
                          <td colSpan={6} className="p-3">
                            {renderItemDetails(am, 'ammunition')}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Attachments in table */}
                {filteredAttachments.map((att: any) => {
                  const isExpanded = expandedItemId === att.id;
                  return (
                    <React.Fragment key={att.id}>
                      <tr 
                        onClick={() => toggleExpand(att.id)}
                        className={`hover:bg-[#181b2a]/60 transition-colors cursor-pointer ${isExpanded ? 'bg-[#181b2a]/80' : ''}`}
                      >
                        <td className="py-1.5 px-3 font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#64748b] text-[10px]">{isExpanded ? '▾' : '▸'}</span>
                            <span>{att.name}</span>
                          </div>
                        </td>
                        <td className="py-1.5 px-2">
                          <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
                            Accesorio
                          </span>
                        </td>
                        <td className="py-1.5 px-2">
                          {renderSourceBookBadge(att.sourceBook, att.sourcePage)}
                        </td>
                        <td className="py-1.5 px-2 text-[11px] text-[#94a3b8] truncate max-w-[300px]">
                          {att.slots} ranuras • {att.description}
                        </td>
                        <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                          {att.cost} eb
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcquire(att.id, att.name, att.cost, spendMoneyMode ? 'buy' : 'loot', () => {});
                            }}
                            className="px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer bg-[#181b2a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8]"
                          >
                            {spendMoneyMode ? `💳 -${att.cost} eb` : '🎁 Obtener'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0f111a] border-b border-[#262c3e]">
                          <td colSpan={6} className="p-3">
                            {renderItemDetails(att, 'attachments')}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Drugs in table */}
                {filteredDrugs.map((d: any) => {
                  const isExpanded = expandedItemId === d.id;
                  return (
                    <React.Fragment key={d.id}>
                      <tr 
                        onClick={() => toggleExpand(d.id)}
                        className={`hover:bg-[#181b2a]/60 transition-colors cursor-pointer ${isExpanded ? 'bg-[#181b2a]/80' : ''}`}
                      >
                        <td className="py-1.5 px-3 font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#64748b] text-[10px]">{isExpanded ? '▾' : '▸'}</span>
                            <span>{d.name}</span>
                          </div>
                        </td>
                        <td className="py-1.5 px-2">
                          <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#ec4899]/15 text-[#ec4899] border border-[#ec4899]/30">
                            Droga
                          </span>
                        </td>
                        <td className="py-1.5 px-2">
                          {renderSourceBookBadge(d.sourceBook, d.sourcePage)}
                        </td>
                        <td className="py-1.5 px-2 text-[11px] text-[#94a3b8] truncate max-w-[300px]">
                          {d.duration} {d.addictionDv > 0 ? `• DV ${d.addictionDv}` : ''} • {d.primaryEffect}
                        </td>
                        <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                          {d.cost} eb
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcquire(d.id, d.name, d.cost, spendMoneyMode ? 'buy' : 'loot', () => {});
                            }}
                            className="px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer bg-[#181b2a] hover:bg-[#ec4899]/20 border border-[#262c3e] hover:border-[#ec4899] text-[#ec4899]"
                          >
                            {spendMoneyMode ? `💳 -${d.cost} eb` : '🎁 Obtener'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0f111a] border-b border-[#262c3e]">
                          <td colSpan={6} className="p-3">
                            {renderItemDetails(d, 'drugs')}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Gear in table */}
                {filteredGear.map((g: any) => {
                  const isExpanded = expandedItemId === g.id;
                  return (
                    <React.Fragment key={g.id}>
                      <tr 
                        onClick={() => toggleExpand(g.id)}
                        className={`hover:bg-[#181b2a]/60 transition-colors cursor-pointer ${isExpanded ? 'bg-[#181b2a]/80' : ''}`}
                      >
                        <td className="py-1.5 px-3 font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#64748b] text-[10px]">{isExpanded ? '▾' : '▸'}</span>
                            <span>{g.name}</span>
                          </div>
                        </td>
                        <td className="py-1.5 px-2">
                          <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#64748b]/15 text-[#cbd5e1] border border-[#262c3e]">
                            Equipo
                          </span>
                        </td>
                        <td className="py-1.5 px-2">
                          {renderSourceBookBadge(g.sourceBook, g.sourcePage)}
                        </td>
                        <td className="py-1.5 px-2 text-[11px] text-[#94a3b8] truncate max-w-[300px]">
                          {g.description}
                        </td>
                        <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                          {g.cost} eb
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcquire(g.id, g.name, g.cost, spendMoneyMode ? 'buy' : 'loot', () => {});
                            }}
                            className="px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer bg-[#181b2a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8]"
                          >
                            {spendMoneyMode ? `💳 -${g.cost} eb` : '🎁 Obtener'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0f111a] border-b border-[#262c3e]">
                          <td colSpan={6} className="p-3">
                            {renderItemDetails(g, 'gear')}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No results */}
      {totalResults === 0 && (
        <div className="bg-[#12141f] border border-[#262c3e] p-6 rounded-xs text-center space-y-1.5">
          <p className="text-xs text-[#94a3b8] font-mono-code">
            No se encontraron ítems para &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="text-[11px] text-[#38bdf8] hover:underline font-mono-code cursor-pointer"
          >
            Restablecer filtros
          </button>
        </div>
      )}
        </>
      ) : (
        /* =====================================================================
            COMPENDIO DE SISTEMAS Y REGLAS NUEVAS (FBC / 2077 / DLCs)
        ===================================================================== */
        <div className="space-y-4">
          {/* Barra de Búsqueda y Filtros de Sistemas */}
          <div className="bg-[#12141f] border border-[#262c3e] p-3 rounded-xs chamfer-card space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={systemSearchQuery}
                  onChange={(e) => setSystemSearchQuery(e.target.value)}
                  placeholder="Buscar reglas (FBC, Neuroport, Smart, Quickhack...)"
                  className="w-full bg-[#181b2a] border border-[#262c3e] pl-8 pr-7 py-1.5 text-xs text-[#f1f5f9] rounded-xs focus:outline-hidden focus:border-[#a855f7] font-mono-code"
                />
                {systemSearchQuery && (
                  <button 
                    onClick={() => setSystemSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#64748b] hover:text-[#f1f5f9]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filtro rápido por fuente */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'Todos (8)' },
                  { id: 'interface_red', label: 'Interface RED // FBC' },
                  { id: 'cemk_2077', label: 'CEMK 2077' },
                  { id: 'black_chrome', label: 'Black Chrome' },
                  { id: 'dlc', label: 'DLCs & Hornet' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSystemSourceFilter(f.id)}
                    className={`px-2.5 py-1 rounded-xs text-[11px] font-mono-code transition-colors cursor-pointer chamfer-btn ${
                      systemSourceFilter === f.id
                        ? 'bg-[#a855f7]/25 border border-[#a855f7] text-[#c084fc] font-bold'
                        : 'bg-[#181b2a] border border-[#262c3e] text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LISTA DE SISTEMAS EXPANDIBLES */}
          <div className="space-y-4">
            {filteredRuleSystems.map((sys) => {
              const isExpanded = !!expandedSystemIds[sys.id];
              return (
                <div
                  key={sys.id}
                  className="bg-[#12141f] border border-[#262c3e] hover:border-[#a855f7]/60 rounded-xs chamfer-card overflow-hidden transition-all shadow-md"
                >
                  {/* Cabecera del Sistema (Clickable) */}
                  <div
                    onClick={() => toggleSystemExpand(sys.id)}
                    className="p-3.5 bg-[#161a29] hover:bg-[#1a2135] border-b border-[#242c42] flex items-center justify-between cursor-pointer select-none transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold bg-[#a855f7]/20 border border-[#a855f7]/50 text-[#c084fc]">
                          {sys.categoryBadge}
                        </span>
                        <h3 className="text-sm font-bold text-white font-tech uppercase tracking-wider">
                          {sys.title}
                        </h3>
                        {renderSourceBookBadge(sys.sourceBook)}
                        <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#0b0e17] text-slate-300 font-mono-code border border-[#20273a]">
                          Era: {sys.era.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94a3b8] font-mono-code">
                        {sys.subtitle} • <span className="text-cyan-400">{sys.sourceBookTitle}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono-code text-[#c084fc] hidden sm:inline">
                        {isExpanded ? '[ Plegar ]' : '[ Desplegar Reglas ]'}
                      </span>
                      <div className="p-1 rounded-xs bg-[#0b0e17] border border-[#242c42] text-slate-400">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-[#c084fc]" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPCIÓN INTRODUCTORIA SIEMPRE VISIBLE */}
                  <div className="p-3.5 bg-[#0e111a] border-b border-[#1e2337]">
                    <div className="p-3 rounded-xs bg-[#161c2b] border-l-4 border-cyan-400 space-y-1">
                      <div className="text-[10px] font-bold text-cyan-300 font-mono-code uppercase tracking-wider flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Sinopsis & Transformación del Sistema:</span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono-code leading-relaxed">
                        {sys.introDescription}
                      </p>
                    </div>
                  </div>

                  {/* CONTENIDO DESPLEGABLE */}
                  {isExpanded && (
                    <div className="p-4 space-y-4 bg-[#12141f] font-mono-code text-xs">
                      {/* 1. ¿Cómo Funciona Paso a Paso? */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#f59e0b]" /> ¿Cómo Funciona Paso a Paso?
                        </h4>
                        <div className="space-y-1.5">
                          {sys.howItWorksSteps.map((step, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xs bg-[#181c2b] border border-[#242c42] flex items-start gap-2.5 text-[11px] text-slate-300 leading-relaxed"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="flex-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. Beneficios vs Riesgos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Beneficios */}
                        <div className="p-3 bg-[#10b981]/5 border border-[#10b981]/30 rounded-xs space-y-2">
                          <h5 className="text-[11px] font-bold text-[#10b981] uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Beneficios y Ventajas Mecánicas:
                          </h5>
                          <ul className="space-y-1 text-[10px] text-slate-300">
                            {sys.keyBenefits.map((b, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-[#10b981] font-bold shrink-0">✓</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Riesgos y Limitaciones */}
                        <div className="p-3 bg-[#f43f5e]/5 border border-[#f43f5e]/30 rounded-xs space-y-2">
                          <h5 className="text-[11px] font-bold text-[#f43f5e] uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Riesgos, Costes y Limitaciones:
                          </h5>
                          <ul className="space-y-1 text-[10px] text-slate-300">
                            {sys.drawbacksAndRisks.map((d, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-[#f43f5e] font-bold shrink-0">⚠</span>
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 3. Tabla Oficial de Referencia (si existe) */}
                      {sys.referenceTable && (
                        <div className="space-y-1.5 pt-1">
                          <h5 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Tabla Canónica de Referencia Táctica:
                          </h5>
                          <div className="overflow-x-auto border border-[#242c42] rounded-xs">
                            <table className="w-full text-left text-[11px]">
                              <thead className="bg-[#181c2b] text-cyan-300 text-[10px] uppercase border-b border-[#242c42]">
                                <tr>
                                  {sys.referenceTable.headers.map((h, idx) => (
                                    <th key={idx} className="py-2 px-2.5">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#1e2337]">
                                {sys.referenceTable.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-[#161c2b] transition-colors">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="py-1.5 px-2.5 text-slate-300 text-[10px]">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredRuleSystems.length === 0 && (
            <div className="bg-[#12141f] border border-[#262c3e] p-6 rounded-xs text-center space-y-1.5 font-mono-code">
              <p className="text-xs text-slate-400">
                No se encontraron sistemas de reglas para &ldquo;{systemSearchQuery}&rdquo;.
              </p>
              <button
                onClick={() => { setSystemSearchQuery(''); setSystemSourceFilter('all'); }}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
