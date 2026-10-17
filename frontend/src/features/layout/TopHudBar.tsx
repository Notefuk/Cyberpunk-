import React from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useCombatStore } from '../../store/useCombatStore';
import { calculateMaxHp, calculateSeriouslyWoundedThreshold } from '../../engine/characterEngine';
import { 
  Users, 
  Settings, 
  Heart, 
  Shield, 
  Sparkles, 
  Brain, 
  Coins, 
  Skull
} from 'lucide-react';

interface TopHudBarProps {
  onOpenStreetLab?: () => void;
}

export const TopHudBar: React.FC<TopHudBarProps> = ({ onOpenStreetLab }) => {
  const characters = useCharacterStore((state) => state.characters);
  const activeCharacterId = useCharacterStore((state) => state.activeCharacterId);
  const setActiveCharacter = useCharacterStore((state) => state.setActiveCharacter);
  const getActiveCharacter = useCharacterStore((state) => state.getActiveCharacter);

  const era = useCombatStore((state) => state.era);
  const setEra = useCombatStore((state) => state.setEra);
  const appTheme = useCharacterStore((state) => state.appTheme);
  const setAppTheme = useCharacterStore((state) => state.setAppTheme);

  const activeChar = getActiveCharacter();
  const maxHp = calculateMaxHp(activeChar?.stats?.BODY ?? 6, activeChar?.stats?.WILL ?? 6);
  const seriousWoundThresh = calculateSeriouslyWoundedThreshold(maxHp);
  const isSeriouslyWounded = (activeChar?.currentHp ?? 0) < seriousWoundThresh;

  return (
    <header className="border-b border-[#1f222e] bg-[#101217]/95 backdrop-blur-md sticky top-0 z-50 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Callout */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#dc2626] flex items-center justify-center font-tech font-bold text-lg text-white shadow-lg shadow-[#dc2626]/20 chamfer-btn shrink-0">
            CP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech text-lg font-bold tracking-wider text-white">OMNI-DECK</span>
              <span className="text-[10px] font-mono-code bg-[#1f2330] border border-[#2b3042] text-[#94a3b8] px-1.5 py-0.5 rounded">
                v2.0 HUD
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
              <span className="flex items-center gap-1 text-[#10b981]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                SISTEMA OPERATIVO
              </span>
              <span>•</span>
              <span className="hidden sm:inline">OFFLINE PWA READY</span>
            </div>
          </div>
        </div>

        {/* Character Selector & Quick Stats HUD Strip */}
        <div className="flex flex-wrap items-center gap-3 bg-[#14161f] border border-[#222634] px-3 py-1.5 rounded-sm">
          
          {/* Active Character Dropdown */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-sm bg-[#1c202c] border border-[#2a3044] flex items-center justify-center text-[#f59e0b] font-bold text-xs shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <select
                  value={activeCharacterId}
                  onChange={(e) => setActiveCharacter(e.target.value)}
                  className="bg-[#0f1016] border border-[#262c3e] text-white font-tech font-bold text-xs rounded px-1.5 py-0.5 focus:outline-none focus:border-[#dc2626] cursor-pointer"
                  title="Cambiar personaje activo"
                >
                  {characters.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#121318] text-white">
                      {c.handle} ({c.role} {c.roleRank})
                    </option>
                  ))}
                </select>
                {onOpenStreetLab && (
                  <button
                    onClick={onOpenStreetLab}
                    className="p-1 bg-[#1a1d28] hover:bg-[#dc2626] text-[#94a3b8] hover:text-white rounded border border-[#2c3246] transition-colors"
                    title="Abrir Street Lab para editar o crear personajes"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="text-[10px] text-[#dc2626] font-mono-code leading-tight mt-0.5">
                {activeChar?.role?.toUpperCase()} // RANGO {activeChar?.roleRank}
              </div>
            </div>
          </div>

          <div className="hidden md:block h-6 w-px bg-[#222634]"></div>

          {/* Real-time Status Values */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono-code">
            {/* HP */}
            <div title="Puntos de Vida">
              <span className="text-[#64748b] text-[10px] flex items-center gap-1 leading-none">
                <Heart className="w-2.5 h-2.5 text-[#dc2626]" /> HP
              </span>
              <span className={`font-bold ${isSeriouslyWounded ? 'text-[#dc2626] animate-pulse' : 'text-white'}`}>
                {activeChar?.currentHp ?? 0}/{maxHp}
              </span>
            </div>

            {/* Armor SP */}
            <div title="Blindaje Cabeza / Torso">
              <span className="text-[#64748b] text-[10px] flex items-center gap-1 leading-none">
                <Shield className="w-2.5 h-2.5 text-[#38bdf8]" /> SP (C/T)
              </span>
              <span className="font-bold text-[#38bdf8]">
                {activeChar?.headArmor?.currentSp ?? 0}/{activeChar?.bodyArmor?.currentSp ?? 0}
              </span>
            </div>

            {/* LUCK */}
            <div title="Pool de Suerte">
              <span className="text-[#64748b] text-[10px] flex items-center gap-1 leading-none">
                <Sparkles className="w-2.5 h-2.5 text-[#f59e0b]" /> LUCK
              </span>
              <span className="font-bold text-[#f59e0b]">
                {activeChar?.currentLuck ?? 0}/{activeChar?.stats?.LUCK ?? 0}
              </span>
            </div>

            {/* HUMANITY */}
            <div title="Humanidad actual">
              <span className="text-[#64748b] text-[10px] flex items-center gap-1 leading-none">
                <Brain className="w-2.5 h-2.5 text-[#a855f7]" /> HUM
              </span>
              <span className="font-bold text-[#c084fc]">
                {activeChar?.currentHumanity ?? 0}
              </span>
            </div>

            {/* EURODOLLARS */}
            <div title="Eurodólares disponibles">
              <span className="text-[#64748b] text-[10px] flex items-center gap-1 leading-none">
                <Coins className="w-2.5 h-2.5 text-[#10b981]" /> €$
              </span>
              <span className="font-bold text-[#10b981]">
                {activeChar?.eurodollars ?? 0}
              </span>
            </div>

            {/* ACTIVE INJURIES */}
            <div title="Heridas Críticas Activas">
              <span className="text-[#64748b] text-[10px] flex items-center gap-1 leading-none">
                <Skull className="w-2.5 h-2.5 text-[#dc2626]" /> CRITS
              </span>
              <span className={`font-bold flex items-center gap-1 ${
                (activeChar?.activeInjuries?.length ?? 0) > 0 ? 'text-[#dc2626]' : 'text-[#10b981]'
              }`}>
                {activeChar?.activeInjuries?.length ?? 0}
              </span>
            </div>
          </div>

        </div>

        {/* Controles de Era y Selector de Tema Visual */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Selector */}
          <div className="flex bg-[#14161f] p-0.5 border border-[#222634] rounded-sm text-xs font-mono-code" title="Selector de Tema Visual del Omni-Deck">
            <button
              onClick={() => setAppTheme('neo_red')}
              className={`px-2 py-1 transition-all rounded-xs flex items-center gap-1 ${
                appTheme === 'neo_red'
                  ? 'bg-[#dc2626] text-white font-bold shadow-sm'
                  : 'text-[#64748b] hover:text-[#cbd5e1]'
              }`}
              title="🔴 Neo-Red 2045 (Rojo Clásico)"
            >
              <span>🔴</span>
              <span className="hidden sm:inline">NEO-RED</span>
            </button>
            <button
              onClick={() => setAppTheme('edgerunners_2077')}
              className={`px-2 py-1 transition-all rounded-xs flex items-center gap-1 ${
                appTheme === 'edgerunners_2077'
                  ? 'bg-[#fcee0a] text-black font-bold shadow-sm'
                  : 'text-[#64748b] hover:text-[#cbd5e1]'
              }`}
              title="🟡 Edgerunners 2077 (Amarillo Neón)"
            >
              <span>🟡</span>
              <span className="hidden sm:inline">2077</span>
            </button>
            <button
              onClick={() => setAppTheme('danger_gal_pink')}
              className={`px-2 py-1 transition-all rounded-xs flex items-center gap-1 ${
                appTheme === 'danger_gal_pink'
                  ? 'bg-[#ff2a85] text-white font-bold shadow-sm'
                  : 'text-[#64748b] hover:text-[#cbd5e1]'
              }`}
              title="🩷 Danger Gal Dossier (Rosa Neón)"
            >
              <span>🩷</span>
              <span className="hidden sm:inline">DANGER GAL</span>
            </button>
          </div>

          {/* Era Switcher */}
          <div className="flex bg-[#14161f] p-0.5 border border-[#222634] rounded-sm text-xs font-mono-code">
            <button 
              onClick={() => setEra('2045')}
              className={`px-3 py-1 transition-all rounded-xs ${
                era === '2045' 
                  ? 'bg-[#dc2626] text-white font-bold shadow-sm' 
                  : 'text-[#64748b] hover:text-[#cbd5e1]'
              }`}
            >
              2045 RED
            </button>
            <button 
              onClick={() => setEra('2077')}
              className={`px-3 py-1 transition-all rounded-xs ${
                era === '2077' 
                  ? 'bg-[#0284c7] text-white font-bold shadow-sm' 
                  : 'text-[#64748b] hover:text-[#cbd5e1]'
              }`}
            >
              2077 CEMK
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
