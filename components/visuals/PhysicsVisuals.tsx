import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Activity, Info, Loader2, Volume2, Sparkles, Book, Zap, AlertCircle, Droplets, Target, Thermometer } from 'lucide-react';
import { generateSpeech } from '../../src/services/aiService';
import { decodeBase64, pcmToWav } from '../../src/lib/audioUtils';
import { CompanionAvatar } from '../CompanionAvatar';
import { GrainOverlay, ScanlineOverlay } from './UtilityVisuals';
import { VisualInsight } from './BaseVisuals';

// --- PHYSICS SIMULATORS ---

export const BeamLab: React.FC = () => {
  const [focusDepth, setFocusDepth] = useState(5); // cm
  const [aperture, setAperture] = useState(10); // mm
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 30);
    return () => clearInterval(interval);
  }, []);
  
  // Near Zone Length (NZL) = (D^2 * f) / 6. We scale for visual:
  const nzl = (aperture * aperture) / 20;

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.005 }}
      className="w-full bg-stealth-950 rounded-[3rem] p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      <GrainOverlay />
      
      <div className="flex flex-col lg:flex-row gap-10 md:gap-12 relative z-10">
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-end">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/30">
                <Target className="w-6 h-6 text-registry-teal" />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase italic text-white leading-none">Beam Forming Lab</h4>
                <p className="text-[11px] font-bold text-registry-teal uppercase tracking-[0.3em] mt-2">Neural Beam Synthesis v2.0</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-mono font-black text-registry-teal glow-teal tabular-nums italic">{nzl.toFixed(1)}<span className="text-xs ml-1">cm</span></span>
              <p className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Near Zone Length (NZL)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] opacity-80 text-slate-400">
                <span>Crystal Aperture</span>
                <span className="text-registry-teal">{aperture} mm</span>
              </div>
              <input 
                type="range" min="5" max="20" step="1" 
                value={aperture} 
                onChange={(e) => setAperture(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] opacity-80 text-slate-400">
                <span>Focus Depth (R)</span>
                <span className="text-registry-teal">{focusDepth} cm</span>
              </div>
              <input 
                type="range" min="1" max="15" step="0.5" 
                value={focusDepth} 
                onChange={(e) => setFocusDepth(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
              />
            </div>
          </div>

          <div className="p-6 bg-stealth-900/50 rounded-3xl border border-white/5 space-y-3">
            <h5 className="text-[11px] font-black uppercase text-registry-teal tracking-widest flex items-center">
               <Info className="w-3.5 h-3.5 mr-2" /> Lateral Resolution Rule
            </h5>
            <p className="text-[12px] font-medium leading-relaxed text-slate-300">
              The beam diameter at the absolute focus is exactly <span className="text-registry-teal font-black italic">half (1/2) the aperture</span>. 
              As indicated in the Fraunhofer zone below, the beam eventually widens back to the original aperture at exactly 2x the NZL.
            </p>
          </div>
        </div>

        <div className="flex-1 relative h-64 md:h-80 bg-black rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center p-4">
          <div className="absolute left-0 h-full w-6 bg-stealth-800 flex items-center justify-center border-r border-registry-teal/30 z-30">
             <span className="rotate-90 text-[11px] font-black text-white uppercase tracking-[0.5em] whitespace-nowrap">PZT ARRAY</span>
          </div>
          
          <div className="flex-1 relative h-full">
            <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                  <stop offset={`${(focusDepth / 15) * 100}%`} stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Beam Shape */}
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
                stroke="#22d3ee"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
              
              {/* Pulse Propagation */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.path
                  key={i}
                  animate={{ 
                    x: [(i * 40), 200],
                    opacity: [0, 0.4, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.6,
                    ease: "linear"
                  }}
                  d={`M 0 ${50 - aperture*2} Q ${(focusDepth / 15) * 100} 50 0 ${50 + aperture*2}`}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  className="opacity-20"
                />
              ))}

              <motion.circle 
                animate={{ cx: (focusDepth / 15) * 200, cy: 50 }}
                r="3"
                fill="#f43f5e"
                className="animate-pulse shadow-glow-rose"
                filter="url(#glow)"
              />
              
              {/* Lines for Reference */}
              <line x1={(focusDepth / 15) * 200} y1="0" x2={(focusDepth / 15) * 200} y2="100" stroke="white" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 4" />
            </svg>
            
            <div className="absolute top-4 left-4 flex flex-col">
              <span className="text-[11px] font-black uppercase text-registry-teal tracking-widest italic">Fresnel Zone</span>
              <span className="text-[11px] text-slate-500 uppercase tracking-tighter">Converging Phase</span>
            </div>
            <div className="absolute top-4 right-4 flex flex-col items-end">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest italic">Fraunhofer Zone</span>
              <span className="text-[11px] text-slate-600 uppercase tracking-tighter">Diverging Phase</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-registry-rose/5 rounded-[2rem] border border-registry-rose/10 flex items-start space-x-6 relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
        <div className="scale-75 -mx-4 -my-4 shrink-0">
          <CompanionAvatar state="thinking" skin="stealth" />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-black text-registry-rose uppercase tracking-[0.2em] italic">Harvey's Beam Diagnostics:</p>
          <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
            Remember the <span className="text-white font-bold italic">Natural Focal Depth</span>. You can only move the electronic focus (focal depth) up to the limit of the near zone length. Beyond that, the physics of divergence takes over!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const AttenuationSimulator: React.FC = () => {
  const [frequency, setFrequency] = useState(5); // MHz
  const [depth, setDepth] = useState(10); // cm
  
  // Attenuation coefficient approx 0.5 dB/cm/MHz
  const attenCoeff = 0.5 * frequency;
  const totalLoss = attenCoeff * depth;
  const intensityRemaining = Math.pow(10, -totalLoss / 10) * 100;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-stealth-900 p-6 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row gap-10 md:gap-12 relative z-10">
        <div className="flex-1 space-y-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-registry-rose/10 rounded-2xl border border-registry-rose/30 shadow-glow-rose">
              <Activity className="w-6 h-6 text-registry-rose" />
            </div>
            <div>
              <h4 className="text-xl font-black uppercase italic text-white leading-none">Attenuation Lab</h4>
              <p className="text-[11px] font-black text-registry-rose uppercase tracking-[0.3em] mt-2">Energy Loss Calculator</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex justify-between">
                Frequency (MHz)
                <span className="text-registry-rose">{frequency} MHz</span>
              </label>
              <input 
                type="range" min="2" max="15" step="1" 
                value={frequency} 
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex justify-between">
                Depth (cm)
                <span className="text-registry-rose">{depth} cm</span>
              </label>
              <input 
                type="range" min="1" max="20" step="1" 
                value={depth} 
                onChange={(e) => setDepth(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-stealth-950 rounded-3xl border border-white/5 shadow-inner">
            <div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Energy Loss</p>
              <p className="text-3xl font-black italic text-registry-rose glow-rose">-{totalLoss.toFixed(1)} <span className="text-sm">dB</span></p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Intensity Remaining</p>
              <p className={`text-3xl font-black italic tabular-nums glow-rose ${intensityRemaining < 1 ? 'text-red-500' : 'text-registry-rose'}`}>
                {intensityRemaining < 0.1 ? '< 0.1' : intensityRemaining.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 h-64 md:h-80 bg-black rounded-[2.5rem] relative overflow-hidden border border-slate-800 shadow-inner flex flex-col pt-8">
           <div className="absolute inset-0 scanline opacity-10" />
           
           {/* Visual Depiction of Scattering and Absorption */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                  }}
                  transition={{ 
                    duration: Math.random() * 5 + 2, 
                    repeat: Infinity,
                    delay: Math.random() * 5
                  }}
                  className="w-1 h-1 bg-white rounded-full absolute"
                />
              ))}
           </div>

           <svg className="w-full h-48 px-10 relative z-10" viewBox="0 0 400 100" preserveAspectRatio="none">
             <motion.path 
               animate={{ 
                 d: `M 0 50 ${Array.from({ length: 101 }).map((_, i) => {
                   const x = (i / 100) * 400;
                   // Exponential decay: e^(-ax)
                   const y = 80 - (70 * Math.exp(-(attenCoeff / 20) * (i / 100) * depth));
                   return `L ${x} ${y}`;
                 }).join(' ')}`
               }}
               stroke="#f43f5e"
               strokeWidth="4"
               fill="none"
               strokeLinecap="round"
               className="drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]"
             />
             <line x1="0" y1="80" x2="400" y2="80" stroke="white" strokeWidth="1" opacity="0.1" />
             <text x="5" y="15" fill="#f43f5e" className="text-[11px] font-black uppercase italic tracking-widest opacity-60">Source Intensity</text>
             <text x="320" y="95" fill="#f43f5e" className="text-[11px] font-black uppercase italic tracking-widest opacity-60">Exit Energy</text>
           </svg>
           
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 opacity-40">
              <div className="w-2 h-2 rounded-full bg-registry-rose shadow-glow-rose" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-registry-rose">Attenuation Gradient</span>
           </div>
        </div>
      </div>

      <div className="premium-glass p-6 rounded-3xl border border-white/5 relative mt-8 z-10">
        <h5 className="text-[11px] font-black uppercase text-white mb-3 text-registry-rose">The Absorption Paradox</h5>
        <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
          Higher frequency probes provide beautiful resolution but suffer from <span className="text-registry-rose font-black italic">Aggressive Attenuation</span>. Why? Because higher frequencies cause more molecules to oscillate per second, turning more sound energy into HEAT (absorption) rather than echoes.
        </p>
      </div>

      <VisualInsight 
        title="Path Loss Theory" 
        description="Attenuation is the progressive weakening of the ultrasound beam as it travels through tissue. It is caused by three factors: Reflection, Scattering, and the biggest culprit—Absorption (conversion to heat). The standard estimate for soft tissue is 0.5 decibels of loss per centimeter, per megahertz of frequency." 
      />
    </motion.div>
  );
};


export const ResolutionComparison: React.FC = () => {
  const [activeRes, setActiveRes] = useState<'axial' | 'lateral'>('axial');

  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex gap-2 p-1 bg-stealth-950 rounded-2xl relative z-10">
        <button 
          onClick={() => setActiveRes('axial')}
          className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeRes === 'axial' ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Axial (LARRD)
        </button>
        <button 
          onClick={() => setActiveRes('lateral')}
          className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeRes === 'lateral' ? 'bg-registry-rose text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Lateral (LATA)
        </button>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        {activeRes === 'axial' ? (
          <div className="flex flex-col items-center space-y-6 transition-all duration-500">
            <div className="relative">
              <div className="w-3 h-3 bg-registry-teal rounded-full shadow-[0_0_10px_#22d3ee]" />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] font-black text-registry-teal">T1</div>
            </div>
            <div className="h-12 w-0.5 bg-registry-teal/20 border-l border-dashed" />
            <div className="relative">
              <div className="w-3 h-3 bg-registry-teal rounded-full shadow-[0_0_10px_#22d3ee]" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-black text-registry-teal">T2</div>
            </div>
            <div className="absolute right-[-60px] top-1/2 -translate-y-1/2 border-l-2 border-y-2 border-registry-teal/30 h-16 w-4 rounded-r-lg flex items-center justify-center">
               <span className="rotate-90 text-[11px] font-black text-registry-teal uppercase whitespace-nowrap">Dist &gt; SPL/2</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-12 transition-all duration-500">
            <div className="relative">
              <div className="w-3 h-3 bg-registry-rose rounded-full shadow-[0_0_10px_#f43f5e]" />
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-registry-rose">T1</div>
            </div>
            <div className="relative">
              <div className="w-3 h-3 bg-registry-rose rounded-full shadow-[0_0_10px_#f43f5e]" />
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-registry-rose">T2</div>
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 border-t-2 border-x-2 border-registry-rose/30 w-24 h-4 rounded-t-lg flex items-center justify-center">
               <span className="text-[11px] font-black text-registry-rose uppercase whitespace-nowrap">Dist &gt; Beam Width</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Formula</p>
          <p className="text-sm font-black italic text-registry-teal">
            {activeRes === 'axial' ? "SPL / 2" : "Beam Diameter"}
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Synonym</p>
          <p className="text-sm font-black italic text-registry-rose">
            {activeRes === 'axial' ? "LARRD" : "LATA"}
          </p>
        </div>
      </div>

      <VisualInsight 
        title={activeRes === 'axial' ? "Axial Resolution" : "Lateral Resolution"} 
        description={activeRes === 'axial' 
          ? "The ability to distinguish two structures that are parallel to the sound beam. It is determined by the Spatial Pulse Length (SPL)." 
          : "The ability to distinguish two structures that are perpendicular to the sound beam. It is determined by the width of the sound beam."} 
      />
    </div>
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
  const isPositive = velocity > 0;
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-stealth-900 p-6 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-2xl border transition-all duration-500 ${velocity > 20 ? 'bg-registry-teal/20 border-registry-teal/40 shadow-glow' : velocity < -20 ? 'bg-registry-rose/20 border-registry-rose/40 shadow-glow-rose' : 'bg-slate-800/50 border-white/10'}`}>
            <Activity className={`w-6 h-6 transition-colors duration-500 ${velocity > 20 ? 'text-registry-teal' : velocity < -20 ? 'text-registry-rose' : 'text-slate-400'}`} />
          </div>
          <div>
            <h4 className="text-xl font-black uppercase italic text-white leading-none">Doppler Shift Lab</h4>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Frequency Differential Analyzer</p>
          </div>
        </div>
        <div className={`text-3xl font-black italic tabular-nums tracking-tighter ${velocity > 20 ? 'text-registry-teal glow-teal' : velocity < -20 ? 'text-registry-rose glow-rose' : 'text-slate-500'}`}>
           {velocity > 0 ? '+' : ''}{velocity.toFixed(0)} Hz
        </div>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleDrag}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleDrag}
        className="h-64 md:h-80 bg-slate-950 rounded-[2.5rem] relative overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center cursor-ew-resize group"
      >
        <div className="absolute inset-0 scanline opacity-10" />
        
        {/* The Emitter / Particle */}
        <motion.div 
          animate={{ x: (velocity / 100) * 150 }}
          className="relative z-20 flex flex-col items-center"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-500 ${velocity > 20 ? 'bg-registry-teal border-registry-teal/50 shadow-glow' : velocity < -20 ? 'bg-registry-rose border-registry-rose/50 shadow-glow-rose' : 'bg-stealth-800 border-white/20'}`}>
             <Droplets className="w-6 h-6 text-white" />
          </div>
          <div className="mt-2 text-[11px] font-black text-white/40 uppercase tracking-widest">RBC</div>
        </motion.div>

        {/* Wave Compression Animation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.circle 
              key={i}
              cx={`${50 + (velocity / 100) * 37.5}%`}
              cy="50%"
              initial={{ r: 0, opacity: 0.5 }}
              animate={{ 
                r: 400, 
                opacity: 0,
                // Higher velocity in direction = squeezed waves = faster repetition
                strokeWidth: velocity !== 0 ? Math.max(1, (shiftAmount / 20)) : 1
              }}
              transition={{ 
                duration: velocity > 20 ? 1 : velocity < -20 ? 1.5 : 2.5, 
                repeat: Infinity, 
                delay: i * 0.4,
                ease: "linear"
              }}
              fill="none"
              stroke={velocity > 20 ? "#22d3ee" : velocity < -20 ? "#f43f5e" : "rgba(255,255,255,0.05)"}
            />
          ))}
        </svg>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-black text-white/20 uppercase tracking-[0.5em] italic">
           Drag to move blood cell
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div className={`p-4 rounded-2xl border transition-all duration-500 ${velocity > 60 ? 'bg-registry-teal/10 border-registry-teal/30' : 'bg-white/5 border-white/5'}`}>
          <h5 className="text-[11px] font-black uppercase text-white mb-1 flex items-center">
            <Zap className="w-3 h-3 mr-2 text-registry-teal" /> Blue Shift
          </h5>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Flow TOWARD transducer = Compressed wavelengths = HIGHER frequency.</p>
        </div>
        <div className={`p-4 rounded-2xl border transition-all duration-500 ${velocity < -60 ? 'bg-registry-rose/10 border-registry-rose/30' : 'bg-white/5 border-white/5'}`}>
          <h5 className="text-[11px] font-black uppercase text-white mb-1 flex items-center">
            <Zap className="w-3 h-3 mr-2 text-registry-rose" /> Red Shift
          </h5>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Flow AWAY from transducer = Expanded wavelengths = LOWER frequency.</p>
        </div>
      </div>

      <VisualInsight 
        title="The Doppler Effect" 
        description="Named after Christian Doppler, this principle describes the change in observed frequency of a wave when the source and observer are moving relative to each other. In sonography, we use this to calculate blood velocity by measuring the frequency shift in echoes returning from red blood cells." 
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
    <div className="bg-white dark:bg-stealth-950 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xs font-black uppercase italic text-slate-900 dark:text-white flex items-center">
          <Activity className="w-3 h-3 mr-2 text-registry-rose" />
          Nyquist Limit & Aliasing
        </h4>
        <div className="flex space-x-4">
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-black uppercase text-slate-500">PRF</span>
            <input 
              type="range" min="2000" max="10000" step="500" 
              value={prf} 
              onChange={(e) => setPrf(parseInt(e.target.value))}
              className="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
            />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-black uppercase text-slate-500">Shift</span>
            <input 
              type="range" min="1000" max="8000" step="500" 
              value={shift} 
              onChange={(e) => setShift(parseInt(e.target.value))}
              className="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose"
            />
          </div>
        </div>
      </div>

      <div className="h-48 relative flex items-center justify-center bg-slate-950 rounded-2xl mb-4 p-4 border border-slate-800">
        <div className="absolute inset-0 flex flex-col justify-between py-8 px-4">
          <div className="h-px w-full bg-white/10 relative">
            <span className="absolute -top-4 right-0 text-[11px] font-bold text-slate-500">+{nyquist} Hz (Nyquist)</span>
          </div>
          <div className="h-px w-full bg-white/20 relative">
            <span className="absolute -top-2 right-0 text-[11px] font-bold text-slate-400">Baseline</span>
          </div>
          <div className="h-px w-full bg-white/10 relative">
            <span className="absolute top-1 right-0 text-[11px] font-bold text-slate-500">-{nyquist} Hz (Nyquist)</span>
          </div>
        </div>

        <svg className="w-full h-full relative z-10 overflow-visible">
          <motion.path 
            animate={{ 
              d: isAliasing 
                ? `M 0 80 L 50 20 L 100 140 L 150 80 L 200 20` 
                : `M 0 80 L 100 ${80 - (shift/nyquist) * 60} L 200 80`,
              stroke: isAliasing ? "#f43f5e" : "#22d3ee"
            }}
            transition={{ duration: 0.5 }}
            fill="none" 
            strokeWidth="3"
            strokeDasharray={isAliasing ? "5,5" : "0"}
          />
          <motion.circle 
            animate={{ 
              cy: isAliasing ? 140 : 80 - (shift/nyquist) * 60,
              fill: isAliasing ? "#f43f5e" : "#22d3ee"
            }}
            cx="100" r="4"
          />
        </svg>

        {isAliasing && (
          <div className="absolute inset-0 flex items-center justify-center bg-registry-rose/10 backdrop-blur-[1px] pointer-events-none">
            <span className="text-[11px] font-black uppercase text-registry-rose tracking-widest border border-registry-rose/50 bg-stealth-950 px-3 py-1 rounded-full">Signal Aliasing</span>
          </div>
        )}
      </div>

      <VisualInsight 
        title="Nyquist Limit" 
        description="Aliasing occurs when the Doppler shift exceeding half the PRF. To fix: increase PRF, lower frequency, or adjust baseline." 
      />
    </div>
  );
};

export const AliasingVisual: React.FC = () => {
  const [prf, setPrf] = useState(4000);
  const [velocity, setVelocity] = useState(3000);
  const nyquist = prf / 2;
  const isAliasing = velocity > nyquist;

  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-black uppercase italic text-white flex items-center">
          <Activity className="w-5 h-5 mr-3 text-registry-rose" />
          Pulse Wave Aliasing
        </h4>
        <div className="flex space-x-2">
           <div className="px-3 py-1 bg-slate-800 rounded-lg text-[11px] font-black text-registry-teal">PRF: {prf}Hz</div>
           <div className="px-3 py-1 bg-slate-800 rounded-lg text-[11px] font-black text-registry-rose">Shift: {velocity}Hz</div>
        </div>
      </div>
      
      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-800">
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        <div className="absolute inset-x-0 top-[20%] h-px bg-registry-teal/20" />
        <div className="absolute inset-x-0 bottom-[20%] h-px bg-registry-teal/20" />
        
        <svg className="w-full h-full relative z-10">
          <motion.path 
            animate={{ 
              d: isAliasing 
                ? "M 0 100 L 50 20 M 50 180 L 150 20 M 150 180 L 250 20 M 250 180 L 350 20" 
                : "M 0 100 L 100 40 L 200 100 L 300 40 L 400 100",
              stroke: isAliasing ? "#f43f5e" : "#22d3ee"
            }}
            fill="none" strokeWidth="3" strokeDasharray={isAliasing ? "5,5" : "0"}
          />
        </svg>
        
        {isAliasing && (
          <div className="absolute inset-0 flex items-center justify-center bg-registry-rose/5 backdrop-blur-[1px]">
            <span className="bg-stealth-950 border border-registry-rose px-4 py-2 rounded-full text-[11px] font-black uppercase text-registry-rose animate-pulse shadow-lg">Wrap-Around (Aliasing)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase text-slate-500">Pulse Repetition Freq (PRF)</label>
          <input type="range" min="1000" max="8000" value={prf} onChange={e => setPrf(Number(e.target.value))} className="w-full h-1 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase text-slate-500">Blood Velocity (Shift)</label>
          <input type="range" min="500" max="10000" value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full h-1 accent-registry-rose bg-slate-800 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
      
      <VisualInsight 
        title="The Nyquist Limit" 
        description="Aliasing happens when the Doppler shift frequency exceeds the Nyquist Limit (1/2 PRF). It manifests as the highest velocities appearing to flow in the opposite direction." 
      />
    </div>
  );
};

export const DopplerAngleVisual: React.FC = () => {
  const [angle, setAngle] = useState(60);
  const cosine = Math.cos((angle * Math.PI) / 180).toFixed(2);
  const errorValue = (1 - Number(cosine)) * 100;

  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-black uppercase italic text-white flex items-center">
          <Target className="w-5 h-5 mr-3 text-registry-teal" />
          Angle & Accuracy
        </h4>
        <div className="text-xl font-black italic text-registry-teal">{angle}°</div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 400 200">
           <line x1="50" y1="100" x2="350" y2="100" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
           <motion.path 
             animate={{ rotate: -angle }}
             style={{ originX: "200px", originY: "100px" }}
             d="M 200 100 L 200 20" stroke="#22d3ee" strokeWidth="4" strokeDasharray="10 5" 
           />
           <circle cx="200" cy="100" r="10" fill="#22d3ee" className="animate-pulse" />
           <text x="210" y="80" fill="#22d3ee" className="text-[11px] font-black uppercase tracking-widest">Beam</text>
           <text x="210" y="120" fill="#f43f5e" className="text-[11px] font-black uppercase tracking-widest">Flow</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-stealth-950 rounded-2xl border border-white/5">
          <p className="text-[11px] font-black uppercase text-slate-500 mb-1">Cos(θ)</p>
          <p className="text-lg font-black text-registry-teal">{cosine}</p>
        </div>
        <div className="p-4 bg-stealth-950 rounded-2xl border border-white/5">
          <p className="text-[11px] font-black uppercase text-slate-500 mb-1">Potential Error</p>
          <p className="text-lg font-black text-registry-rose">{errorValue.toFixed(0)}%</p>
        </div>
      </div>

      <input type="range" min="0" max="90" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full h-1 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer" />
      
      <VisualInsight 
        title="Angle Importance" 
        description="The Doppler shift depends on the cosine of the angle. At 90°, the shift is zero. For clinical accuracy, stay below 60° to avoid massive velocity errors." 
      />
    </div>
  );
};

export const DopplerAngleExplainer = DopplerAngleVisual;

export const AttenuationComparison: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
      <h4 className="text-lg font-black uppercase italic text-white flex items-center">
        <Activity className="w-5 h-5 mr-3 text-registry-teal" />
        Media Attenuation
      </h4>
      
      <div className="space-y-4">
        {[
          { name: "Air", loss: "Extremely High", color: "bg-registry-rose" },
          { name: "Bone/Lung", loss: "High", color: "bg-orange-500" },
          { name: "Soft Tissue", loss: "Intermediate", color: "bg-registry-amber" },
          { name: "Water/Blood", loss: "Low", color: "bg-registry-teal" }
        ].map((media, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
              <span className="text-white">{media.name}</span>
              <span className="text-slate-500">{media.loss}</span>
            </div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: i === 0 ? "100%" : i === 1 ? "80%" : i === 2 ? "40%" : "10%" }}
                className={`h-full ${media.color}`}
              />
            </div>
          </div>
        ))}
      </div>
      
      <VisualInsight 
        title="Attenuation Rates" 
        description="Attenuation is the decrease in intensity as sound travels. Air has the highest attenuation (requires gel), while water/fluids have the lowest." 
      />
    </div>
  );
};

export const FresnelFraunhoferVisual: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
      <h4 className="text-lg font-black uppercase italic text-white flex items-center">
        <Activity className="w-5 h-5 mr-3 text-registry-teal" />
        Beam Zones
      </h4>
      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800">
        <svg className="w-full h-full" viewBox="0 0 400 200">
           {/* Beam shape */}
           <path d="M 50 100 Q 150 100 200 100 Q 300 150 400 180 L 400 20 Q 300 50 200 100 Q 150 100 50 100 Z" fill="#22d3ee" fillOpacity="0.1" stroke="#22d3ee" strokeWidth="2" />
           <line x1="200" y1="20" x2="200" y2="180" stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
           
           <text x="125" y="150" textAnchor="middle" fill="#22d3ee" className="text-[11px] font-black uppercase">Near Zone (Fresnel)</text>
           <text x="300" y="150" textAnchor="middle" fill="#22d3ee" className="text-[11px] font-black uppercase">Far Zone (Fraunhofer)</text>
           
           <circle cx="200" cy="100" r="4" fill="#f43f5e" />
           <text x="200" y="90" textAnchor="middle" fill="#f43f5e" className="text-[11px] font-black uppercase">Focal Point</text>
        </svg>
      </div>
      <VisualInsight 
        title="Converging & Diverging" 
        description="The Near Zone (Fresnel) is the region where the beam converges toward the focus. The Far Zone (Fraunhofer) is the region where the beam diverges." 
      />
    </div>
  );
};

export const BioeffectMechanismsVisual: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-registry-rose/10 rounded-xl border border-registry-rose/20">
          <Zap className="w-5 h-5 text-registry-rose" />
        </div>
        <h4 className="text-lg font-black uppercase italic text-white">Bioeffect Mechanisms</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
           <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span className="text-[11px] font-black uppercase text-white">Thermal</span>
           </div>
           <div className="h-16 relative flex items-center justify-center">
              <motion.div 
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-orange-500 rounded-full blur-xl"
              />
              <span className="text-[11px] font-black text-orange-500 uppercase">Tissue Heating</span>
           </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3">
           <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-registry-teal" />
              <span className="text-[11px] font-black uppercase text-white">Cavitation</span>
           </div>
           <div className="h-16 relative flex items-center justify-center">
              {Array.from({length: 5}).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ scale: [1, 1.5, 0], opacity: [1, 0.5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="absolute w-4 h-4 border border-registry-teal rounded-full"
                />
              ))}
              <span className="text-[11px] font-black text-registry-teal uppercase">Gas Bubbles</span>
           </div>
        </div>
      </div>
      
      <VisualInsight 
        title="Thermal vs. Mechanical" 
        description="Bioeffects are mainly caused by Thermal mechanisms (tissue heating) and Non-thermal/Mechanical mechanisms (cavitation, radiation force)." 
      />
    </div>
  );
};

export const CavitationVisual: React.FC = () => {
  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
      <h4 className="text-lg font-black uppercase italic text-white flex items-center">
        <Droplets className="w-5 h-5 mr-3 text-registry-teal" />
        Cavitation Types
      </h4>
      <div className="grid grid-cols-2 gap-4 h-40">
        <div className="bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
           <span className="text-[11px] font-black uppercase text-registry-teal mb-4">Stable</span>
           <motion.div 
             animate={{ scale: [1, 1.1, 1] }}
             transition={{ duration: 0.5, repeat: Infinity }}
             className="w-8 h-8 rounded-full border-2 border-registry-teal shadow-lg shadow-registry-teal/20"
           />
        </div>
        <div className="bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
           <span className="text-[11px] font-black uppercase text-registry-rose mb-4">Transient</span>
           <motion.div 
             animate={{ scale: [1, 1.8, 0], opacity: [1, 0.8, 0] }}
             transition={{ duration: 0.8, repeat: Infinity }}
             className="w-8 h-8 rounded-full bg-registry-rose shadow-xl"
           />
        </div>
      </div>
      <VisualInsight 
        title="Gas Bubble Physics" 
        description="Stable cavitation involves bubbles oscillating but not bursting. Transient/Inertial cavitation involves bubbles expanding and then imploding violently, causing potential damage." 
      />
    </div>
  );
};

export const ContrastBubbleVisual: React.FC = () => {
  const [mi, setMi] = useState(0.2); // Mechanical Index
  const isOptimal = mi >= 0.1 && mi <= 0.3;
  const isBreaking = mi > 0.6;

  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 overflow-hidden relative">
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      <div className="flex justify-between items-center relative z-10">
        <div>
          <h4 className="text-lg font-black uppercase italic text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-3 text-registry-teal" />
            Microbubble Dynamics
          </h4>
          <p className="text-[11px] font-bold text-registry-teal uppercase tracking-widest">Contrast Agent Simulator</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black italic ${isBreaking ? 'text-registry-rose animate-pulse' : 'text-registry-teal'}`}>
            MI: {mi.toFixed(1)}
          </span>
          <p className="text-[11px] font-black uppercase text-slate-500">Mechanical Index</p>
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
         {/* Microbubbles */}
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
                  duration: isBreaking ? 0.4 : 2, 
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className={`w-8 h-8 rounded-full border-2 relative flex items-center justify-center ${
                  isBreaking ? 'border-registry-rose bg-registry-rose/20' : 
                  isOptimal ? 'border-registry-teal bg-registry-teal/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 
                  'border-slate-500 bg-slate-500/10'
                }`}
              >
                <div className={`w-1 h-1 rounded-full ${isBreaking ? 'bg-registry-rose' : 'bg-registry-teal'} opacity-50`} />
              </motion.div>
            ))}
         </div>

         {/* Visual indication of resonance */}
         {isOptimal && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.1 }}
             className="absolute inset-0 bg-registry-teal animate-pulse"
           />
         )}
      </div>

      <div className="space-y-2 relative z-10">
        <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em]">Adjust Power (MI)</label>
        <input 
          type="range" min="0.1" max="1.5" step="0.1" 
          value={mi} 
          onChange={e => setMi(parseFloat(e.target.value))} 
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className={`p-4 rounded-2xl border transition-colors ${mi < 0.15 ? 'border-registry-teal bg-registry-teal/5' : 'border-white/5 bg-stealth-950'}`}>
          <p className="text-[11px] font-black uppercase text-slate-500 mb-1">Low MI (&lt;0.1)</p>
          <p className="text-[11px] font-black text-white italic uppercase">Linear Reflection</p>
        </div>
        <div className={`p-4 rounded-2xl border transition-colors ${isOptimal ? 'border-registry-teal bg-registry-teal/5' : 'border-white/5 bg-stealth-950'}`}>
          <p className="text-[11px] font-black uppercase text-slate-500 mb-1">Optimal MI (0.1-0.3)</p>
          <p className="text-[11px] font-black text-white italic uppercase">Non-Linear / Harmonics</p>
        </div>
      </div>

      <VisualInsight 
        title="Microbubble Harmonics" 
        description="Contrast agents oscillate non-linearly when exposed to moderate sound pressures (MI 0.1-0.3). High MI causes microbubble destruction, while very low MI produces only linear reflection." 
      />
    </div>
  );
};


