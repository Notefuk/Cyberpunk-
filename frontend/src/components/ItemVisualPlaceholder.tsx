import React from 'react';
import { 
  Crosshair, 
  Target, 
  Shield, 
  Shirt, 
  HardHat, 
  Sword, 
  Flame, 
  Cpu, 
  Terminal,
  Zap,
  Radio
} from 'lucide-react';

interface Props {
  type: 'pistol' | 'rifle' | 'smg' | 'shotgun' | 'melee' | 'heavy' | 'armor_head' | 'armor_body' | 'shield' | 'cyberware' | 'program';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ItemVisualPlaceholder: React.FC<Props> = ({ type, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  }[size];

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  }[size];

  // Specific themes and icons based on category
  switch (type) {
    case 'pistol':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">HG</div>
          <Crosshair className={`${iconSizes} text-[#f43f5e] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">1H</div>
        </div>
      );

    case 'rifle':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">RF</div>
          <Target className={`${iconSizes} text-[#38bdf8] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">2H</div>
        </div>
      );

    case 'smg':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">SMG</div>
          <Zap className={`${iconSizes} text-[#f59e0b] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">AUTO</div>
        </div>
      );

    case 'shotgun':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">SG</div>
          <Radio className={`${iconSizes} text-[#e11d48] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">SLUG</div>
        </div>
      );

    case 'melee':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">CQC</div>
          <Sword className={`${iconSizes} text-[#f59e0b] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">½SP</div>
        </div>
      );

    case 'heavy':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">HVY</div>
          <Flame className={`${iconSizes} text-[#dc2626] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">EXP</div>
        </div>
      );

    case 'armor_body':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">BODY</div>
          <Shirt className={`${iconSizes} text-[#38bdf8] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">VEST</div>
        </div>
      );

    case 'armor_head':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">HEAD</div>
          <HardHat className={`${iconSizes} text-[#38bdf8] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">HELM</div>
        </div>
      );

    case 'shield':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">R-ARM</div>
          <Shield className={`${iconSizes} text-[#10b981] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">COVER</div>
        </div>
      );

    case 'cyberware':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">CYBER</div>
          <Cpu className={`${iconSizes} text-[#c084fc] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">SLOT</div>
        </div>
      );

    case 'program':
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center relative overflow-hidden group shadow-inner ${className}`}>
          <div className="absolute top-1 left-1 text-[8px] font-mono-code text-[#475569] leading-none">NET</div>
          <Terminal className={`${iconSizes} text-[#10b981] transition-transform group-hover:scale-110`} />
          <div className="absolute bottom-1 right-1 text-[7px] font-mono-code text-[#64748b]">CODE</div>
        </div>
      );

    default:
      return (
        <div className={`${sizeClasses} bg-[#161824] border border-[#262c3e] rounded-xs flex items-center justify-center text-[#64748b] ${className}`}>
          <Crosshair className={iconSizes} />
        </div>
      );
  }
};
