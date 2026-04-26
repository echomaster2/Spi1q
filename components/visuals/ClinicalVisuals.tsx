import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Sliders, Activity, Info, Zap, AlertTriangle, Layers, Moon, Copy, Sun, Droplets, Thermometer, Sparkles, ShieldCheck } from 'lucide-react';
import { VisualInsight, VideoTutorialLink } from './BaseVisuals';


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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-stealth-900 p-6 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h4 className="text-2xl font-black uppercase italic text-white leading-none">Artifact Hunter</h4>
            <p className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] mt-2 flex items-center">
               <Zap className="w-3 h-3 mr-2 animate-pulse" /> Diagnostic Correction Protocol
            </p>
          </div>
        </div>
        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
           <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{fixed.size} / {artifacts.length} Resolved</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-6">
           <div className="aspect-video bg-black rounded-[2rem] border-2 border-slate-800 overflow-hidden relative group shadow-inner">
              <div className="absolute inset-0 scanline opacity-20" />
              
              {/* Artifact specific visuals */}
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

              <div className="absolute top-4 right-6 px-3 py-1 bg-black/60 rounded-full border border-white/10 flex items-center space-x-2">
                 <div className={`w-2 h-2 rounded-full ${isResolved ? 'bg-green-500 shadow-glow-green' : 'bg-registry-rose animate-pulse'}`} />
                 <span className="text-[11px] font-black uppercase text-white tracking-[0.2em]">{isResolved ? 'Signal Corrected' : 'Active Artifact Detected'}</span>
              </div>
           </div>

           <div className="premium-glass p-6 rounded-3xl border border-white/5 space-y-2">
              <h5 className="text-xs font-black uppercase text-amber-500 italic">Technical Briefing</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{current.clue}</p>
           </div>
        </div>

        <div className="space-y-6 flex flex-col justify-center">
           <div className="space-y-3">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Select Counter-Measure</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {current.options.map(opt => (
                    <button
                      key={opt}
                      disabled={isResolved}
                      onClick={() => handleOption(opt)}
                      className={`p-4 rounded-2xl border text-[11px] font-black uppercase text-left transition-all ${
                        isResolved && opt === current.correct 
                          ? 'bg-green-500 text-white border-green-500 shadow-glow-green' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                       {opt}
                    </button>
                 ))}
              </div>
           </div>

           <AnimatePresence mode="wait">
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-6 rounded-3xl border ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
                >
                   <div className="flex items-start space-x-4">
                      {feedback.type === 'success' ? <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" /> : <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />}
                      <div className="space-y-3">
                         <p className={`text-md font-black uppercase italic ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{feedback.text}</p>
                         {feedback.type === 'success' && (
                           <div className="space-y-2">
                              <p className="text-[11px] font-medium text-slate-400 leading-relaxed">{current.pearl}</p>
                              <button 
                                onClick={next}
                                className="px-6 py-2 bg-green-500 text-white rounded-full text-[11px] font-black uppercase mt-2 shadow-lg"
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
      className="bg-stealth-900 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl transition-all duration-500 hover:shadow-registry-teal/10 p-10 relative overflow-hidden group" 
      role="region" 
      aria-label="Doppler Modalities Simulator"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/30 shadow-glow">
            <Activity className="w-6 h-6 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-xl font-black uppercase italic text-white leading-none">Doppler Performance Lab</h4>
            <p className="text-[11px] font-black text-registry-teal uppercase tracking-[0.3em] mt-2">Hemodynamic Modalities</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
          {(['color', 'power', 'spectral'] as const).map(m => (
            <button 
              key={m} 
              onClick={() => setActive(m)} 
              className={`px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${active === m ? 'bg-registry-teal text-stealth-950 shadow-glow-teal' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 md:h-80 bg-black rounded-[2.5rem] relative overflow-hidden flex items-center justify-center border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 scanline opacity-20" />
        
        <AnimatePresence mode="wait">
          {active === 'color' && (
            <motion.div 
              key="color"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 flex items-center justify-center"
            >
               {/* Color Flow Box */}
               <div className="w-[300px] h-[150px] border border-white/10 relative rounded-xl overflow-hidden bg-white/5">
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
                  <div className="absolute top-2 left-4 text-[11px] font-black uppercase text-red-500 tracking-[0.3em]">Flow Toward</div>
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
                <text x="200" y="180" textAnchor="middle" fill="#f59e0b" className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40">Amplitude Distribution</text>
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
                <line x1="0" y1="130" x2="400" y2="130" stroke="white" strokeWidth="1" opacity="0.2" />
                <text x="5" y="15" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest italic">PSV: 120 cm/s</text>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-end">
           <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Velocity Scale / PRF</span>
           <span className="text-xl font-black italic text-registry-teal">{velocity} <span className="text-[11px]">cm/s</span></span>
        </div>
        <input 
          type="range" min="10" max="200" step="5" 
          value={velocity} 
          onChange={(e) => setVelocity(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
        />
      </div>

      <VisualInsight 
        title={`${active.charAt(0).toUpperCase() + active.slice(1)} Doppler Physics`} 
        description={active === 'color' ? "Color Flow uses pulsed Doppler to estimate mean velocities across a region, overlaying colors (BART) to show direction. Red highlights flow toward the probe, Blue away." : active === 'power' ? "Energy Doppler (Power) ignores direction and velocity, mapping only the intensity (amplitude) of the shift. This makes it impervious to aliasing and highly sensitive to low-volume flow." : "Spectral Doppler provides the full velocity profile over time. Notice the 'Envelope'—it represents the peak velocities within the sample volume across the cardiac cycle."} 
      />
    </motion.div>
  );
};

export const DisplayModesVisual: React.FC = () => {
  const [mode, setMode] = useState<'A' | 'B' | 'M'>('B');
  return (
    <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
      <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl relative z-10">
        {(['A', 'B', 'M'] as const).map(m => (
          <button 
            key={m} 
            onClick={() => setMode(m)} 
            className={`flex-1 py-2 rounded-lg text-[11px] font-black uppercase transition-all ${mode === m ? 'bg-registry-teal text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {m}-Mode
          </button>
        ))}
      </div>
      <div className="h-32 md:h-40 bg-slate-950 rounded-xl overflow-hidden p-4 border border-slate-800 flex items-center justify-center relative shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        {mode === 'A' && (
          <svg className="w-full h-full relative z-10" viewBox="0 0 400 150" preserveAspectRatio="none">
            <path d={`M 0 130 ${Array.from({ length: 30 }).map((_, i) => `L ${i * 13} ${130 - (Math.random() > 0.9 ? 80 : 5)}`).join(' ')}`} fill="none" stroke="#22d3ee" strokeWidth="3" />
          </svg>
        )}
        {mode === 'B' && (
          <div className="grid grid-cols-6 gap-2 h-full w-full relative z-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white self-center mx-auto shadow-[0_0_10px_white]" style={{ opacity: Math.random() * 0.6 + 0.1 }} />
            ))}
          </div>
        )}
        {mode === 'M' && (
          <svg className="w-full h-full relative z-10" viewBox="0 0 400 150" preserveAspectRatio="none">
            <path d={`M 0 75 ${Array.from({ length: 400 }).map((_, i) => `L ${i} ${75 + Math.sin(i * 0.08) * 20}`).join(' ')}`} fill="none" stroke="#38bdf8" strokeWidth="2" />
          </svg>
        )}
      </div>
      <VisualInsight 
        title="Display Modes" 
        description="A-mode (Amplitude) shows signal strength as spikes. B-mode (Brightness) is the standard 2D image. M-mode (Motion) tracks structure movement over time." 
      />
    </div>
  );
};

export const SafetyIndicesVisual: React.FC = () => {
  const [index, setIndex] = useState(0.5);
  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
      <div className="w-full h-4 md:h-6 bg-slate-200 dark:bg-stealth-950 rounded-full overflow-hidden border-2 border-slate-300 dark:border-white/10 shadow-inner p-0.5">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${(index/2.5) * 100}%` }}
           className={`h-full rounded-full transition-all duration-1000 ${index > 1.5 ? 'bg-registry-rose shadow-[0_0_10px_rgba(244,63,94,0.5)]' : index > 0.7 ? 'bg-registry-amber shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-registry-teal shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`} 
         />
      </div>
      <div className="p-6 md:p-10 bg-slate-50 dark:bg-stealth-950 rounded-3xl text-slate-900 dark:text-white text-center w-full shadow-inner border border-slate-200 dark:border-white/5 relative overflow-hidden group">
         <div className="absolute inset-0 neural-grid opacity-5 pointer-events-none" />
         <h4 className="text-4xl md:text-6xl font-black italic tracking-tighter tabular-nums leading-none mb-2">{index.toFixed(1)}</h4>
         <p className={`text-[11px] font-black uppercase tracking-widest mt-2 ${index > 1.5 ? 'text-registry-rose' : index > 0.7 ? 'text-registry-amber' : 'text-registry-teal'}`}>
           {index > 1.5 ? 'Critical Warning' : index > 0.7 ? 'Safe Limit' : 'Optimal'}
         </p>
      </div>
      <input 
        type="range" min="0.1" max="2.5" step="0.1" 
        value={index} 
        onChange={e => setIndex(Number(e.target.value))} 
        className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose" 
      />
      <VisualInsight 
        title="Safety Indices" 
        description="The Thermal Index (TI) monitors heat production in tissue. The Mechanical Index (MI) monitors the likelihood of cavitation. Always follow the ALARA principle." 
      />
    </div>
  );
};

export const ArtifactsVisual: React.FC = () => {
  const [type, setType] = useState<'reverb' | 'shadow' | 'mirror' | 'enhancement' | 'aliasing'>('reverb');

  const artifactInfo = {
    reverb: { 
      title: 'Reverberation', 
      desc: 'Caused by sound bouncing back and forth between two strong parallel reflectors. Appears as multiple, equally spaced echoes.',
      icon: <Layers className="w-4 h-4" />
    },
    shadow: { 
      title: 'Shadowing', 
      desc: 'Occurs when sound hits a highly attenuating structure (like bone or gallstone). Appears as a dark region behind the structure.',
      icon: <Moon className="w-4 h-4" />
    },
    mirror: { 
      title: 'Mirror Image', 
      desc: 'Sound reflects off a strong curved reflector (like the diaphragm) and hits a structure, creating a false duplicate deeper in the image.',
      icon: <Copy className="w-4 h-4" />
    },
    enhancement: { 
      title: 'Enhancement', 
      desc: 'Occurs behind a low-attenuating structure (like a cyst). Appears as a bright region because less sound was lost passing through.',
      icon: <Sun className="w-4 h-4" />
    },
    aliasing: { 
      title: 'Aliasing', 
      desc: 'A Doppler artifact where high velocities wrap around the baseline because the PRF is too low (Nyquist limit exceeded).',
      icon: <Zap className="w-4 h-4" />
    }
  };

  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 relative overflow-hidden group">
      <VideoTutorialLink videoId="auG2nND0e7w" title="Ultrasound Artifacts Explained" />
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Artifact Lab</h4>
            <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest mt-1">Acoustic Artifacts</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl overflow-x-auto scrollbar-hide relative z-10">
        {(['reverb', 'shadow', 'mirror', 'enhancement', 'aliasing'] as const).map(t => (
          <button 
            key={t} 
            onClick={() => setType(t)} 
            className={`flex-1 min-w-[100px] py-3 px-2 flex flex-col items-center space-y-1 rounded-xl transition-all ${type === t ? 'bg-amber-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {artifactInfo[t].icon}
            <span className="text-[11px] font-black uppercase tracking-widest">{t}</span>
          </button>
        ))}
      </div>

      <div className="h-64 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-inner relative flex items-center justify-center">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          <AnimatePresence mode="wait">
            {type === 'reverb' && (
              <motion.g key="reverb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <line x1="100" y1="40" x2="300" y2="40" stroke="white" strokeWidth="4" opacity="0.8" />
                <line x1="100" y1="70" x2="300" y2="70" stroke="white" strokeWidth="4" opacity="0.8" />
                {[1, 2, 3, 4].map(i => (
                  <motion.line 
                    key={i}
                    x1="100" y1={70 + i * 30} x2="300" y2={70 + i * 30} 
                    stroke="white" 
                    strokeWidth={4 - i} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 / (i + 1) }}
                    transition={{ delay: i * 0.2 }}
                  />
                ))}
              </motion.g>
            )}
            {type === 'shadow' && (
              <motion.g key="shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <defs>
                  <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="black" stopOpacity="0" />
                    <stop offset="100%" stopColor="black" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <circle cx="200" cy="80" r="35" fill="#475569" stroke="#94a3b8" strokeWidth="3" />
                <rect x="165" y="80" width="70" height="120" fill="url(#shadowGrad)" />
              </motion.g>
            )}
            {type === 'mirror' && (
              <motion.g key="mirror" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <path d="M 50 120 Q 200 80 350 120" fill="none" stroke="#3a86ff" strokeWidth="6" opacity="0.6" />
                <circle cx="200" cy="50" r="20" fill="#f43f5e" />
                <motion.circle 
                  cx="200" cy="160" r="20" 
                  fill="#f43f5e" 
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.g>
            )}
            {type === 'enhancement' && (
              <motion.g key="enhancement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <circle cx="200" cy="80" r="40" fill="#3a86ff05" stroke="#3a86ff" strokeWidth="2" />
                <rect x="160" y="80" width="80" height="120" fill="#22d3ee" opacity="0.15" />
                <motion.rect 
                  x="160" y="80" width="80" height="120" 
                  fill="white" 
                  animate={{ opacity: [0.05, 0.25, 0.05] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.g>
            )}
            {type === 'aliasing' && (
              <motion.g key="aliasing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <line x1="50" y1="100" x2="350" y2="100" stroke="white" strokeWidth="1" opacity="0.4" />
                <motion.path 
                  d="M 50 100 Q 125 -50 200 100 Q 275 250 350 100" 
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="3" 
                  strokeDasharray="10 5"
                  animate={{ strokeDashoffset: [0, -30] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      <VisualInsight 
        title={artifactInfo[type].title} 
        description={artifactInfo[type].desc} 
      />
    </div>
  );
};

export const HemodynamicsPrinciplesVisual: React.FC = () => {
  const [radius, setRadius] = useState(2);
  const flow = Math.pow(radius, 4);
  return (
    <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-6 text-center group overflow-hidden relative">
       <div className="absolute inset-0 neural-grid opacity-5 pointer-events-none" />
       <div className="h-32 md:h-40 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 shadow-inner relative z-10">
          <div className="absolute inset-0 scanline opacity-10" />
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-registry-rose/10 border-4 border-registry-rose rounded-full transition-all duration-700 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.3)]" 
            style={{ width: `${radius * 35}px`, height: `${radius * 35}px` }}
          >
            <Droplets className="text-registry-rose w-1/3 h-1/3" />
          </motion.div>
       </div>
       <div className="flex justify-around items-center bg-slate-50 dark:bg-stealth-950 p-4 rounded-2xl border border-slate-200 dark:border-white/5 relative z-10 shadow-sm">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase mb-1 text-slate-500">Radius (r)</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{radius}x</p>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
          <div className="text-center">
            <p className="text-[11px] text-registry-rose font-black uppercase mb-1">Flow (r⁴)</p>
            <p className="text-2xl font-black text-registry-rose tracking-tighter">{flow.toFixed(0)}x</p>
          </div>
       </div>
       <input 
         type="range" min="1" max="3" step="0.5" 
         value={radius} 
         onChange={e => setRadius(Number(e.target.value))} 
         className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose relative z-10" 
       />
       <div className="relative z-10">
         <VisualInsight 
           title="Poiseuille's Law" 
           description="Flow volume (Q) is proportional to the vessel radius to the 4th power. A small change in radius leads to a massive change in flow volume." 
         />
       </div>
    </div>
  );
};

export const BioeffectsVisual: React.FC = () => {
  const [ti, setTi] = useState(0.5); // Thermal Index
  const [mi, setMi] = useState(0.5); // Mechanical Index
  
  return (
    <div className="bg-stealth-900 p-6 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10 mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-registry-rose/10 rounded-2xl border border-registry-rose/30 shadow-glow-rose">
            <Thermometer className="w-6 h-6 text-registry-rose" />
          </div>
          <div>
            <h4 className="text-xl font-black uppercase italic text-white leading-none">Safety Index Matrix</h4>
            <p className="text-[11px] font-black text-registry-rose uppercase tracking-[0.3em] mt-2">Bioeffects Monitoring</p>
          </div>
        </div>
        <div className={`flex items-center space-x-3 px-6 py-2 bg-registry-rose/10 border border-registry-rose/30 rounded-full transition-all duration-500 ${ti > 1.5 || mi > 1.0 ? 'shadow-glow-rose scale-110' : 'opacity-50'}`}>
          <AlertTriangle className={`w-4 h-4 ${ti > 1.5 || mi > 1.0 ? 'text-registry-rose animate-pulse' : 'text-slate-400'}`} />
          <span className="text-[11px] font-black uppercase text-registry-rose tracking-[0.2em]">ALARA COMPLIANCE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        {/* Thermal Index Area */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[11px] font-black uppercase text-slate-500 tracking-widest mb-1">Thermal Index</p>
              <h5 className="text-sm font-black text-white italic">Tissue Heating Potential</h5>
            </div>
            <span className={`text-4xl font-black italic tracking-tighter ${ti > 1.5 ? 'text-registry-rose glow-rose' : 'text-white'}`}>{ti.toFixed(1)}</span>
          </div>
          
          <div className="h-48 bg-black rounded-[2rem] relative overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-end p-2 group/ti">
             <div className="absolute inset-0 scanline opacity-20" />
             {/* Heat Ripples */}
             <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      y: [0, -100],
                      opacity: [0, 0.4 * ti, 0],
                      scale: [1, 1.2]
                    }}
                    transition={{ 
                      duration: 3 / ti, 
                      repeat: Infinity, 
                      delay: i * 0.5,
                      ease: "linear"
                    }}
                    className="absolute bottom-0 left-0 right-0 h-2 bg-registry-rose/30 blur-md"
                    style={{ bottom: `${i * 20}%` }}
                  />
                ))}
             </div>
             <motion.div 
               animate={{ height: `${(ti / 2.5) * 100}%` }}
               className={`w-full rounded-t-2xl relative z-10 transition-all duration-700 ${ti > 1.5 ? 'bg-registry-rose shadow-glow-rose' : 'bg-orange-500'}`}
             >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center space-x-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                   <span className="text-[11px] font-black text-white uppercase tracking-widest opacity-60">Heat Zone</span>
                </div>
             </motion.div>
          </div>

          <input 
            type="range" min="0.1" max="2.5" step="0.1" 
            value={ti} 
            onChange={(e) => setTi(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose"
          />
        </div>

        {/* Mechanical Index Area */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[11px] font-black uppercase text-slate-500 tracking-widest mb-1">Mechanical Index</p>
              <h5 className="text-sm font-black text-white italic">Cavitation Potential</h5>
            </div>
            <span className={`text-4xl font-black italic tracking-tighter ${mi > 1.0 ? 'text-registry-rose glow-rose' : 'text-white'}`}>{mi.toFixed(1)}</span>
          </div>

          <div className="h-48 bg-black rounded-[2rem] relative overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center p-8 group/mi">
             <div className="absolute inset-0 scanline opacity-20" />
             
             {/* Cavitation Bubbles */}
             <div className="absolute inset-0 z-0">
                {Array.from({ length: Math.floor(mi * 10) }).map((_, i) => (
                   <motion.div 
                     key={i}
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ 
                       scale: [0, 2, 0.5, 0],
                       opacity: [0, 0.6, 0.8, 0],
                       x: Math.random() * 200 - 100,
                       y: Math.random() * 200 - 100
                     }}
                     transition={{ 
                       duration: 0.8 / mi, 
                       repeat: Infinity,
                       delay: Math.random() * 2
                     }}
                     className={`w-4 h-4 rounded-full border-2 border-white/20 absolute ${mi > 1.2 ? 'bg-red-500/20' : 'bg-registry-teal/20'}`}
                   />
                ))}
             </div>

             <motion.div 
               animate={{ 
                 scale: [1, 1 + mi * 0.4, 1],
                 opacity: [0.6, 1, 0.6],
                 rotate: [0, 5, -5, 0]
               }}
               transition={{ duration: 0.2 / mi, repeat: Infinity }}
               className={`w-20 h-20 rounded-full border-4 ${mi > 1.0 ? 'border-registry-rose shadow-glow-rose' : 'border-registry-teal shadow-glow'} flex items-center justify-center relative z-10`}
             >
                <div className={`w-12 h-12 rounded-full blur-xl ${mi > 1.0 ? 'bg-registry-rose' : 'bg-registry-teal'}`} />
             </motion.div>

             <div className="absolute top-4 left-4 flex flex-col">
                <span className="text-[11px] font-black uppercase text-slate-500">Transient</span>
                <span className="text-[11px] font-black uppercase text-slate-500">Cavitation</span>
             </div>
          </div>

          <input 
            type="range" min="0.1" max="1.9" step="0.1" 
            value={mi} 
            onChange={(e) => setMi(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose"
          />
        </div>
      </div>

      <div className="premium-glass p-6 rounded-3xl border border-white/5 relative z-10">
        <h5 className="text-[11px] font-black uppercase text-white mb-3">BIOLOGICAL SAFETY STANDARDS</h5>
        <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
          The <span className="text-registry-rose">MI</span> is particularly critical during contrast studies, as high indices can cause microbubble bursting. The <span className="text-orange-500">TI</span> is critical when imaging sensitive tissues like fetal bone or neonatal brain. Always optimize your machine settings to keep these indices below 1.0 whenever possible.
        </p>
      </div>

      <VisualInsight 
        title="Predictive Bioeffects Theory" 
        description="TI models the maximum temperature rise in the target tissue based on acoustic output. MI models the peak rarefaction pressure, which determines the likelihood of bubble formation (cavitation). Both indices provide a real-time risk assessment for the sonographer." 
      />
    </div>
  );
};

export const SpeckleVisual: React.FC = () => {
  const [reduction, setReduction] = useState(0); 
  
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Acoustic Speckle Lab</span>
        </div>
        <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5">
          <span className="text-[11px] font-black uppercase text-slate-500">Reduction: {reduction}%</span>
          <input 
            type="range" min="0" max="100" step="10" 
            value={reduction} 
            onChange={(e) => setReduction(parseInt(e.target.value))}
            className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
          />
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
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
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
        />

        <div className="relative z-10 w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center">
           <div className={`w-12 h-12 rounded-full bg-white/10 ${reduction > 50 ? 'opacity-100' : 'opacity-40'} transition-opacity duration-500`} />
           <p className="absolute -bottom-6 text-[11px] font-black uppercase text-white/50 whitespace-nowrap">Target Cyst</p>
        </div>
      </div>

      <VisualInsight 
        title="Acoustic Speckle" 
        description="Speckle is the grainy appearance caused by interference. Speckle reduction filters help improve contrast resolution." 
      />
    </div>
  );
};

export const ContrastResolutionVisual: React.FC = () => {
  const [bitDepth, setBitDepth] = useState(3); 
  const grayShades = Math.pow(2, bitDepth);
  
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Moon className="w-4 h-4 text-amber-500" />
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Contrast Resolution Lab</span>
        </div>
        <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5">
          <span className="text-[11px] font-black uppercase text-slate-500">{bitDepth} Bits ({grayShades} Shades)</span>
          <input 
            type="range" min="1" max="8" step="1" 
            value={bitDepth} 
            onChange={(e) => setBitDepth(parseInt(e.target.value))}
            className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 grid grid-cols-8 gap-1 p-2">
        {Array.from({ length: 64 }).map((_, i) => {
          const normalized = i / 63;
          const shadeIndex = Math.floor(normalized * grayShades);
          const shadeValue = (shadeIndex / (grayShades - 1)) * 255;
          return (
            <motion.div 
              key={i}
              animate={{ backgroundColor: `rgb(${shadeValue}, ${shadeValue}, ${shadeValue})` }}
              className="w-full h-full rounded-sm"
            />
          );
        })}
      </div>

      <VisualInsight 
        title="Contrast Resolution" 
        description="Determined by bits/pixel in the scan converter. More bits = more shades of gray." 
      />
    </div>
  );
};

export const HarmonicImagingVisual: React.FC = () => {
  const [showHarmonic, setShowHarmonic] = useState(false);
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 relative overflow-hidden group">
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-registry-teal/10 rounded-xl border border-registry-teal/20">
            <Zap className="w-5 h-5 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Tissue Harmonics</h4>
            <p className="text-[11px] font-black text-registry-teal uppercase tracking-widest mt-1">Non-Linear Imaging</p>
          </div>
        </div>
        <button 
          onClick={() => setShowHarmonic(!showHarmonic)}
          className={`px-6 py-2 rounded-full text-[11px] font-black uppercase transition-all ${showHarmonic ? 'bg-registry-teal text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
        >
          {showHarmonic ? 'Harmonic Mode ON' : 'Fundamental Mode'}
        </button>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
        <div className="absolute inset-0 scanline opacity-10" />
        <div className={`transition-all duration-700 ${showHarmonic ? 'blur-0 opacity-100' : 'blur-sm opacity-60'}`}>
           <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/10" />
           </div>
        </div>
        <div className="absolute bottom-4 left-4 flex space-x-4">
           <div className="flex flex-col items-center">
              <div className={`w-8 h-1 bg-registry-teal rounded-full mb-1 ${showHarmonic ? 'opacity-40' : 'opacity-100'}`} />
              <span className="text-[6px] font-black text-slate-500 uppercase">Fundamental</span>
           </div>
           <div className="flex flex-col items-center">
              <div className={`w-8 h-1 bg-registry-amber rounded-full mb-1 ${showHarmonic ? 'opacity-100' : 'opacity-20'}`} />
              <span className="text-[6px] font-black text-slate-500 uppercase">Harmonic</span>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Harmonic Imaging" 
        description="Extracts the second harmonic frequency created during non-linear propagation through tissue. Reduces clutter and improves lateral resolution." 
      />
    </div>
  );
};

export const ElastographyVisual: React.FC = () => {
  const [isStiff, setIsStiff] = useState(false);
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-registry-rose" />
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Strain Elastography</span>
        </div>
        <button 
          onClick={() => setIsStiff(!isStiff)}
          className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 ${isStiff ? 'bg-registry-rose text-white' : 'bg-registry-teal text-white'}`}
        >
          {isStiff ? 'Target: Stiff (Malignant?)' : 'Target: Soft (Benign?)'}
        </button>
      </div>
      <div className="relative h-40 flex items-center justify-center">
        <motion.div 
          animate={{ scale: isStiff ? 0.9 : 1.1 }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={`w-32 h-32 rounded-full blur-2xl opacity-40 ${isStiff ? 'bg-registry-rose' : 'bg-registry-teal'}`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-8 gap-1 opacity-20">
            {Array.from({ length: 64 }).map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  y: isStiff ? [0, 2, 0] : [0, 10, 0],
                  opacity: isStiff ? 0.8 : 0.3
                }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.02 }}
                className={`w-2 h-2 rounded-full ${isStiff ? 'bg-registry-rose' : 'bg-registry-teal'}`}
              />
            ))}
          </div>
        </div>
      </div>
      <VisualInsight 
        title="Elastography" 
        description="Measures tissue stiffness. Stiff tissues (often red/blue depending on map) deform less under pressure than soft healthy tissues." 
      />
    </div>
  );
};

export const FlowPatternsVisual: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
      <h4 className="text-lg font-black uppercase italic text-white flex items-center">
        <Activity className="w-5 h-5 mr-3 text-registry-rose" />
        Flow Patterns
      </h4>
      <div className="grid grid-cols-2 gap-4 h-40">
        <div className="bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
           <span className="text-[11px] font-black uppercase text-registry-teal mb-4 relative z-10">Laminar</span>
           <div className="absolute inset-x-0 h-full flex flex-col justify-around py-4">
              {[1, 2, 3, 2, 1].map((speed, i) => (
                <motion.div 
                  key={i}
                  animate={{ x: [-20, 120] }}
                  transition={{ duration: 3 / speed, repeat: Infinity, ease: "linear" }}
                  className="h-1 bg-registry-teal/40 rounded-full"
                  style={{ width: '20px' }}
                />
              ))}
           </div>
        </div>
        <div className="bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
           <span className="text-[11px] font-black uppercase text-registry-rose mb-4 relative z-10">Turbulent</span>
           <div className="absolute inset-0 flex items-center justify-center">
              {Array.from({length: 8}).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    x: [Math.random() * 100, Math.random() * 100], 
                    y: [Math.random() * 100, Math.random() * 100],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute w-2 h-2 bg-registry-rose rounded-full"
                />
              ))}
           </div>
        </div>
      </div>
      <VisualInsight 
        title="Laminar vs. Turbulent" 
        description="Laminar flow is organized with higher velocities in the center (parabolic). Turbulent flow is chaotic, often seen after a stenosis." 
      />
    </div>
  );
};

export const StenosisHemodynamicsExplainer: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
      <h4 className="text-lg font-black uppercase italic text-white flex items-center">
        <Activity className="w-5 h-5 mr-3 text-registry-rose" />
        Stenosis Physics
      </h4>
      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 400 150">
           <path d="M 0 40 Q 200 65 400 40 L 400 110 Q 200 85 0 110 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.2" />
           <motion.path 
             animate={{ strokeDashoffset: [0, -40] }}
             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
             d="M 50 75 L 150 75 Q 200 75 250 75 L 350 75" 
             stroke="#f43f5e" strokeWidth="4" strokeDasharray="10 10" 
           />
           <rect x="180" y="45" width="40" height="20" fill="#f43f5e" opacity="0.4" rx="4" />
           <rect x="180" y="85" width="40" height="20" fill="#f43f5e" opacity="0.4" rx="4" />
           <text x="50" y="60" fill="white" className="text-[11px] font-black uppercase opacity-60">Low Vel</text>
           <text x="200" y="70" fill="#f43f5e" className="text-[11px] font-black uppercase">Max Vel</text>
           <text x="350" y="130" fill="#f43f5e" className="text-[11px] font-black uppercase opacity-60">Turbulence</text>
        </svg>
      </div>
      <VisualInsight 
        title="Bernoulli Principle" 
        description="As blood enters a stenosis, velocity increases and pressure decreases. Highest velocity is found at the narrowest point (the throat)." 
      />
    </div>
  );
};

export const ColorVarianceVisual: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
      <h4 className="text-lg font-black uppercase italic text-white flex items-center">
        <Sliders className="w-5 h-5 mr-3 text-registry-teal" />
        Variance Map
      </h4>
      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 p-4">
        <div className="grid grid-cols-2 gap-4 h-full">
           <div className="bg-gradient-to-b from-blue-500 via-black to-red-500 rounded-lg flex items-center justify-center text-[11px] font-black uppercase">Velocity Map</div>
           <div className="bg-gradient-to-br from-blue-500 via-green-500 to-red-600 rounded-lg flex items-center justify-center text-[11px] font-black uppercase">Variance Map</div>
        </div>
      </div>
      <VisualInsight 
        title="Variance Maps" 
        description="Unlike velocity maps, variance maps add a third color (usually green/yellow) to represent turbulent or chaotic flow. Colors on the left represent laminar, right represent turbulent." 
      />
    </div>
  );
};

export const ContrastAgentVisual: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
      <h4 className="text-lg font-black uppercase italic text-white flex items-center">
        <Sparkles className="w-5 h-5 mr-3 text-registry-teal" />
        Microbubbles
      </h4>
      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
        {Array.from({length: 12}).map((_, i) => (
          <motion.div 
            key={i}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3],
              x: [i * 30 - 150, i * 30 - 100]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="w-4 h-4 rounded-full border-2 border-white/40 bg-white/10"
          />
        ))}
        <div className="absolute inset-0 bg-blue-500/10 blur-xl animate-pulse" />
      </div>
      <VisualInsight 
        title="Contrast Agents" 
        description="Gas-filled microbubbles that produce strong non-linear reflections. They have a different acoustic impedance than blood, making them highly visible." 
      />
    </div>
  );
};

export const ColorDopplerVisual = DopplerModalitiesVisual;
export const SpectralDopplerVisual = DopplerModalitiesVisual;



