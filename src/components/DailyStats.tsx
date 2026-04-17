import type { ActionType } from './KnockBar';
import { calculateXP } from '../utils/gamification';

interface DailyStatsProps {
  stats: Record<ActionType, number>;
  totalVolume?: number;
}

export const DailyStats = ({ stats, totalVolume = 0 }: DailyStatsProps) => {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const xp = calculateXP(stats);
  const commission = totalVolume * 0.20;

  // Minecraft-style XP Level system (arbitrarily level up every 200 XP)
  const currentLevel = Math.floor(xp / 200);
  const xpIntoCurrentLevel = xp % 200;
  const progressPercent = Math.min((xpIntoCurrentLevel / 200) * 100, 100);

  return (
    <div className="bg-white px-4 py-3 shadow-sm z-20 flex-shrink-0">
      
      {/* MINECRAFT XP BAR SLIMMED */}
      <div className="mb-2 relative pt-1">
        <div className="flex justify-between items-end mb-0.5">
          <span className="text-[8px] uppercase font-black tracking-widest text-[#55FF55] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            Level {currentLevel}
          </span>
          <span className="text-[8px] uppercase font-black tracking-widest text-[#55FF55] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            {xp} XP
          </span>
        </div>
        
        <div className="h-1.5 w-full bg-gray-900 border border-gray-700 shadow-inner relative overflow-hidden flex">
           {/* Notched background for blocky feel */}
           <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMTAwIiBmaWxsPSJibGFjayIvPjwvc3ZnPg==')] z-10 pointer-events-none"></div>
           <div 
            className="h-full bg-gradient-to-b from-[#55FF55] via-[#22CC22] to-[#00AA00] transition-all duration-500 ease-out z-0 relative shadow-[rgba(85,255,85,0.8)_0px_0px_5px_inset]" 
            style={{ width: `${progressPercent}%` }}
           >
             <div className="absolute top-0 left-0 right-0 h-px bg-white opacity-40"></div>
           </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-2">
        <h1 className="text-xl font-bold text-gray-800">Daily Stats</h1>
        <div className="text-right leading-tight">
          <span className="block text-lg font-bold text-gray-800">${commission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Comm</span></span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Knocks: {total}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
          <span className="text-xs text-gray-500 font-bold mb-1">NH</span>
          <span className="text-lg font-black text-gray-700">{stats.notHome}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-red-50 border border-red-100">
          <span className="text-xs text-red-500 font-bold mb-1">NI</span>
          <span className="text-lg font-black text-red-600">{stats.notInterested}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50 border border-blue-100">
          <span className="text-xs text-blue-600 font-bold mb-1">Lead</span>
          <span className="text-lg font-black text-blue-600">{stats.lead}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-amber-50 border border-amber-100 shadow-[inset_0_2px_4px_rgba(197,160,89,0.1)]">
          <span className="text-xs text-gold font-bold mb-1">Sale</span>
          <span className="text-lg font-black text-gold">{stats.sale}</span>
        </div>
      </div>
    </div>
  );
};
