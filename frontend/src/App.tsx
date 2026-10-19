import { useState } from 'react';
import { 
  Crosshair, 
  User, 
  BookOpen, 
  FolderArchive, 
  Terminal, 
  Cpu,
  UserPlus,
  Network,
  Train,
  FileText
} from 'lucide-react';
import { useCharacterStore } from './store/useCharacterStore';
import { TopHudBar } from './features/layout/TopHudBar';
import { CombatHudView } from './features/combat/CombatHudView';
import { StreetLabView } from './features/sheet/StreetLabView';
import { CharacterCreatorWizard } from './features/creator/CharacterCreatorWizard';
import { CyberwareRipperdocView } from './features/cyberware/CyberwareRipperdocView';
import { CompendiumView } from './features/compendium/CompendiumView';
import { DataPackManagerView } from './features/datapacks/DataPackManagerView';
import { FixerDeckView } from './features/gm/FixerDeckView';
import { NetAndRolesDeckView } from './features/netroles/NetAndRolesDeckView';
import { RedChromeCargoView } from './features/oneshot/RedChromeCargoView';
import { RulesCheatSheetDrawer } from './features/rules/RulesCheatSheetDrawer';
import { SystemChangelogAndDocsView } from './features/docs/SystemChangelogAndDocsView';

type TabKey = 'combat' | 'sheet' | 'cyberware' | 'netroles' | 'compendium' | 'packs' | 'gm' | 'oneshot' | 'creator' | 'docs';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('combat');
  const appTheme = useCharacterStore((state) => state.appTheme);

  const themeConfig = {
    neo_red: {
      activeTab: 'border-[#dc2626] text-white bg-[#dc2626]/10 font-bold',
      activeIcon: 'text-[#dc2626]',
      selection: 'selection:bg-[#dc2626] selection:text-white',
      accentLine: 'bg-[#dc2626]'
    },
    edgerunners_2077: {
      activeTab: 'border-[#fcee0a] text-white bg-[#fcee0a]/15 font-bold shadow-[0_0_12px_rgba(252,238,10,0.15)]',
      activeIcon: 'text-[#fcee0a]',
      selection: 'selection:bg-[#fcee0a] selection:text-black',
      accentLine: 'bg-[#fcee0a]'
    },
    danger_gal_pink: {
      activeTab: 'border-[#ff2a85] text-white bg-[#ff2a85]/15 font-bold shadow-[0_0_12px_rgba(255,42,133,0.15)]',
      activeIcon: 'text-[#ff2a85]',
      selection: 'selection:bg-[#ff2a85] selection:text-white',
      accentLine: 'bg-[#ff2a85]'
    }
  }[appTheme || 'neo_red'];

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
      id: 'netroles',
      label: 'NET, ROLES & VEHÍCULOS',
      icon: <Network className="w-4 h-4" />
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
    },
    {
      id: 'oneshot',
      label: '🚆 RED CHROME CARGO',
      icon: <Train className="w-4 h-4 text-red-500" />
    },
    {
      id: 'creator',
      label: 'CREAR PJ // WIZARD',
      icon: <UserPlus className="w-4 h-4" />
    },
    {
      id: 'docs',
      label: '📜 DOCS & CHANGELOG',
      icon: <FileText className="w-4 h-4 text-cyan-400" />
    }
  ];

  return (
    <div className={`min-h-screen bg-[#0a0b0e] text-[#cbd5e1] flex flex-col font-sans ${themeConfig.selection}`}>
      {/* Barra de acento de Tema Visual */}
      <div className={`h-[2px] w-full ${themeConfig.accentLine}`} />

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
                    ? themeConfig.activeTab
                    : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#151720]'
                }`}
              >
                <span className={isActive ? themeConfig.activeIcon : 'text-[#64748b] group-hover:text-[#cbd5e1]'}>
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
        {activeTab === 'creator' && (
          <CharacterCreatorWizard
            onClose={() => setActiveTab('sheet')}
            onComplete={() => setActiveTab('sheet')}
          />
        )}
        {activeTab === 'cyberware' && <CyberwareRipperdocView />}
        {activeTab === 'netroles' && <NetAndRolesDeckView />}
        {activeTab === 'compendium' && <CompendiumView />}
        {activeTab === 'packs' && <DataPackManagerView onNavigateTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'gm' && <FixerDeckView />}
        {activeTab === 'oneshot' && <RedChromeCargoView />}
        {activeTab === 'docs' && <SystemChangelogAndDocsView />}
      </main>

      {/* Rules Cheat Sheet Drawer persistente */}
      <RulesCheatSheetDrawer />
    </div>
  );
}
