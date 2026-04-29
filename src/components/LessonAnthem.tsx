import React from 'react';
import { motion } from 'motion/react';
import { Music, Pause, Play } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

export const LessonAnthem: React.FC<{ stationName: string }> = ({ stationName }) => {
  const { stations, changeStation, currentStation, isPlaying, togglePlay } = useRadio();
  
  const station = stations.find(s => s.name === stationName);
  const isActive = currentStation?.name === stationName;

  if (!station) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-white dark:bg-stealth-900 border tech-border rounded-[2rem] flex items-center justify-between group hover:border-registry-teal/40 transition-all shadow-premium-light dark:shadow-premium backdrop-blur-md"
    >
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className={`p-4 rounded-xl transition-all duration-500 ${isActive && isPlaying ? 'bg-registry-teal text-stealth-950 shadow-glow scale-110' : 'bg-registry-teal/10 text-registry-teal'}`}>
            <Music className={`w-6 h-6 ${isActive && isPlaying ? 'animate-pulse' : ''}`} />
          </div>
          {isActive && isPlaying && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-registry-rose rounded-full border-2 border-white dark:border-stealth-900 shadow-glow" 
            />
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="micro-label !opacity-60 italic tracking-[0.2em]">Neural Frequency</span>
            <div className={`w-1 h-1 rounded-full ${isActive && isPlaying ? 'bg-registry-teal animate-pulse' : 'bg-slate-300 dark:bg-white/10'}`} />
          </div>
          <p className="text-xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase leading-none">{stationName}</p>
        </div>
      </div>
      <button 
        onClick={() => {
          if (isActive) {
            togglePlay();
          } else {
            changeStation(station);
          }
        }}
        className={`p-4 rounded-xl transition-all duration-500 shadow-lg active:scale-90 border ${isActive && isPlaying ? 'bg-registry-rose border-registry-rose text-white shadow-glow' : 'bg-white dark:bg-stealth-800 border-slate-100 dark:border-white/5 text-registry-teal hover:border-registry-teal/40'}`}
      >
        {isActive && isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
      </button>
    </motion.div>
  );
};
