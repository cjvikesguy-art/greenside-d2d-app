import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { salesConfig } from '../salesConfig';
import type { ActionType } from './KnockBar';
import type { KnockRecord } from '../types';

interface QuickFormProps {
  isOpen: boolean;
  type: ActionType | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: KnockRecord | null;
}

export const QuickForm = ({ isOpen, type, onClose, onSubmit, initialData }: QuickFormProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name || '');
      setPhone(initialData.phone || '');
      setPrice(initialData.price || '');
      setNotes(initialData.notes || '');
      setSelectedServices(initialData.services || []);
    } else if (isOpen && !initialData) {
      setName('');
      setPhone('');
      setPrice('');
      setNotes('');
      setSelectedServices([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id,
      type: initialData?.type || type, // keep original type if editing
      name,
      phone,
      price,
      notes,
      services: selectedServices
    });
  };

  const formType = initialData?.type || type;
  const isEditing = !!initialData;
  const typeText = formType === 'lead' ? (isEditing ? 'Edit Lead' : 'New Lead') : (isEditing ? 'Edit Sale' : 'New Sale');
  const headerColor = formType === 'lead' ? 'text-blue-600' : 'text-amber-600';
  const buttonColor = formType === 'lead' ? 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700' : 'bg-gradient-to-br from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700';

  return (
    <div className="fixed inset-0 z-[600] flex items-end">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full bg-white rounded-t-3xl p-6 pb-12 shadow-2xl z-10 animate-[slide-up_0.3s_ease-out] max-h-[85vh] overflow-y-auto">
        <button 
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className={`text-2xl font-black mb-6 uppercase tracking-widest ${headerColor}`}>
          {typeText}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 ${formType === 'lead' ? 'focus:ring-blue-500' : 'focus:ring-amber-500'}`}
                placeholder="John Doe"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 ${formType === 'lead' ? 'focus:ring-blue-500' : 'focus:ring-amber-500'}`}
                placeholder="(555) 555-5555"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Price</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-medium">$</span>
                <input 
                  type="text"
                  inputMode="decimal"
                  value={price}
                  onChange={handlePriceChange}
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 ${formType === 'lead' ? 'focus:ring-blue-500' : 'focus:ring-amber-500'}`}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Services Interested In</label>
            <div className="space-y-2">
              {salesConfig.services.map(service => (
                <label key={service} className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 cursor-pointer active:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => toggleService(service)}
                    className={`w-5 h-5 rounded ${formType === 'lead' ? 'text-blue-500 focus:ring-blue-500 accent-blue-500' : 'text-amber-500 focus:ring-amber-500 accent-amber-500'}`}
                  />
                  <span className="text-gray-800 text-sm font-medium">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Notes</label>
            <textarea 
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 resize-none ${formType === 'lead' ? 'focus:ring-blue-500' : 'focus:ring-amber-500'}`}
              placeholder="Detailed notes..."
            />
          </div>

          <button 
            type="submit"
            className={`w-full py-4 mt-6 rounded-2xl font-black text-white uppercase tracking-widest shadow-lg transition-transform active:scale-95 ${buttonColor}`}
          >
            {isEditing ? 'Update Record' : `Save ${typeText}`}
          </button>
        </form>
      </div>
    </div>
  );
};
