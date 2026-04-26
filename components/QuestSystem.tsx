import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Target, Zap, CheckCircle2, Circle, Star, Sword, Shield, Crown, ChevronRight, X, Sparkles } from 'lucide-react';
import { Quest, INITIAL_QUESTS } from '../src/lib/questUtils';

export const QuestSystem: React.FC<{ 
  onClose: () => void;
  isDarkMode?: boolean;
}> = ({ onClose, isDarkMode = true }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'milestone'>('daily');
  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const saved = localStorage.getItem('echo_quest_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Quest State Init Error:", e);
    }
    return INITIAL_QUESTS;
  });

  useEffect(() => {
    const handleUpdate = (e: any) => {
      setQuests(e.detail);
    };
    window.addEventListener('quest-updated', handleUpdate);
    return () => window.removeEventListener('quest-updated', handleUpdate);
  }, []);

  const dailyQuests = quests.filter(q => q.type === 'daily');
  const milestoneQuests = quests.filter(q => q.type === 'milestone');

  return (
    <div className={`w-full h-full flex flex-col ${isDarkMode ? 'bg-stealth-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="p-8 md:p-12 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
        <div className="flex items-center space-x-5 relative z-10">
          <div className="p-4 bg-registry-amber/10 rounded-2xl border border-registry-amber/20 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
            <Sword className="w-7 h-7 text-registry-amber" />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Quest Protocol</h2>
            <p className="text-[11px] font-black text-registry-amber uppercase tracking-[0.4em] mt-1">Operational Objectives Alpha</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-4 hover:bg-white/5 rounded-2xl transition-all"
        >
          <X className="w-8 h-8 text-slate-500" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12">
        {/* Tab Toggle */}
        <div className="flex p-1 bg-stealth-900/50 rounded-2xl border border-white/5 max-w-md">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'daily' ? 'bg-registry-amber text-stealth-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Daily Operations
          </button>
          <button 
            onClick={() => setActiveTab('milestone')}
            className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'milestone' ? 'bg-registry-amber text-stealth-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Milestone Protocol
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="wait">
            {(activeTab === 'daily' ? dailyQuests : milestoneQuests).map((quest, idx) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-[2.5rem] border group relative overflow-hidden transition-all ${quest.completed ? 'bg-registry-teal/5 border-registry-teal/20 shadow-inner' : 'bg-stealth-900/50 border-white/5 hover:border-white/10 shadow-premium'}`}
              >
                {quest.completed && (
                  <div className="absolute top-4 right-4 animate-pulse">
                    <CheckCircle2 className="w-6 h-6 text-registry-teal" />
                  </div>
                )}
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl border ${quest.completed ? 'bg-registry-teal/10 border-registry-teal/20' : 'bg-white/5 border-white/10'}`}>
                        {quest.type === 'daily' ? <Zap className={`w-4 h-4 ${quest.completed ? 'text-registry-teal' : 'text-slate-400'}`} /> : <Star className={`w-4 h-4 ${quest.completed ? 'text-registry-teal' : 'text-registry-amber'}`} />}
                      </div>
                      <h4 className="text-xl font-black italic uppercase italic tracking-tight">{quest.title}</h4>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed max-w-sm">{quest.description}</p>
                    
                    <div className="space-y-3 pt-2">
                       <div className="flex justify-between items-end">
                          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Efficiency Parameters</span>
                          <span className="text-[11px] font-mono text-white">{quest.progress} / {quest.total}</span>
                       </div>
                       <div className={`h-2 w-full rounded-full overflow-hidden ${quest.completed ? 'bg-registry-teal/20' : 'bg-white/5 shadow-inner'}`}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                            className={`h-full ${quest.completed ? 'bg-registry-teal' : 'bg-registry-amber'} shadow-glow`}
                          />
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-2 ml-8 pt-2">
                     <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Sync Reward</p>
                     <div className={`px-5 py-3 rounded-2xl border flex items-center space-x-3 ${quest.completed ? 'bg-registry-teal/10 border-registry-teal/20 text-registry-teal shadow-glow' : 'bg-white/5 border-white/10 text-white shadow-xl'}`}>
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-black italic tracking-tighter">{quest.reward} RU</span>
                     </div>
                  </div>
                </div>

                {/* Decorative BG element */}
                <div className={`absolute -right-10 -bottom-10 w-40 h-40 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity ${quest.completed ? 'text-registry-teal' : 'text-white'}`}>
                   {quest.type === 'daily' ? <Zap className="w-full h-full" /> : <Shield className="w-full h-full" />}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <footer className="p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-4">
           <div className="flex -space-x-2">
             {[Crown, Shield, Trophy].map((Icon, i) => (
               <div key={i} className={`w-8 h-8 rounded-full bg-stealth-900 border-2 border-stealth-950 flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-slate-500" />
               </div>
             ))}
           </div>
           <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Neural Ranking Sync: <span className="text-white italic">Awaiting Synchronous Master</span></p>
        </div>
        <div className="flex items-center space-x-4">
           <div className="flex flex-col items-end">
             <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Operational Uptime</span>
             <span className="text-[11px] font-mono font-bold text-registry-amber italic">99.998% SYNC</span>
           </div>
           <div className="w-10 h-10 rounded-xl bg-registry-amber/10 border border-registry-amber/20 flex items-center justify-center animate-pulse">
              <Shield className="w-5 h-5 text-registry-amber" />
           </div>
        </div>
      </footer>
    </div>
  );
};
