import React, { useState, useMemo } from 'react';
import coreData from '../../data/core-rules.cprpack.json';
import { useCharacterStore } from '../../store/useCharacterStore';
import { ItemVisualPlaceholder } from '../../components/ItemVisualPlaceholder';
import type { WeaponItem, ArmorItem } from '../../types/cyberpunk';
import { RANGE_BRACKETS, WEAPON_RANGE_PROFILES, getWeaponProfileKey } from '../../data/rangeTables';
import { getAutofireRulesSummary } from '../../engine/characterEngine';
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
  ChevronUp,
  Coins,
  AlertCircle
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

export const CompendiumView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CompendiumCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [spendMoneyMode, setSpendMoneyMode] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const getActiveCharacter = useCharacterStore((state) => state.getActiveCharacter);
  const equipWeaponFromCatalog = useCharacterStore((state) => state.equipWeaponFromCatalog);
  const equipArmorFromCatalog = useCharacterStore((state) => state.equipArmorFromCatalog);
  const toggleCyberwareInstall = useCharacterStore((state) => state.toggleCyberwareInstall);
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

  /* Helper to render rich mechanical details */
  const renderItemDetails = (item: any, category: CompendiumCategory) => {
    if (category === 'weapons') {
      const isMelee = item.type === 'Melee' || !item.standardMag;
      const profileKey = getWeaponProfileKey(item.name, item.type);
      const profile = profileKey ? WEAPON_RANGE_PROFILES[profileKey] : null;
      const autofireRules = getAutofireRulesSummary(item as WeaponItem);

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
          {/* Notes / Description */}
          {item.notes && (
            <p className="text-[#cbd5e1] text-[11px] leading-relaxed bg-[#0b0e17] p-2 rounded-xs border border-[#1e2337]">
              {item.notes}
            </p>
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
      const isInstalled = activeChar.installedCyberwareIds.includes(item.id);

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
              <span>Tipo: <strong className="text-[#f1f5f9]">{item.type}</strong></span>
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
              Estado: <strong className={isInstalled ? 'text-[#10b981]' : 'text-[#94a3b8]'}>{isInstalled ? 'Instalado' : 'No instalado'}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              {isInstalled ? (
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

    // Default for programs, ammo, attachments, gear
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#f43f5e]/40 p-2 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      {/* Ultra-compact Header (~26px) */}
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <ItemVisualPlaceholder type={visualType} size="sm" className="w-6 h-6 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={weapon.name}>
                              {weapon.name}
                            </h4>
                            <span className="text-[10px] text-[#f59e0b] font-mono-code">
                              {weapon.cost} eb
                            </span>
                          </div>
                        </div>

                        {/* Top-Right Quick Action Button */}
                        <button
                          onClick={() => {
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

                      {/* Stat Pills in 1 Single Horizontal Strip */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono-code">
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

                      {/* Accordion Toggle Bar */}
                      <button
                        onClick={() => toggleExpand(weapon.id)}
                        className="w-full pt-1 border-t border-[#1e2337] flex items-center justify-between text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? '▾ CERRAR' : '▸ VER DETALLES'}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#181b2a] border border-[#262c3e] text-[#94a3b8]">
                          {isExpanded ? <ChevronUp className="w-2.5 h-2.5 inline" /> : <ChevronDown className="w-2.5 h-2.5 inline" />}
                        </span>
                      </button>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="pt-2 border-t border-[#262c3e]">
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#38bdf8]/40 p-2 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={armor.name}>
                            {armor.name}
                          </h4>
                          <span className="text-[10px] text-[#f59e0b] font-mono-code">
                            {armor.cost} eb
                          </span>
                        </div>

                        {/* Quick Equip Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleAcquire(armor.id, `${armor.name} (Cabeza)`, armor.cost, spendMoneyMode ? 'buy' : 'loot', () => equipArmorFromCatalog(armor as ArmorItem, 'head'))}
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
                            onClick={() => handleAcquire(armor.id, `${armor.name} (Cuerpo)`, armor.cost, spendMoneyMode ? 'buy' : 'loot', () => equipArmorFromCatalog(armor as ArmorItem, 'body'))}
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
                            onClick={() => handleAcquire(armor.id, `${armor.name} (Ambos)`, armor.cost, spendMoneyMode ? 'buy' : 'loot', () => equipArmorFromCatalog(armor as ArmorItem, 'both'))}
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

                      {/* Accordion Toggle Bar */}
                      <button
                        onClick={() => toggleExpand(armor.id)}
                        className="w-full pt-1 border-t border-[#1e2337] flex items-center justify-between text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? '▾ CERRAR' : '▸ VER DETALLES'}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#181b2a] border border-[#262c3e] text-[#94a3b8]">
                          {isExpanded ? <ChevronUp className="w-2.5 h-2.5 inline" /> : <ChevronDown className="w-2.5 h-2.5 inline" />}
                        </span>
                      </button>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="pt-2 border-t border-[#262c3e]">
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
                  const isInstalled = activeChar.installedCyberwareIds.includes(cyber.id);
                  const isExpanded = expandedItemId === cyber.id;

                  return (
                    <div
                      key={cyber.id}
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#a855f7]/40 p-2 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
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
                          {isInstalled ? 'Desinstalar' : spendMoneyMode ? `💳 -${cyber.cost} eb` : '🎁 + Instalar'}
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

                      {/* Accordion Toggle Bar */}
                      <button
                        onClick={() => toggleExpand(cyber.id)}
                        className="w-full pt-1 border-t border-[#1e2337] flex items-center justify-between text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? '▾ CERRAR' : '▸ VER DETALLES'}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#181b2a] border border-[#262c3e] text-[#94a3b8]">
                          {isExpanded ? <ChevronUp className="w-2.5 h-2.5 inline" /> : <ChevronDown className="w-2.5 h-2.5 inline" />}
                        </span>
                      </button>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="pt-2 border-t border-[#262c3e]">
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#10b981]/40 p-2 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={prog.name}>
                          {prog.name}
                        </h4>
                        <button
                          onClick={() => handleAcquire(prog.id, prog.name, prog.cost, spendMoneyMode ? 'buy' : 'loot', () => {})}
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

                      <button
                        onClick={() => toggleExpand(prog.id)}
                        className="w-full pt-1 border-t border-[#1e2337] flex items-center justify-between text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? '▾ CERRAR' : '▸ VER DETALLES'}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#181b2a] border border-[#262c3e] text-[#94a3b8]">
                          {isExpanded ? <ChevronUp className="w-2.5 h-2.5 inline" /> : <ChevronDown className="w-2.5 h-2.5 inline" />}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="pt-2 border-t border-[#262c3e]">
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#f59e0b]/40 p-2 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={ammo.name}>
                          {ammo.name}
                        </h4>
                        <button
                          onClick={() => handleAcquire(ammo.id, ammo.name, ammo.cost, spendMoneyMode ? 'buy' : 'loot', () => {})}
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
                      <button
                        onClick={() => toggleExpand(ammo.id)}
                        className="w-full pt-1 border-t border-[#1e2337] flex items-center justify-between text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? '▾ CERRAR' : '▸ VER DETALLES'}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#181b2a] border border-[#262c3e] text-[#94a3b8]">
                          {isExpanded ? <ChevronUp className="w-2.5 h-2.5 inline" /> : <ChevronDown className="w-2.5 h-2.5 inline" />}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="pt-2 border-t border-[#262c3e]">
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#38bdf8]/40 p-2 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={att.name}>
                          {att.name}
                        </h4>
                        <button
                          onClick={() => handleAcquire(att.id, att.name, att.cost, spendMoneyMode ? 'buy' : 'loot', () => {})}
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
                      <button
                        onClick={() => toggleExpand(att.id)}
                        className="w-full pt-1 border-t border-[#1e2337] flex items-center justify-between text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? '▾ CERRAR' : '▸ VER DETALLES'}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#181b2a] border border-[#262c3e] text-[#94a3b8]">
                          {isExpanded ? <ChevronUp className="w-2.5 h-2.5 inline" /> : <ChevronDown className="w-2.5 h-2.5 inline" />}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="pt-2 border-t border-[#262c3e]">
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#ec4899]/40 p-2 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={drug.name}>
                          {drug.name}
                        </h4>
                        <button
                          onClick={() => handleAcquire(drug.id, drug.name, drug.cost, spendMoneyMode ? 'buy' : 'loot', () => {})}
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
                      <button
                        onClick={() => toggleExpand(drug.id)}
                        className="w-full pt-1 border-t border-[#1e2337] flex items-center justify-between text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? '▾ CERRAR' : '▸ VER DETALLES'}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#181b2a] border border-[#262c3e] text-[#94a3b8]">
                          {isExpanded ? <ChevronUp className="w-2.5 h-2.5 inline" /> : <ChevronDown className="w-2.5 h-2.5 inline" />}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="pt-2 border-t border-[#262c3e]">
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
                      className="bg-[#12141f] border border-[#262c3e] hover:border-[#64748b]/40 p-2 rounded-xs chamfer-card space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1.5 min-h-[26px]">
                        <h4 className="text-xs font-bold text-[#f1f5f9] truncate font-tech" title={g.name}>
                          {g.name}
                        </h4>
                        <button
                          onClick={() => handleAcquire(g.id, g.name, g.cost, spendMoneyMode ? 'buy' : 'loot', () => {})}
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
                      <button
                        onClick={() => toggleExpand(g.id)}
                        className="w-full pt-1 border-t border-[#1e2337] flex items-center justify-between text-[10px] font-mono-code text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? '▾ CERRAR' : '▸ VER DETALLES'}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#181b2a] border border-[#262c3e] text-[#94a3b8]">
                          {isExpanded ? <ChevronUp className="w-2.5 h-2.5 inline" /> : <ChevronDown className="w-2.5 h-2.5 inline" />}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="pt-2 border-t border-[#262c3e]">
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
                          <td colSpan={5} className="p-3">
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
                          <td colSpan={5} className="p-3">
                            {renderItemDetails(a, 'armor')}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Cyberware in table */}
                {filteredCyberware.map((c: any) => {
                  const isInstalled = activeChar.installedCyberwareIds.includes(c.id);
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
                            {isInstalled ? 'Desinstalar' : spendMoneyMode ? `💳 -${c.cost} eb` : '🎁 + Instalar'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#0f111a] border-b border-[#262c3e]">
                          <td colSpan={5} className="p-3">
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
                          <td colSpan={5} className="p-3">
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
                            <span>{am.name}</span>
                          </div>
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
                          <td colSpan={5} className="p-3">
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
                          <td colSpan={5} className="p-3">
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
                          <td colSpan={5} className="p-3">
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
                          <td colSpan={5} className="p-3">
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
    </div>
  );
};
