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
  Info
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

interface FeedbackState {
  id: string;
  message: string;
}

export const CompendiumView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CompendiumCategory>('all');
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
    }, 2000);
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
    { key: 'all', label: 'Todo el Compendio', count: 272, icon: <Package className="w-4 h-4" /> },
    { key: 'weapons', label: 'Armas', count: coreData.weapons?.length || 0, icon: <Crosshair className="w-4 h-4" /> },
    { key: 'armor', label: 'Blindajes', count: coreData.armor?.length || 0, icon: <Shield className="w-4 h-4" /> },
    { key: 'cyberware', label: 'Ciberware', count: coreData.cyberware?.length || 0, icon: <Cpu className="w-4 h-4" /> },
    { key: 'programs', label: 'Programas & ICE', count: coreData.programs?.length || 0, icon: <Terminal className="w-4 h-4" /> },
    { key: 'ammunition', label: 'Munición', count: coreData.ammunition?.length || 0, icon: <Disc className="w-4 h-4" /> },
    { key: 'attachments', label: 'Accesorios', count: coreData.attachments?.length || 0, icon: <Wrench className="w-4 h-4" /> },
    { key: 'drugs', label: 'Drogas & Farmacia', count: coreData.drugs?.length || 0, icon: <Pill className="w-4 h-4" /> },
    { key: 'gear', label: 'Equipo General', count: coreData.gear?.length || 0, icon: <Package className="w-4 h-4" /> }
  ];

  const filteredWeapons = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'weapons') return [];
    return (coreData.weapons || []).filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skill?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedCategory]);

  const filteredArmor = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'armor') return [];
    return (coreData.armor || []).filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedCategory]);

  const filteredCyberware = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'cyberware') return [];
    return (coreData.cyberware || []).filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedCategory]);

  const filteredPrograms = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'programs') return [];
    return (coreData.programs || []).filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.class?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedCategory]);

  const filteredAmmo = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'ammunition') return [];
    return (coreData.ammunition || []).filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedCategory]);

  const filteredAttachments = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'attachments') return [];
    return (coreData.attachments || []).filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedCategory]);

  const filteredDrugs = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'drugs') return [];
    return (coreData.drugs || []).filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.primaryEffect?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.secondaryEffect?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedCategory]);

  const filteredGear = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'gear') return [];
    return (coreData.gear || []).filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="space-y-6">
      {/* Search and Category Filter Header */}
      <div className="bg-[#12141f] border border-[#262c3e] p-4 rounded-xs chamfer-card space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en el catálogo oficial..."
              className="w-full bg-[#181b2a] border border-[#262c3e] pl-9 pr-4 py-2 text-sm text-[#f1f5f9] rounded-xs focus:outline-hidden focus:border-[#38bdf8] font-mono-code"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748b] hover:text-[#f1f5f9]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-code text-[#64748b]">
            <Info className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Ficha activa: <strong className="text-[#f1f5f9]">{activeChar.handle}</strong> ({activeChar.role})</span>
            <span className="text-[#38bdf8] border-l border-[#262c3e] pl-2">{totalResults} resultados</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1c2030]">
          {categoriesConfig.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono-code transition-colors cursor-pointer chamfer-btn ${
                  isSelected
                    ? 'bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8]'
                    : 'bg-[#181b2a] border border-[#262c3e] text-[#94a3b8] hover:text-[#f1f5f9] hover:border-[#38bdf8]/50'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#0f111a] text-[#64748b]">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Results */}
      <div className="space-y-8">
        {/* WEAPONS SECTION */}
        {filteredWeapons.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#262c3e] pb-2">
              <h3 className="text-sm font-bold text-[#f43f5e] font-mono-code flex items-center gap-2 uppercase tracking-wider">
                <Crosshair className="w-4 h-4" /> Armamento ({filteredWeapons.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredWeapons.map((weapon: any) => {
                const isEquipped = activeChar.equippedWeapons.some((w) => w.id === weapon.id);
                const visualType = getVisualTypeForWeapon(weapon);
                return (
                  <div
                    key={weapon.id}
                    className="bg-[#12141f] border border-[#262c3e] hover:border-[#f43f5e]/50 p-3.5 rounded-xs chamfer-card flex flex-col justify-between space-y-3 transition-colors"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <ItemVisualPlaceholder type={visualType} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-sm font-bold text-[#f1f5f9] truncate font-tech">{weapon.name}</h4>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#1c2030] text-[#f59e0b] font-mono-code shrink-0">
                              {weapon.cost} eb
                            </span>
                          </div>
                          <div className="text-[11px] text-[#64748b] font-mono-code flex items-center gap-2 mt-0.5">
                            <span className="text-[#38bdf8]">{weapon.skill}</span>
                            <span>•</span>
                            <span>{weapon.type}</span>
                            <span>•</span>
                            <span>{weapon.hands}H</span>
                          </div>
                        </div>
                      </div>

                      {/* Weapon stats bar */}
                      <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-[#1a1e2d] text-center font-mono-code text-[11px]">
                        <div className="bg-[#181b2a] p-1 rounded-xs">
                          <span className="text-[9px] text-[#64748b] block">DAÑO</span>
                          <span className="text-[#f43f5e] font-bold">{weapon.damage}</span>
                        </div>
                        <div className="bg-[#181b2a] p-1 rounded-xs">
                          <span className="text-[9px] text-[#64748b] block">ROF</span>
                          <span className="text-[#f1f5f9] font-bold">{weapon.rof}</span>
                        </div>
                        <div className="bg-[#181b2a] p-1 rounded-xs">
                          <span className="text-[9px] text-[#64748b] block">CARGADOR</span>
                          <span className="text-[#38bdf8] font-bold">{weapon.standardMag || '—'}</span>
                        </div>
                      </div>

                      {weapon.altFireModes && (
                        <div className="mt-2 text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2 py-0.5 rounded-xs font-mono-code">
                          ⚡ {weapon.altFireModes}
                        </div>
                      )}

                      {weapon.notes && (
                        <p className="mt-2 text-[11px] text-[#94a3b8] line-clamp-2 leading-relaxed">
                          {weapon.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#1a1e2d] flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#64748b] font-mono-code">
                        {isEquipped ? (
                          <span className="text-[#10b981] flex items-center gap-1">
                            <Check className="w-3 h-3" /> Equipado ({activeChar.equippedWeapons.filter(w => w.id === weapon.id).length})
                          </span>
                        ) : 'No equipado'}
                      </span>
                      <button
                        onClick={() => {
                          equipWeaponFromCatalog(weapon as WeaponItem);
                          showFeedback(weapon.id, '¡Arma equipada en la ficha!');
                        }}
                        className="px-2.5 py-1 bg-[#f43f5e]/20 hover:bg-[#f43f5e] border border-[#f43f5e] text-[#f43f5e] hover:text-white rounded-xs text-[11px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn flex items-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3 h-3" /> EQUIPAR ARMA
                      </button>
                    </div>

                    {feedback?.id === weapon.id && (
                      <div className="text-[10px] text-[#10b981] font-mono-code bg-[#10b981]/10 border border-[#10b981]/30 py-0.5 text-center rounded-xs animate-pulse">
                        {feedback?.message}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ARMOR SECTION */}
        {filteredArmor.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#262c3e] pb-2">
              <h3 className="text-sm font-bold text-[#38bdf8] font-mono-code flex items-center gap-2 uppercase tracking-wider">
                <Shield className="w-4 h-4" /> Blindajes & Escudos ({filteredArmor.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredArmor.map((armor: any) => {
                const isHeadEquipped = activeChar.headArmor.name.includes(armor.name);
                const isBodyEquipped = activeChar.bodyArmor.name.includes(armor.name);
                const isShield = armor.id === 'bulletproof-shield';
                return (
                  <div
                    key={armor.id}
                    className="bg-[#12141f] border border-[#262c3e] hover:border-[#38bdf8]/50 p-3.5 rounded-xs chamfer-card flex flex-col justify-between space-y-3 transition-colors"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <ItemVisualPlaceholder type={isShield ? 'shield' : 'armor_body'} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-sm font-bold text-[#f1f5f9] truncate font-tech">{armor.name}</h4>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#1c2030] text-[#f59e0b] font-mono-code shrink-0">
                              {armor.cost} eb
                            </span>
                          </div>
                          <div className="text-[11px] text-[#64748b] font-mono-code flex items-center gap-2 mt-0.5">
                            <span className="text-[#38bdf8]">SP {armor.sp}</span>
                            <span>•</span>
                            <span className={armor.penalty < 0 ? 'text-[#f43f5e]' : 'text-[#10b981]'}>
                              Penalizador: {armor.penalty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-[11px] text-[#94a3b8] leading-relaxed">
                        {armor.description}
                      </p>

                      <div className="mt-2 text-[10px] text-[#64748b] font-mono-code flex gap-2">
                        <span>Cabeza: {isHeadEquipped ? <strong className="text-[#10b981]">Equipado</strong> : 'No'}</span>
                        <span>•</span>
                        <span>Cuerpo: {isBodyEquipped ? <strong className="text-[#10b981]">Equipado</strong> : 'No'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1a1e2d] flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          equipArmorFromCatalog(armor as ArmorItem, 'head');
                          showFeedback(armor.id, '¡Equipado en Cabeza!');
                        }}
                        className="flex-1 py-1 bg-[#181b2a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8] rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn active:scale-95"
                      >
                        CABEZA
                      </button>
                      <button
                        onClick={() => {
                          equipArmorFromCatalog(armor as ArmorItem, 'body');
                          showFeedback(armor.id, '¡Equipado en Cuerpo!');
                        }}
                        className="flex-1 py-1 bg-[#181b2a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8] rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn active:scale-95"
                      >
                        CUERPO
                      </button>
                      <button
                        onClick={() => {
                          equipArmorFromCatalog(armor as ArmorItem, 'both');
                          showFeedback(armor.id, '¡Equipado en Cabeza y Cuerpo!');
                        }}
                        className="flex-1 py-1 bg-[#38bdf8]/20 hover:bg-[#38bdf8] border border-[#38bdf8] text-[#38bdf8] hover:text-[#0b0e17] rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn active:scale-95"
                      >
                        AMBOS
                      </button>
                    </div>

                    {feedback?.id === armor.id && (
                      <div className="text-[10px] text-[#10b981] font-mono-code bg-[#10b981]/10 border border-[#10b981]/30 py-0.5 text-center rounded-xs animate-pulse">
                        {feedback?.message}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CYBERWARE SECTION */}
        {filteredCyberware.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#262c3e] pb-2">
              <h3 className="text-sm font-bold text-[#a855f7] font-mono-code flex items-center gap-2 uppercase tracking-wider">
                <Cpu className="w-4 h-4" /> Ciberware ({filteredCyberware.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCyberware.map((cyber: any) => {
                const isInstalled = activeChar.installedCyberwareIds.includes(cyber.id);
                return (
                  <div
                    key={cyber.id}
                    className="bg-[#12141f] border border-[#262c3e] hover:border-[#a855f7]/50 p-3.5 rounded-xs chamfer-card flex flex-col justify-between space-y-3 transition-colors"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <ItemVisualPlaceholder type="cyberware" size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-sm font-bold text-[#f1f5f9] truncate font-tech">{cyber.name}</h4>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#1c2030] text-[#f59e0b] font-mono-code shrink-0">
                              {cyber.cost} eb
                            </span>
                          </div>
                          <div className="text-[11px] text-[#64748b] font-mono-code flex items-center gap-2 mt-0.5">
                            <span className="text-[#a855f7]">{cyber.type}</span>
                            <span>•</span>
                            <span>Instalación: {cyber.install}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 bg-[#181b2a] px-2.5 py-1 rounded-xs flex items-center justify-between text-[11px] font-mono-code">
                        <span className="text-[#64748b]">Pérdida de Humanidad:</span>
                        <span className="text-[#f43f5e] font-bold">{cyber.humanityLoss}</span>
                      </div>

                      <p className="mt-2 text-[11px] text-[#94a3b8] leading-relaxed">
                        {cyber.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#1a1e2d] flex items-center justify-between">
                      <span className="text-[10px] font-mono-code">
                        {isInstalled ? (
                          <span className="text-[#10b981] flex items-center gap-1">
                            <Check className="w-3 h-3" /> Instalado en chasis
                          </span>
                        ) : (
                          <span className="text-[#64748b]">No instalado</span>
                        )}
                      </span>
                      <button
                        onClick={() => {
                          toggleCyberwareInstall(cyber.id);
                          showFeedback(cyber.id, isInstalled ? '¡Ciberware desinstalado!' : '¡Ciberware instalado!');
                        }}
                        className={`px-3 py-1 rounded-xs text-[10px] font-mono-code font-bold transition-all cursor-pointer chamfer-btn active:scale-95 ${
                          isInstalled
                            ? 'bg-[#f43f5e]/20 hover:bg-[#f43f5e] border border-[#f43f5e] text-[#f43f5e] hover:text-white'
                            : 'bg-[#a855f7]/20 hover:bg-[#a855f7] border border-[#a855f7] text-[#a855f7] hover:text-white'
                        }`}
                      >
                        {isInstalled ? 'DESINSTALAR' : 'INSTALAR'}
                      </button>
                    </div>

                    {feedback?.id === cyber.id && (
                      <div className="text-[10px] text-[#10b981] font-mono-code bg-[#10b981]/10 border border-[#10b981]/30 py-0.5 text-center rounded-xs animate-pulse">
                        {feedback?.message}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROGRAMS SECTION */}
        {filteredPrograms.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#262c3e] pb-2">
              <h3 className="text-sm font-bold text-[#10b981] font-mono-code flex items-center gap-2 uppercase tracking-wider">
                <Terminal className="w-4 h-4" /> Programas de Netrunning & Black ICE ({filteredPrograms.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPrograms.map((prog: any) => (
                <div
                  key={prog.id}
                  className="bg-[#12141f] border border-[#262c3e] hover:border-[#10b981]/50 p-3.5 rounded-xs chamfer-card flex flex-col justify-between space-y-3 transition-colors"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <ItemVisualPlaceholder type="program" size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-[#f1f5f9] truncate font-tech">{prog.name}</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#1c2030] text-[#f59e0b] font-mono-code shrink-0">
                            {prog.cost} eb
                          </span>
                        </div>
                        <span className="text-[11px] text-[#10b981] font-mono-code block mt-0.5">
                          {prog.class}
                        </span>
                      </div>
                    </div>

                    {/* ICE / Program stats */}
                    {(prog.atk !== undefined || prog.rez !== undefined) && (
                      <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-[#1a1e2d] text-center font-mono-code text-[11px]">
                        <div className="bg-[#181b2a] p-1 rounded-xs">
                          <span className="text-[9px] text-[#64748b] block">ATK</span>
                          <span className="text-[#f43f5e] font-bold">{prog.atk ?? '—'}</span>
                        </div>
                        <div className="bg-[#181b2a] p-1 rounded-xs">
                          <span className="text-[9px] text-[#64748b] block">DEF</span>
                          <span className="text-[#38bdf8] font-bold">{prog.def ?? '—'}</span>
                        </div>
                        <div className="bg-[#181b2a] p-1 rounded-xs">
                          <span className="text-[9px] text-[#64748b] block">REZ</span>
                          <span className="text-[#10b981] font-bold">{prog.rez ?? '—'}</span>
                        </div>
                      </div>
                    )}

                    <p className="mt-2 text-[11px] text-[#94a3b8] leading-relaxed">
                      {prog.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AMMUNITION SECTION */}
        {filteredAmmo.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#262c3e] pb-2">
              <h3 className="text-sm font-bold text-[#f59e0b] font-mono-code flex items-center gap-2 uppercase tracking-wider">
                <Disc className="w-4 h-4" /> Tipos de Munición Oficial ({filteredAmmo.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAmmo.map((ammo: any) => (
                <div
                  key={ammo.id}
                  className="bg-[#12141f] border border-[#262c3e] hover:border-[#f59e0b]/50 p-3.5 rounded-xs chamfer-card space-y-2 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#f1f5f9] font-tech flex items-center gap-2">
                      <Disc className="w-3.5 h-3.5 text-[#f59e0b]" /> {ammo.name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#1c2030] text-[#f59e0b] font-mono-code">
                      {ammo.cost} eb
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                    {ammo.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTACHMENTS SECTION */}
        {filteredAttachments.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#262c3e] pb-2">
              <h3 className="text-sm font-bold text-[#38bdf8] font-mono-code flex items-center gap-2 uppercase tracking-wider">
                <Wrench className="w-4 h-4" /> Accesorios de Armas ({filteredAttachments.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAttachments.map((att: any) => (
                <div
                  key={att.id}
                  className="bg-[#12141f] border border-[#262c3e] hover:border-[#38bdf8]/50 p-3.5 rounded-xs chamfer-card space-y-2 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#f1f5f9] font-tech flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-[#38bdf8]" /> {att.name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#1c2030] text-[#f59e0b] font-mono-code">
                      {att.cost} eb ({att.slots} ranuras)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                    {att.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DRUGS SECTION */}
        {filteredDrugs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#262c3e] pb-2">
              <h3 className="text-sm font-bold text-[#ec4899] font-mono-code flex items-center gap-2 uppercase tracking-wider">
                <Pill className="w-4 h-4" /> Drogas Callejeras & Fármacos ({filteredDrugs.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDrugs.map((drug: any) => (
                <div
                  key={drug.id}
                  className="bg-[#12141f] border border-[#262c3e] hover:border-[#ec4899]/50 p-3.5 rounded-xs chamfer-card space-y-2.5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#f1f5f9] font-tech flex items-center gap-2">
                      <Pill className="w-3.5 h-3.5 text-[#ec4899]" /> {drug.name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#1c2030] text-[#f59e0b] font-mono-code">
                      {drug.cost} eb ({drug.duration})
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono-code bg-[#181b2a] p-2 rounded-xs border border-[#262c3e]">
                    <div>
                      <span className="text-[#10b981] font-bold">Efecto Primario: </span>
                      <span className="text-[#cbd5e1]">{drug.primaryEffect}</span>
                    </div>
                    {drug.secondaryEffect && (
                      <div>
                        <span className="text-[#f43f5e] font-bold">Secundario (DV{drug.addictionDv}): </span>
                        <span className="text-[#cbd5e1]">{drug.secondaryEffect}</span>
                      </div>
                    )}
                  </div>

                  {drug.description && (
                    <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                      {drug.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GEAR SECTION */}
        {filteredGear.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#262c3e] pb-2">
              <h3 className="text-sm font-bold text-[#e2e8f0] font-mono-code flex items-center gap-2 uppercase tracking-wider">
                <Package className="w-4 h-4" /> Equipo General de Supervivencia ({filteredGear.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredGear.map((g: any) => (
                <div
                  key={g.id}
                  className="bg-[#12141f] border border-[#262c3e] hover:border-[#64748b] p-3.5 rounded-xs chamfer-card space-y-2 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#f1f5f9] font-tech flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-[#64748b]" /> {g.name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#1c2030] text-[#f59e0b] font-mono-code">
                      {g.cost} eb
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                    {g.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalResults === 0 && (
          <div className="bg-[#12141f] border border-[#262c3e] p-8 rounded-xs text-center space-y-2">
            <p className="text-sm text-[#94a3b8] font-mono-code">
              No se encontraron ítems en el catálogo que coincidan con &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs text-[#38bdf8] hover:underline font-mono-code cursor-pointer"
            >
              Restablecer búsqueda y filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
