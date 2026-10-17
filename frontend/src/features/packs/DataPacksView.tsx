import React, { useState, useMemo } from 'react';
import coreData from '../../data/core-rules.cprpack.json';
import { SOURCEBOOKS_CATALOG, EXPANSION_RULE_SYSTEMS } from '../../data/expansionRulesData';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';
import type { SourceBookId } from '../../data/enemiesCatalog';
import { 
  FolderArchive, 
  CheckCircle2, 
  Download, 
  Cpu,
  Crosshair,
  Shield,
  Terminal,
  Pill,
  Wrench,
  Package,
  Skull,
  Layers
} from 'lucide-react';

interface PackDetail {
  id: SourceBookId;
  name: string;
  version: string;
  era: '2045' | '2077';
  status: 'active';
  description: string;
  sourcePdf: string;
  accentColor: string;
  itemCount: number;
  enemiesCount: number;
  systemsCount: number;
  breakdown: { label: string; count: number; icon: React.ReactNode }[];
  features: string[];
}

export const DataPacksView: React.FC = () => {
  const [activeEraFilter, setActiveEraFilter] = useState<'all' | '2045' | '2077'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Compute live breakdown per sourcebook
  const packs: PackDetail[] = useMemo(() => {
    const bookSources: Record<SourceBookId, { pdf: string; version: string }> = {
      core: { pdf: 'Cyberpunk-RED-Core-Rulebook-v1.24_2020-12-25.pdf', version: 'v1.24' },
      black_chrome: { pdf: 'Cyberpunk-RED-Black-Chrome-Tech-and-Style-Guide_2023-03-01.pdf', version: 'v1.0.0' },
      cemk_2077: { pdf: 'CEMK-Rulebook-Edgerunners-Core-Rules_2024-05-22.pdf', version: 'v1.0.0' },
      interface_red: { pdf: 'Interface-RED-Vol-3-Going-Metal-FBC.pdf', version: 'v1.0.0' },
      danger_gal: { pdf: 'Cyberpunk-RED-Danger-Gal-Dossier_2023-07-07.pdf', version: 'v1.0.0' },
      dlc: { pdf: 'Hornets-Pharmacy-v1.11.pdf + 12-Days-of-Gunmas.pdf', version: 'v1.0.0' }
    };

    const bookIds: SourceBookId[] = ['core', 'black_chrome', 'cemk_2077', 'interface_red', 'danger_gal', 'dlc'];

    return bookIds.map((id) => {
      const meta = SOURCEBOOKS_CATALOG.find((b) => b.id === id) || SOURCEBOOKS_CATALOG[1];
      const weapons = (coreData.weapons || []).filter((w: any) => (w.sourceBook || 'core') === id).length;
      const armor = (coreData.armor || []).filter((a: any) => (a.sourceBook || 'core') === id).length;
      const cyberware = (coreData.cyberware || []).filter((c: any) => (c.sourceBook || 'core') === id).length;
      const ammo = (coreData.ammunition || []).filter((am: any) => (am.sourceBook || 'core') === id).length;
      const attachments = (coreData.attachments || []).filter((at: any) => (at.sourceBook || 'core') === id).length;
      const drugs = (coreData.drugs || []).filter((d: any) => (d.sourceBook || 'core') === id).length;
      const gear = (coreData.gear || []).filter((g: any) => (g.sourceBook || 'core') === id).length;
      const programs = (coreData.programs || []).filter((p: any) => (p.sourceBook || 'core') === id).length;
      const enemies = ENEMIES_CATALOG.filter((e) => e.sourceBook === id).length;
      const systems = EXPANSION_RULE_SYSTEMS.filter((s) => s.sourceBook === id).length;

      const totalItems = weapons + armor + cyberware + ammo + attachments + drugs + gear + programs;

      const breakdown = [
        { label: 'Armas', count: weapons, icon: <Crosshair className="w-3.5 h-3.5 text-[#f43f5e]" /> },
        { label: 'Blindajes', count: armor, icon: <Shield className="w-3.5 h-3.5 text-[#38bdf8]" /> },
        { label: 'Ciberware & Chasis', count: cyberware, icon: <Cpu className="w-3.5 h-3.5 text-[#a855f7]" /> },
        { label: 'Drogas & Farmacia', count: drugs, icon: <Pill className="w-3.5 h-3.5 text-[#ec4899]" /> },
        { label: 'Programas & Hacks', count: programs, icon: <Terminal className="w-3.5 h-3.5 text-[#10b981]" /> },
        { label: 'Equipo & Gadgets', count: gear, icon: <Package className="w-3.5 h-3.5 text-[#94a3b8]" /> },
        { label: 'Accesorios & Munición', count: attachments + ammo, icon: <Wrench className="w-3.5 h-3.5 text-[#f59e0b]" /> },
        { label: 'Enemigos Canónicos', count: enemies, icon: <Skull className="w-3.5 h-3.5 text-[#ef4444]" /> },
        { label: 'Sistemas de Reglas', count: systems, icon: <Layers className="w-3.5 h-3.5 text-[#00f0ff]" /> }
      ].filter((b) => b.count > 0);

      const features = [...meta.keyHighlights, ...meta.mechanicsIntroduced];

      return {
        id,
        name: meta.title,
        version: bookSources[id].version,
        era: (meta.era === 'both' ? '2045' : meta.era) as '2045' | '2077',
        status: 'active' as const,
        description: meta.whatItBringsSummary,
        sourcePdf: bookSources[id].pdf,
        accentColor: meta.accentColor,
        itemCount: totalItems,
        enemiesCount: enemies,
        systemsCount: systems,
        breakdown,
        features
      };
    });
  }, []);

  const totalCatalogItems = useMemo(() => {
    return (
      (coreData.weapons?.length || 0) +
      (coreData.armor?.length || 0) +
      (coreData.cyberware?.length || 0) +
      (coreData.ammunition?.length || 0) +
      (coreData.attachments?.length || 0) +
      (coreData.drugs?.length || 0) +
      (coreData.gear?.length || 0) +
      (coreData.programs?.length || 0)
    );
  }, []);

  const filteredPacks = useMemo(() => {
    if (activeEraFilter === 'all') return packs;
    return packs.filter((p) => p.era === activeEraFilter);
  }, [activeEraFilter, packs]);

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(coreData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'core-rules.cprpack.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141f] border border-[#262c3e] p-5 rounded-xs chamfer-card space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-[#38bdf8]" />
              <h2 className="text-lg font-bold text-[#f1f5f9] font-tech uppercase tracking-wide">
                Gestor de Paquetes de Reglas (.cprpack)
              </h2>
              <span className="text-[10px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 px-2 py-0.5 rounded-xs font-mono-code font-bold">
                6 MANUALES ACTIVOS & CARGADOS
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-1 font-mono-code leading-relaxed">
              Biblioteca oficial desacoplada: <strong>{totalCatalogItems} ítems canónicos</strong>, <strong>{ENEMIES_CATALOG.length} perfiles de enemigos</strong> y <strong>{EXPANSION_RULE_SYSTEMS.length} sistemas de reglas avanzadas</strong> cargados en memoria y sincronizados con el motor de combate.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={handleExportJson}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 bg-[#181b2a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8] rounded-xs text-xs font-mono-code font-bold transition-all cursor-pointer chamfer-btn active:scale-95 shadow-sm"
              title="Descargar paquete consolidado .cprpack.json con 368 ítems"
            >
              <Download className="w-4 h-4" />
              <span>EXPORTAR PACK MAESTRO .JSON ({totalCatalogItems})</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="text-xs text-[#10b981] font-mono-code bg-[#10b981]/10 border border-[#10b981]/30 p-2 rounded-xs animate-pulse flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Archivo `core-rules.cprpack.json` descargado con éxito. 368 ítems listos para su uso externo.</span>
          </div>
        )}

        {/* Tab / Era Switch */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#1c2030]">
          <button
            onClick={() => setActiveEraFilter('all')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-mono-code font-bold transition-colors cursor-pointer chamfer-btn ${
              activeEraFilter === 'all'
                ? 'bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8]'
                : 'bg-[#181b2a] border border-[#262c3e] text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Todos los Manuales Activos ({packs.length})
          </button>
          <button
            onClick={() => setActiveEraFilter('2045')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-mono-code font-bold transition-colors cursor-pointer chamfer-btn ${
              activeEraFilter === '2045'
                ? 'bg-[#ff003c]/20 border border-[#ff003c] text-[#ff003c]'
                : 'bg-[#181b2a] border border-[#262c3e] text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Era 2045 ({packs.filter((p) => p.era === '2045').length})
          </button>
          <button
            onClick={() => setActiveEraFilter('2077')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-mono-code font-bold transition-colors cursor-pointer chamfer-btn ${
              activeEraFilter === '2077'
                ? 'bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66]'
                : 'bg-[#181b2a] border border-[#262c3e] text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Era 2077 ({packs.filter((p) => p.era === '2077').length})
          </button>
        </div>
      </div>

      {/* Main Grid: All Active Packs */}
      <div className="space-y-4">
        {filteredPacks.map((pack) => (
          <div
            key={pack.id}
            className="bg-[#12141f] border-2 rounded-xs chamfer-card p-5 space-y-4 shadow-lg transition-all"
            style={{ borderColor: `${pack.accentColor}50` }}
          >
            {/* Cabecera del Paquete */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1c2030] pb-3.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-ping"
                    style={{ backgroundColor: pack.accentColor }}
                  />
                  <h3 className="text-base font-bold text-[#f1f5f9] font-tech uppercase tracking-wide">
                    {pack.name}
                  </h3>
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-xs font-mono-code font-bold border"
                    style={{
                      backgroundColor: `${pack.accentColor}20`,
                      borderColor: `${pack.accentColor}60`,
                      color: pack.accentColor
                    }}
                  >
                    {pack.version} • ACTIVO & CARGADO
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-xs bg-[#1c2030] text-[#f59e0b] font-mono-code font-bold">
                    Era {pack.era}
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] font-mono-code">
                  PDF Canónico en Repositorio: <code className="text-[#38bdf8]">{pack.sourcePdf}</code>
                </p>
              </div>

              {/* Contadores Clave */}
              <div className="flex items-center gap-4 text-right">
                {pack.itemCount > 0 && (
                  <div>
                    <span className="text-xl font-bold font-mono-code block text-cyan-300">
                      {pack.itemCount}
                    </span>
                    <span className="text-[10px] text-[#64748b] font-mono-code uppercase">
                      Ítems
                    </span>
                  </div>
                )}
                {pack.enemiesCount > 0 && (
                  <div>
                    <span className="text-xl font-bold font-mono-code block text-red-400">
                      {pack.enemiesCount}
                    </span>
                    <span className="text-[10px] text-[#64748b] font-mono-code uppercase">
                      Enemigos
                    </span>
                  </div>
                )}
                {pack.systemsCount > 0 && (
                  <div>
                    <span className="text-xl font-bold font-mono-code block text-purple-300">
                      {pack.systemsCount}
                    </span>
                    <span className="text-[10px] text-[#64748b] font-mono-code uppercase">
                      Sistemas
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción Introductoria */}
            <p className="text-xs text-[#cbd5e1] font-mono-code leading-relaxed">
              {pack.description}
            </p>

            {/* Desglose de Contenido Extraído */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#94a3b8] font-mono-code uppercase tracking-wider block">
                Desglose Real Cargado en Memoria:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {pack.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#181b2a] border border-[#262c3e] p-2.5 rounded-xs flex items-center justify-between font-mono-code"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-[#f1f5f9]">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Características y Reglas del Manual */}
            <div className="space-y-1.5 pt-2 border-t border-[#1c2030]">
              <span className="text-[11px] font-bold text-[#94a3b8] font-mono-code uppercase tracking-wider block">
                Mecánicas & Aspectos Clave Vinculados al Motor:
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-[#94a3b8] font-mono-code">
                {pack.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
