import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Cpu, ShieldCheck, Zap, Radio } from 'lucide-react';

const RandomHex: React.FC = () => {
  const [hex, setHex] = useState('0x0000');
  useEffect(() => {
    const interval = setInterval(() => {
      setHex('0x' + Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0'));
    }, 50);
    return () => clearInterval(interval);
  }, []);
  return <span>{hex}</span>;
};

export const CinematicIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 2000),
      setTimeout(() => setPhase(2), 4000),
      setTimeout(() => setPhase(3), 6000),
      setTimeout(() => setPhase(4), 8000),
      setTimeout(() => onCompleteRef.current(), 9500)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-stealth-950 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
      
      {/* Target Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-registry-teal/40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-registry-teal/40" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-4 bg-registry-teal/40" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-4 bg-registry-teal/40" />
      </div>

      {/* System Metadata */}
      <div className="absolute top-12 left-12 flex flex-col space-y-2 pointer-events-none hidden md:flex">
        <span className="micro-label opacity-100 italic">Core Phase: 0{phase}</span>
        <span className="micro-label opacity-100">Status: {phase === 3 ? 'SYSTEM READY' : 'CALIBRATING'}</span>
        <div className="flex space-x-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`w-3 h-1 ${i <= phase ? 'bg-registry-teal shadow-glow' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
      
      <div className="absolute top-12 right-12 text-right pointer-events-none hidden md:flex flex-col">
        <span className="micro-label opacity-100">Coordinate Meta</span>
        <span className="micro-label opacity-80 text-[7px]">Lat: 34.0522° N // Lon: 118.2437° W</span>
      </div>

      <div className="absolute top-0 left-0 w-full h-[2px] bg-registry-teal/50 animate-scan pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,210,255,0.05),transparent_60%)] pointer-events-none" />

      {/* Data Stream Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none flex flex-wrap gap-4 p-8 text-[8px] font-mono text-registry-teal/50 leading-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <RandomHex key={i} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div 
            key="phase0" 
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} 
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center relative z-10"
          >
            <Cpu className="w-20 h-20 text-registry-teal mb-8 animate-pulse" />
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.5em] text-registry-teal text-center">Neural Link</h1>
            <p className="text-xs md:text-sm font-mono text-registry-teal/80 mt-6 tracking-[0.3em] animate-pulse">INITIALIZING BOOT SEQUENCE...</p>
            <div className="w-64 h-1 bg-stealth-900 mt-8 rounded-full overflow-hidden">
              <motion.div className="h-full bg-registry-teal" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "linear" }} />
            </div>
          </motion.div>
        )}
        {phase === 1 && (
          <motion.div 
            key="phase1" 
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} 
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center relative z-10"
          >
            <Radio className="w-20 h-20 text-registry-rose mb-8 animate-pulse" />
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.5em] text-registry-rose text-center">Transducer Array</h1>
            <p className="text-xs md:text-sm font-mono text-registry-rose/80 mt-6 tracking-[0.3em] animate-pulse">CALIBRATING PIEZOELECTRIC ELEMENTS...</p>
            <div className="w-64 h-1 bg-stealth-900 mt-8 rounded-full overflow-hidden">
              <motion.div className="h-full bg-registry-rose" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "linear" }} />
            </div>
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div 
            key="phase2" 
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} 
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center relative z-10"
          >
            <ShieldCheck className="w-20 h-20 text-registry-amber mb-8 animate-pulse" />
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.5em] text-registry-amber text-center">Registry Protocols</h1>
            <p className="text-xs md:text-sm font-mono text-registry-amber/80 mt-6 tracking-[0.3em] animate-pulse">LOADING HIGH-YIELD CLINICAL DATA...</p>
            <div className="w-64 h-1 bg-stealth-900 mt-8 rounded-full overflow-hidden">
              <motion.div className="h-full bg-registry-amber" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "linear" }} />
            </div>
          </motion.div>
        )}
        {phase === 3 && (
          <motion.div 
            key="phase3" 
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} 
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center relative z-10"
          >
            <div className="relative mb-12">
               <div className="w-24 h-24 bg-registry-teal rounded-full animate-ping absolute inset-0 opacity-50" />
               <div className="w-24 h-24 bg-registry-teal rounded-full relative shadow-[0_0_60px_rgba(0,240,255,0.8)] flex items-center justify-center">
                 <Zap className="w-12 h-12 text-stealth-950" />
               </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-[0.5em] text-white shadow-glow text-center">System Online</h1>
            <p className="text-sm font-mono text-registry-teal mt-6 tracking-[0.4em]">WELCOME TO THE NEURAL NETWORK</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, color: '#fff' }}
        whileTap={{ scale: 0.9 }}
        onClick={onComplete}
        className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 transition-colors z-20 px-6 py-3 border border-transparent hover:border-white/20 rounded-full"
      >
        [ Skip Sequence ]
      </motion.button>
    </motion.div>
  );
};
