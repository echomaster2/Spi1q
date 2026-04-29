import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Send, Users, Activity, Settings, Radio, 
  MessageSquare, Volume2, Shield, Eye, Heart, 
  Zap, Maximize2, Headphones, Sparkles, Brain
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  role?: 'student' | 'harvey' | 'admin';
}

interface LiveSuiteProps {
  onClose: () => void;
  userName: string;
  isDarkMode: boolean;
}

export const LiveSuite: React.FC<LiveSuiteProps> = ({ onClose, userName, isDarkMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [viewerCount, setViewerCount] = useState(1);
  const [showOptions, setShowOptions] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [reactions, setReactions] = useState<{ id: number; type: string; x: number }[]>([]);
  
  // Options State
  const [harveyEnabled, setHarveyEnabled] = useState(true);
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.emit('join-live', userName);

    newSocket.on('new-message', (msg: Message) => {
      setMessages(prev => [...prev, msg].slice(-100));
    });

    newSocket.on('user-joined', (data) => {
      setViewerCount(prev => prev + 1);
      setMessages(prev => [...prev, {
        id: `join-${Date.now()}`,
        user: 'System',
        text: `${data.name} synchronized with the field.`,
        timestamp: new Date().toISOString(),
        role: 'admin'
      }]);
    });

    newSocket.on('new-reaction', (type: string) => {
      const id = Date.now();
      setReactions(prev => [...prev, { id, type, x: Math.random() * 80 + 10 }]);
      setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 2000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim() || !socket) return;
    socket.emit('send-message', {
      user: userName,
      text: inputValue,
      role: 'student'
    });
    setInputValue('');
  };

  const sendReaction = (type: string) => {
    if (!socket) return;
    socket.emit('send-reaction', type);
    // Local feedback
    const id = Date.now();
    setReactions(prev => [...prev, { id, type, x: Math.random() * 80 + 10 }]);
    setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex flex-col md:flex-row backdrop-blur-3xl overflow-hidden ${focusMode ? 'bg-black' : isDarkMode ? 'bg-stealth-950/95' : 'bg-slate-50/95'}`}
    >
      {/* Immersive Background Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-registry-teal/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-registry-rose/20 blur-[120px] rounded-full" />
      </div>

      {/* Main Stream Area */}
      <div className={`relative flex-1 flex flex-col transition-all duration-700 ${focusMode ? 'md:p-0' : 'md:p-8 lg:p-12'}`}>
        {/* Header Ribbon */}
        {!focusMode && (
          <div className="flex items-center justify-between mb-8 z-10 px-6 md:px-0">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-registry-teal flex items-center justify-center shadow-lg shadow-registry-teal/30">
                  <Radio className="w-6 h-6 md:w-8 md:h-8 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-stealth-950 rounded-full" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-black uppercase text-registry-teal tracking-[0.4em]">Live Transduction</span>
                  <div className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-black text-red-500 uppercase tracking-widest">Live</div>
                </div>
                <h1 className="text-xl md:text-4xl font-black italic uppercase tracking-tighter">Physics Deep Dive: Doppler Shift</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                <Users className="w-4 h-4 text-registry-teal" />
                <span className="text-xs font-black tracking-widest">{viewerCount} SYNCHRONIZED</span>
              </div>
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Settings className={`w-5 h-5 transition-transform duration-500 ${showOptions ? 'rotate-90' : ''}`} />
              </button>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Video Player Container */}
        <div className={`relative flex-1 group overflow-hidden shadow-2xl ${focusMode ? 'rounded-none border-0' : 'rounded-[2rem] md:rounded-[3rem] border tech-border shadow-registry-teal/20'}`}>
          <div className="absolute inset-0 bg-black flex items-center justify-center">
             {/* Mock Stream Video Component */}
             <div className="w-full h-full relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551076805-e1869043e560?auto=format&fit=crop&w=1920&q=80" 
                  alt="Stream Background"
                  className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Simulated Wave Overlay if enabled */}
                <AnimatePresence>
                  {overlayEnabled && (
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full opacity-30">
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-registry-teal" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>
                  )}
                </AnimatePresence>

                {/* Centered Focus Message */}
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 z-10 text-center px-12">
                   <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-white/5 backdrop-blur-2xl flex items-center justify-center border border-white/20 animate-pulse">
                      <Zap className="w-12 h-12 md:w-20 md:h-20 text-registry-teal" />
                   </div>
                   <div className="space-y-2">
                      <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter">Harmonic Calibration in Progress</h2>
                      <p className="text-sm md:text-xl font-medium opacity-60 max-w-2xl mx-auto italic">
                        "If you can't explain it simply, you don't understand it well enough." — Doppler, probably.
                      </p>
                   </div>
                </div>

                {/* Flying Reactions */}
                <div className="absolute inset-0 pointer-events-none">
                  <AnimatePresence>
                    {reactions.map(r => (
                      <motion.div
                        key={r.id}
                        initial={{ y: '100%', opacity: 0, x: `${r.x}%` }}
                        animate={{ y: '-20%', opacity: [0, 1, 0] }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute text-3xl"
                      >
                         {r.type === 'heart' && <Heart className="fill-registry-rose text-registry-rose" />}
                         {r.type === 'brain' && <Brain className="fill-registry-cobalt text-registry-cobalt" />}
                         {r.type === 'zap' && <Zap className="fill-yellow-400 text-yellow-400" />}
                         {r.type === 'spark' && <Sparkles className="fill-registry-teal text-registry-teal" />}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
             </div>
          </div>

          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                   <button className="text-white hover:text-registry-teal transition-colors"><Radio className="w-6 h-6" /></button>
                   <button className="text-white hover:text-registry-teal transition-colors"><Volume2 className="w-6 h-6" /></button>
                   <div className="h-1 w-48 md:w-96 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        className="h-full bg-registry-teal"
                      />
                   </div>
                </div>
                <div className="flex items-center space-x-6">
                   <button onClick={() => setFocusMode(!focusMode)} className="text-white hover:text-registry-teal transition-colors">
                     <Maximize2 className="w-6 h-6" />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Reaction Bar */}
        {!focusMode && (
          <div className="mt-8 flex items-center justify-center space-x-4 z-10">
            <button onClick={() => sendReaction('heart')} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-registry-rose hover:text-white transition-all transform hover:scale-110 active:scale-90">
               <Heart className="w-6 h-6" />
            </button>
            <button onClick={() => sendReaction('brain')} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-registry-cobalt hover:text-white transition-all transform hover:scale-110 active:scale-90">
               <Brain className="w-6 h-6" />
            </button>
            <button onClick={() => sendReaction('zap')} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-110 active:scale-90">
               <Zap className="w-6 h-6" />
            </button>
            <button onClick={() => sendReaction('spark')} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-registry-teal hover:text-white transition-all transform hover:scale-110 active:scale-90">
               <Sparkles className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {!focusMode && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className={`w-full md:w-[400px] border-l border-white/10 flex flex-col z-50 backdrop-blur-2xl shadow-2xl ${isDarkMode ? 'bg-stealth-900/50' : 'bg-white/50'}`}
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-registry-teal" />
                <h2 className="font-black italic uppercase tracking-tighter text-xl">Pulse Chat</h2>
              </div>
              <Shield className="w-4 h-4 opacity-30" />
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m) => (
                <div key={m.id} className="space-y-1 group">
                   <div className="flex items-baseline space-x-2">
                     <span className={`text-[11px] font-black uppercase tracking-widest ${m.role === 'harvey' ? 'text-registry-rose' : m.role === 'admin' ? 'text-slate-400' : 'text-registry-teal'}`}>
                       {m.user}
                     </span>
                     <span className="text-[11px] opacity-20 group-hover:opacity-40 transition-opacity">
                       {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                   </div>
                   <p className={`text-sm md:text-base leading-relaxed ${m.role === 'admin' ? 'italic opacity-60' : 'font-medium'}`}>
                      {m.text}
                   </p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* AI Harvey Commentary Logic Component */}
            <AnimatePresence>
              {harveyEnabled && messages.length > 5 && messages[messages.length-1].user !== 'Harvey' && (
                 <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mx-6 mb-4 p-4 rounded-2xl bg-registry-rose/10 border border-registry-rose/20 relative overflow-hidden"
                 >
                    <div className="absolute top-0 left-0 w-1 h-full bg-registry-rose" />
                    <div className="flex items-center space-x-2 mb-2">
                       <Brain className="w-3 h-3 text-registry-rose" />
                       <span className="text-[11px] font-black uppercase tracking-widest text-registry-rose">Harvey Intel</span>
                    </div>
                    <p className="text-xs italic opacity-80 leading-snug">"The chat seems to be struggling with Phase Shift harmonics. Remember: change in frequency directly relates to the target velocity."</p>
                 </motion.div>
              )}
            </AnimatePresence>

            <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Sync a thought..."
                  className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium focus:ring-2 focus:ring-registry-teal/50 outline-none transition-all placeholder:text-white/20"
                />
                <button 
                  onClick={sendMessage}
                  className="absolute right-3 top-3 p-2 bg-registry-teal text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-registry-teal/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options Overlay */}
      <AnimatePresence>
        {showOptions && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 right-8 w-[320px] p-8 glass-dark rounded-[2.5rem] border border-white/10 shadow-3xl z-[150]"
          >
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-black italic uppercase tracking-tighter text-xl text-registry-teal">Live Protocol</h3>
                <Settings className="w-4 h-4 opacity-50" />
              </div>
              
              <div className="space-y-6">
                <OptionItem 
                  icon={Sparkles} 
                  label="Harvey Commentary" 
                  desc="AI-driven live clinical insights"
                  active={harveyEnabled}
                  onToggle={() => setHarveyEnabled(!harveyEnabled)}
                />
                <OptionItem 
                  icon={Activity} 
                  label="Neural Overlay" 
                  desc="Interactive wave transparency"
                  active={overlayEnabled}
                  onToggle={() => setOverlayEnabled(!overlayEnabled)}
                />
                <OptionItem 
                  icon={Eye} 
                  label="Focus Interface" 
                  desc="Hide non-essential data hubs"
                  active={focusMode}
                  onToggle={() => setFocusMode(!focusMode)}
                />
                <OptionItem 
                  icon={Headphones} 
                  label="Studio Monitoring" 
                  desc="Direct audio field feedback"
                  active={true}
                  onToggle={() => {}}
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => setShowOptions(false)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                >
                  Confirm Configuration
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const OptionItem = ({ icon: Icon, label, desc, active, onToggle }: any) => (
  <div className="flex items-center justify-between group cursor-pointer" onClick={onToggle}>
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-xl border transition-all ${active ? 'bg-registry-teal/20 border-registry-teal text-registry-teal' : 'bg-white/5 border-white/10 opacity-40'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className={`text-xs font-black uppercase tracking-widest transition-opacity ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</p>
        <p className="text-[11px] opacity-40 italic">{desc}</p>
      </div>
    </div>
    <div className={`w-10 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-registry-teal' : 'bg-white/10'}`}>
      <motion.div 
        animate={{ x: active ? 18 : 4 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </div>
  </div>
);
