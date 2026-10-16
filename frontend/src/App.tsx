import { useState } from 'react';
import { 
  Crosshair, 
  User, 
  BookOpen, 
  FolderArchive, 
  Terminal, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TopHudBar } from './features/layout/TopHudBar';
import { CombatHudView } from './features/combat/CombatHudView';
import { StreetLabView } from './features/sheet/StreetLabView';
import { CompendiumView } from './features/compendium/CompendiumView';
import { DataPacksView } from './features/packs/DataPacksView';

type TabKey = 'combat' | 'sheet' | 'compendium' | 'packs' | 'gm';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('combat');

  const tabs: Array<{ id: TabKey; label: string; icon: React.ReactNode }> = [
    {
      id: 'combat',
      label: 'ACTIVE COMBAT // HUD',
      icon: <Crosshair className="w-4 h-4" />
    },
    {
      id: 'sheet',
      label: 'STREET LAB // FICHA & ARSENAL',
      icon: <User className="w-4 h-4" />
    },
    {
      id: 'compendium',
      label: 'MASTER COMPENDIUM // 272 ÍTEMS',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'packs',
      label: 'DATA PACKS // .CPRPACK',
      icon: <FolderArchive className="w-4 h-4" />
    },
    {
      id: 'gm',
      label: 'FIXER DECK // GM OPS',
      icon: <Terminal className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-[#cbd5e1] flex flex-col font-sans selection:bg-[#dc2626] selection:text-white">
      {/* HUD Superior Persistente */}
      <TopHudBar onOpenStreetLab={() => setActiveTab('sheet')} />

      {/* Barra de Navegación Táctica */}
      <nav className="border-b border-[#1f222e] bg-[#0d0e13] px-4 sticky top-[57px] z-40">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 py-3 px-4 border-b-2 font-tech text-sm tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#dc2626] text-white bg-[#dc2626]/10 font-bold'
                    : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#151720]'
                }`}
              >
                <span className={isActive ? 'text-[#dc2626]' : 'text-[#64748b] group-hover:text-[#cbd5e1]'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Contenedor Principal de Vistas Modulares */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'combat' && <CombatHudView />}
        {activeTab === 'sheet' && <StreetLabView />}
        {activeTab === 'compendium' && <CompendiumView />}
        {activeTab === 'packs' && <DataPacksView />}
        {activeTab === 'gm' && (
          <div className="chamfer-card p-8 bg-[#121319] border border-[#232736] max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 border-b border-[#1f2230] pb-4">
              <Terminal className="w-8 h-8 text-[#10b981]" />
              <div>
                <h2 className="font-tech text-xl font-bold text-white tracking-wider">
                  FIXER DECK // GM OPS & CAMPAIGN CONSOLE
                </h2>
                <p className="text-xs text-[#64748b] font-mono-code mt-0.5">
                  Módulo de Operaciones para Directores de Juego • Cyberpunk RED Architecture
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#171923] p-4 rounded-sm border border-[#24293a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-tech text-sm font-bold text-white uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#f59e0b]" /> ESTADO DEL SISTEMA (SPRINT 1 & 2)
                  </span>
                  <span className="text-[10px] font-mono-code bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded font-bold">
                    ONLINE
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Motor de reglas oficial completado al 100%: 272 ítems del Core Rulebook v1.24 extraídos, matriz de 22 heridas críticas con penalizadores dinámicos, telémetro de 8 franjas con autofire y explosión de dados 1d10 en 2 pasos.
                </p>
              </div>

              <div className="bg-[#171923] p-4 rounded-sm border border-[#24293a] space-y-2">
                <span className="font-tech text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-[#38bdf8]" /> ACCIONES RÁPIDAS
                </span>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab('combat')}
                    className="flex items-center justify-between px-3 py-2 bg-[#202534] hover:bg-[#dc2626] text-white text-xs font-tech font-bold rounded-xs transition-colors"
                  >
                    <span>IR AL HUD DE COMBATE TÁCTICO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('sheet')}
                    className="flex items-center justify-between px-3 py-2 bg-[#202534] hover:bg-[#38bdf8] hover:text-black text-white text-xs font-tech font-bold rounded-xs transition-colors"
                  >
                    <span>IR AL STREET LAB (EDITOR DE EDGERUNNER)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('compendium')}
                    className="flex items-center justify-between px-3 py-2 bg-[#202534] hover:bg-[#10b981] hover:text-black text-white text-xs font-tech font-bold rounded-xs transition-colors"
                  >
                    <span>ABRIR COMPENDIO MASTER (272 ÍTEMS)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#101217] rounded border border-[#1e2332] text-xs font-mono-code text-[#64748b] flex items-center justify-between">
              <span>Siguiente fase: Danger Gal Dossier NPC Library & Combat Encounter Simulator</span>
              <span className="text-[#38bdf8]">v2.0 Modular</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
