import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Sliders, Activity, Info, Zap, AlertTriangle, Layers, Moon, Copy, Sun, Droplets, Thermometer, Sparkles, ShieldCheck, Book, Hexagon } from 'lucide-react';
import { VisualHeader, VisualInsight, VideoTutorialLink } from './BaseVisuals';


export const ArtifactHunter: React.FC = () => {
  const [currentArtifact, setCurrentArtifact] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [fixed, setFixed] = useState<Set<number>>(new Set());

  const artifacts = [
    {
      id: 0,
      name: 'Aliasing',
      clue: 'Spectral waveform is cutting off and wrapping around the baseline.',
      options: ['Increase PRF', 'Decrease PRF', 'Increase Gain', 'Decrease Transducer Freq'],
      correct: 'Increase PRF',
      pearl: 'Aliasing occurs when the Doppler shift exceeds the Nyquist limit (1/2 PRF). Raising the scale (PRF) or shifting the baseline can resolve it.'
    },
    {
      id: 1,
      name: 'Reverberation',
      clue: 'Multiple equally spaced horizontal lines are appearing in the near field.',
      options: ['Adjust TGC', 'Change Scan Angle', 'Increase Power', 'Reduce Harmonic Gain'],
      correct: 'Change Scan Angle',
      pearl: 'Reverb is caused by bouncy sound waves between strong reflectors. Changing the angle of incidence or using harmonics can break the cycle.'
    },
    {
      id: 2,
      name: 'Acoustic Shadow',
      clue: 'A dark area is hiding anatomy behind a bright gallstone.',
      options: ['Spatial Compounding', 'Increase Overall Gain', 'Focus at Depth', 'Switch to Sector'],
      correct: 'Spatial Compounding',
      pearl: 'Shadowing is highly diagnostic for stones (attenuation). If it interferes with hidden anatomy, Compound Imaging (SonoCT) can help see "around" the object.'
    },
    {
      id: 3,
      name: 'Anisotropic Effect',
      clue: 'The tendon appears dark when the probe is tilted slightly.',
      options: ['Check Normal Incidence', 'Increase Dynamic Range', 'Decrease Depth', 'Use Color Doppler'],
      correct: 'Check Normal Incidence',
      pearl: 'Tendon fibers must be scanned at 90 degrees. Even a 5-degree tilt can make a healthy tendon look like a tear (false hypoechogenicity).'
    }
  ];

  const handleOption = (option: string) => {
    if (option === artifacts[currentArtifact].correct) {
      setFeedback({ type: 'success', text: 'Diagnostic Correction Successful!' });
      setFixed(prev => new Set(prev).add(currentArtifact));
    } else {
      setFeedback({ type: 'error', text: 'Ineffective Adjustment. Artifact Persists.' });
    }
  };

  const next = () => {
    setCurrentArtifact((prev) => (prev + 1) % artifacts.length);
    setFeedback(null);
  };

  const current = artifacts[currentArtifact];
  const isResolved = fixed.has(currentArtifact);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Artifact Hunter" 
        subtitle="Diagnostic Correction Protocol" 
        icon={AlertTriangle} 
        color="text-amber-500"
        protocol="01-ATH"
      />

      <div className="flex justify-between items-center mb-8 relative z-10">
         <div className="px-6 py-2 bg-stealth-950 rounded-full border border-white/5 shadow-inner">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">{fixed.size} / {artifacts.length} Resolved</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="space-y-8">
           <div className="aspect-video bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative group/display shadow-2xl">
              <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                 <svg className="w-full h-full" viewBox="0 0 400 225">
                    {currentArtifact === 0 && (
                       <g opacity={isResolved ? 0.3 : 1}>
                          <line x1="50" y1="112" x2="350" y2="112" stroke="white" strokeWidth="1" opacity="0.3" />
                          <path 
                            d="M 50 112 Q 125 -30 200 112 Q 275 254 350 112" 
                            fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="10 5"
                          />
                       </g>
                    )}
                    {currentArtifact === 1 && (
                       <g>
                          <line x1="100" y1="40" x2="300" y2="40" stroke="white" strokeWidth="6" />
                          <line x1="100" y1="70" x2="300" y2="70" stroke="white" strokeWidth="6" />
                          {!isResolved && [1, 2, 3].map(i => (
                            <line key={i} x1="100" y1={70 + i * 30} x2="300" y2={70 + i * 30} stroke="white" strokeWidth={5-i} opacity={0.6 / (i+1)} />
                          ))}
                       </g>
                    )}
                    {currentArtifact === 2 && (
                       <g>
                          <circle cx="200" cy="80" r="30" fill="#475569" stroke="white" strokeWidth="3" />
                          {!isResolved && (
                            <rect x="170" y="80" width="60" height="150" fill="url(#shadowGrad2)" />
                          )}
                          <defs>
                             <linearGradient id="shadowGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="black" stopOpacity="0" />
                                <stop offset="100%" stopColor="black" stopOpacity="0.9" />
                             </linearGradient>
                          </defs>
                       </g>
                    )}
                    {currentArtifact === 3 && (
                       <g>
                          <path d="M 100 112 L 300 112" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
                          <motion.circle 
                            animate={{ opacity: isResolved ? 0 : [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            cx="200" cy="112" r="15" fill="#1e293b" 
                          />
                       </g>
                    )}
                 </svg>
              </div>

              <div className="absolute top-6 right-8 px-5 py-2 bg-stealth-900/80 rounded-full border border-white/10 backdrop-blur-xl flex items-center space-x-3">
                 <div className={`w-2 h-2 rounded-full ${isResolved ? 'bg-registry-teal shadow-glow' : 'bg-registry-rose animate-pulse'}`} />
                 <span className="text-[10px] font-black uppercase text-white tracking-[0.2em] italic">{isResolved ? 'Signal Corrected' : 'Artifact Active'}</span>
              </div>
           </div>

           <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 border-l-4 border-l-amber-500 shadow-2xl relative overflow-hidden group/brief">
              <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
              <div className="flex items-start space-x-4">
                 <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    <Target className="w-5 h-5 text-amber-500" />
                 </div>
                 <div>
                    <h5 className="text-[12px] font-black uppercase text-amber-500 italic mb-2 tracking-widest">Technical Briefing</h5>
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic uppercase">{current.clue}</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8 flex flex-col justify-center">
           <div className="space-y-4">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-[0.4em] italic mb-4 block">Select Counter-Measure</span>
              <div className="grid grid-cols-1 gap-4">
                 {current.options.map(opt => (
                    <button
                      key={opt}
                      disabled={isResolved}
                      onClick={() => handleOption(opt)}
                      className={`p-6 rounded-[2rem] border-2 text-[12px] font-black uppercase text-left transition-all duration-300 relative overflow-hidden group/opt ${
                        isResolved && opt === current.correct 
                          ? 'bg-registry-teal text-stealth-950 border-registry-teal shadow-glow' 
                          : 'bg-white/5 border-white/10 hover:border-registry-teal/40 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                       <span className="relative z-10">{opt}</span>
                       <div className="absolute inset-0 bg-gradient-to-r from-registry-teal/10 to-transparent opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                    </button>
                 ))}
              </div>
           </div>

           <AnimatePresence mode="wait">
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-8 rounded-[2.5rem] border-2 shadow-2xl ${feedback.type === 'success' ? 'bg-registry-teal/10 border-registry-teal/30' : 'bg-registry-rose/10 border-registry-rose/30'}`}
                >
                   <div className="flex items-start space-x-6">
                      <div className={`p-4 rounded-2xl ${feedback.type === 'success' ? 'bg-registry-teal/20 text-registry-teal' : 'bg-registry-rose/20 text-registry-rose'}`}>
                         {feedback.type === 'success' ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                      </div>
                      <div className="space-y-4 flex-1">
                         <p className={`text-xl font-black uppercase italic ${feedback.type === 'success' ? 'text-registry-teal' : 'text-registry-rose'}`}>{feedback.text}</p>
                         {feedback.type === 'success' && (
                           <div className="space-y-6">
                              <p className="text-[12px] font-bold text-slate-400 leading-relaxed italic uppercase">{current.pearl}</p>
                              <button 
                                onClick={next}
                                className="w-full py-4 bg-registry-teal text-stealth-950 rounded-full text-[12px] font-black uppercase shadow-glow hover:scale-[1.02] transition-transform"
                              >
                                Scan Next Region
                              </button>
                           </div>
                         )}
                      </div>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

      <VisualInsight 
        title="Artifact Recognition" 
        description="Clinical ultrasound artifacts are not errors; they are physics-based manifestations of how sound interacts with tissue. Recognizing and correcting them is key to diagnostic accuracy."
        keyTerms={['artifact', 'correction', 'diagnostic', 'aliasing', 'reverberation']}
      />
    </motion.div>
  );
};

export const DopplerModalitiesVisual: React.FC = () => {
  const [active, setActive] = useState<'color' | 'power' | 'spectral'>('color');
  const [velocity, setVelocity] = useState(50); // cm/s
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.05), 30);
    return () => clearInterval(interval);
  }, [velocity]);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Doppler Lab" 
        subtitle="Hemodynamic Performance Matrix" 
        icon={Activity} 
        protocol="02-DOP"
      />

      <div className="flex justify-center mb-10 relative z-10">
        <div className="flex flex-wrap gap-2 p-1.5 bg-stealth-950/80 rounded-[2.5rem] border border-white/10 shadow-inner">
          {(['color', 'power', 'spectral'] as const).map(m => (
            <button 
              key={m} 
              onClick={() => setActive(m)} 
              className={`px-8 py-3 text-[11px] font-black uppercase tracking-[0.4em] italic rounded-full transition-all duration-500 ${active === m ? 'bg-registry-teal text-stealth-950 shadow-glow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] relative overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-2xl group/display">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {active === 'color' && (
            <motion.div 
              key="color"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 flex items-center justify-center"
            >
               <div className="w-[300px] h-[150px] border-2 border-white/5 relative rounded-[2rem] overflow-hidden bg-white/5 shadow-inner">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ 
                          x: [Math.random() * 300, 300],
                          opacity: [0, 0.8, 0]
                        }}
                        transition={{ 
                          duration: 1.5 - (velocity / 100), 
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                        className={`absolute w-3 h-3 rounded-full blur-[4px] ${velocity > 80 ? 'bg-amber-400' : 'bg-red-500 shadow-glow-rose'}`}
                      />
                    ))}
                  </div>
                  <div className="absolute top-4 left-6 text-[10px] font-black uppercase text-red-500 tracking-[0.4em] italic">Flow Vector: Antegrade</div>
               </div>
            </motion.div>
          )}

          {active === 'power' && (
            <motion.div 
              key="power"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="absolute w-[200px] h-[100px] bg-amber-500/10 rounded-full blur-[80px] animate-pulse" />
              <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.circle 
                    key={i}
                    cx={50 + Math.random() * 300}
                    cy={50 + Math.random() * 100}
                    r={Math.random() * 6}
                    fill="#f59e0b"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.1, 0.4, 0.1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                  />
                ))}
                <text x="200" y="180" textAnchor="middle" fill="#f59e0b" className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40 italic">Amplitude Distribution Matrix</text>
              </svg>
            </motion.div>
          )}

          {active === 'spectral' && (
            <motion.div 
              key="spectral"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-12"
            >
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="traceGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <motion.path 
                  d={`M 0 140 ${Array.from({ length: 61 }).map((_, i) => {
                    const x = (i / 60) * 400;
                    const peak = Math.sin(time * 3 + i * 0.1) * 30 + 50;
                    const noise = Math.random() * 5;
                    return `L ${x} ${130 - (peak + noise)}`;
                  }).join(' ')} L 400 140 Z`}
                  fill="url(#traceGrad)"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  className="drop-shadow-glow"
                />
                <line x1="0" y1="130" x2="400" y2="130" stroke="white" strokeWidth="1" opacity="0.2" strokeDasharray="4 2" />
                <text x="10" y="20" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest italic shadow-glow-sm">Peak Velocity: 120 cm/s</text>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-8 relative z-10 p-6 bg-stealth-950/60 rounded-[2.5rem] border border-white/5">
        <div className="flex justify-between items-end">
           <div className="flex items-center space-x-3">
              <Sliders className="w-5 h-5 text-registry-teal" />
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest italic">Velocity Scale / PRF Tuning</span>
           </div>
           <span className="text-3xl font-black italic text-registry-teal drop-shadow-glow tabular-nums leading-none">{velocity} <span className="text-[12px]">cm/s</span></span>
        </div>
        <input 
          type="range" min="10" max="200" step="5" 
          value={velocity} 
          onChange={(e) => setVelocity(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner"
        />
      </div>

      <VisualInsight 
        title={`${active.charAt(0).toUpperCase() + active.slice(1)} Doppler Architecture`} 
        description={active === 'color' ? "Color Flow uses pulsed Doppler to estimate mean velocities across a region, overlaying colors (BART) to show direction." : active === 'power' ? "Energy Doppler (Power) ignores direction and velocity, mapping only the intensity (amplitude) of the shift." : "Spectral Doppler provides the full velocity profile over time, offering clinical insight into peak systolic and end-diastolic shifts."} 
        keyTerms={['velocity', 'hemodynamics', 'spectral', 'modality', 'shift']}
      />
    </motion.div>
  );
};

export const DisplayModesVisual: React.FC = () => {
  const [mode, setMode] = useState<'A' | 'B' | 'M'>('B');
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.05), 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Diagnostic Modes" 
        subtitle="Signal Display Engine" 
        icon={Layers} 
        protocol="03-MOD"
      />

      <div className="flex justify-center mb-10 relative z-10">
        <div className="flex gap-2 p-1.5 bg-stealth-950/80 rounded-[2.5rem] border border-white/5 shadow-inner">
          {(['A', 'B', 'M'] as const).map(m => (
            <button 
              key={m} 
              onClick={() => setMode(m)} 
              className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic transition-all duration-500 ${mode === m ? 'bg-registry-teal text-stealth-950 shadow-glow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {m}-Mode
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] overflow-hidden p-8 border-2 border-slate-800 flex items-center justify-center relative shadow-inner group/display">
        <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 opacity-10 pointer-events-none">
           {Array.from({ length: 60 }).map((_, i) => (
             <div key={i} className="border-[0.5px] border-registry-teal/20" />
           ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === 'A' && (
            <motion.div 
              key="A" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <svg className="w-full h-full relative z-10" viewBox="0 0 400 150" preserveAspectRatio="none">
                <path 
                  d={`M 0 130 ${Array.from({ length: 41 }).map((_, i) => {
                    const x = (i / 40) * 400;
                    const isEcho = i === 10 || i === 25 || i === 35;
                    const h = isEcho ? 80 + Math.random() * 20 : 5 + Math.random() * 5;
                    return `L ${x} ${130 - h}`;
                  }).join(' ')}`} 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="3" 
                  className="drop-shadow-glow"
                />
                <text x="5" y="15" fill="#22d3ee" className="text-[10px] font-black italic tracking-widest uppercase opacity-60">Amplitude Sweep Active</text>
              </svg>
            </motion.div>
          )}
          {mode === 'B' && (
            <motion.div 
              key="B" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
              className="w-full h-full relative z-10"
            >
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[180px] h-[180px] bg-registry-teal/5 rounded-full border border-white/5 relative overflow-hidden shadow-inner">
                     <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                       className="absolute inset-0 bg-gradient-to-r from-registry-teal/20 to-transparent origin-center"
                     />
                     {Array.from({ length: 24 }).map((_, i) => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0 }}
                         animate={{ opacity: [0, 0.8, 0.4] }}
                         className="absolute w-2 h-2 bg-white rounded-full blur-[1px] shadow-[0_0_8px_white]"
                         style={{ 
                            top: `${20 + Math.random() * 60}%`, 
                            left: `${20 + Math.random() * 60}%`,
                            opacity: Math.random() * 0.5 + 0.1
                         }}
                       />
                     ))}
                  </div>
               </div>
               <div className="absolute bottom-4 left-6 text-[10px] font-black italic text-registry-teal uppercase tracking-widest opacity-60">2D Brightness Domain</div>
            </motion.div>
          )}
          {mode === 'M' && (
            <motion.div 
              key="M" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <svg className="w-full h-full relative z-10" viewBox="0 0 400 150" preserveAspectRatio="none">
                <motion.path 
                  d={`M 0 75 ${Array.from({ length: 101 }).map((_, i) => {
                    const x = (i / 100) * 400;
                    const y = 75 + Math.sin(time * 5 + i * 0.2) * 30;
                    return `L ${x} ${y}`;
                  }).join(' ')}`} 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="3" 
                  className="drop-shadow-glow"
                />
                <text x="5" y="15" fill="#22d3ee" className="text-[10px] font-black italic tracking-widest uppercase opacity-60">Motion Trace Protocol</text>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
         <div className="p-6 bg-stealth-950 rounded-[2rem] border border-white/5 group transition-all hover:border-registry-teal/40 shadow-xl">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] block mb-2 italic ${mode === 'A' ? 'text-registry-teal shadow-glow-teal' : 'text-slate-600'}`}>Depth Delta</span>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase italic">Precise linear distance measurement via amplitude spikes.</p>
         </div>
         <div className="p-6 bg-stealth-950 rounded-[2rem] border border-white/5 group transition-all hover:border-registry-teal/40 shadow-xl">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] block mb-2 italic ${mode === 'B' ? 'text-registry-teal shadow-glow-teal' : 'text-slate-600'}`}>Spatial Matrix</span>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase italic">Anatomic visualization via complex brightness mapping.</p>
         </div>
         <div className="p-6 bg-stealth-950 rounded-[2rem] border border-white/5 group transition-all hover:border-registry-teal/40 shadow-xl">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] block mb-2 italic ${mode === 'M' ? 'text-registry-teal shadow-glow-teal' : 'text-slate-600'}`}>Temporal Flux</span>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase italic">High-speed sampling for dynamic organ motion analysis.</p>
         </div>
      </div>

      <VisualInsight 
        title={`${mode}-Mode Architecture`} 
        description={mode === 'A' ? "Amplitude Mode is simplest, used for precise distance measurements." : mode === 'B' ? "Brightness Mode converts echo amplitudes into pixel brightness values on a gray scale." : "Motion Mode provide an organ's motion history along a single scan line with high temporal resolution."} 
        keyTerms={['amplitude', 'brightness', 'motion', 'temporal', 'resolution']}
      />
    </motion.div>
  );
};

export const SafetyIndicesVisual: React.FC = () => {
  const [index, setIndex] = useState(0.5);
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Safety Indices" 
        subtitle="Bioeffects Compliance Matrix" 
        icon={ShieldCheck} 
        protocol="04-SFE"
      />

      <div className="space-y-8 relative z-10">
        <div className="w-full h-6 bg-stealth-950 rounded-full overflow-hidden border-2 border-slate-800 shadow-inner p-1">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${(index/2.5) * 100}%` }}
             className={`h-full rounded-full transition-all duration-1000 ${index > 1.5 ? 'bg-registry-rose shadow-glow-rose' : index > 0.7 ? 'bg-amber-500 shadow-glow-amber' : 'bg-registry-teal shadow-glow'}`} 
           />
        </div>

        <div className="p-10 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl group/display">
           <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
           <h4 className={`text-6xl md:text-8xl font-black italic tracking-tighter tabular-nums leading-none mb-4 transition-colors duration-500 ${index > 1.5 ? 'text-registry-rose drop-shadow-glow-rose' : index > 0.7 ? 'text-amber-500 drop-shadow-glow-amber' : 'text-registry-teal drop-shadow-glow'}`}>{index.toFixed(1)}</h4>
           <div className={`px-6 py-2 rounded-full border-2 text-[11px] font-black uppercase tracking-[0.4em] italic ${index > 1.5 ? 'bg-registry-rose/10 border-registry-rose/30 text-registry-rose shadow-glow-rose' : index > 0.7 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-glow-amber' : 'bg-registry-teal/10 border-registry-teal/30 text-registry-teal shadow-glow'}`}>
             {index > 1.5 ? 'Critical Threshold' : index > 0.7 ? 'ALARA Alert' : 'Nominal State'}
           </div>
        </div>

        <div className="space-y-6">
           <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-3">
                 <Sliders className="w-4 h-4 text-slate-500" />
                 <span className="text-[11px] font-black uppercase text-slate-500 tracking-[0.4em] italic">Bio-Index Sweep</span>
              </div>
              <span className="text-xl font-black text-white italic tabular-nums">{index.toFixed(1)} <span className="text-[11px]">Units</span></span>
           </div>
           <input 
             type="range" min="0.1" max="2.5" step="0.1" 
             value={index} 
             onChange={e => setIndex(Number(e.target.value))} 
             className={`w-full h-2 rounded-lg appearance-none cursor-pointer shadow-inner transition-colors ${index > 1.5 ? 'accent-registry-rose' : index > 0.7 ? 'accent-amber-500' : 'accent-registry-teal'} bg-slate-800`} 
           />
        </div>
      </div>

      <VisualInsight 
        title="Predictive Indices" 
        description="The Thermal Index (TI) and Mechanical Index (MI) are derived parameters that estimate risk. Always follow the ALARA (As Low As Reasonably Achievable) principle to minimize patient exposure." 
        keyTerms={['thermal', 'mechanical', 'ALARA', 'cavitation', 'heating']}
      />
    </motion.div>
  );
};

export const ArtifactsVisual: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(0);
  const artifacts = [
    { 
      name: 'Shadowing', 
      icon: AlertTriangle, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      description: 'Behind strong attenuators (stones). Diagnostic of calcification.',
      physics: 'Sound is absorbed or reflected so heavily that nothing remains to image deeper tissues.'
    },
    { 
      name: 'Enhancement', 
      icon: Sun, 
      color: 'text-registry-teal', 
      bg: 'bg-registry-teal/10',
      description: 'Behind low attenuators (cysts). Diagnostic of fluid.',
      physics: 'Sound travels through fluid with minimal loss, arriving at deeper tissues with higher-than-expected intensity.'
    },
    { 
      name: 'Mirror Image', 
      icon: Copy, 
      color: 'text-slate-400', 
      bg: 'bg-slate-400/10',
      description: 'False copy across a strong specular reflector (Diaphragm).',
      physics: 'Sound hits a strong reflector, bounces to an object, then back to the reflector before returning. Machine assumes straight line.'
    },
    { 
      name: 'Reverberation', 
      icon: Layers, 
      color: 'text-amber-600', 
      bg: 'bg-amber-600/10',
      description: 'Equally spaced horizontal echoes in near field.',
      physics: 'Sound "bounces" between two strong parallel reflectors. Each trip takes longer, placing the echo progressively deeper.'
    },
    { 
      name: 'Ring-Down', 
      icon: Zap, 
      color: 'text-registry-rose', 
      bg: 'bg-registry-rose/10',
      description: 'Solid vertical line behind gas/bubbles.',
      physics: 'Sound vibrates small pockets of gas (resonance), creating a continuous stream of return signals.'
    }
  ];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
       <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
       
       <VisualHeader 
         title="Artifact Catalog" 
         subtitle="Physics Interaction Library" 
         icon={Book} 
         protocol="05-ART"
       />

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 relative z-10">
          {artifacts.map((art, i) => (
            <motion.button
              key={art.name}
              onClick={() => setSelected(i)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-[2.5rem] border-2 text-left transition-all duration-500 relative overflow-hidden group/art ${selected === i ? 'bg-stealth-950 border-registry-teal shadow-glow' : 'bg-stealth-900/60 border-white/5 hover:border-white/10'}`}
            >
               <div className="flex items-center space-x-4 relative z-10">
                  <div className={`p-3 rounded-2xl ${art.bg} border border-${art.color.split('-')[1]}-500/20`}>
                     <art.icon className={`w-6 h-6 ${art.color}`} />
                  </div>
                  <span className={`text-[12px] font-black uppercase italic tracking-widest ${selected === i ? 'text-white' : 'text-slate-500'}`}>{art.name}</span>
               </div>
               {selected === i && (
                 <motion.div layoutId="activeArt" className="absolute inset-0 bg-gradient-to-br from-registry-teal/5 to-transparent pointer-events-none" />
               )}
            </motion.button>
          ))}
       </div>

       <AnimatePresence mode="wait">
          {selected !== null && (
            <motion.div 
              key={selected}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 p-10 bg-stealth-950/80 rounded-[3rem] border-2 border-slate-800 shadow-2xl"
            >
               <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                     <div className={`w-2 h-2 rounded-full ${artifacts[selected].color.replace('text-', 'bg-')} shadow-glow`} />
                     <h5 className="text-xl font-black italic uppercase text-white tracking-widest leading-none">{artifacts[selected].name}</h5>
                  </div>
                  <p className="text-[14px] font-bold text-registry-teal leading-relaxed italic uppercase">{artifacts[selected].description}</p>
                  <p className="text-[12px] font-medium text-slate-400 leading-relaxed italic uppercase">{artifacts[selected].physics}</p>
               </div>
               
               <div className="aspect-video bg-black rounded-[2.5rem] border-2 border-slate-800 relative overflow-hidden shadow-inner group/display">
                  <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     {selected === 0 && (
                       <svg width="100%" height="100%" viewBox="0 0 200 120">
                          <rect x="70" y="30" width="60" height="20" rx="4" fill="#64748b" stroke="white" strokeWidth="2" />
                          <rect x="70" y="50" width="60" height="70" fill="url(#shadowGrad)" opacity="0.6" />
                          <defs>
                             <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="black" stopOpacity="0" />
                                <stop offset="100%" stopColor="black" stopOpacity="0.8" />
                             </linearGradient>
                          </defs>
                       </svg>
                     )}
                     {selected === 1 && (
                       <svg width="100%" height="100%" viewBox="0 0 200 120">
                          <circle cx="100" cy="40" r="20" fill="transparent" stroke="white" strokeWidth="2" />
                          <rect x="80" y="60" width="40" height="60" fill="url(#brightGrad)" opacity="0.6" />
                          <defs>
                             <linearGradient id="brightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
                             </linearGradient>
                          </defs>
                       </svg>
                     )}
                     {selected === 4 && (
                       <svg width="100%" height="100%" viewBox="0 0 200 120">
                          <circle cx="100" cy="30" r="10" fill="transparent" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />
                          <motion.line 
                            initial={{ strokeDashoffset: 0 }}
                            animate={{ strokeDashoffset: -50 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            x1="100" y1="40" x2="100" y2="120" stroke="#f43f5e" strokeWidth="4" strokeDasharray="5 5" 
                          />
                       </svg>
                     )}
                  </div>
               </div>
            </motion.div>
          )}
       </AnimatePresence>

       <VisualInsight 
         title="Diagnostic Potential of Artifacts" 
         description="Artifacts like shadowing and enhancement are called 'diagnostic artifacts' because they provide direct clues about tissue composition (e.g., solid stone vs fluid cyst). Others, like aliasing, must be corrected to maintain measurement validity." 
         keyTerms={['diagnostic', 'shadowing', 'enhancement', 'reverberation', 'aliasing']}
       />
    </motion.div>
  );
};

export const HemodynamicsPrinciplesVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Hemodynamics Lab" 
        subtitle="Fluid Dynamics Processor" 
        icon={Droplets} 
        protocol="06-HEM"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
         <div className="space-y-8">
            <div className="p-10 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 shadow-2xl relative overflow-hidden group/vessel">
               <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
               <div className="flex justify-between items-center mb-10">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-[0.4em] italic">Vessel Geometry</span>
                  <div className="px-5 py-2 bg-registry-rose/10 rounded-full border border-registry-rose/30">
                     <span className="text-[10px] font-black uppercase text-registry-rose italic tracking-widest">Turbulent Flow</span>
                  </div>
               </div>
               
               <div className="h-32 flex items-center justify-center relative">
                  <div className="absolute inset-x-0 h-16 bg-registry-rose/5 border-y border-white/5" />
                  <div className="absolute inset-0 flex items-center justify-around px-8">
                     {[1, 2.5, 5, 2.5, 1].map((speed, i) => (
                       <motion.div 
                         key={i}
                         animate={{ x: [-20, 300] }}
                         transition={{ 
                           duration: 3 / speed, 
                           repeat: Infinity, 
                           ease: "linear",
                           delay: i * 0.2
                         }}
                         className="h-1 bg-registry-rose shadow-glow-rose rounded-full shrink-0"
                         style={{ width: '40px' }}
                       />
                     ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-24 h-16 bg-stealth-950/80 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center">
                        <span className="text-[12px] font-black text-white italic uppercase tracking-widest">Stenosis Zone</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
                  <h6 className="text-[10px] font-black uppercase text-registry-teal italic mb-2 tracking-widest leading-none">Bernoulli Equation</h6>
                  <p className="text-[11px] font-bold text-slate-400 italic uppercase">ΔP = V² × 4</p>
                  <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                     <motion.div animate={{ width: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-full bg-registry-teal shadow-glow" />
                  </div>
               </div>
               <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
                  <h6 className="text-[10px] font-black uppercase text-amber-500 italic mb-2 tracking-widest leading-none">Continuity Rule</h6>
                  <p className="text-[11px] font-bold text-slate-400 italic uppercase">Q = V × Area</p>
                  <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                     <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-amber-500 shadow-glow-amber" />
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8 flex flex-col justify-center">
            <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 border-l-4 border-l-registry-rose shadow-2xl">
               <h5 className="text-[12px] font-black uppercase text-registry-rose italic mb-4 tracking-widest">Hemodynamic Invariants</h5>
               <ul className="space-y-4">
                  {[
                    'Pressure decreases as velocity increases at a stenosis.',
                    'Flow remains constant despite diameter changes.',
                    'Stenosis profiles show spectral broadening.',
                    'Distal flow often exhibits post-stenotic turbulence.'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                       <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-registry-rose shadow-glow-rose shrink-0" />
                       <span className="text-[11px] font-bold text-slate-400 leading-relaxed italic uppercase">{item}</span>
                    </li>
                  ))}
               </ul>
            </div>
            
            <button className="w-full py-5 bg-stealth-950 border border-white/10 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] italic text-slate-400 hover:text-white hover:border-registry-teal/40 transition-all duration-500 shadow-xl relative overflow-hidden group/btn">
               <div className="absolute inset-0 bg-gradient-to-r from-registry-teal/5 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
               Extract Flow Metrics
            </button>
         </div>
      </div>

      <VisualInsight 
        title="Fluid Dynamics Foundations" 
        description="The movement of blood is governed by pressure gradients. Hemodynamics explains how energy is converted between potential (pressure) and kinetic (velocity) forms during vessel narrowing." 
        keyTerms={['bernoulli', 'continuity', 'laminar', 'turbulent', 'stenosis']}
      />
    </motion.div>
  );
};

export const BioeffectsVisual: React.FC = () => {
  const [ti, setTi] = useState(0.5); // Thermal Index
  const [mi, setMi] = useState(0.5); // Mechanical Index
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Safety Command" 
        subtitle="Bioeffects Compliance Matrix" 
        icon={Thermometer} 
        color="text-registry-rose"
        protocol="07-BIO"
      />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className={`flex items-center space-x-3 px-6 py-2 bg-registry-rose/10 border border-registry-rose/30 rounded-full transition-all duration-500 ${ti > 1.5 || mi > 1.0 ? 'shadow-glow-rose scale-110' : 'opacity-50'}`}>
          <AlertTriangle className={`w-4 h-4 ${ti > 1.5 || mi > 1.0 ? 'text-registry-rose animate-pulse' : 'text-slate-400'}`} />
          <span className="text-[10px] font-black uppercase text-registry-rose tracking-[0.2em] italic">ALARA COMPLIANCE ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        {/* Thermal Index Area */}
        <div className="space-y-8">
           <div className="flex justify-between items-end">
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-1 italic">Thermal Index (TI)</p>
                 <h5 className="text-sm font-black text-white italic uppercase tracking-widest">Tissue Heating</h5>
              </div>
              <span className={`text-4xl font-black italic tracking-tighter tabular-nums ${ti > 1.5 ? 'text-registry-rose drop-shadow-glow-rose' : 'text-white'}`}>{ti.toFixed(1)}</span>
           </div>
           
           <div className="h-48 bg-stealth-950 rounded-[3rem] relative overflow-hidden border-2 border-slate-800 shadow-inner flex flex-col justify-end p-2 group/ti">
              <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden">
                 {Array.from({ length: 6 }).map((_, i) => (
                   <motion.div 
                     key={i}
                     animate={{ y: [0, -150], opacity: [0, 0.4 * ti, 0], scale: [1, 1.2] }}
                     transition={{ duration: 3 / ti, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                     className="absolute bottom-0 left-0 right-0 h-4 bg-registry-rose/30 blur-2xl"
                     style={{ bottom: `${i * 20}%` }}
                   />
                 ))}
              </div>
              <motion.div 
                animate={{ height: `${(ti / 2.5) * 100}%` }}
                className={`w-full rounded-t-[2rem] relative z-10 transition-all duration-700 ${ti > 1.5 ? 'bg-registry-rose shadow-glow-rose' : 'bg-orange-500 shadow-glow-amber'}`}
              >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic opacity-60">Heat Zone</span>
                 </div>
              </motion.div>
           </div>

           <input 
             type="range" min="0.1" max="2.5" step="0.1" 
             value={ti} 
             onChange={(e) => setTi(parseFloat(e.target.value))}
             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose shadow-inner"
           />
        </div>

        {/* Mechanical Index Area */}
        <div className="space-y-8">
           <div className="flex justify-between items-end">
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-1 italic">Mechanical Index (MI)</p>
                 <h5 className="text-sm font-black text-white italic uppercase tracking-widest">Cavitation Risk</h5>
              </div>
              <span className={`text-4xl font-black italic tracking-tighter tabular-nums ${mi > 1.0 ? 'text-registry-rose drop-shadow-glow-rose' : 'text-white'}`}>{mi.toFixed(1)}</span>
           </div>

           <div className="h-48 bg-stealth-950 rounded-[3rem] relative overflow-hidden border-2 border-slate-800 shadow-inner flex items-center justify-center p-8 group/mi">
              <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
              <div className="absolute inset-0 z-0">
                 {Array.from({ length: Math.floor(mi * 15) }).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 2.5, 0], opacity: [0, 0.8, 0], x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 }}
                      transition={{ duration: 1 / mi, repeat: Infinity, delay: Math.random() * 2 }}
                      className={`w-4 h-4 rounded-full border-2 border-white/20 absolute ${mi > 1.2 ? 'bg-registry-rose/20' : 'bg-registry-teal/20'}`}
                    />
                 ))}
              </div>

              <motion.div 
                animate={{ scale: [1, 1 + mi * 0.4, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.2 / mi, repeat: Infinity }}
                className={`w-24 h-24 rounded-full border-4 ${mi > 1.0 ? 'border-registry-rose shadow-glow-rose' : 'border-registry-teal shadow-glow'} flex items-center justify-center relative z-10 backdrop-blur-xl`}
              >
                 <div className={`w-12 h-12 rounded-full blur-2xl ${mi > 1.0 ? 'bg-registry-rose' : 'bg-registry-teal'}`} />
                 <Activity className={`w-6 h-6 absolute ${mi > 1.0 ? 'text-white' : 'text-slate-400'}`} />
              </motion.div>
           </div>

           <input 
             type="range" min="0.1" max="1.9" step="0.1" 
             value={mi} 
             onChange={(e) => setMi(parseFloat(e.target.value))}
             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose shadow-inner"
           />
        </div>
      </div>

      <div className="mt-12 p-8 bg-stealth-950/80 rounded-[2.5rem] border border-white/5 relative z-10 shadow-2xl">
        <div className="flex items-start space-x-6">
           <div className="p-3 bg-registry-rose/10 rounded-2xl border border-registry-rose/20">
              <ShieldCheck className="w-6 h-6 text-registry-rose" />
           </div>
           <div>
              <h5 className="text-[12px] font-black uppercase text-white mb-3 italic tracking-widest leading-none">Biological Safety Protocol</h5>
              <p className="text-[11px] leading-relaxed text-slate-400 font-bold italic uppercase">
                The <span className="text-registry-rose shadow-glow-rose">MI</span> is critical during contrast studies (microbubble risk). The <span className="text-orange-500 shadow-glow-amber">TI</span> is critical in fetal bone and brain imaging. Adherence to ALARA is mandatory for all acoustic output adjustments.
              </p>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Predictive Bioeffects Theory" 
        description="TI and MI provide real-time risk assessment. TI models maximum temperature rise; MI models peak rarefaction pressure and cavitation likelihood." 
        keyTerms={['bioeffects', 'TI', 'MI', 'cavitation', 'ALARA']}
      />
    </motion.div>
  );
};

export const SpeckleVisual: React.FC = () => {
  const [reduction, setReduction] = useState(0); 
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Speckle Lab" 
        subtitle="Interference Management Protocol" 
        icon={Sparkles} 
        protocol="08-SPK"
      />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="px-6 py-2 bg-stealth-950/80 rounded-full border border-white/10 shadow-inner flex items-center space-x-6">
           <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] italic">Reduction: {reduction}%</span>
           <input 
             type="range" min="0" max="100" step="10" 
             value={reduction} 
             onChange={(e) => setReduction(parseInt(e.target.value))}
             className="w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
           />
        </div>
      </div>

      <div className="h-64 bg-stealth-950 rounded-[3rem] relative overflow-hidden border-2 border-slate-800 flex items-center justify-center group/display shadow-2xl">
        <div className="absolute inset-0 opacity-40">
           <svg width="100%" height="100%">
             <filter id="speckleFilter">
               <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
               <feColorMatrix type="saturate" values="0" />
             </filter>
             <rect width="100%" height="100%" filter="url(#speckleFilter)" />
           </svg>
        </div>
        
        <motion.div 
          animate={{ opacity: reduction / 100 }}
          className="absolute inset-0 bg-stealth-950/70 backdrop-blur-[2px]"
        />

        <div className="relative z-10 w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center bg-black/20 overflow-hidden">
           <div className={`w-16 h-16 rounded-full bg-white/5 border border-white/10 shadow-[0_0_20px_white/5] ${reduction > 50 ? 'opacity-100' : 'opacity-30'} transition-opacity duration-1000`} />
           <div className="absolute inset-0 scanline opacity-30" />
           <p className="absolute bottom-4 text-[9px] font-black uppercase text-white/40 tracking-widest italic">Target Matrix</p>
        </div>
      </div>

      <VisualInsight 
        title="Acoustic Speckle" 
        description="Speckle is the granular appearance caused by constructive and destructive interference of side lobes. Speckle reduction algorithms (like SRI) improve contrast resolution by smoothing non-anatomic noise." 
        keyTerms={['speckle', 'interference', 'noise', 'smoothing', 'resolution']}
      />
    </motion.div>
  );
};

export const ContrastResolutionVisual: React.FC = () => {
  const [bitDepth, setBitDepth] = useState(3); 
  const grayShades = Math.pow(2, bitDepth);
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Contrast Lab" 
        subtitle="Greyscale Dynamic Resolution" 
        icon={Moon} 
        color="text-amber-500"
        protocol="09-CON"
      />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="px-6 py-2 bg-stealth-950/80 rounded-full border border-white/10 shadow-inner flex items-center space-x-6">
           <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] italic">{bitDepth} Bits ({grayShades} Shades)</span>
           <input 
             type="range" min="1" max="8" step="1" 
             value={bitDepth} 
             onChange={(e) => setBitDepth(parseInt(e.target.value))}
             className="w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
           />
        </div>
      </div>

      <div className="h-64 bg-stealth-950 rounded-[3rem] relative overflow-hidden border-2 border-slate-800 grid grid-cols-8 gap-1 p-4 shadow-2xl group/display">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        {Array.from({ length: 64 }).map((_, i) => {
          const normalized = i / 63;
          const shadeIndex = Math.floor(normalized * grayShades);
          const shadeValue = (shadeIndex / (grayShades - 1)) * 255;
          return (
            <motion.div 
              key={i}
              animate={{ backgroundColor: `rgb(${shadeValue}, ${shadeValue}, ${shadeValue})` }}
              className="w-full h-full rounded-md border border-white/5"
            />
          );
        })}
      </div>

      <VisualInsight 
        title="Contrast Dynamic Range" 
        description="Contrast resolution is the ability to distinguish between adjacent tissues of similar echogenicity. It is directly limited by the bit depth of the scan converter; more bits per pixel allow for a wider shades-of-grey palette." 
        keyTerms={['contrast', 'grayscale', 'bit-depth', 'resolution', 'dynamic-range']}
      />
    </motion.div>
  );
};

export const HarmonicImagingVisual: React.FC = () => {
  const [showHarmonic, setShowHarmonic] = useState(false);
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Harmonic Engine" 
        subtitle="Non-Linear Acoustic Filter" 
        icon={Zap} 
        protocol="10-HRM"
      />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <button 
          onClick={() => setShowHarmonic(!showHarmonic)}
          className={`px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.5em] italic transition-all duration-500 shadow-xl ${showHarmonic ? 'bg-registry-teal text-white shadow-glow' : 'bg-stealth-950 text-slate-500 border border-white/5'}`}
        >
          {showHarmonic ? 'Harmonic Lock ON' : 'Fundamental Sweep'}
        </button>
      </div>

      <div className="h-64 bg-stealth-950 rounded-[3rem] relative overflow-hidden border-2 border-slate-800 flex items-center justify-center shadow-2xl group/display">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <div className={`transition-all duration-1000 ${showHarmonic ? 'blur-0 opacity-100 scale-110' : 'blur-md opacity-40 scale-100'}`}>
           <div className="w-32 h-32 rounded-full border-4 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
              <div className="absolute inset-0 neural-grid opacity-30" />
           </div>
        </div>
        
        <div className="absolute bottom-8 left-8 flex space-x-8">
           <div className="flex flex-col items-center">
              <div className={`w-12 h-1.5 bg-registry-teal rounded-full mb-2 transition-all duration-500 ${showHarmonic ? 'opacity-20 translate-y-1' : 'opacity-100 shadow-glow'}`} />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Fundamental</span>
           </div>
           <div className="flex flex-col items-center">
              <div className={`w-12 h-1.5 bg-amber-500 rounded-full mb-2 transition-all duration-500 ${showHarmonic ? 'opacity-100 shadow-glow-amber' : 'opacity-20 translate-y-1'}`} />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Harmonic</span>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Tissue Harmonic Imaging (THI)" 
        description="THI uses non-linear sound propagation to create images from second-harmonic frequencies. This results in significant reduction in clutter, improved lateral resolution, and better border visualization." 
        keyTerms={['harmonic', 'non-linear', 'fundamental', 'clutter', 'resolution']}
      />
    </motion.div>
  );
};

export const ElastographyVisual: React.FC = () => {
  const [isStiff, setIsStiff] = useState(false);
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Stiffness Matrix" 
        subtitle="Strain Elastography Analysis" 
        icon={Hexagon} 
        protocol="11-ELA"
      />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <button 
          onClick={() => setIsStiff(!isStiff)}
          className={`px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic transition-all duration-500 shadow-xl ${isStiff ? 'bg-registry-rose text-white shadow-glow-rose' : 'bg-registry-teal text-white shadow-glow'}`}
        >
          {isStiff ? 'Malignant Signature' : 'Benign Architecture'}
        </button>
      </div>

      <div className="h-64 bg-stealth-950 rounded-[3rem] relative overflow-hidden border-2 border-slate-800 flex items-center justify-center shadow-2xl group/display">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <motion.div 
          animate={{ scale: isStiff ? 0.8 : 1.2, opacity: isStiff ? 0.6 : 0.4 }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={`w-48 h-48 rounded-full blur-[40px] ${isStiff ? 'bg-registry-rose' : 'bg-registry-teal'}`}
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="grid grid-cols-8 gap-2 opacity-30">
            {Array.from({ length: 64 }).map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  y: isStiff ? [0, 2, 0] : [0, 15, 0],
                  opacity: isStiff ? 0.9 : 0.2
                }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.015 }}
                className={`w-2.5 h-2.5 rounded-full ${isStiff ? 'bg-registry-rose shadow-glow-rose' : 'bg-registry-teal shadow-glow'}`}
              />
            ))}
          </div>
        </div>
        <div className="absolute top-8 right-8 flex flex-col items-end">
           <span className={`text-[10px] font-black uppercase tracking-widest italic ${isStiff ? 'text-registry-rose' : 'text-registry-teal'}`}>Deformation Index</span>
           <span className="text-xl font-black text-white italic tabular-nums">{isStiff ? 'Low' : 'High'}</span>
        </div>
      </div>

      <VisualInsight 
        title="Tissue Stiffness Logic" 
        description="Elastography identifies pathology based on mechanical properties. Malignant tumors are generally stiffer and deform less under compression or shear wave stress compared to normal tissue." 
        keyTerms={['stiffness', 'strain', 'shear-wave', 'malignancy', 'deformation']}
      />
    </motion.div>
  );
};



export const StenosisHemodynamicsExplainer: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Stenotic Logic" 
        subtitle="Pressure-Velocity Divergence" 
        icon={Activity} 
        color="text-registry-rose"
        protocol="13-STN"
      />

      <div className="h-64 bg-stealth-950 rounded-[3rem] relative overflow-hidden border-2 border-slate-800 flex items-center justify-center shadow-2xl group/display">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <svg className="w-full h-full relative z-10 px-12" viewBox="0 0 400 150">
           <path d="M 0 40 Q 200 65 400 40 L 400 110 Q 200 85 0 110 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
           <motion.path 
             animate={{ strokeDashoffset: [0, -80] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             d="M 50 75 L 150 75 Q 200 75 250 75 L 350 75" 
             stroke="#f43f5e" strokeWidth="6" strokeDasharray="15 10" 
             className="drop-shadow-glow-rose"
           />
           <rect x="180" y="45" width="40" height="20" fill="#f43f5e" opacity="0.4" rx="6" />
           <rect x="180" y="85" width="40" height="20" fill="#f43f5e" opacity="0.4" rx="6" />
           <text x="50" y="60" fill="white" className="text-[10px] font-black uppercase italic tracking-widest opacity-60">Pmax / Vmin</text>
           <text x="200" y="72" fill="#f43f5e" className="text-[10px] font-black uppercase italic tracking-[0.2em] shadow-glow-rose">Vmax / Pmin</text>
           <text x="320" y="130" fill="#f43f5e" className="text-[10px] font-black uppercase italic tracking-widest opacity-60">Turbulence Zone</text>
        </svg>
      </div>

      <VisualInsight 
        title="Bernoulli & Continuity Invariants" 
        description="Continuity dictates that flow volume must remain identical; therefore, velocity must increase as radius decreases. Bernoulli dictates that as kinetic energy increases, pressure must decrease to conserve total energy." 
        keyTerms={['stenosis', 'bernoulli', 'velocity-max', 'pressure-min', 'continuity']}
      />
    </motion.div>
  );
};

export const ColorVarianceVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Variance Processor" 
        subtitle="Turbulence Mapping Interface" 
        icon={Sliders} 
        protocol="14-VAR"
      />

      <div className="h-48 bg-stealth-950 rounded-[2.5rem] relative overflow-hidden border-2 border-slate-800 p-6 flex items-center justify-center shadow-2xl group/display">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <div className="grid grid-cols-2 gap-8 w-full h-full">
           <div className="bg-gradient-to-b from-blue-500 via-black to-red-500 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              <span className="text-[10px] font-black uppercase text-white italic tracking-[0.3em] drop-shadow-lg">Velocity Map</span>
           </div>
           <div className="bg-gradient-to-br from-blue-500 via-emerald-500 to-red-600 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              <span className="text-[10px] font-black uppercase text-white italic tracking-[0.3em] drop-shadow-lg">Variance Map</span>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Variance Mapping Protocol" 
        description="Variance maps utilize a three-dimensional color lookup table. In addition to direction (red/blue), they encode flow chaos (usually as green or yellow), highlighting regions of non-laminar flow such as those found post-stenosis." 
        keyTerms={['variance', 'velocity', 'spectral-width', 'turbulence', 'mapping']}
      />
    </motion.div>
  );
};

export const ContrastAgentVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Microbubble Lab" 
        subtitle="Non-Linear Contrast Processing" 
        icon={Sparkles} 
        protocol="15-CON"
      />

      <div className="h-64 bg-stealth-950 rounded-[3rem] relative overflow-hidden border-2 border-slate-800 flex items-center justify-center shadow-2xl group/display">
        <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-registry-teal/5 animate-pulse" />
        <div className="flex space-x-6 relative z-10 overflow-hidden px-12">
           {Array.from({length: 12}).map((_, i) => (
             <motion.div 
               key={i}
               animate={{ 
                 scale: [1, 1.4, 1],
                 opacity: [0.3, 0.9, 0.3],
                 x: [i * 40 - 200, i * 40 - 100]
               }}
               transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
               className="w-10 h-10 rounded-full border-2 border-white/40 bg-white/5 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] shrink-0 flex items-center justify-center"
             >
                <div className="w-2 h-2 rounded-full bg-white opacity-20" />
             </motion.div>
           ))}
        </div>
        <div className="absolute top-8 left-8 flex flex-col">
           <span className="text-[10px] font-black uppercase text-registry-teal italic tracking-widest leading-none">Non-Linear Resonance</span>
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 italic">Shell Thickness Optimized</span>
        </div>
      </div>

      <VisualInsight 
        title="Contrast Enhanced Ultrasound (CEUS)" 
        description="Contrast agents consist of gas-filled microbubbles with a stabilizing shell. Due to their small size, they stay within the vascular space and produce strong non-linear reflections, significantly increasing the backscatter from blood." 
        keyTerms={['microbubbles', 'ceus', 'backscatter', 'acoustic-impedance', 'vascular-agent']}
      />
    </motion.div>
  );
};

export const ColorDopplerVisual = DopplerModalitiesVisual;
export const SpectralDopplerVisual = DopplerModalitiesVisual;

export const PulseInversionVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Pulse Inversion" 
        subtitle="Harmonic Signal Isolation" 
        icon={Hexagon} 
        protocol="10-INV"
      />

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] relative overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-inner group/scope">
        <div className="absolute inset-0 scanline opacity-20" />
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <g transform="translate(50, 60)">
             <motion.path 
               d="M 0 0 Q 25 -40 50 0 Q 75 40 100 0" 
               stroke="#2dd4bf" strokeWidth="4" fill="none"
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
             />
             <text y="60" x="50" textAnchor="middle" fill="#2dd4bf" className="text-[10px] font-black uppercase tracking-widest italic opacity-60">Phase A</text>
          </g>
          <g transform="translate(250, 60)">
             <motion.path 
               d="M 0 0 Q 25 40 50 0 Q 75 -40 100 0" 
               stroke="#f43f5e" strokeWidth="4" fill="none"
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
             />
             <text y="60" x="50" textAnchor="middle" fill="#f43f5e" className="text-[10px] font-black uppercase tracking-widest italic opacity-60">Phase B (Inverted)</text>
          </g>
          <g transform="translate(150, 140)">
             <path d="M 0 0 Q 25 -10 50 0 Q 75 10 100 0" stroke="white" strokeWidth="2" fill="none" opacity="0.1" />
             <motion.path 
               d="M 0 0 Q 25 -25 50 0 Q 75 -25 100 0" 
               stroke="#2dd4bf" strokeWidth="4" fill="none"
               animate={{ strokeWidth: [4, 8, 4], opacity: [0.6, 1, 0.6] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="drop-shadow-glow"
             />
             <text y="40" x="50" textAnchor="middle" fill="#2dd4bf" className="text-[10px] font-black uppercase tracking-widest italic animate-pulse">Summated Harmonic</text>
          </g>
          <path d="M 180 80 L 220 80" stroke="white" strokeWidth="1" opacity="0.1" />
          <path d="M 200 60 L 200 120" stroke="white" strokeWidth="1" opacity="0.1" className="animate-pulse" />
        </svg>
      </div>

      <VisualInsight 
        title="Harmonic Synthesis" 
        description="Pulse inversion transmits two pulses down each scan line. The second pulse is a 180° inverted copy of the first. When they return, linear fundamental echoes cancel out, while non-linear harmonic echoes from microbubbles or tissue add together, creating a pure harmonic image." 
        keyTerms={['pulse-inversion', 'harmonics', 'destructive-interference', 'constructive-summation', 'non-linear']}
      />
    </motion.div>
  );
};

export const DeadZoneVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Acoustic Dead Zone" 
        subtitle="Near-Field Blindness Analysis" 
        icon={Target} 
        protocol="08-DEAD"
      />

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] relative overflow-hidden flex flex-col items-center border-2 border-slate-800 shadow-inner p-8 group/scope">
        <div className="absolute inset-0 scanline opacity-20" />
        <div className="w-full flex-1 relative flex flex-col items-center">
           <div className="w-full h-12 bg-registry-rose/20 border-b-2 border-registry-rose/40 relative z-20 flex items-center justify-center">
              <span className="text-[10px] font-black text-registry-rose uppercase tracking-[0.5em] italic animate-pulse">Dead Zone - Blind Region</span>
           </div>
           <div className="w-full flex-1 neural-grid opacity-10" />
           {Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="w-2 h-2 bg-registry-teal rounded-full absolute shadow-glow" style={{ top: 80 + i * 40, left: '50%', transform: 'translateX(-50%)' }} />
           ))}
        </div>
        <div className="absolute top-0 w-24 h-4 bg-stealth-800 rounded-b-xl border-x border-b border-white/10 flex items-center justify-center">
           <div className="w-16 h-1 bg-registry-teal/40 rounded-full" />
        </div>
      </div>

      <VisualInsight 
        title="Near-Field Limitations" 
        description="The dead zone is the region closest to the transducer where imaging is impossible. It is caused by the time it takes for the system to switch from transmit to receive mode. A standoff pad is often used to shift the anatomy of interest out of the dead zone." 
        keyTerms={['dead-zone', 'stand-off-pad', 'near-field', 'main-bang', 'switching-time']}
      />
    </motion.div>
  );
};



