import React, { useMemo, useState } from 'react';
import { Calendar, Clock, Sparkles, AlertTriangle, CheckCircle2, BookOpen, Zap, Volume2, Pause, Loader2, Target, Brain, RefreshCw, X, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FullscreenToggle } from './FullscreenToggle';
import { UserProfile } from '../types';
import { generateStudyPlan } from '../src/services/aiService';
import { CLINICAL_TIPS } from '../src/constants/clinicalTips';

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

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const plan = await generateStudyPlan(profile);
      if (plan) {
        onUpdateProfile({ studyPlan: plan });
      }
    } catch (error) {
      console.error("Error generating study plan:", error);
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
    const totalLessons = 35; // Approximate
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
    <div className="flex flex-col h-full bg-white dark:bg-stealth-950 transition-colors duration-500 overflow-hidden relative z-[150]">
      <header className="p-4 md:p-6 bg-white dark:bg-stealth-950 text-slate-900 dark:text-white flex justify-between items-center shrink-0 shadow-lg border-b border-slate-100 dark:border-white/10 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-white/20 rounded-xl flex items-center justify-center text-teal-500 dark:text-white">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base md:text-xl font-black uppercase italic tracking-tighter leading-none">Neural Study Plan</h2>
            <p className="text-[8px] md:text-[10px] opacity-70 font-black uppercase tracking-widest mt-0.5">AI-Powered Mastery Protocol</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className={`flex items-center space-x-2 px-4 py-2 bg-registry-teal text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-registry-teal/20 transition-all active:scale-95 disabled:opacity-50`}
          >
            {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
            <span>{profile.studyPlan ? 'Regenerate Plan' : 'Generate AI Plan'}</span>
          </button>
          {onPlayNarration && (
            <button 
              onClick={onPlayNarration} 
              disabled={isTtsLoading}
              className={`p-2 rounded-xl transition-all ${isNarrating ? 'bg-registry-rose text-white animate-pulse' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-white/70'}`}
            >
              {isTtsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
          <FullscreenToggle className="bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-white/70 border-none" iconClassName="w-5 h-5" />
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors text-slate-400 dark:text-white/70">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0 p-4 md:p-8 space-y-8 scroll-smooth">
        {/* Dynamic Roadmap Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-teal-500" />
            <h3 className="text-lg font-black uppercase italic text-slate-900 dark:text-white">Personalized Roadmap</h3>
          </div>
          <div className={`p-6 ${isDarkMode ? 'bg-slate-900 dark:bg-stealth-950' : 'bg-slate-900'} rounded-3xl border border-white/10 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles className="w-24 h-24 text-teal-500" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-3 py-1 bg-teal-500 text-white text-[10px] font-black uppercase rounded-full">
                    Phase: {roadmap.phase}
                  </span>
                  <h4 className="text-2xl font-black italic text-white mt-2 tracking-tighter">
                    {roadmap.focus}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-slate-500">Next Objective</p>
                  <p className="text-sm font-bold text-teal-400 italic">{roadmap.next}</p>
                </div>
              </div>
              
              <div className={`space-y-2`}>
                <div className={`flex justify-between text-[10px] font-black uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                  <span>Overall Mastery</span>
                  <span>{Math.round((completed.size / 35) * 100)}%</span>
                </div>
                <div className={`h-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-800'} rounded-full overflow-hidden`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(completed.size / 35) * 100}%` }}
                    className="h-full bg-gradient-to-r from-teal-600 to-teal-400"
                  />
                </div>
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <p className={`text-[10px] font-bold uppercase ${window.type === 'favorable' ? (isDarkMode ? 'text-teal-400/70' : 'text-teal-600/70') : (isDarkMode ? 'text-registry-rose/70' : 'text-registry-rose/70')} mt-1`}>
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
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-teal-500" />
            <h3 className="text-lg font-black uppercase italic text-slate-900 dark:text-white">Neural Schedule Matrix</h3>
          </div>
          
          <div className="space-y-4">
            {schedule.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-start space-x-4 p-6 ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-slate-50 border-slate-100'} rounded-3xl border`}
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-black italic text-xl shrink-0">
                  {item.day}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">{item.label || `Day ${item.day}`}</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.topics.map(t => (
                      <span key={t} className="px-3 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase rounded-full border border-teal-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-slate-300 dark:text-slate-700 mt-1" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Techniques Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-black uppercase italic text-slate-900 dark:text-white">AI-Generated Techniques</h3>
          </div>
          <div className={`p-6 ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'} border rounded-3xl space-y-4`}>
            <ul className="space-y-4">
              {techniques.map((tech, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-indigo-200' : 'text-slate-700'} leading-relaxed italic`}>
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
                className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-100'} shadow-xl relative overflow-hidden group`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Stethoscope className="w-12 h-12 text-registry-teal" />
                </div>
                <div className="relative z-10">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-registry-teal mb-2 block">{tip.category}</span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">{tip.title}</h4>
                  <p className={`text-[10px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} italic`}>
                    {tip.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
