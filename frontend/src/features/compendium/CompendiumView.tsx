import React, { useState, useMemo } from 'react';
import coreData from '../../data/core-rules.cprpack.json';
import { useCharacterStore } from '../../store/useCharacterStore';
import { ItemVisualPlaceholder } from '../../components/ItemVisualPlaceholder';
import type { WeaponItem, ArmorItem } from '../../types/cyberpunk';
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
  ChevronDown,
  ChevronUp
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
}

export const CompendiumView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CompendiumCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const getActiveCharacter = useCharacterStore((state) => state.getActiveCharacter);
  const equipWeaponFromCatalog = useCharacterStore((state) => state.equipWeaponFromCatalog);
  const equipArmorFromCatalog = useCharacterStore((state) => state.equipArmorFromCatalog);
  const toggleCyberwareInstall = useCharacterStore((state) => state.toggleCyberwareInstall);

  const activeChar = getActiveCharacter();

  const showFeedback = (id: string, message: string) => {
    setFeedback({ id, message });
    setTimeout(() => {
      setFeedback((prev) => (prev?.id === id ? null : prev));
    }, 1800);
  };

  const toggleExpand = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
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

  const categoriesConfig: { key: CompendiumCategory; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Todo', count: 272, icon: <Package className="w-3.5 h-3.5" /> },
    { key: 'weapons', label: 'Armas', count: coreData.weapons?.length || 0, icon: <Crosshair className="w-3.5 h-3.5" /> },
    { key: 'armor', label: 'Blindajes', count: coreData.armor?.length || 0, icon: <Shield className="w-3.5 h-3.5" /> },
    { key: 'cyberware', label: 'Ciberware', count: coreData.cyberware?.length || 0, icon: <Cpu className="w-3.5 h-3.5" /> },
    { key: 'programs', label: 'Programas', count: coreData.programs?.length || 0, icon: <Terminal className="w-3.5 h-3.5" /> },
    { key: 'ammunition', label: 'Munición', count: coreData.ammunition?.length || 0, icon: <Disc className="w-3.5 h-3.5" /> },
    { key: 'attachments', label: 'Accesorios', count: coreData.attachments?.length || 0, icon: <Wrench className="w-3.5 h-3.5" /> },
    { key: 'drugs', label: 'Drogas', count: coreData.drugs?.length || 0, icon: <Pill className="w-3.5 h-3.5" /> },
    { key: 'gear', label: 'Equipo', count: coreData.gear?.length || 0, icon: <Package className="w-3.5 h-3.5" /> }
  ];

  const filteredWeapons = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'weapons') return [];
    const q = searchQuery.toLowerCase();
    return (coreData.weapons || []).filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.skill?.toLowerCase().includes(q) ||
      item.notes?.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  const filteredArmor = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'armor') return [];
    const q = searchQuery.toLowerCase();
    return (coreData.armor || []).filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  const filteredCyberware = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'cyberware') return [];
    const q = searchQuery.toLowerCase();
    return (coreData.cyberware || []).filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  const filteredPrograms = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'programs') return [];
    const q = searchQuery.toLowerCase();
    return (coreData.programs || []).filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.class?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  const filteredAmmo = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'ammunition') return [];
    const q = searchQuery.toLowerCase();
    return (coreData.ammunition || []).filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  const filteredAttachments = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'attachments') return [];
    const q = searchQuery.toLowerCase();
    return (coreData.attachments || []).filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  const filteredDrugs = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'drugs') return [];
    const q = searchQuery.toLowerCase();
    return (coreData.drugs || []).filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.primaryEffect?.toLowerCase().includes(q) ||
      item.secondaryEffect?.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  const filteredGear = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'gear') return [];
    const q = searchQuery.toLowerCase();
    return (coreData.gear || []).filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  const totalResults = 
    filteredWeapons.length + 
    filteredArmor.length + 
    filteredCyberware.length + 
    filteredPrograms.length + 
    filteredAmmo.length + 
    filteredAttachments.length + 
    filteredDrugs.length + 
    filteredGear.length;

  return (
    <div className="space-y-4">
      {/* Top Bar with Search, Category Filter, and View Mode Toggle */}
      <div className="bg-[#12141f] border border-[#262c3e] p-3 rounded-xs chamfer-card space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full md:w-80">
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

          {/* Center Info: Active character & Count */}
          <div className="flex items-center gap-2 text-[11px] font-mono-code text-[#64748b]">
            <span>Ficha: <strong className="text-[#f1f5f9]">{activeChar.handle}</strong></span>
            <span>•</span>
            <span className="text-[#38bdf8]">{totalResults} ítems</span>
          </div>

          {/* View Mode Toggle: Compact Cards vs Dense Table */}
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
        <div className="fixed bottom-4 right-4 z-50 bg-[#10b981] text-[#0b0e17] font-mono-code font-bold text-xs px-3 py-1.5 rounded-xs shadow-lg shadow-[#10b981]/20 flex items-center gap-1.5 animate-bounce">
          <Check className="w-4 h-4" />
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#f43f5e]/40 p-2.5 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      {/* 1-Line Header */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <ItemVisualPlaceholder type={visualType} size="sm" className="w-7 h-7 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={weapon.name}>
                              {weapon.name}
                            </h4>
                            <span className="text-[10px] text-[#f59e0b] font-mono-code">
                              {weapon.cost} eb
                            </span>
                          </div>
                        </div>

                        {/* Top-Right Equip Action Button */}
                        <button
                          onClick={() => {
                            equipWeaponFromCatalog(weapon as WeaponItem);
                            showFeedback(weapon.id, `¡${weapon.name} equipada!`);
                          }}
                          className={`px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn flex items-center gap-1 shrink-0 active:scale-95 ${
                            isEquipped
                              ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981] hover:bg-[#10b981]/30'
                              : 'bg-[#f43f5e]/20 hover:bg-[#f43f5e] border border-[#f43f5e] text-[#f43f5e] hover:text-white'
                          }`}
                          title="Equipar arma en la ficha activa"
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
                              <span>Equipar</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Adaptive Stat Pills in 1 Single Horizontal Strip */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono-code pt-0.5">
                        <span className="px-1.5 py-0.2 bg-[#f43f5e]/15 text-[#f43f5e] rounded-xs font-bold border border-[#f43f5e]/30">
                          {isMelee ? '⚔️' : '💥'} {weapon.damage}
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#94a3b8] rounded-xs border border-[#262c3e]">
                          ROF {weapon.rof}
                        </span>
                        {!isMelee && (
                          <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#38bdf8] rounded-xs border border-[#262c3e]">
                            MAG {weapon.standardMag}
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#94a3b8] rounded-xs border border-[#262c3e]">
                          {weapon.hands}H
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

                      {/* Quiet Expandable Notes */}
                      {weapon.notes && (
                        <div className="pt-0.5">
                          <p 
                            onClick={() => toggleExpand(weapon.id)}
                            className={`text-[10px] text-[#94a3b8] leading-tight cursor-pointer hover:text-[#cbd5e1] flex items-center justify-between ${
                              isExpanded ? 'whitespace-normal' : 'truncate'
                            }`}
                            title="Clic para expandir descripción"
                          >
                            <span>{weapon.notes}</span>
                            <span className="text-[#64748b] ml-1 shrink-0">
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </span>
                          </p>
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#38bdf8]/40 p-2.5 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={armor.name}>
                            {armor.name}
                          </h4>
                          <span className="text-[10px] text-[#f59e0b] font-mono-code">
                            {armor.cost} eb
                          </span>
                        </div>

                        {/* Compact Equip Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              equipArmorFromCatalog(armor as ArmorItem, 'head');
                              showFeedback(armor.id, `¡${armor.name} en Cabeza!`);
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
                            onClick={() => {
                              equipArmorFromCatalog(armor as ArmorItem, 'body');
                              showFeedback(armor.id, `¡${armor.name} en Cuerpo!`);
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
                            onClick={() => {
                              equipArmorFromCatalog(armor as ArmorItem, 'both');
                              showFeedback(armor.id, `¡${armor.name} en Ambos!`);
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
                          SP {armor.sp}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded-xs border ${armor.penalty < 0 ? 'bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/30 font-bold' : 'bg-[#181b2a] text-[#10b981] border-[#262c3e]'}`}>
                          Pen: {armor.penalty}
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#64748b] rounded-xs border border-[#262c3e]">
                          {armor.costTier}
                        </span>
                      </div>

                      {/* Description */}
                      <p 
                        onClick={() => toggleExpand(armor.id)}
                        className={`text-[10px] text-[#94a3b8] leading-tight cursor-pointer hover:text-[#cbd5e1] flex items-center justify-between ${
                          isExpanded ? 'whitespace-normal' : 'truncate'
                        }`}
                      >
                        <span>{armor.description}</span>
                        <span className="text-[#64748b] ml-1 shrink-0">
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      </p>
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
                  const isInstalled = activeChar.installedCyberwareIds.includes(cyber.id);
                  const isExpanded = expandedItemId === cyber.id;

                  return (
                    <div
                      key={cyber.id}
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#a855f7]/40 p-2.5 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={cyber.name}>
                            {cyber.name}
                          </h4>
                          <span className="text-[10px] text-[#f59e0b] font-mono-code">
                            {cyber.cost} eb
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            toggleCyberwareInstall(cyber.id);
                            showFeedback(cyber.id, isInstalled ? 'Ciberware desinstalado' : '¡Ciberware instalado!');
                          }}
                          className={`px-2 py-0.5 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn shrink-0 active:scale-95 ${
                            isInstalled
                              ? 'bg-[#f43f5e]/20 hover:bg-[#f43f5e] border border-[#f43f5e] text-[#f43f5e] hover:text-white'
                              : 'bg-[#a855f7]/20 hover:bg-[#a855f7] border border-[#a855f7] text-[#a855f7] hover:text-white'
                          }`}
                        >
                          {isInstalled ? 'Desinstalar' : '+ Instalar'}
                        </button>
                      </div>

                      {/* Stat Pills */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#a855f7]/15 text-[#a855f7] rounded-xs font-bold border border-[#a855f7]/30">
                          {cyber.type}
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#f43f5e] rounded-xs border border-[#262c3e]">
                          HL: {cyber.humanityLoss}
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#64748b] rounded-xs border border-[#262c3e]">
                          {cyber.install}
                        </span>
                      </div>

                      {/* Description */}
                      <p 
                        onClick={() => toggleExpand(cyber.id)}
                        className={`text-[10px] text-[#94a3b8] leading-tight cursor-pointer hover:text-[#cbd5e1] flex items-center justify-between ${
                          isExpanded ? 'whitespace-normal' : 'truncate'
                        }`}
                      >
                        <span>{cyber.description}</span>
                        <span className="text-[#64748b] ml-1 shrink-0">
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      </p>
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#10b981]/40 p-2.5 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={prog.name}>
                          {prog.name}
                        </h4>
                        <span className="text-[10px] text-[#f59e0b] font-mono-code shrink-0">
                          {prog.cost} eb
                        </span>
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

                      <p 
                        onClick={() => toggleExpand(prog.id)}
                        className={`text-[10px] text-[#94a3b8] leading-tight cursor-pointer hover:text-[#cbd5e1] flex items-center justify-between ${
                          isExpanded ? 'whitespace-normal' : 'truncate'
                        }`}
                      >
                        <span>{prog.description}</span>
                        <span className="text-[#64748b] ml-1 shrink-0">
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      </p>
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#f59e0b]/40 p-2.5 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={ammo.name}>
                          {ammo.name}
                        </h4>
                        <span className="text-[10px] text-[#f59e0b] font-mono-code shrink-0">
                          {ammo.cost} eb
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#f59e0b]/15 text-[#f59e0b] rounded-xs border border-[#f59e0b]/30">
                          {ammo.costTier}
                        </span>
                      </div>
                      <p 
                        onClick={() => toggleExpand(ammo.id)}
                        className={`text-[10px] text-[#94a3b8] leading-tight cursor-pointer hover:text-[#cbd5e1] flex items-center justify-between ${
                          isExpanded ? 'whitespace-normal' : 'truncate'
                        }`}
                      >
                        <span>{ammo.description}</span>
                        <span className="text-[#64748b] ml-1 shrink-0">
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      </p>
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#38bdf8]/40 p-2.5 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={att.name}>
                          {att.name}
                        </h4>
                        <span className="text-[10px] text-[#f59e0b] font-mono-code shrink-0">
                          {att.cost} eb
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#38bdf8]/15 text-[#38bdf8] rounded-xs border border-[#38bdf8]/30">
                          {att.slots} ranuras
                        </span>
                      </div>
                      <p 
                        onClick={() => toggleExpand(att.id)}
                        className={`text-[10px] text-[#94a3b8] leading-tight cursor-pointer hover:text-[#cbd5e1] flex items-center justify-between ${
                          isExpanded ? 'whitespace-normal' : 'truncate'
                        }`}
                      >
                        <span>{att.description}</span>
                        <span className="text-[#64748b] ml-1 shrink-0">
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      </p>
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#ec4899]/40 p-2.5 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={drug.name}>
                          {drug.name}
                        </h4>
                        <span className="text-[10px] text-[#f59e0b] font-mono-code shrink-0">
                          {drug.cost} eb
                        </span>
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
                      </div>
                      <p 
                        onClick={() => toggleExpand(drug.id)}
                        className={`text-[10px] text-[#94a3b8] leading-tight cursor-pointer hover:text-[#cbd5e1] flex items-center justify-between ${
                          isExpanded ? 'whitespace-normal' : 'truncate'
                        }`}
                      >
                        <span>{drug.primaryEffect}</span>
                        <span className="text-[#64748b] ml-1 shrink-0">
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      </p>
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#64748b]/40 p-2.5 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={g.name}>
                          {g.name}
                        </h4>
                        <span className="text-[10px] text-[#f59e0b] font-mono-code shrink-0">
                          {g.cost} eb
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono-code">
                        <span className="px-1.5 py-0.2 bg-[#181b2a] text-[#64748b] rounded-xs border border-[#262c3e]">
                          {g.costTier}
                        </span>
                      </div>
                      <p 
                        onClick={() => toggleExpand(g.id)}
                        className={`text-[10px] text-[#94a3b8] leading-tight cursor-pointer hover:text-[#cbd5e1] flex items-center justify-between ${
                          isExpanded ? 'whitespace-normal' : 'truncate'
                        }`}
                      >
                        <span>{g.description}</span>
                        <span className="text-[#64748b] ml-1 shrink-0">
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* RENDER MODE: DENSE TABLE (1-LINE ROWS COMP/CON STYLE) */
        <div className="bg-[#12141f] border border-[#262c3e] rounded-xs chamfer-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-code text-xs">
              <thead className="bg-[#181b2a] border-b border-[#262c3e] text-[#64748b] text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Nombre</th>
                  <th className="py-2 px-2">Categoría</th>
                  <th className="py-2 px-2">Datos Clave (Stats / Efectos)</th>
                  <th className="py-2 px-2 text-right">Costo</th>
                  <th className="py-2 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1e2d]">
                {/* Weapons in table */}
                {filteredWeapons.map((w: any) => {
                  const isEquipped = activeChar.equippedWeapons.some((ew) => ew.id === w.id);
                  const isMelee = w.type === 'Melee' || !w.standardMag;
                  return (
                    <tr key={w.id} className="hover:bg-[#181b2a]/60 transition-colors">
                      <td className="py-1.5 px-3">
                        <div className="font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]" title={w.name}>
                          {w.name}
                        </div>
                        <div className="text-[10px] text-[#64748b] truncate max-w-[200px]">{w.skill}</div>
                      </td>
                      <td className="py-1.5 px-2">
                        <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30 font-bold">
                          Arma
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-[11px] text-[#cbd5e1]">
                        <span className="font-bold text-[#f43f5e] mr-2">{w.damage}</span>
                        <span className="text-[#64748b] mr-2">ROF {w.rof}</span>
                        {!isMelee && <span className="text-[#38bdf8] mr-2">MAG {w.standardMag}</span>}
                        {w.altFireModes?.includes('Autofire') && <span className="text-[#f59e0b] font-bold mr-2">AUTO</span>}
                      </td>
                      <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                        {w.cost} eb
                      </td>
                      <td className="py-1.5 px-3 text-right">
                        <button
                          onClick={() => {
                            equipWeaponFromCatalog(w as WeaponItem);
                            showFeedback(w.id, `¡${w.name} equipada!`);
                          }}
                          className={`px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer ${
                            isEquipped
                              ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981]'
                              : 'bg-[#f43f5e]/20 hover:bg-[#f43f5e] border border-[#f43f5e] text-[#f43f5e] hover:text-white'
                          }`}
                        >
                          {isEquipped ? '✓ Equipada' : '+ Equipar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Armor in table */}
                {filteredArmor.map((a: any) => {
                  const isHead = activeChar.headArmor.name.includes(a.name);
                  const isBody = activeChar.bodyArmor.name.includes(a.name);
                  return (
                    <tr key={a.id} className="hover:bg-[#181b2a]/60 transition-colors">
                      <td className="py-1.5 px-3">
                        <div className="font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]" title={a.name}>
                          {a.name}
                        </div>
                        <div className="text-[10px] text-[#64748b] truncate max-w-[200px]">{a.description}</div>
                      </td>
                      <td className="py-1.5 px-2">
                        <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-bold">
                          Blindaje
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-[11px] text-[#cbd5e1]">
                        <span className="font-bold text-[#38bdf8] mr-2">SP {a.sp}</span>
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
                            onClick={() => {
                              equipArmorFromCatalog(a as ArmorItem, 'head');
                              showFeedback(a.id, `¡${a.name} en Cabeza!`);
                            }}
                            className={`px-1.5 py-0.5 rounded-xs text-[9px] font-bold ${
                              isHead ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981]' : 'bg-[#181b2a] border border-[#262c3e] text-[#38bdf8]'
                            }`}
                          >
                            Cab
                          </button>
                          <button
                            onClick={() => {
                              equipArmorFromCatalog(a as ArmorItem, 'body');
                              showFeedback(a.id, `¡${a.name} en Cuerpo!`);
                            }}
                            className={`px-1.5 py-0.5 rounded-xs text-[9px] font-bold ${
                              isBody ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981]' : 'bg-[#181b2a] border border-[#262c3e] text-[#38bdf8]'
                            }`}
                          >
                            Cuer
                          </button>
                          <button
                            onClick={() => {
                              equipArmorFromCatalog(a as ArmorItem, 'both');
                              showFeedback(a.id, `¡${a.name} en Ambos!`);
                            }}
                            className="px-1.5 py-0.5 bg-[#38bdf8]/20 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[9px] font-bold"
                          >
                            Ambos
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Cyberware in table */}
                {filteredCyberware.map((c: any) => {
                  const isInstalled = activeChar.installedCyberwareIds.includes(c.id);
                  return (
                    <tr key={c.id} className="hover:bg-[#181b2a]/60 transition-colors">
                      <td className="py-1.5 px-3">
                        <div className="font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]" title={c.name}>
                          {c.name}
                        </div>
                        <div className="text-[10px] text-[#64748b] truncate max-w-[200px]">{c.description}</div>
                      </td>
                      <td className="py-1.5 px-2">
                        <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30 font-bold">
                          {c.type}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-[11px] text-[#cbd5e1]">
                        <span className="text-[#f43f5e] mr-2">HL {c.humanityLoss}</span>
                        <span className="text-[#64748b] mr-2">{c.install}</span>
                      </td>
                      <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                        {c.cost} eb
                      </td>
                      <td className="py-1.5 px-3 text-right">
                        <button
                          onClick={() => {
                            toggleCyberwareInstall(c.id);
                            showFeedback(c.id, isInstalled ? 'Ciberware desinstalado' : '¡Ciberware instalado!');
                          }}
                          className={`px-2 py-0.5 rounded-xs text-[10px] font-bold transition-all cursor-pointer ${
                            isInstalled
                              ? 'bg-[#f43f5e]/20 border border-[#f43f5e] text-[#f43f5e]'
                              : 'bg-[#a855f7]/20 hover:bg-[#a855f7] border border-[#a855f7] text-[#a855f7] hover:text-white'
                          }`}
                        >
                          {isInstalled ? 'Desinstalar' : '+ Instalar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Programs in table */}
                {filteredPrograms.map((p: any) => (
                  <tr key={p.id} className="hover:bg-[#181b2a]/60 transition-colors">
                    <td className="py-1.5 px-3 font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]">
                      {p.name}
                    </td>
                    <td className="py-1.5 px-2">
                      <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                        {p.class}
                      </span>
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
                    <td className="py-1.5 px-3 text-right text-[#64748b] text-[10px]">
                      Software
                    </td>
                  </tr>
                ))}

                {/* Ammunition in table */}
                {filteredAmmo.map((am: any) => (
                  <tr key={am.id} className="hover:bg-[#181b2a]/60 transition-colors">
                    <td className="py-1.5 px-3 font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]">
                      {am.name}
                    </td>
                    <td className="py-1.5 px-2">
                      <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                        Munición
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-[11px] text-[#94a3b8] truncate max-w-[300px]">
                      {am.description}
                    </td>
                    <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                      {am.cost} eb
                    </td>
                    <td className="py-1.5 px-3 text-right text-[#64748b] text-[10px]">
                      Consumible
                    </td>
                  </tr>
                ))}

                {/* Attachments in table */}
                {filteredAttachments.map((att: any) => (
                  <tr key={att.id} className="hover:bg-[#181b2a]/60 transition-colors">
                    <td className="py-1.5 px-3 font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]">
                      {att.name}
                    </td>
                    <td className="py-1.5 px-2">
                      <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
                        Accesorio
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-[11px] text-[#94a3b8] truncate max-w-[300px]">
                      {att.slots} ranuras • {att.description}
                    </td>
                    <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                      {att.cost} eb
                    </td>
                    <td className="py-1.5 px-3 text-right text-[#64748b] text-[10px]">
                      Accesorio
                    </td>
                  </tr>
                ))}

                {/* Drugs in table */}
                {filteredDrugs.map((d: any) => (
                  <tr key={d.id} className="hover:bg-[#181b2a]/60 transition-colors">
                    <td className="py-1.5 px-3 font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]">
                      {d.name}
                    </td>
                    <td className="py-1.5 px-2">
                      <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#ec4899]/15 text-[#ec4899] border border-[#ec4899]/30">
                        Droga
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-[11px] text-[#94a3b8] truncate max-w-[300px]">
                      {d.duration} {d.addictionDv > 0 ? `• DV ${d.addictionDv}` : ''} • {d.primaryEffect}
                    </td>
                    <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                      {d.cost} eb
                    </td>
                    <td className="py-1.5 px-3 text-right text-[#64748b] text-[10px]">
                      Dosis
                    </td>
                  </tr>
                ))}

                {/* Gear in table */}
                {filteredGear.map((g: any) => (
                  <tr key={g.id} className="hover:bg-[#181b2a]/60 transition-colors">
                    <td className="py-1.5 px-3 font-bold text-[#f1f5f9] font-tech text-xs truncate max-w-[200px]">
                      {g.name}
                    </td>
                    <td className="py-1.5 px-2">
                      <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#64748b]/15 text-[#cbd5e1] border border-[#262c3e]">
                        Equipo
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-[11px] text-[#94a3b8] truncate max-w-[300px]">
                      {g.description}
                    </td>
                    <td className="py-1.5 px-2 text-right text-[#f59e0b] font-bold">
                      {g.cost} eb
                    </td>
                    <td className="py-1.5 px-3 text-right text-[#64748b] text-[10px]">
                      Equipo
                    </td>
                  </tr>
                ))}
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
    </div>
  );
};
