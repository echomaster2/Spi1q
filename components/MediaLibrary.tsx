import React, { useState, useEffect } from 'react';
import { Play, X, Video, ChevronRight, Search, Volume2, VolumeX, Image as ImageIcon, CheckCircle2, AlertCircle, RotateCcw, HelpCircle, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoItem, VisualItem, Question } from '../src/mediaData';

interface MediaLibraryProps {
  onClose: () => void;
  isDarkMode: boolean;
  onPlayNarration?: (script: string, id: string) => void;
  isNarrating?: boolean;
  isTtsLoading?: boolean;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ onClose, isDarkMode, onPlayNarration, isNarrating, isTtsLoading }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [visuals, setVisuals] = useState<VisualItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'videos' | 'visuals' | 'music'>('videos');
  
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch('/api/media');
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []);
          setVisuals(data.visuals || []);
        }
      } catch (error) {
        console.error('Failed to fetch media:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  // Assessment State
  const [activeAssessment, setActiveAssessment] = useState<{
    itemId: string;
    type: 'video' | 'visual';
    currentQuestionIndex: number;
    score: number;
    showResults: boolean;
    selectedOption: number | null;
    isCorrect: boolean | null;
  } | null>(null);

  const startAssessment = (item: VideoItem | VisualItem, type: 'video' | 'visual') => {
    if (!item.assessment || item.assessment.length === 0) return;
    setActiveAssessment({
      itemId: item.id,
      type,
      currentQuestionIndex: 0,
      score: 0,
      showResults: false,
      selectedOption: null,
      isCorrect: null
    });
  };

  const handleAnswer = (question: Question, optionIndex: number) => {
    if (activeAssessment?.selectedOption !== null) return;

    const isCorrect = optionIndex === question.correctAnswer;
    setActiveAssessment(prev => prev ? {
      ...prev,
      selectedOption: optionIndex,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score
    } : null);
  };

  const nextQuestion = (totalQuestions: number) => {
    if (!activeAssessment) return;

    if (activeAssessment.currentQuestionIndex + 1 < totalQuestions) {
      setActiveAssessment(prev => prev ? {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedOption: null,
        isCorrect: null
      } : null);
    } else {
      setActiveAssessment(prev => prev ? { ...prev, showResults: true } : null);
    }
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVisuals = visuals.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-stealth-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`flex-none p-4 md:p-6 flex items-center justify-between border-b ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-registry-teal/20 flex items-center justify-center">
            {activeTab === 'videos' ? (
              <Video className="w-5 h-5 text-registry-teal" />
            ) : activeTab === 'visuals' ? (
              <ImageIcon className="w-5 h-5 text-registry-teal" />
            ) : (
              <Music className="w-5 h-5 text-registry-teal" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest">Media Library</h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeTab === 'videos' ? 'Curated Video Lectures' : activeTab === 'visuals' ? 'Visual Atlas & Diagrams' : 'SPI Physics Study Beats'}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Tabs & Search */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className={`flex p-1 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'videos' ? 'bg-registry-teal text-stealth-950 shadow-sm' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Video Lectures
              </button>
              <button
                onClick={() => setActiveTab('visuals')}
                className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'visuals' ? 'bg-registry-teal text-stealth-950 shadow-sm' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Visual Atlas
              </button>
              <button
                onClick={() => setActiveTab('music')}
                className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'music' ? 'bg-registry-teal text-stealth-950 shadow-sm' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Study Music
              </button>
            </div>

            {activeTab !== 'music' && (
              <div className="relative w-full md:w-96">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                <input 
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal ${isDarkMode ? 'bg-white/5 border border-white/10 text-white placeholder-slate-500' : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'}`}
                />
              </div>
            )}
          </div>

          {/* Content Grid */}
          {activeTab === 'music' ? (
            <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`w-full max-w-4xl p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-registry-teal flex items-center justify-center shadow-lg shadow-registry-teal/20">
                    <Music className="w-7 h-7 text-stealth-950" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">SPI Physics Study Beats</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Curated music to help you focus on ultrasound physics mastery</p>
                  </div>
                </div>
                
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/5">
                  <iframe 
                    src="https://suno.com/embed/165ac8804810a3bc1ca6bcef959c917b1c23f389516e2593b487c9a1da280e1a" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 'none' }}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} border ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <h4 className="text-xs font-black uppercase tracking-widest text-registry-teal mb-2">Deep Focus Mode</h4>
                    <p className="text-sm opacity-70 leading-relaxed">Low-tempo rhythms designed to synchronize with your study flow and reduce cognitive load.</p>
                  </div>
                  <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} border ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <h4 className="text-xs font-black uppercase tracking-widest text-registry-teal mb-2">Physics Mnemonics</h4>
                    <p className="text-sm opacity-70 leading-relaxed">Thematic tracks exploring concepts like Attenuation, Doppler, and Transducer Anatomy.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'videos' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredVideos.map(video => (
                <div 
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border-white/10 hover:border-registry-teal/50' : 'bg-white border-slate-200 hover:border-registry-teal/50 hover:shadow-lg'}`}
                >
                  <div className="relative aspect-video">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Video className="w-8 h-8 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-registry-teal text-stealth-950 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-[11px] font-bold">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1 line-clamp-1">{video.title}</h3>
                    <p className={`text-xs line-clamp-2 mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{video.description}</p>
                    {video.citation && (
                      <p className={`text-[11px] font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {video.citation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredVisuals.map(visual => (
                <div 
                  key={visual.id}
                  className={`rounded-2xl overflow-hidden border flex flex-col ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
                >
                  <div className="relative aspect-video bg-black">
                    {visual.imageUrl ? (
                      <img src={visual.imageUrl} alt={visual.title} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/80 text-registry-teal text-[11px] font-bold uppercase tracking-widest border border-registry-teal/30">
                      {visual.category}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-black mb-2 text-sm">{visual.title}</h3>
                    <p className={`text-xs leading-relaxed mb-4 flex-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{visual.description}</p>
                    
                    {visual.assessment && visual.assessment.length > 0 && (
                      <button 
                        onClick={() => startAssessment(visual, 'visual')}
                        className={`mt-auto w-full py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Take Assessment</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'videos' && filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <Video className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              <p className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No videos found matching your search.</p>
            </div>
          )}

          {activeTab === 'visuals' && filteredVisuals.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              <p className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No visuals found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-full">
            <div className="flex items-center justify-between p-4 bg-stealth-950 border-b border-white/10">
              <h3 className="font-bold text-white truncate pr-4">{activeVideo.title}</h3>
              <button 
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black flex-shrink-0">
              {activeVideo.embedUrl.startsWith('/api/video/') ? (
                activeVideo.embedUrl ? (
                  <video 
                    src={activeVideo.embedUrl} 
                    controls 
                    autoPlay 
                    className="absolute inset-0 w-full h-full"
                  />
                ) : null
              ) : (
                activeVideo.embedUrl ? (
                  <iframe 
                    src={`${activeVideo.embedUrl}?autoplay=1`} 
                    title={activeVideo.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                ) : null
              )}
            </div>
            <div className="p-6 bg-stealth-950 overflow-y-auto flex-1">
              <p className="text-slate-300 mb-6 pb-6 border-b border-white/10">{activeVideo.description}</p>
              
              {activeVideo.script && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-registry-teal font-black uppercase tracking-widest text-sm">Lecture Script</h4>
                    <div className="flex items-center space-x-2">
                      {activeVideo.assessment && activeVideo.assessment.length > 0 && (
                        <button 
                          onClick={() => startAssessment(activeVideo, 'video')}
                          className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-2 bg-registry-teal/20 text-registry-teal hover:bg-registry-teal/30 transition-all"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Assessment</span>
                        </button>
                      )}
                      {onPlayNarration && (
                        <button 
                          onClick={() => onPlayNarration(activeVideo.script, `media-${activeVideo.id}`)}
                          disabled={isTtsLoading}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-all ${isNarrating ? 'bg-registry-teal text-stealth-950 shadow-glow' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                          {isTtsLoading ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : isNarrating ? (
                            <VolumeX className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                          <span>{isNarrating ? 'Stop' : 'Narrate'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {activeVideo.script}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assessment Modal */}
      <AnimatePresence>
        {activeAssessment && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-stealth-900 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-slate-100'}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-registry-teal/20 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-registry-teal" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-sm">Knowledge Check</h3>
                    <p className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {activeAssessment.showResults ? 'Assessment Complete' : `Question ${activeAssessment.currentQuestionIndex + 1} of ${activeAssessment.type === 'video' ? videos.find(v => v.id === activeAssessment.itemId)?.assessment?.length : visuals.find(v => v.id === activeAssessment.itemId)?.assessment?.length}`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveAssessment(null)}
                  className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8">
                {activeAssessment.showResults ? (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-registry-teal/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-registry-teal" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-2">Great Job!</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        You scored <span className="text-registry-teal font-bold">{activeAssessment.score}</span> out of {activeAssessment.type === 'video' ? videos.find(v => v.id === activeAssessment.itemId)?.assessment?.length : visuals.find(v => v.id === activeAssessment.itemId)?.assessment?.length}
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveAssessment(null)}
                      className="w-full py-4 rounded-2xl bg-registry-teal text-stealth-950 font-black uppercase tracking-widest hover:shadow-glow transition-all"
                    >
                      Continue Learning
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {(() => {
                      const item = activeAssessment.type === 'video' 
                        ? videos.find(v => v.id === activeAssessment.itemId)
                        : visuals.find(v => v.id === activeAssessment.itemId);
                      const question = item?.assessment?.[activeAssessment.currentQuestionIndex];
                      
                      if (!question) return null;

                      return (
                        <>
                          <h4 className="text-lg font-bold leading-tight">{question.question}</h4>
                          <div className="space-y-3">
                            {question.options.map((option, idx) => {
                              const isSelected = activeAssessment.selectedOption === idx;
                              const isCorrect = idx === question.correctAnswer;
                              const showFeedback = activeAssessment.selectedOption !== null;

                              let variantClass = isDarkMode ? 'bg-white/5 border-white/10 hover:border-registry-teal/50' : 'bg-slate-50 border-slate-200 hover:border-registry-teal/50';
                              
                              if (showFeedback) {
                                if (isCorrect) variantClass = 'bg-green-500/20 border-green-500/50 text-green-500';
                                else if (isSelected) variantClass = 'bg-red-500/20 border-red-500/50 text-red-500';
                                else variantClass = 'opacity-50 grayscale';
                              }

                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleAnswer(question, idx)}
                                  disabled={showFeedback}
                                  className={`w-full p-4 rounded-2xl border text-left text-sm font-bold transition-all flex items-center justify-between ${variantClass}`}
                                >
                                  <span>{option}</span>
                                  {showFeedback && isCorrect && <CheckCircle2 className="w-4 h-4" />}
                                  {showFeedback && isSelected && !isCorrect && <AlertCircle className="w-4 h-4" />}
                                </button>
                              );
                            })}
                          </div>

                          {activeAssessment.selectedOption !== null && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-registry-teal/10 border-registry-teal/30' : 'bg-registry-teal/5 border-registry-teal/20'}`}
                            >
                              <p className="text-xs font-bold leading-relaxed text-registry-teal">
                                <span className="uppercase tracking-widest mr-2">Explanation:</span>
                                {question.explanation}
                              </p>
                              <button 
                                onClick={() => nextQuestion(item?.assessment?.length || 0)}
                                className="mt-4 w-full py-3 rounded-xl bg-registry-teal text-stealth-950 font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2"
                              >
                                <span>{activeAssessment.currentQuestionIndex + 1 === item?.assessment?.length ? 'See Results' : 'Next Question'}</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </motion.div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
