import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DailyStats } from './components/DailyStats';
import { GPSMap } from './components/GPSMap';
import { KnockBar } from './components/KnockBar';
import type { ActionType } from './components/KnockBar';
import { QuickForm } from './components/QuickForm';
import { RecentKnocks } from './components/RecentKnocks';
import { Toast } from './components/Toast';
import { Leaderboard } from './components/Leaderboard';
import { useGeolocation } from './hooks/useGeolocation';
import type { KnockRecord, TerritoryRecord } from './types';
import { User, Trophy } from 'lucide-react';
import { supabase } from './lib/supabase';
import { salesConfig } from './salesConfig';

function App() {
  const [repName, setRepName] = useState(() => {
    return localStorage.getItem('d2d_repName') || 'Curtis';
  });

  const [history, setHistory] = useState<KnockRecord[]>([]);
  const [territories, setTerritories] = useState<TerritoryRecord[]>([]);
  
  const [followMe, setFollowMe] = useState(true);
  const { location, error } = useGeolocation(followMe);

  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<KnockRecord | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [toast, setToast] = useState<{ show: boolean, type: ActionType | null }>({ show: false, type: null });
  const [showRepSettings, setShowRepSettings] = useState(false);
  const [globalNotification, setGlobalNotification] = useState<{message: string; visible: boolean}>({ message: '', visible: false });

  // Sync Rep Name locally
  useEffect(() => {
    localStorage.setItem('d2d_repName', repName);
  }, [repName]);

  // Fetch initial history from Supabase Cloud on load
  useEffect(() => {
    const fetchCloudData = async () => {
      const { data: knocksData } = await supabase.from('knocks').select('*').order('created_at', { ascending: false });
      if (knocksData) {
        const mappedHistory = knocksData.map(dbRec => ({
          id: dbRec.id,
          type: dbRec.type,
          lat: dbRec.lat,
          lng: dbRec.lng,
          repName: dbRec.rep_name,
          name: dbRec.name,
          phone: dbRec.phone,
          price: dbRec.price,
          notes: dbRec.notes,
          services: dbRec.services,
          timestamp: new Date(dbRec.created_at).getTime(),
          appointmentDate: dbRec.appointment_date,
          appointmentTimeType: dbRec.appointment_time_type,
          appointmentTime: dbRec.appointment_time,
          subscriptionTier: dbRec.subscription_tier
        }));
        setHistory(mappedHistory);
      }

      const { data: territoriesData } = await supabase.from('territories').select('*');
      if (territoriesData) {
        setTerritories(territoriesData);
      }
    };
    
    fetchCloudData();

    // Subscribe to real-time Cloud updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'knocks' },
        (payload) => {
          const dbRec = payload.new;
          
          if (dbRec.type === 'sale') {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#c5a059', '#3b82f6', '#ffffff'] // Gold, Blue, White
            });
            const salePrice = dbRec.price ? `$${dbRec.price}` : 'new';
            setGlobalNotification({ message: `BOOM! ${dbRec.rep_name || 'Someone'} closed a ${salePrice} deal!`, visible: true });
            setTimeout(() => setGlobalNotification(n => ({...n, visible: false})), 6000);
          }

          const newRecord: KnockRecord = {
            id: dbRec.id,
            type: dbRec.type,
            lat: dbRec.lat,
            lng: dbRec.lng,
            repName: dbRec.rep_name,
            name: dbRec.name,
            phone: dbRec.phone,
            price: dbRec.price,
            notes: dbRec.notes,
            services: dbRec.services,
            timestamp: new Date(dbRec.created_at).getTime(),
            appointmentDate: dbRec.appointment_date,
            appointmentTimeType: dbRec.appointment_time_type,
            appointmentTime: dbRec.appointment_time,
            subscriptionTier: dbRec.subscription_tier
          };
          setHistory(prev => {
            if (prev.find(k => k.id === newRecord.id)) return prev;
            return [newRecord, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'knocks' },
        (payload) => {
           const dbRec = payload.new;
           setHistory(prev => prev.map(k => k.id === dbRec.id ? {
             ...k,
             name: dbRec.name,
             phone: dbRec.phone,
             price: dbRec.price,
             notes: dbRec.notes,
             services: dbRec.services,
             appointmentDate: dbRec.appointment_date,
             appointmentTimeType: dbRec.appointment_time_type,
             appointmentTime: dbRec.appointment_time,
             subscriptionTier: dbRec.subscription_tier
           } : k));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'knocks' },
        (payload) => {
           setHistory(prev => prev.filter(k => k.id !== payload.old.id));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'territories' },
        (payload) => {
          const newTerritory = payload.new as TerritoryRecord;
          setTerritories(prev => {
            if (prev.find(t => t.id === newTerritory.id)) return prev;
            return [...prev, newTerritory];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const triggerToast = (type: ActionType) => {
    setToast({ show: true, type });
    setTimeout(() => {
      setToast({ show: false, type: null });
    }, 3000);
  };

  const publishTerritoryToCloud = async (payload: any) => {
    const dbPayload = {
      label: `${repName}'s Zone - ${new Date().toLocaleDateString()}`,
      color: '#3b82f6', // Lead Blue overlay
      layer_type: payload.layer_type,
      latlngs: payload.latlngs
    };
    
    const tempId = Math.random().toString(36).substring(2, 9);
    setTerritories(prev => [...prev, { id: tempId, ...dbPayload } as TerritoryRecord]);
    await supabase.from('territories').insert(dbPayload);
    triggerToast('lead'); 
  };

  const handleActionClick = (action: ActionType | null) => {
    setActiveAction(action);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    if (!activeAction) return;

    if (activeAction === 'lead' || activeAction === 'sale') {
      setSelectedLocation({ lat, lng });
      setEditingRecord(null); // Ensure fresh form
      setFormOpen(true);
    } else { // NH, NI
      const newRecord: KnockRecord = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        type: activeAction,
        lat,
        lng,
        repName
      };

      const dbPayload = {
        id: newRecord.id,
        type: newRecord.type,
        lat: newRecord.lat,
        lng: newRecord.lng,
        rep_name: newRecord.repName
      };

      setHistory(prev => [newRecord, ...prev]);
      setActiveAction(null);
      await supabase.from('knocks').insert(dbPayload);
      triggerToast(activeAction);
    }
  };

  const handleFormSubmit = async (data: any) => {
    const actionType = data.type as ActionType;
    
    if (editingRecord) {
      // Handle Update
      const updatedRecord = { ...editingRecord, ...data };
      setHistory(prev => prev.map(k => k.id === updatedRecord.id ? updatedRecord : k));
      
      const dbPayload = {
        name: data.name,
        phone: data.phone,
        price: data.price,
        notes: data.notes,
        services: data.services,
        appointment_date: data.appointmentDate,
        appointment_time_type: data.appointmentTimeType,
        appointment_time: data.appointmentTime,
        subscription_tier: data.subscriptionTier
      };
      
      await supabase.from('knocks').update(dbPayload).eq('id', updatedRecord.id);
      
      setFormOpen(false);
      setEditingRecord(null);
      triggerToast(actionType);
      
    } else {
      // Handle Insert
      const newRecord: KnockRecord = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        type: actionType,
        lat: selectedLocation?.lat || location?.lat || null,
        lng: selectedLocation?.lng || location?.lng || null,
        name: data.name,
        phone: data.phone,
        price: data.price,
        notes: data.notes,
        services: data.services,
        repName,
        appointmentDate: data.appointmentDate,
        appointmentTimeType: data.appointmentTimeType,
        appointmentTime: data.appointmentTime,
        subscriptionTier: data.subscriptionTier
      };

      setHistory(prev => [newRecord, ...prev]);
      
      const dbPayload = {
        id: newRecord.id,
        type: newRecord.type,
        lat: newRecord.lat,
        lng: newRecord.lng,
        rep_name: newRecord.repName,
        name: newRecord.name,
        phone: newRecord.phone,
        price: newRecord.price,
        notes: newRecord.notes,
        services: newRecord.services,
        appointment_date: newRecord.appointmentDate,
        appointment_time_type: newRecord.appointmentTimeType,
        appointment_time: newRecord.appointmentTime,
        subscription_tier: newRecord.subscriptionTier
      };

      await supabase.from('knocks').insert(dbPayload);

      // Webhook trigger
      if (newRecord.type === 'sale' && salesConfig.calendarWebhookUrl) {
         fetch(salesConfig.calendarWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord)
         }).catch(err => console.error("Webhook err:", err));
      }
      
      setFormOpen(false);
      setActiveAction(null);
      setSelectedLocation(null);
      triggerToast(actionType);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    setHistory(prev => prev.filter(k => k.id !== id));
    await supabase.from('knocks').delete().eq('id', id);
  };

  const handleEditRecord = (record: KnockRecord) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingRecord(null);
    setActiveAction(null); // cancel placement mode
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const myTodayHistory = history.filter(h => h.timestamp >= now.getTime() && h.repName === repName);
  
  const stats: Record<ActionType, number> = {
    notHome: myTodayHistory.filter(h => h.type === 'notHome').length,
    notInterested: myTodayHistory.filter(h => h.type === 'notInterested').length,
    lead: myTodayHistory.filter(h => h.type === 'lead').length,
    sale: myTodayHistory.filter(h => h.type === 'sale').length,
  };

  const totalVolume = myTodayHistory
    .filter(h => h.type === 'sale' && h.price)
    .reduce((acc, h) => acc + (parseFloat(h.price!) || 0), 0);

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-gray-100 overflow-hidden font-sans relative">
      <Toast show={toast.show} type={toast.type} />
      
      {globalNotification.visible && (
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-[600] w-[90%] max-w-sm animate-[slide-down_0.5s_ease-out]">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-black px-6 py-4 rounded-2xl shadow-2xl border-[3px] border-gold text-center uppercase tracking-widest shadow-[0_0_25px_rgba(197,160,89,0.5)]">
            🎉 {globalNotification.message}
          </div>
        </div>
      )}
      
      {/* Top Header */}
      <div className="bg-white z-20 flex justify-between items-center px-4 pt-2 pb-1 border-b">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Greenside D2D</h2>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center space-x-1 text-gold hover:text-amber-600 transition-colors"
          >
            <Trophy size={18} />
          </button>
          
          <button 
            onClick={() => setShowRepSettings(!showRepSettings)}
            className="flex items-center space-x-1 text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200"
          >
            <User size={12} />
            <span>{repName}</span>
          </button>
        </div>
      </div>

      {showRepSettings && (
        <div className="bg-white px-4 py-3 border-b shadow-sm z-30 animate-[slide-down_0.2s_ease-out]">
          <label className="block text-xs font-bold text-gray-500 mb-1 pointer-events-none uppercase tracking-widest">Active Rep</label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={repName}
              onChange={(e) => setRepName(e.target.value)}
              className="flex-grow px-3 py-2 text-sm border rounded bg-gray-50 focus:bg-white transition-colors"
              placeholder="Enter Rep Name"
            />
            <button 
              onClick={() => setShowRepSettings(false)}
              className="bg-blue-600 text-white px-4 rounded text-sm font-bold"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <Leaderboard history={history} onClose={() => setShowLeaderboard(false)} />
      )}

      <DailyStats stats={stats} totalVolume={totalVolume} />
      
      <div className="flex-grow flex flex-col relative z-0">
        <GPSMap 
          location={location} 
          error={error} 
          followMe={followMe} 
          setFollowMe={setFollowMe} 
          history={history} 
          territories={territories}
          onTerritoryCreate={publishTerritoryToCloud}
          activeAction={activeAction}
          onMapClick={handleMapClick}
          isAdmin={repName === 'Curtis'}
          repName={repName}
          onEditRecord={handleEditRecord}
          onDeleteRecord={handleDeleteRecord}
        />
        {!formOpen && !showLeaderboard && <RecentKnocks history={history} />}
      </div>
      
      <KnockBar onAction={handleActionClick} activeAction={activeAction} />
      
      <QuickForm 
        isOpen={formOpen} 
        type={editingRecord ? editingRecord.type : activeAction} 
        initialData={editingRecord}
        onClose={closeForm} 
        onSubmit={handleFormSubmit} 
      />
    </div>
  );
}

export default App;
