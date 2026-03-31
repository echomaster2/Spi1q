import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { generateText } from '../src/services/aiService';
import { Send, Brain, User, Bot, X, Sparkles, ChevronLeft, Save, Volume2, Pause, Loader2, Activity, Stethoscope } from 'lucide-react';
import { CLINICAL_TIPS } from '../src/constants/clinicalTips';
import { ChatMessage } from '../types';
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
}

export const AITutor: React.FC<AITutorProps> = ({ currentContext, onClose, onVault, isDarkMode, onPlayNarration, isNarrating, isTtsLoading, profile }) => {
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
    <div className="flex flex-col h-full bg-white dark:bg-stealth-950 shadow-2xl transition-colors duration-300 relative z-[100] overflow-hidden neural-grid">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-registry-teal/5 to-transparent" />
        <div className="scanline opacity-30" />
      </div>

      <header className={`p-4 md:p-6 ${isDarkMode ? 'bg-stealth-950/80' : 'bg-white/80'} backdrop-blur-xl text-slate-900 dark:text-white flex justify-between items-center flex-shrink-0 border-b border-slate-100 dark:border-white/10 transition-colors relative z-10`}>
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-400 dark:text-white/70 hover:text-registry-teal transition-colors" title="Close Tutor">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="scale-50 -mx-8">
              <CompanionAvatar 
                state={isLoading ? 'thinking' : isNarrating ? 'speaking' : 'idle'} 
                skin={profile?.companionSkin || 'sonographer'}
                level={Math.floor((profile?.scriptVault?.length || 0) / 5) + 1}
                isDarkMode={isDarkMode}
              />
            </div>
            {isLoading && (
              <div className="p-1.5 bg-registry-teal/10 rounded-lg border border-registry-teal/20">
                <Activity className="w-3 h-3 text-registry-teal animate-pulse" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm md:text-lg font-black tracking-tight leading-none italic uppercase flex items-center space-x-2">
              <span>HARVEY</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-registry-teal/10 text-registry-teal border border-registry-teal/20 rounded font-mono animate-pulse">LINK ACTIVE</span>
            </h4>
            <p className="text-[8px] md:text-[9px] opacity-70 font-black uppercase tracking-widest mt-0.5">NEURAL INTERFACE: {profile?.name || 'GUEST'} | NODE: {currentContext.substring(0, 15)}...</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-1 mr-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-1 h-1 bg-registry-teal rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          {onPlayNarration && (
            <button 
              onClick={() => onPlayNarration(`Hello! I'm Harvey, your SPI Master Tutor. I see you're studying "${currentContext}". Ask me anything about ultrasound physics!`, 'tutor_intro')} 
              disabled={isTtsLoading}
              className={`p-2 rounded-xl transition-all ${isNarrating ? 'bg-registry-rose animate-pulse glow-rose' : 'hover:bg-slate-100 dark:hover:bg-white/10'}`}
            >
              {isTtsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
          <button 
            onClick={shareClinicalTip}
            className="p-2 hover:bg-registry-teal/10 rounded-xl transition-colors group relative"
            title="Get Clinical Wisdom"
          >
            <Stethoscope className="w-5 h-5 text-registry-teal group-hover:scale-110 transition-transform" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Clinical Wisdom</span>
          </button>
          <FullscreenToggle className="bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-white/70 border-none" iconClassName="w-5 h-5" />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-transparent scroll-smooth relative z-10">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] md:max-w-[90%] flex items-start space-x-2 md:space-x-4 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-lg border ${msg.role === 'user' ? 'bg-registry-teal/10 border-registry-teal/30 text-registry-teal glow-teal' : isDarkMode ? 'bg-stealth-800 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-400'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className="relative group">
                <div className={`p-5 rounded-2xl text-xs md:text-sm font-medium leading-relaxed shadow-xl border ${
                  msg.role === 'user' 
                    ? 'bg-registry-teal text-white border-registry-teal/50 rounded-tr-none' 
                    : isDarkMode ? 'bg-stealth-800/90 backdrop-blur-md border-white/10 text-slate-300 rounded-tl-none' : 'bg-white/90 backdrop-blur-md border-slate-200 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.role === 'model' && (
                    <div className="flex items-center space-x-2 mb-2 opacity-50">
                      <div className="w-1 h-1 bg-registry-teal rounded-full" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Incoming Transmission</span>
                    </div>
                  )}
                  <div className={msg.role === 'model' ? 'prose prose-sm dark:prose-invert max-w-none' : ''}>
                    {msg.text}
                  </div>
                </div>
                {msg.role === 'model' && idx > 0 && (
                  <div className="absolute -bottom-8 left-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => handleVaultLocal(msg.text)}
                      className="flex items-center space-x-2 px-3 py-1 bg-registry-teal/10 border border-registry-teal/20 rounded-full text-[8px] font-black uppercase text-registry-teal hover:bg-registry-teal hover:text-white transition-colors"
                    >
                      <Save className="w-3 h-3" />
                      <span>Archive</span>
                    </button>
                    {onPlayNarration && (
                      <button 
                        onClick={() => onPlayNarration(msg.text, `tutor_msg_${idx}`)}
                        className="flex items-center space-x-2 px-3 py-1 bg-registry-rose/10 border border-registry-rose/20 rounded-full text-[8px] font-black uppercase text-registry-rose hover:bg-registry-rose hover:text-white transition-colors"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-4 animate-pulse">
             <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${isDarkMode ? 'bg-stealth-800 border-white/10' : 'bg-white border-slate-200'} border flex items-center justify-center shadow-lg`}><Sparkles className="w-4 h-4 text-registry-teal" /></div>
             <div className={`p-5 ${isDarkMode ? 'bg-stealth-800/50 border-white/10' : 'bg-white/50 border-slate-200'} backdrop-blur-sm border rounded-2xl rounded-tl-none flex space-x-2`}>
                <div className="w-2 h-2 bg-registry-teal/40 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-registry-teal/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-registry-teal rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
             </div>
          </div>
        )}
      </div>

      <div className={`p-4 md:p-8 ${isDarkMode ? 'bg-stealth-950/80 border-white/10' : 'bg-white/80 border-slate-100'} backdrop-blur-xl border-t pb-24 lg:pb-8 relative z-10`}>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-registry-teal to-registry-rose rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Initialize neural query..."
            className="relative w-full pl-6 pr-16 py-5 bg-slate-50 dark:bg-stealth-900 rounded-2xl text-xs md:text-sm font-bold border-2 border-transparent focus:border-registry-teal/50 text-slate-900 dark:text-slate-100 transition-all outline-none shadow-inner"
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading} 
            className="absolute right-2 top-2 bottom-2 px-5 bg-registry-teal text-white rounded-xl shadow-lg shadow-registry-teal/20 disabled:opacity-50 hover:bg-registry-teal/80 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Send className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between px-2">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Neural Link: {isLoading ? 'Processing Query...' : 'Encrypted'}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className={`w-1 h-1 ${isLoading ? 'bg-registry-teal animate-pulse' : 'bg-registry-teal'} rounded-full`} />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{isLoading ? 'Harvey is thinking' : 'Uptime 99.9%'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};