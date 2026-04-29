import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Play, Pause, Headphones, Radio, Mic2, Sparkles, 
  ExternalLink, Calendar, Clock, User, ArrowRight, Share2,
  Bookmark, Download, Search, LayoutGrid, List as ListIcon,
  PlayCircle, SkipForward, Volume2
} from 'lucide-react';

interface PodcastEpisode {
  id: string;
  title: string;
  speaker: string;
  description: string;
  date: string;
  duration: string;
  audioUrl: string;
  imageUrl: string;
  category: string;
}

const FALLBACK_IMAGE = "https://thesonographylounge.podbean.com/images/default_logo.png"; // Placeholder if needed

interface SonographyLoungeProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export const SonographyLounge: React.FC<SonographyLoungeProps> = ({ onClose, isDarkMode }) => {
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    let mounted = true;
    const fetchRSS = async () => {
      try {
        const res = await fetch('/api/podcast/sonography-lounge');
        if (!res.ok) throw new Error('Failed to fetch podcast feed');
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        
        const items = Array.from(xml.querySelectorAll('item'));
        const dynamicPodcasts: PodcastEpisode[] = items.map((item, index) => {
          const title = item.querySelector('title')?.textContent || 'Unknown Episode';
          const descriptionRaw = item.querySelector('description')?.textContent || item.querySelector('content\\:encoded')?.textContent || '';
          const description = descriptionRaw.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
          const dateRaw = item.querySelector('pubDate')?.textContent || '';
          const date = new Date(dateRaw).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) || 'Unknown Date';
          
          let audioUrl = '';
          const enclosure = item.querySelector('enclosure');
          if (enclosure) audioUrl = enclosure.getAttribute('url') || '';
          
          let duration = item.querySelector('itunes\\:duration')?.textContent || '45 min';
          
          // Parse image
          let imageUrl = "https://pbcdn1.podbean.com/imglogo/image-logo/9442034/The_Sonography_Lounge_Logo.jpg"; // Default logo for the show
          const itunesImage = item.querySelector('itunes\\:image');
          if (itunesImage) {
            const href = itunesImage.getAttribute('href');
            if (href) imageUrl = href;
          }

          // Parse speaker
          let speaker = item.querySelector('itunes\\:author')?.textContent || 'The Sonography Lounge';

          return {
             id: `sl-${index}-${Date.now()}`,
             title,
             speaker,
             description,
             date,
             duration,
             audioUrl,
             imageUrl,
             category: 'Sonography Education'
          };
        });

        if (mounted) {
           setPodcasts(dynamicPodcasts);
           setIsLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
           setError('Failed to connect to the lounge. Please try again later.');
           setIsLoading(false);
        }
      }
    };
    
    fetchRSS();
    return () => { mounted = false; };
  }, []);

  const filteredPodcasts = podcasts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stealth-950/95 backdrop-blur-3xl"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        className={`relative w-full max-w-7xl h-[90vh] flex flex-col rounded-[3rem] border overflow-hidden shadow-[0_0_100px_rgba(45,212,191,0.2)] ${
          isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <header className="px-10 py-12 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10 bg-gradient-to-b from-registry-teal/10 via-registry-teal/5 to-transparent">
          <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
          <div className="flex items-center space-x-8">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="w-24 h-24 bg-registry-teal text-stealth-950 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(45,212,191,0.4)] relative group"
            >
               <Radio className="w-12 h-12 relative z-10" />
               <div className="absolute inset-0 rounded-[2rem] animate-ping bg-registry-teal/20" />
            </motion.div>
            <div>
              <div className="flex items-center space-x-3 mb-3">
                 <span className="px-3 py-1 bg-registry-rose text-[9px] font-black uppercase tracking-[0.3em] text-white italic rounded-lg shadow-glow-rose">On Air</span>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Studio Live Stream</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-white drop-shadow-2xl">Sonography Lounge</h2>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex -space-x-4">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-stealth-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                        <User className="w-6 h-6 text-slate-400" />
                     </div>
                   ))}
                   <div className="w-10 h-10 rounded-full border-2 border-stealth-950 bg-registry-teal text-stealth-950 text-[10px] font-black flex items-center justify-center">
                      9K+
                   </div>
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Global Education Network</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-registry-teal opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <input 
                type="text" 
                placeholder="Locate Signal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-96 py-5 pl-16 pr-8 bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] text-white focus:border-registry-teal focus:ring-1 focus:ring-registry-teal transition-all outline-none placeholder:text-slate-600"
              />
            </div>
            
            <motion.button 
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-slate-500 hover:text-white"
            >
              <X className="w-8 h-8" />
            </motion.button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-10 lg:p-16 relative z-10 custom-scrollbar scroll-smooth">
          <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
          
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-10">
                 <div className="absolute inset-0 border-4 border-registry-teal/20 rounded-full animate-[ping_2s_infinite]" />
                 <div className="absolute inset-0 border-t-4 border-registry-teal rounded-full animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center shadow-glow-teal">
                    <Radio className="w-12 h-12 text-registry-teal animate-pulse" />
                 </div>
              </div>
              <p className="text-[11px] font-black tracking-[0.8em] uppercase text-registry-teal animate-pulse italic">Synchronizing Studio Feeds</p>
            </div>
          ) : error ? (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                <X className="w-10 h-10" />
              </div>
              <p className="text-xl font-black uppercase italic tracking-tighter text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
              >
                Attempt Retry
              </button>
            </div>
          ) : (
             <>
                {/* Hero Section (latest episode) */}
                {!searchQuery && filteredPodcasts.length > 0 && !activeEpisode && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 relative group"
                  >
                    <div className={`p-10 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 ${
                      isDarkMode ? 'bg-gradient-to-br from-registry-teal/10 to-transparent' : 'bg-slate-50'
                    }`}>
                      <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0 border-4 border-white/5">
                        <img src={filteredPodcasts[0].imageUrl} alt={filteredPodcasts[0].title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={() => { setActiveEpisode(filteredPodcasts[0]); setIsPlaying(true); }}
                            className="p-6 bg-registry-teal text-stealth-950 rounded-full shadow-glow transform scale-110"
                           >
                             <Play className="w-10 h-10 fill-current" />
                           </button>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center space-x-4">
                          <span className="px-4 py-1.5 bg-registry-teal text-stealth-950 text-[10px] font-black uppercase tracking-widest rounded-full italic">Latest Release</span>
                          <div className="flex items-center text-[11px] text-slate-500 font-black uppercase tracking-widest">
                            <Calendar className="w-4 h-4 mr-2 text-registry-teal" />
                            {filteredPodcasts[0].date}
                          </div>
                        </div>
                        <h3 className="text-3xl lg:text-5xl font-black uppercase italic tracking-tighter text-white leading-[1.1]">{filteredPodcasts[0].title}</h3>
                        <p className="text-base text-slate-400 font-medium leading-relaxed line-clamp-3">
                          {filteredPodcasts[0].description}
                        </p>
                        <div className="flex flex-wrap items-center gap-6 pt-4">
                          <button 
                            onClick={() => { setActiveEpisode(filteredPodcasts[0]); setIsPlaying(true); }}
                            className="flex items-center space-x-4 px-10 py-5 bg-white text-stealth-950 font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl hover:bg-registry-teal hover:shadow-glow transition-all active:scale-95 italic"
                          >
                            <PlayCircle className="w-6 h-6" />
                            <span>Initiate Audio Pulse</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <h3 className="text-xs font-black uppercase tracking-[0.5em] text-registry-teal mb-10 flex items-center">
                   <Mic2 className="w-5 h-5 mr-3" />
                   Recent Show Transmissions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-32">
                  {filteredPodcasts.map((podcast, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={podcast.id}
                      className="group relative flex flex-col p-6 rounded-[3rem] border transition-all hover:border-registry-teal/40 cursor-pointer bg-white/5 border-white/5 hover:bg-white/10 md:hover:-translate-y-2 shadow-2xl"
                      onClick={() => setActiveEpisode(podcast)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />
                      
                      <div className="relative aspect-square rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl group-hover:rotate-1 transition-transform duration-700">
                        <img src={podcast.imageUrl} alt={podcast.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-8">
                           <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl flex items-center space-x-3 border border-white/10 shadow-glow">
                              <Play className="w-4 h-4 text-registry-teal fill-current" />
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">{podcast.duration}</span>
                           </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                           <div className="w-20 h-20 bg-registry-teal text-stealth-950 rounded-full flex items-center justify-center shadow-glow shadow-registry-teal/40 transform -rotate-12 group-hover:rotate-0 transition-transform">
                             <Play className="w-10 h-10 fill-current ml-1" />
                           </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 flex-1 flex flex-col relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-registry-teal" />
                             <span className="text-[10px] font-black text-registry-teal uppercase tracking-widest italic">{podcast.category}</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{podcast.date}</span>
                        </div>
                        <h4 className="text-xl font-black uppercase italic tracking-tighter leading-tight group-hover:text-registry-teal transition-colors line-clamp-2">{podcast.title}</h4>
                        <p className="text-[13px] text-slate-400 font-medium line-clamp-3 leading-relaxed mb-8 italic opacity-70 group-hover:opacity-100 transition-opacity">
                          {podcast.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-2xl bg-registry-teal/10 flex items-center justify-center border border-registry-teal/20 shadow-inner">
                                <User className="w-5 h-5 text-registry-teal" />
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Broadcast By</p>
                                 <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest truncate max-w-[140px] block">{podcast.speaker}</span>
                              </div>
                           </div>
                           <button className="p-4 bg-white/5 rounded-2xl text-slate-500 group-hover:text-registry-teal group-hover:bg-registry-teal/10 transition-all border border-transparent group-hover:border-registry-teal/20">
                              <ArrowRight className="w-6 h-6" />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
             </>
          )}
        </main>

        {/* Studio Control Center (Global Player) */}
        <AnimatePresence>
          {activeEpisode && (
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 150 }}
              className="absolute bottom-0 inset-x-0 z-[100] p-10 pointer-events-none"
            >
               <div className="w-full max-w-6xl mx-auto rounded-[4rem] p-8 lg:p-12 border-2 border-registry-teal/30 shadow-[0_0_120px_rgba(45,212,191,0.4)] pointer-events-auto backdrop-blur-3xl overflow-hidden relative bg-stealth-950/98">
                  <div className="absolute inset-0 bg-gradient-to-r from-registry-teal/10 via-transparent to-registry-teal/10 pointer-events-none opacity-40 shadow-inner" />
                  <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
                  
                  <audio 
                    autoPlay={isPlaying} 
                    src={activeEpisode.audioUrl} 
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    ref={(audio) => {
                      if (audio) {
                        if (isPlaying && audio.paused) audio.play().catch(e => console.log('Audio error', e));
                        else if (!isPlaying && !audio.paused) audio.pause();
                      }
                    }} 
                  />

                  <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                     {/* Cinematic Thumbnail */}
                     <div className="relative shrink-0 group">
                        <div className={`w-40 h-40 lg:w-56 lg:h-56 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 transition-all duration-700 relative ${
                          isPlaying ? 'border-registry-teal shadow-glow scale-110 rotate-3' : 'border-white/10 grayscale opacity-60'
                        }`}>
                           <img src={activeEpisode.imageUrl} alt="Episode" className="w-full h-full object-cover" />
                           {isPlaying && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                                <motion.div 
                                  animate={{ scale: [1, 1.3, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="w-20 h-20 bg-registry-teal/20 rounded-full flex items-center justify-center border border-registry-teal/40"
                                >
                                   <Radio className="w-10 h-10 text-registry-teal" />
                                </motion.div>
                             </div>
                           )}
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-registry-teal rounded-2xl flex items-center justify-center shadow-glow transform -rotate-12">
                           <Headphones className="w-8 h-8 text-stealth-950" />
                        </div>
                     </div>

                     {/* Studio Controls */}
                     <div className="flex-1 min-w-0 w-full space-y-8">
                        <div className="flex items-center justify-between mb-4">
                           <div className="min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                 <span className="px-2 py-0.5 bg-registry-teal/20 text-registry-teal text-[9px] font-black uppercase tracking-widest rounded italic border border-registry-teal/30">Active Stream</span>
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activeEpisode.date}</span>
                              </div>
                              <h4 className="text-2xl lg:text-4xl font-black uppercase italic tracking-tighter text-white truncate max-w-xl drop-shadow-lg">{activeEpisode.title}</h4>
                              <p className="text-[12px] font-black text-registry-teal uppercase tracking-[0.4em] mt-2 opacity-80">{activeEpisode.speaker}</p>
                           </div>
                           <button 
                            onClick={() => { setActiveEpisode(null); setIsPlaying(false); }} 
                            className="p-4 bg-white/5 hover:bg-registry-rose/20 hover:text-registry-rose rounded-[1.5rem] transition-all text-slate-500 border border-transparent hover:border-registry-rose/30"
                           >
                              <X className="w-8 h-8" />
                           </button>
                        </div>

                        {/* Digital Progress Interface */}
                        <div className="space-y-3">
                          <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border-2 border-white/5 shadow-inner">
                            <motion.div 
                              animate={{ width: isPlaying ? ["5%", "95%"] : "5%" }}
                              transition={{ duration: 400, ease: "linear" }}
                              className="h-full bg-gradient-to-r from-registry-teal to-registry-teal/60 shadow-[0_0_20px_rgba(45,212,191,0.6)] rounded-full relative" 
                            >
                               <div className="absolute inset-0 bg-white/20 scanline" />
                            </motion.div>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] px-1">
                             <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-registry-rose animate-pulse' : 'bg-slate-700'}`} />
                                <span>{isPlaying ? 'Live Audio Matrix Engaged' : 'System Hot-Standby'}</span>
                             </div>
                             <span className="text-registry-teal italic">{activeEpisode.duration} Remaining</span>
                          </div>
                        </div>

                        {/* Hardware-Style Audio Deck */}
                        <div className="flex items-center justify-between pt-4">
                           <div className="flex items-center space-x-8">
                              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all transform hover:-translate-x-1">
                                <SkipForward className="w-8 h-8 rotate-180" />
                              </button>
                              <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all ${
                                  isPlaying ? 'bg-registry-rose text-white shadow-glow-rose' : 'bg-registry-teal text-stealth-950 shadow-glow shadow-registry-teal/30'
                                } hover:scale-105 relative group overflow-hidden`}
                              >
                                {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-2" />}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </motion.button>
                              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all transform hover:translate-x-1">
                                <SkipForward className="w-8 h-8" />
                              </button>
                           </div>

                           <div className="hidden lg:flex items-center space-x-6">
                              <div className="flex space-x-2">
                                 <button className="p-4 bg-white/5 hover:bg-registry-teal/20 hover:text-white rounded-2xl text-slate-500 transition-all border border-transparent hover:border-registry-teal/20">
                                   <Share2 className="w-6 h-6" />
                                 </button>
                                 <button className="p-4 bg-white/5 hover:bg-registry-teal/20 hover:text-white rounded-2xl text-slate-500 transition-all border border-transparent hover:border-registry-teal/20">
                                   <Download className="w-6 h-6" />
                                 </button>
                              </div>
                              
                              <div className="h-12 w-[1px] bg-white/10 mx-2" />
                              
                              <div className="flex items-center space-x-5 bg-black/40 px-6 py-4 rounded-3xl border border-white/5 shadow-inner">
                                 <Volume2 className="w-5 h-5 text-registry-teal" />
                                 <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                    <motion.div 
                                      animate={{ width: "75%" }} 
                                      className="h-full bg-registry-teal shadow-glow scale-y-110" 
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
