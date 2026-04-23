import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, ChevronUp, ChevronDown, Volume2, Music, Activity, Zap } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  isLoading: boolean;
  onToggle: () => void;
  onStop: () => void;
  analyser: AnalyserNode | null;
  title?: string;
  isDarkMode?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  isPlaying, 
  isLoading, 
  onToggle, 
  onStop, 
  analyser,
  title = "Registry Study Pulse",
  isDarkMode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying || !analyser || !canvasRef.current) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height;

        // Gradient color based on height
        const hue = (i / bufferLength) * 360;
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
        
        // Draw rounded bars
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, 4);
        } else {
          ctx.rect(x, height - barHeight, barWidth - 2, barHeight);
        }
        ctx.fill();

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, analyser, isExpanded]);

  if (!isPlaying && !isLoading) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className={`fixed z-[450] transition-all duration-500 ease-in-out ${
        isExpanded 
          ? isDarkMode ? 'inset-4 md:inset-10 lg:inset-auto lg:bottom-10 lg:right-10 lg:w-[480px] lg:h-[600px] bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] border border-registry-teal/30 shadow-2xl p-8' : 'inset-4 md:inset-10 lg:inset-auto lg:bottom-10 lg:right-10 lg:w-[480px] lg:h-[600px] bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-registry-teal/30 shadow-2xl p-8'
          : 'bottom-24 lg:bottom-10 left-4 right-4 lg:left-auto lg:right-10 lg:w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-4'
      }`}
    >
      <div className={`h-full flex flex-col ${isExpanded ? 'justify-between' : 'flex-row items-center space-x-4'}`}>
        
        {/* Header / Title Area */}
        <div className={`flex items-center justify-between ${isExpanded ? 'w-full' : 'flex-1 min-w-0'}`}>
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`shrink-0 flex items-center justify-center rounded-2xl bg-registry-teal text-white ${isExpanded ? 'w-12 h-12' : 'w-10 h-10'}`}>
              {isLoading ? <Zap className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h4 className={`font-black uppercase italic tracking-tighter truncate ${isExpanded ? 'text-xl text-white' : 'text-xs text-slate-900 dark:text-white'}`}>
                {title}
              </h4>
              {!isExpanded && (
                <p className="text-[8px] font-bold uppercase text-teal-600 dark:text-teal-400 tracking-widest">
                  {isLoading ? 'Synthesizing Audio...' : 'Active Study Pulse'}
                </p>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal ${isExpanded ? isDarkMode ? 'text-white' : 'text-slate-900' : 'text-slate-400'}`}
            aria-label={isExpanded ? "Collapse audio player" : "Expand audio player"}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {/* Visualizer Area (Expanded Only) */}
        {isExpanded && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 my-8">
            <div className={`relative w-full max-w-2xl aspect-video ${isDarkMode ? 'bg-slate-950/50 border-white/5' : 'bg-slate-100/50 border-slate-200'} rounded-[2rem] border overflow-hidden flex items-center justify-center`}>
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={400} 
                className="w-full h-full"
              />
              {!isPlaying && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-12 h-12 text-slate-800 animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-teal-400 font-black uppercase tracking-[0.3em] text-[10px]">Neural Audio Engine</p>
              <h3 className={`${isDarkMode ? 'text-white' : 'text-slate-900'} text-3xl font-black italic uppercase tracking-tighter`}>Frequency Spectrum</h3>
            </div>
          </div>
        )}

        {/* Controls Area */}
        <div className={`flex items-center ${isExpanded ? 'justify-center space-x-8 w-full pb-4' : 'space-x-2'}`}>
          <button 
            onClick={onToggle}
            disabled={isLoading}
            className={`flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal ${
              isExpanded 
                ? 'w-20 h-20 bg-registry-teal hover:bg-registry-teal/80 text-white shadow-xl shadow-registry-teal/20' 
                : 'w-10 h-10 bg-registry-teal/10 text-registry-teal hover:bg-registry-teal/20'
            }`}
            aria-label={isPlaying ? "Pause study pulse" : "Play study pulse"}
          >
            {isPlaying ? (
              <Pause className={isExpanded ? 'w-8 h-8' : 'w-5 h-5'} fill="currentColor" />
            ) : (
              <Play className={isExpanded ? 'w-8 h-8 ml-1' : 'w-5 h-5 ml-0.5'} fill="currentColor" />
            )}
          </button>
          
          <button 
            onClick={onStop}
            className={`flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-rose ${
              isExpanded 
                ? 'w-16 h-16 bg-registry-rose/20 text-registry-rose hover:bg-registry-rose/30' 
                : 'w-10 h-10 bg-registry-rose/10 text-registry-rose hover:bg-registry-rose/20'
            }`}
            aria-label="Stop study pulse"
          >
            <Square className={isExpanded ? 'w-6 h-6' : 'w-4 h-4'} fill="currentColor" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};
