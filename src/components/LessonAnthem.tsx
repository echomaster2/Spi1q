import React from 'react';
import { motion } from 'motion/react';
import { Music, Play, Pause } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

export const LessonAnthem: React.FC<{ stationName: string }> = ({ stationName }) => {
  const { stations, changeStation, currentStation, isPlaying, togglePlay } = useRadio();
  
  const station = stations.find(s => s.name === stationName);
  const isActive = currentStation?.name === stationName;

  if (!station) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-slate-50 dark:bg-registry-teal/5 border border-slate-200 dark:border-registry-teal/20 rounded-2xl flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-registry-teal/10 transition-all shadow-sm dark:shadow-none"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-registry-teal/10 dark:bg-registry-teal/20 rounded-xl">
          <Music className="w-5 h-5 text-registry-teal" />
        </div>
        <div>
          <h5 className="text-[10px] font-black uppercase text-registry-teal tracking-widest">Lesson Anthem</h5>
          <p className="text-xs font-bold italic text-slate-900 dark:text-white">{stationName}</p>
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
        className="p-3 bg-registry-teal text-stealth-950 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        {isActive && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
    </motion.div>
  );
};
