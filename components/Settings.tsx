import React, { useState } from 'react';
import { 
  X, Settings as SettingsIcon, Bell, Moon, Sun, 
  Volume2, Shield, Database, Trash2, ChevronRight,
  User, Lock, Globe, Zap, Layers, Maximize, Minimize,
  Monitor, ShieldCheck, Loader2, Download, RefreshCw, Grid, Plus, Sparkles,
  AlertTriangle, Brain, CheckCircle2 as CheckCircleIcon, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { checkAIHealth } from '../src/services/aiService';

interface SettingsProps {
  onClose: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  currentTheme: string;
  setCurrentTheme: (val: string) => void;
  themes: any;
  profile: any;
  onUpdateProfile: (updates: any) => void;
  onCacheAll: () => void;
  isCachingAll: boolean;
  cachingProgress: { current: number, total: number };
  cachedCount: number;
  totalCount: number;
  onOpenAssetLibrary: () => void;
  onOpenAdminDashboard: () => void;
  onRestartOnboarding: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  onClose, 
  isDarkMode, 
  setIsDarkMode, 
  currentTheme,
  setCurrentTheme,
  themes,
  profile,
  onUpdateProfile,
  onCacheAll,
  isCachingAll,
  cachingProgress,
  cachedCount,
  totalCount,
  onOpenAssetLibrary,
  onOpenAdminDashboard,
  onRestartOnboarding
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(!!document.fullscreenElement);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [aiHealth, setAiHealth] = useState<any>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const runHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      const status = await checkAIHealth();
      setAiHealth(status);
      toast.success("Neural integrity check complete.");
    } catch (e) {
      toast.error("Deep neural scan failed. Check connections.");
    } finally {
      setIsCheckingHealth(false);
    }
  };

  React.useEffect(() => {
    runHealthCheck();
  }, []);

  const clearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-stealth-950' : 'bg-slate-50'} transition-colors duration-500 overflow-hidden relative z-[150]`}>
      <AnimatePresence>
        {showWipeConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-stealth-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-stealth-900 border-white/10' : 'bg-white border-slate-200'} shadow-2xl text-center space-y-6`}
            >
              <div className="w-20 h-20 bg-registry-rose/10 rounded-[2rem] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10 text-registry-rose" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Wipe All Data?</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  This action is irreversible. Your progress, flashcards, and script vault will be permanently deleted.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={clearData}
                  className="w-full py-4 bg-registry-rose text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-registry-rose/20 hover:bg-registry-rose/90 transition-all"
                >
                  Confirm Wipe
                </button>
                <button 
                  onClick={() => setShowWipeConfirm(false)}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 neural-grid opacity-10" />
        <div className="absolute inset-0 scanline opacity-5" />
      </div>

      <header className={`p-4 md:p-6 ${isDarkMode ? 'bg-stealth-950 text-white border-white/5' : 'bg-white text-slate-900 border-slate-200'} flex justify-between items-center shrink-0 border-b relative z-10`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-registry-teal rounded-xl flex items-center justify-center shadow-lg shadow-registry-teal/20">
            <SettingsIcon className="w-5 h-5 text-stealth-950" />
          </div>
          <div>
            <h4 className="text-base md:text-lg font-black tracking-tight italic uppercase leading-none">System Configuration</h4>
            <p className="text-[8px] md:text-[10px] text-registry-teal font-black uppercase tracking-[0.3em] mt-0.5">Neural Interface v4.0.2</p>
          </div>
        </div>
        <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-transparent relative z-10 scrollbar-hide">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Profile Section */}
          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2 flex items-center">
              <User className="w-3 h-3 mr-2 text-registry-teal" />
              Operator Identity
            </h5>
            <div className={`${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-3xl border p-6 space-y-6 relative overflow-hidden group`}>
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-16 h-16 bg-registry-teal/10 rounded-2xl flex items-center justify-center border border-registry-teal/20">
                  <User className="w-8 h-8 text-registry-teal" />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={profile?.name || ''} 
                    onChange={(e) => onUpdateProfile({ name: e.target.value })}
                    placeholder="Operator Name"
                    className={`w-full bg-transparent text-xl font-black uppercase italic tracking-tighter outline-none ${isDarkMode ? 'text-white placeholder:text-slate-700' : 'text-slate-900 placeholder:text-slate-400'} focus:text-registry-teal transition-colors`}
                  />
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registry ID:</span>
                    <span className="text-[10px] font-black text-registry-teal uppercase tracking-widest">{profile?.id || 'SPI-MASTER-001'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Study Configuration Section */}
          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2 flex items-center">
              <Zap className="w-3 h-3 mr-2 text-registry-teal" />
              Study Configuration
            </h5>
            <div className={`${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-3xl border p-6 space-y-6 relative overflow-hidden`}>
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Birth Date</label>
                  <input 
                    type="date" 
                    value={profile?.birthDate || ''} 
                    onChange={(e) => onUpdateProfile({ birthDate: e.target.value })}
                    className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Birth Time</label>
                  <input 
                    type="time" 
                    value={profile?.birthTime || ''} 
                    onChange={(e) => onUpdateProfile({ birthTime: e.target.value })}
                    className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                  />
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Study Goals</label>
                <textarea 
                  placeholder="e.g. Master Doppler Hemodynamics in 2 weeks"
                  value={profile?.studyGoals || ''} 
                  onChange={(e) => onUpdateProfile({ studyGoals: e.target.value })}
                  className={`w-full h-24 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors resize-none`}
                />
              </div>

              <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Learning Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['visual', 'auditory', 'reading', 'kinesthetic'].map((style) => (
                    <button
                      key={style}
                      onClick={() => onUpdateProfile({ learningStyle: style })}
                      className={`py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-tighter ${
                        profile?.learningStyle === style 
                          ? 'border-registry-teal bg-registry-teal/10 text-registry-teal' 
                          : isDarkMode ? 'border-white/5 bg-white/5 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Visual Experience Section */}
          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2 flex items-center">
              <Sparkles className="w-3 h-3 mr-2 text-registry-teal" />
              Visual Experience
            </h5>
            <div className={`${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-3xl border p-6 space-y-6 relative overflow-hidden`}>
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/20">
                    <Grid className="w-5 h-5 text-registry-teal" />
                  </div>
                  <div className="text-left">
                    <h6 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Asset Library</h6>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      Custom Backgrounds & Visuals
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={onOpenAssetLibrary}
                  className="px-4 py-2 bg-registry-teal text-stealth-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
                >
                  <Plus className="w-3 h-3" />
                  <span>Open Library</span>
                </button>
              </div>
            </div>
          </section>

          {/* Interface Section */}
          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2 flex items-center">
              <Database className="w-3 h-3 mr-2 text-registry-teal" />
              Media Vault
            </h5>
            <div className={`${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-3xl border p-6 space-y-6 relative overflow-hidden`}>
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/20">
                    <Volume2 className="w-5 h-5 text-registry-teal" />
                  </div>
                  <div className="text-left">
                    <h6 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Cloud Media Sync</h6>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      {cachedCount} / {totalCount} Lessons Synced to Server
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={onCacheAll}
                    disabled={isCachingAll || cachedCount === totalCount}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${
                      isCachingAll 
                        ? 'bg-registry-teal/20 text-registry-teal animate-pulse' 
                        : cachedCount === totalCount
                          ? 'bg-slate-500/10 text-slate-500 cursor-not-allowed'
                          : 'bg-registry-teal text-stealth-950 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isCachingAll ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Syncing...</span>
                      </>
                    ) : cachedCount === totalCount ? (
                      <>
                        <ShieldCheck className="w-3 h-3" />
                        <span>All Cached</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        <span>Cache All</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      const { AudioCache } = await import('../src/lib/audioCache');
                      await AudioCache.clear();
                      window.location.reload();
                    }}
                    className={`p-2 ${isDarkMode ? 'bg-registry-rose/10 hover:bg-registry-rose/20' : 'bg-registry-rose/5 hover:bg-registry-rose/10'} text-registry-rose rounded-xl transition-all`}
                    title="Clear Media Cache"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isCachingAll && (
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-registry-teal">
                    <span>Syncing Neural Nodes...</span>
                    <span>{cachingProgress.current} / {cachingProgress.total}</span>
                  </div>
                  <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-registry-teal shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(cachingProgress.current / cachingProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* AI System Integrity Section */}
          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2 flex items-center">
              <Brain className="w-3 h-3 mr-2 text-registry-teal" />
              AI System Integrity
            </h5>
            <div className={`${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-3xl border p-6 space-y-6 relative overflow-hidden`}>
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                {[
                  { id: 'gemini', label: 'Gemini Prime', provider: 'Google AI', data: aiHealth?.gemini },
                  { id: 'openai', label: 'GPT-4o Backup', provider: 'OpenAI', data: aiHealth?.openai },
                  { id: 'elevenlabs', label: 'Vocal Synthesis', provider: 'ElevenLabs', data: aiHealth?.elevenlabs }
                ].map((s) => (
                  <div key={s.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        s.data?.ok ? 'bg-registry-teal/10 border-registry-teal/20 text-registry-teal' : 'bg-registry-rose/10 border-registry-rose/20 text-registry-rose opacity-50'
                      }`}>
                         {s.data?.ok ? <CheckCircleIcon className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{s.label}</p>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mt-0.5">{s.provider} • {isCheckingHealth ? 'SCANNING...' : s.data?.message || 'OFFLINE'}</p>
                      </div>
                    </div>
                    {s.data?.ok && (
                      <div className="px-3 py-1 bg-registry-teal/10 border border-registry-teal/20 rounded-full">
                        <span className="text-[8px] font-black text-registry-teal uppercase tracking-widest">ACTIVE</span>
                      </div>
                    )}
                  </div>
                ))}

                <button 
                  onClick={runHealthCheck}
                  disabled={isCheckingHealth}
                  className={`w-full py-4 mt-2 flex items-center justify-center space-x-2 rounded-2xl border font-black uppercase tracking-[0.2em] text-[10px] transition-all ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${isCheckingHealth ? 'animate-spin' : ''}`} />
                  <span>{isCheckingHealth ? 'Synthesizing...' : 'Rerun Diagnostic'}</span>
                </button>

                <p className="text-[8px] font-bold text-slate-500 text-center uppercase tracking-widest italic opacity-60">
                  Fallback logic engages OpenAI automatically if Gemini capacity is exceeded.
                </p>
              </div>
            </div>
          </section>

          {/* Interface Section */}
          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2 flex items-center">
              <Monitor className="w-3 h-3 mr-2 text-registry-teal" />
              Interface Configuration
            </h5>
            <div className={`${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-3xl border overflow-hidden relative`}>
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
              
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-full p-6 flex items-center justify-between ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-all relative z-10`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    {isDarkMode ? <Moon className="w-5 h-5 text-amber-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div className="text-left">
                    <h6 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Dark Mode Protocol</h6>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Toggle visual spectrum</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-all relative border ${isDarkMode ? 'bg-registry-teal border-registry-teal' : 'bg-slate-200 border-slate-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${isDarkMode ? 'left-7 bg-stealth-950' : 'left-0.5 bg-white'}`} />
                </div>
              </button>

              <div className={`h-px ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'} mx-6`} />

              <button 
                onClick={toggleFullscreen}
                className={`w-full p-6 flex items-center justify-between ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-all relative z-10`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/20">
                    {isFullscreen ? <Minimize className="w-5 h-5 text-registry-teal" /> : <Maximize className="w-5 h-5 text-registry-teal" />}
                  </div>
                  <div className="text-left">
                    <h6 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fullscreen Mode</h6>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{isFullscreen ? 'Exit immersive view' : 'Enter immersive view'}</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-all relative border ${isFullscreen ? 'bg-registry-teal border-registry-teal' : 'bg-slate-200 border-slate-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${isFullscreen ? 'left-7 bg-stealth-950' : 'left-0.5 bg-white'}`} />
                </div>
              </button>

              <div className={`h-px ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'} mx-6`} />

              <div className="p-6 space-y-4 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <Layers className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="text-left">
                    <h6 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Neural Spectrum</h6>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select interface theme</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {Object.entries(themes).map(([key, theme]: [string, any]) => (
                    <button
                      key={key}
                      onClick={() => setCurrentTheme(key)}
                      className={`p-3 rounded-2xl border transition-all text-left space-y-2 group relative overflow-hidden ${
                        currentTheme === key 
                          ? 'border-registry-teal bg-registry-teal/5' 
                          : isDarkMode ? 'border-white/5 bg-white/5 hover:border-white/20' : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-4 h-4 rounded-full shadow-lg" 
                          style={{ backgroundColor: theme.primary }}
                        />
                        {currentTheme === key && (
                          <div className="w-2 h-2 bg-registry-teal rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                        )}
                      </div>
                      <p className={`text-[9px] font-black uppercase tracking-tighter ${
                        currentTheme === key ? 'text-registry-teal' : 'text-slate-500'
                      }`}>
                        {theme.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`h-px ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'} mx-6`} />

              <div className="p-6 space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/20">
                      <Volume2 className="w-5 h-5 text-registry-teal" />
                    </div>
                    <div className="text-left">
                      <h6 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Audio Feedback</h6>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Neural narration volume</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-registry-teal uppercase tracking-widest">{Math.round((profile?.volume ?? 0.8) * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={profile?.volume ?? 0.8}
                  onChange={(e) => onUpdateProfile({ volume: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-registry-teal"
                />
              </div>
            </div>
          </section>

          {/* Security & Data */}
          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2 flex items-center">
              <Shield className="w-3 h-3 mr-2 text-registry-rose" />
              Admin Controls
            </h5>
            <div className={`${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-3xl border p-6 space-y-6 relative overflow-hidden`}>
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-registry-rose/10 rounded-2xl border border-registry-rose/20">
                    <Shield className="w-5 h-5 text-registry-rose" />
                  </div>
                  <div className="text-left">
                    <h6 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Admin Interface</h6>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      Manage Media Library & Content
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={onOpenAdminDashboard}
                  className="px-4 py-2 bg-registry-rose text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center space-x-2 shadow-lg shadow-registry-rose/20"
                >
                  <Lock className="w-3 h-3" />
                  <span>Open Admin</span>
                </button>
              </div>
            </div>
          </section>

          {/* Security & Data */}
          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2 flex items-center">
              <Shield className="w-3 h-3 mr-2 text-registry-rose" />
              Security & Data
            </h5>
            <div className={`${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-3xl border overflow-hidden relative`}>
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
              
              <button 
                onClick={() => onUpdateProfile({ isPrivateMode: !profile?.isPrivateMode })}
                className={`w-full p-6 flex items-center justify-between ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-all relative z-10`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-registry-rose/10 rounded-2xl border border-registry-rose/20">
                    <Lock className="w-5 h-5 text-registry-rose" />
                  </div>
                  <div className="text-left">
                    <h6 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Privacy Protocol</h6>
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 ${profile?.isPrivateMode ? 'bg-registry-teal' : 'bg-slate-500'} rounded-full animate-pulse`} />
                      <span className={`text-[10px] ${profile?.isPrivateMode ? 'text-registry-teal' : 'text-slate-500'} font-black uppercase tracking-widest`}>
                        Encryption: {profile?.isPrivateMode ? 'ACTIVE' : 'STANDBY'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-all relative border ${profile?.isPrivateMode ? 'bg-registry-teal border-registry-teal' : 'bg-slate-200 border-slate-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${profile?.isPrivateMode ? 'left-7 bg-stealth-950' : 'left-0.5 bg-white'}`} />
                </div>
              </button>

              <button 
                onClick={() => {
                  onUpdateProfile({ lastManualSync: Date.now() });
                  toast.success("Manual Sync Initiated. Your data is being backed up to the server.");
                }}
                className={`w-full p-6 flex items-center justify-between ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-all group relative z-10`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${isDarkMode ? 'bg-registry-teal/10' : 'bg-registry-teal/5'} rounded-2xl group-hover:bg-registry-teal group-hover:text-stealth-950 transition-all border border-registry-teal/20`}>
                    <RefreshCw className="w-5 h-5 text-registry-teal group-hover:text-stealth-950" />
                  </div>
                  <div className="text-left">
                    <h6 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sync All Data</h6>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Backup to cloud server</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse" />
                  <span className="text-[8px] text-registry-teal font-black uppercase tracking-widest">READY</span>
                </div>
              </button>

              <div className={`h-px ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'} mx-6`} />

              <button 
                onClick={onRestartOnboarding}
                className={`w-full p-6 flex items-center justify-between transition-all group relative z-10 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${isDarkMode ? 'bg-registry-teal/10' : 'bg-registry-teal/5'} rounded-2xl group-hover:bg-registry-teal group-hover:text-stealth-950 transition-all border border-registry-teal/20`}>
                    <Sparkles className="w-5 h-5 text-registry-teal group-hover:text-stealth-950" />
                  </div>
                  <div className="text-left">
                    <h6 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Restart Tour</h6>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Neural onboarding sequence</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-registry-teal transition-colors" />
              </button>

              <div className={`h-px ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'} mx-6`} />

              <button 
                onClick={() => setShowWipeConfirm(true)}
                className="w-full p-6 flex items-center justify-between hover:bg-registry-rose/10 transition-all group relative z-10"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-registry-rose/10 rounded-2xl group-hover:bg-registry-rose group-hover:text-stealth-950 transition-all border border-registry-rose/20">
                    <Trash2 className="w-5 h-5 text-registry-rose group-hover:text-stealth-950" />
                  </div>
                  <div className="text-left">
                    <h6 className="font-black uppercase text-xs tracking-wider text-registry-rose">Wipe All Data</h6>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Reset synaptic progress</p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* System Info */}
          <div className="text-center space-y-2 pt-8 relative z-10">
            <div className="flex items-center justify-center space-x-2 text-registry-teal">
              <Zap className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">SPI Master Core v4.0.4</span>
            </div>
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">Build: 2026.03.24-MASTER | Neural Link: STABLE</p>
          </div>

        </div>
      </div>
    </div>
  );
};
