import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Zap, RefreshCw, ChevronRight, BookOpen } from 'lucide-react';
import { generateText } from '../src/services/aiService';
import { UserProfile } from '../types';

interface DailyInsightProps {
  profile: UserProfile | null;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  isDarkMode: boolean;
}

export const DailyInsight: React.FC<DailyInsightProps> = ({ profile, onUpdateProfile, isDarkMode }) => {
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const systemInstruction = `You are Harvey, the SPI Master AI. Generate a single, powerful "Physics Pearl of the Day" for an Ultrasound Physics student. 
      Keep it one paragraph, high-impact, science-focused. Mention a specific concept (e.g., Snell's Law, Nyquist Limit, ALARA). 
      Format: A catchy title in bold, followed by a short explanation and a 'Clinical Takeaway'.`;
      
      const prompt = "Generate my daily neural insight. My study goals: " + (profile.studyGoals || "General SPI Mastery");
      const insight = await generateText(prompt, systemInstruction);
      
      if (insight) {
        onUpdateProfile({ 
          dailyInsight: insight, 
          lastInsightTimestamp: Date.now() 
        });
      }
    } catch (error) {
      console.error("Failed to generate insight:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toDateString();
    const lastDay = profile?.lastInsightTimestamp ? new Date(profile.lastInsightTimestamp).toDateString() : '';
    
    if (!profile?.dailyInsight || today !== lastDay) {
      generateInsight();
    }
  }, [profile?.lastInsightTimestamp]);

  return (
    <div className={`p-6 rounded-[2.5rem] border ${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'} relative overflow-hidden group`}>
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-registry-teal/10 blur-[60px] rounded-full group-hover:bg-registry-teal/20 transition-all duration-700" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-registry-teal/10 rounded-xl">
              <Sparkles className="w-4 h-4 text-registry-teal" />
            </div>
            <span className="text-[11px] font-black uppercase text-registry-teal tracking-[0.3em]">Synaptic Pulse</span>
          </div>
          <button 
            onClick={generateInsight}
            disabled={loading}
            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
             <div className="space-y-2 py-4">
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
             </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={profile?.dailyInsight}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose dark:prose-invert max-w-none"
                >
                  <div className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} line-clamp-4 group-hover:line-clamp-6 transition-all duration-500 overflow-y-auto max-h-[120px] md:max-h-[160px] scrollbar-hide`}>
                    {profile?.dailyInsight || "Initializing neural link..."}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex items-center space-x-3 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-lg bg-stealth-800 border-2 border-stealth-950 flex items-center justify-center">
                       <Zap className="w-3 h-3 text-registry-teal" />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">354 Students synchronized today</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
