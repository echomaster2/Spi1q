import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';

// --- MAGNIFICATION WRAPPER ---
export const Magnify: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    <motion.div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
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
            <div className="absolute top-4 right-4 bg-registry-teal text-stealth-950 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center space-x-1 shadow-lg">
              <Search className="w-3 h-3" />
              <span>Enhanced View</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
