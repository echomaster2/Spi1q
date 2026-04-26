import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { generateText } from '../src/services/aiService';
import { Send, Brain, User, Bot, X, Sparkles, ChevronLeft, Save, Volume2, Pause, Loader2, Activity, Stethoscope } from 'lucide-react';
import { CLINICAL_TIPS } from '../src/constants/clinicalTips';
import { ChatMessage } from '../types';
import { updateQuestProgress } from '../src/lib/questUtils';
import { FullscreenToggle } from './FullscreenToggle';
import { CompanionAvatar } from './CompanionAvatar';

interface AITutorProps {
  currentContext: string;
  onClose: () => void;
  onVault: (title: string, content: string) => void;
  isDarkMode?: boolean;
  onPlayNarration?: (text: string, id: string) => void;
  isNarrating?: boolean;
  isTtsLoading?: boolean;
  profile?: any;
  onUpdateProfile?: (updates: any) => void;
}

export const AITutor: React.FC<AITutorProps> = ({ currentContext, onClose, onVault, isDarkMode, onPlayNarration, isNarrating, isTtsLoading, profile, onUpdateProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Hello! I'm Harvey, your SPI Master Tutor. I see you're studying "${currentContext}". Ask me anything about ultrasound physics!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Update quest progress
    updateQuestProgress('q3', 1);
    updateQuestProgress('q5', 1);

    // Update profile interaction count
    if (onUpdateProfile) {
      const currentCount = profile?.harveyInteractionCount || 0;
      onUpdateProfile({ harveyInteractionCount: currentCount + 1 });
    }

    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
    }

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      // Build history for context
      const history = messages.slice(-6).map(m => `${m.role === 'user' ? 'Student' : 'Harvey'}: ${m.text}`).join('\n');
      const systemInstruction = `You are Harvey, an elite SPI board tutor. You have a sharp, scientific, yet encouraging personality. Keep answers concise, scientific, and exam-focused. Use bold text for key terms. If asked for a mnemonic, provide a brilliant one. Context: ${currentContext}.`;
      const prompt = `Previous conversation:\n${history}\n\nStudent: ${input}`;
      
      const response = await generateText(prompt, systemInstruction);
      setMessages(prev => [...prev, { role: 'model', text: response || "I hit an artifact. Rephrase?", timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Bioeffect error. Rephrase your query?", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVaultLocal = (msg: string) => {
    onVault(`Harvey's Note: ${currentContext}`, msg);
    toast.success("Script vaulted to Dashboard!");
  };

  const shareClinicalTip = () => {
    const randomTip = CLINICAL_TIPS[Math.floor(Math.random() * CLINICAL_TIPS.length)];
    const tipMsg: ChatMessage = { 
      role: 'model', 
      text: `**Clinical Pearl:** ${randomTip.title}\n\n${randomTip.content}\n\n*Category: ${randomTip.category}*`, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, tipMsg]);
    toast.info(`Shared a ${randomTip.category} tip!`);
  };

  return (
    <div className="flex flex-col h-full premium-glass shadow-premium transition-colors duration-300 relative z-[100] overflow-hidden neural-grid">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-registry-teal/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-[300px] bg-gradient-to-t from-registry-rose/5 to-transparent" />
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDarkMode ? 'bg-registry-teal/10' : 'bg-registry-teal/5'} blur-[160px] rounded-full`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDarkMode ? 'bg-registry-rose/10' : 'bg-registry-rose/5'} blur-[160px] rounded-full`} />
        <div className="scanline" />
      </div>

      {/* Sidebar Rail (Recipe 11: SaaS Landing) */}
      <div className="absolute left-4 top-40 bottom-40 w-px bg-gradient-to-b from-transparent via-registry-teal/20 to-transparent hidden lg:block z-0">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-24 opacity-20">
            <span className="writing-mode-vertical text-[11px] font-black uppercase tracking-[0.5em] text-registry-teal">NEURAL_SYNC_CHANNEL_04</span>
            <span className="writing-mode-vertical text-[11px] font-black uppercase tracking-[0.5em] text-registry-rose">X_PROT_VAULT_ACTIVE</span>
         </div>
      </div>

      <header className={`p-4 md:p-8 ${isDarkMode ? 'bg-stealth-950/40' : 'bg-white/40'} backdrop-blur-3xl text-slate-900 dark:text-white flex justify-between items-center flex-shrink-0 border-b tech-border transition-colors relative z-10`}>
        <div className="flex items-center space-x-3 md:space-x-4">
          <button 
            onClick={onClose} 
            className="p-2 md:p-3 -ml-2 text-slate-400 dark:text-white/70 hover:text-registry-teal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal rounded-2xl hover:bg-white/10" 
            aria-label="Close Harvey AI Tutor"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="scale-75 -mx-8 md:-mx-6">
              <CompanionAvatar 
                state={isLoading ? 'thinking' : isNarrating ? 'speaking' : 'idle'} 
                skin={profile?.companionSkin || 'sonographer'}
                level={Math.floor((profile?.scriptVault?.length || 0) / 5) + 1}
                isDarkMode={isDarkMode}
              />
            </div>
            {isLoading && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-2 bg-registry-teal/10 rounded-xl border border-registry-teal/20 shadow-glow"
              >
                <Activity className="w-4 h-4 text-registry-teal animate-pulse" />
              </motion.div>
            )}
          </div>
          <div>
            <h4 className="text-base md:text-xl font-black tracking-tighter leading-none italic uppercase flex items-center space-x-3">
              <span className="shimmer-text">HARVEY</span>
              <span className="text-[11px] px-2 py-1 bg-registry-teal/10 text-registry-teal border border-registry-teal/20 rounded-lg font-mono animate-pulse shadow-glow">LINK ACTIVE</span>
            </h4>
            <p className={`text-[11px] ${isDarkMode ? 'opacity-60' : 'opacity-90 text-slate-800'} font-black uppercase tracking-[0.2em] mt-1.5`}>NEURAL INTERFACE: {profile?.name || 'GUEST'} | NODE: {currentContext.substring(0, 15)}...</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 md:space-x-3">
          <div className="hidden sm:flex items-center space-x-2 mr-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          {onPlayNarration && (
            <button 
              onClick={() => onPlayNarration(`Hello! I'm Harvey, your SPI Master Tutor. I see you're studying "${currentContext}". Ask me anything about ultrasound physics!`, 'tutor_intro')} 
              disabled={isTtsLoading}
              className={`p-2.5 md:p-3 rounded-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal ${isNarrating ? 'bg-registry-rose animate-pulse glow-rose text-white' : 'hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white/70 bg-slate-100 dark:bg-transparent'}`}
              aria-label={isNarrating ? "Stop narration" : "Listen to introduction"}
            >
              {isTtsLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          )}
          <button 
            onClick={shareClinicalTip}
            className="p-2.5 md:p-3 hover:bg-registry-teal/10 rounded-2xl transition-all group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal text-registry-teal"
            aria-label="Get Clinical Wisdom"
            title="Get Clinical Wisdom"
          >
            <Stethoscope className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-premium">Clinical Wisdom</span>
          </button>
          <FullscreenToggle className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white/70 border-none p-2.5 md:p-3 rounded-2xl" iconClassName="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 bg-transparent scroll-smooth relative z-10 scrollbar-hide">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[80%] flex items-start space-x-3 md:space-x-5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-premium border ${msg.role === 'user' ? 'bg-registry-teal/10 border-registry-teal/30 text-registry-teal glow-teal' : isDarkMode ? 'bg-stealth-800 border-white/10 text-slate-400' : 'bg-white border-slate-300 text-slate-800'}`}>
                {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className="relative group">
                <div className={`p-6 rounded-3xl text-sm md:text-base font-medium leading-relaxed shadow-premium border relative overflow-hidden ${
                  msg.role === 'user' 
                    ? 'bg-registry-teal text-white border-registry-teal/50 rounded-tr-none' 
                    : isDarkMode ? 'bg-stealth-800/80 backdrop-blur-3xl border-white/10 text-slate-300 rounded-tl-none' : 'bg-white/90 backdrop-blur-3xl border-slate-300 text-slate-900 rounded-tl-none'
                }`}>
                  {/* Micro hardware screws in bubbles */}
                  <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-white/10 rounded-full" />
                  <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-white/10 rounded-full" />
                  
                  {msg.role === 'model' && (
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center space-x-2 opacity-50">
                          <div className="w-1.5 h-1.5 bg-registry-teal rounded-full shadow-glow" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em]">Neural_Sync.Active</span>
                       </div>
                       <span className="text-[11px] font-mono opacity-20 uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  )}
                  <div className={msg.role === 'model' ? 'prose prose-sm dark:prose-invert max-w-none font-medium' : 'font-bold'}>
                    {msg.text}
                  </div>
                </div>
                {msg.role === 'model' && idx > 0 && (
                  <div className="absolute -bottom-10 left-0 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => handleVaultLocal(msg.text)}
                      className="flex items-center space-x-2 px-4 py-1.5 bg-registry-teal/10 border border-registry-teal/30 rounded-full text-[11px] font-black uppercase text-teal-600 dark:text-registry-teal hover:bg-registry-teal hover:text-stealth-950 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal shadow-glow"
                      aria-label="Archive message to vault"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                    {onPlayNarration && (
                      <button 
                        onClick={() => onPlayNarration(msg.text, `tutor_msg_${idx}`)}
                        className="flex items-center space-x-2 px-4 py-1.5 bg-registry-rose/10 border border-registry-rose/30 rounded-full text-[11px] font-black uppercase text-rose-600 dark:text-registry-rose hover:bg-registry-rose hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-rose shadow-glow"
                        aria-label="Listen to message"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-5 animate-pulse">
             <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${isDarkMode ? 'bg-stealth-800 border-white/10' : 'bg-white border-slate-200'} border flex items-center justify-center shadow-premium`}><Sparkles className="w-5 h-5 text-registry-teal" /></div>
             <div className={`p-6 ${isDarkMode ? 'bg-stealth-800/40 border-white/10' : 'bg-white/40 border-slate-200'} backdrop-blur-3xl border rounded-3xl rounded-tl-none flex space-x-3 shadow-premium`}>
                <div className="w-2.5 h-2.5 bg-registry-teal/40 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-registry-teal/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2.5 h-2.5 bg-registry-teal rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
             </div>
          </div>
        )}
      </div>

      <div className={`p-4 md:p-10 ${isDarkMode ? 'bg-stealth-950/40 border-white/10' : 'bg-white/40 border-slate-100'} backdrop-blur-3xl border-t pb-24 lg:pb-10 relative z-10`}>
        <div className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-registry-teal to-registry-rose rounded-3xl blur-lg opacity-20 group-focus-within:opacity-50 transition-opacity" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Initialize neural query..."
            className="relative w-full pl-6 pr-16 md:pl-8 md:pr-20 py-4 md:py-6 bg-slate-100 dark:bg-stealth-900/50 rounded-3xl text-sm md:text-base font-bold border-2 border-transparent focus:border-registry-teal/50 text-slate-900 dark:text-slate-100 transition-all outline-none shadow-inner backdrop-blur-xl"
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading} 
            className="absolute right-2 top-2 bottom-2 md:right-3 md:top-3 md:bottom-3 px-4 md:px-6 bg-registry-teal text-white rounded-2xl shadow-glow disabled:opacity-50 hover:bg-registry-teal/80 transition-all hover:scale-105 active:scale-95 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Send neural query"
          >
            {isLoading ? <Loader2 className="w-4 h-4 md:w-6 md:h-6 animate-spin" /> : <Send className="w-4 h-4 md:w-6 md:h-6" />}
          </button>
        </div>
        <div className="mt-5 flex items-center justify-between px-3">
          <span className="text-[11px] font-black text-slate-800 dark:text-slate-500 uppercase tracking-[0.4em]">Neural Link: {isLoading ? 'Processing Query...' : 'Encrypted'}</span>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 ${isLoading ? 'bg-registry-teal animate-pulse shadow-glow' : 'bg-registry-teal'} rounded-full`} />
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-500 uppercase tracking-[0.4em]">{isLoading ? 'Harvey is thinking' : 'Uptime 99.9%'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};