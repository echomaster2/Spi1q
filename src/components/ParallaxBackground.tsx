import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const ParallaxBackground: React.FC<{ isDarkMode: boolean; bgImage?: string | null }> = ({ isDarkMode, bgImage }) => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {bgImage ? (
          <motion.div 
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: isDarkMode ? 0.25 : 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center filter brightness-75 contrast-125 saturate-150 grayscale-[0.2]"
            style={{ 
              backgroundImage: `url(${bgImage})`,
              y: scrollY * 0.05
            }}
          >
            {/* Tech Integration Overlays */}
            <div className="absolute inset-0 bg-registry-teal/10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,4px_100%] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-stealth-950/20 via-transparent to-stealth-950/40" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <motion.div 
        style={{ y: scrollY * 0.1 }}
        className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-[0.03] dark:opacity-[0.05]"
      >
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-registry-teal rounded-full blur-[120px]" />
        <div className="absolute top-[60%] left-[70%] w-96 h-96 bg-registry-rose rounded-full blur-[150px]" />
        <div className="absolute top-[30%] left-[40%] w-80 h-80 bg-registry-cobalt rounded-full blur-[130px]" />
      </motion.div>
      
      <motion.div 
        style={{ y: scrollY * -0.05 }}
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
      >
        <div className="absolute top-[20%] left-[80%] w-48 h-48 bg-registry-teal rounded-full blur-[100px]" />
        <div className="absolute top-[80%] left-[20%] w-72 h-72 bg-registry-amber rounded-full blur-[120px]" />
      </motion.div>
    </div>
  );
};
