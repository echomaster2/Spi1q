import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle, Zap, Star, Sparkles, Brain } from 'lucide-react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

interface VictoryOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  xpGained?: number;
}

export const VictoryOverlay: React.FC<VictoryOverlayProps> = ({ isVisible, onClose, title, xpGained = 250 }) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center pointer-events-none">
          {showConfetti && (
            <Confetti
              width={width}
              height={height}
              numberOfPieces={150}
              recycle={false}
              colors={['#0afff2', '#f43f5e', '#ffffff', '#fbbf24']}
            />
          )}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -50 }}
            className="premium-glass p-12 rounded-[5rem] border-4 border-registry-teal/40 shadow-[0_0_100px_rgba(10,255,242,0.3)] flex flex-col items-center text-center max-w-2xl relative overflow-hidden backdrop-blur-3xl bg-stealth-950/80 pointer-events-auto"
          >
            {/* Background Rings */}
            <div className="absolute inset-0 z-0 opacity-10">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full animate-spin-slow" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white dashed rounded-full animate-reverse-spin" />
            </div>

            <motion.div 
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
              className="w-32 h-32 bg-registry-teal rounded-[3rem] shadow-glow flex items-center justify-center mb-8 relative z-10"
            >
              <Trophy className="w-16 h-16 text-stealth-950" />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white rounded-[3rem] scale-125"
              />
            </motion.div>

            <div className="space-y-4 relative z-10">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-registry-teal text-xs font-black uppercase tracking-[0.8em] italic"
              >
                Neural Synchronization Complete
              </motion.p>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white drop-shadow-glow"
              >
                Mastri Achieved
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-slate-400 text-lg font-bold uppercase tracking-widest"
              >
                {title}
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="mt-12 flex items-center space-x-6"
            >
              <div className="flex flex-col items-center">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-2">
                    <Zap className="w-6 h-6 text-registry-teal" />
                 </div>
                 <span className="text-[10px] font-black text-white uppercase">+{xpGained} XP</span>
              </div>
              <div className="flex flex-col items-center">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-2">
                    <Brain className="w-6 h-6 text-registry-amber" />
                 </div>
                 <span className="text-[10px] font-black text-white uppercase">+2 Neural Link</span>
              </div>
              <div className="flex flex-col items-center">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-2">
                    <Star className="w-6 h-6 text-registry-rose" />
                 </div>
                 <span className="text-[10px] font-black text-white uppercase">Rank Up</span>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="mt-12 px-12 py-4 bg-white text-stealth-950 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl relative z-10"
            >
              Return to Grid
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
