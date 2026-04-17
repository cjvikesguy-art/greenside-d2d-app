import { useState } from 'react';
import { Trophy, Swords } from 'lucide-react';
import { calculateXP } from '../utils/gamification';
import type { KnockRecord } from '../types';

interface LeaderboardProps {
  history: KnockRecord[];
  onClose: () => void;
}

export const Leaderboard = ({ history, onClose }: LeaderboardProps) => {
  const [isVersusMode, setIsVersusMode] = useState(false);
  const [v1, setV1] = useState<string>('');
  const [v2, setV2] = useState<string>('');

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayHistory = history.filter(h => h.timestamp >= now.getTime());

  // Calculate Daily Goal
  const totalSalesVolume = todayHistory
    .filter(h => h.type === 'sale' && h.price)
    .reduce((acc, h) => acc + (parseFloat(h.price!) || 0), 0);
  
  const dailyGoal = 5000;
  const progressPercent = Math.min((totalSalesVolume / dailyGoal) * 100, 100);

  // Group by rep
  const reps: Record<string, any> = {};
  todayHistory.forEach(h => {
    const rep = h.repName || 'Unknown';
    if (!reps[rep]) reps[rep] = { notHome: 0, notInterested: 0, lead: 0, sale: 0, totalVolume: 0 };
    reps[rep][h.type] = (reps[rep][h.type] || 0) + 1;
    if (h.type === 'sale' && h.price) {
      reps[rep].totalVolume += (parseFloat(h.price) || 0);
    }
  });

  const rankings = Object.keys(reps).map(rep => {
    const stats = reps[rep];
    const xp = calculateXP(stats);
    const totalKnocks = stats.notHome + stats.notInterested + stats.lead + stats.sale;
    const leadsOrSales = stats.lead + stats.sale;
    const knockToLeadRatio = leadsOrSales > 0 ? (totalKnocks / leadsOrSales).toFixed(1) : totalKnocks;

    return {
      name: rep,
      xp,
      stats,
      knockToLeadRatio
    };
  }).sort((a, b) => b.xp - a.xp);

  // Auto-set versus mode contenders
  if (rankings.length >= 2 && !v1 && !v2) {
    setV1(rankings[0].name);
    setV2(rankings[1].name);
  }

  const getTrophyColor = (index: number) => {
    if (index === 0) return 'text-amber-400'; // Gold
    if (index === 1) return 'text-gray-400'; // Silver
    if (index === 2) return 'text-orange-700'; // Bronze
    return 'hidden';
  };

  const p1 = rankings.find(r => r.name === v1);
  const p2 = rankings.find(r => r.name === v2);

  return (
    <div className="absolute inset-0 z-[100] bg-gray-900 animate-[slide-left_0.2s_ease-out] flex flex-col pt-4 overflow-hidden text-white font-sans">
      <div className="flex justify-between items-center px-6 mb-4">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center">
          <Trophy className="text-amber-400 mr-3" size={24} />
          Leaderboard
        </h2>
        <div className="flex space-x-3 items-center">
          <button 
            onClick={() => setIsVersusMode(!isVersusMode)}
            className={`p-2 rounded-full transition-colors ${isVersusMode ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gray-800 text-gray-400'}`}
          >
            <Swords size={18} />
          </button>
          <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700">
            Close
          </button>
        </div>
      </div>

      {/* Progress Bar Area */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Team Goal</span>
          <span className="text-sm font-black text-rolex-green bg-green-100/10 px-2 py-0.5 rounded">${totalSalesVolume.toLocaleString()} <span className="text-gray-500 font-medium">/ $5,000</span></span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden border border-gray-700">
          <div className="bg-rolex-green h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="px-6 flex-grow overflow-y-auto space-y-3 pb-8">
        {!isVersusMode ? (
          <>
            {rankings.length === 0 ? (
              <p className="text-gray-500 text-sm mt-4 text-center">No activity today yet. Claim the number 1 spot!</p>
            ) : (
              rankings.map((r, i) => (
                <div key={r.name} className={`rounded-xl p-4 flex items-center border ${i === 0 ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-amber-500/30' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="mr-3 w-8 flex justify-center">
                    {i < 3 ? <Trophy className={getTrophyColor(i)} size={24} /> : <span className="text-xl font-black text-gray-600">{i + 1}</span>}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-white text-lg leading-tight">{r.name}</h3>
                    <div className="flex space-x-3 text-[10px] uppercase mt-1 text-gray-400 font-bold overflow-hidden">
                      <span className="text-gold tracking-wide">{r.stats.sale} Sales (${r.stats.totalVolume.toLocaleString()})</span>
                      <span className="text-rolex-green tracking-wide border-l border-gray-600 pl-2">{r.stats.lead} Leads</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-white">{r.xp}</span>
                    <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">XP</span>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          <div className="h-full flex flex-col justify-center animate-[zoom-in_0.3s_ease-out]">
            <h3 className="text-center font-black text-red-500 uppercase tracking-[0.3em] mb-8 text-xl flex items-center justify-center">
              <Swords className="mr-3 filter drop-shadow-md" /> Versus Mode <Swords className="ml-3 filter drop-shadow-md" />
            </h3>
            
            <div className="flex justify-between items-center bg-gray-800 p-4 rounded-3xl border border-gray-700 shadow-2xl">
              
              {/* Player 1 Col */}
              <div className="flex flex-col items-center w-1/3">
                <select 
                  value={v1} 
                  onChange={(e) => setV1(e.target.value)}
                  className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg px-2 py-1 mb-4 w-full text-center outline-none focus:border-red-500"
                >
                  <option value="">Select Rep</option>
                  {rankings.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
                
                {p1 ? (
                  <>
                    <h4 className="text-3xl font-black text-white mb-1">{p1.xp}</h4>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">XP</span>
                    
                    <span className="text-lg font-bold text-gray-300">{p1.knockToLeadRatio}</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wide text-center">Knocks / Lead</span>
                  </>
                ) : (
                  <div className="h-24 flex items-center text-gray-600 text-xs">Waiting</div>
                )}
              </div>
              
              <div className="w-1/3 flex justify-center text-4xl font-black text-gray-700 italic">VS</div>
              
              {/* Player 2 Col */}
              <div className="flex flex-col items-center w-1/3">
                <select 
                  value={v2} 
                  onChange={(e) => setV2(e.target.value)}
                  className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg px-2 py-1 mb-4 w-full text-center outline-none focus:border-blue-500"
                >
                  <option value="">Select Rep</option>
                  {rankings.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>

                {p2 ? (
                  <>
                    <h4 className="text-3xl font-black text-white mb-1">{p2.xp}</h4>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">XP</span>

                    <span className="text-lg font-bold text-gray-300">{p2.knockToLeadRatio}</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wide text-center">Knocks / Lead</span>
                  </>
                ) : (
                   <div className="h-24 flex items-center text-gray-600 text-xs">Waiting</div>
                )}
              </div>
            </div>
            
            {(p1 && p2) && (
              <div className="mt-8 text-center text-sm font-bold text-gray-400">
                {p1.xp > p2.xp ? <span className="text-red-400">{p1.name} is winning the XP battle!</span> : 
                 p2.xp > p1.xp ? <span className="text-blue-400">{p2.name} is leading in XP!</span> : 
                 <span>It's a dead heat!</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
