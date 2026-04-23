import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, X, Play, Pause, SkipForward, Volume2, VolumeX, Music, Zap, Activity, Waves, Plus, Globe, Tag, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useRadio } from '../src/context/RadioContext';

interface GlobalRadioProps {
  onClose: () => void;
  isDarkMode?: boolean;
}

export const GlobalRadio: React.FC<GlobalRadioProps> = ({ onClose, isDarkMode }) => {
  const {
    isPlaying,
    currentStation,
    volume,
    isMuted,
    stations,
    togglePlay,
    changeStation,
    setVolume,
    setIsMuted,
    addStation,
    removeStation,
    error,
    audioRef,
    analyserRef
  } = useRadio();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStation, setNewStation] = useState({ name: '', genre: '', url: '' });
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      draw();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 140;

      // Calculate beat pulse
      let sum = 0;
      for (let i = 0; i < 10; i++) sum += dataArray[i]; // Focus on bass frequencies
      const avgBass = sum / 10;
      const pulse = 1 + (avgBass / 255) * 0.15;
      const container = canvas.closest('.radio-container');
      if (container instanceof HTMLElement) {
        container.style.setProperty('--radio-pulse', pulse.toString());
      }

      // Draw circular visualizer
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * 80;
        const angle = (i / bufferLength) * Math.PI * 2;
        
        const x1 = centerX + Math.cos(angle) * baseRadius;
        const y1 = centerY + Math.sin(angle) * baseRadius;
        const x2 = centerX + Math.cos(angle) * (baseRadius + barHeight);
        const y2 = centerY + Math.sin(angle) * (baseRadius + barHeight);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(20, 184, 166, 0.2)');
        gradient.addColorStop(1, `rgba(20, 184, 166, ${barHeight / 80})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw secondary outer ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Bottom bars (classic look)
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const h = (dataArray[i] / 255) * 100;
        ctx.fillStyle = `rgba(20, 184, 166, ${h / 200})`;
        ctx.fillRect(x, canvas.height - h, barWidth, h);
        x += barWidth + 1;
      }
    };

    renderFrame();
  };

  const handleAddStationSubmit = () => {
    if (!newStation.name || !newStation.url) return;
    addStation(newStation);
    setNewStation({ name: '', genre: '', url: '' });
    setShowAddForm(false);
  };

  const handleRemoveStation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeStation(id);
  };

  return (
    <div className="radio-container flex flex-col h-full bg-white dark:bg-stealth-950 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-500">
      <header className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between backdrop-blur-xl bg-white/80 dark:bg-stealth-950/50 sticky top-0 z-10 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-registry-teal rounded-xl flex items-center justify-center shadow-lg shadow-registry-teal/20 animate-pulse">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Neural Radio</h2>
            <p className="text-[8px] font-black text-registry-teal uppercase tracking-[0.2em]">Live Frequency Stream</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-registry-teal"
            title="Add Custom Station"
          >
            <Plus className="w-6 h-6" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Background Visualizer */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" width={800} height={400} />
        </div>

        <div className="relative z-10 w-full max-w-md space-y-12 text-center">
          <div
            style={{ transform: 'scale(var(--radio-pulse, 1))' }}
            className={`transition-transform duration-75 w-64 h-64 mx-auto rounded-[3rem] bg-gradient-to-br ${currentStation.color} shadow-2xl flex items-center justify-center relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            <Music className={`w-24 h-24 text-white/80 ${isPlaying ? 'animate-bounce' : ''}`} />
            
            {/* Orbital Rings */}
            <div className="absolute inset-0 border-4 border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 border-2 border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">{currentStation.name}</h3>
            <p className="text-registry-teal font-black uppercase tracking-widest text-xs">{currentStation.genre}</p>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-registry-rose/10 border border-registry-rose/20 rounded-xl flex items-center space-x-2 justify-center"
              >
                <AlertCircle className="w-4 h-4 text-registry-rose" />
                <span className="text-[10px] font-black uppercase text-registry-rose tracking-widest">{error}</span>
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-8">
            <button className="p-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <SkipForward className="w-8 h-8 rotate-180" />
            </button>
            <button 
              onClick={togglePlay}
              className={`w-20 h-20 ${isDarkMode ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'} rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all`}
            >
              {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
            </button>
            <button className="p-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <SkipForward className="w-8 h-8" />
            </button>
          </div>

          <div className="flex items-center space-x-4 px-8">
            <button onClick={() => setIsMuted(!isMuted)}>
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-slate-500" /> : <Volume2 className="w-5 h-5 text-registry-teal" />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none accent-registry-teal"
            />
          </div>
        </div>
      </main>

      <footer className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
        <div className="grid grid-cols-3 gap-4">
          {stations.map((station) => (
            <button
              key={station.id}
              onClick={() => changeStation(station)}
              className={`p-4 rounded-2xl border transition-all text-left space-y-1 relative group ${
                currentStation.id === station.id 
                  ? 'bg-white dark:bg-white/10 border-registry-teal/50 shadow-sm' 
                  : 'bg-white/50 dark:bg-white/5 border-transparent hover:bg-white dark:hover:bg-white/10'
              }`}
            >
              {station.id !== 'lofi' && station.id !== 'synth' && station.id !== 'white' && (
                <button 
                  onClick={(e) => handleRemoveStation(station.id, e)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-registry-rose rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}
              <p className="text-[10px] font-black uppercase tracking-tight truncate">{station.name}</p>
              <div className="flex items-center space-x-1">
                <Activity className="w-3 h-3 text-registry-teal" />
                <span className="text-[8px] font-bold text-slate-500 uppercase">{station.genre.split('/')[0]}</span>
              </div>
            </button>
          ))}
        </div>
      </footer>

      {/* Add Station Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-50 ${isDarkMode ? 'bg-stealth-950/90' : 'bg-white/90'} backdrop-blur-md p-8 flex flex-col items-center justify-center transition-colors duration-500`}
          >
            <div className="w-full max-w-sm space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-registry-teal/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-registry-teal" />
                </div>
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add Frequency</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Inject custom audio stream</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Station Name</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="e.g. Deep Focus"
                      value={newStation.name}
                      onChange={e => setNewStation(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Genre / Mood</label>
                  <div className="relative">
                    <Waves className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="e.g. Ambient"
                      value={newStation.genre}
                      onChange={e => setNewStation(prev => ({ ...prev, genre: e.target.value }))}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Stream URL (MP3/AAC/Suno)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="https://suno.com/song/... or direct link"
                      value={newStation.url}
                      onChange={e => setNewStation(prev => ({ ...prev, url: e.target.value }))}
                      className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={() => setShowAddForm(false)}
                  className={`flex-1 py-4 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'} rounded-2xl font-black uppercase tracking-widest text-[10px] transition-colors`}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddStationSubmit}
                  disabled={!newStation.name || !newStation.url}
                  className="flex-1 py-4 bg-registry-teal text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-registry-teal/20 disabled:opacity-50 transition-all active:scale-95"
                >
                  Add Station
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: var(--primary-color, #00e5ff);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
        }
      `}</style>
    </div>
  );
};
