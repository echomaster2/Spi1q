import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, Target, RefreshCw, Terminal, Activity } from 'lucide-react';
import { AdvancedQuestion } from '../types';

interface AdvancedQuizProps {
  question: AdvancedQuestion;
  onComplete: () => void;
  isDarkMode?: boolean;
}

export const AdvancedQuiz: React.FC<AdvancedQuizProps> = ({ question, onComplete, isDarkMode }) => {
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [formulaInputs, setFormulaInputs] = useState<Record<string, string>>({});

  const checkAnswer = () => {
    let correct = false;
    if (question.type === 'mcq') {
      correct = userAnswer === question.correctAnswer;
    } else if (question.type === 'labeling') {
      correct = question.labelData?.every(l => labels[l.id]?.toLowerCase().trim() === l.label.toLowerCase().trim()) ?? false;
    } else if (question.type === 'formula') {
      const formula = question.correctFormula || {};
      correct = Object.keys(formula).every(
        (key) => formulaInputs[key]?.toLowerCase().trim() === formula[key]?.toLowerCase().trim()
      );
    } else if (question.type === 'scenario') {
       correct = userAnswer === question.correctAnswer;
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      onComplete();
    }
  };

  const reset = () => {
    setUserAnswer(null);
    setShowFeedback(false);
    setLabels({});
    setFormulaInputs({});
  };

  return (
    <div className={`${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'} rounded-3xl md:rounded-[3rem] p-6 md:p-12 shadow-2xl border-2 relative overflow-hidden transition-all duration-500 group`}>
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="scanline opacity-20" />
      </div>
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center space-x-4">
          <div className={`${isDarkMode ? 'bg-registry-teal/20 border-registry-teal/30' : 'bg-registry-teal/10 border-registry-teal/20'} p-3 rounded-2xl glow-teal`}>
            <Terminal className="w-6 h-6 text-registry-teal" />
          </div>
          <div>
            <h4 className={`text-lg md:text-2xl font-black uppercase italic tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Certification Terminal</h4>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural Validation Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
            <span className="text-[10px] font-mono text-registry-teal">SPI-704-B</span>
          </div>
          {showFeedback && (
            <button onClick={reset} className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-registry-teal/10 hover:text-registry-teal rounded-xl transition-all group" title="Reset Terminal">
              <RefreshCw className="w-5 h-5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8 md:space-y-12 relative z-10">
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-registry-teal/20 rounded-full" />
          <p className={`text-lg md:text-2xl font-bold leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} pl-4`}>
            {question.question}
          </p>
        </div>

        {question.visualContext && (
          <div className={`p-4 md:p-8 ${isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-slate-50 border-slate-100'} rounded-[2rem] md:rounded-[3rem] border relative group overflow-x-auto scrollbar-hide shadow-inner`}>
            <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-30">
              <Activity className="w-4 h-4 text-registry-teal" />
              <span className="text-[8px] font-black uppercase tracking-widest">Diagnostic Feed</span>
            </div>
            <div className="relative min-w-[300px]">
              {question.visualContext}
              
              {question.type === 'labeling' && question.labelData?.map((l) => (
                <div 
                  key={l.id} 
                  className="absolute" 
                  style={{ top: `${l.y}%`, left: `${l.x}%` }}
                >
                  <div className="relative group/label">
                    <div className="w-4 h-4 bg-registry-teal rounded-full animate-ping absolute -top-2 -left-2 opacity-20" />
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-registry-teal rounded-full shadow-[0_0_10px_rgba(0,229,255,1)]" />
                    <input 
                      disabled={showFeedback}
                      type="text" 
                      placeholder="Input ID"
                      value={labels[l.id] || ''}
                      onChange={(e) => setLabels(prev => ({ ...prev, [l.id]: e.target.value }))}
                      className={`w-24 md:w-32 px-3 py-2 ${isDarkMode ? 'bg-stealth-800/90 border-registry-teal/30' : 'bg-white/90 border-slate-200'} backdrop-blur-sm border-2 rounded-xl text-[10px] md:text-[11px] font-black text-center transition-all outline-none shadow-lg ${
                        showFeedback 
                          ? (labels[l.id]?.toLowerCase().trim() === l.label.toLowerCase().trim() ? 'border-registry-teal text-registry-teal' : 'border-registry-rose text-registry-rose')
                          : 'focus:border-registry-teal focus:scale-105'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4 md:gap-6">
          {question.type === 'mcq' && question.options?.map((opt, i) => (
            <button 
              key={i} 
              disabled={showFeedback}
              onClick={() => setUserAnswer(i)}
              className={`p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] text-left font-bold text-sm md:text-lg transition-all flex items-center space-x-4 md:space-x-6 border-2 active:scale-[0.98] relative overflow-hidden group/opt ${
                userAnswer === i 
                  ? isDarkMode ? 'bg-registry-teal/10 border-registry-teal text-white glow-teal' : 'bg-registry-teal/5 border-registry-teal text-slate-900 glow-teal' 
                  : isDarkMode ? 'bg-slate-800/50 border-transparent hover:border-white/10' : 'bg-slate-50 border-transparent hover:border-slate-200'
              } ${showFeedback && i === question.correctAnswer ? 'border-registry-teal bg-registry-teal/5' : ''}`}
            >
              {userAnswer === i && (
                <div className="absolute inset-0 bg-gradient-to-r from-registry-teal/10 to-transparent pointer-events-none" />
              )}
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl border-2 flex items-center justify-center font-black text-xs md:text-sm shrink-0 transition-all ${userAnswer === i ? 'bg-registry-teal text-white border-registry-teal glow-teal' : 'text-slate-400 border-slate-200 dark:border-white/10 group-hover/opt:border-registry-teal/50'}`}>{String.fromCharCode(65 + i)}</div>
              <span className="leading-tight relative z-10">{opt}</span>
              {showFeedback && i === question.correctAnswer && (
                <CheckCircle2 className="w-6 h-6 text-registry-teal ml-auto shrink-0" />
              )}
            </button>
          ))}
        </div>

        {!showFeedback ? (
          <button 
            onClick={checkAnswer}
            disabled={userAnswer === null && question.type === 'mcq'}
            className="w-full py-6 md:py-8 bg-registry-teal hover:bg-registry-teal/90 disabled:opacity-30 text-white rounded-2xl md:rounded-[3rem] font-black uppercase tracking-[0.3em] text-xs md:text-base shadow-2xl shadow-registry-teal/20 transition-all flex items-center justify-center space-x-4 active:scale-95 group/btn"
          >
            <span className="group-hover/btn:translate-x-1 transition-transform">Submit to Central Registry</span>
            <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
          </button>
        ) : (
          <div className={`p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] animate-in slide-in-from-top-6 duration-700 border-2 ${isCorrect ? 'bg-registry-teal/5 border-registry-teal/30' : 'bg-registry-rose/5 border-registry-rose/30'}`}>
            <div className="flex items-start space-x-6">
              <div className={`p-4 rounded-2xl ${isCorrect ? 'bg-registry-teal glow-teal' : 'bg-registry-rose glow-rose'} text-white shrink-0`}>
                {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <h5 className={`text-lg md:text-2xl font-black uppercase italic tracking-tight ${isCorrect ? 'text-registry-teal dark:text-registry-teal/80' : 'text-registry-rose dark:text-registry-rose/80'}`}>
                    {isCorrect ? 'Validation Successful' : 'Acoustic Error Detected'}
                  </h5>
                  <div className={`h-px flex-1 ${isCorrect ? 'bg-registry-teal/20' : 'bg-registry-rose/20'}`} />
                </div>
                <p className="text-sm md:text-lg font-medium leading-relaxed opacity-90 italic border-l-4 pl-6 border-current">
                  {question.explanation}
                </p>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="flex items-center space-x-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isCorrect ? 'bg-registry-teal' : 'bg-registry-rose'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Registry Log: 0x44F2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};