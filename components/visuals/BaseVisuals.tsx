import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Info, Volume2, Loader2, Sparkles, Book, Zap, AlertCircle, Monitor 
} from 'lucide-react';
import { generateSpeech } from '../../src/services/aiService';
import { decodeBase64, pcmToWav } from '../../src/lib/audioUtils';

export const VisualInsight: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    try {
      setIsLoading(true);
      const base64Audio = await generateSpeech(description, 'Kore');
      
      if (base64Audio) {
        const pcmData = decodeBase64(base64Audio);
        const wavBlob = pcmToWav(pcmData, 24000, 1);
        const audioSrc = URL.createObjectURL(wavBlob);
        
        const audio = document.createElement('audio');
        audio.src = audioSrc;
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("TTS Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.015,
        delayChildren: 0.1
      } 
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="mt-6 p-6 bg-registry-teal/5 dark:bg-registry-teal/[0.03] border border-registry-teal/20 rounded-3xl relative group overflow-hidden"
    >
      <div className="absolute inset-0 scanline opacity-[0.03] pointer-events-none" />
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <motion.div 
            variants={wordVariants}
            className="text-[11px] font-black uppercase text-registry-teal mb-3 flex items-center gap-2 tracking-[0.2em]"
          >
            <div className="p-1.5 bg-registry-teal/10 rounded-lg">
              <Info className="w-3.5 h-3.5" />
            </div>
            Neural Explainer: {title}
          </motion.div>
          <div className="flex flex-wrap gap-x-1">
            {description.split(' ').map((word, idx) => (
              <motion.span 
                key={idx} 
                variants={wordVariants}
                className="text-[12px] md:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed tracking-tight"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayAudio}
          disabled={isLoading}
          className="ml-4 px-4 py-3 rounded-2xl bg-registry-teal text-white shadow-lg shadow-registry-teal/30 hover:bg-registry-teal/90 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
          title="Listen to narration"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          )}
          <span className="text-[11px] font-black uppercase tracking-widest hidden sm:inline">
             {isPlaying ? 'Playing' : 'Listen'}
          </span>
        </motion.button>
      </div>
      
      <div className="absolute bottom-0 left-0 h-1 bg-registry-teal/20 w-0 group-hover:w-full transition-all duration-1000" />
    </motion.div>
  );
};

export const LectureTag: React.FC<{ type: 'Concept' | 'Def' | 'Tip' | 'Not'; label: string; content: string }> = ({ type, label, content }) => {
  const colors = {
    Concept: 'bg-registry-cobalt/10 border-registry-cobalt text-registry-cobalt hover:bg-registry-cobalt/20',
    Def: 'bg-registry-teal/10 border-registry-teal text-registry-teal hover:bg-registry-teal/20',
    Tip: 'bg-registry-teal/10 border-registry-teal text-registry-teal hover:bg-registry-teal/20',
    Not: 'bg-registry-rose/10 border-registry-rose text-registry-rose hover:bg-registry-rose/20'
  };

  const icons = {
    Concept: <Sparkles className="w-3 h-3" />,
    Def: <Book className="w-3 h-3" />,
    Tip: <Zap className="w-3 h-3" />,
    Not: <AlertCircle className="w-3 h-3" />
  };

  return (
    <motion.div 
      whileHover={{ x: 4, scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={`p-4 md:p-6 border rounded-3xl ${colors[type]} mb-10 animate-in slide-in-from-left duration-500 cursor-default transition-all shadow-sm hover:shadow-xl relative overflow-hidden group/tag`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 transition-transform group-hover/tag:rotate-0">
        {icons[type]}
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-current opacity-20 rounded-lg">
          {icons[type]}
        </div>
        <span className="micro-label opacity-100">{label}</span>
      </div>
      <p className="text-sm md:text-lg font-medium leading-relaxed break-words">{content}</p>
    </motion.div>
  );
};

export const VideoTutorialLink: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => {
  return (
    <motion.a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-[11px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-600/20 mb-6"
    >
      <Monitor className="w-3 h-3" />
      <span>Video Tutorial: {title}</span>
      <div className="w-px h-3 bg-white/20 mx-1" />
      <span className="opacity-70">Radiology Tutorials</span>
    </motion.a>
  );
};

export const KnowledgeVisual: React.FC<{ 
  title: string; 
  description: string; 
  imageUrl?: string;
  isDarkMode?: boolean;
}> = ({ title, description, imageUrl, isDarkMode }) => {
  return (
    <div className={`p-8 rounded-3xl border premium-card group ${isDarkMode ? 'bg-stealth-900 border-stealth-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h4 className={`text-xl text-display ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
        <div className="w-10 h-[1px] bg-registry-teal/30" />
      </div>
      {imageUrl && (
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 border tech-border group-hover:border-registry-teal/30 transition-colors">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <div className="w-2 h-2 bg-registry-teal rounded-full animate-pulse shadow-glow" />
            <span className="micro-label opacity-100 text-white shadow-sm">Physics Data Stream</span>
          </div>
        </div>
      )}
      <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
        {description}
      </p>
    </div>
  );
};
