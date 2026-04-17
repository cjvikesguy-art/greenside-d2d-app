import { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
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
  
  // Booking State
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTimeType, setAppointmentTimeType] = useState('Time Window');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [subscriptionTier, setSubscriptionTier] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name || '');
      setPhone(initialData.phone || '');
      setPrice(initialData.price || '');
      setNotes(initialData.notes || '');
      setSelectedServices(initialData.services || []);
      setAppointmentDate(initialData.appointmentDate || '');
      setAppointmentTimeType(initialData.appointmentTimeType || 'Time Window');
      setAppointmentTime(initialData.appointmentTime || '');
      setSubscriptionTier(initialData.subscriptionTier || '');
    } else if (isOpen && !initialData) {
      setName('');
      setPhone('');
      setPrice('');
      setNotes('');
      setSelectedServices([]);
      setAppointmentDate('');
      setAppointmentTimeType('Time Window');
      setAppointmentTime('');
      setSubscriptionTier('');
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
      type: initialData?.type || type, 
      name,
      phone,
      price,
      notes,
      services: selectedServices,
      appointmentDate,
      appointmentTimeType,
      appointmentTime,
      subscriptionTier
    });
  };

  const formType = initialData?.type || type;
  const isEditing = !!initialData;
  const typeText = formType === 'lead' ? (isEditing ? 'Edit Lead' : 'New Lead') : (isEditing ? 'Edit Sale' : 'New Sale');
  const headerColor = formType === 'lead' ? 'text-blue-600' : 'text-amber-600';
  const buttonColor = formType === 'lead' ? 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700' : 'bg-gradient-to-br from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700';
  const isSale = formType === 'sale';

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

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Customer Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
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
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 ${formType === 'lead' ? 'focus:ring-blue-500' : 'focus:ring-amber-500'}`}
                  placeholder="(555) 555-5555"
                />
              </div>

              <div className="col-span-1">
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
          </div>
          
          {/* Booking Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1 flex items-center"><Calendar size={12} className="mr-1"/> Schedule Appointment</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <input 
                  type="date" 
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 ${formType === 'lead' ? 'focus:ring-blue-500' : 'focus:ring-amber-500'}`}
                />
              </div>
              
              <div className="col-span-2 flex bg-gray-100 p-1 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setAppointmentTimeType('Time Window')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${appointmentTimeType === 'Time Window' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                >
                  Time Window
                </button>
                <button 
                  type="button"
                  onClick={() => setAppointmentTimeType('Specific Time')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${appointmentTimeType === 'Specific Time' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                >
                  Specific Time
                </button>
              </div>

              <div className="col-span-2">
                {appointmentTimeType === 'Time Window' ? (
                  <select 
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="">Select Window...</option>
                    <option value="Morning">Morning (8AM - 12PM)</option>
                    <option value="Afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                ) : (
                  <input 
                    type="time" 
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Subscription Tier (Sale Only) */}
          {isSale && (
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Select Plan</h3>
               <div className="grid grid-cols-2 gap-3">
                 <button 
                   type="button"
                   onClick={() => setSubscriptionTier('Standard')}
                   className={`p-4 rounded-xl border-2 transition-all font-bold ${subscriptionTier === 'Standard' ? 'border-gray-800 bg-gray-50 text-gray-800 shadow-md ring-2 ring-gray-200' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                 >
                   Standard
                 </button>
                 <button 
                   type="button"
                   onClick={() => setSubscriptionTier('Premium')}
                   className={`p-4 rounded-xl border-2 transition-all font-black uppercase tracking-widest ${subscriptionTier === 'Premium' ? 'border-amber-500 bg-amber-50 text-amber-600 shadow-md ring-2 ring-amber-200 shadow-[inset_0_0_10px_rgba(197,160,89,0.2)]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                 >
                   Premium
                 </button>
               </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Services & Notes</h3>
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
            className={`w-full py-4 mt-8 rounded-2xl font-black text-white uppercase tracking-widest shadow-lg transition-transform active:scale-95 ${buttonColor}`}
          >
            {isEditing ? 'Update Record' : `Save ${typeText}`}
          </button>
        </form>
      </div>
    </div>
  );
};
