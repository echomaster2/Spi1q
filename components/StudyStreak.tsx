import React from 'react';
import { Flame, Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface StudyStreakProps {
  streak: number;
  completedToday: boolean;
  totalCompleted: number;
  isDarkMode?: boolean;
}

export const StudyStreak: React.FC<StudyStreakProps> = ({ streak, completedToday, totalCompleted, isDarkMode }) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`${isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border shadow-2xl relative overflow-hidden group relative z-10`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Flame className="w-32 h-32 text-registry-rose" />
      </div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-registry-rose/10 rounded-xl border border-registry-rose/20 shadow-lg shadow-registry-rose/10">
              <Flame className="w-6 h-6 text-registry-rose" />
            </div>
            <div>
              <h3 className={`text-xl font-black uppercase italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-none`}>Synaptic Streak</h3>
              <p className="text-[8px] font-black text-registry-rose uppercase tracking-[0.3em] mt-1">Neural Link: ACTIVE</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-black italic text-registry-rose glow-rose">{streak}</span>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Cycles</span>
            </div>
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Uptime Duration</span>
          </div>
        </div>

        <div className="flex justify-between items-center px-2">
          {days.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isCompleted = idx < todayIndex || (isToday && completedToday);
            
            return (
              <div key={idx} className="flex flex-col items-center space-y-3">
                <span className={`text-[9px] font-black tracking-widest ${isToday ? 'text-registry-teal' : 'text-slate-600'}`}>{day}</span>
                <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                  isToday 
                    ? completedToday 
                      ? 'bg-registry-teal border-registry-teal text-stealth-950 shadow-lg shadow-registry-teal/30' 
                      : 'bg-transparent border-registry-teal/30 text-registry-teal animate-pulse'
                    : isCompleted
                      ? isDarkMode ? 'bg-white/5 border-white/10 text-registry-teal' : 'bg-slate-100 border-slate-200 text-registry-teal'
                      : isDarkMode ? 'bg-transparent border-white/5 text-slate-800' : 'bg-transparent border-slate-100 text-slate-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-registry-teal animate-ping' : 'bg-white/5'}`} />
                  )}
                  
                  {/* Technical Indicator */}
                  {isToday && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-registry-teal rounded-full shadow-[0_0_5px_#00e5ff]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={`pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'} grid grid-cols-2 gap-4`}>
          <div className={`p-4 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 shadow-inner'} rounded-2xl border space-y-1 group/stat hover:border-registry-teal/30 transition-colors`}>
            <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest group-hover/stat:text-registry-teal transition-colors">Total Synapses</p>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-registry-teal" />
              <span className={`text-lg font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalCompleted}</span>
            </div>
          </div>
          <div className={`p-4 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 shadow-inner'} rounded-2xl border space-y-1 group/stat hover:border-registry-cobalt/30 transition-colors`}>
            <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest group-hover/stat:text-registry-cobalt transition-colors">Next Milestone</p>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-registry-cobalt" />
              <span className={`text-lg font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{Math.ceil((totalCompleted + 1) / 10) * 10}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
