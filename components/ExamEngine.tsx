
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Timer, CheckCircle2, XCircle, ChevronRight, 
  ChevronLeft, Award, RefreshCw, AlertCircle, 
  Brain, Target, Clock, ShieldCheck, ArrowRight,
  BarChart3, BookOpen, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdvancedQuestion, UserProfile, ExamResults } from '../types';
import { generateExamQuestions } from '../src/services/aiService';

interface ExamEngineProps {
  profile: UserProfile | null;
  isDarkMode: boolean;
  onComplete: (results: ExamResults) => void;
  onClose: () => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({ 
  profile, isDarkMode, onComplete, onClose 
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'active' | 'finished'>('idle');
  const [questions, setQuestions] = useState<AdvancedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [results, setResults] = useState<ExamResults | null>(null);

  const EXAM_DURATION = 1200; // 20 minutes for 10 questions (simulated)

  const startExam = async () => {
    if (!profile) return;
    setStatus('loading');
    try {
      const generated = await generateExamQuestions(profile, 10);
      if (generated && generated.length > 0) {
        setQuestions(generated);
        setStartTime(Date.now());
        setTimeRemaining(EXAM_DURATION);
        setStatus('active');
        setCurrentIndex(0);
        setAnswers({});
      } else {
        throw new Error("Failed to generate questions");
      }
    } catch (err) {
      console.error("Exam start error:", err);
      setStatus('idle');
      alert("System error: Could not initialize exam registry. Please try again.");
    }
  };

  const finishExam = useCallback(() => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    let correctCount = 0;
    const breakdown: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
      const topic = q.moduleId || 'General Physics';
      if (!breakdown[topic]) breakdown[topic] = { correct: 0, total: 0 };
      breakdown[topic].total++;

      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
        breakdown[topic].correct++;
      }
    });

    const score = (correctCount / questions.length) * 100;
    const finalResults: ExamResults = {
      score,
      total: questions.length,
      timeTaken,
      moduleBreakdown: breakdown,
      passed: score >= 75 // SPI pass mark is usually high
    };

    setResults(finalResults);
    setStatus('finished');
    onComplete(finalResults);
  }, [questions, answers, startTime, onComplete]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'active' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, timeRemaining, finishExam]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex: number) => {
    if (status !== 'active') return;
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: optionIndex }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Confirm finish
      if (Object.keys(answers).length < questions.length) {
        if (confirm("You have unanswered questions. Are you sure you want to finish?")) {
          finishExam();
        }
      } else {
        finishExam();
      }
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (status === 'idle') {
    return (
      <div className={`flex flex-col h-full ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} p-8 items-center justify-center text-center space-y-8`}>
        <div className="w-24 h-24 bg-teal-600/20 rounded-[2.5rem] flex items-center justify-center mb-4">
          <Award className="w-12 h-12 text-teal-500" />
        </div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">SPI Mock Registry</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs leading-relaxed">
            Simulate the high-pressure environment of the ARDMS SPI Exam. 10 AI-generated questions covering all core physics domains.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <Clock className="w-5 h-5 text-teal-500 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">20 Minutes</p>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <Target className="w-5 h-5 text-blue-500 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">75% to Pass</p>
          </div>
        </div>
        <div className="flex flex-col w-full max-w-sm gap-3">
          <button 
            onClick={startExam}
            className="w-full py-5 bg-teal-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-600/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Initialize Exam
          </button>
          <button 
            onClick={onClose}
            className={`w-full py-4 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded-[2rem] font-black uppercase tracking-widest text-[10px]`}
          >
            Return to Study
          </button>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className={`flex flex-col h-full ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} items-center justify-center space-y-6`}>
        <div className="relative">
          <RefreshCw className="w-16 h-16 text-teal-500 animate-spin" />
          <Brain className="absolute inset-0 m-auto w-6 h-6 text-teal-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">Generating Registry Nodes</h3>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest animate-pulse">Synthesizing unique physics scenarios...</p>
        </div>
      </div>
    );
  }

  if (status === 'active') {
    const q = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className={`flex flex-col h-full ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
        <header className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-black italic uppercase tracking-tight">Question {currentIndex + 1} of {questions.length}</h4>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  className="h-full bg-teal-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${timeRemaining < 300 ? 'bg-registry-rose/20 text-registry-rose' : 'bg-teal-500/10 text-teal-500'}`}>
            <Timer className="w-4 h-4" />
            <span className="text-sm font-black italic tracking-tighter">{formatTime(timeRemaining)}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className={`p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-200'} border relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain className="w-24 h-24" />
              </div>
              <span className="inline-block px-3 py-1 bg-teal-600/10 text-teal-500 rounded-lg text-[8px] font-black uppercase tracking-widest mb-4">
                {q.type} Question
              </span>
              <h3 className="text-xl md:text-2xl font-bold leading-relaxed">
                {q.question}
              </h3>
            </div>

            <div className="grid gap-4">
              {q.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                    answers[q.id] === idx 
                      ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-600/20' 
                      : `${isDarkMode ? 'bg-slate-900 border-white/5 hover:border-teal-500/30' : 'bg-white border-slate-100 hover:border-teal-500/30'} text-slate-400`
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic ${
                      answers[q.id] === idx ? 'bg-white/20' : isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`font-bold ${answers[q.id] === idx ? 'text-white' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {option}
                    </span>
                  </div>
                  {answers[q.id] === idx && <CheckCircle2 className="w-5 h-5 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </main>

        <footer className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-md flex justify-between items-center">
          <button 
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
              currentIndex === 0 ? 'opacity-30' : 'hover:bg-white/5'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button 
            onClick={nextQuestion}
            className="flex items-center space-x-2 px-8 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-teal-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span>{currentIndex === questions.length - 1 ? 'Finish Exam' : 'Next Question'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      </div>
    );
  }

  if (status === 'finished' && results) {
    return (
      <div className={`flex flex-col h-full ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} overflow-y-auto`}>
        <div className="p-8 md:p-12 max-w-4xl mx-auto w-full space-y-12">
          <div className="text-center space-y-4">
            <div className={`w-24 h-24 mx-auto rounded-[2.5rem] flex items-center justify-center ${results.passed ? 'bg-teal-500/20' : 'bg-registry-rose/20'}`}>
              {results.passed ? <Award className="w-12 h-12 text-teal-500" /> : <AlertCircle className="w-12 h-12 text-registry-rose" />}
            </div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">
              {results.passed ? 'Registry Qualified' : 'Study Required'}
            </h2>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Exam Results Analysis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'} text-center space-y-2`}>
              <BarChart3 className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <p className="text-4xl font-black italic tracking-tighter">{Math.round(results.score)}%</p>
              <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Final Score</p>
            </div>
            <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'} text-center space-y-2`}>
              <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-4xl font-black italic tracking-tighter">{results.total - (results.total * (results.score/100))}/{results.total}</p>
              <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Incorrect</p>
            </div>
            <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'} text-center space-y-2`}>
              <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-4xl font-black italic tracking-tighter">{Math.floor(results.timeTaken / 60)}m {results.timeTaken % 60}s</p>
              <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Time Taken</p>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-2">Topic Breakdown</h5>
            <div className="grid gap-4">
              {Object.entries(results.moduleBreakdown).map(([topic, data], i) => (
                <div key={i} className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'} flex items-center justify-between`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data.correct === data.total ? 'bg-teal-500/10 text-teal-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">{topic}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{data.correct}/{data.total} Correct</p>
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${data.correct === data.total ? 'bg-teal-500' : 'bg-amber-500'}`}
                      style={{ width: `${(data.correct / data.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-2">Review Questions</h5>
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={i} className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'} space-y-6`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Question {i + 1}</span>
                      <h4 className="text-lg font-bold leading-relaxed">{q.question}</h4>
                    </div>
                    {answers[q.id] === q.correctAnswer ? (
                      <CheckCircle2 className="w-6 h-6 text-teal-500 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-registry-rose shrink-0" />
                    )}
                  </div>

                  <div className="grid gap-2">
                    {q.options?.map((opt, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-xl text-xs font-bold flex items-center space-x-3 ${
                          idx === q.correctAnswer 
                            ? 'bg-teal-500/10 border border-teal-500/20 text-teal-500' 
                            : idx === answers[q.id] 
                              ? 'bg-registry-rose/10 border border-registry-rose/20 text-registry-rose'
                              : isDarkMode ? 'bg-slate-950 text-slate-500' : 'bg-slate-50 text-slate-400'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black italic ${
                          idx === q.correctAnswer ? 'bg-teal-500 text-white' : 'bg-slate-800'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-teal-500/5' : 'bg-teal-50'} border border-teal-500/10 space-y-2`}>
                    <div className="flex items-center space-x-2 text-teal-500">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Explanation</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed opacity-80">{q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-8">
            <button 
              onClick={startExam}
              className="w-full py-5 bg-teal-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-600/20 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake New Exam</span>
            </button>
            <button 
              onClick={onClose}
              className={`w-full py-4 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded-[2rem] font-black uppercase tracking-widest text-[10px]`}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
