import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Activity, Sparkles, Eye, EyeOff, Stethoscope, GraduationCap, User } from 'lucide-react';

export type CompanionSkin = 'default' | 'neon' | 'stealth' | 'golden' | 'sonographer' | 'student';

interface CompanionAvatarProps {
  state: 'idle' | 'thinking' | 'speaking' | 'error';
  skin?: CompanionSkin;
  level?: number;
  isDarkMode?: boolean;
}

const SKINS: Record<CompanionSkin, { aura: string, chassis: string, glow: string, icon: any }> = {
  default: {
    aura: 'bg-registry-teal/20',
    chassis: 'bg-stealth-950 border-registry-teal/50',
    glow: 'shadow-registry-teal/50',
    icon: Cpu
  },
  neon: {
    aura: 'bg-fuchsia-500/30',
    chassis: 'bg-slate-950 border-fuchsia-500',
    glow: 'shadow-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.5)]',
    icon: Sparkles
  },
  stealth: {
    aura: 'bg-slate-500/10',
    chassis: 'bg-black border-slate-800',
    glow: 'shadow-transparent',
    icon: Activity
  },
  golden: {
    aura: 'bg-amber-500/20',
    chassis: 'bg-slate-900 border-amber-500',
    glow: 'shadow-amber-500/40',
    icon: Zap
  },
  sonographer: {
    aura: 'bg-blue-500/20',
    chassis: 'bg-blue-950 border-blue-400',
    glow: 'shadow-blue-500/30',
    icon: Stethoscope
  },
  student: {
    aura: 'bg-emerald-500/20',
    chassis: 'bg-emerald-950 border-emerald-400',
    glow: 'shadow-emerald-500/30',
    icon: GraduationCap
  }
};

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({ state, skin = 'default', level = 1, isDarkMode }) => {
  const [blink, setBlink] = useState(false);
  const currentSkin = SKINS[skin] || SKINS.default;
  const Icon = currentSkin.icon;

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center group/avatar">
      {/* Holographic Projection Base */}
      <div className="absolute -bottom-1 w-12 h-2 bg-registry-teal/20 blur-md rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)]" />
      
      {/* Dynamic Aura Layer */}
      <motion.div 
        animate={{ 
          scale: state === 'thinking' ? [1, 1.25, 1] : [1, 1.1, 1],
          opacity: state === 'speaking' ? [0.1, 0.4, 0.1] : [0.1, 0.2, 0.1]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full blur-3xl ${currentSkin.aura}`} 
      />

      {/* Floating Holographic Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
           key={i}
           animate={{
             y: [0, -40, 0],
             opacity: [0, 0.8, 0],
             scale: [0.5, 1, 0.5],
             x: [0, (i % 2 === 0 ? 30 : -30), 0]
           }}
           transition={{
             repeat: Infinity,
             duration: 2 + i * 0.5,
             delay: i * 0.3,
             ease: "linear"
           }}
           className="absolute w-1 h-1 bg-registry-teal rounded-full blur-[1px] opacity-0"
           style={{
             bottom: '20%',
             left: `${20 + (i * 12)}%`
           }}
        />
      ))}

      {/* Sensor Layer (Top) */}
      <AnimatePresence>
        {state === 'thinking' && (
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -45, opacity: 1 }}
            exit={{ y: 0, opacity: 0 }}
            className="absolute top-0 flex flex-col items-center"
          >
            <div className="w-0.5 h-10 bg-gradient-to-t from-registry-teal to-transparent" />
            <motion.div 
              animate={{ 
                scale: [1, 1.4, 1],
                boxShadow: ["0 0 10px #00e5ff", "0 0 25px #00e5ff", "0 0 10px #00e5ff"]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2.5 h-2.5 bg-registry-teal rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Core Chassis with Holographic Displacement */}
      <motion.div 
        animate={
          state === 'speaking' 
            ? { y: [0, -2, 0], skewX: [0, 1, 0, -1, 0] } 
            : { y: [0, -4, 0] }
        }
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className={`relative w-24 h-24 rounded-3xl border-2 ${currentSkin.chassis} ${currentSkin.glow} flex flex-col items-center justify-center overflow-hidden z-10 backdrop-blur-sm`}
      >
        {/* Holographic Scan-lines/Jitter */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,229,255,0.05)_2px,rgba(0,229,255,0.05)_4px)] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-registry-teal/10 to-transparent h-[10%] w-full animate-[scan_2s_linear_infinite] pointer-events-none" />

        {/* Optical Units (Eyes) */}
        <div className="flex space-x-6">
          {[0, 1].map((i) => (
            <div key={i} className="relative">
              {blink ? (
                <div className="w-5 h-0.5 bg-registry-teal/80 rounded-full mt-2 blur-[0.5px]" />
              ) : (
                <motion.div 
                  animate={state === 'thinking' ? { 
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-5 h-5 bg-white rounded-full flex items-center justify-center relative overflow-hidden ring-4 ring-registry-teal/20"
                >
                   {/* Mechanical Lens Detail */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-registry-teal/20 to-white/40" />
                   <div className="w-2 h-2 bg-registry-teal rounded-full shadow-[0_0_8px_#00e5ff]" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Mouth/Voice Module */}
        <div className="mt-4 flex items-end space-x-0.5 h-3">
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               animate={state === 'speaking' ? {
                 height: [2, Math.random() * 8 + 4, 2]
               } : { height: 2 }}
               transition={{ repeat: Infinity, duration: 0.2, delay: i * 0.05 }}
               className="w-1 bg-registry-teal rounded-full"
             />
           ))}
        </div>

        {/* Mechanical Detailing */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-10 bg-inherit border-l-2 border-y-2 border-inherit rounded-l-lg opacity-50" />
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-10 bg-inherit border-r-2 border-y-2 border-inherit rounded-r-lg opacity-50" />
      </motion.div>

      {/* Floating Floating HUD Elements */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute inset-0 border border-registry-teal/10 rounded-full scale-125 pointer-events-none"
      >
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-registry-teal/40" />
      </motion.div>

      {/* Level Indicator Upgrade */}
      <div className={`absolute -bottom-2 right-2 ${isDarkMode ? 'bg-black/80 border-registry-teal text-white' : 'bg-white border-registry-teal text-registry-teal'} px-3 py-1 rounded-full z-20 border shadow-glow transition-all group-hover/avatar:scale-110`}>
        <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap leading-none flex items-center gap-1.5">
          <Zap className="w-2.5 h-2.5 fill-current" />
          LVL {level}
        </span>
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
};
