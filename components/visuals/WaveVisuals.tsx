import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Ruler, Repeat, Activity, Info, Loader2, Volume2, Search, Zap, Book, Sparkles, AlertCircle, Database, Monitor } from 'lucide-react';
import { generateSpeech } from '../../src/services/aiService';
import { decodeBase64, pcmToWav } from '../../src/lib/audioUtils';
import { CompanionAvatar } from '../CompanionAvatar';
import { GrainOverlay, ScanlineOverlay } from './UtilityVisuals';
import { VisualInsight, VideoTutorialLink } from './BaseVisuals';

// --- WAVE MECHANICS VISUALS ---


export const MasterOscilloscope: React.FC = () => {
  const [frequency, setFrequency] = useState(2.5); // MHz
  const [amplitude, setAmplitude] = useState(50); // Peak Pressure / Amplitude
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.1), 30);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    if (!isPlaying) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      oscillator.current = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.current.type = 'sine';
      // Represent frequency: human hearing range is 20-20k Hz. Ultrasound is 2M-15M Hz.
      // We'll scale 1-15 MHz to 200-2000 Hz for audibility.
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
      className="bg-stealth-900 p-6 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group w-full"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/30 shadow-glow">
            <Monitor className="w-6 h-6 text-registry-teal" />
          </div>
          <div>
            <h4 className="text-2xl font-black uppercase italic text-white leading-none">Master Oscilloscope</h4>
            <p className="text-[10px] font-black text-registry-teal uppercase tracking-[0.3em] mt-2 flex items-center">
               <Activity className="w-3 h-3 mr-2 animate-pulse" /> Acoustic Waveform Lab v4.0
            </p>
          </div>
        </div>
        <button 
          onClick={toggleSound}
          className={`p-4 rounded-2xl border transition-all flex items-center space-x-3 ${isPlaying ? 'bg-registry-rose text-white border-registry-rose/50 shadow-glow-rose' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
        >
          {isPlaying ? <Volume2 className="w-5 h-5 animate-bounce" /> : <Volume2 className="w-5 h-5" />}
          <span className="text-[10px] font-black uppercase tracking-widest">{isPlaying ? 'Mute' : 'Listen'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 md:h-80 bg-black rounded-[2rem] border-2 border-slate-800 overflow-hidden relative group">
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-8 opacity-20 pointer-events-none">
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-registry-teal/20" />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                <motion.path 
                  d={`M 0 150 ${Array.from({ length: 801 }).map((_, x) => {
                    // Wavelength is inversely proportional to frequency
                    const wavelengthCoeff = 1 / frequency;
                    const y = 150 + Math.sin((x + time * 50) * 0.05 * frequency) * amplitude;
                    return `L ${x} ${y}`;
                  }).join(' ')}`} 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="3" 
                  className="drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                />
                
                {/* Measuring Overlays */}
                <line x1="0" y1="150" x2="800" y2="150" stroke="white" strokeWidth="1" strokeDasharray="5 5" opacity="0.2" />
                <line x1="400" y1="0" x2="400" y2="300" stroke="white" strokeWidth="1" strokeDasharray="5 5" opacity="0.2" />
              </svg>
            </div>
            
            <div className="absolute top-4 left-6 flex space-x-6">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Voltage / P</span>
                <span className="text-lg font-black text-white italic tracking-tighter tabular-nums">{amplitude}mV</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Time / Div</span>
                <span className="text-lg font-black text-white italic tracking-tighter tabular-nums">0.5μs</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-6 flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-registry-teal animate-pulse shadow-glow" />
              <span className="text-[8px] font-black text-registry-teal uppercase tracking-widest">Acoustic Signal Locked</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <div className="premium-glass p-6 rounded-3xl border tech-border space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Freq Mod (MHz)</label>
                <div className="px-2 py-1 bg-registry-teal/10 rounded-md">
                   <span className="text-xs font-black text-registry-teal italic tabular-nums">{frequency.toFixed(1)}</span>
                </div>
              </div>
              <input 
                type="range" min="1.0" max="15.0" step="0.5" 
                value={frequency} 
                onChange={(e) => setFrequency(Number(e.target.value))} 
                className="w-full accent-registry-teal h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
              />
              <p className="text-[8px] font-bold text-slate-500 uppercase flex items-center">
                <Ruler className="w-3 h-3 mr-2" /> Wavelength: {(1.54 / frequency).toFixed(3)} mm
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Gain / Amp (dB)</label>
                <div className="px-2 py-1 bg-registry-rose/10 rounded-md">
                   <span className="text-xs font-black text-registry-rose italic tabular-nums">{amplitude}</span>
                </div>
              </div>
              <input 
                type="range" min="5" max="120" 
                value={amplitude} 
                onChange={(e) => setAmplitude(Number(e.target.value))} 
                className="w-full accent-registry-rose h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
              />
              <p className="text-[8px] font-bold text-slate-500 uppercase flex items-center">
                <Zap className="w-3 h-3 mr-2" /> Energy Density: {((amplitude * amplitude) / 100).toFixed(1)} W/cm²
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-3">
            <h5 className="text-xs font-black uppercase text-registry-amber italic flex items-center">
              <Info className="w-4 h-4 mr-2" /> Clinical Pearl
            </h5>
            <p className="text-[10px] font-medium leading-relaxed text-slate-400">
               Frequency is your **primary trade-off**. Use high frequencies (7-15MHz) for superficial structures like thyroid/breast to get crystal clear resolution. Drop to low frequencies (2-5MHz) for deep abdominal scans where penetration is essential.
            </p>
          </div>
        </div>
      </div>

      <VisualInsight 
        title="Oscilloscope Analysis" 
        description="The oscilloscope visualizes the 'sound pressure level' over time. As you increase frequency, the wavelength shortens (more cycles per second), which directly improves axial resolution but increases attenuation." 
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
      <VideoTutorialLink videoId="xtdfCGz6e1Y" title="Ultrasound Physics Basics" />
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
                  backgroundColor: wave > 0 ? '#22d3ee' : '#f43f5e', 
                  opacity: 0.2 + (Math.abs(wave) * 0.8),
                  boxShadow: wave > 0.8 ? '0 0 10px #22d3ee' : 'none'
                }} 
              />
            );
          })}
        </div>

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
                stroke="#22d3ee"
                strokeWidth="2"
                opacity="0.6"
              />
              <text x="10" y="15" fill="#22d3ee" className="text-[7px] font-black uppercase" opacity="0.4">Compression (+)</text>
              <text x="10" y="95" fill="#f43f5e" className="text-[7px] font-black uppercase" opacity="0.4">Rarefaction (-)</text>
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
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <motion.path 
            d={`M 0 60 ${Array.from({ length: 401 }).map((_, x) => {
              const y = 60 + Math.sin((x + time * 20) * 0.05 * freq) * amp;
              return `L ${x} ${y}`;
            }).join(' ')}`} 
            fill="none" 
            stroke="#22d3ee" 
            strokeWidth="3" 
            className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
          />
          
          <line x1="200" y1={60 - amp} x2="200" y2={60 + amp} stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 2" />
          <text x="210" y={60} fill="#f43f5e" className="text-[7px] font-black uppercase">Amplitude</text>
          
          <line x1={100} y1="100" x2={100 + (200 / freq)} y2="100" stroke="#22d3ee" strokeWidth="1" />
          <text x={100 + (100 / freq)} y="110" textAnchor="middle" fill="#22d3ee" className="text-[7px] font-black uppercase">Wavelength</text>
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

export const ReflectionLab: React.FC = () => {
  const [angle, setAngle] = useState(30);
  const rad = (angle * Math.PI) / 180;

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
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest mt-1">Law of Reflection</p>
          </div>
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl overflow-hidden relative flex items-center justify-center border border-slate-800 shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          <line x1="50" y1="150" x2="350" y2="150" stroke="white" strokeWidth="3" opacity="0.4" />
          <line x1="200" y1="50" x2="200" y2="150" stroke="white" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
          <motion.line 
            x1={200 - Math.sin(rad) * 120} y1={150 - Math.cos(rad) * 120}
            x2="200" y2="150"
            stroke="#22d3ee"
            strokeWidth="4"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            strokeDasharray="10 5"
          />
          <motion.line 
            x1="200" y1="150"
            x2={200 + Math.sin(rad) * 120} y2={150 - Math.cos(rad) * 120}
            stroke="#22d3ee"
            strokeWidth="4"
            animate={{ strokeDashoffset: [0, 20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            strokeDasharray="10 5"
            opacity="0.6"
          />
          <text x={200 - 30} y={130} fill="#22d3ee" className="text-[8px] font-black">{angle}°</text>
          <text x={200 + 20} y={130} fill="#22d3ee" className="text-[8px] font-black opacity-60">{angle}°</text>
        </svg>
      </div>

      <div className="space-y-4 relative z-10">
        <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Angle of Incidence: {angle}°</label>
        <input 
          type="range" min="0" max="75" 
          value={angle} 
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
        />
      </div>

      <VisualInsight 
        title="Specular Reflection" 
        description="The Law of Reflection states that the angle of incidence equals the angle of reflection. In ultrasound, this is most efficient when the beam is perpendicular (90°) to the interface." 
      />
    </motion.div>
  );
};

export const RefractionLab: React.FC = () => {
  const [angle, setAngle] = useState(30);
  const [speed1, setSpeed1] = useState(1540);
  const [speed2, setSpeed2] = useState(1600);

  const rad1 = (angle * Math.PI) / 180;
  const sinTheta2 = (speed2 / speed1) * Math.sin(rad1);
  const angle2 = sinTheta2 > 1 ? 90 : (Math.asin(sinTheta2) * 180) / Math.PI;
  const rad2 = (angle2 * Math.PI) / 180;

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
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Refraction Lab</h4>
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest mt-1">Snell's Law Simulator</p>
          </div>
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl overflow-hidden relative flex items-center justify-center border border-slate-800 shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeWidth="2" opacity="0.2" strokeDasharray="4 4" />
          <line x1="200" y1="0" x2="200" y2="200" stroke="white" strokeWidth="1" opacity="0.1" strokeDasharray="2 2" />
          <motion.line 
            x1={200 - Math.sin(rad1) * 100} y1={100 - Math.cos(rad1) * 100}
            x2="200" y2="100"
            stroke="#22d3ee"
            strokeWidth="4"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            strokeDasharray="10 5"
          />
          <motion.line 
            x1="200" y1="100"
            x2={200 + Math.sin(rad2) * 100} y2={100 + Math.cos(rad2) * 100}
            stroke="#f43f5e"
            strokeWidth="4"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            strokeDasharray="10 5"
            opacity={sinTheta2 > 1 ? 0.2 : 1}
          />
          <text x="50" y="50" fill="#22d3ee" className="text-[8px] font-black uppercase opacity-60">v1: {speed1} m/s</text>
          <text x="50" y="150" fill="#f43f5e" className="text-[8px] font-black uppercase opacity-60">v2: {speed2} m/s</text>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <div className="space-y-2">
          <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Incidence Angle: {angle}°</label>
          <input 
            type="range" min="0" max="80" 
            value={angle} 
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Speed 1 (m/s): {speed1}</label>
          <input 
            type="range" min="1400" max="1700" step="10"
            value={speed1} 
            onChange={(e) => setSpeed1(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-teal"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Speed 2 (m/s): {speed2}</label>
          <input 
            type="range" min="1400" max="1700" step="10"
            value={speed2} 
            onChange={(e) => setSpeed2(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-registry-rose"
          />
        </div>
      </div>

      <VisualInsight 
        title="Refraction Principles" 
        description={`When sound crosses an interface at an oblique angle with different propagation speeds, it bends. If v2 > v1, the beam bends AWAY from the normal. If v2 < v1, it bends TOWARD the normal.`} 
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
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 relative overflow-hidden group"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Activity className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-none">Scattering Lab</h4>
            <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mt-1">Particle Interaction</p>
          </div>
        </div>
      </div>

      <div className="h-48 bg-slate-950 rounded-3xl overflow-hidden relative flex items-center justify-center border border-slate-800 shadow-inner">
        <div className="absolute inset-0 scanline opacity-10" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 200">
          <motion.line 
            x1="0" y1="100" x2="180" y2="100"
            stroke="#22d3ee"
            strokeWidth="4"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            strokeDasharray="10 5"
          />
          <circle cx="200" cy="100" r={particleSize * 40} fill="#FACC15" className="drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
          {particleSize < 0.3 ? (
            Array.from({ length: 12 }).map((_, i) => {
              const ang = (i / 12) * Math.PI * 2;
              return (
                <motion.line 
                  key={i}
                  x1="200" y1="100" 
                  x2={200 + Math.cos(ang) * 60} 
                  y2={100 + Math.sin(ang) * 60}
                  stroke="#FACC15"
                  strokeWidth="1"
                  animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                />
              );
            })
          ) : (
            Array.from({ length: 5 }).map((_, i) => {
              const ang = (i - 2) * 0.2;
              return (
                <motion.line 
                  key={i}
                  x1="200" y1="100" 
                  x2={200 - Math.cos(ang) * 80} 
                  y2={100 + Math.sin(ang) * 80}
                  stroke="#22d3ee"
                  strokeWidth="2"
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                />
              );
            })
          )}
        </svg>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center">
          <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Reflector Size: {particleSize < 0.3 ? "Small (Rayleigh)" : "Large (Specular)"}</label>
        </div>
        <input 
          type="range" min="0.05" max="1" step="0.05"
          value={particleSize} 
          onChange={(e) => setParticleSize(Number(e.target.value))}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      <VisualInsight 
        title="Scattering Dynamics" 
        description={particleSize < 0.3 ? "Rayleigh scattering occurs when the reflector is much smaller than the wavelength (like red blood cells). Sound is redirected equally in all directions." : "When the reflector is large and smooth, specular reflection dominates. If the surface is rough, diffuse reflection (backscatter) occurs."} 
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
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          
          <rect x="0" y="100" width="400" height="100" fill="url(#mediumGrad)" />
          <line x1="0" y1="100" x2="400" y2="100" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
          <text x="10" y="90" fill="#22d3ee" className="text-[8px] font-black uppercase opacity-40 tracking-widest">Medium 1</text>
          <text x="10" y="115" fill="#22d3ee" className="text-[8px] font-black uppercase opacity-40 tracking-widest">Medium 2</text>

          <motion.line 
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            x1={200 - Math.sin(rad)*100} y1={100 - Math.cos(rad)*100} 
            x2={200} y2={100} 
            stroke="#22d3ee" 
            strokeWidth="4" 
            strokeDasharray="10 5"
          />

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
              stroke="#f43f5e" 
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
          description={mode === 'reflection' ? "Specular reflection occurs at large, smooth interfaces." : mode === 'refraction' ? "Refraction is the bending of the beam as it crosses an interface with different propagation speeds." : "Scattering occurs when sound hits small or rough reflectors."} 
        />
      </div>
    </div>
  );
};

export const IntensityProfileVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4"
    >
      <div className="flex items-center space-x-3 mb-2">
        <Activity className="w-5 h-5 text-registry-rose" />
        <h4 className="text-lg font-black uppercase italic text-white">Intensity Distribution</h4>
      </div>
      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-800">
        <svg className="w-full h-full" viewBox="0 0 400 150">
          <motion.path 
            d="M 50 130 Q 200 20 350 130" 
            fill="url(#intensityGrad)" 
            stroke="#f43f5e" 
            strokeWidth="3"
          />
          <defs>
            <linearGradient id="intensityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text x="200" y="30" textAnchor="middle" fill="#f43f5e" className="text-[10px] font-black uppercase tracking-widest">Spatial Peak (SP)</text>
          <text x="50" y="145" fill="#f43f5e" className="text-[8px] font-black uppercase tracking-widest opacity-60">Spatial Average (SA)</text>
        </svg>
      </div>
      <VisualInsight 
        title="SP vs SA Intensity" 
        description="Intensity varies in space (Spatial) and time (Temporal). Spatial Peak (SP) is the highest intensity in the beam cross-section, while Spatial Average (SA) is the average over the entire beam width." 
      />
    </motion.div>
  );
};

export const SpecularScatteringVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6"
    >
      <div className="flex items-center space-x-3">
        <Search className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Backscatter Dynamics</h4>
      </div>
      <div className="h-40 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800">
        <svg className="w-full h-full" viewBox="0 0 400 150">
          <line x1="200" y1="10" x2="200" y2="140" stroke="white" strokeWidth="4" strokeDasharray="2 4" opacity="0.2" />
          <motion.path 
            d="M 50 75 L 180 75" 
            stroke="#22d3ee" 
            strokeWidth="4" 
            strokeDasharray="10 5"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {Array.from({length: 8}).map((_, i) => (
            <motion.line 
              key={i}
              x1="200" y1="75"
              x2={200 - Math.cos(i * 0.4 - 1)*60}
              y2={75 + Math.sin(i * 0.4 - 1)*60}
              stroke="#FACC15"
              strokeWidth="1"
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          <circle cx="200" cy="75" r="4" fill="#FACC15" />
          <text x="210" y="70" fill="#FACC15" className="text-[8px] font-black uppercase">Diffuse Reflection (Scattering)</text>
        </svg>
      </div>
      <VisualInsight 
        title="Specular vs Diffuse" 
        description="Specular reflection is mirror-like (smooth surface), whereas diffuse reflection (backscatter) occurs when sound strikes a rough surface, sending energy back toward the transducer in many directions." 
      />
    </motion.div>
  );
};


export const SpeedOfSoundTable: React.FC = () => {
  const materials = [
    { name: 'Air', speed: 330, color: 'text-slate-400' },
    { name: 'Fat', speed: 1450, color: 'text-amber-400' },
    { name: 'Soft Tissue', speed: 1540, color: 'text-registry-teal' },
    { name: 'Muscle', speed: 1580, color: 'text-emerald-400' },
    { name: 'Bone', speed: 3500, color: 'text-slate-200' }
  ];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4"
    >
      <div className="flex items-center space-x-3 mb-2">
        <Database className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Propagation Speeds</h4>
      </div>
      <div className="space-y-2">
        {materials.map((m, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
            <span className={`text-[10px] font-black uppercase tracking-widest ${m.color}`}>{m.name}</span>
            <div className="flex items-center space-x-4 flex-1 mx-8">
              <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: `${(m.speed / 3500) * 100}%` }}
                   className="h-full bg-registry-teal"
                />
              </div>
            </div>
            <span className="text-[10px] font-black text-white">{m.speed} m/s</span>
          </div>
        ))}
      </div>
      <VisualInsight 
        title="Propagation Speed" 
        description="Propagation speed is determined solely by the medium's density and stiffness (stiffness having the greatest effect). Average soft tissue speed is 1,540 m/s." 
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
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6"
    >
      <div className="flex items-center space-x-3">
        <Zap className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Acoustic Impedance</h4>
      </div>
      <div className="flex justify-around items-center h-32 bg-slate-950 rounded-3xl relative overflow-hidden border border-slate-800">
        <div className="text-center">
          <div className="text-2xl font-black text-registry-teal">{impedance}</div>
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Rayls (Z)</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[8px] font-black text-slate-500 uppercase">Density</label>
          <input type="range" min="0.5" max="2" step="0.1" value={density} onChange={e => setDensity(Number(e.target.value))} className="w-full h-1 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="space-y-2">
          <label className="text-[8px] font-black text-slate-500 uppercase">Speed</label>
          <input type="range" min="1400" max="1700" value={stiffness} onChange={e => setStiffness(Number(e.target.value))} className="w-full h-1 accent-registry-teal bg-slate-800 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
      <VisualInsight 
        title="Impedance (Z)" 
        description="Impedance (Z = Density × Speed) determines how much sound is reflected at an interface. A large difference in impedance between two media results in a strong reflection." 
      />
    </motion.div>
  );
};

export const HuygensPrincipleVisual: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-stealth-900 p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6"
    >
      <div className="flex items-center space-x-3">
        <Sparkles className="w-5 h-5 text-registry-teal" />
        <h4 className="text-lg font-black uppercase italic text-white">Huygens' Principle</h4>
      </div>
      <div className="h-48 bg-slate-950 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-800">
        <div className="absolute top-4 flex space-x-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-registry-teal" />
              <motion.div 
                animate={{ scale: [0, 4], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="w-8 h-8 rounded-full border border-registry-teal absolute"
              />
            </div>
          ))}
        </div>
        <motion.div 
          animate={{ y: [0, 40], opacity: [0, 0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-48 h-1 bg-registry-teal mt-20"
        />
        <text className="text-[8px] font-black uppercase text-registry-teal mt-4 break-words px-8 text-center opacity-60">Resultant Wave Front</text>
      </div>
      <VisualInsight 
        title="Huygens' Principle" 
        description="Explains why single PZT crystals produce hourglass-shaped beams. Each point on the transducer surface acts as a 'wavelet' source, and their interference creates the main ultrasound beam." 
      />
    </motion.div>
  );
};

export const SonarPulse: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = true }) => {
  return (
    <div className={`${isDarkMode ? 'bg-stealth-900 border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-premium'} p-6 md:p-8 rounded-[2.5rem] border space-y-4`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-registry-teal/10 border-registry-teal/20' : 'bg-registry-teal/5 border-registry-teal/10'}`}>
          <Zap className="w-5 h-5 text-registry-teal" />
        </div>
        <h4 className={`text-lg font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-none`}>Pulse Propagation</h4>
      </div>
      <div className={`h-40 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} rounded-3xl relative overflow-hidden flex items-center justify-center border shadow-inner`}>
        <motion.div 
          animate={{ 
            scale: [1, 2, 3, 4], 
            opacity: [0.8, 0.4, 0.2, 0] 
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-12 h-12 border-2 border-registry-teal rounded-full"
        />
        <div className="w-4 h-4 bg-registry-teal rounded-full shadow-[0_0_15px_#22d3ee]" />
      </div>
      <VisualInsight 
        title="Pulse-Echo Principle" 
        description="Ultrasound works by sending short pulses of sound and listening for the echoes. The time it takes for the echo to return determines the depth of the reflector." 
      />
    </div>
  );
};



