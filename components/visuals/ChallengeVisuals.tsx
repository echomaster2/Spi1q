import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Sliders, Zap, CheckCircle2, ChevronRight, Info, AlertCircle, RefreshCcw } from 'lucide-react';
import { VisualInsight } from './BaseVisuals';

export const ImageOptimizationChallenge: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [settings, setSettings] = useState({ gain: 50, dynamicRange: 60, focalZone: 50, tgc: 50 });
  const [isPassed, setIsPassed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const challenges = [
    {
      id: 0,
      title: 'The Gray Mist',
      objective: 'The image is too bright and lacks contrast. Optimize the dynamic range and gain for a balanced liver scan.',
      target: { gain: 40, dynamicRange: 45 },
      threshold: 10,
      hint: 'Lower the gain and decrease dynamic range to increase contrast.'
    },
    {
      id: 1,
      title: 'Deeper Resolution',
      objective: 'A structural detail at depth is blurry. Move the focal zone to match the horizontal midline.',
      target: { focalZone: 80 },
      threshold: 5,
      hint: 'The focal zone should be placed at or just below the area of interest.'
    },
    {
      id: 2,
      title: 'TGC Balance',
      objective: 'The near field is "blown out" while the far field is dark. Adjust the TGC (Time Gain Compensation) to unify the signal.',
      target: { tgc: 30 },
      threshold: 10,
      hint: 'Decrease near-field gain to balance with attenuated far-field echoes.'
    }
  ];

  const current = challenges[stage];

  const checkOptimization = () => {
    let passed = true;
    const keys = Object.keys(current.target) as Array<keyof typeof settings>;
    
    for (const key of keys) {
      if (Math.abs(settings[key] - current.target[key]!) > current.threshold) {
        passed = false;
        break;
      }
    }

    if (passed) {
      setIsPassed(true);
      setFeedback('Optimization Target Reached! Signal integrity restored.');
    } else {
      setFeedback(current.hint);
    }
  };

  const nextStage = () => {
    setStage(prev => (prev + 1) % challenges.length);
    setIsPassed(false);
    setFeedback(null);
    setSettings({ gain: 50, dynamicRange: 60, focalZone: 50, tgc: 50 });
  };

  return (
    <div className="bg-stealth-900 p-6 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden w-full">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/30 shadow-glow">
            <Target className="w-6 h-6 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-2xl font-black uppercase italic text-white leading-none">Gain Mastery</h4>
            <p className="text-[10px] font-black text-registry-teal uppercase tracking-[0.3em] mt-2 flex items-center">
               <Sliders className="w-3 h-3 mr-2 animate-pulse" /> Signal Optimization Challenge
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stage {stage + 1} / {challenges.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <div className="space-y-6">
           <div className="aspect-square bg-black rounded-[2.5rem] border-2 border-slate-800 overflow-hidden relative group shadow-2xl">
              <div className="absolute inset-0 scanline opacity-20" />
              
              {/* Simulated Ultrasound Image Area */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <motion.div 
                   animate={{ 
                     filter: `brightness(${settings.gain / 50}) contrast(${1 + (60 - settings.dynamicRange) / 100})`,
                     opacity: settings.tgc / 100 + 0.5
                   }}
                   className="w-48 h-48 rounded-full border-8 border-white/10 relative"
                 >
                    <div className={`absolute w-full h-1 bg-registry-teal/40 blur-sm`} style={{ top: `${settings.focalZone}%` }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className={`w-20 h-20 bg-white/10 rounded-lg blur-md transition-all duration-500`} 
                            style={{ 
                              opacity: Math.abs(settings.focalZone - 50) < 10 ? 0.8 : 0.2,
                              scale: Math.abs(settings.focalZone - 50) < 10 ? 1 : 1.2
                            }} 
                       />
                    </div>
                 </motion.div>
              </div>

              <div className="absolute top-6 left-6 flex flex-col space-y-1">
                 <span className="text-[7px] font-black text-white/50 uppercase tracking-widest">System_Rendering</span>
                 <div className="flex items-center space-x-2">
                    <div className="w-1 h-3 bg-registry-teal rounded-full" />
                    <span className="text-[10px] font-black text-white italic uppercase tracking-tighter">Live Scan</span>
                 </div>
              </div>
           </div>

           <div className="premium-glass p-8 rounded-[2rem] border border-white/5 space-y-4">
              <div className="flex items-center space-x-3 text-registry-amber">
                 <Info className="w-5 h-5" />
                 <h5 className="text-sm font-black uppercase italic tracking-tight">{current.title}</h5>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{current.objective}</p>
           </div>
        </div>

        <div className="flex flex-col justify-between space-y-8">
           <div className="space-y-6">
              <div className="space-y-4">
                 <div className="flex justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-500">Overall Gain</label>
                    <span className="text-[10px] font-black text-white italic">{settings.gain}%</span>
                 </div>
                 <input type="range" min="0" max="100" value={settings.gain} onChange={e => setSettings({...settings, gain: parseInt(e.target.value)})} className="w-full accent-registry-teal h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-500">Dynamic Range (dB)</label>
                    <span className="text-[10px] font-black text-white italic">{settings.dynamicRange}dB</span>
                 </div>
                 <input type="range" min="30" max="90" value={settings.dynamicRange} onChange={e => setSettings({...settings, dynamicRange: parseInt(e.target.value)})} className="w-full accent-registry-teal h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-500">Focus Position</label>
                    <span className="text-[10px] font-black text-white italic">{settings.focalZone}% Depth</span>
                 </div>
                 <input type="range" min="10" max="90" value={settings.focalZone} onChange={e => setSettings({...settings, focalZone: parseInt(e.target.value)})} className="w-full accent-registry-teal h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-500">Near-Field TGC</label>
                    <span className="text-[10px] font-black text-white italic">{settings.tgc}%</span>
                 </div>
                 <input type="range" min="0" max="100" value={settings.tgc} onChange={e => setSettings({...settings, tgc: parseInt(e.target.value)})} className="w-full accent-registry-teal h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              </div>
           </div>

           <div className="space-y-4 pt-6 border-t border-white/5">
              <AnimatePresence mode="wait">
                 {feedback && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-start space-x-3 p-4 rounded-2xl ${isPassed ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-registry-amber/10 text-registry-amber border border-registry-amber/20'}`}
                    >
                       {isPassed ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                       <p className="text-[10px] font-black uppercase italic leading-relaxed">{feedback}</p>
                    </motion.div>
                 )}
              </AnimatePresence>

              <div className="flex space-x-4">
                 <button 
                   onClick={checkOptimization}
                   className="flex-1 py-4 bg-registry-teal text-stealth-950 rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-glow hover:scale-[1.02] transition-all"
                 >
                    Analyze Signal
                 </button>
                 {isPassed && (
                    <button 
                      onClick={nextStage}
                      className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-white/20 transition-all flex items-center space-x-2"
                    >
                       <span>Next Phase</span>
                       <ChevronRight className="w-4 h-4" />
                    </button>
                 )}
              </div>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Optimization Dynamics" 
        description="Mastering the ultrasound interface requires balancing multiple controls. Gain controls overall brightness, dynamic range controls the gray-scale 'stretch', and the focus improves lateral resolution at specific depths. Proper adjustment is key for reducing noise and highlighting pathology." 
      />
    </div>
  );
};
