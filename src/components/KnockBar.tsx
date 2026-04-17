import { Home, Ban, Star, Trophy, MapPin } from 'lucide-react';

export type ActionType = 'notHome' | 'notInterested' | 'lead' | 'sale';

interface KnockBarProps {
  onAction: (action: ActionType | null) => void;
  activeAction: ActionType | null;
}

export const KnockBar = ({ onAction, activeAction }: KnockBarProps) => {
  const getButtonStyles = (type: ActionType) => {
    switch(type) {
      case 'notHome':
        return activeAction === type
          ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] border-gray-400 text-gray-800 scale-110 -translate-y-2'
          : 'bg-white/80 hover:bg-white text-gray-600 border-gray-200 hover:border-gray-300';
      case 'notInterested':
        return activeAction === type
          ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.8)] border-red-500 text-white scale-110 -translate-y-2'
          : 'bg-white/80 hover:bg-red-50 text-red-500 border-red-100 hover:border-red-200';
      case 'lead':
        return activeAction === type
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.8)] border-blue-500 text-white scale-110 -translate-y-2'
          : 'bg-white/80 hover:bg-blue-50 text-blue-500 border-blue-100 hover:border-blue-200';
      case 'sale':
        return activeAction === type
          ? 'bg-gradient-to-br from-yellow-400 to-amber-600 shadow-[0_0_15px_rgba(197,160,89,0.8)] border-amber-500 text-white scale-110 -translate-y-2'
          : 'bg-white/80 hover:bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-200';
    }
  };

  const getIcon = (type: ActionType) => {
    switch(type) {
      case 'notHome': return <Home size={24} strokeWidth={2.5} />;
      case 'notInterested': return <Ban size={24} strokeWidth={2.5} />;
      case 'lead': return <Star size={24} strokeWidth={2.5} />;
      case 'sale': return <Trophy size={24} strokeWidth={2.5} />;
    }
  };

  const getLabel = (type: ActionType) => {
    switch(type) {
      case 'notHome': return 'NH';
      case 'notInterested': return 'NI';
      case 'lead': return 'Lead';
      case 'sale': return 'Sale';
    }
  };

  const buttons: ActionType[] = ['notHome', 'notInterested', 'lead', 'sale'];

  return (
    <div className="relative z-[500] w-full pb-6 pt-2 px-4 pointer-events-none">
      
      {/* Placement Mode Toast */}
      {activeAction && (
        <div className="absolute -top-14 left-0 right-0 flex justify-center pointer-events-none animate-[slide-down_0.3s_ease-out]">
          <div className="bg-gray-900 text-white px-6 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 border border-gray-700">
            <MapPin size={16} className="animate-bounce text-blue-400" />
            <span className="text-sm font-bold tracking-widest uppercase">Tap Map to Place</span>
          </div>
        </div>
      )}

      {/* Action Dock */}
      <div className="mx-auto max-w-sm bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-3 flex justify-between items-center pointer-events-auto ring-1 ring-black/5">
        
        {buttons.map((type) => (
          <button
            key={type}
            onClick={() => onAction(activeAction === type ? null : type)}
            className={`
              relative flex flex-col items-center justify-center w-[72px] h-[72px] rounded-2xl border transition-all duration-300 ease-out
              ${getButtonStyles(type)}
            `}
          >
            {getIcon(type)}
            <span className="text-[10px] font-black uppercase tracking-wider mt-1.5 opacity-90">
              {getLabel(type)}
            </span>
          </button>
        ))}

      </div>
    </div>
  );
};
