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
      if (Math.abs(settings[key] - current.target[key]!) > current.threshold) {
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
    <div className="bg-stealth-900 p-6 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden w-full">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10 mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/30 shadow-glow">
            <Target className="w-6 h-6 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-2xl font-black uppercase italic text-white leading-none tracking-tight">Signal Analysis Simulator</h4>
            <p className="text-[11px] font-black text-registry-teal uppercase tracking-[0.3em] mt-2 flex items-center">
               <Sliders className="w-3 h-3 mr-2 animate-pulse" /> Diagnostic Feedback Loop
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
           <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Challenge Phase {stage + 1} / {challenges.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <div className="space-y-6">
           <div className="aspect-[4/3] bg-black rounded-[2.5rem] border-2 border-slate-800 overflow-hidden relative group shadow-2xl flex items-center justify-center">
              <div className="absolute inset-0 scanline opacity-40 z-20 pointer-events-none" />
              
              {/* Simulated Ultrasound Sector Scan */}
              <motion.div 
                animate={{ 
                  filter: `brightness(${settings.gain / 50}) contrast(${1 + (60 - settings.dynamicRange) / 80})`,
                  opacity: 0.4 + (settings.tgc / 150)
                }}
                className="w-full h-full relative flex items-center justify-center pt-8"
              >
                 <svg className="w-[90%] h-full overflow-visible" viewBox="0 0 400 300">
                    <defs>
                       <clipPath id="sectorClip">
                          <path d="M 200 20 L 50 280 Q 200 320 350 280 Z" />
                       </clipPath>
                    </defs>

                    <g clipPath="url(#sectorClip)">
                       {/* Background Speckle Tissue */}
                       <rect width="100%" height="100%" fill="#111" />
                       {Array.from({ length: 40 }).map((_, i) => (
                         <circle 
                           key={i} 
                           cx={100 + Math.random() * 200} 
                           cy={50 + Math.random() * 250} 
                           r={Math.random() * 20} 
                           fill="white" 
                           fillOpacity={0.05 + Math.random() * 0.1} 
                         />
                       ))}

                       {/* Anatomic Target (Cyst/Vessel) */}
                       <motion.circle 
                         cx="200" 
                         cy="200" 
                         r="35" 
                         fill="black" 
                         stroke="white" 
                         strokeWidth={Math.abs(settings.focalZone - 66) < 10 ? 1 : 4}
                         strokeOpacity={0.2}
                         animate={{ 
                           filter: Math.abs(settings.focalZone - 66) < 15 ? "blur(0px)" : "blur(4px)",
                           opacity: settings.dynamicRange > 50 ? 0.3 : 0.8
                         }}
                         className="transition-all duration-700"
                       />
                    </g>
                    {/* Beam Focus Line */}
                    <motion.path 
                      animate={{ y: (settings.focalZone / 100) * 260 }}
                      d="M 120 40 L 280 40" 
                      stroke="#22d3ee" 
                      strokeWidth="2" 
                      strokeDasharray="4 4"
                      className="opacity-40"
                    />
                    <motion.text 
                      animate={{ y: (settings.focalZone / 100) * 260 }}
                      x="290" y="44" 
                      fill="#22d3ee" 
                      className="text-[11px] font-black uppercase opacity-60"
                    >
                      Focus
                    </motion.text>

                    {/* Sector Border */}
                    <path d="M 200 20 L 50 280 Q 200 320 350 280 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
                 </svg>
              </motion.div>

              <div className="absolute top-6 left-6 flex flex-col space-y-1">
                 <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.3em]">H-RESO_UNIT #402</span>
                 <div className="flex items-center space-x-2">
                    <div className="w-1 h-3 bg-registry-teal shadow-glow-teal rounded-full" />
                    <span className="text-[11px] font-black text-white italic uppercase tracking-tighter">Live Scan Analysis</span>
                 </div>
              </div>
           </div>

           <div className="premium-glass p-8 rounded-[2.5rem] border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center space-x-3 text-amber-500">
                 <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    <Info className="w-4 h-4" />
                 </div>
                 <h5 className="text-[11px] font-black uppercase tracking-widest">{current.title}</h5>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium italic">"{current.objective}"</p>
           </div>
        </div>

        <div className="flex flex-col justify-between space-y-8">
           <div className="space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Overall Gain</label>
                    <span className="text-md font-black text-white italic">{settings.gain}%</span>
                 </div>
                 <input type="range" min="0" max="100" value={settings.gain} onChange={e => setSettings({...settings, gain: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal" />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Dynamic Range</label>
                    <span className="text-md font-black text-white italic">{settings.dynamicRange} dB</span>
                 </div>
                 <input type="range" min="30" max="90" value={settings.dynamicRange} onChange={e => setSettings({...settings, dynamicRange: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal" />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Focus Position</label>
                    <span className="text-md font-black text-white italic">{settings.focalZone}% Depth</span>
                 </div>
                 <input type="range" min="10" max="90" value={settings.focalZone} onChange={e => setSettings({...settings, focalZone: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal" />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Near-Field TGC</label>
                    <span className="text-md font-black text-white italic">{settings.tgc}%</span>
                 </div>
                 <input type="range" min="0" max="100" value={settings.tgc} onChange={e => setSettings({...settings, tgc: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal" />
              </div>
           </div>

           <div className="space-y-6 pt-8 border-t border-white/5">
              <AnimatePresence mode="wait">
                 {feedback && (
                    <motion.div 
                      key={feedback}
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex items-start space-x-4 p-6 rounded-3xl ${isPassed ? 'bg-green-500/10 text-green-500 border border-green-500/30 shadow-glow-green' : 'bg-registry-amber/10 text-registry-amber border border-registry-amber/30'}`}
                    >
                       {isPassed ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                       <p className="text-[11px] font-bold uppercase leading-relaxed tracking-tight">{feedback}</p>
                    </motion.div>
                 )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                   onClick={checkOptimization}
                   className="flex-1 py-5 bg-registry-teal text-stealth-950 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.2em] shadow-glow-teal hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    Execute Signal Analysis
                 </button>
                 {isPassed && (
                    <button 
                      onClick={nextStage}
                      className="px-8 py-5 bg-white/10 border border-white/20 text-white rounded-2xl text-[11px] font-black uppercase hover:bg-white/20 transition-all flex items-center justify-center space-x-3"
                    >
                       <span>Proceed to Next Phase</span>
                       <ChevronRight className="w-4 h-4" />
                    </button>
                 )}
              </div>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Optimization Physics" 
        description="Every control on an ultrasound machine manipulates raw acoustic data. Gain amplifies the electrical signal from the crystals, but also increases background noise. TGC compensates for deep tissue attenuation. Focusing narrows the beam width, directly improving lateral resolution—your ability to distinguish side-by-side structures." 
      />
    </div>
  );
};
