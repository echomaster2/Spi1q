import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, Brain, Play, Shield, 
  ChevronLeft, ChevronRight, Eye, 
  Volume2, CheckCircle, Info, RefreshCcw,
  Zap, Activity, Target, MessageSquare,
  Thermometer, Droplets, Mic2, AlertCircle,
  Lightbulb, Briefcase, GraduationCap, Sparkles
} from 'lucide-react';
import { Scenario } from '../types';
import { scenarios } from '../src/data/scenarios';
import { generateSpeech, generateText } from '../src/services/aiService';
import { decodeBase64 } from '../src/lib/audioUtils';
import { CompanionAvatar } from './CompanionAvatar';
import { 
  BeamLab,
  TransducerCrossSection,
  AliasingVisual,
  QAPhantomVisual,
  AttenuationSimulator,
  BioeffectMechanismsVisual,
  WaveParametersVisual,
  DynamicRangeVisual,
  DisplayModesVisual,
  FlowPatternsVisual,
  DopplerModalitiesVisual
} from './visuals';

interface ScenarioSimProps {
  isDarkMode?: boolean;
  profile: any;
  onUpdateProfile: (updates: any) => void;
}

export const ScenarioSim: React.FC<ScenarioSimProps> = ({ isDarkMode = true, profile, onUpdateProfile }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isInsightGenerating, setIsInsightGenerating] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [filter, setFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);

  const filteredScenarios = useMemo(() => {
    return scenarios.filter(s => {
      const matchesFilter = filter === 'all' || s.part === filter;
      const matchesSearch = s.scenario.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  const currentScenario = filteredScenarios[currentIdx] || filteredScenarios[0];

  useEffect(() => {
    setIsRevealed(false);
    setIsCorrect(null);
    setAiInsight(null);
    stopNarration();
  }, [currentIdx, filter]);

  const stopNarration = () => {
    if (activeAudio) {
      activeAudio.pause();
      setActiveAudio(null);
    }
    setIsNarrating(false);
  };

  const handleNarrate = async () => {
    if (isNarrating) {
      stopNarration();
      return;
    }

    try {
      setIsNarrating(true);
      const textToSpeak = `Scenario: ${currentScenario.scenario}. ${isRevealed ? `Answer: ${currentScenario.answer}` : ''}`;
      const base64 = await generateSpeech(textToSpeak, 'Kore');
      
      if (base64) {
        const bytes = decodeBase64(base64);
        
        // Detect MIME Type (RIFF = WAV, ID3/FFFB = MP3)
        let mimeType = 'audio/mpeg';
        if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
          mimeType = 'audio/wav';
        }

        const blob = new Blob([bytes], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        
        audio.onended = () => {
          setIsNarrating(false);
          URL.revokeObjectURL(url);
        };

        audio.onerror = (e) => {
          console.error("Audio tag error:", e);
          setIsNarrating(false);
          URL.revokeObjectURL(url);
        };

        await audio.play().catch(err => {
           console.error("Audio playback error:", err);
           setIsNarrating(false);
        });
        
        setActiveAudio(audio);
      }
    } catch (err) {
      console.error("Narration failed:", err);
      setIsNarrating(false);
    }
  };

  const nextScenario = () => {
    if (currentIdx < filteredScenarios.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(0); // Loop back
    }
  };

  const prevScenario = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else {
      setCurrentIdx(filteredScenarios.length - 1);
    }
  };

  const handleGenerateInsight = async () => {
    if (!currentScenario || isInsightGenerating) return;
    
    setIsInsightGenerating(true);
    try {
      const prompt = `Provide a detailed clinical and physical explanation for the following ultrasound scenario. Explain WHY this is the answer and provide one practical "tech tip" for a sonographer.
      Scenario: ${currentScenario.scenario}
      Answer: ${currentScenario.answer}`;
      
      const insight = await generateText(prompt, "You are Harvey, an elite AI Ultrasound Physics Mentor (SPI Master).");
      setAiInsight(insight);
    } catch (error) {
      console.error("AI Insight failed:", error);
    } finally {
      setIsInsightGenerating(false);
    }
  };

  const handleChallengeResult = (correct: boolean) => {
    setIsCorrect(correct);
    setIsRevealed(true);
    
    if (correct && currentScenario) {
      const completed = profile?.scenariosCompleted || [];
      if (!completed.includes(currentScenario.id)) {
        onUpdateProfile({ scenariosCompleted: [...completed, currentScenario.id] });
        // Maybe update a quest too? updateQuestProgress('q3', 1);
      }
    }
  };

  const renderVisual = () => {
    if (!currentScenario) return null;

    // Specific mapping
    const sid = currentScenario.id;
    
    // Bioeffects
    if (sid === 's1-1' || sid === 's1-2' || sid === 's1-13' || currentScenario.part === 4) return <BioeffectMechanismsVisual />;
    
    // Waves
    if (sid === 's1-5' || sid === 's1-7' || sid === 's1-8' || sid === 's1-15' || sid === 's1-23') return <WaveParametersVisual />;
    
    // Contrast/Digital
    if (sid === 's1-25' || sid === 's2-18') return <DynamicRangeVisual />;
    
    // Display modes
    if (sid === 's2-19' || sid === 's2-20' || sid === 's2-21') return <DisplayModesVisual />;

    // Hemodynamics
    if (currentScenario.part === 3) {
      if (sid === 's3-1' || sid === 's3-15') return <AliasingVisual />;
      if (sid === 's3-3') return <FlowPatternsVisual />;
      return <DopplerModalitiesVisual />;
    }

    // Default by part
    switch(currentScenario.part) {
      case 1: return <AttenuationSimulator />;
      case 2: return <TransducerCrossSection />;
      case 4: return <QAPhantomVisual />;
      default: return <BeamLab />;
    }
  };

  const partNames = [
    "Physics Principles",
    "Transducers & Imaging", 
    "Hemodynamics & Doppler",
    "QA & Patient Care"
  ];

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-500 overflow-hidden relative`}>
      {/* Header Area */}
      <div className="shrink-0 p-6 md:p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-20 bg-slate-950/80 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-registry-teal rounded-xl flex items-center justify-center shadow-glow">
                <Stethoscope className="w-6 h-6 text-stealth-950" />
             </div>
             <div>
                <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">Clinical Simulation Hall</h2>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-registry-teal/70">Neural Case Studies v1.0</p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsChallengeMode(!isChallengeMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${isChallengeMode ? 'bg-registry-amber/20 border-registry-amber text-registry-amber shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-stealth-900 border-white/10 text-slate-500 hover:text-slate-300'}`}
          >
            <Zap className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-widest">Challenge Mode</span>
          </button>
          <div className="flex bg-stealth-900 rounded-2xl p-1 border border-white/10">
            <button 
              onClick={() => { setFilter('all'); setCurrentIdx(0); }}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              All Cases
            </button>
            {[1, 2, 3, 4].map(p => (
              <button 
                key={p}
                onClick={() => { setFilter(p); setCurrentIdx(0); }}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === p ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Part {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Experience */}
      <div className="flex-1 overflow-hidden relative flex flex-col xl:flex-row">
        {/* Left Side: Scenario Details */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 space-y-8 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentScenario?.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-6 md:space-y-10"
            >
              {/* Scenario Card */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center space-x-3 text-registry-teal">
                   <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
                   <span className="text-[11px] font-black uppercase tracking-[0.2em]">{currentScenario?.category}</span>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-xl md:text-2xl lg:text-4xl font-black italic uppercase tracking-tighter leading-tight relative">
                    <span className="hidden md:block text-registry-teal/20 absolute -left-12 -top-4 text-7xl select-none">"</span>
                    {currentScenario?.scenario}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-2 md:pt-4">
                  <button 
                    onClick={handleNarrate}
                    className={`flex items-center space-x-3 px-5 md:px-6 py-3 md:py-4 rounded-[1.25rem] md:rounded-2xl font-black uppercase tracking-widest text-[11px] md:text-[12px] transition-all ${isNarrating ? 'bg-registry-rose text-white shadow-glow-rose' : 'bg-stealth-900 text-slate-300 border border-white/10 hover:bg-stealth-800'}`}
                  >
                    {isNarrating ? <Zap className="w-3 h-3 md:w-4 md:h-4 animate-pulse" /> : <Mic2 className="w-3 h-3 md:w-4 md:h-4" />}
                    <span>{isNarrating ? "Playing" : "Narrate"}</span>
                  </button>

                  <button 
                    onClick={() => setIsRevealed(!isRevealed)}
                    className={`flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 rounded-[1.25rem] md:rounded-2xl font-black uppercase tracking-widest text-[11px] md:text-[12px] transition-all ${isRevealed ? 'bg-registry-teal text-stealth-950 shadow-glow' : 'bg-white text-stealth-950 hover:scale-105'}`}
                  >
                    {isRevealed ? <RefreshCcw className="w-3 h-3 md:w-4 md:h-4" /> : <Eye className="w-3 h-3 md:w-4 md:h-4" />}
                    <span>{isRevealed ? "Hide" : "Reveal Resolution"}</span>
                  </button>

                  {isChallengeMode && !isRevealed && (
                    <div className="flex items-center space-x-2 bg-stealth-900/50 p-2 rounded-[1.25rem] border border-white/10">
                       <span className="hidden sm:inline text-[11px] font-black uppercase text-slate-500 ml-2">Diagnosis:</span>
                       <button onClick={() => handleChallengeResult(true)} className="p-2 hover:bg-green-500/20 text-green-500 transition-all rounded-xl"><CheckCircle className="w-5 h-5" /></button>
                       <button onClick={() => handleChallengeResult(false)} className="p-2 hover:bg-red-500/20 text-red-500 transition-all rounded-xl"><RefreshCcw className="w-5 h-5 rotate-45" /></button>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Area */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-registry-teal/10 border border-registry-teal/20 relative overflow-hidden group shadow-premium"
                  >
                    <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
                    <div className="relative z-10 space-y-4 md:space-y-6">
                      <div className="flex items-center space-x-3">
                         <div className="p-2 bg-registry-teal rounded-xl">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-stealth-950" />
                         </div>
                         <h4 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">Resolution</h4>
                         {isCorrect !== null && (
                            <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded border ${isCorrect ? 'bg-green-500/20 border-green-500/40 text-green-500' : 'bg-red-500/20 border-red-500/40 text-red-500'}`}>
                              {isCorrect ? 'Match' : 'Mismatch'}
                            </span>
                         )}
                      </div>
                      
                      <p className="text-sm md:text-xl font-medium leading-relaxed text-slate-200">
                        {currentScenario?.answer}
                      </p>

                      <div className="flex gap-4">
                         <button 
                           onClick={handleGenerateInsight}
                           disabled={isInsightGenerating}
                           className="flex items-center space-x-2 text-[11px] font-black uppercase text-registry-amber hover:text-white transition-all underline underline-offset-8"
                         >
                            {isInsightGenerating ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                            <span>{isInsightGenerating ? 'Analyzing Case...' : 'Deep AI Insight'}</span>
                         </button>
                      </div>

                      <AnimatePresence>
                         {aiInsight && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="mt-6 p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4"
                            >
                               <div className="flex items-center space-x-2 text-registry-teal">
                                  <Sparkles className="w-4 h-4" />
                                  <span className="text-[11px] font-black uppercase tracking-widest">Extended Neural Data</span>
                               </div>
                               <div className="text-xs text-slate-300 leading-relaxed italic whitespace-pre-wrap">
                                  {aiInsight}
                               </div>
                            </motion.div>
                         )}
                      </AnimatePresence>

                      <div className="pt-6 border-t border-registry-teal/20 flex items-start space-x-6">
                         <div className="scale-75 -mx-4 -my-4 shrink-0">
                             <CompanionAvatar state="idle" skin="stealth" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[11px] font-black uppercase text-registry-teal tracking-widest">Harvey's Clinical Pearl</p>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed italic">
                              This scenario tests your understanding of the relationship between {currentScenario?.category.toLowerCase()}. Always prioritize ALARA while maintaining diagnostic quality!
                            </p>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Visual Context & Navigation */}
        <div className="w-full lg:w-[450px] shrink-0 border-l border-white/5 bg-slate-900/50 backdrop-blur-3xl overflow-y-auto p-6 md:p-10 flex flex-col gap-8 scrollbar-hide">
          <div className="space-y-2">
            <h5 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center">
               <Eye className="w-3 h-3 mr-2" /> Visual Diagnostics
            </h5>
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
               {renderVisual()}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <h5 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em]">Neural Queue</h5>
                <span className="text-[11px] font-bold text-registry-teal">{currentIdx + 1} / {filteredScenarios.length}</span>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={prevScenario}
                   className="flex items-center justify-center space-x-3 p-5 rounded-3xl bg-stealth-950 border border-white/5 hover:border-registry-teal/30 transition-all text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Previous Case</span>
                </button>
                <button 
                   onClick={nextScenario}
                   className="flex items-center justify-center space-x-3 p-5 rounded-3xl bg-stealth-950 border border-white/5 hover:border-registry-teal/30 transition-all text-slate-400 hover:text-white"
                >
                  <span className="text-[11px] font-black uppercase tracking-widest">Next Case</span>
                  <ChevronRight className="w-6 h-6" />
                </button>
             </div>

             <div className="space-y-2">
                <h5 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em]">Related Schemas</h5>
                <div className="grid grid-cols-1 gap-2">
                   {[
                     { label: "Thermal Bioeffects", status: "Active" },
                     { label: "ALARA Protocol", status: "Operational" },
                     { label: "Acoustic Variables", status: "Syncing" }
                   ].map((schema, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-white/5">
                        <div className="flex items-center space-x-3">
                           <Shield className="w-4 h-4 text-registry-teal/50" />
                           <span className="text-[11px] font-black uppercase italic">{schema.label}</span>
                        </div>
                        <span className="text-[11px] font-black uppercase text-slate-600 tracking-widest">{schema.status}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="shrink-0 h-2 w-full bg-stealth-950 relative">
         <motion.div 
           className="absolute inset-y-0 left-0 bg-registry-teal shadow-[0_0_10px_#00f2ea]"
           initial={{ width: 0 }}
           animate={{ width: `${((currentIdx + 1) / filteredScenarios.length) * 100}%` }}
         />
      </div>
    </div>
  );
};
