import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Play, Pause, Headphones, Radio, Mic2, Sparkles, 
  ExternalLink, Calendar, Clock, User, ArrowRight, Share2,
  Bookmark, Download, Search, LayoutGrid, List as ListIcon,
  PlayCircle, SkipForward
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

// Fallback or empty items until load
const FALLBACK_PODCASTS: PodcastEpisode[] = [];

interface BrainXTalksProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export const BrainXTalks: React.FC<BrainXTalksProps> = ({ onClose, isDarkMode }) => {
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>(FALLBACK_PODCASTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    let mounted = true;
    const fetchRSS = async () => {
      try {
        const res = await fetch('/api/podcast/rss');
        if (!res.ok) throw new Error('Failed to fetch podcast feed');
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        
        const items = Array.from(xml.querySelectorAll('item'));
        const dynamicPodcasts: PodcastEpisode[] = items.map((item, index) => {
          const title = item.querySelector('title')?.textContent || 'Unknown Episode';
          const descriptionRaw = item.querySelector('description')?.textContent || '';
          const description = descriptionRaw.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
          const dateRaw = item.querySelector('pubDate')?.textContent || '';
          const date = new Date(dateRaw).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) || 'Unknown Date';
          
          let audioUrl = '';
          const enclosure = item.querySelector('enclosure');
          if (enclosure) audioUrl = enclosure.getAttribute('url') || '';
          
          let duration = item.querySelector('itunes\\:duration')?.textContent || '45 min';
          
          // Parse image
          let imageUrl = 'https://brainxai.org/wp-content/uploads/2021/04/BrainX-Community-Logo.png';
          const itunesImage = item.querySelector('itunes\\:image');
          if (itunesImage) imageUrl = itunesImage.getAttribute('href') || imageUrl;

          // Parse speaker
          let speaker = title.replace('Conversation with ', '').split('-')[0].trim();
          if (speaker.length > 30) speaker = 'BrainX Community';

          return {
             id: `ep-${index}-${Date.now()}`,
             title,
             speaker,
             description,
             date,
             duration,
             audioUrl,
             imageUrl,
             category: 'Medical AI Conversation'
          };
        });

        if (mounted) {
           setPodcasts(dynamicPodcasts);
           setIsLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
           setError('Failed to load live nodes. Falling back to cached data.');
           setIsLoading(false);
        }
      }
    };
    
    fetchRSS();
    return () => { mounted = false; };
  }, []);

  const filteredPodcasts = podcasts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stealth-950/90 backdrop-blur-3xl"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        className={`relative w-full max-w-6xl h-[90vh] flex flex-col rounded-[2.5rem] border overflow-hidden shadow-[0_0_80px_rgba(45,212,191,0.15)] ${
          isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-registry-teal/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-registry-cobalt/10 blur-[120px] rounded-full animate-pulse delay-1000" />
        </div>

        {/* Header */}
        <header className="px-8 py-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 bg-white/20 dark:bg-black/20 backdrop-blur-lg">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-registry-teal/20 rounded-2xl flex items-center justify-center shadow-lg shadow-registry-teal/10 border border-registry-teal/30">
              <Headphones className="w-8 h-8 text-registry-teal" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">BrainX Community</h2>
              <div className="flex items-center mt-2.5 space-x-3">
                <span className="text-[11px] font-black text-registry-teal uppercase tracking-[0.4em] bg-registry-teal/10 px-2 py-0.5 rounded border border-registry-teal/20">Podcasts</span>
                <div className="w-1 h-1 bg-slate-500 rounded-full" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Medical AI Conversations</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-registry-teal transition-colors" />
              <input 
                type="text" 
                placeholder="Search BrainX Talks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full md:w-64 py-3 pl-12 pr-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none border transition-all ${
                  isDarkMode ? 'bg-white/5 border-white/5 text-white focus:border-registry-teal' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-registry-teal'
                }`}
              />
            </div>
            
            <div className={`p-1 rounded-xl border flex ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-registry-teal text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-registry-teal text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={onClose} 
              className="p-3 hover:bg-white/10 rounded-2xl transition-colors focus:outline-none"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-registry-teal animate-spin" />
              <p className="text-[11px] font-black tracking-widest uppercase text-slate-500 animate-pulse">Fetching Live Nodes...</p>
            </div>
          ) : error ? (
            <div className="w-full h-64 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <X className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-red-500">{error}</p>
            </div>
          ) : (
             <>
                {/* Featured Episode */}
                {!searchQuery && filteredPodcasts.length > 0 && (
                  <div className="mb-8 relative z-10 hidden lg:block">
                    <div className={`p-8 rounded-[2.5rem] border flex items-center space-x-8 relative overflow-hidden group ${
                      isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-registry-teal/5 to-transparent pointer-events-none" />
                      <div className="relative w-48 h-48 rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                        <img src={filteredPodcasts[0].imageUrl} alt={filteredPodcasts[0].title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-4 left-4 p-2 bg-registry-teal text-stealth-950 rounded-xl">
                          <Mic2 className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-[11px] font-black uppercase tracking-widest py-1 px-3 bg-registry-teal/20 text-registry-teal rounded-full border border-registry-teal/20">Featured Update</span>
                          <div className="flex items-center text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                            <Calendar className="w-3 h-3 mr-2" />
                            {filteredPodcasts[0].date}
                          </div>
                        </div>
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-tight">{filteredPodcasts[0].title}</h3>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-2xl line-clamp-2">
                          {filteredPodcasts[0].description}
                        </p>
                        <div className="flex items-center space-x-6 pt-2">
                          <button 
                            onClick={() => { setActiveEpisode(filteredPodcasts[0]); setIsPlaying(true); }}
                            className="flex items-center space-x-3 px-8 py-4 bg-registry-teal text-stealth-950 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-registry-teal/20 hover:scale-105 active:scale-95 transition-all"
                          >
                            <PlayCircle className="w-5 h-5" />
                            <span>Watch / Listen Now</span>
                          </button>
                          <a 
                            href="https://brainxai.org/podcast/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-[11px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors"
                          >
                            <span>View Archive</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredPodcasts.map((podcast) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={podcast.id}
                        className={`group flex flex-col p-5 rounded-[2rem] border transition-all hover:scale-[1.02] cursor-pointer ${
                          isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-registry-teal/30 shadow-sm'
                        }`}
                        onClick={() => setActiveEpisode(podcast)}
                      >
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 border border-white/5">
                          <img src={podcast.imageUrl} alt={podcast.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Play className="w-10 h-10 text-white fill-white" />
                          </div>
                          <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg flex items-center space-x-2 border border-white/10">
                             <Clock className="w-3 h-3 text-registry-teal" />
                             <span className="text-[11px] font-black text-white uppercase">{podcast.duration}</span>
                          </div>
                        </div>
                        <div className="space-y-3 flex-1 flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-registry-teal uppercase tracking-widest">{podcast.category}</span>
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{podcast.date}</span>
                          </div>
                          <h4 className="text-sm font-black uppercase leading-tight group-hover:text-registry-teal transition-colors line-clamp-2">{podcast.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed flex-1 italic truncate">
                            {podcast.description}
                          </p>
                          <div className="flex items-center space-x-4 pt-3 mt-auto">
                            <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full border border-white/10 bg-registry-teal/20 flex items-center justify-center">
                                <User className="w-3 h-3 text-registry-teal" />
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase truncate">{podcast.speaker}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPodcasts.map((podcast) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={podcast.id}
                        className={`group flex items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                          isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-registry-teal/30 shadow-sm'
                        }`}
                        onClick={() => setActiveEpisode(podcast)}
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden mr-6 shrink-0 border border-white/10">
                          <img src={podcast.imageUrl} alt={podcast.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="text-[11px] font-black text-registry-teal uppercase">{podcast.category}</span>
                            <div className="w-1 h-1 bg-slate-700 rounded-full" />
                            <span className="text-[11px] font-black text-slate-500 uppercase">{podcast.date}</span>
                          </div>
                          <h4 className="text-sm font-black uppercase truncate group-hover:text-registry-teal transition-colors">{podcast.title}</h4>
                          <p className="text-xs text-slate-500 font-medium truncate">{podcast.description}</p>
                        </div>
                        <div className="flex items-center space-x-6 shrink-0 px-6">
                          <div className="text-right hidden md:block">
                            <p className="text-[11px] font-black text-white">{podcast.duration}</p>
                            <p className="text-[11px] font-black text-slate-400 uppercase">Listen Time</p>
                          </div>
                          <button className="w-12 h-12 bg-registry-teal text-stealth-950 rounded-xl flex items-center justify-center shadow-lg shadow-registry-teal/10">
                            <Play className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
             </>
          )}
        </main>

        {/* Footer Player / Stats */}
        <footer className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-white/20 dark:bg-black/40 backdrop-blur-xl relative z-20">
           <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center p-1 border border-white/10">
                 <img src="https://brainxai.org/wp-content/uploads/2021/04/BrainX-Community-Logo.png" alt="BrainX" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-[11px] font-black text-white uppercase tracking-widest">BrainX Talks Official Feed</p>
                <div className="flex items-center space-x-2">
                   <span className="w-2 h-2 bg-registry-teal rounded-full animate-ping" />
                   <span className="text-[11px] font-bold text-registry-teal uppercase italic">Connected To Neural Stream</span>
                </div>
              </div>
           </div>

           <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                 <Radio className="w-4 h-4 text-registry-teal" />
                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Live: Conversations In AI</span>
              </div>
              <a 
                href="https://brainxai.org/podcast/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] rounded-xl transition-all border border-white/10"
              >
                <span>Full Archive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
           </div>
        </footer>

        {/* Backdrop for Player Modal */}
        <AnimatePresence>
          {activeEpisode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-stealth-950/95 backdrop-blur-2xl"
            >
               <audio 
                 autoPlay={isPlaying} 
                 src={activeEpisode.audioUrl} 
                 ref={(audio) => {
                   if (audio) {
                     if (isPlaying && audio.paused) audio.play().catch(e => console.log('Audio autoplay prevented', e));
                     else if (!isPlaying && !audio.paused) audio.pause();
                   }
                 }} 
               />
               <div className="w-full max-w-2xl flex flex-col items-center">
                  <header className="w-full flex justify-end mb-8">
                     <button onClick={() => { setActiveEpisode(null); setIsPlaying(false); }} className="p-4 hover:bg-white/10 rounded-2xl transition-colors">
                        <X className="w-8 h-8 text-white" />
                     </button>
                  </header>

                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.2)] border-2 border-registry-teal/30 mb-10 group relative">
                    <img src={activeEpisode.imageUrl} alt={activeEpisode.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                       <Headphones className={`w-24 h-24 text-registry-teal/80 ${isPlaying ? 'animate-bounce' : ''}`} />
                    </div>
                  </div>

                  <div className="text-center space-y-4 mb-12">
                     <div className="flex items-center justify-center space-x-3">
                        <span className="text-[11px] font-black text-registry-teal uppercase tracking-[0.3em] bg-registry-teal/10 px-3 py-1 rounded-full border border-registry-teal/20">Now Streaming</span>
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{activeEpisode.category}</span>
                     </div>
                     <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white leading-tight">{activeEpisode.title}</h3>
                     <p className="text-sm font-black text-registry-teal uppercase tracking-widest">{activeEpisode.speaker}</p>
                     <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xl mx-auto italic">"{activeEpisode.description}"</p>
                  </div>

                  <div className="w-full space-y-8">
                     <div className="space-y-2">
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative group cursor-pointer">
                           <div className="h-full bg-registry-teal w-1/3 rounded-full relative shadow-glow" />
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 uppercase">
                           <span>12:45</span>
                           <span>{activeEpisode.duration}</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-center space-x-12">
                        <button className="text-slate-500 hover:text-white transition-colors">
                           <Share2 className="w-6 h-6" />
                        </button>
                        <button className="text-slate-100 hover:text-registry-teal transition-all p-4 bg-white/5 rounded-2xl">
                           <SkipForward className="w-8 h-8 rotate-180" />
                        </button>
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-24 h-24 bg-registry-teal text-stealth-950 rounded-[2.5rem] flex items-center justify-center shadow-glow shadow-registry-teal/40 hover:scale-105 active:scale-95 transition-all"
                        >
                           {isPlaying ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 ml-1" />}
                        </button>
                        <button className="text-slate-100 hover:text-registry-teal transition-all p-4 bg-white/5 rounded-2xl">
                           <SkipForward className="w-8 h-8" />
                        </button>
                        <button className="text-slate-500 hover:text-white transition-colors">
                           <Bookmark className="w-6 h-6" />
                        </button>
                     </div>

                     <div className="flex justify-center pt-8 space-x-6">
                        <button className="flex items-center space-x-2 text-[11px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                           <Download className="w-4 h-4" />
                           <span>Offline Mode</span>
                        </button>
                        <a 
                          href={activeEpisode.audioUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-[11px] font-black text-registry-teal hover:text-white uppercase tracking-widest transition-colors"
                        >
                           <ExternalLink className="w-4 h-4" />
                           <span>External Stream</span>
                        </a>
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
