import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Activity, Info, Loader2, Volume2, Sparkles, Book, Zap, AlertCircle, Droplets, Target, Thermometer, Waves, Shield, Hexagon } from 'lucide-react';
import { generateSpeech } from '../../services/aiService';
import { decodeBase64, pcmToWav } from '../../lib/audioUtils';
import { CompanionAvatar } from '../CompanionAvatar';
import { GrainOverlay, ScanlineOverlay } from './UtilityVisuals';
import { VisualHeader, VisualInsight } from './BaseVisuals';

// --- PHYSICS SIMULATORS ---

export const BeamLab: React.FC = () => {
  const [focusDepth, setFocusDepth] = useState(5); // cm
  const [aperture, setAperture] = useState(10); // mm
  const [frequency, setFrequency] = useState(5); // MHz
  
  // Real NZL = (D^2 * f) / (4 * v)
  const nzl = (aperture * aperture * frequency) / (4 * 1.54) / 10; 

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Beam Forming Lab" 
        subtitle="Neural Beam Synthesis Matrix" 
        icon={Target} 
        protocol="04-BEM"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative flex items-center justify-center shadow-inner group/scope">
          <div className="absolute inset-0 scanline opacity-20" />
          <div className="absolute left-0 h-full w-8 bg-stealth-800 flex items-center justify-center border-r border-registry-teal/30 z-30 shadow-2xl">
             <span className="rotate-90 text-[10px] font-black text-white uppercase tracking-[0.6em] whitespace-nowrap italic leading-none">PZT ARRAY MODULE</span>
          </div>
          
          <div className="flex-1 relative h-full">
            <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.2" />
                  <stop offset={`${Math.min(100, (focusDepth / 15) * 100)}%`} stopColor="#2dd4bf" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              <motion.path 
                animate={{ 
                  d: `M 0 ${50 - aperture*2} 
                      L ${(focusDepth / 15) * 200} ${50 - aperture} 
                      L 200 ${50 - aperture*3} 
                      L 200 ${50 + aperture*3} 
                      L ${(focusDepth / 15) * 200} ${50 + aperture} 
                      L 0 ${50 + aperture*2} Z`
                }}
                fill="url(#beamGrad)"
                stroke="#2dd4bf"
                strokeWidth="0.5"
                strokeDasharray="2,2"
                className="drop-shadow-glow opacity-80"
              />
              
              <motion.circle 
                animate={{ cx: (focusDepth / 15) * 200, cy: 50 }}
                r="4"
                fill="#f43f5e"
                className="animate-pulse shadow-glow-rose drop-shadow-glow-rose"
              />
            </svg>
            
            <div className="absolute top-6 left-12 flex flex-col items-start gap-1">
               <span className="text-[9px] font-black text-registry-teal uppercase tracking-widest italic opacity-60">Fresnel Zone</span>
               <span className="text-[11px] font-black text-white italic">Near Field</span>
            </div>
            <div className="absolute top-6 right-8 flex flex-col items-end gap-1">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">Fraunhofer Zone</span>
               <span className="text-[11px] font-black text-white italic">Far Field</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-10">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-2">
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Aperture</span>
                 <span className="text-xl font-black italic text-registry-teal drop-shadow-glow leading-none tabular-nums">{aperture}mm</span>
              </div>
              <input 
                type="range" min="5" max="25" step="1" 
                value={aperture} 
                onChange={(e) => setAperture(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-2">
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Frequency</span>
                 <span className="text-xl font-black italic text-registry-teal drop-shadow-glow leading-none tabular-nums">{frequency}MHz</span>
              </div>
              <input 
                type="range" min="2" max="15" step="1" 
                value={frequency} 
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Electronic Focus</span>
                <span className="text-xl font-black italic text-registry-teal drop-shadow-glow leading-none tabular-nums">{focusDepth}cm</span>
             </div>
             <input 
                type="range" min="1" max={Math.min(15, nzl * 1.5)} step="0.5" 
                value={focusDepth} 
                onChange={(e) => setFocusDepth(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner"
             />
          </div>

          <div className="flex items-center justify-between p-6 bg-stealth-950 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group/nzl">
             <div className="absolute inset-0 bg-gradient-to-r from-registry-teal/5 to-transparent opacity-0 group-hover/nzl:opacity-100 transition-opacity" />
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">NZL Threshold</p>
                <p className="text-3xl font-black italic text-registry-teal tabular-nums drop-shadow-glow leading-none">{nzl.toFixed(1)} <span className="text-xs">cm</span></p>
             </div>
             <div className="text-right">
                <Zap className="w-6 h-6 text-registry-teal ml-auto mb-2 opacity-50" />
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Near Zone Limit</p>
             </div>
          </div>
        </div>
      </div>

      <VisualInsight 
        title="Beam Geometry Optimization" 
        description="The ultrasound beam changes shape with distance. NZL = (D² * f) / (4 * v). Aperture (D) and Frequency (f) directly increase the Focal Depth. Lateral resolution is half the aperture size at the focal point."
        keyTerms={['nzl', 'aperture', 'frequency', 'focus', 'fresnel', 'fraunhofer']}
      />
    </motion.div>
  );
};

export const PulseEchoVisual: React.FC = () => {
  const [depth, setDepth] = useState(4); // cm
  const [pulsePos, setPulsePos] = useState(0);
  const [status, setStatus] = useState<'emitting' | 'reflecting' | 'calculating'>('emitting');

  useEffect(() => {
    let interval = setInterval(() => {
      setPulsePos(p => {
        if (status === 'emitting') {
          if (p >= depth * 20) {
            setStatus('reflecting');
            return p;
          }
          return p + 2;
        } else if (status === 'reflecting') {
          if (p <= 0) {
            setStatus('calculating');
            return 0;
          }
          return p - 2;
        }
        return p;
      });
    }, 30);

    if (status === 'calculating') {
      setTimeout(() => {
        setStatus('emitting');
        setPulsePos(0);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [depth, status]);

  const time = depth * 13;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Pulse-Echo Lab" 
        subtitle="13 Microsecond Rule Analysis" 
        icon={Activity} 
        protocol="05-ECH"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative flex items-center shadow-inner group/scope px-12">
          <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
          
          <div className="absolute left-0 h-full w-6 bg-registry-teal/10 border-r border-registry-teal/40 flex items-center justify-center">
             <div className={`w-1.5 h-24 bg-registry-teal rounded-full blur-[2px] ${status === 'emitting' ? 'animate-pulse' : 'opacity-40'}`} />
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-32 bg-white/10 border-r border-white/5 rounded-full" style={{ left: `calc(${depth * 20}px + 48px)` }}>
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-white/40 uppercase tracking-[0.4em] whitespace-nowrap italic">Target Boundary</div>
             <div className="w-full h-full bg-white/20 blur-sm rounded-full" />
          </div>

          <motion.div 
            className="absolute h-12 w-16 flex items-center justify-center"
            style={{ left: pulsePos + 48 }}
          >
            <div className={`w-full h-full rounded-full blur-xl opacity-40 ${status === 'reflecting' ? 'bg-registry-rose' : 'bg-registry-teal'}`} />
            <Waves className={`w-8 h-8 z-10 ${status === 'reflecting' ? 'text-registry-rose rotate-180' : 'text-registry-teal'}`} />
          </motion.div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-stealth-900/80 px-5 py-2 rounded-full border border-white/10 backdrop-blur-xl">
             <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] italic leading-none">{status.toUpperCase()}...</span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-10">
          <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center space-x-3">
                 <Target className="w-4 h-4 text-registry-teal" />
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Interface Depth</span>
              </div>
              <span className="text-3xl font-black italic text-registry-teal drop-shadow-glow tabular-nums leading-none">{depth} <span className="text-sm">cm</span></span>
            </div>
            <input 
              type="range" min="1" max="10" step="1" 
              value={depth} 
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-stealth-950 rounded-[2rem] border border-white/5 group/stat">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover/stat:text-registry-teal transition-colors">Go-Return Time</p>
                <p className="text-2xl font-black text-white italic tabular-nums">{time} μs</p>
             </div>
             <div className="p-6 bg-stealth-950 rounded-[2rem] border border-white/5 group/stat">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover/stat:text-registry-teal transition-colors">Total Distance</p>
                <p className="text-2xl font-black text-white italic tabular-nums">{depth * 2} cm</p>
             </div>
          </div>

          <div className="bg-registry-teal/5 p-8 rounded-[2.5rem] border border-registry-teal/20 relative overflow-hidden group/box">
             <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
             <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-registry-teal mt-1" />
                <div>
                  <h6 className="text-[12px] font-black uppercase text-registry-teal italic mb-2 tracking-widest leading-none">Range Equation Logic</h6>
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic uppercase">
                    Soft tissue velocity is constant at 1,540 m/s. Range = (1.54 × time) / 2. Machine assumes any return echo beyond the PRF window is a mistake.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <VisualInsight 
        title="Pulse-Echo Dynamics" 
        description="The 13 Microsecond Rule states that for every 1 cm of reflector depth, sound takes 13 μs to travel to the reflector and back. Total distance = Velocity × Time. High-resolution imaging depends on precise timing accuracy down to the nanosecond."
        keyTerms={['echo', 'pulse', 'timing', 'depth', 'velocity', 'reflector']}
      />
    </motion.div>
  );
};

export const AttenuationSimulator: React.FC = () => {
  const [frequency, setFrequency] = useState(5); // MHz
  const [depth, setDepth] = useState(10); // cm
  
  const attenCoeff = 0.5 * frequency;
  const totalLoss = attenCoeff * depth;
  const intensityRemaining = Math.pow(10, -totalLoss / 10) * 100;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Attenuation Lab" 
        subtitle="Energy Loss Analysis Matrix" 
        icon={Activity} 
        color="text-registry-rose"
        protocol="06-ATT"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative flex flex-col pt-12 items-center shadow-inner group/scope">
           <div className="absolute inset-0 scanline opacity-20" />
           <svg className="w-full h-48 px-10 relative z-10" viewBox="0 0 400 100" preserveAspectRatio="none">
             <motion.path 
               animate={{ 
                 d: `M 0 50 ${Array.from({ length: 101 }).map((_, i) => {
                   const x = (i / 100) * 400;
                   const y = 80 - (70 * Math.exp(-(attenCoeff / 20) * (i / 100) * depth));
                   return `L ${x} ${y}`;
                 }).join(' ')}`
               }}
               stroke="#f43f5e"
               strokeWidth="5"
               fill="none"
               strokeLinecap="round"
               className="drop-shadow-glow-rose"
             />
             <line x1="0" y1="80" x2="400" y2="80" stroke="white" strokeWidth="1" opacity="0.1" />
             <text x="5" y="15" fill="#f43f5e" className="text-[10px] font-black uppercase italic tracking-[0.2em] opacity-80 shadow-glow-rose">Source Intensity</text>
             <text x="280" y="95" fill="#f43f5e" className="text-[10px] font-black uppercase italic tracking-[0.2em] opacity-60">Residual Power</text>
           </svg>
           
           <div className="mt-4 flex items-center space-x-4 opacity-60">
              <div className="w-3 h-3 rounded-full bg-registry-rose shadow-glow-rose animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-registry-rose italic">Loss Gradient Protocol Active</span>
           </div>
        </div>

        <div className="flex flex-col justify-center space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Frequency</span>
                 <span className="text-xl font-black italic text-registry-rose drop-shadow-glow leading-none tabular-nums">{frequency} MHz</span>
              </div>
              <input 
                type="range" min="2" max="15" step="1" 
                value={frequency} 
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose shadow-inner"
              />
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Soft Depth</span>
                 <span className="text-xl font-black italic text-registry-rose drop-shadow-glow leading-none tabular-nums">{depth} cm</span>
              </div>
              <input 
                type="range" min="1" max={20} step="1" 
                value={depth} 
                onChange={(e) => setDepth(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 relative group/stat overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-registry-rose/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Energy Deficit</p>
                <p className="text-4xl font-black italic text-registry-rose drop-shadow-glow leading-none tabular-nums">-{totalLoss.toFixed(1)} <span className="text-xs">dB</span></p>
             </div>
             <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 relative group/stat overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-registry-rose/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Power Reserve</p>
                <p className={`text-4xl font-black italic tabular-nums drop-shadow-glow leading-none ${intensityRemaining < 1 ? 'text-red-500' : 'text-registry-rose'}`}>
                   {intensityRemaining.toFixed(1)}%
                </p>
             </div>
          </div>
        </div>
      </div>

      <VisualInsight 
        title="Theory of Attenuation" 
        description="Attenuation is the progressive weakening of the ultrasound beam. Absorption (conversion to heat) is the primary driver, accounting for 80% of total loss. In soft tissue, attenuation is estimated at exactly 0.5 dB per cm, per MHz."
        keyTerms={['attenuation', 'absorption', 'reflection', 'scattering', 'decibel']}
      />
    </motion.div>
  );
};


export const ResolutionComparison: React.FC = () => {
  const [activeRes, setActiveRes] = useState<'axial' | 'lateral'>('axial');

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Resolution Matrix" 
        subtitle="Spatial Discriminator Protocol" 
        icon={Hexagon} 
        protocol="07-RES"
      />
      
      <div className="flex gap-2 p-1.5 bg-stealth-950/80 rounded-[2rem] border border-white/5 shadow-inner relative z-10 mb-12">
        <button 
          onClick={() => setActiveRes('axial')}
          className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeRes === 'axial' ? 'bg-registry-teal text-white shadow-glow translate-y-[-2px]' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Axial (LARRD)
        </button>
        <button 
          onClick={() => setActiveRes('lateral')}
          className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeRes === 'lateral' ? 'bg-registry-rose text-white shadow-glow-rose translate-y-[-2px]' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Lateral (LATA)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative flex items-center justify-center shadow-inner group/scope">
          <div className="absolute inset-0 scanline opacity-20" />
          {activeRes === 'axial' ? (
            <div className="flex flex-col items-center space-y-8 transition-all duration-500">
              <div className="relative">
                <div className="w-4 h-4 bg-registry-teal rounded-full shadow-glow" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-registry-teal italic uppercase tracking-widest">Interface Alpha</div>
              </div>
              <div className="h-20 w-px border-l border-dashed border-registry-teal/40" />
              <div className="relative">
                <div className="w-4 h-4 bg-registry-teal rounded-full shadow-glow" />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-registry-teal italic uppercase tracking-widest">Interface Beta</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-16 transition-all duration-500">
              <div className="relative">
                <div className="w-4 h-4 bg-registry-rose rounded-full shadow-glow-rose" />
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 text-[10px] font-black text-registry-rose italic uppercase tracking-widest">Target A</div>
              </div>
              <div className="relative">
                <div className="w-4 h-4 bg-registry-rose rounded-full shadow-glow-rose" />
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[10px] font-black text-registry-rose italic uppercase tracking-widest">Target B</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-10">
          <div className="grid grid-cols-2 gap-4">
             <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 group/stat">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Governing Law</p>
                <p className={`text-xl font-black italic uppercase leading-tight ${activeRes === 'axial' ? 'text-registry-teal' : 'text-registry-rose'}`}>
                   {activeRes === 'axial' ? 'SPL / 2' : 'Beam Diameter'}
                </p>
             </div>
             <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 group/stat">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Depth Variable</p>
                <p className="text-xl font-black text-white italic uppercase leading-tight">
                   {activeRes === 'axial' ? 'CONSTANT' : 'DIVERGENT'}
                </p>
             </div>
          </div>

          <div className="bg-stealth-950 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group/mnemonic">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/mnemonic:opacity-100 transition-opacity" />
             <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Mnemonic Retrieval</span>
                <p className={`text-2xl font-black italic leading-none ${activeRes === 'axial' ? 'text-registry-teal' : 'text-registry-rose'}`}>
                   {activeRes === 'axial' ? 'LARRD' : 'LATA'}
                </p>
                <p className="text-[11px] font-bold text-slate-600 uppercase italic tracking-widest">
                   {activeRes === 'axial' ? 'Longitudinal, Axial, Range, Radial, Depth' : 'Lateral, Angular, Transverse, Azimuthal'}
                </p>
             </div>
          </div>
        </div>
      </div>

      <VisualInsight 
        title={activeRes === 'axial' ? "Axial Precision" : "Lateral Precision"} 
        description={activeRes === 'axial' 
          ? "The ability to distinguish two parallel structures. Determined solely by Spatial Pulse Length (SPL). It does NOT change with depth. To improve axial resolution, use shorter pulses (higher frequency)." 
          : "The ability to distinguish two perpendicular structures. Determined by beam width. It changes with depth and is OPTIMAL only at the focal point. Larger apertures and higher frequencies create tighter focal zones."} 
        keyTerms={['resolution', 'axial', 'lateral', 'precision', 'spl', 'larrd', 'lata', 'beamwidth']}
      />
    </motion.div>
  );
};

export const DopplerShiftVisual: React.FC = () => {
  const [velocity, setVelocity] = useState(0); // -100 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = ((clientX - rect.left) / rect.width) * 200 - 100;
    setVelocity(Math.max(-100, Math.min(100, x)));
  };

  const shiftAmount = Math.abs(velocity);
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Doppler Vector Lab" 
        subtitle="Frequency Delta Analysis Engine" 
        icon={Activity} 
        color={velocity > 0 ? "text-registry-teal" : velocity < 0 ? "text-registry-rose" : "text-slate-400"}
        protocol="08-DOP"
      />

      <div 
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleDrag}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleDrag}
        className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] relative overflow-hidden border-2 border-slate-800 shadow-2xl cursor-ew-resize group/inner ring-4 ring-black/50 flex items-center justify-center"
      >
        <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
        
        {/* HUD Elements */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-20 w-[calc(100%-64px)] pointer-events-none">
           <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Toward Probe</span>
           <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Away From Probe</span>
        </div>
        
        {/* THE RBC */}
        <motion.div 
          animate={{ x: (velocity / 100) * 150 }}
          className="relative z-20 flex flex-col items-center"
        >
          <div className="relative">
             <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${velocity > 20 ? 'bg-registry-teal/20 border-registry-teal shadow-glow' : velocity < -20 ? 'bg-registry-rose/20 border-registry-rose shadow-glow-rose' : 'bg-stealth-800 border-white/20'}`}>
                <Droplets className={`w-10 h-10 transition-colors duration-700 ${velocity === 0 ? 'text-slate-600' : 'text-white'}`} />
             </div>
             
             {shiftAmount > 5 && (
               <motion.div 
                 animate={{ opacity: [0, 0.4, 0], scale: [1, 2] }}
                 transition={{ duration: 0.5, repeat: Infinity }}
                 className={`absolute inset-0 rounded-full blur-2xl ${velocity > 0 ? 'bg-registry-teal' : 'bg-registry-rose'}`}
               />
             )}
          </div>
          <p className="mt-4 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic leading-none whitespace-nowrap">Blood Flux Vector</p>
        </motion.div>

        {/* Wave compression lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.circle 
              key={i}
              cx={`${50 + (velocity / 100) * 35}%`}
              cy="50%"
              initial={{ r: 0, opacity: 0.4 }}
              animate={{ r: 400, opacity: 0 }}
              transition={{ 
                duration: velocity > 20 ? 0.8 : velocity < -20 ? 1.6 : 3, 
                repeat: Infinity, 
                delay: i * 0.4,
                ease: "linear"
              }}
              fill="none"
              stroke={velocity > 20 ? "#2dd4bf" : velocity < -20 ? "#f43f5e" : "rgba(255,255,255,0.1)"}
              strokeWidth="2"
            />
          ))}
        </svg>

        <div className="absolute top-8 right-8 flex flex-col items-end">
           <span className={`text-4xl font-black italic tabular-nums leading-none tracking-tighter ${velocity > 20 ? 'text-registry-teal drop-shadow-glow' : velocity < -20 ? 'text-registry-rose drop-shadow-glow-rose' : 'text-slate-600'}`}>
              {velocity > 0 ? '+' : ''}{velocity.toFixed(0)} <span className="text-sm">Hz</span>
           </span>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Relative Delta</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${velocity > 60 ? 'bg-registry-teal/10 border-registry-teal/40' : 'bg-stealth-950 border-white/5'}`}>
          <h5 className="text-[11px] font-black uppercase text-white mb-3 flex items-center italic tracking-widest">
            <Zap className="w-4 h-4 mr-3 text-registry-teal" /> Positive Shift
          </h5>
          <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase italic">Wavelengths are compressed. Frequency INCREASES. Vector toward transducer.</p>
        </div>
        <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${velocity < -60 ? 'bg-registry-rose/10 border-registry-rose/40' : 'bg-stealth-950 border-white/5'}`}>
          <h5 className="text-[11px] font-black uppercase text-white mb-3 flex items-center italic tracking-widest">
            <Zap className="w-4 h-4 mr-3 text-registry-rose" /> Negative Shift
          </h5>
          <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase italic">Wavelengths are expanded. Frequency DECREASES. Vector away from transducer.</p>
        </div>
      </div>

      <VisualInsight 
        title="Vector Hemodynamics" 
        description="The Doppler Effect measures the change in frequency returning from moving reflectors (RBCs). Shift = (2 × V × f × cosθ) / c. Positive shift means higher frequency (TOWARD), negative means lower (AWAY)."
        keyTerms={['doppler', 'shift', 'velocity', 'frequency', 'hemoglobin', 'vector']}
      />
    </motion.div>
  );
};

export const NyquistLimitVisual: React.FC = () => {
  const [prf, setPrf] = useState(5000);
  const [shift, setShift] = useState(3000);
  const nyquist = prf / 2;
  const isAliasing = Math.abs(shift) > nyquist;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Sampling Analyzer" 
        subtitle="Nyquist-Shannon Protocol Engine" 
        icon={Zap} 
        color={isAliasing ? "text-registry-rose" : "text-registry-teal"}
        protocol="09-NYQ"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 mb-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner ring-4 ring-black/50 group/scope">
          <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
          <div className="absolute inset-x-0 top-[20%] h-px bg-registry-teal/20" />
          <div className="absolute inset-x-0 bottom-[20%] h-px bg-registry-teal/20" />
          
          <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 200 150">
            <motion.path 
              animate={{ 
                d: isAliasing 
                  ? `M 0 75 L 50 10 L 100 140 L 150 10 L 200 140` 
                  : `M 0 75 L 100 ${75 - (shift/nyquist) * 60} L 200 75`,
                stroke: isAliasing ? "#f43f5e" : "#2dd4bf"
              }}
              transition={{ duration: 0.4, ease: "anticipate" }}
              fill="none" 
              strokeWidth="4"
              className={isAliasing ? 'drop-shadow-glow-rose' : 'drop-shadow-glow'}
              strokeDasharray={isAliasing ? "8,4" : "0"}
            />
            <motion.circle 
              animate={{ 
                cy: isAliasing ? 140 : 75 - (shift/nyquist) * 60,
                fill: isAliasing ? "#f43f5e" : "#22d3ee"
              }}
              cx="100" r="5"
              className="shadow-glow"
            />
          </svg>
          
          <AnimatePresence>
            {isAliasing && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-registry-rose/10 backdrop-blur-sm pointer-events-none"
              >
                <div className="bg-stealth-950/90 border-2 border-registry-rose px-8 py-4 rounded-[2rem] shadow-[0_0_50px_rgba(244,63,94,0.5)]">
                   <span className="text-xl font-black uppercase text-registry-rose tracking-[0.5em] italic">Wrap-Around</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-center space-y-12">
          <div className="grid grid-cols-2 gap-4">
             <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 relative group/stat">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Nyquist Limit</p>
                <p className="text-2xl font-black text-registry-teal italic tabular-nums leading-none">{nyquist} <span className="text-xs">Hz</span></p>
             </div>
             <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 relative group/stat ${isAliasing ? 'border-registry-rose bg-registry-rose/5' : 'border-white/5 bg-stealth-950'}`}>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Shift Magnitude</p>
                <p className={`text-2xl font-black italic tabular-nums leading-none ${isAliasing ? 'text-registry-rose drop-shadow-glow-rose' : 'text-white'}`}>{shift} <span className="text-xs">Hz</span></p>
             </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">PRF Master Loop</label>
                <span className="text-xs font-black text-registry-teal italic tabular-nums">{prf} Hz</span>
              </div>
              <input type="range" min="2000" max="10000" step="100" value={prf} onChange={e => setPrf(Number(e.target.value))} className="w-full h-2 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer shadow-inner" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Flow Shift Load</label>
                <span className={`text-xs font-black italic tabular-nums ${isAliasing ? 'text-registry-rose' : 'text-white'}`}>{shift} Hz</span>
              </div>
              <input type="range" min="1000" max="8000" step="100" value={shift} onChange={e => setShift(Number(e.target.value))} className="w-full h-2 accent-registry-rose bg-slate-800 rounded-lg appearance-none cursor-pointer shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      <VisualInsight 
        title="The Nyquist Barrier" 
        description="Aliasing occurs when the Doppler shift frequency exceeds the Nyquist Limit (1/2 PRF). It manifests as the highest velocities 'wrapping around' and appearing to flow in the opposite direction. To eliminate aliasing, increase PRF or shift the baseline." 
        keyTerms={['nyquist', 'aliasing', 'sampling', 'prf', 'shift', 'wraparound']}
      />
    </motion.div>
  );
};

export const AliasingVisual: React.FC = () => {
  const [prf, setPrf] = useState(4000);
  const [velocity, setVelocity] = useState(3000);
  const nyquist = prf / 2;
  const isAliasing = velocity > nyquist;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Spectral Alias" 
        subtitle="Artifact Synthesis Protocol" 
        icon={Zap} 
        color={isAliasing ? "text-registry-rose" : "text-registry-teal"}
        protocol="12-ALS"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 mb-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner ring-4 ring-black/50 group/scope">
          <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
          <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
            <motion.path 
              animate={{ 
                d: isAliasing 
                  ? "M 0 100 L 50 10 M 50 190 L 150 10 M 150 190 L 250 10 M 250 190 L 350 10" 
                  : "M 0 100 L 100 40 L 200 100 L 300 40 L 400 100",
                stroke: isAliasing ? "#f43f5e" : "#2dd4bf"
              }}
              fill="none" 
              strokeWidth="5" 
              strokeLinecap="round"
              className={isAliasing ? 'drop-shadow-glow-rose' : 'drop-shadow-glow'}
              strokeDasharray={isAliasing ? "12,8" : "0"}
              transition={{ duration: 0.4, ease: "anticipate" }}
            />
          </svg>
          
          <AnimatePresence>
            {isAliasing && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-registry-rose/10 backdrop-blur-sm pointer-events-none"
              >
                <div className="bg-stealth-950/90 border-2 border-registry-rose px-8 py-4 rounded-[2rem] shadow-[0_0_50px_rgba(244,63,94,0.5)]">
                   <span className="text-xl font-black uppercase text-registry-rose tracking-[0.5em] italic">Wrap-Around</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-center space-y-12">
          <div className="grid grid-cols-2 gap-4">
             <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 relative group/stat">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Nyquist Gate</p>
                <p className="text-2xl font-black text-registry-teal italic tabular-nums leading-none">{nyquist} <span className="text-xs">Hz</span></p>
             </div>
             <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 relative group/stat ${isAliasing ? 'border-registry-rose bg-registry-rose/5' : 'border-white/5 bg-stealth-950'}`}>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Peak Velocity</p>
                <p className={`text-2xl font-black italic tabular-nums leading-none ${isAliasing ? 'text-registry-rose drop-shadow-glow-rose' : 'text-white'}`}>{velocity} <span className="text-xs">Hz</span></p>
             </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Pulse Repetition Frequency</label>
                <span className="text-xs font-black text-registry-teal italic tabular-nums">{prf} Hz</span>
              </div>
              <input type="range" min="1000" max="8000" value={prf} onChange={e => setPrf(Number(e.target.value))} className="w-full h-2 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer shadow-inner" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Target Shift Frequency</label>
                <span className={`text-xs font-black italic tabular-nums ${velocity > nyquist ? 'text-registry-rose' : 'text-white'}`}>{velocity} Hz</span>
              </div>
              <input type="range" min="500" max="10000" value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full h-2 accent-registry-rose bg-slate-800 rounded-lg appearance-none cursor-pointer shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      <VisualInsight 
        title="Spectral Misinterpretation" 
        description="Aliasing occurs when the system's sampling rate (PRF) is insufficient to resolve the Doppler shift. The signal 'wraps around' the display, appearing on the wrong side of the baseline. This is solved by increasing PRF, lowering frequency, or increasing the scale." 
        keyTerms={['aliasing', 'wrap-around', 'spectral', 'prf', 'nyquist', 'artifact']}
      />
    </motion.div>
  );
};


export const DopplerAngleVisual: React.FC = () => {
  const [angle, setAngle] = useState(60);
  const cosine = Math.cos((angle * Math.PI) / 180).toFixed(2);
  const errorValue = (1 - Number(cosine)) * 100;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Angle Accuracy" 
        subtitle="Cosine Variance Analysis" 
        icon={Target} 
        protocol="10-ANG"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner group/scope">
          <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
          <svg className="w-full h-full" viewBox="0 0 400 200">
             <line x1="50" y1="100" x2="350" y2="100" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" opacity="0.2" />
             <motion.path 
               animate={{ rotate: -angle }}
               style={{ originX: "200px", originY: "100px" }}
               d="M 200 100 L 200 20" stroke="#22d3ee" strokeWidth="5" strokeDasharray="10 5" 
               className="drop-shadow-glow"
             />
             <circle cx="200" cy="100" r="12" fill="#22d3ee" className="animate-pulse shadow-glow" />
             <text x="210" y="80" fill="#22d3ee" className="text-[10px] font-black uppercase italic tracking-widest">Neural Beam</text>
             <text x="210" y="125" fill="#f43f5e" className="text-[10px] font-black uppercase italic tracking-widest">Vessel Flow</text>
          </svg>
        </div>

        <div className="flex flex-col justify-center space-y-10">
          <div className="grid grid-cols-2 gap-4">
             <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 group/stat">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Cosine Vector</p>
                <p className="text-3xl font-black text-registry-teal italic tabular-nums leading-none">{cosine}</p>
             </div>
             <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 group/stat ${angle > 60 ? 'border-registry-rose bg-registry-rose/5' : 'border-white/5 bg-stealth-950'}`}>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Velocity Error</p>
                <p className={`text-3xl font-black italic tabular-nums leading-none ${angle > 60 ? 'text-registry-rose drop-shadow-glow-rose' : 'text-white'}`}>{errorValue.toFixed(0)}%</p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
               <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Insonation Angle</span>
               <span className="text-3xl font-black italic text-registry-teal drop-shadow-glow tabular-nums leading-none">{angle}°</span>
            </div>
            <input 
              type="range" min="0" max="90" value={angle} 
              onChange={e => setAngle(Number(e.target.value))} 
              className="w-full h-2 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer shadow-inner" 
            />
          </div>
        </div>
      </div>

      <VisualInsight 
        title="The Cosine Criticality" 
        description="The Doppler Equation depends on the cosine of the angle. At 90°, the cosine is 0, making velocity calculation impossible. Clinical standard requires an angle at or below 60° for reliable hemodynamics." 
        keyTerms={['cosine', 'angle', 'accuracy', 'insonation', 'doppler', 'error']}
      />
    </motion.div>
  );
};

export const DopplerAngleExplainer = DopplerAngleVisual;

export const FlowPatternsVisual: React.FC = () => {
  const [pattern, setPattern] = useState<'laminar' | 'turbulent' | 'disturbed'>('laminar');
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Hemodynamic Flux" 
        subtitle="Flow Profile Simulator" 
        icon={Activity} 
        protocol="12-FLX"
      />

      <div className="flex justify-center mb-10 relative z-10">
        <div className="flex gap-2 p-1.5 bg-stealth-950/80 rounded-[2.5rem] border border-white/5 shadow-inner">
          {(['laminar', 'disturbed', 'turbulent'] as const).map(p => (
            <button key={p} onClick={() => setPattern(p)} className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic transition-all duration-500 ${pattern === p ? 'bg-registry-teal text-stealth-950 shadow-glow' : 'text-slate-500 hover:text-slate-300'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative flex items-center justify-center shadow-inner group/scope">
         <div className="absolute inset-0 scanline opacity-20" />
         <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
           {pattern === 'laminar' && Array.from({ length: 7 }).map((_, i) => {
             const y = 40 + i * 20;
             const speed = 1 - Math.abs((i - 3) / 3.5);
             return (
               <motion.line 
                 key={i} x1="0" y1={y} x2="400" y2={y} 
                 stroke="#2dd4bf" strokeWidth={2 + speed * 4} strokeOpacity={0.2 + speed * 0.6}
                 animate={{ strokeDashoffset: [0, -100 * speed] }}
                 transition={{ duration: 2 / speed, repeat: Infinity, ease: "linear" }}
                 strokeDasharray="20 10"
               />
             );
           })}
           {pattern === 'turbulent' && Array.from({ length: 30 }).map((_, i) => (
             <motion.circle 
               key={i} r={2 + Math.random() * 4} fill="#f43f5e"
               animate={{ 
                 x: [Math.random() * 400, Math.random() * 400],
                 y: [Math.random() * 200, Math.random() * 200],
                 opacity: [0, 0.8, 0]
               }}
               transition={{ duration: 1, repeat: Infinity }}
             />
           ))}
           {pattern === 'disturbed' && Array.from({ length: 15 }).map((_, i) => {
             const y = 40 + i * 10;
             return (
               <motion.path 
                 key={i} d={`M 0 ${y} Q 200 ${y + Math.sin(i) * 40} 400 ${y}`} 
                 fill="none" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.4"
                 animate={{ strokeDashoffset: [0, -100] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 strokeDasharray="15 5"
               />
             );
           })}
         </svg>
      </div>

      <VisualInsight 
        title="Vascular Fluid Dynamics" 
        description={pattern === 'laminar' ? "Normal physiological flow where blood travels in parallel layers at different speeds. The center is fastest." : pattern === 'turbulent' ? "Chaotic flow with vortices, often seen distal to a severe stenosis. Characterized by high Reynolds numbers." : "Flow that is slightly deviated from parallel but remains orderly. Common at bifurcations."}
        keyTerms={['laminar', 'turbulent', 'disturbed', 'reynolds', 'parabolic']}
      />
    </motion.div>
  );
};


export const AttenuationComparison: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      <VisualHeader title="Media Impedance" subtitle="Path Loss Spectrum" icon={Activity} protocol="13-MED" />
      
      <div className="space-y-6 relative z-10">
        {[
          { name: "Air", loss: "Extremely High (Gel Required)", color: "bg-registry-rose", width: "100%" },
          { name: "Bone", loss: "High Density Loss", color: "bg-orange-500", width: "85%" },
          { name: "Soft Tissue", loss: "Intermediate (0.5 dB/cm/MHz)", color: "bg-registry-amber", width: "45%" },
          { name: "Water/Fluid", loss: "Near Zero Loss", color: "bg-registry-teal", width: "10%" }
        ].map((media, i) => (
          <div key={i} className="group/bar">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[11px] font-black text-white uppercase tracking-widest italic">{media.name}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase italic opacity-0 group-hover/bar:opacity-100 transition-opacity">{media.loss}</span>
            </div>
            <div className="h-3 bg-stealth-950 rounded-full border border-white/5 overflow-hidden p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: media.width }}
                viewport={{ once: true }}
                className={`h-full rounded-full ${media.color} ${i === 0 ? 'shadow-glow-rose' : i === 3 ? 'shadow-glow' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>
      
      <VisualInsight 
        title="Tissue Characteristics" 
        description="Every medium has a different attenuation rate. Air attenuates sound so aggressively that we need coupling gel to bridge the transmission gap. Water permits sound to travel with almost zero absorption." 
        keyTerms={['impedance', 'attenuation', 'absorption', 'transmission', 'gel']}
      />
    </motion.div>
  );
};

export const FresnelFraunhoferVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      <VisualHeader title="Focus Geometry" subtitle="Near & Far Zone Mapping" icon={Activity} protocol="14-ZON" />
      
      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 relative overflow-hidden shadow-inner group/scope mb-6">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <svg className="w-full h-full" viewBox="0 0 400 200">
           <path d="M 50 100 Q 150 100 200 100 Q 300 150 400 180 L 400 20 Q 300 50 200 100 Q 150 100 50 100 Z" fill="#2dd4bf" fillOpacity="0.15" stroke="#2dd4bf" strokeWidth="2" className="drop-shadow-glow" />
           <line x1="200" y1="20" x2="200" y2="180" stroke="white" strokeWidth="1" strokeDasharray="8 4" opacity="0.3" />
           
           <text x="125" y="160" textAnchor="middle" fill="#2dd4bf" className="text-[10px] font-black uppercase italic tracking-widest">Fresnel Zone (Near)</text>
           <text x="300" y="160" textAnchor="middle" fill="#2dd4bf" className="text-[10px] font-black uppercase italic tracking-widest opacity-60">Fraunhofer (Far)</text>
           
           <motion.circle 
              animate={{ r: [3, 6, 3] }}
              transition={{ duration: 2, repeat: Infinity }}
              cx="200" cy="100" fill="#f43f5e" className="shadow-glow-rose" 
           />
        </svg>
      </div>
      <VisualInsight 
        title="Field Symmetry" 
        description="Intensity is greatest at the focal point. Resolution is OPTIMAL at the focal point (beam is narrowest). Beyond the focus, the beam naturally diverges into the far field." 
        keyTerms={['fresnel', 'fraunhofer', 'focal point', 'divergence', 'convergence', 'resolution']}
      />
    </motion.div>
  );
};

export const BioeffectMechanismsVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      <VisualHeader title="Bioeffect Matrix" subtitle="Thermal & Mechanical Safety" icon={Zap} protocol="15-BIO" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="bg-stealth-950 p-8 rounded-[2.5rem] border border-white/5 space-y-6 group/item">
           <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/30">
                 <Thermometer className="w-6 h-6 text-orange-500 animate-pulse" />
              </div>
              <span className="text-[12px] font-black uppercase text-white italic tracking-widest">Thermal Pathway</span>
           </div>
           <div className="h-24 relative flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 bg-orange-500 rounded-full blur-[40px]"
              />
              <span className="text-[11px] font-black text-orange-500 italic uppercase">Tissue Absorption Heat</span>
           </div>
           <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed italic">Governed by Thermal Index (TI). Higher in bone than soft tissue.</p>
        </div>

        <div className="bg-stealth-950 p-8 rounded-[2.5rem] border border-white/5 space-y-6 group/item">
           <div className="flex items-center space-x-4">
              <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/30">
                 <Droplets className="w-6 h-6 text-registry-teal animate-bounce" />
              </div>
              <span className="text-[12px] font-black uppercase text-white italic tracking-widest">Cavitation Pathway</span>
           </div>
           <div className="h-24 relative flex items-center justify-center overflow-hidden">
              {Array.from({length: 6}).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ scale: [1, 2, 0], opacity: [1, 0.4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
                  className="absolute w-6 h-6 border-2 border-registry-teal rounded-full"
                />
              ))}
              <span className="text-[11px] font-black text-registry-teal italic uppercase">Mechanical Oscillation</span>
           </div>
           <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed italic">Governed by Mechanical Index (MI). Peak rarefactional pressure risk.</p>
        </div>
      </div>
      
      <VisualInsight 
        title="ALARA Safety Standard" 
        description="As Low As Reasonably Achievable. Thermal bioeffects involve the conversion of sound into heat. Mechanical bioeffects involve gas bubble interaction (cavitation). Always minimize output power and dwell time." 
        keyTerms={['alara', 'bioeffects', 'thermal index', 'mechanical index', 'cavitation', 'safety']}
      />
    </motion.div>
  );
};


export const CavitationVisual: React.FC = () => {
  const [type, setType] = useState<'stable' | 'transient'>('stable');

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Cavitation Lab" 
        subtitle="Microbubble Dynamics" 
        icon={Waves} 
        protocol="14-CAV"
      />

      <div className="flex justify-center mb-10 relative z-10">
        <div className="flex gap-2 p-1.5 bg-stealth-950/80 rounded-[2.5rem] border border-white/5 shadow-inner">
          {(['stable', 'transient'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic transition-all duration-500 ${type === t ? 'bg-registry-rose text-white shadow-glow-rose' : 'text-slate-500 hover:text-slate-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative flex items-center justify-center shadow-inner">
         <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
           <AnimatePresence mode="wait">
             {type === 'stable' ? (
               <motion.circle 
                 key="stable" cx="200" cy="100" r="30" fill="none" stroke="#2dd4bf" strokeWidth="4"
                 animate={{ r: [30, 45, 30], strokeWidth: [4, 2, 4] }}
                 transition={{ duration: 0.5, repeat: Infinity }}
                 className="drop-shadow-glow"
               />
             ) : (
               <motion.g key="transient">
                 <motion.circle 
                   cx="200" cy="100" r="10" fill="#f43f5e"
                   animate={{ scale: [1, 8], opacity: [1, 0] }}
                   transition={{ duration: 0.3, repeat: Infinity }}
                 />
                 <motion.path 
                    d="M 200 100 L 220 120" stroke="#f43f5e" strokeWidth="2"
                    animate={{ x: [0, 50], opacity: [1, 0] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                 />
               </motion.g>
             )}
           </AnimatePresence>
         </svg>
      </div>

      <VisualInsight 
        title="Inertial vs Stable" 
        description={type === 'stable' ? "Stable Cavitation involves microbubbles that expand and contract but do not burst. They generate micro-streaming of fluid which can stress cell membranes." : "Transient (Inertial) Cavitation involves bubbles that expand rapidly and then collapse violently, generating localized shock waves and extreme temperatures."}
        keyTerms={['cavitation', 'transient', 'stable', 'microstreaming', 'shock-waves']}
      />
    </motion.div>
  );
};

export const ContrastBubbleVisual: React.FC = () => {
  const [mi, setMi] = useState(0.2); // Mechanical Index
  const isOptimal = mi >= 0.1 && mi <= 0.3;
  const isBreaking = mi > 0.6;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Bubble Dynamics" 
        subtitle="Non-Linear Resonance Matrix" 
        icon={Sparkles} 
        protocol="11-CON"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 mb-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner group/scope">
           <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
           <div className="grid grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    scale: isBreaking ? [1, 1.5, 0] : isOptimal ? [1, 1.2, 0.9, 1.3, 1] : [1, 1.05, 1],
                    opacity: isBreaking ? [1, 1, 0] : 1,
                    y: isOptimal ? [0, -5, 0, 5, 0] : 0
                  }}
                  transition={{ 
                    duration: isBreaking ? 0.3 : 2, 
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className={`w-12 h-12 rounded-full border-2 relative flex items-center justify-center ${
                    isBreaking ? 'border-registry-rose bg-registry-rose/20' : 
                    isOptimal ? 'border-registry-teal bg-registry-teal/10 shadow-glow' : 
                    'border-slate-700 bg-slate-900'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isBreaking ? 'bg-registry-rose' : 'bg-registry-teal'} opacity-50`} />
                </motion.div>
              ))}
           </div>

           {isOptimal && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.15 }}
               className="absolute inset-0 bg-registry-teal animate-pulse pointer-events-none"
             />
           )}
        </div>

        <div className="flex flex-col justify-center space-y-12">
           <div className="flex flex-col items-center p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 relative group/index overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/5 to-transparent opacity-0 group-hover/index:opacity-100 transition-opacity" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3 italic">Mechanical Index</p>
              <div className="flex items-center space-x-6">
                 <span className={`text-6xl font-black italic tabular-nums leading-none ${isBreaking ? 'text-registry-rose drop-shadow-glow-rose' : 'text-registry-teal drop-shadow-glow'}`}>
                   {mi.toFixed(1)}
                 </span>
                 <Zap className={`w-8 h-8 ${isBreaking ? 'text-registry-rose animate-pulse' : 'text-registry-teal opacity-40'}`} />
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic leading-none">Emission Power Magnitude</label>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase italic tracking-widest ${isOptimal ? 'border-registry-teal text-registry-teal bg-registry-teal/10' : 'border-white/10 text-slate-600'}`}>
                   {isBreaking ? 'BURST MODE' : isOptimal ? 'RESONANCE SYNC' : 'LINEAR MODE'}
                </div>
              </div>
              <input 
                type="range" min="0.1" max="1.5" step="0.1" 
                value={mi} 
                onChange={e => setMi(parseFloat(e.target.value))} 
                className="w-full h-2 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer shadow-inner" 
              />
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Microbubble Harmonics" 
        description="Contrast agents (microbubbles) oscillate non-linearly (non-proportionally) when exposed to specific sound pressures. This resonance creates harmonics—echoes at multiples of the probe's frequency—allowing for high-contrast imaging of blood flow without tissue clutter." 
        keyTerms={['harmonics', 'microbubbles', 'resonance', 'mechanical index', 'non-linear', 'contrast']}
      />
    </motion.div>
  );
};

export const BeamFocusVisual = BeamLab;
export const SpatialResolutionVisual = ResolutionComparison;

export const SideLobeVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Acoustic Side Lobes" 
        subtitle="Parasitic Energy Analysis" 
        icon={Hexagon} 
        protocol="09-LOBE"
      />

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] relative overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-inner group/scope">
        <div className="absolute inset-0 scanline opacity-20" />
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <radialGradient id="lobeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Main Beam */}
          <motion.path 
            d="M 200 20 L 150 180 Q 200 200 250 180 Z" 
            fill="url(#lobeGrad)" 
            stroke="#2dd4bf" 
            strokeWidth="2" 
            className="drop-shadow-glow"
          />

          {/* Side Lobes */}
          {[-1, 1].map(dir => (
            <motion.path 
              key={dir}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              d={`M 200 20 Q ${200 + dir * 100} 80 ${200 + dir * 40} 140 Z`}
              fill="#f43f5e"
              fillOpacity="0.2"
              stroke="#f43f5e"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          <text x="200" y="190" textAnchor="middle" fill="#2dd4bf" className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Main Pulse Axis</text>
          <text x="310" y="100" fill="#f43f5e" className="text-[10px] font-black uppercase tracking-[0.2em] italic opacity-60">Parasitic Lobe</text>
          <text x="90" y="100" textAnchor="end" fill="#f43f5e" className="text-[10px] font-black uppercase tracking-[0.2em] italic opacity-60">Grating Lobe</text>
        </svg>
      </div>

      <VisualInsight 
        title="Artifact Generation" 
        description="Side lobes (single element) and Grating lobes (arrays) are regions of acoustic energy that extend outside the main beam's axis. They can create artifacts by reflecting off strong structures and mapping them into the main image. Techniques like apodization and tissue harmonics help eliminate these parasitic signals." 
        keyTerms={['side-lobes', 'grating-lobes', 'apodization', 'subdicing', 'harmonics', 'artifacts']}
      />
    </motion.div>
  );
};








