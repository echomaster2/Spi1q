import React from 'react';
import { Activity, Zap, Brain, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface NeuralLoadProps {
  data?: number[];
  isDarkMode?: boolean;
}

export const NeuralLoad: React.FC<NeuralLoadProps> = ({ data = [45, 52, 48, 70, 65, 85, 92], isDarkMode }) => {
  
  const avgLoad = data.reduce((a, b) => a + b, 0) / data.length;
  const retention = Math.min(98, 70 + (avgLoad / 5));

  return (
    <section className={`${isDarkMode ? 'bg-slate-900 dark:bg-slate-950 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-12 border shadow-2xl relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Activity className="w-24 h-24 md:w-32 md:h-32 text-registry-teal" />
      </div>
      
      <div className="relative z-10 space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className={`text-lg md:text-3xl font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tighter`}>Neural Load</h4>
            <p className="text-[11px] font-black text-registry-teal uppercase tracking-[0.3em]">Phase 3: Cognitive Analytics</p>
          </div>
          <div className={`flex items-center space-x-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} px-3 py-1.5 md:px-4 md:py-2 rounded-xl border`}>
            <Zap className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
            <span className={`text-[11px] md:text-[11px] font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} uppercase italic`}>Peak State</span>
          </div>
        </div>

        <div className="flex items-end justify-between h-24 md:h-32 gap-1.5 md:gap-2">
          {data.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ delay: i * 0.1, duration: 1, ease: "easeOut" }}
                className={`w-full rounded-t-lg transition-all ${i === data.length - 1 ? 'bg-registry-teal shadow-[0_0_15px_rgba(0,245,212,0.5)]' : isDarkMode ? 'bg-white/10 group-hover:bg-white/20' : 'bg-slate-200 group-hover:bg-slate-300'}`}
              />
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">D{i+1}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl border`}>
            <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
              <Brain className="w-3 h-3" />
              <span className="text-[11px] font-black uppercase tracking-widest">Synaptic Depth</span>
            </div>
            <div className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} italic`}>{(avgLoad / 10).toFixed(1)}<span className="text-registry-teal text-xs ml-1">THz</span></div>
          </div>
          <div className={`p-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl border`}>
            <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
              <TrendingUp className="w-3 h-3" />
              <span className="text-[11px] font-black uppercase tracking-widest">Retention Rate</span>
            </div>
            <div className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} italic`}>{retention.toFixed(0)}<span className="text-registry-teal text-xs ml-1">%</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};
