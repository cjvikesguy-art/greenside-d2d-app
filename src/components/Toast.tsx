import { CheckCircle } from 'lucide-react';
import type { ActionType } from './KnockBar';

interface ToastProps {
  show: boolean;
  type: ActionType | null;
}

export const Toast = ({ show, type }: ToastProps) => {
  if (!show) return null;

  let message = 'Knock saved!';
  if (type === 'lead') message = 'New Lead Saved!';
  if (type === 'sale') message = 'New Sale Saved!';
  if (type === 'notHome') message = 'Not Home Logged';
  if (type === 'notInterested') message = 'Not Interested Logged';

  return (
    <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 animate-[slide-down_0.3s_ease-out]">
      <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
        <CheckCircle size={20} className="text-green-400" />
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  );
};
