import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveWaveProps {
  isDarkMode: boolean;
  color?: string;
}

export const InteractiveWave: React.FC<InteractiveWaveProps> = ({ isDarkMode, color = '#00d2ff' }) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 2000);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-48 md:h-64 2xl:h-96 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden cursor-crosshair group border-2 transition-all ${
        isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-white border-slate-200 shadow-inner'
      }`}
    >
      {/* Background Grid */}
      <div className={`absolute inset-0 opacity-10 ${isDarkMode ? 'neural-grid' : 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]'}`} />
      
      {/* Mouse Follower Glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute w-64 h-64 pointer-events-none rounded-full blur-[80px]"
            style={{
              left: mousePos.x - 128,
              top: mousePos.y - 128,
              backgroundColor: color
            }}
          />
        )}
      </AnimatePresence>

      {/* Ripples */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 0.8, scale: 0, borderWidth: '4px' }}
            animate={{ opacity: 0, scale: 4, borderWidth: '1px' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute pointer-events-none rounded-full border"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '100px',
              height: '100px',
              marginLeft: '-50px',
              marginTop: '-50px',
              borderColor: color,
              boxShadow: `0 0 20px ${color}44`
            }}
          />
        ))}
      </AnimatePresence>

      {/* Central Interactive Core */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-2">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 rounded-full border-2 border-registry-teal/20 flex items-center justify-center relative"
          >
            <div className="w-16 h-16 rounded-full bg-registry-teal/5 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-registry-teal/10 animate-ping" style={{ animationDuration: '3s' }} />
          </motion.div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Acoustic Pulse Core</p>
          <p className="text-[11px] font-bold text-registry-teal/50 uppercase tracking-widest">Click to emit wave • Hover to focus</p>
        </div>
      </div>

      {/* Dynamic Wave Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <motion.path
          animate={{
            d: [
              "M 0 128 Q 100 80 200 128 T 400 128 T 600 128 T 800 128",
              "M 0 128 Q 100 176 200 128 T 400 128 T 600 128 T 800 128",
              "M 0 128 Q 100 80 200 128 T 400 128 T 600 128 T 800 128"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          fill="none"
          stroke={color}
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};
