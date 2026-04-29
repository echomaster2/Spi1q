import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, Volume2, Loader2, Sparkles, Book, Zap, AlertCircle, Monitor, Cpu, ChevronRight, Copy, Activity, Shield
} from 'lucide-react';
import { generateSpeech } from '../../services/aiService';
import { decodeBase64, pcmToWav } from '../../lib/audioUtils';

// --- FOUNDATIONAL COMPONENTS ---

export const VisualHeader: React.FC<{ 
  title: string; 
  subtitle: string; 
  icon: React.ElementType;
  color?: string;
  protocol?: string;
}> = ({ title, subtitle, icon: Icon, color = "text-registry-teal", protocol = "01-X" }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 mb-8 w-full group">
      <div className="flex items-center space-x-5">
        <div className={`p-4 rounded-2xl bg-stealth-950 border transition-all duration-500 ${color.replace('text-', 'border-').replace('400', '400/30').replace('teal', 'teal/30').replace('rose', 'rose/30')} shadow-inner group-hover:scale-110 transition-transform`}>
          <Icon className={`w-8 h-8 ${color} drop-shadow-glow`} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white drop-shadow-lg leading-none">{title}</h4>
            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-slate-500 uppercase tracking-tighter">PRTCL {protocol}</span>
          </div>
          <p className={`text-[11px] font-black ${color} uppercase tracking-[0.4em] mt-2 opacity-70 flex items-center`}>
            <Activity className="w-3 h-3 mr-2 animate-pulse" /> {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export const VisualInsight: React.FC<{ 
  title: string; 
  description: string; 
  keyTerms?: string[];
  protocolInfo?: string;
}> = ({ 
  title, 
  description, 
  keyTerms: customKeyTerms,
  protocolInfo = "DIAGNOSTIC DATASTREAM V2.4"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isSummarized, setIsSummarized] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const keyTerms = customKeyTerms || ['frequency', 'resolution', 'attenuation', 'doppler', 'transducer', 'acoustic', 'velocity', 'depth', 'reflection', 'refraction', 'scattering', 'harmonic'];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        if (audioRef.current) {
          const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(isNaN(p) ? 0 : p);
        }
      }, 100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
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
        audio.playbackRate = playbackSpeed;
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

  const toggleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${title}: ${description}`);
  };

  return (
    <div className="relative group/insight mt-8">
      <div className="absolute -inset-1 bg-gradient-to-r from-registry-teal/20 via-transparent to-registry-teal/20 rounded-[2.5rem] blur-xl opacity-0 group-hover/insight:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="bg-stealth-950/80 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
        <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center space-x-3">
             <div className="w-1.5 h-1.5 rounded-full bg-registry-teal animate-pulse" />
             <span className="text-[10px] font-mono text-registry-teal uppercase tracking-[0.3em] font-black">{protocolInfo}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsSummarized(!isSummarized)}
              className={`p-2 rounded-xl border transition-all ${isSummarized ? 'bg-registry-teal/20 border-registry-teal text-registry-teal shadow-glow' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
              title="Highlight Key Dynamics"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button 
              onClick={handlePlayAudio}
              disabled={isLoading}
              className={`p-2 rounded-xl border transition-all ${isPlaying ? 'bg-registry-rose/20 border-registry-rose text-registry-rose shadow-glow-rose' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={copyToClipboard}
              className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all group/copy"
              title="Copy Protocol"
            >
              <Copy className="w-4 h-4 transition-transform group-hover/copy:scale-110" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-3">
              <span className="px-2 py-0.5 bg-registry-teal/10 border border-registry-teal/30 rounded text-[9px] font-black text-registry-teal uppercase tracking-widest leading-none">Insight</span>
              <h5 className="text-xl font-black uppercase italic tracking-widest text-white leading-none">{title}</h5>
            </div>
            
            <p className="text-[14px] md:text-[16px] font-bold text-slate-400 leading-relaxed font-sans mt-4 italic">
              {description.split(' ').map((word, idx) => {
                const cleanedWord = word.toLowerCase().replace(/[^a-z]/g, '');
                const isKeyTerm = keyTerms.includes(cleanedWord);
                return (
                  <span 
                    key={idx} 
                    className={`transition-all duration-500 cursor-default ${
                      isSummarized && isKeyTerm 
                      ? 'text-registry-teal font-black drop-shadow-glow underline decoration-registry-teal/30 underline-offset-4' 
                      : 'hover:text-white'
                    }`}
                  >
                    {word}{' '}
                  </span>
                );
              })}
            </p>

            {isPlaying && (
              <div className="flex items-center gap-1 h-4 pt-4">
                {Array.from({ length: 32 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: [2, Math.random() * 12 + 2, 2],
                      backgroundColor: i < (progress / 100) * 32 ? "#2dd4bf" : "#1e293b"
                    }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                    className="w-1 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-56 p-6 bg-stealth-900 rounded-[2rem] border border-white/5 flex flex-col justify-center space-y-5 shadow-inner relative overflow-hidden group/box shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/5 to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity" />
            <div className="flex items-center space-x-2 text-slate-500">
               <Shield className="w-4 h-4 text-registry-teal/60" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em]">Physics Engine</span>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between text-[10px] font-black text-white uppercase tracking-tighter">
                <div className="flex items-center space-x-2">
                  <ChevronRight className="w-3 h-3 text-registry-teal" />
                  <span>Audio Rate</span>
                </div>
                <span className="text-registry-teal font-mono">{playbackSpeed}x</span>
              </div>
              <button 
                onClick={toggleSpeed}
                className="w-full py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors"
              >
                Toggle Speed
              </button>
            </div>
            <div className="pt-2 border-t border-white/5">
               <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocol Sync</span>
                  <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-registry-teal animate-pulse shadow-glow' : 'bg-slate-800'}`} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LectureTag: React.FC<{ 
  children?: React.ReactNode; 
  color?: string;
  type?: string;
  label?: string;
  content?: string;
}> = ({ children, color = "bg-registry-teal", type, label, content }) => {
  const getTagColor = (t?: string) => {
    switch (t?.toLowerCase()) {
      case 'concept': return 'bg-registry-teal';
      case 'def': return 'bg-blue-600';
      case 'not': return 'bg-registry-rose';
      case 'tip': return 'bg-amber-500';
      default: return color;
    }
  };

  return (
    <div className="group relative">
      <div className={`px-4 py-3 rounded-2xl ${getTagColor(type)} text-white shadow-lg transition-all hover:scale-105 cursor-default`}>
        {label && <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">{type || 'DATA'}</div>}
        <div className="text-[11px] font-black uppercase italic tracking-wider leading-tight">{label || children}</div>
        {content && <p className="text-[10px] font-bold mt-2 opacity-90 leading-snug">{content}</p>}
      </div>
    </div>
  );
};

export const VideoTutorialLink: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => (
  <a 
    href={`https://www.youtube.com/watch?v=${videoId}`} 
    target="_blank" 
    rel="noopener noreferrer"
    className="group/vid flex items-center space-x-4 p-4 md:p-6 bg-stealth-950/80 backdrop-blur-xl rounded-[2.5rem] border border-white/5 hover:border-registry-teal/40 transition-all hover:shadow-[0_0_40px_rgba(45,212,191,0.1)] relative overflow-hidden"
  >
    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-registry-teal/0 group-hover/vid:bg-registry-teal/40 transition-all" />
    <div className="w-12 h-12 md:w-16 md:h-16 bg-registry-teal/10 rounded-2xl flex items-center justify-center border border-registry-teal/20 group-hover/vid:scale-110 transition-transform">
      <Monitor className="w-6 h-6 md:w-8 md:h-8 text-registry-teal drop-shadow-glow" />
    </div>
    <div className="flex-1">
      <div className="flex items-center space-x-2 mb-1">
         <span className="text-[9px] font-black text-registry-teal uppercase tracking-[0.3em]">External Data Stream</span>
         <div className="w-4 h-px bg-white/10" />
      </div>
      <h6 className="text-[14px] md:text-lg font-black text-white italic group-hover:text-registry-teal transition-colors uppercase tracking-tight">{title}</h6>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Video Component Protocol 4.0</p>
    </div>
    <ChevronRight className="w-6 h-6 text-slate-700 group-hover/vid:text-registry-teal group-hover/vid:translate-x-2 transition-all mr-2" />
  </a>
);

export const KnowledgeVisual: React.FC<{ 
  title: string; 
  value?: string; 
  description?: string;
  imageUrl?: string;
  icon?: React.ElementType;
  isDarkMode?: boolean;
}> = ({ title, value, description, imageUrl, icon: Icon, isDarkMode }) => (
  <div className="p-8 bg-stealth-950 rounded-[2.5rem] border border-white/5 flex flex-col space-y-6 hover:border-registry-teal/40 transition-all group overflow-hidden relative shadow-2xl">
    <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
    <div className="flex items-center space-x-6">
      <div className="p-4 bg-registry-teal/5 rounded-2xl border border-registry-teal/20 group-hover:scale-110 transition-transform relative z-10 shadow-inner">
        {Icon ? <Icon className="w-8 h-8 text-registry-teal drop-shadow-glow" /> : <Book className="w-8 h-8 text-registry-teal drop-shadow-glow" />}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">{title}</p>
        <p className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg leading-none">{value || 'DATA NODE'}</p>
      </div>
    </div>
    {description && (
      <p className="text-[13px] font-bold text-slate-400 italic leading-relaxed relative z-10">{description}</p>
    )}
    {imageUrl && (
      <div className="relative h-40 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-stealth-950 to-transparent" />
      </div>
    )}
  </div>
);
