import { useState } from 'react';
import type { ActionType } from './KnockBar';
import { calculateXP } from '../utils/gamification';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DailyStatsProps {
  stats: Record<ActionType, number>;
  totalVolume?: number;
}

export const DailyStats = ({ stats, totalVolume = 0 }: DailyStatsProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const xp = calculateXP(stats);
  const commission = totalVolume * 0.20;

  // Minecraft-style XP Level system
  const currentLevel = Math.floor(xp / 200);
  const xpIntoCurrentLevel = xp % 200;
  const progressPercent = Math.min((xpIntoCurrentLevel / 200) * 100, 100);

  return (
    <div className="bg-white/95 backdrop-blur shadow-sm z-[500] flex-shrink-0 transition-all duration-300">
      
      {/* MINECRAFT XP BAR EXTRA SLIM */}
      <div className="relative pt-0.5">
        <div className="flex justify-between items-end mb-0.5 px-4 block">
          <span className="text-[6px] uppercase font-black tracking-widest text-[#55FF55] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            Lv{currentLevel}
          </span>
          <span className="text-[6px] uppercase font-black tracking-widest text-[#55FF55] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            {xp} XP
          </span>
        </div>
        
        <div className="h-1 w-full bg-gray-900 shadow-inner relative overflow-hidden flex">
           <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMTAwIiBmaWxsPSJibGFjayIvPjwvc3ZnPg==')] z-10 pointer-events-none"></div>
           <div 
            className="h-full bg-gradient-to-b from-[#55FF55] via-[#22CC22] to-[#00AA00] transition-all duration-500 ease-out z-0 relative shadow-[rgba(85,255,85,0.8)_0px_0px_2px_inset]" 
            style={{ width: `${progressPercent}%` }}
           >
             <div className="absolute top-0 left-0 right-0 h-px bg-white opacity-40"></div>
           </div>
        </div>
      </div>

      {/* COMPACT TICKER */}
      <div 
        className="flex justify-between items-center px-4 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3 text-xs font-bold font-mono tracking-tighter">
          <span className="text-gray-500">NH:<span className="text-gray-800 ml-1">{stats.notHome}</span></span>
          <span className="text-gray-300">|</span>
          <span className="text-red-500">NI:<span className="text-red-700 ml-1">{stats.notInterested}</span></span>
          <span className="text-gray-300">|</span>
          <span className="text-blue-500">L:<span className="text-blue-700 ml-1">{stats.lead}</span></span>
          <span className="text-gray-300">|</span>
          <span className="text-amber-500">S:<span className="text-amber-700 ml-1">{stats.sale}</span></span>
        </div>
        
        <div className="flex items-center space-x-2">
           <span className="text-[10px] font-black text-gray-800 tracking-wider font-sans">
             ${commission.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} <span className="text-gray-400">COMM</span>
           </span>
           <button className="text-gray-400 p-0.5 rounded-full hover:bg-gray-100">
             {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
           </button>
        </div>
      </div>

      {/* EXPANDED FULL CARDS */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 animate-[slide-down_0.2s_ease-out]">
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">NH</span>
              <span className="text-lg font-black text-gray-700">{stats.notHome}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-red-50 border border-red-100">
              <span className="text-[10px] text-red-500 font-bold mb-1 uppercase tracking-wider">NI</span>
              <span className="text-lg font-black text-red-600">{stats.notInterested}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50 border border-blue-100">
              <span className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-wider">Lead</span>
              <span className="text-lg font-black text-blue-600">{stats.lead}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-amber-50 border border-amber-100 shadow-[inset_0_2px_4px_rgba(197,160,89,0.1)]">
              <span className="text-[10px] text-gold font-bold mb-1 uppercase tracking-wider">Sale</span>
              <span className="text-lg font-black text-gold">{stats.sale}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
