import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Trash2, X, Clock, ShieldAlert, Send, ChevronLeft, Loader2, Volume2, Pause } from 'lucide-react';
import { StudyReminder } from '../types';

interface RemindersProps {
  onClose: () => void;
  onPlayNarration?: () => void;
  isNarrating?: boolean;
  isTtsLoading?: boolean;
  isDarkMode?: boolean;
}

const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const Reminders: React.FC<RemindersProps> = ({ onClose, onPlayNarration, isNarrating, isTtsLoading, isDarkMode }) => {
  const [reminders, setReminders] = useState<StudyReminder[]>(() => {
    const saved = localStorage.getItem('spi_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('spi_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [newTime, setNewTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const res = await Notification.requestPermission();
    setPermission(res);
  };

  const handleAddReminder = () => {
    if (selectedDays.length === 0 || isAdding) return;
    setIsAdding(true);
    const newRem: StudyReminder = {
      id: Math.random().toString(36).substring(7),
      time: newTime,
      enabled: true,
      days: [...selectedDays]
    };
    setReminders(prev => [...prev, newRem]);
    setIsAdding(false);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const sendTestNotification = () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        // Use a more robust check for constructor support
        if (typeof Notification === 'function') {
          new Notification("🔔 SPI Master Alert", {
            body: "Ready to master acoustic physics? Time to scan!",
            icon: "https://cdn-icons-png.flaticon.com/512/3063/3063823.png"
          });
        }
      } catch (e) {
        console.error("Notification constructor failed (Illegal constructor?)", e);
        // Fallback or just ignore if it's restricted in this environment
      }
    } else {
      requestPermission();
    }
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-stealth-950' : 'bg-white'} shadow-2xl transition-colors duration-300 relative z-[100]`}>
      <header className={`p-4 md:p-6 ${isDarkMode ? 'bg-stealth-950 border-white/10' : 'bg-slate-900 border-slate-800'} text-white flex justify-between items-center flex-shrink-0 border-b`}>
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-registry-teal rounded-xl flex items-center justify-center shadow-lg">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm md:text-lg font-black tracking-tight italic uppercase leading-none">Study Alerts</h4>
            <p className="text-[8px] md:text-[9px] opacity-70 font-black uppercase tracking-widest mt-0.5">Locally Saved</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onPlayNarration && (
            <button 
              onClick={onPlayNarration} 
              disabled={isTtsLoading}
              className={`p-2 rounded-xl transition-all ${isNarrating ? 'bg-registry-rose animate-pulse' : 'hover:bg-white/10'}`}
            >
              {isTtsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
          <button onClick={onClose} className="hidden sm:block p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
      </header>

      <div className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-8 ${isDarkMode ? 'bg-stealth-900/50' : 'bg-slate-50/50'}`}>
        {permission !== 'granted' ? (
          <div className={`border p-5 rounded-2xl flex items-start space-x-4 ${isDarkMode ? 'bg-amber-950/20 border-amber-900/30' : 'bg-amber-50 border-amber-200'}`}>
            <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
            <div className="space-y-3">
              <p className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>Browser notifications disabled.</p>
              <button onClick={requestPermission} className="px-4 py-2 bg-amber-500 text-white text-[9px] font-black uppercase rounded-lg">Enable</button>
            </div>
          </div>
        ) : (
          <button onClick={sendTestNotification} className={`w-full p-4 border rounded-2xl flex items-center justify-center space-x-3 ${isDarkMode ? 'bg-slate-800 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
            <Send className="w-4 h-4 text-registry-teal" /><span className="text-[10px] font-black uppercase tracking-widest">Send Test Alert</span>
          </button>
        )}

        <div className={`p-8 rounded-3xl border shadow-sm space-y-6 ${isDarkMode ? 'bg-slate-800 border-white/5' : 'bg-white border-slate-200'}`}>
          <div className="space-y-4">
             <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Add Study Pulse</h5>
             <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className={`w-full p-4 border rounded-2xl font-bold text-sm outline-none focus:border-registry-teal transition-colors ${isDarkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
          </div>
          <div className="space-y-3">
            <h5 className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Frequency</h5>
            <div className="flex justify-between gap-1">
              {DAYS_SHORT.map((day, idx) => (
                <button key={idx} onClick={() => toggleDay(idx)} className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all border-2 ${selectedDays.includes(idx) ? 'bg-teal-600 border-teal-400 text-white' : isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  {day}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleAddReminder} disabled={selectedDays.length === 0 || isAdding} className="w-full py-4.5 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">
            {isAdding ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Alert'}
          </button>
        </div>

        <div className="space-y-4">
          <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Active Disciplines</h5>
          {reminders.length === 0 ? (
            <div className={`p-10 text-center border-2 border-dashed rounded-[2.5rem] opacity-30 text-[9px] font-black uppercase ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>No active alerts</div>
          ) : (
            reminders.map(r => (
              <div key={r.id} className={`p-5 rounded-3xl border transition-all ${r.enabled ? isDarkMode ? 'bg-slate-800 border-white/5 shadow-sm' : 'bg-white border-slate-100 shadow-sm' : isDarkMode ? 'bg-slate-900/50 border-transparent opacity-60' : 'bg-slate-50 border-transparent opacity-60'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{r.time}</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry Pulse</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => toggleReminder(r.id)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${r.enabled ? 'bg-slate-100 text-slate-600' : 'bg-teal-600 text-white shadow-lg'}`}>
                      {r.enabled ? 'Mute' : 'Enable'}
                    </button>
                    <button onClick={() => deleteReminder(r.id)} className="p-2 text-rose-400 ml-1"><Trash2 className="w-4.5 h-4.5" /></button>
                  </div>
                </div>
                <div className="flex gap-1 justify-between px-1">
                  {DAYS_SHORT.map((day, dIdx) => (
                    <div key={dIdx} className={`w-6 h-6 rounded-full flex items-center justify-center text-[7px] font-black ${r.days.includes(dIdx) ? (r.enabled ? 'bg-teal-100 text-teal-700' : 'bg-slate-200 text-slate-500') : isDarkMode ? 'text-slate-700' : 'text-slate-200'}`}>
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className={`p-6 border-t text-center pb-24 lg:pb-8 ${isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-white border-slate-100'}`}>
        <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Locally Encrypted Persistence</p>
      </div>
    </div>
  );
};