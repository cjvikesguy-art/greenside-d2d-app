import type { ActionType } from './KnockBar';
import { calculateXP } from '../utils/gamification';

interface DailyStatsProps {
  stats: Record<ActionType, number>;
}

export const DailyStats = ({ stats }: DailyStatsProps) => {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const xp = calculateXP(stats);

  return (
    <div className="bg-white px-4 py-3 shadow-sm z-20 flex-shrink-0">
      <div className="flex justify-between items-end mb-2">
        <h1 className="text-xl font-bold text-gray-800">Daily Stats</h1>
        <div className="text-right leading-tight">
          <span className="block text-lg font-bold text-rolex-green">{xp} XP</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total: {total}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
          <span className="text-xs text-gray-500 font-medium mb-1">NH</span>
          <span className="text-lg font-bold text-gray-700">{stats.notHome}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-red-50 border border-red-100">
          <span className="text-xs text-red-500 font-medium mb-1">NI</span>
          <span className="text-lg font-bold text-red-600">{stats.notInterested}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50 border border-blue-100">
          <span className="text-xs text-blue-600 font-medium mb-1">Lead</span>
          <span className="text-lg font-bold text-blue-600">{stats.lead}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-amber-50 border border-amber-100">
          <span className="text-xs text-gold font-medium mb-1">Sale</span>
          <span className="text-lg font-bold text-gold">{stats.sale}</span>
        </div>
      </div>
    </div>
  );
};
