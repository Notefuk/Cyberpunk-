import { useState } from 'react';
import { 
  Crosshair, 
  User, 
  BookOpen, 
  FolderArchive, 
  Terminal, 
  Cpu
} from 'lucide-react';
import { TopHudBar } from './features/layout/TopHudBar';
import { CombatHudView } from './features/combat/CombatHudView';
import { StreetLabView } from './features/sheet/StreetLabView';
import { CyberwareRipperdocView } from './features/cyberware/CyberwareRipperdocView';
import { CompendiumView } from './features/compendium/CompendiumView';
import { DataPacksView } from './features/packs/DataPacksView';
import { FixerDeckView } from './features/gm/FixerDeckView';
import { RulesCheatSheetDrawer } from './features/rules/RulesCheatSheetDrawer';

type TabKey = 'combat' | 'sheet' | 'cyberware' | 'compendium' | 'packs' | 'gm';

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
      id: 'cyberware',
      label: 'CYBERWARE // RIPPERDOC',
      icon: <Cpu className="w-4 h-4" />
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
        {activeTab === 'cyberware' && <CyberwareRipperdocView />}
        {activeTab === 'compendium' && <CompendiumView />}
        {activeTab === 'packs' && <DataPacksView />}
        {activeTab === 'gm' && <FixerDeckView />}
      </main>

      {/* Rules Cheat Sheet Drawer persistente */}
      <RulesCheatSheetDrawer />
    </div>
  );
}
