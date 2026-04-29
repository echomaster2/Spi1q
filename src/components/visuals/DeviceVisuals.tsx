import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Activity, Info, Loader2, Volume2, Sparkles, Book, Zap, AlertCircle, Cpu, Database, Monitor, Eye, EyeOff, Target, MinusSquare, Layers, Waves, X, Timer, Crosshair, ChevronRight, Settings } from 'lucide-react';
import { VisualHeader, VisualInsight } from './BaseVisuals';

// --- DEVICE & HANDLER VISUALS ---

export const ReceiverPipelineVisual: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { 
      name: "Amplification", 
      short: "AMP",
      icon: Zap, 
      color: "text-registry-teal",
      desc: "Uniformly increases the strength of all returning signals. Higher Gain = Brighter Image. Affects Signal-to-Noise ratio by amplifying noise too.",
      signal: (
        <g>
          <motion.path 
            animate={{ strokeWidth: [2, 3, 2], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 50 100 Q 75 80 100 100 Q 125 120 150 100" fill="none" stroke="#2dd4bf" strokeWidth="2" 
          />
          <motion.path 
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 250 100 Q 275 40 300 100 Q 325 160 350 100" fill="none" stroke="#2dd4bf" strokeWidth="4" 
          />
          <text x="100" y="160" textAnchor="middle" fill="#2dd4bf" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 italic">Weak Input</text>
          <text x="300" y="190" textAnchor="middle" fill="#2dd4bf" className="text-[11px] font-black uppercase tracking-[0.4em] shadow-glow-teal italic">Amplified Matrix</text>
          <path d="M 175 100 L 225 100" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="6 3" />
        </g>
      )
    },
    { 
      name: "Compensation", 
      short: "TGC",
      icon: Layers, 
      color: "text-blue-400",
      desc: "Time Gain Compensation (TGC) corrects for depth-related attenuation. It amplifies deeper, weaker echoes more than shallow ones for uniform brightness.",
      signal: (
        <g>
          <motion.path 
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 50 100 Q 75 60 100 100 Q 125 140 150 100" fill="none" stroke="#60a5fa" strokeWidth="3" 
          />
          <motion.path 
            animate={{ strokeWidth: [3, 6, 3] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 250 100 Q 275 60 300 100 Q 325 140 350 100" fill="none" stroke="#60a5fa" strokeWidth="3" 
          />
          <text x="100" y="160" textAnchor="middle" fill="#60a5fa" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 italic">Attenuated Echo</text>
          <text x="300" y="190" textAnchor="middle" fill="#60a5fa" className="text-[11px] font-black uppercase tracking-[0.4em] shadow-glow italic">Balanced Spectrum</text>
          <path d="M 175 100 L 225 100" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 3" />
        </g>
      )
    },
    { 
      name: "Compression", 
      short: "DYN",
      icon: Search, 
      color: "text-violet-400",
      desc: "Reduces the range of signal amplitudes (Dynamic Range) to fit within the system's memory and the human eye's grayscale capabilities.",
      signal: (
        <g>
          <motion.rect 
            animate={{ height: [120, 140, 120], y: [40, 30, 40], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
            x="50" y="40" width="100" height="120" fill="#a78bfa20" stroke="#a78bfa" strokeWidth="2" 
          />
          <motion.rect 
            animate={{ height: [70, 60, 70], y: [65, 70, 65], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            x="250" y="70" width="100" height="70" fill="#a78bfa40" stroke="#a78bfa" strokeWidth="4" 
          />
          <text x="100" y="195" textAnchor="middle" fill="#a78bfa" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 italic">Wide Range</text>
          <text x="300" y="155" textAnchor="middle" fill="#a78bfa" className="text-[11px] font-black uppercase tracking-[0.4em] shadow-glow italic">Compressed Scale</text>
          <path d="M 175 100 L 225 100" stroke="#a78bfa" strokeWidth="2" strokeDasharray="6 3" />
        </g>
      )
    },
    { 
      name: "Demodulation", 
      short: "DEMO",
      icon: Waves, 
      color: "text-amber-400",
      desc: "Two-step process: Rectification (negative to positive) and Smoothing (envelope detection) to prepare signal for display logic.",
      signal: (
        <g>
          <motion.path 
            animate={{ strokeDashoffset: [0, -30] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            d="M 50 100 L 60 80 L 70 120 L 80 70 L 90 130 L 100 100" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.4" strokeDasharray="6 3"
          />
          <motion.path 
            animate={{ strokeWidth: [4, 7, 4] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 250 100 Q 275 60 300 70 Q 325 80 350 100" fill="none" stroke="#fbbf24" strokeWidth="4" 
          />
          <text x="75" y="160" textAnchor="middle" fill="#fbbf24" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 italic">RF Signal</text>
          <text x="300" y="140" textAnchor="middle" fill="#fbbf24" className="text-[11px] font-black uppercase tracking-[0.4em] shadow-glow italic">Video Envelope</text>
          <path d="M 175 100 L 225 100" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 3" />
        </g>
      )
    },
    { 
      name: "Rejection", 
      short: "REJ",
      icon: X, 
      color: "text-registry-rose",
      desc: "Threshold Filtering: Eliminates low-level acoustic noise and 'clutter' that doesn't meet the minimum intensity requirement.",
      signal: (
        <g>
          <motion.path 
            animate={{ opacity: [0.5, 0.2, 0.5], y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            d="M 50 100 L 60 95 L 70 105 L 80 98 L 90 102 L 100 100" fill="none" stroke="#f43f5e" strokeWidth="2" 
          />
          <motion.line 
            animate={{ strokeWidth: [5, 2, 5], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            x1="250" y1="100" x2="350" y2="100" stroke="#f43f5e" strokeWidth="5" 
          />
          <text x="75" y="140" textAnchor="middle" fill="#f43f5e" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 italic">Clutter / Noise</text>
          <text x="300" y="140" textAnchor="middle" fill="#f43f5e" className="text-[11px] font-black uppercase tracking-[0.4em] shadow-glow-rose italic">Clean Baseline</text>
          <path d="M 175 100 L 225 100" stroke="#f43f5e" strokeWidth="2" strokeDasharray="6 3" />
        </g>
      )
    },
  ];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Receiver Pipeline" 
        subtitle="Hardware Signal Chain" 
        icon={Activity} 
        protocol="05-PIPELINE"
      />

      <div className="flex items-center space-x-3 bg-stealth-950/60 p-3 rounded-2xl border border-white/5 shadow-inner mb-10 w-fit">
        {steps.map((_, i) => (
          <motion.div 
            key={i} 
            animate={{ 
              scale: activeStep === i ? 1.3 : 1,
              backgroundColor: i <= activeStep ? "#2dd4bf" : "#1e293b",
              boxShadow: activeStep === i ? "0 0 20px #2dd4bf" : "none"
            }}
            className="w-3 h-3 rounded-full transition-all duration-500" 
          />
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4 p-3 bg-stealth-950/80 backdrop-blur-xl rounded-[2.5rem] relative z-10 border border-white/10 shadow-2xl group-hover:border-white/20 transition-all mb-12">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className={`group/btn flex-1 py-6 rounded-3xl flex flex-col items-center space-y-3 transition-all duration-500 relative overflow-hidden ${
              activeStep === i 
                ? 'bg-white/10 border-white/10 shadow-glow shadow-white/5 scale-105 z-10' 
                : 'opacity-30 hover:opacity-100 hover:bg-white/5'
            }`}
          >
            {activeStep === i && (
               <motion.div layoutId="pipeline-bg-v2" className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            )}
            <step.icon className={`w-8 h-8 transition-transform duration-500 group-hover/btn:scale-110 ${step.color} ${activeStep === i ? 'drop-shadow-glow' : ''}`} />
            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${activeStep === i ? 'text-white' : 'text-slate-500'}`}>{step.short}</span>
            {activeStep === i && (
              <motion.div layoutId="pipeline-active-v2" className={`absolute bottom-0 left-0 right-0 h-1.5 ${step.color.replace('text-', 'bg-')}`} />
            )}
          </button>
        ))}
      </div>

      <div className="h-72 md:h-96 bg-stealth-950 rounded-[3rem] border-2 border-white/5 relative overflow-hidden shadow-inner group/engine">
        <div className="absolute inset-0 scanline opacity-20" />
        <div className="absolute top-6 left-8 flex items-center space-x-4 z-20">
           <div className="w-2.5 h-2.5 rounded-full bg-registry-rose animate-pulse shadow-glow-rose" />
           <span className="text-[11px] font-mono text-registry-teal uppercase tracking-[0.3em] font-black">SIGNAL_ENVELOPE.TSX _</span>
        </div>
        <div className="absolute bottom-6 right-8 text-[10px] font-mono text-slate-600 uppercase tracking-widest z-20 transition-colors group-hover/engine:text-registry-teal">
           HW-ADDR: 0x{Math.random().toString(16).substring(2, 8).toUpperCase()}
        </div>

        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          <AnimatePresence mode="wait">
            <motion.g
              key={activeStep}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.6, type: "spring", damping: 20 }}
            >
              {steps[activeStep].signal}
            </motion.g>
          </AnimatePresence>
        </svg>
      </div>

      <VisualInsight 
        title={`${steps[activeStep].name} Stage`} 
        description={steps[activeStep].desc} 
        keyTerms={['amplification', 'compensation', 'compression', 'demodulation', 'rejection', 'receiver', 'signal-processing']}
      />
    </motion.div>
  );
};

export const PrePostProcessingVisual: React.FC = () => {
  const [isPost, setIsPost] = useState(false);
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10 mb-12">
        <div className="flex items-center space-x-6">
          <div className="p-5 bg-registry-teal/10 rounded-2xl border border-registry-teal/20 shadow-glow">
            <Cpu className="w-8 h-8 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-2xl font-black uppercase italic text-white leading-none tracking-tight">Signal Logic Matrix</h4>
            <p className="text-[11px] font-black text-registry-teal uppercase tracking-[0.4em] mt-2 opacity-70">Pre vs Post Integration</p>
          </div>
        </div>
        
        <div className="flex bg-stealth-950 p-2 rounded-2xl border border-white/5 shadow-inner">
          <button 
            onClick={() => setIsPost(false)}
            className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase transition-all tracking-[0.2em] italic ${!isPost ? 'bg-registry-teal text-stealth-950 shadow-glow' : 'text-slate-500 hover:text-white'}`}
          >
            Pre-Proc
          </button>
          <button 
            onClick={() => setIsPost(true)}
            className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase transition-all tracking-[0.2em] italic ${isPost ? 'bg-registry-rose text-white shadow-glow-rose' : 'text-slate-500 hover:text-white'}`}
          >
            Post-Proc
          </button>
        </div>
      </div>

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] overflow-hidden border-2 border-white/5 relative z-10 shadow-inner flex items-center justify-center p-12 group/display">
        <div className="absolute inset-0 scanline opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/5 to-transparent opacity-0 group-hover/display:opacity-100 transition-opacity" />
        
        <AnimatePresence mode="wait">
          {!isPost ? (
            <motion.div 
              key="pre-proc"
              initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, filter: "blur(10px)" }}
              className="w-full max-w-2xl space-y-10"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center space-y-4">
                   <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 rounded-[1.25rem] bg-registry-teal/20 flex items-center justify-center border-2 border-registry-teal/40 shadow-glow-teal"
                   >
                    <Waves className="w-8 h-8 text-registry-teal" />
                  </motion.div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Analog Pulse</span>
                </div>
                
                <div className="flex-1 flex items-center justify-center relative px-10">
                   <motion.div 
                    animate={{ x: [-100, 100], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute h-1 w-20 bg-registry-teal shadow-glow"
                   />
                   <div className="w-full h-px bg-white/10" />
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-stealth-900 flex items-center justify-center border-2 border-white/5">
                    <Database className="w-8 h-8 text-slate-500" />
                  </div>
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] italic">Converter</span>
                </div>
              </div>
              <div className="py-4 px-8 bg-registry-teal/10 border border-registry-teal/30 rounded-2xl text-center shadow-glow-teal">
                <p className="text-[12px] font-black text-registry-teal uppercase tracking-[0.4em] italic mb-1">Status: LIVE DATA STREAM ACTIVE</p>
                <div className="h-1 bg-registry-teal/20 rounded-full overflow-hidden">
                   <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1, repeat: Infinity }} className="h-full w-1/3 bg-registry-teal" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="post-proc"
              initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, filter: "blur(10px)" }}
              className="w-full max-w-2xl space-y-10"
            >
              <div className="flex items-center justify-between">
                 <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-registry-rose/20 flex items-center justify-center border-2 border-registry-rose/40 shadow-glow-rose">
                    <Database className="w-8 h-8 text-registry-rose" />
                  </div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Stored Frames</span>
                </div>

                <div className="flex-1 flex items-center justify-center relative px-10">
                   <motion.div 
                    animate={{ x: [100, -100], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute h-1 w-20 bg-registry-rose shadow-glow-rose"
                   />
                   <div className="w-full h-px bg-white/10" />
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-stealth-900 flex items-center justify-center border-2 border-white/5">
                    <Monitor className="w-8 h-8 text-slate-500" />
                  </div>
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] italic">Display Unit</span>
                </div>
              </div>
              <div className="py-4 px-8 bg-registry-rose/10 border border-registry-rose/30 rounded-2xl text-center shadow-glow-rose">
                <p className="text-[12px] font-black text-registry-rose uppercase tracking-[0.4em] italic mb-1">Status: ARCHIVAL RECONSTRUCTION</p>
                <div className="flex items-center justify-center space-x-2">
                   <div className="w-2 h-2 rounded-full bg-registry-rose animate-ping" />
                   <div className="h-1 flex-1 bg-registry-rose/20 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 shadow-2xl relative overflow-hidden ${!isPost ? 'bg-registry-teal/10 border-registry-teal/30 shadow-glow-teal' : 'bg-stealth-950 border-white/5 opacity-40 hover:opacity-100'}`}>
           <div className={`absolute top-0 right-0 p-4 font-mono text-[9px] font-black uppercase opacity-20 ${!isPost ? 'text-registry-teal' : 'text-slate-500'}`}>PROTOCOL_0A</div>
          <div className="flex items-center space-x-4 mb-6">
             <div className={`p-2 rounded-lg ${!isPost ? 'bg-registry-teal text-stealth-950 shadow-glow' : 'bg-white/5 text-slate-500'}`}>
                <Settings className="w-4 h-4" />
             </div>
             <h5 className={`text-[12px] font-black uppercase tracking-[0.2em] ${!isPost ? 'text-white' : 'text-slate-500'}`}>Pre-Processing [Real-Time]</h5>
          </div>
          <ul className="grid grid-cols-2 gap-4">
            {['TGC Curve', 'Log Compression', 'Write Zoom', 'Persistence'].map(item => (
              <li key={item} className="flex items-center space-x-2 text-[11px] font-black text-slate-400 uppercase tracking-tighter transition-colors hover:text-registry-teal">
                <ChevronRight className="w-3 h-3 text-registry-teal" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 shadow-2xl relative overflow-hidden ${isPost ? 'bg-registry-rose/10 border-registry-rose/30 shadow-glow-rose' : 'bg-stealth-950 border-white/5 opacity-40 hover:opacity-100'}`}>
           <div className={`absolute top-0 right-0 p-4 font-mono text-[9px] font-black uppercase opacity-20 ${isPost ? 'text-registry-rose' : 'text-slate-500'}`}>PROTOCOL_0B</div>
          <div className="flex items-center space-x-4 mb-6">
             <div className={`p-2 rounded-lg ${isPost ? 'bg-registry-rose text-white shadow-glow-rose' : 'bg-white/5 text-slate-500'}`}>
                <Monitor className="w-4 h-4" />
             </div>
             <h5 className={`text-[12px] font-black uppercase tracking-[0.2em] ${isPost ? 'text-white' : 'text-slate-500'}`}>Post-Processing [Digital]</h5>
          </div>
          <ul className="grid grid-cols-2 gap-4">
            {['Read Zoom', 'B-Color Maps', 'Gray Map', 'Post-Gain'].map(item => (
              <li key={item} className="flex items-center space-x-2 text-[11px] font-black text-slate-400 uppercase tracking-tighter transition-colors hover:text-registry-rose">
                <ChevronRight className="w-3 h-3 text-registry-rose" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <VisualInsight 
        title="Hardware vs Software Matrix" 
        description={!isPost 
          ? "Pre-processing involves manipulation of the signal as it reaches the scan converter. These operations are locked into the image memory once performed and cannot be undone after freezing." 
          : "Post-processing acts on the stored digital data. This allows for 'archival reconstruction' where parameters can be toggled and tweaked even after the patient has left the exam room."} 
        keyTerms={['scan-converter', 'write-zoom', 'read-zoom', 'interpolation', 'grayscale-mapping']}
      />
    </motion.div>
  );
};

export const ArrayTypesVisual: React.FC = () => {
  const [type, setType] = useState<'linear' | 'curved' | 'phased'>('linear');
  const [scanIndex, setScanIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanIndex(prev => (prev + 1) % 24);
    }, 50);
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
        title="Array Deployment" 
        subtitle="Transducer Geometry" 
        icon={Cpu} 
        protocol="02-TRANSDUCER"
      />

      <div className="flex flex-col sm:flex-row gap-4 p-3 bg-stealth-950/80 backdrop-blur-xl rounded-[2.5rem] relative z-10 mb-12 border border-white/5 shadow-2xl">
        {(['linear', 'curved', 'phased'] as const).map(t => (
          <button 
            key={t} 
            onClick={() => setType(t)} 
            className={`flex-1 py-5 px-8 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 relative overflow-hidden italic ${
              type === t ? 'text-stealth-950 bg-registry-teal shadow-glow' : 'text-slate-500 hover:text-white'
            }`}
          >
            {type === t && <motion.div layoutId="arr-active-v2" className="absolute inset-0 bg-white/20" />}
            <span className="relative z-10">{t} Array</span>
          </button>
        ))}
      </div>

      <div className="h-72 md:h-96 bg-stealth-950 rounded-[3rem] overflow-hidden border-2 border-white/5 flex items-start justify-center p-12 relative shadow-inner group/display">
        <div className="absolute inset-0 scanline opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-registry-teal/10 to-transparent pointer-events-none" />
        
        <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="beamGradV2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#2dd4bf" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </linearGradient>
            <filter id="glowV2">
               <feGaussianBlur stdDeviation="3" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {type === 'linear' && (
            <g filter="url(#glowV2)">
              {Array.from({length: 24}).map((_, i) => (
                <motion.path 
                  key={i} 
                  d={`M ${80 + i*10} 20 L ${80 + i*10} 180`}
                  stroke="url(#beamGradV2)"
                  strokeWidth="4" 
                  animate={{ 
                    opacity: (scanIndex === i || scanIndex === i-1 || scanIndex === i+1) ? 1 : 0.05,
                    strokeWidth: (scanIndex === i) ? 8 : 4
                  }}
                  className="transition-all duration-300"
                />
              ))}
              <rect x="75" y="5" width="250" height="20" fill="#1e293b" rx="6" className="stroke-white/20 shadow-glow" />
            </g>
          )}

          {type === 'curved' && (
            <g filter="url(#glowV2)">
              {Array.from({length: 24}).map((_, i) => {
                const ang = (i - 11.5) * 0.07;
                const r1 = 40;
                const r2 = 240;
                return (
                  <motion.path 
                    key={i} 
                    d={`M ${200 + Math.sin(ang)*r1} ${20 + Math.cos(ang)*r1 - 25} L ${200 + Math.sin(ang)*r2} ${20 + Math.cos(ang)*r2 - 25}`}
                    stroke="url(#beamGradV2)"
                    strokeWidth="4" 
                    animate={{ 
                      opacity: (scanIndex === i || scanIndex === i-1 || scanIndex === i+1) ? 1 : 0.05,
                      strokeWidth: (scanIndex === i) ? 8 : 4
                    }}
                  />
                );
              })}
              <path d="M 100 55 Q 200 15 300 55" fill="none" stroke="#1e293b" strokeWidth="25" strokeLinecap="round" className="opacity-90 shadow-glow" />
            </g>
          )}

          {type === 'phased' && (
            <g filter="url(#glowV2)">
              {Array.from({length: 24}).map((_, i) => {
                const centerAng = Math.sin(scanIndex * 0.25) * 0.7;
                const beamAng = centerAng + (i - 11.5) * 0.015;
                return (
                  <motion.line 
                    key={i} 
                    x1="200" y1="20" 
                    x2={200 + Math.sin(beamAng)*200} y2={20 + Math.cos(beamAng)*200} 
                    stroke="url(#beamGradV2)"
                    strokeWidth="3" 
                    animate={{ 
                       opacity: 0.3 + (Math.abs(Math.sin(scanIndex*0.1)) * 0.7),
                    }}
                  />
                );
              })}
              <rect x="170" y="5" width="60" height="25" fill="#1e293b" rx="4" className="stroke-white/20 shadow-glow" />
            </g>
          )}
        </svg>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-3">
           <div className="w-2 h-2 rounded-full bg-registry-teal animate-pulse" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Beam Synthesis Protocol</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 relative z-10">
        <div className="bg-stealth-950 p-8 rounded-[2.5rem] border-2 border-white/5 shadow-2xl flex flex-col justify-center space-y-4 group/card hover:border-registry-teal/40 transition-all">
          <div className="flex items-center space-x-4 mb-2">
             <Target className="w-5 h-5 text-registry-teal drop-shadow-glow" />
             <p className="text-[11px] font-black uppercase text-registry-teal tracking-[0.3em] italic">Anatomic Target</p>
          </div>
          <p className="text-xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg">
            {type === 'linear' ? "Vascular / Small Parts" : type === 'curved' ? "Abdominal / OB-GYN" : "Intercostal Cardiac"}
          </p>
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
             <span className="text-[9px] font-black text-slate-600 uppercase">Resolution Priority</span>
             <span className="text-[10px] font-black text-registry-teal uppercase italic">Maximum High-Res</span>
          </div>
        </div>
        <div className="bg-stealth-950 p-8 rounded-[2.5rem] border-2 border-white/5 shadow-2xl flex flex-col justify-center space-y-4 group/card hover:border-registry-teal/40 transition-all">
          <div className="flex items-center space-x-4 mb-2">
             <Crosshair className="w-5 h-5 text-registry-teal drop-shadow-glow" />
             <p className="text-[11px] font-black uppercase text-registry-teal tracking-[0.3em] italic">Electronic Steering</p>
          </div>
          <p className="text-xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg">
            {type === 'linear' ? "Rectangular Matrix" : type === 'curved' ? "Blunted Sector" : "Vector Wedge"}
          </p>
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
             <span className="text-[9px] font-black text-slate-600 uppercase">Acoustic Coupling</span>
             <span className="text-[10px] font-black text-registry-teal uppercase italic">Enhanced Logic</span>
          </div>
        </div>
      </div>

      <VisualInsight 
        title={`${type.charAt(0).toUpperCase() + type.slice(1)} Array Configuration`} 
        description={type === 'linear' ? "High-frequency linear arrays use precise rectangular formats. Since the crystals fire in sequential groups parallel to one another, the image width is identical at all depths, maximizing near-field resolution for vessels and small parts." : type === 'curved' ? "Curved arrays utilize a convex face to naturally diverge the sound beams. This creates a wider field of view at depth than the physical footprint of the probe, making it the gold standard for deep abdominal and obstetric imaging." : "Phased arrays use electronic steering to sweep the beam through a narrow acoustic window (like the spaces between ribs). All elements fire near-simultaneously with sub-microsecond timing delays to shape and steer the wavefront."} 
        keyTerms={['array', 'steering', 'focusing', 'footprint', 'sector', 'linear-format']}
      />
    </motion.div>
  );
};

export const PulseEchoPrincipleVisual: React.FC = () => {
  const [pulsePos, setPulsePos] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePos(prev => (prev + 2) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const isTransmitPhase = pulsePos < 12;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-registry-teal/5 to-transparent pointer-events-none" />
      
      <VisualHeader 
        title="Pulse-Echo Logic" 
        subtitle="Acoustic Transit Protocol" 
        icon={Target} 
        protocol="03-TRANSIT"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 relative z-10">
        <div className="xl:col-span-2 space-y-8">
          <div className="h-72 md:h-96 bg-stealth-950 rounded-[3rem] relative overflow-hidden flex items-center border-2 border-white/5 shadow-inner group/engine">
            <div className="absolute inset-0 scanline opacity-20" />
            <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
            
            <div className="absolute left-8 flex flex-col space-y-2 z-30">
               <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic border transition-all duration-300 ${isTransmitPhase ? 'bg-registry-rose border-registry-rose/40 text-white shadow-glow-rose' : 'bg-stealth-900 border-white/10 text-slate-500'}`}>TX_ACTIVE</div>
               <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic border transition-all duration-300 ${!isTransmitPhase ? 'bg-registry-teal border-registry-teal/40 text-stealth-950 shadow-glow' : 'bg-stealth-900 border-white/10 text-slate-500'}`}>RX_LISTEN</div>
            </div>

            {/* Transducer Face */}
            <div className="absolute left-0 w-28 h-48 bg-stealth-900 rounded-r-[3.5rem] border-y-2 border-r-2 border-white/10 z-20 flex items-center justify-center shadow-2xl">
               <motion.div 
                animate={{ 
                  backgroundColor: isTransmitPhase ? "#f43f5e" : "#0f172a",
                  boxShadow: isTransmitPhase ? "0 0 50px #f43f5e" : "none"
                }}
                className="w-4 h-32 rounded-full transition-all duration-200" 
               />
            </div>

            {/* Target Interface */}
            <div className="absolute right-16 w-12 h-64 bg-registry-teal/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-16 w-4 h-48 bg-stealth-900 rounded-full border-2 border-white/10 z-10 shadow-inner flex flex-col items-center justify-center space-y-8">
               <div className="w-1.5 h-1.5 bg-registry-teal/30 rounded-full animate-pulse" />
               <div className="w-1.5 h-1.5 bg-registry-teal/30 rounded-full animate-pulse delay-75" />
            </div>

            {/* Wave Animation */}
            <AnimatePresence>
              {isTransmitPhase && (
                <motion.div 
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: [100, 360], opacity: [0, 1, 1, 0], scale: [0.9, 1.3, 1] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute w-20 h-24 flex items-center justify-around pointer-events-none"
                >
                  <div className="w-2.5 h-24 bg-registry-rose rounded-full shadow-glow-rose" />
                  <div className="w-1.5 h-16 bg-registry-rose/40 rounded-full" />
                </motion.div>
              )}
              {!isTransmitPhase && pulsePos > 35 && pulsePos < 85 && (
                <motion.div 
                  initial={{ x: 340, opacity: 0 }}
                  animate={{ x: [340, 100], opacity: [0, 0.8, 0.8, 0], scale: [1.2, 1, 0.6] }}
                  transition={{ duration: 1.2, ease: "linear" }}
                  className="absolute w-16 h-20 flex items-center justify-around pointer-events-none"
                >
                  <div className="w-2 h-20 bg-registry-teal rounded-full shadow-glow" />
                  <div className="w-1 h-14 bg-registry-teal/40 rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-[0.5em] text-slate-700 italic flex items-center space-x-3">
               <Activity className="w-3 h-3" />
               <span>TIMING_CYCLE 0-100</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-8">
           <div className="bg-stealth-950 p-10 rounded-[3rem] border-2 border-white/5 flex flex-col items-center justify-center relative overflow-hidden h-full shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-registry-teal/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 scanline opacity-20" />
              <p className="text-[11px] font-black text-slate-500 uppercase mb-8 tracking-[0.4em] italic drop-shadow-lg text-center">Duty Factor Metric</p>
              
              <div className="relative w-40 h-40">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#0f172a" strokeWidth="16" />
                  <motion.circle 
                    cx="80" cy="80" r="70" fill="none" stroke="#f43f5e" strokeWidth="16"
                    strokeDasharray={`${(12 / 100) * 439.8} 439.8`}
                    className="drop-shadow-glow-rose"
                  />
                  <motion.circle 
                    cx="80" cy="80" r="76" fill="none" stroke="#2dd4bf" strokeWidth="4"
                    animate={{ 
                       strokeDasharray: [`0 477.5`, `${(pulsePos / 100) * 477.5} 477.5`],
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-5xl font-black italic text-white tabular-nums drop-shadow-glow">{pulsePos}</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 italic shadow-glow">Cycle Phase</span>
                </div>
              </div>
              <div className="mt-10 flex items-center space-x-4 bg-white/5 px-6 py-2 rounded-full border border-white/10">
                 <div className={`w-2 h-2 rounded-full ${isTransmitPhase ? 'bg-registry-rose shadow-glow-rose' : 'bg-registry-teal animate-pulse shadow-glow'}`} />
                 <span className="text-[10px] font-black text-white uppercase italic tracking-widest">{isTransmitPhase ? 'TRANSMIT' : 'LISTENING'}</span>
              </div>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Range Equation & Propagation Logic" 
        description="The pulse-echo principle relies on the 13 microsecond rule: in soft tissue, it takes 13µs of round-trip travel time for sound to reach a depth of 1cm. The machine calculates depth by measuring the time-of-flight between the transmitted pulse and the returning captured echo." 
        keyTerms={['transit-time', 'round-trip-time', '13-microsecond-rule', 'duty-factor', 'pulse-repetition-period', 'depth-calibration']}
      />
    </motion.div>
  );
};

export const TemporalResolutionVisual: React.FC = () => {
  const [frameRate, setFrameRate] = useState(30);
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Temporal Sync" 
        subtitle="Frame Acquisition Rate" 
        icon={Timer} 
        protocol="08-TEMPORAL"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 relative z-10">
        <div className="xl:col-span-2 space-y-8">
          <div className="h-72 md:h-96 bg-stealth-950 rounded-[3rem] relative overflow-hidden flex items-center justify-center border-2 border-white/5 shadow-inner group/scope">
            <div className="absolute inset-0 scanline opacity-30 z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-registry-teal/10 to-transparent pointer-events-none" />
            
            <motion.div 
              animate={{ x: [-160, 160, -160] }}
              transition={{ duration: 60 / frameRate, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 bg-gradient-to-br from-registry-teal to-blue-600 border-4 border-white/20 rounded-[2rem] shadow-glow relative z-10 flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 neural-grid opacity-30" />
              <div className="w-12 h-1.5 bg-white shadow-glow rounded-full animate-pulse" />
            </motion.div>
            
            {/* Strobe Effect Simulation */}
            <motion.div 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1/frameRate, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-black/60 pointer-events-none z-30"
            />

            <div className="absolute inset-0 flex justify-around pointer-events-none opacity-20">
               {Array.from({length: 12}).map((_, i) => (
                 <div key={i} className="w-[1px] h-full bg-white/30" />
               ))}
            </div>

            <div className="absolute top-10 left-10 flex flex-col space-y-1 z-40">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">ACQUISITION_TARGET_83</span>
               <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-3.5 bg-registry-teal shadow-glow rounded-full" />
                  <span className="text-[11px] font-black text-white italic uppercase tracking-tighter drop-shadow-lg">HIGH-FIDELITY FLUID_MOTION</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-8">
           <div className="bg-stealth-950 p-10 rounded-[3rem] border-2 border-white/5 flex flex-col items-center justify-center relative overflow-hidden h-full shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-registry-teal/10 to-transparent pointer-events-none opacity-40" />
              <div className="absolute inset-0 scanline opacity-20" />
              
              <p className="text-[11px] font-black text-slate-500 uppercase mb-4 tracking-[0.4em] italic drop-shadow-lg text-center">Frames Per Second</p>
              <div className="text-7xl font-black italic text-registry-teal tabular-nums mb-10 shadow-glow drop-shadow-glow">
                {frameRate}<span className="text-xl ml-2 opacity-40 font-mono">HZ</span>
              </div>

              <div className="w-full space-y-6 pt-10 border-t border-white/10">
                <div className="flex justify-between items-end">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] italic">Scan Line Density</label>
                   <span className={`text-[11px] font-black italic uppercase ${frameRate > 24 ? 'text-registry-teal' : 'text-registry-rose shadow-glow-rose'}`}>
                     {frameRate > 24 ? 'High Frequency' : 'Low Velocity Sync'}
                   </span>
                </div>
                <div className="relative h-10 flex items-center">
                   <div className="absolute inset-x-0 h-2 bg-slate-900 rounded-full shadow-inner" />
                   <motion.div 
                    className="absolute h-2 bg-registry-teal rounded-full shadow-glow"
                    initial={false}
                    animate={{ width: `${(frameRate / 60) * 100}%` }}
                   />
                   <input 
                    type="range" 
                    min="4" max="60" 
                    step="2"
                    value={frameRate} 
                    onChange={e => setFrameRate(Number(e.target.value))} 
                    className="relative w-full h-8 bg-transparent appearance-none cursor-pointer z-10 accent-white" 
                   />
                </div>
              </div>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="The Temporal Matrix" 
        description="Temporal resolution is accuracy in time. It is directly tied to the frame rate. To maximize temporal resolution for cardiac or fetal studies, one must sacrifice spatial resolution by reducing scan line density, focal zones, or sector width." 
        keyTerms={['frame-rate', 'temporal-resolution', 'prf', 'sector-width', 'line-density', 'depth-of-field']}
      />
    </motion.div>
  );
};

export const DampingResolutionExplainer: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Crystal Damping" 
        subtitle="Axial Precision Logic" 
        icon={Layers} 
        protocol="04-DAMP"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        <div className="bg-stealth-950 rounded-[3rem] p-10 border-2 border-white/5 flex flex-col items-center justify-between shadow-inner relative group/card">
           <div className="absolute inset-0 bg-gradient-to-br from-registry-rose/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
           <p className="text-[11px] font-black uppercase tracking-[0.3em] text-registry-rose mb-10 italic shadow-glow-rose">Continuous / Un-Damped</p>
           <div className="h-32 w-full flex items-center justify-center">
             <svg className="w-full h-full" viewBox="0 0 100 50">
               <motion.path 
                 d="M 0 25 Q 10 5 20 25 Q 30 45 40 25 Q 50 5 60 25 Q 70 45 80 25 Q 90 5 100 25" 
                 stroke="#f43f5e" strokeWidth="3" fill="none" 
                 animate={{ pathLength: [0, 1], opacity: [0.4, 0.9, 0.4] }}
                 transition={{ duration: 2, repeat: Infinity }}
               />
             </svg>
           </div>
           <div className="mt-10 flex items-center space-x-3 bg-white/5 px-6 py-2 rounded-full border border-white/10">
             <div className="w-2.5 h-2.5 rounded-full bg-registry-rose animate-ping" />
             <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest italic">High Q-Factor / Blurr</span>
           </div>
        </div>

        <div className="bg-stealth-950 rounded-[3rem] p-10 border-2 border-registry-teal/20 flex flex-col items-center justify-between shadow-glow shadow-registry-teal/5 relative group/card">
           <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
           <p className="text-[11px] font-black uppercase tracking-[0.3em] text-registry-teal mb-10 italic shadow-glow">Precision Damping Active</p>
           <div className="h-32 w-full flex items-center justify-center">
             <svg className="w-full h-full" viewBox="0 0 100 50">
               <motion.path 
                 d="M 5 25 Q 15 5 25 25 Q 35 45 45 25" 
                 stroke="#22d3ee" strokeWidth="5" fill="none" 
                 animate={{ pathLength: [0, 1], opacity: [0.7, 1, 0.7] }}
                 transition={{ duration: 1.2, repeat: Infinity }}
                 className="shadow-glow"
               />
             </svg>
           </div>
           <div className="mt-10 flex items-center space-x-3 bg-registry-teal/20 px-6 py-2 rounded-full border border-registry-teal/40 shadow-glow">
             <div className="w-2.5 h-2.5 rounded-full bg-registry-teal shadow-glow" />
             <span className="text-[11px] font-black uppercase text-white tracking-widest italic drop-shadow-lg">Low Q / High Axial Res</span>
          </div>
        </div>
      </div>

      <VisualInsight 
        title="Axial Resolution Synthesis" 
        description="The backing material behind the PZT crystals (damping) is critical for imaging. By absorbing vibrations quickly, it reduces the length of the sound pulse. Shorter pulses lead to better Axial Resolution, defined as the system's ability to display two reflectors as separate when they are parallel to the sound beam's axis." 
        keyTerms={['damping', 'axial-resolution', 'spatial-pulse-length', 'q-factor', 'pulse-duration', 'backing-material']}
      />
    </motion.div>
  );
};

export const QAPhantomVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="System Verification" 
        subtitle="Diagnostic QA Phantom" 
        icon={Database} 
        protocol="07-QA"
      />

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] relative overflow-hidden border-2 border-white/5 p-8 shadow-inner group/display">
        <div className="absolute inset-0 scanline opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-registry-teal/5 to-transparent pointer-events-none" />
        
        <div className="grid grid-cols-4 gap-6 h-full relative z-10">
           {[
             { label: 'Dead Zone', color: 'bg-registry-rose', content: <div className="flex-1 bg-white/5 rounded-2xl border-t-8 border-registry-rose shadow-glow-rose" /> },
             { label: 'Axial Pins', color: 'bg-white', content: (
               <div className="flex-1 flex flex-col items-center justify-around py-4">
                  <div className="w-2 h-2 bg-white rounded-full shadow-glow" />
                  <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-white rounded-full shadow-glow" />
                  <div className="w-2 h-2 bg-white rounded-full shadow-glow" />
               </div>
             )},
             { label: 'Cyst Mock', color: 'bg-registry-teal', content: (
               <div className="flex-1 flex flex-col items-center justify-around py-4">
                  <div className="w-8 h-8 rounded-full border-2 border-registry-teal/30 hover:shadow-glow-teal transition-all" />
                  <div className="w-10 h-10 rounded-full border-2 border-registry-teal/40 bg-registry-teal/10 shadow-glow" />
               </div>
             )},
             { label: 'Sensitivity', color: 'bg-registry-amber', content: <div className="flex-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-2xl border-x border-white/5" /> }
           ].map((item, idx) => (
             <motion.div 
               key={idx}
               whileHover={{ scale: 1.05, y: -5 }}
               className="bg-stealth-900/60 rounded-[2rem] border border-white/10 flex flex-col p-6 space-y-4 shadow-2xl transition-all"
             >
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center italic">{item.label}</span>
                {item.content}
             </motion.div>
           ))}
        </div>

        <div className="absolute top-4 left-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Calibration Unit-B</span>
        </div>
      </div>

      <VisualInsight 
        title="Quality Assurance Physics" 
        description="Acoustic Phantoms are essential for clinical calibration. They use tissue-mimicking material (1540m/s speed, 0.5dB/cm/MHz attenuation) to verify that the scanner's digital measurements match physical reality. The dead zone, pins, and cysts evaluate the smallest distance the system can resolve at various depths." 
        keyTerms={['phantom', 'attenuation-coefficient', 'soft-tissue-mimic', 'dead-zone', 'sensitivity', 'resolution-testing']}
      />
    </motion.div>
  );
};

export const TransducerCrossSection: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Transducer Anatomy" 
        subtitle="Internal Architecture Matrix" 
        icon={Cpu} 
        protocol="01-PROBE"
      />

      <div className="h-72 md:h-96 bg-stealth-950 rounded-[3rem] relative overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-inner group/scope px-12">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <svg className="w-full h-full max-w-lg" viewBox="0 0 400 300">
           {/* Acoustic Lens */}
           <rect x="340" y="50" width="20" height="200" fill="#2dd4bf" fillOpacity="0.2" rx="4" />
           <text x="350" y="270" textAnchor="middle" fill="#2dd4bf" className="text-[10px] font-black uppercase italic opacity-60">Lens</text>

           {/* Matching Layer */}
           <rect x="310" y="50" width="30" height="200" fill="#2dd4bf" fillOpacity="0.4" rx="2" />
           <text x="325" y="270" textAnchor="middle" fill="#2dd4bf" className="text-[10px] font-black uppercase italic opacity-80">Match</text>

           {/* PZT Crystal */}
           <motion.rect 
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            x="290" y="60" width="20" height="180" fill="#f43f5e" rx="2" className="shadow-glow-rose shadow-rose-500/50" />
           <text x="300" y="270" textAnchor="middle" fill="#f43f5e" className="text-[10px] font-black uppercase italic">PZT</text>

           {/* Backing Material */}
           <rect x="150" y="60" width="140" height="180" fill="#1e293b" fillOpacity="0.8" rx="4" stroke="white" strokeOpacity="0.1" />
           <text x="220" y="155" textAnchor="middle" fill="white" className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">Damping Core</text>

           {/* Housing */}
           <rect x="50" y="20" width="100" height="260" fill="#0f172a" rx="10" stroke="white" strokeOpacity="0.2" />
           <text x="100" y="270" textAnchor="middle" fill="white" className="text-[10px] font-black uppercase italic opacity-40">Housing</text>

           {/* Electrical Shield */}
           <rect x="40" y="15" width="320" height="270" fill="none" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="10 5" opacity="0.1" rx="15" />
        </svg>
      </div>

      <VisualInsight 
        title="Hardware Components" 
        description="The PZT crystal converts energy. The Damping material (backing) stops the crystal from ringing, improving axial resolution. The Matching Layer bridges the impedance gap between the crystal and the patient's skin, which is why we also use ultrasound gel." 
        keyTerms={['pzt', 'backing-material', 'matching-layer', 'housing', 'internal-shield']}
      />
    </motion.div>
  );
};

export const TGCVisual = ReceiverPipelineVisual;
export const DynamicRangeVisual = ReceiverPipelineVisual;
export const DemodulationVisual = ReceiverPipelineVisual;
export const ScanConverterVisual = ReceiverPipelineVisual;
export const DutyFactorVisual = PulseEchoPrincipleVisual;
