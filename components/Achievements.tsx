import React from 'react';
import { Trophy, Star, Zap, Target, Award, Shield, BookOpen, Brain, Sparkles, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: any;
  color: string;
  unlocked: boolean;
  progress: number;
}

export const Achievements: React.FC<{ progress: number; isDarkMode?: boolean }> = ({ progress, isDarkMode }) => {
  const achievements: Achievement[] = [
    { 
      id: '1', title: 'First Pulse', desc: 'Complete your first lesson', 
      icon: Zap, color: 'text-amber-500', unlocked: progress > 0, progress: progress > 0 ? 100 : 0 
    },
    { 
      id: '2', title: 'Acoustic Master', desc: 'Reach 50% total progress', 
      icon: Star, color: 'text-teal-500', unlocked: progress >= 50, progress: Math.min(100, (progress / 50) * 100) 
    },
    { 
      id: '3', title: 'Registry Ready', desc: 'Reach 100% total progress', 
      icon: Trophy, color: 'text-registry-rose', unlocked: progress >= 100, progress: Math.min(100, (progress / 100) * 100) 
    },
    { 
      id: '4', title: 'Neural Link', desc: 'Interact with Harvey 10 times', 
      icon: Brain, color: 'text-indigo-500', unlocked: true, progress: 100 
    },
    { 
      id: '5', title: 'Artifact Hunter', desc: 'Complete the Artifacts module', 
      icon: Target, color: 'text-teal-500', unlocked: false, progress: 45 
    },
    { 
      id: '6', title: 'Synaptic Streak', desc: 'Maintain a 7-day study streak', 
      icon: Award, color: 'text-orange-500', unlocked: true, progress: 100 
    }
  ];

  return (
    <section className="space-y-6 relative">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-registry-teal/10 rounded-xl border border-registry-teal/20 shadow-lg shadow-registry-teal/10">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-registry-teal" />
          </div>
          <div>
            <h4 className={`text-lg md:text-2xl font-black uppercase italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-none`}>Neural Achievements</h4>
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-[0.3em] mt-1">Registry Validation Protocol</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sync Status</span>
          <span className="text-[10px] font-black text-registry-teal bg-registry-teal/10 border border-registry-teal/20 px-3 py-1 rounded-full mt-1">
            {achievements.filter(a => a.unlocked).length} / {achievements.length} DEPLOYED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((a) => (
          <div 
            key={a.id} 
            className={`p-6 rounded-[2rem] border transition-all group relative overflow-hidden ${
              a.unlocked 
                ? isDarkMode ? 'bg-stealth-900 border-white/10 shadow-lg hover:border-registry-teal/50' : 'bg-white border-slate-200 shadow-sm hover:border-registry-teal/50'
                : isDarkMode ? 'bg-stealth-950 border-dashed border-white/5 opacity-40' : 'bg-slate-50 border-dashed border-slate-200 opacity-40'
            }`}
          >
            {/* Card Background Elements */}
            <div className="absolute inset-0 neural-grid opacity-5 pointer-events-none" />
            <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />

            {!a.unlocked && (
              <div className="absolute inset-0 bg-stealth-950/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-slate-700" />
              </div>
            )}
            
            <div className="relative z-0 flex items-start space-x-4">
              <div className={`p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 ${
                a.unlocked ? isDarkMode ? 'bg-stealth-950 border border-white/5 shadow-inner' : 'bg-slate-50 border border-slate-100 shadow-inner' : 'bg-white/5'
              }`}>
                <a.icon className={`w-6 h-6 ${a.unlocked ? a.color : 'text-slate-700'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className={`font-black uppercase text-xs tracking-wider ${a.unlocked ? isDarkMode ? 'text-white' : 'text-slate-900' : 'text-slate-600'}`}>{a.title}</h5>
                  {a.unlocked && <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse shadow-[0_0_5px_#00e5ff]" />}
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-tight mb-4">{a.desc}</p>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8px] font-black uppercase text-slate-600 tracking-widest">
                    <span>Validation Progress</span>
                    <span className={a.unlocked ? 'text-registry-teal' : ''}>{Math.round(a.progress)}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const isActive = (i / 10) * 100 < a.progress;
                      return (
                        <div 
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-500 ${
                            isActive 
                              ? (a.unlocked ? 'bg-registry-teal shadow-[0_0_3px_#00e5ff]' : 'bg-slate-700') 
                              : 'bg-white/5'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
