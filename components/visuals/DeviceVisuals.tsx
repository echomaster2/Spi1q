import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Activity, Info, Loader2, Volume2, Sparkles, Book, Zap, AlertCircle, Cpu, Database, Monitor, Eye, EyeOff, Target, MinusSquare, Layers, Waves, X, Timer } from 'lucide-react';
import { generateSpeech } from '../../src/services/aiService';
import { decodeBase64, pcmToWav } from '../../src/lib/audioUtils';
import { CompanionAvatar } from '../CompanionAvatar';
import { GrainOverlay, ScanlineOverlay } from './UtilityVisuals';
import { VisualInsight } from './BaseVisuals';

// --- DEVICE & HANDLER VISUALS ---

export const ReceiverPipelineVisual: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { 
      name: "Amp", 
      icon: Zap, 
      color: "text-registry-cobalt",
      desc: "Amplification: Increases the strength of all returning signals equally. Also called Receiver Gain.",
      signal: (
        <g>
          <motion.path 
            animate={{ strokeWidth: [1, 2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 50 100 Q 75 80 100 100 Q 125 120 150 100" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4" 
          />
          <motion.path 
            animate={{ scaleY: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 250 100 Q 275 40 300 100 Q 325 160 350 100" fill="none" stroke="#3b82f6" strokeWidth="3" 
          />
          <text x="100" y="150" textAnchor="middle" fill="#3b82f6" className="text-[11px] font-black uppercase tracking-widest">Weak Input</text>
          <text x="300" y="180" textAnchor="middle" fill="#3b82f6" className="text-[11px] font-black uppercase tracking-widest">Amplified Output</text>
          <path d="M 170 100 L 230 100" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
        </g>
      )
    },
    { 
      name: "Comp", 
      icon: Layers, 
      color: "text-registry-teal",
      desc: "Compensation: Corrects for attenuation by amplifying deeper echoes more than shallow ones. (TGC).",
      signal: (
        <g>
          <motion.path 
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 50 100 Q 75 60 100 100 Q 125 140 150 100" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.4" 
          />
          <motion.path 
            animate={{ strokeWidth: [2, 4, 2] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 250 100 Q 275 60 300 100 Q 325 140 350 100" fill="none" stroke="#22d3ee" strokeWidth="2" 
          />
          <text x="100" y="150" textAnchor="middle" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest">Deep Echo (Weak)</text>
          <text x="300" y="180" textAnchor="middle" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest">Compensated (Uniform)</text>
          <path d="M 170 100 L 230 100" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#arrow)" />
        </g>
      )
    },
    { 
      name: "Dyn", 
      icon: Search, 
      color: "text-cyan-500",
      desc: "Compression: Reduces the range of signals to fit within the system's dynamic range and human vision.",
      signal: (
        <g>
          <motion.rect 
            animate={{ height: [120, 140, 120], y: [40, 30, 40] }}
            transition={{ duration: 3, repeat: Infinity }}
            x="50" y="40" width="100" height="120" fill="#06b6d420" stroke="#06b6d4" strokeWidth="1" 
          />
          <motion.rect 
            animate={{ height: [60, 50, 60], y: [70, 75, 70] }}
            transition={{ duration: 3, repeat: Infinity }}
            x="250" y="70" width="100" height="60" fill="#06b6d440" stroke="#06b6d4" strokeWidth="2" 
          />
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" className="text-[11px] font-black uppercase tracking-widest">Wide Range</text>
          <text x="300" y="150" textAnchor="middle" fill="#06b6d4" className="text-[11px] font-black uppercase tracking-widest">Compressed</text>
          <path d="M 170 100 L 230 100" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" />
        </g>
      )
    },
    { 
      name: "Demo", 
      icon: Waves, 
      color: "text-registry-teal",
      desc: "Demodulation: Converts the radio frequency (RF) signal into a video signal (Rectification & Smoothing).",
      signal: (
        <g>
          <motion.path 
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            d="M 50 100 L 60 80 L 70 120 L 80 70 L 90 130 L 100 100" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.4" strokeDasharray="4 2"
          />
          <motion.path 
            animate={{ strokeWidth: [3, 5, 3] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 250 100 Q 275 60 300 70 Q 325 80 350 100" fill="none" stroke="#22d3ee" strokeWidth="3" 
          />
          <text x="75" y="150" textAnchor="middle" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest">RF Signal</text>
          <text x="300" y="130" textAnchor="middle" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest">Video Signal</text>
          <path d="M 170 100 L 230 100" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#arrow)" />
        </g>
      )
    },
    { 
      name: "Rej", 
      icon: X, 
      color: "text-registry-rose",
      desc: "Rejection: Eliminates low-level noise that is below a certain threshold to clean up the image.",
      signal: (
        <g>
          <motion.path 
            animate={{ opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            d="M 50 100 L 60 95 L 70 105 L 80 98 L 90 102 L 100 100" fill="none" stroke="#f43f5e" strokeWidth="1" opacity="0.4" 
          />
          <motion.line 
            animate={{ strokeWidth: [3, 1, 3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            x1="250" y1="100" x2="350" y2="100" stroke="#f43f5e" strokeWidth="3" 
          />
          <text x="75" y="130" textAnchor="middle" fill="#f43f5e" className="text-[11px] font-black uppercase tracking-widest">Low Noise</text>
          <text x="300" y="130" textAnchor="middle" fill="#f43f5e" className="text-[11px] font-black uppercase tracking-widest">Rejected</text>
          <path d="M 170 100 L 230 100" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow)" />
        </g>
      )
    },
  ];

  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-registry-teal" />
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Receiver Pipeline</span>
        </div>
        <div className="flex space-x-1">
          {steps.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i <= activeStep ? 'bg-registry-teal' : 'bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl relative z-10 overflow-x-auto scrollbar-hide">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className={`flex-1 min-w-[80px] py-3 rounded-xl flex flex-col items-center space-y-1 transition-all ${activeStep === i ? 'bg-white dark:bg-slate-800 shadow-lg scale-105' : 'opacity-50 hover:opacity-80'}`}
          >
            <step.icon className={`w-4 h-4 ${step.color}`} />
            <span className="text-[11px] font-black uppercase tracking-tighter">{step.name}</span>
          </button>
        ))}
      </div>

      <div className="h-48 md:h-64 bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden shadow-inner group/viz">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="currentColor" />
            </marker>
          </defs>
          <AnimatePresence mode="wait">
            <motion.g
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[activeStep].signal}
            </motion.g>
          </AnimatePresence>
        </svg>
      </div>

      <div className="relative z-10">
        <VisualInsight 
          title={steps[activeStep].name} 
          description={steps[activeStep].desc} 
        />
      </div>
    </div>
  );
};

export const PrePostProcessingVisual: React.FC = () => {
  const [isPost, setIsPost] = useState(false);
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 relative overflow-hidden group"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-registry-teal/10 rounded-xl border border-registry-teal/20">
            <Cpu className="w-5 h-5 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-white leading-none">Signal Processing</h4>
            <p className="text-[11px] font-black text-registry-teal uppercase tracking-widest mt-1">Pre vs Post Matrix</p>
          </div>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setIsPost(false)}
            className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${!isPost ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Pre
          </button>
          <button 
            onClick={() => setIsPost(true)}
            className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all ${isPost ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Post
          </button>
        </div>
      </div>

      <div className="h-48 md:h-64 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 relative z-10 shadow-inner flex items-center justify-center p-8">
        <div className="absolute inset-0 scanline opacity-10" />
        
        <AnimatePresence mode="wait">
          {!isPost ? (
            <motion.div 
              key="pre"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center space-y-2">
                   <div className="w-12 h-12 rounded-2xl bg-registry-teal/20 flex items-center justify-center border border-registry-teal/30">
                    <Waves className="w-6 h-6 text-registry-teal" />
                  </div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Analog Signal</span>
                </div>
                <motion.div 
                  animate={{ x: [0, 100], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-0.5 w-24 bg-gradient-to-r from-registry-teal to-transparent"
                />
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-registry-teal/20 flex items-center justify-center border border-registry-teal/30">
                    <Database className="w-6 h-6 text-registry-teal" />
                  </div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Scan Converter</span>
                </div>
              </div>
              <div className="p-4 bg-registry-teal/5 border border-registry-teal/10 rounded-2xl text-center">
                <p className="text-[11px] font-black text-registry-teal uppercase tracking-widest">Live Data Stream</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="post"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-6"
            >
              <div className="flex items-center justify-between">
                 <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-registry-rose/20 flex items-center justify-center border border-registry-rose/30">
                    <Database className="w-6 h-6 text-registry-rose" />
                  </div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Stored Data</span>
                </div>
                <motion.div 
                  animate={{ x: [-100, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-0.5 w-24 bg-gradient-to-l from-registry-rose to-transparent"
                />
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-registry-rose/20 flex items-center justify-center border border-registry-rose/30">
                    <Monitor className="w-6 h-6 text-registry-rose" />
                  </div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Display Output</span>
                </div>
              </div>
              <div className="p-4 bg-registry-rose/5 border border-registry-rose/10 rounded-2xl text-center">
                <p className="text-[11px] font-black text-registry-rose uppercase tracking-widest">Frozen Data</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className={`p-4 rounded-2xl border transition-all ${!isPost ? 'bg-registry-teal/10 border-registry-teal/30' : 'bg-slate-900 border-white/5 opacity-40'}`}>
          <h5 className="text-[11px] font-black uppercase text-registry-teal mb-2">Pre-Processing</h5>
          <ul className="text-[11px] font-bold text-slate-400 space-y-1">
            <li>• TGC / Gain</li>
            <li>• Write Zoom</li>
          </ul>
        </div>
        <div className={`p-4 rounded-2xl border transition-all ${isPost ? 'bg-registry-rose/10 border-registry-rose/30' : 'bg-slate-900 border-white/5 opacity-40'}`}>
          <h5 className="text-[11px] font-black uppercase text-registry-rose mb-2">Post-Processing</h5>
          <ul className="text-[11px] font-bold text-slate-400 space-y-1">
            <li>• Read Zoom</li>
            <li>• B-Color Maps</li>
          </ul>
        </div>
      </div>

      <VisualInsight 
        title="Processing Matrix" 
        description={!isPost 
          ? "Pre-processing occurs before data is stored. These changes are permanent." 
          : "Post-processing occurs after storage. These changes can be applied to frozen images."} 
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
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] relative z-10 mb-8 border border-white/5 shadow-inner">
        {(['linear', 'curved', 'phased'] as const).map(t => (
          <button 
            key={t} 
            onClick={() => setType(t)} 
            className={`flex-1 py-3 px-6 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 ${type === t ? 'bg-registry-teal text-stealth-950 shadow-glow-teal' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t} Array
          </button>
        ))}
      </div>

      <div className="h-64 md:h-80 bg-black rounded-[2.5rem] overflow-hidden border border-slate-800 flex items-start justify-center p-8 relative shadow-2xl">
        <div className="absolute inset-0 scanline opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
           <Layers className="w-64 h-64 text-registry-teal blur-3xl" />
        </div>

        <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>

          {type === 'linear' && (
            <g>
              {Array.from({length: 24}).map((_, i) => (
                <motion.path 
                  key={i} 
                  d={`M ${80 + i*10} 20 L ${80 + i*10} 180`}
                  stroke="url(#beamGrad)"
                  strokeWidth="3" 
                  initial={false}
                  animate={{ 
                    opacity: (scanIndex === i || scanIndex === i-1 || scanIndex === i+1) ? 1 : 0.05,
                    strokeWidth: (scanIndex === i) ? 5 : 2
                  }}
                  className="transition-all duration-300"
                />
              ))}
              <rect x="75" y="10" width="250" height="12" fill="#1e293b" rx="4" className="stroke-white/20" />
            </g>
          )}

          {type === 'curved' && (
            <g>
              {Array.from({length: 24}).map((_, i) => {
                const ang = (i - 11.5) * 0.06;
                const r1 = 30;
                const r2 = 200;
                return (
                  <motion.path 
                    key={i} 
                    d={`M ${200 + Math.sin(ang)*r1} ${20 + Math.cos(ang)*r1 - 20} L ${200 + Math.sin(ang)*r2} ${20 + Math.cos(ang)*r2 - 20}`}
                    stroke="url(#beamGrad)"
                    strokeWidth="3" 
                    animate={{ 
                      opacity: (scanIndex === i || scanIndex === i-1 || scanIndex === i+1) ? 1 : 0.05 
                    }}
                  />
                );
              })}
              <path d="M 120 40 Q 200 10 280 40" fill="none" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" className="opacity-80" />
            </g>
          )}

          {type === 'phased' && (
            <g>
              {Array.from({length: 24}).map((_, i) => {
                const centerAng = Math.sin(scanIndex * 0.2) * 0.6;
                const beamAng = centerAng + (i - 11.5) * 0.01;
                return (
                  <motion.line 
                    key={i} 
                    x1="200" y1="20" 
                    x2={200 + Math.sin(beamAng)*180} y2={20 + Math.cos(beamAng)*180} 
                    stroke="url(#beamGrad)"
                    strokeWidth="2" 
                    animate={{ opacity: 0.2 + (Math.abs(Math.sin(scanIndex*0.1)) * 0.8) }}
                  />
                );
              })}
              <rect x="180" y="10" width="40" height="12" fill="#1e293b" rx="2" className="stroke-white/20" />
            </g>
          )}
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 relative z-10">
        <div className="premium-glass p-5 rounded-3xl border border-white/5">
          <p className="text-[11px] font-black uppercase text-registry-teal mb-2">Image Shape</p>
          <p className="text-xs font-bold text-white italic">
            {type === 'linear' ? "Rectangular" : type === 'curved' ? "Blunted Sector" : "True Sector"}
          </p>
        </div>
        <div className="premium-glass p-5 rounded-3xl border border-white/5">
          <p className="text-[11px] font-black uppercase text-registry-teal mb-2">Primary Use-Case</p>
          <p className="text-xs font-bold text-white italic">
            {type === 'linear' ? "Vascular & Small Parts" : type === 'curved' ? "Abdominal & OB/GYN" : "Cardiac & Intercostal"}
          </p>
        </div>
      </div>

      <VisualInsight 
        title={`${type.charAt(0).toUpperCase() + type.slice(1)} Array Configuration`} 
        description={type === 'linear' ? "Crystals are arranged in a straight line and fired in small groups (sequencing) to create a parallel-beam rectangular image. Excellent for high-resolution near-field imaging." : type === 'curved' ? "Also known as Convex arrays. The naturally curved footprint creates a wide field of view in the far-field without much manipulation." : "The small footprint allows imaging between ribs. All crystals are fired nearly simultaneously with variable time delays (phasing) to steer and focus the beam."} 
      />
    </div>
  );
};

export const SideLobeVisual: React.FC = () => {
  const [showArtifacts, setShowArtifacts] = useState(true);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 rounded-[2rem] border border-white/5 shadow-xl space-y-4 transition-all hover:shadow-registry-teal/10 p-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-registry-teal/10 rounded-xl border border-registry-teal/20">
            <Target className="w-5 h-5 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Beam Profile</h4>
            <p className="text-[11px] font-black text-registry-teal uppercase tracking-widest mt-1">Energy Divergence</p>
          </div>
        </div>
        <button 
          onClick={() => setShowArtifacts(!showArtifacts)} 
          className={`p-2 rounded-xl transition-all ${showArtifacts ? 'bg-registry-teal text-stealth-950' : 'bg-stealth-950 text-slate-500'}`}
        >
           {showArtifacts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      <div className="h-48 md:h-64 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <motion.path 
            d="M 180 20 Q 200 220 220 20" 
            fill="url(#mainLobeGrad)" 
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <defs>
            <linearGradient id="mainLobeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="sideLobeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </linearGradient>
          </defs>

          {showArtifacts && (
            <g>
              <motion.path 
                d="M 180 20 Q 120 120 170 20" 
                fill="url(#sideLobeGrad)"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.path 
                d="M 220 20 Q 280 120 230 20" 
                fill="url(#sideLobeGrad)"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
              <motion.circle 
                cx={130} cy={100} r={6} 
                fill="#f43f5e" 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </g>
          )}

          <rect x="170" y="10" width="60" height="10" fill="#1e293b" rx="2" />
        </svg>
      </div>

      <VisualInsight 
        title="Side Lobes" 
        description="Side lobes are secondary beams that diverge from the main axis. They can cause artifacts where off-axis structures appear as if they are within the main beam." 
      />
    </motion.div>
  );
};

export const DeadZoneVisual: React.FC = () => {
  const [damping, setDamping] = useState(50);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 200);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 rounded-[2rem] border border-white/5 shadow-xl space-y-4 transition-all hover:shadow-registry-rose/10 p-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-registry-rose/10 rounded-xl border border-registry-rose/20">
            <MinusSquare className="w-5 h-5 text-registry-rose" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Dead Zone</h4>
            <p className="text-[11px] font-black text-registry-rose uppercase tracking-widest mt-1">PZT Ring-Down</p>
          </div>
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        <motion.div 
          animate={isPulsing ? { scaleY: [1, 0.9, 1.1, 1], backgroundColor: ["#1e293b", "#f43f5e", "#1e293b"] } : {}}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 border-b-2 border-registry-rose/50 rounded-b-lg z-20"
        />
        <motion.div 
          animate={isPulsing ? { 
            height: [`${10 + (100 - damping) / 4}%`, `${30 + (100 - damping) / 2}%`, `${10 + (100 - damping) / 4}%`],
            opacity: [0.2, 0.5, 0.2]
          } : {
            height: `${20 + (100 - damping) / 2.5}%`,
            opacity: 0.3
          }}
          className="absolute top-6 left-0 w-full bg-gradient-to-b from-registry-rose/40 to-transparent border-b border-registry-rose/20 transition-all duration-500"
        />
      </div>

      <div className="space-y-2">
        <input 
          type="range" min="10" max="90" 
          value={damping} 
          onChange={e => setDamping(Number(e.target.value))} 
          className="w-full h-1.5 accent-registry-rose bg-slate-800 rounded-lg appearance-none cursor-pointer" 
        />
      </div>

      <VisualInsight 
        title="The Dead Zone" 
        description="The Dead Zone is the region closest to the transducer where imaging is impossible. It occurs because the crystal is still vibrating from the transmit pulse." 
      />
    </motion.div>
  );
};

export const TransducerCrossSection: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex items-center space-x-4 relative z-10">
        <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/30 shadow-glow">
          <Layers className="w-6 h-6 text-registry-teal" />
        </div>
        <div>
          <h4 className="text-xl font-black uppercase italic text-white leading-none">Transducer Anatomy</h4>
          <p className="text-[11px] font-black text-registry-teal uppercase tracking-[0.3em] mt-2">Internal Component Stack</p>
        </div>
      </div>

      <div className="h-72 md:h-80 bg-slate-950 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center border border-slate-800 shadow-inner space-y-1.5 p-10">
        <div className="absolute inset-0 scanline opacity-10" />

        {/* Backing Material */}
        <motion.div 
          animate={isActive ? { y: [-2, 0] } : {}}
          className="w-56 h-12 bg-slate-700/40 border border-white/10 rounded-t-3xl flex items-center justify-center relative group/backing"
        >
          <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Backing Material</span>
          <div className="absolute top-0 right-0 p-2 opacity-20"><MinusSquare className="w-4 h-4" /></div>
        </motion.div>

        {/* PZT Crystal - The heart */}
        <motion.div 
          animate={isActive ? { 
            scaleY: [1, 1.15, 0.9, 1], 
            backgroundColor: ["#f43f5e", "#ff4d6d", "#f43f5e"] 
          } : {}}
          transition={{ duration: 0.3 }}
          className="w-56 h-16 bg-registry-rose border-x-8 border-registry-rose/50 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.3)] relative z-20"
        >
          <span className="text-xs font-black uppercase text-white tracking-[0.3em]">PZT CRYSTAL</span>
          <p className="text-[11px] font-black text-white/60 uppercase animate-pulse">Piezoelectric Core</p>
        </motion.div>

        {/* Matching Layer */}
        <div className="w-56 h-6 bg-registry-teal/40 border border-registry-teal/30 flex items-center justify-center relative">
          <span className="text-[11px] font-black uppercase text-registry-teal tracking-widest">Matching Layer (1/4 λ)</span>
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 h-px w-10 bg-registry-teal/30" />
        </div>

        {/* Acoustic Gel */}
        <div className="w-56 h-3 bg-blue-400/20 border-b border-x border-blue-400/30 rounded-b-3xl flex items-center justify-center opacity-60">
          <span className="text-[11px] font-black uppercase text-blue-400 tracking-tighter">Acoustic Coupling Gel</span>
        </div>

        {/* Emitted Pulse Wave */}
        <AnimatePresence>
          {isActive && (
            <motion.div 
              initial={{ y: -20, opacity: 0, scaleX: 0.8 }}
              animate={{ y: 150, opacity: [0, 1, 0], scaleX: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute bottom-10 w-48 h-8 flex flex-col justify-between"
            >
               {Array.from({ length: 3 }).map((_, i) => (
                 <div key={i} className="w-full h-1 bg-registry-teal/50 rounded-full shadow-glow" />
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="premium-glass p-6 rounded-3xl border tech-border relative z-10">
        <h5 className="text-[11px] font-black uppercase text-white mb-3">Impedance Matching</h5>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
          The <span className="text-registry-teal">Matching Layer</span> has an impedance between the PZT and the tissue. This prevents 99% of the sound from reflecting back at the skin surface. The <span className="text-registry-rose">Backing Material</span> limits "ring down", creating short pulses which are critical for high Axial Resolution.
        </p>
      </div>

      <VisualInsight 
        title="Piezoelectric Translation" 
        description="The Lead Zirconate Titanate (PZT) crystal converts electricity into sound (transmit) and sound back into electricity (receive). By applying an electrical pulse, the crystal physically deforms, creating a mechanical pressure wave that travel through the body." 
      />
    </motion.div>
  );
};

export const PulseEchoPrincipleVisual: React.FC = () => {
  const [pulsePos, setPulsePos] = useState(0);
  const [isTransmitting, setIsTransmitting] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePos(prev => (prev + 2) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Cycle states: 0-10 Transmit, 10-100 Listen
  const cycleProgress = pulsePos;
  const isTransmitPhase = cycleProgress < 10;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-registry-teal/10 rounded-xl border border-registry-teal/20 shadow-glow">
                <Target className="w-5 h-5 text-registry-teal" />
              </div>
              <h4 className="text-xl font-black uppercase italic text-white">Pulse-Echo Principle</h4>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase transition-all duration-300 ${isTransmitPhase ? 'bg-registry-rose text-white shadow-glow-rose' : 'bg-registry-teal text-stealth-950 shadow-glow'}`}>
              {isTransmitPhase ? 'TALKING' : 'LISTENING'}
            </div>
          </div>

          <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center border border-slate-800 shadow-inner">
            <div className="absolute inset-0 scanline opacity-10" />
            
            {/* Transducer Face */}
            <div className="absolute left-0 w-16 h-28 bg-slate-800 rounded-r-3xl border-y border-r border-white/10 z-20 flex items-center justify-center">
               <div className={`w-2 h-16 rounded-full transition-colors duration-200 ${isTransmitPhase ? 'bg-registry-rose shadow-glow-rose' : 'bg-slate-700'}`} />
            </div>

            {/* Target Reflector */}
            <div className="absolute right-12 w-4 h-32 bg-slate-700/30 rounded-full border border-white/5 blur-sm" />
            <div className="absolute right-12 w-2 h-24 bg-slate-700 rounded-full border border-white/10 z-10" />

            {/* Wave Animation */}
            <AnimatePresence>
              {isTransmitPhase && (
                <motion.div 
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: [60, 320], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.5, ease: "linear" }}
                  className="absolute w-12 h-16 flex items-center justify-around"
                >
                  <div className="w-1.5 h-16 bg-registry-rose rounded-full shadow-glow-rose" />
                  <div className="w-1.5 h-12 bg-registry-rose/60 rounded-full" />
                </motion.div>
              )}
              {!isTransmitPhase && pulsePos > 25 && pulsePos < 65 && (
                <motion.div 
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: [300, 60], opacity: [0, 0.4, 0.4, 0] }}
                  transition={{ duration: 0.8, ease: "linear" }}
                  className="absolute w-8 h-12 flex items-center justify-around"
                >
                  <div className="w-1 h-12 bg-registry-teal/40 rounded-full shadow-glow" />
                  <div className="w-1 h-10 bg-registry-teal/20 rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
              Acoustic Flight Path
            </div>
          </div>
        </div>

        <div className="w-full lg:w-48 flex flex-col justify-between space-y-4">
           <div className="bg-slate-950 p-4 rounded-3xl border border-white/5 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 radial-gradient opacity-20" />
             <p className="text-[11px] font-black text-slate-500 uppercase mb-4 tracking-widest">Duty Cycle</p>
             <svg className="w-24 h-24 rotate-[-90deg]">
               <circle cx="48" cy="48" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
               <motion.circle 
                 cx="48" cy="48" r="40" fill="none" stroke="#f43f5e" strokeWidth="8"
                 strokeDasharray={`${(10 / 100) * 251.2} 251.2`}
                 className="drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"
               />
               <motion.circle 
                 cx="48" cy="48" r="46" fill="none" stroke="#22d3ee" strokeWidth="2"
                 animate={{ strokeDasharray: [`0 289`, `${(cycleProgress / 100) * 289} 289`] }}
               />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-8">
                <span className="text-xl font-black italic text-white">{cycleProgress}%</span>
             </div>
           </div>

           <div className="premium-glass p-4 rounded-3xl border border-white/5 space-y-1">
              <p className="text-[11px] font-black text-registry-teal uppercase tracking-widest">PROP. SPEED</p>
              <p className="text-xs font-bold text-white italic">1,540 m/s</p>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Range Equation Dynamics" 
        description="The system uses the '13 microsecond rule': it takes 13µs to travel 1cm to a reflector and back in soft tissue. By timing this delay precisely, the scanner places the pixel at the exact anatomical depth. Rememeber: Transmit time is minuscule (<1%), while Receiving takes up 99% of the ultrasound's life!" 
      />
    </motion.div>
  );
};

export const DutyFactorVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6"
    >
      <div className="flex items-center space-x-3">
        <Timer className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Duty Factor</h4>
      </div>
      <div className="h-32 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center border border-slate-800">
        <div className="w-full flex space-x-4 px-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="flex-1 flex items-end h-20 space-x-1">
               <motion.div 
                 animate={{ opacity: [1, 0.5, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="w-4 h-full bg-registry-teal rounded-sm"
               />
               <div className="flex-1 h-0.5 bg-slate-800 mb-0" />
             </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-2 text-center text-[11px] font-black uppercase text-slate-500">Pulse Duration / PRP</div>
      </div>
      <VisualInsight 
        title="Duty Factor" 
        description="Duty Factor = Pulse Duration / pulse repetition period (PRP). For clinical imaging, it is typically < 1% (meaning the system listens 99% of the time)." 
      />
    </motion.div>
  );
};

export const BandwidthVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4"
    >
      <div className="flex items-center space-x-3">
        <Search className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Bandwidth & Q-Factor</h4>
      </div>
      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-800">
        <svg className="w-full h-full" viewBox="0 0 400 150">
          <motion.path 
            d="M 100 130 Q 200 30 300 130" 
            fill="none" 
            stroke="#22d3ee" 
            strokeWidth="3"
            animate={{ strokeWidth: [3, 5, 3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <line x1="140" y1="100" x2="260" y2="100" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 2" />
          <text x="200" y="95" textAnchor="middle" fill="#f43f5e" className="text-[11px] font-black uppercase">Bandwidth</text>
        </svg>
      </div>
      <VisualInsight 
        title="Wide Bandwidth" 
        description="Imaging transducers use damping to create short pulses, which results in a wide range of frequencies (Wide Bandwidth) and low quality factor (Low Q)." 
      />
    </motion.div>
  );
};

export const BeamFocusingVisual: React.FC = () => {
  const [focalDepth, setFocalDepth] = useState(100);
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4"
    >
      <div className="flex items-center space-x-3">
        <Target className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Focusing Mechanics</h4>
      </div>
      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <motion.path 
            d={`M 180 20 Q 200 ${focalDepth} 220 20`} 
            fill="url(#focusGrad)" 
            animate={{ strokeWidth: [1, 2, 1] }}
          />
          <defs>
             <linearGradient id="focusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
               <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
             </linearGradient>
          </defs>
          <line x1="150" y1={focalDepth} x2="250" y2={focalDepth} stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 2" />
          <circle cx="200" cy={focalDepth} r="4" fill="#f43f5e" />
        </svg>
      </div>
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase text-slate-500">Focal Depth</label>
        <input type="range" min="40" max="180" value={focalDepth} onChange={e => setFocalDepth(Number(e.target.value))} className="w-full h-1 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer" />
      </div>
      <VisualInsight 
        title="Electronic Focusing" 
        description="Focusing improves lateral resolution by narrowing the beam width at a specific depth. This is achieved by introducing electronic delays (phasing) to the crystal firing sequence." 
      />
    </motion.div>
  );
};

export const BeamFocusVisual = BeamFocusingVisual;

export const TGCVisual: React.FC = () => {
  const [tgc, setTgc] = useState([20, 40, 60, 80]);
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6"
    >
      <div className="flex items-center space-x-3">
        <Layers className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">TGC Sliders</h4>
      </div>
      <div className="flex space-x-8 justify-center h-40">
        {tgc.map((val, i) => (
          <div key={i} className="flex flex-col items-center h-full space-y-2">
            <span className="text-[11px] font-black text-slate-500 uppercase">Depth {i+1}</span>
            <div className="h-full w-1.5 bg-slate-800 rounded-full relative">
              <motion.div 
                style={{ bottom: `${val}%` }}
                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-registry-teal rounded-full shadow-lg border-2 border-slate-900"
              />
            </div>
          </div>
        ))}
      </div>
      <VisualInsight 
        title="TGC / DGC" 
        description="Time Gain Compensation (TGC) corrects for attenuation by amplifying echoes returning from deeper structures more than shallow ones, creating a uniform image brightness." 
      />
    </motion.div>
  );
};

export const DynamicRangeVisual: React.FC = () => {
  const [compression, setCompression] = useState(50);
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6"
    >
      <div className="flex items-center space-x-3">
        <Search className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Dynamic Range</h4>
      </div>
      <div className="h-32 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center p-4">
        <div className="w-full grid grid-cols-10 gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="h-12" 
              style={{ 
                backgroundColor: `rgb(${i * 25}, ${i * 25}, ${i * 25})`,
                opacity: 1 - (compression / 100) * (i < 2 || i > 7 ? 0.8 : 0)
              }} 
            />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase text-slate-500">Compression Level</label>
        <input type="range" min="0" max="100" value={compression} onChange={e => setCompression(Number(e.target.value))} className="w-full h-1 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer" />
      </div>
      <VisualInsight 
        title="Dynamic Range" 
        description="The ratio of the largest to smallest signal amplitudes a system can handle. Compression reduces this range to fit the grayscale display capabilities." 
      />
    </motion.div>
  );
};

export const BeamSteeringVisual: React.FC = () => {
  const [steeringAngle, setSteeringAngle] = useState(0);
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4"
    >
      <div className="flex items-center space-x-3">
        <Target className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Beam Steering</h4>
      </div>
      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <motion.path 
            d={`M 200 20 L ${200 + Math.tan((steeringAngle * Math.PI) / 180) * 160} 180`} 
            stroke="#22d3ee" 
            strokeWidth="4" 
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            strokeDasharray="10 5"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase text-slate-500">Steering Angle: {steeringAngle}°</label>
        <input type="range" min="-30" max="30" value={steeringAngle} onChange={e => setSteeringAngle(Number(e.target.value))} className="w-full h-1 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer" />
      </div>
      <VisualInsight 
        title="Electronic Steering" 
        description="By firing crystals with tiny time delays (phasing), the beam can be steered in different directions without moving the transducer. Essential for phased array probes." 
      />
    </motion.div>
  );
};

export const ScanConverterVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6"
    >
      <div className="flex items-center space-x-3">
        <Database className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Scan Converter</h4>
      </div>
      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center p-4">
        <div className="grid grid-cols-8 gap-1 opacity-40">
           {Array.from({ length: 32 }).map((_, i) => (
             <motion.div 
               key={i} 
               animate={{ opacity: [0.2, 0.8, 0.2] }}
               transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
               className="w-4 h-4 bg-registry-teal rounded-sm" 
             />
           ))}
        </div>
      </div>
      <VisualInsight 
        title="Scan Conversion" 
        description="Translates the spoken-language of ultrasound (polar coordinates) into the language of displays (rectangular/raster format). It also stores the image for display (memory)." 
      />
    </motion.div>
  );
};

export const PulseInversionVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4"
    >
      <div className="flex items-center space-x-3">
        <Sparkles className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Pulse Inversion</h4>
      </div>
      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-800">
        <svg className="w-full h-full" viewBox="0 0 400 150">
          <motion.path 
            d="M 50 75 Q 75 25 100 75 Q 125 125 150 75" 
            stroke="#22d3ee" 
            strokeWidth="2" 
            fill="none" 
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path 
            d="M 50 75 Q 75 125 100 75 Q 125 25 150 75" 
            stroke="#f43f5e" 
            strokeWidth="2" 
            fill="none" 
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <text x="250" y="80" textAnchor="middle" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest">Harmonic Signal Enhances</text>
        </svg>
      </div>
      <VisualInsight 
        title="Pulse Inversion" 
        description="Two pulses (one inverted) are sent down each scan line. Linear reflections cancel out, while non-linear harmonic reflections add together, creating a cleaner harmonic image." 
      />
    </motion.div>
  );
};

export const TransducerTypesVisual = ArrayTypesVisual;

export const DemodulationVisual: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
      <div className="flex items-center space-x-3">
        <Cpu className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Demodulation Process</h4>
      </div>
      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-800">
        <svg className="w-full h-full" viewBox="0 0 400 150">
           {/* RF Signal */}
           <motion.path 
             animate={{ opacity: [0.3, 0.1, 0.3] }}
             transition={{ duration: 1.5, repeat: Infinity }}
             d="M 50 75 L 60 45 L 70 105 L 80 55 L 90 95 L 100 75" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.3" 
           />
           {/* Rectified */}
           <motion.path 
             animate={{ opacity: [0.6, 0.9, 0.6] }}
             transition={{ duration: 1.5, repeat: Infinity }}
             d="M 150 75 L 160 45 L 170 75 L 180 55 L 190 75 L 200 75" stroke="#22d3ee" strokeWidth="2" fill="none" 
           />
           {/* Enveloped */}
           <motion.path 
             animate={{ strokeWidth: [2, 4, 2] }}
             transition={{ duration: 1.5, repeat: Infinity }}
             d="M 250 75 Q 300 40 350 75" stroke="#22d3ee" strokeWidth="3" fill="none" 
           />
           <text x="75" y="130" textAnchor="middle" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest">RF Signal</text>
           <text x="175" y="130" textAnchor="middle" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest">Rectified</text>
           <text x="300" y="130" textAnchor="middle" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest">Enveloped (Video)</text>
        </svg>
      </div>
      <VisualInsight 
        title="Signal Shaping" 
        description="Demodulation consists of two steps: Rectification (turning negative voltages into positive ones) and Smoothing/Enveloping (putting an envelope around the bumps). This creates the video signal for display." 
      />
    </div>
  );
};

export const TemporalResolutionVisual: React.FC = () => {
  const [frameRate, setFrameRate] = useState(30);
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-black uppercase italic text-white flex items-center">
          <Timer className="w-5 h-5 mr-3 text-registry-teal" />
          Temporal Res
        </h4>
        <div className="text-xl font-black italic text-registry-teal">{frameRate} Hz</div>
      </div>
      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-800">
        <motion.div 
          animate={{ x: [-100, 100, -100] }}
          transition={{ duration: 30 / frameRate, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 bg-registry-teal border-4 border-white/20 rounded-xl"
        />
        <div className="absolute inset-0 grid grid-cols-12 opacity-10">
           {Array.from({length: 12}).map((_, i) => <div key={i} className="border-r border-white/20 h-full" />)}
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase text-slate-500">Frame Rate (FPS)</label>
        <input type="range" min="1" max="60" value={frameRate} onChange={e => setFrameRate(Number(e.target.value))} className="w-full h-1 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer" />
      </div>
      <VisualInsight 
        title="Frame Rate & Motion" 
        description="Temporal resolution is accuracy in time. Higher frame rates provide better 'real-time' visualization of moving structures (like the heart). It is limited by speed of sound and depth." 
      />
    </div>
  );
};

export const DampingResolutionExplainer: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
      <h4 className="text-lg font-black uppercase italic text-white flex items-center">
        <Waves className="w-5 h-5 mr-3 text-registry-teal" />
        Damping Effect
      </h4>
      <div className="grid grid-cols-2 gap-4 h-40">
        <div className="bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
           <span className="text-[11px] font-black uppercase text-registry-rose mb-4">No Damping</span>
           <svg className="w-full h-full" viewBox="0 0 100 50">
              <path d="M 0 25 Q 10 5 20 25 Q 30 45 40 25 Q 50 5 60 25 Q 70 45 80 25 Q 90 5 100 25" stroke="#f43f5e" strokeWidth="2" fill="none" />
           </svg>
           <span className="text-[11px] font-black uppercase text-slate-500 mt-2">Long Pulse (Poor Res)</span>
        </div>
        <div className="bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
           <span className="text-[11px] font-black uppercase text-registry-teal mb-4">With Damping</span>
           <svg className="w-full h-full" viewBox="0 0 100 50">
              <path d="M 0 25 Q 10 5 20 25 Q 30 45 40 25" stroke="#22d3ee" strokeWidth="2" fill="none" />
           </svg>
           <span className="text-[11px] font-black uppercase text-registry-teal mt-2">Short Pulse (Good Res)</span>
        </div>
      </div>
      <VisualInsight 
        title="Axial Resolution" 
        description="Damping (Backing Layer) stops the crystal vibrations quickly, creating shorter pulses. Shorter Spatial Pulse Length (SPL) results in better Axial Resolution." 
      />
    </div>
  );
};

export const QAPhantomVisual: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
      <div className="flex items-center space-x-3">
        <Database className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Quality Assurance</h4>
      </div>
      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 p-4">
        <div className="absolute inset-0 scanline opacity-10" />
        <div className="grid grid-cols-4 gap-4 h-full">
           <div className="border border-white/10 rounded-xl flex flex-col p-2 space-y-2">
              <span className="text-[11px] font-black text-slate-500 uppercase">Dead Zone</span>
              <div className="flex-1 bg-white/5 rounded-lg border-t-4 border-registry-rose" />
           </div>
           <div className="border border-white/10 rounded-xl flex flex-col p-2 space-y-2">
              <span className="text-[11px] font-black text-slate-500 uppercase">Pins</span>
              <div className="flex-1 flex flex-col items-center justify-around">
                 <div className="w-1 h-1 bg-white rounded-full shadow-white shadow-sm" />
                 <div className="w-1 h-1 bg-white rounded-full shadow-white shadow-sm" />
                 <div className="w-1 h-1 bg-white rounded-full shadow-white shadow-sm" />
              </div>
           </div>
           <div className="border border-white/10 rounded-xl flex flex-col p-2 space-y-2">
              <span className="text-[11px] font-black text-slate-500 uppercase">Cysts</span>
              <div className="flex-1 flex flex-col items-center justify-around">
                 <div className="w-4 h-4 rounded-full border border-registry-teal/30" />
                 <div className="w-4 h-4 rounded-full border border-registry-teal/30 bg-registry-teal/5" />
              </div>
           </div>
           <div className="border border-white/10 rounded-xl flex flex-col p-2 space-y-2">
              <span className="text-[11px] font-black text-slate-500 uppercase">Sensitivity</span>
              <div className="flex-1 bg-gradient-to-b from-white/20 to-transparent" />
           </div>
        </div>
      </div>
      <VisualInsight 
        title="Tissue Phantoms" 
        description="Phantoms simulate tissue properties to test system performance. They evaluate axial/lateral resolution, vertical/horizontal distance, sensitivity, and the dead zone." 
      />
    </div>
  );
};






