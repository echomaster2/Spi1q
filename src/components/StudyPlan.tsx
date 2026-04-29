import React, { useMemo, useState } from 'react';
import { Calendar, Clock, Sparkles, AlertTriangle, CheckCircle2, BookOpen, Zap, Volume2, Pause, Loader2, Target, Brain, RefreshCw, X, Stethoscope, Layers, Binary, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FullscreenToggle } from './FullscreenToggle';
import { UserProfile } from '../types';
import { Toaster, toast } from 'sonner';
import { generateStudyPlan, AIServiceError } from '../services/aiService';
import { CLINICAL_TIPS } from '../constants/clinicalTips';

interface StudyPlanProps {
  profile: UserProfile;
  completed?: Set<string>;
  onClose: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onPlayNarration?: () => void;
  isNarrating?: boolean;
  isTtsLoading?: boolean;
  isDarkMode: boolean;
}

export const StudyPlan: React.FC<StudyPlanProps> = ({ profile, completed = new Set(), onClose, onUpdateProfile, onPlayNarration, isNarrating, isTtsLoading, isDarkMode }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<{ day: number; label?: string; topics: string[] } | null>(null);
  const [neuralDepthEnabled, setNeuralDepthEnabled] = useState(false);
  const [focusedTile, setFocusedTile] = useState<{ title: string; subtitle?: string; content: React.ReactNode; icon: React.ReactNode; type: string } | null>(null);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const plan = await generateStudyPlan(profile);
      if (plan) {
        onUpdateProfile({ studyPlan: plan });
        toast.success("Study plan generated successfully!");
      }
    } catch (error: any) {
      console.error("Error generating study plan:", error);
      if (error instanceof AIServiceError) {
        if (error.type === 'Quota') {
          toast.error("AI limits reached. Please try again later.");
        } else if (error.type === 'Config') {
          toast.error("AI study mapping is not yet configured.");
        } else {
          toast.error(`Study Plan Error: ${error.message}`);
        }
      } else {
        toast.error("Failed to generate plan. Please check your connectivity.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const spiritualData = useMemo(() => {
    if (profile.studyPlan?.spiritualWindows) {
      return profile.studyPlan.spiritualWindows;
    }
    
    if (!profile.birthDate) return null;
    
    const date = new Date(profile.birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    let sign = '';
    let element: 'Fire' | 'Earth' | 'Air' | 'Water' = 'Fire';
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) { sign = 'Aries'; element = 'Fire'; }
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) { sign = 'Taurus'; element = 'Earth'; }
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) { sign = 'Gemini'; element = 'Air'; }
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) { sign = 'Cancer'; element = 'Water'; }
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) { sign = 'Leo'; element = 'Fire'; }
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) { sign = 'Virgo'; element = 'Earth'; }
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) { sign = 'Libra'; element = 'Air'; }
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) { sign = 'Scorpio'; element = 'Water'; }
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) { sign = 'Sagittarius'; element = 'Fire'; }
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) { sign = 'Capricorn'; element = 'Earth'; }
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) { sign = 'Aquarius'; element = 'Air'; }
    else { sign = 'Pisces'; element = 'Water'; }

    const windows = {
      Fire: { favorable: '06:00 - 10:00', unfavorable: '22:00 - 02:00', label: 'Solar Peak' },
      Earth: { favorable: '11:00 - 15:00', unfavorable: '05:00 - 09:00', label: 'Terrestrial Grounding' },
      Air: { favorable: '15:00 - 19:00', unfavorable: '10:00 - 14:00', label: 'Atmospheric Flow' },
      Water: { favorable: '19:00 - 23:00', unfavorable: '13:00 - 17:00', label: 'Lunar Reflection' }
    };

    const elementWindows = windows[element];
    return [
      { start: elementWindows.favorable.split(' - ')[0], end: elementWindows.favorable.split(' - ')[1], label: elementWindows.label, type: 'favorable' as const },
      { start: elementWindows.unfavorable.split(' - ')[0], end: elementWindows.unfavorable.split(' - ')[1], label: 'Energy Drain', type: 'unfavorable' as const }
    ];
  }, [profile.birthDate, profile.studyPlan]);

  const roadmap = useMemo(() => {
    const totalLessons = 46; // Updated count
    const progress = (completed.size / totalLessons) * 100;
    
    if (progress < 20) return { phase: 'Foundational', focus: 'Physical Principles', next: 'Master Acoustic Impedance' };
    if (progress < 50) return { phase: 'Intermediate', focus: 'Instrumentation', next: 'Review Receiver Pipeline' };
    if (progress < 80) return { phase: 'Advanced', focus: 'Doppler & Hemodynamics', next: 'Simulate Doppler Shifts' };
    return { phase: 'Mastery', focus: 'Exam Simulation', next: 'Take Full Mock Exam' };
  }, [completed.size]);

  const schedule = profile.studyPlan?.schedule || [
    { day: 1, label: 'Immediate Recall', topics: ['Waves & Sound Parameters', 'Acoustic Impedance'] },
    { day: 3, label: 'Spaced Reinforcement', topics: ['Transducer Anatomy', 'Beam Focusing'] },
    { day: 7, label: 'Deep Integration', topics: ['Doppler Principles', 'Hemodynamics'] }
  ];

  const techniques = profile.studyPlan?.techniques || [
    "Feynman Method: Explain concepts out loud as if teaching a child.",
    "Blurting: Write down everything you remember about a topic without looking at notes."
  ];

  return (
    <div className="flex flex-col h-full bg-warm-paper dark:bg-stealth-950 transition-colors duration-500 overflow-hidden relative z-[150]">
      <header className="p-4 md:px-8 md:py-6 bg-white dark:bg-stealth-950 text-slate-900 dark:text-white flex justify-between items-center shrink-0 shadow-premium-light dark:shadow-premium border-b tech-border transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-registry-teal/10 dark:bg-white/[0.05] rounded-xl flex items-center justify-center text-registry-teal">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-black uppercase italic tracking-tighter leading-none">Neural Study Plan</h2>
            <p className="technical-label !mt-1.5 opacity-60">Mastery Protocol v4.2</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setNeuralDepthEnabled(!neuralDepthEnabled)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all text-[11px] font-black uppercase tracking-[0.2em] italic ${neuralDepthEnabled ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-glow' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}
          >
            <Zap className={`w-3 h-3 ${neuralDepthEnabled ? 'fill-current' : ''}`} />
            <span className="hidden md:inline">Neural Depth</span>
          </button>
          <button 
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className={`flex items-center space-x-2 px-5 py-2.5 bg-registry-teal text-stealth-950 rounded-xl font-black uppercase tracking-[0.1em] text-[11px] shadow-lg shadow-registry-teal/20 transition-all active:scale-95 disabled:opacity-50 group`}
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
            <span className="italic font-bold">Synchronize</span>
          </button>
          {onPlayNarration && (
            <button 
              onClick={onPlayNarration} 
              disabled={isTtsLoading}
              className={`p-2.5 rounded-xl transition-all ${isNarrating ? 'bg-registry-rose text-white animate-pulse-glow' : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
            >
              {isTtsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 hidden md:block" />
          <FullscreenToggle 
            className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'} hover:scale-105 active:scale-95`}
            iconClassName="w-5 h-5"
          />
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors text-slate-400 dark:text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0 p-6 md:p-10 space-y-10 scroll-smooth neural-grid">
        {/* Dynamic Roadmap Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-registry-teal" />
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Personalized Roadmap</h3>
          </div>
          <div className={`p-8 ${isDarkMode ? 'bg-stealth-900/60' : 'bg-white'} rounded-[2rem] border tech-border relative overflow-hidden group shadow-premium-light dark:shadow-premium backdrop-blur-xl`}>
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
               <Target className="w-40 h-40 text-registry-teal" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="px-5 py-2 bg-registry-teal/10 text-registry-teal text-[11px] font-black uppercase italic rounded-full border border-registry-teal/20">
                    Phase: {roadmap.phase}
                  </span>
                  <h4 className={`text-3xl md:text-5xl font-black italic mt-4 tracking-tighter uppercase leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {roadmap.focus}
                  </h4>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="technical-label opacity-60 mb-2">Next Objective</span>
                  <p className="text-sm font-black text-registry-teal italic bg-registry-teal/5 px-4 py-1.5 rounded-lg border border-registry-teal/10">{roadmap.next}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="technical-label !tracking-[0.2em] !text-[11px]">Overall Neural Mastery</span>
                  <span className="text-lg font-black text-registry-teal italic tabular-nums">{Math.round((completed.size / 46) * 100)}%</span>
                </div>
                <div className="h-2 bg-black/20 dark:bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(completed.size / 46) * 100}%` }}
                    className="h-full bg-registry-teal shadow-glow"
                  />
                </div>
              </div>

              <AnimatePresence>
                {neuralDepthEnabled && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="mt-8 pt-8 border-t tech-border grid grid-cols-2 md:grid-cols-4 gap-6"
                  >
                    {[
                      { label: 'Synaptic Load', val: '42.4%', color: 'text-indigo-400' },
                      { label: 'Retention rate', val: '88.1%', color: 'text-registry-teal' },
                      { label: 'Neural Path', val: 'STABLE', color: 'text-emerald-400' },
                      { label: 'Data Density', val: 'HIGH', color: 'text-amber-400' }
                    ].map((s, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="micro-label opacity-60 leading-none mb-2 tabular-nums">{s.label}</span>
                        <span className={`text-xl font-black italic tracking-tighter ${s.color}`}>{s.val}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Spiritual Timing Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black uppercase italic text-slate-900 dark:text-white">Spiritual Alignment</h3>
          </div>
          
          {spiritualData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative group/spiritual">
              <button 
                onClick={() => setFocusedTile({
                  title: "Spiritual Alignment",
                  subtitle: "Cosmic Peak Tracking",
                  icon: <Sparkles className="w-8 h-8 text-amber-500" />,
                  type: 'spiritual',
                  content: (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {spiritualData.map((window, idx) => (
                        <div 
                          key={idx}
                          className={`p-10 ${window.type === 'favorable' ? 'bg-teal-500/10 border-teal-500/20' : 'bg-rose-500/10 border-rose-500/20'} border rounded-[3rem] space-y-4`}
                        >
                           <div className="flex items-center space-x-4">
                              <div className={`p-4 rounded-2xl ${window.type === 'favorable' ? 'bg-teal-500/20' : 'bg-rose-500/20'}`}>
                                {window.type === 'favorable' ? <Clock className="w-8 h-8 text-teal-400" /> : <AlertTriangle className="w-8 h-8 text-rose-400" />}
                              </div>
                              <div>
                                <h5 className={`text-2xl font-black italic ${window.type === 'favorable' ? 'text-teal-400' : 'text-rose-400'}`}>{window.label}</h5>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Matrix window</p>
                              </div>
                           </div>
                           <p className={`text-5xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                             {window.start} - {window.end}
                           </p>
                           <div className="pt-4 border-t border-white/5 text-sm text-slate-400 font-medium italic">
                             {window.type === 'favorable' ? 'Optimal cognitive absorption phase detected.' : 'Increased mental fatigue risk detected.'}
                           </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
                className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-amber-500 text-white rounded-xl opacity-0 group-hover/spiritual:opacity-100 transition-all z-20"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              {spiritualData.map((window, idx) => (
                <div 
                  key={idx}
                  className={`p-6 ${window.type === 'favorable' 
                    ? (isDarkMode ? 'bg-teal-900/20 border-teal-500/30' : 'bg-teal-50 border-teal-200') 
                    : (isDarkMode ? 'bg-registry-rose/20 border-registry-rose/30' : 'bg-registry-rose/5 border-registry-rose/20')
                  } border rounded-3xl`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {window.type === 'favorable' ? <Clock className={`w-5 h-5 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} /> : <AlertTriangle className={`w-5 h-5 ${isDarkMode ? 'text-registry-rose' : 'text-registry-rose'}`} />}
                    <span className={`text-xs font-black uppercase tracking-widest ${window.type === 'favorable' ? (isDarkMode ? 'text-teal-400' : 'text-teal-600') : (isDarkMode ? 'text-registry-rose' : 'text-registry-rose')}`}>
                      {window.type === 'favorable' ? 'Favorable Window' : 'Unfavorable Window'}
                    </span>
                  </div>
                  <p className={`text-2xl font-black italic ${window.type === 'favorable' ? (isDarkMode ? 'text-teal-400' : 'text-teal-700') : (isDarkMode ? 'text-registry-rose' : 'text-registry-rose')}`}>
                    {window.start} - {window.end}
                  </p>
                  <p className={`text-[11px] font-bold uppercase ${window.type === 'favorable' ? (isDarkMode ? 'text-teal-400/70' : 'text-teal-600/70') : (isDarkMode ? 'text-registry-rose/70' : 'text-registry-rose/70')} mt-1`}>
                    {window.label}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl opacity-50">
              <p className="text-xs font-black uppercase tracking-widest">Enter Birth Date in Settings to Unlock Timing</p>
            </div>
          )}
        </section>

        {/* AI Schedule Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-registry-teal" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Neural Schedule Matrix</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            {schedule.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedDayDetail({ day: item.day, label: item.label, topics: item.topics })}
                className={`flex items-start space-x-6 p-6 ${isDarkMode ? 'bg-stealth-900/40 border-white/5 hover:border-registry-teal/40' : 'bg-white border-slate-100 hover:border-registry-teal/40'} rounded-[2rem] border cursor-pointer transition-all hover:scale-[1.01] shadow-premium-light dark:shadow-premium group`}
              >
                <div className="w-14 h-14 rounded-2xl bg-registry-teal flex items-center justify-center text-stealth-950 font-black italic text-2xl shrink-0 shadow-glow">
                  {item.day}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="micro-label opacity-60">Day Allocation</span>
                    <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/5" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white mt-1 italic">{item.label || `Day ${item.day}`}</h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.topics.map(t => (
                      <span key={t} className="px-3 py-1 bg-registry-teal/5 text-registry-teal text-[11px] font-black uppercase rounded-lg border border-registry-teal/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-3">
                  <div className={`p-2 rounded-lg ${completed.has(item.day.toString()) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  {neuralDepthEnabled && (
                    <span className="micro-label text-registry-teal !opacity-100 animate-pulse">LINKED</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Synaptic Integration Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Synaptic Web</h3>
          </div>
          <div className={`p-10 ${isDarkMode ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-100'} border rounded-[2.5rem] relative overflow-hidden group backdrop-blur-md`}>
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Binary className="w-48 h-48 text-indigo-500" />
            </div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h4 className="technical-label !text-indigo-400">Exam Weighting Matrix</h4>
                <div className="space-y-5">
                  {[
                    { label: 'Instrumentation', weight: 85 },
                    { label: 'Doppler Dynamics', weight: 92 },
                    { label: 'Bioeffects Trace', weight: 75 },
                    { label: 'Wave Physics', weight: 60 }
                  ].map((w, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{w.label}</span>
                        <span className="text-sm font-black text-indigo-400 tabular-nums">{w.weight}%</span>
                      </div>
                      <div className="h-1.5 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${w.weight}%` }}
                          className="h-full bg-indigo-500 shadow-glow"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 border-2 border-dashed border-indigo-500/20 rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-32 h-32 border border-indigo-400/10 rounded-full scale-125"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-indigo-500 drop-shadow-glow" />
                  </div>
                </div>
                <p className="micro-label mt-10 text-indigo-400">Neural Connectivity Status: <span className="animate-pulse">Active</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Techniques Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Neural Mastery Protocols</h3>
          </div>
          <div className={`p-8 ${isDarkMode ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'} border rounded-[2.5rem] space-y-6 relative group/tech text-left shadow-premium-light dark:shadow-premium`}>
            <ul className="space-y-5">
              {techniques.map((tech, idx) => (
                <li key={idx} className="flex items-start space-x-4 group/item">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0 group-hover/item:scale-150 transition-transform shadow-glow" />
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} leading-relaxed italic`}>
                    {tech}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Clinical Wisdom Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-registry-teal" />
            <h3 className="text-lg font-black uppercase italic text-slate-900 dark:text-white">Clinical Wisdom</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLINICAL_TIPS.slice(0, 4).map((tip, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-100'} shadow-xl relative overflow-hidden group h-full`}
              >
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                  <button 
                    onClick={() => setFocusedTile({
                      title: tip.title,
                      subtitle: tip.category,
                      icon: <Stethoscope className="w-8 h-8 text-registry-teal" />,
                      type: 'clinical',
                      content: (
                        <div className="space-y-8 max-w-2xl mx-auto">
                           <div className="p-10 bg-registry-teal/10 rounded-[3rem] border border-registry-teal/20 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Stethoscope className="w-48 h-48 text-registry-teal" />
                              </div>
                              <p className="text-2xl md:text-3xl font-medium leading-relaxed italic text-white relative z-10">
                                "{tip.content}"
                              </p>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                 <p className="text-[11px] font-black uppercase text-slate-500 tracking-widest mb-1">Impact Layer</p>
                                 <p className="text-sm font-black text-teal-400 italic">High-Yield SPI</p>
                              </div>
                              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                 <p className="text-[11px] font-black uppercase text-slate-500 tracking-widest mb-1">Neural Tag</p>
                                 <p className="text-sm font-black text-amber-400 italic">Clinical Protocol</p>
                              </div>
                           </div>
                        </div>
                      )
                    })}
                    className="p-2 bg-registry-teal/10 hover:bg-registry-teal text-registry-teal hover:text-white rounded-xl transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Stethoscope className="w-12 h-12 text-registry-teal" />
                </div>
                <div className="relative z-10">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-registry-teal mb-2 block">{tip.category}</span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">{tip.title}</h4>
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} italic`}>
                    {tip.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <footer className="p-8 border-t border-slate-100 dark:border-white/10 text-center opacity-50 shrink-0">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Source: Neural Network Version 4.2.1-SPI</p>
      </footer>

      <AnimatePresence>
        {focusedTile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-stealth-950/98 backdrop-blur-3xl flex items-center justify-center p-6 md:p-12 overflow-y-auto"
          >
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setFocusedTile(null)}
              className="fixed top-8 right-8 p-4 bg-white/10 border border-white/10 text-white rounded-full hover:bg-registry-rose hover:border-registry-rose transition-all z-50"
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <div className="max-w-5xl w-full">
              <div className="flex flex-col items-center text-center space-y-6 mb-16">
                 <motion.div 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="p-6 bg-white/5 rounded-[2rem] border border-white/10 mb-4"
                 >
                    {focusedTile.icon}
                 </motion.div>
                 <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-teal-500 tracking-[0.4em]">{focusedTile.subtitle}</span>
                    <h2 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter leading-none">
                      {focusedTile.title}
                    </h2>
                 </div>
              </div>
              
              <motion.div 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative z-10"
              >
                {focusedTile.content}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDayDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-stealth-950/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-2xl w-full bg-stealth-900 border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Target className="w-64 h-64 text-teal-500" />
              </div>

              <button 
                onClick={() => setSelectedDayDetail(null)}
                className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-teal-400">
                    <Zap className="w-5 h-5 fill-current" />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Deep Dive Layer: Day {selectedDayDetail.day}</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter">
                    {selectedDayDetail.label || `Matrix Allocation ${selectedDayDetail.day}`}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">Priority Modules</h4>
                    <div className="space-y-3">
                      {selectedDayDetail.topics.map((t, i) => (
                        <div key={i} className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="w-2 h-2 bg-teal-500 rounded-full" />
                          <span className="text-sm font-bold text-white italic">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">Neural Strategy</h4>
                    <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
                      <p className="text-sm text-indigo-300 leading-relaxed font-medium italic">
                        "For these topics, focus on the inverse relationship matrix. Use visual sketching to map the acoustic impedance variables."
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                      <span className="text-[11px] font-black uppercase text-slate-500">Est. Load</span>
                      <span className="text-sm font-black text-teal-500 italic">Moderate (2.4h)</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedDayDetail(null)}
                  className="w-full py-4 bg-registry-teal text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-registry-teal/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirm Study Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
