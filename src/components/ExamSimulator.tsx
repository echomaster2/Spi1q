import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Timer, 
  CheckCircle2, AlertCircle, RotateCcw, 
  Trophy, BarChart3, Flag, X, 
  Play, Pause, Volume2, Loader2,
  Brain, Sparkles, BookOpen, Zap, Bot, Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CompanionAvatar } from './CompanionAvatar';
import { FullscreenToggle } from './FullscreenToggle';
import { ExamQuestion, ExamResults } from '../types';
import { MOCK_EXAM_QUESTIONS } from '../examData';
import { CLINICAL_TIPS } from '../constants/clinicalTips';

interface ExamSimulatorProps {
  onClose: () => void;
  onPlayNarration?: () => void;
  isNarrating?: boolean;
  isTtsLoading?: boolean;
  isDarkMode?: boolean;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({ 
  onClose, 
  onPlayNarration, 
  isNarrating, 
  isTtsLoading,
  isDarkMode
}) => {
  const [step, setStep] = useState<'intro' | 'exam' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(110).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(new Array(110).fill(false));
  const [timeLeft, setTimeLeft] = useState(120 * 60); 
  const [isPaused, setIsPaused] = useState(false);
  const [isRegistryMode, setIsRegistryMode] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState<ExamResults | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (step === 'exam' && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    if (timeLeft === 0 && step === 'exam') {
      handleSubmit();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, isPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStep('exam');
    setTimeLeft(120 * 60);
    setAnswers(new Array(110).fill(null));
    setFlagged(new Array(110).fill(false));
    setCurrentIndex(0);
    setHintsUsed(0);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const toggleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentIndex] = !newFlagged[currentIndex];
    setFlagged(newFlagged);
  };

  const useHint = () => {
    if (hintsUsed < 3) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      setTimeout(() => setShowHint(false), 5000);
    }
  };

  const handleSubmit = () => {
    const total = MOCK_EXAM_QUESTIONS.length;
    let correctCount = 0;
    const breakdown: { [title: string]: { correct: number; total: number } } = {};

    MOCK_EXAM_QUESTIONS.forEach((q, idx) => {
      if (!breakdown[q.moduleTitle]) {
        breakdown[q.moduleTitle] = { correct: 0, total: 0 };
      }
      breakdown[q.moduleTitle].total++;
      
      if (answers[idx] === q.correct) {
        correctCount++;
        breakdown[q.moduleTitle].correct++;
      }
    });

    const score = Math.round((correctCount / total) * 100);
    setResults({
      date: new Date().toISOString(),
      score,
      total,
      timeTaken: 120 * 60 - timeLeft,
      moduleBreakdown: breakdown,
      passed: score >= 75 
    });
    setStep('results');
  };

  const currentQuestion = MOCK_EXAM_QUESTIONS[currentIndex];

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-stealth-950' : 'bg-white'} transition-colors duration-500 overflow-hidden relative z-[150]`}>
      <header className={`p-4 md:p-6 ${isDarkMode ? 'bg-stealth-950 border-white/10' : 'bg-slate-900 border-slate-800'} text-white flex justify-between items-center shrink-0 transition-colors duration-300 border-b`}>
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 bg-registry-rose rounded-xl flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-base md:text-lg font-black tracking-tight italic uppercase leading-none">SPI MOCK EXAM</h4>
            <p className="text-[11px] opacity-70 font-black uppercase tracking-widest mt-0.5">Simulation Environment v2.0 {isRegistryMode && '| REGISTRY MODE ACTIVE'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {step === 'exam' && (
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 ${timeLeft < 300 ? 'border-registry-rose text-registry-rose animate-pulse' : isDarkMode ? 'border-white/10 text-white/70' : 'border-slate-200 text-slate-600'}`}>
              <Timer className="w-4 h-4" />
              <span className="font-mono font-black text-sm">{formatTime(timeLeft)}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {onPlayNarration && (
              <button 
                onClick={onPlayNarration} 
                disabled={isTtsLoading}
                className={`p-2 rounded-xl transition-all ${isNarrating ? 'bg-registry-rose animate-pulse' : 'hover:bg-white/10'}`}
              >
                {isTtsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
            <FullscreenToggle className={`${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white/70' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'} border-none`} iconClassName="w-5 h-5" />
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-stealth-950' : 'bg-slate-50'} p-4 md:p-8 scroll-smooth`}>
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-8 py-8"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-registry-rose/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-registry-rose" />
                </div>
                <h2 className={`text-3xl md:text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Registry Ready?</h2>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} font-medium`}>Test your mastery of ultrasound physics in a timed, high-stakes simulation environment.</p>
              </div>

              <div className={`p-6 rounded-[2rem] border shadow-sm flex items-center justify-between ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-200'}`}>
                <div>
                  <h4 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Registry Simulation Mode</h4>
                  <p className={`text-[11px] uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No pausing, no back-tracking, strict timing.</p>
                </div>
                <button 
                  onClick={() => setIsRegistryMode(!isRegistryMode)}
                  className={`w-12 h-6 rounded-full transition-all relative ${isRegistryMode ? 'bg-registry-rose' : isDarkMode ? 'bg-stealth-800' : 'bg-slate-200'}`}
                >
                  <motion.div 
                    animate={{ x: isRegistryMode ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              {/* Mission Manifesto */}
              <div className={`p-8 rounded-[2.5rem] border text-center space-y-6 shadow-2xl ${isDarkMode ? 'bg-stealth-900 border-white/10' : 'bg-white border-slate-200'}`}>
                 <div className="space-y-2">
                    <h3 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter leading-none bg-gradient-to-r from-registry-rose via-registry-teal to-registry-rose bg-clip-text text-transparent">Stay. Breathe.</h3>
                    <p className="text-registry-teal text-[11px] font-black uppercase tracking-[0.3em]">You're allowed to make mistakes</p>
                 </div>
                 <p className={`text-xs md:text-sm font-bold italic leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    "Our job is to prepare you. Your job is to remember how we fail you so that when it is your turn, you do better."
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, label: '10 High-Yield Questions', desc: 'Covering all SPI domains' },
                  { icon: Timer, label: '30 Minute Limit', desc: 'Simulated pressure' },
                  { icon: CheckCircle2, label: '75% Pass Mark', desc: 'Registry standard' },
                  { icon: BarChart3, label: 'Detailed Breakdown', desc: 'Identify weak nodes' },
                ].map((item, i) => (
                  <div key={i} className={`p-6 rounded-3xl border shadow-sm flex items-start space-x-4 ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-stealth-950' : 'bg-slate-50'}`}>
                      <item.icon className="w-5 h-5 text-registry-rose" />
                    </div>
                    <div>
                      <h4 className={`font-black uppercase text-xs tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.label}</h4>
                      <p className={`text-[11px] uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`border p-6 rounded-3xl space-y-3 ${isDarkMode ? 'bg-registry-rose/5 border-registry-rose/20' : 'bg-registry-rose/5 border-registry-rose/10'}`}>
                <div className="flex items-center space-x-2 text-registry-rose">
                  <AlertCircle className="w-5 h-5" />
                  <h4 className="font-black uppercase text-sm italic">Simulation Rules</h4>
                </div>
                <ul className={`text-xs space-y-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <li>• Once started, the timer cannot be paused.</li>
                  <li>• You can flag questions for review and return to them.</li>
                  <li>• Results are calculated instantly upon submission.</li>
                  <li>• Passing this mock suggests high registry readiness.</li>
                </ul>
              </div>

              {/* Clinical Wisdom for Exam */}
              <div className={`p-6 rounded-3xl border atmosphere-bg glass-morphism relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Stethoscope className="w-12 h-12 text-registry-teal" />
                </div>
                <div className="relative z-10 flex items-start space-x-4">
                  <div className="p-3 bg-registry-teal/10 rounded-2xl">
                    <Zap className="w-5 h-5 text-registry-teal" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Exam Pro-Tip</h4>
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} italic mt-1`}>
                      {CLINICAL_TIPS.find(t => t.category === 'Physics')?.content || CLINICAL_TIPS[0].content}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleStart}
                className="w-full py-6 bg-registry-rose hover:bg-registry-rose/90 text-white rounded-[2rem] font-black italic uppercase tracking-widest shadow-xl shadow-registry-rose/20 transition-all flex items-center justify-center space-x-3 group"
              >
                <span>Initialize Simulation</span>
                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 'exam' && (
            <motion.div 
              key="exam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Question Area */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-registry-rose text-white text-[11px] font-black uppercase rounded-full tracking-widest">Question {currentIndex + 1} of {MOCK_EXAM_QUESTIONS.length}</span>
                      <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{currentQuestion.moduleTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!isRegistryMode && (
                        <button 
                          onClick={useHint}
                          disabled={hintsUsed >= 3}
                          className="flex items-center space-x-2 px-4 py-2 bg-registry-teal/10 text-registry-teal rounded-xl hover:bg-registry-teal/20 transition-all disabled:opacity-30"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span className="text-[11px] font-black uppercase tracking-widest">Harvey's Hint ({3 - hintsUsed})</span>
                        </button>
                      )}
                      <button 
                        onClick={toggleFlag}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${flagged[currentIndex] ? 'bg-registry-amber text-white' : isDarkMode ? 'bg-stealth-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                      >
                        <Flag className={`w-4 h-4 ${flagged[currentIndex] ? 'fill-current' : ''}`} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{flagged[currentIndex] ? 'Flagged' : 'Flag for Review'}</span>
                      </button>
                    </div>
                  </div>

                  <div className={`p-8 md:p-12 rounded-[3rem] border shadow-xl relative ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-200'}`}>
                    <AnimatePresence>
                      {showHint && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -top-16 left-0 right-0 bg-registry-teal text-white p-4 rounded-2xl text-xs font-bold shadow-xl z-20 flex items-center space-x-4"
                        >
                          <div className="scale-75 -mx-8 shrink-0">
                            <CompanionAvatar state="speaking" isDarkMode={isDarkMode} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Bot className="w-4 h-4" />
                              <span className="uppercase text-[11px] font-black tracking-widest">Harvey's Neural Link</span>
                            </div>
                            {currentQuestion.explanation.split('.')[0]}.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <h3 className={`text-lg md:text-xl font-bold leading-relaxed mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {currentQuestion.question}
                    </h3>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          className={`w-full p-6 rounded-2xl text-left font-bold text-sm transition-all border-2 flex items-center justify-between group ${
                            answers[currentIndex] === idx 
                              ? 'bg-registry-rose border-registry-rose text-white shadow-lg shadow-registry-rose/20' 
                              : isDarkMode ? 'bg-stealth-950 border-transparent hover:border-registry-rose/30 text-slate-400' : 'bg-slate-50 border-transparent hover:border-registry-rose/30 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${answers[currentIndex] === idx ? 'bg-white/20' : isDarkMode ? 'bg-stealth-800' : 'bg-slate-200'}`}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span>{option}</span>
                          </div>
                          {answers[currentIndex] === idx && <CheckCircle2 className="w-5 h-5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    {!isRegistryMode ? (
                      <button 
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest border disabled:opacity-30 transition-all flex items-center space-x-2 ${isDarkMode ? 'bg-stealth-900 text-slate-400 border-white/5' : 'bg-white text-slate-600 border-slate-200'}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentIndex === MOCK_EXAM_QUESTIONS.length - 1 ? (
                      <button 
                        onClick={handleSubmit}
                        className="px-12 py-4 bg-registry-rose text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-registry-rose/20 hover:bg-registry-rose/90 transition-all"
                      >
                        Submit Exam
                      </button>
                    ) : (
                      <button 
                        onClick={() => setCurrentIndex(prev => Math.min(MOCK_EXAM_QUESTIONS.length - 1, prev + 1))}
                        className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center space-x-2 ${isDarkMode ? 'bg-white text-stealth-900' : 'bg-slate-900 text-white'}`}
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Navigation Grid */}
                {!isRegistryMode && (
                  <div className="w-full md:w-64 space-y-6">
                    <div className={`p-6 rounded-[2rem] border shadow-sm ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-200'}`}>
                      <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center space-x-2">
                        <BarChart3 className="w-3 h-3" />
                        <span>Progress Map</span>
                      </h4>
                      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                        {new Array(110).fill(0).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-black transition-all relative ${
                              currentIndex === idx 
                                ? 'bg-registry-rose text-white ring-4 ring-registry-rose/20' 
                                : answers[idx] !== null 
                                  ? isDarkMode ? 'bg-white text-stealth-900' : 'bg-slate-900 text-white'
                                  : isDarkMode ? 'bg-stealth-800 text-slate-400' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {idx + 1}
                            {flagged[idx] && (
                              <div className={`absolute -top-1 -right-1 w-2 h-2 bg-registry-amber rounded-full border-2 ${isDarkMode ? 'border-stealth-900' : 'border-white'}`} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={`border p-6 rounded-[2rem] space-y-3 ${isDarkMode ? 'bg-registry-amber/5 border-registry-amber/20' : 'bg-registry-amber/5 border-registry-amber/10'}`}>
                      <div className="flex items-center space-x-2 text-registry-amber">
                        <Flag className="w-4 h-4" />
                        <h4 className="font-black uppercase text-[11px] tracking-widest">Review Summary</h4>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-black uppercase">
                        <span className="text-slate-400">Answered</span>
                        <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{answers.filter(a => a !== null).length} / {MOCK_EXAM_QUESTIONS.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-black uppercase">
                        <span className="text-slate-400">Flagged</span>
                        <span className="text-registry-amber">{flagged.filter(f => f).length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 'results' && results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto space-y-8 py-8"
            >
              <div className={`p-8 md:p-12 rounded-[3rem] border shadow-2xl text-center space-y-6 relative overflow-hidden ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-200'}`}>
                <div className={`absolute inset-0 opacity-5 ${results.passed ? 'bg-registry-teal' : 'bg-registry-rose'}`} />
                
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${results.passed ? 'bg-registry-teal/10 text-registry-teal' : 'bg-registry-rose/10 text-registry-rose'}`}>
                  {results.passed ? <Trophy className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                </div>

                <div className="space-y-2">
                  <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {results.passed ? 'Registry Mastered' : 'Artifact Detected'}
                  </h2>
                  <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
                    {results.passed 
                      ? 'Your physics knowledge is at board-certified levels.' 
                      : 'More synaptic reinforcement is required in key modules.'}
                  </p>
                </div>

                <div className="flex justify-center items-center space-x-12 py-8">
                  <div className="text-center">
                    <div className={`text-5xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{results.score}%</div>
                    <div className="text-[11px] font-black uppercase text-slate-400 tracking-widest mt-1">Final Score</div>
                  </div>
                  <div className={`w-px h-16 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <div className="text-center">
                    <div className={`text-5xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatTime(results.timeTaken)}</div>
                    <div className="text-[11px] font-black uppercase text-slate-400 tracking-widest mt-1">Time Elapsed</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {Object.entries(results.moduleBreakdown).map(([title, data]) => {
                    const d = data as { correct: number; total: number };
                    return (
                      <div key={title} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest truncate max-w-[150px]">{title}</span>
                          <span className={`text-[11px] font-black ${d.correct / d.total >= 0.75 ? 'text-registry-teal' : 'text-registry-rose'}`}>
                            {Math.round((d.correct / d.total) * 100)}%
                          </span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                          <div 
                            className={`h-full transition-all duration-1000 ${d.correct / d.total >= 0.75 ? 'bg-registry-teal' : 'bg-registry-rose'}`}
                            style={{ width: `${(d.correct / d.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Post-Exam Clinical Tip */}
                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-registry-teal/5 border-registry-teal/20' : 'bg-registry-teal/5 border-registry-teal/10'} text-left relative overflow-hidden group/pearl`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/pearl:opacity-10 transition-opacity">
                    <Stethoscope className="w-16 h-16 text-registry-teal" />
                  </div>
                  <div className="relative z-10 flex items-start space-x-4">
                    <div className="p-3 bg-registry-teal/10 rounded-2xl shadow-lg shadow-registry-teal/10">
                      <Zap className="w-5 h-5 text-registry-teal" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Neural Reinforcement</h4>
                        <span className="text-[11px] font-black uppercase text-registry-teal tracking-widest bg-registry-teal/10 px-2 py-0.5 rounded-full">Clinical Wisdom</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} italic font-medium`}>
                        {CLINICAL_TIPS[Math.floor(Math.random() * CLINICAL_TIPS.length)].content}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-8">
                  <button 
                    onClick={handleStart}
                    className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center space-x-2 ${isDarkMode ? 'bg-white text-stealth-900' : 'bg-slate-900 text-white'}`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Simulation</span>
                  </button>
                  <button 
                    onClick={onClose}
                    className="flex-1 py-5 bg-registry-rose text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-registry-rose/20 hover:bg-registry-rose/90 transition-all"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      {step === 'exam' && !isRegistryMode && (
        <footer className={`p-4 md:p-6 border-t flex justify-between items-center text-white ${isDarkMode ? 'bg-stealth-950 border-white/10' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[11px] font-black uppercase text-slate-400">
              <div className="w-2 h-2 bg-registry-rose rounded-full" />
              <span>Live Simulation</span>
            </div>
          </div>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`px-6 py-2 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all flex items-center space-x-2 ${isDarkMode ? 'bg-stealth-800 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </footer>
      )}

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-[200] backdrop-blur-xl flex items-center justify-center ${isDarkMode ? 'bg-stealth-950/90' : 'bg-white/90'}`}
          >
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-registry-rose/10 rounded-[2.5rem] flex items-center justify-center mx-auto animate-pulse">
                <Pause className="w-10 h-10 text-registry-rose" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Simulation Paused</h3>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Neural link suspended</p>
              </div>
              <button 
                onClick={() => setIsPaused(false)}
                className="px-12 py-5 bg-registry-rose text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-registry-rose/30 hover:bg-registry-rose/90 transition-all"
              >
                Resume Master Protocol
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
