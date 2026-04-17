import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileText, X } from 'lucide-react';
import type { KnockRecord } from '../types';

interface RecentKnocksProps {
  history: KnockRecord[];
}

export const RecentKnocks = ({ history }: RecentKnocksProps) => {
  const [activeNotes, setActiveNotes] = useState<KnockRecord | null>(null);

  const recent = history.slice(0, 5);

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'notHome': return 'text-gray-700 bg-white border border-gray-300';
      case 'notInterested': return 'text-red-700 bg-red-100 border border-red-200';
      case 'lead': return 'text-blue-700 bg-blue-100 border border-blue-200';
      case 'sale': return 'text-amber-700 bg-amber-100 border border-amber-200';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getTypeText = (type: string) => {
    switch(type) {
      case 'notHome': return 'Not Home';
      case 'notInterested': return 'Not Interested';
      case 'lead': return 'Lead';
      case 'sale': return 'Sale / Sold';
      default: return 'Unknown';
    }
  };

  if (history.length === 0) return null;

  return (
    <>
      <div className="absolute bottom-[20%] left-2 right-2 md:left-4 md:right-4 z-20 bg-white/95 backdrop-blur shadow-lg rounded-2xl p-4 max-h-48 overflow-y-auto border border-gray-100">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recent Knocks</h3>
        <div className="space-y-2">
          {recent.map((record) => (
            <div key={record.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${getTypeStyle(record.type)}`}>
                  {getTypeText(record.type)}
                </span>
                {record.name && <span className="font-medium text-gray-800">{record.name}</span>}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[10px] text-gray-400">
                  {formatDistanceToNow(record.timestamp, { addSuffix: true })}
                </span>
                {record.notes && (
                  <button 
                    onClick={() => setActiveNotes(record)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <FileText size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Modal */}
      {activeNotes && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-[slide-up_0.2s_ease-out]">
            <button 
              onClick={() => setActiveNotes(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 border"
            >
              <X size={16} />
            </button>
            <h3 className="font-bold text-lg text-gray-800 mb-1">Knock Details</h3>
            <p className="text-xs text-gray-500 mb-2">{getTypeText(activeNotes.type)} • {formatDistanceToNow(activeNotes.timestamp, { addSuffix: true })}</p>
            
            {(activeNotes.appointmentDate || activeNotes.subscriptionTier) && (
               <div className="flex flex-wrap gap-2 mb-4">
                 {activeNotes.appointmentDate && (
                   <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                     Appt: {activeNotes.appointmentDate} {activeNotes.appointmentTime || activeNotes.appointmentTimeType}
                   </span>
                 )}
                 {activeNotes.subscriptionTier && (
                   <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                     {activeNotes.subscriptionTier} Tier
                   </span>
                 )}
               </div>
            )}
            
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{activeNotes.notes || 'No notes left.'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
