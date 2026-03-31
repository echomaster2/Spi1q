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
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Aura Layer */}
      <motion.div 
        animate={{ 
          scale: state === 'thinking' ? [1, 1.2, 1] : [1, 1.05, 1],
          opacity: state === 'speaking' ? [0.2, 0.4, 0.2] : 0.2
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`absolute inset-0 rounded-full blur-3xl ${currentSkin.aura}`} 
      />

      {/* Sensor Layer (Top) */}
      <AnimatePresence>
        {state === 'thinking' && (
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -40, opacity: 1 }}
            exit={{ y: 0, opacity: 0 }}
            className="absolute top-0 flex flex-col items-center"
          >
            <div className="w-1 h-8 bg-gradient-to-t from-registry-teal to-transparent" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-3 h-3 bg-registry-teal rounded-full shadow-[0_0_10px_#00e5ff]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Core Chassis */}
      <motion.div 
        animate={state === 'speaking' ? { y: [0, -4, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
        className={`relative w-24 h-24 rounded-2xl border-2 ${currentSkin.chassis} ${currentSkin.glow} flex flex-col items-center justify-center overflow-hidden z-10`}
      >
        {/* Scan-line animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full animate-[scan_3s_linear_infinite] pointer-events-none" />

        {/* Optical Units (Eyes) */}
        <div className="flex space-x-4">
          {[0, 1].map((i) => (
            <div key={i} className="relative">
              {blink ? (
                <div className="w-4 h-1 bg-registry-teal/50 rounded-full mt-2" />
              ) : (
                <motion.div 
                  animate={state === 'thinking' ? { scale: [1, 1.3, 1], backgroundColor: ['#00e5ff', '#a5f3fc', '#00e5ff'] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-4 h-4 bg-registry-teal rounded-full flex items-center justify-center shadow-[0_0_8px_#00e5ff]"
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Side Modules (Ears/Antennae) */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-inherit border-l-2 border-y-2 border-inherit rounded-l-lg" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-inherit border-r-2 border-y-2 border-inherit rounded-r-lg" />
      </motion.div>

      {/* Floating Level Indicator */}
      <div className={`absolute -bottom-2 right-2 ${isDarkMode ? 'bg-slate-900 border-registry-teal/50' : 'bg-white border-registry-teal/30 shadow-sm'} px-2 py-0.5 rounded-full z-20`}>
        <span className="text-[8px] font-black text-registry-teal uppercase tracking-widest">LVL {level}</span>
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );
};
