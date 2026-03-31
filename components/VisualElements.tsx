import React, { useEffect, useState, useMemo, useRef } from 'react';
import { User, Mic2, ArrowRight, Zap, Layers, Monitor, Search, Waves, X, Info, Activity, Maximize, Gauge, Beaker, ShieldCheck, Thermometer, ZapOff, Crosshair, Sparkles, Box, Droplets, Target, Split, AlertCircle, Copy, Scale, Flame, BarChart3, Settings2, Grid3X3, Share2, Ruler, Wind, Mountain, TrendingDown, Repeat, Zap as PulseIcon, Database, MoveHorizontal, RefreshCw, Timer, Binary, Zap as Lightning, Eye, EyeOff, MinusSquare, Cpu, Volume2, Loader2, Book, Bot, Sliders, CircleDot, Clock, Moon, Sun, AlertTriangle, ArrowLeft, Lock as LockIcon } from 'lucide-react';
import { generateSpeech } from '../src/services/aiService';
import { decodeBase64, pcmToWav } from '../src/lib/audioUtils';
import { motion, AnimatePresence } from 'motion/react';
import { CompanionAvatar } from './CompanionAvatar';

// --- MAGNIFICATION WRAPPER ---
const Magnify: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative group cursor-zoom-in overflow-hidden rounded-3xl"
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 pointer-events-none z-50 overflow-hidden rounded-3xl border-4 border-registry-teal/30"
          >
            <div 
              className="absolute inset-0 scale-[2] origin-center"
              style={{
                transform: `scale(2) translate(${50 - mousePos.x}%, ${50 - mousePos.y}%)`,
              }}
            >
              {children}
            </div>
            <div className="absolute top-4 right-4 bg-registry-teal text-stealth-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center space-x-1 shadow-lg">
              <Search className="w-3 h-3" />
              <span>Enhanced View</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- ULTRASOUND AESTHETIC OVERLAYS ---
export const GrainOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-20">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

export const ScanlineOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-[0.05]">
    <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
  </div>
);

// --- PHASE 3: ADVANCED SIMULATORS ---

export const BeamLab: React.FC = () => {
  const [focusDepth, setFocusDepth] = useState(5); // cm
  const [aperture, setAperture] = useState(10); // mm
  
  // Near Zone Length (NZL) = (D^2 * f) / 6
  // Simplified for visual: NZL proportional to D^2
  const nzl = (aperture * aperture) / 20;

  return (
    <div className="w-full bg-stealth-950 rounded-[2.5rem] p-5 md:p-8 border border-white/5 shadow-inner relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      <GrainOverlay />
      <ScanlineOverlay />
      
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 relative z-10">
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-base md:text-lg font-black uppercase italic text-white">Beam Forming Lab</h4>
              <p className="text-[9px] md:text-[10px] font-bold text-registry-teal uppercase tracking-widest">Neural Beam Synthesis</p>
            </div>
            <div className="text-right">
              <span className="text-xl md:text-2xl font-mono font-black text-registry-teal glow-teal">{nzl.toFixed(1)}cm</span>
              <p className="text-[8px] font-black uppercase text-slate-500">Near Zone Length</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-70 text-slate-400">
                <span>Aperture (mm)</span>
                <span>{aperture} mm</span>
              </div>
              <input 
                type="range" min="5" max="20" step="1" 
                value={aperture} 
                onChange={(e) => setAperture(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-70 text-slate-400">
                <span>Focus Depth (cm)</span>
                <span>{focusDepth} cm</span>
              </div>
              <input 
                type="range" min="1" max="15" step="0.5" 
                value={focusDepth} 
                onChange={(e) => setFocusDepth(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
              />
            </div>
          </div>

          <div className="p-4 bg-stealth-900 rounded-2xl border border-white/5">
            <h5 className="text-[9px] md:text-[10px] font-black uppercase text-registry-teal mb-2">Physics Rule</h5>
            <p className="text-[10px] md:text-[11px] font-medium leading-relaxed text-slate-300">
              Beam diameter at the focus is <span className="text-registry-teal font-bold">1/2 the aperture</span>. 
              At twice the NZL, the beam diameter returns to the original aperture size.
            </p>
          </div>
        </div>

        <div className="flex-1 relative h-48 md:h-64 bg-stealth-900 rounded-3xl overflow-hidden border border-white/5 flex items-center">
          <div className="absolute left-0 h-full w-4 bg-stealth-800 flex items-center justify-center border-r border-registry-teal/30">
             <span className="rotate-90 text-[8px] font-black text-white uppercase tracking-widest">Array</span>
          </div>
          
          <div className="flex-1 relative h-full">
            {/* Beam Visualization */}
            <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.2" />
                  <stop offset={`${(focusDepth / 15) * 100}%`} stopColor="#00d2ff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* The Beam Path */}
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
                stroke="#00d2ff"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
              
              {/* Focus Point Marker */}
              <motion.circle 
                animate={{ cx: (focusDepth / 15) * 200, cy: 50 }}
                r="2"
                fill="#d946ef"
                className="animate-pulse"
              />
            </svg>
            
            {/* Labels */}
            <div className="absolute top-2 left-2 text-[8px] font-black uppercase text-slate-400">Fresnel Zone</div>
            <div className="absolute top-2 right-2 text-[8px] font-black uppercase text-slate-400">Fraunhofer Zone</div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-registry-rose/5 rounded-2xl border border-registry-rose/10 flex items-start space-x-4">
        <div className="scale-50 -mx-8 -my-6 shrink-0">
          <CompanionAvatar state="idle" skin="stealth" />
        </div>
        <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
          <span className="font-black text-registry-rose uppercase italic mr-2">Harvey's Warning:</span> 
          Lateral resolution is BEST at the focal point because that's where the beam is narrowest. If your target is deeper than your focus, your lateral resolution will degrade significantly!
        </p>
      </div>
    </div>
  );
};

// --- INTERACTIVE SIMULATORS ---

export const AttenuationSimulator: React.FC = () => {
  const [frequency, setFrequency] = useState(5); // MHz
  const [depth, setDepth] = useState(10); // cm
  
  const attenuationCoefficient = frequency / 2;
  const totalAttenuation = attenuationCoefficient * depth;
  const intensityRemaining = Math.pow(10, -totalAttenuation / 10) * 100;

  return (
    <div className="w-full bg-slate-50 dark:bg-stealth-950 rounded-[2.5rem] p-6 md:p-8 border border-slate-200 dark:border-white/5 shadow-inner relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white">Attenuation Lab</h4>
              <p className="text-[10px] font-bold text-registry-teal uppercase tracking-widest">Energy Decay Monitor</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-registry-teal glow-teal">{intensityRemaining.toFixed(1)}%</span>
              <p className="text-[8px] font-black uppercase text-slate-500">Intensity Left</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
                <span>Frequency (MHz)</span>
                <span>{frequency} MHz</span>
              </div>
              <input 
                type="range" min="2" max="15" step="0.5" 
                value={frequency} 
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
                <span>Depth (cm)</span>
                <span>{depth} cm</span>
              </div>
              <input 
                type="range" min="1" max="20" step="1" 
                value={depth} 
                onChange={(e) => setDepth(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[8px] font-black uppercase opacity-50 mb-1">Atten. Coeff</p>
              <p className="text-sm font-bold">{attenuationCoefficient.toFixed(2)} dB/cm</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[8px] font-black uppercase opacity-50 mb-1">Total Loss</p>
              <p className="text-sm font-bold text-registry-rose">{totalAttenuation.toFixed(1)} dB</p>
            </div>
          </div>
        </div>

        <div className="flex-1 relative h-48 md:h-auto bg-slate-200 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-800">
          <div className="absolute inset-0 flex">
            {/* Simulation of beam weakening */}
            <div className="h-full w-4 bg-registry-teal/20 border-r border-registry-teal/30 flex items-center justify-center">
              <span className="rotate-90 text-[8px] font-black uppercase tracking-widest opacity-40 whitespace-nowrap">Transducer</span>
            </div>
            <div className="flex-1 relative">
              <motion.div 
                initial={false}
                animate={{ 
                  width: `${(depth / 20) * 100}%`,
                  opacity: intensityRemaining / 100
                }}
                className="absolute top-1/2 -translate-y-1/2 h-12 bg-gradient-to-r from-registry-teal to-transparent rounded-r-full shadow-[0_0_20px_rgba(0,210,255,0.3)]"
              />
              {/* Depth markers */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2 text-[8px] font-mono opacity-30">
                <span>0cm</span>
                <span>5cm</span>
                <span>10cm</span>
                <span>15cm</span>
                <span>20cm</span>
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
             <Activity className="w-4 h-4 text-registry-teal animate-pulse" />
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-registry-teal/5 rounded-2xl border border-registry-teal/10 flex items-start space-x-4">
        <div className="scale-50 -mx-8 -my-6 shrink-0">
          <CompanionAvatar state="idle" />
        </div>
        <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
          <span className="font-black text-registry-teal uppercase italic mr-2">Harvey's Insight:</span> 
          Notice how doubling the frequency doubles the attenuation coefficient. This is why high-frequency transducers are limited to superficial structures—the energy is "eaten" by the tissue much faster!
        </p>
      </div>
    </div>
  );
};

// --- INSIGHT COMPONENT ---

const VisualInsight: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    try {
      setIsLoading(true);
      const base64Audio = await generateSpeech(`Mature professional educator with a deep, authoritative voice: ${description}`, 'Charon');
      
      if (base64Audio) {
        const pcmData = decodeBase64(base64Audio);
        const wavBlob = pcmToWav(pcmData, 24000, 1);
        const audioSrc = URL.createObjectURL(wavBlob);
        
        const audio = document.createElement('audio');
        audio.src = audioSrc;
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("TTS Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-3 bg-registry-teal/5 border-l-2 border-registry-teal rounded-r-xl animate-in slide-in-from-left duration-500 group relative">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase text-registry-teal mb-1 flex items-center gap-1">
            <Info className="w-3 h-3" /> Insight: {title}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {description}
          </p>
        </div>
        <button 
          onClick={handlePlayAudio}
          disabled={isLoading}
          className="ml-2 p-1.5 rounded-lg bg-registry-teal/10 text-registry-teal hover:bg-registry-teal hover:text-stealth-950 transition-all disabled:opacity-50"
          title="Listen to narration"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse' : ''}`} />
          )}
        </button>
      </div>
    </div>
  );
};

// --- LECTURE TAG COMPONENT ---

export const LectureTag: React.FC<{ type: 'Concept' | 'Def' | 'Tip' | 'Not'; label: string; content: string }> = ({ type, label, content }) => {
  const colors = {
    Concept: 'bg-registry-cobalt/10 border-registry-cobalt text-registry-cobalt hover:bg-registry-cobalt/20',
    Def: 'bg-registry-teal/10 border-registry-teal text-registry-teal hover:bg-registry-teal/20',
    Tip: 'bg-registry-teal/10 border-registry-teal text-registry-teal hover:bg-registry-teal/20',
    Not: 'bg-registry-rose/10 border-registry-rose text-registry-rose hover:bg-registry-rose/20'
  };

  const icons = {
    Concept: <Sparkles className="w-3 h-3" />,
    Def: <Book className="w-3 h-3" />,
    Tip: <Zap className="w-3 h-3" />,
    Not: <AlertCircle className="w-3 h-3" />
  };

  return (
    <motion.div 
      whileHover={{ x: 4, scale: 1.01 }}
      className={`p-3 md:p-4 border-l-4 rounded-r-2xl ${colors[type]} mb-6 animate-in slide-in-from-left duration-500 cursor-default transition-colors shadow-sm hover:shadow-md`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icons[type]}
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{type}: {label}</span>
      </div>
      <p className="text-xs md:text-base font-medium leading-relaxed opacity-90 break-words">{content}</p>
    </motion.div>
  );
};

// --- BACKGROUND DECORATION ---

export const SonarPulse: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20 dark:opacity-10" aria-hidden="true">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] border border-registry-teal rounded-full animate-sonar" />
      <div className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] border border-registry-teal rounded-full animate-sonar" style={{ animationDelay: '1s' }} />
      <div className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] border border-registry-teal rounded-full animate-sonar" style={{ animationDelay: '2s' }} />
    </div>
  </div>
);

// --- CORE PHYSICS VISUALS ---

export const DopplerModalitiesVisual: React.FC = () => {
  const [active, setActive] = useState<'color' | 'power' | 'spectral'>('color');
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.05), 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 space-y-4 md:space-y-8 shadow-2xl transition-all duration-500 hover:shadow-registry-teal/10 p-6" 
      role="region" 
      aria-label="Doppler Modalities Simulator"
    >
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-registry-teal/10 rounded-xl border border-registry-teal/20">
            <Activity className="w-5 h-5 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Doppler Lab</h4>
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest mt-1">Flow Dynamics</p>
          </div>
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl overflow-x-auto scrollbar-hide">
          {['color', 'power', 'spectral'].map(m => (
            <button 
              key={m} 
              onClick={() => setActive(m as any)} 
              className={`px-4 py-2 md:py-3 text-[8px] md:text-[10px] font-black uppercase rounded-lg transition-all ${active === m ? 'bg-registry-teal text-stealth-950 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 md:h-64 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        
        <AnimatePresence mode="wait">
          {active === 'color' && (
            <motion.div 
              key="color"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="absolute inset-1/4 bg-blue-600/20 rounded-full blur-[40px] animate-pulse" />
              <div className="absolute inset-1/3 bg-red-600/20 rounded-full blur-[40px] animate-pulse delay-700" />
              <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.circle 
                    key={i}
                    cx={100 + i * 20}
                    cy={100 + Math.sin(time + i) * 10}
                    r={2 + Math.random() * 3}
                    fill={i % 2 === 0 ? "#d946ef" : "#3b82f6"}
                    animate={{ 
                      x: [0, 10, 0],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
                <text x="200" y="180" textAnchor="middle" fill="#3b82f6" className="text-[8px] font-black uppercase tracking-widest" opacity="0.6">Directional Flow</text>
              </svg>
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
              <div className="absolute inset-8 bg-orange-600/30 rounded-full blur-[60px] animate-pulse" />
              <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.circle 
                    key={i}
                    cx={50 + Math.random() * 300}
                    cy={50 + Math.random() * 100}
                    r={1 + Math.random() * 4}
                    fill="#f97316"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
                  />
                ))}
                <text x="200" y="180" textAnchor="middle" fill="#f97316" className="text-[8px] font-black uppercase tracking-widest" opacity="0.6">Amplitude Sensitivity</text>
              </svg>
            </motion.div>
          )}

          {active === 'spectral' && (
            <motion.div 
              key="spectral"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-4"
            >
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spectralGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path 
                  d={`M 0 120 ${Array.from({ length: 41 }).map((_, i) => {
                    const x = i * 10;
                    const val = Math.sin(time + i * 0.5) * 40 + Math.sin(time * 2 + i) * 10;
                    return `L ${x} ${100 - Math.max(0, val)}`;
                  }).join(' ')} L 400 120 Z`}
                  fill="url(#spectralGrad)"
                  stroke="#00e5ff"
                  strokeWidth="2"
                />
                <line x1="0" y1="120" x2="400" y2="120" stroke="white" strokeWidth="1" opacity="0.2" />
                <text x="10" y="20" fill="#00e5ff" className="text-[8px] font-black uppercase" opacity="0.6">Velocity (cm/s)</text>
                <text x="350" y="140" fill="#00e5ff" className="text-[8px] font-black uppercase" opacity="0.6">Time</text>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <VisualInsight 
        title="Doppler Modalities" 
        description={active === 'color' ? "Color Doppler uses the Doppler shift to visualize blood flow direction (BART: Blue Away, Red Toward) and relative velocity." : active === 'power' ? "Power Doppler ignores direction and focuses on the amplitude of the shift, making it highly sensitive to slow flow in small vessels." : "Spectral Doppler provides a quantitative display of blood flow velocities over time, allowing for precise measurements of peak systolic and end-diastolic velocities."} 
      />
    </motion.div>
  );
};

export const SideLobeVisual: React.FC = () => {
  const [showArtifacts, setShowArtifacts] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.05), 30);
    return () => clearInterval(interval);
  }, []);

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
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest mt-1">Energy Divergence</p>
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
          {/* Main Lobe */}
          <motion.path 
            d="M 180 20 Q 200 220 220 20" 
            fill="url(#mainLobeGrad)" 
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <defs>
            <linearGradient id="mainLobeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="sideLobeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d946ef" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Side Lobes */}
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
              
              {/* Off-axis Object */}
              <motion.circle 
                cx={130} cy={100} r={6} 
                fill="#d946ef" 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.path 
                d="M 130 100 L 200 150" 
                stroke="#d946ef" 
                strokeWidth="1" 
                strokeDasharray="4 2"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <text x="130" y="120" textAnchor="middle" fill="#d946ef" className="text-[7px] font-black uppercase">Artifact Source</text>
            </g>
          )}

          <rect x="170" y="10" width="60" height="10" fill="#1e293b" rx="2" />
          <text x="200" y="180" textAnchor="middle" fill="#00e5ff" className="text-[9px] font-black uppercase tracking-widest" opacity="0.6">Main Axis</text>
        </svg>
      </div>

      <VisualInsight 
        title="Side Lobes & Grating Lobes" 
        description="Side lobes are secondary beams of energy that diverge from the main axis. They can reflect off structures outside the main beam, causing artifacts where these off-axis structures appear as if they are within the main beam." 
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
            <p className="text-[8px] font-black text-registry-rose uppercase tracking-widest mt-1">PZT Ring-Down</p>
          </div>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase">Damping: {damping}%</div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        
        {/* PZT Element */}
        <motion.div 
          animate={isPulsing ? { scaleY: [1, 0.9, 1.1, 1], backgroundColor: ["#1e293b", "#d946ef", "#1e293b"] } : {}}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 border-b-2 border-registry-rose/50 rounded-b-lg z-20"
        />

        {/* Ring-down visualization */}
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

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
          <div className="text-[8px] font-black text-registry-rose uppercase tracking-[0.2em] mb-2 opacity-60">Blind Region</div>
          <div className="w-full h-px bg-registry-rose/20" />
          <div className="mt-4 text-[10px] font-black text-registry-teal uppercase tracking-widest animate-pulse">Active Imaging Zone</div>
        </div>

        {/* Waves during pulse */}
        {isPulsing && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 150, opacity: [0, 1, 0] }}
            className="absolute left-1/2 -translate-x-1/2 w-24 h-4 border-b-2 border-registry-teal/40 rounded-full"
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[8px] font-black uppercase text-slate-500">
          <span>High Damping (Short Pulse)</span>
          <span>Low Damping (Long Pulse)</span>
        </div>
        <input 
          type="range" 
          min="10" 
          max="90" 
          value={damping} 
          onChange={e => setDamping(Number(e.target.value))} 
          className="w-full h-1.5 accent-registry-rose bg-slate-800 rounded-lg appearance-none cursor-pointer" 
        />
      </div>

      <VisualInsight 
        title="The Dead Zone" 
        description={`The Dead Zone is the region closest to the transducer where imaging is impossible. It occurs because the PZT crystal is still vibrating (ringing) from the transmit pulse and cannot yet receive echoes. ${damping > 70 ? "High damping shortens the pulse and reduces the dead zone." : "Low damping results in a longer ring-down period and a larger dead zone."}`} 
      />
    </motion.div>
  );
};

export const LongitudinalWaveVisual: React.FC = () => {
  const [time, setTime] = useState(0);
  const [showPressure, setShowPressure] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.1), 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 rounded-[2rem] border border-white/5 shadow-xl space-y-4 transition-all hover:shadow-registry-teal/10 p-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-registry-teal/10 rounded-xl border border-registry-teal/20">
            <Waves className="w-5 h-5 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Wave Mechanics</h4>
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest mt-1">Particle Oscillation</p>
          </div>
        </div>
        <button 
          onClick={() => setShowPressure(!showPressure)} 
          className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${showPressure ? 'bg-registry-teal text-stealth-950' : 'bg-stealth-950 text-slate-500'}`}
        >
          {showPressure ? 'Hide Pressure' : 'Show Pressure'}
        </button>
      </div>

      <div className="h-48 md:h-64 bg-slate-950 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-800 shadow-inner p-4">
        <div className="absolute inset-0 scanline opacity-10" />
        
        {/* Particle Simulation */}
        <div className="flex justify-between w-full h-24 items-center relative z-10">
          {Array.from({ length: 32 }).map((_, i) => {
            const wave = Math.sin(time - i * 0.5);
            const xOffset = wave * 8;
            return (
              <motion.div 
                key={i} 
                className="w-1 h-12 md:h-20 rounded-full" 
                style={{ 
                  transform: `translateX(${xOffset}px)`, 
                  backgroundColor: wave > 0 ? '#00e5ff' : '#d946ef', 
                  opacity: 0.2 + (Math.abs(wave) * 0.8),
                  boxShadow: wave > 0.8 ? '0 0 10px #00e5ff' : 'none'
                }} 
              />
            );
          })}
        </div>

        {/* Pressure Graph Overlay */}
        {showPressure && (
          <div className="w-full h-24 mt-4 relative z-10 border-t border-white/10 pt-4">
            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
              <motion.path 
                d={`M 0 50 ${Array.from({ length: 41 }).map((_, i) => {
                  const x = i * 10;
                  const y = 50 + Math.sin(time - i * 0.5) * 40;
                  return `L ${x} ${y}`;
                }).join(' ')}`}
                fill="none"
                stroke="#00e5ff"
                strokeWidth="2"
                opacity="0.6"
              />
              <text x="10" y="15" fill="#00e5ff" className="text-[7px] font-black uppercase" opacity="0.4">Compression (+)</text>
              <text x="10" y="95" fill="#d946ef" className="text-[7px] font-black uppercase" opacity="0.4">Rarefaction (-)</text>
            </svg>
          </div>
        )}

        <div className="absolute bottom-2 flex space-x-8 text-[7px] font-black uppercase tracking-widest text-white/20">
          <span>Rarefaction</span>
          <span>Compression</span>
          <span>Rarefaction</span>
        </div>
      </div>

      <VisualInsight 
        title="Longitudinal Waves" 
        description="Ultrasound is a longitudinal mechanical wave. Particles oscillate back and forth parallel to the direction of wave travel, creating alternating zones of high pressure (compression) and low pressure (rarefaction)." 
      />
    </motion.div>
  );
};

export const SpeedOfSoundTable: React.FC = () => {
  const data = [
    { medium: "Air", speed: 330 },
    { medium: "Fat", speed: 1450 },
    { medium: "Soft Tissue", speed: 1540 },
    { medium: "Bone", speed: 3500 },
  ];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-md transition-colors duration-500">
      <div className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white p-3 text-[9px] font-black uppercase tracking-widest flex items-center space-x-2">
        <Ruler className="w-3.5 h-3.5 text-registry-teal" />
        <span>Propagation Speed (m/s)</span>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-slate-800">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">{item.medium}</span>
            <span className="text-sm font-black italic text-registry-teal">{item.speed}</span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <VisualInsight 
          title="Propagation Speed" 
          description="Sound travels fastest in solids (bone) and slowest in gases (air). Soft tissue is standardized at 1540 m/s for system calculations." 
        />
      </div>
    </div>
  );
};

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
          <text x="100" y="150" textAnchor="middle" fill="#3b82f6" className="text-[8px] font-black uppercase tracking-widest">Weak Input</text>
          <text x="300" y="180" textAnchor="middle" fill="#3b82f6" className="text-[10px] font-black uppercase tracking-widest">Amplified Output</text>
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
            d="M 50 100 Q 75 60 100 100 Q 125 140 150 100" fill="none" stroke="#00e5ff" strokeWidth="2" opacity="0.4" 
          />
          <motion.path 
            animate={{ strokeWidth: [2, 4, 2] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 250 100 Q 275 60 300 100 Q 325 140 350 100" fill="none" stroke="#00e5ff" strokeWidth="2" 
          />
          <text x="100" y="150" textAnchor="middle" fill="#00e5ff" className="text-[8px] font-black uppercase tracking-widest">Deep Echo (Weak)</text>
          <text x="300" y="180" textAnchor="middle" fill="#00e5ff" className="text-[10px] font-black uppercase tracking-widest">Compensated (Uniform)</text>
          <path d="M 170 100 L 230 100" stroke="#00e5ff" strokeWidth="2" markerEnd="url(#arrow)" />
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
          <text x="100" y="180" textAnchor="middle" fill="#06b6d4" className="text-[8px] font-black uppercase tracking-widest">Wide Range</text>
          <text x="300" y="150" textAnchor="middle" fill="#06b6d4" className="text-[10px] font-black uppercase tracking-widest">Compressed</text>
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
            d="M 50 100 L 60 80 L 70 120 L 80 70 L 90 130 L 100 100" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.4" strokeDasharray="4 2"
          />
          <motion.path 
            animate={{ strokeWidth: [3, 5, 3] }}
            transition={{ duration: 2, repeat: Infinity }}
            d="M 250 100 Q 275 60 300 70 Q 325 80 350 100" fill="none" stroke="#00e5ff" strokeWidth="3" 
          />
          <text x="75" y="150" textAnchor="middle" fill="#00e5ff" className="text-[8px] font-black uppercase tracking-widest">RF Signal</text>
          <text x="300" y="130" textAnchor="middle" fill="#00e5ff" className="text-[10px] font-black uppercase tracking-widest">Video Signal</text>
          <path d="M 170 100 L 230 100" stroke="#00e5ff" strokeWidth="2" markerEnd="url(#arrow)" />
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
            d="M 50 100 L 60 95 L 70 105 L 80 98 L 90 102 L 100 100" fill="none" stroke="#d946ef" strokeWidth="1" opacity="0.4" 
          />
          <motion.line 
            animate={{ strokeWidth: [3, 1, 3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            x1="250" y1="100" x2="350" y2="100" stroke="#d946ef" strokeWidth="3" 
          />
          <text x="75" y="130" textAnchor="middle" fill="#d946ef" className="text-[8px] font-black uppercase tracking-widest">Low Noise</text>
          <text x="300" y="130" textAnchor="middle" fill="#d946ef" className="text-[10px] font-black uppercase tracking-widest">Rejected</text>
          <path d="M 170 100 L 230 100" stroke="#d946ef" strokeWidth="2" markerEnd="url(#arrow)" />
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
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Receiver Pipeline</span>
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
            <span className="text-[9px] font-black uppercase tracking-tighter">{step.name}</span>
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

export const WaveParametersVisual: React.FC = () => {
  const [freq, setFreq] = useState(2);
  const [amp, setAmp] = useState(40);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.1), 30);
    return () => clearInterval(interval);
  }, []);

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
            <Activity className="w-5 h-5 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Wave Analyzer</h4>
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest mt-1">Signal Parameters</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-[10px] font-black text-registry-teal">{freq} MHz</div>
            <div className="text-[6px] font-black text-slate-500 uppercase">Frequency</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-black text-registry-rose">{amp} dB</div>
            <div className="text-[6px] font-black text-slate-500 uppercase">Amplitude</div>
          </div>
        </div>
      </div>

      <div className="h-40 md:h-56 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 relative z-10 shadow-inner">
        <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <motion.path 
            d={`M 0 60 ${Array.from({ length: 401 }).map((_, x) => {
              const y = 60 + Math.sin((x + time * 20) * 0.05 * freq) * amp;
              return `L ${x} ${y}`;
            }).join(' ')}`} 
            fill="none" 
            stroke="#00e5ff" 
            strokeWidth="3" 
            className="drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
          />
          
          {/* Measurement Lines */}
          <line x1="200" y1={60 - amp} x2="200" y2={60 + amp} stroke="#d946ef" strokeWidth="1" strokeDasharray="4 2" />
          <text x="210" y={60} fill="#d946ef" className="text-[7px] font-black uppercase">Amplitude</text>
          
          <line x1={100} y1="100" x2={100 + (200 / freq)} y2="100" stroke="#00e5ff" strokeWidth="1" />
          <text x={100 + (100 / freq)} y="110" textAnchor="middle" fill="#00e5ff" className="text-[7px] font-black uppercase">Wavelength</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="space-y-3">
           <div className="flex justify-between">
             <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Frequency</label>
             <span className="text-[8px] font-black text-registry-teal uppercase italic">Resolution focus</span>
           </div>
           <input type="range" min="1" max="5" step="0.5" value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="w-full accent-registry-teal h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="space-y-3">
           <div className="flex justify-between">
             <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Amplitude</label>
             <span className="text-[8px] font-black text-registry-rose uppercase italic">Power focus</span>
           </div>
           <input type="range" min="10" max="55" value={amp} onChange={(e) => setAmp(Number(e.target.value))} className="w-full accent-registry-rose h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>

      <VisualInsight 
        title="Wave Parameters" 
        description={`Frequency (${freq} MHz) determines resolution and penetration. Higher frequencies provide better detail but are absorbed more quickly. Amplitude (${amp} dB) represents the strength or loudness of the wave, which decreases as it travels through tissue (attenuation).`} 
      />
    </motion.div>
  );
};

export const IntensityProfileVisual: React.FC = () => {
  const [showAverage, setShowAverage] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.05), 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl space-y-4 transition-all hover:shadow-registry-teal/10"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-registry-teal/10 rounded-xl border border-registry-teal/20">
            <Zap className="w-5 h-5 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Intensity Lab</h4>
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest mt-1">Spatial & Temporal Distribution</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAverage(!showAverage)} 
          className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${showAverage ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'bg-stealth-950 text-slate-500'}`}
        >
          {showAverage ? 'Hide Average' : 'Show Average'}
        </button>
      </div>

      <div className="h-48 md:h-64 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-inner relative">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="intensityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Spatial Profile */}
          <motion.path 
            d={`M 0 180 ${Array.from({ length: 41 }).map((_, i) => {
              const x = i * 10;
              const dist = Math.abs(x - 200);
              const val = Math.exp(-(dist * dist) / 4000) * 150;
              return `L ${x} ${180 - val}`;
            }).join(' ')} L 400 180 Z`}
            fill="url(#intensityGrad)"
            stroke="#00e5ff"
            strokeWidth="2"
          />

          {/* Temporal Peaks */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.line 
              key={i}
              x1={80 + i * 60} y1="180" x2={80 + i * 60} y2={180 - (Math.sin(time + i) * 20 + 100)}
              stroke="#d946ef"
              strokeWidth="1"
              strokeDasharray="4 2"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}

          {showAverage && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1="0" y1="140" x2="400" y2="140" stroke="#00e5ff" strokeWidth="2" strokeDasharray="8 4" className="animate-pulse" />
              <text x="10" y="135" fill="#00e5ff" className="text-[7px] font-black uppercase">Temporal Average (TA)</text>
            </motion.g>
          )}

          <text x="200" y="195" textAnchor="middle" fill="#00e5ff" className="text-[7px] font-black uppercase tracking-widest" opacity="0.6">Spatial Distribution (Beam Center)</text>
          <text x="350" y="40" textAnchor="end" fill="#d946ef" className="text-[7px] font-black uppercase" opacity="0.6">Peak Intensity (SPTP)</text>
        </svg>
      </div>

      <VisualInsight 
        title="Intensity Distribution" 
        description="Intensity is not uniform. It is highest at the beam's center (Spatial Peak) and during the pulse transmission (Temporal Peak). SPTP is the highest intensity measurement, while SATA is the lowest. Bioeffects are most closely related to SPTA (Spatial Peak Temporal Average)." 
      />
    </motion.div>
  );
};

export const SpecularScatteringVisual: React.FC = () => {
  const [mode, setMode] = useState<'specular' | 'diffuse' | 'rayleigh'>('specular');
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.05), 30);
    return () => clearInterval(interval);
  }, []);

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
            <Repeat className="w-5 h-5 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Reflection Lab</h4>
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest mt-1">Boundary Interaction</p>
          </div>
        </div>
        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
          {(['specular', 'diffuse', 'rayleigh'] as const).map(m => (
            <button 
              key={m}
              onClick={() => setMode(m)} 
              className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${mode === m ? 'bg-registry-teal text-stealth-950 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl overflow-hidden relative flex items-center justify-center border border-slate-800 shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
              <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Interface Boundary */}
          {mode === 'specular' ? (
            <line x1="50" y1="150" x2="350" y2="150" stroke="white" strokeWidth="3" opacity="0.4" />
          ) : mode === 'diffuse' ? (
            <path 
              d={`M 50 150 ${Array.from({ length: 31 }).map((_, i) => {
                const x = 50 + i * 10;
                const y = 150 + Math.sin(x * 0.5) * 4;
                return `L ${x} ${y}`;
              }).join(' ')}`} 
              fill="none" 
              stroke="white" 
              strokeWidth="3" 
              opacity="0.4" 
            />
          ) : (
            <g opacity="0.4">
              {Array.from({ length: 10 }).map((_, i) => (
                <circle key={i} cx={100 + i * 20} cy={150 + Math.sin(i) * 5} r="2" fill="white" />
              ))}
            </g>
          )}

          {/* Incident Wave */}
          <motion.path 
            d="M 100 20 L 200 150" 
            stroke="url(#beamGrad)" 
            strokeWidth="8" 
            animate={{ strokeDashoffset: [100, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            strokeDasharray="10 5"
          />

          {/* Specular Reflection */}
          {mode === 'specular' && (
            <motion.path 
              d="M 200 150 L 300 20" 
              stroke="#00e5ff" 
              strokeWidth="4" 
              opacity="0.6"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {mode === 'diffuse' && (
            <g>
              {[-30, -15, 0, 15, 30].map((ang, i) => (
                <motion.line 
                  key={i}
                  x1="200" y1="150" 
                  x2={200 + Math.sin(ang * Math.PI / 180) * 100} 
                  y2={150 - Math.cos(ang * Math.PI / 180) * 100}
                  stroke="#00e5ff"
                  strokeWidth="1.5"
                  opacity="0.3"
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </g>
          )}

          {mode === 'rayleigh' && (
            <g>
              {Array.from({ length: 12 }).map((_, i) => {
                const ang = (i / 12) * Math.PI * 2;
                return (
                  <motion.line 
                    key={i}
                    x1="200" y1="150" 
                    x2={200 + Math.cos(ang) * 40} 
                    y2={150 + Math.sin(ang) * 40}
                    stroke="#d946ef"
                    strokeWidth="1"
                    animate={{ x2: 200 + Math.cos(ang) * 60, y2: 150 + Math.sin(ang) * 60, opacity: [0, 0.8, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  />
                );
              })}
            </g>
          )}

          <text x="200" y="180" textAnchor="middle" fill="white" className="text-[8px] font-black uppercase tracking-widest" opacity="0.4">
            {mode === 'specular' ? 'Smooth Boundary' : mode === 'diffuse' ? 'Rough Boundary' : 'Small Scatterers (RBCs)'}
          </text>
        </svg>
      </div>

      <VisualInsight 
        title="Reflection & Scattering" 
        description={mode === 'specular' ? "Specular reflection occurs at large, smooth boundaries (like the diaphragm). The reflection is highly directional, like a mirror." : mode === 'diffuse' ? "Diffuse reflection (backscatter) occurs at rough boundaries. Energy is reflected in many directions, allowing the boundary to be seen from various angles." : "Rayleigh scattering occurs when the reflector is much smaller than the wavelength (like Red Blood Cells). Energy is scattered equally in all directions."} 
      />
    </motion.div>
  );
};

export const AliasingVisual: React.FC = () => {
  const [prf, setPrf] = useState(50);
  const [velocity, setVelocity] = useState(70);
  
  const nyquistLimit = prf / 2;
  const isAliasing = velocity > nyquistLimit;

  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-registry-rose/10 rounded-xl border border-registry-rose/20 shadow-lg shadow-registry-rose/10">
            <Activity className="w-6 h-6 text-registry-rose" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white leading-none">Aliasing Lab</h3>
            <p className="text-[8px] font-black text-registry-rose uppercase tracking-[0.3em] mt-1">Nyquist Limit Monitor</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${isAliasing ? 'bg-registry-rose text-white animate-pulse' : 'bg-registry-teal text-slate-900 dark:text-stealth-950'}`}>
            {isAliasing ? 'ALIASING DETECTED' : 'SIGNAL STABLE'}
          </div>
        </div>
      </div>

      <div className="h-48 bg-slate-50 dark:bg-black rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 relative flex items-center justify-center p-4 neural-grid">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          {/* Baseline */}
          <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
          
          {/* Nyquist Limits */}
          <line x1="0" y1={100 - nyquistLimit} x2="400" y2={100 - nyquistLimit} stroke="#d946ef" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
          <line x1="0" y1={100 + nyquistLimit} x2="400" y2={100 + nyquistLimit} stroke="#d946ef" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
          
          {/* Signal Wave */}
          <path 
            d={`M 0 100 ${Array.from({ length: 401 }).map((_, x) => {
              let y = 100 - Math.sin(x * 0.1) * velocity;
              // Simple aliasing wrap-around visual
              if (y < 100 - nyquistLimit) y = 100 + nyquistLimit - ( (100 - nyquistLimit) - y );
              if (y > 100 + nyquistLimit) y = 100 - nyquistLimit + ( y - (100 + nyquistLimit) );
              return `L ${x} ${y}`;
            }).join(' ')}`} 
            fill="none" 
            stroke={isAliasing ? "#d946ef" : "#00e5ff"} 
            strokeWidth="2" 
            className="transition-all duration-300"
          />
          
          <text x="10" y={100 - nyquistLimit - 5} fill="#d946ef" className="text-[8px] font-black uppercase opacity-60">Nyquist Limit</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>PRF (Sampling Rate)</span>
            <span className="text-registry-teal">{prf} kHz</span>
          </div>
          <input 
            type="range" min="20" max="100" step="1" 
            value={prf} 
            onChange={(e) => setPrf(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Flow Velocity</span>
            <span className="text-registry-rose">{velocity} cm/s</span>
          </div>
          <input 
            type="range" min="10" max="100" step="1" 
            value={velocity} 
            onChange={(e) => setVelocity(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose"
          />
        </div>
      </div>

      <VisualInsight 
        title="The Nyquist Limit" 
        description="Aliasing occurs when the Doppler shift exceeds half of the Pulse Repetition Frequency (PRF). To fix it, increase your PRF, lower your frequency, or shift your baseline." 
      />
    </div>
  );
};

export const ColorVarianceVisual: React.FC = () => {
  const [isVariance, setIsVariance] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.05), 30);
    return () => clearInterval(interval);
  }, []);

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
            <Layers className="w-5 h-5 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-white leading-none">Color Mapping</h4>
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest mt-1">Velocity vs Variance</p>
          </div>
        </div>
        <button 
          onClick={() => setIsVariance(!isVariance)}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${isVariance ? 'bg-registry-teal text-stealth-950' : 'bg-white/5 text-slate-400 hover:text-white'}`}
        >
          {isVariance ? 'Variance Mode' : 'Velocity Mode'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 h-48 md:h-64 relative z-10">
        {/* Velocity Scale */}
        <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-slate-950 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-black to-blue-600 opacity-80" />
          <div className="absolute inset-0 scanline opacity-20" />
          <div className="flex-1 flex flex-col justify-between p-4 text-[8px] font-black text-white/40 uppercase tracking-widest">
            <span>Toward</span>
            <span className="text-center">Baseline</span>
            <span className="text-right">Away</span>
          </div>
        </div>

        {/* Variance Scale */}
        <div className={`relative rounded-3xl overflow-hidden border border-white/5 bg-slate-950 transition-all duration-700 ${isVariance ? 'opacity-100 scale-100' : 'opacity-20 scale-95 grayscale'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 opacity-80" />
          <div className="absolute inset-0 scanline opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            {!isVariance && <LockIcon className="w-8 h-8 text-white/20" />}
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-[8px] font-black text-white/60 uppercase tracking-widest">
            Turbulence Indicator
          </div>
        </div>
      </div>

      <div className="h-24 bg-slate-950 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 scanline opacity-10" />
        <div className="flex space-x-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={i}
              animate={{ 
                height: [20, 40 + Math.sin(time + i * 0.5) * 20, 20],
                backgroundColor: isVariance 
                  ? ["#ef4444", "#facc15", "#22c55e", "#ef4444"] 
                  : ["#ef4444", "#000000", "#3b82f6", "#ef4444"]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="w-2 rounded-full opacity-60"
            />
          ))}
        </div>
      </div>

      <VisualInsight 
        title="Color Variance Mapping" 
        description={isVariance 
          ? "Variance mode adds a horizontal dimension to the color map (usually green/yellow) to represent the spread of velocities. This is critical for identifying turbulent flow in stenotic regions." 
          : "Standard velocity mapping uses BART (Blue Away, Red Toward) to show mean velocity and direction. It cannot distinguish between laminar and turbulent flow as effectively as variance mode."} 
      />
    </motion.div>
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
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest mt-1">Pre vs Post Matrix</p>
          </div>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setIsPost(false)}
            className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${!isPost ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Pre
          </button>
          <button 
            onClick={() => setIsPost(true)}
            className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${isPost ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
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
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Analog Signal</span>
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
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Scan Converter</span>
                </div>
              </div>
              <div className="p-4 bg-registry-teal/5 border border-registry-teal/10 rounded-2xl text-center">
                <p className="text-[10px] font-black text-registry-teal uppercase tracking-widest">Live Data Stream (Permanent Changes)</p>
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
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Stored Data</span>
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
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Display Output</span>
                </div>
              </div>
              <div className="p-4 bg-registry-rose/5 border border-registry-rose/10 rounded-2xl text-center">
                <p className="text-[10px] font-black text-registry-rose uppercase tracking-widest">Frozen Data (Non-Destructive Changes)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className={`p-4 rounded-2xl border transition-all ${!isPost ? 'bg-registry-teal/10 border-registry-teal/30' : 'bg-slate-900 border-white/5 opacity-40'}`}>
          <h5 className="text-[8px] font-black uppercase text-registry-teal mb-2">Pre-Processing</h5>
          <ul className="text-[9px] font-bold text-slate-400 space-y-1">
            <li>• TGC / Gain</li>
            <li>• Write Zoom</li>
            <li>• Persistence</li>
          </ul>
        </div>
        <div className={`p-4 rounded-2xl border transition-all ${isPost ? 'bg-registry-rose/10 border-registry-rose/30' : 'bg-slate-900 border-white/5 opacity-40'}`}>
          <h5 className="text-[8px] font-black uppercase text-registry-rose mb-2">Post-Processing</h5>
          <ul className="text-[9px] font-bold text-slate-400 space-y-1">
            <li>• Read Zoom</li>
            <li>• B-Color Maps</li>
            <li>• Frozen Measurements</li>
          </ul>
        </div>
      </div>

      <VisualInsight 
        title="Processing Matrix" 
        description={!isPost 
          ? "Pre-processing occurs before data is stored in the scan converter. These changes are permanent and cannot be reversed on frozen images. If you didn't get it right during the live scan, you can't fix it later." 
          : "Post-processing occurs after storage in the scan converter. These changes can be applied to frozen images and are non-destructive. You can change B-color maps or perform measurements on a frozen frame."} 
      />
    </motion.div>
  );
};

export const WaveInteractionVisual: React.FC = () => {
  const [mode, setMode] = useState<'reflection' | 'refraction' | 'scattering'>('reflection');
  const [angle, setAngle] = useState(30);
  const rad = (angle * Math.PI) / 180;
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-x-auto scrollbar-hide relative z-10">
        {(['reflection', 'refraction', 'scattering'] as const).map(m => (
          <button 
            key={m} 
            onClick={() => setMode(m)} 
            className={`flex-1 min-w-[100px] px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === m ? 'bg-registry-teal text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="h-48 md:h-64 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 relative shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="mediumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          
          {/* Interface */}
          <rect x="0" y="100" width="400" height="100" fill="url(#mediumGrad)" />
          <line x1="0" y1="100" x2="400" y2="100" stroke="#00e5ff" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
          <text x="10" y="90" fill="#00e5ff" className="text-[8px] font-black uppercase opacity-40 tracking-widest">Medium 1</text>
          <text x="10" y="115" fill="#00e5ff" className="text-[8px] font-black uppercase opacity-40 tracking-widest">Medium 2</text>

          {/* Incident Ray */}
          <motion.line 
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            x1={200 - Math.sin(rad)*100} y1={100 - Math.cos(rad)*100} 
            x2={200} y2={100} 
            stroke="#00e5ff" 
            strokeWidth="4" 
            strokeDasharray="10 5"
          />
          <text x={200 - Math.sin(rad)*60} y={100 - Math.cos(rad)*60 - 10} textAnchor="middle" fill="#00e5ff" className="text-[8px] font-black uppercase italic">Incident</text>

          {mode === 'reflection' && (
            <motion.line 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, strokeDashoffset: [0, 20] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              x1={200} y1={100} 
              x2={200 + Math.sin(rad)*100} y2={100 - Math.cos(rad)*100} 
              stroke="#0ea5e9" 
              strokeWidth="3" 
              strokeDasharray="10 5"
              opacity="0.8"
            />
          )}

          {mode === 'refraction' && (
            <motion.line 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, strokeDashoffset: [0, -20] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              x1={200} y1={100} 
              x2={200 + Math.sin(rad * 1.5)*100} y2={100 + Math.cos(rad * 1.5)*100} 
              stroke="#d946ef" 
              strokeWidth="3" 
              strokeDasharray="10 5"
              opacity="0.8"
            />
          )}

          {mode === 'scattering' && Array.from({length: 8}).map((_, i) => {
            const ang = (i * Math.PI * 2) / 8;
            return (
              <motion.line 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0], x: [0, Math.cos(ang)*40], y: [0, Math.sin(ang)*40] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                x1={200} y1={100} x2={200} y2={100}
                stroke="#FACC15" strokeWidth="2"
              />
            );
          })}

          <circle cx={200} cy={100} r="6" fill="#FACC15" className="drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
        </svg>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Angle of Incidence: {angle}°</label>
          <span className="text-[10px] font-mono text-registry-teal">{angle === 0 ? "Normal Incidence" : "Oblique Incidence"}</span>
        </div>
        <input 
          type="range" min="0" max="60" 
          value={angle} 
          onChange={(e) => setAngle(Number(e.target.value))} 
          className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal" 
        />
      </div>

      <div className="relative z-10">
        <VisualInsight 
          title="Wave Interaction" 
          description={mode === 'reflection' ? "Specular reflection occurs at large, smooth interfaces. Energy is returned to the probe if the beam is perpendicular." : mode === 'refraction' ? "Refraction is the bending of the beam as it crosses an interface with different propagation speeds. Requires oblique incidence." : "Scattering occurs when sound hits small or rough reflectors (like red blood cells), sending energy in many directions."} 
        />
      </div>
    </div>
  );
};

export const ArrayTypesVisual: React.FC = () => {
  const [type, setType] = useState<'linear' | 'curved' | 'phased'>('linear');
  const [time, setTime] = useState(0);
  useEffect(() => { const interval = setInterval(() => setTime(t => (t + 1) % 100), 50); return () => clearInterval(interval); }, []);
  
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl relative z-10">
        {(['linear', 'curved', 'phased'] as const).map(t => (
          <button 
            key={t} 
            onClick={() => setType(t)} 
            className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${type === t ? 'bg-registry-teal text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="h-48 md:h-64 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 flex items-start justify-center p-6 relative shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          {type === 'linear' && (
            <g>
              {Array.from({length: 12}).map((_, i) => (
                <motion.line 
                  key={i} 
                  x1={100 + i*18} y1="20" x2={100 + i*18} y2="180" 
                  stroke="#00e5ff" 
                  strokeWidth="3" 
                  animate={{ opacity: (time % 12 === i) ? 0.8 : 0.1 }}
                />
              ))}
              <rect x="90" y="10" width="220" height="10" fill="#1e293b" rx="2" />
            </g>
          )}
          {type === 'curved' && (
            <g>
              {Array.from({length: 12}).map((_, i) => {
                const ang = (i - 5.5) * 0.15;
                return (
                  <motion.line 
                    key={i} 
                    x1={200 + Math.sin(ang)*40} y1={20 + Math.cos(ang)*10} 
                    x2={200 + Math.sin(ang)*180} y2={20 + Math.cos(ang)*180} 
                    stroke="#00e5ff" 
                    strokeWidth="3" 
                    animate={{ opacity: (time % 12 === i) ? 0.8 : 0.1 }}
                  />
                );
              })}
              <path d="M 140 35 Q 200 15 260 35" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
            </g>
          )}
          {type === 'phased' && (
            <g>
              {Array.from({length: 20}).map((_, i) => {
                const scanAng = Math.sin(time * 0.1) * 0.6;
                const beamAng = scanAng + (i - 9.5) * 0.02;
                return (
                  <motion.line 
                    key={i} 
                    x1={200} y1="20" 
                    x2={200 + Math.sin(beamAng)*170} y2={20 + Math.cos(beamAng)*170} 
                    stroke="#d946ef" 
                    strokeWidth="1.5" 
                    animate={{ opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                );
              })}
              <rect x="185" y="10" width="30" height="10" fill="#1e293b" rx="2" />
            </g>
          )}
        </svg>
      </div>

      <div className="relative z-10">
        <VisualInsight 
          title="Transducer Arrays" 
          description={type === 'linear' ? "Linear Sequential Arrays fire small groups of elements in sequence to create a rectangular image. Used for vascular and small parts." : type === 'curved' ? "Curved (Convex) Arrays have a curved face that creates a blunted sector image with a wide field of view. Used for abdominal imaging." : "Phased Arrays fire all elements with tiny time delays (phasing) to steer and focus the beam electronically. Ideal for cardiac imaging."} 
        />
      </div>
    </div>
  );
};

export const FresnelFraunhoferVisual: React.FC = () => {
  const [frequency, setFrequency] = useState(5);
  const nearZoneLength = frequency * 20; // Simplified logic for visual
  
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-registry-teal" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Beam Zones</span>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">
          <span className="text-[10px] font-black text-registry-teal uppercase tracking-widest">{frequency} MHz</span>
        </div>
      </div>

      <div className="h-40 md:h-48 bg-slate-950 rounded-3xl overflow-hidden flex items-center justify-center p-6 border border-slate-800 relative shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 150">
          {/* Near Zone (Fresnel) */}
          <motion.path 
            animate={{ d: `M 10 40 L ${nearZoneLength} 65 L ${nearZoneLength} 85 L 10 110 Z` }}
            fill="#00e5ff20" 
            stroke="#00e5ff60" 
            strokeWidth="2"
          />
          <text x={nearZoneLength / 2} y="130" textAnchor="middle" fill="#00e5ff" className="text-[8px] font-black uppercase tracking-widest opacity-60">Near Zone (Fresnel)</text>

          {/* Far Zone (Fraunhofer) */}
          <motion.path 
            animate={{ d: `M ${nearZoneLength} 65 L 390 20 L 390 130 L ${nearZoneLength} 85 Z` }}
            fill="#00e5ff05" 
            stroke="#00e5ff20" 
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text x={(400 + nearZoneLength) / 2} y="145" textAnchor="middle" fill="#00e5ff" className="text-[8px] font-black uppercase tracking-widest opacity-40">Far Zone (Fraunhofer)</text>

          {/* Focal Point */}
          <motion.circle 
            animate={{ cx: nearZoneLength }}
            cy="75" r="4" fill="#d946ef" 
            className="drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
          />
          <text x={nearZoneLength} y="60" textAnchor="middle" fill="#d946ef" className="text-[7px] font-black uppercase italic">Focus</text>

          {/* Transducer */}
          <rect x="0" y="40" width="10" height="70" fill="#1e293b" rx="2" />
        </svg>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Frequency (MHz)</label>
          <span className="text-[10px] font-mono text-slate-400">Higher Freq = Longer Near Zone</span>
        </div>
        <input 
          type="range" min="2" max="10" 
          value={frequency} 
          onChange={e => setFrequency(Number(e.target.value))} 
          className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal" 
        />
      </div>

      <div className="relative z-10">
        <VisualInsight 
          title="Beam Zones" 
          description="The Near Zone (Fresnel) is where the beam converges to its narrowest point (the focus). The Far Zone (Fraunhofer) is where the beam diverges. Higher frequency and larger aperture increase the Near Zone Length." 
        />
      </div>
    </div>
  );
};

export const BeamFocusVisual: React.FC = () => {
  const [focalDepth, setFocalDepth] = useState(50);
  
  // Calculate beam path points
  const focalX = 50 + (focalDepth * 3);
  const focalY = 100;
  const beamWidth = 10; // Width at focus
  const transducerWidth = 120;
  
  return (
    <div className="bg-white dark:bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border tech-border shadow-2xl space-y-6 transition-all duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-registry-teal" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Beam Convergence Control</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-registry-teal rounded-full animate-pulse" />
          <span className="text-[8px] font-mono text-registry-teal">CALIBRATED</span>
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 relative flex items-center shadow-inner p-4 neural-grid">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          {/* Near Zone (Fresnel) */}
          <path 
            d={`M 10 ${100 - transducerWidth/2} L ${focalX} ${focalY - beamWidth/2} L ${focalX} ${focalY + beamWidth/2} L 10 ${100 + transducerWidth/2} Z`} 
            fill="#00e5ff15" 
            stroke="#00e5ff" 
            strokeWidth="1"
            className="transition-all duration-300"
          />
          
          {/* Far Zone (Fraunhofer) */}
          <path 
            d={`M ${focalX} ${focalY - beamWidth/2} L 390 0 L 390 200 L ${focalX} ${focalY + beamWidth/2} Z`} 
            fill="#00e5ff05" 
            stroke="#00e5ff" 
            strokeWidth="1" 
            strokeDasharray="4 4"
            className="transition-all duration-300"
          />

          {/* Focal Point Glow */}
          <circle cx={focalX} cy={focalY} r="15" fill="#00e5ff20" className="animate-pulse" />
          <circle cx={focalX} cy={focalY} r="4" fill="#00e5ff" />

          {/* Transducer Face */}
          <rect x="0" y={100 - transducerWidth/2} width="10" height={transducerWidth} fill="#475569" rx="4" />
          
          <text x={focalX} y={focalY - 20} textAnchor="middle" fill="#00e5ff" className="text-[10px] font-black uppercase tracking-widest">Focus</text>
        </svg>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Focal Depth Adjustment</span>
          <span className="text-xs font-mono text-registry-teal">{focalDepth}mm</span>
        </div>
        <input 
          type="range" 
          min="20" 
          max="80" 
          value={focalDepth} 
          onChange={e => setFocalDepth(Number(e.target.value))} 
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal" 
        />
      </div>

      <VisualInsight 
        title="Beam Focusing" 
        description="Focusing improves lateral resolution by narrowing the beam width at a specific depth. The beam converges in the Near Zone and diverges in the Far Zone." 
      />
    </div>
  );
};

export const TGCVisual: React.FC = () => {
  const [tgc, setTgc] = useState([10, 20, 40, 60, 80]);
  
  const updateTgc = (idx: number, val: number) => {
    const newTgc = [...tgc];
    newTgc[idx] = val;
    setTgc(newTgc);
  };

  return (
    <div className="bg-white dark:bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border tech-border shadow-2xl space-y-6 transition-all duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-registry-teal" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Time Gain Compensation</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-registry-teal rounded-full animate-pulse" />
          <span className="text-[8px] font-mono text-registry-teal">SYNCED</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="h-48 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 relative flex items-center justify-center p-4 neural-grid">
          <div className="absolute inset-0 scanline opacity-10" />
          <svg className="w-full h-full relative z-10" viewBox="0 0 200 200">
            {/* TGC Curve */}
            <path 
              d={`M 20 20 ${tgc.map((v, i) => `L ${20 + v} ${20 + (i + 1) * 30}`).join(' ')}`} 
              fill="none" 
              stroke="#00e5ff" 
              strokeWidth="3" 
              className="transition-all duration-300"
            />
            {/* Grid Lines */}
            {[20, 50, 80, 110, 140, 170].map(y => (
              <line key={y} x1="20" y1={y} x2="180" y2={y} stroke="white" strokeWidth="1" opacity="0.1" />
            ))}
            <text x="100" y="195" textAnchor="middle" fill="#00e5ff" className="text-[8px] font-black uppercase tracking-widest">Amplification Curve</text>
          </svg>
        </div>

        <div className="flex flex-col justify-between py-2">
          {tgc.map((v, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[8px] font-black text-slate-500 w-8 uppercase tracking-tighter">Z{i+1}</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={v} 
                onChange={e => updateTgc(i, Number(e.target.value))} 
                className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal" 
              />
            </div>
          ))}
        </div>
      </div>

      <VisualInsight 
        title="TGC (Compensation)" 
        description="TGC compensates for attenuation by increasing amplification as depth increases. This creates an image with uniform brightness from top to bottom." 
      />
    </div>
  );
};

export const PulseEchoPrincipleVisual: React.FC = () => {
  const [depth, setDepth] = useState(50);
  return (
    <div className="bg-white dark:bg-slate-950 p-4 md:p-8 rounded-[2rem] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl transition-colors duration-500">
       <div className="flex justify-between items-center">
         <h5 className="text-[8px] md:text-[10px] font-black uppercase text-registry-teal">13 µs Rule</h5>
         <span className="text-sm md:text-xl font-black italic tracking-tighter text-registry-teal">{depth * 13} µs</span>
       </div>
       <div className="h-20 md:h-24 bg-black rounded-xl relative flex items-center p-4 border border-white/5 shadow-inner overflow-hidden">
          <div className="absolute left-4 w-2 h-10 md:h-14 bg-registry-teal rounded-lg shadow-[0_0_15px_rgba(0,245,212,0.4)]" />
          <div className="absolute h-14 w-4 bg-registry-rose/10 border border-registry-rose/20 rounded-lg transition-all" style={{ left: `${depth}%` }} />
       </div>
       <input type="range" min="10" max="90" value={depth} onChange={e => setDepth(Number(e.target.value))} className="w-full h-1 accent-registry-teal" />
       <VisualInsight 
         title="13 Microsecond Rule" 
         description="In soft tissue, it takes 13 µs for sound to travel 1 cm and return. Total round-trip time determines the depth displayed on the screen." 
       />
    </div>
  );
};

export const DisplayModesVisual: React.FC = () => {
  const [mode, setMode] = useState<'A' | 'B' | 'M'>('B');
  return (
    <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
      <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
        {(['A', 'B', 'M'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${mode === m ? 'bg-registry-teal text-stealth-950' : 'text-slate-500'}`}>{m}-Mode</button>
        ))}
      </div>
      <div className="h-32 md:h-40 bg-slate-950 rounded-xl overflow-hidden p-4 border border-slate-800 flex items-center justify-center">
        {mode === 'A' && <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none"><path d={`M 0 130 ${Array.from({ length: 30 }).map((_, i) => `L ${i * 13} ${130 - (Math.random() > 0.9 ? 80 : 5)}`).join(' ')}`} fill="none" stroke="#00e5ff" strokeWidth="3" /></svg>}
        {mode === 'B' && <div className="grid grid-cols-6 gap-2 h-full w-full">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white self-center mx-auto" style={{ opacity: Math.random() * 0.6 + 0.1 }} />)}</div>}
        {mode === 'M' && <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none"><path d={`M 0 75 ${Array.from({ length: 400 }).map((_, i) => `L ${i} ${75 + Math.sin(i * 0.08) * 20}`).join(' ')}`} fill="none" stroke="#38bdf8" strokeWidth="2" /></svg>}
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
      <div className="w-full h-4 md:h-6 bg-slate-200 dark:bg-stealth-950 rounded-full overflow-hidden border-2 border-slate-300 dark:border-white/10 shadow-inner">
         <div className={`h-full transition-all duration-1000 ${index > 1.5 ? 'bg-registry-rose' : index > 0.7 ? 'bg-registry-amber' : 'bg-registry-teal'}`} style={{ width: `${(index/2.5) * 100}%` }} />
      </div>
      <div className="p-6 md:p-10 bg-slate-50 dark:bg-stealth-950 rounded-2xl text-slate-900 dark:text-white text-center w-full shadow-inner border border-slate-200 dark:border-white/5">
         <h4 className="text-4xl md:text-6xl font-black italic tracking-tighter tabular-nums leading-none">{index.toFixed(1)}</h4>
         <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-2 ${index > 1.5 ? 'text-registry-rose' : index > 0.7 ? 'text-registry-amber' : 'text-registry-teal'}`}>{index > 1.5 ? 'Critical Warning' : index > 0.7 ? 'Safe Limit' : 'Optimal'}</p>
      </div>
      <input type="range" min="0.1" max="2.5" step="0.1" value={index} onChange={e => setIndex(Number(e.target.value))} className="w-full h-1 accent-rose-600" />
      <VisualInsight 
        title="Safety Indices" 
        description="The Thermal Index (TI) monitors heat production in tissue. The Mechanical Index (MI) monitors the likelihood of cavitation. Always follow the ALARA principle." 
      />
    </div>
  );
};

export const HemodynamicsPrinciplesVisual: React.FC = () => {
  const [radius, setRadius] = useState(2);
  const flow = Math.pow(radius, 4);
  return (
    <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-6 text-center">
       <div className="h-32 md:h-40 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 shadow-inner">
          <div className="bg-registry-rose/10 border-2 border-registry-rose rounded-full transition-all duration-700 flex items-center justify-center" style={{ width: `${radius * 30}px`, height: `${radius * 30}px` }}><Droplets className="text-registry-rose w-1/3 h-1/3" /></div>
       </div>
       <div className="flex justify-around items-center bg-slate-50 dark:bg-stealth-950 p-3 rounded-xl border border-slate-200 dark:border-white/5">
          <div><p className="text-[7px] font-black uppercase mb-0.5 text-slate-500">Radius</p><p className="text-lg font-black text-slate-900 dark:text-white">{radius}x</p></div>
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
          <div><p className="text-[7px] text-registry-rose font-black uppercase mb-0.5">Flow (Q)</p><p className="text-xl font-black text-registry-rose">{flow.toFixed(0)}x</p></div>
       </div>
       <input type="range" min="1" max="3" step="0.5" value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-full h-1 accent-rose-600" />
       <VisualInsight 
         title="Poiseuille's Law" 
         description="Flow volume is proportional to the vessel radius to the 4th power. A small change in radius leads to a massive change in flow volume." 
       />
    </div>
  );
};

export const HarmonicImagingVisual: React.FC = () => {
  const [showHarmonic, setShowHarmonic] = useState(false);
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-registry-teal" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Harmonic Imaging</span>
        </div>
        <button 
          onClick={() => setShowHarmonic(!showHarmonic)} 
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all duration-300 shadow-lg ${showHarmonic ? 'bg-registry-teal text-white ring-4 ring-registry-teal/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
        >
          {showHarmonic ? 'Harmonic Mode' : 'Fundamental Mode'}
        </button>
      </div>

      <div className="h-40 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 p-4 flex items-center shadow-inner relative">
        <div className="absolute top-2 left-4 flex space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-registry-teal opacity-30" />
            <span className="text-[8px] font-mono text-slate-500 uppercase">Fundamental (f₀)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-registry-rose" />
            <span className="text-[8px] font-mono text-slate-500 uppercase">2nd Harmonic (2f₀)</span>
          </div>
        </div>

        <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="harmonicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Fundamental Wave */}
          <motion.path 
            animate={{ 
              opacity: showHarmonic ? 0.1 : 0.4,
              strokeWidth: showHarmonic ? 1 : 2
            }}
            d={`M 0 60 ${Array.from({ length: 200 }).map((_, x) => `L ${x*2} ${60 + Math.sin(x * 0.1) * 40}`).join(' ')}`} 
            fill="none" 
            stroke="#00e5ff" 
            className="transition-all duration-500"
          />
          
          {/* Harmonic Wave */}
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: showHarmonic ? 1 : 0.2,
              strokeWidth: showHarmonic ? 3 : 1.5,
              y: showHarmonic ? 0 : 0
            }}
            d={`M 0 60 ${Array.from({ length: 200 }).map((_, x) => `L ${x*2} ${60 + Math.sin(x * 0.2) * 20}`).join(' ')}`} 
            fill="none" 
            stroke="#d946ef" 
            className="transition-all duration-500"
          />

          {/* Scanning Effect */}
          <motion.rect
            animate={{ x: [0, 400] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            width="2"
            height="120"
            fill="white"
            opacity="0.1"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <VisualInsight 
          title="Harmonic Imaging" 
          description="Harmonics are created as sound travels through tissue. Harmonic imaging filters out the fundamental frequency and uses these higher frequencies to reduce clutter and improve lateral resolution." 
        />
      </div>
    </div>
  );
};

export const TransducerCrossSection: React.FC = () => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const parts = [
    { id: 'case', name: 'Plastic Case', color: 'bg-slate-300 dark:bg-slate-700', desc: 'Protects internal components and prevents electrical shock.' },
    { id: 'backing', name: 'Backing Material', color: 'bg-slate-500 dark:bg-slate-900', desc: 'Dampens PZT vibration to shorten pulse duration and improve axial resolution.' },
    { id: 'pzt', name: 'PZT Crystal', color: 'bg-registry-teal', desc: 'The active element that converts electrical energy into sound and vice versa.' },
    { id: 'matching', name: 'Matching Layer', color: 'bg-registry-teal-secondary', desc: 'Reduces impedance mismatch between PZT and skin (1/4 wavelength thick).' },
    { id: 'lens', name: 'Acoustic Lens', color: 'bg-registry-cobalt', desc: 'Focuses the beam in the elevation (3rd) dimension.' },
  ];

  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/5 flex flex-col items-center space-y-8 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="relative flex flex-col items-center z-10">
        {/* The Transducer Stack */}
        <div className="w-32 md:w-48 flex flex-col items-center border-4 border-slate-200 dark:border-slate-800 rounded-t-[3rem] overflow-hidden shadow-2xl bg-slate-950">
          <div 
            onMouseEnter={() => setHoveredPart('case')}
            onMouseLeave={() => setHoveredPart(null)}
            className={`h-24 w-full ${parts[0].color} flex items-center justify-center transition-all duration-300 cursor-help relative group/part`}
          >
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest -rotate-90 group-hover/part:text-white transition-colors">Housing</span>
            {hoveredPart === 'case' && <motion.div layoutId="highlight" className="absolute inset-0 bg-white/10" />}
          </div>
          <div 
            onMouseEnter={() => setHoveredPart('backing')}
            onMouseLeave={() => setHoveredPart(null)}
            className={`h-16 w-full ${parts[1].color} border-y border-white/5 flex items-center justify-center transition-all duration-300 cursor-help relative group/part`}
          >
            <Layers className={`w-6 h-6 transition-colors ${hoveredPart === 'backing' ? 'text-white' : 'text-white/20'}`} />
            {hoveredPart === 'backing' && <motion.div layoutId="highlight" className="absolute inset-0 bg-white/10" />}
          </div>
          <div 
            onMouseEnter={() => setHoveredPart('pzt')}
            onMouseLeave={() => setHoveredPart(null)}
            className={`h-12 w-full ${parts[2].color} border-b border-white/20 flex items-center justify-center transition-all duration-300 cursor-help relative group/part`}
          >
            <Zap className={`w-8 h-8 transition-all ${hoveredPart === 'pzt' ? 'text-white scale-125' : 'text-white/60'} animate-pulse`} />
            {hoveredPart === 'pzt' && <motion.div layoutId="highlight" className="absolute inset-0 bg-white/20" />}
          </div>
          <div 
            onMouseEnter={() => setHoveredPart('matching')}
            onMouseLeave={() => setHoveredPart(null)}
            className={`h-8 w-full ${parts[3].color} border-b border-white/10 flex items-center justify-center transition-all duration-300 cursor-help relative group/part`}
          >
            <div className={`w-full h-px transition-colors ${hoveredPart === 'matching' ? 'bg-white' : 'bg-white/30'}`} />
            {hoveredPart === 'matching' && <motion.div layoutId="highlight" className="absolute inset-0 bg-white/10" />}
          </div>
          <div 
            onMouseEnter={() => setHoveredPart('lens')}
            onMouseLeave={() => setHoveredPart(null)}
            className={`h-8 w-full ${parts[4].color} rounded-b-xl flex items-center justify-center transition-all duration-300 cursor-help relative group/part`}
          >
            <div className={`w-1/2 h-1 rounded-full transition-colors ${hoveredPart === 'lens' ? 'bg-white' : 'bg-white/20'}`} />
            {hoveredPart === 'lens' && <motion.div layoutId="highlight" className="absolute inset-0 bg-white/10" />}
          </div>
        </div>

        {/* Labels Overlay */}
        <div className="absolute -right-32 top-0 bottom-0 flex flex-col justify-around py-4 hidden lg:flex">
          {parts.map(p => (
              <motion.div 
                key={p.id} 
                animate={{ 
                  x: hoveredPart === p.id ? 10 : 0,
                  color: hoveredPart === p.id ? '#00e5ff' : '#94a3b8'
                }}
                className="text-[9px] font-black uppercase tracking-widest flex items-center space-x-2"
              >
                <div className={`w-2 h-2 rounded-full ${hoveredPart === p.id ? 'bg-registry-teal' : 'bg-slate-700'}`} />
                <span>{p.name}</span>
              </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full min-h-[100px] p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-white/5 flex items-start space-x-4 relative z-10">
        <div className="p-3 bg-registry-teal/10 rounded-2xl shrink-0">
          <Info className="w-5 h-5 text-registry-teal" />
        </div>
        <div>
          <h5 className="text-xs font-black uppercase text-registry-teal tracking-widest mb-2">
            {hoveredPart ? parts.find(p => p.id === hoveredPart)?.name : "Transducer Anatomy"}
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {hoveredPart ? parts.find(p => p.id === hoveredPart)?.desc : "Hover over the internal components to explore the physical construction and acoustic engineering of an ultrasound probe."}
          </p>
        </div>
      </div>
    </div>
  );
};

export const QAPhantomVisual: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col items-center">
     <div className="w-36 h-36 md:w-48 md:h-48 bg-slate-950 rounded-[2rem] md:rounded-[2.5rem] relative p-8 md:p-10 border border-slate-800 shadow-inner overflow-hidden">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col gap-3">
           {Array.from({length: 3}).map((_, i) => <div key={i} className="w-1 md:w-1.5 h-1 md:h-1.5 bg-white rounded-full shadow-[0_0_6px_white] opacity-60" />)}
        </div>
        <div className="absolute bottom-12 left-6 right-6 flex justify-between">
           <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse" />
           <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse" />
        </div>
     </div>
     <VisualInsight 
       title="QA Phantoms" 
       description="Phantoms simulate tissue properties to test system performance, including axial/lateral resolution, depth of penetration, and distance accuracy." 
     />
  </div>
);

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
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Artifact Lab</h4>
            <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mt-1">Acoustic Lies</p>
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
            <span className="text-[7px] font-black uppercase tracking-widest">{t}</span>
          </button>
        ))}
      </div>

      <div className="h-64 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-inner relative flex items-center justify-center">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          <AnimatePresence mode="wait">
            {type === 'reverb' && (
              <motion.g 
                key="reverb"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Reflectors */}
                <line x1="100" y1="40" x2="300" y2="40" stroke="white" strokeWidth="4" opacity="0.8" />
                <line x1="100" y1="70" x2="300" y2="70" stroke="white" strokeWidth="4" opacity="0.8" />
                
                {/* Echoes */}
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

                {/* Sound Path */}
                <motion.path
                  d="M 200 0 L 200 40 L 200 70 L 200 40 L 200 70"
                  stroke="#00e5ff"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5 5"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <text x="200" y="190" textAnchor="middle" fill="#ffbe0b" className="text-[10px] font-black uppercase tracking-widest opacity-60">Multiple Reflections</text>
              </motion.g>
            )}
            {type === 'shadow' && (
              <motion.g 
                key="shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <defs>
                  <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="black" stopOpacity="0" />
                    <stop offset="100%" stopColor="black" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                
                {/* Sound Beams */}
                {Array.from({length: 20}).map((_, i) => (
                  <motion.line 
                    key={i}
                    x1={100 + i*10} y1="0" x2={100 + i*10} y2="200"
                    stroke="#00e5ff"
                    strokeWidth="1"
                    opacity="0.1"
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                  />
                ))}

                {/* Attenuating Structure (Gallstone) */}
                <circle cx="200" cy="80" r="35" fill="#475569" stroke="#94a3b8" strokeWidth="3" />
                <path d="M 175 65 Q 200 55 225 65" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                
                {/* Shadow */}
                <rect x="165" y="80" width="70" height="120" fill="url(#shadowGrad)" />
                
                <text x="200" y="190" textAnchor="middle" fill="#ffbe0b" className="text-[10px] font-black uppercase tracking-widest opacity-60">Acoustic Shadow</text>
              </motion.g>
            )}
            {type === 'mirror' && (
              <motion.g 
                key="mirror"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Diaphragm */}
                <path d="M 50 120 Q 200 80 350 120" fill="none" stroke="#3a86ff" strokeWidth="6" opacity="0.6" />
                <text x="350" y="110" textAnchor="end" fill="#3a86ff" className="text-[8px] font-black uppercase opacity-60">Diaphragm</text>

                {/* Real Structure */}
                <circle cx="200" cy="50" r="20" fill="#ff3d71" />
                <text x="230" y="55" fill="#ff3d71" className="text-[8px] font-black uppercase">Real</text>

                {/* Mirror Image */}
                <motion.circle 
                  cx="200" cy="160" r="20" 
                  fill="#ff3d71" 
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <text x="230" y="165" fill="#ff3d71" className="text-[8px] font-black uppercase opacity-40">Mirror</text>

                {/* Sound Path */}
                <motion.path
                  d="M 200 0 L 200 100 L 200 160"
                  fill="none"
                  stroke="#00e5ff"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <text x="200" y="190" textAnchor="middle" fill="#ffbe0b" className="text-[10px] font-black uppercase tracking-widest opacity-60">False Image (Deeper)</text>
              </motion.g>
            )}
            {type === 'enhancement' && (
              <motion.g 
                key="enhancement"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Sound Beams */}
                {Array.from({length: 20}).map((_, i) => (
                  <motion.line 
                    key={i}
                    x1={100 + i*10} y1="0" x2={100 + i*10} y2="200"
                    stroke="#00e5ff"
                    strokeWidth="1"
                    opacity="0.1"
                  />
                ))}

                {/* Low Attenuating Structure (Cyst) */}
                <circle cx="200" cy="80" r="40" fill="#3a86ff05" stroke="#3a86ff" strokeWidth="2" />
                <text x="200" y="85" textAnchor="middle" fill="#3a86ff" className="text-[8px] font-black uppercase opacity-60">Fluid Cyst</text>

                {/* Enhancement Column */}
                <rect x="160" y="80" width="80" height="120" fill="#00f0ff" opacity="0.15" />
                <motion.rect 
                  x="160" y="80" width="80" height="120" 
                  fill="white" 
                  animate={{ opacity: [0.05, 0.25, 0.05] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <text x="200" y="190" textAnchor="middle" fill="#00f0ff" className="text-[10px] font-black uppercase tracking-widest opacity-60">Posterior Enhancement</text>
              </motion.g>
            )}
            {type === 'aliasing' && (
              <motion.g 
                key="aliasing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Baseline */}
                <line x1="50" y1="100" x2="350" y2="100" stroke="white" strokeWidth="1" opacity="0.4" />
                <text x="60" y="95" fill="white" className="text-[8px] font-black uppercase opacity-40">Baseline</text>
                
                {/* Nyquist Limits */}
                <line x1="50" y1="30" x2="350" y2="30" stroke="#d946ef" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                <line x1="50" y1="170" x2="350" y2="170" stroke="#d946ef" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                <text x="340" y="25" textAnchor="end" fill="#d946ef" className="text-[7px] font-black uppercase opacity-60">Nyquist Limit</text>

                {/* Aliased Wave */}
                <motion.path 
                  d="M 50 100 Q 125 -50 200 100 Q 275 250 350 100" 
                  fill="none" 
                  stroke="#ff3d71" 
                  strokeWidth="3" 
                  strokeDasharray="10 5"
                  animate={{ strokeDashoffset: [0, -30] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="drop-shadow-[0_0_8px_rgba(255,61,113,0.5)]"
                />

                {/* Wrapped Portions */}
                <motion.path 
                  d="M 90 30 L 160 30" 
                  stroke="#ff3d71" strokeWidth="4"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.path 
                  d="M 240 170 L 310 170" 
                  stroke="#ff3d71" strokeWidth="4"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />

                <text x="200" y="190" textAnchor="middle" fill="#ff3d71" className="text-[10px] font-black uppercase tracking-widest opacity-60">Signal Wrapping</text>
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

// --- ADDED MISSING EXPORTS FOR APP.TSX ---

export const ResolutionComparison: React.FC = () => {
  const [activeRes, setActiveRes] = useState<'axial' | 'lateral'>('axial');

  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 transition-all duration-500">
      <div className="flex gap-2 p-1 bg-stealth-950 rounded-2xl">
        <button 
          onClick={() => setActiveRes('axial')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRes === 'axial' ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Axial (LARRD)
        </button>
        <button 
          onClick={() => setActiveRes('lateral')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRes === 'lateral' ? 'bg-registry-rose text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Lateral (LATA)
        </button>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
        {activeRes === 'axial' ? (
          <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="w-3 h-3 bg-registry-teal rounded-full shadow-[0_0_10px_#00f0ff]" />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-registry-teal">T1</div>
            </div>
            <div className="h-12 w-0.5 bg-registry-teal/20 dashed" />
            <div className="relative">
              <div className="w-3 h-3 bg-registry-teal rounded-full shadow-[0_0_10px_#00f0ff]" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-registry-teal">T2</div>
            </div>
            <div className="absolute right-[-60px] top-1/2 -translate-y-1/2 border-l-2 border-y-2 border-registry-teal/30 h-16 w-4 rounded-r-lg flex items-center justify-center">
               <span className="rotate-90 text-[8px] font-black text-registry-teal uppercase whitespace-nowrap">Dist &gt; SPL/2</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-12 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="w-3 h-3 bg-registry-rose rounded-full shadow-[0_0_10px_#ff3d71]" />
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-registry-rose">T1</div>
            </div>
            <div className="relative">
              <div className="w-3 h-3 bg-registry-rose rounded-full shadow-[0_0_10px_#ff3d71]" />
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-registry-rose">T2</div>
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 border-t-2 border-x-2 border-registry-rose/30 w-24 h-4 rounded-t-lg flex items-center justify-center">
               <span className="text-[8px] font-black text-registry-rose uppercase whitespace-nowrap">Dist &gt; Beam Width</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Formula</p>
          <p className="text-sm font-black italic text-registry-teal">
            {activeRes === 'axial' ? "SPL / 2" : "Beam Diameter"}
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Synonym</p>
          <p className="text-sm font-black italic text-rose-600 dark:text-rose-400">
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

// BioeffectMechanismsVisual component to show Thermal vs Mechanical bioeffects
export const BioeffectMechanismsVisual: React.FC = () => (
  <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
    <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
    
    <div className="flex items-center space-x-2 relative z-10">
      <ShieldCheck className="w-4 h-4 text-registry-teal" />
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bioeffect Mechanisms</span>
    </div>

    <div className="grid grid-cols-2 gap-6 relative z-10">
      <div className="p-6 bg-orange-50 dark:bg-orange-950/20 rounded-3xl border border-orange-100 dark:border-orange-500/10 flex flex-col items-center space-y-4 group/card hover:scale-105 transition-transform duration-300">
        <div className="relative">
          <Flame className="w-10 h-10 text-registry-amber animate-pulse" />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-registry-amber rounded-full blur-xl"
          />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase text-registry-amber tracking-widest">Thermal (TI)</p>
          <p className="text-[8px] font-mono text-slate-500 uppercase mt-1">Tissue Heating</p>
        </div>
      </div>

      <div className="p-6 bg-registry-teal/5 dark:bg-registry-teal/10 rounded-3xl border border-registry-teal/10 flex flex-col items-center space-y-4 group/card hover:scale-105 transition-transform duration-300">
        <div className="relative">
          <CircleDot className="w-10 h-10 text-registry-teal animate-bounce" />
          <motion.div 
            animate={{ scale: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-registry-teal rounded-full blur-xl"
          />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase text-registry-teal tracking-widest">Mechanical (MI)</p>
          <p className="text-[8px] font-mono text-slate-500 uppercase mt-1">Cavitation</p>
        </div>
      </div>
    </div>

    <div className="relative z-10">
      <VisualInsight 
        title="Bioeffect Mechanisms" 
        description="Thermal effects involve the conversion of sound energy into heat (TI). Mechanical effects involve cavitation—the creation, oscillation, and potential collapse of microbubbles (MI)." 
      />
    </div>
  </div>
);

export const FlowPatternsVisual: React.FC = () => {
  const [pattern, setPattern] = useState<'laminar' | 'turbulent' | 'parabolic'>('laminar');

  return (
    <div className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative transition-all duration-500">
      <div className="flex gap-2 p-1 bg-stealth-950 rounded-2xl mb-6 border border-white/5">
        {(['laminar', 'parabolic', 'turbulent'] as const).map(p => (
          <button 
            key={p}
            onClick={() => setPattern(p)}
            className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${pattern === p ? 'bg-registry-rose text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="h-40 md:h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-center px-8 space-y-4">
        {pattern === 'laminar' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-2 animate-stenosis-particle" style={{ animationDuration: '3s', animationDelay: `${i * 0.2}s` }}>
                {Array.from({length: 12}).map((_, j) => <div key={j} className="w-1.5 h-1.5 bg-teal-500 rounded-full opacity-40" />)}
              </div>
            ))}
          </div>
        )}
        {pattern === 'parabolic' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-2 animate-stenosis-particle" style={{ animationDuration: `${2 + Math.abs(i-2)*2}s` }}>
                {Array.from({length: 12}).map((_, j) => <div key={j} className="w-1.5 h-1.5 bg-teal-500 rounded-full opacity-40" />)}
              </div>
            ))}
          </div>
        )}
        {pattern === 'turbulent' && (
          <div className="relative h-full w-full animate-in fade-in duration-500">
            {Array.from({length: 20}).map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  x: [Math.random() * 200, Math.random() * 200],
                  y: [Math.random() * 100, Math.random() * 100],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute w-2 h-2 bg-registry-rose rounded-full blur-[1px]"
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
               <AlertCircle className="w-8 h-8 text-registry-rose/20 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      <VisualInsight 
        title={`${pattern.charAt(0).toUpperCase() + pattern.slice(1)} Flow`} 
        description={pattern === 'laminar' 
          ? "Laminar flow is characterized by smooth, parallel streamlines. It is typical in normal, straight vessels." 
          : pattern === 'parabolic'
          ? "Parabolic flow is a type of laminar flow where velocity is highest in the center and lowest at the vessel walls due to friction."
          : "Turbulent flow is chaotic and multi-directional. It often occurs after a stenosis or at high Reynolds numbers."} 
      />
    </div>
  );
};

export const DopplerShiftVisual: React.FC = () => {
  const [velocity, setVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200 - 100;
    setVelocity(x);
  };

  return (
    <div className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 transition-all duration-500">
      <div className="flex justify-between items-center">
        <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Doppler Shift Lab</h5>
        <div className={`text-xl font-black italic ${velocity > 0 ? 'text-registry-teal' : velocity < 0 ? 'text-registry-rose' : 'text-slate-500'}`}>
          {velocity > 0 ? '+' : ''}{velocity.toFixed(0)} Hz
        </div>
      </div>

      <div 
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center cursor-ew-resize"
      >
        {/* The Probe */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-stealth-950 rounded-b-xl border-x border-b border-registry-teal/30 flex items-center justify-center">
           <Zap className="w-3 h-3 text-registry-teal/50" />
        </div>

        {/* Waves */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {Array.from({length: 10}).map((_, i) => (
            <motion.circle 
              key={i}
              cx="50%"
              cy="20"
              initial={{ r: 0, opacity: 0.5 }}
              animate={{ 
                r: 300, 
                opacity: 0,
                strokeWidth: velocity > 0 ? 4 : 1
              }}
              transition={{ 
                duration: velocity > 0 ? 1 : velocity < 0 ? 3 : 2, 
                repeat: Infinity, 
                delay: i * 0.3 
              }}
              fill="none"
              stroke={velocity > 0 ? "#00f0ff" : velocity < 0 ? "#ff3d71" : "#1a202c"}
              className="opacity-20"
            />
          ))}
        </svg>

        {/* The Target (Blood Cell) */}
        <motion.div 
          animate={{ x: velocity }}
          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-500 ${velocity > 0 ? 'bg-registry-teal' : velocity < 0 ? 'bg-registry-rose' : 'bg-stealth-800'}`}
        >
          <Droplets className="w-4 h-4 text-white/80" />
          {velocity !== 0 && (
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 rounded-full border-2 border-white/30"
            />
          )}
        </motion.div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-500 uppercase tracking-widest">
          Drag to simulate blood flow
        </div>
      </div>

      <div className="p-4 bg-stealth-950 rounded-2xl border border-white/5 flex items-center justify-between">
         <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${velocity > 0 ? 'bg-registry-teal animate-pulse' : 'bg-stealth-800'}`} />
            <span className="text-[10px] font-black uppercase text-slate-500">Positive Shift</span>
         </div>
         <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${velocity < 0 ? 'bg-registry-rose animate-pulse' : 'bg-stealth-800'}`} />
            <span className="text-[10px] font-black uppercase text-slate-500">Negative Shift</span>
         </div>
      </div>

      <VisualInsight 
        title="Doppler Shift Physics" 
        description="The Doppler shift is the difference between the transmitted and received frequencies. Flow toward the transducer creates a positive shift (higher frequency); flow away creates a negative shift (lower frequency)." 
      />
    </div>
  );
};

// AttenuationComparison component to show signal loss in different media
export const AttenuationComparison: React.FC = () => (
  <div className="bg-stealth-900 p-4 rounded-[2rem] border border-white/5 shadow-xl space-y-4">
    {['Air', 'Lung', 'Bone', 'Soft Tissue'].map((m, i) => (
      <div key={i} className="space-y-1">
        <div className="flex justify-between text-[8px] font-black uppercase text-slate-500"><span>{m}</span></div>
        <div className="h-1.5 w-full bg-stealth-950 rounded-full overflow-hidden">
          <div className="h-full bg-registry-teal" style={{ width: `${100 - (i * 25)}%` }} />
        </div>
      </div>
    ))}
    <VisualInsight 
      title="Attenuation" 
      description="Attenuation is the weakening of sound as it travels. Air has the highest attenuation; water has the lowest. Higher frequencies attenuate faster." 
    />
  </div>
);

// DynamicRangeVisual component for signal compression visualization
export const DynamicRangeVisual: React.FC = () => {
  const [compression, setCompression] = useState(50); // 0 to 100
  
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <GrainOverlay />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-registry-teal" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dynamic Range Lab</span>
        </div>
        <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5">
          <span className="text-[10px] font-black uppercase text-slate-500">Compression: {compression}%</span>
          <input 
            type="range" min="0" max="100" step="10" 
            value={compression} 
            onChange={(e) => setCompression(parseInt(e.target.value))}
            className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
          />
        </div>
      </div>

      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 p-8 flex flex-col justify-center space-y-8">
        {/* Original Signal Range */}
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">Input Signal (120 dB)</div>
          <div className="h-4 w-full bg-gradient-to-r from-black via-slate-400 to-white rounded-full opacity-30" />
        </div>

        {/* Compressed Signal Range */}
        <div className="space-y-2 relative">
          <div className="flex justify-between text-[8px] font-black text-registry-teal uppercase italic">Display Range ({120 - Math.round(compression * 0.8)} dB)</div>
          <motion.div 
            animate={{ 
              width: `${100 - compression * 0.5}%`,
              x: `${compression * 0.25}%`
            }}
            className="h-8 bg-gradient-to-r from-black via-slate-400 to-white rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.2)] border border-white/10"
          />
          <div className="absolute -bottom-4 left-0 right-0 flex justify-between px-2">
             <ArrowLeft className="w-3 h-3 text-slate-600" />
             <span className="text-[6px] font-mono text-slate-600">COMPRESSION MATRIX</span>
             <ArrowRight className="w-3 h-3 text-slate-600" />
          </div>
        </div>
      </div>

      <VisualInsight 
        title="Dynamic Range & Compression" 
        description="Dynamic Range is the ratio of the largest to smallest signals. Compression reduces this range to fit the display capabilities of the monitor. High compression (low dB) results in a high-contrast image with fewer shades of gray." 
      />
    </div>
  );
};

// AcousticImpedanceVisual component showing reflection at a boundary
export const AcousticImpedanceVisual: React.FC = () => {
  const [z1, setZ1] = useState(1.5);
  const [z2, setZ2] = useState(1.6);
  
  const reflectionFactor = Math.abs((z2 - z1) / (z2 + z1)) ** 2;
  
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-registry-teal" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Acoustic Impedance</span>
        </div>
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-mono text-slate-500 uppercase mb-1">Medium 1 (Z₁)</span>
            <input type="range" min="1" max="10" step="0.1" value={z1} onChange={(e) => setZ1(parseFloat(e.target.value))} className="w-20 accent-registry-teal" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-mono text-slate-500 uppercase mb-1">Medium 2 (Z₂)</span>
            <input type="range" min="1" max="10" step="0.1" value={z2} onChange={(e) => setZ2(parseFloat(e.target.value))} className="w-20 accent-registry-teal" />
          </div>
        </div>
      </div>

      <div className="h-40 flex items-center rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-white/5 relative shadow-inner">
        <div className="w-1/2 h-full bg-slate-50 dark:bg-stealth-900 flex flex-col items-center justify-center border-r-2 border-slate-200 dark:border-white/10 relative">
          <motion.div 
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-registry-teal/5"
          />
          <span className="text-2xl font-black text-slate-400 relative z-10">{z1.toFixed(1)}</span>
          <span className="text-[8px] font-mono text-slate-500 uppercase relative z-10">Rayls × 10⁶</span>
        </div>
        <div className="w-1/2 h-full bg-registry-teal/5 flex flex-col items-center justify-center relative">
          <motion.div 
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute inset-0 bg-registry-teal/10"
          />
          <span className="text-2xl font-black text-registry-teal relative z-10">{z2.toFixed(1)}</span>
          <span className="text-[8px] font-mono text-registry-teal/60 uppercase relative z-10">Rayls × 10⁶</span>
        </div>

        {/* Reflection Visualization */}
        <motion.div 
          animate={{ 
            height: `${Math.max(10, reflectionFactor * 100)}%`,
            opacity: reflectionFactor > 0.001 ? 1 : 0,
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 bg-registry-rose shadow-[0_0_20px_rgba(244,63,94,0.6)] z-20 rounded-full"
        />
        
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <ArrowRight className="text-registry-teal w-10 h-10 drop-shadow-[0_0_10px_rgba(20,184,166,0.4)]" />
          {reflectionFactor > 0.01 && (
            <motion.div 
              initial={{ x: 0 }}
              animate={{ x: -40, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-1/2 -translate-y-1/2"
            >
              <ArrowLeft className="text-registry-rose w-6 h-6" />
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <VisualInsight 
          title="Reflection Intensity" 
          description={`Impedance mismatch: ${(Math.abs(z2-z1)).toFixed(1)}. Reflection: ${(reflectionFactor * 100).toFixed(2)}%. ${reflectionFactor > 0.1 ? "Strong reflection due to high mismatch (e.g., Soft Tissue to Bone)." : reflectionFactor > 0.01 ? "Moderate reflection at this interface." : "Weak reflection; most sound transmits (e.g., Soft Tissue to Soft Tissue)."}`} 
        />
      </div>
    </div>
  );
};

// DutyFactorVisual component showing pulsed wave timing
export const DutyFactorVisual: React.FC = () => (
  <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
    <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
    
    <div className="flex items-center space-x-2 relative z-10">
      <Clock className="w-4 h-4 text-registry-teal" />
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Duty Factor Analysis</span>
    </div>

    <div className="h-32 bg-slate-950 rounded-3xl border border-slate-800 flex items-center px-8 relative overflow-hidden shadow-inner">
      <div className="absolute inset-0 scanline opacity-10" />
      {/* Timeline */}
      <div className="absolute inset-0 flex items-center px-8">
        <div className="w-full h-px bg-slate-800" />
      </div>

      {/* Pulse */}
      <motion.div 
        animate={{ 
          x: [-100, 500],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-6 h-16 bg-registry-teal rounded-xl shadow-[0_0_30px_rgba(20,184,166,0.6)] z-10 relative flex items-center justify-center"
      >
        <Zap className="w-3 h-3 text-white animate-pulse" />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-registry-teal uppercase tracking-widest whitespace-nowrap">Transmit</div>
      </motion.div>

      {/* Listening Period */}
      <div className="flex-1 flex justify-center relative">
        <motion.span 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.5em]"
        >
          Listening Period
        </motion.span>
      </div>
      
      <div className="absolute bottom-4 right-8 bg-slate-900/80 px-3 py-1 rounded-full border border-white/5">
        <span className="text-[10px] font-black text-registry-teal uppercase italic tracking-widest">DF &lt; 1%</span>
      </div>
    </div>

    <div className="relative z-10">
      <VisualInsight 
        title="Duty Factor" 
        description="Duty Factor is the percentage of time the system is transmitting sound. For imaging, it is typically very low (<1%), as the system spends the vast majority of its time listening for returning echoes. Continuous wave ultrasound has a DF of 100%." 
      />
    </div>
  </div>
);

// ScanConverterVisual component to show spoke-to-video conversion
export const ScanConverterVisual: React.FC = () => (
  <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
    <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
    <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
    
    <div className="flex items-center space-x-2 relative z-10">
      <Monitor className="w-4 h-4 text-registry-teal" />
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Scan Conversion Process</span>
    </div>

    <div className="grid grid-cols-12 gap-1.5 p-6 bg-slate-950 rounded-3xl border border-slate-800 shadow-inner relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/5 to-transparent pointer-events-none" />
      {Array.from({length: 48}).map((_, i) => (
        <motion.div 
          key={i} 
          animate={{ 
            backgroundColor: ['#1e293b', '#00e5ff', '#1e293b'],
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            delay: (i % 12) * 0.1 + Math.floor(i / 12) * 0.3,
            ease: "easeInOut"
          }}
          className="aspect-square rounded-md border border-white/5 shadow-sm" 
        />
      ))}
    </div>

    <div className="relative z-10">
      <VisualInsight 
        title="Scan Conversion" 
        description="The scan converter translates the ultrasound 'spoke' data (polar coordinates) into a horizontal video format (cartesian coordinates) suitable for display on a monitor. This process allows for image storage and post-processing." 
      />
    </div>
  </div>
);

// DampingResolutionExplainer component showing how damping improves axial resolution
export const DampingResolutionExplainer: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
    <div className="flex justify-between items-center">
      <div className="space-y-1"><p className="text-[7px] font-black text-slate-400 uppercase">Long Pulse</p><div className="w-24 h-1 bg-registry-rose rounded-full" /></div>
      <div className="space-y-1 text-right"><p className="text-[7px] font-black text-registry-teal uppercase">Short Pulse</p><div className="w-8 h-1 bg-registry-teal rounded-full ml-auto" /></div>
    </div>
    <VisualInsight 
      title="Damping" 
      description="Damping material shortens the pulse duration and spatial pulse length, which directly improves axial resolution." 
    />
  </div>
);

// DopplerAngleExplainer component to visualize angle incidence
export const DopplerAngleExplainer: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 h-32 flex items-center justify-center relative transition-colors duration-500">
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      <line x1="10" y1="50" x2="90" y2="50" stroke="#d946ef" strokeWidth="4" />
      <line x1="50" y1="50" x2="80" y2="20" stroke="#00e5ff" strokeWidth="2" strokeDasharray="4 2" />
      <circle cx="50" cy="50" r="3" fill="white" />
      <text x="55" y="45" fill="#00e5ff" className="text-[10px] font-bold">θ</text>
    </svg>
    <div className="absolute bottom-2">
      <VisualInsight 
        title="Doppler Angle" 
        description="The Doppler shift depends on the cosine of the angle. A 0° angle is ideal; a 90° angle results in zero shift. 60° is the clinical standard limit." 
      />
    </div>
  </div>
);

// StenosisHemodynamicsExplainer component visualizing flow through narrowing
export const StenosisHemodynamicsExplainer: React.FC = () => (
  <div className="bg-white dark:bg-slate-950 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 h-32 flex items-center relative overflow-hidden transition-colors duration-500">
    <div className="absolute inset-0 flex items-center">
       <div className="h-16 w-full bg-registry-rose/5 relative">
          <div className="absolute top-0 bottom-0 left-1/3 right-1/3 bg-stealth-950 rounded-full scale-y-125" />
          <div className="flex space-x-2 animate-stenosis-particle absolute inset-0 items-center">
             {Array.from({length: 12}).map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-registry-rose rounded-full" />)}
          </div>
       </div>
    </div>
    <div className="absolute bottom-2 left-4 right-4">
       <VisualInsight 
         title="Stenosis Hemodynamics" 
         description="As blood enters a stenosis, velocity increases and pressure decreases (Bernoulli). Post-stenotic turbulence often occurs as flow exits the narrowing." 
       />
    </div>
  </div>
);

// HuygensPrincipleVisual component visualizing wavelet summation
export const HuygensPrincipleVisual: React.FC = () => (
  <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
    <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
    
    <div className="flex items-center space-x-2 relative z-10">
      <Waves className="w-4 h-4 text-registry-teal" />
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Huygens' Principle</span>
    </div>

    <div className="h-40 bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden relative shadow-inner">
      <div className="absolute inset-0 scanline opacity-10" />
      
      <svg viewBox="0 0 400 120" className="w-full h-full">
        {/* Wavelets */}
        {Array.from({length: 12}).map((_, i) => (
          <motion.circle 
            key={i} 
            cx={40 + i*30} 
            cy="40" 
            r="0"
            animate={{ 
              r: [0, 60],
              opacity: [0.6, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.05,
              ease: "easeOut"
            }}
            fill="none" 
            stroke="#00e5ff" 
            strokeWidth="1" 
          />
        ))}
        
        {/* Resultant Wavefront */}
        <motion.line 
          animate={{ y: [0, 60], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          x1="0" y1="40" x2="400" y2="40" 
          stroke="#00e5ff" 
          strokeWidth="3" 
          className="drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]"
        />

        {/* Transducer Face */}
        <rect x="20" y="35" width="360" height="10" fill="#1e293b" rx="2" />
        <text x="200" y="30" textAnchor="middle" className="text-[8px] font-black fill-slate-500 uppercase">Transducer Aperture</text>
      </svg>
    </div>

    <div className="relative z-10">
      <VisualInsight 
        title="Wavelet Summation" 
        description="Huygens' Principle states that every point on a wavefront is a source of secondary wavelets. Their constructive interference creates the overall hourglass beam shape." 
      />
    </div>
  </div>
);

// CavitationVisual component visualizing bubble mechanisms
export const CavitationVisual: React.FC = () => {
  const [type, setType] = useState<'stable' | 'transient'>('stable');
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-registry-teal" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cavitation Mechanisms</span>
        </div>
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => setType('stable')}
            className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${type === 'stable' ? 'bg-registry-teal text-white' : 'text-slate-500'}`}
          >
            Stable
          </button>
          <button 
            onClick={() => setType('transient')}
            className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${type === 'transient' ? 'bg-registry-rose text-white' : 'text-slate-500'}`}
          >
            Transient
          </button>
        </div>
      </div>

      <div className="h-40 flex items-center justify-center relative bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        
        {type === 'stable' ? (
          <div className="flex items-center space-x-8">
            <motion.div 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full border-4 border-registry-teal/40 bg-registry-teal/10 flex items-center justify-center"
            >
              <div className="w-6 h-6 bg-registry-teal rounded-full animate-pulse shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-registry-teal uppercase italic">Stable Oscillation</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">Streaming & Shear Stress</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-8">
            <motion.div 
              animate={{ 
                scale: [1, 1.8, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeIn" }}
              className="w-16 h-16 rounded-full border-4 border-registry-rose/40 bg-registry-rose/10 flex items-center justify-center"
            >
              <Zap className="w-8 h-8 text-registry-rose" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-registry-rose uppercase italic">Transient Collapse</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">Shockwaves & High Temp</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <VisualInsight 
          title={type === 'stable' ? "Stable Cavitation" : "Transient Cavitation"} 
          description={type === 'stable' ? "Microbubbles oscillate in size but do not burst. This creates microstreaming and shear stress in surrounding tissue." : "Microbubbles expand rapidly and then violently collapse (implode). This creates extreme local temperatures and shockwaves."} 
        />
      </div>
    </div>
  );
};

// TemporalResolutionVisual component visualizing frame rate concept
export const TemporalResolutionVisual: React.FC = () => {
  const [frame, setFrame] = useState(0);
  useEffect(() => { const interval = setInterval(() => setFrame(f => (f + 1) % 4), 100); return () => clearInterval(interval); }, []);
  return (
    <div className="bg-stealth-900 p-4 rounded-[2rem] border border-white/5 h-32 flex items-center justify-center transition-colors duration-500">
      <div className="grid grid-cols-2 gap-2">
        {Array.from({length: 4}).map((_, i) => (
          <div key={i} className={`w-8 h-8 rounded-lg border-2 transition-all ${frame === i ? 'bg-registry-teal border-registry-teal' : 'border-white/10'}`} />
        ))}
      </div>
      <div className="ml-6">
        <p className="text-[8px] font-black uppercase text-slate-500">60 FPS</p>
        <VisualInsight 
          title="Temporal Resolution" 
          description="Temporal resolution is the ability to track moving structures. It is determined by frame rate. Higher frame rates improve temporal resolution." 
        />
      </div>
    </div>
  );
};

// DemodulationVisual component showing RF to Video conversion
export const DemodulationVisual: React.FC = () => (
  <div className="bg-stealth-900 p-4 rounded-[2rem] border border-white/5 h-32 flex items-center justify-center">
    <svg viewBox="0 0 200 100" className="w-full h-full">
      <path d="M 0 50 L 20 20 L 40 80 L 60 20 L 80 80 L 100 50" fill="none" stroke="#1a202c" strokeWidth="1" opacity="0.3" />
      <path d="M 0 50 Q 50 10 100 50 Q 150 10 200 50" fill="none" stroke="#00f0ff" strokeWidth="3" />
    </svg>
    <div className="absolute bottom-2">
      <VisualInsight 
        title="Demodulation" 
        description="Demodulation involves rectification (converting negative to positive) and smoothing (enveloping) to prepare the signal for display." 
      />
    </div>
  </div>
);

// ElastographyVisual component showing tissue stiffness
export const ElastographyVisual: React.FC = () => {
  const [isStiff, setIsStiff] = useState(false);
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-black uppercase italic text-slate-900 dark:text-white">Elastography Simulator</h4>
        <button 
          onClick={() => setIsStiff(!isStiff)}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${isStiff ? 'bg-registry-rose text-white' : 'bg-registry-teal text-stealth-950'}`}
        >
          {isStiff ? 'Stiff Lesion' : 'Soft Tissue'}
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
        <div className="absolute bottom-4 left-4 right-4">
          <VisualInsight 
            title="Strain Elastography" 
            description="Elastography measures tissue stiffness. Stiff tissues (like many cancers) deform less under pressure than soft, healthy tissues." 
          />
        </div>
      </div>
    </div>
  );
};

// PulseInversionVisual component showing harmonic extraction
export const PulseInversionVisual: React.FC = () => {
  const [showSum, setShowSum] = useState(false);
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Repeat className="w-4 h-4 text-indigo-500" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pulse Inversion</span>
        </div>
        <button 
          onClick={() => setShowSum(!showSum)}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all duration-300 shadow-lg ${showSum ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
        >
          {showSum ? 'Result: Harmonic' : 'Show Summation'}
        </button>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 p-4 flex items-center shadow-inner relative">
        <svg viewBox="0 0 400 120" className="w-full h-full">
          {/* Pulse 1 */}
          <motion.path 
            animate={{ 
              opacity: showSum ? 0.1 : 0.8,
              y: showSum ? -10 : 0
            }}
            d={`M 0 40 ${Array.from({ length: 200 }).map((_, x) => `L ${x*2} ${40 + Math.sin(x * 0.1) * 25}`).join(' ')}`} 
            fill="none" 
            stroke="#00e5ff" 
            strokeWidth="2"
            className="transition-all duration-500"
          />
          
          {/* Pulse 2 (Inverted) */}
          <motion.path 
            animate={{ 
              opacity: showSum ? 0.1 : 0.8,
              y: showSum ? 10 : 0
            }}
            d={`M 0 40 ${Array.from({ length: 200 }).map((_, x) => `L ${x*2} ${40 - Math.sin(x * 0.1) * 25}`).join(' ')}`} 
            fill="none" 
            stroke="#d946ef" 
            strokeWidth="2"
            className="transition-all duration-500"
          />
          
          {/* Summation (Harmonic) */}
          {showSum && (
            <motion.path 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              d={`M 0 80 ${Array.from({ length: 200 }).map((_, x) => `L ${x*2} ${80 + Math.sin(x * 0.2) * 15}`).join(' ')}`} 
              fill="none" 
              stroke="#8b5cf6" 
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}

          {/* Labels */}
          {!showSum && (
            <g className="text-[8px] font-mono fill-slate-500 uppercase">
              <text x="10" y="20">Pulse 1 (Normal)</text>
              <text x="10" y="70">Pulse 2 (Inverted)</text>
            </g>
          )}
          {showSum && (
            <g className="text-[10px] font-black fill-indigo-400 uppercase italic tracking-widest">
              <text x="10" y="110">Non-Linear Harmonic Signal</text>
            </g>
          )}
        </svg>
      </div>

      <div className="relative z-10">
        <VisualInsight 
          title="Pulse Inversion Harmonics" 
          description="Two pulses (one inverted) are sent in rapid succession. Fundamental frequencies cancel out through destructive interference, leaving only the non-linear harmonic signals for a cleaner image with less clutter." 
        />
      </div>
    </div>
  );
};

// ContrastAgentVisual component showing microbubble resonance
export const ContrastAgentVisual: React.FC = () => {
  const [mi, setMi] = useState(0.3); // Mechanical Index
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <CircleDot className="w-4 h-4 text-registry-teal" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contrast Microbubbles</span>
        </div>
        <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5">
          <span className="text-[10px] font-black uppercase text-slate-500">MI: {mi.toFixed(1)}</span>
          <input 
            type="range" min="0.1" max="1.0" step="0.1" 
            value={mi} 
            onChange={(e) => setMi(parseFloat(e.target.value))}
            className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
          />
        </div>
      </div>

      <div className="h-48 flex items-center justify-center space-x-12 relative">
        {/* Microbubble */}
        <div className="relative">
          <motion.div 
            animate={{ 
              scale: [1, 1 + mi * 0.5, 1 - mi * 0.3, 1],
              backgroundColor: mi > 0.7 ? '#d946ef' : '#00e5ff'
            }}
            transition={{ 
              duration: 1 / (mi + 0.5), 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-24 h-24 rounded-full border-4 border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 blur-xl animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest z-10">Bubble</span>
          </motion.div>
          
          {/* Resonance Waves */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.5,
                ease: "easeOut"
              }}
              className="absolute inset-0 rounded-full border-2 border-registry-teal/30"
            />
          ))}
        </div>

        {/* Signal Output */}
        <div className="flex-1 h-32 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden">
          <div className="absolute top-2 left-4 text-[8px] font-mono text-slate-500 uppercase">Resonance Signal</div>
          <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
            <motion.path 
              animate={{ 
                d: `M 0 50 ${Array.from({ length: 50 }).map((_, x) => `L ${x*4} ${50 + Math.sin(x * (0.2 + mi * 0.3)) * (10 + mi * 30)}`).join(' ')}`
              }}
              fill="none" 
              stroke={mi > 0.7 ? "#d946ef" : "#00e5ff"} 
              strokeWidth="2"
            />
          </svg>
          {mi > 0.7 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-registry-rose/10 flex items-center justify-center"
            >
              <span className="text-[10px] font-black text-registry-rose uppercase italic">Non-Linear Burst</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <VisualInsight 
          title="Microbubble Resonance" 
          description={mi < 0.4 ? "Low MI: Linear resonance. Bubbles oscillate symmetrically." : mi < 0.7 ? "Moderate MI: Non-linear resonance. Bubbles expand more than they contract, creating harmonics." : "High MI: Bubble disruption. Bubbles burst, creating strong transient non-linear signals."} 
        />
      </div>
    </div>
  );
};

// NyquistLimitVisual component explaining aliasing
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
            <span className="text-[10px] font-black uppercase text-slate-500">PRF</span>
            <input 
              type="range" min="2000" max="10000" step="500" 
              value={prf} 
              onChange={(e) => setPrf(parseInt(e.target.value))}
              className="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
            />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase text-slate-500">Doppler Shift</span>
            <input 
              type="range" min="1000" max="8000" step="500" 
              value={shift} 
              onChange={(e) => setShift(parseInt(e.target.value))}
              className="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose"
            />
          </div>
        </div>
      </div>

      <div className="h-48 relative flex items-center justify-center">
        {/* Scale */}
        <div className="absolute inset-0 flex flex-col justify-between py-4">
          <div className="h-px w-full bg-white/10 relative">
            <span className="absolute -top-4 right-0 text-[8px] font-bold text-slate-500">+{nyquist} Hz (Nyquist)</span>
          </div>
          <div className="h-px w-full bg-white/20 relative">
            <span className="absolute -top-2 right-0 text-[8px] font-bold text-slate-400">Baseline</span>
          </div>
          <div className="h-px w-full bg-white/10 relative">
            <span className="absolute top-1 right-0 text-[8px] font-bold text-slate-500">-{nyquist} Hz (Nyquist)</span>
          </div>
        </div>

        {/* Signal */}
        <svg className="w-full h-full relative z-10 overflow-visible">
          <motion.path 
            animate={{ 
              d: isAliasing 
                ? `M 0 80 L 50 20 L 100 140 L 150 80 L 200 20` // Wrapped signal
                : `M 0 80 L 100 ${80 - (shift/nyquist) * 60} L 200 80`,
              stroke: isAliasing ? "#d946ef" : "#00e5ff"
            }}
            transition={{ duration: 0.5 }}
            fill="none" 
            strokeWidth="3"
            strokeDasharray={isAliasing ? "5,5" : "0"}
          />
          {/* Indicator Dot */}
          <motion.circle 
            animate={{ 
              cy: isAliasing ? 140 : 80 - (shift/nyquist) * 60,
              fill: isAliasing ? "#d946ef" : "#00e5ff"
            }}
            cx="100" r="4"
          />
        </svg>

        {isAliasing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-registry-rose/20 border border-registry-rose/50 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="text-[10px] font-black uppercase text-registry-rose tracking-widest">Aliasing Detected</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-4">
        <VisualInsight 
          title={isAliasing ? "Signal Wrap-Around" : "Accurate Sampling"} 
          description={isAliasing 
            ? "The Doppler shift exceeds the Nyquist limit (PRF/2). The signal 'wraps around' and appears on the opposite side of the baseline."
            : "The Doppler shift is within the Nyquist limit. The system can accurately measure and display the frequency shift."
          } 
        />
      </div>
    </div>
  );
};

// --- DOPPLER VISUALS ---

export const ColorDopplerVisual: React.FC = () => {
  const [velocity, setVelocity] = useState(50);
  
  return (
    <div className="bg-stealth-900 p-6 rounded-[2.5rem] border border-white/5 space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Color Doppler Simulator</h5>
        <div className="flex items-center space-x-4">
          <div className="w-4 h-16 bg-gradient-to-t from-blue-600 via-black to-red-600 rounded-full border border-white/10" />
          <div className="text-right">
            <p className="text-xs font-black text-white italic">Velocity Scale</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">BART: Blue Away, Red Toward</p>
          </div>
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
        <div className="absolute inset-0 neural-grid opacity-10" />
        
        {/* Vessel */}
        <div className="w-full h-12 bg-slate-900/50 relative border-y border-white/5">
          <motion.div 
            animate={{ 
              backgroundColor: velocity > 0 ? `rgba(255, 61, 113, ${Math.abs(velocity)/100})` : `rgba(51, 102, 255, ${Math.abs(velocity)/100})`,
              boxShadow: velocity > 0 ? `0 0 20px rgba(255, 61, 113, 0.3)` : `0 0 20px rgba(51, 102, 255, 0.3)`
            }}
            className="absolute inset-0 transition-colors duration-500"
          />
          
          {/* Flow Particles */}
          {Array.from({length: 12}).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: velocity > 0 ? -20 : 420 }}
              animate={{ x: velocity > 0 ? 420 : -20 }}
              transition={{ 
                duration: 4 - (Math.abs(velocity) / 25), 
                repeat: Infinity, 
                delay: i * 0.4,
                ease: "linear"
              }}
              className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${velocity > 0 ? 'bg-red-400' : 'bg-blue-400'} opacity-50`}
            />
          ))}
        </div>

        {/* Probe Indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-8 h-4 bg-stealth-950 rounded-b-lg border border-white/10" />
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
          <span>Flow Velocity & Direction</span>
          <span className={velocity > 0 ? 'text-registry-rose' : 'text-registry-cobalt'}>
            {velocity > 0 ? 'Toward Probe (+)' : 'Away from Probe (-)'}
          </span>
        </div>
        <input 
          type="range" min="-100" max="100" step="10" 
          value={velocity} 
          onChange={(e) => setVelocity(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
        />
      </div>
    </div>
  );
};

export const SpectralDopplerVisual: React.FC = () => {
  const [gain, setGain] = useState(50);
  
  return (
    <div className="bg-stealth-900 p-6 rounded-[2.5rem] border border-white/5 space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Spectral Doppler Display</h5>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-registry-teal animate-pulse" />
          <span className="text-[8px] font-black text-registry-teal uppercase tracking-widest">Live Trace</span>
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 p-4">
        <div className="absolute inset-0 neural-grid opacity-5" />
        
        {/* Baseline */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/20" />
        
        {/* Spectral Trace */}
        <svg className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="spectralGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity={gain/100} />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Simulated Pulsatile Flow */}
          <motion.path 
            d="M 0 50 Q 20 10 40 50 Q 60 40 80 50 Q 100 10 120 50 Q 140 40 160 50 Q 180 10 200 50"
            fill="url(#spectralGrad)"
            stroke="#00f0ff"
            strokeWidth="2"
            className="animate-pulse"
            style={{ filter: `blur(${2 - gain/50}px)` }}
          />
          
          {/* Envelope */}
          <motion.path 
            d="M 0 50 Q 20 10 40 50 Q 60 40 80 50 Q 100 10 120 50 Q 140 40 160 50 Q 180 10 200 50"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>

        {/* Labels */}
        <div className="absolute left-2 top-2 text-[8px] font-bold text-slate-500 uppercase">Velocity (cm/s)</div>
        <div className="absolute right-2 bottom-2 text-[8px] font-bold text-slate-500 uppercase">Time (s)</div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
          <span>Doppler Gain</span>
          <span>{gain}%</span>
        </div>
        <input 
          type="range" min="0" max="100" step="5" 
          value={gain} 
          onChange={(e) => setGain(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
        />
      </div>
    </div>
  );
};

export const DopplerAngleVisual: React.FC = () => {
  const [angle, setAngle] = useState(60);
  
  // Cosine calculation for visual feedback
  const cosTheta = Math.cos((angle * Math.PI) / 180);
  const measuredVelocity = 100 * cosTheta;

  return (
    <div className="bg-stealth-900 p-6 rounded-[2.5rem] border border-white/5 space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Doppler Angle Lab</h5>
        <div className="text-right">
          <span className="text-xl font-black italic text-registry-teal">{measuredVelocity.toFixed(0)}%</span>
          <p className="text-[8px] font-black uppercase text-slate-500">Measured Accuracy</p>
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
        <div className="absolute inset-0 neural-grid opacity-10" />
        
        {/* Vessel */}
        <div className="w-full h-1 bg-slate-700 relative">
          <div className="absolute -top-4 left-4 text-[8px] font-black text-slate-500 uppercase">Blood Flow (100 cm/s)</div>
          <ArrowRight className="absolute -right-2 -top-2.5 w-5 h-5 text-slate-500" />
        </div>

        {/* Beam and Angle */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line 
            x1="200" y1="20" 
            x2={200 + Math.cos((90-angle) * Math.PI / 180) * 150} 
            y2={20 + Math.sin((90-angle) * Math.PI / 180) * 150} 
            stroke="#00f0ff" 
            strokeWidth="2" 
            strokeDasharray="4 2"
          />
          <circle cx="200" cy="20" r="10" fill="#080a0f" stroke="#00f0ff" strokeWidth="2" />
        </svg>

        {/* Angle Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <div className="bg-stealth-950/80 backdrop-blur-sm border border-white/10 p-2 rounded-xl text-center">
              <p className="text-[10px] font-black text-white italic">{angle}°</p>
              <p className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter">θ Angle</p>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
          <span>Insonation Angle</span>
          <span className={angle > 60 ? 'text-registry-rose' : 'text-registry-teal'}>
            {angle > 60 ? 'Inaccurate (>60°)' : 'Optimal (≤60°)'}
          </span>
        </div>
        <input 
          type="range" min="0" max="90" step="5" 
          value={angle} 
          onChange={(e) => setAngle(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
        />
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <p className="text-[9px] leading-relaxed text-slate-400">
            <span className="font-black text-white">Physics Note:</span> As the angle increases, the cosine decreases. At 90°, the cosine is 0, meaning NO Doppler shift is detected even if flow is present!
          </p>
        </div>
      </div>
    </div>
  );
};

// BioeffectsVisual component for Thermal and Mechanical Index
export const BioeffectsVisual: React.FC = () => {
  const [ti, setTi] = useState(0.5); // Thermal Index
  const [mi, setMi] = useState(0.5); // Mechanical Index
  
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <GrainOverlay />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-registry-rose" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bioeffects Monitor</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-registry-rose/10 border border-registry-rose/20 rounded-full">
          <AlertTriangle className={`w-3 h-3 ${ti > 1.5 || mi > 1.0 ? 'text-registry-rose animate-pulse' : 'text-slate-400'}`} />
          <span className="text-[8px] font-black uppercase text-registry-rose tracking-widest">ALARA Protocol</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        {/* Thermal Index (TI) */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase text-slate-500">Thermal Index (TI)</span>
            <span className={`text-xl font-black italic ${ti > 1.5 ? 'text-registry-rose glow-rose' : 'text-slate-900 dark:text-white'}`}>{ti.toFixed(1)}</span>
          </div>
          <div className="h-32 bg-slate-950 rounded-2xl relative overflow-hidden flex items-end p-4 border border-slate-800">
             <motion.div 
               animate={{ height: `${ti * 40}%` }}
               className={`w-full rounded-t-lg ${ti > 1.5 ? 'bg-registry-rose shadow-[0_0_20px_rgba(217,70,239,0.5)]' : 'bg-orange-500'}`}
             />
             <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-30">
                {[2.0, 1.5, 1.0, 0.5].map(v => (
                  <div key={v} className="border-t border-white/20 w-full flex justify-end">
                    <span className="text-[6px] font-mono text-white">{v}</span>
                  </div>
                ))}
             </div>
          </div>
          <input 
            type="range" min="0.1" max="2.5" step="0.1" 
            value={ti} 
            onChange={(e) => setTi(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose"
          />
        </div>

        {/* Mechanical Index (MI) */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase text-slate-500">Mechanical Index (MI)</span>
            <span className={`text-xl font-black italic ${mi > 1.0 ? 'text-registry-rose glow-rose' : 'text-slate-900 dark:text-white'}`}>{mi.toFixed(1)}</span>
          </div>
          <div className="h-32 bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-center p-4 border border-slate-800">
             <motion.div 
               animate={{ 
                 scale: [1, 1 + mi * 0.3, 1],
                 opacity: [0.5, 0.8, 0.5]
               }}
               transition={{ duration: 0.5, repeat: Infinity }}
               className={`w-16 h-16 rounded-full blur-xl ${mi > 1.0 ? 'bg-registry-rose' : 'bg-registry-teal'}`}
             />
             <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-30">
                {[1.5, 1.0, 0.5, 0.1].map(v => (
                  <div key={v} className="border-t border-white/20 w-full flex justify-end">
                    <span className="text-[6px] font-mono text-white">{v}</span>
                  </div>
                ))}
             </div>
          </div>
          <input 
            type="range" min="0.1" max="1.9" step="0.1" 
            value={mi} 
            onChange={(e) => setMi(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose"
          />
        </div>
      </div>

      <VisualInsight 
        title="Bioeffects & Safety" 
        description="TI represents potential for tissue heating. MI represents potential for cavitation (mechanical damage). Always adhere to ALARA (As Low As Reasonably Achievable) principles." 
      />
    </div>
  );
};

// SpeckleVisual component showing acoustic interference
export const SpeckleVisual: React.FC = () => {
  const [reduction, setReduction] = useState(0); // 0 to 100%
  
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <GrainOverlay />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Acoustic Speckle Lab</span>
        </div>
        <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5">
          <span className="text-[10px] font-black uppercase text-slate-500">Reduction: {reduction}%</span>
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
        
        {/* Smoothed Overlay */}
        <motion.div 
          animate={{ opacity: reduction / 100 }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
        />

        {/* Target Structure */}
        <div className="relative z-10 w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center">
           <div className={`w-12 h-12 rounded-full bg-white/10 ${reduction > 50 ? 'opacity-100' : 'opacity-40'} transition-opacity duration-500`} />
           <p className="absolute -bottom-6 text-[8px] font-black uppercase text-white/50">Target Cyst</p>
        </div>

        <div className="absolute top-4 left-4 text-[8px] font-black text-slate-500 uppercase">Raw Interference Pattern</div>
        <div className="absolute bottom-4 right-4 text-[8px] font-black text-registry-teal uppercase italic">Post-Processing Active</div>
      </div>

      <VisualInsight 
        title="Acoustic Speckle" 
        description="Speckle is the grainy appearance of ultrasound images caused by constructive and destructive interference of small scatterers. Speckle reduction filters (like compound imaging) help improve contrast resolution." 
      />
    </div>
  );
};

// ContrastResolutionVisual component for bit depth and gray shades
export const ContrastResolutionVisual: React.FC = () => {
  const [bitDepth, setBitDepth] = useState(3); // 1 to 8 bits
  const grayShades = Math.pow(2, bitDepth);
  
  return (
    <div className="bg-white dark:bg-stealth-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <GrainOverlay />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Binary className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contrast Resolution Lab</span>
        </div>
        <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5">
          <span className="text-[10px] font-black uppercase text-slate-500">{bitDepth} Bits ({grayShades} Shades)</span>
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
          // Calculate shade based on bit depth
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
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="bg-stealth-950/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
              <p className="text-[10px] font-black text-white italic uppercase tracking-widest">Digital Scan Converter</p>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Contrast Resolution" 
        description="Contrast resolution is the ability to distinguish between different shades of gray. It is primarily determined by the number of bits per pixel in the scan converter. More bits = more shades of gray = better contrast resolution." 
      />
    </div>
  );
};
