import React from 'react';
import { Target, Zap, ChevronRight, Brain } from 'lucide-react';
import { motion } from 'motion/react';

interface DailyChallengeProps {
  onStart: () => void;
  isDarkMode?: boolean;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ onStart, isDarkMode }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`${isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-[2.5rem] p-8 border shadow-2xl relative overflow-hidden group relative z-10`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(45,212,191,0.1),transparent_50%)]" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-registry-teal/10 rounded-xl border border-registry-teal/20 shadow-lg shadow-registry-teal/10">
              <Target className="w-6 h-6 text-registry-teal" />
            </div>
            <div>
              <h3 className={`text-xl font-black uppercase italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-none`}>Daily Mission</h3>
              <p className="text-[11px] font-black text-registry-teal uppercase tracking-[0.3em] mt-1">Status: PENDING</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="px-3 py-1 bg-registry-teal text-stealth-950 text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-registry-teal/20">
              +50 XP
            </div>
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest mt-1">Reward Protocol</span>
          </div>
        </div>

        <div className={`space-y-4 p-4 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'} rounded-2xl border relative overflow-hidden group/mission`}>
          <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
          <div className="flex items-start space-x-4 relative z-10">
            <div className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-stealth-950 border-white/10' : 'bg-white border-slate-200 shadow-inner'} flex items-center justify-center shrink-0 group-hover/mission:border-registry-teal/30 transition-colors`}>
              <Brain className="w-6 h-6 text-registry-teal glow-teal" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`text-sm font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Neural Synchronization</h4>
                <div className="w-1.5 h-1.5 bg-registry-rose rounded-full animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Complete 3 rapid-fire questions on <span className="text-registry-teal">"Doppler Physics"</span> to maintain your mastery level and prevent synaptic decay.
              </p>
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-4 bg-registry-cobalt hover:bg-blue-400 text-white rounded-2xl font-black italic uppercase text-xs tracking-widest transition-all flex items-center justify-center space-x-2 group/btn relative overflow-hidden shadow-lg shadow-registry-cobalt/20"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12" />
          <Zap className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Initiate Challenge</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 relative z-10" />
        </motion.button>
      </div>
    </motion.div>
  );
};
