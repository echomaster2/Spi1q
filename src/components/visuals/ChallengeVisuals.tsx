import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Sliders, Zap, CheckCircle2, ChevronRight, Info, AlertCircle, RefreshCcw, Activity, Shield } from 'lucide-react';
import { VisualHeader, VisualInsight } from './BaseVisuals';

export const ImageOptimizationChallenge: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [settings, setSettings] = useState({ gain: 50, dynamicRange: 60, focalZone: 50, tgc: 50 });
  const [isPassed, setIsPassed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const challenges = [
    {
      id: 0,
      title: 'Liver Detail Optimization',
      objective: 'The parenchyma is saturated. Attenuate the gain and compress the dynamic range to visualize the hepatic vein margins.',
      target: { gain: 35, dynamicRange: 45 },
      threshold: 12,
      hint: 'Reduce gain below 40% and drop DR below 50dB for sharper margins.'
    },
    {
      id: 1,
      title: 'Critical Focus: Depth Shift',
      objective: 'A suspected cyst at 80% depth is blurry. Shift the focal zone to enhance lateral resolution for precise boundary detection.',
      target: { focalZone: 80 },
      threshold: 8,
      hint: 'Bring the focus down to the 80% mark to sharpen the distal structures.'
    },
    {
      id: 2,
      title: 'Uniform Echo Compensation',
      objective: 'The near-field is obscured by "noise" while the diaphragm at depth is lost. Balance the TGC for a uniform tissue texture.',
      target: { tgc: 30 },
      threshold: 12,
      hint: 'Drop near-field TGC to compensate for high-amplitude near-surface reflections.'
    }
  ];

  const current = challenges[stage];

  const checkOptimization = () => {
    let passed = true;
    const keys = Object.keys(current.target) as Array<keyof typeof settings>;
    
    for (const key of keys) {
      if (Math.abs(settings[key] - (current.target as any)[key]) > current.threshold) {
        passed = false;
        break;
      }
    }

    if (passed) {
      setIsPassed(true);
      setFeedback('Signal Integrity Synchronized. Diagnosis Validated.');
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
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Optimization Lab" 
        subtitle="Signal Integrity Simulator" 
        icon={Target} 
        protocol={`PHASE-${stage + 1}`}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10">
        <div className="space-y-8">
           <div className="aspect-[4/3] bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative group/display shadow-inner flex items-center justify-center">
              <div className="absolute inset-0 scanline opacity-30 z-20 pointer-events-none" />
              
              <motion.div 
                animate={{ 
                  filter: `brightness(${settings.gain / 50}) contrast(${1 + (60 - settings.dynamicRange) / 80})`,
                  opacity: 0.5 + (settings.tgc / 200)
                }}
                className="w-full h-full relative flex items-center justify-center pt-8"
              >
                 <svg className="w-[90%] h-full overflow-visible" viewBox="0 0 400 300">
                    <defs>
                       <clipPath id="sectorClipLab">
                          <path d="M 200 20 L 50 280 Q 200 320 350 280 Z" />
                       </clipPath>
                    </defs>

                    <g clipPath="url(#sectorClipLab)">
                       <rect width="100%" height="100%" fill="#0a0a0a" />
                       {Array.from({ length: 50 }).map((_, i) => (
                         <circle 
                           key={i} 
                           cx={100 + Math.random() * 200} 
                           cy={50 + Math.random() * 250} 
                           r={Math.random() * 15} 
                           fill="#2dd4bf" 
                           fillOpacity={0.03 + Math.random() * 0.05} 
                         />
                       ))}

                       <motion.circle 
                         cx="200" 
                         cy="200" 
                         r="35" 
                         fill="black" 
                         stroke="white" 
                         strokeWidth={Math.abs(settings.focalZone - 66) < 10 ? 1.5 : 5}
                         strokeOpacity={0.2}
                         animate={{ 
                           filter: Math.abs(settings.focalZone - 66) < 15 ? "blur(0px)" : "blur(6px)",
                           opacity: settings.dynamicRange > 50 ? 0.2 : 0.9,
                           scale: [1, 1.02, 1]
                         }}
                         transition={{ scale: { repeat: Infinity, duration: 3 } }}
                         className="transition-all duration-700"
                       />
                    </g>
                    
                    <motion.path 
                      animate={{ y: (settings.focalZone / 100) * 260 }}
                      d="M 120 40 L 280 40" 
                      stroke="#2dd4bf" 
                      strokeWidth="3" 
                      strokeDasharray="8 4"
                      className="opacity-40 shadow-glow"
                    />
                    <motion.text 
                      animate={{ y: (settings.focalZone / 100) * 260 }}
                      x="295" y="45" 
                      fill="#2dd4bf" 
                      className="text-[10px] font-black uppercase italic tracking-widest opacity-80"
                    >
                      Focus
                    </motion.text>

                    <path d="M 200 20 L 50 280 Q 200 320 350 280 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                 </svg>
              </motion.div>

              <div className="absolute top-8 left-8 flex flex-col space-y-1">
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">SIG-ANALYSIS_V4</span>
                 <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-4 bg-registry-teal shadow-glow rounded-full" />
                    <span className="text-[11px] font-black text-white italic uppercase tracking-tighter drop-shadow-lg">LIVE_STREAM ACTIVE</span>
                 </div>
              </div>
           </div>

           <div className="bg-stealth-950 p-8 rounded-[2.5rem] border border-white/5 space-y-5 shadow-inner group/box relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50" />
              <div className="flex items-center space-x-3 text-amber-500 relative z-10">
                 <Info className="w-5 h-5 drop-shadow-glow-amber" />
                 <h5 className="text-[11px] font-black uppercase tracking-[0.2em] italic">{current.title}</h5>
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed font-bold italic relative z-10 leading-tight">"{current.objective}"</p>
           </div>
        </div>

        <div className="flex flex-col justify-between space-y-8">
           <div className="space-y-10">
              <div className="space-y-5">
                 <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] italic">Overall Gain</label>
                    <span className="text-2xl font-black text-white tabular-nums italic shadow-glow-sm">{settings.gain}%</span>
                 </div>
                 <input type="range" min="0" max="100" value={settings.gain} onChange={e => setSettings({...settings, gain: parseInt(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner" />
              </div>

              <div className="space-y-5">
                 <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] italic">Dynamic Range</label>
                    <span className="text-2xl font-black text-white tabular-nums italic shadow-glow-sm">{settings.dynamicRange} <span className="text-[12px] opacity-40">dB</span></span>
                 </div>
                 <input type="range" min="30" max="90" value={settings.dynamicRange} onChange={e => setSettings({...settings, dynamicRange: parseInt(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner" />
              </div>

              <div className="space-y-5">
                 <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] italic">Focus Zone</label>
                    <span className="text-2xl font-black text-white tabular-nums italic shadow-glow-sm">{settings.focalZone}% <span className="text-[12px] opacity-40">Depth</span></span>
                 </div>
                 <input type="range" min="10" max="90" value={settings.focalZone} onChange={e => setSettings({...settings, focalZone: parseInt(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner" />
              </div>

              <div className="space-y-5">
                 <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] italic">Near-Field TGC</label>
                    <span className="text-2xl font-black text-white tabular-nums italic shadow-glow-sm">{settings.tgc}%</span>
                 </div>
                 <input type="range" min="0" max="100" value={settings.tgc} onChange={e => setSettings({...settings, tgc: parseInt(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner" />
              </div>
           </div>

           <div className="space-y-8 pt-10 border-t border-white/5">
              <AnimatePresence mode="wait">
                 {feedback && (
                    <motion.div 
                      key={feedback}
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start space-x-5 p-8 rounded-[2rem] shadow-2xl ${isPassed ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 shadow-glow-teal' : 'bg-registry-amber/10 text-amber-500 border border-amber-500/20 shadow-glow-amber'}`}
                    >
                       {isPassed ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" /> : <AlertCircle className="w-6 h-6 shrink-0 mt-1" />}
                       <div>
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 block">{isPassed ? 'Verification Matrix Passed' : 'System Diagnostic Alert'}</span>
                          <p className="text-[12px] font-black uppercase italic leading-relaxed tracking-tight">{feedback}</p>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-6">
                 <button 
                   onClick={checkOptimization}
                   className="flex-1 py-8 bg-registry-teal text-stealth-950 rounded-2xl text-[12px] font-black uppercase italic tracking-[0.4em] shadow-glow-teal hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    Inject Signal Profile
                 </button>
                 {isPassed && (
                    <motion.button 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={nextStage}
                      className="px-10 py-8 bg-stealth-950 border border-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] italic hover:bg-white/5 transition-all flex items-center justify-center space-x-4 shadow-2xl"
                    >
                       <span>Next Phase</span>
                       <ChevronRight className="w-5 h-5 animate-pulse" />
                    </motion.button>
                 )}
              </div>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="The Optimization Logic" 
        description="Mastery of instrumentation is the foundation of ultrasound physics. Signal processing involves a chain of events: Overall gain amplifies all returning signals equally, including noise. Dynamic Range compresses the widest range of echoes into a visible grayscale. Focus positioning uses phase delays to narrow the beam at a specific depth, which is the only way to maximize lateral resolution in the region of interest." 
        keyTerms={['gain', 'tgc', 'dynamic-range', 'focal-zone', 'lateral-resolution', 'instrumentation']}
      />
    </motion.div>
  );
};
