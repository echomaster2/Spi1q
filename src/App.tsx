import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
console.log("📱 App Module Loading...");
import { generateText, generateSpeech, AIServiceError } from './services/aiService';
import { decodeBase64, decodeAudioData } from './lib/audioUtils';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { StudyPlan } from './components/StudyPlan';
import { AudioPlayer } from './components/AudioPlayer';
import { 
  Waves, CheckCircle, 
  Menu, X, Trophy, Brain, Radio, Activity, Monitor,
  Sparkles, GraduationCap, ClipboardCheck, 
  Medal, Zap, TrendingUp, Award, PlayCircle, Loader2, Music, Download, Globe,
  AlertTriangle, ShieldCheck, Home, Calendar, Bot, Stethoscope,
  FileText, Target, Timer, Volume2, Quote, Play, Headphones, HeartPulse, FlaskConical, Target as TargetIcon,
  Sun, Moon, Cloud, Bell, Layers, Info, Terminal, Cpu, Database, Book, Pause, VolumeX, ChevronRight, ChevronLeft, Gauge, Save, ScrollText, User, Users,
  Mic2, Library, HelpCircle, Search,
  LayoutGrid, Settings as SettingsIcon, Lock, Shield, Power, Crown, Maximize, Minimize, Video, Image as ImageIcon, BarChart3,
  Sword,
  Coins, Flame, ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { auth, onAuthStateChanged, signInWithGoogle, logout } from './firebase';
import { firebaseService } from './services/firebaseService';
import { 
  TransducerCrossSection,
  ReceiverPipelineVisual,
  LongitudinalWaveVisual,
  WaveParametersVisual,
  ArrayTypesVisual,
  PulseEchoPrincipleVisual,
  DisplayModesVisual,
  ResolutionComparison,
  BioeffectMechanismsVisual,
  HarmonicImagingVisual,
  WaveInteractionVisual,
  ReflectionLab,
  RefractionLab,
  ScatteringLab,
  BeamFocusVisual,
  DopplerModalitiesVisual,
  FlowPatternsVisual,
  QAPhantomVisual,
  DopplerShiftVisual,
  ArtifactsVisual,
  SafetyIndicesVisual,
  HemodynamicsPrinciplesVisual,
  SonarPulse,
  SpeedOfSoundTable,
  AttenuationComparison,
  FresnelFraunhoferVisual,
  DynamicRangeVisual,
  AliasingVisual,
  AcousticImpedanceVisual,
  DutyFactorVisual,
  ScanConverterVisual,
  IntensityProfileVisual,
  SpecularScatteringVisual,
  DampingResolutionExplainer,
  DopplerAngleExplainer,
  StenosisHemodynamicsExplainer,
  HuygensPrincipleVisual,
  CavitationVisual,
  TemporalResolutionVisual,
  DemodulationVisual,
  SideLobeVisual,
  DeadZoneVisual,
  TGCVisual,
  ColorVarianceVisual,
  PrePostProcessingVisual,
  LectureTag,
  AttenuationSimulator,
  BeamLab,
  ElastographyVisual,
  PulseInversionVisual,
  ContrastAgentVisual,
  NyquistLimitVisual,
  ColorDopplerVisual,
  SpectralDopplerVisual,
  DopplerAngleVisual,
  KnowledgeVisual
} from './components/VisualElements';
import { AITutor } from './components/AITutor';
import { CompanionAvatar } from './components/CompanionAvatar';
import { Reminders } from './components/Reminders';
import { ExamEngine } from './components/ExamEngine';
import { Flashcards } from './components/Flashcards';
import { Glossary, SPI_GLOSSARY } from './components/Glossary';
import { AdvancedQuiz } from './components/AdvancedQuiz';
import { UserProfile } from './components/UserProfile';
import { LegalDocs } from './components/LegalDocs';
import { Pricing } from './components/Pricing';
import { GlobalRadio } from './components/GlobalRadio';
import { VisualItem } from './mediaData';
import { useRadio } from './context/RadioContext';
import { StudyStreak } from './components/StudyStreak';
import { DailyChallenge } from './components/DailyChallenge';
import { StudyAnalytics } from './components/StudyAnalytics';
import { Settings } from './components/Settings';
import { Achievements } from './components/Achievements';
import { NeuralLoad } from './components/NeuralLoad';
import { FullscreenToggle } from './components/FullscreenToggle';
import { AssetLibrary } from './components/AssetLibrary';
import { PodcastDemo } from './components/PodcastDemo';
import { BrainXTalks } from './components/BrainXTalks';
import { SonographyLounge } from './components/SonographyLounge';
import { VictoryOverlay } from './components/VictoryOverlay';
import { DailyInsight } from './components/DailyInsight';
import { MediaLibrary } from './components/MediaLibrary';
import { AdminDashboard } from './components/AdminDashboard';
import { InteractiveWave } from './components/InteractiveWave';
import { OnboardingTour } from './components/OnboardingTour';
import { QuestSystem } from './components/QuestSystem';
import { updateQuestProgress, checkModuleCompletionQuests } from './lib/questUtils';
import { LiveSuite } from './components/LiveSuite';
import { ScenarioSim } from './components/ScenarioSim';
import { RegistryLab } from './components/RegistryLab';
import { modules } from './data/modules';
import { lessonContent as externalLessonContent } from './data/lessonContent';
import { CinematicIntro } from './components/CinematicIntro';
import { CLINICAL_TIPS } from './constants/clinicalTips';
import { AudioCache } from './lib/audioCache';
import { playSound } from './lib/soundEffects';
import { Module, LessonContentMap, Win, ExamQuestion, ExamResults, AdvancedQuestion, UserProfile as UserProfileType, LessonData } from './types';

// --- PARALLAX BACKGROUND ---
const ParallaxBackground: React.FC<{ isDarkMode: boolean; bgImage?: string | null }> = ({ isDarkMode, bgImage }) => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {bgImage ? (
          <motion.div 
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: isDarkMode ? 0.25 : 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center filter brightness-75 contrast-125 saturate-150 grayscale-[0.2]"
            style={{ 
              backgroundImage: `url(${bgImage})`,
              y: scrollY * 0.05
            }}
          >
            {/* Tech Integration Overlays */}
            <div className="absolute inset-0 bg-registry-teal/10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,4px_100%] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-stealth-950/20 via-transparent to-stealth-950/40" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <motion.div 
        style={{ y: scrollY * 0.1 }}
        className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-[0.03] dark:opacity-[0.05]"
      >
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-registry-teal rounded-full blur-[140px]" />
        <div className="absolute top-[60%] left-[70%] w-96 h-96 bg-registry-rose rounded-full blur-[160px]" />
        <div className="absolute top-[30%] left-[40%] w-80 h-80 bg-registry-cobalt rounded-full blur-[150px]" />
      </motion.div>
      
      <motion.div 
        style={{ y: scrollY * -0.05 }}
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
      >
        <div className="absolute top-[20%] left-[80%] w-48 h-48 bg-registry-teal rounded-full blur-[100px]" />
        <div className="absolute top-[80%] left-[20%] w-72 h-72 bg-registry-amber rounded-full blur-[120px]" />
      </motion.div>
    </div>
  );
};

// --- REGISTRY COUNTDOWN COMPONENT ---
const RegistryCountdown: React.FC<{ targetDate?: string, isDarkMode: boolean }> = ({ targetDate, isDarkMode }) => {
  if (!targetDate) return null;
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  
  if (diff <= 0) return null; // Date passed

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`p-5 md:p-8 rounded-[2rem] md:rounded-[3.5rem] border shadow-2xl flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden group ${isDarkMode ? 'bg-stealth-900 border-registry-rose/20' : 'bg-white border-registry-rose/20'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-registry-rose/5 to-transparent pointer-events-none" />
      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-registry-rose mb-2 opacity-80" />
      <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">T-Minus to Registry</span>
      <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter text-registry-rose">
        {days} <span className="text-lg md:text-xl">DAYS</span>
      </h3>
    </motion.div>
  );
};

// --- LESSON ANTHEM COMPONENT ---
const LessonAnthem: React.FC<{ stationName: string }> = ({ stationName }) => {
  const { stations, changeStation, currentStation, isPlaying, togglePlay } = useRadio();
  
  const station = stations.find(s => s.name === stationName);
  const isActive = currentStation?.name === stationName;

  if (!station) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-slate-100 dark:bg-registry-teal/5 border border-slate-300 dark:border-registry-teal/20 rounded-2xl flex items-center justify-between group hover:bg-slate-200 dark:hover:bg-registry-teal/10 transition-all shadow-sm dark:shadow-none"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-registry-teal/10 dark:bg-registry-teal/20 rounded-xl">
          <Music className="w-5 h-5 text-registry-teal" />
        </div>
        <div>
          <h5 className="text-[11px] font-black uppercase text-registry-teal tracking-widest">Lesson Anthem</h5>
          <p className="text-xs font-bold italic text-slate-900 dark:text-white">{stationName}</p>
        </div>
      </div>
      <button 
        onClick={() => {
          if (isActive) {
            togglePlay();
          } else {
            changeStation(station);
          }
        }}
        className="p-3 bg-registry-teal text-stealth-950 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        {isActive && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
    </motion.div>
  );
};

// --- CURRICULUM DEFINITION ---

const lessonContent: LessonContentMap = externalLessonContent;

const staticNarrationScripts: Record<string, string> = {
  dashboard: "Welcome to the SPI Master Registry Dashboard. Here you can track your progress across all eleven modules of the ARDMS Content Outline. Select a node to begin your deep dive into ultrasound physics.",
  plan: "Your Strategic Study Protocol is a personalized roadmap to registry success. It combines spaced repetition intervals with spiritual timing windows to maximize your cognitive retention and energy management.",
  flashcards: "The Synaptic Recall Nodes use active recall and spaced repetition. Review these cards daily to move physics concepts from short-term memory into your long-term registry-ready knowledge base.",
  glossary: "The Physics Lexicon Vault is your comprehensive dictionary of ultrasound instrumentation. Every term is defined with precision to match the language you will encounter on the SPI exam.",
  profile: "Your Operator Profile tracks your unique study metrics and daily insights. Keep your birth data updated to refine your spiritual study windows and monitor your path to mastery.",
  legal: "Compliance Protocols ensure you understand the educational nature of this platform. SPI Master is a tool for preparation and excellence, designed to support your clinical journey.",
  tutor: "The Neural AI Interface is your direct line to expert physics guidance. Ask any question, and the system will provide high-yield explanations tailored to the SPI curriculum.",
  reminders: "The Notification Pulse system ensures you never miss a critical study window. Set your daily alerts to maintain your synaptic momentum and registry readiness.",
  sidebar: "The Registry Node Map structures the entire SPI curriculum into eleven high-yield modules. Navigate through the nodes to master each physical principle in sequence.",
  exam: "Welcome to the SPI Mock Exam Simulation. This is a high-stakes environment designed to test your mastery under pressure. You have 30 minutes to complete 10 high-yield questions. Good luck, Operator."
};

// --- DASHBOARD SUB-COMPONENTS ---

const MissionCard: React.FC<{ isDarkMode: boolean; onContinue: () => void }> = ({ isDarkMode, onContinue }) => (
  <motion.section 
    whileHover={{ y: -4 }}
    className={`relative p-8 md:p-20 ${isDarkMode ? 'bg-stealth-900/60' : 'bg-white'} rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-premium border ${isDarkMode ? 'border-white/5' : 'border-slate-200'} group aspect-video lg:h-[550px] flex flex-col justify-end backdrop-blur-xl`}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(0,210,255,0.08),transparent_60%)] pointer-events-none" />
    <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
    <div className="absolute top-8 left-8 md:top-16 md:left-16 flex items-center space-x-4">
       <div className="w-12 h-12 bg-registry-teal/10 rounded-[1.25rem] flex items-center justify-center backdrop-blur-md border border-registry-teal/20 shadow-glow shadow-registry-teal/5">
         <Target className="w-6 h-6 text-registry-teal drop-shadow-glow" />
       </div>
       <div>
         <span className="technical-label !text-registry-teal">Mission Objective</span>
         <span className={`${isDarkMode ? 'text-white' : 'text-slate-900'} text-[11px] font-mono opacity-40 font-bold uppercase tracking-widest`}>#STRAT-PROT-99.v4</span>
       </div>
    </div>
    
    <div className="relative z-10 space-y-8">
       <div className="space-y-2">
         <div className="flex items-center space-x-2">
           <span className="micro-label !text-registry-teal animate-pulse">Syncing Cognitive Core</span>
           <div className="w-32 h-[1px] bg-registry-teal/20" />
         </div>
         <h2 className={`text-3xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] ${isDarkMode ? 'text-white' : 'text-slate-900'} transform origin-left group-hover:scale-[1.01] transition-transform duration-700 max-w-4xl drop-shadow-2xl`}>
           Stay. Breathe.<br/>Master.
         </h2>
       </div>
       <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
         <p className="text-registry-teal text-xs md:text-lg font-black uppercase tracking-[0.3em] opacity-80 border-l-4 border-registry-teal pl-8 italic max-w-md">
           Failure is not a state,<br/>it is a data point.
         </p>
         <motion.button 
           whileHover={{ scale: 1.05, x: 10 }}
           whileTap={{ scale: 0.95 }}
           onClick={onContinue}
           className="px-8 py-5 md:px-12 md:py-6 bg-registry-teal text-stealth-950 rounded-[1.5rem] md:rounded-[2.5rem] font-black italic uppercase text-xs tracking-[0.3em] shadow-glow shadow-registry-teal/40 flex items-center space-x-4 group/btn"
         >
           <Play className="w-4 h-4 fill-current" />
           <span>Resume Protocol</span>
         </motion.button>
       </div>
    </div>
    <ShieldCheck className={`absolute -bottom-24 -right-24 w-[32rem] h-[32rem] ${isDarkMode ? 'text-white/5' : 'text-slate-900/5'} -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-[3s] blur-sm`} />
  </motion.section>
);

const VisualizerTile: React.FC<{ 
  title: string; 
  id: string; 
  icon: React.ElementType; 
  color: string; 
  children: React.ReactNode; 
}> = ({ title, id, icon: Icon, color, children }) => (
  <div className="premium-glass flex flex-col rounded-[3rem] border tech-border shadow-premium overflow-hidden relative group h-[280px]">
    <div className="p-8 flex-1 flex flex-col z-10 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="text-lg font-black uppercase italic tracking-tighter">{title}</h3>
        </div>
        <span className={`text-[11px] font-mono ${color} opacity-50`}>{id}</span>
      </div>
      <div className="flex-1 rounded-2xl overflow-hidden relative border border-white/5 bg-black/20">
        {children}
      </div>
    </div>
  </div>
);

const HudMetricsBar: React.FC<{ progressPercent: number; isDarkMode: boolean }> = ({ progressPercent, isDarkMode }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
     {[
       { label: 'Neural Progress', value: `${progressPercent}%`, icon: Brain, color: 'text-registry-teal', sub: 'SYNC_STABLE' },
       { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-registry-rose', sub: 'HIGH_FIDELITY' },
       { label: 'Registry Readiness', value: `${Math.round(progressPercent)}%`, icon: Award, color: 'text-registry-amber', sub: 'QUALIFIED' },
       { label: 'Active Linkage', value: 'STABLE', icon: Zap, color: 'text-registry-cobalt', sub: 'SECURE_V4' },
     ].map((stat, i) => (
       <div key={i} className="premium-glass p-8 rounded-[2rem] border tech-border shadow-soft flex flex-col items-center text-center space-y-3 group hover:border-registry-teal/30 transition-all hover:scale-[1.02] duration-500">
          <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-registry-teal/10 transition-colors">
            <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform drop-shadow-glow`} />
          </div>
          <div className="space-y-1">
            <span className={`micro-label !text-slate-500`}>{stat.label}</span>
            <div className="flex flex-col">
              <span className="text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white">{stat.value}</span>
              <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${stat.color} opacity-40 mt-1`}>{stat.sub}</span>
            </div>
          </div>
       </div>
     ))}
  </div>
);

const BentoCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  icon?: any; 
  title: string; 
  label: string; 
  accentColor: string;
  isDarkMode: boolean;
  onClick?: () => void;
  overlayIcon?: any;
}> = ({ children, className, icon: Icon, title, label, accentColor, isDarkMode, onClick, overlayIcon: OverlayIcon }) => (
  <motion.section
    whileHover={{ y: -6, scale: 1.005 }}
    whileTap={onClick ? { scale: 0.985 } : undefined}
    onClick={onClick}
    className={`premium-glass p-6 md:p-10 group cursor-pointer flex flex-col min-h-[300px] md:min-h-[380px] justify-between transition-all duration-500 hover:shadow-glow relative overflow-hidden backdrop-blur-2xl border tech-border rounded-[1.5rem] md:rounded-[2.5rem] tech-glow-anim ${className}`}
  >
    {/* Identification Serial */}
    <div className="absolute top-8 right-10 origin-right rotate-90 hidden md:block opacity-10 group-hover:opacity-30 transition-opacity">
       <span className="text-[11px] font-mono font-black tracking-[0.5em] uppercase tabular-nums">SN_%{title.toUpperCase().substring(0,6)}%</span>
    </div>

    {/* Micro Details */}
    <div className="absolute top-4 left-4 w-1 h-1 bg-white/20 rounded-full" />
    <div className="absolute top-4 right-4 w-1 h-1 bg-white/20 rounded-full" />
    <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/20 rounded-full" />
    <div className="absolute bottom-4 right-4 w-1 h-1 bg-white/20 rounded-full" />
    
    <div className="absolute inset-0 scanline opacity-[0.02] pointer-events-none" />
    <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
    
    {OverlayIcon && (
      <div className="absolute -top-12 -right-12 p-10 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-700 pointer-events-none transform -rotate-12 group-hover:rotate-0 group-hover:scale-105">
        <OverlayIcon className={`w-72 h-72 ${accentColor}`} />
      </div>
    )}
    
    <div className="relative z-10 w-full h-full flex flex-col">
      <div className="flex items-center gap-5 mb-8">
        {Icon && (
          <div className={`p-3.5 rounded-2xl shadow-inner ${accentColor.replace('text-', 'bg-')}/10 ${accentColor} border border-current/15 relative`}>
            <Icon className="w-6 h-6 drop-shadow-glow" />
            <motion.div 
               animate={{ opacity: [0.4, 1, 0.4] }}
               transition={{ duration: 2, repeat: Infinity }}
               className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-current ${accentColor} blur-[2px]`}
            />
          </div>
        )}
        <div className="flex flex-col">
          <span className="technical-label">{label}</span>
          <h4 className={`text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-tight mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'} group-hover:text-registry-teal transition-colors`}>
            {title}
          </h4>
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
    
    {onClick && (
      <div className="mt-8 flex justify-end relative z-10">
          <motion.div 
          whileHover={{ x: 8, backgroundColor: 'rgba(0, 245, 255, 0.2)' }}
          className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.4em] italic ${accentColor.replace('text-', 'bg-')}/10 ${accentColor} border border-current/10 group-hover:border-current/40 transition-all flex items-center space-x-3 group/btn`}
        >
          <span>Initialize Node</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </motion.div>
      </div>
    )}
  </motion.section>
);

const SystemBroadcastMonitor: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [bitrate, setBitrate] = useState(4.2);
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setBitrate(prev => parseFloat((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
      setLatency(prev => Math.max(12, Math.min(48, prev + Math.floor(Math.random() * 6 - 3))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BentoCard
      title="System Intelligence"
      label="Live Sync Protocol"
      accentColor="text-registry-teal"
      isDarkMode={isDarkMode}
      icon={Cpu}
      overlayIcon={Activity}
      className={isDarkMode ? 'bg-registry-teal/5' : 'bg-registry-teal/5'}
    >
      <div className="space-y-6 flex-1 flex flex-col justify-between">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
               <span className="micro-label opacity-100 italic">Sync Latency</span>
               <div className="flex items-end space-x-1">
                 <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{latency}</span>
                 <span className="text-[11px] font-black opacity-40 pb-0.5">MS</span>
               </div>
             </div>
             <div className="w-20 h-10 flex items-end justify-between px-1 bg-black/5 dark:bg-white/5 rounded-lg p-1">
               {Array.from({ length: 10 }).map((_, i) => (
                 <motion.div 
                   key={i} 
                   animate={{ height: `${20 + Math.random() * 80}%` }}
                   transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                   className={`w-1 rounded-full transition-all duration-500 ${i < (latency / 6) ? 'bg-registry-teal animate-pulse shadow-glow' : 'bg-white/10'}`} 
                 />
               ))}
             </div>
          </div>
          
          <div className="h-px w-full bg-gradient-to-r from-transparent via-registry-teal/30 to-transparent" />
          
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
               <span className="micro-label opacity-100 italic">Data Bitrate</span>
               <div className="flex items-end space-x-1">
                 <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{bitrate}</span>
                 <span className="text-[11px] font-black opacity-40 pb-0.5">MBPS</span>
               </div>
             </div>
             <div className="flex flex-col items-end">
               <span className="micro-label opacity-100 italic text-registry-teal">Uptime Active</span>
               <span className="text-xs font-mono font-black text-slate-900 dark:text-white">04:12:44:02</span>
             </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-4 py-3 bg-registry-teal/5 rounded-2xl border border-registry-teal/10 shadow-inner">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-ping shadow-glow" />
              <span className="micro-label opacity-100 text-registry-teal italic">Neural Sync Active</span>
            </div>
            <span className="text-[11px] font-mono font-black text-slate-500">ND-12B</span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 italic line-clamp-2">
            Self-correcting metadata stream identified 4 structural optimizations in the current neural map.
          </p>
        </div>
      </div>
    </BentoCard>
  );
};
const ClinicalPearlCard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const pearl = CLINICAL_TIPS[new Date().getDate() % CLINICAL_TIPS.length];
  return (
    <BentoCard
      title="Pearl of the Day"
      label="Clinical Insight"
      accentColor="text-registry-cobalt"
      isDarkMode={isDarkMode}
      icon={Zap}
      overlayIcon={Stethoscope}
      className="bg-registry-cobalt/5"
    >
      <div className="space-y-4">
        <p className={`text-base md:text-lg font-medium leading-relaxed italic ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} line-clamp-4`}>
          "{pearl.content}"
        </p>
        <div className="flex items-center space-x-2">
          <div className="h-px flex-1 bg-registry-cobalt/20" />
          <span className="px-3 py-1 bg-registry-cobalt/10 rounded-full text-[11px] font-black uppercase tracking-widest text-registry-cobalt">
            {pearl.category}
          </span>
        </div>
      </div>
    </BentoCard>
  );
};

const MediaLibraryCard: React.FC<{ isDarkMode: boolean; onClick: () => void }> = ({ isDarkMode, onClick }) => (
  <BentoCard
    title="Media Archives"
    label="Video Transmission"
    accentColor="text-registry-teal"
    isDarkMode={isDarkMode}
    icon={PlayCircle}
    overlayIcon={Video}
    onClick={onClick}
    className="bg-registry-teal/5"
  >
    <p className={`text-base md:text-lg font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} line-clamp-3`}>
      Comprehensive visual protocols for Physics, Abdominal, and Vascular imaging.
    </p>
  </BentoCard>
);

const LiveStudioCard: React.FC<{ isDarkMode: boolean; onClick: () => void }> = ({ isDarkMode, onClick }) => (
  <BentoCard
    title="Phase Live Studio"
    label="Broadcast Protocol"
    accentColor="text-registry-rose"
    isDarkMode={isDarkMode}
    icon={Radio}
    overlayIcon={HeartPulse}
    onClick={onClick}
    className="bg-registry-rose/5"
  >
    <div className="space-y-6 relative flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 z-20">
        <div className="flex items-center space-x-2 px-2 py-1 md:px-3 md:py-1 bg-red-500/10 border border-red-500/20 rounded-full backdrop-blur-md">
           <div className="w-1.5 h-1.5 bg-registry-rose rounded-full animate-pulse shadow-glow" />
           <span className="text-[11px] md:text-[11px] font-black text-red-500 uppercase tracking-widest">Live Now</span>
        </div>
      </div>
      
      <p className={`text-sm md:text-base font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2 line-clamp-3`}>
        Join the atmospheric study pulse. Real-time physics deep-dives with the community.
      </p>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mt-auto">
        <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-black/5 dark:bg-white/5 border border-white/5 flex flex-col">
          <span className="micro-label opacity-60 text-[11px] mb-1 leading-none uppercase tracking-widest">Signal Bitrate</span>
          <div className="flex items-end space-x-1">
            <span className="text-sm md:text-lg font-mono font-bold leading-none">4.2</span>
            <span className="text-[11px] font-mono opacity-40 pb-0.5 uppercase">Mbps</span>
          </div>
        </div>
        <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-black/5 dark:bg-white/5 border border-white/5 flex flex-col relative overflow-hidden">
          <div className="absolute right-2 top-2">
            <div className="flex space-x-0.5 items-end h-2.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-0.5 rounded-full ${i < 4 ? 'bg-registry-rose' : 'bg-white/10'}`} style={{ height: `${i * 25}%` }} />
              ))}
            </div>
          </div>
          <span className="micro-label opacity-60 text-[11px] mb-1 leading-none uppercase tracking-widest">Active Syncs</span>
          <span className="text-sm md:text-lg font-mono font-bold leading-none">1.2K</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/5 mt-auto">
        <div className="flex -space-x-2 group-hover:space-x-1 transition-all">
           {[1,2,3,4].map(i => (
             <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl border-2 border-white dark:border-stealth-900 bg-slate-200 dark:bg-stealth-800 flex items-center justify-center overflow-hidden shadow-sm transition-transform hover:-translate-y-1">
               <img src={`https://i.pravatar.cc/100?img=${i + 12}`} alt="Active viewer" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             </div>
           ))}
           <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl border-2 border-white dark:border-stealth-900 bg-registry-rose/20 text-registry-rose flex items-center justify-center text-[11px] md:text-[11px] font-black italic">
             +89
           </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-registry-teal shadow-glow" />
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500 italic">Connected</span>
        </div>
      </div>
    </div>
  </BentoCard>
);

const SystemStatusRadial: React.FC<{ progressPercent: number; isDarkMode: boolean; onSidebar: () => void; onExam: () => void }> = ({ progressPercent, isDarkMode, onSidebar, onExam }) => (
  <section className="space-y-6">
     <div className="flex items-center space-x-3 px-2 text-registry-rose">
        <div className="p-3 bg-registry-rose/10 dark:bg-registry-rose/20 rounded-[1.25rem]"><ClipboardCheck className="w-5 h-5 drop-shadow-glow" /></div>
        <h4 className="text-xl font-black uppercase italic tracking-tighter">System Fidelity</h4>
     </div>
     <div 
       onClick={onSidebar}
       className="premium-glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border tech-border flex flex-col items-center justify-center space-y-10 md:space-y-12 shadow-premium cursor-pointer hover:border-registry-rose/30 transition-all group relative overflow-hidden backdrop-blur-3xl"
     >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,51,102,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative w-48 h-48 md:w-64 md:h-64 group-hover:scale-105 transition-transform duration-700">
           <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.2)]">
             <circle cx="50%" cy="50%" r="42%" fill="transparent" stroke="currentColor" strokeWidth="14" className="text-slate-50 dark:text-white/5 md:stroke-[16]" />
             <motion.circle 
               cx="50%" cy="50%" r="42%" fill="transparent" stroke="currentColor" strokeWidth="14" 
               strokeDasharray="100" 
               initial={{ strokeDashoffset: 100 }}
               animate={{ strokeDashoffset: 100 - progressPercent }}
               className="text-registry-rose transition-all duration-1000 shadow-glow md:stroke-[16]" 
               strokeLinecap="round" 
               pathLength="100"
             />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none group-hover:text-registry-rose transition-colors">{Math.round(progressPercent)}%</span>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] mt-2 md:mt-3">Retention</span>
           </div>
        </div>
        <div className="text-center space-y-6 md:space-y-8 w-full">
           <div className="flex flex-col items-center space-y-1">
             <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Protocol Scan Ready</p>
             <div className="w-10 md:w-12 h-0.5 bg-registry-rose/20 rounded-full" />
           </div>
           <div className="pt-2">
             <button 
               onClick={(e) => { e.stopPropagation(); onExam(); }}
               className="w-full py-5 md:py-6 bg-registry-rose text-white rounded-[1.5rem] md:rounded-[2rem] font-black italic uppercase text-xs tracking-[0.3em] shadow-2xl shadow-registry-rose/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 md:space-x-4 group/btn relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
               <Trophy className="w-5 h-5 group-hover/btn:rotate-12 transition-transform relative z-10" />
               <span className="relative z-10">Initialize Assessment</span>
             </button>
           </div>
        </div>
     </div>
  </section>
);

// --- PREMIUM TOP BAR ---
const PremiumTopBar: React.FC<{ 
  onOpenSidebar: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  profile: UserProfileType | null;
  totalCompleted: number;
  activeOverlay: string | null;
  current: [number, number] | null;
  sidebarCollapsed: boolean;
}> = ({ onOpenSidebar, onOpenProfile, onOpenSettings, onClose, isDarkMode, onToggleTheme, profile, totalCompleted, activeOverlay, current, sidebarCollapsed }) => {
  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 transition-all duration-500 ${sidebarCollapsed ? 'lg:left-20' : 'lg:left-80'} right-0 z-[100] px-6 py-4 md:px-10 md:py-6 pointer-events-none`}
    >
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3 pointer-events-auto lg:hidden">
          <button 
            onClick={activeOverlay === 'sidebar' ? onClose : onOpenSidebar}
            className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white shadow-glow' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}
          >
            {activeOverlay === 'sidebar' ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        <AnimatePresence>
          {(activeOverlay || current) && (
            <motion.div 
               initial={{ y: 100, x: '-50%', opacity: 0 }}
               animate={{ y: 0, x: '-50%', opacity: 1 }}
               exit={{ y: 100, x: '-50%', opacity: 0 }}
               className="fixed bottom-24 lg:bottom-12 left-1/2 z-[500] pointer-events-auto"
            >
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose} 
                className="px-8 py-4 text-stealth-950 font-black uppercase tracking-[0.4em] italic transition-all bg-registry-rose shadow-premium shadow-registry-rose/40 border border-white/20 rounded-full flex items-center space-x-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <X className="w-4 h-4 relative z-10" />
                <span className="text-[11px] relative z-10">{activeOverlay === 'settings' ? 'Commit & Exit' : 'Exit Protocol'}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

          <div className="flex items-center space-x-6 pointer-events-auto ml-auto">
            <FullscreenToggle 
              className={`hidden md:flex p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-white/5 border-white/10 text-white shadow-glow' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}
              iconClassName="w-4.5 h-4.5"
            />
            <div className="hidden md:flex items-center space-x-6 premium-glass rounded-xl px-5 py-2.5 tech-border shadow-glow shadow-registry-teal/5">
            <div className="flex items-center space-x-4 border-r border-white/10 pr-4">
               <div className="flex space-x-1">
                 {[1, 2, 3, 4, 5].map(i => (
                    <motion.div 
                      key={i} 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                      className={`w-0.5 h-3 rounded-full ${i <= 3 ? 'bg-registry-teal' : 'bg-white/10'}`} 
                    />
                 ))}
               </div>
               <div className="flex flex-col">
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Node_Sync</span>
                 <span className="text-[11px] font-mono font-black text-registry-teal uppercase tracking-widest leading-none mt-0.5">ACTIVE.v4</span>
               </div>
            </div>
            <div className="flex items-center space-x-4">
              {['DIAG', 'NEURAL', 'BIO'].map((label) => (
                <div key={label} className="flex items-center space-x-1.5">
                   <div className="w-1 h-1 rounded-full bg-registry-teal shadow-glow" />
                   <span className={`text-[11px] font-black ${isDarkMode ? 'text-white/40' : 'text-slate-500'} uppercase tracking-[0.2em] italic`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={onOpenProfile}
            className="hidden md:block relative group p-0.5 transition-all duration-500 hover:scale-105 active:scale-95"
          >
            <div className={`relative w-11 h-11 rounded-lg ${isDarkMode ? 'bg-stealth-900 border-white/10 shadow-premium' : 'bg-white border-slate-200 shadow-premium-light'} border flex items-center justify-center transition-all group-hover:border-registry-teal/50`}>
              <User className="w-4.5 h-4.5 relative z-10 transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-1 right-1">
                <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse shadow-glow" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- DASHBOARD HUD ---
const DashboardHUD: React.FC<{ progress: number; isDarkMode: boolean }> = ({ progress, isDarkMode }) => {
  const stats = [
    { label: 'Neural Integration', value: `${progress}%`, icon: Brain, color: 'text-registry-teal', bg: 'bg-registry-teal/10', trend: 'SYNCING', subValue: '2.173913', desc: 'Active Uplink' },
    { label: 'Signal Velocity', value: '1.2c', icon: Zap, color: 'text-registry-amber', bg: 'bg-registry-amber/10', trend: 'SUPER_STABLE', subValue: '2.4 PB/s', desc: 'Linear Flow' },
    { label: 'Active Linkage', value: '14/48', icon: Activity, color: 'text-registry-rose', bg: 'bg-registry-rose/10', trend: 'RE-LINKING', subValue: 'Lat: 4ms', desc: 'Sync Matrix' },
    { label: 'Diagnostic Load', value: '38.2%', icon: Gauge, color: 'text-registry-cobalt', bg: 'bg-registry-cobalt/10', trend: 'OPTIMAL', subValue: 'CPU: 12%', desc: 'Thermal Nominal' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 relative z-10">
      {stats.map((stat, i) => (
        <motion.div
           key={stat.label + i}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           whileHover={{ y: -12, scale: 1.02 }}
           transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
           className="bg-stealth-900/60 backdrop-blur-3xl p-10 md:p-12 rounded-[3rem] border-2 border-white/5 shadow-2xl group flex flex-col min-h-[340px] relative overflow-hidden"
        >
           {/* Static Scanline Overlay */}
           <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
           
           {/* Top Accent Bar */}
           <div className={`absolute top-0 left-12 right-12 h-1 ${stat.color.replace('text-', 'bg-')} opacity-30 shadow-glow shadow-current/40`} />

           {/* Hardware Identification Labels */}
           <div className="absolute top-8 right-10 flex gap-2 opacity-30">
              <div className="text-[8px] font-mono font-black uppercase text-white/40 tracking-widest">{stat.desc}</div>
           </div>

           <div className="flex items-start justify-between mb-12 relative z-10">
              <div className={`p-6 ${stat.bg} rounded-[1.75rem] border-2 border-white/10 shadow-glow shadow-current/10 group-hover:scale-110 transition-transform duration-500`}>
                 <stat.icon className={`w-8 h-8 ${stat.color} drop-shadow-glow`} />
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${stat.color} italic block mb-2`}>{stat.trend}</span>
                <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase font-black">X-Matrix.v4</span>
              </div>
           </div>

           <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 italic">0{i+1} : {stat.label}</p>
                <div className="w-8 h-[1px] bg-slate-800" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className={`text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'} group-hover:text-registry-teal transition-all duration-700`}>
                   {stat.value}
                </h3>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: '0%' }}
                      transition={{ duration: 2, delay: i * 0.2 }}
                      className={`h-full w-2/3 ${stat.color.replace('text-', 'bg-')} shadow-glow`}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-black text-slate-500 italic tabular-nums tracking-wider uppercase">{stat.subValue}</span>
                </div>
              </div>
           </div>
        </motion.div>
      ))}
    </div>
  );
};

const DashboardGridScroll = () => (
  <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08] z-[-1]">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:200px_200px] border-l border-t border-slate-500/20" />
  </div>
);

// --- NEURAL MAP ---
const NeuralMap: React.FC<{ modules: Module[], completed: Set<string>, isDarkMode?: boolean }> = ({ modules, completed, isDarkMode }) => {
  return (
    <div className={`premium-glass rounded-[3rem] border-2 tech-border shadow-2xl relative overflow-hidden h-[500px] lg:h-[600px] group ${isDarkMode ? 'bg-stealth-900/40 backdrop-blur-3xl' : 'bg-white'}`}>
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
      <div className="absolute inset-0 neural-grid opacity-[0.05] pointer-events-none" />
      
      <div className="absolute top-12 left-12 flex items-center space-x-8 z-20">
        <div className="relative">
          <div className="w-14 h-14 bg-registry-teal/20 rounded-2xl animate-ping absolute inset-0 opacity-20" />
          <div className="w-14 h-14 bg-stealth-950 rounded-2xl relative z-10 border-2 border-registry-teal flex items-center justify-center shadow-glow shadow-registry-teal/20">
            <Brain className="w-7 h-7 text-registry-teal drop-shadow-glow" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 italic">Neural Network Topology</span>
          <h4 className="text-3xl font-black italic text-registry-teal tracking-tighter uppercase mt-1 leading-none drop-shadow-glow">Synaptic Link Matrix</h4>
        </div>
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         {[1, 2, 3, 4, 5].map(i => (
           <motion.div 
             key={i}
             animate={{ 
               x: [0, 50, -50, 0], 
               y: [0, -30, 30, 0],
               opacity: [0.1, 0.3, 0.1]
             }}
             transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
             className="absolute bg-registry-teal/20 blur-3xl rounded-full"
             style={{ 
               width: 100 + i * 50, 
               height: 100 + i * 50,
               left: `${15 + i * 15}%`,
               top: `${20 + (i % 3) * 20}%`
             }}
           />
         ))}
      </div>
      
      <div className="w-full h-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing">
        <div className="min-w-[1400px] 2xl:min-w-full h-full relative">
          <svg className="w-full h-full p-24">
            <defs>
              <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0afff2" />
                <stop offset="100%" stopColor="#00d2ff" />
              </linearGradient>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Neural Connections */}
            {modules.map((m, i) => {
              if (i === modules.length - 1) return null;
              const x1 = 12 + (i * (76 / (modules.length - 1)));
              const x2 = 12 + ((i + 1) * (76 / (modules.length - 1)));
              const y1 = 50 + (i % 2 === 0 ? -15 : 15);
              const y2 = 50 + ((i + 1) % 2 === 0 ? -15 : 15);
              
              const isComp = m.lessons.every(l => completed.has(l.id));

              return (
                <g key={`connection-${i}`}>
                   <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: i * 0.1 }}
                    d={`M ${x1}% ${y1}% C ${x1 + 5}% ${y1}%, ${x2 - 5}% ${y2}%, ${x2}% ${y2}%`}
                    fill="none"
                    stroke={isComp ? "#0afff2" : "rgba(255,255,255,0.05)"}
                    strokeWidth={isComp ? "3" : "1.5"}
                    filter={isComp ? "url(#nodeGlow)" : ""}
                  />
                  {isComp && (
                    <motion.circle
                      r="4"
                      fill="#0afff2"
                      initial={{ scale: 0 }}
                      animate={{ 
                         offsetDistance: ["0%", "100%"],
                         scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
                      }}
                      style={{ offsetPath: `path('M ${x1} ${y1} C ${x1 + 5} ${y1}, ${x2 - 5} ${y2}, ${x2} ${y2}')` as any }}
                      filter="url(#nodeGlow)"
                    />
                  )}
                </g>
              );
            })}
            
            {/* Neural Nodes */}
            {modules.map((m, i) => {
              const x = 12 + (i * (76 / (modules.length - 1)));
              const y = 50 + (i % 2 === 0 ? -15 : 15);
              const isCompleted = m.lessons.every(l => completed.has(l.id));
              const progress = m.lessons.filter(l => completed.has(l.id)).length / m.lessons.length;

              return (
                <g key={`node-${i}`} className="group/node cursor-pointer">
                  {/* Decorative orbital rings (Recipe 7: Atmospheric) */}
                  <motion.circle 
                    cx={`${x}%`} cy={`${y}%`} r="38"
                    fill="none" stroke="rgba(10,255,242,0.1)" strokeWidth="0.5" strokeDasharray="2 4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.circle 
                    cx={`${x}%`} cy={`${y}%`} r="32"
                    fill="none" stroke="rgba(0,210,255,0.05)" strokeWidth="1" strokeDasharray="8 8"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25 + i * 3, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Pulse effect for focal points */}
                  {isCompleted && (
                    <motion.circle 
                      cx={`${x}%`} cy={`${y}%`} r="45"
                      fill="none" stroke="rgba(10,255,242,0.2)" strokeWidth="0.5"
                      animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                    />
                  )}
                  
                  {/* Progress ring */}
                  <circle cx={`${x}%`} cy={`${y}%`} r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <motion.circle 
                    cx={`${x}%`} cy={`${y}%`} r="24" 
                    fill="none" stroke="#0afff2" strokeWidth="4" 
                    strokeDasharray="150"
                    initial={{ strokeDashoffset: 150 }}
                    animate={{ strokeDashoffset: 150 - (150 * progress) }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    strokeLinecap="round"
                    pathLength="100"
                  />

                  {/* Core Node */}
                  <motion.rect
                    initial={{ scale: 0, rotate: 45 }}
                    animate={{ scale: isCompleted ? 1.2 : 1, rotate: 45 }}
                    whileHover={{ scale: 1.3, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12 }}
                    x={`${x}%`} y={`${y}%`} width="24" height="24"
                    transform={`translate(-12, -12)`}
                    className={`${isCompleted ? 'fill-registry-teal' : 'fill-stealth-800'} stroke-white/20 stroke-1 transition-all duration-500`}
                    filter={isCompleted ? "url(#nodeGlow)" : ""}
                  />
                  
                  <text 
                    x={`${x}%`} y={`${y + (i % 2 === 0 ? -45 : 45)}%`} 
                    textAnchor="middle" 
                    className={`text-[12px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'fill-white' : 'fill-slate-900'} group-hover/node:fill-registry-teal italic transition-all drop-shadow-glow`}
                  >
                    {m.title.split(' ')[0]}
                  </text>
                  <text 
                    x={`${x}%`} y={`${y + (i % 2 === 0 ? -32 : 58)}%`} 
                    textAnchor="middle" 
                    className="text-[11px] font-bold uppercase tracking-[0.3em] fill-slate-500 group-hover/node:fill-slate-400 italic"
                  >
                    {isCompleted ? 'Node Synchronized' : `Module Data Link: ${Math.round(progress * 100)}%`}
                  </text>
                  
                  {/* Hover Info Tip */}
                  <foreignObject x={`${x}%`} y={`${y + 20}%`} width="150" height="40" className="opacity-0 group-hover/node:opacity-100 transition-opacity">
                     <div className="premium-glass p-2 rounded-xl border border-white/10 text-[11px] font-black uppercase text-center backdrop-blur-md">
                        {m.lessons.length} LESSONS // {Math.round(progress * 100)}% SYNC
                     </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

// --- DIAGNOSTIC SCANLINE ---
const DiagnosticScanline: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
    <div className="scanline opacity-10" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-registry-teal/5 to-transparent opacity-20" />
    <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
    <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
  </div>
);

const App: React.FC = () => {
  useEffect(() => {
    const handleInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, [role="button"]');
      if (clickable) {
        if (e.type === 'click') {
          playSound('click');
        } else if (e.type === 'mouseover') {
          playSound('hover');
        }
      }
    };

    document.addEventListener('click', handleInteraction, { capture: true });
    document.addEventListener('mouseover', handleInteraction, { capture: true });

    return () => {
      document.removeEventListener('click', handleInteraction, { capture: true });
      document.removeEventListener('mouseover', handleInteraction, { capture: true });
    };
  }, []);

  const [showCinematicIntro, setShowCinematicIntro] = useState(false);
  const handleCinematicComplete = useCallback(() => {
    setShowCinematicIntro(false);
    setIsIntroFinished(true);
    sessionStorage.setItem('cinematic_intro_played', 'true');
  }, []);

  const [profile, setProfile] = useState<any>(() => {
    const defaultProfile = { 
      dailyInsight: '', 
      lastInsightTimestamp: 0, 
      scriptVault: [],
      companionSkin: 'default',
      profileAvatar: 'default',
      visualOverrides: {},
      harveyInteractionCount: 0,
      studyTimeTotal: 0,
      diagnosticAccuracy: 94.2,
      textScale: 1
    };
    try {
      const saved = localStorage.getItem('spi_profile');
      if (!saved) return defaultProfile;
      const parsed = JSON.parse(saved);
      return { ...defaultProfile, ...parsed };
    } catch (e) {
      console.error("Profile Load Error:", e);
      return defaultProfile;
    }
  });

  const handleProfileUpdate = (updates: any) => {
    setProfile((prev: any) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => console.log('Server health:', d))
      .catch(e => console.error('Server health check failed:', e));
  }, []);

  const [userId, setUserId] = useState<string | null>(null);

  // --- FIREBASE AUTH SYNC ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        // Load Profile from Firestore
        const fbProfile = await firebaseService.getUserProfile(user.uid);
        if (fbProfile) {
          setProfile((prev: any) => ({ ...prev, ...fbProfile }));
        } else {
          // New User: Create Profile
          const initialProfile = {
            displayName: user.displayName || 'Sonographer',
            email: user.email || '',
            photoURL: user.photoURL || '',
            streak: 3,
            studyTimeTotal: 0,
            diagnosticAccuracy: 94.2
          };
          await firebaseService.createUserProfile(user.uid, initialProfile);
          setProfile((prev: any) => ({ ...prev, ...initialProfile }));
        }

        // Load Progress from Firestore
        const fbProgress = await firebaseService.getAllProgress(user.uid);
        if (fbProgress.length > 0) {
          const lessonIds = fbProgress.map(p => p.lessonId);
          setCompleted(new Set(lessonIds));
        }
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync profile changes to Firestore (Debounced or on specific updates)
  useEffect(() => {
    if (userId && profile) {
      const timeout = setTimeout(() => {
        firebaseService.updateUserProfile(userId, profile);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [profile, userId]);

  const [isIntroFinished, setIsIntroFinished] = useState(() => !!sessionStorage.getItem('cinematic_intro_played'));
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('spi_theme_mode') === 'dark');
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('spi_theme_name') || 'registry');
  const [current, setCurrent] = useState<[number, number] | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModuleIntro, setShowModuleIntro] = useState<number | null>(null);
  const [showLessonIntro, setShowLessonIntro] = useState<boolean>(false);
  const [showTabIntro, setShowTabIntro] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryTitle, setVictoryTitle] = useState('');
  const [tabIntroTitle, setTabIntroTitle] = useState<string>('');
  const [activeOverlay, setActiveOverlay] = useState<'sidebar' | 'tutor' | 'reminders' | 'flashcards' | 'glossary' | 'plan' | 'profile' | 'legal' | 'exam' | 'pricing' | 'radio' | 'settings' | 'quest' | 'podcast' | 'brainx' | 'media' | 'live' | 'scenarios' | 'sonographyLounge' | 'lab' | null>(null);
  const [sessionStartTime] = useState<number>(Date.now());

  const lastAccountedSeconds = useRef(0);

  // Background study time tracker
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
      const delta = elapsedSeconds - lastAccountedSeconds.current;
      
      if (delta > 0) {
        handleProfileUpdate({ studyTimeTotal: (profile?.studyTimeTotal || 0) + delta });
        updateQuestProgress('q6', delta);
        lastAccountedSeconds.current = elapsedSeconds;
      }
    }, 60000); 
    
    return () => clearInterval(timer);
  }, [sessionStartTime, profile?.studyTimeTotal]);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current, activeOverlay]);

  useEffect(() => {
    document.documentElement.style.setProperty('--neural-text-scale', (profile?.textScale || 1).toString());
  }, [profile?.textScale]);

  const [flashcardModule, setFlashcardModule] = useState<string | null>(null);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('spi_streak') || '3'));
  const [completedToday, setCompletedToday] = useState(() => localStorage.getItem('spi_completed_today') === new Date().toDateString());
  
  useEffect(() => {
    localStorage.setItem('spi_streak', streak.toString());
    if (completedToday) {
      localStorage.setItem('spi_completed_today', new Date().toDateString());
    }
  }, [streak, completedToday]);

  useEffect(() => {
    const handleOpenFlashcards = (e: any) => {
      setFlashcardModule(e.detail);
      setActiveOverlay('flashcards');
    };
    window.addEventListener('open-flashcards', handleOpenFlashcards);
    return () => window.removeEventListener('open-flashcards', handleOpenFlashcards);
  }, []);
  
  useEffect(() => {
    if (activeOverlay && activeOverlay !== 'sidebar') {
      const titles: Record<string, string> = {
        'plan': 'Strategic Study Protocol',
        'tutor': 'Neural AI Interface',
        'flashcards': 'Synaptic Recall Nodes',
        'glossary': 'Physics Lexicon Vault',
        'lab': 'Diagnostic Registry Lab',
        'profile': 'Operator Profile Sync',
        'legal': 'Compliance Protocols',
        'pricing': 'Mastery Access Protocol',
        'radio': 'Neural Frequency Node',
        'scenarios': 'Clinical Simulation Hall',
        'settings': 'System Configuration'
      };
      setTabIntroTitle(titles[activeOverlay] || activeOverlay.toUpperCase());
      setShowTabIntro(true);
      const timer = setTimeout(() => setShowTabIntro(false), 1500);
      return () => clearTimeout(timer);
    } else if (!activeOverlay && !current && isIntroFinished) {
      // Returning to Dashboard
      setTabIntroTitle('Registry Dashboard');
      setShowTabIntro(true);
      const timer = setTimeout(() => setShowTabIntro(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [activeOverlay, current, isIntroFinished]);

  // --- LOCAL PERSISTENCE LAYER ---
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('spi_completed');
      if (!saved) return new Set();
      const parsed = JSON.parse(saved);
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("Completed Lessons Load Error:", e);
      return new Set();
    }
  });


  const allLessons = useMemo(() => modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.title }))), [modules]);

  // --- CUSTOM API SYNC LAYER ---
  useEffect(() => {
    let id = localStorage.getItem('spi_user_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('spi_user_id', id);
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async (retryCount = 0) => {
      try {
        const response = await fetch(`/api/sync/${encodeURIComponent(userId)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.completed) setCompleted(new Set(data.completed));
          if (data.profile) setProfile(data.profile);
          if (data.streak) setStreak(data.streak);
          if (data.completedToday !== undefined) setCompletedToday(data.completedToday);
        } else if (retryCount < 3) {
          setTimeout(() => fetchData(retryCount + 1), 1000 * Math.pow(2, retryCount));
        } else {
          console.error(`Sync fetch failed after retries with status: ${response.status}`);
        }
      } catch (error) {
        if (retryCount < 3) {
          setTimeout(() => fetchData(retryCount + 1), 1000 * Math.pow(2, retryCount));
        } else {
          console.error("Sync error after retries:", error);
        }
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    
    const saveData = async (retryCount = 0) => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/sync/${encodeURIComponent(userId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            completed: Array.from(completed),
            profile,
            streak,
            completedToday
          })
        });
        if (!response.ok) {
           throw new Error(`Status ${response.status}`);
        }
      } catch (error: any) {
        if (retryCount < 2) {
          // Retry twice with exponential backoff if it's potentially transient
          const backoff = Math.pow(2, retryCount) * 1000;
          setTimeout(() => saveData(retryCount + 1), backoff);
        } else {
          // Only log to console after retries fail to avoid spamming "Failed to fetch"
          console.error("Background sync failed after retries:", error.message || error);
        }
      }
    };

    const timer = setTimeout(saveData, 1000); // Debounce saves
    return () => clearTimeout(timer);
  }, [userId, completed, profile, streak, completedToday]);

  useEffect(() => {
    localStorage.setItem('spi_completed', JSON.stringify(Array.from(completed)));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem('spi_profile', JSON.stringify(profile));
  }, [profile]);

  const markComplete = (lessonId: string) => {
    if (completed.has(lessonId)) return;

    setCompleted(prev => new Set(prev).add(lessonId));

    if (userId) {
      const lesson = allLessons.find(l => l.id === lessonId);
      firebaseService.syncProgress(userId, {
        lessonId,
        moduleId: lesson?.moduleId || 'unknown',
        completed: true,
        lastAccessed: null // Set automatically by serverTimestamp in service
      });
    }

    const lesson = allLessons.find(l => l.id === lessonId);
    if (lesson) {
      setVictoryTitle(lesson.title);
      setShowVictory(true);
    }
    
    // Update activity history
    const today = new Date().toISOString().split('T')[0];
    setProfile((p: any) => {
      const history = [...(p.activityHistory || [])];
      const todayIndex = history.findIndex(h => h.date === today);
      if (todayIndex > -1) {
        history[todayIndex].count += 1;
      } else {
        history.push({ date: today, count: 1 });
      }
      // Keep only last 7 days
      return { ...p, activityHistory: history.slice(-7) };
    });

    if (!completedToday) {
      setCompletedToday(true);
      setStreak(prevStreak => prevStreak + 1);
    }

    // Update Quests
    updateQuestProgress('q1', 1);
    const currentCompleted = new Set(completed).add(lessonId);
    const physicsCount = modules[0].lessons.filter(l => currentCompleted.has(l.id)).length;
    checkModuleCompletionQuests(physicsCount);
  };

  const neuralLoadData = useMemo(() => {
    const history = profile?.activityHistory || [];
    const base = [10, 15, 12, 20, 18, 25, 30]; // Default mock data if no history
    if (history.length === 0) return base;
    
    // Map history to 0-100 scale
    return history.map(h => Math.min(100, h.count * 20 + 10));
  }, [profile?.activityHistory]);

  const updateDailyInsight = (insight: string) => {
    setProfile((prev: any) => ({ ...prev, dailyInsight: insight, lastInsightTimestamp: Date.now() }));
  };

  const vaultScript = (title: string, content: string) => {
    const newNode = { id: Math.random().toString(36).substring(7), title, content, timestamp: Date.now() };
    setProfile((prev: any) => ({ ...prev, scriptVault: [...(prev.scriptVault || []), newNode] }));
  };

  useEffect(() => {
    if (isIntroFinished && profile && !profile.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [isIntroFinished, profile?.hasCompletedOnboarding]);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    handleProfileUpdate({ hasCompletedOnboarding: true });
  };

  const handleAttachToLesson = (lessonId: string, asset: any) => {
    setProfile((prev: any) => ({
      ...prev,
      visualOverrides: {
        ...(prev.visualOverrides || {}),
        [lessonId]: { id: asset.id, type: asset.type, data: asset.data }
      }
    }));
  };

  const handleRemoveOverride = (lessonId: string) => {
    setProfile((prev: any) => {
      const nextOverrides = { ...(prev.visualOverrides || {}) };
      delete nextOverrides[lessonId];
      return { ...prev, visualOverrides: nextOverrides };
    });
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = totalLessons > 0 ? (completed.size / totalLessons) * 100 : 0;

  const getRank = () => {
    if (progressPercent >= 95) return { name: "Physics Legend", color: "text-registry-rose", icon: Crown };
    if (progressPercent >= 75) return { name: "Registry Ready", color: "text-registry-amber", icon: Medal };
    if (progressPercent >= 50) return { name: "Wave Master", color: "text-registry-teal", icon: Zap };
    if (progressPercent >= 25) return { name: "Acoustic Apprentice", color: "text-registry-cobalt", icon: GraduationCap };
    return { name: "Novice Sonographer", color: "text-slate-400", icon: User };
  };

  const currentRank = getRank();

  const [syncedVisuals, setSyncedVisuals] = useState<VisualItem[]>([]);
  const [activeVisualOverlay, setActiveVisualOverlay] = useState<VisualItem | null>(null);

  useEffect(() => {
    const fetchSyncedMedia = async () => {
      try {
        const response = await fetch('/api/media');
        if (response.ok) {
          const data = await response.json();
          setSyncedVisuals(data.visuals || []);
        }
      } catch (error) {
        console.error("Failed to fetch synced media:", error);
      }
    };
    
    fetchSyncedMedia();
    const interval = setInterval(fetchSyncedMedia, 15000);
    return () => clearInterval(interval);
  }, []);

  const moduleProgress = useMemo(() => {
    const breakdown: { [title: string]: number } = {};
    modules.forEach(m => {
      const completedInModule = m.lessons.filter(l => completed.has(l.id)).length;
      breakdown[m.title] = (completedInModule / m.lessons.length) * 100;
    });
    return breakdown;
  }, [completed]);

  // Insight Persistence Logic
  useEffect(() => {
    const checkDailyInsight = async () => {
      if (profile) {
        const lastTs = profile.lastInsightTimestamp || 0;
        const isExpired = Date.now() - lastTs > 24 * 60 * 60 * 1000;
        if (isExpired || !profile.dailyInsight) {
          try {
            const prompt = 'Provide a single, professional, high-yield ultrasound physics "Daily Insight" for the SPI exam. Max 20 words.';
            const insight = await generateText(prompt);
            updateDailyInsight(insight || "Mastering acoustic impedance is key to reflection.");
          } catch (e: any) {
            console.error("Insight Generation Error:", e);
            if (e instanceof AIServiceError && e.type === 'Quota') {
              updateDailyInsight("Focus on Scan Plane alignment for better images today."); // Meaningful fallback
            } else {
              updateDailyInsight("Mastering acoustic impedance is key to reflection.");
            }
          }
        }
      }
    };
    if (isIntroFinished) checkDailyInsight();
  }, [profile.lastInsightTimestamp, isIntroFinished]);

  // Audio Logic
  const [isNarrating, setIsNarrating] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [cachedLessons, setCachedLessons] = useState<Set<string>>(new Set());
  const [cachingModules, setCachingModules] = useState<Set<number>>(new Set());
  const [isCachingAll, setIsCachingAll] = useState(false);
  const [cachingProgress, setCachingProgress] = useState({ current: 0, total: 0 });

  // Helper to hash strings for cache keys
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  };

  const getAudioCacheKey = (script: string, id: string) => {
    // Content-based hashing ensures that if the script changes, the cache key changes.
    // We prefix with the ID for organization.
    return `${id}_${hashString(script)}`;
  };

  const [bgImage, setBgImage] = useState<string | null>(() => localStorage.getItem('registry_bg_image'));
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (bgImage) {
      localStorage.setItem('registry_bg_image', bgImage);
    } else {
      localStorage.removeItem('registry_bg_image');
    }
  }, [bgImage]);

  // Fetch Global Configuration
  useEffect(() => {
    const fetchConfig = async (retryCount = 0) => {
      try {
        const res = await fetch('/api/media');
        if (res.ok) {
          const data = await res.json();
          if (data.defaultBackground && !localStorage.getItem('registry_bg_image')) {
            setBgImage(data.defaultBackground);
          }
        } else if (retryCount < 3) {
          setTimeout(() => fetchConfig(retryCount + 1), 1000 * Math.pow(2, retryCount));
        }
      } catch (e) {
        if (retryCount < 3) {
          setTimeout(() => fetchConfig(retryCount + 1), 1000 * Math.pow(2, retryCount));
        } else {
          console.error("System Identity Fetch Failed after retries:", e);
        }
      }
    };
    fetchConfig();
  }, []);

  const [audioError, setAudioError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const checkCache = async () => {
      const keys = await AudioCache.getAllKeys();
      setCachedLessons(new Set(keys));
    };
    checkCache();
  }, []);

  const initAudioContext = async () => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (typeof AudioContextClass === 'function') {
          try {
            // Try with options first
            audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
          } catch (e) {
            console.warn("AudioContext with options failed (Illegal constructor?), falling back to default", e);
            try {
              audioContextRef.current = new AudioContextClass();
            } catch (e2) {
              console.error("AudioContext constructor failed entirely (Illegal constructor?)", e2);
              throw e2;
            }
          }
        } else {
          throw new Error("AudioContext not supported in this browser environment");
        }
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      return audioContextRef.current;
    } catch (err) {
      console.error("AudioContext Init Error:", err);
      setAudioError("Audio system failed to initialize. Please check your browser settings.");
      return null;
    }
  };

  const handleTestAudio = async () => {
    const ctx = await initAudioContext();
    if (!ctx) return;
    
    // Play a short beep to confirm audio works
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    toast.success("Audio system initialized. If you heard a beep, audio is working!");
  };

  const handlePlayLecture = async (script: string, lessonId: string) => {
    if (isNarrating && audioContextRef.current?.state === 'running') {
      sourceNodeRef.current?.stop();
      setIsNarrating(false);
      return;
    }

    const ctx = await initAudioContext();
    if (!ctx) return;

    const cacheKey = getAudioCacheKey(script, lessonId);

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setIsTtsLoading(true);
    try {
      let base64Audio = await AudioCache.get(cacheKey);
      
      if (!base64Audio && userId) {
        try {
          const res = await fetch(`/api/audio/${userId}/${cacheKey}`);
          if (res.ok) {
            const json = await res.json();
            base64Audio = json.data;
            if (base64Audio) await AudioCache.set(cacheKey, base64Audio);
          }
        } catch (e) {
          console.error("Server audio fetch error", e);
        }
      }

      if (!base64Audio) {
        try {
          // Determine if this is a lesson (not a static UI script)
          const isLesson = !Object.keys(staticNarrationScripts).includes(lessonId);
          let finalScript = script;

          if (isLesson) {
            // Generate a full, detailed lecture script
            try {
              const lecturePrompt = `Generate an audio lecture script for the SPI ultrasound physics exam based on this topic/summary: "${script}".

Follow this exact structure and style for the lecture:

1. Start by quantifying the effort you put in so the viewer doesn't have to. You must position yourself as the person who did the hard work to save them time.
• Template Line: "I [took this course / read these papers / learned this skill] for you so here is the cliffnotes version to save you [Number] hours."
• Context: Mention that a single source wasn't enough, so you aggregated multiple sources (courses, papers, videos) to create the ultimate guide.

2. Immediately establish that passive watching is insufficient. You must promise a way for them to test their knowledge.
• Template Line: "But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment."
• Goal: Tell them if they can answer these questions by the end, they are officially "educated" on the topic.

3. The Structured Roadmap
Break the complex topic into a numbered outline or modules.
• Template Structure:
    ◦ Part 1: Definitions (What even is [Topic]?).
    ◦ Part 2: Core Concepts/Crash Course (The specific frameworks or architectures).
    ◦ Part 3: Practical Application (How to build/do it yourself, often involving a workflow).
    ◦ Part 4: The "Holy Sh*t" Insight (A specific piece of advice or opportunity that is mind-blowing).

4. To explain a complex concept, first explain what it is not.
• Technique: Define the subject by contrasting it with a less effective version.
    ◦ Example: "The easiest way to first define [Topic] is the given example of what is not [Topic]."

5. Do not just list concepts; create a memorable acronym or phrase to help the viewer remember them. Even if the mnemonic is silly, it aids retention.
• Template: "Here is a mnemonic in case you can't remember... just think about [Silly Sentence]."

6. Simplify technical or dry subjects by relating them to human behavior or popular culture (like anime).
• Technique: Compare the system to a company hierarchy or a character's journey.

7. Shift from theory to a concrete example the user can copy, preferably using accessible tools.
• Template: "To make this actually all practical, I'm going to show you how to create a [Workflow/Project] which does not require any code."

8. The Mindset Shift (The "Soft" Skill)
Address the psychological barriers to the subject.
• Key Concept: Focus on "showing up" rather than perfection. Use the "2-minute rule" or specific habit-building advice.
    ◦ Philosophy: "You do not rise to the level of your goals, you fall to the level of your systems."

9. The Assessment and CTA
End the video by presenting the questions promised in the beginning to prove they learned the material.
• Template: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on [Topic]."
• Call to Action: Ask viewers to write their answers in the comments to boost engagement.

Analogy for this Template: Think of this video style like meal-prepping for the brain. Instead of handing the viewer a pile of raw ingredients (raw data, 100-page notes, and complex papers) and telling them to cook, you are acting as the chef who has already chopped, seasoned, and cooked the meal (the "cliffnotes"). You serve it in bite-sized, easy-to-swallow pieces (mnemonics), use familiar flavors (analogies), and finally, you ask them to taste-test it (the assessment) to ensure they are actually full.

Ensure the final output is a spoken script format, ready to be read aloud by an AI voice.`;
              const scriptText = await generateText(lecturePrompt);
              if (scriptText) {
                finalScript = scriptText;
              }
            } catch (scriptErr) {
              console.error("Full lecture script generation failed, falling back to summary", scriptErr);
            }
          }

          base64Audio = await generateSpeech(finalScript, 'Kore');
        } catch (constructErr) {
          console.error("AI failed in handlePlayLecture", constructErr);
        }

        if (base64Audio) {
          await AudioCache.set(cacheKey, base64Audio);
          setCachedLessons(prev => new Set([...prev, cacheKey]));
          
          // Save to shared pool
          fetch(`/api/audio/shared/${cacheKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: base64Audio })
          }).catch(console.error);
        }
      }

      if (!base64Audio) throw new Error("No audio returned");

      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContextRef.current, 24000, 1);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
      }
      
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      source.onended = () => setIsNarrating(false);
      sourceNodeRef.current = source;
      source.start();
      setIsNarrating(true);
    } catch (err: any) {
      console.error("TTS Error:", err);
      if (err instanceof AIServiceError) {
        if (err.type === 'Quota') {
          toast.error("AI limits reached for today. Please try again tomorrow.");
        } else if (err.type === 'Config') {
          toast.error("AI Narration is not yet configured. Contact administrator.");
        } else {
          toast.error(`Service Error: ${err.message}`);
        }
      } else {
        toast.error("Failed to generate lecture audio. Please check your connection.");
      }
    } finally {
      setIsTtsLoading(false);
    }
  };

  const toggleAudio = async () => {
    if (!audioContextRef.current) return;
    if (audioContextRef.current.state === 'running') {
      await audioContextRef.current.suspend();
      setIsNarrating(false);
    } else {
      await audioContextRef.current.resume();
      setIsNarrating(true);
    }
  };

  const stopAudio = () => {
    sourceNodeRef.current?.stop();
    setIsNarrating(false);
  };

  const closeAll = () => {
    setActiveOverlay(null);
    setCurrent(null);
  };

  const themes = {
    registry: {
      name: 'Registry Default',
      primary: '#00f2ea',
      secondary: '#00d9d1',
      accent: '#ff2d55',
      bg: 'bg-slate-50/50 dark:bg-stealth-950',
      text: 'text-slate-900 dark:text-slate-100',
      border: 'tech-border',
      card: 'glass-card',
      bgHex: isDarkMode ? '#020304' : '#ffffff',
      textHex: isDarkMode ? '#f1f5f9' : '#020304'
    },
    midnight: {
      name: 'Midnight Gold',
      primary: '#ffb800',
      secondary: '#b8860b',
      accent: '#ffb800',
      bg: 'bg-slate-50/50 dark:bg-stealth-950',
      text: 'text-slate-900 dark:text-white',
      border: 'tech-border',
      card: 'glass-card',
      bgHex: isDarkMode ? '#05070a' : '#ffffff',
      textHex: isDarkMode ? '#ffffff' : '#05070a'
    },
    ruby: {
      name: 'Ruby Mastery',
      primary: '#ff2d55',
      secondary: '#cc0033',
      accent: '#fb7185',
      bg: 'bg-slate-50/50 dark:bg-stealth-950',
      text: 'text-slate-900 dark:text-slate-100',
      border: 'tech-border',
      card: 'glass-card',
      bgHex: isDarkMode ? '#080c14' : '#ffffff',
      textHex: isDarkMode ? '#f1f5f9' : '#020304'
    },
    amethyst: {
      name: 'Amethyst Study',
      primary: '#9d66ff',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      bg: 'bg-slate-50/50 dark:bg-stealth-950',
      text: 'text-slate-900 dark:text-slate-100',
      border: 'tech-border',
      card: 'glass-card',
      bgHex: isDarkMode ? '#05070a' : '#ffffff',
      textHex: isDarkMode ? '#f1f5f9' : '#020304'
    },
    teal: {
      name: 'Teal Core',
      primary: '#00f2ea',
      secondary: '#00d9d1',
      accent: '#00f2ea',
      bg: 'bg-slate-50/50 dark:bg-stealth-950',
      text: 'text-slate-900 dark:text-slate-100',
      border: 'tech-border',
      card: 'glass-card',
      bgHex: isDarkMode ? '#020304' : '#ffffff',
      textHex: isDarkMode ? '#f1f5f9' : '#020304'
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('spi_theme_mode', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('spi_theme_name', currentTheme);
    
    const theme = themes[currentTheme as keyof typeof themes] || themes.registry;
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    document.documentElement.style.setProperty('--bg-color', theme.bgHex);
    document.documentElement.style.setProperty('--text-color', theme.textHex);
  }, [isDarkMode, currentTheme]);

  const handleAttachToLexicon = (term: string, asset: any) => {
    setProfile(prev => ({
      ...prev,
      lexiconOverrides: {
        ...(prev.lexiconOverrides || {}),
        [term]: asset
      }
    }));
    toast.success(`Asset linked to Lexicon: ${term}`);
  };

  const handleLessonSelect = (mIdx: number, lIdx: number) => {
    sourceNodeRef.current?.stop();
    setIsNarrating(false);
    
    if (!current || current[0] !== mIdx) {
      setShowModuleIntro(mIdx);
    } else {
      setShowLessonIntro(true);
      setTimeout(() => setShowLessonIntro(false), 2000);
    }
    
    setCurrent([mIdx, lIdx]);
    setActiveOverlay(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Background caching if not already cached
    const lesson = modules[mIdx].lessons[lIdx];
    if (!cachedLessons.has(lesson.id)) {
      const content = lessonContent[lesson.id];
      if (content?.narrationScript) {
        (async () => {
          try {
            const base64 = await generateSpeech(content.narrationScript, 'Kore');
            if (base64) {
              await AudioCache.set(lesson.id, base64);
              setCachedLessons(prev => new Set([...prev, lesson.id]));
              
              // Save to shared pool so others can use it
              fetch(`/api/audio/shared/${lesson.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: base64 })
              }).catch(console.error);
            }
          } catch (e) {
            console.error("Background caching failed", e);
          }
        })();
      }
    }
  };

  const handleNavigateToLesson = (lessonId: string) => {
    for (let mIdx = 0; mIdx < modules.length; mIdx++) {
      const lIdx = modules[mIdx].lessons.findIndex((l: any) => l.id === lessonId);
      if (lIdx !== -1) {
        handleLessonSelect(mIdx, lIdx);
        return;
      }
    }
    toast.error(`Lesson Node ${lessonId} not found in the current synaptic path.`);
  };

  const handleCacheModule = async (mIdx: number) => {
    if (cachingModules.has(mIdx)) return;
    setCachingModules(prev => new Set([...prev, mIdx]));
    const module = modules[mIdx];
    for (const lesson of module.lessons) {
      if (!cachedLessons.has(lesson.id)) {
        const content = lessonContent[lesson.id];
        if (content?.narrationScript) {
          try {
            const base64 = await generateSpeech(content.narrationScript, 'Kore');
            if (base64) {
              await AudioCache.set(lesson.id, base64);
              setCachedLessons(prev => new Set([...prev, lesson.id]));
              
              // Save to shared pool
              fetch(`/api/audio/shared/${lesson.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: base64 })
              }).catch(console.error);
            }
          } catch (e) {
            console.error(`Caching failed for ${lesson.id}`, e);
          }
        }
      }
    }
    setCachingModules(prev => {
      const next = new Set(prev);
      next.delete(mIdx);
      return next;
    });
  };

  const handleCacheAll = async () => {
    if (isCachingAll) return;
    setIsCachingAll(true);
    
    const allLessons = modules.flatMap(m => m.lessons);
    const staticKeys = Object.keys(staticNarrationScripts);
    const glossaryTerms = SPI_GLOSSARY;
    
    // Total items to cache
    const totalItems = allLessons.length + staticKeys.length + glossaryTerms.length;
    setCachingProgress({ current: 0, total: totalItems });
    let processedItems = 0;

    const updateProgress = () => {
      processedItems++;
      setCachingProgress(prev => ({ ...prev, current: processedItems }));
    };

    const cacheItem = async (script: string, id: string) => {
      const cacheKey = getAudioCacheKey(script, id);
      if (!cachedLessons.has(cacheKey)) {
        try {
          const base64 = await generateSpeech(script, 'Kore');
          if (base64) {
            await AudioCache.set(cacheKey, base64);
            setCachedLessons(prev => new Set([...prev, cacheKey]));
            
            // Save to shared pool
            fetch(`/api/audio/shared/${cacheKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: base64 })
            }).catch(console.error);
          }
        } catch (e) {
          console.error(`Caching failed for ${id}`, e);
        }
      }
      updateProgress();
    };

    // Process in chunks of 5 to avoid overloading
    const CHUNK_SIZE = 5;
    
    // 1. Static Scripts
    for (let i = 0; i < staticKeys.length; i += CHUNK_SIZE) {
      const chunk = staticKeys.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(key => cacheItem(staticNarrationScripts[key], key)));
    }

    // 2. Lessons
    for (let i = 0; i < allLessons.length; i += CHUNK_SIZE) {
      const chunk = allLessons.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(lesson => {
        const content = lessonContent[lesson.id];
        if (content?.narrationScript) {
          return cacheItem(content.narrationScript, lesson.id);
        }
        updateProgress();
        return Promise.resolve();
      }));
    }

    // 3. Glossary
    for (let i = 0; i < glossaryTerms.length; i += CHUNK_SIZE) {
      const chunk = glossaryTerms.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map((term, idx) => {
        const globalIdx = i + idx;
        const script = `${term.term}: ${term.definition}`;
        return cacheItem(script, `glossary_${globalIdx}`);
      }));
    }

    setIsCachingAll(false);
    setCachingProgress({ current: 0, total: 0 });
    toast.success("Neural Sync Complete. All nodes are now available offline.");
  };

  const getNextLesson = () => {
    if (!current) return null;
    const [mIdx, lIdx] = current;
    if (lIdx < modules[mIdx].lessons.length - 1) {
      return [mIdx, lIdx + 1];
    } else if (mIdx < modules.length - 1) {
      return [mIdx + 1, 0];
    }
    return null;
  };

  const getPrevLesson = () => {
    if (!current) return null;
    const [mIdx, lIdx] = current;
    if (lIdx > 0) {
      return [mIdx, lIdx - 1];
    } else if (mIdx > 0) {
      return [mIdx - 1, modules[mIdx - 1].lessons.length - 1];
    }
    return null;
  };

  const handleNextLesson = () => {
    const next = getNextLesson();
    if (next) handleLessonSelect(next[0], next[1]);
  };

  const handlePrevLesson = () => {
    const prev = getPrevLesson();
    if (prev) handleLessonSelect(prev[0], prev[1]);
  };

  const curModule = current ? modules[current[0]] : null;
  const curLesson = curModule ? curModule.lessons[current[1]] : null;
  
  const lessonData = useMemo(() => {
    if (!curLesson) return null;
    const lessonId = curLesson.id;
    const baseData = lessonContent[lessonId] || { 
      title: curLesson.title, 
      content: <div className="p-20 text-center opacity-20 uppercase font-black">Initializing...</div> 
    } as LessonData;
    
    const override = profile?.visualOverrides?.[lessonId];

    if (override && baseData) {
      return {
        ...baseData,
        content: (
          <div className="space-y-8">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-2 border-registry-teal/30 shadow-2xl group bg-stealth-950">
              {override.type === 'video' || override.data.startsWith('data:video') ? (
                override.data ? (
                  <video src={override.data} controls className="w-full h-full object-contain" />
                ) : null
              ) : (
                override.data ? (
                  <img src={override.data} alt="Case Study" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : null
              )}
              <div className="absolute top-6 right-6 flex items-center space-x-3">
                  <div className="px-3 py-1.5 bg-registry-teal text-stealth-950 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center space-x-2 shadow-lg">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Custom Case Study</span>
                </div>
                <button 
                  onClick={() => handleRemoveOverride(lessonId)}
                  className="p-2 bg-registry-rose/20 hover:bg-registry-rose text-registry-rose hover:text-white rounded-xl backdrop-blur-md transition-all border border-registry-rose/30 pointer-events-auto"
                  title="Remove Custom Visual"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Tech Overlay for Custom Visual */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-registry-teal/40" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-registry-teal/40" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-registry-teal/40" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-registry-teal/40" />
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
               <h4 className="text-[11px] font-black uppercase text-registry-teal tracking-[0.3em] mb-6 flex items-center space-x-2">
                 <Layers className="w-3.5 h-3.5" />
                 <span>Original Curriculum Content</span>
               </h4>
               {baseData.content}
            </div>
          </div>
        )
      };
    }
    return baseData;
  }, [curLesson, profile?.visualOverrides, isDarkMode]);

  const currentThemeData = themes[currentTheme as keyof typeof themes] || themes.registry;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeOverlay || !current) return;
      
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        handleNextLesson();
      } else if (e.key === 'ArrowLeft') {
        handlePrevLesson();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, activeOverlay]);

  useEffect(() => {
    localStorage.setItem('spi_intro_finished', isIntroFinished.toString());
  }, [isIntroFinished]);

  if (!isIntroFinished) return (
    <div className={`fixed inset-0 z-[500] ${isDarkMode ? 'bg-stealth-950' : 'bg-slate-50'} flex flex-col items-center justify-center overflow-hidden px-6 ${isDarkMode ? 'text-white' : 'text-slate-900'} transition-colors duration-700`}>
      {/* Cinematic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${isDarkMode ? 'bg-registry-teal/20' : 'bg-registry-teal/10'} blur-[120px] rounded-full animate-pulse`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] ${isDarkMode ? 'bg-registry-cobalt/10' : 'bg-registry-cobalt/5'} blur-[150px] rounded-full`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay" />
        <div className={`scanline ${isDarkMode ? 'opacity-20' : 'opacity-5'}`} />
      </div>

      {/* Theme & Fullscreen Toggles in Intro */}
      <div className="absolute top-8 right-8 z-[510] flex items-center space-x-3">
        <FullscreenToggle 
          className={`p-3 rounded-2xl border ${isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200 bg-white text-slate-900'} shadow-xl transition-all hover:scale-110`}
          iconClassName="w-5 h-5"
        />
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-2xl border ${isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200 bg-white text-slate-900'} shadow-xl transition-all hover:scale-110`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="relative flex flex-col items-center w-full max-w-7xl"
      >
        {/* Micro-label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8 flex items-center space-x-4"
        >
          <div className="h-[1px] w-8 bg-registry-teal/50" />
          <span className="text-registry-teal text-[11px] font-black uppercase tracking-[0.8em]">Neural Interface v5.0</span>
          <div className="h-[1px] w-8 bg-registry-teal/50" />
        </motion.div>

        {/* Massive Cinematic Title */}
        <div className="relative mb-12 overflow-hidden">
          <motion.h1 
            initial={{ y: '100%', skewY: 10 }}
            animate={{ y: 0, skewY: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={`text-4xl sm:text-7xl md:text-[15vw] font-black ${isDarkMode ? 'text-white' : 'text-slate-950'} tracking-tighter italic uppercase text-center leading-[0.85] select-none px-4`}
          >
            <span className="text-registry-rose">SPI</span> MASTER
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "circOut" }}
            className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-registry-teal to-transparent origin-center"
          />
        </div>

           <motion.p
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1.2, duration: 1 }}
          className={`${isDarkMode ? 'text-slate-400' : 'text-slate-800'} text-xs md:text-lg font-medium tracking-widest uppercase text-center max-w-2xl mb-16`}
        >
          {profile?.name ? (
            <span className="text-registry-teal">Welcome back, {profile.name}. <br/></span>
          ) : null}
          Advanced Ultrasound Physics & Instrumentation <br/>
          <span className="text-registry-teal italic">Registry Preparation Protocol</span>
        </motion.p>
        
        {/* Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex flex-col items-center space-y-6 w-full px-8"
        >
           <button 
             onClick={() => setIsIntroFinished(true)} 
             className={`group relative w-full sm:w-auto px-12 sm:px-20 py-6 sm:py-8 overflow-hidden rounded-2xl transition-all active:scale-95 ${isDarkMode ? 'bg-white text-slate-950' : 'bg-stealth-900 text-white shadow-2xl shadow-stealth-900/20'}`}
           >
             <div className="absolute inset-0 bg-registry-teal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
             <span className="relative font-black uppercase tracking-[0.4em] text-sm group-hover:text-white transition-colors duration-300">Initialize Core</span>
           </button>
           
           {localStorage.getItem('spi_intro_finished') === 'true' && (
             <button 
               onClick={() => setIsIntroFinished(true)}
               className="text-[11px] font-black uppercase tracking-widest text-registry-teal hover:text-registry-rose transition-colors"
             >
               Quick Resume
             </button>
           )}
        </motion.div>
      </motion.div>
      
      {/* Bottom Meta Data */}
      <div className={`absolute bottom-12 left-0 right-0 flex justify-between px-12 items-end ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        <div className="flex flex-col space-y-1">
          <span className="text-[11px] font-black text-registry-teal/40 uppercase tracking-widest">System Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest">All Nodes Operational</span>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end space-y-1">
          <span className="text-[11px] font-black text-registry-teal/40 uppercase tracking-widest">Encryption Level</span>
          <span className="text-[11px] font-mono uppercase tracking-widest">256-Bit Quantum Secure</span>
        </div>
      </div>
    </div>
  );

  if (showModuleIntro !== null) return (
    <div className={`fixed inset-0 z-[500] ${isDarkMode ? 'bg-stealth-950' : 'bg-slate-50'} flex flex-col items-center justify-center p-8 overflow-hidden ${isDarkMode ? 'text-white' : 'text-slate-900'} transition-colors duration-700`}>
      {/* Background Atmosphere */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${modules[showModuleIntro].color} ${isDarkMode ? 'opacity-20' : 'opacity-10'} blur-[120px]`} />
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-stealth-950/60' : 'bg-slate-50/40'}`} />
        <div className={`scanline ${isDarkMode ? 'opacity-30' : 'opacity-10'}`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </motion.div>
      
      {/* Cinematic Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%', 
              opacity: 0 
            }}
            animate={{ 
              y: [null, '-10%'], 
              opacity: [0, 0.5, 0] 
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-16 max-w-4xl w-full">
         <motion.div 
           initial={{ scale: 3, opacity: 0, rotate: -90, filter: 'blur(30px)' }}
           animate={{ scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           className={`w-32 h-32 md:w-64 md:h-64 mx-auto bg-gradient-to-br ${modules[showModuleIntro].color} rounded-[3rem] md:rounded-[5rem] flex items-center justify-center text-white shadow-[0_0_120px_rgba(34,211,238,0.5)] border border-white/20 relative group`}
         >
            {React.createElement(modules[showModuleIntro].icon, { className: "w-16 h-16 md:w-32 md:h-32 group-hover:scale-110 transition-transform duration-700" })}
            <div className="absolute -inset-6 border border-white/10 rounded-[4rem] md:rounded-[6rem] animate-ping opacity-20" />
            <div className="absolute -inset-12 border border-white/5 rounded-[5rem] md:rounded-[7rem] animate-ping opacity-10" style={{ animationDelay: '0.5s' }} />
         </motion.div>

         <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-4"
            >
              <div className={`h-[1px] w-12 ${isDarkMode ? 'bg-white/20' : 'bg-slate-300'}`} />
              <span className="text-registry-teal font-black tracking-[0.6em] uppercase text-[11px] md:text-xs">Module Access Granted</span>
              <div className={`h-[1px] w-12 ${isDarkMode ? 'bg-white/20' : 'bg-slate-300'}`} />
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: "circOut" }}
                className={`text-4xl md:text-8xl font-black italic uppercase tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
              >
                {modules[showModuleIntro].title}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className={`${isDarkMode ? 'text-slate-400' : 'text-slate-700'} text-sm md:text-xl font-medium tracking-widest uppercase italic`}
            >
              Weight: {modules[showModuleIntro].weight} of Registry
            </motion.p>
         </div>

         <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1.5 }}
           className="flex flex-col items-center space-y-8"
         >
            <button 
              onClick={() => setShowModuleIntro(null)}
              className={`px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all duration-300 shadow-xl active:scale-95 ${isDarkMode ? 'bg-white text-slate-950 hover:bg-registry-teal hover:text-white shadow-white/5' : 'bg-slate-900 text-white hover:bg-registry-teal shadow-slate-900/10'}`}
            >
              Begin Transmission
            </button>
            
            <div className="flex space-x-8">
              {modules[showModuleIntro].lessons.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-slate-300'}`} />
              ))}
            </div>
         </motion.div>
      </div>
      
      {/* Decorative Corner Elements */}
      <div className={`absolute top-12 left-12 w-24 h-24 border-t-2 border-l-2 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} />
      <div className={`absolute bottom-12 right-12 w-24 h-24 border-b-2 border-r-2 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} />
    </div>
  );

  return (
    <div className={`min-h-[100dvh] overflow-x-hidden transition-colors duration-500 ${isDarkMode ? 'bg-stealth-950 text-white' : 'bg-warm-paper text-ink-900'}`}>
      {isDarkMode && isIntroFinished && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 neural-grid opacity-[0.04]" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-registry-teal/30 to-transparent" />
        </div>
      )}
      <AnimatePresence mode="wait">
        {showCinematicIntro && (
          <CinematicIntro onComplete={handleCinematicComplete} />
        )}
      </AnimatePresence>
      <Toaster position="top-right" richColors theme={isDarkMode ? 'dark' : 'light'} />
      <AnimatePresence>
        {showLessonIntro && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[600] ${isDarkMode ? 'bg-stealth-950' : 'bg-white'} flex flex-col items-center justify-center pointer-events-none`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] ${isDarkMode ? 'bg-registry-teal/20' : 'bg-registry-teal/10'} rotate-45`} />
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] ${isDarkMode ? 'bg-registry-teal/20' : 'bg-registry-teal/10'} -rotate-45`} />
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)]'}`} />
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
            </div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 text-center space-y-10"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-[1px] w-6 bg-registry-teal/50" />
                  <span className="text-registry-teal text-[11px] font-black uppercase tracking-[1em]">Briefing Protocol</span>
                  <div className="h-[1px] w-6 bg-registry-teal/50" />
                </div>
                <div className="h-0.5 w-16 bg-registry-teal/30 rounded-full" />
              </div>
              
              <div className="overflow-hidden px-4">
                <motion.h3 
                  initial={{ y: '100%', skewY: 5 }}
                  animate={{ y: 0, skewY: 0 }}
                  transition={{ delay: 0.1, duration: 0.7, ease: "circOut" }}
                  className={`text-4xl md:text-8xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} italic uppercase tracking-tighter leading-none`}
                >
                  {curLesson?.title}
                </motion.h3>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-registry-teal animate-ping" />
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-[11px] font-black uppercase tracking-[0.4em]`}>Neural Sync in Progress...</span>
                </div>
                <div className={`w-48 h-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'} relative overflow-hidden`}>
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-registry-teal"
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {showTabIntro && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[600] ${isDarkMode ? 'bg-stealth-950' : 'bg-white'} flex flex-col items-center justify-center pointer-events-none`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-registry-teal/10 to-transparent' : 'bg-gradient-to-t from-registry-teal/5 to-transparent'}`} />
              <div className={`absolute top-0 left-0 w-full h-1 ${isDarkMode ? 'bg-registry-teal/30' : 'bg-registry-teal/20'} animate-scan`} />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative z-10 text-center px-6"
            >
              <div className="mb-6 flex items-center justify-center space-x-6">
                <div className="h-[1px] w-12 bg-registry-teal/30" />
                <span className="text-registry-teal text-[11px] font-black uppercase tracking-[1.2em] animate-pulse">Node Access</span>
                <div className="h-[1px] w-12 bg-registry-teal/30" />
              </div>
              
              <h3 className={`text-3xl md:text-6xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} italic uppercase tracking-tighter mb-8`}>
                {tabIntroTitle}
              </h3>
              
              <div className={`w-64 md:w-96 h-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'} rounded-full mx-auto overflow-hidden relative`}>
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-registry-teal shadow-[0_0_15px_rgba(0,210,255,0.8)]"
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-registry-teal/60 text-[11px] font-mono uppercase tracking-widest"
              >
                Decryption Complete // Protocol Active
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VictoryOverlay 
        isVisible={showVictory} 
        onClose={() => setShowVictory(false)} 
        title={victoryTitle} 
      />

      <SonarPulse isDarkMode={isDarkMode} />
      <div className="scanline" />
      
      <aside className={`fixed lg:flex ${isSidebarCollapsed ? 'w-20' : 'w-80'} left-0 top-0 bottom-0 ${isDarkMode ? 'bg-stealth-950/80 border-white/5 shadow-2xl' : 'bg-white/90 border-slate-200/60 shadow-premium-light'} border-r flex flex-col shrink-0 z-[150] transition-all duration-500 backdrop-blur-xl overflow-y-auto scrollbar-custom hidden`}>
        <div className="absolute inset-0 neural-grid opacity-[0.02] pointer-events-none" />
        
        {/* Diagnostic Cockpit Header */}
        <div className={`p-6 transition-all duration-500 ${isSidebarCollapsed ? 'items-center pt-8' : 'p-8 pt-10'} space-y-10 relative z-10 flex flex-col`}>
          <button 
            onClick={() => { setActiveOverlay(null); setCurrent(null); }} 
            className="flex flex-col space-y-4 w-full group focus-visible:outline-none items-center"
          >
            <div className={`transition-all duration-500 ${isSidebarCollapsed ? 'w-10 h-10 rounded-lg' : 'w-14 h-14 rounded-[1.25rem]'} bg-stealth-950 flex items-center justify-center shadow-glow group-hover:scale-110 relative overflow-hidden border border-white/10`}>
              <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/20 to-transparent opacity-50" />
              <Waves className={`text-registry-teal ${isSidebarCollapsed ? 'w-5 h-5' : 'w-7 h-7'} relative z-10 drop-shadow-glow`} />
            </div>
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic uppercase">
                  Echo<span className="text-registry-teal">Master</span>
                </h1>
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] mt-2 text-center">Registry Elite Protocol</span>
              </motion.div>
            )}
          </button>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'} hidden lg:flex items-center justify-center`}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          <nav className="w-full space-y-2 pt-6">
            {[
              { id: 'dashboard', label: 'Command Center', icon: LayoutGrid, overlay: null, index: '01' },
              { id: 'matrix', label: 'Skill Matrix', icon: Cpu, overlay: 'plan', index: '02' },
              { id: 'lab', label: 'Diagnostic Lab', icon: FlaskConical, overlay: 'lab', index: '03' },
              { id: 'cases', label: 'Clinical Cases', icon: Stethoscope, overlay: 'scenarios', index: '04' },
              { id: 'registry', label: 'Registry Path', icon: Globe, overlay: 'exam', index: '05' },
              { id: 'brainx', label: 'BrainX Talks', icon: Mic2, overlay: 'brainx', index: '06' },
              { id: 'sonography-lounge', label: 'Sonography Lounge', icon: Radio, overlay: 'sonographyLounge', index: '07' },
              { id: 'docs', label: 'Neural Lexicon', icon: Database, overlay: 'glossary', index: '08' },
              { id: 'media', label: 'Media Library', icon: Video, overlay: 'media', index: '09' },
            ].map((item) => {
              const isActive = (item.id === 'dashboard' && current === null && activeOverlay === null) || activeOverlay === item.overlay;
              return (
                <button 
                  key={item.id}
                  title={isSidebarCollapsed ? item.label : ''}
                  onClick={() => {
                    if (item.id === 'dashboard') { setActiveOverlay(null); setCurrent(null); }
                    else setActiveOverlay(item.overlay as any);
                  }} 
                  className={`w-full group relative flex items-center p-3.5 rounded-xl transition-all duration-500 overflow-visible ${
                    isActive 
                      ? 'text-stealth-950 font-black italic' 
                      : 'text-slate-500 hover:text-white transition-colors'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 bg-registry-teal rounded-xl z-0 shadow-[0_10px_30px_rgba(45,212,191,0.4)]"
                      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                    />
                  )}
                  
                  {!isSidebarCollapsed && (
                    <div className={`relative z-10 mr-4 font-mono text-[9px] font-black tracking-[0.3em] ${isActive ? 'text-stealth-950/60' : 'text-slate-700'}`}>
                      {item.index}
                    </div>
                  )}
                  
                  <div className={`relative z-10 w-5 h-5 flex items-center justify-center transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${isSidebarCollapsed ? '' : 'mr-3'}`}>
                     <item.icon className={`w-4 h-4 ${isActive ? 'text-stealth-950' : 'text-current'}`} />
                  </div>

                  {!isSidebarCollapsed && (
                    <span className={`relative z-10 text-[10px] font-black uppercase tracking-[0.3em] flex-1 text-left ${isActive ? 'text-stealth-950' : ''}`}>
                      {item.label}
                    </span>
                  )}

                  {isActive && !isSidebarCollapsed && (
                    <motion.div 
                      layoutId="sidebar-active-indicator"
                      className="absolute left-[-2rem] top-1/4 bottom-1/4 w-1.5 bg-registry-teal rounded-r shadow-glow" 
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1" />

        <div className={`p-8 pb-10 space-y-8 relative z-10 ${isSidebarCollapsed ? 'items-center' : ''}`}>
          <div className="space-y-6">
            {!isSidebarCollapsed && (
              <div className="bg-stealth-950 rounded-[2rem] p-6 text-white overflow-hidden relative border border-white/5 shadow-2xl">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-registry-teal/10 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
                 <div className="relative z-10">
                   <div className="flex justify-between items-center mb-5">
                      <span className="micro-label !opacity-60">System Tier</span>
                      <span className="text-[11px] font-black tracking-widest text-registry-teal italic">PREMIUM_V4</span>
                   </div>
                   <div className="flex items-center space-x-3 mb-6">
                      <Crown className="w-4 h-4 text-registry-amber shadow-glow" />
                      <span className="text-xs font-black uppercase tracking-widest leading-none">Level 1 Operator</span>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] font-mono opacity-40 uppercase">Synaptic XP</span>
                        <span className="text-[11px] font-mono font-black text-registry-teal leading-none">0 / 1000</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-registry-teal rounded-full w-[0%] shadow-glow" />
                      </div>
                   </div>
                 </div>
              </div>
            )}

            <div className={`p-1.5 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} rounded-2xl border flex flex-wrap items-center ${isSidebarCollapsed ? 'flex-col space-y-2' : ''}`}>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl transition-all ${isDarkMode ? 'bg-registry-teal text-stealth-950 shadow-glow' : 'text-slate-400 hover:text-slate-600'} ${isSidebarCollapsed ? 'w-full' : ''}`}
                title={isSidebarCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}
              >
                {isDarkMode ? <Moon className="w-4 h-4 shadow-glow" /> : <Sun className="w-4 h-4" />}
                {!isSidebarCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">{isDarkMode ? 'Dark' : 'Light'}</span>}
              </button>
              <button 
                onClick={() => setActiveOverlay('settings')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'} ${isSidebarCollapsed ? 'w-full' : ''}`}
                title={isSidebarCollapsed ? 'Settings' : ''}
              >
                <SettingsIcon className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">Settings</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <div className={`flex flex-col min-w-0 relative min-h-[100dvh] transition-all duration-500 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'}`}>
        <DashboardGridScroll />
        <PremiumTopBar 
          onOpenSidebar={() => setActiveOverlay('sidebar')}
          onOpenProfile={() => setActiveOverlay('profile')}
          onOpenSettings={() => setActiveOverlay('settings')}
          onClose={closeAll}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          profile={profile}
          totalCompleted={completed.size}
          activeOverlay={activeOverlay}
          current={current}
          sidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 pt-24 md:pt-40 pb-32 lg:pb-12 relative">
          <ParallaxBackground isDarkMode={isDarkMode} bgImage={bgImage} />
          <div className="max-w-[2000px] mx-auto w-full px-4 md:px-12 py-6 md:py-12 relative z-10 flex flex-col gap-6 md:gap-12 lg:gap-16">
            {/* Featured Video Transmission */}
            {!current && !activeOverlay && (
              <section className="animate-in fade-in slide-in-from-top-12 duration-1000">
                <div className="premium-glass p-8 md:p-12 rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-premium border border-registry-teal/20 relative group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(0,210,255,0.08),transparent_60%)] pointer-events-none" />
                  <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/2 space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-registry-teal/10 rounded-xl flex items-center justify-center border border-registry-teal/20">
                          <Video className="w-5 h-5 text-registry-teal" />
                        </div>
                        <span className="micro-label !text-registry-teal italic">Featured Transmission // SPI_PHYSICS_CORE</span>
                      </div>
                      <h2 className={`text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Ultrasound Physics:<br/>Essential Mastery
                      </h2>
                      <p className={`text-sm md:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed max-w-xl`}>
                        This focused session dives into the fundamental building blocks of acoustic wave behavior, specifically designed for upcoming registry candidates.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => (
                             <div key={i} className="w-8 h-8 rounded-full border-2 border-stealth-950 overflow-hidden">
                               <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Viewer" referrerPolicy="no-referrer" />
                             </div>
                           ))}
                        </div>
                        <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">+1.4k synchronized now</span>
                      </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-black aspect-video group/video">
                        <div style={{ position: 'relative', padding: '56.25% 0 0 0', width: '100%' }}>
                          <iframe 
                            src="https://viddle.in/embed/uz9LVZni/?title=true&autoplay=true&share=true&controls=true&context=true&color=blue" 
                            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%', border: 'none', overflow: 'hidden' }} 
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/40 group-hover/video:bg-transparent transition-colors duration-500">
                           <div className="flex items-center space-x-2 px-4 py-2 bg-registry-teal text-stealth-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-glow animate-pulse">
                             <Activity className="w-3 h-3" />
                             <span>Live Uplink</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {current ? (
              <>
                <div className="mb-12 md:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
                  <DiagnosticScanline />
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 md:mb-12 relative z-10 px-6 py-12 md:px-14 md:py-20 premium-glass rounded-[2rem] md:rounded-[5rem] tech-border overflow-hidden">
                    <div className="space-y-6 max-w-4xl">
                      <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2.5 h-2.5 bg-registry-teal rounded-full animate-ping shadow-glow" />
                        <span className="micro-label text-registry-teal italic font-bold">Node {current[0] + 1}.{current[1] + 1} // Active Registry Protocol</span>
                      </div>
                      <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black ${isDarkMode ? 'text-white' : 'text-ink-900'} tracking-[-0.05em] leading-[1] md:leading-[0.9] uppercase italic select-none drop-shadow-2xl break-words max-w-full`}>
                        {lessonData?.title}
                      </h2>
                      {lessonData?.narrationScript && (
                        <div className="flex flex-wrap items-center gap-6 mt-10 p-2">
                          <motion.button 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePlayLecture(lessonData.narrationScript!, curLesson!.id)}
                            disabled={isTtsLoading}
                            className={`px-10 py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] italic flex items-center space-x-4 transition-all duration-300 shadow-2xl relative overflow-hidden group ${
                              isNarrating 
                                ? 'bg-registry-teal text-stealth-950 shadow-glow ring-2 ring-registry-teal ring-offset-4 ring-offset-stealth-950' 
                                : isDarkMode 
                                  ? 'bg-registry-teal text-stealth-950 hover:bg-white shadow-glow' 
                                  : 'bg-registry-teal text-white hover:bg-registry-teal/90 shadow-glow shadow-registry-teal/40'
                            }`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            {isTtsLoading ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : isNarrating ? (
                              <VolumeX className="w-6 h-6 animate-pulse" />
                            ) : (
                              <PlayCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
                            )}
                            <span className="relative z-10">{isNarrating ? 'Cease Narration' : 'Initiate Audio Protocol'}</span>
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowTranscript(!showTranscript)}
                            className={`px-8 py-5 rounded-[1.5rem] text-xs font-bold uppercase tracking-widest flex items-center space-x-3 transition-all ${
                              showTranscript 
                                ? 'bg-registry-cobalt text-white shadow-glow' 
                                : isDarkMode 
                                  ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300/50'
                            }`}
                          >
                            <ScrollText className="w-4.5 h-4.5" />
                            <span>{showTranscript ? 'Hide Map' : 'View Script'}</span>
                          </motion.button>
                        </div>
                      )}

                      <AnimatePresence>
                        {showTranscript && lessonData?.narrationScript && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-6"
                          >
                            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-800'} italic leading-relaxed text-sm md:text-base shadow-inner`}>
                              <Quote className="w-8 h-8 text-registry-teal/20 mb-2" />
                              {lessonData.narrationScript}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                        <motion.button 
                          whileHover={{ scale: 1.02, x: -5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePrevLesson}
                          disabled={!getPrevLesson()}
                          className={`group relative px-6 py-4 rounded-xl border tech-border shadow-premium overflow-hidden transition-all ${
                            isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                          } disabled:opacity-20 flex items-center space-x-4`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-registry-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <ChevronLeft className="w-5 h-5 relative z-10 transition-transform group-hover:-translate-x-1" />
                          <div className="flex flex-col items-start relative z-10 text-left">
                        <span className="text-[11px] font-mono opacity-40 uppercase">Retreat</span>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Previous Unit</span>
                          </div>
                        </motion.button>

                        <motion.button 
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNextLesson}
                          disabled={!getNextLesson()}
                          className={`group relative px-6 py-4 rounded-xl border tech-border shadow-premium overflow-hidden transition-all ${
                            isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                          } disabled:opacity-20 flex items-center space-x-4`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-l from-registry-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex flex-col items-end relative z-10 text-right">
                            <span className="text-[11px] font-black uppercase tracking-widest opacity-50">Advance</span>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Next Unit</span>
                          </div>
                          <ChevronRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                        </motion.button>
                     </div>
                  </div>
                  <button 
                    onClick={() => setCurrent(null)}
                    className="flex items-center space-x-3 group relative pointer-events-auto"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-registry-teal/50 transition-all">
                      <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-registry-teal group-hover:-translate-x-0.5 transition-all" />
                    </div>
                    <div className="flex flex-col items-start translate-y-0.5">
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-0.5">Exit Node</span>
                      <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>Tactical Dashboard</span>
                    </div>
                  </button>
                  
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Module Progress</span>
                      <span className="text-[11px] font-black text-registry-teal italic">{Math.round(moduleProgress[curModule!.title])}%</span>
                    </div>
                    <div className={`h-1 w-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${moduleProgress[curModule!.title]}%` }}
                        className="h-full bg-registry-teal shadow-[0_0_8px_rgba(0,210,255,0.4)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-12 flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide relative z-10 px-2 mask-fade-edges">
                  {curModule!.lessons.map((lesson, idx) => {
                    const isCompleted = completed.has(lesson.id);
                    const isActive = current[1] === idx;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(current[0], idx)}
                        className={`flex-shrink-0 flex flex-col items-center min-w-[100px] p-4 rounded-2xl border-2 transition-all duration-300 ${
                          isActive 
                            ? 'bg-registry-teal/10 border-registry-teal shadow-glow scale-105' 
                            : isCompleted 
                              ? 'bg-teal-500/5 border-teal-500/20 text-teal-500 hover:border-teal-500/40' 
                              : isDarkMode ? 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20' : 'bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-400'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mb-3 ${isActive ? 'bg-registry-teal animate-pulse' : isCompleted ? 'bg-teal-500' : 'bg-current opacity-30 shadow-inner'}`} />
                        <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">Interface {idx + 1}</span>
                        <div className={`w-full h-1 mt-2 rounded-full hidden md:block ${isActive ? 'bg-registry-teal' : isCompleted ? 'bg-teal-500/40' : 'bg-slate-300 dark:bg-white/10'}`} />
                      </button>
                    );
                  })}
                </div>

                <div className="lesson-content-transition overflow-x-hidden w-full">
                  {lessonData?.content}
                  
                  {lessonData?.clinicalImages && lessonData.clinicalImages.length > 0 && (
                    <div className="mt-12 space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
                        <h5 className="text-xs font-black uppercase tracking-[0.3em] text-registry-teal flex items-center space-x-2">
                          <ImageIcon className="w-4 h-4" />
                          <span>Clinical Ultrasound Scans</span>
                        </h5>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
                        {lessonData.clinicalImages.map((img, idx) => (
                          <div key={idx} className={`rounded-2xl overflow-hidden border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-300 bg-slate-100'}`}>
                            <div className="aspect-video relative bg-black">
                              {img.url.includes('.mp4') || img.url.includes('youtube.com') || img.url.includes('vimeo.com') ? (
                                <iframe 
                                  src={img.url} 
                                  className="w-full h-full" 
                                  allow="autoplay; encrypted-media; fullscreen" 
                                  allowFullScreen 
                                />
                              ) : (
                                <img src={img.url} alt={img.caption} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              )}
                            </div>
                            <div className="p-4">
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{img.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Mobile Sticky Navigation */}
                <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center space-x-3 p-1.5 bg-stealth-900/60 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] tech-border">
                  <button 
                    onClick={handlePrevLesson}
                    disabled={!getPrevLesson()}
                    className="p-4 bg-white/5 text-white/40 border border-white/5 rounded-xl disabled:opacity-20 active:scale-90 transition-all hover:text-registry-teal hover:border-registry-teal/30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-[1px] h-6 bg-white/10" />
                  <button 
                    onClick={handleNextLesson}
                    disabled={!getNextLesson()}
                    className="p-4 bg-white/5 text-white/40 border border-white/5 rounded-xl disabled:opacity-20 active:scale-90 transition-all hover:text-registry-teal hover:border-registry-teal/30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-10 p-12 premium-glass rounded-[3.5rem] border tech-border shadow-premium relative overflow-hidden group">
                    <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
                    <div className="flex items-center space-x-8 relative z-10">
                      <div className="w-20 h-20 bg-registry-teal/10 rounded-3xl flex items-center justify-center shadow-inner border border-registry-teal/20 glow-teal group-hover:scale-105 transition-transform duration-500">
                        <Brain className="w-10 h-10 text-registry-teal drop-shadow-glow" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter">Node Progression</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-registry-teal animate-pulse" />
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Master this synaptic link to synchronize cortical pathways</p>
                        </div>
                      </div>
                    </div>

                    {!completed.has(curLesson!.id) && (
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => markComplete(curLesson!.id)}
                        className="w-full md:w-auto px-16 py-8 bg-registry-teal border-t border-white/20 text-stealth-950 rounded-[2.5rem] font-black italic uppercase text-base tracking-[0.4em] shadow-[0_20px_40px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center space-x-4 relative overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] group-hover/btn:animate-shimmer" />
                        <CheckCircle className="w-7 h-7 relative z-10" />
                        <span className="relative z-10">Synchronize Mastery</span>
                      </motion.button>
                    )}
                  </div>
                </div>

                {lessonData?.quiz && curLesson && (
                    <div className="mt-32 md:mt-48">
                      <div className="mb-16 text-center space-y-4">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="h-[1px] w-12 bg-registry-teal/30" />
                          <span className="text-[11px] font-black uppercase text-registry-teal tracking-[0.6em] italic">Knowledge Validation</span>
                          <div className="h-[1px] w-12 bg-registry-teal/30" />
                        </div>
                        <h4 className="text-3xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Module Assessment</h4>
                      </div>
                      <AdvancedQuiz question={lessonData.quiz} onComplete={() => markComplete(curLesson.id)} isDarkMode={isDarkMode} />
                    </div>
                  )}
              </>
            ) : (
                <div className="space-y-12">
                   {/* Greeting Section */}
                    <header className="flex flex-col pt-6 mb-12 relative">
                        {/* Mobile Background Flourish */}
                        <div className="absolute -top-24 -left-12 w-64 h-64 bg-registry-teal/10 rounded-full blur-[100px] pointer-events-none md:hidden" />
                        
                        <div className="space-y-6 relative z-10 w-full">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center"
                          >
                            <div className="px-4 py-1.5 bg-registry-teal/5 border border-registry-teal/20 rounded-full flex items-center space-x-2 backdrop-blur-md">
                              <div className="w-1.5 h-1.5 rounded-full bg-registry-teal animate-pulse shadow-glow" />
                              <span className="text-registry-teal text-[10px] font-black uppercase tracking-[0.4em] italic">Biometric Auth Verified</span>
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="relative"
                          >
                            <h2 className="flex flex-col text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[7rem] 2xl:text-[9rem] font-black leading-[0.8] tracking-[-0.06em] uppercase italic select-none pointer-events-none perspective-[1000px] whitespace-nowrap overflow-hidden max-w-[90vw]">
                              <span className={`${isDarkMode ? 'text-white' : 'text-slate-900'} drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all duration-700`}>Link</span>
                              <span className="text-registry-teal drop-shadow-[0_20px_80px_rgba(45,212,191,0.4)] -mt-4 md:-mt-8 lg:-mt-12 group-hover:tracking-widest transition-all duration-1000">Mastery</span>
                            </h2>

                            {/* Complex Decorative Rings */}
                            <div className="absolute -top-40 -right-40 opacity-[0.1] pointer-events-none hidden xl:block">
                               <div className="relative">
                                  <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                    className="w-[800px] h-[800px] border-[40px] border-registry-teal rounded-full border-dashed" 
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                     <motion.div 
                                       animate={{ rotate: -360 }}
                                       transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                                       className="w-[600px] h-[600px] border-[20px] border-registry-teal/40 rounded-full border-dotted" 
                                     />
                                     <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-[400px] h-[400px] border-[2px] border-registry-teal/20 rounded-full" />
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-20 gap-y-8 mt-12 pt-12 border-t-2 border-white/5 max-w-5xl relative">
                               <div className="absolute top-0 left-0 w-24 h-[2px] bg-registry-teal shadow-glow" />
                               
                               <div className="flex flex-col space-y-2">
                                  <span className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-500 italic flex items-center gap-2">
                                    <div className="w-1 h-1 bg-registry-teal rounded-full" />
                                    Identity_Hash
                                  </span>
                                  <p className={`font-mono text-sm md:text-xl uppercase tracking-[0.3em] ${isDarkMode ? 'text-white' : 'text-slate-900'} italic font-black`}>
                                    {userId?.substring(0, 12).toUpperCase() || 'STR-999-UNIT-B'}
                                  </p>
                               </div>
                               <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
                               <div className="flex flex-col space-y-2">
                                  <span className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-500 italic flex items-center gap-2">
                                    <div className="w-1 h-1 bg-registry-amber rounded-full" />
                                    Synaptic_Tier
                                  </span>
                                  <p className="font-mono text-sm md:text-xl uppercase tracking-[0.2em] text-registry-amber italic font-black">
                                    // ELITE_OPERATOR
                                  </p>
                               </div>
                               <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
                               <div className="flex flex-col space-y-2">
                                  <span className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-500 italic flex items-center gap-2">
                                    <div className="w-1 h-1 bg-registry-teal rounded-full animate-pulse" />
                                    Neural_Sync
                                  </span>
                                  <p className="font-mono text-sm md:text-xl uppercase tracking-[0.3em] text-registry-teal italic font-black">
                                    ACTIVE_CHANNEL.04
                                  </p>
                               </div>
                            </div>
                          </motion.div>
                        </div>
                      </header>

                   <div className="mb-16 md:mb-24">
                      <DashboardHUD progress={progressPercent} isDarkMode={isDarkMode} />
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 relative">
                      {/* Vertical Rail Text (SaaS Landing Style) */}
                      <div className="hidden xl:flex absolute right-[-4rem] top-0 bottom-0 flex-col items-center justify-center space-y-24 py-12 opacity-20 pointer-events-none">
                         <span className="writing-vertical-rl text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Mastery Protocol v7.4</span>
                         <div className="w-[1px] flex-1 bg-slate-400/20" />
                         <span className="writing-vertical-rl text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Neural Sync Active</span>
                      </div>

                      {/* Left Side: Major Dashboard Area */}
                      <div className="lg:col-span-8 space-y-12 md:space-y-16">
                         {/* Neural Map Centerpiece - MOVED UP */}
                         <NeuralMap modules={modules} completed={profile?.completedLessons || new Set()} isDarkMode={isDarkMode} />

                         <DailyInsight 
                           profile={profile} 
                           onUpdateProfile={handleProfileUpdate} 
                           isDarkMode={isDarkMode} 
                         />
                         <MissionCard isDarkMode={isDarkMode} onContinue={() => setCurrent([0, 0])} />
                         
                         {/* Quick Access Neural Nodes */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.button 
                              whileHover={{ y: -5 }}
                              onClick={() => setActiveOverlay('lab')}
                              className="p-8 premium-glass rounded-[2.5rem] border tech-border flex flex-col items-start space-y-6 group transition-all"
                            >
                               <div className="w-14 h-14 bg-registry-teal/10 rounded-2xl flex items-center justify-center border border-registry-teal/20 group-hover:scale-110 transition-all shadow-glow">
                                  <FlaskConical className="w-7 h-7 text-registry-teal" />
                               </div>
                               <div className="space-y-1 text-left">
                                  <h4 className="text-2xl font-black italic uppercase tracking-tighter">Diagnostic Lab</h4>
                                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">Live acoustic simulators for parameter exploration.</p>
                               </div>
                               <div className="flex items-center space-x-2 pt-2">
                                  <span className="text-[11px] font-black uppercase text-registry-teal tracking-widest">Mount Simulator</span>
                                  <ChevronRight className="w-4 h-4 text-registry-teal group-hover:translate-x-1 transition-transform" />
                               </div>
                            </motion.button>

                            <motion.button 
                              whileHover={{ y: -5 }}
                              onClick={() => setActiveOverlay('scenarios')}
                              className="p-8 premium-glass rounded-[2.5rem] border tech-border flex flex-col items-start space-y-6 group transition-all"
                            >
                               <div className="w-14 h-14 bg-registry-amber/10 rounded-2xl flex items-center justify-center border border-registry-amber/20 group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                                  <Zap className="w-7 h-7 text-registry-amber" />
                                </div>
                                <div className="space-y-1 text-left">
                                   <h4 className="text-2xl font-black italic uppercase tracking-tighter">Clinical Cases</h4>
                                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">50+ Ultrasound scenarios with AI insights.</p>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                   <span className="text-[11px] font-black uppercase text-registry-amber tracking-widest">Initialize Cases</span>
                                   <ChevronRight className="w-4 h-4 text-registry-amber group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.button>
                         </div>
                         
                         {/* Neural Analytics Section */}
                         <StudyAnalytics 
                           profile={profile}
                           moduleBreakdown={moduleProgress} 
                           activityHistory={profile?.activityHistory || []} 
                           isDarkMode={isDarkMode}
                         />

                         {/* Dynamic Synced Media Section */}
                         {syncedVisuals.length > 0 && (
                           <section className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
                              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                                 <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                       <div className="w-2 h-2 bg-registry-teal rounded-full animate-pulse shadow-glow" />
                                       <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-registry-teal italic leading-none">Synchronized Archives</h4>
                                    </div>
                                    <h3 className={`text-4xl md:text-5xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-none`}>Recent Study Nodes</h3>
                                 </div>
                                 <button 
                                   onClick={() => setActiveOverlay('media')}
                                   className="px-6 py-3 rounded-full border border-registry-teal/20 text-registry-teal text-[10px] font-black uppercase tracking-widest hover:bg-registry-teal/10 transition-all active:scale-95 flex items-center space-x-2"
                                 >
                                   <span>Explorer Full Vault</span>
                                   <ChevronRight className="w-4 h-4" />
                                 </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                 {[...syncedVisuals].reverse().slice(0, 3).map((visual, idx) => (
                                    <motion.div 
                                      key={visual.id}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: idx * 0.1 }}
                                      whileHover={{ y: -8 }}
                                      className={`group p-6 rounded-[2.5rem] border tech-border relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white shadow-premium hover:shadow-2xl'}`}
                                    >
                                       <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                       
                                       <div className="relative z-10 space-y-6 flex flex-col h-full">
                                          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                                             <img 
                                               src={visual.imageUrl} 
                                               alt={visual.title} 
                                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                               referrerPolicy="no-referrer"
                                             />
                                             <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                                <span className="text-[10px] font-black text-registry-teal uppercase tracking-widest">{visual.category}</span>
                                             </div>
                                             <button 
                                               onClick={() => setActiveVisualOverlay(visual)}
                                               className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]"
                                             >
                                                <div className="px-6 py-2.5 bg-registry-teal text-stealth-950 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-glow">Access Tile</div>
                                             </button>
                                          </div>

                                          <div className="space-y-2 flex-1">
                                             <h5 className={`text-xl font-black italic uppercase tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{visual.title}</h5>
                                             <p className="text-[11px] font-medium opacity-60 leading-relaxed italic line-clamp-2">"{visual.description}"</p>
                                          </div>

                                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                             <div className="flex items-center space-x-2">
                                                <Activity className="w-3.5 h-3.5 text-registry-teal" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live_Sync</span>
                                             </div>
                                             <button 
                                               onClick={() => setActiveVisualOverlay(visual)}
                                               className="text-registry-teal hover:text-white transition-colors"
                                             >
                                               <ChevronRight className="w-5 h-5" />
                                             </button>
                                          </div>
                                       </div>

                                       {/* Serial hardware accent */}
                                       <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-600 uppercase tracking-tighter tabular-nums opacity-40">NODE.{visual.id.substring(visual.id.length - 4)}</div>
                                    </motion.div>
                                 ))}
                                 
                                 {syncedVisuals.length > 3 && (
                                   <motion.button 
                                     whileHover={{ scale: 1.02 }}
                                     onClick={() => setActiveOverlay('media')}
                                     className={`p-6 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center space-y-4 group transition-all h-full min-h-[300px] ${isDarkMode ? 'border-white/10 hover:border-registry-teal/40 hover:bg-registry-teal/5' : 'border-slate-200 hover:border-registry-teal/40 hover:bg-slate-50'}`}
                                   >
                                      <div className="w-12 h-12 bg-registry-teal/10 rounded-2xl flex items-center justify-center border border-registry-teal/20 group-hover:scale-110 transition-transform">
                                         <Library className="w-6 h-6 text-registry-teal" />
                                      </div>
                                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 group-hover:text-registry-teal transition-colors">+{syncedVisuals.length - 3} More Studies</span>
                                   </motion.button>
                                 )}
                              </div>
                           </section>
                         )}
                      </div>

                      {/* Right Side: Operations Side Panel */}
                      <div className="lg:col-span-4 space-y-6 md:space-y-10">
                          <SystemBroadcastMonitor isDarkMode={isDarkMode} />
                          <div className="grid grid-cols-2 gap-4 md:gap-6">
                             <div className="premium-glass bg-opacity-40 border-2 tech-border rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 flex items-center justify-between shadow-premium relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-registry-amber/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {/* Micro hardware screws */}
                                <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-white/20 rounded-full" />
                                <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-white/20 rounded-full" />
                                <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white/20 rounded-full" />
                                <div className="absolute bottom-2 right-2 w-0.5 h-0.5 bg-white/20 rounded-full" />
                                
                                <div className="flex items-center space-x-3 md:space-x-4 relative z-10">
                                   <div className="w-8 h-8 md:w-12 md:h-12 bg-registry-amber rounded-xl flex items-center justify-center shadow-lg shadow-registry-amber/20 group-hover:rotate-12 transition-transform border border-white/20">
                                      <Coins className="text-stealth-950 w-4 h-4 md:w-6 md:h-6" />
                                   </div>
                                   <div className="flex flex-col">
                                     <span className={`text-xl md:text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'} leading-none`}>12.4k</span>
                                     <span className="text-[11px] text-slate-500 uppercase font-black tracking-widest mt-1">Reserve_Units</span>
                                   </div>
                                </div>
                             </div>
                             <div className="bg-stealth-950 border-2 border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 flex items-center justify-between shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-registry-amber/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {/* Status indicators */}
                                <div className="absolute top-3 right-3 flex space-x-1">
                                   <div className="w-1 h-3 bg-registry-amber/40 rounded-full" />
                                   <div className="w-1 h-3 bg-registry-amber rounded-full animate-pulse" />
                                </div>
                                
                                <div className="flex items-center space-x-3 md:space-x-4 relative z-10">
                                   <div className="w-8 h-8 md:w-12 md:h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                     <Flame className="text-registry-amber w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                                   </div>
                                   <div className="flex flex-col">
                                     <span className="text-xl md:text-3xl font-black italic text-white tracking-tighter leading-none">7 DAY</span>
                                     <span className="text-[11px] text-white/40 uppercase font-black tracking-widest leading-none mt-1 italic">Synaptic_Loop</span>
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="premium-glass bg-opacity-40 border tech-border rounded-[3.5rem] p-12 flex flex-col shadow-premium min-h-[300px] relative overflow-hidden">
                             <div className="absolute inset-0 neural-grid opacity-[0.05] pointer-events-none" />
                             <div className="flex items-center space-x-4 mb-8 relative z-10">
                                <Trophy className="text-registry-amber w-8 h-8 drop-shadow-glow" />
                                <h4 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>Recent Badges</h4>
                             </div>
                             <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50 px-6 relative z-10">
                                <p className="text-[11px] font-black text-slate-500 italic uppercase tracking-widest">Awaiting First Synchronous Mastery</p>
                             </div>
                          </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      <StudyAnalytics 
                         profile={profile}
                         moduleBreakdown={moduleProgress} 
                         activityHistory={profile?.activityHistory}
                         isDarkMode={isDarkMode} 
                       />
                      <section className="space-y-6 flex flex-col h-full premium-glass bg-opacity-40 rounded-[3rem] p-10 border tech-border shadow-premium relative overflow-hidden">
                         <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
                         <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center space-x-4">
                               <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/20 glow-teal">
                                <ScrollText className="w-6 h-6 text-registry-teal" />
                               </div>
                               <h4 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>Script Vault</h4>
                            </div>
                            <span className="text-[11px] font-black text-registry-teal bg-registry-teal/10 px-5 py-2 rounded-full uppercase tracking-widest leading-none border border-registry-teal/20">{(profile?.scriptVault || []).length} Nodes</span>
                         </div>
                         <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-4 scrollbar-hide relative z-10">
                            {(!profile || !profile.scriptVault || profile.scriptVault.length === 0) ? (
                              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-10">
                                 <div className="p-4 bg-slate-500/10 rounded-full mb-4">
                                   <Lock className="w-8 h-8 text-slate-500" />
                                 </div>
                                 <p className="text-[11px] font-black uppercase tracking-widest">Vault is empty</p>
                              </div>
                            ) : (
                              profile.scriptVault.map((s: any) => (
                                <div key={s.id} className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300'} p-6 rounded-[2.5rem] border hover:border-registry-teal/30 transition-all group`}>
                                   <h5 className={`font-black uppercase text-[11px] ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-3 tracking-widest group-hover:text-registry-teal transition-colors`}>{s.title}</h5>
                                   <p className="text-sm font-medium opacity-60 leading-relaxed italic line-clamp-3">"{s.content}"</p>
                                </div>
                              ))
                            )}
                         </div>
                      </section>
                      <LiveStudioCard isDarkMode={isDarkMode} onClick={() => setActiveOverlay('live')} />
                   </div>
                </div>
            )}
          </div>
          <NeuralLoad data={neuralLoadData} isDarkMode={isDarkMode} />
          <Achievements progress={progressPercent} isDarkMode={isDarkMode} profile={profile} />
        </main>

        <AudioPlayer 
          isPlaying={isNarrating} 
          isLoading={isTtsLoading} 
          onToggle={toggleAudio} 
          onStop={stopAudio} 
          analyser={analyserRef.current}
          title={lessonData?.title || "Registry Study Pulse"}
          isDarkMode={isDarkMode}
        />

        <motion.button 
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveOverlay('radio')}
          className="fixed bottom-28 right-4 lg:bottom-10 lg:right-10 w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-slate-100 z-[450] group"
        >
          <div className="relative">
             <div className="absolute inset-0 bg-slate-100 rounded-full animate-ping opacity-20" />
             <Radio className="w-5 h-5 md:w-6 md:h-6 text-slate-800 relative z-10 group-hover:text-registry-teal transition-colors" />
          </div>
        </motion.button>

        {/* Mobile Navigation Bar */}
        <nav className={`fixed bottom-0 left-0 right-0 z-[400] lg:hidden backdrop-blur-[40px] border-t px-6 py-4 pb-8 flex justify-around items-center transition-all duration-300 shadow-[0_-15px_40px_rgba(0,0,0,0.1)] md:rounded-t-[3rem] ${isDarkMode ? 'bg-stealth-950/90 border-white/5 text-white shadow-black/40' : 'bg-white/95 border-slate-200/60 text-slate-900 shadow-slate-200/40'}`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-registry-teal/30 to-transparent" />
          
          {[
            { id: 'dash', label: 'HUD', icon: LayoutGrid, active: !current && !activeOverlay, onClick: () => {setCurrent(null); setActiveOverlay(null);} },
            { id: 'study', label: 'SYNC', icon: GraduationCap, active: !!current && !activeOverlay, onClick: () => {setActiveOverlay(null); if(!current) setCurrent([0,0]);} },
            { id: 'lab', label: 'LAB', icon: FlaskConical, active: activeOverlay === 'lab', onClick: () => setActiveOverlay('lab') },
            { id: 'exam', label: 'EXAM', icon: Trophy, active: activeOverlay === 'exam', onClick: () => setActiveOverlay('exam') },
            { id: 'menu', label: 'MENU', icon: Menu, active: activeOverlay === 'sidebar', onClick: () => setActiveOverlay(activeOverlay === 'sidebar' ? null : 'sidebar') }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={item.onClick} 
              className={`flex flex-col items-center justify-center w-20 h-14 rounded-3xl transition-all relative group ${
                item.active 
                  ? 'text-registry-teal' 
                  : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.active && (
                <motion.div 
                  layoutId="mobile-nav-bg"
                  className="absolute inset-x-0 inset-y-1 bg-registry-teal/10 rounded-2xl md:rounded-3xl"
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-registry-teal shadow-glow" />
                </motion.div>
              )}

              <div className={`transition-all duration-500 relative z-10 ${item.active ? 'scale-110 -translate-y-1.5' : 'group-active:scale-90 group-hover:scale-110'}`}>
                <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.active ? 'drop-shadow-glow' : ''}`} />
              </div>

              <span className={`text-[11px] font-black uppercase tracking-[0.3em] mt-1.5 transition-all duration-300 relative z-10 ${item.active ? 'text-registry-teal scale-105' : 'text-current opacity-40'}`}>
                {item.label}
              </span>
              
              {item.active && (
                <motion.div 
                  layoutId="mobile-nav-dot"
                  className="absolute -bottom-1 w-1 h-1 bg-registry-teal rounded-full shadow-glow" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Overlays / Drawers */}
        <AnimatePresence>
          {activeOverlay === 'plan' && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[120] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setActiveOverlay(null)} />
              <div className="relative w-full max-w-4xl h-[90vh] md:h-full md:max-h-[800px] overflow-hidden rounded-[2.5rem] shadow-2xl bg-white dark:bg-stealth-950">
                <StudyPlan 
                  profile={profile} 
                  completed={completed}
                  onClose={() => setActiveOverlay(null)} 
                  onUpdateProfile={handleProfileUpdate}
                  onPlayNarration={() => handlePlayLecture(staticNarrationScripts.plan, 'plan')}
                  isNarrating={isNarrating}
                  isTtsLoading={isTtsLoading}
                  isDarkMode={isDarkMode}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'sidebar' && (
            <div className="fixed inset-0 z-[120] flex justify-start">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveOverlay(null)}
                className="absolute inset-0 bg-stealth-950/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="relative h-full w-full md:w-[420px] shadow-2xl"
              >
                <div className={`h-full flex flex-col border-r transition-colors duration-500 ${isDarkMode ? 'bg-stealth-950/95 border-white/5 shadow-2xl shadow-black' : 'bg-white/98 border-slate-200/60 shadow-premium'} backdrop-blur-3xl`}>
                   <header className={`p-6 md:p-10 border-b flex justify-between items-center relative overflow-hidden ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                      <div className="absolute inset-0 scanline opacity-10" />
                      <div className="flex items-center space-x-5 relative z-10">
                         <div className="p-4 bg-registry-teal/10 rounded-3xl glow-teal">
                           <Activity className="w-7 h-7 text-registry-teal" />
                         </div>
                         <div>
                           <h4 className={`font-black italic uppercase text-2xl tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Registry Nodes</h4>
                           <p className="text-[11px] font-black uppercase tracking-[0.4em] text-registry-teal mt-2">SYSTEM SCAN ACTIVE</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setActiveOverlay(null)} 
                        className={`group flex items-center space-x-3 px-5 py-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-opacity group-hover:opacity-100 ${isDarkMode ? 'text-white opacity-40' : 'text-slate-500 opacity-60'}`}>Close</span>
                        <X className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                      </button>
                   </header>
                   <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 md:space-y-12 scrollbar-custom">
                      <div className="space-y-8">
                      <h4 className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.5em] px-2 flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-registry-teal shadow-glow" />
                        <span>Strategic Protocols</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, overlay: null, isHome: true },
                          { id: 'admin', label: 'Admin Panel', icon: Shield, overlay: 'admin' },
                          { id: 'plan', label: 'Strategic Plan', icon: Calendar, overlay: 'plan' },
                          { id: 'exam', label: 'Mock Exam', icon: Trophy, overlay: 'exam' },
                          { id: 'quest', label: 'Neural Quests', icon: Sword, overlay: 'quest' },
                          { id: 'radio', label: 'Neural Radio', icon: Music, overlay: 'radio' },
                          { id: 'tutor', label: 'Harvey AI Tutor', icon: Cpu, overlay: 'tutor' },
                          { id: 'podcast', label: 'Physics Podcast', icon: Radio, overlay: 'podcast' },
                          { id: 'lounge', label: 'Sono Lounge', icon: Headphones, overlay: 'sonographyLounge' },
                          { id: 'flashcards', label: 'Neural Flashcards', icon: Layers, overlay: 'flashcards' },
                          { id: 'glossary', label: 'Physics Lexicon', icon: Book, overlay: 'glossary' },
                        ].map((item) => {
                          const isActive = (item.isHome && current === null && activeOverlay === null) || activeOverlay === item.overlay;
                          return (
                            <button 
                              key={item.id}
                              onClick={() => {
                                if (item.isHome) { setActiveOverlay(null); setCurrent(null); }
                                else if (item.id === 'admin') {
                                  setActiveOverlay(null);
                                  setShowAdminDashboard(true);
                                }
                                else setActiveOverlay(item.overlay as any);
                              }} 
                              className={`flex flex-col items-center justify-center p-6 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all border ${isActive ? 'bg-registry-teal/10 text-registry-teal border-registry-teal/30 shadow-glow' : isDarkMode ? 'bg-stealth-950/40 text-slate-500 border-white/5 hover:border-white/20' : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400 shadow-sm'}`}
                            >
                              <item.icon className={`w-7 h-7 mb-4 transition-transform group-hover:scale-110 ${isActive ? 'text-registry-teal' : 'text-slate-400'}`} />
                              <span className="text-center leading-tight">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h4 className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.5em] px-2 flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-registry-rose shadow-glow" />
                        <span>Curriculum Map</span>
                      </h4>
                      <div className="space-y-10">
                        {modules.map((m, mIdx) => (
                          <div key={mIdx} className="space-y-4">
                            <div className={`flex items-center space-x-5 p-5 rounded-[2rem] bg-gradient-to-br ${m.color} text-white shadow-xl border border-white/20`}>
                               <div className="p-2.5 bg-white/20 rounded-xl">
                                 <m.icon className="w-5 h-5 flex-shrink-0" />
                               </div>
                               <h3 className="font-black text-sm uppercase truncate tracking-widest">{m.title}</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2.5 pl-4">
                              {m.lessons.map((l, lIdx) => {
                                const isSelected = current?.[0] === mIdx && current?.[1] === lIdx;
                                const isDone = completed.has(l.id);
                                return (
                                  <button key={lIdx} onClick={() => { setActiveOverlay(null); handleLessonSelect(mIdx, lIdx); }} 
                                    className={`w-full text-left p-4 rounded-2xl text-[11px] font-black uppercase transition-all flex items-center justify-between group border ${isSelected ? 'bg-registry-teal/10 text-registry-teal border-registry-teal/30 shadow-glow' : isDarkMode ? 'text-slate-400 border-transparent hover:bg-white/5 hover:border-white/5' : 'text-slate-900 border-transparent hover:bg-slate-100 hover:border-slate-200'}`}>
                                    <span className="truncate tracking-tighter italic">{l.title}</span>
                                    {isDone ? (
                                      <CheckCircle className="w-5 h-5 text-registry-teal shadow-glow" />
                                    ) : (
                                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isSelected ? 'bg-registry-teal shadow-glow' : 'bg-slate-300 dark:bg-stealth-800'}`} />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
                 <footer className={`p-10 border-t tech-border bg-opacity-50 transition-colors ${isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-slate-100 border-slate-300'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Topology Sync State</span>
                      <span className="text-sm font-mono font-black text-registry-teal">98.4%</span>
                    </div>
                    <div className={`h-2 w-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '98.4%' }}
                        className="h-full bg-registry-teal shadow-glow" 
                       />
                    </div>
                 </footer>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'tutor' && (
            <div className="fixed inset-0 z-[120] flex justify-end">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveOverlay(null)}
                className="absolute inset-0 bg-stealth-950/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 150 }}
                className="relative w-full lg:w-[480px] 2xl:w-[600px] h-full shadow-2xl"
              >
                <AITutor 
                  currentContext={lessonData?.title || 'Registry Mastery'} 
                  onClose={() => setActiveOverlay(null)} 
                  onVault={vaultScript} 
                  isDarkMode={isDarkMode} 
                  onPlayNarration={handlePlayLecture}
                  isNarrating={isNarrating}
                  isTtsLoading={isTtsLoading}
                  profile={profile}
                  onUpdateProfile={handleProfileUpdate}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'flashcards' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-12"
            >
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => { setActiveOverlay(null); setFlashcardModule(null); }} />
              <div className="relative w-full max-w-4xl h-full max-h-[800px]">
                <Flashcards 
                  modules={modules} 
                  onClose={() => { setActiveOverlay(null); setFlashcardModule(null); }} 
                  onPlayNarration={() => handlePlayLecture(staticNarrationScripts.flashcards, 'flashcards')}
                  isNarrating={isNarrating}
                  isTtsLoading={isTtsLoading}
                  isDarkMode={isDarkMode}
                  initialModule={flashcardModule}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'glossary' && (
            <motion.div 
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-12"
            >
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setActiveOverlay(null)} />
              <div className="relative w-full max-w-4xl h-full max-h-[800px]">
                <Glossary 
                  onClose={() => setActiveOverlay(null)} 
                  onPlayNarration={() => handlePlayLecture(staticNarrationScripts.glossary, 'glossary')}
                  isNarrating={isNarrating}
                  isTtsLoading={isTtsLoading}
                  isDarkMode={isDarkMode}
                  profile={profile}
                  onUpdateProfile={handleProfileUpdate}
                  onNavigateToLesson={handleNavigateToLesson}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'profile' && (
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 150 }}
              className="fixed inset-y-0 right-0 z-[120] w-full lg:w-[480px]"
            >
              <UserProfile 
                profile={profile} 
                onUpdate={handleProfileUpdate} 
                onClose={() => setActiveOverlay(null)} 
                onPlayNarration={() => handlePlayLecture(staticNarrationScripts.profile, 'profile')}
                isNarrating={isNarrating}
                isTtsLoading={isTtsLoading}
                onOpenReminders={() => setActiveOverlay('reminders')}
                streak={streak}
                totalCompleted={completed.size}
                modules={modules}
                lessonContent={lessonContent}
                userId={userId}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'legal' && (
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 150 }}
              className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-12"
            >
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setActiveOverlay(null)} />
              <div className="relative w-full max-w-5xl h-full max-h-[850px] rounded-[3rem] overflow-hidden shadow-2xl">
                <LegalDocs 
                  onClose={() => setActiveOverlay(null)} 
                  onPlayNarration={() => handlePlayLecture(staticNarrationScripts.legal, 'legal')}
                  isNarrating={isNarrating}
                  isTtsLoading={isTtsLoading}
                  isDarkMode={isDarkMode}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {activeOverlay === 'reminders' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-[130] flex items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setActiveOverlay(null)} />
              <div className="relative w-full max-w-md">
                <Reminders 
                  onClose={() => setActiveOverlay(null)} 
                  onPlayNarration={() => handlePlayLecture(staticNarrationScripts.reminders, 'reminders')}
                  isNarrating={isNarrating}
                  isTtsLoading={isTtsLoading}
                  isDarkMode={isDarkMode}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAssetLibrary && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none"
            >
              <div className="w-full h-[90vh] md:h-[80vh] max-w-7xl mx-auto pointer-events-auto shadow-2xl rounded-t-[3rem] overflow-hidden border-t border-white/10">
                <AssetLibrary 
                  userId="shared" 
                  isDarkMode={isDarkMode} 
                  onClose={() => setShowAssetLibrary(false)}
                  onSelect={(asset) => {
                    setBgImage(asset.data || null);
                    setShowAssetLibrary(false);
                  }}
                  modules={modules}
                  onAttachToLesson={handleAttachToLesson}
                  lexiconTerms={SPI_GLOSSARY}
                  onAttachToLexicon={handleAttachToLexicon}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'exam' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-[140] flex items-center justify-center p-0"
            >
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setActiveOverlay(null)} />
              <div className="relative w-full h-full md:max-w-6xl md:h-[90dvh] md:rounded-[3rem] overflow-hidden shadow-2xl">
                <ExamEngine 
                  profile={profile}
                  isDarkMode={isDarkMode}
                  onComplete={(results) => {
                    console.log("Exam completed:", results);
                    
                    // Save to user profile history
                    const updatedHistory = [...(profile?.examHistory || []), results];
                    handleProfileUpdate({ examHistory: updatedHistory });

                    if (results.passed) {
                      toast.success("Registry Qualified! You've mastered the AI Registry Simulation.");
                    } else {
                      toast.error("Study Required. Review your results to identify weak topics.");
                    }
                  }}
                  onClose={() => setActiveOverlay(null)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'lab' && (
            <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="fixed inset-0 z-[150] flex items-center justify-center lg:p-12"
            >
               <div className="absolute inset-0 bg-stealth-950/90 backdrop-blur-3xl" onClick={() => setActiveOverlay(null)} />
               <div className="relative w-full h-full max-w-7xl lg:rounded-[4rem] overflow-hidden shadow-premium border border-white/10">
                  <RegistryLab onClose={() => setActiveOverlay(null)} isDarkMode={isDarkMode} />
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'scenarios' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-[150] flex items-center justify-center p-0 lg:p-12"
            >
              <div className="absolute inset-0 bg-stealth-950/90 backdrop-blur-3xl" onClick={() => setActiveOverlay(null)} />
              <div className="relative w-full h-full max-w-7xl lg:rounded-[3rem] overflow-hidden shadow-premium border border-white/10 bg-slate-950">
                <div className="absolute top-8 right-8 z-[160]">
                   <button 
                     onClick={() => setActiveOverlay(null)}
                     className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl backdrop-blur-md"
                   >
                     <X className="w-5 h-5" />
                   </button>
                </div>
                <ScenarioSim 
                  isDarkMode={isDarkMode} 
                  profile={profile}
                  onUpdateProfile={handleProfileUpdate}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'pricing' && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[150] bg-white dark:bg-slate-950"
            >
              <Pricing onClose={() => setActiveOverlay(null)} isDarkMode={isDarkMode} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'radio' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12"
            >
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-stealth-950/90' : 'bg-slate-900/40'} backdrop-blur-2xl`} onClick={() => setActiveOverlay(null)} />
              <div className={`relative w-full max-w-4xl h-full max-h-[800px] rounded-[3rem] overflow-hidden shadow-2xl border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <GlobalRadio onClose={() => setActiveOverlay(null)} isDarkMode={isDarkMode} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'podcast' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12"
            >
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setActiveOverlay(null)} />
              <PodcastDemo 
                onClose={() => setActiveOverlay(null)} 
                isDarkMode={isDarkMode} 
              />
            </motion.div>
          )}

          {activeOverlay === 'sonographyLounge' && (
            <SonographyLounge 
              onClose={() => setActiveOverlay(null)} 
              isDarkMode={isDarkMode} 
            />
          )}

          {activeOverlay === 'brainx' && (
            <BrainXTalks 
              onClose={() => setActiveOverlay(null)} 
              isDarkMode={isDarkMode} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'media' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12"
            >
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setActiveOverlay(null)} />
              <MediaLibrary 
                onClose={() => setActiveOverlay(null)} 
                isDarkMode={isDarkMode} 
                onPlayNarration={handlePlayLecture}
                isNarrating={isNarrating}
                isTtsLoading={isTtsLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Visual Detail Overlay (Sync with Dashboard) */}
        <AnimatePresence>
          {activeVisualOverlay && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-12">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveVisualOverlay(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className={`relative w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row border border-white/10 ${isDarkMode ? 'bg-stealth-950 shadow-2xl shadow-black' : 'bg-white shadow-premium'}`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-registry-teal shadow-glow z-20" />
                
                <button 
                  onClick={() => setActiveVisualOverlay(null)}
                  className="absolute top-6 right-6 p-4 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all z-30 backdrop-blur-md border border-white/10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex-1 bg-black flex items-center justify-center p-6 relative group">
                  <img 
                    src={activeVisualOverlay.imageUrl} 
                    alt={activeVisualOverlay.title} 
                    className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Digital Overlays on Image */}
                  <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-registry-teal/40 pointer-events-none" />
                  <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-registry-teal/40 pointer-events-none" />
                </div>

                <div className="w-full md:w-[450px] p-10 flex flex-col overflow-y-auto scrollbar-hide border-l border-white/5 relative">
                  <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/20 glow-teal">
                        <Database className="w-5 h-5 text-registry-teal" />
                      </div>
                      <span className="text-registry-teal text-[10px] font-black uppercase tracking-[0.4em] italic mt-1">Telemetry Record</span>
                    </div>
                  </div>
                  
                  <h3 className={`text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activeVisualOverlay.title}
                  </h3>

                  <div className="space-y-8 flex-1 relative z-10">
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Metadata Analysis</h5>
                      <p className={`text-sm md:text-base font-medium leading-relaxed italic ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {activeVisualOverlay.description}
                      </p>
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-6">
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                         <div className="flex items-center space-x-3">
                            <Activity className="w-4 h-4 text-registry-teal" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-registry-teal">Registry Protocol Index</span>
                         </div>
                         <p className="text-[11px] font-medium opacity-60 leading-relaxed italic">
                           Cross-referencing with {activeVisualOverlay.category} physics modules. Validation score: 98.4% Confidence. Original ID: {activeVisualOverlay.id}
                         </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 space-y-4 relative z-10">
                    <button 
                      onClick={() => setActiveVisualOverlay(null)}
                      className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs border transition-all active:scale-95 ${isDarkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-900 hover:bg-slate-50'}`}
                    >
                      Return to Command Center
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'live' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12"
            >
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setActiveOverlay(null)} />
              <LiveSuite 
                onClose={() => setActiveOverlay(null)} 
                isDarkMode={isDarkMode}
                userName={profile?.name || 'Sonographer'}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'quest' && (
            <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed inset-0 z-[200] bg-white dark:bg-stealth-950"
            >
               <QuestSystem onClose={() => setActiveOverlay(null)} isDarkMode={isDarkMode} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showOnboarding && (
            <OnboardingTour 
              onClose={handleOnboardingClose}
              onPlayNarration={handlePlayLecture}
              isNarrating={isNarrating}
              isTtsLoading={isTtsLoading}
              isDarkMode={isDarkMode}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAdminDashboard && (
            <AdminDashboard 
              onClose={() => setShowAdminDashboard(false)} 
              isDarkMode={isDarkMode} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeOverlay === 'settings' && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[200] w-full lg:w-[500px] shadow-2xl"
            >
              <Settings 
                onClose={() => setActiveOverlay(null)} 
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                currentTheme={currentTheme}
                setCurrentTheme={setCurrentTheme}
                themes={themes}
                profile={profile}
                onUpdateProfile={handleProfileUpdate}
                onCacheAll={handleCacheAll}
                isCachingAll={isCachingAll}
                cachingProgress={cachingProgress}
                cachedCount={cachedLessons.size}
                totalCount={modules.reduce((acc, m) => acc + m.lessons.length, 0) + Object.keys(staticNarrationScripts).length + SPI_GLOSSARY.length}
                onOpenAssetLibrary={() => setShowAssetLibrary(true)}
                onOpenAdminDashboard={() => {
                  setActiveOverlay(null);
                  setShowAdminDashboard(true);
                }}
                onRestartOnboarding={() => {
                  setActiveOverlay(null);
                  setShowOnboarding(true);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        .lesson-content-transition { animation: lesson-slide 0.6s cubic-bezier(0.2, 0, 0, 1) forwards; }
        @keyframes lesson-slide { 
          from { opacity: 0; transform: translateY(20px); filter: blur(10px); } 
          to { opacity: 1; transform: translateY(0); filter: blur(0); } 
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes stenosis-particle { 0% { transform: translateX(-20px); } 100% { transform: translateX(420px); } }
        .animate-stenosis-particle { animation: stenosis-particle 1s linear infinite; }
        @keyframes bubble-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .animate-bubble-pulse { animation: bubble-pulse 1s ease-in-out infinite; }
        
        /* Mobile specific touch styles */
        @media (max-width: 768px) {
          .perspective-2000 { perspective: 1000px; }
          button, input, select { -webkit-tap-highlight-color: transparent; }
        }
      `}</style>
    </div>
  );
};
export default App;