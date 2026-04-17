import React from 'react';

export type ActionType = 'notHome' | 'notInterested' | 'lead' | 'sale';

interface KnockBarProps {
  onAction: (action: ActionType) => void;
  activeAction: ActionType | null;
}

export const KnockBar: React.FC<KnockBarProps> = ({ onAction, activeAction }) => {
  return (
    <div className="bg-white px-4 py-4 pb-8 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] rounded-t-3xl border-t border-gray-100 flex-shrink-0 z-20">
      {activeAction && (
        <div className="absolute top-0 left-0 right-0 -translate-y-full pb-4 pointer-events-none flex justify-center z-30">
          <div className="bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-bounce uppercase tracking-widest border border-gray-700 pointer-events-auto flex items-center space-x-2">
            <span>Tap Map to Place {activeAction.toUpperCase()}</span>
            <button onClick={() => onAction(null as any) /* Cancel mechanism managed outside */} className="ml-2 text-gray-400 hover:text-white rounded-full bg-gray-700 w-5 h-5 flex items-center justify-center font-black">✕</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <button
          onClick={() => onAction('notHome')}
          className={`py-4 rounded-2xl font-bold tracking-wide transition-all active:scale-95 border-2 text-gray-700 bg-white shadow-sm ${activeAction === 'notHome' ? 'ring-4 ring-gray-200 border-gray-400' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          Not Home
        </button>
        <button
          onClick={() => onAction('notInterested')}
          className={`py-4 rounded-2xl font-bold tracking-wide transition-all active:scale-95 text-white shadow-md bg-red-500 hover:bg-red-600 ${activeAction === 'notInterested' ? 'ring-4 ring-red-200' : ''}`}
        >
          Not Interested
        </button>
        <button
          onClick={() => onAction('lead')}
          className={`py-4 rounded-2xl font-bold tracking-wide transition-all active:scale-95 text-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 border border-blue-400/50 ${activeAction === 'lead' ? 'ring-4 ring-blue-200' : ''}`}
        >
          Lead
        </button>
        <button
          onClick={() => onAction('sale')}
          className={`py-4 rounded-2xl font-bold tracking-wide transition-all active:scale-95 text-white shadow-lg bg-gradient-to-br from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700 border border-amber-400/50 ${activeAction === 'sale' ? 'ring-4 ring-amber-200' : ''}`}
        >
          Sale / Sold
        </button>
      </div>
    </div>
  );
};
