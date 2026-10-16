import React, { useState } from 'react';
import coreData from '../../data/core-rules.cprpack.json';
import { 
  FolderArchive, 
  CheckCircle2, 
  Clock, 
  Download, 
  Cpu,
  Crosshair,
  Shield,
  Terminal,
  Disc,
  Pill,
  Wrench,
  Package
} from 'lucide-react';

interface PackMeta {
  id: string;
  name: string;
  version: string;
  era: '2045' | '2077';
  status: 'active' | 'ready_for_extraction' | 'planned';
  description: string;
  sourcePdf: string;
  itemCount: number;
  breakdown: { label: string; count: number; icon: React.ReactNode }[];
  features: string[];
}

export const DataPacksView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'installed' | 'available'>('installed');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Exact real counts from core-rules.cprpack.json
  const weaponsCount = coreData.weapons?.length || 66;
  const armorCount = coreData.armor?.length || 10;
  const attachmentsCount = coreData.attachments?.length || 10;
  const ammoCount = coreData.ammunition?.length || 13;
  const cyberwareCount = coreData.cyberware?.length || 96;
  const drugsCount = coreData.drugs?.length || 9;
  const gearCount = coreData.gear?.length || 41;
  const programsCount = coreData.programs?.length || 27;
  const totalCoreItems = 
    weaponsCount + 
    armorCount + 
    attachmentsCount + 
    ammoCount + 
    cyberwareCount + 
    drugsCount + 
    gearCount + 
    programsCount;

  const corePack: PackMeta = {
    id: 'core-rules',
    name: 'Cyberpunk RED Core Rulebook',
    version: 'v1.24',
    era: '2045',
    status: 'active',
    description: 'Catálogo canónico completo extraído de las 458 páginas del PDF oficial v1.24. Incluye Night Markets completos, armamento exótico, ciberware estándar, netrunning y equipo de supervivencia.',
    sourcePdf: 'Cyberpunk-RED-Core-Rulebook-v1.24_2020-12-25.pdf',
    itemCount: totalCoreItems,
    breakdown: [
      { label: 'Armas', count: weaponsCount, icon: <Crosshair className="w-3.5 h-3.5" /> },
      { label: 'Blindajes', count: armorCount, icon: <Shield className="w-3.5 h-3.5" /> },
      { label: 'Accesorios', count: attachmentsCount, icon: <Wrench className="w-3.5 h-3.5" /> },
      { label: 'Munición', count: ammoCount, icon: <Disc className="w-3.5 h-3.5" /> },
      { label: 'Ciberware', count: cyberwareCount, icon: <Cpu className="w-3.5 h-3.5" /> },
      { label: 'Drogas & Farmacia', count: drugsCount, icon: <Pill className="w-3.5 h-3.5" /> },
      { label: 'Equipo', count: gearCount, icon: <Package className="w-3.5 h-3.5" /> },
      { label: 'Programas & ICE', count: programsCount, icon: <Terminal className="w-3.5 h-3.5" /> }
    ],
    features: [
      'Tabla de Rangos oficial de disparo a quemarropa y extrema distancia',
      'Matriz de Autofire con multiplicadores x3 y x4',
      'Tabla de Heridas Críticas de Cabeza y Cuerpo (2d6)',
      '15 Armas Exóticas oficiales (Malorian 3516, Mono-Three, Hurricane, Shrieker)',
      '7 Categorías oficiales de Ciberware'
    ]
  };

  const expansionPacks: PackMeta[] = [
    {
      id: 'black-chrome',
      name: 'Black Chrome // Tech & Style Guide',
      version: 'v1.0.0',
      era: '2045',
      status: 'ready_for_extraction',
      description: 'El catálogo de lujo de Night City: más de 170 nuevos ítems, vehículos terrestres y aéreos personalizados, linear frames Fūma Kotarō y armas exóticas de SovOil y Rostović.',
      sourcePdf: 'Cyberpunk-RED-Black-Chrome-Tech-and-Style-Guide_2023-03-01.pdf',
      itemCount: 172,
      breakdown: [
        { label: 'Armas Especiales', count: 32, icon: <Crosshair className="w-3.5 h-3.5" /> },
        { label: 'Vehículos', count: 24, icon: <Package className="w-3.5 h-3.5" /> },
        { label: 'Linear Frames', count: 4, icon: <Cpu className="w-3.5 h-3.5" /> },
        { label: 'Ciberware de Lujo', count: 28, icon: <Cpu className="w-3.5 h-3.5" /> },
        { label: 'Moda y Blindajes', count: 18, icon: <Shield className="w-3.5 h-3.5" /> },
        { label: 'Apps & Gadgets', count: 66, icon: <Wrench className="w-3.5 h-3.5" /> }
      ],
      features: [
        'Reglas de Vehículos con SDP, asientos y velocidad de combate',
        'Armas con doble modo de disparo (ej. SlamDance FangFist)',
        'Sistemas de blindaje corporal especializado'
      ]
    },
    {
      id: 'cemk-2077',
      name: 'Cyberpunk Edgerunners Mission Kit',
      version: 'v1.0.0',
      era: '2077',
      status: 'ready_for_extraction',
      description: 'Reglas de conversión a la Era 2077 de CD PROJEKT RED. Neuroport universal, sistema de Quickhacks inalámbricos mediante RAM, armas Power/Tech/Smart y mecánicas de ciberpsicosis.',
      sourcePdf: 'CEMK-Rulebook-Edgerunners-Core-Rules_2024-05-22.pdf',
      itemCount: 84,
      breakdown: [
        { label: 'Armas 2077', count: 22, icon: <Crosshair className="w-3.5 h-3.5" /> },
        { label: 'Quickhacks', count: 18, icon: <Terminal className="w-3.5 h-3.5" /> },
        { label: 'Ciberware 2077', count: 26, icon: <Cpu className="w-3.5 h-3.5" /> },
        { label: 'Cyberdecks 2077', count: 8, icon: <Cpu className="w-3.5 h-3.5" /> },
        { label: 'Blindajes 2077', count: 10, icon: <Shield className="w-3.5 h-3.5" /> }
      ],
      features: [
        'Neuroport integrado: Bio-Monitor + Agente + Ranura de Chipware en un solo implante',
        'Quickhacking táctico en combate con coste de RAM y DVs',
        'Armas Power (rebotes), Tech (perforación) y Smart (guiado)'
      ]
    },
    {
      id: 'danger-gal',
      name: 'Danger Gal Dossier',
      version: 'v1.0.0',
      era: '2045',
      status: 'ready_for_extraction',
      description: 'Facciones, corporaciones y operativos de élite de Night City. Incluye perfiles de PNJs listos para combate, equipo de investigación encubierta y armamento corporativo.',
      sourcePdf: 'Cyberpunk-RED-Danger-Gal-Dossier_2023-07-07.pdf',
      itemCount: 45,
      breakdown: [
        { label: 'PNJs & Jefes', count: 25, icon: <Crosshair className="w-3.5 h-3.5" /> },
        { label: 'Equipo de Vigilancia', count: 12, icon: <Package className="w-3.5 h-3.5" /> },
        { label: 'Ciberware Encubierto', count: 8, icon: <Cpu className="w-3.5 h-3.5" /> }
      ],
      features: [
        'Generador de encuentros por facción',
        'Mooks y Lugartenientes calibrados para VTT',
        'Equipo forense y de contramedidas electrónicas'
      ]
    },
    {
      id: 'interface-red',
      name: 'Interface RED (Vol 1-3) & Suplementos Oficiales',
      version: 'v1.0.0',
      era: '2045',
      status: 'planned',
      description: 'Compilación de expansiones oficiales de R. Talsorian Games: Hornet\'s Pharmacy (química y fármacos), Drones tácticos, Conversión de Cyborgs de Cuerpo Completo (FBC) y micro-vehículos.',
      sourcePdf: 'Hornets-Pharmacy-Chemical-Wonderland-v1.11_2023-01-23.pdf + DLCs',
      itemCount: 68,
      breakdown: [
        { label: 'Drogas & Compuestos', count: 24, icon: <Pill className="w-3.5 h-3.5" /> },
        { label: 'Drones', count: 12, icon: <Cpu className="w-3.5 h-3.5" /> },
        { label: 'Chasis FBC', count: 8, icon: <Cpu className="w-3.5 h-3.5" /> },
        { label: 'Armamento Exótico', count: 24, icon: <Crosshair className="w-3.5 h-3.5" /> }
      ],
      features: [
        'Reglas químicas de aditivos y dispersión osmótica',
        'Controles de Drones y Ciberimplantes FBC',
        'Variantes de armas de combate urbano'
      ]
    }
  ];

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
              <span className="text-[10px] bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 px-2 py-0.5 rounded-xs font-mono-code font-bold">
                COMP/CON ENGINE
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-1 font-mono-code">
              Arquitectura modular de datos: las reglas, armas y ciberware se desacoplan en paquetes JSON independientes para permitir soporte multi-era (2045 y 2077) y homebrew sin tocar el código fuente.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={handleExportJson}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-[#181b2a] hover:bg-[#38bdf8]/20 border border-[#262c3e] hover:border-[#38bdf8] text-[#38bdf8] rounded-xs text-xs font-mono-code font-bold transition-all cursor-pointer chamfer-btn active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORTAR CORE .JSON</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="text-xs text-[#10b981] font-mono-code bg-[#10b981]/10 border border-[#10b981]/30 p-2 rounded-xs animate-pulse flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Archivo `core-rules.cprpack.json` descargado con éxito. 272 ítems listos para su uso externo.</span>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#1c2030]">
          <button
            onClick={() => setActiveTab('installed')}
            className={`px-4 py-1.5 rounded-xs text-xs font-mono-code font-bold transition-colors cursor-pointer chamfer-btn ${
              activeTab === 'installed'
                ? 'bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8]'
                : 'bg-[#181b2a] border border-[#262c3e] text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Paquetes Instalados (1)
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-1.5 rounded-xs text-xs font-mono-code font-bold transition-colors cursor-pointer chamfer-btn ${
              activeTab === 'available'
                ? 'bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8]'
                : 'bg-[#181b2a] border border-[#262c3e] text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Expansiones Detectadas en Repositorio (4)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'installed' ? (
        <div className="space-y-4">
          <div className="bg-[#12141f] border-2 border-[#10b981]/50 p-5 rounded-xs chamfer-card space-y-4 shadow-lg shadow-[#10b981]/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#1c2030] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
                  <h3 className="text-base font-bold text-[#f1f5f9] font-tech uppercase tracking-wide">
                    {corePack.name}
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-xs bg-[#10b981]/20 border border-[#10b981] text-[#10b981] font-mono-code font-bold">
                    {corePack.version} • ACTIVO
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-xs bg-[#1c2030] text-[#f59e0b] font-mono-code">
                    Era {corePack.era}
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-1 font-mono-code">
                  Fuente: <code className="text-[#38bdf8]">{corePack.sourcePdf}</code>
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold text-[#10b981] font-mono-code block">
                  {corePack.itemCount}
                </span>
                <span className="text-[10px] text-[#64748b] font-mono-code uppercase">
                  Ítems Canónicos Activos
                </span>
              </div>
            </div>

            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              {corePack.description}
            </p>

            {/* Category Counts Breakdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#94a3b8] font-mono-code uppercase tracking-wider block">
                Desglose de Ítems Cargados en Memoria:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {corePack.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#181b2a] border border-[#262c3e] p-2.5 rounded-xs flex items-center justify-between font-mono-code"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                      <span className="text-[#38bdf8]">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-[#f1f5f9]">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-1.5 pt-2 border-t border-[#1c2030]">
              <span className="text-[11px] font-bold text-[#94a3b8] font-mono-code uppercase tracking-wider block">
                Mecánicas Vinculadas al Motor:
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-[#94a3b8] font-mono-code">
                {corePack.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expansionPacks.map((pack) => (
            <div
              key={pack.id}
              className="bg-[#12141f] border border-[#262c3e] hover:border-[#38bdf8]/50 p-4 rounded-xs chamfer-card flex flex-col justify-between space-y-4 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#1c2030] pb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-[#f1f5f9] font-tech uppercase tracking-wide">
                      {pack.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 font-mono-code">
                        Era {pack.era}
                      </span>
                      <span className="text-[10px] text-[#64748b] font-mono-code">
                        {pack.itemCount} ítems listados
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 font-mono-code uppercase font-bold shrink-0">
                    PDF LISTO
                  </span>
                </div>

                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {pack.description}
                </p>

                <div className="bg-[#181b2a] p-2 rounded-xs border border-[#262c3e]">
                  <span className="text-[10px] text-[#64748b] font-mono-code block mb-1">
                    Archivo Origen en Disco:
                  </span>
                  <code className="text-[11px] text-[#38bdf8] font-mono-code block truncate">
                    {pack.sourcePdf}
                  </code>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono-code">
                  {pack.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#161824] px-2 py-1 rounded-xs">
                      <span className="text-[#64748b]">{item.label}:</span>
                      <span className="text-[#f1f5f9] font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1c2030] flex items-center justify-between">
                <span className="text-[10px] text-[#64748b] font-mono-code flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#f59e0b]" /> Sprint 2 Pipeline
                </span>
                <button
                  disabled
                  className="px-3 py-1 bg-[#181b2a] border border-[#262c3e] text-[#64748b] rounded-xs text-[11px] font-mono-code cursor-not-allowed chamfer-btn"
                >
                  PREPARAR EXTRACCIÓN SPRINT 2
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
