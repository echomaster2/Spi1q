import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, Terminal, Activity, Zap, Cpu, Scan, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const checkAnswer = async () => {
    setIsAnalyzing(true);
    // Simulate diagnostic processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
    setIsAnalyzing(false);
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
    <div className={`premium-glass rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-14 border tech-border shadow-premium relative overflow-hidden transition-all duration-700 group ${isDarkMode ? 'bg-stealth-950/40' : 'bg-white/40'}`}>
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
      
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-registry-teal/20 rounded-tl-[3.5rem] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-registry-teal/20 rounded-br-[3.5rem] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10 border-b tech-border pb-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-14 h-14 bg-registry-teal/10 rounded-2xl flex items-center justify-center border border-registry-teal/20 glow-teal group-hover:rotate-12 transition-transform duration-500 backdrop-blur-xl">
               <Cpu className="w-7 h-7 text-registry-teal" />
            </div>
            <motion.div 
               animate={{ opacity: [0.2, 1, 0.2] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-registry-teal rounded-full blur-sm"
            />
          </div>
          <div>
            <span className="col-header text-registry-teal opacity-100 flex items-center space-x-2">
               <span className="w-2 h-[1px] bg-registry-teal" />
               <span>Certification_Terminal</span>
            </span>
            <h4 className={`text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'} drop-shadow-md`}>Verification Engine</h4>
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex space-x-0.5">
                 {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-1 h-3 rounded-full ${i <= 2 ? 'bg-registry-teal animate-pulse' : 'bg-white/10'}`} />
                 ))}
              </div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.2em] italic font-bold">Neural Sync: STABLE // X-704</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
           <span className="col-header opacity-40">Security_Level</span>
           <span className="text-xl font-black italic text-registry-rose tracking-tighter">MAX-ELITE</span>
        </div>
      </div>

      <div className="space-y-12 md:space-y-20 relative z-10">
        <div className="relative max-w-5xl">
           <div className="absolute -left-10 top-0 bottom-0 w-2 bg-registry-teal/30 rounded-full blur-[2px]" />
           <p className={`text-2xl md:text-5xl font-black leading-[1.05] tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} drop-shadow-xl italic`}>
            {question.question}
           </p>
           <div className="flex items-center space-x-4 mt-6">
              <span className="text-[11px] font-mono text-registry-teal/60 font-black uppercase tracking-[0.3em]">Query_Payload_ID: {question.id}</span>
              <div className="h-px flex-1 bg-white/5" />
           </div>
        </div>

        {question.visualContext && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 md:p-10 ${isDarkMode ? 'bg-stealth-950/60 border-white/5 shadow-inner' : 'bg-slate-50 border-slate-200'} rounded-[2.5rem] md:rounded-[4rem] border relative group overflow-hidden`}
          >
             <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
             <div className="absolute top-6 right-8 flex items-center space-x-3 opacity-40">
                <Activity className="w-5 h-5 text-registry-teal animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] font-mono italic">Diagnostic Feed</span>
             </div>
             
             <div className="relative min-w-[300px] flex justify-center">
                <div className="relative w-full max-w-3xl">
                  {question.visualContext}
                  
                  {question.type === 'labeling' && question.labelData?.map((l) => (
                    <div 
                      key={l.id} 
                      className="absolute" 
                      style={{ top: `${l.y}%`, left: `${l.x}%` }}
                    >
                      <div className="relative group/label">
                        <div className="w-6 h-6 bg-registry-teal rounded-full animate-ping absolute -top-3 -left-3 opacity-20" />
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-registry-teal rounded-full shadow-glow" />
                        <input 
                          disabled={showFeedback || isAnalyzing}
                          type="text" 
                          placeholder="INPUT ID"
                          value={labels[l.id] || ''}
                          onChange={(e) => setLabels(prev => ({ ...prev, [l.id]: e.target.value }))}
                          className={`w-32 md:w-40 px-5 py-3 ${isDarkMode ? 'bg-stealth-800/95 border-registry-teal/40' : 'bg-white/95 border-slate-200'} backdrop-blur-xl border-2 rounded-2xl text-[11px] md:text-sm font-black text-center transition-all outline-none focus:glow-teal focus:scale-105 shadow-2xl ${
                            showFeedback 
                              ? (labels[l.id]?.toLowerCase().trim() === l.label.toLowerCase().trim() ? 'border-registry-teal text-registry-teal' : 'border-registry-rose text-registry-rose shadow-glow')
                              : 'group-hover/label:border-registry-teal/60'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {question.type === 'mcq' && question.options?.map((opt, i) => (
            <motion.button 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              disabled={showFeedback || isAnalyzing}
              onClick={() => setUserAnswer(i)}
              className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] text-left transition-all flex items-start space-x-6 border-2 relative overflow-hidden group/opt ${
                userAnswer === i 
                  ? 'bg-registry-teal/10 border-registry-teal shadow-glow' 
                  : isDarkMode ? 'bg-white/5 border-transparent hover:border-white/10' : 'bg-slate-50 border-transparent hover:border-slate-200'
              } ${showFeedback && i === question.correctAnswer ? 'border-emerald-500 bg-emerald-500/5' : ''} ${showFeedback && userAnswer === i && i !== question.correctAnswer ? 'border-registry-rose bg-registry-rose/5' : ''}`}
            >
              <div className={`mt-1.5 w-10 h-10 md:w-12 md:h-12 rounded-2xl border-2 flex items-center justify-center font-black text-sm md:text-lg shrink-0 transition-all ${userAnswer === i ? 'bg-registry-teal text-stealth-950 border-registry-teal shadow-glow scale-110' : 'text-slate-500 border-slate-200 dark:border-white/10 group-hover/opt:border-registry-teal/40 group-hover/opt:text-registry-teal'}`}>
                {String.fromCharCode(65 + i)}
              </div>
              <div className="flex-1 space-y-1">
                 <span className={`text-sm md:text-lg font-bold leading-tight block ${userAnswer === i ? 'text-registry-teal' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                   {opt}
                 </span>
                 {showFeedback && i === question.correctAnswer && (
                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500 italic block mt-2">Verified Protocol Path</span>
                 )}
              </div>
              {showFeedback && i === question.correctAnswer && (
                 <CheckCircle2 className="w-8 h-8 text-emerald-500 absolute top-6 right-8 group-hover/opt:scale-110 transition-transform" />
              )}
            </motion.button>
          ))}
        </div>

        <div className="relative pt-6">
          <AnimatePresence mode="wait">
            {!showFeedback ? (
              <motion.button 
                key="submit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={checkAnswer}
                disabled={(userAnswer === null && question.type === 'mcq') || isAnalyzing}
                className={`w-full py-8 md:py-12 bg-registry-teal text-stealth-950 rounded-[2.5rem] md:rounded-[4rem] font-black uppercase tracking-[0.4em] text-sm md:text-lg shadow-2xl transition-all flex items-center justify-center space-x-6 relative overflow-hidden group/btn ${isAnalyzing ? 'cursor-wait opacity-80' : 'hover:scale-[1.02] hover:shadow-glow'}`}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer pointer-events-none opacity-20" />
                
                {isAnalyzing ? (
                   <>
                     <RefreshCw className="w-7 h-7 animate-spin" />
                     <span>Diagnostic Analysis In Progress...</span>
                   </>
                ) : (
                  <>
                    <span className="relative z-10">Synchronize Mastery Path</span>
                    <ArrowRight className="w-7 h-7 relative z-10 group-hover/btn:translate-x-3 transition-transform duration-500" />
                  </>
                )}
              </motion.button>
            ) : (
              <motion.div 
                key="feedback"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`p-10 md:p-16 rounded-[3rem] md:rounded-[5rem] border-2 shadow-2xl relative overflow-hidden flex flex-col items-center text-center ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-registry-rose/5 border-registry-rose/30'}`}
              >
                <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
                <div className={`mb-8 p-6 rounded-3xl ${isCorrect ? 'bg-emerald-500 glow-teal' : 'bg-registry-rose glow-rose'} text-stealth-950`}>
                  {isCorrect ? <CheckCircle2 className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                </div>
                <h5 className={`text-3xl md:text-6xl font-black uppercase italic tracking-tighter mb-6 ${isCorrect ? 'text-emerald-500' : 'text-registry-rose'}`}>
                  {isCorrect ? 'Sync Successful' : 'Validation Error'}
                </h5>
                <div className="max-w-2xl mx-auto space-y-6">
                  <p className={`text-lg md:text-2xl font-medium leading-relaxed italic ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    "{question.explanation}"
                  </p>
                  <div className="flex items-center justify-center space-x-6 pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                       <Zap className={`w-4 h-4 ${isCorrect ? 'text-emerald-500' : 'text-registry-rose'}`} />
                       <span className="text-[11px] font-black uppercase tracking-widest opacity-50">Log ID: 0x{Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-slate-500 opacity-20" />
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-50">Topology: Alpha-4</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
