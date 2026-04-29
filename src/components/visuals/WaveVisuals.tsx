import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Waves, Ruler, Repeat, Activity, Info, Loader2, Volume2, Search, Zap, Book, Sparkles, AlertCircle, Database, Monitor,
  Cpu, Maximize2, Shield, Target, Layers, Radar, Settings, Activity as ActivityIcon, Sliders, Hexagon, Compass
} from 'lucide-react';
import { generateSpeech } from '../../services/aiService';
import { decodeBase64, pcmToWav } from '../../lib/audioUtils';
import { CompanionAvatar } from '../CompanionAvatar';
import { GrainOverlay, ScanlineOverlay } from './UtilityVisuals';
import { VisualInsight, VideoTutorialLink, VisualHeader } from './BaseVisuals';

// --- WAVE MECHANICS VISUALS ---


export const MasterOscilloscope: React.FC = () => {
  const [frequency, setFrequency] = useState(2.5); // MHz
  const [amplitude, setAmplitude] = useState(50); // Peak Pressure / Amplitude
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.1);
      if (Math.random() > 0.98) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    if (!isPlaying) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      oscillator.current = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.current.type = 'sine';
      oscillator.current.frequency.setValueAtTime(200 + (frequency * 100), audioContext.current.currentTime);
      gainNode.gain.setValueAtTime(amplitude / 200, audioContext.current.currentTime);
      
      oscillator.current.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      oscillator.current.start();
      setIsPlaying(true);
    } else {
      if (oscillator.current) {
        oscillator.current.stop();
        oscillator.current.disconnect();
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying && oscillator.current && audioContext.current) {
      oscillator.current.frequency.setTargetAtTime(200 + (frequency * 100), audioContext.current.currentTime, 0.1);
    }
  }, [frequency, isPlaying]);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-[0_0_100px_rgba(45,212,191,0.1)] relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Master Oscilloscope" 
        subtitle="Signal Analysis Matrix" 
        icon={Monitor} 
        color="text-registry-teal"
        protocol="09-SIG"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative shadow-2xl group/scope">
            <div className={`absolute inset-0 bg-registry-teal/5 transition-opacity duration-300 ${glitch ? 'opacity-20' : 'opacity-0'}`} />
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-8 opacity-10 pointer-events-none">
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-registry-teal/20" />
              ))}
            </div>
            
            <svg className={`w-full h-full relative z-10 transition-all duration-300 ${glitch ? 'translate-x-1 skew-x-2' : ''}`} viewBox="0 0 800 300" preserveAspectRatio="none">
              <defs>
                <filter id="waveGlow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#2dd4bf" stopOpacity="1" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <motion.path 
                d={`M 0 150 ${Array.from({ length: 161 }).map((_, i) => {
                  const x = (i / 160) * 800;
                  const y = 150 + Math.sin((x + time * 50) * 0.05 * frequency) * amplitude;
                  return `L ${x} ${y}`;
                }).join(' ')}`} 
                fill="none" 
                stroke="url(#waveGrad)" 
                strokeWidth="5" 
                filter="url(#waveGlow)"
                className="drop-shadow-glow"
              />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="10 5" />
            </svg>
            
            <div className="absolute top-6 left-8 flex space-x-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Amplitude Vector</span>
                <span className="text-2xl font-mono font-black text-white italic tabular-nums shadow-glow-sm tracking-widest">{amplitude} dB</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Temporal Scale</span>
                <span className="text-2xl font-mono font-black text-registry-teal italic tabular-nums shadow-glow-teal tracking-widest">{(1/frequency).toFixed(2)} μs</span>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-8 flex items-center space-x-3 bg-stealth-900/60 backdrop-blur-md px-5 py-2.5 rounded-[1.5rem] border border-white/10">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-registry-teal animate-pulse shadow-glow' : 'bg-slate-700'}`} />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] font-mono leading-none">
                {isPlaying ? 'Acoustic Signal Active' : 'System Ready'}
              </span>
            </div>

            <div className="absolute bottom-6 right-8 flex items-center space-x-3 text-slate-600">
               <Cpu className="w-4 h-4" />
               <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-black italic">V-Engine Protocol 9.0</span>
            </div>
          </div>

          <button 
            onClick={toggleSound}
            className={`w-full py-5 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-center space-x-4 group/btn ${
              isPlaying 
                ? 'bg-registry-rose border-registry-rose/40 text-white shadow-glow-rose' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-registry-teal/40 hover:bg-white/10'
            }`}
          >
            <Volume2 className={`w-6 h-6 ${isPlaying ? 'animate-bounce' : ''}`} />
            <span className="text-[12px] font-black uppercase tracking-[0.4em] italic leading-none">
              {isPlaying ? 'Deactivate Audio Stream' : 'Initiate Audio Decryption'}
            </span>
          </button>
        </div>

        <div className="flex flex-col justify-center space-y-12">
          <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center space-x-3">
                 <Settings className="w-4 h-4 text-registry-teal" />
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Frequency MHz</span>
              </div>
              <span className="text-3xl font-black italic text-registry-teal drop-shadow-glow tabular-nums leading-none">{frequency.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="1.0" max="15.0" step="0.5" 
              value={frequency} 
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner"
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center space-x-3">
                 <Zap className="w-4 h-4 text-registry-rose" />
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Amplitude dB</span>
              </div>
              <span className="text-3xl font-black italic text-registry-rose drop-shadow-glow tabular-nums leading-none">{amplitude}</span>
            </div>
            <input 
              type="range" min="5" max="120" 
              value={amplitude} 
              onChange={(e) => setAmplitude(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose shadow-inner"
            />
          </div>

          <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 relative overflow-hidden group/box">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity duration-500" />
             <div className="flex items-start space-x-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30">
                  <Target className="w-5 h-5 text-amber-500" />
                </div>
                <div className="space-y-3">
                   <h6 className="text-[11px] font-black uppercase text-amber-500 tracking-[0.3em] italic">Technical Pearl</h6>
                   <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic uppercase">
                     Higher MHz provides precision resolution but struggles with path loss. Balance MHz against the required depth of the scan domain.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <VisualInsight 
        title="Oscilloscope Analysis" 
        description="The oscilloscope visualizes wave dynamics by mapping voltage (amplitude) against time. In sonography, this represents the raw echoes returning from tissue. Adjusting the frequency mimics different transducers, while amplitude represents the power or gain applied to the signal."
        keyTerms={['frequency', 'amplitude', 'echoes', 'transducers', 'voltage']}
      />
    </motion.div>
  );
};

export const LongitudinalWaveVisual: React.FC = () => {
  const [active, setActive] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (active) setTime(t => t + 0.1);
    }, 30);
    return () => clearInterval(interval);
  }, [active]);
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Acoustic Particle Matrix" 
        subtitle="Longitudinal Displacement Loop" 
        icon={Waves} 
        protocol="02-WVE"
      />

      <div className="flex justify-center mb-10 relative z-10">
        <button 
           onClick={() => setActive(!active)}
           className={`px-10 py-4 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] italic border-2 transition-all duration-500 ${
             active 
               ? 'bg-registry-teal border-registry-teal text-stealth-950 shadow-glow' 
               : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
           }`}
        >
           {active ? 'Protocol Active' : 'Matrix Frozen'}
        </button>
      </div>

      <div className="h-56 md:h-72 flex items-center justify-around bg-stealth-950 rounded-[3rem] p-10 border-2 border-white/5 shadow-inner relative overflow-hidden group/display">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <div className="absolute inset-0 grid grid-cols-12 opacity-5 pointer-events-none">
           {Array.from({ length: 12 }).map((_, i) => (
             <div key={i} className="border-r border-registry-teal/40 shadow-glow-sm" />
           ))}
        </div>
        
        {Array.from({ length: 24 }).map((_, i) => {
          const phase = i * 0.4;
          const wave = Math.sin(time * 2 - phase);
          const xOffset = active ? wave * 15 : 0;
          return (
            <motion.div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${i % 4 === 0 ? 'bg-registry-teal shadow-glow' : 'bg-slate-700'}`}
              animate={active ? { 
                x: xOffset,
                opacity: 0.3 + (Math.abs(wave) * 0.7),
                scale: 1 + (Math.abs(wave) * 0.3)
              } : {}}
            />
          );
        })}
        
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-600 uppercase tracking-[0.8em] italic opacity-50 group-hover/display:opacity-100 transition-opacity">
           Compression - Rarefaction Protocol
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 relative z-10">
        <div className="bg-stealth-950/60 p-8 rounded-[2.5rem] border border-white/5 border-l-4 border-l-registry-teal ring-4 ring-black/20 group/card">
          <div className="flex items-center space-x-3 mb-4">
             <Layers className="w-4 h-4 text-registry-teal" />
             <span className="text-[10px] font-black uppercase text-registry-teal tracking-[0.3em] italic">Compression Core</span>
          </div>
          <p className="text-[13px] font-bold text-slate-400 italic leading-relaxed font-sans uppercase">Region of high particle density and pressure. Pulse energizer localizing molecules.</p>
        </div>
        <div className="bg-stealth-950/60 p-8 rounded-[2.5rem] border border-white/5 border-l-4 border-l-slate-700 ring-4 ring-black/20 group/card">
          <div className="flex items-center space-x-3 mb-4">
             <Shield className="w-4 h-4 text-slate-600" />
             <span className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] italic">Rarefaction Void</span>
          </div>
          <p className="text-[13px] font-bold text-slate-400 italic leading-relaxed font-sans uppercase">Region of low density. Elastic rebound creates temporary atmospheric depletion.</p>
        </div>
      </div>

      <VisualInsight 
        title="Acoustic Mechanics" 
        description="Sound waves are mechanical longitudinal waves. The molecules of the medium oscillate back and forth in the same direction that the wave travels. This creates traveling regions of high pressure (compression) and low pressure (rarefaction)."
        keyTerms={['longitudinal', 'oscillate', 'compression', 'rarefaction', 'pressure']}
      />
    </motion.div>
  );
};


export const WaveParametersVisual: React.FC = () => {
  const [freq, setFreq] = useState(5);
  const [amp, setAmp] = useState(50);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.1), 30);
    return () => clearInterval(interval);
  }, []);

  const wavelength = (1.54 / freq).toFixed(3);
  const period = (1 / freq).toFixed(3);
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      
      <VisualHeader 
        title="Wave Parameter Analysis" 
        subtitle="Spectral Configuration Matrix" 
        icon={Sliders} 
        protocol="05-PRM"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-white/5 relative overflow-hidden shadow-2xl group/analyzer">
          <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-registry-teal/5" />
          
          <svg className="w-full h-full relative z-10" viewBox="0 0 400 200" preserveAspectRatio="none">
             <motion.path 
               d={`M 0 100 ${Array.from({ length: 101 }).map((_, i) => {
                 const x = (i / 100) * 400;
                 const y = 100 + Math.sin((x + time * 20) * 0.05 * freq) * amp;
                 return `L ${x} ${y}`;
               }).join(' ')}`}
               fill="none"
               stroke="#2dd4bf"
               strokeWidth="5"
               className="drop-shadow-glow"
             />
             <line x1="0" y1="100" x2="400" y2="100" stroke="#1e293b" strokeWidth="1" strokeDasharray="10 5" />
             
             {/* Dimension Overlays */}
             <motion.g animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 3, repeat: Infinity }}>
               <line x1="200" y1={100 - amp} x2="200" y2={100 + amp} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />
               <text x="210" y={100} fill="#f43f5e" className="text-[10px] font-black uppercase italic tracking-widest">Amp</text>
             </motion.g>
          </svg>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-8 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5 shadow-2xl">
             <div className="flex items-center space-x-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">λ [Wavelength]:</span>
                <span className="text-[11px] font-black text-registry-teal italic tabular-nums">{wavelength} mm</span>
             </div>
             <div className="w-px h-3 bg-white/10" />
             <div className="flex items-center space-x-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">T [Period]:</span>
                <span className="text-[11px] font-black text-registry-teal italic tabular-nums">{period} μs</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-12 shrink-0">
           <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                 <div className="flex items-center space-x-3">
                    <ActivityIcon className="w-4 h-4 text-registry-teal" />
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Frequency Sweep</span>
                 </div>
                 <span className="text-3xl font-black italic text-registry-teal drop-shadow-glow leading-none tabular-nums">{freq} <span className="text-[12px]">MHz</span></span>
              </div>
              <input 
                type="range" min="1" max="15" step="1" 
                value={freq} 
                onChange={(e) => setFreq(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner"
              />
           </div>
           
           <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                 <div className="flex items-center space-x-3">
                    <Zap className="w-4 h-4 text-registry-rose" />
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Intensity Index</span>
                 </div>
                 <span className="text-3xl font-black italic text-registry-rose drop-shadow-glow leading-none tabular-nums">{amp} <span className="text-[12px]">dB</span></span>
              </div>
              <input 
                type="range" min="10" max="90" step="5" 
                value={amp} 
                onChange={(e) => setAmp(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose shadow-inner"
              />
           </div>

           <div className="bg-stealth-950 p-8 rounded-[2.5rem] border border-white/5 border-l-4 border-l-registry-teal shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
              <div className="flex items-start space-x-4">
                 <Radar className="w-6 h-6 text-registry-teal mt-1 animate-pulse" />
                 <div>
                    <h6 className="text-[12px] font-black uppercase text-registry-teal italic mb-2 tracking-widest leading-none">Diagnostic Summary</h6>
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic uppercase">
                      Higher frequency is the enemy of depth. Every MHz added increases attenuation and reduces the scan domain while tightening axial resolution.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Spectral Wave Parameters" 
        description="Every sound wave is defined by parameters set by either the source (transducer) or the medium (tissue). Frequency and period are inversely related. Amplitude, Power, and Intensity describes the 'bigness' or magnitude of the wave."
        keyTerms={['frequency', 'period', 'amplitude', 'power', 'intensity']}
      />
    </motion.div>
  );
};

export const ReflectionLab: React.FC = () => {
  const [angle, setAngle] = useState(30);
  const rad = (angle * Math.PI) / 180;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Reflection Lab" 
        subtitle="Specular Interface Simulator" 
        icon={Repeat} 
        protocol="03-RFL"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative flex items-center justify-center shadow-inner group/scope">
          <div className="absolute inset-0 scanline opacity-20" />
          <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
            <line x1="50" y1="150" x2="350" y2="150" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.1" />
            <line x1="200" y1="50" x2="200" y2="150" stroke="white" strokeWidth="1" opacity="0.1" strokeDasharray="6 4" />
            
            {/* Incident Ray */}
            <motion.line 
              animate={{ strokeDashoffset: [0, -30] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              x1={200 - Math.sin(rad) * 140} y1={150 - Math.cos(rad) * 140}
              x2="200" y2="150"
              stroke="#2dd4bf"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="15 10"
              className="drop-shadow-glow"
            />
            
            {/* Reflected Ray */}
            <motion.line 
              animate={{ strokeDashoffset: [0, 30] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              x1="200" y1="150"
              x2={200 + Math.sin(rad) * 140} y2={150 - Math.cos(rad) * 140}
              stroke="#2dd4bf"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="15 10"
              opacity="0.6"
              className="drop-shadow-glow opacity-50"
            />
            
            <text x={200 - 60} y={135} fill="#2dd4bf" className="text-[12px] font-black italic tracking-tighter shadow-glow-sm" opacity="0.9">θi = {angle}°</text>
            <text x={200 + 20} y={135} fill="#2dd4bf" className="text-[12px] font-black italic tracking-tighter shadow-glow-sm" opacity="0.6">θr = {angle}°</text>
          </svg>
          
          <div className="absolute bottom-6 px-5 py-2 bg-stealth-900/80 border border-white/10 rounded-full backdrop-blur-xl transition-all group-hover/scope:border-registry-teal/40">
             <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] italic leading-none">Specular Boundary Detected</span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-12">
          <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center space-x-3">
                 <Radar className="w-4 h-4 text-registry-teal" />
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Angle Tuning</span>
              </div>
              <span className="text-3xl font-black italic text-registry-teal drop-shadow-glow tabular-nums leading-none">{angle}°</span>
            </div>
            <input 
              type="range" min="0" max="85" 
              value={angle} 
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-stealth-950 rounded-[2rem] border border-white/5 group/stat">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover/stat:text-registry-teal transition-colors">Boundary Type</p>
                <p className="text-[14px] font-black text-white italic truncate uppercase">Specular Smooth</p>
             </div>
             <div className="p-6 bg-stealth-950 rounded-[2rem] border border-white/5 group/stat">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover/stat:text-registry-teal transition-colors">Echo Profile</p>
                <p className="text-[14px] font-black text-white italic truncate uppercase">{angle < 10 ? 'Ideal Pulse' : angle > 70 ? 'Total Loss' : 'Directional'}</p>
             </div>
          </div>
        </div>
      </div>

      <VisualInsight 
        title="Specular Dynamics" 
        description="Specular reflection occurs when ultrasound hits a large, smooth boundary. The Law of Reflection states that θi = θr. In clinical scanning, the best echoes are received when the beam is perpendicular (90°) to the interface. Any deviation causes energy to 'bounce away' from the transducer."
        keyTerms={['specular', 'reflection', 'interface', 'perpendicular', 'echo']}
      />
    </motion.div>
  );
};

export const RefractionLab: React.FC = () => {
  const [angle, setAngle] = useState(30);
  const [speed1, setSpeed1] = useState(1540);
  const [speed2, setSpeed2] = useState(1620);

  const rad1 = (angle * Math.PI) / 180;
  const sinTheta2 = (speed2 / speed1) * Math.sin(rad1);
  const angle2 = sinTheta2 > 1 ? 90 : (Math.asin(sinTheta2) * 180) / Math.PI;
  const rad2 = (angle2 * Math.PI) / 180;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Refraction Lab" 
        subtitle="Snell's Law Dynamic Array" 
        icon={ActivityIcon} 
        color="text-registry-rose"
        protocol="04-RFR"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative flex items-center justify-center shadow-inner group/scope">
          <div className="absolute inset-0 scanline opacity-20" />
          <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
            <defs>
               <linearGradient id="media1" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.1" />
                 <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
               </linearGradient>
               <linearGradient id="media2" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
                 <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.1" />
               </linearGradient>
            </defs>
            <rect x="0" y="0" width="400" height="100" fill="url(#media1)" />
            <rect x="0" y="100" width="400" height="100" fill="url(#media2)" />
            
            <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeWidth="2" opacity="0.2" strokeDasharray="8 4" />
            <line x1="200" y1="0" x2="200" y2="200" stroke="white" strokeWidth="1" opacity="0.1" strokeDasharray="4 4" />
            
            {/* Incident Ray */}
            <motion.line 
              animate={{ strokeDashoffset: [0, -25] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              x1={200 - Math.sin(rad1) * 120} y1={100 - Math.cos(rad1) * 120}
              x2="200" y2="100"
              stroke="#2dd4bf"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="12 8"
              className="drop-shadow-glow"
            />
            
            {/* Refracted Ray */}
            <motion.line 
              animate={{ 
                strokeDashoffset: [0, -25],
                opacity: sinTheta2 > 1 ? 0.1 : 0.8 
              }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              x1="200" y1="100"
              x2={200 + Math.sin(rad2) * 120} y2={100 + Math.cos(rad2) * 120}
              stroke="#f43f5e"
              strokeWidth={sinTheta2 > 1 ? 2 : 5}
              strokeLinecap="round"
              strokeDasharray="12 8"
              className="drop-shadow-glow-rose"
            />
            
            {sinTheta2 > 1 && (
              <text x="130" y="130" fill="#f43f5e" className="text-[12px] font-black animate-pulse uppercase tracking-[0.3em] italic shadow-glow-rose">Critical Angle Reached</text>
            )}
          </svg>
          
          <div className="absolute top-6 left-8 flex flex-col items-start gap-1">
             <span className="text-[9px] font-black text-registry-teal uppercase tracking-widest italic opacity-60">Medium A</span>
             <span className="text-[11px] font-black text-white italic tabular-nums">{speed1} m/s</span>
          </div>
          <div className="absolute bottom-6 left-8 flex flex-col items-start gap-1">
             <span className="text-[9px] font-black text-registry-rose uppercase tracking-widest italic opacity-60">Medium B</span>
             <span className="text-[11px] font-black text-white italic tabular-nums">{speed2} m/s</span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-10">
           <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                 <div className="flex items-center space-x-3">
                    <Target className="w-4 h-4 text-registry-teal" />
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Incident Angle</span>
                 </div>
                 <span className="text-3xl font-black italic text-registry-teal drop-shadow-glow leading-none tabular-nums">{angle}°</span>
              </div>
              <input 
                type="range" min="0" max="80" 
                value={angle} 
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner"
              />
           </div>

           <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                 <div className="flex items-center space-x-3">
                    <Zap className="w-4 h-4 text-registry-rose" />
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Medium B Speed</span>
                 </div>
                 <span className="text-3xl font-black italic text-registry-rose drop-shadow-glow leading-none tabular-nums">{speed2} <span className="text-[12px]">m/s</span></span>
              </div>
              <input 
                type="range" min="1400" max="1800" step="10"
                value={speed2} 
                onChange={(e) => setSpeed2(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose shadow-inner"
              />
           </div>

           <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 relative overflow-hidden group/box">
              <div className="absolute inset-0 bg-gradient-to-br from-registry-rose/5 to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start space-x-4">
                 <Shield className="w-6 h-6 text-registry-rose mt-1" />
                 <div>
                    <h6 className="text-[12px] font-black uppercase text-registry-rose italic mb-2 tracking-widest leading-none">Security Alert: Refraction</h6>
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic uppercase">
                      Snell's Law: (sinθ₁/v₁) = (sinθ₂/v₂). Refraction causes lateral displacement artifacts, where anatomy appears in the 'wrong place' on the screen.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Refraction Artifacts" 
        description="Refraction is the bending of the ultrasound beam. It requires two conditions: oblique incidence (θ ≠ 0) and different propagation speeds in the media. If speeds are identical, or the beam is perpendicular, refraction is impossible."
        keyTerms={['refraction', 'snell', 'oblique', 'incidence', 'displacement']}
      />
    </motion.div>
  );
};

export const ScatteringLab: React.FC = () => {
  const [particleSize, setParticleSize] = useState(0.2);
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
        title="Scattering Lab" 
        subtitle="Particle Interaction Matrix" 
        icon={Zap} 
        color="text-amber-500"
        protocol="06-SCT"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] border-2 border-slate-800 overflow-hidden relative flex items-center justify-center shadow-inner group/scope">
          <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
          <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
            <motion.line 
              x1="0" y1="100" x2="180" y2="100"
              stroke="#2dd4bf"
              strokeWidth="5"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              strokeDasharray="10 5"
              className="drop-shadow-glow"
            />
            <circle cx="200" cy="100" r={particleSize * 45} fill="#f59e0b" className="shadow-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
            
            {particleSize < 0.3 ? (
              Array.from({ length: 16 }).map((_, i) => {
                const ang = (i / 16) * Math.PI * 2;
                return (
                  <motion.line 
                    key={i}
                    x1="200" y1="100" 
                    x2={200 + Math.cos(ang) * 70} 
                    y2={100 + Math.sin(ang) * 70}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
                  />
                );
              })
            ) : (
              Array.from({ length: 5 }).map((_, i) => {
                const ang = (i - 2) * 0.3;
                return (
                  <motion.line 
                    key={i}
                    x1="200" y1="100" 
                    x2={200 - Math.cos(ang) * 100} 
                    y2={100 + Math.sin(ang) * 100}
                    stroke="#2dd4bf"
                    strokeWidth="3"
                    animate={{ opacity: [0, 0.7, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className="drop-shadow-glow"
                  />
                );
              })
            )}
          </svg>
          
          <div className="absolute top-6 left-8 flex items-center space-x-3">
             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-glow-sm" />
             <span className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.2em] font-black">Reflector Type: {particleSize < 0.3 ? 'RAYLEIGH' : 'SPECULAR'}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-12">
           <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                 <div className="flex items-center space-x-3">
                    <Maximize2 className="w-4 h-4 text-amber-500" />
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Reflector Dimensions</span>
                 </div>
                 <span className="text-3xl font-black italic text-amber-500 drop-shadow-glow leading-none tabular-nums">{particleSize.toFixed(2)} <span className="text-[12px]">µm</span></span>
              </div>
              <input 
                type="range" min="0.05" max="1" step="0.05"
                value={particleSize} 
                onChange={(e) => setParticleSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 shadow-inner"
              />
           </div>

           <div className="bg-stealth-950 p-8 rounded-[2.5rem] border border-white/5 border-l-4 border-l-amber-500 shadow-2xl relative overflow-hidden group/pearl">
              <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
              <div className="flex items-start space-x-4">
                 <Sparkles className="w-6 h-6 text-amber-500 mt-1" />
                 <div>
                    <h6 className="text-[12px] font-black uppercase text-amber-500 italic mb-2 tracking-widest leading-none">Diagnostic Pearl</h6>
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic uppercase leading-snug">
                      Rayleigh scattering occurs when reflectors are smaller than the wavelength (λ). KEY FACT: Scattering is proportional to Frequency⁴. Double the frequency, and scattering increases 16-fold!
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <VisualInsight 
        title="Scattering Dynamics" 
        description="Scattering occurs when ultrasound strikes a medium with a rough surface or reflectors smaller than the wavelength. Rayleigh Scattering is a specialized form where sound is redirected equally in all directions, typical of Red Blood Cells."
        keyTerms={['scattering', 'rayleigh', 'reflector', 'frequency', 'wavelength']}
      />
    </motion.div>
  );
};

export const WaveInteractionVisual: React.FC = () => {
  const [mode, setMode] = useState<'reflection' | 'refraction' | 'scattering'>('reflection');
  const [angle, setAngle] = useState(30);
  const rad = (angle * Math.PI) / 180;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/60 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl space-y-8 transition-all duration-500 relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Interaction Dynamics" 
        subtitle="Universal Wave Interface" 
        icon={Hexagon} 
        protocol="07-INT"
      />

      <div className="flex gap-2 p-1.5 bg-stealth-950/80 rounded-[2rem] border border-white/5 shadow-inner relative z-10">
        {(['reflection', 'refraction', 'scattering'] as const).map(m => (
          <button 
            key={m} 
            onClick={() => setMode(m)} 
            className={`flex-1 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
              mode === m 
                ? 'bg-registry-teal text-white shadow-[0_0_20px_rgba(45,212,191,0.3)] scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] overflow-hidden border-2 border-slate-800 relative shadow-2xl group/scope">
        <div className="absolute inset-0 scanline opacity-20" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="mediumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          
          <rect x="0" y="100" width="400" height="100" fill="url(#mediumGrad)" />
          <line x1="0" y1="100" x2="400" y2="100" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
          
          <text x="20" y="85" fill="#2dd4bf" className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em] italic">Medium Alpha</text>
          <text x="20" y="125" fill="#2dd4bf" className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em] italic">Medium Beta</text>

          {/* Incident Ray */}
          <motion.line 
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            x1={200 - Math.sin(rad)*120} y1={100 - Math.cos(rad)*120} 
            x2={200} y2={100} 
            stroke="#2dd4bf" 
            strokeWidth="5" 
            strokeDasharray="12 6"
            className="drop-shadow-glow"
          />

          {mode === 'reflection' && (
            <motion.line 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, strokeDashoffset: [0, 20] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              x1={200} y1={100} 
              x2={200 + Math.sin(rad)*120} y2={100 - Math.cos(rad)*120} 
              stroke="#0ea5e9" 
              strokeWidth="4" 
              strokeDasharray="12 6"
              className="drop-shadow-glow opacity-60"
            />
          )}

          {mode === 'refraction' && (
            <motion.line 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, strokeDashoffset: [0, -20] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              x1={200} y1={100} 
              x2={200 + Math.sin(rad * 1.4)*120} y2={100 + Math.cos(rad * 1.4)*120} 
              stroke="#f43f5e" 
              strokeWidth="4" 
              strokeDasharray="12 6"
              className="drop-shadow-glow-rose opacity-80"
            />
          )}

          {mode === 'scattering' && Array.from({length: 12}).map((_, i) => {
            const ang = (i * Math.PI * 2) / 12;
            return (
              <motion.line 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0], x: [0, Math.cos(ang)*50], y: [0, Math.sin(ang)*50] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.08 }}
                x1={200} y1={100} x2={200} y2={100}
                stroke="#FACC15" strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          <circle cx={200} cy={100} r="8" fill="#FACC15" className="shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
        </svg>
      </div>

      <div className="space-y-6 relative z-10 px-2">
        <div className="flex justify-between items-end mb-2">
           <div className="flex items-center space-x-3">
              <Compass className="w-4 h-4 text-registry-teal" />
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Incident Alignment</span>
           </div>
           <span className="text-3xl font-black italic text-registry-teal drop-shadow-glow leading-none tabular-nums">{angle}°</span>
        </div>
        <input 
          type="range" min="0" max="65" 
          value={angle} 
          onChange={(e) => setAngle(Number(e.target.value))} 
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal shadow-inner" 
        />
      </div>

      <VisualInsight 
        title="Interaction Mechanics" 
        description={mode === 'reflection' ? "Specular reflection occurs at large interfaces. θi = θr." : mode === 'refraction' ? "Refraction bend waves at velocity boundaries. Snell's Law applies." : "Scattering dissipates energy in multiple directions when it hits small reflectors."} 
        keyTerms={['interface', 'boundary', 'interaction', 'velocity']}
      />
    </motion.div>
  );
};

export const IntensityProfileVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-10 rounded-[3.5rem] border-2 border-white/5 shadow-2xl space-y-6 relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Intensity Profile" 
        subtitle="Spatial Distribution Matrix" 
        icon={ActivityIcon} 
        color="text-registry-rose"
        protocol="08-INT"
      />

      <div className="h-64 bg-stealth-950 rounded-[2.5rem] border-2 border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner group/plot">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-registry-rose/5 to-transparent" />
        <svg className="w-full h-full p-8" viewBox="0 0 400 150">
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d="M 50 130 Q 200 10 350 130" 
            fill="url(#intensityGrad)" 
            stroke="#f43f5e" 
            strokeWidth="5"
            className="drop-shadow-glow-rose"
          />
          <defs>
            <linearGradient id="intensityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }}>
            <circle cx="200" cy="40" r="4" fill="#f43f5e" className="animate-pulse shadow-glow-rose" />
            <text x="215" y="45" fill="#f43f5e" className="text-[12px] font-black uppercase tracking-[0.2em] italic">Spatial Peak (SP)</text>
            
            <line x1="50" y1="130" x2="350" y2="130" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
            <text x="200" y="145" textAnchor="middle" fill="#f43f5e" className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Spatial Average (SA) Domain</text>
          </motion.g>
        </svg>
      </div>

      <VisualInsight 
        title="Energy Concentration" 
        description="Ultrasound intensity is not uniform. Spatial Peak (SP) is the beam's center concentration, while Spatial Average (SA) is the mean over the cross-section. The beam uniformity coefficient (BUC) describes this spread."
        keyTerms={['spatial', 'intensity', 'distribution', 'peak', 'average']}
      />
    </motion.div>
  );
};

export const SpecularScatteringVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-10 rounded-[3.5rem] border-2 border-white/5 shadow-2xl space-y-8 relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Backscatter Engine" 
        subtitle="Diffuse Reflection Dynamics" 
        icon={Search} 
        color="text-registry-teal"
        protocol="09-BSK"
      />

      <div className="h-64 bg-stealth-950 rounded-[2.5rem] border-2 border-slate-800 relative overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center p-8">
        <svg className="w-full h-full" viewBox="0 0 400 150">
          <line x1="200" y1="20" x2="200" y2="130" stroke="white" strokeWidth="4" strokeDasharray="2 4" opacity="0.1" />
          
          {/* Incident Beam */}
          <motion.path 
            d="M 50 75 L 180 75" 
            stroke="#2dd4bf" 
            strokeWidth="5" 
            strokeDasharray="12 8"
            animate={{ strokeDashoffset: [0, -40] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="drop-shadow-glow"
          />

          {/* Scatters */}
          {Array.from({length: 12}).map((_, i) => (
            <motion.line 
              key={i}
              x1="200" y1="75"
              x2={200 - Math.cos(i * 0.5 - 1)*80}
              y2={75 + Math.sin(i * 0.5 - 1)*80}
              stroke="#FACC15"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ opacity: [0, 0.7, 0], scale: [0.8, 1.1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
          
          <circle cx="200" cy="75" r="6" fill="#FACC15" className="shadow-amber-500/50 shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          <text x="220" y="45" fill="#FACC15" className="text-[12px] font-black uppercase tracking-widest italic drop-shadow-sm">Diffuse Backscatter</text>
        </svg>
      </div>

      <VisualInsight 
        title="Energy Recirculation" 
        description="Unlike specular reflection, diffuse reflection (backscatter) sends energy in multiple directions after hitting a rough interface. Clinical benefit: You can see organs despite bad transducer angles, though echoes are much weaker than specular."
        keyTerms={['backscatter', 'diffuse', 'reflection', 'interface', 'angles']}
      />
    </motion.div>
  );
};


export const SpeedOfSoundTable: React.FC = () => {
  const materials = [
    { name: 'Air', speed: 330, color: 'text-slate-400', barColor: 'bg-slate-400' },
    { name: 'Fat', speed: 1450, color: 'text-amber-400', barColor: 'bg-amber-400' },
    { name: 'Soft Tissue', speed: 1540, color: 'text-registry-teal', barColor: 'bg-registry-teal' },
    { name: 'Muscle', speed: 1580, color: 'text-emerald-400', barColor: 'bg-emerald-400' },
    { name: 'Bone', speed: 3500, color: 'text-slate-200', barColor: 'bg-white' }
  ];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-10 rounded-[3.5rem] border-2 border-white/5 shadow-2xl space-y-6 relative overflow-hidden group w-full"
    >
      <VisualHeader 
        title="Propagation Matrix" 
        subtitle="Speed of Sound Index" 
        icon={Database} 
        protocol="10-SPD"
      />

      <div className="space-y-3 relative z-10">
        {materials.map((m, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-4 bg-stealth-950/80 rounded-2xl border border-white/5 group/row hover:bg-white/5 transition-all"
          >
            <div className="w-24 shrink-0">
               <span className={`text-[11px] font-black uppercase tracking-widest ${m.color} italic`}>{m.name}</span>
            </div>
            <div className="flex items-center space-x-6 flex-1 mx-4">
              <div className="h-1.5 flex-1 bg-slate-800/50 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: `${(m.speed / 3500) * 100}%` }}
                   transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                   className={`h-full ${m.barColor} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                />
              </div>
            </div>
            <div className="w-20 text-right">
               <span className="text-[12px] font-black text-white tabular-nums italic">{m.speed} <span className="text-[9px] text-slate-500 font-normal">m/s</span></span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <VisualInsight 
        title="Material Conductivity" 
        description="Propagation speed is determined by medium stiffness (Bulk Modulus) and density. Generally, sound travels slowest in gases, faster in liquids, and fastest in solids. Average speed in soft tissue is exactly 1,540 m/s."
        keyTerms={['stiffness', 'density', 'medium', 'propagation']}
      />
    </motion.div>
  );
};

export const AcousticImpedanceVisual: React.FC = () => {
  const [density, setDensity] = useState(1.0);
  const [stiffness, setStiffness] = useState(1540);
  const impedance = (density * stiffness).toFixed(1);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-10 rounded-[3.5rem] border-2 border-white/5 shadow-2xl space-y-8 relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Acoustic Impedance" 
        subtitle="Z-Factor Analysis Engine" 
        icon={Zap} 
        color="text-registry-teal"
        protocol="11-IMP"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="flex flex-col justify-center items-center h-48 bg-stealth-950 rounded-[2.5rem] border-2 border-slate-800 shadow-2xl relative overflow-hidden group/display">
          <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/10 to-transparent pointer-events-none" />
          <div className="text-center relative z-10 scale-110 group-hover/display:scale-125 transition-transform duration-500">
            <div className="text-5xl font-black text-registry-teal italic drop-shadow-glow tabular-nums leading-none tracking-tighter">{impedance}</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 italic">Rayls (Z-Unity)</div>
          </div>
          <div className="absolute bottom-4 right-6 flex items-center space-x-2">
             <div className="w-1.5 h-1.5 rounded-full bg-registry-teal animate-ping" />
             <span className="text-[9px] font-black text-slate-600 uppercase">Live Output</span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Medium Density [ρ]</label>
              <span className="text-[12px] font-black text-white italic tabular-nums">{density.toFixed(1)} g/cm³</span>
            </div>
            <input 
              type="range" min="0.5" max="2" step="0.1" 
              value={density} 
              onChange={e => setDensity(Number(e.target.value))} 
              className="w-full h-2 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer shadow-inner" 
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Propagation Speed [v]</label>
              <span className="text-[12px] font-black text-white italic tabular-nums">{stiffness} m/s</span>
            </div>
            <input 
              type="range" min="1400" max="1700" 
              value={stiffness} 
              onChange={e => setStiffness(Number(e.target.value))} 
              className="w-full h-2 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer shadow-inner" 
            />
          </div>
        </div>
      </div>
      
      <VisualInsight 
        title="Impedance Logic" 
        description="Impedance (Z = ρ * v) is the resistance to sound traveling through a medium. Reflections depend on the impedance DIFFERENCE between two media. Large gaps (like air vs. soft tissue) cause 99% reflection, necessitating ultrasound gel (matching layer)."
        keyTerms={['impedance', 'density', 'resistance', 'matching', 'reflection']}
      />
    </motion.div>
  );
};

export const HuygensPrincipleVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Huygens Wavelets" 
        subtitle="Wavelet Synthesis Engine" 
        icon={Sparkles} 
        protocol="08-HUY"
      />

      <div className="h-64 md:h-80 bg-stealth-950 rounded-[3rem] relative overflow-hidden flex flex-col items-center border-2 border-slate-800 shadow-inner p-8 group/scope">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <div className="absolute inset-x-0 top-12 flex justify-center space-x-2 relative z-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center relative">
              <div className="w-1.5 h-1.5 rounded-full bg-registry-teal shadow-glow-sm" />
              {Array.from({ length: 3 }).map((_, j) => (
                <motion.div 
                  key={j}
                  animate={{ 
                    scale: [0, 8], 
                    opacity: [1, 0] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: j * 1 + (i * 0.05),
                    ease: "easeOut"
                  }}
                  className="w-10 h-10 rounded-full border border-registry-teal/20 absolute top-[-16px]"
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-24 space-y-12 relative z-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div 
              key={i}
              animate={{ 
                y: [0, 150], 
                opacity: [0, 0.6, 0.2, 0],
                scaleX: [1, 1.2]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                delay: i * 1,
                ease: "linear"
              }}
              className="w-80 h-1.5 bg-gradient-to-r from-transparent via-registry-teal to-transparent shadow-glow rounded-full"
            />
          ))}
        </div>

        <div className="absolute bottom-6 flex flex-col items-center space-y-2 opacity-40 group-hover/scope:opacity-100 transition-opacity">
          <div className="w-px h-12 bg-white/10" />
          <span className="text-[10px] font-black uppercase text-registry-teal tracking-[0.5em] italic">Resultant Wave Front</span>
        </div>
        
        <div className="absolute top-4 left-6 text-[10px] font-black uppercase text-slate-500 tracking-widest bg-stealth-950/80 px-4 py-1 rounded-full border border-white/5">
           Transducer Interface
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 relative z-10">
         <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 relative group/card">
            <h5 className="text-[11px] font-black uppercase text-white mb-3 flex items-center italic">
               <Info className="w-4 h-4 mr-2 text-registry-teal" /> 
               Spatial Summation
            </h5>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase italic">
              Infinite tiny wavelets undergo constructive interference to form the main beam, while destructive interference cancels side energy.
            </p>
         </div>
         <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 border-l-4 border-l-registry-teal relative group/card">
            <h5 className="text-[11px] font-black uppercase text-registry-teal mb-3 flex items-center italic">
               <Zap className="w-4 h-4 mr-2 text-registry-teal" /> 
               Wavelet Synthesis
            </h5>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase italic">
              Every point on a wavefront is a source of spherical wavelets. PZT geometry dictates the resulting hourglass shape.
            </p>
         </div>
      </div>

      <VisualInsight 
        title="Point Source Theory" 
        description="Christian Huygens stated that every point on a wavefront is itself the source of spherical wavelets. This explains the characteristic shape of ultrasound beams formed by transducers." 
        keyTerms={['huygens', 'wavelets', 'interference', 'wavefront', 'geometry']}
      />
    </motion.div>
  );
};

export const SonarPulse: React.FC<{ isDarkMode?: boolean }> = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <VisualHeader 
        title="Pulse Emission" 
        subtitle="Sonar Echo Analysis" 
        icon={Radar} 
        protocol="09-EMIT"
      />

      <div className="h-64 bg-stealth-950 rounded-[3rem] relative overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-inner group/scope">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <motion.div 
          animate={{ 
            scale: [1, 2, 3, 4], 
            opacity: [0.8, 0.4, 0.2, 0] 
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-24 h-24 border-2 border-registry-teal rounded-full shadow-glow"
        />
        <div className="w-6 h-6 bg-registry-teal rounded-full shadow-glow animate-pulse relative z-10" />
      </div>

      <VisualInsight 
        title="Pulse-Echo Principle" 
        description="Diagnostic ultrasound uses short pulses of sound. The system transmits a pulse and then listens for the weak echoes returning from tissue interfaces. Depth is calculated based on the round-trip travel time." 
        keyTerms={['pulse', 'echo', 'sonar', 'propagation', 'time-of-flight']}
      />
    </motion.div>
  );
};



